"""
Collect cross-decade TianJi truth samples for the tianR=25 + isYangPerson=false pocket.

Purpose:
- Verify the conditional xiantian entry rule outside the 1930 pocket.
- Record only software truth: pillars, xiantian, houtian.
"""
import ctypes
import ctypes.wintypes as wt
import json
import sys
import subprocess
import time
from pathlib import Path

user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Users\1\Desktop\家里用的图标\tmp\tianji-portable\天纪-portable.exe"
OUT_JSON = Path(__file__).parent / "tianji-tianr25-cross-decade-samples.json"

WM_GETTEXT = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT = 0x000C
BM_CLICK = 0x00F5
CB_SETCURSEL = 0x014E
CB_GETCOUNT = 0x0146
CB_GETLBTEXT = 0x0148
CB_GETLBTEXTLEN = 0x0149
WNDENUMPROC = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)

SAMPLES = [
    {"id": "1926-01-06-0000-m", "birth": (1926, 1, 6, 0, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "1920s", "male", "early-zi"]},
    {"id": "1926-02-12-1100-f", "birth": (1926, 2, 12, 11, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "1920s", "female", "wu-hour"]},
    {"id": "1940-01-03-1900-m", "birth": (1940, 1, 3, 19, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "1940s", "male", "xu-hour"]},
    {"id": "1940-02-06-0000-f", "birth": (1940, 2, 6, 0, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "1940s", "female", "early-zi"]},
    {"id": "1960-01-01-1500-m", "birth": (1960, 1, 1, 15, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "1960s", "male", "shen-hour"]},
    {"id": "1960-02-09-1100-f", "birth": (1960, 2, 9, 11, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "1960s", "female", "wu-hour"]},
    {"id": "1980-01-01-0000-m", "birth": (1980, 1, 1, 0, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "1980s", "male", "early-zi"]},
    {"id": "1980-02-07-0000-f", "birth": (1980, 2, 7, 0, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "1980s", "female", "early-zi"]},
    {"id": "2000-01-05-1100-m", "birth": (2000, 1, 5, 11, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "2000s", "male", "wu-hour"]},
    {"id": "2000-02-04-1900-f", "birth": (2000, 2, 4, 19, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "2000s", "female", "xu-hour"]},
    {"id": "2020-01-02-1500-m", "birth": (2020, 1, 2, 15, 0), "gender": "male", "coverageTags": ["tianR25", "yin-person", "2020s", "male", "shen-hour"]},
    {"id": "2020-02-04-0700-f", "birth": (2020, 2, 4, 7, 0), "gender": "female", "coverageTags": ["tianR25", "yin-person", "2020s", "female", "chen-hour"]},
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
    return user32.SendMessageW(hwnd, WM_SETTEXT, 0, text)


def get_class(hwnd):
    buf = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, buf, 256)
    return buf.value


def click(hwnd):
    user32.SendMessageW(hwnd, BM_CLICK, 0, 0)


def get_window_pid(hwnd):
    pid = wt.DWORD()
    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    return pid.value


def find_main_by_pid(target_pid):
    found = []

    def cb(hwnd, _):
        if not user32.IsWindowVisible(hwnd):
            return True
        if user32.GetParent(hwnd) != 0:
            return True
        if get_window_pid(hwnd) != target_pid:
            return True
        if "Afx:400000" in get_class(hwnd):
            found.append(hwnd)
        return True

    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found


def find_dialog(main_hwnd):
    children = []

    def cb(hwnd, _):
        children.append(hwnd)
        return True

    user32.EnumChildWindows(main_hwnd, WNDENUMPROC(cb), 0)
    for hwnd in children:
        if get_class(hwnd) == "#32770" and user32.GetDlgItem(hwnd, 1014):
            return hwnd
    return None


def get_combo_items(hwnd):
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


def select_combo_hour(combo_hwnd, civil_hour):
    branch_map = {
        0: "早子", 23: "夜子",
        1: "丑", 2: "丑", 3: "寅", 4: "寅",
        5: "卯", 6: "卯", 7: "辰", 8: "辰",
        9: "巳", 10: "巳", 11: "午", 12: "午",
        13: "未", 14: "未", 15: "申", 16: "申",
        17: "酉", 18: "酉", 19: "戌", 20: "戌",
        21: "亥", 22: "亥",
    }
    target = branch_map.get(civil_hour, "子")
    for idx, item in enumerate(get_combo_items(combo_hwnd)):
        if target in item:
            user32.SendMessageW(combo_hwnd, CB_SETCURSEL, idx, 0)
            return item
    return ""


def read_all_text(root_hwnd):
    children = []

    def cb(hwnd, _):
        children.append(hwnd)
        return True

    user32.EnumChildWindows(root_hwnd, WNDENUMPROC(cb), 0)
    texts = []
    for hwnd in children:
        text = get_text(hwnd).strip()
        if text:
            texts.append(text)
    return texts


def extract_value(texts, prefix):
    for text in texts:
        if prefix in text:
            return text.replace(prefix, "").replace(":", "").replace("：", "").strip()
    return ""


def kill_all():
    subprocess.run(["taskkill", "/F", "/IM", "天纪-portable.exe"], capture_output=True)
    time.sleep(1.5)


def collect_sample(sample):
    year, month, day, hour, minute = sample["birth"]
    kill_all()
    proc = subprocess.Popen([TIANJI_EXE])
    time.sleep(5)

    mains = find_main_by_pid(proc.pid)
    if not mains:
        raise RuntimeError("main window not found")
    main_hwnd = mains[0]
    dialog_hwnd = find_dialog(main_hwnd)
    if not dialog_hwnd:
        raise RuntimeError("dialog not found")

    year_hwnd = user32.GetDlgItem(dialog_hwnd, 1014)
    month_hwnd = user32.GetDlgItem(dialog_hwnd, 1270)
    day_hwnd = user32.GetDlgItem(dialog_hwnd, 1271)
    combo_hwnd = user32.GetDlgItem(dialog_hwnd, 1015)
    calc_hwnd = user32.GetDlgItem(dialog_hwnd, 1024)
    male_hwnd = user32.GetDlgItem(dialog_hwnd, 1033)
    female_hwnd = user32.GetDlgItem(dialog_hwnd, 1034)

    click(female_hwnd if sample["gender"] == "female" else male_hwnd)
    time.sleep(0.2)

    set_text(year_hwnd, str(year))
    set_text(month_hwnd, str(month))
    set_text(day_hwnd, str(day))
    selected_combo = select_combo_hour(combo_hwnd, hour)
    time.sleep(0.2)

    click(calc_hwnd)
    time.sleep(2)

    texts = read_all_text(main_hwnd)
    result = {
        "id": sample["id"],
        "birth": f"{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
        "gender": sample["gender"],
        "comboSelected": selected_combo,
        "genderText": next((text for text in texts if text in ("阳女", "阴女", "阳男", "阴男")), ""),
        "pillars": extract_value(texts, "四柱"),
        "xiantian": extract_value(texts, "先天卦"),
        "houtian": extract_value(texts, "后天卦"),
        "coverageTags": sample["coverageTags"],
    }

    try:
        proc.terminate()
    except Exception:
        pass
    time.sleep(1)
    return result


def main():
    existing = []
    if OUT_JSON.exists():
        try:
            existing = json.loads(OUT_JSON.read_text(encoding="utf-8"))
        except Exception:
            existing = []
    rows_by_id = {row.get("id"): row for row in existing if isinstance(row, dict)}
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end = int(sys.argv[2]) if len(sys.argv) > 2 else len(SAMPLES)
    for sample in SAMPLES[start:end]:
        row = collect_sample(sample)
        rows_by_id[row["id"]] = row
        print(json.dumps(row, ensure_ascii=False))
        ordered = [rows_by_id[sample["id"]] for sample in SAMPLES if sample["id"] in rows_by_id]
        OUT_JSON.write_text(json.dumps(ordered, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
