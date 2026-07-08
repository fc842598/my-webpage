import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_SCREENS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  11, 12,
  17, 18, 19, 20, 22, 24,
  25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
];

const SCREEN_NAMES = new Map([
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
]);

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
  const options = {
    screens: DEFAULT_SCREENS,
    outDir: join(ROOT, "tmp", "english-mobile-audit", "latest"),
    screenshot: "fail",
    headful: false,
    failOnIssues: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--screens=")) {
      const value = arg.slice("--screens=".length).trim();
      options.screens = value === "all"
        ? DEFAULT_SCREENS
        : value.split(",").map((item) => Number(item.trim())).filter(Number.isFinite);
    } else if (arg.startsWith("--out=")) {
      options.outDir = resolve(ROOT, arg.slice("--out=".length));
    } else if (arg.startsWith("--screenshot=")) {
      const mode = arg.slice("--screenshot=".length).trim();
      if (["all", "fail", "none"].includes(mode)) options.screenshot = mode;
    } else if (arg === "--headful") {
      options.headful = true;
    } else if (arg === "--fail-on-issues") {
      options.failOnIssues = true;
    }
  }

  if (!options.screens.length) throw new Error("No screens selected.");
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
      resolveServer({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 90);
}

function makeMarkdown(results, meta) {
  const rows = results.map((result) => {
    const count = result.issueCount;
    const status = count ? "Needs Fix" : "Pass";
    const issueText = count
      ? [
          result.counts.textOverlap ? `${result.counts.textOverlap} text overlaps` : "",
          result.counts.labelOverlap ? `${result.counts.labelOverlap} label overlaps` : "",
          result.counts.imageTextOverlap ? `${result.counts.imageTextOverlap} image/text overlaps` : "",
          result.counts.textOverflow ? `${result.counts.textOverflow} text overflows` : "",
          result.counts.obscuredText ? `${result.counts.obscuredText} obscured texts` : "",
          result.counts.consoleErrors ? `${result.counts.consoleErrors} console errors` : "",
        ].filter(Boolean).join("; ")
      : "No automated overlap findings";
    return `| ${status} | screen-${result.screen} | ${result.name} | ${issueText} |`;
  }).join("\n");

  const detailSections = results
    .filter((result) => result.issueCount)
    .map((result) => {
      const items = result.issues.slice(0, 12).map((issue) => {
        const target = issue.target ? `; target: ${sanitizeText(issue.target)}` : "";
        const against = issue.against ? `; against: ${sanitizeText(issue.against)}` : "";
        const area = issue.area ? `; area: ${Math.round(issue.area)}` : "";
        return `- ${issue.type}: ${sanitizeText(issue.node || issue.text)}${target}${against}${area}`;
      }).join("\n");
      const more = result.issues.length > 12 ? `\n- ... ${result.issues.length - 12} more findings in JSON` : "";
      return `### screen-${result.screen} ${result.name}\n${items}${more}`;
    }).join("\n\n");

  return `# English Mobile Audit

Generated: ${meta.generatedAt}

Scope: YuetianAI mobile app, English mode, ${meta.viewport.width}x${meta.viewport.height}.

Gate: no text overlap, no label overlap, no image/text obstruction, no mobile overflow, no console errors.

| Status | Screen | English Page | Findings |
| --- | --- | --- | --- |
${rows}

${detailSections || "No automated findings."}
`;
}

async function auditScreen(page, baseUrl, screen, options) {
  const url = `${baseUrl}/pages/wentian-app.html?lang=en#screen-${screen}`;
  const consoleMessages = [];
  page.removeAllListeners("console");
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  await page.goto(url, { waitUntil: "networkidle" });
  try {
    await page.waitForSelector(`.figma-phone[data-node-id="screen-${screen}"]`, { timeout: 12000 });
  } catch (error) {
    const retryUrl = `${baseUrl}/pages/wentian-app.html?lang=en&auditRetry=${Date.now()}#screen-${screen}`;
    await page.goto(retryUrl, { waitUntil: "networkidle" });
    await page.waitForSelector(`.figma-phone[data-node-id="screen-${screen}"]`, { timeout: 12000 });
  }
  await page.waitForTimeout(350);

  const audit = await page.evaluate(() => {
    const phone = document.querySelector(".figma-phone");
    const phoneRect = phone?.getBoundingClientRect();
    const textSelector = [
      ".fig-text",
      ".wentian-chat-msg",
      ".wentian-chat-chip",
      ".wentian-chat-compact-question",
      ".wentian-chat-profile-tag",
      ".wentian-chart-label",
      ".wentian-chart-status",
      ".wentian-chart-preview",
      ".wentian-chart-tst-help",
      ".wentian-chart-control",
      ".wentian-payment-status",
      ".wentian-auth-status",
      ".office-layout-title",
      ".office-layout-copy",
      ".office-layout-button",
      ".office-layout-guide-step",
      ".liuren-preview",
      ".liuren-process-head",
      ".liuren-palace-button",
      ".liuren-palace-pulse",
      "button:not(.fig-click)",
      "a:not(.fig-click)",
      "label",
      "[role='button']:not(.fig-click)",
    ].join(",");
    const imageSelector = "img,.fig-img,canvas";

    const isVisible = (el) => {
      if (!el || !phone?.contains(el)) return false;
      if (el.closest("details:not([open])") && !el.closest("summary")) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.03) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      if (phoneRect && (
        rect.right < phoneRect.left ||
        rect.left > phoneRect.right ||
        rect.bottom < phoneRect.top ||
        rect.top > phoneRect.bottom
      )) return false;
      return true;
    };

    const textFor = (el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return el.value || el.getAttribute("placeholder") || el.getAttribute("aria-label") || "";
      if (tag === "select") return el.options?.[el.selectedIndex]?.text || el.getAttribute("aria-label") || "";
      return el.innerText || el.textContent || el.getAttribute("aria-label") || el.getAttribute("title") || "";
    };

    const rectFor = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    };

    const unionRects = (rects) => {
      if (!rects.length) return null;
      const left = Math.min(...rects.map((rect) => rect.left));
      const top = Math.min(...rects.map((rect) => rect.top));
      const right = Math.max(...rects.map((rect) => rect.right));
      const bottom = Math.max(...rects.map((rect) => rect.bottom));
      return { left, top, right, bottom, width: right - left, height: bottom - top };
    };

    const textRectFor = (el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return rectFor(el);
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects())
        .filter((rect) => rect.width >= 1 && rect.height >= 1);
      range.detach();
      return unionRects(rects) || rectFor(el);
    };

    const isTransparentPaint = (el) => {
      const style = getComputedStyle(el);
      return Number(style.opacity) <= 0.03
        || (style.backgroundImage === "none" && /rgba?\(0,\s*0,\s*0,\s*0\)|transparent/i.test(style.backgroundColor));
    };

    const isReadableAt = (el, rect) => {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const stack = document.elementsFromPoint(x, y);
      for (const item of stack) {
        if (!phone.contains(item)) continue;
        if (item === el || el.contains(item) || item.contains(el)) return true;
        if (!isTransparentPaint(item)) return false;
      }
      return true;
    };

    const relativeRect = (rect) => ({
      left: Math.round(rect.left - phoneRect.left),
      top: Math.round(rect.top - phoneRect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });

    const classify = (el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "label") return "label";
      if (tag === "button" || tag === "a" || el.getAttribute("role") === "button") return "label";
      if (el.classList.contains("wentian-chat-chip") || el.classList.contains("wentian-chat-compact-question")) return "label";
      return "text";
    };

    const nodes = Array.from(phone.querySelectorAll(textSelector))
      .filter(isVisible)
      .map((el, index) => {
        const text = textFor(el).replace(/\s+/g, " ").trim();
        const rect = textRectFor(el);
        const style = getComputedStyle(el);
        return {
          index,
          el,
          text,
          type: classify(el),
          node: el.getAttribute("data-node-id") || el.id || el.className || el.tagName.toLowerCase(),
          rect,
          relative: relativeRect(rect),
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          whiteSpace: style.whiteSpace,
        };
      })
      .filter((item) => item.text && item.rect.width >= 2 && item.rect.height >= 2 && isReadableAt(item.el, item.rect));

    const images = Array.from(phone.querySelectorAll(imageSelector))
      .filter(isVisible)
      .filter((el) => !el.closest(".liuren-hand-board"))
      .filter((el) => !/(bg|background|paper|card)/i.test(el.getAttribute("data-node-id") || ""))
      .map((el, index) => {
        const rect = rectFor(el);
        return {
          index,
          el,
          node: el.getAttribute("data-node-id") || el.id || el.className || el.tagName.toLowerCase(),
          rect,
          relative: relativeRect(rect),
        };
      });

    const intersect = (a, b) => {
      const left = Math.max(a.left, b.left);
      const top = Math.max(a.top, b.top);
      const right = Math.min(a.right, b.right);
      const bottom = Math.min(a.bottom, b.bottom);
      if (right <= left || bottom <= top) return null;
      return { left, top, right, bottom, width: right - left, height: bottom - top, area: (right - left) * (bottom - top) };
    };

    const isRelated = (a, b) => a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el);
    const issues = [];

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        if (isRelated(a, b)) continue;
        const hit = intersect(a.rect, b.rect);
        if (!hit || hit.area < 12 || hit.width < 3 || hit.height < 3) continue;
        const minArea = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
        if (hit.area / minArea < 0.08) continue;
        issues.push({
          type: a.type === "label" || b.type === "label" ? "labelOverlap" : "textOverlap",
          node: a.node,
          text: a.text,
          target: b.node,
          against: b.text,
          area: hit.area,
          rect: a.relative,
          targetRect: b.relative,
        });
      }
    }

    for (const node of nodes) {
      if (node.el.classList.contains("wentian-chart-ai-coin")) continue;
      const overflowX = node.scrollWidth > node.clientWidth + 4;
      const overflowY = node.scrollHeight > Math.max(node.clientHeight + 6, node.clientHeight * 1.22);
      const clips = node.overflowX !== "visible" || node.overflowY !== "visible";
      if ((overflowX || overflowY) && clips && node.clientWidth > 0 && node.clientHeight > 0) {
        issues.push({
          type: "textOverflow",
          node: node.node,
          text: node.text,
          rect: node.relative,
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
          scrollHeight: node.scrollHeight,
          clientHeight: node.clientHeight,
        });
      }
    }

    for (const image of images) {
      for (const node of nodes) {
        if (image.el.contains(node.el) || node.el.contains(image.el)) continue;
        const hit = intersect(image.rect, node.rect);
        if (!hit || hit.area < 18 || hit.width < 4 || hit.height < 4) continue;
        const textArea = node.rect.width * node.rect.height;
        if (hit.area / textArea < 0.12) continue;
        issues.push({
          type: "imageTextOverlap",
          node: image.node,
          target: node.node,
          against: node.text,
          area: hit.area,
          rect: image.relative,
          targetRect: node.relative,
        });
      }
    }

    const isTransparentHit = (el) => {
      if (!el?.classList?.contains("fig-click")) return false;
      const style = getComputedStyle(el);
      return !el.textContent.trim() && /rgba?\(0,\s*0,\s*0,\s*0\)|transparent/i.test(style.backgroundColor);
    };

    const samplePoints = (rect) => {
      const insetX = Math.min(5, rect.width / 4);
      const insetY = Math.min(5, rect.height / 4);
      return [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + insetX, rect.top + rect.height / 2],
        [rect.right - insetX, rect.top + rect.height / 2],
        [rect.left + rect.width / 2, rect.top + insetY],
        [rect.left + rect.width / 2, rect.bottom - insetY],
      ];
    };

    for (const node of nodes) {
      const blockers = [];
      for (const [x, y] of samplePoints(node.rect)) {
        const stack = document.elementsFromPoint(x, y);
        let blocker = null;
        for (const el of stack) {
          if (!phone.contains(el) || isTransparentHit(el)) continue;
          if (el === node.el || node.el.contains(el) || el.contains(node.el)) break;
          const style = getComputedStyle(el);
          if (style.pointerEvents === "none" && style.backgroundColor === "rgba(0, 0, 0, 0)") continue;
          if (el.closest(".liuren-hand-board")) continue;
          if (el.matches("img,.fig-img,canvas,button,a,input,select,textarea,[role='button']")) {
            blocker = el;
            break;
          }
        }
        if (blocker) blockers.push(blocker);
      }
      const unique = [...new Set(blockers)];
      if (unique.length) {
        issues.push({
          type: "obscuredText",
          node: node.node,
          text: node.text,
          target: unique.map((el) => el.getAttribute("data-node-id") || el.id || el.className || el.tagName.toLowerCase()).join(", "),
          rect: node.relative,
        });
      }
    }

    const html = document.documentElement;
    const body = document.body;
    const horizontalOverflow = Math.max(html.scrollWidth, body.scrollWidth) - window.innerWidth;
    if (horizontalOverflow > 2) {
      issues.push({
        type: "mobileHorizontalOverflow",
        node: "document",
        text: `${Math.round(horizontalOverflow)}px wider than viewport`,
      });
    }

    return {
      htmlLang: document.documentElement.lang,
      route: location.hash,
      phone: phoneRect ? relativeRect(phoneRect) : null,
      horizontalOverflow: Math.max(0, Math.round(horizontalOverflow || 0)),
      issues: issues.map(({ el, ...issue }) => issue),
      visibleTextCount: nodes.length,
      imageCount: images.length,
    };
  });

  const counts = {
    textOverlap: audit.issues.filter((issue) => issue.type === "textOverlap").length,
    labelOverlap: audit.issues.filter((issue) => issue.type === "labelOverlap").length,
    imageTextOverlap: audit.issues.filter((issue) => issue.type === "imageTextOverlap").length,
    textOverflow: audit.issues.filter((issue) => issue.type === "textOverflow").length,
    obscuredText: audit.issues.filter((issue) => issue.type === "obscuredText").length,
    consoleErrors: consoleMessages.length,
  };

  const issues = [
    ...audit.issues,
    ...consoleMessages.map((message) => ({
      type: "consoleError",
      node: message.type,
      text: message.text,
    })),
  ];

  const issueCount = issues.length;
  const screenshotPath = issueCount && options.screenshot === "fail" || options.screenshot === "all"
    ? join(options.outDir, `screen-${String(screen).padStart(2, "0")}.png`)
    : "";

  if (screenshotPath) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }

  return {
    screen,
    name: SCREEN_NAMES.get(screen) || "",
    url,
    htmlLang: audit.htmlLang,
    visibleTextCount: audit.visibleTextCount,
    imageCount: audit.imageCount,
    counts,
    issueCount,
    issues,
    screenshotPath,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  mkdirSync(options.outDir, { recursive: true });

  const { server, baseUrl } = await serveStatic(ROOT);
  const browser = await chromium.launch({ headless: !options.headful });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  const page = await context.newPage();
  await context.route("https://api.yuetianai.com/**", async (route) => {
    const url = route.request().url();
    const payload = url.includes("/api/payments/member-status")
      ? {
          ok: true,
          quota: { isMember: false, dailyLimit: 8, dailyUsed: 0, dailyRemaining: 8 },
          product: { amountYuan: "19.90" },
          providers: [
            { provider: "wechat", label: "WeChat Pay", enabled: true },
            { provider: "alipay", label: "Alipay", enabled: true },
            { provider: "paypal", label: "PayPal", enabled: false },
          ],
        }
      : url.includes("/api/ai/chat/session")
        ? { ok: true, sessionId: "audit-session", messages: [] }
        : { ok: true };
    await route.fulfill({
      status: 200,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify(payload),
    });
  });
  const results = [];

  try {
    for (const screen of options.screens) {
      const result = await auditScreen(page, baseUrl, screen, options);
      results.push(result);
      const summary = result.issueCount ? `${result.issueCount} finding(s)` : "pass";
      console.log(`screen-${screen} ${result.name}: ${summary}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    viewport: { width: 390, height: 844 },
    screens: options.screens,
  };

  writeFileSync(join(options.outDir, "audit.json"), JSON.stringify({ meta, results }, null, 2), "utf8");
  writeFileSync(join(options.outDir, "summary.md"), makeMarkdown(results, meta), "utf8");

  const totalIssues = results.reduce((sum, result) => sum + result.issueCount, 0);
  const failedScreens = results.filter((result) => result.issueCount).length;
  console.log(`\nEnglish mobile audit complete: ${results.length} screens, ${failedScreens} screen(s) with findings, ${totalIssues} total finding(s).`);
  console.log(`Report: ${join(options.outDir, "summary.md")}`);

  if (options.failOnIssues && totalIssues) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
