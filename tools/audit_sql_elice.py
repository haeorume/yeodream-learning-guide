# -*- coding: utf-8 -*-
"""SQL 엘리스(타이핑) 실습 품질 점검"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "data"
ISSUES = []


def audit_item(item: dict, src: str) -> None:
    if not item.get("eliceFormat") or item.get("itemType") != "sql" or item.get("dndOnly"):
        return
    iid = item.get("id", "?")
    starter = item.get("starterSql") or ""
    ref = item.get("referenceSql") or ""
    guide = item.get("practiceGuide") or {}

    if re.search(r"\bcal\b", starter, re.I) and "cal" not in ref.lower():
        ISSUES.append((src, iid, "starter에 Python cal 잔여"))

    if re.search(r"modelName|plus|minus", starter) and "python" in (item.get("question") or "").lower():
        ISSUES.append((src, iid, "Python 주석 잔여"))

    if re.search(r"\bJOIN\b", ref, re.I):
        if "JOIN 조건" not in starter and "JOIN" not in starter.split("--")[-1]:
            if "-- ↑ JOIN" not in starter:
                ISSUES.append((src, iid, "JOIN 문제인데 starter에 JOIN 힌트 없음"))
        m = re.search(r"FROM\s+(\S+)", ref, re.I)
        if m and m.group(1) not in starter:
            ISSUES.append((src, iid, f"starter에 기준 테이블 {m.group(1)} 없음"))

    if guide.get("outputColumns") and not guide.get("tables"):
        ISSUES.append((src, iid, "outputColumns 있으나 tables 없음"))

    if item.get("sandbox") and not guide.get("schemaHint") and item["sandbox"] in (
        "sell_product", "employee_position", "library_rental", "name_cross", "request_member"
    ):
        ISSUES.append((src, iid, "JOIN/관계 sandbox인데 schemaHint 없음"))

    if "SELECT /* TODO" in starter and re.search(r"\bJOIN\b", ref, re.I):
        cols = re.search(r"SELECT\s+([\s\S]+?)\s+FROM", ref, re.I)
        if cols and cols.group(1).strip() != "*" and cols.group(1).split(",")[0].strip() not in starter:
            ISSUES.append((src, iid, "JOIN인데 SELECT 컬럼이 TODO로만 남음"))

    n_ref = re.sub(r"\s+", " ", ref.strip().rstrip(";").lower())
    n_start = re.sub(r"\s+", " ", starter.strip().lower())
    if n_ref and n_ref in n_start:
        ISSUES.append((src, iid, "starter에 정답 전체 유출"))


def main():
    for fp in sorted(ROOT.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        for item in data.get("items", []):
            audit_item(item, fp.name)

    if not ISSUES:
        print("OK: SQL elice audit passed")
        return
    by_id = {}
    for src, iid, msg in ISSUES:
        by_id.setdefault((src, iid), []).append(msg)
    for (src, iid), msgs in sorted(by_id.items()):
        print(f"{src} / {iid}:")
        for m in msgs:
            print(f"  - {m}")
    print(f"\nTotal issues: {len(ISSUES)}")


if __name__ == "__main__":
    main()
