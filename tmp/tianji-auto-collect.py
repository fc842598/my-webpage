"""
天纪.exe 元堂矩阵样本全自动采集
使用 ctypes 直接操作 Win32 控件，绕过 32/64 位兼容问题
"""
import ctypes, ctypes.wintypes as wt
import subprocess, time, json, sys, os
from pathlib import Path

user32   = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON   = Path(__file__).parent / "tianji-yuantang-matrix-samples.json"

# ── Win32 工具 ───────────────────────────────────────────────
WM_GETTEXT       = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT       = 0x000C
BM_CLICK         = 0x00F5
CB_SETCURSEL     = 0x014E
CB_GETCOUNT      = 0x0146
CB_GETLBTEXT     = 0x0148
CB_GETLBTEXTLEN  = 0x0149
WM_COMMAND       = 0x0111
LVM_GETITEMCOUNT = 0x1004
LVM_GETITEMW     = 0x104B
LVIF_TEXT        = 0x0001

WNDENUMPROC = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)

def get_text(hwnd):
    n = user32.SendMessageW(hwnd, WM_GETTEXTLENGTH, 0, 0)
    if n <= 0: return ""
    buf = ctypes.create_unicode_buffer(n + 2)
    user32.SendMessageW(hwnd, WM_GETTEXT, n + 1, buf)
    return buf.value

def set_text(hwnd, text):
    user32.SendMessageW(hwnd, WM_SETTEXT, 0, text)

def get_class(hwnd):
    buf = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, buf, 256)
    return buf.value

def click_btn(hwnd):
    user32.SendMessageW(hwnd, BM_CLICK, 0, 0)

def get_dlg_item(parent, ctrl_id):
    h = user32.GetDlgItem(parent, ctrl_id)
    return h if h else None

def enum_children_flat(parent):
    """递归枚举所有后代控件"""
    children = []
    def cb(hwnd, _):
        children.append(hwnd)
        return True
    user32.EnumChildWindows(parent, WNDENUMPROC(cb), 0)
    return children

def find_top_tianji():
    """找天纪主窗口（顶层，Afx:400000 类）"""
    found = []
    def cb(hwnd, _):
        if not user32.IsWindowVisible(hwnd): return True
        if user32.GetParent(hwnd) != 0: return True
        cls = get_class(hwnd)
        if 'Afx:400000' in cls:
            found.append(hwnd)
        return True
    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found

def find_child_with_id(parent, ctrl_id):
    return user32.GetDlgItem(parent, ctrl_id)

def kill_tianji():
    subprocess.run(["taskkill", "/F", "/IM", "天纪.exe"], capture_output=True)
    time.sleep(1.5)

def launch_tianji():
    proc = subprocess.Popen([TIANJI_EXE])
    # 等主窗口出现
    for _ in range(60):
        wins = find_top_tianji()
        if wins: return proc, wins[0]
        time.sleep(0.5)
    return proc, None

# ── ComboBox 时间选项处理 ─────────────────────────────────────
# 天纪的时间 ComboBox (id=1015) 包含所有时辰选项
# 通过 CB_GETLBTEXT 枚举并匹配

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

def select_combo_by_hour(combo_hwnd, civil_hour, civil_minute):
    """根据公历时刻选择天纪 ComboBox 里对应的时辰选项"""
    items = get_combo_items(combo_hwnd)
    # 时辰对应规则：
    # 早子=0:00-0:59 → '早子'
    # 夜子=23:00-23:59 → '夜子' 或 子(23)
    # 丑=1:00-2:59, 寅=3:00-4:59, ...
    branch_map = {
        0: "早子", 23: "夜子",
        1: "丑", 2: "丑", 3: "寅", 4: "寅",
        5: "卯", 6: "卯", 7: "辰", 8: "辰",
        9: "巳", 10: "巳", 11: "午", 12: "午",
        13: "未", 14: "未", 15: "申", 16: "申",
        17: "酉", 18: "酉", 19: "戌", 20: "戌",
        21: "亥", 22: "亥",
    }
    target_branch = branch_map.get(civil_hour, "子")

    # 找匹配的选项
    best_idx = -1
    for i, item in enumerate(items):
        if target_branch in item:
            best_idx = i
            break

    if best_idx >= 0:
        user32.SendMessageW(combo_hwnd, CB_SETCURSEL, best_idx, 0)
        return items[best_idx]
    return None

# ── 读取 ListView 数据（年卦列表）────────────────────────────
class LVITEMW(ctypes.Structure):
    _fields_ = [
        ("mask",       ctypes.c_uint),
        ("iItem",      ctypes.c_int),
        ("iSubItem",   ctypes.c_int),
        ("state",      ctypes.c_uint),
        ("stateMask",  ctypes.c_uint),
        ("pszText",    ctypes.c_wchar_p),
        ("cchTextMax", ctypes.c_int),
        ("iImage",     ctypes.c_int),
        ("lParam",     ctypes.c_long),
    ]

def read_listview(hwnd, max_rows=10):
    """读取 SysListView32 的内容"""
    count = user32.SendMessageW(hwnd, LVM_GETITEMCOUNT, 0, 0)
    rows = []
    for i in range(min(count, max_rows)):
        row = []
        for col in range(4):
            buf = ctypes.create_unicode_buffer(256)
            item = LVITEMW()
            item.mask = LVIF_TEXT
            item.iItem = i
            item.iSubItem = col
            item.pszText = ctypes.cast(buf, ctypes.c_wchar_p)
            item.cchTextMax = 256
            # SendMessage with LVITEM pointer — tricky cross-process
            # For same-process: user32.SendMessageW(hwnd, LVM_GETITEMW, i, ctypes.addressof(item))
            # Cross-process requires shared memory; skip for now
            row.append("?")
        rows.append(row)
    return rows, count

# ── 读取输出字段 ─────────────────────────────────────────────
def read_output(main_hwnd):
    """读取所有子控件，收集先天卦/后天卦/四柱"""
    children = enum_children_flat(main_hwnd)
    all_texts = []
    for hwnd in children:
        t = get_text(hwnd).strip()
        if t:
            all_texts.append(t)

    pillars_raw = ""
    xiantian    = ""
    houtian     = ""
    for t in all_texts:
        if "四柱" in t:
            pillars_raw = t
        if "先天卦" in t:
            xiantian = t.replace("先天卦", "").replace(":", "").replace("：", "").strip()
        if "后天卦" in t:
            houtian  = t.replace("后天卦", "").replace(":", "").replace("：", "").strip()

    return pillars_raw, xiantian, houtian, all_texts

# ── 采集目标 ─────────────────────────────────────────────────
SAMPLES = [
    # (year, month, day, civil_hour, civil_minute, gender, coverage_tags, notes)
    (1975, 7, 15, 12, 0, "female", ["female","lower-six","ordinary"],
     "女命午时下六时，预算先天卦地山谦(15)"),
    (1975, 7, 15, 14, 0, "female", ["female","lower-six","ordinary"],
     "女命未时下六时，预算先天卦艮为山(52)"),
    (1975, 7, 15,  2, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命丑时上六时非子，预算先天卦地山谦(15)"),
    (1975, 7, 15,  4, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命寅时上六时非子，预算先天卦地天泰(11)"),
    (1985, 8, 18,  8, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命辰时上六时非子，1985另一卦型扩充"),
    (1975, 7, 15,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，预算先天卦泽风大过(28)"),
    (1978, 11, 5,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，1978对照"),
    (1985, 8, 18,  6, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命卯时，三至尊水雷屯首条"),
    (1997, 5, 10,  4, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命寅时，三至尊水雷屯第二条"),
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
    print("关闭已有天纪实例...")
    kill_tianji()

    print("启动天纪.exe ...")
    proc, main_hwnd = launch_tianji()
    if not main_hwnd:
        print("找不到天纪主窗口")
        sys.exit(1)
    print(f"主窗口: {main_hwnd:#x}")

    # 找关键控件
    year_ctrl  = find_child_with_id(main_hwnd, 1014)
    month_ctrl = find_child_with_id(main_hwnd, 1270)
    day_ctrl   = find_child_with_id(main_hwnd, 1271)
    combo_ctrl = find_child_with_id(main_hwnd, 1015)
    calc_btn   = find_child_with_id(main_hwnd, 1024)
    male_btn   = find_child_with_id(main_hwnd, 1033)
    female_btn = find_child_with_id(main_hwnd, 1034)

    print(f"年={year_ctrl:#x} 月={month_ctrl:#x} 日={day_ctrl:#x} "
          f"时={combo_ctrl:#x} 算={calc_btn:#x} 男={male_btn:#x} 女={female_btn:#x}")

    # 验证 combo 选项
    if combo_ctrl:
        items = get_combo_items(combo_ctrl)
        print(f"时辰选项({len(items)}): {items[:6]}")

    results = []

    for i, (year, month, day, hour, minute, gender, tags, notes) in enumerate(SAMPLES):
        print(f"\n[{i+1}/{len(SAMPLES)}] {year}-{month:02d}-{day:02d} "
              f"{hour:02d}:{minute:02d} {gender} ...")

        # 设置性别
        if gender == "male":
            if male_btn: click_btn(male_btn)
        else:
            if female_btn: click_btn(female_btn)
        time.sleep(0.2)

        # 设置年月日
        if year_ctrl:  set_text(year_ctrl,  str(year))
        if month_ctrl: set_text(month_ctrl, str(month))
        if day_ctrl:   set_text(day_ctrl,   str(day))
        time.sleep(0.1)

        # 设置时辰
        selected_slot = None
        if combo_ctrl:
            selected_slot = select_combo_by_hour(combo_ctrl, hour, minute)
            print(f"  时辰选项: {selected_slot}")
        time.sleep(0.1)

        # 点击计算
        if calc_btn:
            click_btn(calc_btn)
            time.sleep(1.5)

        # 读取结果
        pillars_raw, xt, ht, all_texts = read_output(main_hwnd)

        # civil slot
        civil_slot_map = {0:"early-zi", 23:"night-zi"}
        branch_map = {1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",
                      9:"巳",10:"巳",11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",
                      17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"}
        civil_slot = civil_slot_map.get(hour, branch_map.get(hour, f"{hour}时"))

        result = {
            "id": f"{year}-{month:02d}-{day:02d}-{hour:02d}{minute:02d}-{gender[:1]}",
            "calendar": "solar",
            "birth": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
            "location": "北京",
            "gender": gender,
            "civilSlot": civil_slot,
            "comboSelected": selected_slot or "未知",
            "pillarsRaw": pillars_raw,
            "xiantian": xt,
            "yuanTangLine": "待复核",
            "houtian": ht,
            "coverageTags": tags,
            "notes": notes,
        }
        results.append(result)
        print(f"  四柱: {pillars_raw}  先天: {xt}  后天: {ht}")

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n已保存 {len(results)} 条到 {OUT_JSON}")

    try:
        proc.terminate()
    except Exception:
        pass

if __name__ == "__main__":
    main()
