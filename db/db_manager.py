import pymysql
import pymysql.cursors
from datetime import datetime

# ✅ DB 연결 함수 (공통)
def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="0000",
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
            sql = """
                SELECT waste_type, SUM(carbon_emission) AS total_emission
                FROM waste_management
                GROUP BY waste_type
            """
            cursor.execute(sql)
        result = cursor.fetchall()
    conn.close()
    return result

#폐기물 종류별 배출량 불러오는 함수
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
            sql = """
                SELECT waste_type, SUM(waste_amount) AS total_amount
                FROM waste_management
                GROUP BY waste_type
            """
            cursor.execute(sql)
        result = cursor.fetchall()
    conn.close()
    return result


#월별 폐기물 순위
def get_waste_percentage_current_month():
    conn = get_connection()
    with conn.cursor() as cursor:
        # 현재 월 기준
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

        result = [
            {
                "waste_type": row["waste_type"],
                "percentage": round((row["total"] / total) * 100)
            }
            for row in rows
        ]

    conn.close()
    return result

#건설사별 탄소 배출량
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

#가장 많은 탄소를 배출한 건설사 조회함수
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

#해당 지역에 대한 건설현장 리스트를 조회하는 함수
def get_monthly_emission_by_region(region_keyword: str):
    region_keyword = region_keyword.replace("광역시", "").replace("특별시", "").replace("도", "").strip()
    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor)  as cursor:
        # 월별 탄소 배출량 조회 SQL
        sql = (
            "SELECT cs.site_name, "
            "DATE_FORMAT(wm.disposal_date, '%%Y-%%m') AS month, "
            "SUM(COALESCE(wm.carbon_emission, 0)) AS total_emission "
            "FROM construction_sites cs "
            "JOIN waste_management wm ON cs.site_id = wm.site_id "
            "WHERE cs.address LIKE %s "
            "GROUP BY cs.site_name, month "
            "ORDER BY cs.site_name, month"
        )
        cursor.execute(sql, (f"%{region_keyword}%",))
        result = cursor.fetchall()
        print(result)

        for row in result:
            row['total_emission'] = float(row['total_emission'])

        conn.close()
        return result


def get_top_waste_types_by_region(region_keyword: str):
    region_keyword = region_keyword.replace("광역시", "").replace("특별시", "").replace("도", "").strip()

    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT
                wm.waste_type,
                SUM(wm.waste_amount) AS total_amount
            FROM
                construction_sites cs
            JOIN
                waste_management wm ON cs.site_id = wm.site_id
            WHERE
                cs.address LIKE %s
            GROUP BY
                wm.waste_type
            ORDER BY
                total_amount DESC
            LIMIT 10
        """
        cursor.execute(sql, (f"%{region_keyword}%",))
        result = cursor.fetchall()
        # Decimal → float 변환
        for row in result:
            row['total_amount'] = float(row['total_amount'])
    conn.close()
    return result
