(function (root) {
  const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ZI_START_STEM = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬',
  };

  function addStem(stem, offset) {
    const idx = STEMS.indexOf(stem);
    if (idx < 0) return '';
    return STEMS[(idx + offset) % STEMS.length];
  }

  function splitGanzhi(gz) {
    const text = String(gz || '');
    return {
      stem: text.charAt(0) || '',
      branch: text.charAt(1) || '',
    };
  }

  function getHourFromNorm(norm) {
    const hour = norm?.tstResult?.trueSolarHour ?? norm?.cstHour;
    const minute = norm?.tstResult?.trueSolarMinute ?? norm?.cstMinute ?? 0;
    if (typeof hour !== 'number' || Number.isNaN(hour)) return null;
    return { hour, minute };
  }

  function resolveTimeSlot(norm) {
    const current = getHourFromNorm(norm);
    if (!current) return null;
    const hour = current.hour;

    if (hour === 23) return { index: 12, name: '夜子', branch: '子', kind: 'night-zi' };
    if (hour === 0) return { index: 0, name: '早子', branch: '子', kind: 'early-zi' };
    if (hour >= 1 && hour <= 2) return { index: 1, name: '丑', branch: '丑', kind: 'normal' };
    if (hour >= 3 && hour <= 4) return { index: 2, name: '寅', branch: '寅', kind: 'normal' };
    if (hour >= 5 && hour <= 6) return { index: 3, name: '卯', branch: '卯', kind: 'normal' };
    if (hour >= 7 && hour <= 8) return { index: 4, name: '辰', branch: '辰', kind: 'normal' };
    if (hour >= 9 && hour <= 10) return { index: 5, name: '巳', branch: '巳', kind: 'normal' };
    if (hour >= 11 && hour <= 12) return { index: 6, name: '午', branch: '午', kind: 'normal' };
    if (hour >= 13 && hour <= 14) return { index: 7, name: '未', branch: '未', kind: 'normal' };
    if (hour >= 15 && hour <= 16) return { index: 8, name: '申', branch: '申', kind: 'normal' };
    if (hour >= 17 && hour <= 18) return { index: 9, name: '酉', branch: '酉', kind: 'normal' };
    if (hour >= 19 && hour <= 20) return { index: 10, name: '戌', branch: '戌', kind: 'normal' };
    return { index: 11, name: '亥', branch: '亥', kind: 'normal' };
  }

  function buildHourPillar(dayStem, branch) {
    const ziStem = ZI_START_STEM[dayStem];
    const branchOffset = BRANCHES.indexOf(branch);
    if (!ziStem || branchOffset < 0) return '';
    return addStem(ziStem, branchOffset) + branch;
  }

  function computePillarsFromSolarLib(Solar, norm) {
    if (!Solar || !norm) return null;
    const year = Number(norm.year);
    const month = Number(norm.month);
    const day = Number(norm.day);
    if (!year || !month || !day) return null;

    const slot = resolveTimeSlot(norm);
    if (!slot) return null;

    const solarDay = Solar.fromYmd(year, month, day);
    const lunarDay = solarDay.getLunar();

    const yearPillar = lunarDay.getYearInGanZhiByLiChun();
    const monthPillar = lunarDay.getMonthInGanZhi();
    const dayPillar = lunarDay.getDayInGanZhi();

    let hourDayStem = splitGanzhi(dayPillar).stem;
    if (slot.kind === 'night-zi') {
      hourDayStem = splitGanzhi(solarDay.next(1).getLunar().getDayInGanZhi()).stem;
    }

    const hourPillar = buildHourPillar(hourDayStem, slot.branch);
    const yearParts = splitGanzhi(yearPillar);
    const monthParts = splitGanzhi(monthPillar);
    const dayParts = splitGanzhi(dayPillar);
    const hourParts = splitGanzhi(hourPillar);

    return {
      yearStem: yearParts.stem,
      yearBranch: yearParts.branch,
      monthStem: monthParts.stem,
      monthBranch: monthParts.branch,
      dayStem: dayParts.stem,
      dayBranch: dayParts.branch,
      hourStem: hourParts.stem,
      hourBranch: hourParts.branch,
      _tianji: {
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
        timeSlot: slot.name,
        hourDayStem,
        source: 'tianji-like-whole-day',
      },
    };
  }

  const api = {
    resolveTimeSlot,
    buildHourPillar,
    computePillarsFromSolarLib,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.TianjiBazi = api;
}(typeof window !== 'undefined' ? window : globalThis));
