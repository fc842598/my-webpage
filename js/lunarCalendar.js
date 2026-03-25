// Lunar calendar data and converter
// Precomputed Spring Festival dates and month lengths (1990-2026)

const SPRING_FESTIVAL = {
  1990: [1990, 1, 27], 1991: [1991, 2, 15], 1992: [1992, 2, 4], 1993: [1993, 1, 23],
  1994: [1994, 2, 10], 1995: [1995, 1, 31], 1996: [1996, 2, 19], 1997: [1997, 2, 7],
  1998: [1998, 1, 28], 1999: [1999, 2, 16], 2000: [2000, 2, 5], 2001: [2001, 1, 24],
  2002: [2002, 2, 12], 2003: [2003, 2, 1], 2004: [2004, 1, 22], 2005: [2005, 2, 9],
  2006: [2006, 1, 29], 2007: [2007, 2, 18], 2008: [2008, 2, 7], 2009: [2009, 1, 26],
  2010: [2010, 2, 14], 2011: [2011, 2, 3], 2012: [2012, 1, 23], 2013: [2013, 2, 10],
  2014: [2014, 1, 31], 2015: [2015, 2, 19], 2016: [2016, 2, 8], 2017: [2017, 1, 28],
  2018: [2018, 2, 16], 2019: [2019, 2, 5], 2020: [2020, 1, 25], 2021: [2021, 2, 12],
  2022: [2022, 2, 1], 2023: [2023, 1, 22], 2024: [2024, 2, 10], 2025: [2025, 1, 29],
  2026: [2026, 2, 17], 2027: [2027, 2, 6], 2028: [2028, 1, 26], 2029: [2029, 2, 13],
};

// Lunar month data: [year] = {months:[m1days,...], leap:leapMonthNumber}
// 29 = small month, 30 = big month
const LUNAR_MONTHS = {
  1990: {months:[29,30,29,29,30,29,30,29,30,30,30,30], leap:0},
  1991: {months:[29,29,30,29,30,29,30,29,30,30,30,29,30], leap:6},
  1992: {months:[29,30,29,30,29,30,29,29,30,29,30,30], leap:0},
  1993: {months:[30,29,30,29,30,30,29,30,29,29,30,29,30], leap:3},
  1994: {months:[30,29,30,29,30,29,30,29,30,29,29,30], leap:0},
  1995: {months:[30,29,30,30,29,30,29,30,29,30,29,29,30], leap:8},
  1996: {months:[30,29,30,30,29,30,29,30,29,30,29,30], leap:0},
  1997: {months:[29,30,29,30,29,30,30,29,30,29,30,29], leap:0},
  1998: {months:[30,29,30,29,30,29,30,29,30,30,29,30,30], leap:5},
  1999: {months:[29,29,30,29,29,30,29,30,30,29,30,30], leap:0},
  2000: {months:[30,29,29,30,29,29,30,29,30,29,30,30,30], leap:4},
  2001: {months:[29,30,29,29,30,29,29,30,29,30,29,30], leap:0},
  2002: {months:[30,30,29,30,29,30,29,29,30,29,29,30,29], leap:4},
  2003: {months:[30,30,29,30,29,30,29,30,29,29,30,29], leap:0},
  2004: {months:[30,29,30,30,29,30,29,30,29,30,29,29,30], leap:2},
  2005: {months:[29,30,29,30,30,29,30,29,30,29,30,29], leap:0},
  2006: {months:[29,30,29,30,29,30,30,29,30,30,29,30,29], leap:7},
  2007: {months:[29,29,30,29,30,29,30,29,30,30,29,30], leap:0},
  2008: {months:[30,29,29,30,29,30,29,30,29,30,29,30,30], leap:5},
  2009: {months:[29,30,29,29,30,29,30,29,29,30,30,29], leap:0},
  2010: {months:[30,30,29,30,29,29,30,29,29,30,29,30,29], leap:1},
  2011: {months:[30,30,29,30,29,30,29,30,29,29,30,29], leap:0},
  2012: {months:[30,29,30,30,29,30,29,30,30,29,29,30,29], leap:4},
  2013: {months:[29,30,29,30,29,30,30,29,30,29,30,29], leap:0},
  2014: {months:[29,30,29,30,29,30,29,30,30,29,30,29,30], leap:9},
  2015: {months:[29,29,30,29,30,29,30,29,30,29,30,30], leap:0},
  2016: {months:[30,29,29,30,29,29,30,29,30,30,29,30,30], leap:6},
  2017: {months:[29,30,29,29,30,29,29,30,29,30,29,30], leap:0},
  2018: {months:[30,30,29,30,29,30,29,29,30,29,29,30,29], leap:4},
  2019: {months:[30,30,29,30,29,30,29,30,29,30,29,29], leap:0},
  2020: {months:[30,29,30,30,29,30,29,30,29,30,30,29,29], leap:4},
  2021: {months:[30,29,29,30,30,29,30,29,30,29,30,29], leap:0},
  2022: {months:[29,30,29,29,30,30,29,30,29,30,29,30,29], leap:2},
  2023: {months:[29,30,29,30,29,30,29,29,30,29,30,30], leap:0},
  2024: {months:[29,30,29,30,29,30,30,29,30,29,29,30,29], leap:6},
  2025: {months:[30,29,30,29,30,29,30,29,30,30,29,29], leap:0},
  2026: {months:[30,29,30,30,29,29,30,29,30,30,29,30,29], leap:6},
};

/**
 * Convert lunar date to solar date
 * @param {number} lunarYear
 * @param {number} lunarMonth (1-12)
 * @param {number} lunarDay (1-30)
 * @param {boolean} isLeap
 * @returns {Date|null}
 */
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap = false) {
  const sf = SPRING_FESTIVAL[lunarYear];
  const monthData = LUNAR_MONTHS[lunarYear];
  if (!sf || !monthData) return null;

  let days = 0;
  const months = monthData.months;
  const leapMonth = monthData.leap;

  // Build ordered month list
  let mList = [];
  for (let m = 1; m <= 12; m++) {
    mList.push({m, isLeap: false});
    if (leapMonth === m) {
      mList.push({m, isLeap: true});
    }
  }

  let targetIdx = -1;
  for (let i = 0; i < mList.length; i++) {
    if (mList[i].m === lunarMonth && mList[i].isLeap === isLeap) {
      targetIdx = i; break;
    }
  }
  if (targetIdx === -1) return null;

  for (let i = 0; i < targetIdx; i++) {
    days += months[i];
  }
  days += lunarDay - 1;

  const base = new Date(sf[0], sf[1] - 1, sf[2]);
  base.setDate(base.getDate() + days);
  return base;
}

/**
 * Convert solar date to lunar date
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day
 * @returns {{year, month, day, isLeap, leapMonth}|null}
 */
function solarToLunar(year, month, day) {
  let lunarYear = year;
  let sf = SPRING_FESTIVAL[lunarYear];
  const target = new Date(year, month - 1, day);

  if (!sf) return null;
  let sfDate = new Date(sf[0], sf[1] - 1, sf[2]);

  if (target < sfDate) {
    lunarYear--;
    sf = SPRING_FESTIVAL[lunarYear];
    if (!sf) return null;
    sfDate = new Date(sf[0], sf[1] - 1, sf[2]);
  }

  const monthData = LUNAR_MONTHS[lunarYear];
  if (!monthData) return null;

  let daysFromSF = Math.round((target - sfDate) / 86400000);
  const months = monthData.months;
  const leapMonth = monthData.leap;

  let mList = [];
  for (let m = 1; m <= 12; m++) {
    mList.push({m, isLeap: false});
    if (leapMonth === m) mList.push({m, isLeap: true});
  }

  let mIdx = 0;
  while (mIdx < mList.length && daysFromSF >= months[mIdx]) {
    daysFromSF -= months[mIdx];
    mIdx++;
  }

  return {
    year: lunarYear,
    month: mList[mIdx].m,
    day: daysFromSF + 1,
    isLeap: mList[mIdx].isLeap,
    leapMonth
  };
}

const TIANGAN   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI     = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const MONTHS_CN = ['正','二','三','四','五','六','七','八','九','十','十一','十二'];
const DAYS_CN   = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

function getLunarYearStem(year) {
  return TIANGAN[(year - 4) % 10] + DIZHI[(year - 4) % 12];
}

function formatLunarDate(lunarObj) {
  if (!lunarObj) return '';
  const {year, month, day, isLeap} = lunarObj;
  const stem = getLunarYearStem(year);
  return `${stem}年${isLeap ? '闰' : ''}${MONTHS_CN[month-1]}月${DAYS_CN[day-1]}`;
}
