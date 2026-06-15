'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const tablesCode = fs.readFileSync(path.join(rootDir, 'src', 'ziping', 'tables.js'), 'utf8');
const generatorCode = fs.readFileSync(path.join(rootDir, 'src', 'ziping', 'generator.js'), 'utf8');

const ctx = { console, global: null, window: undefined };
ctx.global = ctx;
vm.runInNewContext(tablesCode, ctx, { filename: 'tables.js' });
vm.runInNewContext(generatorCode, ctx, { filename: 'generator.js' });

const G = ctx.ZipingGenerator;
const T = ctx.ZipingTables;

function canonName(name) {
  return String(name || '').replace('遯', '遁');
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relPath), 'utf8'));
}

function hasFixture(relPath) {
  return fs.existsSync(path.join(rootDir, relPath));
}

function buildExpectedMap() {
  const reverse = {};
  for (let upper = 1; upper <= 8; upper++) {
    for (let lower = 1; lower <= 8; lower++) {
      const num = T.GUA_TABLE[upper - 1][lower - 1];
      reverse[canonName(T.HEX_NAME[num])] = { upper, lower, num };
    }
  }
  return reverse;
}

function parsePillarsText(text, civilSlot) {
  const [yearP, monthP, dayP, hourP] = String(text || '').trim().split(/\s+/);
  const timeSlot = civilSlot === 'early-zi' ? '早子' : civilSlot === 'night-zi' ? '夜子' : civilSlot;
  const timeSlotBranch = civilSlot === 'early-zi' || civilSlot === 'night-zi' ? '子' : civilSlot;
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

function replay(sample, reverse) {
  const pillars = parsePillarsText(sample.pillars, sample.civilSlot);
  const birthYear = Number(String(sample.inputBirth).slice(0, 4));
  const result = G.generate(pillars, sample.gender, birthYear, 120);
  const expected = reverse[canonName(sample.xiantian)] || null;
  const actual = result.xiantian || null;
  return {
    id: sample.id,
    inputBirth: sample.inputBirth,
    gender: sample.gender,
    civilSlot: sample.civilSlot,
    xianExpected: sample.xiantian,
    xianActual: actual?.name || null,
    xianOk: canonName(sample.xiantian) === canonName(actual?.name),
    tianR: result.debug?.tianRemainder ?? null,
    diR: result.debug?.diRemainder ?? null,
    guaTianBase: result.debug?.guaTianBase ?? null,
    guaTianActual: result.debug?.guaTian ?? null,
    xianTianTianRuleTag: result.debug?.xianTianTianRuleTag ?? null,
    expectedTian: expected
      ? (result.debug?.isYangPerson ? expected.upper : expected.lower)
      : null,
  };
}

function main() {
  const reverse = buildExpectedMap();
  const truth300Path = path.join('tmp', 'tianji-truth-300.json');

  if (!hasFixture(truth300Path)) {
    console.warn(`[skip] XianTian Experimental Replay: missing optional fixture ${truth300Path}`);
    return;
  }

  const truth300 = readJson(truth300Path);
  const rows = truth300.map(sample => replay(sample, reverse));
  const failed = rows.filter(row => !row.xianOk);

  console.log('=== XianTian Experimental Replay ===');
  console.log(`total=${rows.length}`);
  console.log(`passed=${rows.length - failed.length}  failed=${failed.length}`);

  if (failed.length) {
    console.log('\n=== Remaining XianTian Mismatches ===');
    failed.forEach(row => {
      console.log(`- ${row.id}: ${row.inputBirth} ${row.gender} ${row.civilSlot} / expected=${row.xianExpected} actual=${row.xianActual} / tianR=${row.tianR} diR=${row.diR} base=${row.guaTianBase} actualT=${row.guaTianActual} tag=${row.xianTianTianRuleTag}`);
    });
  } else {
    console.log('\n=== Remaining XianTian Mismatches ===');
    console.log('(none)');
  }
}

main();
