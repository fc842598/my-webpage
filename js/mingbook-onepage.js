(function () {
  const storageKey = 'yt_mingbook_onepage_profile_v1';
  const legacyHistoryKey = 'yt_zw_history_v1';
  const palaceOrder = ['巳', '午', '未', '申', '辰', null, null, '酉', '卯', null, null, '戌', '寅', '丑', '子', '亥'];
  const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const defaultProfile = { name: '', year: 1990, month: 8, day: 16, hour: 12, minute: 0, gender: 'male', city: '北京市 东城区', cityName: '北京市 东城区' };
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
  let formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
  let selectedCity = null;

  const aiTasks = [
    { module: 'overall', label: '整体批命' },
    { module: 'current_luck', label: '大限流年' },
    { module: 'shengong', key: 'body', label: '身宫批命' },
    { module: 'hunyin', key: 'marriage', label: '婚姻批命' },
    { module: 'jiankang', key: 'health', label: '健康批命' },
    { module: 'caiyun', key: 'wealth', label: '财运批命' },
    { module: 'shiye', key: 'career', label: '事业批命' },
  ];

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
    const cityObj = input.city && typeof input.city === 'object' ? input.city : null;
    const cityName = String(input.cityName || cityObj?.name || cityObj?.cityName || input.city || defaultProfile.city).trim() || defaultProfile.city;
    return {
      name: String(input.name || '').trim(),
      year: clampNumber(input.year, 1900, 2030, defaultProfile.year),
      month: clampNumber(input.month, 1, 12, defaultProfile.month),
      day: clampNumber(input.day, 1, 31, defaultProfile.day),
      hour: clampNumber(input.hour ?? input.cstHour, 0, 23, defaultProfile.hour),
      minute: clampNumber(input.minute ?? input.cstMinute, 0, 59, defaultProfile.minute),
      gender: input.gender === 'female' || input.gender === '女' ? 'female' : 'male',
      city: cityName,
      cityName,
      cityProvince: String(input.cityProvince || cityObj?.province || '').trim(),
      cityShort: String(input.cityShort || cityObj?.city || '').trim(),
      cityLon: Number.isFinite(Number(input.cityLon ?? cityObj?.lon)) ? Number(input.cityLon ?? cityObj?.lon) : null,
      cityLat: Number.isFinite(Number(input.cityLat ?? cityObj?.lat)) ? Number(input.cityLat ?? cityObj?.lat) : null,
      cityTz: Number.isFinite(Number(input.cityTz ?? cityObj?.tzOffset)) ? Number(input.cityTz ?? cityObj?.tzOffset) : 8,
      isLunar: !!input.isLunar,
      lunarYear: input.lunarYear ? clampNumber(input.lunarYear, 1900, 2030, input.lunarYear) : null,
      lunarMonth: input.lunarMonth ? clampNumber(input.lunarMonth, 1, 12, input.lunarMonth) : null,
      lunarDay: input.lunarDay ? clampNumber(input.lunarDay, 1, 30, input.lunarDay) : null,
      lunarLeap: !!input.lunarLeap,
      calModeLabel: input.calModeLabel || '',
      lunarLabel: input.lunarLabel || '',
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
      name: params.get('name'),
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

  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function setOptions(select, values, placeholder) {
    if (!select) return;
    const current = String(select.value || '');
    select.innerHTML = `<option value="">${placeholder}</option>` + values.map((item) => {
      const value = Array.isArray(item) ? item[0] : item;
      const label = Array.isArray(item) ? item[1] : item;
      return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    }).join('');
    if ([...select.options].some((option) => option.value === current)) select.value = current;
  }

  function populateFormControls() {
    setOptions($('#mbpMonth'), Array.from({ length: 12 }, (_, index) => [index + 1, `${index + 1}月`]), '月');
    setOptions($('#mbpLunarMonth'), ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'].map((label, index) => [index + 1, label]), '月');
    setOptions($('#mbpHour'), Array.from({ length: 24 }, (_, hour) => [hour, pad2(hour)]), '时');
    setOptions($('#mbpMinute'), Array.from({ length: 60 }, (_, minute) => [minute, pad2(minute)]), '分');
    refreshDayOptions();
    refreshLunarDayOptions();
  }

  function refreshDayOptions() {
    const year = Number($('#mbpYear')?.value || state.profile.year);
    const month = Number($('#mbpMonth')?.value || state.profile.month);
    setOptions($('#mbpDay'), Array.from({ length: daysInMonth(year, month) }, (_, index) => [index + 1, `${index + 1}日`]), '日');
  }

  function refreshLunarDayOptions() {
    const labels = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    setOptions($('#mbpLunarDay'), labels.map((label, index) => [index + 1, label]), '日');
  }

  function formatCityLabel(city) {
    if (!city) return '';
    return city.province === city.city ? `中国-${city.city}` : `${city.province}-${city.city}`;
  }

  function cityFromRow(row) {
    if (!row) return null;
    return { province: row[0], city: row[1], name: `${row[0]} ${row[1]}`, lon: Number(row[2]), lat: Number(row[3]), tzOffset: Number(row[4] ?? 8) };
  }

  function findCity(query) {
    const q = String(query || '').trim().toLowerCase();
    const list = typeof CITIES !== 'undefined' ? CITIES : (window.CITIES || globalThis.CITIES);
    if (!q || !Array.isArray(list)) return null;
    const compact = q.replace(/\s|·|-/g, '');
    const found = list.find((row) => {
      const province = String(row[0]).toLowerCase();
      const city = String(row[1]).toLowerCase();
      const text = `${province}${city} ${province} ${city}`;
      const rowCompact = `${province}${city}`.replace(/\s/g, '');
      const cityCompact = city.replace(/\s/g, '');
      return text.includes(q)
        || text.replace(/\s/g, '').includes(compact)
        || compact.includes(rowCompact)
        || (cityCompact.length >= 2 && compact.includes(cityCompact));
    });
    return cityFromRow(found);
  }

  function applySelectedCity(city) {
    selectedCity = city || null;
    const input = $('#mbpCitySearch');
    const clear = $('#mbpClearCity');
    const selected = $('#mbpCitySelected');
    if (input) input.value = city ? `${city.province} · ${city.city}` : '';
    if (clear) clear.style.display = city ? '' : 'none';
    if (selected) selected.style.display = city ? 'block' : 'none';
    if (city) {
      $('#mbpCitySelectedName').textContent = formatCityLabel(city);
      $('#mbpCityLon').textContent = Number(city.lon).toFixed(2);
      $('#mbpCityLat').textContent = Number(city.lat).toFixed(2);
    }
    updateTrueSolarPreview();
  }

  function setCalMode(mode) {
    formCalMode = mode;
    document.querySelectorAll('.nf-cal-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.cal === mode));
    const isLunar = mode === 'lunar';
    const isAi = mode === 'ai';
    $('#mbpSolarInputs').style.display = isLunar ? 'none' : '';
    $('#mbpLunarInputs').style.display = isLunar ? '' : 'none';
    $('#mbpAiInlineWrap').style.display = isAi ? 'block' : 'none';
    updateDatePreview();
  }

  function solarFromForm() {
    if (formCalMode === 'lunar') {
      const lunarYear = Number($('#mbpLunarYear')?.value);
      const lunarMonth = Number($('#mbpLunarMonth')?.value);
      const lunarDay = Number($('#mbpLunarDay')?.value);
      const lunarLeap = !!$('#mbpLunarLeap')?.checked;
      if (!lunarYear || !lunarMonth || !lunarDay) return { error: '请填写完整的农历出生年、月、日' };
      if (typeof lunarToSolar !== 'function') return { error: '农历转换模块未加载，请刷新后重试' };
      const solar = lunarToSolar(lunarYear, lunarMonth, lunarDay, lunarLeap);
      if (!solar) return { error: '农历日期无效或超出支持范围' };
      const lunarObj = { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: lunarLeap };
      return {
        year: solar.getFullYear(),
        month: solar.getMonth() + 1,
        day: solar.getDate(),
        isLunar: true,
        lunarYear,
        lunarMonth,
        lunarDay,
        lunarLeap,
        lunarLabel: typeof formatLunarDate === 'function' ? formatLunarDate(lunarObj) : `${lunarYear}年${lunarMonth}月${lunarDay}日`,
        calModeLabel: `农历 ${typeof formatLunarDate === 'function' ? formatLunarDate(lunarObj) : `${lunarYear}年${lunarMonth}月${lunarDay}日`}（公历 ${solar.getFullYear()}-${pad2(solar.getMonth() + 1)}-${pad2(solar.getDate())}）`,
      };
    }
    const year = Number($('#mbpYear')?.value);
    const month = Number($('#mbpMonth')?.value);
    const day = Number($('#mbpDay')?.value);
    if (!year || !month || !day) return { error: '请填写完整的出生年、月、日' };
    if (year < 1900 || year > 2030) return { error: '出生年份请填写 1900-2030' };
    return {
      year,
      month,
      day,
      isLunar: false,
      calModeLabel: `公历 ${year}-${pad2(month)}-${pad2(day)}`,
    };
  }

  function updateDatePreview() {
    const preview = $('#mbpDatePreview');
    if (!preview) return;
    const data = solarFromForm();
    if (data.error) {
      preview.textContent = '';
    } else if (data.isLunar) {
      preview.textContent = `公历: ${data.year}-${pad2(data.month)}-${pad2(data.day)}`;
    } else if (typeof solarToLunar === 'function') {
      const lunar = solarToLunar(data.year, data.month, data.day);
      preview.textContent = lunar ? `农历: ${typeof formatLunarDate === 'function' ? formatLunarDate(lunar) : ''}` : '';
    } else {
      preview.textContent = '';
    }
    updateTrueSolarPreview();
  }

  function updateLunarLeapState() {
    const year = Number($('#mbpLunarYear')?.value);
    const month = Number($('#mbpLunarMonth')?.value);
    let leapMonth = 0;
    if (window.LunarYear && typeof window.LunarYear.fromYear === 'function' && year) {
      try {
        leapMonth = Math.abs(Number(window.LunarYear.fromYear(year)?.getLeapMonth?.())) || 0;
      } catch (_) {
        leapMonth = 0;
      }
    }
    const wrap = $('#mbpLunarLeapWrap');
    const note = $('#mbpLunarLeapNote');
    const checkbox = $('#mbpLunarLeap');
    const enabled = !!(leapMonth && month === leapMonth);
    if (wrap) wrap.style.opacity = enabled ? '1' : '.55';
    if (checkbox && !enabled) checkbox.checked = false;
    if (note) note.textContent = leapMonth ? (enabled ? '可选闰月' : `闰${leapMonth}月`) : '无闰月';
  }

  function formTime() {
    return {
      hour: clampNumber($('#mbpHour')?.value, 0, 23, state.profile.hour),
      minute: clampNumber($('#mbpMinute')?.value, 0, 59, state.profile.minute),
    };
  }

  function updateTrueSolarPreview() {
    const display = $('#mbpTstDisplay');
    const badge = $('#mbpTstBadge');
    const shichen = $('#mbpShichenPreview');
    if (!display) return;
    const date = solarFromForm();
    if (date.error) {
      display.textContent = '请先输入出生日期，地点可选';
      if (shichen) shichen.textContent = '';
      return;
    }
    const time = formTime();
    if (typeof window.calcTrueSolarTime !== 'function') {
      display.textContent = `${date.year}-${pad2(date.month)}-${pad2(date.day)} ${pad2(time.hour)}:${pad2(time.minute)}`;
      return;
    }
    const tst = window.calcTrueSolarTime({
      year: date.year,
      month: date.month,
      day: date.day,
      hour: time.hour,
      minute: time.minute,
      longitude: selectedCity?.lon,
      tzOffset: selectedCity?.tzOffset ?? 8,
      cityName: selectedCity ? selectedCity.city : '',
    });
    display.innerHTML = `区时 ${pad2(time.hour)}:${pad2(time.minute)} · 真太阳时 <b>${pad2(tst.trueSolarHour)}:${pad2(tst.trueSolarMinute)}</b> · ${escapeHtml(tst.diffStr)}`;
    if (badge) {
      badge.textContent = tst.isEstimated ? '默认估算' : formatCityLabel(selectedCity);
      badge.style.display = '';
    }
    if (shichen) {
      const idx = typeof window.tstToShichen === 'function' ? window.tstToShichen(tst.trueSolarHour, tst.trueSolarMinute) : localShichenIndex(tst.trueSolarHour, tst.trueSolarMinute);
      shichen.textContent = `排盘采用：${shichenNames[idx]}时`;
    }
  }

  function showFormError(message) {
    const error = $('#mbpFormError');
    if (!error) return;
    error.textContent = message || '';
    error.style.display = message ? 'block' : 'none';
  }

  function collectProfileFromForm() {
    const date = solarFromForm();
    if (date.error) return { error: date.error };
    const time = formTime();
    const cityText = selectedCity ? formatCityLabel(selectedCity) : String($('#mbpCitySearch')?.value || defaultProfile.city).trim();
    return normalizeProfile({
      ...date,
      ...time,
      name: $('#mbpName')?.value || '',
      gender: $('#mbpGender')?.value || 'male',
      city: cityText,
      cityName: cityText,
      cityProvince: selectedCity?.province,
      cityShort: selectedCity?.city,
      cityLon: selectedCity?.lon,
      cityLat: selectedCity?.lat,
      cityTz: selectedCity?.tzOffset ?? 8,
    });
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
        longitude: profile.cityLon,
        tzOffset: profile.cityTz ?? 8,
        cityName: profile.cityName || profile.city,
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
      tstResult,
      cityDetail: profile.cityLon ? { name: profile.city, lon: profile.cityLon, lat: profile.cityLat, tzOffset: profile.cityTz ?? 8 } : null,
    };
  }

  function getAstroLib() {
    return window.iztro?.astro || window.iztro || null;
  }

  function profileKey(profile) {
    return [profile.year, profile.month, profile.day, profile.hour, profile.minute, profile.gender, profile.city, profile.cityLon, profile.isLunar].join('|');
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
    populateFormControls();
    const profile = state.profile;
    $('#mbpName').value = profile.name || '';
    $('#mbpGender').value = profile.gender;
    document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.v === profile.gender));
    $('#mbpYear').value = profile.year;
    $('#mbpMonth').value = profile.month;
    refreshDayOptions();
    $('#mbpDay').value = profile.day;
    $('#mbpLunarYear').value = profile.lunarYear || profile.year;
    $('#mbpLunarMonth').value = profile.lunarMonth || profile.month;
    refreshLunarDayOptions();
    $('#mbpLunarDay').value = profile.lunarDay || profile.day;
    $('#mbpLunarLeap').checked = !!profile.lunarLeap;
    $('#mbpHour').value = profile.hour;
    $('#mbpMinute').value = profile.minute;
    selectedCity = profile.cityLon ? { province: profile.cityProvince || profile.city, city: profile.cityShort || profile.city, name: profile.city, lon: profile.cityLon, lat: profile.cityLat, tzOffset: profile.cityTz ?? 8 } : findCity(profile.city);
    applySelectedCity(selectedCity);
    if (!selectedCity) {
      $('#mbpCitySearch').value = profile.city || '';
    }
    setCalMode(profile.isLunar ? 'lunar' : formCalMode);
    updateLunarLeapState();
    updateDatePreview();
  }

  function updateHeroMeta(bundle) {
    const mark = $('#mbpProfileMark');
    const meta = $('#mbpProfileMeta');
    if (!mark || !meta) return;
    const genderText = state.profile.gender === 'male' ? '男命' : '女命';
    if (bundle.chart) {
      const life = findLifePalace(bundle.chart);
      mark.textContent = (life?.earthlyBranch || '命').slice(0, 1);
      meta.textContent = `${state.profile.name || genderText} · ${bundle.chart.fiveElementsClass || '五行局'} · ${state.profile.city}`;
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

  function parseAiJson(value) {
    if (!value || typeof value !== 'string') return null;
    let text = value.trim();
    if (!text) return null;
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) text = text.slice(start, end + 1);
    if (!text.startsWith('{')) return null;
    try {
      return JSON.parse(text);
    } catch (_) {
      return null;
    }
  }

  function normalizeAiData(data) {
    if (!data) return data;
    const parsedRoot = parseAiJson(data.finalAnswer || data.answer || data.result || data.text);
    const parsedCard = parseAiJson(data.card);
    const card = parsedCard || data.card || parsedRoot?.card || parsedRoot || {};
    const next = { ...data, ...(parsedRoot?.card ? parsedRoot : {}) };
    if (card && typeof card === 'object' && !Array.isArray(card)) {
      next.card = { ...card };
    }
    const bodyAsJson = parseAiJson(next.card?.body || next.card?.summary);
    if (bodyAsJson?.card) {
      next.card = { ...bodyAsJson.card };
    } else if (bodyAsJson && (bodyAsJson.title || bodyAsJson.summary || bodyAsJson.body || bodyAsJson.sections)) {
      next.card = { ...bodyAsJson };
    }
    return next;
  }

  function aiCardText(data) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const sections = Array.isArray(card.sections) ? card.sections : [];
    if (sections.length) {
      return sections.map((section) => [section.title, section.content].filter(Boolean).join('：')).filter(Boolean).join('\n\n');
    }
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    return card.body || card.summary || finalAnswer || '';
  }

  function aiCardTitle(data, fallback) {
    return normalizeAiData(data)?.card?.title || fallback;
  }

  function normalizeText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function trimText(text, max = 92) {
    const value = normalizeText(text);
    if (value.length <= max) return value;
    const head = value.slice(0, max).replace(/[，。；、,.!?！？：:]+$/, '');
    return `${head || value.slice(0, max)}…`;
  }

  function aiSections(data) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const sections = Array.isArray(card.sections) ? card.sections.filter((item) => item?.content || item?.title) : [];
    if (sections.length) return sections.map((item) => ({
      title: item.title || '解读',
      content: item.content || '',
    }));
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    const text = card.body || card.summary || finalAnswer || '';
    return text ? [{ title: card.title || '解读', content: text }] : [];
  }

  function insightSummary(data, fallback = '等待原站 AI 返回。', max = 88) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    const source = card.summary || aiSections(data)[0]?.content || card.body || finalAnswer || fallback;
    return trimText(source, max);
  }

  function sectionBullets(sections, limit = 3, summary = '') {
    const summaryText = normalizeText(summary);
    return sections
      .map((section) => {
        const title = normalizeText(section.title);
        const content = normalizeText(section.content);
        if (!content && !title) return '';
        if (content && summaryText) {
          const contentHead = content.slice(0, 32);
          const summaryHead = summaryText.slice(0, 32);
          if (contentHead && (summaryText.startsWith(contentHead) || content.startsWith(summaryHead))) {
            return '';
          }
        }
        const body = trimText(content || title, 46);
        if (!title || title === '解读') return body;
        return `${title}：${body}`;
      })
      .filter(Boolean)
      .slice(0, limit);
  }

  function renderInsightBlock(data, fallbackTitle, fallbackText, options = {}) {
    const sections = aiSections(data);
    const summary = insightSummary(data, fallbackText, options.summaryMax || 88);
    const bullets = sectionBullets(sections, options.bulletLimit || 3, summary);
    const detail = sections.length ? sections : [{ title: fallbackTitle, content: fallbackText }];
    const detailLabel = options.detailLabel || '展开完整解读';
    if (options.direct) {
      const summaryHead = normalizeText(summary).slice(0, 32);
      const showSummary = !!summaryHead && !detail.some((section) => normalizeText(section.content).startsWith(summaryHead));
      return `
        ${showSummary ? `<p class="mbp-insight-summary">${escapeHtml(summary)}</p>` : ''}
        ${bullets.length ? `<ul class="mbp-insight-points">${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
        <div class="mbp-insight-detail is-direct">
          <div>
            ${detail.map((section) => `
              <section>
                <strong>${escapeHtml(section.title || '解读')}</strong>
                <p>${escapeHtml(section.content || '')}</p>
              </section>
            `).join('')}
          </div>
        </div>
      `;
    }
    return `
      <p class="mbp-insight-summary">${escapeHtml(summary)}</p>
      ${bullets.length ? `<ul class="mbp-insight-points">${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      <details class="mbp-insight-detail">
        <summary>${escapeHtml(detailLabel)}</summary>
        <div>
          ${detail.map((section) => `
            <section>
              <strong>${escapeHtml(section.title || '解读')}</strong>
              <p>${escapeHtml(section.content || '')}</p>
            </section>
          `).join('')}
        </div>
      </details>
    `;
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
    const normalized = normalizeAiData(data);
    const title = card.querySelector('h3');
    let body = card.querySelector('.mbp-special-result');
    if (!body) {
      const oldBody = card.querySelector('p');
      body = document.createElement('div');
      body.className = 'mbp-special-result';
      if (oldBody) oldBody.replaceWith(body);
      else card.appendChild(body);
    }
    if (title) title.textContent = aiCardTitle(normalized, fallbackTitle);
    if (body) {
      body.innerHTML = renderInsightBlock(normalized, fallbackTitle, '原站 AI 暂未返回内容，请稍后重试。', {
        summaryMax: 96,
        bulletLimit: 2,
        direct: true,
      });
    }
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
    const overall = normalizeAiData(state.aiResults.overall);
    const luck = normalizeAiData(state.aiResults.current_luck);
    const overallText = aiCardText(overall);
    const luckText = aiCardText(luck);
    const specialModules = [
      ['shengong', '身宫批命'],
      ['hunyin', '婚姻批命'],
      ['jiankang', '健康批命'],
      ['caiyun', '财运批命'],
      ['shiye', '事业批命'],
    ];
    const specialText = specialModules
      .map(([key]) => aiCardText(state.aiResults[key]))
      .filter(Boolean)
      .slice(0, 5)
      .join('\n\n');
    const specialBriefSections = specialModules
      .map(([key, title]) => {
        const data = normalizeAiData(state.aiResults[key]);
        if (!data) return null;
        return {
          title: aiCardTitle(data, title),
          content: insightSummary(data, '', 118),
        };
      })
      .filter((item) => item?.content);
    const specialBriefText = specialBriefSections
      .map((section) => `${section.title}：${section.content}`)
      .join('\n\n');
    const overallCard = normalizeAiData(overall)?.card || {};
    const decodeList = $('#mbpDecodeList');
    if (decodeList) {
      const highlights = [
        ['主线', overallText || '整体批命生成后显示'],
        ['走势', luckText || '大限流年生成后显示'],
        ['专项', specialText || '五宫专项生成后显示'],
        ['依据', overallCard.basis || facts.evidence],
      ];
      decodeList.innerHTML = highlights.map((item) => `
        <p><strong>${escapeHtml(item[0])}</strong>${escapeHtml(trimText(item[1], 48))}</p>
      `).join('');
    }
    const chaptersData = [
      [aiCardTitle(overall, '命格总览'), overallText || '整体批命等待原站 AI 返回。'],
      ['大限流年', luckText || '当前大限流年接口暂未返回，后续继续接原站大限模块。'],
      ['人生曲线', '人生曲线属于原站独立模块，下一步接入原站曲线评分与关键年份。'],
      ['五宫详解', specialBriefText || '五宫专项等待原站 AI 返回。', specialBriefSections],
      ['证据链', overallCard.basis || facts.evidence],
      ['行动建议', overallCard.risk ? `要留意：${overallCard.risk}` : '先看命盘底色，再看大运节奏；重要决策不只问准不准，还要知道何时动、如何动。'],
    ];
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.innerHTML = chaptersData.map((item, index) => {
        const data = index === 0 ? overall : index === 1 ? luck : { card: { title: item[0], body: item[1], sections: item[2] || null } };
        return `
        <article class="mbp-report-row">
          <span>卷${index + 1}</span>
          <div class="mbp-report-title">
            <h3>${escapeHtml(item[0])}</h3>
          </div>
          <div class="mbp-report-content">
            ${renderInsightBlock(data, item[0], item[1], {
              summaryMax: 128,
              bulletLimit: 3,
              direct: true,
            })}
          </div>
        </article>
      `;
      }).join('');
    }
    const subtitle = $('#mbpBookSubtitle');
    if (subtitle) subtitle.textContent = facts.subtitle;
  }

  async function callOriginalAi(moduleKey) {
    if (typeof window._aipCallBackend !== 'function') {
      throw new Error('原站 AI 批命脚本未加载');
    }
    return normalizeAiData(await window._aipCallBackend(moduleKey));
  }

  function setModuleButtonsBusy(moduleKey, busy) {
    document.querySelectorAll(`[data-ai-module="${moduleKey}"]`).forEach((button) => {
      button.disabled = busy;
      button.classList.toggle('is-running', busy);
    });
  }

  function setAllModuleButtonsBusy(busy) {
    aiTasks.forEach((task) => setModuleButtonsBusy(task.module, busy));
  }

  function taskByModule(moduleKey) {
    return aiTasks.find((task) => task.module === moduleKey);
  }

  async function decodeSingleModule(moduleKey, options = {}) {
    const bundle = getChartBundle();
    if (bundle.error) {
      alert(bundle.error);
      return false;
    }
    const task = taskByModule(moduleKey);
    if (!task) return false;
    state.decoded = true;
    document.body.classList.add('is-decoded');
    if (task.key) setSpecialStatus(task.key, '正在生成…', 'running');
    setModuleButtonsBusy(task.module, true);
    setDecodeStatus(`正在单独批命：${task.label}`);
    try {
      const data = await callOriginalAi(task.module);
      state.aiResults[task.module] = data;
      if (task.key) {
        renderSpecialAi(task.key, data, task.label);
        setSpecialStatus(task.key, '已生成', 'done');
      }
      renderChaptersFromAi();
      setDecodeStatus(`${task.label} 已生成。`);
      if (options.scroll && task.key) {
        document.querySelector(`[data-report="${task.key}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return true;
    } catch (error) {
      const message = friendlyAiError(error);
      if (task.key) {
        renderSpecialAi(task.key, { card: { title: task.label, body: `⚠ ${message}` } }, task.label);
        setSpecialStatus(task.key, message, 'error');
      }
      setDecodeStatus(`${task.label} 失败：${message}`);
      return false;
    } finally {
      setModuleButtonsBusy(task.module, false);
    }
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
    setAllModuleButtonsBusy(true);

    let successCount = 0;
    for (const task of aiTasks) {
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
    setDecodeStatus(successCount ? `已接入原站 AI：完成 ${successCount}/${aiTasks.length} 个模块。` : 'AI 服务暂未连接，请稍后重试。');
    setAllModuleButtonsBusy(false);
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
      let body = card.querySelector('.mbp-special-result') || card.querySelector('p');
      if (!body) {
        body = document.createElement('div');
        body.className = 'mbp-special-result';
        card.appendChild(body);
      }
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
    const decodeList = $('#mbpDecodeList');
    if (decodeList) {
      decodeList.innerHTML = `
        <p>整体批命先给主线</p>
        <p>五大专项直接出结论</p>
        <p>命书卷轴沉浸阅读</p>
        <p>深度报告可继续追问</p>
      `;
    }
    const btn = $('#mbpDecodeBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✦ 一键解读';
    }
    setAllModuleButtonsBusy(false);
    setDecodeStatus('接入原站 AI 批命接口，排盘后可一键生成。');
  }

  function saveProfile() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.profile));
    } catch (_) {}
  }

  function bindEvents() {
    document.querySelectorAll('.nf-gender-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $('#mbpGender').value = btn.dataset.v;
        document.querySelectorAll('.nf-gender-btn').forEach((item) => item.classList.toggle('active', item === btn));
      });
    });

    document.querySelectorAll('.nf-cal-btn').forEach((btn) => {
      btn.addEventListener('click', () => setCalMode(btn.dataset.cal || 'solar'));
    });

    ['#mbpYear', '#mbpMonth'].forEach((selector) => {
      $(selector)?.addEventListener('change', () => {
        refreshDayOptions();
        updateDatePreview();
      });
      $(selector)?.addEventListener('input', () => {
        refreshDayOptions();
        updateDatePreview();
      });
    });
    $('#mbpDay')?.addEventListener('change', updateDatePreview);
    ['#mbpLunarYear', '#mbpLunarMonth'].forEach((selector) => {
      $(selector)?.addEventListener('change', () => {
        updateLunarLeapState();
        updateDatePreview();
      });
      $(selector)?.addEventListener('input', () => {
        updateLunarLeapState();
        updateDatePreview();
      });
    });
    $('#mbpLunarDay')?.addEventListener('change', updateDatePreview);
    $('#mbpLunarLeap')?.addEventListener('change', updateDatePreview);
    $('#mbpHour')?.addEventListener('change', updateTrueSolarPreview);
    $('#mbpMinute')?.addEventListener('change', updateTrueSolarPreview);

    $('#mbpUnknownTime')?.addEventListener('click', () => {
      $('#mbpHour').value = 12;
      $('#mbpMinute').value = 0;
      $('#mbpShichenPreview').textContent = '已按午时 12:00 暂排，可之后回原版做时辰推断。';
      updateTrueSolarPreview();
    });

    $('#mbpCitySearch')?.addEventListener('input', () => {
      const input = $('#mbpCitySearch');
      const dropdown = $('#mbpCityDropdown');
      const q = input.value.trim().toLowerCase();
      const list = typeof CITIES !== 'undefined' ? CITIES : (window.CITIES || globalThis.CITIES || []);
      selectedCity = null;
      $('#mbpClearCity').style.display = q ? '' : 'none';
      $('#mbpCitySelected').style.display = 'none';
      if (!q || !Array.isArray(list)) {
        dropdown.style.display = 'none';
        updateTrueSolarPreview();
        return;
      }
      const compact = q.replace(/\s|·|-/g, '');
      const results = list.filter((row) => {
        const text = `${row[0]}${row[1]} ${row[0]} ${row[1]}`.toLowerCase();
        return text.includes(q) || text.replace(/\s/g, '').includes(compact);
      }).slice(0, 12);
      if (!results.length) {
        dropdown.style.display = 'none';
        return;
      }
      dropdown.innerHTML = results.map((row, index) => `
        <div class="nf-city-item" data-index="${index}">
          <b>${escapeHtml(row[0])} · ${escapeHtml(row[1])}</b>
          <span>${Number(row[2]).toFixed(2)}°E, ${Number(row[3]).toFixed(2)}°N</span>
        </div>
      `).join('');
      dropdown._mbpResults = results;
      dropdown.style.display = 'block';
    });

    $('#mbpCityDropdown')?.addEventListener('click', (event) => {
      const item = event.target.closest('.nf-city-item');
      if (!item) return;
      const row = $('#mbpCityDropdown')._mbpResults?.[Number(item.dataset.index)];
      applySelectedCity(cityFromRow(row));
      $('#mbpCityDropdown').style.display = 'none';
    });

    $('#mbpClearCity')?.addEventListener('click', () => {
      applySelectedCity(null);
      $('#mbpCitySearch').value = '';
      $('#mbpCityDropdown').style.display = 'none';
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#mbpCitySearch') && !event.target.closest('#mbpCityDropdown')) {
        const dropdown = $('#mbpCityDropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    });

    function applyAiText() {
      const text = $('#mbpAiInput')?.value || '';
      const year = text.match(/(19|20)\d{2}/)?.[0];
      const numbers = [...text.matchAll(/(\d{1,2})\s*(?:月|月份|[\/.-])/g)].map((match) => Number(match[1]));
      const dayMatch = text.match(/(\d{1,2})\s*(?:日|号)/);
      const hourMatch = text.match(/(\d{1,2})\s*(?:点|时|:)/);
      const minuteMatch = text.match(/[:：]\s*(\d{1,2})|(\d{1,2})\s*分/);
      if (year) $('#mbpYear').value = year;
      if (numbers[0]) $('#mbpMonth').value = numbers[0];
      refreshDayOptions();
      if (dayMatch) $('#mbpDay').value = dayMatch[1];
      if (/女/.test(text)) {
        $('#mbpGender').value = 'female';
        document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.v === 'female'));
      } else if (/男/.test(text)) {
        $('#mbpGender').value = 'male';
        document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.v === 'male'));
      }
      if (hourMatch) {
        let hour = Number(hourMatch[1]);
        if (/下午|晚上|夜里/.test(text) && hour < 12) hour += 12;
        $('#mbpHour').value = Math.min(23, hour);
      }
      const minute = Number(minuteMatch?.[1] || minuteMatch?.[2] || 0);
      $('#mbpMinute').value = Number.isFinite(minute) ? Math.min(59, minute) : 0;
      const city = findCity(text);
      if (city) applySelectedCity(city);
      setCalMode('solar');
      $('#mbpAiTip').textContent = city || year ? '已识别并填入，可检查后排盘。' : '暂未识别完整，请补充年月日、时间、性别、城市。';
      updateDatePreview();
    }

    $('#mbpAiSend')?.addEventListener('click', applyAiText);
    $('#mbpAiInput')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyAiText();
      }
    });

    $('#mbpBirthForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const profile = collectProfileFromForm();
      if (profile.error) {
        showFormError(profile.error);
        return;
      }
      showFormError('');
      state.profile = profile;
      formCalMode = profile.isLunar ? 'lunar' : 'solar';
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

    document.querySelectorAll('[data-ai-module]').forEach((button) => {
      button.addEventListener('click', () => {
        decodeSingleModule(button.dataset.aiModule, { scroll: button.classList.contains('mbp-card-ai-btn') });
      });
    });

    $('#mbpScrollReport')?.addEventListener('click', () => {
      $('#report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  updateForm();
  bindEvents();
  renderChart();
}());
