# 阅天AI / YuetianAI 开发入口

这个前端仓库是静态站，主要页面和交互都在本仓库；API、支付、会员、邀请、Coze 接口主要在后端仓库：

- 前端：`C:\Users\1\Desktop\家里用的图标`
- 后端：`C:\Users\1\Desktop\ai-piming-backend`

开新窗口接这个项目时，先读：

1. [docs/codex-site-handoff.md](docs/codex-site-handoff.md)
2. [docs/coze-yuetianai-ziwei-openapi.yaml](docs/coze-yuetianai-ziwei-openapi.yaml)
3. 后端 `docs/handoff/` 下最近的交接文档

## 必知约定

- 邮箱能力默认复用现有链路，不新建系统：
  - 实现：`C:\Users\1\Desktop\ai-piming-backend\lib\payments\paymentNotify.js`
  - 发信：Resend
  - 默认收件箱：`842598522@qq.com`
  - 默认环境变量：`RESEND_API_KEY`、`PAYMENT_NOTIFY_FROM`、`PAYMENT_NOTIFY_EMAILS`
- `pages/contact.html` 当前提交到 `https://api.yuetianai.com/api/contact/submit`，并支持截图上传。
- 手机端主战场是：
  - 页面：`pages/wentian-app.html`
  - 逻辑：`js/wentian-app.js`
- 电脑端阳宅主页面：`pages/yangzhai.html`
- 手机端阳宅在 `wentian-app` 里，重点是 `screen-42/43/44`
- 手机端支付宝默认走二维码扫码思路，不要改回 `AI收` 或强制 H5 跳转。
- 邀请奖励当前规则：
  - 邀请人和被邀请注册人双方都拿奖励
  - 每天 `10` 次许大师对话
  - 连发 `3` 天
- 统计脚本当前是 GA4，不是百度统计：
  - 文件：`js/site-analytics.js`
  - ID：`G-5K7WRWHT3T`

## 快速定位

- 首页：`index.html`
- 联系页：`pages/contact.html`
- 手机端整站壳：`pages/wentian-app.html`
- 手机端主逻辑：`js/wentian-app.js`
- 阳宅桌面页：`pages/yangzhai.html`
- 支付相关前端：`js/wentian-app.js`、`js/mingbook-onepage.js`
- Coze OpenAPI：`docs/coze-yuetianai-ziwei-openapi.yaml`

## 常用校验

- 前端脚本语法：`node --check js/wentian-app.js`
- 紫微/子平校验：`npm run validate:ziping:all`
- 批命契约冒烟：`npm run smoke:overall-piming`
- 后端构建：在 `C:\Users\1\Desktop\ai-piming-backend` 跑 `npm run build`

## 提醒

- 这个仓库经常有未提交临时图、预览图、脚本，不要顺手清掉用户自己的东西。
- `docs/codex-site-handoff.md` 里已经整理了历史线程里沉淀下来的功能决策和坑点，改站前先看那份。
