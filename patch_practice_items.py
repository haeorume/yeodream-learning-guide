# -*- coding: utf-8 -*-
"""SQL/Python 실습 문항 — starter SQL 문법 수정 + 지시사항(practiceGuide) 보강"""
import json
from pathlib import Path

DATA = Path(__file__).parent / "data" / "basic-ai-course.json"

PRACTICE_UPDATES = {
    "j0608-sql-01": {
        "practiceGuide": {
            "goal": "book 테이블에서 가격이 15,000원 이상인 도서만 조회합니다.",
            "steps": [
                "book 테이블에서 id, title, price 컬럼을 선택하세요.",
                "WHERE 절로 price >= 15000 조건을 추가하세요.",
            ],
            "outputColumns": ["id", "title", "price"],
            "tip": "먼저 [테이블 보기]로 데이터를 확인한 뒤 WHERE를 작성하세요.",
        },
        "starterSql": """-- 1) 테이블 확인 (실행해 보세요)
SELECT * FROM book;

-- 2) 아래 쿼리를 완성하세요
SELECT id, title, price
FROM book
WHERE price >= 15000;""",
    },
    "j0608-sql-02": {
        "practiceGuide": {
            "goal": "가격이 비싼 순서대로 상위 2권만 조회합니다.",
            "steps": [
                "title, price를 SELECT 합니다.",
                "ORDER BY price DESC 로 내림차순 정렬합니다.",
                "LIMIT 2 로 2건만 가져옵니다.",
            ],
            "outputColumns": ["title", "price"],
            "tip": "ORDER BY와 LIMIT은 SELECT 맨 끝에 붙입니다.",
        },
        "starterSql": """SELECT * FROM book;

SELECT title, price
FROM book
ORDER BY price DESC
LIMIT 2;""",
    },
    "j0609-sql-01": {
        "practiceGuide": {
            "goal": "Invoice 테이블에서 국가(BillingCountry)별 청구 건수를 구하고, 많은 순으로 정렬합니다.",
            "steps": [
                "BillingCountry와 COUNT(*) AS cnt 를 선택합니다.",
                "GROUP BY BillingCountry 로 국가별 묶음.",
                "ORDER BY cnt DESC 로 정렬.",
            ],
            "outputColumns": ["BillingCountry", "cnt"],
            "tip": "집계 함수(COUNT)를 쓸 때 GROUP BY에 비집계 컬럼을 넣어야 합니다.",
        },
        "starterSql": """-- 테이블 데이터 확인
SELECT * FROM Invoice;

-- 국가별 건수 집계 (작성하세요)
SELECT BillingCountry,
       COUNT(*) AS cnt
FROM Invoice
GROUP BY BillingCountry
ORDER BY cnt DESC;""",
    },
    "j0612-sql-01": {
        "practiceGuide": {
            "goal": "GYM_MEMBER 테이블에서 3대 운동 합계와 순위(RANK)를 구합니다. 동점은 같은 순위입니다.",
            "steps": [
                "MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT를 출력합니다.",
                "(SQUAT + BENCH_PRESS + DEADLIFT) AS WEIGHT_SUM 을 계산합니다.",
                "RANK() OVER (ORDER BY 합계 DESC) AS RANK 를 추가합니다.",
                "합계 내림차순으로 ORDER BY 합니다.",
            ],
            "outputColumns": [
                "MEMBER_ID",
                "SQUAT",
                "BENCH_PRESS",
                "DEADLIFT",
                "WEIGHT_SUM",
                "RANK",
            ],
            "tip": "지시사항에 나온 컬럼 순서를 그대로 맞추세요. 먼저 SELECT * 로 데이터를 확인하세요.",
        },
        "starterSql": """-- 테이블 구조·데이터 확인
SELECT * FROM GYM_MEMBER;

-- 아래 쿼리를 완성하세요 (합계 WEIGHT_SUM, RANK 윈도우 함수)
SELECT MEMBER_ID,
       SQUAT,
       BENCH_PRESS,
       DEADLIFT
FROM GYM_MEMBER;""",
    },
    "j0612-sql-02": {
        "practiceGuide": {
            "goal": "각 청구 행마다 국가별 평균 청구액(country_avg)을 윈도우 함수로 붙입니다. GROUP BY와 달리 행 수는 줄지 않습니다.",
            "steps": [
                "InvoiceId, BillingCountry, Total을 출력합니다.",
                "AVG(Total) OVER (PARTITION BY BillingCountry) AS country_avg 를 추가합니다.",
            ],
            "outputColumns": ["InvoiceId", "BillingCountry", "Total", "country_avg"],
            "tip": "PARTITION BY BillingCountry 로 국가별 윈도우를 나눕니다.",
        },
        "starterSql": """-- 데이터 확인
SELECT * FROM Invoice;

-- 윈도우 함수로 국가별 평균을 각 행에 표시 (country_avg 컬럼 추가)
SELECT InvoiceId,
       BillingCountry,
       Total
FROM Invoice;""",
    },
    "c0612-sql-03": {
        "practiceGuide": {
            "goal": "3대 운동 합계(SCORE_SUM) 기준으로 NTILE(3)으로 3그룹(grp)을 나눕니다.",
            "steps": [
                "MEMBER_ID와 세 운동 합계 SCORE_SUM을 계산합니다.",
                "NTILE(3) OVER (ORDER BY SCORE_SUM DESC) AS grp 를 추가합니다.",
            ],
            "outputColumns": ["MEMBER_ID", "SCORE_SUM", "grp"],
            "tip": "NTILE(n)은 순위를 n개 구간으로 나눕니다.",
        },
        "starterSql": """SELECT * FROM GYM_MEMBER;

-- SCORE_SUM과 NTILE(3) 그룹 grp를 추가하세요
SELECT MEMBER_ID
FROM GYM_MEMBER;""",
    },
    "c0529-py-01": {
        "practiceGuide": {
            "goal": "for 루프로 1부터 5까지 한 줄씩 출력합니다.",
            "steps": [
                "range(1, 6)을 사용합니다 (6은 포함되지 않음).",
                "print(i)로 각 숫자를 출력합니다.",
            ],
            "tip": "실행 결과에 1 2 3 4 5 가 각 줄에 나와야 합니다.",
        },
        "starterCode": """# 1부터 5까지 출력
for i in range(1, 6):
    print(i)""",
    },
    "j0601-py-01": {
        "practiceGuide": {
            "goal": "리스트 컴프리헨션으로 제곱 리스트를 만듭니다.",
            "steps": [
                "nums = [1, 2, 3, 4] 가 주어집니다.",
                "squares = [n ** 2 for n in nums] 형태로 작성합니다.",
                "print(squares) → [1, 4, 9, 16]",
            ],
            "tip": "for 루프 대신 [표현식 for 변수 in 리스트] 한 줄로도 가능합니다.",
        },
        "starterCode": """nums = [1, 2, 3, 4]
# squares 리스트를 만드세요

print(squares)""",
    },
    "j0601-06": {
        "practiceGuide": {
            "goal": "a=13, b=5일 때 몫 q와 나머지 r을 구해 출력합니다.",
            "steps": [
                "q = a // b  (몫)",
                "r = a % b   (나머지)",
                "print(q, r) → 2 3",
            ],
            "tip": "//는 몫, %는 나머지 연산자입니다.",
        },
        "starterCode": """a = 13
b = 5
# q, r을 계산하세요

print(q, r)""",
    },
}


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    updated = 0
    for item in data["items"]:
        patch = PRACTICE_UPDATES.get(item["id"])
        if not patch:
            continue
        item.update(patch)
        if patch.get("practiceGuide") and item.get("instructions"):
            g = patch["practiceGuide"]
            item["instructions"] = g.get("goal", item["instructions"])
        updated += 1
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Patched {updated} practice items in {DATA.name}")


if __name__ == "__main__":
    main()
