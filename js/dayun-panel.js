(function () {
  const state = {
    dayunRanges: [],
    selectedDayunKey: '',
    dayunOverviewList: [],
    liunianYears: [],
    selectedYearAge: null,
    dayunResultMap: {},
    yearResultMap: {},
  };

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
      .replace(/>/g, '&gt;');
  }

  function getDecadeMutagens(palace) {
    const result = [];
    [...(palace?.majorStars || []), ...(palace?.minorStars || [])].forEach((star) => {
      if (star?.mutagen) result.push({ star: star.name, type: star.mutagen });
    });
    return result;
  }

  function serializeDayun(dayun) {
    if (!dayun) return null;
    const palace = dayun.palace || null;
    return {
      rangeKey: `${dayun.start}-${dayun.end}`,
      rangeLabel: `${dayun.start}-${dayun.end}`,
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
    };
  }

  function serializeYear(age, selectedDayun) {
    const liunian = (window._liunianSeq || {})[age] || null;
    const yearGanzhi = liunian?.yearGanzhi
      ? `${liunian.yearGanzhi.stem || ''}${liunian.yearGanzhi.branch || ''}`
      : '';
    let xiaolianPalace = '';
    if (typeof _fcResolveDisplayedXiaoLianBranch === 'function') {
      const branch = _fcResolveDisplayedXiaoLianBranch(age);
      const palace = (window._chart?.palaces || []).find((item) => item.earthlyBranch === branch);
      xiaolianPalace = palace?.name || branch || '';
    }
    return {
      rangeKey: selectedDayun?.rangeKey || '',
      age: Number(age),
      solarYear: typeof _fcAgeToYear === 'function' ? Number(_fcAgeToYear(age)) : 0,
      yearGanzhi,
      xiaolianPalace,
      liunianGua: liunian ? { name: liunian.name || '', period: liunian.period || '' } : null,
    };
  }

  function getSelectedDayun() {
    return serializeDayun(window._dlxSelectedDecade);
  }

  function exposeLifeCurveSignals() {
    window._dayunAiResultMap = state.dayunResultMap;
    window._liunianAiResultMap = state.yearResultMap;
    window._fcGetLuckAiSignalForAge = function (age) {
      const numericAge = Number(age);
      const rawDayun = state.dayunRanges.find((item) => numericAge >= item.start && numericAge <= item.end) || null;
      const dayunKey = rawDayun ? `${rawDayun.start}-${rawDayun.end}` : '';
      return {
        age: numericAge,
        dayunKey,
        dayunCard: dayunKey ? state.dayunResultMap[dayunKey] || null : null,
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
  }

  function setSections(el, card) {
    if (!el) return;
    el.innerHTML = '';
    const sections = Array.isArray(card?.sections) && card.sections.length
      ? card.sections
      : [{ title: '', content: card?.summary || card?.body || '' }];
    if (typeof _aipRenderSections === 'function') {
      _aipRenderSections(el, sections);
      return;
    }
    el.textContent = sections
      .map((item) => (item.title ? `${item.title}\n${item.content}` : item.content))
      .join('\n\n');
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function renderOverviewList() {
    const cardEl = document.getElementById('dlx-overview-card');
    const listEl = document.getElementById('dlx-overview-list');
    if (!cardEl || !listEl) return;

    if (!state.dayunOverviewList.length) {
      cardEl.style.display = 'none';
      listEl.innerHTML = '';
      return;
    }

    cardEl.style.display = '';
    listEl.innerHTML = state.dayunOverviewList.map((item) => {
      const active = item.rangeKey === state.selectedDayunKey ? ' active' : '';
      const badge = item.status === 'cached'
        ? 'Cached'
        : item.status === 'generated'
          ? 'Ready'
          : 'Pending';
      const safeSummary = escapeHtml(item.summary || 'No AI result yet.').replace(/\n/g, '<br>');
      const risk = item.risk
        ? `<div class="dlx-overview-risk">Risk: ${escapeHtml(item.risk)}</div>`
        : '';

      return (
        `<div class="dlx-overview-item${active}" data-range-key="${escapeHtml(item.rangeKey)}">` +
          `<div class="dlx-overview-head">` +
            `<div class="dlx-overview-title">${escapeHtml(item.rangeLabel)}</div>` +
            `<span class="dlx-overview-badge">${badge}</span>` +
          `</div>` +
          `<div class="dlx-overview-summary">${safeSummary}</div>` +
          `${risk}` +
        `</div>`
      );
    }).join('');
  }

  function renderSelectedDayunResult() {
    const selected = window._dlxSelectedDecade;
    const bodyEl = document.getElementById('dlx-dx-ai-body');
    if (!selected || !bodyEl) return;

    const rangeKey = `${selected.start}-${selected.end}`;
    const card = state.dayunResultMap[rangeKey] || null;
    if (!card) {
      setText('dlx-dx-ai-status', 'Run the batch once to get this dayun result.');
      bodyEl.innerHTML = '<span style="color:#9a8878">No dayun AI result yet.</span>';
      setText('dlx-dx-risk', '');
      return;
    }

    setText('dlx-dx-ai-status', 'Loaded');
    setSections(bodyEl, card);
    setText('dlx-dx-risk', card.risk ? `Risk: ${card.risk}` : '');
  }

  function renderCachedYear(age) {
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    const card = state.yearResultMap[String(age)] || null;
    if (!card || !bodyEl) return;
    setText('dlx-ln-ai-status', 'Loaded');
    setSections(bodyEl, card);
    setText('dlx-ln-risk', card.risk ? `Risk: ${card.risk}` : '');
  }

  function syncCurrentYears() {
    const selected = window._dlxSelectedDecade;
    state.selectedDayunKey = selected ? `${selected.start}-${selected.end}` : '';
    state.liunianYears = selected
      ? Array.from({ length: selected.end - selected.start + 1 }, (_, index) => selected.start + index)
      : [];
  }

  function bindOverviewClicks() {
    const listEl = document.getElementById('dlx-overview-list');
    if (!listEl) return;
    listEl.querySelectorAll('.dlx-overview-item').forEach((itemEl) => {
      itemEl.addEventListener('click', function () {
        const rangeKey = itemEl.dataset.rangeKey || '';
        const target = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
        if (!target) return;
        if (typeof _dlxSelectDecade === 'function') {
          _dlxSelectDecade(target, state.dayunRanges, { source: 'user' });
        }
      });
    });
  }

  async function loadDayunOverview(generateMissing) {
    const chartData = getChartPayload();
    const ranges = state.dayunRanges.map(serializeDayun).filter(Boolean);
    const btn = document.getElementById('dlx-batch-ai-btn');
    if (!chartData || !ranges.length) return;

    if (btn) btn.disabled = !!generateMissing;
    setText('dlx-batch-ai-status', generateMissing ? 'Generating dayun results...' : 'Loading dayun cache...');

    try {
      const resp = await fetch(_aipJoin('/api/ai/dayun/batch'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartRecordId: getChartRecordId(),
          chartData,
          dayunRanges: ranges,
          generateMissing: !!generateMissing,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !(data.ok || data.success)) throw new Error(data.error || 'Dayun batch failed');

      state.dayunOverviewList = Array.isArray(data.overview) ? data.overview : [];
      state.dayunResultMap = {};
      state.dayunOverviewList.forEach((item) => {
        if (item.rangeKey && item.card) state.dayunResultMap[item.rangeKey] = item.card;
      });

      exposeLifeCurveSignals();
      renderOverviewList();
      bindOverviewClicks();
      renderSelectedDayunResult();
      setText(
        'dlx-batch-ai-status',
        generateMissing ? `Done in ${_fmtDuration(data.meta?.durationMs || 0)}` : 'Cache synced'
      );
    } catch (err) {
      setText('dlx-batch-ai-status', err?.message || 'Dayun batch failed');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function loadSelectedYear(age) {
    const chartData = getChartPayload();
    const selectedDayun = getSelectedDayun();
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    if (!chartData || !selectedDayun || !Number.isFinite(Number(age))) return;

    setText('dlx-ln-ai-status', 'Generating liunian...');
    if (bodyEl) bodyEl.innerHTML = '<span style="color:#9a8878">AI is analyzing...</span>';

    try {
      const data = await _aipCallBackend('liunian_year', {
        selectedDayun,
        selectedYear: serializeYear(age, selectedDayun),
      });
      const card = data.card || {};
      state.yearResultMap[String(age)] = card;
      exposeLifeCurveSignals();
      setText('dlx-ln-ai-status', `Done in ${_fmtDuration(data.meta?.durationMs || 0)}`);
      if (bodyEl) setSections(bodyEl, card);
      setText('dlx-ln-risk', card.risk ? `Risk: ${card.risk}` : '');
    } catch (err) {
      setText('dlx-ln-ai-status', err?.message || 'Liunian generation failed');
      if (bodyEl) bodyEl.innerHTML = '';
    }
  }

  function bindBatchButton() {
    const btn = document.getElementById('dlx-batch-ai-btn');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      if (!window._chart) return;
      loadDayunOverview(true);
    });
  }

  window._aipDlxOnDecadeSelected = function (_dayun, decades) {
    state.dayunRanges = Array.isArray(decades) ? decades : state.dayunRanges;
    syncCurrentYears();
    renderOverviewList();
    bindOverviewClicks();
    renderSelectedDayunResult();
  };

  window._aipDlxOnYearSelected = function (age, options) {
    state.selectedYearAge = Number(age);
    if (options?.source === 'user') {
      loadSelectedYear(Number(age));
      return;
    }
    renderCachedYear(age);
  };

  window._aipDlxRefresh = function () {
    state.dayunRanges = typeof _fcGetDisplayDecades === 'function' ? _fcGetDisplayDecades() : [];
    syncCurrentYears();
    exposeLifeCurveSignals();
    renderOverviewList();
    bindOverviewClicks();
    renderSelectedDayunResult();
    loadDayunOverview(false);
  };

  function bind() {
    bindBatchButton();
    bindOverviewClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    setTimeout(bind, 0);
  }
}());
