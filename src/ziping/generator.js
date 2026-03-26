/**
 * 子平法命卦 — 离线生成器
 * 输入：四柱(pillars) + gender + birthYear + maxAge
 * 输出：完整结果对象（先天/后天/流年序列 + 中间过程 debug）
 * 无副作用，纯函数，所有规则来自 ZipingTables。
 */
(function (root) {
  // ── 依赖 ZipingTables ──────────────────────────────────────
  function T() { return root.ZipingTables; }

  // ── 内部工具 ───────────────────────────────────────────────

  /** 由年份返回 上元/中元/下元（180年甲子周期） */
  function getSanyuan(birthYear) {
    const r = ((birthYear - 1864) % 180 + 180) % 180;
    if (r < 60)  return '上元';
    if (r < 120) return '中元';
    return '下元';
  }

  /** 5寄宫查表 → 先天卦数 */
  function getJigong(birthYear, isYangPerson) {
    const sy = getSanyuan(birthYear);
    return isYangPerson ? T().JIGONG[sy].yang : T().JIGONG[sy].yin;
  }

  /**
   * 数字合计 → 先天卦数
   * isHeaven=true → mod 25（天数）；false → mod 30（地数）
   * 余5 → 查寄宫表
   */
  function numToTrigram(sum, isHeaven, birthYear, isYangPerson) {
    const mod = isHeaven ? 25 : 30;
    let r = sum % mod;
    if (r === 0) r = mod;
    if (r === 5) return getJigong(birthYear, isYangPerson);
    let g = r % 8;
    if (g === 0) g = 8;
    return g;
  }

  /**
   * 取六爻数组 [爻1(底)..爻6(顶)]，每元素 'solid'|'broken'
   * TRIGRAM_LINES 存储顺序为 display [top, mid, bot]
   */
  function hexLines6(upper, lower) {
    const l = T().TRIGRAM_LINES[lower]; // [爻3顶, 爻2中, 爻1底]
    const u = T().TRIGRAM_LINES[upper]; // [爻6顶, 爻5中, 爻4底]
    return [l[2], l[1], l[0], u[2], u[1], u[0]];
  }

  /**
   * 翻转单卦（三爻）中第 lineInTrigram 爻（1=底,2=中,3=顶）
   * 返回新的先天卦数
   */
  function flipTrigram(trigramNum, lineInTrigram) {
    const idx   = 3 - lineInTrigram; // 底→idx2, 中→idx1, 顶→idx0
    const lines = [...T().TRIGRAM_LINES[trigramNum]];
    lines[idx]  = lines[idx] === 'solid' ? 'broken' : 'solid';
    for (let n = 1; n <= 8; n++) {
      const t = T().TRIGRAM_LINES[n];
      if (t[0] === lines[0] && t[1] === lines[1] && t[2] === lines[2]) return n;
    }
    return trigramNum; // 不应发生
  }

  /** 从上下卦数构建卦象对象（含 display lines） */
  function buildGua(upper, lower, isYangPerson) {
    const num  = T().GUA_TABLE[upper - 1][lower - 1];
    const name = T().HEX_NAME[num] || '—';
    const displayLines = [...T().TRIGRAM_LINES[upper], 'gap', ...T().TRIGRAM_LINES[lower]];
    return { name, num, upper, lower, lines: displayLines, isYangPerson };
  }

  /**
   * 翻转完整六爻卦中第 lineNum 爻（1-6）
   * 返回新的卦象对象
   */
  function flipHex(gua, lineNum) {
    const newUpper = lineNum >= 4
      ? flipTrigram(gua.upper, lineNum - 3)
      : gua.upper;
    const newLower = lineNum < 4
      ? flipTrigram(gua.lower, lineNum)
      : gua.lower;
    return buildGua(newUpper, newLower, gua.isYangPerson);
  }

  /**
   * 元堂定位（《天机道》P49-51）
   * 阳时（子寅辰午申戌）→ 取阳爻，子时=第1阳爻
   * 阴时（丑卯巳未酉亥）→ 取阴爻，未时=第1阴爻（午后首阴）
   */
  function getYuanTang(upper, lower, hourBranch) {
    const h6    = hexLines6(upper, lower);
    const yang  = h6.map((v, i) => v === 'solid'  ? i + 1 : null).filter(Boolean);
    const yin   = h6.map((v, i) => v === 'broken' ? i + 1 : null).filter(Boolean);
    const yangH = T().YANG_HOURS;
    const yinH  = T().YIN_HOURS;
    if (yangH.includes(hourBranch)) {
      const pos  = yangH.indexOf(hourBranch);
      const pool = yang.length ? yang : yin; // 全阴卦降级
      return pool[pos % pool.length];
    } else {
      const pos  = yinH.indexOf(hourBranch);
      const pool = yin.length ? yin : yang;  // 全阳卦降级
      return pool[pos % pool.length];
    }
  }

  /** 年份 → {stem, branch} 干支 */
  function yearGanzhi(year) {
    return {
      stem:   T().STEMS[  ((year - 4) % 10 + 10) % 10],
      branch: T().BRANCHES[((year - 4) % 12 + 12) % 12],
    };
  }

  /** 小流年宫位（紫微斗数规则：三合起宫，男顺女逆） */
  function calcXiaoLian(yearBranch, gender, xuAge) {
    const startMap = gender === 'male'
      ? T().XIAOLIAN_MALE_START
      : T().XIAOLIAN_FEMALE_START;
    const dir      = gender === 'male' ? 1 : -1;
    const startIdx = startMap[yearBranch] ?? 2;
    return T().BRANCHES[((startIdx + dir * (xuAge - 1)) % 12 + 12) % 12];
  }

  // ── 主计算：先天卦 ─────────────────────────────────────────
  function computeXianTian(pillars, gender, birthYear) {
    const { yearStem, yearBranch, monthStem, monthBranch,
            dayStem, dayBranch, hourStem, hourBranch } = pillars;

    // 取所有八字数值
    const SN = T().STEM_NUM;
    const BN = T().BRANCH_NUM;
    const allNums = [
      SN[yearStem],   BN[yearBranch],
      SN[monthStem],  BN[monthBranch],
      SN[dayStem],    BN[dayBranch],
      SN[hourStem],   BN[hourBranch],
    ];

    if (allNums.some(n => typeof n !== 'number')) {
      return { error: '四柱干支无效', pillars };
    }

    const oddNums  = allNums.filter(n => n % 2 === 1); // 天数（奇）
    const evenNums = allNums.filter(n => n % 2 === 0); // 地数（偶）
    const tian     = oddNums.reduce((a, b) => a + b, 0);
    const di       = evenNums.reduce((a, b) => a + b, 0);

    const tianRemainder = (() => { let r = tian % 25; return r === 0 ? 25 : r; })();
    const diRemainder   = (() => { let r = di   % 30; return r === 0 ? 30 : r; })();

    const isYangYear   = (SN[yearStem] % 2) === 1;
    // 阳男/阴女 = 阳命；阴男/阳女 = 阴命
    const isYangPerson = (gender === 'male') === isYangYear;

    const jigongApplied = tianRemainder === 5 || diRemainder === 5;
    const guaTian = numToTrigram(tian, true,  birthYear, isYangPerson);
    const guaDi   = numToTrigram(di,   false, birthYear, isYangPerson);

    // 阳命：天上地下；阴命：地上天下
    const upper = isYangPerson ? guaTian : guaDi;
    const lower = isYangPerson ? guaDi   : guaTian;

    const gua = buildGua(upper, lower, isYangPerson);
    const h6  = hexLines6(upper, lower);

    const debug = {
      allNums, oddNums, evenNums,
      tian, di, tianRemainder, diRemainder,
      tianRem5: tianRemainder === 5,
      diRem5:   diRemainder   === 5,
      sanyuan:  getSanyuan(birthYear),
      isYangYear, isYangPerson,
      guaTian, guaDi,
      jigongApplied,
      upper, lower,
      hexLines6: h6,
    };

    return { gua, debug };
  }

  // ── 主计算：后天卦 ─────────────────────────────────────────
  function computeHouTian(xianTian, yuanTangLine) {
    if (!xianTian || !yuanTangLine) return null;
    // 三至尊卦（坎为水29/水雷屯3/水山蹇39）阴令/阳令细则 → TODO 待书中原表落地
    // 当前：统一按元堂爻翻转
    return flipHex(xianTian, yuanTangLine);
  }

  // ── 主计算：流年序列（逐爻游变）──────────────────────────────
  /**
   * 从元堂爻起，先天期 → 后天期 逐爻推进
   * 阳爻9年 / 阴爻6年；阳爻遇阳年保持本卦，遇阴年变爻
   */
  function buildLiuNianMap(xianTian, houTian, yuanTangLine, birthYear, maxAge) {
    if (!xianTian || !yuanTangLine) return {};
    const map = {};
    let age = 1;

    function fillPeriod(baseGua, period) {
      const h6        = hexLines6(baseGua.upper, baseGua.lower);
      // 从元堂爻起循环
      const lineOrder = [];
      for (let i = yuanTangLine; i <= 6; i++) lineOrder.push(i);
      for (let i = 1; i < yuanTangLine; i++) lineOrder.push(i);

      for (const ln of lineOrder) {
        if (age > maxAge) break;
        const isYang   = h6[ln - 1] === 'solid';
        const numYears = isYang ? 9 : 6;

        for (let y = 0; y < numYears && age <= maxAge; y++, age++) {
          const curYear    = birthYear + age - 1;
          const gz         = yearGanzhi(curYear);
          const isYangYear = (T().STEM_NUM[gz.stem] % 2) === 1;
          // 阳爻遇阳年 → 本卦；其余 → 变爻
          const gua = (isYang && isYangYear) ? baseGua : flipHex(baseGua, ln);
          map[age] = {
            name:  gua.name,
            num:   gua.num,
            upper: gua.upper,
            lower: gua.lower,
            lines: gua.lines,
            isYangPerson: gua.isYangPerson,
            lineNum: ln,
            lineType: isYang ? 'yang' : 'yin',
            period,
            yearGanzhi: gz,
          };
        }
      }
    }

    fillPeriod(xianTian, '先天');
    if (houTian && age <= maxAge) fillPeriod(houTian, '后天');

    // 超出序列后补最后值
    if (age <= maxAge) {
      const lastKey = Math.max(...Object.keys(map).map(Number));
      const last    = map[lastKey];
      for (let a = age; a <= maxAge; a++) map[a] = last;
    }

    return map;
  }

  // ── 主入口 ─────────────────────────────────────────────────
  /**
   * generate(pillars, gender, birthYear, maxAge=100)
   * pillars: { yearStem, yearBranch, monthStem, monthBranch,
   *            dayStem, dayBranch, hourStem, hourBranch }
   * gender: 'male' | 'female'
   * birthYear: 公历年份（整数）
   *
   * 返回：
   * {
   *   input, debug,
   *   xiantian: GuaObj,
   *   houtian:  GuaObj,
   *   yuanTangLine: number,
   *   liunianMap: { [age]: LiuNianItem }
   * }
   */
  function generate(pillars, gender, birthYear, maxAge) {
    maxAge = maxAge || 100;

    const { gua: xianTian, debug } = computeXianTian(pillars, gender, birthYear);
    if (!xianTian) {
      return { error: debug.error, input: { pillars, gender, birthYear } };
    }

    const yuanTangLine = getYuanTang(xianTian.upper, xianTian.lower, pillars.hourBranch);
    debug.yuanTangLine     = yuanTangLine;
    debug.yuanTangLineType = debug.hexLines6[yuanTangLine - 1] === 'solid' ? 'yang' : 'yin';

    const houTian   = computeHouTian(xianTian, yuanTangLine);
    const liunianMap = buildLiuNianMap(xianTian, houTian, yuanTangLine, birthYear, maxAge);

    return {
      input:  { pillars, gender, birthYear, maxAge },
      debug,
      xiantian:    { name: xianTian.name, num: xianTian.num, upper: xianTian.upper, lower: xianTian.lower, lines: xianTian.lines },
      houtian:     houTian ? { name: houTian.name, num: houTian.num, upper: houTian.upper, lower: houTian.lower, lines: houTian.lines } : null,
      yuanTangLine,
      liunianMap,
    };
  }

  root.ZipingGenerator = { generate, getSanyuan, getYuanTang, yearGanzhi };

}(typeof window !== 'undefined' ? window : global));
