# overall_piming 接力工作日志

## 1. 当前阶段

整体批命大方向 **第 3 步修正 / 共 5 步**（第 3 步规则骨架已完成 + correctness 修正已完成）

---

## 2. 本次目标

修正 step3 规则层的两个核心 correctness 问题：
1. `majorStars` 混合类型导致三方/身宫主星丢失
2. `_yearMutagens()` 漏扫辅星四化 + type 与服务端格式不匹配

---

## 3. 实际改动文件

- `server/index.js`（新增 3 个规则层函数 + 改写 buildOverallPimingPrompt；correctness 修正）
- `js/ai-piming.js`（`_yearMutagens()` 扫 minorStars + type 归一；新增 `_normMutagenType()`）

---

## 3b. 修正的 correctness 问题

### 问题 1：majorStars 混合类型

**根因：** `ai-piming.js` `buildChartPayload()` 中：
- `lifePalace.majorStars` → 对象数组 `{ name, mutagen, brightness }`
- `bodyPalaceDetail/careerPalace/wealthPalace/movePalace.majorStars` → 字符串数组

**修复（server）：** `collectOverallSignals()` 内新增 `starName()` helper：
```js
const starName   = s => (typeof s === 'string' ? s : s?.name) || '';
const majorNames = p => (p?.majorStars || []).map(starName).filter(Boolean);
```

### 问题 2：四化 type 不统一 + minorStars 漏扫

**根因：**
- iztro 可能返回裸字 `禄/权/科/忌`，服务端按 `化禄/化权/化科/化忌` 过滤，导致全部丢失
- `_yearMutagens()` fallback 只扫 `majorStars`，文曲/文昌（辅星）的四化全部漏掉

**修复（ai-piming.js）：**
- 新增 `_normMutagenType(t)`：裸字 → 化X 格式
- `_yearMutagens()` fallback 改为扫 `[...majorStars, ...minorStars]`
- 从 iztro 直接拿到的列表也统一归一

**修复（server）：**
- `collectOverallSignals()` 内新增 `normType()`，在读取 `yearMutagens` 时再次归一
- `mutagenOf()` 改为精确匹配 normalizedType（不再用 `.includes()`）

### 三方/身宫/四化取值规则（修正后）

| 宫位 | 取法 |
|---|---|
| 命宫 majorStars | `starName(s)`（对象取 `.name`，字符串直接用） |
| 命宫 minorStars | 同上 |
| 身宫/三方 majorStars | 同上（字符串数组兼容） |
| 四化 type | 前端 `_normMutagenType()` 归一 → 后端 `normType()` 再归一，保证两端都是 `化X` |
| 命宫四化 mutagenOf | 只扫对象类型 star，精确 `=== normalizedType` |

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

## 9. 默认样例盘验证结果（修正后）

样例盘：天府坐命，文曲科/文昌忌入命，官禄天相，财帛空宫，迁移武曲+七杀，身宫夫妻紫微+破军

| 字段 | 识别结果 |
|---|---|
| lifeMain | `['天府']` ✓ |
| lifeAux | `['文曲','文昌']` ✓ |
| lifeGood | `['文曲科']` ✓ |
| lifeJi | `['文昌']` ✓（命宫落文昌忌） |
| bodyMain | `['紫微','破军']` ✓ |
| bodyPalace | `'夫妻宫'` ✓ |
| sanfang.career | `['天相']` ✓ |
| sanfang.wealth | `[]` ✓（空宫） |
| sanfang.move | `['武曲','七杀']` ✓ |
| 化禄 | 巨门禄在疾厄宫 ✓ |
| 化权 | 太阳权在福德宫 ✓ |
| 化科 | 文曲科在命宫 ✓ |
| 化忌 | 文昌忌在财帛宫 ✓ |
| keyJi | 文昌忌在财帛宫 ✓（已识别为重点风险） |

---

## 10. 是否可进入第 4 步

**可以。** 第 3 步规则骨架 + correctness 修正均已完成。

**第 4 步：让后台 admin 测试台能展示 evidence/ruleSummary**
改动范围：`ai-piming-backend`（`pages/api/admin/ai/test.js` 和测试台前端），不改前台链路。
