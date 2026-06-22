# -*- coding: utf-8 -*-
"""Pandas 실습 문항을 노트북형(setupCode + TODO 셀)으로 정리."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIC = ROOT / "data" / "basic-ai-course.json"

NOTEBOOK_STARTERS = {
    "pd-02": (
        "# df는 이미 로드됨 — 왼쪽 참고 데이터에서 외국인 열을 확인하세요.\n"
        "foreigner = None  # TODO: 쉼표 제거 후 숫자 변환 (pd.to_numeric)\n"
        "print(foreigner.dtype)"
    ),
    "pd-03": (
        "# df, week는 이미 준비됨\n"
        "요일 = None  # TODO: df['요일']을 week 딕셔너리로 map\n"
        "print(요일.iloc[0])"
    ),
    "pd-04-badair": (
        "# mm은 이미 로드됨 — 왼쪽 미세먼지 표를 참고하세요.\n"
        "badair = None  # TODO: 미세먼지 열의 최댓값\n"
        "print(badair)"
    ),
    "pd-04-thursday": (
        "# df는 이미 로드됨 — 요일·공휴일·어른 열을 참고하세요.\n"
        "thursday = None  # TODO: 공휴일(O)인 목요일의 어른 방문객 최댓값\n"
        "print(thursday)"
    ),
    "pd-05": (
        "# df는 이미 로드됨\n"
        "filtered = None  # TODO: 어른 > 3000 인 행만 (loc)\n"
        "print(len(filtered))"
    ),
    "pd-06": (
        "# df는 이미 로드됨 (0행 단체는 NaN으로 설정됨)\n"
        "filled = None  # TODO: 단체 열 NaN을 0으로 채운 Series\n"
        "print(filled.iloc[0])"
    ),
    "pd-07": (
        "# df, april은 이미 로드됨\n"
        "merged = None  # TODO: df와 april을 세로로 concat\n"
        "print(len(merged))"
    ),
    "viz-02": (
        "import matplotlib.pyplot as plt\n\n"
        "# df는 이미 로드됨\n"
        "# TODO: 어른(x) vs 청소년(y) 산점도\n"
        "plt.scatter(df['어른'], df['청소년'])\n"
        "plt.xlabel('어른')\n"
        "plt.ylabel('청소년')\n"
        "plt.show()"
    ),
}

REFERENCE_UPDATES = {
    "pd-04-thursday": {
        "referenceCode": (
            "import pandas as pd\n\n"
            "df = pd.read_csv('/data/seoul_park03.csv')\n"
            "thursday = df.groupby(['요일', '공휴일'])['어른'].max().loc[('목', 'O')]\n"
            "print(thursday)"
        ),
        "practiceGuide": {
            "goal": "공휴일(O)인 목요일의 어른 방문객 최댓값을 thursday에 저장합니다.",
            "steps": [
                "왼쪽 표에서 요일·공휴일·어른 열 확인",
                "df.groupby(['요일', '공휴일'])['어른'].max()",
                "('목', 'O') 값을 thursday에 저장",
            ],
            "tip": "탐색 버튼으로 df.head()·요일 분포를 먼저 확인해 보세요.",
            "focusColumns": ["요일", "공휴일", "어른", "유료합계"],
        },
        "validate": {
            "patterns": ["groupby", "어른"],
            "assertCode": "assert thursday == 8000",
        },
        "instructions": "공휴일(O)인 목요일의 어른 방문객 최댓값을 thursday에 저장합니다.",
        "question": "실습: 공휴일 목요일 어른 최댓값 (groupby)",
    },
}

SETUP_UPDATES = {
    "pd-06": (
        "import pandas as pd\nimport numpy as np\n"
        "df = pd.read_csv('/data/seoul_park03.csv')\n"
        "df.loc[0, '단체'] = np.nan"
    ),
    "pd-07": (
        "import pandas as pd\n"
        "df = pd.read_csv('/data/seoul_park03.csv')\n"
        "april = pd.read_csv('/data/seoul_park_april.csv')"
    ),
}

FOCUS_COLUMNS = {
    "pd-04-badair": ["미세먼지", "날짜"],
    "pd-02": ["외국인"],
    "pd-03": ["요일"],
    "pd-05": ["어른"],
    "pd-06": ["단체"],
    "pd-07": ["날짜", "요일"],
}


def main():
    deck = json.loads(BASIC.read_text(encoding="utf-8"))
    n = 0
    for item in deck["items"]:
        iid = item.get("id")
        if iid in NOTEBOOK_STARTERS:
            item["starterCode"] = NOTEBOOK_STARTERS[iid]
            item["eliceFormat"] = True
            n += 1
        if iid in REFERENCE_UPDATES:
            item.update(REFERENCE_UPDATES[iid])
        if iid in SETUP_UPDATES:
            item["setupCode"] = SETUP_UPDATES[iid]
        if iid in FOCUS_COLUMNS:
            pg = item.setdefault("practiceGuide", {})
            pg["focusColumns"] = FOCUS_COLUMNS[iid]

    BASIC.write_text(json.dumps(deck, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"patched {n} python notebook starters in {BASIC}")


if __name__ == "__main__":
    main()
