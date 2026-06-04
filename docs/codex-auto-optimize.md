# Codex 自动减压

位置：`tools/codex-auto-optimize.ps1`

作用：

- 只在你正在用 Codex，或 Codex 帮手进程明显较多时盯系统压力。
- 连续两轮检测到 `CPU >= 82%` 或 `可用内存 <= 1.6GB`，才出手。
- 安装时优先走计划任务；如果系统不放行，会自动降级到 `HKCU\\...\\Run` 自启动。
- 不碰当前 Codex 主窗体、renderer、gpu 进程。
- 默认保留最近 2 组 Codex helper，不动你刚刚正在跑的线程。
- 只对老的、空闲的 `node_repl` / `thread-server` 做内存回收，并临时降到 `BelowNormal`。
- 只有在内存压力更重时，才额外回收 `core-server` 常驻内存。

命令：

- 安装并立即启动：`npm run codex:auto-optimize:install`
- 干跑测试：`npm run codex:auto-optimize:test`
- 卸载：`npm run codex:auto-optimize:remove`

日志：

- `%LOCALAPPDATA%\\CodexAutoOptimize\\codex-auto-optimize.log`

计划任务名：

- `CodexAutoOptimize`
