# -*- coding: utf-8 -*-
"""
06/15~06/18 커리큘럼 문항 추가
- basic-ai-course.json 읽기 → 신규 문항 append → meta 갱신 → 저장
"""
import json
import random
from collections import Counter
from pathlib import Path

DATA = Path(__file__).parent / "data"
COURSE_JSON = DATA / "basic-ai-course.json"

NEW_SECTIONS = [
    "06/15 데이터베이스 개요",
    "06/16 데이터 모델링 & DB 구현",
    "06/17 데이터 리터러시 & NumPy",
    "06/18 Pandas & 데이터 시각화",
]

DAY_BY_SECTION = {
    "06/15 데이터베이스 개요": "06/15",
    "06/16 데이터 모델링 & DB 구현": "06/16",
    "06/17 데이터 리터러시 & NumPy": "06/17",
    "06/18 Pandas & 데이터 시각화": "06/18",
}

SEOUL_PARK_SETUP = """import pandas as pd
import numpy as np
df = pd.read_csv('/data/seoul_park.csv')
"""


def choice_item(item_id, section, question, correct, wrongs, **extra):
    """선택형 4지선다 생성"""
    opts = [
        {
            "text": correct,
            "isCorrect": True,
            "rationale": extra.get("summary", "정답입니다.")[:120],
        }
    ]
    for w in wrongs[:3]:
        opts.append({"text": w, "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."})
    rng = random.Random(hash(item_id) & 0xFFFFFFFF)
    rng.shuffle(opts)
    base = {
        "id": item_id,
        "section": section,
        "day": DAY_BY_SECTION[section],
        "itemType": "choice",
        "question": question,
        "answers": [correct],
        "choicePrompt": extra.get("choicePrompt", "보기 중 올바른 답을 고르세요."),
        "options": opts,
    }
    for k in ("hint", "summary", "explanation", "code"):
        if k in extra:
            base[k] = extra[k]
    return base


def sql_item(
    item_id,
    section,
    question,
    sandbox,
    starter_sql,
    reference_sql,
    practice_guide,
    validate,
    **extra,
):
    item = {
        "id": item_id,
        "section": section,
        "day": DAY_BY_SECTION[section],
        "itemType": "sql",
        "question": question,
        "sandbox": sandbox,
        "starterSql": starter_sql,
        "referenceSql": reference_sql,
        "practiceGuide": practice_guide,
        "validate": validate,
        "instructions": practice_guide.get("goal", ""),
        "eliceFormat": True,
    }
    for k in ("hint", "summary", "explanation"):
        if k in extra:
            item[k] = extra[k]
    return item


def python_item(
    item_id,
    section,
    question,
    starter_code,
    reference_code,
    practice_guide,
    validate,
    **extra,
):
    item = {
        "id": item_id,
        "section": section,
        "day": DAY_BY_SECTION[section],
        "itemType": "python",
        "question": question,
        "starterCode": starter_code,
        "referenceCode": reference_code,
        "practiceGuide": practice_guide,
        "validate": validate,
        "instructions": practice_guide.get("goal", ""),
        "eliceFormat": True,
    }
    for k in (
        "hint",
        "summary",
        "explanation",
        "packages",
        "datasets",
        "dataset",
        "setupCode",
    ):
        if k in extra:
            item[k] = extra[k]
    return item


def build_new_items():
    S15 = "06/15 데이터베이스 개요"
    S16 = "06/16 데이터 모델링 & DB 구현"
    S17 = "06/17 데이터 리터러시 & NumPy"
    S18 = "06/18 Pandas & 데이터 시각화"

    items = []

    # ── 06/15 데이터베이스 개요 — choice 9 ──
    items += [
        choice_item(
            "c0615-db-01",
            S15,
            "데이터베이스(DB)의 특징으로 옳지 않은 것은?",
            "한 번에 한 명만 데이터에 접근할 수 있다",
            [
                "여러 사용자가 동시에 데이터를 공유·접근할 수 있다",
                "데이터의 중복을 최소화하고 일관성을 유지한다",
                "보안·권한으로 접근을 제어할 수 있다",
            ],
            summary="DB는 다중 사용자 동시 접근과 공유가 핵심 특징입니다.",
        ),
        choice_item(
            "c0615-db-02",
            S15,
            "스키마가 자주 바뀌고 비정형 문서를 유연하게 저장할 때 유리한 DB는?",
            "MongoDB (NoSQL)",
            ["MySQL (RDBMS)", "PostgreSQL (RDBMS)", "SQLite (RDBMS)"],
            summary="NoSQL은 스키마 유연성·수평 확장에 강점이 있습니다.",
        ),
        choice_item(
            "c0615-db-03",
            S15,
            "관계형 테이블에서 한 행(row)을 가리키는 용어로 가장 적절한 것은?",
            "튜플(tuple)",
            ["속성(attribute)", "도메인(domain)", "스키마(schema)"],
            summary="속성=열(column), 튜플=행(row), 도메인=값의 범위입니다.",
        ),
        choice_item(
            "c0615-db-04",
            S15,
            "DDL 명령어 설명 중 잘못된 것은?",
            "DROP TABLE은 테이블의 특정 컬럼만 삭제한다",
            [
                "CREATE TABLE은 테이블을 생성한다",
                "ALTER TABLE은 테이블 구조를 변경한다",
                "DROP TABLE은 테이블 전체를 삭제한다",
            ],
            summary="컬럼 삭제는 ALTER TABLE … DROP COLUMN 입니다.",
        ),
        choice_item(
            "c0615-db-05",
            S15,
            "제약 조건 설명 중 틀린 것은?",
            "NOT NULL은 빈 문자열('') 저장을 항상 금지한다",
            [
                "PRIMARY KEY는 행을 유일하게 식별한다",
                "UNIQUE는 중복 값을 허용하지 않는다",
                "FOREIGN KEY는 다른 테이블의 키를 참조한다",
            ],
            summary="NOT NULL은 NULL 금지이며, 빈 문자열 허용 여부는 DB·타입에 따라 다릅니다.",
        ),
        choice_item(
            "c0615-db-06",
            S15,
            "키(key)에 대한 설명으로 틀린 것은?",
            "외래키(FK)는 테이블당 반드시 하나만 설정할 수 있다",
            [
                "기본키(PK)는 행을 유일하게 식별한다",
                "후보키는 PK로 지정될 수 있는 최소 유일 키이다",
                "복합키는 두 개 이상의 컬럼으로 구성된 키이다",
            ],
            summary="한 테이블에 여러 FK를 둘 수 있습니다.",
        ),
        choice_item(
            "c0615-db-07",
            S15,
            "데이터 모델링의 올바른 순서는?",
            "개념적 설계 → 논리적 설계 → 물리적 설계",
            [
                "물리적 설계 → 개념적 설계 → 논리적 설계",
                "논리적 설계 → 물리적 설계 → 개념적 설계",
                "개념적 설계 → 물리적 설계 → 논리적 설계",
            ],
            summary="개념(ER) → 논리(테이블) → 물리(DBMS·인덱스) 순입니다.",
        ),
        choice_item(
            "c0615-db-08",
            S15,
            "Peter Chen ER 표기법에서 사각형(rectangle)이 나타내는 것은?",
            "엔티티(entity)",
            ["관계(relationship)", "속성(attribute)", "연결선(connector)"],
            summary="Peter Chen: 사각형=엔티티, 마름모=관계, 타원=속성.",
        ),
        choice_item(
            "c0615-db-09",
            S15,
            "까마귀발(crow's foot) ER 표기에서 원(○)과 까마귀발(├) 조합이 의미하는 것은?",
            "0개 이상 (optional many)",
            ["정확히 1개", "0개 또는 1개", "1개 이상 (mandatory many)"],
            summary="○=선택(0 허용), ├=다수, │=1, 조합으로 카디널리티를 표현합니다.",
        ),
    ]

    # ── 06/15 SQL 실습 6 ──
    items += [
        sql_item(
            "sql-0615-01",
            S15,
            "실습: kickboard 테이블 생성 (CREATE TABLE)",
            "kickboard_empty",
            """-- kickboard 테이블을 생성하세요.
-- 컬럼: id(PK), model(NOT NULL), battery, price(UNIQUE)
CREATE TABLE kickboard (
  -- TODO: 컬럼 정의
);

PRAGMA table_info(kickboard);""",
            """CREATE TABLE kickboard (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery INTEGER,
  price INTEGER UNIQUE
);

PRAGMA table_info(kickboard);""",
            {
                "goal": "kickboard 테이블을 CREATE TABLE로 생성하고 구조를 확인합니다.",
                "steps": [
                    "id INTEGER PRIMARY KEY 정의",
                    "model TEXT NOT NULL, battery INTEGER, price INTEGER UNIQUE",
                    "PRAGMA table_info(kickboard)로 구조 확인",
                ],
                "outputColumns": ["cid", "name", "type", "notnull", "dflt_value", "pk"],
                "tip": "SQLite에서는 DESC 대신 PRAGMA table_info를 사용합니다.",
            },
            {"patterns": ["create table", "kickboard", "primary key"], "minRows": 1},
            summary="DDL의 CREATE TABLE로 스키마를 정의합니다.",
        ),
        sql_item(
            "sql-0615-02",
            S15,
            "실습: kickboard 데이터 삽입·조회 (INSERT / SELECT)",
            "kickboard_ready",
            """PRAGMA table_info(kickboard);

-- kickboard 테이블에 2건 INSERT 후 SELECT * 로 조회하세요.
INSERT INTO kickboard (id, model, battery, price) VALUES
  -- TODO
;

SELECT * FROM kickboard;""",
            """INSERT INTO kickboard (id, model, battery, price) VALUES
  (1, 'A-100', 80, 150000),
  (2, 'B-200', 90, 180000);

SELECT * FROM kickboard;""",
            {
                "goal": "kickboard 테이블에 2건을 INSERT하고 SELECT * 로 전체 조회합니다.",
                "steps": [
                    "INSERT INTO kickboard VALUES 2건 작성",
                    "SELECT * FROM kickboard 실행",
                ],
                "outputColumns": ["id", "model", "battery", "price"],
                "tip": "테이블이 비어 있으므로 INSERT부터 작성합니다.",
            },
            {"patterns": ["insert", "select", "kickboard"], "minRows": 1},
        ),
        sql_item(
            "sql-0615-03",
            S15,
            "실습: kickboard 테이블 수정 (ALTER TABLE)",
            "kickboard_ready",
            """SELECT * FROM kickboard;

-- ALTER TABLE로 status 컬럼(TEXT)을 추가하세요.
ALTER TABLE kickboard
  -- TODO: ADD COLUMN
;

PRAGMA table_info(kickboard);""",
            """ALTER TABLE kickboard ADD COLUMN status TEXT DEFAULT 'available';

PRAGMA table_info(kickboard);""",
            {
                "goal": "ALTER TABLE로 kickboard에 status 컬럼을 추가합니다.",
                "steps": [
                    "ALTER TABLE kickboard ADD COLUMN status TEXT",
                    "PRAGMA table_info로 변경 확인",
                ],
                "outputColumns": ["cid", "name", "type", "notnull", "dflt_value", "pk"],
                "tip": "ALTER TABLE은 컬럼 추가·이름 변경·타입 변경에 사용합니다.",
            },
            {"patterns": ["alter table", "add column"], "minRows": 1},
        ),
        sql_item(
            "sql-0615-04",
            S15,
            "실습: kickboard 테이블 삭제 (DROP TABLE)",
            "kickboard_ready",
            """PRAGMA table_info(kickboard);

-- kickboard 테이블을 삭제하세요.
DROP TABLE kickboard;

-- 삭제 확인: 아래 쿼리 실행 시 오류가 나면 삭제된 것입니다.
-- SELECT * FROM kickboard;""",
            """DROP TABLE kickboard;""",
            {
                "goal": "DROP TABLE로 kickboard 테이블을 삭제합니다.",
                "steps": ["DROP TABLE kickboard 작성", "삭제 후 SELECT 시 오류 확인"],
                "tip": "DROP TABLE은 테이블 구조와 데이터를 모두 제거합니다.",
            },
            {"patterns": ["drop table", "kickboard"], "minRows": 0},
        ),
        sql_item(
            "sql-0615-05",
            S15,
            "실습: ERD 기반 customer·kickboard 테이블 생성",
            "kickboard_empty",
            """-- ERD에 따라 customer, kickboard 테이블을 생성하세요.
-- customer: id(PK), name(NOT NULL), phone(UNIQUE)
-- kickboard: id(PK), model(NOT NULL), battery, price

CREATE TABLE customer (
  -- TODO
);

CREATE TABLE kickboard (
  -- TODO
);

PRAGMA table_info(customer);
PRAGMA table_info(kickboard);""",
            """CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE
);

CREATE TABLE kickboard (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery INTEGER,
  price INTEGER
);

PRAGMA table_info(customer);
PRAGMA table_info(kickboard);""",
            {
                "goal": "ERD에 맞게 customer·kickboard 테이블을 PK·제약조건과 함께 생성합니다.",
                "steps": [
                    "customer: id PK, name NOT NULL, phone UNIQUE",
                    "kickboard: id PK, model NOT NULL",
                    "PRAGMA로 두 테이블 구조 확인",
                ],
                "outputColumns": ["cid", "name", "type", "notnull", "dflt_value", "pk"],
            },
            {"patterns": ["create table", "customer", "kickboard", "primary key"], "minRows": 1},
        ),
        sql_item(
            "sql-0615-06",
            S15,
            "실습: borrow 관계 테이블 생성 (FK·복합 PK)",
            "kickboard_empty",
            """-- customer, kickboard 테이블이 있다고 가정합니다. 먼저 생성하세요.
CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE
);
CREATE TABLE kickboard (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery INTEGER,
  price INTEGER
);

-- borrow 테이블: customer_id, kickboard_id, borrow_date, return_date
-- 복합 PK + FK 설정
CREATE TABLE borrow (
  -- TODO
);""",
            """CREATE TABLE borrow (
  customer_id INTEGER NOT NULL,
  kickboard_id INTEGER NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  status TEXT CHECK(status IN ('borrowed', 'returned')),
  PRIMARY KEY (customer_id, kickboard_id, borrow_date),
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (kickboard_id) REFERENCES kickboard(id)
);""",
            {
                "goal": "borrow 관계 테이블을 복합 PK와 FK로 생성합니다.",
                "steps": [
                    "customer_id, kickboard_id, borrow_date를 복합 PK로",
                    "customer(id), kickboard(id)에 FK 참조",
                    "status에 CHECK 제약 추가(선택)",
                ],
                "tip": "관계 테이블은 두 엔티티를 연결하는 FK가 핵심입니다.",
            },
            {"patterns": ["create table", "borrow", "foreign key", "primary key"], "minRows": 0},
        ),
    ]

    # ── 06/16 데이터 모델링 — choice 7 ──
    items += [
        choice_item(
            "c0616-nm-01",
            S16,
            "주문 취소 시 고객 정보만 남기고 주문 행을 삭제했더니 고객 정보도 함께 사라지는 현상은?",
            "삭제 이상 (deletion anomaly)",
            ["삽입 이상", "갱신 이상", "정규화 이상"],
            summary="삭제 이상: 특정 정보 삭제 시 관련 없는 정보도 함께 삭제되는 문제.",
        ),
        choice_item(
            "c0616-nm-02",
            S16,
            "1차 정규화(1NF)의 목표로 가장 적절한 것은?",
            "모든 속성을 더 이상 나눌 수 없는 원자값으로 만든다",
            [
                "부분 함수 종속을 제거한다",
                "이행 함수 종속을 제거한다",
                "테이블을 반드시 3개로 분리한다",
            ],
            summary="1NF: 반복 그룹·다중값을 제거하고 원자값을 보장합니다.",
        ),
        choice_item(
            "c0616-nm-03",
            S16,
            "2차 정규화(2NF)에서 제거하는 것은?",
            "부분 함수 종속",
            ["이행 함수 종속", "다치 종속", "조인 종속"],
            summary="2NF: 복합키의 일부에만 종속된 비주요 속성을 분리합니다.",
        ),
        choice_item(
            "c0616-nm-04",
            S16,
            "3차 정규화(3NF)에서 제거하는 것은?",
            "이행 함수 종속 (X→Y, Y→Z이면 X→Z)",
            ["부분 함수 종속", "다중값 종속", "참조 무결성"],
            summary="3NF: 비주요 속성이 다른 비주요 속성에 종속되지 않도록 분리합니다.",
        ),
        choice_item(
            "c0616-nm-05",
            S16,
            "정규화에 대한 설명으로 틀린 것은?",
            "데이터베이스는 항상 최대한 정규화하는 것이 성능·유지보수 모두에 유리하다",
            [
                "정규화는 이상 현상을 줄인다",
                "역정규화는 조회 성능을 위해 의도적으로 중복을 허용한다",
                "정규화 단계는 1NF→2NF→3NF 순으로 진행한다",
            ],
            summary="과도한 정규화는 조인 비용 증가 → 역정규화가 필요할 수 있습니다.",
        ),
        choice_item(
            "c0616-nm-06",
            S16,
            "사용자에게 테이블 조회 권한을 부여하는 DCL 명령어는?",
            "GRANT",
            ["REVOKE", "COMMIT", "ROLLBACK"],
            summary="GRANT 권한 부여 / REVOKE 권한 회수.",
        ),
        choice_item(
            "c0616-nm-07",
            S16,
            "인덱스 생성이 오히려 부적합한 경우는?",
            "INSERT·UPDATE·DELETE가 매우 빈번한 컬럼",
            [
                "WHERE 절에 자주 사용되는 컬럼",
                "JOIN 키로 자주 쓰이는 컬럼",
                "카디널리티가 높은 컬럼",
            ],
            summary="인덱스는 조회는 빠르게 하지만 쓰기 작업 시 갱신 비용이 듭니다.",
        ),
    ]

    # ── 06/16 SQL 실습 6 ──
    items += [
        sql_item(
            "sql-0616-01",
            S16,
            "실습: 1NF 적용 — customer 반복 그룹 정리",
            "kickboard_norm",
            """SELECT * FROM customer;

-- 비정규화된 customer를 1NF에 맞게 정리합니다.
-- 김민수 고객의 중복 행을 정리하고, 대여 기록은 행 단위로 유지하세요.
DELETE FROM customer WHERE id = 2;

UPDATE customer SET kickboard_model = 'A-100', borrow_date = '2024-01-01', return_date = '2024-01-03'
WHERE id = 1;

INSERT INTO customer (id, name, phone, kickboard_model, borrow_date, return_date)
VALUES (2, '김민수', '010-1111-2222', 'B-200', '2024-01-05', '2024-01-07');

SELECT * FROM customer ORDER BY id;""",
            """DELETE FROM customer WHERE id = 2;

INSERT INTO customer (id, name, phone, kickboard_model, borrow_date, return_date)
VALUES (4, '김민수', '010-1111-2222', 'B-200', '2024-01-05', '2024-01-07');

SELECT * FROM customer ORDER BY id;""",
            {
                "goal": "비정규화 customer 테이블에서 반복·중복을 정리해 1NF를 적용합니다.",
                "steps": [
                    "중복 고객 행 확인",
                    "DELETE/INSERT로 대여 건별 행 분리",
                    "SELECT로 결과 확인",
                ],
                "tip": "1NF는 원자값·반복 그룹 제거가 핵심입니다.",
            },
            {"patterns": ["delete", "insert", "select", "customer"], "minRows": 1},
        ),
        sql_item(
            "sql-0616-02",
            S16,
            "실습: 2NF 적용 — customer·borrow 테이블 분리",
            "kickboard_2nf",
            """PRAGMA table_info(customer);
SELECT * FROM customer;

-- borrow 테이블을 생성하고 대여 정보를 분리하세요.
CREATE TABLE borrow (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  kickboard_model TEXT NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO borrow (id, customer_id, kickboard_model, borrow_date, return_date) VALUES
  (1, 1, 'A-100', '2024-01-01', '2024-01-03'),
  (2, 1, 'B-200', '2024-01-05', '2024-01-07'),
  (3, 2, 'A-100', '2024-02-01', '2024-02-02');

SELECT * FROM borrow;""",
            """CREATE TABLE borrow (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  kickboard_model TEXT NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO borrow (id, customer_id, kickboard_model, borrow_date, return_date) VALUES
  (1, 1, 'A-100', '2024-01-01', '2024-01-03'),
  (2, 1, 'B-200', '2024-01-05', '2024-01-07'),
  (3, 2, 'A-100', '2024-02-01', '2024-02-02');

SELECT * FROM borrow;""",
            {
                "goal": "customer와 borrow를 분리해 2NF(부분 함수 종속 제거)를 적용합니다.",
                "steps": [
                    "borrow 테이블 CREATE + FK",
                    "대여 데이터 INSERT",
                    "SELECT * FROM borrow",
                ],
                "outputColumns": ["id", "customer_id", "kickboard_model", "borrow_date", "return_date"],
            },
            {"patterns": ["create table", "borrow", "foreign key", "insert"], "minRows": 1},
        ),
        sql_item(
            "sql-0616-03",
            S16,
            "실습: 3NF 적용 — company·price 테이블 분리",
            "kickboard_3nf",
            """SELECT * FROM customer;
SELECT * FROM company;

-- price 테이블을 생성하고 이행 종속을 제거하세요.
CREATE TABLE price (
  model TEXT PRIMARY KEY,
  price INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  FOREIGN KEY (company_id) REFERENCES company(id)
);

INSERT INTO price (model, price, company_id) VALUES
  ('A-100', 150000, 1),
  ('B-200', 180000, 1);

SELECT * FROM price;""",
            """CREATE TABLE price (
  model TEXT PRIMARY KEY,
  price INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  FOREIGN KEY (company_id) REFERENCES company(id)
);

INSERT INTO price (model, price, company_id) VALUES
  ('A-100', 150000, 1),
  ('B-200', 180000, 1);

SELECT * FROM price;""",
            {
                "goal": "company·price를 분리해 3NF(이행 함수 종속 제거)를 적용합니다.",
                "steps": [
                    "price 테이블 CREATE",
                    "company_id FK 설정",
                    "INSERT 후 SELECT",
                ],
            },
            {"patterns": ["create table", "price", "foreign key", "company"], "minRows": 1},
        ),
        sql_item(
            "sql-0616-04",
            S16,
            "실습: 3NF 종합 — 4개 테이블 스키마 완성",
            "kickboard_3nf",
            """-- customer, brand, kickboard, borrow 4개 테이블을 생성하세요.
CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE
);

CREATE TABLE brand (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE kickboard (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery INTEGER,
  price INTEGER,
  brand_id INTEGER,
  FOREIGN KEY (brand_id) REFERENCES brand(id)
);

CREATE TABLE borrow (
  customer_id INTEGER NOT NULL,
  kickboard_id INTEGER NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  PRIMARY KEY (customer_id, kickboard_id, borrow_date),
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (kickboard_id) REFERENCES kickboard(id)
);

SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;""",
            """CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE
);

CREATE TABLE brand (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE kickboard (
  id INTEGER PRIMARY KEY,
  model TEXT NOT NULL,
  battery INTEGER,
  price INTEGER,
  brand_id INTEGER,
  FOREIGN KEY (brand_id) REFERENCES brand(id)
);

CREATE TABLE borrow (
  customer_id INTEGER NOT NULL,
  kickboard_id INTEGER NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  PRIMARY KEY (customer_id, kickboard_id, borrow_date),
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (kickboard_id) REFERENCES kickboard(id)
);

SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;""",
            {
                "goal": "정규화된 4개 테이블(customer, brand, kickboard, borrow) 스키마를 완성합니다.",
                "steps": [
                    "4개 테이블 CREATE",
                    "FK·복합 PK 설정",
                    "sqlite_master로 테이블 목록 확인",
                ],
            },
            {"patterns": ["create table", "borrow", "kickboard", "brand"], "minRows": 1},
        ),
        sql_item(
            "sql-0616-05",
            S16,
            "실습: DDL 튜토리얼 — 테이블 구조 확인",
            "kickboard_ready",
            """-- kickboard 테이블 구조와 데이터를 확인하세요.
PRAGMA table_info(kickboard);

SELECT * FROM kickboard;""",
            """PRAGMA table_info(kickboard);

SELECT * FROM kickboard;""",
            {
                "goal": "PRAGMA table_info와 SELECT로 테이블 구조·데이터를 확인합니다.",
                "steps": ["PRAGMA table_info(kickboard)", "SELECT * FROM kickboard"],
                "outputColumns": ["cid", "name", "type", "notnull", "dflt_value", "pk"],
            },
            {"patterns": ["pragma", "table_info", "select"], "minRows": 1},
        ),
        sql_item(
            "sql-0616-06",
            S16,
            "실습: DML 튜토리얼 — INSERT와 제약조건",
            "kickboard_ready",
            """PRAGMA table_info(kickboard);

-- kickboard에 데이터 1건 INSERT 하세요.
INSERT INTO kickboard (id, model, battery, price) VALUES
  (1, 'C-300', 85, 200000);

SELECT * FROM kickboard;

-- PK 중복 INSERT는 오류가 납니다. 아래는 실행하지 마세요.
-- INSERT INTO kickboard (id, model, battery, price) VALUES (1, 'X', 1, 1);""",
            """INSERT INTO kickboard (id, model, battery, price) VALUES
  (1, 'C-300', 85, 200000);

SELECT * FROM kickboard;""",
            {
                "goal": "INSERT로 데이터를 삽입하고 PK·UNIQUE 제약을 이해합니다.",
                "steps": [
                    "INSERT INTO kickboard 1건",
                    "SELECT * 로 확인",
                    "PK 중복 시 오류 발생 이해",
                ],
                "outputColumns": ["id", "model", "battery", "price"],
            },
            {"patterns": ["insert", "select", "kickboard"], "minRows": 1},
        ),
    ]

    # ── 06/17 데이터 리터러시 — choice 26 (DL-01~DL-26) ──
    dl_specs = [
        ("dl-01", "다음 중 일상에서 생성·기록되는 데이터의 예로 가장 적절한 것은?", "학교 생활기록부의 성적 기록", ["컴퓨터 전원 버튼", "키보드 레이아웃", "모니터 해상도"], "문서·기록·측정값은 데이터입니다."),
        ("dl-02", "대량의 데이터에서 의미 있는 OO을 추출하는 과정을 데이터 마이닝이라 한다. 빈칸은?", "정보", ["알고리즘", "프로그램", "하드웨어"], "데이터 마이닝은 패턴·지식(정보) 발견입니다."),
        ("dl-03", "센서로 온도·습도를 수집하는 스마트팜도 데이터 기술의 영향을 받는다.", "O (참)", ["X (거짓)"], "IoT·센서 데이터는 대표적 데이터 활용 사례입니다.", "OX"),
        ("dl-04", "스트리밍 플랫폼이 수집하는 정보 중 객관적 사실로 보기 어려운 것은?", "프리미엄 구매 이력", ["시청 시간", "검색 키워드", "클릭 로그"], "구매 이력은 서비스 밖 정보일 수 있습니다."),
        ("dl-05", "데이터는 수집된 그대로 항상 분석 목적과 결론을 완성한다.", "X (거짓)", ["O (참)"], "데이터는 가공·해석·맥락이 있어야 의미 있는 결론이 됩니다.", "OX"),
        ("dl-06", "다음 중 비정형 데이터에 해당하는 것은?", "고객 리뷰 텍스트", ["엑셀 매출 표", "회원 ID·이름 표", "제품 가격 목록"], "텍스트·이미지·영상은 비정형 데이터입니다."),
        ("dl-07", "개인 맞춤 추천에 활용되는 소규모·고밀도 사용자 행동 데이터를 흔히 무엇이라 부르나요?", "스몰 데이터", ["빅데이터", "메타데이터", "원시 데이터"], "스몰 데이터는 개인화·취향 분석에 유용합니다."),
        ("dl-08", "빅데이터에 대한 설명으로 틀린 것은?", "빅데이터는 항상 스몰 데이터보다 분석 정확도가 높다", ["3V(Volume, Velocity, Variety)로 설명한다", "분산 저장·병렬 처리가 필요하다", "비정형 데이터를 포함한다"], "데이터 크기와 품질·정확도는 별개입니다."),
        ("dl-09", "정형 데이터에 대한 설명으로 틀린 것은?", "비정형 데이터가 정성 연구에 항상 더 적합하다", ["행과 열로 표현된다", "SQL로 조회하기 쉽다", "스키마가 정해져 있다"], "정형·비정형 모두 정성·정량 분석에 쓰일 수 있습니다."),
        ("dl-10", "데이터 분석 업무 프로세스 설명 중 틀린 것은?", "필요 데이터는 반드시 기보유 데이터만으로 정의해야 한다", ["문제 정의 후 데이터를 수집한다", "전처리 후 분석한다", "결과를 검증한다"], "외부·신규 데이터 수집이 필요할 수 있습니다."),
        ("dl-11", "A/B 테스트 후 SNS 연관어를 확인하고 2차 메시지를 발송하는 단계는?", "결과 검증 및 후속 분석", ["데이터 수집", "데이터 전처리", "모델 학습"], "실험 결과를 검증하고 인사이트를 도출합니다."),
        ("dl-12", "분석에 사용된 표본이 지나치게 적으면 결과 신뢰도가 낮아질 수 있다.", "O (참)", ["X (거짓)"], "표본 크기는 통계적 신뢰도에 영향을 줍니다.", "OX"),
        ("dl-13", "데이터 분석 신뢰도에 대한 설명으로 틀린 것은?", "결측치는 항상 단순 삭제하는 것이 최선이다", ["편향을 줄여야 한다", "이상치를 확인해야 한다", "수집 방법을 기록해야 한다"], "결측은 삭제·대체·모델링 등 맥락에 맞게 처리합니다."),
        ("dl-14", "양질의 데이터를 확보하는 방법으로 틀린 것은?", "저품질 데이터를 고품질이라고 가정하고 그대로 사용한다", ["수집 기준을 명확히 한다", "검증 규칙을 둔다", "출처를 기록한다"], "품질 문제를 인지하고 개선해야 합니다."),
        ("dl-15", "저품질 데이터는 분석에 절대 사용하지 않는다.", "X (거짓)", ["O (참)"], "전처리·보정 후 활용할 수 있습니다.", "OX"),
        ("dl-16", "프로젝트 A에서 저품질이었던 데이터가 프로젝트 B에서는 유용할 수 있다.", "O (참)", ["X (거짓)"], "품질은 목적·맥락에 따라 달라집니다.", "OX"),
        ("dl-17", "설문에서 무성의 응답이 많아 결과가 한쪽으로 치우치는 문제는?", "데이터 편향 (bias)", ["결측치", "이상치", "암호화 오류"], "표본·응답 편향은 대표성을 해칩니다."),
        ("dl-18", "직원 표에서 연봉이 비어 있고 나이가 9999로 기록된 경우, 가장 먼저 의심할 문제는?", "결측과 오류가 동시에 존재한다", ["정상 데이터", "인코딩 문제만", "중복 키"], "결측(연봉)·오류(나이)를 함께 점검해야 합니다."),
        ("dl-19", "뉴스 기사는 검증된 정보이므로 분석 전에 항상 그대로 수용해야 한다.", "X (거짓)", ["O (참)"], "출처·편향·사실 여부를 검증해야 합니다.", "OX"),
        ("dl-20", "학생 등번호(1,2,3…)에 해당하는 측정 척도는?", "명목 척도 (nominal)", ["서열 척도", "등간 척도", "비율 척도"], "등번호는 순서·간격·비율 의미가 없습니다."),
        ("dl-21", "범주형 데이터에 대한 설명으로 틀린 것은?", "등간·비율 척도는 범주형 데이터에 해당한다", ["명목·서열 척도는 범주형이다", "범주형은 그룹을 나타낸다", "연속형과 구분된다"], "등간·비율은 주로 연속형(수치형)입니다."),
        ("dl-22", "사회과학에서 두 변수가 상관관계를 보여도 인과관계가 없는 경우가 많다.", "O (참)", ["X (거짓)"], "상관은 인과를 보장하지 않습니다.", "OX"),
        ("dl-23", "두 백신(ㄱ, ㄴ) 효과를 비교하는 연구의 모집단은?", "각 백신의 효과를 나타내는 대상 전체", ["실험 참가자 100명만", "백신 제조사 직원", "의사 면허 소지자"], "모집단은 연구 질문이 적용되는 전체 집단입니다."),
        ("dl-24", "다음 중 원천(primary) 데이터가 아닌 것은?", "백과사전 요약 통계", ["설문 원본 응답", "센서 측정 로그", "거래 원장"], "백과사전은 2차 가공·집계된 정보입니다."),
        ("dl-25", "데이터 연결(조인)에 대한 설명으로 틀린 것은?", "데이터 연결은 되도록 하지 않는 것이 좋다", ["키로 테이블을 연결한다", "정규화 후 조인으로 복원한다", "FK로 관계를 표현한다"], "관계형 DB에서 조인은 핵심 연산입니다."),
        ("dl-26", "이름·나이·성별만으로 직원을 유일하게 식별할 수 있다.", "X (거짓)", ["O (참)"], "동명이인·동일 나이·성별이 존재할 수 있어 유일성이 보장되지 않습니다.", "OX"),
    ]
    for spec in dl_specs:
        iid, q, correct, wrongs, summary = spec[:5]
        extra = {}
        if len(spec) > 5 and spec[5] == "OX":
            extra["choicePrompt"] = "O 또는 X 중 올바른 답을 고르세요."
        items.append(choice_item(iid, S17, q, correct, wrongs, summary=summary, **extra))

    # ── 06/17 NumPy 실습 6 ──
    items += [
        python_item(
            "np-01",
            S17,
            "실습: NumPy 1차원 배열 만들기",
            "import numpy as np\n\narr = None  # TODO: [1,2,3,4,5] 배열 생성\nprint(arr)",
            "import numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint(arr)",
            {
                "goal": "np.array로 1차원 배열 arr을 만들고 출력합니다.",
                "steps": ["import numpy as np", "arr = np.array([1,2,3,4,5])", "print(arr)"],
                "tip": "np.array()에 리스트를 넘기면 ndarray가 생성됩니다.",
            },
            {
                "patterns": ["numpy", "array", "print"],
                "assertCode": "assert list(arr) == [1, 2, 3, 4, 5]",
            },
            packages=["numpy"],
            summary="np.array로 ndarray를 생성합니다.",
        ),
        python_item(
            "np-02",
            S17,
            "실습: 2차원 배열의 shape 확인",
            "import numpy as np\n\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])\nshape = None  # TODO: matrix의 shape\nprint(shape)",
            "import numpy as np\n\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])\nshape = matrix.shape\nprint(shape)",
            {
                "goal": "2차원 배열 matrix의 shape를 구해 출력합니다.",
                "steps": ["matrix.shape 속성 사용", "print(shape)"],
            },
            {
                "patterns": ["shape"],
                "assertCode": "assert shape == (2, 3)",
            },
            packages=["numpy"],
            setupCode="import numpy as np\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])",
        ),
        python_item(
            "np-03",
            S17,
            "실습: reshape으로 2×3 배열 만들기",
            "import numpy as np\n\narr = np.arange(1, 7)\nreshaped = None  # TODO: 2행 3열로 reshape\nprint(reshaped)",
            "import numpy as np\n\narr = np.arange(1, 7)\nreshaped = arr.reshape(2, 3)\nprint(reshaped)",
            {
                "goal": "1~6 원소 배열을 2×3 형태로 reshape합니다.",
                "steps": ["arr.reshape(2, 3)", "print(reshaped)"],
            },
            {
                "patterns": ["reshape"],
                "assertCode": "assert reshaped.shape == (2, 3) and reshaped[0, 0] == 1",
            },
            packages=["numpy"],
            setupCode="import numpy as np\narr = np.arange(1, 7)",
        ),
        python_item(
            "np-04",
            S17,
            "실습: 벡터 덧셈",
            "import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])\nresult = None  # TODO: a + b\nprint(result)",
            "import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])\nresult = a + b\nprint(result)",
            {
                "goal": "두 벡터 a, b를 요소별로 더합니다.",
                "steps": ["result = a + b", "print(result)"],
            },
            {
                "patterns": ["+"],
                "assertCode": "assert list(result) == [11, 22, 33]",
            },
            packages=["numpy"],
            setupCode="import numpy as np\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])",
        ),
        python_item(
            "np-05",
            S17,
            "실습: broadcasting 연산",
            "import numpy as np\n\narr = np.array([[1, 2, 3], [4, 5, 6]])\nbroadcasted = None  # TODO: arr + 10 (broadcasting)\nprint(broadcasted)",
            "import numpy as np\n\narr = np.array([[1, 2, 3], [4, 5, 6]])\nbroadcasted = arr + 10\nprint(broadcasted)",
            {
                "goal": "broadcasting으로 배열 arr의 모든 원소에 10을 더합니다.",
                "steps": ["arr + 10", "print(broadcasted)"],
                "tip": "shape이 다른 배열·스칼라 연산 시 broadcasting 규칙이 적용됩니다.",
            },
            {
                "patterns": ["+"],
                "assertCode": "assert broadcasted[0, 0] == 11 and broadcasted[1, 2] == 16",
            },
            packages=["numpy"],
            setupCode="import numpy as np\narr = np.array([[1, 2, 3], [4, 5, 6]])",
        ),
        python_item(
            "np-06",
            S17,
            "실습: boolean mask로 평균 구하기",
            "import numpy as np\n\nvalues = np.array([12, 5, 18, 3, 20, 7])\nmask = values > 10\nmean_val = None  # TODO: mask가 True인 값의 평균\nprint(mean_val)",
            "import numpy as np\n\nvalues = np.array([12, 5, 18, 3, 20, 7])\nmask = values > 10\nmean_val = values[mask].mean()\nprint(mean_val)",
            {
                "goal": "10보다 큰 값만 선택해 평균(mean_val)을 구합니다.",
                "steps": ["mask = values > 10", "values[mask].mean()", "print(mean_val)"],
            },
            {
                "patterns": ["mask", "mean"],
                "assertCode": "assert abs(mean_val - 16.666666666666668) < 0.01",
            },
            packages=["numpy"],
            setupCode="import numpy as np\nvalues = np.array([12, 5, 18, 3, 20, 7])",
        ),
    ]

    # ── 06/18 Pandas & 시각화 — choice 8 ──
    items += [
        choice_item(
            "c0618-pd-01",
            S18,
            "pandas를 import할 때 관례적으로 쓰는 별칭(alias)은?",
            "pd",
            ["pn", "pda", "pandas"],
            summary="import pandas as pd 가 표준 관례입니다.",
        ),
        choice_item(
            "c0618-pd-02",
            S18,
            "pandas에서 행·열 라벨이 있는 2차원 표 형태 자료구조는?",
            "DataFrame",
            ["Series", "ndarray", "dict"],
            summary="Series는 1차원, DataFrame은 2차원 표입니다.",
        ),
        choice_item(
            "c0618-pd-03",
            S18,
            "CSV 파일을 DataFrame으로 읽는 함수는?",
            "pd.read_csv()",
            ["pd.load_csv()", "pd.open_csv()", "pd.read_file()"],
        ),
        choice_item(
            "c0618-pd-04",
            S18,
            "DataFrame의 앞부분 5행을 확인하는 메서드는?",
            "head()",
            ["top()", "first()", "preview()"],
        ),
        choice_item(
            "c0618-pd-05",
            S18,
            "그룹별 집계에 사용하는 메서드는?",
            "groupby()",
            ["pivot()", "merge()", "concat()"],
        ),
        choice_item(
            "c0618-viz-01",
            S18,
            "matplotlib.pyplot을 관례적으로 import하는 별칭은?",
            "plt",
            ["mpl", "plot", "pyplot"],
        ),
        choice_item(
            "c0618-viz-02",
            S18,
            "통계 시각화에 특화된 라이브러리는?",
            "seaborn",
            ["plotly", "bokeh", "altair"],
            summary="seaborn(sns)은 matplotlib 기반 통계 차트 라이브러리입니다.",
        ),
        choice_item(
            "c0618-viz-03",
            S18,
            "두 수치 변수 간 관계·분포를 점으로 표현하는 그래프는?",
            "산점도 (scatter plot)",
            ["히스토그램", "파이 차트", "박스 플롯"],
            summary="산점도는 상관·군집 패턴 탐색에 유용합니다.",
        ),
    ]

    # ── 06/18 Pandas 실습 ──
    items += [
        python_item(
            "pd-01",
            S18,
            "실습: misemunji.csv 읽기",
            "import pandas as pd\n\nmm = None  # TODO: /data/misemunji.csv 읽기\nprint(len(mm))",
            "import pandas as pd\n\nmm = pd.read_csv('/data/misemunji.csv')\nprint(len(mm))",
            {
                "goal": "misemunji.csv를 DataFrame mm으로 읽고 행 개수를 출력합니다.",
                "steps": ["mm = pd.read_csv('/data/misemunji.csv')", "print(len(mm))"],
            },
            {
                "patterns": ["read_csv"],
                "assertCode": "assert mm is not None and len(mm) == 10",
            },
            packages=["pandas"],
            datasets=["misemunji"],
        ),
        python_item(
            "pd-02",
            S18,
            "실습: 외국인 열 숫자 변환 (to_numeric)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park.csv')\nforeigner = None  # TODO: 쉼표 제거 후 숫자 변환\nprint(foreigner.dtype)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park.csv')\nforeigner = pd.to_numeric(df['외국인'].str.replace(',', '', regex=False))\nprint(foreigner.dtype)",
            {
                "goal": "외국인 열의 쉼표를 제거하고 숫자형 Series로 변환합니다.",
                "steps": [
                    "df['외국인'].str.replace(',', '')",
                    "pd.to_numeric() 적용",
                ],
            },
            {
                "patterns": ["to_numeric", "외국인"],
                "assertCode": "assert foreigner.dtype.name.startswith('int') or foreigner.dtype.name == 'float64'",
            },
            packages=["pandas"],
            datasets=["seoul_park"],
            setupCode=SEOUL_PARK_SETUP.strip(),
        ),
        python_item(
            "pd-03",
            S18,
            "실습: 요일 숫자를 한글 요일로 변환 (map)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park02.csv')\nweek = {0: '월', 1: '화', 2: '수', 3: '목', 4: '금', 5: '토', 6: '일'}\n요일 = None  # TODO: df['요일']을 week로 map\nprint(요일.iloc[0])",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park02.csv')\nweek = {0: '월', 1: '화', 2: '수', 3: '목', 4: '금', 5: '토', 6: '일'}\n요일 = df['요일'].map(week)\nprint(요일.iloc[0])",
            {
                "goal": "요일 열(0~6)을 week 딕셔너리로 한글 요일 문자열로 변환합니다.",
                "steps": ["df['요일'].map(week)", "첫 값 출력"],
            },
            {
                "patterns": ["map"],
                "assertCode": "assert 요일.iloc[0] == '금'",
            },
            packages=["pandas"],
            datasets=["seoul_park02"],
            setupCode="import pandas as pd\nweek = {0: '월', 1: '화', 2: '수', 3: '목', 4: '금', 5: '토', 6: '일'}",
        ),
        python_item(
            "pd-04-badair",
            S18,
            "실습: 미세먼지 최댓값 구하기",
            "import pandas as pd\n\nmm = pd.read_csv('/data/misemunji.csv')\nbadair = None  # TODO: 미세먼지 열의 최댓값\nprint(badair)",
            "import pandas as pd\n\nmm = pd.read_csv('/data/misemunji.csv')\nbadair = mm['미세먼지'].max()\nprint(badair)",
            {
                "goal": "misemunji 데이터에서 미세먼지 최댓값을 badair에 저장합니다.",
                "steps": ["mm['미세먼지'].max()", "print(badair)"],
            },
            {
                "patterns": ["max", "미세먼지"],
                "assertCode": "assert badair == 95",
            },
            packages=["pandas"],
            datasets=["misemunji", "seoul_park03"],
            setupCode="""import pandas as pd
df = pd.read_csv('/data/seoul_park03.csv')
mm = pd.read_csv('/data/misemunji.csv')""",
        ),
        python_item(
            "pd-04-thursday",
            S18,
            "실습: 목요일 유료합계 최댓값 (groupby)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\nthursday = None  # TODO: 요일이 '목'인 행의 유료합계 최댓값\nprint(thursday)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\nthursday = df.loc[df['요일'] == '목', '유료합계'].max()\nprint(thursday)",
            {
                "goal": "요일이 '목'인 날의 유료합계 최댓값을 thursday에 저장합니다.",
                "steps": [
                    "df['요일'] == '목' 필터",
                    "유료합계.max()",
                ],
                "tip": "groupby('요일')['유료합계'].max()로도 구할 수 있습니다.",
            },
            {
                "patterns": ["목", "유료합계"],
                "assertCode": "assert thursday == 12233",
            },
            packages=["pandas"],
            datasets=["seoul_park03"],
            setupCode="import pandas as pd\ndf = pd.read_csv('/data/seoul_park03.csv')",
        ),
        python_item(
            "pd-05",
            S18,
            "실습: 어른 3000명 초과 행 필터 (loc)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\nfiltered = None  # TODO: 어른 > 3000 인 행만\nprint(len(filtered))",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\nfiltered = df.loc[df['어른'] > 3000]\nprint(len(filtered))",
            {
                "goal": "어른 방문객이 3000명을 초과한 날만 loc로 필터링합니다.",
                "steps": ["df.loc[df['어른'] > 3000]", "행 개수 출력"],
            },
            {
                "patterns": ["loc", "어른"],
                "assertCode": "assert len(filtered) >= 3",
            },
            packages=["pandas"],
            datasets=["seoul_park03"],
            setupCode="import pandas as pd\ndf = pd.read_csv('/data/seoul_park03.csv')",
        ),
        python_item(
            "pd-06",
            S18,
            "실습: 결측치 채우기 (fillna)",
            "import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv('/data/seoul_park03.csv')\ndf.loc[0, '단체'] = np.nan\nfilled = None  # TODO: 단체 열 NaN을 0으로 채운 Series\nprint(filled.iloc[0])",
            "import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv('/data/seoul_park03.csv')\ndf.loc[0, '단체'] = np.nan\nfilled = df['단체'].fillna(0)\nprint(filled.iloc[0])",
            {
                "goal": "단체 열의 결측치를 fillna(0)로 채웁니다.",
                "steps": ["df['단체'].fillna(0)", "첫 값 확인"],
            },
            {
                "patterns": ["fillna"],
                "assertCode": "assert filled.iloc[0] == 0",
            },
            packages=["pandas"],
            datasets=["seoul_park03"],
            setupCode="import pandas as pd\nimport numpy as np\ndf = pd.read_csv('/data/seoul_park03.csv')",
        ),
        python_item(
            "pd-07",
            S18,
            "실습: DataFrame 세로 병합 (concat)",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\napril = pd.read_csv('/data/seoul_park_april.csv')\nmerged = None  # TODO: df와 april을 세로로 concat\nprint(len(merged))",
            "import pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\napril = pd.read_csv('/data/seoul_park_april.csv')\nmerged = pd.concat([df, april], ignore_index=True)\nprint(len(merged))",
            {
                "goal": "seoul_park03과 seoul_park_april을 pd.concat으로 세로 병합합니다.",
                "steps": ["pd.concat([df, april], ignore_index=True)", "행 개수 출력"],
            },
            {
                "patterns": ["concat"],
                "assertCode": "assert len(merged) == len(df) + len(april)",
            },
            packages=["pandas"],
            datasets=["seoul_park03", "seoul_park_april"],
            setupCode="import pandas as pd\ndf = pd.read_csv('/data/seoul_park03.csv')",
        ),
    ]

    # ── 06/18 시각화 실습 ──
    items += [
        python_item(
            "viz-01",
            S18,
            "실습: matplotlib 선 그래프",
            "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [2, 4, 1, 5]\n# TODO: plt.plot으로 선 그래프 그리기\nplt.plot(x, y)\nplt.show()",
            "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [2, 4, 1, 5]\nplt.plot(x, y)\nplt.show()",
            {
                "goal": "matplotlib.pyplot으로 간단한 선 그래프를 그립니다.",
                "steps": ["import matplotlib.pyplot as plt", "plt.plot(x, y)", "plt.show()"],
            },
            {
                "patterns": ["matplotlib", "plot"],
            },
            packages=["matplotlib"],
            summary="plt.plot(x, y)로 선 그래프를 그립니다.",
        ),
        python_item(
            "viz-02",
            S18,
            "실습: 산점도로 어른·청소년 관계 보기",
            "import matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\n# TODO: 어른(x) vs 청소년(y) 산점도\nplt.scatter(df['어른'], df['청소년'])\nplt.xlabel('어른')\nplt.ylabel('청소년')\nplt.show()",
            "import matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.read_csv('/data/seoul_park03.csv')\nplt.scatter(df['어른'], df['청소년'])\nplt.xlabel('어른')\nplt.ylabel('청소년')\nplt.show()",
            {
                "goal": "seoul_park03 데이터로 어른·청소년 산점도를 그립니다.",
                "steps": [
                    "plt.scatter(df['어른'], df['청소년'])",
                    "xlabel, ylabel 설정",
                    "plt.show()",
                ],
            },
            {
                "patterns": ["scatter", "어른", "청소년"],
            },
            packages=["matplotlib", "pandas"],
            datasets=["seoul_park03"],
            setupCode="import pandas as pd\ndf = pd.read_csv('/data/seoul_park03.csv')",
            summary="산점도로 두 변수 간 관계를 시각화합니다.",
        ),
    ]

    return items


def append_curriculum():
    deck = json.loads(COURSE_JSON.read_text(encoding="utf-8"))
    seen_ids = {it["id"] for it in deck["items"]}
    new_items = build_new_items()

    added = []
    for item in new_items:
        if item["id"] in seen_ids:
            continue
        seen_ids.add(item["id"])
        deck["items"].append(item)
        added.append(item)

    section_order = list(deck["meta"].get("sectionOrder", []))
    for sec in NEW_SECTIONS:
        if sec not in section_order:
            section_order.append(sec)

    deck["meta"]["title"] = "AI 실무 기본과정 (5/26~6/18)"
    deck["meta"]["curriculumEnd"] = "2026-06-18"
    deck["meta"]["sectionOrder"] = section_order

    def sort_key(it):
        sec = it.get("section", "")
        try:
            order = section_order.index(sec)
        except ValueError:
            order = 99
        return (order, it.get("id", ""))

    deck["items"].sort(key=sort_key)

    COURSE_JSON.write_text(
        json.dumps(deck, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    counts = Counter(it["section"] for it in added)
    type_counts = Counter(it["itemType"] for it in added)

    print(f"Written {COURSE_JSON}")
    print(f"New items added: {len(added)}")
    print(f"  choice: {type_counts.get('choice', 0)}")
    print(f"  sql:    {type_counts.get('sql', 0)}")
    print(f"  python: {type_counts.get('python', 0)}")
    print("By section:")
    for sec in NEW_SECTIONS:
        print(f"  {counts.get(sec, 0):3d}  {sec}")
    print(f"Total items in deck: {len(deck['items'])}")


if __name__ == "__main__":
    append_curriculum()
