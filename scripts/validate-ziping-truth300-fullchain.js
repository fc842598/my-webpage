'use strict';

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const G = global;

require(path.join(BASE, 'src/ziping/tables.js'));
require(path.join(BASE, 'src/ziping/generator.js'));

const gen = G.ZipingGenerator;

function canonName(name) {
  return String(name || '')
    .replace(/\u906f/g, '\u9041');
}

function parsePillarsText(text, civilSlot) {
  const [yearP, monthP, dayP, hourP] = String(text || '').trim().split(/\s+/);
  const timeSlot = civilSlot === 'early-zi' ? '\u65e9\u5b50' : civilSlot === 'night-zi' ? '\u591c\u5b50' : civilSlot;
  const timeSlotBranch = civilSlot === 'early-zi' || civilSlot === 'night-zi' ? '\u5b50' : civilSlot;
  const timeSlotKind = civilSlot === 'early-zi' ? 'early-zi' : civilSlot === 'night-zi' ? 'night-zi' : 'normal';
  return {
    yearStem: yearP?.charAt(0) || '',
    yearBranch: yearP?.charAt(1) || '',
    monthStem: monthP?.charAt(0) || '',
    monthBranch: monthP?.charAt(1) || '',
    dayStem: dayP?.charAt(0) || '',
    dayBranch: dayP?.charAt(1) || '',
    hourStem: hourP?.charAt(0) || '',
    hourBranch: hourP?.charAt(1) || '',
    _tianji: {
      timeSlot,
      timeSlotBranch,
      timeSlotKind,
    },
  };
}

function readTruthPool() {
  return JSON.parse(fs.readFileSync(path.join(BASE, 'tmp', 'tianji-truth-300.json'), 'utf8'));
}

function compareLiuNian(sampleRows, actualMap) {
  const expectedLength = Array.isArray(sampleRows) ? sampleRows.length : 0;
  const actualKeys = Object.keys(actualMap || {}).map(Number).filter(Number.isFinite);
  const actualLength = actualKeys.length;

  if (expectedLength !== actualLength) {
    return {
      guaPassed: false,
      linePassed: false,
      passed: false,
      firstMismatch: {
        type: 'length',
        expectedLength,
        actualLength,
      },
    };
  }

  for (const row of sampleRows || []) {
    const age = Number(row.age);
    const actual = actualMap?.[age];
    const expectedName = canonName(row.gua);
    const actualName = canonName(actual?.name);
    const expectedLine = String(row.line ?? '');
    const actualLine = String(actual?.tianjiLineNum ?? actual?.lineNum ?? '');

    if (expectedName !== actualName) {
      return {
        guaPassed: false,
        linePassed: false,
        passed: false,
        firstMismatch: {
          type: 'row',
          age,
          expectedName: row.gua,
          actualName: actual?.name || null,
          expectedLine,
          actualLine,
        },
      };
    }

    if (expectedLine !== actualLine) {
      return {
        guaPassed: true,
        linePassed: false,
        passed: false,
        firstMismatch: {
          type: 'line',
          age,
          expectedName: row.gua,
          actualName: actual?.name || null,
          expectedLine,
          actualLine,
        },
      };
    }
  }

  return { guaPassed: true, linePassed: true, passed: true, firstMismatch: null };
}

function replaySample(sample) {
  const pillars = parsePillarsText(sample.pillars, sample.civilSlot);
  const birthYear = Number(String(sample.inputBirth).slice(0, 4));
  const result = gen.generate(pillars, sample.gender, birthYear, 120);

  if (result?.error) {
    return {
      id: sample.id,
      group: sample.sampleGroup,
      civilSlot: sample.civilSlot,
      gender: sample.gender,
      xianPassed: false,
      houtianPassed: false,
      liunianGuaPassed: false,
      liunianLinePassed: false,
      liunianPassed: false,
      firstLiuNianMismatch: { type: 'generate-error', error: result.error },
      xianExpected: sample.xiantian,
      xianActual: null,
      houtianExpected: sample.houtian,
      houtianActual: null,
      debugRuleTag: null,
    };
  }

  const xianPassed = canonName(sample.xiantian) === canonName(result.xiantian?.name);
  const houtianPassed = canonName(sample.houtian) === canonName(result.houtian?.name);
  const liunianCheck = compareLiuNian(sample.liunian, result.liunianMap);

  return {
    id: sample.id,
    group: sample.sampleGroup,
    civilSlot: sample.civilSlot,
    gender: sample.gender,
    xianPassed,
    houtianPassed,
    liunianGuaPassed: liunianCheck.guaPassed,
    liunianLinePassed: liunianCheck.linePassed,
    liunianPassed: liunianCheck.passed,
    firstLiuNianMismatch: liunianCheck.firstMismatch,
    xianExpected: sample.xiantian,
    xianActual: result.xiantian?.name || null,
    houtianExpected: sample.houtian,
    houtianActual: result.houtian?.name || null,
    debugRuleTag: result.debug?.yuanTangRuleTag || null,
  };
}

function summarizeBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const label = row[key] || '(unknown)';
    const bucket = map.get(label) || { total: 0, xianPassed: 0, houtianPassed: 0, liunianGuaPassed: 0, liunianLinePassed: 0, liunianPassed: 0 };
    bucket.total += 1;
    if (row.xianPassed) bucket.xianPassed += 1;
    if (row.houtianPassed) bucket.houtianPassed += 1;
    if (row.liunianGuaPassed) bucket.liunianGuaPassed += 1;
    if (row.liunianLinePassed) bucket.liunianLinePassed += 1;
    if (row.liunianPassed) bucket.liunianPassed += 1;
    map.set(label, bucket);
  }
  return [...map.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'zh-Hans-CN'));
}

function printFailures(title, rows, predicate, formatter) {
  const failed = rows.filter(predicate);
  console.log(`\n=== ${title} ===`);
  if (!failed.length) {
    console.log('(none)');
    return;
  }
  failed.slice(0, 20).forEach(row => console.log(formatter(row)));
  if (failed.length > 20) {
    console.log(`... and ${failed.length - 20} more`);
  }
}

function printSummaryTable(title, rows, key) {
  console.log(`\n=== ${title} ===`);
  summarizeBy(rows, key).forEach(([label, bucket]) => {
    console.log(
      `${label}: total=${bucket.total} ` +
      `xian=${bucket.xianPassed}/${bucket.total} ` +
      `houtian=${bucket.houtianPassed}/${bucket.total} ` +
      `liunianGua=${bucket.liunianGuaPassed}/${bucket.total} ` +
      `liunianLine=${bucket.liunianLinePassed}/${bucket.total} ` +
      `liunian=${bucket.liunianPassed}/${bucket.total}`
    );
  });
}

function main() {
  const samples = readTruthPool();
  const rows = samples.map(replaySample);

  const xianFailed = rows.filter(row => !row.xianPassed).length;
  const houtianFailed = rows.filter(row => !row.houtianPassed).length;
  const liunianGuaFailed = rows.filter(row => !row.liunianGuaPassed).length;
  const liunianLineFailed = rows.filter(row => !row.liunianLinePassed).length;
  const liunianFailed = rows.filter(row => !row.liunianPassed).length;

  console.log('=== Truth300 Full-Chain Replay ===');
  console.log(`total=${rows.length}`);
  console.log(`xianPassed=${rows.length - xianFailed}  xianFailed=${xianFailed}`);
  console.log(`houtianPassed=${rows.length - houtianFailed}  houtianFailed=${houtianFailed}`);
  console.log(`liunianGuaPassed=${rows.length - liunianGuaFailed}  liunianGuaFailed=${liunianGuaFailed}`);
  console.log(`liunianLinePassed=${rows.length - liunianLineFailed}  liunianLineFailed=${liunianLineFailed}`);
  console.log(`liunianPassed=${rows.length - liunianFailed}  liunianFailed=${liunianFailed}`);
  console.log('note=annual-scope now validates both gua-name sequence and Tianji right-side line numbering');

  printSummaryTable('By Group', rows, 'group');
  printSummaryTable('By Civil Slot', rows, 'civilSlot');

  printFailures(
    'XianTian Failures',
    rows,
    row => !row.xianPassed,
    row => `- ${row.id}: expected=${row.xianExpected} actual=${row.xianActual} / ${row.gender} ${row.civilSlot}`
  );

  printFailures(
    'HouTian Failures',
    rows,
    row => row.xianPassed && !row.houtianPassed,
    row => `- ${row.id}: expected=${row.houtianExpected} actual=${row.houtianActual} / ${row.gender} ${row.civilSlot} / ruleTag=${row.debugRuleTag}`
  );

  printFailures(
    'LiuNian Failures',
    rows,
    row => row.xianPassed && row.houtianPassed && !row.liunianPassed,
    row => {
      const mm = row.firstLiuNianMismatch || {};
      if (mm.type === 'length') {
        return `- ${row.id}: expectedLength=${mm.expectedLength} actualLength=${mm.actualLength} / ${row.gender} ${row.civilSlot}`;
      }
      if (mm.type === 'line') {
        return `- ${row.id}: age=${mm.age} line expected=${mm.expectedLine} actual=${mm.actualLine} / gua=${mm.expectedName} / ${row.gender} ${row.civilSlot}`;
      }
      if (mm.type === 'row') {
        return `- ${row.id}: age=${mm.age} expected=${mm.expectedName}[${mm.expectedLine}] actual=${mm.actualName}[${mm.actualLine}] / ${row.gender} ${row.civilSlot}`;
      }
      return `- ${row.id}: ${JSON.stringify(mm)}`;
    }
  );

  if (xianFailed || houtianFailed || liunianGuaFailed) {
    process.exitCode = 1;
  }
}

main();
