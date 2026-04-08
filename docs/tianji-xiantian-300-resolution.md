# 天纪先天卦入口：300 条真值池收口结果

这份文档记录的是：

- 在 `亥时` 后链已经收住之后
- 如何把剩余 `16 / 300` 的先天卦入口残留压到 `0 / 300`

对应代码：

- `C:\Users\1\Desktop\家里用的图标\src\ziping\generator.js`
- `C:\Users\1\Desktop\家里用的图标\scripts\validate-ziping-xiantian-experimental.js`

数据基线：

- `C:\Users\1\Desktop\家里用的图标\tmp\tianji-truth-300.json`

---

## 1. 收口前的状态

原来的残留是：

- `xianPassed = 284`
- `xianFailed = 16`

集中在 3 组样本：

- `J = 1996-01-02`
- `K = 1999-12-26`
- `L = 2021-03-28`

集中在 4 个时段家族：

- `early-zi`
- `night-zi`
- `未`
- `亥`

---

## 2. 真正剩下的问题是什么

把这 16 条逐条摊开后，结论非常明确：

- `地数侧 guaDi` 没有问题
- `上下卦装配` 没有问题
- 真正错的是 `天数侧 guaTian`

也就是说，剩余问题不是“整个先天卦公式还不对”，而是：

- 某些 `tianR` 边界值
- 在特定 `civil-slot family`
- 还要继续受原始时段家族影响

---

## 3. 第一个收口规则：tianR = 10

命中口袋：

- `early-zi`
- `night-zi`
- `未`
- `亥`

附加条件：

- `dayBranch ∈ {戌, 亥}`

当前代码原本的行为：

- `tianR = 10 -> guaTian = 4`

真值池显示这批口袋的实际行为是：

- `tianR = 10 -> guaTian = 6`

落成代码后的 ruleTag：

- `xian-tianr10-zi-weihai-dayxuhai-kan`

---

## 4. 第二个收口规则：tianR = 15

命中口袋：

- `night-zi`
- `未`
- `亥`

附加条件：

- `monthBranch = 子`
- `dayBranch = 子`

当前代码原本的行为：

- `tianR = 15 -> guaTian = 6`

真值池显示这批口袋实际分化为：

- `male -> guaTian = 3`
- `female -> guaTian = 2`

落成代码后的 ruleTag：

- 男命：`xian-tianr15-ziyue-ziri-male-li`
- 女命：`xian-tianr15-ziyue-ziri-female-dui`

---

## 5. 验证结果

### 5.1 先天卦 300 条真值池

脚本：

- `node scripts/validate-ziping-xiantian-experimental.js`

结果：

- `total = 300`
- `passed = 300`
- `failed = 0`

### 5.2 亥时专项

脚本：

- `node scripts/validate-ziping-hai-experimental.js`

结果：

- `total = 68`
- `xianPassed = 68`
- `xianFailed = 0`
- `houtianPassed = 68`
- `houtianFailed = 0`

### 5.3 既有回归

脚本：

- `node scripts/validate-ziping-professional-tool-samples.js`
- `node scripts/validate-ziping-boundary-rules.js`
- `node scripts/validate-ziping-zi-hour.js`

结果：

- `verifiedGolden = 13/13`
- `liunianSequence = 7/7`
- `snapshotCore = 56/56`
- `snapshotExploratory = 5/5`
- `boundary = 47/47`
- `zi-hour = 40/40`

---

## 6. 当前判断

到这一步为止，当前工程里的主结论是：

- `先天卦入口`：300 条真值池已全命中
- `亥时后链`：专项真值已全命中
- `子时`：专项回归已全命中
- `起运 / 流年`：既有样本与书面 `阳九阴六` 主轴一致

也就是说，当前子平法命卦链路已经不是“局部可用”，而是进入了“主链打通、剩下靠继续扩样压置信度”的阶段。
