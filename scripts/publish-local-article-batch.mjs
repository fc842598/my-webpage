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
const explicitTimes = parseTimesArg(args.times);
const overwriteExisting = args["overwrite-existing"] === true;
const includePublished = args["include-published"] === true;
if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(publishTime)) {
  fail("--time must use HH:MM in Asia/Shanghai time.");
}
if (explicitTimes.length && explicitTimes.some((time) => !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))) {
  fail("--times must be a comma-separated list of HH:MM values in Asia/Shanghai time.");
}

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
const externalCollections = [
  {
    key: "ai-search-qa",
    zhFile: "ai-suanming-search-qa.html",
    enFile: "ai-fortune-telling-search-qa.html",
    zhName: "AI算命搜索问答专题",
    enName: "AI Fortune-Telling Q&A Hub",
    desc: "围绕靠谱不靠谱、免费边界、隐私、出生时间误差、手机体验与紫微/八字/六爻用途整理的搜索问答专题。"
  }
];
const specialChineseFiles = new Set([
  ...topicHubs.map((hub) => hub.file),
  ...externalCollections.map((item) => item.zhFile)
]);
const specialEnglishFiles = new Set(externalCollections.map((item) => item.enFile));

if (args.rebuild) {
  regenerateChineseIndex();
  regenerateFeedsAndSitemaps();
  console.log("Rebuilt article indexes, feeds, and sitemaps.");
  process.exit(0);
}

if (!queuePath || !sourcePath || !count) {
  fail("Usage: node scripts/publish-local-article-batch.mjs --queue <发布队列.md> --source <稿件.md> --count 20 --category <大类>");
}
if (!existsSync(queuePath)) fail(`Queue not found: ${queuePath}`);
if (!existsSync(sourcePath)) fail(`Source not found: ${sourcePath}`);

const queueRaw = readFileSync(queuePath, "utf8");
const sourceRaw = readFileSync(sourcePath, "utf8");
const rows = parseQueue(queueRaw).filter((row) => includePublished || !row.status.includes("http"));
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
if (explicitTimes.length && explicitTimes.length !== articles.length) {
  fail(`--times count ${explicitTimes.length} does not match article count ${articles.length}.`);
}
const scheduleTimes = explicitTimes.length
  ? explicitTimes
  : articles.map((_, index) => timePlusMinutes(publishTime, index * 3));

mkdirSync(path.join(root, "articles"), { recursive: true });
mkdirSync(path.join(root, "articles", "en"), { recursive: true });

for (const [index, article] of articles.entries()) {
  const time = scheduleTimes[index];
  article.publishedAt = toPublishDateTime(time);
  article.publishTime = time;
  const zhPath = path.join(root, "articles", `${article.slug}.html`);
  const enPath = path.join(root, "articles", "en", `${article.slug}.html`);
  if (existsSync(zhPath) && !overwriteExisting) fail(`Article already exists: ${zhPath}`);
  if (existsSync(enPath) && !overwriteExisting) fail(`English article already exists: ${enPath}`);
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

function parseTimesArg(value) {
  if (!value) return [];
  return String(value)
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function toPublishDateTime(time) {
  return `${publishDate}T${time}:00+08:00`;
}

function formatPublishedAt(value) {
  return value.includes("T") ? `${value.slice(0, 10)} ${value.slice(11, 16)}` : value;
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

function explicitHubKey(article) {
  const label = `${article.category || article.section || ""}`.trim();
  if (label.includes("看盘方法")) return "learning";
  if (label.includes("宫位组合") || label.includes("婚恋与关系")) return "palaces";
  if (label.includes("主星细读")) return "main-stars";
  if (label.includes("辅煞曜")) return "helper-malice";
  if (label.includes("特定命例")) return "case-patterns";
  if (label.includes("大限流年")) return "cycles";
  if (label.includes("财运事业")) return "money-career";
  return "";
}

function topicByKey(key) {
  return topicHubs.find((hub) => hub.key === key) || topicHubs[0];
}

function topicHubFor(article) {
  const mappedKey = explicitHubKey(article);
  if (mappedKey) return topicByKey(mappedKey);
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
  const mappedKey = explicitHubKey(article);
  if (mappedKey) return hub.key === mappedKey;
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
  let sectionIndex = 0;
  return chunks.map((chunk) => {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return "";
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map((line) => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    }

    const parts = [];
    let paragraphLines = [];
    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      const text = inlineMarkdown(paragraphLines.join(" "));
      const klass = firstParagraph ? ' class="article-lead"' : "";
      firstParagraph = false;
      parts.push(`<p${klass}>${text}</p>`);
      paragraphLines = [];
    };

    for (const line of lines) {
      const heading = line.match(/^###\s+(.+)$/);
      if (heading) {
        flushParagraph();
        sectionIndex += 1;
        parts.push(`<h2 id="section-${sectionIndex}">${escapeHtml(heading[1].trim())}</h2>`);
        continue;
      }
      paragraphLines.push(line);
    }
    flushParagraph();
    return parts.join("\n        ");
  }).join("\n        ");
}

function chinesePage(article, time) {
  const description = descriptionOf(article);
  const canonical = `${site}/articles/${article.slug}.html`;
  const enUrl = `${site}/articles/en/${article.slug}.html`;
  const publishedAt = article.publishedAt || toPublishDateTime(time);
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
    datePublished: publishedAt,
    dateModified: publishedAt,
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
          <p class="article-meta"><span>${escapeHtml(section)}</span><span><time datetime="${publishedAt}">${formatPublishedAt(publishedAt)}</time></span></p>
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
  const override = englishOverrideFor(article);
  const title = override?.title || englishTitle(article);
  const description = override?.description || `A plain-English guide to ${title}, with a practical reading order, simple examples, and clear boundaries for Zi Wei Dou Shu learners.`;
  const canonical = `${site}/articles/en/${article.slug}.html`;
  const zhUrl = `${site}/articles/${article.slug}.html`;
  const publishedAt = article.publishedAt || toPublishDateTime(time);
  const examples = [...article.body.matchAll(/例子[一二三四]：([^\n]+)/g)].slice(0, 4).map((m) => textOnly(m[1]));
  const exampleItems = uniqueEnglishExamples(article, examples);
  const exampleHtml = exampleItems.length
    ? `<ul>${exampleItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
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
    datePublished: publishedAt,
    dateModified: publishedAt,
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
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="./">English</a><a href="../${article.slug}.html">Chinese</a></nav>
    </div>
  </header>
  <main class="article-shell article-detail">
    <section class="detail-hero">
      <div class="container detail-hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Learn Zi Wei</a><span>/</span><span>Guide</span></nav>
          <h1>${escapeHtml(title)}</h1>
          <p class="detail-subtitle">${escapeHtml(description)}</p>
          <p class="article-meta"><span>Zi Wei Dou Shu</span><span><time datetime="${publishedAt}">${formatPublishedAt(publishedAt)}</time></span></p>
        </div>
      </div>
    </section>
    <div class="container article-layout article-detail-layout">
      <article id="article-start" class="article-main article-paper">
        <p class="article-lead">${escapeHtml(englishLead(article, title))}</p>
        <h2>What This Means</h2>
        <p>${escapeHtml(englishMeaning(article))}</p>
        <h2>How To Read It</h2>
        <p>${escapeHtml(englishMethod(article))}</p>
        <h2>Simple Examples</h2>
        ${exampleHtml}
        <h2>Practical Order</h2>
        <p>${escapeHtml(englishPracticalOrder(article, title))}</p>
      </article>
      <aside class="side-panel detail-rail" aria-label="Related links">
        <h2>Read Next</h2>
        <a class="card-link" href="./">English article index</a>
        <a class="card-link" href="../${article.slug}.html">Original Chinese article</a>
      </aside>
    </div>
  </main>
  <footer class="site-footer"><div class="container site-footer__legal"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">Yue ICP 2026055337-1</a>　<span>© 2026 YuetianAI. All Rights Reserved. Powered By Yuetian Studio</span>　</div></footer>
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
  const slugMap = {
    "ziwei-zi-gong-guiren-gujun": "Zi Wei in Zi: Noble Help Away From Home, but a Risk of Isolation",
    "ziwei-chou-gong-ziwei-pojun-yidi": "Zi Wei in Chou: Why This Pattern Often Works Better Away From Home",
    "ziwei-yin-gong-zifu-qisha-chaodou": "Zi Wei in Yin: Zi Fu Holding Center with Qi Sha Facing the Dipper",
    "ziwei-mao-gong-tianliang-wuguan": "Zi Wei in Mao: Tian Liang at Wu Can Bring Hard Authority, but Also Lifelong Strain",
    "ziwei-chen-gong-xiongsu-taohua": "Zi Wei in Chen: Xiong Su Chao Yuan Can Build Rank, but Later Desires Still Matter",
    "ziwei-si-gong-juri-shuicheng-jiacai": "Zi Wei in Si: Ju Ri, Wealth-Clamping Light, and Different Readings for Men and Women",
    "ziwei-wu-gong-mingzhu-chuhai-ge": "Zi Wei in Wu: Bright Pearl Depends on What the Sun and Moon Actually Light Up",
    "ziwei-wei-gong-lian-tan-zisha": "Zi Wei in Wei: Read Lian Zhen and Tan Lang in Hai by Palace and Timing First",
    "ziwei-shen-gong-yingxing-zurong": "Zi Wei in Shen: Hero-Star Power, Rank, and Inherited Advantage Are Not the Same Path",
    "ziwei-you-gong-rili-zhongtian": "Zi Wei in You: When Sun at Noon Helps Rank, and When It Only Helps a Phase",
    "ziwei-xu-gong-gudijie-riyue": "Zi Wei in Xu: Strong Patterns Can Still Hide the Risk of a Lone Di Jie",
    "ziwei-hai-gong-jiangxing-shuizhong": "Zi Wei in Hai: A Promotion Window on One Side, Water Risk on the Other",
    "ziwei-tianliang-wugong-sifa": "Why Tian Liang at Wu Often Fits Law, Police, Diplomacy, and Hard-Power Roles",
    "ziwei-riyue-jiaming-fanbei": "Why a Reversed Sun-and-Moon Clamp Often Feels Like Lifelong Strain",
    "ziwei-riyue-jiacai-ronghua": "Why a Sun-and-Moon Wealth Clamp Often Keeps Money Flowing",
    "ziwei-tianyue-dushou-guiren": "Tian Yue Standing Alone: Exam Luck, Recognition, and Promotion Through Sponsors",
    "ziwei-youbi-guxing-dayun": "You Bi Standing Alone: Why a Major Cycle Can Feel Deeply Lonely",
    "ziwei-wutan-nvming-haojie": "Wu Qu and Tan Lang at Night in a Woman's Chart: The Lady-Hero Pattern",
    "ziwei-fanshui-taohua-nannv": "Tan Lang in Hai or Zi: Strong Attraction, but Different for Women and Men",
    "ziwei-liantan-haigong-qingsheng": "Lian Zhen and Tan Lang in Hai: Separate Emotional Crisis from a Life Sentence",
    "ziwei-wuqu-qisha-maogong-binghuo": "Wu Qu and Qi Sha in Mao: Ask About the Cost Before the Glory",
    "ziwei-lianzhen-pojun-shuizhong-zuozhong": "Lian Zhen and Po Jun: Read Water Risk Before You Read Doom",
    "ziwei-quanlu-xiangfeng-laoban": "Authority and Lu Cun in the Wealth Palace: More Business Owner Than Salary Earner",
    "ziwei-fudegong-huaji-fuqi": "Why Hua Ji in the Inner Life Palace Often Drags the Marriage Line Down Too",
    "ziwei-riyue-fanbei-jushaolido": "Why Reversed Sun and Moon Often Mean Long Periods Apart in Marriage",
    "ziwei-fuqigong-tiantong-jumen-changqu": "Tian Tong and Ju Men in the Spouse Palace with Chang Qu and Tian Yue",
    "ziwei-pengyou-caiquan-chuqian": "When Friends Bring the Money and You Hold the Power",
    "ziwei-juri-fumugong-chengzuye": "Ju Ri in the Parents Palace: Resource Inheritance Before Personal Rise",
    "ziwei-riyue-bingming-buzhimingzhu": "The Bright Sun-and-Moon Structure Is Bigger Than the Bright Pearl Pattern",
    "ziwei-chougong-dijie-duigong-xiong": "A Lone Di Jie in Chou: Why Both Ends of the Axis Need Attention",
    "ziwei-minggong-caiguanqianyi-lian-kan": "Why the Life Palace Must Be Read With Wealth, Career, and Travel",
    "ziwei-liunian-buneng-zhikan-xing": "Why You Cannot Read an Annual Cycle by Stars Alone",
    "ziwei-shaoxing-rengong-shigong-fenfa": "The Same Malefic Star in a People Palace vs an Event Palace",
    "ziwei-guandai-weishenme-pa-buru-zhengwei": "Why an Official-Belt Star Must Land in the Career Palace",
    "ziwei-mingpuqian-zai-guanlu-qianyi": "When Money Shows Up in Career or Travel Instead of the Life Palace",
    "ziwei-xiaoliunian-zhizhua-bengong-duigong": "Why Annual Triggers Start With the Main and Opposite Palace",
    "ziwei-kequanlu-quandao-daxian": "Fame, Authority, and Resource Stars in a Ten-Year Cycle",
    "ziwei-huaquan-buzai-minggong": "Hua Quan Outside the Life Palace: Authority in the Wealth Line",
    "ziwei-liunian-huake-kaozheng-shangbang": "Hua Ke in an Annual Cycle: Best Used for Exams and Credentials",
    "ziwei-huaji-bengong-duigong-chabie": "Hua Ji in the Main Palace vs the Opposite Palace",
    "ziwei-huaji-duichongming-zui-pa": "Hua Ji Opposing the Life Palace: Why Breakdown Rarely Comes Out of Nowhere",
    "ziwei-lucun-duichong-tianma-huaji": "Lu Cun Opposing Tian Ma with Hua Ji: Profit Years Can Still Bring Disputes",
    "ziwei-huoling-liunian-zui-pa-shikong": "Mars and Bell in an Annual Cycle: Loss of Control Matters More Than Conflict",
    "ziwei-ziwei-wufubi-gujun": "Zi Wei Without Support Stars: Strong Enough to Carry, Hard to Ask for Help",
    "ziwei-ziwei-guanlu-guandai-zuoshi": "Zi Wei in the Career Palace: Nobility Settles Best in the Right Role",
    "ziwei-tianji-ruming-gongzhi-dongnao": "Tian Ji in the Life Palace: Best for Public Roles, Teaching, and Thinking Work",
    "ziwei-tianfu-jiaozhi-zhidugang": "Tian Fu: Better for Teaching and Structured Institutions",
    "ziwei-taiyang-caibo-jingyingcai": "Tai Yang in the Wealth Palace: Operating Income, Not Lucky Windfalls",
    "ziwei-tianliang-guanlu-shishen-yingchou": "Tian Liang in the Career Palace: More External Duties and Social Obligation",
    "ziwei-tanlang-tiankui-wenwu": "Tan Lang with Tian Kui: Talent, Edge, and the Need for Proper Qualification",
    "ziwei-luma-jiaochi-xinkucai": "Lu Ma Jiao Chi: Why Wealth Arrives Through Movement and Effort",
    "ziwei-tianyue-fuqi-duigong-huake": "Tian Yue in the Spouse Palace: A Partner With Strong Professional Standards",
    "ziwei-jiaoyou-pujun-dijie-tianma": "Po Jun, Di Jie, and Tian Ma in the Friends Palace",
    "ziwei-caibo-pujun-dijie-tianma": "Po Jun, Di Jie, and Tian Ma in the Wealth Palace",
    "ziwei-fuqi-jumen-tianyue": "Ju Men and Tian Yue in the Spouse Palace",
    "ziwei-tiankui-minggong-tianyue-caibo": "Tian Kui in Life, Tian Yue in Wealth: Turning Talent Into Income",
    "ziwei-liunian-tiankui-tianyue-changqu": "Tian Yue, Wen Chang, and Wen Qu in an Annual Cycle",
    "ziwei-zuigui-xianggui-kejia": "Sitting Noble and Facing Noble: Academic Strength Must Still Land in Career or Wealth",
    "ziwei-caixing-rucai-weijin-qianxian": "Does a Wealth Star Count Only in the Wealth Palace?",
    "ziwei-pengyougong-jixing-hehuo": "A Strong Friends Palace Does Not Automatically Mean a Good Partnership",
    "ziwei-zhiyou-huake-zhuanye": "Only Hua Ke in the Chart: Skills, Credentials, and the Right Career Lane",
    "ziwei-fumugong-lianzhen-pojun": "Lian Zhen and Po Jun in the Parents Palace: Distance, Pressure, and Early Self-Reliance",
    "ziwei-guanlugong-qingyang": "Qing Yang in the Career Palace: Better for Teaching or Technical Work Than Official Rank",
    "ziwei-hongluan-tianxi-guoji": "Why Marriage Should Pass Hua Ji First: Hong Luan and Tian Xi Timing",
    "ziwei-qianyigong-hualu": "Hua Lu in the Travel Palace: Growth Through Outside Markets and New Cities",
    "ziwei-guanlugong-konggong": "An Empty Career Palace: Why Corporate Roles Can Fit Better Than Official Rank",
    "ziwei-fumugong-ziwei-qisha": "Zi Wei and Qi Sha in the Parents Palace: Rank, Discipline, and Family Pressure",
    "ziwei-fuxiang-huiming": "Fu Xiang Meeting the Life Palace: Strong as a Number Two, Not Always the Main Boss",
    "ziwei-daxian-jieegong": "A Ten-Year Cycle in the Health Palace: When the Body Becomes the Main Theme",
    "ziwei-nanming-taiyin-huaji": "Tai Yin with Hua Ji in a Man's Chart: Mother-Wife Tension and Early Marriage Risk",
    "ziwei-minggong-huaquan-lingdao": "Hua Quan in the Life Palace: Strong Leadership Can Turn Into Isolation",
    "ziwei-fumugong-hualu-ziyuan": "Hua Lu in the Parents Palace: Family Support Only Works If You Can Carry It",
    "ziwei-caibogong-huaji-zhangqi": "Hua Ji in the Wealth Palace: Watch Credit Terms, Debt, and Overexpansion",
    "ziwei-daxian-huaji-niantou": "Hua Ji in a Ten-Year Cycle: The Block Often Starts in Your Own Mind",
    "ziwei-luji-tonggong-huikuan": "Lu and Ji in the Same Palace: Revenue on Paper Does Not Mean Cash Collected",
    "ziwei-liuqin-bukao-zili": "When Family Support Runs Thin: Why Some Charts Push Early Self-Reliance",
    "ziwei-youbi-dushou-fuqigong": "You Bi Alone in the Spouse Palace: Why Relationships Feel Delayed or Repeated",
    "ziwei-tanlang-zuoming-hualu": "Tan Lang in the Life Palace with Hua Lu: More Openings, More Temptation",
    "ziwei-lianzhen-qisha-fudegong-xinli": "Lian Zhen and Qi Sha in the Inner Life Palace: Tough on the Inside, Heavy Under Pressure",
    "ziwei-zifu-tonggong-tianma": "Zi Wei and Tian Fu with Tian Ma: Rank Often Rises After a Move",
    "ziwei-xingyao-zhengwei": "Reading Stars in the Right Palace: Officials to Career, Wealth to Wealth",
    "ziwei-caiquan-guanlu": "What Wealth Authority Means: Managing Big Money Is Not the Same as Owning It",
    "ziwei-fudegong-ziwei-guxing": "Zi Wei in the Inner Life Palace: High Standards, Heavy Self-Direction",
    "ziwei-youbi-fudegong": "You Bi in the Inner Life Palace: Surrounded Yet Still Carrying It Alone",
    "ziwei-xiongsu-chaoyuan": "Xiong Su Chao Yuan: Lian Zhen Alone in Yin or Shen",
    "ziwei-juri-ge": "Ju Ri Pattern: When Ju Men and Tai Yang Turn Speech Into Scale",
    "ziwei-qisha-chaodou-guanlu-caibo": "Qi Sha Facing the Dipper Beyond the Life Palace: Rank in Career, Resource in Wealth",
    "ziwei-mingzhu-chuhai-luogong": "Bright Pearl Beyond the Life Palace: When the Pattern Lights Up Family Lines",
    "ziwei-liusha-danxing-dushou": "A Lone Malefic Star: Why the Main Palace and Opposite Palace Both React",
    "ziwei-qianyi-ziwei-pojun-fubi": "Zi Wei, Po Jun, and Supporting Stars in the Travel Palace: Stronger Away From Home",
    "ziwei-fuqigong-huaquan": "Hua Quan in the Spouse Palace: A Strong-Willed Partner and Shared Power",
    "ziwei-fumugong-wuqu-pojun-kequan": "Wu Qu and Po Jun with Hua Ke and Hua Quan in the Parents Palace",
    "ziwei-fumugong-tiantong-jumen-hualu": "Tian Tong, Ju Men, and Hua Lu in the Parents Palace",
    "ziwei-zinvgong-konggong-duigong": "An Empty Children Palace: Start with the Opposite Palace",
    "ziwei-tanlang-ruming-tiankui": "Tan Lang in the Life Palace with Tian Kui: Sharp, Capable, and Hard to Misread",
    "ziwei-pojun-ziwu-yingxing": "Po Jun in Zi or Wu: Why Ying Xing in Temple Favors Hard Roles",
    "ziwei-tianzhaigong-huoxing": "Mars in the Property Palace: Fire Risk, Disputes, and Asset Care",
    "ziwei-xiongdigong-liantan-kongjie-tianma": "Lian Zhen and Tan Lang Weakened in the Siblings Palace with Kong Jie and Tian Ma",
    "ziwei-bankong-zhechi": "Ban Kong Zhe Chi: Why a Weak Lian Tan Axis Can Break Midway",
    "ziwei-hongluan-tianxi-zaohun": "Hong Luan, Tian Xi, and Early Marriage: Why Family Pressure Can Rush Timing",
    "ziwei-minggong-tianxiang-fuzuo": "Tian Xiang in the Life Palace: Better at Support Roles Than Forcing the Top Seat",
    "ziwei-fuqigong-wuqu-tonghang": "Wu Qu in the Spouse Palace: A Capable Partner and Clear Division of Roles",
    "ziwei-xiongdigong-wuqu-deli": "Wu Qu in the Siblings Palace: Reliable Peers, Stronger Boundaries",
    "ziwei-fumugong-wuqu-pojun-hualu": "Wu Qu and Po Jun with Hua Lu in the Parents Palace",
    "ziwei-fumugong-konggong-sanfang": "An Empty Parents Palace: Read the Triad and Opposite Palace",
    "ziwei-fuqigong-ziwei-fubi": "Zi Wei with Supporting Stars in the Spouse Palace",
    "ziwei-fuqigong-liantan-luoxian": "Lian Zhen and Tan Lang Weakened in the Spouse Palace",
    "ziwei-hongluan-tianxi-erhun": "Hong Luan, Tian Xi, and a Second Marriage Window",
    "ziwei-fudegong-hunyin-chengjie": "Why the Inner Life Palace Determines Whether Marriage Can Hold",
    "ziwei-guanlugong-qingyang-dushu": "When a Hard Career Year Is Better Used for Study and Credentials",
    "ziwei-tianliang-guanlugong-yingchou": "Tian Liang in the Career Palace: More External Duty, More Position Pressure",
    "ziwei-pengyougong-huaji-shiren": "Hua Ji in the Friends Palace: Bad Fit Partners and Costly Guarantees",
    "ziwei-jiyuetongliang-liren": "Ji Yue Tong Liang: Why It Often Fits Public Institutions and Schools",
    "ziwei-daxiaoliangxian-hongluan": "Hong Luan Across Major and Annual Cycles: Wanting Marriage Is Not the Same as Landing It",
    "ziwei-qisha-tianma-yuandi": "Qi Sha with Tian Ma: Leaving Home Early and Growing Through Distance",
    "ziwei-taiyang-haigong-luoxian": "Tai Yang Weak in Hai: Why the Reading Changes by Palace",
    "ziwei-yangtuo-jiasha": "Yang Tuo Clamping the Pattern: Hidden Trouble Means Boundaries First",
     "ziwei-sanfang-wu-kequanlu": "No Ke Quan Lu in the Main Structure: Better on Salary Than Forcing a Founder Role",
     "ziwei-caiguanshuangmei": "A Chart with Strong Career and Money Lines: Better for Financial Authority Than Personal Fortune",
     "ziwei-tianzhaigong-taiyang-quanji": "Tai Yang Hua Quan with Wen Chang Hua Ji in the Property Palace: Split Father, Partner, and Child Lines First",
     "ziwei-tianji-ruoming-gongzhi": "Tian Ji in the Life Palace: Better for Public Institutions, Teaching, and Back-Office Finance",
     "ziwei-wenchang-dushou-shudai": "Wen Chang Alone in the Life Palace: Good at Study, Not Automatically Good at Judgment",
     "ziwei-tianyue-liunian-guiren": "Tian Yue in an Annual Cycle: Exams, Promotion, and Sponsor-Led Opportunity",
     "ziwei-tiantong-dayun-renhe": "A Ten-Year Tian Tong Cycle: When Human Support Makes Business Easier",
     "ziwei-tianliang-wugong-yi-pin": "Tian Liang in Wu: Why Law, Policing, and Diplomacy Rise Faster",
     "ziwei-tanlang-haizi-fanshui": "Tan Lang in Hai or Zi: Strong Attraction Does Not Guarantee Stable Marriage",
     "ziwei-pojun-huake-zou-tianxia": "Po Jun Meeting Hua Ke: Carry a Technical Skill Into Bigger Markets",
     "ziwei-riyue-caibo-duibi": "Tai Yang vs Tai Yin in the Wealth Palace: Business Income and Accumulated Income",
     "ziwei-wuqu-xugong-rumiao": "Wu Qu in Xu in Temple: Tough Roles Often Fit Better Than Soft Ones",
     "ziwei-tianfu-huisha": "Tian Fu Meeting Malefics: Steady Does Not Mean Problem-Free",
     "ziwei-minghao-buruxianhao": "Why a Good Cycle Can Matter More Than a Good Natal Base",
     "ziwei-ziwei-jiee-zhihua": "Zi Wei's Relief Power: Why Helping a Malefic Is Not the Same as Erasing It",
     "ziwei-taiyang-guanlugong-wuguan": "Tai Yang in the Career Palace: Better for Visible Hard-Authority Roles",
     "ziwei-wuqu-caixingwang": "Why Wu Qu Is Called the Wealth King Star",
     "ziwei-tianfu-ruming-gongjiao": "Tian Fu in the Life Palace: Better for Public Service and Teaching Than Hard Command",
     "ziwei-tianliang-dayun-waizai": "A Tian Liang Ten-Year Cycle: More External Duty, Not Automatically an Internal Illness Phase",
     "ziwei-tiantong-liunian-hehuo": "Tian Tong in an Annual Cycle: When Partnership and Human Support Open Up",
     "ziwei-taiyin-guanlugong-wenguan": "Tai Yin in the Career Palace: Stable Salary, Civil Roles, and Long-Hold Work",
     "ziwei-caiquan-biquan": "Wealth Authority Is Not Personal Wealth",
     "ziwei-xiantian-houtian-cai": "How to Separate Inherited Wealth From Later-Built Wealth",
     "ziwei-tianliang-ruming-wenwu": "Tian Liang in the Life Palace: Why the Chart Often Bridges Civil and Hard-Power Lanes",
     "ziwei-pojun-ruming-buzhongli": "Po Jun in the Life Palace: Not Money-First, Better in Change and Project Work",
     "ziwei-tanlang-cai-taohua": "Why Tan Lang Often Amplifies Money and Attraction at the Same Time",
     "ziwei-huoxing-lingxing-fuqigong": "Mars and Ling Xing in the Spouse Palace: Conflict Escalates Fast",
     "ziwei-huoxing-lingxing-puyigong": "Mars and Ling Xing in the Friends Palace: Why Familiar Partnerships Burn Fast",
     "ziwei-fumugong-taiyin-huaji-muqin": "Tai Yin with Hua Ji in the Parents Palace: First Separate a Weak Mother Line From a Worry-Heavy One",
     "ziwei-fumugong-riyue-tongliang": "Sun and Moon Both Bright in the Parents Palace: Strong Family Line, Not Necessarily Light Pressure",
     "ziwei-zinvgong-tianliang-huaquan": "Tian Liang with Hua Quan in the Children Palace: Strong Male-Line Responsibility",
     "ziwei-xiongdigong-lingxing-huaji": "Ling Xing in the Siblings Palace With Hua Ji Pressure: Peer Conflict and Failed Partnerships",
     "ziwei-hongluan-tianxi-wanhun": "Why Hong Luan and Tian Xi Can Point to Late Marriage Rather Than No Marriage",
     "ziwei-wuqu-tanlang-jiangxing-shengqian": "Wu Qu and Tan Lang With Hua Quan and Hua Lu: A Promotion Window for Command-Type Charts",
     "ziwei-taiyin-huaji-ruomiao": "Tai Yin With Hua Ji: Why Fallen and Temple States Should Never Be Read the Same Way",
     "ziwei-wuguan-feng-wenchang": "When a Hard-Authority Chart Meets Wen Chang: Frontline Work Turns Into Teaching or Training",
     "ziwei-zhengcai-hengcai-duibi": "Fixed-Salary Wealth and Operating Wealth Are Not the Same Money Path",
     "ziwei-nvming-wuguanxing-gudan": "Why Women's Charts With Hard-Authority Stars Need Extra Relationship Support",
     "ziwei-taiyang-cai-lu-fuqin": "Tai Yang in Wealth vs Career: One Side Is Money, the Other Is Position",
     "ziwei-guanxing-ru-guanlu": "An Official Star Only Fully Fits When It Lands in the Career Palace",
    "ziwei-fudegong-lianpo-chongfuqi": "Lian Zhen and Po Jun in the Inner Life Palace: A Stable-Looking Marriage Can Still Fail Under Inner Load",
    "ziwei-fumu-sanhe-kequanlu": "An Empty Parents Palace Can Still Show Powerful Elders if the Surrounding Structure Carries Ke, Quan, and Lu",
    "ziwei-fuqigong-huaji-tufafa": "Hua Ji in the Spouse Palace Often Turns Dangerous in the Years When Nobody Is Guarding for It",
    "ziwei-tianliang-wugong-yingquan": "Tian Liang at Wu: Hard Authority Means Rank With Real Responsibility",
    "ziwei-riyue-fanbei-jiaming-laoxin": "Why a Reversed Sun-and-Moon Clamp Often Starts as Constant Overwork",
    "ziwei-youbi-minggong-fubi-zhi-cai": "You Bi in the Life Palace: A Natural Support Role, Not Always the Top Seat",
    "ziwei-youbi-fudegong-danjian-guxin": "You Bi Alone in the Inner Life Palace: Helpful Outside, Lonely Inside",
    "ziwei-lianqisha-weigong-rumiao-jifu": "Lian Zhen and Qi Sha in Wei: In Temple It Builds Wealth, Not Ruin",
    "ziwei-haoyun-taizao-weibi-hao": "Why an Early Good Cycle Is Not Always a Real Advantage",
    "ziwei-juri-ge-chengge-buchengge": "Ju Ri as a Full Pattern vs an Incomplete One",
    "ziwei-juri-luoxian-pianfang-qingxu": "When Ju Men and Tai Yang Look Like Ju Ri but Are Too Weak to Hold",
    "ziwei-wuqu-pojun-hai-gong-nvming": "Wu Qu and Po Jun in Hai in a Woman's Chart",
    "ziwei-hunyin-guoji-hou-cai-cheng": "Why Marriage Timing Often Works Better After Hua Ji Has Passed",
    "ziwei-rili-zhongtian-benge-dayun": "Ri Li Zhong Tian in the Natal Chart vs in a Ten-Year Cycle",
    "ziwei-rili-zhongtian-fuqi": "When Ri Li Zhong Tian Lights Up the Spouse Palace Instead of You",
    "ziwei-juri-huiming-shanglu": "Ju Ri Meeting the Life Palace: Why Big Money Often Follows a Business Path",
    "ziwei-fudegong-huaji-yishi-xinlei": "Hua Ji in the Inner Life Palace: More Than Simple Mental Fatigue",
    "ziwei-fudegong-huaji-sibie": "Why Hua Ji in the Inner Life Palace Can Pull Marriage Toward Separation by Loss",
    "ziwei-caibo-wupo-xing-pocai-pengyou": "Why Big Loss Can Come Through Friends Even When the Wealth Palace Looks Fine",
    "ziwei-pengyougong-pujun-dijie-tianma-huaiyou": "Po Jun, Di Jie, and Tian Ma in the Friends Palace: Trouble, Loss, and Bad Partnerships",
    "ziwei-pengyougong-hehuo-bibai": "Why This Friends-Palace Pattern Often Fails in Partnership",
    "ziwei-caibo-pujun-dijie-tianma-haizi": "Po Jun, Di Jie, and Tian Ma in the Wealth Palace: Do Not Hand Big Money Too Early",
    "ziwei-guanlugong-hualu-caiquan": "Hua Lu in the Career Palace: Big Financial Authority Is Not the Same as Corruption",
    "ziwei-huake-daxian-shangming": "Hua Ke in a Business Cycle: Reputation Before Credentials",
    "ziwei-shinian-huaji-xuejingyan": "A Hua Ji Decade: Why Learning Through Friction Can Pay Later",
     "ziwei-shengong-qianyi-laoban-yidi": "Body Palace in Travel: Why a Founder Path Often Grows Faster Away From Home",
     "ziwei-quanlu-caibo-zhangju": "Authority and Lu in the Wealth Palace: Income That Wants You to Hold the Wheel",
     "ziwei-liunian-buhaodu-shu": "Why a Bad Year Is Often Better Spent Studying Than Forcing a Fight",
     "ziwei-qisha-linshen-jingjun": "Qi Sha Touching the Body: Better Directed Into Discipline Than Left Unchecked",
     "ziwei-fumugong-kongjie-wuzuye": "An Empty Parents Palace With Di Jie: Thin Ancestral Support and Early Self-Reliance",
     "ziwei-xiongdigong-huaji-tianxing": "Hua Ji and Tian Xing in the Siblings Palace: When Peer Trouble Turns Legal",
     "ziwei-zhiyou-huake-ming": "Only Hua Ke in the Chart: A Professional Skill Path, Not a Power Path",
     "ziwei-guanlugong-qingyang-jiaozhi": "Qing Yang in the Career Palace: Better for Teaching and Hard Skills Than Official Rank",
     "ziwei-jieegong-buduan-xiaobingming": "Why the Health Palace Should Not Be Read by Minor Disease Labels First",
     "ziwei-jieegong-wuxing-budengyu-wubing": "An Empty Health Palace Does Not Mean No Health Risk",
     "ziwei-jieegong-xiankan-zhuicha-gong": "Why Health Reading Starts With the Worst Palace First",
     "ziwei-wugong-xinang-xingbao-fenfa": "How to Separate the Heart Line at Wu From the Heart-Protector Line at Xu",
     "ziwei-chengong-huaji-weibing": "Hua Ji in Chen: How to Read a Stomach-Risk Line Without Overcalling Surgery",
     "ziwei-puyigong-taixiong-biewenguiren": "When the Friends Palace Is Too Harsh, Stop Asking Only About Noble Help",
     "ziwei-puyigong-haustar-hehuo-bibai": "If the Friends Palace Is Full of Loss Stars, Screen Partnerships Before You Start",
     "ziwei-xiongdigong-huaji-sanzhong-yingfa": "Hua Ji in the Siblings Palace: Three Very Different Ways It Can Show Up",
     "ziwei-xiongdigong-huaji-buneng-zhikan-bengong": "Why Hua Ji in the Siblings Palace Cannot Be Read From One Palace Alone",
     "ziwei-tianzhaigong-xiaoren-xiang-zaoqie": "Property Palace Trouble Stars: Why Hidden People Can Hurt the Home Most",
     "ziwei-tianzhaigong-guansi-xing": "A Lawsuit Pattern in the Property Palace Does Not Mean the Asset Is Safe",
     "ziwei-weilai-shinian-meiyou-dayun": "How to Read the Next Ten Years When No Major Cycle Seems to Arrive",
     "ziwei-liunian-zou-youren-gong-jiehun": "Why an Annual Cycle Through a People Palace Can Still Trigger Marriage",
     "ziwei-liunian-caiqian-gong-yuhun": "Why a Wealth-Palace Year Can Also Bring a Relationship Window",
     "ziwei-tianxi-hongluan-fumugong": "Hong Luan and Tian Xi in the Parents Palace: Marriage Often Starts With Family",
     "ziwei-meiyou-hongluan-tianxi-jiehun": "No Hong Luan or Tian Xi Does Not Mean No Marriage Window",
     "ziwei-fuqigong-jumen-taiyang-wang-weibijiehun": "A Strong Sun-and-Ju-Men Spouse Palace Does Not Automatically Mean Marriage Time",
     "ziwei-fuqigong-tianfu-tianma": "Tian Fu With Tian Ma in the Spouse Palace: Marrying Well Can Stabilize the Whole Chart",
     "ziwei-fuqigong-pojun-xianhuaihunxian": "Why Po Jun in the Spouse Palace Often Damages the Marriage Line First",
     "ziwei-fuqigong-huaji-shengli-sibie": "Hua Ji in the Spouse Palace: First Separate Living Apart From Separation by Loss",
     "ziwei-caibogong-ziwei-huaquan": "Zi Wei Hua Quan in the Wealth Palace: More Private-Sector Control Than Official Rank",
     "ziwei-fumugong-ziwei-tianxiang-huaquan": "Zi Wei and Tian Xiang Hua Quan in the Parents Palace: Powerful Elders and Real Pressure",
     "ziwei-taiyin-huaji-zui-pa-mama-zuohunshi": "Why Tai Yin Hua Ji Is Most Risky When the Mother Line Runs the Marriage",
     "ziwei-fumugong-qingyang-luoxian": "Qing Yang Weakened in the Parents Palace: Family Actions Can Still Hold You Back",
     "ziwei-minggong-dikong": "Di Kong in the Life Palace: Separate Thin Family Support From a Deep Sense of Rootlessness",
     "ziwei-fumu-xiongdi-dousha-liuqinbukao": "When Parents and Siblings Both Carry Sha, Family Is Present but Hard to Rely On",
     "ziwei-xiongdigong-liantan-luoxian-kongjie-tianma": "Lian Zhen and Tan Lang Weakened in the Siblings Palace With Kong Jie and Tian Ma",
     "ziwei-guanlugong-huake-kaoshi-zige": "Hua Ke in the Career Palace: Exams, Credentials, and the Teacher Path",
     "ziwei-riyue-huake-tonghui-fuqi": "Sun and Moon With Hua Ke Meeting the Spouse Palace: A Skilled Partner With a Full Schedule",
     "ziwei-guanlu-ziwei-qisha-caibo-lianpo": "Zi Wei and Qi Sha in Career, Lian Po in Wealth: A Martial Command Pattern Is Not a Business Pattern",
     "ziwei-chengong-huaji-weitong-wupanduan": "Hua Ji in Chen: How to Read a Stomach-Risk Line Without Overcalling Surgery",
     "ziwei-puyigong-taixiong-buwenguiren": "When the Friends Palace Is Too Harsh, Stop Asking Only About Noble Help",
     "ziwei-puyigong-haoxing-bibai-ju": "If the Friends Palace Is Full of Loss Stars, Screen Partnerships Before You Start",
     "ziwei-xiongdigong-huaji-sanchong-yifa": "Hua Ji in the Siblings Palace: Three Very Different Ways It Can Show Up",
     "ziwei-xiongdigong-huaji-yaodeng-yingshi": "Why Hua Ji in the Siblings Palace Cannot Be Read From One Palace Alone",
     "ziwei-tianzhaigong-xiaoren-xiangdaoqie": "Property Palace Trouble Stars: Why Hidden People Can Hurt the Home Most",
     "ziwei-tianzhaigong-guansi-zichan-mingyi": "A Lawsuit Pattern in the Property Palace Does Not Mean the Asset Is Safe",
     "ziwei-weilai-shinian-wudayun": "How to Read the Next Ten Years When No Major Cycle Seems to Arrive",
     "ziwei-liunian-yourengong-ye-jiehun": "Why an Annual Cycle Through a People Palace Can Still Trigger Marriage",
     "ziwei-liunian-caibo-yu-hunyuan": "Why a Wealth-Palace Year Can Also Bring a Relationship Window",
     "ziwei-hongluan-tianxi-luofumu": "Hong Luan and Tian Xi in the Parents Palace: Marriage Often Starts With Family",
     "ziwei-meiyou-hongluan-tianxi-ye-jiehun": "No Hong Luan or Tian Xi Does Not Mean No Marriage Window",
     "ziwei-fuqi-jumen-taiyang-wang-weibijiehun": "A Strong Sun-and-Ju-Men Spouse Palace Does Not Automatically Mean Marriage Time",
     "ziwei-fuqi-tianfu-tianma": "Tian Fu With Tian Ma in the Spouse Palace: Marrying Well Can Stabilize the Whole Chart",
     "ziwei-fuqigong-pojun-huaihunxian": "Why Po Jun in the Spouse Palace Often Damages the Marriage Line First",
     "ziwei-taiyin-huaji-muqin-chouhun": "Why Tai Yin Hua Ji Is Most Risky When the Mother Line Runs the Marriage",
     "ziwei-minggong-dikong-liuqin-wujia": "Di Kong in the Life Palace: Separate Thin Family Support From Adoption or Rootlessness",
     "ziwei-fumu-xiongdi-daisha-liuqinbukao": "When Parents and Siblings Both Carry Sha, Family Is Present but Hard to Rely On",
     "ziwei-xiongdigong-liantan-kongkongjie-tianma": "Lian Zhen and Tan Lang Weakened in the Siblings Palace With Kong Jie and Tian Ma",
     "ziwei-guanlugong-huake-kaoshi-jiaozhi": "Hua Ke in the Career Palace: Exams, Credentials, and the Teacher Path",
     "ziwei-riyue-huake-huifuqi": "Sun and Moon With Hua Ke Meeting the Spouse Palace: A Skilled Partner With a Full Schedule",
     "ziwei-ziweiqisha-guanlu-lianpo-caibo": "Zi Wei and Qi Sha in Career, Lian Po in Wealth: A Martial Command Pattern Is Not a Business Pattern",
      };
  if (slugMap[article.slug]) return slugMap[article.slug];
  const keyMap = [
    ["禄存在命宫", "Lu Cun in the Life Palace: Saving Money Without Getting Stuck"],
    ["禄存在财帛和流年", "Lu Cun in the Wealth Palace and Annual Cycle"],
    ["天马在朋友宫", "Tian Ma in the Friends Palace: Movement Through People"],
    ["六煞星", "The Six Malefic Stars: Read People Palaces and Event Palaces Differently"],
    ["擎羊陀罗在命宫", "Qing Yang and Tuo Luo in the Life Palace"],
    ["擎羊陀罗在夫妻宫", "Qing Yang and Tuo Luo in the Spouse Palace"],
    ["火铃在夫妻宫", "Mars and Ling Xing in the Spouse Palace"],
    ["火铃在仆役宫", "Mars and Ling Xing in the Friends Palace"],
    ["地劫独守", "Di Jie Standing Alone: Read the Main and Opposite Palace"],
    ["空劫在财帛", "Kong Jie in the Wealth Palace: Income That May Not Settle"],
    ["文昌单守", "Wen Chang Alone: Learning Is Not the Same as Judgment"],
    ["文昌文曲", "Wen Chang and Wen Qu: Talent, Writing, and Income"],
    ["天魁天钺", "Tian Kui and Tian Yue: Exams, Mentors, and Open Doors"],
    ["红鸾天喜", "Hong Luan and Tian Xi: Marriage Signals Are Not the Whole Story"],
    ["红鸾落宫", "Where Hong Luan Lands: How Relationships Are Triggered"],
    ["巨门化忌", "Ju Men with Hua Ji: When Speech Turns Into Disputes"],
    ["巨门逢天马", "Ju Men with Tian Ma: Travel, Speech, and Moving Parts"],
    ["太阳落陷在财帛", "Tai Yang Weak in the Wealth Palace"],
    ["太阴化忌", "Tai Yin with Hua Ji: Family, Partners, and Inner Security"],
    ["天机化忌在福德", "Tian Ji with Hua Ji in the Inner Life Palace"],
    ["贪狼化禄在子女宫", "Tan Lang with Hua Lu in the Children Palace"],
    ["化科在财帛", "Hua Ke in the Wealth Palace: Turning Skill Into Income"],
    ["身宫在财帛", "Body Palace in Wealth: A Life Shaped by Money Path"],
    ["身宫在官禄和迁移", "Body Palace in Career or Outside Palace"],
    ["兄弟宫化忌", "Hua Ji in the Siblings Palace: Peers, Money, and Boundaries"],
    ["武曲七杀在福德", "Wu Qu and Qi Sha in the Inner Life Palace"],
    ["武曲七杀遇商人", "Wu Qu and Qi Sha for Business: Authority Is Not Profit"],
    ["日月科禄在丑未", "Sun and Moon with Hua Ke and Lu in Chou or Wei"],
    ["化科遇生意", "Hua Ke in Business: Reputation Is Not Cash Flow"],
    ["化忌对冲", "Hua Ji Opposing a Palace: Read Both Ends of the Line"],
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
  return found ? found[1] : `${englishTitleFromSlug(article.slug, title)} in Zi Wei Dou Shu`;
}

function englishTitleFromSlug(slug, fallbackTitle = "") {
  const fallback = fallbackTitle && !/[\u4e00-\u9fff]/.test(fallbackTitle)
    ? fallbackTitle.replace(/\s+in Zi Wei Dou Shu$/i, "").trim()
    : "";
  const source = String(slug || "")
    .replace(/\.html$/i, "")
    .replace(/^ziwei-/, "")
    .replace(/-/g, " ")
    .trim();
  const tokenMap = {
    caibo: "Wealth",
    cai: "Wealth",
    guanlu: "Career",
    qianyi: "Travel",
    fuqigong: "Spouse Palace",
    minggong: "Life Palace",
    fudegong: "Inner Life Palace",
    xiongdi: "Siblings",
    zinv: "Children",
    puyigong: "Friends Palace",
    liunian: "Annual Cycle",
    daxian: "Ten-Year Cycle",
    xiaoxian: "Annual Trigger",
    hualu: "Hua Lu",
    huake: "Hua Ke",
    huaquan: "Hua Quan",
    huaji: "Hua Ji",
    taiyang: "Tai Yang",
    taiyin: "Tai Yin",
    tanlang: "Tan Lang",
    wuqu: "Wu Qu",
    qisha: "Qi Sha",
    pojun: "Po Jun",
    tianji: "Tian Ji",
    tianfu: "Tian Fu",
    tianxiang: "Tian Xiang",
    tianliang: "Tian Liang",
    tiantong: "Tian Tong",
    jumen: "Ju Men",
    lianzhen: "Lian Zhen",
    wenchang: "Wen Chang",
    wenqu: "Wen Qu",
    lucun: "Lu Cun",
    tianma: "Tian Ma",
    dikong: "Di Kong",
    dijie: "Di Jie",
    huoling: "Mars and Bell Star",
    qingyang: "Qing Yang",
    tuoluo: "Tuo Luo",
    hongluan: "Hong Luan",
    tianxi: "Tian Xi",
    santai: "San Tai",
    bazuo: "Ba Zuo",
    kuiyue: "Kui Yue",
    changqu: "Chang Qu",
    luma: "Lu Ma",
    riyue: "Sun and Moon",
    zifu: "Zi Wei and Tian Fu",
    star: "Star",
  };
  const title = source
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => tokenMap[token] || token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return title || fallback || "A Chart Pattern";
}

function englishExample(chinese) {
  if (chinese.includes("银行主管") || chinese.includes("财务负责人") || chinese.includes("项目负责人")) return "A chart can show budget authority, approval power, or stewardship over large sums without turning that authority into personal wealth.";
  if (chinese.includes("资源调度") || chinese.includes("大型民企") || chinese.includes("营运负责人")) return "Some patterns work best in large organizations, where managing teams, budgets, and systems matters more than direct ownership.";
  if (chinese.includes("夫妻宫") && chinese.includes("二婚")) return "When a partnership palace looks structurally incomplete, the real issue is often delay, imbalance, or emotional absence rather than one dramatic event.";
  if (chinese.includes("外地") || chinese.includes("换城市") || chinese.includes("换平台")) return "A move, a bigger platform, or a new market can activate the chart more strongly than staying in the original environment.";
  if (chinese.includes("兄弟") || chinese.includes("父母") || chinese.includes("子女")) return "A strong pattern does not always describe the person directly; sometimes it shows up through siblings, parents, or children first.";
  if (chinese.includes("官司") || chinese.includes("法院")) return "A conflict pattern becomes more serious when speech, anger, and legal trouble land on the same axis.";
  if (chinese.includes("做大生意") || chinese.includes("公开市场") || chinese.includes("拿项目")) return "Strong speech patterns work best when visibility, persuasion, and deal-making are all supported by the surrounding palaces.";
  if (chinese.includes("负责人") || chinese.includes("强执行主管")) return "When a leadership pattern lands in the career palace, it often shows up as rank, responsibility, and hard decisions before it shows up as comfort.";
  if (chinese.includes("大组织") || chinese.includes("更大市场")) return "A resource-heavy pattern may point to scale, mandate, and platform size rather than easy cash in hand.";
  if (chinese.includes("自己做决定") || chinese.includes("不太信别人")) return "Some placements look social on the surface but feel solitary inside, especially when the chart lacks enough support around the core star.";
  if (chinese.includes("睡不稳") || chinese.includes("长期紧绷")) return "An inner-life placement can show chronic tension, self-command, and difficulty relaxing even when life looks stable from outside.";
  if (chinese.includes("官禄")) return "When the career palace is activated, read responsibility, role, and income together.";
  if (chinese.includes("财帛")) return "When the wealth palace is involved, check cash flow, income source, and whether money can be retained.";
  if (chinese.includes("迁移")) return "When the travel palace is involved, outside platforms, clients, or new environments matter more.";
  if (chinese.includes("化忌")) return "When Hua Ji appears, treat it as a bottleneck that needs rules and risk control.";
  if (chinese.includes("化权")) return "When Hua Quan appears, the opportunity usually comes with heavier responsibility.";
  if (chinese.includes("化科")) return "When Hua Ke appears, reputation, exams, skill, or public recognition becomes important.";
  return "Read the star through the palace and the real-life role it points to, rather than using a vague fixed prediction.";
}

function uniqueEnglishExamples(article, examples) {
  const translated = examples.map((item) => englishExample(item));
  const seen = new Set();
  const unique = [];
  for (const line of translated) {
    if (line && !seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }
  const fallbacks = englishFallbackExamples(article).filter((line) => !seen.has(line));
  return [...unique, ...fallbacks].slice(0, 3);
}

function englishOverrideFor(article) {
  const englishOverrides = {
  "ziwei-ziwei-wuzuoyou-guxing": {
    title: "Why Zi Wei Needs Zuo Fu and You Bi",
    description: "Zi Wei can still look noble on its own, but without Zuo Fu and You Bi the chart often feels heavier, more solitary, and harder to carry in real life."
  },
  "ziwei-caixing-ru-guanlu-budengyu-zibao": {
    title: "Wealth Stars in the Career Palace Are Not Always Personal Wealth",
    description: "This pattern often points to budget authority, financial stewardship, or handling large sums for an institution before it points to personal riches."
  },
  "ziwei-taiyang-caibo-hengcai-fengong": {
    title: "Tai Yang in the Wealth Palace: Business Income Versus Salary",
    description: "Read Tai Yang in the wealth line as market-facing, entrepreneurial, or publicly earned money, not as a simple fixed-salary pattern."
  },
  "ziwei-tianji-zuoming-wenguan-dizi": {
    title: "Tian Ji in the Life Palace: Smart, Fast, and Civil-Service Minded",
    description: "This placement often favors analysis, administration, teaching, and quick mental response more than blunt executive authority."
  },
  "ziwei-wenchang-danshou-shudai": {
    title: "Wen Chang Alone: Why Study Can Turn Rigid",
    description: "Wen Chang is strong for exams and structured learning, but without supporting stars it can slide into bookish certainty without practical judgment."
  },
  "ziwei-wenchang-wenqu-tonghui-taohua-caiyi": {
    title: "Wen Chang and Wen Qu Together: Talent, Expression, and Attraction",
    description: "This pairing lifts writing, style, and artistic expression, while also increasing visibility and social appeal in a way that should not be reduced to one flat label."
  },
  "ziwei-liunian-wenchang-huaji-kaoshi": {
    title: "Annual Wen Chang With Hua Ji: Exam Pressure Without a Result",
    description: "An annual Wen Chang trigger can bring tests, applications, and study effort, but Hua Ji often means the process appears without an easy pass."
  },
  "ziwei-kuiyue-changqu-kaoshi": {
    title: "Tian Kui and Tian Yue With Wen Chang and Wen Qu",
    description: "A strong exam-star stack can outperform appearances entirely, lifting rank, credentials, and test results even in charts that do not look bookish on the surface."
  },
  "ziwei-hongluan-zuoming-huixiangtiao": {
    title: "Hong Luan in the Life Palace Is About Choice, Not Only Romance",
    description: "Hong Luan here often shows not just attraction, but a clear eye for who draws the person in and what kind of relationship path they will actually choose."
  },
  "ziwei-zuofu-youbi-zhuanfu-ziwei": {
    title: "Why Zuo Fu and You Bi Primarily Support Zi Wei",
    description: "These support stars matter most when they stabilize Zi Wei itself, turning a noble but solitary core into a role that can truly lead and carry others."
  },
  "ziwei-tianfu-santai-bazuo-jiee": {
    title: "Why Tian Fu Needs San Tai and Ba Zuo",
    description: "Tian Fu looks steady on its own, but San Tai and Ba Zuo are what strengthen its ability to absorb strain, resolve trouble, and hold a stable structure."
  },
  "ziwei-luma-jiaochi-buqingsong": {
    title: "Lu Ma Jiao Chi: Big Money Usually Means Big Movement",
    description: "This pattern is not lazy luck. It often shows money arriving through motion, expansion, logistics, market work, or a demanding business rhythm."
  },
  "ziwei-tanlang-tiankui-nvming-lei": {
    title: "Tan Lang With Tian Kui: Strong Talent, Heavier Burden for Some Women",
    description: "The combination can look like a gifted, capable chart, but in some women's charts it may also mean carrying more responsibility, more roles, and less room to rest."
  },
  "ziwei-shengong-zaicaibo-zhiyefunv": {
    title: "Body Palace in Wealth: Why Later Life Gets Pushed by Money Work",
    description: "When the body palace lands here, later life is often driven less by relationship identity and more by earning structure, practical work, and financial responsibility."
  },
  "ziwei-qisha-linshen-duobaishaocheng": {
    title: "Qi Sha Touching the Body Palace: Pressure Lands on the Self",
    description: "This is a harder-carry placement that often brings repeated pressure, a rougher learning curve, and a life that requires earlier adjustment and stronger support."
  },
  "ziwei-huake-caibo-zhuanye-fanxian": {
    title: "Hua Ke in the Wealth Palace: Turn Skill and Credentials Into Income",
    description: "This placement favors income built through expertise, reputation, certification, or artistic output rather than through vague effort or interchangeable labor."
  },
  "ziwei-tiankui-ming-tianyue-cai-huake": {
    title: "Tian Kui in Life, Tian Yue in Wealth, Plus Hua Ke",
    description: "A stacked study-and-skill structure like this should usually be pushed toward a real specialty, because the chart loses power when it is buried in generic work."
  },
  "ziwei-qianyi-ziwei-duzuo-guiguren-gujun": {
    title: "Zi Wei Alone in the Travel Palace: Noble Help Outside, But Solitary Pressure",
    description: "This pattern can open doors through outside platforms and distant allies, yet still leave the person carrying the role alone once the opportunity arrives."
  },
  "ziwei-zuofu-youbi-fuqi-gengchuse": {
    title: "Zuo Fu and You Bi in the Spouse Palace: A Stronger Partner Line",
    description: "When support stars land here, the chart often shows an unusually capable or elevated partner rather than the native taking all of the credit directly."
  },
  "ziwei-zifu-zuoyuan-qisha-chaodou-fenfa": {
    title: "Zi Fu Holding the Center Versus Qi Sha Facing the Dipper",
    description: "Both are high-status patterns, but one leans toward central placement and ordered power while the other often works through frontier pressure, movement, or a harder command role."
  },
  "ziwei-youbi-dushou-fubi-zhicai": {
    title: "You Bi Alone: Better as a Right-Hand Role Than a Front Seat",
    description: "This placement often shines more in support, advising, coordination, and close-assistant roles than in forcing a lone front-facing power position."
  },
  "ziwei-changqu-chouwei-riyue-kelu": {
    title: "Wen Chang and Wen Qu in Chou or Wei",
    description: "In these palaces the study stars often connect to Sun-Moon prestige, giving learning, expression, and status a stronger chance to rise together."
  },
  "ziwei-yuelang-tianmen-nvming": {
    title: "Yue Lang Tian Men: Why This Pattern Often Fits Women Especially Well",
    description: "This bright-moon pattern is about clarity, fairness, and calm judgment, and in many women's charts it reads as especially graceful and effective."
  },
  "ziwei-mingzhu-chuhai-buzhiying-benin": {
    title: "Bright Pearl Emerging From the Sea Does Not Only Belong to the Self",
    description: "A famous pattern like this can show up through siblings, parents, children, or a specific life phase, not only through the native's own Life Palace line."
  },
  "ziwei-rizhao-leimen-zuocixiang": {
    title: "Ri Zhao Lei Men: This Pattern Works Best in Daylight Rhythms",
    description: "The chart favors visible, daytime, structured work and loses part of its strength when placed into hidden, badly timed, or rhythm-breaking roles."
  },
  "ziwei-tianxi-minggong-hongluan-qianyi-donghun": {
    title: "Tian Xi in Life and Hong Luan in Travel: Marriage May Begin Outside Home",
    description: "This pairing often suggests that relationship momentum arrives through movement, distance, clients, travel, or an outside-facing environment rather than through the nearest circle."
  },
  "ziwei-quanlu-caibo-kongpan": {
    title: "Hua Quan With Lu Cun in the Wealth Palace: Control Matters More Than Show",
    description: "Read this as a business-control or resource-command pattern first, because its real value is often the ability to run the money line, not just display wealth."
  },
  "ziwei-fudegong-hongluan-tianxi-duohun": {
    title: "Hong Luan or Tian Xi in the Inner-Life Palace: Repeated Marriage Triggers",
    description: "Even when the spouse palace is not the loudest part of the chart, these pleasure-and-marriage stars in the inner-life line can keep relationship timing moving more than once."
  },
  "ziwei-guoji-qian-bie-dinghun": {
    title: "Why You Should Not Rush Engagement Before Hua Ji Is Passed",
    description: "Strong relationship momentum is not enough on its own. When the blockage period has not yet been crossed, the chart often shows delay, hidden complications, or a bond that stalls halfway."
  },
  "ziwei-jumen-tianxing-huaji-guansi": {
    title: "Ju Men, Tian Xing, and Hua Ji: When Disputes Escalate Into Legal Trouble",
    description: "This is a layered conflict pattern. It should be read as more than gossip or ordinary friction, because speech, punishment, and blockage can combine into formal disputes or litigation."
  },
  "ziwei-xiongdigong-ye-kan-sanfang": {
    title: "Why the Siblings Palace Still Needs Triad Reading",
    description: "Read siblings, peers, and shared-resource themes through the main, opposite, and supporting palaces before you judge support or loss."
  },
  "ziwei-sihua-buyong-meinian-fei": {
    title: "Why the Four Transformations Are Read as Fixed Placements First",
    description: "Zi Wei Dou Shu reads Ke, Quan, Lu, and Ji through their natal palace placement first, then through timing triggers."
  },
  "ziwei-minghao-buruxianhao-yisi": {
    title: "What 'A Good Phase Beats a Good Natal Base' Really Means",
    description: "A strong natal chart still depends on the right ten-year and annual timing to turn potential into real position, money, or support."
  },
  "ziwei-miaowang-luoxian-xianliangdu": {
    title: "How Temple, Strong, Weak, and Fallen States Change a Star",
    description: "The same star behaves very differently depending on brightness and placement, so chart reading must start with usable strength, not loose good-bad labels."
  },
  "ziwei-fuqihao-fudecha-haishi-san": {
    title: "A Good Spouse Palace Can Still Fail if the Inner-Life Palace Cannot Hold It",
    description: "A marriage can look fine on the surface yet still wear down if the inner-life line cannot carry the relationship over time."
  },
  "ziwei-fuqigong-lianzhen-tianfu": {
    title: "Lian Zhen and Tian Fu in the Spouse Palace",
    description: "This pairing often points to a steady, proper partner on the surface, but long-term relationship quality still depends on the inner-life palace."
  },
  "ziwei-hongluan-luofumu-zinv-pengyou": {
    title: "Hong Luan in the Parents, Children, or Friends Palace",
    description: "Marriage timing does not always enter through romance alone. It can be pushed by family, children, or social connections."
  },
  "ziwei-shengong-zai-fuqi": {
    title: "Body Palace in the Spouse Palace",
    description: "When the body palace lands here, later life is shaped strongly by marriage, partnership, and relationship structure."
  },
  "ziwei-tianzhaigong-zuye-zichan-fangchan": {
    title: "What the Property Palace Actually Covers",
    description: "The property palace is not only about owning a home. It separates inherited assets, self-built assets, and the stability of the living environment."
  },
  "ziwei-tianzhai-xiaoren-xiaotou": {
    title: "Malefic 'Small-People' Signs in the Property Palace",
    description: "This pattern is less about buying property fast and more about guarding the home, hidden loss, and avoidable domestic entanglement."
  },
  "ziwei-tianzhai-zuoxiang-wending": {
    title: "Why the Property Palace Also Points to Housing Stability",
    description: "Zi Wei Dou Shu uses the property line not only for assets, but also for whether the home setup and living situation stay steady."
  },
  "ziwei-fumugong-andan-yuanbo": {
    title: "A Weak Parents Palace: Thin Ties, Adoption Signals, and Low Family Support",
    description: "This topic separates weak family ties, distance, adoption-type signals, and low practical support instead of collapsing them into one harsh label."
  },
  "ziwei-fumugong-youlu-bukaozuye": {
    title: "Parents Palace With Lu but No Lu in the Life Palace",
    description: "Family resources may exist, yet the person may still need to build life through their own later path rather than living off inherited advantage."
  },
  "ziwei-liunian-zou-fumu-jiehun": {
    title: "Why an Annual Trigger in the Parents Palace Can Also Coincide With Marriage",
    description: "Marriage timing can arrive through family involvement, introductions, approval, and household-level momentum, not only through the spouse palace."
  },
  "ziwei-zinvgong-konggong-duigong-huaji": {
    title: "An Empty Children Palace: Read the Opposite Palace First",
    description: "An empty children line should not be judged in isolation. The opposite palace often reveals whether the line is weak, delayed, or still supported."
  },
  "ziwei-zinv-wenfu-qingzi-pan": {
    title: "Why the Parents' Chart Only Gives the Big Picture of the Children Line",
    description: "The parents' chart can show the child line broadly, but detailed life reading belongs to the child's own chart."
  },
  "ziwei-xiongdigong-taiyin-luoxian": {
    title: "Tai Yin Fallen in the Siblings Palace",
    description: "Separate few siblings, thin sibling ties, and weak peer support before making a judgment about what this line really means."
  },
  "ziwei-xiongdigong-wuqu-bangli-budengyu-ziyuan": {
    title: "Wu Qu in the Siblings Palace: Reliable Peers Do Not Always Mean Usable Resources",
    description: "This pattern can show capable siblings or peers, but real help still depends on whether the wider structure turns that reliability into support."
  },
  "ziwei-pengyougong-caixing-jixing-hehuo": {
    title: "Wealth and Good Stars in the Friends Palace",
    description: "A workable partnership depends on structure, role, and capital flow, not on friendship depth by itself."
  },
  "ziwei-pengyougong-huaquan-caibo-youlu": {
    title: "Authority in the Friends Palace, Lu in the Wealth Palace",
    description: "This is a partnership-roles pattern: separate who brings capital, who holds control, and who actually sits in the boss seat."
  },
  "ziwei-pengyougong-tianji-tianma": {
    title: "Tian Ji and Tian Ma in the Friends Palace",
    description: "Running for other people, their projects, and their networks is not the same as building your own business line."
  },
  "ziwei-shenming-tonggong": {
    title: "Body and Life Palace Together",
    description: "When native disposition and later-life direction fall on the same line, life feels more unified, concentrated, and less internally split."
  },
  "ziwei-qisha-linshen-zhongbumei": {
    title: "Qi Sha Touching the Body Palace",
    description: "This pattern often shows later-life pressure landing directly on the person, making discipline and recovery more important than bravado."
  },
  "ziwei-kuiyue-changqu-kejia": {
    title: "Tian Kui, Tian Yue, Wen Chang, and Wen Qu Together",
    description: "This cluster often lifts exams, credentials, talent, and professional recognition at the same time."
  },
  "ziwei-quchang-tonggong-riyue-kelu": {
    title: "Wen Qu and Wen Chang Together in Chou or Wei",
    description: "When study stars meet the Sun, Moon, and fortune signals well, reading skill can turn into status, reputation, and professional standing."
  },
  "ziwei-lucun-hualu-chabie": {
    title: "Lu Cun vs Hua Lu",
    description: "Both bring money, but one leans toward holding and guarding it, while the other leans toward income flow and incoming resources."
  },
  "ziwei-luma-jiaochi-xinku": {
    title: "Lu Ma Jiao Chi: Bigger Money Paths Usually Mean More Movement and Work",
    description: "This is not easy money. It often shows profit arriving through action, market movement, travel, or a demanding operating rhythm."
  },
  "ziwei-tiantong-renhe-hehuo": {
    title: "Why Tian Tong Fits Partnership and Human Support",
    description: "Not every profitable pattern is built through force. Tian Tong works best where cooperation, timing, and people working together matter."
  },
  "ziwei-lianzhen-citao-hua": {
    title: "Why Lian Zhen Is Called the Secondary Peach Blossom",
    description: "Lian Zhen is not only about attraction. It also carries boundaries, authority, and a more controlled style of action."
  },
  "ziwei-dixing-bufubi-guxing": {
    title: "Why Zi Wei Needs Zuo Fu and You Bi",
    description: "Without support stars, dignity and weight can turn solitary. This pattern often separates personal gravity from true support and teamwork."
  },
  "ziwei-minggong-tianxiang-fuzuo": {
    lead: "Tian Xiang in the Life Palace often looks polished and responsible, but the chart usually works better in executive support, operations, or second-in-command roles than in lonely top-seat power struggles.",
    meaning: "This is a role-and-structure pattern. The person may be trusted, visible, and capable, yet still feel that the title sounds bigger than the real authority. The right outlet is often coordination, gatekeeping, process control, or helping a larger system run well.",
    method: "Start with the Life Palace, then compare the opposite palace, the Career Palace, and the Wealth Palace. Ask whether the chart has true power backing, or whether it is stronger at supporting, advising, and keeping order inside an existing structure.",
    examples: [
      "Someone can hold a respected manager title while the real strategic call still belongs to the owner or founder.",
      "The same pattern often does better as a chief of staff, operations head, or senior partner than as a solo front-stage figure.",
      "If supporting palaces are weak, the person may look important on paper but carry pressure without enough room to decide."
    ]
  },
  "ziwei-fuqigong-wuqu-tonghang": {
    lead: "Wu Qu in the Spouse Palace often points to a practical, disciplined partner and very often to a marriage that grows out of shared work, the same industry, or the same operating rhythm.",
    meaning: "This pattern is less about romance language and more about execution, responsibility, and material reality. It can describe a partner who is capable and hardworking, but it also needs clean role boundaries so the relationship does not become a permanent project meeting.",
    method: "Read the Spouse Palace together with Career and Wealth. Then ask whether the chart shows a same-field partner, a business-minded marriage, or a couple who works well only after dividing direction, execution, and money management clearly.",
    examples: [
      "Two people may meet through work, stay together because they trust each other's competence, and build life around shared output rather than dramatic romance.",
      "A couple can both be strong executors, yet still argue constantly if nobody decides who owns the big direction.",
      "When money palaces are stressed, the same practical strength can turn into scorekeeping, control, or emotional distance."
    ]
  },
  "ziwei-xiongdigong-wuqu-deli": {
    lead: "Wu Qu in the Siblings Palace often means brothers, sisters, cousins, or close peers are useful and capable, but the value usually shows up as help, leverage, or resources more than soft emotional warmth.",
    meaning: "This is a resource-line reading. The chart may show reliable siblings, competent peers, or a family network that gets things done. It does not automatically mean intimacy. Sometimes the support is strongest in money, work, or logistics rather than daily closeness.",
    method: "Read the Siblings Palace with the Wealth and Parents palaces. The key question is whether this part of the chart gives hands-on help, business resources, or simply tough, capable people who are not very sentimental.",
    examples: [
      "A sibling may be the one who helps with business setup, funding, or difficult practical tasks even if the relationship is not especially tender.",
      "Some charts show strong peers at work who function almost like siblings and become the real support line.",
      "If malefic pressure is heavy, capable siblings can still become competitive, transactional, or hard to rely on emotionally."
    ]
  },
  "ziwei-fumugong-wuqu-pojun-hualu": {
    lead: "Wu Qu and Po Jun with Hua Lu in the Parents Palace usually points to a family line that is good at business, restructuring, or resource capture, not just a clean official or academic route.",
    meaning: "Read this first as the style of the older generation. The family may be hard-driving, commercially sharp, and used to change, reinvention, or risk. Hua Lu here often shows money channels or operating leverage flowing through the family structure.",
    method: "Start with the Parents Palace, then compare Wealth, Career, and the Life Palace. Ask whether the chart inherited a business logic, a money-handling habit, or a family environment that teaches survival through action rather than status labels.",
    examples: [
      "A parent may leave behind networks, inventory, clients, or deal-making instincts rather than a simple civil-service path.",
      "The chart can grow through family business resources even when the outward image still looks traditional.",
      "If the structure is weak elsewhere, the same pattern may bring family money opportunities together with sharp conflict over control."
    ]
  },
  "ziwei-fumugong-konggong-sanfang": {
    lead: "An empty Parents Palace does not mean the parents story is blank. It means you have to borrow the answer from the surrounding structure, especially the supporting palaces and their transformations.",
    meaning: "This is a classic reminder not to read one palace in isolation. The parents line may be stable, pressured, distant, or highly supportive, but you only see that clearly after checking the three-direction structure around the empty palace.",
    method: "Begin with the empty Parents Palace, then read the opposite palace and the two supporting corners. Pay special attention to Hua Lu, Hua Quan, Hua Ke, and Hua Ji, because the real tone usually comes from those linked channels rather than from the empty palace itself.",
    examples: [
      "One chart may have no main star in the Parents Palace, yet strong supporting palaces clearly show educated, resourceful, or influential elders.",
      "Another chart can also be empty there, but the surrounding pressure reveals distance, instability, or a family line that is hard to depend on.",
      "The empty palace becomes readable only after the nearby structure tells you whether support flows in, leaks out, or turns into responsibility."
    ]
  },
  "ziwei-fuqigong-ziwei-fubi": {
    lead: "Zi Wei with assistant stars in the Spouse Palace often describes a partner with visible status, good conditions, or social polish, but the real question is who gets to use that prestige in daily life.",
    meaning: "This is a strong-partner pattern, not a guarantee of ease. The spouse may be capable, well-positioned, or respected, yet the relationship still depends on whether that strength supports the marriage, dominates it, or stays mostly on the partner's side of the table.",
    method: "Read the Spouse Palace with the Life Palace, Career Palace, and the household structure. Check whether the partner's resources actually land inside the relationship, and whether the native can stand beside that level of expectation without feeling diminished.",
    examples: [
      "A person may marry into better status or stronger networks, yet still feel pressure if the spouse is the clear center of gravity.",
      "The chart can also show a partner who opens doors and stabilizes the household when the rest of the structure is supportive.",
      "If the inner-life pattern is weak, admiration can slowly turn into comparison, resentment, or dependence."
    ]
  },
  "ziwei-fuqigong-liantan-luoxian": {
    lead: "Lian Zhen and Tan Lang in a weakened Spouse Palace often brings fast chemistry and visible attraction, but it also increases appetite, emotional complexity, and the chance that marriage amplifies unfinished issues.",
    meaning: "This pattern is strong at drawing people together, yet weaker at staying clean and simple. Desire, novelty, appearance, or emotional intensity may lead the story at first. Later, boundaries, habits, and loyalty pressure decide whether the relationship can actually hold.",
    method: "Start with the Spouse Palace, then read the Inner-Life Palace, the opposite palace, and any Hua Ji or timing pressure. Separate hot attraction from stable commitment before you decide whether the marriage pattern is merely exciting or actually sustainable.",
    examples: [
      "A couple can move very quickly because the attraction is obvious, then discover that money, trust, or private habits were never properly discussed.",
      "The pattern may also show a spouse who is charming and socially magnetic, but hard to keep inside simple relationship rules.",
      "When timing is rough, the same chemistry that creates the bond can also magnify jealousy, temptation, or repeated conflict."
    ]
  },
  "ziwei-hongluan-tianxi-erhun": {
    lead: "Hong Luan and Tian Xi can mark a relationship window, but some charts show the second wave of timing as more marriage-ready than the first one, especially after an earlier blockage or unfinished entanglement.",
    meaning: "These stars activate the subject of marriage; they do not force immediate completion. The first wave may bring a meeting, engagement talk, or emotional surge. The later wave can be the one that actually settles because the obstruction, hesitation, or old baggage has already passed.",
    method: "Read the relationship trigger first, then inspect Hua Ji, the active decade, and the Inner-Life Palace. Your job is to separate a first opening from the later window that is truly able to land as marriage.",
    examples: [
      "A person may meet the right type of partner early, but the first round still stalls because family pressure or old ties have not cleared.",
      "The second activation can look calmer, less dramatic, and far more real precisely because the earlier blockage already did its work.",
      "If the chart still has heavy emotional pressure, even a second window can repeat the first unless the underlying issue is addressed."
    ]
  },
  "ziwei-fudegong-hunyin-chengjie": {
    lead: "The Inner-Life Palace often decides whether a marriage can actually be sustained, because relationship timing means very little if the person's emotional carrying capacity is unstable.",
    meaning: "This palace is about private resilience, mood regulation, and what the person can continue holding after the excitement phase ends. A chart may have good relationship timing and still fail to keep the marriage if the inner structure is too tired, chaotic, or overloaded.",
    method: "Read the Inner-Life Palace with the Spouse Palace and timing. Do not ask only whether marriage appears. Ask whether the person can digest pressure, live with repetition, and keep the relationship steady once everyday reality starts weighing on it.",
    examples: [
      "A strong marriage window may still fail if the person enters it already exhausted, defensive, or emotionally overfull.",
      "Another chart may not look especially romantic, yet it succeeds because the inner structure is calm enough to hold ordinary life well.",
      "When the Inner-Life Palace is weak, love can be real and still collapse under routine stress, family demands, or private anxiety."
    ]
  },
  "ziwei-guanlugong-qingyang-dushu": {
    lead: "Qing Yang in the Career Palace often creates a hard year for titles and smooth politics, but it can be an excellent time to convert pressure into study, credentials, or sharper technical skill.",
    meaning: "The work path is not weak. It is simply more compatible with hard standards, teaching, training, specialist judgment, and difficult deliverables than with polished promotion games. In a rough cycle, learning is often the smartest form of career advance.",
    method: "Read the Career Palace with the Life, Wealth, and Travel palaces. Then ask whether the chart should keep fighting for position, or redirect the same effort into qualifications, instruction, and a stronger professional lane.",
    examples: [
      "A blocked promotion year can become valuable if the person uses it to earn a certification, degree, or technical specialty that changes the next cycle.",
      "Someone who struggles in consensus-heavy hierarchy may do much better in training, compliance, engineering, or any role where skill matters more than soft politics.",
      "If the chart insists on protecting status instead of building competence, the same hard energy can turn into burnout rather than momentum."
    ]
  },
  "ziwei-minggong-xiantian-budengyu-chengbai": {
    title: "Why the Life Palace Shows Your Starting Nature, Not Your Final Outcome",
    description: "A plain-English guide to reading the Life Palace as temperament and starting force first, then testing whether career, wealth, and outside support can turn that force into results.",
    lead: "The Life Palace is the chart's starting point, but it is not a one-box verdict on whether life will go smoothly or not.",
    meaning: "This topic separates personality from payoff. A strong Life Palace can mean clear instinct, strong reactions, and a powerful style, while the real-world result still depends on whether the career, wealth, and outside-world lines can carry that force into position and money.",
    method: "Read the Life Palace first, then compare the Career, Wealth, and Travel palaces. Ask what kind of person the chart describes before you ask where that person can actually turn strength into visible results.",
    examples: [
      "Someone can be decisive and forceful in the Life Palace while money and platform still arrive slowly.",
      "Another chart can look ordinary at the core, yet rise steadily once a strong role or outside platform takes over.",
      "A bright main star describes style and response first; outcome still needs support and timing."
    ]
  },
  "ziwei-minggong-putong-guanlu-qiang-fanshen": {
    title: "A Modest Life Palace with a Strong Career Palace: Why Position Can Lift the Chart",
    description: "Learn how to read charts where the Life Palace looks ordinary but the Career Palace carries the real rise through role, responsibility, and institutional position.",
    lead: "Some charts do not win by looking extraordinary at the center. They rise because the career line gives them a real seat, real duties, and a structure that can hold their effort.",
    meaning: "This is a position-first pattern. The person may not look flashy at the beginning, yet the Career Palace can steadily push them upward through title, mandate, and organizational fit.",
    method: "Start with the Life Palace to see the baseline, then move quickly to the Career Palace and the Wealth line. The real question is whether the chart becomes stronger once it enters a formal role, not whether it looked impressive before that role appeared.",
    examples: [
      "A person may look average when young, then become far more solid once they enter a structured profession.",
      "The chart can show rank, duty, and upward mobility before it shows obvious personal confidence.",
      "If the wealth line also supports it, position turns into stable income instead of empty pressure."
    ]
  },
  "ziwei-minggong-putong-qianyi-qiang-fapai": {
    title: "A Modest Life Palace with a Strong Travel Palace: Why Growth Happens Away From Home",
    description: "A plain-English explanation of charts that open up through movement, larger markets, and outside platforms rather than through the original environment.",
    lead: "Some people do not fully activate in the place where they start. Their chart grows once the outside world becomes the main stage.",
    meaning: "This pattern says the core self may look ordinary at first, but the Travel Palace can bring better timing, better visibility, and better support once the person steps into a bigger market, city, client base, or platform.",
    method: "Read the Life Palace first, then the Travel Palace, Career Palace, and Wealth Palace. Ask whether the chart is built to improve through movement, platform change, or public exposure rather than through staying put.",
    examples: [
      "A quiet chart at home can become far more capable after a move or company change.",
      "Outside clients or larger markets may matter more than hometown resources.",
      "If the core structure is weak, movement still helps, but the person needs enough stamina to hold the bigger stage."
    ]
  },
  "ziwei-minggong-kan-xingwei-bukan-jieguo": {
    title: "Read the Life Palace for Behavior First, Not for a Fixed Outcome",
    description: "Why the Life Palace should first be used to understand habits, reactions, and working style before anyone turns it into a final prediction.",
    lead: "A useful Life Palace reading starts with how the person behaves, not with a dramatic sentence about destiny.",
    meaning: "This topic is about reading order. The Life Palace tells you how the person moves, reacts, insists, hesitates, and uses effort. That is much more reliable than jumping straight to a verdict about whether life is good or bad.",
    method: "Use the Life Palace to identify the person's default style, then test where that style helps or hurts in the money, career, relationship, and travel lines. The answer comes from application, not from one label.",
    examples: [
      "The same assertive style can become leadership in one chart and conflict in another, depending on support.",
      "A softer chart can still win if its behavior fits the role and the platform around it.",
      "Behavior tells you how the person uses force; the surrounding palaces tell you where that force lands."
    ]
  },
  "ziwei-minggong-konggong-sanfang-budinghuai": {
    title: "An Empty Life Palace Is Not Automatically Weak: Read the Triad First",
    description: "A guide to reading an empty Life Palace by borrowing meaning from the opposite palace and the surrounding three-direction structure.",
    lead: "An empty Life Palace is not a blank life. It simply means the answer has to be borrowed from the surrounding structure instead of being handed to you by one obvious main star.",
    meaning: "This is a structural reading. The chart still has personality, drive, and direction, but those qualities are distributed through the opposite palace and the supporting triad rather than concentrated in the Life Palace itself.",
    method: "Start with the empty Life Palace, then read the opposite palace and the two supporting corners. Pay special attention to whether the surrounding palaces provide strength, pressure, or compensation, because that is where the real tone will come from.",
    examples: [
      "One empty Life Palace can still look strong because the supporting structure is bright and connected.",
      "Another empty Life Palace may feel unstable when the surrounding palaces all leak pressure instead of support.",
      "You only know whether the chart is easy or difficult after the borrowed structure is read in full."
    ]
  },
  "ziwei-liunian-xiankan-gongwei": {
    title: "In Annual Timing, Read the Activated Palace Before the Star",
    description: "Why annual readings should begin with the palace that is triggered, because the palace tells you whether the year is about money, role, movement, pressure, or relationships.",
    lead: "An annual reading becomes much clearer once you ask where the year lands before you ask which star is speaking.",
    meaning: "This topic keeps timing practical. The palace tells you the life area that moves first, while the star only tells you how that movement behaves. Without the palace, even a familiar star can be misread.",
    method: "Locate the annual palace first, then compare its opposite side and the supporting structure. Only after that should you interpret the star, the transformation, and the likely real-world form.",
    examples: [
      "If the year falls into the Wealth Palace, cash flow and income handling move before travel or romance.",
      "If the year falls into the Travel Palace, platform change and outside movement may matter more than staying still.",
      "The same annual star means different things once the palace changes."
    ]
  },
  "ziwei-liunian-caibo-xiankan-xianjinliu": {
    title: "Annual Timing in the Wealth Palace: Start with Cash Flow",
    description: "A practical annual-reading guide for years when the Wealth Palace is activated: begin with income, payment rhythm, and whether money can actually be retained.",
    lead: "When annual timing hits the Wealth Palace, the first question is not whether you become rich overnight. It is whether money starts moving, where it comes from, and whether it stays.",
    meaning: "This is a cash-flow reading. A Wealth-Palace year may bring revenue, billing, collection, opportunity, or resource pressure, but the chart still needs to show whether the money is direct, delayed, unstable, or tied to role and responsibility.",
    method: "Read the Wealth Palace first, then compare Career and Travel. Ask whether the year is about salary, clients, business turnover, outside platforms, or money that looks large on paper but is slow to collect.",
    examples: [
      "A busy revenue year can still be stressful if receipts are delayed or credit risk rises.",
      "Some people see more money only because work responsibility expands at the same time.",
      "A good wealth year is strongest when income source and retention both improve together."
    ]
  },
  "ziwei-liunian-qianyi-xiankan-pingtai-dongxiang": {
    title: "Annual Timing in the Travel Palace: Platforms, Movement, and Market Shifts",
    description: "How to read annual timing when the Travel Palace is activated, with focus on movement, outside opportunities, platform changes, and new markets.",
    lead: "A Travel-Palace year is not only about leaving town. It is usually about the outside world starting to matter more than the familiar setting.",
    meaning: "This kind of year can bring relocation, travel, public exposure, market expansion, new clients, or a stronger platform. The key is to separate useful movement from exhausting movement.",
    method: "Start with the Travel Palace, then compare Life and Career. Ask whether the year's movement creates a better stage, better support, or just more friction and cost.",
    examples: [
      "A bigger platform may open the chart more than staying in the old environment.",
      "Outside clients or a cross-region market can become the real source of growth.",
      "If the core structure is tired, even a good travel year can become overextension."
    ]
  },
  "ziwei-xiaoliunian-bengong-duigong-zhuizhu": {
    title: "Why Minor Annual Timing Starts with the Main and Opposite Palace",
    description: "A plain-English reading rule for minor annual timing: catch the main axis first, because the first reaction and the answering reaction usually appear together.",
    lead: "Minor annual timing is easiest to misread when people chase small details before they identify the main axis of the year.",
    meaning: "The main palace shows where the first movement lands, and the opposite palace shows what answers, resists, or supports it. That axis usually explains the year more clearly than scattered details do.",
    method: "Read the active palace first, then its opposite palace, and only then move into side details or auxiliary stars. That keeps the reading organized and prevents over-reading one small symbol.",
    examples: [
      "A money trigger may immediately reveal a work-pressure answer on the opposite side.",
      "A relationship issue can become clearer once you see the matching inner-pressure response.",
      "The year's main storyline usually sits on the first axis, not in the smallest side signal."
    ]
  },
  "ziwei-daxian-xiaoliunian-zhuci-fengong": {
    title: "Ten-Year Cycle vs Annual Trigger: Background First, Yearly Movement Second",
    description: "How to separate the ten-year cycle from the yearly trigger so you can tell long background from short-term rises and drops.",
    lead: "A chart becomes much easier to read when you stop asking the ten-year cycle and the annual trigger to do the same job.",
    meaning: "The major cycle sets the environment, pressure, and long trend. The annual trigger tells you what part of that environment moves this year. Mixing them together creates confusion about what is temporary and what is structural.",
    method: "Read the natal chart first, then the ten-year cycle, then the annual trigger. Ask what the long background allows, and only then decide what the current year is switching on inside that background.",
    examples: [
      "A strong year cannot fully rescue a weak decade, but it can create one good opening inside it.",
      "A rough year inside a good decade may be a dip, not a total reversal.",
      "The decade gives the field; the year shows where the ball is moving now."
    ]
  },
  "ziwei-benminghao-xiancuo-bandi": {
    title: "A Good Natal Chart Can Still Stumble in the Wrong Phase",
    description: "Why a strong natal base does not guarantee easy timing, and why a chart can still lose momentum if the active cycle cuts across its strengths.",
    lead: "A good natal chart is a strong starting base, not permanent immunity from bad timing.",
    meaning: "This topic separates baseline quality from phase quality. The person may have good structure, talent, or potential, yet still enter a period that blocks the wrong line, delays the payoff, or pushes them into a role that does not match the chart well.",
    method: "Read the natal pattern first, then check whether the current decade and annual trigger support it or push against it. The key is to see whether timing is carrying the person's strength or asking them to fight uphill.",
    examples: [
      "A capable person can still lose ground when the active cycle blocks the exact palace they depend on most.",
      "Good structure often survives a rough phase, but not without cost or delay.",
      "You should read timing as friction against the base, not as proof that the base never mattered."
    ]
  },
  "ziwei-benmingputong-xianyun-fanshen-jiezou": {
    title: "A Modest Natal Chart Can Rise in the Right Cycle",
    description: "How the right decade and annual trigger can lift an ordinary natal chart by activating the exact role, platform, or money line it needs.",
    lead: "A natal chart does not have to look grand from the start to rise later. Sometimes the real lift arrives when timing finally turns on the right line.",
    meaning: "This is a timing-lift pattern. The base may look ordinary, but once the decade or the year activates the correct palace, the person's opportunities, platform, and results can improve very quickly.",
    method: "Read the natal chart honestly first, then look for the decade and annual trigger that strengthen Career, Wealth, Travel, or another key line. The point is not to inflate the natal chart, but to see where timing creates the breakthrough.",
    examples: [
      "A person may appear average early on, then rise once the right role or market opens during a strong cycle.",
      "The good phase can bring position, support, and visibility that the natal chart could not produce by itself.",
      "Timing does not erase the base, but it can give the base the exact opening it was missing."
    ]
  },
  "ziwei-geju-xiankan-liangdu-zai-kan-gecheng": {
    title: "Named Patterns Must Be Bright Enough to Count",
    description: "A guide to judging famous Zi Wei Dou Shu patterns by brightness and working strength first, instead of by name alone.",
    lead: "A pattern name sounds impressive, but it only becomes real when the stars are bright enough and the structure is strong enough to work.",
    meaning: "This topic is about chart discipline. A famous pattern should not be granted just because the pieces are present. Brightness, support, and correct placement decide whether the pattern is fully alive or only loosely similar.",
    method: "Confirm the structure, then test brightness, support, and palace position. Only after those conditions pass should you decide whether the pattern deserves the name and the larger interpretation.",
    examples: [
      "A chart can contain the right stars and still fail to produce the real pattern because brightness is too weak.",
      "Another chart may not use the famous label often, yet it works strongly because the structure is complete.",
      "The name should come after the strength test, not before it."
    ]
  },
  "ziwei-geju-cha-yige-buyao-yingduan": {
    title: "When a Pattern Is One Step Short, Do Not Force a Grand Reading",
    description: "Why Zi Wei Dou Shu pattern reading should stay honest when one key condition is missing and the chart does not fully qualify.",
    lead: "If a pattern is one step short, the right move is restraint, not enthusiasm.",
    meaning: "This topic protects the reading from overstatement. A near-match can still show talent or possibility, but it should not be sold as a full pattern with all the status, wealth, or authority that belongs to the complete form.",
    method: "Check each condition one by one. If one key piece is missing, keep the reading at the level the chart actually supports and explain what is present without borrowing what is absent.",
    examples: [
      "A chart can resemble a famous wealth pattern without having the full brightness or support needed to deliver the same results.",
      "Calling a near-match complete often leads to inflated expectations and bad judgment.",
      "It is better to name the partial strength clearly than to force a grand label."
    ]
  },
  "ziwei-geju-luogong-bianren-bianji": {
    title: "The Same Pattern Changes Meaning When It Lands in Different Palaces",
    description: "Why a named pattern cannot be read with one sentence everywhere, because palace placement changes whether it describes the self, family, peers, resources, or position.",
    lead: "A famous pattern does not belong to one life area forever. Once the palace changes, the person, event, and practical meaning can all change with it.",
    meaning: "This is a palace-boundary lesson. The pattern may still be real, but its outlet changes: in one palace it describes the native, in another it describes siblings, parents, work, money, or another line of life.",
    method: "Confirm the pattern first, then ask where it lands. Let the palace decide who receives the effect, what kind of event it becomes, and how directly it touches the person.",
    examples: [
      "A pattern in the Life Palace can describe the person directly, while the same structure in the Parents Palace belongs first to the family line.",
      "In the Wealth Palace, the same pattern may describe money channel or resource scale instead of personality.",
      "The pattern name stays the same, but the real-life story changes with the palace."
    ]
  },
  "ziwei-rizhao-leimen-bairi-xingye": {
    title: "Ri Zhao Lei Men: Why It Fits Daytime and Public-Facing Work",
    description: "A plain-English explanation of why the Ri Zhao Lei Men pattern works best when visibility, daytime rhythm, and outward-facing roles are all aligned.",
    lead: "This pattern is not only about having a bright label. It works best when the life path itself belongs to visible, daytime, or public-facing activity.",
    meaning: "The structure favors outward brightness, action, and visible function. That is why the best results often appear in work that uses exposure, audience, public contact, or daylight rhythm rather than hidden or closed settings.",
    method: "Confirm that the pattern really forms, then compare Career, Travel, and timing. Ask whether the chart is being used in the kind of role that lets brightness show, instead of burying it in the wrong environment.",
    examples: [
      "A chart may perform better in daytime business, management, or visible service roles than in private or nocturnal work.",
      "The same pattern can weaken when the career lane hides the person's strongest outward qualities.",
      "Brightness only turns into results when role and rhythm match the pattern."
    ]
  },
  "ziwei-yuelang-tianmen-yewan-xingye": {
    title: "Yue Lang Tian Men: Why It Works Better in Night, Quiet, or Backstage Settings",
    description: "How to read the Yue Lang Tian Men pattern through timing, mood, and work setting rather than by phrase alone.",
    lead: "This pattern often does best when the environment is quiet, controlled, reflective, or naturally stronger at night than in harsh public daylight.",
    meaning: "The chart favors lunar rhythm, softer expression, and settings that reward refinement, care, or backstage function. The useful question is whether the role allows that quality to work in its proper atmosphere.",
    method: "Confirm the pattern, then read Career, Travel, and the real working environment. Ask whether the chart is placed in a lane that values subtlety, timing, and steady delivery instead of forcing aggressive exposure.",
    examples: [
      "The same person may do better in night-oriented, advisory, or backstage roles than in loud front-stage competition.",
      "A softer work rhythm can produce better results than pushing for constant visible dominance.",
      "The pattern works best when the environment matches the chart's quieter light."
    ]
  },
  "ziwei-cai-zai-guanlu-bushi-zhenfazhi": {
    title: "Money in the Career Palace Is Not the Same as Money in Your Pocket",
    description: "Why money shown in the Career Palace often points to budget authority, scale, and role responsibility before it points to direct personal wealth.",
    lead: "A chart can place money in the Career Palace and still leave the person living on a normal pay structure, because control and ownership are not the same thing.",
    meaning: "This is a resource-authority pattern. The person may handle large budgets, financial decisions, or operating money through a role, yet that does not automatically mean the money belongs to them personally.",
    method: "Read Career, Wealth, and Life together. Ask whether the money belongs to the job, the institution, the project, or the person, and whether the chart turns responsibility into actual take-home gain.",
    examples: [
      "A finance lead or business operator may move large sums without personally owning them.",
      "The chart can show trust, approval power, and scale long before it shows private accumulation.",
      "Only when the wealth line also supports direct intake does role-based money become personal money."
    ]
  },
  "ziwei-cai-zai-qianyi-bushi-lixian-ershi-pingtai": {
    title: "Money in the Travel Palace Means Outside Platforms, Not Automatic Relocation Wealth",
    description: "How to read money in the Travel Palace as market expansion, outside clients, and platform change rather than as a simplistic promise that leaving home equals wealth.",
    lead: "The Travel Palace can bring money, but usually because the outside world becomes the income channel, not because movement itself is magical.",
    meaning: "This pattern often points to revenue through new markets, cross-region business, remote work, travel, public exposure, or a platform beyond the native's original base. The focus should be on channel and stage, not on travel alone.",
    method: "Read Travel with Wealth and Career. Ask what outside channel is opening, how far the person must move to use it, and whether the new platform creates more gain than cost.",
    examples: [
      "Income may improve through a new city, foreign market, online channel, or outside client base.",
      "A move without a stronger platform may add cost without adding enough return.",
      "The money comes from the outside channel, not from motion for its own sake."
    ]
  },
  "ziwei-xiantiancai-houtiancai-zhichangcai-fenka": {
    title: "How to Separate Inherited Wealth, Earned Wealth, and Position-Based Money",
    description: "A plain-English guide to splitting money readings into family-base wealth, later-built wealth, and money that sits in the role rather than in the person.",
    lead: "Not all money in a chart belongs to the same source. Family base, later-earned money, and role-based money should not be collapsed into one sentence.",
    meaning: "This topic separates money channels clearly. Some charts are helped by family resources, some by their own later effort, and some by a role that gives them access to money without direct ownership.",
    method: "Read Parents, Wealth, Career, and Travel together. Ask whether the money starts from inheritance, from personal earning power, from outside expansion, or from institutional responsibility.",
    examples: [
      "A person may inherit habits, contacts, or capital without inheriting a finished fortune.",
      "Another chart may build wealth late through platform and role rather than through early family support.",
      "Career-based money can look impressive while still remaining separate from private assets."
    ]
  },
  "ziwei-zhangcaiquan-budengyu-ziji-youqian": {
    title: "Managing Money Is Not the Same as Owning It",
    description: "Why charts that show financial control or budget authority should not be mistaken for charts of direct personal wealth.",
    lead: "A person can hold the money keys without holding the money itself.",
    meaning: "This pattern points to stewardship, approval power, or resource management. The chart may show trust and scale, but that is different from private accumulation, personal freedom, or liquid cash in hand.",
    method: "Compare the Career Palace, Wealth Palace, and Life Palace. Ask whether the chart shows money ownership, money handling, or simply the burden of making financial decisions for other people or institutions.",
    examples: [
      "A manager can decide large budgets while still living inside a fixed salary structure.",
      "Some charts control resources for a company, not for the self.",
      "If the wealth line is weak, authority over money may bring stress faster than prosperity."
    ]
  },
  "ziwei-taiyang-caibo-jingying-he-mianzi": {
    title: "Tai Yang in the Wealth Palace: Business Income, Visibility, and Boss Money",
    description: "How to read Tai Yang in the Wealth Palace as outward money, operating money, and income linked to visibility, management, or public-facing work.",
    lead: "Tai Yang in the Wealth Palace usually wants money to move in the open, through business, visibility, or the kind of work that carries a public face.",
    meaning: "This pattern leans toward operating income, boss-level money handling, and earnings tied to exposure, leadership, or direct public function. It is less about quiet accumulation and more about outward motion.",
    method: "Read Tai Yang with Career and Travel. Ask whether the income comes through management, selling, operating, brand presence, or a role that depends on being seen and trusted in public.",
    examples: [
      "A person may make money through business operation, client-facing work, or management responsibility.",
      "The chart often handles visible money better than hidden or purely passive money.",
      "If support is weak, the image of scale can exceed the actual retained profit."
    ]
  },
  "ziwei-taiyin-caibo-guding-xinshui-he-shoucai": {
    title: "Tai Yin in the Wealth Palace: Stable Pay, Saving Power, and Rhythm",
    description: "A practical reading of Tai Yin in the Wealth Palace, with focus on steady income, money retention, caution, and sustainable financial rhythm.",
    lead: "Tai Yin in the Wealth Palace often works best through steadier income, stronger retention, and a rhythm that values control over noisy expansion.",
    meaning: "This pattern is good at holding, counting, and pacing money. It often prefers predictable income, stable salary, long-term planning, and careful retention over highly aggressive financial moves.",
    method: "Read Tai Yin with the Wealth Palace first, then compare Career and inner-life pressure. Ask whether the chart builds best through regular income, financial discipline, or a calmer tempo that protects savings.",
    examples: [
      "Stable salary or repeatable income can outperform speculative opportunity here.",
      "The chart often values safety, retention, and rhythm more than flashy jumps.",
      "If pressure is high, worry about money can rise even when income is objectively steady."
    ]
  },
  "ziwei-wuqu-caixingwang-jieguo-daoxiang": {
    title: "Why Wu Qu Is Both a Wealth Star and a Results Star",
    description: "How to read Wu Qu not only as money, but also as execution, accounting, responsibility, and the ability to turn effort into hard outcomes.",
    lead: "Wu Qu is called a wealth star, but it is just as much a results star because it likes measurable output and practical burden-bearing.",
    meaning: "This pattern is about money with structure. Wu Qu tends to count, allocate, execute, and carry weight. That is why it often shows both financial sense and strong result orientation.",
    method: "Read Wu Qu through its palace, then compare Wealth and Career. Ask whether the chart is producing direct income, hard execution, budget control, or the kind of work where measurable results matter most.",
    examples: [
      "A Wu Qu chart can be good at making money because it is also good at carrying responsibility.",
      "The same placement may show strict execution even before it shows obvious wealth.",
      "When support is weak, the results pressure can become harsh or joyless instead of simply effective."
    ]
  },
  "ziwei-huaquan-xianying-zeren-buzhishiquan": {
    title: "Hua Quan Often Arrives as Responsibility Before Power",
    description: "A plain-English reading of Hua Quan that puts responsibility, mandate, and pressure ahead of fantasy about effortless authority.",
    lead: "Hua Quan often shows up first as the duty to decide, carry, and answer for outcomes, not as free power without cost.",
    meaning: "This transformation adds control, but it also adds burden. The chart may gain rank, say, or leadership function, yet the real-life form is usually more responsibility before it feels like more comfort.",
    method: "Locate Hua Quan first, then compare Career, Life, and Wealth. Ask where authority lands, what burden comes with it, and whether the chart has enough support to carry that extra weight well.",
    examples: [
      "A promotion can increase decision power and stress at the same time.",
      "Some charts receive responsibility before title, and title before money.",
      "Without support, Hua Quan can create isolation, control pressure, or overwork."
    ]
  },
  "ziwei-huake-xianying-zhuanye-kaozheng": {
    title: "Hua Ke First Shows Up as Skill, Reputation, and Credentials",
    description: "How to read Hua Ke in everyday terms: exams, licenses, professional trust, and public recognition often arrive before direct money or rank.",
    lead: "Hua Ke is often easiest to see in the form of proof, polish, credibility, and specialist reputation.",
    meaning: "This transformation favors recognition through skill. It can show credentials, teaching ability, public trust, or a lane where the person's name carries weight because competence is visible.",
    method: "Find where Hua Ke lands, then compare Life, Wealth, and Career. Ask whether the chart is being asked to build reputation, pass a gate, teach, advise, or become known for a specific strength.",
    examples: [
      "A good Hua Ke year may be excellent for exams, certification, or getting trusted by better clients.",
      "The chart can win through credibility even before income catches up.",
      "If the wealth line is weak, reputation may rise faster than cash."
    ]
  },
  "ziwei-hualu-xiankan-ziyuan-rukou": {
    title: "Hua Lu Should Be Read by Where Resources Enter",
    description: "A practical guide to Hua Lu that focuses on channel and entry point: where do support, money, and usable resources actually come in?",
    lead: "Hua Lu is not a vague blessing word. It is a resource-entry marker, and the palace tells you where the opening is.",
    meaning: "This transformation usually shows gain, support, or smoother flow, but the useful reading depends on whether that flow enters through family, role, outside markets, partnership, or direct income skill.",
    method: "Locate Hua Lu first, then read the palace boundary carefully. Ask what kind of resource is arriving, who is carrying it, and whether it improves the person's actual situation or simply decorates the chart language.",
    examples: [
      "Hua Lu in the Travel Palace may mean outside markets or clients open up.",
      "Hua Lu in the Parents Palace can mean family support, background, or inherited channels.",
      "The same Hua Lu feels very different depending on where the gain enters."
    ]
  },
  "ziwei-huaji-xiankan-kadian-bukan-xiongji": {
    title: "Hua Ji Should Be Read as the Bottleneck, Not a Blanket Doom Label",
    description: "Why Hua Ji works best as a chart-reading tool for friction, blockage, and cost rather than as a dramatic one-word judgment.",
    lead: "Hua Ji becomes much more useful once you stop reading it as simple doom and start reading it as the chart's bottleneck.",
    meaning: "This transformation marks the place where flow catches, repeats, or grows costly. It can show mental friction, cash delay, relationship blockage, or structural pressure, but the palace decides what kind of bottleneck it is.",
    method: "Locate Hua Ji, then compare the opposite palace and timing. Ask what gets stuck, what keeps repeating, and what boundary, process, or risk-control move would reduce the damage.",
    examples: [
      "A wealth bottleneck can show up as delayed collection, debt pressure, or cash retention trouble.",
      "A relationship bottleneck may be repeated arguments, emotional loops, or unresolved history.",
      "Hua Ji is easiest to use when you name the stuck point clearly instead of scaring the whole chart."
    ]
  },
  "ziwei-tanlang-liunian-caise-yingchou": {
    title: "Tan Lang in Annual Timing: Money, Social Appetite, and Attraction Rise Together",
    description: "How to read Tan Lang in annual timing when money opportunities, social activity, appetite, and attraction all expand at the same time.",
    lead: "A Tan Lang year often makes life more lively, more social, and more tempting all at once.",
    meaning: "This kind of year can increase earning opportunities, networking, pleasure, appetite, and attraction. The same opening that brings money can also bring distraction, over-socializing, or blurred boundaries.",
    method: "Read the activated palace first, then ask how Tan Lang is expressing itself there. The key is to separate useful expansion from indulgence, and business opportunity from emotional or social spillover.",
    examples: [
      "A busier social year can also become a better sales or client year.",
      "Attraction and money may rise together, which is helpful only if boundaries stay clear.",
      "If the chart is already unstable, extra appetite can quickly turn into cost."
    ]
  },
  "ziwei-qishapojun-liunian-benbo-laohao": {
    title: "Qi Sha and Po Jun in Annual Timing: Effort, Movement, and Wear Come First",
    description: "A practical annual-reading guide for Qi Sha and Po Jun years, where pressure, movement, rework, and cost often appear before visible reward.",
    lead: "A Qi Sha or Po Jun year often feels active long before it feels easy.",
    meaning: "This timing tends to push action, change, disruption, and expenditure of force. The person may get more done or move faster, but the cost in effort, instability, and wear usually appears first.",
    method: "Read the active palace, then compare Career, Travel, and Health pressure. Ask what must be cut, rebuilt, or carried, and whether the year's movement creates meaningful progress or only rough expenditure.",
    examples: [
      "A year of restructuring can create future value while still feeling exhausting in the moment.",
      "Travel, role change, or heavy execution may be necessary even without immediate comfort.",
      "The chart often asks for stamina and judgment before it offers clean reward."
    ]
  }
  };
  return englishOverrides[article.slug] || null;
}

function englishLead(article, title) {
  const override = englishOverrideFor(article);
  if (override?.lead) return override.lead;
  if (article.title.includes("只有化科")) return "When Hua Ke is the only major transformation carrying a chart, the person often advances through credentials, teaching, and reputation before money or rank catch up.";
  if (article.title.includes("父母宫廉贞破军")) return "Lian Zhen and Po Jun in the Parents Palace usually describe a family line that is hard, changeable, or emotionally discontinuous rather than soft and steady.";
  if (article.title.includes("官禄宫擎羊")) return "Qing Yang in the Career Palace often creates a role with friction, sharp standards, and direct pressure, which is why it can suit technical or teaching work better than smooth official ladders.";
  if (article.title.includes("红鸾天喜为什么要过忌")) return "Hong Luan and Tian Xi can light up relationship timing, but a marriage window often needs to pass a blockage first instead of rushing at the first emotional peak.";
  if (article.title.includes("迁移宫化禄")) return "Hua Lu in the Travel Palace often means the chart opens through outside markets, bigger platforms, and movement rather than staying in one familiar setting.";
  if (article.title.includes("官禄宫空宫")) return "An empty Career Palace does not mean no career. It usually means the role has to be read through the surrounding structure rather than through one obvious official label.";
  if (article.title.includes("紫微七杀在父母宫")) return "Zi Wei and Qi Sha in the Parents Palace usually describe strong rank, discipline, or command in the older generation before they describe the native directly.";
  if (article.title.includes("府相会命")) return "Fu Xiang Meeting the Life Palace often works best as a strong number-two pattern: steady, reliable, system-minded, and effective inside an existing structure.";
  if (article.title.includes("大限走疾厄宫")) return "When a ten-year cycle lands in the Health Palace, the body's carrying capacity becomes part of every major decision, even if the outside world still looks active.";
  if (article.title.includes("男命太阴化忌")) return "Tai Yin with Hua Ji in a man's chart often turns marriage into a home-and-family systems question, not just a romance question.";
  if (article.title.includes("财权")) return "This topic is about resource control rather than direct ownership: the chart can show who handles the money without showing that the money belongs to them.";
  if (article.title.includes("福德宫") && article.title.includes("紫微")) return "Zi Wei in the inner-life area often shows high standards, strong self-direction, and a private pressure to keep holding everything together.";
  if (article.title.includes("右弼") && article.title.includes("福德")) return "A support star in the inner-life area can still feel lonely if the person has to process stress alone behind a calm surface.";
  if (article.title.includes("雄宿朝元")) return "This pattern only works when the structure is right; once it forms, it can push a chart toward military-style authority or serious business leadership.";
  if (article.title.includes("巨日格")) return "Ju Men and Tai Yang can turn speech, visibility, and judgment into scale, but only when both parts of the pattern are actually bright enough to work.";
  if (article.title.includes("七杀朝斗")) return "Qi Sha Facing the Dipper does not lose its value outside the Life Palace; it simply changes its real-life outlet from identity to position or resource control.";
  if (article.title.includes("明珠出海")) return "A famous pattern does not have to sit in the Life Palace to matter; when it lands elsewhere, it lights up that family line or life area first.";
  if (article.title.includes("六煞单星独守")) return "A lone malefic star is rarely a one-point problem. In practice, the main palace takes the hit first, then the opposite side of the chart starts reacting too.";
  if (article.title.includes("迁移宫")) return "Some charts do not fully open in the original environment. The travel and outside-world palace can be the place where status, support, and opportunity finally connect.";
  if (article.title.includes("入正位")) return "Zi Wei Dou Shu becomes much clearer when you ask whether a star is in the life area it is actually built to express.";
  const hubDefaults = englishHubDefaults(article);
  if (hubDefaults?.lead) return `${hubDefaults.lead} In "${title}", the key question is ${englishFocusArea(article)}.`;
  return `For "${title}", start by locating the palace boundary, then ask what role, pressure, or opening it creates in real life.`;
}

function englishMeaning(article) {
  const override = englishOverrideFor(article);
  if (override?.meaning) return override.meaning;
  if (article.title.includes("只有化科")) return "This is a skills-first pattern. It favors licensed work, specialist service, teaching, and professional trust more than fast speculation or pure authority.";
  if (article.title.includes("父母宫廉贞破军")) return "Read this as structure in the parents line: distance, separation, strict rules, or early pressure to grow up. It can describe absence, instability, or a home that matures the person too early.";
  if (article.title.includes("官禄宫擎羊")) return "The chart is not weak in work. It is simply bad at soft politics. This pattern prefers skill, rule enforcement, training, or hard deliverables over consensus-heavy promotion paths.";
  if (article.title.includes("红鸾天喜为什么要过忌")) return "These stars show activation, not automatic completion. Attraction can appear early, while marriage waits until the blocking factor, pressure cycle, or emotional tangle has actually cleared.";
  if (article.title.includes("迁移宫化禄")) return "This is an external-resource pattern. Money, clients, support, or reputation arrive from the wider world: another city, another platform, another market, or another network.";
  if (article.title.includes("官禄宫空宫")) return "This kind of chart may not lean toward formal rank, but it can still hold real responsibility in business, management, or project-based work once the supporting palaces are strong.";
  if (article.title.includes("紫微七杀在父母宫")) return "Read this first as the tone of the family line: a military, police, managerial, or highly demanding parent figure, plus the pressure that comes with that structure.";
  if (article.title.includes("府相会命")) return "This is not a weak chart. It is a coordination chart. It tends to excel at support, operations, executive partnership, and structure more than at chaotic solo conquest.";
  if (article.title.includes("大限走疾厄宫")) return "Do not reduce this to illness only. It can show stress load, recovery limits, old conditions, burnout, or a decade where physical maintenance decides what the person can keep building.";
  if (article.title.includes("男命太阴化忌")) return "This pattern commonly points to mother-wife tension, blurred boundaries inside the home, early marriage pressure, or a spouse who enters a family field that is already emotionally loaded.";
  if (article.title.includes("入正位")) return "A star does not keep the same practical meaning everywhere. The palace tells you whether the topic is role, money, partnership, pressure, family, or the outside world.";
  if (article.title.includes("财权")) return "This pattern often points to approval power, stewardship, or institutional responsibility. It is about scale and access, not necessarily personal net worth.";
  if (article.title.includes("福德宫") || article.title.includes("右弼")) return "Inner-life patterns should be read as mindset, emotional carrying capacity, and how much pressure a person quietly processes alone.";
  if (article.title.includes("雄宿朝元")) return "The useful question is not whether the name sounds grand, but whether the chart really supports authority, leadership, and the ability to hold that pressure.";
  if (article.title.includes("巨日格")) return "Speech patterns matter only when the wider structure can turn expression into trust, business, visibility, or influence.";
  if (article.title.includes("七杀朝斗")) return "A classic pattern changes meaning by palace. In one area it can show command and hard decisions; in another it can show large resources that still need careful handling.";
  if (article.title.includes("明珠出海")) return "A chart pattern is a structure, not a single fixed sentence. Once the structure forms, the palace tells you who or what gets the benefit first.";
  if (article.title.includes("六煞")) return "Malefic stars are not just about fear. They show where stress enters and how one problem can spill into the opposite side of the chart.";
  if (article.title.includes("迁移宫")) return "The travel palace also means platforms, markets, and life outside the familiar setting. That is why some charts grow only after movement or relocation.";
  const hubDefaults = englishHubDefaults(article);
  if (hubDefaults?.meaning) return `${hubDefaults.meaning} For "${englishTitle(article)}," keep the focus on ${englishFocusArea(article)}.`;
  return `In "${englishTitle(article)}," name the life area first, then connect the pattern to practical choices instead of treating one symbol as a fixed prediction.`;
}

function englishMethod(article) {
  const override = englishOverrideFor(article);
  if (override?.method) return override.method;
  if (article.title.includes("只有化科")) return "Check where Hua Ke lands, then compare the Life, Wealth, and Career palaces. The question is not whether the person gets rich fast, but how skill, proof, and reputation turn into income.";
  if (article.title.includes("父母宫廉贞破军")) return "Start with the Parents Palace, then compare the Sun and Moon lines, the Life Palace, and the Inner-Life Palace. Separate physical separation from emotional distance before you judge the family story.";
  if (article.title.includes("官禄宫擎羊")) return "Read the Career Palace with the Life, Wealth, and Travel palaces. Ask whether the chart should fight for title, or convert pressure into expertise, instruction, and a clearer lane.";
  if (article.title.includes("红鸾天喜为什么要过忌")) return "Check the relationship trigger first, then inspect Hua Ji, the Inner-Life Palace, and the active decade. Separate a strong encounter from a stable marriage window.";
  if (article.title.includes("迁移宫化禄")) return "Read the Travel Palace with Wealth and Career. Then ask whether the chart is built for fixed salary, outside clients, relocation, or platform expansion.";
  if (article.title.includes("官禄宫空宫")) return "Borrow the Career reading from the Life, Wealth, and Travel palaces. Look for who the person is, how money enters, and where the platform sits before judging position.";
  if (article.title.includes("紫微七杀在父母宫")) return "Keep the palace boundary clear. Start with the parents line, then see how much of that authority pattern is internalized by the Life Palace and sustained by the Inner-Life Palace.";
  if (article.title.includes("府相会命")) return "Check whether power, reputation, or resources also meet the pattern. If they do not, read for trusted salaried roles, private-enterprise management, or second-in-command strength.";
  if (article.title.includes("大限走疾厄宫")) return "Read the Health Palace with the opposite palace, the Life Palace, and work pressure. The right question is not whether this is a bad decade, but what cost the body is already paying.";
  if (article.title.includes("男命太阴化忌")) return "Read Tai Yin with the Parents Palace, partnership timing, and the inner home structure. Check whether the marriage is being asked to carry problems that began before the couple formed.";
  if (article.title.includes("财权")) return "Read the career palace, the wealth palace, and the core identity together. Then ask whether the chart points to owning wealth, managing it, or carrying responsibility around it.";
  if (article.title.includes("福德宫") || article.title.includes("右弼")) return "Read the inner-life area with the Life Palace, relationship palaces, and timing. This shows whether the pressure stays private or starts changing how the person works and relates.";
  if (article.title.includes("雄宿朝元")) return "Check the formation first, then test whether wealth, career, and timing actually support the pattern. A famous label is not enough on its own.";
  if (article.title.includes("巨日格")) return "Judge brightness first, then read market, career, and money support. A talking pattern without structure becomes noise instead of leverage.";
  if (article.title.includes("七杀朝斗")) return "Start with the palace where the pattern lands, then read the opposite palace and the wider structure. That is how you separate rank, duty, and resource scale from simple good-luck language.";
  if (article.title.includes("明珠出海")) return "Confirm the pattern, identify the palace it activates, then decide whether the effect belongs to the person, the family line, the children, or only a limited time period.";
  if (article.title.includes("六煞")) return "Read the main palace first, then the opposite palace, then timing. Lone malefics become much clearer when you track where the first pressure lands and where the second reaction follows.";
  if (article.title.includes("迁移宫")) return "Do not read movement as travel only. Compare the outside-world palace with the Life Palace and Career Palace to see whether a bigger stage strengthens the chart or simply adds stress.";
  if (article.title.includes("入正位")) return "Do not judge one star alone. Ask whether it is in the palace that matches its function, then test whether the surrounding palaces support that reading in real life.";
  const hubDefaults = englishHubDefaults(article);
  if (hubDefaults?.method) return `${hubDefaults.method} In this topic, keep checking ${englishFocusArea(article)} before you name the outcome.`;
  return `For "${englishTitle(article)}," do not judge one star or one palace alone. Look at the main palace, the opposite palace, and the surrounding structure before you name the outcome.`;
}

function englishPracticalOrder(article, title = "") {
  const topic = article.title || title;
  const timing = topic.includes("流年")
    ? "the active annual trigger"
    : topic.includes("大运") || topic.includes("大限")
      ? "the active ten-year cycle"
      : "the main palace named in the topic";
  let emphasis = "how the structure turns into a real-life result";
  if (topic.includes("疾厄")) emphasis = "which body line is taking the pressure first and whether it repeats";
  else if (topic.includes("夫妻") || topic.includes("婚")) emphasis = "relationship timing, pressure, and whether the chart can actually hold the bond";
  else if (topic.includes("财帛") || topic.includes("财")) emphasis = "income source, cash retention, and who truly controls the money";
  else if (topic.includes("官禄")) emphasis = "role, responsibility, and how the career line cashes out";
  else if (topic.includes("父母") || topic.includes("兄弟")) emphasis = "whether the pattern belongs to relatives, shared resources, or the native directly";
  else if (topic.includes("田宅")) emphasis = "asset structure, domestic risk, and who is carrying the burden";
  return `For a topic like "${title || englishTitle(article)}," start with ${timing}, then compare the opposite palace and the supporting structure. Finish by testing ${emphasis} so the reading stays concrete instead of drifting into a fixed label.`;
}

function englishFocusArea(article) {
  const topic = article.title || "";
  if (topic.includes("疾厄")) return "which body line is weak, how the pressure repeats, and whether the issue is congenital or triggered later";
  if (topic.includes("夫妻") || topic.includes("婚")) return "timing, bond quality, and whether the chart can really carry the relationship";
  if (topic.includes("财帛") || topic.includes("财")) return "where money enters, who controls it, and whether it can actually stay";
  if (topic.includes("官禄")) return "position, responsibility, and whether the work lane fits the chart's structure";
  if (topic.includes("田宅")) return "asset structure, domestic risk, and who is carrying the home line";
  if (topic.includes("父母") || topic.includes("兄弟")) return "whether the pattern belongs to relatives, shared resources, or the native directly";
  if (topic.includes("流年") || topic.includes("大运") || topic.includes("大限")) return "what belongs to the natal structure and what belongs only to timing";
  return "the palace boundary, the supporting structure, and the real-life outlet of the pattern";
}

function englishHubDefaults(article) {
  switch (topicHubFor(article).key) {
    case "learning":
      return {
        lead: "Read this topic as a chart-reading method first: define the question, identify the palace, and only then decide what the symbols are actually saying.",
        meaning: "Method articles are about reading order. They keep the chart concrete by separating the life area, the supporting structure, and the trigger that turns a possibility into a real event.",
        method: "Start with the main palace, then the opposite palace, then the triad or timing layer that completes the picture. That order prevents overreading one star or one phrase."
      };
    case "palaces":
      return {
        lead: "This topic makes sense only after the palace boundary is clear. The palace tells you where the pressure lands before the stars tell you how it behaves.",
        meaning: "Palace-based readings are about life area first: family, money, partnership, career, health, or the outside world. The same star changes meaning once the palace changes.",
        method: "Anchor the reading in the palace, compare the opposite palace, then test whether the surrounding structure supports, delays, or redirects the result."
      };
    case "transformations":
      return {
        lead: "A transformation star is never just a label. It shows where reputation, authority, resources, or blockage become active in a specific life area.",
        meaning: "These topics are best read as moving forces, not personality tags. The practical question is where the change lands and whether it opens a path, adds responsibility, or creates friction.",
        method: "Locate the transformation star first, then compare life, wealth, career, and timing so you can separate symbolic activation from real-world payoff."
      };
    case "main-stars":
      return {
        lead: "A main star only becomes useful when the palace and the surrounding structure tell you what role it is actually performing in real life.",
        meaning: "Main-star articles are about applied function: status, discipline, support, appetite, pressure, or execution. The star gives the tone, but the palace decides where that tone shows up.",
        method: "Read the main star with its palace, the opposite palace, and the money-or-career line that carries it into lived results."
      };
    case "helper-malice":
      return {
        lead: "Support stars and malefics rarely act alone. They usually change the pace, cost, or social texture of a palace that already has a main theme.",
        meaning: "These patterns are less about instant good or bad luck and more about how help, strain, delay, conflict, or speed enters an existing structure.",
        method: "Name the base palace first, then ask whether the added star brings assistance, volatility, timing pressure, or a higher cost of execution."
      };
    case "case-patterns":
      return {
        lead: "A named pattern is only worth using after you confirm that the structure really forms. The label comes last, not first.",
        meaning: "Pattern articles separate a famous phrase from its working conditions. A chart earns the pattern only when brightness, palace position, and support all line up.",
        method: "Confirm the structure, test whether the palace placement is strong enough, then decide whether the pattern becomes wealth, authority, relationship strain, or just partial resemblance."
      };
    case "cycles":
      return {
        lead: "Timing topics work best when you separate the natal base from the temporary window that is currently switched on.",
        meaning: "A strong cycle can lift a modest chart, and a rough cycle can expose the weak point of an otherwise good one. Timing tells you when a theme becomes visible and what it costs.",
        method: "Read the natal structure first, then layer the ten-year or annual trigger on top of it so you can tell a permanent tendency from a temporary phase."
      };
    case "money-career":
      return {
        lead: "Money and career topics become clearer once you separate ownership, authority, cash flow, and platform from one another.",
        meaning: "These charts often show who controls resources, who carries responsibility, and where income enters before they show personal wealth in a simple way.",
        method: "Compare the Life, Wealth, Career, and Travel palaces so you can see whether the result comes from title, business route, outside markets, or institutional responsibility."
      };
    default:
      return null;
  }
}

function englishFallbackExamples(article) {
  const override = englishOverrideFor(article);
  if (override?.examples?.length) return override.examples;
  if (article.title.includes("财权")) {
    return [
      "A person may authorize large budgets at work while living on a normal salary structure personally.",
      "The same chart can point to a bank, a finance office, or a large operating role rather than direct business ownership.",
      "A wealth pattern in the career palace often means responsibility over money before personal profit."
    ];
  }
  if (article.title.includes("福德宫") || article.title.includes("右弼")) {
    return [
      "Someone can look steady and capable in public while carrying most pressure alone in private.",
      "A support-star pattern may show delayed emotional trust rather than a total lack of relationships.",
      "Timing often shows when private tension starts affecting work rhythm, sleep, or partnership dynamics."
    ];
  }
  if (article.title.includes("雄宿朝元")) {
    return [
      "A chart can lean toward disciplined leadership in one life path and independent business decisions in another.",
      "If wealth support is weak, the pattern may show authority and grit more than direct profit.",
      "When timing is poor, strong will can turn into overreach instead of clean execution."
    ];
  }
  if (article.title.includes("巨日格")) {
    return [
      "When both stars are bright, speech can translate into sales, visibility, and large-scale deals.",
      "When one side is weak, the same pattern can sound forceful without creating trust or results.",
      "A chart may use this pattern through the person directly, through family background, or only during a strong decade."
    ];
  }
  if (article.title.includes("七杀朝斗")) {
    return [
      "In the career palace, the pattern often shows rank, mandate, and hard decision-making.",
      "In the wealth palace, it can describe large resource channels without promising easy personal cash.",
      "Strong outside-world support makes the pattern work better on bigger platforms than in small closed settings."
    ];
  }
  if (article.title.includes("明珠出海")) {
    return [
      "A bright pattern can describe the person directly, or it can show up through siblings, parents, or children first.",
      "A decade can temporarily light up the same pattern even if the natal Life Palace does not carry it.",
      "The palace decides who receives the benefit; the pattern only tells you that the light is there."
    ];
  }
  if (article.title.includes("六煞")) {
    return [
      "A lone malefic can show one problem starting here and a second consequence appearing across the chart.",
      "The palace tells you whether the pressure is about money, family, partnership, health, or environment.",
      "Timing matters because lone-malefic patterns are often quiet until a trigger year turns them concrete."
    ];
  }
  if (article.title.includes("迁移宫")) {
    return [
      "A chart may stay average at home but become far more visible after a move or platform change.",
      "Support stars in the outside-world palace often describe better allies, better systems, and a better stage elsewhere.",
      "A strong travel palace still needs a stable core identity, or the opportunity becomes exhausting instead of rewarding."
    ];
  }
  if (article.title.includes("入正位")) {
    return [
      "An official star works differently in the Career Palace than it does in the Wealth Palace or Spouse Palace.",
      "A wealth star in the right palace often shows direct income; the same star elsewhere may show responsibility or pressure instead.",
      "The palace gives the question, and the star gives the tone of the answer."
    ];
  }
  return [
    "Read the palace first, then decide whether the pattern is about money, role, relationships, health, or the outside world.",
    "Use the opposite palace to understand what supports or pressures the main topic.",
    "Let timing refine the reading instead of forcing one fixed prediction from the natal chart alone."
  ];
}

function updateQueue(file, raw, published) {
  let next = raw;
  for (const article of published) {
    const url = `${site}/articles/${article.slug}.html`;
    const enUrl = `${site}/articles/en/${article.slug}.html`;
    const rowRe = new RegExp(`(\\|\\s*${String(article.order).padStart(2, "0")}\\s*\\|\\s*)待发布(\\s*\\|\\s*${escapeRegExp(article.slug)}\\s*\\|)`);
    next = next.replace(rowRe, `$1已发布 ${formatPublishedAt(article.publishedAt || publishDate)} ${url} / ${enUrl}$2`);
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
    .filter((file) => file.endsWith(".html") && file !== "index.html" && !specialChineseFiles.has(file))
    .map((file) => parseArticleFile(path.join(root, "articles", file)))
    .sort((a, b) => b.published.localeCompare(a.published) || a.headline.localeCompare(b.headline, "zh-CN"));
}

function allEnglishArticles() {
  const enDir = path.join(root, "articles", "en");
  if (!existsSync(enDir)) return [];
  return readdirSync(enDir)
    .filter((file) => file.endsWith(".html") && file !== "index.html" && !specialEnglishFiles.has(file))
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
              <div class="card-meta"><span class="tag">${escapeHtml(article.section)}</span><span><time datetime="${article.published}">${formatPublishedAt(article.published)}</time></span></div>
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
  const externalCards = externalCollections.map((item, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">站内专题</span><span>中英双语</span></div>
              <h3>${escapeHtml(item.zhName)}</h3>
              <p>${escapeHtml(item.desc)}</p>
              <a class="card-link" href="${item.zhFile}">进入专题</a>
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
        <details class="article-group" open>
          <summary class="section-head">
            <h2>站内问答专题</h2>
            <span class="section-desc">如果你搜的是 AI 算命、免费边界、隐私和准确性，这里集中整理。</span>
            <span class="section-toggle"><span>${externalCollections.length} 组</span></span>
          </summary>
          <div class="article-list">
${externalCards}
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
  writeFileSync(path.join(root, "sitemap-articles.xml"), articlesSitemap(zhArticles), "utf8");
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
  const latestPublishedAt = articles[0]?.published || toPublishDateTime(publishTime);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>阅天AI更新</title>
    <link>${site}/</link>
    <description>阅天AI官方入口、免费紫微斗数排盘与AI命盘分析相关更新。</description>
    <language>zh-CN</language>
    <lastBuildDate>${rssDate(latestPublishedAt, publishTime)}</lastBuildDate>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${articles.slice(0, 80).map((article) => `
    <item>
      <title>${escapeHtml(article.headline)}</title>
      <link>${article.url}</link>
      <guid isPermaLink="true">${article.url}</guid>
      <pubDate>${rssDate(article.published, publishTime)}</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`).join("")}
  </channel>
</rss>
`;
}

function enFeed(articles) {
  const latestPublishedAt = articles[0]?.published || toPublishDateTime(publishTime);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>YuetianAI Zi Wei Articles</title>
    <link>${site}/articles/en/</link>
    <description>Plain-English Zi Wei Dou Shu articles and chart reading guides.</description>
    <language>en</language>
    <lastBuildDate>${rssDate(latestPublishedAt, publishTime)}</lastBuildDate>
    <atom:link href="${site}/articles/en/feed.xml" rel="self" type="application/rss+xml" />
${articles.slice(0, 80).map((article) => `
    <item>
      <title>${escapeHtml(article.headline)}</title>
      <link>${article.url}</link>
      <guid isPermaLink="true">${article.url}</guid>
      <pubDate>${rssDate(article.published, publishTime)}</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`).join("")}
  </channel>
</rss>
`;
}

function rssDate(dateOrDateTime, fallbackTime) {
  const dateTime = dateOrDateTime.includes("T") ? dateOrDateTime : `${dateOrDateTime}T${fallbackTime}:00+08:00`;
  const d = new Date(dateTime);
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
  for (const item of externalCollections) {
    urls.add(`${site}/articles/${item.zhFile}`);
    urls.add(`${site}/articles/en/${item.enFile}`);
  }
  for (const article of articles) urls.add(article.url);
  return sitemapXml([...urls], articles);
}

function articlesSitemap(articles) {
  const urls = [
    `${site}/articles/`,
    ...topicHubs.map((hub) => `${site}/articles/${hub.file}`),
    ...externalCollections.map((item) => `${site}/articles/${item.zhFile}`),
    ...articles.map((article) => article.url)
  ];
  return sitemapXml([...new Set(urls)], articles);
}

function enSitemap(articles) {
  const urls = [
    `${site}/articles/en/`,
    `${site}/articles/en/feed.xml`,
    ...externalCollections.map((item) => `${site}/articles/en/${item.enFile}`),
    ...articles.map((article) => article.url)
  ];
  return sitemapXml(urls, articles);
}

function sitemapXml(urls, articles) {
  const byUrl = new Map(articles.map((article) => [article.url, article.published]));
  const latestPublishedAt = articles[0]?.published || toPublishDateTime(publishTime);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${byUrl.get(url) || (url.includes("feed.xml") || url.endsWith("/articles/") || url.endsWith("/articles/en/") || topicHubs.some((hub) => url.endsWith(`/articles/${hub.file}`)) ? latestPublishedAt : "2026-06-24T00:00:00+08:00")}</lastmod>
    <changefreq>${url.includes("/articles/") || url.includes("feed.xml") ? "daily" : "weekly"}</changefreq>
    <priority>${url.endsWith("/articles/") || url.endsWith("/articles/en/") ? "0.8" : url.includes("/articles/") ? "0.7" : "0.6"}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function enIndex(articles) {
  const cards = articles.map((article, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${article.published}">${formatPublishedAt(article.published)}</time></span></div>
              <h3>${escapeHtml(article.headline)}</h3>
              <p>${escapeHtml(article.description)}</p>
              <a class="card-link" href="${article.rel}">Read article</a>
            </div>
          </article>`).join("\n");
  const externalCards = externalCollections.map((item, index) => `          <article class="article-card" data-index="${String(index + 1).padStart(2, "0")}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Featured Hub</span><span>Bilingual</span></div>
              <h3>${escapeHtml(item.enName)}</h3>
              <p>${escapeHtml(item.desc)}</p>
              <a class="card-link" href="${item.enFile}">Open hub</a>
            </div>
          </article>`).join("\n");
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn Zi Wei Dou Shu in Plain English",
    url: `${site}/articles/en/`,
    inLanguage: "en",
    description: "Plain-English Zi Wei Dou Shu articles and Chinese astrology chart reading guides.",
    hasPart: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: article.url,
        name: article.headline,
      })),
    },
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="../../js/site-analytics.js?v=20260618-ga4"></script>
  <title>Learn Zi Wei Dou Shu in Plain English | YuetianAI</title>
  <meta name="description" content="Plain-English Zi Wei Dou Shu articles for English readers: palaces, timing, relationships, wealth, career, and practical chart-reading order.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${site}/articles/en/">
  <link rel="alternate" hreflang="en" href="${site}/articles/en/">
  <link rel="alternate" hreflang="zh-CN" href="${site}/articles/">
  <link rel="alternate" hreflang="x-default" href="${site}/articles/en/">
  <link rel="alternate" type="application/rss+xml" title="YuetianAI Zi Wei Articles" href="${site}/articles/en/feed.xml">
  <meta property="og:title" content="Learn Zi Wei Dou Shu in Plain English">
  <meta property="og:description" content="Plain-English Zi Wei Dou Shu articles and Chinese astrology chart reading guides.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site}/articles/en/">
  <meta property="og:image" content="${defaultImage}">
  <link rel="icon" href="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" type="image/webp">
  <link rel="stylesheet" href="../../css/articles.css?v=20260629-article-accordion-v1">
  <script type="application/ld+json">
  ${JSON.stringify(collectionJsonLd, null, 2)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="site-nav">
      <a class="brand" href="../../index.html" aria-label="YuetianAI home"><img src="../../images/wentian-prototype-assets/wentian-brand-logo-ai-gold-v1.webp" alt="" aria-hidden="true"><span>YuetianAI</span></a>
      <nav class="nav-links" aria-label="Main navigation"><a href="../../index.html">Home</a><a href="../">Chinese</a></nav>
    </div>
  </header>
  <main>
    <section class="series" aria-labelledby="en-article-index">
      <div class="container">
        <details class="article-group" open>
          <summary class="section-head">
            <h2>Featured Topic Hubs</h2>
            <span class="section-desc">Search-driven guides for reliability, privacy, free vs paid, and practical use.</span>
            <span class="section-toggle"><span>${externalCollections.length} Hub</span></span>
          </summary>
          <div class="article-list">
${externalCards}
          </div>
        </details>
        <details class="article-group" open>
          <summary class="section-head">
            <h1 id="en-article-index">Learn Zi Wei Dou Shu in Plain English</h1>
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
