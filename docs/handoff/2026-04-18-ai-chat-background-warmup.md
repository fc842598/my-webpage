# 2026-04-18 许大师后台补全

## 本次目标
- 让用户进入许大师后先能直接问。
- 不要求先去点整体批命/身宫/大运/流年。
- 缺的命书结论改成后台静默补全，再自动刷新 A 记忆。

## 实际完成
- `js/ai-chat.js`
  - 加了后台补全状态条 `chat-background-status`
  - 新增当前大运/流年序列化逻辑，直接复用现有命盘数据发 `overall / shengong / dayun_item / liunian_year`
  - 首次进入后，如果 Memory A 缺内容，就后台顺序补跑，再静默刷新 session
  - 后台刷新不再锁输入框
- `pages/chart.html`
  - 加了后台补全状态节点
- `css/chart.css`
  - 加了后台补全状态样式

## 验证
- `node --check js/ai-chat.js`
- 本地后端接口联调后，前端会拿到 `memoryABuildMode=fast` 的 session，再允许后续后台补全

## 说明
- 这次没有改现有 tab 结构。
- 进入许大师的体验变成：
  1. 先给一个可用的 A
  2. 后台慢慢补整体/身宫/当前大运/当前流年
  3. 再静默刷新 A
