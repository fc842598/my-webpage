import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const renderDir = path.join(root, "output", "article-poster-render");
const posterDir = path.join(root, "images", "articles", "posters");
const thumbDir = path.join(posterDir, "thumbs");

mkdirSync(renderDir, { recursive: true });
mkdirSync(posterDir, { recursive: true });
mkdirSync(thumbDir, { recursive: true });

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.CHROME_PATH,
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => {
  try {
    execFileSync("powershell", ["-NoProfile", "-Command", `Test-Path -LiteralPath '${candidate.replace(/'/g, "''")}'`], { encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
});

if (!chrome) {
  throw new Error("Chrome executable was not found.");
}

const cards = [
  ["ziwei-minggong", "十二宫入门", "命宫", "先看本人，再看发展方向。", ["性格底色", "人生主线", "发展方向"], "triad-tian-bg.webp", "命"],
  ["ziwei-xiongdigong", "十二宫入门", "兄弟宫", "看同辈、合作与边界。", ["同辈关系", "合作边界", "助力阻力"], "triad-tian-bg.webp", "兄"],
  ["ziwei-fuqigong", "十二宫入门", "夫妻宫", "看关系与婚缘节奏。", ["关系模式", "相处边界", "婚缘节奏"], "triad-ren-bg.webp", "夫"],
  ["ziwei-zinvgong", "十二宫入门", "子女宫", "看表达、延续与责任感。", ["表达延续", "投入方式", "责任感受"], "triad-tian-bg.webp", "子"],
  ["ziwei-caibogong", "十二宫入门", "财帛宫", "看钱从哪里来，也看怎么守住。", ["财帛格局", "收入来源", "理财守成"], "triad-ren-bg.webp", "财"],
  ["ziwei-jiegong", "十二宫入门", "疾厄宫", "看压力、身体和恢复节奏。", ["身体压力", "风险提示", "恢复节奏"], "triad-tian-bg.webp", "疾"],
  ["ziwei-qianyigong", "十二宫入门", "迁移宫", "看外出与发展机会。", ["外部环境", "迁移机会", "发展机缘"], "triad-ren-bg.webp", "迁"],
  ["ziwei-puyigong", "十二宫入门", "仆役宫", "看团队、人脉与资源往来。", ["团队协作", "人脉结构", "资源往来"], "triad-tian-bg.webp", "仆"],
  ["ziwei-guanlugong", "十二宫入门", "官禄宫", "看事业位置与责任强弱。", ["事业位置", "责任强弱", "财官合看"], "triad-tian-bg.webp", "官"],
  ["ziwei-tianzhaigong", "十二宫入门", "田宅宫", "看家宅、资源与稳定基础。", ["家宅资源", "稳定基础", "空间归属"], "triad-tian-bg.webp", "田"],
  ["ziwei-fudegong", "十二宫入门", "福德宫", "看内在能量与放松方式。", ["内在能量", "精神重心", "放松方式"], "triad-tian-bg.webp", "福"],
  ["ziwei-fumugong", "十二宫入门", "父母宫", "看原生影响与支持压力。", ["原生影响", "承接方式", "支持压力"], "triad-tian-bg.webp", "父"],
  ["ziwei-sanfang-sizheng", "看盘方法", "三方四正", "把主题宫位放回结构里看。", ["主宫定位", "对宫牵引", "结构合参"], "triad-tian-bg.webp", "三"],
  ["ziwei-shengong", "看盘方法", "身宫", "看后天重心落在哪里。", ["后天重心", "落宫判断", "强弱组合"], "triad-ren-bg.webp", "身"],
  ["ziwei-gongxing", "流年入门", "宫性", "先分清宫位负责什么。", ["宫位职责", "阅读顺序", "现实映射"], "triad-ren-bg.webp", "宫"],
  ["ziwei-daxian", "看盘方法", "十年大限", "看十年阶段与发力方向。", ["阶段主线", "三方四正", "小限触发"], "triad-tian-bg.webp", "限"],
  ["ziwei-xiaoxian-liunian", "流年入门", "小限流年", "看今年落宫与触发点。", ["本宫对宫", "年度主题", "现实触发"], "triad-ren-bg.webp", "年"],
  ["ziwei-kequanlu", "星曜入门", "科权禄", "看名声、权责与现实结果。", ["名声资源", "权责分布", "现实结果"], "triad-tian-bg.webp", "禄"],
  ["mianfei-ziwei-paipan-hou-xian-kan-shenme", "实用指南", "先看什么", "先看命身，再接三方四正。", ["先看命身", "再看三方", "最后接流年"], "triad-tian-bg.webp", "先"],
  ["ai-ziwei-paipan-zenme-xuan", "实用指南", "怎么选", "看入口、边界和能否落地。", ["入口清楚", "边界明确", "能落地用"], "triad-tian-bg.webp", "选"],
  ["ai-suanming-wangzhan-zenme-xuan", "实用指南", "算命网站", "先看隐私、收费和内容质量。", ["隐私边界", "收费方式", "内容质量"], "triad-ren-bg.webp", "算"],
  ["yuetianai-shi-shenme", "阅天AI", "品牌介绍", "官网入口、主要功能和适合人群。", ["官网入口", "主要功能", "适合人群"], "triad-tian-bg.webp", "阅"],
];

const requestedSlugs = new Set(process.argv.slice(2));
const selectedCards = requestedSlugs.size ? cards.filter(([slug]) => requestedSlugs.has(slug)) : cards;

if (requestedSlugs.size && selectedCards.length !== requestedSlugs.size) {
  const found = new Set(selectedCards.map(([slug]) => slug));
  const missing = [...requestedSlugs].filter((slug) => !found.has(slug));
  throw new Error(`Unknown article poster slug: ${missing.join(", ")}`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function html(card) {
  const [slug, series, title, subtitle, metrics, bg, glyph] = card;
  const metricText = metrics.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const bgUrl = pathToFileURL(path.join(root, "images", "home2", bg)).href;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
html,body{margin:0;width:960px;height:540px;overflow:hidden;background:#100c08;}
body{font-family:"Noto Serif SC","Songti SC","Microsoft YaHei",serif;color:#fff0c8;}
.poster{position:relative;width:960px;height:540px;overflow:hidden;background:#100c08 url("${bgUrl}") center/cover no-repeat;}
.poster::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgba(12,8,5,.98) 0%,rgba(12,8,5,.86) 39%,rgba(12,8,5,.25) 100%),radial-gradient(circle at 76% 48%,rgba(229,195,121,.22),transparent 24%);}
.poster::after{content:"";position:absolute;left:0;right:0;bottom:0;height:118px;background:linear-gradient(0deg,rgba(9,7,5,.55),transparent);}
.copy{position:absolute;left:62px;top:68px;width:430px;z-index:2;}
.series{font:800 26px/1.2 "Microsoft YaHei",sans-serif;color:#d9c08b;letter-spacing:0;margin:0 0 42px;}
.series::before,.series::after{content:"◆";font-size:15px;margin:0 14px 0 0;color:#d3ad5d}.series::after{margin:0 0 0 14px}
.title{margin:0;color:#fff3cf;font:900 86px/1.03 "Noto Serif SC","Songti SC",serif;letter-spacing:0;text-shadow:0 14px 28px rgba(0,0,0,.34);}
.subtitle{margin:26px 0 0;color:#f5dfb1;font:700 30px/1.38 "Noto Serif SC","Songti SC",serif;}
.metrics{display:flex;gap:18px;margin:44px 0 0;color:#e4c783;font:800 23px/1.2 "Microsoft YaHei",sans-serif;}
.metrics span+span::before{content:"•";margin-right:18px;color:#c99f50;}
.seal{position:absolute;right:98px;top:74px;width:340px;height:340px;z-index:2;border-radius:50%;border:2px solid rgba(232,205,147,.44);box-shadow:0 0 0 26px rgba(228,214,184,.36),0 0 0 54px rgba(214,191,139,.10),0 22px 80px rgba(212,167,75,.25);}
.seal::before{content:"";position:absolute;inset:54px;border-radius:50%;background:radial-gradient(circle at 40% 34%,rgba(255,236,179,.42),transparent 22%),conic-gradient(from 40deg,rgba(255,238,190,.22),rgba(177,124,49,.78),rgba(255,238,190,.18),rgba(87,58,26,.78),rgba(255,238,190,.22));box-shadow:inset 0 0 0 2px rgba(255,235,178,.18),0 0 36px rgba(225,178,82,.18);}
.seal::after{content:"${escapeHtml(glyph)}";position:absolute;inset:54px;display:grid;place-items:center;color:#fff3cf;font:900 82px/1 "Noto Serif SC","Songti SC",serif;text-shadow:0 10px 25px rgba(0,0,0,.4);}
.dot{position:absolute;width:15px;height:15px;border-radius:50%;background:#ead49d;box-shadow:0 0 16px rgba(234,212,157,.34)}
.d1{right:439px;top:214px}.d2{right:74px;top:214px}.d3{right:118px;top:404px}.d4{right:395px;top:404px}.d5{right:260px;top:42px}.d6{right:260px;top:482px}
.brand{position:absolute;left:64px;bottom:44px;z-index:2;display:flex;align-items:center;gap:15px;color:#d9c08b;font:800 21px/1 "Microsoft YaHei",sans-serif;}
.brand-mark{width:42px;height:42px;border-radius:50%;border:1px solid rgba(217,192,139,.46);display:grid;place-items:center;color:#f6dd9f;font-size:24px}
</style>
</head>
<body>
<main class="poster">
  <section class="copy">
    <p class="series">${escapeHtml(series)}</p>
    <h1 class="title">${escapeHtml(title)}</h1>
    <p class="subtitle">${escapeHtml(subtitle)}</p>
    <p class="metrics">${metricText}</p>
  </section>
  <div class="seal" aria-hidden="true"></div>
  <span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span><span class="dot d4"></span><span class="dot d5"></span><span class="dot d6"></span>
  <div class="brand"><span class="brand-mark">阅</span><span>紫微命盘 · 十二宫系列课</span></div>
</main>
</body>
</html>`;
}

for (const card of selectedCards) {
  const [slug] = card;
  const page = path.join(renderDir, `${slug}.html`);
  const png = path.join(renderDir, `${slug}.png`);
  const poster = path.join(posterDir, `${slug}.webp`);
  const thumb = path.join(thumbDir, `${slug}.webp`);

  writeFileSync(page, html(card), "utf8");
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=960,540",
    `--screenshot=${png}`,
    pathToFileURL(page).href,
  ], { stdio: "ignore" });
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", png, "-c:v", "libwebp", "-quality", "78", "-compression_level", "6", poster], { stdio: "inherit" });
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", png, "-vf", "scale=360:203", "-c:v", "libwebp", "-quality", "72", "-compression_level", "6", thumb], { stdio: "inherit" });
}

console.log(`Generated ${selectedCards.length} article posters.`);
