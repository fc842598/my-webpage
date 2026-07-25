#!/usr/bin/env python3
"""Synchronize approved titles only in URL-bound cards, links, and feeds."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urldefrag


ARTICLE_CARD_RE = re.compile(
    r"<article\b(?=[^>]*\bclass=[\"'][^\"']*\barticle-card\b[^\"']*[\"'])[^>]*>.*?</article>",
    re.IGNORECASE | re.DOTALL,
)
CARD_LINK_RE = re.compile(
    r"<a\b(?=[^>]*\bclass=[\"'][^\"']*\bcard-link\b[^\"']*[\"'])[^>]*>",
    re.IGNORECASE | re.DOTALL,
)
ANCHOR_RE = re.compile(r"(?P<open><a\b[^>]*>)(?P<inner>.*?)(?P<close></a>)", re.IGNORECASE | re.DOTALL)
H3_RE = re.compile(r"(?P<open><h3\b[^>]*>)(?P<inner>.*?)(?P<close></h3>)", re.IGNORECASE | re.DOTALL)
P_RE = re.compile(r"(?P<open><p\b[^>]*>)(?P<inner>.*?)(?P<close></p>)", re.IGNORECASE | re.DOTALL)
ITEM_RE = re.compile(r"<item\b[^>]*>.*?</item>", re.IGNORECASE | re.DOTALL)
LINK_RE = re.compile(r"<link\b[^>]*>(?P<value>.*?)</link>", re.IGNORECASE | re.DOTALL)
TITLE_RE = re.compile(r"(?P<open><title\b[^>]*>)(?P<inner>.*?)(?P<close></title>)", re.IGNORECASE | re.DOTALL)
DESCRIPTION_RE = re.compile(
    r"(?P<open><description\b[^>]*>)(?P<inner>.*?)(?P<close></description>)",
    re.IGNORECASE | re.DOTALL,
)
HREF_RE = re.compile(r"\bhref\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
JSON_LD_RE = re.compile(
    r"(?P<open><script\b(?=[^>]*\btype=[\"']application/ld\+json[\"'])[^>]*>)"
    r"(?P<body>.*?)"
    r"(?P<close></script>)",
    re.IGNORECASE | re.DOTALL,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue", default="output/article-review/article-review-queue.json")
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def first_h1(blocks: list[dict]) -> str:
    return next((block.get("text", "") for block in blocks if block.get("type") == "H1"), "")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def blocks_hash(blocks: list[dict]) -> str:
    serialized = json.dumps(blocks, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def validated_final_blocks(row: dict) -> list[dict] | None:
    article_id = row.get("articleId", "")
    review = row.get("review", {})
    final = review.get("finalEditor") or {}
    if review.get("status") != "final_approved":
        return None
    if final.get("finalDecision") == "KEEP_ORIGINAL":
        return None
    if review.get("finalValidationErrors"):
        raise ValueError(f"{article_id}: final validation errors remain")
    blocks = final.get("finalBlocks") or []
    content_hash = blocks_hash(blocks)
    if content_hash != review.get("finalContentHash"):
        raise ValueError(f"{article_id}: final block hash mismatch")
    qa = review.get("finalQA") or {}
    if qa.get("status") != "PASS" or qa.get("finalContentHash") != content_hash:
        raise ValueError(f"{article_id}: final QA approval/hash mismatch")
    return blocks


def normalized(value: str) -> str:
    return " ".join(value.split())


def compact_description(blocks: list[dict], language: str) -> str:
    prose = [
        normalized(block.get("text", ""))
        for block in blocks
        if block.get("type") in {"LEAD", "P"}
    ]
    value = " ".join(prose[:2]).strip()
    limit = 155 if language == "en" else 120
    if len(value) <= limit:
        return value
    clipped = value[: limit + 1]
    if language == "en":
        clipped = clipped.rsplit(" ", 1)[0].rstrip(" ,;:")
        return clipped.rstrip(".!?") + "."
    stop = max(clipped.rfind(mark) for mark in "。！？；")
    if stop >= max(50, limit // 2):
        return clipped[: stop + 1]
    return clipped[:limit].rstrip("，、；：") + "…"


def tracked_content_files(root: Path) -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z", "--", "articles", "feed.xml"],
        cwd=root,
        capture_output=True,
        check=True,
    )
    paths = [Path(value.decode("utf-8")) for value in result.stdout.split(b"\0") if value]
    return sorted(root / path for path in paths if path.suffix.lower() in {".html", ".xml"})


def resolved_url(file_path: Path, root: Path, href: str) -> str:
    relative = file_path.relative_to(root).as_posix()
    base = f"https://yuetianai.com/{relative}"
    return urldefrag(urljoin(base, html.unescape(href.strip()))).url


def card_target(block: str, file_path: Path, root: Path, articles: dict[str, dict]) -> dict | None:
    links = list(CARD_LINK_RE.finditer(block))
    targets = []
    for link in links:
        href_match = HREF_RE.search(link.group(0))
        if not href_match:
            raise ValueError(f"card-link has no href in {file_path}")
        article = articles.get(resolved_url(file_path, root, href_match.group(2)))
        if article:
            targets.append(article)
    if len(targets) > 1:
        raise ValueError(f"article card has multiple approved article targets in {file_path}")
    return targets[0] if targets else None


def replace_element_text(block: str, pattern: re.Pattern, value: str) -> tuple[str, int]:
    matches = list(pattern.finditer(block))
    if not matches:
        return block, 0
    match = matches[0]
    current = normalized(html.unescape(TAG_RE.sub(" ", match.group("inner"))))
    if current == value:
        return block, 0
    updated = (
        block[: match.start("inner")]
        + html.escape(value, quote=False)
        + block[match.end("inner") :]
    )
    return updated, 1


def update_cards(text: str, file_path: Path, root: Path, articles: dict[str, dict]) -> tuple[str, int]:
    changes = 0

    def replace(match: re.Match) -> str:
        nonlocal changes
        block = match.group(0)
        article = card_target(block, file_path, root, articles)
        if not article:
            return block
        title_changes = 0
        if article["titleChanged"]:
            block, title_changes = replace_element_text(block, H3_RE, article["title"])
        block, description_changes = replace_element_text(block, P_RE, article["description"])
        changes += title_changes + description_changes
        return block

    return ARTICLE_CARD_RE.sub(replace, text), changes


def update_bound_anchors(text: str, file_path: Path, root: Path, articles: dict[str, dict]) -> tuple[str, int]:
    changes = 0

    def replace(match: re.Match) -> str:
        nonlocal changes
        href_match = HREF_RE.search(match.group("open"))
        if not href_match:
            return match.group(0)
        article = articles.get(resolved_url(file_path, root, href_match.group(2)))
        if not article or not article["titleChanged"]:
            return match.group(0)
        current = normalized(html.unescape(TAG_RE.sub(" ", match.group("inner"))))
        if current not in {article["oldTitle"], article["title"]} or current == article["title"]:
            return match.group(0)
        changes += 1
        return match.group("open") + html.escape(article["title"], quote=False) + match.group("close")

    return ANCHOR_RE.sub(replace, text), changes


def update_item_list_json(text: str, articles: dict[str, dict]) -> tuple[str, int]:
    changes = 0

    def update_value(value):
        nonlocal changes
        if isinstance(value, list):
            return [update_value(item) for item in value]
        if not isinstance(value, dict):
            return value
        updated = {key: update_value(item) for key, item in value.items()}
        item_type = updated.get("@type")
        if item_type != "ListItem":
            return updated
        target_url = updated.get("url") or updated.get("item")
        article = articles.get(target_url) if isinstance(target_url, str) else None
        if not article or not article["titleChanged"]:
            return updated
        current_name = updated.get("name")
        if current_name == article["oldTitle"]:
            updated["name"] = article["title"]
            changes += 1
        return updated

    def replace(match: re.Match) -> str:
        raw = match.group("body")
        payload = json.loads(raw)
        updated = update_value(payload)
        if updated == payload:
            return match.group(0)
        leading = raw[: len(raw) - len(raw.lstrip())]
        trailing = raw[len(raw.rstrip()) :]
        rendered = json.dumps(updated, ensure_ascii=False, indent=2)
        return match.group("open") + leading + rendered + trailing + match.group("close")

    return JSON_LD_RE.sub(replace, text), changes


def update_feed(text: str, articles: dict[str, dict]) -> tuple[str, int]:
    changes = 0

    def replace(match: re.Match) -> str:
        nonlocal changes
        block = match.group(0)
        link_match = LINK_RE.search(block)
        if not link_match:
            return block
        article = articles.get(html.unescape(normalized(link_match.group("value"))))
        if not article:
            return block
        title_changes = 0
        if article["titleChanged"]:
            block, title_changes = replace_element_text(block, TITLE_RE, article["title"])
        block, description_changes = replace_element_text(block, DESCRIPTION_RE, article["description"])
        changes += title_changes + description_changes
        return block

    return ITEM_RE.sub(replace, text), changes


def main() -> None:
    args = parse_args()
    root = Path(__file__).resolve().parents[1]
    payload = json.loads((root / args.queue).read_text(encoding="utf-8"))
    articles = {}
    for row in payload.get("articles", []):
        blocks = validated_final_blocks(row)
        if blocks is None:
            continue
        old_title = first_h1(row.get("original", {}).get("blocks", []))
        title = first_h1(blocks)
        if not old_title or not title:
            raise ValueError(f"{row.get('articleId', '')}: approved rewrite has no H1")
        language = "en" if row["articleId"].startswith("YT-EN-") else "zh-CN"
        if row["url"] in articles:
            raise ValueError(f"duplicate approved URL: {row['url']}")
        articles[row["url"]] = {
            "articleId": row["articleId"],
            "oldTitle": old_title,
            "title": title,
            "titleChanged": old_title != title,
            "description": compact_description(blocks, language),
        }

    prepared = []
    changes = 0
    for path in tracked_content_files(root):
        original = path.read_bytes()
        has_bom = original.startswith(b"\xef\xbb\xbf")
        text = original.decode("utf-8-sig")
        if path.suffix.lower() == ".xml":
            updated, file_changes = update_feed(text, articles)
        else:
            updated, card_changes = update_cards(text, path, root, articles)
            updated, anchor_changes = update_bound_anchors(updated, path, root, articles)
            updated, json_changes = update_item_list_json(updated, articles)
            file_changes = card_changes + anchor_changes + json_changes
        encoded = updated.encode("utf-8")
        if has_bom:
            encoded = b"\xef\xbb\xbf" + encoded
        if encoded != original:
            prepared.append((path, original, encoded, sha256_bytes(original)))
            changes += file_changes

    print(
        f"Validated {len(articles)} approved rewrites; "
        f"{changes} URL-bound fields across {len(prepared)} tracked files need synchronization."
    )
    if not args.apply:
        print("Dry run only; pass --apply to write files.")
        return
    for path, _original, _updated, original_hash in prepared:
        if sha256_bytes(path.read_bytes()) != original_hash:
            raise RuntimeError(f"file changed after validation: {path}")
    written = []
    temp_files = []
    try:
        for path, original, updated, _original_hash in prepared:
            temp = path.with_name(f".{path.name}.title-sync-tmp")
            temp.write_bytes(updated)
            temp_files.append((path, original, temp))
        for path, _original, _updated, original_hash in prepared:
            if sha256_bytes(path.read_bytes()) != original_hash:
                raise RuntimeError(f"file changed while staging transaction: {path}")
        for path, original, temp in temp_files:
            os.replace(temp, path)
            written.append((path, original))
    except Exception:
        for path, original in reversed(written):
            path.write_bytes(original)
        raise
    finally:
        for _path, _original, temp in temp_files:
            temp.unlink(missing_ok=True)
    print(f"Synchronized URL-bound title fields in {len(prepared)} files.")


if __name__ == "__main__":
    main()
