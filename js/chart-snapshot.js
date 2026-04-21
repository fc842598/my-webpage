(function (global) {
  'use strict';

  const SNAPSHOT_VERSION = 'chart-snapshot.v1';

  function toNumberOrNull(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  function textOf(id) {
    const node = global.document && global.document.getElementById(id);
    return node ? String(node.textContent || '').trim() : '';
  }

  function cloneCity(city) {
    if (!city || typeof city !== 'object') return null;
    return {
      name: city.name || '',
      province: city.province || '',
      city: city.city || '',
      lon: toNumberOrNull(city.lon),
      lat: toNumberOrNull(city.lat),
      tzOffset: toNumberOrNull(city.tzOffset),
    };
  }

  function cloneTrueSolarTime(result) {
    if (!result || typeof result !== 'object') return null;
    return {
      trueSolarHour: toNumberOrNull(result.trueSolarHour),
      trueSolarMinute: toNumberOrNull(result.trueSolarMinute),
      localHour: toNumberOrNull(result.localHour),
      localMinute: toNumberOrNull(result.localMinute),
      cstHour: toNumberOrNull(result.cstHour),
      cstMinute: toNumberOrNull(result.cstMinute),
      diffMinutes: toNumberOrNull(result.diffMinutes),
      diffStr: result.diffStr || '',
      isEstimated: !!result.isEstimated,
    };
  }

  function normalizeStar(star) {
    if (!star || typeof star !== 'object') return null;
    return {
      name: star.name || '',
      mutagen: star.mutagen || '',
      brightness: star.brightness || '',
    };
  }

  function normalizeStars(list) {
    return (Array.isArray(list) ? list : [])
      .map(normalizeStar)
      .filter(Boolean);
  }

  function normalizeDecadal(decadal) {
    if (!decadal || typeof decadal !== 'object') return null;
    const rawRange = String(decadal.range || '');
    const parts = rawRange.match(/\d+/g) || [];
    return {
      range: rawRange,
      startAge: parts[0] ? Number(parts[0]) : null,
      endAge: parts[1] ? Number(parts[1]) : null,
      heavenlyStem: decadal.heavenlyStem || '',
    };
  }

  function normalizePalace(palace) {
    if (!palace || typeof palace !== 'object') return null;
    const adjectiveStars = Array.isArray(palace.adjectiveStars)
      ? palace.adjectiveStars
      : Array.isArray(palace.adjStars)
        ? palace.adjStars
        : [];

    return {
      name: palace.name || '',
      branch: palace.earthlyBranch || '',
      stem: palace.heavenlyStem || '',
      isSoulPalace: !!palace.isSoulPalace,
      isBodyPalace: !!palace.isBodyPalace,
      decadal: normalizeDecadal(palace.decadal),
      majorStars: normalizeStars(palace.majorStars),
      minorStars: normalizeStars(palace.minorStars),
      adjectiveStars: adjectiveStars.map(function (item) {
        return typeof item === 'string' ? item : (item && item.name) || '';
      }).filter(Boolean),
      changsheng12: palace.changsheng12 || '',
      boshi12: palace.boshi12 || '',
    };
  }

  function collectYearMutagens(chart) {
    const direct = chart && (chart.mutagens || chart.yearMutagen);
    if (Array.isArray(direct) && direct.length) {
      return direct.map(function (item) {
        if (!item || typeof item !== 'object') {
          return { palace: '', star: '', type: String(item || '') };
        }
        return {
          palace: item.palace || '',
          star: item.star || item.name || '',
          type: item.type || item.mutagen || '',
        };
      });
    }

    const list = [];
    (chart && Array.isArray(chart.palaces) ? chart.palaces : []).forEach(function (palace) {
      normalizeStars(palace.majorStars).concat(normalizeStars(palace.minorStars)).forEach(function (star) {
        if (!star.mutagen) return;
        list.push({
          palace: palace.name || '',
          star: star.name || '',
          type: star.mutagen || '',
        });
      });
    });
    return list;
  }

  function normalizePillars(pillars) {
    if (!pillars || typeof pillars !== 'object') return null;
    return {
      yearStem: pillars.yearStem || '',
      yearBranch: pillars.yearBranch || '',
      monthStem: pillars.monthStem || '',
      monthBranch: pillars.monthBranch || '',
      dayStem: pillars.dayStem || '',
      dayBranch: pillars.dayBranch || '',
      hourStem: pillars.hourStem || '',
      hourBranch: pillars.hourBranch || '',
      year: `${pillars.yearStem || ''}${pillars.yearBranch || ''}`,
      month: `${pillars.monthStem || ''}${pillars.monthBranch || ''}`,
      day: `${pillars.dayStem || ''}${pillars.dayBranch || ''}`,
      hour: `${pillars.hourStem || ''}${pillars.hourBranch || ''}`,
    };
  }

  function normalizeLiunianEntry(ageKey, entry) {
    if (!entry || typeof entry !== 'object') return null;
    return {
      age: Number(ageKey),
      year: toNumberOrNull(entry.year),
      name: entry.name || '',
      num: toNumberOrNull(entry.num),
      period: entry.period || '',
      lineType: entry.lineType || '',
      lineNum: toNumberOrNull(entry.lineNum),
      governingLineNum: toNumberOrNull(entry.governingLineNum),
      appliedLineNum: toNumberOrNull(entry.appliedLineNum),
      tianjiLineNum: toNumberOrNull(entry.tianjiLineNum),
      xiaoLian: entry.xiaoLian || '',
      yearGanzhi: entry.yearGanzhi
        ? {
            stem: entry.yearGanzhi.stem || '',
            branch: entry.yearGanzhi.branch || '',
          }
        : null,
    };
  }

  function normalizeLiunianSeq(seq) {
    return Object.keys(seq || {})
      .map(function (ageKey) {
        return normalizeLiunianEntry(ageKey, seq[ageKey]);
      })
      .filter(Boolean)
      .sort(function (a, b) { return a.age - b.age; });
  }

  function findCurrentDecade(palaces, activeAge) {
    return palaces.find(function (palace) {
      const decadal = palace && palace.decadal;
      if (!decadal) return false;
      return decadal.startAge !== null
        && decadal.endAge !== null
        && activeAge >= decadal.startAge
        && activeAge <= decadal.endAge;
    }) || null;
  }

  function normalizeLifeCurve(data, activeAge) {
    const curve = data && typeof data === 'object' ? data : null;
    const scores = Array.isArray(curve && curve.scores)
      ? curve.scores.map(function (item) {
          return {
            age: toNumberOrNull(item && item.age),
            score: toNumberOrNull(item && item.score),
            summary: (item && item.summary) || '',
          };
        }).filter(function (item) {
          return item.age !== null && item.score !== null;
        })
      : [];

    const decades = Array.isArray(curve && curve.decades)
      ? curve.decades.map(function (item) {
          return {
            range: item && item.range || '',
            start: toNumberOrNull(item && item.start),
            end: toNumberOrNull(item && item.end),
            palace: item && item.palace || '',
            branch: item && item.branch || '',
            baseScore: toNumberOrNull(item && item.decadeBaseScore),
            factor: toNumberOrNull(item && item.decadeFactor),
            summary: item && item.summary || '',
          };
        })
      : [];

    const current = scores.find(function (item) { return item.age === activeAge; }) || null;

    return {
      hasData: scores.length > 0,
      mode: global._fcLifeCurveMode || '',
      criticalYear: toNumberOrNull(global._fcLifeCurveCriticalYear),
      current,
      scores,
      decades,
    };
  }

  function buildSnapshot() {
    const chart = global._chart || null;
    const chartInputs = global._chartInputs || null;
    if (!chart || !chartInputs) return null;

    const norm = chartInputs.norm || {};
    const activeAge = toNumberOrNull(global._fcActiveAge) || 1;
    const palaces = (Array.isArray(chart.palaces) ? chart.palaces : [])
      .map(normalizePalace)
      .filter(Boolean);
    const pillars = normalizePillars(global._birthPillarsCache || null);
    const liunianSeq = normalizeLiunianSeq(global._liunianSeq || {});
    const currentDecade = findCurrentDecade(palaces, activeAge);
    const currentLiunian = liunianSeq.find(function (item) { return item.age === activeAge; }) || null;

    return {
      version: SNAPSHOT_VERSION,
      generatedAt: new Date().toISOString(),
      input: {
        name: norm.name || textOf('fc-c-name') || '',
        gender: chartInputs.gender || '',
        calendarMode: norm.calMode || '',
        dateStr: norm.dateStr || '',
        timeIdx: toNumberOrNull(chartInputs.timeIdx),
        solar: {
          year: toNumberOrNull(norm.year),
          month: toNumberOrNull(norm.month),
          day: toNumberOrNull(norm.day),
        },
        civilTime: {
          hour: toNumberOrNull(norm.cstHour),
          minute: toNumberOrNull(norm.cstMinute),
        },
        city: cloneCity(norm.city),
        trueSolarTime: cloneTrueSolarTime(norm.tstResult),
      },
      display: {
        solarLabel: textOf('fc-c-solar'),
        lunarLabel: textOf('fc-c-lunar'),
        trueSolarTimeLabel: textOf('fc-c-tst'),
        shichenLabel: textOf('fc-c-shichen'),
        fiveElementsClass: textOf('fc-c-meta') || chart.fiveElementsClass || '',
      },
      ziwei: {
        chineseDate: chart.chineseDate || chart.lunarDate || '',
        zodiac: chart.zodiac || '',
        sign: chart.sign || '',
        fiveElementsClass: chart.fiveElementsClass || '',
        soul: chart.soul || '',
        body: chart.body || '',
        soulPalaceBranch: chart.earthlyBranchOfSoulPalace || '',
        bodyPalaceBranch: chart.earthlyBranchOfBodyPalace || '',
        yearMutagens: collectYearMutagens(chart),
        palaces,
      },
      ziping: {
        sequenceStartYear: toNumberOrNull(global._fcSequenceStartYear),
        maxAge: toNumberOrNull(global._fcZipingMaxAge),
        pillars,
        xiantian: global._xianTianGuaResult
          ? {
              name: global._xianTianGuaResult.name || '',
              num: toNumberOrNull(global._xianTianGuaResult.num),
              period: global._xianTianGuaResult.period || '',
            }
          : null,
        houtian: global._houTianGuaResult
          ? {
              name: global._houTianGuaResult.name || '',
              num: toNumberOrNull(global._houTianGuaResult.num),
              period: global._houTianGuaResult.period || '',
            }
          : null,
        currentLiunian,
        liunianSeq,
      },
      runtime: {
        activeAge: activeAge,
        currentDecade: currentDecade
          ? {
              name: currentDecade.name,
              branch: currentDecade.branch,
              stem: currentDecade.stem,
              decadal: currentDecade.decadal,
              majorStars: currentDecade.majorStars,
              minorStars: currentDecade.minorStars,
            }
          : null,
        lifeCurve: normalizeLifeCurve(global._fcLifeCurveData, activeAge),
      },
    };
  }

  global.ChartSnapshot = {
    version: SNAPSHOT_VERSION,
    build: buildSnapshot,
    toJSON: function () {
      const snapshot = buildSnapshot();
      return snapshot ? JSON.stringify(snapshot, null, 2) : '';
    },
  };

  global.getChartSnapshot = buildSnapshot;
}(window));
