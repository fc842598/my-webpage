# Ziwei chart style lab — design QA

- Source visual truth: `D:\xwechat_files\wxid_bimy2y4q0da022_5e15\temp\RWTemp\2026-08\d27a607894a826a281113327abc68693\5bbb78021780892d6f742a71f220d7b8.jpg`
- Implementation screenshot: `C:\Users\1\AppData\Local\Temp\ziwei-chart-style-lab-local.png`
- Combined comparison evidence: `C:\Users\1\AppData\Local\Temp\ziwei-chart-style-lab-compare-pass1.png`
- Viewport: 430 × 980 CSS px
- Source pixels: 1260 × 2800; implementation pixels: 415 × 1156
- Density normalization: source scaled to 415 px wide; implementation kept at its captured 415 px width; both padded to 415 × 1156 before horizontal comparison.
- State: default chart state, 命宫 selected, 先天卦 selected.

## Full-view comparison

The normalized side-by-side comparison shows the same core visual direction: warm paper background, thin ruled chart, 4 × 4 palace ring, large 2 × 2 center, bold major stars on the left, muted secondary stars on the right, restrained transformation colors, one pale active palace, and a light segmented reading module below the chart.

## Focused-region comparison

No separate focused crop is required for the passing review. At the normalized full-view width, the palace hierarchy, center facts, border weight, active palace, four transformation colors, age badge, and tab state remain readable enough to judge the dense chart UI without introducing a mismatched crop.

## Required fidelity surfaces

- Fonts and typography: Song-style display type is limited to chart titles and stems; UI copy uses the existing mobile system stack. Major stars and palace names are optically heavier than dates and helper stars, matching the reference hierarchy.
- Spacing and layout rhythm: the chart keeps the reference 4 × 4 ring and 2 × 2 center proportions, with more breathing room than the production chart and no overlapping labels at 430 px or 375 px.
- Colors and visual tokens: paper, ink, hairline borders, pale peach selection, and restrained 禄/权/科/忌 colors are consistent with the reference direction. No thick colored palace outlines remain.
- Image quality and asset fidelity: the reference chart contains no required photographic or branded image assets; the implementation is a text/data interface and therefore uses no replacement raster, SVG, emoji, or placeholder imagery.
- Copy and content: fixed realistic chart data is explicitly labeled as test data; the page states that no production logic is connected.

## Findings

- No actionable P0, P1, or P2 mismatches remain for this isolated visual-direction prototype.
- P3 follow-up: exact star density, center metadata order, and mobile font optical weight can be tuned after the user chooses this direction for the production chart.

## Interaction and runtime checks

- Palace selection updates the highlighted cell and summary text.
- 先天卦 / 后天卦 / 流年卦 tabs update title and explanatory copy.
- 375 px viewport has no horizontal overflow.
- Browser console: no warnings or errors.

## Comparison history

- Pass 1: no P0/P1/P2 issue found; no visual fix was required after the normalized comparison.

final result: passed
