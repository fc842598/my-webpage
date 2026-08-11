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

## 紫微文章流程

用户提到“写文章”“继续写两篇”“更新文章”“SEO文章”“紫微文章”时，默认执行这套流程：

1. 写前扫描 `articles/`、索引、Feed 和 sitemap。相似标题或搜索意图只作为人工判断提示，不按相似度自动否决；确认确实重复时再换角度、升级旧文或合并。
2. 同步文稿、站内数据和搜索数据都是专业参考资料，不是每篇文章的强制证据。用户、编辑、Codex 或豆包直接提供的完整文章可以走独立发布通道，不要求证据卡、观点配额或数据锚点。
3. 篇幅和结构服从读者问题。保留一个明确 H1，但不固定字数、开头段数、H2 数量、例子数量或结尾形式；内容讲清即可，不为满足格式硬塞段落。
4. 风格要求仍然保留：懂行但通俗，少玄乎，能说明星曜、落宫、组合与现实含义，不写模糊万能话或绝对人生断言。
5. SEO 与技术完整性必须保留：同步 `title`、description、canonical、OG、Article JSON-LD、hreflang、内链、索引、Feed 和 sitemap；SEO规则变更时优先查 Google Search Central 官方资料。
6. 上线前按单篇验证 JSON-LD、禁用来源词、URL/索引/Feed/sitemap 完整性和浏览器显示。相似度、篇幅和结构只出编辑提示，不阻断；一篇失败只暂停该篇，不影响同日其他文章。
7. 执行 `git push` 后必须复查远端一致和线上页面生效。

## 英文文章固定流程

用户提到“英文文章”“英文版本”“翻译文章”“English article”时，不做逐句硬翻译，默认执行英文改写流程：

1. 英文读者默认是英语圈/美国用户，可能知道 astrology、birth chart、Chinese astrology，但不一定知道紫微斗数术语。
2. 英文标题保留必要 SEO 关键词：`Zi Wei Dou Shu`、`Chinese astrology chart`、`Life Palace`、`Wealth Palace`、`Career Palace`、`annual cycle` 等；正文先用英文解释意思，再少量保留术语。
3. 风格固定：少玄乎、少专名堆叠；用 everyday English、career/money/relationship/platform/cash flow 这类现实词解释。
4. 每篇中文紫微文章上线时，同步生成英文改写页、英文 canonical、OG、Article JSON-LD、`hreflang` 双向链接、`articles/en/feed.xml`、`sitemap-en.xml`。
5. 英文页统一由 `node scripts/generate-en-articles.mjs` 生成，目录在 `articles/en/`；改英文内容先改生成器数据，再重新生成。
6. 英文保留自然改写、SEO 和查重提示，但不固定词数、H2 数量或例子数量；避免逐句硬翻和批量同质页面。

## 每日文章发布节奏

每日可安排 `10-30` 篇中文文章并同步英文改写版，分时发布。队列按单篇审核、单篇提交、单篇上线；某篇有问题只暂停该篇，其余合格文章继续发布。已发布选题要记录，重复风险交给人工判断，不按相似度自动判死。

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
