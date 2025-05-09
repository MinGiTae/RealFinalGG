# routes/main_routes.py
from flask import Blueprint, render_template, send_from_directory

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
def home():
    return render_template('GG_001_main.html')

@main_bp.route('/result/<path:filename>')
def result_file(filename):
    return send_from_directory('runs/detect', filename)
