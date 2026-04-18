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
    const sections = Array.isArray(card?.sections) && card.sections.length
      ? card.sections
      : [{ title: '', content: card?.summary || card?.body || '' }];
    return sections.map((item) => {
      const title = escapeHtml(item?.title || '');
      const content = escapeHtml(item?.content || '').replace(/\n/g, '<br>');
      return `${title ? `<strong class="aip-body-title">${title}</strong>` : ''}<p class="aip-body-para">${content || '—'}</p>`;
    }).join('');
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
  }

  function getStatusMeta(status, card) {
    switch (status) {
      case 'loading':
        return { badge: '生成中', text: '正在调用 AI 批这10年…' };
      case 'generated':
        return { badge: '已生成', text: card?.summary ? '这10年的批命结果已更新。' : '已生成。' };
      case 'cached':
        return { badge: '已缓存', text: card?.summary ? '已读取缓存结果，可直接查看。' : '已读取缓存。' };
      case 'error':
        return { badge: '失败', text: '生成失败，请稍后重试。' };
      default:
        return { badge: '待批命', text: '先看本宫与三方四正，再点按钮批这10年。' };
    }
  }

  function updateOverviewHead() {
    const card = document.getElementById('dlx-overview-card');
    if (!card) return;
    card.style.display = '';
    const tag = card.querySelector('.aip-tag');
    const title = card.querySelector('.aip-card-title');
    if (tag) tag.textContent = '十年大运';
    if (title) title.textContent = '每个十年直接查看与批命';
    const batchCard = document.getElementById('dlx-batch-card');
    const decadeSection = document.getElementById('dlx-decade-pills')?.closest('.dlx-section');
    const daxianCard = document.getElementById('dlx-daxian-card');
    if (batchCard) batchCard.style.display = 'none';
    if (decadeSection) decadeSection.style.display = 'none';
    if (daxianCard) daxianCard.style.display = 'none';
  }

  function renderOverviewList() {
    updateOverviewHead();
    const listEl = document.getElementById('dlx-overview-list');
    if (!listEl) return;

    if (!state.dayunRanges.length) {
      listEl.innerHTML = '<div class="dlx-overview-item"><div class="dlx-overview-summary">请先完成排盘。</div></div>';
      return;
    }

    listEl.innerHTML = state.dayunRanges.map((dayun, index) => {
      const key = `${dayun.start}-${dayun.end}`;
      const selected = key === state.selectedDayunKey;
      const card = state.dayunResultMap[key] || state.dayunOverviewMap[key]?.card || null;
      const status = state.dayunStatusMap[key] || state.dayunOverviewMap[key]?.status || (card ? 'cached' : 'empty');
      const statusMeta = getStatusMeta(status, card);
      const palace = dayun.palace || {};
      const sanfang = getSanfangSizheng(palace?.earthlyBranch || '')
        .map((item) => `${item.role}${item.palaceName}`)
        .join('、') || '—';
      const summaryHtml = card
        ? renderSectionsHtml(card)
        : `<p class="aip-body-para">${escapeHtml(statusMeta.text)}</p>`;
      const riskHtml = card?.risk
        ? `<div class="dlx-overview-risk">提醒：${escapeHtml(card.risk)}</div>`
        : '';

      return (
        `<article class="dlx-overview-item dlx-dayun-card${selected ? ' active' : ''}${status === 'loading' ? ' is-loading' : ''}${!card ? ' is-empty' : ''}" data-range-key="${escapeHtml(key)}">` +
          `<div class="dlx-overview-head">` +
            `<div class="dlx-overview-title">第${index + 1}大运 · ${escapeHtml(`${dayun.start}-${dayun.end}岁`)}</div>` +
            `<span class="dlx-overview-badge">${escapeHtml(statusMeta.badge)}</span>` +
          `</div>` +
          `<div class="dlx-overview-meta">` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">大运宫</span><span class="dlx-overview-value">${escapeHtml(palace?.name || '—')}</span></div>` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">宫干</span><span class="dlx-overview-value">${escapeHtml((palace?.decadal?.heavenlyStem || '') ? `${palace.decadal.heavenlyStem}干` : '—')}</span></div>` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">主星</span><span class="dlx-overview-value">${escapeHtml(formatStarList(palace?.majorStars || [], true))}</span></div>` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">辅星</span><span class="dlx-overview-value">${escapeHtml(formatStarList(palace?.minorStars || [], false))}</span></div>` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">三方四正</span><span class="dlx-overview-value">${escapeHtml(sanfang)}</span></div>` +
            `<div class="dlx-overview-row"><span class="dlx-overview-label">杂曜</span><span class="dlx-overview-value">${escapeHtml(formatAdjStarList(palace?.adjectiveStars || []))}</span></div>` +
          `</div>` +
          `<div class="dlx-overview-actions">` +
            `<button class="aip-card-ai-btn dlx-dayun-ai-btn" data-ai-range-key="${escapeHtml(key)}">✦ 批命这10年</button>` +
            `<span class="dlx-overview-status">${escapeHtml(statusMeta.text)}</span>` +
          `</div>` +
          `<div class="aip-card-body">${summaryHtml}</div>` +
          `${riskHtml}` +
        `</article>`
      );
    }).join('');
  }

  function bindOverviewActions() {
    const listEl = document.getElementById('dlx-overview-list');
    if (!listEl) return;

    listEl.querySelectorAll('.dlx-dayun-card').forEach((cardEl) => {
      if (cardEl.dataset.bound === '1') return;
      cardEl.dataset.bound = '1';
      cardEl.addEventListener('click', function (event) {
        if (event.target?.closest('.dlx-dayun-ai-btn')) return;
        const rangeKey = cardEl.dataset.rangeKey || '';
        const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
        if (!raw) return;
        if (typeof _dlxSelectDecade === 'function') {
          _dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
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
  }

  function renderYearInfo(age) {
    const numericAge = Number(age);
    const palace = getXiaolianPalace(numericAge);
    const year = getSolarYear(numericAge);
    const infoEl = document.getElementById('dlx-ln-info');
    const cardEl = document.getElementById('dlx-liunian-card');
    if (!infoEl || !cardEl) return;

    setText('dlx-ln-ttl', `${year || '—'}年 · 虚岁${numericAge}岁`);
    infoEl.innerHTML = [
      `<div class="dlx-info-row"><span class="dlx-info-label">主星</span><span class="dlx-info-val">${escapeHtml(formatStarList(palace?.majorStars || [], true))}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">辅星</span><span class="dlx-info-val">${escapeHtml(formatStarList(palace?.minorStars || [], false))}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">落宫</span><span class="dlx-info-val">${escapeHtml(palace?.name || '—')}</span></div>`,
      `<div class="dlx-info-row"><span class="dlx-info-label">杂曜</span><span class="dlx-info-val">${escapeHtml(formatAdjStarList(palace?.adjectiveStars || []))}</span></div>`,
    ].join('');
    cardEl.style.display = '';
  }

  function renderYearResult(age) {
    const card = state.yearResultMap[String(age)] || null;
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    if (!bodyEl) return;
    bodyEl.innerHTML = card ? renderSectionsHtml(card) : '';
    setText('dlx-ln-risk', card?.risk ? `提醒：${card.risk}` : '');
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
    } catch (_err) {
      renderOverviewList();
      bindOverviewActions();
    }
  }

  async function runDayunAI(rangeKey) {
    const raw = state.dayunRanges.find((item) => `${item.start}-${item.end}` === rangeKey);
    if (!raw) return;

    if (typeof _dlxSelectDecade === 'function') {
      _dlxSelectDecade(raw, state.dayunRanges, { source: 'user' });
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
      // 大运批命完成后通知 AI半仙 命盘总档需要刷新
      if (!data.meta?.cacheHit && typeof window._chatInvalidateMemoryA === 'function') {
        window._chatInvalidateMemoryA();
      }
    } catch (_err) {
      state.dayunStatusMap[rangeKey] = 'error';
      renderOverviewList();
      bindOverviewActions();
    }
  }

  async function loadSelectedYear(age) {
    const chartData = getChartPayload();
    const selectedDayun = getSelectedDayun();
    const numericAge = Number(age);
    const bodyEl = document.getElementById('dlx-ln-ai-body');
    if (!chartData || !selectedDayun || !Number.isFinite(numericAge)) return;

    if (state.yearResultMap[String(numericAge)]) {
      setText('dlx-ln-ai-status', '已读取缓存');
      renderYearResult(numericAge);
      return;
    }

    setText('dlx-ln-ai-status', '正在批这一年…');
    if (bodyEl) bodyEl.innerHTML = '<p class="aip-body-para">AI 正在结合大运与流年生成结果…</p>';

    try {
      const data = await _aipCallBackend('liunian_year', {
        selectedDayun,
        selectedYear: serializeYear(numericAge, selectedDayun),
      });
      state.yearResultMap[String(numericAge)] = data.card || {};
      exposeLifeCurveSignals();
      setText('dlx-ln-ai-status', `已完成 · ${_fmtDuration(data.meta?.durationMs || 0)}`);
      renderYearResult(numericAge);
    } catch (err) {
      setText('dlx-ln-ai-status', err?.message || '流年批命失败');
      if (bodyEl) bodyEl.innerHTML = '';
      setText('dlx-ln-risk', '');
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
    if (options?.source === 'user') {
      loadSelectedYear(age);
      return;
    }
    setText('dlx-ln-ai-status', state.yearResultMap[String(age)] ? '已读取缓存' : '');
    renderYearResult(age);
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    setTimeout(bind, 0);
  }
}());
