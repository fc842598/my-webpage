import assert from "node:assert/strict";
import { assessQuota, shanghaiDate } from "./check-daily-article-quota.mjs";

const date = "2026-10-26";
const article = (index, extra = {}) => ({ slug: `article-${index}`, publishedAt: `${date}T09:00:00+08:00`, zhOk: true, enOk: true, ...extra });
const twenty = Array.from({ length: 20 }, (_, index) => article(index));

assert.equal(assessQuota([article(0)], date).complete, false, "one successful article must not pass a twenty-article day");
assert.equal(assessQuota([article(0)], date).remainingToPublish, 19);
assert.equal(assessQuota(twenty, date).complete, true);
assert.equal(assessQuota(twenty.slice(0, 19), date).complete, false);
const missingEnglish = twenty.map((record, index) => index === 3 ? { ...record, enOk: false } : record);
assert.equal(assessQuota(missingEnglish, date).complete, false, "twenty Chinese articles with one missing English page must fail");
assert.equal(assessQuota(missingEnglish, date).remainingToPublish, 0, "repair a missing translation without publishing a twenty-first topic");
assert.deepEqual(assessQuota(missingEnglish, date).verificationFailures, ["article-3"]);
assert.equal(assessQuota([...twenty, article(20)], date).overQuota, true);
assert.equal(assessQuota([...twenty, article(20)], date).complete, false);
assert.equal(assessQuota([article(0, { publishedAt: "2026-09-26T09:00:00+08:00" })], date).published, 0, "backfilled old articles must not fill today's quota");
assert.equal(shanghaiDate("2026-10-25T16:00:00Z"), date, "the day changes at Shanghai midnight");
assert.equal(shanghaiDate("2026-10-26T15:59:59Z"), date);
assert.equal(shanghaiDate("2026-10-26T16:00:00Z"), "2026-10-27");
assert.throws(() => assessQuota([...twenty, article(0)], date), /Duplicate/);
assert.throws(() => assessQuota([], "2026-02-30"), /Invalid date/);
console.log("Daily quota regression checks passed.");
