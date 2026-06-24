# 豆包 / 头条搜索 GEO 执行手册

目标不是“给豆包提个交就收录”，而是先进入它可能会检索到的候选资料池，再提升被引用概率。

## 你现在已经有的

- 首页、主排盘页、文章页已经补了更明确的 `title / description / canonical / JSON-LD`
- 已新增：
  - `https://yuetianai.com/llms.txt`
  - `https://yuetianai.com/articles/ai-ziwei-paipan-zenme-xuan.html`
  - `https://yuetianai.com/articles/mianfei-ziwei-paipan-hou-xian-kan-shenme.html`
- 已有 `robots.txt`，并准备了主 sitemap 与拆分 sitemap：
  - `https://yuetianai.com/sitemap.xml`
  - `https://yuetianai.com/sitemap-pages.xml`
  - `https://yuetianai.com/sitemap-articles.xml`
  - 如果服务器同步白名单还没覆盖新的根目录文件，第一阶段先只对外启用 `sitemap.xml`，等服务器确认会同步子 sitemap 后，再把拆分 sitemap 挂到 `robots.txt`

## 你接下来必须做的

### 1. 先上线到正式站

把这轮改动推到 GitHub `master`，等线上自动同步完成。

### 2. 先跑一遍自检

```bash
node scripts/check-geo-basics.js
```

重点看 4 件事：

- `robots.txt` 是 `200`
- `sitemap.xml` 是 `200`
- `llms.txt` 是真实文本 `200`
- 随机不存在路径必须返回 `404`

如果最后一条还是 `200`，继续按 [geo-seo-server-checklist.md](/C:/Users/1/Desktop/家里用的图标/docs/geo-seo-server-checklist.md:1) 改服务器。

### 3. 登录 Google Search Console

官方入口：

- [Google Search Console 站点地图帮助](https://support.google.com/webmasters/answer/7451001?hl=zh-Hans)
- [Google 搜索中心：创建和提交站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-cn)

做这几步：

- 验证 `yuetianai.com`
- 提交 `https://yuetianai.com/sitemap.xml`
- 如果界面支持多 sitemap，再补提：
  - `https://yuetianai.com/sitemap-pages.xml`
  - `https://yuetianai.com/sitemap-articles.xml`
- 请求抓取：
  - 首页
  - `pages/mingbook-onepage.html`
  - 两篇新文章

### 4. 登录头条搜索站长平台

平台入口：

- [头条搜索站长平台](https://zhanzhang.toutiao.com)

我已经实查到它首页 meta 里明确写着支持这些能力：

- `sitemap 提交`
- `流量索引量监控`
- `抓取频次上限调整`

官方 Bytespider 说明页：

- [关于 Bytespider](https://zhanzhang.toutiao.com/docs/intro/26899)

你登录后按这个顺序做：

1. 添加站点 `https://yuetianai.com`
2. 做站点验证
3. 提交 `https://yuetianai.com/sitemap.xml`
4. 如果界面支持多 sitemap，再补提：
   - `https://yuetianai.com/sitemap-pages.xml`
   - `https://yuetianai.com/sitemap-articles.xml`
5. 看有没有“官网认证”
6. 打开抓取频次和索引量监控

### 5. 如果你要申诉或反馈抓取问题

我从字节官方 `Bytespider` 文档里抓到了这个反馈邮箱：

- `zhanzhang@bytedance.com`

适合用在：

- 已验证站点但抓取异常
- 抓取量过大
- 已提交 sitemap 但长期没动静

### 6. 固定每周复测

每周开 fresh chat 测这几组问法：

- `紫微斗数免费的排盘网站`
- `免费紫微斗数排盘`
- `AI紫微排盘`
- `AI命盘分析`
- `AI算命网站哪个好`

记录 4 件事：

- 有没有出现 `yuetianai.com`
- 有没有出现 `阅天AI`
- 有没有出现你文章里的观点
- 有没有引用你站内的 FAQ 逻辑

## 哪些词先打，哪些词后打

先打：

- `免费紫微斗数排盘`
- `AI紫微排盘`
- `免费紫微斗数排盘后先看什么`
- `紫微斗数命宫怎么看`

后打：

- `AI算命网站哪个好`

原因很简单：前者更像工具查询，后者更容易触发平台安全改写和风险提醒。

## 还可以继续补的站外动作

- 找 3 到 5 个可抓取的第三方提及：
  - 产品目录
  - 测评帖
  - 社区经验帖
- 统一品牌写法：
  - `阅天AI`
  - `YuetianAI`
  - `免费紫微斗数排盘`
  - `AI命盘分析`

## 完成标准

短期不是“豆包第一时间推荐你”，而是：

- 头条站长平台已验证站点
- sitemap 已提交
- Bytespider 能正常抓
- 随机坏链接返回真实 `404`
- 品牌词和工具词能稳定搜到官网
- 豆包回答里开始出现你的品牌名、官网或站内观点
