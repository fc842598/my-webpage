# AI算命搜索问答专题复核 2026-07-29

## 批次概览

- 日期：2026-07-29
- 批次：中文 30 篇 + 英文 30 篇
- 中文专题页：https://yuetianai.com/articles/ai-suanming-search-qa.html
- 英文专题页：https://yuetianai.com/articles/en/ai-fortune-telling-search-qa.html
- 内容提交号：`fddb0da83a7a576d6645d2d94149d0b3fa46236b`
- 返工数量：3 轮
  - 第 1 轮：首发被中文正文 560 字下限拦截，给短文补入更具体的验证场景、边界与判断顺序。
  - 第 2 轮：按真实发布 facts 复跑后，游客注册与免费排盘两篇仍偏短，再补免费/付费边界细节。
  - 第 3 轮：发布脚本的 `queuePath` 仍指向 `2026-07-28`，已改成 `2026-07-29`，并把误覆盖的昨日 queue 恢复回 Git 版本。

## 写前 5 查

1. 已扫描 `articles/`、`articles/index.html`、`articles/en/index.html`、`feed.xml`、`articles/en/feed.xml`、`sitemap*.xml`、`docs/ai-search-qa-topic-records.json`、`docs/ai-search-qa-manifest.json`，避开 2026-07-25 至 2026-07-28 已发专题与站内旧文的标题、导语、例子和搜索意图重复。
2. 已核实当前产品事实：基础排盘可先试；未登录 `3` 次/天；登录免费 `8` 次/天；会员 `80` 次/天；当前会员价 `19.90` 元；隐私联系邮箱 `842598522@qq.com`。
3. 30 个题目都按真人搜索问法落口，前两段先直接答疑，再进入结构拆解，避免做搜索门页式近义替换。
4. 全批移除或规避“绝对最准”“保证结果”“永久免费”“虚构客户心声”“同行攻击”“替代医疗/法律/金融建议”等风险表达。
5. 选题按“判断与靠谱 / 免费与付费 / 输入与方法 / 隐私与资料 / 体验与流程 / 使用场景 / 方法与术数”分组，可自然内链并归入独立专题聚合页。

## 写后 5 查

1. 逐篇做朗读式去机器味复核，压掉模板开头、空泛总结、口号句和硬导购句。
2. 复核重复句式、万能话、广告腔和不自然中文，保持“先解决问题，再克制引导体验”的节奏。
3. 再次与站内旧文、前 4 天专题及当日另外 29 篇互查标题、导语、场景和搜索意图。
4. 复核免费边界、价格、隐私、产品事实和证言禁区；未使用虚构评价、准确率或品牌对比。
5. 复核 `title`、`description`、`canonical`、`OG`、`Article JSON-LD`、`hreflang`、专题归属、首页卡片、feed、sitemap 与中英文配对发布时间一致性。

## 技术验证

- 通过：`node --check scripts/ai-search-qa-batch-2026-07-29-data.mjs`
- 通过：`node --check scripts/publish-ai-search-qa-batch.mjs`
- 通过：`node --check scripts/publish-local-article-batch.mjs`
- 通过：`node --check scripts/generate-en-articles.mjs`
- 通过：`node scripts/publish-ai-search-qa-batch.mjs`
- 通过：`node scripts/check-geo-local.js`
- 通过：批量结构复核
  - 当日文章数 `30`
  - 六个四小时区间分布 `[5, 5, 5, 5, 5, 5]`
  - 中英文页均为 `1` 个 `H1`
  - 中英文页均为 `3-5` 个 `H2`
  - `JSON-LD` 全部可解析
  - 中英文 `datePublished` 与 manifest 配对一致
  - 新 URL 已进入中英文首页、两份 feed、`sitemap-articles.xml`、`sitemap-en.xml`

## 发布清单

- 当日 30 个标题、中英文 URL、精确发布时间见：`docs/ai-search-qa-2026-07-29-queue.md`

## Push 后复查

- 本地 `HEAD` 与 `origin/master` 一致，均为 `fddb0da83a7a576d6645d2d94149d0b3fa46236b`
- 中文抽查 4 篇：  
  - https://yuetianai.com/articles/ai-suanming-zong-shi-liangbian-doudui-zenme-kan.html  
  - https://yuetianai.com/articles/ai-suanming-youke-yongwan-yaobuyao-zhuce.html  
  - https://yuetianai.com/articles/ai-suanming-denglu-hou-benji-yunduan-zenmefen.html  
  - https://yuetianai.com/articles/ai-suanming-ganqing-tuijin-yong-ziwei-haishi-liuyao.html
- 英文抽查 4 篇：  
  - https://yuetianai.com/articles/en/ai-suanming-zong-shi-liangbian-doudui-zenme-kan.html  
  - https://yuetianai.com/articles/en/ai-suanming-youke-yongwan-yaobuyao-zhuce.html  
  - https://yuetianai.com/articles/en/ai-suanming-denglu-hou-benji-yunduan-zenmefen.html  
  - https://yuetianai.com/articles/en/ai-suanming-ganqing-tuijin-yong-ziwei-haishi-liuyao.html
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
- 复查结果：上述页面均返回 `200`；8 篇中英文抽查页、专题页、中英文首页、两份 feed、文章 sitemap 与英文 sitemap 都命中当日新 slug；主 sitemap 返回 `200`，且 `feed.xml` 的 `lastmod` 已更新为 `2026-07-29T23:39:00+08:00`，未出现“已推送但线上未生效”。
