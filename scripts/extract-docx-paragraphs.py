#!/usr/bin/env python3
"""Extract numbered non-empty paragraphs from a DOCX without extra packages."""

from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree


WORD_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def extract_paragraphs(docx_path: Path) -> list[dict[str, object]]:
    with zipfile.ZipFile(docx_path) as archive:
        document_xml = archive.read("word/document.xml")

    root = ElementTree.fromstring(document_xml)
    paragraphs: list[dict[str, object]] = []
    for paragraph in root.iter(f"{WORD_NS}p"):
        text = "".join(node.text or "" for node in paragraph.iter(f"{WORD_NS}t"))
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        paragraphs.append({"number": len(paragraphs) + 1, "text": text})
    return paragraphs


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: extract-docx-paragraphs.py SOURCE.docx", file=sys.stderr)
        return 2
    source = Path(sys.argv[1]).expanduser().resolve()
    if not source.is_file():
        print(f"DOCX not found: {source}", file=sys.stderr)
        return 2
    json.dump(extract_paragraphs(source), sys.stdout, ensure_ascii=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
