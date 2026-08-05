export const MIN_PRODUCTION_ARTICLES = 10;
export const MAX_PRODUCTION_ARTICLES = 30;
export const FIRST_RELEASE_MINUTE = 9 * 60 + 10;
export const LAST_RELEASE_MINUTE = 22 * 60 + 50;

export function assertProductionBatchSize(value, label = "Article batch") {
  const count = Number(value);
  if (!Number.isInteger(count) || count < MIN_PRODUCTION_ARTICLES || count > MAX_PRODUCTION_ARTICLES) {
    throw new Error(`${label} must contain ${MIN_PRODUCTION_ARTICLES}-${MAX_PRODUCTION_ARTICLES} articles; got ${value}`);
  }
  return count;
}

export function validateProductionSchedule(times) {
  const count = assertProductionBatchSize(times.length, "Production schedule");
  const minutes = times.map((time) => {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error(`Invalid release time: ${time}`);
    return Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  });
  if (new Set(minutes).size !== count) throw new Error("Publish times must be unique");
  if (minutes.some((minute, index) => index > 0 && minute <= minutes[index - 1])) {
    throw new Error("Publish times must be sorted");
  }
  if (minutes[0] < FIRST_RELEASE_MINUTE || minutes.at(-1) > LAST_RELEASE_MINUTE) {
    throw new Error("Production releases must stay between 09:10 and 22:50 Asia/Shanghai");
  }
  const gaps = minutes.slice(1).map((minute, index) => minute - minutes[index]);
  if (gaps.some((gap) => gap < 10)) throw new Error("Publish slots must be at least 10 minutes apart");

  const windows = [0, 0, 0];
  minutes.forEach((minute) => {
    if (minute < 14 * 60) windows[0] += 1;
    else if (minute < 18 * 60 + 30) windows[1] += 1;
    else windows[2] += 1;
  });
  const minimumPerWindow = count >= 25 ? 4 : count >= 16 ? 3 : 2;
  if (windows.some((windowCount) => windowCount < minimumPerWindow)) {
    throw new Error(`Release times must cover morning, afternoon, and evening: ${windows.join(",")}`);
  }
  return { count, minutes, gaps, windows, minimumPerWindow };
}
