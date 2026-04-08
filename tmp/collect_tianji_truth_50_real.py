import ctypes
import ctypes.wintypes as wt
import json
import re
import subprocess
import time
from pathlib import Path

try:
    from PIL import ImageGrab
except Exception:
    ImageGrab = None

try:
    from pywinauto import Application
except Exception:
    Application = None


user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
TMP_DIR = Path(__file__).resolve().parent
OUT_JSON = TMP_DIR / "tianji-truth-50.json"
REPORT_MD = TMP_DIR.parent / "docs" / "tianji-truth-50-report.md"
RAW_DIR = TMP_DIR / "tianji-truth-raw"
RAW_DIR.mkdir(exist_ok=True)

WM_GETTEXT = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT = 0x000C
BM_CLICK = 0x00F5
CB_SETCURSEL = 0x014E
CB_GETCOUNT = 0x0146
CB_GETLBTEXT = 0x0148
CB_GETLBTEXTLEN = 0x0149

CTRL_YEAR = 1014
CTRL_MONTH = 1270
CTRL_DAY = 1271
CTRL_TIME = 1015
CTRL_CALC = 1024
CTRL_MALE = 1033
CTRL_FEMALE = 1034
CTRL_LIUNIAN_LIST = 1041

WNDENUMPROC = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)


class RECT(ctypes.Structure):
    _fields_ = [
        ("left", wt.LONG),
        ("top", wt.LONG),
        ("right", wt.LONG),
        ("bottom", wt.LONG),
    ]


def get_text(hwnd):
    if not hwnd:
        return ""
    n = user32.SendMessageW(hwnd, WM_GETTEXTLENGTH, 0, 0)
    if n <= 0:
        return ""
    buf = ctypes.create_unicode_buffer(n + 2)
    user32.SendMessageW(hwnd, WM_GETTEXT, n + 1, buf)
    return buf.value


def set_text(hwnd, text):
    if hwnd:
        user32.SendMessageW(hwnd, WM_SETTEXT, 0, str(text))


def click(hwnd):
    if hwnd:
        user32.SendMessageW(hwnd, BM_CLICK, 0, 0)


def get_class(hwnd):
    if not hwnd:
        return ""
    buf = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, buf, 256)
    return buf.value


def get_rect(hwnd):
    rect = RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(rect))
    return rect


def enum_children(parent):
    items = []

    def cb(hwnd, _):
        items.append(hwnd)
        return True

    user32.EnumChildWindows(parent, WNDENUMPROC(cb), 0)
    return items


def get_combo_items(hwnd):
    if not hwnd:
        return []
    count = user32.SendMessageW(hwnd, CB_GETCOUNT, 0, 0)
    items = []
    for i in range(count):
        length = user32.SendMessageW(hwnd, CB_GETLBTEXTLEN, i, 0)
        if length <= 0:
            items.append("")
            continue
        buf = ctypes.create_unicode_buffer(length + 2)
        user32.SendMessageW(hwnd, CB_GETLBTEXT, i, buf)
        items.append(buf.value)
    return items


def find_main_window(expected_pid):
    found = []

    def cb(hwnd, _):
        if not user32.IsWindowVisible(hwnd):
            return True
        if user32.GetParent(hwnd) != 0:
            return True
        pid = wt.DWORD()
        user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
        if pid.value == expected_pid and "Afx:400000" in get_class(hwnd):
            found.append(hwnd)
        return True

    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found[0] if found else None


def find_input_dialog(main_hwnd):
    best = None
    best_score = -1
    for child in enum_children(main_hwnd):
        if get_class(child) != "#32770":
            continue
        score = 0
        for ctrl_id in (CTRL_YEAR, CTRL_MONTH, CTRL_DAY, CTRL_TIME, CTRL_CALC):
            if user32.GetDlgItem(child, ctrl_id):
                score += 1
        if score > best_score:
            best = child
            best_score = score
    return best


def kill_tianji():
    subprocess.run(["taskkill", "/F", "/IM", "天纪.exe"], capture_output=True)
    time.sleep(1.2)


def launch_tianji():
    proc = subprocess.Popen([TIANJI_EXE])
    for _ in range(80):
        hwnd = find_main_window(proc.pid)
        if hwnd:
            dlg = find_input_dialog(hwnd)
            if dlg:
                return proc, hwnd, dlg
        time.sleep(0.25)
    return proc, None, None


def read_all_texts(hwnd):
    texts = []
    for child in enum_children(hwnd):
        text = get_text(child).strip()
        if text:
            texts.append({"hwnd": hex(child), "class": get_class(child), "text": text})
    return texts


def extract_fields(text_rows):
    texts = [row["text"] for row in text_rows]
    fields = {
        "genderText": "",
        "wuxing": "",
        "lunar": "",
        "pillarsRaw": "",
        "xiantianRaw": "",
        "houtianRaw": "",
    }
    for t in texts:
        if t in {"阳男", "阴男", "阳女", "阴女"}:
            fields["genderText"] = t
        elif not fields["wuxing"] and re.search(r"[木火土金水].*局$", t):
            fields["wuxing"] = t
        elif not fields["lunar"] and "年" in t and "月" in t and "四柱" not in t and "先天卦" not in t and "后天卦" not in t:
            fields["lunar"] = t
        elif "四柱" in t:
            fields["pillarsRaw"] = t
        elif "先天卦" in t:
            fields["xiantianRaw"] = t
        elif "后天卦" in t:
            fields["houtianRaw"] = t
    return fields


def clean_label(value, prefix):
    return value.replace(prefix, "").replace(":", "").replace("：", "").strip()


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


def build_samples():
    slots = [
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
    samples = []

    # A: full-day control group, 26 samples
    for gender in ("male", "female"):
        for slot, hour, minute in slots:
            samples.append({
                "id": f"A-19910615-{gender[:1]}-{slot}",
                "batchId": "batch-01",
                "sampleGroup": "A",
                "calendar": "solar",
                "inputBirth": "1991-06-15",
                "year": 1991,
                "month": 6,
                "day": 15,
                "hour": hour,
                "minute": minute,
                "inputTimeText": SLOT_TO_COMBO[slot],
                "gender": gender,
                "civilSlot": slot,
                "tags": ["control", "full-day", slot, gender],
                "notes": "full-day control group on fixed ordinary date",
            })

    # B: lichun / year-edge style boundary group, 8 samples
    boundary_rows = [
        (1991, 2, 3, 23, 30, "night-zi"),
        (1991, 2, 4, 0, 30, "early-zi"),
        (1991, 2, 4, 23, 30, "night-zi"),
        (1991, 2, 5, 0, 30, "early-zi"),
    ]
    for gender in ("male", "female"):
        for y, m, d, h, mm, slot in boundary_rows:
            samples.append({
                "id": f"B-{y}{m:02d}{d:02d}-{gender[:1]}-{slot}",
                "batchId": "batch-01",
                "sampleGroup": "B",
                "calendar": "solar",
                "inputBirth": f"{y}-{m:02d}-{d:02d}",
                "year": y,
                "month": m,
                "day": d,
                "hour": h,
                "minute": mm,
                "inputTimeText": SLOT_TO_COMBO[slot],
                "gender": gender,
                "civilSlot": slot,
                "tags": ["boundary", "lichun-window", slot, gender],
                "notes": "boundary group around lichun window with split zi hours",
            })

    # C: seasonal group, 8 samples
    seasonal_days = [
        (1991, 3, 21),
        (1991, 6, 21),
        (1991, 9, 23),
        (1991, 12, 21),
    ]
    for gender in ("male", "female"):
        for y, m, d in seasonal_days:
            samples.append({
                "id": f"C-{y}{m:02d}{d:02d}-{gender[:1]}-hai",
                "batchId": "batch-02",
                "sampleGroup": "C",
                "calendar": "solar",
                "inputBirth": f"{y}-{m:02d}-{d:02d}",
                "year": y,
                "month": m,
                "day": d,
                "hour": 22,
                "minute": 0,
                "inputTimeText": SLOT_TO_COMBO["亥"],
                "gender": gender,
                "civilSlot": "亥",
                "tags": ["seasonal", f"month-{m}", gender],
                "notes": "seasonal fixed-slot comparison",
            })

    # D: consecutive-day variation group, 8 samples
    day_variations = [
        (1991, 6, 10),
        (1991, 6, 11),
        (1991, 6, 12),
        (1991, 6, 13),
    ]
    for gender in ("male", "female"):
        for y, m, d in day_variations:
            samples.append({
                "id": f"D-{y}{m:02d}{d:02d}-{gender[:1]}-hai",
                "batchId": "batch-02",
                "sampleGroup": "D",
                "calendar": "solar",
                "inputBirth": f"{y}-{m:02d}-{d:02d}",
                "year": y,
                "month": m,
                "day": d,
                "hour": 22,
                "minute": 0,
                "inputTimeText": SLOT_TO_COMBO["亥"],
                "gender": gender,
                "civilSlot": "亥",
                "tags": ["day-variation", gender],
                "notes": "consecutive-day fixed-slot comparison",
            })

    assert len(samples) == 50
    return samples


def save_window_screenshot(hwnd, out_path):
    if ImageGrab is None:
        return False
    try:
        rect = get_rect(hwnd)
        image = ImageGrab.grab(bbox=(rect.left, rect.top, rect.right, rect.bottom))
        image.save(out_path)
        return True
    except Exception:
        return False


def select_combo_item(combo_hwnd, target_text):
    items = get_combo_items(combo_hwnd)
    for idx, item in enumerate(items):
        if item == target_text:
            user32.SendMessageW(combo_hwnd, CB_SETCURSEL, idx, 0)
            return item
    return get_text(combo_hwnd).strip()


def read_current_result(main_hwnd):
    text_rows = read_all_texts(main_hwnd)
    fields = extract_fields(text_rows)
    return text_rows, fields


def read_liunian_rows(main_hwnd):
    if Application is None:
        return []
    try:
        app = Application(backend="win32").connect(handle=main_hwnd)
        win = app.window(handle=main_hwnd)
        lv = win.child_window(control_id=CTRL_LIUNIAN_LIST, class_name="SysListView32").wrapper_object()
        count = lv.item_count()
        rows = []
        for i in range(count):
            age = lv.get_item(i, 0).text()
            bits = lv.get_item(i, 1).text()
            gua = lv.get_item(i, 2).text()
            line = lv.get_item(i, 3).text()
            rows.append({
                "age": age.strip(),
                "bits": bits.strip(),
                "gua": gua.strip(),
                "line": line.strip(),
            })
        return rows
    except Exception:
        return []


def collect_one(main_hwnd, input_dlg_hwnd, sample, index, total):
    year_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_YEAR)
    month_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_MONTH)
    day_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_DAY)
    time_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_TIME)
    calc_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_CALC)
    male_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_MALE)
    female_hwnd = user32.GetDlgItem(input_dlg_hwnd, CTRL_FEMALE)

    if not all((year_hwnd, month_hwnd, day_hwnd, time_hwnd, calc_hwnd)):
        raise RuntimeError("Missing input controls on Tianji dialog")

    if sample["gender"] == "male":
        click(male_hwnd)
    else:
        click(female_hwnd)
    time.sleep(0.1)

    set_text(year_hwnd, sample["year"])
    set_text(month_hwnd, sample["month"])
    set_text(day_hwnd, sample["day"])
    time.sleep(0.05)
    combo_selected = select_combo_item(time_hwnd, sample["inputTimeText"])
    time.sleep(0.05)

    prev_text_rows, prev_fields = read_current_result(main_hwnd)
    prev_signature = "|".join([prev_fields.get("pillarsRaw", ""), prev_fields.get("xiantianRaw", ""), prev_fields.get("houtianRaw", "")])

    click(calc_hwnd)
    fields = {}
    text_rows = []
    for _ in range(25):
        time.sleep(0.2)
        text_rows, fields = read_current_result(main_hwnd)
        signature = "|".join([fields.get("pillarsRaw", ""), fields.get("xiantianRaw", ""), fields.get("houtianRaw", "")])
        if fields.get("pillarsRaw") and fields.get("xiantianRaw") and fields.get("houtianRaw") and signature != prev_signature:
            break
    if not fields.get("pillarsRaw") or not fields.get("xiantianRaw") or not fields.get("houtianRaw"):
        click(calc_hwnd)
        for _ in range(20):
            time.sleep(0.2)
            text_rows, fields = read_current_result(main_hwnd)
            if fields.get("pillarsRaw") and fields.get("xiantianRaw") and fields.get("houtianRaw"):
                break

    base_name = f"{index:02d}-{sample['sampleGroup']}-{sample['gender'][0]}-{sample['civilSlot']}-{sample['year']}{sample['month']:02d}{sample['day']:02d}"
    raw_text_path = RAW_DIR / f"{base_name}.txt"
    screenshot_path = RAW_DIR / f"{base_name}.png"
    with raw_text_path.open("w", encoding="utf-8") as f:
        f.write(f"id: {sample['id']}\n")
        f.write(f"birth: {sample['inputBirth']} {sample['hour']:02d}:{sample['minute']:02d}\n")
        f.write(f"gender: {sample['gender']}\n")
        f.write(f"comboSelected: {combo_selected}\n\n")
        for row in text_rows:
            f.write(f"[{row['class']}] {row['text']}\n")
    save_window_screenshot(main_hwnd, screenshot_path)
    liunian_rows = read_liunian_rows(main_hwnd)

    return {
        "id": sample["id"],
        "batchId": sample["batchId"],
        "sampleGroup": sample["sampleGroup"],
        "calendar": sample["calendar"],
        "inputBirth": sample["inputBirth"],
        "inputTimeText": sample["inputTimeText"],
        "location": None,
        "gender": sample["gender"],
        "civilSlot": sample["civilSlot"],
        "pillars": clean_label(fields.get("pillarsRaw", ""), "四柱"),
        "xiantian": clean_label(fields.get("xiantianRaw", ""), "先天卦"),
        "houtian": clean_label(fields.get("houtianRaw", ""), "后天卦"),
        "liunian": liunian_rows,
        "source": "tianji.exe",
        "collectedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "notes": sample["notes"],
        "rawTextPath": str(raw_text_path),
        "screenshotPath": str(screenshot_path),
        "coverageTags": sample["tags"],
        "inputEcho": {
            "year": str(sample["year"]),
            "month": str(sample["month"]),
            "day": str(sample["day"]),
            "combo": combo_selected,
        },
        "genderText": fields.get("genderText", ""),
        "wuxing": fields.get("wuxing", ""),
        "lunar": fields.get("lunar", ""),
    }


def write_report(results):
    gender_counts = {}
    slot_counts = {}
    group_counts = {}
    liunian_nonempty = 0
    for item in results:
        gender_counts[item["gender"]] = gender_counts.get(item["gender"], 0) + 1
        slot_counts[item["civilSlot"]] = slot_counts.get(item["civilSlot"], 0) + 1
        group_counts[item["sampleGroup"]] = group_counts.get(item["sampleGroup"], 0) + 1
        if item.get("liunian"):
            liunian_nonempty += 1

    lines = []
    lines.append("# Tianji Truth 50 Report")
    lines.append("")
    lines.append(f"- Total samples: {len(results)}")
    lines.append(f"- Generated at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("- Source: `天纪.exe` real window capture")
    lines.append("- Location field: not available in this desktop Tianji form; recorded as `null`")
    lines.append(f"- `liunian` captured: {liunian_nonempty}/{len(results)}")
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
    lines.append("## Sample Index")
    for item in results:
        lines.append(f"- `{item['id']}` | {item['gender']} | {item['inputBirth']} {item['inputTimeText']} | {item['xiantian']} -> {item['houtian']}")
    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    samples = build_samples()
    kill_tianji()
    proc, main_hwnd, input_dlg_hwnd = launch_tianji()
    if not main_hwnd or not input_dlg_hwnd:
        raise SystemExit("Failed to locate Tianji main window")

    results = []

    # Pilot first
    pilot = collect_one(main_hwnd, input_dlg_hwnd, samples[0], 1, len(samples))
    if not (pilot["pillars"] and pilot["xiantian"] and pilot["houtian"]):
        raise SystemExit("Pilot sample failed to read required fields")
    results.append(pilot)
    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    for idx, sample in enumerate(samples[1:], start=2):
        result = collect_one(main_hwnd, input_dlg_hwnd, sample, idx, len(samples))
        if not (result["pillars"] and result["xiantian"] and result["houtian"]):
            result["notes"] += " | incomplete-read"
        results.append(result)
        OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    write_report(results)

    try:
        proc.terminate()
    except Exception:
        pass

    print(f"done: {len(results)} samples -> {OUT_JSON}")
    print(f"report -> {REPORT_MD}")


if __name__ == "__main__":
    main()
