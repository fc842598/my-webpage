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

const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);

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

function buildTrigramReverseMap() {
  const reverse = new Map();
  for (let trigram = 1; trigram <= 8; trigram++) {
    reverse.set(JSON.stringify(T.TRIGRAM_LINES[trigram]), trigram);
  }
  return reverse;
}

const trigramReverse = buildTrigramReverseMap();

function bitsFromGua(gua) {
  return [...T.TRIGRAM_LINES[gua.upper], ...T.TRIGRAM_LINES[gua.lower]]
    .map(line => line === 'solid' ? '1' : '0')
    .join('');
}

function flipTrigram(trigram, lineNum) {
  const displayLines = T.TRIGRAM_LINES[trigram].slice();
  const displayIndex = 3 - lineNum;
  displayLines[displayIndex] = displayLines[displayIndex] === 'solid' ? 'broken' : 'solid';
  const next = trigramReverse.get(JSON.stringify(displayLines));
  if (!next) {
    throw new Error(`Unable to map trigram lines back: ${JSON.stringify(displayLines)}`);
  }
  return next;
}

function flipHex(gua, lineNum) {
  const newUpper = lineNum >= 4 ? flipTrigram(gua.upper, lineNum - 3) : gua.upper;
  const newLower = lineNum < 4 ? flipTrigram(gua.lower, lineNum) : gua.lower;
  return G.buildGua(newUpper, newLower, gua.isYangPerson);
}

function hexLines6FromGua(gua) {
  const lowerDisplay = T.TRIGRAM_LINES[gua.lower];
  const upperDisplay = T.TRIGRAM_LINES[gua.upper];
  return [lowerDisplay[2], lowerDisplay[1], lowerDisplay[0], upperDisplay[2], upperDisplay[1], upperDisplay[0]];
}

function nextLine(lineNum) {
  return (lineNum % 6) + 1;
}

function yingLine(lineNum) {
  return ((lineNum + 2) % 6) + 1;
}

function getHexPeriodYears(gua) {
  if (!gua) return 0;
  return gua.lines.reduce((sum, line) => sum + (line === 'solid' ? 9 : 6), 0);
}

function buildFlipSchedule(lineNum, yearsInPeriod, isYangLine) {
  if (yearsInPeriod <= 1) return [];
  const schedule = [];
  if (isYangLine) {
    schedule.push(yingLine(lineNum));
    let cur = lineNum;
    while (schedule.length < yearsInPeriod - 1) {
      schedule.push(cur);
      cur = nextLine(cur);
    }
    return schedule;
  }
  let cur = nextLine(lineNum);
  while (schedule.length < yearsInPeriod - 1) {
    schedule.push(cur);
    cur = nextLine(cur);
  }
  return schedule;
}

function simulateBookSequence(baseGua, period, yuanTangLine, startYear, maxAge, outRows, ageRef) {
  const lineOrder = [];
  for (let i = yuanTangLine; i <= 6; i++) lineOrder.push(i);
  for (let i = 1; i < yuanTangLine; i++) lineOrder.push(i);

  for (const lineNum of lineOrder) {
    if (ageRef.value > maxAge) break;
    const isYangLine = hexLines6FromGua(baseGua)[lineNum - 1] === 'solid';
    const yearsInPeriod = isYangLine ? 9 : 6;
    const firstYear = startYear + ageRef.value - 1;
    const firstGanzhi = G.yearGanzhi(firstYear);
    const firstYearUnchanged = isYangLine && YANG_STEMS.has(firstGanzhi.stem);
    let gua = firstYearUnchanged ? baseGua : flipHex(baseGua, lineNum);
    const flipSchedule = buildFlipSchedule(lineNum, yearsInPeriod, isYangLine);

    for (let y = 0; y < yearsInPeriod && ageRef.value <= maxAge; y += 1, ageRef.value += 1) {
      if (y > 0) {
        gua = flipHex(gua, flipSchedule[y - 1]);
      }
      outRows.push({
        age: ageRef.value,
        gua: canonName(gua.name),
        bits: bitsFromGua(gua),
        period,
        lineNum,
        lineType: isYangLine ? 'yang' : 'yin',
      });
    }
  }
}

function simulateBookLiuNian(result) {
  const rows = [];
  const ageRef = { value: 1 };
  simulateBookSequence(
    result.xiantian,
    '先天',
    result.yuanTangLine,
    result.sequenceStartYear,
    result.naturalEndAge,
    rows,
    ageRef
  );
  if (result.houtian && ageRef.value <= result.naturalEndAge) {
    simulateBookSequence(
      result.houtian,
      '后天',
      result.houYuanTangLine,
      result.sequenceStartYear,
      result.naturalEndAge,
      rows,
      ageRef
    );
  }
  return rows;
}

function compareOne(sample) {
  const pillars = parsePillarsText(sample.pillars, sample.civilSlot);
  const birthYear = Number(String(sample.inputBirth).slice(0, 4));
  const result = G.generate(pillars, sample.gender, birthYear, 120);
  const simulated = simulateBookLiuNian(result);
  const truth = sample.liunian || [];

  const truthRows = truth.map(row => ({
    age: Number(row.age),
    gua: canonName(row.gua),
    bits: String(row.bits || ''),
  }));

  const mismatch = [];
  const lenOk = truthRows.length === simulated.length;
  const compareLen = Math.min(truthRows.length, simulated.length);
  for (let i = 0; i < compareLen; i += 1) {
    const a = truthRows[i];
    const b = simulated[i];
    if (a.age !== b.age || a.gua !== b.gua || a.bits !== b.bits) {
      mismatch.push({
        index: i,
        truth: a,
        simulated: b,
      });
      break;
    }
  }

  return {
    id: sample.id,
    sampleGroup: sample.sampleGroup,
    civilSlot: sample.civilSlot,
    gender: sample.gender,
    xianName: canonName(result.xiantian?.name),
    houName: canonName(result.houtian?.name),
    startYear: result.sequenceStartYear,
    naturalEndAge: result.naturalEndAge,
    yuanTangLine: result.yuanTangLine,
    houYuanTangLine: result.houYuanTangLine,
    truthLength: truthRows.length,
    simulatedLength: simulated.length,
    lenOk,
    firstYearOk: truthRows[0]?.gua === simulated[0]?.gua && truthRows[0]?.bits === simulated[0]?.bits,
    sequenceOk: lenOk && mismatch.length === 0,
    firstMismatch: mismatch[0] || null,
  };
}

function main() {
  const truth300 = readJson(path.join('tmp', 'tianji-truth-300.json'));
  const rows = truth300.map(compareOne);
  const lenFailed = rows.filter(row => !row.lenOk);
  const firstYearFailed = rows.filter(row => !row.firstYearOk);
  const sequenceFailed = rows.filter(row => !row.sequenceOk);
  const groupCounts = rows.reduce((acc, row) => {
    acc[row.sampleGroup] = acc[row.sampleGroup] || { total: 0, passed: 0 };
    acc[row.sampleGroup].total += 1;
    if (row.sequenceOk) acc[row.sampleGroup].passed += 1;
    return acc;
  }, {});

  console.log('=== Book Liunian Rule Replay ===');
  console.log(`total=${rows.length}`);
  console.log(`lengthPassed=${rows.length - lenFailed.length} lengthFailed=${lenFailed.length}`);
  console.log(`firstYearPassed=${rows.length - firstYearFailed.length} firstYearFailed=${firstYearFailed.length}`);
  console.log(`sequencePassed=${rows.length - sequenceFailed.length} sequenceFailed=${sequenceFailed.length}`);
  console.log('\n=== Group Breakdown ===');
  Object.keys(groupCounts).sort().forEach(key => {
    const item = groupCounts[key];
    console.log(`- ${key}: ${item.passed}/${item.total}`);
  });

  if (sequenceFailed.length) {
    console.log('\n=== First Sequence Mismatches ===');
    sequenceFailed.slice(0, 10).forEach(row => {
      console.log(`- ${row.id}: startYear=${row.startYear} naturalEndAge=${row.naturalEndAge} yuanTang=${row.yuanTangLine}/${row.houYuanTangLine}`);
      console.log(`  truthLen=${row.truthLength} simLen=${row.simulatedLength}`);
      console.log(`  firstMismatch=${JSON.stringify(row.firstMismatch)}`);
    });
  } else {
    console.log('\n=== First Sequence Mismatches ===');
    console.log('(none)');
  }
}

main();
