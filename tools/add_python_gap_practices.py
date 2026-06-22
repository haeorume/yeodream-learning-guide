# -*- coding: utf-8 -*-
"""
파이썬 기본문법(05/29·06/01) · 중급문법(06/02) 누락 실습 문항 추가.

엘리스 도레미 파이썬 커리큘럼 기준:
- 04 기본1: input, 형변환, 조건문, for 합계
- 05 기본2: range/while, 함수, 리스트 append
- 06 중급: f-string, 컴프리헨션, sorted, random.sample, enumerate
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIC = ROOT / "data" / "basic-ai-course.json"

INPUT_MOCK = (
    "import builtins\n"
    "_inputs = iter({values})\n"
    "builtins.input = lambda prompt='': next(_inputs)"
)


def mock_input(*values: str) -> str:
    quoted = ", ".join(json.dumps(v, ensure_ascii=False) for v in values)
    return INPUT_MOCK.format(values=f"[{quoted}]")


def py_item(
    item_id: str,
    section: str,
    day: str,
    question: str,
    instructions: str,
    reference_code: str,
    *,
    setup_code: str = "",
    validate: dict | None = None,
    hint: str = "",
    summary: str = "",
    practice_guide: dict | None = None,
) -> dict:
    item = {
        "id": item_id,
        "section": section,
        "day": day,
        "itemType": "python",
        "question": question,
        "instructions": instructions,
        "starterCode": reference_code,
        "referenceCode": reference_code,
        "validate": validate or {"patterns": ["print"]},
        "hint": hint,
        "summary": summary,
        "practiceGuide": practice_guide
        or {
            "goal": instructions,
            "steps": [],
            "tip": hint or "완성 후 [실행]으로 결과를 확인하세요.",
        },
        "eliceFormat": True,
    }
    if setup_code:
        item["setupCode"] = setup_code
    return item


NEW_ITEMS = [
    # ── 05/29 파이썬 기본 문법 1 (04 기본문법1 보완) ─────────────────────
    py_item(
        "el-py-0529-01",
        "05/29 파이썬 기본 문법 1",
        "05/29",
        "실습: 따라쟁이 앵무새 — input으로 받아 출력",
        "input()으로 한 줄을 입력받아 그대로 print 합니다. input() 괄호 안에 안내 문자열을 넣지 마세요.",
        "word = input()\nprint(word)",
        setup_code=mock_input("Hello"),
        validate={"patterns": ["input", "print"], "expectedOutput": "Hello"},
        hint="input()은 문자열을 반환합니다. 받은 값을 변수에 넣고 print 하세요.",
        summary="input → print 에코(앵무새) 패턴입니다.",
        practice_guide={
            "goal": "입력한 문장을 그대로 다시 출력합니다.",
            "steps": [
                "word = input() 으로 한 줄 입력을 받습니다.",
                "print(word) 로 동일한 내용을 출력합니다.",
            ],
            "tip": "테스트 입력은 Hello 로 고정되어 있습니다.",
        },
    ),
    py_item(
        "el-py-0529-02",
        "05/29 파이썬 기본 문법 1",
        "05/29",
        "실습: 2배로 적금 — input·int·곱셈",
        "money에 input으로 입력받고, int로 변환한 뒤 2배를 print 합니다. input() 괄호 안에 문자열을 넣지 마세요.",
        "money = input()\nmoney = int(money)\nprint(money * 2)",
        setup_code=mock_input("250"),
        validate={"patterns": ["input", "int", "print"], "expectedOutput": "500"},
        hint="문자열 입력 → int() 형변환 → * 2",
        summary="input·형변환·산술 연산 기초 실습입니다.",
        practice_guide={
            "goal": "입력한 금액의 2배를 출력합니다.",
            "steps": [
                "money = input() 으로 문자열 입력",
                "money = int(money) 로 정수 변환",
                "print(money * 2)",
            ],
            "tip": "테스트 입력 250 → 출력 500",
        },
    ),
    py_item(
        "el-py-0529-03",
        "05/29 파이썬 기본 문법 1",
        "05/29",
        "실습: 점수로 합격·불합격 판정",
        "score를 input으로 받아 60점 이상이면 «합격», 미만이면 «불합격»을 출력합니다.",
        "score = int(input())\nif score >= 60:\n    print('합격')\nelse:\n    print('불합격')",
        setup_code=mock_input("72"),
        validate={
            "patterns": ["if", "else", "print", "60"],
            "expectedOutput": "합격",
        },
        hint="if score >= 60: 과 else: 로 분기합니다.",
        summary="비교 연산과 if/else 조건문 실습입니다.",
        practice_guide={
            "goal": "60점 기준 합격·불합격을 출력합니다.",
            "steps": [
                "score = int(input())",
                "if score >= 60: print('합격')",
                "else: print('불합격')",
            ],
            "tip": "테스트 입력 72 → 합격",
        },
    ),
    py_item(
        "el-py-0529-04",
        "05/29 파이썬 기본 문법 1",
        "05/29",
        "실습: for 문으로 리스트 합계",
        "[1, 3, 5] 리스트 원소의 합을 for 문으로 구해 출력합니다.",
        "sum_val = 0\nfor i in [1, 3, 5]:\n    sum_val = sum_val + i\nprint(sum_val)",
        validate={
            "patterns": ["for", "print"],
            "assertCode": "assert sum_val == 9",
            "expectedOutput": "9",
        },
        hint="sum_val = 0 으로 시작해 루프마다 더합니다.",
        summary="for + 리스트 순회 합계 패턴입니다.",
        practice_guide={
            "goal": "리스트 [1, 3, 5]의 합 9를 출력합니다.",
            "steps": [
                "sum_val = 0 초기화",
                "for i in [1, 3, 5]: sum_val += i",
                "print(sum_val)",
            ],
            "tip": "변수 이름은 sum 대신 sum_val 을 씁니다(sum은 내장 함수).",
        },
    ),
    # ── 06/01 파이썬 기본·중급 문법 (05 기본문법2 보완) ───────────────────
    py_item(
        "el-py-0601-01",
        "06/01 파이썬 기본·중급 문법",
        "06/01",
        "실습: range로 1~4 합계",
        "range(1, 5)와 for 문으로 1+2+3+4 합을 구해 출력합니다.",
        "total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)",
        validate={
            "patterns": ["range", "for", "print"],
            "assertCode": "assert total == 10",
            "expectedOutput": "10",
        },
        hint="range(1, 5)는 1,2,3,4 입니다.",
        summary="for-range 반복문 합계 실습입니다.",
    ),
    py_item(
        "el-py-0601-02",
        "06/01 파이썬 기본·중급 문법",
        "06/01",
        "실습: while로 카운트다운",
        "i가 5일 때부터 while로 1까지 출력한 뒤 Launch! 를 출력합니다.",
        "i = 5\nwhile i > 0:\n    print(i)\n    i = i - 1\nprint('Launch!')",
        validate={
            "patterns": ["while", "print"],
            "expectedOutput": "5\n4\n3\n2\n1\nLaunch!",
        },
        hint="while i > 0: 안에서 i를 1씩 줄입니다.",
        summary="while 반복문과 카운트다운 패턴입니다.",
    ),
    py_item(
        "el-py-0601-03",
        "06/01 파이썬 기본·중급 문법",
        "06/01",
        "실습: 함수로 덧셈",
        "add(a, b) 함수를 정의하고 add(3, 4) 결과를 출력합니다.",
        "def add(a, b):\n    return a + b\n\nprint(add(3, 4))",
        validate={
            "patterns": ["def", "return", "print"],
            "expectedOutput": "7",
        },
        hint="def add(a, b): 와 return a + b",
        summary="함수 정의·호출·return 실습입니다.",
    ),
    py_item(
        "el-py-0601-04",
        "06/01 파이썬 기본·중급 문법",
        "06/01",
        "실습: 리스트 append",
        "nums = [1, 2] 에 3을 append 한 뒤 리스트를 출력합니다.",
        "nums = [1, 2]\nnums.append(3)\nprint(nums)",
        validate={
            "patterns": ["append", "print"],
            "expectedOutput": "[1, 2, 3]",
        },
        hint="nums.append(3) 으로 끝에 원소를 추가합니다.",
        summary="리스트 메서드 append 실습입니다.",
    ),
    # ── 06/02 파이썬 중급 문법 (06 중급문법 보완) ─────────────────────────
    py_item(
        "el-py-0602-03",
        "06/02 파이썬 중급 문법",
        "06/02",
        "실습: f-string 포맷팅",
        "name과 age 변수를 f-string으로 «{name}은 {age}살입니다.» 형식으로 출력합니다.",
        "name = 'elice'\nage = 3\nprint(f'{name}은 {age}살입니다.')",
        validate={
            "patterns": ["f'", "print"],
            "expectedOutput": "elice은 3살입니다.",
        },
        hint="print(f'...{name}...{age}...') 형태입니다.",
        summary="f-string으로 변수를 문자열에 삽입합니다.",
    ),
    py_item(
        "el-py-0602-04",
        "06/02 파이썬 중급 문법",
        "06/02",
        "실습: 리스트 컴프리헨션으로 제곱",
        "1~4 각 숫자의 제곱 리스트를 컴프리헨션으로 만들어 출력합니다.",
        "squares = [n * n for n in range(1, 5)]\nprint(squares)",
        validate={
            "patterns": ["for", "print"],
            "assertCode": "assert squares == [1, 4, 9, 16]",
            "expectedOutput": "[1, 4, 9, 16]",
        },
        hint="[표현식 for n in range(1, 5)]",
        summary="리스트 컴프리헨션 기초입니다.",
    ),
    py_item(
        "el-py-0602-05",
        "06/02 파이썬 중급 문법",
        "06/02",
        "실습: sorted로 정렬",
        "nums = [3, 1, 4, 1, 5] 를 sorted()로 오름차순 정렬해 출력합니다.",
        "nums = [3, 1, 4, 1, 5]\nprint(sorted(nums))",
        validate={
            "patterns": ["sorted", "print"],
            "expectedOutput": "[1, 1, 3, 4, 5]",
        },
        hint="sorted(nums)는 새 리스트를 반환합니다.",
        summary="sorted 함수로 리스트 정렬합니다.",
    ),
    py_item(
        "el-py-0602-06",
        "06/02 파이썬 중급 문법",
        "06/02",
        "실습: enumerate로 인덱스·값 출력",
        "items = ['SQL', 'Python'] 을 enumerate로 (인덱스, 값) 쌍을 출력합니다.",
        "items = ['SQL', 'Python']\nfor idx, name in enumerate(items):\n    print(idx, name)",
        validate={
            "patterns": ["enumerate", "for", "print"],
            "expectedOutput": "0 SQL\n1 Python",
        },
        hint="for idx, name in enumerate(items):",
        summary="enumerate로 인덱스와 값을 함께 순회합니다.",
    ),
    py_item(
        "el-py-0602-07",
        "06/02 파이썬 중급 문법",
        "06/02",
        "실습: random.sample 로또 번호",
        "1~45 중 6개 번호를 random.sample로 뽑아 오름차순으로 출력합니다.",
        "import random\n\nnums = random.sample(range(1, 46), 6)\nprint(sorted(nums))",
        validate={"patterns": ["import random", "sample", "sorted", "print"]},
        hint="random.sample(range(1, 46), 6) 후 sorted()",
        summary="random.sample과 sorted 조합 실습입니다.",
    ),
]

# el-py-0602-01 cal 모듈 샌드박스 주입
CAL_SETUP = (
    "import types, sys\n"
    "cal = types.ModuleType('cal')\n"
    "cal.modelName = 'ELI-C2'\n"
    "cal.plus = lambda a, b: a + b\n"
    "cal.minus = lambda a, b: a - b\n"
    "sys.modules['cal'] = cal\n"
)

PYTHON_OVERRIDES = {
    "el-py-0529-01": (
        "# input()으로 한 줄을 입력받아 그대로 출력하세요.\n"
        "## Q1. input과 print를 완성하세요\n"
        "# TODO: word = input()\n"
        "# TODO: print(word)\n"
    ),
    "el-py-0529-02": (
        "# money: input → int 변환 → 2배 출력\n"
        "## Q1. 아래 세 줄을 완성하세요\n"
        "# TODO: money = input()\n"
        "# TODO: money = int(money)\n"
        "# TODO: print(money * 2)\n"
    ),
    "el-py-0529-03": (
        "# score를 입력받아 60점 이상이면 합격, 아니면 불합격\n"
        "## Q1. if / else 분기를 완성하세요\n"
        "score = int(input())\n"
        "# TODO: if score >= 60:\n"
        "# TODO:     print('합격')\n"
        "# TODO: else:\n"
        "# TODO:     print('불합격')\n"
    ),
    "el-py-0529-04": (
        "# [1, 3, 5] 리스트 원소의 합을 for로 구하세요\n"
        "## Q1. 루프와 합계 변수를 완성하세요\n"
        "sum_val = 0\n"
        "# TODO: for i in [1, 3, 5]:\n"
        "# TODO:     sum_val = sum_val + i\n"
        "print(sum_val)\n"
    ),
    "el-py-0601-01": (
        "# range(1, 5)로 1+2+3+4 합계\n"
        "## Q1. for-range 합계를 완성하세요\n"
        "total = 0\n"
        "# TODO: for i in range(1, 5):\n"
        "# TODO:     total = total + i\n"
        "print(total)\n"
    ),
    "el-py-0601-02": (
        "# 5부터 1까지 출력 후 Launch!\n"
        "## Q1. while 카운트다운을 완성하세요\n"
        "i = 5\n"
        "# TODO: while i > 0:\n"
        "# TODO:     print(i)\n"
        "# TODO:     i = i - 1\n"
        "print('Launch!')\n"
    ),
    "el-py-0601-03": (
        "# add(a, b) 함수를 정의하고 add(3, 4)를 출력하세요\n"
        "## Q1. 함수 정의와 호출을 완성하세요\n"
        "# TODO: def add(a, b):\n"
        "# TODO:     return a + b\n"
        "\n"
        "# TODO: print(add(3, 4))\n"
    ),
    "el-py-0601-04": (
        "# nums = [1, 2] 에 3을 append 하세요\n"
        "## Q1. append 후 출력하세요\n"
        "nums = [1, 2]\n"
        "# TODO: nums.append(3)\n"
        "print(nums)\n"
    ),
    "el-py-0602-03": (
        "name = 'elice'\n"
        "age = 3\n"
        "## Q1. f-string으로 출력하세요\n"
        "# TODO: print(f'{name}은 {age}살입니다.')\n"
    ),
    "el-py-0602-04": (
        "## Q1. 리스트 컴프리헨션으로 1~4 제곱 리스트를 만드세요\n"
        "# TODO: squares = [n * n for n in range(1, 5)]\n"
        "print(squares)\n"
    ),
    "el-py-0602-05": (
        "nums = [3, 1, 4, 1, 5]\n"
        "## Q1. sorted()로 정렬 결과를 출력하세요\n"
        "# TODO: print(sorted(nums))\n"
    ),
    "el-py-0602-06": (
        "items = ['SQL', 'Python']\n"
        "## Q1. enumerate로 인덱스와 값을 출력하세요\n"
        "# TODO: for idx, name in enumerate(items):\n"
        "# TODO:     print(idx, name)\n"
    ),
    "el-py-0602-07": (
        "import random\n"
        "\n"
        "## Q1. 1~45에서 6개를 뽑아 오름차순 출력하세요\n"
        "# TODO: nums = random.sample(range(1, 46), 6)\n"
        "# TODO: print(sorted(nums))\n"
    ),
}

PYTHON_SNIPPETS = {
    "el-py-0529-01": "word = input()\nprint(word)",
    "el-py-0529-02": "money = int(input())\nprint(money * 2)",
    "el-py-0529-03": "if score >= 60:\n    print('합격')",
    "el-py-0529-04": "for i in [1, 3, 5]:\n    sum_val += i",
    "el-py-0601-01": "for i in range(1, 5):\n    total += i",
    "el-py-0601-02": "while i > 0:\n    print(i)",
    "el-py-0601-03": "def add(a, b):\n    return a + b",
    "el-py-0601-04": "nums.append(3)",
    "el-py-0602-03": "print(f'{name}은 {age}살입니다.')",
    "el-py-0602-04": "[n * n for n in range(1, 5)]",
    "el-py-0602-05": "sorted(nums)",
    "el-py-0602-06": "for idx, name in enumerate(items):",
    "el-py-0602-07": "random.sample(range(1, 46), 6)",
}

INSERT_AFTER = {
    "el-py-0529-01": "c0529-py-01",
    "el-py-0529-02": "el-py-0529-01",
    "el-py-0529-03": "el-py-0529-02",
    "el-py-0529-04": "el-py-0529-03",
    "el-py-0601-01": "j0601-05",
    "el-py-0601-02": "el-py-0601-01",
    "el-py-0601-03": "el-py-0601-02",
    "el-py-0601-04": "el-py-0601-03",
    "el-py-0602-03": "el-py-0602-02",
    "el-py-0602-04": "el-py-0602-03",
    "el-py-0602-05": "el-py-0602-04",
    "el-py-0602-06": "el-py-0602-05",
    "el-py-0602-07": "el-py-0602-06",
}


def insert_items(data: dict) -> tuple[int, int]:
    items = data["items"]
    by_id = {it["id"]: i for i, it in enumerate(items)}
    added = updated = 0

    for new_item in NEW_ITEMS:
        iid = new_item["id"]
        if iid in by_id:
            idx = by_id[iid]
            items[idx] = {**items[idx], **new_item}
            updated += 1
            continue

        anchor = INSERT_AFTER.get(iid)
        if anchor and anchor in by_id:
            pos = by_id[anchor] + 1
        else:
            pos = len(items)

        items.insert(pos, new_item)
        by_id = {it["id"]: i for i, it in enumerate(items)}
        added += 1

    return added, updated


def patch_cal_module(data: dict) -> bool:
    for item in data["items"]:
        if item.get("id") != "el-py-0602-01":
            continue
        if item.get("setupCode") != CAL_SETUP:
            item["setupCode"] = CAL_SETUP
            return True
    return False


def main():
    data = json.loads(BASIC.read_text(encoding="utf-8"))
    added, updated = insert_items(data)
    cal = patch_cal_module(data)
    BASIC.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"basic-ai-course: added={added} updated={updated} cal_setup={cal}")
    print("Next: python tools/fix_elice_scaffold_all.py")
    print("      python tools/build_coding_test_prep.py")
    print("      python build_embedded.py")


if __name__ == "__main__":
    main()
