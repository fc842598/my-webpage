import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";

// Read-only audit. Explicit targets are a release gate; --scan reports legacy
// debt without pretending that all Chinese text can be safely auto-translated.
const scan = process.argv.includes("--scan");
const files = scan
  ? readdirSync("articles/en").filter(name => name.endsWith(".html")).map(name => `articles/en/${name}`)
  : process.argv.slice(2);
assert(files.length, "Provide English HTML paths, or --scan");
const findings = [];
for (const file of files) {
  assert(/^articles\/en\/[a-z0-9-]+\.html$/i.test(file), "English article paths only");
  const html = readFileSync(file, "utf8");
  const readable = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ");
  const chinese = [...new Set(readable.match(/[\u3400-\u9fff]+/g) || [])];
  const phrases = readable.match(/pride of face|proud of face|Self Palace/g) || [];
  if (chinese.length || phrases.length) findings.push({ file, chinese, phrases });
}
console.log(JSON.stringify({ checked: files.length, flagged: findings.length, findings }, null, 2));
if (!scan && findings.length) process.exitCode = 1;
