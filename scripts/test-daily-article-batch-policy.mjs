import assert from "node:assert/strict";
import {
  FIRST_RELEASE_MINUTE,
  LAST_RELEASE_MINUTE,
  assertProductionBatchSize,
  validateProductionSchedule,
} from "./daily-article-batch-policy.mjs";

function timeAt(minute) {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

function spreadSchedule(count) {
  const span = LAST_RELEASE_MINUTE - FIRST_RELEASE_MINUTE;
  return Array.from({ length: count }, (_, index) => timeAt(FIRST_RELEASE_MINUTE + Math.round(index * span / (count - 1))));
}

for (const count of [10, 20, 30]) {
  assert.equal(assertProductionBatchSize(count), count);
  const schedule = validateProductionSchedule(spreadSchedule(count));
  assert.equal(schedule.count, count);
  assert.equal(schedule.windows.length, 3);
  assert.ok(schedule.gaps.every((gap) => gap >= 10));
}

for (const count of [0, 9, 31, 10.5]) {
  assert.throws(() => assertProductionBatchSize(count), /10-30 articles/);
}

assert.throws(
  () => validateProductionSchedule(["09:00", ...spreadSchedule(10).slice(1)]),
  /between 09:10 and 22:50/,
);
assert.throws(
  () => validateProductionSchedule(Array.from({ length: 10 }, (_, index) => timeAt(FIRST_RELEASE_MINUTE + index * 11))),
  /cover morning, afternoon, and evening/,
);

const recovery = validateProductionSchedule(
  ["16:40", "17:18", "17:56", "18:34", "19:12", "19:50", "20:28", "21:06", "21:44", "22:22"],
  { recovery: true },
);
assert.equal(recovery.recovery, true);
assert.ok(recovery.gaps.every((gap) => gap >= 10));
assert.throws(
  () => validateProductionSchedule(
    ["19:00", "19:12", "19:24", "19:36", "19:48", "20:00", "20:12", "20:24", "20:36", "20:48"],
    { recovery: true },
  ),
  /span at least 3 hours/,
);

console.log("Daily article 10-30 batch policy tests passed.");
