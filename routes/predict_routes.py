# routes/predict_routes.py
from flask import Blueprint, request, jsonify
from config.material_map import MATERIAL_ALIASES, MATERIAL_TO_WASTE

# 🔧 Blueprint 선언
predict_bp = Blueprint('predict_bp', __name__)

# 🔍 자재 → 폐기물 예측 API
@predict_bp.route('/predict/material', methods=['POST'])
def predict_waste():
    data = request.get_json()
    material_input = data.get('material', '').strip().lower()
    amount = float(data.get('amount', 0))

    normalized = MATERIAL_ALIASES.get(material_input)

    if not normalized:
        return jsonify({"error": f"'{material_input}' 자재는 등록되어 있지 않습니다."}), 400

    mapping = MATERIAL_TO_WASTE[normalized]
    predicted_kg = amount * mapping['factor']

    return jsonify({
        "material": material_input,
        "normalized": normalized,
        "waste_type": mapping["type"],
        "amount": amount,
        "predicted_kg": predicted_kg
    })
