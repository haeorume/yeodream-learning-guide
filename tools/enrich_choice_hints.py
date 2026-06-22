# -*- coding: utf-8 -*-
"""선택형 문항 — 힌트·해설·오답 rationale 자동 보강."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

GENERIC_WRONG = "이 보기는 정답이 아닙니다."

WRONG_QUESTION_RE = re.compile(r"(옳지\s*않|틀린|아닌\s*것|잘못|거짓)")
ORDER_QUESTION_RE = re.compile(r"(순서|단계|경로|동작\s*순|처리\s*순|흐름.*(올바른|맞는|적절))")
ACRONYM_RE = re.compile(r"\(([A-Za-z][A-Za-z\s]{2,60})\)")
CODE_QUESTION_RE = re.compile(r"(출력|결과|값은|실행)")


def is_choice(item: dict) -> bool:
    t = item.get("itemType", "choice")
    if t in ("sql", "python") and not item.get("options"):
        return False
    return bool(item.get("options"))


def correct_option(item: dict) -> dict | None:
    for opt in item.get("options") or []:
        if opt.get("isCorrect"):
            return opt
    return None


def wrong_options(item: dict) -> list[dict]:
    return [o for o in (item.get("options") or []) if not o.get("isCorrect")]


def has_hint(item: dict) -> bool:
    return bool((item.get("hint") or "").strip())


def explanation_text(item: dict) -> str:
    return (item.get("explanation") or "").strip()


def summary_text(item: dict) -> str:
    return (item.get("summary") or "").strip()


def is_generic_rationale(text: str) -> bool:
    return not text or text.strip() == GENERIC_WRONG


def mask_answers(text: str, answers: list[str]) -> str:
    out = text
    for ans in sorted({a.strip() for a in answers if a and len(a.strip()) > 1}, key=len, reverse=True):
        out = re.sub(re.escape(ans), "…", out, flags=re.IGNORECASE)
    stripped = out.strip()
    if not stripped or stripped in ("…", "...", ".", "….") or len(stripped) < 6:
        return text
    return out


def indirect_prefix(question: str) -> str:
    if WRONG_QUESTION_RE.search(question):
        return "거짓인 설명을 찾아보세요. "
    if ORDER_QUESTION_RE.search(question):
        return "요청부터 DB 저장까지 흐름을 떠올려 보세요. "
    if CODE_QUESTION_RE.search(question):
        return "코드를 한 줄씩 따라가며 중간 변수 값을 적어 보세요. "
    return "핵심 개념을 떠올려 보세요. "


def hint_from_acronym(question: str) -> str | None:
    m = ACRONYM_RE.search(question)
    if not m:
        return None
    expansion = m.group(1).strip()
    if len(expansion.split()) >= 2:
        words = expansion.split()
        return f"영문 약어의 첫 글자를 순서대로 맞춰 보세요. ({words[0]} … {words[-1]})"
    return f"괄호 안 영문 풀네임의 약자를 생각해 보세요."


def hint_from_summary(item: dict, correct: dict) -> str | None:
    summ = summary_text(item)
    if not summ:
        return None
    answers = item.get("answers") or []
    if correct:
        answers = answers + [correct.get("text", "")]
    body = mask_answers(summ, answers)
    if body == summ and correct:
        text = correct.get("text", "")
        if text and text in body:
            body = body.replace(text, "정답 개념")
    prefix = indirect_prefix(item.get("question", ""))
    if body.endswith("."):
        return prefix + body
    return prefix + body + "."


def hint_from_rationale(correct: dict, item: dict) -> str | None:
    rat = (correct.get("rationale") or "").strip()
    if not rat or is_generic_rationale(rat):
        return None
    answers = item.get("answers") or [correct.get("text", "")]
    body = mask_answers(rat, answers)
    return indirect_prefix(item.get("question", "")) + body


def hint_from_wrong_contrast(item: dict, correct: dict) -> str | None:
    wrong = wrong_options(item)
    if not wrong:
        return None
    if WRONG_QUESTION_RE.search(item.get("question", "")):
        return (
            "각 보기가 사실인지 검증해 보세요. "
            "특히 '항상 같다·어려움이 없다'처럼 절대적으로 말하는 보기를 의심해 보세요."
        )
    summ = summary_text(item)
    if summ:
        return None
    labels = [w.get("text", "")[:20] for w in wrong[:2] if w.get("text")]
    if len(labels) >= 2:
        return f"보기마다 다루는 영역이 다릅니다. 질문이 묻는 맥락과 가장 가까운 개념을 골라 보세요."
    return None


def generate_hint(item: dict) -> str:
    question = item.get("question", "")
    correct = correct_option(item)

    h = hint_from_acronym(question)
    if h:
        return h

    h = hint_from_summary(item, correct or {})
    if h:
        return h

    if correct:
        h = hint_from_rationale(correct, item)
        if h:
            return h

    if correct:
        h = hint_from_wrong_contrast(item, correct)
        if h:
            return h

    if question:
        return indirect_prefix(question) + "보기를 하나씩 지워 가며 가장 잘 맞는 것을 고르세요."
    return "요약·강의 노트에서 관련 키워드를 찾아보세요."


def is_weak_hint(item: dict, hint: str) -> bool:
    q = item.get("question", "")
    h = hint.strip()
    if not h or len(h) < 14:
        return True
    if h.endswith("…") and len(h) < 28:
        return True
    if "…" in h and len(h) < 22:
        return True
    if "DB 저장" in h and not re.search(r"웹|서버|DB|백엔드|클라이언트|애플리케이션", q, re.I):
        return True
    if "요청부터" in h and not ORDER_QUESTION_RE.search(q):
        return True
    return False


def enrich_explanation(item: dict) -> str | None:
    """explanation은 enrich_choice_explanations.py에서 맥락만 정리합니다."""
    exp = explanation_text(item)
    if exp:
        return None
    summ = summary_text(item)
    if summ:
        return summ.split(". ")[0].strip() + ("." if "." in summ.split(". ")[0] else "")
    return None


def improve_wrong_rationale(option: dict, item: dict, correct: dict | None) -> str | None:
    text = (option.get("text") or "").strip()
    current = (option.get("rationale") or "").strip()
    if not is_generic_rationale(current):
        return None
    if not text:
        return None

    correct_text = (correct or {}).get("text", "")
    q = item.get("question", "")

    if text == correct_text:
        return None

    if ".last()" in text or text.endswith(".last()"):
        return "파이썬 리스트에 .last() 메서드는 없습니다. 인덱싱을 사용하세요."
    # 코드·문법형 오답
    if "(" in text and ")" in text and "[" not in text and text.endswith(")"):
        return "파이썬에서는 괄호 ()만으로 컬렉션 원소에 접근하지 않습니다."
    if re.match(r"^[a-zA-Z_]\w*\[\d+\]$", text) and "[-1]" in (correct_text or ""):
        return "양수 인덱스가 범위를 벗어나거나 마지막 원소가 아닐 수 있습니다."
    if text in ("output", "send", "give", "print") and "return" in (correct_text or ""):
        return "함수가 값을 호출부로 돌려줄 때 쓰는 키워드가 아닙니다."
    if text in ("list", "array", "vector") and correct_text and correct_text not in text:
        return f"이 문항의 정답은 {correct_text} 쪽 개념입니다."
    if "for " in text and "in " in text and correct_text and "for" not in correct_text:
        return "반복문 헤더 문법이지만 이 문항이 묻는 핵심과는 다릅니다."

    if WRONG_QUESTION_RE.search(q):
        return "이 설명은 사실과 맞습니다. (문항은 옳지 않은 것을 고릅니다.)"

    if correct_text:
        return "이 보기는 문항이 묻는 핵심 개념과 다른 영역을 가리킵니다."

    return "문항의 핵심 개념과 거리가 있는 보기입니다."


def process_item(item: dict, refresh_weak: bool = True) -> dict:
    stats = {"hint": 0, "explanation": 0, "rationale": 0}
    if not is_choice(item):
        return stats

    hint_val = (item.get("hint") or "").strip()
    if not hint_val or (refresh_weak and is_weak_hint(item, hint_val)):
        item["hint"] = generate_hint(item)
        stats["hint"] = 1

    new_exp = enrich_explanation(item)
    if new_exp and new_exp != explanation_text(item):
        item["explanation"] = new_exp
        stats["explanation"] = 1

    correct = correct_option(item)
    generic_count = sum(1 for w in wrong_options(item) if is_generic_rationale(w.get("rationale", "")))
    if generic_count >= 2 or any(
        ".last()" in (w.get("text") or "")
        and "괄호 ()만으로" in (w.get("rationale") or "")
        for w in wrong_options(item)
    ):
        for w in wrong_options(item):
            improved = improve_wrong_rationale(w, item, correct)
            if improved and improved != (w.get("rationale") or "").strip():
                w["rationale"] = improved
                stats["rationale"] += 1

    return stats


def main() -> int:
    totals = {"hint": 0, "explanation": 0, "rationale": 0, "files": 0}
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        file_stats = {"hint": 0, "explanation": 0, "rationale": 0}
        for item in data.get("items", []):
            s = process_item(item)
            for k in file_stats:
                file_stats[k] += s[k]
        if any(file_stats.values()):
            fp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            totals["files"] += 1
            print(
                f"{fp.name}: hint +{file_stats['hint']}, "
                f"explanation +{file_stats['explanation']}, "
                f"rationale +{file_stats['rationale']}"
            )
        for k in totals:
            if k != "files":
                totals[k] += file_stats[k]

    print(
        f"\n합계: {totals['files']}개 파일 수정 | "
        f"힌트 {totals['hint']}건 | 해설 {totals['explanation']}건 | "
        f"오답 rationale {totals['rationale']}건"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
