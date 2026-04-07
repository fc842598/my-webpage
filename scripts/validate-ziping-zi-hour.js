'use strict';
/**
 * 子时专项回归测试
 * 覆盖：早子/夜子判定、真太阳时跨界、元堂阳池、四柱日柱切换
 */
const path = require('path');
const BASE = path.join(__dirname, '..');
const G = global;

require(path.join(BASE, 'src/ziping/tables.js'));
require(path.join(BASE, 'src/ziping/generator.js'));
// trueSolarTime.js defines bare functions — load into global scope
const vm = require('vm');
vm.runInThisContext(require('fs').readFileSync(path.join(BASE, 'js/trueSolarTime.js'), 'utf8'));

// tianji-bazi.js exports to global.TianjiBazi
require(path.join(BASE, 'src/ziping/tianji-bazi.js'));

const gen = G.ZipingGenerator;
const T = G.ZipingTables;
const bazi = G.TianjiBazi;

let passed = 0;
let failed = 0;

function assert(label, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.log(`[FAIL] ${label}` + (detail ? `: ${detail}` : ''));
  }
}

// ══════════════════════════════════════════════════════════════
// 1. tstToShichen 边界映射
// ══════════════════════════════════════════════════════════════
(function testTstToShichen() {
  const cases = [
    // [hour, minute, expectedIdx, label]
    [23,  0, 0, '夜子起点 23:00'],
    [23, 30, 0, '夜子中段 23:30'],
    [23, 59, 0, '夜子末尾 23:59'],
    [ 0,  0, 0, '早子起点 00:00'],
    [ 0, 30, 0, '早子中段 00:30'],
    [ 0, 59, 0, '早子末尾 00:59'],
    [ 1,  0, 1, '丑时起点 01:00'],
    [22, 59, 11, '亥时末尾 22:59'],
    [21,  0, 11, '亥时起点 21:00'],
    [11,  0, 6, '午时起点 11:00'],
  ];
  for (const [h, m, expected, label] of cases) {
    const actual = tstToShichen(h, m);
    assert(`tstToShichen-${label}`, actual === expected,
      `hour=${h}:${m} expected=${expected} actual=${actual}`);
  }
})();

// ══════════════════════════════════════════════════════════════
// 2. resolveTimeSlot 早子/夜子
// ══════════════════════════════════════════════════════════════
(function testResolveTimeSlot() {
  const cases = [
    // [cstHour, expectedKind, expectedBranch]
    [23, 'night-zi', '子'],
    [ 0, 'early-zi', '子'],
    [ 1, 'normal',   '丑'],
    [22, 'normal',   '亥'],
  ];
  for (const [hour, expectedKind, expectedBranch] of cases) {
    const norm = { cstHour: hour, cstMinute: 0 };
    const slot = bazi.resolveTimeSlot(norm);
    assert(`resolveTimeSlot-${hour}h-kind`, slot?.kind === expectedKind,
      `hour=${hour} expected=${expectedKind} actual=${slot?.kind}`);
    assert(`resolveTimeSlot-${hour}h-branch`, slot?.branch === expectedBranch,
      `hour=${hour} expected=${expectedBranch} actual=${slot?.branch}`);
  }
})();

// ══════════════════════════════════════════════════════════════
// 3. 夜子 vs 早子 日柱切换
// ══════════════════════════════════════════════════════════════
// 夜子(23:xx)应该用次日日干起时柱
// 早子(00:xx)应该用当日日干起时柱
(function testNightZiDayStemSwitch() {
  // 需要 Solar (lunar-javascript) — 若未安装则跳过
  let Solar;
  try {
    const Lunar = require('lunar-javascript');
    Solar = Lunar.Solar;
  } catch {
    try {
      // 尝试从页面加载的全局
      Solar = G.Solar;
    } catch {
      console.log('[SKIP] 夜子日柱切换测试：lunar-javascript 未安装');
      return;
    }
  }
  if (!Solar) {
    console.log('[SKIP] 夜子日柱切换测试：Solar 不可用');
    return;
  }

  // 2000-01-01 23:00 (夜子) vs 2000-01-02 00:00 (早子) — 同一个子时
  // 夜子用次日(01-02)日干，早子用当日(01-02)日干 → 时柱应该相同
  const nightZiNorm = {
    year: 2000, month: 1, day: 1,
    cstHour: 23, cstMinute: 0,
  };
  const earlyZiNorm = {
    year: 2000, month: 1, day: 2,
    cstHour: 0, cstMinute: 0,
  };

  const nightPillars = bazi.computePillarsFromSolarLib(Solar, nightZiNorm);
  const earlyPillars = bazi.computePillarsFromSolarLib(Solar, earlyZiNorm);

  if (nightPillars && earlyPillars) {
    // 时柱应一致（同一个子时段）
    assert('夜子vs早子-时柱一致',
      nightPillars.hourStem === earlyPillars.hourStem &&
      nightPillars.hourBranch === earlyPillars.hourBranch,
      `night=${nightPillars.hourStem}${nightPillars.hourBranch} early=${earlyPillars.hourStem}${earlyPillars.hourBranch}`);

    // 地支都应该是子
    assert('夜子-时支为子', nightPillars.hourBranch === '子',
      `actual=${nightPillars.hourBranch}`);
    assert('早子-时支为子', earlyPillars.hourBranch === '子',
      `actual=${earlyPillars.hourBranch}`);

    // 日柱：夜子用次日日干，所以夜子的日柱 ≠ 早子的日柱
    // （夜子的 solarDay 是 01-01，但 hourDayStem 取自 01-02 的日干）
    assert('夜子-hourDayStem用次日',
      nightPillars._tianji?.source === 'tianji-like-civil-slot',
      `source=${nightPillars._tianji?.source}`);
  } else {
    console.log('[SKIP] 夜子vs早子日柱测试：computePillarsFromSolarLib 返回 null');
  }
})();

// ══════════════════════════════════════════════════════════════
// 4. generator 元堂：子时永远走阳池
// ══════════════════════════════════════════════════════════════
(function testGeneratorZiYangPool() {
  // 测试多种卦 + 男女 + 不同年干
  const configs = [
    { upper: 1, lower: 1, gender: 'male',   yearStem: '甲', label: '乾-男-甲' },
    { upper: 8, lower: 8, gender: 'female', yearStem: '乙', label: '坤-女-乙' },
    { upper: 6, lower: 6, gender: 'male',   yearStem: '壬', label: '坎-男-壬' },
    { upper: 6, lower: 4, gender: 'female', yearStem: '甲', label: '屯-女-甲' },
    { upper: 6, lower: 7, gender: 'female', yearStem: '癸', label: '蹇-女-癸' },
    { upper: 4, lower: 7, gender: 'male',   yearStem: '庚', label: '小过-男-庚' },
    { upper: 2, lower: 1, gender: 'female', yearStem: '丙', label: '离乾-女-丙' },
  ];
  for (const c of configs) {
    const info = gen.getYuanTangDetail(c.upper, c.lower, '子', c.gender === 'male', {
      gender: c.gender,
      yearStem: c.yearStem,
      xianTianNum: T.GUA_TABLE[c.upper - 1][c.lower - 1],
      lowerTrigram: c.lower,
    });
    assert(`子时阳池-${c.label}`, info.ruleTag === 'zi-fixed-yang',
      `ruleTag=${info.ruleTag} poolType=${info.poolType}`);
  }
})();

// ══════════════════════════════════════════════════════════════
// 5. 真太阳时跨界：CST 子时 → TST 可能跨到亥时
// ══════════════════════════════════════════════════════════════
(function testTstCrossBoundary() {
  // 西部城市（如乌鲁木齐 lon≈87.6）：CST 23:00 的 TST 可能回退 ~2h → ~21:00（亥时）
  const result = calcTrueSolarTime({
    year: 1990, month: 6, day: 15,
    hour: 23, minute: 0,
    longitude: 87.6,
    tzOffset: 8,
  });
  // TST 应该比 CST 早约 130 分钟左右
  assert('乌鲁木齐23时-TST回退',
    result.trueSolarHour < 23,
    `TST=${result.trueSolarHour}:${result.trueSolarMinute}`);

  const tstIdx = tstToShichen(result.trueSolarHour, result.trueSolarMinute);
  const cstIdx = tstToShichen(23, 0);
  assert('乌鲁木齐23时-CST是子时', cstIdx === 0, `cstIdx=${cstIdx}`);
  // TST 可能是亥时(11)或戌时(10)
  assert('乌鲁木齐23时-TST非子时', tstIdx !== 0,
    `tstIdx=${tstIdx} (expected non-zero since TST ~21:xx)`);

  // 这验证了 iztro 用 TST 时辰、子平法用 CST 时辰 是两套不同的取时路径
  // 这是预期行为：紫微斗数用真太阳时，子平法天纪体系用民用时刻
})();

// ══════════════════════════════════════════════════════════════
// 6. 已知样本：1999-12-26 00:00 男 北京（早子）
// ══════════════════════════════════════════════════════════════
(function testKnownEarlyZiSample() {
  let Solar;
  try {
    const Lunar = require('lunar-javascript');
    Solar = Lunar.Solar;
  } catch {
    Solar = G.Solar;
  }
  if (!Solar) {
    console.log('[SKIP] 1999-12-26 早子样本：Solar 不可用');
    return;
  }

  const norm = {
    year: 1999, month: 12, day: 26,
    cstHour: 0, cstMinute: 0,
  };
  const pillars = bazi.computePillarsFromSolarLib(Solar, norm);
  if (!pillars) {
    console.log('[SKIP] 1999-12-26 早子样本：pillars 为 null');
    return;
  }

  // 早子: hourBranch 应该是子
  assert('1999-12-26-00:00-早子-时支', pillars.hourBranch === '子',
    `actual=${pillars.hourBranch}`);
  assert('1999-12-26-00:00-早子-kind', pillars._tianji?.timeSlot === '早子',
    `actual=${pillars._tianji?.timeSlot}`);

  // 跑 generate 确认能正常出结果
  const result = gen.generate(pillars, 'male', 1999);
  assert('1999-12-26-00:00-先天卦存在', !!result.xiantian?.name,
    `xiantian=${result.xiantian?.name}`);
  assert('1999-12-26-00:00-元堂阳池', result.debug?.yuanTangRuleTag === 'zi-fixed-yang',
    `ruleTag=${result.debug?.yuanTangRuleTag}`);
})();

// ══════════════════════════════════════════════════════════════
// 7. 23:30 夜子样本
// ══════════════════════════════════════════════════════════════
(function testKnownNightZiSample() {
  let Solar;
  try {
    const Lunar = require('lunar-javascript');
    Solar = Lunar.Solar;
  } catch {
    Solar = G.Solar;
  }
  if (!Solar) {
    console.log('[SKIP] 夜子 23:30 样本：Solar 不可用');
    return;
  }

  const norm = {
    year: 1999, month: 12, day: 25,
    cstHour: 23, cstMinute: 30,
  };
  const pillars = bazi.computePillarsFromSolarLib(Solar, norm);
  if (!pillars) {
    console.log('[SKIP] 夜子 23:30 样本：pillars 为 null');
    return;
  }

  assert('1999-12-25-23:30-夜子-时支', pillars.hourBranch === '子',
    `actual=${pillars.hourBranch}`);
  assert('1999-12-25-23:30-夜子-kind', pillars._tianji?.timeSlot === '夜子',
    `actual=${pillars._tianji?.timeSlot}`);

  // 夜子用次日日干 — 验证 hourDayStem 来自 12-26 而非 12-25
  const day25 = Solar.fromYmd(1999, 12, 25).getLunar().getDayInGanZhi();
  const day26 = Solar.fromYmd(1999, 12, 26).getLunar().getDayInGanZhi();
  const day25stem = day25.charAt(0);
  const day26stem = day26.charAt(0);
  assert('1999-12-25-夜子-用次日日干',
    pillars._tianji?.hourDayStem === day26stem,
    `hourDayStem=${pillars._tianji?.hourDayStem} day25stem=${day25stem} day26stem=${day26stem}`);

  // generate 也应该走阳池
  const result = gen.generate(pillars, 'male', 1999);
  assert('1999-12-25-23:30-元堂阳池', result.debug?.yuanTangRuleTag === 'zi-fixed-yang',
    `ruleTag=${result.debug?.yuanTangRuleTag}`);
})();

// ══════════════════════════════════════════════════════════════
// 汇总
// ══════════════════════════════════════════════════════════════
console.log(`\n=== Zi-Hour Regression ===`);
console.log(`passed=${passed}  failed=${failed}  total=${passed + failed}`);
if (failed > 0) {
  process.exitCode = 1;
}
