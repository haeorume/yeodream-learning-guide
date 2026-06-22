# -*- coding: utf-8 -*-
"""선택형 문항 데이터 무결성 이슈 일괄 수정."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def fix_el_0602_05(item: dict) -> bool:
    if item.get("id") not in ("el-0602-05", "ct-el-0602-05"):
        return False
    item["options"] = [
        {"text": "Python과 5살", "isCorrect": False, "rationale": "name 변수 값이 반영되지 않았습니다."},
        {"text": "ELICE와 5살", "isCorrect": False, "rationale": "age*2가 적용되지 않았습니다."},
        {"text": "ELICE와 10살", "isCorrect": True, "rationale": "upper()와 age*2가 적용됩니다."},
        {"text": "NAME와 10살", "isCorrect": False, "rationale": "name 변수 값이 반영되지 않았습니다."},
    ]
    return True


def fix_sql_002_003(item: dict) -> bool:
    iid = item.get("id", "")
    if iid.endswith("sql-002") or iid == "sql-002":
        for opt in item.get("options", []):
            if opt.get("text", "").startswith("INSERT INTO book"):
                opt["isCorrect"] = False
                opt["rationale"] = "빈칸에는 키워드 두 단어(INSERT INTO)만 들어갑니다."
        return True
    if iid.endswith("sql-003") or iid == "sql-003":
        for opt in item.get("options", []):
            if opt.get("text", "").startswith("DELETE FROM book"):
                opt["isCorrect"] = False
                opt["rationale"] = "빈칸에는 키워드 두 단어(DELETE FROM)만 들어갑니다."
        return True
    return False


def fix_ct_sup_13(item: dict) -> bool:
    if item.get("id") != "ct-sup-13":
        return False
    item["options"] = [
        {"text": "Choice", "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."},
        {"text": "EnumMeta", "isCorrect": False, "rationale": "Enum의 메타클래스 이름입니다."},
        {"text": "Enum", "isCorrect": True, "rationale": "from enum import Enum 후 class Color(Enum): ... 형태로 정의합니다."},
        {"text": "Enumeration", "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."},
    ]
    return True


def fix_banana_out(item: dict) -> bool:
    if item.get("id") not in ("ct-sp-ch-banana-out", "sp-ch-banana-out"):
        return False
    label = "b, A, n, A, n, A (각 줄에 하나씩)"
    item["answers"] = [label, "bAnAnA"]
    return True


def patch_file(path: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    n = 0
    for item in data.get("items", []):
        if fix_el_0602_05(item):
            n += 1
        if fix_sql_002_003(item):
            n += 1
        if fix_ct_sup_13(item):
            n += 1
        if fix_banana_out(item):
            n += 1
    if n:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return n


def main():
    total = 0
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        c = patch_file(fp)
        if c:
            print(f"{fp.name}: {c} fixes")
            total += c
    print("total fixes", total)


if __name__ == "__main__":
    main()
