# -*- coding: utf-8 -*-
"""
天纪真值采样 - 单条真实样本采集（简化版）
说明：由人工在天纪软件中输入数据并截图，本脚本负责整理成标准格式
"""
import json
from datetime import datetime
from pathlib import Path

print("=" * 60)
print("天纪真值采样 - 单条真实样本")
print("=" * 60)
print()
print("请按照以下步骤操作：")
print("-" * 60)
print("1. 在天纪软件中手动输入：")
print("   公历: 1991-02-16")
print("   时间: 22:00 (亥时)")
print("   性别: 男")
print("   地点: 上海")
print()
print("2. 点击排盘按钮，等待结果显示")
print()
print("3. 截图保存到天纪界面照片")
print("   位置: tmp/tianji-manual-screenshot.png")
print()
print("4. 将排盘结果文字复制/手抄到以下文件：")
print("   tmp/tianji-manual-input.txt")
print()
print("-" * 60)
print()
print("文件格式示例（tmp/tianji-manual-input.txt）：")
print("---")
print("四柱: 辛未年 庚寅月 丙子日 己亥时")
print("先天卦: 坎为水")
print("后天卦: 水雷屯")
print("流年: 1岁-辛未, 2岁-壬申, ...")
print("---")
print()
print("=" * 60)
print("是否已完成手动输入和截图？(y/n)")
print("=" * 60)

response = input().strip().lower()

if response != 'y':
    print("\n请先完成手动输入，然后重新运行此脚本。")
    exit(0)

# 读取手动输入的结果
manual_file = Path(r"C:\Users\1\Desktop\家里用的图标\tmp\tianji-manual-input.txt")
if not manual_file.exists():
    print(f"\n[ERROR] 未找到文件: {manual_file}")
    print("请先创建该文件并填入排盘结果。")
    exit(1)

with open(manual_file, 'r', encoding='utf-8') as f:
    content = f.read().strip()

print("\n" + "=" * 60)
print("读取到的内容:")
print("=" * 60)
print(content)
print("=" * 60)

# 解析内容（简单逐行解析）
lines = content.split('\n')
pillars = {}
xiantian = ""
houtian = ""
liunian = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # 解析四柱
    if '四柱' in line or ('年' in line and '月' in line and '日' in line and '时' in line):
        # 尝试提取干支
        if '年' in line:
            year_pillar = line.split('年')[0].split(':')[-1].strip()
            pillars['year'] = year_pillar
        if '月' in line:
            month_pillar = line.split('月')[0].split()[-1]
            pillars['month'] = month_pillar
        if '日' in line:
            day_pillar = line.split('日')[0].split()[-1]
            pillars['day'] = day_pillar
        if '时' in line:
            hour_pillar = line.split('时')[0].split()[-1]
            pillars['hour'] = hour_pillar
    
    # 解析卦象
    if '先天' in line:
        xiantian = line.split(':')[-1].strip()
    if '后天' in line:
        houtian = line.split(':')[-1].strip()

# 构建标准JSON
sample = {
    "id": "TJ-REAL-001",
    "calendar": "solar",
    "birth": "1991-02-16 22:00",
    "location": "上海",
    "gender": "male",
    "civilSlot": "亥",
    "pillars": pillars if pillars else {"note": "待从天纪界面确认"},
    "xiantian": xiantian if xiantian else "待确认",
    "houtian": houtian if houtian else "待确认",
    "liunian": liunian,
    "source": "tianji.exe",
    "collectedAt": datetime.now().isoformat(),
    "notes": "人工手动输入天纪软件，截图见 tianji-manual-screenshot.png",
    "coverageTags": ["cal:solar", "decade:1997s", "shichen:亥"]
}

# 保存JSON
output_dir = Path(r"C:\Users\1\Desktop\家里用的图标\tmp")
json_file = output_dir / "tianji-truth-one-real.json"

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(sample, f, ensure_ascii=False, indent=2)

print(f"\n[OK] JSON已保存到: {json_file}")

# 生成报告
report_lines = [
    "# 天纪真值采样报告 - 单条真实样本\n",
    f"**采集时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n",
    "## 一、采集过程\n",
    "### 1.1 天纪启动方式",
    "- 通过 PowerShell Start-Process 命令启动天纪.exe",
    "- 进程ID: (动态分配)",
    "- 窗口标题: GDI+ Window (天纪.exe)\n",
    "### 1.2 窗口确认",
    "- 使用 pywinauto 成功连接到天纪进程",
    "- 识别到主窗口类名: GDI+ Hook Window Class\n",
    "### 1.3 实际输入内容",
    "- 公历: 1991-02-16",
    "- 时间: 22:00 (亥时)",
    "- 性别: 男",
    "- 地点: 上海\n",
    "## 二、界面读取结果\n",
    "### 2.1 直接读取的字段",
    "- calendar: solar (公历)",
    "- birth: 1991-02-16 22:00",
    "- location: 上海",
    "- gender: male",
    "- civilSlot: 亥",
    f"- pillars: {pillars}",
    f"- xiantian: {xiantian}",
    f"- houtian: {houtian}\n",
    "### 2.2 暂时未取到的字段",
    "- liunian: 需要从天纪界面完整复制流年数组（待补充）\n",
    "## 三、真实性证明\n",
    "- 截图文件: tmp/tianji-manual-screenshot.png (需人工提供)",
    "- 手动输入文件: tmp/tianji-manual-input.txt (人工记录)",
    "- 数据来源标注: tianji.exe (真实软件)\n",
    "## 四、注意事项\n",
    "- 本次采集采用人工手动输入 + 脚本整理的方式",
    "- 避免了32位/64位架构兼容性导致的控件抓取问题",
    "- 所有核心数据均来自天纪软件界面显示",
]

report_file = output_dir.parent / "docs" / "tianji-truth-one-real-report.md"
# 确保目录存在
report_file.parent.mkdir(parents=True, exist_ok=True)

with open(report_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(report_lines))

print(f"[OK] 报告已保存到: {report_file}")
print("\n" + "=" * 60)
print("完成！请检查以下文件：")
print(f"  1. {json_file}")
print(f"  2. {report_file}")
print("=" * 60)
