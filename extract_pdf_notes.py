# -*- coding: utf-8 -*-
"""강의 PDF 텍스트 추출 → 요약 파일 생성"""
import os
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

ROOT = Path(r"c:\Users\haeorume\Desktop\이어드림스쿨6기 강의 정리")
OUT = Path(__file__).parent / "data" / "_pdf_extract.txt"


def extract_pdf(path: Path) -> str:
    if fitz is None:
        return ""
    doc = fitz.open(path)
    parts = []
    for page in doc:
        parts.append(page.get_text())
    doc.close()
    return "\n".join(parts).strip()


def main():
    lines = []
    pdfs = sorted(ROOT.rglob("*.pdf"))
    lines.append(f"TOTAL PDFs: {len(pdfs)}\n")
    for pdf in pdfs:
        rel = pdf.relative_to(ROOT)
        text = extract_pdf(pdf)
        lines.append("=" * 80)
        lines.append(str(rel))
        lines.append("-" * 40)
        # limit per file to keep manageable but capture key content
        snippet = text[:12000] if len(text) > 12000 else text
        lines.append(snippet)
        if len(text) > 12000:
            lines.append(f"\n... [truncated, total {len(text)} chars] ...")
        lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"written {OUT} ({OUT.stat().st_size} bytes) from {len(pdfs)} pdfs")


if __name__ == "__main__":
    main()
