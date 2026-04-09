# overall_piming 接力工作日志

## 1. 当前阶段

整体批命大方向 **第 2 步收尾 / 共 5 步**（第 2 步已完成）

---

## 2. 本次目标

第 2 步主线：统一整体批命主卡片、调试区、API base 到同一条 overall_piming 链。
第 2 步收尾：修复新命盘渲染时 aip-life 和调试卡残留旧盘内容的问题。

---

## 3. 实际改动文件

**第 2 步主线：**
- `js/ai-piming.js`
- `pages/chart.html`

**第 2 步收尾：**
- `pages/chart.html`

---

## 4. 本次完成内容

**主线（已完成）：**
- 删除 `ai-piming.js` 中硬编码的 `OVERALL_PIMING_API_BASE` 和 `_aipJoinOverall()`
- `_aipCallBackend('overall')` 改为调用 `_resolvePimingApiBase()` + `_joinApiUrl()`（复用 chart.html 的探测逻辑）
- `_aipRenderResult('overall')` 目标改为 `aip-life`（命宫格局）而非 `aip-sh`（生年四化）
- AI 返回的 `debug` 字段写入新增的 `#aip-overall-debug-card` 折叠卡片，默认隐藏，AI 返回后显示
- `aip-sf`、`aip-shen`、`aip-sh` 继续由 `buildBaseMingAnalysis()` 本地计算填写，不受影响

**收尾修复（已完成）：**
- `renderAIPiming()` 改为：新命盘渲染时**无条件**重置 `aip-life` 为本地占位（不再用 `!textContent.trim()` 判断）
- 同时隐藏并清空 `aip-overall-debug-card` 和 `aip-overall-debug-pre`
- 效果：切换命盘后，旧盘 AI 结果和 debug 立即清除，只有用户再次点击「AI 深度批命」才显示新盘结果

---

## 5. 当前链路状态

**主卡片（aip-life 命宫格局）：**
- 每次 `renderAIPiming()` 无条件写入本地占位（当前命盘的命宫文字 + "点击 AI 按钮"提示）
- 点击「AI 深度批命」后由 `overall_piming` 返回的 `card.{ title, summary, risk, basis }` 覆盖

**调试区（aip-overall-debug-card）：**
- 每次 `renderAIPiming()` 强制隐藏并清空
- AI 返回后显示，内容来自 `debug.{ model, durationMs, requestSummary, trace[], rawResponse }`
- 用原生 `<details>` 折叠，无额外 CSS 依赖

**API base：**
- 已统一：overall 调用复用 `_resolvePimingApiBase()` + `_joinApiUrl()`
- `OVERALL_PIMING_API_BASE` 硬编码已删除

**旧逻辑保留但不是主链：**
- `chart.html` 内联的 `_bindAipAiBtn()`（topic=base/luck 的旧分支）仍存在但已被 `ai-piming.js` 的 `_initAipNewBackend()` 覆盖
- `buildBaseMingAnalysis()` 仍存在，用于 aip-sf/shen/sh 本地卡片和 aip-life 占位

---

## 6. 已知未完成项

- `overall_piming` 的 prompt 目前只做了基本命盘文字拼接，没有规则层——这是第 3 步的任务
- `aip-life` 占位文字与 AI 返回格式不一致，第 5 步再统一优化

---

## 7. 建议下一步

**第 2 步已完成，可进入第 3 步。**

第 3 步：把 overall_piming 从纯 prompt 提升成"规则 + 证据 + 表达"

具体做：
- `server/index.js` 的 `buildOverallPimingPrompt()` 加规则层（格局判断规则、用语规范）
- prompt 增加"证据先行"要求（先列星曜证据，再给判断）
- 可在 `card` 里加 `evidence[]` 字段供前端展示依据

改动范围：仅 `server/index.js`（buildOverallPimingPrompt 函数），不动前端链路。
