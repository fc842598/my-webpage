import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const defaultHost = "yuetianai.com";
const defaultSiteUrl = `https://${defaultHost}`;
const remoteSitemapUrl = `${defaultSiteUrl}/sitemap.xml`;
const defaultKeyPath = "8d5c8f7d8a0f4e8cb61a5f62b3d41944.txt";

function log(message) {
  process.stdout.write(`[indexnow-auto-submit] ${message}\n`);
}

function warn(message) {
  process.stderr.write(`[indexnow-auto-submit] ${message}\n`);
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

function toCanonicalIndexNowUrl(url, siteUrl = defaultSiteUrl) {
  if (!url) return "";
  return url
    .replace(/^https:\/\/yuetianai\.com/i, siteUrl)
    .replace(/^https:\/\/www\.yuetianai\.com/i, siteUrl);
}

function urlForFile(filePath, siteUrl = defaultSiteUrl) {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized === "index.html") return `${siteUrl}/`;
  if (normalized === "articles/index.html") return `${siteUrl}/articles/`;
  if (normalized.startsWith("articles/") && normalized.endsWith(".html")) {
    return `${siteUrl}/${normalized}`;
  }
  if (normalized.startsWith("pages/") && normalized.endsWith(".html")) {
    return `${siteUrl}/${normalized}`;
  }
  if (normalized === "404.html") return `${siteUrl}/404.html`;
  if (normalized === "llms.txt") return `${siteUrl}/llms.txt`;
  if (normalized === "robots.txt") return `${siteUrl}/robots.txt`;
  if (normalized === "feed.xml") return `${siteUrl}/feed.xml`;
  if (normalized === "brand-profile.xml") return `${siteUrl}/brand-profile.xml`;
  if (normalized === "brand-profile.jsonld") return `${siteUrl}/brand-profile.jsonld`;
  return null;
}

function extractUrlsFromSitemap(commitSha, siteUrl = defaultSiteUrl) {
  const sitemap = readTrackedFile(commitSha, "sitemap.xml");
  if (!sitemap) return [];
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => toCanonicalIndexNowUrl(match[1].trim(), siteUrl))
    .filter(Boolean);
}

function collectUrls(changedFiles, commitSha, siteUrl = defaultSiteUrl) {
  const urls = new Set();
  for (const filePath of changedFiles) {
    const mapped = urlForFile(filePath, siteUrl);
    if (mapped) urls.add(mapped);
  }
  if (changedFiles.includes("sitemap.xml")) {
    for (const sitemapUrl of extractUrlsFromSitemap(commitSha, siteUrl)) {
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

function normalizeSiteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return defaultSiteUrl;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return `https://${raw.replace(/^\/+|\/+$/g, "")}`;
}

function normalizeHost(value) {
  return normalizeSiteUrl(value).replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

function readKeyFile(filePath) {
  const absolutePath = path.join(repoRoot, filePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing IndexNow key file: ${filePath}`);
  }
  return readFileSync(absolutePath, "utf8").trim();
}

async function submitToIndexNow(host, key, keyLocation, urls) {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: urls,
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`IndexNow HTTP ${response.status}: ${bodyText}`);
  }
  return bodyText;
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

  if (changedFileList.length === 0) {
    log("No changed files detected for this push; skipping IndexNow submission.");
    return;
  }

  const siteUrl = normalizeSiteUrl(process.env.INDEXNOW_SITE_URL || "");
  const host = normalizeHost(process.env.INDEXNOW_HOST || siteUrl);
  const keyPath = process.env.INDEXNOW_KEY_PATH || defaultKeyPath;
  const key = readKeyFile(keyPath);
  const keyLocation = `${siteUrl}/${keyPath.replace(/\\/g, "/")}`;

  const urls = collectUrls(changedFileList, targetCommit, siteUrl).filter((url) => url.startsWith(siteUrl));
  if (urls.length === 0) {
    log("No indexable URLs matched this push; skipping IndexNow submission.");
    return;
  }

  log(`Detected ${urls.length} URL(s) to submit.`);
  await waitForRemoteSync(targetCommit);

  try {
    await submitToIndexNow(host, key, keyLocation, urls);
    log(`IndexNow submission finished: success=${urls.length}`);
  } catch (error) {
    warn(`IndexNow submission failed: ${error.message}`);
  }
}

main().catch((error) => {
  warn(`Unhandled failure: ${error.message}`);
  process.exitCode = 1;
});
