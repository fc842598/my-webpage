# 阅天AI网站续工文档

这份文档是把这个站点之前在 Codex 里反复改过的内容、接口、踩坑和默认约定收成一个入口。以后开新窗口，先看这份，再开始动代码。

## 1. 项目结构

前端仓库：

- 路径：`C:\Users\1\Desktop\家里用的图标`
- 形态：静态页 + 大量前端脚本拼页面
- 重点文件：
  - 首页：`index.html`
  - 手机端总入口：`pages/wentian-app.html`
  - 手机端主逻辑：`js/wentian-app.js`
  - 联系页：`pages/contact.html`
  - 阳宅桌面页：`pages/yangzhai.html`
  - 统计脚本：`js/site-analytics.js`

后端仓库：

- 路径：`C:\Users\1\Desktop\ai-piming-backend`
- 形态：Next API
- 重点目录：
  - `pages/api/`
  - `lib/`
  - `docs/handoff/`

## 2. 建议阅读顺序

1. 本仓库 [AGENTS.md](AGENTS.md)
2. 本仓库 [docs/coze-yuetianai-ziwei-openapi.yaml](docs/coze-yuetianai-ziwei-openapi.yaml)
3. 本文档
4. 后端 `docs/handoff/` 最近几份文档
5. 相关功能代码本身

## 3. 当前已确认的全局约定

### 发布 / SEO 文章上线

默认发布链路只认 GitHub `master` 为唯一源头，不要另起分支或另造 GitHub Actions。

- 阿里云服务器已有自动同步脚本：`/usr/local/bin/yuetian-sync.sh`
- 定时任务每分钟执行一次，从 `https://github.com/fc842598/my-webpage.git` 拉取 `master`
- 线上目录是 `/usr/share/nginx/html`
- 同步范围必须包含：`index.html`、`robots.txt`、`sitemap.xml`、`articles`、`css`、`fixtures`、`images`、`js`、`pages`、`src`、`vendor`
- SEO 文章版块在 `articles/`，站点地图是 `sitemap.xml`

Google 收录提交流程：
- 首页保留 Google Search Console 验证标签，不要删除 `index.html` 里的 `google-site-verification` meta。
- 每次新增或改文章后，同步更新 `sitemap.xml` 的文章 URL 和 `lastmod`。
- 提交并 push 到 GitHub `master`，等阿里云自动同步上线后，确认 `https://yuetianai.com/sitemap.xml` 能访问。
- 进入 Google Search Console 的站点地图页面，提交或重新提交 `sitemap.xml`；文章 URL 不需要散落在功能页面，靠文章索引页、内链和 sitemap 发现。
- 已加 IndexNow 自动提交流程：`git push origin master` 后会通过根目录 `8d5c8f7d8a0f4e8cb61a5f62b3d41944.txt` 这个键文件，把本次变动 URL 推送到 `https://api.indexnow.org/indexnow`，Bing 等参与方会共享这些 URL。

百度收录提交流程：
- 首页保留百度资源平台验证标签，不要删除 `index.html` 里的 `baidu-site-verification` meta。
- 百度资源平台当前验证站点是 `https://www.yuetianai.com`，验证完成后再进入“普通收录”或相关提交入口。
- 每次新增或改文章后，同步更新 `sitemap.xml` 的文章 URL 和 `lastmod`，push 到 GitHub `master`，等阿里云自动同步上线。
- 百度侧提交不保证立即收录，但可以缩短发现时间；后续按 sitemap 和文章链接持续提交即可。
- 已加本地自动提交流程：`git push origin master` 后会触发 `.githooks/post-push`，脚本会等待线上 `sitemap.xml` 同步，再按本次 push 里变动的页面自动调用百度普通收录 API。
- 本地仓库需设置：`git config core.hooksPath .githooks`、`git config seo.baiduPushSite www.yuetianai.com`、`git config seo.baiduPushToken <token>`；安装脚本是 `npm run seo:hooks:install`。

以后发文章的正确流程是：本地写文章 -> 提交并 push 到 GitHub `master` -> 阿里云自动同步上线。不要把阿里云当成第二份源代码单独维护。

### 邮箱

默认复用现有邮件链路，不新建第二套。

- 现成实现：`C:\Users\1\Desktop\ai-piming-backend\lib\payments\paymentNotify.js`
- 发信服务：Resend
- 默认收件箱：`842598522@qq.com`
- 默认环境变量：
  - `RESEND_API_KEY`
  - `PAYMENT_NOTIFY_FROM`
  - `PAYMENT_NOTIFY_EMAILS`

只要用户说“接入邮箱”“邮件通知”“提交后发邮箱”，默认按这套做。除非用户明确要求，否则不要改成 QQ SMTP，不要重新造邮件系统。

### 统计

当前线上走的是 GA4，不是百度统计。

- 脚本文件：`js/site-analytics.js`
- Measurement ID：`G-5K7WRWHT3T`
- 已接入页面：
  - `index.html`
  - `pages/contact.html`
  - `pages/liuyao.html`
  - `pages/liuyao-v2.html`
  - `pages/mingbook-onepage.html`
  - `pages/privacy.html`
  - `pages/wentian-app.html`
  - `pages/yangzhai.html`

之前做过百度统计尝试，但最终代码里落地的是 GA4。以后先以现状为准，不要把“做过百度统计线程”误当成当前线上实现。

## 4. 前端主战场

### 4.1 `wentian-app`

这是手机端主战场，绝大多数高频改动都在这里：

- 页面壳：`pages/wentian-app.html`
- 逻辑核心：`js/wentian-app.js`

这份文件很大，历史上改过很多：

- 手机短页自动收高，减少大段留白
- 标准页面恢复原生页脚，超长页才启用浮动页脚
- 手机端阳宅 `screen-42/43/44` 与桌面阳宅功能对齐
- 邀请奖励文案和前端展示对齐后端真实规则
- 支付页的支付宝逻辑、异常态、二维码态修过多轮
- 小流年 `4岁` 等年龄高亮做过自动消失修复

以后改这里，优先小范围改，不要一口气重构整文件。

### 4.2 阳宅

桌面阳宅页：

- 文件：`pages/yangzhai.html`

手机端阳宅：

- 在 `wentian-app` 内
- 重点 screen：
  - `screen-42`：九宫主页
  - `screen-43`：选人/安位弹层
  - `screen-44`：结果页

已经沉淀下来的规则：

- 手机端已补齐“外公 / 外婆”选项
- 已补 `65岁前 / 65岁后` 逻辑
- `65岁后退居东北位` 等长辈提示已接入
- `screen-43` 做过多轮层级、文案、首屏按钮可见修复
- 桌面端的小九宫示意图做过缩小
- 文案方向收成：
  - `先定中心，再按实际居住位置安人`
  - 不要反复解释同一件事

### 4.3 联系页

- 文件：`pages/contact.html`
- 前端调用：`https://api.yuetianai.com/api/contact/submit`

已完成能力：

- 简化过页面结构
- 支持截图上传
- 前端会压缩图片
- 后端会存储截图并回传链接
- 邮件里发截图链接
- 后台可预览截图

注意：

- 联系页以前本地 `server/` 里有过一套旧逻辑，但现在默认应以前后端正式接口链路为准
- 如果再做邮件相关，默认复用后端现有 Resend 链路

## 5. 后端接口分组

后端仓库：`C:\Users\1\Desktop\ai-piming-backend`

### 5.1 Coze / 豆包相关

重点接口：

- `GET /api/coze/workflow-text`
- `POST /api/coze/intake`
- `POST /api/coze/fortune`
- `POST /api/coze/chart`
- `POST /api/coze/shichen-infer`
- `GET /api/coze/openapi.json`
- `POST /api/coze/entry`

说明：

- OpenAPI 文件在本仓库：`docs/coze-yuetianai-ziwei-openapi.yaml`
- `coze/entry` 做过升级，支持“按宫位追问”
- 已修过“命盘里的命被误识别成命宫”的 bug
- 现在指定宫位追问时，会优先返回本宫、对宫、三方四正，而不是只给总述

### 5.2 支付 / 会员

重点接口：

- `POST /api/payments/create-order`
- `POST /api/payments/create-session`
- `GET /api/payments/member-status`
- `GET /api/payments/products`
- `GET /api/payments/order-status`
- `POST /api/payments/refunds`
- `POST /api/payments/wechat/notify`
- `POST /api/payments/alipay/notify`
- `GET /api/payments/aipay/resource`

重要约定：

- 手机端支付宝默认走二维码思路
- 不要再改回 `AI收/402` 入口
- 支付异常页做过收口，支付宝权限异常时不要把长错误链接直接怼给用户

### 5.3 联系表单

重点接口：

- `POST /api/contact/submit`
- 后台页：`/admin/contact-tickets`

已做过的事：

- 联系表单从 404 修到正式生产可用
- 图片上传、链接回存、后台预览已经接好

### 5.4 邀请奖励

重点接口：

- `GET /api/referrals/summary`
- `POST /api/referrals/bind`

当前真实规则：

- 邀请人和被邀请注册人双方都得奖励
- 每天 `10` 次许大师对话
- 连续 `3` 天

这条规则已经前后端对齐，不要再按旧的“注册各 2 次 + 首付邀请人再得 10 次”去理解。

## 6. 历史线程沉淀出来的关键决策

### 6.1 首页 Logo

首页 logo 动效改过很多轮，最终方向是：

- 外框静止
- 内盘单独转动
- 不要再转整张 logo
- 放大状态也不能露出方框残影
- 去掉 hover 改速，避免“突然跳角度”

如果以后要再动它，先检查是不是又回到了“整图裁剪旋转”的老问题。

### 6.2 手机短页留白

`wentian-app` 里以前很多页面“一屏能放完却被空白撑长”。已经做过一轮系统治理：

- 短内容页按内容收高
- 空列表页不按长列表高度撑
- 标准页面恢复原生底部导航
- 超长页才用浮动页脚

如果以后又出现手机页大留白，优先查：

1. 页面高度是否被统一逻辑多撑了
2. 是否空列表还显示了长列表布局
3. 是否隐藏了原生页脚却没补出浮动页脚

### 6.3 小流年 `4岁` 高亮

命盘里 `4岁` 这种小框高亮修过：

- 小标可以保留
- 外层临时框应 2 秒后消失
- 不应该持续闪回

以后如果再出问题，优先查 `wentian-app.js` 里小流年 badge 的 timer 和重绘逻辑。

### 6.4 档案选择页

档案选择页做过几轮：

- 列表文字压盖修过
- `A/B` 方案预览图是临时的，最终页面不应长期保留这些预览链接
- “更多档案”的假内容不要乱加

### 6.5 支付

已明确的决策：

- 手机端支付宝要像电脑端一样给二维码扫码路径
- 不能把真人用户带到“AI收”式入口
- 支付异常要短提示，不要展示长报错 URL

## 7. 验证建议

前端常用：

- `node --check js/wentian-app.js`
- `npm run validate:ziping:all`
- `npm run smoke:overall-piming`

后端常用：

- 在 `C:\Users\1\Desktop\ai-piming-backend` 跑 `npm run build`
- 需要时补跑 `npm run test:classic-patterns`

视觉/交互高风险改动后，优先用真实浏览器过：

- `pages/wentian-app.html`
- `pages/contact.html`
- `pages/yangzhai.html`
- 支付相关页面

## 8. 现在最容易续工的入口

如果下一次只是继续改站，优先从下面几个入口开始：

1. 手机端页面和交互：`js/wentian-app.js`
2. 阳宅桌面页：`pages/yangzhai.html`
3. 联系表单与通知：`pages/contact.html` + 后端 `pages/api/contact/submit.js`
4. Coze / 豆包接口：后端 `pages/api/coze/`
5. 邀请与会员奖励：后端 `pages/api/referrals/`、`lib/referrals.js`

## 9. 一句版提醒

这个项目不是“前端一个仓库就完事”的站。

- 页面大多在前端静态仓库
- 真正的接口、支付、会员、邀请、Coze、邮件大多在 `ai-piming-backend`
- 改功能前先确认是前端展示问题，还是后端接口/规则问题
- 邮件默认复用 Resend 老链路
- 手机端主战场默认就是 `wentian-app`
