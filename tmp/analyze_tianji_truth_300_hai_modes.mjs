import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const rootDir = process.cwd();
const truthPath = path.join(rootDir, 'tmp', 'tianji-truth-300.json');
const edgePath = path.join(rootDir, 'tmp', 'tianji-hai-edge-samples.json');
const femaleQianPath = path.join(rootDir, 'tmp', 'tianji-female-qian-hai-samples.json');
const femaleQianBoundaryPath = path.join(rootDir, 'tmp', 'tianji-female-qian-hai-boundary-samples.json');
const tablesPath = path.join(rootDir, 'src', 'ziping', 'tables.js');
const generatorPath = path.join(rootDir, 'src', 'ziping', 'generator.js');

const truth = JSON.parse(await fs.readFile(truthPath, 'utf8'));
let edgeTruth = [];
try {
  edgeTruth = JSON.parse(await fs.readFile(edgePath, 'utf8'));
} catch {
  edgeTruth = [];
}
let femaleQianTruth = [];
try {
  femaleQianTruth = JSON.parse(await fs.readFile(femaleQianPath, 'utf8'));
} catch {
  femaleQianTruth = [];
}
let femaleQianBoundaryTruth = [];
try {
  femaleQianBoundaryTruth = JSON.parse(await fs.readFile(femaleQianBoundaryPath, 'utf8'));
} catch {
  femaleQianBoundaryTruth = [];
}

const tablesCode = await fs.readFile(tablesPath, 'utf8');
const generatorCode = await fs.readFile(generatorPath, 'utf8');
const ctx = { console, global: null, window: undefined };
ctx.global = ctx;
vm.runInNewContext(tablesCode, ctx, { filename: 'tables.js' });
vm.runInNewContext(generatorCode, ctx, { filename: 'generator.js' });

const G = ctx.ZipingGenerator;
const T = ctx.ZipingTables;

const ALL_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TRANSFORMS = [
  'flip',
  'flipThenSwap',
  'swapThenFlip',
  'flipYingThenSwap',
  'swapThenFlipYing',
  'flipYing',
];

function canonName(name) {
  return String(name || '').replace('遯', '遁');
}

function yearStemFromPillars(text) {
  return String(text || '').trim().split(/\s+/)[0]?.charAt(0) || '';
}

function monthBranchFromPillars(text) {
  return String(text || '').trim().split(/\s+/)[1]?.charAt(1) || '';
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function findHexByName(name, isYangPerson) {
  for (let upper = 1; upper <= 8; upper++) {
    for (let lower = 1; lower <= 8; lower++) {
      const num = T.GUA_TABLE[upper - 1][lower - 1];
      if (canonName(T.HEX_NAME[num]) === canonName(name)) {
        return G.buildGua(upper, lower, isYangPerson);
      }
    }
  }
  return null;
}

function hexLines6(upper, lower) {
  const lowerLines = T.TRIGRAM_LINES[lower];
  const upperLines = T.TRIGRAM_LINES[upper];
  return [lowerLines[2], lowerLines[1], lowerLines[0], upperLines[2], upperLines[1], upperLines[0]];
}

function flipTrigram(trigramNum, lineInTrigram) {
  const idx = 3 - lineInTrigram;
  const lines = [...T.TRIGRAM_LINES[trigramNum]];
  lines[idx] = lines[idx] === 'solid' ? 'broken' : 'solid';
  for (let n = 1; n <= 8; n++) {
    const t = T.TRIGRAM_LINES[n];
    if (t[0] === lines[0] && t[1] === lines[1] && t[2] === lines[2]) return n;
  }
  return trigramNum;
}

function flipHex(gua, lineNum) {
  const newUpper = lineNum >= 4 ? flipTrigram(gua.upper, lineNum - 3) : gua.upper;
  const newLower = lineNum < 4 ? flipTrigram(gua.lower, lineNum) : gua.lower;
  return G.buildGua(newUpper, newLower, gua.isYangPerson);
}

function swapOuterInner(gua) {
  return G.buildGua(gua.lower, gua.upper, gua.isYangPerson);
}

function yingLine(lineNum) {
  return ((lineNum + 2) % 6) + 1;
}

function applyTransform(name, gua, lineNum) {
  switch (name) {
    case 'flip':
      return flipHex(gua, lineNum);
    case 'flipThenSwap':
      return swapOuterInner(flipHex(gua, lineNum));
    case 'swapThenFlip':
      return flipHex(swapOuterInner(gua), lineNum);
    case 'flipYingThenSwap':
      return swapOuterInner(flipHex(gua, yingLine(lineNum)));
    case 'swapThenFlipYing':
      return flipHex(swapOuterInner(gua), yingLine(lineNum));
    case 'flipYing':
      return flipHex(gua, yingLine(lineNum));
    default:
      return null;
  }
}

function getYuanTangInfo(xianName, hourBranch, gender, yearStem) {
  const xian = findHexByName(xianName, gender === 'male');
  return G.getYuanTangDetail(
    xian.upper,
    xian.lower,
    hourBranch,
    xian.isYangPerson,
    { gender, yearStem, xianTianNum: xian.num }
  );
}

function getForcedPoolLine(xian, hourBranch, poolType) {
  const h6 = hexLines6(xian.upper, xian.lower);
  const yang = h6.map((v, i) => (v === 'solid' ? i + 1 : null)).filter(Boolean);
  const yin = h6.map((v, i) => (v === 'broken' ? i + 1 : null)).filter(Boolean);
  const isUpperSix = T.YANG_HOURS.includes(hourBranch);
  const pos = isUpperSix ? T.YANG_HOURS.indexOf(hourBranch) : T.YIN_HOURS.indexOf(hourBranch);
  const preferredPool = poolType === 'yang' ? yang : yin;
  const fallbackPool = poolType === 'yang' ? yin : yang;
  const pool = preferredPool.length ? preferredPool : fallbackPool;
  return {
    line: pool[pos % pool.length],
    pos,
    yangPool: yang,
    yinPool: yin,
  };
}

function branchesForLine(xianName, targetLine, gender, yearStem) {
  const xian = findHexByName(xianName, gender === 'male');
  return ALL_BRANCHES.flatMap(branch => {
    const info = G.getYuanTangDetail(
      xian.upper,
      xian.lower,
      branch,
      xian.isYangPerson,
      { gender, yearStem, xianTianNum: xian.num }
    );
    return info.line === targetLine
      ? [{ branch, ruleTag: info.ruleTag, poolType: info.poolType }]
      : [];
  });
}

function classifyHaiSample(item) {
  const yearStem = yearStemFromPillars(item.pillars);
  const monthBranch = monthBranchFromPillars(item.pillars);
  const xian = findHexByName(item.xiantian, item.gender === 'male');
  const normalInfo = getYuanTangInfo(item.xiantian, '亥', item.gender, yearStem);
  const normalOut = G.computeHouTian(xian, normalInfo.line, monthBranch, [])?.name;
  const forcedYang = getForcedPoolLine(xian, '亥', 'yang');
  const forcedYangOut = G.computeHouTian(xian, forcedYang.line, monthBranch, [])?.name;

  let mode = 'alt-transform';
  if (canonName(normalOut) === canonName(item.houtian)) {
    mode = 'yin-pool';
  } else if (canonName(forcedYangOut) === canonName(item.houtian)) {
    mode = 'yang-pool';
  }

  const altHits = [];
  if (mode === 'alt-transform') {
    for (let line = 1; line <= 6; line++) {
      for (const transform of TRANSFORMS) {
        const out = applyTransform(transform, xian, line)?.name;
        if (canonName(out) === canonName(item.houtian)) {
          altHits.push({
            line,
            transform,
            out,
            branches: branchesForLine(item.xiantian, line, item.gender, yearStem),
          });
        }
      }
    }
  }

  const solidCount = xian ? hexLines6(xian.upper, xian.lower).filter(line => line === 'solid').length : null;
  const xianYears = xian
    ? hexLines6(xian.upper, xian.lower).reduce((sum, line) => sum + (line === 'solid' ? 9 : 6), 0)
    : null;

  return {
    id: item.id,
    date: item.inputBirth,
    gender: item.gender,
    pillars: item.pillars,
    monthBranch,
    xiantian: item.xiantian,
    houtian: item.houtian,
    liunianLen: Array.isArray(item.liunian) ? item.liunian.length : 0,
    mode,
    normalRuleTag: normalInfo.ruleTag,
    normalLine: normalInfo.line,
    forcedYangLine: forcedYang.line,
    solidCount,
    xianYears,
    altHits,
  };
}

function buildHaiStats(rows) {
  const lowerSixDefaultRows = rows.filter(item => item.normalRuleTag === 'lower-six-default-yin');
  return {
    total: rows.length,
    modeCount: countBy(rows, 'mode'),
    ruleTagCount: countBy(rows, 'normalRuleTag'),
    monthByMode: Object.fromEntries(
      ['yin-pool', 'yang-pool', 'alt-transform'].map(mode => [
        mode,
        countBy(rows.filter(item => item.mode === mode), 'monthBranch'),
      ])
    ),
    lenByMode: Object.fromEntries(
      ['yin-pool', 'yang-pool', 'alt-transform'].map(mode => [
        mode,
        countBy(rows.filter(item => item.mode === mode), 'liunianLen'),
      ])
    ),
    lowerSixDefaultCount: lowerSixDefaultRows.length,
    lowerSixDefaultModeCount: countBy(lowerSixDefaultRows, 'mode'),
    lowerSixDefaultSolidCountByMode: Object.fromEntries(
      ['yin-pool', 'yang-pool', 'alt-transform'].map(mode => [
        mode,
        countBy(lowerSixDefaultRows.filter(item => item.mode === mode), 'solidCount'),
      ])
    ),
    lowerSixDefaultYearsByMode: Object.fromEntries(
      ['yin-pool', 'yang-pool', 'alt-transform'].map(mode => [
        mode,
        countBy(lowerSixDefaultRows.filter(item => item.mode === mode), 'xianYears'),
      ])
    ),
  };
}

function predictExperimentalHoutian(item) {
  const yearStem = yearStemFromPillars(item.pillars);
  const monthBranch = monthBranchFromPillars(item.pillars);
  const xian = findHexByName(item.xiantian, item.gender === 'male');
  const normalInfo = getYuanTangInfo(item.xiantian, '亥', item.gender, yearStem);
  const normalOut = G.computeHouTian(xian, normalInfo.line, monthBranch, [])?.name;
  const forcedYang = getForcedPoolLine(xian, '亥', 'yang');
  const forcedYangOut = G.computeHouTian(xian, forcedYang.line, monthBranch, [])?.name;

  if (normalInfo.ruleTag === 'female-hai-ordinary-line-matrix' && canonName(item.xiantian) === '乾为天') {
    const yinHalfMonths = new Set(['丑', '寅', '卯', '辰', '巳', '午']);
    return {
      predicted: yinHalfMonths.has(monthBranch) ? normalOut : forcedYangOut,
      mode: yinHalfMonths.has(monthBranch) ? 'female-qian-yinhalf' : 'female-qian-yanghalf',
      monthBranch,
    };
  }
  if (normalInfo.ruleTag !== 'lower-six-default-yin') {
    return {
      predicted: normalOut,
      mode: `existing-special:${normalInfo.ruleTag}`,
      monthBranch,
    };
  }

  const solidCount = xian ? hexLines6(xian.upper, xian.lower).filter(line => line === 'solid').length : null;
  if ([0, 3, 6].includes(solidCount)) {
    return { predicted: normalOut, mode: 'yin-pool', monthBranch };
  }
  if ([1, 2, 4].includes(solidCount)) {
    return { predicted: forcedYangOut, mode: 'yang-pool', monthBranch };
  }
  if (solidCount === 5) {
    return {
      predicted: applyTransform('flipThenSwap', xian, 5)?.name,
      mode: 'alt-transform',
      monthBranch,
    };
  }
  return { predicted: normalOut, mode: 'fallback', monthBranch };
}

const nativeHai = truth.filter(item => item.civilSlot === '亥');
const edgeHai = edgeTruth.filter(item => item.civilSlot === '亥');
const femaleQianHai = femaleQianTruth.filter(item => item.civilSlot === '亥');
const femaleQianHaiBoundary = femaleQianBoundaryTruth.filter(item => item.civilSlot === '亥');
const classifiedNativeHai = nativeHai.map(classifyHaiSample);
const classifiedEdgeHai = edgeHai.map(classifyHaiSample);
const classifiedFemaleQianHai = femaleQianHai.map(classifyHaiSample);
const classifiedFemaleQianHaiBoundary = femaleQianHaiBoundary.map(classifyHaiSample);
const classifiedCombinedHai = classifiedNativeHai.concat(classifiedEdgeHai);
const classifiedAllKnownHai = classifiedCombinedHai
  .concat(classifiedFemaleQianHai)
  .concat(classifiedFemaleQianHaiBoundary);

const groups = new Map();
for (const item of truth) {
  const key = `${item.inputBirth}|${item.gender}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}

const samePillarWeiHaiPairs = [];
for (const group of groups.values()) {
  const wei = group.find(item => item.civilSlot === '未');
  const hai = group.find(item => item.civilSlot === '亥');
  if (!wei || !hai) continue;
  if (wei.pillars === hai.pillars && wei.xiantian === hai.xiantian) {
    const haiMode = classifiedNativeHai.find(item =>
      item.date === hai.inputBirth &&
      item.gender === hai.gender &&
      canonName(item.xiantian) === canonName(hai.xiantian) &&
      canonName(item.houtian) === canonName(hai.houtian)
    );
    samePillarWeiHaiPairs.push({
      date: wei.inputBirth,
      gender: wei.gender,
      pillars: wei.pillars,
      xiantian: wei.xiantian,
      weiHoutian: wei.houtian,
      haiHoutian: hai.houtian,
      liunianLen: [
        Array.isArray(wei.liunian) ? wei.liunian.length : 0,
        Array.isArray(hai.liunian) ? hai.liunian.length : 0,
      ],
      haiMode: haiMode?.mode || null,
    });
  }
}

const nativeStats = buildHaiStats(classifiedNativeHai);
const combinedStats = buildHaiStats(classifiedCombinedHai);
const experimentalPredictionRows = classifiedAllKnownHai.map(item => {
  const experimental = predictExperimentalHoutian(item);
  return {
    id: item.id,
    date: item.date,
    gender: item.gender,
    monthBranch: experimental.monthBranch,
    xiantian: item.xiantian,
    actualHoutian: item.houtian,
    predictedHoutian: experimental.predicted,
    experimentalMode: experimental.mode,
    matched: canonName(experimental.predicted) === canonName(item.houtian),
  };
});
const experimentalMatchedRows = experimentalPredictionRows.filter(item => item.matched);
const experimentalMissRows = experimentalPredictionRows.filter(item => !item.matched);

const result = {
  totalTruth: truth.length,
  edgeTruthTotal: edgeTruth.length,
  femaleQianTruthTotal: femaleQianTruth.length,
  femaleQianBoundaryTruthTotal: femaleQianBoundaryTruth.length,
  nativeHaiTotal: nativeHai.length,
  edgeHaiTotal: edgeHai.length,
  nativeHaiModeCount: nativeStats.modeCount,
  nativeHaiRuleTagCount: nativeStats.ruleTagCount,
  nativeHaiMonthByMode: nativeStats.monthByMode,
  nativeHaiLenByMode: nativeStats.lenByMode,
  lowerSixDefaultHaiCount: nativeStats.lowerSixDefaultCount,
  lowerSixDefaultHaiModeCount: nativeStats.lowerSixDefaultModeCount,
  lowerSixDefaultHaiSolidCountByMode: nativeStats.lowerSixDefaultSolidCountByMode,
  lowerSixDefaultHaiYearsByMode: nativeStats.lowerSixDefaultYearsByMode,
  combinedHaiTotal: combinedStats.total,
  combinedHaiModeCount: combinedStats.modeCount,
  combinedHaiRuleTagCount: combinedStats.ruleTagCount,
  combinedHaiMonthByMode: combinedStats.monthByMode,
  combinedHaiLenByMode: combinedStats.lenByMode,
  combinedLowerSixDefaultHaiCount: combinedStats.lowerSixDefaultCount,
  combinedLowerSixDefaultHaiModeCount: combinedStats.lowerSixDefaultModeCount,
  combinedLowerSixDefaultHaiSolidCountByMode: combinedStats.lowerSixDefaultSolidCountByMode,
  combinedLowerSixDefaultHaiYearsByMode: combinedStats.lowerSixDefaultYearsByMode,
  classifiedNativeHai,
  classifiedEdgeHai,
  classifiedFemaleQianHai,
  classifiedFemaleQianHaiBoundary,
  classifiedCombinedHai,
  classifiedAllKnownHai,
  experimentalKnownHaiTotal: experimentalPredictionRows.length,
  experimentalKnownHaiMatched: experimentalMatchedRows.length,
  experimentalKnownHaiMissed: experimentalMissRows.length,
  experimentalKnownHaiModeCount: countBy(experimentalPredictionRows, 'experimentalMode'),
  experimentalMissRows,
  samePillarWeiHaiPairCount: samePillarWeiHaiPairs.length,
  samePillarWeiHaiPairs,
};

console.log(JSON.stringify(result, null, 2));
