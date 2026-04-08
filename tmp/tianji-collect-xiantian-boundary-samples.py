"""
采集天纪先天卦边界样本

目的：
- 围绕 1930-01-18 21:00 女 这条“软件先天卦=震为雷，本地=水雷屯”的边界盘
- 继续抓 4 条同类 tianR=10 候选，确认是否存在固定的先天卦映射口子
"""
import ctypes
import ctypes.wintypes as wt
import json
import subprocess
import time
from pathlib import Path

user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON = Path(__file__).parent / "tianji-xiantian-boundary-samples.json"

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
    {
        "id": "1930-01-18-2100-f",
        "birth": (1930, 1, 18, 21, 0),
        "gender": "female",
        "tags": ["boundary-control", "tianR10", "diR30", "hai"],
        "notes": "已知问题盘：软件先天卦=震为雷",
    },
    {
        "id": "1930-01-26-1900-f",
        "birth": (1930, 1, 26, 19, 0),
        "gender": "female",
        "tags": ["tianR10", "diR6", "xu"],
        "notes": "同月 lower-six；对照 tianR=10 是否普遍改口",
    },
    {
        "id": "1930-03-28-2100-f",
        "birth": (1930, 3, 28, 21, 0),
        "gender": "female",
        "tags": ["tianR10", "diR30", "hai"],
        "notes": "同 guaTian/guaDi=6/4 对照盘 1",
    },
    {
        "id": "1930-11-06-2100-f",
        "birth": (1930, 11, 6, 21, 0),
        "gender": "female",
        "tags": ["tianR10", "diR30", "hai"],
        "notes": "同 guaTian/guaDi=6/4 对照盘 2",
    },
    {
        "id": "1930-10-24-1900-f",
        "birth": (1930, 10, 24, 19, 0),
        "gender": "female",
        "tags": ["tianR10", "diR10", "xu"],
        "notes": "同 tianR=10 但 di 非 30 的对照盘",
    },
]


def gwt(hwnd):
    if not hwnd:
        return ""
    n = user32.SendMessageW(hwnd, WM_GETTEXTLENGTH, 0, 0)
    if n <= 0:
        return ""
    buf = ctypes.create_unicode_buffer(n + 2)
    user32.SendMessageW(hwnd, WM_GETTEXT, n + 1, buf)
    return buf.value


def swt(hwnd, text):
    return user32.SendMessageW(hwnd, WM_SETTEXT, 0, text)


def gcls(hwnd):
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

    def cb(h, _):
        if not user32.IsWindowVisible(h):
            return True
        if user32.GetParent(h) != 0:
            return True
        if get_window_pid(h) != target_pid:
            return True
        if "Afx:400000" in gcls(h):
            found.append(h)
        return True

    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found


def find_dialog(main_h):
    kids = []

    def cb(h, _):
        kids.append(h)
        return True

    user32.EnumChildWindows(main_h, WNDENUMPROC(cb), 0)
    for h in kids:
        if gcls(h) == "#32770" and user32.GetDlgItem(h, 1014):
            return h
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


def select_combo_hour(combo_h, civil_hour):
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
    items = get_combo_items(combo_h)
    for i, item in enumerate(items):
        if target in item:
            user32.SendMessageW(combo_h, CB_SETCURSEL, i, 0)
            return item
    return ""


def read_all_text(root):
    kids = []

    def cb(h, _):
        kids.append(h)
        return True

    user32.EnumChildWindows(root, WNDENUMPROC(cb), 0)
    texts = []
    for h in kids:
        t = gwt(h).strip()
        if t:
            texts.append(t)
    return texts


def extract_value(texts, prefix):
    for t in texts:
        if prefix in t:
            return t.replace(prefix, "").replace(":", "").replace("：", "").strip()
    return ""


def kill_all():
    subprocess.run(["taskkill", "/F", "/IM", "天纪.exe"], capture_output=True)
    time.sleep(1.5)


def collect_sample(sample):
    year, month, day, hour, minute = sample["birth"]
    kill_all()
    proc = subprocess.Popen([TIANJI_EXE])
    time.sleep(5)

    mains = find_main_by_pid(proc.pid)
    if not mains:
        raise RuntimeError("main window not found")
    main_h = mains[0]
    dlg_h = find_dialog(main_h)
    if not dlg_h:
        raise RuntimeError("dialog not found")

    year_h = user32.GetDlgItem(dlg_h, 1014)
    month_h = user32.GetDlgItem(dlg_h, 1270)
    day_h = user32.GetDlgItem(dlg_h, 1271)
    combo_h = user32.GetDlgItem(dlg_h, 1015)
    calc_h = user32.GetDlgItem(dlg_h, 1024)
    female_h = user32.GetDlgItem(dlg_h, 1034)

    if sample["gender"] == "female":
        click(female_h)
        time.sleep(0.2)

    swt(year_h, str(year))
    swt(month_h, str(month))
    swt(day_h, str(day))
    selected_combo = select_combo_hour(combo_h, hour)
    time.sleep(0.2)

    click(calc_h)
    time.sleep(2)

    texts = read_all_text(main_h)
    result = {
        "id": sample["id"],
        "birth": f"{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
        "gender": sample["gender"],
        "inputEcho": {
            "year": gwt(year_h),
            "month": gwt(month_h),
            "day": gwt(day_h),
            "combo": selected_combo,
        },
        "genderText": next((t for t in texts if t in ("阳女", "阴女", "阳男", "阴男")), ""),
        "pillars": extract_value(texts, "四柱"),
        "xiantian": extract_value(texts, "先天卦"),
        "houtian": extract_value(texts, "后天卦"),
        "tags": sample["tags"],
        "notes": sample["notes"],
    }

    try:
        proc.terminate()
    except Exception:
        pass
    time.sleep(1)
    return result


def main():
    rows = []
    for sample in SAMPLES:
        row = collect_sample(sample)
        rows.append(row)
        print(json.dumps(row, ensure_ascii=False))
    OUT_JSON.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
