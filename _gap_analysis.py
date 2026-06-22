# -*- coding: utf-8 -*-
"""학습문제 스크린샷 vs basic-ai-course 반영률 분석"""
import json
from pathlib import Path
from collections import defaultdict, Counter

ROOT = Path(r"c:\Users\haeorume\Desktop\학습문제")
DATA = Path(__file__).parent / "data" / "basic-ai-course.json"

FOLDERS = [
    ("01 IT리터러시", "05/26 IT 리터러시"),
    ("02 핵심 운영체제 리눅스 기초", "05/27 핵심 운영체제·리눅스"),
    ("03 네트워크 개론", "05/28 네트워크 개론"),
    ("04 파이썬 기본문법1", "05/29 파이썬 기본 문법 1"),
    ("05 파이썬 기본문법2", "06/02 파이썬 중급 문법"),
    ("06 파이썬 중급문법", "06/02 파이썬 중급 문법"),
    ("07 파이썬 라이브러리활용", "06/04 파이썬 라이브러리 활용"),
    ("08 생성형AI기초", "06/05 생성형 AI 기초"),
    ("09 SQL개요", "06/08 SQL 개요 & DML"),
    ("10 SQL함수와 서브쿼리", "06/09 SQL 함수 & 서브쿼리"),
    ("11 집합 연산자와 계층형 질의", "06/10 집합연산자 & 계층형 질의"),
    ("12 JOIN 및 서브쿼리 심화", "06/11 JOIN 심화 & 서브쿼리 심화"),
    ("13 그룹 함수와 윈도우 함수", "06/12 그룹 함수 & 윈도우 함수"),
]

# 엘리스 커리큘럼 기준 대략적 퀴즈+실습 수 (스크린샷 샘플링·강의 구조 추정)
ESTIMATED_UNIQUE = {
    "05/26 IT 리터러시": 22,
    "05/27 핵심 운영체제·리눅스": 45,
    "05/28 네트워크 개론": 24,
    "05/29 파이썬 기본 문법 1": 18,
    "06/02 파이썬 중급 문법": 16,
    "06/04 파이썬 라이브러리 활용": 18,
    "06/05 생성형 AI 기초": 7,
    "06/08 SQL 개요 & DML": 14,
    "06/09 SQL 함수 & 서브쿼리": 18,
    "06/10 집합연산자 & 계층형 질의": 12,
    "06/11 JOIN 심화 & 서브쿼리 심화": 22,
    "06/12 그룹 함수 & 윈도우 함수": 18,
}

# 스크린샷에서 확인된 주요 실습 (엘리스) — 앱 반영 여부
ELICE_SQL_PRACTICES = [
    ("06/08", "DESC employees/salaries", "el-sql-0901"),
    ("06/08", "SELECT * book", "el-sql-0902"),
    ("06/08", "DISTINCT emp_no", "el-sql-0903"),
    ("06/08", "LIMIT 5 book", "el-sql-0904"),
    ("06/08", "WHERE price>=15000", "j0608-sql-01"),
    ("06/08", "ORDER BY LIMIT 2", "j0608-sql-02"),
    ("06/09", "COUNT book/user", "el-sql-1001"),
    ("06/09", "GROUP BY 국가별 건수", "j0609-sql-01"),
    ("06/11", "SELL·PRODUCT JOIN", "el-sql-1201"),
    ("06/11", "EMPLOYEE·POSITION JOIN", "el-sql-1202"),
    ("06/12", "RANK GYM_MEMBER", "j0612-sql-01"),
    ("06/12", "AVG OVER country", "j0612-sql-02"),
    ("06/12", "NTILE 3", "c0612-sql-03"),
    ("06/12", "SUM 윈도우 SELL", "el-sql-1301"),
    ("06/12", "PERCENT_RANK STUDENT", "el-sql-1302"),
    ("06/12", "ROLLUP BOOK_HISTORY", "el-sql-1303"),
]

MISSING_SQL_FROM_SCREENSHOTS = [
    ("06/08", "INSERT / UPDATE / DELETE DML 실습"),
    ("06/08", "SELECT 특정 컬럼만 조회"),
    ("06/09", "SUM/AVG/MIN/MAX 집계 함수 실습"),
    ("06/09", "서브쿼리 실습 (WHERE IN 등)"),
    ("06/10", "UNION / INTERSECT / EXCEPT 실습"),
    ("06/10", "계층형 질의 (CONNECT BY 등)"),
    ("06/11", "LEFT/RIGHT/FULL OUTER JOIN 실습"),
    ("06/11", "서브쿼리 심화 (상관/비상관)"),
    ("06/12", "DENSE_RANK / ROW_NUMBER 실습"),
    ("06/12", "GROUP BY 집계 함수 실습"),
]

def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    ids = {it["id"] for it in data["items"]}
    by_sec = defaultdict(list)
    for it in data["items"]:
        by_sec[it["section"]].append(it)

    print("=" * 72)
    print("학습문제 스크린샷 vs 이어드림스쿨 학습가이드 — 비교 분석")
    print("=" * 72)
    print(f"스크린샷 총합: {sum(len(list((ROOT/f).glob('*.png'))) for f,_ in FOLDERS if (ROOT/f).exists())}장")
    print(f"앱 문항 총합: {len(data['items'])}문항")
    print(f"  - 기존(PDF/수동): {sum(1 for i in data['items'] if not i['id'].startswith('el-'))}")
    print(f"  - 엘리스 반영(el-*): {sum(1 for i in data['items'] if i['id'].startswith('el-'))}")
    print()

    total_shots = 0
    total_est = 0
    total_app = 0

    print(f"{'폴더':<28} {'샷':>4} {'앱':>4} {'추정':>4} {'충실도':>7}  상태")
    print("-" * 72)

    for folder, section in FOLDERS:
        path = ROOT / folder
        shots = len(list(path.glob("*.png"))) if path.exists() else 0
        items = by_sec[section]
        est = ESTIMATED_UNIQUE.get(section, shots)
        ch = sum(1 for x in items if x.get("itemType") == "choice")
        sq = sum(1 for x in items if x.get("itemType") == "sql")
        py = sum(1 for x in items if x.get("itemType") == "python")
        el = sum(1 for x in items if x["id"].startswith("el-"))

        # 충실도 = 앱문항 / 추정 고유문항 (최대 100%)
        fidelity = min(100, round(len(items) / est * 100)) if est else 0
        if fidelity >= 85:
            status = "양호"
        elif fidelity >= 60:
            status = "보통"
        else:
            status = "부족"

        print(f"{folder[:26]:<28} {shots:>4} {len(items):>4} {est:>4} {fidelity:>6}%  {status}  (c{ch}/s{sq}/p{py}, el+{el})")
        total_shots += shots
        total_est += est
        total_app += len(items)

    print("-" * 72)
    print(f"{'합계':<28} {total_shots:>4} {total_app:>4} {total_est:>4} {min(100,round(total_app/total_est*100)):>6}%")
    print()

    print("=== SQL 실습 반영 체크리스트 (스크린샷 기준) ===")
    for sec, title, iid in ELICE_SQL_PRACTICES:
        mark = "OK" if iid in ids else "MISSING"
        print(f"  [{mark}] {sec} {title} ({iid})")

    print()
    print("=== 스크린샷에 있으나 앱에 아직 없는 SQL 실습 (추정) ===")
    for sec, title in MISSING_SQL_FROM_SCREENSHOTS:
        print(f"  [ ] {sec} {title}")

    print()
    print("=== 유형별 ===")
    types = Counter()
    for it in data["items"]:
        types[it.get("itemType", "choice")] += 1
    for k, v in types.items():
        print(f"  {k}: {v}")

    print()
    print("=== practiceGuide 보유 실습 ===")
    pg = [it for it in data["items"] if it.get("practiceGuide")]
    print(f"  {len(pg)}/{types['sql']+types.get('python',0)} 실습에 지시사항 패널 데이터 있음")


if __name__ == "__main__":
    main()
