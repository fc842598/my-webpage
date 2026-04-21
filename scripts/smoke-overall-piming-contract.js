'use strict';

const DEFAULT_BASE =
  process.env.AI_PIMING_BASE_URL ||
  'https://ai-piming-backend-production.up.railway.app';

function parseArg(prefix, fallback) {
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

function parseBase() {
  return parseArg('--base=', DEFAULT_BASE).replace(/\/+$/, '');
}

function parseRepeat() {
  const raw = parseArg('--repeat=', '1');
  const count = Number(raw);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`invalid repeat count: ${raw}`);
  }
  return count;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function extractJsonObject(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_err) {}

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch (_err) {}
  }

  return null;
}

function buildPayload() {
  return {
    moduleKey: 'overall',
    chartData: {
      gender: 'male',
      birthDate: '1991-02-16 22:00',
      solarTime: '1991-02-16 21:42',
      birthYear: 1991,
      birthMonth: 2,
      birthDay: 16,
      birthHour: 22,
      isLunar: false,
      city: 'Shanghai',
      fiveElementsClass: '\u6728\u4e09\u5c40',
      zodiac: '\u7f8a',
      lifeMain: '\u5929\u5e9c',
      bodyMain: '\u5929\u76f8',
      yearStem: '\u8f9b',
      lifePalace: {
        name: '\u547d\u5bab',
        branch: '\u620c',
        majorStars: [{ name: '\u5929\u5e9c', brightness: '\u5e99' }],
        minorStars: [{ name: '\u6587\u66f2', mutagen: '\u5316\u79d1' }],
        adjStars: [{ name: '\u5929\u8d35' }],
      },
      bodyPalaceDetail: {
        name: '\u592b\u59bb\u5bab',
        branch: '\u5bc5',
        majorStars: [{ name: '\u7d2b\u5fae' }, { name: '\u7834\u519b' }],
        minorStars: [],
        adjStars: [],
      },
      careerPalace: {
        name: '\u5b98\u7984\u5bab',
        branch: '\u5348',
        majorStars: [{ name: '\u5929\u76f8' }],
        minorStars: [],
        adjStars: [],
      },
      wealthPalace: {
        name: '\u8d22\u5e1b\u5bab',
        branch: '\u7533',
        majorStars: [{ name: '\u6b66\u66f2' }],
        minorStars: [],
        adjStars: [],
      },
      movePalace: {
        name: '\u8fc1\u79fb\u5bab',
        branch: '\u5b50',
        majorStars: [{ name: '\u4e03\u6740' }],
        minorStars: [],
        adjStars: [],
      },
      yearMutagens: [
        { star: '\u5de8\u95e8', type: '\u5316\u7984', palace: '\u7530\u5b85\u5bab' },
        { star: '\u592a\u9633', type: '\u5316\u6743', palace: '\u75be\u5384\u5bab' },
        { star: '\u6587\u66f2', type: '\u5316\u79d1', palace: '\u547d\u5bab' },
        { star: '\u6587\u660c', type: '\u5316\u5fcc', palace: '\u8d22\u5e1b\u5bab' },
      ],
      palacesSummary: [
        {
          name: '\u547d\u5bab',
          branch: '\u620c',
          isSoul: true,
          isBody: false,
          decadal: { range: '23-32', stem: '\u7532' },
          majorStars: [{ name: '\u5929\u5e9c', brightness: '\u5e99', mutagen: null }],
          minorStars: [{ name: '\u6587\u66f2', mutagen: '\u5316\u79d1' }],
          adjStars: ['\u5929\u8d35'],
        },
      ],
      activeAge: 35,
      currentYear: 2026,
      currentDecade: {
        palace: '\u5b98\u7984\u5bab',
        branch: '\u5348',
        range: '33-42',
        stem: '\u4e59',
        majorStars: ['\u5929\u76f8'],
      },
      currentLiunian: {
        name: '2026',
        branch: '\u5348',
        period: '\u6d41\u5e74',
        xiaoLian: '\u7533',
      },
      currentXiaolian: { branch: '\u7533' },
      liunianGua: { name: '\u4e7e', period: '\u6d41\u5e74' },
    },
    extraParams: {},
  };
}

function checkSection(section, index, sourceName) {
  assert(section && typeof section === 'object', `${sourceName}.sections[${index}] must be an object`);
  assert(typeof section.title === 'string', `${sourceName}.sections[${index}].title must be a string`);
  assert(typeof section.content === 'string', `${sourceName}.sections[${index}].content must be a string`);
  assert(section.content.trim(), `${sourceName}.sections[${index}].content must not be empty`);
}

function checkCard(card) {
  assert(card && typeof card === 'object', 'card must be an object');
  assert(typeof card.title === 'string', 'card.title must be a string');
  assert(typeof card.profileBadge === 'string', 'card.profileBadge must be a string');
  assert(typeof card.risk === 'string', 'card.risk must be a string');
  assert(typeof card.summary === 'string', 'card.summary must be a string');
  assert(Array.isArray(card.sections), 'card.sections must be an array');
  assert(card.sections.length >= 1, 'card.sections must contain at least one section');
  card.sections.forEach((section, index) => checkSection(section, index, 'card'));
}

function checkMeta(meta) {
  assert(meta && typeof meta === 'object', 'meta must be an object');
  assert(meta.moduleKey === 'overall', 'meta.moduleKey must equal overall');
  assert(typeof meta.moduleName === 'string', 'meta.moduleName must be a string');
  assert(typeof meta.modelName === 'string', 'meta.modelName must be a string');
  assert(typeof meta.durationMs === 'number', 'meta.durationMs must be a number');
  assert(typeof meta.tokensUsed === 'number', 'meta.tokensUsed must be a number');
  assert(typeof meta.promptSource === 'string', 'meta.promptSource must be a string');
}

function checkDebug(debug, rawResponse) {
  assert(debug && typeof debug === 'object', 'debug must be an object');
  assert(typeof debug.model === 'string', 'debug.model must be a string');
  assert(typeof debug.durationMs === 'number', 'debug.durationMs must be a number');
  assert(typeof debug.promptSource === 'string', 'debug.promptSource must be a string');
  assert(Array.isArray(debug.trace), 'debug.trace must be an array');
  assert(typeof debug.rawResponse === 'string', 'debug.rawResponse must be a string');
  assert(debug.rawResponse === rawResponse, 'debug.rawResponse must match rawResponse');
}

function checkRawJson(rawResponse) {
  assert(typeof rawResponse === 'string' && rawResponse.trim(), 'rawResponse must be a non-empty string');
  const parsed = extractJsonObject(rawResponse);
  assert(parsed && typeof parsed === 'object', 'rawResponse must contain a valid JSON object');
  assert(typeof parsed.title === 'string', 'raw JSON title must be a string');
  assert(typeof parsed.profileBadge === 'string', 'raw JSON profileBadge must be a string');
  assert(typeof parsed.risk === 'string', 'raw JSON risk must be a string');
  assert(Array.isArray(parsed.sections), 'raw JSON sections must be an array');
  assert(parsed.sections.length >= 3, 'raw JSON sections must contain at least 3 items');
  parsed.sections.forEach((section, index) => checkSection(section, index, 'rawJson'));
  return parsed;
}

async function postJson(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_err) {
    data = null;
  }

  return { resp, text, data };
}

async function runOnce(base, runIndex) {
  const result = await postJson(`${base}/api/ai/run`, buildPayload());
  assert(result.resp.ok, `run ${runIndex}: HTTP ${result.resp.status} ${result.text}`);
  assert(result.data && result.data.ok === true, `run ${runIndex}: response.ok must be true`);
  assert(result.data.success === true, `run ${runIndex}: response.success must be true`);
  assert(result.data.module === 'overall_piming', `run ${runIndex}: module must equal overall_piming`);
  assert(typeof result.data.finalAnswer === 'string', `run ${runIndex}: finalAnswer must be a string`);
  assert(Array.isArray(result.data.backendSteps), `run ${runIndex}: backendSteps must be an array`);

  const rawJson = checkRawJson(result.data.rawResponse);
  checkCard(result.data.card);
  checkMeta(result.data.meta);
  checkDebug(result.data.debug, result.data.rawResponse);

  return {
    run: runIndex,
    durationMs: result.data.meta.durationMs,
    tokensUsed: result.data.meta.tokensUsed,
    sectionCount: result.data.card.sections.length,
    rawSectionCount: rawJson.sections.length,
    title: result.data.card.title,
    profileBadge: result.data.card.profileBadge,
  };
}

async function main() {
  const base = parseBase();
  const repeat = parseRepeat();
  const runs = [];

  for (let index = 1; index <= repeat; index += 1) {
    runs.push(await runOnce(base, index));
  }

  console.log(JSON.stringify({
    ok: true,
    base,
    repeat,
    runs,
  }, null, 2));
}

main().catch((err) => {
  console.error(`[smoke:overall-piming] ${err.message}`);
  process.exit(1);
});
