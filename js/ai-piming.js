/**
 * js/ai-piming.js — 前端 AI 批命集成层
 * 调用 AI 批命后端 /api/ai/run，不含任何排盘逻辑，不修改 _chart/_chartInputs 等全局变量
 *
 * 依赖全局变量（由命书页脚本维护）：
 *   _chart, _chartInputs, _fcActiveAge, _liunianSeq,
 *   _birthPillarsCache, _xianTianGuaResult, _houTianGuaResult, _liunianGuaResult
 */

// ── 配置 ──────────────────────────────────────────────────────────────────────
// 支持 URL 临时覆盖：?aiBackendBase=https://xxx
const AI_BACKEND_BASE = (() => {
  try {
    const qsBase = new URLSearchParams(location.search).get('aiBackendBase') || '';
    const cfgBase = window.SITE_CONFIG && window.SITE_CONFIG.aiBackendBase;
    return (qsBase || cfgBase || 'https://api.yuetianai.com').replace(/\/$/, '');
  } catch (_err) {
    return 'https://api.yuetianai.com';
  }
})();

// ── 工具 ──────────────────────────────────────────────────────────────────────
function _aipJoin(path) {
  const base = (AI_BACKEND_BASE || '').replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

function _aipFriendlyError(err) {
  const raw = String(err?.message || err || '').trim();
  if (/failed to fetch|networkerror|load failed|network request failed|fetch/i.test(raw)) {
    return 'AI服务未连接，请稍后重试';
  }
  if (/404|not found|unexpected token|json|html/i.test(raw)) {
    return 'AI后端接口未连接，请稍后重试';
  }
  if (/timeout|abort/i.test(raw)) {
    return 'AI响应超时，请稍后重试';
  }
  return raw || 'AI生成失败';
}

function _palaceSummary(palaces) {
  return (palaces || []).map(p => ({
    name:        p.name || '',
    branch:      p.earthlyBranch || '',
    isSoul:      !!p.isSoulPalace,
    isBody:      !!p.isBodyPalace,
    decadal:     p.decadal ? { range: p.decadal.range, stem: p.decadal.heavenlyStem } : null,
    majorStars:  (p.majorStars  || []).map(s => ({ name: s.name, mutagen: s.mutagen || null, brightness: s.brightness || '' })),
    minorStars:  (p.minorStars  || []).map(s => ({ name: s.name, mutagen: s.mutagen || null })),
    adjStars:    (p.adjectiveStars || []).map(s => s.name),
  }));
}

function _findPalaceByName(chart, names) {
  const arr = Array.isArray(names) ? names : [names];
  return (chart?.palaces || []).find(p => arr.includes(p.name)) || null;
}

function _serializePalaceDetail(palace) {
  if (!palace) return null;

  return {
    name: palace.name,
    branch: palace.earthlyBranch,
    majorStars: (palace.majorStars || []).map(s => ({
      name: s.name,
      mutagen: s.mutagen || null,
      brightness: s.brightness || '',
    })),
    minorStars: (palace.minorStars || []).map(s => ({
      name: s.name,
      mutagen: s.mutagen || null,
    })),
    adjStars: (palace.adjectiveStars || []).map(s => ({ name: s.name })),
  };
}

// 四化 type 归一：禄/权/科/忌 → 化禄/化权/化科/化忌
function _normMutagenType(t) {
  if (!t) return '';
  if (String(t).startsWith('化')) return t;
  return { '禄': '化禄', '权': '化权', '科': '化科', '忌': '化忌' }[t] || t;
}

function _yearMutagens(chart) {
  // 优先取 iztro 自带的生年四化字段
  const m = chart?.mutagens || chart?.yearMutagen || [];
  if (Array.isArray(m) && m.length) {
    return m.map(item => ({ ...item, type: _normMutagenType(item.type || '') }));
  }
  // fallback：同时扫 majorStars 和 minorStars（辅星如文曲/文昌也可能带四化）
  const result = [];
  (chart?.palaces || []).forEach(p => {
    [...(p.majorStars || []), ...(p.minorStars || [])].forEach(s => {
      if (s.mutagen) result.push({
        star  : s.name,
        type  : _normMutagenType(s.mutagen),
        palace: p.name,
      });
    });
  });
  return result;
}

/**
 * 构建发往后端 /api/ai/run 的 chartData 对象
 * extraParams 会原样透传，由后端 buildStructuredContext 按 moduleKey 使用
 */
function buildChartPayload() {
  if (!window._chart || !window._chartInputs) return null;
  const chart  = window._chart;
  const inputs = window._chartInputs;
  const norm   = inputs.norm || {};
  const pillars = window._birthPillarsCache || null;

  const lifePalace  = _findPalaceByName(chart, ['命宫', '命']);
  const bodyPalaceDetail = (chart?.palaces || []).find(p => p.isBodyPalace) || null;
  const careerPalace = _findPalaceByName(chart, ['官禄宫', '官禄', '事业宫']);
  const wealthPalace = _findPalaceByName(chart, ['财帛宫', '财帛']);
  const movePalace   = _findPalaceByName(chart, ['迁移宫', '迁移']);
  const spousePalace = _findPalaceByName(chart, ['夫妻宫', '夫妻']);
  const happinessPalace = _findPalaceByName(chart, ['福德宫', '福德']);
  const illnessPalace = _findPalaceByName(chart, ['疾厄宫', '疾厄']);

  // 当前大限：找包含 _fcActiveAge 的 decadal.range 的宫
  const activeAge = window._fcActiveAge || 1;
  let currentDecade = null;
  (chart.palaces || []).forEach(p => {
    const range = p?.decadal?.range;
    if (!range) return;
    const m = String(range).match(/(\d+)/g);
    if (!m || m.length < 2) return;
    const [s, e] = [Number(m[0]), Number(m[1])];
    if (activeAge >= s && activeAge <= e) {
      currentDecade = {
        palace: p.name, branch: p.earthlyBranch,
        range: `${s}-${e}`, stem: p.decadal?.heavenlyStem || '',
        majorStars: (p.majorStars || []).map(s => s.name),
      };
    }
  });

  // 流年信息
  const liunianEntry = (window._liunianSeq || {})[activeAge] || null;
  const currentLiunian = liunianEntry ? {
    name: liunianEntry.name || '', branch: liunianEntry.branch || '',
    period: liunianEntry.period || '', xiaoLian: liunianEntry.xiaoLian || '',
  } : null;

  // 全量大运表（供后端按任意年龄查表，不让 AI 自己推算）
  const dayunTable = (chart.palaces || [])
    .map(p => {
      const range = p?.decadal?.range;
      if (!range) return null;
      const m = String(range).match(/(\d+)/g);
      if (!m || m.length < 2) return null;
      return {
        ageStart: Number(m[0]),
        ageEnd: Number(m[1]),
        range: `${m[0]}-${m[1]}`,
        palaceName: p.name || '',
        palaceBranch: p.earthlyBranch || '',
        palaceStem: p?.decadal?.heavenlyStem || '',
        majorStars: (p.majorStars || []).map(s => ({ name: s.name, brightness: s.brightness || '', mutagen: s.mutagen || null })),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.ageStart - b.ageStart);

  // 全量小限/流年表（供后端按任意年龄查表）
  const _birthYearForTable = norm.year || 0;
  const liunianTable = Object.keys(window._liunianSeq || {})
    .map(k => {
      const age = Number(k);
      if (!age) return null;
      const e = window._liunianSeq[k] || {};
      return {
        age,
        solarYear: _birthYearForTable ? (_birthYearForTable + age - 1) : 0,
        xiaoLianBranch: e.xiaoLian || '',
        yearGanzhi: e.yearGanzhi ? ((e.yearGanzhi.stem || '') + (e.yearGanzhi.branch || '')) : '',
        liunianGuaName: e.name || '',
        liunianGuaPeriod: e.period || '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.age - b.age);

  // 子平四柱
  const sizhu = pillars ? {
    year:  `${pillars.yearStem || ''}${pillars.yearBranch || ''}`,
    month: `${pillars.monthStem || ''}${pillars.monthBranch || ''}`,
    day:   `${pillars.dayStem || ''}${pillars.dayBranch || ''}`,
    hour:  `${pillars.hourStem || ''}${pillars.hourBranch || ''}`,
    yearStem: pillars.yearStem, yearBranch: pillars.yearBranch,
    monthStem: pillars.monthStem, monthBranch: pillars.monthBranch,
    dayStem: pillars.dayStem, dayBranch: pillars.dayBranch,
    hourStem: pillars.hourStem, hourBranch: pillars.hourBranch,
  } : null;

  // 人生曲线数据（如果已生成）
  const lifeCurveScores = window._fcLifeCurveData?.scores || [];
  const peakAges   = lifeCurveScores.filter(i => (i.score || 0) >= 75).map(i => i.age);
  const valleyAges = lifeCurveScores.filter(i => (i.score || 0) <= 35).map(i => i.age);

  const currentYear = new Date().getFullYear();
  const birthYear = norm.year || 1990;

  // 真实当前虚岁（出生年推算），与用户在流年栏点击的 activeAge 区分
  const realCurrentAge = birthYear ? (currentYear - birthYear + 1) : 0;

  return {
    chartRecordId: window._chartRecordId || null,
    // 基础生辰
    gender:          inputs.gender || 'male',
    birthDate:       norm.dateStr ? `${norm.dateStr} ${norm.timeStr || ''}`.trim() : '',
    solarTime:       norm.solarTimeStr || '',
    birthYear, birthMonth: norm.month, birthDay: norm.day, birthHour: norm.hour,
    realCurrentAge,
    isLunar:         norm.isLunar || false,
    city:            norm.city || '',

    // 命盘基本信息
    fiveElementsClass: chart.fiveElementsClass || '',
    zodiac:            chart.zodiac            || '',
    lifeMain:          chart.lifeMain          || chart.lifeMainStar  || '',
    bodyMain:          chart.bodyMain          || chart.bodyMainStar  || '',
    yearStem:          chart.yearStem          || pillars?.yearStem   || '',

    // 核心宫位（详细信息，供 overall/minggong 使用）
    lifePalace:        _serializePalaceDetail(lifePalace),
    bodyPalaceDetail:  _serializePalaceDetail(bodyPalaceDetail),
    careerPalace:      _serializePalaceDetail(careerPalace),
    wealthPalace:      _serializePalaceDetail(wealthPalace),
    movePalace:        _serializePalaceDetail(movePalace),
    spousePalace:      _serializePalaceDetail(spousePalace),
    happinessPalace:   _serializePalaceDetail(happinessPalace),
    illnessPalace:     _serializePalaceDetail(illnessPalace),
    yearMutagens:      _yearMutagens(chart),
    palacesSummary:    _palaceSummary(chart.palaces),

    // 当前大限 / 小限流年（供 current_luck、xiaoxian_liunian 使用）
    activeAge,
    currentYear,
    currentDecade,
    currentLiunian,
    dayunTable,
    liunianTable,
    currentXiaolian: liunianEntry?.xiaoLian
      ? { branch: liunianEntry.xiaoLian }
      : null,
    liunianGua: window._liunianGuaResult
      ? { name: window._liunianGuaResult.name || '', period: window._liunianGuaResult.period || '' }
      : null,

    // 子平法（供 ziping 使用）
    sizhu,
    mingGua:    window._xianTianGuaResult ? { name: window._xianTianGuaResult.name, period: window._xianTianGuaResult.period } : null,
    houTianGua: window._houTianGuaResult  ? { name: window._houTianGuaResult.name,  period: window._houTianGuaResult.period  } : null,

    // 人生曲线（供 life_curve 使用）
    lifeCurveData: lifeCurveScores,
    peakAges,
    valleyAges,
  };
}

// ── 调用后端 ──────────────────────────────────────────────────────────────────
async function _aipCallBackend(moduleKey, extraParams = {}) {
  const chartData = buildChartPayload();
  if (!chartData) throw new Error('\u8bf7\u5148\u5b8c\u6210\u6392\u76d8');

  try {
    const resp = await fetch(_aipJoin('/api/ai/run'), {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ moduleKey, chartData, extraParams }),
    });

    const contentType = resp.headers?.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await resp.json()
      : { error: await resp.text() };

    if (!resp.ok || !(data.success || data.ok)) {
      throw new Error(data.error || `AI 后端异常 ${resp.status}`);
    }
    return data;
  } catch (err) {
    throw new Error(_aipFriendlyError(err));
  }
}

function _aipSetEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '';
}

function _aipShowLoading(ids) {
  ids.forEach(id => _aipSetEl(id, '正在生成…'));
}

// 耗时格式化：ms → 秒（保留1位小数）
function _fmtDuration(ms) {
  if (!ms) return '0秒';
  return (ms / 1000).toFixed(1) + '秒';
}

// 将 AI 纯文本转为带格式的 HTML（段落标题加粗，段落用 <p> 包裹）
function _formatAiBody(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const blocks = [];   // 每个 block = { type: 'title'|'para', lines: [] }
  let cur = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) { cur = null; continue; }

    const isHeader = trimmed.length <= 12
      && !/^[\d\-\*\·\（\(]/.test(trimmed)
      && /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(trimmed)
      && i + 1 < lines.length && lines[i + 1]?.trim();

    const safe = trimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (isHeader) {
      cur = null;
      blocks.push({ type: 'title', html: `<strong class="aip-body-title">${safe}</strong>` });
    } else {
      if (!cur) { cur = { type: 'para', lines: [] }; blocks.push(cur); }
      cur.lines.push(safe);
    }
  }

  return blocks.map(b =>
    b.type === 'title'
      ? b.html
      : `<p class="aip-body-para">${b.lines.join('<br>')}</p>`
  ).join('');
}

// 整体渲染（不逐字，直接呈现 HTML 格式）
let _aipTypewriterTimer = null;
function _aipTypewriter(el, text, speed) {
  if (!el) return;
  if (_aipTypewriterTimer) { clearTimeout(_aipTypewriterTimer); _aipTypewriterTimer = null; }
  el.innerHTML = '';
  if (!text) return;
  const html = _formatAiBody(text);
  const blocks = html.split(/(?=<strong|<p)/);
  const delay = speed != null ? speed : Math.max(30, Math.min(80, Math.round(2000 / blocks.length)));
  let i = 0;
  function step() {
    if (i < blocks.length) {
      el.innerHTML += blocks[i++];
      _aipTypewriterTimer = setTimeout(step, delay);
    } else {
      _aipTypewriterTimer = null;
    }
  }
  step();
}

// sections 结构化渲染（title + content 逐块显示）
function _aipRenderSections(el, sections) {
  if (!el) return;
  if (_aipTypewriterTimer) { clearTimeout(_aipTypewriterTimer); _aipTypewriterTimer = null; }
  el.innerHTML = '';

  const blocks = sections.map(s => {
    const title = (s.title || '').trim();
    const content = (s.content || '').trim();
    const safeTitle = title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const safeContent = content
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\n/g, '<br>');
    return (title ? `<strong class="aip-body-title">${safeTitle}</strong>` : '')
      + `<p class="aip-body-para">${safeContent}</p>`;
  });

  let i = 0;
  const delay = Math.max(60, Math.min(200, Math.round(1200 / blocks.length)));
  function step() {
    if (i < blocks.length) {
      el.innerHTML += blocks[i++];
      _aipTypewriterTimer = setTimeout(step, delay);
    } else {
      _aipTypewriterTimer = null;
    }
  }
  step();
}

const TIEKOU_TEST_MODULES = [
  { index: 1, moduleKey: 'tiekou_test_1', summaryName: '测试一', defaultTip: '定位：主力直断，输出 4-6 条最硬命中。' },
  { index: 2, moduleKey: 'tiekou_test_2', summaryName: '测试二', defaultTip: '定位：替换原 OCR 调试文档，用《紫微斗数全书》做主公版测试。' },
  { index: 3, moduleKey: 'tiekou_test_3', summaryName: '测试三', defaultTip: '定位：课堂规则验证，重点看星曜、四化、格局出处。' },
  { index: 4, moduleKey: 'tiekou_test_4', summaryName: '测试四', defaultTip: '定位：人性、进退、时机补充，不强行斗数断语。' },
  { index: 5, moduleKey: 'tiekou_test_5', summaryName: '测试五', defaultTip: '定位：用《紫微斗数》做第二份斗数公版文本对照。' },
  { index: 6, moduleKey: 'tiekou_test_6', summaryName: '测试六', defaultTip: '定位：用《三命通会》做八字命理旁证，不强行套紫微。' },
  { index: 7, moduleKey: 'tiekou_test_7', summaryName: '测试七', defaultTip: '定位：合并全部文本，后台先检索候选片段，再做双轮自查，只留最终通过项。' },
];

let _aipTiekouSummaryState = {};

function _aipBuildTiekouSummaryState() {
  return TIEKOU_TEST_MODULES.reduce((acc, item) => {
    acc[item.moduleKey] = {
      state: 'idle',
      text: '待测试',
      hitCount: 0,
      duration: '',
    };
    return acc;
  }, {});
}

function _aipRenderTiekouSummary() {
  const overviewEl = document.getElementById('aip-tiekou-summary-overview');
  const gridEl = document.getElementById('aip-tiekou-summary-grid');
  if (!overviewEl || !gridEl) return;

  const allStates = TIEKOU_TEST_MODULES.map(item => _aipTiekouSummaryState[item.moduleKey] || { state: 'idle', text: '待测试' });
  const tested = allStates.filter(s => s.state !== 'idle').length;
  const running = allStates.filter(s => s.state === 'running').length;
  const hit = allStates.filter(s => s.state === 'done').length;
  const empty = allStates.filter(s => s.state === 'empty').length;
  const error = allStates.filter(s => s.state === 'error').length;

  overviewEl.textContent = tested
    ? `总览：已测 ${tested}/${TIEKOU_TEST_MODULES.length} · 命中 ${hit} · 空结果 ${empty} · 失败 ${error}${running ? ` · 运行中 ${running}` : ''}`
    : '总览：还没开始测试，先排盘后逐个试。';

  gridEl.innerHTML = TIEKOU_TEST_MODULES.map(item => {
    const state = _aipTiekouSummaryState[item.moduleKey] || { state: 'idle', text: '待测试' };
    const cls = `is-${state.state || 'idle'}`;
    const duration = state.duration ? ` · ${state.duration}` : '';
    return `<span class="tiekou-summary-pill ${cls}"><strong>${item.summaryName}</strong><em>${state.text || '待测试'}${duration}</em></span>`;
  }).join('');
}

function _aipSetTiekouSummaryState(moduleKey, patch) {
  const prev = _aipTiekouSummaryState[moduleKey] || {};
  _aipTiekouSummaryState[moduleKey] = { ...prev, ...patch };
  _aipRenderTiekouSummary();
}

function _aipResetTiekouCards() {
  if (_aipTypewriterTimer) {
    clearTimeout(_aipTypewriterTimer);
    _aipTypewriterTimer = null;
  }
  _aipTiekouSummaryState = _aipBuildTiekouSummaryState();
  TIEKOU_TEST_MODULES.forEach(({ index, defaultTip }) => {
    const body = document.getElementById(`aip-tiekou-${index}-body`);
    const tip = document.getElementById(`aip-tiekou-${index}-tip`);
    const status = document.getElementById(`aip-tiekou-${index}-status`);
    if (body) {
      body.innerHTML = '';
      body.style.color = '';
    }
    if (tip) tip.textContent = defaultTip;
    if (status) status.textContent = '';
  });
  _aipRenderTiekouSummary();
}

function _aipGetTiekouEmptyMessage(item, data) {
  const card = data.card || {};
  const meta = data.meta || {};
  const debug = data.debug || {};
  const hint = [
    card.risk,
    meta.noMatchReason,
    debug.noMatchReason,
    ...(Array.isArray(debug.trace) ? debug.trace : []),
  ].filter(Boolean).join(' ');

  if (item.moduleKey === 'tiekou_test_7') {
    return /自查|验算|复核|未通过|打回/.test(hint)
      ? '总库命中过候选，但双轮自查没有全部通过，已按规则留空。'
      : '总库这次没有留下能通过双轮自查的批语。';
  }
  if (/自查|验算|复核|未通过|打回/.test(hint)) {
    return '本轮其实命中过候选，但验算没过，已按规则留空。';
  }
  if (/出处|原文|引文|回查|找不到/.test(hint)) {
    return '本轮有候选，但出处不够硬，已按规则留空。';
  }
  if (/命盘|宫位|四化|星曜|对不上|不一致/.test(hint)) {
    return '本轮有候选，但和当前命盘对不上，已按规则留空。';
  }
  if (/空|未匹配|无匹配|未命中/.test(hint)) {
    return '当前测试位没有命中足够硬的批语。';
  }
  return '当前测试位没有通过最终验算的批语。';
}

function _aipRenderTiekouResult(moduleKey, data) {
  const item = TIEKOU_TEST_MODULES.find(x => x.moduleKey === moduleKey);
  if (!item) return { hitCount: 0, hasResult: false };
  const body = document.getElementById(`aip-tiekou-${item.index}-body`);
  const tip = document.getElementById(`aip-tiekou-${item.index}-tip`);
  const sections = (Array.isArray(data.card?.sections) ? data.card.sections : [])
    .filter(s => String(s?.content || '').trim());

  if (body) {
    body.innerHTML = '';
    body.style.color = '';
    if (sections.length) {
      _aipRenderSections(body, sections);
    } else {
      body.textContent = _aipGetTiekouEmptyMessage(item, data);
      body.style.color = '#9a8878';
    }
  }
  if (tip) tip.textContent = item.defaultTip;
  return { hitCount: sections.length, hasResult: sections.length > 0 };
}

window._aipResetTiekouCards = _aipResetTiekouCards;

// ── 渲染结果到现有卡片 ────────────────────────────────────────────────────────
function _aipRenderResult(moduleKey, data) {
  if (moduleKey && String(moduleKey).startsWith('tiekou_test_')) {
    return _aipRenderTiekouResult(moduleKey, data);
  }

  switch (moduleKey) {
    case 'overall': {
      // card → 整体批命主卡片（aip-life）
      const card    = data.card || {};
      const ttl     = document.getElementById('aip-life-ttl');
      const body    = document.getElementById('aip-life-body');
      const tip     = document.getElementById('aip-life-tip');
      const riskEl  = document.getElementById('aip-life-risk');
      const basisEl = document.getElementById('aip-life-basis');
      const evEl    = document.getElementById('aip-life-ev');

      // ── 1. 命格定位行（速览结构卡内独立行，AI 后填充）────
      const badgeRow     = document.getElementById('aip-badge-row');
      const profileBadge = document.getElementById('aip-profile-badge');
      if (profileBadge) {
        const label = card.profileBadge || card.sanfangProfile?.label || '';
        if (label) {
          profileBadge.textContent = label;
          if (badgeRow) badgeRow.style.display = '';
        } else {
          if (badgeRow) badgeRow.style.display = 'none';
        }
      }

      // ── 2. 格局行（AI 补充） ──────────────────────────
      const patternRow = document.getElementById('aip-struct-pattern-row');
      const patternVal = document.getElementById('aip-struct-pattern');
      if (patternRow && patternVal) {
        const patterns = Array.isArray(card.patterns) ? card.patterns : [];
        if (patterns.length) {
          patternVal.innerHTML = patterns
            .map(p => `<span class="aip-pattern-tag">${p.name}</span>`)
            .join('');
          patternRow.style.display = '';
        } else {
          patternRow.style.display = 'none';
        }
      }

      // ── 3. 破格行（AI 补充） ──────────────────────────
      const breakRow = document.getElementById('aip-struct-break-row');
      const breakVal = document.getElementById('aip-struct-break');
      if (breakRow && breakVal) {
        const breaks = Array.isArray(card.breaks) ? card.breaks : [];
        if (breaks.length) {
          breakVal.innerHTML = breaks
            .map(b => `<span class="aip-break-tag">${b.name}</span>`)
            .join('');
          breakRow.style.display = '';
        } else {
          breakRow.style.display = 'none';
        }
      }

      // ── 4. 标题 ────────────────────────────────────────
      if (ttl) ttl.textContent = card.title || 'AI 整体批命';

      // ── 5. 主体解读（sections 结构化渲染） ─────────────────
      if (body) {
        body.style.color = '';
        const sections = Array.isArray(card.sections) && card.sections.length
          ? card.sections
          : [{ title: '', content: card.summary || '' }];
        _aipRenderSections(body, sections);
      }

      // 占位提示隐藏（AI 内容接管）
      if (tip) tip.textContent = '';

      // ── 6. 风险提醒 ────────────────────────────────────
      if (riskEl) {
        if (card.risk) {
          riskEl.textContent = '要留意：' + card.risk;
          riskEl.style.display = '';
        } else {
          riskEl.style.display = 'none';
        }
      }

      // ── 7. 判断依据 ────────────────────────────────────
      if (basisEl) {
        if (card.basis) {
          basisEl.textContent = '判断依据：' + card.basis;
          basisEl.style.display = '';
        } else {
          basisEl.style.display = 'none';
        }
      }

      // ── 8. evidence — 用户态不渲染，debug 区已完整记录
      if (evEl) evEl.style.display = 'none';

      // ── 9. debug → 调试区 ──────────────────────────────
      const dbg = data.debug || {};
      const debugCard = document.getElementById('aip-overall-debug-card');
      const debugPre  = document.getElementById('aip-overall-debug-pre');
      if (debugCard) debugCard.style.display = '';
      if (debugPre) {
        const lines = [
          `模型：${dbg.model || '—'}   耗时：${dbg.durationMs || 0}ms`,
          `摘要：${dbg.requestSummary || '—'}`,
          '',
          '流程：',
          ...(Array.isArray(dbg.trace) ? dbg.trace.map(s => '  ' + s) : [String(dbg.trace || '—')]),
          '',
          'rawResponse：',
          dbg.rawResponse || '—',
        ];
        debugPre.textContent = lines.join('\n');
      }
      break;
    }
    case 'current_luck': {
      const text   = data.finalAnswer || '';
      const dxBody = document.getElementById('aip-dx-body');
      if (dxBody) { dxBody.textContent = text; dxBody.style.whiteSpace = 'pre-wrap'; }
      const dxTtl  = document.getElementById('aip-dx-ttl');
      if (dxTtl) dxTtl.textContent = 'AI 大限解读';
      break;
    }
    case 'xiaoxian_liunian': {
      const text   = data.finalAnswer || '';
      const dxBody = document.getElementById('aip-dx-body');
      if (dxBody) { dxBody.textContent = text; dxBody.style.whiteSpace = 'pre-wrap'; }
      const dxTtl  = document.getElementById('aip-dx-ttl');
      if (dxTtl) dxTtl.textContent = 'AI 小限流年解读';
      break;
    }
    case 'shengong': {
      const card = data.card || {};
      const ttl = document.getElementById('aip-shen-ttl');
      const body = document.getElementById('aip-shen-body');
      const tip = document.getElementById('aip-shen-tip');
      if (ttl) ttl.textContent = card.title || '身宫批命';
      if (body) {
        body.textContent = card.body || data.finalAnswer || '';
        body.style.whiteSpace = 'pre-wrap';
        body.style.color = '';
      }
      if (tip) tip.textContent = card.tip || '';
      break;
    }
    case 'hunyin': {
      const card = data.card || {};
      const ttl = document.getElementById('aip-hunyin-ttl');
      const body = document.getElementById('aip-hunyin-body');
      const tip = document.getElementById('aip-hunyin-tip');
      if (ttl) ttl.textContent = card.title || '婚姻批命';
      if (body) {
        body.textContent = card.body || data.finalAnswer || '';
        body.style.whiteSpace = 'pre-wrap';
        body.style.color = '';
      }
      if (tip) tip.textContent = card.tip || '';
      break;
    }
    case 'jiankang': {
      const card = data.card || {};
      const ttl = document.getElementById('aip-jiankang-ttl');
      const body = document.getElementById('aip-jiankang-body');
      const tip = document.getElementById('aip-jiankang-tip');
      if (ttl) ttl.textContent = card.title || '健康批命';
      if (body) {
        body.textContent = card.body || data.finalAnswer || '';
        body.style.whiteSpace = 'pre-wrap';
        body.style.color = '';
      }
      if (tip) tip.textContent = card.tip || '';
      break;
    }
    case 'caiyun': {
      const card = data.card || {};
      const ttl = document.getElementById('aip-caiyun-ttl');
      const body = document.getElementById('aip-caiyun-body');
      const tip = document.getElementById('aip-caiyun-tip');
      if (ttl) ttl.textContent = card.title || '财运批命';
      if (body) {
        body.textContent = card.body || data.finalAnswer || '';
        body.style.whiteSpace = 'pre-wrap';
        body.style.color = '';
      }
      if (tip) tip.textContent = card.tip || '';
      break;
    }
    case 'shiye': {
      const card = data.card || {};
      const ttl = document.getElementById('aip-shiye-ttl');
      const body = document.getElementById('aip-shiye-body');
      const tip = document.getElementById('aip-shiye-tip');
      if (ttl) ttl.textContent = card.title || '事业批命';
      if (body) {
        body.textContent = card.body || data.finalAnswer || '';
        body.style.whiteSpace = 'pre-wrap';
        body.style.color = '';
      }
      if (tip) tip.textContent = card.tip || '';
      break;
    }
    default: {
      const text   = data.finalAnswer || '';
      const shBody = document.getElementById('aip-sh-body');
      if (shBody) { shBody.textContent = text; shBody.style.whiteSpace = 'pre-wrap'; }
    }
  }
}

// ── 主入口：两个独立 AI 批命按钮 ─────────────────────────────────────────────
(function _initAipNewBackend() {
  function _notifyDone(label, detail, tag) {
    if (typeof window._desktopNotifyTaskDone === 'function') {
      window._desktopNotifyTaskDone(label, detail, { tag: tag });
    }
  }

  function _notifyFailed(label, err, tag) {
    if (typeof window._desktopNotifyTaskFailed === 'function') {
      window._desktopNotifyTaskFailed(label, _aipFriendlyError(err) || '\u8bf7\u56de\u5230\u9875\u9762\u67e5\u770b\u539f\u56e0\u3002', { tag: tag });
    }
  }

  function _bindOverallBtn() {
    const btn      = document.getElementById('aip-overall-btn');
    const statusEl = document.getElementById('aip-overall-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const body = document.getElementById('aip-life-body');
      const tip  = document.getElementById('aip-life-tip');
      if (body) { body.textContent = 'AI 正在分析命盘，请稍候…'; body.style.color = '#9a8878'; }
      if (tip)  tip.textContent = '';
      ['aip-life-risk', 'aip-life-basis', 'aip-life-ev'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.innerHTML = ''; }
      });
      const badgeRow     = document.getElementById('aip-badge-row');
      const profileBadge = document.getElementById('aip-profile-badge');
      const patternRow   = document.getElementById('aip-struct-pattern-row');
      const breakRow     = document.getElementById('aip-struct-break-row');
      if (badgeRow)     badgeRow.style.display   = 'none';
      if (profileBadge) profileBadge.textContent = '';
      if (patternRow)   patternRow.style.display = 'none';
      if (breakRow)     breakRow.style.display   = 'none';
      document.getElementById('aip-struct-details')?.removeAttribute('open');

      try {
        const data = await _aipCallBackend('overall');
        _aipRenderResult('overall', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u6574\u4f53\u6279\u547d', '\u6574\u4f53\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-overall');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u6574\u4f53\u6279\u547d', err, 'yuetian-aip-overall-error');
        if (statusEl) statusEl.textContent = msg;
        if (body) { body.textContent = '⚠ ' + msg + '\n请稍后重试'; body.style.color = '#963d32'; }
        if (tip)  tip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindShenBtn() {
    const btn      = document.getElementById('aip-shen-btn');
    const statusEl = document.getElementById('aip-shen-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const shenTtl  = document.getElementById('aip-shen-ttl');
      const shenBody = document.getElementById('aip-shen-body');
      const shenTip  = document.getElementById('aip-shen-tip');
      if (shenTtl)  shenTtl.textContent = '身宫批命';
      if (shenBody) { shenBody.textContent = 'AI 正在分析身宫，请稍候…'; shenBody.style.color = '#9a8878'; }
      if (shenTip)  shenTip.textContent = '';

      try {
        const data = await _aipCallBackend('shengong');
        _aipRenderResult('shengong', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u8eab\u5bab\u6279\u547d', '\u8eab\u5bab\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-shengong');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u8eab\u5bab\u6279\u547d', err, 'yuetian-aip-shengong-error');
        if (statusEl) statusEl.textContent = msg;
        if (shenBody) { shenBody.textContent = '⚠ ' + msg + '\n请稍后重试'; shenBody.style.color = '#963d32'; }
        if (shenTip)  shenTip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindHunyinBtn() {
    const btn      = document.getElementById('aip-hunyin-btn');
    const statusEl = document.getElementById('aip-hunyin-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const hunyinTtl  = document.getElementById('aip-hunyin-ttl');
      const hunyinBody = document.getElementById('aip-hunyin-body');
      const hunyinTip  = document.getElementById('aip-hunyin-tip');
      if (hunyinTtl)  hunyinTtl.textContent = '婚姻批命';
      if (hunyinBody) { hunyinBody.textContent = 'AI 正在分析婚姻，请稍候…'; hunyinBody.style.color = '#9a8878'; }
      if (hunyinTip)  hunyinTip.textContent = '';

      try {
        const data = await _aipCallBackend('hunyin');
        _aipRenderResult('hunyin', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u5a5a\u59fb\u6279\u547d', '\u5a5a\u59fb\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-hunyin');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u5a5a\u59fb\u6279\u547d', err, 'yuetian-aip-hunyin-error');
        if (statusEl) statusEl.textContent = msg;
        if (hunyinBody) { hunyinBody.textContent = '⚠ ' + msg + '\n请稍后重试'; hunyinBody.style.color = '#963d32'; }
        if (hunyinTip)  hunyinTip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindJiankangBtn() {
    const btn      = document.getElementById('aip-jiankang-btn');
    const statusEl = document.getElementById('aip-jiankang-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const ttl  = document.getElementById('aip-jiankang-ttl');
      const body = document.getElementById('aip-jiankang-body');
      const tip  = document.getElementById('aip-jiankang-tip');
      if (ttl)  ttl.textContent = '健康批命';
      if (body) { body.textContent = 'AI 正在分析疾厄宫，请稍候…'; body.style.color = '#9a8878'; }
      if (tip)  tip.textContent = '';

      try {
        const data = await _aipCallBackend('jiankang');
        _aipRenderResult('jiankang', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u5065\u5eb7\u6279\u547d', '\u5065\u5eb7\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-jiankang');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u5065\u5eb7\u6279\u547d', err, 'yuetian-aip-jiankang-error');
        if (statusEl) statusEl.textContent = msg;
        if (body) { body.textContent = '⚠ ' + msg + '\n请稍后重试'; body.style.color = '#963d32'; }
        if (tip)  tip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindCaiyunBtn() {
    const btn      = document.getElementById('aip-caiyun-btn');
    const statusEl = document.getElementById('aip-caiyun-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const ttl  = document.getElementById('aip-caiyun-ttl');
      const body = document.getElementById('aip-caiyun-body');
      const tip  = document.getElementById('aip-caiyun-tip');
      if (ttl)  ttl.textContent = '财运批命';
      if (body) { body.textContent = 'AI 正在分析财帛宫，请稍候…'; body.style.color = '#9a8878'; }
      if (tip)  tip.textContent = '';

      try {
        const data = await _aipCallBackend('caiyun');
        _aipRenderResult('caiyun', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u8d22\u8fd0\u6279\u547d', '\u8d22\u8fd0\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-caiyun');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u8d22\u8fd0\u6279\u547d', err, 'yuetian-aip-caiyun-error');
        if (statusEl) statusEl.textContent = msg;
        if (body) { body.textContent = '⚠ ' + msg + '\n请稍后重试'; body.style.color = '#963d32'; }
        if (tip)  tip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindShiyeBtn() {
    const btn      = document.getElementById('aip-shiye-btn');
    const statusEl = document.getElementById('aip-shiye-status');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async () => {
      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';

      const ttl  = document.getElementById('aip-shiye-ttl');
      const body = document.getElementById('aip-shiye-body');
      const tip  = document.getElementById('aip-shiye-tip');
      if (ttl)  ttl.textContent = '事业批命';
      if (body) { body.textContent = 'AI 正在分析官禄宫，请稍候…'; body.style.color = '#9a8878'; }
      if (tip)  tip.textContent = '';

      try {
        const data = await _aipCallBackend('shiye');
        _aipRenderResult('shiye', data);
        const meta = data.meta || data.debug || {};
        _notifyDone('AI\u4e8b\u4e1a\u6279\u547d', '\u4e8b\u4e1a\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-shiye');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = _aipFriendlyError(err);
        _notifyFailed('AI\u4e8b\u4e1a\u6279\u547d', err, 'yuetian-aip-shiye-error');
        if (statusEl) statusEl.textContent = msg;
        if (body) { body.textContent = '⚠ ' + msg + '\n请稍后重试'; body.style.color = '#963d32'; }
        if (tip)  tip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  // ── 大限 AI ───────────────────────────────────────────────
  function _dlxGetDecadeMutagens(palace) {
    const result = [];
    [...(palace?.majorStars || []), ...(palace?.minorStars || [])].forEach(s => {
      if (s.mutagen) result.push({ star: s.name, type: s.mutagen });
    });
    return result;
  }

  function _dlxBuildDecadePayload() {
    const d = window._dlxSelectedDecade;
    if (!d) return null;
    const palace = d.palace;
    return {
      大限区间: `${d.start}-${d.end}岁`,
      大限宫位: palace?.name || '',
      宫干: palace?.decadal?.heavenlyStem || '',
      主星: (palace?.majorStars || []).map(s => ({ name: s.name, brightness: s.brightness || '', mutagen: s.mutagen || null })),
      辅星: (palace?.minorStars || []).map(s => s.name),
      大限四化: _dlxGetDecadeMutagens(palace),
    };
  }

  function _dlxBuildLiunianPayload() {
    const age = window._dlxSelectedAge;
    if (!age) return null;
    const lnData = (window._liunianSeq || {})[age] || null;
    const gz = lnData?.yearGanzhi
      ? (lnData.yearGanzhi.stem || '') + (lnData.yearGanzhi.branch || '') : '';
    const year = typeof _fcAgeToYear === 'function' ? _fcAgeToYear(age) : '';
    let xlName = '';
    if (typeof _fcResolveDisplayedXiaoLianBranch === 'function') {
      const xlBranch = _fcResolveDisplayedXiaoLianBranch(age);
      const xlPalace = (window._chart?.palaces || []).find(p => p.earthlyBranch === xlBranch);
      xlName = xlPalace?.name || xlBranch || '';
    }
    return { 虚岁: age, 公历年: year, 干支: gz, 小限落宫: xlName };
  }

  function _bindDlxDaxianBtn() {
    const btn = document.getElementById('dlx-dx-ai-btn');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._dlxSelectedDecade) {
        const s = document.getElementById('dlx-dx-ai-status');
        if (s) s.textContent = '请先选择大运';
        return;
      }
      newBtn.disabled = true;
      const statusEl = document.getElementById('dlx-dx-ai-status');
      const bodyEl   = document.getElementById('dlx-dx-ai-body');
      const riskEl   = document.getElementById('dlx-dx-risk');
      if (statusEl) statusEl.textContent = '正在生成…';
      if (bodyEl)   bodyEl.innerHTML = '<span style="color:#9a8878">AI 分析中，请稍候…</span>';
      try {
        const decadeData = _dlxBuildDecadePayload();
        const t0 = Date.now();
        const data = await _aipCallBackend('current_luck', { selectedDayun: decadeData, decadeData });
        const card = data.card || {};
        const durationMs = data.meta?.durationMs || (Date.now() - t0);
        _notifyDone('AI\u5927\u9650\u6279\u547d', '\u5927\u9650\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-daxian');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(durationMs)}`;
        if (bodyEl) {
          bodyEl.innerHTML = '';
          const sections = Array.isArray(card.sections) && card.sections.length
            ? card.sections : [{ title: '', content: card.summary || card.body || '' }];
          _aipRenderSections(bodyEl, sections);
        }
        if (riskEl) riskEl.textContent = card.risk ? '要留意：' + card.risk : '';
      } catch (err) {
        _notifyFailed('AI\u5927\u9650\u6279\u547d', err, 'yuetian-aip-daxian-error');
        if (statusEl) statusEl.textContent = _aipFriendlyError(err);
        if (bodyEl)   bodyEl.innerHTML = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindDlxLiunianBtn() {
    const btn = document.getElementById('dlx-ln-ai-btn');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._dlxSelectedAge) {
        const s = document.getElementById('dlx-ln-ai-status');
        if (s) s.textContent = '请先选择流年';
        return;
      }
      newBtn.disabled = true;
      const statusEl = document.getElementById('dlx-ln-ai-status');
      const bodyEl   = document.getElementById('dlx-ln-ai-body');
      const riskEl   = document.getElementById('dlx-ln-risk');
      if (statusEl) statusEl.textContent = '正在生成…';
      if (bodyEl)   bodyEl.innerHTML = '<span style="color:#9a8878">AI 分析中，请稍候…</span>';
      try {
        const decadeData  = _dlxBuildDecadePayload();
        const liunianData = _dlxBuildLiunianPayload();
        const t0 = Date.now();
        const data = await _aipCallBackend('liunian_year', { decadeData, liunianData });
        const card = data.card || {};
        const durationMs = data.meta?.durationMs || (Date.now() - t0);
        _notifyDone('AI\u6d41\u5e74\u6279\u547d', '\u6d41\u5e74\u6279\u547d\u5df2\u751f\u6210\u3002', 'yuetian-aip-liunian');
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(durationMs)}`;
        if (bodyEl) {
          bodyEl.innerHTML = '';
          const sections = Array.isArray(card.sections) && card.sections.length
            ? card.sections : [{ title: '', content: card.summary || card.body || '' }];
          _aipRenderSections(bodyEl, sections);
        }
        if (riskEl) riskEl.textContent = card.risk ? '要留意：' + card.risk : '';
      } catch (err) {
        _notifyFailed('AI\u6d41\u5e74\u6279\u547d', err, 'yuetian-aip-liunian-error');
        if (statusEl) statusEl.textContent = _aipFriendlyError(err);
        if (bodyEl)   bodyEl.innerHTML = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bindTiekouTestBtns() {
    TIEKOU_TEST_MODULES.forEach(({ index, moduleKey }) => {
      const btn = document.getElementById(`aip-tiekou-${index}-btn`);
      const statusEl = document.getElementById(`aip-tiekou-${index}-status`);
      if (!btn) return;
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', async function () {
        if (!window._chart || !window._chartInputs) {
          if (statusEl) statusEl.textContent = '请先完成排盘';
          return;
        }
        if (_aipTypewriterTimer) {
          clearTimeout(_aipTypewriterTimer);
          _aipTypewriterTimer = null;
        }
        newBtn.disabled = true;
        if (statusEl) statusEl.textContent = '正在匹配笔记…';
        _aipSetTiekouSummaryState(moduleKey, {
          state: 'running',
          text: '运行中',
          hitCount: 0,
          duration: '',
        });

        const body = document.getElementById(`aip-tiekou-${index}-body`);
        if (body) {
          body.textContent = 'AI 正在通读对应笔记并匹配命盘，请稍候…';
          body.style.color = '#9a8878';
        }

        try {
          const data = await _aipCallBackend(moduleKey);
          const result = _aipRenderResult(moduleKey, data) || {};
          const meta = data.meta || data.debug || {};
          if (statusEl) {
            const resultLabel = result.hasResult
              ? `命中 ${result.hitCount} 条`
              : '空结果';
            statusEl.textContent = `完成 · ${resultLabel} · ${_fmtDuration(meta.durationMs)}`;
          }
          _aipSetTiekouSummaryState(moduleKey, {
            state: result.hasResult ? 'done' : 'empty',
            text: result.hasResult ? `命中 ${result.hitCount} 条` : '空结果',
            hitCount: result.hitCount || 0,
            duration: _fmtDuration(meta.durationMs),
          });
        } catch (err) {
          const msg = _aipFriendlyError(err);
          if (statusEl) statusEl.textContent = msg;
          if (body) {
            body.textContent = '⚠ ' + msg + '\n请检查后台是否已发布该测试位提示词。';
            body.style.color = '#963d32';
          }
          _aipSetTiekouSummaryState(moduleKey, {
            state: 'error',
            text: '失败',
            hitCount: 0,
            duration: '',
          });
        } finally {
          newBtn.disabled = false;
        }
      });
    });
  }

  function _bind() {
    _bindOverallBtn();
    _bindShenBtn();
    _bindHunyinBtn();
    _bindJiankangBtn();
    _bindCaiyunBtn();
    _bindShiyeBtn();
    _bindDlxDaxianBtn();
    _bindDlxLiunianBtn();
    _bindTiekouTestBtns();
    _aipResetTiekouCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bind);
  } else {
    setTimeout(_bind, 0);
  }
}());
