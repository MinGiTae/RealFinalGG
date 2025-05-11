def analyze_environmental_aspects(images: list) -> list:
    results = []
    reasons = []

    # 사전 준비 (예시 기준)
    detected_texts = [img.get('detection_summary', '').lower() for img in images]
    material_keywords = ['concrete', 'wood', 'metal', 'plastic']
    has_detection = any(detected_texts)
    image_count = len(images)

    # 1. 환경측면을 파악하기 위한 주관 부서 존재 여부
    dept_info_exists = any('department' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(dept_info_exists)
    reasons.append('부서 정보가 존재합니다.' if dept_info_exists else '부서 정보가 누락되었습니다.')

    # 2. 환경영향조사표 및 등록부 정리 여부
    survey_exists = any('impact_survey' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(survey_exists)
    reasons.append('영향조사표 및 등록부가 확인되었습니다.' if survey_exists else '영향조사표 및 등록부가 확인되지 않았습니다.')

    # 3. 환경영향 누락 여부 (detected object 기반)
    critical_found = any(any(k in text for k in material_keywords) for text in detected_texts)
    results.append(critical_found)
    reasons.append('중요 자재가 인식되었습니다.' if critical_found else '중요 자재 인식이 없습니다.')

    # 4. 중요성 평가 기준 준수 여부 (샘플: 파일명 패턴 기반)
    importance_evaluated = any('priority' in img.get('filename', '').lower() for img in images)
    results.append(importance_evaluated)
    reasons.append('중요성 평가 관련 파일이 존재합니다.' if importance_evaluated else '중요성 평가 관련 자료가 없습니다.')

    # 5. 최신 자료 유지 여부 (등록일자 기반 최신성 체크)
    from datetime import datetime, timedelta
    now = datetime.now()
    recent_exists = any((now - img.get('created_at', now)).days <= 30 for img in images)
    results.append(recent_exists)
    reasons.append('최근 30일 내 자료가 존재합니다.' if recent_exists else '최신 자료가 없습니다.')

    # 6. 활동 식별 및 절차 수립 여부 (metadata.tags 기반)
    activity_procedures = any('procedure' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(activity_procedures)
    reasons.append('활동 및 절차가 식별되었습니다.' if activity_procedures else '활동 및 절차 정보가 없습니다.')

    # 7. 외주업체 및 계약자 요구사항 전달 여부 (contractor 태그)
    contractor_comm = any('contractor' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(contractor_comm)
    reasons.append('계약자 요구사항 전달 내역이 확인됩니다.' if contractor_comm else '계약자 요구사항 전달 내역이 없습니다.')

    # 8. 운영 기준 명시 여부 (standard 태그)
    has_standards = any('standard' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(has_standards)
    reasons.append('운영 기준이 명시되어 있습니다.' if has_standards else '운영 기준이 누락되었습니다.')

    # 9. 환경특성 모니터링 여부 (monitoring 태그)
    monitoring_found = any('monitoring' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(monitoring_found)
    reasons.append('모니터링 데이터가 존재합니다.' if monitoring_found else '모니터링 데이터가 없습니다.')

    # 10. 측정 장비 교정 및 검증 여부 (calibration 태그)
    calibration_done = any('calibration' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(calibration_done)
    reasons.append('장비 교정 및 검증 이력이 있습니다.' if calibration_done else '장비 교정 및 검증 이력이 없습니다.')

    # 11. 법적 기준 만족 여부 (detection 기반)
    compliant_detected = any('hazard' not in text for text in detected_texts)
    results.append(compliant_detected)
    reasons.append('법적 기준을 만족하는 항목이 확인됩니다.' if compliant_detected else '법적 기준을 위반하는 항목이 검출되었습니다.')

    # 12. 장비 이력 기록 여부 (equipment_log 태그)
    equipment_logged = any('equipment_log' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(equipment_logged)
    reasons.append('장비 이력 기록이 확인됩니다.' if equipment_logged else '장비 이력 기록이 없습니다.')

    # 13. 기록물 작성 여부 (document 태그)
    has_documents = any('document' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(has_documents)
    reasons.append('기록물이 작성되어 있습니다.' if has_documents else '기록물이 작성되지 않았습니다.')

    # 14. 기록물 식별 및 관리 여부 (record_management 태그)
    record_management = any('record_management' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(record_management)
    reasons.append('기록물 식별 및 관리 내역이 확인됩니다.' if record_management else '기록물 식별 및 관리 내역이 없습니다.')

    # 15. 기록물 추적 가능 여부 (traceability 태그)
    traceable = any('traceability' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(traceable)
    reasons.append('기록물의 추적이 가능합니다.' if traceable else '기록물 추적 내역이 없습니다.')

    # 16. 시스템 준수 여부 (system_compliance 태그)
    system_compliance = any('system_compliance' in img.get('metadata', {}).get('tags', []) for img in images)
    results.append(system_compliance)
    reasons.append('시스템 준수 기록이 확인됩니다.' if system_compliance else '시스템 준수 기록이 없습니다.')

    return results, reasons
