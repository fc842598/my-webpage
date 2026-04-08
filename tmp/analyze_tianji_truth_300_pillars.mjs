import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const rootDir = process.cwd();

const truthPath = path.join(rootDir, 'tmp', 'tianji-truth-300.json');
const tianjiBaziPath = path.join(rootDir, 'src', 'ziping', 'tianji-bazi.js');
const tablesPath = path.join(rootDir, 'src', 'ziping', 'tables.js');
const generatorPath = path.join(rootDir, 'src', 'ziping', 'generator.js');

const lunarLib = require(path.join(rootDir, 'node_modules', 'lunar-javascript'));
const TianjiBazi = require(tianjiBaziPath);

const hourBySlot = {
  'night-zi': 23,
  'early-zi': 0,
  '丑': 1,
  '寅': 3,
  '卯': 5,
  '辰': 7,
  '巳': 9,
  '午': 11,
  '未': 13,
  '申': 15,
  '酉': 17,
  '戌': 19,
  '亥': 21,
};

const allBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function pillarsTextFromObj(p) {
  return [
    p.yearStem + p.yearBranch,
    p.monthStem + p.monthBranch,
    p.dayStem + p.dayBranch,
    p.hourStem + p.hourBranch,
  ].join(' ');
}

function parsePillars(text) {
  const [year, month, day, hour] = String(text || '').trim().split(/\s+/);
  return {
    yearStem: year?.charAt(0) || '',
    yearBranch: year?.charAt(1) || '',
    monthStem: month?.charAt(0) || '',
    monthBranch: month?.charAt(1) || '',
    dayStem: day?.charAt(0) || '',
    dayBranch: day?.charAt(1) || '',
    hourStem: hour?.charAt(0) || '',
    hourBranch: hour?.charAt(1) || '',
  };
}

function monthBranchFromPillars(text) {
  return String(text || '').trim().split(/\s+/)[1]?.charAt(1) || '';
}

function yearStemFromPillars(text) {
  return String(text || '').trim().split(/\s+/)[0]?.charAt(0) || '';
}

function getLiunianLen(item) {
  return Array.isArray(item.liunian) ? item.liunian.length : 0;
}

function buildContext() {
  const tablesCode = require('node:fs').readFileSync(tablesPath, 'utf8');
  const generatorCode = require('node:fs').readFileSync(generatorPath, 'utf8');
  const ctx = { console, global: null, window: undefined };
  ctx.global = ctx;
  vm.runInNewContext(tablesCode, ctx, { filename: 'tables.js' });
  vm.runInNewContext(generatorCode, ctx, { filename: 'generator.js' });
  return ctx;
}

const ctx = buildContext();
const generator = ctx.ZipingGenerator;
const truth = JSON.parse(await fs.readFile(truthPath, 'utf8'));

function findHexByName(name, isYangPerson) {
  const T = ctx.ZipingTables;
  for (let upper = 1; upper <= 8; upper++) {
    for (let lower = 1; lower <= 8; lower++) {
      const num = T.GUA_TABLE[upper - 1][lower - 1];
      if (T.HEX_NAME[num] === name) {
        return generator.buildGua(upper, lower, isYangPerson);
      }
    }
  }
  return null;
}

function inferLinesForHoutian(xianName, houtianName, monthBranch, isYangPerson) {
  const xian = findHexByName(xianName, isYangPerson);
  const lines = [];
  for (let line = 1; line <= 6; line++) {
    const h = generator.computeHouTian(xian, line, monthBranch, []);
    if (h?.name === houtianName) lines.push(line);
  }
  return lines;
}

function getYuanTangLineByOriginalBranch(xianName, originalHourBranch, gender, yearStem) {
  const xian = findHexByName(xianName, gender === 'male');
  const info = generator.getYuanTangDetail(
    xian.upper,
    xian.lower,
    originalHourBranch,
    xian.isYangPerson,
    { gender, yearStem, xianTianNum: xian.num }
  );
  return { line: info.line, ruleTag: info.ruleTag, poolType: info.poolType };
}

function branchesForLine(xianName, targetLine, gender, yearStem) {
  const xian = findHexByName(xianName, gender === 'male');
  const matches = [];
  for (const branch of allBranches) {
    const info = generator.getYuanTangDetail(
      xian.upper,
      xian.lower,
      branch,
      xian.isYangPerson,
      { gender, yearStem, xianTianNum: xian.num }
    );
    if (info.line === targetLine) {
      matches.push({ branch, ruleTag: info.ruleTag, poolType: info.poolType });
    }
  }
  return matches;
}

const mismatches = [];
for (const item of truth) {
  const hour = hourBySlot[item.civilSlot];
  if (typeof hour !== 'number') continue;
  const calc = TianjiBazi.computePillarsFromSolarLib(lunarLib.Solar, {
    year: Number(item.inputBirth.slice(0, 4)),
    month: Number(item.inputBirth.slice(5, 7)),
    day: Number(item.inputBirth.slice(8, 10)),
    cstHour: hour,
    cstMinute: 0,
  });
  const calcText = pillarsTextFromObj(calc);
  if (calcText !== item.pillars) {
    mismatches.push({
      date: item.inputBirth,
      gender: item.gender,
      slot: item.civilSlot,
      truth: item.pillars,
      calc: calcText,
    });
  }
}

const mismatchBySlot = mismatches.reduce((acc, item) => {
  acc[item.slot] = (acc[item.slot] || 0) + 1;
  return acc;
}, {});

const byDateGender = new Map();
for (const item of truth) {
  const key = `${item.inputBirth}|${item.gender}`;
  if (!byDateGender.has(key)) byDateGender.set(key, []);
  byDateGender.get(key).push(item);
}

const samePillarsPairs = [];
for (const group of byDateGender.values()) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      if (a.pillars !== b.pillars) continue;
      samePillarsPairs.push({
        date: a.inputBirth,
        gender: a.gender,
        slots: [a.civilSlot, b.civilSlot],
        pillars: a.pillars,
        sameXiantian: a.xiantian === b.xiantian,
        diffHoutian: a.houtian !== b.houtian,
        diffLiunianLen: getLiunianLen(a) !== getLiunianLen(b),
        xiantian: [a.xiantian, b.xiantian],
        houtian: [a.houtian, b.houtian],
        liunianLen: [getLiunianLen(a), getLiunianLen(b)],
      });
    }
  }
}

const samplePair = samePillarsPairs.find(item =>
  item.date === '1966-06-25' &&
  item.gender === 'male' &&
  item.slots.includes('未') &&
  item.slots.includes('亥')
);

let generatorCheck = null;
if (samplePair) {
  const generated = generator.generate(parsePillars(samplePair.pillars), 'male', 1966, 120);
  generatorCheck = {
    inputPillars: samplePair.pillars,
    generatedXiantian: generated?.xiantian?.name || null,
    generatedHoutian: generated?.houtian?.name || null,
    generatedLen: Object.keys(generated?.liunianMap || {}).length,
    generatedRuleTag: generated?.debug?.yuanTangRuleTag || null,
  };
}

const weiHaiPairs = [];
for (const item of truth) {
  const key = `${item.inputBirth}|${item.gender}`;
  let group = weiHaiPairs.find(x => x.key === key);
  if (!group) {
    group = { key, date: item.inputBirth, gender: item.gender };
    weiHaiPairs.push(group);
  }
  if (item.civilSlot === '未') group.wei = item;
  if (item.civilSlot === '亥') group.hai = item;
}

const fullPairs = weiHaiPairs.filter(x =>
  x.wei &&
  x.hai &&
  x.wei.pillars === x.hai.pillars &&
  x.wei.xiantian === x.hai.xiantian
);

const lineInference = fullPairs.map(pair => {
  const monthBranch = monthBranchFromPillars(pair.wei.pillars);
  const isYangPerson = pair.gender === 'male';
  return {
    date: pair.date,
    gender: pair.gender,
    pillars: pair.wei.pillars,
    xiantian: pair.wei.xiantian,
    monthBranch,
    weiHoutian: pair.wei.houtian,
    weiLines: inferLinesForHoutian(pair.wei.xiantian, pair.wei.houtian, monthBranch, isYangPerson),
    haiHoutian: pair.hai.houtian,
    haiLines: inferLinesForHoutian(pair.hai.xiantian, pair.hai.houtian, monthBranch, isYangPerson),
    liunianLen: [pair.wei.liunian.length, pair.hai.liunian.length],
  };
});

const branchHypothesis = lineInference.map(row => {
  const pair = fullPairs.find(p => p.date === row.date && p.gender === row.gender);
  const yearStem = yearStemFromPillars(pair.wei.pillars);
  const weiByOriginal = getYuanTangLineByOriginalBranch(row.xiantian, '未', row.gender, yearStem);
  const haiByOriginal = getYuanTangLineByOriginalBranch(row.xiantian, '亥', row.gender, yearStem);
  return {
    ...row,
    byOriginalWei: weiByOriginal,
    byOriginalHai: haiByOriginal,
    weiMatch: row.weiLines.length === 1 && row.weiLines[0] === weiByOriginal.line,
    haiMatch: row.haiLines.length === 1 && row.haiLines[0] === haiByOriginal.line,
  };
});

const branchHypothesisSummary = {
  totalPairs: branchHypothesis.length,
  weiMatch: branchHypothesis.filter(x => x.weiMatch).length,
  haiMatch: branchHypothesis.filter(x => x.haiMatch).length,
  fullMatch: branchHypothesis.filter(x => x.weiMatch && x.haiMatch).length,
  unresolved: branchHypothesis.filter(x => !(x.weiMatch && x.haiMatch)),
};

const unresolvedBranchCandidates = branchHypothesisSummary.unresolved.map(item => {
  const yearStem = yearStemFromPillars(item.pillars);
  return {
    date: item.date,
    gender: item.gender,
    xiantian: item.xiantian,
    monthBranch: item.monthBranch,
    haiHoutian: item.haiHoutian,
    targetHaiLine: item.haiLines[0] ?? null,
    branchCandidates: item.haiLines[0]
      ? branchesForLine(item.xiantian, item.haiLines[0], item.gender, yearStem)
      : [],
  };
});

const result = {
  total: truth.length,
  matched: truth.length - mismatches.length,
  mismatched: mismatches.length,
  mismatchBySlot,
  mismatches,
  samePillarsPairs,
  generatorCheck,
  branchHypothesisSummary,
  unresolvedBranchCandidates,
};

console.log(JSON.stringify(result, null, 2));
