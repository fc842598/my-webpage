# -*- coding: utf-8 -*-
"""快速验证天纪真值样本的覆盖情况"""
import json
from collections import Counter

with open(r'C:\Users\1\Desktop\家里用的图标\tmp\tianji-truth-100.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 60)
print("天纪真值样本 - 覆盖验证")
print("=" * 60)

total = len(data)
print(f"\n样本总数: {total} {'✅' if total == 100 else '❌'}")

# 性别统计
male = sum(1 for s in data if s['gender'] == 'male')
female = sum(1 for s in data if s['gender'] == 'female')
print(f"性别分布: 男 {male} / 女 {female} {'✅' if male == 50 and female == 50 else '❌'}")

# 历法统计
solar = sum(1 for s in data if s['calendar'] == 'solar')
lunar = sum(1 for s in data if s['calendar'] == 'lunar')
print(f"历法分布: 公历 {solar} / 农历 {lunar} {'✅' if solar >= 70 and lunar >= 30 else '❌'}")

# 时支统计
slots = Counter(s['civilSlot'] for s in data)
print(f"\n时支覆盖:")
print(f"  早子: {slots.get('早子', 0)} {'✅' if slots.get('早子', 0) >= 8 else '❌'}")
print(f"  夜子: {slots.get('夜子', 0)} {'✅' if slots.get('夜子', 0) >= 8 else '❌'}")
other = sum(v for k, v in slots.items() if k not in ['早子', '夜子'])
print(f"  其他时支合计: {other} {'✅' if other >= 84 else '❌'}")

# 三至尊统计
supreme = ['坎为水', '水雷屯', '水山蹇']
sup_count = {g: sum(1 for s in data if s['xiantian'] == g) for g in supreme}
print(f"\n三至尊覆盖:")
for g in supreme:
    print(f"  {g}: {sup_count[g]} {'✅' if sup_count[g] >= 5 else '❌'}")
sup_total = sum(sup_count.values())
print(f"  合计: {sup_total} {'✅' if sup_total >= 18 else '❌'}")

# 年代统计
print(f"\n年代覆盖:")
decades = [(1927, 1936), (1937, 1946), (1947, 1956), (1957, 1966), (1967, 1976),
           (1977, 1986), (1987, 1996), (1997, 2006), (2007, 2016), (2017, 2026)]
for start, end in decades:
    count = sum(1 for s in data if start <= int(s['birth'][:4]) <= end)
    status = '✅' if count >= 8 else '❌'
    print(f"  {start}s-{end}: {count} {status}")

print("\n" + "=" * 60)
print("验证完成")
print("=" * 60)
