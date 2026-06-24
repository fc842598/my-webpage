import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const defaultSiteUrl = "https://www.yuetianai.com";
const remoteSitemapUrl = `${defaultSiteUrl}/sitemap.xml`;

function log(message) {
  process.stdout.write(`[baidu-auto-submit] ${message}\n`);
}

function warn(message) {
  process.stderr.write(`[baidu-auto-submit] ${message}\n`);
}

function runGit(args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  }).trim();
}

function readHookInput() {
  const inputPath = process.argv[2];
  if (inputPath && existsSync(inputPath)) {
    return readFileSync(inputPath, "utf8");
  }
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parsePushRefs(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [localRef, localSha, remoteRef, remoteSha] = line.split(/\s+/);
      return { localRef, localSha, remoteRef, remoteSha };
    })
    .filter((ref) => ref.localRef && ref.localSha && ref.remoteRef && ref.remoteSha);
}

function readConfig(key) {
  try {
    return runGit(["config", "--get", key]);
  } catch {
    return "";
  }
}

function isZeroSha(value) {
  return /^0+$/.test(value || "");
}

function listChangedFiles(remoteSha, localSha) {
  if (!localSha || isZeroSha(localSha)) return [];
  if (!remoteSha || isZeroSha(remoteSha)) {
    return runGit(["show", "--pretty=", "--name-only", localSha])
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return runGit(["diff", "--name-only", `${remoteSha}..${localSha}`])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toWwwUrl(url) {
  if (!url) return url;
  return url.replace(/^https:\/\/yuetianai\.com/i, defaultSiteUrl);
}

function normalizeSiteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return defaultSiteUrl;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return `https://${raw.replace(/^\/+|\/+$/g, "")}`;
}

function normalizeSiteParam(value) {
  return normalizeSiteUrl(value)
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function urlForFile(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized === "index.html") return `${defaultSiteUrl}/`;
  if (normalized === "articles/index.html") return `${defaultSiteUrl}/articles/`;
  if (normalized.startsWith("articles/") && normalized.endsWith(".html")) {
    return `${defaultSiteUrl}/${normalized}`;
  }
  if (normalized.startsWith("pages/") && normalized.endsWith(".html")) {
    return `${defaultSiteUrl}/${normalized}`;
  }
  if (normalized === "404.html") return `${defaultSiteUrl}/404.html`;
  if (normalized === "llms.txt") return `${defaultSiteUrl}/llms.txt`;
  if (normalized === "robots.txt") return `${defaultSiteUrl}/robots.txt`;
  return null;
}

function readTrackedFile(commitSha, filePath) {
  if (commitSha) {
    try {
      return runGit(["show", `${commitSha}:${filePath}`]);
    } catch {
      return "";
    }
  }
  const absolutePath = path.join(repoRoot, filePath);
  if (!existsSync(absolutePath)) return "";
  return readFileSync(absolutePath, "utf8");
}

function extractUrlsFromSitemap(commitSha) {
  const sitemap = readTrackedFile(commitSha, "sitemap.xml");
  if (!sitemap) return [];
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => toWwwUrl(match[1].trim()))
    .filter(Boolean);
}

function collectUrls(changedFiles, commitSha) {
  const urls = new Set();
  for (const filePath of changedFiles) {
    const mapped = urlForFile(filePath);
    if (mapped) urls.add(mapped);
  }

  const touchedSitemap = changedFiles.includes("sitemap.xml");
  if (touchedSitemap) {
    for (const sitemapUrl of extractUrlsFromSitemap(commitSha)) {
      urls.add(sitemapUrl);
    }
  }

  return [...urls];
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function waitForRemoteSync(commitSha) {
  const localSitemap = readTrackedFile(commitSha, "sitemap.xml").trim();
  if (!localSitemap) return true;
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const remoteSitemap = (await fetchText(remoteSitemapUrl)).trim();
      if (remoteSitemap === localSitemap) {
        log(`Remote sitemap matched local copy on attempt ${attempt}.`);
        return true;
      }
    } catch (error) {
      warn(`Remote sitemap check failed on attempt ${attempt}: ${error.message}`);
    }
    await sleep(10000);
  }
  warn("Remote sitemap did not match within the wait window; continuing anyway.");
  return false;
}

async function submitToBaidu(urls, siteParam, token) {
  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(siteParam)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: urls.join("\n"),
  });

  const bodyText = await response.text();
  let data;
  try {
    data = JSON.parse(bodyText);
  } catch {
    data = { raw: bodyText };
  }

  if (!response.ok) {
    throw new Error(`Baidu API HTTP ${response.status}: ${bodyText}`);
  }

  return data;
}

async function main() {
  const pushRefs = parsePushRefs(readHookInput());
  const branchPushes = pushRefs.filter((ref) => ref.remoteRef === "refs/heads/master" && !isZeroSha(ref.localSha));
  let targetCommit = "";
  let changedFileList = [];

  if (branchPushes.length > 0) {
    targetCommit = branchPushes[branchPushes.length - 1].localSha;
    const changedFiles = new Set();
    for (const ref of branchPushes) {
      for (const filePath of listChangedFiles(ref.remoteSha, ref.localSha)) {
        changedFiles.add(filePath);
      }
    }
    changedFileList = [...changedFiles];
  } else {
    targetCommit = runGit(["rev-parse", "HEAD"]);
    const previousCommit = runGit(["rev-parse", "HEAD~1"]);
    changedFileList = listChangedFiles(previousCommit, targetCommit);
    log("No post-push refs detected; falling back to HEAD..HEAD~1 diff.");
  }

  const configuredSite = readConfig("seo.baiduPushSite") || defaultSiteUrl;
  const siteUrl = normalizeSiteUrl(configuredSite);
  const siteParam = normalizeSiteParam(configuredSite);
  const token = readConfig("seo.baiduPushToken");
  if (!token) {
    warn("Missing git config `seo.baiduPushToken`; skipping Baidu submission.");
    return;
  }

  if (changedFileList.length === 0) {
    log("No changed files detected for this push; skipping Baidu submission.");
    return;
  }

  const urls = collectUrls(changedFileList, targetCommit).filter((url) => url.startsWith(siteUrl));
  if (urls.length === 0) {
    log("No indexable URLs matched this push; skipping Baidu submission.");
    return;
  }

  log(`Detected ${urls.length} URL(s) to submit.`);
  await waitForRemoteSync(targetCommit);

  try {
    const result = await submitToBaidu(urls, siteParam, token);
    const parts = [];
    if (typeof result.success !== "undefined") parts.push(`success=${result.success}`);
    if (typeof result.remain !== "undefined") parts.push(`remain=${result.remain}`);
    if (Array.isArray(result.not_same_site) && result.not_same_site.length) parts.push(`not_same_site=${result.not_same_site.length}`);
    if (Array.isArray(result.not_valid) && result.not_valid.length) parts.push(`not_valid=${result.not_valid.length}`);
    if (result.error) parts.push(`error=${result.error}`);
    if (result.message) parts.push(`message=${result.message}`);
    log(`Baidu submission finished: ${parts.join(", ") || JSON.stringify(result)}`);
  } catch (error) {
    warn(`Baidu submission failed: ${error.message}`);
  }
}

main().catch((error) => {
  warn(`Unhandled failure: ${error.message}`);
  process.exitCode = 1;
});
