const SHANGHAI_TIME_ZONE = "Asia/Shanghai";

export function shanghaiMinute(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function minuteNumber(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

export function assertProductionPublishWindow({
  productionRoot,
  explicitDate,
  explicitTime,
  hasExplicitTimes,
  publishDate,
  publishTime,
  scheduleTimes,
  articleCount,
  now = new Date(),
}) {
  if (!productionRoot) return { enforced: false };
  if (!explicitDate || !explicitTime) {
    throw new Error("Production publishing requires explicit --date YYYY-MM-DD and --time HH:MM.");
  }
  if (hasExplicitTimes) {
    throw new Error("Production publishing does not allow --times; release one article with the actual --time.");
  }
  if (articleCount !== 1 || scheduleTimes.length !== 1) {
    throw new Error("Production publishing releases exactly one Chinese-English article pair per slot.");
  }
  if (scheduleTimes[0] !== publishTime) {
    throw new Error("The article schedule time must match the explicit production --time.");
  }

  const current = shanghaiMinute(now);
  if (publishDate !== current.date) {
    throw new Error(`Production publishing must use today's Asia/Shanghai date ${current.date}, not ${publishDate}.`);
  }
  const ageMinutes = minuteNumber(current.time) - minuteNumber(publishTime);
  if (ageMinutes < 0) {
    throw new Error(`Future article exposure is forbidden: ${publishDate} ${publishTime} is later than ${current.time}.`);
  }
  if (ageMinutes > 2) {
    throw new Error(`Production --time must be the actual execution minute; ${publishTime} is ${ageMinutes} minutes old.`);
  }
  return { enforced: true, current, ageMinutes };
}
