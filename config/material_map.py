# 📄 건설 자재 → 폐기물 분류 및 순환골재 재활용 정보 설정
#
# ✅ 목적:
# 이 파일은 이미지 또는 자재 입력을 기반으로 건설폐기물의 분류 및 재활용 가능 여부를 판별하기 위한 기준 데이터를 제공합니다.
# AI 탐지 시스템 및 통계 분석, 순환골재 활용 보고서 자동화 등 실무에 적용 가능한 기초 정보로 사용됩니다.
#
# ✅ 포함 기능:
# 1. 사용자 입력 자재명 → 표준 한글 자재명 정규화
# 2. 표준 자재명에 따른 폐기물 분류명, 폐기물관리법 기준 코드, 재활용 가능 여부 제공
# 3. 순환골재로 재활용 가능한 자재 목록 및 활용 용도 정의
#
# 📚 공신력 있는 참고 자료:
# - 환경부 「폐기물관리법 시행규칙」 별표 1의2 (건설폐기물 분류코드)
#   https://www.law.go.kr/lsInfoP.do?lsiSeq=206193&viewCls=lsRvsDocInfoR#0000
# - 국토교통부 고시 제2010-397호: 순환골재 의무사용 건설공사의 용도 및 사용비율
#   https://www.molit.go.kr/USR/I0204/m_45/dtl.jsp?idx=7109
# - 한국순환골재협회: 순환골재 품질기준 및 재활용 사례
#   https://kraa.or.kr/27
# - 한국환경공단 올바로시스템: 건설폐기물 처리정보
#   https://www.allbaro.or.kr
#
# 🏢 활용 예시:
# - 재활용 가능 자재만 필터링하여 탄소 저감 보고서 작성
# - YOLO 탐지 결과에서 자재별 폐기물 유형 및 코드 자동 분류
# - 순환골재 적용 시뮬레이션 및 시각화 (도로 보조기층 등)

# ✅ 사용자 입력 → 표준 자재명 정규화 매핑
MATERIAL_ALIASES = {
    # 벽돌
    "brick":   "벽돌", "bricks":  "벽돌", "bricks ": "벽돌", " wall":
               "벽돌", "벽돌":    "벽돌",

    # 콘크리트
    "concrete":    "콘크리트", "concretes":  "콘크리트", "콘크리트": "콘크리트",

    # 스티로폼
    "foam":    "스티로폼", "foams":    "스티로폼", "스티로폼": "스티로폼",

    # 잡자재 (general waste)
    "general_w":    "잡자재", "general_ws":   "잡자재", "general_waste": "잡자재", "잡자재": "잡자재",

    # 석고보드
    "gypsum board": "석고보드", "gypsumboards": "석고보드", "석고보드": "석고보드",

    # 파이프
    "pipe":    "파이프", "pipes":     "파이프", "pipess":   "파이프", "파이프": "파이프",

    # 플라스틱
    "plastic": "플라스틱", "plastics":  "플라스틱", "플라스틱": "플라스틱",

    # 석재
    "stone":   "석재", "stones":   "석재", "돌":     "석재", "석재": "석재",

    # 타일
    "tile":    "타일", "tiles":    "타일", "타일":   "타일",

    # 목재
    "wood":    "목재", "woods":    "목재", "나무":   "목재", "목재": "목재"
}

# ✅ 표준 자재명 → 폐기물 분류 정보
# "code"는 폐기물관리법 시행규칙 별표 1의2에 따른 국가 공인 폐기물 분류코드입니다.
# "recyclable"은 국토부 고시 및 순환골재협회 기준에 따른 순환골재 활용 가능 여부를 뜻합니다.
MATERIAL_TO_WASTE = {
    "벽돌": {
        "type": "폐벽돌",
        "code": "17-01-02",
        "recyclable": True
    },
    "콘크리트": {
        "type": "폐콘크리트",
        "code": "17-01-01",
        "recyclable": True
    },
    "스티로폼": {
        "type": "폐합성수지",
        "code": "17-02-03",
        "recyclable": False
    },
    "잡자재": {
        "type": "혼합건설폐기물",
        "code": "17-09-04",
        "recyclable": False
    },
    "석고보드": {
        "type": "폐보드류",
        "code": "17-08-02",
        "recyclable": False
    },
    "파이프": {
        "type": "폐금속류",
        "code": "17-04-05",
        "recyclable": False
    },
    "플라스틱": {
        "type": "폐합성수지",
        "code": "17-02-03",
        "recyclable": False
    },
    "석재": {
        "type": "폐석재",
        "code": "17-01-07",
        "recyclable": False
    },
    "타일": {
        "type": "폐타일 및 폐도자기",
        "code": "17-01-03",
        "recyclable": False
    },
    "목재": {
        "type": "폐목재",
        "code": "17-02-01",
        "recyclable": False
    }
}

# ✅ 순환골재로 재활용 가능한 자재별 활용 용도
# - 출처: 국토교통부 고시 제2010-397호 및 한국순환골재협회 기준
# - 실제 적용 예: 도로공사 보조기층, 성토용, 복토재, 되메우기재 등
RECYCLABLE_USAGES = {
    "콘크리트": ["도로 보조기층", "매립시설 복토", "성토 및 복토용", "되메우기재", "순환 아스콘 원료"],
    "벽돌":     ["성토 및 복토용", "되메우기 및 뒷채움용", "매립지 복토", "골재 대체재"],
    "아스팔트": ["도로 포장용 순환 아스팔트 콘크리트 원료", "보조기층재", "동상방지층", "도로 유지보수용 골재"]
}

# ✅ 헬퍼 함수들

def normalize_material_name(raw_name: str) -> str | None:
    """사용자 입력 자재명을 표준 자재명(한글)으로 정규화"""
    return MATERIAL_ALIASES.get(raw_name.strip().lower())

def get_waste_info(material: str) -> dict | None:
    """
    자재명에 대한 폐기물 정보 반환
    반환값 예시: {'type': '폐콘크리트', 'code': '17-01-01', 'recyclable': True}
    """
    return MATERIAL_TO_WASTE.get(material)

def is_recyclable(material: str) -> bool:
    """해당 자재가 순환골재로 재활용 가능한지 여부"""
    info = get_waste_info(material)
    return info.get("recyclable", False) if info else False

def get_recyclable_materials() -> list[str]:
    """전체 자재 중 재활용 가능한 자재명 리스트"""
    return [m for m, info in MATERIAL_TO_WASTE.items() if info["recyclable"]]

def get_recyclable_usage(material: str) -> list[str]:
    """순환골재로 활용 가능한 자재의 적용 용도 반환"""
    return RECYCLABLE_USAGES.get(material, [])
