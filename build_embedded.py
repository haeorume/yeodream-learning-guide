# -*- coding: utf-8 -*-
import json
from pathlib import Path

root = Path(__file__).resolve().parent
data_dir = root / "data"
js_dir = root / "js"

DECK_IDS = ["basic-ai-course", "coding-test-prep", "basic-course", "june-review"]


def embed_deck(deck_id: str) -> None:
    path = data_dir / f"{deck_id}.json"
    if not path.exists():
        print(f"skip {deck_id}: {path} not found")
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    out = js_dir / f"{deck_id}-embedded.js"
    out.write_text(
        "window.EMBEDDED_DECK_DATA = window.EMBEDDED_DECK_DATA || {};\n"
        f'window.EMBEDDED_DECK_DATA["{deck_id}"] = {payload};\n',
        encoding="utf-8",
    )
    print(f"written {out} ({out.stat().st_size} bytes, {len(data['items'])} items)")


def main():
    for deck_id in DECK_IDS:
        embed_deck(deck_id)


if __name__ == "__main__":
    main()
