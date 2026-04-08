/**
 * 子平法命卦 — 离线生成器 v2
 * 基础规则来源：海厦《天机道》
 * 并按天纪软件实盘样本校准取数与流年推进细节
 * 输出包含完整 debug 中间过程 + warnings 数组（用于外部校验反馈）
 */
(function (root) {
  function T() { return root.ZipingTables; }

  // ── 三元 ────────────────────────────────────────────────────
  function getSanyuan(birthYear) {
    const r = ((birthYear - 1864) % 180 + 180) % 180;
    if (r < 60)  return '上元';
    if (r < 120) return '中元';
    return '下元';
  }

  // ── 5寄宫 ───────────────────────────────────────────────────
  function getJigong(birthYear, gender, isYangPerson) {
    const sy = getSanyuan(birthYear);
    if (sy === '上元' || sy === '下元') {
      return T().JIGONG[sy][gender];
    }
    return isYangPerson ? T().JIGONG[sy].yang : T().JIGONG[sy].yin;
  }

  // ── 天数余数→卦数 覆盖表 ──────────────────────────────────────
  // 来源：天纪软件实盘样本校准（remainder=10,15）+ 《天机道》P48 边界推导（remainder=25）
  // 每条记录：digit = 洛书入口数, trigramOverride = 直接指定卦数(跳过洛书查表)
  // remainder=25 的阳/阴命分流在 numToTrigram 中处理
  const HEAVEN_REMAINDER_OVERRIDES = {
    10: { digit: 1, trigramOverride: 4 },  // 天纪样本：天数余10 → 震卦(4)
    15: { digit: 1, trigramOverride: 6 },  // 天纪样本：天数余15 → 坎卦(6)
    25: { digit: 7, trigramOverride: null },// 天数余25 → 阳命艮(7)/阴命坤(8)，见 numToTrigram
  };

  function getRemainderDetail(sum, isHeaven) {
    const mod = isHeaven ? 25 : 30;
    let remainder = sum % mod;
    if (remainder === 0) remainder = mod;

    // 1) 寄宫：余 5 时取寄宫卦数
    if (remainder === 5) {
      return { remainder, digit: 5, usesJigong: true, trigramOverride: null };
    }

    // 2) 天数特殊余数覆盖表
    const override = isHeaven ? HEAVEN_REMAINDER_OVERRIDES[remainder] : null;
    if (override) {
      return { remainder, digit: override.digit, usesJigong: false, trigramOverride: override.trigramOverride };
    }

    // 3) 通用规则：《天机道》P48 超过十位只用个位，整十用十位
    const digit = remainder >= 10
      ? (remainder % 10 === 0 ? Math.floor(remainder / 10) : remainder % 10)
      : remainder;
    return { remainder, digit, usesJigong: digit === 5, trigramOverride: null };
  }

  // ── 数字合 → 先天卦数（天数 mod25，地数 mod30） ─────────────
  // 优先级：remainder=25 阳阴分流 > trigramOverride > 寄宫 > 洛书查表
  function numToTrigram(sum, isHeaven, birthYear, gender, isYangPerson) {
    const detail = getRemainderDetail(sum, isHeaven);
    // 天数余 25：阳命→艮(7)，阴命→坤(8)（天纪样本校准）
    if (isHeaven && detail.remainder === 25) return isYangPerson ? 7 : 8;
    if (detail.trigramOverride) return detail.trigramOverride;
    if (detail.usesJigong) return getJigong(birthYear, gender, isYangPerson);
    return T().LUOSHU_TO_TRIGRAM[detail.digit] || null;
  }

  // ── 六爻数组（爻1底→爻6顶） ──────────────────────────────────
  function hexLines6(upper, lower) {
    const l = T().TRIGRAM_LINES[lower]; // display [顶, 中, 底]
    const u = T().TRIGRAM_LINES[upper];
    return [l[2], l[1], l[0], u[2], u[1], u[0]];
  }

  function swapOuterInner(gua) {
    if (!gua) return null;
    return buildGua(gua.lower, gua.upper, gua.isYangPerson);
  }

  function isYangPersonByYearBranch(yearBranch, gender) {
    const yangBranches = new Set(['子', '寅', '辰', '午', '申', '戌']);
    const isYangYearBranch = yangBranches.has(yearBranch);
    return (gender === 'male' && isYangYearBranch) || (gender === 'female' && !isYangYearBranch);
  }

  // ── 元堂选池/选爻 规则常量 ────────────────────────────────────
  // 来源：天纪软件实盘样本逐条回归校准
  const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);
  const THREE_ZIZUN_NUMS = new Set([29, 3, 39]); // 坎为水、水雷屯、水山蹇

  // 女命亥时普通卦：(upper, lower) → 元堂爻（跳过 pool 轮转，直接指定）
  const FEMALE_HAI_ORDINARY_LINE_MATRIX = {
    1: { 1: 1, 4: 4, 7: 4 },
    3: { 1: 4, 7: 5 },
    4: { 1: 2, 4: 4, 7: 4, 8: 4 },
    5: { 1: 5, 4: 4, 8: 6 },
    7: { 1: 2, 4: 6, 7: 6 },
    8: { 1: 6, 4: 1 },
  };
  // 女命戌时普通卦：同上结构
  const FEMALE_XU_ORDINARY_LINE_MATRIX = {
    5: { 8: 5 },
  };
  const FEMALE_HAI_QIAN_YIN_HALF_MONTHS = new Set(['丑', '寅', '卯', '辰', '巳', '午']);

  function countSolidLines(upper, lower) {
    return hexLines6(upper, lower).filter(line => line === 'solid').length;
  }

  function getCivilSlotMeta(pillars) {
    const info = pillars?._tianji || {};
    const timeSlot = info.timeSlot || '';
    const timeSlotBranch = info.timeSlotBranch ||
      (timeSlot === '早子' || timeSlot === '夜子' ? '子' : timeSlot || '');
    const timeSlotKind = info.timeSlotKind ||
      (timeSlot === '早子'
        ? 'early-zi'
        : (timeSlot === '夜子'
            ? 'night-zi'
            : (timeSlotBranch ? 'normal' : '')));
    return {
      timeSlot,
      timeSlotBranch,
      timeSlotKind,
    };
  }

  function resolveYuanTangExplicitLine(hourBranch, upper, lower, context) {
    const gender = context?.gender;
    const xianTianNum = context?.xianTianNum;
    const monthBranch = context?.monthBranch;
    const solidCount = context?.solidCount;
    const civilSlotBranch = context?.civilSlotBranch || hourBranch;
    const civilSlotKind = context?.civilSlotKind || 'normal';
    const isNativeHai = civilSlotBranch === '亥' && civilSlotKind === 'normal';
    if (
      gender === 'female' &&
      isNativeHai &&
      upper === 1 &&
      lower === 1 &&
      monthBranch
    ) {
      return {
        line: FEMALE_HAI_QIAN_YIN_HALF_MONTHS.has(monthBranch) ? 1 : 6,
        ruleTag: FEMALE_HAI_QIAN_YIN_HALF_MONTHS.has(monthBranch)
          ? 'female-hai-qian-half-line-1'
          : 'female-hai-qian-half-line-6',
      };
    }
    if (
      gender === 'female' &&
      !THREE_ZIZUN_NUMS.has(xianTianNum)
    ) {
      const lineMap = hourBranch === '亥'
        ? FEMALE_HAI_ORDINARY_LINE_MATRIX
        : (hourBranch === '戌' ? FEMALE_XU_ORDINARY_LINE_MATRIX : null);
      const line = lineMap?.[upper]?.[lower];
      if (line) {
        return {
          line,
          ruleTag: hourBranch === '亥'
            ? 'female-hai-ordinary-line-matrix'
            : 'female-xu-ordinary-line-matrix',
        };
      }
    }
    if (
      isNativeHai &&
      !THREE_ZIZUN_NUMS.has(xianTianNum) &&
      solidCount === 5
    ) {
      return {
        line: 5,
        ruleTag: 'native-hai-five-solid-virtual-mao-line5',
      };
    }
    return null;
  }

  // ── 元堂选池：决定走阳爻池还是阴爻池 ───────────────────────
  // 规则优先级（从高到低），每条带 ruleTag 便于调试追溯：
  //   1. 子时 → 固定阳池          [zi-fixed-yang]          天纪样本回归
  //   2. 上六时：
  //      a. 女命辰时+阳年干+普通卦 → 阴池 [female-chen-yangyear-ordinary-yin]
  //      b. 其余上六时 → 阳池      [upper-six-default-yang]  《天机道》P49
  //   3. 下六时：
  //      a. 女命水雷屯 → 阳池      [female-water-thunder-tun-lower-six-yang]
  //      b. 女命戌/亥+下卦乾震艮 → 阳池 [female-late-lower-six-trigram-147-yang]
  //      c. 其余下六时 → 阴池      [lower-six-default-yin]   《天机道》P49
  function resolveYuanTangPoolType(hourBranch, context, fallbackIsYangPerson) {
    const isUpperSix = T().YANG_HOURS.includes(hourBranch);
    const {
      gender,
      yearStem,
      xianTianNum,
      lowerTrigram,
      solidCount,
      civilSlotBranch,
      civilSlotKind,
    } = context || {};
    const isNativeHai = civilSlotBranch === '亥' && civilSlotKind === 'normal';

    // R1: 子时固定阳池
    if (hourBranch === '子') {
      return { poolType: 'yang', ruleTag: 'zi-fixed-yang' };
    }

    // 兜底：上下文缺失时走简单默认
    if (!gender || !yearStem || !xianTianNum) {
      return {
        poolType: isUpperSix && fallbackIsYangPerson !== false ? 'yang' : 'yin',
        ruleTag: 'legacy-fallback',
      };
    }

    // R2: 上六时
    if (isUpperSix) {
      // R2a: 女命辰时阳年干普通卦 → 阴池
      if (gender === 'female' && hourBranch === '辰' &&
          YANG_STEMS.has(yearStem) && !THREE_ZIZUN_NUMS.has(xianTianNum)) {
        return { poolType: 'yin', ruleTag: 'female-chen-yangyear-ordinary-yin' };
      }
      return { poolType: 'yang', ruleTag: 'upper-six-default-yang' };
    }

    // R3: 下六时
    // R3a: 女命水雷屯 → 阳池
    if (gender === 'female' && xianTianNum === 3) {
      return { poolType: 'yang', ruleTag: 'female-water-thunder-tun-lower-six-yang' };
    }
    // R3b: 女命戌/亥 + 下卦为乾(1)/震(4)/艮(7) → 阳池
    if (gender === 'female' && !THREE_ZIZUN_NUMS.has(xianTianNum) &&
        ['戌', '亥'].includes(hourBranch) && [1, 4, 7].includes(lowerTrigram)) {
      return { poolType: 'yang', ruleTag: 'female-late-lower-six-trigram-147-yang' };
    }
    if (isNativeHai && !THREE_ZIZUN_NUMS.has(xianTianNum)) {
      if ([1, 2, 4].includes(solidCount)) {
        return { poolType: 'yang', ruleTag: 'native-hai-solid-124-yang' };
      }
      if ([0, 3, 6].includes(solidCount)) {
        return { poolType: 'yin', ruleTag: 'native-hai-solid-036-yin' };
      }
    }
    // R3c: 下六时默认阴池
    return { poolType: 'yin', ruleTag: 'lower-six-default-yin' };
  }

  // ── 翻转三爻卦中第 lineInTrigram 爻（1=底,2=中,3=顶） ────────
  function flipTrigram(trigramNum, lineInTrigram) {
    const idx   = 3 - lineInTrigram;
    const lines = [...T().TRIGRAM_LINES[trigramNum]];
    lines[idx]  = lines[idx] === 'solid' ? 'broken' : 'solid';
    for (let n = 1; n <= 8; n++) {
      const t = T().TRIGRAM_LINES[n];
      if (t[0] === lines[0] && t[1] === lines[1] && t[2] === lines[2]) return n;
    }
    return trigramNum;
  }

  // ── 构建卦象对象 ─────────────────────────────────────────────
  function buildGua(upper, lower, isYangPerson) {
    const num  = T().GUA_TABLE[upper - 1][lower - 1];
    const name = T().HEX_NAME[num] || '—';
    const displayLines = [...T().TRIGRAM_LINES[upper], 'gap', ...T().TRIGRAM_LINES[lower]];
    return { name, num, upper, lower, lines: displayLines, isYangPerson };
  }

  // ── 翻转六爻卦中第 lineNum 爻 ─────────────────────────────────
  function flipHex(gua, lineNum) {
    const newUpper = lineNum >= 4 ? flipTrigram(gua.upper, lineNum - 3) : gua.upper;
    const newLower = lineNum < 4  ? flipTrigram(gua.lower, lineNum)     : gua.lower;
    return buildGua(newUpper, newLower, gua.isYangPerson);
  }

  // ── 元堂定位（第 1 层：选池 + 选爻） ──────────────────────────
  // 流程：explicitLine 直取 → poolType 选池 → pool[pos % len] 轮转
  // 池为空时回退到另一池。详细规则见 resolveYuanTangPoolType / resolveYuanTangExplicitLine。
  function getYuanTangDetail(upper, lower, hourBranch, isYangPerson, context) {
    const h6   = hexLines6(upper, lower);
    const yang = h6.map((v, i) => v === 'solid'  ? i + 1 : null).filter(Boolean);
    const yin  = h6.map((v, i) => v === 'broken' ? i + 1 : null).filter(Boolean);
    const isUpperSix = T().YANG_HOURS.includes(hourBranch);
    const pos = isUpperSix
      ? T().YANG_HOURS.indexOf(hourBranch)
      : T().YIN_HOURS.indexOf(hourBranch);
    const xianTianNum = context?.xianTianNum || T().GUA_TABLE[upper - 1][lower - 1];
    const explicitLine = resolveYuanTangExplicitLine(hourBranch, upper, lower, {
      ...context,
      xianTianNum,
    });
    if (explicitLine) {
      return {
        line: explicitLine.line,
        poolType: yang.includes(explicitLine.line) ? 'yang' : 'yin',
        ruleTag: explicitLine.ruleTag,
        hourGroup: isUpperSix ? 'upper-six' : 'lower-six',
        hourPos: pos,
        yangPool: yang,
        yinPool: yin,
      };
    }
    const poolDecision = resolveYuanTangPoolType(
      hourBranch,
      { ...context, xianTianNum, lowerTrigram: lower },
      isYangPerson
    );
    const preferredPoolType = poolDecision.poolType;
    const preferredPool = preferredPoolType === 'yang' ? yang : yin;
    const fallbackPool = preferredPoolType === 'yang' ? yin : yang;
    const pool = preferredPool.length ? preferredPool : fallbackPool;
    const poolType = preferredPool.length
      ? preferredPoolType
      : (preferredPoolType === 'yang' ? 'yin' : 'yang');
    return {
      line: pool[pos % pool.length],
      poolType,
      ruleTag: poolDecision.ruleTag,
      hourGroup: isUpperSix ? 'upper-six' : 'lower-six',
      hourPos: pos,
      yangPool: yang,
      yinPool: yin,
    };
  }

  function getYuanTang(upper, lower, hourBranch, isYangPerson, context) {
    return getYuanTangDetail(upper, lower, hourBranch, isYangPerson, context).line;
  }

  function yingLine(lineNum) {
    return ((lineNum + 2) % 6) + 1;
  }

  // ── 年干支 ───────────────────────────────────────────────────
  function yearGanzhi(year) {
    return {
      stem:   T().STEMS[  ((year - 4) % 10 + 10) % 10],
      branch: T().BRANCHES[((year - 4) % 12 + 12) % 12],
    };
  }

  function resolveSequenceStartYear(birthYear, pillars) {
    const yearStem = pillars?.yearStem;
    const yearBranch = pillars?.yearBranch;
    if (!yearStem || !yearBranch) return birthYear;
    const offsets = [0, -1, 1, -2, 2];
    for (const offset of offsets) {
      const year = birthYear + offset;
      const gz = yearGanzhi(year);
      if (gz.stem === yearStem && gz.branch === yearBranch) return year;
    }
    return birthYear;
  }

  function getHexPeriodYears(gua) {
    if (!gua) return 0;
    return hexLines6(gua.upper, gua.lower)
      .reduce((sum, line) => sum + (line === 'solid' ? 9 : 6), 0);
  }

  // ── 小限宫位（紫微斗数三合起宫法） ──────────────────────────
  function calcXiaoLian(birthYearBranch, gender, xuAge) {
    const startMap = gender === 'male'
      ? T().XIAOLIAN_MALE_START
      : T().XIAOLIAN_FEMALE_START;
    const dir      = gender === 'male' ? 1 : -1;
    const startIdx = startMap[birthYearBranch] ?? 2;
    return T().BRANCHES[((startIdx + dir * (xuAge - 1)) % 12 + 12) % 12];
  }

  // ── 先天卦 ───────────────────────────────────────────────────
  function computeXianTian(pillars, gender, birthYear) {
    const { yearStem, yearBranch, monthStem, monthBranch,
            dayStem, dayBranch, hourStem, hourBranch } = pillars;
    const SN = T().STEM_NUM, BN = T().BRANCH_NUM;
    const allNums = [
      SN[yearStem], ...(BN[yearBranch]  || []),
      SN[monthStem], ...(BN[monthBranch] || []),
      SN[dayStem], ...(BN[dayBranch]   || []),
      SN[hourStem], ...(BN[hourBranch]  || []),
    ];
    if (allNums.some(n => typeof n !== 'number')) {
      return { error: `四柱干支含未知字符: ${JSON.stringify({yearStem,yearBranch,monthStem,monthBranch,dayStem,dayBranch,hourStem,hourBranch})}` };
    }
    const oddNums  = allNums.filter(n => n % 2 === 1);
    const evenNums = allNums.filter(n => n % 2 === 0);
    const tian     = oddNums.reduce((a, b) => a + b, 0);
    const di       = evenNums.reduce((a, b) => a + b, 0);
    const tianDetail = getRemainderDetail(tian, true);
    const diDetail   = getRemainderDetail(di, false);
    const tianR      = tianDetail.remainder;
    const diR        = diDetail.remainder;
    const yangBranches = new Set(['子', '寅', '辰', '午', '申', '戌']);
    const isYangYear   = yangBranches.has(yearBranch);
    const isYangPerson = isYangPersonByYearBranch(yearBranch, gender);
    const guaTian = numToTrigram(tian, true,  birthYear, gender, isYangPerson);
    const guaDi   = numToTrigram(di,   false, birthYear, gender, isYangPerson);
    if (!guaTian || !guaDi) {
      return { error: `先天卦数计算失败: guaTian=${guaTian}, guaDi=${guaDi}` };
    }
    const upper   = isYangPerson ? guaTian : guaDi;
    const lower   = isYangPerson ? guaDi   : guaTian;
    const gua     = buildGua(upper, lower, isYangPerson);
    const debug   = {
      allNums, oddNums, evenNums, tian, di,
      tianRemainder: tianR, diRemainder: diR,
      tianDigit: tianDetail.digit, diDigit: diDetail.digit,
      tianRem5: tianDetail.usesJigong, diRem5: diDetail.usesJigong,
      sanyuan: getSanyuan(birthYear),
      isYangYear, isYangPerson,
      guaTian, guaDi, jigongApplied: tianDetail.usesJigong || diDetail.usesJigong,
      upper, lower, hexLines6: hexLines6(upper, lower),
    };
    return { gua, debug };
  }

  function getLingType(monthBranch) {
    if (['子', '丑', '寅', '卯', '辰', '巳'].includes(monthBranch)) return 'yang';
    if (['午', '未', '申', '酉', '戌', '亥'].includes(monthBranch)) return 'yin';
    return null;
  }

  const THREE_ZIZUN_HOUTIAN_RULES = {
    29: {
      5: { yin: [8, 6], yang: [4, 8] }, // 坎为水 -> 地水师 / 雷地豫
      6: { yin: [6, 5], yang: [5, 4] }, // 坎为水 -> 水风井 / 风雷益
    },
    3: {
      5: { yin: [7, 8], yang: [8, 4] }, // 水雷屯 -> 山地剥 / 地雷复
      6: { yin: [4, 5], yang: [5, 7] }, // 水雷屯 -> 雷风恒 / 风山渐
    },
    39: {
      5: { yin: [8, 7], yang: [6, 8] }, // 水山蹇 -> 地山谦 / 水地比
      6: { yin: [7, 5], yang: [5, 6] }, // 水山蹇 -> 山风蛊 / 风水涣
    },
  };

  // ── 后天卦映射（第 2 层） ────────────────────────────────────
  // 普通卦：元堂爻变 → 外卦入内、内卦出外
  // 三至尊卦：查 THREE_ZIZUN_HOUTIAN_RULES（来源《天机道》P53-P54 图示）
  function computeHouTian(xianTian, yuanTangLine, monthBranch, warnings) {
    if (!xianTian || !yuanTangLine) return null;
    warnings = Array.isArray(warnings) ? warnings : [];
    const lingType = getLingType(monthBranch);
    const specialRule = THREE_ZIZUN_HOUTIAN_RULES[xianTian.num]?.[yuanTangLine]?.[lingType || ''];
    if (specialRule) {
      const [upper, lower] = specialRule;
      warnings.push({
        code: 'THREE_ZIZUN',
        message: `三至尊卦(${xianTian.name} #${xianTian.num}) 元堂爻=${yuanTangLine}，${lingType === 'yang' ? '阳令' : '阴令'}按《天机道》图示直取后天卦`,
      });
      return buildGua(upper, lower, xianTian.isYangPerson);
    }
    const changed = flipHex(xianTian, yuanTangLine);
    // 《天机道》：元堂爻变后，外卦入内、内卦出外
    return swapOuterInner(changed);
  }

  // ── 流年序列（逐爻游变）──────────────────────────────────────
  /**
   * 从元堂爻起，先天期 → 后天期 逐爻推进。
   * 阳爻（9年）：阳年 → 本卦，阴年 → 变爻
   * 阴爻（6年）：全部年份 → 变爻（阴主变，始终处于变态）
   *
   * 规则依据：《天机道》逐爻游变章。
   */
  function buildLiuNianMap(xianTian, houTian, xianYuanTangLine, houYuanTangLine, startYear, maxAge, gender, birthYearBranch) {
    if (!xianTian || !xianYuanTangLine) return {};
    const map = {};
    let age = 1;
    const xiaoLianYearBranch = birthYearBranch || yearGanzhi(startYear).branch;
    const yangStems = new Set(['甲', '丙', '戊', '庚', '壬']);
    const nextLine = lineNum => (lineNum % 6) + 1;

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
      // 阴爻（先天或后天）：y=0 已翻，之后从 nextLine 续推
      let cur = nextLine(lineNum);
      while (schedule.length < yearsInPeriod - 1) {
        schedule.push(cur);
        cur = nextLine(cur);
      }
      return schedule;
    }

    function fillPeriod(baseGua, period, yuanTangLine) {
      const h6 = hexLines6(baseGua.upper, baseGua.lower);
      const lineOrder = [];
      for (let i = yuanTangLine; i <= 6; i++) lineOrder.push(i);
      for (let i = 1; i < yuanTangLine; i++) lineOrder.push(i);

      for (const ln of lineOrder) {
        if (age > maxAge) break;
        const isYang   = h6[ln - 1] === 'solid';
        const numYears = isYang ? 9 : 6;
        const firstYear = startYear + age - 1;
        const firstGz = yearGanzhi(firstYear);
        // 阳爻首年：起始年天干为阳则取本卦，为阴则先翻
        // 阴爻首年：始终直接翻（先天阴爻、后天阴爻规则完全一致）
        const firstYearUnchanged = isYang && yangStems.has(firstGz.stem);
        let gua = firstYearUnchanged ? baseGua : flipHex(baseGua, ln);
        const flipSchedule = buildFlipSchedule(ln, numYears, isYang);

        for (let y = 0; y < numYears && age <= maxAge; y++, age++) {
          if (y > 0) {
            gua = flipHex(gua, flipSchedule[y - 1]);
          }
          const curYear    = startYear + age - 1;
          const gz         = yearGanzhi(curYear);
          const xiaoLian   = calcXiaoLian(xiaoLianYearBranch, gender, age);
          map[age] = {
            name: gua.name, num: gua.num,
            upper: gua.upper, lower: gua.lower, lines: gua.lines,
            isYangPerson: gua.isYangPerson,
            lineNum: ln, lineType: isYang ? 'yang' : 'yin',
            period, yearGanzhi: gz,
            xiaoLian,           // 小限宫位（出生年支 + 虚岁计算）
          };
        }
      }
    }

    fillPeriod(xianTian, '先天', xianYuanTangLine);
    if (houTian && age <= maxAge) fillPeriod(houTian, '后天', houYuanTangLine);
    return map;
  }

  // ── 主入口 ──────────────────────────────────────────────────
  function generate(pillars, gender, birthYear, maxAge) {
    const warnings = [];

    const xtResult = computeXianTian(pillars, gender, birthYear);
    if (xtResult.error) {
      return { error: xtResult.error, input: { pillars, gender, birthYear }, warnings };
    }

    const { gua: xianTian, debug } = xtResult;
    const civilSlotMeta = getCivilSlotMeta(pillars);
    const yuanTangHourBranch = civilSlotMeta.timeSlotBranch || pillars.hourBranch;
    const solidCount = countSolidLines(xianTian.upper, xianTian.lower);
    const yuanTangInfo = getYuanTangDetail(
      xianTian.upper,
      xianTian.lower,
      yuanTangHourBranch,
      xianTian.isYangPerson,
      {
        gender,
        yearStem: pillars.yearStem,
        xianTianNum: xianTian.num,
        monthBranch: pillars.monthBranch,
        solidCount,
        civilSlotBranch: civilSlotMeta.timeSlotBranch || pillars.hourBranch,
        civilSlotKind: civilSlotMeta.timeSlotKind,
      }
    );
    const yuanTangLine = yuanTangInfo.line;
    const houYuanTangLine = yingLine(yuanTangLine);
    debug.yuanTangLine     = yuanTangLine;
    debug.yuanTangLineType = debug.hexLines6[yuanTangLine - 1] === 'solid' ? 'yang' : 'yin';
    debug.civilTimeSlot = civilSlotMeta.timeSlot || null;
    debug.civilTimeSlotBranch = civilSlotMeta.timeSlotBranch || null;
    debug.civilTimeSlotKind = civilSlotMeta.timeSlotKind || null;
    debug.yuanTangHourBranch = yuanTangHourBranch;
    debug.xianSolidCount = solidCount;
    debug.yuanTangPoolType = yuanTangInfo.poolType;
    debug.yuanTangRuleTag  = yuanTangInfo.ruleTag;
    debug.yuanTangHourGroup = yuanTangInfo.hourGroup;
    debug.yuanTangHourPos = yuanTangInfo.hourPos;
    debug.yuanTangYangPool = yuanTangInfo.yangPool;
    debug.yuanTangYinPool = yuanTangInfo.yinPool;
    debug.houYuanTangLine  = houYuanTangLine;

    const houTian    = computeHouTian(xianTian, yuanTangLine, pillars.monthBranch, warnings);
    debug.monthLing  = getLingType(pillars.monthBranch);
    const sequenceStartYear = resolveSequenceStartYear(birthYear, pillars);
    const naturalEndAge = getHexPeriodYears(xianTian) + getHexPeriodYears(houTian);
    const requestedMaxAge = Number(maxAge);
    const effectiveMaxAge = Number.isFinite(requestedMaxAge) && requestedMaxAge > 0
      ? Math.min(Math.floor(requestedMaxAge), naturalEndAge)
      : naturalEndAge;
    debug.sequenceStartYear = sequenceStartYear;
    debug.naturalEndAge = naturalEndAge;
    const liunianMap = buildLiuNianMap(
      xianTian, houTian, yuanTangLine, houYuanTangLine, sequenceStartYear, effectiveMaxAge, gender, pillars.yearBranch
    );

    return {
      input:  {
        pillars,
        gender,
        birthYear,
        maxAge: effectiveMaxAge,
        requestedMaxAge: Number.isFinite(requestedMaxAge) ? requestedMaxAge : null,
      },
      debug,
      warnings,   // 三至尊、寄宫等特殊分支的说明
      xiantian:    { name: xianTian.name, num: xianTian.num, upper: xianTian.upper, lower: xianTian.lower, lines: xianTian.lines },
      houtian:     houTian ? { name: houTian.name, num: houTian.num, upper: houTian.upper, lower: houTian.lower, lines: houTian.lines } : null,
      yuanTangLine,
      houYuanTangLine,
      sequenceStartYear,
      naturalEndAge,
      liunianMap,
    };
  }

  root.ZipingGenerator = {
    generate,
    getSanyuan,
    getYuanTang,
    getYuanTangDetail,
    yearGanzhi,
    calcXiaoLian,
    getLingType,
    computeHouTian,
    buildGua,
  };

}(typeof window !== 'undefined' ? window : global));
