import ctypes
import ctypes.wintypes as wt
import subprocess
import time
import json

user32 = ctypes.windll.user32

TIANJI_EXE = r"C:\Program Files (x86)\天纪简体版\天纪.exe"

WM_GETTEXT = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_SETTEXT = 0x000C
BM_CLICK = 0x00F5
CB_SETCURSEL = 0x014E
CB_GETCOUNT = 0x0146
CB_GETLBTEXT = 0x0148
CB_GETLBTEXTLEN = 0x0149
WNDENUMPROC = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)


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
    return user32.SendMessageW(hwnd, BM_CLICK, 0, 0)


def find_main():
    found = []

    def cb(h, _):
        if not user32.IsWindowVisible(h):
            return True
        if user32.GetParent(h) != 0:
            return True
        if "Afx:400000" in gcls(h):
            found.append(h)
        return True

    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return found


def find_dialog(main):
    kids = []

    def cb(h, _):
        kids.append(h)
        return True

    user32.EnumChildWindows(main, WNDENUMPROC(cb), 0)
    dialogs = []
    for h in kids:
        if gcls(h) == "#32770":
            dialogs.append(h)
    return dialogs


def get_combo_items(h):
    n = user32.SendMessageW(h, CB_GETCOUNT, 0, 0)
    items = []
    for i in range(n):
        length = user32.SendMessageW(h, CB_GETLBTEXTLEN, i, 0)
        if length <= 0:
            items.append("")
            continue
        buf = ctypes.create_unicode_buffer(length + 2)
        user32.SendMessageW(h, CB_GETLBTEXT, i, buf)
        items.append(buf.value)
    return items


def dump_dialog(dlg_h):
    ids = [1014, 1270, 1271, 1015, 1024, 1033, 1034]
    rows = []
    for ctrl_id in ids:
        h = user32.GetDlgItem(dlg_h, ctrl_id)
        rows.append({
            "id": ctrl_id,
            "hwnd": hex(h) if h else None,
            "class": gcls(h) if h else None,
            "text": gwt(h) if h else None,
        })
    return rows


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
            texts.append({"hwnd": hex(h), "class": gcls(h), "text": t})
    return texts


subprocess.run(["taskkill", "/F", "/IM", "天纪.exe"], capture_output=True)
time.sleep(1)
proc = subprocess.Popen([TIANJI_EXE])
time.sleep(5)

mains = find_main()
main_rows = []
for h in mains:
    pid = wt.DWORD()
    user32.GetWindowThreadProcessId(h, ctypes.byref(pid))
    main_rows.append({"hwnd": hex(h), "class": gcls(h), "text": gwt(h), "pid": pid.value})
print("launched-pid", proc.pid)
print("mains", json.dumps(main_rows, ensure_ascii=False, indent=2))

if not mains:
    raise SystemExit("no main")

main_h = mains[0]
dialogs = find_dialog(main_h)
print("dialogs", json.dumps([{"hwnd": hex(h), "class": gcls(h), "text": gwt(h)} for h in dialogs], ensure_ascii=False, indent=2))

if not dialogs:
    raise SystemExit("no dialog")

dlg_h = dialogs[0]
print("controls-before", json.dumps(dump_dialog(dlg_h), ensure_ascii=False, indent=2))

year_h = user32.GetDlgItem(dlg_h, 1014)
month_h = user32.GetDlgItem(dlg_h, 1270)
day_h = user32.GetDlgItem(dlg_h, 1271)
combo_h = user32.GetDlgItem(dlg_h, 1015)
calc_h = user32.GetDlgItem(dlg_h, 1024)
female_h = user32.GetDlgItem(dlg_h, 1034)

if female_h:
    click(female_h)
time.sleep(0.2)
print("female-text-after-click", gwt(female_h))

for label, h, value in [
    ("year", year_h, "1984"),
    ("month", month_h, "4"),
    ("day", day_h, "8"),
]:
    print(label, "before", gwt(h), "ret", swt(h, value), "after", gwt(h))

items = get_combo_items(combo_h) if combo_h else []
print("combo-count", len(items))
print("combo-items", json.dumps(items[:20], ensure_ascii=False, indent=2))
if combo_h and items:
    sel = None
    for i, item in enumerate(items):
        if "辰" in item:
            user32.SendMessageW(combo_h, CB_SETCURSEL, i, 0)
            sel = item
            break
    print("combo-selected", sel)

if calc_h:
    click(calc_h)
time.sleep(2)

print("controls-after", json.dumps(dump_dialog(dlg_h), ensure_ascii=False, indent=2))
all_texts = read_all_text(main_h)
interesting = [
    row for row in all_texts
    if ("四柱" in row["text"])
    or ("先天卦" in row["text"])
    or ("后天卦" in row["text"])
    or row["text"] in ("阳男", "阴男", "阳女", "阴女")
]
print("interesting-after", json.dumps(interesting, ensure_ascii=False, indent=2))

try:
    proc.terminate()
except Exception:
    pass
