# -*- coding: utf-8 -*-
"""기존 Pandas/NumPy 실습 문항 데이터·가이드 보강 (공유 노트북 구조 참고, 신규 문항 없음)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIC = ROOT / "data" / "basic-ai-course.json"

# server_maint_mini cpu_usage > 10 평균 (np-06 채점용, 11개)
NP06_MEAN = 201.7 / 11


def patch_item(items: dict[str, dict]) -> None:
    # pd-01: 행 수 15
    pd01 = items.get("pd-01")
    if pd01:
        v = pd01.setdefault("validate", {})
        v["assertCode"] = "assert mm is not None and len(mm) == 15"
        g = pd01.setdefault("practiceGuide", {})
        g["tip"] = (
            "misemunji는 환경 측정 정형 데이터입니다. "
            "[참고 데이터 보기]로 15행·6열 구조를 확인한 뒤 read_csv 하세요."
        )

    # pd-04-thursday: groupby로 정합
    pd04t = items.get("pd-04-thursday")
    if pd04t:
        pd04t["question"] = "실습: 목요일 유료합계 최댓값 (groupby)"
        pd04t["starterCode"] = (
            "import pandas as pd\n\n"
            "df = pd.read_csv('/data/seoul_park03.csv')\n"
            "thursday = None  # TODO: 요일별 유료합계 최댓값 중 '목' 값\n"
            "print(thursday)\n"
        )
        pd04t["referenceCode"] = (
            "import pandas as pd\n\n"
            "df = pd.read_csv('/data/seoul_park03.csv')\n"
            "thursday = df.groupby('요일')['유료합계'].max().loc['목']\n"
            "print(thursday)\n"
        )
        g = pd04t.setdefault("practiceGuide", {})
        g["steps"] = [
            "df.groupby('요일')['유료합계'].max() 로 요일별 최댓값",
            ".loc['목'] 으로 목요일 값 선택",
            "print(thursday) → 12233",
        ]
        g["tip"] = (
            "loc 필터(df.loc[df['요일']=='목', '유료합계'].max())와 결과가 같습니다. "
            "groupby는 요일·지역 등 범주가 많을 때 유용합니다."
        )
        v = pd04t.setdefault("validate", {})
        v["patterns"] = ["groupby", "유료합계", "목"]

    # pd-05: 데이터 확장 반영
    pd05 = items.get("pd-05")
    if pd05:
        g = pd05.setdefault("practiceGuide", {})
        g["tip"] = (
            "seoul_park03은 18행입니다. 어른 > 3000 조건으로 여러 행이 걸러지는지 "
            "[실행]으로 len(filtered)를 확인하세요."
        )
        pd05.setdefault("validate", {})["assertCode"] = "assert len(filtered) >= 5"

    # np-06: CSV → to_numpy() 실전 패턴 (노트북 61번 참고)
    np06 = items.get("np-06")
    if np06:
        np06["question"] = "실습: CSV cpu_usage → 불리언 마스크 평균"
        np06["starterCode"] = (
            "import pandas as pd\n"
            "import numpy as np\n\n"
            "df = pd.read_csv('/data/server_maint_mini.csv')\n"
            "values = None  # TODO: cpu_usage 열을 ndarray로\n"
            "mask = values > 10\n"
            "mean_val = None  # TODO: mask가 True인 값의 평균\n"
            "print(mean_val)\n"
        )
        np06["referenceCode"] = (
            "import pandas as pd\n"
            "import numpy as np\n\n"
            "df = pd.read_csv('/data/server_maint_mini.csv')\n"
            "values = df['cpu_usage'].to_numpy()\n"
            "mask = values > 10\n"
            "mean_val = values[mask].mean()\n"
            "print(mean_val)\n"
        )
        g = np06.setdefault("practiceGuide", {})
        g["goal"] = (
            "서버 점검 미니 데이터에서 cpu_usage를 ndarray로 만든 뒤, "
            "10 초과 값만 골라 평균을 구합니다."
        )
        g["steps"] = [
            "df = pd.read_csv('/data/server_maint_mini.csv')",
            "values = df['cpu_usage'].to_numpy()",
            "mask = values > 10 → values[mask].mean()",
        ]
        g["tip"] = (
            "강의 노트북의 read_csv → to_numpy() 흐름을 축소한 데이터입니다. "
            "정식 70제 CSV 전체가 아닌 16행 미니셋입니다."
        )
        v = np06.setdefault("validate", {})
        v["patterns"] = ["to_numpy", "mask", "mean"]
        v["assertCode"] = f"assert abs(mean_val - {NP06_MEAN}) < 0.01"
        np06["packages"] = ["numpy", "pandas"]
        np06["datasets"] = ["server_maint_mini"]
        np06["setupCode"] = ""

    # np-01: 가이드만 보강
    np01 = items.get("np-01")
    if np01:
        g = np01.setdefault("practiceGuide", {})
        g["tip"] = (
            "이후 Pandas DataFrame에서 df['열'].to_numpy()로 표 데이터를 "
            "ndarray로 바꿔 NumPy 연산에 쓸 수 있습니다(np-06 참고)."
        )


def main():
    data = json.loads(BASIC.read_text(encoding="utf-8"))
    by_id = {i["id"]: i for i in data["items"]}
    patch_item(by_id)
    BASIC.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"patched {BASIC}")


if __name__ == "__main__":
    main()
