#!/usr/bin/env python3
"""Safely apply final-approved article body rewrites from the review queue."""

from __future__ import annotations

import argparse
import hashlib
import html as html_std
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote, urlparse

from lxml import html


ARTICLE_RE = re.compile(
    r"(?P<open>^(?P<indent>[ \t]*)<article\b(?=[^>]*\bid=[\"']article-start[\"'])[^>]*>)"
    r"(?P<inner>.*?)"
    r"(?P<close>^[ \t]*</article>)",
    re.IGNORECASE | re.MULTILINE | re.DOTALL,
)
ASIDE_RE = re.compile(
    r"(?P<open>^(?P<indent>[ \t]*)<aside\b(?=[^>]*\bclass=[\"'][^\"']*\bdetail-rail\b[^\"']*[\"'])[^>]*>)"
    r"(?P<inner>.*?)"
    r"(?P<close>^[ \t]*</aside>)",
    re.IGNORECASE | re.MULTILINE | re.DOTALL,
)
HEAD_RE = re.compile(r"<head\b[^>]*>.*?</head>", re.IGNORECASE | re.DOTALL)
TITLE_RE = re.compile(r"(<title\b[^>]*>)(.*?)(</title>)", re.IGNORECASE | re.DOTALL)
H1_RE = re.compile(r"(<h1\b[^>]*>)(.*?)(</h1>)", re.IGNORECASE | re.DOTALL)
SUBTITLE_RE = re.compile(
    r"(<p\b(?=[^>]*\bclass=[\"'][^\"']*\bdetail-subtitle\b[^\"']*[\"'])[^>]*>)"
    r"(.*?)"
    r"(</p>)",
    re.IGNORECASE | re.DOTALL,
)
META_TAG_RE = re.compile(r"<meta\b[^>]*>", re.IGNORECASE)
JSON_LD_RE = re.compile(
    r"(?P<open><script\b(?=[^>]*\btype=[\"']application/ld\+json[\"'])[^>]*>)"
    r"(?P<body>.*?)"
    r"(?P<close></script>)",
    re.IGNORECASE | re.DOTALL,
)
TAG_RE = re.compile(r"<[^>]+>")
HEADING_PREFIX_RE = re.compile(
    r"^\s*(?:第?[一二三四五六七八九十百]+[章节部分、.．：:]|[一二三四五六七八九十]+[、.．]|\d+[、.．：:]?)\s*"
)
MARKDOWN_HEADING_RE = re.compile(r"(^|\n)\s*#{1,6}\s")
SOURCE_TRACE_RE = re.compile(
    r"文稿|讲义|他说|天纪|倪海厦|source-extract|证据卡|原稿|改写稿|候选稿",
    re.IGNORECASE,
)
ALLOWED_BLOCKS = {"H1", "H2", "H3", "LEAD", "P", "QUOTE", "LIST"}
SAFE_LINK_ATTRS = ("href", "class", "target", "rel", "aria-label")


@dataclass(frozen=True)
class InlineLink:
    href: str
    text: str
    attrs: tuple[tuple[str, str], ...]


@dataclass
class PreparedFile:
    path: Path
    original_bytes: bytes
    updated_bytes: bytes
    original_hash: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--queue",
        default="output/article-review/article-review-queue.json",
        help="Review queue JSON relative to the repository root.",
    )
    parser.add_argument("--apply", action="store_true", help="Write validated changes.")
    parser.add_argument("--expected-approved", type=int, default=156)
    parser.add_argument("--expected-changed", type=int, default=137)
    return parser.parse_args()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def blocks_hash(blocks: list[dict]) -> str:
    serialized = json.dumps(blocks, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def normalized(value: str) -> str:
    return " ".join(value.split())


def attr_value(tag: str, name: str) -> str | None:
    match = re.search(
        rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1",
        tag,
        re.IGNORECASE | re.DOTALL,
    )
    return html_std.unescape(match.group(2)) if match else None


def replace_tag_attr(tag: str, name: str, value: str) -> str:
    pattern = re.compile(
        rf"(\b{re.escape(name)}\s*=\s*)([\"'])(.*?)\2",
        re.IGNORECASE | re.DOTALL,
    )
    escaped = html_std.escape(value, quote=True)
    if not pattern.search(tag):
        raise ValueError(f"tag has no {name!r} attribute")
    return pattern.sub(lambda match: f"{match.group(1)}{match.group(2)}{escaped}{match.group(2)}", tag, count=1)


def replace_meta(text: str, key: str, value: str, content: str, required: bool = True) -> str:
    found = 0

    def replace(match: re.Match) -> str:
        nonlocal found
        tag = match.group(0)
        if attr_value(tag, key) != value:
            return tag
        found += 1
        return replace_tag_attr(tag, "content", content)

    updated = META_TAG_RE.sub(replace, text)
    if required and found != 1:
        raise ValueError(f"expected one meta {key}={value!r}, found {found}")
    if not required and found > 1:
        raise ValueError(f"expected at most one meta {key}={value!r}, found {found}")
    return updated


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
    stops = [clipped.rfind(mark) for mark in "。！？；"]
    stop = max(stops)
    if stop >= max(50, limit // 2):
        return clipped[: stop + 1]
    return clipped[:limit].rstrip("，、；：") + "…"


def json_type_is(value, expected: str) -> bool:
    item_type = value.get("@type") if isinstance(value, dict) else None
    return item_type == expected or (isinstance(item_type, list) and expected in item_type)


def update_json_ld(
    text: str,
    headline: str | None,
    description: str,
    canonical_url: str,
) -> str:
    article_count = 0

    def update_value(value):
        nonlocal article_count
        if isinstance(value, list):
            return [update_value(item) for item in value]
        if not isinstance(value, dict):
            return value
        updated = {key: update_value(item) for key, item in value.items()}
        if json_type_is(updated, "Article"):
            if headline is not None:
                updated["headline"] = headline
            updated["description"] = description
            article_count += 1
        if headline is not None and json_type_is(updated, "BreadcrumbList"):
            items = updated.get("itemListElement")
            if isinstance(items, list) and items:
                last = items[-1]
                if isinstance(last, dict) and last.get("item") == canonical_url:
                    last["name"] = headline
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

    updated_text = JSON_LD_RE.sub(replace, text)
    if article_count != 1:
        raise ValueError(f"expected one Article JSON-LD object, found {article_count}")
    return updated_text


def locked_metadata(text: str) -> dict:
    document = html.fromstring(text)
    canonicals = document.xpath('//link[translate(@rel,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="canonical"]/@href')
    alternates = sorted(
        (node.get("hreflang", ""), node.get("href", ""))
        for node in document.xpath('//link[@rel="alternate"][@hreflang]')
    )
    datetimes = document.xpath('//*[@datetime]/@datetime')
    article_dates = []
    for script in document.xpath('//script[@type="application/ld+json"]'):
        payload = json.loads(script.text or "{}")
        values = payload if isinstance(payload, list) else [payload]
        for value in values:
            if json_type_is(value, "Article"):
                article_dates.append((value.get("datePublished"), value.get("dateModified")))
    return {
        "canonical": canonicals,
        "alternates": alternates,
        "datetimes": datetimes,
        "articleDates": article_dates,
    }


def compact_fingerprint_text(value: str) -> str:
    return re.sub(r"\s+", "", html_std.unescape(value))


def blocks_text_fingerprint(blocks: list[dict]) -> tuple[str, ...]:
    return tuple(compact_fingerprint_text(block.get("text", "")) for block in blocks)


def page_text_fingerprint(text: str) -> tuple[str, ...]:
    document = html.fromstring(text)
    h1s = document.xpath("//h1")
    articles = document.xpath('//*[@id="article-start"]')
    if len(h1s) != 1 or len(articles) != 1:
        raise ValueError("page identity requires exactly one H1 and one article-start")
    content_nodes = articles[0].xpath(
        "./h2|./h3|./p|./ul/li|./ol/li|./blockquote"
    )
    return tuple(
        [compact_fingerprint_text(h1s[0].text_content())]
        + [compact_fingerprint_text(node.text_content()) for node in content_nodes]
    )


def update_page_metadata(text: str, row: dict, blocks: list[dict]) -> str:
    headline = next(block["text"] for block in blocks if block.get("type") == "H1")
    original_headline = next(
        block["text"]
        for block in row.get("original", {}).get("blocks", [])
        if block.get("type") == "H1"
    )
    headline_changed = headline != original_headline
    language = "en" if row["articleId"].startswith("YT-EN-") else "zh-CN"
    description = compact_description(blocks, language)
    h1_match = one_match(H1_RE, text, f"page H1 in {row['sourceFile']}")
    updated = text
    if headline_changed:
        title_match = one_match(TITLE_RE, text, f"title in {row['sourceFile']}")
        current_title = html_std.unescape(normalized(TAG_RE.sub(" ", title_match.group(2))))
        old_og = None
        for meta_match in META_TAG_RE.finditer(text):
            tag = meta_match.group(0)
            if attr_value(tag, "property") == "og:title":
                old_og = attr_value(tag, "content")
                break
        if not old_og:
            raise ValueError(f"{row['articleId']}: missing og:title")
        suffix = current_title[len(old_og) :] if current_title.startswith(old_og) else ""
        if not suffix:
            suffix = " | Zi Wei Dou Shu" if language == "en" else " | 学习紫微"
        page_title = headline + suffix
        updated = text[: h1_match.start(2)] + html_std.escape(headline) + text[h1_match.end(2) :]
        title_match = one_match(TITLE_RE, updated, f"updated title in {row['sourceFile']}")
        updated = updated[: title_match.start(2)] + html_std.escape(page_title) + updated[title_match.end(2) :]
    subtitle_match = one_match(SUBTITLE_RE, updated, f"detail subtitle in {row['sourceFile']}")
    updated = (
        updated[: subtitle_match.start(2)]
        + html_std.escape(description)
        + updated[subtitle_match.end(2) :]
    )
    updated = replace_meta(updated, "name", "description", description)
    updated = replace_meta(updated, "property", "og:description", description)
    updated = replace_meta(updated, "name", "twitter:description", description, required=False)
    if headline_changed:
        updated = replace_meta(updated, "property", "og:title", headline)
        updated = replace_meta(updated, "name", "twitter:title", headline, required=False)
    updated = update_json_ld(updated, headline if headline_changed else None, description, row["url"])

    final_h1 = normalized(TAG_RE.sub(" ", one_match(H1_RE, updated, "final page H1").group(2)))
    if html_std.unescape(final_h1) != headline:
        raise ValueError(f"{row['articleId']}: visible H1 update failed")
    return updated


def one_match(pattern: re.Pattern, text: str, label: str) -> re.Match:
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise ValueError(f"expected exactly one {label}, found {len(matches)}")
    return matches[0]


def fragment(inner: str):
    return html.fragment_fromstring(f"<div>{inner}</div>", create_parent=False)


def extract_links(article_inner: str) -> list[InlineLink]:
    root = fragment(article_inner)
    links = []
    seen = set()
    for node in root.xpath(".//a[@href]"):
        href = node.get("href", "").strip()
        text = normalized("".join(node.itertext()))
        if not href or not text or href.lower().startswith(("javascript:", "data:")):
            continue
        key = (href, text)
        if key in seen:
            continue
        attrs = tuple(
            (name, node.get(name, ""))
            for name in SAFE_LINK_ATTRS
            if node.get(name) is not None
        )
        links.append(InlineLink(href=href, text=text, attrs=attrs))
        seen.add(key)
    return links


def old_h2_ids(article_inner: str) -> list[str]:
    root = fragment(article_inner)
    return [node.get("id", "").strip() for node in root.xpath(".//h2")]


def old_href_set(inner: str) -> set[str]:
    root = fragment(inner)
    return {
        node.get("href", "").strip()
        for node in root.xpath(".//a[@href]")
        if node.get("href", "").strip()
    }


def link_markup(link: InlineLink, displayed_text: str) -> str:
    attrs = dict(link.attrs)
    attrs["href"] = link.href
    rendered_attrs = " ".join(
        f'{name}="{html_std.escape(value, quote=True)}"'
        for name, value in attrs.items()
    )
    return f"<a {rendered_attrs}>{html_std.escape(displayed_text)}</a>"


class InlineRenderer:
    def __init__(self, links: list[InlineLink]):
        self.links = links
        self.used: set[int] = set()

    def render(self, text: str) -> str:
        placeholders: dict[str, str] = {}
        working = text
        candidates = sorted(enumerate(self.links), key=lambda item: len(item[1].text), reverse=True)
        for index, link in candidates:
            if index in self.used:
                continue
            displayed = link.text if link.text in working else ""
            if not displayed and link.text.endswith("宫") and link.text[:-1] in working:
                displayed = link.text[:-1]
            if not displayed:
                continue
            token = f"ARTICLELINKTOKEN{index}X"
            if token in working:
                raise ValueError("inline-link placeholder collision")
            working = working.replace(displayed, token, 1)
            placeholders[token] = link_markup(link, displayed)
            self.used.add(index)
        escaped = html_std.escape(working)
        for token, markup in placeholders.items():
            escaped = escaped.replace(token, markup)
        return escaped


def cleaned_toc_title(title: str) -> str:
    cleaned = HEADING_PREFIX_RE.sub("", title).strip()
    return cleaned or title.strip()


def render_article(
    blocks: list[dict],
    article_inner: str,
    article_indent: str,
    newline: str,
) -> tuple[str, list[tuple[str, str]]]:
    content_blocks = [block for block in blocks if block.get("type") != "H1"]
    old_ids = old_h2_ids(article_inner)
    links = extract_links(article_inner)
    inline = InlineRenderer(links)
    child_indent = article_indent + "  "
    rendered: list[str] = []
    toc_entries: list[tuple[str, str]] = []
    h2_index = 0
    inserted_hr = False
    preserve_hr = bool(re.search(r"<hr\b", article_inner, re.IGNORECASE))
    list_items: list[str] = []

    def flush_list() -> None:
        if not list_items:
            return
        rendered.append(f"{child_indent}<ul>")
        rendered.extend(f"{child_indent}  <li>{item}</li>" for item in list_items)
        rendered.append(f"{child_indent}</ul>")
        list_items.clear()

    for block in content_blocks:
        block_type = block.get("type")
        text = block.get("text", "")
        if block_type not in ALLOWED_BLOCKS or not normalized(text):
            raise ValueError(f"invalid final block: {block!r}")
        if block_type == "LIST":
            list_items.append(inline.render(text))
            continue
        flush_list()
        rich_text = inline.render(text)
        if block_type == "H2":
            if preserve_hr and not inserted_hr:
                rendered.append(f"{child_indent}<hr>")
                inserted_hr = True
            old_id = old_ids[h2_index] if h2_index < len(old_ids) else ""
            section_id = old_id or f"review-section-{h2_index + 1}"
            toc_entries.append((section_id, cleaned_toc_title(text)))
            rendered.append(
                f'{child_indent}<h2 id="{html_std.escape(section_id, quote=True)}">{rich_text}</h2>'
            )
            h2_index += 1
        elif block_type == "H3":
            rendered.append(f"{child_indent}<h3>{rich_text}</h3>")
        elif block_type == "LEAD":
            rendered.append(f'{child_indent}<p class="article-lead">{rich_text}</p>')
        elif block_type == "QUOTE":
            rendered.append(f"{child_indent}<blockquote>{rich_text}</blockquote>")
        else:
            rendered.append(f"{child_indent}<p>{rich_text}</p>")
    flush_list()

    if len(toc_entries) < 3 or len(toc_entries) > 5:
        raise ValueError(f"final H2 count outside policy: {len(toc_entries)}")
    rendered_inner = newline + newline.join(rendered) + newline

    rendered_root = fragment(rendered_inner)
    actual_text = normalized(rendered_root.text_content())
    expected_text = normalized(" ".join(block.get("text", "") for block in content_blocks))
    if actual_text != expected_text:
        raise ValueError("rendered article text differs from approved final blocks")

    return rendered_inner, toc_entries


def find_rail_cta_start(aside_inner: str) -> int | None:
    for match in re.finditer(r"<a\b[^>]*>", aside_inner, re.IGNORECASE):
        tag = match.group(0)
        class_match = re.search(r"\bclass=[\"']([^\"']*)[\"']", tag, re.IGNORECASE)
        if class_match and "rail-cta" in class_match.group(1).split():
            return match.start()
    return None


def rebuild_toc(
    aside_inner: str,
    toc_entries: list[tuple[str, str]],
    aside_indent: str,
    newline: str,
) -> tuple[str, str]:
    root = fragment(aside_inner)
    toc_links = root.xpath('./a[starts-with(@href, "#")]')
    if not toc_links:
        return aside_inner, aside_inner
    rail_start = find_rail_cta_start(aside_inner)
    if rail_start is None:
        raise ValueError("TOC side rail has no preserved rail-cta boundary")
    h2_nodes = root.xpath("./h2[1]")
    if not h2_nodes:
        raise ValueError("TOC side rail has no heading")
    heading_text = normalized("".join(h2_nodes[0].itertext()))
    suffix = aside_inner[rail_start:]
    child_indent = aside_indent + "  "
    prefix = [f"{child_indent}<h2>{html_std.escape(heading_text)}</h2>"]
    for index, (section_id, title) in enumerate(toc_entries, start=1):
        prefix.append(
            f'{child_indent}<a href="#{html_std.escape(section_id, quote=True)}">'
            f"{index:02d} {html_std.escape(title)}</a>"
        )
    updated = newline + newline.join(prefix) + newline + child_indent + suffix
    return updated, suffix


def validate_row(row: dict) -> tuple[str, list[dict]]:
    article_id = row.get("articleId", "")
    review = row.get("review", {})
    final = review.get("finalEditor") or {}
    blocks = final.get("finalBlocks") or []
    if review.get("status") != "final_approved":
        raise ValueError(f"{article_id}: row is not final_approved")
    original_blocks = row.get("original", {}).get("blocks") or []
    if blocks_hash(original_blocks) != row.get("contentHashes", {}).get("original"):
        raise ValueError(f"{article_id}: reviewed original block hash mismatch")
    if final.get("finalDecision") == "KEEP_ORIGINAL":
        return final.get("finalDecision", ""), blocks
    if review.get("finalValidationErrors"):
        raise ValueError(f"{article_id}: final validation errors remain")
    if blocks_hash(blocks) != review.get("finalContentHash"):
        raise ValueError(f"{article_id}: final block hash mismatch")
    final_text = "\n".join(block.get("text", "") for block in blocks)
    if MARKDOWN_HEADING_RE.search(final_text):
        raise ValueError(f"{article_id}: Markdown heading leaked into final blocks")
    if SOURCE_TRACE_RE.search(final_text):
        raise ValueError(f"{article_id}: source/editor trace leaked into final blocks")
    qa = review.get("finalQA") or {}
    if qa.get("status") != "PASS" or qa.get("finalContentHash") != review.get("finalContentHash"):
        raise ValueError(f"{article_id}: final QA approval/hash mismatch")
    return final.get("finalDecision", ""), blocks


def prepare_page(root: Path, row: dict, blocks: list[dict]) -> PreparedFile:
    article_id = row["articleId"]
    raw_source = row.get("sourceFile", "").replace("\\", "/")
    canonical_url = row.get("url", "")
    parsed_url = urlparse(canonical_url)
    url_source = unquote(parsed_url.path).lstrip("/")
    if (
        parsed_url.scheme != "https"
        or parsed_url.netloc != "yuetianai.com"
        or url_source != raw_source
    ):
        raise ValueError(
            f"{article_id}: sourceFile does not match its approved URL: "
            f"{raw_source!r} != {canonical_url!r}"
        )
    path = (root / raw_source).resolve()
    articles_root = (root / "articles").resolve()
    if not raw_source.startswith("articles/") or not path.is_relative_to(articles_root):
        raise ValueError(f"{article_id}: unsafe source path {raw_source!r}")
    original_bytes = path.read_bytes()
    has_bom = original_bytes.startswith(b"\xef\xbb\xbf")
    text = original_bytes.decode("utf-8-sig")
    newline = "\r\n" if "\r\n" in text else "\n"
    metadata_before = locked_metadata(text)
    if metadata_before["canonical"] != [canonical_url]:
        raise ValueError(
            f"{article_id}: page canonical does not match its approved URL: "
            f"{metadata_before['canonical']!r} != {[canonical_url]!r}"
        )
    current_fingerprint = page_text_fingerprint(text)
    approved_fingerprints = {
        blocks_text_fingerprint(row.get("original", {}).get("blocks") or []),
        blocks_text_fingerprint(blocks),
    }
    if current_fingerprint not in approved_fingerprints:
        raise ValueError(
            f"{article_id}: page body no longer matches the reviewed original or approved final"
        )

    article_match = one_match(ARTICLE_RE, text, f"article-start in {raw_source}")
    aside_match = one_match(ASIDE_RE, text, f"detail-rail in {raw_source}")
    one_match(HEAD_RE, text, f"head in {raw_source}")
    old_article_inner = article_match.group("inner")
    old_aside_inner = aside_match.group("inner")
    old_article_hrefs = old_href_set(old_article_inner)

    new_article_inner, toc_entries = render_article(
        blocks, old_article_inner, article_match.group("indent"), newline
    )
    normalized_article = (
        article_match.group("open")
        + new_article_inner
        + article_match.group("indent")
        + "</article>"
    )
    updated = text[: article_match.start()] + normalized_article + text[article_match.end() :]

    # The article length changed, so locate the side rail again before updating its TOC.
    updated_aside_match = one_match(ASIDE_RE, updated, f"updated detail-rail in {raw_source}")
    new_aside_inner, preserved_suffix = rebuild_toc(
        updated_aside_match.group("inner"),
        toc_entries,
        updated_aside_match.group("indent"),
        newline,
    )
    updated = (
        updated[: updated_aside_match.start("inner")]
        + new_aside_inner
        + updated[updated_aside_match.end("inner") :]
    )
    updated = update_page_metadata(updated, row, blocks)

    one_match(HEAD_RE, updated, f"updated head in {raw_source}")
    if locked_metadata(updated) != metadata_before:
        raise ValueError(f"{article_id}: locked URL/date metadata changed")
    if preserved_suffix not in updated:
        raise ValueError(f"{article_id}: related/quick-chart side rail suffix changed")

    final_article_match = one_match(ARTICLE_RE, updated, f"final article-start in {raw_source}")
    final_aside_match = one_match(ASIDE_RE, updated, f"final detail-rail in {raw_source}")
    final_article_hrefs = old_href_set(final_article_match.group("inner"))
    final_aside_hrefs = old_href_set(final_aside_match.group("inner"))
    # Body links and side-rail links serve different reader journeys. A duplicate
    # in the rail must not hide an accidentally removed contextual body link.
    missing_hrefs = old_article_hrefs - final_article_hrefs
    if missing_hrefs:
        raise ValueError(f"{article_id}: body links would be lost: {sorted(missing_hrefs)}")

    final_doc = html.fromstring(updated)
    ids = {
        node.get("id")
        for node in final_doc.xpath('//*[@id="article-start"]//h2[@id]')
    }
    toc_targets = {
        href[1:]
        for href in final_aside_hrefs
        if href.startswith("#") and len(href) > 1
    }
    if not toc_targets.issubset(ids):
        raise ValueError(f"{article_id}: TOC contains broken section links")

    encoded = updated.encode("utf-8")
    if has_bom:
        encoded = b"\xef\xbb\xbf" + encoded
    return PreparedFile(
        path=path,
        original_bytes=original_bytes,
        updated_bytes=encoded,
        original_hash=sha256_bytes(original_bytes),
    )


def write_all(prepared: list[PreparedFile]) -> None:
    for item in prepared:
        if sha256_bytes(item.path.read_bytes()) != item.original_hash:
            raise RuntimeError(f"file changed after validation: {item.path}")
    written: list[PreparedFile] = []
    temp_files: list[tuple[PreparedFile, Path]] = []
    try:
        for item in prepared:
            temp = item.path.with_name(f".{item.path.name}.rewrite-tmp")
            temp.write_bytes(item.updated_bytes)
            temp_files.append((item, temp))
        for item in prepared:
            if sha256_bytes(item.path.read_bytes()) != item.original_hash:
                raise RuntimeError(f"file changed while staging transaction: {item.path}")
        for item, temp in temp_files:
            os.replace(temp, item.path)
            written.append(item)
    except Exception:
        for item in reversed(written):
            item.path.write_bytes(item.original_bytes)
        raise
    finally:
        for _item, temp in temp_files:
            temp.unlink(missing_ok=True)


def main() -> int:
    args = parse_args()
    root = Path(__file__).resolve().parents[1]
    queue_path = (root / args.queue).resolve()
    if not queue_path.is_relative_to(root):
        raise ValueError("queue path must stay inside the repository")
    payload = json.loads(queue_path.read_text(encoding="utf-8"))
    rows = payload.get("articles", [])
    approved = [row for row in rows if row.get("review", {}).get("status") == "final_approved"]
    if len(approved) != args.expected_approved:
        raise ValueError(
            f"approved count changed: expected {args.expected_approved}, found {len(approved)}"
        )

    prepared: list[PreparedFile] = []
    kept = 0
    for row in approved:
        decision, blocks = validate_row(row)
        if decision == "KEEP_ORIGINAL":
            kept += 1
            continue
        prepared.append(prepare_page(root, row, blocks))
    if len(prepared) != args.expected_changed:
        raise ValueError(
            f"changed count changed: expected {args.expected_changed}, found {len(prepared)}"
        )
    if len({item.path for item in prepared}) != len(prepared):
        raise ValueError("duplicate source files in approved rewrite set")

    changed = [item for item in prepared if item.original_bytes != item.updated_bytes]
    print(
        f"Validated {len(approved)} approved articles: "
        f"{len(prepared)} rewrites, {kept} originals retained, {len(changed)} files differ."
    )
    if args.apply:
        write_all(changed)
        print(f"Applied {len(changed)} validated article file changes.")
    else:
        print("Dry run only; pass --apply to write files.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
