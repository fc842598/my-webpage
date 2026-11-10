# English Zi Wei terminology

Use these names consistently in new and revised English content. Explain the
meaning in ordinary English rather than alternating labels without context.

| Chinese term | Preferred English |
|---|---|
| 命宫 | Life Palace |
| 财帛宫 | Wealth Palace |
| 官禄宫 | Career Palace |
| 身宫 | Body Palace |
| 夫妻宫 | Spouse Palace |
| 迁移宫 | Migration Palace |
| 田宅宫 | Property Palace |
| 福德宫 | Inner Life Palace |
| 事业宫 | Career Palace (alias of 官禄宫) |
| 交友宫 / 仆役宫 | Friends Palace |
| 自化忌 | Zi Hua Ji; self-transformation into Hua Ji |

Do not use Self Palace as a substitute for Life Palace. Do not translate ordinary
phrases word-for-word: explain concern about appearances, asking for support,
or practical experience in context. Do not remove Chinese characters blindly;
a flag can be a properly explained quotation or a genuine untranslated fragment.

The mobile chart may omit "Palace" in compact grid labels, but must keep the same
domain name (Migration, Inner Life, Career, Wealth). Full names and aliases must
not fall through to single-character pinyin such as "Shi Palace" or "Palace".

Read-only backlog scan:

`node scripts/check-english-readable-text.mjs --scan`

Release check for a revised page (nonzero exit on unresolved Chinese or the
specific reviewed bad phrases):

`node scripts/check-english-readable-text.mjs articles/en/example.html`

On 2026-11-06, 4,046 English HTML files were scanned. After two reviewed page
revisions, 165 files still contain flags requiring individual review. This is
not a claim that every flag is a translation defect or that the site is cleared.

A subsequent fixed-scope revision corrected untranslated palace-domain summaries
on 35 existing pages. The same scan then flagged 130 files. Article bodies were
not fully rewritten in that batch; only complete palace names were standardized.

Nine older AI Q&A pages were then rewritten to remove untranslated questions and
keywords. The remaining scan count is 121 flagged files, still requiring review.

A further 25 reviewed paragraph corrections reduced the flagged count to 96.
This count does not certify the unflagged prose as fully edited English.

The next 22-page batch reduced the flagged count to 74. One Po Jun article also
contained incorrect transformation claims, corrected against the site engine.

Batch C corrected 23 further pages. The raw scan now flags 51 files. One known
candidate explains the Chinese name of the Career Palace for English readers;
that intentional explained term must not be deleted merely to reduce a count.

For revised articles, also check their collection cards against the Article
schema, not just deployment hashes:

`node scripts/check-english-collection-cards.mjs articles/en/example.html`

This catches stale or double-escaped summaries even when the article itself is
already corrected and the collection file matches what was deployed.

Eight foundation pages were then reviewed for naming, unrelated template cases,
and misleading literal claims. The raw Chinese-text scan now flags 43 files.

Ten people/work-related pages were then revised (eight bodies and two summaries).
The raw scan flags 33 files; metadata-only edits are not full prose approval.

Four relationship pages were then fully edited: reconciliation, Hua Quan and
boundaries, relationship distance, and rapid commitment. Use Spouse Palace,
Life Palace, Inner Life Palace, and Migration Palace consistently. Do not render
Hua Ji as "Jealousy" or Fu De Gong as "Karma" in these explanations. The raw
scan now flags 29 files, including intentional explained Chinese terminology.
