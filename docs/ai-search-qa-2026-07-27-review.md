# AI算命搜索问答专题复核 2026-07-27

## 批次概览

- 日期：2026-07-27
- 批次：中文 30 篇 + 英文 30 篇
- 专题页：
  - 中文：`https://yuetianai.com/articles/ai-suanming-search-qa.html`
  - 英文：`https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html`
- 返工数量：1 轮
  - 原因：首轮发布校验命中禁用词 `永久免费`，已改写为“长期全免”后重跑通过。
- 命理口径吸收重点：
  - 命宫连看财帛、官禄、迁移，不单看一句总评。
  - 三方四正先定主线，再落回具体问题。
  - 先天财、后天财、流年与大限分开判断，不混成一句。

## 写前 5 查

1. 已扫 `articles/`、中英文 `index`、`feed.xml`、`articles/en/feed.xml`、`sitemap*.xml`、`docs/ai-search-qa-topic-records.json`、`docs/ai-search-qa-manifest.json`，避开 `2026-07-25` 与 `2026-07-26` 已发 60 篇专题问答及站内旧文撞题。
2. 已核实当前产品事实：基础排盘可先试；未登录 `3` 次/天；登录免费 `8` 次/天；会员 `80` 次/天；当前会员价 `19.90` 元；隐私联系邮箱 `842598522@qq.com`；隐私页公开“可清理本机记录 / 可联系删除账号资料 / 排盘信息用于真太阳时、大运流年、会员额度与连续解读”。
3. 全部题目都按真人搜索问题收口，前两段先直接回答，再进入结构拆解，避免“口号式开头”。
4. 全批删除了“绝对最准、保证结果、虚假评价、医疗法律金融替代建议、同行攻击”这类禁区表达。
5. 30 个选题已按“判断与靠谱 / 免费与付费 / 输入与方法 / 隐私与资料 / 体验与流程 / 使用场景 / 方法与术数”分组，可自然回链专题页与相关站内入口。

## 写后 5 查

1. 已逐篇做朗读式去机器味检查，重点压掉模板开头、空泛总结和硬导购句。
2. 已复核重复句式、空泛段落、广告腔和不自然中文，保留“先答疑、后引导体验”的节奏。
3. 已再次与全站旧文、前两天专题 60 篇、当日 29 篇互相查重，确保标题、导语、场景和问题意图不撞车。
4. 已复核免费边界、价格、隐私、客户证言禁区和克制营销口径，未使用虚构评价、准确率或同行对比。
5. 已复核 `title`、`description`、`canonical`、`OG`、`Article JSON-LD`、`hreflang`、专题归属、`articles/index.html`、`articles/en/index.html`、`feed.xml`、`articles/en/feed.xml`、`sitemap.xml`、`sitemap-articles.xml`、`sitemap-en.xml` 和中英文发布时间一致性。

## 技术验证

- 已通过：`node --check scripts/ai-search-qa-batch-2026-07-27-data.mjs`
- 已通过：`node --check scripts/publish-ai-search-qa-batch.mjs`
- 已通过：`node --check scripts/publish-local-article-batch.mjs`
- 已通过：`node --check scripts/generate-en-articles.mjs`
- 已通过：`node scripts/publish-ai-search-qa-batch.mjs`
- 已通过：`node scripts/check-geo-local.js`
- 已通过：60 个新页自定义结构复核
  - 中文每页 `1` 个 `H1`、`4-8` 个 `H2`
  - 英文每页 `1` 个 `H1`
  - `JSON-LD` 可解析
  - 禁用词、重复标题、重复导语、时间错位均未发现
  - 中英文配对页 `publishedAt` 完整一致
- 发布时间桶分布：`[5, 5, 5, 5, 5, 5]`

## 发布清单

| 序号 | 时间（Asia/Shanghai） | 中文标题 | 中文 URL | 英文 URL |
|---|---|---|---|---|
| 01 | 2026-07-27T00:18:00+08:00 | AI算命前后说法不一样正常吗？先查资料变了还是逻辑变了 | https://yuetianai.com/articles/ai-suanming-qianhou-buyi-zhengchangma.html | https://yuetianai.com/articles/en/ai-suanming-qianhou-buyi-zhengchangma.html |
| 02 | 2026-07-27T00:57:00+08:00 | AI算命为什么总让你把问题缩小？因为一口气问太多只会平均掉 | https://yuetianai.com/articles/ai-suanming-weishenme-yao-suoxiao-wenti.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-yao-suoxiao-wenti.html |
| 03 | 2026-07-27T01:26:00+08:00 | AI算命网站哪个靠谱该怎么比？先比公开规则，不比口号大小 | https://yuetianai.com/articles/ai-suanming-pingtai-zenme-duibi.html | https://yuetianai.com/articles/en/ai-suanming-pingtai-zenme-duibi.html |
| 04 | 2026-07-27T02:44:00+08:00 | AI算命看起来很懂你，为什么还是不敢用？关键在可验证性 | https://yuetianai.com/articles/ai-suanming-bugan-yong-de-guanjian.html | https://yuetianai.com/articles/en/ai-suanming-bugan-yong-de-guanjian.html |
| 05 | 2026-07-27T03:31:00+08:00 | AI算命能不能当第二意见？适合用来拆风险，不适合替你拍板 | https://yuetianai.com/articles/ai-suanming-dang-di-er-yijian.html | https://yuetianai.com/articles/en/ai-suanming-dang-di-er-yijian.html |
| 06 | 2026-07-27T04:09:00+08:00 | AI算命免费版为什么常只够试一轮？先分体验入口和连续追问 | https://yuetianai.com/articles/ai-suanming-mianfeiban-weishenme-bugou.html | https://yuetianai.com/articles/en/ai-suanming-mianfeiban-weishenme-bugou.html |
| 07 | 2026-07-27T04:52:00+08:00 | AI算命低价会员能不能先买一个月？先看你是不是高频回看型 | https://yuetianai.com/articles/ai-suanming-dijia-huiyuan-xian-mai-yige-yue.html | https://yuetianai.com/articles/en/ai-suanming-dijia-huiyuan-xian-mai-yige-yue.html |
| 08 | 2026-07-27T05:37:00+08:00 | AI算命付费后最该验收什么？别只看字数，先看追问有没有延续 | https://yuetianai.com/articles/ai-suanming-fufei-hou-yanshou-shenme.html | https://yuetianai.com/articles/en/ai-suanming-fufei-hou-yanshou-shenme.html |
| 09 | 2026-07-27T06:14:00+08:00 | AI算命付费前要不要先看退款和客服？小金额也要先把出口看清 | https://yuetianai.com/articles/ai-suanming-fufeiqian-kan-tuikuan-kefu.html | https://yuetianai.com/articles/en/ai-suanming-fufeiqian-kan-tuikuan-kefu.html |
| 10 | 2026-07-27T07:48:00+08:00 | AI算命为什么有的平台先免费、有的平台先收费？差别常在验证顺序 | https://yuetianai.com/articles/ai-suanming-youde-mianfei-youde-xianshoufei.html | https://yuetianai.com/articles/en/ai-suanming-youde-mianfei-youde-xianshoufei.html |
| 11 | 2026-07-27T08:22:00+08:00 | AI算命两次答案差很多，是出生资料错了还是问题没收住？ | https://yuetianai.com/articles/ai-suanming-liangci-daan-cha-hendu.html | https://yuetianai.com/articles/en/ai-suanming-liangci-daan-cha-hendu.html |
| 12 | 2026-07-27T09:05:00+08:00 | AI算命不知道准确出生时间怎么办？先缩范围，再测差异最大的点 | https://yuetianai.com/articles/ai-suanming-buzhidao-zhunqueshijian-zenmeban.html | https://yuetianai.com/articles/en/ai-suanming-buzhidao-zhunqueshijian-zenmeban.html |
| 13 | 2026-07-27T09:43:00+08:00 | AI算命家里只记得上午出生还能看吗？能先筛方向，别急着问细节 | https://yuetianai.com/articles/ai-suanming-zhiji-shangwu-chusheng.html | https://yuetianai.com/articles/en/ai-suanming-zhiji-shangwu-chusheng.html |
| 14 | 2026-07-27T10:28:00+08:00 | AI算命出生地填县城还是城市？关键不是行政级别，是落点别错 | https://yuetianai.com/articles/ai-suanming-chushengdi-xiancheng-haishi-chengshi.html | https://yuetianai.com/articles/en/ai-suanming-chushengdi-xiancheng-haishi-chengshi.html |
| 15 | 2026-07-27T11:51:00+08:00 | AI算命为什么总提醒你先看盘面再提问？因为问题要落到宫位上 | https://yuetianai.com/articles/ai-suanming-weishenme-xian-kan-pan-zai-tiwen.html | https://yuetianai.com/articles/en/ai-suanming-weishenme-xian-kan-pan-zai-tiwen.html |
| 16 | 2026-07-27T12:07:00+08:00 | AI算命问一句“我最近怎么样”为什么最没用？太宽的问题最容易出套话 | https://yuetianai.com/articles/ai-suanming-wozuijin-zenmeyang-weishenme-meiyong.html | https://yuetianai.com/articles/en/ai-suanming-wozuijin-zenmeyang-weishenme-meiyong.html |
| 17 | 2026-07-27T12:46:00+08:00 | AI算命一定要留手机号吗？先分登录便利和隐私成本 | https://yuetianai.com/articles/ai-suanming-yaobuyao-liu-shoujihao.html | https://yuetianai.com/articles/en/ai-suanming-yaobuyao-liu-shoujihao.html |
| 18 | 2026-07-27T13:33:00+08:00 | AI算命聊天记录会不会越积越多？先看能不能清理本机和联系删除 | https://yuetianai.com/articles/ai-suanming-jiluhui-bu-hui-yueji-yueduo.html | https://yuetianai.com/articles/en/ai-suanming-jiluhui-bu-hui-yueji-yueduo.html |
| 19 | 2026-07-27T14:18:00+08:00 | AI算命付款后留的资料多不多？先分支付信息、排盘信息和咨询内容 | https://yuetianai.com/articles/ai-suanming-fukuanhouliao-ziliaoduobuduo.html | https://yuetianai.com/articles/en/ai-suanming-fukuanhouliao-ziliaoduobuduo.html |
| 20 | 2026-07-27T15:57:00+08:00 | AI算命用公司电脑试安全吗？先看记录留在浏览器还是账号里 | https://yuetianai.com/articles/ai-suanming-yong-gongsi-diannao-shi-anquanma.html | https://yuetianai.com/articles/en/ai-suanming-yong-gongsi-diannao-shi-anquanma.html |
| 21 | 2026-07-27T16:11:00+08:00 | AI算命第一次试要不要先做一轮旧事验证？这样最容易筛模板 | https://yuetianai.com/articles/ai-suanming-diyici-jiushi-yanzheng.html | https://yuetianai.com/articles/en/ai-suanming-diyici-jiushi-yanzheng.html |
| 22 | 2026-07-27T16:49:00+08:00 | AI算命适合晚上慢慢看还是碎片时间问？看你是排盘还是追问 | https://yuetianai.com/articles/ai-suanming-wanshang-kan-haishi-suipianwen.html | https://yuetianai.com/articles/en/ai-suanming-wanshang-kan-haishi-suipianwen.html |
| 23 | 2026-07-27T17:26:00+08:00 | AI算命换浏览器后为什么像第一次来？先分本机记录和账号同步 | https://yuetianai.com/articles/ai-suanming-huan-liulanqi-xiang-xinlai.html | https://yuetianai.com/articles/en/ai-suanming-huan-liulanqi-xiang-xinlai.html |
| 24 | 2026-07-27T18:35:00+08:00 | AI算命连续问三天有意义吗？适合追踪变化，不适合反复问同一句 | https://yuetianai.com/articles/ai-suanming-lianwen-santian-youyiyi-ma.html | https://yuetianai.com/articles/en/ai-suanming-lianwen-santian-youyiyi-ma.html |
| 25 | 2026-07-27T19:42:00+08:00 | AI算命适不适合看复合？先分情绪回头和现实条件 | https://yuetianai.com/articles/ai-suanming-kan-fuhe-shihe-ma.html | https://yuetianai.com/articles/en/ai-suanming-kan-fuhe-shihe-ma.html |
| 26 | 2026-07-27T20:16:00+08:00 | AI算命适不适合看创业？先看现金流、责任位和平台资源 | https://yuetianai.com/articles/ai-suanming-kan-chuangye-shihe-ma.html | https://yuetianai.com/articles/en/ai-suanming-kan-chuangye-shihe-ma.html |
| 27 | 2026-07-27T21:03:00+08:00 | AI算命适不适合看买房时机？先分居住需求、现金压力和年份窗口 | https://yuetianai.com/articles/ai-suanming-kan-maifang-shiji.html | https://yuetianai.com/articles/en/ai-suanming-kan-maifang-shiji.html |
| 28 | 2026-07-27T21:58:00+08:00 | AI算命适不适合看考证考编？先看长期节奏，不要只盯一次上岸 | https://yuetianai.com/articles/ai-suanming-kan-kaozheng-kaobian.html | https://yuetianai.com/articles/en/ai-suanming-kan-kaozheng-kaobian.html |
| 29 | 2026-07-27T22:27:00+08:00 | AI算命适不适合看换赛道？先分能力迁移和平台重置 | https://yuetianai.com/articles/ai-suanming-kan-huansaidao.html | https://yuetianai.com/articles/en/ai-suanming-kan-huansaidao.html |
| 30 | 2026-07-27T23:39:00+08:00 | AI算命想问眼前这次合作，紫微、八字、六爻先用哪一个？ | https://yuetianai.com/articles/ai-suanming-hezuo-ziwei-bazi-liuyao.html | https://yuetianai.com/articles/en/ai-suanming-hezuo-ziwei-bazi-liuyao.html |

## Push 后复查

- 内容提交号：`da97be7f57f46caa27f34801c03739c3572528e0`
- 远端一致性：
  - 本地 `HEAD` 与 `origin/master` 已一致
- 线上抽查：
  - 中文抽查 `4` 篇：`ai-suanming-qianhou-buyi-zhengchangma`、`ai-suanming-mianfeiban-weishenme-bugou`、`ai-suanming-yaobuyao-liu-shoujihao`、`ai-suanming-hezuo-ziwei-bazi-liuyao`
  - 英文抽查 `4` 篇：与上面四篇配对英文页
  - 资源页：中文专题页、英文专题页、中英文文章首页、`feed.xml`、`articles/en/feed.xml`、`sitemap.xml`
  - 结果：全部返回 `200`，并命中 `2026-07-27` 新批次 URL/发布时间
- 复查说明：
  - 中文 HTML 响应头当前只返回 `text/html`，未显式带 `charset=utf-8`，直接按 `requests` 默认编码会误判中文关键字未命中。
  - 采用 UTF-8 原始字节解码后，中文专题页和中文新文均已确认同步到线上，不是推送未生效。
