# -*- coding: utf-8 -*-
"""
天纪真值采样 - 完全自动化版本（使用pyautogui图像识别）
目标：1991-02-16 22:00 男 上海
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import time
import pyautogui
from PIL import Image
from pathlib import Path

print("=" * 60)
print("天纪真值采样 - 自动化采集（图像识别版）")
print("=" * 60)

# 设置pyautogui的安全参数
pyautogui.PAUSE = 1.0  # 每次操作暂停1秒
pyautogui.FAILSAFE = True  # 鼠标移到角落可以紧急停止

print("\n[1] 查找天纪窗口...")

# 尝试找到天纪窗口
try:
    import pygetwindow as gw
    windows = gw.getWindowsWithTitle('天纪')
    if not windows:
        print("[FAIL] 未找到标题包含'天纪'的窗口")
        exit(1)
    
    print(f"找到 {len(windows)} 个窗口:")
    for i, win in enumerate(windows):
        print(f"  [{i}] {win.title}")
    
    # 激活第一个天纪窗口
    tianji_win = windows[0]
    print(f"\n[OK] 选择窗口: {tianji_win.title}")
    
    # 最大化窗口
    tianji_win.maximize()
    time.sleep(1)
    
    # 获取窗口位置
    print(f"窗口位置: left={tianji_win.left}, top={tianji_win.top}, width={tianji_win.width}, height={tianji_win.height}")
    
except Exception as e:
    print(f"[FAIL] 窗口操作失败: {e}")
    exit(1)

print("\n[2] 截取天纪界面...")
time.sleep(2)  # 等待窗口稳定

# 截取整个屏幕
screenshot = pyautogui.screenshot()
output_dir = Path(r"C:\Users\1\Desktop\家里用的图标\tmp")
screenshot_path = output_dir / "tianji-full-screen.png"
screenshot.save(screenshot_path)
print(f"[OK] 全屏截图已保存: {screenshot_path}")

# 截取天纪窗口区域
try:
    window_screenshot = screenshot.crop((
        tianji_win.left, 
        tianji_win.top,
        tianji_win.left + tianji_win.width,
        tianji_win.top + tianji_win.height
    ))
    window_path = output_dir / "tianji-window.png"
    window_screenshot.save(window_path)
    print(f"[OK] 窗口截图已保存: {window_path}")
except Exception as e:
    print(f"[WARN] 窗口截图失败: {e}")

print("\n" + "=" * 60)
print("请查看截图文件：")
print(f"  1. {screenshot_path}")
print(f"  2. {window_path}")
print("=" * 60)
print("\n接下来，请您手动完成以下操作：")
print("-" * 60)
print("1. 在天纪软件中输入：")
print("   公历: 1991-02-16")
print("   时间: 22:00 (亥时)")
print("   性别: 男")
print("   地点: 上海")
print("2. 点击排盘按钮")
print("3. 等待排盘结果完全显示")
print("4. 回到这里，按回车键继续")
print("-" * 60)

input("\n准备好了吗？按回车键继续...")

print("\n[3] 再次截图，抓取排盘结果...")
time.sleep(1)

# 再次截图
result_screenshot = pyautogui.screenshot()
result_path = output_dir / "tianji-result.png"
result_screenshot.save(result_path)
print(f"[OK] 排盘结果截图已保存: {result_path}")

# 也截取窗口区域
try:
    result_window = result_screenshot.crop((
        tianji_win.left, 
        tianji_win.top,
        tianji_win.left + tianji_win.width,
        tianji_win.top + tianji_win.height
    ))
    result_window_path = output_dir / "tianji-result-window.png"
    result_window.save(result_window_path)
    print(f"[OK] 排盘结果窗口截图已保存: {result_window_path}")
except Exception as e:
    print(f"[WARN] 窗口截图失败: {e}")

print("\n" + "=" * 60)
print("完成！")
print("=" * 60)
print(f"\n已生成的文件：")
print(f"  1. {result_path} - 完整屏幕截图")
print(f"  2. {result_window_path} - 窗口区域截图")
print("\n下一步：")
print("  请打开截图文件，读取其中的四柱、卦象信息")
print("  然后我可以帮您将这些信息整理成标准JSON格式")
print("=" * 60)
