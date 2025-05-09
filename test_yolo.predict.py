import os
from collections import Counter

# 라벨 폴더 경로 설정 (train 기준으로)
label_path = r"C:/Users/minhw/GarbageGuard/CODD_ready/labels/train"

# 클래스 카운트용 객체
class_counter = Counter()

# 모든 라벨 파일을 순회하며 클래스 ID 수집
for label_file in os.listdir(label_path):
    if label_file.endswith(".txt"):
        with open(os.path.join(label_path, label_file), "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():  # 빈 줄 제외
                    class_id = line.strip().split()[0]
                    class_counter[int(class_id)] += 1

# 클래스 이름 목록
class_names = [
    "brick", "concrete", "foam", "general_w", "gypsum_board",
    "pipes", "plastic", "stone", "tile", "wood"
]

# 결과 출력
print("📊 클래스별 객체 수 (train set 기준):")
for class_id in range(len(class_names)):
    count = class_counter[class_id]
    print(f"{class_id:2d} | {class_names[class_id]:13} | {count:5d}개")
