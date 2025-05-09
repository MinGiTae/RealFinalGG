# services/upload_service.py

from utils.image_analysis import analyze_image
from db.db_manager import insert_waste_photo

def handle_upload(file, site_id, object_id):
    # 1. 파일 저장
    filename = file.filename
    save_path = f"./uploads/{filename}"
    file.save(save_path)

    # 2. YOLO 분석 실행
    result_img, detection_summary = analyze_image(save_path)

    # 3. DB 저장
    insert_waste_photo(
        site_id=site_id,
        object_id=object_id,
        image_filename=filename,
        detection_summary=detection_summary
    )

    # 4. 결과 반환 (템플릿 렌더용)
    return result_img, detection_summary, filename
