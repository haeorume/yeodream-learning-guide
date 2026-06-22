# -*- coding: utf-8 -*-
"""june-review.json 정리: refUrl 제거, 문항 유형·실습 추가"""
import json
from pathlib import Path

path = Path(__file__).parent / "data" / "june-review.json"
data = json.loads(path.read_text(encoding="utf-8"))

for item in data["items"]:
    item.pop("refUrl", None)
    q = item.get("question", "")
    q = q.replace("[키워드 사전] ", "")
    item["question"] = q
    hint = item.get("hint", "")
    if hint and ("korean-sql" in hint or "키워드 사전" in hint):
        item["hint"] = hint.split("·")[-1].strip() if "·" in hint else "SQL 핵심 키워드를 떠올려 보세요."
    if not item.get("itemType"):
        if item.get("options"):
            item["itemType"] = "typing"
        else:
            item["itemType"] = "typing"

new_items = [
    {
        "id": "j0612-choice-01",
        "day": "06/12",
        "section": "6/12 그룹 함수 & 윈도우 함수",
        "itemType": "choice",
        "question": "Q. 다음 설명 중 데이터 분석을 위한 함수가 아닌 것은?",
        "choicePrompt": "보기 중 데이터 분석 함수가 아닌 것을 고르세요.",
        "options": [
            {
                "text": "윈도우 함수",
                "isCorrect": False,
                "rationale": "순위·누적합·비율 등 분석에 널리 쓰입니다.",
            },
            {
                "text": "조인 함수",
                "isCorrect": True,
                "rationale": "조인은 테이블을 연결하는 연산입니다. '조인 함수'라는 분석 함수 분류는 없습니다.",
            },
            {
                "text": "집계 함수",
                "isCorrect": False,
                "rationale": "SUM, AVG, COUNT 등 그룹 집계에 사용합니다.",
            },
            {
                "text": "그룹 함수",
                "isCorrect": False,
                "rationale": "ROLLUP, CUBE 등 다차원 집계에 해당합니다.",
            },
        ],
        "explanation": "데이터 분석 함수로는 윈도우 함수, 집계 함수, 그룹 함수(ROLLUP/CUBE) 등이 있습니다. JOIN은 테이블 결합 연산이지 분석 함수 유형이 아닙니다.",
        "summary": "윈도우=행 유지+분석값 부착, 집계=GROUP BY로 묶기, JOIN=테이블 연결.",
    },
    {
        "id": "j0612-sql-01",
        "day": "06/12",
        "section": "6/12 그룹 함수 & 윈도우 함수",
        "itemType": "sql",
        "question": "실습: GYM_MEMBER 테이블 — 3대 운동 합계와 순위",
        "instructions": "GYM_MEMBER 테이블에서 MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT, 세 운동 합계(WEIGHT_SUM), RANK() 순위를 구하세요. 합계 내림차순으로 정렬합니다. 동점자는 같은 순위를 받습니다.",
        "sandbox": "gym_member",
        "starterSql": "SELECT MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT,\n       -- WEIGHT_SUM 계산\n       -- RANK() 윈도우 함수\nFROM GYM_MEMBER;",
        "validate": {
            "patterns": ["rank", "over", "order by"],
            "minRows": 1,
            "requiredColumns": ["MEMBER_ID"],
        },
        "referenceSql": "SELECT MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT,\n       (SQUAT + BENCH_PRESS + DEADLIFT) AS WEIGHT_SUM,\n       RANK() OVER (ORDER BY (SQUAT + BENCH_PRESS + DEADLIFT) DESC) AS RANK\nFROM GYM_MEMBER\nORDER BY WEIGHT_SUM DESC;",
        "hint": "합계 = SQUAT + BENCH_PRESS + DEADLIFT. RANK() OVER (ORDER BY ... DESC)",
        "summary": "RANK() OVER (ORDER BY expr DESC)는 동점 시 같은 순위를 부여하고 다음 순위를 건너뜁니다.",
        "explanation": "DENSE_RANK는 건너뛰지 않고, ROW_NUMBER는 동점도 다른 번호를 부여합니다.",
    },
    {
        "id": "j0608-sql-01",
        "day": "06/08",
        "section": "6/8 SQL 개요 & DML",
        "itemType": "sql",
        "question": "실습: book 테이블에서 가격 15000원 이상 도서 조회",
        "instructions": "book 테이블에서 price가 15000 이상인 도서의 id, title, price를 조회하세요.",
        "sandbox": "book",
        "starterSql": "SELECT id, title, price\nFROM book\n-- 조건을 추가하세요",
        "validate": {
            "patterns": ["select", "from book", "where", "price"],
            "minRows": 1,
        },
        "referenceSql": "SELECT id, title, price FROM book WHERE price >= 15000;",
        "hint": "WHERE 절로 행 단위 조건을 걸어요.",
        "summary": "SELECT 열 FROM 테이블 WHERE 조건; 이 기본 조회 패턴입니다.",
    },
    {
        "id": "j0601-py-01",
        "day": "06/01",
        "section": "6/1 파이썬 기본·중급 문법",
        "itemType": "python",
        "question": "실습: 리스트 제곱 만들기",
        "instructions": "nums = [1, 2, 3, 4] 가 있을 때, 각 원소의 제곱 리스트 squares를 만들고 print(squares)로 [1, 4, 9, 16]을 출력하세요.",
        "starterCode": "nums = [1, 2, 3, 4]\n# squares 리스트를 만드세요\n\nprint(squares)",
        "validate": {
            "patterns": ["for", "squares"],
            "assertCode": "assert squares == [1, 4, 9, 16]",
        },
        "referenceCode": "squares = [n ** 2 for n in nums]\nprint(squares)",
        "hint": "리스트 컴프리헨션 [n ** 2 for n in nums] 또는 for 루프를 사용하세요.",
        "summary": "리스트 컴프리헨션은 [표현식 for 변수 in 반복가능] 형태입니다.",
    },
    {
        "id": "j0609-sql-01",
        "day": "06/09",
        "section": "6/9 SQL 함수 & 서브쿼리",
        "itemType": "sql",
        "question": "실습: 국가별 청구 건수 집계",
        "instructions": "Invoice 테이블에서 BillingCountry별 청구 건수(cnt)를 구하고, 건수가 많은 순으로 정렬하세요.",
        "sandbox": "invoice",
        "starterSql": "SELECT BillingCountry,\n       -- 건수 집계\nFROM Invoice\n-- 그룹화 및 정렬",
        "validate": {
            "patterns": ["group by", "count", "order by"],
            "minRows": 1,
        },
        "referenceSql": "SELECT BillingCountry, COUNT(*) AS cnt\nFROM Invoice\nGROUP BY BillingCountry\nORDER BY cnt DESC;",
        "hint": "COUNT(*)와 GROUP BY BillingCountry를 사용하세요.",
        "summary": "GROUP BY로 묶고 COUNT, SUM, AVG 등 집계 함수를 적용합니다.",
    },
    {
        "id": "j0612-sql-02",
        "day": "06/12",
        "section": "6/12 그룹 함수 & 윈도우 함수",
        "itemType": "sql",
        "question": "실습: 국가별 평균 청구액을 각 행에 표시",
        "instructions": "Invoice 테이블에서 InvoiceId, BillingCountry, Total과 함께 국가별 평균 Total(country_avg)을 윈도우 함수로 각 행에 표시하세요.",
        "sandbox": "invoice",
        "starterSql": "SELECT InvoiceId, BillingCountry, Total,\n       -- AVG(...) OVER (PARTITION BY ...)\nFROM Invoice;",
        "validate": {
            "patterns": ["avg", "over", "partition by"],
            "minRows": 1,
        },
        "referenceSql": "SELECT InvoiceId, BillingCountry, Total,\n       AVG(Total) OVER (PARTITION BY BillingCountry) AS country_avg\nFROM Invoice;",
        "hint": "PARTITION BY BillingCountry로 국가별 윈도우를 나눕니다.",
        "summary": "AVG(...) OVER (PARTITION BY col)은 그룹 평균을 원본 행마다 붙입니다. GROUP BY와 달리 행 수가 줄지 않습니다.",
    },
]

existing_ids = {i["id"] for i in data["items"]}
for ni in new_items:
    if ni["id"] not in existing_ids:
        data["items"].append(ni)

# 일부 문항을 choice로 전환
choice_convert = {
    "j0608-03": {
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 SQL 절을 고르세요.",
    },
}
for item in data["items"]:
    if item["id"] in choice_convert:
        item.update(choice_convert[item["id"]])

path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"updated {path}, total items: {len(data['items'])}")
