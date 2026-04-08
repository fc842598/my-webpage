import importlib.util
import json
import time
from pathlib import Path


TMP_DIR = Path(__file__).resolve().parent
OUT_JSON = TMP_DIR / "tianji-hai-edge-samples.json"
REPORT_MD = TMP_DIR.parent / "docs" / "tianji-hai-edge-samples-report.md"

SLOT_TO_COMBO = {
    "亥": "亥(21~23)",
}

TARGET_SAMPLES = [
    # 5 solid / 51 years
    {"id": "hai-5solid-19300116-m", "date": "1930-01-16", "gender": "male", "expectedXian": "风天小畜", "expectedYears": 51},
    {"id": "hai-5solid-19300116-f", "date": "1930-01-16", "gender": "female", "expectedXian": "天风姤", "expectedYears": 51},
    {"id": "hai-5solid-19300124-m", "date": "1930-01-24", "gender": "male", "expectedXian": "天火同人", "expectedYears": 51},
    {"id": "hai-5solid-19300124-f", "date": "1930-01-24", "gender": "female", "expectedXian": "火天大有", "expectedYears": 51},
    {"id": "hai-5solid-19300216-m", "date": "1930-02-16", "gender": "male", "expectedXian": "天风姤", "expectedYears": 51},
    {"id": "hai-5solid-19300216-f", "date": "1930-02-16", "gender": "female", "expectedXian": "风天小畜", "expectedYears": 51},
    {"id": "hai-5solid-19300312-m", "date": "1930-03-12", "gender": "male", "expectedXian": "天风姤", "expectedYears": 51},
    {"id": "hai-5solid-19300312-f", "date": "1930-03-12", "gender": "female", "expectedXian": "风天小畜", "expectedYears": 51},

    # 0 solid / 36 years
    {"id": "hai-0solid-19300108-m", "date": "1930-01-08", "gender": "male", "expectedXian": "坤为地", "expectedYears": 36},
    {"id": "hai-0solid-19300108-f", "date": "1930-01-08", "gender": "female", "expectedXian": "坤为地", "expectedYears": 36},
    {"id": "hai-0solid-19300212-m", "date": "1930-02-12", "gender": "male", "expectedXian": "坤为地", "expectedYears": 36},
    {"id": "hai-0solid-19300212-f", "date": "1930-02-12", "gender": "female", "expectedXian": "坤为地", "expectedYears": 36},

    # 6 solid / 54 years
    {"id": "hai-6solid-19300225-m", "date": "1930-02-25", "gender": "male", "expectedXian": "乾为天", "expectedYears": 54},
    {"id": "hai-6solid-19300225-f", "date": "1930-02-25", "gender": "female", "expectedXian": "乾为天", "expectedYears": 54},
    {"id": "hai-6solid-19301027-m", "date": "1930-10-27", "gender": "male", "expectedXian": "乾为天", "expectedYears": 54},
    {"id": "hai-6solid-19301027-f", "date": "1930-10-27", "gender": "female", "expectedXian": "乾为天", "expectedYears": 54},
]


def load_collector():
    spec = importlib.util.spec_from_file_location("collector50", TMP_DIR / "collect_tianji_truth_50_real.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def normalize_sample(item):
    year, month, day = [int(part) for part in item["date"].split("-")]
    solid_tag = f"{item['expectedYears']}-years"
    return {
        "id": item["id"],
        "batchId": "hai-edge",
        "sampleGroup": "HAI-EDGE",
        "calendar": "solar",
        "inputBirth": item["date"],
        "year": year,
        "month": month,
        "day": day,
        "hour": 22,
        "minute": 0,
        "inputTimeText": SLOT_TO_COMBO["亥"],
        "gender": item["gender"],
        "civilSlot": "亥",
        "tags": ["hai-edge", solid_tag, item["gender"], "亥", item["expectedXian"]],
        "notes": f"亥时定向补样；预期先天={item['expectedXian']}；预期先天期={item['expectedYears']}",
    }


def write_report(results):
    if not results:
        REPORT_MD.write_text("# Tianji Hai Edge Samples Report\n\n- No results collected.\n", encoding="utf-8")
        return

    lines = ["# Tianji Hai Edge Samples Report", ""]
    lines.append(f"- collected: {len(results)}")
    lines.append("- slot: 亥 only")
    lines.append("")
    lines.append("## Samples")
    for row in results:
        lines.append(
            f"- {row['id']}: {row['inputBirth']} {row['gender']} / {row.get('pillars','')} / "
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
            result["expectedXian"] = item["expectedXian"]
            result["expectedYears"] = item["expectedYears"]
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
