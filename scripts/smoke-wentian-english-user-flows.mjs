import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT_DIR = join(ROOT, "tmp", "english-mobile-user-flows", "latest");
const SCREENSHOT_DIR = join(OUT_DIR, "screenshots");
const JSON_OUT = join(OUT_DIR, "user-flows.json");
const DOC_OUT = join(ROOT, "docs", "english-mobile-user-flow-smoke.md");
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
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

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

function rel(filePath) {
  return normalize(filePath).replace(normalize(ROOT) + "\\", "").replace(/\\/g, "/");
}

function makeAuthSession() {
  return {
    access_token: "smoke-access-token",
    refresh_token: "smoke-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer",
    user: {
      id: "smoke-user-en",
      email: "intern.user@example.com",
      app_metadata: { provider: "email" },
      user_metadata: {
        nickname: "Intern Tester",
        profile_email: "intern.user@example.com",
        phone: "+1 415 555 0100",
      },
    },
  };
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type,x-client-id,x-yuetian-client-id",
    "cache-control": "no-store",
  };
}

function jsonResponse(data, status = 200) {
  return {
    status,
    contentType: "application/json; charset=utf-8",
    headers: corsHeaders(),
    body: JSON.stringify(data),
  };
}

function words(text) {
  return String(text || "").match(/[A-Za-z][A-Za-z'-]*/g) || [];
}

function hasHan(text) {
  return /[\u3400-\u9fff]/.test(String(text || ""));
}

function replyFor(message) {
  const text = String(message || "").toLowerCase();
  const isYoungChild = /(^|[^0-9])(?:2|two)[- ]year|toddler|child/.test(text);
  if (isYoungChild && /whole life|lifetime|future/.test(text)) {
    return [
      "For a two-year-old, a lifetime reading can mention future partnership and vocation only as distant tendencies, not as present duties.",
      "Right now the reading should still speak to the parents: protect steady routines, notice curiosity, support language and emotional regulation, and avoid pressure.",
      "When discussing adulthood, phrase it as possibilities that may mature later: relationship style, collaborative strengths, and career rhythm can be revisited when the person is old enough to choose.",
    ].join("\n");
  }
  if (isYoungChild) {
    return [
      "This is a parent-facing child reading. I would focus on temperament, learning rhythm, sleep, appetite, attachment, and the kind of environment that helps the child feel safe.",
      "The useful advice is simple: keep routines stable, praise effort, let curiosity lead play, watch overstimulation, and give caregivers a calm way to understand sensitivity.",
      "It should not push adult goals or adult relationship pressure onto the child.",
    ].join("\n");
  }
  if (/intern|internship|overseas|job|work/.test(text)) {
    return [
      "For an overseas internship user, I would translate the chart into practical positioning rather than vague fate language.",
      "Your stronger pattern is useful for research, structured communication, and patient follow-through, so the first step is to build a small portfolio with two concrete cases.",
      "Second, ask a mentor to review the portfolio and your interview story. Third, apply in batches, track feedback, and improve one weakness each week instead of changing direction every few days.",
    ].join("\n");
  }
  return [
    "I would read this chart in practical English. Start with the person's current stage, then connect temperament, timing, and action advice.",
    "The answer should be specific enough to help the user decide what to do next, while staying clear about uncertainty and avoiding dramatic claims.",
  ].join("\n");
}

function createApiState() {
  return {
    memberPaid: false,
    orderNo: "mock_en_flow_20260708",
    profile: {
      nickname: "Intern Tester",
      email: "intern.user@example.com",
      phone: "+1 415 555 0100",
    },
  };
}

async function handleMockApi(route, apiState) {
  const request = route.request();
  if (request.method() === "OPTIONS") {
    await route.fulfill({ status: 204, headers: corsHeaders(), body: "" });
    return;
  }

  const url = new URL(request.url());
  const path = url.pathname;
  const body = request.postDataJSON?.() || {};

  if (path.endsWith("/api/payments/member-status")) {
    const dailyLimit = apiState.memberPaid ? 100 : 8;
    const dailyRemaining = apiState.memberPaid ? 96 : 6;
    await route.fulfill(jsonResponse({
      ok: true,
      mockMode: true,
      quota: {
        isMember: apiState.memberPaid,
        dailyLimit,
        dailyRemaining,
        dailyUsed: dailyLimit - dailyRemaining,
      },
      product: {
        productKey: "monthly_member",
        name: "Yuetian AI",
        description: "Master Xu AI chat, 100 messages per day.",
        amountFen: 1990,
        amountYuan: "19.90",
        currency: "CNY",
      },
      productEntitlement: {
        isMember: apiState.memberPaid,
        expiresAt: apiState.memberPaid ? "2026-08-08T00:00:00.000Z" : null,
        grantCount: apiState.memberPaid ? 1 : 0,
      },
      providers: [
        { provider: "wechat", label: "WeChat Pay", enabled: true },
        { provider: "alipay", label: "Alipay", enabled: false },
        { provider: "paypal", label: "PayPal", enabled: false },
      ],
    }));
    return;
  }

  if (path.endsWith("/api/payments/create-order")) {
    await route.fulfill(jsonResponse({
      ok: true,
      orderNo: apiState.orderNo,
      productKey: body.productKey || "monthly_member",
      productName: "Yuetian AI",
      description: "Master Xu AI chat, 100 messages per day.",
      amountFen: 1990,
      amountYuan: "19.90",
      currency: "CNY",
      provider: body.provider || "wechat",
      status: "pending",
      expiredAt: "2026-07-08T23:59:59.000Z",
      mockMode: true,
    }));
    return;
  }

  if (path.endsWith("/api/payments/create-session")) {
    await route.fulfill(jsonResponse({
      ok: true,
      orderNo: body.orderNo || apiState.orderNo,
      payUrl: "mock://pay/wentian-en",
      payMethod: "native",
      provider: "wechat",
      currency: "CNY",
      mockMode: true,
    }));
    return;
  }

  if (path.endsWith("/api/payments/mock/complete")) {
    apiState.memberPaid = true;
    await route.fulfill(jsonResponse({
      ok: true,
      orderNo: body.orderNo || apiState.orderNo,
      status: "paid",
      paidAt: new Date().toISOString(),
      mockMode: true,
      message: "Mock payment completed.",
    }));
    return;
  }

  if (path.endsWith("/api/auth/profile")) {
    apiState.profile = { ...apiState.profile, ...(body.profile || {}) };
    await route.fulfill(jsonResponse({
      ok: true,
      user: {
        ...makeAuthSession().user,
        user_metadata: {
          ...makeAuthSession().user.user_metadata,
          nickname: apiState.profile.nickname,
          profile_email: apiState.profile.email,
          phone: apiState.profile.phone,
        },
      },
    }));
    return;
  }

  if (path.endsWith("/api/ai/chat/session")) {
    await route.fulfill(jsonResponse({
      ok: true,
      sessionId: "smoke-en-session",
      transientMode: true,
      messages: [],
      quota: {
        isMember: apiState.memberPaid,
        dailyLimit: apiState.memberPaid ? 100 : 8,
        dailyRemaining: apiState.memberPaid ? 96 : 6,
      },
    }));
    return;
  }

  if (path.endsWith("/api/ai/chat/send")) {
    const displayMessage = body.displayMessage || body.message || "";
    await route.fulfill(jsonResponse({
      ok: true,
      sessionId: "smoke-en-session",
      reply: replyFor(displayMessage),
      quota: {
        isMember: apiState.memberPaid,
        dailyLimit: apiState.memberPaid ? 100 : 8,
        dailyRemaining: apiState.memberPaid ? 95 : 5,
      },
      transientState: body.transientState || {},
    }));
    return;
  }

  await route.fulfill(jsonResponse({ ok: true }));
}

async function newContext(browser, options = {}) {
  const apiState = createApiState();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    isMobile: true,
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  await context.addInitScript(({ auth }) => {
    window.localStorage.setItem("wentian-app-language-v1", "en");
    if (auth) {
      window.localStorage.setItem("wentian-app-auth-session-v1", JSON.stringify(auth));
    }
  }, { auth: options.auth ? makeAuthSession() : null });
  await context.route("**/api/**", (route) => handleMockApi(route, apiState));
  return { context, apiState };
}

async function openScreen(page, baseUrl, screen) {
  await page.goto(`${baseUrl}/pages/wentian-app.html?lang=en&apiBase=https://api.yuetianai.com#screen-${screen}`, { waitUntil: "networkidle" });
  await page.waitForSelector(`.figma-phone[data-node-id="screen-${screen}"]`, { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function waitForRoute(page, screen) {
  try {
    await page.waitForSelector(`.figma-phone[data-node-id="screen-${screen}"]`, { timeout: 15000 });
  } catch (error) {
    const debug = await page.evaluate(() => ({
      hash: location.hash,
      route: document.querySelector(".figma-phone")?.getAttribute("data-node-id") || "",
      status: document.getElementById("wentian-chart-status")?.textContent || "",
      title: document.querySelector(".figma-phone")?.innerText?.slice(0, 300) || "",
    })).catch(() => ({}));
    throw new Error(`screen-${screen} did not appear: ${JSON.stringify(debug)}`);
  }
  await page.waitForTimeout(300);
}

async function clickAction(page, action, options = {}) {
  const selector = options.nodeId ? `[data-node-id="${options.nodeId}"]` : `[data-action="${action}"]`;
  await page.locator(selector).first().evaluate((el) => {
    const pointer = typeof PointerEvent === "function"
      ? new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerType: "mouse" })
      : new MouseEvent("pointerup", { bubbles: true, cancelable: true, view: window });
    el.dispatchEvent(pointer);
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  });
  await page.waitForTimeout(150);
}

async function fillChart(page, data) {
  await page.locator("#wentian-chart-name").fill(data.name);
  await page.locator("#wentian-chart-year").fill(String(data.year));
  await page.locator("#wentian-chart-month").selectOption(String(data.month));
  await page.locator("#wentian-chart-day").selectOption(String(data.day));
  await page.locator("#wentian-chart-hour").selectOption(String(data.hour));
  await page.locator("#wentian-chart-minute").selectOption(String(data.minute));
  if (data.city) {
    await page.locator("#wentian-chart-city").fill(data.city);
    await page.waitForTimeout(150);
  }
}

async function createChart(page, baseUrl, data) {
  await openScreen(page, baseUrl, 26);
  await fillChart(page, data);
  await clickAction(page, "wentian-chart-submit", { nodeId: "source-26-submit-hit" });
  await waitForRoute(page, 27);
}

async function sendChat(page, message, expectText) {
  await page.locator("#wentian-chat-input").fill(message);
  await clickAction(page, "wentian-chat-send");
  try {
    await page.waitForFunction((needle) => document.body.innerText.includes(needle), expectText, { timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector(".wentian-chat-msg.is-typing"), null, { timeout: 30000 });
  } catch (error) {
    const debug = await page.evaluate(() => ({
      hash: location.hash,
      route: document.querySelector(".figma-phone")?.getAttribute("data-node-id") || "",
      input: document.getElementById("wentian-chat-input")?.value || "",
      messages: Array.from(document.querySelectorAll(".wentian-chat-msg")).map((item) => item.innerText).slice(-6),
      status: document.querySelector(".wentian-chat-status")?.innerText || "",
      body: document.querySelector(".figma-phone")?.innerText?.slice(0, 800) || "",
    })).catch(() => ({}));
    throw new Error(`chat reply did not appear: ${JSON.stringify(debug)}`);
  }
  return page.locator(".wentian-chat-msg.is-assistant").last().innerText();
}

async function screenHealth(page) {
  return page.evaluate(() => {
    const phone = document.querySelector(".figma-phone");
    const phoneRect = phone?.getBoundingClientRect();
    const visible = (el) => {
      if (!phone || !phone.contains(el)) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.03) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      return !(phoneRect && (rect.right < phoneRect.left || rect.left > phoneRect.right || rect.bottom < phoneRect.top || rect.top > phoneRect.bottom));
    };
    const textSelector = [
      ".fig-text",
      ".wentian-chat-msg",
      ".wentian-chart-label",
      ".wentian-chart-status",
      ".wentian-chart-preview",
      ".wentian-profile-status",
      ".wentian-payment-status",
      "input",
      "textarea",
      "select",
      "button:not(.fig-click)",
      "label",
    ].join(",");
    const textFor = (el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return el.value || el.placeholder || el.getAttribute("aria-label") || "";
      if (tag === "select") return el.options?.[el.selectedIndex]?.text || el.getAttribute("aria-label") || "";
      return el.innerText || el.textContent || el.getAttribute("aria-label") || "";
    };
    const rectData = (el) => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const texts = Array.from(phone?.querySelectorAll(textSelector) || [])
      .filter(visible)
      .map((el) => ({ el, text: textFor(el).replace(/\s+/g, " ").trim(), rect: rectData(el) }))
      .filter((item) => item.text && item.text.length > 1);
    const issues = [];
    const visibleText = texts.map((item) => item.text).join(" ");
    if (/[\u3400-\u9fff]/.test(visibleText)) issues.push({ type: "han-residue", text: visibleText.match(/[\u3400-\u9fff][\u3400-\u9fff\s]{0,30}/)?.[0] || "Chinese residue" });
    const fallback = visibleText.match(/Regenerate in English|Wo De|\bDao\b/i);
    if (fallback) issues.push({ type: "english-fallback", text: fallback[0] });
    for (const item of texts) {
      if (!phoneRect) continue;
      if (item.rect.left < phoneRect.left - 2 || item.rect.right > phoneRect.right + 2) {
        issues.push({ type: "horizontal-overflow", text: item.text.slice(0, 80) });
      }
      const el = item.el;
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).whiteSpace === "nowrap") {
        issues.push({ type: "text-overflow", text: item.text.slice(0, 80) });
      }
    }
    return {
      issueCount: issues.length,
      issues: issues.slice(0, 10),
      visibleTextLength: visibleText.length,
    };
  });
}

async function capture(page, name) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const path = join(SCREENSHOT_DIR, `${name}.png`);
  await page.locator(".figma-phone").screenshot({ path });
  return path;
}

function scoreFlow(checks) {
  let score = 100;
  for (const check of checks) {
    if (!check.pass) score = Math.min(score, check.score || 88);
  }
  return score;
}

function makeCheck(name, pass, detail, score = 88) {
  return { name, pass: !!pass, detail, score };
}

async function flowNewUserChart(browser, baseUrl) {
  const { context } = await newContext(browser);
  const page = await context.newPage();
  try {
    await createChart(page, baseUrl, {
      name: "Overseas New User",
      year: 2001,
      month: 6,
      day: 15,
      hour: 9,
      minute: 30,
      city: "",
    });
    const text = await page.locator(".figma-phone").innerText();
    const health = await screenHealth(page);
    const screenshot = await capture(page, "01-new-user-chart");
    const checks = [
      makeCheck("Chart flow reaches report screen", /Zi Wei|Chart|Report/i.test(text), text.slice(0, 120)),
      makeCheck("No visible Chinese residue", !hasHan(text), "English screen text only"),
      makeCheck("No dynamic residue or horizontal overflow findings", health.issueCount === 0, JSON.stringify(health.issues), 90),
    ];
    return { id: "new-user-chart", label: "Overseas new user creates a Ziwei chart", screen: "screen-27", checks, score: scoreFlow(checks), screenshot: rel(screenshot) };
  } finally {
    await context.close();
  }
}

async function flowInternshipChat(browser, baseUrl) {
  const { context } = await newContext(browser);
  const page = await context.newPage();
  try {
    await createChart(page, baseUrl, {
      name: "Ava Internship",
      year: 2003,
      month: 9,
      day: 18,
      hour: 14,
      minute: 20,
      city: "",
    });
    await openScreen(page, baseUrl, 4);
    const reply = await sendChat(
      page,
      "I am a 22-year-old overseas user preparing for an internship. Explain my strengths, risks, and three practical next steps in English.",
      "small portfolio"
    );
    const health = await screenHealth(page);
    const screenshot = await capture(page, "02-internship-chat");
    const checks = [
      makeCheck("Long English answer rendered", words(reply).length >= 55, `${words(reply).length} words`),
      makeCheck("Answer fits internship context", /internship|portfolio|mentor|interview|apply/i.test(reply), reply.slice(0, 160)),
      makeCheck("No visible Chinese residue", !hasHan(await page.locator(".figma-phone").innerText()), "English chat text only"),
      makeCheck("No dynamic residue or horizontal overflow findings", health.issueCount === 0, JSON.stringify(health.issues), 90),
    ];
    return { id: "internship-chat", label: "Internship user gets practical English Master Xu advice", screen: "screen-4", checks, score: scoreFlow(checks), screenshot: rel(screenshot) };
  } finally {
    await context.close();
  }
}

async function flowChildBoundary(browser, baseUrl) {
  const { context } = await newContext(browser);
  const page = await context.newPage();
  try {
    await createChart(page, baseUrl, {
      name: "Child Client",
      year: 2024,
      month: 5,
      day: 12,
      hour: 8,
      minute: 10,
      city: "",
    });
    await openScreen(page, baseUrl, 4);
    const currentReply = await sendChat(
      page,
      "This is a 2-year-old child. What should parents focus on right now?",
      "parent-facing child reading"
    );
    const lifetimeReply = await sendChat(
      page,
      "Please read the child's whole life tendencies. It is okay to mention future marriage and career as long-term possibilities.",
      "lifetime reading can mention future partnership"
    );
    const health = await screenHealth(page);
    const screenshot = await capture(page, "03-child-boundary");
    const currentAdultTemplate = /\b(job|boss|salary|dating|spouse|marriage|wealth portfolio|promotion)\b/i.test(currentReply);
    const lifetimeLongTerm = /future|later|adulthood|long-term|distant/i.test(lifetimeReply)
      && /partnership|relationship|vocation|career/i.test(lifetimeReply)
      && /not as present|not a current|right now/i.test(lifetimeReply);
    const checks = [
      makeCheck("Child current advice avoids adult template", !currentAdultTemplate, currentReply.slice(0, 180), 84),
      makeCheck("Child lifetime answer may discuss future adult topics carefully", lifetimeLongTerm, lifetimeReply.slice(0, 180), 84),
      makeCheck("Both child answers are substantial English", words(currentReply).length >= 45 && words(lifetimeReply).length >= 45, `${words(currentReply).length}/${words(lifetimeReply).length} words`),
      makeCheck("No visible Chinese residue", !hasHan(await page.locator(".figma-phone").innerText()), "English child-flow text only"),
      makeCheck("No dynamic residue or horizontal overflow findings", health.issueCount === 0, JSON.stringify(health.issues), 90),
    ];
    return { id: "child-boundary", label: "Two-year-old current advice vs lifetime tendencies", screen: "screen-4", checks, score: scoreFlow(checks), screenshot: rel(screenshot) };
  } finally {
    await context.close();
  }
}

async function flowUnifiedMemberRedirect(browser, baseUrl) {
  const { context } = await newContext(browser, { auth: true });
  const page = await context.newPage();
  try {
    await openScreen(page, baseUrl, 33);
    await clickAction(page, "wentian-member-pay");
    await page.waitForURL((url) => url.pathname === "/yl.html" && url.hash === "#member", { timeout: 12000 });
    await page.waitForSelector('button[data-member-pay], button:has-text("确认开通")', { timeout: 12000 });
    const text = await page.locator("body").innerText();
    const redirect = await page.evaluate(() => {
      let returnState = null;
      try {
        returnState = JSON.parse(localStorage.getItem("wentian-app-auth-return-v1") || "null");
      } catch (_error) {}
      return { pathname: location.pathname, hash: location.hash, returnState };
    });
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const screenshot = join(SCREENSHOT_DIR, "04-unified-member-redirect.png");
    await page.screenshot({ path: screenshot, fullPage: true });
    const checks = [
      makeCheck("Member CTA opens the unified member page", redirect.pathname === "/yl.html" && redirect.hash === "#member", `${redirect.pathname}${redirect.hash}`),
      makeCheck("Unified page shows membership and checkout", /阅天综合会员/.test(text) && /确认开通/.test(text), text.slice(0, 180)),
      makeCheck("Return context is preserved", redirect.returnState?.source === "wentian-member-pay", JSON.stringify(redirect.returnState || {})),
    ];
    return { id: "unified-member-redirect", label: "Member CTA opens the unified health membership page", screen: "yl.html#member", checks, score: scoreFlow(checks), screenshot: rel(screenshot) };
  } finally {
    await context.close();
  }
}

async function flowProfileSync(browser, baseUrl) {
  const { context } = await newContext(browser, { auth: true });
  const page = await context.newPage();
  try {
    await openScreen(page, baseUrl, 39);
    await page.locator("#wentian-profile-nickname").fill("English Intern");
    await page.locator("#wentian-profile-email").fill("english.intern@example.com");
    await page.locator("#wentian-profile-phone").fill("+1 650 555 0101");
    await clickAction(page, "wentian-profile-save");
    await page.waitForFunction(() => /Saved locally/i.test(document.body.innerText), null, { timeout: 8000 });
    await clickAction(page, "wentian-profile-sync");
    await page.waitForFunction(() => /Synced to your account/i.test(document.body.innerText), null, { timeout: 10000 });
    const text = await page.locator(".figma-phone").innerText();
    const health = await screenHealth(page);
    const screenshot = await capture(page, "05-profile-sync");
    const checks = [
      makeCheck("Local profile save works", /Saved locally|Synced/i.test(text), text.slice(0, 140)),
      makeCheck("Account sync success is visible", /Synced to your account/i.test(text), text.slice(0, 180)),
      makeCheck("No visible Chinese residue", !hasHan(text), "English profile text only"),
      makeCheck("No dynamic residue or horizontal overflow findings", health.issueCount === 0, JSON.stringify(health.issues), 90),
    ];
    return { id: "profile-sync", label: "Logged-in user saves and syncs English profile", screen: "screen-39", checks, score: scoreFlow(checks), screenshot: rel(screenshot) };
  } finally {
    await context.close();
  }
}

function markdown(results, meta) {
  const rows = results.map((flow) => {
    const failed = flow.checks.filter((check) => !check.pass).map((check) => check.name).join("; ") || "Pass";
    return `| ${flow.score >= 95 ? "Pass" : "Needs loop"} | ${flow.label} | ${flow.screen} | ${flow.score} | ${flow.screenshot} | ${failed} |`;
  }).join("\n");
  const detail = results.map((flow) => {
    const checks = flow.checks.map((check) => `- ${check.pass ? "Pass" : "Fail"}: ${check.name} - ${check.detail}`).join("\n");
    return `## ${flow.label}\n\nScore: ${flow.score}\n\nScreenshot: \`${flow.screenshot}\`\n\n${checks}`;
  }).join("\n\n");
  const minScore = Math.min(...results.map((flow) => flow.score));
  const passCount = results.filter((flow) => flow.score >= 95).length;
  return `# English Mobile User Flow Smoke

Generated: ${meta.generatedAt}

Scope: English mobile real-user flows at ${VIEWPORT.width}x${VIEWPORT.height}. APIs are controlled mocks for payment, account, and chat so the flow is repeatable without charging real money. Text, label, and image overlap remain covered by \`npm run audit:en-mobile\`; this smoke checks dynamic flow state, English residue, and horizontal overflow.

Special child rule: current advice for a two-year-old must stay parent-facing and avoid adult work/romance pressure. A lifetime reading may mention future partnership and vocation only as long-term tendencies, not as present duties.

| Gate | Flow | Screen | Score | Screenshot | Notes |
| --- | --- | --- | ---: | --- | --- |
${rows}

## Summary

- Flows reviewed: ${results.length}
- Flows at or above 95: ${passCount}/${results.length}
- Lowest flow score: ${minScore}
- Current result: ${passCount === results.length && minScore >= 95 ? "all current user-flow gates pass" : "continue the loop before passing"}

${detail}
`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const { server, baseUrl } = await serveStatic(ROOT);
  const browser = await chromium.launch({ headless: true });
  const flows = [
    flowNewUserChart,
    flowInternshipChat,
    flowChildBoundary,
    flowUnifiedMemberRedirect,
    flowProfileSync,
  ];
  const results = [];
  try {
    for (const flow of flows) {
      let result;
      try {
        result = await flow(browser, baseUrl);
      } catch (error) {
        result = {
          id: flow.name,
          label: flow.name,
          screen: "unknown",
          checks: [makeCheck("Flow completed without runtime error", false, error.message || String(error), 60)],
          score: 60,
          screenshot: "",
        };
      }
      results.push(result);
      console.log(`${result.score >= 95 ? "PASS" : "FAIL"} ${result.id}: ${result.score}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const payload = { generatedAt: new Date().toISOString(), viewport: VIEWPORT, results };
  writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2), "utf8");
  mkdirSync(dirname(DOC_OUT), { recursive: true });
  writeFileSync(DOC_OUT, markdown(results, { generatedAt: payload.generatedAt }), "utf8");
  console.log(`JSON: ${JSON_OUT}`);
  console.log(`Report: ${DOC_OUT}`);

  const ok = results.every((flow) => flow.score >= 95);
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
