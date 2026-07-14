# 2026-07-14 健康专题与统一会员支付交接

## 一句话现状

健康专题已经作为独立前台存在，但与命理线共用阅天账号、`monthly_member` 综合会员商品和同一套支付接口。统一会员结账页是 `https://yuetianai.com/yl.html#member`，命理线购买会员也应进入这个页面，不再保留另一套命理付款页。

## 仓库与线上状态

- 前端：`C:\Users\1\Desktop\家里用的图标`
- 前端分支：`master`
- 前端统一结账功能基线：`a69b7fe fix: default unavailable Alipay checkout off`
- 前端远端：`origin/master` 已与本地一致，线上资源已抽查生效
- 后端：`C:\Users\1\Desktop\ai-piming-backend`
- 后端分支：`main`
- 后端当前已推送提交：`5af4fbb Raise chart reading safety limits`
- 后端部署：Vercel，接口域名 `https://api.yuetianai.com`

发布仍只走 GitHub：前端推送 `master` 后，阿里云每分钟自动同步到 `/usr/share/nginx/html`；不要另建部署分支或只改服务器文件。

## 产品规则，以当前代码为准

- 商品键：`monthly_member`
- 商品名：`阅天综合会员`
- 国内价格：`¥19.90`
- PayPal 价格：`$2.99`
- 权益文案：
  1. 解锁网站全部权限
  2. AI 对话 80 次/天
- 每日额度：未登录 `3` 次，登录免费用户 `8` 次，综合会员 `80` 次
- 会员再次购买是续费，不拦截；每次成功付款在当前有效期基础上顺延 `31` 天
- 会员页会显示有效期和剩余天数
- 命理与健康前台内容独立，但登录、支付、会员状态和对话额度统一

注意：早期讨论过“会员 100 次/天”，后来已统一改成 `80 次/天`。新窗口不要再改回 100，除非用户重新确认。

## 健康专题当前结构

入口：`https://yuetianai.com/yl.html`

- `#home`：AI 中医体质分析首页
- `#assessment`：8 类体质自评
- `#report`：体质报告
- `#chat`：围绕报告继续追问的独立对话页
- `#member`：阅天综合会员统一结账页

8 类采集为：舌象、睡眠、情绪、胃口、大便、眼睛、腰腿、手脚冷热。

健康对话已真正接入后端 `POST /api/health/chat`。后端默认模型为 `HEALTH_CHAT_MODEL || deepseek-chat`，响应会标记 `source: deepseek`。系统提示限制为健康信息整理和养生参考，不做诊断、治疗、处方或用药指导。

固定免责声明必须保留：

> 本报告仅用于健康信息整理和养生参考，不构成医疗诊断或治疗建议。如有明显不适，请及时就医。

## 统一结账页当前流程

页面：`https://yuetianai.com/yl.html#member`

1. 未登录时，账号和密码输入框直接嵌在会员订单与支付方式之间，不再弹出登录遮罩。
2. 点击“确认开通”会聚焦本页账号输入框。
3. 可在本页登录，或用手机号快速注册。
4. 登录成功后自动留在本页并继续创建所选支付渠道的订单。
5. 已是会员仍可继续购买，按钮显示续费；付款成功后有效期顺延。

命理手机端统一入口由 `js/wentian-app.js` 中的 `WENTIAN_UNIFIED_MEMBER_URL = "/yl.html"` 控制，并携带 `source`、`returnUrl` 返回上下文。

## 三种支付方式

### 微信支付

- 微信内置浏览器：公众号 OAuth 后使用 JSAPI，直接拉起微信付款面板。
- 手机普通浏览器：调用 `POST /api/payments/wechat/handoff` 生成一小时有效的支付交接链接；提示用户“打开微信，把链接发给自己，再点开链接完成支付”。链接携带登录授权，无需在微信里再次登录。
- 电脑浏览器：使用 Native 二维码扫码支付。
- 前端交接键：`yuetian-payment-handoff-v1`
- 后端关键提交：`24bd122 Add WeChat JSAPI payment flow`、`6d0ed2b Add one-hour WeChat payment handoff`

### 支付宝

- 电脑和手机统一使用 `native` 二维码，不强制跳转支付宝 H5。
- 前端拿不到渠道状态时仍保持支付宝可选；接口异常只显示支付宝错误，不关闭渠道、不自动切换微信或 PayPal。
- 手机端不再强制使用支付宝 H5，也不要改回“AI收”入口。
- 手机可截图后在支付宝“扫一扫”中从相册识别二维码。

### PayPal

- 结账页切换 PayPal 后显示 `$2.99`，不显示人民币价格。
- 当前前端按跳转式支付处理。
- PayPal 真正生产环境收款仍应再做一次小额真实订单验证；不要只凭 Sandbox 成功就宣布正式收款完全可用。

## 前端关键文件和函数

- `yl.html`
  - 健康专题五个页面
  - `#ylHealthAuthPanel` 内嵌登录/注册
  - 三种支付按钮和二维码/状态面板
- `css/yl.css`
  - `html.yl-unified-checkout` 下是统一结账页样式
  - `.yl-health-auth` 必须保持普通文档流，不能重新变成 fixed 弹层
- `js/yl.js`
  - `renderHealthAuthPanel()`：显示内嵌登录
  - `submitHealthAuth()`：登录/注册后继续付款
  - `hydratePaymentProduct()`：读取商品、会员状态和有效期
  - `startHealthPayment()`：统一创建订单
  - `createWechatPaymentHandoff()`：普通手机浏览器生成微信交接链接
  - `renderMembershipState()`：显示会员有效期和剩余天数
- `js/wentian-app.js`
  - 命理手机端的统一会员入口、会员状态和 3/8/80 次额度文案

## 后端关键接口和文件

- `pages/api/health/chat.js`：健康 DeepSeek 对话、风险提示和额度扣减
- `pages/api/payments/products.js`：`monthly_member` 商品兜底配置
- `pages/api/payments/member-status.js`：会员状态、有效期和额度
- `pages/api/payments/create-order.js`：创建统一订单
- `pages/api/payments/create-session.js`：Native、JSAPI、redirect 会话
- `pages/api/payments/wechat/handoff.js`：一小时微信交接链接
- `pages/api/payments/wechat/oauth/start.js`
- `pages/api/payments/wechat/oauth/exchange.js`
- `lib/payments/memberService.js`：3/8/80 次额度和会员状态
- `lib/payments/paymentService.js`：三种支付渠道及支付成功处理
- `lib/payments/paymentNotify.js`：Resend 支付邮件通知

邮箱通知继续复用现有 Resend 链路，不新建 SMTP；默认接收邮箱和环境变量按根目录 `AGENTS.md` 执行。

## 最近重要前端提交

- `63bb11b`：登录/注册嵌入统一结账页，登录后原页继续支付
- `c981106`：历史兜底，曾在支付宝权限不足时切换渠道；现已按最新决定撤销自动切换
- `a69b7fe`：历史兜底，曾默认关闭支付宝；现已恢复支付宝默认可选
- `4330066`：删除手机结账页“会员订单”大标题
- `cb610cb`：微信交接链接在微信内直接进入付款流程
- `8731254`：允许会员续费，手机支付宝改为二维码
- `fae08f9`：结账页 Logo、字体与主站统一
- `070b834`：按确认稿重建统一结账页
- `3799e45`：命理与健康会员入口统一
- `7c9fe4a`：简化微信交接流程

## 2026-07-13 最后验证

- 线上 HTML、CSS、JS 缓存版本和新文案均已确认更新。
- 真实线上页面用浏览器检查了 `390 x 844` 和 `1440 x 900`。
- 未登录时登录卡片在页面内正常显示；点击付款后焦点落到“手机号或邮箱”。
- 控制台 `0` 错误、`0` 警告。
- 没有使用真实账号密码，也没有在最后一轮发起真实扣款。

## 当前工作区保护事项

本交接整理期间，`js/yl.js` 曾出现并行改动，提交 `c981106 fix: recover from unavailable Alipay QR` 一度加入自动切换；最新决定已经覆盖这套兜底。当前行为是：

- `apiFetch()` 保留后端错误码
- 识别支付宝 `ALIPAY_PERMISSION_REQUIRED` / 接口权限不足
- 支付宝异常时保持支付宝选中并显示简短错误，不禁用、不切换渠道
- 手机和电脑都请求 `native` 支付会话并显示支付宝二维码

继续支付工作时，应验证支付宝权限异常后仍停留在支付宝，以及手机、电脑二维码流程一致。

前端另有以下未跟踪内容，不属于本次统一支付提交，新窗口不要删除、回滚或顺手提交：

- `design-qa.md`
- `docs/design-references/`
- `static_analysis_semgrep_1/`
- `tools/`

后端工作区目前不是干净状态。以下已修改文件尚未提交，必须先阅读差异并确认来源，禁止 `git reset --hard` 或覆盖：

- `lib/ai/requestGuard.js`
- `lib/payments/paymentNotify.js`
- `lib/payments/paymentService.js`
- `pages/api/coze/entry.js`

后端还有 `.codex-backups/`、`.codex-worktrees/`、`.semgrep-settings.yml`、`pages/api/coze/openapi.json/` 和微信文章发布脚本等未跟踪内容，也不要擅自清理。

## 下一窗口建议先做

1. 先读本文件、根目录 `AGENTS.md` 和 `docs/codex-site-handoff.md`。
2. 运行前后端 `git status --short`，保护现有未提交内容。
3. 若继续支付，优先做真实账号的小额端到端验证：登录、创建订单、真实付款、回调、会员有效期顺延、额度刷新、支付通知。
4. 分别验证微信内 JSAPI、手机普通浏览器交接、电脑 Native 二维码、支付宝二维码和 PayPal 生产订单。
5. 支付相关改动必须做手机/电脑浏览器实测和安全复查；前后端分开提交、分开推送。
