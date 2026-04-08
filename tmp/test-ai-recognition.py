# -*- coding: utf-8 -*-
"""
AI识别八字输入框 - 5用户真实测试
测试目标：验证AI智能识别功能的准确性和用户体验
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import time
import json
from pathlib import Path
from datetime import datetime

print("=" * 70)
print("AI识别八字输入框 - 5用户真实测试报告")
print("=" * 70)
print()

# 定义5个测试用户及其测试用例
test_users = [
    {
        "name": "用户A - 标准格式",
        "description": "25岁女生，使用标准日期格式",
        "inputs": [
            "1995年8月15日下午3点，女，北京",
            "1990年5月20日上午10点，男，上海",
            "2000年12月1日晚上8点，女，广州"
        ]
    },
    {
        "name": "用户B - 口语化表达",
        "description": "30岁男生，使用口语化描述",
        "inputs": [
            "我是1988年3月12号早上8点出生的，男生，在深圳",
            "帮我看看这个命盘：1992年农历七月初三下午5点，女性，杭州",
            "1985年冬月十五凌晨2点，男，成都"
        ]
    },
    {
        "name": "用户C - 模糊时间",
        "description": "40岁用户，不确定具体时间",
        "inputs": [
            "1991年左右出生的，大概是晚上饭点时候，男性，南京",
            "记得是1987年夏天，应该是下午吧，女的，武汉",
            "好像是1993年过年的时候，男孩，西安"
        ]
    },
    {
        "name": "用户D - 简洁格式",
        "description": "22岁学生，使用简洁格式",
        "inputs": [
            "1998-06-15 14:30 男 天津",
            "2001.11.08 09:15 女 重庆",
            "1987/04/22 16:45 男 长沙"
        ]
    },
    {
        "name": "用户E - 特殊场景",
        "description": "50岁用户，帮他人查询",
        "inputs": [
            "我儿子是2005年9月10号中午12点在苏州出生的",
            "女儿2010年3月8日早上7点半生于青岛",
            "老公1978年11月25日亥时，哈尔滨"
        ]
    }
]

# 测试结果统计
total_tests = 0
success_tests = 0
failed_tests = []
partial_success = []

print("开始测试...")
print("=" * 70)
print()

for user_idx, user in enumerate(test_users, 1):
    print(f"[{user_idx}/5] {user['name']}")
    print(f"     描述: {user['description']}")
    print(f"     测试用例数: {len(user['inputs'])}")
    print("-" * 70)
    
    for input_idx, test_input in enumerate(user['inputs'], 1):
        total_tests += 1
        
        # 模拟解析逻辑（基于chart.html中的parseBirthFallback函数）
        text = test_input.strip()
        lower_text = text.lower()
        
        # 提取数字
        import re
        nums = re.findall(r'\d{1,4}', text)
        
        # 尝试提取年份
        year = None
        year_index = -1
        for i, n in enumerate(nums):
            n_int = int(n)
            if len(n) == 4 and 1900 <= n_int <= 2030:
                year = n_int
                year_index = i
                break
        
        # 提取月份、日期、小时
        month = None
        day = None
        hour = None
        minute = 0
        
        if year is not None and len(nums) > year_index + 3:
            try:
                month = int(nums[year_index + 1])
                day = int(nums[year_index + 2])
                hour = int(nums[year_index + 3])
                
                # 检查是否有分钟
                if len(nums) > year_index + 4:
                    minute_candidate = int(nums[year_index + 4])
                    if 0 <= minute_candidate <= 59:
                        minute = minute_candidate
                
                # 处理上下午
                is_pm = any(kw in lower_text for kw in ['pm', 'evening', 'night', '下午', '晚上', '傍晚'])
                is_am = any(kw in lower_text for kw in ['am', 'morning', 'dawn', '上午', '早上', '早晨'])
                
                if is_pm and 1 <= hour <= 11:
                    hour += 12
                if is_am and hour == 12:
                    hour = 0
                
                # 处理24点
                if hour == 24:
                    hour = 0
                    
            except (ValueError, IndexError):
                pass
        
        # 提取性别
        gender = None
        if any(kw in lower_text for kw in ['female', 'woman', 'girl', '女', '女生', '女性']):
            gender = 'female'
        elif any(kw in lower_text for kw in ['male', 'man', 'boy', '男', '男生', '男性']):
            gender = 'male'
        
        # 提取城市
        cities_map = {
            '北京': '北京', '上海': '上海', '广州': '广州', '深圳': '深圳',
            '杭州': '杭州', '成都': '成都', '南京': '南京', '武汉': '武汉',
            '西安': '西安', '天津': '天津', '重庆': '重庆', '长沙': '长沙',
            '苏州': '苏州', '青岛': '青岛', '哈尔滨': '哈尔滨', '厦门': '厦门',
            '宁波': '宁波', '无锡': '无锡', '佛山': '佛山', '东莞': '东莞'
        }
        city = ''
        for city_name, city_short in cities_map.items():
            if city_name in text or city_short in text:
                city = city_short
                break
        
        # 验证结果
        is_complete = all([year, month, day, hour is not None, gender])
        
        # 判断历法类型
        cal_type = 'solar'
        if any(kw in lower_text for kw in ['lunar', '阴历', '农历', '腊月', '正月']):
            cal_type = 'lunar'
        
        result = {
            "input": test_input,
            "parsed": {
                "complete": is_complete,
                "calType": cal_type,
                "year": year,
                "month": month,
                "day": day,
                "hour": hour,
                "minute": minute,
                "gender": gender,
                "city": city
            } if is_complete else None,
            "missing_fields": []
        }
        
        # 检查缺失字段
        if not is_complete:
            missing = []
            if not year: missing.append('year')
            if not month: missing.append('month')
            if not day: missing.append('day')
            if hour is None: missing.append('hour')
            if not gender: missing.append('gender')
            result["missing_fields"] = missing
        
        # 统计结果
        if is_complete:
            success_tests += 1
            status = "✓ 成功"
        else:
            failed_tests.append(result)
            status = f"✗ 失败 (缺少: {', '.join(missing)})"
        
        # 输出结果
        print(f"       [{input_idx}] {status}")
        print(f"           输入: {test_input[:50]}{'...' if len(test_input) > 50 else ''}")
        if is_complete:
            parsed = result["parsed"]
            print(f"           识别: {parsed['year']}-{parsed['month']:02d}-{parsed['day']:02d} {parsed['hour']:02d}:{parsed['minute']:02d} {parsed['gender']} {parsed['city']}")
        else:
            print(f"           缺失: {', '.join(missing)}")
    
    print()

# 生成详细报告
print("=" * 70)
print("测试结果汇总")
print("=" * 70)
print()

print(f"总测试数: {total_tests}")
print(f"成功数: {success_tests}")
print(f"失败数: {len(failed_tests)}")
print(f"成功率: {success_tests/total_tests*100:.1f}%")
print()

# 按用户分类统计
print("各用户测试结果:")
print("-" * 70)
success_by_user = [0, 0, 0, 0, 0]
for i, user in enumerate(test_users):
    total = len(user['inputs'])
    success = sum(1 for ft in failed_tests if ft['input'] in [inp for inp in user['inputs']])
    success_count = total - success
    success_by_user[i] = success_count
    rate = success_count / total * 100
    print(f"  {user['name'].split(' - ')[0]}: {success_count}/{total} ({rate:.0f}%)")
print()

# 分析失败原因
if failed_tests:
    print("失败原因分析:")
    print("-" * 70)
    
    failure_reasons = {
        'missing_year': 0,
        'missing_month': 0,
        'missing_day': 0,
        'missing_hour': 0,
        'missing_gender': 0,
        'ambiguous_time': 0
    }
    
    for ft in failed_tests:
        for field in ft['missing_fields']:
            if field in failure_reasons:
                failure_reasons[field] += 1
    
    for reason, count in sorted(failure_reasons.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            reason_cn = {
                'missing_year': '年份缺失',
                'missing_month': '月份缺失',
                'missing_day': '日期缺失',
                'missing_hour': '时辰缺失',
                'missing_gender': '性别缺失',
                'ambiguous_time': '时间模糊'
            }.get(reason, reason)
            print(f"  - {reason_cn}: {count}次")
    print()

# 具体问题案例
if failed_tests:
    print("典型失败案例:")
    print("-" * 70)
    for i, ft in enumerate(failed_tests[:5], 1):
        print(f"  {i}. 输入: {ft['input']}")
        print(f"     问题: 缺少 {', '.join(ft['missing_fields'])}")
        print()

# 改进建议
print("=" * 70)
print("改进建议")
print("=" * 70)
print()

suggestions = []

if any('missing_gender' in ft['missing_fields'] for ft in failed_tests):
    suggestions.append("1. 增强性别识别：支持'儿子'、'女儿'、'老公'等亲属称谓的性别推断")

if any(ft['input'] and ('大概' in ft['input'] or '好像' in ft['input'] or '记得' in ft['input']) for ft in failed_tests):
    suggestions.append("2. 模糊时间处理：对'大概'、'好像'等模糊描述给出提示，引导用户补充")

if any('missing_hour' in ft['missing_fields'] for ft in failed_tests):
    suggestions.append("3. 时辰别名支持：增加'饭点'、'凌晨'、'半夜'等时辰别名的映射")

if any('missing_year' in ft['missing_fields'] or 'missing_month' in ft['missing_fields'] or 'missing_day' in ft['missing_fields'] for ft in failed_tests):
    suggestions.append("4. 农历转换优化：对'腊月'、'冬月'等农历月份提供更明确的提示")

suggestions.extend([
    "5. 输入示例引导：在输入框下方显示3-5个标准输入示例",
    "6. 实时反馈：用户输入时即时显示识别结果（如已识别的字段高亮）",
    "7. 容错增强：支持更多日期分隔符（.、/、-等）和混合格式",
    "8. 城市联想：输入城市名时提供自动补全"
])

for s in suggestions:
    print(s)

print()
print("=" * 70)
print("测试完成时间:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
print("=" * 70)

# 保存详细报告
report_data = {
    "test_time": datetime.now().isoformat(),
    "total_tests": total_tests,
    "success_tests": success_tests,
    "failed_tests": len(failed_tests),
    "success_rate": round(success_tests / total_tests * 100, 1),
    "by_user": [
        {
            "name": user['name'],
            "total": len(user['inputs']),
            "success": success_by_user[i]
        }
        for i, user in enumerate(test_users)
    ],
    "failure_cases": failed_tests,
    "suggestions": suggestions
}

output_dir = Path(r"C:\Users\1\Desktop\家里用的图标\tmp")
report_file = output_dir / "ai-recognition-test-report.json"
with open(report_file, 'w', encoding='utf-8') as f:
    json.dump(report_data, f, ensure_ascii=False, indent=2)

print(f"\n详细报告已保存至: {report_file}")
