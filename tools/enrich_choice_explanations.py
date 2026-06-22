# -*- coding: utf-8 -*-
"""선택형 퀴즈 해설 — 정답·오답 보기 정리 포맷 일괄 정리.

app.js updateExplainContent 렌더링 형식:
  explanation (맥락) → 정답 — {text} → 오답 보기 정리 (ul)
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

GENERIC_WRONG = "이 보기는 정답이 아닙니다."
WEAK_RATIONALES = {
    GENERIC_WRONG,
    "이 보기는 문항이 묻는 핵심 개념과 다른 영역을 가리킵니다.",
    "문항의 핵심 개념과 거리가 있는 보기입니다.",
    "이 설명은 사실과 맞습니다. (문항은 옳지 않은 것을 고릅니다.)",
    "정답입니다.",
}

WRONG_QUESTION_RE = re.compile(r"(옳지\s*않|틀린|아닌\s*것|잘못|거짓)")
FIND_WRONG_RE = re.compile(r"(옳지\s*않|틀린|아닌\s*것|잘못된|거짓)")

DAY_LECTURE_NUM = {
    "05/26": "01",
    "05/27": "02",
    "05/28": "03",
    "05/29": "04",
    "06/01": "05",
    "06/02": "06",
    "06/04": "07",
    "06/05": "08",
    "06/08": "09",
    "06/09": "10",
    "06/10": "11",
    "06/11": "12",
    "06/12": "13",
    "06/15": "14",
    "06/16": "15",
    "06/17": "16",
    "06/18": "17",
}

# 보기 텍스트(정규화 키) → 간략 설명
TERM_GLOSSARY: dict[str, str] = {
    "nat": "사설 IP를 공인 IP로 변환합니다.",
    "ssl": "암호화 통신 기술입니다.",
    "tls": "전송 계층 보안 프로토콜입니다.",
    "dns": "도메인 이름을 IP 주소로 해석하는 시스템입니다.",
    "dhcp": "IP 주소 등을 자동으로 할당하는 프로토콜입니다.",
    "arp": "IP 주소와 MAC 주소를 매핑하는 프로토콜입니다.",
    "cors": "브라우저가 다른 출처(origin) 리소스 요청을 제한·허용하는 정책입니다.",
    "tcp": "연결 지향·신뢰성 있는 전송 계층 프로토콜입니다.",
    "udp": "비연결·경량 전송 계층 프로토콜입니다.",
    "http": "웹 응용 계층 프로토콜입니다.",
    "https": "HTTP에 TLS를 더한 암호화 웹 통신입니다.",
    "ftp": "파일 전송 프로토콜입니다.",
    "smtp": "이메일 송신 프로토콜입니다.",
    "ssh": "암호화 원격 접속 프로토콜입니다.",
    "api": "프로그램 간 데이터를 주고받는 인터페이스입니다.",
    "rest": "HTTP 메서드로 리소스를 다루는 API 설계 스타일입니다.",
    "json": "키-값 쌍의 경량 데이터 교환 형식입니다.",
    "xml": "태그 기반 마크업 데이터 형식입니다.",
    "seo": "검색 엔진 최적화(Search Engine Optimization)입니다.",
    "sem": "검색 광고 마케팅(Search Engine Marketing)입니다.",
    "cdn": "콘텐츠를 지역별로 분산 캐시하는 네트워크입니다.",
    "vpn": "공용망 위에 암호화 터널을 만드는 가상 사설망입니다.",
    "lan": "근거리 통신망(Local Area Network)입니다.",
    "wan": "원거리 통신망(Wide Area Network)입니다.",
    "man": "도시권 통신망(Metropolitan Area Network)입니다.",
    "osi": "네트워크를 7계층으로 나눈 참조 모델입니다.",
    "프로토콜": "통신 규약·약속된 메시지 형식입니다.",
    "라이브러리": "필요할 때 호출하는 재사용 코드·함수 모음입니다.",
    "프레임워크": "앱 골격과 흐름을 제공하고 개발자 코드가 그 안에서 동작합니다.",
    "운영체제": "하드웨어 위에서 프로그램을 실행·관리하는 시스템 소프트웨어입니다.",
    "프로세스": "실행 중인 프로그램 단위입니다.",
    "스레드": "프로세스 안에서 실행되는 더 작은 실행 단위입니다.",
    "셸": "사용자 명령을 해석해 OS에 전달하는 인터페이스입니다.",
    "커널": "OS 핵심으로 하드웨어·프로세스를 직접 관리합니다.",
    "비트": "0과 1의 최소 정보 단위입니다.",
    "바이트": "보통 8비트로 구성된 데이터 단위입니다.",
    "니블": "4비트(반 바이트)로 묶는 정보 단위이며, 최소 단위인 비트보다 큽니다.",
    "워드": "CPU가 한 번에 처리하는 데이터 단위(보통 16·32·64비트)입니다.",
    "select": "조회할 열을 지정하는 SQL 절입니다.",
    "from": "데이터를 가져올 테이블을 지정하는 SQL 절입니다.",
    "where": "행 단위 조건으로 결과를 걸러내는 SQL 절입니다.",
    "having": "GROUP BY 이후 그룹 집계 결과에 조건을 거는 SQL 절입니다.",
    "group by": "같은 값끼리 묶어 집계하는 SQL 절입니다.",
    "order by": "결과를 정렬하는 SQL 절입니다.",
    "limit": "상위 N건만 가져오는 SQL 절입니다.",
    "join": "두 테이블을 키로 연결하는 SQL 절입니다.",
    "inner join": "양쪽 테이블에 모두 매칭되는 행만 반환합니다.",
    "left join": "왼쪽 테이블 행을 모두 유지하고 오른쪽은 없으면 NULL입니다.",
    "right join": "오른쪽 테이블 행을 모두 유지합니다.",
    "cross join": "두 테이블의 카티션 곱(모든 조합)을 만듭니다.",
    "natural join": "같은 이름의 열을 자동으로 매칭해 조인합니다.",
    "union": "두 SELECT 결과를 합치고 중복 행을 제거합니다.",
    "union all": "두 SELECT 결과를 합치고 중복을 유지합니다.",
    "intersect": "두 SELECT 결과의 교집합을 반환합니다.",
    "except": "첫 SELECT에만 있고 두 번째에는 없는 행을 반환합니다.",
    "distinct": "중복 행을 제거합니다.",
    "count": "행 개수를 세는 집계 함수입니다.",
    "sum": "숫자 열의 합계를 구하는 집계 함수입니다.",
    "avg": "숫자 열의 평균을 구하는 집계 함수입니다.",
    "max": "최댓값을 구하는 집계 함수입니다.",
    "min": "최솟값을 구하는 집계 함수입니다.",
    "insert": "테이블에 새 행을 추가하는 SQL 문입니다.",
    "update": "기존 행의 값을 수정하는 SQL 문입니다.",
    "delete": "조건에 맞는 행을 삭제하는 SQL 문입니다.",
    "exists": "서브쿼리 결과 존재 여부를 검사합니다.",
    "in": "값이 목록 안에 있는지 검사합니다.",
    "any": "서브쿼리 값 중 하나와 비교합니다.",
    "all": "서브쿼리 모든 값과 비교합니다.",
    "like": "문자열 패턴(%·_)으로 검색합니다.",
    "between": "값이 구간 안에 있는지 검사합니다.",
    "over": "윈도우 함수에서 파티션·정렬 창을 정의합니다.",
    "partition by": "윈도우를 그룹별로 나눕니다.",
    "rank": "동점 시 순위를 건너뛰는 순위 함수입니다.",
    "dense_rank": "동점 시에도 연속 순위를 매기는 함수입니다.",
    "row_number": "그룹 내 고유 순번을 부여합니다.",
    "ntile": "결과를 N개 구간(버킷)으로 나눕니다.",
    "lag": "이전 행 값을 가져오는 윈도우 함수입니다.",
    "lead": "다음 행 값을 가져오는 윈도우 함수입니다.",
    "on": "JOIN 시 두 테이블 열을 연결하는 조건 절입니다.",
    "using": "JOIN 시 동일 이름 열로 연결합니다.",
    "merge": "DBMS별 병합 문법이며, 표준 조인은 JOIN입니다.",
    "subquery": "쿼리 안에 중첩된 SELECT입니다.",
    "cte": "WITH 절로 이름 붙인 임시 결과 집합입니다.",
    "primary key": "행을 유일하게 식별하는 키입니다.",
    "foreign key": "다른 테이블 기본 키를 참조하는 키입니다.",
    "index": "조회 속도를 높이기 위한 자료 구조입니다.",
    "view": "저장된 SELECT 결과를 가상 테이블처럼 씁니다.",
    "trigger": "INSERT/UPDATE/DELETE 시 자동 실행되는 로직입니다.",
    "transaction": "모두 성공하거나 모두 취소되는 작업 단위입니다.",
    "commit": "트랜잭션 변경을 확정합니다.",
    "rollback": "트랜잭션 변경을 되돌립니다.",
    "list": "순서 있는 가변(mutable) 시퀀스 자료형입니다.",
    "tuple": "순서 있고 불변(immutable) 시퀀스입니다.",
    "dict": "키-값 쌍을 저장하는 매핑 자료형입니다.",
    "date": "단독 표준 모듈명이 아니라 datetime 모듈의 클래스입니다.",
    "datetime": "날짜·시간을 다루는 파이썬 표준 모듈입니다.",
    "time만": "time 모듈만으로는 날짜·시간 전체 처리에 한계가 있습니다.",
    "set": "중복 없는 집합 자료형입니다.",
    "frozenset": "불변 집합 자료형입니다.",
    "def": "함수를 정의하는 키워드입니다.",
    "class": "객체를 정의하는 키워드입니다.",
    "lambda": "한 줄 익명 함수를 만드는 키워드입니다.",
    "return": "함수 결과를 호출부로 돌려줍니다.",
    "yield": "제너레이터가 값을 하나씩 반환합니다.",
    "break": "가장 안쪽 반복문을 즉시 종료합니다.",
    "continue": "현재 반복 회차만 건너뜁니다.",
    "elif": "이전 if가 거짓일 때 검사하는 분기입니다.",
    "else": "조건이 모두 거짓일 때 실행되는 분기입니다.",
    "try": "예외가 날 수 있는 코드 블록을 감쌉니다.",
    "except": "발생한 예외를 처리합니다.",
    "finally": "예외 여부와 관계없이 실행되는 블록입니다.",
    "import": "다른 파일·모듈의 함수와 변수를 현재 코드로 가져오는 키워드입니다.",
    "import 불필요": "sqrt 등 외부 함수는 math 모듈 import 등이 필요합니다.",
    "sqrt(16) → 4.0": "`from math import sqrt` 후 `sqrt(16)`은 4.0을 반환합니다.",
    "두 테이블을 연결하는 조건 지정": "INNER JOIN에서 ON 절은 두 테이블을 연결할 열·조건을 지정합니다.",
    "ln -s": "`ln -s 원본 링크이름` 형식으로 심볼릭(소프트) 링크를 만드는 명령입니다.",
    "변수": "메모리에 값을 저장해 두었다가 이름으로 참조하는 그릇입니다.",
    "math.sqrt만 가능": "`from math import sqrt` 후에는 `sqrt(16)`처럼 접두사 없이 호출할 수 있습니다.",
    "16**0.5 불가": "파이썬에서 `**` 거듭제곱으로 `16**0.5`도 제곱근을 구할 수 있습니다.",
    "range": "정수 시퀀스를 만드는 내장 함수입니다.",
    "enumerate": "인덱스와 값을 함께 순회합니다.",
    "append": "리스트 끝에 원소를 추가합니다.",
    "extend": "리스트 끝에 여러 원소를 펼쳐 넣습니다.",
    "pandas": "표 형태 데이터 분석 라이브러리입니다.",
    "numpy": "수치 배열 연산 라이브러리입니다.",
    "dataframe": "Pandas 2차원 라벨 표 자료구조입니다.",
    "series": "Pandas 1차원 라벨 배열입니다.",
    "ndarray": "NumPy 다차원 배열입니다.",
    "matplotlib": "파이썬 시각화 라이브러리입니다.",
    "seaborn": "통계 그래프를 쉽게 그리는 시각화 라이브러리입니다.",
    "streamlit": "데이터 앱을 빠르게 만드는 Python 웹 프레임워크입니다.",
    "sklearn": "머신러닝 알고리즘·전처리 라이브러리(scikit-learn)입니다.",
    "llm": "대규모 언어 모델(Large Language Model)입니다.",
    "token": "텍스트를 나눈 최소 처리 단위입니다.",
    "embedding": "텍스트·데이터를 벡터로 표현한 것입니다.",
    "rag": "검색과 생성을 결합한 AI 응답 기법입니다.",
    "hallucination": "모델이 사실과 다른 내용을 만들어 내는 현상입니다.",
    "fine-tuning": "사전 학습 모델을 특정 데이터로 추가 학습하는 것입니다.",
    "prompt": "모델에 입력하는 지시·질문 텍스트입니다.",
    "transformer": "어텐션 기반 신경망 아키텍처입니다.",
    "200": "HTTP 요청이 성공했음을 뜻합니다.",
    "301": "리소스가 새 URL로 영구 이동했음을 뜻합니다.",
    "302": "일시적 리다이렉션 상태 코드입니다.",
    "404": "요청한 리소스를 찾을 수 없음을 뜻합니다.",
    "403": "접근이 금지되었음을 뜻합니다.",
    "500": "서버 내부 오류를 뜻합니다.",
    "80": "HTTP 기본 포트 번호입니다.",
    "443": "HTTPS 기본 포트 번호입니다.",
    "22": "SSH 기본 포트 번호입니다.",
    "3306": "MySQL 기본 포트 번호입니다.",
    "ps": "실행 중 프로세스 목록을 보여주는 명령입니다.",
    "top": "프로세스를 실시간 모니터링하는 명령입니다.",
    "kill": "프로세스에 종료 신호를 보냅니다.",
    "pwd": "현재 작업 디렉터리 경로를 출력합니다.",
    "cd": "작업 디렉터리를 변경합니다.",
    "ls": "디렉터리 목록을 출력합니다.",
    "chmod": "파일·디렉터리 권한을 변경합니다.",
    "chown": "파일 소유자를 변경합니다.",
    "cron": "정해진 시간에 명령을 실행하는 스케줄러입니다.",
    "bash": "리눅스에서 널리 쓰는 셸입니다.",
    "remove": "apt에서 패키지를 제거하는 하위 명령입니다.",
    "purge": "설정 파일까지 삭제하며 패키지를 제거합니다.",
    "install": "패키지를 설치하는 apt 하위 명령입니다.",
    "인트라넷": "조직 내부에서만 쓰는 사설 네트워크입니다.",
    "인터넷": "전 세계를 연결하는 공용 네트워크입니다.",
    "응용 계층": "HTTP·FTP 등 사용자 서비스가 동작하는 OSI 7계층입니다.",
    "전송 계층": "TCP·UDP가 동작하는 OSI 4계층입니다.",
    "네트워크 계층": "IP 라우팅이 이루어지는 OSI 3계층입니다.",
    "데이터 링크 계층": "프레임 단위로 인접 노드 간 전송하는 OSI 2계층입니다.",
    "물리 계층": "비트를 전기·광 신호로 보내는 OSI 1계층입니다.",
}


def norm_key(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).strip().lower())


def is_choice(item: dict) -> bool:
    return bool(item.get("options"))


def correct_option(item: dict) -> dict | None:
    for opt in item.get("options") or []:
        if opt.get("isCorrect"):
            return opt
    return None


def wrong_options(item: dict) -> list[dict]:
    return [o for o in (item.get("options") or []) if not o.get("isCorrect")]


def is_echo_rationale(option_text: str, rationale: str) -> bool:
    """보기 문장을 그대로 반복하거나 거의 그대로 쓴 해설."""
    ot = norm_key(option_text).rstrip(".")
    rt = norm_key(rationale).rstrip(".")
    if not ot or not rt:
        return False
    if rt == ot:
        return True
    if rt.startswith(ot) and len(rationale.strip()) <= len(option_text.strip()) + 6:
        return True
    if "에 대한 설명으로 사실과 맞습니다" in rationale:
        return True
    if "이 문항이 묻는 핵심과 다른" in rationale:
        return True
    if "표준 SQL 키워드가 아닙니다" in rationale and "sql" not in ot:
        return True
    return False


def is_weak_rationale(text: str, option_text: str = "") -> bool:
    t = (text or "").strip()
    if not t or t in WEAK_RATIONALES:
        return True
    if len(t) < 6:
        return True
    if t.startswith("이 보기는") and "정답" in t:
        return True
    if "다른 영역을 가리킵니다" in t or "거리가 있는 보기" in t:
        return True
    if t.startswith("이 설명은 사실과 맞습니다."):
        return True
    if option_text and is_echo_rationale(option_text, t):
        return True
    return False


def needs_rationale_refresh(text: str, option_text: str, *, min_len: int) -> bool:
    t = (text or "").strip()
    if is_weak_rationale(t, option_text):
        return True
    return len(t) < min_len


# 보기 문장 → 사실 설명 (틀린 것 고르기 문항의 맞는 보기)
PHRASE_EXPANSIONS: dict[str, str] = {
    "마이크로파는 혼선 가능": "마이크로파는 무선 전파 매체로 간섭(혼선)이 발생할 수 있습니다.",
    "유선·무선 매체가 있다": "네트워크 전송 매체에는 유선·무선이 모두 존재합니다.",
    "이더넷은 유선": "이더넷은 대표적인 유선 LAN 매체입니다.",
    "개인용 PC에 최적화": "우분투는 데스크톱·개인 PC 사용에 친화적입니다.",
    "정기 업데이트": "우분투는 정기 보안·기능 업데이트를 제공합니다.",
    "오픈 소스 프로젝트": "우분투는 오픈 소스 커뮤니티 기반 배포판입니다.",
    "커뮤니티 지원": "활발한 커뮤니티와 문서로 초보자도 도움을 받기 쉽습니다.",
    "*= 는 곱하기 대입": "`*=`는 곱한 값을 변수에 다시 대입하는 연산자입니다.",
    "+= 는 더하기 대입": "`+=`는 더한 값을 변수에 다시 대입하는 연산자입니다.",
    "/ 는 나눗셈": "파이썬에서 `/`는 실수 나눗셈(quotient)입니다.",
    "// 는 몫": "파이썬에서 `//`는 몫(정수 나눗셈) 연산입니다.",
    "센서 측정 로그": "현장에서 직접 수집한 1차(raw) 데이터입니다.",
    "거래 원장": "거래가 발생할 때마다 기록되는 1차 원천 데이터입니다.",
    "전송 계층은 Segment": "TCP/UDP가 동작하는 계층이며 PDU는 Segment입니다.",
    "인터넷 계층은 Packet": "IP가 동작하는 계층이며 PDU는 Packet입니다.",
    "응용 계층은 Message": "HTTP 등이 동작하는 계층이며 PDU는 Message입니다.",
    "이름-값 쌍이다": "HTTP 헤더는 `이름: 값` 형태의 이름-값 쌍으로 구성됩니다.",
    "response header가 있다": "HTTP 응답에도 Response Header가 포함됩니다.",
    "부가 정보를 담는다": "쿠키·인증·콘텐츠 타입 등 요청·응답의 부가 메타정보를 담습니다.",
    "/ 는 나누기": "파이썬에서 `/`는 나눗셈(실수 나눗셈) 연산자입니다.",
    "스키마가 정해져 있다": "정형 데이터는 표·DB처럼 열 구조(스키마)가 미리 정의됩니다.",
    "행과 열로 표현된다": "스프레드시트·관계형 DB처럼 2차원 표 형태로 담깁니다.",
    "sql로 조회하기 쉽다": "열 이름·타입이 정해져 있어 SQL 등으로 조회·집계하기 수월합니다.",
    "전처리 후 분석한다": "수집한 데이터는 정제·가공(전처리)한 뒤 분석 단계로 넘어갑니다.",
    "문제 정의 후 데이터를 수집한다": "분석 목적·질문을 먼저 정한 후 필요한 데이터를 모읍니다.",
    "이상치를 확인해야 한다": "비정상적으로 튀는 값(이상치)을 찾아 원인·처리 방법을 검토합니다.",
    "편향을 줄여야 한다": "표본·수집 방식의 편향을 줄여야 분석 결과를 신뢰할 수 있습니다.",
    "수집 방법을 기록해야 한다": "어디서·어떻게 모았는지 기록해야 재현성과 신뢰도를 확보합니다.",
}

# 틀린 것 고르기 문항 — 정답(거짓 설명) 보기 전용 확장
FIND_WRONG_CORRECT_EXPANSIONS: dict[str, str] = {
    "빼기 연산자는 ** 이다": "빼기 연산자는 `-`이며, `**`는 거듭제곱 연산자입니다.",
    "임의의 커스텀 헤더를 추가할 수 없다": "HTTP에서는 `X-` 접두사 등 커스텀 헤더 추가가 가능합니다.",
    "광섬유는 무선 매체이다": "광섬유는 빛 신호를 보내는 유선(광) 전송 매체입니다.",
}


def affirm_fact(text: str) -> str:
    t = (text or "").strip().rstrip(".")
    if t in PHRASE_EXPANSIONS:
        return PHRASE_EXPANSIONS[t]
    key = norm_key(t)
    if key in PHRASE_EXPANSIONS:
        return PHRASE_EXPANSIONS[key]
    if t in TERM_GLOSSARY:
        return TERM_GLOSSARY[t]
    if key in TERM_GLOSSARY:
        return TERM_GLOSSARY[key]
    return f"{t}에 대한 설명으로 사실과 맞습니다."


def clean_explanation_text(text: str) -> str:
    t = (text or "").strip()
    if not t:
        return ""
    t = re.sub(r"\s*정답\s*「[^」]+」.*$", "", t, flags=re.DOTALL)
    t = re.sub(r"\s*오답\s*정리:.*$", "", t, flags=re.DOTALL)
    t = re.sub(r"\s*정답\s*보기\s*「[^」]+」.*$", "", t, flags=re.DOTALL)
    return t.strip()


def section_topic(section: str) -> str:
    return re.sub(r"^\d{2}/\d{2}\s*", "", (section or "").strip())


def lecture_keyword(item: dict, correct: dict | None) -> str:
    q = item.get("question", "")
    is_find_wrong = bool(FIND_WRONG_RE.search(q))

    if is_find_wrong:
        m = re.search(r"`([^`]{2,30})`", q)
        if m:
            return m.group(1).strip()
        m = re.search(r"([A-Z]{2,10})\b", q)
        if m:
            return m.group(1)
        m = re.search(r"(.+?)(?:설명|에 대한)", q)
        if m:
            topic = re.sub(r"^Q\.\s*", "", m.group(1)).strip()
            if 4 <= len(topic) <= 22:
                return topic
        topic = section_topic(item.get("section", ""))
        return topic.split("·")[0].split("&")[0].strip()[:18] if topic else ""

    if correct:
        ct = (correct.get("text") or "").strip()
        if ct and len(ct) <= 20 and not re.search(r"[{}\[\];*→]", ct):
            return ct
    m = re.search(r"\(([A-Za-z][A-Za-z\s]{1,40})\)", q)
    if m:
        return m.group(1).strip().split()[0]
    m = re.search(r"([A-Z]{2,10})\b", q)
    if m:
        return m.group(1)
    answers = item.get("answers") or []
    if answers and len(str(answers[0])) <= 20:
        return str(answers[0]).strip()
    return ""


def build_lecture_context(item: dict, correct: dict | None) -> str:
    day = (item.get("day") or (item.get("section") or "")[:5])[:5]
    num = DAY_LECTURE_NUM.get(day, "")
    topic = section_topic(item.get("section", ""))
    kw = lecture_keyword(item, correct)
    if num and topic and kw:
        short_topic = topic.split("·")[0].split("&")[0].strip()
        return f"강의 {num} {short_topic}: {kw} 단원에서 다룹니다."
    return ""


def is_bad_lecture_context(exp: str, item: dict) -> bool:
    if not (exp or "").strip().startswith("강의 "):
        return False
    correct = correct_option(item)
    if not correct:
        return False
    kw = (correct.get("text") or "").strip()
    if not kw or kw not in exp:
        return False
    if FIND_WRONG_RE.search(item.get("question", "")):
        return True
    return len(kw) > 18


def build_context_explanation(item: dict) -> str:
    correct = correct_option(item)
    cleaned = clean_explanation_text(item.get("explanation", ""))
    if cleaned and is_bad_lecture_context(cleaned, item):
        cleaned = ""

    if cleaned and len(cleaned) >= 12 and "정답" not in cleaned and "오답" not in cleaned:
        summ = (item.get("summary") or "").strip()
        if summ and cleaned == summ:
            lecture = build_lecture_context(item, correct)
            if lecture:
                return lecture
        if not cleaned.startswith("강의 "):
            lecture = build_lecture_context(item, correct)
            if lecture and lecture not in cleaned:
                return lecture
        return cleaned

    lecture = build_lecture_context(item, correct)
    if lecture:
        return lecture

    summ = (item.get("summary") or "").strip()
    if summ:
        first = re.split(r"(?<=[.!?])\s+", summ)[0].strip()
        if first and len(first) >= 8:
            return first if first.endswith((".", "!", "?")) else first + "."

    return cleaned or summ or ""


def mine_glossary(items: list[dict]) -> dict[str, str]:
    glossary: dict[str, str] = dict(TERM_GLOSSARY)
    for item in items:
        for opt in item.get("options") or []:
            text = (opt.get("text") or "").strip()
            rat = (opt.get("rationale") or "").strip()
            if not text or is_weak_rationale(rat, text):
                continue
            key = norm_key(text)
            if key not in glossary or len(rat) > len(glossary[key]):
                glossary[key] = rat
    return glossary


def lookup_glossary(text: str, glossary: dict[str, str]) -> str | None:
    key = norm_key(text)
    if key in glossary:
        return glossary[key]
    for gkey, val in glossary.items():
        if gkey == key or (len(gkey) >= 4 and gkey in key):
            return val
    upper = text.strip().upper()
    if upper in glossary:
        return glossary[upper.lower()]
    return None


def infer_from_contrast(text: str, correct_text: str, summary: str) -> str | None:
    tl = norm_key(text)
    cl = norm_key(correct_text)
    if tl == cl:
        return None
    pairs = [
        (("library", "라이브러리"), "필요할 때 호출하는 도구 모음입니다."),
        (("framework", "프레임워크"), "앱 흐름을 정해 주는 골격입니다."),
        (("protocol", "프로토콜"), "통신 규약입니다."),
        (("thread", "스레드"), "프로세스 내 실행 단위입니다."),
        (("process", "프로세스"), "실행 중인 프로그램입니다."),
    ]
    for keys, desc in pairs:
        if any(k in tl for k in keys) and not any(k in cl for k in keys):
            return desc
    if summary and text in summary:
        return summary.split(".")[0] + "."
    return None


def generate_correct_rationale(item: dict, opt: dict, glossary: dict[str, str]) -> str:
    text = (opt.get("text") or "").strip()
    existing = (opt.get("rationale") or "").strip()
    if existing and not needs_rationale_refresh(existing, text, min_len=18):
        return existing

    summ = (item.get("summary") or "").strip()
    is_find_wrong = bool(FIND_WRONG_RE.search(item.get("question", "")))
    key = norm_key(text)

    if is_find_wrong:
        if key in FIND_WRONG_CORRECT_EXPANSIONS:
            return FIND_WRONG_CORRECT_EXPANSIONS[key]
        if text in FIND_WRONG_CORRECT_EXPANSIONS:
            return FIND_WRONG_CORRECT_EXPANSIONS[text]
        if summ and len(summ) >= 18:
            return summ
        looked = lookup_glossary(text, glossary)
        if looked and len(looked) >= 18:
            return looked
        return summ or f"이 설명은 사실과 맞지 않습니다."

    looked = lookup_glossary(text, glossary)
    if looked and len(looked) >= 18:
        return looked
    if summ and len(summ) >= 18:
        return summ
    if looked:
        return looked
    return f"{text}이(가) 이 문항의 정답입니다."


def generate_wrong_rationale(
    item: dict,
    opt: dict,
    correct: dict | None,
    glossary: dict[str, str],
) -> str:
    text = (opt.get("text") or "").strip()
    existing = (opt.get("rationale") or "").strip()
    if existing and not needs_rationale_refresh(existing, text, min_len=16):
        return existing

    correct_text = (correct or {}).get("text", "")
    is_find_wrong = bool(FIND_WRONG_RE.search(item.get("question", "")))
    summ = (item.get("summary") or "").strip()

    looked = lookup_glossary(text, glossary)
    contrast = infer_from_contrast(text, correct_text, summ)

    if is_find_wrong:
        if looked:
            return looked
        if contrast:
            return contrast
        expanded = affirm_fact(text)
        if expanded and not expanded.startswith("이 설명은"):
            return expanded
        return "이 설명은 사실과 맞습니다. (문항은 옳지 않은 것을 고릅니다.)"

    if looked:
        return looked
    if contrast:
        return contrast

    if correct_text and norm_key(text) != norm_key(correct_text):
        ck = lookup_glossary(correct_text, glossary)
        if ck and norm_key(text) in ck.lower():
            return "정답 개념과 혼동하기 쉬운 보기입니다."

    return f"{text}은(는) 이 문항이 묻는 핵심과 다른 개념입니다."


def load_all_items() -> tuple[list[Path], list[dict], dict[str, dict]]:
    paths: list[Path] = []
    items: list[dict] = []
    by_id: dict[str, dict] = {}
    for fp in sorted(DATA.glob("*.json")):
        if fp.name.startswith("_"):
            continue
        paths.append(fp)
        data = json.loads(fp.read_text(encoding="utf-8"))
        for item in data.get("items", []):
            if not is_choice(item):
                continue
            items.append(item)
            iid = item.get("id")
            if iid:
                prev = by_id.get(iid)
                if not prev or sum(
                    1 for o in (item.get("options") or [])
                    if not is_weak_rationale((o.get("rationale") or ""), o.get("text", ""))
                ) > sum(
                    1 for o in (prev.get("options") or [])
                    if not is_weak_rationale((o.get("rationale") or ""), o.get("text", ""))
                ):
                    by_id[iid] = item
            pool = item.get("poolSourceId")
            if pool:
                prev = by_id.get(pool)
                if not prev or sum(
                    1 for o in (item.get("options") or [])
                    if not is_weak_rationale((o.get("rationale") or ""), o.get("text", ""))
                ) > sum(
                    1 for o in (prev.get("options") or [])
                    if not is_weak_rationale((o.get("rationale") or ""), o.get("text", ""))
                ):
                    by_id[pool] = item
    return paths, items, by_id


def propagate_from_source(item: dict, by_id: dict[str, dict]) -> None:
    src_id = item.get("poolSourceId") or item.get("id")
    src = by_id.get(src_id)
    if not src or src is item:
        return
    src_map = {norm_key(o.get("text", "")): o for o in src.get("options") or []}
    for opt in item.get("options") or []:
        key = norm_key(opt.get("text", ""))
        src_opt = src_map.get(key)
        if not src_opt:
            continue
        rat = (src_opt.get("rationale") or "").strip()
        if rat and not is_weak_rationale(rat, (src_opt.get("text") or "")) and is_weak_rationale(
            opt.get("rationale", ""), opt.get("text", "")
        ):
            opt["rationale"] = rat


def process_item(item: dict, glossary: dict[str, str], by_id: dict[str, dict]) -> dict[str, int]:
    stats = {"explanation": 0, "correct_rat": 0, "wrong_rat": 0}
    if not is_choice(item):
        return stats

    propagate_from_source(item, by_id)

    new_exp = build_context_explanation(item)
    old_exp = clean_explanation_text(item.get("explanation", ""))
    if new_exp and new_exp != (item.get("explanation") or "").strip():
        item["explanation"] = new_exp
        stats["explanation"] += 1
    elif old_exp != (item.get("explanation") or "").strip() and old_exp:
        item["explanation"] = old_exp
        stats["explanation"] += 1

    correct = correct_option(item)
    if correct:
        new_rat = generate_correct_rationale(item, correct, glossary)
        if new_rat != (correct.get("rationale") or "").strip():
            correct["rationale"] = new_rat
            stats["correct_rat"] += 1

    for opt in wrong_options(item):
        new_rat = generate_wrong_rationale(item, opt, correct, glossary)
        if new_rat != (opt.get("rationale") or "").strip():
            opt["rationale"] = new_rat
            stats["wrong_rat"] += 1

    return stats


def main() -> int:
    paths, all_items, by_id = load_all_items()
    glossary = mine_glossary(all_items)

    totals = {"explanation": 0, "correct_rat": 0, "wrong_rat": 0, "files": 0}
    for fp in paths:
        data = json.loads(fp.read_text(encoding="utf-8"))
        file_stats = {"explanation": 0, "correct_rat": 0, "wrong_rat": 0}
        for item in data.get("items", []):
            s = process_item(item, glossary, by_id)
            for k in file_stats:
                file_stats[k] += s[k]
        if any(file_stats.values()):
            fp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            totals["files"] += 1
            print(
                f"{fp.name}: explanation +{file_stats['explanation']}, "
                f"correct +{file_stats['correct_rat']}, wrong +{file_stats['wrong_rat']}"
            )
        for k in totals:
            if k != "files":
                totals[k] += file_stats[k]

    print(
        f"\n합계: {totals['files']}개 파일 | "
        f"해설 {totals['explanation']} | 정답 rationale {totals['correct_rat']} | "
        f"오답 rationale {totals['wrong_rat']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
