# 阅天AI文章自我升级系统

## 目标

每日发布30篇中文文章及自然英文改写版。每篇都必须独立、有用户需求且有源文支撑；不合格稿必须换题重写，不能少发、降标准，不能把产品帮助、近义标题或固定模板包装成SEO文章。

## 每日闭环

1. 数据复盘：运行 `npm run articles:performance`，读取最近30天 Search Console 与 GA4。高展现低点击页面优先升级旧文；已有真实阅读的主题可继续深挖，但不得复制搜索意图。
2. 用户选题：从事业、财富、婚恋、迁移、学习、合作、流年和读盘方法等真实场景拟题。每个候选必须写清 `userQuestion`、`userScenario`、`directAnswer`、`readerValue` 和 `demandEvidence`。从 2026-08-02 起，缺少可核验需求来源卡的文章直接失败。
3. 源文取证：只从指定DOCX抽取观点。每篇至少4个独立判断条件、2个组合或落宫例子、2组有效段落范围；每个观点和例子都必须单独绑定到一组具体证据范围，不能把全部源段合并后笼统过关。
4. 原创成稿：中文提供1-2段 `openingParagraphs`、3-5个独立 `sections` 和明确 `orderText`；英文在 `english` 中提供独立标题、description、正文结构、例子和阅读顺序。生成器不再补写中英文固定正文，只负责按已审核结构排版。
5. 质量闸门：运行 `npm run articles:quality-gate -- --seed ... --docx ... --date ... --expected-count 30`。任一文章失败，整批不得生成、发布或提交，必须换题重写直至30篇全部通过。
6. 写前五审：依次检查真实搜索需求、站内搜索意图区分、源文4观点、2个例子可验证性、主题配比。任何一项不成立就换题。
7. 成稿后五审：依次检查专业逻辑、真人读感、SEO搜索意图、英文自然改写、用户价值。每席逐篇绑定当前正文哈希；机器味、薄题或哈希不一致必须重写并重新五审，不能口头放行。
8. 发布与复查：队列校验、单篇释放器和底层发布器都必须使用当前质量规则重新读取指定DOCX并全量验证30篇，不能只信准备阶段的质量报告或五星哈希；通过后中英文配对使用同一分钟，同步索引、Feed、Sitemap、JSON-LD 与 hreflang，推送后抽查线上页面。
9. 次日学习：把本日质量报告、发布结果和30天数据反馈一起作为下一批选题输入。

分时释放前先同步 `origin/master`。本地只落后且远端改动不覆盖未提交文件时，允许 `--ff-only` 前进并重启当前时段以重新加载最新脚本、seed 和审稿清单；分支分叉或同文件冲突时必须保持工作区不动并停止，禁止自动 stash、reset、强推或覆盖用户改稿。

正式目录只能由 `scripts/release-daily-article-slot.mjs` 逐篇释放。底层发布器必须显式收到当天 `--date` 和实际 `--time`，一次只允许一对中英文页，未来分钟、跨日时间、超过2分钟的伪发布时间和 `--times` 整批写入全部拒绝。旧的 `scripts/publish-ai-search-qa-batch.mjs` 整批生产入口已经停用；时间闸门修改后必须运行 `npm run articles:publish-time-gate:test`。

## 双轮五席放行规则

- 自动评分只负责发现结构、篇幅、来源词、重复片段和明显查重问题，不能代替编辑审。
- 初稿通过自动门后，必须由紫微逻辑、中文真人读感、SEO搜索意图、英文自然度、用户价值五个独立评论席逐篇审查30篇；任何一席出现一篇 `FAIL`，整批不得生成发布队列。
- 返工后必须保留第一轮报告，并由五席重新全量复审30篇，不能只复查失败句。只有五份最终报告全部为 `30 PASS / 0 FAIL`，才允许生成源稿、队列和系统定时任务。
- 最终五份报告必须写入同一个 `Batch-Hash` 和 `Source-Hash`，逐篇保留 `Content-Hash` 与 `PASS` 行，并汇总到 `docs/article-reviews/YYYY-MM-DD-review-manifest.json`。任何中英文正文、标题、观点、例子、元数据或源稿结构改字，都会使哈希失效并阻断发布。
- `scripts/generate-daily-ziwei-batch.mjs`、`scripts/validate-daily-article-queue.mjs`、`scripts/release-daily-article-slot.mjs` 和 `scripts/publish-local-article-batch.mjs` 四个入口都必须验证五星清单，不能从底层脚本绕过。
- SEO审不只比较标题字面，还要比较用户问题、导语、答案路径和组合例子。与旧页同题时优先升级旧URL；每日名额必须换成真正不同的用户问题，禁止只换标题或行业场景。
- 英文审优先拦截 `outside platform`、`life lines`、`grammatical subject` 等中式抽象表达；英语正文必须先解释现实含义，再给紫微术语。
- 时间层统一口径：星曜与四化固定在本命宫位，流年命宫移动。不得写“流年化禄”“annual Hua Quan”“流年贪狼”等容易造成飞动误解的简写。

## 选题硬门槛

每个候选必须同时回答：

- 谁会主动搜索这个问题？
- 用户为什么此刻需要答案？
- 读完能获得什么具体判断或行动顺序？
- 为什么必须单独成篇，不能并入现有主文章？
- 大文档中的哪些段落能支持4个观点和2个例子？

登录、账号、浏览器记录、设备切换、会员次数、付款步骤、客服退款、连续追问次数等内容只属于帮助中心，不得进入文章生产流。

## Seed字段

每篇至少包含：

- `title`、`slug`、`category`、`intent`
- `userQuestion`、`userScenario`、`coreIntent`
- `directAnswer`、`readerValue`
- `demandEvidence`：包含 `sourceType`、`reference`、`query`、`audience`、`decisionTrigger`、`whySeparate`
- `evidence`：DOCX有效段落范围
- `supportPlan`：至少4项
- `points`：至少4项
- `examples`：至少2项
- `openingParagraphs`：1-2段
- `sections`：3-5节，每节包含独立标题与段落
- `orderText`：排盘使用顺序
- `english.title`、`english.description`
- `english.examples`：至少2个实际写入英文正文的现实例子
- `english.openingParagraphs`、`english.sections`、`english.orderText`：自然英文改写，不能逐句翻译中文

合格结构样例见 `scripts/fixtures/valid-daily-ziwei-seed.mjs`；单篇结构测试时质量门可显式传入 `--expected-count 1`，生成器还必须同时传入 `--test-mode true`。正式生产固定为30，禁止测试模式上线。

## 自动评分

`scripts/validate-daily-ziwei-seed.mjs` 会检查：

- 需求来源卡是否完整；`search-console` 必须命中当日真实搜索词，`site-performance` 必须命中当日真实文章表现，`editorial-gap` 不得冒充流量数据
- 当日有真实信号时，最低数据锚点数为 `min(8, 可核验信号数)`；只有达到扩展门槛的 `winners` 页面能支撑相邻新题，高展现低点击页与低样本观察页只能优化原页；同一搜索词、表现页面或编辑场景最多支撑2篇，30篇用户搜索问法不得重复
- 用户问题、现实场景、直接答案与独立成篇理由是否完整
- 低价值产品帮助题材
- 4个观点、2个例子与有效源段覆盖
- 每个观点和例子分别匹配最佳证据范围，字符二元组覆盖率均不得低于0.05
- 一篇文章的观点与例子必须共同使用至少2组不同证据范围，防止用一段材料支撑整篇再附加无关段落
- 观点和源段的紫微术语关联
- 超过48字的连续照抄风险
- 批内及站内标题搜索意图相似度
- 600-1100字正文、3-5个原创H2和排盘顺序
- 旧模板句、跨3篇出现的20字重复片段和禁用来源词
- 英文380-750词、3-5个独立H2、2个例子、英文标题查重
- 跨3篇出现的10词英文模板句、中文混排和来源追踪词

报告保存为 `docs/article-quality-YYYY-MM-DD.json`。只有全部文章通过且单篇评分不低于85分，生成器才允许写出源稿和发布队列。

质量报告的 `evidence.binding` 会保存每条观点、每个例子的最佳证据范围、覆盖率、实际使用范围数和当前阈值。修改这套规则后必须运行 `npm run articles:evidence-binding:test`，并对正式30篇重新生成质量报告、源稿和发布队列。

质量报告的 `demandEvidence` 会保存当日 performance report、可用真实信号数、最低锚点数和实际锚点数；每篇 `demand` 记录来源类型、核验状态和置信层级。修改需求门后必须运行 `npm run articles:demand-evidence:test`。数据不可用时可以使用诚实的 `editorial-gap`，但不得虚构点击、展现、排名或热度。

实际发布不能只验证静态报告。`scripts/validate-daily-article-queue.mjs`、`scripts/release-daily-article-slot.mjs` 和 `scripts/publish-local-article-batch.mjs` 会调用 `validateDailyArticleQualityAtRelease`，在队列检查和每个发布分钟重新执行当前版本的DOCX证据、需求来源、查重、篇幅、中英文结构与禁用词规则。准备阶段使用工作区检查正在编辑的内容；发布阶段只使用已提交 `HEAD` 的中英文文章索引做历史标题查重，避免无关未提交改稿阻断定时任务。临时报告只用于本次验证并自动清理；失败文章及首条原因直接写入任务日志。修改这条链路后必须运行 `npm run articles:release-quality-gate:test`。

五星审查清单使用 `npm run articles:review-gate -- --date YYYY-MM-DD --seed scripts/daily-ziwei-YYYY-MM-DD-seed.mjs --source docs/ziwei-daily-YYYY-MM-DD-source.md` 验证。修改清单规则后必须运行 `npm run articles:review-gate:test`；该测试固定确认种子改字、源稿偷改、评论席缺席、复用同一报告和报告缺行都会失败。

## 数据反馈规则

`scripts/collect-article-performance.mjs` 使用后台真实数据：

- 达到下方置信门槛的点击或稳定阅读：作为值得继续研究的主题信号，不复制原标题。
- 未达到动作门槛的数据：保持观察，不虚构热度，也不凭感觉修改旧页。
- 次日覆盖9个主要类别：财运事业、婚恋与关系、大限流年、宫位组合、四化细读、主星、辅煞曜、格局命例、看盘方法。每类至少2篇候选，单一类别最多8篇。

### 数据置信与动作分层

- 单个零散点击不构成选题方向。单页至少获得2次搜索点击或5次页面浏览，才可进入“值得深挖”候选；低展现下即使点击集中也只能算中等信号，深挖必须换成相邻但不同的搜索意图。
- 搜索展现少于20次时，不据此改标题或改内容；只有达到2次点击或5次页面浏览时，才允许把它当成中等强度的相邻选题信号。
- 展现达到20次、平均排名在前15且CTR低于对应排名基准的60%时，动作固定为升级原页标题、description和导语，不新增同义URL。
- 展现达到20次但平均排名在15名以后时，动作固定为加强原页答案、组合例子与内链，不先把问题归咎于标题。
- 中英文同slug页面归入同一个中文主题池，英文真实点击和阅读也参与次日主题判断；没有可靠对应关系的页面不强行归类。
- 次日配比使用带样本置信折扣的信号，低样本类别不能凭偶然高CTR抢走大量名额。配比只决定候选数量，不能绕过选题价值门、DOCX取证和五席审查。
- 修改数据闭环后必须运行 `npm run articles:performance:test`，固定验证深挖、摘要优化、排名优化、低样本观察和中英文归类五种路径。

### 跨日结构化意图历史

- 质量闸门会自动扫描 `scripts/` 和 `docs/` 中过去每日 seed，把 `userQuestion`、`coreIntent`、`directAnswer`、章节路径和组合例子组成结构化意图历史。
- 每篇必须同时与历史批次和本批其他文章比较用户问法、核心意图和答案路径。任一维度明显复制，或两个维度同时高度接近，直接判定失败，不能靠改标题和slug绕过。
- 质量报告为每篇保存 `intentReview.nearestHistory` 和 `nearestBatch`，五席SEO审必须先读最近邻，再判断搜索任务、答案路径和例子是否真正不同。
- 同slug升级旧文不作为新增重复页；不同slug若同意图，优先升级旧URL或换题。
- 修改意图历史规则后必须运行 `npm run articles:intent-history:test`，验证改标题克隆、复制问法、复制答案路径会失败，真正不同的搜索任务能通过。

远程读取需要本机环境变量 `YUETIAN_ADMIN_PASSWORD`；也可用 `--input` 读取后台导出的JSON。密码不得写入仓库、队列或质量报告。
