/**
 * js/ai-piming.js — 前端 AI 批命集成层
 * 调用 Vercel 后端 /api/ai/run，不含任何排盘逻辑，不修改 _chart/_chartInputs 等全局变量
 *
 * 依赖全局变量（由 chart.html 内联脚本维护）：
 *   _chart, _chartInputs, _fcActiveAge, _liunianSeq,
 *   _birthPillarsCache, _xianTianGuaResult, _houTianGuaResult, _liunianGuaResult
 */

// ── 配置 ──────────────────────────────────────────────────────────────────────
// overall 走 chart.html 里的 _resolvePimingApiBase()（与其他 topic 共用同一套探测逻辑）
// 其余 moduleKey 走 ai-piming-backend
const AI_BACKEND_BASE = 'https://ai-piming-backend-production.up.railway.app';

// ── 工具 ──────────────────────────────────────────────────────────────────────
function _aipJoin(path) {
  const base = (AI_BACKEND_BASE || '').replace(/\/$/, '');
  return base ? `${base}${path}` : path;
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

  return {
    // 基础生辰
    gender:          inputs.gender || 'male',
    birthDate:       norm.dateStr ? `${norm.dateStr} ${norm.timeStr || ''}`.trim() : '',
    solarTime:       norm.solarTimeStr || '',
    birthYear, birthMonth: norm.month, birthDay: norm.day, birthHour: norm.hour,
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
    yearMutagens:      _yearMutagens(chart),
    palacesSummary:    _palaceSummary(chart.palaces),

    // 当前大限流年（供 current_luck 使用）
    activeAge,
    currentYear,
    currentDecade,
    currentLiunian,
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

  const resp = await fetch(_aipJoin('/api/ai/run'), {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ moduleKey, chartData, extraParams }),
  });
  const data = await resp.json();
  if (!resp.ok || !(data.success || data.ok)) throw new Error(data.error || 'AI \u670d\u52a1\u5f02\u5e38');
  return data;
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

// 将 AI 纯文本转为带格式的 HTML（段落标题加粗）
function _formatAiBody(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { out.push('<br>'); continue; }
    // 判断是否为大标题：纯汉字/字母，不超过12字，不以标点/数字开头，下一行有内容
    const isHeader = trimmed.length <= 12
      && !/^[\d\-\*\·\（\(]/.test(trimmed)
      && /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(trimmed)
      && i + 1 < lines.length && lines[i + 1].trim();
    const safe = trimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (isHeader) {
      out.push(`<strong class="aip-body-title">${safe}</strong>`);
    } else {
      out.push(`<span>${safe}</span>`);
    }
  }
  return out.join('\n');
}

// 逐行显示效果（保留打字感，同时支持 HTML 格式）
let _aipTypewriterTimer = null;
function _aipTypewriter(el, text, speed) {
  if (!el) return;
  if (_aipTypewriterTimer) { clearTimeout(_aipTypewriterTimer); _aipTypewriterTimer = null; }
  el.innerHTML = '';
  if (!text) return;
  const html = _formatAiBody(text);
  const lines = html.split('\n');
  const delay = speed != null ? speed : Math.max(40, Math.min(120, Math.round(3000 / lines.length)));
  let i = 0;
  function step() {
    if (i < lines.length) {
      el.innerHTML += (i > 0 ? '\n' : '') + lines[i++];
      _aipTypewriterTimer = setTimeout(step, delay);
    } else {
      _aipTypewriterTimer = null;
    }
  }
  step();
}

// ── 渲染结果到现有卡片 ────────────────────────────────────────────────────────
function _aipRenderResult(moduleKey, data) {
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

      // ── 5. 主体解读（逐字打印效果） ────────────────────────
      if (body) {
        body.style.color = '';  // 恢复正常颜色（清除加载/错误状态的颜色）
        _aipTypewriter(body, card.summary || '');
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
      if (dxTtl) dxTtl.textContent = 'AI 大限流年解读';
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
    default: {
      const text   = data.finalAnswer || '';
      const shBody = document.getElementById('aip-sh-body');
      if (shBody) { shBody.textContent = text; shBody.style.whiteSpace = 'pre-wrap'; }
    }
  }
}

// ── 主入口：两个独立 AI 批命按钮 ─────────────────────────────────────────────
(function _initAipNewBackend() {
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
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = err?.message || 'AI 生成失败';
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
        if (statusEl) statusEl.textContent = `完成 · ${_fmtDuration(meta.durationMs)}`;
      } catch (err) {
        const msg = err?.message || 'AI 生成失败';
        if (statusEl) statusEl.textContent = msg;
        if (shenBody) { shenBody.textContent = '⚠ ' + msg + '\n请稍后重试'; shenBody.style.color = '#963d32'; }
        if (shenTip)  shenTip.textContent = '';
      } finally {
        newBtn.disabled = false;
      }
    });
  }

  function _bind() {
    _bindOverallBtn();
    _bindShenBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bind);
  } else {
    setTimeout(_bind, 0);
  }
}());
