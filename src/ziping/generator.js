/**
 * 子平法命卦 — 离线生成器 v2
 * 规则来源：海厦《天机道》
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

  // ── 数字合 → 先天卦数（天数 mod25，地数 mod30） ─────────────
  function numToTrigram(sum, isHeaven, birthYear, gender, isYangPerson) {
    const mod = isHeaven ? 25 : 30;
    let r = sum % mod;
    if (r === 0) r = mod;
    if (r === 5) return getJigong(birthYear, gender, isYangPerson);
    // 《天机道》P48：超过十位时，只用个位；整十则用十位
    const digit = r >= 10 ? (r % 10 === 0 ? Math.floor(r / 10) : r % 10) : r;
    return T().LUOSHU_TO_TRIGRAM[digit] || null;
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

  // ── 元堂定位 ─────────────────────────────────────────────────
  // 阳时（子寅辰午申戌）→ 取本卦阳爻，子时对第1阳爻
  // 阴时（丑卯巳未酉亥）→ 取本卦阴爻，未时对第1阴爻（午后首阴）
  function getYuanTang(upper, lower, hourBranch) {
    const h6   = hexLines6(upper, lower);
    const yang = h6.map((v, i) => v === 'solid'  ? i + 1 : null).filter(Boolean);
    const yin  = h6.map((v, i) => v === 'broken' ? i + 1 : null).filter(Boolean);
    if (T().YANG_HOURS.includes(hourBranch)) {
      const pos  = T().YANG_HOURS.indexOf(hourBranch);
      const pool = yang.length ? yang : yin;
      return pool[pos % pool.length];
    } else {
      const pos  = T().YIN_HOURS.indexOf(hourBranch);
      const pool = yin.length ? yin : yang;
      return pool[pos % pool.length];
    }
  }

  // ── 年干支 ───────────────────────────────────────────────────
  function yearGanzhi(year) {
    return {
      stem:   T().STEMS[  ((year - 4) % 10 + 10) % 10],
      branch: T().BRANCHES[((year - 4) % 12 + 12) % 12],
    };
  }

  // ── 小流年宫位（紫微斗数三合起宫法） ────────────────────────
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
    const tianR    = (() => { const r = tian % 25; return r === 0 ? 25 : r; })();
    const diR      = (() => { const r = di   % 30; return r === 0 ? 30 : r; })();
    const yangBranches = new Set(['子', '寅', '辰', '午', '申', '戌']);
    const isYangYear   = yangBranches.has(yearBranch);
    const isYangPerson = isYangPersonByYearBranch(yearBranch, gender);
    const guaTian = numToTrigram(tian, true,  birthYear, gender, isYangPerson);
    const guaDi   = numToTrigram(di,   false, birthYear, gender, isYangPerson);
    const upper   = isYangPerson ? guaTian : guaDi;
    const lower   = isYangPerson ? guaDi   : guaTian;
    const gua     = buildGua(upper, lower, isYangPerson);
    const debug   = {
      allNums, oddNums, evenNums, tian, di,
      tianRemainder: tianR, diRemainder: diR,
      tianRem5: tianR === 5, diRem5: diR === 5,
      sanyuan: getSanyuan(birthYear),
      isYangYear, isYangPerson,
      guaTian, guaDi, jigongApplied: tianR === 5 || diR === 5,
      upper, lower, hexLines6: hexLines6(upper, lower),
    };
    return { gua, debug };
  }

  // ── 后天卦（三至尊卦特殊处理）───────────────────────────────
  /**
   * 三至尊卦（坎为水29/水雷屯3/水山蹇39）规则：
   *   《天机道》原文：至尊之卦，阳令不变，阴令从爻。
   *   阳令（元堂爻为阳爻）→ 后天卦 = 先天卦（不变）
   *   阴令（元堂爻为阴爻）→ 后天卦 = 翻转元堂爻（同普通卦）
   *
   * NOTE: 此规则来源于对海厦课程的整理，尚未经外部专业工具完整核对。
   *       若发现不一致，请以专业工具或书中案例为准，并更新 golden cases。
   */
  function computeHouTian(xianTian, yuanTangLine, warnings) {
    if (!xianTian || !yuanTangLine) return null;
    const THREE_ZIZUN = T().THREE_ZIZUN;
    if (THREE_ZIZUN.has(xianTian.num)) {
      const h6          = hexLines6(xianTian.upper, xianTian.lower);
      const yuanTangType = h6[yuanTangLine - 1] === 'solid' ? 'yang' : 'yin';
      const msg = `三至尊卦(${xianTian.name} #${xianTian.num}) 元堂爻${yuanTangLine}为${yuanTangType}爻`;
      warnings.push({
        code: 'THREE_ZIZUN',
        message: msg + (yuanTangType === 'yang'
          ? '→ 阳令，后天卦 = 先天卦（至尊不变）'
          : '→ 阴令，后天卦按普通元堂爻翻转'),
      });
      if (yuanTangType === 'yang') {
        // 阳令 → 至尊不变（后天卦 = 先天卦）
        return { ...xianTian };
      }
      // 阴令 → 正常翻转
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
  function buildLiuNianMap(xianTian, houTian, yuanTangLine, birthYear, maxAge, gender) {
    if (!xianTian || !yuanTangLine) return {};
    const map = {};
    let age = 1;
    const birthYearBranch = yearGanzhi(birthYear).branch;
    const yangStems = new Set(['甲', '丙', '戊', '庚', '壬']);
    const yingLine = lineNum => ((lineNum + 2) % 6) + 1;
    const nextLine = lineNum => (lineNum % 6) + 1;

    function buildFlipSchedule(lineNum, yearsInPeriod, firstYearUnchanged) {
      if (yearsInPeriod <= 1) return [];
      const schedule = [];
      if (firstYearUnchanged) {
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

    function fillPeriod(baseGua, period) {
      const h6 = hexLines6(baseGua.upper, baseGua.lower);
      const lineOrder = [];
      for (let i = yuanTangLine; i <= 6; i++) lineOrder.push(i);
      for (let i = 1; i < yuanTangLine; i++) lineOrder.push(i);

      for (const ln of lineOrder) {
        if (age > maxAge) break;
        const isYang   = h6[ln - 1] === 'solid';
        const numYears = isYang ? 9 : 6;
        const firstYear = birthYear + age - 1;
        const firstGz = yearGanzhi(firstYear);
        const firstYearUnchanged = isYang && yangStems.has(firstGz.stem);
        let gua = firstYearUnchanged ? baseGua : flipHex(baseGua, ln);
        const flipSchedule = buildFlipSchedule(ln, numYears, firstYearUnchanged);

        for (let y = 0; y < numYears && age <= maxAge; y++, age++) {
          if (y > 0) {
            gua = flipHex(gua, flipSchedule[y - 1]);
          }
          const curYear    = birthYear + age - 1;
          const gz         = yearGanzhi(curYear);
          const xiaoLian   = calcXiaoLian(birthYearBranch, gender, age);
          map[age] = {
            name: gua.name, num: gua.num,
            upper: gua.upper, lower: gua.lower, lines: gua.lines,
            isYangPerson: gua.isYangPerson,
            lineNum: ln, lineType: isYang ? 'yang' : 'yin',
            period, yearGanzhi: gz,
            xiaoLian,           // 小流年宫位（出生年支 + 虚岁计算）
          };
        }
      }
    }

    fillPeriod(xianTian, '先天');
    if (houTian && age <= maxAge) fillPeriod(houTian, '后天');
    if (age <= maxAge) {
      const lastKey = Math.max(...Object.keys(map).map(Number));
      const last    = map[lastKey];
      for (let a = age; a <= maxAge; a++) map[a] = last;
    }
    return map;
  }

  // ── 主入口 ──────────────────────────────────────────────────
  function generate(pillars, gender, birthYear, maxAge) {
    maxAge = maxAge || 100;
    const warnings = [];

    const xtResult = computeXianTian(pillars, gender, birthYear);
    if (xtResult.error) {
      return { error: xtResult.error, input: { pillars, gender, birthYear }, warnings };
    }

    const { gua: xianTian, debug } = xtResult;
    const yuanTangLine = getYuanTang(xianTian.upper, xianTian.lower, pillars.hourBranch);
    debug.yuanTangLine     = yuanTangLine;
    debug.yuanTangLineType = debug.hexLines6[yuanTangLine - 1] === 'solid' ? 'yang' : 'yin';

    const houTian    = computeHouTian(xianTian, yuanTangLine, warnings);
    const liunianMap = buildLiuNianMap(
      xianTian, houTian, yuanTangLine, birthYear, maxAge, gender
    );

    return {
      input:  { pillars, gender, birthYear, maxAge },
      debug,
      warnings,   // 三至尊、寄宫等特殊分支的说明
      xiantian:    { name: xianTian.name, num: xianTian.num, upper: xianTian.upper, lower: xianTian.lower, lines: xianTian.lines },
      houtian:     houTian ? { name: houTian.name, num: houTian.num, upper: houTian.upper, lower: houTian.lower, lines: houTian.lines } : null,
      yuanTangLine,
      liunianMap,
    };
  }

  root.ZipingGenerator = { generate, getSanyuan, getYuanTang, yearGanzhi, calcXiaoLian };

}(typeof window !== 'undefined' ? window : global));
