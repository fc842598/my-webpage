import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const INVENTORY_JSON = join(ROOT, "tmp", "english-mobile-inventory", "latest", "inventory.json");
const AUDIT_JSON = join(ROOT, "tmp", "english-mobile-audit", "latest", "audit.json");
const DEFAULT_OUT = join(ROOT, "docs", "english-mobile-page-gates.md");
const DEFAULT_CAPTURE_DIR = join(ROOT, "tmp", "english-mobile-review", "latest", "screenshots");
const VIEWPORT = { width: 390, height: 844 };

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
};

const MAIN_FLOW = new Map([
  [2, "Home entry"],
  [26, "Chart form"],
  [27, "Ziwei report"],
  [4, "Master Xu chat"],
  [29, "Membership entry"],
  [30, "Payment confirmation"],
]);

const EXPECTED = {
  2: { minCards: 3, flags: ["AI", "Chart"] },
  26: { minInputs: 4, minButtons: 4, flags: ["Chart"] },
  27: { minButtons: 5, minImages: 1, flags: ["Chart"] },
  4: { minInputs: 1, flags: ["AI"] },
  29: { flags: ["Payment"] },
  30: { flags: ["Payment"] },
  31: { flags: ["Account"] },
  39: { minInputs: 3 },
  40: { minInputs: 2, minButtons: 2, flags: ["Account"] },
};

function parseArgs(argv) {
  const options = { out: DEFAULT_OUT, captureDir: DEFAULT_CAPTURE_DIR };
  for (const arg of argv) {
    if (arg.startsWith("--out=")) options.out = resolve(ROOT, arg.slice("--out=".length));
    if (arg.startsWith("--capture-dir=")) options.captureDir = resolve(ROOT, arg.slice("--capture-dir=".length));
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

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${filePath}. Run audit:en-mobile and inventory:en-mobile first.`);
  }
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function compact(value, max = 90) {
  return String(value || "").replace(/\s+/g, " ").replace(/\|/g, "/").trim().slice(0, max);
}

function issue(score, amount, condition) {
  return condition ? Math.max(0, score - amount) : score;
}

function scoreFunction(row, audit) {
  let score = audit ? 100 : 88;
  const expected = EXPECTED[row.screen] || {};
  for (const flag of expected.flags || []) score = issue(score, 8, !String(row.flags || "").includes(flag));
  score = issue(score, 6, expected.minCards && row.counts.cards < expected.minCards);
  score = issue(score, 6, expected.minButtons && row.counts.buttons < expected.minButtons);
  score = issue(score, 6, expected.minInputs && row.counts.inputs < expected.minInputs);
  score = issue(score, 6, expected.minImages && row.counts.images < expected.minImages);
  score = issue(score, 10, audit?.issueCount > 0);
  return score;
}

function scoreCopy(row) {
  let score = 100;
  score = issue(score, 15, (row.languageResidues || []).length > 0);
  score = issue(score, 5, !/[A-Za-z0-9]/.test(String(row.title || row.name || "")));
  score = issue(score, 5, row.horizontalOverflow > 0);
  return score;
}

function scoreLayout(row, audit) {
  let score = 100;
  score = issue(score, 20, !audit);
  score = issue(score, 10, row.horizontalOverflow > 0);
  score = issue(score, 12, (audit?.counts?.bottomNavProximity || 0) > 0);
  score = issue(score, 12, (audit?.counts?.textOverflow || 0) > 0);
  score = issue(score, 12, (audit?.counts?.obscuredText || 0) > 0);
  score = issue(score, 10, (audit?.counts?.consoleErrors || 0) > 0);
  return score;
}

function scoreLabels(audit) {
  let score = audit ? 100 : 88;
  score = issue(score, 20, (audit?.counts?.labelOverlap || 0) > 0);
  score = issue(score, 12, (audit?.counts?.textOverlap || 0) > 0);
  return score;
}

function scoreImages(row, audit) {
  let score = audit ? 100 : 88;
  score = issue(score, 20, (audit?.counts?.imageTextOverlap || 0) > 0);
  score = issue(score, 12, (row.languageResidues || []).some((item) => item.startsWith("image:")));
  return score;
}

function scoreExperience(row, audit, screenshotPath) {
  let score = screenshotPath ? 100 : 90;
  score = issue(score, 8, !audit);
  score = issue(score, 10, audit?.issueCount > 0);
  score = issue(score, 6, (row.languageResidues || []).length > 0);
  return score;
}

function notesFor(row, audit, scores) {
  const notes = [];
  if (!audit) notes.push("no audit row");
  if (audit?.issueCount > 0) notes.push(`${audit.issueCount} layout issue(s)`);
  if ((audit?.counts?.bottomNavProximity || 0) > 0) notes.push("bottom nav crowding");
  if ((row.languageResidues || []).length) notes.push("English residue");
  if (row.horizontalOverflow > 0) notes.push(`${row.horizontalOverflow}px overflow`);
  if (Math.min(...Object.values(scores)) < 95) notes.push("below 95 gate");
  return notes.length ? notes.join("; ") : "Pass evidence: screenshot, inventory, overlap audit";
}

function makeMarkdown(rows, meta) {
  const passCount = rows.filter((row) => row.finalScore >= 95).length;
  const minScore = Math.min(...rows.map((row) => row.finalScore));
  const mainFlowRows = rows
    .filter((row) => MAIN_FLOW.has(row.screen))
    .map((row) => `| ${MAIN_FLOW.get(row.screen)} | screen-${row.screen} | ${row.name} | ${row.finalScore} | ${row.screenshotRel} |`)
    .join("\n");
  const gateRows = rows.map((row) => `| ${row.finalScore >= 95 ? "Pass" : "Needs loop"} | screen-${row.screen} | ${row.name} | ${row.scores.functionality} | ${row.scores.copy} | ${row.scores.layout} | ${row.scores.labels} | ${row.scores.images} | ${row.scores.experience} | ${row.finalScore} | ${row.notes} |`).join("\n");

  return `# English Mobile Page Gates

Generated: ${meta.generatedAt}

Scope: English mobile app at ${VIEWPORT.width}x${VIEWPORT.height}. This is the repeatable six-reviewer gate for the page-by-page 95-point loop.

Evidence:
- Inventory: \`npm run inventory:en-mobile\`
- Overlap audit: \`npm run audit:en-mobile -- --screens=all --screenshot=fail --fail-on-issues\`
- Review command: \`npm run review:en-mobile\`
- Screenshot folder: \`${meta.captureDirRel}\`

## Main Flow Screenshots

| Step | Screen | Page | Score | Screenshot |
| --- | --- | --- | ---: | --- |
${mainFlowRows}

## Six Reviewer Gate

| Gate | Screen | Page | Function | English Copy | Mobile Layout | Label Overlap | Image Blocking | Real UX | Final | Notes |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${gateRows}

## Summary

- Pages reviewed: ${rows.length}
- Pages at or above 95: ${passCount}/${rows.length}
- Lowest page score: ${minScore}
- Current result: ${passCount === rows.length && minScore >= 95 ? "all current automated gates pass" : "continue page loop before passing full goal"}

## Evidence Limits

- This proves current English mobile rendering, screenshots, copy residue, overlap, image blocking, and basic function entrances.
- Dedicated user-flow smoke covers mock payment completion, logged-in profile sync, and long-form English persona answers. Real external payment-provider charging remains out of scope for automated smoke tests.
`;
}

async function captureScreens(rows, options, baseUrl) {
  mkdirSync(options.captureDir, { recursive: true });
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
  const screenshots = new Map();
  try {
    for (const row of rows) {
      const url = `${baseUrl}/pages/wentian-app.html?lang=en#screen-${row.screen}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector(`.figma-phone[data-node-id="screen-${row.screen}"]`, { timeout: 12000 });
      await page.waitForTimeout(250);
      const path = join(options.captureDir, `screen-${String(row.screen).padStart(2, "0")}.png`);
      await page.locator(`.figma-phone[data-node-id="screen-${row.screen}"]`).screenshot({ path });
      screenshots.set(row.screen, path);
      console.log(`captured screen-${row.screen}`);
    }
  } finally {
    await browser.close();
  }
  return screenshots;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inventory = readJson(INVENTORY_JSON);
  const audit = readJson(AUDIT_JSON);
  const auditMap = new Map((audit.results || []).map((item) => [Number(item.screen), item]));
  const rows = inventory.rows || [];

  const { server, baseUrl } = await serveStatic(ROOT);
  let screenshots;
  try {
    screenshots = await captureScreens(rows, options, baseUrl);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const reviewedRows = rows.map((row) => {
    const auditRow = auditMap.get(Number(row.screen));
    const screenshotPath = screenshots.get(Number(row.screen)) || "";
    const scores = {
      functionality: scoreFunction(row, auditRow),
      copy: scoreCopy(row),
      layout: scoreLayout(row, auditRow),
      labels: scoreLabels(auditRow),
      images: scoreImages(row, auditRow),
      experience: scoreExperience(row, auditRow, screenshotPath),
    };
    const finalScore = Math.min(...Object.values(scores));
    return {
      screen: Number(row.screen),
      name: row.name,
      scores,
      finalScore,
      screenshotRel: screenshotPath ? normalize(screenshotPath).replace(normalize(ROOT) + "\\", "").replace(/\\/g, "/") : "",
      notes: notesFor(row, auditRow, scores),
    };
  });

  const meta = {
    generatedAt: new Date().toISOString(),
    captureDirRel: normalize(options.captureDir).replace(normalize(ROOT) + "\\", "").replace(/\\/g, "/"),
  };
  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, makeMarkdown(reviewedRows, meta), "utf8");
  console.log(`Review: ${options.out}`);

  const ok = reviewedRows.every((row) => row.finalScore >= 95);
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
