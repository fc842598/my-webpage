import assert from "node:assert/strict";
import { assertProductionPublishWindow, shanghaiMinute } from "./article-publish-time-gate.mjs";

const now = new Date("2026-08-01T09:10:30+08:00");
const base = {
  productionRoot: true,
  explicitDate: true,
  explicitTime: true,
  hasExplicitTimes: false,
  publishDate: "2026-08-01",
  publishTime: "09:10",
  scheduleTimes: ["09:10"],
  articleCount: 1,
  now,
};

assert.deepEqual(shanghaiMinute(now), { date: "2026-08-01", time: "09:10" });
assert.equal(assertProductionPublishWindow(base).ageMinutes, 0);
assert.equal(assertProductionPublishWindow({ ...base, publishTime: "09:09", scheduleTimes: ["09:09"] }).ageMinutes, 1);
assert.equal(assertProductionPublishWindow({ ...base, publishTime: "09:08", scheduleTimes: ["09:08"] }).ageMinutes, 2);
assert.throws(
  () => assertProductionPublishWindow({ ...base, publishTime: "09:11", scheduleTimes: ["09:11"] }),
  /Future article exposure is forbidden/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, publishDate: "2026-08-02" }),
  /must use today's Asia\/Shanghai date/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, explicitTime: false }),
  /requires explicit --date.*--time/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, hasExplicitTimes: true }),
  /does not allow --times/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, articleCount: 2, scheduleTimes: ["09:10", "09:10"] }),
  /exactly one Chinese-English article pair/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, scheduleTimes: ["09:09"] }),
  /schedule time must match/,
);
assert.throws(
  () => assertProductionPublishWindow({ ...base, publishTime: "09:07", scheduleTimes: ["09:07"] }),
  /actual execution minute/,
);
assert.deepEqual(
  assertProductionPublishWindow({ ...base, productionRoot: false, publishDate: "2099-01-01" }),
  { enforced: false },
);

console.log("Article production time gate tests passed.");
