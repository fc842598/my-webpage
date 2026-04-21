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

function liunianToRows(mapObj) {
  return Object.keys(mapObj)
    .map(key => Number(key))
    .sort((a, b) => a - b)
    .map(age => {
      const row = mapObj[age];
      return {
        age,
        gua: canonName(row.name),
        bits: [...T.TRIGRAM_LINES[row.upper], ...T.TRIGRAM_LINES[row.lower]]
          .map(line => line === 'solid' ? '1' : '0')
          .join(''),
      };
    });
}

function compareOne(sample) {
  const pillars = parsePillarsText(sample.pillars, sample.civilSlot);
  const birthYear = Number(String(sample.inputBirth).slice(0, 4));
  const result = G.generate(pillars, sample.gender, birthYear, 120);
  const actualRows = liunianToRows(result.liunianMap);
  const truthRows = (sample.liunian || []).map(row => ({
    age: Number(row.age),
    gua: canonName(row.gua),
    bits: String(row.bits || ''),
  }));

  let firstMismatch = null;
  const compareLen = Math.min(actualRows.length, truthRows.length);
  for (let i = 0; i < compareLen; i += 1) {
    const a = actualRows[i];
    const b = truthRows[i];
    if (a.age !== b.age || a.gua !== b.gua || a.bits !== b.bits) {
      firstMismatch = { index: i, actual: a, truth: b };
      break;
    }
  }

  return {
    id: sample.id,
    xianOk: canonName(result.xiantian?.name) === canonName(sample.xiantian),
    houtianOk: canonName(result.houtian?.name) === canonName(sample.houtian),
    liunianOk: !firstMismatch && actualRows.length === truthRows.length,
    actualLength: actualRows.length,
    truthLength: truthRows.length,
    firstMismatch,
  };
}

function main() {
  const samples = readJson(path.join('tmp', 'tianji-book-validation-batch-01.json'));
  const rows = samples.map(compareOne);
  const xianFailed = rows.filter(row => !row.xianOk);
  const houtianFailed = rows.filter(row => !row.houtianOk);
  const liunianFailed = rows.filter(row => !row.liunianOk);

  console.log('=== Book Validation Batch 01 Replay ===');
  console.log(`total=${rows.length}`);
  console.log(`xianPassed=${rows.length - xianFailed.length} xianFailed=${xianFailed.length}`);
  console.log(`houtianPassed=${rows.length - houtianFailed.length} houtianFailed=${houtianFailed.length}`);
  console.log(`liunianPassed=${rows.length - liunianFailed.length} liunianFailed=${liunianFailed.length}`);

  if (liunianFailed.length) {
    console.log('\n=== Liunian Mismatches ===');
    liunianFailed.slice(0, 10).forEach(row => {
      console.log(`- ${row.id}: actualLen=${row.actualLength} truthLen=${row.truthLength}`);
      console.log(`  ${JSON.stringify(row.firstMismatch)}`);
    });
  } else {
    console.log('\n=== Liunian Mismatches ===');
    console.log('(none)');
  }
}

main();
