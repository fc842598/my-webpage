# AI算命搜索问答专题 2026-07-30 复核记录

## 批次概览

- 日期：2026-07-30
- 批次：第 6 天
- 发布规模：30 篇中文 + 30 篇英文自然改写
- 专题页：
  - 中文：https://yuetianai.com/articles/ai-suanming-search-qa.html
  - 英文：https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html
- 返工次数：1
  - 首轮发布校验时发现 `ai-suanming-xinyonghu-xianyan-jiushi-haishi-xianshi` 中文正文长度仅 514，补充每篇差异化场景段后重新执行整批校验与生成。
- 提交号：
  - 发布批次提交：`e89a2fd`
  - 复核记录补记：本文件后续补录提交

## 写前 5 查

1. 连续扫描 `articles/`、`articles/index.html`、`articles/en/index.html`、`feed.xml`、`articles/en/feed.xml`、`sitemap*.xml`、`docs/ai-search-qa-manifest.json`、`docs/ai-search-qa-topic-records.json`，避开旧文与本专题前 5 天题目，确保今日 30 个问题的搜索意图、开头场景、例子和落点不重复。
2. 交叉核实当前产品事实，以线上页面和代码为准：
   - 游客每日 `3` 次
   - 登录免费每日 `8` 次
   - 会员每日 `80` 次
   - 会员价 `¥19.90`
   - 隐私联系邮箱 `842598522@qq.com`
3. 逐题检查提纲是否像真人发问，要求前两段直接回答，不先绕概念；每篇至少准备 2-4 个不同场景或例子，避免“换关键词不换答案”。
4. 清除绝对化和风险表述，包括“永久免费”“绝对最准”“保证结果”“替代医疗/法律/金融判断”等，并删去无法证明的客户证言。
5. 审核选题归属与内链位置，确保都能自然归入 AI 算命搜索问答专题，并能回链专题页、文章首页和相关说明页。

## 写后 5 查

1. 对 30 篇中文逐段做朗读式检查，重写机器味和套话段；重点避开“在当今时代”“值得注意的是”等模板开头。
2. 检查标题、导语、例子、结尾顺序和 H2 结构，压掉空泛判断与广告腔，确保每篇先解决问题，再克制引导试用。
3. 再次与全站旧文、本专题历史文章和当天另外 29 篇逐条比对标题、开头、例子和意图，确认没有近义门页和同质回答。
4. 复核免费与付费边界、会员价格、隐私口径、客户心声用语；所有无法证明的评价性描述均改为“常见顾虑”“典型使用场景”等中性表达。
5. 终审每个中英文页的 `title`、`description`、`canonical`、`og:*`、`Article JSON-LD`、`hreflang`、发布时间、专题归属，以及索引、feed、sitemap 收录情况。

## 技术验证

- `node --check scripts/ai-search-qa-batch-2026-07-30-data.mjs`
- `node --check scripts/publish-ai-search-qa-batch.mjs`
- `node --check scripts/publish-local-article-batch.mjs`
- `node --check scripts/generate-en-articles.mjs`
- `node scripts/check-geo-local.js`
  - 结果：`Local GEO check passed.`
- `node scripts/publish-ai-search-qa-batch.mjs`
  - 结果：二次执行通过，重建专题页、索引、feed 与 sitemap。
- 自定义批次校验
  - `todaysCount: 30`
  - `timeBuckets: [5, 5, 5, 5, 5, 5]`
  - `problems: []`
- 抽检结果
  - 中文正文长度全部在 600-900 汉字目标带附近
  - 今日 30 篇中英文发布时间一一对应
  - 今日 30 篇开头无重复起句
  - JSON-LD、H1/H2、禁用词与标题重复检查均通过

## 当天 30 对页面

| # | 发布时间 | 中文标题 | 中文 URL | 英文 URL |
|---|---|---|---|---|
| 01 | 2026-07-30T00:07:00+08:00 | AI算命新用户先验旧事，还是先看眼前问题？先看你要筛掉什么风险 | https://yuetianai.com/articles/ai-suanming-xinyonghu-xianyan-jiushi-haishi-xianshi.html | https://yuetianai.com/articles/en/ai-suanming-xinyonghu-xianyan-jiushi-haishi-xianshi.html |
| 02 | 2026-07-30T00:41:00+08:00 | AI算命一上来把事业感情财运全展开靠谱吗？先看会不会先定主轴 | https://yuetianai.com/articles/ai-suanming-yishanglai-quanbu-zhankai-kaopu-ma.html | https://yuetianai.com/articles/en/ai-suanming-yishanglai-quanbu-zhankai-kaopu-ma.html |
| 03 | 2026-07-30T01:29:00+08:00 | AI算命建议给得太满、几乎没有取舍正常吗？先看有没有轻重缓急 | https://yuetianai.com/articles/ai-suanming-jianyi-geide-taiman-zenmekan.html | https://yuetianai.com/articles/en/ai-suanming-jianyi-geide-taiman-zenmekan.html |
| 04 | 2026-07-30T02:18:00+08:00 | AI算命总说“你最近能量乱”为什么没帮助？先看能不能落到盘和场景 | https://yuetianai.com/articles/ai-suanming-zuijin-nengliangluan-weishenme-meiyong.html | https://yuetianai.com/articles/en/ai-suanming-zuijin-nengliangluan-weishenme-meiyong.html |
| 05 | 2026-07-30T03:36:00+08:00 | AI算命想验真，要不要故意问一个自己知道答案的问题？先分验真和抬杠 | https://yuetianai.com/articles/ai-suanming-yizhidao-answeryizhidao-wenti.html | https://yuetianai.com/articles/en/ai-suanming-yizhidao-answeryizhidao-wenti.html |
| 06 | 2026-07-30T04:11:00+08:00 | AI算命游客3次和登录免费8次差在哪里？先看你缺的是次数还是记录 | https://yuetianai.com/articles/ai-suanming-youke-sanci-he-denglu-baci-chazai.html | https://yuetianai.com/articles/en/ai-suanming-youke-sanci-he-denglu-baci-chazai.html |
| 07 | 2026-07-30T04:58:00+08:00 | AI算命只想问一次，买会员还是单次深问更划算？先看是不是同题追踪 | https://yuetianai.com/articles/ai-suanming-zhiwenyici-huiyuan-haishi-danci-shenwen.html | https://yuetianai.com/articles/en/ai-suanming-zhiwenyici-huiyuan-haishi-danci-shenwen.html |
| 08 | 2026-07-30T05:22:00+08:00 | AI算命免费层只给基础解释正常吗？关键看有没有把验证入口留给你 | https://yuetianai.com/articles/ai-suanming-mianfeiceng-zhi-gei-jichu-jieshi-zhengchangma.html | https://yuetianai.com/articles/en/ai-suanming-mianfeiceng-zhi-gei-jichu-jieshi-zhengchangma.html |
| 09 | 2026-07-30T06:47:00+08:00 | AI算命先注册再付费，和先付费再补资料，哪个更稳？先看记录能不能承接 | https://yuetianai.com/articles/ai-suanming-xian-zhuce-zai-fufei-haishi-xian-fufei-zai-bu-ziliao.html | https://yuetianai.com/articles/en/ai-suanming-xian-zhuce-zai-fufei-haishi-xian-fufei-zai-bu-ziliao.html |
| 10 | 2026-07-30T07:39:00+08:00 | AI算命看到会员价不高就直接开，最容易亏在哪？先看你会不会回来复盘 | https://yuetianai.com/articles/ai-suanming-kanhuiyuanjia-bugao-zhijiekai-zuiyikui-zai-na.html | https://yuetianai.com/articles/en/ai-suanming-kanhuiyuanjia-bugao-zhijiekai-zuiyikui-zai-na.html |
| 11 | 2026-07-30T08:13:00+08:00 | AI算命只记得“凌晨前后出生”怎么办？先把两段时辰分开看 | https://yuetianai.com/articles/ai-suanming-zhi-jide-lingchen-qianhou-chusheng-zenmeban.html | https://yuetianai.com/articles/en/ai-suanming-zhi-jide-lingchen-qianhou-chusheng-zenmeban.html |
| 12 | 2026-07-30T08:56:00+08:00 | AI算命生日到底按阳历还是农历填？先别急着问结果，先把历法对齐 | https://yuetianai.com/articles/ai-suanming-yangli-haishi-nongli-tian-shengri.html | https://yuetianai.com/articles/en/ai-suanming-yangli-haishi-nongli-tian-shengri.html |
| 13 | 2026-07-30T09:24:00+08:00 | AI算命家里说的出生时间总在变，先信哪一个？先找能验证的大差点 | https://yuetianai.com/articles/ai-suanming-jiali-shuode-shijian-zongzai-bian-xian-xin-nage.html | https://yuetianai.com/articles/en/ai-suanming-jiali-shuode-shijian-zongzai-bian-xian-xin-nage.html |
| 14 | 2026-07-30T10:31:00+08:00 | AI算命先把问题写很长会更好吗？重点不是字多，是条件收清 | https://yuetianai.com/articles/ai-suanming-wenti-xie-henchang-youyongma.html | https://yuetianai.com/articles/en/ai-suanming-wenti-xie-henchang-youyongma.html |
| 15 | 2026-07-30T11:44:00+08:00 | AI算命想问“什么时候会有结果”，为什么总被提醒先说是哪件事？因为时机得挂在事件上 | https://yuetianai.com/articles/ai-suanming-wen-shenme-shihou-you-jieguo-weishenme-xianwen-shinei.html | https://yuetianai.com/articles/en/ai-suanming-wen-shenme-shihou-you-jieguo-weishenme-xianwen-shinei.html |
| 16 | 2026-07-30T12:09:00+08:00 | AI算命用邮箱登录还是手机号登录更安心？先看找回和暴露面 | https://yuetianai.com/articles/ai-suanming-youxiangdenglu-haishi-shoujihao-genganxin.html | https://yuetianai.com/articles/en/ai-suanming-youxiangdenglu-haishi-shoujihao-genganxin.html |
| 17 | 2026-07-30T12:53:00+08:00 | AI算命退出登录后，本机还会留下什么？先看浏览器和账号层怎么切 | https://yuetianai.com/articles/ai-suanming-tuichudenglu-hou-benji-haihui-liushenme.html | https://yuetianai.com/articles/en/ai-suanming-tuichudenglu-hou-benji-haihui-liushenme.html |
| 18 | 2026-07-30T13:17:00+08:00 | AI算命把付款和排盘放在同一账号里危险吗？先看能不能分层管理 | https://yuetianai.com/articles/ai-suanming-fukuan-he-paipan-fang-zaitongyige-zhanghao-weixianma.html | https://yuetianai.com/articles/en/ai-suanming-fukuan-he-paipan-fang-zaitongyige-zhanghao-weixianma.html |
| 19 | 2026-07-30T14:28:00+08:00 | AI算命在共享手机上试一次，之后最该清什么？先看本机记录和自动填充 | https://yuetianai.com/articles/ai-suanming-gongxiang-shouji-shiyici-hou-zuigai-qingshenme.html | https://yuetianai.com/articles/en/ai-suanming-gongxiang-shouji-shiyici-hou-zuigai-qingshenme.html |
| 20 | 2026-07-30T15:35:00+08:00 | AI算命联系客服删资料前，自己要先准备什么？先把账号和页面信息记清 | https://yuetianai.com/articles/ai-suanming-zhaokefu-shanchu-ziliao-qian-xian-zhunbeishenme.html | https://yuetianai.com/articles/en/ai-suanming-zhaokefu-shanchu-ziliao-qian-xian-zhunbeishenme.html |
| 21 | 2026-07-30T16:06:00+08:00 | AI算命第一次用，要不要先把三个问题都列出来？先定顺序再开聊 | https://yuetianai.com/articles/ai-suanming-diyici-yong-yaobuyao-xian-lie-san-ge-wenti.html | https://yuetianai.com/articles/en/ai-suanming-diyici-yong-yaobuyao-xian-lie-san-ge-wenti.html |
| 22 | 2026-07-30T16:58:00+08:00 | AI算命追问时要不要贴上一次答案？先看你是补条件还是换主题 | https://yuetianai.com/articles/ai-suanming-zhuiwen-shi-yaobuyao-tie-shangci-daan.html | https://yuetianai.com/articles/en/ai-suanming-zhuiwen-shi-yaobuyao-tie-shangci-daan.html |
| 23 | 2026-07-30T17:21:00+08:00 | AI算命今天没问完，明天继续前要不要先看旧记录？先把主线接上 | https://yuetianai.com/articles/ai-suanming-jintian-meiwenwan-mingtian-xiankan-jiulu.html | https://yuetianai.com/articles/en/ai-suanming-jintian-meiwenwan-mingtian-xiankan-jiulu.html |
| 24 | 2026-07-30T18:34:00+08:00 | AI算命适合先在电脑上排盘，再去手机追问吗？先分输入和回看场景 | https://yuetianai.com/articles/ai-suanming-diannao-paipan-shouji-zhuiwen-shihema.html | https://yuetianai.com/articles/en/ai-suanming-diannao-paipan-shouji-zhuiwen-shihema.html |
| 25 | 2026-07-30T19:49:00+08:00 | AI算命越聊越散怎么办？先把一个主题问到能验证再切下一个 | https://yuetianai.com/articles/ai-suanming-yueliao-yuesan-zenmeban.html | https://yuetianai.com/articles/en/ai-suanming-yueliao-yuesan-zenmeban.html |
| 26 | 2026-07-30T20:12:00+08:00 | AI算命问签合同这一次要不要定下来，先用六爻还是紫微？先分单件事和长期结构 | https://yuetianai.com/articles/ai-suanming-qianhetong-zheci-yaobuyao-ding-xianyong-liuyao-haishi-ziwei.html | https://yuetianai.com/articles/en/ai-suanming-qianhetong-zheci-yaobuyao-ding-xianyong-liuyao-haishi-ziwei.html |
| 27 | 2026-07-30T20:57:00+08:00 | AI算命问这周要不要复联旧人，先看六爻还是紫微？先分关系底盘和眼前动作 | https://yuetianai.com/articles/ai-suanming-fu-lian-jiuren-zhezhou-yaobuyao-kou-xiankan-liuyao-haishi-ziwei.html | https://yuetianai.com/articles/en/ai-suanming-fu-lian-jiuren-zhezhou-yaobuyao-kou-xiankan-liuyao-haishi-ziwei.html |
| 28 | 2026-07-30T21:26:00+08:00 | AI算命问换城市读书或工作，先看紫微还是八字？先分平台位置和阶段强弱 | https://yuetianai.com/articles/ai-suanming-huanchengshi-dushu-gongzuo-xiankan-ziwei-haishi-bazi.html | https://yuetianai.com/articles/en/ai-suanming-huanchengshi-dushu-gongzuo-xiankan-ziwei-haishi-bazi.html |
| 29 | 2026-07-30T22:14:00+08:00 | AI算命问合作伙伴值不值得深绑，先看紫微还是八字？先分结构匹配和人身节奏 | https://yuetianai.com/articles/ai-suanming-hezuohuoban-zhibuzhi-shenbang-xiankan-ziwei-haishi-bazi.html | https://yuetianai.com/articles/en/ai-suanming-hezuohuoban-zhibuzhi-shenbang-xiankan-ziwei-haishi-bazi.html |
| 30 | 2026-07-30T23:43:00+08:00 | AI算命问考公面试这个月要不要冲，先看八字还是六爻？先分阶段状态和这一次窗口 | https://yuetianai.com/articles/ai-suanming-kaogong-mianshi-zhegeyue-yaobuyao-chong-xian-kan-bazi-haishi-liuyao.html | https://yuetianai.com/articles/en/ai-suanming-kaogong-mianshi-zhegeyue-yaobuyao-chong-xian-kan-bazi-haishi-liuyao.html |

## 推送后复查

- 本地 `HEAD` 与 `origin/master`：一致，均为 `e89a2fd`
- 线上抽查：
  - 中文 4 篇：
    - `https://yuetianai.com/articles/ai-suanming-xinyonghu-xianyan-jiushi-haishi-xianshi.html`
    - `https://yuetianai.com/articles/ai-suanming-youke-sanci-he-denglu-baci-chazai.html`
    - `https://yuetianai.com/articles/ai-suanming-youxiangdenglu-haishi-shoujihao-genganxin.html`
    - `https://yuetianai.com/articles/ai-suanming-qianhetong-zheci-yaobuyao-ding-xianyong-liuyao-haishi-ziwei.html`
    - 结果：4 篇均返回 `200`，slug、canonical 和发布时间与本地一致。
  - 英文 4 篇：
    - `https://yuetianai.com/articles/en/ai-suanming-xinyonghu-xianyan-jiushi-haishi-xianshi.html`
    - `https://yuetianai.com/articles/en/ai-suanming-youke-sanci-he-denglu-baci-chazai.html`
    - `https://yuetianai.com/articles/en/ai-suanming-youxiangdenglu-haishi-shoujihao-genganxin.html`
    - `https://yuetianai.com/articles/en/ai-suanming-qianhetong-zheci-yaobuyao-ding-xianyong-liuyao-haishi-ziwei.html`
    - 结果：4 篇均返回 `200`，slug、canonical 和发布时间与本地一致。
  - 中英文专题页：
    - 中文专题页返回 `200`，标题为“AI算命搜索问答专题：靠谱、免费、隐私与适用边界”，已收录今日新文章链接。
    - 英文专题页返回 `200`，标题为 `AI Fortune-Telling Q&A Hub`，已收录今日新文章链接。
  - 中英文首页：
    - `https://yuetianai.com/articles/index.html`
    - `https://yuetianai.com/articles/en/index.html`
    - 结果：均返回 `200`，已包含今日文章 slug。
  - `feed.xml`、`articles/en/feed.xml`：
    - 均返回 `200`
    - `lastBuildDate` 为 `Thu, 30 Jul 2026 15:43:00 +0000`
    - 顶部条目已更新为今日 `23:43 +08:00` 对应的中英文文章。
  - `sitemap.xml`、`sitemap-articles.xml`、`sitemap-en.xml`：
    - 均返回 `200`
    - `sitemap.xml` 已更新 `feed.xml` 的 `lastmod`
    - `sitemap-articles.xml` 与 `sitemap-en.xml` 已包含今日新 URL 与 `2026-07-30T23:43:00+08:00`
