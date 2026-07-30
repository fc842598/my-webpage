import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DEFAULT_API_BASE = "https://api.yuetianai.com";
const CATEGORY_FLOOR = 2;
const TARGET_BATCH_SIZE = 30;
const DEFAULT_CATEGORIES = ["财运事业", "婚恋与关系", "大限流年", "宫位组合", "四化细读", "主星", "辅煞曜", "看盘方法"];

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
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)];
    let articleSection = "未分类";
    for (const [, raw] of blocks) {
      try {
        const value = JSON.parse(raw);
        const nodes = Array.isArray(value?.["@graph"]) ? value["@graph"] : [value];
        const article = nodes.find((item) => ["Article", "BlogPosting"].includes(item?.["@type"]));
        if (article?.articleSection) articleSection = String(article.articleSection);
      } catch (_error) {
        // Invalid JSON-LD is handled by the publishing quality gate.
      }
    }
    return { path: url.pathname, rel, title: h1 || match[2], category: articleSection, language: match[1] ? "en" : "zh" };
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
    const key = row.meta.category;
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
    signal: Math.max(1, item.clicks * 8 + item.pageViews + item.impressions * 0.08),
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
  return scored.map(({ category, allocation, signal }) => ({ category, allocation, signal: Number(signal.toFixed(2)) }));
}

function strategyMarkdown(report) {
  const winners = report.winners.length
    ? report.winners.map((item) => `- ${item.meta.title}：点击 ${item.clicks}，浏览 ${item.pageViews}，展现 ${item.impressions}`).join("\n")
    : "- 暂无足够数据，不凭感觉扩写相似题。";
  const opportunities = report.opportunities.length
    ? report.opportunities.map((item) => `- ${item.meta.title}：展现 ${item.impressions}，CTR ${item.ctr.toFixed(1)}%，优先升级旧页标题和导语，不新增同义页。`).join("\n")
    : "- 暂无高展现低点击页面。";
  const allocationsText = report.nextBatchAllocation.length
    ? report.nextBatchAllocation.map((item) => `- ${item.category}：准备 ${item.allocation} 篇候选，仍须逐篇通过选题价值门。`).join("\n")
    : "- 数据不足时保持事业、财富、感情、迁移、学习、流年和基础读盘的均衡覆盖。";
  const queries = report.topQueries.length
    ? report.topQueries.slice(0, 10).map((item) => `- ${item.query}：展现 ${item.impressions}，点击 ${item.clicks}`).join("\n")
    : "- 暂无搜索词数据。";
  return `# 文章数据反馈与次日策略 ${report.date}\n\n数据窗口：${report.days} 天。数据只用于调整主题配比和升级旧文，不能替代源文证据，也不能用来批量制造近义页面。\n\n## 已产生真实阅读的内容\n\n${winners}\n\n## 优先升级旧文\n\n${opportunities}\n\n## 用户真实搜索词\n\n${queries}\n\n## 次日候选配比\n\n${allocationsText}\n\n## 固定约束\n\n- 数据强只代表值得继续研究，不代表允许复制标题、开头或例子。\n- 高展现低点击优先改旧页，不新增同搜索意图页面。\n- 每篇仍须从指定DOCX取得4个观点、2个组合例子并通过质量闸门。\n- 正式批次必须凑齐30篇合格稿；失败稿换题重写，不能降标准或拿薄题补位。\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const days = Number(args.days || 30);
  if (![7, 30, 90].includes(days)) throw new Error("--days must be 7, 30, or 90");
  const date = args.date || new Date().toISOString().slice(0, 10);
  const data = args.input
    ? JSON.parse(readFileSync(path.resolve(args.input), "utf8"))
    : await fetchGrowthData(args["api-base"] || DEFAULT_API_BASE, days);
  const aggregated = aggregate(data);
  const winners = aggregated.articles
    .filter((item) => item.clicks > 0 || item.pageViews >= 3)
    .sort((a, b) => (b.clicks * 8 + b.pageViews) - (a.clicks * 8 + a.pageViews))
    .slice(0, 12);
  const opportunities = aggregated.articles
    .filter((item) => item.impressions >= 5 && item.ctr < 3)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12);
  const report = {
    version: 1,
    date,
    days,
    generatedAt: new Date().toISOString(),
    summary: {
      activeUsers: Number(aggregated.ga4.activeUsers || 0),
      pageViews: Number(aggregated.ga4.pageViews || 0),
      searchClicks: Number(aggregated.search.clicks || 0),
      searchImpressions: Number(aggregated.search.impressions || 0),
    },
    winners,
    opportunities,
    categories: aggregated.categories,
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
