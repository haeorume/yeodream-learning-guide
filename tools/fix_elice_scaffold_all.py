# -*- coding: utf-8 -*-
"""
학습문제(엘리스) Q1 스캐폴딩 기준으로 실습형 starter·practiceGuide 일괄 보강.

- Python: 보일러플레이트 + ## Q1 + TODO (처음부터 작성 금지)
- Viz: pie/bar 추가, ct-viz 동기화는 build_coding_test_prep으로 연동
- SQL: dnd·DDL·윈도우 포함 전 실습 starter 재생성
"""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

# ── Python: 학습문제 폴더 ↔ 문항 ID 1:1 오버라이드 ─────────────────────────
PYTHON_OVERRIDES: dict[str, str] = {
    # 04 파이썬 기본문법1
    "c0529-py-01": (
        "# 1부터 5까지 for 루프로 한 줄씩 출력하세요.\n"
        "## Q1. 아래 for 루프를 완성하세요\n"
        "for i in range(1, 6):\n"
        "    # TODO: print(i)\n"
    ),
    # 07 파이썬 라이브러리활용
    "el-py-0602-01": (
        "# cal.py에 plus, minus, modelName이 정의되어 있다고 가정합니다.\n"
        "import cal\n"
        "\n"
        "## Q1. modelName, plus(3,4), minus(9,4) 결과를 출력하세요\n"
        "# TODO: print(cal.modelName)\n"
        "# TODO: print(cal.plus(3, 4))\n"
        "# TODO: print(cal.minus(9, 4))\n"
    ),
    "el-py-0602-02": (
        "# randrange(1,11)와 math.log(5184,72)를 계산해 출력합니다.\n"
        "import random\n"
        "import math\n"
        "\n"
        "## Q1. 아래 두 줄을 완성하세요\n"
        "# TODO: print(random.randrange(1, 11))\n"
        "# TODO: print(math.log(5184, 72))\n"
    ),
    "el-py-0604-03": (
        "# datetime.date.today()로 오늘 날짜를 출력합니다.\n"
        "from datetime import date\n"
        "\n"
        "## Q1. 오늘 날짜를 출력하세요\n"
        "# TODO: print(date.today())\n"
    ),
    "el-py-0604-04": (
        "# random.choice로 fruits 리스트에서 하나를 골라 출력합니다.\n"
        "import random\n"
        "\n"
        "fruits = ['apple', 'banana', 'cherry']\n"
        "\n"
        "## Q1. choice로 과일 하나를 출력하세요\n"
        "# TODO: print(random.choice(fruits))\n"
    ),
    "el-py-0604-05": (
        "# math.ceil(3.7)=4, math.floor(3.7)=3을 출력합니다.\n"
        "import math\n"
        "\n"
        "## Q1. ceil과 floor 결과를 출력하세요\n"
        "# TODO: print(math.ceil(3.7))\n"
        "# TODO: print(math.floor(3.7))\n"
    ),
    # 17 pandas·시각화 — 엘리스 실습4·5 패턴
    "viz-01": (
        "import matplotlib.pyplot as plt\n"
        "\n"
        "x = [1, 2, 3, 4]\n"
        "y = [2, 4, 1, 5]\n"
        "\n"
        "fig, ax = plt.subplots()\n"
        "\n"
        "## Q1. 선 그래프를 그리는 코드를 작성해 주세요\n"
        "# TODO: plt.plot(x, y)\n"
        "\n"
        "plt.show()\n"
    ),
    "viz-02": (
        "import matplotlib.pyplot as plt\n"
        "\n"
        "# df는 setupCode로 이미 로드됨\n"
        "fig, ax = plt.subplots()\n"
        "\n"
        "## Q1. 어른(x)·청소년(y) 산점도를 그리세요\n"
        "# TODO: plt.scatter(df['어른'], df['청소년'])\n"
        "# TODO: plt.xlabel('어른')\n"
        "# TODO: plt.ylabel('청소년')\n"
        "\n"
        "plt.show()\n"
    ),
    # 04 파이썬 기본문법1 보완
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
    # 05 파이썬 기본문법2 보완 → 06/01
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
    # 06 파이썬 중급문법 보완 → 06/02
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

PYTHON_SNIPPETS: dict[str, str] = {
    "c0529-py-01": "for i in range(1, 6):\n    print(i)",
    "el-py-0602-01": "import cal\nprint(cal.modelName)\nprint(cal.plus(3, 4))",
    "el-py-0602-02": "random.randrange(1, 11)\nmath.log(5184, 72)",
    "el-py-0604-03": "from datetime import date\nprint(date.today())",
    "el-py-0604-04": "random.choice(fruits)",
    "el-py-0604-05": "math.ceil(3.7)\nmath.floor(3.7)",
    "viz-01": "plt.plot(x, y)",
    "viz-02": "plt.scatter(df['어른'], df['청소년'])",
    "viz-03": "plt.pie(ratio, labels=labels)\nplt.axis('equal')",
    "viz-04": "plt.bar(labels, ratio)",
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

# ── SQL DDL: 엘리스형 컬럼 틀 ───────────────────────────────────────────────
DDL_STARTERS: dict[str, str] = {
    "sql-0615-01": (
        "-- kickboard 테이블을 CREATE TABLE로 생성하고 구조를 확인합니다.\n"
        "-- 위 CREATE TABLE을 완성한 뒤 [전체 실행]하세요. (아래에 새 CREATE TABLE를 추가하지 마세요)\n"
        "CREATE TABLE kickboard (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  model TEXT NOT NULL\n"
        "  -- TODO: , battery INTEGER, price INTEGER UNIQUE 추가\n"
        ");\n"
        "\n"
        "-- TODO: PRAGMA table_info(kickboard);\n"
    ),
    "sql-0615-02": (
        "-- kickboard 테이블에 2건을 INSERT하고 SELECT * 로 전체 조회합니다.\n"
        "INSERT INTO kickboard (id, model, battery, price)\n"
        "VALUES\n"
        "  -- TODO: (1, 'A-100', 80, 150000),\n"
        "  -- TODO: (2, 'B-200', 90, 180000)\n"
        ";\n"
        "\n"
        "-- TODO: SELECT * FROM kickboard;\n"
    ),
    "sql-0615-03": (
        "-- ALTER TABLE로 kickboard에 status 컬럼을 추가합니다.\n"
        "ALTER TABLE kickboard\n"
        "  -- TODO: ADD COLUMN status TEXT DEFAULT 'available'\n"
        ";\n"
        "\n"
        "-- TODO: PRAGMA table_info(kickboard);\n"
    ),
    "sql-0615-05": (
        "-- ERD에 맞게 customer·kickboard 테이블을 생성합니다.\n"
        "CREATE TABLE customer (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  name TEXT NOT NULL\n"
        "  -- TODO: , phone TEXT UNIQUE\n"
        ");\n"
        "\n"
        "CREATE TABLE kickboard (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  model TEXT NOT NULL\n"
        "  -- TODO: , battery INTEGER, price INTEGER\n"
        ");\n"
        "\n"
        "-- TODO: PRAGMA table_info(customer);\n"
        "-- TODO: PRAGMA table_info(kickboard);\n"
    ),
    "sql-0615-06": (
        "-- borrow 관계 테이블을 복합 PK와 FK로 생성합니다.\n"
        "CREATE TABLE borrow (\n"
        "  customer_id INTEGER NOT NULL,\n"
        "  kickboard_id INTEGER NOT NULL,\n"
        "  borrow_date TEXT NOT NULL\n"
        "  -- TODO: , return_date TEXT, status TEXT CHECK(...), PRIMARY KEY, FOREIGN KEY\n"
        ");\n"
    ),
    "sql-0616-02": (
        "-- customer와 borrow를 분리해 2NF를 적용합니다.\n"
        "CREATE TABLE borrow (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  customer_id INTEGER NOT NULL,\n"
        "  kickboard_model TEXT NOT NULL\n"
        "  -- TODO: , borrow_date TEXT, return_date TEXT, FOREIGN KEY(customer_id)\n"
        ");\n"
        "\n"
        "-- TODO: INSERT INTO borrow ...\n"
        "-- TODO: SELECT * FROM borrow;\n"
    ),
    "sql-0616-03": (
        "-- company·price를 분리해 3NF를 적용합니다.\n"
        "CREATE TABLE price (\n"
        "  model TEXT PRIMARY KEY,\n"
        "  price INTEGER NOT NULL\n"
        "  -- TODO: , company_id INTEGER NOT NULL, FOREIGN KEY(company_id)\n"
        ");\n"
        "\n"
        "-- TODO: INSERT INTO price ...\n"
        "-- TODO: SELECT * FROM price;\n"
    ),
    "sql-0616-04": (
        "-- 정규화된 4개 테이블 스키마를 완성합니다.\n"
        "CREATE TABLE customer (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  name TEXT NOT NULL\n"
        "  -- TODO: , phone TEXT UNIQUE\n"
        ");\n"
        "\n"
        "CREATE TABLE brand (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  name TEXT NOT NULL\n"
        ");\n"
        "\n"
        "-- TODO: CREATE TABLE kickboard (... FK brand_id)\n"
        "-- TODO: CREATE TABLE borrow (... 복합 PK, FK)\n"
        "-- TODO: SELECT name FROM sqlite_master WHERE type='table';\n"
    ),
    "sql-0616-06": (
        "PRAGMA table_info(kickboard);\n"
        "\n"
        "-- kickboard에 데이터 1건 INSERT 하세요.\n"
        "INSERT INTO kickboard (id, model, battery, price) VALUES\n"
        "  -- TODO: (1, 'C-300', 85, 200000)\n"
        ";\n"
        "\n"
        "-- TODO: SELECT * FROM kickboard;\n"
        "\n"
        "-- PK 중복 INSERT는 오류가 납니다. 아래는 실행하지 마세요.\n"
        "-- INSERT INTO kickboard (id, model, battery, price) VALUES (1, 'X', 1, 1);\n"
    ),
}

INVALID_STARTER_PATTERNS = [
    re.compile(r"CREATE TABLE\s*/\*\s*TODO", re.I),
    re.compile(r"INSERT INTO\s*/\*\s*TODO", re.I),
    re.compile(r"CREATE TABLE\s+\w+\s*\(\s*-- TODO: 컬럼 정의", re.I),
]

SQL_SNIPPETS: dict[str, str] = {
    "el-sql-1201": "INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID",
    "dnd-0610-01": "SELECT name, number FROM request_past\nUNION\nSELECT name, number FROM request_new;",
    "viz-03": "plt.pie(ratio, labels=labels)",
    "viz-04": "plt.bar(labels, ratio)",
    "sql-0615-01": (
        "CREATE TABLE kickboard (\n"
        "  id INTEGER PRIMARY KEY,\n"
        "  model TEXT NOT NULL,\n"
        "  battery INTEGER,\n"
        "  price INTEGER UNIQUE\n"
        ");\n"
        "PRAGMA table_info(kickboard);"
    ),
}

NEW_VIZ_ITEMS = [
    {
        "id": "viz-03",
        "section": "06/18 Pandas & 데이터 시각화",
        "day": "06/18",
        "itemType": "python",
        "question": "실습: 원형 그래프로 비율 표현 (pie)",
        "instructions": "labels와 ratio로 원형 그래프를 그리고 plt.axis('equal')로 원형을 유지합니다.",
        "starterCode": PYTHON_OVERRIDES.get("viz-03")
        or (
            "import matplotlib.pyplot as plt\n\n"
            "labels = ['A', 'B', 'C', 'D']\n"
            "ratio = [25, 30, 20, 25]\n\n"
            "fig, ax = plt.subplots()\n\n"
            "## Q1. 원형 그래프를 만드는 코드를 작성해 주세요\n"
            "# TODO: plt.pie(ratio, labels=labels)\n"
            "# TODO: plt.axis('equal')\n\n"
            "plt.show()\n"
        ),
        "referenceCode": (
            "import matplotlib.pyplot as plt\n\n"
            "labels = ['A', 'B', 'C', 'D']\n"
            "ratio = [25, 30, 20, 25]\n\n"
            "fig, ax = plt.subplots()\n"
            "plt.pie(ratio, labels=labels)\n"
            "plt.axis('equal')\n"
            "plt.show()"
        ),
        "practiceGuide": {
            "goal": "labels·ratio로 원형 그래프를 그리고 원형 비율을 유지합니다.",
            "steps": [
                "plt.pie(ratio, labels=labels)로 원형 그래프를 그립니다",
                "plt.axis('equal')로 찌그러짐을 방지합니다",
                "plt.show()로 확인합니다",
            ],
            "codeSnippet": "plt.pie(ratio, labels=labels)\nplt.axis('equal')",
            "tip": "엘리스 실습4와 같습니다. pie 아래 axis('equal')을 잊지 마세요.",
        },
        "validate": {"patterns": ["pie", "labels", "show"]},
        "eliceFormat": True,
        "summary": "범주형 자료의 비율은 pie chart로 표현합니다.",
        "packages": ["matplotlib"],
    },
    {
        "id": "viz-04",
        "section": "06/18 Pandas & 데이터 시각화",
        "day": "06/18",
        "itemType": "python",
        "question": "실습: 막대 그래프로 비율 비교 (bar)",
        "instructions": "labels와 ratio로 막대 그래프를 그립니다.",
        "starterCode": (
            "import matplotlib.pyplot as plt\n\n"
            "labels = ['월', '화', '수', '목', '금']\n"
            "ratio = [10, 15, 8, 12, 9]\n\n"
            "fig, ax = plt.subplots()\n\n"
            "## Q1. 막대 그래프를 만드는 코드를 작성해 주세요\n"
            "# TODO: plt.bar(labels, ratio)\n\n"
            "plt.show()\n"
        ),
        "referenceCode": (
            "import matplotlib.pyplot as plt\n\n"
            "labels = ['월', '화', '수', '목', '금']\n"
            "ratio = [10, 15, 8, 12, 9]\n\n"
            "fig, ax = plt.subplots()\n"
            "plt.bar(labels, ratio)\n"
            "plt.show()"
        ),
        "practiceGuide": {
            "goal": "labels·ratio로 막대 그래프를 그립니다.",
            "steps": [
                "plt.bar(labels, ratio)로 막대를 그립니다",
                "plt.show()로 확인합니다",
            ],
            "codeSnippet": "plt.bar(labels, ratio)",
            "tip": "엘리스 실습5와 같습니다. bar의 첫 인자는 x축 라벨입니다.",
        },
        "validate": {"patterns": ["bar", "labels", "show"]},
        "eliceFormat": True,
        "summary": "범주별 크기 비교는 bar chart가 적합합니다.",
        "packages": ["matplotlib"],
    },
]

# viz-03 override in PYTHON_OVERRIDES
PYTHON_OVERRIDES["viz-03"] = NEW_VIZ_ITEMS[0]["starterCode"]


def _load_sql_module():
    spec = importlib.util.spec_from_file_location(
        "fix_sql_elice_scaffold", ROOT / "tools" / "fix_sql_elice_scaffold.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def norm_code(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def is_hard_python(starter: str) -> bool:
    if not starter:
        return True
    if "아래에 코드를 작성" in starter and "TODO" not in starter and "Q1" not in starter:
        return starter.count("\n") <= 4
    return False


def is_leak_python(starter: str, ref: str) -> bool:
    if not ref:
        return False
    n_ref = norm_code(ref)
    n_st = norm_code(starter)
    # strip comments for leak check
    body = "\n".join(
        ln for ln in starter.split("\n") if ln.strip() and not ln.strip().startswith("#")
    )
    n_body = norm_code(body)
    return n_ref == n_body or (len(n_ref) > 20 and n_ref in n_body)


def scaffold_python(item: dict) -> str | None:
    iid = item.get("id", "")
    if iid in PYTHON_OVERRIDES:
        return PYTHON_OVERRIDES[iid]

    starter = (item.get("starterCode") or "").strip()
    ref = (item.get("referenceCode") or "").strip()

    if is_leak_python(starter, ref):
        # generic: keep imports, todo the rest
        imports = [ln for ln in ref.split("\n") if re.match(r"^\s*(import|from)\s", ln)]
        goal_ln = f"# {(item.get('practiceGuide') or {}).get('goal') or item.get('instructions', '')}"
        return goal_ln + "\n\n" + "\n".join(imports) + "\n\n## Q1. 아래 코드를 완성하세요\n# TODO:\n"

    if is_hard_python(starter) and ref:
        return None  # handled by overrides only for known ids

    if re.search(r"TODO|Q1\.|None\s+#\s+TODO", starter):
        return starter  # already good

    return starter


def is_broken_sql_starter(starter: str) -> bool:
    return any(p.search(starter) for p in INVALID_STARTER_PATTERNS)


def patch_ddl_starter(item: dict, sql_mod) -> str | None:
    iid = item.get("id", "")
    starter = item.get("starterSql") or ""
    if iid in DDL_STARTERS:
        return DDL_STARTERS[iid]
    ref = (item.get("referenceSql") or "").upper()
    if is_broken_sql_starter(starter) or (
        "CREATE TABLE" in ref and "CREATE TABLE /* TODO */" in starter.upper().replace(" ", "")
    ):
        return sql_mod.rebuild_starter(item)
    if "CREATE TABLE" not in ref:
        if ref.startswith("INSERT") and is_broken_sql_starter(starter):
            return sql_mod.rebuild_starter(item)
        return None
    return sql_mod.rebuild_starter(item)


def enhance_guide_snippet(item: dict) -> bool:
    guide = item.setdefault("practiceGuide", {})
    iid = item.get("id", "")
    snip = PYTHON_SNIPPETS.get(iid) or SQL_SNIPPETS.get(iid)
    if snip and guide.get("codeSnippet") != snip:
        guide["codeSnippet"] = snip
        return True
    return False


def patch_sql_item(item: dict, sql_mod) -> bool:
    changed = False
    iid = item.get("id", "")
    ddl = patch_ddl_starter(item, sql_mod)
    if ddl and item.get("starterSql") != ddl:
        item["starterSql"] = ddl
        changed = True
    elif item.get("itemType") == "sql" and is_broken_sql_starter(item.get("starterSql") or ""):
        new_st = sql_mod.rebuild_starter(item)
        if item.get("starterSql") != new_st:
            item["starterSql"] = new_st
            changed = True

    if ddl:
        item["eliceFormat"] = True
        if sql_mod.enhance_guide(item):
            changed = True
        if enhance_guide_snippet(item):
            changed = True
        guide = item.setdefault("practiceGuide", {})
        if iid == "sql-0615-01" and guide.get("tip") == "SQLite에서는 DESC 대신 PRAGMA table_info를 사용합니다.":
            guide["tip"] = (
                "빈 DB입니다. 에디터의 CREATE TABLE 틀을 직접 완성하세요. "
                "아래에 새 CREATE TABLE를 추가하지 마세요. "
                "SQLite에서는 DESC 대신 PRAGMA table_info를 사용합니다."
            )
            changed = True
        return changed

    # dnd·j0608 등 eliceFormat 없어도 starterSql 있으면 적용
    if item.get("itemType") != "sql" or not item.get("referenceSql"):
        return changed

    item["eliceFormat"] = True
    new_st = sql_mod.rebuild_starter(item)

    # el-sql-1301 윈도우 식 유출 제거
    if iid == "el-sql-1301" and "OVER (PARTITION" in new_st:
        new_st = (
            "-- 아래는 SELL, PRODUCT 테이블 구조입니다. 테이블을 수정할 필요는 없습니다.\n"
            "PRAGMA table_info(SELL);\n"
            "PRAGMA table_info(PRODUCT);\n\n"
            "SELECT * FROM SELL;\n"
            "SELECT * FROM PRODUCT;\n\n"
            "-- SELL·PRODUCT JOIN 후 윈도우 합계를 구합니다.\n"
            "SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY\n"
            "FROM SELL\n"
            "-- ↑ JOIN 조건을 작성한 뒤, SUM(PRICE * QUANTITY) OVER (...) 를 추가하세요\n"
        )

    # el-sql-1204 SELF JOIN
    if iid == "el-sql-1204":
        new_st = (
            "-- 아래는 EMPLOYEE 테이블 구조입니다. 테이블을 수정할 필요는 없습니다.\n"
            "PRAGMA table_info(EMPLOYEE);\n\n"
            "SELECT * FROM EMPLOYEE;\n\n"
            "-- EMPLOYEE SELF JOIN으로 관리자 이름을 조회합니다.\n"
            "SELECT a.employee_id, a.employee_name, b.employee_name AS manager_name\n"
            "FROM EMPLOYEE AS a, EMPLOYEE AS b\n"
            "-- ↑ WHERE a.manager_id = b.employee_id 를 작성하세요\n"
        )

    if item.get("starterSql") != new_st:
        item["starterSql"] = new_st
        changed = True
    if sql_mod.enhance_guide(item):
        changed = True
    if enhance_guide_snippet(item):
        changed = True
    return changed


def patch_python_item(item: dict) -> bool:
    if item.get("itemType") != "python":
        return False
    if not (item.get("starterCode") or item.get("referenceCode")):
        return False
    changed = False
    new_st = scaffold_python(item)
    if new_st and item.get("starterCode") != new_st:
        item["starterCode"] = new_st
        changed = True
    item["eliceFormat"] = True
    if enhance_guide_snippet(item):
        changed = True
    # viz snippets in guide
    guide = item.setdefault("practiceGuide", {})
    iid = item.get("id", "")
    if iid.startswith("viz-") and not guide.get("codeSnippet"):
        ref = item.get("referenceCode", "")
        if "pie" in ref:
            guide["codeSnippet"] = "plt.pie(ratio, labels=labels)\nplt.axis('equal')"
            changed = True
        elif "bar" in ref:
            guide["codeSnippet"] = "plt.bar(labels, ratio)"
            changed = True
        elif "plot" in ref:
            guide["codeSnippet"] = "plt.plot(x, y)"
            changed = True
        elif "scatter" in ref:
            guide["codeSnippet"] = "plt.scatter(df['어른'], df['청소년'])"
            changed = True
    return changed


def add_viz_items(data: dict) -> int:
    ids = {it["id"] for it in data["items"]}
    added = 0
    for nv in NEW_VIZ_ITEMS:
        if nv["id"] not in ids:
            data["items"].append(nv)
            added += 1
        else:
            for i, it in enumerate(data["items"]):
                if it["id"] == nv["id"]:
                    for k, v in nv.items():
                        if it.get(k) != v:
                            it[k] = v
                            added += 1
                    break
    return added


def patch_file(path: Path, sql_mod) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    stats = {"py": 0, "sql": 0, "viz": 0}
    if path.name == "basic-ai-course.json":
        stats["viz"] += add_viz_items(data)
    for item in data.get("items", []):
        if patch_python_item(item):
            stats["py"] += 1
        if patch_sql_item(item, sql_mod):
            stats["sql"] += 1
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return stats


def main():
    sql_mod = _load_sql_module()
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        if not any(
            i.get("itemType") in ("python", "sql") and (i.get("starterCode") or i.get("starterSql"))
            for i in data.get("items", [])
        ):
            continue
        st = patch_file(fp, sql_mod)
        print(f"{fp.name}: python={st['py']} sql={st['sql']} viz={st['viz']}")


if __name__ == "__main__":
    main()
