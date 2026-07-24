#!/usr/bin/env python3
"""Build a conservative original-vs-candidate article review queue."""

from argparse import ArgumentParser
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree
import hashlib
import json
import posixpath
import re
import zipfile


ARTICLE_ID_RE = re.compile(r"YT-(?:ZH|EN)-\d{4}")
START_RE = re.compile(
    r"(?:=+\s*)?ARTICLE_START\s*\|\s*(YT-(?:ZH|EN)-\d{4})(?:\s*=+)?"
)
END_RE = re.compile(
    r"(?:=+\s*)?ARTICLE_END\s*\|\s*(YT-(?:ZH|EN)-\d{4})(?:\s*=+)?"
)
FIELDS = (
    "ARTICLE_ID",
    "LANGUAGE",
    "SOURCE_FILE",
    "URL",
    "DATE_PUBLISHED",
    "DATE_MODIFIED",
    "H1",
    "LEAD",
    "H2",
    "H3",
    "P",
    "QUOTE",
    "LIST",
)
BLOCK_FIELDS = {"H1", "LEAD", "H2", "H3", "P", "QUOTE", "LIST"}
FINAL_CHOICES = {"KEEP_ORIGINAL", "KEEP_CANDIDATE", "HYBRID_REWRITE", "FULL_REWRITE"}
CRITIC_CHOICES = FINAL_CHOICES
LOCKED_FIELDS = (
    "ARTICLE_ID",
    "LANGUAGE",
    "SOURCE_FILE",
    "URL",
    "DATE_PUBLISHED",
    "DATE_MODIFIED",
)
SOURCE_TRACES = re.compile(
    r"文稿里|讲义里|他说|天纪|倪海厦|source-extract|证据卡|原文(?:直说|提到|认为|指出)",
    re.I,
)
MACHINE_TONE = re.compile(
    r"在当今时代|随着科技(?:发展)?|值得注意的是|不难发现|总而言之|"
    r"全是外行|直接关掉|唯一的作用|该裂的裂|该塌的塌|人生承重墙|万能钥匙|"
    r"in today'?s|in the modern era|it is worth noting|anyone who|the only use|close it",
    re.I,
)
EDITOR_NOTE_TONE = re.compile(
    r"^(?:解释|说明|补充).{0,80}(?:特质|为何|搜索意图|关键词|文章结构)|"
    r"^(?:explain|describe|expand).{0,80}(?:search intent|article structure|keyword)",
    re.I,
)


def normalize(value):
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def read_docx_paragraphs(path):
    if path.suffix.lower() != ".docx":
        raise ValueError(f"Expected .docx input, got: {path}")
    with zipfile.ZipFile(path) as archive:
        root = ElementTree.fromstring(archive.read("word/document.xml"))
    namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs = []
    for paragraph in root.findall(".//w:p", namespace):
        text = "".join(node.text or "" for node in paragraph.findall(".//w:t", namespace))
        paragraphs.append(text.strip())
    return paragraphs


def parse_fields(lines):
    stream = "\n".join(lines)
    alternatives = "|".join(FIELDS)
    pattern = re.compile(
        rf"\[({alternatives})\]\s*(.*?)(?=\[(?:{alternatives})\]|$)",
        re.S,
    )
    metadata = {}
    blocks = []
    matches = list(pattern.finditer(stream))
    gaps = []
    known_tags = set(FIELDS)
    tag_like_values = re.findall(r"\[([^\[\]\n]{1,24})\]", stream)
    unknown_tags = [
        tag
        for tag in tag_like_values
        if tag.strip() and tag.strip()[0].isalpha() and tag not in known_tags
    ]
    cursor = 0
    for match in matches:
        gap = normalize(stream[cursor : match.start()])
        if gap:
            gaps.append(gap)
        field, value = match.group(1), normalize(match.group(2))
        if field in BLOCK_FIELDS:
            blocks.append({"type": field, "text": value})
        else:
            if field in metadata:
                gaps.append(f"duplicate field [{field}]")
            metadata[field] = value
        cursor = match.end()
    trailing = normalize(stream[cursor:])
    if trailing:
        gaps.append(trailing)
    gaps.extend(f"unknown field [{tag}]" for tag in unknown_tags)
    if sum(block["type"] == "H1" for block in blocks) != 1:
        gaps.append("invalid H1 count")
    return metadata, blocks, gaps


def parse_document(path):
    paragraphs = read_docx_paragraphs(path)
    malformed_markers = []
    for paragraph in paragraphs:
        normalized = normalize(paragraph)
        if re.search(r"ARTICLE_START\s*\|", normalized) and not START_RE.fullmatch(normalized):
            malformed_markers.append(normalized)
        if re.search(r"ARTICLE_END\s*\|", normalized) and not END_RE.fullmatch(normalized):
            malformed_markers.append(normalized)
    articles = {}
    starts = []
    ends = []
    first_start = None
    index = 0
    while index < len(paragraphs):
        normalized_paragraph = normalize(paragraphs[index])
        start_match = START_RE.fullmatch(normalized_paragraph)
        end_match = END_RE.fullmatch(normalized_paragraph)
        if end_match:
            ends.append(end_match.group(1))
        if not start_match:
            index += 1
            continue
        article_id = start_match.group(1)
        starts.append(article_id)
        first_start = index if first_start is None else first_start
        section_start = index + 1
        index += 1
        section_end = None
        while index < len(paragraphs):
            current_paragraph = normalize(paragraphs[index])
            if END_RE.fullmatch(current_paragraph):
                current_end = END_RE.fullmatch(current_paragraph).group(1)
                ends.append(current_end)
                if current_end == article_id:
                    section_end = index
                break
            if START_RE.fullmatch(current_paragraph):
                break
            index += 1
        stop = section_end if section_end is not None else index
        metadata, blocks, unparsed = parse_fields(paragraphs[section_start:stop])
        articles[article_id] = {
            "metadata": metadata,
            "blocks": blocks,
            "closed": section_end is not None,
            "unparsed": unparsed,
        }
        index = (section_end + 1) if section_end is not None else max(index, section_start)
    prelude = paragraphs[: first_start or 0]
    return {
        "articles": articles,
        "starts": starts,
        "ends": ends,
        "prelude": [normalize(item) for item in prelude if normalize(item)],
        "paragraphCount": len(paragraphs),
        "duplicateStartIds": sorted(
            article_id for article_id, count in Counter(starts).items() if count > 1
        ),
        "malformedMarkers": malformed_markers,
    }


def block_text(article):
    return "\n".join(f"[{item['type']}] {item['text']}" for item in article["blocks"])


def first_block(article, block_type):
    return next((item["text"] for item in article["blocks"] if item["type"] == block_type), "")


def blocks_hash(blocks):
    serialized = json.dumps(blocks, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def validate_original_identity(article_id, article):
    metadata = article["metadata"]
    if metadata.get("ARTICLE_ID") != article_id:
        raise ValueError(f"original ARTICLE_ID mismatch: {article_id}")
    required = {
        "LANGUAGE",
        "SOURCE_FILE",
        "URL",
        "DATE_PUBLISHED",
        "DATE_MODIFIED",
    }
    missing = sorted(field for field in required if not metadata.get(field))
    if missing:
        raise ValueError(f"missing original metadata for {article_id}: {missing}")
    expected_language = "zh-CN" if article_id.startswith("YT-ZH-") else "en"
    if metadata.get("LANGUAGE") != expected_language:
        raise ValueError(f"original LANGUAGE mismatch: {article_id}")
    raw_source_file = metadata.get("SOURCE_FILE", "")
    source_file = raw_source_file.replace("\\", "/")
    parsed_url = urlparse(metadata.get("URL", ""))
    decoded_url_path = unquote(parsed_url.path)
    url_path = decoded_url_path.lstrip("/")
    normalized_source_file = posixpath.normpath(source_file)
    normalized_url_path = posixpath.normpath(url_path)
    if (
        raw_source_file.startswith(("/", "\\"))
        or not source_file.startswith("articles/")
        or ".." in Path(source_file).parts
        or normalized_source_file != source_file
        or parsed_url.scheme != "https"
        or parsed_url.netloc != "yuetianai.com"
        or parsed_url.params
        or parsed_url.query
        or parsed_url.fragment
        or decoded_url_path != parsed_url.path
        or normalized_url_path != url_path
        or source_file != url_path
    ):
        raise ValueError(f"original SOURCE_FILE/URL mismatch: {article_id}")
    if not article["closed"]:
        raise ValueError(f"unclosed original article: {article_id}")
    if article["unparsed"]:
        raise ValueError(f"unparsed original content: {article_id}")
    return source_file.casefold(), metadata["URL"].casefold()


def evaluate(original, candidate):
    if not candidate:
        return {
            "flags": ["candidate_missing"],
            "recommendation": "KEEP_ORIGINAL_PENDING_REVIEW",
            "metrics": {},
        }
    original_text = block_text(original)
    candidate_text = block_text(candidate)
    original_title = first_block(original, "H1")
    candidate_title = first_block(candidate, "H1")
    ratio = len(candidate_text) / max(len(original_text), 1)
    title_similarity = SequenceMatcher(None, original_title, candidate_title).ratio()
    metadata_mismatches = [
        field
        for field in LOCKED_FIELDS
        if normalize(original["metadata"].get(field, ""))
        != normalize(candidate["metadata"].get(field, ""))
    ]
    flags = []
    if not candidate["closed"]:
        flags.append("candidate_unclosed")
    if candidate.get("unparsed"):
        flags.append("candidate_unparsed")
    if metadata_mismatches:
        flags.append("locked_metadata_changed")
    if title_similarity < 0.35:
        flags.append("title_search_intent_drift")
    if ratio < 0.7:
        flags.append("candidate_too_short")
    if ratio > 1.5:
        flags.append("candidate_too_long")
    if sum(item["type"] == "H2" for item in candidate["blocks"]) < 2:
        flags.append("candidate_structure_thin")
    if SOURCE_TRACES.search(candidate_text):
        flags.append("candidate_source_trace")
    if MACHINE_TONE.search(candidate_text):
        flags.append("candidate_machine_tone")
    if SOURCE_TRACES.search(original_text):
        flags.append("original_source_trace")
    hard_candidate_flags = {
        "candidate_unclosed",
        "candidate_unparsed",
        "locked_metadata_changed",
        "title_search_intent_drift",
        "candidate_source_trace",
        "candidate_structure_thin",
    }
    recommendation = (
        "REJECT_CANDIDATE_PENDING_REWRITE"
        if hard_candidate_flags.intersection(flags)
        else "DEEP_REVIEW_REQUIRED"
    )
    return {
        "flags": flags,
        "recommendation": recommendation,
        "metrics": {
            "originalChars": len(original_text),
            "candidateChars": len(candidate_text),
            "lengthRatio": round(ratio, 3),
            "titleSimilarity": round(title_similarity, 3),
            "bodySimilarity": round(SequenceMatcher(None, original_text, candidate_text).ratio(), 3),
            "metadataMismatches": metadata_mismatches,
        },
    }


def build_queue(original_doc, candidate_doc):
    original = parse_document(original_doc)
    candidate = parse_document(candidate_doc)
    if original["malformedMarkers"] or candidate["malformedMarkers"]:
        raise ValueError("ARTICLE_START/END markers must occupy their own paragraphs")
    if original["duplicateStartIds"] or candidate["duplicateStartIds"]:
        raise ValueError("duplicate ARTICLE_START ids detected")
    rows = []
    source_files = []
    urls = []
    for article_id, original_article in original["articles"].items():
        source_file_key, url_key = validate_original_identity(article_id, original_article)
        source_files.append(source_file_key)
        urls.append(url_key)
        candidate_article = candidate["articles"].get(article_id)
        automatic = evaluate(original_article, candidate_article)
        rows.append(
            {
                "articleId": article_id,
                "sourceFile": original_article["metadata"].get("SOURCE_FILE", ""),
                "url": original_article["metadata"].get("URL", ""),
                "datePublished": original_article["metadata"].get("DATE_PUBLISHED", ""),
                "contentHashes": {
                    "original": blocks_hash(original_article["blocks"]),
                    "candidate": blocks_hash(candidate_article["blocks"])
                    if candidate_article
                    else None,
                },
                "automatic": automatic,
                "review": {
                    "contentCritic": None,
                    "humanCritic": None,
                    "finalEditor": None,
                    "status": "pending",
                },
                "original": original_article,
                "candidate": candidate_article,
            }
        )
    if len(source_files) != len(set(source_files)) or len(urls) != len(set(urls)):
        raise ValueError("duplicate SOURCE_FILE or URL in original document")
    expected = set(original["articles"])
    candidate_ids = set(candidate["articles"])
    document_issues = {
        "candidatePreludeParagraphs": len(candidate["prelude"]),
        "candidatePreludeSample": candidate["prelude"][:8],
        "candidateStartMarkers": len(candidate["starts"]),
        "candidateEndMarkers": len(candidate["ends"]),
        "candidateUniqueIds": len(candidate_ids),
        "missingCandidateIds": sorted(expected - candidate_ids),
        "unexpectedCandidateIds": sorted(candidate_ids - expected),
        "endWithoutStartIds": sorted(set(candidate["ends"]) - candidate_ids),
        "originalDuplicateStartIds": original["duplicateStartIds"],
        "candidateDuplicateStartIds": candidate["duplicateStartIds"],
    }
    return rows, document_issues


def load_reviews(path, expected_reviewer=None):
    if not path:
        return {}
    payload = json.loads(path.read_text(encoding="utf-8"))
    if expected_reviewer and (
        not isinstance(payload, dict) or payload.get("reviewer") != expected_reviewer
    ):
        raise ValueError(f"unexpected reviewer type in {path}: expected {expected_reviewer}")
    reviews = payload if isinstance(payload, list) else payload.get("reviews", [])
    ids = [item["articleId"] for item in reviews]
    duplicates = [article_id for article_id, count in Counter(ids).items() if count > 1]
    if duplicates:
        raise ValueError(f"duplicate review ids in {path}: {duplicates[:5]}")
    if expected_reviewer:
        for item in reviews:
            required = {
                "articleId",
                "originalScore",
                "candidateScore",
                "decision",
                "hardGates",
                "reasons",
                "originalContentHash",
                "candidateContentHash",
            }
            if not required.issubset(item):
                raise ValueError(f"incomplete critic review in {path}: {item.get('articleId')}")
            if item["decision"] not in CRITIC_CHOICES:
                raise ValueError(f"invalid critic decision in {path}: {item['decision']}")
            if not all(
                isinstance(item[key], (int, float)) and 0 <= item[key] <= 100
                for key in ("originalScore", "candidateScore")
            ):
                raise ValueError(f"invalid critic score in {path}: {item['articleId']}")
            if not isinstance(item["hardGates"], list) or not isinstance(item["reasons"], list):
                raise ValueError(f"invalid critic details in {path}: {item['articleId']}")
    return {item["articleId"]: item for item in reviews}


def merge_reviews(row, content_review, human_review):
    article_id = row["articleId"]
    content = content_review.get(article_id)
    human = human_review.get(article_id)
    row["review"]["contentCritic"] = content
    row["review"]["humanCritic"] = human
    if not content or not human:
        row["review"]["status"] = "awaiting_dual_review"
        row["review"]["provisionalDecision"] = None
        return
    hashes = row["contentHashes"]
    for review in (content, human):
        if (
            review.get("originalContentHash") != hashes["original"]
            or review.get("candidateContentHash") != hashes["candidate"]
        ):
            row["review"]["status"] = "critic_hash_mismatch"
            row["review"]["provisionalDecision"] = None
            return
    if row["candidate"] is None:
        row["review"]["status"] = "awaiting_final_editor"
        choices = {content.get("decision"), human.get("decision")}
        row["review"]["provisionalDecision"] = (
            "KEEP_ORIGINAL" if choices == {"KEEP_ORIGINAL"} else "FULL_REWRITE"
        )
        return

    hard_gates = sorted(
        set(content.get("hardGates", []))
        | set(human.get("hardGates", []))
        | {
            flag
            for flag in row["automatic"]["flags"]
            if flag
            in {
                "candidate_unclosed",
                "candidate_unparsed",
                "locked_metadata_changed",
                "title_search_intent_drift",
                "candidate_source_trace",
                "candidate_structure_thin",
            }
        }
    )
    content_choice = content.get("decision")
    human_choice = human.get("decision")
    choices = {content_choice, human_choice}
    if "FULL_REWRITE" in choices:
        decision = "FULL_REWRITE"
    elif hard_gates:
        decision = "FULL_REWRITE" if "original_source_trace" in row["automatic"]["flags"] else "KEEP_ORIGINAL"
    elif choices == {"KEEP_CANDIDATE"}:
        candidate_margin = min(
            content.get("candidateScore", 0) - content.get("originalScore", 0),
            human.get("candidateScore", 0) - human.get("originalScore", 0),
        )
        decision = "KEEP_CANDIDATE" if candidate_margin >= 3 else "HYBRID_REWRITE"
    elif choices == {"KEEP_ORIGINAL"}:
        decision = "KEEP_ORIGINAL"
    else:
        decision = "HYBRID_REWRITE"
    row["review"]["status"] = "awaiting_final_editor"
    row["review"]["provisionalDecision"] = decision
    row["review"]["hardGates"] = hard_gates


def merge_final_review(row, final_reviews):
    final = final_reviews.get(row["articleId"])
    row["review"]["finalEditor"] = final
    if not final:
        return
    blocks = final.get("finalBlocks", [])
    final_content_hash = blocks_hash(blocks)
    row["review"]["finalContentHash"] = final_content_hash
    if row["review"].get("status") != "awaiting_final_editor":
        row["review"]["status"] = "final_invalid"
        row["review"]["finalValidationErrors"] = ["final_without_dual_review"]
        return
    block_types = [block.get("type") for block in blocks]
    final_text = "\n".join(block.get("text", "") for block in blocks)
    final_title = next(
        (block.get("text", "") for block in blocks if block.get("type") == "H1"), ""
    )
    original_title = first_block(row["original"], "H1")
    checks = final.get("checks", {})
    validation_errors = []
    if final.get("finalDecision") not in FINAL_CHOICES:
        validation_errors.append("invalid_final_decision")
    elif (
        final.get("finalDecision") == "KEEP_ORIGINAL"
        and final_content_hash != row["contentHashes"]["original"]
    ):
        validation_errors.append("keep_original_hash_mismatch")
    elif (
        final.get("finalDecision") == "KEEP_CANDIDATE"
        and final_content_hash != row["contentHashes"]["candidate"]
    ):
        validation_errors.append("keep_candidate_hash_mismatch")
    if block_types.count("H1") != 1:
        validation_errors.append("final_h1_count")
    h2_count = sum(block_type == "H2" for block_type in block_types)
    if h2_count < 3 or h2_count > 5:
        validation_errors.append("final_structure_thin")
    if any(block_type not in BLOCK_FIELDS for block_type in block_types):
        validation_errors.append("invalid_block_type")
    if any(not normalize(block.get("text", "")) for block in blocks):
        validation_errors.append("empty_final_block")
    if SOURCE_TRACES.search(final_text):
        validation_errors.append("final_source_trace")
    paragraph_texts = [
        normalize(block.get("text", ""))
        for block in blocks
        if block.get("type") in {"LEAD", "P", "QUOTE", "LIST"}
    ]
    if any(EDITOR_NOTE_TONE.search(text) for text in paragraph_texts):
        validation_errors.append("final_editor_note_in_body")
    for index, left in enumerate(paragraph_texts):
        for right in paragraph_texts[index + 1 :]:
            shorter, longer = sorted((left, right), key=len)
            if len(shorter) < 40:
                continue
            if shorter in longer or SequenceMatcher(None, left, right).ratio() >= 0.84:
                validation_errors.append("final_repetitive_paragraphs")
                break
        if "final_repetitive_paragraphs" in validation_errors:
            break
    title_similarity = SequenceMatcher(None, original_title, final_title).ratio()
    title_contains_original = normalize(original_title).casefold() in normalize(final_title).casefold()
    original_title_tokens = {
        token for token in re.findall(r"[a-z0-9]+", original_title.casefold()) if len(token) >= 3
    }
    final_title_tokens = {
        token for token in re.findall(r"[a-z0-9]+", final_title.casefold()) if len(token) >= 3
    }
    title_keyword_overlap = bool(original_title_tokens & final_title_tokens)
    if title_similarity < 0.35 and not title_contains_original and not title_keyword_overlap:
        row["review"].setdefault("finalWarnings", []).append(
            "final_title_search_intent_manual_check"
        )
    language = row["original"]["metadata"].get("LANGUAGE", "")
    if language.startswith("zh") and len(final_text) < 500:
        validation_errors.append("final_too_short")
    if language.startswith("en") and len(final_text.split()) < 280:
        validation_errors.append("final_too_short")
    if (
        row["review"].get("provisionalDecision") == "KEEP_ORIGINAL"
        and final.get("finalDecision") in {"KEEP_CANDIDATE", "HYBRID_REWRITE"}
    ):
        validation_errors.append("final_overrode_dual_rejection")
    required_checks = {"intent", "terminology", "humanTone", "structure", "sourceTraceFree"}
    if not required_checks.issubset(checks) or not all(checks.get(key) is True for key in required_checks):
        validation_errors.append("final_checks_incomplete")
    row["review"]["finalValidationErrors"] = validation_errors
    row["review"]["status"] = "final_approved" if not validation_errors else "final_invalid"


def merge_final_qa(row, final_qa_reviews):
    qa = final_qa_reviews.get(row["articleId"])
    row["review"]["finalQA"] = qa
    expected_hash = row["review"].get("finalContentHash")
    if row["review"].get("finalEditor") and not qa:
        row["review"]["status"] = "awaiting_final_qa"
    elif qa and qa.get("finalContentHash") != expected_hash:
        errors = row["review"].setdefault("finalValidationErrors", [])
        errors.append("final_qa_hash_mismatch")
        row["review"]["status"] = "final_invalid"
    elif qa and qa.get("status") != "PASS":
        errors = row["review"].setdefault("finalValidationErrors", [])
        errors.append("final_qa_revise")
        row["review"]["status"] = "final_invalid"


def apply_cross_article_validation(rows):
    paragraph_owners = {}
    title_owners = {}
    for row in rows:
        final = row["review"].get("finalEditor") or {}
        for block in final.get("finalBlocks", []):
            text = normalize(block.get("text", ""))
            if block.get("type") == "H1" and text:
                title_owners.setdefault(text, set()).add(row["articleId"])
            if block.get("type") in {"LEAD", "P", "QUOTE", "LIST"} and len(text) >= 80:
                paragraph_owners.setdefault(text, set()).add(row["articleId"])

    duplicate_titles = {
        article_id
        for owners in title_owners.values()
        if len(owners) > 1
        for article_id in owners
    }
    duplicate_paragraphs = {
        article_id
        for owners in paragraph_owners.values()
        if len(owners) > 1
        for article_id in owners
    }
    for row in rows:
        review = row["review"]
        final = review.get("finalEditor") or {}
        if not final:
            continue
        errors = review.setdefault("finalValidationErrors", [])
        final_text = "\n".join(
            block.get("text", "") for block in final.get("finalBlocks", [])
        )
        if row["articleId"] in duplicate_titles:
            errors.append("duplicate_final_title")
        if row["articleId"] in duplicate_paragraphs:
            errors.append("duplicate_final_paragraph")
        if MACHINE_TONE.search(final_text):
            errors.append("final_machine_tone")
        review["finalValidationErrors"] = sorted(set(errors))
        if errors:
            review["status"] = "final_invalid"
        elif (review.get("finalQA") or {}).get("status") == "PASS":
            review["status"] = "final_approved"
        else:
            review["status"] = "awaiting_final_qa"


def write_summary(path, rows, document_issues):
    flag_counts = Counter(flag for row in rows for flag in row["automatic"]["flags"])
    recommendation_counts = Counter(row["automatic"]["recommendation"] for row in rows)
    review_status_counts = Counter(row["review"]["status"] for row in rows)
    decision_counts = Counter(
        row["review"].get("provisionalDecision") or "UNDECIDED" for row in rows
    )
    lines = [
        "# Article rewrite review queue",
        "",
        f"- Total articles: {len(rows)}",
        f"- Candidate articles found: {document_issues['candidateUniqueIds']}",
        f"- Candidate articles missing: {len(document_issues['missingCandidateIds'])}",
        f"- Candidate prelude contamination: {document_issues['candidatePreludeParagraphs']} paragraphs",
        f"- Candidate end markers without matching start: {len(document_issues['endWithoutStartIds'])}",
        "",
        "## Automatic recommendations",
        "",
    ]
    lines.extend(f"- {name}: {count}" for name, count in sorted(recommendation_counts.items()))
    lines.extend(["", "## Automatic flags", ""])
    lines.extend(f"- {name}: {count}" for name, count in sorted(flag_counts.items()))
    lines.extend(["", "## Dual-review progress", ""])
    lines.extend(f"- {name}: {count}" for name, count in sorted(review_status_counts.items()))
    lines.extend(["", "## Provisional decisions", ""])
    lines.extend(f"- {name}: {count}" for name, count in sorted(decision_counts.items()))
    lines.extend(
        [
            "",
            "## Human review rule",
            "",
            "No candidate is published automatically. Content critic and human-tone critic must score both versions. The final editor chooses original, candidate, hybrid rewrite, or full rewrite, then reruns SEO and technical validation.",
        ]
    )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_editor_batches(output_dir, rows, batch_size):
    editor_rows = [
        row for row in rows if row["review"]["status"] == "awaiting_final_editor"
    ]
    batch_dir = output_dir / "final-editor-batches"
    batch_dir.mkdir(parents=True, exist_ok=True)
    for stale_file in batch_dir.glob("batch-*.json"):
        stale_file.unlink()
    for offset in range(0, len(editor_rows), batch_size):
        batch = editor_rows[offset : offset + batch_size]
        batch_number = offset // batch_size + 1
        payload = {
            "schemaVersion": 1,
            "batchNumber": batch_number,
            "status": "pending",
            "articles": batch,
        }
        (batch_dir / f"batch-{batch_number:03d}.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
        )
    return len(editor_rows), (len(editor_rows) + batch_size - 1) // batch_size


def write_ledger(path, rows):
    ledger = []
    for row in rows:
        review = row["review"]
        final = review.get("finalEditor") or {}
        ledger.append(
            {
                "articleId": row["articleId"],
                "sourceFile": row["sourceFile"],
                "url": row["url"],
                "status": review["status"],
                "provisionalDecision": review.get("provisionalDecision"),
                "finalDecision": final.get("finalDecision"),
                "editSummary": final.get("editSummary"),
                "finalQA": review.get("finalQA"),
                "warnings": review.get("finalWarnings", []),
                "validationErrors": review.get("finalValidationErrors", []),
            }
        )
    path.write_text(json.dumps(ledger, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    parser = ArgumentParser()
    parser.add_argument("--original", required=True, type=Path)
    parser.add_argument("--candidate", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--content-review", type=Path)
    parser.add_argument("--human-review", type=Path)
    parser.add_argument("--final-review", action="append", type=Path, default=[])
    parser.add_argument("--final-qa", action="append", type=Path, default=[])
    parser.add_argument("--batch-size", type=int, default=20)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    rows, document_issues = build_queue(args.original, args.candidate)
    if args.content_review and args.human_review and args.content_review.resolve() == args.human_review.resolve():
        raise ValueError("content and human critics must use different review files")
    content_reviews = load_reviews(args.content_review, "content")
    human_reviews = load_reviews(args.human_review, "human")
    final_reviews = {}
    for final_review_path in args.final_review:
        for article_id, review in load_reviews(final_review_path).items():
            if article_id in final_reviews:
                raise ValueError(f"duplicate final review across files: {article_id}")
            final_reviews[article_id] = review
    final_qa_reviews = {}
    for final_qa_path in args.final_qa:
        for article_id, review in load_reviews(final_qa_path).items():
            previous = final_qa_reviews.get(article_id)
            if previous and not (
                previous.get("status") == "REVISE" and review.get("status") == "PASS"
            ):
                raise ValueError(f"invalid final QA override: {article_id}")
            final_qa_reviews[article_id] = review
    for row in rows:
        merge_reviews(row, content_reviews, human_reviews)
        merge_final_review(row, final_reviews)
        merge_final_qa(row, final_qa_reviews)
    apply_cross_article_validation(rows)
    payload = {
        "schemaVersion": 1,
        "rubric": {
            "contentCritic": "search intent, terminology, factual fidelity, examples, SEO safety",
            "humanCritic": "human readability, machine tone, clarity, usefulness, restrained marketing",
            "finalChoices": ["KEEP_ORIGINAL", "KEEP_CANDIDATE", "HYBRID_REWRITE", "FULL_REWRITE"],
            "candidateWinRule": "both critics choose candidate, no hard gate, and each score margin is at least 3",
            "publicationRule": "a provisional decision is never publishable until finalEditor is complete",
        },
        "documentIssues": document_issues,
        "articles": rows,
    }
    queue_path = args.output_dir / "article-review-queue.json"
    queue_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    summary_path = args.output_dir / "article-review-summary.md"
    write_summary(summary_path, rows, document_issues)
    ledger_path = args.output_dir / "article-review-ledger.json"
    write_ledger(ledger_path, rows)
    editor_articles, editor_batches = write_editor_batches(
        args.output_dir, rows, max(args.batch_size, 1)
    )
    print(
        json.dumps(
            {
                "queue": str(queue_path),
                "summary": str(summary_path),
                "ledger": str(ledger_path),
                "articles": len(rows),
                "editorArticles": editor_articles,
                "editorBatches": editor_batches,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
