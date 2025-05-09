# services/predict_yolo.py

import os
import cv2
from ultralytics import YOLO

def run_yolo_and_save_result(input_img_path, save_dir, save_name):
    """
    YOLOv8 모델을 이용해 input_img_path의 이미지를 분석하고,
    분석 결과 이미지를 save_dir/save_name 경로에 저장합니다.

    Returns:
    - result_img_path (str): 저장된 결과 이미지 상대 경로
    - label_counts (dict): 탐지된 객체별 개수
    """

    model_path = "runs/detect/train_codd_final7/weights/best.pt"
    if not os.path.exists(model_path):
        print(f"[YOLO❌] 모델 파일 없음: {model_path}")
        return None, {}

    model = YOLO(model_path)

    try:
        results = model.predict(
            source=input_img_path,
            save=False,
            save_txt=False,
            save_conf=True
        )
    except Exception as e:
        print(f"[YOLO❌] 예측 실패: {e}")
        return None, {}

    os.makedirs(save_dir, exist_ok=True)
    result_img_path = os.path.join(save_dir, save_name)

    # 이미지 시각화 및 저장
    for r in results:
        plotted = r.plot()
        cv2.imwrite(result_img_path, plotted)
        print(f"[YOLO✅] 저장 완료: {result_img_path}, 객체 수: {len(r.boxes)}")

    # 박스가 없으면 빈 dict
    label_counts = {}
    if hasattr(results[0], 'boxes') and results[0].boxes:
        for box in results[0].boxes:
            cls = int(box.cls)
            label = results[0].names[cls]
            label_counts[label] = label_counts.get(label, 0) + 1
    else:
        print("[YOLO⚠️] 탐지된 객체 없음")

    print("[YOLO] 클래스별 개수:", label_counts)
    return result_img_path, label_counts
