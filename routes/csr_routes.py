from flask import Blueprint, render_template, request, redirect, flash, jsonify, current_app
import os
from werkzeug.utils import secure_filename
from db.db_manager import (
    get_all_construction_sites,
    upload_construction_site,
    insert_company,
    delete_company,
    get_all_companies,
    update_construction_site,
    delete_construction_site,
    get_all_departments
)

csr_bp = Blueprint('csr', __name__, url_prefix='/csr')

# ──────────────── 페이지 렌더 ────────────────
@csr_bp.route('/', methods=['GET'])
def show_csr():
    companies = get_all_companies()
    departments = get_all_departments()
    return render_template(
        'GG_003_csr.html',
        companies=companies,
        departments=departments
    )

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
        flash(f'❌ 회사 등록 중 오류 발생: {e}', 'error')
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
        files = request.files
        calibration_date = request.form.get('calibration_date') or None  # ✅ 빈 문자열 방어

        upload_construction_site(
            site_name=request.form['site_name'],
            address=request.form['address'],
            manager_name=request.form['manager_name'],
            latitude=float(request.form['latitude']),
            longitude=float(request.form['longitude']),
            company_id=int(request.form['company_id']),
            department=request.form['department'],
            importance_level=request.form.get('importance_level'),
            contractor_notes=request.form.get('contractor_notes'),
            calibration_date=calibration_date,  # ✅ None 처리된 값 전달
            survey_file=files.get('survey_file'),
            procedure_file=files.get('procedure_file'),
            standard_file=files.get('standard_file'),
            monitoring_data=files.get('monitoring_data'),
            calibration_file=files.get('calibration_file')
        )
        flash('✅ 건설 현장 등록에 성공했습니다.', 'success')
    except Exception as e:
        flash(f'❌ 건설 현장 등록 중 오류 발생: {e}', 'error')
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
        form = request.form
        files = request.files
        calibration_date = form.get('calibration_date') or None  # ✅ 빈 문자열 방어

        update_construction_site(
            site_id=int(form['site_id']),
            site_name=form['site_name'],
            address=form['address'],
            manager_name=form['manager_name'],
            latitude=float(form['latitude']),
            longitude=float(form['longitude']),
            company_id=int(form['company_id']),
            department=form['department'],
            importance_level=form.get('importance_level'),
            contractor_notes=form.get('contractor_notes'),
            calibration_date=calibration_date,  # ✅ None 처리된 값 전달
            survey_file=files.get('survey_file'),
            procedure_file=files.get('procedure_file'),
            standard_file=files.get('standard_file'),
            monitoring_data=files.get('monitoring_data'),
            calibration_file=files.get('calibration_file')
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
