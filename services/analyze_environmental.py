from datetime import datetime
from typing import List, Dict, Tuple

def analyze_environmental_aspects(images: List[Dict], site_info: Dict) -> Tuple[List[bool], List[str]]:
    results = []
    reasons = []

    # site_info 값들
    department = site_info.get('department', '').strip()
    importance = (site_info.get('importance_level') or '').strip().lower()
    contractor_notes = site_info.get('contractor_notes', '').strip()
    calibration_date = site_info.get('calibration_date')

    now = datetime.now()

    # 이미지 데이터 전처리
    texts = [img.get('detection_summary', '').lower() for img in images]
    filenames = [img.get('image_filename', '').lower() for img in images]
    uploaded_dates = [img.get('uploaded_at', now) for img in images]

    # 주관 부서 체크
    results.append(bool(department))
    reasons.append('주관 부서가 설정되었습니다.' if department else '주관 부서가 누락되었습니다.')

    # 영향조사표 / 등록부 체크
    results.append(any('impact' in f or '등록부' in f for f in filenames))
    reasons.append('영향조사표/등록부가 확인되었습니다.' if results[-1] else '영향조사표/등록부가 없습니다.')

    # 중요 자재 체크
    material_keywords = ['벽돌', '목재', '타일', '콘크리트', '금속', '플라스틱']
    material_found = any(any(kw in text for kw in material_keywords) for text in texts)
    results.append(material_found)
    reasons.append('중요 자재가 인식되었습니다.' if material_found else '중요 자재 인식이 없습니다.')

    # 중요성 평가 체크
    priority_file_found = any('priority' in f for f in filenames) or importance in ['high', 'medium', 'low']
    results.append(priority_file_found)
    reasons.append('중요성 평가가 존재합니다.' if priority_file_found else '중요성 평가가 누락되었습니다.')

    # 최근 30일 자료 체크
    recent_data_found = any((now - up_date).days <= 30 for up_date in uploaded_dates)
    results.append(recent_data_found)
    reasons.append('최근 30일 내 자료가 존재합니다.' if recent_data_found else '최신 자료가 없습니다.')

    # 절차 문서 체크
    procedure_file_found = any('procedure' in f for f in filenames)
    results.append(procedure_file_found)
    reasons.append('절차 문서가 업로드되었습니다.' if procedure_file_found else '절차 문서가 없습니다.')

    # 계약자 메모 체크
    contractor_found = bool(contractor_notes)
    results.append(contractor_found)
    reasons.append('계약자 메모가 작성되었습니다.' if contractor_found else '계약자 메모가 없습니다.')

    # 운영 기준 문서 체크
    standard_file_found = any('standard' in f for f in filenames)
    results.append(standard_file_found)
    reasons.append('운영 기준 문서가 있습니다.' if standard_file_found else '운영 기준 문서가 없습니다.')

    # 모니터링 데이터 체크
    monitoring_file_found = any('monitoring' in f for f in filenames)
    results.append(monitoring_file_found)
    reasons.append('모니터링 데이터가 확인됩니다.' if monitoring_file_found else '모니터링 데이터가 없습니다.')

    # 교정일자 체크
    calibration_valid = False
    if calibration_date and str(calibration_date).lower() not in ['none', 'null', '']:
        try:
            if isinstance(calibration_date, datetime):
                cal_date = calibration_date
            else:
                cal_date = datetime.strptime(calibration_date, '%Y-%m-%d')
            calibration_valid = (now - cal_date).days <= 365
        except Exception:
            calibration_valid = False
    results.append(calibration_valid)
    reasons.append('교정일자가 유효합니다.' if calibration_valid else '교정일자가 없거나 오래되었습니다.')

    return results, reasons
