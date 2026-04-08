'use strict';

const path = require('path');
const BASE = path.join(__dirname, '..');
const G = global;

require(path.join(BASE, 'src/ziping/tables.js'));
require(path.join(BASE, 'src/ziping/generator.js'));

const gen = G.ZipingGenerator;
if (!gen) {
  console.error('ZipingGenerator not loaded');
  process.exit(1);
}

const fixtures = require(path.join(BASE, 'fixtures/ziping-golden-cases.js'));
const matrix = require(path.join(BASE, 'tmp/tianji-yuantang-matrix-samples.json'));
const targeted = require(path.join(BASE, 'tmp/tianji-yuantang-targeted-samples-v2.json'));
const boundary = require(path.join(BASE, 'tmp/tianji-xiantian-boundary-samples.json'));
const followup = require(path.join(BASE, 'tmp/tianji-lower-six-followup.json'));

function normName(name) {
  return String(name || '').replace(/遁/g, '遯');
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

function runFixtureCase(goldenCase) {
  const result = gen.generate(goldenCase.input.pillars, goldenCase.input.gender, goldenCase.input.birthYear);
  const diffs = [];
  const exp = goldenCase.expected || {};
  const expDebug = exp.debug || {};
  if (normName(result.xiantian?.name) !== normName(exp.xiantian?.name)) {
    diffs.push(`xiantian expected=${exp.xiantian?.name} actual=${result.xiantian?.name}`);
  }
  if (normName(result.houtian?.name) !== normName(exp.houtian?.name)) {
    diffs.push(`houtian expected=${exp.houtian?.name} actual=${result.houtian?.name}`);
  }
  if (result.yuanTangLine !== expDebug.yuanTangLine) {
    diffs.push(`yuanTangLine expected=${expDebug.yuanTangLine} actual=${result.yuanTangLine}`);
  }
  if (expDebug.yuanTangPoolType && result.debug?.yuanTangPoolType !== expDebug.yuanTangPoolType) {
    diffs.push(`yuanTangPoolType expected=${expDebug.yuanTangPoolType} actual=${result.debug?.yuanTangPoolType}`);
  }
  return {
    source: 'fixture',
    id: goldenCase.id,
    passed: diffs.length === 0,
    diffs,
  };
}

function runSampleCase(sample, source) {
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
  if (reverse.length === 1 && result.yuanTangLine !== reverse[0]) {
    diffs.push(`yuanTangLine expected=${reverse[0]} actual=${result.yuanTangLine}`);
  }

  return {
    source,
    id: sample.id,
    passed: diffs.length === 0,
    diffs,
    reverse,
    coverageTags: sample.coverageTags || [],
  };
}

function printGroup(title, items) {
  console.log(`\n=== ${title} ===`);
  if (!items.length) {
    console.log('(none)');
    return;
  }
  for (const item of items) {
    console.log(`[${item.passed ? 'PASS' : 'FAIL'}] ${item.id}`);
    if (item.reverse) {
      console.log(`  reverse=${JSON.stringify(item.reverse)}`);
    }
    for (const diff of item.diffs) {
      console.log(`  ${diff}`);
    }
  }
}

const fixtureCases = fixtures.filter(item => item.verified && !item.kind && item.expected?.debug?.yuanTangLine);
const coreMatrixCases = matrix.map(sample => runSampleCase(sample, 'matrix'));
const coreTargetedCases = targeted
  .filter(sample => !sample.coverageTags?.includes('exploratory'))
  .map(sample => runSampleCase(sample, 'targeted'));
const boundaryCases = boundary.map(sample => runSampleCase(sample, 'boundary'));
const followupCases = followup.map(sample => runSampleCase(sample, 'followup'));
const exploratoryCases = targeted
  .filter(sample => sample.coverageTags?.includes('exploratory'))
  .map(sample => runSampleCase(sample, 'exploratory'));

const fixtureResults = fixtureCases.map(runFixtureCase);
const coreResults = [...fixtureResults, ...coreMatrixCases, ...coreTargetedCases, ...boundaryCases, ...followupCases];
const failedCore = coreResults.filter(item => !item.passed);
const unresolvedExploratory = exploratoryCases.filter(item => item.reverse.length !== 1 || !item.passed);

printGroup('Core Failures', failedCore);
printGroup('Exploratory Residuals', unresolvedExploratory);

console.log('\n=== Summary ===');
console.log(`coreTotal=${coreResults.length}`);
console.log(`corePassed=${coreResults.length - failedCore.length}`);
console.log(`coreFailed=${failedCore.length}`);
console.log(`fixtureTotal=${fixtureResults.length}`);
console.log(`matrixTotal=${coreMatrixCases.length}`);
console.log(`targetedTotal=${coreTargetedCases.length}`);
console.log(`boundaryTotal=${boundaryCases.length}`);
console.log(`followupTotal=${followupCases.length}`);
console.log(`exploratoryTotal=${exploratoryCases.length}`);
console.log(`exploratoryResiduals=${unresolvedExploratory.length}`);

if (failedCore.length > 0) {
  process.exitCode = 1;
}
