from flask import Blueprint, render_template, request, redirect, flash, jsonify
from db.db_manager import (
    get_all_construction_sites,
    upload_construction_site,
    insert_company,
    delete_company,
    get_all_companies,
    update_construction_site,
    delete_construction_site
)

csr_bp = Blueprint('csr', __name__, url_prefix='/csr')

# ──────────────── 페이지 렌더 ────────────────
@csr_bp.route('/', methods=['GET'])
def show_csr():
    companies = get_all_companies()
    return render_template('GG_003_csr.html', companies=companies)

# ──────────────── 회사 등록 ────────────────
@csr_bp.route('/register_company', methods=['POST'])
def register_company():
    try:
        insert_company(
            request.form['company_name'],
            request.form.get('address'),
            request.form.get('ceo_name'),
            request.form.get('contact')
        )
        flash('✅ 회사 등록에 성공했습니다.', 'success')
    except Exception as e:
        flash(f'❌ 회사 등록 중 오류 발생: {str(e)}', 'error')
    return redirect('/csr/')

# ──────────────── 회사 삭제 ────────────────
@csr_bp.route('/delete_company', methods=['POST'])
def delete_company_route():
    try:
        data = request.get_json()
        company_id = int(data['company_id'])

        delete_company(company_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ──────────────── 건설현장 등록 ────────────────
@csr_bp.route('/register_site', methods=['POST'])
def register_site():
    try:
        upload_construction_site(
            request.form['site_name'],
            request.form['address'],
            request.form['manager_name'],
            float(request.form['latitude']),
            float(request.form['longitude']),
            int(request.form['company_id'])
        )
        flash('✅ 건설 현장 등록에 성공했습니다.', 'success')
    except Exception as e:
        flash(f'❌ 건설 현장 등록 중 오류 발생: {str(e)}', 'error')
    return redirect('/csr/')

# ──────────────── 저장된 건설현장 목록 반환 (지도용) ────────────────
@csr_bp.route('/get_sites', methods=['GET'])
def get_registered_sites():
    try:
        sites = get_all_construction_sites()
        return jsonify(sites)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ──────────────── 건설현장 정보 업데이트 ────────────────
@csr_bp.route('/update_site', methods=['POST'])
def update_site():
    try:
        data = request.get_json()
        site_id      = int(data['site_id'])
        site_name    = data['site_name']
        address      = data['address']
        manager_name = data['manager_name']

        update_construction_site(
            site_id,
            site_name,
            address,
            manager_name
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ──────────────── 건설현장 삭제 ────────────────
@csr_bp.route('/delete_site', methods=['POST'])
def delete_site():
    try:
        data = request.get_json()
        site_id = int(data['site_id'])

        delete_construction_site(site_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
