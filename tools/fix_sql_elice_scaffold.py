# -*- coding: utf-8 -*-
"""SQL 엘리스(타이핑) 실습 starter·가이드 복구"""
import json
import re
from pathlib import Path

SANDBOX_TABLES = {
    "library": ("book", "user"),
    "book": ("book",),
    "employees": ("employees", "salaries"),
    "library_rental": ("rental", "user"),
    "sell_product": ("SELL", "PRODUCT"),
    "employee_position": ("EMPLOYEE", "POSITION_T"),
    "name_cross": ("FIRST_NAME_T", "LAST_NAME_T"),
    "employee_self": ("EMPLOYEE",),
    "request_member": ("REQUEST_HIST", "MEMBER"),
    "request_union": ("request_past", "request_new"),
    "invoice": ("Invoice",),
    "gym_member": ("GYM_MEMBER",),
    "student": ("STUDENT",),
    "book_history": ("BOOK_HISTORY",),
    "participant": ("PARTICIPANT",),
    "kickboard_norm": ("customer",),
    "kickboard_2nf": ("customer",),
    "kickboard_3nf": ("company",),
    "kickboard_ready": ("kickboard",),
}

SANDBOX_SCHEMA_HINT = {
    "sell_product": "PRODUCT(PRODUCT_ID, PRODUCT_NAME, PRICE) · SELL(SELL_ID, SELLER_NAME, PRODUCT_ID, QUANTITY)",
    "employee_position": "EMPLOYEE(EMPLOYEE_ID, NAME, POSITION_ID) · POSITION_T(POSITION_ID, POSITION_NAME)",
    "library_rental": "rental(id, user_id, book_id, ...) · user(id, name, ...)",
    "employees": "employees(emp_no, ...) · salaries(emp_no, salary, ...)",
    "name_cross": "FIRST_NAME_T(id, first_name) · LAST_NAME_T(id, last_name)",
    "request_member": "REQUEST_HIST(request_id, req_status, req_member_id) · MEMBER(member_id, member_name)",
}


def exploration_prefix(sandbox: str) -> list[str]:
    tables = SANDBOX_TABLES.get(sandbox, ())
    if not tables:
        return []
    label = ", ".join(tables)
    lines = [
        f"-- 아래는 {label} 테이블 구조입니다. 테이블을 수정할 필요는 없습니다.",
    ]
    for t in tables:
        lines.append(f"PRAGMA table_info({t});")
    lines.append("")
    for t in tables:
        lines.append(f"SELECT * FROM {t};")
    lines.append("")
    return lines


def rebuild_starter(item: dict) -> str:
    ref = (item.get("referenceSql") or "").strip()
    sandbox = item.get("sandbox", "")
    guide = item.get("practiceGuide") or {}
    goal = guide.get("goal") or item.get("instructions") or item.get("question", "")
    lines = exploration_prefix(sandbox)
    lines.append(f"-- {goal}")

    ref_u = ref.upper()
    if re.search(r"\b(INNER|LEFT|RIGHT|CROSS)\s+JOIN\b", ref_u):
        m = re.search(
            r"SELECT\s+([\s\S]+?)\s+FROM\s+(\S+)",
            ref,
            re.I,
        )
        if m:
            cols, from_t = m.group(1).strip(), m.group(2).strip()
            if cols == "*":
                lines.append("SELECT *")
            else:
                lines.append(f"SELECT {cols}")
            lines.append(f"FROM {from_t}")
            lines.append("-- ↑ JOIN 조건을 작성해 완성하세요")
            return "\n".join(lines) + "\n"

    if re.search(r"\b(UNION|EXCEPT|INTERSECT)\b", ref_u):
        m = re.match(
            r"([\s\S]*?)\b(UNION(?:\s+ALL)?|EXCEPT|INTERSECT)\b([\s\S]*)",
            ref,
            re.I,
        )
        if m:
            lines.append("-- 아래 집합 연산 쿼리를 한 문장으로 완성하세요.")
            lines.append(m.group(1).strip())
            lines.append(m.group(2).upper().replace("  ", " "))
            lines.append(m.group(3).strip().rstrip(";"))
            lines.append(";")
            return "\n".join(lines) + "\n"

    if ref_u.startswith("SELECT"):
        m = re.search(r"FROM\s+(\S+)", ref, re.I)
        from_t = m.group(1) if m else "테이블명"
        lines.append("SELECT /* TODO: 컬럼·함수 */")
        lines.append(f"FROM {from_t}")
        if re.search(r"\bWHERE\b", ref_u):
            lines.append("WHERE /* TODO: 조건 */")
        if re.search(r"\bGROUP\s+BY\b", ref_u):
            lines.append("GROUP BY /* TODO */")
        if re.search(r"\bHAVING\b", ref_u):
            lines.append("HAVING /* TODO */")
        if re.search(r"\bORDER\s+BY\b", ref_u):
            lines.append("ORDER BY /* TODO */")
        if re.search(r"\bLIMIT\b", ref_u):
            lines.append("LIMIT /* TODO */")
        lines.append(";")
        return "\n".join(lines) + "\n"

    if ref_u.startswith("INSERT"):
        m = re.search(r"INSERT INTO\s+(\w+)\s*\(([^)]+)\)", ref, re.I)
        if m:
            tbl, cols = m.group(1), m.group(2).strip()
            lines.append(f"INSERT INTO {tbl} ({cols})")
            lines.append("VALUES")
            lines.append("  -- TODO: (값) 입력")
            lines.append(";")
            if re.search(r"\bSELECT\b", ref_u):
                lines.append("")
                lines.append(f"-- TODO: SELECT * FROM {tbl};")
        else:
            lines.append("INSERT INTO 테이블명 (컬럼...) VALUES (값...);")
        return "\n".join(lines) + "\n"

    if ref_u.startswith("UPDATE"):
        lines.append("-- UPDATE 문을 작성하세요.")
        m = re.search(r"UPDATE\s+(\S+)", ref, re.I)
        lines.append(f"UPDATE {m.group(1) if m else '테이블명'}")
        lines.append("SET /* TODO */")
        if "WHERE" in ref_u:
            lines.append("WHERE /* TODO */")
        lines.append(";")
        return "\n".join(lines) + "\n"

    if ref_u.startswith("DELETE"):
        m = re.search(r"FROM\s+(\S+)", ref, re.I)
        tbl = m.group(1) if m else "테이블명"
        lines.append(f"DELETE FROM {tbl}")
        if "WHERE" in ref_u:
            lines.append("-- TODO: WHERE 조건 작성")
        lines.append(";")
        if "INSERT" in ref_u:
            lines.append("")
            lines.append("-- TODO: INSERT 문 작성")
        if re.search(r"\bSELECT\b", ref_u):
            lines.append("-- TODO: SELECT로 결과 확인")
        return "\n".join(lines) + "\n"

    if ref_u.startswith("ALTER"):
        m = re.search(r"ALTER TABLE\s+(\w+)", ref, re.I)
        tbl = m.group(1) if m else "테이블명"
        lines.append(f"ALTER TABLE {tbl}")
        lines.append("-- TODO: ADD COLUMN ... 작성")
        lines.append(";")
        if "PRAGMA" in ref_u:
            lines.append("")
            lines.append(f"-- TODO: PRAGMA table_info({tbl});")
        return "\n".join(lines) + "\n"

    if ref_u.startswith("DROP"):
        m = re.search(r"DROP TABLE\s+(\w+)", ref, re.I)
        tbl = m.group(1) if m else "테이블명"
        lines.append(f"DROP TABLE {tbl};")
        return "\n".join(lines) + "\n"

    if "CREATE TABLE" in ref_u:
        creates = re.findall(r"CREATE TABLE\s+(\w+)\s*\(([^;]+)\)", ref, re.I | re.DOTALL)
        if creates:
            for tbl, body in creates:
                cols = [c.strip() for c in body.strip().split(",") if c.strip()]
                lines.append(f"CREATE TABLE {tbl} (")
                if len(cols) >= 2:
                    lines.append(f"  {cols[0]},")
                    lines.append(f"  {cols[1]}")
                    if len(cols) > 2:
                        lines.append(f"  -- TODO: {', '.join(cols[2:])}")
                elif cols:
                    lines.append(f"  {cols[0]}")
                    lines.append("  -- TODO: 나머지 컬럼 추가")
                else:
                    lines.append("  -- TODO: 컬럼 정의")
                lines.append(");")
                lines.append("")
            if "PRAGMA" in ref_u:
                pragmas = re.findall(r"PRAGMA\s+table_info\((\w+)\)", ref, re.I)
                for t in pragmas:
                    lines.append(f"-- TODO: PRAGMA table_info({t});")
            elif "SQLITE_MASTER" in ref_u or "SQLITE_MASTER" in ref:
                lines.append("-- TODO: SELECT name FROM sqlite_master WHERE type='table';")
            return "\n".join(lines).rstrip() + "\n"
        lines.append("CREATE TABLE 테이블명 (")
        lines.append("  id INTEGER PRIMARY KEY")
        lines.append("  -- TODO: 나머지 컬럼 정의")
        lines.append(");")
        return "\n".join(lines) + "\n"

    lines.append("-- 아래에 SQL을 작성하세요.")
    return "\n".join(lines) + "\n"


def enhance_guide(item: dict) -> bool:
    guide = item.setdefault("practiceGuide", {})
    sandbox = item.get("sandbox", "")
    changed = False
    tables = SANDBOX_TABLES.get(sandbox, ())
    schema_hint = SANDBOX_SCHEMA_HINT.get(sandbox)

    if tables and not guide.get("tables"):
        guide["tables"] = list(tables)
        changed = True
    elif item.get("sandbox") and not guide.get("tables"):
        sb = item["sandbox"]
        if sb in SANDBOX_TABLES:
            guide["tables"] = list(SANDBOX_TABLES[sb])
            changed = True
        elif re.search(r"FROM\s+(\S+)", item.get("referenceSql", ""), re.I):
            guide["tables"] = [re.search(r"FROM\s+(\S+)", item["referenceSql"], re.I).group(1)]
            changed = True

    if schema_hint and not guide.get("schemaHint"):
        guide["schemaHint"] = schema_hint
        changed = True

    ref = (item.get("referenceSql") or "").upper()
    steps = guide.get("steps") or []
    if tables and re.search(r"\bJOIN\b", ref):
        t0, t1 = tables[0], tables[1] if len(tables) > 1 else ""
        new_steps = [
            f"기준 테이블 {t0}에서 SELECT·FROM 작성",
            f"{t1} 테이블과 JOIN (ON 조건 확인)" if t1 else "JOIN 조건 작성",
        ]
        if guide.get("outputColumns"):
            new_steps.append(f"출력 컬럼: {', '.join(guide['outputColumns'])}")
        if "ORDER BY" in ref:
            new_steps.append("ORDER BY로 정렬")
        if new_steps != steps:
            guide["steps"] = new_steps
            changed = True

    if tables and not re.search(r"\bJOIN\b", ref) and "FROM" in ref:
        m = re.search(r"FROM\s+(\S+)", item.get("referenceSql", ""), re.I)
        if m:
            tbl = m.group(1)
            if not any(tbl.lower() in s.lower() for s in steps):
                guide["steps"] = [f"{tbl} 테이블을 FROM에 사용"] + steps
                changed = True

    return changed


def patch_file(path: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data["items"]
    n = 0
    for item in items:
        if not item.get("eliceFormat") or item.get("itemType") != "sql":
            continue
        if item.get("dndOnly"):
            continue
        if not item.get("starterSql") and not item.get("referenceSql"):
            continue
        new_starter = rebuild_starter(item)
        if item.get("starterSql") != new_starter:
            item["starterSql"] = new_starter
            n += 1
        if enhance_guide(item):
            n += 1
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{path.name}: {n} updates")
    return n


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent / "data"
    total = 0
    for fp in root.glob("*.json"):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        if any(i.get("eliceFormat") and i.get("itemType") == "sql" for i in data.get("items", [])):
            total += patch_file(fp)
    print("total", total)
