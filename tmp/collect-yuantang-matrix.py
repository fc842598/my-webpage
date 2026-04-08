"""
元堂矩阵样本采集脚本
目标：覆盖 docs/tianji-yuantang-sample-matrix.md 里的 6 个缺口
只读取天纪.exe 输出，不改任何算法文件
"""

import subprocess, time, json, sys, os
from pathlib import Path

try:
    import pywinauto
    from pywinauto import Application, Desktop
    from pywinauto.keyboard import send_keys
except ImportError:
    print("需要 pywinauto: pip install pywinauto")
    sys.exit(1)

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"
OUT_JSON   = Path(__file__).parent / "tianji-yuantang-matrix-samples.json"

# ── 采集目标 ──────────────────────────────────────────────────
# 格式: (year, month, day, civil_hour, civil_minute, gender, coverage_tags, notes)
SAMPLES = [
    # === 缺口1：女命 + lower-six + 普通卦 ===
    (1975, 7, 15, 12, 0, "female", ["female","lower-six","ordinary"],
     "女命午时下六时，先天卦预算地山谦"),
    (1975, 7, 15, 14, 0, "female", ["female","lower-six","ordinary"],
     "女命未时下六时，先天卦预算艮为山"),

    # === 缺口2：男命 + upper-six + 非子时 ===
    (1975, 7, 15, 2, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命丑时上六时非子，先天卦预算地山谦"),
    (1975, 7, 15, 4, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命寅时上六时非子，先天卦预算地天泰"),
    (1985, 8, 18, 8, 0, "male",   ["male","upper-six-non-zi","ordinary"],
     "男命辰时，不同年份上六时非子扩充"),

    # === 缺口3：女命 + early-zi ===
    (1975, 7, 15, 0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时00:30，先天卦预算泽风大过"),
    (1978, 11, 5,  0, 30, "female", ["female","early-zi","ordinary"],
     "女命早子时，不同年份对照"),

    # === 缺口4：三至尊卦 + 水雷屯 ===
    (1985, 8, 18,  6, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯 男命卯时上六时非子，三至尊覆盖"),
    (1997, 5, 10,  4, 0, "male",   ["male","upper-six-non-zi","three-zizun","shuileiqun"],
     "水雷屯 男命寅时，三至尊水雷屯第二条"),

    # === 缺口5：upper-six/non-zi 多卦型 ===
    (1975, 7, 15,  2, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命丑时上六时非子，山地剥"),
    (1975, 7, 15,  4, 0, "female", ["female","upper-six-non-zi","ordinary"],
     "女命寅时，天地否"),

    # === 缺口6：女命 + lower-six + three-zizun ===
    (1975, 7, 15, 20, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命戌时下六时，水山蹇三至尊"),
    (1978, 11, 5, 12, 0, "female", ["female","lower-six","three-zizun","water-mountain-jian"],
     "女命午时下六时，水山蹇三至尊，第二条"),
]

# ── 工具函数 ──────────────────────────────────────────────────
def wait_ready(app, timeout=15):
    """等待天纪主窗口出现"""
    for _ in range(timeout * 4):
        try:
            wins = app.windows()
            for w in wins:
                t = w.window_text()
                if '天纪' in t or '子平' in t:
                    return w
        except Exception:
            pass
        time.sleep(0.25)
    return None

def read_text_from_window(win):
    """读取窗口所有静态文本"""
    texts = []
    try:
        for c in win.descendants():
            try:
                t = c.window_text().strip()
                if t:
                    texts.append(t)
            except Exception:
                pass
    except Exception:
        pass
    return texts

def find_control(win, texts_to_try):
    """按文字找控件"""
    for t in texts_to_try:
        try:
            return win.child_window(title=t)
        except Exception:
            pass
    return None

def extract_fields(all_texts):
    """从文本列表提取关键字段"""
    result = {}
    for i, t in enumerate(all_texts):
        if t.startswith("四柱"):
            result["pillarsRaw"] = t
        if t.startswith("先天卦"):
            result["xiantianRaw"] = t
        if t.startswith("后天卦"):
            result["houtianRaw"] = t
    return result

def input_sample(app, win, year, month, day, hour, minute, gender):
    """向天纪输入一条样本"""
    try:
        # 尝试找到年月日输入框 —— 各版本天纪控件名不同，用 tab 顺序
        # 先点击"命造"或"子平"标签
        for label in ["子平", "命造", "排盘"]:
            try:
                btn = win.child_window(title=label, control_type="Button")
                btn.click()
                time.sleep(0.3)
                break
            except Exception:
                pass

        # 性别
        gender_label = "男" if gender == "male" else "女"
        try:
            gb = win.child_window(title=gender_label, control_type="Button")
            gb.click()
            time.sleep(0.2)
        except Exception:
            pass

        # 年
        for ctrl_name in ["年", "year", "inp-year"]:
            try:
                y_ctrl = win.child_window(title=ctrl_name)
                y_ctrl.set_text(str(year))
                break
            except Exception:
                pass

        # 月
        for ctrl_name in ["月", "month"]:
            try:
                m_ctrl = win.child_window(title=ctrl_name)
                m_ctrl.set_text(str(month))
                break
            except Exception:
                pass

        # 日
        for ctrl_name in ["日", "day"]:
            try:
                d_ctrl = win.child_window(title=ctrl_name)
                d_ctrl.set_text(str(day))
                break
            except Exception:
                pass

        # 时
        for ctrl_name in ["时", "hour"]:
            try:
                h_ctrl = win.child_window(title=ctrl_name)
                h_ctrl.set_text(str(hour))
                break
            except Exception:
                pass

        # 分
        for ctrl_name in ["分", "minute"]:
            try:
                min_ctrl = win.child_window(title=ctrl_name)
                min_ctrl.set_text(str(minute))
                break
            except Exception:
                pass

        time.sleep(0.3)

        # 排盘
        for btn_name in ["排盘", "确定", "开始", "计算"]:
            try:
                ok = win.child_window(title=btn_name, control_type="Button")
                ok.click()
                time.sleep(1.5)
                break
            except Exception:
                pass

    except Exception as e:
        print(f"  input error: {e}")


def collect_one(app, win, year, month, day, hour, minute, gender, tags, notes):
    """采集一条样本，返回 dict"""
    print(f"  采集: {year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d} {gender} ...")

    # 尝试通过菜单或直接输入
    input_sample(app, win, year, month, day, hour, minute, gender)
    time.sleep(1)

    all_texts = read_text_from_window(win)
    fields = extract_fields(all_texts)

    civil_slot = "early-zi" if (hour == 0) else ("night-zi" if hour == 23 else None)
    if civil_slot is None:
        branch_map = {0:"子",1:"丑",2:"丑",3:"寅",4:"寅",5:"卯",6:"卯",7:"辰",8:"辰",
                      9:"巳",10:"巳",11:"午",12:"午",13:"未",14:"未",15:"申",16:"申",
                      17:"酉",18:"酉",19:"戌",20:"戌",21:"亥",22:"亥"}
        civil_slot = branch_map.get(hour, str(hour)+"时")

    return {
        "id": f"{year}-{month:02d}-{day:02d}-{hour:02d}{minute:02d}-{gender[:1]}",
        "calendar": "solar",
        "birth": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
        "location": "北京",
        "gender": gender,
        "civilSlot": civil_slot,
        "pillarsRaw": fields.get("pillarsRaw", ""),
        "xiantianRaw": fields.get("xiantianRaw", ""),
        "yuanTangLine": "待复核",
        "houtianRaw": fields.get("houtianRaw", ""),
        "coverageTags": tags,
        "notes": notes,
        "rawTexts": all_texts[:30],  # 保留前30条供核对
    }


# ── 主流程 ────────────────────────────────────────────────────
def main():
    print("启动天纪.exe ...")
    try:
        app = Application(backend="win32").start(TIANJI_EXE)
        time.sleep(3)
    except Exception as e:
        print(f"启动失败: {e}")
        sys.exit(1)

    win = wait_ready(app)
    if not win:
        print("等待主窗口超时")
        # 尝试枚举
        try:
            wins = app.windows()
            print("找到窗口:", [w.window_text() for w in wins])
            win = wins[0] if wins else None
        except Exception:
            pass

    if not win:
        sys.exit(1)

    print(f"主窗口: {win.window_text()}")

    results = []
    for (year, month, day, hour, minute, gender, tags, notes) in SAMPLES:
        try:
            r = collect_one(app, win, year, month, day, hour, minute, gender, tags, notes)
            results.append(r)
            print(f"    pillars={r['pillarsRaw']} xt={r['xiantianRaw']} ht={r['houtianRaw']}")
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({
                "id": f"{year}-{month:02d}-{day:02d}-error",
                "error": str(e),
                "coverageTags": tags,
            })
        time.sleep(0.5)

    # 保存
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n已保存 {len(results)} 条到 {OUT_JSON}")

    # 关闭天纪
    try:
        app.kill()
    except Exception:
        pass


if __name__ == "__main__":
    main()
