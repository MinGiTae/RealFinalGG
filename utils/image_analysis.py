from ultralytics import YOLO
import os
import glob
import uuid

def analyze_image(filepath):
    model = YOLO("runs/detect/train_codd_final7/weights/best.pt")
    unique_id = str(uuid.uuid4())[:8]
    save_dir = os.path.join("runs", "detect", f"predict_{unique_id}")

    results = model.predict(source=filepath, save=True, project="runs/detect", name=f"predict_{unique_id}")

    # 결과 이미지 자동 탐색
    result_images = glob.glob(os.path.join(save_dir, "*.jpg")) + glob.glob(os.path.join(save_dir, "*.png"))
    if not result_images:
        raise FileNotFoundError("탐지 결과 이미지 없음")

    result_img_path = result_images[0]

    # 웹에서 접근 가능한 상대경로 생성
    rel_path = os.path.relpath(result_img_path, 'runs/detect').replace("\\", "/")

    # 탐지된 클래스 라벨 추출
    boxes = results[0].boxes
    classes = set(int(box.cls) for box in boxes)
    labels = [results[0].names[i] for i in classes]

    return rel_path, labels
