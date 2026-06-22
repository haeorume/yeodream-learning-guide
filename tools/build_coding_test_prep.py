# -*- coding: utf-8 -*-
"""코딩테스트 시험대비 덱 생성 — basic-ai-course 풀 + 보충 선택형 문항."""
import copy
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIC = ROOT / "data" / "basic-ai-course.json"
JUNE = ROOT / "data" / "june-review.json"
OUT = ROOT / "data" / "coding-test-prep.json"

EXAM_SCOPE_SECTIONS = None  # None = basic course 전체 sectionOrder

SUPPLEMENT_SECTIONS = [
    "코딩테스트 보충 · 변수·리스트·함수",
    "코딩테스트 보충 · 조건문",
    "코딩테스트 보충 · 반복문",
    "코딩테스트 보충 · 리스트 vs 딕셔너리",
    "코딩테스트 보충 · 문자열·lambda",
    "코딩테스트 보충 · SQL",
    "코딩테스트 보충 · NumPy·Pandas",
]

SPECIAL_SECTION = "6/18 특별문제"

import importlib.util

_patch_spec = importlib.util.spec_from_file_location(
    "patch_0618_practice", ROOT / "tools" / "patch_0618_practice.py"
)
_patch = importlib.util.module_from_spec(_patch_spec)
_patch_spec.loader.exec_module(_patch)
SPECIAL_PYTHON = _patch.SPECIAL_PYTHON
SPECIAL_CHOICE = _patch.SPECIAL_CHOICE


def choice_item(
    item_id,
    section,
    question,
    correct,
    distractors,
    *,
    code="",
    hint="",
    summary="",
    explanation="",
    day="",
    tags=None,
):
    opts = [{"text": correct, "isCorrect": True, "rationale": summary or correct}]
    for d in distractors:
        opts.append({"text": d, "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."})
    random.shuffle(opts)
    return {
        "id": item_id,
        "section": section,
        "day": day or section[:5],
        "itemType": "choice",
        "question": question,
        "code": code,
        "answers": [correct],
        "hint": hint,
        "summary": summary,
        "explanation": explanation,
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": opts,
        "examTags": tags or [],
    }


SUPPLEMENT_CHOICE = [
    choice_item(
        "ct-sup-01",
        "코딩테스트 보충 · 변수·리스트·함수",
        "파이썬에서 변수 x에 정수 10을 저장하는 올바른 문장은?",
        "x = 10",
        ["x == 10", "10 = x", "var x = 10"],
        hint="= 는 대입 연산자입니다.",
        summary="파이썬은 타입 선언 없이 이름에 값을 바로 대입합니다.",
        tags=["variable"],
    ),
    choice_item(
        "ct-sup-02",
        "코딩테스트 보충 · 변수·리스트·함수",
        "리스트 nums = [3, 1, 4]에서 마지막 원소에 접근하는 표현은?",
        "nums[-1]",
        ["nums[3]", "nums.last()", "nums(2)"],
        summary="음수 인덱스 -1은 마지막 원소를 가리킵니다.",
        tags=["list"],
    ),
    choice_item(
        "ct-sup-03",
        "코딩테스트 보충 · 변수·리스트·함수",
        "함수가 값을 돌려줄 때 사용하는 키워드는?",
        "return",
        ["yield만 가능", "send", "output"],
        summary="return으로 호출 결과를 반환합니다. 값이 없으면 None이 반환됩니다.",
        tags=["function"],
    ),
    choice_item(
        "ct-sup-04",
        "코딩테스트 보충 · 조건문",
        "score가 60 이상이면 'pass'를 출력하는 조건문은?",
        "if score >= 60:",
        ["if score >= 60", "when score >= 60:", "if (score >= 60) then"],
        code="score = 72\n# TODO",
        summary="if 뒤에는 조건식과 콜론(:)이 오고, 본문은 들여쓰기로 작성합니다.",
        tags=["conditional"],
    ),
    choice_item(
        "ct-sup-05",
        "코딩테스트 보충 · 조건문",
        "if / elif / else 중, 여러 조건을 순서대로 검사할 때 두 번째 분기에 쓰는 키워드는?",
        "elif",
        ["elseif", "else if", "then"],
        summary="elif는 else if의 줄임으로, 앞 조건이 거짓일 때만 다음 조건을 검사합니다.",
        tags=["conditional"],
    ),
    choice_item(
        "ct-sup-06",
        "코딩테스트 보충 · 반복문",
        "0부터 4까지 정수를 순회하는 for 문은?",
        "for i in range(5):",
        ["for i in range(4):", "for i in 5:", "loop i from 0 to 4"],
        summary="range(5)는 0,1,2,3,4를 생성합니다. 끝 값 5는 포함되지 않습니다.",
        tags=["loop"],
    ),
    choice_item(
        "ct-sup-07",
        "코딩테스트 보충 · 반복문",
        "리스트 items의 각 원소를 순회하는 가장 흔한 패턴은?",
        "for item in items:",
        ["for item in len(items):", "foreach item in items:", "while item in items:"],
        tags=["loop"],
    ),
    choice_item(
        "ct-sup-08",
        "코딩테스트 보충 · 반복문",
        "반복을 즉시 빠져나올 때 사용하는 키워드는?",
        "break",
        ["stop", "exit", "return만 가능"],
        summary="break는 가장 안쪽 반복문을 종료합니다.",
        tags=["loop"],
    ),
    choice_item(
        "ct-sup-09",
        "코딩테스트 보충 · 리스트 vs 딕셔너리",
        "키-값 쌍으로 데이터를 저장하는 파이썬 자료형은?",
        "dict",
        ["list", "tuple", "set"],
        summary="딕셔너리는 {키: 값} 형태이며, 키로 빠르게 값을 조회합니다.",
        tags=["dict"],
    ),
    choice_item(
        "ct-sup-10",
        "코딩테스트 보충 · 리스트 vs 딕셔너리",
        "순서가 있고 인덱스로 접근하는 mutable 시퀀스는?",
        "list",
        ["dict", "set", "frozenset"],
        tags=["list", "dict"],
    ),
    choice_item(
        "ct-sup-11",
        "코딩테스트 보충 · 문자열·lambda",
        "문자열 s = 'hello'를 대문자로 바꾸는 메서드 호출은?",
        "s.upper()",
        ["s.uppercase()", "upper(s)", "s.toUpper()"],
        tags=["string"],
    ),
    choice_item(
        "ct-sup-12",
        "코딩테스트 보충 · 문자열·lambda",
        "한 줄짜리 익명 함수를 만드는 키워드는?",
        "lambda",
        ["def", "fn", "func"],
        code="square = ____ x: x * x",
        summary="lambda 인자: 표현식 형태로 간단한 함수를 정의합니다.",
        tags=["lambda"],
    ),
    choice_item(
        "ct-sup-13",
        "코딩테스트 보충 · 문자열·lambda",
        "열거형(Enum)을 정의할 때 주로 상속하는 표준 클래스는?",
        "Enum",
        ["EnumMeta", "Enumeration", "Choice"],
        summary="from enum import Enum 후 class Color(Enum): ... 형태로 정의합니다.",
        tags=["enum"],
    ),
    choice_item(
        "ct-sup-14",
        "코딩테스트 보충 · SQL",
        "테이블 book에서 title 컬럼만 조회하는 SQL의 시작은?",
        "SELECT title FROM book",
        ["GET title FROM book", "SELECT book.title", "FETCH title IN book"],
        tags=["sql"],
    ),
    choice_item(
        "ct-sup-15",
        "코딩테스트 보충 · SQL",
        "WHERE 절의 역할로 가장 알맞은 설명은?",
        "행 단위 조건으로 결과를 걸러낸다",
        ["열 이름을 바꾼다", "테이블을 합친다", "정렬 순서를 정한다"],
        tags=["sql"],
    ),
    choice_item(
        "ct-sup-16",
        "코딩테스트 보충 · SQL",
        "두 테이블을 공통 키로 연결하는 절은?",
        "JOIN",
        ["UNION", "MERGE", "LINK"],
        tags=["sql"],
    ),
    choice_item(
        "ct-sup-17",
        "코딩테스트 보충 · NumPy·Pandas",
        "NumPy 배열을 만드는 대표 함수는?",
        "np.array",
        ["np.list", "np.matrix_only", "np.make"],
        code="import numpy as np\narr = ____([1, 2, 3])",
        tags=["numpy"],
    ),
    choice_item(
        "ct-sup-18",
        "코딩테스트 보충 · NumPy·Pandas",
        "Pandas에서 CSV 파일을 읽는 함수는?",
        "pd.read_csv",
        ["pd.load_csv", "pd.open_csv", "pd.read_file"],
        tags=["pandas"],
    ),
    choice_item(
        "ct-sup-19",
        "코딩테스트 보충 · NumPy·Pandas",
        "2차원 표 형태 데이터를 다루는 Pandas 핵심 자료구조는?",
        "DataFrame",
        ["Series만 존재", "ndarray", "Table"],
        tags=["pandas"],
    ),
    choice_item(
        "ct-sup-20",
        "코딩테스트 보충 · 변수·리스트·함수",
        "리스트에 원소를 끝에 추가하는 메서드는?",
        "append",
        ["add", "push", "insert만 가능"],
        code="nums = [1, 2]\nnums.____(3)",
        tags=["list"],
    ),
]


def clone_pool_item(item, prefix="ct"):
    cloned = copy.deepcopy(item)
    orig_id = item["id"]
    cloned["id"] = f"{prefix}-{orig_id}"
    cloned["poolSourceId"] = orig_id
    return cloned


def main():
    basic = json.loads(BASIC.read_text(encoding="utf-8"))
    scope = EXAM_SCOPE_SECTIONS or basic["meta"].get("sectionOrder", [])
    scope = [s for s in scope if s != SPECIAL_SECTION]
    scope_set = set(scope)

    pool = []
    seen = set()

    for item in basic["items"]:
        if item.get("section") not in scope_set:
            continue
        if item.get("section") == SPECIAL_SECTION:
            continue
        cloned = clone_pool_item(item)
        pool.append(cloned)
        seen.add(cloned["id"])

    if JUNE.exists():
        june = json.loads(JUNE.read_text(encoding="utf-8"))
        for item in june["items"]:
            if item.get("itemType", "choice") != "choice":
                continue
            cloned = clone_pool_item(item, prefix="ct-jr")
            if cloned["id"] in seen:
                continue
            cloned["section"] = "코딩테스트 보충 · " + (item.get("section", "복습"))
            pool.append(cloned)
            seen.add(cloned["id"])

    for item in SUPPLEMENT_CHOICE:
        if item["id"] not in seen:
            pool.append(item)
            seen.add(item["id"])

    for item in SPECIAL_PYTHON + SPECIAL_CHOICE:
        cloned = clone_pool_item(item, prefix="ct")
        if cloned["id"] in seen:
            continue
        cloned["day"] = "코딩테스트"
        pool.append(cloned)
        seen.add(cloned["id"])

    for item in pool:
        if item.get("itemType") == "sql":
            item["dndDisabled"] = True
            item["examTyping"] = True
            if not item.get("starterSql") and item.get("referenceSql"):
                item["starterSql"] = "-- 아래에 SQL을 직접 작성하세요.\n"

    choice_n = sum(1 for i in pool if i.get("itemType", "choice") == "choice")
    practice_n = sum(1 for i in pool if i.get("itemType") in ("sql", "python"))

    deck = {
        "meta": {
            "id": "coding-test-prep",
            "title": "코딩테스트 시험대비 (6/24)",
            "description": "AI 실무 기본과정 1~4주차 범위 · 퀴즈 20 + 실습 20 모의시험",
            "examDate": "2026-06-24",
            "examDurationMinutes": 120,
            "examFormat": {
                "choiceCount": 20,
                "practiceCount": 20,
                "totalCount": 40,
            },
            "scopeSections": scope,
            "sectionOrder": SUPPLEMENT_SECTIONS
            + [SPECIAL_SECTION]
            + [s for s in scope if s not in SUPPLEMENT_SECTIONS],
        },
        "items": pool,
    }

    OUT.write_text(json.dumps(deck, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"written {OUT}")
    print(f"pool: choice={choice_n} practice={practice_n} total={len(pool)}")


if __name__ == "__main__":
    main()
