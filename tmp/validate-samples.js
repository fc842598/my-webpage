/**
 * 7-sample validation script for tianji-sample-dump-2.json
 * Run: node tmp/validate-samples.js
 */
'use strict';

const path = require('path');
const BASE = path.join(__dirname, '..');

// All files use (root) pattern — set up global as root
const G = global;

// Load tables
require(path.join(BASE, 'src/ziping/tables.js'));
// Load generator
require(path.join(BASE, 'src/ziping/generator.js'));

const gen = G.ZipingGenerator;
if (!gen) { console.error('ZipingGenerator not loaded'); process.exit(1); }

// Load sample dump
const samples = require(path.join(BASE, 'tmp/tianji-sample-dump-2.json'));

// Map from sample id → input (pillars + gender + birthYear)
// Derived from docs/tianji-ziping-reverse-notes.md
const SAMPLE_INPUTS = {
  '1991-02-16-hai-male': {
    pillars: { yearStem:'辛', yearBranch:'未', monthStem:'庚', monthBranch:'寅',
               dayStem:'丁', dayBranch:'巳', hourStem:'辛', hourBranch:'亥' },
    gender: 'male', birthYear: 1991,
  },
  '1969-03-26-hai-male': {
    pillars: { yearStem:'己', yearBranch:'酉', monthStem:'丁', monthBranch:'卯',
               dayStem:'庚', dayBranch:'子', hourStem:'丁', hourBranch:'亥' },
    gender: 'male', birthYear: 1969,
  },
  '1966-06-25-hai-male': {
    pillars: { yearStem:'丙', yearBranch:'午', monthStem:'甲', monthBranch:'午',
               dayStem:'乙', dayBranch:'卯', hourStem:'丁', hourBranch:'亥' },
    gender: 'male', birthYear: 1966,
  },
  '1996-01-02-you-male': {
    pillars: { yearStem:'乙', yearBranch:'亥', monthStem:'戊', monthBranch:'子',
               dayStem:'戊', dayBranch:'戌', hourStem:'辛', hourBranch:'酉' },
    gender: 'male', birthYear: 1996,
  },
  '2021-03-28-yezi-female': {
    pillars: { yearStem:'辛', yearBranch:'丑', monthStem:'辛', monthBranch:'卯',
               dayStem:'乙', dayBranch:'亥', hourStem:'戊', hourBranch:'子' },
    gender: 'female', birthYear: 2021,
  },
  '1984-04-08-chen-female': {
    pillars: { yearStem:'甲', yearBranch:'子', monthStem:'戊', monthBranch:'辰',
               dayStem:'壬', dayBranch:'申', hourStem:'甲', hourBranch:'辰' },
    gender: 'female', birthYear: 1984,
  },
  '1971-10-06-shen-male': {
    pillars: { yearStem:'辛', yearBranch:'亥', monthStem:'丁', monthBranch:'酉',
               dayStem:'甲', dayBranch:'子', hourStem:'壬', hourBranch:'申' },
    gender: 'male', birthYear: 1971,
  },
};

// Normalize gua name for comparison (handle 遁/遯 variant)
function normName(n) {
  return String(n || '').replace('遯', '遁');
}

console.log('=== 7-sample validation against tianji-sample-dump-2.json ===\n');

let allPass = true;
for (const sample of samples) {
  const id = sample.id;
  const inp = SAMPLE_INPUTS[id];
  if (!inp) {
    console.log(`[SKIP] ${id} — no input mapping found`);
    continue;
  }

  const result = gen.generate(inp.pillars, inp.gender, inp.birthYear);
  if (result.error) {
    console.log(`[FAIL] ${id} — generate() error: ${result.error}`);
    allPass = false;
    continue;
  }

  const liunianMap = result.liunianMap;
  const rows = sample.rows; // array of [ageStr, bits, guaName, flipIdx]

  let firstDiff = null;
  let diffCount = 0;
  for (const row of rows) {
    const age = Number(row[0]);
    const expectedName = row[2];
    const actualEntry = liunianMap[age];
    const actualName = actualEntry ? normName(actualEntry.name) : '(missing)';
    if (normName(expectedName) !== actualName) {
      diffCount++;
      if (!firstDiff) {
        firstDiff = { age, expected: expectedName, actual: actualName };
      }
    }
  }

  // Also check xiantian/houtian names
  const xt = sample.xiantian.replace('先天卦:', '');
  const ht = sample.houtian.replace('后天卦:', '');
  const xtActual = normName(result.xiantian?.name);
  const htActual = normName(result.houtian?.name);

  const xtOk = normName(xt) === xtActual;
  const htOk = normName(ht) === htActual;

  if (firstDiff || !xtOk || !htOk) {
    allPass = false;
    console.log(`[FAIL] ${id}`);
    if (!xtOk) console.log(`       先天卦 expected=${xt} actual=${xtActual}`);
    if (!htOk) console.log(`       后天卦 expected=${ht} actual=${htActual}`);
    if (firstDiff) {
      console.log(`       liunianMap 共 ${diffCount} 处差异`);
      console.log(`       首个差异 age=${firstDiff.age}: expected="${firstDiff.expected}" actual="${firstDiff.actual}"`);
    }
  } else {
    console.log(`[PASS] ${id}  (${rows.length} ages, xt=${xt}, ht=${ht})`);
  }
}

console.log('\n=== 1999-12-26 00:00 male Beijing 早子 case ===');
const earlyZiPillars = {
  yearStem:'己', yearBranch:'卯',
  monthStem:'丙', monthBranch:'子',
  dayStem:'壬', dayBranch:'子',
  hourStem:'庚', hourBranch:'子',
};
const earlyZiResult = gen.generate(earlyZiPillars, 'male', 1999);
if (earlyZiResult.error) {
  console.log('ERROR:', earlyZiResult.error);
} else {
  const xt = earlyZiResult.xiantian?.name;
  const ht = earlyZiResult.houtian?.name;
  const xtOk = normName(xt) === '水山蹇';
  const htOk = normName(ht) === '地水师';
  const fourPillars = `${earlyZiPillars.yearStem}${earlyZiPillars.yearBranch} ${earlyZiPillars.monthStem}${earlyZiPillars.monthBranch} ${earlyZiPillars.dayStem}${earlyZiPillars.dayBranch} ${earlyZiPillars.hourStem}${earlyZiPillars.hourBranch}`;
  console.log(`四柱: ${fourPillars}`);
  console.log(`先天卦: ${xt}  ${xtOk ? '✓' : `✗ (expected 水山蹇)`}`);
  console.log(`后天卦: ${ht}  ${htOk ? '✓' : `✗ (expected 地水师)`}`);
}

console.log('\n=== Summary ===');
console.log(allPass ? 'ALL 7 SAMPLES PASS' : 'SOME SAMPLES FAILED — see above');
