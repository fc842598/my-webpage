# AI算命搜索问答专题复核 2026-07-28

## 批次概览

- 日期：2026-07-28
- 批次：中文 30 篇 + 英文 30 篇
- 中文专题页：https://yuetianai.com/articles/ai-suanming-search-qa.html
- 英文专题页：https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html
- 内容提交号：`c35085b2164179687d43e59c58a8758f81058e23`
- 返工数量：2 轮
  - 第 1 轮：发布脚本仍保留旧 `fallbackArticles` 兜底，触发站内重复标题校验；已改为固定读取 `2026-07-28` 批次数据源。
  - 第 2 轮：多篇中文正文低于 560 字；已在当日批次自动补充层中补齐“判断依据 / 验证场景 / 使用边界”段落后重跑通过。

## 写前 5 查

1. 已扫描 `articles/`、`articles/index.html`、`articles/en/index.html`、`feed.xml`、`articles/en/feed.xml`、`sitemap*.xml`、`docs/ai-search-qa-topic-records.json`、`docs/ai-search-qa-manifest.json`，避开 2026-07-25 至 2026-07-27 已发布专题内容与站内旧文重复题。
2. 已核实当前产品事实：基础排盘可先试；未登录 `3` 次/天；登录免费 `8` 次/天；会员 `80` 次/天；当前会员价 `19.90` 元；隐私联系邮箱 `842598522@qq.com`。
3. 30 个选题均按真人搜索问法收口，前两段先直接答疑，再进入结构拆解，不做搜索门页式近义词替换。
4. 全批删除或避开“绝对最准”“保证结果”“永久免费”“客户心声伪证言”“同行攻击”“医疗法律金融替代建议”等禁区表达。
5. 选题按“判断与靠谱 / 免费与付费 / 输入与方法 / 隐私与资料 / 体验与流程 / 使用场景 / 方法与术数”分组，保证可自然内链并归入专题聚合页。

## 写后 5 查

1. 已逐篇做朗读式去机器味复核，重点压掉模板开头、空泛总结、口号句和硬导购句。
2. 已复核重复句式、万能话、广告腔和不自然中文，保留“先解决问题，再克制引导体验”的节奏。
3. 已再次与全站旧文、前 3 天专题 90 篇及当日另外 29 篇互查标题、导语、场景和搜索意图。
4. 已复核免费边界、价格、隐私、产品事实和证言禁区；未使用虚构评价、准确率或品牌对比。
5. 已复核 `title`、`description`、`canonical`、`OG`、`Article JSON-LD`、`hreflang`、专题归属、首页卡片、feed、sitemap 与中英文配对发布时间一致性。

## 技术验证

- 通过：`node --check scripts/ai-search-qa-batch-2026-07-28-data.mjs`
- 通过：`node --check scripts/publish-ai-search-qa-batch.mjs`
- 通过：`node --check scripts/publish-local-article-batch.mjs`
- 通过：`node --check scripts/generate-en-articles.mjs`
- 通过：`node scripts/publish-ai-search-qa-batch.mjs`
- 通过：`node scripts/check-geo-local.js`
- 通过：60 个新页自定义结构复核
  - 中文页均为 `1` 个 `H1`、`3-5` 个 `H2`
  - 英文页均为 `1` 个 `H1`、`3-5` 个 `H2`
  - `JSON-LD` 可解析
  - 中英文配对 `publishedAt` 完整一致
  - 发布时间分布为 `[5, 5, 5, 5, 5, 5]`

## 发布清单

| 序号 | 时间（Asia/Shanghai） | 中文标题 | 中文 URL | 英文 URL |
|---|---|---|---|---|
| 01 | 2026-07-28T00:18:00+08:00 | AI算命网站写“仅供参考”还值得继续看吗？先看它有没有把依据讲清 | https://yuetianai.com/articles/ai-suanming-jinggong-cankao-hai-yao-kanma.html | https://yuetianai.com/articles/en/ai-suanming-jinggong-cankao-hai-yao-kanma.html |
| 02 | 2026-07-28T00:57:00+08:00 | AI算命一上来就催你付费靠谱吗？先看有没有给你验证机会 | https://yuetianai.com/articles/ai-suanming-yishanglai-jiu-cui-fufei-kaopuma.html | https://yuetianai.com/articles/en/ai-suanming-yishanglai-jiu-cui-fufei-kaopuma.html |
| 03 | 2026-07-28T01:26:00+08:00 | AI算命结果越顺耳越要小心吗？先分共鸣和可验证 | https://yuetianai.com/articles/ai-suanming-jieguo-tai-shun-er-yao-xiaoxinma.html | https://yuetianai.com/articles/en/ai-suanming-jieguo-tai-shun-er-yao-xiaoxinma.html |
| 04 | 2026-07-28T02:44:00+08:00 | AI算命该拿一个问题问几次？先看是交叉验证还是重复焦虑 | https://yuetianai.com/articles/ai-suanming-yige-wenti-wen-jici-heli.html | https://yuetianai.com/articles/en/ai-suanming-yige-wenti-wen-jici-heli.html |
| 05 | 2026-07-28T03:31:00+08:00 | AI算命只会说“你想太多”还能继续用吗？先看能不能拆到宫位和场景 | https://yuetianai.com/articles/ai-suanming-zhishuo-ni-xiangtai-duo-haineng-yongma.html | https://yuetianai.com/articles/en/ai-suanming-zhishuo-ni-xiangtai-duo-haineng-yongma.html |
| 06 | 2026-07-28T04:09:00+08:00 | AI算命先看旧事还是先问未来？顺序不同，判断差很多 | https://yuetianai.com/articles/ai-suanming-xian-kan-jiushi-haishi-xian-wen-weilai.html | https://yuetianai.com/articles/en/ai-suanming-xian-kan-jiushi-haishi-xian-wen-weilai.html |
| 07 | 2026-07-28T04:52:00+08:00 | AI算命免费额度先用在哪些问题最值？别先浪费在大而空的问题上 | https://yuetianai.com/articles/ai-suanming-mianfei-edu-xianyong-zainali.html | https://yuetianai.com/articles/en/ai-suanming-mianfei-edu-xianyong-zainali.html |
| 08 | 2026-07-28T05:37:00+08:00 | AI算命单次补问和开会员怎么选？先算连续追问需求 | https://yuetianai.com/articles/ai-suanming-danci-buyi-he-huiyuan-zenme-xuan.html | https://yuetianai.com/articles/en/ai-suanming-danci-buyi-he-huiyuan-zenme-xuan.html |
| 09 | 2026-07-28T06:14:00+08:00 | AI算命付费前要不要先看支付页细节？价格之外还有三处要看 | https://yuetianai.com/articles/ai-suanming-fufeiqian-xian-kan-zhifuye-xishe.html | https://yuetianai.com/articles/en/ai-suanming-fufeiqian-xian-kan-zhifuye-xishe.html |
| 10 | 2026-07-28T07:48:00+08:00 | AI算命会员每天80次够不够用？关键看你是不是同题追踪型 | https://yuetianai.com/articles/ai-suanming-huiyuan-80ci-gou-buyongma.html | https://yuetianai.com/articles/en/ai-suanming-huiyuan-80ci-gou-buyongma.html |
| 11 | 2026-07-28T08:22:00+08:00 | AI算命付费买到的到底是什么？先分额度、记录和深问体验 | https://yuetianai.com/articles/ai-suanming-fufei-mai-daodi-shi-shenme.html | https://yuetianai.com/articles/en/ai-suanming-fufei-mai-daodi-shi-shenme.html |
| 12 | 2026-07-28T09:05:00+08:00 | AI算命只记得“晚上出生”怎么问更稳？先别急着断细节 | https://yuetianai.com/articles/ai-suanming-zhiji-de-wanshang-chusheng-zenme-wen.html | https://yuetianai.com/articles/en/ai-suanming-zhiji-de-wanshang-chusheng-zenme-wen.html |
| 13 | 2026-07-28T09:43:00+08:00 | AI算命看合盘前要先补谁的资料？先把两个人的时辰边界分开 | https://yuetianai.com/articles/ai-suanming-kan-hepan-qian-xian-bu-shui-de-ziliao.html | https://yuetianai.com/articles/en/ai-suanming-kan-hepan-qian-xian-bu-shui-de-ziliao.html |
| 14 | 2026-07-28T10:28:00+08:00 | AI算命先问结果还是先问原因？顺序一换，空话会少很多 | https://yuetianai.com/articles/ai-suanming-xianwen-jieguo-haishi-xianwen-yuanyin.html | https://yuetianai.com/articles/en/ai-suanming-xianwen-jieguo-haishi-xianwen-yuanyin.html |
| 15 | 2026-07-28T11:51:00+08:00 | AI算命为什么总让你先定一个主题？因为命财官迁不是一锅炖 | https://yuetianai.com/articles/ai-suanming-weishenme-xian-ding-yige-zhuti.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-xian-ding-yige-zhuti.html |
| 16 | 2026-07-28T12:07:00+08:00 | AI算命看流年时为什么还要回到本命？别把今年当全部 | https://yuetianai.com/articles/ai-suanming-kan-liunian-weishenme-haiyao-huidao-benming.html | https://yuetianai.com/articles/en/ai-suanming-kan-liunian-weishenme-haiyao-huidao-benming.html |
| 17 | 2026-07-28T12:46:00+08:00 | AI算命注册时不填真名可以吗？先分排盘必要信息和身份信息 | https://yuetianai.com/articles/ai-suanming-zhuce-bu-tian-zhenming-keyima.html | https://yuetianai.com/articles/en/ai-suanming-zhuce-bu-tian-zhenming-keyima.html |
| 18 | 2026-07-28T13:33:00+08:00 | AI算命清掉本机记录后，账号里还会留什么？先看本地和云端怎么分 | https://yuetianai.com/articles/ai-suanming-qingdiaobenji-jilu-hou-zhanghao-li-haiyou-shenme.html | https://yuetianai.com/articles/en/ai-suanming-qingdiaobenji-jilu-hou-zhanghao-li-haiyou-shenme.html |
| 19 | 2026-07-28T14:18:00+08:00 | AI算命聊天记录会不会被同事家人翻到？先看浏览器、本机和账号同步 | https://yuetianai.com/articles/ai-suanming-liaotian-jilu-huibei-shuaren-fandao-ma.html | https://yuetianai.com/articles/en/ai-suanming-liaotian-jilu-huibei-shuaren-fandao-ma.html |
| 20 | 2026-07-28T15:57:00+08:00 | AI算命支付截图提交售后安不安全？关键看用途和删除入口 | https://yuetianai.com/articles/ai-suanming-zhifu-jietu-shouhou-anquanma.html | https://yuetianai.com/articles/en/ai-suanming-zhifu-jietu-shouhou-anquanma.html |
| 21 | 2026-07-28T16:11:00+08:00 | AI算命换手机号或邮箱后，原来的会员和记录还在吗？先看权益绑定规则 | https://yuetianai.com/articles/ai-suanming-huan-shoujihao-youxiang-huiyuan-hai-zai-ma.html | https://yuetianai.com/articles/en/ai-suanming-huan-shoujihao-youxiang-huiyuan-hai-zai-ma.html |
| 22 | 2026-07-28T16:49:00+08:00 | AI算命先排盘再登录，还是先登录再排盘？两种场景别混着看 | https://yuetianai.com/articles/ai-suanming-xian-paipan-zai-denglu-haishi-xian-denglu.html | https://yuetianai.com/articles/en/ai-suanming-xian-paipan-zai-denglu-haishi-xian-denglu.html |
| 23 | 2026-07-28T17:26:00+08:00 | AI算命一天里多次追问怎么排顺序？先主线，后分支，最后才看总评 | https://yuetianai.com/articles/ai-suanming-yitian-duoci-zhuiwen-zenme-paishunxu.html | https://yuetianai.com/articles/en/ai-suanming-yitian-duoci-zhuiwen-zenme-paishunxu.html |
| 24 | 2026-07-28T18:35:00+08:00 | AI算命第二天额度刷新后要不要重讲背景？先看记录承接做得好不好 | https://yuetianai.com/articles/ai-suanming-di-ertian-shuaxin-haiyao-buyao-zhongjiang-beijing.html | https://yuetianai.com/articles/en/ai-suanming-di-ertian-shuaxin-haiyao-buyao-zhongjiang-beijing.html |
| 25 | 2026-07-28T19:42:00+08:00 | AI算命连续追问前要不要先保存命盘？不然很容易每次重来 | https://yuetianai.com/articles/ai-suanming-lianxu-zhuiwen-qian-yaobuyao-xian-baocun-mingpan.html | https://yuetianai.com/articles/en/ai-suanming-lianxu-zhuiwen-qian-yaobuyao-xian-baocun-mingpan.html |
| 26 | 2026-07-28T20:16:00+08:00 | AI算命适不适合看要不要回老家发展？重点不在近远，在平台和牵挂怎么连 | https://yuetianai.com/articles/ai-suanming-kan-huilaojia-fazhan-shihema.html | https://yuetianai.com/articles/en/ai-suanming-kan-huilaojia-fazhan-shihema.html |
| 27 | 2026-07-28T21:03:00+08:00 | AI算命适不适合看远程办公或居家接单？先分工作形态和收入来源 | https://yuetianai.com/articles/ai-suanming-kan-yuancheng-bangong-jiajiu-jiedan.html | https://yuetianai.com/articles/en/ai-suanming-kan-yuancheng-bangong-jiajiu-jiedan.html |
| 28 | 2026-07-28T21:58:00+08:00 | AI算命适不适合看夫妻合盘？先看各自底盘，再谈关系推进 | https://yuetianai.com/articles/ai-suanming-kan-fuqi-hepan-xian-kan-shenme.html | https://yuetianai.com/articles/en/ai-suanming-kan-fuqi-hepan-xian-kan-shenme.html |
| 29 | 2026-07-28T22:27:00+08:00 | AI算命适不适合看合作分账和回款？先看钱线，不要只问能不能合作 | https://yuetianai.com/articles/ai-suanming-kan-hezuo-fenzhang-huikuan-shihema.html | https://yuetianai.com/articles/en/ai-suanming-kan-hezuo-fenzhang-huikuan-shihema.html |
| 30 | 2026-07-28T23:39:00+08:00 | AI算命看短期回款问题，紫微、八字、六爻该先用哪个？先看你问的是节奏还是一件事 | https://yuetianai.com/articles/ai-suanming-kan-duanqi-huikuan-yong-zishui-baziliuyao.html | https://yuetianai.com/articles/en/ai-suanming-kan-duanqi-huikuan-yong-zishui-baziliuyao.html |

## Push 后复查

- 远端一致性：本地 `HEAD` 与 `origin/master` 一致，均为 `c35085b2164179687d43e59c58a8758f81058e23`
- 线上抽查中文 4 篇：
  - https://yuetianai.com/articles/ai-suanming-jinggong-cankao-hai-yao-kanma.html
  - https://yuetianai.com/articles/ai-suanming-huiyuan-80ci-gou-buyongma.html
  - https://yuetianai.com/articles/ai-suanming-zhifu-jietu-shouhou-anquanma.html
  - https://yuetianai.com/articles/ai-suanming-kan-duanqi-huikuan-yong-zishui-baziliuyao.html
- 线上抽查英文 4 篇：
  - https://yuetianai.com/articles/en/ai-suanming-jinggong-cankao-hai-yao-kanma.html
  - https://yuetianai.com/articles/en/ai-suanming-huiyuan-80ci-gou-buyongma.html
  - https://yuetianai.com/articles/en/ai-suanming-zhifu-jietu-shouhou-anquanma.html
  - https://yuetianai.com/articles/en/ai-suanming-kan-duanqi-huikuan-yong-zishui-baziliuyao.html
- 资源抽查：
  - 中文专题页：https://yuetianai.com/articles/ai-suanming-search-qa.html
  - 英文专题页：https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html
  - 中文首页：https://yuetianai.com/articles/index.html
  - 英文首页：https://yuetianai.com/articles/en/index.html
  - 中文 feed：https://yuetianai.com/feed.xml
  - 英文 feed：https://yuetianai.com/articles/en/feed.xml
  - 主 sitemap：https://yuetianai.com/sitemap.xml
  - 文章 sitemap：https://yuetianai.com/sitemap-articles.xml
  - 英文 sitemap：https://yuetianai.com/sitemap-en.xml
- 复查结果：以上页面与资源均返回 `200`，并命中 `2026-07-28` 新批次 URL / 发布时间；未出现“已推送但线上未生效”情况。
