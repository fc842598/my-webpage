# 阅天AI / YuetianAI 开发入口

这个前端仓库是静态站，主要页面和交互都在本仓库；API、支付、会员、邀请、Coze 接口主要在后端仓库：

- 前端：`C:\Users\1\Desktop\家里用的图标`
- 后端：`C:\Users\1\Desktop\ai-piming-backend`

开新窗口接这个项目时，先读：

1. [docs/codex-site-handoff.md](docs/codex-site-handoff.md)
2. [docs/coze-yuetianai-ziwei-openapi.yaml](docs/coze-yuetianai-ziwei-openapi.yaml)
3. 后端 `docs/handoff/` 下最近的交接文档

## 必知约定

- 发布/上线默认只认 GitHub `master` 为唯一源头：
  - 阿里云服务器已有自动同步：`/usr/local/bin/yuetian-sync.sh`
  - 定时任务：每分钟拉取 `https://github.com/fc842598/my-webpage.git`
  - 线上目录：`/usr/share/nginx/html`
  - 同步范围必须包含：`index.html`、`robots.txt`、`sitemap.xml`、`articles`、`css`、`fixtures`、`images`、`js`、`pages`、`src`、`vendor`
  - 不要另建 GitHub Actions、不要另建分支、不要绕开 GitHub 单独手工维护阿里云文件；临时救火后也要回到 GitHub 源头。
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

## 紫微文章固定流程

用户提到“写文章”“继续写两篇”“更新文章”“SEO文章”“紫微文章”时，默认执行这套流程：

1. 写前先查重：扫 `articles/`、`articles/index.html`、`feed.xml`、`sitemap*.xml`，确认标题、搜索意图、开头、例子不与旧文重复。重复时优先换角度、升级旧文或合并。
2. 素材必须来自用户提供的同步文稿和站内已定方向；可在交付说明里标注参考页码/段落范围，但正文不要写“文稿里”“讲义里”“他说”“天纪”“倪海厦”等来源痕迹和品牌词。
3. 常规深版正文约 `1600-2200` 个汉字；单一概念短文不得低于 `1000` 个汉字，除非用户明确要求短。
4. 结构固定：一个明确 H1；开头 `2-3` 段讲清问题；正文 `4-6` 个 H2；至少 `3-5` 个明确组合例子；结尾给排盘使用顺序。
5. 风格固定：懂行但通俗，少玄乎，多结构；必须讲清强弱、落宫、组合和现实应用，不写模糊万能话。
6. 例子优先用确定组合：如命宫/财帛财星看先天财，财在官禄或迁移看后天财，流年落财帛先看钱，流年落迁移先看动，财帛化科靠专业，官禄化权看责任位置，财帛化忌先控现金流。
7. SEO固定：同步 `title`、`description`、canonical、OG、Article JSON-LD、内链、`articles/index.html`、`feed.xml`、`sitemap*.xml` 的 `lastmod`；SEO规则变更时优先查 Google Search Central 官方资料。
8. 上线前固定验证：JSON-LD 可解析、禁用词检索、重复内容检查、`node scripts/check-geo-local.js`、浏览器抽查。执行 `git push` 后必须复查远端一致和线上页面生效。

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
