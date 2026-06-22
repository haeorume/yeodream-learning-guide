# -*- coding: utf-8 -*-
"""선택형 — 품질 낮은 힌트·해설·rationale 수동 보강."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

# id → {hint, summary, explanation, rationales: {option_text: rationale}}
PATCHES: dict[str, dict] = {
    "ct-sup-02": {
        "rationales": {
            "nums.last()": "파이썬 리스트에 .last() 메서드는 없습니다. 인덱싱을 사용하세요.",
        }
    },
    "ct-sup-05": {
        "hint": "if 다음 조건이 거짓일 때 이어서 검사하는 두 번째 분기 키워드를 생각해 보세요. (else if의 줄임)",
    },
    "ct-sup-07": {
        "hint": "리스트를 돌 때 `for 변수 in 리스트:` 형태의 반복문 헤더를 떠올려 보세요.",
        "summary": "for item in items: 형태로 시퀀스의 각 원소를 순서대로 꺼냅니다.",
        "explanation": "파이썬에서 리스트 순회는 `for item in items:`가 가장 일반적입니다. len(items)로 인덱스를 돌리거나 foreach 같은 문법은 없습니다.",
        "rationales": {
            "for item in items:": "시퀀스 원소를 직접 꺼내 순회하는 표준 패턴입니다.",
            "for item in len(items):": "len()은 정수를 반환하므로 원소가 아닌 숫자를 순회하게 됩니다.",
            "foreach item in items:": "파이썬에는 foreach 키워드가 없습니다.",
            "while item in items:": "while은 조건 반복이며, 전체 원소 순회 패턴과 다릅니다.",
        },
    },
    "ct-sup-08": {
        "hint": "반복문 안에서 더 이상 돌지 않고 즉시 빠져나올 때 쓰는 키워드입니다. (continue와 구분)",
        "explanation": "break는 가장 안쪽 반복문을 즉시 종료합니다. return은 함수 전체를, continue는 현재 회차만 건너뜁니다.",
    },
    "ct-sup-10": {
        "hint": "순서가 있고 [ ]로 만들며, append·인덱싱이 가능한 mutable 시퀀스 타입입니다.",
        "summary": "list는 순서 있는 가변 시퀀스입니다. set·dict는 순서·인덱스 접근 모델이 다릅니다.",
        "explanation": "list는 인덱스로 접근하고 원소를 추가·수정할 수 있는 대표 시퀀스입니다. set은 순서·중복이 없고, dict는 키-값 쌍, frozenset은 불변 집합입니다.",
        "rationales": {
            "list": "순서 있는 mutable 시퀀스로, 인덱스 접근과 append 등이 가능합니다.",
            "set": "중복 없는 집합으로 인덱스 접근이 없습니다.",
            "dict": "키-값 매핑 자료형입니다.",
            "frozenset": "불변 집합으로 시퀀스가 아닙니다.",
        },
    },
    "ct-sup-11": {
        "hint": "문자열 객체 뒤에 점(.)을 찍고, 영어 대문자 변환 메서드 이름을 붙입니다. (자바의 toUpper와 다름)",
        "summary": "파이썬 문자열은 str.upper()로 대문자 변환합니다.",
        "explanation": "s.upper()는 새 문자열 'HELLO'를 반환합니다. upper(s)나 toUpper()는 파이썬 문법이 아닙니다.",
        "rationales": {
            "s.upper()": "str 타입의 표준 대문자 변환 메서드입니다.",
            "s.toUpper()": "자바식 이름으로, 파이썬 str에는 없습니다.",
            "s.uppercase()": "존재하지 않는 메서드 이름입니다.",
            "upper(s)": "파이썬 내장 함수 형태가 아닙니다. 메서드 호출을 사용하세요.",
        },
    },
    "ct-sup-12": {
        "hint": "def 대신 한 줄로 `____ x: x * x`처럼 쓸 때 들어가는 익명 함수 키워드입니다.",
    },
    "ct-sup-14": {
        "hint": "조회할 열 이름을 적고, 어느 테이블에서 가져올지 FROM으로 연결하는 SQL 문장의 시작을 생각해 보세요.",
        "summary": "SELECT 열 FROM 테이블 형태로 특정 컬럼만 조회합니다.",
        "explanation": "SQL 조회는 SELECT로 시작합니다. GET·FETCH는 표준 SQL 키워드가 아니며, SELECT book.title만 쓰면 FROM 절이 빠집니다.",
        "rationales": {
            "SELECT title FROM book": "열과 테이블을 명시한 올바른 SELECT 문입니다.",
            "GET title FROM book": "SQL 표준 키워드가 아닙니다.",
            "SELECT book.title": "FROM book이 없어 문법이 불완전합니다.",
            "FETCH title IN book": "표준 SQL 문법이 아닙니다.",
        },
    },
    "ct-sup-15": {
        "hint": "ORDER BY가 정렬이라면, 조건에 맞는 행만 골라내는 절의 역할은 무엇일까요?",
        "summary": "WHERE는 행(row) 단위로 조건을 걸어 결과를 필터링합니다.",
        "explanation": "WHERE는 SELECT 결과에서 조건에 맞는 행만 남깁니다. JOIN은 테이블 결합, ORDER BY는 정렬, AS는 별칭에 가깝습니다.",
        "rationales": {
            "행 단위 조건으로 결과를 걸러낸다": "WHERE 절의 핵심 역할입니다.",
            "정렬 순서를 정한다": "ORDER BY 절의 역할입니다.",
            "테이블을 합친다": "JOIN 절의 역할입니다.",
            "열 이름을 바꾼다": "AS(별칭)나 SELECT 절에서 다루는 내용입니다.",
        },
    },
    "ct-sup-16": {
        "hint": "두 테이블을 공통 컬럼(키)으로 이어 붙일 때 쓰는 SQL 절입니다. UNION과 헷갈리지 마세요.",
        "summary": "JOIN은 두 테이블을 키 관계로 연결해 열을 확장합니다.",
        "explanation": "JOIN은 행을 키 기준으로 결합합니다. UNION은 결과 집합을 위아래로 합치고, MERGE·LINK는 이 맥락의 표준 키워드가 아닙니다.",
        "rationales": {
            "JOIN": "테이블 간 키로 행을 연결하는 표준 절입니다.",
            "UNION": "두 SELECT 결과를 세로로 합칩니다.",
            "MERGE": "DBMS별 확장 문법일 수 있으나, 기본 '연결' 절은 JOIN입니다.",
            "LINK": "표준 SQL 키워드가 아닙니다.",
        },
    },
    "ct-sup-17": {
        "hint": "NumPy에서 리스트를 ndarray로 바꿀 때 np.____([1,2,3]) 형태로 쓰는 함수입니다.",
        "summary": "np.array()가 파이썬 시퀀스를 NumPy 배열로 변환합니다.",
        "explanation": "np.array([1,2,3])가 가장 기본적인 배열 생성 방법입니다. np.list·np.make·np.matrix_only는 표준 API가 아닙니다.",
        "rationales": {
            "np.array": "시퀀스를 ndarray로 만드는 대표 함수입니다.",
            "np.list": "존재하지 않는 함수입니다.",
            "np.make": "NumPy 표준 함수가 아닙니다.",
            "np.matrix_only": "표준 API가 아닙니다.",
        },
    },
    "ct-sup-18": {
        "hint": "Pandas에서 read_로 시작하고, CSV 확장자 파일을 DataFrame으로 읽는 함수입니다.",
        "summary": "pd.read_csv('파일.csv')로 CSV를 DataFrame으로 불러옵니다.",
        "explanation": "Pandas CSV 로딩은 pd.read_csv가 표준입니다. open_csv·load_csv·read_file은 공식 API가 아닙니다.",
        "rationales": {
            "pd.read_csv": "CSV 파일을 DataFrame으로 읽는 표준 함수입니다.",
            "pd.open_csv": "존재하지 않는 함수입니다.",
            "pd.read_file": "일반 파일명 함수가 아닙니다.",
            "pd.load_csv": "표준 이름이 아닙니다.",
        },
    },
    "ct-sup-19": {
        "hint": "행·열 라벨이 있는 2차원 표 구조. Excel 시트처럼 생긴 Pandas 핵심 타입입니다.",
        "summary": "DataFrame은 2차원 라벨 붙은 표 자료구조입니다.",
        "explanation": "Pandas에서 표 형태 데이터는 DataFrame으로 다룹니다. Series는 1차원, ndarray는 라벨이 없고, Table은 Pandas 타입명이 아닙니다.",
        "rationales": {
            "DataFrame": "2차원 표 데이터의 핵심 자료구조입니다.",
            "Series만 존재": "Series는 1차원이며, 2차원 표는 DataFrame입니다.",
            "ndarray": "NumPy 배열로 행·열 라벨이 없습니다.",
            "Table": "Pandas 공식 타입 이름이 아닙니다.",
        },
    },
    "ct-sup-20": {
        "hint": "리스트 끝에 원소 하나를 붙일 때 쓰는 메서드. push/add는 파이썬 리스트에 없습니다.",
        "summary": "append()는 리스트 맨 뒤에 원소를 추가합니다.",
        "explanation": "nums.append(3)은 [1,2,3]이 됩니다. push는 JS, add는 set 연산에 가깝고, insert만 가능은 사실과 다릅니다.",
        "rationales": {
            "append": "리스트 끝에 원소를 추가하는 메서드입니다.",
            "push": "파이썬 list에는 없는 메서드입니다.",
            "add": "list가 아닌 set 등에서 쓰는 연산입니다.",
            "insert만 가능": "append로 끝에 추가할 수 있습니다.",
        },
    },
}

# 짧은 힌트 보강 (여러 덱에 공통으로 있는 id)
SHORT_HINT_PATCHES: dict[str, str] = {
    "bc-os-01": "실행 중인 프로그램을 식별하는 Process ID 번호를 떠올려 보세요.",
    "net-005": "웹 브라우저가 기본으로 사용하는 HTTP 포트 번호입니다. (HTTPS는 443)",
    "j0608-01": "같은 데이터를 여러 각도에서 보는 시각화 기법입니다. (영문 약자)",
    "j0608-03": "데이터를 구간(bin)으로 나누어 빈도를 막대로 보여 주는 차트입니다.",
}


def apply_patch(item: dict) -> int:
    changed = 0
    iid = item.get("id", "")
    patch = PATCHES.get(iid)
    if patch:
        for key in ("hint", "summary", "explanation"):
            if key in patch and patch[key]:
                if item.get(key) != patch[key]:
                    item[key] = patch[key]
                    changed += 1
        for opt in item.get("options") or []:
            text = opt.get("text", "")
            if text in (patch.get("rationales") or {}):
                new_r = patch["rationales"][text]
                if opt.get("rationale") != new_r:
                    opt["rationale"] = new_r
                    changed += 1

    short = SHORT_HINT_PATCHES.get(iid)
    if short and (item.get("hint") or "").strip() != short:
        item["hint"] = short
        changed += 1

    # ct-* 접두사 복제 id (coding-test-prep)
    for prefix in ("ct-", "ct-jr-", "ct-bc-", "ct-net-"):
        base = iid[len(prefix) :] if iid.startswith(prefix) else None
        if base and base in SHORT_HINT_PATCHES:
            short2 = SHORT_HINT_PATCHES[base]
            if (item.get("hint") or "").strip() != short2:
                item["hint"] = short2
                changed += 1
            break

    return changed


def main() -> int:
    total = 0
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        data = json.loads(fp.read_text(encoding="utf-8"))
        file_changed = 0
        for item in data.get("items", []):
            if not item.get("options"):
                continue
            file_changed += apply_patch(item)
        if file_changed:
            fp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"{fp.name}: {file_changed} fields updated")
            total += file_changed
    print(f"total updates: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
