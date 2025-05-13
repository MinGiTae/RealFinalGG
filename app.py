import os
from flask import Flask, redirect, url_for
from routes.main_routes import main_bp
from routes.upload_routes import upload_bp
from routes.stats_routes import stats_bp
from routes.gallery_routes import gallery_bp
from routes.predict_routes import predict_bp
from routes.csr_routes import csr_bp
from routes.createlift_routes import createlift_bp
# from routes.recycle_routes import recycle_bp

# BASE_DIR 를 기준으로 업로드 폴더 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')

app = Flask(__name__)
app.secret_key = 'go_home'
# 파일 업로드 경로 설정
app.config['UPLOAD_DIR'] = UPLOAD_DIR

# 업로드 폴더가 없으면 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 레거시 URL 리다이렉트: /Create_lift → /createlift/Create_lift
@app.route('/Create_lift')
def legacy_createlift():
    return redirect(url_for('createlift.show_createlift'))

# Blueprint 등록
app.register_blueprint(main_bp)                            # /
app.register_blueprint(upload_bp, url_prefix='/upload')    # /upload/*
app.register_blueprint(stats_bp)                           # /region-data/*
app.register_blueprint(gallery_bp)                         # /gallery
app.register_blueprint(predict_bp)                         # /input_waste
app.register_blueprint(csr_bp, url_prefix='/csr')          # /csr/*
app.register_blueprint(createlift_bp, url_prefix='/createlift')  # /createlift/*
# app.register_blueprint(recycle_bp)

if __name__ == '__main__':
    app.run(debug=True)
