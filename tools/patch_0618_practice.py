# -*- coding: utf-8 -*-
"""6/18 특별문제 Python 보충 + library SQL 스키마 연동(eliceFormat) 패치."""
import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIC = ROOT / "data" / "basic-ai-course.json"

LIBRARY_SQL_HEADER = """-- 아래는 book 테이블 구조입니다. (엘리스 도서관 DB · 6권)
PRAGMA table_info(book);

SELECT * FROM book;

"""

SPECIAL_SECTION = "6/18 특별문제"

SPECIAL_PYTHON = [
    {
        "id": "sp-py-ride",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "python",
        "question": "실습: 키에 따른 놀이기구 탑승 여부",
        "instructions": "키를 입력받아 120cm 초과이면 탑승 가능, 아니면 불가능을 출력합니다.",
        "setupCode": (
            "import builtins\n"
            "_inputs = iter(['125'])\n"
            "builtins.input = lambda prompt='': next(_inputs)"
        ),
        "starterCode": (
            "# height를 입력받아 120cm 초과면 탑승 가능합니다.\n"
            "height = int(input())\n"
            "# 아래에 if / else를 작성하세요\n"
        ),
        "referenceCode": (
            "height = int(input())\n"
            "if height > 120:\n"
            "    print('탑승 가능합니다.')\n"
            "else:\n"
            "    print('탑승 불가능합니다.')"
        ),
        "validate": {
            "patterns": ["if", "else", "print", "120"],
            "expectedOutput": "탑승 가능합니다.",
        },
        "hint": "120cm 이하이면 탈 수 없습니다. 비교 연산자 > 를 사용하세요.",
        "summary": "조건문으로 입력값에 따라 다른 메시지를 출력합니다.",
        "practiceGuide": {
            "goal": "키(height)를 입력받아 120cm 초과이면 «탑승 가능합니다.», 아니면 «탑승 불가능합니다.»를 출력합니다.",
            "steps": [
                "height = int(input()) 로 정수 입력을 받습니다.",
                "if height > 120: 분기로 메시지를 출력합니다.",
                "else에서 탑승 불가 메시지를 출력합니다.",
            ],
            "tip": "테스트 입력은 125로 고정되어 있습니다. [실행] 후 출력을 확인하세요.",
        },
        "eliceFormat": True,
    },
    {
        "id": "sp-py-generation",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "python",
        "question": "실습: 출생년도로 세대 분류",
        "instructions": "출생년도를 입력받아 해당 세대를 출력합니다.",
        "setupCode": (
            "import builtins\n"
            "_inputs = iter(['1967'])\n"
            "builtins.input = lambda prompt='': next(_inputs)"
        ),
        "starterCode": (
            "# 출생년도를 입력받아 세대를 출력합니다.\n"
            "# 베이비붐 1955~1963 / X 1964~1979 / 밀레니얼 1980~1994\n"
            "# Z 1995~2010 / 알파 2010~\n"
            "year = int(input())\n"
            "# elif 체인을 작성하세요\n"
        ),
        "referenceCode": (
            "year = int(input())\n"
            "if year >= 1955 and year <= 1963:\n"
            "    print('당신은 베이비붐 세대 입니다.')\n"
            "elif year >= 1964 and year <= 1979:\n"
            "    print('당신은 X 세대 입니다.')\n"
            "elif year >= 1980 and year <= 1994:\n"
            "    print('당신은 밀레니얼 세대 입니다.')\n"
            "elif year >= 1995 and year <= 2010:\n"
            "    print('당신은 Z 세대 입니다.')\n"
            "elif year >= 2010:\n"
            "    print('당신은 알파 세대 입니다.')"
        ),
        "validate": {
            "patterns": ["elif", "print", "세대"],
            "expectedOutput": "당신은 X 세대 입니다.",
        },
        "hint": "if / elif 로 연도 구간을 순서대로 검사하세요.",
        "summary": "다중 분기로 구간별 메시지를 출력합니다.",
        "practiceGuide": {
            "goal": "출생년도에 따라 «당신은 ○○ 세대 입니다.» 형식으로 출력합니다.",
            "steps": [
                "year = int(input())",
                "1955~1963 → 베이비붐, 1964~1979 → X, … 순으로 elif 작성",
                "1967 입력 시 «당신은 X 세대 입니다.»",
            ],
            "tip": "구간 경계(1963/1964 등)를 and 로 묶으면 실수를 줄일 수 있습니다.",
        },
        "eliceFormat": True,
    },
    {
        "id": "sp-py-banana-count",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "python",
        "question": "실습: banana 문자열에서 a 개수",
        "instructions": "문자열 s에서 문자 a의 개수를 세어 출력합니다.",
        "starterCode": (
            's = "banana"\n'
            "cnt = 0\n"
            "# for 문으로 a 개수를 세세요\n"
            "print(cnt)\n"
        ),
        "referenceCode": (
            's = "banana"\n'
            "cnt = 0\n"
            "for ch in s:\n"
            "    if ch == 'a':\n"
            "        cnt += 1\n"
            "print(cnt)\n"
        ),
        "validate": {
            "patterns": ["for", "if", "cnt"],
            "assertCode": "assert cnt == 3",
            "expectedOutput": "3",
        },
        "hint": "for ch in s: 로 한 글자씩 순회합니다.",
        "summary": "문자열 순회 + 조건 카운트 패턴입니다.",
        "practiceGuide": {
            "goal": "«banana»에서 소문자 a가 몇 번 나오는지 출력합니다.",
            "steps": [
                "for ch in s: 로 순회",
                "ch == 'a' 일 때 cnt += 1",
                "print(cnt) → 3",
            ],
            "tip": "s.count('a')도 가능하지만, for·if 연습이 목표입니다.",
        },
        "eliceFormat": True,
    },
    {
        "id": "sp-py-len-banana",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "python",
        "question": "실습: len()으로 문자열 길이",
        "instructions": "문자열 s의 길이를 len()으로 구해 출력합니다.",
        "starterCode": (
            's = "banana"\n'
            "# len(s) 결과를 출력하세요\n"
        ),
        "referenceCode": 's = "banana"\nprint(len(s))\n',
        "validate": {
            "patterns": ["len", "print"],
            "expectedOutput": "6",
        },
        "hint": "len(문자열)은 글자 수를 반환합니다.",
        "summary": "내장 함수 len()으로 시퀀스 길이를 구합니다.",
        "practiceGuide": {
            "goal": "«banana»의 길이 6을 출력합니다.",
            "steps": ["print(len(s)) 한 줄로 출력"],
            "tip": "공백·대소문자도 각각 1글자로 셉니다.",
        },
        "eliceFormat": True,
    },
]

SPECIAL_CHOICE = [
    {
        "id": "sp-ch-banana-out",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "choice",
        "question": "아래 코드의 출력 결과로 옳은 것은? (한 줄씩 출력)",
        "code": (
            's = "banana"\n'
            "for i in s:\n"
            '    if i == "a":\n'
            '        print("A")\n'
            "    else:\n"
            "        print(i)"
        ),
        "answers": ["b, A, n, A, n, A (각 줄에 하나씩)", "bAnAnA"],
        "choicePrompt": "보기 중 올바른 출력 순서를 고르세요.",
        "hint": "a일 때만 A를 출력하고, 나머지 글자는 그대로 출력합니다.",
        "summary": "문자열 for 순회 + 조건 분기 출력 추적 연습입니다.",
        "options": [
            {
                "text": "b, A, n, A, n, A (각 줄에 하나씩)",
                "isCorrect": True,
                "rationale": "b→A→n→A→n→A 순서로 6줄 출력됩니다.",
            },
            {
                "text": "banana (한 줄)",
                "isCorrect": False,
                "rationale": "조건에 따라 a만 A로 바뀝니다.",
            },
            {
                "text": "AAAAAA",
                "isCorrect": False,
                "rationale": "a가 아닌 글자도 출력됩니다.",
            },
            {
                "text": "아무것도 출력되지 않음",
                "isCorrect": False,
                "rationale": "print가 루프 안에서 호출됩니다.",
            },
        ],
    },
    {
        "id": "sp-ch-dict-key",
        "section": SPECIAL_SECTION,
        "day": "06/18",
        "itemType": "choice",
        "question": "아래 코드를 실행하면 어떤 일이 발생하나요?",
        "code": (
            "d1 = {}\n"
            'd1["a"] = "banana"\n'
            'print(d1["c"])'
        ),
        "answers": ["KeyError"],
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "hint": "존재하지 않는 키를 []로 접근하면?",
        "summary": "dict는 키가 없을 때 KeyError가 납니다. get()은 None 또는 기본값을 줍니다.",
        "options": [
            {"text": "KeyError", "isCorrect": True, "rationale": "키 'c'가 없습니다."},
            {"text": "banana 출력", "isCorrect": False, "rationale": "'c' 키는 없습니다."},
            {"text": "None 출력", "isCorrect": False, "rationale": "[] 접근은 get()과 다릅니다."},
            {"text": "빈 문자열 출력", "isCorrect": False, "rationale": "키가 없으면 예외입니다."},
        ],
    },
]


def elice_library_starter(item: dict) -> str:
    raw = (item.get("starterSql") or "").strip()
    if raw.startswith("-- 아래는 book 테이블"):
        return raw
    comment = raw if raw.startswith("--") else f"-- {item.get('instructions') or item.get('question', '')}"
    return LIBRARY_SQL_HEADER + comment + "\n"


def patch_library_items(items: list) -> int:
    n = 0
    for item in items:
        if item.get("sandbox") != "library":
            continue
        item["eliceFormat"] = True
        item["dndDisabled"] = True
        item["starterSql"] = elice_library_starter(item)
        ref = item.get("referenceSql") or ""
        if "홍길동" in ref:
            item["referenceSql"] = ref.replace("홍길동", "작가A")
        if item.get("practiceGuide") and "홍길동" in json.dumps(item["practiceGuide"], ensure_ascii=False):
            g = copy.deepcopy(item["practiceGuide"])
            for k, v in g.items():
                if isinstance(v, str):
                    g[k] = v.replace("홍길동", "작가A")
                elif isinstance(v, list):
                    g[k] = [x.replace("홍길동", "작가A") if isinstance(x, str) else x for x in v]
            item["practiceGuide"] = g
        n += 1
    return n


def main():
    data = json.loads(BASIC.read_text(encoding="utf-8"))
    ids = {i["id"] for i in data["items"]}

    lib_n = patch_library_items(data["items"])

    # 정규 수업 덱에서는 특별문제 제거 (코딩테스트 덱 전용)
    before = len(data["items"])
    data["items"] = [
        i for i in data["items"]
        if i.get("section") != SPECIAL_SECTION and not str(i.get("id", "")).startswith("sp-")
    ]
    removed = before - len(data["items"])
    order = data["meta"].setdefault("sectionOrder", [])
    if SPECIAL_SECTION in order:
        order.remove(SPECIAL_SECTION)

    BASIC.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"patched library sql items: {lib_n}")
    print(f"removed special items from basic: {removed}")
    print(f"written {BASIC}")


if __name__ == "__main__":
    main()
