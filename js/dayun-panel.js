(function () {
  const SANHE_PARTNERS = {
    '子': ['申', '辰'], '申': ['子', '辰'], '辰': ['子', '申'],
    '亥': ['卯', '未'], '卯': ['亥', '未'], '未': ['亥', '卯'],
    '寅': ['午', '戌'], '午': ['寅', '戌'], '戌': ['寅', '午'],
    '巳': ['酉', '丑'], '酉': ['巳', '丑'], '丑': ['巳', '酉'],
  };

  const DUIGONG = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
    '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳',
  };

  const state = {
    dayunRanges: [],
    selectedDayunKey: '',
    selectedYearAge: null,
    dayunResultMap: {},
    dayunOverviewMap: {},
    dayunStatusMap: {},
    yearResultMap: {},
    yearStatusMap: {},
    expandedRangeMap: {},
    showAllDayun: false,
    rangeBatchMap: {},
  };

  function notifyDone(label, detail, tag) {
    if (typeof window._desktopNotifyTaskDone === 'function') {
      window._desktopNotifyTaskDone(label, detail, { tag });
    }
  }

  function notifyFailed(label, err, tag) {
    if (typeof window._desktopNotifyTaskFailed === 'function') {
      window._desktopNotifyTaskFailed(label, err?.message || '\u8bf7\u56de\u5230\u9875\u9762\u67e5\u770b\u539f\u56e0\u3002', { tag });
    }
  }

  function getChartPayload() {
    return typeof buildChartPayload === 'function' ? buildChartPayload() : null;
  }

  function getChartRecordId() {
    return window._chartRecordId || null;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getPalaces() {
    return Array.isArray(window._chart?.palaces) ? window._chart.palaces : [];
  }

  function getPalaceByBranch(branch) {
    if (!branch) return null;
    return getPalaces().find((item) => item.earthlyBranch === branch) || null;
  }

  function formatStarList(stars, includeBrightness) {
    const list = Array.isArray(stars) ? stars : [];
    const text = list
      .map((star) => {
        if (!star || !star.name) return '';
        return includeBrightness
          ? `${star.name}${star.brightness || ''}`
          : star.name;
      })
      .filter(Boolean)
      .join('、');
    return text || '—';
  }

  function formatAdjStarList(stars) {
    const list = Array.isArray(stars) ? stars : [];
    const text = list
      .map((star) => (typeof star === 'string' ? star : (star?.name || '')))
      .filter(Boolean)
      .join('、');
    return text || '—';
  }

  function formatYearGanzhi(liunian) {
    if (!liunian?.yearGanzhi) return '';
    return `${liunian.yearGanzhi.stem || ''}${liunian.yearGanzhi.branch || ''}`;
  }

  function getSolarYear(age) {
    const birthYear = Number(window._chartInputs?.norm?.year || 0);
    if (!birthYear) return 0;
    return birthYear + Number(age) - 1;
  }

  function renderSectionsHtml(card) {
    const fallbackText = card?.summary || card?.body || card?.scoreBreakdown?.reason || '';
    const sections = Array.isArray(card?.sections) && card.sections.length
      ? card.sections
      : [{ title: card?.scoreBreakdown?.reason ? '评分依据' : '', content: fallbackText }];
    return sections.map((item) => {
      const title = escapeHtml(item?.title || '');
      const content = escapeHtml(item?.content || '').replace(/\n/g, '<br>');
      return `${title ? `<strong class="aip-body-title">${title}</strong>` : ''}<p class="aip-body-para">${content || '—'}</p>`;
    }).join('');
  }

  function getCardScore(card) {
    const score = card?.scoreBreakdown?.finalScore ?? card?.score;
    const numeric = Math.round(Number(score));
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : null;
  }

  function scoreClass(score) {
    if (score == null) return 'pending';
    if (score >= 75) return 'good';
    if (score >= 50) return 'mid';
    return 'low';
  }

  function getVisibleScoreState(card, loading) {
    if (loading) return { text: '批命中', className: 'pending' };
    if (card) return { text: '已批命', className: 'done' };
    return { text: '待批命', className: 'pending' };
  }

  function renderVisibleStatePillHtml(card, loading) {
    const meta = getVisibleScoreState(card, loading);
    return `<span class="dlx-ai-score-pill ${meta.className}">${escapeHtml(meta.text)}</span>`;
  }

  function renderScorePillHtml(card, fallbackText) {
    void fallbackText;
    return renderVisibleStatePillHtml(card, false);
  }

  function renderScoreDetailHtml(card) {
    void card;
    return '';
  }

  function getCardBrief(card) {
    const firstSection = Array.isArray(card?.sections) ? card.sections.find((item) => item?.content) : null;
    const text = card?.summary || firstSection?.content || card?.body || '';
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function truncateText(text, limit) {
    const raw = String(text || '').trim();
    if (!raw) return '';
    return raw.length > limit ? `${raw.slice(0, limit)}…` : raw;
  }

  function getCardShortReason(card, fallback) {
    return truncateText(card?.scoreBreakdown?.reason || getCardBrief(card) || fallback || '', 38);
  }

  function getCardSummaryLine(card, fallback) {
    return truncateText(getCardBrief(card) || card?.scoreBreakdown?.reason || fallback || '', 86);
  }

  function renderDecadeMetaChips(dayun) {
    const palace = dayun?.palace || {};
    const stem = palace?.decadal?.heavenlyStem || '';
    const stars = Array.isArray(palace?.majorStars)
      ? palace.majorStars.slice(0, 3).map((star) => `${star.name || ''}${star.brightness || ''}`.trim()).filter(Boolean)
      : [];
    const chips = [palace?.name ? `${palace.name}宫` : '', stem ? `${stem}干` : '', ...stars].filter(Boolean);
    return chips.map((label) => `<span class="dlx-meta-chip">${escapeHtml(label)}</span>`).join('');
  }

  function renderTimelineNode(item, selectedKey) {
    if (!item || !item.dayun) return '';
    const key = getRangeKey(item.dayun);
    const card = state.dayunResultMap[key] || state.dayunOverviewMap[key]?.card || null;
    const isCurrent = item.tone === 'current';
    const isSelected = key === selectedKey;
    const visibleState = getVisibleScoreState(card, false);
    const reason = getCardShortReason(card, isCurrent ? '把握当下十年主节奏' : '点击切换查看这段运势');
    return (
      `<button type="button" class="dlx-timeline-node dlx-timeline-${escapeHtml(item.tone || 'normal')}${isCurrent ? ' is-current' : ''}${isSelected ? ' is-selected' : ''}" data-range-key="${escapeHtml(key)}">` +
        `<span class="dlx-timeline-node-label">${escapeHtml(item.label || `第${item.index + 1}大运`)}</span>` +
        `<span class="dlx-timeline-node-age">${escapeHtml(`${item.dayun.start}-${item.dayun.end}岁`)}</span>` +
        `<span class="dlx-timeline-node-copy">${escapeHtml(reason)}</span>` +
        `<span class="dlx-timeline-node-score ${visibleState.className}">${escapeHtml(visibleState.text)}</span>` +
      `</button>`
    );
  }

  function renderTimelineHeroHtml(focusItems, selectedItem, activeAge) {
    const selectedDayun = selectedItem?.dayun || null;
    const selectedKey = getRangeKey(selectedDayun);
    const selectedCard = selectedKey ? (state.dayunResultMap[selectedKey] || state.dayunOverviewMap[selectedKey]?.card || null) : null;
    const selectedState = getVisibleScoreState(selectedCard, false);
    const summary = getCardShortReason(selectedCard, '先看三段十年，再进入单年判断。');
    const trackHtml = (focusItems || []).map((item, idx) => (
      `${idx ? '<span class="dlx-timeline-connector" aria-hidden="true"></span>' : ''}${renderTimelineNode(item, selectedKey)}`
    )).join('');
    return (
      `<section class="dlx-timeline-shell">` +
        `<div class="dlx-timeline-head">` +
          `<div>` +
            `<div class="dlx-timeline-kicker">时间叙事线</div>` +
            `<div class="dlx-timeline-title">大限流年</div>` +
            `<div class="dlx-timeline-copy">时间的轻重，跟着总运势走。</div>` +
          `</div>` +
          `<button type="button" class="dlx-show-all-btn" data-dlx-show-all="1">${state.showAllDayun ? '收起其它大运' : '查看全部大运'}</button>` +
        `</div>` +
        `<div class="dlx-timeline-track">${trackHtml}</div>` +
        `<div class="dlx-timeline-summary">` +
          `<div class="dlx-timeline-summary-score"><span>整体节奏</span><strong>${escapeHtml(selectedState.text)}</strong><em>${selectedCard ? '真实评分已计算' : '先批当前十年'}</em></div>` +
          `<div class="dlx-timeline-summary-copy">${escapeHtml(summary)}</div>` +
          `<div class="dlx-timeline-summary-meta">${activeAge ? `当前虚岁 ${activeAge} 岁` : '当前年龄未识别'}${selectedDayun ? ` · 当前查看 ${selectedDayun.start}-${selectedDayun.end}岁` : ''}</div>` +
        `</div>` +
      `</section>`
    );
  }

  function renderRestDayunRail(items, selectedKey) {
    if (!items.length) return '';
    return (
      `<section class="dlx-rest-rail">` +
        `<div class="dlx-rest-rail-title">其它大运</div>` +
        `<div class="dlx-rest-rail-grid">` +
          items.map((item) => {
            const key = getRangeKey(item.dayun);
            const card = state.dayunResultMap[key] || state.dayunOverviewMap[key]?.card || null;
            return (
              `<button type="button" class="dlx-rail-card${key === selectedKey ? ' active' : ''}" data-range-key="${escapeHtml(key)}">` +
                `<span class="dlx-rail-card-top">${escapeHtml(item.label || `第${item.index + 1}大运`)}</span>` +
                `<span class="dlx-rail-card-age">${escapeHtml(`${item.dayun.start}-${item.dayun.end}岁`)}</span>` +
                `<span class="dlx-rail-card-copy">${escapeHtml(getCardShortReason(card, '点击切换查看'))}</span>` +
              `</button>`
            );
          }).join('') +
        `</div>` +
      `</section>`
    );
  }

  function renderYearStatePillHtml(card, loading) {
    return renderVisibleStatePillHtml(card, loading);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function serializePalaceForContext(palace) {
    if (!palace) return null;
    return {
      name: palace.name || '',
      branch: palace.earthlyBranch || '',
      majorStars: (palace.majorStars || []).map((star) => ({
        name: star.name,
        brightness: star.brightness || '',
        mutagen: star.mutagen || null,
      })),
      minorStars: (palace.minorStars || []).map((star) => ({
        name: star.name,
        mutagen: star.mutagen || null,
      })),
      adjStars: (palace.adjectiveStars || []).map((star) => ({
        name: star.name,
      })),
    };
  }

  function getDecadeMutagens(palace) {
    return [...(palace?.majorStars || []), ...(palace?.minorStars || [])]
      .filter((star) => star?.mutagen)
      .map((star) => ({
        star: star.name,
        type: star.mutagen,
      }));
  }

  function getSanfangSizheng(branch) {
    if (!branch) return [];
    const branches = [branch, ...(SANHE_PARTNERS[branch] || []), DUIGONG[branch]].filter(Boolean);
    const labels = ['本宫', '三方', '三方', '对宫'];
    return branches.map((item, index) => {
      const palace = getPalaceByBranch(item);
      return {
        role: labels[index] || '关联',
        branch: item,
        palaceName: palace?.name || item,
        majorStars: (palace?.majorStars || []).map((star) => ({
          name: star.name,
          brightness: star.brightness || '',
          mutagen: star.mutagen || null,
        })),
        minorStars: (palace?.minorStars || []).map((star) => ({
          name: star.name,
          mutagen: star.mutagen || null,
        })),
        adjStars: (palace?.adjectiveStars || []).map((star) => star.name),
      };
    });
  }

  function serializeDayun(dayun) {
    if (!dayun) return null;
    const palace = dayun.palace || null;
    const rangeKey = `${dayun.start}-${dayun.end}`;
    const rangeLabel = `${dayun.start}-${dayun.end}岁`;
    return {
      rangeKey,
      rangeLabel,
      ageStart: Number(dayun.start),
      ageEnd: Number(dayun.end),
      palaceName: palace?.name || '',
      palaceBranch: palace?.earthlyBranch || '',
      palaceStem: palace?.decadal?.heavenlyStem || '',
      majorStars: (palace?.majorStars || []).map((star) => ({
        name: star.name,
        brightness: star.brightness || '',
        mutagen: star.mutagen || null,
      })),
      minorStars: (palace?.minorStars || []).map((star) => ({
        name: star.name,
        mutagen: star.mutagen || null,
      })),
      adjStars: (palace?.adjectiveStars || []).map((star) => star.name),
      mutagens: getDecadeMutagens(palace),
      sanfangSizheng: getSanfangSizheng(palace?.earthlyBranch || ''),
    };
  }

  function getXiaolianPalace(age) {
    const liunian = (window._liunianSeq || {})[Number(age)] || null;
    const branch = liunian?.xiaoLian || '';
    return getPalaceByBranch(branch);
  }

  function serializeYear(age, selectedDayun) {
    const numericAge = Number(age);
    const liunian = (window._liunianSeq || {})[numericAge] || null;
    const palace = getXiaolianPalace(numericAge);
    return {
      rangeKey: selectedDayun?.rangeKey || '',
      age: numericAge,
      solarYear: getSolarYear(numericAge),
      yearGanzhi: formatYearGanzhi(liunian),
      xiaolianPalace: serializePalaceForContext(palace),
      xiaolianPalaceName: palace?.name || '',
      liunianGua: liunian ? {
        name: liunian.name || '',
        period: liunian.period || '',
      } : null,
    };
  }

  function getSelectedDayunRaw() {
    return state.dayunRanges.find((item) => `${item.start}-${item.end}` === state.selectedDayunKey) || null;
  }

  function getSelectedDayun() {
    return serializeDayun(getSelectedDayunRaw());
  }

  function syncCurrentYears() {
    const selected = getSelectedDayunRaw();
    if (!selected) {
      state.selectedYearAge = null;
      return;
    }
    if (state.selectedYearAge == null || state.selectedYearAge < selected.start || state.selectedYearAge > selected.end) {
      state.selectedYearAge = Number(window._fcActiveAge || selected.start);
      if (state.selectedYearAge < selected.start || state.selectedYearAge > selected.end) {
        state.selectedYearAge = selected.start;
      }
    }
  }

  function exposeLifeCurveSignals() {
    window._dayunAiResultMap = state.dayunResultMap;
    window._liunianAiResultMap = state.yearResultMap;
    window._fcGetLuckAiSignalForAge = function (age) {
      const numericAge = Number(age);
      const rawDayun = state.dayunRanges.find((item) => numericAge >= item.start && numericAge <= item.end) || null;
      const rangeKey = rawDayun ? `${rawDayun.start}-${rawDayun.end}` : '';
      return {
        age: numericAge,
        dayunKey: rangeKey,
        dayunCard: rangeKey ? state.dayunResultMap[rangeKey] || null : null,
        liunianCard: state.yearResultMap[String(numericAge)] || null,
      };
    };
    window._fcGetLuckAiSignalForRange = function (rangeKey) {
      return {
        rangeKey: String(rangeKey || ''),
        dayunCard: state.dayunResultMap[String(rangeKey || '')] || null,
      };
    };
    window._fcGetLuckAiScoreInput = function (age) {
      return window._fcGetLuckAiSignalForAge(age);
    };
    window._fcEnsureLuckScoresForAges = async function (ages, hooks) {
      const onStage = typeof hooks?.onStage === 'function' ? hooks.onStage : function () {};
      const wantedAges = [...new Set((Array.isArray(ages) ? ages : []).map((age) => Number(age)).filter(Number.isFinite))].sort((a, b) => a - b);
      if (!wantedAges.length) return { ok: true, generatedRanges: 0, generatedYears: 0 };

      const grouped = new Map();
      wantedAges.forEach((age) => {
        const raw = state.dayunRanges.find((item) => age >= item.start && age <= item.end) || null;
        if (!raw) return;
        const key = `${raw.start}-${raw.end}`;
        if (!grouped.has(key)) grouped.set(key, { raw, ages: [] });
        grouped.get(key).ages.push(age);
      });

      let generatedRanges = 0;
      let generatedYears = 0;
      const groups = [...grouped.values()].sort((a, b) => a.raw.start - b.raw.start);

      for (const group of groups) {
        const raw = group.raw;
        const key = `${raw.start}-${raw.end}`;
        const fullRangeAges = [];
        for (let age = Number(raw.start); age <= Number(raw.end); age++) fullRangeAges.push(age);
        const missingAges = group.ages.filter((age) => !state.yearResultMap[String(age)]);
        const needDayun = !state.dayunResultMap[key];

        if (!needDayun && !missingAges.length) continue;

        const needsWholeRange = group.ages.length === fullRangeAges.length && missingAges.length === fullRangeAges.length;
        onStage(`正在评分 ${raw.start}-${raw.end}岁`);

        if (needsWholeRange) {
          await runRangeFullAI(key);
          generatedRanges += 1;
          generatedYears += fullRangeAges.length;
          continue;
        }

        if (needDayun) {
          await runDayunAI(key);
          generatedRanges += 1;
        }
        for (const age of missingAges) {
          onStage(`正在评分 ${age}岁`);
          await loadYearForRange(age, raw);
          generatedYears += 1;
        }
      }

      exposeLifeCurveSignals();
      return { ok: true, generatedRanges, generatedYears };
    };
    if (typeof window._fcSyncLifeCurveFromLuckScores === 'function') {
      window._fcSyncLifeCurveFromLuckScores();
    }
  }

  function getStatusMeta(status, card) {
    switch (status) {
      case 'loading':
        return { badge: '生成中', badgeClass: 'dlx-badge-loading', btnState: 'state-loading', btnLabel: '⟳ 批命中…', text: '正在调用 AI 批这10年…' };
      case 'generated':
        return { badge: '已生成', badgeClass: 'dlx-badge-done', btnState: 'state-done', btnLabel: '✓ 已批命', text: card?.summary ? '批命结果已生成，点此刷新。' : '已生成。' };
      case 'cached':
        return { badge: '已生成', badgeClass: 'dlx-badge-done', btnState: 'state-done', btnLabel: '✓ 已批命', text: card?.summary ? '已读取缓存，点此重新生成。' : '已读取缓存。' };
      case 'error':
        return { badge: '失败', badgeClass: 'dlx-badge-error', btnState: 'state-error', btnLabel: '✕ 重试', text: '生成失败，请稍后重试。' };
      default:
        return { badge: '待批命', badgeClass: 'dlx-badge-empty', btnState: 'state-idle', btnLabel: '✦ 批命这10年', text: '点按钮让 AI 批命这10年。' };
    }
  }

  function formatStarBadgesHtml(stars) {
    const BRIGHTNESS_CLASS = { '庙': '庙', '旺': '旺', '得': '得', '利': '利', '平': '平', '不': '不', '陷': '陷' };
    const list = Array.isArray(stars) ? stars : [];
    if (!list.length) return '<span class="dlx-overview-value">空宫</span>';
    return list.map(s => {
      if (!s || !s.name) return '';
      const cls = BRIGHTNESS_CLASS[s.brightness] ? `dlx-star-${s.brightness}` : 'dlx-star-default';
      const label = s.brightness ? `${s.name}${s.brightness}` : s.name;
      return `<span class="dlx-star-badge ${cls}">${escapeHtml(label)}</span>`;
    }).filter(Boolean).join('');
  }

  function getEraClass(dayun) {
    const activeAge = Number(window._fcActiveAge || 0);
    if (!activeAge) return '';
    if (dayun.end < activeAge) return 'era-past';
    if (dayun.start > activeAge) return 'era-future';
    return 'era-current';
  }

  function getRangeKey(dayun) {
    return dayun ? `${dayun.start}-${dayun.end}` : '';
  }

  function getCurrentDayunIndex() {
    const activeAge = Number(window._fcActiveAge || 0);
    const index = state.dayunRanges.findIndex((item) => activeAge >= item.start && activeAge <= item.end);
    return index >= 0 ? index : getSelectedDayunIndex();
  }

  function getFocusDayunList() {
    const currentIndex = getCurrentDayunIndex();
    const focus = [
      { index: currentIndex - 1, label: '过去10年', tone: 'past' },
      { index: currentIndex, label: '现行10年大运', tone: 'current' },
      { index: currentIndex + 1, label: '未来10年', tone: 'future' },
    ].filter((item) => state.dayunRanges[item.index]);

    if (!state.showAllDayun) {
      return focus.map((item) => ({ ...item, dayun: state.dayunRanges[item.index], isFocus: true }));
    }

    const focusIndexes = new Set(focus.map((item) => item.index));
    const rest = state.dayunRanges
      .map((dayun, index) => ({ index, dayun, label: `第${index + 1}大运`, tone: 'normal', isFocus: false }))
      .filter((item) => !focusIndexes.has(item.index));
    return [
      ...focus.map((item) => ({ ...item, dayun: state.dayunRanges[item.index], isFocus: true })),
      ...rest,
    ];
  }

  function isRangeExpanded(dayun) {
    const key = getRangeKey(dayun);
    if (Object.prototype.hasOwnProperty.call(state.expandedRangeMap, key)) {
      return !!state.expandedRangeMap[key];
    }
    return getEraClass(dayun) === 'era-current';
  }

  function updateOverviewHead() {
    const card = document.getElementById('dlx-overview-card');
    if (!card) return;
    card.style.display = '';
    const tag = card.querySelector('.aip-tag');
    const title = card.querySelector('.aip-card-title');
    if (tag) tag.textContent = '三段大运';
    if (title) title.textContent = '过去10年 / 现行10年 / 未来10年';
    const batchCard = document.getElementById('dlx-batch-card');
    const bottomBatchCard = document.getElementById('dlx-bottom-batch-card');
    const decadeSection = document.getElementById('dlx-decade-pills')?.closest('.dlx-section');
    const yearSection = document.getElementById('dlx-year-section');
    const daxianCard = document.getElementById('dlx-daxian-card');
    if (batchCard) batchCard.style.display = 'none';
    if (bottomBatchCard) bottomBatchCard.style.display = 'none';
    if (decadeSection) decadeSection.style.display = 'none';
    if (yearSection) yearSection.style.display = 'none';
    if (daxianCard) daxianCard.style.display = 'none';
  }

  function getSelectedDayunIndex() {
    return Math.max(0, state.dayunRanges.findIndex((item) => `${item.start}-${item.end}` === state.selectedDayunKey));
  }

  function renderDayunNavigator(currentIndex) {
    const total = state.dayunRanges.length;
    const current = state.dayunRanges[currentIndex] || null;
    const currentLabel = current ? `${current.start}-${current.end}岁` : '—';
    return [
      '<div class="dlx-nav">',
        `<button type="button" class="dlx-nav-btn" data-dlx-nav="prev"${currentIndex <= 0 ? ' disabled' : ''}>上一运</button>`,
        '<div class="dlx-nav-mid">',
          `<div class="dlx-nav-title">${escapeHtml(currentLabel)}</div>`,
          `<div class="dlx-nav-sub">第 ${currentIndex + 1} / ${total} 组大运</div>`,
        '</div>',
        `<button type="button" class="dlx-nav-btn" data-dlx-nav="next"${currentIndex >= total - 1 ? ' disabled' : ''}>下一运</button>`,
      '</div>',
    ].join('');
  }

  function getYearCard(age) {
    return state.yearResultMap[String(Number(age))] || null;
  }

  function getGeneratedYearCount(dayun) {
    if (!dayun) return 0;
    let count = 0;
    for (let age = Number(dayun.start); age <= Number(dayun.end); age++) {
      if (getYearCard(age)) count += 1;
    }
    return count;
  }

  function isRangeComplete(dayun) {
    const key = getRangeKey(dayun);
    return !!(state.dayunResultMap[key] || state.dayunOverviewMap[key]?.card) && getGeneratedYearCount(dayun) >= 10;
  }

  function toTrendNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? Math.round(num * 10) / 10 : 0;
  }

  function buildSmoothTrendPath(points) {
    if (!points.length) return '';
    const parts = [`M ${toTrendNumber(points[0].x)} ${toTrendNumber(points[0].y)}`];
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      parts.push(
        `C ${toTrendNumber(midX)} ${toTrendNumber(current.y)}, ` +
        `${toTrendNumber(midX)} ${toTrendNumber(next.y)}, ` +
        `${toTrendNumber(next.x)} ${toTrendNumber(next.y)}`
      );
    }
    return parts.join(' ');
  }

  function renderInlineYearTrendHtml(dayun) {
    const fallbackScores = [62, 68, 76, 82, 74, 70, 78, 84, 72, 66];
    const scores = [];
    let index = 0;

    for (let age = Number(dayun.start); age <= Number(dayun.end); age++) {
      const card = getYearCard(age);
      const score = getCardScore(card);
      scores.push(Number.isFinite(Number(score)) ? Number(score) : fallbackScores[index] || 72);
      index += 1;
    }

    const avg = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 72;
    const peak = scores.length ? Math.max(...scores) : 78;
    const drift = Math.max(-10, Math.min(10, (72 - avg) * 0.6));
    const lift = Math.max(-8, Math.min(18, (peak - 76) * 0.75));
    const points = [
      { x: -26, y: 70 + drift },
      { x: 105, y: 62 + drift },
      { x: 235, y: 42 - lift },
      { x: 360, y: 64 + drift },
      { x: 505, y: 76 + drift },
      { x: 645, y: 50 - lift },
      { x: 790, y: 46 - lift },
      { x: 925, y: 61 + drift },
      { x: 1026, y: 70 + drift },
    ];
    const d = buildSmoothTrendPath(points);
    const dots = [points[1], points[3], points[5], points[7]].map((point) => (
      `<circle class="dlx-inline-year-trend-dot" cx="${toTrendNumber(point.x)}" cy="${toTrendNumber(point.y)}" r="3.4"></circle>`
    )).join('');

    return (
      `<svg class="dlx-inline-year-trend" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">` +
        `<path class="dlx-inline-year-trend-glow" d="${d}"></path>` +
        `<path class="dlx-inline-year-trend-line" d="${d}"></path>` +
        `<g class="dlx-inline-year-trend-dots">${dots}</g>` +
      `</svg>`
    );
  }

function renderInlineYearsHtml(dayun, expanded) {
    if (!expanded) return '';
    const years = [];
    for (let age = Number(dayun.start); age <= Number(dayun.end); age++) {
      const card = getYearCard(age);
      const selected = Number(state.selectedYearAge) === age;
      const loading = state.yearStatusMap[String(age)] === 'loading';
      const year = getSolarYear(age);
      const brief = getCardBrief(card);
      years.push(
        `<div class="dlx-inline-year${selected ? ' active' : ''}${card ? ' done' : ''}${loading ? ' loading' : ''}" data-year-age="${age}">` +
          `<button type="button" class="dlx-inline-year-select" data-year-age="${age}">` +
            `<span class="dlx-inline-year-top"><span class="dlx-inline-year-age">${age}岁</span><span class="dlx-inline-year-sub">${year ? `${year}年` : '小流年'}</span></span>` +
            renderYearStatePillHtml(card, loading) +
            `<span class="dlx-inline-year-preview">${escapeHtml(brief ? `${brief.slice(0, 32)}${brief.length > 32 ? '…' : ''}` : '等待批命')}</span>` +
          `</button>` +
          `<button type="button" class="dlx-inline-year-ai-btn" data-year-age="${age}" data-range-key="${escapeHtml(getRangeKey(dayun))}"${loading ? ' disabled' : ''}>${card ? '查看' : '批这一年'}</button>` +
        `</div>`
      );
    }
    return `<div class="dlx-inline-years">${renderInlineYearTrendHtml(dayun)}${years.join('')}</div>`;
  }

function renderInlineYearDetailHtml(dayun, expanded) {
    if (!expanded) return '';
    const age = Number(state.selectedYearAge);
    if (!Number.isFinite(age) || age < Number(dayun.start) || age > Number(dayun.end)) return '';
    const card = getYearCard(age);
    if (!card) return '';
    const year = getSolarYear(age);
    const riskHtml = card?.risk ? `<div class="dlx-overview-risk">提醒：${escapeHtml(card.risk)}</div>` : '';
    return (
      `<div class="dlx-inline-year-detail">` +
        `<div class="dlx-inline-year-detail-head">` +
          `<span>单年批命详情 · ${age}岁${year ? ` / ${year}年` : ''}</span>` +
          renderYearStatePillHtml(card, false) +
        `</div>` +
        `${renderScoreDetailHtml(card)}` +
        `<div class="aip-card-body dlx-overview-summary">${renderSectionsHtml(card)}</div>` +
        `${riskHtml}` +
      `</div>`
    );
  }

function renderDayunGroupCard(item) {
    const dayun = item.dayun;
    const index = item.index;
    const key = getRangeKey(dayun);
    const selected = key === state.selectedDayunKey;
    const expanded = isRangeExpanded(dayun);
    const card = state.dayunResultMap[key] || state.dayunOverviewMap[key]?.card || null;
    const status = state.dayunStatusMap[key] || state.dayunOverviewMap[key]?.status || (card ? 'cached' : 'empty');
    const statusMeta = getStatusMeta(status, card);
    const eraClass = getEraClass(dayun);
    const palace = dayun.palace || {};
    const generatedYears = getGeneratedYearCount(dayun);
    const rangeLoading = state.rangeBatchMap[key] === 'loading';
    const complete = isRangeComplete(dayun);
    const summaryLine = getCardSummaryLine(card, '先批这一整段十年，再逐年展开。');
    const riskHtml = card?.risk ? `<div class="dlx-overview-risk">提醒：${escapeHtml(card.risk)}</div>` : '';
    const detailHtml = card
      ? (
        `<details class="dlx-decade-detail">` +
          `<summary>查看完整十年批命</summary>` +
          `<div class="aip-card-body dlx-overview-summary">${renderSectionsHtml(card)}</div>` +
        `</details>`
      )
      : '';
    const visibleState = getVisibleScoreState(card, false);

    return (
      `<article class="dlx-overview-item dlx-dayun-card dlx-focus-card dlx-focus-${escapeHtml(item.tone || 'normal')}${selected ? ' active' : ''}${eraClass ? ' ' + eraClass : ''}${status === 'loading' || rangeLoading ? ' is-loading' : ''}${!card ? ' is-empty' : ''}" data-range-key="${escapeHtml(key)}">` +
        `<div class="dlx-spotlight-top">` +
          `<div class="dlx-spotlight-main">` +
            `<div class="dlx-focus-label">${escapeHtml(item.label || `第${index + 1}大运`)}</div>` +
            `<div class="dlx-overview-head">` +
              `<div class="dlx-title-group">` +
                `<div class="dlx-decade-num">第${index + 1}大运</div>` +
                `<div class="dlx-overview-title">${escapeHtml(`${dayun.start}-${dayun.end}岁`)}</div>` +
              `</div>` +
              `<span class="dlx-overview-badge ${statusMeta.badgeClass}">${escapeHtml(statusMeta.badge)}</span>` +
            `</div>` +
            `<div class="dlx-spotlight-meta">${renderDecadeMetaChips(dayun)}<span class="dlx-meta-chip">${generatedYears}/10 流年</span></div>` +
            `<div class="dlx-spotlight-copy">${escapeHtml(summaryLine || '等待批命')}</div>` +
          `</div>` +
          `<div class="dlx-spotlight-score-box">` +
            `<span>整体状态</span>` +
            `<strong class="${visibleState.className}">${escapeHtml(visibleState.text)}</strong>` +
            `<em>${card ? '真实评分已完成计算' : '先看总运，再看年份'}</em>` +
            `<b>${escapeHtml(getCardShortReason(card, '先看总运，再看年份。'))}</b>` +
          `</div>` +
        `</div>` +
        `<div class="dlx-stars-line"><span class="dlx-overview-label">主星</span><div class="dlx-stars-wrap">${formatStarBadgesHtml(palace?.majorStars || [])}</div></div>` +
        `<div class="dlx-overview-actions">` +
          `<button class="dlx-dayun-ai-btn ${statusMeta.btnState}" data-ai-range-key="${escapeHtml(key)}"${status === 'loading' ? ' disabled' : ''}>${escapeHtml(statusMeta.btnLabel)}</button>` +
          `<button class="dlx-range-batch-btn" data-batch-range-key="${escapeHtml(key)}"${rangeLoading ? ' disabled' : ''}>${rangeLoading ? '批完整组中…' : (complete ? '✓ 已批完整组' : '✦ 一键批完这10年')}</button>` +
          `<button class="dlx-decade-toggle-btn" data-toggle-range-key="${escapeHtml(key)}">${expanded ? '收起小流年' : '展开小流年'}</button>` +
          `<span class="dlx-overview-status">${rangeLoading ? '正在按十年大运 + 10个小流年逐个批命…' : (card ? escapeHtml(statusMeta.text) : '先批十年总运，再看单年变化')}</span>` +
        `</div>` +
        `${card ? renderScoreDetailHtml(card) : ''}` +
        `${detailHtml}` +
        `${riskHtml}` +
        renderInlineYearsHtml(dayun, expanded) +
        renderInlineYearDetailHtml(dayun, expanded) +
      `</article>`
    );
  }

function renderOverviewList() {
    updateOverviewHead();
    const listEl = document.getElementById('dlx-overview-list');
    if (!listEl) return;

    if (!state.dayunRanges.length) {
      listEl.innerHTML = '<div class="dlx-overview-item"><div class="dlx-overview-summary">请先完成排盘。</div></div>';
      return;
    }

    const activeAge = Number(window._fcActiveAge || 0);
    const groups = getFocusDayunList();
    const focusGroups = groups.filter((item) => item.isFocus);
    const selectedRaw = getSelectedDayunRaw() || state.dayunRanges[getCurrentDayunIndex()] || state.dayunRanges[0];
    const selectedKey = getRangeKey(selectedRaw);
    const selectedIndex = state.dayunRanges.findIndex((item) => getRangeKey(item) === selectedKey);
    const selectedItem = groups.find((item) => getRangeKey(item.dayun) === selectedKey) || {
      index: selectedIndex >= 0 ? selectedIndex : 0,
      dayun: selectedRaw,
      label: `第${(selectedIndex >= 0 ? selectedIndex : 0) + 1}大运`,
      tone: selectedIndex < getCurrentDayunIndex() ? 'past' : (selectedIndex > getCurrentDayunIndex() ? 'future' : 'current'),
      isFocus: false,
    };
    const restGroups = groups.filter((item) => !item.isFocus);
    listEl.innerHTML = [
      renderTimelineHeroHtml(focusGroups, selectedItem, activeAge),
      renderDayunGroupCard(selectedItem),
      state.showAllDayun ? renderRestDayunRail(restGroups, selectedKey) : '',
      renderTestScorePanelHtml(),
    ].join('');
  }

  function renderTestScorePanelHtml() {
    const items = [];
    let readyCount = 0;
    for (let age = 1; age <= 100; age += 1) {
      const card = state.yearResultMap[String(age)] || null;
      const score = getCardScore(card);
      const chipClass = score == null ? 'pending' : scoreClass(score);
      const year = getSolarYear(age);
      if (score != null) readyCount += 1;
      items.push(
        `<div class="dlx-test-score-chip ${chipClass}">` +
          `<span class="dlx-test-score-age">${age}岁</span>` +
          `<span class="dlx-test-score-year">${year || '—'}</span>` +
          `<strong>${score == null ? '待批' : `${score}分`}</strong>` +
        `</div>`
      );
    }
    return (
      `<section class="dlx-test-score-card">` +
        `<div class="dlx-test-score-head">` +
          `<div>` +
            `<div class="dlx-test-score-kicker">测试评分</div>` +
            `<div class="dlx-test-score-title">1-100岁真实评分</div>` +
            `<div class="dlx-test-score-copy">这里只在测试期显示，读取第二板块真实 AI 评分，不额外造分。</div>` +
          `</div>` +
          `<div class="dlx-test-score-meta">已出分 ${readyCount}/100</div>` +
        `</div>` +
        `<div class="dlx-test-score-grid">${items.join('')}</div>` +
      `</section>`
    );
  }

  function selectDayunByOffset(offset) {
    if (!state.dayunRanges.length) return;
    const currentIndex = getSelectedDayunIndex();
    const nextIndex = Math.max(0, Math.min(state.dayunRanges.length - 1, currentIndex + offset));
    const raw = state.dayunRanges[nextIndex];
    if (!raw) return;
    if (typeof window._dlxSelectDecade === 'function') {
      window._dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
    }
  }

  function bindOverviewActions() {
    const listEl = document.getElementById('dlx-overview-list');
    if (!listEl) return;

    listEl.querySelectorAll('[data-dlx-show-all]').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        state.showAllDayun = !state.showAllDayun;
        renderOverviewList();
        bindOverviewActions();
      });
    });

    listEl.querySelectorAll('[data-dlx-nav]').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        selectDayunByOffset(btn.dataset.dlxNav === 'prev' ? -1 : 1);
      });
    });

    listEl.querySelectorAll('.dlx-dayun-card').forEach((cardEl) => {
      if (cardEl.dataset.bound === '1') return;
      cardEl.dataset.bound = '1';
      cardEl.addEventListener('click', function (event) {
        if (event.target?.closest('button')) return;
        const rangeKey = cardEl.dataset.rangeKey || '';
        const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
        if (!raw) return;
        if (typeof window._dlxSelectDecade === 'function') {
          window._dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
        }
      });
    });

    listEl.querySelectorAll('.dlx-timeline-node, .dlx-rail-card').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const rangeKey = btn.dataset.rangeKey || '';
        const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
        if (!raw) return;
        if (typeof window._dlxSelectDecade === 'function') {
          window._dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
        }
      });
    });

    listEl.querySelectorAll('.dlx-dayun-ai-btn').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const rangeKey = btn.dataset.aiRangeKey || '';
        runDayunAI(rangeKey);
      });
    });

    listEl.querySelectorAll('.dlx-range-batch-btn').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        runRangeFullAI(btn.dataset.batchRangeKey || '');
      });
    });

    listEl.querySelectorAll('.dlx-decade-toggle-btn').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const key = btn.dataset.toggleRangeKey || '';
        const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === key);
        state.expandedRangeMap[key] = !isRangeExpanded(raw);
        renderOverviewList();
        bindOverviewActions();
      });
    });

    listEl.querySelectorAll('.dlx-inline-year-select').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        selectInlineYear(Number(btn.dataset.yearAge));
      });
    });

    listEl.querySelectorAll('.dlx-inline-year-ai-btn').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === (btn.dataset.rangeKey || ''));
        loadYearForRange(Number(btn.dataset.yearAge), raw);
      });
    });
  }

  function renderYearInfo(age) {
    const numericAge = Number(age);
    const palace = getXiaolianPalace(numericAge);
    const year = getSolarYear(numericAge);
    const infoEl = document.getElementById('dlx-ln-info');
    const cardEl = document.getElementById('dlx-liunian-card');
    if (!infoEl || !cardEl) return;
    const card = state.yearResultMap[String(numericAge)] || null;

    setText('dlx-ln-ttl', `${year || '—'}年 · 虚岁${numericAge}岁`);
    infoEl.innerHTML = [
      `<div class="dlx-info-row"><span class="dlx-info-label">主星</span><span class="dlx-info-val">${escapeHtml(formatStarList(palace?.majorStars || [], true))}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">辅星</span><span class="dlx-info-val">${escapeHtml(formatStarList(palace?.minorStars || [], false))}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">落宫</span><span class="dlx-info-val">${escapeHtml(palace?.name || '—')}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">杂曜</span><span class="dlx-info-val">${escapeHtml(formatAdjStarList(palace?.adjectiveStars || []))}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">批命状态</span><span class="dlx-info-val">${renderScorePillHtml(card, '待批命')}</span></div>`,
    ].join('');
    cardEl.style.display = '';
  }

  function renderYearResult(age) {
    const card = state.yearResultMap[String(age)] || null;
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    if (!bodyEl) return;
    bodyEl.innerHTML = card ? (renderScoreDetailHtml(card) + renderSectionsHtml(card)) : '';
    renderYearInfo(age);
    setText('dlx-ln-risk', card?.risk ? `提醒：${card.risk}` : '');
  }

  function updateYearAction(age) {
    const btn = document.getElementById('dlx-year-ai-btn');
    const cached = state.yearResultMap[String(age)] || null;
    if (btn) {
      btn.disabled = !age;
      btn.textContent = cached ? '✓ 已批这一年' : '✦ 批这一年';
    }
    setText('dlx-ln-ai-status', cached ? '已读取缓存' : '点按钮批这一年');
  }

  async function loadDayunOverview(generateMissing) {
    const chartData = getChartPayload();
    const dayunRanges = state.dayunRanges.map(serializeDayun).filter(Boolean);
    if (!chartData || !dayunRanges.length) return;

    try {
      const resp = await fetch(_aipJoin('/api/ai/dayun/batch'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartRecordId: getChartRecordId(),
          chartData,
          dayunRanges,
          generateMissing: !!generateMissing,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !(data.ok || data.success)) throw new Error(data.error || '大运读取失败');

      const overview = Array.isArray(data.overview) ? data.overview : [];
      state.dayunOverviewMap = {};
      overview.forEach((item) => {
        if (!item?.rangeKey) return;
        state.dayunOverviewMap[item.rangeKey] = item;
        if (item.card) state.dayunResultMap[item.rangeKey] = item.card;
        if (!state.dayunStatusMap[item.rangeKey] || item.status !== 'empty') {
          state.dayunStatusMap[item.rangeKey] = item.status || (item.card ? 'cached' : 'empty');
        }
      });
      exposeLifeCurveSignals();
      renderOverviewList();
      bindOverviewActions();
      const hasCachedOverview = overview.some((item) => item?.card && item.status !== 'empty');
      setText(
        'dlx-batch-all-status',
        data.meta?.generated ? '整组大运已批完' : (hasCachedOverview ? '已读取已有大运缓存' : '')
      );
    } catch (_err) {
      setText('dlx-batch-all-status', generateMissing ? '整组大运读取失败' : '');
      renderOverviewList();
      bindOverviewActions();
    }
  }

  async function runAllDayunAI() {
    const btn = document.getElementById('dlx-batch-all-btn');
    if (!state.dayunRanges.length) {
      setText('dlx-batch-all-status', '请先完成排盘');
      return;
    }

    if (btn) btn.disabled = true;
    state.dayunRanges.forEach((item) => {
      const key = `${item.start}-${item.end}`;
      if (!state.dayunResultMap[key]) state.dayunStatusMap[key] = 'loading';
    });
    setText('dlx-batch-all-status', '正在逐个批完整组大运…');
    renderOverviewList();
    bindOverviewActions();

    try {
      await loadDayunOverview(true);
      setText('dlx-batch-all-status', '整组大运已完成');
      notifyDone('AI\u6574\u7ec4\u5927\u8fd0', '\u6574\u7ec4\u5927\u8fd0\u5df2\u6279\u5b8c\u3002', 'yuetian-dayun-batch');
      if (typeof window._chatInvalidateMemoryA === 'function') window._chatInvalidateMemoryA();
    } catch (err) {
      notifyFailed('AI\u6574\u7ec4\u5927\u8fd0', err, 'yuetian-dayun-batch-error');
    } finally {
      if (btn) btn.disabled = false;
      renderOverviewList();
      bindOverviewActions();
    }
  }

  async function runDayunAI(rangeKey) {
    const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
    if (!raw) return;

    if (typeof window._dlxSelectDecade === 'function') {
      window._dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
    }

    state.dayunStatusMap[rangeKey] = 'loading';
    renderOverviewList();
    bindOverviewActions();

    try {
      const data = await _aipCallBackend('dayun_item', {
        selectedDayun: serializeDayun(raw),
      });
      state.dayunResultMap[rangeKey] = data.card || {};
      state.dayunOverviewMap[rangeKey] = {
        ...(state.dayunOverviewMap[rangeKey] || {}),
        rangeKey,
        rangeLabel: `${raw.start}-${raw.end}岁`,
        status: 'generated',
        card: data.card || {},
      };
      state.dayunStatusMap[rangeKey] = data.meta?.cacheHit ? 'cached' : 'generated';
      exposeLifeCurveSignals();
      renderOverviewList();
      bindOverviewActions();
      notifyDone('AI\u5355\u4e2a\u5927\u8fd0', '\u8fd9\u6bb5\u5927\u8fd0\u5df2\u6279\u5b8c\u3002', 'yuetian-dayun-item');
      // 大运批命完成后通知 AI半仙 命盘总档需要刷新
      if (!data.meta?.cacheHit && typeof window._chatInvalidateMemoryA === 'function') {
        window._chatInvalidateMemoryA();
      }
    } catch (_err) {
      state.dayunStatusMap[rangeKey] = 'error';
      notifyFailed('AI\u5355\u4e2a\u5927\u8fd0', _err, 'yuetian-dayun-item-error');
      renderOverviewList();
      bindOverviewActions();
    }
  }

  function selectInlineYear(age) {
    const numericAge = Number(age);
    const raw = state.dayunRanges.find((item) => numericAge >= item.start && numericAge <= item.end) || getSelectedDayunRaw();
    if (raw) {
      const key = getRangeKey(raw);
      state.selectedDayunKey = key;
      state.expandedRangeMap[key] = true;
      if (typeof window._dlxSelectDecade === 'function') {
        window._dlxSelectDecade(raw, state.dayunRanges, { source: 'inline-year' });
      }
    }
    state.selectedYearAge = numericAge;
    if (typeof window._dlxSelectYear === 'function') {
      window._dlxSelectYear(numericAge, { source: 'inline-year' });
    } else {
      renderYearResult(numericAge);
      updateYearAction(numericAge);
    }
    renderOverviewList();
    bindOverviewActions();
  }

  async function loadYearForRange(age, rawDayun) {
    const chartData = getChartPayload();
    const numericAge = Number(age);
    const raw = rawDayun || state.dayunRanges.find((item) => numericAge >= item.start && numericAge <= item.end) || getSelectedDayunRaw();
    const selectedDayun = serializeDayun(raw);
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    if (!chartData || !selectedDayun || !Number.isFinite(numericAge)) return;

    state.selectedDayunKey = getRangeKey(raw);
    state.selectedYearAge = numericAge;

    if (state.yearResultMap[String(numericAge)]) {
      setText('dlx-ln-ai-status', '已读取缓存');
      renderYearResult(numericAge);
      updateYearAction(numericAge);
      renderOverviewList();
      bindOverviewActions();
      return;
    }

    const actionBtn = document.getElementById('dlx-year-ai-btn');
    if (actionBtn) actionBtn.disabled = true;
    state.yearStatusMap[String(numericAge)] = 'loading';
    setText('dlx-ln-ai-status', '正在批这一年…');
    if (bodyEl) bodyEl.innerHTML = '<p class="aip-body-para">AI 正在结合大运与流年生成结果…</p>';
    renderOverviewList();
    bindOverviewActions();

    try {
      const data = await _aipCallBackend('liunian_year', {
        selectedDayun,
        selectedYear: serializeYear(numericAge, selectedDayun),
      });
      state.yearResultMap[String(numericAge)] = data.card || {};
      state.yearStatusMap[String(numericAge)] = data.meta?.cacheHit ? 'cached' : 'generated';
      exposeLifeCurveSignals();
      setText('dlx-ln-ai-status', `已完成 · ${_fmtDuration(data.meta?.durationMs || 0)}`);
      renderYearResult(numericAge);
      updateYearAction(numericAge);
      renderOverviewList();
      bindOverviewActions();
      notifyDone('AI\u6d41\u5e74', '\u8fd9\u4e00\u5e74\u5df2\u6279\u5b8c\u3002', 'yuetian-liunian-year');
    } catch (err) {
      state.yearStatusMap[String(numericAge)] = 'error';
      setText('dlx-ln-ai-status', err?.message || '流年批命失败');
      if (bodyEl) bodyEl.innerHTML = '';
      setText('dlx-ln-risk', '');
      notifyFailed('AI\u6d41\u5e74', err, 'yuetian-liunian-year-error');
    } finally {
      if (actionBtn) actionBtn.disabled = false;
      renderOverviewList();
      bindOverviewActions();
    }
  }

  async function loadSelectedYear(age) {
    return loadYearForRange(age, getSelectedDayunRaw());
  }

  async function runRangeFullAI(rangeKey) {
    const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
    if (!raw || state.rangeBatchMap[rangeKey] === 'loading') return;

    state.selectedDayunKey = rangeKey;
    state.expandedRangeMap[rangeKey] = true;
    state.rangeBatchMap[rangeKey] = 'loading';
    renderOverviewList();
    bindOverviewActions();

    try {
      await runDayunAI(rangeKey);
      for (let age = Number(raw.start); age <= Number(raw.end); age++) {
        await loadYearForRange(age, raw);
      }
      state.rangeBatchMap[rangeKey] = 'generated';
      notifyDone('AI\u5341\u5e74\u6d41\u5e74', '\u8fd9\u7ec4\u5927\u8fd0\u4e0e10\u4e2a\u5c0f\u6d41\u5e74\u5df2\u6279\u5b8c\u3002', 'yuetian-dayun-years');
    } catch (err) {
      state.rangeBatchMap[rangeKey] = 'error';
      notifyFailed('AI\u5341\u5e74\u6d41\u5e74', err, 'yuetian-dayun-years-error');
    } finally {
      if (state.rangeBatchMap[rangeKey] === 'loading') state.rangeBatchMap[rangeKey] = '';
      renderOverviewList();
      bindOverviewActions();
    }
  }

  window._aipDlxOnDecadeSelected = function (dayun, decades) {
    state.dayunRanges = Array.isArray(decades) ? decades : state.dayunRanges;
    state.selectedDayunKey = dayun ? `${dayun.start}-${dayun.end}` : state.selectedDayunKey;
    syncCurrentYears();
    renderOverviewList();
    bindOverviewActions();
  };

  window._aipDlxOnYearSelected = function (age, options) {
    state.selectedYearAge = Number(age);
    renderYearInfo(age);
    setText('dlx-ln-risk', '');
    renderYearResult(age);
    updateYearAction(age);
  };

  window._aipDlxRefresh = function () {
    updateOverviewHead();
    state.dayunRanges = typeof _fcGetDisplayDecades === 'function' ? _fcGetDisplayDecades() : [];

    if (!state.selectedDayunKey) {
      const current = typeof _dlxSelectedDecade !== 'undefined' && _dlxSelectedDecade
        ? _dlxSelectedDecade
        : (state.dayunRanges.find((item) => Number(window._fcActiveAge || 0) >= item.start && Number(window._fcActiveAge || 0) <= item.end) || state.dayunRanges[0] || null);
      if (current) state.selectedDayunKey = `${current.start}-${current.end}`;
    }

    syncCurrentYears();
    exposeLifeCurveSignals();
    renderOverviewList();
    bindOverviewActions();
    loadDayunOverview(false);
  };

  function bind() {
    updateOverviewHead();
    const yearBtn = document.getElementById('dlx-year-ai-btn');
    if (yearBtn && yearBtn.dataset.bound !== '1') {
      yearBtn.dataset.bound = '1';
      yearBtn.addEventListener('click', function () {
        if (!state.selectedYearAge) {
          setText('dlx-ln-ai-status', '请先选择流年');
          return;
        }
        loadSelectedYear(state.selectedYearAge);
      });
    }

    const batchBtn = document.getElementById('dlx-batch-all-btn');
    if (batchBtn && batchBtn.dataset.bound !== '1') {
      batchBtn.dataset.bound = '1';
      batchBtn.addEventListener('click', runAllDayunAI);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    setTimeout(bind, 0);
  }
}());
