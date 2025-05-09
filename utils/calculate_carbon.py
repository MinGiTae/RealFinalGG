from config.material_map import (
    MATERIAL_ALIASES,
    MATERIAL_TO_WASTE,
    get_waste_info,
    is_recyclable,
    get_recyclable_usage
)
from config.carbon_factors import CARBON_EMISSION_FACTORS


def estimate_carbon_info(material_input: str, amount_kg: float) -> dict:
    """
    자재명과 사용량을 바탕으로 탄소 배출량과 폐기물 정보, 재활용 여부까지 통합 반환합니다.

    :param material_input: str - 입력 자재명 (예: "wood", "콘크리트")
    :param amount_kg: float - 사용량 (kg)
    :return: dict {
        'normalized': 정규화된 자재명,
        'carbon_kg': 탄소 배출량 (kg CO₂),
        'waste_type': 폐기물 유형명,
        'waste_code': 폐기물 분류코드,
        'recyclable': 순환골재 재활용 가능 여부 (bool),
        'recyclable_usage': 사용 가능한 경우 순환골재 활용 용도 리스트
    }
    """

    # 1. 정규화
    normalized = MATERIAL_ALIASES.get(material_input.strip().lower())
    if not normalized:
        raise ValueError(f"'{material_input}'은(는) 등록되지 않은 자재입니다.")

    # 2. 탄소 배출량 계산
    factor = CARBON_EMISSION_FACTORS.get(normalized)
    if factor is None:
        raise ValueError(f"'{normalized}' 자재의 탄소 배출계수가 정의되어 있지 않습니다.")
    emission = round(amount_kg * factor, 3)

    # 3. 폐기물 정보
    waste_info = get_waste_info(normalized)
    if not waste_info:
        raise ValueError(f"'{normalized}' 자재에 대한 폐기물 정보가 누락되어 있습니다.")

    return {
        "normalized":      normalized,
        "carbon_kg":       emission,
        "waste_type":      waste_info["type"],
        "waste_code":      waste_info["code"],
        "recyclable":      waste_info["recyclable"],
        "recyclable_usage": get_recyclable_usage(normalized) if waste_info["recyclable"] else []
    }
