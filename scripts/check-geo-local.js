const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const corePages = [
  "index.html",
  "pages/mingbook-onepage.html",
  "pages/wentian-app.html",
  "pages/yangzhai.html",
  "pages/contact.html",
  "pages/privacy.html",
  "pages/liuyao.html",
  "pages/liuyao-v2.html",
  "pages/yuetianai.html",
  "pages/yuetianai-product.html",
  "pages/ai-ziwei-paipan.html",
  "articles/index.html"
];

const machineLinkedPages = new Set([
  "index.html",
  "pages/yuetianai.html",
  "pages/yuetianai-product.html",
  "pages/ai-ziwei-paipan.html",
  "articles/index.html"
]);

function readFile(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

function pickMeta(html, name) {
  const re = new RegExp(
    `<meta[^>]+${name.includes(":") ? "property" : "name"}=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  return html.match(re)?.[1]?.trim() ?? "";
}

function pickLink(html, rel) {
  const re = new RegExp(
    `<link[^>]+rel=["']${escapeRegExp(rel)}["'][^>]+href=["']([^"']+)["']`,
    "i"
  );
  return html.match(re)?.[1]?.trim() ?? "";
}

function pickTagText(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  return html.match(re)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensure(condition, message, failures) {
  if (!condition) failures.push(message);
}

function checkHtmlFile(relPath, failures) {
  const html = readFile(relPath);
  ensure(pickTagText(html, "title"), `${relPath}: 缺少 title`, failures);
  ensure(pickMeta(html, "description"), `${relPath}: 缺少 description`, failures);
  ensure(pickLink(html, "canonical"), `${relPath}: 缺少 canonical`, failures);
  ensure(pickTagText(html, "h1"), `${relPath}: 缺少 H1`, failures);
  if (machineLinkedPages.has(relPath)) {
    ensure(/feed\.xml/i.test(html), `${relPath}: 缺少 feed.xml 机器入口`, failures);
    ensure(/brand-profile\.jsonld/i.test(html), `${relPath}: 缺少 brand-profile.jsonld 机器入口`, failures);
    ensure(/brand-profile\.xml/i.test(html), `${relPath}: 缺少 brand-profile.xml 机器入口`, failures);
  }
}

function checkCorePages(failures) {
  for (const relPath of corePages) {
    checkHtmlFile(relPath, failures);
  }
}

function checkArticles(failures) {
  const articlesDir = path.join(rootDir, "articles");
  const articleFiles = fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".html") && file !== "index.html");

  for (const file of articleFiles) {
    const relPath = path.posix.join("articles", file);
    const html = readFile(relPath);
    ensure(pickTagText(html, "title"), `${relPath}: 缺少 title`, failures);
    ensure(pickMeta(html, "description"), `${relPath}: 缺少 description`, failures);
    ensure(pickLink(html, "canonical"), `${relPath}: 缺少 canonical`, failures);
    ensure(pickTagText(html, "h1"), `${relPath}: 缺少 H1`, failures);
    ensure(/"@type"\s*:\s*"BreadcrumbList"/.test(html), `${relPath}: 缺少 BreadcrumbList`, failures);
  }
}

function checkSupportFiles(failures) {
  const llms = readFile("llms.txt");
  ensure(/YuetianAI|阅天AI/.test(llms), "llms.txt: 缺少品牌实体", failures);

  const notFound = readFile("404.html");
  ensure(/noindex,follow/i.test(notFound), "404.html: 缺少 noindex robots", failures);

  const robots = readFile("robots.txt");
  ensure(/sitemap\.xml/i.test(robots), "robots.txt: 缺少 sitemap.xml", failures);

  const sitemap = readFile("sitemap.xml");
  ensure(/<urlset/i.test(sitemap) || /<sitemapindex/i.test(sitemap), "sitemap.xml: 不是有效 sitemap", failures);

  const feed = readFile("feed.xml");
  ensure(/<rss/i.test(feed) && /阅天AI|YuetianAI/.test(feed), "feed.xml: 缺少有效订阅内容", failures);

  const brandProfileJsonLd = readFile("brand-profile.jsonld");
  ensure(/"@context"\s*:\s*"https:\/\/schema.org"/.test(brandProfileJsonLd), "brand-profile.jsonld: 缺少 schema context", failures);
  ensure(/YuetianAI|阅天AI/.test(brandProfileJsonLd), "brand-profile.jsonld: 缺少品牌实体", failures);

  const brandProfile = readFile("brand-profile.xml");
  ensure(/<brandProfile/i.test(brandProfile) && /阅天AI|YuetianAI/.test(brandProfile), "brand-profile.xml: 缺少品牌实体", failures);
}

function main() {
  const failures = [];
  checkCorePages(failures);
  checkArticles(failures);
  checkSupportFiles(failures);

  if (failures.length) {
    console.error("Local GEO check failed:");
    for (const item of failures) {
      console.error(`- ${item}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Local GEO check passed.");
}

main();
