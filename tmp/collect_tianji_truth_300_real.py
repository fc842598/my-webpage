import argparse
import importlib.util
import json
from pathlib import Path


TMP_DIR = Path(__file__).resolve().parent
BASE_50_JSON = TMP_DIR / "tianji-truth-50.json"
OUT_JSON = TMP_DIR / "tianji-truth-300.json"
REPORT_MD = TMP_DIR.parent / "docs" / "tianji-truth-300-report.md"

SLOT_TO_COMBO = {
    "early-zi": "早子(0~1)",
    "丑": "丑(1~3)",
    "寅": "寅(3~5)",
    "卯": "卯(5~7)",
    "辰": "辰(7~9)",
    "巳": "巳(9~11)",
    "午": "午(11~13)",
    "未": "未(13~15)",
    "申": "申(15~17)",
    "酉": "酉(17~19)",
    "戌": "戌(19~21)",
    "亥": "亥(21~23)",
    "night-zi": "夜子(23~24)",
}

SLOTS = [
    ("early-zi", 0, 30),
    ("丑", 2, 0),
    ("寅", 4, 0),
    ("卯", 6, 0),
    ("辰", 8, 0),
    ("巳", 10, 0),
    ("午", 12, 0),
    ("未", 14, 0),
    ("申", 16, 0),
    ("酉", 18, 0),
    ("戌", 20, 0),
    ("亥", 22, 0),
    ("night-zi", 23, 30),
]

ANCHOR_DATES = [
    ("E", "1966-06-25", "verified-anchor"),
    ("F", "1969-03-26", "verified-anchor"),
    ("G", "1971-10-06", "verified-anchor"),
    ("H", "1984-04-08", "verified-anchor"),
    ("I", "1991-02-16", "verified-anchor"),
    ("J", "1996-01-02", "verified-anchor"),
    ("K", "1999-12-26", "user-problem-anchor"),
    ("L", "2021-03-28", "verified-anchor"),
    ("M", "1930-02-18", "edge-anchor"),
]

BOUNDARY_YEARS = [1930, 1966, 1996, 2021]


def load_json(path):
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def load_collector():
    spec = importlib.util.spec_from_file_location("collector50", TMP_DIR / "collect_tianji_truth_50_real.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_full_day_group(group, date_text, major_tag):
    year, month, day = [int(part) for part in date_text.split("-")]
    samples = []
    for gender in ("male", "female"):
        for slot, hour, minute in SLOTS:
            samples.append({
                "id": f"{group}-{date_text.replace('-', '')}-{gender[:1]}-{slot}",
                "sampleGroup": group,
                "calendar": "solar",
                "inputBirth": date_text,
                "year": year,
                "month": month,
                "day": day,
                "hour": hour,
                "minute": minute,
                "inputTimeText": SLOT_TO_COMBO[slot],
                "gender": gender,
                "civilSlot": slot,
                "tags": ["full-day", major_tag, gender, slot],
                "notes": f"300-sample full-day matrix for {date_text}",
            })
    return samples


def build_boundary_group():
    samples = []
    rows = [
        (2, 3, 23, 30, "night-zi", "lichun-pre-night-zi"),
        (2, 4, 0, 30, "early-zi", "lichun-post-early-zi"),
    ]
    for year in BOUNDARY_YEARS:
        for gender in ("male", "female"):
            for month, day, hour, minute, slot, label in rows:
                samples.append({
                    "id": f"N-{year}{month:02d}{day:02d}-{gender[:1]}-{slot}",
                    "sampleGroup": "N",
                    "calendar": "solar",
                    "inputBirth": f"{year}-{month:02d}-{day:02d}",
                    "year": year,
                    "month": month,
                    "day": day,
                    "hour": hour,
                    "minute": minute,
                    "inputTimeText": SLOT_TO_COMBO[slot],
                    "gender": gender,
                    "civilSlot": slot,
                    "tags": ["boundary", "lichun", str(year), gender, slot, label],
                    "notes": f"300-sample lichun boundary case for {year}",
                })
    return samples


def build_new_samples():
    samples = []
    for group, date_text, tag in ANCHOR_DATES:
        samples.extend(build_full_day_group(group, date_text, tag))
    samples.extend(build_boundary_group())
    assert len(samples) == 250, len(samples)
    for idx, sample in enumerate(samples, start=51):
        batch_no = ((idx - 1) // 25) + 1
        sample["batchId"] = f"batch-{batch_no:02d}"
    return samples


def merge_existing(base_50, extra_results):
    merged = {}
    for item in base_50:
        merged[item["id"]] = item
    for item in extra_results:
        merged[item["id"]] = item
    return list(merged.values())


def write_report(combined, pending_count):
    from collections import Counter

    group_counts = Counter(item["sampleGroup"] for item in combined)
    gender_counts = Counter(item["gender"] for item in combined)
    slot_counts = Counter(item["civilSlot"] for item in combined)
    liunian_nonempty = sum(1 for item in combined if item.get("liunian"))

    lines = []
    lines.append("# Tianji Truth 300 Report")
    lines.append("")
    lines.append(f"- Current collected samples: {len(combined)} / 300")
    lines.append(f"- Remaining pending samples: {pending_count}")
    lines.append(f"- `liunian` captured: {liunian_nonempty}/{len(combined)}")
    lines.append("- Existing 50-base file reused as the first completed tranche")
    lines.append("")
    lines.append("## Group Counts")
    for key in sorted(group_counts):
        lines.append(f"- {key}: {group_counts[key]}")
    lines.append("")
    lines.append("## Gender Counts")
    for key in sorted(gender_counts):
        lines.append(f"- {key}: {gender_counts[key]}")
    lines.append("")
    lines.append("## Civil Slot Counts")
    slot_order = ["night-zi", "early-zi", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    for key in slot_order:
        if key in slot_counts:
            lines.append(f"- {key}: {slot_counts[key]}")
    lines.append("")
    lines.append("## Sample Design")
    lines.append("- Existing 50: one 1991 control matrix + 1991 boundary/season/day-variation groups")
    lines.append("- New 234: nine full-day matrices on known verified, problematic, and edge anchor dates")
    lines.append("- New 16: lichun split-zi boundary cases across 1930 / 1966 / 1996 / 2021")
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=25, help="How many new samples to collect this run")
    parser.add_argument("--dry-run", action="store_true", help="Only print plan and counts without launching Tianji")
    args = parser.parse_args()

    base_50 = load_json(BASE_50_JSON)
    if len(base_50) != 50:
        raise SystemExit("Base 50 JSON is missing or not exactly 50 samples")

    new_catalog = build_new_samples()
    existing_extra = load_json(OUT_JSON)
    existing_ids = {item["id"] for item in existing_extra}
    pending = [sample for sample in new_catalog if sample["id"] not in existing_ids]

    combined_now = merge_existing(base_50, existing_extra)
    write_report(combined_now, len(pending))

    print(f"base50={len(base_50)} existing_extra={len(existing_extra)} pending={len(pending)} combined_now={len(combined_now)}")
    if pending:
        print("next ids:", [sample["id"] for sample in pending[:min(5, len(pending))]])

    if args.dry_run:
        return

    if not pending:
        print("No pending samples left.")
        return

    collector = load_collector()
    proc, main_hwnd, input_dlg_hwnd = collector.launch_tianji()
    if not main_hwnd or not input_dlg_hwnd:
        raise SystemExit("Failed to locate Tianji main window/dialog")

    results = list(existing_extra)
    start_index = len(base_50) + len(existing_extra) + 1
    to_collect = pending[:args.limit]
    for offset, sample in enumerate(to_collect):
        global_index = start_index + offset
        result = collector.collect_one(main_hwnd, input_dlg_hwnd, sample, global_index, 300)
        if not (result["pillars"] and result["xiantian"] and result["houtian"] and result.get("liunian")):
            result["notes"] += " | incomplete-read"
        results.append(result)
        OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    try:
        proc.terminate()
    except Exception:
        pass

    combined_final = merge_existing(base_50, results)
    write_report(combined_final, len(pending) - len(to_collect))
    print(f"collected_this_run={len(to_collect)} combined_total={len(combined_final)} pending_left={300-len(combined_final)}")


if __name__ == "__main__":
    main()
