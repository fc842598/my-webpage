# 命盘到许大师的入口统计

命盘下方主按钮：让许大师解读这张命盘。电脑端滚动到本页许大师模块，手机端沿用 `screen-4`，原有手机重定向保持不变。

| GA4 事件 | 触发条件 |
| --- | --- |
| `xu_entry_view` | 排盘完成，主按钮至少 50% 进入视野 |
| `xu_entry_click` | 用户点击主按钮 |
| `xu_chat_enter` | 有当前命盘，许大师对话区域实际进入视野 |

参数：`surface` 为 `desktop_chart` 或 `wentian_mobile`；`entry_location` 为 `chart_below` 或 `other`。点击后 10 秒内进入同一张盘的对话，归因为 `chart_below`。曝光、进入对话在同次页面加载中按命盘去重；每次实际点击均记录。

命盘 ID 只在浏览器内存中用于去重，不传给 GA4，也不新增出生信息、姓名或聊天正文的采集。

在 GA4 探索中建立 `chart_complete → xu_entry_view → xu_entry_click → xu_chat_enter → ai_question_submit` 漏斗，并按 `surface` 拆分。漏斗应使用用户/会话口径；单独查看 `xu_chat_enter` 时可按 `entry_location` 区分新按钮和其他路径。新事件只从上线后开始积累，不能补算历史曝光。

本地验证：`node scripts/test-xu-funnel-analytics.mjs`。浏览器调试使用 `?ga_debug=1`；GA4 DebugView 用于确认接收。
