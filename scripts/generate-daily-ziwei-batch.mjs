import path from "node:path";
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for --${key}`);
    args[key] = value;
    i += 1;
  }
  return args;
}

function parseTimes(input) {
  if (!input) fail("Missing --times");
  const times = input.split(",").map((item) => item.trim()).filter(Boolean);
  if (!times.length) fail("No publish times found");
  for (const time of times) {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) fail(`Invalid time: ${time}`);
  }
  const unique = new Set(times);
  if (unique.size !== times.length) fail("Publish times must be unique");
  const sorted = [...times].sort();
  if (sorted.join(",") !== times.join(",")) fail("Publish times must already be sorted");
  const buckets = [0, 0, 0, 0, 0, 0];
  for (const time of times) {
    const hour = Number(time.slice(0, 2));
    buckets[Math.floor(hour / 4)] += 1;
  }
  if (buckets.some((count) => count < 4)) fail("Each four-hour bucket needs at least 4 publish times");
  return times;
}

function bodyOf(article) {
  const sectionA = article.points.slice(0, 2).join("");
  const sectionB = article.points.slice(2).join("");
  return `${article.opening}

${article.focus}很多人会在这一步直接把一颗星、一个宫位或者一个阶段标签，当成整张盘的结论，所以才会把能用的结构看窄，也把真正要防的代价看漏。

### 先把主线定出来
${sectionA}先把这条主线定清楚，后面再看四化、限年和外部条件，结论才不会飘成一句空话。

${article.examples[0]}

### 再看组合为什么会把结果拉开
${sectionB}真正拉开差距的，往往不是单独一个判断词，而是它落在哪条线、有没有承接、会不会把人推去承担更多责任、流动或压力。

${article.examples[1]}

### 真正实用的地方，不是贴标签
读这类盘，重点不是先争一句好命还是坏命，而是先分清主宫、落点、承接和代价。宫位告诉你事情落在哪里，星曜告诉你用什么方式发生，组合再决定事情是顺着做出来，还是带着折腾和成本做出来。把这几个层次拆开，判断才不会飘。

### 最容易看错的地方
${article.intent}如果只抓一个最亮的点，常会把现实里的顺序弄反。先把先天结构和现实出口分开，再看哪一宫主事、哪一宫承压、哪一宫补资源，才知道应该先守、先动，还是先等时机。

### 排盘顺序
${article.orderText}`;
}

function sourceText(date, articles) {
  const blocks = articles.map((article) => {
    const evidence = article.evidence.join("、");
    const sourceHints = [
      `同步文稿段 ${evidence}`,
      `核心判断：${article.points.join("；")}`,
      `组合例子：${article.examples.join("；")}`,
    ].join("。");
    return `## ${article.order}. ${article.title}
slug：\`${article.slug}\`
搜索意图：${article.intent}
素材线索：${sourceHints}
正文草稿：
${bodyOf(article)}`;
  });

  return `# 紫微文章源稿 ${date}

本批次共 ${articles.length} 篇，均用于当天中英文配对发布。正文只吸收同步文稿里的判断条件、组合逻辑和落宫例子，不保留来源痕迹。

${blocks.join("\n\n---\n\n")}
`;
}

function queueText(date, articles, times) {
  const schedule = articles.map((article, index) => {
    const order = String(article.order).padStart(2, "0");
    return `${order}. ${date} ${times[index]} - ${article.title}`;
  }).join("\n");

  const rows = articles.map((article) => {
    const order = String(article.order).padStart(2, "0");
    return `| ${order} | 待发布 | ${article.slug} | ${article.title} | ${article.category} |`;
  }).join("\n");

  return `# 紫微文章发布队列 ${date}

规则：本批次用于 ${date} 的每日 ${articles.length} 篇紫微文章发布。中文页、英文页、索引、feed、sitemap 与 hreflang 统一由脚本生成。

## 发布时间表

${schedule}

| 顺序 | 状态 | slug | 标题 | 大类 |
|---|---|---|---|---|
${rows}
`;
}

const args = parseArgs(process.argv.slice(2));
const seedArg = args.seed;
const date = args.date;

if (!seedArg) fail("Missing --seed");
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("Missing or invalid --date");

const seedPath = path.resolve(seedArg);
const { articles } = await import(`${pathToFileURL(seedPath).href}?t=${Date.now()}`);
if (!Array.isArray(articles) || !articles.length) fail("Seed file did not export articles");

const ordered = [...articles].sort((a, b) => a.order - b.order);
const times = parseTimes(args.times);
if (times.length !== ordered.length) fail(`Need ${ordered.length} publish times, got ${times.length}`);

const sourcePath = path.resolve(args.source || `docs/ziwei-daily-${date}-source.md`);
const queuePath = path.resolve(args.queue || `docs/ziwei-daily-${date}-queue.md`);

await writeFile(sourcePath, sourceText(date, ordered), "utf8");
await writeFile(queuePath, queueText(date, ordered, times), "utf8");

console.log(`Wrote ${path.relative(process.cwd(), sourcePath)}`);
console.log(`Wrote ${path.relative(process.cwd(), queuePath)}`);
