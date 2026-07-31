import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(path.join(tmpdir(), "yuetian-article-performance-"));
const output = path.join(temp, "report.json");
const strategy = path.join(temp, "strategy.md");

try {
  const result = spawnSync(process.execPath, [
    "scripts/collect-article-performance.mjs",
    "--days", "30",
    "--date", "2099-01-01",
    "--input", "scripts/fixtures/article-performance-confidence.json",
    "--output", output,
    "--strategy", strategy,
  ], { cwd: ROOT, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(readFileSync(output, "utf8"));
  const pages = (items) => items.map((item) => item.page);

  assert.equal(report.version, 2);
  assert.ok(pages(report.winners).includes("/articles/ziwei-huan-gongzuo-xiankan-guanlu-haishi-qianyi.html"));
  assert.ok(pages(report.winners).includes("/articles/en/ziwei-huan-gongzuo-xiankan-guanlu-haishi-qianyi.html"));
  assert.deepEqual(pages(report.opportunities), ["/articles/ziwei-shihe-dai-tuandui-youke-meiquan-youquan-meike.html"]);
  assert.deepEqual(pages(report.rankingOpportunities), ["/articles/ziwei-liunian-qianyi.html"]);
  assert.ok(pages(report.observations).includes("/articles/ziwei-bankong-zhechi.html"));
  assert.equal(report.observations.find((item) => item.page === "/articles/ziwei-bankong-zhechi.html").learning.confidence, "low");

  const finance = report.categories.find((item) => item.category === "财运事业");
  assert.equal(finance.clicks, 6, "paired English demand must feed the Chinese planning category");
  assert.equal(finance.articleCount, 3);

  assert.equal(report.nextBatchAllocation.length, 9);
  assert.equal(report.nextBatchAllocation.reduce((sum, item) => sum + item.allocation, 0), 30);
  assert.ok(report.nextBatchAllocation.every((item) => item.allocation >= 2 && item.allocation <= 8));
  assert.ok(report.nextBatchAllocation.every((item) => ["low", "medium", "high"].includes(item.confidence)));

  const strategyText = readFileSync(strategy, "utf8");
  assert.match(strategyText, /优先优化原页标题与摘要/);
  assert.match(strategyText, /优先加强原页内容与内链/);
  assert.match(strategyText, /样本不足只观察/);
  console.log("Article performance learning tests passed.");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
