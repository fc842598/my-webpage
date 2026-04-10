# overall_piming 接力工作日志

## 1. 当前阶段

整体批命 **v2 规则加厚**（Step 1~5 已完成，v1 已交付）

步骤完成情况：
- Step 1 ✅ 冻结 overall_piming 前后端 I/O 结构
- Step 2 ✅ 统一主卡片 + 调试区 + API base
- Step 3 ✅ 规则层骨架（collectOverallSignals → buildOverallEvidence → buildOverallRuleSummary）+ correctness 修正
- Step 4 ✅ admin 测试台（overall 独立测试台，不走 prompt DB；首页区分规则层/提示词模块）
- Step 5 ✅ 前台展示优化 + v1 验收（含收尾补丁）
- v2 🔄 规则层加厚（本次进行）

---

## 2. v2 规则加厚目标

把 overall_piming 从"能说清基础盘面"提升到"能说出更像样的整体命格骨架"：
1. 命主星底色（特质文本 + 品类标签）
2. 辅星修饰效果（命宫吉凶辅星各自定性）
3. 双星同宫/主结构（命宫 + 三方四正）
4. 格局候选（三方实星、三奇嘉会、火贪/铃贪）
5. 破格条件（命忌、命煞、重点宫化忌）

---

## 3. v2 改动文件

- `server/index.js`（新增 3 个规则库常量 + 3 个规则层函数；更新 buildOverallPimingPrompt；debug 新增字段）
- `docs/ai-handoff/overall-piming-worklog.md`（本次）

未改动：
- `pages/chart.html`、`js/ai-piming.js`、`css/chart.css`（前台链路不变，debug 字段自然透传到调试区）
- `ai-piming-backend`（admin 测试台自动展示新 debug 字段，无需改动）

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

## 5. evidence 结构（对齐默认样例盘）

样例盘：天府坐命，文曲辅星入命，命宫无落忌，文昌忌在财帛，身宫夫妻紫微+破军

```json
[
  { "key": "minggong_main",   "label": "命宫主星",        "value": "天府" },
  { "key": "minggong_aux",    "label": "命宫辅星",        "value": "文曲" },
  { "key": "minggong_good",   "label": "命宫吉化",        "value": "文曲科" },
  { "key": "sanfang_career",  "label": "官禄宫主星",      "value": "天相" },
  { "key": "sanfang_wealth",  "label": "财帛宫主星",      "value": "空宫" },
  { "key": "sanfang_move",    "label": "迁移宫主星",      "value": "武曲+七杀" },
  { "key": "mutagen_lu",      "label": "生年化禄",        "value": "巨门禄在田宅宫" },
  { "key": "mutagen_quan",    "label": "生年化权",        "value": "太阳权在疾厄宫" },
  { "key": "mutagen_ke",      "label": "生年化科",        "value": "文曲科在命宫" },
  { "key": "mutagen_ji",      "label": "生年化忌",        "value": "文昌忌在财帛宫" },
  { "key": "shengong",        "label": "身宫（夫妻宫）",  "value": "紫微+破军" }
]
```

注：`minggong_aux` 只含 `文曲`（文昌在财帛，不在命宫）；`minggong_ji` 为空故不输出。

---

## 6. ruleSummary 结构（对齐默认样例盘）

```json
{
  "baseTone":       "命宫天府，辅有文曲（化科）",
  "structure":      "官禄天相，财帛空宫，迁移武曲+七杀",
  "mutagenEffect":  "文曲化科入命宫（吉）；文昌化忌入财帛宫（风险）",
  "bodyAdjustment": "身宫（夫妻宫）主星紫微+破军，修正命宫方向",
  "mainRisk":       "文昌化忌入财帛宫，财务易受损"
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

样例盘：天府坐命，文曲（辅星）入命，官禄天相，财帛空宫，迁移武曲+七杀，身宫夫妻紫微+破军

**正确四化：巨门化禄在田宅、太阳化权在疾厄、文曲化科在命宫、文昌化忌在财帛**

| 字段 | 识别结果 |
|---|---|
| lifeMain | `['天府']` ✓ |
| lifeAux | `['文曲']` ✓（命宫辅星只有文曲；文昌在财帛，不在命宫） |
| lifeGood | `['文曲科']` ✓（文曲化科入命） |
| lifeJi | `[]` ✓（命宫无落忌；文昌忌在财帛宫，不在命宫） |
| bodyMain | `['紫微','破军']` ✓ |
| bodyPalace | `'夫妻宫'` ✓ |
| sanfang.career | `['天相']` ✓ |
| sanfang.wealth | `[]` ✓（空宫） |
| sanfang.move | `['武曲','七杀']` ✓ |
| 化禄 | 巨门禄在**田宅宫** ✓（不是疾厄） |
| 化权 | 太阳权在**疾厄宫** ✓（不是福德） |
| 化科 | 文曲科在命宫 ✓ |
| 化忌 | 文昌忌在**财帛宫** ✓ |
| keyJi | 文昌忌在财帛宫 ✓（重点风险） |

---

## 10. 第 4 步完成情况（含收尾）

**第 4 步已真正收尾完成。**

### 改动文件
- `ai-piming-backend/pages/admin/index.js`
- `ai-piming-backend/pages/admin/module/[moduleKey].js`

### 首页（index.js）如何展示 overall

- `overall` 已从 `PROMPT_MODULE_LABELS` 中移除，不再拉取 `/api/admin/prompt/modules/overall/versions`
- 首页分为两个区块：
  1. **规则层模块**：一张独立卡片，说明"整体批命走独立规则层，版本编辑对线上无效"，按钮文案"进入测试台" → `/admin/module/overall`
  2. **提示词模块**：版本表格，只含 `minggong / current_luck / life_curve / ziping`，有版本号/草稿数/发布操作

### overall 详情页（[moduleKey].js）版本接口情况

- `useEffect` 改为 `if (moduleKey && moduleKey !== 'overall') fetchVersions()`
- overall 页面**不再请求** prompt 版本接口，不会触发版本相关错误提示
- overall 页面只显示：规则层说明横幅 + 测试目标地址 + chartData 输入 + 运行测试 + 结果区

### 测试目标地址配置

- 优先读 `NEXT_PUBLIC_OVERALL_PIMING_SERVER` env 变量
- 无则退回默认生产 Railway 地址
- 当前目标地址始终显示在测试台卡片内；若使用默认值，附注提示如何通过 env 覆盖
- 本地开发：在 `.env.local` 取消注释 `NEXT_PUBLIC_OVERALL_PIMING_SERVER=http://localhost:3001`

### 不改动
- `/api/admin/ai/test.js`（其他模块用）
- 前台链路（`chart.html`, `ai-piming.js`, `server/index.js`）

---

## 11. 第 5 步完成情况（含收尾补丁）

**第 5 步已真正收尾完成，overall_piming 达到 v1 可交付状态。**

### 改动文件
- `pages/chart.html`（含收尾补丁）
- `js/ai-piming.js`
- `css/chart.css`

### 前台展示改动详情

**`chart.html` HTML：**
- `aip-life` 卡片 tag 文字从"命宫格局"改为"整体批命"
- 卡片内新增 3 个初始隐藏的子元素：
  - `#aip-life-risk`（风险提醒区）
  - `#aip-life-basis`（判断依据区）
  - `#aip-life-ev`（evidence 轻量标签区）

**`chart.html` JS（`renderAIPiming()` reset）：**
- 新盘渲染时，额外清空 `aip-life-risk/basis/ev` 三个元素（隐藏 + 清空 innerHTML）
- 确保旧盘 AI 结果不残留

**`js/ai-piming.js`（`_aipRenderResult('overall')`）：**
- 标题写入 `aip-life-ttl`（已有）
- 主体解读写入 `aip-life-body`，同时恢复正常颜色
- 清空占位 tip（原来写 risk+basis，现拆开）
- 风险提醒单独写入 `aip-life-risk`（前缀 ⚠），有内容才显示
- 判断依据单独写入 `aip-life-basis`，有内容才显示
- evidence 渲染为 `.aip-ev-item` 紧凑标签，有则显示，无则隐藏

**`js/ai-piming.js`（click handler）：**
- 加载中：`aip-life-body` 显示"AI 正在分析命盘，请稍候…"（灰色），清空 risk/basis/ev 分区
- 失败时：`aip-life-body` 显示"⚠ 错误信息\n请稍后重试"（红色）

**`css/chart.css`：**
- `.aip-life-risk`：带浅红背景 + 左边框，风险底色
- `.aip-life-basis`：灰色左边框，低调展示
- `.aip-life-ev`：flex wrap 标签容器
- `.aip-ev-item` / `.aip-ev-item b`：轻量 pill 标签样式

### 验收说明

未改动范围确认：
- `server/index.js`、`ai-piming-backend`：未改动，调用链不变
- `src/ziping/*`：未改动
- `buildBaseMingAnalysis()`、`buildCurrentLuckAnalysis()`：未改动
- `aip-sf/shen/sh` 本地计算卡片：未改动，仍由 `_aipSetCard` 正常填充
- 大限流年链路：未改动

ziping 测试说明：
- 修改的 `renderAIPiming()` 代码只在 AI 分区（`aip-life-*`）做元素清除
- `validate:ziping:truth300` 只加载 `src/ziping/` 计算模块，与 DOM 完全隔离，无需跑

状态验收矩阵（含收尾补丁后）：
| 状态 | aip-life-body | aip-ai-status | aip-footer-note | risk/basis/ev |
|---|---|---|---|---|
| 未生成 | 本地命宫特质（默认色） | 空 | "AI服务已连接" | 全隐藏 |
| 加载中 | 灰色"AI 正在分析…" | "正在生成…" | "正在调用 AI…" | 全隐藏 |
| 成功 | summary（默认色） | "生成完成" | 耗时/模型信息 | 按内容显示 |
| 失败 | 红色错误信息 | 错误信息 | 错误信息 | 全隐藏 |
| 切换新盘 ✅ | 本地特质（**颜色已清**） | **已清空** | **"AI服务已连接"** | 全隐藏+清空 |

收尾补丁（Step 5 patch，仅改 `pages/chart.html` 的 `renderAIPiming()`）：
- `aip-life-body.style.color = ''`：清除 loading 灰色 / error 红色残留
- `aip-ai-status.textContent = ''`：清除"生成完成"串盘
- `aip-footer-note.textContent = _AI_STATUS_CONNECTED`：恢复"AI服务已连接"，不显示旧盘耗时

### overall_piming v1 可交付状态

**是。** 5 步全部完成，主链路稳定，展示层次清晰，状态管理完整。

---

## 12. v2 规则加厚完成情况

### 新增规则库常量（server/index.js）

| 常量 | 条目数 | 作用 |
|---|---|---|
| `STAR_TONE_DB` | 14 颗主星 | 主星特质文本 + 品类标签 |
| `AUX_STAR_EFFECT_DB` | 10 类辅星 | 辅星修饰效果描述 |
| `DUAL_STAR_PATTERN_DB` | 19 种双星组合 | 同宫结构名称 + 描述 |

### 新增规则层函数

#### `buildOverallToneDetails(sig)` → `toneDetails`
- `mainStarTraits[]`：命宫每颗主星的"品类+特质"全文
- `dualPattern`：命宫双星同宫结构（命中则输出，如"武杀同宫——猛将格..."）
- `auxEffects[]`：命宫辅星各自修饰效果
- `lifePalaceQuality`：命宫质量评级（7档：严重受损 / 落忌 / 有煞 / 佳 / 良 / 有吉化 / 普通）

#### `buildOverallPatternCandidates(sig)` → `patternCandidates[]`
每项含 `{ type, desc, stars?, palace? }`，已实现：
- `dual_sanfang`：三方宫位双星同宫（命中 DUAL_STAR_PATTERN_DB）
- `sanfang_full`：三方四正均有实星（仅记录，不送模型）
- `sanqi`：科权禄三奇嘉会（三类四化均存在）
- `huotan`：火贪格（命宫贪狼+火星）
- `lingtan`：铃贪格（命宫贪狼+铃星）

#### `buildOverallBreakConditions(sig)` → `breakConditions[]`
每项含 `{ type, desc, severity: 'high'|'medium' }`，已实现：
- `life_ji`：命宫化忌（severity: high）
- `life_sha`：命宫煞星——羊陀火铃（severity: medium）
- `career_ji`：官禄宫化忌（severity: high）
- `wealth_ji`：财帛宫化忌（severity: high）
- `spouse_ji`：夫妻宫化忌（severity: medium）
- `move_ji`：迁移宫化忌（severity: medium）

### v2 对输出的影响

**prompt 注入（模型输入加厚）：**
- 命宫底色区增加：主星特质 / 双星结构 / 辅星修饰 / 命宫质量
- 新增"已命中格局"区块（过滤了 sanfang_full，不送泛化信息）
- 新增"破格/凶险条件"区块（high/medium 标签）
- summary 字数约束从 120-200 字扩展到 150-220 字
- basis 上限从 60 字扩展到 70 字
- system 补充：格局名如已在规则层出现，模型可引用，不得自行新增

**debug 新增字段：**
- `debug.toneDetails`
- `debug.patternCandidates`
- `debug.breakConditions`

**trace 新增条目：**
- 命宫质量
- 双星结构
- 格局命中（type 列表）
- 破格条件（type 列表）

**前台无改动**，admin 测试台的 rawResponse 可看到新字段。

### 明确还没做

| 项目 | 状态 |
|---|---|
| 辅弼夹命 / 昌曲夹命检测 | ❌ 需 12 宫完整 palace 数据，现有信号不足 |
| 化禄入命 / 化权入命特殊加成 | ❌ 暂未加规则 |
| 格局质量等级（上/中/下格） | ❌ 未实现 |
| 大限层 / 小流年层 | ❌ 明确排除 |
| 宫位亮度（旺/庙/陷）作为信号 | ❌ 需从 palacesSummary 提取 |

### 下一步建议

1. **拓展 collectOverallSignals 读取 `palacesSummary`**：获取全 12 宫信息，解锁夹宫检测和亮度判断
2. **加禄权科入命宫特殊加成**：`mutagenOf(lp, '化禄')` 已有，可直接在 toneDetails 里描述"化禄入命，财运好逢"
3. **格局质量打分**：综合命宫质量 + 三方 + 四化，给出"上/中/下格"评级
4. **admin 测试台展示新字段**：toneDetails / patternCandidates / breakConditions 当前只在 rawResponse 可见，可加专属展示区块
