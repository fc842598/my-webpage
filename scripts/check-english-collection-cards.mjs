import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";

// Verify semantic card content, not just that deployment matches a local file.
const targets = process.argv.slice(2);
assert(targets.length, "Provide revised articles/en/*.html paths");
const schemas = html => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => JSON.parse(match[1]));
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const articles = targets.map(file => {
  assert(/^articles\/en\/[a-z0-9-]+\.html$/i.test(file), "English article paths only");
  const article = schemas(readFileSync(file, "utf8")).find(item => item["@type"] === "Article");
  assert(article, `Missing Article schema: ${file}`);
  return { file, slug: file.split("/").at(-1), article, cards: 0 };
});
const failures = [];
let checked = 0;
for (const name of readdirSync("articles/en").filter(name => name.endsWith(".html"))) {
  const html = readFileSync(`articles/en/${name}`, "utf8");
  if (schemas(html).some(item => item["@type"] === "Article")) continue;
  for (const match of html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)) {
    const block = match[0];
    for (const item of articles) {
      if (!block.includes(`href="${item.slug}"`) && !block.includes(`href="https://yuetianai.com/${item.file}"`)) continue;
      item.cards++;
      checked++;
      const heading = block.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1];
      const summary = block.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1];
      if (heading !== escape(item.article.headline) || summary !== escape(item.article.description)) {
        failures.push({ collection: `articles/en/${name}`, article: item.file, headingMatches: heading === escape(item.article.headline), summaryMatches: summary === escape(item.article.description) });
      }
    }
  }
}
for (const item of articles) if (!item.cards) failures.push({ article: item.file, error: "No collection card found" });
console.log(JSON.stringify({ articles: articles.length, checkedCards: checked, failures }, null, 2));
if (failures.length) process.exitCode = 1;
