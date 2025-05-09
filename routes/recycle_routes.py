# routes/recycle_routes.py

from flask import Blueprint, render_template
from db.db_manager import get_all_companies  # 회사 목록 조회 함수

recycle_bp = Blueprint('recycle', __name__)

@recycle_bp.route('/recycle', methods=['GET'])
def analytics_page():
    """
    순환골재 활용 시각화 페이지를 렌더링합니다.
    DB에서 모든 회사를 불러와서 템플릿으로 전달합니다.
    """
    # 1) DB에서 회사 목록을 가져온다
    company_list = get_all_companies()

    # 2) 템플릿에 company_list를 넘겨서 렌더링
    return render_template('recycle.html', company_list=company_list)
