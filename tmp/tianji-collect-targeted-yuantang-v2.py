"""
天纪.exe 元堂定向补样本 v2

改进点：
- 只绑定本次启动进程的主窗口，避免误读旧窗口
- 逐条验证输入控件已写入
- 只抓两个剩余口袋：
  1. female / upper-six / ordinary
  2. female / lower-six / water-thunder-tun
"""
import ctypes
import ctypes.wintypes as wt
import json
import subprocess
import sys
import time
from pathlib import Path

user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON = Path(__file__).parent / "tianji-yuantang-targeted-samples-v2.json"

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
        "id": "1984-04-08-0300-f",
        "birth": (1984, 4, 8, 3, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted"],
        "notes": "剩余口袋1：1984 同日寅时对照盘",
    },
    {
        "id": "1984-04-08-0700-f",
        "birth": (1984, 4, 8, 7, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted", "known-outlier"],
        "notes": "剩余口袋1：已知 outlier 原盘",
    },
    {
        "id": "1930-03-06-0300-f",
        "birth": (1930, 3, 6, 3, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted"],
        "notes": "剩余口袋1：卯月女命寅时候选1",
    },
    {
        "id": "1930-03-08-0300-f",
        "birth": (1930, 3, 8, 3, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted"],
        "notes": "剩余口袋1：卯月女命寅时候选2",
    },
    {
        "id": "1930-03-06-0700-f",
        "birth": (1930, 3, 6, 7, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted", "chen-hour"],
        "notes": "剩余口袋1：卯月女命辰时候选1",
    },
    {
        "id": "1930-03-08-0700-f",
        "birth": (1930, 3, 8, 7, 0),
        "gender": "female",
        "coverageTags": ["female", "upper-six", "ordinary", "targeted", "chen-hour"],
        "notes": "剩余口袋1：卯月女命辰时候选2",
    },
    {
        "id": "1930-01-17-1900-f",
        "birth": (1930, 1, 17, 19, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted"],
        "notes": "剩余口袋2：女命戌时水雷屯候选1",
    },
    {
        "id": "1930-05-03-1900-f",
        "birth": (1930, 5, 3, 19, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted"],
        "notes": "剩余口袋2：女命戌时水雷屯候选2",
    },
    {
        "id": "1930-10-23-1900-f",
        "birth": (1930, 10, 23, 19, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted"],
        "notes": "剩余口袋2：女命戌时水雷屯候选3",
    },
    {
        "id": "1930-10-24-2100-f",
        "birth": (1930, 10, 24, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted"],
        "notes": "剩余口袋2：女命亥时水雷屯候选4",
    },
    {
        "id": "1930-01-18-2100-f",
        "birth": (1930, 1, 18, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted", "hai-hour"],
        "notes": "剩余口袋2：女命亥时水雷屯候选5",
    },
    {
        "id": "1930-02-01-2100-f",
        "birth": (1930, 2, 1, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "three-zizun", "water-thunder-tun", "targeted", "hai-hour"],
        "notes": "剩余口袋2：女命亥时水雷屯候选6",
    },
    {
        "id": "1930-01-07-2100-f",
        "birth": (1930, 1, 7, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "ordinary", "hai-hour", "exploratory"],
        "notes": "验证 lower-six ordinary @ 亥 是否另有分支，候选1",
    },
    {
        "id": "1930-01-11-2100-f",
        "birth": (1930, 1, 11, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "ordinary", "hai-hour", "exploratory"],
        "notes": "验证 lower-six ordinary @ 亥 是否另有分支，候选2",
    },
    {
        "id": "1930-01-13-2100-f",
        "birth": (1930, 1, 13, 21, 0),
        "gender": "female",
        "coverageTags": ["female", "lower-six", "ordinary", "hai-hour", "exploratory"],
        "notes": "验证 lower-six ordinary @ 亥 是否另有分支，候选3",
    },
]


def gwt(hwnd):
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


def civil_slot(hour):
    if hour == 0:
        return "early-zi"
    if hour == 23:
        return "night-zi"
    branch_map = {
        1: "丑", 2: "丑", 3: "寅", 4: "寅", 5: "卯", 6: "卯",
        7: "辰", 8: "辰", 9: "巳", 10: "巳", 11: "午", 12: "午",
        13: "未", 14: "未", 15: "申", 16: "申", 17: "酉", 18: "酉",
        19: "戌", 20: "戌", 21: "亥", 22: "亥",
    }
    return branch_map.get(hour, f"{hour}时")


def wait_ui(proc):
    main_h = None
    dlg_h = None
    for _ in range(80):
        time.sleep(0.5)
        mains = find_main_by_pid(proc.pid)
        if mains:
            main_h = mains[0]
            dlg_h = find_dialog(main_h)
            if dlg_h:
                combo_h = user32.GetDlgItem(dlg_h, 1015)
                if combo_h and user32.SendMessageW(combo_h, CB_GETCOUNT, 0, 0) > 0:
                    return main_h, dlg_h
    return main_h, dlg_h


def main():
    kill_all()
    proc = subprocess.Popen([TIANJI_EXE])
    main_h, dlg_h = wait_ui(proc)
    if not main_h or not dlg_h:
        print("无法找到本次启动进程的天纪窗口", file=sys.stderr)
        sys.exit(1)

    year_h = user32.GetDlgItem(dlg_h, 1014)
    month_h = user32.GetDlgItem(dlg_h, 1270)
    day_h = user32.GetDlgItem(dlg_h, 1271)
    combo_h = user32.GetDlgItem(dlg_h, 1015)
    calc_h = user32.GetDlgItem(dlg_h, 1024)
    male_h = user32.GetDlgItem(dlg_h, 1033)
    female_h = user32.GetDlgItem(dlg_h, 1034)

    results = []
    previous_signature = None

    for sample in SAMPLES:
        year, month, day, hour, minute = sample["birth"]
        if sample["gender"] == "male" and male_h:
            click(male_h)
        elif sample["gender"] == "female" and female_h:
            click(female_h)
        time.sleep(0.2)

        swt(year_h, str(year))
        swt(month_h, str(month))
        swt(day_h, str(day))
        selected = select_combo_hour(combo_h, hour)
        time.sleep(0.2)

        input_echo = {
            "year": gwt(year_h),
            "month": gwt(month_h),
            "day": gwt(day_h),
            "combo": gwt(combo_h),
        }

        click(calc_h)
        time.sleep(2.2)

        texts = read_all_text(main_h)
        pillars_raw = next((t for t in texts if "四柱" in t), "")
        xiantian = extract_value(texts, "先天卦")
        houtian = extract_value(texts, "后天卦")
        gender_text = next((t for t in texts if t in ("阳男", "阴男", "阳女", "阴女")), "")
        wuxing = next((t for t in texts if t.endswith("局")), "")
        lunar = next((t for t in texts if "年" in t and "月" in t and ("初" in t or "十" in t or "廿" in t)), "")

        signature = (pillars_raw, xiantian, houtian, gender_text)
        repeated_from_prev = signature == previous_signature
        previous_signature = signature

        row = {
            "id": sample["id"],
            "calendar": "solar",
            "birth": f"{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
            "location": "Beijing",
            "gender": sample["gender"],
            "civilSlot": civil_slot(hour),
            "comboSelected": selected or "",
            "inputEcho": input_echo,
            "genderText": gender_text,
            "wuxing": wuxing,
            "lunar": lunar,
            "pillars": {"raw": pillars_raw},
            "xiantian": xiantian,
            "yuanTangLine": "待复核",
            "houtian": houtian,
            "coverageTags": sample["coverageTags"],
            "notes": sample["notes"],
            "repeatedFromPrevious": repeated_from_prev,
        }
        results.append(row)
        print(json.dumps({
            "id": row["id"],
            "inputEcho": row["inputEcho"],
            "genderText": row["genderText"],
            "pillars": row["pillars"]["raw"],
            "xiantian": row["xiantian"],
            "houtian": row["houtian"],
            "repeatedFromPrevious": row["repeatedFromPrevious"],
        }, ensure_ascii=False))

    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        proc.terminate()
    except Exception:
        pass


if __name__ == "__main__":
    main()
