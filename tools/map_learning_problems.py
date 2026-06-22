# -*- coding: utf-8 -*-
"""학습문제 폴더 ↔ 앱 실습 문항 1:1 매핑 리포트"""
import json
import os
import re
from pathlib import Path

ROOT = Path(r"C:\Users\haeorume\Desktop\학습문제")
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

FOLDER_MAP = [
    ("04 파이썬 기본문법1", "05/29 파이썬 기본 문법 1", "python"),
    ("05 파이썬 기본문법2", "06/01 파이썬 기본·중급 문법", "python"),
    ("06 파이썬 중급문법", "06/02 파이썬 중급 문법", "python"),
    ("07 파이썬 라이브러리활용", "06/04 파이썬 라이브러리 활용", "python"),
    ("09 SQL개요", "06/08 SQL 개요 & DML", "sql"),
    ("10 SQL함수와 서브쿼리", "06/09 SQL 함수 & 서브쿼리", "sql"),
    ("11 집합 연산자와 계층형 질의", "06/10 집합연산자 & 계층형 질의", "sql"),
    ("12 JOIN 및 서브쿼리 심화", "06/11 JOIN 심화 & 서브쿼리 심화", "sql"),
    ("13 그룹 함수와 윈도우 함수", "06/12 그룹 함수 & 윈도우 함수", "sql"),
    ("14 데이터베이스 설계", "06/15 데이터베이스 개요", "sql"),
    ("15 관계형 데이터베이스 설계", "06/16 데이터 모델링 & DB 구현", "sql"),
    ("16 데이터리터러시와 NUMPY", "06/17 데이터 리터러시 & NumPy", "python"),
    ("17 pandas와 데이터 시각화", "06/18 Pandas & 데이터 시각화", "python"),
]


def list_shots(folder: str) -> list[str]:
    p = ROOT / folder
    if not p.exists():
        return []
    return sorted(f.name for f in p.glob("*.png"))


def practice_items(data: dict, section: str, kind: str) -> list[dict]:
    out = []
    for it in data["items"]:
        if it.get("itemType") != kind:
            continue
        if it.get("section") != section:
            continue
        if not (it.get("starterCode") or it.get("starterSql") or it.get("eliceFormat")):
            continue
        if it.get("itemType") == "choice":
            continue
        out.append(it)
    return out


def scaffold_level(item: dict) -> str:
    starter = (item.get("starterCode") or item.get("starterSql") or "").strip()
    ref = (item.get("referenceCode") or item.get("referenceSql") or "").strip()
    if not starter:
        return "HARD"
    if "아래에 코드를 작성" in starter and "TODO" not in starter and "Q1" not in starter:
        if starter.count("\n") <= 3:
            return "HARD"
    if re.search(r"TODO|Q1\.|None\s+#\s+TODO|/\*\s*TODO", starter):
        return "GOOD"
    if "PRAGMA" in starter or "SELECT * FROM" in starter.upper():
        if "-- ↑" in starter or "/* TODO" in starter:
            return "GOOD"
    n1 = re.sub(r"\s+", " ", starter.lower())
    n2 = re.sub(r"\s+", " ", ref.lower())
    if ref and n2 in n1:
        return "LEAK"
    if "CREATE TABLE /* TODO */" in starter:
        return "HARD"
    return "MEDIUM"


def main():
    basic = json.loads((DATA_DIR / "basic-ai-course.json").read_text(encoding="utf-8"))
    lines = ["# 학습문제 ↔ 실습 문항 1:1 매핑", ""]
    for folder, section, kind in FOLDER_MAP:
        shots = list_shots(folder)
        items = practice_items(basic, section, kind)
        lines.append(f"## {folder} → {section}")
        lines.append(f"- 스크린샷: {len(shots)}장 | 앱 실습: {len(items)}건")
        for it in items:
            lvl = scaffold_level(it)
            q = (it.get("question") or "")[:50]
            lines.append(f"  - [{lvl:6}] {it['id']}: {q}")
        lines.append("")
    out = Path(__file__).resolve().parent.parent / "docs" / "learning-problem-mapping.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines), encoding="utf-8")
    print(out)
    print("\n".join(lines[:40]))


if __name__ == "__main__":
    main()
