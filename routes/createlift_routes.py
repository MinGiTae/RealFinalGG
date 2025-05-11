from flask import Blueprint, render_template, request, jsonify, send_file
from db.db_manager import (
    get_all_companies,
    get_sites_by_company,
    get_site_id_by_name,
    get_site_by_id,
    get_images_for_site,
    analyze_environmental_aspects,
    insert_audit_session,
    insert_audit_result,
    create_audit_report_excel
)

createlift_bp = Blueprint('createlift', __name__)

# =========================
# 1) 회사/현장 선택 페이지
# =========================
@createlift_bp.route('/Create_lift')
def show_createlift():
    companies = get_all_companies()
    return render_template('GG_006_createlift.html', companies=companies)


# =========================
# 2) AJAX: 회사명 → 현장 리스트
# =========================
@createlift_bp.route('/search-site')
def search_site():
    company_name = request.args.get('keyword', '')
    sites = get_sites_by_company(company_name)
    return jsonify([{"site_name": s} for s in sites])


# =========================
# 3) AJAX: 현장 선택 → 자동 감사 실행 (16문항)
# =========================
@createlift_bp.route('/select-site', methods=['POST'])
def select_site():
    company_name = request.form['company_name']
    site_name = request.form['site_name']

    # 1) 이미지 분석 및 자동 판단
    images = get_images_for_site(company_name, site_name)
    iso_checks = analyze_environmental_aspects(images)  # ✅ 총 16문항 결과

    # 2) DB 저장
    site_id = get_site_id_by_name(site_name)
    site_info = get_site_by_id(site_id)
    company_id = site_info['company_id']
    session_id = insert_audit_session(company_id, site_id, performed_by='system')

    for idx, passed in enumerate(iso_checks, start=1):
        insert_audit_result(session_id, 'ISO', idx, passed)

    # 3) 결과 리턴
    return jsonify({
        "actual_results": iso_checks  # ✅ 총 16개 항목 결과
    })


# =========================
# 4) 엑셀 다운로드
# =========================
@createlift_bp.route('/download-audit-excel')
def download_audit_excel():
    company_name = request.args.get('company_name')
    site_name = request.args.get('site_name')

    buf = create_audit_report_excel(company_name, site_name)
    filename = f"{site_name.replace(' ', '_')}_내부감사결과.xlsx"
    return send_file(
        buf,
        as_attachment=True,
        download_name=filename,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
