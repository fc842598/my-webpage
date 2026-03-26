/**
 * 子平法命卦 — 黄金样本 v2
 *
 * source 说明：
 *   "algorithm-trace"   — 本地逐步手算推出，结构可信，尚未对照专业工具
 *   "professional-tool" — 已用专业排盘软件核对 ← 待填入
 *   "tianji-dao-book"   — 来源《天机道》书中示例 ← 待填入
 *
 * verified 说明：
 *   false → provisional（临时自洽，失败只产生警告）
 *   true  → 已外部核对（失败视为算法错误，需立即修复）
 *
 * 填入 verified=true case 的方法：
 *   1. 用专业排盘软件（万年历Pro / 海厦学员工具）排出四柱
 *   2. 对照先天卦、后天卦、元堂爻、各年流年卦
 *   3. 将 source 改为 "professional-tool"，verified 改为 true
 *   4. 删除或留空此注释块
 */
const ZIPING_GOLDEN_CASES = [

  // ── Case 1：壬辰甲子丁丑壬子，男，1952 ──────────────────────
  // 手算过程：
  //   天干数：壬(9)甲(1)丁(4)壬(9) + 地支数：辰(5)子(1)丑(2)子(1)
  //   奇数（天数）= 9+5+1+1+9+1 = 26；偶数（地数）= 4+2 = 6
  //   26 % 25 = 1 → 乾(1)；6 % 30 = 6 → 坎(6)
  //   壬(9)阳干，男命阳年 → 阳命 → 天上地下 → 上乾下坎 = 天水讼(6)
  //   三元：(1952-1864)%180=88 → 中元，阳命寄坎(6)，但余数均≠5，不需寄宫
  //   元堂：子时(阳时，pos=0)，阳爻=[爻2,4,5,6]，元堂=爻2
  //   后天：翻转爻2 → 下坎(6)爻2翻 → 坤(8) → 天地否(12)
  {
    id: 'case-壬辰-男-1952',
    description: '壬辰甲子丁丑壬子 男命 birthYear=1952',
    source: 'algorithm-trace',
    verified: false,   // provisional：仅算法自洽，待专业工具核对
    input: {
      pillars: {
        yearStem:'壬', yearBranch:'辰',
        monthStem:'甲', monthBranch:'子',
        dayStem:'丁', dayBranch:'丑',
        hourStem:'壬', hourBranch:'子',
      },
      gender: 'male',
      birthYear: 1952,
    },
    expected: {
      debug: {
        tian: 26, di: 6,
        tianRemainder: 1, diRemainder: 6,
        sanyuan: '中元',
        isYangYear: true, isYangPerson: true,
        guaTian: 1, guaDi: 6,
        jigongApplied: false,
        upper: 1, lower: 6,
        yuanTangLine: 2, yuanTangLineType: 'yang',
      },
      xiantian: { name: '天水讼', num: 6,  upper: 1, lower: 6 },
      houtian:  { name: '天地否', num: 12, upper: 1, lower: 8 },
      spotChecks: [
        // 爻2阳爻(9年)，age1=1952=壬(9阳)→ 保持本卦 天水讼
        { age: 1,  guaName: '天水讼', period: '先天' },
        // age2=1953=癸(10偶)→ 变爻 天地否
        { age: 2,  guaName: '天地否', period: '先天' },
        // 爻3阴爻(6年)：ages 10-15 → 天风姤
        { age: 10, guaName: '天风姤', period: '先天' },
        { age: 13, guaName: '天风姤', period: '先天' },
        // 爻4阳爻(9年)：ages 16-24，yang年→天水讼，yin年→风水涣
        // age16=1967=丁(4偶)→ 风水涣
        { age: 16, guaName: '风水涣', period: '先天' },
        // age17=1968=戊(5奇)→ 天水讼
        { age: 17, guaName: '天水讼', period: '先天' },
        // 爻1阴爻(6年)：ages 43-48 → 天泽履
        { age: 43, guaName: '天泽履', period: '先天' },
        // 后天卦期 爻2阴爻(6年)：ages 49-54 → 翻爻2 of 天地否
        // 天地否 upper=乾(1) lower=坤(8)，爻2在lower坤(8)，坤=['b','b','b']，idx=1 b→s
        // flip 坤爻2 → ['b','s','b']=坎(6)，上乾下坎=天水讼(6)
        { age: 49, guaName: '天水讼', period: '后天' },
      ],
    },
  },

  // ── Case 2：辛亥甲子庚午甲子，女，1971 ──────────────────────
  // 手算过程：
  //   辛(8)亥(12)甲(1)子(1)庚(7)午(7)甲(1)子(1)
  //   奇数（天数）= 1+1+7+7+1+1 = 18；偶数（地数）= 8+12 = 20
  //   18 % 25 = 18 → 18%8=2 → 兑(2)；20 % 30 = 20 → 20%8=4 → 震(4)
  //   辛(8)阴干，女命阴年 → 阳命 → 天上地下 → 上兑下震 = 泽雷随(17)
  //   三元：(1971-1864)%180=107 → 中元，阳命寄坎(6)，余数均≠5，不需寄宫
  //   元堂：子时(阳时，pos=0)，阳爻=[爻1,4,5]，元堂=爻1
  //   后天：翻转爻1 → 下震(4)爻1翻 → 坤(8) → 泽地萃(45)
  {
    id: 'case-辛亥-女-1971',
    description: '辛亥甲子庚午甲子 女命 birthYear=1971',
    source: 'algorithm-trace',
    verified: false,   // provisional
    input: {
      pillars: {
        yearStem:'辛', yearBranch:'亥',
        monthStem:'甲', monthBranch:'子',
        dayStem:'庚', dayBranch:'午',
        hourStem:'甲', hourBranch:'子',
      },
      gender: 'female',
      birthYear: 1971,
    },
    expected: {
      debug: {
        tian: 18, di: 20,
        tianRemainder: 18, diRemainder: 20,
        sanyuan: '中元',
        isYangYear: false, isYangPerson: true,
        guaTian: 2, guaDi: 4,
        jigongApplied: false,
        upper: 2, lower: 4,
        yuanTangLine: 1, yuanTangLineType: 'yang',
      },
      xiantian: { name: '泽雷随', num: 17, upper: 2, lower: 4 },
      houtian:  { name: '泽地萃', num: 45, upper: 2, lower: 8 },
      spotChecks: [
        // 爻1阳爻(9年)：age1=1971=辛(8偶)→ 变爻 泽地萃
        { age: 1,  guaName: '泽地萃', period: '先天' },
        // age2=1972=壬(9奇)→ 保持本卦 泽雷随
        { age: 2,  guaName: '泽雷随', period: '先天' },
        // 爻2阴爻(6年)：ages 10-15 → 兑为泽(58)
        { age: 10, guaName: '兑为泽', period: '先天' },
        // 爻3阴爻(6年)：ages 16-21 → 火泽睽(38)
        { age: 16, guaName: '火泽睽', period: '先天' },
      ],
    },
  },

  // ── Case 3：丙子庚子丁丑壬午，男，1996 ──────────────────────
  // 手算过程：
  //   丙(3)子(1)庚(7)子(1)丁(4)丑(2)壬(9)午(7)
  //   奇数（天数）= 3+1+7+1+9+7 = 28；偶数（地数）= 4+2 = 6
  //   28 % 25 = 3 → 3%8=3 → 离(3)；6 % 30 = 6 → 坎(6)
  //   丙(3)阳干，男命阳年 → 阳命 → 天上地下 → 上离下坎 = 火水未济(64)
  //   三元：(1996-1864)%180=132 → 下元，阳命寄艮(7)，余数均≠5，不需寄宫
  //   元堂：午时(阳时，pos=3)，阳爻=[爻2,4,6]，pos=3 → 3%3=0 → 元堂=爻2
  //   后天：翻转爻2 → 下坎(6)爻2翻 → 坤(8) → 火地晋(35)
  {
    id: 'case-丙子-男-1996',
    description: '丙子庚子丁丑壬午 男命 birthYear=1996',
    source: 'algorithm-trace',
    verified: false,   // provisional
    input: {
      pillars: {
        yearStem:'丙', yearBranch:'子',
        monthStem:'庚', monthBranch:'子',
        dayStem:'丁', dayBranch:'丑',
        hourStem:'壬', hourBranch:'午',
      },
      gender: 'male',
      birthYear: 1996,
    },
    expected: {
      debug: {
        tian: 28, di: 6,
        tianRemainder: 3, diRemainder: 6,
        sanyuan: '下元',
        isYangYear: true, isYangPerson: true,
        guaTian: 3, guaDi: 6,
        jigongApplied: false,
        upper: 3, lower: 6,
        yuanTangLine: 2, yuanTangLineType: 'yang',
      },
      xiantian: { name: '火水未济', num: 64, upper: 3, lower: 6 },
      houtian:  { name: '火地晋',   num: 35, upper: 3, lower: 8 },
      spotChecks: [
        // 爻2阳爻(9年)：age1=1996=丙(3奇)→ 保持本卦 火水未济
        { age: 1,  guaName: '火水未济', period: '先天' },
        // age2=1997=丁(4偶)→ 变爻 火地晋
        { age: 2,  guaName: '火地晋', period: '先天' },
        // 爻3阴爻(6年)：ages 10-15 → 翻爻3 of 火水未济
        // 爻3在下坎(6)=['b','s','b']，idx=0，top b→s=['s','s','b']=巽(5)
        // 上离(3)下巽(5) = GUA_TABLE[2][4] = 50 → 火风鼎
        { age: 10, guaName: '火风鼎', period: '先天' },
      ],
    },
  },

  // ── Case 4：待专业工具核对 ─────────────────────────────────
  // 填入步骤：
  //   1. 用专业排盘工具（万年历Pro / 海厦学员工具）输入四柱
  //   2. 记录：先天卦名/卦号、后天卦名/卦号、元堂爻序、至少5个流年卦
  //   3. 将 verified 改为 true，source 改为 "professional-tool"
  //   4. 取消注释并填入实际数值
  // {
  //   id: 'case-verified-external-001',
  //   description: '待填入：来自专业工具验证的盘',
  //   source: 'professional-tool',
  //   verified: true,
  //   input: {
  //     pillars: {
  //       yearStem: '?', yearBranch: '?',
  //       monthStem: '?', monthBranch: '?',
  //       dayStem: '?', dayBranch: '?',
  //       hourStem: '?', hourBranch: '?',
  //     },
  //     gender: 'male',   // or 'female'
  //     birthYear: 0000,
  //   },
  //   expected: {
  //     xiantian: { name: '?', num: 0, upper: 0, lower: 0 },
  //     houtian:  { name: '?', num: 0, upper: 0, lower: 0 },
  //     spotChecks: [
  //       { age: 1,  guaName: '?', period: '先天' },
  //       { age: 10, guaName: '?', period: '先天' },
  //     ],
  //   },
  // },

  {
    id: 'case-ui-calibration-1991-xieguangzhou',
    description: 'UI-calibrated yearly sequence for 辛未 庚寅 丁巳 辛亥 男 1991',
    source: 'user-screenshot',
    verified: false,
    input: {
      pillars: {
        yearStem: '辛', yearBranch: '未',
        monthStem: '庚', monthBranch: '寅',
        dayStem: '丁', dayBranch: '巳',
        hourStem: '辛', hourBranch: '亥',
      },
      gender: 'male',
      birthYear: 1991,
    },
    uiOverrides: {
      liunianByAge: {
        31: '山雷颐',
        32: '山地剥',
        33: '山水蒙',
        34: '山风蛊',
        35: '火风鼎',
        36: '天风姤',
        37: '泽风大过',
        38: '泽天夬',
        39: '泽火革',
        40: '巽为风',
        41: '天风姤',
        42: '火风鼎',
        43: '雷风恒',
      },
    },
  },
];

if (typeof window !== 'undefined') {
  window.ZIPING_GOLDEN_CASES = ZIPING_GOLDEN_CASES;
} else if (typeof module !== 'undefined') {
  module.exports = ZIPING_GOLDEN_CASES;
}
