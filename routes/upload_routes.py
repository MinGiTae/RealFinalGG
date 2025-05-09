# routes/upload_routes.py
# =====================
# Flask Blueprint for GarbageGuard 프로젝트: 폐기물 처리 페이지
# 주요 기능:
# 1) 이미지 업로드 및 YOLO 예측 → 탐지 결과 매핑 → 화면 렌더링
# 2) 탐지된 객체(raw label) → 표준명 한글 변환, 폐기물 정보(type, code, recyclable) 부여
# 3) 탄소 배출량 계산 (kg CO₂)
# 4) “저장” 버튼 클릭 시에만 DB에 사진·객체·폐기 관리 정보 저장
# 5) 월별 통계 JSON 제공

from flask import Blueprint, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime, date
import os

# DB 관리 함수들
from db.db_manager import (
    get_all_companies,
    get_all_sites,
    get_company_by_id,
    get_site_id_by_name,
    get_site_by_id,
    get_object_id_by_name,
    insert_waste_photo,
    insert_photo_object,
    insert_waste_management,
    get_detection_summary,
    get_monthly_stats
)
# YOLO 예측 서비스
from services.predict_yolo import run_yolo_and_save_result
# 자재명 매핑 및 폐기물 정보
from config.material_map import normalize_material_name, get_waste_info
# 탄소 계산 유틸
from utils.calculate_carbon import estimate_carbon_info

upload_bp = Blueprint('upload_bp', __name__)

# --------------------------------------------------
# 1. 결과 이미지 서빙
# --------------------------------------------------
@upload_bp.route('/result/<path:subpath>')
def result_file(subpath):
    base = os.path.join(os.getcwd(), 'runs', 'detect')
    return send_from_directory(base, subpath)

# --------------------------------------------------
# 파일 업로드 설정
# --------------------------------------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

# --------------------------------------------------
# 2. 폐기물 처리 메인 페이지 (탐지만 수행, DB 저장은 하지 않음)
# --------------------------------------------------
@upload_bp.route('/waste_disposal', methods=['GET', 'POST'])
def waste_disposal():
    # (1) 기업/현장 목록 조회
    company_list = get_all_companies()
    site_list    = get_all_sites()

    # (2) 파라미터 사전 설정
    pre_site_id = request.values.get('site_id','').strip()
    pre_date    = request.values.get('site_date','').strip() or date.today().isoformat()
    result_img  = request.values.get('result_img','').strip() or None

    # site_name → site_id 변환
    if not pre_site_id:
        name = request.values.get('site_name','').strip()
        if name:
            sid = get_site_id_by_name(name)
            pre_site_id = str(sid) if sid else ''

    # (3) 현장 정보 세팅
    pre_company_id = pre_company_name = pre_site_name = ''
    if pre_site_id.isdigit():
        si = get_site_by_id(int(pre_site_id))
        if si:
            pre_site_name    = si['site_name']
            pre_company_id   = si['company_id']
            comp = get_company_by_id(pre_company_id)
            pre_company_name = comp['company_name'] if comp else ''

    # (4) 이전에 저장된 summary 불러오기 (DB 조회)
    detected_objects = {}
    if result_img and pre_site_id.isdigit():
        summary = get_detection_summary(int(pre_site_id), os.path.basename(result_img))
        if summary:
            for part in summary.split(','):
                lbl, cnt = part.strip().split(' ')
                detected_objects[lbl] = int(cnt.replace('개',''))

    # (5) POST → 파일 업로드 & YOLO 예측
    if request.method == 'POST':
        file  = request.files.get('photo')
        fsid  = request.form.get('site_id','').strip()
        fdate = request.form.get('site_date','').strip()
        if fsid:
            pre_site_id = fsid
        if fdate:
            pre_date    = fdate

        # 현장 정보 재조회
        if pre_site_id.isdigit():
            si = get_site_by_id(int(pre_site_id))
            if si:
                pre_site_name    = si['site_name']
                pre_company_id   = si['company_id']
                comp             = get_company_by_id(pre_company_id)
                pre_company_name = comp['company_name'] if comp else ''

        # 업로드 및 YOLO 실행
        if file and allowed_file(file.filename) and pre_site_name:
            fn          = secure_filename(file.filename)
            upload_path = os.path.join(UPLOAD_FOLDER, fn)
            file.save(upload_path)

            folder   = pre_site_name.replace(' ','_')
            save_dir = os.path.join('runs','detect', folder)
            os.makedirs(save_dir, exist_ok=True)
            save_name = f"{folder}_{pre_date}.jpg"

            result_img, detected_objects = run_yolo_and_save_result(
                input_img_path = upload_path,
                save_dir       = save_dir,
                save_name      = save_name
            )
            if result_img:
                result_img = f"{folder}/{save_name}"

    # (6) 탐지 결과 매핑 및 탄소 계산
    detections = []
    for raw, cnt in detected_objects.items():
        std      = normalize_material_name(raw) or raw
        info     = get_waste_info(std) or {}
        weight   = cnt * 100  # 개당 100kg 가정
        carb_dic = estimate_carbon_info(std, weight)
        print(f"[DEBUG] material={std}, weight_kg={weight}, carbon_kg={carb_dic.get('carbon_kg')}")
        detections.append({
            'raw'       : raw,
            'name'      : std,
            'type'      : info.get('type',''),
            'code'      : info.get('code',''),
            'recyclable': info.get('recyclable', False),
            'count'     : cnt,
            'carbon'    : carb_dic.get('carbon_kg', 0)
        })

    # (7) 화면 렌더
    return render_template(
        'GG_002_waste_disposal.html',
        company_list           = company_list,
        site_list              = site_list,
        result_img             = result_img,
        detected_objects_dict  = detected_objects,
        detected_detailed      = detections,
        prefilled_company_id   = pre_company_id,
        prefilled_company_name = pre_company_name,
        prefilled_site_id      = pre_site_id,
        prefilled_site_name    = pre_site_name,
        prefilled_date         = pre_date,
        **{'site_id': pre_site_id}
    )

# --------------------------------------------------
# 4. 분석 결과 DB 저장 엔드포인트
#    (“저장” 버튼 클릭 시에만 호출됨)
# --------------------------------------------------
@upload_bp.route('/save_result', methods=['POST'])
def save_result():
    data       = request.get_json() or {}
    company_id = data.get('company_id')
    site_id    = data.get('site_id')
    site_name  = data.get('site_name','').strip()
    date_str   = data.get('site_date','').strip()
    result_img = data.get('result_img','').strip()
    detected   = data.get('detected', {})

    # 필수 항목 검증
    if not all([company_id, site_id, site_name, date_str, result_img, detected]):
        return jsonify({'message':'❌ 누락된 정보'}), 400

    # 현장 유효성 검사
    si = get_site_by_id(int(site_id))
    if not si or str(si['company_id']) != str(company_id):
        return jsonify({'message':'❌ 잘못된 현장'}), 400

    # 대표 객체 선택
    try:
        main_raw = max(detected, key=detected.get)
    except ValueError:
        return jsonify({'message':'❌ 객체 없음'}), 400

    main_std = normalize_material_name(main_raw) or main_raw
    winfo    = get_waste_info(main_std) or {}
    obj_id   = get_object_id_by_name(main_raw)
    fn       = os.path.basename(result_img)

    try:
        # 4-1) waste_photos 저장 → photo_id 반환
        photo_id = insert_waste_photo(
            site_id           = si['site_id'],
            object_id         = obj_id,
            image_filename    = fn,
            detection_summary = ', '.join(f"{k} {v}개" for k, v in detected.items()),
            uploaded_at       = datetime.strptime(date_str, '%Y-%m-%d')
        )
        # 4-2) waste_photo_objects 저장
        for raw, cnt in detected.items():
            pid = get_object_id_by_name(raw)
            insert_photo_object(photo_id, pid, cnt)

        # 4-3) 총 탄소 계산
        total_c = sum(
            estimate_carbon_info(
                normalize_material_name(r) or r,
                c * 100
            )['carbon_kg']
            for r, c in detected.items()
        )
        print(f"[DEBUG] total_carbon = {total_c}")

        # 4-4) waste_management 저장 (추가 인자 포함)
        insert_waste_management(
            site_id         = si['site_id'],
            waste_type      = main_raw,
            waste_amount    = detected[main_raw],
            carbon_emission = round(total_c, 2),
            disposal_date   = date_str,
            waste_category  = winfo.get('type',     ''),
            waste_code      = winfo.get('code',     ''),
            recyclable      = winfo.get('recyclable', False)
        )

        return jsonify({'message':'✅ 저장 완료!'})
    except Exception as e:
        print('[DB❌]', e)
        return jsonify({'message':'❌ 저장 실패'}), 500

# --------------------------------------------------
# 5. 월별 배출량 통계 JSON 제공
# --------------------------------------------------
@upload_bp.route('/monthly_stats', methods=['GET'])
def waste_monthly_stats():
    sid  = request.args.get('site_id', type=int)
    rows = get_monthly_stats(sid)
    result = [
        {'month': r['month'], 'total_waste': r['total_waste'], 'total_emission': r['total_emission']}
        for r in rows
    ]
    return jsonify(result)
