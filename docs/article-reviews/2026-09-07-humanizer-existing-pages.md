# Existing-page editorial cleanup: first release

This is an initial batch, not a claim that all articles have been manually reviewed.
The local inventory before this release contained 1,745 Chinese and 1,743 English
Article pages. Unindexed pages are not automatically deletion candidates.

## Decisions

- Rewrote `articles/ziwei-tiankui-zai-guanlugong.html` and its English counterpart.
  Removed generic filler, circular star combinations and automatic promotion claims.
- Rewrote `articles/ziwei-zuofu-zai-puyigong.html`. Assistance is no longer treated
  as a guarantee that all friends are loyal. The English counterpart was left alone
  because it has recorded search exposure and was not in the unindexed sample.
- Rewrote `articles/ziwei-qisha-zai-xiongdigong.html`. Distinguished the reader's
  sibling relationships from siblings' own entire lives, and natal from annual palaces.
  Its English counterpart's current index status was not established; it was retained.
- Deleted only the following two English pages after individual Search Console URL
  inspections on 2026-09-07 showed "Discovered - currently not indexed":
  `articles/en/ziwei-bankong-zhechi-xian-fang-diaosu-haishi-duanxian.html`
  and `articles/en/ziwei-bankong-zhechi-zhongduan-diaosu-huangui-xinqi.html`.
  Both reused substantial passages about cash flow and annual cycles without
  explaining the named pattern. Deletion was based on content redundancy AND the
  current unindexed status, not on their age or missing performance rows.
- Kept both Chinese counterparts' bodies and first-publication dates untouched;
  removed the obsolete English hreflang entries and linked the English navigation
  to the English article directory instead. Do not recreate the retired English pages.
- Protected `articles/ziwei-bankong-zhechi.html`, which had 18 search clicks and
  96 impressions in the three-month report. No automated synonym replacement was used.

## Evidence boundaries

Search Console URL-prefix property: `https://yuetianai.com/`.
The browser's indexing report, last updated 2026-09-04, showed 2,161 indexed and
506 unindexed site URLs, including non-article resources. These are NOT Chinese
article counts. All 336 examples in the discovered/unindexed category were English.
The crawled/unindexed report included the four rewritten pages.

The three-month performance report showed 123 clicks, 3,654 impressions, CTR 3.4%
and average position 13.1. Only the top 1,000 page rows were exposed in the table.
Absence from that table is NOT evidence of zero impressions. Browser access was
verified; the separate backend service account still lacked permission.

## Editorial work

Applied the local `humanizer-zh` skill: remove filler and sweeping claims, use
concrete hypothetical situations, vary explanations according to the actual question,
and allow past experience to contradict a chart interpretation. No invented customer
testimonials, no copied competitor passages, and no claim of scientific prediction.

Competitor reading, for topic comparison rather than reproduction:
- https://www.mingli.study/star/tiankui/guanlu-gong
- https://starnum.com.tw/blog/zh-CN/palace-jiaoyou-auxiliary-stars-pillar
- https://fatebook.net/k12.htm
- https://www.ziwei.info/detail/17739

Terminology cross-check: https://docs.iztro.com/learn/major-star
Competitor pages can contain errors; their assertions were not adopted wholesale.

## Reproduction and SEO

The authored source is `scripts/article-revisions-2026-09-07.mjs`.
Preview or apply this scoped revision, without regenerating legacy full-site indexes:

```powershell
node scripts/generate-en-articles.mjs --revision-file=scripts/article-revisions-2026-09-07.mjs
node scripts/generate-en-articles.mjs --revision-file=scripts/article-revisions-2026-09-07.mjs --apply
```

Existing URLs, canonical URLs, hreflang on retained bilingual pages and first
publication dates are preserved. Substantially rewritten pages have a visible
modification time and matching Article dateModified and sitemap lastmod:
2026-09-07T20:35:00+08:00. Relevant collection titles/descriptions were synchronized.
The rolling RSS feeds did not contain these older pages; they remain byte-equivalent
apart from platform line endings, with no old articles republished as new entries.
Six pre-existing broken local article links were repaired within the revised pages.

This release does not establish that changing an article cannot affect ranking.
Future batches must continue protecting indexed/performing pages, verify each
deletion candidate, and evaluate information value before choosing rewrite or removal.
