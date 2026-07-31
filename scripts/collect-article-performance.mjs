import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DEFAULT_API_BASE = "https://api.yuetianai.com";
const CATEGORY_FLOOR = 2;
const TARGET_BATCH_SIZE = 30;
const DEFAULT_CATEGORIES = ["财运事业", "婚恋与关系", "大限流年", "宫位组合", "四化细读", "主星", "辅煞曜", "格局命例", "看盘方法"];
const CATEGORY_ALIASES = new Map([
  ["财富事业", "财运事业"],
  ["婚恋时机", "婚恋与关系"],
  ["婚恋命例", "婚恋与关系"],
  ["亲缘婚恋", "婚恋与关系"],
  ["流年入门", "大限流年"],
  ["十二宫细读", "宫位组合"],
  ["十二宫入门", "宫位组合"],
  ["父母家缘", "宫位组合"],
  ["六亲关系", "宫位组合"],
  ["朋友合伙", "宫位组合"],
  ["田宅家运", "宫位组合"],
  ["兄弟宫位", "宫位组合"],
  ["子女宫位", "宫位组合"],
  ["四化星入门", "四化细读"],
  ["主星细读", "主星"],
  ["单星星性", "主星"],
  ["辅曜煞曜", "辅煞曜"],
  ["辅助煞曜", "辅煞曜"],
  ["格局判断", "格局命例"],
  ["特定命例解读", "格局命例"],
  ["特定命例", "格局命例"],
  ["Reading Method", "看盘方法"],
  ["Twelve Palaces", "宫位组合"],
]);
const ACTION_IMPRESSION_FLOOR = 20;
const SNIPPET_POSITION_CEILING = 15;
const EXPANSION_CLICK_FLOOR = 2;
const EXPANSION_PAGE_VIEW_FLOOR = 5;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

async function fetchGrowthData(apiBase, days) {
  const password = String(process.env.YUETIAN_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "").trim();
  if (!password) throw new Error("Set YUETIAN_ADMIN_PASSWORD or pass --input with an exported growth JSON file");
  const login = await fetch(`${apiBase}/api/admin/login`, {
    method: "POST",
    headers: { Authorization: `Bearer ${password}` },
  });
  if (!login.ok) throw new Error(`Admin login failed: ${login.status}`);
  const setCookie = login.headers.get("set-cookie") || "";
  const cookie = setCookie.split(";")[0];
  if (!cookie) throw new Error("Admin login did not return a session cookie");
  const response = await fetch(`${apiBase}/api/admin/growth?days=${days}`, {
    headers: { Cookie: cookie },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.ok) throw new Error(body.error || `Growth API failed: ${response.status}`);
  return body;
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function articleSectionFromHtml(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)];
  for (const [, raw] of blocks) {
    try {
      const value = JSON.parse(raw);
      const nodes = Array.isArray(value?.["@graph"]) ? value["@graph"] : [value];
      const article = nodes.find((item) => ["Article", "BlogPosting"].includes(item?.["@type"]));
      if (article?.articleSection) return String(article.articleSection);
    } catch (_error) {
      // Invalid JSON-LD is handled by the publishing quality gate.
    }
  }
  return "未分类";
}

function planningCategory(category) {
  const normalized = CATEGORY_ALIASES.get(category) || category;
  return DEFAULT_CATEGORIES.includes(normalized) ? normalized : null;
}

function localArticleMeta(page) {
  try {
    const url = new URL(page, "https://yuetianai.com");
    const match = url.pathname.match(/^\/articles\/(en\/)?([^/]+\.html)$/);
    if (!match) return null;
    const rel = path.join("articles", match[1] || "", match[2]);
    const file = path.join(ROOT, rel);
    if (!existsSync(file)) return null;
    const html = readFileSync(file, "utf8");
    const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    const articleSection = articleSectionFromHtml(html);
    let normalizedCategory = planningCategory(articleSection);
    if (match[1]) {
      const pairedChinese = path.join(ROOT, "articles", match[2]);
      if (existsSync(pairedChinese)) {
        normalizedCategory = planningCategory(articleSectionFromHtml(readFileSync(pairedChinese, "utf8"))) || normalizedCategory;
      }
    }
    return {
      path: url.pathname,
      rel,
      title: h1 || match[2],
      category: articleSection,
      planningCategory: normalizedCategory,
      language: match[1] ? "en" : "zh",
    };
  } catch (_error) {
    return null;
  }
}

function normalizedPage(value) {
  try {
    return new URL(value, "https://yuetianai.com").pathname;
  } catch (_error) {
    return String(value || "");
  }
}

function expectedCtr(position) {
  if (position <= 3) return 10;
  if (position <= 10) return 5;
  if (position <= 15) return 3;
  if (position <= 20) return 2;
  return 1;
}

function classifyPerformance(item) {
  const enoughImpressions = item.impressions >= ACTION_IMPRESSION_FLOOR;
  const benchmark = expectedCtr(item.position || 100);
  const weakSnippet = enoughImpressions
    && item.position > 0
    && item.position <= SNIPPET_POSITION_CEILING
    && item.ctr < benchmark * 0.6;
  const weakRanking = enoughImpressions && item.position > SNIPPET_POSITION_CEILING;
  const provenDemand = item.clicks >= EXPANSION_CLICK_FLOOR || item.pageViews >= EXPANSION_PAGE_VIEW_FLOOR;
  const confidence = item.impressions >= 50 || item.pageViews >= 10 || (item.clicks >= 3 && item.impressions >= ACTION_IMPRESSION_FLOOR)
    ? "high"
    : item.impressions >= ACTION_IMPRESSION_FLOOR || provenDemand
      ? "medium"
      : "low";

  if (weakSnippet) {
    return { action: "refresh-snippet", confidence, benchmarkCtr: benchmark, reason: "排名已能被看见，但标题摘要没有获得相称点击" };
  }
  if (weakRanking) {
    return { action: "strengthen-page", confidence, benchmarkCtr: benchmark, reason: "已有搜索展现但平均排名偏后，应加强原页内容与内链" };
  }
  if (provenDemand) {
    return { action: "expand-distinct-intent", confidence, benchmarkCtr: benchmark, reason: "已有重复点击或稳定阅读，可研究相邻但不同的搜索问题" };
  }
  return { action: "observe", confidence, benchmarkCtr: benchmark, reason: "样本不足，暂不据此改变选题配比" };
}

function aggregate(data) {
  const search = data.sources?.searchConsole?.data || {};
  const ga4 = data.sources?.ga4?.data || {};
  const rows = new Map();
  const getRow = (page) => {
    const pagePath = normalizedPage(page);
    if (!rows.has(pagePath)) rows.set(pagePath, { page: pagePath, clicks: 0, impressions: 0, ctr: 0, position: 0, pageViews: 0, activeUsers: 0 });
    return rows.get(pagePath);
  };
  for (const item of search.topPages || []) Object.assign(getRow(item.page), {
    clicks: Number(item.clicks || 0), impressions: Number(item.impressions || 0), ctr: Number(item.ctr || 0), position: Number(item.position || 0),
  });
  for (const item of ga4.topPages || []) Object.assign(getRow(item.path), {
    pageViews: Number(item.pageViews || 0), activeUsers: Number(item.activeUsers || 0),
  });
  const articles = [...rows.values()].map((row) => ({ ...row, meta: localArticleMeta(row.page) })).filter((row) => row.meta);
  const categories = new Map();
  for (const row of articles) {
    const key = row.meta.planningCategory;
    if (!key) continue;
    if (!categories.has(key)) categories.set(key, { category: key, clicks: 0, impressions: 0, pageViews: 0, activeUsers: 0, articleCount: 0 });
    const bucket = categories.get(key);
    bucket.clicks += row.clicks;
    bucket.impressions += row.impressions;
    bucket.pageViews += row.pageViews;
    bucket.activeUsers += row.activeUsers;
    bucket.articleCount += 1;
  }
  return {
    search,
    ga4,
    articles,
    categories: [...categories.values()].sort((a, b) => (b.clicks * 8 + b.pageViews + b.impressions * 0.08) - (a.clicks * 8 + a.pageViews + a.impressions * 0.08)),
    unclassifiedArticleCount: articles.filter((item) => !item.meta.planningCategory).length,
    queries: (search.topQueries || []).map((item) => ({ ...item })),
  };
}

function allocations(categories) {
  const byCategory = new Map(categories.map((item) => [item.category, item]));
  const candidates = DEFAULT_CATEGORIES.map((category) => byCategory.get(category) || {
    category, clicks: 0, impressions: 0, pageViews: 0, activeUsers: 0, articleCount: 0,
  });
  const scored = candidates.map((item) => ({
    ...item,
    signal: 1
      + item.clicks * 6 * Math.min(1, item.impressions / 20)
      + item.pageViews * Math.min(1, item.pageViews / 10)
      + Math.min(item.impressions, 100) * 0.03,
    confidence: item.impressions >= 100 || item.pageViews >= 20 || (item.clicks >= 5 && item.impressions >= 30)
      ? "high"
      : item.impressions >= 30 || item.clicks >= 2 || item.pageViews >= 5
        ? "medium"
        : "low",
    allocation: CATEGORY_FLOOR,
  }));
  let remaining = Math.max(0, TARGET_BATCH_SIZE - scored.length * CATEGORY_FLOOR);
  const totalSignal = scored.reduce((sum, item) => sum + item.signal, 0);
  for (const item of scored) {
    const share = Math.floor(remaining * item.signal / totalSignal);
    item.allocation += share;
  }
  let assigned = scored.reduce((sum, item) => sum + item.allocation, 0);
  for (const item of scored) {
    if (assigned >= TARGET_BATCH_SIZE) break;
    item.allocation += 1;
    assigned += 1;
  }
  let excess = 0;
  for (const item of scored) {
    if (item.allocation <= 8) continue;
    excess += item.allocation - 8;
    item.allocation = 8;
  }
  while (excess > 0) {
    const recipient = [...scored].filter((item) => item.allocation < 8).sort((a, b) => a.allocation - b.allocation)[0];
    if (!recipient) break;
    recipient.allocation += 1;
    excess -= 1;
  }
  return scored.map(({ category, allocation, signal, confidence }) => ({
    category,
    allocation,
    signal: Number(signal.toFixed(2)),
    confidence,
  }));
}

function strategyMarkdown(report) {
  const sourceSummary = report.source?.type === "live-admin-api"
    ? `实时后台 API；Search Console=${report.source.searchConsoleOk ? "可用" : "不可用"}，GA4=${report.source.ga4Ok ? "可用" : "不可用"}`
    : `导入文件 ${report.source?.reference || "未知"}；仅用于离线分析，不得作为正式选题数据锚点`;
  const winners = report.winners.length
    ? report.winners.map((item) => `- ${item.meta.title}：点击 ${item.clicks}，浏览 ${item.pageViews}，展现 ${item.impressions}；只研究相邻的新问题，不复制原意图。`).join("\n")
    : "- 暂无达到门槛的稳定需求，不凭零散点击扩写相似题。";
  const opportunities = report.opportunities.length
    ? report.opportunities.map((item) => `- ${item.meta.title}：展现 ${item.impressions}，平均排名 ${item.position.toFixed(1)}，CTR ${item.ctr.toFixed(1)}%；升级旧页标题、description 和导语，不新增同义页。`).join("\n")
    : "- 暂无达到样本门槛的标题摘要机会。";
  const rankingOpportunities = report.rankingOpportunities.length
    ? report.rankingOpportunities.map((item) => `- ${item.meta.title}：展现 ${item.impressions}，平均排名 ${item.position.toFixed(1)}；优先补强原页答案、例子和内链，不先换标题。`).join("\n")
    : "- 暂无达到样本门槛的排名提升机会。";
  const observations = report.observations.length
    ? report.observations.slice(0, 8).map((item) => `- ${item.meta.title}：点击 ${item.clicks}，浏览 ${item.pageViews}，展现 ${item.impressions}；继续观察。`).join("\n")
    : "- 暂无待观察文章。";
  const allocationsText = report.nextBatchAllocation.length
    ? report.nextBatchAllocation.map((item) => `- ${item.category}：准备 ${item.allocation} 篇候选，数据置信度 ${item.confidence}，仍须逐篇通过选题价值门。`).join("\n")
    : "- 数据不足时保持事业、财富、感情、迁移、学习、流年和基础读盘的均衡覆盖。";
  const queries = report.topQueries.length
    ? report.topQueries.slice(0, 10).map((item) => `- ${item.query}：展现 ${item.impressions}，点击 ${item.clicks}`).join("\n")
    : "- 暂无搜索词数据。";
  return `# 文章数据反馈与次日策略 ${report.date}\n\n数据窗口：${report.days} 天。数据来源：${sourceSummary}。数据只用于调整主题配比和升级旧文，不能替代源文证据，也不能用来批量制造近义页面。\n\n## 可继续深挖但必须换搜索意图\n\n${winners}\n\n## 优先优化原页标题与摘要\n\n${opportunities}\n\n## 优先加强原页内容与内链\n\n${rankingOpportunities}\n\n## 样本不足只观察\n\n${observations}\n\n## 用户真实搜索词\n\n${queries}\n\n## 次日候选配比\n\n${allocationsText}\n\n## 固定约束\n\n- 单个零散点击不构成选题方向，只有达到样本门槛的信号才能触发动作。\n- 排名已靠前但CTR弱时改原页标题摘要；排名偏后时先加强原页答案、例子和内链。\n- 数据强只代表值得继续研究，不代表允许复制标题、开头或例子。\n- 每篇仍须从指定DOCX取得4个观点、2个组合例子并通过质量闸门。\n- 正式批次必须凑齐30篇合格稿；失败稿换题重写，不能降标准或拿薄题补位。\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const days = Number(args.days || 30);
  if (![7, 30, 90].includes(days)) throw new Error("--days must be 7, 30, or 90");
  const date = args.date || new Date().toISOString().slice(0, 10);
  const apiBase = args["api-base"] || DEFAULT_API_BASE;
  const data = args.input
    ? JSON.parse(readFileSync(path.resolve(args.input), "utf8"))
    : await fetchGrowthData(apiBase, days);
  const aggregated = aggregate(data);
  const classified = aggregated.articles.map((item) => ({ ...item, learning: classifyPerformance(item) }));
  const winners = classified
    .filter((item) => item.learning.action === "expand-distinct-intent")
    .sort((a, b) => (b.clicks * 8 + b.pageViews) - (a.clicks * 8 + a.pageViews))
    .slice(0, 12);
  const opportunities = classified
    .filter((item) => item.learning.action === "refresh-snippet")
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12);
  const rankingOpportunities = classified
    .filter((item) => item.learning.action === "strengthen-page")
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12);
  const observations = classified
    .filter((item) => item.learning.action === "observe" && (item.impressions > 0 || item.clicks > 0 || item.pageViews > 0))
    .sort((a, b) => (b.clicks * 8 + b.pageViews + b.impressions * 0.08) - (a.clicks * 8 + a.pageViews + a.impressions * 0.08))
    .slice(0, 20);
  const report = {
    version: 3,
    date,
    days,
    generatedAt: new Date().toISOString(),
    source: {
      type: args.input ? "input-file" : "live-admin-api",
      reference: args.input ? path.relative(ROOT, path.resolve(args.input)) : new URL(apiBase).origin,
      searchConsoleOk: data.sources?.searchConsole?.ok === true && Boolean(data.sources?.searchConsole?.data),
      ga4Ok: data.sources?.ga4?.ok === true && Boolean(data.sources?.ga4?.data),
    },
    summary: {
      activeUsers: Number(aggregated.ga4.activeUsers || 0),
      pageViews: Number(aggregated.ga4.pageViews || 0),
      searchClicks: Number(aggregated.search.clicks || 0),
      searchImpressions: Number(aggregated.search.impressions || 0),
    },
    winners,
    opportunities,
    rankingOpportunities,
    observations,
    categories: aggregated.categories,
    unclassifiedArticleCount: aggregated.unclassifiedArticleCount,
    topQueries: aggregated.queries.slice(0, 20),
    nextBatchAllocation: allocations(aggregated.categories),
  };
  const outputPath = path.resolve(args.output || `docs/article-performance-${date}.json`);
  const strategyPath = path.resolve(args.strategy || `docs/article-strategy-${date}.md`);
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(strategyPath, strategyMarkdown(report), "utf8");
  console.log(`Article performance report: ${path.relative(ROOT, outputPath)}`);
  console.log(`Next-batch strategy: ${path.relative(ROOT, strategyPath)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
