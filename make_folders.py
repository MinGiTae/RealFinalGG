# import os
#
# # 만들고자 하는 폴더 목록
# folders = [
#     'test_images',                   # 테스트 이미지 넣는 폴더
#     'runs/detect/predict_test',      # 추론 결과 저장될 폴더
#     'uploads',                       # 웹 연동 시 이미지 업로드 폴더
#     'static/results'                 # Flask에서 결과 이미지 보여주는 용도
# ]
#
# for folder in folders:
#     os.makedirs(folder, exist_ok=True)
#     print(f'✅ 폴더 생성됨: {folder}')
