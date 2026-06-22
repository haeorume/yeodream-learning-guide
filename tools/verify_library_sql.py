# -*- coding: utf-8 -*-
"""library 스키마 + 대표 SQL 문항 채점 스모크 테스트."""
import json
import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PREP = ROOT / "data" / "coding-test-prep.json"

LIBRARY_DDL = """
DROP TABLE IF EXISTS book;
CREATE TABLE book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  publisher TEXT,
  date_received TEXT
);
INSERT INTO book VALUES
  (1, '돈키호테', '미겔 데 세르반테스', '엘리스출판', '2010-01-01'),
  (2, '어린왕자', '생텍쥐페리', '엘리스출판', '2011-02-01'),
  (3, '해리포터', 'J.K. 롤링', '문학수첩', '2012-03-01'),
  (4, '데미안', '헤르만 헤세', '민음사', '2013-04-01'),
  (5, '죄와 벌', '표도르 도스토옙스키', '엘리스출판', '2014-05-01'),
  (6, '1984', '조지 오웰', '문학수첩', '2015-06-01');
"""


def run_sql(conn, sql):
    cur = conn.cursor()
    cur.execute(sql)
    try:
        rows = cur.fetchall()
        return len(rows), rows[:3]
    except sqlite3.ProgrammingError:
        return 0, []


def main():
    data = json.loads(PREP.read_text(encoding="utf-8"))
    targets = [
        i for i in data["items"]
        if i.get("sandbox") == "library" and i.get("referenceSql")
    ][:6]

    conn = sqlite3.connect(":memory:")
    conn.executescript(LIBRARY_DDL)

    ok = 0
    for item in targets:
        conn.executescript(LIBRARY_DDL)
        ref = item["referenceSql"].strip().rstrip(";")
        for stmt in [s.strip() for s in ref.split(";") if s.strip()]:
            n, _ = run_sql(conn, stmt)
        min_rows = (item.get("validate") or {}).get("minRows", 1)
        if n >= min_rows or min_rows == 0:
            ok += 1
            print(f"OK  {item['id']}: {n} rows")
        else:
            print(f"FAIL {item['id']}: expected>={min_rows} got {n}")

    print(f"passed {ok}/{len(targets)}")


if __name__ == "__main__":
    main()
