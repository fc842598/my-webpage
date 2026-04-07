'use strict';

const path = require('path');
const BASE = path.join(__dirname, '..');
const G = global;

require(path.join(BASE, 'src/ziping/tables.js'));
require(path.join(BASE, 'src/ziping/generator.js'));
require(path.join(BASE, 'src/ziping/validator.js'));

const gen = G.ZipingGenerator;
const validator = G.ZipingValidator;

if (!gen || !validator) {
  console.error('ZipingGenerator or ZipingValidator not loaded');
  process.exit(1);
}

const goldenCases = require(path.join(BASE, 'fixtures/ziping-golden-cases.js'));
const liunianSamples = require(path.join(BASE, 'fixtures/ziping-liunian-sequence-samples.json'));
const matrixSamples = require(path.join(BASE, 'fixtures/ziping-yuantang-matrix-samples.json'));
const targetedSamples = require(path.join(BASE, 'fixtures/ziping-yuantang-targeted-samples.json'));
const boundarySamples = require(path.join(BASE, 'fixtures/ziping-xiantian-boundary-samples.json'));
const followupSamples = require(path.join(BASE, 'fixtures/ziping-lower-six-followup-samples.json'));
const femaleHaiPocketSamples = require(path.join(BASE, 'fixtures/ziping-female-hai-ordinary-pocket-samples.json'));
const tianR25Lower8PocketSamples = require(path.join(BASE, 'fixtures/ziping-tianr25-lower8-pocket-samples.json'));

const SAMPLE_INPUTS = {
  '1991-02-16-hai-male': {
    pillars: { yearStem:'辛', yearBranch:'未', monthStem:'庚', monthBranch:'寅', dayStem:'丁', dayBranch:'巳', hourStem:'辛', hourBranch:'亥' },
    gender: 'male', birthYear: 1991,
  },
  '1969-03-26-hai-male': {
    pillars: { yearStem:'己', yearBranch:'酉', monthStem:'丁', monthBranch:'卯', dayStem:'庚', dayBranch:'子', hourStem:'丁', hourBranch:'亥' },
    gender: 'male', birthYear: 1969,
  },
  '1966-06-25-hai-male': {
    pillars: { yearStem:'丙', yearBranch:'午', monthStem:'甲', monthBranch:'午', dayStem:'乙', dayBranch:'卯', hourStem:'丁', hourBranch:'亥' },
    gender: 'male', birthYear: 1966,
  },
  '1996-01-02-you-male': {
    pillars: { yearStem:'乙', yearBranch:'亥', monthStem:'戊', monthBranch:'子', dayStem:'戊', dayBranch:'戌', hourStem:'辛', hourBranch:'酉' },
    gender: 'male', birthYear: 1996,
  },
  '2021-03-28-yezi-female': {
    pillars: { yearStem:'辛', yearBranch:'丑', monthStem:'辛', monthBranch:'卯', dayStem:'乙', dayBranch:'亥', hourStem:'戊', hourBranch:'子' },
    gender: 'female', birthYear: 2021,
  },
  '1984-04-08-chen-female': {
    pillars: { yearStem:'甲', yearBranch:'子', monthStem:'戊', monthBranch:'辰', dayStem:'壬', dayBranch:'申', hourStem:'甲', hourBranch:'辰' },
    gender: 'female', birthYear: 1984,
  },
  '1971-10-06-shen-male': {
    pillars: { yearStem:'辛', yearBranch:'亥', monthStem:'丁', monthBranch:'酉', dayStem:'甲', dayBranch:'子', hourStem:'壬', hourBranch:'申' },
    gender: 'male', birthYear: 1971,
  },
};

function normName(name) {
  return String(name || '').replace(/遁/g, '遯');
}

function parseSamplePillars(sample) {
  if (sample?.pillars?.yearStem) return sample.pillars;
  if (typeof sample?.pillars === 'string') {
    const [year, month, day, hour] = sample.pillars.trim().split(/\s+/);
    return {
      yearStem: year[0],
      yearBranch: year[1],
      monthStem: month[0],
      monthBranch: month[1],
      dayStem: day[0],
      dayBranch: day[1],
      hourStem: hour[0],
      hourBranch: hour[1],
    };
  }
  if (sample?.pillars?.year) {
    return {
      yearStem: sample.pillars.year[0],
      yearBranch: sample.pillars.year[1],
      monthStem: sample.pillars.month[0],
      monthBranch: sample.pillars.month[1],
      dayStem: sample.pillars.day[0],
      dayBranch: sample.pillars.day[1],
      hourStem: sample.pillars.hour[0],
      hourBranch: sample.pillars.hour[1],
    };
  }
  const raw = String(sample?.pillars?.raw || '').replace(/^四柱\s*:\s*/, '').trim();
  const [year, month, day, hour] = raw.split(/\s+/);
  return {
    yearStem: year[0],
    yearBranch: year[1],
    monthStem: month[0],
    monthBranch: month[1],
    dayStem: day[0],
    dayBranch: day[1],
    hourStem: hour[0],
    hourBranch: hour[1],
  };
}

function buildGuaByName(name) {
  for (let upper = 1; upper <= 8; upper++) {
    for (let lower = 1; lower <= 8; lower++) {
      const gua = gen.buildGua(upper, lower, true);
      if (normName(gua.name) === normName(name)) return gua;
    }
  }
  return null;
}

function reverseExpectedLines(xiantianName, monthBranch, houtianName) {
  const xiantian = buildGuaByName(xiantianName);
  if (!xiantian) return [];
  const xian = gen.buildGua(xiantian.upper, xiantian.lower, true);
  const matches = [];
  for (let line = 1; line <= 6; line++) {
    const houtian = gen.computeHouTian(xian, line, monthBranch, []);
    if (houtian && normName(houtian.name) === normName(houtianName)) {
      matches.push(line);
    }
  }
  return matches;
}

function runGoldenCase(caseItem) {
  return validator.runCase(caseItem);
}

function runLiuNianSample(sample) {
  const input = SAMPLE_INPUTS[sample.id];
  if (!input) {
    return { id: sample.id, passed: false, diffs: ['missing SAMPLE_INPUTS mapping'] };
  }
  const result = gen.generate(input.pillars, input.gender, input.birthYear);
  const diffs = [];
  const expectedXt = String(sample.xiantian || '').replace(/^先天卦[:：]?/, '');
  const expectedHt = String(sample.houtian || '').replace(/^后天卦[:：]?/, '');
  if (normName(result.xiantian?.name) !== normName(expectedXt)) {
    diffs.push(`xiantian expected=${expectedXt} actual=${result.xiantian?.name}`);
  }
  if (normName(result.houtian?.name) !== normName(expectedHt)) {
    diffs.push(`houtian expected=${expectedHt} actual=${result.houtian?.name}`);
  }
  for (const row of sample.rows || []) {
    const age = Number(row[0]);
    const expectedName = row[2];
    const actualName = result.liunianMap?.[age]?.name;
    if (normName(expectedName) !== normName(actualName)) {
      diffs.push(`liunian age=${age} expected=${expectedName} actual=${actualName || '(missing)'}`);
      break;
    }
  }
  return { id: sample.id, passed: diffs.length === 0, diffs };
}

function runSnapshotSample(sample, source) {
  const pillars = parseSamplePillars(sample);
  const birthYear = Number(String(sample.birth).slice(0, 4));
  const gender = sample.gender || 'female';
  const result = gen.generate(pillars, gender, birthYear);
  const reverse = reverseExpectedLines(sample.xiantian, pillars.monthBranch, sample.houtian);
  const diffs = [];

  if (normName(result.xiantian?.name) !== normName(sample.xiantian)) {
    diffs.push(`xiantian expected=${sample.xiantian} actual=${result.xiantian?.name}`);
  }
  if (normName(result.houtian?.name) !== normName(sample.houtian)) {
    diffs.push(`houtian expected=${sample.houtian} actual=${result.houtian?.name}`);
  }
  if (reverse.length !== 1) {
    diffs.push(`reverse-expected-line ambiguous=${JSON.stringify(reverse)}`);
  } else if (result.yuanTangLine !== reverse[0]) {
    diffs.push(`yuanTangLine expected=${reverse[0]} actual=${result.yuanTangLine}`);
  }

  return {
    id: sample.id,
    source,
    passed: diffs.length === 0,
    diffs,
    reverse,
  };
}

function printFailures(title, items) {
  console.log(`\n=== ${title} ===`);
  const failures = items.filter(item => !item.passed);
  if (!failures.length) {
    console.log('(none)');
    return;
  }
  for (const item of failures) {
    console.log(`[FAIL] ${item.id}`);
    for (const diff of item.diffs) {
      console.log(`  ${diff}`);
    }
  }
}

const verifiedGoldenResults = goldenCases
  .filter(item => item.verified)
  .map(runGoldenCase)
  .map(item => ({
    id: item.id,
    passed: item.passed,
    diffs: (item.diffs || []).map(diff => diff.error ? `${diff.label}: ${diff.error}` : `${diff.label} expected=${JSON.stringify(diff.expected)} actual=${JSON.stringify(diff.actual)}`),
  }));

const liunianResults = liunianSamples.map(runLiuNianSample);
const coreSnapshotResults = [
  ...matrixSamples.map(sample => runSnapshotSample(sample, 'matrix')),
  ...targetedSamples.filter(sample => !sample.coverageTags?.includes('exploratory')).map(sample => runSnapshotSample(sample, 'targeted')),
  ...boundarySamples.map(sample => runSnapshotSample(sample, 'boundary')),
  ...followupSamples.map(sample => runSnapshotSample(sample, 'followup')),
  ...femaleHaiPocketSamples
    .filter(sample => sample.validationMode !== 'exploratory-xiantian')
    .map(sample => runSnapshotSample(sample, 'female-hai-pocket')),
  ...tianR25Lower8PocketSamples.map(sample => runSnapshotSample(sample, 'tianr25-lower8-pocket')),
];
const exploratorySnapshotResults = targetedSamples
  .filter(sample => sample.coverageTags?.includes('exploratory'))
  .map(sample => runSnapshotSample(sample, 'exploratory'))
  .concat(
    femaleHaiPocketSamples
      .filter(sample => sample.validationMode === 'exploratory-xiantian')
      .map(sample => runSnapshotSample(sample, 'exploratory-xiantian'))
  );

printFailures('Verified Golden Case Failures', verifiedGoldenResults);
printFailures('LiuNian Sequence Failures', liunianResults);
printFailures('Professional Snapshot Core Failures', coreSnapshotResults);
printFailures('Professional Snapshot Exploratory Residuals', exploratorySnapshotResults);

const verifiedGoldenFailed = verifiedGoldenResults.filter(item => !item.passed).length;
const liunianFailed = liunianResults.filter(item => !item.passed).length;
const coreSnapshotFailed = coreSnapshotResults.filter(item => !item.passed).length;
const exploratoryFailed = exploratorySnapshotResults.filter(item => !item.passed).length;

console.log('\n=== Summary ===');
console.log(`verifiedGoldenTotal=${verifiedGoldenResults.length}`);
console.log(`verifiedGoldenFailed=${verifiedGoldenFailed}`);
console.log(`liunianSequenceTotal=${liunianResults.length}`);
console.log(`liunianSequenceFailed=${liunianFailed}`);
console.log(`snapshotCoreTotal=${coreSnapshotResults.length}`);
console.log(`snapshotCoreFailed=${coreSnapshotFailed}`);
console.log(`snapshotExploratoryTotal=${exploratorySnapshotResults.length}`);
console.log(`snapshotExploratoryFailed=${exploratoryFailed}`);

if (verifiedGoldenFailed || liunianFailed || coreSnapshotFailed) {
  process.exitCode = 1;
}
