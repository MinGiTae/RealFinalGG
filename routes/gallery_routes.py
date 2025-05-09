from flask import Blueprint, render_template, request
from db.db_manager import (
    get_all_construction_sites,
    get_photos_by_site,
    get_photos_by_site_and_date
)

gallery_bp = Blueprint('gallery_bp', __name__)

@gallery_bp.route('/gallery', methods=['GET'])
def show_gallery():
    site_id = request.args.get('site_id') or ''
    date    = request.args.get('date') or ''

    # 1) 모든 현장 목록 조회
    sites = get_all_construction_sites()
    photos = []

    # 2) 선택된 현장명(공백 포함) 찾기
    selected_name = ''
    for s in sites:
        if str(s['site_id']) == site_id:
            selected_name = s['site_name']
            break

    # 3) 실제 저장된 폴더명: 공백 → 언더바
    selected_folder = selected_name.replace(' ', '_') if selected_name else ''

    # 4) 사진 조회 (날짜 있으면 그 날짜만, 없으면 전체)
    if site_id and selected_folder:
        if date:
            photos = get_photos_by_site_and_date(site_id, date)
        else:
            photos = get_photos_by_site(site_id)

    return render_template(
        'gallery.html',
        sites=sites,
        photos=photos,
        selected_site=site_id,
        selected_date=date,
        selected_name=selected_name,
        selected_folder=selected_folder
    )
