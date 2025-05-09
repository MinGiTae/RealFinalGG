🛠 **GarbageGuard**

> ISO 14001 기반 건설 현장 폐기물 관리 시스템

---

## 1️⃣ 프로젝트 개요 & 개념도

`GarbageGuard`는 다음 흐름으로 동작합니다:

```plaintext
[Client] 
   │  이미지 업로드 요청
   ▼
[Flask App] ──▶ [Blueprint: /predict] ──▶ [Service: YOLO 분석]
     │                                       │
     │                                       ▼
     │                                 [DB: 인식 결과 저장]
     │                                       │
     │         ◀── [DB Service: 통계 조회] ◀──┘
     │
     └──▶ [Blueprint: /gallery] ──▶ [Template & Static]
```

- **Client**: 사용자 브라우저 (HTML/JS/CSS)
- **Flask App**: 진입점(app.py) — Blueprint 기반 모듈 로딩
- **Blueprint**: 기능별 라우트(`routes/`)
- **Service**: 비즈니스 로직·AI 연동(`services/`)
- **DB Layer**: SQLAlchemy 또는 직접 쿼리(`db/models.py`)
- **Template & Static**: 화면 출력(`templates/`, `static/`)

이 개념도를 통해, 새로운 기능(예: `/report`)을 추가할 때도 같은 구조를 따라 확장할 수 있습니다.

---

## 2️⃣ 파일 & 디렉토리 구조

```bash
GarbageGuard/
├── app.py                      # Flask 진입점: Blueprint 등록 및 서버 실행
├── requirements.txt            # Python 패키지 목록
├── config/                     # 전역 설정·매핑 정보
│   └── material_map.py         # 자재명 ↔ 코드 매핑 테이블
├── db/                         # DB 연결 및 스키마 정의
│   └── models.py               # SQLAlchemy 모델 등
├── routes/                     # URL 라우터 (Blueprint)
│   ├── __init__.py             # Blueprint 패키지 초기화
│   ├── input_predict.py        # `/predict` API 블루프린트
│   └── gallery.py              # `/gallery` 페이지 블루프린트
├── services/                   # 비즈니스 로직 & AI 연동
│   ├── predict_yolo.py         # YOLO 분석 및 결과 처리
│   └── db_service.py           # DB CRUD 공통 함수
├── templates/                  # Jinja2 HTML 템플릿
│   ├── GG_001_main.html        # 메인 화면
│   └── GG_002_gallery.html     # 갤러리 예시 화면
├── static/                     # 정적 리소스
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── sample.png
└── README.md                   # 프로젝트 설명서 (이 문서)
```

---

## 3️⃣ 빠른 시작 (Quickstart)

1. **패키지 설치**
   ```bash
   pip install -r requirements.txt
   ```
2. **환경 설정**
   - `config/material_map.py`: 자재 매핑 확인
   - `db/models.py`: DB 연결 정보
3. **서버 실행**
   ```bash
   python app.py
   ```
4. **브라우저 접속**
   - `http://localhost:5000`

---

## 4️⃣ Blueprint & 확장 가이드

**Blueprint란?**
Flask에서 기능별로 라우트를 분리해 관리할 수 있는 모듈 단위입니다.  
- 각 Blueprint는 `routes/<이름>.py`에 정의하고, `app.py`에서 등록합니다.

### ✏️ 새 기능(페이지) 추가 예시

1. **템플릿**: `templates/GG_003_report.html`
2. **Blueprint 파일**: `routes/report.py`
   ```python
   from flask import Blueprint, render_template, request

   report_bp = Blueprint('report', __name__, url_prefix='/report')

   @report_bp.route('/')
   def report_main():
       site_id = request.args.get('site_id')
       return render_template('GG_003_report.html', site_id=site_id)
   ```
3. **app.py에 등록**
   ```python
   from routes.report import report_bp
   app.register_blueprint(report_bp)
   ```
4. **템플릿에서 링크 생성**
   ```html
   <a href="{{ url_for('report.report_main', site_id=1) }}">리포트 보기</a>
   ```

---

## 5️⃣ 코드 컨벤션 & 커밋

- **파일명**: `GG_XXX_<기능>.html` (예: `GG_004_settings.html`)
- **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 준수 (권장)
  - `feat: 기능 추가`
  - `fix: 버그 수정`
  - `refactor: 코드 구조 개선`
- **Python 스타일**: PEP8

---

## 6️⃣ 역할 분담

| 이름     | 담당 영역               |
|----------|-------------------------|
| 박민환   | 백엔드, DB, ML          |
| 송기윤   | 프론트엔드, 시각화       |
| 권태희   | 프론트엔드, 디자인       |

---

## 7️⃣ DB 테이블 & 관계

| 테이블             | 주요 컬럼                    | 설명                          |
|--------------------|-----------------------------|-------------------------------|
| `construction_sites` | `site_id`, `name`, `address` | 건설 현장 기본 정보           |
| `waste_records`      | `record_id`, `site_id`, `type`, `count` | 폐기물 예측 결과 저장       |
| `users` (선택)       | `user_id`, `username`, `role` | 사용자/관리자 정보           |

**관계(ERD)**:  
`construction_sites.site_id` 1:N `waste_records.site_id`

---

## 8️⃣ 추가 자료

- **API 문서**: `docs/api.md`
- **화면 흐름도**: `docs/wireframe/`

___
## 📄 새 페이지 만드는 방법 (base.html 레이아웃 상속 방식)

`GarbageGuard` 프로젝트에서는 **모든 페이지가 공통 레이아웃(`base.html`)을 상속**받아 만들어집니다.  
이 구조를 사용하면 **헤더(navbar), 푸터, 공통 CSS**는 자동으로 들어가고,  
각 페이지는 **본문 내용만 작성하면 됩니다.**

---

### ✅ 1. 새 HTML 파일 만들기

`templates/` 폴더 아래 새 HTML 파일을 만듭니다.  
예: `templates/GG_007_test.html`

```html
{% extends 'base.html' %}

{% block title %}Test 페이지{% endblock %}

{% block extra_css %}
<link rel="stylesheet" href="{{ url_for('static', filename='css/GG_007_test.css') }}">
{% endblock %}

{% block content %}
  <h1>이건 테스트 페이지입니다</h1>
  <p>공통 헤더와 푸터는 자동 포함됩니다.</p>
{% endblock %}
```

---

### ✅ 2. CSS 파일 만들기

`static/css/` 폴더 아래에 해당 페이지용 CSS 파일을 만듭니다.  
예: `static/css/GG_007_test.css`

```css
h1 {
  color: yellow;
  text-align: center;
  margin-top: 100px;
}
```

---

### ✅ 3. 라우트 파일 생성

`routes/` 폴더에 해당 페이지를 위한 Blueprint 라우트를 만듭니다.  
예: `routes/test_routes.py`

```python
from flask import Blueprint, render_template

test_bp = Blueprint('test', __name__)

@test_bp.route('/test')
def show_test():
    return render_template('GG_007_test.html')
```

---

### ✅ 4. app.py에 Blueprint 등록

`app.py`에 아래 줄을 추가합니다:

```python
from routes.test_routes import test_bp
app.register_blueprint(test_bp)
```

---

### ✅ 5. 브라우저에서 확인

서버를 실행한 뒤 아래 주소에 접속:

```
http://localhost:5000/test
```

✨ 공통 레이아웃이 자동으로 적용된 새 페이지가 뜨면 성공입니다!


---

> README를 참고해 구조·개념을 이해하고, 새로운 페이지나 기능을 Blueprint 패턴에 맞춰 추가하세요. 감사합니다!

