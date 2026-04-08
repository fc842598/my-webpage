"""
天纪.exe 元堂矩阵样本采集 - ctypes 版（绕过32/64位限制）
只读取，不改算法文件
"""
import ctypes, ctypes.wintypes as wt, subprocess, time, json, os, sys
from pathlib import Path

user32  = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON   = Path(__file__).parent / "tianji-yuantang-matrix-samples.json"

# ── Win32 工具 ───────────────────────────────────────────────
WM_GETTEXT       = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT       = 0x000C
WM_COMMAND       = 0x0111
WM_LBUTTONDOWN   = 0x0201
WM_LBUTTONUP     = 0x0202
BM_CLICK         = 0x00F5

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

def click(hwnd):
    user32.SendMessageW(hwnd, BM_CLICK, 0, 0)

def enum_children(parent):
    children = []
    def cb(hwnd, _):
        children.append(hwnd)
        return True
    user32.EnumChildWindows(parent, WNDENUMPROC(cb), 0)
    return children

def get_dlg_item(parent, ctrl_id):
    return user32.GetDlgItem(parent, ctrl_id)

def find_top_windows():
    """找所有天纪主窗口"""
    found = []
    def cb(hwnd, _):
        if not user32.IsWindowVisible(hwnd): return True
        t = get_text(hwnd)
        cls = get_class(hwnd)
        if '天纪' in t or 'Afx:400000' in cls:
            found.append((hwnd, t, cls))
        return True
    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found

def dump_children(parent, depth=0, maxdepth=4):
    """递归打印所有子控件"""
    if depth > maxdepth: return
    children = enum_children(parent)
    for hwnd in children:
        t = get_text(hwnd)
        cls = get_class(hwnd)
        rid = user32.GetDlgCtrlID(hwnd)
        indent = "  " * depth
        if t or cls:
            print(f"{indent}hwnd={hwnd:#x} id={rid} cls={cls} text={repr(t[:50])}")
        # Recurse only if it has children
        sub = enum_children(hwnd)
        if sub:
            dump_children(hwnd, depth+1, maxdepth)

# ── 天纪控件 ID 探测 ─────────────────────────────────────────
def find_controls(main_hwnd):
    """找到关键控件"""
    controls = {}
    all_children = []
    def recurse(hwnd):
        children = enum_children(hwnd)
        for c in children:
            t = get_text(c)
            cls = get_class(c)
            rid = user32.GetDlgCtrlID(c)
            all_children.append((c, rid, cls, t))
            recurse(c)
    recurse(main_hwnd)
    return all_children

# ── 主采集逻辑 ───────────────────────────────────────────────
def kill_tianji():
    """关闭已有天纪进程"""
    try:
        subprocess.run(["taskkill", "/F", "/IM", "天纪.exe"], capture_output=True)
        time.sleep(1)
    except Exception:
        pass

def launch_tianji():
    """启动天纪"""
    proc = subprocess.Popen([TIANJI_EXE])
    time.sleep(4)
    return proc

def find_main_win(timeout=15):
    """等待找到天纪主窗口"""
    for _ in range(timeout * 4):
        tops = find_top_windows()
        # 找主窗口（非子窗口，标题包含天纪）
        for hwnd, text, cls in tops:
            parent = user32.GetParent(hwnd)
            if parent == 0 and 'Afx:400000' in cls:
                return hwnd
        time.sleep(0.25)
    return None

SAMPLES = [
    # (year, month, day, civil_hour, civil_minute, gender, coverage_tags, notes)
    (1975, 7, 15, 12, 0, "female", ["female","lower-six","ordinary"],
     "女命午时下六时，先天卦预算地山谦(15)"),
    (1975, 7, 15, 14, 0, "female", ["female","lower-six","ordinary"],
     "女命未时下六时，先天卦预算艮为山(52)"),
    (1975, 7, 15,  2, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命丑时上六时非子，先天卦预算地山谦(15)"),
    (1975, 7, 15,  4, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命寅时上六时非子，先天卦预算地天泰(11)"),
    (1985, 8, 18,  8, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命辰时上六时非子，1985年另一卦型"),
    (1975, 7, 15,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时00:30，先天卦预算泽风大过(28)"),
    (1978, 11, 5,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，1978年对照"),
    (1985, 8, 18,  6, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命卯时，三至尊首条"),
    (1997, 5, 10,  4, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯(3) 男命寅时，三至尊第二条"),
    (1975, 7, 15,  2, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命丑时上六时非子，山地剥"),
    (1975, 7, 15,  4, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命寅时，天地否"),
    (1975, 7, 15, 20, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命戌时下六时，水山蹇(39)三至尊"),
    (1978, 11, 5, 12, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命午时下六时，水山蹇(39)三至尊第二条"),
]

def main():
    print("关闭已有天纪实例...")
    kill_tianji()

    print("启动天纪.exe...")
    proc = launch_tianji()

    main_hwnd = find_main_win()
    if not main_hwnd:
        print("找不到天纪主窗口！")
        sys.exit(1)
    print(f"主窗口: {main_hwnd:#x}  title={repr(get_text(main_hwnd))}")

    print("\n=== 探测控件结构 ===")
    all_ctrls = find_controls(main_hwnd)
    print(f"总控件数: {len(all_ctrls)}")
    for hwnd, rid, cls, text in all_ctrls[:60]:
        if text.strip() or cls.startswith('Edit') or cls.startswith('Button'):
            print(f"  {hwnd:#x} id={rid:4d} cls={cls:25s} text={repr(text[:40])}")

    # 把控件结构保存下来供分析
    ctrl_dump = [{"hwnd": hwnd, "id": rid, "cls": cls, "text": text}
                 for hwnd, rid, cls, text in all_ctrls]
    ctrl_dump_path = Path(__file__).parent / "tianji-ctrl-dump.json"
    with open(ctrl_dump_path, "w", encoding="utf-8") as f:
        json.dump(ctrl_dump, f, ensure_ascii=False, indent=2)
    print(f"\n控件结构已保存到 {ctrl_dump_path}")

    # TODO: 根据控件结构填写样本后自动提交
    # 目前先只做控件探测，不自动填写
    print("\n请手动在天纪界面操作，本脚本将定时读取当前界面内容。")
    print("按 Ctrl+C 停止。\n")

    results = []
    sample_idx = 0

    if len(sys.argv) > 1 and sys.argv[1] == "--auto":
        print("自动模式暂不支持，请先分析控件结构")
    else:
        # 手动辅助模式：每按一次回车读一次当前界面
        for (year, month, day, hour, minute, gender, tags, notes) in SAMPLES:
            print(f"\n样本 {sample_idx+1}/{len(SAMPLES)}")
            print(f"  请在天纪里输入: {year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d} {'男' if gender=='male' else '女'}")
            print(f"  覆盖标签: {tags}")
            print(f"  备注: {notes}")
            input("  输入完成并排盘后，按回车读取结果...")

            # 读取当前界面所有文本
            all_ctrls2 = find_controls(main_hwnd)
            texts = [t for _, _, _, t in all_ctrls2 if t.strip()]

            # 提取字段
            pillars_raw = ""
            xiantian_raw = ""
            houtian_raw = ""
            for t in texts:
                if "四柱" in t: pillars_raw = t
                if "先天卦" in t: xiantian_raw = t
                if "后天卦" in t: houtian_raw = t

            # 提取纯名
            xt_name = xiantian_raw.replace("先天卦", "").replace(":", "").replace("：", "").strip()
            ht_name = houtian_raw.replace("后天卦", "").replace(":", "").replace("：", "").strip()

            print(f"  四柱: {pillars_raw}")
            print(f"  先天卦: {xt_name}")
            print(f"  后天卦: {ht_name}")

            civil_slot_map = {0:"early-zi", 23:"night-zi"}
            branch_map = {1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",
                          9:"巳",10:"巳",11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",
                          17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"}
            civil_slot = civil_slot_map.get(hour, branch_map.get(hour, f"{hour}时"))

            results.append({
                "id": f"{year}-{month:02d}-{day:02d}-{hour:02d}{minute:02d}-{gender[:1]}",
                "calendar": "solar",
                "birth": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
                "location": "北京",
                "gender": gender,
                "civilSlot": civil_slot,
                "pillarsRaw": pillars_raw,
                "xiantian": xt_name,
                "yuanTangLine": "待复核",
                "houtian": ht_name,
                "coverageTags": tags,
                "notes": notes,
                "allTexts": texts[:40],
            })
            sample_idx += 1

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n已保存 {len(results)} 条到 {OUT_JSON}")

    try:
        proc.terminate()
    except Exception:
        pass

if __name__ == "__main__":
    main()
