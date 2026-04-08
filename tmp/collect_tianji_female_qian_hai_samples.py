import importlib.util
import json
import time
from pathlib import Path


TMP_DIR = Path(__file__).resolve().parent
OUT_JSON = TMP_DIR / "tianji-female-qian-hai-samples.json"
REPORT_MD = TMP_DIR.parent / "docs" / "tianji-female-qian-hai-samples-report.md"

TARGET_SAMPLES = [
    {"id": "fqh-19301111", "date": "1930-11-11"},
    {"id": "fqh-19301207", "date": "1930-12-07"},
    {"id": "fqh-19301212", "date": "1930-12-12"},
    {"id": "fqh-19301219", "date": "1930-12-19"},
    {"id": "fqh-19310407", "date": "1931-04-07"},
    {"id": "fqh-19310616", "date": "1931-06-16"},
    {"id": "fqh-19310926", "date": "1931-09-26"},
    {"id": "fqh-19311121", "date": "1931-11-21"},
    {"id": "fqh-19340923", "date": "1934-09-23"},
    {"id": "fqh-19341030", "date": "1934-10-30"},
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
        "batchId": "female-qian-hai",
        "sampleGroup": "FQH",
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
        "tags": ["female-qian-hai", "female", "亥"],
        "notes": "女命亥时乾为天候选补样，用于拆最后的女性特例分流",
    }


def write_report(results):
    if not results:
        REPORT_MD.write_text("# Tianji Female Qian-Hai Samples Report\n\n- No results collected.\n", encoding="utf-8")
        return

    lines = ["# Tianji Female Qian-Hai Samples Report", ""]
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
