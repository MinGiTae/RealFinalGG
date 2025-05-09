# routes/stats_routes.py
import json
from flask import Response
from flask import Blueprint, render_template
from db.db_manager import get_all_construction_sites

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


