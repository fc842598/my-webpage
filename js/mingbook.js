(function () {
  const chapters = [
    { key: 'chart', no: '第一章', name: '命盘', icon: '☼' },
    { key: 'summary', no: '第二章', name: '总批', icon: '◒' },
    { key: 'special', no: '第三章', name: '专项', icon: '❖' },
    { key: 'fortune', no: '第四章', name: '大运', icon: '⌁' },
    { key: 'oracle', no: '第五章', name: '半仙', icon: '…' },
    { key: 'report', no: '第六章', name: '报告', icon: '▤' },
  ];

  const specials = [
    { key: 'body', label: '身宫', icon: '♙' },
    { key: 'marriage', label: '婚姻', icon: '♡' },
    { key: 'health', label: '健康', icon: '♥' },
    { key: 'wealth', label: '财运', icon: '♧' },
    { key: 'career', label: '事业', icon: '▣' },
  ];

  const profileStorageKey = 'yt_mingbook_profile_v1';
  const legacyHistoryKey = 'ziwei_local_chart_history_v1';
  const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const palaceOrder = ['巳', '午', '未', '申', '辰', '酉', '卯', '戌', '寅', '丑', '子', '亥'];
  const defaultProfile = {
    year: 1990,
    month: 5,
    day: 20,
    hour: 8,
    minute: 30,
    gender: 'male',
    city: '北京市 东城区',
  };
  const starProfiles = {
    '紫微': { trait: '主见强，重秩序与掌控，适合站到台前承担责任', career: '利管理、组织、大型平台与需要决策的位置', wealth: '财随地位与资源而来，重在守成与统筹', love: '择偶标准高，关系里需要尊重与安全感', risk: '忌过度要面子，需学会听取不同意见' },
    '天机': { trait: '思维快，善谋划，适合变化与信息密集的环境', career: '利策划、咨询、技术、研究和流程优化', wealth: '靠技能、信息差和灵活判断得财', love: '感情中容易想太多，需要稳定沟通', risk: '忌三心二意，先定方向再行动' },
    '太阳': { trait: '外向热心，重名誉与责任，愿意照顾他人', career: '利教育、公职、传播、医疗和对外服务', wealth: '财与名望、影响力、公开机会相关', love: '表达直接，但容易因忙事业忽略伴侣', risk: '忌过度消耗精力，需留意作息' },
    '武曲': { trait: '务实果断，重效率和结果，抗压能力强', career: '利财务、金融、工程、军警和执行管理', wealth: '理财意识强，适合靠专业和执行积累', love: '不善甜言，重行动和责任', risk: '忌太硬太急，合作中要留弹性' },
    '天同': { trait: '温和随缘，重生活感和情绪舒适', career: '利服务、文艺、教育、餐饮和照顾型行业', wealth: '财运平稳，但容易为享受花钱', love: '重温情与陪伴，关系需要主动经营', risk: '忌安逸拖延，关键处要主动推进' },
    '廉贞': { trait: '有魅力也有原则，竞争心强，情绪起伏明显', career: '利法律、管理、艺术、品牌和规则型事务', wealth: '财运有波动，适合控风险后再扩张', love: '桃花感强，关系里需减少试探', risk: '忌冲动和是非，先稳情绪再决策' },
    '天府': { trait: '稳健务实，重安全感和资源积累', career: '利行政、财务、审计、管理和守成型岗位', wealth: '财库稳，适合长期积累和稳健配置', love: '重承诺与现实保障，关系稳定为佳', risk: '忌过保守，机会来时要敢于落子' },
    '太阴': { trait: '细腻敏感，直觉强，适合幕后和审美型事务', career: '利设计、心理、文化、内容和精细管理', wealth: '适合慢慢积累，重隐性资产和稳定现金流', love: '感情含蓄深沉，需要被理解', risk: '忌情绪内耗，重要事要说清楚' },
    '贪狼': { trait: '社交强，兴趣广，欲望和创造力都旺', career: '利销售、公关、娱乐、品牌、流量和资源整合', wealth: '偏财机会多，但也容易因享乐破财', love: '桃花旺，关系里需保持边界', risk: '忌贪快贪多，选择比冲刺重要' },
    '巨门': { trait: '善分析表达，怀疑精神强，适合深度判断', career: '利法律、咨询、写作、教学、谈判和信息分析', wealth: '靠口才、知识和信息获财', love: '关系易有口舌，需减少反复质疑', risk: '忌言语过锋，沟通要留余地' },
    '天相': { trait: '正直守则，重信誉与协作，适合做可信赖的人', career: '利行政、顾问、监察、法务和服务管理', wealth: '正财稳定，靠信誉与能力积累', love: '重承诺和礼仪，适合稳定关系', risk: '忌太依赖规则，要保留灵活度' },
    '天梁': { trait: '有保护欲和责任感，重道义，能处理难题', career: '利医疗、公益、法律、咨询、教育和解难型事务', wealth: '财运平稳，常有贵人或缓冲', love: '愿照顾对方，但别承担过度', risk: '忌替人背太多压力，要分清边界' },
    '七杀': { trait: '独立果断，行动力强，不喜被束缚', career: '利创业、武职、体育、项目攻坚和开拓型岗位', wealth: '靠行动和风险判断得财，起伏也较明显', love: '感情直接强势，需要学会妥协', risk: '忌冲动硬碰，重要事先算代价' },
    '破军': { trait: '敢破旧局，变化力强，适合新赛道和重组', career: '利创业、改革、新兴行业和独立经营', wealth: '财运有破有立，适合先控成本再扩张', love: '关系不喜束缚，需要自由与信任', risk: '忌先破后想，行动前要留后路' },
  };

  const state = {
    chapter: new URLSearchParams(location.search).get('chapter') || 'chart',
    special: new URLSearchParams(location.search).get('special') || 'marriage',
    profile: readInitialProfile(),
    activeBranch: '',
    chart: null,
    norm: null,
    chartKey: '',
  };

  const chapterNav = document.getElementById('chapterNav');
  const chapterContent = document.getElementById('chapterContent');
  const chapterActions = document.getElementById('chapterActions');
  const actionsTitle = document.getElementById('actionsTitle');
  const actionNote = document.getElementById('actionNote');
  const specialTabs = document.getElementById('specialTabs');
  const toast = document.getElementById('toast');
  const editBirthBtn = document.getElementById('editBirthBtn');
  const birthDialog = document.getElementById('birthDialog');
  const closeBirthDialog = document.getElementById('closeBirthDialog');
  const cancelBirthDialog = document.getElementById('cancelBirthDialog');

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function clampNumber(value, min, max, fallback) {
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return fallback;
    return Math.min(max, Math.max(min, num));
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
      const raw = localStorage.getItem(profileStorageKey);
      return raw ? normalizeProfile(JSON.parse(raw)) : null;
    } catch (_) {
      return null;
    }
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

  function indexToHour(index) {
    const idx = clampNumber(index, 0, 11, 4);
    return idx === 0 ? 0 : idx * 2;
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    } catch (_) {}
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
    return {
      ...profile,
      dateStr: dateStr(profile),
      cstHour: profile.hour,
      cstMinute: profile.minute,
      timeIdx,
      calMode: 'solar',
      calModeLabel: `公历 ${dateStr(profile)}`,
      tstResult,
    };
  }

  function getAstroLib() {
    return window.iztro?.astro || window.iztro || null;
  }

  function profileKey(profile) {
    return [
      profile.year,
      profile.month,
      profile.day,
      profile.hour,
      profile.minute,
      profile.gender,
      profile.city,
    ].join('|');
  }

  function getChartBundle() {
    const key = profileKey(state.profile);
    if (state.chart && state.chartKey === key) {
      return { chart: state.chart, norm: state.norm };
    }

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
      window._mingbookChart = chart;
      window._mingbookChartInputs = { dateStr: norm.dateStr, timeIdx: norm.timeIdx, gender: state.profile.gender, norm };
      window._chart = chart;
      window._chartInputs = window._mingbookChartInputs;
      return { chart, norm };
    } catch (error) {
      return { error: error.message || '命盘生成失败，请检查出生信息。' };
    }
  }

  function starText(star) {
    if (!star) return '';
    const name = star.name || star;
    const brightness = star.brightness ? ` ${star.brightness}` : '';
    const mutagen = star.mutagen ? ` ${star.mutagen}` : '';
    return `${name}${brightness}${mutagen}`.trim();
  }

  function starChips(stars = [], limit = 6) {
    const list = stars.slice(0, limit).map((star) => `<span>${escapeHtml(starText(star))}</span>`).join('');
    return list || '<span class="muted">空宫</span>';
  }

  function allSmallStars(palace) {
    return [
      ...(palace?.minorStars || []),
      ...(palace?.adjectiveStars || palace?.adjStars || []),
    ];
  }

  function orderedPalaces(chart) {
    const palaces = chart?.palaces || [];
    return palaceOrder
      .map((branch) => palaces.find((item) => item.earthlyBranch === branch))
      .filter(Boolean);
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

  function shichenLabel(norm) {
    return shichenNames[norm?.timeIdx] || '辰';
  }

  function updateBirthSummary(bundle) {
    const main = document.querySelector('.yt-birth-main');
    const sub = document.querySelector('.yt-birth-sub');
    if (!main || !sub) return;
    const profile = state.profile;
    const genderText = profile.gender === 'male' ? '男' : '女';
    main.innerHTML = `
      <span>${profile.year}年${pad2(profile.month)}月${pad2(profile.day)}日</span>
      <span>${pad2(profile.hour)}:${pad2(profile.minute)}</span>
      <b>阳历</b>
      <span>${genderText}</span>
      <span>${escapeHtml(profile.city)}</span>
    `;
    if (bundle?.chart && bundle?.norm) {
      const tst = bundle.norm.tstResult;
      const tstText = tst ? `真太阳时 ${pad2(tst.trueSolarHour)}:${pad2(tst.trueSolarMinute)}` : '未校正真太阳时';
      sub.textContent = `${bundle.chart.chineseDate || bundle.chart.lunarDate || '农历信息'} ${shichenLabel(bundle.norm)}时（${tstText}）`;
    } else {
      sub.textContent = '命盘信息待生成';
    }
  }

  function renderPalaceCell(palace, activeBranch) {
    const isActive = palace.earthlyBranch === activeBranch;
    const isLife = palace.name === '命宫' || palace.name === '命';
    const isBody = !!palace.isBodyPalace;
    const age = palace.decadal?.range ? `${palace.decadal.range[0]}-${palace.decadal.range[1]}岁` : '';
    const major = (palace.majorStars || []).map(starText).filter(Boolean).slice(0, 3).join('、') || '空宫';
    return `
      <button class="real-palace-cell ${isActive ? 'active' : ''} ${isLife ? 'is-life' : ''}" type="button" data-palace-branch="${palace.earthlyBranch}">
        <span class="real-palace-head"><b>${escapeHtml(palace.name || '')}</b><em>${escapeHtml((palace.heavenlyStem || '') + (palace.earthlyBranch || ''))}</em></span>
        <strong>${escapeHtml(major)}</strong>
        <span>${escapeHtml(age)}${isBody ? ' · 身宫' : ''}</span>
      </button>
    `;
  }

  function renderPalaceDetail(palace, chart) {
    if (!palace) return '<section class="palace-detail-panel"><h2>宫位详情</h2><p>点击左侧宫位查看细节。</p></section>';
    const age = palace.decadal?.range ? `${palace.decadal.range[0]}-${palace.decadal.range[1]}岁` : '未标注';
    const bodyPalace = findBodyPalace(chart);
    return `
      <section class="palace-detail-panel">
        <div class="detail-title-row">
          <span>${escapeHtml((palace.heavenlyStem || '') + (palace.earthlyBranch || ''))}</span>
          <h2>${escapeHtml(palace.name || '宫位')}</h2>
          <b>${escapeHtml(age)}</b>
        </div>
        <div class="star-chip-row major">${starChips(palace.majorStars || [], 8)}</div>
        <div class="star-chip-row">${starChips(allSmallStars(palace), 12)}</div>
        <div class="palace-facts">
          <div><span>命主</span><strong>${escapeHtml(chart.soul || '未见')}</strong></div>
          <div><span>身主</span><strong>${escapeHtml(chart.body || '未见')}</strong></div>
          <div><span>五行局</span><strong>${escapeHtml(chart.fiveElementsClass || '未见')}</strong></div>
          <div><span>身宫</span><strong>${escapeHtml(bodyPalace?.name || '未见')}</strong></div>
        </div>
        <p class="palace-note">已接入真实排盘数据。点击任一宫位，可在这里查看主星、辅星、宫位和大限信息。</p>
      </section>
    `;
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

  function allReadableStars(palace) {
    return [
      ...(palace?.majorStars || []),
      ...(palace?.minorStars || []),
      ...(palace?.adjectiveStars || palace?.adjStars || []),
    ];
  }

  function mutagenText(palace) {
    return allReadableStars(palace)
      .filter((star) => star?.mutagen)
      .map((star) => `${star.name}${star.mutagen}`);
  }

  function allMutagens(chart) {
    return (chart?.palaces || []).flatMap((palace) =>
      allReadableStars(palace)
        .filter((star) => star?.mutagen)
        .map((star) => `${palace.name}${star.mutagen}(${star.name})`)
    );
  }

  function hasStar(palace, name) {
    return allReadableStars(palace).some((star) => String(star.name || star).includes(name));
  }

  function palaceMainLabel(palace) {
    const names = majorNames(palace);
    return names.length ? names.join('、') : '空宫';
  }

  function palaceAge(palace) {
    return palace?.decadal?.range ? `${palace.decadal.range[0]}-${palace.decadal.range[1]}岁` : '大限未标注';
  }

  function firstProfile(palace) {
    return starProfiles[majorNames(palace)[0]] || null;
  }

  function compactSentence(text, fallback) {
    const value = String(text || fallback || '').trim();
    return value.endsWith('。') ? value : `${value}。`;
  }

  function buildSummaryData(chart) {
    const life = findLifePalace(chart);
    const body = findBodyPalace(chart);
    const career = findPalaceByName(chart, '官禄');
    const wealth = findPalaceByName(chart, '财帛');
    const love = findPalaceByName(chart, '夫妻');
    const travel = findPalaceByName(chart, '迁移');
    const lifeProfile = firstProfile(life);
    const careerProfile = firstProfile(career);
    const wealthProfile = firstProfile(wealth);
    const loveProfile = firstProfile(love);
    const mutagens = allMutagens(chart);
    const ji = mutagens.filter((item) => item.includes('化忌'));

    const overview = [
      chart.zodiac ? `${chart.zodiac}年生` : '',
      chart.fiveElementsClass || '',
      `命宫${life?.earthlyBranch || '未见'}`,
      body ? `身宫落${body.name}` : '',
    ].filter(Boolean).join(' · ');

    const points = [
      ['命盘总览', `${overview}。命宫主星${palaceMainLabel(life)}，身宫主星${palaceMainLabel(body)}。`],
      ['先天格局', `${lifeProfile ? lifeProfile.trait : '命宫空宫，需借三方四正与对宫综合定性'}。${mutagens.length ? `生年四化见${mutagens.slice(0, 4).join('、')}。` : '四化不显，格局看宫位组合。'}`],
      ['性格特质', `${lifeProfile ? lifeProfile.trait : '适应力强，但主线需要后天沉淀'}${hasStar(life, '文昌') || hasStar(life, '文曲') ? '，带文昌文曲，表达与学习力更强' : ''}${hasStar(life, '左辅') || hasStar(life, '右弼') ? '，有辅弼贵人助力' : ''}。`],
      ['事业财运', `官禄宫${palaceMainLabel(career)}：${careerProfile ? careerProfile.career : '事业方向宜结合命宫与迁移宫判断'}。财帛宫${palaceMainLabel(wealth)}：${wealthProfile ? wealthProfile.wealth : '财运重在稳定规划'}。`],
      ['感情婚姻', `夫妻宫${palaceMainLabel(love)}：${loveProfile ? loveProfile.love : '感情需要主动经营与清晰沟通'}。${mutagenText(love).length ? `夫妻宫四化：${mutagenText(love).join('、')}。` : ''}`],
      ['关键提醒', ji.length ? `化忌落点：${ji.join('、')}，对应领域少冲动、多复盘。` : compactSentence(lifeProfile?.risk, '当前命盘阻滞不重，但仍需结合大运看节奏')],
    ];

    const evidence = [
      ['命宫依据', `${life?.heavenlyStem || ''}${life?.earthlyBranch || ''} · ${palaceMainLabel(life)} · ${palaceAge(life)}`],
      ['身宫依据', body ? `${body.name} · ${body.heavenlyStem || ''}${body.earthlyBranch || ''} · ${palaceMainLabel(body)}` : '身宫未见，先按命宫与三方四正判断。'],
      ['事业财帛', `官禄${palaceMainLabel(career)}；财帛${palaceMainLabel(wealth)}。`],
      ['感情迁移', `夫妻${palaceMainLabel(love)}；迁移${palaceMainLabel(travel)}。`],
      ['四化分布', mutagens.length ? mutagens.join('、') : '未读取到明显生年四化。'],
    ];

    return { points, evidence, life, body, career, wealth, love, mutagens };
  }

  function fillBirthForm() {
    const map = {
      mbYear: state.profile.year,
      mbMonth: state.profile.month,
      mbDay: state.profile.day,
      mbHour: state.profile.hour,
      mbMinute: state.profile.minute,
      mbGender: state.profile.gender,
      mbCity: state.profile.city,
    };
    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });
  }

  function openBirthDialog() {
    fillBirthForm();
    if (birthDialog?.showModal) birthDialog.showModal();
    else birthDialog?.setAttribute('open', '');
  }

  function closeBirthDialogBox() {
    if (birthDialog?.close) birthDialog.close();
    else birthDialog?.removeAttribute('open');
  }

  function setChapter(key) {
    state.chapter = key;
    render();
  }

  function setSpecial(key) {
    state.special = key;
    state.chapter = 'special';
    render();
  }

  function toastText(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function button(label, target, extraClass = '') {
    return `<button class="${extraClass}" type="button" data-chapter="${target}">${label}</button>`;
  }

  function renderNav() {
    chapterNav.innerHTML = chapters.map((item) => `
      <button class="yt-chapter-btn" type="button" data-chapter="${item.key}" aria-current="${item.key === state.chapter ? 'page' : 'false'}">
        <span class="yt-chapter-icon">${item.icon}</span>
        <span>
          <span class="yt-chapter-kicker">${item.no}</span>
          <span class="yt-chapter-name">${item.name}</span>
        </span>
      </button>
    `).join('');
  }

  function renderSpecialTabs() {
    specialTabs.innerHTML = specials.map((item) => `
      <button type="button" data-special="${item.key}" aria-pressed="${item.key === state.special}">
        ${item.icon}　${item.label}
      </button>
    `).join('');
  }

  function paperHead(stamp, title, subtitle) {
    return `
      <span class="paper-stamp">${stamp}</span>
      <h1 class="paper-title">${title}</h1>
      <p class="paper-subtitle">${subtitle}</p>
    `;
  }

  function renderChart() {
    const bundle = getChartBundle();
    if (bundle.error) {
      return `
        ${paperHead('第一章 · 命盘', '紫微命盘', '先把出生信息校准，再进入命书阅读。')}
        <section class="chart-error">
          <h2>命盘暂未生成</h2>
          <p>${escapeHtml(bundle.error)}</p>
          <button type="button" class="paper-cta" id="openBirthFromError">编辑出生信息</button>
        </section>
      `;
    }

    const { chart, norm } = bundle;
    const palaces = orderedPalaces(chart);
    const lifePalace = findLifePalace(chart);
    if (!state.activeBranch) state.activeBranch = lifePalace?.earthlyBranch || palaces[0]?.earthlyBranch || '';
    const activePalace = palaces.find((item) => item.earthlyBranch === state.activeBranch) || lifePalace;
    const bodyPalace = findBodyPalace(chart);
    const meta = [
      `${state.profile.gender === 'male' ? '男命' : '女命'}`,
      `${chart.fiveElementsClass || '五行局待定'}`,
      `命宫${lifePalace?.earthlyBranch || '未见'}`,
      `身宫${bodyPalace?.earthlyBranch || '未见'}`,
    ].join(' · ');

    return `
      ${paperHead('第一章 · 命盘', '紫微命盘', '真实排盘已接入，先看十二宫结构，再展开各宫细节。')}
      <div class="chart-profile-line">
        <span>${escapeHtml(meta)}</span>
        <span>公历 ${escapeHtml(norm.dateStr)} · ${shichenLabel(norm)}时</span>
      </div>
      <div class="mingpan-grid mingpan-grid-real">
        <section class="palace-mini real-palace-board">
          <div class="board-head">
            <h2>十二宫命盘</h2>
            <p>${escapeHtml(chart.chineseDate || chart.lunarDate || '农历信息未见')}</p>
          </div>
          <div class="real-palace-grid">
            ${palaces.map((palace) => renderPalaceCell(palace, state.activeBranch)).join('')}
          </div>
        </section>
        ${renderPalaceDetail(activePalace, chart)}
      </div>
    `;
  }

  function renderSummary() {
    const bundle = getChartBundle();
    if (bundle.error) {
      return `
        ${paperHead('第二章 · 总批', 'AI 整体批命', '先生成命盘，再读取总批。')}
        <section class="chart-error">
          <h2>总批暂未生成</h2>
          <p>${escapeHtml(bundle.error)}</p>
          <button type="button" class="paper-cta" id="openBirthFromError">编辑出生信息</button>
        </section>
      `;
    }
    const { chart } = bundle;
    const summary = buildSummaryData(chart);
    const lifeName = palaceMainLabel(summary.life);
    const bodyName = palaceMainLabel(summary.body);
    return `
      ${paperHead('第二章 · 总批', 'AI 整体批命', '先天格局 · 人生底色 · 命运趋势')}
      <div class="summary-meta-strip">
        <span><b>命宫</b>${escapeHtml(lifeName)}</span>
        <span><b>身宫</b>${escapeHtml(summary.body?.name || '未见')} · ${escapeHtml(bodyName)}</span>
        <span><b>四化</b>${summary.mutagens.length ? `${summary.mutagens.length}处` : '未显'}</span>
      </div>
      <div class="summary-grid">
        <section class="key-points">
          ${summary.points.map((item) => `
            <div class="key-point">
              <span>◇</span>
              <div><b>${escapeHtml(item[0])}</b><p>${escapeHtml(item[1])}</p></div>
            </div>
          `).join('')}
        </section>
        <aside class="evidence-panel">
          <h3>批命依据</h3>
          ${summary.evidence.map((item) => `<div class="evidence-card"><strong>${escapeHtml(item[0])}</strong><p>${escapeHtml(item[1])}</p></div>`).join('')}
        </aside>
      </div>
      <a class="paper-cta" href="#" data-chapter="special">继续看第三章 · 专项</a>
    `;
  }

  function renderSpecial() {
    const current = specials.find((item) => item.key === state.special) || specials[1];
    const detailMap = {
      body: ['身宫深度解析', '洞察自我本质与内在能量格局。'],
      marriage: ['婚姻深度解析', '解读情感模式、配偶特质与婚姻关系走向。'],
      health: ['健康深度解析', '关注身体状态、调理方向与生活节奏。'],
      wealth: ['财运深度解析', '分析财富层次、赚钱能力与风险提示。'],
      career: ['事业深度解析', '判断事业方向、职业优势与发展路径。'],
    };
    return `
      ${paperHead('第三章 · 专项', detailMap[current.key][0], detailMap[current.key][1])}
      <div class="special-overview">
        ${specials.map((item) => `
          <button class="special-card" type="button" data-special="${item.key}">
            <span class="special-icon">${item.icon}</span>
            <strong>${item.label}</strong>
            <p>${detailMap[item.key][1]}</p>
          </button>
        `).join('')}
      </div>
      <section class="fortune-detail" style="margin-top:24px">
        <div>
          <h2>${detailMap[current.key][0]}</h2>
          <p>本页聚合命盘、流年与专项宫位，先看核心判断，再结合右侧动作继续追问或生成报告。</p>
        </div>
        <aside class="evidence-panel">
          <h3>命盘依据</h3>
          <div class="evidence-card"><strong>核心宫位</strong><p>命宫、身宫、对应专项宫位。</p></div>
          <div class="evidence-card"><strong>阅读建议</strong><p>先看重点，再进入对应专项深读。</p></div>
        </aside>
      </section>
    `;
  }

  function renderFortune() {
    return `
      ${paperHead('第四章 · 大运', '大运流年', '十年一势 · 一年一落点')}
      <div class="fortune-years">
        ${['13-22 天机', '23-32 太阳', '33-42 武曲', '43-52 天同', '53-62 廉贞', '63-72 天府']
          .map((item, index) => `<div class="fortune-card ${index === 2 ? 'active' : ''}"><strong>${item}</strong><p>${index === 2 ? '86分' : '待批'}</p></div>`).join('')}
      </div>
      <section class="fortune-detail">
        <div>
          <h2>当前大运：33-42岁 · 武曲</h2>
          <p>事业上升、资源整合与执行突破。2025-2027 为重要窗口，适合主动争取、提高决策密度。</p>
          <p>风险在于节奏过急、健康消耗与人际摩擦，宜稳中求进。</p>
        </div>
        <aside class="evidence-panel">
          <h3>大运依据</h3>
          <div class="evidence-card"><strong>AI评分</strong><p>86分，机会强。</p></div>
          <div class="evidence-card"><strong>未来三年</strong><p>2025破局，2026沉淀，2027推进。</p></div>
        </aside>
      </section>
      <a class="paper-cta" href="#" data-chapter="report">生成深度报告</a>
    `;
  }

  function renderOracle() {
    return `
      <section class="chat-page">
        <div>
          ${paperHead('第五章 · 半仙', '许半仙追问', '我会记住你的命盘，一步步陪你把人生看清楚')}
          <div class="memory-row">
            <div class="memory-card"><strong>命盘摘要</strong><p>日主壬水，格局中上。</p></div>
            <div class="memory-card"><strong>当前大运</strong><p>33-42岁 · 武曲大运。</p></div>
            <div class="memory-card"><strong>最近解读</strong><p>事业、婚姻、流年节点。</p></div>
          </div>
        </div>
        <div class="chat-log" id="chatLog">
          <div class="chat-msg">
            <span class="chat-avatar">仙</span>
            <p class="chat-bubble">命盘我已经记下。你想先问感情、事业，还是今年运势？</p>
          </div>
          <div class="chat-msg">
            <span class="chat-avatar">你</span>
            <p class="chat-bubble">我今年事业上会有突破吗？</p>
          </div>
          <div class="chat-msg">
            <span class="chat-avatar">仙</span>
            <p class="chat-bubble">今年事业有机会，但要避免急进。先稳住核心项目，再扩大合作。</p>
          </div>
        </div>
        <form class="ask-row" id="askForm">
          <input id="askInput" autocomplete="off" placeholder="继续追问你的命盘...">
          <button class="ask-send" type="submit">›</button>
        </form>
      </section>
    `;
  }

  function renderReport() {
    const rows = [
      ['第一章', '命盘总览', '命盘结构、四化分布、五行能量、先天优势与不足'],
      ['第二章', '先天格局', '格局层次、喜用神、人生底色、命运主线'],
      ['第三章', '感情婚姻', '感情模式、配偶特质、婚姻走势、关键时间点'],
      ['第四章', '事业财运', '职业方向、事业发展、财富格局、贵人助力'],
      ['第五章', '大运流年', '十年大运走势、流年关键节点、运势起伏'],
      ['第六章', '未来建议', '人生策略、风险规避、行动指南、提升建议'],
    ];
    return `
      ${paperHead('第六章 · 报告', '命主深度报告', '一份关于你命运的完整解读')}
      <div class="report-list">
        ${rows.map((row) => `
          <button class="report-row" type="button" data-toast="${row[2]}">
            <span>▣</span>
            <strong>${row[1]}</strong>
            <small>${row[2]}</small>
            <span>∨</span>
          </button>
        `).join('')}
      </div>
      <a class="paper-cta" href="#" data-toast="正在整理命书报告内容">生成深度报告</a>
    `;
  }

  const renderers = {
    chart: renderChart,
    summary: renderSummary,
    special: renderSpecial,
    fortune: renderFortune,
    oracle: renderOracle,
    report: renderReport,
  };

  function renderActions() {
    const actionMap = {
      chart: [
        ['summary', '继续看总批', '进入 AI 整体批命', '↗'],
        ['oracle', '不知道时辰', '打开天纪推时辰', '?'],
        ['report', '生成深度报告', '补全后生成报告', '▤'],
      ],
      summary: [
        ['fortune', '继续看大运', '进入人生运势线', '↗'],
        ['report', '生成深度报告', '生成完整报告', '▤'],
      ],
      special: [
        ['special:marriage', '先看婚姻', '了解感情模式与婚姻缘分', '♡'],
        ['special:career', '事业财运', '把握事业方向和财力潜能', '▣'],
        ['summary', '返回总批', '回到第二章 AI整体批命', '↺'],
      ],
      fortune: [
        ['report', 'AI批整组大运', '十年运势展开', '⌁'],
        ['report', '看人生曲线', '掌握高低起伏', '↗'],
      ],
      oracle: [
        ['report', '生成深度报告', '整合问答结果', '▤'],
        ['summary', '回看总批', '查看整体命局解读', '↺'],
        ['fortune', '查看大运', '验证运势走势', '⌁'],
      ],
      report: [
        ['report', '全面报告', '全维度命书内容', '♛'],
        ['special:marriage', '感情重点', '聚焦婚姻问题', '♡'],
        ['special:career', '事业财运重点', '聚焦事业财富方向', '▣'],
      ],
    };
    const list = actionMap[state.chapter] || actionMap.chart;
    actionsTitle.textContent = state.chapter === 'special' ? '推荐先看' : '后续动作';
    actionNote.textContent = state.chapter === 'report'
      ? '报告页汇总六章重点，适合最后统一查看。'
      : '按章节阅读命书，重要内容可继续追问或生成报告。';
    chapterActions.innerHTML = list.map((item, index) => `
      <button class="yt-action ${index === 0 ? 'primary' : ''}" type="button" data-action="${item[0]}">
        <span class="yt-action-icon">${item[3]}</span>
        <span><strong>${item[1]}</strong><span>${item[2]}</span></span>
        <b>›</b>
      </button>
    `).join('');
  }

  function updateUrl() {
    const params = new URLSearchParams({
      chapter: state.chapter,
      special: state.special,
      year: String(state.profile.year),
      month: String(state.profile.month),
      day: String(state.profile.day),
      hour: String(state.profile.hour),
      minute: String(state.profile.minute),
      gender: state.profile.gender,
      city: state.profile.city,
    });
    history.replaceState(null, '', `?${params.toString()}`);
  }

  function render() {
    if (!renderers[state.chapter]) state.chapter = 'chart';
    const bundle = getChartBundle();
    updateBirthSummary(bundle);
    renderNav();
    renderSpecialTabs();
    chapterContent.classList.toggle('scrollable', state.chapter === 'special' || state.chapter === 'oracle' || state.chapter === 'chart');
    chapterContent.innerHTML = renderers[state.chapter]();
    renderActions();
    updateUrl();
  }

  document.addEventListener('click', (event) => {
    const palaceTarget = event.target.closest('[data-palace-branch]');
    if (palaceTarget) {
      event.preventDefault();
      state.activeBranch = palaceTarget.dataset.palaceBranch;
      render();
      return;
    }
    if (event.target.closest('#openBirthFromError')) {
      event.preventDefault();
      openBirthDialog();
      return;
    }
    const chapterTarget = event.target.closest('[data-chapter]');
    if (chapterTarget) {
      event.preventDefault();
      setChapter(chapterTarget.dataset.chapter);
      return;
    }
    const specialTarget = event.target.closest('[data-special]');
    if (specialTarget) {
      event.preventDefault();
      setSpecial(specialTarget.dataset.special);
      return;
    }
    const actionTarget = event.target.closest('[data-action]');
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action.startsWith('special:')) setSpecial(action.split(':')[1]);
      else setChapter(action);
      return;
    }
    const toastTarget = event.target.closest('[data-toast]');
    if (toastTarget) {
      event.preventDefault();
      toastText(toastTarget.dataset.toast);
    }
  });

  editBirthBtn?.addEventListener('click', openBirthDialog);
  closeBirthDialog?.addEventListener('click', closeBirthDialogBox);
  cancelBirthDialog?.addEventListener('click', closeBirthDialogBox);
  birthDialog?.addEventListener('click', (event) => {
    if (event.target === birthDialog) closeBirthDialogBox();
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'birthForm') {
      event.preventDefault();
      const nextProfile = normalizeProfile({
        year: document.getElementById('mbYear')?.value,
        month: document.getElementById('mbMonth')?.value,
        day: document.getElementById('mbDay')?.value,
        hour: document.getElementById('mbHour')?.value,
        minute: document.getElementById('mbMinute')?.value,
        gender: document.getElementById('mbGender')?.value,
        city: document.getElementById('mbCity')?.value,
      });
      state.profile = nextProfile;
      state.activeBranch = '';
      state.chart = null;
      state.norm = null;
      state.chartKey = '';
      state.chapter = 'chart';
      saveProfile(nextProfile);
      closeBirthDialogBox();
      render();
      toastText('第一章命盘已重新生成');
      return;
    }
    if (event.target.id !== 'askForm') return;
    event.preventDefault();
    const input = document.getElementById('askInput');
    if (!input || !input.value.trim()) return;
    toastText('半仙已收到你的追问');
    input.value = '';
  });

  render();
})();
