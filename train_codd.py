from ultralytics import YOLO

# ✅ 사전 학습된 경량 모델 로드 (필요시 yolov8s.pt, yolov8m.pt 로 바꿔도 됨)
model = YOLO("yolov8n.pt")

# ✅ 학습 시작
model.train(
    data="codd.yaml",         # yaml 설정 파일
    epochs=50,                # 학습 epoch 수
    imgsz=640,                # 이미지 입력 사이즈
    batch=16,                 # 배치 사이즈
    name="train_codd_final",  # 저장 폴더 이름
    device=0                  # ✅ GPU 사용!
)
