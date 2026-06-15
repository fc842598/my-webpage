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

function canonName(name) {
  return String(name || '').replace('遯', '遁');
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relPath), 'utf8'));
}

function hasFixture(relPath) {
  return fs.existsSync(path.join(rootDir, relPath));
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

function replay(sample) {
  const pillars = parsePillarsText(sample.pillars, sample.civilSlot);
  const birthYear = Number(String(sample.inputBirth).slice(0, 4));
  const result = G.generate(pillars, sample.gender, birthYear, 120);
  return {
    id: sample.id,
    inputBirth: sample.inputBirth,
    gender: sample.gender,
    civilSlot: sample.civilSlot,
    xianExpected: sample.xiantian,
    xianActual: result.xiantian?.name || null,
    houtianExpected: sample.houtian,
    houtianActual: result.houtian?.name || null,
    xianOk: canonName(result.xiantian?.name) === canonName(sample.xiantian),
    houtianOk: canonName(result.houtian?.name) === canonName(sample.houtian),
    ruleTag: result.debug?.yuanTangRuleTag || null,
  };
}

function main() {
  const requiredFixtures = [
    path.join('tmp', 'tianji-truth-300.json'),
    path.join('tmp', 'tianji-hai-edge-samples.json'),
    path.join('tmp', 'tianji-female-qian-hai-samples.json'),
    path.join('tmp', 'tianji-female-qian-hai-boundary-samples.json'),
  ];
  const missingFixtures = requiredFixtures.filter(relPath => !hasFixture(relPath));

  if (missingFixtures.length) {
    console.warn(`[skip] Hai Experimental Replay: missing optional fixtures ${missingFixtures.join(', ')}`);
    return;
  }

  const truth300 = readJson(requiredFixtures[0]);
  const haiEdge = readJson(requiredFixtures[1]);
  const femaleQian = readJson(requiredFixtures[2]);
  const femaleQianBoundary = readJson(requiredFixtures[3]);

  const allHai = truth300.filter(item => item.civilSlot === '亥')
    .concat(haiEdge)
    .concat(femaleQian)
    .concat(femaleQianBoundary);

  const rows = allHai.map(replay);
  const xianFailed = rows.filter(row => !row.xianOk);
  const houtianFailed = rows.filter(row => !row.houtianOk);
  const houtianConditionalFailed = rows.filter(row => row.xianOk && !row.houtianOk);

  console.log('=== Hai Experimental Replay ===');
  console.log(`total=${rows.length}`);
  console.log(`xianPassed=${rows.length - xianFailed.length}  xianFailed=${xianFailed.length}`);
  console.log(`houtianPassed=${rows.length - houtianFailed.length}  houtianFailed=${houtianFailed.length}`);
  console.log(`houtianConditionalPassed=${rows.length - xianFailed.length - houtianConditionalFailed.length}  houtianConditionalFailed=${houtianConditionalFailed.length}`);

  if (xianFailed.length) {
    console.log('\n=== XianTian Baseline Mismatches ===');
    xianFailed.forEach(row => {
      console.log(`- ${row.id}: ${row.inputBirth} ${row.gender} ${row.civilSlot} / expected=${row.xianExpected} actual=${row.xianActual}`);
    });
  }

  if (houtianConditionalFailed.length) {
    console.log('\n=== Houtian Mismatches On Xian-Matched Rows ===');
    houtianConditionalFailed.forEach(row => {
      console.log(`- ${row.id}: ${row.inputBirth} ${row.gender} ${row.civilSlot} / expected=${row.houtianExpected} actual=${row.houtianActual} / ruleTag=${row.ruleTag}`);
    });
  } else {
    console.log('\n=== Houtian Mismatches On Xian-Matched Rows ===');
    console.log('(none)');
  }
}

main();
