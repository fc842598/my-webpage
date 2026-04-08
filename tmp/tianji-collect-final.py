"""
天纪.exe 元堂矩阵样本全自动采集 - 最终版
正确路径：顶层 Afx 窗口 → 子 #32770 dialog → GetDlgItem()
"""
import ctypes, ctypes.wintypes as wt
import subprocess, time, json, sys
from pathlib import Path

user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON   = Path(__file__).parent / "tianji-yuantang-matrix-samples.json"

WM_GETTEXT       = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT       = 0x000C
BM_CLICK         = 0x00F5
CB_SETCURSEL     = 0x014E
CB_GETCOUNT      = 0x0146
CB_GETLBTEXT     = 0x0148
CB_GETLBTEXTLEN  = 0x0149
WNDENUMPROC = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)

def gwt(hwnd):
    n = user32.SendMessageW(hwnd, WM_GETTEXTLENGTH, 0, 0)
    if n <= 0: return ""
    buf = ctypes.create_unicode_buffer(n + 2)
    user32.SendMessageW(hwnd, WM_GETTEXT, n + 1, buf)
    return buf.value

def swt(hwnd, text):
    user32.SendMessageW(hwnd, WM_SETTEXT, 0, text)

def gcls(hwnd):
    buf = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, buf, 256)
    return buf.value

def click(hwnd):
    user32.SendMessageW(hwnd, BM_CLICK, 0, 0)

def find_main():
    found = []
    def cb(h, _):
        if not user32.IsWindowVisible(h): return True
        if user32.GetParent(h) != 0: return True
        if 'Afx:400000' in gcls(h): found.append(h)
        return True
    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found[0] if found else None

def find_dialog(main):
    kids = []
    def cb(h, _): kids.append(h); return True
    user32.EnumChildWindows(main, WNDENUMPROC(cb), 0)
    for h in kids:
        if gcls(h) == '#32770':
            if user32.GetDlgItem(h, 1014):  # confirm year control exists
                return h
    return None

def get_combo_items(h):
    n = user32.SendMessageW(h, CB_GETCOUNT, 0, 0)
    items = []
    for i in range(n):
        length = user32.SendMessageW(h, CB_GETLBTEXTLEN, i, 0)
        if length <= 0: items.append(""); continue
        buf = ctypes.create_unicode_buffer(length + 2)
        user32.SendMessageW(h, CB_GETLBTEXT, i, buf)
        items.append(buf.value)
    return items

def select_combo_hour(combo_h, civil_hour):
    branch_map = {0:"早子",23:"夜子",1:"丑",2:"丑",3:"寅",4:"寅",
                  5:"卯",6:"卯",7:"辰",8:"辰",9:"巳",10:"巳",
                  11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",
                  17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"}
    target = branch_map.get(civil_hour, "子")
    items = get_combo_items(combo_h)
    for i, item in enumerate(items):
        if target in item:
            user32.SendMessageW(combo_h, CB_SETCURSEL, i, 0)
            return items[i]
    return None

def read_all_text(root):
    kids = []
    def cb(h, _): kids.append(h); return True
    user32.EnumChildWindows(root, WNDENUMPROC(cb), 0)
    texts = []
    for h in kids:
        t = gwt(h).strip()
        if t: texts.append(t)
    return texts

def extract_fields(texts):
    p, xt, ht = "", "", ""
    for t in texts:
        if "四柱" in t and not p: p = t
        if "先天卦" in t and not xt:
            xt = t.replace("先天卦","").replace(":","").replace("：","").strip()
        if "后天卦" in t and not ht:
            ht = t.replace("后天卦","").replace(":","").replace("：","").strip()
    return p, xt, ht

def kill_tianji():
    subprocess.run(["taskkill","/F","/IM","天纪.exe"], capture_output=True)
    time.sleep(1)

def launch_tianji():
    proc = subprocess.Popen([TIANJI_EXE])
    for _ in range(60):
        time.sleep(0.5)
        m = find_main()
        if m:
            dlg = find_dialog(m)
            if dlg: return proc, m, dlg
    return proc, None, None

CIVIL_SLOT_MAP = {0:"early-zi", 23:"night-zi"}
BRANCH_MAP = {1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",
              9:"巳",10:"巳",11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",
              17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"}

SAMPLES = [
    (1975, 7, 15, 12, 0, "female", ["female","lower-six","ordinary"],
     "女命午时下六时，预算先天卦地山谦(15)"),
    (1975, 7, 15, 14, 0, "female", ["female","lower-six","ordinary"],
     "女命未时下六时，预算先天卦艮为山(52)"),
    (1975, 7, 15,  2, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命丑时上六时非子，预算先天卦地山谦(15)"),
    (1975, 7, 15,  4, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命寅时上六时非子，预算先天卦地天泰(11)"),
    (1985, 8, 18,  8, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命辰时上六时非子，1985另一卦型"),
    (1975, 7, 15,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，预算先天卦泽风大过(28)"),
    (1978, 11, 5,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，1978对照"),
    (1985, 8, 18,  6, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命卯时，三至尊首条"),
    (1997, 5, 10,  4, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命寅时，三至尊第二条"),
    (1975, 7, 15,  2, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命丑时上六时非子，预算山地剥(23)"),
    (1975, 7, 15,  4, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命寅时上六时非子，预算天地否(12)"),
    (1975, 7, 15, 20, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命戌时下六时，三至尊水山蹇(39)"),
    (1978, 11, 5, 12, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命午时下六时，三至尊水山蹇(39)第二条"),
]

def main():
    print("关闭已有天纪...")
    kill_tianji()
    print("启动天纪.exe...")
    proc, main_h, dlg_h = launch_tianji()
    if not dlg_h:
        print("找不到窗口或 dialog")
        sys.exit(1)

    year_h  = user32.GetDlgItem(dlg_h, 1014)
    month_h = user32.GetDlgItem(dlg_h, 1270)
    day_h   = user32.GetDlgItem(dlg_h, 1271)
    combo_h = user32.GetDlgItem(dlg_h, 1015)
    calc_h  = user32.GetDlgItem(dlg_h, 1024)
    male_h  = user32.GetDlgItem(dlg_h, 1033)
    female_h= user32.GetDlgItem(dlg_h, 1034)

    print(f"dialog={dlg_h:#x} 年={year_h:#x} 月={month_h:#x} 日={day_h:#x} "
          f"时={combo_h:#x} 算={calc_h:#x}")

    # 验证时辰 combo
    if combo_h:
        items = get_combo_items(combo_h)
        print(f"时辰选项({len(items)}):", items[:8], "...")

    results = []
    for i, (year, month, day, hour, minute, gender, tags, notes) in enumerate(SAMPLES):
        print(f"\n[{i+1}/{len(SAMPLES)}] {year}-{month:02d}-{day:02d} "
              f"{hour:02d}:{minute:02d} {gender}")

        # 性别
        if gender == "male":
            if male_h: click(male_h)
        else:
            if female_h: click(female_h)
        time.sleep(0.15)

        # 年月日
        if year_h:  swt(year_h,  str(year))
        if month_h: swt(month_h, str(month))
        if day_h:   swt(day_h,   str(day))
        time.sleep(0.1)

        # 时辰
        selected = None
        if combo_h:
            selected = select_combo_hour(combo_h, hour)
        time.sleep(0.1)

        # 计算
        if calc_h:
            click(calc_h)
            time.sleep(1.8)

        # 读结果
        texts = read_all_text(main_h)
        pillars, xt, ht = extract_fields(texts)
        civil_slot = CIVIL_SLOT_MAP.get(hour, BRANCH_MAP.get(hour, f"{hour}时"))

        r = {
            "id": f"{year}-{month:02d}-{day:02d}-{hour:02d}{minute:02d}-{gender[:1]}",
            "calendar": "solar",
            "birth": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
            "location": "北京",
            "gender": gender,
            "civilSlot": civil_slot,
            "comboSelected": selected or "",
            "pillarsRaw": pillars,
            "xiantian": xt,
            "yuanTangLine": "待复核",
            "houtian": ht,
            "coverageTags": tags,
            "notes": notes,
        }
        results.append(r)
        # Output in UTF-8 safe way
        import sys as _sys
        _sys.stdout.buffer.write(
            f"  combo={selected}  pillars={pillars}  xt={xt}  ht={ht}\n".encode("utf-8","replace")
        )

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n已保存 {len(results)} 条到 {OUT_JSON}")

    try:
        proc.terminate()
    except Exception:
        pass

if __name__ == "__main__":
    main()
