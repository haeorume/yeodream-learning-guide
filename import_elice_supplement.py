# -*- coding: utf-8 -*-
"""엘리스 스크린샷 기반 문항을 basic-ai-course.json에 병합"""
import json
import re
from pathlib import Path

from elice_new_items import all_new_items, DAY

DATA = Path(__file__).parent / "data" / "basic-ai-course.json"

# 기존 실습 문항 practiceGuide·starter 보강 (엘리스 형식)
PATCH_EXISTING = {
    "j0612-sql-01": {
        "practiceGuide": {
            "goal": "GYM_MEMBER 테이블에서 3대 운동 합계(WEIGHT_SUM)와 RANK() 순위를 구합니다. 동점은 같은 순위이고 다음 순위는 건너뜁니다.",
            "steps": [
                "MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT 출력",
                "(SQUAT+BENCH_PRESS+DEADLIFT) AS WEIGHT_SUM",
                "RANK() OVER (ORDER BY 합계 DESC) AS RANK",
                "WEIGHT_SUM 내림차순 정렬",
            ],
            "outputColumns": ["MEMBER_ID", "SQUAT", "BENCH_PRESS", "DEADLIFT", "WEIGHT_SUM", "RANK"],
            "tip": "지시사항 컬럼 순서를 정확히 맞추세요. 먼저 SELECT * 로 데이터를 확인하세요.",
        },
        "starterSql": """-- 테이블 데이터 확인
SELECT * FROM GYM_MEMBER;

-- 아래 쿼리를 완성하세요 (RANK 윈도우 함수)
SELECT MEMBER_ID,
       SQUAT,
       BENCH_PRESS,
       DEADLIFT
FROM GYM_MEMBER;""",
        "referenceSql": """SELECT MEMBER_ID, SQUAT, BENCH_PRESS, DEADLIFT,
       (SQUAT + BENCH_PRESS + DEADLIFT) AS WEIGHT_SUM,
       RANK() OVER (ORDER BY (SQUAT + BENCH_PRESS + DEADLIFT) DESC) AS RANK
FROM GYM_MEMBER
ORDER BY WEIGHT_SUM DESC;""",
    },
}


def norm_q(text):
    return re.sub(r"\s+", "", str(text or ""))[:60].lower()


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    existing_ids = {it["id"] for it in data["items"]}
    existing_q = {norm_q(it.get("question")) for it in data["items"]}

    added = 0
    skipped = 0
    patched = 0

    for item in data["items"]:
        patch = PATCH_EXISTING.get(item["id"])
        if patch:
            item.update(patch)
            patched += 1

    for item in all_new_items():
        nq = norm_q(item.get("question"))
        if item["id"] in existing_ids or nq in existing_q:
            skipped += 1
            continue
        data["items"].append(item)
        existing_ids.add(item["id"])
        existing_q.add(nq)
        added += 1

    # 섹션 순 정렬
    order = {s: i for i, s in enumerate(data["meta"]["sectionOrder"])}
    data["items"].sort(key=lambda x: (order.get(x.get("section", ""), 99), x.get("id", "")))

    data["meta"]["description"] = (
        "이어드림스쿨 6기 · 5/26~6/12 기본과정 (엘리스 스크린샷 기반 보강)"
    )

    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Patched {patched} | Added {added} | Skipped {skipped} | Total {len(data['items'])}")


if __name__ == "__main__":
    main()
