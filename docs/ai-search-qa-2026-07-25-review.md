# AI算命搜索问答专题发布复核 2026-07-25

## 批次概况

- 批次日期：2026-07-25（Asia/Shanghai）
- 发布数量：30 篇中文 + 30 篇英文
- 新增专题页：
  - `/articles/ai-suanming-search-qa.html`
  - `/articles/en/ai-fortune-telling-search-qa.html`
- 当天时间分布：`[4, 5, 5, 5, 5, 6]`
- 中英文配对：同一 slug 使用同一完整带时区发布时间

## 写前 5 查

1. 扫描 `articles/`、`articles/index.html`、`articles/en/index.html`、`feed.xml`、`articles/en/feed.xml`、`sitemap.xml`、`sitemap-articles.xml`、`sitemap-en.xml` 与专题历史记录，避开站内既有 AI 算命选题与当天 30 篇内部重复。
2. 核对当前产品事实：当前公开页与代码可确认基础排盘可先试；未登录 `3/天`、登录免费 `8/天`、会员 `80/天`；当前会员价 `19.90`；隐私联系邮箱 `842598522@qq.com`。
3. 每篇提纲都按真人问法收口，前两段直接回答问题，保留具体场景，不做搜索门页式近义词替换。
4. 全量避开“绝对最准”“保证命运”“客户心声”等不可证实或过度承诺表达，不写医疗/法律/金融替代建议。
5. 所有选题都能自然归入“AI算命搜索问答专题”，并能与站内现有紫微/排盘/隐私/产品页形成内链。

## 写后 5 查

1. 首轮生成后统一补写，所有中文正文控制到约 `600-900` 字区间内，清掉模板味和口号式开场。
2. 逐批核对标题、导语、例子与问题意图，确保当天 30 篇之间不重复，且不与站内既有 AI 文章同题。
3. 复核免费边界、会员价格、隐私口径、注册/保存/次数规则，拿不准的表达直接删或改写。
4. 去掉“包准”“永久免费”等越界词，避免虚构评价、客户证言、不可核实准确率与贬低同行。
5. 复核 title、description、canonical、OG、Article JSON-LD、hreflang、专题归属、索引卡片、feed、sitemap 与发布时间同步。

## 返工记录

- 返工 1：首轮长度校验失败，30 篇中文普遍偏短，逐篇补足到合规区间。
- 返工 2：禁用词校验命中“包准 / 保证结果 / 永久免费”相关表达，统一改写为边界说明口径。
- 返工 3：批量脚本运行时补齐 `readdirSync` 导入，完成落盘与 rebuild。
- 当前返工计数：3 轮

## 技术验证

- `node --check scripts/publish-local-article-batch.mjs`
- `node --check scripts/generate-en-articles.mjs`
- `node --check scripts/publish-ai-search-qa-batch.mjs`
- `node scripts/publish-ai-search-qa-batch.mjs`
- `node scripts/check-geo-local.js`
- 自定义批次校验通过：
  - 30 对中英文页均存在
  - 每页仅 1 个 H1，H2 数量在 3-5 之间
  - 全部 JSON-LD 可解析
  - 禁用词未出现在生成页
  - 中英文配对发布时间一致
  - 时间桶分布满足全天 6 个四小时区间且每区至少 4 篇
  - 新 URL 已进入专题页、中文首页、英文首页、feed 与 sitemap

## 发布清单

| 发布时间 | 中文标题 | 中文 URL | 英文 URL |
|---|---|---|---|
| 2026-07-25T00:11:00+08:00 | AI算命靠谱吗？先把“能不能用”和“该不该信”分开 | /articles/ai-suanming-kaopu-ma.html | /articles/en/ai-suanming-kaopu-ma.html |
| 2026-07-25T01:24:00+08:00 | 哪里有免费的算命平台？先分清基础免费和深度付费 | /articles/mianfei-suanming-pingtai-zainali.html | /articles/en/mianfei-suanming-pingtai-zainali.html |
| 2026-07-25T02:37:00+08:00 | 哪家AI算命平台准？先别急着认“最准” | /articles/na-jia-ai-suanming-pingtai-kaopu.html | /articles/en/na-jia-ai-suanming-pingtai-kaopu.html |
| 2026-07-25T03:46:00+08:00 | AI算命准不准怎么判断？先看它有没有讲依据 | /articles/ai-suanming-zhunbu-zhun-zenme-pan.html | /articles/en/ai-suanming-zhunbu-zhun-zenme-pan.html |
| 2026-07-25T04:08:00+08:00 | AI算命和真人算命差别在哪？重点不是谁更神 | /articles/ai-suanming-he-zhenren-chabie.html | /articles/en/ai-suanming-he-zhenren-chabie.html |
| 2026-07-25T05:19:00+08:00 | 第一次用AI算命先问什么？别一上来就问一生好坏 | /articles/diyici-yong-ai-suanming-xian-wen-shenme.html | /articles/en/diyici-yong-ai-suanming-xian-wen-shenme.html |
| 2026-07-25T06:44:00+08:00 | AI算命为什么总像模板？先看它会不会结合宫位和经历 | /articles/ai-suanming-weishenme-xiang-moban.html | /articles/en/ai-suanming-weishenme-xiang-moban.html |
| 2026-07-25T07:12:00+08:00 | 出生时间差十几分钟，AI算命会差很多吗？ | /articles/chusheng-shijian-cha-jifen-ai-suanming.html | /articles/en/chusheng-shijian-cha-jifen-ai-suanming.html |
| 2026-07-25T07:53:00+08:00 | 出生地和真太阳时重要吗？什么时候不能省 | /articles/chushengdi-he-zhen-taiyangshi-important.html | /articles/en/chushengdi-he-zhen-taiyangshi-important.html |
| 2026-07-25T08:05:00+08:00 | AI算命会泄露隐私吗？填资料前先看这几行 | /articles/ai-suanming-yinsi-anquan-ma.html | /articles/en/ai-suanming-yinsi-anquan-ma.html |
| 2026-07-25T09:28:00+08:00 | AI算命为什么有人说准、有人说不准？问题常出在提问方式 | /articles/weishenme-you-ren-shuo-ai-suanming-zhun.html | /articles/en/weishenme-you-ren-shuo-ai-suanming-zhun.html |
| 2026-07-25T10:17:00+08:00 | 付费前怎么验证AI算命值不值？先做这三步小测试 | /articles/fufeiqian-zenme-yan-zheng-ai-suanming.html | /articles/en/fufeiqian-zenme-yan-zheng-ai-suanming.html |
| 2026-07-25T11:41:00+08:00 | AI算命会员值不值开？先算你要的是次数还是深度 | /articles/ai-suanming-huiyuan-zhibuzhi.html | /articles/en/ai-suanming-huiyuan-zhibuzhi.html |
| 2026-07-25T11:58:00+08:00 | 免费试用能看到什么？阅天AI当前免费与会员边界怎么分 | /articles/mianfei-shiyong-neng-kan-dao-shenme.html | /articles/en/mianfei-shiyong-neng-kan-dao-shenme.html |
| 2026-07-25T12:09:00+08:00 | 手机上用AI算命方便吗？更要看保存和追问顺不顺 | /articles/shouji-shang-yong-ai-suanming-fangbian-ma.html | /articles/en/shouji-shang-yong-ai-suanming-fangbian-ma.html |
| 2026-07-25T13:22:00+08:00 | AI算命要不要注册？先分“先试用”和“要保存记录” | /articles/ai-suanming-yaobuyao-zhuce.html | /articles/en/ai-suanming-yaobuyao-zhuce.html |
| 2026-07-25T14:47:00+08:00 | AI算命记录能保存吗？换手机前先确认这两个点 | /articles/ai-suanming-jilu-neng-bu-neng-baocun.html | /articles/en/ai-suanming-jilu-neng-bu-neng-baocun.html |
| 2026-07-25T15:16:00+08:00 | AI算命适合看事业吗？什么时候该先看紫微，不是直接看结果 | /articles/ai-suanming-shihe-kan-shiye-ma.html | /articles/en/ai-suanming-shihe-kan-shiye-ma.html |
| 2026-07-25T15:54:00+08:00 | AI算命适合看感情吗？先看关系模式，再看时间窗口 | /articles/ai-suanming-shihe-kan-ganqing-ma.html | /articles/en/ai-suanming-shihe-kan-ganqing-ma.html |
| 2026-07-25T16:06:00+08:00 | AI算命能不能看今年运势？关键是先分底盘和流年 | /articles/ai-suanming-kan-jinnian-yunshi.html | /articles/en/ai-suanming-kan-jinnian-yunshi.html |
| 2026-07-25T17:35:00+08:00 | AI算命适合看财富吗？先分先天财、后天财和现金流 | /articles/ai-suanming-kan-caifu-zenmewen.html | /articles/en/ai-suanming-kan-caifu-zenmewen.html |
| 2026-07-25T18:14:00+08:00 | AI算命问健康准吗？能提醒结构，但不能替代检查 | /articles/ai-suanming-kan-jiankang-bianjie.html | /articles/en/ai-suanming-kan-jiankang-bianjie.html |
| 2026-07-25T19:27:00+08:00 | 紫微、八字、六爻分别适合问什么？别把三套问题混在一起 | /articles/ziwei-bazi-liuyao-shihe-wen-shenme.html | /articles/en/ziwei-bazi-liuyao-shihe-wen-shenme.html |
| 2026-07-25T19:51:00+08:00 | AI紫微排盘后先看哪里？命宫财官迁比一句结论更重要 | /articles/ai-ziwei-paipan-hou-xian-kan-shenme.html | /articles/en/ai-ziwei-paipan-hou-xian-kan-shenme.html |
| 2026-07-25T20:04:00+08:00 | AI算命怎么避免被营销话术带着走？先看有没有恐吓式付费 | /articles/ai-suanming-buyao-bei-yingxiao-dai-zou.html | /articles/en/ai-suanming-buyao-bei-yingxiao-dai-zou.html |
| 2026-07-25T20:57:00+08:00 | AI算命为什么不能承诺结论？它更像决策参考，不是替你决定 | /articles/ai-suanming-weishenme-buneng-baozheng-jieguo.html | /articles/en/ai-suanming-weishenme-buneng-baozheng-jieguo.html |
| 2026-07-25T21:18:00+08:00 | AI算命适合长期追踪吗？同一个盘为什么要分阶段问 | /articles/ai-suanming-shihe-changqi-zhuizong-ma.html | /articles/en/ai-suanming-shihe-changqi-zhuizong-ma.html |
| 2026-07-25T22:09:00+08:00 | AI算命报告怎么看是不是认真写的？先看有没有具体场景 | /articles/ai-suanming-baogao-kan-qilai-renzhenma.html | /articles/en/ai-suanming-baogao-kan-qilai-renzhenma.html |
| 2026-07-25T23:33:00+08:00 | AI算命能不能帮你做重大决定？先把它放在辅助位 | /articles/ai-suanming-neng-bang-mang-da-jue-ding-ma.html | /articles/en/ai-suanming-neng-bang-mang-da-jue-ding-ma.html |
| 2026-07-25T23:57:00+08:00 | AI算命平台为什么会收费？高质量分析到底成本在哪 | /articles/ai-suanming-pingtai-weishenme-shoufei.html | /articles/en/ai-suanming-pingtai-weishenme-shoufei.html |

## Git 与线上复查

- Git 提交号：`a44931d0d0748799ce6a70c66a8823dab9f7b91d`
- 推送后复查：
  - 本地 `HEAD` 与 `origin/master` 一致：已确认一致
  - 中文抽查 4 篇：`ai-suanming-kaopu-ma`、`ai-suanming-yinsi-anquan-ma`、`ai-suanming-shihe-kan-ganqing-ma`、`ai-suanming-pingtai-weishenme-shoufei`
  - 英文抽查 4 篇：`ai-suanming-kaopu-ma`、`ai-suanming-yinsi-anquan-ma`、`ai-suanming-shihe-kan-ganqing-ma`、`ai-suanming-pingtai-weishenme-shoufei`
  - 专题页 / 中英文首页 / 两个 feed / sitemap：`ai-suanming-search-qa.html`、`ai-fortune-telling-search-qa.html`、`/articles/`、`/articles/en/`、`/feed.xml`、`/articles/en/feed.xml`、`/sitemap.xml` 均返回 `200` 且命中新链接
