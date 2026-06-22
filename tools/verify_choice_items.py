# -*- coding: utf-8 -*-
"""선택형 문항 데이터 무결성 검증."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", str(s).strip().lower())


def validate_item(item: dict) -> list[str]:
    issues: list[str] = []
    iid = item.get("id", "?")
    opts = item.get("options") or []
    answers = item.get("answers") or []

    if item.get("itemType") not in (None, "choice"):
        if not opts:
            return issues

    if not opts:
        if answers and item.get("itemType", "choice") == "choice":
            issues.append("options_missing")
        return issues

    correct = [o for o in opts if o.get("isCorrect")]
    if len(correct) != 1:
        issues.append(f"correct_count={len(correct)}")

    if len(opts) < 2:
        issues.append("options_too_few")

    texts = [o.get("text", "") for o in opts]
    if len(set(norm(t) for t in texts)) != len(texts):
        issues.append("duplicate_option_text")

    if answers:
        primary = norm(answers[0])
        if not any(norm(o.get("text", "")) == primary for o in correct):
            issues.append(
                f"primary_answer_mismatch answers[0]={answers[0]!r} correct={[o.get('text') for o in correct]}"
            )

    q = item.get("question", "")
    if "items[0]" in " ".join(answers) or "인덱스 0" in q:
        bad = {"기계어", "프로토콜", "SEO", "프레임워크"}
        if bad.intersection(set(texts)):
            issues.append(f"MIXED_options={texts}")

    return issues


def main() -> int:
    all_issues: list[tuple[str, str, list[str]]] = []
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        for item in data.get("items", []):
            t = item.get("itemType", "choice")
            if t not in ("choice", None) and not item.get("options"):
                continue
            if t in ("sql", "python") and not item.get("options"):
                continue
            issues = validate_item(item)
            if issues:
                all_issues.append((fp.name, item.get("id", "?"), issues))

    print(f"검증 완료: {all_issues and len(all_issues) or 0}건 이슈")
    for fname, iid, issues in all_issues[:50]:
        print(f"  [{fname}] {iid}: {', '.join(issues)}")
    if len(all_issues) > 50:
        print(f"  ... 외 {len(all_issues) - 50}건")

    choice_total = 0
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        choice_total += sum(
            1
            for i in data.get("items", [])
            if i.get("itemType", "choice") == "choice" or i.get("options")
        )
    print(f"선택형(보기 있음) 문항 수: {choice_total}")

    report = ROOT / "docs" / "choice-validation-report.txt"
    report.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        f"검증 일시: tools/verify_choice_items.py",
        f"이슈 건수: {len(all_issues)}",
        f"선택형 문항 수: {choice_total}",
        "",
    ]
    for fname, iid, issues in all_issues:
        lines.append(f"[{fname}] {iid}: {', '.join(issues)}")
    if not all_issues:
        lines.append("모든 선택형 문항의 answers·options·정답 보기가 일치합니다.")
    report.write_text("\n".join(lines), encoding="utf-8")
    print(f"report: {report}")
    return 1 if all_issues else 0


if __name__ == "__main__":
    sys.exit(main())
