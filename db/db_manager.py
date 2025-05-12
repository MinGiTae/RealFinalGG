import os
import pymysql
import pymysql.cursors
from datetime import datetime

# for Excel download
import pandas as pd
import openpyxl
from flask import current_app, send_file
from io import BytesIO

# ===================== 공통 DB 연결 =====================
def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="0731",  # ← 수정: DB 비밀번호 변경
        database="garbageguard",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

# ===================== Company 관련 =====================
# ✅ 회사 등록
def insert_company(company_name, address, ceo_name, contact):
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            INSERT INTO companies (company_name, address, ceo_name, contact)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (company_name, address, ceo_name, contact))
        conn.commit()
    conn.close()

# ✅ 회사 삭제
def delete_company(company_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "DELETE FROM companies WHERE company_id = %s",
            (company_id,)
        )
        conn.commit()
    conn.close()

# ✅ 회사 목록 조회
def get_all_companies():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT company_id, company_name FROM companies ORDER BY company_name")
        companies = cursor.fetchall()
    conn.close()
    return companies

# ✅ 회사 ID로 회사 정보 조회
def get_company_by_id(company_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT company_id, company_name FROM companies WHERE company_id=%s",
            (company_id,)
        )
        result = cursor.fetchone()
    conn.close()
    return result

# ✅ 회사명으로 company_id 조회 및 해당 회사의 건설현장 리스트 조회
def get_sites_by_company(company_name):
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT cs.site_name
              FROM construction_sites cs
              JOIN companies c ON cs.company_id = c.company_id
             WHERE c.company_name = %s
        """
        cursor.execute(sql, (company_name,))
        rows = cursor.fetchall()
    conn.close()
    return [row['site_name'] for row in rows]

# ===================== Construction Site 관련 =====================
# ✅ 건설 현장 등록
def upload_construction_site(site_name, address, manager_name, latitude=None, longitude=None, company_id=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        columns = ["site_name", "address", "manager_name"]
        values = [site_name, address, manager_name]
        if latitude is not None and longitude is not None and company_id is not None:
            columns += ["latitude", "longitude", "company_id"]
            values += [latitude, longitude, company_id]
        placeholders = ", ".join(["%s"] * len(columns))
        sql = f"INSERT INTO construction_sites ({', '.join(columns)}) VALUES ({placeholders})"
        cursor.execute(sql, tuple(values))
        conn.commit()
    conn.close()

# ✅ 건설 현장 수정
def update_construction_site(site_id, site_name, address, manager_name, latitude=None, longitude=None, company_id=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        updates = ["site_name=%s", "address=%s", "manager_name=%s"]
        values = [site_name, address, manager_name]
        if latitude is not None and longitude is not None:
            updates += ["latitude=%s", "longitude=%s"]
            values += [latitude, longitude]
        if company_id is not None:
            updates += ["company_id=%s"]
            values += [company_id]
        sql = f"UPDATE construction_sites SET {', '.join(updates)} WHERE site_id=%s"
        values.append(site_id)
        cursor.execute(sql, tuple(values))
        conn.commit()
    conn.close()

# ✅ 건설 현장 삭제
def delete_construction_site(site_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM construction_sites WHERE site_id=%s", (site_id,))
        conn.commit()
    conn.close()

# ✅ 현장 전체 목록 조회
def get_all_construction_sites():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT site_id, site_name, address, manager_name, latitude, longitude, company_id FROM construction_sites"
        )
        result = cursor.fetchall()
    conn.close()
    return result

# alias for site list
def get_all_sites():
    return get_all_construction_sites()

# ✅ 특정 현장 ID로 현장 정보 조회
def get_site_by_id(site_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT site_id, site_name, company_id FROM construction_sites WHERE site_id=%s",
            (site_id,)
        )
        result = cursor.fetchone()
    conn.close()
    return result

# ✅ site_name → site_id 변환
def get_site_id_by_name(site_name):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT site_id FROM construction_sites WHERE site_name=%s",
            (site_name,)
        )
        row = cursor.fetchone()
    conn.close()
    return row['site_id'] if row else None

# ===================== Waste Photo & Management 관련 =====================
# ✅ YOLO 결과 저장
def insert_waste_photo(site_id, object_id, image_filename, detection_summary, uploaded_at=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        if uploaded_at is None:
            sql = """
                INSERT INTO waste_photos (site_id, object_id, image_filename, detection_summary, is_analyzed)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (site_id, object_id, image_filename, detection_summary, True))
        else:
            sql = """
                INSERT INTO waste_photos (site_id, object_id, image_filename, detection_summary, uploaded_at, is_analyzed)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (site_id, object_id, image_filename, detection_summary, uploaded_at, True))
        conn.commit()
    conn.close()

# ✅ detection_summary 조회
def get_detection_summary(site_id, image_filename):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT detection_summary FROM waste_photos WHERE site_id=%s AND image_filename=%s",
            (site_id, image_filename)
        )
        result = cursor.fetchone()
    conn.close()
    return result['detection_summary'] if result else None

# ✅ 특정 날짜의 현장 이미지 조회
def get_photos_by_site_and_date(site_id, date):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT image_filename, detection_summary, uploaded_at FROM waste_photos WHERE site_id=%s AND DATE(uploaded_at)=%s ORDER BY uploaded_at DESC",
            (site_id, date)
        )
        result = cursor.fetchall()
    conn.close()
    return result

# ✅ 특정 현장의 모든 이미지 조회
def get_photos_by_site(site_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT image_filename, detection_summary, uploaded_at FROM waste_photos WHERE site_id=%s ORDER BY uploaded_at DESC",
            (site_id,)
        )
        result = cursor.fetchall()
    conn.close()
    return result

# ===================== Object 관련 =====================
# ✅ object_name → object_id 자동 생성 및 조회
def get_object_id_by_name(object_name):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT object_id FROM waste_objects WHERE object_name=%s",
            (object_name,)
        )
        row = cursor.fetchone()
        if row:
            obj_id = row['object_id']
        else:
            cursor.execute(
                "INSERT INTO waste_objects (object_name) VALUES (%s)",
                (object_name,)
            )
            conn.commit()
            obj_id = cursor.lastrowid
    conn.close()
    return obj_id

# ===================== 통계 관련 =====================
# ✅ 월별 통계 조회
def get_monthly_stats(site_id=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        if site_id:
            cursor.execute(
                """
                    SELECT DATE_FORMAT(disposal_date,'%Y-%m') AS month,
                           SUM(waste_amount) AS total_waste,
                           SUM(carbon_emission) AS total_emission
                      FROM waste_management
                     WHERE site_id=%s
                     GROUP BY month
                     ORDER BY month
                """, (site_id,)
            )
        else:
            cursor.execute(
                """
                    SELECT DATE_FORMAT(disposal_date,'%Y-%m') AS month,
                           SUM(waste_amount) AS total_waste,
                           SUM(carbon_emission) AS total_emission
                      FROM waste_management
                     GROUP BY month
                     ORDER BY month
                """
            )
        rows = cursor.fetchall()
    conn.close()
    return rows

# ✅ 폐기물 관리 저장
def insert_waste_management(site_id, waste_type, waste_amount, carbon_emission, disposal_date):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO waste_management (site_id, waste_type, waste_amount, carbon_emission, disposal_date) VALUES (%s, %s, %s, %s, %s)",
            (site_id, waste_type, waste_amount, carbon_emission, disposal_date)
        )
        conn.commit()
    conn.close()

# ✅ 한 장의 사진(photo_id)에 대해 탐지된 객체(object_id)와 개수(count) 저장
def insert_photo_object(photo_id: int, object_id: int, count: int):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO waste_photo_objects (photo_id, object_id, count)
                VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (photo_id, object_id, count))
        conn.commit()
    finally:
        conn.close()

# ✅ 폐기물 처리 내역 저장 (통계용, 상세 정보 포함)
def insert_waste_management(
    site_id,
    waste_type,
    waste_amount,
    carbon_emission,
    disposal_date,
    waste_category,
    waste_code,
    recyclable
):
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            INSERT INTO waste_management
              (site_id, waste_type, waste_amount, carbon_emission,
               disposal_date, waste_category, waste_code, recyclable)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            site_id,
            waste_type,
            waste_amount,
            carbon_emission,
            disposal_date,
            waste_category,
            waste_code,
            int(recyclable)
        ))
        conn.commit()
    conn.close()

# ▶ 추가 함수 1: 폐기물 종류별 탄소 배출량
def get_emissions_by_waste_type(site_id=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        if site_id:
            sql = """
                SELECT waste_type, SUM(carbon_emission) AS total_emission
                FROM waste_management
                WHERE site_id = %s
                GROUP BY waste_type
            """
            cursor.execute(sql, (site_id,))
        else:
            cursor.execute("""
                SELECT waste_type, SUM(carbon_emission) AS total_emission
                FROM waste_management
                GROUP BY waste_type
            """)
        result = cursor.fetchall()
    conn.close()
    return result

# ▶ 추가 함수 2: 폐기물 종류별 배출량
def get_waste_amount_by_type(site_id=None):
    conn = get_connection()
    with conn.cursor() as cursor:
        if site_id:
            sql = """
                SELECT waste_type, SUM(waste_amount) AS total_amount
                FROM waste_management
                WHERE site_id = %s
                GROUP BY waste_type
            """
            cursor.execute(sql, (site_id,))
        else:
            cursor.execute("""
                SELECT waste_type, SUM(waste_amount) AS total_amount
                FROM waste_management
                GROUP BY waste_type
            """)
        result = cursor.fetchall()
    conn.close()
    return result

# ▶ 추가 함수 3: 현재 월 폐기물 비율 (수정판)
def get_waste_percentage_current_month():
    conn = get_connection()
    with conn.cursor() as cursor:
        now = datetime.now()
        current_month = now.strftime('%Y-%m')
        sql = """
            SELECT waste_type, SUM(waste_amount) AS total
            FROM waste_management
            WHERE DATE_FORMAT(disposal_date, '%%Y-%%m') = %s
            GROUP BY waste_type
        """
        cursor.execute(sql, (current_month,))
        rows = cursor.fetchall()
        total = sum(row['total'] for row in rows)
        if total == 0:
            return []
        return [
            {"waste_type": row["waste_type"], "percentage": round((row["total"] / total) * 100)}
            for row in rows
        ]
    conn.close()

# ▶ 추가 함수 4: 건설사별 탄소 배출량
def get_carbon_emission_by_company():
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT c.company_name, SUM(wm.carbon_emission) AS total_emission
            FROM companies c
            JOIN construction_sites cs ON c.company_id = cs.company_id
            JOIN waste_management wm ON cs.site_id = wm.site_id
            GROUP BY c.company_id, c.company_name
            ORDER BY total_emission DESC
        """
        cursor.execute(sql)
        result = cursor.fetchall()
    conn.close()
    return result

# ▶ 추가 함수 5: 최다 배출 건설사 조회
def get_top_carbon_emitter_company():
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT c.company_name, SUM(wm.carbon_emission) AS total_emission
            FROM companies c
            JOIN construction_sites cs ON c.company_id = cs.company_id
            JOIN waste_management wm ON cs.site_id = wm.site_id
            GROUP BY c.company_id, c.company_name
            ORDER BY total_emission DESC
            LIMIT 1
        """
        cursor.execute(sql)
        result = cursor.fetchone()
    conn.close()
    return result

# ▶ 추가 함수 6: 지역별 월별 탄소 배출량
def get_monthly_emission_by_region(region_keyword: str):
    region_keyword = region_keyword.replace("광역시", "").replace("특별시", "").replace("도", "").strip()
    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:  # ← 수정: DictCursor 적용
        sql = (
            "SELECT cs.site_name, "
            "DATE_FORMAT(wm.disposal_date, '%%Y-%%m') AS month, "
            "SUM(COALESCE(wm.carbon_emission,0)) AS total_emission "
            "FROM construction_sites cs "
            "JOIN waste_management wm ON cs.site_id = wm.site_id "
            "WHERE cs.address LIKE %s "
            "GROUP BY cs.site_name, month "
            "ORDER BY cs.site_name, month"
        )
        cursor.execute(sql, (f"%{region_keyword}%",))
        result = cursor.fetchall()
        print(result)  # ← 디버깅용 출력
        for row in result:
            row['total_emission'] = float(row['total_emission'])
    conn.close()
    return result

# ▶ 추가 함수 7: 지역별 상위 폐기물 종류
def get_top_waste_types_by_region(region_keyword: str):
    region_keyword = region_keyword.replace("광역시", "").replace("특별시", "").replace("도", "").strip()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT wm.waste_type, SUM(wm.waste_amount) AS total_amount
            FROM construction_sites cs
            JOIN waste_management wm ON cs.site_id = wm.site_id
            WHERE cs.address LIKE %s
            GROUP BY wm.waste_type
            ORDER BY total_amount DESC
            LIMIT 10
        """
        cursor.execute(sql, (f"%{region_keyword}%",))
        result = cursor.fetchall()
        for row in result:
            row['total_amount'] = float(row['total_amount'])
    conn.close()
    return result


def get_images_for_site(company_name: str, site_name: str) -> list:
    site_id = get_site_id_by_name(site_name)
    if site_id is None:
        return []
    return get_photos_by_site(site_id)


def analyze_environmental_aspects(images: list) -> list:
    results = []

    # EMP-301 (1~5)
    results.append(len(images) > 0)  # 1
    results.append(any(img.get('detection_summary') for img in images))  # 2
    results.append(len(images) > 5)  # 3
    results.append(True)  # 4
    results.append(len(images) > 0)  # 5

    # EMP-408 (6~8)
    results.append(any('폐기물' in img.get('detection_summary', '') for img in images))  # 6
    results.append(True)  # 외주업체 요구사항 전달 여부는 DB에서 따로 가능함 (예시로 True)
    results.append(True)  # 운영 기준 명시는 시스템 기준 정의 시 True

    # EMP-501 (9~12)
    results.append(len(images) >= 3)  # 주요 환경특성 파악 여부
    results.append(True)  # 측정 주기 (업로드 주기 비교 기반 가능, 예시 True)
    results.append(True)  # 법적 기준 만족 여부는 수치가 없어서 예시 True
    results.append(any('장비' in img.get('detection_summary', '') for img in images))  # 교정/검증 기록

    # EMP-504 (13~16)
    results.append(True)  # 기록 존재 여부
    results.append(True)  # 절차 유무 (시스템 정의 기반)
    results.append(True)  # 추적 가능 여부
    results.append(True)  # 시스템 준수 여부 (조건부 True)

    return results  # 총 16개


def analyze_waste_requirements(images: list) -> list:
    # 현재 사용 안 함
    return []


def insert_audit_session(company_id: int, site_id: int, performed_by: str) -> int:
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO audit_sessions (site_id, company_id, performed_by) VALUES (%s, %s, %s)",
            (site_id, company_id, performed_by)
        )
        session_id = cursor.lastrowid
        conn.commit()
    conn.close()
    return session_id


def insert_audit_result(session_id: int, item_type: str, item_index: int, is_pass: bool, comment: str = ''):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO audit_results
              (session_id, item_type, item_index, is_pass, comment)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (session_id, item_type, item_index, is_pass, comment)
        )
        conn.commit()
    conn.close()


def create_audit_report_excel(company_name: str, site_name: str) -> BytesIO:
    from io import BytesIO
    from datetime import datetime
    import os
    import openpyxl
    from flask import current_app
    from db.db_manager import get_images_for_site
    from services.analyze_environmental import analyze_environmental_aspects

    tpl_path = os.path.join(current_app.root_path, 'datasets', 'templates', '감사체크리스트.xlsx')
    wb = openpyxl.load_workbook(tpl_path)
    ws = wb.active

    def safe_write(r, c, v):
        from openpyxl.cell.cell import MergedCell
        cell = ws.cell(row=r, column=c)
        if isinstance(cell, MergedCell):
            for rng in ws.merged_cells.ranges:
                if rng.min_row <= r <= rng.max_row and rng.min_col <= c <= rng.max_col:
                    ws.cell(rng.min_row, rng.min_col, v)
                    return
        ws.cell(r, c, v)

    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for rng in ws.merged_cells.ranges:
        val = str(ws.cell(rng.min_row, rng.min_col).value or '')
        if '피감사팀' in val:
            safe_write(rng.min_row, rng.min_col, f"{company_name} / {site_name}")
        if '감사원' in val:
            safe_write(rng.min_row, rng.min_col, '시스템 자동감사')
        if '감사일자' in val:
            safe_write(rng.min_row, rng.min_col, now)

    # 🔥 이미지 분석 결과 (iso_checks + iso_reasons)
    images = get_images_for_site(company_name, site_name)
    iso_checks, iso_reasons = analyze_environmental_aspects(images)

    # 헤더 찾기
    header_row = None
    for row in ws.iter_rows(min_row=1, max_row=50):
        for cell in row:
            if str(cell.value).strip() == "감사항목":
                header_row = cell.row
                question_col = cell.column
                break
        if header_row:
            break
    if not header_row:
        raise RuntimeError("템플릿에서 '감사항목' 헤더를 찾을 수 없습니다.")

    # 적합 / 부적합 열 찾기
    pass_col = fail_col = None
    for idx, cell in enumerate(ws[header_row], start=1):
        txt = str(cell.value or '').replace(' ', '')
        if txt == '적합':
            pass_col = idx
        elif txt == '부적합':
            fail_col = idx
    if not all([pass_col, fail_col]):
        raise RuntimeError("헤더에 '적합', '부적합' 열이 필요합니다.")

    # ISO 문항 리스트
    iso_questions = [
        '환경측면을 파악하기 위한 분야별 주관 부서는 설정되었는가?',
        '환경측면/영향조사표 및 환경영향평가서, 환경영향등록부가 기록되고 기능별로 정리되어 있는가?',
        '환경측면과 관련된 환경영향은 누락 없이 파악되고 있는가?',
        '환경측면의 중요성에 대한 평가는 정해진 기준을 준수하는가?',
        '중요한 환경영향과 관련된 환경측면에 대한 정보를 최신의 자료로 유지하고 있는가?',
        '중요한 환경측면과 관련된 활동 및 운영이 식별되고 관련절차가 수립되고 기록되고 있는가?',
        '외주업체와 계약자에게 관련된 요구사항을 전달하는 의사소통은 수립되어 있는가?',
        '절차에 운영기준은 명시되고 있는가?',
        '주요 환경특성을 파악하고 모니터링 하고 있는가?',
        '환경 모니터링 및 측정은 계획된 주기로 실시하고 있는가?',
        '주요 환경특성이 법적 기준을 만족하는가?',
        '사용하고 있는 모니터링 및 측정 장비를 교정, 검증하며 관련기록을 유지하는가?',
        '필요한 기록물을 작성 유지관리 하는가?',
        '기록은 식별, 보관, 보호, 검색, 보유, 폐기에 대한 절차 및 유지관리 하는가?',
        '기록은 읽기 쉽고 식별, 추적이 가능한가?',
        '기록관리 시스템을 준수하고 있는가?'
    ]

    # 문항별 적합/부적합 체크
    for row in ws.iter_rows(min_row=header_row + 1, max_row=ws.max_row):
        q_text = str(row[question_col].value or '').strip()
        if not q_text:
            continue

        for idx, standard_q in enumerate(iso_questions):
            if q_text.replace(' ', '').replace('\n', '') in standard_q.replace(' ', ''):
                result = iso_checks[idx]
                target_col = pass_col if result else fail_col
                safe_write(row[0].row, target_col, '○')
                break

    # 🔥 부적합 사유 시트 생성
    manual_ws = wb.create_sheet('수동확인필요')
    manual_ws.append(['번호', '감사항목', '판정', '판단사유'])
    for idx, (q, passed, reason) in enumerate(zip(iso_questions, iso_checks, iso_reasons), start=1):
        if not passed:
            manual_ws.append([idx, q, '부적합', reason])

    # 파일 출력
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return output