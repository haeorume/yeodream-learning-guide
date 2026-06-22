# -*- coding: utf-8 -*-
"""학습문제 폴더(캡처) ↔ 앱 선택형 문항 1:1 매핑·무결성 검증."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
LEARN = Path(r"C:\Users\haeorume\Desktop\학습문제")
REPORT = ROOT / "docs" / "choice-learning-mapping-report.txt"

# 학습문제 폴더 → 앱 section (선택형)
CHOICE_FOLDER_MAP = [
    ("01 IT리터러시", "05/26 IT 리터러시"),
    ("02 핵심 운영체제 리눅스 기초", "05/27 핵심 운영체제·리눅스"),
    ("03 네트워크 개론", "05/28 네트워크 개론"),
    ("04 파이썬 기본문법1", "05/29 파이썬 기본 문법 1"),
    ("05 파이썬 기본문법2", "06/01 파이썬 기본·중급 문법"),
    ("06 파이썬 중급문법", "06/02 파이썬 중급 문법"),
    ("07 파이썬 라이브러리활용", "06/04 파이썬 라이브러리 활용"),
    ("08 생성형AI기초", "06/05 생성형 AI 기초"),
    ("09 SQL개요", "06/08 SQL 개요 & DML"),
    ("10 SQL함수와 서브쿼리", "06/09 SQL 함수 & 서브쿼리"),
    ("11 집합 연산자와 계층형 질의", "06/10 집합연산자 & 계층형 질의"),
    ("12 JOIN 및 서브쿼리 심화", "06/11 JOIN 심화 & 서브쿼리 심화"),
    ("13 그룹 함수와 윈도우 함수", "06/12 그룹 함수 & 윈도우 함수"),
    ("14 데이터베이스 개요", "06/15 데이터베이스 개요"),
    ("15 데이터 모델링과 데이터베이스 구현", "06/16 데이터 모델링 & DB 구현"),
    ("16 데이터리터러시와 NUMPY", "06/17 데이터 리터러시 & NumPy"),
    ("17 pandas와 데이터 시각화", "06/18 Pandas & 데이터 시각화"),
]

# 알려진 UI 섞임 패턴 (질문 키워드 → 반드시 보기에 있어야 할 단서)
KNOWN_PAIRS = [
    (r"items\[0\]|인덱스 0", r"items\[0\]|items\[-1\]"),
    (r"프로세스.*ps|ps -ef|실행 중인 프로세스", r"\bps\b|top|jobs|kill"),
    (r"SEO|검색엔진 최적화", r"SEO|SEM|CDN|API"),
    (r"리눅스.*cd |디렉터리를 이동", r"\bcd\b|pwd|ls|mkdir"),
]


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", str(s).strip().lower())


def list_pngs(folder: str) -> list[str]:
    p = LEARN / folder
    if not p.exists():
        return []
    return sorted(f.name for f in p.glob("*.png"))


def choice_items(data: dict, section: str) -> list[dict]:
    out = []
    for it in data.get("items", []):
        if it.get("itemType", "choice") != "choice" and not it.get("options"):
            continue
        if it.get("section") != section:
            continue
        if not it.get("options"):
            continue
        out.append(it)
    return out


def validate_item_integrity(item: dict) -> list[str]:
    issues = []
    opts = item.get("options") or []
    correct = [o for o in opts if o.get("isCorrect")]
    if len(correct) != 1:
        issues.append(f"correct_count={len(correct)}")
    texts = [o.get("text", "") for o in opts]
    if len(set(norm(t) for t in texts)) != len(texts):
        issues.append("duplicate_option_text")
    answers = item.get("answers") or []
    if answers:
        primary = norm(answers[0])
        if not any(norm(o.get("text", "")) == primary for o in correct):
            issues.append("primary_answer_mismatch")
    return issues


def semantic_check(item: dict) -> list[str]:
    """질문·정답 보기가 주제적으로 맞는지 휴리스틱 검사."""
    issues = []
    q = item.get("question", "")
    correct_text = next((o.get("text", "") for o in item.get("options", []) if o.get("isCorrect")), "")
    all_text = " ".join(o.get("text", "") for o in item.get("options", []))

    for q_pat, a_pat in KNOWN_PAIRS:
        if re.search(q_pat, q, re.I):
            if not re.search(a_pat, correct_text + " " + all_text, re.I):
                issues.append(f"semantic_mismatch q~/{q_pat}/ opts={texts_preview(item)}")
    return issues


def texts_preview(item: dict) -> str:
    return ", ".join(o.get("text", "") for o in item.get("options", []))


def main() -> int:
    basic = json.loads((DATA / "basic-ai-course.json").read_text(encoding="utf-8"))
    lines = [
        "학습문제 ↔ 선택형 문항 1:1 매핑 검증",
        f"학습문제 경로: {LEARN}",
        "",
    ]
    integrity_issues: list[str] = []
    count_rows: list[tuple[str, int, int, str]] = []

    for folder, section in CHOICE_FOLDER_MAP:
        shots = list_pngs(folder)
        items = choice_items(basic, section)
        status = "OK" if shots else "NO_FOLDER"
        if shots and not items:
            status = "NO_ITEMS"
        elif shots and items and abs(len(shots) - len(items)) > max(5, len(items) * 0.15):
            status = f"COUNT_GAP({len(shots)} vs {len(items)})"
        count_rows.append((folder, len(shots), len(items), status))

        for it in items:
            for issue in validate_item_integrity(it):
                integrity_issues.append(f"[{section}] {it['id']}: {issue}")
            for issue in semantic_check(it):
                integrity_issues.append(f"[{section}] {it['id']}: {issue}")

    lines.append("## 폴더별 캡처 수 vs 앱 선택형 문항 수")
    lines.append(f"{'폴더':<36} {'캡처':>6} {'앱':>6}  상태")
    lines.append("-" * 60)
    for folder, sc, ic, st in count_rows:
        lines.append(f"{folder:<36} {sc:>6} {ic:>6}  {st}")

    lines.append("")
    lines.append(f"## 데이터 무결성 이슈: {len(integrity_issues)}건")
    if integrity_issues:
        lines.extend(integrity_issues[:80])
        if len(integrity_issues) > 80:
            lines.append(f"... 외 {len(integrity_issues) - 80}건")
    else:
        lines.append("모든 섹션 선택형 문항의 Q·A·answers가 일치합니다.")

    # 대표 문항 샘플 (리눅스 ps)
    sample = next((i for i in basic["items"] if i.get("id") == "bc-os-02"), None)
    if sample:
        lines.append("")
        lines.append("## 샘플 검증: bc-os-02 (프로세스 ps)")
        lines.append(f"Q: {sample.get('question')}")
        lines.append(f"A: {texts_preview(sample)}")
        lines.append(f"정답: {sample.get('answers', [''])[0]}")

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines[:25]))
    print(f"...\nreport: {REPORT}")
    return 1 if integrity_issues else 0


if __name__ == "__main__":
    sys.exit(main())
