# 2026-04-18 许大师发送解锁修复

## 问题
- 第一条消息发完后，第二条发不了。
- 不是后端没回，而是前端发送完成后没有把输入框和按钮重新启用。

## 原因
- `js/ai-chat.js` 的 `send()` 里：
  - 发送前先 `_setInputEnabled(false)`
  - `finally` 又用了错误条件判断
  - 导致正常成功后也不执行重新解锁

## 修复
- 增加 `shouldRestoreInput`
- 默认成功后恢复输入
- 只有 `setupRequired` 这类必须锁死的情况才不恢复
