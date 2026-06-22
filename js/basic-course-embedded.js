window.EMBEDDED_DECK_DATA = window.EMBEDDED_DECK_DATA || {};
window.EMBEDDED_DECK_DATA["basic-course"] = {
  "meta": {
    "id": "basic-course",
    "title": "공통기초 종합 (IT·리눅스·네트워크)",
    "description": "이어드림스쿨 6기 1~3주차 강의자료(PDF) 핵심 개념 복습"
  },
  "items": [
    {
      "id": "bc-it-01",
      "section": "01 IT 리터러시",
      "itemType": "choice",
      "question": "웹에서 서버와 데이터를 주고받을 때 자주 쓰는 아키텍처 스타일의 약자는? (Representational State Transfer)",
      "answers": [
        "REST",
        "REST API",
        "rest"
      ],
      "hint": "HTTP 메서드로 리소스를 다루는 API 설계 방식입니다.",
      "summary": "REST API는 URL로 리소스를 표현하고 GET/POST/PUT/DELETE로 조작합니다. JSON이 많이 쓰입니다.",
      "explanation": "데이터베이스 강의에서 REST API는 DB 데이터를 HTTP로 노출하는 패턴으로 소개됩니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "REST",
          "isCorrect": true,
          "rationale": "REST API는 URL로 리소스를 표현하고 GET/POST/PUT/DELETE로 조작합니다. JSON이 많이 쓰입니다."
        },
        {
          "text": "GraphQL",
          "isCorrect": false,
          "rationale": "GraphQL은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "RPC",
          "isCorrect": false,
          "rationale": "RPC은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "SOAP",
          "isCorrect": false,
          "rationale": "SOAP은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    },
    {
      "id": "bc-it-02",
      "section": "01 IT 리터러시",
      "itemType": "choice",
      "question": "내가 필요한 기능만 가져다 쓰는 재사용 코드 묶음을 무엇이라 부르나요?",
      "answers": [
        "라이브러리",
        "library",
        "Library"
      ],
      "hint": "프레임워크와 달리 흐름 제어는 내 코드가 합니다.",
      "summary": "라이브러리는 함수·클래스 모음(예: pandas, requests). 프레임워크는 앱 골격을 제공하고 내 코드가 그 안에서 동작합니다.",
      "explanation": "강의 비유: 라이브러리=도구 상자, 프레임워크=이미 짜인 요리 레시피 틀.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "프로토콜",
          "isCorrect": false,
          "rationale": "통신 규약·약속된 메시지 형식입니다."
        },
        {
          "text": "운영체제",
          "isCorrect": false,
          "rationale": "하드웨어 위에서 프로그램을 실행·관리하는 시스템 소프트웨어입니다."
        },
        {
          "text": "라이브러리",
          "isCorrect": true,
          "rationale": "라이브러리는 함수·클래스 모음(예: pandas, requests). 프레임워크는 앱 골격을 제공하고 내 코드가 그 안에서 동작합니다."
        },
        {
          "text": "프레임워크",
          "isCorrect": false,
          "rationale": "앱 골격과 흐름을 제공하고 개발자 코드가 그 안에서 동작합니다."
        }
      ]
    },
    {
      "id": "bc-it-02b",
      "section": "01 IT 리터러시",
      "itemType": "choice",
      "question": "애플리케이션의 전체 구조와 흐름을 정해 주고, 개발자가 그 안에 코드를 끼워 넣는 방식은?",
      "choicePrompt": "라이브러리와 구분되는 개념을 고르세요.",
      "options": [
        {
          "text": "운영체제",
          "isCorrect": false,
          "rationale": "하드웨어 위에서 프로그램을 실행하는 계층입니다."
        },
        {
          "text": "라이브러리",
          "isCorrect": false,
          "rationale": "필요할 때 호출하는 도구 모음입니다."
        },
        {
          "text": "프로토콜",
          "isCorrect": false,
          "rationale": "통신 규약·약속된 메시지 형식입니다."
        },
        {
          "text": "프레임워크",
          "isCorrect": true,
          "rationale": "제어의 역전(IoC)—프레임워크가 흐름을 주도합니다."
        }
      ],
      "summary": "Django, Flask, React 등은 프레임워크 예시입니다.",
      "explanation": "라이브러리는 내가 부르고, 프레임워크는 내 코드를 불러옵니다.",
      "hint": "핵심 개념을 떠올려 보세요. Django, Flask, React 등은 … 예시입니다."
    },
    {
      "id": "bc-it-03",
      "section": "01 IT 리터러시",
      "itemType": "choice",
      "question": "검색엔진 최적화의 영문 약자는?",
      "answers": [
        "SEO",
        "seo",
        "Search Engine Optimization"
      ],
      "hint": "Search Engine Optimization",
      "summary": "SEO는 검색 결과 상위 노출을 위한 기술·콘텐츠·구조 최적화입니다.",
      "explanation": "메타 태그, 시맨틱 HTML, 페이지 속도, 모바일 친화성 등이 요소입니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "API",
          "isCorrect": false,
          "rationale": "프로그램 간 데이터를 주고받는 인터페이스입니다."
        },
        {
          "text": "SEM",
          "isCorrect": false,
          "rationale": "검색 광고 마케팅(Search Engine Marketing)입니다."
        },
        {
          "text": "CDN",
          "isCorrect": false,
          "rationale": "콘텐츠를 지역별로 분산 캐시하는 네트워크입니다."
        },
        {
          "text": "SEO",
          "isCorrect": true,
          "rationale": "SEO는 검색 결과 상위 노출을 위한 기술·콘텐츠·구조 최적화입니다."
        }
      ]
    },
    {
      "id": "bc-it-04",
      "section": "01 IT 리터러시",
      "itemType": "choice",
      "question": "관계형 데이터베이스에서 행을 저장하는 단위(표)를 무엇이라 부르나요?",
      "answers": [
        "테이블",
        "table",
        "Table"
      ],
      "hint": "열(column)과 행(row)으로 구성됩니다.",
      "summary": "RDBMS는 테이블·행·열·키(PK/FK)로 데이터를 구조화합니다. SQL로 조회·수정합니다.",
      "explanation": "REST API는 보통 이러한 테이블 데이터를 JSON으로 반환합니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "뷰",
          "isCorrect": false,
          "rationale": "뷰은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "스키마",
          "isCorrect": false,
          "rationale": "스키마은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "테이블",
          "isCorrect": true,
          "rationale": "RDBMS는 테이블·행·열·키(PK/FK)로 데이터를 구조화합니다. SQL로 조회·수정합니다."
        },
        {
          "text": "인덱스",
          "isCorrect": false,
          "rationale": "인덱스은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    },
    {
      "id": "bc-os-01",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "리눅스에서 메모리에 적재되어 실행 중인 프로그램 단위는?",
      "answers": [
        "프로세스",
        "process",
        "Process"
      ],
      "hint": "실행 중인 프로그램을 식별하는 Process ID 번호를 떠올려 보세요.",
      "summary": "프로세스는 코드·데이터·힙·스택 영역을 갖습니다. PID 1은 init, 부모-자식 관계가 있습니다.",
      "explanation": "ps, kill, job 명령으로 프로세스를 확인·제어합니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "스레드",
          "isCorrect": false,
          "rationale": "프로세스 안에서 실행되는 더 작은 실행 단위입니다."
        },
        {
          "text": "데몬",
          "isCorrect": false,
          "rationale": "데몬은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "프로세스",
          "isCorrect": true,
          "rationale": "프로세스는 코드·데이터·힙·스택 영역을 갖습니다. PID 1은 init, 부모-자식 관계가 있습니다."
        },
        {
          "text": "잡",
          "isCorrect": false,
          "rationale": "잡은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    },
    {
      "id": "bc-os-02",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "실행 중인 프로세스 목록을 보는 리눅스 명령어는?",
      "answers": [
        "ps",
        "PS"
      ],
      "hint": "process status의 약자입니다. ps -ef, ps -aux 옵션이 자주 쓰입니다.",
      "summary": "ps -ef: 전체 프로세스 상세 / ps -aux: CPU·메모리 사용량 포함.",
      "explanation": "kill 명령은 PID를 지정해 프로세스를 종료합니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "ps",
          "isCorrect": true,
          "rationale": "ps -ef: 전체 프로세스 상세 / ps -aux: CPU·메모리 사용량 포함."
        },
        {
          "text": "top",
          "isCorrect": false,
          "rationale": "프로세스를 실시간 모니터링하는 명령입니다."
        },
        {
          "text": "jobs",
          "isCorrect": false,
          "rationale": "jobs은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "kill",
          "isCorrect": false,
          "rationale": "kill PID로 프로세스를 종료합니다."
        }
      ]
    },
    {
      "id": "bc-os-03",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "프로세스를 강제 종료할 때 kill 명령에 주는 시그널 번호는?",
      "code": "kill -____ PID",
      "answers": [
        "9",
        "-9"
      ],
      "hint": "SIGKILL. 정상 종료는 -15(SIGTERM)입니다.",
      "summary": "kill -9는 강제 종료, kill -15는 정상 종료 요청. kill -l로 시그널 목록 확인.",
      "explanation": "응답 없는 프로세스를 강제로 끝낼 때 -9를 사용합니다.",
      "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요.",
      "options": [
        {
          "text": "15",
          "isCorrect": false,
          "rationale": "kill -9는 강제 종료, kill -15는 정상 종료 요청."
        },
        {
          "text": "9",
          "isCorrect": true,
          "rationale": "kill -9는 강제 종료, kill -15는 정상 종료 요청. kill -l로 시그널 목록 확인."
        },
        {
          "text": "0",
          "isCorrect": false,
          "rationale": "0은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "1",
          "isCorrect": false,
          "rationale": "kill -9는 강제 종료, kill -15는 정상 종료 요청."
        }
      ]
    },
    {
      "id": "bc-os-04",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "지정된 시간에 주기적으로 명령을 실행하도록 예약하는 리눅스 도구는?",
      "answers": [
        "cron",
        "crontab",
        "Cron"
      ],
      "hint": "crontab -e 로 편집, crontab -l 로 목록 확인.",
      "summary": "crontab 형식: 분 시 일 월 요일 명령. at은 1회 예약, cron은 반복 예약.",
      "explanation": "crontab 형식: 분 시 일 월 요일 명령. at은 1회 예약, cron은 반복 예약.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "cron",
          "isCorrect": true,
          "rationale": "crontab 형식: 분 시 일 월 요일 명령. at은 1회 예약, cron은 반복 예약."
        },
        {
          "text": "systemd",
          "isCorrect": false,
          "rationale": "systemd은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "batch",
          "isCorrect": false,
          "rationale": "batch은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "at",
          "isCorrect": false,
          "rationale": "crontab 형식: 분 시 일 월 요일 명령."
        }
      ]
    },
    {
      "id": "bc-os-05",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "원격 서버에 암호화된 연결로 접속할 때 쓰는 프로토콜 약자는?",
      "answers": [
        "SSH",
        "ssh",
        "Secure Shell"
      ],
      "hint": "Telnet과 달리 통신이 암호화됩니다.",
      "summary": "ssh user@host 형태로 접속. openssh-server 패키지가 서버에 필요합니다.",
      "explanation": "Telnet은 평문 전송이라 비밀번호 노출 위험이 있습니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "http",
          "isCorrect": false,
          "rationale": "HTTP는 요청-응답 모델의 응용 계층 프로토콜입니다. HTTPS는 TLS로 암호화한 HTTP입니다. FTP는 파일 전송용입니다."
        },
        {
          "text": "telnet",
          "isCorrect": false,
          "rationale": "telnet은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "SSH",
          "isCorrect": true,
          "rationale": "ssh user@host 형태로 접속. openssh-server 패키지가 서버에 필요합니다."
        },
        {
          "text": "ftp",
          "isCorrect": false,
          "rationale": "파일 전송 프로토콜입니다."
        }
      ]
    },
    {
      "id": "bc-os-06",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "우분투에서 패키지를 설치할 때 쓰는 패키지 관리 명령은?",
      "code": "sudo apt ____ 패키지명",
      "answers": [
        "install",
        "apt install"
      ],
      "hint": "데비안 계열 .deb 패키지 관리자입니다.",
      "summary": "apt install, apt update, apt upgrade. 레드햇 계열은 yum/dnf.",
      "explanation": "openssh-server, python3 등을 apt로 설치합니다.",
      "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요.",
      "options": [
        {
          "text": "install",
          "isCorrect": true,
          "rationale": "apt install, apt update, apt upgrade. 레드햇 계열은 yum/dnf."
        },
        {
          "text": "remove",
          "isCorrect": false,
          "rationale": "apt에서 패키지를 제거하는 하위 명령입니다."
        },
        {
          "text": "purge",
          "isCorrect": false,
          "rationale": "설정 파일까지 삭제하며 패키지를 제거합니다."
        },
        {
          "text": "update",
          "isCorrect": false,
          "rationale": "UPDATE 테이블 SET col=값 [, col2=값2] WHERE 조건; WHERE 없으면 전체 행이 변경됩니다."
        }
      ]
    },
    {
      "id": "bc-os-07",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "리눅스에서 현재 작업 디렉터리 경로를 출력하는 명령어는?",
      "answers": [
        "pwd",
        "PWD"
      ],
      "hint": "print working directory",
      "summary": "pwd, ls, cd, whoami, passwd 등이 기초 명령입니다. Shell(bash)이 사용자와 커널 사이를 연결합니다.",
      "explanation": "CLI 환경에서 파일·디렉터리 탐색의 출발점입니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "pwd",
          "isCorrect": true,
          "rationale": "pwd, ls, cd, whoami, passwd 등이 기초 명령입니다. Shell(bash)이 사용자와 커널 사이를 연결합니다."
        },
        {
          "text": "ls",
          "isCorrect": false,
          "rationale": "디렉터리 목록을 출력합니다."
        },
        {
          "text": "cd",
          "isCorrect": false,
          "rationale": "cd change directory / ls 목록 / pwd 현재 경로."
        },
        {
          "text": "whoami",
          "isCorrect": false,
          "rationale": "pwd, ls, cd, whoami, passwd 등이 기초 명령입니다."
        }
      ]
    },
    {
      "id": "bc-os-08",
      "section": "02 리눅스·운영체제",
      "itemType": "choice",
      "question": "프로세스 메모리 구성 중 함수의 지역 변수·매개변수가 저장되는 영역은?",
      "choicePrompt": "스택 영역의 역할을 고르세요.",
      "options": [
        {
          "text": "스택 영역",
          "isCorrect": true,
          "rationale": "함수 호출 시 지역 변수·복귀 주소가 쌓입니다."
        },
        {
          "text": "코드 영역",
          "isCorrect": false,
          "rationale": "실행 가능한 프로그램 코드가 위치합니다."
        },
        {
          "text": "BSS 영역",
          "isCorrect": false,
          "rationale": "초기화되지 않은 전역·정적 변수 영역입니다."
        },
        {
          "text": "힙 영역",
          "isCorrect": false,
          "rationale": "동적 메모리 할당(malloc 등) 영역입니다."
        }
      ],
      "summary": "코드·데이터·BSS·힙·스택으로 프로세스 메모리가 구분됩니다.",
      "explanation": "코드·데이터·BSS·힙·스택으로 프로세스 메모리가 구분됩니다.",
      "hint": "핵심 개념을 떠올려 보세요. 코드·데이터·BSS·힙·스택으로 프로세스 메모리가 구분됩니다."
    },
    {
      "id": "bc-net-01",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "TCP/IP 모델에서 IP 주소·패킷 라우팅을 담당하는 계층은? (4계층 모델 기준)",
      "answers": [
        "인터넷 계층",
        "네트워크 계층",
        "internet layer",
        "3계층",
        "3계층 네트워크"
      ],
      "hint": "OSI 7계층의 3계층(네트워크)에 대응합니다.",
      "summary": "TCP/IP 4계층: 네트워크 액세스·인터넷·전송·응용. IP는 인터넷 계층, TCP/UDP는 전송 계층.",
      "explanation": "TCP/IP 4계층: 네트워크 액세스·인터넷·전송·응용. IP는 인터넷 계층, TCP/UDP는 전송 계층.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "3계층",
          "isCorrect": false,
          "rationale": "3계층은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "internet layer",
          "isCorrect": false,
          "rationale": "internet layer은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "인터넷 계층",
          "isCorrect": true,
          "rationale": "TCP/IP 4계층: 네트워크 액세스·인터넷·전송·응용. IP는 인터넷 계층, TCP/UDP는 전송 계층."
        },
        {
          "text": "네트워크 계층",
          "isCorrect": false,
          "rationale": "IP 라우팅이 이루어지는 OSI 3계층입니다."
        }
      ]
    },
    {
      "id": "bc-net-02",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "신뢰성 있는 연결 지향 전송을 제공하는 4계층 프로토콜은?",
      "answers": [
        "TCP",
        "tcp"
      ],
      "hint": "UDP와 대비됩니다. 재전송·흐름 제어가 있습니다.",
      "summary": "TCP: 연결 지향·신뢰성. UDP: 비연결·빠름(스트리밍·DNS 등). HTTP는 보통 TCP 위에서 동작.",
      "explanation": "TCP: 연결 지향·신뢰성. UDP: 비연결·빠름(스트리밍·DNS 등). HTTP는 보통 TCP 위에서 동작.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "HTTP",
          "isCorrect": false,
          "rationale": "HTTP는 요청-응답 모델의 응용 계층 프로토콜입니다. HTTPS는 TLS로 암호화한 HTTP입니다. FTP는 파일 전송용입니다."
        },
        {
          "text": "TCP",
          "isCorrect": true,
          "rationale": "TCP: 연결 지향·신뢰성. UDP: 비연결·빠름(스트리밍·DNS 등). HTTP는 보통 TCP 위에서 동작."
        },
        {
          "text": "UDP",
          "isCorrect": false,
          "rationale": "TCP 연결 지향 / UDP 비연결. 둘 다 4계층(전송)."
        },
        {
          "text": "IP",
          "isCorrect": false,
          "rationale": "IP은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    },
    {
      "id": "bc-net-03",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "HTTP에서 새 리소스를 등록할 때 쓰는 메서드는?",
      "answers": [
        "POST",
        "post"
      ],
      "hint": "CRUD 중 Create에 해당. GET은 조회, PUT은 수정, DELETE는 삭제.",
      "summary": "GET 조회 / POST 등록 / PUT 수정 / DELETE 삭제. REST API 설계의 기본.",
      "explanation": "HTTP는 무상태(stateless) 프로토콜입니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "GET",
          "isCorrect": false,
          "rationale": "GET 조회 / POST 생성 / PUT·PATCH 수정 / DELETE 삭제."
        },
        {
          "text": "PUT",
          "isCorrect": false,
          "rationale": "GET 조회 / POST 등록 / PUT 수정 / DELETE 삭제."
        },
        {
          "text": "PATCH",
          "isCorrect": false,
          "rationale": "GET 조회 / POST 생성 / PUT·PATCH 수정 / DELETE 삭제."
        },
        {
          "text": "POST",
          "isCorrect": true,
          "rationale": "GET 조회 / POST 등록 / PUT 수정 / DELETE 삭제. REST API 설계의 기본."
        }
      ]
    },
    {
      "id": "bc-net-04",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "HTTP 요청이 성공했을 때 서버가 돌려주는 대표 상태 코드는?",
      "answers": [
        "200",
        "200 OK",
        "OK"
      ],
      "hint": "2xx는 성공 응답입니다.",
      "summary": "200 OK 성공 / 201 Created 생성 / 301 Moved Permanently / 404 Not Found / 500 Internal Server Error.",
      "explanation": "상태 코드는 서버가 요청 처리 결과를 숫자로 알려줍니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "200",
          "isCorrect": true,
          "rationale": "200 OK 성공 / 201 Created 생성 / 301 Moved Permanently / 404 Not Found / 500 Internal Server Error."
        },
        {
          "text": "301",
          "isCorrect": false,
          "rationale": "리소스가 새 URL로 영구 이동했음을 뜻합니다."
        },
        {
          "text": "500",
          "isCorrect": false,
          "rationale": "서버 내부 오류를 뜻합니다."
        },
        {
          "text": "404",
          "isCorrect": false,
          "rationale": "404 Not Found / 403 Forbidden / 401 Unauthorized / 400 Bad Request."
        }
      ]
    },
    {
      "id": "bc-net-05",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "요청한 페이지를 찾을 수 없을 때의 HTTP 상태 코드는?",
      "answers": [
        "404",
        "404 Not Found"
      ],
      "hint": "4xx는 클라이언트 오류입니다.",
      "summary": "404 Not Found / 403 Forbidden / 401 Unauthorized / 400 Bad Request.",
      "explanation": "404 Not Found / 403 Forbidden / 401 Unauthorized / 400 Bad Request.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "200",
          "isCorrect": false,
          "rationale": "200 OK 성공 / 201 Created 생성 / 301 Moved Permanently / 404 Not Found / 500 Internal Server Error."
        },
        {
          "text": "404",
          "isCorrect": true,
          "rationale": "404 Not Found / 403 Forbidden / 401 Unauthorized / 400 Bad Request."
        },
        {
          "text": "403",
          "isCorrect": false,
          "rationale": "접근이 금지되었음을 뜻합니다."
        },
        {
          "text": "500",
          "isCorrect": false,
          "rationale": "서버 내부 오류를 뜻합니다."
        }
      ]
    },
    {
      "id": "bc-net-06",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "회사 내부 직원만 접근하는 사설 네트워크를 무엇이라 부르나요?",
      "answers": [
        "인트라넷",
        "intranet",
        "Intranet"
      ],
      "hint": "인터넷(공개)과 대비됩니다. Extra는 협력사·고객까지 허용.",
      "summary": "인트라넷=내부 전용 / 엑스트라넷=제한적 외부 허용 / 인터넷=전 세계 공개.",
      "explanation": "인트라넷=내부 전용 / 엑스트라넷=제한적 외부 허용 / 인터넷=전 세계 공개.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "VPN",
          "isCorrect": false,
          "rationale": "공용망 위에 암호화 터널을 만드는 가상 사설망입니다."
        },
        {
          "text": "인트라넷",
          "isCorrect": true,
          "rationale": "인트라넷=내부 전용 / 엑스트라넷=제한적 외부 허용 / 인터넷=전 세계 공개."
        },
        {
          "text": "인터넷",
          "isCorrect": false,
          "rationale": "전 세계를 연결하는 공용 네트워크입니다."
        },
        {
          "text": "엑스트라넷",
          "isCorrect": false,
          "rationale": "인트라넷=내부 전용 / 엑스트라넷=제한적 외부 허용 / 인터넷=전 세계 공개."
        }
      ]
    },
    {
      "id": "bc-net-07",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "통신에 필요한 형식·규칙·약속을 정의한 것을 영어로?",
      "answers": [
        "protocol",
        "Protocol",
        "프로토콜"
      ],
      "hint": "HTTP, TCP, IP 모두 이것입니다.",
      "summary": "프로토콜은 구문·의미·타이밍을 규정합니다. 캡슐화로 계층별 헤더가 붙습니다.",
      "explanation": "프로토콜은 구문·의미·타이밍을 규정합니다. 캡슐화로 계층별 헤더가 붙습니다.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "algorithm",
          "isCorrect": false,
          "rationale": "algorithm은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "library",
          "isCorrect": false,
          "rationale": "필요할 때 호출하는 도구 모음입니다."
        },
        {
          "text": "framework",
          "isCorrect": false,
          "rationale": "앱 흐름을 정해 주는 골격입니다."
        },
        {
          "text": "protocol",
          "isCorrect": true,
          "rationale": "프로토콜은 구문·의미·타이밍을 규정합니다. 캡슐화로 계층별 헤더가 붙습니다."
        }
      ]
    },
    {
      "id": "bc-net-08",
      "section": "03 네트워크·HTTP",
      "itemType": "choice",
      "question": "브라우저가 다른 출처(origin)의 리소스 요청을 제한하는 보안 정책 약자는?",
      "choicePrompt": "Cross-Origin Resource Sharing",
      "options": [
        {
          "text": "CORS",
          "isCorrect": true,
          "rationale": "서버가 Access-Control-Allow-Origin 등으로 허용할 수 있습니다."
        },
        {
          "text": "NAT",
          "isCorrect": false,
          "rationale": "사설 IP를 공인 IP로 변환합니다."
        },
        {
          "text": "SSL",
          "isCorrect": false,
          "rationale": "암호화 통신 기술입니다."
        },
        {
          "text": "DNS",
          "isCorrect": false,
          "rationale": "도메인 이름 해석 시스템입니다."
        }
      ],
      "summary": "프론트엔드에서 API 호출 시 CORS 오류를 자주 만납니다.",
      "explanation": "프론트엔드에서 API 호출 시 CORS 오류를 자주 만납니다.",
      "hint": "괄호 안 영문 풀네임의 약자를 생각해 보세요."
    },
    {
      "id": "bc-py-01",
      "section": "04 파이썬 기초 문법",
      "itemType": "choice",
      "question": "터미널에서 사용자 입력을 받는 파이썬 내장 함수는?",
      "code": "name = ____(\"이름을 입력하세요: \")",
      "answers": [
        "input",
        "input()"
      ],
      "hint": "print의 반대—컴퓨터가 사용자에게서 값을 받습니다.",
      "summary": "input()은 항상 문자열을 반환합니다. int(input())으로 숫자 변환이 필요할 수 있습니다.",
      "explanation": "input()은 항상 문자열을 반환합니다. int(input())으로 숫자 변환이 필요할 수 있습니다.",
      "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요.",
      "options": [
        {
          "text": "open",
          "isCorrect": false,
          "rationale": "open은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "print",
          "isCorrect": false,
          "rationale": "print(값) 또는 print(a, b)로 여러 값 출력 가능."
        },
        {
          "text": "read",
          "isCorrect": false,
          "rationale": "read은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "input",
          "isCorrect": true,
          "rationale": "input()은 항상 문자열을 반환합니다. int(input())으로 숫자 변환이 필요할 수 있습니다."
        }
      ]
    },
    {
      "id": "bc-py-02",
      "section": "04 파이썬 기초 문법",
      "itemType": "choice",
      "question": "13을 5로 나눈 몫을 구하는 파이썬 연산자는?",
      "code": "print(13 ____ 5)  # 2",
      "answers": [
        "//"
      ],
      "hint": "일반 / 는 실수 나눗셈, 이 연산자는 정수 몫입니다.",
      "summary": "// 몫, % 나머지, ** 제곱. / 는 float 결과.",
      "explanation": "// 몫, % 나머지, ** 제곱. / 는 float 결과.",
      "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요.",
      "options": [
        {
          "text": "%",
          "isCorrect": false,
          "rationale": "// 몫, % 나머지, ** 제곱."
        },
        {
          "text": "/",
          "isCorrect": false,
          "rationale": "// 몫, % 나머지, ** 제곱."
        },
        {
          "text": "//",
          "isCorrect": true,
          "rationale": "// 몫, % 나머지, ** 제곱. / 는 float 결과."
        },
        {
          "text": "**",
          "isCorrect": false,
          "rationale": "// 몫, % 나머지, ** 제곱."
        }
      ]
    },
    {
      "id": "bc-py-03",
      "section": "04 파이썬 기초 문법",
      "itemType": "choice",
      "question": "리스트 beta에서 인덱스 2 이상 5 미만을 가져오는 슬라이싱 표현은?",
      "code": "beta = [2, 4, 6, 8, 10, 12, 14]\nprint(beta[____])  # [6, 8, 10]",
      "answers": [
        "2:5",
        "2 : 5"
      ],
      "hint": "시작:끝 형태, 끝 인덱스는 포함하지 않습니다.",
      "summary": "슬라이싱 [start:end:step]. 문자열에도 동일하게 적용됩니다.",
      "explanation": "슬라이싱 [start:end:step]. 문자열에도 동일하게 적용됩니다.",
      "choicePrompt": "빈칸에 들어갈 올바른 답을 고르세요.",
      "options": [
        {
          "text": "2:5",
          "isCorrect": true,
          "rationale": "슬라이싱 [start:end:step]. 문자열에도 동일하게 적용됩니다."
        },
        {
          "text": "2,5",
          "isCorrect": false,
          "rationale": "2,5은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "2-5",
          "isCorrect": false,
          "rationale": "2-5은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "5:2",
          "isCorrect": false,
          "rationale": "5:2은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    },
    {
      "id": "bc-ai-01",
      "section": "05 생성형 AI·Streamlit",
      "itemType": "choice",
      "question": "Python으로 웹 대시보드·앱 UI를 빠르게 만드는 라이브러리는?",
      "answers": [
        "Streamlit",
        "streamlit"
      ],
      "hint": "st.title(), st.write() 등으로 UI를 구성합니다.",
      "summary": "Streamlit은 데이터 분석 결과를 웹앱으로 공유할 때 유용합니다. 강의 08~09 단원.",
      "explanation": "Antigravity·Kaggle 데이터 분석 후 시각화·배포에 활용.",
      "choicePrompt": "보기 중 올바른 답을 고르세요.",
      "options": [
        {
          "text": "gradio",
          "isCorrect": false,
          "rationale": "gradio은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "Streamlit",
          "isCorrect": true,
          "rationale": "Streamlit은 데이터 분석 결과를 웹앱으로 공유할 때 유용합니다. 강의 08~09 단원."
        },
        {
          "text": "django",
          "isCorrect": false,
          "rationale": "django은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        },
        {
          "text": "flask",
          "isCorrect": false,
          "rationale": "flask은(는) 이 문항이 묻는 핵심과 다른 개념입니다."
        }
      ]
    }
  ]
};
