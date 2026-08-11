# 阅天AI文章生产与发布机制

## 核心目标

文章首先服务真实读者，其次才是格式和自动化。系统保留 SEO、页面结构化数据和上线完整性检查，但不再用固定字数、固定提纲、证据卡、评分或模拟审稿记录代替编辑判断。

## 每日计划

- 每日可安排 `10-30` 篇中文文章，并同步自然英文改写。
- 计划层保留分时发布时间和队列总数检查。
- 发布层按单篇执行。当前文章通过技术检查即可上线，不重新验证整批文章。
- 一篇缺稿、需返工或技术失败，只暂停该篇，不影响另外的发布时间槽。

## 三种内容入口

1. 编辑原创：根据搜索问题、读者场景和专业判断直接写作。
2. 参考资料写作：同步文稿、历史文章和站点数据用于理解专业逻辑，不要求每篇绑定段落范围。
3. 外部成稿：用户、Codex、豆包或其他编辑直接提供的完整中英文文章，可直接进入单篇发布通道。

以上入口地位相同。`demandEvidence`、`evidence`、`points` 和 `examples` 可以作为工作笔记保留，但不是发布必填项。

## 编辑审查

`scripts/validate-daily-ziwei-seed.mjs` 只生成单篇建议报告：

- 标题与历史文章相似时，列出最近结果，提示人工判断搜索意图。
- 记录中文字符数、英文词数和章节数，供编辑了解，不设固定合格区间。
- 不要求固定开头段数、H2 数量、例子数量或“排盘使用顺序”结尾。
- 不要求同步文稿证据卡、实时数据锚点或最低评分。
- 只有无法发布的技术问题标记为 `needs-fix`，例如缺少标题、slug、正文、英文配对，或正文含禁用来源词。

建议报告不会因为相似度、篇幅或结构阻止发布。重复 slug 仍属于 URL 冲突，必须修正。

## 英文文章

- 英文版面向英语用户自然改写，不逐句硬翻。
- 术语先用自然英文解释，再保留必要的 `Zi Wei Dou Shu`、palace 和 transformation 名称。
- 不固定英文词数、H2 数量或例子数量。
- 保留英文 title、description、canonical、OG、Article JSON-LD、hreflang、英文 Feed 与 sitemap。

## 单篇上线硬检查

硬检查只覆盖会造成错误页面或 SEO 缺失的事项：

- 中文和英文页面都已生成，且各自只有一个 H1。
- canonical、OG、Article JSON-LD、hreflang 和完整带时区发布时间正确。
- 新 URL 已进入中英文索引、Feed、主 sitemap 和语言 sitemap。
- 正文不出现“文稿里”“讲义里”“他说”“天纪”“倪海厦”“source-extract”“证据卡”等来源追踪词。
- 页面可在桌面端和手机端正常阅读。
- 推送后 `HEAD` 与 `origin/master` 一致，线上页面实际返回成功。

## 自动化职责

- `scripts/generate-daily-ziwei-batch.mjs`：生成每日计划、源稿和建议报告，不要求 DOCX 或审稿 manifest。
- `scripts/validate-daily-article-queue.mjs`：检查 `10-30` 篇计划和发布时间，不承担内容放行。
- `scripts/release-daily-article-slot.mjs`：只读取当前 order，单篇发布、提交、推送和线上复查。
- `scripts/publish-local-article-batch.mjs`：从 queue/source 生成选中的一篇或多篇页面，不重新审查整批 seed。

## 数据反馈

Search Console、GA4 和站内表现数据用于发现读者问题、判断旧页需要升级还是值得扩展新角度。数据强弱不直接决定文章能否上线，也不要求每篇绑定实时数据。任何流量数字都必须来自真实报告，不能虚构。

## 常用命令

```powershell
npm run articles:review -- --seed scripts/daily-ziwei-YYYY-MM-DD-seed.mjs --date YYYY-MM-DD
npm run articles:review:test
npm run articles:batch-policy:test
node --check scripts/publish-local-article-batch.mjs
node --check scripts/release-daily-article-slot.mjs
node scripts/check-geo-local.js
```
