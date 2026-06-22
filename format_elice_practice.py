# -*- coding: utf-8 -*-
"""모든 SQL/Python 실습 문항을 엘리스 단계형 starter 형식으로 통일"""
import json
import re
from pathlib import Path

DATA = Path(__file__).parent / "data" / "basic-ai-course.json"

SANDBOX_TABLES = {
    "gym_member": ["GYM_MEMBER"],
    "book": ["book"],
    "invoice": ["Invoice"],
    "library": ["book", "user"],
    "employees": ["employees", "salaries"],
    "sell_product": ["SELL", "PRODUCT"],
    "student": ["STUDENT"],
    "book_history": ["BOOK_HISTORY"],
    "employee_position": ["EMPLOYEE", "POSITION_T"],
    "name_cross": ["FIRST_NAME_T", "LAST_NAME_T"],
    "employee_self": ["EMPLOYEE"],
    "request_member": ["REQUEST_HIST", "MEMBER"],
    "request_union": ["request_past", "request_new"],
    "participant": ["PARTICIPANT"],
    "library_rental": ["rental", "user"],
}

# reference와 동일한 완성형 starter → 학습용 뼈대로 교체
SKELETON_OVERRIDES = {
    "el-sql-0902": """SELECT *
FROM book;""",
    "el-sql-0904": """SELECT *
FROM book
LIMIT 5;""",
    "el-sql-1004": """SELECT AVG(salary) AS avg_sal,
       MAX(salary) AS max_sal,
       MIN(salary) AS min_sal
FROM salaries;""",
    "el-sql-1005": """SELECT emp_no, salary
FROM salaries
WHERE salary > (SELECT AVG(salary) FROM salaries)
ORDER BY salary DESC;""",
    "el-sql-1101": """SELECT name, number FROM request_past
UNION ALL
SELECT name, number FROM request_new
ORDER BY name, number ASC;""",
    "el-sql-1102": """SELECT name, number FROM request_past
INTERSECT
SELECT name, number FROM request_new
ORDER BY name;""",
    "el-sql-1201": """SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
    "el-sql-1202": """SELECT EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
INNER JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
    "el-sql-1203": """SELECT first_name, last_name
FROM FIRST_NAME_T
CROSS JOIN LAST_NAME_T
ORDER BY first_name, last_name ASC;""",
    "el-sql-1204": """SELECT a.employee_id, a.employee_name, b.employee_name AS manager_name
FROM EMPLOYEE AS a, EMPLOYEE AS b
WHERE a.manager_id = b.employee_id
ORDER BY a.employee_id ASC;""",
    "el-sql-1205": """SELECT request_id, req_status, member_name
FROM REQUEST_HIST
INNER JOIN MEMBER ON REQUEST_HIST.req_member_id = MEMBER.member_id
WHERE req_status = 'fail'
ORDER BY request_id ASC;""",
    "el-sql-1206": """SELECT EMPLOYEE.EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
LEFT JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
    "el-sql-1301": """SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY,
       SUM(PRICE * QUANTITY) OVER (PARTITION BY SELLER_NAME, SELL.PRODUCT_ID) AS SUM_PRICE
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
    "el-sql-1302": """SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       PERCENT_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS PERCENT_RANK,
       CUME_DIST() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS CUME_DIST
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
    "el-sql-1303": """SELECT KIND, CATEGORY, SUM(SELL_COUNT)
FROM BOOK_HISTORY
GROUP BY KIND, CATEGORY WITH ROLLUP;""",
    "el-sql-1304": """SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       DENSE_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS DENSE_RANK,
       ROW_NUMBER() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS ROW_NUMBER
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
    "el-sql-1305": """SELECT ID, GROUP_NUM, TIME_RECORD,
       LAG(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS prev_time,
       LEAD(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS next_time,
       FIRST_VALUE(TIME_RECORD) OVER (
         PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS fastest
FROM PARTICIPANT
ORDER BY GROUP_NUM, TIME_RECORD;""",
}


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def sql_body_only(s):
    lines = [ln for ln in (s or "").split("\n") if ln.strip() and not ln.strip().startswith("--")]
    return norm("\n".join(lines))


def explore_header(tables):
    lines = []
    if len(tables) == 1:
        lines.append(
            f"-- 아래는 {tables[0]} 테이블 구조입니다. 테이블을 수정할 필요는 없습니다."
        )
    else:
        joined = ", ".join(tables)
        lines.append(
            f"-- 아래는 {joined} 테이블 구조입니다. 테이블을 수정할 필요는 없습니다."
        )
    for t in tables:
        lines.append(f"PRAGMA table_info({t});")
    lines.append("")
    for t in tables:
        lines.append(f"SELECT * FROM {t};")
    return lines


WINDOW_EXTRA_COLS = {
    "lag", "lead", "first_value", "last_value", "prev_time", "next_time", "fastest",
    "rank", "dense_rank", "row_number", "weight_sum", "score_sum", "sum_price",
    "percent_rank", "cume_dist", "country_avg", "grp", "cnt", "avg_sal", "max_sal", "min_sal",
}


def window_skeleton(ref, guide=None):
    from_m = re.search(r"\bFROM\s+(\w+)", ref, re.I)
    table = from_m.group(1) if from_m else "TABLE"
    cols = (guide or {}).get("outputColumns") or []
    base = [c for c in cols if c.lower() not in WINDOW_EXTRA_COLS]
    if base:
        return (
            f"SELECT {', '.join(base)}\nFROM {table}\n"
            "-- ↑ 윈도우 함수·집계 표현식(OVER 등)을 추가해 완성하세요"
        )
    return None


def auto_skeleton(ref_sql, guide=None):
    """완성 답안에서 학습자가 채울 구간만 남김"""
    ref = ref_sql.strip()

    if re.search(r"\bOVER\s*\(", ref, re.I):
        sk = window_skeleton(ref, guide)
        if sk:
            return sk

    join_m = re.search(
        r"\s+((?:INNER|LEFT|RIGHT|CROSS|FULL)\s+JOIN|(?:,\s*)?\w+\s+JOIN)\b",
        ref,
        re.I,
    )
    if join_m:
        head = ref[: join_m.start()].rstrip()
        return f"{head}\n-- ↑ JOIN 조건을 작성해 완성하세요"

    over_m = re.search(r"\s+OVER\s*\(", ref, re.I)
    if over_m:
        head = ref[: over_m.start()].rstrip().rstrip(",")
        from_m = re.search(r"\bFROM\s+(\w+)", ref, re.I)
        table = from_m.group(1) if from_m else "TABLE"
        if not re.search(r"\bFROM\b", head, re.I):
            return f"{head}\nFROM {table}\n-- ↑ LAG, LEAD, FIRST_VALUE 등 윈도우 함수(OVER)를 추가하세요"
        return f"{head}\n-- ↑ LAG, LEAD, FIRST_VALUE 등 윈도우 함수(OVER)를 추가하세요"

    cut_keywords = [
        " WHERE ",
        " GROUP BY",
        " HAVING ",
        " ORDER BY",
        " UNION ALL",
        " UNION ",
        " INTERSECT",
        " EXCEPT",
    ]
    upper = ref.upper()
    for kw in cut_keywords:
        idx = upper.find(kw.strip())
        if idx > 0:
            head = ref[:idx].rstrip()
            return f"{head}\n-- ↑ 위 쿼리를 완성하세요"

    if " DISTINCT " in upper:
        return ref.replace("DISTINCT ", "/* DISTINCT */ ", 1)

    return ref


def extract_answer_part(starter, ref):
    """기존 starter에서 탐색부 제외 답안 구간 추출"""
    if not starter:
        return auto_skeleton(ref)
    lines = starter.split("\n")
    answer_lines = []
    started = False
    for line in lines:
        if line.strip().startswith("--") and any(
            k in line for k in ("완성", "작성", "아래", "쿼리를", "윈도우", "SUM", "JOIN", "서브")
        ):
            started = True
            answer_lines.append(line)
            continue
        if started:
            answer_lines.append(line)
        elif line.strip().upper().startswith("SELECT") and "PRAGMA" not in starter[: starter.find(line)]:
            if norm(starter) != norm(ref):
                answer_lines.append(line)
    body = "\n".join(answer_lines).strip()
    if body:
        return body
    if norm(starter) == norm(ref):
        return SKELETON_OVERRIDES.get("") or auto_skeleton(ref)
    return starter.strip()


def build_sql_starter(item):
    sandbox = item.get("sandbox", "")
    tables = SANDBOX_TABLES.get(sandbox, [])
    ref = item.get("referenceSql", "").strip()
    goal = (item.get("practiceGuide") or {}).get("goal") or item.get("instructions", "")
    item_id = item.get("id", "")

    if not tables:
        return item.get("starterSql", ref)

    # PRAGMA 전용 실습
    if ref and "select" not in norm(ref):
        lines = ["-- SQLite에서는 PRAGMA table_info(테이블명)으로 구조를 확인합니다."]
        for t in tables:
            lines.append(f"PRAGMA table_info({t});")
        return "\n".join(lines)

    existing = (item.get("starterSql") or "").strip()
    if existing and ("PRAGMA table_info" in existing or "SELECT * FROM" in existing.upper()):
        parts = re.split(r"\n\s*\n", existing)
        answer = parts[-1].strip() if parts else auto_skeleton(ref)
        if "-- ↑" in answer or "완성하세요" in answer:
            answer = auto_skeleton(ref, item.get("practiceGuide"))
    elif item_id in SKELETON_OVERRIDES:
        answer = SKELETON_OVERRIDES[item_id]
        if norm(answer) == norm(ref):
            answer = auto_skeleton(ref)
    elif norm(existing) == norm(ref):
        answer = auto_skeleton(ref, item.get("practiceGuide"))
    else:
        answer = existing or auto_skeleton(ref, item.get("practiceGuide"))

    lines = explore_header(tables)
    lines.append("")
    if goal and goal not in answer:
        lines.append(f"-- {goal}")

    if ref and sql_body_only(answer) == sql_body_only(ref):
        answer = auto_skeleton(ref, item.get("practiceGuide"))

    lines.append(answer)
    return "\n".join(lines)


def build_python_starter(item):
    goal = (item.get("practiceGuide") or {}).get("goal") or item.get("instructions", "")
    ref = (item.get("referenceCode") or "").strip()
    starter = (item.get("starterCode") or "").strip()
    iid = item.get("id", "")

    # 이미 Q1/TODO 스캐폴드면 유지
    if starter and re.search(r"TODO|Q1\.|None\s+#\s+TODO", starter):
        return starter

    # 정답과 동일한 starter → 빈칸 대신 import·데이터만 남기고 TODO (엘리스 Q1)
    if norm(starter) == norm(ref) and ref:
        imports = [ln for ln in ref.split("\n") if re.match(r"^\s*(import|from)\s", ln)]
        lines = []
        if goal:
            lines.append(f"# {goal}")
        lines.extend(imports)
        lines.append("")
        lines.append("## Q1. 아래 코드를 완성하세요")
        lines.append("# TODO:")
        return "\n".join(lines) + "\n"

    if goal and not starter.startswith("#"):
        return f"# {goal}\n\n{starter}"
    if goal and starter.startswith("#"):
        return starter
    return starter or ref


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    sql_n = py_n = 0

    for item in data["items"]:
        if item.get("itemType") == "sql" or item.get("starterSql"):
            item["starterSql"] = build_sql_starter(item)
            item["eliceFormat"] = True
            sql_n += 1
        elif item.get("itemType") == "python" or item.get("starterCode"):
            item["starterCode"] = build_python_starter(item)
            item["eliceFormat"] = True
            py_n += 1

    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Formatted SQL={sql_n} Python={py_n}")


if __name__ == "__main__":
    main()
