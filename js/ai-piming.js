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
    bodyPalaceDetail:  bodyPalaceDetail ? { name: bodyPalaceDetail.name, branch: bodyPalaceDetail.earthlyBranch,
      majorStars: (bodyPalaceDetail.majorStars || []).map(s => s.name),
    } : null,
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

// 逐字打印效果（用于 AI 解读正文）
let _aipTypewriterTimer = null;
function _aipTypewriter(el, text, speed) {
  if (!el) return;
  if (_aipTypewriterTimer) { clearTimeout(_aipTypewriterTimer); _aipTypewriterTimer = null; }
  el.textContent = '';
  if (!text) return;
  const ms = speed != null ? speed : Math.max(8, Math.min(25, Math.round(6000 / text.length)));
  let i = 0;
  function step() {
    if (i < text.length) {
      el.textContent += text[i++];
      _aipTypewriterTimer = setTimeout(step, ms);
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
    default: {
      const text   = data.finalAnswer || '';
      const shBody = document.getElementById('aip-sh-body');
      if (shBody) { shBody.textContent = text; shBody.style.whiteSpace = 'pre-wrap'; }
    }
  }
}

// ── 主入口：劫持 aip-ai-btn，替换为新后端调用 ────────────────────────────────
(function _initAipNewBackend() {
  // 等 DOM 就绪（chart.html 里 IIFE 已先运行，这里覆盖）
  function _bind() {
    const btn      = document.getElementById('aip-ai-btn');
    const statusEl = document.getElementById('aip-ai-status');
    const noteEl   = document.getElementById('aip-footer-note');
    if (!btn) return;

    // 移除旧的所有点击监听（通过替换 DOM 节点）
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function () {
      if (!window._chart || !window._chartInputs) {
        if (statusEl) statusEl.textContent = '请先完成排盘';
        return;
      }

      const luckPanelVisible = document.getElementById('aip-panel-luck')?.style.display !== 'none';
      const moduleKey = luckPanelVisible ? 'current_luck' : 'overall';
      const extraParams = luckPanelVisible ? { activeAge: window._fcActiveAge || 1 } : {};

      newBtn.disabled = true;
      if (statusEl) statusEl.textContent = '正在生成…';
      if (noteEl)   noteEl.textContent   = '正在调用 AI…';

      // overall 加载中：清空 AI 分区，body 改为加载提示
      if (moduleKey === 'overall') {
        const body = document.getElementById('aip-life-body');
        const tip  = document.getElementById('aip-life-tip');
        if (body) { body.textContent = 'AI 正在分析命盘，请稍候…'; body.style.color = '#9a8878'; }
        if (tip)  tip.textContent = '';
        ['aip-life-risk', 'aip-life-basis', 'aip-life-ev'].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.style.display = 'none'; el.innerHTML = ''; }
        });
        // 隐藏 AI 速览行（防止上一次结果在加载中期残留）
        const badgeRow     = document.getElementById('aip-badge-row');
        const profileBadge = document.getElementById('aip-profile-badge');
        const patternRow   = document.getElementById('aip-struct-pattern-row');
        const breakRow     = document.getElementById('aip-struct-break-row');
        if (badgeRow)     badgeRow.style.display   = 'none';
        if (profileBadge) profileBadge.textContent = '';
        if (patternRow)   patternRow.style.display = 'none';
        if (breakRow)     breakRow.style.display   = 'none';
        // 加载中收起折叠区，避免旧盘内容残留展开
        document.getElementById('aip-struct-details')?.setAttribute('open', 'open');
      }

      try {
        const data = await _aipCallBackend(moduleKey, extraParams);
        _aipRenderResult(moduleKey, data);

        const meta = data.meta || data.debug || {};
        const hint = data.module === 'overall_piming'
          ? `overall_piming · ${meta.model || ''} · ${meta.durationMs || 0}ms`
          : `v${meta.versionNo || '?'} · ${meta.modelName || ''} · ${meta.tokensUsed || 0} tokens · ${meta.durationMs || 0}ms`;
        if (statusEl) statusEl.textContent = '生成完成';
        if (noteEl)   noteEl.textContent   = hint;

      } catch (err) {
        const msg = err?.message || 'AI 生成失败';
        if (statusEl) statusEl.textContent = msg;
        if (noteEl)   noteEl.textContent   = msg;
        // overall 失败：在 body 显示错误，保持其他分区隐藏
        if (moduleKey === 'overall') {
          const body = document.getElementById('aip-life-body');
          const tip  = document.getElementById('aip-life-tip');
          if (body) { body.textContent = '⚠ ' + msg + '\n请稍后重试'; body.style.color = '#963d32'; }
          if (tip)  tip.textContent = '';
        }
      } finally {
        newBtn.disabled = false;
      }
    });

    // 保持 chart.html 的连接状态文案，不再额外覆盖成另一套“已就绪”提示
    if (noteEl && !noteEl.textContent.trim()) noteEl.textContent = 'AI服务已连接';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bind);
  } else {
    // 延迟一帧，确保 chart.html 内联 IIFE 已运行
    setTimeout(_bind, 0);
  }
}());
