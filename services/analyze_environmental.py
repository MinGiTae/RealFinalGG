from datetime import datetime
from typing import List, Dict, Tuple

def analyze_environmental_aspects(images: List[Dict], site_info: Dict) -> Tuple[List[bool], List[str]]:
    results = []
    reasons = []

    # site_info 값들
    department      = (site_info.get('department') or '').strip()
    importance      = (site_info.get('importance_level') or '').strip().lower()
    contractor_notes= (site_info.get('contractor_notes') or '').strip()
    calibration_date= site_info.get('calibration_date')

    now = datetime.now()

    # 이미지 분석용 데이터
    texts          = [img.get('detection_summary','').lower() for img in images]
    uploaded_dates = [img.get('uploaded_at', now) for img in images]

    # 1) 주관 부서
    ok = bool(department)
    results.append(ok)
    reasons.append('주관 부서가 설정되었습니다.' if ok else '주관 부서가 누락되었습니다.')

    # 2) 영향조사표/등록부 (site_info 파일 존재 여부로 판단)
    survey = site_info.get('survey_file') or site_info.get('survey_file_path')
    ok = bool(survey)
    results.append(ok)
    reasons.append('영향조사표/등록부가 확인되었습니다.' if ok else '영향조사표/등록부가 없습니다.')

    # 3) 중요 자재 (이미지 텍스트)
    material_keywords = ['벽돌','목재','타일','콘크리트','금속','플라스틱']
    ok = any(any(kw in text for kw in material_keywords) for text in texts)
    results.append(ok)
    reasons.append('중요 자재가 인식되었습니다.' if ok else '중요 자재 인식이 없습니다.')

    # 4) 중요도 평가 (선택값 또는 파일)
    #    * 별도 파일 필드가 있다면 site_info 에 추가해 주세요.
    ok = importance in ['high','medium','low']
    results.append(ok)
    reasons.append('중요성 평가가 존재합니다.' if ok else '중요성 평가가 누락되었습니다.')

    # 5) 최근 30일 자료 (이미지 업로드 날짜)
    ok = any((now - d).days <= 30 for d in uploaded_dates)
    results.append(ok)
    reasons.append('최근 30일 내 자료가 존재합니다.' if ok else '최신 자료가 없습니다.')

    # 6) 절차 문서 (site_info 파일)
    proc = site_info.get('procedure_file') or site_info.get('procedure_file_path')
    ok = bool(proc)
    results.append(ok)
    reasons.append('절차 문서가 업로드되었습니다.' if ok else '절차 문서가 없습니다.')

    # 7) 계약자 메모
    ok = bool(contractor_notes)
    results.append(ok)
    reasons.append('계약자 메모가 작성되었습니다.' if ok else '계약자 메모가 없습니다.')

    # 8) 운영 기준 문서 (site_info 파일)
    std = site_info.get('standard_file') or site_info.get('standard_file_path')
    ok = bool(std)
    results.append(ok)
    reasons.append('운영 기준 문서가 있습니다.' if ok else '운영 기준 문서가 없습니다.')

    # 9) 모니터링 데이터 (site_info 파일)
    mon = site_info.get('monitoring_file') or site_info.get('monitoring_data_path')
    ok = bool(mon)
    results.append(ok)
    reasons.append('모니터링 데이터가 확인됩니다.' if ok else '모니터링 데이터가 없습니다.')

    # 10) 교정일자 (1년 이내)
    calibration_valid = False
    if calibration_date and str(calibration_date).lower() not in ['none','null','']:
        try:
            if isinstance(calibration_date, datetime):
                cal = calibration_date
            else:
                cal = datetime.strptime(calibration_date, '%Y-%m-%d')
            calibration_valid = (now - cal).days <= 365
        except:
            calibration_valid = False
    results.append(calibration_valid)
    reasons.append('교정일자가 유효합니다.' if calibration_valid else '교정일자가 없거나 오래되었습니다.')

    return results, reasons
