import crypto from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const API_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

const defaults = {
  sitemap: "sitemap-articles.xml",
  prefix: "https://yuetianai.com/articles/",
  siteUrl: "https://yuetianai.com/",
  limit: 0,
  delayMs: 300,
  outDir: "reports/google-indexing",
};

function log(message) {
  process.stdout.write(`[google-index-check] ${message}\n`);
}

function fail(message, code = 1) {
  process.stderr.write(`[google-index-check] ${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = { ...defaults, urls: "", dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i] || "";
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--sitemap") args.sitemap = next();
    else if (arg === "--urls") args.urls = next();
    else if (arg === "--prefix") args.prefix = next();
    else if (arg === "--site-url") args.siteUrl = next();
    else if (arg === "--limit") args.limit = Number(next()) || 0;
    else if (arg === "--delay-ms") args.delayMs = Number(next()) || defaults.delayMs;
    else if (arg === "--out-dir") args.outDir = next();
    else fail(`Unknown argument: ${arg}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write(`Usage:
  npm run seo:google:index-check -- --dry-run --limit 5
  npm run seo:google:index-check -- --limit 50
  npm run seo:google:index-check -- --urls urls.txt

Auth:
  Option A: set GOOGLE_ACCESS_TOKEN to a Search Console OAuth access token.
  Option B: set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON path.
  Option C: set GOOGLE_SERVICE_ACCOUNT_JSON to the service account JSON string.

Search Console setup:
  Add the Google account or service account email as a user on the
  https://yuetianai.com/ Search Console property, then run the script.

Options:
  --sitemap <path>     Local sitemap file. Default: sitemap-articles.xml
  --urls <path>        Plain text URL list, one URL per line.
  --prefix <url>       Only check URLs with this prefix. Default: articles/
  --site-url <url>     Search Console property URL. Default: https://yuetianai.com/
  --limit <n>          Check first n URLs after filtering.
  --delay-ms <n>       Delay between API calls. Default: 300
  --out-dir <path>     Report directory. Default: reports/google-indexing
  --dry-run            Print target URLs without calling Google.
`);
}

function normalizeSiteUrl(value) {
  const raw = String(value || "").trim() || defaults.siteUrl;
  if (raw.startsWith("sc-domain:")) return raw;
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function readUrls(args) {
  if (args.urls) {
    if (!existsSync(args.urls)) fail(`URL list not found: ${args.urls}`);
    return readFileSync(args.urls, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  }

  if (!existsSync(args.sitemap)) fail(`Sitemap not found: ${args.sitemap}`);
  const sitemap = readFileSync(args.sitemap, "utf8");
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function uniqueUrls(urls, prefix, limit) {
  const seen = new Set();
  const filtered = [];
  for (const url of urls) {
    if (prefix && !url.startsWith(prefix)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    filtered.push(url);
    if (limit > 0 && filtered.length >= limit) break;
  }
  return filtered;
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function readServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!existsSync(credentialPath)) fail(`GOOGLE_APPLICATION_CREDENTIALS not found: ${credentialPath}`, 2);
    return JSON.parse(readFileSync(credentialPath, "utf8"));
  }
  return null;
}

async function getAccessToken() {
  if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN.trim();

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    fail(
      "Missing Google auth. Set GOOGLE_ACCESS_TOKEN, GOOGLE_APPLICATION_CREDENTIALS, or GOOGLE_SERVICE_ACCOUNT_JSON. Run with --help for setup.",
      2,
    );
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    fail("Service account JSON must include client_email and private_key.", 2);
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(serviceAccount.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    fail(`OAuth token request failed: HTTP ${response.status} ${JSON.stringify(body)}`, 2);
  }
  return body.access_token;
}

async function inspectUrl(token, siteUrl, inspectionUrl) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${JSON.stringify(body)}`);
  }
  return body;
}

function summarize(url, body, error = "") {
  const index = body?.inspectionResult?.indexStatusResult || {};
  const mobile = body?.inspectionResult?.mobileUsabilityResult || {};
  const rich = body?.inspectionResult?.richResultsResult || {};
  const coverage = index.coverageState || "";
  const verdict = index.verdict || "";
  const indexed = verdict === "PASS" || (/indexed/i.test(coverage) && !/not indexed/i.test(coverage));
  return {
    url,
    indexed,
    verdict,
    coverageState: coverage,
    indexingState: index.indexingState || "",
    robotsTxtState: index.robotsTxtState || "",
    pageFetchState: index.pageFetchState || "",
    lastCrawlTime: index.lastCrawlTime || "",
    userCanonical: index.userCanonical || "",
    googleCanonical: index.googleCanonical || "",
    mobileVerdict: mobile.verdict || "",
    richResultsVerdict: rich.verdict || "",
    error,
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function writeReports(outDir, rows) {
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(outDir, `${stamp}.json`);
  const csvPath = path.join(outDir, `${stamp}.csv`);
  writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

  const headers = Object.keys(rows[0] || { url: "", indexed: "", coverageState: "", error: "" });
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  writeFileSync(csvPath, `${csv}\n`, "utf8");
  return { jsonPath, csvPath };
}

function printSummary(rows) {
  const indexedCount = rows.filter((row) => row.indexed).length;
  const errorCount = rows.filter((row) => row.error).length;
  log(`Checked ${rows.length} URL(s): indexed=${indexedCount}, notIndexed=${rows.length - indexedCount - errorCount}, errors=${errorCount}`);
  for (const row of rows) {
    const status = row.error ? "ERROR" : row.indexed ? "INDEXED" : "NOT_INDEXED";
    const detail = row.error || row.coverageState || row.verdict || "no coverage detail";
    process.stdout.write(`${status}\t${detail}\t${row.url}\n`);
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const siteUrl = normalizeSiteUrl(args.siteUrl);
  const urls = uniqueUrls(readUrls(args), args.prefix, args.limit);
  if (urls.length === 0) fail("No URLs matched the selected sitemap/list and prefix.");

  if (args.dryRun) {
    log(`Dry run: ${urls.length} URL(s) would be checked against ${siteUrl}`);
    for (const url of urls) process.stdout.write(`${url}\n`);
    return;
  }

  const token = await getAccessToken();
  const rows = [];
  for (const [index, url] of urls.entries()) {
    try {
      log(`Inspecting ${index + 1}/${urls.length}: ${url}`);
      const body = await inspectUrl(token, siteUrl, url);
      rows.push(summarize(url, body));
    } catch (error) {
      rows.push(summarize(url, null, error.message));
    }
    if (index < urls.length - 1 && args.delayMs > 0) await sleep(args.delayMs);
  }

  printSummary(rows);
  const reports = writeReports(args.outDir, rows);
  log(`Report written: ${reports.jsonPath}`);
  log(`Report written: ${reports.csvPath}`);
}

main().catch((error) => fail(error.message));
