import importlib.util
import json
import time
from pathlib import Path


TMP_DIR = Path(__file__).resolve().parent
OUT_JSON = TMP_DIR / "tianji-female-qian-hai-boundary-samples.json"
REPORT_MD = TMP_DIR.parent / "docs" / "tianji-female-qian-hai-boundary-samples-report.md"

TARGET_SAMPLES = [
    {"id": "fqh-b-19330131", "date": "1933-01-31", "expectedMonthBranch": "丑"},
    {"id": "fqh-b-19370324", "date": "1937-03-24", "expectedMonthBranch": "卯"},
    {"id": "fqh-b-19330516", "date": "1933-05-16", "expectedMonthBranch": "巳"},
    {"id": "fqh-b-19310727", "date": "1931-07-27", "expectedMonthBranch": "未"},
    {"id": "fqh-b-19310906", "date": "1931-09-06", "expectedMonthBranch": "申"},
    {"id": "fqh-b-19340821", "date": "1934-08-21", "expectedMonthBranch": "申"},
]


def load_collector():
    spec = importlib.util.spec_from_file_location("collector50", TMP_DIR / "collect_tianji_truth_50_real.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def normalize_sample(item):
    year, month, day = [int(part) for part in item["date"].split("-")]
    return {
        "id": item["id"],
        "batchId": "female-qian-hai-boundary",
        "sampleGroup": "FQHB",
        "calendar": "solar",
        "inputBirth": item["date"],
        "year": year,
        "month": month,
        "day": day,
        "hour": 22,
        "minute": 0,
        "inputTimeText": "亥(21~23)",
        "gender": "female",
        "civilSlot": "亥",
        "tags": ["female-qian-hai-boundary", item["expectedMonthBranch"], "female", "亥"],
        "notes": f"女命亥时乾为天边界补样，目标月支={item['expectedMonthBranch']}",
    }


def write_report(results):
    if not results:
        REPORT_MD.write_text("# Tianji Female Qian-Hai Boundary Samples Report\n\n- No results collected.\n", encoding="utf-8")
        return

    lines = ["# Tianji Female Qian-Hai Boundary Samples Report", ""]
    lines.append(f"- collected: {len(results)}")
    lines.append("- slot: 亥 only")
    lines.append("- gender: female only")
    lines.append("")
    lines.append("## Samples")
    for row in results:
        lines.append(
            f"- {row['id']}: {row['inputBirth']} / {row.get('pillars','')} / "
            f"{row.get('xiantian','')} / {row.get('houtian','')} / liunian={len(row.get('liunian') or [])}"
        )
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    collector = load_collector()
    proc, main_hwnd, input_dlg_hwnd = collector.launch_tianji()
    if not main_hwnd or not input_dlg_hwnd:
        raise SystemExit("Failed to locate Tianji main window/dialog")

    results = []
    try:
        total = len(TARGET_SAMPLES)
        for index, item in enumerate(TARGET_SAMPLES, start=1):
            sample = normalize_sample(item)
            result = collector.collect_one(main_hwnd, input_dlg_hwnd, sample, index, total)
            result["expectedMonthBranch"] = item["expectedMonthBranch"]
            results.append(result)
            OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
            time.sleep(0.1)
    finally:
        try:
            proc.terminate()
        except Exception:
            pass

    write_report(results)
    print(f"collected={len(results)} -> {OUT_JSON}")


if __name__ == "__main__":
    main()
