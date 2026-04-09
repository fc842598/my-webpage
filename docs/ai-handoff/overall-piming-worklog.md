# overall_piming 接力工作日志

## 1. 当前阶段

整体批命大方向 **第 3 步 / 共 5 步**（第 2 步已完成）

---

## 2. 本次目标

把 overall_piming 从"纯 prompt 拼接命盘文本"升级为"规则 + 证据 + 表达"的第一版。
模型不再自由发挥，而是在后端规则层结论的约束下只负责表达。

---

## 3. 实际改动文件

- `server/index.js`（新增 3 个规则层函数 + 改写 buildOverallPimingPrompt）

---

## 4. 本次新增的规则层函数

### `collectOverallSignals(cd)`
从 chartData 提取结构化信号，输出：
- `lifeMain[]`：命宫主星名列表
- `lifeAux[]`：命宫有意义辅星（文昌/文曲/左辅/右弼/天魁/天钺/凶星）
- `lifeGood[]`：命宫落吉化（禄/权/科）
- `lifeJi[]`：命宫落忌星名
- `bodyMain[]`：身宫主星
- `bodyPalaceName`：身宫宫名
- `sanfang.{ career, wealth, move }`：三方四正各宫主星列表
- `lu/quan/ke/ji[]`：生年四化按类型分组
- `keyJiMutagens[]`：落在命/官/财/妻/迁的化忌（重点风险宫）

### `buildOverallEvidence(signals)`
输出 `evidence[]`，每项格式：`{ key, label, value }`

当前覆盖的 key：
| key | 内容 |
|---|---|
| minggong_main | 命宫主星 |
| minggong_aux | 命宫辅星（有则输出） |
| minggong_good | 命宫吉化（有则输出） |
| minggong_ji | 命宫落忌（有则输出） |
| sanfang_career | 官禄宫主星 |
| sanfang_wealth | 财帛宫主星 |
| sanfang_move | 迁移宫主星 |
| mutagen_lu/quan/ke/ji | 生年四化（有则输出） |
| shengong | 身宫宫名+主星 |

### `buildOverallRuleSummary(signals)`
输出规则层结论 `{ baseTone, structure, mutagenEffect, bodyAdjustment, mainRisk }`：
- `baseTone`：命宫底色描述（主星 + 辅星）
- `structure`：三方四正格局描述
- `mutagenEffect`：生年四化影响描述
- `bodyAdjustment`：身宫修正描述（命身同星 or 修正方向）
- `mainRisk`：主要风险点（命宫落忌 + 重点宫位化忌）

### `buildOverallPimingPrompt(body)`（改写）
流程：
1. `collectOverallSignals` → 提取信号
2. `buildOverallEvidence` → 生成证据列表
3. `buildOverallRuleSummary` → 生成规则结论
4. 把 evidence + ruleSummary 组装成 prompt，system 明确告诉模型"规则结论不得推翻"
5. 模型只负责 title/summary/risk/basis 的表达层

---

## 5. 本次 evidence 结构

```json
[
  { "key": "minggong_main",   "label": "命宫主星",        "value": "天府+文曲" },
  { "key": "minggong_aux",    "label": "命宫辅星",        "value": "文昌、天魁" },
  { "key": "sanfang_career",  "label": "官禄宫主星",      "value": "天相" },
  { "key": "sanfang_wealth",  "label": "财帛宫主星",      "value": "空宫" },
  { "key": "sanfang_move",    "label": "迁移宫主星",      "value": "武曲+七杀" },
  { "key": "mutagen_ji",      "label": "生年化忌",        "value": "文昌忌在财帛宫" },
  { "key": "shengong",        "label": "身宫（夫妻宫）",  "value": "紫微+破军" }
]
```

---

## 6. 本次 ruleSummary 结构

```json
{
  "baseTone":       "命宫天府，辅有文昌+文曲",
  "structure":      "官禄天相，财帛空宫，迁移武曲+七杀",
  "mutagenEffect":  "文曲化科入命宫；文昌化忌入财帛宫",
  "bodyAdjustment": "身宫（夫妻宫）主星紫微+破军，修正命宫方向",
  "mainRisk":       "文昌化忌入财帛宫，该宫受损"
}
```

---

## 7. 当前链路状态

**主卡片（aip-life）：**
- 排盘后本地占位，AI 返回后被 `card.{ title, summary, risk, basis }` 覆盖
- `card` 里额外携带 `evidence[]`（供调试区，主卡片不展示）

**调试区（aip-overall-debug-card）：**
- `debug.trace[]`：9 条步骤，包含规则层关键结论
- `debug.ruleSummary`：5 个字段，规则层推算结果
- `debug.rawResponse`：模型原始 JSON
- `debug.durationMs` / `debug.model`

**API base：** 已统一，复用 `_resolvePimingApiBase()`

---

## 8. 明确还没做的

- 命主星性格特质库（现在靠模型自己知道，后续可加星曜规则表）
- 格局库（双星同宫特殊格局，如紫微破军、武曲七杀等）
- 十年大限层
- 小流年层
- 人生曲线解读
- 前端 evidence 可视化展示（调试区目前只显示 trace 和 rawResponse）

---

## 9. 建议下一步

**第 3 步已完成规则骨架，可进入第 4 步或先做第 3 步增强。**

**选项 A（推荐）：进入第 4 步**
让后台 admin 能看到 evidence/ruleSummary，便于验收批命质量。
改动范围：`ai-piming-backend`（admin 测试台展示 evidence 和 ruleSummary）。

**选项 B：第 3 步增强**
在 `buildOverallRuleSummary` 里加命主星特质规则表（每颗主星对应 baseTone 关键词），
让规则层结论更精准，不依赖模型背景知识。
改动范围：仅 `server/index.js`，加一个 `STAR_TRAITS` 常量表。
