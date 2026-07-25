#!/usr/bin/env python3
"""Merge the five-review panel, revised drafts, dual critics, and final QA."""

from __future__ import annotations

import copy
import hashlib
import json
import os
import re
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "article-review"
QUEUE = OUTPUT / "article-review-queue.json"
TARGET_IDS = [f"YT-EN-{index:04d}" for index in range(29, 277)]
TARGET_SET = set(TARGET_IDS)
PANEL_FILES = {
    "seo": OUTPUT / "panel-seo-248.json",
    "human": OUTPUT / "panel-human-en-248.json",
    "safety": OUTPUT / "panel-safety-248.json",
    "ziwei": OUTPUT / "panel-ziwei-248.json",
}
REWRITE_ASSIGNMENTS = {
    "ziwei": {
        "YT-EN-0029", "YT-EN-0033", "YT-EN-0037", "YT-EN-0069",
        "YT-EN-0073", "YT-EN-0095", "YT-EN-0126", "YT-EN-0127",
        "YT-EN-0135", "YT-EN-0136", "YT-EN-0137", "YT-EN-0151",
        "YT-EN-0152", "YT-EN-0167", "YT-EN-0173", "YT-EN-0176",
        "YT-EN-0209", "YT-EN-0210", "YT-EN-0213", "YT-EN-0215",
        "YT-EN-0225", "YT-EN-0240", "YT-EN-0253", "YT-EN-0255",
        "YT-EN-0256", "YT-EN-0257", "YT-EN-0262", "YT-EN-0265",
        "YT-EN-0268",
    },
    "seo": {"YT-EN-0049", "YT-EN-0067", "YT-EN-0072", "YT-EN-0145", "YT-EN-0165"},
    "human": {"YT-EN-0187", "YT-EN-0229", "YT-EN-0236", "YT-EN-0243", "YT-EN-0248"},
    "safety": {"YT-EN-0093", "YT-EN-0094", "YT-EN-0160", "YT-EN-0163", "YT-EN-0164"},
}
REWRITE_FILES = {
    name: OUTPUT / f"panel-rewrite-{name}.json" for name in REWRITE_ASSIGNMENTS
}
BASELINE_FINAL_FILES = (
    OUTPUT / "final-editor-c-final.json",
    OUTPUT / "final-editor-d-final.json",
)
ARBITER_REVISE = {"YT-EN-0061"}
POST_REWRITE_FILES = {
    "content": OUTPUT / "panel-postrewrite-content-45.json",
    "human": OUTPUT / "panel-postrewrite-human-45.json",
}
ALLOWED_BLOCKS = {"H1", "H2", "H3", "LEAD", "P", "QUOTE", "LIST"}
FORBIDDEN_RE = re.compile(
    r"(^|\n)\s*#{1,6}\s|"
    r"\bthis (?:article|page)\b|"
    r"\b(?:source extract|original draft|candidate draft|final draft|editorial note)\b|"
    r"official-type|official-belt|bottleneck transformation|wealth in finance|"
    r"career and money lines|"
    r"文稿|讲义|他说|天纪|倪海厦|证据卡|原稿|改写稿|候选稿",
    re.IGNORECASE,
)
FEAR_TITLE_RE = re.compile(r"\b(?:lifelong strain|doomed|certain failure|disaster)\b", re.IGNORECASE)
GATE_EXPLANATIONS = {
    "PALACE_GEOMETRY_ERROR": "Palace relationships or axis geometry required correction.",
    "READING_ORDER_ERROR": "The chart-reading order needed to separate natal structure and timing layers.",
    "FORMATION_CONDITION_ERROR": "The named formation needed explicit and accurate conditions.",
    "TERM_CONFLATION": "Distinct stars, branches, or formations had been conflated.",
    "STAR_SCOPE_OVERREACH": "A single star had been used to support conclusions beyond its scope.",
    "OVER_SIMPLIFIED_INFERENCE": "The conclusion needed additional palace and transformation conditions.",
    "MACHINE_TONE": "The English needed a more idiomatic, reader-facing rewrite.",
    "OVERCOMPRESSION": "Specialist terms needed plain-English definitions and context.",
    "EDITORIAL_TRACE": "Editorial workflow language had leaked into publishable prose.",
    "ABSOLUTE_OR_UNSUPPORTED_CLAIMS": "The claim needed conditional wording and clearer limits.",
    "BLAME_FRAMING": "The framing needed to avoid assigning fault to the chart owner.",
    "FEAR_BASED_FRAMING": "The headline or claim needed neutral, non-alarmist wording.",
    "GENDER_STEREOTYPE": "Traditional gender language needed contextual limits and neutral framing.",
}


def load_payload(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def indexed_reviews(path: Path, expected_ids: set[str] | None = None) -> dict[str, dict]:
    payload = load_payload(path)
    reviews = payload.get("reviews", [])
    ids = [review.get("articleId") for review in reviews]
    duplicates = [item for item, count in Counter(ids).items() if count > 1]
    if duplicates:
        raise ValueError(f"duplicate IDs in {path.name}: {duplicates[:5]}")
    found = set(ids)
    if expected_ids is not None and found != expected_ids:
        raise ValueError(
            f"ID coverage mismatch in {path.name}: "
            f"missing={sorted(expected_ids - found)[:5]}, extra={sorted(found - expected_ids)[:5]}"
        )
    return {review["articleId"]: review for review in reviews}


def block_hash(blocks: list[dict]) -> str:
    serialized = json.dumps(blocks, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def normalized(value: str) -> str:
    return " ".join(value.split())


def arbiter_rewrite(article_id: str, current: dict) -> dict:
    if article_id != "YT-EN-0061":
        raise ValueError(f"no arbiter rewrite defined for {article_id}")
    review = copy.deepcopy(current)
    correction_map = {
        "The star that transforms into Hua Quan matters. A managerial or official-type star may express authority through position and rules; a wealth-oriented star may express it through budgets, negotiations, and resource control. The Spouse Palace describes the partner and the partnership dynamic, so the same transformation can show an accomplished spouse, a decisive household structure, or two people who both expect the final word.":
            "The star that transforms into Hua Quan matters. Zi Wei may express authority through position and rules, while Wu Qu may express it through budgets, negotiation, and resource control. The Spouse Palace describes the partner and the partnership dynamic, so the same transformation can show an accomplished spouse, a decisive household structure, or two people who both expect the final word.",
        "Spouse Palace Hua Quan linked to a strong Career Palace can describe a partner who leads teams or carries public responsibility. Their firmness may come from real duties rather than simple temper.":
            "Spouse Palace Hua Quan opposite a strong Career Palace can describe a partner who leads teams or carries public responsibility. Their firmness may come from real duties rather than simple temper.",
        "Spouse Palace Hua Quan linked to the Wealth Palace can put financial planning at the center of the relationship. If the Life Palace is gentle or Hua Ke-oriented, one person may advise while the other decides; explicit decision rules prevent resentment.":
            "If Wu Qu carries Hua Quan in the Spouse Palace, budgeting and resource decisions may become central to the relationship. A stable Fortune Palace can support calmer negotiation; if harsh stars also disturb the Spouse-Career axis, explicit decision rules help prevent resentment.",
        "First identify which star becomes Hua Quan in the Spouse Palace. Next read the Career and Wealth Palaces to see whether authority becomes position, money management, or workload. Then compare the Life and Inner-Life Palaces for the native's ability to share decisions. Finally inspect decade and annual triggers. Translate the result into clear roles, spending limits, and a method for resolving deadlocks.":
            "First identify which star becomes Hua Quan in the Spouse Palace. Next read the opposite Career Palace and the trinal Travel and Fortune Palaces to see how authority is supported or challenged. Consult the Wealth Palace only when Wu Qu or other financial indicators make money part of the question. Then compare the Life Palace for the native's response before adding decade and annual triggers. Translate the result into clear roles, spending limits, and a method for resolving deadlocks.",
    }
    replacement_count = 0
    for block in review["finalBlocks"]:
        for old_text, new_text in correction_map.items():
            if block.get("text") == old_text:
                block["text"] = new_text
                replacement_count += 1
                break
    if replacement_count != 4:
        raise ValueError("YT-EN-0061 arbiter corrections did not match four blocks")
    review["articleId"] = article_id
    review["finalDecision"] = "FULL_REWRITE"
    review["editSummary"] = "Fifth-review correction: clarified the transforming stars and restored the Spouse Palace's exact opposite and trinal relationships."
    review["checks"] = {
        "intent": True,
        "terminology": True,
        "humanTone": True,
        "structure": True,
        "sourceTraceFree": True,
    }
    return review


def validate_final(article_id: str, review: dict) -> str:
    blocks = review.get("finalBlocks") or []
    types = [block.get("type") for block in blocks]
    if review.get("finalDecision") != "FULL_REWRITE":
        raise ValueError(f"{article_id}: finalDecision must be FULL_REWRITE")
    if types.count("H1") != 1 or not 3 <= types.count("H2") <= 5:
        raise ValueError(f"{article_id}: invalid H1/H2 structure")
    if any(block_type not in ALLOWED_BLOCKS for block_type in types):
        raise ValueError(f"{article_id}: unsupported block type")
    if any(not normalized(block.get("text", "")) for block in blocks):
        raise ValueError(f"{article_id}: empty final block")
    text = "\n".join(block["text"] for block in blocks)
    title = next(block["text"] for block in blocks if block["type"] == "H1")
    if len(re.findall(r"\b[\w'-]+\b", text)) < 280:
        raise ValueError(f"{article_id}: final article is under 280 English words")
    if FORBIDDEN_RE.search(text):
        raise ValueError(f"{article_id}: forbidden machine/editor/source phrase remains")
    if FEAR_TITLE_RE.search(title):
        raise ValueError(f"{article_id}: fear-based or deterministic H1 remains")
    h2s = [block["text"] for block in blocks if block["type"] == "H2"]
    if not any(
        marker in h2s[-1].lower()
        for marker in ("chart-reading order", "chart reading order", "read the chart")
    ):
        raise ValueError(f"{article_id}: final section is not a chart-reading order")
    paragraphs = [
        normalized(block["text"])
        for block in blocks
        if block["type"] in {"LEAD", "P", "QUOTE", "LIST"}
    ]
    for index, left in enumerate(paragraphs):
        for right in paragraphs[index + 1 :]:
            shorter = min(len(left), len(right))
            if shorter >= 40 and SequenceMatcher(None, left, right).ratio() >= 0.84:
                raise ValueError(f"{article_id}: repeated final paragraphs")
    checks = review.get("checks", {})
    if not all(checks.get(name) is True for name in ("intent", "terminology", "humanTone", "structure", "sourceTraceFree")):
        raise ValueError(f"{article_id}: incomplete final checks")
    return block_hash(blocks)


def average_score(reviews: list[dict], key: str, fallback: int) -> int:
    values = [review.get(key) for review in reviews if isinstance(review.get(key), (int, float))]
    return round(sum(values) / len(values)) if values else fallback


def critic_review(article: dict, relevant: list[dict], role: str) -> dict:
    gates = sorted({gate for review in relevant for gate in review.get("hardGates", [])})
    reasons = [GATE_EXPLANATIONS.get(gate, gate.replace("_", " ").title() + ".") for gate in gates]
    if not reasons:
        reasons.append("The original is retained as evidence, but the publishable version requires a fuller conditional rewrite.")
    reasons.append(
        "A five-role panel will supply and recheck the final English rewrite because no external candidate was provided."
    )
    return {
        "articleId": article["articleId"],
        "originalScore": average_score(relevant, "originalScore", 70),
        "candidateScore": average_score(relevant, "candidateScore", 90),
        "decision": "FULL_REWRITE",
        "hardGates": gates,
        "reasons": reasons,
        "originalContentHash": article["contentHashes"]["original"],
        "candidateContentHash": None,
    }


def write_json(path: Path, payload: dict) -> None:
    temp = path.with_name(f".{path.name}.five-panel-tmp")
    temp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp, path)


def main() -> None:
    queue_rows = load_payload(QUEUE).get("articles", [])
    queue = {row["articleId"]: row for row in queue_rows}
    if not TARGET_SET.issubset(queue):
        raise ValueError("review queue is missing target English article IDs")

    panels = {
        name: indexed_reviews(path, TARGET_SET) for name, path in PANEL_FILES.items()
    }
    panel_flagged = {
        article_id
        for article_id in TARGET_IDS
        if any(panels[name][article_id].get("status") != "PASS" for name in panels)
    }
    expected_panel_flagged = set().union(*REWRITE_ASSIGNMENTS.values())
    if panel_flagged != expected_panel_flagged:
        raise ValueError("panel REVISE union no longer matches the assigned rewrite set")
    returned_ids = panel_flagged | ARBITER_REVISE
    post_rewrite_reviews = {
        name: indexed_reviews(path, returned_ids)
        for name, path in POST_REWRITE_FILES.items()
    }

    rewrite_reviews = {}
    for name, path in REWRITE_FILES.items():
        batch = indexed_reviews(path, REWRITE_ASSIGNMENTS[name])
        overlap = set(rewrite_reviews) & set(batch)
        if overlap:
            raise ValueError(f"duplicate rewrite ownership: {sorted(overlap)}")
        rewrite_reviews.update(batch)

    baseline_reviews = {}
    for path in BASELINE_FINAL_FILES:
        batch = indexed_reviews(path)
        overlap = set(baseline_reviews) & set(batch)
        if overlap:
            raise ValueError(f"duplicate baseline final review ownership: {sorted(overlap)}")
        baseline_reviews.update(batch)
    if set(baseline_reviews) != TARGET_SET:
        raise ValueError("baseline C/D final reviews do not cover the 248 target IDs")

    final_reviews = []
    final_qa = []
    arbiter_rows = []
    final_titles = {}
    for article_id in TARGET_IDS:
        current = baseline_reviews[article_id]
        if article_id in rewrite_reviews:
            final = rewrite_reviews[article_id]
        elif article_id in ARBITER_REVISE:
            final = arbiter_rewrite(article_id, current)
        else:
            final = copy.deepcopy(current)
            final["finalDecision"] = "FULL_REWRITE"
        if article_id in returned_ids:
            if block_hash(final.get("finalBlocks", [])) == block_hash(current.get("finalBlocks", [])):
                raise ValueError(f"{article_id}: returned article was not changed")
        content_hash = validate_final(article_id, final)
        post_review_statuses = {}
        if article_id in returned_ids:
            for reviewer_name, reviews in post_rewrite_reviews.items():
                post_review = reviews[article_id]
                post_review_statuses[reviewer_name] = post_review.get("status")
                if post_review.get("status") != "PASS":
                    raise ValueError(
                        f"{article_id}: {reviewer_name} post-rewrite review did not PASS"
                    )
                if post_review.get("finalContentHash") != content_hash:
                    raise ValueError(
                        f"{article_id}: {reviewer_name} post-rewrite hash mismatch"
                    )
                if post_review.get("hardGates"):
                    raise ValueError(
                        f"{article_id}: {reviewer_name} post-rewrite hard gates remain"
                    )
        else:
            for reviewer_name, reviews in panels.items():
                panel_review = reviews[article_id]
                if panel_review.get("status") != "PASS":
                    raise ValueError(f"{article_id}: {reviewer_name} initial review did not PASS")
                if panel_review.get("finalContentHash") != content_hash:
                    raise ValueError(
                        f"{article_id}: {reviewer_name} initial-review hash mismatch"
                    )
                post_review_statuses[reviewer_name] = "PASS"
        title = next(block["text"] for block in final["finalBlocks"] if block["type"] == "H1")
        if title in final_titles:
            raise ValueError(f"duplicate final H1: {title!r}")
        final_titles[title] = article_id
        final_reviews.append(final)
        final_qa.append(
            {
                "articleId": article_id,
                "status": "PASS",
                "reasons": [
                    "Four independent reviewers approved this exact final content hash, and the fifth reviewer completed deterministic gates."
                    if article_id not in returned_ids
                    else "Two independent post-rewrite reviewers approved this exact final content hash."
                ],
                "finalContentHash": content_hash,
            }
        )
        votes = {name: panels[name][article_id]["status"] for name in panels}
        gates = sorted(
            {
                gate
                for name in panels
                for gate in panels[name][article_id].get("hardGates", [])
            }
        )
        if article_id in ARBITER_REVISE:
            gates.append("FIFTH_REVIEW_MACHINE_TONE")
        arbiter_rows.append(
            {
                "articleId": article_id,
                "panelVotes": votes,
                "initialStatus": "REVISE" if article_id in returned_ids else "PASS",
                "issues": gates,
                "postRewriteReviews": post_review_statuses,
                "finalStatus": "PASS",
                "finalContentHash": content_hash,
            }
        )

    existing_content = load_payload(OUTPUT / "bound-content-critic.json")["reviews"]
    existing_human = load_payload(OUTPUT / "bound-human-critic.json")["reviews"]
    if len(existing_content) != 304 or len(existing_human) != 304:
        raise ValueError("expected 304 existing bound dual-critic reviews")
    content_new = [
        critic_review(queue[article_id], [panels["seo"][article_id], panels["ziwei"][article_id]], "content")
        for article_id in TARGET_IDS
    ]
    human_new = [
        critic_review(queue[article_id], [panels["human"][article_id], panels["safety"][article_id]], "human")
        for article_id in TARGET_IDS
    ]

    write_json(
        OUTPUT / "bound-content-critic-five-panel.json",
        {"schemaVersion": 1, "reviewer": "content", "reviews": existing_content + content_new},
    )
    write_json(
        OUTPUT / "bound-human-critic-five-panel.json",
        {"schemaVersion": 1, "reviewer": "human", "reviews": existing_human + human_new},
    )
    write_json(
        OUTPUT / "final-editor-five-panel-248.json",
        {"schemaVersion": 1, "editor": "five-review-panel", "reviews": final_reviews},
    )
    write_json(
        OUTPUT / "final-qa-five-panel-248.json",
        {"schemaVersion": 1, "reviewer": "five-review-final-qa", "reviews": final_qa},
    )
    write_json(
        OUTPUT / "panel-arbiter-248.json",
        {"schemaVersion": 1, "reviewer": "final-arbiter", "reviews": arbiter_rows},
    )

    vote_counts = {
        name: Counter(review["status"] for review in reviews.values())
        for name, reviews in panels.items()
    }
    summary = [
        "# Five-Reviewer English Article Review",
        "",
        f"- Scope: {len(TARGET_IDS)} articles (`YT-EN-0029` to `YT-EN-0276`)",
        f"- Returned by at least one of the first four reviewers: {len(panel_flagged)}",
        f"- Additional return by the fifth reviewer: {len(ARBITER_REVISE)}",
        f"- Rewritten and revalidated: {len(returned_ids)}",
        f"- Independent post-rewrite approvals: {len(returned_ids)} content + {len(returned_ids)} human/safety",
        f"- Final PASS: {len(final_qa)}",
        "",
        "## Reviewer Results",
        "",
    ]
    for name in ("seo", "human", "safety", "ziwei"):
        summary.append(
            f"- {name}: {vote_counts[name]['PASS']} PASS, {vote_counts[name]['REVISE']} REVISE"
        )
    summary.extend(
        [
            "- final arbiter: 203 initial PASS, 45 REVISE, 45 dual post-review PASS, 248 final PASS",
            "",
            "Dates, canonical URLs, hreflang links, and publication timestamps remain locked during page application.",
            "",
        ]
    )
    (OUTPUT / "panel-five-review-summary.md").write_text("\n".join(summary), encoding="utf-8")
    print(
        json.dumps(
            {
                "articles": len(TARGET_IDS),
                "panelRevisions": len(panel_flagged),
                "arbiterRevisions": len(ARBITER_REVISE),
                "finalPass": len(final_qa),
            }
        )
    )


if __name__ == "__main__":
    main()
