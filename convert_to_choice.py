# -*- coding: utf-8 -*-
"""typing/recall 문항 → choice(선택형) 변환. sql/python 실습만 유지."""
import json
import random
import re
from pathlib import Path

DATA = Path(__file__).parent / "data"
DECKS = ["june-review.json", "basic-course.json", "it-network.json", "sql-dml.json"]

# 정답 키(소문자) → 오답 보기 후보
DISTRACTOR_MAP = {
    "def": ["class", "lambda", "import"],
    "items[0]": ["items[1]", "items[-1]", "items(0)"],
    "user['name']": ["user.name", "user(name)", "name(user)"],
    "user.get('name')": ["user['name']", "user.name", "get(user)"],
    "range": ["enumerate", "len", "list"],
    "else": ["elif", "except", "finally"],
    "n**2": ["n*2", "n^2", "pow(n)"],
    "try except": ["try finally", "if except", "catch except"],
    "lambda": ["def", "map", "filter"],
    "tuple": ["list", "set", "dict"],
    "{name}": ["$name", "%name", "name"],
    "pd": ["np", "df", "pandas"],
    "dataframe": ["Series", "ndarray", "Matrix"],
    "read_csv": ["read_excel", "read_json", "load_csv"],
    "numpy": ["pandas", "scipy", "math"],
    "install": ["uninstall", "download", "get"],
    "llm": ["GPT", "API", "RAG"],
    "token": ["byte", "word", "character"],
    "prompt": ["response", "context", "embedding"],
    "hallucination": ["overfitting", "tokenization", "fine-tuning"],
    "transformer": ["RNN", "CNN", "LSTM"],
    "select": ["FROM", "INSERT", "UPDATE"],
    "insert into": ["ADD TO", "INSERT SET", "CREATE INTO"],
    "where": ["HAVING", "ON", "GROUP BY"],
    "update": ["INSERT", "ALTER", "MODIFY"],
    "delete from": ["DROP TABLE", "REMOVE FROM", "TRUNCATE TABLE"],
    "count": ["SUM", "AVG", "MAX"],
    "group by": ["ORDER BY", "HAVING", "PARTITION BY"],
    "having": ["WHERE", "ON", "LIMIT"],
    "서브쿼리": ["조인", "인덱스", "트리거"],
    "in": ["EXISTS", "ANY", "BETWEEN"],
    "union": ["JOIN", "MERGE", "CONCAT"],
    "union all": ["UNION", "INTERSECT", "EXCEPT"],
    "intersect": ["UNION", "EXCEPT", "JOIN"],
    "except": ["UNION", "INTERSECT", "MINUS"],
    "with recursive": ["CONNECT BY", "LOOP JOIN", "RECURSE"],
    "inner join": ["CROSS JOIN", "OUTER ONLY", "MERGE"],
    "left join": ["RIGHT JOIN", "INNER ONLY", "CROSS JOIN"],
    "on": ["WHERE", "HAVING", "USING"],
    "상관 서브쿼리": ["스칼라 서브쿼리", "인라인 뷰", "CTE"],
    "exists": ["IN", "ANY", "LIKE"],
    "over": ["GROUP BY", "ORDER BY", "PARTITION"],
    "partition by": ["GROUP BY", "ORDER BY", "HAVING"],
    "unbounded": ["CURRENT", "FOLLOWING", "PRECEDING ONLY"],
    "rollup": ["CUBE", "PIVOT", "UNPIVOT"],
    "rank": ["ROW_NUMBER", "DENSE_RANK", "NTILE"],
    "limit": ["TOP", "FETCH", "OFFSET"],
    "distinct": ["UNIQUE", "GROUP BY", "ONLY"],
    "any": ["ALL", "IN", "EXISTS"],
    "cross join": ["INNER JOIN", "NATURAL JOIN", "LEFT JOIN"],
    "using": ["ON", "WHERE", "NATURAL"],
    "스칼라 서브쿼리": ["다중행 서브쿼리", "상관 서브쿼리", "인라인 뷰"],
    "dense_rank": ["RANK", "ROW_NUMBER", "NTILE"],
    "lag lead": ["RANK DENSE_RANK", "FIRST LAST", "LEAD LAG"],
    "groupby": ["pivot", "merge", "apply"],
    "카티션 곱": ["INNER JOIN", "UNION", "INTERSECT"],
    "rest": ["SOAP", "GraphQL", "RPC"],
    "라이브러리": ["프레임워크", "프로토콜", "운영체제"],
    "library": ["framework", "protocol", "compiler"],
    "seo": ["SEM", "API", "CDN"],
    "테이블": ["인덱스", "뷰", "스키마"],
    "table": ["index", "view", "schema"],
    "프로세스": ["스레드", "잡", "데몬"],
    "process": ["thread", "job", "daemon"],
    "ps": ["top", "kill", "jobs"],
    "9": ["15", "1", "0"],
    "cron": ["at", "batch", "systemd"],
    "crontab": ["atq", "batch", "timer"],
    "ssh": ["telnet", "ftp", "http"],
    "install": ["remove", "purge", "update"],
    "pwd": ["cd", "ls", "whoami"],
    "3계층 네트워크": ["2계층 데이터링크", "4계층 전송", "7계층 응용"],
    "internet layer": ["transport layer", "application layer", "physical layer"],
    "tcp": ["UDP", "HTTP", "IP"],
    "post": ["GET", "PUT", "PATCH"],
    "200": ["404", "500", "301"],
    "404": ["200", "403", "500"],
    "인트라넷": ["인터넷", "엑스트라넷", "VPN"],
    "intranet": ["internet", "extranet", "localhost"],
    "protocol": ["algorithm", "library", "framework"],
    "프로토콜": ["알고리즘", "라이브러리", "프레임워크"],
    "input": ["print", "open", "read"],
    "input()": ["print()", "scan()", "read()"],
    "//": ["/", "%", "**"],
    "2:5": ["2-5", "2,5", "5:2"],
    "streamlit": ["flask", "django", "gradio"],
    "udp": ["TCP", "ICMP", "ARP"],
    "443": ["80", "22", "3306"],
    "셸": ["커널", "드라이버", "BIOS"],
    "shell": ["kernel", "driver", "firmware"],
    "bash": ["python", "java", "gcc"],
    "비트": ["바이트", "워드", "니블"],
    "bit": ["byte", "word", "nibble"],
    "dns": ["DHCP", "ARP", "NAT"],
    "http": ["FTP", "SMTP", "SSH"],
    "3계층": ["2계층", "4계층", "7계층"],
    "network layer": ["transport layer", "data link layer", "application layer"],
    "l3": ["L2", "L4", "L7"],
    "desc": ["ASC", "SORT", "RANK"],
}

GENERIC_POOL = [
    "HAVING", "ON", "GROUP BY", "ORDER BY", "INSERT", "DELETE", "UPDATE",
    "JOIN", "LIMIT", "DISTINCT", "프레임워크", "라이브러리", "프로토콜",
    "TCP", "UDP", "HTTP", "HTTPS", "WHERE", "SELECT", "EXISTS", "IN",
    "def", "class", "lambda", "list", "tuple", "dict", "range",
    "인터넷", "인트라넷", "DNS", "SSH", "404", "200",
]


def norm_key(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).strip().lower())


def pick_distractors(correct: str, item: dict, all_answers: set, count: int = 3) -> list:
    key = norm_key(correct)
    pool = list(DISTRACTOR_MAP.get(key, []))
    for alt in item.get("answers", [])[1:]:
        a = str(alt).strip()
        if a and norm_key(a) != key:
            pool.append(a)
    for a in all_answers:
        if norm_key(a) != key and a not in pool:
            pool.append(a)
    for g in GENERIC_POOL:
        if norm_key(g) != key and g not in pool:
            pool.append(g)
    pool = [p for p in pool if norm_key(p) != key][:count]
    while len(pool) < count:
        pool.append(f"보기 {len(pool) + 1}")
    return pool[:count]


def ensure_options(item: dict, all_answers: set) -> list:
    if item.get("options") and all("isCorrect" in o for o in item["options"]):
        opts = list(item["options"])
        correct_texts = {norm_key(o["text"]) for o in opts if o.get("isCorrect")}
        answers = item.get("answers") or []
        primary = str(answers[0]) if answers else None
        if primary and not any(norm_key(primary) == norm_key(o["text"]) for o in opts if o.get("isCorrect")):
            opts.insert(0, {"text": primary, "isCorrect": True, "rationale": "정답입니다."})
        seen = set()
        unique = []
        for o in opts:
            k = norm_key(o["text"])
            if k in seen:
                continue
            seen.add(k)
            unique.append(o)
        while len(unique) < 4:
            wrong = pick_distractors(
                next((o["text"] for o in unique if o.get("isCorrect")), answers[0] if answers else ""),
                item,
                all_answers,
                1,
            )[0]
            if norm_key(wrong) not in seen:
                unique.append({"text": wrong, "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."})
                seen.add(norm_key(wrong))
            else:
                break
        return unique

    answers = item.get("answers") or ["(정답 없음)"]
    correct = str(answers[0])
    wrongs = pick_distractors(correct, item, all_answers, 3)
    options = [{"text": correct, "isCorrect": True, "rationale": item.get("summary", "정답입니다.")[:120]}]
    for w in wrongs:
        options.append({"text": w, "isCorrect": False, "rationale": "이 보기는 정답이 아닙니다."})
    return options


def convert_item(item: dict, all_answers: set) -> dict:
    it = item.get("itemType", "")
    if it in ("sql", "python") or item.get("starterSql") or item.get("starterCode"):
        if not it:
            item["itemType"] = "sql" if item.get("starterSql") else "python"
        return item

    item["itemType"] = "choice"
    if not item.get("choicePrompt"):
        if item.get("code"):
            item["choicePrompt"] = "빈칸에 들어갈 올바른 답을 고르세요."
        else:
            item["choicePrompt"] = "보기 중 올바른 답을 고르세요."

    rng = random.Random(hash(item.get("id", "")) & 0xFFFFFFFF)
    options = ensure_options(item, all_answers)
    rng.shuffle(options)
    item["options"] = options
    return item


def convert_deck(path: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    all_answers = set()
    for it in data["items"]:
        for a in it.get("answers") or []:
            all_answers.add(str(a))

    changed = 0
    for it in data["items"]:
        before = it.get("itemType")
        convert_item(it, all_answers)
        if before != it.get("itemType") or before == "typing":
            changed += 1

    desc = data["meta"].get("description", "")
    if "타이핑" in desc:
        data["meta"]["description"] = desc.replace("타이핑", "선택형·실습")
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    types = {}
    for it in data["items"]:
        t = it.get("itemType", "?")
        types[t] = types.get(t, 0) + 1
    print(f"{path.name}: {types} (converted ~{changed})")
    return changed


def main():
    for name in DECKS:
        convert_deck(DATA / name)


if __name__ == "__main__":
    main()
