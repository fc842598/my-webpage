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
  <link rel="stylesheet" href="../css/articles.css?v=20260629-footer-legal-v1">
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
    about: ["紫微斗数", section, title],
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
      { "@type": "ListItem", position: 3, name: title, item: canonical }
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
          <nav class="breadcrumb" aria-label="面包屑"><a href="./">学习紫微</a><span>/</span><span>${escapeHtml(section)}</span></nav>
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
      </article>
      <aside class="side-panel detail-rail" aria-label="本文导航">
        <h2>继续阅读</h2>
        <a class="card-link" href="./">返回学习紫微</a>
        <a class="card-link" href="../pages/mingbook-onepage.html">打开免费排盘</a>
      </aside>
    </div>
  </main>
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
  <link rel="stylesheet" href="../../css/articles.css?v=20260629-footer-legal-v1">
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
    .filter((file) => file.endsWith(".html") && file !== "index.html")
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

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../js/site-analytics.js?v=20260618-ga4"></script>
  <title>学习紫微｜免费紫微斗数排盘后的入门指南 | 阅天AI</title>
  <meta name="description" content="从免费紫微斗数排盘后先看什么，到命例格局、单星星性、十二宫、大限流年和四化科权禄忌，整理适合排盘后继续阅读的紫微文章。">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${site}/articles/">
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">
  <link rel="alternate" type="application/rss+xml" title="阅天AI更新订阅" href="${site}/feed.xml">
  <link rel="alternate" type="application/ld+json" title="阅天AI品牌知识图谱" href="${site}/pages/brand-profile.jsonld">
  <link rel="alternate" type="application/xml" title="阅天AI品牌资料" href="${site}/brand-profile.xml">
  <meta property="og:title" content="学习紫微｜免费紫微斗数排盘后的入门指南">
  <meta property="og:description" content="紫微斗数排盘后的实用文章集合。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site}/articles/">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../css/articles.css?v=20260629-article-accordion-v1">
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "学习紫微", url: `${site}/articles/`, description: "紫微斗数学习文章集合。" }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "阅天AI紫微学习文章", itemListElement: itemList }, null, 2)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../index.html" aria-label="阅天首页"><img src="../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true" loading="eager" decoding="async"><span>阅天</span></a>
      <nav class="nav-links" aria-label="主导航"><a href="../index.html">首页</a><a href="./" aria-current="page">学习紫微</a><a href="en/">English</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="article-index-title">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h1 id="article-index-title">学习紫微：排盘后的文章索引</h1>
            <span class="section-desc">先看宫位，再看星曜、格局、四化和限年，文章会按主题持续更新。</span>
            <span class="section-toggle"><span>${articles.length} 篇</span></span>
          </summary>
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
  if (name.includes("特定")) return "把常见格局和具体组合拆开讲，重点看成格条件与现实用法。";
  if (name.includes("单星")) return "单独拆主星星性，先懂星，再放回宫位和组合里看。";
  if (name.includes("十二")) return "十二宫先定事情范围，再看星曜落点。";
  if (name.includes("看盘")) return "适合新手建立排盘后的阅读顺序。";
  return "围绕紫微斗数排盘后的实际问题继续阅读。";
}

function regenerateFeedsAndSitemaps() {
  const zhArticles = allChineseArticles();
  const enArticles = allEnglishArticles();
  writeFileSync(path.join(root, "feed.xml"), zhFeed(zhArticles), "utf8");
  writeFileSync(path.join(root, "articles", "en", "feed.xml"), enFeed(enArticles), "utf8");
  writeFileSync(path.join(root, "articles", "en", "index.html"), enIndex(enArticles), "utf8");
  writeFileSync(path.join(root, "sitemap.xml"), mainSitemap(zhArticles), "utf8");
  writeFileSync(path.join(root, "sitemap-en.xml"), enSitemap(enArticles), "utf8");
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
