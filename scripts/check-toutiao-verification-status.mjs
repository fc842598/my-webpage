import fs from "fs";
import path from "path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function printUsage() {
  console.log(`Usage:
  node scripts/check-toutiao-verification-status.mjs [verification-file.html] [--domain=https://yuetianai.com]

Examples:
  node scripts/check-toutiao-verification-status.mjs
  node scripts/check-toutiao-verification-status.mjs toutiao_verify_xxx.html
  node scripts/check-toutiao-verification-status.mjs toutiao_verify_xxx.html --domain=https://www.yuetianai.com
`);
}

function parseArgs(argv) {
  const flags = {
    domain: "https://yuetianai.com",
    help: false,
  };
  const positional = [];

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    if (arg.startsWith("--domain=")) {
      flags.domain = arg.slice("--domain=".length).replace(/\/+$/, "");
      continue;
    }
    positional.push(arg);
  }

  return { flags, positional };
}

function listCandidateFiles() {
  return fs
    .readdirSync(rootDir)
    .filter((name) => name.toLowerCase().endsWith(".html"))
    .filter((name) => !["index.html", "404.html"].includes(name.toLowerCase()));
}

function resolveCandidate(fileName) {
  const candidates = listCandidateFiles();
  if (fileName) {
    const exact = candidates.find((name) => name === fileName);
    if (!exact) {
      throw new Error(`仓库根目录没找到验证文件: ${fileName}`);
    }
    return exact;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  if (candidates.length === 0) {
    throw new Error("仓库根目录还没有头条验证 HTML 文件。先运行 geo:toutiao:install-file。");
  }

  throw new Error(
    `检测到多个根目录 HTML 文件，无法自动判断验证文件，请手动指定其中文件名:\n- ${candidates.join("\n- ")}`
  );
}

async function checkRemoteFile(domain, fileName) {
  const url = `${domain}/${fileName}`;
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 Codex Toutiao Verification Check"
    }
  });
  const text = await response.text();
  return {
    url,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    bodyPreview: text.slice(0, 120).replace(/\s+/g, " ").trim(),
  };
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));

  if (flags.help || positional.length > 1) {
    printUsage();
    process.exit(flags.help ? 0 : 1);
  }

  const fileName = resolveCandidate(positional[0]);
  const localPath = path.join(rootDir, fileName);

  console.log(`本地验证文件: ${localPath}`);

  const result = await checkRemoteFile(flags.domain, fileName);
  console.log(`线上验证 URL: ${result.url}`);
  console.log(`HTTP 状态: ${result.status}`);
  console.log(`Content-Type: ${result.contentType}`);
  console.log(`响应预览: ${result.bodyPreview || "(empty)"}`);

  if (result.status !== 200) {
    process.exitCode = 1;
    return;
  }

  console.log("头条验证文件已可在线访问。下一步可直接回头条站长平台点击验证。");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
