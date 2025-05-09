from flask import Blueprint, render_template, request, jsonify
from db.db_manager import (
    get_all_companies,
    get_sites_by_company,   # 위에서 정의한 함수
    get_site_id_by_name
)

createlift_bp = Blueprint('createlift', __name__)

@createlift_bp.route('/Create_lift')
def show_createlift():
    companies = get_all_companies()
    return render_template('GG_006_createlift.html', companies=companies)

@createlift_bp.route('/search-company')
def search_company():
    keyword = request.args.get('keyword', '').lower()
    companies = get_all_companies()
    results = [c for c in companies if keyword in c.lower()]
    return jsonify(results)

@createlift_bp.route('/search-site')
def search_site():
    company_name = request.args.get('keyword', '')
    sites = get_sites_by_company(company_name)
    return jsonify([{"site_name": s} for s in sites])

@createlift_bp.route('/select-site', methods=['POST'])
def select_site():
    company_name = request.form.get('company_name')
    site_name    = request.form.get('site_name')
    # 실제 DB 조회 로직으로 교체하세요
    result = {
        "iso_checks":   [True, True, False, True, True, True, True],
        "waste_checks": [True, True, True, True, True, True, True]
    }
    return jsonify(result)
