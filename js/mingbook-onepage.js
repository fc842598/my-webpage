(function () {
  const storageKey = 'yt_mingbook_onepage_profile_v1';
  const legacyHistoryKey = 'yt_zw_history_v1';
  const chartHistoryKey = 'ziwei_local_chart_history_v1';
  const html2PdfUrl = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
  const palaceOrder = ['巳', '午', '未', '申', '辰', null, null, '酉', '卯', null, null, '戌', '寅', '丑', '子', '亥'];
  const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const fcBranchId = {
    巳: 'mbp-fc-si',
    午: 'mbp-fc-wu',
    未: 'mbp-fc-wei',
    申: 'mbp-fc-shen',
    辰: 'mbp-fc-chen',
    酉: 'mbp-fc-you',
    卯: 'mbp-fc-mao',
    戌: 'mbp-fc-xu',
    寅: 'mbp-fc-yin',
    丑: 'mbp-fc-chou',
    子: 'mbp-fc-zi',
    亥: 'mbp-fc-hai',
  };
  const fcZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  let fcActiveTab = '先天卦';
  let fcActiveAge = 1;
  let fcBirthYear = 1990;
  let fcSequenceStartYear = 1990;
  let fcZipingMaxAge = 100;
  let fcActiveBranch = '';
  let fcYearCards = [];
  let fcYearlyMap = {};
  let fcXiaoLianBranch = null;
  let fcXiantianResult = null;
  let fcHoutianResult = null;
  let fcLiunianResult = null;
  let fcLiunianSeq = {};
  let fcCurrentChart = null;
  let fcCurrentGender = 'male';
  let fcBirthPillars = null;
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
  let clientRecordsCache = [];
  let html2PdfPromise = null;

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

  function cleanAiText(value) {
    return String(value ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-z]*\n?/gi, '').replace(/```/g, ''))
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(^|\n)\s{0,3}#{1,6}\s*/g, '$1')
      .replace(/(^|\n)\s{0,3}>\s*/g, '$1')
      .replace(/(^|\n)\s*[-*+]\s+/g, '$1')
      .replace(/\*\*([^*\n]+)\*\*/g, '$1')
      .replace(/__([^_\n]+)__/g, '$1')
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function cleanAiInlineText(value) {
    return cleanAiText(value).replace(/\s+/g, ' ').trim();
  }

  function aiTextSectionsFromMarkdown(text, fallbackTitle = '解读') {
    const raw = String(text || '').replace(/\r\n?/g, '\n').trim();
    if (!raw) return [];
    const sections = [];
    let current = null;
    raw.split('\n').forEach((line) => {
      const heading = line.match(/^\s{0,3}#{1,6}\s*(.+?)\s*#*\s*$/);
      if (heading) {
        if (current) sections.push(current);
        current = { title: cleanAiInlineText(heading[1]) || fallbackTitle, lines: [] };
        return;
      }
      if (!current) current = { title: fallbackTitle, lines: [] };
      current.lines.push(line);
    });
    if (current) sections.push(current);
    return sections
      .map((section) => ({
        title: cleanAiInlineText(section.title) || fallbackTitle,
        content: cleanAiText(section.lines.join('\n')),
      }))
      .filter((section) => section.title || section.content);
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

  function readJsonList(key) {
    try {
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function indexToHour(index) {
    const idx = clampNumber(index, 0, 11, 6);
    return idx === 0 ? 0 : idx * 2;
  }

  function profileFromLegacyHistory() {
    try {
      const list = readJsonList(legacyHistoryKey);
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

  function makeLocalId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `mbp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function parseTimeText(value) {
    const match = String(value || '').match(/(\d{1,2})[:：](\d{1,2})/);
    return match ? { hour: Number(match[1]), minute: Number(match[2]) } : {};
  }

  function recordToProfile(record) {
    const source = record?.norm || record || {};
    const date = String(source.dateStr || source.birth_date || '').split('-').map((part) => Number.parseInt(part, 10));
    const time = parseTimeText(source.birth_time);
    const cityObj = source.city && typeof source.city === 'object' ? source.city : null;
    const cityName = cityObj?.name || source.cityName || source.city || defaultProfile.city;
    return normalizeProfile({
      name: source.name || '',
      year: source.year || date[0],
      month: source.month || date[1],
      day: source.day || date[2],
      hour: source.cstHour ?? source.hour ?? time.hour ?? indexToHour(source.timeIdx),
      minute: source.cstMinute ?? source.minute ?? time.minute ?? 0,
      gender: source.gender,
      city: cityName,
      cityName,
      cityProvince: source.cityProvince || cityObj?.province,
      cityShort: source.cityShort || cityObj?.city,
      cityLon: source.cityLon ?? cityObj?.lon,
      cityLat: source.cityLat ?? cityObj?.lat,
      cityTz: source.cityTz ?? cityObj?.tzOffset,
      isLunar: source.calMode === 'lunar' || source.isLunar,
      lunarYear: source.lunarYear,
      lunarMonth: source.lunarMonth,
      lunarDay: source.lunarDay,
      lunarLeap: source.lunarLeap || source.isLeap,
      calModeLabel: source.calModeLabel,
      lunarLabel: source.lunarLabel,
    });
  }

  function profileHistoryKey(profile) {
    return [
      profile.name || '',
      profile.gender,
      profile.year,
      profile.month,
      profile.day,
      profile.hour,
      profile.minute,
      profile.cityLon || '',
      profile.cityName || profile.city || '',
      profile.isLunar ? 'lunar' : 'solar',
    ].join('|');
  }

  function cityRecordFromProfile(profile) {
    return {
      name: profile.cityName || profile.city || '',
      province: profile.cityProvince || '',
      city: profile.cityShort || '',
      lon: profile.cityLon,
      lat: profile.cityLat,
      tzOffset: profile.cityTz ?? 8,
    };
  }

  function profileToRecord(profile) {
    return {
      id: makeLocalId(),
      savedAt: new Date().toISOString(),
      name: profile.name || '',
      gender: profile.gender,
      year: profile.year,
      month: profile.month,
      day: profile.day,
      cstHour: profile.hour,
      cstMinute: profile.minute,
      dateStr: dateStr(profile),
      calMode: profile.isLunar ? 'lunar' : 'solar',
      calModeLabel: profile.calModeLabel || `公历 ${dateStr(profile)}`,
      city: cityRecordFromProfile(profile),
      cityName: profile.cityName || profile.city || '',
      cityLon: profile.cityLon,
      cityLat: profile.cityLat,
      cityTz: profile.cityTz ?? 8,
      lunarYear: profile.lunarYear,
      lunarMonth: profile.lunarMonth,
      lunarDay: profile.lunarDay,
      lunarLeap: profile.lunarLeap,
    };
  }

  function loadCustomerRecords() {
    const records = [
      ...readJsonList(chartHistoryKey),
      ...readJsonList(legacyHistoryKey),
    ];
    const current = { ...profileToRecord(state.profile), id: 'current', savedAt: new Date().toISOString() };
    const seen = new Set();
    return [current, ...records]
      .map((record) => {
        const profile = recordToProfile(record);
        const key = profileHistoryKey(profile);
        if (seen.has(key)) return null;
        seen.add(key);
        return { id: record.id || key, savedAt: record.savedAt || record.created_at || '', profile };
      })
      .filter(Boolean)
      .slice(0, 50);
  }

  function saveProfileToHistory(profile) {
    const record = profileToRecord(profile);
    const key = profileHistoryKey(profile);
    const list = readJsonList(chartHistoryKey)
      .filter((item) => profileHistoryKey(recordToProfile(item)) !== key)
      .slice(0, 49);
    try {
      localStorage.setItem(chartHistoryKey, JSON.stringify([record, ...list]));
    } catch (_) {}
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
    const title = $('#mbpProfileTitle');
    const meta = $('#mbpProfileMeta');
    if (!mark || !meta) return;
    const genderText = state.profile.gender === 'male' ? '男命' : '女命';
    if (title) title.textContent = state.profile.name || '命 主';
    if (bundle.chart) {
      const life = findLifePalace(bundle.chart);
      mark.textContent = (life?.earthlyBranch || '命').slice(0, 1);
      meta.textContent = `${state.profile.name || genderText} · ${bundle.chart.fiveElementsClass || '五行局'} · ${state.profile.city}`;
    } else {
      mark.textContent = '命';
      meta.textContent = '待排盘 · 命书未启';
    }
    renderClientList();
  }

  function clientLabel(profile) {
    return profile.name || (profile.gender === 'female' ? '女命客户' : '男命客户');
  }

  function clientSubline(profile) {
    return `${profile.year}-${pad2(profile.month)}-${pad2(profile.day)} ${pad2(profile.hour)}:${pad2(profile.minute)} · ${profile.cityName || profile.city || '未填地点'}`;
  }

  function renderClientList() {
    const listEl = $('#mbpClientList');
    const countEl = $('#mbpClientCount');
    if (!listEl) return;
    clientRecordsCache = loadCustomerRecords();
    if (countEl) countEl.textContent = `${clientRecordsCache.length} 个盘`;
    if (!clientRecordsCache.length) {
      listEl.innerHTML = '<div class="mbp-client-empty">暂无客户盘，排盘后会自动保存。</div>';
      return;
    }
    const activeKey = profileHistoryKey(state.profile);
    listEl.innerHTML = clientRecordsCache.map((item, index) => {
      const profile = item.profile;
      const label = clientLabel(profile);
      const mark = (label || '命').slice(-1);
      const isActive = profileHistoryKey(profile) === activeKey;
      return `
        <button class="mbp-client-item ${isActive ? 'is-active' : ''}" type="button" data-client-index="${index}">
          <span class="mbp-client-mini">${escapeHtml(mark)}</span>
          <span>
            <b>${escapeHtml(label)}</b>
            <small>${escapeHtml(clientSubline(profile))}</small>
          </span>
        </button>
      `;
    }).join('');
  }

  function closeClientMenu() {
    const menu = $('#mbpClientMenu');
    const toggle = $('#mbpClientToggle');
    if (menu) menu.hidden = true;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function resetForProfileChange() {
    state.chart = null;
    state.chartKey = '';
    state.decoded = false;
    state.aiResults = {};
    document.body.classList.remove('is-decoded');
    resetAiContent();
  }

  function applyClientProfile(profile) {
    state.profile = normalizeProfile(profile);
    formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
    resetForProfileChange();
    saveProfile();
    updateForm();
    renderChart();
    closeClientMenu();
  }

  function getTianjiSolarClass() {
    return window.Solar || globalThis.Solar || null;
  }

  function extractPillars(chart, norm) {
    const Solar = getTianjiSolarClass();
    const tianjiPillars = (typeof window.TianjiBazi !== 'undefined' && Solar && norm)
      ? window.TianjiBazi.computePillarsFromSolarLib(Solar, norm)
      : null;
    if (tianjiPillars) return tianjiPillars;

    const rd = chart.rawDates || chart;
    const cd = (rd.chineseDate && typeof rd.chineseDate === 'object') ? rd.chineseDate : {};
    const hseb = rd.heavenlyStemAndEarthlyBranchDate || chart.heavenlyStemAndEarthlyBranchDate || {};
    const cdStr = typeof chart.chineseDate === 'string' ? chart.chineseDate : '';
    const cdParts = cdStr.split(/\s+/).filter((part) => part.length >= 2);

    return {
      yearStem: cd.yearly?.[0] || hseb.year?.heavenlyStem || rd.yearStem || cdParts[0]?.[0] || '',
      yearBranch: cd.yearly?.[1] || hseb.year?.earthlyBranch || rd.yearBranch || cdParts[0]?.[1] || '',
      monthStem: cd.monthly?.[0] || hseb.month?.heavenlyStem || rd.monthStem || cdParts[1]?.[0] || '',
      monthBranch: cd.monthly?.[1] || hseb.month?.earthlyBranch || rd.monthBranch || cdParts[1]?.[1] || '',
      dayStem: cd.daily?.[0] || hseb.day?.heavenlyStem || rd.dayStem || cdParts[2]?.[0] || '',
      dayBranch: cd.daily?.[1] || hseb.day?.earthlyBranch || rd.dayBranch || cdParts[2]?.[1] || '',
      hourStem: cd.hourly?.[0] || hseb.hour?.heavenlyStem || rd.timeStem || cdParts[3]?.[0] || '',
      hourBranch: cd.hourly?.[1] || hseb.hour?.earthlyBranch || rd.timeBranch || cdParts[3]?.[1] || '',
    };
  }

  function fcResolvedShichenName(chart, norm) {
    return extractPillars(chart, norm)?._tianji?.timeSlot || shichenLabel(norm);
  }

  function fcMaxAge() {
    const direct = Number(fcZipingMaxAge);
    if (Number.isFinite(direct) && direct >= 1) return Math.max(1, Math.floor(direct));
    const ages = Object.keys(fcLiunianSeq || {}).map(Number).filter((age) => Number.isFinite(age) && age >= 1);
    return ages.length ? Math.max(...ages) : 100;
  }

  function fcClampAge(age) {
    const num = Math.floor(Number(age) || 1);
    return Math.max(1, Math.min(fcMaxAge(), num));
  }

  function fcAgeToYear(age) {
    return fcSequenceStartYear + fcClampAge(age) - 1;
  }

  function calcXiaoLianBranch(yearBranch, gender, xuAge) {
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const startMap = { 寅: 4, 午: 4, 戌: 4, 申: 10, 子: 10, 辰: 10, 亥: 1, 卯: 1, 未: 1, 巳: 7, 酉: 7, 丑: 7 };
    const dir = gender === 'male' ? 1 : -1;
    const startIdx = startMap[yearBranch] ?? 2;
    return branches[((startIdx + dir * (xuAge - 1)) % 12 + 12) % 12];
  }

  function fcResolveXiaoLianBranch(age = fcActiveAge) {
    if (fcLiunianSeq?.[age]?.xiaoLian) return fcLiunianSeq[age].xiaoLian;
    const yearBranch = fcBirthPillars?.yearBranch
      || fcCurrentChart?.rawDates?.yearBranch
      || fcCurrentChart?.yearBranch
      || fcCurrentChart?.yearEarthlyBranch
      || '';
    return yearBranch ? calcXiaoLianBranch(yearBranch, fcCurrentGender, age) : null;
  }

  function fcBuildYearCards(startYear = fcSequenceStartYear) {
    const curYear = new Date().getFullYear();
    const maxAge = fcMaxAge();
    fcActiveAge = fcClampAge(curYear - startYear + 1);
    fcYearCards = [];
    for (let age = 1; age <= maxAge; age += 1) {
      fcYearCards.push({ age, year: startYear + age - 1 });
    }
  }

  function fcLoadYearly(year) {
    fcYearlyMap = {};
    fcXiaoLianBranch = null;
    if (fcCurrentChart && typeof fcCurrentChart.horoscope === 'function') {
      try {
        const h = fcCurrentChart.horoscope(`${year}-06-01`, 0);
        const scope = h.yearly || h.decadal || h;
        const palaces = scope.palaces || scope.palace || [];
        palaces.forEach((palace) => {
          if (palace.earthlyBranch) fcYearlyMap[palace.earthlyBranch] = palace;
        });
      } catch (error) {
        console.warn('horoscope() 调用失败:', error);
      }
    }
    fcXiaoLianBranch = fcResolveXiaoLianBranch(fcActiveAge);
  }

  function fcMutagenClass(mutagen) {
    if (mutagen === '化禄') return 'fc-mutagen-lu';
    if (mutagen === '化权') return 'fc-mutagen-quan';
    if (mutagen === '化科') return 'fc-mutagen-ke';
    return 'fc-mutagen-ji';
  }

  function fcBuildCell(palace, activeBranch) {
    const branch = palace.earthlyBranch;
    const cell = document.getElementById(fcBranchId[branch]);
    if (!cell) return;

    const activeIndex = Math.max(0, fcZhi.indexOf(activeBranch));
    const related = [fcZhi[(activeIndex + 4) % 12], fcZhi[(activeIndex + 8) % 12], fcZhi[(activeIndex + 6) % 12]];
    const isBen = branch === activeBranch;
    const isRel = !isBen && related.includes(branch);
    const isXiaoLian = fcActiveTab === '流年卦' && branch === fcXiaoLianBranch;
    cell.className = `fc-cell${isBen ? ' fc-ben' : isRel ? ' fc-rel' : ''}${isXiaoLian ? ' fc-xiaolian' : ''}`;

    const allStarsForMutagen = [
      ...(palace.majorStars || []),
      ...(palace.minorStars || []),
      ...(palace.adjectiveStars || palace.adjStars || []),
    ];
    const mutagenHtml = allStarsForMutagen
      .filter((star) => star && star.mutagen)
      .map((star) => `<span class="fc-pal-mutagen ${fcMutagenClass(star.mutagen)}">${escapeHtml(star.mutagen)}</span>`)
      .join('');

    const majorHtml = (palace.majorStars || [])
      .map((star) => `<div class="fc-major-star">${escapeHtml((star.name || '') + (star.brightness || ''))}</div>`)
      .join('');
    const minorHtml = allSmallStars(palace)
      .map((star) => `<div class="fc-minor-star">${escapeHtml(starText(star))}</div>`)
      .join('');
    const shenHtml = [palace.changsheng12, palace.boshi12].filter(Boolean)
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join('');
    const yearly = fcActiveTab === '流年卦' ? fcYearlyMap[branch] : null;
    const yearlyMutagen = yearly ? (yearly.mutagen || [])
      .map((item) => `<span class="fc-minor-star" style="color:#963d32">${escapeHtml(item)}</span>`)
      .join('') : '';
    const yearlyStars = yearly ? (yearly.stars || yearly.majorStars || [])
      .map((star) => `<span class="fc-minor-star" style="color:#476885">${escapeHtml(star.name || star)}</span>`)
      .join('') : '';
    const yearlyHtml = yearlyMutagen || yearlyStars ? `<div class="fc-yearly-row">${yearlyMutagen}${yearlyStars}</div>` : '';
    const xiaoLianHtml = isXiaoLian ? `<div class="fc-xiaolian-badge">${fcActiveAge}岁</div>` : '';
    const stemBranch = `${palace.heavenlyStem || ''}${palace.earthlyBranch || ''}`;
    const ageStr = palace.decadal?.range ? `${palace.decadal.range[0]}–${palace.decadal.range[1]}` : '';
    const palaceName = `${palace.isBodyPalace ? '身宫\n' : ''}${palace.name || ''}`;

    cell.innerHTML = `
      <div class="fc-cell-top">
        ${mutagenHtml ? `<div class="fc-cell-mutagen">${mutagenHtml}</div>` : ''}
        <div class="fc-major-list">${majorHtml || '<div class="fc-major-star">空宫</div>'}</div>
        <div class="fc-minor-list">${minorHtml}</div>
      </div>
      ${yearlyHtml}
      <div class="fc-cell-bottom">
        <div class="fc-shen-list">${shenHtml}</div>
        <div class="fc-palace-info">
          <span class="fc-branch">${escapeHtml(stemBranch)}</span>
          <span class="fc-age">${escapeHtml(ageStr)}</span>
          <span class="fc-palace-name">${escapeHtml(palaceName)}</span>
        </div>
        ${xiaoLianHtml}
      </div>`;
    cell.onclick = () => fcRenderHighlight(branch);
  }

  function fcClearCells(message) {
    Object.values(fcBranchId).forEach((id) => {
      const cell = document.getElementById(id);
      if (cell) {
        cell.className = 'fc-cell';
        cell.innerHTML = '';
      }
    });
    $('#mbpFcName').textContent = '待排盘';
    $('#mbpFcMeta').textContent = '';
    $('#mbpFcSolar').textContent = message || '—';
    $('#mbpFcLunar').textContent = '—';
    $('#mbpFcTst').textContent = '—';
    $('#mbpFcShichen').textContent = '—';
    $('#mbpFcSizhu').innerHTML = '';
    $('#mbpFcXiantian').textContent = '—';
    $('#mbpFcHoutian').textContent = '—';
    $('#mbpFcLiunian').textContent = '—';
    fcRenderHexagram(null);
  }

  function fcRenderHighlight(activeBranch) {
    if (!fcCurrentChart) return;
    fcActiveBranch = activeBranch;
    (fcCurrentChart.palaces || []).forEach((palace) => fcBuildCell(palace, activeBranch));
  }

  function fcRenderTabs() {
    document.querySelectorAll('.mbp-fc-card .fc-tab').forEach((button) => {
      const active = button.dataset.tab === fcActiveTab;
      button.classList.toggle('active', active);
      button.innerHTML = active
        ? `<span class="fc-tab-deco">◇</span>${button.dataset.tab}<span class="fc-tab-deco">◇</span>`
        : button.dataset.tab;
    });
    const wrap = $('#mbpFcLiunianWrap');
    if (wrap) wrap.style.display = fcActiveTab === '流年卦' ? 'flex' : 'none';
  }

  function fcRenderLiunianScroll() {
    const scroll = $('#mbpFcLiunianScroll');
    if (!scroll) return;
    scroll.innerHTML = fcYearCards.map((item) => `
      <div class="fc-year-card${item.age === fcActiveAge ? ' active' : ''}" data-age="${item.age}">
        <span>${item.age}岁</span>
        <span style="font-size:10px">${item.year}年</span>
      </div>
    `).join('');
    scroll.querySelectorAll('.fc-year-card').forEach((card) => {
      card.addEventListener('click', () => fcSelectYear(card.dataset.age));
    });
    requestAnimationFrame(() => {
      scroll.querySelector('.fc-year-card.active')?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    });
  }

  function fcRenderHexagram(forced) {
    let result = forced;
    if (!result) {
      if (fcActiveTab === '先天卦') result = fcXiantianResult;
      else if (fcActiveTab === '后天卦') result = fcHoutianResult;
      else result = fcLiunianResult;
    }

    const name = $('#mbpFcHexName');
    const sub = $('#mbpFcHexSub');
    const lines = $('#mbpFcHexLines');
    const guaciCard = $('#mbpFcGuaciCard');
    const guaciText = $('#mbpFcGuaciText');
    if (!name || !sub || !lines || !guaciCard || !guaciText) return;

    if (!result) {
      name.textContent = '—';
      sub.textContent = '';
      lines.innerHTML = '';
      guaciCard.style.display = 'none';
      return;
    }

    name.textContent = result.name || '—';
    sub.textContent = result.num ? `#${result.num}` : '';
    lines.innerHTML = (result.lines || []).map((line) => {
      if (line === 'gap') return '<div class="fc-hex-gap"></div>';
      if (line === 'solid') return '<div class="fc-yao-solid"></div>';
      return '<div class="fc-yao-broken"><div></div><div></div></div>';
    }).join('');

    const entry = typeof window.getGuaciEntryByName === 'function'
      ? window.getGuaciEntryByName(result.name)
      : (window.GUACI_DATA && window.GUACI_DATA[result.name]);
    if (entry) {
      const key = fcActiveTab === '先天卦' ? 'xian' : fcActiveTab === '后天卦' ? 'hou' : 'liu';
      guaciText.textContent = entry[key] || '';
      guaciCard.style.display = guaciText.textContent ? 'block' : 'none';
    } else {
      guaciCard.style.display = 'none';
    }
  }

  function fcSelectYear(age) {
    fcActiveAge = fcClampAge(age);
    fcLoadYearly(fcAgeToYear(fcActiveAge));
    fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
    $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;
    fcRenderLiunianScroll();
    if (fcActiveTab === '流年卦') fcRenderHexagram();
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
  }

  function renderClassicChart(chart, norm) {
    fcCurrentChart = chart;
    fcCurrentGender = norm.gender || state.profile.gender;
    fcBirthYear = Number(norm.year) || Number(String(norm.dateStr || '').slice(0, 4)) || state.profile.year;

    const genderLabel = fcCurrentGender === 'male' ? '阳男' : '阴女';
    const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const zodiacSign = zodiac[((fcBirthYear - 4) % 12 + 12) % 12];
    $('#mbpFcName').textContent = state.profile.name || genderLabel;
    $('#mbpFcMeta').textContent = chart.fiveElementsClass ? `${chart.fiveElementsClass}  属${zodiacSign}` : `属${zodiacSign}`;

    const usedShichen = fcResolvedShichenName(chart, norm);
    const cstPart = norm.cstHour !== undefined ? `${pad2(norm.cstHour)}:${pad2(norm.cstMinute)}` : '';
    $('#mbpFcSolar').textContent = [norm.calModeLabel || norm.dateStr || '', cstPart, `${usedShichen}时`].filter(Boolean).join(' ');
    $('#mbpFcLunar').textContent = chart.chineseDate || chart.lunarDate || '—';
    if (norm.tstResult) {
      $('#mbpFcTst').textContent = `${pad2(norm.tstResult.trueSolarHour)}:${pad2(norm.tstResult.trueSolarMinute)}${norm.tstResult.isEstimated ? '（北京经度估算）' : `（偏差${norm.tstResult.diffStr}）`}`;
    } else {
      $('#mbpFcTst').textContent = cstPart ? `${cstPart}（未校正）` : '—';
    }
    $('#mbpFcShichen').textContent = `${usedShichen}时`;

    fcBirthPillars = extractPillars(chart, norm);
    const sizhu = $('#mbpFcSizhu');
    const stemColors = ['#886a4a', '#4d7a5b', '#9b4238', '#476885'];
    const pillars = [
      [fcBirthPillars.yearStem, fcBirthPillars.yearBranch],
      [fcBirthPillars.monthStem, fcBirthPillars.monthBranch],
      [fcBirthPillars.dayStem, fcBirthPillars.dayBranch],
      [fcBirthPillars.hourStem, fcBirthPillars.hourBranch],
    ];
    sizhu.innerHTML = pillars.map(([stem, branch], index) => (stem || branch)
      ? `<div class="fc-sizhu-col" style="color:${stemColors[index]}"><span>${escapeHtml(stem || '?')}</span><span>${escapeHtml(branch || '?')}</span></div>`
      : '').join('');

    if (window.ZipingRuntime && fcBirthPillars) {
      const zipingResult = window.ZipingRuntime.compute(fcBirthPillars, fcCurrentGender, fcBirthYear);
      fcXiantianResult = zipingResult?.xiantian || null;
      fcHoutianResult = zipingResult?.houtian || null;
      fcLiunianSeq = zipingResult?.liunianMap || {};
      fcSequenceStartYear = Number(zipingResult?.sequenceStartYear) || fcBirthYear;
      fcZipingMaxAge = Number(zipingResult?.naturalEndAge) || Math.max(1, Object.keys(fcLiunianSeq).length || 100);
    } else {
      fcXiantianResult = null;
      fcHoutianResult = null;
      fcLiunianSeq = {};
      fcSequenceStartYear = fcBirthYear;
      fcZipingMaxAge = 100;
    }
    fcBuildYearCards(fcSequenceStartYear);
    fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
    fcLoadYearly(fcAgeToYear(fcActiveAge));

    $('#mbpFcXiantian').textContent = fcXiantianResult?.name || '—';
    $('#mbpFcHoutian').textContent = fcHoutianResult?.name || '—';
    $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;

    fcActiveTab = '先天卦';
    fcActiveBranch = chart.earthlyBranchOfSoulPalace || '卯';
    fcRenderTabs();
    fcRenderLiunianScroll();
    fcRenderHexagram();
    fcRenderHighlight(fcActiveBranch);
  }

  function renderChart() {
    const bundle = getChartBundle();
    updateHeroMeta(bundle);
    const summary = $('#mbpChartSummary');
    if (!summary) return;

    if (bundle.error) {
      fcCurrentChart = null;
      fcXiantianResult = null;
      fcHoutianResult = null;
      fcLiunianResult = null;
      fcLiunianSeq = {};
      fcClearCells(bundle.error);
      summary.textContent = bundle.error;
      return;
    }

    const { chart, norm } = bundle;
    renderClassicChart(chart, norm);
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
      return sections.map((section) => [cleanAiInlineText(section.title), cleanAiText(section.content)].filter(Boolean).join('：')).filter(Boolean).join('\n\n');
    }
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    return cleanAiText(card.body || card.summary || finalAnswer || '');
  }

  function aiCardTitle(data, fallback) {
    return cleanAiInlineText(normalizeAiData(data)?.card?.title) || fallback;
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
      title: cleanAiInlineText(item.title) || '解读',
      content: cleanAiText(item.content || ''),
    }));
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    const text = card.body || card.summary || finalAnswer || '';
    if (!text) return [];
    const fallbackTitle = cleanAiInlineText(card.title) || '解读';
    return aiTextSectionsFromMarkdown(text, fallbackTitle);
  }

  function insightSummary(data, fallback = '等待原站 AI 返回。', max = 88) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    const source = cleanAiText(card.summary || aiSections(data)[0]?.content || card.body || finalAnswer || fallback);
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
    const bullets = sectionBullets(sections, options.bulletLimit ?? 3, summary);
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

  function renderCurveChapterBlock() {
    return `
      <div class="mbp-curve-summary">
        <div>
          <strong>整体是“先压后升，中年见高点”</strong>
          <p>36岁前后守住节奏，44岁前后主动扩张，56岁后还有第二波抬升。</p>
        </div>
        <em>客户易懂版</em>
      </div>
      <div class="mbp-curve-chart" aria-label="人生曲线示意">
        <svg viewBox="0 0 760 210" role="img">
          <line x1="40" y1="36" x2="730" y2="36"></line>
          <line x1="40" y1="86" x2="730" y2="86"></line>
          <line x1="40" y1="136" x2="730" y2="136"></line>
          <line x1="40" y1="186" x2="730" y2="186"></line>
          <path class="mbp-curve-fill" d="M42 158 C108 132 168 92 230 88 C302 84 308 162 362 152 C446 134 454 58 526 58 C608 58 622 114 720 82 L720 186 L42 186 Z"></path>
          <path class="mbp-curve-line" d="M42 158 C108 132 168 92 230 88 C302 84 308 162 362 152 C446 134 454 58 526 58 C608 58 622 114 720 82"></path>
          <circle class="is-warn" cx="42" cy="158" r="7"></circle>
          <text class="mbp-curve-label" x="34" y="138">21岁</text>
          <text class="mbp-curve-note" x="16" y="176">起势</text>
          <circle cx="230" cy="88" r="7"></circle>
          <text class="mbp-curve-label" x="210" y="68">29岁</text>
          <text class="mbp-curve-note" x="190" y="106">事业起势</text>
          <circle class="is-warn" cx="362" cy="152" r="7"></circle>
          <text class="mbp-curve-label" x="340" y="132">36岁</text>
          <text class="mbp-curve-note" x="330" y="170">低谷期</text>
          <circle cx="526" cy="58" r="7"></circle>
          <text class="mbp-curve-label" x="506" y="38">44岁</text>
          <text class="mbp-curve-note" x="492" y="76">高峰期</text>
          <circle class="is-warn" cx="622" cy="114" r="7"></circle>
          <text class="mbp-curve-label" x="604" y="96">49岁</text>
          <text class="mbp-curve-note" x="590" y="132">调整期</text>
          <circle cx="720" cy="82" r="7"></circle>
          <text class="mbp-curve-label" x="694" y="62">56岁</text>
          <text class="mbp-curve-note" x="666" y="100">二次提升</text>
        </svg>
      </div>
      <div class="mbp-curve-cards">
        <section>
          <strong>低点</strong>
          <p><b>36岁</b> 控节奏、稳关系。</p>
        </section>
        <section>
          <strong>高点</strong>
          <p><b>44岁</b> 扩资源、定方向。</p>
        </section>
        <section>
          <strong>后势</strong>
          <p><b>56岁</b> 声望与资源回升。</p>
        </section>
      </div>
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
    return {
      subtitle: `${chart.fiveElementsClass || '五行局'} · 命宫${life?.earthlyBranch || '未见'} · 身宫${body?.earthlyBranch || '未见'}`,
    };
  }

  function setReportGeneratedState(enabled) {
    $('#report')?.classList.toggle('is-generated', enabled);
    $('#mbpChapters')?.classList.toggle('is-generated', enabled);
  }

  function generatedModuleCount() {
    return aiTasks.filter((task) => state.aiResults[task.module]).length;
  }

  function updateDecodeProgress(done = 0, runningIndex = -1, stateText = '待生成') {
    const total = aiTasks.length;
    const meter = $('#mbpDecodeMeter');
    if (meter) {
      meter.setAttribute('aria-valuemax', String(total));
      meter.setAttribute('aria-valuenow', String(Math.min(done, total)));
      meter.querySelectorAll('i').forEach((bar, index) => {
        bar.classList.toggle('is-done', index < done);
        bar.classList.toggle('is-running', index === runningIndex && index >= done);
      });
    }
    const count = $('#mbpReportReadyCount');
    if (count) count.textContent = `${Math.min(done, total)}/${total}`;
    const label = $('#mbpReportStateText');
    if (label) label.textContent = stateText;
  }

  function setModuleDone(moduleKey, done) {
    document.querySelectorAll(`[data-ai-module="${moduleKey}"]`).forEach((button) => {
      button.classList.toggle('is-done', done);
    });
  }

  function resetModuleDoneStates() {
    aiTasks.forEach((task) => setModuleDone(task.module, false));
  }

  let reportNavLockUntil = 0;

  function setActiveReportNav(index = 0) {
    const activeIndex = Math.max(0, Math.min(4, Number(index) || 0));
    document.querySelectorAll('[data-report-nav]').forEach((button) => {
      const isActive = Number(button.dataset.reportNav) === activeIndex;
      button.setAttribute('aria-current', isActive ? 'true' : 'false');
      button.closest('li')?.classList.toggle('is-active', isActive);
    });
  }

  function syncReportNav() {
    if (Date.now() < reportNavLockUntil) return;
    const chapters = [...document.querySelectorAll('[data-report-chapter]')];
    if (!chapters.length) return;
    const anchor = Math.min(220, Math.max(120, window.innerHeight * 0.28));
    let active = Number(chapters[0].dataset.reportChapter) || 0;
    let bestDistance = Infinity;
    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();
      const isReadable = rect.bottom >= 80 && rect.top <= window.innerHeight - 80;
      if (!isReadable) return;
      const distance = Math.abs(rect.top - anchor);
      if (distance < bestDistance) {
        bestDistance = distance;
        active = Number(chapter.dataset.reportChapter) || active;
      }
    });
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
    if (nearBottom) active = Number(chapters[chapters.length - 1].dataset.reportChapter) || active;
    setActiveReportNav(active);
  }

  function scrollToReportChapter(index = 0) {
    const target = document.querySelector(`[data-report-chapter="${Number(index) || 0}"]`);
    if (!target) {
      $('#report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    reportNavLockUntil = Date.now() + 900;
    setActiveReportNav(index);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function loadHtml2Pdf() {
    if (window.html2pdf) return Promise.resolve(window.html2pdf);
    if (html2PdfPromise) return html2PdfPromise;
    html2PdfPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = html2PdfUrl;
      script.async = true;
      script.onload = () => (window.html2pdf ? resolve(window.html2pdf) : reject(new Error('PDF library unavailable')));
      script.onerror = () => reject(new Error('PDF library failed to load'));
      document.head.appendChild(script);
    });
    return html2PdfPromise;
  }

  function safePdfFileName(value) {
    return String(value || '个人命盘解读')
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, '')
      .slice(0, 48) || '个人命盘解读';
  }

  function cleanCloneIds(root) {
    root.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    return root;
  }

  function buildPdfReportElement() {
    renderChart();
    const facts = chartFacts();
    const name = state.profile.name || (state.profile.gender === 'female' ? '女命' : '男命');
    const gender = state.profile.gender === 'female' ? '女命' : '男命';
    const city = state.profile.cityName || state.profile.city || '未填地点';
    const time = `${dateStr(state.profile)} ${pad2(state.profile.hour)}:${pad2(state.profile.minute)}`;
    const report = document.createElement('article');
    report.className = 'mbp-pdf-report';
    report.innerHTML = `
      <header class="mbp-pdf-head">
        <span>阅天 · 紫微命盘深度报告</span>
        <h1>${escapeHtml(name)}个人命盘解读</h1>
        <p>${escapeHtml(gender)} · ${escapeHtml(time)} · ${escapeHtml(city)}</p>
        <p>${escapeHtml(facts.subtitle || '命盘解读')}</p>
      </header>
      <section class="mbp-pdf-section">
        <h2>命盘</h2>
        <div class="mbp-pdf-chart-slot"></div>
      </section>
      <section class="mbp-pdf-section">
        <h2>命盘解读</h2>
        <div class="mbp-pdf-chapters-slot"></div>
      </section>
    `;
    const chart = $('#mbpFcCard')?.cloneNode(true);
    if (chart) {
      cleanCloneIds(chart);
      chart.classList.add('mbp-pdf-chart-card');
      chart.querySelectorAll('button').forEach((button) => button.setAttribute('disabled', ''));
      report.querySelector('.mbp-pdf-chart-slot')?.appendChild(chart);
    }
    const chapters = $('#mbpChapters')?.cloneNode(true);
    if (chapters) {
      cleanCloneIds(chapters);
      chapters.classList.add('mbp-pdf-chapters');
      report.querySelector('.mbp-pdf-chapters-slot')?.appendChild(chapters);
    }
    return report;
  }

  async function downloadMingbookPdf() {
    const btn = $('#mbpExportPdf');
    if (!state.decoded) {
      setDecodeStatus('请先完成一键批命，再打包深度报告。');
      $('#mbpDecodeBtn')?.focus({ preventScroll: true });
      return;
    }
    const original = btn?.innerHTML || '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>正在打包…</span><small>PDF</small>';
    }
    setDecodeStatus('正在打包深度报告 PDF…');
    const host = document.createElement('div');
    host.className = 'mbp-pdf-export-host';
    const report = buildPdfReportElement();
    host.appendChild(report);
    document.body.appendChild(host);
    try {
      const html2pdf = await loadHtml2Pdf();
      const filename = `${safePdfFileName(state.profile.name || '个人命盘解读')}-命盘解读.pdf`;
      await html2pdf().set({
        filename,
        margin: [8, 8, 8, 8],
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#f5efe4',
          windowWidth: 860,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['article', '.mbp-pdf-section', '.mbp-report-row'] },
      }).from(report).save();
      setDecodeStatus('PDF 已开始下载。');
    } catch (error) {
      console.error(error);
      setDecodeStatus('PDF 打包失败，请刷新后重试。');
    } finally {
      host.remove();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    }
  }

  function renderChaptersFromAi() {
    setReportGeneratedState(true);
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
      ['行动建议', overallCard.risk ? `要留意：${overallCard.risk}` : '先看命盘底色，再看大运节奏；重要决策不只问准不准，还要知道何时动、如何动。'],
    ];
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.classList.add('is-generated');
      chapters.innerHTML = chaptersData.map((item, index) => {
        const data = index === 0 ? overall : index === 1 ? luck : { card: { title: item[0], body: item[1], sections: item[2] || null } };
        return `
        <article class="mbp-report-row" id="mbp-chapter-${index}" data-report-chapter="${index}">
          <span>卷${index + 1}</span>
          <div class="mbp-report-title">
            <h3>${escapeHtml(item[0])}</h3>
          </div>
            <div class="mbp-report-content">
              ${index === 2 ? renderCurveChapterBlock() : renderInsightBlock(data, item[0], item[1], {
                summaryMax: 128,
                bulletLimit: 0,
                direct: true,
              })}
            </div>
        </article>
      `;
      }).join('');
    }
    const subtitle = $('#mbpBookSubtitle');
    if (subtitle) subtitle.textContent = facts.subtitle;
    requestAnimationFrame(syncReportNav);
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
    updateDecodeProgress(generatedModuleCount(), aiTasks.indexOf(task), task.label);
    if (task.key) setSpecialStatus(task.key, '正在生成…', 'running');
    setModuleButtonsBusy(task.module, true);
    setDecodeStatus(`正在单独批命：${task.label}`);
    try {
      const data = await callOriginalAi(task.module);
      state.aiResults[task.module] = data;
      setModuleDone(task.module, true);
      if (task.key) {
        renderSpecialAi(task.key, data, task.label);
        setSpecialStatus(task.key, '已生成', 'done');
      }
      renderChaptersFromAi();
      updateDecodeProgress(generatedModuleCount(), -1, '已生成');
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
      updateDecodeProgress(generatedModuleCount(), -1, '生成失败');
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
      btn.textContent = 'AI 批命中…';
    }
    state.decoded = true;
    state.aiResults = {};
    document.body.classList.add('is-decoded');
    setDecodeStatus('正在调用原站 AI 批命：整体批命');
    setAllModuleButtonsBusy(true);
    resetModuleDoneStates();
    updateDecodeProgress(0, 0, '生成中');

    let successCount = 0;
    for (const [index, task] of aiTasks.entries()) {
      updateDecodeProgress(successCount, index, task.label);
      if (task.key) setSpecialStatus(task.key, '正在生成…', 'running');
      setDecodeStatus(`正在调用原站 AI 批命：${task.label}`);
      try {
        const data = await callOriginalAi(task.module);
        state.aiResults[task.module] = data;
        successCount += 1;
        setModuleDone(task.module, true);
        if (task.key) {
          renderSpecialAi(task.key, data, task.label);
          setSpecialStatus(task.key, '已生成', 'done');
        }
        renderChaptersFromAi();
        updateDecodeProgress(successCount, index, task.label);
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
    updateDecodeProgress(successCount, -1, successCount ? '已生成' : '生成失败');
    setAllModuleButtonsBusy(false);
    if (btn) {
      btn.disabled = false;
      btn.textContent = successCount ? '重新一键批命' : '重试一键批命';
    }
  }

  function resetAiContent() {
    setReportGeneratedState(false);
    resetModuleDoneStates();
    updateDecodeProgress(0, -1, '待生成');
    const defaults = {
      body: ['身宫批命', '点击一键批命后生成。'],
      marriage: ['婚姻批命', '点击一键批命后生成。'],
      health: ['健康批命', '点击一键批命后生成。'],
      wealth: ['财运批命', '点击一键批命后生成。'],
      career: ['事业批命', '点击一键批命后生成。'],
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
      chapters.innerHTML = ['命格总览', '大限流年', '人生曲线', '五宫详解', '行动建议'].map((title, index) => `
        <article id="mbp-chapter-${index}" data-report-chapter="${index}"><span>卷${index + 1}</span><h3>${title}</h3><p>等待一键批命。</p></article>
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
      btn.textContent = '✦ 立即生成五卷命书';
    }
    setAllModuleButtonsBusy(false);
    setDecodeStatus('排盘后生成五卷命书。');
    requestAnimationFrame(syncReportNav);
  }

  const shichenCandidates = [
    { name: '子时', hour: 23, keys: ['子', '半夜', '午夜', '夜里'] },
    { name: '丑时', hour: 1, keys: ['丑', '凌晨'] },
    { name: '寅时', hour: 3, keys: ['寅', '天亮前', '黎明前'] },
    { name: '卯时', hour: 5, keys: ['卯', '清晨', '晨', '天亮'] },
    { name: '辰时', hour: 7, keys: ['辰', '早饭', '早上', '早'] },
    { name: '巳时', hour: 9, keys: ['巳', '上午'] },
    { name: '午时', hour: 11, keys: ['午', '中午'] },
    { name: '未时', hour: 13, keys: ['未', '午后'] },
    { name: '申时', hour: 15, keys: ['申', '下午'] },
    { name: '酉时', hour: 17, keys: ['酉', '傍晚', '黄昏'] },
    { name: '戌时', hour: 19, keys: ['戌', '日落', '晚饭', '晚'] },
    { name: '亥时', hour: 21, keys: ['亥', '晚上', '夜晚', '夜里', '睡前', '夜'] },
  ];

  const whorlGroups = {
    'center-left': ['子时', '午时', '卯时', '酉时'],
    right: ['寅时', '申时', '巳时', '亥时'],
    double: ['辰时', '戌时', '丑时', '未时'],
  };

  function openShichenModal() {
    const overlay = $('#mbpShichenOverlay');
    if (!overlay) return;
    overlay.hidden = false;
    $('#mbpShichenQuestions').hidden = false;
    $('#mbpShichenResult').hidden = true;
    $('#mbpVagueTime')?.focus();
  }

  function closeShichenModal() {
    const overlay = $('#mbpShichenOverlay');
    if (overlay) overlay.hidden = true;
  }

  function candidateByName(name) {
    return shichenCandidates.find((item) => item.name === name);
  }

  function inferShichenCandidates() {
    const vague = normalizeText($('#mbpVagueTime')?.value);
    const whorl = document.querySelector('input[name="mbpWhorl"]:checked')?.value;
    const byText = shichenCandidates.filter((item) => item.keys.some((key) => vague.includes(key)));
    const byWhorl = (whorlGroups[whorl] || []).map(candidateByName).filter(Boolean);
    const merged = byText.filter((item) => byWhorl.some((match) => match.name === item.name));
    const picks = merged.length ? merged : byText.length ? byText : byWhorl.length ? byWhorl : [candidateByName('午时')];
    return picks.filter(Boolean).slice(0, 4);
  }

  function renderShichenResult() {
    const picks = inferShichenCandidates();
    const title = $('#mbpShichenResultTitle');
    const reason = $('#mbpShichenResultReason');
    const list = $('#mbpShichenCandidates');
    const vague = normalizeText($('#mbpVagueTime')?.value) || '未填写大概时间';
    const whorl = document.querySelector('input[name="mbpWhorl"]:checked')?.parentElement?.textContent?.trim() || '未选择头旋';
    if (title) title.textContent = `推荐 ${picks.map((item) => item.name).join(' / ')}`;
    if (reason) reason.textContent = `依据：${vague}；${whorl}。可先采用最接近的时辰排盘，后续再核对人生事件。`;
    if (list) {
      list.innerHTML = picks.map((item) => `<button type="button" data-shichen-hour="${item.hour}" data-shichen-name="${item.name}">${item.name} · ${pad2(item.hour)}:00</button>`).join('');
    }
    $('#mbpShichenQuestions').hidden = true;
    $('#mbpShichenResult').hidden = false;
  }

  function applyShichenCandidate(button) {
    const hour = Number(button.dataset.shichenHour);
    const name = button.dataset.shichenName || '候选时辰';
    const hourEl = $('#mbpHour');
    const minuteEl = $('#mbpMinute');
    if (hourEl) hourEl.value = String(hour);
    if (minuteEl) minuteEl.value = '0';
    updateTrueSolarPreview();
    const preview = $('#mbpShichenPreview');
    if (preview) preview.textContent = `已按天纪推时辰采用：${name} ${pad2(hour)}:00。${preview.textContent ? ` ${preview.textContent}` : ''}`;
    closeShichenModal();
  }

  function saveProfile() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.profile));
    } catch (_) {}
  }

  function bindEvents() {
    function rerenderAfterProfileChange() {
      resetForProfileChange();
      saveProfile();
      updateForm();
      renderChart();
    }

    $('#mbpClientToggle')?.addEventListener('click', (event) => {
      event.stopPropagation();
      const menu = $('#mbpClientMenu');
      const toggle = $('#mbpClientToggle');
      if (!menu || !toggle) return;
      const nextOpen = menu.hidden;
      renderClientList();
      menu.hidden = !nextOpen;
      toggle.setAttribute('aria-expanded', String(nextOpen));
    });

    $('#mbpClientList')?.addEventListener('click', (event) => {
      const item = event.target.closest('.mbp-client-item');
      if (!item) return;
      const record = clientRecordsCache[Number(item.dataset.clientIndex)];
      if (record?.profile) applyClientProfile(record.profile);
    });

    $('#mbpClientNew')?.addEventListener('click', () => {
      applyClientProfile({ ...defaultProfile, name: '' });
      $('#mbpBirthForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#mbpClientPicker')) closeClientMenu();
    });

    document.querySelectorAll('.mbp-fc-card .fc-tab').forEach((button) => {
      button.addEventListener('click', () => {
        fcActiveTab = button.dataset.tab || '先天卦';
        fcRenderTabs();
        if (fcActiveTab === '流年卦') fcRenderLiunianScroll();
        fcRenderHexagram();
        fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
      });
    });

    $('#mbpFcScrollLeft')?.addEventListener('click', () => {
      $('#mbpFcLiunianScroll')?.scrollBy({ left: -100, behavior: 'smooth' });
    });
    $('#mbpFcScrollRight')?.addEventListener('click', () => {
      $('#mbpFcLiunianScroll')?.scrollBy({ left: 100, behavior: 'smooth' });
    });
    $('#mbpFcTimeUp')?.addEventListener('click', () => {
      state.profile = normalizeProfile({ ...state.profile, hour: (state.profile.hour + 1) % 24 });
      rerenderAfterProfileChange();
    });
    $('#mbpFcTimeDown')?.addEventListener('click', () => {
      state.profile = normalizeProfile({ ...state.profile, hour: (state.profile.hour + 23) % 24 });
      rerenderAfterProfileChange();
    });

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

    $('#mbpUnknownTime')?.addEventListener('click', openShichenModal);
    $('#mbpShichenClose')?.addEventListener('click', closeShichenModal);
    $('#mbpShichenOverlay')?.addEventListener('click', (event) => {
      if (event.target.id === 'mbpShichenOverlay') closeShichenModal();
    });
    $('#mbpShichenCalc')?.addEventListener('click', renderShichenResult);
    $('#mbpShichenBack')?.addEventListener('click', () => {
      $('#mbpShichenQuestions').hidden = false;
      $('#mbpShichenResult').hidden = true;
      $('#mbpVagueTime')?.focus();
    });
    $('#mbpShichenCandidates')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-shichen-hour]');
      if (button) applyShichenCandidate(button);
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
      saveProfileToHistory(state.profile);
      renderChart();
      $('#chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#mbpDecodeBtn')?.addEventListener('click', async () => {
      await decodeReports();
      scrollToReportChapter(0);
    });

    document.querySelectorAll('[data-ai-module]').forEach((button) => {
      button.addEventListener('click', () => {
        decodeSingleModule(button.dataset.aiModule, { scroll: button.classList.contains('mbp-card-ai-btn') });
      });
    });

    $('#mbpBookMenu')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-report-nav]');
      if (!button) return;
      scrollToReportChapter(button.dataset.reportNav);
    });

    $('#mbpExportPdf')?.addEventListener('click', downloadMingbookPdf);

    let reportNavTicking = false;
    const queueReportNavSync = () => {
      if (reportNavTicking) return;
      reportNavTicking = true;
      requestAnimationFrame(() => {
        reportNavTicking = false;
        syncReportNav();
      });
    };
    window.addEventListener('scroll', queueReportNavSync, { passive: true });
    window.addEventListener('resize', queueReportNavSync);
    syncReportNav();
  }

  updateForm();
  bindEvents();
  renderChart();
}());
