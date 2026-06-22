/** file:// 직접 열기 시 fetch 대신 사용 */
window.EMBEDDED_DECK_DATA = window.EMBEDDED_DECK_DATA || {};
Object.assign(window.EMBEDDED_DECK_DATA, {
  "sql-dml": {
    "meta": {
      "id": "sql-dml",
      "title": "SQL DML 실전",
      "description": "SELECT, INSERT, UPDATE, DELETE 핵심 문법을 선택형·실습으로 익히기"
    },
    "items": [
      {
        "id": "sql-001",
        "section": "04 데이터베이스",
        "question": "book 테이블에서 책 ID(id)가 3인 데이터의 모든 컬럼을 조회합니다.\n빈칸에 들어갈 SQL 절은?",
        "code": "SELECT * FROM book (        ) id = 3;",
        "answers": [
          "WHERE"
        ],
        "hint": "조회할 데이터에 '조건'을 걸 때 쓰는 가장 대표적인 키워드를 생각해보세요.",
        "summary": "WHERE 절은 SELECT 결과에서 특정 행만 걸러낼 때 사용합니다. GROUP BY 이후 집계 결과를 거르는 것은 HAVING, JOIN 조건은 ON을 씁니다.",
        "explanation": "WHERE는 행(row) 단위 필터링입니다. HAVING은 GROUP BY로 묶인 그룹에, ON은 두 테이블을 연결할 때 사용합니다.",
        "options": [
          {
            "text": "HAVING",
            "isCorrect": false,
            "rationale": "집계 그룹 결과 필터링용입니다."
          },
          {
            "text": "WHERE",
            "isCorrect": true,
            "rationale": "행 단위 조건 필터링에 사용합니다."
          },
          {
            "text": "ON",
            "isCorrect": false,
            "rationale": "JOIN 결합 조건에 주로 사용합니다."
          }
        ],
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요."
      },
      {
        "id": "sql-002",
        "section": "04 데이터베이스",
        "question": "book 테이블에 새 행(id: 5, title: '춘향전')을 추가합니다.\n명령어의 시작 키워드 두 단어는?",
        "code": "____ ____ book VALUES (5, '춘향전');",
        "answers": [
          "INSERT INTO",
          "insert into"
        ],
        "hint": "데이터를 테이블 '안에 삽입'한다는 의미의 키워드입니다.",
        "summary": "INSERT INTO 테이블명 VALUES (값1, 값2, ...); 형태로 새 행을 추가합니다. SET은 UPDATE에서 쓰는 문법입니다.",
        "explanation": "DML 중 데이터 추가는 INSERT INTO가 표준입니다. ADD TO, REMOVE 같은 키워드는 SQL 표준이 아닙니다.",
        "options": [
          {
            "text": "INSERT INTO",
            "isCorrect": true,
            "rationale": "정답입니다."
          },
          {
            "text": "ADD TO book VALUES (5, '춘향전');",
            "isCorrect": false,
            "rationale": "SQL에 ADD TO 명령은 없습니다."
          },
          {
            "text": "INSERT INTO book VALUES (5, '춘향전');",
            "isCorrect": true,
            "rationale": "표준 INSERT 문법입니다."
          },
          {
            "text": "INSERT INTO book SET id=5, title='춘향전';",
            "isCorrect": false,
            "rationale": "SET은 UPDATE 문법입니다."
          }
        ],
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요."
      },
      {
        "id": "sql-003",
        "section": "04 데이터베이스",
        "question": "출판사가 '엘리스 출판'인 행을 모두 삭제합니다.\n삭제 명령의 시작 두 단어는?",
        "code": "____ ____ book WHERE publisher = '엘리스 출판';",
        "answers": [
          "DELETE FROM",
          "delete from"
        ],
        "hint": "행 데이터를 지울 때 쓰는 DML 키워드입니다. 테이블 전체를 날리는 DROP과 다릅니다.",
        "summary": "DELETE FROM 테이블 WHERE 조건; 으로 조건에 맞는 행만 삭제합니다. DROP TABLE은 테이블 구조 자체를 제거합니다.",
        "explanation": "DELETE는 DML(데이터 조작), DROP은 DDL(구조 정의)에 가깝습니다. WHERE 없는 DELETE는 전체 행 삭제이므로 주의가 필요합니다.",
        "options": [
          {
            "text": "DELETE FROM book WHERE publisher = '엘리스 출판';",
            "isCorrect": true,
            "rationale": "조건부 행 삭제의 표준 문법입니다."
          },
          {
            "text": "DROP TABLE book WHERE publisher = '엘리스 출판';",
            "isCorrect": false,
            "rationale": "DROP은 테이블 전체를 제거합니다."
          },
          {
            "text": "DELETE FROM",
            "isCorrect": true,
            "rationale": "정답입니다."
          },
          {
            "text": "REMOVE FROM book WHERE publisher = '엘리스 출판';",
            "isCorrect": false,
            "rationale": "REMOVE는 SQL 표준 명령이 아닙니다."
          }
        ],
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요."
      },
      {
        "id": "sql-004",
        "section": "04 데이터베이스",
        "question": "book 테이블에서 id가 10인 행의 title을 '해리포터'로 바꿉니다.\n사용하는 DML 명령어는?",
        "code": "____ book SET title = '해리포터' WHERE id = 10;",
        "answers": [
          "UPDATE",
          "update"
        ],
        "hint": "기존 데이터를 '수정'할 때 쓰는 키워드입니다.",
        "summary": "UPDATE 테이블 SET 컬럼=값 WHERE 조건; 으로 기존 행의 값을 변경합니다. INSERT는 추가, DELETE는 삭제입니다.",
        "explanation": "SET 절에 변경할 컬럼과 값을 나열하고, WHERE로 대상 행을 한정합니다. WHERE를 빼면 모든 행이 변경됩니다.",
        "options": [
          {
            "text": "ALTER",
            "isCorrect": false,
            "rationale": "테이블 구조 변경(DDL)에 가깝습니다."
          },
          {
            "text": "INSERT",
            "isCorrect": false,
            "rationale": "새 행 추가용입니다."
          },
          {
            "text": "UPDATE",
            "isCorrect": true,
            "rationale": "기존 행 수정에 사용합니다."
          }
        ],
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요."
      },
      {
        "id": "sql-005",
        "section": "04 데이터베이스",
        "question": "조회 결과를 price 기준 내림차순으로 정렬합니다.\nORDER BY 뒤에 올 정렬 방향 키워드는?",
        "code": "SELECT * FROM book ORDER BY price ____;",
        "answers": [
          "DESC",
          "desc"
        ],
        "hint": "큰 값부터 작은 값 순서입니다. 오름차순의 반대입니다.",
        "summary": "ORDER BY 컬럼 ASC 는 오름차순(작→큰), DESC 는 내림차순(큰→작)입니다. 기본값은 DB에 따라 다를 수 있어 명시하는 것이 안전합니다.",
        "explanation": "정렬은 결과 집합을 재배열할 뿐, 행 수를 줄이지 않습니다. 필터링은 WHERE, 그룹화는 GROUP BY를 사용합니다.",
        "options": [
          {
            "text": "ASC",
            "isCorrect": false,
            "rationale": "오름차순 정렬입니다."
          },
          {
            "text": "SORT",
            "isCorrect": false,
            "rationale": "SQL 표준 정렬 키워드가 아닙니다."
          },
          {
            "text": "DESC",
            "isCorrect": true,
            "rationale": "내림차순 정렬입니다."
          }
        ],
        "itemType": "choice",
        "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요."
      }
    ]
  },
  "it-network": {
    "meta": {
      "id": "it-network",
      "title": "네트워크 기초",
      "description": "OSI, TCP/IP, HTTP, 리눅스·IT 기초 (강의자료 반영)"
    },
    "items": [
      {
        "id": "net-001",
        "section": "03 네트워크 실무",
        "question": "네트워크 계층 중 패킷 라우팅과 IP 주소를 담당하는 계층 번호와 이름은?",
        "answers": [
          "3계층 네트워크",
          "3계층",
          "네트워크 계층",
          "network layer",
          "L3"
        ],
        "hint": "IP 주소가 이 계층의 대표 식별자입니다.",
        "summary": "OSI 3계층(네트워크 계층)은 경로 선택·논리 주소(IP)를 다룹니다. TCP/UDP는 4계층(전송), HTTP는 7계층(응용)에 해당합니다.",
        "explanation": "라우터는 주로 3계층 장비입니다. 2계층은 MAC·스위칭, 4계층은 포트·신뢰성(또는 비신뢰성) 전송을 담당합니다.",
        "itemType": "choice",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "7계층 응용",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "4계층 전송",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "2계층 데이터링크",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "3계층 네트워크",
            "isCorrect": true,
            "rationale": "OSI 3계층(네트워크 계층)은 경로 선택·논리 주소(IP)를 다룹니다. TCP/UDP는 4계층(전송), HTTP는 7계층(응용)에 해당합니다."
          }
        ]
      },
      {
        "id": "net-002",
        "section": "03 네트워크 실무",
        "question": "웹 브라우저와 서버가 HTML을 주고받을 때 기본으로 쓰는 응용 계층 프로토콜 약자는?",
        "answers": [
          "HTTP",
          "http"
        ],
        "hint": "HyperText Transfer Protocol의 약자입니다.",
        "summary": "HTTP는 요청-응답 모델의 응용 계층 프로토콜입니다. HTTPS는 TLS로 암호화한 HTTP입니다. FTP는 파일 전송용입니다.",
        "explanation": "80번 포트(HTTP), 443번 포트(HTTPS)가 대표적입니다. 상태 코드 200은 성공, 404는 리소스 없음을 의미합니다.",
        "itemType": "choice",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "FTP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "SMTP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "HTTP",
            "isCorrect": true,
            "rationale": "HTTP는 요청-응답 모델의 응용 계층 프로토콜입니다. HTTPS는 TLS로 암호화한 HTTP입니다. FTP는 파일 전송용입니다."
          },
          {
            "text": "SSH",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          }
        ]
      },
      {
        "id": "net-003",
        "section": "02 핵심 운영체제·네트워크 기초",
        "question": "도메인 이름(예: google.com)을 IP 주소로 바꿔주는 시스템의 약자는?",
        "answers": [
          "DNS",
          "dns"
        ],
        "hint": "Domain Name System의 약자입니다.",
        "summary": "DNS는 분산된 이름 해석 시스템입니다. 브라우저 → DNS 조회 → IP 획득 → TCP 연결 → HTTP 요청 순으로 통신이 이어집니다.",
        "explanation": "DHCP는 IP 할당, NAT는 사설 IP를 공인 IP로 변환, ARP는 IP→MAC 매핑에 사용됩니다.",
        "itemType": "choice",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "ARP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "NAT",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "DHCP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "DNS",
            "isCorrect": true,
            "rationale": "DNS는 분산된 이름 해석 시스템입니다. 브라우저 → DNS 조회 → IP 획득 → TCP 연결 → HTTP 요청 순으로 통신이 이어집니다."
          }
        ]
      },
      {
        "id": "net-004",
        "section": "03 네트워크·HTTP",
        "itemType": "choice",
        "question": "OSI 7계층 중 전송 계층(4계층)에서 신뢰성 없이 빠르게 보내는 프로토콜은?",
        "answers": [
          "UDP",
          "udp"
        ],
        "hint": "TCP의 반대. 영상·게임·DNS에 활용.",
        "summary": "TCP 연결 지향 / UDP 비연결. 둘 다 4계층(전송).",
        "explanation": "인터넷과 HTTP 강의: TCP/IP 전송 계층.",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "ARP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "TCP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "ICMP",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "UDP",
            "isCorrect": true,
            "rationale": "TCP 연결 지향 / UDP 비연결. 둘 다 4계층(전송)."
          }
        ]
      },
      {
        "id": "net-005",
        "section": "03 네트워크·HTTP",
        "itemType": "choice",
        "question": "HTTPS에서 사용하는 기본 포트 번호는?",
        "answers": [
          "443",
          "443번"
        ],
        "hint": "HTTP는 80번.",
        "summary": "HTTP 80 / HTTPS 443 / SSH 22 / FTP 21.",
        "explanation": "TLS로 암호화된 HTTP 통신.",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "80",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "3306",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "443",
            "isCorrect": true,
            "rationale": "HTTP 80 / HTTPS 443 / SSH 22 / FTP 21."
          },
          {
            "text": "22",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          }
        ]
      },
      {
        "id": "net-006",
        "section": "02 리눅스·운영체제",
        "itemType": "choice",
        "question": "리눅스 커널과 사용자 사이에서 명령을 해석하는 프로그램은?",
        "answers": [
          "셸",
          "shell",
          "Shell",
          "bash"
        ],
        "hint": "Bourne Again Shell이 리눅스 기본.",
        "summary": "Shell → Kernel → Hardware 구조. bash가 기본 셸.",
        "explanation": "리눅스의 세계로 강의: Shell 개념.",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "커널",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "셸",
            "isCorrect": true,
            "rationale": "Shell → Kernel → Hardware 구조. bash가 기본 셸."
          },
          {
            "text": "드라이버",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "BIOS",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          }
        ]
      },
      {
        "id": "net-007",
        "section": "03 네트워크·HTTP",
        "itemType": "choice",
        "question": "HTTP 301 Moved Permanently의 의미는?",
        "choicePrompt": "3xx 리다이렉션 코드",
        "options": [
          {
            "text": "요청한 페이지가 새 URL로 영구 이동했다",
            "isCorrect": true,
            "rationale": "검색엔진이 새 URL로 인덱싱을 옮깁니다."
          },
          {
            "text": "요청이 성공했다",
            "isCorrect": false,
            "rationale": "200번대입니다."
          },
          {
            "text": "인증이 필요하다",
            "isCorrect": false,
            "rationale": "401 Unauthorized 등입니다."
          },
          {
            "text": "서버 내부 오류가 발생했다",
            "isCorrect": false,
            "rationale": "5xx 계열입니다."
          }
        ],
        "summary": "301 영구 / 302·307 일시 리다이렉션.",
        "explanation": "상태코드 I·II 강의 내용."
      },
      {
        "id": "net-008",
        "section": "01 IT 리터러시",
        "itemType": "choice",
        "question": "컴퓨터가 이해하는 0과 1의 최소 정보 단위는?",
        "answers": [
          "비트",
          "bit",
          "Bit"
        ],
        "hint": "8개가 모이면 바이트(byte).",
        "summary": "비트(bit) → 바이트(byte) → KB/MB/GB. 데이터는 결국 이진수로 저장·처리됩니다.",
        "explanation": "IT 리터러시·컴퓨터의 이해 단원.",
        "choicePrompt": "보기 중 올바른 답을 고르세요.",
        "options": [
          {
            "text": "비트",
            "isCorrect": true,
            "rationale": "비트(bit) → 바이트(byte) → KB/MB/GB. 데이터는 결국 이진수로 저장·처리됩니다."
          },
          {
            "text": "니블",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "워드",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          },
          {
            "text": "바이트",
            "isCorrect": false,
            "rationale": "이 보기는 정답이 아닙니다."
          }
        ]
      }
    ]
  }
});
