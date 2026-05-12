(function () {
  const storageKey = 'yt_mingbook_onepage_profile_v1';
  const legacyHistoryKey = 'yt_zw_history_v1';
  const palaceOrder = ['巳', '午', '未', '申', '辰', null, null, '酉', '卯', null, null, '戌', '寅', '丑', '子', '亥'];
  const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const defaultProfile = { year: 1990, month: 8, day: 16, hour: 12, minute: 0, gender: 'male', city: '北京市 东城区' };
  const starProfiles = {
    紫微: { trait: '主星稳重，有掌控局面和整合资源的能力', career: '适合管理、统筹、品牌和资源型岗位', wealth: '财运重在长期配置，不宜频繁追涨杀跌', love: '感情里要减少控制感，多给对方空间' },
    天府: { trait: '格局厚实，重秩序、信用与长期积累', career: '适合组织管理、财务、法务、运营与稳定体系', wealth: '守财能力强，越长期越能看出优势', love: '重承诺，也需要被稳定回应' },
    武曲: { trait: '行动直接，重结果，抗压能力强', career: '适合金融、管理、技术、执行强的赛道', wealth: '能靠专业和效率赚钱，但忌过度冒险', love: '表达偏务实，需补足柔软沟通' },
    天相: { trait: '讲规则、重平衡，擅长协调关系', career: '适合制度、服务、协作、行政管理类岗位', wealth: '财运稳定，贵在守正和长期合作', love: '感情重体面和边界，适合慢慢建立信任' },
    太阳: { trait: '外放热心，愿意承担责任', career: '适合曝光型、服务型、带团队的工作', wealth: '财来多靠名望与责任，忌替人承担过多', love: '付出多，需确认对方同频' },
    太阴: { trait: '细腻敏感，重安全感和审美', career: '适合内容、研究、资产、女性消费与长期经营', wealth: '偏向稳健积累，适合资产型思维', love: '情绪感受重要，关系需要温柔确认' },
    廉贞: { trait: '有边界、有判断力，人生常见转折升级', career: '适合规则复杂、需要判断和谈判的领域', wealth: '财运看选择质量，忌冲动投入', love: '感情强烈，需避免拉扯' },
    破军: { trait: '敢破旧局，适合变化中打开局面', career: '适合创业、改革、项目制、技术变革', wealth: '钱财起伏较大，先控风险再扩张', love: '关系里要少用极端方式解决问题' },
    贪狼: { trait: '欲望感、社交力和学习力都强', career: '适合商业、销售、内容、娱乐和跨界资源', wealth: '机会多但诱惑也多，需有纪律', love: '桃花旺，稳定关系要靠自律' },
    巨门: { trait: '善辨析，重逻辑，也容易想太多', career: '适合咨询、法律、传播、研究、口才型工作', wealth: '靠信息差和专业判断得财', love: '沟通是关键，少用冷处理' },
    天机: { trait: '反应快，擅长策略、学习和系统调整', career: '适合策划、产品、技术、顾问和流动性强的工作', wealth: '财运来自脑力和变化，但忌计划过密', love: '关系需要共同成长' },
    天梁: { trait: '重原则，有保护他人的倾向', career: '适合教育、医疗、咨询、公共服务与风控', wealth: '财运偏稳，贵人和口碑很重要', love: '感情里容易像照顾者，要保留自我' },
    七杀: { trait: '决断强，适合攻坚和开拓', career: '适合竞争强、压力大、需要决策的领域', wealth: '财运靠胆识，但要建立止损线', love: '需要成熟稳定的相处节奏' },
    天同: { trait: '亲和、有福气，适合在舒适关系中发力', career: '适合服务、内容、教育、社群和人际型岗位', wealth: '财运不宜太急，稳定现金流最重要', love: '重陪伴，也要避免过度依赖' },
  };

  const state = {
    profile: readInitialProfile(),
    chart: null,
    chartKey: '',
    norm: null,
    decoded: false,
    aiResults: {},
  };

  const $ = (selector) => document.querySelector(selector);

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number.parseInt(value, 10);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeProfile(input = {}) {
    return {
      year: clampNumber(input.year, 1900, 2030, defaultProfile.year),
      month: clampNumber(input.month, 1, 12, defaultProfile.month),
      day: clampNumber(input.day, 1, 31, defaultProfile.day),
      hour: clampNumber(input.hour ?? input.cstHour, 0, 23, defaultProfile.hour),
      minute: clampNumber(input.minute ?? input.cstMinute, 0, 59, defaultProfile.minute),
      gender: input.gender === 'female' || input.gender === '女' ? 'female' : 'male',
      city: String(input.cityName || input.city?.name || input.city || defaultProfile.city).trim() || defaultProfile.city,
    };
  }

  function profileFromParams() {
    const params = new URLSearchParams(location.search);
    if (!['year', 'month', 'day', 'hour', 'minute', 'gender', 'city'].some((key) => params.has(key))) return null;
    return normalizeProfile({
      year: params.get('year'),
      month: params.get('month'),
      day: params.get('day'),
      hour: params.get('hour'),
      minute: params.get('minute'),
      gender: params.get('gender'),
      city: params.get('city'),
    });
  }

  function profileFromSaved() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? normalizeProfile(JSON.parse(raw)) : null;
    } catch (_) {
      return null;
    }
  }

  function indexToHour(index) {
    const idx = clampNumber(index, 0, 11, 6);
    return idx === 0 ? 0 : idx * 2;
  }

  function profileFromLegacyHistory() {
    try {
      const raw = localStorage.getItem(legacyHistoryKey);
      const list = raw ? JSON.parse(raw) : [];
      const item = Array.isArray(list) ? list[0] : null;
      if (!item) return null;
      const source = item.norm || item;
      const date = String(source.dateStr || '').split('-').map((part) => Number.parseInt(part, 10));
      return normalizeProfile({
        year: source.year || date[0],
        month: source.month || date[1],
        day: source.day || date[2],
        hour: source.cstHour ?? source.hour ?? indexToHour(source.timeIdx),
        minute: source.cstMinute ?? source.minute ?? 0,
        gender: source.gender,
        city: source.city,
      });
    } catch (_) {
      return null;
    }
  }

  function readInitialProfile() {
    return profileFromParams() || profileFromSaved() || profileFromLegacyHistory() || { ...defaultProfile };
  }

  function dateStr(profile) {
    return `${profile.year}-${pad2(profile.month)}-${pad2(profile.day)}`;
  }

  function localShichenIndex(hour, minute) {
    const total = hour * 60 + minute;
    return Math.floor(((total + 60) % 1440) / 120);
  }

  function computeNorm(profile) {
    const tstResult = typeof window.calcTrueSolarTime === 'function'
      ? window.calcTrueSolarTime({
        year: profile.year,
        month: profile.month,
        day: profile.day,
        hour: profile.hour,
        minute: profile.minute,
        cityName: profile.city,
      })
      : null;
    const timeIdx = typeof window.tstToShichen === 'function' && tstResult
      ? window.tstToShichen(tstResult.trueSolarHour, tstResult.trueSolarMinute)
      : localShichenIndex(profile.hour, profile.minute);
    return { ...profile, dateStr: dateStr(profile), cstHour: profile.hour, cstMinute: profile.minute, timeIdx, tstResult };
  }

  function getAstroLib() {
    return window.iztro?.astro || window.iztro || null;
  }

  function profileKey(profile) {
    return [profile.year, profile.month, profile.day, profile.hour, profile.minute, profile.gender, profile.city].join('|');
  }

  function getChartBundle() {
    const key = profileKey(state.profile);
    if (state.chart && state.chartKey === key) return { chart: state.chart, norm: state.norm };
    const lib = getAstroLib();
    if (!lib) return { error: '排盘模块未加载，请刷新页面重试。' };
    const norm = computeNorm(state.profile);
    const genderStr = state.profile.gender === 'male' ? '男' : '女';
    try {
      const chart = typeof lib.bySolar === 'function'
        ? lib.bySolar(norm.dateStr, norm.timeIdx, genderStr, true)
        : lib.astrolabeBySolarDate(norm.dateStr, norm.timeIdx, genderStr, true);
      state.chart = chart;
      state.norm = norm;
      state.chartKey = key;
      window._chart = chart;
      window._chartInputs = { dateStr: norm.dateStr, timeIdx: norm.timeIdx, gender: state.profile.gender, norm };
      window._fcActiveAge = Math.max(1, new Date().getFullYear() - state.profile.year + 1);
      window._liunianSeq = window._liunianSeq || {};
      return { chart, norm };
    } catch (error) {
      return { error: error.message || '命盘生成失败，请检查出生信息。' };
    }
  }

  function starText(star) {
    if (!star) return '';
    const name = star.name || star;
    const mutagen = star.mutagen ? star.mutagen : '';
    return `${name}${mutagen}`.trim();
  }

  function allSmallStars(palace) {
    return [...(palace?.minorStars || []), ...(palace?.adjectiveStars || palace?.adjStars || [])];
  }

  function allReadableStars(palace) {
    return [...(palace?.majorStars || []), ...allSmallStars(palace)];
  }

  function findLifePalace(chart) {
    return (chart?.palaces || []).find((item) => item.name === '命宫' || item.name === '命')
      || (chart?.palaces || []).find((item) => item.earthlyBranch === chart.earthlyBranchOfSoulPalace)
      || (chart?.palaces || [])[0];
  }

  function findBodyPalace(chart) {
    return (chart?.palaces || []).find((item) => item.isBodyPalace)
      || (chart?.palaces || []).find((item) => item.earthlyBranch === chart.earthlyBranchOfBodyPalace);
  }

  function normalizePalaceName(name = '') {
    return String(name).replace(/宫/g, '');
  }

  function findPalaceByName(chart, name) {
    const target = normalizePalaceName(name);
    return (chart?.palaces || []).find((palace) => normalizePalaceName(palace.name) === target)
      || (chart?.palaces || []).find((palace) => normalizePalaceName(palace.name).includes(target));
  }

  function majorNames(palace) {
    return (palace?.majorStars || []).map((star) => star.name || star).filter(Boolean);
  }

  function palaceMainLabel(palace) {
    const names = majorNames(palace);
    return names.length ? names.join('、') : '空宫';
  }

  function firstProfile(palace) {
    return starProfiles[majorNames(palace)[0]] || null;
  }

  function mutagens(chart) {
    return (chart?.palaces || []).flatMap((palace) =>
      allReadableStars(palace)
        .filter((star) => star?.mutagen)
        .map((star) => `${palace.name}${star.mutagen}(${star.name})`)
    );
  }

  function shichenLabel(norm) {
    return shichenNames[norm?.timeIdx] || '午';
  }

  function updateForm() {
    $('#mbpDate').value = dateStr(state.profile);
    $('#mbpTime').value = `${pad2(state.profile.hour)}:${pad2(state.profile.minute)}`;
    $('#mbpGender').value = state.profile.gender;
    $('#mbpCity').value = state.profile.city;
  }

  function updateHeroMeta(bundle) {
    const mark = $('#mbpProfileMark');
    const meta = $('#mbpProfileMeta');
    if (!mark || !meta) return;
    const genderText = state.profile.gender === 'male' ? '男命' : '女命';
    if (bundle.chart) {
      const life = findLifePalace(bundle.chart);
      mark.textContent = (life?.earthlyBranch || '命').slice(0, 1);
      meta.textContent = `${genderText} · ${bundle.chart.fiveElementsClass || '五行局'} · ${state.profile.city}`;
    } else {
      mark.textContent = '命';
      meta.textContent = '待排盘 · 命书未启';
    }
  }

  function renderChart() {
    const bundle = getChartBundle();
    updateHeroMeta(bundle);
    const grid = $('#mbpChartGrid');
    const summary = $('#mbpChartSummary');
    if (!grid || !summary) return;

    if (bundle.error) {
      grid.innerHTML = `<div class="mbp-chart-center"><div><h3>命盘待生成</h3><p>${escapeHtml(bundle.error)}</p></div></div>`;
      summary.textContent = bundle.error;
      return;
    }

    const { chart, norm } = bundle;
    const life = findLifePalace(chart);
    const body = findBodyPalace(chart);
    const palaceByBranch = new Map((chart.palaces || []).map((palace) => [palace.earthlyBranch, palace]));
    grid.innerHTML = palaceOrder.map((branch) => {
      if (!branch) return '';
      const palace = palaceByBranch.get(branch);
      if (!palace) return `<div class="mbp-palace"></div>`;
      const isLife = palace === life || palace.name === '命宫' || palace.earthlyBranch === chart.earthlyBranchOfSoulPalace;
      const isBody = palace === body || palace.isBodyPalace;
      const major = palaceMainLabel(palace);
      const small = allSmallStars(palace).map(starText).filter(Boolean).slice(0, 4).join('、') || '辅星待看';
      return `
        <div class="mbp-palace ${isLife ? 'is-life' : ''} ${isBody ? 'is-body' : ''}">
          <div class="mbp-palace-head"><b>${escapeHtml(palace.name || '')}</b><em>${escapeHtml((palace.heavenlyStem || '') + (palace.earthlyBranch || ''))}</em></div>
          <div class="mbp-palace-stars">${escapeHtml(major)}</div>
          <div class="mbp-palace-small">${escapeHtml(small)}</div>
        </div>
      `;
    }).join('') + `
      <div class="mbp-chart-center">
        <div>
          <h3>阅天命盘</h3>
          <p>${state.profile.gender === 'male' ? '男命' : '女命'} · ${escapeHtml(chart.fiveElementsClass || '五行局')}<br>命宫 ${escapeHtml(life?.name || '未见')} · 身宫 ${escapeHtml(body?.name || '未见')}<br>${escapeHtml(norm.dateStr)} · ${escapeHtml(shichenLabel(norm))}时</p>
        </div>
      </div>
    `;
    const four = mutagens(chart);
    summary.innerHTML = `命主身主：<b>${escapeHtml(chart.soul || '—')} · ${escapeHtml(chart.body || '—')}</b><br>四化分布：${escapeHtml(four.slice(0, 4).join('、') || '未读取到明显四化')}`;
  }

  function buildReports() {
    const bundle = getChartBundle();
    if (bundle.error) return null;
    const { chart } = bundle;
    const life = findLifePalace(chart);
    const body = findBodyPalace(chart);
    const marriage = findPalaceByName(chart, '夫妻');
    const health = findPalaceByName(chart, '疾厄');
    const wealth = findPalaceByName(chart, '财帛');
    const career = findPalaceByName(chart, '官禄');
    const lifeProfile = firstProfile(life);
    const bodyProfile = firstProfile(body);
    const marriageProfile = firstProfile(marriage);
    const healthProfile = firstProfile(health);
    const wealthProfile = firstProfile(wealth);
    const careerProfile = firstProfile(career);
    const four = mutagens(chart);

    return {
      specials: {
        body: {
          title: body ? `身宫在${body.name}` : '身宫待查',
          body: `${body ? `身宫主星 ${palaceMainLabel(body)}。` : ''}${bodyProfile ? bodyProfile.trait : '身宫看后天行动方式，需结合命宫与三方四正。'}`
        },
        marriage: {
          title: '婚姻批命',
          body: `夫妻宫 ${palaceMainLabel(marriage)}。${marriageProfile ? marriageProfile.love : '感情重点在沟通节奏与关系边界。'}`
        },
        health: {
          title: '健康批命',
          body: `疾厄宫 ${palaceMainLabel(health)}。${healthProfile ? healthProfile.trait : '健康判断需看疾厄宫与流年压力，先稳作息再看调理。'}`
        },
        wealth: {
          title: '财运批命',
          body: `财帛宫 ${palaceMainLabel(wealth)}。${wealthProfile ? wealthProfile.wealth : '财运适合稳健规划，避免被短期机会牵着走。'}`
        },
        career: {
          title: '事业批命',
          body: `官禄宫 ${palaceMainLabel(career)}。${careerProfile ? careerProfile.career : '事业方向要结合命宫与迁移宫，先定赛道再定打法。'}`
        },
      },
      chapters: [
        ['命格总览', `命宫 ${palaceMainLabel(life)}。${lifeProfile ? lifeProfile.trait : '先天底色需要从命宫和三方四正合看。'}`],
        ['大限流年', `当前页面先接命盘主线，后续可把原版大限流年结论并入这里，形成十年节奏。`],
        ['人生曲线', `把关键年份做成曲线阅读，帮助用户看清高低点和转折位置。`],
        ['五宫详解', `身宫、夫妻、疾厄、财帛、官禄五宫已在上方展开，适合作为深度报告主体。`],
        ['证据链', `命宫 ${life?.heavenlyStem || ''}${life?.earthlyBranch || ''}；身宫 ${body?.name || '未见'}；四化 ${four.slice(0, 4).join('、') || '未显' }。`],
        ['行动建议', `先看命盘底色，再看大运节奏；重要决策不只问准不准，还要知道何时动、如何动。`],
      ],
      subtitle: `${chart.fiveElementsClass || '五行局'} · 命宫${life?.earthlyBranch || '未见'} · 身宫${body?.earthlyBranch || '未见'}`,
    };
  }

  function friendlyAiError(error) {
    if (typeof window._aipFriendlyError === 'function') return window._aipFriendlyError(error);
    return String(error?.message || error || 'AI生成失败');
  }

  function aiCardText(data) {
    const card = data?.card || {};
    const sections = Array.isArray(card.sections) ? card.sections : [];
    if (sections.length) {
      return sections.map((section) => [section.title, section.content].filter(Boolean).join('：')).filter(Boolean).join('\n\n');
    }
    return card.body || card.summary || data?.finalAnswer || '';
  }

  function aiCardTitle(data, fallback) {
    return data?.card?.title || fallback;
  }

  function setDecodeStatus(text) {
    const el = $('#mbpDecodeStatus');
    if (el) el.textContent = text;
  }

  function setSpecialStatus(key, text, stateName = '') {
    const card = document.querySelector(`[data-report="${key}"]`);
    const status = document.querySelector(`[data-status="${key}"]`);
    if (card) {
      card.classList.toggle('is-running', stateName === 'running');
      card.classList.toggle('is-error', stateName === 'error');
    }
    if (status) status.textContent = text;
  }

  function renderSpecialAi(key, data, fallbackTitle) {
    const card = document.querySelector(`[data-report="${key}"]`);
    if (!card) return;
    const title = card.querySelector('h3');
    const body = card.querySelector('p');
    const text = aiCardText(data);
    if (title) title.textContent = aiCardTitle(data, fallbackTitle);
    if (body) body.textContent = text || '原站 AI 暂未返回内容，请稍后重试。';
  }

  function chartFacts() {
    const bundle = getChartBundle();
    if (bundle.error) return { subtitle: '命书启卷', evidence: '命盘暂未生成。' };
    const { chart } = bundle;
    const life = findLifePalace(chart);
    const body = findBodyPalace(chart);
    const four = mutagens(chart);
    return {
      subtitle: `${chart.fiveElementsClass || '五行局'} · 命宫${life?.earthlyBranch || '未见'} · 身宫${body?.earthlyBranch || '未见'}`,
      evidence: `命宫 ${life?.heavenlyStem || ''}${life?.earthlyBranch || ''}；身宫 ${body?.name || '未见'}；四化 ${four.slice(0, 4).join('、') || '未显'}。`,
    };
  }

  function renderChaptersFromAi() {
    const facts = chartFacts();
    const overall = state.aiResults.overall;
    const luck = state.aiResults.current_luck;
    const overallText = aiCardText(overall);
    const luckText = aiCardText(luck);
    const specialText = ['shengong', 'hunyin', 'jiankang', 'caiyun', 'shiye']
      .map((key) => aiCardText(state.aiResults[key]))
      .filter(Boolean)
      .slice(0, 5)
      .join('\n\n');
    const overallCard = overall?.card || {};
    const chaptersData = [
      [aiCardTitle(overall, '命格总览'), overallText || '整体批命等待原站 AI 返回。'],
      ['大限流年', luckText || '当前大限流年接口暂未返回，后续继续接原站大限模块。'],
      ['人生曲线', '人生曲线属于原站独立模块，下一步接入原站曲线评分与关键年份。'],
      ['五宫详解', specialText || '五宫专项等待原站 AI 返回。'],
      ['证据链', overallCard.basis || facts.evidence],
      ['行动建议', overallCard.risk ? `要留意：${overallCard.risk}` : '先看命盘底色，再看大运节奏；重要决策不只问准不准，还要知道何时动、如何动。'],
    ];
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.innerHTML = chaptersData.map((item, index) => `
        <article>
          <span>卷${index + 1}</span>
          <h3>${escapeHtml(item[0])}</h3>
          <p>${escapeHtml(item[1])}</p>
        </article>
      `).join('');
    }
    const subtitle = $('#mbpBookSubtitle');
    if (subtitle) subtitle.textContent = facts.subtitle;
  }

  async function callOriginalAi(moduleKey) {
    if (typeof window._aipCallBackend !== 'function') {
      throw new Error('原站 AI 批命脚本未加载');
    }
    return window._aipCallBackend(moduleKey);
  }

  async function decodeReports() {
    const bundle = getChartBundle();
    if (bundle.error) {
      alert(bundle.error);
      return;
    }
    const btn = $('#mbpDecodeBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'AI 解读中…';
    }
    state.decoded = true;
    state.aiResults = {};
    document.body.classList.add('is-decoded');
    setDecodeStatus('正在调用原站 AI 批命：整体批命');

    const tasks = [
      { module: 'overall', label: '整体批命' },
      { module: 'current_luck', label: '大限流年' },
      { module: 'shengong', key: 'body', label: '身宫批命' },
      { module: 'hunyin', key: 'marriage', label: '婚姻批命' },
      { module: 'jiankang', key: 'health', label: '健康批命' },
      { module: 'caiyun', key: 'wealth', label: '财运批命' },
      { module: 'shiye', key: 'career', label: '事业批命' },
    ];

    let successCount = 0;
    for (const task of tasks) {
      if (task.key) setSpecialStatus(task.key, '正在生成…', 'running');
      setDecodeStatus(`正在调用原站 AI 批命：${task.label}`);
      try {
        const data = await callOriginalAi(task.module);
        state.aiResults[task.module] = data;
        successCount += 1;
        if (task.key) {
          renderSpecialAi(task.key, data, task.label);
          setSpecialStatus(task.key, '已生成', 'done');
        }
        renderChaptersFromAi();
      } catch (error) {
        const message = friendlyAiError(error);
        if (task.key) {
          renderSpecialAi(task.key, { card: { title: task.label, body: `⚠ ${message}` } }, task.label);
          setSpecialStatus(task.key, message, 'error');
        }
      }
    }

    renderChaptersFromAi();
    setDecodeStatus(successCount ? `已接入原站 AI：完成 ${successCount}/${tasks.length} 个模块。` : 'AI 服务暂未连接，请稍后重试。');
    if (btn) {
      btn.disabled = false;
      btn.textContent = successCount ? '重新一键解读' : '重试一键解读';
    }
  }

  function resetAiContent() {
    const defaults = {
      body: ['身宫批命', '点击一键解读后生成。'],
      marriage: ['婚姻批命', '点击一键解读后生成。'],
      health: ['健康批命', '点击一键解读后生成。'],
      wealth: ['财运批命', '点击一键解读后生成。'],
      career: ['事业批命', '点击一键解读后生成。'],
    };
    Object.entries(defaults).forEach(([key, value]) => {
      const card = document.querySelector(`[data-report="${key}"]`);
      if (!card) return;
      card.classList.remove('is-running', 'is-error');
      const title = card.querySelector('h3');
      const body = card.querySelector('p');
      const status = document.querySelector(`[data-status="${key}"]`);
      if (title) title.textContent = value[0];
      if (body) body.textContent = value[1];
      if (status) status.textContent = '待生成';
    });
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.innerHTML = ['命格总览', '大限流年', '人生曲线', '五宫详解', '证据链', '行动建议'].map((title, index) => `
        <article><span>卷${index + 1}</span><h3>${title}</h3><p>等待一键解读。</p></article>
      `).join('');
    }
    const subtitle = $('#mbpBookSubtitle');
    if (subtitle) subtitle.textContent = '命书启卷';
    const btn = $('#mbpDecodeBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✦ 一键解读';
    }
    setDecodeStatus('接入原站 AI 批命接口，排盘后可一键生成。');
  }

  function saveProfile() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.profile));
    } catch (_) {}
  }

  function bindEvents() {
    $('#mbpBirthForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const [year, month, day] = $('#mbpDate').value.split('-').map((part) => Number.parseInt(part, 10));
      const [hour, minute] = $('#mbpTime').value.split(':').map((part) => Number.parseInt(part, 10));
      state.profile = normalizeProfile({
        year,
        month,
        day,
        hour,
        minute,
        gender: $('#mbpGender').value,
        city: $('#mbpCity').value,
      });
      state.chart = null;
      state.chartKey = '';
      state.decoded = false;
      state.aiResults = {};
      document.body.classList.remove('is-decoded');
      resetAiContent();
      saveProfile();
      renderChart();
      $('#chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#mbpDecodeBtn')?.addEventListener('click', () => {
      decodeReports();
      $('#specials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#mbpScrollReport')?.addEventListener('click', () => {
      $('#report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  updateForm();
  bindEvents();
  renderChart();
}());
