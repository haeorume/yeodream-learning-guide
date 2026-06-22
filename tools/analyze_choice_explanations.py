# -*- coding: utf-8 -*-
"""선택형 해설 품질 분석."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

GENERIC = "이 보기는 정답이 아닙니다."
WEAK = {
    "이 보기는 문항이 묻는 핵심 개념과 다른 영역을 가리킵니다.",
    "문항의 핵심 개념과 거리가 있는 보기입니다.",
}


def is_choice(item: dict) -> bool:
    return bool(item.get("options"))


def main() -> int:
    stats = {
        "total": 0,
        "no_exp": 0,
        "exp_has_answer": 0,
        "weak_wrong": 0,
        "missing_wrong_rat": 0,
        "generic": 0,
        "short_correct_rat": 0,
    }
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        for item in data.get("items", []):
            if not is_choice(item):
                continue
            stats["total"] += 1
            exp = (item.get("explanation") or "").strip()
            if not exp:
                stats["no_exp"] += 1
            if "정답" in exp or "오답" in exp or "「" in exp:
                stats["exp_has_answer"] += 1
            correct = next((o for o in item.get("options", []) if o.get("isCorrect")), None)
            if correct:
                cr = (correct.get("rationale") or "").strip()
                if len(cr) < 15:
                    stats["short_correct_rat"] += 1
            for w in item.get("options", []):
                if w.get("isCorrect"):
                    continue
                r = (w.get("rationale") or "").strip()
                if not r:
                    stats["missing_wrong_rat"] += 1
                if r == GENERIC:
                    stats["generic"] += 1
                if r in WEAK or (r and len(r) < 12):
                    stats["weak_wrong"] += 1
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
