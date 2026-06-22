# -*- coding: utf-8 -*-
"""matplotlib 실습 정답(referenceCode) 로컬 실행·데이터 일치 검증."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.font_manager as fm
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "fonts" / "NanumGothic-Regular.ttf"
OUT_DIR = ROOT / "tools" / "viz_verify_out"
DATA_JS = ROOT / "js" / "py-datasets.js"


def setup_korean_font() -> None:
    if not FONT.is_file():
        raise FileNotFoundError(f"한글 폰트 없음: {FONT}")
    fm.fontManager.addfont(str(FONT))
    plt.rcParams["font.family"] = "NanumGothic"
    plt.rcParams["axes.unicode_minus"] = False


def load_py_datasets() -> dict:
    text = DATA_JS.read_text(encoding="utf-8")
    payload = text.split("=", 1)[1].strip().rstrip(";")
    return json.loads(payload)


def mount_csv(name: str, datasets: dict, tmp: Path) -> Path:
    ds = datasets[name]
    path = tmp / ds["file"]
    path.write_text(ds["csv"].strip() + "\n", encoding="utf-8")
    return path


def iter_viz_items():
    for fp in (ROOT / "data" / "basic-ai-course.json", ROOT / "data" / "coding-test-prep.json"):
        data = json.loads(fp.read_text(encoding="utf-8"))
        for item in data["items"]:
            ref = item.get("referenceCode") or ""
            if "matplotlib" in ref and "plt.show" in ref:
                yield fp.name, item


def verify_viz02(datasets: dict, tmp: Path) -> list[str]:
    issues = []
    csv_path = mount_csv("seoul_park03", datasets, tmp)
    df = pd.read_csv(csv_path)
    if len(df) != 18:
        issues.append(f"seoul_park03 행 수 {len(df)} (기대 18)")
    x, y = df["어른"], df["청소년"]
    if x.min() != 750 or x.max() != 8000:
        issues.append(f"어른 범위 {x.min()}~{x.max()} (기대 750~8000)")
    if y.min() != 180 or y.max() != 1500:
        issues.append(f"청소년 범위 {y.min()}~{y.max()} (기대 180~1500)")
    return issues


def run_reference(item: dict, datasets: dict, tmp: Path) -> tuple[bool, str]:
    code = item.get("referenceCode", "")
    setup = item.get("setupCode", "")
    ns: dict = {"__builtins__": __builtins__}
    for name in item.get("datasets") or []:
        mount_csv(name, datasets, tmp)
    # Pyodide 경로와 동일하게 /data 마운트
    data_root = tmp
    patched = code.replace("/data/", str(data_root).replace("\\", "/") + "/")
    patched_setup = setup.replace("/data/", str(data_root).replace("\\", "/") + "/")
    try:
        if patched_setup.strip():
            exec(patched_setup, ns)
        exec(
            "import matplotlib.pyplot as plt\n"
            + patched,
            ns,
        )
    except Exception as exc:
        return False, str(exc)
    fig = plt.gcf()
    if not fig.get_axes():
        return False, "그래프 축 없음"
    ax = fig.axes[0]
    out = OUT_DIR / f"{item['id']}.png"
    fig.savefig(out, dpi=100, bbox_inches="tight")
    plt.close(fig)
    return True, str(out.name)


def main() -> int:
    setup_korean_font()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    datasets = load_py_datasets()
    tmp = OUT_DIR / "data"
    tmp.mkdir(exist_ok=True)

    failed = 0
    for src, item in iter_viz_items():
        iid = item["id"]
        extra = verify_viz02(datasets, tmp) if iid in ("viz-02", "ct-viz-02") else []
        ok, msg = run_reference(item, datasets, tmp)
        status = "OK" if ok and not extra else "FAIL"
        if not ok or extra:
            failed += 1
        print(f"[{status}] {iid} ({src})")
        if not ok:
            print(f"  실행 오류: {msg}")
        for line in extra:
            print(f"  데이터: {line}")
        if ok and not extra:
            print(f"  저장: tools/viz_verify_out/{iid}.png")

    print(f"\n총 {failed}건 실패" if failed else "\n모든 시각화 정답 검증 통과")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
