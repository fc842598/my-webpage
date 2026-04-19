# AI半仙记忆策略重构（前端侧）· 2026-04-19

## 改了什么

**`js/ai-chat.js`** 完全重写，删除约 200 行 warmup 相关代码：

- 删除：`_warmUp`、`_startBackgroundWarmup`、`_runBackgroundWarmup`
- 删除：`_markUserActivity`、`_resetBackgroundWarmup`
- 删除：`_getDayunRanges`、`_getCurrentDayunRaw`、`_serializeDayunForWarmup`、`_serializeYearForWarmup`
- 删除：`_SANHE_PARTNERS`、`_DUIGONG`、`_getMissingModuleKeys`、`_getModulesIncluded` 等辅助计算
- 删除：`_backgroundWarmupState`、`_backgroundWarmupTimer` 等状态变量
- `_loadSession` 去掉 backgroundSync/silentSync 分支
- `_setMemorySources` 改为固定显示新结构（见下）

**`css/chart.css`**
- 新增 `.chat-memory-source.is-demand` 样式（灰色半透明）

## 新的 UI 状态标签

进入 AI半仙后，"命书来源"区域现在显示：

```
✓ 已读 基础命盘
○ 按需 整体结论
○ 按需 身宫结论
○ 按需 大运结论
○ 按需 流年结论
```

不再有"待补 整体批命 / 待补身宫批命"这类后台排队感。

## 背景状态栏

进入后固定显示："基础命盘已读入，专题结论按需调用。"  
不再有"后台补全中：整体批命…"等进度提示。

## 进入速度

旧流程：session 初始化 → warmup 队列排队（overall → shengong → dayun → liunian → 刷新 A）  
新流程：session 初始化 → A0 生成（毫秒级，无 AI 调用）→ 直接可聊

## 详细后端说明

见后端仓库：`docs/handoff/2026-04-19-ai-chat-memory-split.md`
