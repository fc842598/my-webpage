import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function printUsage() {
  console.log(`Usage:
  node scripts/install-toutiao-verification-file.mjs <verification-file.html> [--force] [--dry-run] [--domain=https://yuetianai.com]

Examples:
  node scripts/install-toutiao-verification-file.mjs C:\\Users\\1\\Downloads\\toutiao_verify_xxx.html
  node scripts/install-toutiao-verification-file.mjs ./Downloads/toutiao_verify_xxx.html --dry-run
`);
}

function normalizePath(filePath) {
  if (/^file:\/\//i.test(filePath)) {
    return new URL(filePath);
  }
  return path.resolve(filePath);
}

function parseArgs(argv) {
  const flags = {
    force: false,
    dryRun: false,
    domain: "https://yuetianai.com"
  };
  const positional = [];

  for (const arg of argv) {
    if (arg === "--force") {
      flags.force = true;
      continue;
    }
    if (arg === "--dry-run") {
      flags.dryRun = true;
      continue;
    }
    if (arg.startsWith("--domain=")) {
      flags.domain = arg.slice("--domain=".length).replace(/\/+$/, "");
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    positional.push(arg);
  }

  return { flags, positional };
}

function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));

  if (flags.help || positional.length !== 1) {
    printUsage();
    process.exit(flags.help ? 0 : 1);
  }

  const sourcePath = normalizePath(positional[0]);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`验证文件不存在: ${sourcePath}`);
  }

  const stat = fs.statSync(sourcePath);
  if (!stat.isFile()) {
    throw new Error(`不是文件: ${sourcePath}`);
  }

  const fileName = path.basename(sourcePath);
  if (!/^[A-Za-z0-9._-]+\.html$/i.test(fileName)) {
    throw new Error(`头条验证文件必须是可公开访问的 .html 文件，当前文件名不符合预期: ${fileName}`);
  }

  const content = fs.readFileSync(sourcePath, "utf8");
  if (!content.trim()) {
    throw new Error(`验证文件内容为空: ${sourcePath}`);
  }

  const targetPath = path.join(rootDir, fileName);
  const targetUrl = `${flags.domain}/${fileName}`;

  if (fs.existsSync(targetPath)) {
    const existing = fs.readFileSync(targetPath, "utf8");
    if (existing === content) {
      console.log(`验证文件已存在且内容一致: ${targetPath}`);
      console.log(`验证 URL: ${targetUrl}`);
      return;
    }
    if (!flags.force) {
      throw new Error(`目标文件已存在且内容不同，请确认后加 --force 覆盖: ${targetPath}`);
    }
  }

  if (flags.dryRun) {
    console.log(`[dry-run] 将复制验证文件到: ${targetPath}`);
    console.log(`[dry-run] 验证 URL 将是: ${targetUrl}`);
    return;
  }

  fs.copyFileSync(sourcePath, targetPath);

  console.log(`已安装头条验证文件: ${targetPath}`);
  console.log(`验证 URL: ${targetUrl}`);
  console.log("下一步:");
  console.log(`1. git add ${fileName}`);
  console.log(`2. git commit -m "Add Toutiao verification file"`);
  console.log("3. git push origin master");
  console.log("4. 等线上同步后，在头条站长平台点击验证");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
