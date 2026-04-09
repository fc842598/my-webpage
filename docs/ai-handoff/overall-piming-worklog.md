# overall_piming 接力工作日志

## 1. 当前阶段

整体批命大方向 **第 2 步 / 共 5 步**

---

## 2. 本次目标

把整体批命页的主卡片、调试区、请求地址统一到同一条 overall_piming 链，消除多源混用问题。

---

## 3. 实际改动文件

- `js/ai-piming.js`
- `pages/chart.html`

---

## 4. 本次完成内容

- 删除 `ai-piming.js` 中硬编码的 `OVERALL_PIMING_API_BASE` 和 `_aipJoinOverall()`
- `_aipCallBackend('overall')` 改为调用 `_resolvePimingApiBase()` + `_joinApiUrl()`（复用 chart.html 的探测逻辑）
- `_aipRenderResult('overall')` 目标改为 `aip-life`（命宫格局）而非 `aip-sh`（生年四化）
- AI 返回的 `debug` 字段写入新增的 `#aip-overall-debug-card` 折叠卡片，默认隐藏，AI 返回后显示
- `renderAIPiming()` 给 `aip-life` 加静态占位（排盘后立即有本地计算的命宫文字，AI 调用前不留空白；有 AI 结果后不覆盖）
- `aip-sf`、`aip-shen`、`aip-sh` 继续由 `buildBaseMingAnalysis()` 本地计算填写，不受影响

---

## 5. 当前链路状态

**主卡片（aip-life 命宫格局）：**
- 排盘后立即由 `buildBaseMingAnalysis().life` 填入本地计算结果（占位）
- 点击「AI 深度批命」后由 `overall_piming` 返回的 `card.{ title, summary, risk, basis }` 覆盖

**调试区（aip-overall-debug-card）：**
- 默认隐藏
- AI 返回后显示，内容来自 `overall_piming` 返回的 `debug.{ model, durationMs, requestSummary, trace[], rawResponse }`
- 用原生 `<details>` 折叠，无额外 CSS 依赖

**API base：**
- 已统一：overall 调用复用 `_resolvePimingApiBase()` + `_joinApiUrl()`，与 topic=luck/base 共用同一套探测/切换逻辑
- `OVERALL_PIMING_API_BASE` 硬编码已删除

**旧逻辑保留但不是主链：**
- `chart.html` 内联的 `_bindAipAiBtn()`（topic=base/luck 的旧分支）仍存在但已被 `ai-piming.js` 的 `_initAipNewBackend()` 覆盖
- `buildBaseMingAnalysis()` 仍存在，用于 aip-sf/shen/sh 本地卡片和 aip-life 占位

---

## 6. 已知未完成项

- `overall_piming` 的 prompt 目前只做了基本命盘文字拼接，没有规则层（规则+证据+表达）——这是第 3 步的任务
- 调试区只做了折叠显示，没有"重新测试"按钮或 prompt 可视化——后台 admin 已覆盖这个需求
- `aip-life` 占位的本地文字（`buildBaseMingAnalysis().life.body`）与 AI 结果格式不一致，会在切换时闪烁——可在第 3/5 步优化

---

## 7. 建议下一步

**进入第 3 步：把 overall_piming 从纯 prompt 提升成"规则 + 证据 + 表达"**

具体要做：
- `server/index.js` 的 `buildOverallPimingPrompt()` 加入规则层（格局判断规则、用语规范）
- prompt 增加"证据先行"要求（先列星曜证据，再给判断）
- 返回结构可在 `card` 里加 `evidence[]` 字段，供前端展示依据

改动范围：`server/index.js`（buildOverallPimingPrompt 函数），不动前端链路。
