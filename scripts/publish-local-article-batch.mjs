import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://yuetianai.com";
const defaultImage = `${site}/images/home2/triad-tian-bg.webp`;

const args = parseArgs(process.argv.slice(2));
const queuePath = args.queue;
const sourcePath = args.source;
const count = Number(args.count || 1);
const category = args.category || "紫微斗数";
const publishDate = args.date || todayShanghai();
const publishTime = args.time || "09:00";

const topicHubs = [
  {
    key: "learning",
    file: "ziwei-learning-path.html",
    name: "紫微斗数看盘入门路径",
    shortName: "看盘入门",
    desc: "从本宫定位、三方四正、宫位职能到四化流年，按读盘层次往下看。"
  },
  {
    key: "palaces",
    file: "ziwei-palaces.html",
    name: "紫微斗数十二宫位",
    shortName: "十二宫位",
    desc: "先判断问题落在哪一宫，再看星曜、四化和三方四正怎么配合。"
  },
  {
    key: "transformations",
    file: "ziwei-four-transformations.html",
    name: "紫微斗数四化科权禄忌",
    shortName: "四化科权禄忌",
    desc: "化科、化权、化禄、化忌都要看落宫：名声、责任、资源和卡点各不一样。"
  },
  {
    key: "main-stars",
    file: "ziwei-main-stars.html",
    name: "紫微斗数十四主星星性",
    shortName: "十四主星",
    desc: "先把主星的性格读清楚，再回到宫位、辅煞和现实问题里判断强弱。"
  },
  {
    key: "helper-malice",
    file: "ziwei-helper-malice-stars.html",
    name: "紫微斗数辅曜煞曜",
    shortName: "辅曜煞曜",
    desc: "辅曜不是单纯加分，煞曜也不是只扣分，重点是它们怎样改变主星的用法。"
  },
  {
    key: "case-patterns",
    file: "ziwei-case-patterns.html",
    name: "紫微斗数特定命例解读",
    shortName: "特定命例",
    desc: "遇到固定格局和断语时，先拆成格条件，再看现代生活里怎么落地。"
  },
  {
    key: "cycles",
    file: "ziwei-cycles.html",
    name: "紫微斗数大限流年",
    shortName: "大限流年",
    desc: "大限看这十年的背景，流年看今年哪里被触发，小限和对宫补细节。"
  },
  {
    key: "money-career",
    file: "ziwei-money-career.html",
    name: "紫微斗数财运事业",
    shortName: "财运事业",
    desc: "看钱和事业不能只盯财帛宫，还要合看官禄、迁移和命宫能不能接住。"
  }
];
const topicHubFiles = new Set(topicHubs.map((hub) => hub.file));

if (!queuePath || !sourcePath || !count) {
  fail("Usage: node scripts/publish-local-article-batch.mjs --queue <发布队列.md> --source <稿件.md> --count 20 --category <大类>");
}
if (!existsSync(queuePath)) fail(`Queue not found: ${queuePath}`);
if (!existsSync(sourcePath)) fail(`Source not found: ${sourcePath}`);

const queueRaw = readFileSync(queuePath, "utf8");
const sourceRaw = readFileSync(sourcePath, "utf8");
const rows = parseQueue(queueRaw).filter((row) => row.status.includes("待发布"));
const picked = rows.slice(0, count);
if (picked.length === 0) fail("No pending queue rows.");

const sourceArticles = parseSourceArticles(sourceRaw);
const bySlug = new Map(sourceArticles.filter((a) => a.slug).map((a) => [a.slug, a]));
const byOrder = new Map(sourceArticles.map((a) => [a.order, a]));
const articles = picked.map((row) => {
  const source = bySlug.get(row.slug) || byOrder.get(row.order);
  if (!source) fail(`Missing source article for ${row.order} ${row.slug}`);
  return {
    ...source,
    order: row.order,
    slug: row.slug,
    title: source.title || row.title,
    queueTitle: row.title,
    category: row.category || category
  };
});

mkdirSync(path.join(root, "articles"), { recursive: true });
mkdirSync(path.join(root, "articles", "en"), { recursive: true });

for (const [index, article] of articles.entries()) {
  const time = timePlusMinutes(publishTime, index * 3);
  const zhPath = path.join(root, "articles", `${article.slug}.html`);
  const enPath = path.join(root, "articles", "en", `${article.slug}.html`);
  if (existsSync(zhPath)) fail(`Article already exists: ${zhPath}`);
  if (existsSync(enPath)) fail(`English article already exists: ${enPath}`);
  writeFileSync(zhPath, chinesePage(article, time), "utf8");
  writeFileSync(enPath, englishPage(article, time), "utf8");
}

updateQueue(queuePath, queueRaw, articles);
regenerateChineseIndex();
regenerateFeedsAndSitemaps();

console.log(`Published ${articles.length} articles.`);
for (const article of articles) {
  console.log(`- ${article.slug}: ${article.title}`);
}

function parseArgs(parts) {
  const out = {};
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (part.startsWith("--")) {
      out[part.slice(2)] = parts[i + 1] && !parts[i + 1].startsWith("--") ? parts[++i] : true;
    }
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function todayShanghai() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function timePlusMinutes(hhmm, minutes) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const total = hh * 60 + mm + minutes;
  const h = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function parseQueue(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return {
        order: Number(cells[0]),
        orderText: cells[0].padStart(2, "0"),
        status: cells[1],
        slug: cells[2],
        title: cells[3],
        category: cells[4] || category
      };
    });
}

function parseSourceArticles(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const blocks = normalized.split(/\n---+\n/g);
  const articles = [];
  for (const block of blocks) {
    const heading = block.match(/^##\s*(\d+)\.\s*(.+)$/m);
    if (!heading) continue;
    const order = Number(heading[1]);
    const title = heading[2].trim();
    const slug = block.match(/slug[：:]\s*`([^`]+)`/)?.[1]?.trim() || "";
    let body = block.slice(heading.index + heading[0].length).trim();
    const draftIndex = body.indexOf("正文草稿：");
    if (draftIndex >= 0) body = body.slice(draftIndex + "正文草稿：".length).trim();
    body = body
      .split("\n")
      .filter((line) => !/^(slug|搜索意图|素材线索)[：:]/.test(line.trim()))
      .join("\n")
      .trim();
    articles.push({ order, title, slug, body });
  }
  return articles;
}

function textOnly(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionOf(article) {
  const first = article.body
    .split(/\n\s*\n/)
    .map((p) => textOnly(p))
    .find(Boolean) || article.title;
  return truncate(first, 86);
}

function subtitleOf(article) {
  return truncate(descriptionOf(article), 34);
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function articleText(article) {
  return `${article.category || article.section || ""} ${article.title || article.headline || ""} ${article.description || ""}`;
}

function topicByKey(key) {
  return topicHubs.find((hub) => hub.key === key) || topicHubs[0];
}

function topicHubFor(article) {
  const text = articleText(article);
  if (text.includes("单星星性")) return topicByKey("main-stars");
  if (text.includes("特定命例")) return topicByKey("case-patterns");
  if (/(左辅|右弼|文昌|文曲|天魁|天钺|禄存|天马|擎羊|陀罗|火星|铃星|地空|地劫|红鸾|天喜|三台|八座|天刑|天姚|孤辰|寡宿|天哭|天虚|咸池|解神|天巫|阴煞)/.test(text)) return topicByKey("helper-malice");
  if (/(紫微星|天机星|太阳星|武曲星|天同星|廉贞星|天府星|太阴星|天梁星|天相星|七杀星|破军星|贪狼星|巨门星|十四主星)/.test(text)) return topicByKey("main-stars");
  if (/(七杀临身|日照雷门|月朗天门|明珠出海|紫府坐垣|七杀朝斗|夹命|夹财|夹贵|火贪|格局|命例)/.test(text)) return topicByKey("case-patterns");
  if (/(大限|小限|流年)/.test(text)) return topicByKey("cycles");
  if (/(化科|化权|化禄|化忌|四化|科权禄忌)/.test(text)) return topicByKey("transformations");
  if (/(命宫|兄弟宫|夫妻宫|子女宫|财帛宫|疾厄宫|迁移宫|仆役宫|朋友宫|官禄宫|田宅宫|福德宫|父母宫|十二宫|宫性)/.test(text)) return topicByKey("palaces");
  if (/(财|钱|收入|事业|职位|官禄|赚钱|财运)/.test(text)) return topicByKey("money-career");
  return topicByKey("learning");
}

function articleMatchesHub(article, hub) {
  const text = articleText(article);
  if (hub.key === "learning") return /(排盘|入门|先看|三方四正|命宫空宫|宫有宫性|免费紫微|小限流年)/.test(text);
  if (hub.key === "palaces") return /(命宫|兄弟宫|夫妻宫|子女宫|财帛宫|疾厄宫|迁移宫|仆役宫|朋友宫|官禄宫|田宅宫|福德宫|父母宫|十二宫|宫性)/.test(text);
  if (hub.key === "transformations") return /(化科|化权|化禄|化忌|四化|科权禄忌|权禄)/.test(text);
  if (hub.key === "main-stars") return text.includes("单星星性") || /(紫微星|天机星|太阳星|武曲星|天同星|廉贞星|天府星|太阴星|天梁星|天相星|七杀星|破军星|贪狼星|巨门星|十四主星)/.test(text);
  if (hub.key === "helper-malice") return /(辅曜|煞曜|左辅|右弼|文昌|文曲|天魁|天钺|禄存|天马|擎羊|陀罗|火星|铃星|地空|地劫|红鸾|天喜|三台|八座|天刑|天姚|孤辰|寡宿|天哭|天虚|咸池|解神|天巫|阴煞)/.test(text);
  if (hub.key === "case-patterns") return text.includes("特定命例") || /(七杀临身|日照雷门|月朗天门|明珠出海|紫府坐垣|七杀朝斗|夹命|夹财|夹贵|禄马|火贪|格局|命例)/.test(text);
  if (hub.key === "cycles") return /(大限|小限|流年|十年)/.test(text);
  if (hub.key === "money-career") return /(财|钱|收入|事业|职位|官禄|财帛|迁移|赚钱|财运|老板|客户)/.test(text);
  return false;
}

function uniqueLinks(links) {
  const seen = new Set();
  return links.filter((link) => {
    if (!link.href || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function relatedLinksFor(article) {
  const hub = topicHubFor(article);
  const text = articleText(article);
  const links = [
    { href: hub.file, text: `${hub.shortName}专题` },
    { href: "ziwei-sanfang-sizheng.html", text: "先看三方四正" },
    { href: "ziwei-minggong.html", text: "回到命宫定位本人" }
  ];
  if (hub.key !== "palaces") links.push({ href: "ziwei-palaces.html", text: "十二宫位总览" });
  if (hub.key !== "main-stars") links.push({ href: "ziwei-main-stars.html", text: "十四主星星性" });
  if (hub.key !== "helper-malice") links.push({ href: "ziwei-helper-malice-stars.html", text: "辅曜煞曜怎么改局" });
  if (hub.key !== "transformations") links.push({ href: "ziwei-four-transformations.html", text: "四化科权禄忌" });
  if (/(财|钱|收入|财帛|官禄|事业|职位)/.test(text)) links.push({ href: "ziwei-money-career.html", text: "财运事业合看" });
  if (/(大限|小限|流年|十年)/.test(text)) links.push({ href: "ziwei-cycles.html", text: "大限流年顺序" });
  return uniqueLinks(links).slice(0, 6);
}

function relatedReadingHtml(article) {
  const links = relatedLinksFor(article).filter((link) => !link.href.startsWith("../")).slice(0, 4);
  return `<hr>
        <h2 id="related-reading">同主题阅读</h2>
        <p>${links.map((link) => `<a href="${link.href}">${escapeHtml(link.text)}</a>`).join(" · ")}</p>`;
}

function sideLinksHtml(article) {
  const links = relatedLinksFor(article).slice(0, 5);
  return links.map((link) => `        <a class="card-link" href="${link.href}">${escapeHtml(link.text)}</a>`).join("\n");
}

function bottomChartCtaHtml() {
  return `    <div class="container article-bottom-link">
      <span>读完这篇，回到自己的命盘上对照一遍，会比只看概念更清楚。</span>
      <a href="../pages/mingbook-onepage.html">快速排盘 →</a>
    </div>`;
}

function markdownBody(markdown) {
  const chunks = markdown.trim().split(/\n\s*\n/);
  let firstParagraph = true;
  return chunks.map((chunk, index) => {
    const heading = chunk.match(/^###\s+(.+)$/);
    if (heading) {
      return `<h2 id="section-${index + 1}">${escapeHtml(heading[1].trim())}</h2>`;
    }
    const lines = chunk.split("\n").filter(Boolean);
    if (lines.length === 1 && /^[-*]\s+/.test(lines[0])) {
      return `<ul><li>${inlineMarkdown(lines[0].replace(/^[-*]\s+/, ""))}</li></ul>`;
    }
    const text = inlineMarkdown(lines.join(" "));
    const klass = firstParagraph ? ' class="article-lead"' : "";
    firstParagraph = false;
    return `<p${klass}>${text}</p>`;
  }).join("\n        ");
}

function chinesePage(article, time) {
  const description = descriptionOf(article);
  const canonical = `${site}/articles/${article.slug}.html`;
  const enUrl = `${site}/articles/en/${article.slug}.html`;
  const title = article.title.replace(/^紫微斗数/, "紫微斗数");
  const pageTitle = `${title} | 学习紫微`;
  const section = article.category;
  const hub = topicHubFor(article);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="zh-CN" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: defaultImage,
    datePublished: publishDate,
    dateModified: publishDate,
    inLanguage: "zh-CN",
    articleSection: section,
    about: ["紫微斗数", section, hub.shortName, title],
    author: { "@type": "Organization", name: "阅天AI" },
    publisher: { "@type": "Organization", name: "阅天AI" },
    mainEntityOfPage: canonical
  }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "阅天AI", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "学习紫微", item: `${site}/articles/` },
      { "@type": "ListItem", position: 3, name: hub.shortName, item: `${site}/articles/${hub.file}` },
      { "@type": "ListItem", position: 4, name: title, item: canonical }
    ]
  }, null, 2)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="../pages/mingbook-onepage.html">快速排盘</a><a href="en/${article.slug}.html">English</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><a href="${hub.file}">${escapeHtml(hub.shortName)}</a></nav>
          <h1>${escapeHtml(title)}</h1>
          <p class="detail-subtitle">${escapeHtml(subtitleOf(article))}</p>
          <p class="article-meta"><span>${escapeHtml(section)}</span><span><time datetime="${publishDate}">${publishDate}</time></span></p>
        </div>
        <div class="article-orbit" aria-hidden="true"><span>紫微</span><i>命</i><i>兄</i><i>夫</i><i>子</i><i>财</i><i>疾</i><i>迁</i><i>友</i><i>官</i><i>田</i><i>福</i><i>父</i></div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        ${markdownBody(article.body)}
        ${relatedReadingHtml(article)}
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航">
        <h2>继续阅读</h2>
${sideLinksHtml(article)}
      </aside>
    </div>
${bottomChartCtaHtml()}
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026055337号-1</a>　<span>© 2026 阅天AI Copyright, All Rights Reserved. Powered By 阅天工作室</span>　</div></footer>
</body>
</html>
`;
}

function englishPage(article, time) {
  const zhTitle = article.title.replace(/^紫微斗数/, "").trim();
  const title = englishTitle(article);
  const description = `A plain-English guide to ${title.toLowerCase()}, with a practical reading order and simple examples for Zi Wei Dou Shu learners.`;
  const canonical = `${site}/articles/en/${article.slug}.html`;
  const zhUrl = `${site}/articles/${article.slug}.html`;
  const examples = [...article.body.matchAll(/例子[一二三四]：([^\n]+)/g)].slice(0, 3).map((m) => textOnly(m[1]));
  const exampleHtml = examples.length
    ? `<ul>${examples.map((item) => `<li>${escapeHtml(englishExample(item))}</li>`).join("")}</ul>`
    : `<p>Use the palace first, then read the opposite palace and the three supporting palaces before making a conclusion.</p>`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${escapeHtml(title)} | Zi Wei Dou Shu</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${canonical}">
  <link rel="alternate" hreflang="zh-CN" href="${zhUrl}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260701-article-cta-v1">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: defaultImage,
    datePublished: publishDate,
    dateModified: publishDate,
    inLanguage: "en",
    articleSection: "Zi Wei Dou Shu",
    about: ["Zi Wei Dou Shu", "Chinese astrology chart", title],
    author: { "@type": "Organization", name: "YuetianAI" },
    publisher: { "@type": "Organization", name: "YuetianAI" },
    mainEntityOfPage: canonical
  }, null, 2)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">English</a><a href="../${article.slug}.html">中文</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Guide</span></nav>
          <h1>${escapeHtml(title)}</h1>
          <p class="detail-subtitle">${escapeHtml(description)}</p>
          <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${publishDate}">${publishDate}</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${escapeHtml(title)} is best understood as a reading question, not as a fixed lucky-or-unlucky label.</p>
        <h2>What This Means</h2>
        <p>This Chinese article explains: ${escapeHtml(zhTitle)}. For English readers, the practical point is simple: start with the palace being asked about, then check whether the related palaces can support it in real life.</p>
        <h2>How To Read It</h2>
        <p>Do not judge one star or one palace alone. Look at the main palace, the opposite palace, the career and wealth structure, and whether the chart shows stable support or only pressure. A strong pattern needs a place to work; a weak pattern needs rules, limits, and practical correction.</p>
        <h2>Simple Examples</h2>
        ${exampleHtml}
        <h2>Practical Order</h2>
        <p>First define the question. Then read the palace, its opposite palace, the supporting palaces, and the ten-year or annual trigger. This keeps the reading useful for career, money, relationships, and real choices.</p>
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links">
        <h2>Read Next</h2>
        <a class="card-link" href="./">English article index</a>
        <a class="card-link" href="../${article.slug}.html">中文原文</a>
      </aside>
    </div>
  </main>
</body>
</html>
`;
}

function englishTitle(article) {
  const title = article.title
    .replace(/^紫微斗数/, "")
    .replace(/怎么看/g, "")
    .replace(/：/g, ": ")
    .trim();
  const keyMap = [
    ["财在官禄", "Wealth in the Career Palace"],
    ["财在迁移", "Wealth in the Travel Palace"],
    ["命宫空宫", "An Empty Life Palace"],
    ["科权禄在大限", "Fame, Authority, and Resources in a Ten-Year Cycle"],
    ["流年落财帛", "An Annual Cycle in the Wealth Palace"],
    ["流年落迁移", "An Annual Cycle in the Travel Palace"],
    ["小限流年", "Annual Triggers and the Opposite Palace"],
    ["十年大限", "Ten-Year Cycles and Annual Cycles"],
    ["化权", "Hua Quan"],
    ["化科", "Hua Ke"],
    ["化禄", "Hua Lu"],
    ["化忌", "Hua Ji"],
    ["太阳在财帛", "The Sun Star in the Wealth Palace"],
    ["太阴在财帛", "The Moon Star in the Wealth Palace"],
    ["贪狼流年", "Tan Lang in an Annual Cycle"],
    ["七杀破军流年", "Qi Sha and Po Jun in an Annual Cycle"],
    ["地空地劫流年", "Di Kong and Di Jie in an Annual Cycle"],
    ["火星铃星流年", "Mars and Bell Star in an Annual Cycle"],
    ["权禄相逢在财帛", "Authority and Resources Meeting in the Wealth Palace"],
    ["拿到命盘先画三方四正", "Start a Chart With the Triad and Opposite Palace"],
    ["七杀临身", "Qi Sha Meeting the Body Palace"],
    ["日照雷门", "The Sun Rising in the Eastern Gate"],
    ["月朗天门", "The Bright Moon at the Heavenly Gate"],
    ["明珠出海", "The Bright Pearl Emerging From the Sea"],
    ["紫府坐垣", "Zi Wei and Tian Fu Holding the Center"],
    ["七杀朝斗", "Qi Sha Facing the Central Stars"]
  ];
  const found = keyMap.find(([key]) => article.title.includes(key));
  return found ? found[1] : `How to Read ${title} in Zi Wei Dou Shu`;
}

function englishExample(chinese) {
  if (chinese.includes("官禄")) return "When the career palace is activated, read responsibility, role, and income together.";
  if (chinese.includes("财帛")) return "When the wealth palace is involved, check cash flow, income source, and whether money can be retained.";
  if (chinese.includes("迁移")) return "When the travel palace is involved, outside platforms, clients, or new environments matter more.";
  if (chinese.includes("化忌")) return "When Hua Ji appears, treat it as a bottleneck that needs rules and risk control.";
  if (chinese.includes("化权")) return "When Hua Quan appears, the opportunity usually comes with heavier responsibility.";
  if (chinese.includes("化科")) return "When Hua Ke appears, reputation, exams, skill, or public recognition becomes important.";
  return "Read the star through the palace and the real-life role it points to, rather than using a vague fixed prediction.";
}

function updateQueue(file, raw, published) {
  let next = raw;
  for (const article of published) {
    const url = `${site}/articles/${article.slug}.html`;
    const enUrl = `${site}/articles/en/${article.slug}.html`;
    const rowRe = new RegExp(`(\\|\\s*${String(article.order).padStart(2, "0")}\\s*\\|\\s*)待发布(\\s*\\|\\s*${escapeRegExp(article.slug)}\\s*\\|)`);
    next = next.replace(rowRe, `$1已发布 ${publishDate} ${url} / ${enUrl}$2`);
  }
  writeFileSync(file, next, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseArticleFile(file, relBase = "articles") {
  const html = readFileSync(file, "utf8");
  const rel = path.relative(path.join(root, relBase), file).replace(/\\/g, "/");
  const url = `${site}/${relBase}/${rel}`;
  const headline = pickJsonField(html, "headline") || pickTag(html, "h1") || pickTitle(html);
  const description = pickMeta(html, "description") || "";
  const section = pickJsonField(html, "articleSection") || "紫微斗数";
  const published = pickJsonField(html, "datePublished") || "2026-06-24";
  return { file, rel, url, headline, description, section, published };
}

function pickJsonField(html, field) {
  const match = html.match(new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`));
  return match?.[1] || "";
}

function pickMeta(html, name) {
  return html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"))?.[1] || "";
}

function pickTag(html, tag) {
  return html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
}

function pickTitle(html) {
  return pickTag(html, "title").replace(/\s*\|.*$/, "");
}

function allChineseArticles() {
  return readdirSync(path.join(root, "articles"))
    .filter((file) => file.endsWith(".html") && file !== "index.html" && !topicHubFiles.has(file))
    .map((file) => parseArticleFile(path.join(root, "articles", file)))
    .sort((a, b) => b.published.localeCompare(a.published) || a.headline.localeCompare(b.headline, "zh-CN"));
}

function allEnglishArticles() {
  const enDir = path.join(root, "articles", "en");
  if (!existsSync(enDir)) return [];
  return readdirSync(enDir)
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .map((file) => parseArticleFile(path.join(enDir, file), "articles/en"))
    .sort((a, b) => b.published.localeCompare(a.published) || a.headline.localeCompare(b.headline));
}

function regenerateChineseIndex() {
  const articles = allChineseArticles();
  const grouped = new Map();
  for (const article of articles) {
    if (!grouped.has(article.section)) grouped.set(article.section, []);
    grouped.get(article.section).push(article);
  }
  const itemList = articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: article.url,
    name: article.headline
  }));
  const groups = [...grouped.entries()].map(([name, items], groupIndex) => `
        <details class="article-group"${groupIndex === 0 ? " open" : ""}>
          <summary class="section-head">
            <h2>${escapeHtml(name)}</h2>
            <span class="section-desc">${escapeHtml(sectionDesc(name))}</span>
            <span class="section-toggle"><span>${items.length} 篇</span></span>
          </summary>
          <div class="article-list">
${items.map((article, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${escapeHtml(article.section)}</span><span><time datetime="${article.published}">${article.published}</time></span></div>
              <h3>${escapeHtml(article.headline)}</h3>
              <p>${escapeHtml(article.description)}</p>
              <a class="card-link" href="${article.rel}">阅读全文</a>
            </div>
          </article>`).join("\n")}
          </div>
        </details>`).join("\n");
  const hubCards = topicHubs.map((hub, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">学习路径</span><span>${articles.filter((article) => articleMatchesHub(article, hub)).length} 篇</span></div>
              <h3>${escapeHtml(hub.shortName)}</h3>
              <p>${escapeHtml(hub.desc)}</p>
              <a class="card-link" href="${hub.file}">进入${escapeHtml(hub.shortName)}</a>
            </div>
          </article>`).join("\n");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>紫微斗数排盘后怎么读？结构读盘顺序和文章索引 | 阅天AI</title>
  <meta name="description" content="紫微斗数排盘后，先建立命身主线，再合三方四正、十二宫、四化和流年落点。这里按结构读盘顺序整理文章，方便从格局、组合到现实应用逐层查。">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${site}/articles/">
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">
  <link rel="alternate" type="application/rss+xml" title="阅天AI更新订阅" href="${site}/feed.xml">
  <link rel="alternate" type="application/ld+json" title="阅天AI品牌知识图谱" href="${site}/pages/brand-profile.jsonld">
  <link rel="alternate" type="application/xml" title="阅天AI品牌资料" href="${site}/brand-profile.xml">
  <meta property="og:title" content="紫微斗数排盘后怎么读？结构读盘顺序和文章索引">
  <meta property="og:description" content="先定命身主线，再合三方四正、十二宫、四化和流年落点，把命盘放回具体问题里读。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site}/articles/">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260701-mobile-index-v1">
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "紫微斗数排盘后怎么读", url: `${site}/articles/`, description: "按结构读盘顺序整理的紫微斗数文章，帮助读者从命身主线、三方四正、宫位职能、四化和流年落点逐层读盘。" }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "紫微斗数结构读盘文章索引", itemListElement: itemList }, null, 2)}
  </script>
</head>
<body class="article-index-page">
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true" loading="eager" decoding="async"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./" aria-current="page">学习紫微</a><a href="en/">English</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="article-index-title">
      <div class="container">
        <section class="index-overview">
          <div>
            <span class="index-overview__eyebrow">结构读盘路径</span>
            <h1 id="article-index-title">紫微斗数排盘后，怎样建立读盘顺序？</h1>
            <p class="index-overview__desc">真正读盘，重点不是孤立评价单颗星曜，而是先定命身主线，再合三方四正看成局，接着把十二宫、四化和流年落点放回具体问题。这里按这个顺序整理文章，方便你从格局、组合到现实应用逐层查。</p>
          </div>
          <div class="index-overview__stats" aria-label="紫微文章导航概览">
            <div class="index-overview__stat"><span>能查的文章</span><strong>${articles.length} 篇</strong></div>
            <div class="index-overview__stat"><span>分好的主题</span><strong>${topicHubs.length} 组</strong></div>
            <a class="index-overview__link" href="../pages/mingbook-onepage.html">去排盘边看边查</a>
          </div>
        </section>
        <details class="article-group" open>
          <summary class="section-head">
            <h2>不知道看哪篇？先按问题选</h2>
            <span class="section-desc">想看事业、财运、关系、流年，先选问题，再进对应专题慢慢查。</span>
            <span class="section-toggle"><span>${topicHubs.length} 类</span></span>
          </summary>
          <div class="article-list">
${hubCards}
          </div>
        </details>
${groups}
      </div>
    </section>
  </main>
</body>
</html>
`;
  writeFileSync(path.join(root, "articles", "index.html"), html, "utf8");
}

function sectionDesc(name) {
  if (name.includes("特定")) return "遇到固定格局和组合时，先看成格条件，再看现实里能不能用出来。";
  if (name.includes("单星")) return "想知道一颗主星到底怎么读，先看星性，再放回宫位和组合。";
  if (name.includes("十二")) return "先确定问题属于哪一宫，再看主星、四化和三方四正怎么配合。";
  if (name.includes("四化")) return "化科、化权、化禄、化忌不是吉凶标签，要看落在哪一宫、卡在哪里。";
  if (name.includes("流年")) return "想看今年容易动在哪件事，先看流年落宫，再看对宫和触发点。";
  if (name.includes("看盘")) return "从本宫定位、三方四正、宫位职能到四化流年，按读盘层次往下看。";
  return "第一次来可以先扫这里：排盘入口、基础概念、十二宫和常见问题都放在一起。";
}

function regenerateFeedsAndSitemaps() {
  const zhArticles = allChineseArticles();
  const enArticles = allEnglishArticles();
  regenerateTopicHubs(zhArticles);
  writeFileSync(path.join(root, "feed.xml"), zhFeed(zhArticles), "utf8");
  writeFileSync(path.join(root, "articles", "en", "feed.xml"), enFeed(enArticles), "utf8");
  writeFileSync(path.join(root, "articles", "en", "index.html"), enIndex(enArticles), "utf8");
  writeFileSync(path.join(root, "sitemap.xml"), mainSitemap(zhArticles), "utf8");
  writeFileSync(path.join(root, "sitemap-en.xml"), enSitemap(enArticles), "utf8");
}

function regenerateTopicHubs(articles) {
  for (const hub of topicHubs) {
    writeFileSync(path.join(root, "articles", hub.file), topicHubPage(hub, articles), "utf8");
  }
}

function topicHubPage(hub, articles) {
  const items = articles.filter((article) => articleMatchesHub(article, hub));
  const canonical = `${site}/articles/${hub.file}`;
  const itemList = items.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: article.url,
    name: article.headline
  }));
  const cards = items.length
    ? items.map((article, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">${escapeHtml(article.section)}</span><span><time datetime="${article.published}">${article.published}</time></span></div>
              <h3>${escapeHtml(article.headline)}</h3>
              <p>${escapeHtml(article.description)}</p>
              <a class="card-link" href="${article.rel}">阅读全文</a>
            </div>
          </article>`).join("\n")
    : `          <article class="article-card" data-index="01">
            <div class="card-body">
              <div class="card-meta"><span class="tag">专题建设中</span><span>${publishDate}</span></div>
              <h3>${escapeHtml(hub.shortName)}文章正在扩展</h3>
              <p>${escapeHtml(hub.desc)} 后续发布的新文章会自动进入这个专题。</p>
              <a class="card-link" href="./">先回文章首页</a>
            </div>
          </article>`;
  const pathLinks = topicPathLinks(hub).map((link) => `<a class="card-link" href="${link.href}">${escapeHtml(link.text)}</a>`).join("\n          ");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>${escapeHtml(hub.name)} | 学习紫微</title>
  <meta name="description" content="${escapeHtml(hub.desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="zh-CN" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <meta property="og:title" content="${escapeHtml(hub.name)}">
  <meta property="og:description" content="${escapeHtml(hub.desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260629-article-accordion-v1">
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: hub.name, url: canonical, description: hub.desc }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: hub.name, itemListElement: itemList }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "阅天AI", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "学习紫微", item: `${site}/articles/` },
      { "@type": "ListItem", position: 3, name: hub.shortName, item: canonical }
    ]
  }, null, 2)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true" loading="eager" decoding="async"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./">学习紫微</a><a href="en/">English</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="topic-title">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h1 id="topic-title">${escapeHtml(hub.name)}</h1>
            <span class="section-desc">${escapeHtml(hub.desc)}</span>
            <span class="section-toggle"><span>${items.length} 篇</span></span>
          </summary>
          <div class="article-list">
${cards}
          </div>
        </details>
        <details class="article-group" open>
          <summary class="section-head">
            <h2>相关路径</h2>
            <span class="section-desc">从本专题继续向上、向下阅读，避免单篇文章孤立理解。</span>
            <span class="section-toggle"><span>${topicPathLinks(hub).length} 个入口</span></span>
          </summary>
          <div class="article-list">
            <article class="article-card" data-index="01">
              <div class="card-body">
                <div class="card-meta"><span class="tag">内链路径</span><span>${publishDate}</span></div>
                <h3>继续建立完整看盘顺序</h3>
                <p>专题之间互相连接：先定宫位，再看主星、辅煞、四化和限年，最后回到具体命例验证。</p>
                ${pathLinks}
              </div>
            </article>
          </div>
        </details>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

function topicPathLinks(hub) {
  const links = [
    { href: "./", text: "返回文章首页" },
    { href: "ziwei-learning-path.html", text: "看盘入门路径" },
    { href: "ziwei-palaces.html", text: "十二宫位" },
    { href: "ziwei-main-stars.html", text: "十四主星" },
    { href: "ziwei-helper-malice-stars.html", text: "辅曜煞曜" },
    { href: "ziwei-four-transformations.html", text: "四化科权禄忌" },
    { href: "ziwei-case-patterns.html", text: "特定命例解读" },
    { href: "ziwei-cycles.html", text: "大限流年" },
    { href: "ziwei-money-career.html", text: "财运事业" }
  ];
  return uniqueLinks(links.filter((link) => link.href !== hub.file)).slice(0, 6);
}

function zhFeed(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>阅天AI更新</title>
    <link>${site}/</link>
    <description>阅天AI官方入口、免费紫微斗数排盘与AI命盘分析相关更新。</description>
    <language>zh-CN</language>
    <lastBuildDate>${rssDate(publishDate, publishTime)}</lastBuildDate>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${articles.slice(0, 80).map((article, index) => `
    <item>
      <title>${escapeHtml(article.headline)}</title>
      <link>${article.url}</link>
      <guid isPermaLink="true">${article.url}</guid>
      <pubDate>${rssDate(article.published, timePlusMinutes(publishTime, index))}</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`).join("")}
  </channel>
</rss>
`;
}

function enFeed(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>YuetianAI Zi Wei Articles</title>
    <link>${site}/articles/en/</link>
    <description>Plain-English Zi Wei Dou Shu articles and chart reading guides.</description>
    <language>en</language>
    <lastBuildDate>${rssDate(publishDate, publishTime)}</lastBuildDate>
    <atom:link href="${site}/articles/en/feed.xml" rel="self" type="application/rss+xml" />
${articles.slice(0, 80).map((article, index) => `
    <item>
      <title>${escapeHtml(article.headline)}</title>
      <link>${article.url}</link>
      <guid isPermaLink="true">${article.url}</guid>
      <pubDate>${rssDate(article.published, timePlusMinutes(publishTime, index))}</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`).join("")}
  </channel>
</rss>
`;
}

function rssDate(date, time) {
  const d = new Date(`${date}T${time}:00+08:00`);
  return d.toUTCString().replace("GMT", "+0000");
}

function existingSitemapUrls() {
  const file = path.join(root, "sitemap.xml");
  if (!existsSync(file)) return [];
  const raw = readFileSync(file, "utf8");
  return [...raw.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function mainSitemap(articles) {
  const urls = new Set(existingSitemapUrls());
  urls.add(`${site}/articles/`);
  urls.add(`${site}/feed.xml`);
  for (const hub of topicHubs) urls.add(`${site}/articles/${hub.file}`);
  for (const article of articles) urls.add(article.url);
  return sitemapXml([...urls], articles);
}

function enSitemap(articles) {
  const urls = [`${site}/articles/en/`, `${site}/articles/en/feed.xml`, ...articles.map((article) => article.url)];
  return sitemapXml(urls, articles);
}

function sitemapXml(urls, articles) {
  const byUrl = new Map(articles.map((article) => [article.url, article.published]));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${byUrl.get(url) || (url.includes("feed.xml") || url.endsWith("/articles/") || url.endsWith("/articles/en/") ? publishDate : "2026-06-24")}</lastmod>
    <changefreq>${url.includes("/articles/") || url.includes("feed.xml") ? "daily" : "weekly"}</changefreq>
    <priority>${url.endsWith("/articles/") || url.endsWith("/articles/en/") ? "0.8" : url.includes("/articles/") ? "0.7" : "0.6"}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function enIndex(articles) {
  const cards = articles.map((article, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${article.published}">${article.published}</time></span></div>
              <h3>${escapeHtml(article.headline)}</h3>
              <p>${escapeHtml(article.description)}</p>
              <a class="card-link" href="${article.rel}">Read article</a>
            </div>
          </article>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>Learn Zi Wei Dou Shu in English | YuetianAI</title>
  <meta name="description" content="Plain-English Zi Wei Dou Shu articles for readers who want practical chart reading guidance without heavy jargon.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${site}/articles/en/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">
  <link rel="alternate" type="application/rss+xml" title="YuetianAI Zi Wei Articles" href="${site}/articles/en/feed.xml">
  <meta property="og:title" content="Learn Zi Wei Dou Shu in English">
  <meta property="og:description" content="Plain-English Zi Wei Dou Shu articles and Chinese astrology chart reading guides.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site}/articles/en/">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260629-article-accordion-v1">
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="../">中文</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="en-article-index">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h1 id="en-article-index">Learn Zi Wei Dou Shu in English</h1>
            <span class="section-desc">Practical chart-reading guides written for English readers.</span>
            <span class="section-toggle"><span>${articles.length} Articles</span></span>
          </summary>
          <div class="article-list">
${cards}
          </div>
        </details>
      </div>
    </section>
  </main>
</body>
</html>
`;
}
