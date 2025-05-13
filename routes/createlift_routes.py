# routes/createlift_routes.py

from flask import Blueprint, render_template, request, jsonify, send_file
from db.db_manager import (
    get_all_companies,
    get_sites_by_company,
    get_site_id_by_name,
    get_site_info,
    get_site_by_id,
    get_images_for_site,
    insert_audit_session,
    insert_audit_result,
    create_audit_report_excel
)
from services.analyze_environmental import analyze_environmental_aspects

# Blueprint 정의: '/createlift' 프리픽스 사용
createlift_bp = Blueprint('createlift', __name__, url_prefix='/createlift')

# ───────────────────────────────────────────────────
# 1) 회사/현장 선택 페이지
#    → /createlift/ 또는 /createlift/Create_lift
# ───────────────────────────────────────────────────
@createlift_bp.route('/', methods=['GET'])
@createlift_bp.route('/Create_lift', methods=['GET'])
def show_createlift():
    companies = get_all_companies()
    return render_template('GG_006_createlift.html', companies=companies)

# ───────────────────────────────────────────────────
# 2) AJAX: 회사명 → 현장 리스트
# ───────────────────────────────────────────────────
@createlift_bp.route('/search-site')
def search_site():
    company_name = request.args.get('keyword', '')
    sites = get_sites_by_company(company_name)
    return jsonify([{"site_name": s} for s in sites])

# ───────────────────────────────────────────────────
# 3) AJAX: 현장 선택 → 자동 감사 실행 + DB 저장
# ───────────────────────────────────────────────────
@createlift_bp.route('/select-site', methods=['POST'])
def select_site():
    company_name = request.form['company_name']
    site_name    = request.form['site_name']

    # 1) 현장 ID 및 정보 조회
    site_id    = get_site_id_by_name(site_name)
    site_info  = get_site_info(company_name, site_name)
    site_rec   = get_site_by_id(site_id)
    company_id = site_rec['company_id']

    # 2) 이미지 목록 조회
    images = get_images_for_site(company_name, site_name)

    # 3) 파일 경로 키 매핑 (원본 키도 유지)
    site_info['survey_file']      = site_info.get('survey_file_path')
    site_info['procedure_file']   = site_info.get('procedure_file_path')
    site_info['standard_file']    = site_info.get('standard_file_path')
    site_info['monitoring_file']  = site_info.get('monitoring_data_path')
    site_info['calibration_file'] = site_info.get('calibration_file_path')

    # 디버그 출력
    print("[DEBUG] site_info:")
    for k, v in site_info.items():
        print(f"    {k}: {v}")
    print(f"[DEBUG] images: {images}")

    # 4) ISO 자동 판정
    iso_checks, iso_reasons = analyze_environmental_aspects(images, site_info)

    # 5) 감사 세션 및 결과 저장
    session_id = insert_audit_session(company_id, site_id, performed_by='system')
    for idx, passed in enumerate(iso_checks, start=1):
        insert_audit_result(session_id, 'ISO', idx, passed, iso_reasons[idx-1])

    # 6) 결과 반환
    return jsonify({
        'actual_results': iso_checks,
        'reasons':        iso_reasons
    })

# ───────────────────────────────────────────────────
# 4) 엑셀 다운로드
# ───────────────────────────────────────────────────
@createlift_bp.route('/download-audit-excel')
def download_audit_excel():
    company_name = request.args.get('company_name', '')
    site_name    = request.args.get('site_name', '')

    buf = create_audit_report_excel(company_name, site_name)
    filename = f"{company_name}_{site_name}_감사리포트.xlsx"

    return send_file(
        buf,
        as_attachment=True,
        download_name=filename,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
