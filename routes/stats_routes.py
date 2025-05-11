# routes/stats_routes.py
from urllib.parse import unquote
from collections import defaultdict
import json
from flask import Response
from flask import jsonify
from flask import Blueprint, render_template
from flask import request
from db.db_manager import get_all_construction_sites
from db.db_manager import get_emissions_by_waste_type
from db.db_manager import get_waste_amount_by_type
from db.db_manager import get_monthly_stats
from db.db_manager import get_waste_percentage_current_month
from db.db_manager import get_carbon_emission_by_company
from db.db_manager import get_top_carbon_emitter_company
from db.db_manager import get_monthly_emission_by_region
from db.db_manager import get_top_waste_types_by_region

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/analytics')
def analytics_page():
    return render_template('GG_005_analytics_and_statstics.html')


@stats_bp.route('/api/sites', methods=['GET'])
def get_all_sites_api():
    result = get_all_construction_sites()
    sites = []
    for row in result:
        sites.append({
            'site_id': row['site_id'],
            'site_name': row['site_name'],
            'address': row['address'],
            'manager_name': row['manager_name'],
            'latitude': row['latitude'],
            'longitude': row['longitude']
        })
    return Response(json.dumps(sites, ensure_ascii=False), content_type='application/json; charset=utf-8')


@stats_bp.route('/api/emissions_by_waste', methods=['GET'])
def emissions_by_waste():
    site_id = request.args.get('site_id')
    site_id = int(site_id) if site_id else None
    data = get_emissions_by_waste_type(site_id)
    return jsonify(data)

@stats_bp.route("/api/waste-types")
def waste_type_api():
    return jsonify(get_waste_amount_by_type())

@stats_bp.route("/api/monthly-stats")
def monthly_stats_api():
    return jsonify(get_monthly_stats())


@stats_bp.route("/api/waste-percentage")
def waste_percentage_current():
    return jsonify(get_waste_percentage_current_month())

@stats_bp.route('/api/emission-by-company', methods=['GET'])
def emission_by_company():
    try:
        data = get_carbon_emission_by_company()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stats_bp.route('/api/top-emitter', methods=['GET'])
def top_carbon_emitter():
    try:
        result = get_top_carbon_emitter_company()
        if result:
            return jsonify({
                "company_name": result["company_name"],
                "total_emission": float(result["total_emission"])
            })
        else:
            return jsonify({"message": "데이터가 없습니다."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@stats_bp.route('/api/emission/region-monthly/<region>', methods=['GET'])
def get_monthly_emission_by_region_route(region):
    try:
        region = unquote(region)
        raw_data = get_monthly_emission_by_region(region)

        # 1. 월별 정렬용 set
        month_set = set()
        site_emissions = defaultdict(lambda: defaultdict(float))  # {site: {month: emission}}

        for row in raw_data:
            site = row['site_name']
            month = row['month']
            month_set.add(month)
            site_emissions[site][month] += float(row['total_emission'])

        sorted_months = sorted(month_set)
        formatted_months = [f"{int(m.split('-')[1])}월" for m in sorted_months]

        sites = list(site_emissions.keys())
        carbon_data = []

        for site in sites:
            carbon_data.append([
                site_emissions[site].get(m, 0) for m in sorted_months
            ])

        print({
            'status': 'success',
            'region': region,
            'months': formatted_months,
            'sites': sites,
            'carbonData': carbon_data
        })




        return jsonify({
            'status': 'success',
            'region': region,
            'months': formatted_months,
            'sites': sites,
            'carbonData': carbon_data
        })

    except Exception as e:
        print("서버 에러:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500


@stats_bp.route('/api/waste-ranking/<region>', methods=['GET'])
def get_waste_ranking_by_region(region):
    try:
        region = unquote(region)  # URL 인코딩된 한글 처리 (예: %EB%8C%80%EC%A0%84 → 대전)
        data = get_top_waste_types_by_region(region)

        return jsonify({
            'status': 'success',
            'region': region,
            'data': data
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500