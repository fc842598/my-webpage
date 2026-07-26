# AI算命搜索问答专题复核 2026-07-26

## 批次概览

- 日期：2026-07-26
- 批次：中文 30 篇 + 英文 30 篇
- 专题页：
  - 中文：`https://yuetianai.com/articles/ai-suanming-search-qa.html`
  - 英文：`https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html`
- 返工数量：1 轮
  - 原因：初版批量稿有多篇正文长度低于 560 字阈值；统一补入“真人试法 + 边界提醒”段后复核通过。

## 写前 5 查

1. 已扫 `articles/`、中英文 index、feed、sitemap、专题旧记录，避免与 2026-07-25 首批 30 篇及站内既有问答专题撞题。
2. 已核实当前产品事实：基础排盘可先试；未登录 3 次/天；登录免费 8 次/天；会员 80 次/天；当前会员价 19.90 元；隐私联系邮箱 `842598522@qq.com`。
3. 全部题目都按真人搜索问题收口，前两段先直接回答，再进入结构拆解。
4. 全批删除了“绝对最准、保证结果、虚假评价、医疗法律金融替代建议”等禁区表述。
5. 30 个选题已按“判断与靠谱 / 免费与付费 / 输入与方法 / 隐私与资料 / 体验与流程 / 使用场景 / 方法与术数”分组，可自然内链回专题页。

## 写后 5 查

1. 已逐篇做朗读式去机器味检查，重点重写了过短、过像模板总结的段落。
2. 已复核重复句式、空泛段落、广告腔和不自然中文，保留“先答疑、后引导”的节奏。
3. 已再次与站内旧文、2026-07-25 专题批次、当日 29 篇互相查重，确保标题、导语、例子和意图不撞车。
4. 已复核免费边界、价格、隐私、客户证言禁区和克制营销口径，未使用虚构评价与同行比较。
5. 已复核 `title`、`description`、`canonical`、`OG`、`Article JSON-LD`、`hreflang`、专题归属、index/feed/sitemap 入口和中英文时间一致性。

## 技术验证

- 已通过：`node --check scripts/ai-search-qa-batch-2026-07-26-data.mjs`
- 已通过：`node --check scripts/publish-ai-search-qa-batch.mjs`
- 已通过：`node --check scripts/publish-local-article-batch.mjs`
- 已通过：`node --check scripts/generate-en-articles.mjs`
- 已通过：`node scripts/publish-ai-search-qa-batch.mjs`
- 已通过：`node scripts/check-geo-local.js`
- 已通过：60 个新页自定义结构复核
  - 中文每页 1 个 H1、4-8 个 H2、JSON-LD 可解析
  - 英文每页 1 个 H1、JSON-LD 可解析
  - 禁用词、重复开头、发布时间错位均未发现
  - 中英文配对页 `publishedAt` 完整一致
- 发布时间桶分布：`[4, 5, 5, 5, 5, 6]`

## 发布清单

| 序号 | 时间（Asia/Shanghai） | 中文标题 | 中文 URL | 英文 URL |
|---|---|---|---|---|
| 01 | 2026-07-26T00:07:00+08:00 | AI算命答得很具体就一定靠谱吗？先看它是不是能回到盘里 | https://yuetianai.com/articles/ai-suanming-juti-budengyu-kaopu.html | https://yuetianai.com/articles/en/ai-suanming-juti-budengyu-kaopu.html |
| 02 | 2026-07-26T01:39:00+08:00 | AI算命网站要先试什么？别先被首页文案说服 | https://yuetianai.com/articles/ai-suanming-wangzhan-xian-shi-shenme.html | https://yuetianai.com/articles/en/ai-suanming-wangzhan-xian-shi-shenme.html |
| 03 | 2026-07-26T02:21:00+08:00 | AI算命平台只给一句总评正常吗？先看它有没有拆主题 | https://yuetianai.com/articles/ai-suanming-zhigei-zongping-zhengchangma.html | https://yuetianai.com/articles/en/ai-suanming-zhigei-zongping-zhengchangma.html |
| 04 | 2026-07-26T03:52:00+08:00 | AI算命看得准是不是因为会顺着你说？先拿旧事反测 | https://yuetianai.com/articles/ai-suanming-shunzhe-ni-shuo-haishi-zhun.html | https://yuetianai.com/articles/en/ai-suanming-shunzhe-ni-shuo-haishi-zhun.html |
| 05 | 2026-07-26T04:14:00+08:00 | AI算命到底在读什么？先分排盘、问题和解释三层 | https://yuetianai.com/articles/ai-suanming-daodi-zai-du-shenme.html | https://yuetianai.com/articles/en/ai-suanming-daodi-zai-du-shenme.html |
| 06 | 2026-07-26T05:33:00+08:00 | AI算命平台为什么老强调“先输入完整资料”？因为盘错一步后面都在漂 | https://yuetianai.com/articles/ai-suanming-weishenme-yao-wanzheng-ziliao.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-yao-wanzheng-ziliao.html |
| 07 | 2026-07-26T06:05:00+08:00 | AI算命平台不让先排盘还能试吗？先看它把验证放在哪一步 | https://yuetianai.com/articles/ai-suanming-burang-xian-paipan-zenme-shi.html | https://yuetianai.com/articles/en/ai-suanming-burang-xian-paipan-zenme-shi.html |
| 08 | 2026-07-26T07:27:00+08:00 | AI算命会不会越问越贵？先看次数、会员和保存怎么分层 | https://yuetianai.com/articles/ai-suanming-huibu-hui-yuewen-yuegui.html | https://yuetianai.com/articles/en/ai-suanming-huibu-hui-yuewen-yuegui.html |
| 09 | 2026-07-26T07:49:00+08:00 | AI算命先开会员还是先试用？先算你有没有连续追问需求 | https://yuetianai.com/articles/ai-suanming-xian-kai-huiyuan-haishi-xianshi.html | https://yuetianai.com/articles/en/ai-suanming-xian-kai-huiyuan-haishi-xianshi.html |
| 10 | 2026-07-26T08:18:00+08:00 | AI算命会员买的是更准还是更顺？别把额度当成准确率 | https://yuetianai.com/articles/ai-suanming-huiyuan-mai-de-shi-zhun-haishi-shun.html | https://yuetianai.com/articles/en/ai-suanming-huiyuan-mai-de-shi-zhun-haishi-shun.html |
| 11 | 2026-07-26T09:41:00+08:00 | AI算命付费页要先核对什么？价格、次数、退款入口缺一不可 | https://yuetianai.com/articles/ai-suanming-fufeiye-xian-hedui-shenme.html | https://yuetianai.com/articles/en/ai-suanming-fufeiye-xian-hedui-shenme.html |
| 12 | 2026-07-26T10:06:00+08:00 | AI算命基础排盘和深度解读差在哪？别把两层服务看成一回事 | https://yuetianai.com/articles/ai-suanming-jichupaipan-heshendu-jiedu-chazai.html | https://yuetianai.com/articles/en/ai-suanming-jichupaipan-heshendu-jiedu-chazai.html |
| 13 | 2026-07-26T11:24:00+08:00 | AI算命为什么同一个问题换个问法差很多？多半是范围没收好 | https://yuetianai.com/articles/ai-suanming-huan-ge-wenfa-cha-hen-duo.html | https://yuetianai.com/articles/en/ai-suanming-huan-ge-wenfa-cha-hen-duo.html |
| 14 | 2026-07-26T11:57:00+08:00 | AI算命只填生日不填时辰可以吗？先分粗看和细看 | https://yuetianai.com/articles/ai-suanming-zhitian-shengri-butian-shichen.html | https://yuetianai.com/articles/en/ai-suanming-zhitian-shengri-butian-shichen.html |
| 15 | 2026-07-26T12:16:00+08:00 | AI算命凌晨出生怎么排更稳？子时前后别只凭印象 | https://yuetianai.com/articles/ai-suanming-zi-shi-qianhou-zenme-pai.html | https://yuetianai.com/articles/en/ai-suanming-zi-shi-qianhou-zenme-pai.html |
| 16 | 2026-07-26T13:34:00+08:00 | AI算命没填出生地会怎样？差别常出在边界盘 | https://yuetianai.com/articles/ai-suanming-meitian-chushengdi-huizenyang.html | https://yuetianai.com/articles/en/ai-suanming-meitian-chushengdi-huizenyang.html |
| 17 | 2026-07-26T14:09:00+08:00 | AI算命需要真太阳时校正吗？不是每次翻盘，但别直接跳过 | https://yuetianai.com/articles/ai-suanming-zhen-taiyangshi-yaobuyao-jiaozheng.html | https://yuetianai.com/articles/en/ai-suanming-zhen-taiyangshi-yaobuyao-jiaozheng.html |
| 18 | 2026-07-26T15:28:00+08:00 | AI算命为什么总先让你排基础盘？因为没盘就只剩模板话 | https://yuetianai.com/articles/ai-suanming-weishenme-xian-paijichupan.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-xian-paijichupan.html |
| 19 | 2026-07-26T15:44:00+08:00 | AI算命为什么会问你已发生的经历？那不是多余，是在校准问题 | https://yuetianai.com/articles/ai-suanming-weishenme-wen-yifa-sheng-jingli.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-wen-yifa-sheng-jingli.html |
| 20 | 2026-07-26T16:12:00+08:00 | AI算命没有隐私页还能填吗？先把联系方式找到再说 | https://yuetianai.com/articles/ai-suanming-meiyou-yinsiye-haineng-tianma.html | https://yuetianai.com/articles/en/ai-suanming-meiyou-yinsiye-haineng-tianma.html |
| 21 | 2026-07-26T17:31:00+08:00 | AI算命注册后会多拿到什么？先分保存记录和付款售后 | https://yuetianai.com/articles/ai-suanming-zhuce-hou-duo-shenme.html | https://yuetianai.com/articles/en/ai-suanming-zhuce-hou-duo-shenme.html |
| 22 | 2026-07-26T18:26:00+08:00 | AI算命换设备后记录还在吗？关键看账号和同步说明 | https://yuetianai.com/articles/ai-suanming-huan-shebei-jilu-hai-zai-ma.html | https://yuetianai.com/articles/en/ai-suanming-huan-shebei-jilu-hai-zai-ma.html |
| 23 | 2026-07-26T19:05:00+08:00 | AI算命手机和电脑哪个更适合第一次试？先看输入和回看 | https://yuetianai.com/articles/ai-suanming-shouji-haishi-diannao-genghao.html | https://yuetianai.com/articles/en/ai-suanming-shouji-haishi-diannao-genghao.html |
| 24 | 2026-07-26T19:58:00+08:00 | AI算命第一次试要不要直接登录？先看你只是体验还是要留记录 | https://yuetianai.com/articles/ai-suanming-diyici-yaobuyao-zhi-denglu.html | https://yuetianai.com/articles/en/ai-suanming-diyici-yaobuyao-zhi-denglu.html |
| 25 | 2026-07-26T20:22:00+08:00 | AI算命适不适合看跳槽？先分岗位变化和平台变化 | https://yuetianai.com/articles/ai-suanming-kan-tiaocao-shihe-ma.html | https://yuetianai.com/articles/en/ai-suanming-kan-tiaocao-shihe-ma.html |
| 26 | 2026-07-26T20:43:00+08:00 | AI算命适不适合看副业？先看正财、偏财和时间分配 | https://yuetianai.com/articles/ai-suanming-kan-fuye-shihe-ma.html | https://yuetianai.com/articles/en/ai-suanming-kan-fuye-shihe-ma.html |
| 27 | 2026-07-26T21:11:00+08:00 | AI算命能不能看异地发展？重点不在远近，在迁移能不能成事 | https://yuetianai.com/articles/ai-suanming-kan-yidi-fazhan.html | https://yuetianai.com/articles/en/ai-suanming-kan-yidi-fazhan.html |
| 28 | 2026-07-26T22:36:00+08:00 | AI算命适不适合看合伙？先把朋友宫和财务边界问清 | https://yuetianai.com/articles/ai-suanming-kan-hehuo-shihe-ma.html | https://yuetianai.com/articles/en/ai-suanming-kan-hehuo-shihe-ma.html |
| 29 | 2026-07-26T23:08:00+08:00 | AI算命想看什么时候发力，紫微和八字怎么分工 | https://yuetianai.com/articles/ai-suanming-ziwei-bazi-zenme-fengong.html | https://yuetianai.com/articles/en/ai-suanming-ziwei-bazi-zenme-fengong.html |
| 30 | 2026-07-26T23:47:00+08:00 | AI算命六爻能不能直接替代紫微排盘？先看你问的是一件事还是整条线 | https://yuetianai.com/articles/ai-suanming-liuyao-nengbuneng-tidai-ziwei.html | https://yuetianai.com/articles/en/ai-suanming-liuyao-nengbuneng-tidai-ziwei.html |

## 待 push 后补记

- 内容提交号：待本次 push 后回填到自动化记忆与回执
- 线上抽查：待本次 push 后执行
