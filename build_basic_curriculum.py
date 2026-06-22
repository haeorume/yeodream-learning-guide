# -*- coding: utf-8 -*-
"""
AI 실무 기본과정 (5/26~6/12) 통합 덱 생성
- 기존 4개 JSON 병합 + 섹션명 커리큘럼 정렬
- 누락 문항 PDF 강의 내용 기반 추가
"""
import json
import random
from pathlib import Path

DATA = Path(__file__).parent / "data"

# 커리큘럼 순서 (초록색 기본과정)
SECTION_ORDER = [
    "05/26 IT 리터러시",
    "05/27 핵심 운영체제·리눅스",
    "05/28 네트워크 개론",
    "05/29 파이썬 기본 문법 1",
    "06/01 파이썬 기본·중급 문법",
    "06/02 파이썬 중급 문법",
    "06/04 파이썬 라이브러리 활용",
    "06/05 생성형 AI 기초",
    "06/08 SQL 개요 & DML",
    "06/09 SQL 함수 & 서브쿼리",
    "06/10 집합연산자 & 계층형 질의",
    "06/11 JOIN 심화 & 서브쿼리 심화",
    "06/12 그룹 함수 & 윈도우 함수",
]

DAY_BY_SECTION = {s: s[:5] for s in SECTION_ORDER}

SECTION_MAP = {
    "01 IT 리터러시": "05/26 IT 리터러시",
    "02 리눅스·운영체제": "05/27 핵심 운영체제·리눅스",
    "02 핵심 운영체제·네트워크 기초": "05/27 핵심 운영체제·리눅스",
    "03 네트워크 실무": "05/28 네트워크 개론",
    "03 네트워크·HTTP": "05/28 네트워크 개론",
    "04 파이썬 기초 문법": "05/29 파이썬 기본 문법 1",
    "04 데이터베이스": "06/08 SQL 개요 & DML",
    "05 생성형 AI·Streamlit": "06/05 생성형 AI 기초",
    "6/1 파이썬 기본·중급 문법": "06/01 파이썬 기본·중급 문법",
    "6/2 파이썬 중급 문법": "06/02 파이썬 중급 문법",
    "6/4 파이썬 라이브러리 활용": "06/04 파이썬 라이브러리 활용",
    "6/5 생성형 AI 기초": "06/05 생성형 AI 기초",
    "6/8 SQL 개요 & DML": "06/08 SQL 개요 & DML",
    "6/9 SQL 함수 & 서브쿼리": "06/09 SQL 함수 & 서브쿼리",
    "6/10 집합연산자 & 계층형 질의": "06/10 집합연산자 & 계층형 질의",
    "6/11 JOIN 심화 & 서브쿼리 심화": "06/11 JOIN 심화 & 서브쿼리 심화",
    "6/12 그룹 함수 & 윈도우 함수": "06/12 그룹 함수 & 윈도우 함수",
}

SOURCE_FILES = [
    "basic-course.json",
    "it-network.json",
    "sql-dml.json",
    "june-review.json",
]


def choice_item(item_id, section, question, correct, wrongs, **extra):
    """선택형 4지선다 생성"""
    opts = [{"text": correct, "isCorrect": True, "rationale": extra.get("summary", "정답입니다.")[:100]}]
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


NEW_ITEMS = [
    # ── 05/26 IT 리터러시 ──
    choice_item(
        "c0526-01", "05/26 IT 리터러시",
        "데이터베이스에서 각 행을 유일하게 식별하는 열을 무엇이라 부르나요?",
        "기본키 (Primary Key)",
        ["외래키", "인덱스", "뷰"],
        hint="Primary Key — PK",
        summary="PK는 테이블 행의 고유 식별자입니다. FK는 다른 테이블 PK를 참조합니다.",
        explanation="강의: 데이터베이스와 REST API — 키 개념.",
    ),
    choice_item(
        "c0526-02", "05/26 IT 리터러시",
        "다른 테이블의 기본키를 참조하는 열은?",
        "외래키 (Foreign Key)",
        ["기본키", "유니크 키", "체크 키"],
        summary="FK로 테이블 간 관계(1:N 등)를 표현합니다.",
    ),
    choice_item(
        "c0526-03", "05/26 IT 리터러시",
        "웹 API에서 리소스 조회에 주로 쓰는 HTTP 메서드는?",
        "GET",
        ["POST", "PATCH", "CONNECT"],
        summary="GET 조회 / POST 생성 / PUT·PATCH 수정 / DELETE 삭제.",
    ),
    # ── 05/27 리눅스 ──
    choice_item(
        "c0527-01", "05/27 핵심 운영체제·리눅스",
        "디렉터리를 이동하는 리눅스 명령어는?",
        "cd",
        ["ls", "pwd", "mv"],
        summary="cd change directory / ls 목록 / pwd 현재 경로.",
    ),
    choice_item(
        "c0527-02", "05/27 핵심 운영체제·리눅스",
        "리눅스 구조에서 하드웨어와 사용자 사이 명령을 해석하는 계층은?",
        "Shell (셸)",
        ["Kernel만 단독", "BIOS", "드라이버만"],
        summary="사용자 → Shell → Kernel → Hardware. bash가 기본 셸.",
    ),
    choice_item(
        "c0527-03", "05/27 핵심 운영체제·리눅스",
        "현재 디렉터리의 파일·폴더 목록을 보는 명령어는?",
        "ls",
        ["cd", "cat", "chmod"],
    ),
    choice_item(
        "c0527-04", "05/27 핵심 운영체제·리눅스",
        "프로세스 메모리 중 동적 할당(malloc 등)이 이루어지는 영역은?",
        "힙 영역",
        ["스택 영역", "코드 영역", "BSS 영역"],
        summary="코드·데이터·BSS·힙·스택으로 프로세스 메모리가 구분됩니다.",
    ),
    # ── 05/28 네트워크 ──
    choice_item(
        "c0528-01", "05/28 네트워크 개론",
        "OSI 7계층 중 HTTP가 속하는 계층은?",
        "응용 계층 (7계층)",
        ["전송 계층 (4계층)", "네트워크 계층 (3계층)", "물리 계층 (1계층)"],
        summary="HTTP·FTP·SMTP는 응용 계층. TCP/UDP는 전송 계층.",
    ),
    choice_item(
        "c0528-02", "05/28 네트워크 개론",
        "MAC 주소가 사용되는 OSI 계층은?",
        "데이터 링크 계층 (2계층)",
        ["네트워크 계층", "전송 계층", "응용 계층"],
    ),
    # ── 05/29 파이썬 기본 1 ──
    choice_item(
        "c0529-01", "05/29 파이썬 기본 문법 1",
        "화면에 값을 출력하는 파이썬 내장 함수는?",
        "print",
        ["input", "echo", "display"],
        code='print("Hello, elice!")',
        summary="print(값) 또는 print(a, b)로 여러 값 출력 가능.",
    ),
    choice_item(
        "c0529-02", "05/29 파이썬 기본 문법 1",
        "파이썬에서 정수 나눗셈의 몫을 구하는 연산자는?",
        "//",
        ["/", "%", "**"],
        summary="// 몫, % 나머지, / 실수 나눗셈, ** 제곱.",
    ),
    choice_item(
        "c0529-03", "05/29 파이썬 기본 문법 1",
        "조건이 참일 때만 실행하는 문법의 시작 키워드는?",
        "if",
        ["for", "while", "switch"],
        summary="if / elif / else 로 분기. 파이썬에는 switch 대신 match(3.10+)가 있습니다.",
    ),
    choice_item(
        "c0529-04", "05/29 파이썬 기본 문법 1",
        "리스트 [10, 20, 30]에서 인덱스 1의 값은?",
        "20",
        ["10", "30", "1"],
        summary="인덱스는 0부터 시작. [1]은 두 번째 원소.",
    ),
    choice_item(
        "c0529-05", "05/29 파이썬 기본 문법 1",
        "여러 값을 순서대로 담는 파이썬 자료형은?",
        "리스트 (list)",
        ["딕셔너리만", "튜플만 불가", "셋만"],
        summary="list는 mutable, tuple은 immutable 시퀀스입니다.",
    ),
    {
        "id": "c0529-py-01",
        "section": "05/29 파이썬 기본 문법 1",
        "day": "05/29",
        "itemType": "python",
        "question": "실습: 1부터 5까지 출력하기",
        "instructions": "for 루프와 print를 사용해 1 2 3 4 5 가 각 줄에 출력되도록 작성하세요.",
        "starterCode": "# for i in range(...):\n#     print(i)",
        "validate": {"patterns": ["for", "range", "print"], "assertCode": ""},
        "referenceCode": "for i in range(1, 6):\n    print(i)",
        "hint": "range(1, 6)은 1~5까지입니다.",
        "summary": "range(시작, 끝) — 끝 값은 포함하지 않습니다.",
    },
    # ── 06/02 보강 ──
    choice_item(
        "c0602-06", "06/02 파이썬 중급 문법",
        "중복 없는 원소 모음 자료형은?",
        "set",
        ["list", "tuple", "dict"],
        summary="set은 {} 또는 set()으로 생성, 중복 제거·집합 연산에 유용.",
    ),
    choice_item(
        "c0602-07", "06/02 파이썬 중급 문법",
        "파일을 열고 자동으로 닫아 주는 구문은?",
        "with open(...) as f:",
        ["open()만 사용", "file()", "readfile()"],
        summary="with 문은 컨텍스트 매니저로 리소스를 안전하게 해제합니다.",
    ),
    # ── 06/04 보강 ──
    choice_item(
        "c0604-07", "06/04 파이썬 라이브러리 활용",
        "표 형태 데이터의 열 이름 목록을 확인하는 속성은?",
        "df.columns",
        ["df.rows", "df.headers", "df.names"],
        summary="DataFrame: .columns, .shape, .head(), .info() 가 탐색 기본.",
    ),
    # ── 06/05 보강 ──
    choice_item(
        "c0605-06", "06/05 생성형 AI 기초",
        "검색 결과를 LLM에 함께 넣어 답변 품질을 높이는 방식의 약자는?",
        "RAG",
        ["GAN", "CNN", "MCP"],
        summary="Retrieval-Augmented Generation — 벡터 DB·문서 검색 + LLM 생성.",
        explanation="6월 18일 이후 심화 과정에서 본격 다루지만 기초 개념으로 소개됩니다.",
    ),
    # ── 06/10 보강 ──
    choice_item(
        "c0610-07", "06/10 집합연산자 & 계층형 질의",
        "두 SELECT 결과를 합치되 중복을 유지하는 연산자는?",
        "UNION ALL",
        ["UNION", "INTERSECT", "JOIN"],
        summary="UNION은 중복 제거, UNION ALL은 중복 유지.",
    ),
    # ── 06/11 보강 ──
    choice_item(
        "c0611-08", "06/11 JOIN 심화 & 서브쿼리 심화",
        "같은 테이블을 두 번 조인하는 패턴을 무엇이라 부르나요?",
        "셀프 조인 (Self JOIN)",
        ["크로스 조인", "내추럴 조인만", "아우터 조인만"],
        summary="직원-매니저 관계처럼 한 테이블 내 FK가 자기 자신을 참조할 때 사용.",
    ),
    # ── 06/12 보강 ──
    choice_item(
        "c0612-09", "06/12 그룹 함수 & 윈도우 함수",
        "동점에도 연속된 순위 번호를 부여하는 함수는?",
        "DENSE_RANK",
        ["RANK", "ROW_NUMBER", "NTILE"],
        summary="RANK=건너뜀, DENSE_RANK=안 건너뜀, ROW_NUMBER=동점도 다른 번호.",
    ),
    {
        "id": "c0612-sql-03",
        "section": "06/12 그룹 함수 & 윈도우 함수",
        "day": "06/12",
        "itemType": "sql",
        "question": "실습: NTILE(3)으로 3그룹 나누기",
        "instructions": "GYM_MEMBER 테이블에서 (SQUAT+BENCH_PRESS+DEADLIFT) 합계를 SCORE_SUM으로 계산하고, 합계 내림차순 기준 NTILE(3) 그룹(grp)을 구하세요. MEMBER_ID도 출력합니다.",
        "sandbox": "gym_member",
        "starterSql": "SELECT MEMBER_ID,\n       SQUAT + BENCH_PRESS + DEADLIFT AS SCORE_SUM,\n       -- NTILE(3) OVER (ORDER BY ...)\nFROM GYM_MEMBER;",
        "validate": {"patterns": ["ntile", "over", "order by"], "minRows": 1},
        "referenceSql": "SELECT MEMBER_ID,\n       SQUAT + BENCH_PRESS + DEADLIFT AS SCORE_SUM,\n       NTILE(3) OVER (ORDER BY SQUAT + BENCH_PRESS + DEADLIFT DESC) AS grp\nFROM GYM_MEMBER;",
        "hint": "NTILE(3) OVER (ORDER BY SCORE_SUM DESC)",
        "summary": "NTILE(n)은 순위를 n개 버킷으로 균등 분할합니다.",
    },
]


def remap_item(item: dict) -> dict:
    out = dict(item)
    old_sec = item.get("section", "")
    new_sec = SECTION_MAP.get(old_sec, old_sec)
    if new_sec in DAY_BY_SECTION:
        out["section"] = new_sec
        out["day"] = DAY_BY_SECTION[new_sec]
    elif old_sec.startswith("6/"):
        # fallback
        for s in SECTION_ORDER:
            if old_sec.replace("6/", "06/0") in s or old_sec[3:5] in s:
                out["section"] = s
                out["day"] = DAY_BY_SECTION[s]
                break
    return out


def merge_decks():
    seen_ids = set()
    items = []
    for fname in SOURCE_FILES:
        path = DATA / fname
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for item in data["items"]:
            remapped = remap_item(item)
            iid = remapped["id"]
            if iid in seen_ids:
                continue
            seen_ids.add(iid)
            items.append(remapped)

    for item in NEW_ITEMS:
        if item["id"] not in seen_ids:
            seen_ids.add(item["id"])
            items.append(item)

    def sort_key(it):
        sec = it.get("section", "")
        try:
            order = SECTION_ORDER.index(sec)
        except ValueError:
            order = 99
        return (order, it.get("id", ""))

    items.sort(key=sort_key)

    deck = {
        "meta": {
            "id": "basic-ai-course",
            "title": "AI 실무 기본과정 (5/26~6/12)",
            "description": "이어드림스쿨 6기 · IT리터러시~윈도우함수까지 일차별 선택형·코딩 실습",
            "curriculumEnd": "2026-06-12",
            "sectionOrder": SECTION_ORDER,
        },
        "items": items,
    }
    out = DATA / "basic-ai-course.json"
    out.write_text(json.dumps(deck, ensure_ascii=False, indent=2), encoding="utf-8")

    from collections import Counter
    c = Counter(i["section"] for i in items)
    print(f"Written {out} - {len(items)} items")
    for s in SECTION_ORDER:
        print(f"  {c.get(s, 0):3d}  {s}")
    missing = [s for s in SECTION_ORDER if c.get(s, 0) < 3]
    if missing:
        print("  (적은 문항 섹션):", missing)


if __name__ == "__main__":
    merge_decks()
