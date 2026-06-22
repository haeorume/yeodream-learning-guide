# -*- coding: utf-8 -*-
"""엘리스 스크린샷 기반 신규 문항 정의 (선택형·SQL·Python)"""
import random

SECTIONS = {
    "01": "05/26 IT 리터러시",
    "02": "05/27 핵심 운영체제·리눅스",
    "03": "05/28 네트워크 개론",
    "04": "05/29 파이썬 기본 문법 1",
    "05": "06/02 파이썬 중급 문법",
    "06": "06/02 파이썬 중급 문법",
    "07": "06/04 파이썬 라이브러리 활용",
    "08": "06/05 생성형 AI 기초",
    "09": "06/08 SQL 개요 & DML",
    "10": "06/09 SQL 함수 & 서브쿼리",
    "11": "06/10 집합연산자 & 계층형 질의",
    "12": "06/11 JOIN 심화 & 서브쿼리 심화",
    "13": "06/12 그룹 함수 & 윈도우 함수",
}

DAY = {v: v[:5] for v in SECTIONS.values()}


def choice(item_id, section, question, correct, wrongs, **extra):
    opts = [{"text": correct, "isCorrect": True, "rationale": extra.get("summary", "정답입니다.")[:120]}]
    for w in wrongs[:3]:
        opts.append({"text": w, "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."})
    rng = random.Random(hash(item_id) & 0xFFFFFFFF)
    rng.shuffle(opts)
    item = {
        "id": item_id,
        "section": section,
        "day": DAY[section],
        "itemType": "choice",
        "question": question,
        "answers": [correct],
        "choicePrompt": extra.get("choicePrompt", "보기 중 올바른 답을 고르세요."),
        "options": opts,
    }
    for k in ("hint", "summary", "explanation", "code"):
        if k in extra:
            item[k] = extra[k]
    return item


def sql_item(item_id, section, question, sandbox, starter_sql, reference_sql, practice_guide, validate, **extra):
    item = {
        "id": item_id,
        "section": section,
        "day": DAY[section],
        "itemType": "sql",
        "question": question,
        "sandbox": sandbox,
        "starterSql": starter_sql,
        "referenceSql": reference_sql,
        "practiceGuide": practice_guide,
        "validate": validate,
        "instructions": practice_guide.get("goal", ""),
    }
    for k in ("hint", "summary", "explanation"):
        if k in extra:
            item[k] = extra[k]
    return item


def py_item(item_id, section, question, starter_code, reference_code, practice_guide, validate, **extra):
    item = {
        "id": item_id,
        "section": section,
        "day": DAY[section],
        "itemType": "python",
        "question": question,
        "starterCode": starter_code,
        "referenceCode": reference_code,
        "practiceGuide": practice_guide,
        "validate": validate,
        "instructions": practice_guide.get("goal", ""),
    }
    for k in ("hint", "summary", "explanation"):
        if k in extra:
            item[k] = extra[k]
    return item


# fmt: off
CHOICE_BATCH = [
    # 01 IT 리터러시
    choice("el-0526-01", SECTIONS["01"], "0과 1로 이루어진 복잡한 OOO를 사람이 쓰기 쉽게 만드는 것이 엔지니어 역할 중 하나입니다. 빈칸에 들어갈 말은?", "기계어", ["프로토콜", "프레임워크", "SEO"], summary="기계어를 고수준 언어로 추상화합니다."),
    choice("el-0526-02", SECTIONS["01"], "다음 중 운영체제의 설명으로 옳지 않은 것은?", "이름은 다르지만 같은 코드로 소프트웨어를 제작하는 데 어려움이 없다", ["다양한 운영체제가 존재한다", "시스템 소프트웨어로 기기를 쉽게 사용하게 한다", "접근 권한을 설정할 수 있다"], summary="OS마다 API·환경이 달라 이식성 문제가 있습니다."),
    choice("el-0526-03", SECTIONS["01"], "일반적인 웹 애플리케이션 동작 순서로 올바른 것은?", "클라이언트 → 웹서버 → 백엔드 → DB", ["클라이언트 → DB → 백엔드 → 웹서버", "웹서버 → 클라이언트 → 백엔드 → DB", "백엔드 → 클라이언트 → 웹서버 → DB"], summary="요청은 웹서버를 거쳐 백엔드·DB로 전달됩니다."),
    choice("el-0526-04", SECTIONS["01"], "비동기 기능에 가장 적절한 예시는?", "화면 이동 없이 댓글 작성", ["강의 목록에서 상세 페이지 이동", "일반 웹페이지 링크 이동", "저장된 명함 불러오기"], summary="페이지 전환 없이 백그라운드 요청이 비동기입니다."),
    choice("el-0526-05", SECTIONS["01"], "기록·조합 가능한 모든 데이터의 총합을 무엇이라 하는가?", "데이터베이스", ["비즈니스 로직", "프론트엔드", "쿼리문"], summary="DB는 구조화된 데이터 집합입니다."),
    choice("el-0526-06", SECTIONS["01"], "다음 중 서버 오류라고 보기 어려운 것은?", "화면 비율에 의한 레이아웃 깨짐", ["트래픽 과부하", "DB 접속 오류", "백엔드 코드 버그"], summary="레이아웃 깨짐은 주로 클라이언트·CSS 이슈입니다."),
    choice("el-0526-07", SECTIONS["01"], "API 설명으로 틀린 것은?", "코드 모음을 저장하여 호출하는 것", ["프로그램 간 대화를 돕는다", "네트워크로 기능을 호출한다", "OPEN API가 제공되기도 한다"], summary="API는 인터페이스이지 단순 코드 저장소가 아닙니다."),
    choice("el-0526-08", SECTIONS["01"], "WWW 개념을 창시하고 무료 공개한 사람은?", "팀 버너스리", ["스티브 잡스", "빌 게이츠", "래리 페이지"], summary="팀 버너스리가 월드와이드웹을 제안했습니다."),
    choice("el-0526-09", SECTIONS["01"], "프레임워크 설명 중 가장 적절한 것은?", "프로그램을 효율적으로 만들기 위한 Frame을 가진 형태", ["통신으로 미리 작성된 코드만 활용", "언어와 무관한 단일 규격", "TDD 방법론"], summary="프레임워크는 앱 골격과 제어 흐름을 제공합니다."),
    choice("el-0526-10", SECTIONS["01"], "구글 창업 이야기와 관련 없는 것은?", "웹사이트를 다운받지 않고 분석했다", ["1996년 연구 시작", "서버 증설하며 서비스 유지", "검색 알고리즘 개선"], summary="초기 구글은 페이지를 수집·색인했습니다."),
    choice("el-0526-11", SECTIONS["01"], "크롤링 설명으로 올바른 것은?", "모든 사이트를 무제한 크롤링할 수는 없다", ["필요한 정보만 가져온다", "파싱 없이 정보를 추출한다", "법적 이슈가 전혀 없다"], summary="robots.txt·저작권 등 제약이 있습니다."),
    choice("el-0526-12", SECTIONS["01"], "기획 단계에서 서비스 핵심 흐름을 데이터와 함께 보여주는 차트는?", "플로우차트", ["시퀀스 다이어그램", "ERD", "Gantt"], summary="플로우차트는 업무·서비스 흐름을 표현합니다."),
    # 02 리눅스
    choice("el-0527-01", SECTIONS["02"], "컴퓨터 하드웨어 설명으로 옳지 않은 것은?", "주기억장치는 전원이 꺼져도 데이터가 삭제되지 않는다", ["CPU는 중앙처리장치다", "CPU가 주기억의 데이터를 처리한다", "마우스·키보드는 입출력장치다"], summary="주기억(RAM)은 휘발성입니다."),
    choice("el-0527-02", SECTIONS["02"], "운영체제 설명으로 가장 옳은 것은?", "리눅스는 소스를 다운받아 수정·배포할 수 있다", ["윈도·리눅스 모두 반드시 유료다", "맥 OS가 서버에서 가장 많이 쓰인다", "리눅스는 GUI만 지원한다"], summary="리눅스는 오픈소스 OS입니다."),
    choice("el-0527-03", SECTIONS["02"], "메모리 할당 설명으로 가장 옳지 않은 것은?", "정적 할당은 실행 도중 메모리를 할당한다", ["정적 할당은 초과 시 코드 수정이 필요하다", "동적 할당은 필요한 만큼 할당한다", "정적 할당이 일반적으로 더 빠르다"], summary="정적 할당은 컴파일·로드 시점에 결정됩니다."),
    choice("el-0527-04", SECTIONS["02"], "프로세스 상태 설명으로 가장 옳은 것은?", "running은 CPU가 할당되어 명령을 처리하는 상태", ["ready는 CPU를 일부 사용 중이다", "new는 실행이 완료된 상태", "blocked는 실행 완료 상태"], summary="running 상태에서 CPU에서 실행됩니다."),
    choice("el-0527-05", SECTIONS["02"], "교착상태 설명 중 가장 옳지 않은 것은?", "은행원 알고리즘이 교착을 막는 유일한 방법이다", ["상호배제 조건이 있다", "순환 대기가 발생할 수 있다", "교착을 무시하는 전략도 있다"], summary="여러 회피·예방·탐지 기법이 있습니다."),
    choice("el-0527-06", SECTIONS["02"], "페이징 설명으로 옳지 않은 것은?", "스와핑은 페이지 테이블로 가상·실제 주소를 매핑한다", ["일정 단위로 메모리를 나눈다", "가상·물리 주소 매핑이 있다", "페이지가 매핑 단위다"], summary="스와핑은 디스크로 페이지를 옮기는 것입니다."),
    choice("el-0527-07", SECTIONS["02"], "FAT 파일 시스템으로 가장 옳은 것은?", "내부 단편화 문제가 있다", ["한 칸 손상 시 이후 전부 접근 불가", "저장장치 크기 제한이 없다", "연속 블록만 기록한다"], summary="FAT는 할당표 기반이며 단편화가 생깁니다."),
    choice("el-0527-08", SECTIONS["02"], "리눅스 구조로 바르게 나열된 것은?", "응용 → shell → kernel → HW", ["응용 → 관리자 → 마이크로커널 → HAL", "kernel → HW → shell → 응용", "HW → 응용 → kernel"], summary="사용자 공간에서 커널·하드웨어로 내려갑니다."),
    choice("el-0527-09", SECTIONS["02"], "우분투 장점 설명으로 옳지 않은 것은?", "다른 배포판보다 어려워 보안성이 높다", ["개인용 PC에 최적화", "정기 업데이트", "커뮤니티 지원"], summary="우분투는 초보자 친화적 배포판입니다."),
    choice("el-0527-10", SECTIONS["02"], "리눅스 명령어 설명 중 옳지 않은 것은?", "passwd는 비밀번호를 화면에 보여준다", ["whoami는 로그인 ID", "pwd는 현재 디렉터리", "ls -al은 숨김 파일 포함"], summary="passwd는 비밀번호를 변경·입력합니다."),
    choice("el-0527-11", SECTIONS["02"], "리눅스 디렉터리 구조로 옳은 것은?", "bin에는 기본 명령어가 있다", ["home은 라이브러리 저장소", "lib는 계정별 홈", "etc는 사용자 홈"], summary="/bin, /home, /lib 역할을 구분합니다."),
    choice("el-0527-12", SECTIONS["02"], "정규표현식 `\\b?hy\\w+`에 매칭되는 문자열은?", "hyyyy", ["hy.2453", "hhi", "245hy"], summary="\\b 단어경계, ? 0~1회, \\w+ 문자열."),
    # 03 네트워크
    choice("el-0528-01", SECTIONS["03"], "네트워크 전송 매체 설명 중 틀린 것은?", "광섬유는 무선 매체이다", ["유선·무선 매체가 있다", "이더넷은 유선", "마이크로파는 혼선 가능"], summary="광섬유는 유선 매체입니다."),
    choice("el-0528-02", SECTIONS["03"], "도시 단위 네트워크(MAN)에 해당하는 예는?", "인천↔부천 도시 간 네트워크", ["블루투스 이어폰", "사무실 LAN", "국가 간 WAN"], summary="MAN은 Metropolitan Area Network입니다."),
    choice("el-0528-03", SECTIONS["03"], "OSI 7계층 설명 중 옳지 않은 것은?", "물리 계층 데이터 단위는 프레임이다", ["표현 계층은 인코딩·압축", "네트워크 계층에 라우터", "HTTP는 응용 계층"], summary="프레임은 데이터링크 계층 PDU입니다."),
    choice("el-0528-04", SECTIONS["03"], "TCP/IP 계층 설명으로 올바르지 않은 것은?", "네트워크 액세스 계층 PDU가 프레임이고 포트번호를 가진다", ["응용 계층은 Message", "전송 계층은 Segment", "인터넷 계층은 Packet"], summary="포트번호는 전송 계층입니다."),
    choice("el-0528-05", SECTIONS["03"], "HTTP 헤더 설명으로 옳지 않은 것은?", "임의의 커스텀 헤더를 추가할 수 없다", ["부가 정보를 담는다", "이름-값 쌍이다", "Response Header가 있다"], summary="X- 접두 커스텀 헤더가 가능합니다."),
    choice("el-0528-06", SECTIONS["03"], "메일함이 가득 차 수신이 어려울 때 적합한 프로토콜은?", "POP3", ["SMTP", "IMAP", "FTP"], summary="POP3는 서버에서 메일을 가져옵니다."),
    choice("el-0528-07", SECTIONS["03"], "원격 접속·암호화가 추가된 인터넷 프로토콜은?", "SSH", ["TELNET", "HTTP", "ARP"], summary="SSH는 암호화된 원격 셸입니다."),
    # 04 파이썬 기본1
    choice("el-0529-02", SECTIONS["04"], "`[1, 2, 3]`처럼 여러 원소를 순서대로 담는 자료형은?", "리스트", ["문자열", "딕셔너리", "튜플"], summary="리스트는 가변 순서 컬렉션입니다."),
    choice("el-0529-03", SECTIONS["04"], "자료를 저장하는 그릇을 무엇이라 하는가?", "변수", ["함수", "모듈", "클래스"], summary="변수는 값을 참조합니다."),
    choice("el-0529-04", SECTIONS["04"], "파이썬 연산자 설명 중 틀린 것은?", "빼기 연산자는 ** 이다", ["+= 는 더하기 대입", "*= 는 곱하기 대입", "/ 는 나누기"], summary="빼기는 - 입니다."),
    choice("el-0529-05", SECTIONS["04"], "문자열에 대해 옳은 설명은?", "+ 연산자로 이어붙일 수 있다", ["문자열은 연산 불가", "- 로 문자 제거", "인덱스 사용 불가"], summary="문자열은 +, 슬라이싱이 가능합니다."),
    choice("el-0529-06", SECTIONS["04"], "`a=[1,2,3,4,5]`에서 1과 2만 출력하려면?", "a[0:2]", ["a[0:1]", "a[1:2]", "a[:1]"], summary="슬라이스 끝 인덱스는 미포함입니다."),
    # 05·06 파이썬 중급
    choice("el-0602-01", SECTIONS["05"], "1 이상 10 미만 범위 반복에 가장 적합한 것은?", "for i in range(1,10)", ["for i in [1,10]", "range(10)", "while True"], summary="range(1,10)은 1~9입니다."),
    choice("el-0602-02", SECTIONS["05"], "리스트 a의 i번째 원소를 제거 후 반환하는 메서드는?", "a.pop(i)", ["a.count(i)", "a.split(i)", "a.remove(i)"], summary="pop은 제거 후 값을 반환합니다."),
    choice("el-0602-03", SECTIONS["05"], "특정 목적의 함수·자료 모임을 무엇이라 하는가?", "모듈", ["패키지", "클래스", "객체"], summary="모듈은 .py 파일 단위입니다."),
    choice("el-0602-04", SECTIONS["06"], "`import random` 후 1 이상 11 미만 난수는?", "random.randrange(1,11)", ["random(1,11)", "randrange(1,11)", "random.random(1,11)"], summary="random.randrange(1,11)."),
    choice("el-0602-05", SECTIONS["06"], "f-string에서 name='Elice', age=5일 때 `f'...{name.upper()}...{age*2}살'` 결과는?", "ELICE와 10살", ["Elice와 5살", "elice와 10살", "ELICE와 5살"], summary="upper()와 age*2가 적용됩니다."),
    # 07 라이브러리
    choice("el-0604-01", SECTIONS["07"], "파이썬 라이브러리 설명으로 옳은 것은?", "모듈은 단일 .py 파일이다", ["패키지는 무관 모듈 묶음", "표준 라이브러리는 별도 설치 필수", "라이브러리는 실행 파일"], summary="모듈·패키지·라이브러리 계층을 구분합니다."),
    choice("el-0604-02", SECTIONS["07"], "라이브러리 비교 시 가장 적절하지 않은 항목은?", "라이브러리 개발자 이름", ["기능성", "커뮤니티 지원", "호환성"], summary="유지보수·문서·라이선스 등이 중요합니다."),
    choice("el-0604-03", SECTIONS["07"], "라이브러리 사용 과정으로 가장 적절한 것은?", "import로 불러와야 한다", ["설치만 하면 자동 실행", "항상 전체 복사", "컴파일 필수"], summary="import 후 사용합니다."),
    # 08 생성형 AI
    choice("el-0605-01", SECTIONS["08"], "Vibe Coding은 OOO로 의도를 전달하고 AI가 코드 생성을 주도한다", "자연어", ["바이너리", "YAML", "JSON"], summary="자연어 프롬프트 기반 개발입니다."),
    choice("el-0605-02", SECTIONS["08"], "예시 없이 질문만으로 답변 생성하는 방식은?", "Zero-shot Learning", ["One-shot", "Few-shot", "Supervised"], summary="Zero-shot은 예시 없이 추론합니다."),
    choice("el-0605-03", SECTIONS["08"], "Streamlit은 무엇을 위해 개발된 라이브러리인가?", "웹 애플리케이션 개발", ["DB 관리만", "모바일 앱", "게임 엔진"], summary="파이썬으로 빠르게 웹 UI를 만듭니다."),
    choice("el-0605-04", SECTIONS["08"], "제목·색상 텍스트·이모지 렌더링에 쓰는 Streamlit 요소는?", "st.markdown", ["st.title만", "st.json", "st.dataframe"], summary="markdown은 서식·이모지를 지원합니다."),
    # 11 집합연산자
    choice("el-0610-01", SECTIONS["11"], "SQL 일반 집합 연산이 아닌 것은?", "JOIN", ["UNION", "INTERSECT", "EXCEPT"], summary="JOIN은 결합 연산이며 집합 연산과 다릅니다."),
    choice("el-0610-02", SECTIONS["11"], "일반 집합 연산 4가지에 포함되는 것은?", "CROSS JOIN", ["INNER JOIN", "LEFT JOIN", "EQUI JOIN"], summary="UNION, INTERSECT, EXCEPT, CROSS JOIN."),
    # 12 JOIN
    choice("el-0611-01", SECTIONS["12"], "EQUI JOIN은 무엇을 사용한 조인인가? (띄어쓰기 없이)", "등가연산자", ["크로스조인", "카티션곱", "비등가"], choicePrompt="빈칸: OO OOO → 띄어쓰기 없이 입력", summary="등가(=) 조건으로 테이블을 연결합니다."),
    # 13 그룹·윈도우
    choice("el-0612-01", SECTIONS["13"], "데이터 분석을 위한 함수가 아닌 것은?", "조인 함수", ["윈도우 함수", "집계 함수", "그룹 함수"], summary="조인은 테이블 결합 연산입니다."),
    choice("el-0612-02", SECTIONS["13"], "동일 순위 후 건너뛰지 않고 연속 순위를 부여하는 함수는?", "DENSE_RANK", ["RANK", "ROW_NUMBER", "NTILE"], summary="DENSE_RANK는 1,2,2,3 형태입니다."),
    choice("el-0612-03", SECTIONS["13"], "동일 값에 같은 순위를 주고 다음 순위를 건너뛰는 함수는?", "RANK", ["DENSE_RANK", "ROW_NUMBER", "PERCENT_RANK"], summary="RANK는 1,2,2,4 형태입니다."),
    choice("el-0612-04", SECTIONS["13"], "모든 행에 고유한 순번을 부여하는 함수는?", "ROW_NUMBER", ["RANK", "DENSE_RANK", "CUME_DIST"], summary="ROW_NUMBER는 중복 없이 1,2,3…"),
    # 추가 배치
    choice("el-0527-13", SECTIONS["02"], "리눅스에 대한 설명으로 옳지 않은 것은?", "개발에 참여할 수 있는 사람이 제한적이다", ["리눅스는 운영체제이다", "오픈소스이므로 코드를 볼 수 있다", "GNU 프로젝트의 일환이다"], summary="리눅스는 누구나 기여할 수 있는 오픈소스입니다."),
    choice("el-0528-08", SECTIONS["03"], "HTTP 메서드 중 리소스를 생성할 때 주로 쓰는 것은?", "POST", ["GET", "DELETE", "HEAD"], summary="POST는 생성, GET은 조회입니다."),
    choice("el-0611-02", SECTIONS["12"], "INNER JOIN과 달리 양쪽 테이블의 모든 행을 조합하는 조인은?", "CROSS JOIN", ["LEFT JOIN", "RIGHT JOIN", "SELF JOIN"], summary="카티션 곱 형태의 CROSS JOIN."),
]
# fmt: on


SQL_BATCH = [
    sql_item(
        "el-sql-0901", SECTIONS["09"],
        "실습: employees·salaries 테이블 구조 확인",
        "employees",
        """-- SQLite에서는 PRAGMA table_info(테이블명)으로 구조를 확인합니다.
PRAGMA table_info(employees);

PRAGMA table_info(salaries);""",
        """PRAGMA table_info(employees);
PRAGMA table_info(salaries);""",
        {
            "goal": "employees와 salaries 테이블의 컬럼 구조를 확인합니다.",
            "steps": ["PRAGMA table_info(employees) 실행", "PRAGMA table_info(salaries) 실행"],
            "outputColumns": ["cid", "name", "type", "notnull", "dflt_value", "pk"],
            "tip": "MySQL의 DESC 대신 SQLite에서는 PRAGMA를 사용합니다.",
        },
        {"patterns": ["pragma", "table_info"], "minRows": 1},
    ),
    sql_item(
        "el-sql-0902", SECTIONS["09"],
        "실습: library book 테이블 전체 조회",
        "library",
        """-- SELECT문으로 book 테이블을 조회하세요.
SELECT *
FROM book;""",
        "SELECT *\nFROM book;",
        {
            "goal": "book 테이블의 모든 컬럼·행을 조회합니다.",
            "steps": ["SELECT * FROM book 작성", "세미콜론(;)으로 문장 종료"],
            "outputColumns": ["id", "title", "author", "publisher", "date_received"],
            "tip": "먼저 [테이블 보기]로 데이터를 확인하세요.",
        },
        {"patterns": ["select", "from book"], "minRows": 1},
    ),
    sql_item(
        "el-sql-0903", SECTIONS["09"],
        "실습: salaries에서 emp_no 중복 없이 조회",
        "employees",
        """SELECT * FROM salaries;

-- DISTINCT로 emp_no만 중복 없이 조회
SELECT DISTINCT emp_no
FROM salaries;""",
        "SELECT DISTINCT emp_no\nFROM salaries;",
        {
            "goal": "salaries 테이블에서 직원 번호(emp_no)를 중복 없이 출력합니다.",
            "steps": ["DISTINCT 키워드 사용", "emp_no 컬럼만 SELECT"],
            "outputColumns": ["emp_no"],
            "tip": "SELECT * 로 먼저 중복 행을 확인해 보세요.",
        },
        {"patterns": ["distinct", "emp_no"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1001", SECTIONS["10"],
        "실습: book·user 테이블 행 개수 COUNT",
        "library",
        """-- book과 user 테이블의 행 수를 각각 COUNT(*)로 조회
SELECT COUNT(*)
FROM book;

SELECT COUNT(*)
FROM user;""",
        "SELECT COUNT(*)\nFROM book;\n\nSELECT COUNT(*)\nFROM user;",
        {
            "goal": "book 테이블과 user 테이블의 자료 개수를 COUNT(*)로 구합니다.",
            "steps": ["book에 COUNT(*)", "user에 COUNT(*)", "두 쿼리를 순서대로 실행"],
            "outputColumns": ["COUNT(*)"],
            "tip": "결과는 book 5건, user 4건이어야 합니다.",
        },
        {"patterns": ["count"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1201", SECTIONS["12"],
        "실습: SELL·PRODUCT INNER JOIN",
        "sell_product",
        """PRAGMA table_info(SELL);
PRAGMA table_info(PRODUCT);
SELECT * FROM SELL;
SELECT * FROM PRODUCT;

-- SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY 조회 (INNER JOIN)
SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
        """SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
        {
            "goal": "SELL과 PRODUCT를 PRODUCT_ID로 INNER JOIN하여 4개 컬럼을 조회합니다.",
            "steps": ["INNER JOIN ON PRODUCT_ID", "4개 컬럼 선택", "SELL_ID 오름차순 정렬"],
            "outputColumns": ["SELL_ID", "SELLER_NAME", "PRODUCT_NAME", "QUANTITY"],
            "tip": "지시사항 컬럼 순서를 지키세요.",
        },
        {"patterns": ["inner join", "product_id"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1301", SECTIONS["13"],
        "실습: 윈도우 함수 SUM — 판매금액 합계",
        "sell_product",
        """SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY,
       SUM(PRICE * QUANTITY)
         OVER (PARTITION BY SELLER_NAME, SELL.PRODUCT_ID) AS SUM_PRICE
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
        """SELECT SELL_ID, SELLER_NAME, PRODUCT_NAME, QUANTITY,
       SUM(PRICE * QUANTITY) OVER (PARTITION BY SELLER_NAME, SELL.PRODUCT_ID) AS SUM_PRICE
FROM SELL
INNER JOIN PRODUCT ON SELL.PRODUCT_ID = PRODUCT.PRODUCT_ID
ORDER BY SELL_ID ASC;""",
        {
            "goal": "판매자·상품별 판매금액 합계(SUM_PRICE)를 윈도우 함수 SUM으로 구합니다.",
            "steps": [
                "INNER JOIN 후 PRICE*QUANTITY 계산",
                "SUM(...) OVER (PARTITION BY SELLER_NAME, SELL.PRODUCT_ID)",
                "SUM_PRICE 별칭",
            ],
            "outputColumns": ["SELL_ID", "SELLER_NAME", "PRODUCT_NAME", "QUANTITY", "SUM_PRICE"],
            "tip": "PARTITION BY에 SELLER_NAME과 PRODUCT_ID를 함께 사용합니다.",
        },
        {"patterns": ["sum", "over", "partition by"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1302", SECTIONS["13"],
        "실습: PERCENT_RANK·CUME_DIST",
        "student",
        """SELECT * FROM STUDENT;

SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       PERCENT_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS PERCENT_RANK,
       CUME_DIST() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS CUME_DIST
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
        """SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       PERCENT_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS PERCENT_RANK,
       CUME_DIST() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS CUME_DIST
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
        {
            "goal": "3과목 합계 기준 PERCENT_RANK와 CUME_DIST를 구합니다.",
            "steps": [
                "SCORE_SUM 계산",
                "PERCENT_RANK() OVER (ORDER BY 합계 DESC)",
                "CUME_DIST() OVER (ORDER BY 합계 DESC)",
            ],
            "outputColumns": ["ID", "MATH", "PHYSICS", "CHEMISTRY", "SCORE_SUM", "PERCENT_RANK", "CUME_DIST"],
            "tip": "컬럼 순서를 지시사항과 동일하게 맞추세요.",
        },
        {"patterns": ["percent_rank", "cume_dist", "over"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1303", SECTIONS["13"],
        "실습: GROUP BY ROLLUP — 판매량 합계",
        "book_history",
        """SELECT * FROM BOOK_HISTORY;

SELECT KIND, CATEGORY, SUM(SELL_COUNT)
FROM BOOK_HISTORY
GROUP BY KIND, CATEGORY WITH ROLLUP;""",
        """SELECT KIND, CATEGORY, SUM(SELL_COUNT)
FROM BOOK_HISTORY
GROUP BY KIND, CATEGORY WITH ROLLUP;""",
        {
            "goal": "KIND·CATEGORY별 판매량 합계와 ROLLUP 소계를 구합니다.",
            "steps": ["GROUP BY KIND, CATEGORY", "SUM(SELL_COUNT)", "WITH ROLLUP 추가"],
            "outputColumns": ["KIND", "CATEGORY", "SUM(SELL_COUNT)"],
            "tip": "ROLLUP은 소계·총계 행이 추가됩니다.",
        },
        {"patterns": ["group by", "rollup", "sum"], "minRows": 1},
    ),
    sql_item(
        "el-sql-0904", SECTIONS["09"],
        "실습: book 테이블 상위 5권 LIMIT",
        "library",
        """-- book 테이블에서 5권만 조회 (모든 컬럼)
SELECT *
FROM book
LIMIT 5;""",
        "SELECT *\nFROM book\nLIMIT 5;",
        {
            "goal": "book 테이블에서 모든 컬럼을 LIMIT 5로 5권만 조회합니다.",
            "steps": ["SELECT * FROM book", "LIMIT 5 추가"],
            "outputColumns": ["id", "title", "author", "publisher", "date_received"],
            "tip": "LIMIT n은 상위 n행만 반환합니다.",
        },
        {"patterns": ["select", "from book", "limit"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1202", SECTIONS["12"],
        "실습: EMPLOYEE·POSITION_T INNER JOIN",
        "employee_position",
        """SELECT * FROM EMPLOYEE;
SELECT * FROM POSITION_T;

SELECT EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
INNER JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
        """SELECT EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
INNER JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
        {
            "goal": "EMPLOYEE와 POSITION_T를 POSITION_ID로 INNER JOIN하여 사번·이름·직급명을 조회합니다.",
            "steps": ["INNER JOIN ON POSITION_ID", "EMPLOYEE_ID, NAME, POSITION_NAME 출력", "EMPLOYEE_ID ASC 정렬"],
            "outputColumns": ["EMPLOYEE_ID", "NAME", "POSITION_NAME"],
            "tip": "컬럼 순서를 지시사항과 동일하게 맞추세요.",
        },
        {"patterns": ["inner join", "position_id", "order by"], "minRows": 1},
    ),
]


# fmt: off
CHOICE_BATCH2 = [
    # 02 리눅스 추가 (스크린샷 갭 보강)
    choice("el-0527-14", SECTIONS["02"], "리눅스 파일 권한에서 `r`이 의미하는 것은?", "읽기 권한", ["쓰기 권한", "실행 권한", "삭제 권한"], summary="r=read, w=write, x=execute."),
    choice("el-0527-15", SECTIONS["02"], "파일 내용에서 특정 문자열을 검색하는 명령어는?", "grep", ["find", "chmod", "tar"], summary="grep은 패턴 검색에 사용합니다."),
    choice("el-0527-16", SECTIONS["02"], "한 명령의 출력을 다른 명령의 입력으로 넘기는 기호는?", "| (파이프)", ["> (리다이렉션)", "& (백그라운드)", "; (명령 구분)"], summary="파이프는 프로세스 간 데이터 전달입니다."),
    choice("el-0527-17", SECTIONS["02"], "명령 출력을 파일로 저장(덮어쓰기)할 때 쓰는 기호는?", ">", [">>", "<", "|"], summary="> 는 stdout을 파일로 리다이렉션합니다."),
    choice("el-0527-18", SECTIONS["02"], "실행 중인 프로세스 목록을 보는 명령어는?", "ps", ["ls", "pwd", "cat"], summary="ps는 process status입니다."),
    choice("el-0527-19", SECTIONS["02"], "프로세스에 종료 신호를 보내는 명령어는?", "kill", ["rm", "mv", "cp"], summary="kill PID로 프로세스를 종료합니다."),
    choice("el-0527-20", SECTIONS["02"], "환경 변수를 출력하는 명령어는?", "env", ["export만", "setenv", "var"], summary="env는 현재 셸 환경 변수를 보여줍니다."),
    choice("el-0527-21", SECTIONS["02"], "명령어 매뉴얼을 보는 명령어는?", "man", ["help", "info", "doc"], summary="man command로 도움말을 확인합니다."),
    choice("el-0527-22", SECTIONS["02"], "디렉터리 트리에서 파일·폴더를 찾는 명령어는?", "find", ["grep", "locate만", "search"], summary="find는 경로·조건으로 검색합니다."),
    choice("el-0527-23", SECTIONS["02"], "여러 파일을 묶어 압축·해제하는 명령어는?", "tar", ["zip만", "gzip만", "compress"], summary="tar는 아카이브, gzip과 함께 쓰기도 합니다."),
    choice("el-0527-24", SECTIONS["02"], "원격 서버에 암호화 접속하는 프로토콜·명령은?", "SSH", ["FTP", "TELNET", "HTTP"], summary="SSH는 Secure Shell입니다."),
    choice("el-0527-25", SECTIONS["02"], "관리자 권한으로 명령을 실행하는 접두어는?", "sudo", ["su만", "admin", "root"], summary="sudo는 superuser do입니다."),
    choice("el-0527-26", SECTIONS["02"], "우분투에서 패키지를 설치하는 명령은?", "apt install", ["yum install", "brew install", "npm install"], summary="Debian/Ubuntu 계열은 apt입니다."),
    choice("el-0527-27", SECTIONS["02"], "심볼릭 링크를 만드는 명령은?", "ln -s", ["ln만", "link", "symlink"], summary="ln -s 원본 링크이름."),
    choice("el-0527-28", SECTIONS["02"], "현재 디렉터리의 파일을 상세 목록(숨김 포함)으로 보는 명령은?", "ls -al", ["ls", "dir", "list"], summary="ls -al은 숨김·권한 정보를 포함합니다."),
    choice("el-0527-29", SECTIONS["02"], "파일 내용을 화면에 출력하는 명령어는?", "cat", ["type", "show", "print"], summary="cat은 concatenate·출력입니다."),
    choice("el-0527-30", SECTIONS["02"], "디렉터리를 생성하는 명령어는?", "mkdir", ["touch", "rmdir", "mkfile"], summary="mkdir directory_name."),
    # 07 라이브러리 추가
    choice("el-0604-04", SECTIONS["07"], "`from math import sqrt` 후 16의 제곱근은?", "sqrt(16) → 4.0", ["math.sqrt만 가능", "16**0.5 불가", "import 불필요"], summary="from import로 함수 직접 호출."),
    choice("el-0604-05", SECTIONS["07"], "난수 생성에 주로 쓰는 표준 모듈은?", "random", ["os", "sys", "json"], summary="random.randrange, random.choice 등."),
    choice("el-0604-06", SECTIONS["07"], "날짜·시간 처리에 쓰는 표준 모듈은?", "datetime", ["time만", "calendar만", "date"], summary="datetime.datetime, timedelta 등."),
    choice("el-0604-07", SECTIONS["07"], "외부 패키지 설치에 쓰는 도구는?", "pip", ["npm", "apt", "conda만"], summary="pip install 패키지명."),
    choice("el-0604-08", SECTIONS["07"], "`import numpy as np`에서 `as np`의 역할은?", "별칭(alias) 부여", ["버전 지정", "경로 설정", "암호화"], summary="as로 짧은 이름을 붙입니다."),
    # 10 SQL 함수
    choice("el-0610-03", SECTIONS["10"], "집계 함수가 아닌 것은?", "CONCAT", ["SUM", "AVG", "COUNT"], summary="CONCAT은 문자열 결합 함수입니다."),
    choice("el-0610-04", SECTIONS["10"], "서브쿼리를 설명한 것으로 옳은 것은?", "쿼리 안에 또 다른 SELECT를 넣을 수 있다", ["서브쿼리는 JOIN만 가능", "항상 2개 테이블 필요", "WHERE에만 사용"], summary="SELECT/WHERE/FROM 등에 서브쿼리 가능."),
    choice("el-0610-05", SECTIONS["10"], "UNION과 UNION ALL의 차이로 옳은 것은?", "UNION은 중복 제거, UNION ALL은 중복 유지", ["둘 다 중복 제거", "UNION ALL만 정렬", "UNION은 JOIN"], summary="UNION은 DISTINCT 합집합."),
    # 11 집합연산자
    choice("el-0610-06", SECTIONS["11"], "두 결과의 교집합을 구하는 연산자는?", "INTERSECT", ["UNION", "EXCEPT", "CROSS JOIN"], summary="INTERSECT는 공통 행만."),
    choice("el-0610-07", SECTIONS["11"], "첫 결과에서 두 번째 결과를 빼는 연산자는?", "EXCEPT", ["INTERSECT", "MINUS만", "DELETE"], summary="EXCEPT(MINUS)는 차집합."),
    # 12 JOIN
    choice("el-0611-03", SECTIONS["12"], "왼쪽 테이블의 모든 행을 유지하는 조인은?", "LEFT JOIN", ["INNER JOIN", "RIGHT JOIN만", "CROSS JOIN"], summary="LEFT JOIN은 왼쪽 기준 전체 행."),
    choice("el-0611-04", SECTIONS["12"], "같은 테이블을 두 번 조인하는 방식은?", "SELF JOIN", ["CROSS JOIN", "NATURAL JOIN", "OUTER JOIN만"], summary="별칭을 달아 자기 자신과 조인."),
    choice("el-0611-05", SECTIONS["12"], "조인 조건 없이 모든 조합을 만드는 조인은?", "CROSS JOIN", ["INNER JOIN", "EQUI JOIN", "SELF JOIN"], summary="카티션 곱 = CROSS JOIN."),
    choice("el-0611-06", SECTIONS["12"], "INNER JOIN에서 ON 절의 역할은?", "두 테이블을 연결하는 조건 지정", ["정렬 기준", "그룹화", "중복 제거"], summary="ON은 조인 조건입니다."),
    # 13 윈도우
    choice("el-0612-05", SECTIONS["13"], "그룹 내 이전 행 값을 가져오는 함수는?", "LAG", ["LEAD", "FIRST_VALUE", "RANK"], summary="LAG는 이전 행, LEAD는 다음 행."),
    choice("el-0612-06", SECTIONS["13"], "GROUP BY ROLLUP의 효과는?", "소계·총계 행이 추가된다", ["중복만 제거", "조인 수행", "인덱스 생성"], summary="ROLLUP은 계층 집계를 만듭니다."),
]

SQL_BATCH2 = [
    sql_item(
        "el-sql-1002", SECTIONS["10"],
        "실습: salaries 테이블 연봉 합계 SUM",
        "employees",
        """SELECT * FROM salaries;

-- salaries 테이블의 salary 합계를 SUM으로 구하세요.
SELECT SUM(salary)
FROM salaries;""",
        "SELECT SUM(salary)\nFROM salaries;",
        {
            "goal": "salaries 테이블에서 지급된 연봉(salary)의 합계를 SUM 함수로 구합니다.",
            "steps": ["SELECT SUM(salary) 작성", "FROM salaries 지정"],
            "outputColumns": ["SUM(salary)"],
            "tip": "집계 함수는 전체 행을 하나의 값으로 줄입니다.",
        },
        {"patterns": ["sum", "salary"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1003", SECTIONS["10"],
        "실습: rental·user INNER JOIN 전체 조회",
        "library_rental",
        """SELECT * FROM rental;
SELECT * FROM user;

-- rental과 user를 INNER JOIN (rental.user_id = user.id)
SELECT *
FROM rental
INNER JOIN user ON rental.user_id = user.id;""",
        "SELECT *\nFROM rental\nINNER JOIN user ON rental.user_id = user.id;",
        {
            "goal": "rental 테이블과 user 테이블을 user_id·id로 INNER JOIN하여 모든 컬럼을 조회합니다.",
            "steps": ["INNER JOIN user", "ON rental.user_id = user.id", "SELECT * 사용"],
            "outputColumns": ["id", "book_id", "user_id", "name", "email"],
            "tip": "대출 정보에 회원 정보가 붙어 나옵니다.",
        },
        {"patterns": ["inner join", "user_id", "user.id"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1004", SECTIONS["10"],
        "실습: salaries 평균·최대·최소 AVG/MAX/MIN",
        "employees",
        """-- salary의 평균, 최대, 최소를 한 번에 조회
SELECT AVG(salary) AS avg_sal,
       MAX(salary) AS max_sal,
       MIN(salary) AS min_sal
FROM salaries;""",
        """SELECT AVG(salary) AS avg_sal,
       MAX(salary) AS max_sal,
       MIN(salary) AS min_sal
FROM salaries;""",
        {
            "goal": "salaries 테이블에서 salary의 평균·최대·최소를 집계 함수로 구합니다.",
            "steps": ["AVG(salary)", "MAX(salary)", "MIN(salary)", "별칭 AS 사용"],
            "outputColumns": ["avg_sal", "max_sal", "min_sal"],
            "tip": "여러 집계 함수를 한 SELECT에 쓸 수 있습니다.",
        },
        {"patterns": ["avg", "max", "min"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1005", SECTIONS["10"],
        "실습: 서브쿼리 — 평균 이상 연봉 조회",
        "employees",
        """-- 평균 연봉보다 높은 salary 행만 조회
SELECT emp_no, salary
FROM salaries
WHERE salary > (SELECT AVG(salary) FROM salaries)
ORDER BY salary DESC;""",
        """SELECT emp_no, salary
FROM salaries
WHERE salary > (SELECT AVG(salary) FROM salaries)
ORDER BY salary DESC;""",
        {
            "goal": "서브쿼리로 평균 연봉을 구하고, 그보다 높은 salary 행만 조회합니다.",
            "steps": ["SELECT AVG(salary) 서브쿼리", "WHERE salary > (서브쿼리)", "ORDER BY salary DESC"],
            "outputColumns": ["emp_no", "salary"],
            "tip": "스칼라 서브쿼리는 단일 값을 반환합니다.",
        },
        {"patterns": ["select avg", "where salary"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1101", SECTIONS["11"],
        "실습: UNION / UNION ALL 집합 연산",
        "request_union",
        """SELECT * FROM request_past;
SELECT * FROM request_new;

-- 1) UNION ALL (중복 유지) + name 오름차순
SELECT name, number FROM request_past
UNION ALL
SELECT name, number FROM request_new
ORDER BY name, number ASC;""",
        """SELECT name, number FROM request_past
UNION ALL
SELECT name, number FROM request_new
ORDER BY name, number ASC;""",
        {
            "goal": "request_past와 request_new에서 name, number를 UNION ALL로 연결하고 name 오름차순 정렬합니다.",
            "steps": ["각 테이블 SELECT name, number", "UNION ALL 연결", "ORDER BY name, number ASC"],
            "outputColumns": ["name", "number"],
            "tip": "UNION은 중복 제거, UNION ALL은 중복 유지입니다.",
        },
        {"patterns": ["union all", "order by"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1102", SECTIONS["11"],
        "실습: INTERSECT 교집합",
        "request_union",
        """-- request_past와 request_new에 공통으로 있는 (name, number) 조회
SELECT name, number FROM request_past
INTERSECT
SELECT name, number FROM request_new
ORDER BY name;""",
        """SELECT name, number FROM request_past
INTERSECT
SELECT name, number FROM request_new
ORDER BY name;""",
        {
            "goal": "두 테이블에 모두 존재하는 name, number 교집합을 INTERSECT로 구합니다.",
            "steps": ["양쪽 SELECT name, number", "INTERSECT", "ORDER BY name"],
            "outputColumns": ["name", "number"],
            "tip": "INTERSECT는 양쪽에 있는 행만 반환합니다.",
        },
        {"patterns": ["intersect"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1203", SECTIONS["12"],
        "실습: FIRST_NAME_T·LAST_NAME_T CROSS JOIN",
        "name_cross",
        """SELECT * FROM FIRST_NAME_T;
SELECT * FROM LAST_NAME_T;

-- CROSS JOIN으로 first_name, last_name 출력 (이름·성 오름차순)
SELECT first_name, last_name
FROM FIRST_NAME_T
CROSS JOIN LAST_NAME_T
ORDER BY first_name, last_name ASC;""",
        """SELECT first_name, last_name
FROM FIRST_NAME_T
CROSS JOIN LAST_NAME_T
ORDER BY first_name, last_name ASC;""",
        {
            "goal": "FIRST_NAME_T와 LAST_NAME_T를 CROSS JOIN하여 first_name, last_name을 조회합니다.",
            "steps": ["CROSS JOIN LAST_NAME_T", "first_name, last_name 선택", "ORDER BY first_name, last_name ASC"],
            "outputColumns": ["first_name", "last_name"],
            "tip": "3×3 = 9행의 카티션 곱이 나옵니다.",
        },
        {"patterns": ["cross join", "order by"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1204", SECTIONS["12"],
        "실습: EMPLOYEE SELF JOIN — 관리자 이름",
        "employee_self",
        """SELECT * FROM EMPLOYEE;

-- SELF JOIN: employee_id, employee_name, manager_name(별칭)
SELECT a.employee_id, a.employee_name, b.employee_name AS manager_name
FROM EMPLOYEE AS a, EMPLOYEE AS b
WHERE a.manager_id = b.employee_id
ORDER BY a.employee_id ASC;""",
        """SELECT a.employee_id, a.employee_name, b.employee_name AS manager_name
FROM EMPLOYEE AS a, EMPLOYEE AS b
WHERE a.manager_id = b.employee_id
ORDER BY a.employee_id ASC;""",
        {
            "goal": "EMPLOYEE 테이블을 SELF JOIN하여 사원ID, 사원이름, 관리자이름을 조회합니다.",
            "steps": ["별칭 a, b", "a.manager_id = b.employee_id", "manager_name 별칭", "employee_id ASC 정렬"],
            "outputColumns": ["employee_id", "employee_name", "manager_name"],
            "tip": "manager_id가 NULL인 Kim은 결과에 없습니다.",
        },
        {"patterns": ["manager_id", "employee_id", "order by"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1205", SECTIONS["12"],
        "실습: REQUEST_HIST·MEMBER INNER JOIN (fail만)",
        "request_member",
        """SELECT * FROM REQUEST_HIST;
SELECT * FROM MEMBER;

-- req_status='fail'인 요청만 JOIN하여 request_id, req_status, member_name 조회
SELECT request_id, req_status, member_name
FROM REQUEST_HIST
INNER JOIN MEMBER ON REQUEST_HIST.req_member_id = MEMBER.member_id
WHERE req_status = 'fail'
ORDER BY request_id ASC;""",
        """SELECT request_id, req_status, member_name
FROM REQUEST_HIST
INNER JOIN MEMBER ON REQUEST_HIST.req_member_id = MEMBER.member_id
WHERE req_status = 'fail'
ORDER BY request_id ASC;""",
        {
            "goal": "REQUEST_HIST와 MEMBER를 INNER JOIN하고 req_status가 fail인 행만 조회합니다.",
            "steps": ["INNER JOIN ON req_member_id = member_id", "WHERE req_status = 'fail'", "ORDER BY request_id ASC"],
            "outputColumns": ["request_id", "req_status", "member_name"],
            "tip": "컬럼 순서: request_id, req_status, member_name.",
        },
        {"patterns": ["inner join", "fail", "order by"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1206", SECTIONS["12"],
        "실습: EMPLOYEE LEFT JOIN POSITION_T",
        "employee_position",
        """SELECT * FROM EMPLOYEE;
SELECT * FROM POSITION_T;

-- LEFT JOIN: 모든 사원 + 직급명 (직급 없으면 NULL)
SELECT EMPLOYEE.EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
LEFT JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
        """SELECT EMPLOYEE.EMPLOYEE_ID, NAME, POSITION_NAME
FROM EMPLOYEE
LEFT JOIN POSITION_T ON EMPLOYEE.POSITION_ID = POSITION_T.POSITION_ID
ORDER BY EMPLOYEE_ID ASC;""",
        {
            "goal": "EMPLOYEE를 기준 LEFT JOIN으로 모든 사원과 직급명을 조회합니다.",
            "steps": ["LEFT JOIN POSITION_T", "ON POSITION_ID", "EMPLOYEE_ID ASC 정렬"],
            "outputColumns": ["EMPLOYEE_ID", "NAME", "POSITION_NAME"],
            "tip": "LEFT JOIN은 왼쪽(EMPLOYEE)의 모든 행을 유지합니다.",
        },
        {"patterns": ["left join", "position"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1304", SECTIONS["13"],
        "실습: DENSE_RANK·ROW_NUMBER 윈도우 순위",
        "student",
        """SELECT * FROM STUDENT;

-- 3과목 합계 기준 DENSE_RANK, ROW_NUMBER
SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       DENSE_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS DENSE_RANK,
       ROW_NUMBER() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS ROW_NUMBER
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
        """SELECT ID, MATH, PHYSICS, CHEMISTRY,
       (MATH + PHYSICS + CHEMISTRY) AS SCORE_SUM,
       DENSE_RANK() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS DENSE_RANK,
       ROW_NUMBER() OVER (ORDER BY (MATH + PHYSICS + CHEMISTRY) DESC) AS ROW_NUMBER
FROM STUDENT
ORDER BY SCORE_SUM DESC;""",
        {
            "goal": "3과목 합계 기준 DENSE_RANK(동점 연속)와 ROW_NUMBER(고유 순번)를 구합니다.",
            "steps": ["SCORE_SUM 계산", "DENSE_RANK() OVER (ORDER BY 합계 DESC)", "ROW_NUMBER() OVER (...)"],
            "outputColumns": ["ID", "MATH", "PHYSICS", "CHEMISTRY", "SCORE_SUM", "DENSE_RANK", "ROW_NUMBER"],
            "tip": "DENSE_RANK는 1,2,2,3 / ROW_NUMBER는 1,2,3,4 형태입니다.",
        },
        {"patterns": ["dense_rank", "row_number", "over"], "minRows": 1},
    ),
    sql_item(
        "el-sql-1305", SECTIONS["13"],
        "실습: LAG·LEAD·FIRST_VALUE 윈도우",
        "participant",
        """SELECT * FROM PARTICIPANT;

-- 그룹별 이전·다음 기록, 그룹 최단 기록
SELECT ID, GROUP_NUM, TIME_RECORD,
       LAG(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS prev_time,
       LEAD(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS next_time,
       FIRST_VALUE(TIME_RECORD) OVER (
         PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS fastest
FROM PARTICIPANT
ORDER BY GROUP_NUM, TIME_RECORD;""",
        """SELECT ID, GROUP_NUM, TIME_RECORD,
       LAG(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS prev_time,
       LEAD(TIME_RECORD, 1) OVER (PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC) AS next_time,
       FIRST_VALUE(TIME_RECORD) OVER (
         PARTITION BY GROUP_NUM ORDER BY TIME_RECORD ASC
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS fastest
FROM PARTICIPANT
ORDER BY GROUP_NUM, TIME_RECORD;""",
        {
            "goal": "그룹별 LAG(이전), LEAD(다음), FIRST_VALUE(최단 기록)를 윈도우 함수로 구합니다.",
            "steps": ["PARTITION BY GROUP_NUM", "ORDER BY TIME_RECORD ASC", "LAG/LEAD/FIRST_VALUE OVER"],
            "outputColumns": ["ID", "GROUP_NUM", "TIME_RECORD", "prev_time", "next_time", "fastest"],
            "tip": "PARTITION BY로 그룹 내에서만 순서 함수가 적용됩니다.",
        },
        {"patterns": ["lag", "lead", "first_value", "partition by"], "minRows": 1},
    ),
]

PYTHON_BATCH2 = [
    py_item(
        "el-py-0604-01", SECTIONS["07"],
        "실습: random.randint로 난수 출력",
        """import random

# 1 이상 10 이하 정수 난수를 num에 저장하고 출력
num = random.randint(1, 10)
print(num)""",
        """import random
num = random.randint(1, 10)
print(num)""",
        {
            "goal": "random.randint(1, 10)으로 1~10 정수 난수를 생성해 출력합니다.",
            "steps": ["import random", "randint(1, 10)", "print"],
            "tip": "randint는 양 끝 포함입니다.",
        },
        {"patterns": ["import random", "randint", "print"]},
    ),
    py_item(
        "el-py-0604-02", SECTIONS["07"],
        "실습: math.sqrt 제곱근 계산",
        """import math

# 25의 제곱근을 result에 저장하고 출력
result = math.sqrt(25)
print(result)""",
        """import math
result = math.sqrt(25)
print(result)""",
        {
            "goal": "math.sqrt(25)로 제곱근 5.0을 구해 출력합니다.",
            "steps": ["import math", "math.sqrt(25)", "print"],
            "tip": "sqrt는 float를 반환합니다.",
        },
        {"patterns": ["import math", "sqrt", "print"]},
    ),
    py_item(
        "el-py-0604-03", SECTIONS["07"],
        "실습: datetime으로 오늘 날짜 출력",
        """from datetime import date

today = date.today()
print(today)""",
        """from datetime import date
today = date.today()
print(today)""",
        {
            "goal": "datetime.date.today()로 오늘 날짜를 출력합니다.",
            "steps": ["from datetime import date", "date.today()", "print"],
            "tip": "YYYY-MM-DD 형식으로 출력됩니다.",
        },
        {"patterns": ["datetime", "today", "print"]},
    ),
    py_item(
        "el-py-0604-04", SECTIONS["07"],
        "실습: random.choice 리스트 요소 선택",
        """import random

fruits = ["apple", "banana", "cherry"]
picked = random.choice(fruits)
print(picked)""",
        """import random
fruits = ["apple", "banana", "cherry"]
picked = random.choice(fruits)
print(picked)""",
        {
            "goal": "random.choice로 fruits 리스트에서 하나를 골라 출력합니다.",
            "steps": ["리스트 정의", "random.choice(fruits)", "print"],
            "tip": "실행할 때마다 결과가 달라질 수 있습니다.",
        },
        {"patterns": ["random.choice", "print"]},
    ),
    py_item(
        "el-py-0604-05", SECTIONS["07"],
        "실습: math.ceil·floor 반올림·내림",
        """import math

x = 3.7
print(math.ceil(x), math.floor(x))""",
        """import math
x = 3.7
print(math.ceil(x), math.floor(x))""",
        {
            "goal": "math.ceil(3.7)=4, math.floor(3.7)=3을 출력합니다.",
            "steps": ["import math", "ceil과 floor", "print 두 값"],
            "tip": "출력: 4 3",
        },
        {"patterns": ["math.ceil", "math.floor", "print"]},
    ),
]
# fmt: on


PYTHON_BATCH = [
    py_item(
        "el-py-0602-01", SECTIONS["06"],
        "실습: plus/minus 함수 작성·출력",
        """# modelName과 더하기·빼기 함수를 작성하세요
modelName = "ELI-C2"

def plus(a, b):
    return a + b

def minus(a, b):
    return a - b

var1 = modelName
var2 = plus(3, 4)
var3 = minus(9, 4)
print(var1, var2, var3)""",
        """modelName = "ELI-C2"
def plus(a, b):
    return a + b
def minus(a, b):
    return a - b
var1 = modelName
var2 = plus(3, 4)
var3 = minus(9, 4)
print(var1, var2, var3)""",
        {
            "goal": "modelName, plus, minus를 정의하고 print(var1, var2, var3)로 ELI-C2 7 5를 출력합니다.",
            "steps": ["함수 plus/minus 정의", "var1~3 할당", "print 출력"],
            "tip": "출력: ELI-C2 7 5",
        },
        {"patterns": ["def plus", "def minus", "print"]},
    ),
    py_item(
        "el-py-0602-02", SECTIONS["06"],
        "실습: random·math 조합",
        """from random import randrange
import math

var1 = randrange(1, 11)
var2 = math.log(5184, 72)
print(var1, var2)""",
        """from random import randrange
import math
var1 = randrange(1, 11)
var2 = math.log(5184, 72)
print(var1, var2)""",
        {
            "goal": "randrange(1,11)와 math.log(5184,72)를 계산해 출력합니다.",
            "steps": ["from random import randrange", "math.log 사용", "print"],
            "tip": "math.log(5184,72)는 2.0입니다.",
        },
        {"patterns": ["randrange", "math.log", "print"]},
    ),
]


def all_new_items():
    return (
        CHOICE_BATCH + CHOICE_BATCH2
        + SQL_BATCH + SQL_BATCH2
        + PYTHON_BATCH + PYTHON_BATCH2
    )
