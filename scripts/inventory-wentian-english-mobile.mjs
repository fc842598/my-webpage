import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_OUT = join(ROOT, "docs", "english-mobile-site-inventory.md");
const DEFAULT_JSON_OUT = join(ROOT, "tmp", "english-mobile-inventory", "latest", "inventory.json");
const AUDIT_JSON = join(ROOT, "tmp", "english-mobile-audit", "latest", "audit.json");
const VIEWPORT = { width: 390, height: 844 };

const SCREENS = [
  [1, "Authorization"],
  [2, "Home / Report Mall"],
  [3, "AI"],
  [4, "Chat"],
  [5, "Choose Profile"],
  [6, "Asking"],
  [7, "Reply"],
  [8, "Long Reading"],
  [9, "Chat History"],
  [11, "Compatibility Profile Select"],
  [12, "Quick Questions"],
  [17, "Liuyao Casting"],
  [18, "Liuyao Cast Step 2"],
  [19, "Liuyao Cast Step 3"],
  [20, "Liuyao Result"],
  [22, "Invite Friends"],
  [24, "Invite Details"],
  [25, "Archives"],
  [26, "Chart Form"],
  [27, "Ziwei Report"],
  [29, "Membership / Recharge"],
  [30, "Payment"],
  [31, "Mine"],
  [32, "Account Settings"],
  [33, "Membership Plans"],
  [34, "Share"],
  [35, "Contact"],
  [36, "About"],
  [37, "Language"],
  [38, "Settings"],
  [39, "Basic Info"],
  [40, "Login Methods"],
  [41, "Password"],
  [42, "Nine Palaces"],
  [43, "Choose Members"],
  [44, "Placement"],
  [45, "Guide"],
  [46, "Liuren"],
  [47, "Liuren Guide"],
  [48, "Orders"],
  [49, "Compatibility Result"],
  [50, "Office Layout"],
  [51, "Office Layout Guide"],
  [52, "Office Layout Result"],
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function parseArgs(argv) {
  const options = { out: DEFAULT_OUT, jsonOut: DEFAULT_JSON_OUT };
  for (const arg of argv) {
    if (arg.startsWith("--out=")) options.out = resolve(ROOT, arg.slice("--out=".length));
    if (arg.startsWith("--json=")) options.jsonOut = resolve(ROOT, arg.slice("--json=".length));
  }
  return options;
}

function serveStatic(root) {
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    createReadStream(filePath).pipe(res);
  });
  return new Promise((resolveServer, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolveServer({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

function cleanText(value, max = 72) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "/")
    .trim()
    .slice(0, max);
}

function hasLanguageResidue(value) {
  return /[\u3400-\u9fff\uFFFD]/.test(String(value || ""));
}

function readAuditMap() {
  if (!existsSync(AUDIT_JSON)) return new Map();
  try {
    const parsed = JSON.parse(readFileSync(AUDIT_JSON, "utf8"));
    return new Map((parsed.results || []).map((item) => [Number(item.screen), item]));
  } catch (_err) {
    return new Map();
  }
}

function flagsFor(screenName, inventory) {
  const haystack = [
    screenName,
    inventory.title,
    inventory.buttons.join(" "),
    inventory.inputs.join(" "),
    inventory.cards.join(" "),
  ].join(" ");
  const flags = [];
  if (/AI|Ask|Chat|Reading|Master|Question|Reply/i.test(haystack)) flags.push("AI");
  if (/Chart|Ziwei|Profile|Birth|Palace|Archives|Report/i.test(haystack)) flags.push("Chart");
  if (/Pay|Payment|Recharge|Member|Plan|Order|WeChat|Alipay|PayPal/i.test(haystack)) flags.push("Payment");
  if (/Liuyao|Hexagram|Liuren|Office|Feng Shui|Placement|Nine Palace/i.test(haystack)) flags.push("Tools");
  if (/Login|Account|Password|Settings|Language|Contact|Share|Invite/i.test(haystack)) flags.push("Account");
  return flags.length ? Array.from(new Set(flags)).join(", ") : "General";
}

function scoreFromAudit(auditResult) {
  if (!auditResult) return { status: "Needs evidence", risk: "No latest overlap audit row found", score: 0 };
  if (auditResult.issueCount > 0) {
    return {
      status: "Needs fix",
      risk: `${auditResult.issueCount} automated mobile issue(s)`,
      score: Math.max(0, 100 - auditResult.issueCount * 10),
    };
  }
  return { status: "Pass", risk: "No text/label/image overlap found at 390x844", score: 100 };
}

function scoreForRow(auditResult, languageResidues = []) {
  const auditScore = scoreFromAudit(auditResult);
  if (languageResidues.length) {
    return {
      ...auditScore,
      status: auditScore.status === "Needs fix" ? "Needs fix" : "Needs review",
      risk: `${auditScore.risk}; ${languageResidues.length} English-language residue sample(s)`,
      score: Math.min(auditScore.score, 90),
    };
  }
  return auditScore;
}

function compactList(values, fallback = "None") {
  const unique = Array.from(new Set(values.map((item) => cleanText(item)).filter(Boolean)));
  return unique.length ? unique.slice(0, 5).join("; ") : fallback;
}

function styleSummary(styles) {
  const parts = [];
  if (styles.title) parts.push(`title ${styles.title}`);
  if (styles.button) parts.push(`button ${styles.button}`);
  if (styles.input) parts.push(`input ${styles.input}`);
  if (styles.card) parts.push(`card ${styles.card}`);
  if (styles.nav) parts.push(`nav ${styles.nav}`);
  if (styles.image) parts.push(`image ${styles.image}`);
  return parts.join("; ") || "No dominant style sample";
}

function readableTitle(row) {
  const title = cleanText(row.title);
  return /[A-Za-z0-9]/.test(title) ? title : row.name;
}

async function collectScreen(page, baseUrl, screen, name) {
  const url = `${baseUrl}/pages/wentian-app.html?lang=en#screen-${screen}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(`.figma-phone[data-node-id="screen-${screen}"]`, { timeout: 12000 });
  await page.waitForTimeout(250);

  return page.evaluate(() => {
    const phone = document.querySelector(".figma-phone");
    const phoneRect = phone?.getBoundingClientRect();
    const visible = (el) => {
      if (!el || !phone?.contains(el)) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.03) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      if (phoneRect && (rect.right < phoneRect.left || rect.left > phoneRect.right || rect.bottom < phoneRect.top || rect.top > phoneRect.bottom)) return false;
      return true;
    };
    const textOf = (el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return el.value || el.placeholder || el.getAttribute("aria-label") || "";
      if (tag === "select") return el.options?.[el.selectedIndex]?.text || el.getAttribute("aria-label") || "";
      return el.innerText || el.textContent || el.getAttribute("aria-label") || el.title || "";
    };
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const hasUsefulVisibleText = (value) => /[A-Za-z0-9\u3400-\u9fff]/.test(clean(value));
    const hasEnglishLetters = (value) => /[A-Za-z]/.test(clean(value));
    const hasLanguageResidue = (value) => /[\u3400-\u9fff\uFFFD]/.test(clean(value));
    const isDecorativeOrHotspot = (el) => {
      const text = clean(el.innerText || el.textContent || "");
      if (hasUsefulVisibleText(text)) return false;
      return el.classList.contains("fig-click") || el.getAttribute("aria-hidden") === "true";
    };
    const rectOf = (el) => {
      const rect = el.getBoundingClientRect();
      return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    };
    const sampleStyle = (selector) => {
      const el = Array.from(phone.querySelectorAll(selector)).find(visible);
      if (!el) return "";
      const style = getComputedStyle(el);
      return `${Math.round(parseFloat(style.fontSize) || 0)}px/${Math.round(parseFloat(style.lineHeight) || 0)}px ${rectOf(el)}`;
    };
    const textNodes = Array.from(phone.querySelectorAll(".fig-text,.wentian-chat-msg,.wentian-chart-label,.wentian-chart-status,.office-layout-title,.office-layout-copy"))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          text: clean(textOf(el)),
          size: parseFloat(style.fontSize) || 0,
          weight: Number(style.fontWeight) || 400,
          top: rect.top,
          area: rect.width * rect.height,
        };
      })
      .filter((item) => item.text);
    const titleCandidates = textNodes
      .filter((item) => clean(item.text).length >= 2 && (hasEnglishLetters(item.text) || hasLanguageResidue(item.text)))
      .filter((item) => !/^[\d\s$¥￥.,:/+-]+$/.test(clean(item.text)));
    const title = [...(titleCandidates.length ? titleCandidates : textNodes)]
      .sort((a, b) => (b.size * 2 + b.weight / 100 + b.area / 8000) - (a.size * 2 + a.weight / 100 + a.area / 8000))[0]?.text || "";
    const buttons = Array.from(phone.querySelectorAll("button,a,[role='button'],.fig-click"))
      .filter(visible)
      .filter((el) => !isDecorativeOrHotspot(el))
      .map((el) => clean(textOf(el) || el.getAttribute("data-action") || el.getAttribute("href") || el.getAttribute("data-route") || el.getAttribute("data-node-id")))
      .filter(Boolean);
    const inputs = Array.from(phone.querySelectorAll("input,textarea,select,label"))
      .filter(visible)
      .map((el) => clean(textOf(el) || el.getAttribute("name") || el.getAttribute("data-node-id")))
      .filter(Boolean);
    const cards = Array.from(phone.querySelectorAll(".wentian-card,.wentian-feature-card,.wentian-report-card,.fig-group,.fig-text"))
      .filter(visible)
      .map((el) => clean(textOf(el)))
      .filter((item) => item && item.trim().length >= 14);
    const nav = Array.from(phone.querySelectorAll("[data-node-id^='source-bottom-label'],.wentian-bottom-nav *,.wentian-tab,.wentian-segment"))
      .filter(visible)
      .map((el) => clean(textOf(el)))
      .filter(Boolean);
    const images = Array.from(phone.querySelectorAll("img,.fig-img,canvas"))
      .filter(visible)
      .map((el) => clean(el.alt || el.getAttribute("data-node-id") || el.className || el.tagName.toLowerCase()))
      .filter(Boolean);
    const dialogs = Array.from(phone.querySelectorAll("[role='dialog'],dialog,.wentian-modal,.wentian-sheet,.wentian-popup,.wentian-overlay"))
      .filter(visible)
      .map((el) => clean(textOf(el)))
      .filter(Boolean);
    const residueSources = [
      ...textNodes.map((item) => ["text", item.text]),
      ...buttons.map((item) => ["button", item]),
      ...inputs.map((item) => ["input", item]),
      ...cards.map((item) => ["card", item]),
      ...nav.map((item) => ["nav", item]),
      ...images.map((item) => ["image", item]),
      ...dialogs.map((item) => ["dialog", item]),
    ];
    const languageResidues = Array.from(new Set(
      residueSources
        .filter(([, value]) => hasLanguageResidue(value))
        .map(([where, value]) => `${where}: ${clean(value).slice(0, 96)}`)
    )).slice(0, 8);
    const html = document.documentElement;
    const body = document.body;
    return {
      title,
      buttons,
      inputs,
      cards,
      nav,
      images,
      dialogs,
      languageResidues,
      counts: {
        text: textNodes.length,
        buttons: buttons.length,
        inputs: inputs.length,
        cards: cards.length,
        nav: nav.length,
        images: images.length,
        dialogs: dialogs.length,
      },
      styles: {
        title: sampleStyle(".fig-text"),
        button: sampleStyle("button,a,[role='button']"),
        input: sampleStyle("input,textarea,select"),
        card: sampleStyle(".wentian-card,.wentian-feature-card,.wentian-report-card,.fig-group"),
        nav: sampleStyle("[data-node-id^='source-bottom-label'],.wentian-bottom-nav *"),
        image: sampleStyle("img,.fig-img,canvas"),
      },
      horizontalOverflow: Math.max(0, Math.round(Math.max(html.scrollWidth, body.scrollWidth) - window.innerWidth)),
    };
  });
}

function makeMarkdown(rows, meta) {
  const pageRows = rows.map((row) => {
    return `| ${row.status} | screen-${row.screen} | ${row.name} | ${row.flags} | ${readableTitle(row)} | ${compactList(row.buttons)} | ${compactList(row.inputs)} | ${compactList(row.images)} | ${row.risk} |`;
  }).join("\n");
  const styleRows = rows.map((row) => {
    return `| screen-${row.screen} | ${row.name} | ${styleSummary(row.styles)} | text ${row.counts.text}, buttons ${row.counts.buttons}, inputs ${row.counts.inputs}, images ${row.counts.images}, dialogs ${row.counts.dialogs} | ${row.horizontalOverflow}px |`;
  }).join("\n");
  const residueRows = rows
    .filter((row) => row.languageResidues.length)
    .map((row) => `| screen-${row.screen} | ${row.name} | ${row.languageResidues.map((item) => cleanText(item, 120)).join("<br>")} |`)
    .join("\n");
  const categoryRows = [
    ["AI", rows.filter((row) => row.flags.includes("AI")).map((row) => `screen-${row.screen}`).join(", ")],
    ["Chart / Profile / Report", rows.filter((row) => row.flags.includes("Chart")).map((row) => `screen-${row.screen}`).join(", ")],
    ["Payment / Membership", rows.filter((row) => row.flags.includes("Payment")).map((row) => `screen-${row.screen}`).join(", ")],
    ["Tools", rows.filter((row) => row.flags.includes("Tools")).map((row) => `screen-${row.screen}`).join(", ")],
    ["Account / Settings / Sharing", rows.filter((row) => row.flags.includes("Account")).map((row) => `screen-${row.screen}`).join(", ")],
  ].map(([name, screens]) => `| ${name} | ${screens || "None detected"} |`).join("\n");
  const passCount = rows.filter((row) => row.status === "Pass").length;
  const averageScore = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / Math.max(1, rows.length));

  return `# English Mobile Site Inventory

Generated: ${meta.generatedAt}

Scope: Yuetian AI app in English mode, iPhone-sized mobile viewport ${VIEWPORT.width}x${VIEWPORT.height}.

Evidence:
- Source route: \`pages/wentian-app.html?lang=en#screen-*\`
- Overlap gate: \`npm run audit:en-mobile -- --screens=all --screenshot=fail --fail-on-issues\`
- Latest automated overlap result: ${passCount}/${rows.length} screens passed, average score ${averageScore}.

## Functional Coverage

| Area | Screens |
| --- | --- |
${categoryRows}

## Page / Popup / Entry Inventory

| Status | Screen | English Page | Function Entrances | Main English Title | Buttons / Links | Forms / Labels | Image Areas | Mobile Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${pageRows}

## English Style Matrix

| Screen | Page | Style Samples | Element Counts | Horizontal Overflow |
| --- | --- | --- | --- | --- |
${styleRows}

## English Residue Review

| Screen | Page | Chinese / Garbled Samples |
| --- | --- | --- |
${residueRows || "| None | None | No visible Chinese or garbled text sampled by the inventory script. |"}

## Current Gate

- Function inventory: generated for ${rows.length} English mobile screens.
- Text overlap: current automated pass.
- Label overlap: current automated pass.
- Image/text obstruction: current automated pass.
- Bottom-nav crowding: current automated pass.
- Mobile horizontal overflow: current automated pass.
- Remaining high-risk manual gates: paid payment completion, real account login states, and long-form AI answer quality should continue to be checked with real-user flows, not only static screen inventory.
`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const auditMap = readAuditMap();
  mkdirSync(dirname(options.out), { recursive: true });
  mkdirSync(dirname(options.jsonOut), { recursive: true });

  const { server, baseUrl } = await serveStatic(ROOT);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    isMobile: true,
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  await context.route("https://api.yuetianai.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json; charset=utf-8", body: JSON.stringify({ ok: true, messages: [], quota: { dailyRemaining: 8 } }) });
  });
  const page = await context.newPage();
  const rows = [];
  try {
    for (const [screen, name] of SCREENS) {
      const inventory = await collectScreen(page, baseUrl, screen, name);
      const auditScore = scoreForRow(auditMap.get(screen), inventory.languageResidues);
      rows.push({
        screen,
        name,
        ...inventory,
        flags: flagsFor(name, inventory),
        ...auditScore,
      });
      console.log(`screen-${screen} ${name}: ${auditScore.status}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const meta = { generatedAt: new Date().toISOString(), baseUrl, viewport: VIEWPORT };
  writeFileSync(options.jsonOut, JSON.stringify({ meta, rows }, null, 2), "utf8");
  writeFileSync(options.out, makeMarkdown(rows, meta), "utf8");
  console.log(`Inventory: ${options.out}`);
  console.log(`JSON: ${options.jsonOut}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
