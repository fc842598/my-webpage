(function () {
  const storageKey = 'yt_mingbook_onepage_profile_v1';
  const legacyHistoryKey = 'yt_zw_history_v1';
  const chartHistoryKey = 'ziwei_local_chart_history_v1';
  const customerTombstonesKey = 'ziwei_customer_chart_tombstones_v1';
  const customerClientIdKey = 'ziwei_client_id';
  const html2PdfUrl = '../vendor/html2pdf/html2pdf.bundle.min.js?v=20260521-local-vendor';
  const palaceOrder = ['巳', '午', '未', '申', '辰', null, null, '酉', '卯', null, null, '戌', '寅', '丑', '子', '亥'];
  const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const stemElements = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  const branchSeasons = { 寅: '春木', 卯: '春木', 辰: '季春土', 巳: '夏火', 午: '夏火', 未: '季夏土', 申: '秋金', 酉: '秋金', 戌: '季秋土', 亥: '冬水', 子: '冬水', 丑: '季冬土' };
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
  const fcDuiGong = {
    子: '午', 丑: '未', 寅: '申', 卯: '酉', 辰: '戌', 巳: '亥',
    午: '子', 未: '丑', 申: '寅', 酉: '卯', 戌: '辰', 亥: '巳',
  };
  let fcActiveTab = '先天卦';
  let fcActiveAge = 1;
  let fcBirthYear = 1990;
  let fcSequenceStartYear = 1990;
  let fcZipingMaxAge = 100;
  const decadeDisplayMaxStartAge = 100;
  const xiaoLianDisplayMaxAge = 100;
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
  let fcXiaoLianPulseTimer = null;
  let yijingTimingOpen = false;
  let yijingTimingAiBusy = false;
  let yijingTimingAiResult = null;
  let yijingTimingAiError = '';
  let yijingTimingAiKey = '';
  const defaultProfile = { name: '', year: 1991, month: 2, day: 16, hour: 22, minute: 8, gender: 'male', city: '广东 深圳', cityName: '广东 深圳' };
  const defaultCityScope = 'china';
  const chinaCityRegions = new Set([
    '北京', '上海', '天津', '重庆',
    '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东',
    '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海',
    '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门', '台湾',
  ]);
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
    chartRecordId: '',
    norm: null,
    chartReady: false,
    chartConfirmedKey: '',
    decoded: false,
    aiResults: {},
    luckAiResults: {},
    xiaoLianAiResults: {},
    selectedLuckRangeKey: '',
    selectedXiaoLianAge: '',
    batchDecoding: false,
    curveGenerated: false,
    adviceGenerated: false,
  };
  let formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
  let selectedCity = null;
  let cityDeleteArmed = false;
  let cityScope = state.profile.cityScope || defaultCityScope;
  let clientRecordsCache = [];
  let clientRemoteLoaded = false;
  let clientRemoteSyncing = false;
  let clientRemoteMessage = '';
  let clientRemotePromise = null;
  let editingClientRecordId = '';
  let deleteConfirmClientId = '';
  let html2PdfPromise = null;
  let inputGuideTimer = null;
  let mbpAiHistory = [];
  let mbpAiBusy = false;
  let mbpAiDraft = {};
  const aiBackendBase = ((window.SITE_CONFIG && window.SITE_CONFIG.aiBackendBase) || 'https://api.yuetianai.com').replace(/\/$/, '');
  const desktopAuthStorageKey = 'yt_mingbook_auth_session_v1';
  const desktopAuthRefreshSkewMs = 60 * 1000;
  const desktopGoogleEnabled = true;
  const desktopAuthUrlKeys = [
    'code',
    'state',
    'error',
    'error_code',
    'error_description',
    'access_token',
    'refresh_token',
    'expires_at',
    'expires_in',
    'provider_refresh_token',
    'provider_token',
    'token_type',
    'type',
  ];
  const desktopAuthState = {
    open: false,
    mode: 'login',
    loading: false,
    error: '',
    session: null,
    quota: null,
  };
  const desktopMemberProductKey = 'monthly_member';
  const desktopFreeDailyLimit = 20;
  const desktopPaidDailyLimit = 100;
  const desktopPaidProductName = '阅天AI';
  const desktopPaidProductDesc = '许大师 AI 对话 100 次/天，按日刷新。';
  const desktopPaymentPollMs = 3000;
  const desktopPaymentState = {
    open: false,
    loading: false,
    status: 'idle',
    message: '权益绑定当前账号，电脑和手机共用。',
    error: '',
    product: null,
    providers: [],
    provider: 'wechat',
    orderNo: '',
    payUrl: '',
    payMethod: '',
    mockMode: false,
  };
  const desktopRefundTicketState = {
    open: false,
    loading: false,
    loaded: false,
    orders: [],
    orderNo: '',
    paymentProvider: 'wechat',
    paidDate: '',
    contact: '',
    note: '',
    screenshotDataUrl: '',
    screenshotName: '',
    message: '退款需上传当时支付截图，后台审核后进入对应支付渠道处理，7个工作日内完成。',
    error: '',
  };
  let desktopAuthReadyPromise = null;
  let desktopPaymentPollTimer = null;
  let desktopPendingPaymentAfterLogin = false;
  const desktopLiuyaoLineLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  const desktopLiuyaoTrigrams = {
    111: { gua: '乾', name: '天' },
    110: { gua: '兑', name: '泽' },
    101: { gua: '离', name: '火' },
    100: { gua: '震', name: '雷' },
    '011': { gua: '巽', name: '风' },
    '010': { gua: '坎', name: '水' },
    '001': { gua: '艮', name: '山' },
    '000': { gua: '坤', name: '地' },
  };
  const desktopLiuyaoHexMap = {
    '乾-乾': { no: '1', name: '乾为天' },
    '坤-坤': { no: '2', name: '坤为地' },
    '坎-震': { no: '3', name: '水雷屯' },
    '艮-坎': { no: '4', name: '山水蒙' },
    '坎-乾': { no: '5', name: '水天需' },
    '乾-坎': { no: '6', name: '天水讼' },
    '坤-坎': { no: '7', name: '地水师' },
    '坎-坤': { no: '8', name: '水地比' },
    '巽-乾': { no: '9', name: '风天小畜' },
    '乾-兑': { no: '10', name: '天泽履' },
    '坤-乾': { no: '11', name: '地天泰' },
    '乾-坤': { no: '12', name: '天地否' },
    '乾-离': { no: '13', name: '天火同人' },
    '离-乾': { no: '14', name: '火天大有' },
    '坤-艮': { no: '15', name: '地山谦' },
    '震-坤': { no: '16', name: '雷地豫' },
    '兑-震': { no: '17', name: '泽雷随' },
    '艮-巽': { no: '18', name: '山风蛊' },
    '坤-兑': { no: '19', name: '地泽临' },
    '巽-坤': { no: '20', name: '风地观' },
    '离-震': { no: '21', name: '火雷噬嗑' },
    '艮-离': { no: '22', name: '山火贲' },
    '艮-坤': { no: '23', name: '山地剥' },
    '坤-震': { no: '24', name: '地雷复' },
    '乾-震': { no: '25', name: '天雷无妄' },
    '艮-乾': { no: '26', name: '山天大畜' },
    '艮-震': { no: '27', name: '山雷颐' },
    '兑-巽': { no: '28', name: '泽风大过' },
    '坎-坎': { no: '29', name: '坎为水' },
    '离-离': { no: '30', name: '离为火' },
    '兑-艮': { no: '31', name: '泽山咸' },
    '震-巽': { no: '32', name: '雷风恒' },
    '乾-艮': { no: '33', name: '天山遁' },
    '震-乾': { no: '34', name: '雷天大壮' },
    '离-坤': { no: '35', name: '火地晋' },
    '坤-离': { no: '36', name: '地火明夷' },
    '巽-离': { no: '37', name: '风火家人' },
    '离-兑': { no: '38', name: '火泽睽' },
    '坎-艮': { no: '39', name: '水山蹇' },
    '震-坎': { no: '40', name: '雷水解' },
    '艮-兑': { no: '41', name: '山泽损' },
    '巽-震': { no: '42', name: '风雷益' },
    '兑-乾': { no: '43', name: '泽天夬' },
    '乾-巽': { no: '44', name: '天风姤' },
    '兑-坤': { no: '45', name: '泽地萃' },
    '坤-巽': { no: '46', name: '地风升' },
    '兑-坎': { no: '47', name: '泽水困' },
    '坎-巽': { no: '48', name: '水风井' },
    '兑-离': { no: '49', name: '泽火革' },
    '离-巽': { no: '50', name: '火风鼎' },
    '震-震': { no: '51', name: '震为雷' },
    '艮-艮': { no: '52', name: '艮为山' },
    '巽-艮': { no: '53', name: '风山渐' },
    '震-兑': { no: '54', name: '雷泽归妹' },
    '震-离': { no: '55', name: '雷火丰' },
    '离-艮': { no: '56', name: '火山旅' },
    '巽-巽': { no: '57', name: '巽为风' },
    '兑-兑': { no: '58', name: '兑为泽' },
    '巽-坎': { no: '59', name: '风水涣' },
    '坎-兑': { no: '60', name: '水泽节' },
    '巽-兑': { no: '61', name: '风泽中孚' },
    '震-艮': { no: '62', name: '雷山小过' },
    '坎-离': { no: '63', name: '水火既济' },
    '离-坎': { no: '64', name: '火水未济' },
  };
  const desktopLiuyaoState = {
    open: false,
    question: '',
    casts: [],
    lastCoins: [],
    error: '',
  };

  const aiTasks = [
    { module: 'overall', label: '整体批命' },
    { module: 'current_luck', label: '十年大限解读' },
    { module: 'xiaoxian_liunian', label: '小限流年' },
    { module: 'shengong', key: 'body', label: '身宫批命' },
    { module: 'hunyin', key: 'marriage', label: '婚姻批命' },
    { module: 'jiankang', key: 'health', label: '健康批命' },
    { module: 'caiyun', key: 'wealth', label: '财运批命' },
    { module: 'shiye', key: 'career', label: '事业批命' },
    { module: 'life_curve', label: '人生曲线' },
    { module: 'action_advice', label: '行动建议' },
  ];

  const chapterActions = [
    { label: '单独批总局', module: 'overall' },
    { label: '单独批专题', action: 'specials' },
    { label: '批选中十年', module: 'current_luck' },
    { label: '单独批小限', module: 'xiaoxian_liunian' },
    { label: '生成曲线', module: 'life_curve' },
    { label: '生成建议', module: 'action_advice' },
  ];

  function isCurrentLuckSelection() {
    try {
      const info = selectedLuckInfo({ readonly: true });
      return !!info.selected && !!info.current && info.selected.key === info.current.key;
    } catch (_) {
      return false;
    }
  }

  function chapterActionButton(index) {
    const action = chapterActions[index];
    if (!action) return '';
    if (action.module === 'current_luck' && isCurrentLuckSelection()) return '';
    const attr = action.module
      ? `data-report-module="${escapeHtml(action.module)}"`
      : `data-report-action="${escapeHtml(action.action)}"`;
    return `
      <div class="mbp-report-actions">
        <button class="mbp-chapter-ai-btn" type="button" ${attr}>${escapeHtml(action.label)}</button>
        <span class="mbp-reading-badge">生成中</span>
      </div>
    `;
  }

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
    const cityTimeZone = String(
      input.cityTimeZone
      || input.timeZone
      || cityObj?.timeZone
      || cityObj?.tzid
      || (cityObj && typeof getBirthTimeZoneId === 'function' ? getBirthTimeZoneId(cityObj) : '')
    ).trim();
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
      cityTimeZone,
      cityScope: input.cityScope === 'global' || cityObj?.scope === 'global' || (cityObj && !isChinaCity(cityObj)) ? 'global' : defaultCityScope,
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
    if (!hasProfileParams()) return null;
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

  function hasProfileParams() {
    const params = new URLSearchParams(location.search);
    return ['year', 'month', 'day', 'hour', 'minute', 'gender', 'city'].some((key) => params.has(key));
  }

  function profileFromSaved() {
    try {
      const raw = localStorage.getItem(storageKey);
      const profile = raw ? normalizeProfile(JSON.parse(raw)) : null;
      if (isLegacyDefaultProfile(profile) || isLegacyOnlyProfile(profile)) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return profile;
    } catch (_) {
      return null;
    }
  }

  function isLegacyDefaultProfile(profile) {
    if (!profile) return false;
    const city = String(profile.city || profile.cityName || '');
    return !profile.name
      && profile.gender === 'male'
      && Number(profile.year) === 1990
      && Number(profile.month) === 8
      && Number(profile.day) === 16
      && Number(profile.hour) === 12
      && Number(profile.minute) === 0
      && /北京|东城/.test(city);
  }

  function isLegacyOnlyProfile(profile) {
    if (!profile) return false;
    const key = profileHistoryKey(profile);
    if (!key) return false;
    const hasModernRecord = readJsonList(chartHistoryKey)
      .some((record) => profileHistoryKey(recordToProfile(record)) === key);
    if (hasModernRecord) return false;
    return readJsonList(legacyHistoryKey)
      .some((record) => profileHistoryKey(recordToProfile(record)) === key);
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

  function readDesktopStoredSession() {
    try {
      const raw = localStorage.getItem(desktopAuthStorageKey);
      const session = raw ? JSON.parse(raw) : null;
      return session?.access_token && session?.user ? session : null;
    } catch (_) {
      return null;
    }
  }

  function saveDesktopAuthSession(session) {
    try {
      if (session?.access_token && session?.refresh_token) {
        localStorage.setItem(desktopAuthStorageKey, JSON.stringify(session));
      } else {
        localStorage.removeItem(desktopAuthStorageKey);
      }
    } catch (_) {}
  }

  function setDesktopAuthSession(session) {
    desktopAuthState.session = session || null;
    if (!session?.user) desktopAuthState.quota = null;
    saveDesktopAuthSession(session);
    renderDesktopAuth();
    updateDesktopQuotaDisplay();
    if (session?.user) hydrateDesktopMemberStatus({ force: true });
  }

  function isDesktopSessionExpiring(session) {
    if (!session?.expires_at) return false;
    return Date.now() >= (Number(session.expires_at) * 1000) - desktopAuthRefreshSkewMs;
  }

  function getDesktopAuthUrlParams(raw) {
    return new URLSearchParams(String(raw || '').replace(/^[?#]/, ''));
  }

  function hasDesktopAuthParams(raw) {
    const params = getDesktopAuthUrlParams(raw);
    return desktopAuthUrlKeys.some((key) => params.has(key));
  }

  function isDesktopAuthCallbackUrl() {
    return hasDesktopAuthParams(window.location.search) || hasDesktopAuthParams(window.location.hash);
  }

  function getDesktopAuthCallbackValue(key) {
    const searchValue = getDesktopAuthUrlParams(window.location.search).get(key);
    if (searchValue) return searchValue;
    return getDesktopAuthUrlParams(window.location.hash).get(key);
  }

  function getDesktopAuthCallbackError() {
    const error = getDesktopAuthCallbackValue('error_description')
      || getDesktopAuthCallbackValue('error')
      || getDesktopAuthCallbackValue('error_code');
    return error ? String(error).replace(/\+/g, ' ') : '';
  }

  function buildDesktopAuthSessionFromCallback() {
    const accessToken = getDesktopAuthCallbackValue('access_token');
    const refreshToken = getDesktopAuthCallbackValue('refresh_token');
    if (!accessToken || !refreshToken) return null;
    const expiresIn = Number(getDesktopAuthCallbackValue('expires_in') || 3600);
    const expiresAt = Number(getDesktopAuthCallbackValue('expires_at'))
      || Math.floor(Date.now() / 1000) + (Number.isFinite(expiresIn) ? expiresIn : 3600);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      expires_in: Number.isFinite(expiresIn) ? expiresIn : null,
      token_type: getDesktopAuthCallbackValue('token_type') || 'bearer',
      user: null,
    };
  }

  function clearDesktopAuthCallbackUrl() {
    const params = new URLSearchParams(window.location.search);
    desktopAuthUrlKeys.forEach((key) => params.delete(key));
    const query = params.toString();
    const hash = hasDesktopAuthParams(window.location.hash) ? '' : window.location.hash;
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${hash || ''}`);
  }

  function getDesktopEntryIntent() {
    const value = new URLSearchParams(window.location.search).get('entry');
    return value ? String(value).trim().toLowerCase() : '';
  }

  function clearDesktopEntryIntent() {
    const params = new URLSearchParams(window.location.search);
    params.delete('entry');
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`);
  }

  async function handleDesktopEntryIntent() {
    const intent = getDesktopEntryIntent();
    if (!intent) return;
    clearDesktopEntryIntent();
    try {
      if (intent === 'member') {
        await openDesktopMemberPayment();
        return;
      }
      if (intent === 'login') openDesktopAuth('login');
    } finally {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove('mbp-entry-intent');
      });
    }
  }

  function getDesktopGoogleRedirectUrl() {
    const configBase = String(window.SITE_CONFIG?.frontendBaseUrl || '').trim().replace(/\/+$/, '');
    const origin = configBase || window.location.origin.replace(/\/+$/, '');
    return new URL('/pages/mingbook-onepage.html', `${origin}/`).toString();
  }

  function phoneToDesktopAuthEmail(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (!digits || digits.length < 6 || digits.length > 20) return '';
    return `phone_${digits}@yuetianai.local`;
  }

  function inputToDesktopAuthEmail(value) {
    const raw = String(value || '').trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return raw.toLowerCase();
    return phoneToDesktopAuthEmail(raw);
  }

  function getDesktopAuthUserLabel(session = desktopAuthState.session) {
    const user = session?.user;
    if (!user) return '';
    return String(user.user_metadata?.phone || user.email || '已登录').trim();
  }

  function shortenDesktopAuthLabel(label) {
    const raw = String(label || '').trim();
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 11) return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
    if (/@/.test(raw)) {
      const [name, domain] = raw.split('@');
      if (name && domain) return `${name.slice(0, 3)}***@${domain}`;
    }
    return raw.length > 18 ? `${raw.slice(0, 18)}…` : raw;
  }

  function getDesktopAuthDisplayLabel(session = desktopAuthState.session) {
    const user = session?.user;
    if (!user) return '';
    const raw = String(
      user.user_metadata?.name
      || user.user_metadata?.full_name
      || user.user_metadata?.phone
      || user.email
      || ''
    ).trim();
    return shortenDesktopAuthLabel(raw);
  }

  async function getDesktopAuthSession(options = {}) {
    const current = desktopAuthState.session || readDesktopStoredSession();
    if (current && !options.force && !isDesktopSessionExpiring(current)) {
      desktopAuthState.session = current;
      return current;
    }
    if (!current?.refresh_token) {
      desktopAuthState.session = current || null;
      return desktopAuthState.session;
    }
    try {
      const data = await desktopFetchJson('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: current.refresh_token },
        noAuth: true,
      });
      desktopAuthState.session = data?.session || null;
      saveDesktopAuthSession(desktopAuthState.session);
      return desktopAuthState.session;
    } catch (err) {
      desktopAuthState.session = null;
      saveDesktopAuthSession(null);
      return null;
    }
  }

  async function getDesktopAuthToken() {
    const session = await getDesktopAuthSession();
    return session?.access_token || '';
  }

  window._getMingbookAuthToken = getDesktopAuthToken;

  function setDesktopAuthError(text) {
    desktopAuthState.error = text || '';
    const el = $('#mbpAuthError');
    if (!el) return;
    el.textContent = desktopAuthState.error;
    el.hidden = !desktopAuthState.error;
  }

  function getDesktopQuotaPlanName(quota = desktopAuthState.quota) {
    return quota?.isMember ? '付费版' : '免费版';
  }

  function getDesktopQuotaLabelName(quota = desktopAuthState.quota) {
    return quota?.isMember ? '付费' : '免费';
  }

  function getDesktopQuotaSharedText(quota = desktopAuthState.quota) {
    const plan = getDesktopQuotaPlanName(quota);
    const dailyLimit = quota?.baseDailyLimit ?? quota?.dailyLimit ?? quota?.limit ?? (quota?.isMember ? desktopPaidDailyLimit : desktopFreeDailyLimit);
    const expiresText = getDesktopMemberExpiresText(quota);
    return `${plan}额度与手机端共用：${dailyLimit}次/天，按日刷新${expiresText ? ` · ${expiresText}` : ''}`;
  }

  function formatDesktopMemberDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function getDesktopMemberExpiresAt(quota = desktopAuthState.quota) {
    return quota?.memberExpiresAt || quota?.member_expires_at || quota?.expiresAt || quota?.expires_at || '';
  }

  function getDesktopMemberExpiresText(quota = desktopAuthState.quota) {
    if (!quota?.isMember) return '';
    const dateText = formatDesktopMemberDate(getDesktopMemberExpiresAt(quota));
    return dateText ? `有效期至 ${dateText}` : '';
  }

  function getDesktopMemberProduct() {
    const product = desktopPaymentState.product || {};
    return {
      ...product,
      name: desktopPaidProductName,
      description: desktopPaidProductDesc,
      amountYuan: product.amountYuan || '19.90',
    };
  }

  function normalizeDesktopQuota(quota) {
    if (!quota) return quota;
    if (quota.testingUnlimited) return quota;
    const isMember = !!quota.isMember;
    const baseLimit = isMember ? desktopPaidDailyLimit : desktopFreeDailyLimit;
    const used = Number(quota.dailyUsed ?? quota.used ?? 0) || 0;
    const bonusRemaining = Math.max(0, Number(quota.referralBonus?.remaining || 0));
    const dailyLimit = baseLimit + bonusRemaining;
    const dailyRemaining = Math.max(0, dailyLimit - used);
    return {
      ...quota,
      dailyLimit,
      limit: dailyLimit,
      baseDailyLimit: baseLimit,
      dailyRemaining,
      remaining: dailyRemaining,
      monthlyLimit: null,
      baseMonthlyLimit: null,
      monthlyRemaining: null,
      baseMonthlyRemaining: null,
      monthlyUsed: null,
    };
  }

  function getDesktopPaymentProviders() {
    const list = Array.isArray(desktopPaymentState.providers) ? desktopPaymentState.providers : [];
    const byKey = new Map(list.map((item) => [item.provider, item]));
    return [
      { provider: 'wechat', label: '微信支付', enabled: true, ...(byKey.get('wechat') || {}) },
      { provider: 'alipay', label: '支付宝', enabled: false, ...(byKey.get('alipay') || {}) },
    ];
  }

  function getDesktopPaymentProviderMeta(provider = desktopPaymentState.provider) {
    return getDesktopPaymentProviders().find((item) => item.provider === provider) || getDesktopPaymentProviders()[0];
  }

  function getDesktopPaymentProviderLabel() {
    return getDesktopPaymentProviderMeta().label || (desktopPaymentState.provider === 'alipay' ? '支付宝' : '微信支付');
  }

  function getDesktopPaymentProviderAppLabel() {
    return getDesktopPaymentProviderLabel().replace(/支付$/, '');
  }

  function setDesktopPaymentProviders(providers) {
    if (Array.isArray(providers)) desktopPaymentState.providers = providers;
    const current = getDesktopPaymentProviderMeta(desktopPaymentState.provider);
    if (!current?.enabled) desktopPaymentState.provider = 'wechat';
  }

  function updateDesktopMemberEntry() {
    const isMember = !!desktopAuthState.quota?.isMember;
    const product = getDesktopMemberProduct();
    const expiresText = getDesktopMemberExpiresText();
    const label = $('#mbpMemberPayLabel');
    const meta = $('#mbpMemberPayMeta');
    const trigger = $('#mbpMemberPayTrigger');
    if (label) label.textContent = '会员';
    if (meta) meta.textContent = isMember ? (expiresText ? expiresText.replace('有效期', '') : '会员有效') : `¥${product.amountYuan || '19.90'}`;
    if (trigger) {
      trigger.classList.toggle('is-member', isMember);
      trigger.disabled = desktopPaymentState.loading;
    }
    const authPay = $('#mbpAuthMemberPay');
    if (authPay) {
      authPay.textContent = isMember ? `续费 ¥${product.amountYuan || '19.90'}` : `开通付费版 ¥${product.amountYuan || '19.90'}`;
      authPay.disabled = desktopAuthState.loading || desktopPaymentState.loading;
    }
  }

  function setDesktopQuotaLabel(valueSelector, text) {
    const value = $(valueSelector);
    const label = value?.previousElementSibling;
    if (label) label.textContent = text;
  }

  function updateDesktopQuotaDisplay(quota) {
    if (quota) {
      desktopAuthState.quota = {
        ...(desktopAuthState.quota || {}),
        ...normalizeDesktopQuota(quota),
      };
    }
    const loggedIn = !!desktopAuthState.session?.user;
    const authTrigger = $('#mbpAuthTrigger');
    if (authTrigger) authTrigger.classList.toggle('is-member', loggedIn && !!desktopAuthState.quota?.isMember);
    const authTriggerMeta = $('#mbpAuthTriggerMeta');
    if (authTriggerMeta && loggedIn) {
      authTriggerMeta.textContent = desktopAuthState.quota?.isMember ? 'VIP已开通' : '电脑端已登录';
    }
    const statusWrap = document.querySelector('#aip-panel-chat .xb-status-hidden');
    if (statusWrap) statusWrap.hidden = !loggedIn;
    const quotaBar = $('#chat-quota-bar');
    if (quotaBar) quotaBar.style.display = loggedIn && desktopAuthState.quota ? 'flex' : 'none';
    const quotaText = $('#chat-quota-text');
    if (quotaText) {
      const remaining = desktopAuthState.quota?.dailyRemaining ?? desktopAuthState.quota?.remaining ?? '--';
      const limit = desktopAuthState.quota?.dailyLimit ?? desktopAuthState.quota?.limit ?? '--';
      quotaText.textContent = `${remaining} / ${limit}`;
    }
    const upgrade = $('#chat-quota-upgrade');
    if (upgrade) upgrade.style.display = 'none';

    const planName = getDesktopQuotaPlanName();
    const labelName = getDesktopQuotaLabelName();
    const daily = $('#mbpAuthQuotaDaily');
    if (daily) {
      const remaining = desktopAuthState.quota?.dailyRemaining ?? '--';
      const limit = desktopAuthState.quota?.dailyLimit ?? '--';
      daily.textContent = `${remaining}/${limit}`;
    }
    setDesktopQuotaLabel('#mbpAuthQuotaDaily', `今日${labelName}额度`);
    const monthly = $('#mbpAuthQuotaMonthly');
    if (monthly) {
      const limit = desktopAuthState.quota?.dailyLimit ?? desktopAuthState.quota?.limit ?? (desktopAuthState.quota?.isMember ? desktopPaidDailyLimit : desktopFreeDailyLimit);
      monthly.textContent = `${limit}次/天`;
    }
    setDesktopQuotaLabel('#mbpAuthQuotaMonthly', `每日${labelName}额度`);
    const badge = $('#mbpAuthSessionBadge');
    if (badge) badge.textContent = planName;

    const title = $('#mbpAuthTitle');
    if (title && loggedIn) title.textContent = `${planName}账号`;
    const sessionMeta = $('#mbpAuthSessionMeta');
    if (sessionMeta && loggedIn) sessionMeta.textContent = getDesktopQuotaSharedText();
    updateDesktopMemberEntry();
  }

  window._updateQuotaDisplay = updateDesktopQuotaDisplay;

  function renderDesktopAuth() {
    const loggedIn = !!desktopAuthState.session?.user;
    const trigger = $('#mbpAuthTrigger');
    const authDisplayLabel = loggedIn ? getDesktopAuthDisplayLabel() : '';
    const authLabel = loggedIn ? shortenDesktopAuthLabel(getDesktopAuthUserLabel()) : '登录';
    if (trigger) {
      trigger.classList.toggle('is-logged-in', loggedIn);
      trigger.classList.toggle('is-member', loggedIn && !!desktopAuthState.quota?.isMember);
      trigger.setAttribute('aria-expanded', desktopAuthState.open ? 'true' : 'false');
      trigger.setAttribute('aria-label', loggedIn ? `当前账号：${authLabel || '已登录'}` : '登录');
      if (authDisplayLabel) trigger.setAttribute('aria-label', `当前账号：${authDisplayLabel}`);
      trigger.disabled = desktopAuthState.loading;
    }
    const triggerLabel = $('#mbpAuthTriggerLabel');
    if (triggerLabel) triggerLabel.textContent = authLabel || (loggedIn ? '已登录' : '登录');
    if (triggerLabel && authDisplayLabel) triggerLabel.textContent = authDisplayLabel;
    const triggerMeta = $('#mbpAuthTriggerMeta');
    if (triggerMeta) {
      triggerMeta.textContent = loggedIn
        ? (desktopAuthState.quota?.isMember ? 'VIP已开通' : '电脑端已登录')
        : '电脑端账号';
    }

    const overlay = $('#mbpAuthOverlay');
    if (overlay) overlay.hidden = !desktopAuthState.open;
    document.body.classList.toggle('mbp-auth-open', desktopAuthState.open);

    const sessionCard = $('#mbpAuthSessionCard');
    const formWrap = $('#mbpAuthFormWrap');
    if (sessionCard) sessionCard.hidden = !loggedIn;
    if (formWrap) formWrap.hidden = loggedIn;

    const title = $('#mbpAuthTitle');
    if (title) title.textContent = loggedIn ? `${getDesktopQuotaPlanName()}账号` : (desktopAuthState.mode === 'register' ? '电脑端注册' : '电脑端登录');

    if (loggedIn) {
      const label = getDesktopAuthUserLabel();
      const sessionLabel = $('#mbpAuthSessionLabel');
      if (sessionLabel) sessionLabel.textContent = shortenDesktopAuthLabel(label) || '已登录';
      if (sessionLabel && authDisplayLabel) sessionLabel.textContent = authDisplayLabel;
      const sessionMeta = $('#mbpAuthSessionMeta');
      if (sessionMeta) sessionMeta.textContent = getDesktopQuotaSharedText();
      updateDesktopQuotaDisplay();
    } else {
      const loginTab = $('#mbpAuthModeLogin');
      const registerTab = $('#mbpAuthModeRegister');
      const isRegister = desktopAuthState.mode === 'register';
      if (loginTab) {
        loginTab.classList.toggle('is-active', !isRegister);
        loginTab.setAttribute('aria-selected', !isRegister ? 'true' : 'false');
      }
      if (registerTab) {
        registerTab.classList.toggle('is-active', isRegister);
        registerTab.setAttribute('aria-selected', isRegister ? 'true' : 'false');
      }
      const accountLabel = $('#mbpAuthAccountLabel');
      if (accountLabel) accountLabel.textContent = isRegister ? '手机号' : '手机号 / 邮箱';
      const accountInput = $('#mbpAuthAccount');
      if (accountInput) {
        accountInput.placeholder = isRegister ? '请输入手机号' : '请输入手机号或邮箱';
        accountInput.autocomplete = isRegister ? 'tel' : 'username';
      }
      const passwordInput = $('#mbpAuthPassword');
      if (passwordInput) passwordInput.autocomplete = isRegister ? 'new-password' : 'current-password';
      const submit = $('#mbpAuthSubmit');
      if (submit) {
        submit.textContent = desktopAuthState.loading ? '处理中...' : (isRegister ? '注册并登录' : '登录并继续');
        submit.disabled = desktopAuthState.loading;
      }
      const google = $('#mbpAuthGoogle');
      if (google) {
        google.hidden = !desktopGoogleEnabled;
        google.disabled = desktopAuthState.loading || !desktopGoogleEnabled;
      }
      const note = $('#mbpAuthNote');
      if (note) note.textContent = isRegister
        ? '注册后会直接登录，同一账号可在电脑端和手机端共用。'
        : '电脑端登录后，账号状态会和手机端保持连通。';
    }

    ['#mbpAuthClose', '#mbpAuthLogout', '#mbpAuthChangeAccount'].forEach((selector) => {
      const el = $(selector);
      if (el) el.disabled = desktopAuthState.loading;
    });

    updateDesktopMemberEntry();
    setDesktopAuthError(desktopAuthState.error);
  }

  function focusDesktopAuthField() {
    window.setTimeout(() => {
      if (desktopAuthState.session?.user) {
        $('#mbpAuthChangeAccount')?.focus();
      } else {
        $('#mbpAuthAccount')?.focus();
      }
    }, 24);
  }

  function openDesktopAuth(mode = 'login') {
    if (!desktopAuthState.session?.user) desktopAuthState.mode = mode === 'register' ? 'register' : 'login';
    desktopAuthState.open = true;
    desktopAuthState.error = '';
    renderDesktopAuth();
    if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
    focusDesktopAuthField();
  }

  function closeDesktopAuth() {
    desktopAuthState.open = false;
    desktopAuthState.error = '';
    renderDesktopAuth();
  }

  async function desktopFetchJson(path, options = {}) {
    const method = options.method || (options.body ? 'POST' : 'GET');
    const headers = options.body ? { 'Content-Type': 'application/json' } : { Accept: 'application/json' };
    if (options.authToken) {
      headers.Authorization = `Bearer ${options.authToken}`;
    } else if (!options.noAuth) {
      const token = await getDesktopAuthToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${aiBackendBase}${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_) {
      data = { error: text || `服务异常 ${response.status}` };
    }
    if (!response.ok || data.error) throw new Error(data.error || `服务异常 ${response.status}`);
    return data;
  }

  async function hydrateDesktopMemberStatus(options = {}) {
    const session = await getDesktopAuthSession();
    if (!session?.user) {
      if (!session?.user) {
        desktopAuthState.quota = null;
        updateDesktopQuotaDisplay();
      }
      return null;
    }
    try {
      const query = state.chartRecordId ? `?chartRecordId=${encodeURIComponent(state.chartRecordId)}` : '';
      const data = await desktopFetchJson(`/api/payments/member-status${query}`);
      updateDesktopQuotaDisplay(data.quota || null);
      if (data.product) desktopPaymentState.product = data.product;
      setDesktopPaymentProviders(data.providers);
      desktopPaymentState.mockMode = !!data.mockMode;
      updateDesktopMemberEntry();
      renderDesktopPayment();
      return data;
    } catch (_) {
      return null;
    }
  }

  function isDesktopH5PayPreferred() {
    return /MicroMessenger|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  }

  function stopDesktopPaymentPoll() {
    if (desktopPaymentPollTimer) {
      clearInterval(desktopPaymentPollTimer);
      desktopPaymentPollTimer = null;
    }
  }

  function renderDesktopPaymentQr() {
    const holder = $('#mbpPayQr');
    if (!holder || holder.hidden || !desktopPaymentState.payUrl) return;
    holder.innerHTML = '';
    if (typeof QRCode === 'function') {
      new QRCode(holder, {
        text: desktopPaymentState.payUrl,
        width: 172,
        height: 172,
        correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : undefined,
      });
      return;
    }
    holder.innerHTML = `<a href="${escapeHtml(desktopPaymentState.payUrl)}" target="_blank" rel="noopener">打开${escapeHtml(getDesktopPaymentProviderLabel())}链接</a>`;
  }

  function renderDesktopPayment() {
    const overlay = $('#mbpPayOverlay');
    if (overlay) overlay.hidden = !desktopPaymentState.open;
    document.body.classList.toggle('mbp-pay-open', desktopPaymentState.open);

    const product = getDesktopMemberProduct();
    const title = $('#mbpPayTitle');
    if (title) title.textContent = desktopAuthState.quota?.isMember ? '续费' : '套餐支付';
    const message = $('#mbpPayMessage');
    if (message) message.textContent = desktopPaymentState.message || '权益绑定当前账号，电脑和手机共用。';
    const productName = $('#mbpPayProductName');
    if (productName) productName.textContent = product.name || desktopPaidProductName;
    const desc = $('#mbpPayProductDesc');
    if (desc) desc.textContent = product.description || desktopPaidProductDesc;
    const amount = $('#mbpPayAmount');
    if (amount) amount.textContent = `¥${product.amountYuan || '19.90'}`;
    document.querySelectorAll('.mbp-pay-method').forEach((button) => {
      const provider = button.dataset.provider || 'wechat';
      const meta = getDesktopPaymentProviderMeta(provider);
      button.classList.toggle('is-active', desktopPaymentState.provider === provider);
      button.disabled = desktopPaymentState.loading || desktopPaymentState.status === 'pending' || !meta.enabled;
      button.textContent = meta.enabled ? (meta.label || button.textContent) : `${meta.label || button.textContent}配置中`;
    });

    const isPending = desktopPaymentState.status === 'pending';
    const isPaid = desktopPaymentState.status === 'paid';
    const showQr = isPending && desktopPaymentState.payUrl && desktopPaymentState.payMethod !== 'h5' && !desktopPaymentState.mockMode;
    const qr = $('#mbpPayQr');
    if (qr) qr.hidden = !showQr;
    const openLink = $('#mbpPayOpenLink');
    if (openLink) {
      openLink.hidden = !(isPending && desktopPaymentState.payUrl && desktopPaymentState.payMethod === 'h5' && !desktopPaymentState.mockMode);
      openLink.href = desktopPaymentState.payUrl || '#';
      openLink.textContent = `打开${getDesktopPaymentProviderLabel()}`;
    }
    const error = $('#mbpPayError');
    if (error) {
      error.textContent = desktopPaymentState.error || '';
      error.hidden = !desktopPaymentState.error;
    }

    const primary = $('#mbpPayPrimary');
    if (primary) {
      primary.disabled = desktopPaymentState.loading;
      if (desktopPaymentState.loading) primary.textContent = '处理中...';
      else if (isPaid) primary.textContent = '已开通，关闭';
      else if (desktopPaymentState.mockMode && desktopPaymentState.orderNo) primary.textContent = '模拟支付成功';
      else if (isPending && desktopPaymentState.payMethod === 'h5') primary.textContent = `打开${getDesktopPaymentProviderLabel()}`;
      else if (isPending) primary.textContent = '我已支付，刷新状态';
      else primary.textContent = `${getDesktopPaymentProviderLabel()} ¥${product.amountYuan || '19.90'}`;
    }
    const refresh = $('#mbpPayRefresh');
    if (refresh) {
      refresh.hidden = !desktopPaymentState.orderNo || isPaid;
      refresh.disabled = desktopPaymentState.loading;
    }

    updateDesktopMemberEntry();
    if (showQr) window.setTimeout(renderDesktopPaymentQr, 0);
  }

  async function checkDesktopPaymentStatus() {
    if (!desktopPaymentState.orderNo) return null;
    try {
      const data = await desktopFetchJson(`/api/payments/order-status?orderNo=${encodeURIComponent(desktopPaymentState.orderNo)}`);
      desktopPaymentState.status = data.status || desktopPaymentState.status;
      desktopPaymentState.message = data.status === 'paid' ? '已开通付费版' : `等待${getDesktopPaymentProviderLabel()}完成`;
      if (data.status === 'paid') {
        stopDesktopPaymentPoll();
        await hydrateDesktopMemberStatus({ force: true });
      }
      renderDesktopPayment();
      return data;
    } catch (error) {
      desktopPaymentState.error = error.message || '订单查询失败';
      renderDesktopPayment();
      return null;
    }
  }

  function startDesktopPaymentPoll() {
    stopDesktopPaymentPoll();
    if (!desktopPaymentState.orderNo || desktopPaymentState.mockMode) return;
    desktopPaymentPollTimer = setInterval(checkDesktopPaymentStatus, desktopPaymentPollMs);
  }

  async function openDesktopMemberPayment(options = {}) {
    const session = await getDesktopAuthSession();
    if (!session?.user) {
      desktopPendingPaymentAfterLogin = true;
      openDesktopAuth('login');
      return;
    }
    desktopPaymentState.open = true;
    desktopPaymentState.error = '';
    desktopPaymentState.message = desktopPaymentState.status === 'pending'
      ? desktopPaymentState.message
      : '权益绑定当前账号，电脑和手机共用。';
    renderDesktopPayment();
    await hydrateDesktopMemberStatus({ force: true });
    if (desktopPaymentState.status === 'pending') startDesktopPaymentPoll();
    if (options.create) await startDesktopMemberPayment();
  }

  function closeDesktopPayment() {
    desktopPaymentState.open = false;
    desktopPaymentState.error = '';
    stopDesktopPaymentPoll();
    renderDesktopPayment();
  }

  async function startDesktopMemberPayment() {
    const session = await getDesktopAuthSession();
    if (!session?.user) {
      desktopPendingPaymentAfterLogin = true;
      closeDesktopPayment();
      openDesktopAuth('login');
      return;
    }
    desktopPaymentState.open = true;
    desktopPaymentState.loading = true;
    desktopPaymentState.status = 'loading';
    desktopPaymentState.error = '';
    desktopPaymentState.message = `正在创建${getDesktopPaymentProviderLabel()}订单...`;
    desktopPaymentState.orderNo = '';
    desktopPaymentState.payUrl = '';
    desktopPaymentState.payMethod = '';
    renderDesktopPayment();
    try {
      const order = await desktopFetchJson('/api/payments/create-order', {
        method: 'POST',
        body: { productKey: desktopMemberProductKey, chartRecordId: state.chartRecordId || '', provider: desktopPaymentState.provider },
      });
      const payMethod = isDesktopH5PayPreferred() ? 'h5' : 'native';
      const sessionData = await desktopFetchJson('/api/payments/create-session', {
        method: 'POST',
        body: { orderNo: order.orderNo, payMethod },
      });
      desktopPaymentState.status = 'pending';
      desktopPaymentState.orderNo = order.orderNo || '';
      desktopPaymentState.payUrl = sessionData.payUrl || sessionData.qrUrl || '';
      desktopPaymentState.payMethod = sessionData.payMethod || payMethod;
      desktopPaymentState.provider = sessionData.provider || order.provider || desktopPaymentState.provider;
      desktopPaymentState.mockMode = !!(order.mockMode || sessionData.mockMode);
      desktopPaymentState.product = {
        ...(desktopPaymentState.product || {}),
        name: order.productName || desktopPaymentState.product?.name || desktopPaidProductName,
        description: order.description || desktopPaymentState.product?.description || desktopPaidProductDesc,
        amountYuan: order.amountYuan || desktopPaymentState.product?.amountYuan || '19.90',
      };
      desktopPaymentState.message = desktopPaymentState.mockMode
        ? '当前是支付测试模式'
        : (desktopPaymentState.payMethod === 'h5' ? `点击下方按钮打开${getDesktopPaymentProviderLabel()}` : `请用${getDesktopPaymentProviderAppLabel()}扫码支付`);
      startDesktopPaymentPoll();
    } catch (error) {
      desktopPaymentState.status = 'error';
      desktopPaymentState.error = error.message || '支付订单创建失败';
      desktopPaymentState.message = '支付服务暂时不可用';
    } finally {
      desktopPaymentState.loading = false;
      renderDesktopPayment();
    }
  }

  function openDesktopPaymentUrl() {
    if (desktopPaymentState.payUrl) window.location.href = desktopPaymentState.payUrl;
  }

  async function completeDesktopMockPayment() {
    if (!desktopPaymentState.orderNo) return;
    desktopPaymentState.loading = true;
    desktopPaymentState.message = '正在确认测试支付...';
    renderDesktopPayment();
    try {
      const data = await desktopFetchJson('/api/payments/mock/complete', {
        method: 'POST',
        body: { orderNo: desktopPaymentState.orderNo },
      });
      desktopPaymentState.status = data.status || 'paid';
      desktopPaymentState.message = '已开通付费版';
      await hydrateDesktopMemberStatus({ force: true });
    } catch (error) {
      desktopPaymentState.error = error.message || '测试支付失败';
    } finally {
      desktopPaymentState.loading = false;
      renderDesktopPayment();
    }
  }

  async function handleDesktopPayPrimary() {
    if (desktopPaymentState.loading) return;
    if (desktopPaymentState.status === 'paid') {
      closeDesktopPayment();
      return;
    }
    if (desktopPaymentState.mockMode && desktopPaymentState.orderNo) {
      await completeDesktopMockPayment();
      return;
    }
    if (desktopPaymentState.status === 'pending') {
      if (desktopPaymentState.payMethod === 'h5') openDesktopPaymentUrl();
      else await checkDesktopPaymentStatus();
      return;
    }
    await startDesktopMemberPayment();
  }

  function getDesktopRefundContactDefault() {
    const user = desktopAuthState.session?.user || {};
    return user.user_metadata?.phone || user.email || '';
  }

  function formatDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const cn = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return cn.toISOString().slice(0, 10);
  }

  function getDesktopRefundSelectedOrder() {
    return desktopRefundTicketState.orders.find((order) => order.orderNo === desktopRefundTicketState.orderNo) || null;
  }

  function syncDesktopRefundTicketFromOrder(order = getDesktopRefundSelectedOrder()) {
    if (!order) return;
    desktopRefundTicketState.orderNo = order.orderNo || '';
    desktopRefundTicketState.paymentProvider = ['wechat', 'alipay', 'paypal'].includes(order.provider) ? order.provider : desktopRefundTicketState.paymentProvider;
    desktopRefundTicketState.paidDate = formatDateInput(order.paidAt || order.createdAt) || desktopRefundTicketState.paidDate;
  }

  function renderDesktopRefundTicket() {
    const overlay = $('#mbpRefundTicketOverlay');
    if (overlay) overlay.hidden = !desktopRefundTicketState.open;
    document.body.classList.toggle('mbp-ticket-open', desktopRefundTicketState.open);

    const message = $('#mbpRefundTicketMessage');
    if (message) message.textContent = desktopRefundTicketState.message;

    const orderSelect = $('#mbpRefundTicketOrder');
    if (orderSelect) {
      const orders = desktopRefundTicketState.orders || [];
      orderSelect.innerHTML = orders.length
        ? orders.map((order) => {
          const disabled = order.canSubmitTicket ? '' : ' disabled';
          const ticketText = order.ticketNo ? ` · ${order.ticketStatus === 'done' ? '已完成' : '工单处理中'}` : '';
          return `<option value="${escapeHtml(order.orderNo)}"${disabled}>${escapeHtml(order.productName || '会员订单')} · ¥${escapeHtml(order.amountYuan || '')}${ticketText}</option>`;
        }).join('')
        : '<option value="">暂无可提交工单的订单</option>';
      orderSelect.value = desktopRefundTicketState.orderNo || '';
    }

    const provider = $('#mbpRefundTicketProvider');
    if (provider) provider.value = desktopRefundTicketState.paymentProvider || 'wechat';
    const paidDate = $('#mbpRefundTicketPaidDate');
    if (paidDate) paidDate.value = desktopRefundTicketState.paidDate || '';
    const contact = $('#mbpRefundTicketContact');
    if (contact) contact.value = desktopRefundTicketState.contact || '';
    const note = $('#mbpRefundTicketNote');
    if (note) note.value = desktopRefundTicketState.note || '';
    const fileName = $('#mbpRefundTicketFileName');
    if (fileName) fileName.textContent = desktopRefundTicketState.screenshotName
      ? `已选择：${desktopRefundTicketState.screenshotName}`
      : '请上传当时支付成功截图。';

    const error = $('#mbpRefundTicketError');
    if (error) {
      const text = desktopRefundTicketState.error || '';
      error.hidden = !text;
      error.textContent = text;
    }

    const submit = $('#mbpRefundTicketSubmit');
    if (submit) {
      const order = getDesktopRefundSelectedOrder();
      submit.disabled = desktopRefundTicketState.loading || !order?.canSubmitTicket;
      submit.textContent = desktopRefundTicketState.loading ? '提交中...' : '提交工单';
    }
    const reload = $('#mbpRefundTicketReload');
    if (reload) reload.disabled = desktopRefundTicketState.loading;
  }

  async function loadDesktopRefundOrders() {
    desktopRefundTicketState.loading = true;
    desktopRefundTicketState.error = '';
    renderDesktopRefundTicket();
    try {
      const data = await desktopFetchJson('/api/payments/refunds');
      desktopRefundTicketState.orders = Array.isArray(data.orders) ? data.orders : [];
      desktopRefundTicketState.loaded = true;
      const first = desktopRefundTicketState.orders.find((order) => order.canSubmitTicket) || desktopRefundTicketState.orders[0] || null;
      if (!desktopRefundTicketState.orderNo && first) syncDesktopRefundTicketFromOrder(first);
      if (!desktopRefundTicketState.contact) desktopRefundTicketState.contact = getDesktopRefundContactDefault();
      if (!desktopRefundTicketState.orders.length) desktopRefundTicketState.error = '当前账号暂无已支付订单。';
    } catch (error) {
      desktopRefundTicketState.error = error.message || '订单读取失败';
    } finally {
      desktopRefundTicketState.loading = false;
      renderDesktopRefundTicket();
    }
  }

  async function openDesktopRefundTicket() {
    const session = await getDesktopAuthSession();
    if (!session?.user) {
      closeDesktopPayment();
      openDesktopAuth('login');
      return;
    }
    desktopRefundTicketState.open = true;
    desktopRefundTicketState.error = '';
    desktopRefundTicketState.message = '退款需上传当时支付截图，后台审核后进入对应支付渠道处理，7个工作日内完成。';
    if (!desktopRefundTicketState.contact) desktopRefundTicketState.contact = getDesktopRefundContactDefault();
    renderDesktopRefundTicket();
    await loadDesktopRefundOrders();
  }

  function closeDesktopRefundTicket() {
    desktopRefundTicketState.open = false;
    desktopRefundTicketState.error = '';
    renderDesktopRefundTicket();
  }

  function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('截图读取失败'));
      reader.readAsDataURL(file);
    });
  }

  async function compressRefundScreenshot(file) {
    if (!file || !/^image\/(png|jpeg|jpg|webp)$/i.test(file.type || '')) throw new Error('请上传 PNG/JPG/WebP 支付截图');
    const rawUrl = await readImageAsDataUrl(file);
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('截图无法识别'));
      img.src = rawUrl;
    });
    const maxSide = 1280;
    const scale = Math.min(1, maxSide / Math.max(image.width || maxSide, image.height || maxSide));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round((image.width || maxSide) * scale));
    canvas.height = Math.max(1, Math.round((image.height || maxSide) * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', .78);
    if (dataUrl.length > 2.8 * 1024 * 1024) throw new Error('截图仍然过大，请裁剪后再上传');
    return dataUrl;
  }

  async function handleDesktopRefundScreenshot(file) {
    desktopRefundTicketState.loading = true;
    desktopRefundTicketState.error = '';
    desktopRefundTicketState.screenshotName = file?.name || '';
    renderDesktopRefundTicket();
    try {
      desktopRefundTicketState.screenshotDataUrl = await compressRefundScreenshot(file);
    } catch (error) {
      desktopRefundTicketState.screenshotDataUrl = '';
      desktopRefundTicketState.screenshotName = '';
      desktopRefundTicketState.error = error.message || '截图处理失败';
    } finally {
      desktopRefundTicketState.loading = false;
      renderDesktopRefundTicket();
    }
  }

  async function submitDesktopRefundTicket() {
    if (desktopRefundTicketState.loading) return;
    const order = getDesktopRefundSelectedOrder();
    if (!order?.canSubmitTicket) {
      desktopRefundTicketState.error = order?.ticketBlockedReason || '当前订单不能提交工单';
      renderDesktopRefundTicket();
      return;
    }
    if (!desktopRefundTicketState.screenshotDataUrl) {
      desktopRefundTicketState.error = '请先上传当时支付截图';
      renderDesktopRefundTicket();
      return;
    }
    desktopRefundTicketState.loading = true;
    desktopRefundTicketState.error = '';
    renderDesktopRefundTicket();
    try {
      const data = await desktopFetchJson('/api/payments/refunds', {
        method: 'POST',
        body: {
          orderNo: desktopRefundTicketState.orderNo,
          paymentProvider: desktopRefundTicketState.paymentProvider,
          paidDate: desktopRefundTicketState.paidDate,
          contact: desktopRefundTicketState.contact,
          note: desktopRefundTicketState.note,
          screenshotName: desktopRefundTicketState.screenshotName,
          screenshotDataUrl: desktopRefundTicketState.screenshotDataUrl,
        },
      });
      desktopRefundTicketState.message = data.message || '工单已提交，7个工作日内处理完成。';
      desktopRefundTicketState.screenshotDataUrl = '';
      desktopRefundTicketState.screenshotName = '';
      const screenshotInput = $('#mbpRefundTicketScreenshot');
      if (screenshotInput) screenshotInput.value = '';
      await loadDesktopRefundOrders();
    } catch (error) {
      desktopRefundTicketState.error = error.message || '工单提交失败';
    } finally {
      desktopRefundTicketState.loading = false;
      renderDesktopRefundTicket();
    }
  }

  async function submitDesktopAuth() {
    const account = String($('#mbpAuthAccount')?.value || '').trim();
    const password = String($('#mbpAuthPassword')?.value || '');
    const email = inputToDesktopAuthEmail(account);
    const usingEmail = /@/.test(account);
    if (desktopAuthState.mode === 'register' && usingEmail) {
      setDesktopAuthError('注册请填写手机号');
      return;
    }
    if (!email) {
      setDesktopAuthError(desktopAuthState.mode === 'register' ? '请输入正确手机号' : '请输入正确手机号或邮箱');
      return;
    }
    if (password.length < 6) {
      setDesktopAuthError('密码至少 6 位');
      return;
    }
    desktopAuthState.loading = true;
    desktopAuthState.error = '';
    renderDesktopAuth();
    try {
      let data = null;
      if (desktopAuthState.mode === 'register') {
        data = await desktopFetchJson('/api/auth/register-phone', {
          method: 'POST',
          body: { phone: account, password },
          noAuth: true,
        }).catch((error) => {
          if (!/已注册|already|exists/i.test(error.message || '')) throw error;
          return null;
        });
      }
      if (!data?.session) {
        data = await desktopFetchJson('/api/auth/password-login', {
          method: 'POST',
          body: { account: email || account, password },
          noAuth: true,
        });
      }
      desktopAuthState.session = data?.session || null;
      saveDesktopAuthSession(desktopAuthState.session);
      desktopAuthState.error = '';
      $('#mbpAuthAccount').value = '';
      $('#mbpAuthPassword').value = '';
      closeDesktopAuth();
      await hydrateDesktopMemberStatus({ force: true });
      if (desktopPendingPaymentAfterLogin) {
        desktopPendingPaymentAfterLogin = false;
        window.setTimeout(() => openDesktopMemberPayment(), 0);
      }
      if (typeof window._chatPanelRefresh === 'function' && window._chartRecordId) window._chatPanelRefresh();
    } catch (error) {
      setDesktopAuthError(error.message || '登录失败');
    } finally {
      desktopAuthState.loading = false;
      renderDesktopAuth();
    }
  }

  async function signOutDesktopAuth(options = {}) {
    desktopAuthState.loading = true;
    renderDesktopAuth();
    try {
      desktopAuthState.session = null;
      saveDesktopAuthSession(null);
      desktopAuthState.quota = null;
      desktopAuthState.mode = 'login';
      desktopAuthState.error = '';
      desktopAuthState.open = !!options.reopen;
      stopDesktopPaymentPoll();
      desktopPaymentState.open = false;
      desktopPaymentState.status = 'idle';
      desktopPaymentState.orderNo = '';
      desktopPaymentState.payUrl = '';
      desktopRefundTicketState.open = false;
      desktopRefundTicketState.orders = [];
      desktopRefundTicketState.loaded = false;
      updateDesktopQuotaDisplay();
      if (typeof window._chatPanelRefresh === 'function' && window._chartRecordId) window._chatPanelRefresh();
    } catch (error) {
      setDesktopAuthError(error.message || '退出失败');
    } finally {
      desktopAuthState.loading = false;
      renderDesktopAuth();
      if (options.reopen) focusDesktopAuthField();
    }
  }

  async function startDesktopGoogleLogin() {
    if (!desktopGoogleEnabled) {
      setDesktopAuthError('国内主站请使用手机号或邮箱登录');
      return;
    }
    desktopAuthState.loading = true;
    desktopAuthState.error = '';
    renderDesktopAuth();
    try {
      const data = await desktopFetchJson('/api/auth/oauth-url', {
        method: 'POST',
        body: {
          provider: 'google',
          redirectTo: getDesktopGoogleRedirectUrl(),
        },
        noAuth: true,
      });
      if (!data?.url) throw new Error('Google 登录地址生成失败');
      window.location.href = data.url;
    } catch (error) {
      desktopAuthState.loading = false;
      setDesktopAuthError(error.message || 'Google 登录失败，请稍后重试');
      renderDesktopAuth();
    }
  }

  async function consumeDesktopAuthCallback() {
    const error = getDesktopAuthCallbackError();
    if (error) throw new Error(error);
    const callbackSession = buildDesktopAuthSessionFromCallback();
    if (callbackSession) {
      const data = await desktopFetchJson('/api/auth/session', {
        authToken: callbackSession.access_token,
      });
      desktopAuthState.session = { ...callbackSession, user: data?.user || null };
      if (!desktopAuthState.session.user) throw new Error('Google 登录失败，请重试');
      saveDesktopAuthSession(desktopAuthState.session);
      return desktopAuthState.session;
    }
    const code = getDesktopAuthCallbackValue('code');
    if (code) {
      const data = await desktopFetchJson('/api/auth/exchange-code', {
        method: 'POST',
        body: { code },
        noAuth: true,
      });
      desktopAuthState.session = data?.session || null;
      saveDesktopAuthSession(desktopAuthState.session);
      return desktopAuthState.session;
    }
    return getDesktopAuthSession({ force: true });
  }

  async function initDesktopAuth() {
    if (desktopAuthReadyPromise) return desktopAuthReadyPromise;
    desktopAuthReadyPromise = getDesktopAuthSession().then((session) => {
      desktopAuthState.session = session || null;
      renderDesktopAuth();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
      return desktopAuthState.session;
    }).catch(() => null);
    return desktopAuthReadyPromise;
  }

  async function bootDesktopAuth() {
    if (!isDesktopAuthCallbackUrl()) {
      await initDesktopAuth();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
      await handleDesktopEntryIntent();
      return;
    }
    desktopAuthState.open = true;
    desktopAuthState.loading = true;
    desktopAuthState.error = '';
    renderDesktopAuth();
    try {
      await consumeDesktopAuthCallback();
      clearDesktopAuthCallbackUrl();
      desktopAuthState.open = !desktopAuthState.session?.user;
      desktopAuthState.error = '';
      if (desktopAuthState.session?.user) await hydrateDesktopMemberStatus({ force: true });
      if (typeof window._chatPanelRefresh === 'function' && window._chartRecordId) window._chatPanelRefresh();
    } catch (error) {
      clearDesktopAuthCallbackUrl();
      desktopAuthState.open = true;
      desktopAuthState.error = error.message || 'Google 登录失败，请稍后重试';
    } finally {
      desktopAuthState.loading = false;
      renderDesktopAuth();
    }
  }
  window.mbpBootDesktopAuth = bootDesktopAuth;

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

  function getReusableClientRecordId(profile) {
    if (!editingClientRecordId) return '';
    const editingRecord = findClientRecordById(editingClientRecordId);
    if (!editingRecord?.profile) return '';
    return profileHistoryKey(editingRecord.profile) === profileHistoryKey(profile) ? editingClientRecordId : '';
  }

  function syncChatPanelState() {
    if (!document.getElementById('aip-panel-chat')) return;
    if (!state.chartReady || !state.chart || !state.norm) {
      window._chartRecordId = null;
      if (typeof window._chatPanelInit === 'function') window._chatPanelInit();
      return;
    }
    state.chartRecordId = state.chartRecordId || makeLocalId();
    window._chartRecordId = state.chartRecordId;
    if (typeof window._chatPanelInit === 'function') window._chatPanelInit();
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
      cityTimeZone: source.cityTimeZone || source.timeZone || cityObj?.timeZone,
      cityScope: source.cityScope,
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
      timeZone: profile.cityTimeZone || '',
      scope: profile.cityScope || defaultCityScope,
    };
  }

  function profileToRecord(profile, options = {}) {
    const savedAt = options.savedAt || options.createdAt || new Date().toISOString();
    const id = options.id || makeLocalId();
    return {
      id,
      chartRecordId: options.chartRecordId || id,
      savedAt,
      updatedAt: options.updatedAt || savedAt,
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
      cityTimeZone: profile.cityTimeZone || '',
      cityScope: profile.cityScope || defaultCityScope,
      lunarYear: profile.lunarYear,
      lunarMonth: profile.lunarMonth,
      lunarDay: profile.lunarDay,
      lunarLeap: profile.lunarLeap,
    };
  }

  function readCustomerHistoryRecords() {
    return readJsonList(chartHistoryKey).filter(Boolean);
  }

  function writeCustomerHistoryRecords(records) {
    try {
      localStorage.setItem(chartHistoryKey, JSON.stringify(records.slice(0, 50)));
    } catch (_) {}
  }

  function customerRecordIdentityKeys(record) {
    if (!record) return [];
    const profile = record.profile ? normalizeProfile(record.profile) : recordToProfile(record);
    return [
      record.id,
      record.chartRecordId,
      record.chartData?.chartRecordId,
      record.form?.archiveId,
      record.form?.remoteRaw?.id,
      record.form?.remoteRaw?.chartRecordId,
      record.raw?.id,
      record.raw?.chartRecordId,
      profileHistoryKey(profile),
    ].filter(Boolean).map(String);
  }

  function readCustomerTombstones() {
    try {
      const raw = localStorage.getItem(customerTombstonesKey);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writeCustomerTombstones(tombstones) {
    try {
      localStorage.setItem(customerTombstonesKey, JSON.stringify(tombstones.slice(-120)));
    } catch (_) {}
  }

  function isCustomerRecordTombstoned(record, tombstones = readCustomerTombstones()) {
    const keys = new Set(customerRecordIdentityKeys(record));
    if (!keys.size) return false;
    return tombstones.some((item) => customerRecordIdentityKeys(item).some((key) => keys.has(key)));
  }

  function rememberCustomerTombstone(record) {
    if (!record) return;
    const profile = record.profile ? normalizeProfile(record.profile) : recordToProfile(record);
    const tombstones = readCustomerTombstones()
      .filter((item) => !isCustomerRecordTombstoned(record, [item]));
    tombstones.push({
      id: record.id || '',
      chartRecordId: record.chartRecordId || record.chartData?.chartRecordId || '',
      profile,
      deletedAt: new Date().toISOString(),
    });
    writeCustomerTombstones(tombstones);
  }

  function forgetCustomerTombstone(record) {
    if (!record) return;
    const tombstones = readCustomerTombstones()
      .filter((item) => !isCustomerRecordTombstoned(record, [item]));
    writeCustomerTombstones(tombstones);
  }

  function getCustomerClientId() {
    try {
      let id = localStorage.getItem(customerClientIdKey);
      if (!id) {
        id = makeLocalId();
        localStorage.setItem(customerClientIdKey, id);
      }
      return id;
    } catch (_) {
      return makeLocalId();
    }
  }

  function profileDateTimeValue(profile) {
    return `${dateStr(profile)}T${pad2(profile.hour)}:${pad2(profile.minute)}`;
  }

  function customerRecordToArchive(record) {
    const profile = record?.profile ? normalizeProfile(record.profile) : recordToProfile(record);
    const id = String(record?.id && record.id !== 'current' ? record.id : record?.chartRecordId || makeLocalId());
    const chartRecordId = String(record?.chartRecordId || id);
    const datetime = profileDateTimeValue(profile);
    const savedAt = record?.savedAt || record?.createdAt || new Date().toISOString();
    const updatedAt = record?.updatedAt || savedAt;
    const city = cityRecordFromProfile(profile);
    return {
      id,
      chartRecordId,
      chart: null,
      chartData: {
        chartRecordId,
        name: profile.name || '',
        gender: profile.gender,
        birthDate: datetime.replace('T', ' '),
        solarTime: datetime.replace('T', ' '),
        city: profile.cityName || profile.city || '',
      },
      form: {
        archiveId: id,
        name: profile.name || '',
        gender: profile.gender,
        type: 'ziwei',
        datetime,
        city: profile.cityName || profile.city || '',
        cityDetail: city,
        useTrueSolar: true,
        remoteRaw: profileToRecord(profile, { id, chartRecordId, savedAt, updatedAt }),
      },
      createdAt: savedAt,
      updatedAt,
    };
  }

  function archiveToCustomerRecord(archive) {
    if (!archive) return null;
    const form = archive.form || {};
    const raw = form.remoteRaw || {};
    const datetime = form.datetime || raw.datetime || (raw.dateStr ? `${raw.dateStr}T${pad2(raw.cstHour ?? raw.hour ?? 0)}:${pad2(raw.cstMinute ?? raw.minute ?? 0)}` : '');
    const [datePart = '', timePart = ''] = String(datetime || '').replace(' ', 'T').split('T');
    const [year, month, day] = datePart.split('-').map((part) => Number.parseInt(part, 10));
    const time = parseTimeText(timePart);
    const formCity = form.cityDetail || form.city || raw.city;
    const formCityName = form.cityDetail?.name
      || (form.city && typeof form.city === 'object' ? form.city.name : form.city)
      || raw.cityName
      || (raw.city && typeof raw.city === 'object' ? raw.city.name : raw.city);
    const profile = normalizeProfile({
      ...raw,
      name: form.name || raw.name || '',
      gender: form.gender || raw.gender || 'male',
      year: raw.year || year,
      month: raw.month || month,
      day: raw.day || day,
      hour: raw.cstHour ?? raw.hour ?? time.hour,
      minute: raw.cstMinute ?? raw.minute ?? time.minute,
      city: formCity,
      cityName: formCityName,
      cityProvince: form.cityDetail?.province || raw.cityProvince,
      cityShort: form.cityDetail?.city || raw.cityShort,
      cityLon: form.cityDetail?.lon ?? raw.cityLon,
      cityLat: form.cityDetail?.lat ?? raw.cityLat,
      cityTz: form.cityDetail?.tzOffset ?? raw.cityTz,
      cityTimeZone: form.cityDetail?.timeZone || raw.cityTimeZone,
      cityScope: form.cityDetail?.scope || raw.cityScope,
    });
    const id = archive.id || form.archiveId || archive.chartRecordId || makeLocalId();
    const chartRecordId = archive.chartRecordId || archive.chartData?.chartRecordId || id;
    return profileToRecord(profile, {
      id,
      chartRecordId,
      savedAt: archive.createdAt || raw.savedAt || new Date().toISOString(),
      updatedAt: archive.updatedAt || raw.updatedAt || archive.createdAt || new Date().toISOString(),
    });
  }

  function customerRecordStamp(record) {
    const stamp = Date.parse(record?.updatedAt || record?.savedAt || record?.createdAt || '');
    return Number.isFinite(stamp) ? stamp : 0;
  }

  function mergeCustomerRecords(localRecords, remoteRecords) {
    const merged = new Map();
    const tombstones = readCustomerTombstones();
    [...remoteRecords, ...localRecords].forEach((record) => {
      if (!record) return;
      if (isCustomerRecordTombstoned(record, tombstones)) return;
      const profile = recordToProfile(record);
      const key = profileHistoryKey(profile);
      if (!key) return;
      const old = merged.get(key);
      if (!old || customerRecordStamp(record) >= customerRecordStamp(old)) merged.set(key, record);
    });
    return Array.from(merged.values())
      .sort((a, b) => customerRecordStamp(b) - customerRecordStamp(a))
      .slice(0, 50);
  }

  function loadCustomerRecords() {
    const records = [
      ...readCustomerHistoryRecords(),
    ].filter((record) => !isCustomerRecordTombstoned(record));
    const current = { ...profileToRecord(state.profile), id: 'current', chartRecordId: '', savedAt: new Date().toISOString() };
    const seen = new Set();
    return [current, ...records]
      .map((record) => {
        const profile = recordToProfile(record);
        const key = profileHistoryKey(profile);
        if (seen.has(key)) return null;
        seen.add(key);
        return {
          ...record,
          id: record.id || record.form?.archiveId || key,
          chartRecordId: record.chartRecordId || record.chartData?.chartRecordId || record.form?.remoteRaw?.chartRecordId || '',
          savedAt: record.savedAt || record.createdAt || record.created_at || '',
          updatedAt: record.updatedAt || record.createdAt || record.savedAt || '',
          profile,
        };
      })
      .filter(Boolean)
      .slice(0, 50);
  }

  function saveProfileToHistory(profile, options = {}) {
    const key = profileHistoryKey(profile);
    const records = readCustomerHistoryRecords();
    const targetIds = new Set([options.id, options.chartRecordId, state.chartRecordId].filter(Boolean).map(String));
    const old = records.find((item) => targetIds.has(String(item.id || ''))
      || targetIds.has(String(item.chartRecordId || ''))
      || profileHistoryKey(recordToProfile(item)) === key) || null;
    const id = old?.id || options.id || state.chartRecordId || makeLocalId();
    const chartRecordId = old?.chartRecordId || options.chartRecordId || state.chartRecordId || id;
    const record = profileToRecord(profile, {
      id,
      chartRecordId,
      savedAt: old?.savedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    forgetCustomerTombstone(record);
    const list = records
      .filter((item) => item.id !== id && item.chartRecordId !== chartRecordId && profileHistoryKey(recordToProfile(item)) !== key)
      .slice(0, 49);
    writeCustomerHistoryRecords([record, ...list]);
    editingClientRecordId = record.id;
    state.chartRecordId = chartRecordId;
    pushCustomerRecordsToRemote();
    return record;
  }

  async function fetchCustomerRemoteArchives() {
    const clientId = getCustomerClientId();
    const response = await fetch(`${aiBackendBase}/api/wentian/archives?clientId=${encodeURIComponent(clientId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error || '客户盘读取失败');
    return data;
  }

  async function pushCustomerRecordsToRemote(records = readCustomerHistoryRecords()) {
    const archives = records
      .map(customerRecordToArchive)
      .filter(Boolean)
      .slice(0, 50);
    clientRemoteSyncing = true;
    clientRemoteMessage = '同步中';
    renderClientList();
    try {
      const clientId = getCustomerClientId();
      const response = await fetch(`${aiBackendBase}/api/wentian/archives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          archives,
          selectedArchiveId: archives.some((archive) => archive.id === editingClientRecordId) ? editingClientRecordId : (archives[0]?.id || ''),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.error) throw new Error(data.error || '客户盘同步失败');
      clientRemoteLoaded = true;
      clientRemoteMessage = archives.length ? '已同步' : '已清空';
      return data;
    } catch (error) {
      clientRemoteMessage = '本地已保存';
      console.info('mingbook client remote sync fallback', error);
      return null;
    } finally {
      clientRemoteSyncing = false;
      renderClientList();
    }
  }

  async function deleteCustomerRecordFromRemote(record) {
    try {
      const archive = customerRecordToArchive(record);
      const response = await fetch(`${aiBackendBase}/api/wentian/archives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: getCustomerClientId(),
          action: 'delete',
          archiveId: archive.id,
          chartRecordId: archive.chartRecordId,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.error) throw new Error(data.error || '客户盘删除失败');
    } catch (error) {
      console.info('mingbook client remote delete fallback', error);
    }
  }

  async function hydrateCustomerRecordsFromRemote(options = {}) {
    if (clientRemotePromise) return clientRemotePromise;
    if (clientRemoteLoaded && !options.force) return null;
    clientRemotePromise = fetchCustomerRemoteArchives()
      .then((data) => {
        const remoteRecords = (Array.isArray(data.archives) ? data.archives : [])
          .map(archiveToCustomerRecord)
          .filter(Boolean);
        let merged = readCustomerHistoryRecords().filter((record) => !isCustomerRecordTombstoned(record));
        if (remoteRecords.length) {
          merged = mergeCustomerRecords(merged, remoteRecords);
          writeCustomerHistoryRecords(merged);
          if (merged.length < remoteRecords.length) void pushCustomerRecordsToRemote(merged);
        }
        clientRemoteLoaded = true;
        clientRemoteMessage = remoteRecords.length ? (merged.length < remoteRecords.length ? '已清理' : '已同步') : '云端暂无';
        if (options.rerender) renderClientList();
        return remoteRecords;
      })
      .catch((error) => {
        clientRemoteMessage = '本地记录';
        console.info('mingbook client remote load fallback', error);
        if (options.rerender) renderClientList();
        return null;
      })
      .finally(() => {
        clientRemotePromise = null;
        clientRemoteSyncing = false;
      });
    return clientRemotePromise;
  }

  function readInitialProfile() {
    return profileFromParams() || profileFromSaved() || { ...defaultProfile };
  }

  function dateStr(profile) {
    return `${profile.year}-${pad2(profile.month)}-${pad2(profile.day)}`;
  }

  function dateStrWithDayShift(profile, dayShift = 0) {
    const offset = Number(dayShift) || 0;
    if (!offset) return dateStr(profile);
    const date = new Date(Number(profile.year), Number(profile.month) - 1, Number(profile.day));
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
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

  function getCityList() {
    const list = typeof CITIES !== 'undefined' ? CITIES : (window.CITIES || globalThis.CITIES);
    return Array.isArray(list) ? list : [];
  }

  function isChinaCity(city) {
    if (typeof isChinaBirthPlace === 'function') return isChinaBirthPlace(city);
    const province = String(Array.isArray(city) ? city[0] : city?.province || '').trim();
    return chinaCityRegions.has(province);
  }

  function cityFromRow(row) {
    if (!row) return null;
    const parentCity = String(row[5] || '').trim();
    const fullName = String(row[6] || '').trim();
    const adminCode = String(row[7] || '').trim();
    const city = {
      province: row[0],
      city: row[1],
      parentCity,
      fullName,
      adminCode,
      name: fullName || `${row[0]} ${parentCity ? `${parentCity} ` : ''}${row[1]}`,
      lon: Number(row[2]),
      lat: Number(row[3]),
      tzOffset: Number(row[4] ?? 8),
    };
    city.timeZone = typeof getBirthTimeZoneId === 'function' ? getBirthTimeZoneId(city) : '';
    return city;
  }

  function formatChinaCityPath(city) {
    const province = stripCityEnglishSuffix(city?.province);
    const parentCity = stripCityEnglishSuffix(city?.parentCity);
    const cityName = stripCityEnglishSuffix(city?.city);
    return [province, parentCity && parentCity !== province && parentCity !== cityName ? parentCity : '', cityName && cityName !== province ? cityName : '']
      .filter(Boolean)
      .join(' ');
  }

  function formatCityLabel(city) {
    if (!city) return '';
    if (isChinaCity(city)) {
      return `中国 · ${formatChinaCityPath(city)}`;
    }
    return `${city.province} · ${city.city}`;
  }

  function stripCityEnglishSuffix(value) {
    return String(value || '').replace(/\s+[A-Za-z][A-Za-z\s.'()-]*$/g, '').trim();
  }

  function formatSelectedCityLabel(city) {
    if (!city) return '';
    const province = stripCityEnglishSuffix(city.province);
    const cityName = stripCityEnglishSuffix(city.city);
    if (isChinaCity(city)) return formatChinaCityPath(city);
    return cityName || province;
  }

  function formatTzOffset(tzOffset) {
    const value = Number.isFinite(Number(tzOffset)) ? Number(tzOffset) : 8;
    const sign = value >= 0 ? '+' : '-';
    const abs = Math.abs(value);
    const hour = Math.floor(abs);
    const minutes = Math.round((abs - hour) * 60);
    return minutes ? `UTC${sign}${hour}:${String(minutes).padStart(2, '0')}` : `UTC${sign}${hour}`;
  }

  function formatLocalTimeLabel(tzOffset) {
    return `当地时间 ${formatTzOffset(tzOffset)}`;
  }

  function formatCityTimeZoneLabelForForm(city) {
    if (!city) return '';
    const timeZone = city.timeZone || (typeof getBirthTimeZoneId === 'function' ? getBirthTimeZoneId(city) : '');
    if (timeZone && typeof window.calcTrueSolarTime === 'function') {
      const date = solarFromForm();
      if (!date.error) {
        const time = formTime();
        try {
          const tst = window.calcTrueSolarTime({
            year: date.year,
            month: date.month,
            day: date.day,
            hour: time.hour,
            minute: time.minute,
            longitude: city.lon,
            tzOffset: city.tzOffset,
            timeZone,
            cityName: city.city || '',
          });
          return formatLocalTimeLabel(tst.tzOffset);
        } catch (_) {}
      }
      return '按出生日期校正';
    }
    return formatLocalTimeLabel(city.tzOffset);
  }

  function formatGeoCoord(value, axis) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '--';
    const dir = axis === 'lat'
      ? (number >= 0 ? 'N' : 'S')
      : (number >= 0 ? 'E' : 'W');
    return `${Math.abs(number).toFixed(2)}°${dir}`;
  }

  function cityMatchesQuery(row, q, compact) {
    const parts = row.map((value) => String(value || '').toLowerCase()).filter(Boolean);
    const province = String(row[0] || '').toLowerCase();
    const city = String(row[1] || '').toLowerCase();
    const parentCity = String(row[5] || '').toLowerCase();
    const text = parts.join(' ');
    const rowCompact = `${province}${parentCity}${city}`.replace(/\s/g, '');
    const compactText = parts.join('').replace(/\s|·|-/g, '');
    const cityCompact = city.replace(/\s/g, '');
    return text.includes(q)
      || compactText.includes(compact)
      || compact.includes(rowCompact)
      || (cityCompact.length >= 2 && compact.includes(cityCompact));
  }

  function cityRowSearchRank(row, q, compact) {
    const province = String(row[0] || '').toLowerCase().replace(/\s/g, '');
    const city = String(row[1] || '').toLowerCase().replace(/\s/g, '');
    const parentCity = String(row[5] || '').toLowerCase().replace(/\s/g, '');
    const fullPath = `${province}${parentCity}${city}`;
    if (city === compact) return 0;
    if (fullPath === compact) return 1;
    if (city.includes(compact)) return 2;
    if (fullPath.endsWith(compact)) return 3;
    if (fullPath.includes(compact)) return 4;
    if (q && String(row[6] || '').toLowerCase().includes(q)) return 5;
    return 9;
  }

  function findCityRows(query, scope = 'all', limit = 12) {
    const q = String(query || '').trim().toLowerCase();
    const list = getCityList();
    if (!q || !Array.isArray(list)) return [];
    const compact = q.replace(/\s|·|-/g, '');
    return list
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => (scope !== 'china' || isChinaCity(row)) && cityMatchesQuery(row, q, compact))
      .sort((a, b) => cityRowSearchRank(a.row, q, compact) - cityRowSearchRank(b.row, q, compact) || a.index - b.index)
      .map(({ row }) => row)
      .slice(0, limit);
  }

  function findCity(query, scope = 'all') {
    const found = findCityRows(query, scope, 1);
    return cityFromRow(found?.[0]);
  }

  function findCitySuggestionRows(query, scope = cityScope, limit = 12) {
    let results = findCityRows(query, scope, limit);
    if (!results.length && scope === 'china') {
      const globalResults = findCityRows(query, 'global', limit);
      if (globalResults.length) {
        setCityScope('global', { keepSelected: true });
        results = globalResults;
      }
    }
    return results;
  }

  function resetCityDeleteArmed(input = $('#mbpCitySearch')) {
    cityDeleteArmed = false;
    input?.classList.remove('is-delete-armed');
  }

  function cityInputFullySelected(input) {
    return !!input?.value && input.selectionStart === 0 && input.selectionEnd === input.value.length;
  }

  function armCityDeletion(input) {
    if (!input?.value) return;
    cityDeleteArmed = true;
    input.classList.add('is-delete-armed');
    window.requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    });
  }

  function clearCityField() {
    const input = $('#mbpCitySearch');
    applySelectedCity(null);
    if (input) input.value = '';
    $('#mbpCityDropdown').style.display = 'none';
    resetCityDeleteArmed(input);
    updateTrueSolarPreview();
  }

  function applyFirstCitySuggestion(options = {}) {
    if (selectedCity) return selectedCity;
    const input = $('#mbpCitySearch');
    const query = String(input?.value || '').trim();
    if (!query) return null;
    const row = findCitySuggestionRows(query, cityScope, 1)[0];
    if (!row) return null;
    const city = cityFromRow(row);
    applySelectedCity(city);
    if (options.hideDropdown !== false) $('#mbpCityDropdown').style.display = 'none';
    return city;
  }

  function syncCityScopeUi() {
    document.querySelectorAll('[data-city-scope]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.cityScope === cityScope);
    });
    const input = $('#mbpCitySearch');
    if (input) {
      input.placeholder = cityScope === 'global'
        ? '搜索国家/城市，如：Singapore、Tokyo、London'
        : '搜索出生地，如：广东廉江、朝阳区、上海';
    }
    const note = $('#mbpCityScopeNote');
    if (note) {
      note.textContent = '填出生证时间，系统按出生地自动校正真太阳时。';
    }
  }

  function setCityScope(scope, options = {}) {
    cityScope = scope === 'global' ? 'global' : defaultCityScope;
    syncCityScopeUi();
    if (!options.keepSelected && selectedCity && cityScope === 'china' && !isChinaCity(selectedCity)) {
      applySelectedCity(null, { preserveScope: true });
    }
  }

  function applySelectedCity(city, options = {}) {
    selectedCity = city || null;
    if (city && !options.preserveScope) {
      setCityScope(isChinaCity(city) ? defaultCityScope : 'global', { keepSelected: true });
    } else {
      syncCityScopeUi();
    }
    const input = $('#mbpCitySearch');
    const clear = $('#mbpClearCity');
    const selected = $('#mbpCitySelected');
    resetCityDeleteArmed(input);
    if (input) input.value = city ? `${city.province} · ${city.city}` : '';
    if (clear) clear.style.display = city ? '' : 'none';
    if (selected) selected.style.display = city ? '' : 'none';
    if (city) {
      $('#mbpCitySelectedName').textContent = formatSelectedCityLabel(city);
      $('#mbpCityTz').textContent = formatCityTimeZoneLabelForForm(city);
      if ($('#mbpCityLon')) $('#mbpCityLon').textContent = formatGeoCoord(city.lon, 'lon');
      if ($('#mbpCityLat')) $('#mbpCityLat').textContent = formatGeoCoord(city.lat, 'lat');
    }
    updateTrueSolarPreview();
  }

  function setCalMode(mode, options = {}) {
    formCalMode = mode;
    document.querySelectorAll('.nf-cal-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.cal === mode));
    const isLunar = mode === 'lunar';
    const isAi = mode === 'ai';
    $('#mbpSolarInputs').style.display = isLunar ? 'none' : '';
    $('#mbpLunarInputs').style.display = isLunar ? '' : 'none';
    $('#mbpAiInlineWrap').style.display = isAi ? 'block' : 'none';
    if (isLunar) updateLunarLeapState({ autoDefault: !!options.autoDefaultLeap });
    else updateLunarLeapState();
    updateDatePreview();
  }

  function getLunarLeapMonth(year) {
    if (!year) return 0;
    if (!(window.LunarYear && typeof window.LunarYear.fromYear === 'function')) return 0;
    try {
      const lunarYear = window.LunarYear.fromYear(year);
      const leapMonth = Math.abs(Number(lunarYear?.getLeapMonth?.())) || 0;
      if (leapMonth) return leapMonth;
      const leapEntry = lunarYear?.getMonths?.()?.find((item) => Number(item?.getMonth?.()) < 0);
      return Math.abs(Number(leapEntry?.getMonth?.())) || 0;
    } catch (_) {}
    return 0;
  }

  function getNextLunarMonth(year, month) {
    const y = Number(year);
    const m = Number(month);
    return m >= 12 ? { year: y + 1, month: 1 } : { year: y, month: m + 1 };
  }

  function formatLunarRuleLabel(year, month, day, isLeap = false) {
    if (typeof formatLunarDate === 'function') return formatLunarDate({ year, month, day, isLeap });
    return `${year}年${isLeap ? '闰' : ''}${month}月${day}日`;
  }

  function getLunarLeapRuleInfo(lunar, enabled = true) {
    if (!enabled || !lunar?.isLeap) return { enabled: !!enabled, applied: false };
    const next = getNextLunarMonth(lunar.year, lunar.month);
    let effectiveDay = Number(lunar.day) || 1;
    if (typeof lunarToSolar === 'function') {
      while (effectiveDay > 1 && !lunarToSolar(next.year, next.month, effectiveDay, false)) effectiveDay -= 1;
    }
    return {
      enabled: true,
      applied: true,
      actual: { year: lunar.year, month: lunar.month, day: lunar.day, isLeap: true },
      effective: { year: next.year, month: next.month, day: effectiveDay, isLeap: false },
      actualLabel: formatLunarRuleLabel(lunar.year, lunar.month, lunar.day, true),
      effectiveLabel: formatLunarRuleLabel(next.year, next.month, effectiveDay, false),
    };
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
      const leapMonthRule = getLunarLeapRuleInfo(lunarObj, lunarLeap);
      const lunarPrefix = cityScope === 'global' ? '中国农历口径' : '农历';
      const lunarText = typeof formatLunarDate === 'function' ? formatLunarDate(lunarObj) : `${lunarYear}年${lunarMonth}月${lunarDay}日`;
      const leapRuleText = leapMonthRule.applied ? ` · ${leapMonthRule.actualLabel}按${leapMonthRule.effectiveLabel}排盘` : '';
      return {
        year: solar.getFullYear(),
        month: solar.getMonth() + 1,
        day: solar.getDate(),
        isLunar: true,
        lunarYear,
        lunarMonth,
        lunarDay,
        lunarLeap,
        leapMonthRule,
        lunarLabel: lunarText,
        calModeLabel: `${lunarPrefix} ${lunarText}（公历 ${solar.getFullYear()}-${pad2(solar.getMonth() + 1)}-${pad2(solar.getDate())}）${leapRuleText}`,
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
      const leapText = data.leapMonthRule?.applied ? ` · ${data.leapMonthRule.actualLabel}按${data.leapMonthRule.effectiveLabel}排盘` : '';
      preview.textContent = `公历: ${data.year}-${pad2(data.month)}-${pad2(data.day)}${cityScope === 'global' ? ' · 中国农历口径' : ''}${leapText}`;
    } else if (typeof solarToLunar === 'function') {
      const lunar = solarToLunar(data.year, data.month, data.day);
      preview.textContent = lunar ? `${cityScope === 'global' ? '中国农历参考' : '农历'}: ${typeof formatLunarDate === 'function' ? formatLunarDate(lunar) : ''}` : '';
    } else {
      preview.textContent = '';
    }
    updateTrueSolarPreview();
  }

  function updateLunarLeapState(options = {}) {
    const year = Number($('#mbpLunarYear')?.value);
    const month = Number($('#mbpLunarMonth')?.value);
    const leapMonth = getLunarLeapMonth(year);
    const wrap = $('#mbpLunarLeapWrap');
    const note = $('#mbpLunarLeapNote');
    const checkbox = $('#mbpLunarLeap');
    const enabled = !!(formCalMode === 'lunar' && leapMonth && month === leapMonth);
    const wasEnabled = wrap?.dataset.leapEnabled === '1';
    if (wrap) {
      wrap.hidden = !enabled;
      wrap.dataset.leapEnabled = enabled ? '1' : '0';
    }
    if (checkbox && enabled && (options.autoDefault || !wasEnabled)) checkbox.checked = true;
    if (checkbox && !enabled) checkbox.checked = false;
    if (note) {
      if (!enabled) note.textContent = '';
      else if (checkbox?.checked) note.textContent = `闰${leapMonth}月 · 按下个月排盘`;
      else note.textContent = `闰${leapMonth}月 · 勾选后按下个月排盘`;
    }
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
      timeZone: selectedCity?.timeZone || (selectedCity && typeof getBirthTimeZoneId === 'function' ? getBirthTimeZoneId(selectedCity) : 'Asia/Shanghai'),
      cityName: selectedCity ? selectedCity.city : '',
    });
    const localTimeText = formatLocalTimeLabel(tst.tzOffset);
    if (selectedCity && $('#mbpCityTz')) $('#mbpCityTz').textContent = localTimeText;
    const trueSolarDate = dateStrWithDayShift(date, tst.dayShift);
    const trueSolarTime = `${pad2(tst.trueSolarHour)}:${pad2(tst.trueSolarMinute)}`;
    const trueSolarDisplay = tst.dayShift ? `${trueSolarDate} ${trueSolarTime}` : trueSolarTime;
    display.innerHTML = `出生证时间 ${pad2(time.hour)}:${pad2(time.minute)} ${escapeHtml(formatTzOffset(tst.tzOffset))} · 真太阳时 <b>${escapeHtml(trueSolarDisplay)}</b> · ${escapeHtml(tst.diffStr)}`;
    if (badge) {
      badge.textContent = tst.isEstimated ? '默认北京估算' : `${formatSelectedCityLabel(selectedCity)} · ${formatTzOffset(tst.tzOffset)}`;
      badge.style.display = '';
    }
    if (shichen) {
      const idx = typeof window.tstToShichen === 'function' ? window.tstToShichen(tst.trueSolarHour, tst.trueSolarMinute) : localShichenIndex(tst.trueSolarHour, tst.trueSolarMinute);
      shichen.textContent = `排盘采用：${shichenNames[idx]}时`;
    }
  }

  function showFormError(message, tone = 'error') {
    const error = $('#mbpFormError');
    if (!error) return;
    error.textContent = message || '';
    error.style.display = message ? 'block' : 'none';
    error.classList.toggle('is-guide', !!message && tone === 'guide');
  }

  function guideUserToBirthForm(message) {
    const form = $('#mbpBirthForm');
    const formCard = form?.querySelector('.mbp-form-card');
    const prompt = $('.mbp-input-prompt');
    setDecodeStatus(message);
    showFormError(message, 'guide');
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formCard?.classList.remove('is-input-guided');
    prompt?.classList.remove('is-input-guided');
    void formCard?.offsetWidth;
    formCard?.classList.add('is-input-guided');
    prompt?.classList.add('is-input-guided');
    window.clearTimeout(inputGuideTimer);
    inputGuideTimer = window.setTimeout(() => {
      formCard?.classList.remove('is-input-guided');
      prompt?.classList.remove('is-input-guided');
    }, 1800);
    $('#mbpYear')?.focus({ preventScroll: true });
  }

  function collectProfileFromForm() {
    const date = solarFromForm();
    if (date.error) return { error: date.error };
    const time = formTime();
    applyFirstCitySuggestion({ hideDropdown: true });
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
      cityTimeZone: selectedCity?.timeZone || (selectedCity && typeof getBirthTimeZoneId === 'function' ? getBirthTimeZoneId(selectedCity) : ''),
      cityScope,
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
        timeZone: profile.cityTimeZone || '',
        cityName: profile.cityName || profile.city,
      })
      : null;
    const timeStr = `${pad2(profile.hour)}:${pad2(profile.minute)}`;
    const localDateStr = dateStr(profile);
    const trueSolarDateStr = tstResult ? dateStrWithDayShift(profile, tstResult.dayShift) : localDateStr;
    const trueSolarTimeStr = tstResult ? `${trueSolarDateStr} ${pad2(tstResult.trueSolarHour)}:${pad2(tstResult.trueSolarMinute)}` : '';
    const birthTimeZone = profile.cityTimeZone || tstResult?.timeZone || '';
    const timeIdx = typeof window.tstToShichen === 'function' && tstResult
      ? window.tstToShichen(tstResult.trueSolarHour, tstResult.trueSolarMinute)
      : localShichenIndex(profile.hour, profile.minute);
    const leapMonthRule = profile.isLunar
      ? getLunarLeapRuleInfo({
        year: profile.lunarYear,
        month: profile.lunarMonth,
        day: profile.lunarDay,
        isLeap: profile.lunarLeap,
      }, !!profile.lunarLeap)
      : { enabled: false, applied: false };
    return {
      ...profile,
      dateStr: trueSolarDateStr,
      localDateStr,
      trueSolarDateStr,
      cstHour: profile.hour,
      cstMinute: profile.minute,
      timeStr,
      localTimeStr: `${localDateStr} ${timeStr}`,
      solarTimeStr: trueSolarTimeStr,
      trueSolarTimeStr,
      birthTimeZone,
      timeIdx,
      tstResult,
      leapMonthRule,
      cityDetail: profile.cityLon ? {
        name: profile.city,
        lon: profile.cityLon,
        lat: profile.cityLat,
        tzOffset: tstResult?.tzOffset ?? profile.cityTz ?? 8,
        tzOffsetMinutes: tstResult?.tzOffsetMinutes,
        timeZone: birthTimeZone,
        scope: profile.cityScope || defaultCityScope,
      } : null,
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
      profile.cityLon,
      profile.cityTimeZone,
      profile.isLunar,
      profile.lunarYear,
      profile.lunarMonth,
      profile.lunarDay,
      profile.lunarLeap,
    ].join('|');
  }

  function getChartBundle() {
    const key = profileKey(state.profile);
    if (state.chart && state.chartKey === key) return { chart: state.chart, norm: state.norm };
    const lib = getAstroLib();
    if (!lib) return { error: '排盘模块未加载，请刷新页面重试。' };
    const norm = computeNorm(state.profile);
    const genderStr = state.profile.gender === 'male' ? '男' : '女';
    try {
      const chart = norm.leapMonthRule?.applied
        ? (
          typeof lib.byLunar === 'function'
            ? lib.byLunar(`${norm.leapMonthRule.effective.year}-${norm.leapMonthRule.effective.month}-${norm.leapMonthRule.effective.day}`, norm.timeIdx, genderStr, false, false)
            : lib.astrolabeByLunarDate(`${norm.leapMonthRule.effective.year}-${norm.leapMonthRule.effective.month}-${norm.leapMonthRule.effective.day}`, norm.timeIdx, genderStr, false, false)
        )
        : (
          typeof lib.bySolar === 'function'
            ? lib.bySolar(norm.dateStr, norm.timeIdx, genderStr, true)
            : lib.astrolabeBySolarDate(norm.dateStr, norm.timeIdx, genderStr, true)
        );
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
    selectedCity = profile.cityLon ? { province: profile.cityProvince || profile.city, city: profile.cityShort || profile.city, name: profile.city, lon: profile.cityLon, lat: profile.cityLat, tzOffset: profile.cityTz ?? 8, timeZone: profile.cityTimeZone || '' } : findCity(profile.city);
    setCityScope(profile.cityScope || (selectedCity && !isChinaCity(selectedCity) ? 'global' : defaultCityScope), { keepSelected: true });
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
    syncBookClientMeta();
    renderClientList();
  }

  function syncBookClientMeta() {
    const sourceMark = $('#mbpProfileMark');
    const sourceTitle = $('#mbpProfileTitle');
    const sourceMeta = $('#mbpProfileMeta');
    const bookMark = $('#mbpBookMark');
    const bookName = $('#mbpBookName');
    const bookSubtitle = $('#mbpBookSubtitle');
    if (bookMark && sourceMark) bookMark.textContent = sourceMark.textContent || '命';
    if (bookName && sourceTitle) bookName.textContent = sourceTitle.textContent || '命 主';
    if (bookSubtitle && sourceMeta) bookSubtitle.textContent = sourceMeta.textContent || '待排盘 · 命书未启';
    syncXuClientMeta();
  }

  function syncXuClientMeta() {
    const sourceMark = $('#mbpProfileMark');
    const sourceTitle = $('#mbpProfileTitle');
    const sourceMeta = $('#mbpProfileMeta');
    const xuMark = $('#mbpXuProfileMark');
    const xuTitle = $('#mbpXuProfileTitle');
    const xuMeta = $('#mbpXuProfileMeta');
    const xuStatus = $('#mbpXuProfileStatus');
    if (xuMark && sourceMark) xuMark.textContent = sourceMark.textContent || '命';
    if (xuTitle && sourceTitle) xuTitle.textContent = sourceTitle.textContent || '命 主';
    if (xuMeta && sourceMeta) {
      xuMeta.textContent = state.chartReady
        ? `${sourceMeta.textContent || '当前命盘'} · 全页共用`
        : '先排盘，再让许大师读这一张';
    }
    if (xuStatus) xuStatus.textContent = state.chartReady ? '当前命盘' : '待排盘';
  }

  function clientLabel(profile) {
    return profile.name || (profile.gender === 'female' ? '女命客户' : '男命客户');
  }

  function clientAvatarMark(label, profile = {}) {
    const raw = String(label || '').trim().replace(/\s+/g, '');
    const withoutTitle = raw.replace(/(先生|小姐|女士|老板|老师|师傅|总|姐|哥|兄|弟|妹|太太|夫人|命主|客户)+$/g, '');
    const source = withoutTitle || raw;
    const chinese = source.match(/[\u4e00-\u9fff]/);
    if (chinese) return chinese[0];
    const alpha = source.match(/[A-Za-z0-9]/);
    if (alpha) return alpha[0].toUpperCase();
    if (profile.gender === 'female') return '女';
    if (profile.gender === 'male') return '男';
    return '命';
  }

  function clientSubline(profile) {
    return `${profile.year}-${pad2(profile.month)}-${pad2(profile.day)} ${pad2(profile.hour)}:${pad2(profile.minute)} · ${profile.cityName || profile.city || '未填地点'}`;
  }

  function renderClientListInto(listEl, countEl, emptyText) {
    if (!listEl) return;
    const remoteText = clientRemoteSyncing ? '同步中' : (clientRemoteMessage || (clientRemoteLoaded ? '已同步' : '本地'));
    const savedCount = clientRecordsCache.filter((item) => item.id !== 'current').length;
    if (countEl) countEl.textContent = `${savedCount} 个盘 · ${remoteText}`;
    if (!clientRecordsCache.length) {
      listEl.innerHTML = `<div class="mbp-client-empty">${escapeHtml(emptyText)}</div>`;
      return;
    }
    const activeKey = profileHistoryKey(state.profile);
    listEl.innerHTML = clientRecordsCache.map((item, index) => {
      const profile = item.profile;
      const label = clientLabel(profile);
      const mark = clientAvatarMark(label, profile);
      const isActive = profileHistoryKey(profile) === activeKey;
      const isCurrent = item.id === 'current';
      const confirming = deleteConfirmClientId === item.id;
      return `
        <div class="mbp-client-item ${isActive ? 'is-active' : ''}" data-client-id="${escapeHtml(item.id)}">
          <button class="mbp-client-select" type="button" data-client-index="${index}" aria-label="选择${escapeHtml(label)}">
            <span class="mbp-client-mini">${escapeHtml(mark)}</span>
            <span class="mbp-client-copy">
              <b>${escapeHtml(label)}</b>
              <small>${escapeHtml(clientSubline(profile))}</small>
            </span>
          </button>
          <span class="mbp-client-tools" role="group" aria-label="${escapeHtml(label)}操作">
            ${isCurrent ? `<button class="mbp-client-tool" type="button" data-client-action="save" data-client-id="${escapeHtml(item.id)}">保存</button>` : `
              <button class="mbp-client-tool" type="button" data-client-action="edit" data-client-id="${escapeHtml(item.id)}">编辑</button>
              <button class="mbp-client-tool danger ${confirming ? 'is-confirming' : ''}" type="button" data-client-action="delete" data-client-id="${escapeHtml(item.id)}">${confirming ? '确认删' : '删除'}</button>
            `}
          </span>
        </div>
      `;
    }).join('');
  }

  function renderClientList() {
    clientRecordsCache = loadCustomerRecords();
    renderClientListInto($('#mbpClientList'), $('#mbpClientCount'), '暂无客户盘，排盘后会自动保存。');
    renderClientListInto($('#mbpXuClientList'), $('#mbpXuClientCount'), '暂无命盘，先排盘后会自动保存。');
  }

  function closeClientMenu() {
    [
      ['#mbpClientMenu', '#mbpClientToggle'],
      ['#mbpXuClientMenu', '#mbpXuClientToggle'],
    ].forEach(([menuSelector, toggleSelector]) => {
      const menu = $(menuSelector);
      const toggle = $(toggleSelector);
      if (menu) menu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleClientMenu(menuSelector, toggleSelector) {
    const menu = $(menuSelector);
    const toggle = $(toggleSelector);
    if (!menu || !toggle) return;
    const nextOpen = menu.hidden;
    closeClientMenu();
    renderClientList();
    menu.hidden = !nextOpen;
    toggle.setAttribute('aria-expanded', String(nextOpen));
  }

  function selectClientRecordByIndex(index) {
    const record = clientRecordsCache[Number(index)];
    if (record?.profile) applyClientProfile(record.profile, {
      chartRecordId: record.id && record.id !== 'current' ? (record.chartRecordId || record.id) : '',
    });
  }

  function findClientRecordById(id) {
    return clientRecordsCache.find((record) => record.id === id) || null;
  }

  function editClientRecord(id) {
    const record = findClientRecordById(id);
    if (!record?.profile) return;
    editingClientRecordId = record.id === 'current' ? '' : record.id;
    deleteConfirmClientId = '';
    applyClientProfile(record.profile, {
      chartRecordId: record.id && record.id !== 'current' ? (record.chartRecordId || record.id) : '',
      chartReady: false,
    });
    $('#mbpBirthForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function saveCurrentClientRecord() {
    const profile = collectProfileFromForm();
    if (profile.error) {
      guideUserToBirthForm(profile.error);
      return;
    }
    state.profile = normalizeProfile(profile);
    const record = saveProfileToHistory(state.profile, { id: editingClientRecordId || state.chartRecordId || '' });
    editingClientRecordId = record.id;
    deleteConfirmClientId = '';
    saveProfile();
    updateForm();
    renderChart();
    closeClientMenu();
    clientRemoteMessage = '保存中';
    renderClientList();
  }

  async function deleteClientRecord(id) {
    const record = findClientRecordById(id);
    if (!record || id === 'current') return;
    const targetKey = profileHistoryKey(record.profile);
    const targetIds = new Set(customerRecordIdentityKeys(record));
    const removeMatch = (item) => customerRecordIdentityKeys(item).some((key) => targetIds.has(key))
      || profileHistoryKey(recordToProfile(item)) === targetKey;
    rememberCustomerTombstone(record);
    writeCustomerHistoryRecords(readCustomerHistoryRecords().filter((item) => !removeMatch(item)));
    try {
      localStorage.setItem(legacyHistoryKey, JSON.stringify(readJsonList(legacyHistoryKey).filter((item) => !removeMatch(item))));
    } catch (_) {}
    if (targetIds.has(editingClientRecordId)) editingClientRecordId = '';
    if (targetIds.has(state.chartRecordId)) state.chartRecordId = '';
    clientRemoteMessage = '删除中';
    deleteConfirmClientId = '';
    renderClientList();
    await deleteCustomerRecordFromRemote(record);
    await pushCustomerRecordsToRemote(readCustomerHistoryRecords());
    renderClientList();
  }

  function requestClientRecordDelete(id) {
    if (!id || id === 'current') return;
    if (deleteConfirmClientId === id) {
      deleteClientRecord(id);
      return;
    }
    deleteConfirmClientId = id;
    renderClientList();
  }

  function handleClientListClick(event) {
    const actionButton = event.target.closest('[data-client-action]');
    if (actionButton) {
      event.stopPropagation();
      const id = actionButton.dataset.clientId || actionButton.closest('[data-client-id]')?.dataset.clientId || '';
      if (actionButton.dataset.clientAction === 'save') saveCurrentClientRecord();
      if (actionButton.dataset.clientAction === 'edit') editClientRecord(id);
      if (actionButton.dataset.clientAction === 'delete') requestClientRecordDelete(id);
      return;
    }
    const item = event.target.closest('.mbp-client-select');
    if (!item) return;
    deleteConfirmClientId = '';
    selectClientRecordByIndex(item.dataset.clientIndex);
  }

  function startNewClientProfile() {
    editingClientRecordId = '';
    deleteConfirmClientId = '';
    applyClientProfile({ ...defaultProfile, name: '' }, { chartReady: false });
    $('#mbpBirthForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetForProfileChange() {
    state.chart = null;
    state.chartKey = '';
    state.chartRecordId = '';
    state.norm = null;
    state.chartReady = false;
    state.chartConfirmedKey = '';
    state.decoded = false;
    state.aiResults = {};
    state.luckAiResults = {};
    state.xiaoLianAiResults = {};
    state.selectedLuckRangeKey = '';
    state.selectedXiaoLianAge = '';
    state.batchDecoding = false;
    clearLifeCurveData();
    window._chart = null;
    window._chartInputs = null;
    window._chartRecordId = null;
    document.body.classList.remove('is-decoded');
    resetAiContent();
    if (typeof window._chatPanelPrepareForNewChart === 'function') window._chatPanelPrepareForNewChart();
  }

  function applyClientProfile(profile, options = {}) {
    state.profile = normalizeProfile(profile);
    formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
    const shouldRenderChart = options.chartReady !== false;
    resetForProfileChange();
    state.chartRecordId = options.chartRecordId || '';
    state.chartReady = shouldRenderChart;
    state.chartConfirmedKey = shouldRenderChart ? profileHistoryKey(state.profile) : '';
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

  function fcRealCurrentAge() {
    const curYear = new Date().getFullYear();
    const birthYear = Number(fcBirthYear) || Number(state.profile.year) || curYear;
    return Math.max(1, curYear - birthYear + 1);
  }

  function fcAgeSupportState(maxAge) {
    const supportedMaxAge = Math.max(1, Math.floor(Number(maxAge) || 1));
    const realAge = fcRealCurrentAge();
    return {
      realAge,
      supportedMaxAge,
      displayAge: Math.max(1, Math.min(supportedMaxAge, realAge)),
      isOverflow: realAge > supportedMaxAge,
    };
  }

  function currentAgeOverflowNote(scope, realAge, supportedMaxAge) {
    return `当前${realAge}岁，${scope}仅展示到${supportedMaxAge}岁，以下都是末段参考，不把${supportedMaxAge}岁当成当前。`;
  }

  function fcClampAge(age) {
    const num = Math.floor(Number(age) || 1);
    return Math.max(1, Math.min(fcMaxAge(), num));
  }

  function xiaoLianMaxAge() {
    const fallback = Math.min(xiaoLianDisplayMaxAge, fcMaxAge());
    const ages = Object.keys(fcLiunianSeq || {})
      .map(Number)
      .filter((age) => Number.isFinite(age) && age >= 1 && age <= xiaoLianDisplayMaxAge);
    return Math.max(1, ages.length ? Math.max(...ages) : fallback);
  }

  function clampXiaoLianAge(age) {
    const num = Math.floor(Number(age) || 1);
    return Math.max(1, Math.min(xiaoLianMaxAge(), num));
  }

  function xiaoLianAgeToYear(age) {
    return fcSequenceStartYear + clampXiaoLianAge(age) - 1;
  }

  function fcAgeToYear(age) {
    return fcSequenceStartYear + fcClampAge(age) - 1;
  }

  function fcCurrentVirtualAge() {
    return fcClampAge(fcRealCurrentAge());
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

  function fcOppositeBranch(branch) {
    return fcDuiGong[branch] || '';
  }

  function fcPalaceByBranch(chart, branch) {
    return branch ? (chart?.palaces || []).find((palace) => palace.earthlyBranch === branch) || null : null;
  }

  function fcEnsureSanfangLayer() {
    const grid = $('#mbpChartGrid');
    if (!grid) return null;
    let svg = $('#mbpFcSanfangLines');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'mbpFcSanfangLines';
      svg.setAttribute('class', 'fc-sanfang-lines is-empty');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<path class="fc-sanfang-opposite"></path><path class="fc-sanfang-triangle"></path><g class="fc-sanfang-points"></g>';
      grid.prepend(svg);
    }
    return svg;
  }

  function fcClearSanfangLines(svg = $('#mbpFcSanfangLines')) {
    if (!svg) return;
    svg.classList.add('is-empty');
    svg.querySelector('.fc-sanfang-triangle')?.setAttribute('d', '');
    svg.querySelector('.fc-sanfang-opposite')?.setAttribute('d', '');
    const points = svg.querySelector('.fc-sanfang-points');
    if (points) points.innerHTML = '';
  }

  function fcBranchPoint(branch) {
    const grid = $('#mbpChartGrid');
    const cellId = fcBranchId[branch];
    const cell = cellId ? document.getElementById(cellId) : null;
    if (!grid || !cell) return null;
    const gridRect = grid.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    if (!gridRect.width || !gridRect.height) return null;
    return {
      x: ((cellRect.left + cellRect.width / 2 - gridRect.left) / gridRect.width) * 100,
      y: ((cellRect.top + cellRect.height / 2 - gridRect.top) / gridRect.height) * 100,
    };
  }

  function fcRenderSanfangLines(activeBranch) {
    const svg = fcEnsureSanfangLayer();
    if (!svg || !fcCurrentChart) {
      fcClearSanfangLines(svg);
      return;
    }
    const activeIndex = fcZhi.indexOf(activeBranch);
    const oppositeBranch = fcDuiGong[activeBranch];
    if (activeIndex < 0 || !oppositeBranch) {
      fcClearSanfangLines(svg);
      return;
    }
    const sanheBranches = [activeBranch, fcZhi[(activeIndex + 4) % 12], fcZhi[(activeIndex + 8) % 12]];
    const sanhePoints = sanheBranches.map(fcBranchPoint);
    const oppositePoint = fcBranchPoint(oppositeBranch);
    if (sanhePoints.some((point) => !point) || !oppositePoint) {
      fcClearSanfangLines(svg);
      return;
    }

    const [p0, p1, p2] = sanhePoints;
    svg.querySelector('.fc-sanfang-triangle')?.setAttribute('d', `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`);
    svg.querySelector('.fc-sanfang-opposite')?.setAttribute('d', `M ${p0.x} ${p0.y} L ${oppositePoint.x} ${oppositePoint.y}`);
    const points = svg.querySelector('.fc-sanfang-points');
    if (points) {
      points.innerHTML = [...sanhePoints, oppositePoint]
        .map((point) => `<circle class="fc-sanfang-point" cx="${point.x}" cy="${point.y}" r="1.05"></circle>`)
        .join('');
    }
    svg.classList.remove('is-empty');
  }

  function fcBuildYearCards(startYear = fcSequenceStartYear) {
    const maxAge = fcMaxAge();
    fcActiveAge = fcCurrentVirtualAge();
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

    const selectedDecade = selectedLuckInfo({ readonly: true }).selected;
    const activeIndex = Math.max(0, fcZhi.indexOf(activeBranch));
    const related = [fcZhi[(activeIndex + 4) % 12], fcZhi[(activeIndex + 8) % 12], fcZhi[(activeIndex + 6) % 12]];
    const isBen = branch === activeBranch;
    const isRel = !isBen && related.includes(branch);
    const isDecade = !!selectedDecade?.branch && branch === selectedDecade.branch;
    const xiaoAgeState = fcAgeSupportState(xiaoLianMaxAge());
    const displayedXiaoLianAge = state.selectedXiaoLianAge
      ? clampXiaoLianAge(state.selectedXiaoLianAge)
      : (xiaoAgeState.isOverflow ? null : clampXiaoLianAge(fcActiveAge || xiaoAgeState.displayAge));
    const displayedXiaoLianBranch = displayedXiaoLianAge ? fcResolveXiaoLianBranch(displayedXiaoLianAge) : '';
    const isXiaoLian = !!displayedXiaoLianBranch && branch === displayedXiaoLianBranch;
    const smallStars = allSmallStars(palace);
    const visibleSmallStars = smallStars.slice(0, 3);
    const densityClass = `${visibleSmallStars.length >= 3 ? ' fc-compact-stars' : ''}`;
    cell.className = `fc-cell${isBen ? ' fc-ben' : isRel ? ' fc-rel' : ''}${isDecade ? ' fc-decade' : ''}${isXiaoLian ? ' fc-xiaolian' : ''}${densityClass}`;

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
    const minorHtml = visibleSmallStars
      .map((star) => `<div class="fc-minor-star">${escapeHtml(starText(star))}</div>`)
      .join('');
    const shenHtml = [palace.changsheng12, palace.boshi12].filter(Boolean)
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join('');
    const yearly = fcActiveTab === '流年卦' ? fcYearlyMap[branch] : null;
    const yearlyMutagen = yearly ? (yearly.mutagen || [])
      .map((item) => `<span class="fc-minor-star" style="color:#963d32">${escapeHtml(item)}</span>`)
      .join('') : '';
    const yearlyStars = yearly ? (yearly.stars || yearly.majorStars || []).slice(0, 2)
      .map((star) => `<span class="fc-minor-star" style="color:#476885">${escapeHtml(star.name || star)}</span>`)
      .join('') : '';
    const yearlyHtml = yearlyMutagen || yearlyStars ? `<div class="fc-yearly-row">${yearlyMutagen}${yearlyStars}</div>` : '';
    const xiaoLianHtml = isXiaoLian && displayedXiaoLianAge ? `<div class="fc-xiaolian-badge">${displayedXiaoLianAge}岁</div>` : '';
    const stemBranch = `${palace.heavenlyStem || ''}${palace.earthlyBranch || ''}`;
    const ageRange = rangeFromDecadal(palace);
    const ageStr = shouldDisplayDecadeRange(ageRange) ? `${ageRange[0]}–${ageRange[1]}` : '';
    const palaceName = `${palace.isBodyPalace ? '身宫\n' : ''}${palace.name || ''}`;

    cell.innerHTML = `
      <div class="fc-cell-top">
        ${mutagenHtml ? `<div class="fc-cell-mutagen">${mutagenHtml}</div>` : ''}
        <div class="fc-major-list">${majorHtml}</div>
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

  function fcClearCells(message, usePlaceholder = false) {
    Object.values(fcBranchId).forEach((id) => {
      const cell = document.getElementById(id);
      if (cell) {
        cell.className = `fc-cell${usePlaceholder ? ' fc-empty-cell' : ''}`;
        cell.innerHTML = usePlaceholder ? '<span class="fc-empty-mark">***</span>' : '';
        cell.onclick = null;
      }
    });
    fcClearSanfangLines();
    $('#mbpFcName').textContent = '待排盘';
    $('#mbpFcMeta').textContent = usePlaceholder ? '***' : '';
    $('#mbpFcSolar').textContent = usePlaceholder ? '***' : (message || '—');
    $('#mbpFcLunar').textContent = usePlaceholder ? '***' : '—';
    $('#mbpFcTst').textContent = usePlaceholder ? '***' : '—';
    $('#mbpFcShichen').textContent = usePlaceholder ? '***' : '—';
    $('#mbpFcSizhu').innerHTML = '';
    $('#mbpFcXiantian').textContent = usePlaceholder ? '***' : '—';
    $('#mbpFcHoutian').textContent = usePlaceholder ? '***' : '—';
    $('#mbpFcLiunian').textContent = usePlaceholder ? '***' : '—';
    fcRenderHexagram(null);
    if (usePlaceholder) {
      $('#mbpFcHexName').textContent = '***';
      $('#mbpFcHexSub').textContent = '';
      $('#mbpFcHexLines').innerHTML = Array.from({ length: 6 }, () => '<div class="fc-yao-solid fc-yao-placeholder"></div>').join('');
      $('#mbpFcGuaciCard').style.display = 'none';
    }
    renderZipingFooter(null);
  }

  function fcRenderHighlight(activeBranch) {
    if (!fcCurrentChart) return;
    fcActiveBranch = activeBranch;
    (fcCurrentChart.palaces || []).forEach((palace) => fcBuildCell(palace, activeBranch));
    requestAnimationFrame(() => fcRenderSanfangLines(activeBranch));
  }

  function fcPulseXiaoLianPalace() {
    window.clearTimeout(fcXiaoLianPulseTimer);
    requestAnimationFrame(() => {
      const cell = document.querySelector('.fc-cell.fc-xiaolian');
      if (!cell) return;
      cell.classList.remove('is-locating');
      void cell.offsetWidth;
      cell.classList.add('is-locating');
      fcXiaoLianPulseTimer = window.setTimeout(() => {
        cell.classList.remove('is-locating');
      }, 1800);
    });
  }

  function fcLocateXiaoLianAge(age, options = {}) {
    const safeAge = clampXiaoLianAge(age);
    state.selectedXiaoLianAge = safeAge;
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
    fcRenderLuckLocator();
    if (options.pulse !== false) fcPulseXiaoLianPalace();
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

  function fcSwitchTab(tab) {
    const nextTab = tab || '先天卦';
    const enteringLiunian = nextTab === '流年卦' && fcActiveTab !== '流年卦';
    fcActiveTab = nextTab;
    if (enteringLiunian) {
      fcActiveAge = fcCurrentVirtualAge();
      state.selectedXiaoLianAge = fcAgeSupportState(xiaoLianMaxAge()).isOverflow ? '' : clampXiaoLianAge(fcActiveAge);
      fcLoadYearly(fcAgeToYear(fcActiveAge));
      fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
      $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;
    }
    fcRenderTabs();
    if (fcActiveTab === '流年卦') fcRenderLiunianScroll();
    fcRenderHexagram();
    renderZipingFooter();
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
    fcRenderLuckLocator();
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

  function fcRenderLuckLocator() {
    const panel = $('#mbpLuckLocator');
    const xiaoToggle = $('#mbpXiaoLianToggle');
    const xiaoCurrent = $('#mbpXiaoLianCurrent');
    const xiaoMenu = $('#mbpXiaoLianMenu');
    if (!panel || !xiaoToggle || !xiaoCurrent || !xiaoMenu) return;

    const chart = fcCurrentChart || state.chart;
    if (!state.chartReady || !chart) {
      panel.classList.add('is-pending');
      xiaoToggle.disabled = true;
      xiaoToggle.classList.remove('is-current');
      xiaoCurrent.textContent = '--';
      xiaoMenu.hidden = true;
      xiaoMenu.innerHTML = '';
      xiaoToggle.setAttribute('aria-expanded', 'false');
      return;
    }

    panel.classList.remove('is-pending');
    const xiaoInfo = selectedXiaoLianInfo();
    const selectedYear = xiaoInfo.selected;

    xiaoToggle.disabled = !xiaoInfo.items.length;
    xiaoToggle.classList.toggle('is-current', !!selectedYear?.isCurrent && !xiaoInfo.isOverflowCurrentAge);
    xiaoCurrent.textContent = xiaoInfo.isOverflowCurrentAge
      ? `${xiaoInfo.realCurrentAge}岁·参考${xiaoInfo.supportedMaxAge}岁`
      : (selectedYear
        ? `${selectedYear.age}岁`
        : '--');
    xiaoMenu.innerHTML = xiaoInfo.items.length
      ? xiaoInfo.items.map((item) => `
        <button type="button" role="option" class="${item.age === selectedYear?.age ? 'is-selected' : ''}${item.isCurrent ? ' is-current' : ''}" aria-selected="${item.age === selectedYear?.age ? 'true' : 'false'}" data-xiaolian-option="${item.age}">
          <span>${escapeHtml(`${item.age}岁`)}</span>${item.isCurrent ? '<i class="fc-xiaolian-current-dot" aria-label="当前"></i>' : ''}
        </button>
      `).join('')
      : '<span class="mbp-xiaolian-empty">暂无</span>';
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
      renderYijingAssist();
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
    renderYijingAssist();
  }

  function fcActiveHexagram() {
    if (fcActiveTab === '先天卦') return fcXiantianResult;
    if (fcActiveTab === '后天卦') return fcHoutianResult;
    return fcLiunianResult;
  }

  function fcGuaciKey(tab = fcActiveTab) {
    if (tab === '先天卦') return 'xian';
    if (tab === '后天卦') return 'hou';
    return 'liu';
  }

  function fcGuaciText(result, tab = fcActiveTab) {
    if (!result?.name) return '';
    const entry = typeof window.getGuaciEntryByName === 'function'
      ? window.getGuaciEntryByName(result.name)
      : (window.GUACI_DATA && window.GUACI_DATA[result.name]);
    return entry ? (entry[fcGuaciKey(tab)] || '') : '';
  }

  function fcMasterEntry(result) {
    if (!result) return null;
    if (typeof window.getYijingMasterEntry === 'function') {
      const entry = window.getYijingMasterEntry(result);
      if (entry) return entry;
    }
    const data = window.YIJING_MASTER_DATA || {};
    const byNum = window.YIJING_MASTER_BY_NUM || {};
    const cleanName = String(result.name || '').replace(/\s+/g, '');
    const num = Number(result.num);
    const numKey = Number.isFinite(num) ? String(num) : '';
    return data[result.name] || data[cleanName] || (numKey ? (byNum[numKey] || byNum[numKey.padStart(2, '0')]) : null) || null;
  }

  function yijingMasterLabel(tab = fcActiveTab) {
    if (tab === '先天卦') return '先天';
    if (tab === '后天卦') return '后天';
    return '流年';
  }

  function yijingRoleLabels(tab = fcActiveTab) {
    if (tab === '先天卦') return ['先天卦', '先天'];
    if (tab === '后天卦') return ['后天卦', '后天'];
    return ['流年卦', '流年', '值年卦', '值年'];
  }

  function yijingExtractRoleText(text, tab = fcActiveTab) {
    const source = String(text || '').replace(/\r/g, '').trim();
    if (!source) return '';
    const labels = ['先天卦', '先天', '后天卦', '后天', '流年卦', '流年', '值年卦', '值年'];
    const pattern = new RegExp(`(?:^|[\\s；;。])(${labels.join('|')})[：:]`, 'g');
    const matches = [];
    let match;
    while ((match = pattern.exec(source))) {
      const label = match[1];
      const labelStart = match.index + match[0].lastIndexOf(label);
      matches.push({ label, labelStart, contentStart: pattern.lastIndex });
    }
    const targets = yijingRoleLabels(tab);
    const currentIndex = matches.findIndex((item) => targets.includes(item.label));
    if (currentIndex < 0) return '';
    const current = matches[currentIndex];
    const next = matches[currentIndex + 1];
    return source
      .slice(current.contentStart, next ? next.labelStart : source.length)
      .replace(/^[\s，,；;。]+/, '')
      .trim();
  }

  function yijingMasterText(result, tab = fcActiveTab) {
    const entry = fcMasterEntry(result);
    if (!entry) return '';
    return entry[fcGuaciKey(tab)] || yijingExtractRoleText(entry.summary, tab) || '';
  }

  function cleanYijingReadingText(text) {
    return String(text || '')
      .replace(/白话说，就是把“[^”]+”当作这个卦在现实中的一个应象，结合人、事、时间、地点来判断，不是只读字面。?/g, '')
      .replace(/这句是看先天底子、出生家庭、性格和早年象。?/g, '')
      .replace(/这句是看后天走法，也就是中后段人生、职业路线和成败方式。?/g, '')
      .replace(/这句是看流年应事，重点在这一年容易发生什么、该怎么避。?/g, '')
      .replace(/讲解[:：]\s*(?=\n|$)/g, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function escapeRegExp(text) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function stripYijingRolePrefix(text, tab = fcActiveTab, result = null) {
    const labels = yijingRoleLabels(tab);
    let next = cleanYijingReadingText(text);
    next = next.replace(new RegExp(`^(${labels.map(escapeRegExp).join('|')})[：:]\\s*`), '');
    if (result?.name) {
      next = next.replace(new RegExp(`^${escapeRegExp(result.name)}(?:卦)?[：:，,。\\s]*`), '');
    }
    return next.trim();
  }

  function yijingCompareText(text) {
    return cleanYijingReadingText(text).replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, '');
  }

  function stripRepeatedYijingOriginal(text, original) {
    let next = cleanYijingReadingText(text);
    const source = cleanYijingReadingText(original);
    if (!next || !source) return next;

    const exact = source.split(/\s+/).map(escapeRegExp).join('\\s*');
    const exactPattern = new RegExp(`^${exact}[\\s，,。；;、]*`);
    const exactRemoved = next.replace(exactPattern, '').trim();
    if (exactRemoved !== next) return exactRemoved;

    const sourceHead = yijingCompareText(source);
    const nextHead = yijingCompareText(next);
    let overlap = 0;
    while (overlap < sourceHead.length && overlap < nextHead.length && sourceHead[overlap] === nextHead[overlap]) {
      overlap += 1;
    }
    if (overlap >= 8) {
      return next.replace(/^.{8,180}?[。！？；;]/, '').trim();
    }
    return next;
  }

  function yijingDisplayMasterText(text, original, result, tab = fcActiveTab) {
    const withoutLabel = stripYijingRolePrefix(text, tab, result);
    const withoutOriginal = stripRepeatedYijingOriginal(withoutLabel, original);
    return withoutOriginal || withoutLabel;
  }

  function yijingDetailWithoutLead(text, lead) {
    const source = cleanYijingReadingText(text);
    const head = cleanYijingReadingText(lead);
    if (!source || !head) return source;
    const exact = head.split(/\s+/).map(escapeRegExp).join('\\s*');
    const next = source.replace(new RegExp(`^${exact}[\\s，,。；;、]*`), '').trim();
    return next || source;
  }

  function yijingReadableSentence(text, fallback = '') {
    const source = cleanYijingReadingText(text).replace(/\s+/g, ' ').trim();
    if (!source) return fallback;
    const match = source.match(/^(.{14,96}?[。！？；])/);
    return match ? match[1] : source.slice(0, 88);
  }

  function renderYijingTextSections(text, fallback = '排盘后显示对应卦位的逐条讲解。') {
    const source = cleanYijingReadingText(String(text || '').replace(/\r/g, ''));
    if (!source) {
      return `<section class="mbp-yijing-paragraph"><p>${escapeHtml(fallback)}</p></section>`;
    }
    const normalized = source.replace(/(^|\n)(原句[:：])/g, '\n\n$2');
    const chunks = normalized.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
    const paragraphs = chunks.map((chunk, index) => {
      const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
      const first = lines[0] || '';
      const isQuote = /^原句[:：]/.test(first);
      const title = isQuote
        ? first.replace(/^原句[:：]\s*/, '') || `原句 ${index + 1}`
        : (index === 0 ? '重点讲解' : `细节 ${index + 1}`);
      const bodyLines = isQuote ? lines.slice(1) : lines;
      const body = cleanYijingReadingText(bodyLines.join('\n').replace(/^讲解[:：]\s*/, ''));
      if (!body) return '';
      const heading = isQuote || index > 0 ? `<strong>${escapeHtml(title)}</strong>` : '';
      return `<p>${heading}${escapeHtml(body).replace(/\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('');

    return `<section class="mbp-yijing-paragraph">${paragraphs || `<p>${escapeHtml(fallback)}</p>`}</section>`;
  }

  function yijingLineHtml(result) {
    return (result?.lines || []).map((line) => {
      if (line === 'gap') return '<div class="mbp-yijing-gap"></div>';
      if (line === 'solid') return '<div class="mbp-yijing-line"></div>';
      return '<div class="mbp-yijing-line is-broken"><i></i><i></i></div>';
    }).join('');
  }

  function yijingImageUrl(result) {
    if (!result?.name) return '';
    const map = window.YIJING_IMAGE_MAP || window.yijingImageMap || {};
    const cleanName = String(result.name).replace(/\s+/g, '');
    const mapped = result.image || result.imageUrl || map[result.name] || map[cleanName];
    if (mapped) return mapped;
    const num = Number(result.num);
    return Number.isFinite(num) && num > 0
      ? `../images/yijing-hexagrams/${String(num).padStart(2, '0')}.webp`
      : '';
  }

  function renderYijingArt(result) {
    const image = $('#mbpYijingImage');
    const placeholder = $('#mbpYijingImagePlaceholder');
    const title = $('#mbpYijingImageTitle');
    const lines = $('#mbpYijingImageLines');
    const imageUrl = yijingImageUrl(result);

    if (title) title.textContent = result?.name || '等待排盘';
    if (lines) lines.innerHTML = yijingLineHtml(result);

    if (!image || !placeholder) return;
    image.alt = result?.name ? `${result.name}易经卦图` : '易经卦图';
    if (!imageUrl) {
      image.removeAttribute('src');
      image.hidden = true;
      placeholder.classList.remove('is-hidden');
      return;
    }

    image.onload = () => {
      image.hidden = false;
      placeholder.classList.add('is-hidden');
    };
    image.onerror = () => {
      image.hidden = true;
      placeholder.classList.remove('is-hidden');
    };
    if (image.getAttribute('src') !== imageUrl) image.src = imageUrl;
    if (image.complete && image.naturalWidth > 0) {
      image.hidden = false;
      placeholder.classList.add('is-hidden');
    }
  }

  function yijingTimingLineName(index) {
    const labels = ['一爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    return labels[index] || '应爻';
  }

  function yijingTimingNumberName(num) {
    const labels = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    return labels[num] || String(num);
  }

  function yijingTimingMonthName(num) {
    return num === 1 ? '正' : yijingTimingNumberName(num);
  }

  function yijingTimingLineType(row) {
    const line = row?.lines?.[row.activeLineIndex];
    if (line === 'solid') return '阳爻';
    if (line === 'broken') return '阴爻';
    return '爻位';
  }

  function resolveYijingTiming(result) {
    const buildMap = window.ZipingGenerator?.buildMonthDayGuaMap;
    if (fcActiveTab !== '流年卦' || !result || typeof buildMap !== 'function') return null;
    const lineNum = result.tianjiLineNum || result.lineNum || result.yuanTangLine || result.activeLineNum;
    const map = buildMap(result, lineNum);
    if (!map?.months?.length) return null;

    const year = fcAgeToYear(fcActiveAge);
    const now = new Date();
    const isCurrentYear = Number(year) === now.getFullYear();
    const monthIndex = isCurrentYear ? now.getMonth() : 0;
    const dayOfMonth = isCurrentYear ? now.getDate() : 1;
    const cycleDay = Math.min(30, Math.max(1, dayOfMonth));
    const segment = Math.min(5, Math.max(1, Math.ceil(cycleDay / 6)));
    const dayInSegment = ((cycleDay - 1) % 6) + 1;
    const segmentStartDay = ((segment - 1) * 6) + 1;
    const segmentEndDay = segment * 6;
    const month = Math.min(map.months.length, Math.max(1, monthIndex + 1));
    const monthGua = map.months[month - 1] || map.months[0];
    const dayGua = map.days?.find((item) => item.month === month && item.segment === segment)
      || map.days?.find((item) => item.month === month)
      || null;
    const sixDayRangeLabel = `${year}年${month}月${segmentStartDay}日至${month}月${segmentEndDay}日`;

    return {
      year,
      month,
      segment,
      dayInSegment,
      segmentStartDay,
      segmentEndDay,
      sixDayRangeLabel,
      isCurrentYear,
      monthGua,
      dayGua,
    };
  }

  function yijingTimingGuaPayload(row) {
    if (!row) return null;
    const originalText = fcGuaciText(row, '流年卦');
    const teacherRaw = yijingMasterText(row, '流年卦');
    return {
      name: row.name || '',
      period: row.period || '',
      lineNum: row.tianjiLineNum || row.lineNum || row.yuanTangLine || row.activeLineNum || '',
      activeLineIndex: row.activeLineIndex,
      lineName: yijingTimingLineName(row.activeLineIndex),
      lineType: yijingTimingLineType(row),
      originalText,
      teacherText: yijingDisplayMasterText(teacherRaw, originalText, row),
    };
  }

  function yijingTimingPayload(result, info) {
    return {
      age: fcActiveAge,
      solarYear: info.year,
      isCurrentYear: info.isCurrentYear,
      yearGua: yijingTimingGuaPayload(result),
      monthGua: yijingTimingGuaPayload(info.monthGua),
      sixDayGua: yijingTimingGuaPayload(info.dayGua),
      sixDayRange: {
        month: info.month,
        segment: info.segment,
        startDay: info.segmentStartDay,
        endDay: info.segmentEndDay,
        label: info.sixDayRangeLabel,
      },
      todayLine: {
        dayInSegment: info.dayInSegment,
        lineName: info.dayGua ? yijingTimingLineName(info.dayGua.activeLineIndex) : '',
        lineType: info.dayGua ? yijingTimingLineType(info.dayGua) : '',
      },
      instruction: '流年主卦定全年总调，流月卦定本月应事，六日卦定六日动向，今日爻位只作当天落点。',
    };
  }

  function yijingTimingKeyFromPayload(payload) {
    return [
      payload?.age,
      payload?.solarYear,
      payload?.yearGua?.name,
      payload?.monthGua?.name,
      payload?.sixDayGua?.name,
      payload?.sixDayRange?.label,
      payload?.todayLine?.dayInSegment,
    ].join('|');
  }

  function renderYijingTimingAiResult(data) {
    const card = normalizeAiData(data || {}).card || {};
    const sections = Array.isArray(card.sections) ? card.sections.filter((item) => String(item?.content || '').trim()) : [];
    if (!sections.length && !card.body && !card.summary && !card.risk) return '';
    const sectionHtml = sections.length
      ? sections.map((item) => `
          <div class="mbp-yijing-timing-reading-item">
            <span>${escapeHtml(item.title || '应期')}</span>
            <p>${escapeHtml(item.content || '')}</p>
          </div>
        `).join('')
      : `<div class="mbp-yijing-timing-reading-item"><p>${escapeHtml(card.body || card.summary || '')}</p></div>`;
    const risk = card.risk ? `<div class="mbp-yijing-timing-risk">${escapeHtml(card.risk)}</div>` : '';
    return `
      <div class="mbp-yijing-timing-reading">
        ${card.profileBadge ? `<div class="mbp-yijing-timing-badge">${escapeHtml(card.profileBadge)}</div>` : ''}
        ${sectionHtml}
        ${risk}
      </div>
    `;
  }

  async function generateYijingTimingReading(result) {
    const info = resolveYijingTiming(result);
    if (!info) return;
    const payload = yijingTimingPayload(result, info);
    const key = yijingTimingKeyFromPayload(payload);
    yijingTimingOpen = true;
    yijingTimingAiBusy = true;
    yijingTimingAiError = '';
    yijingTimingAiKey = key;
    renderYijingAssist();
    try {
      const data = await callOriginalAi('yijing_timing', { yijingTiming: payload });
      yijingTimingAiResult = data;
      yijingTimingAiKey = key;
    } catch (err) {
      yijingTimingAiError = err?.message || '生成失败，请稍后重试';
    } finally {
      yijingTimingAiBusy = false;
      renderYijingAssist();
    }
  }

  function renderYijingTiming(result) {
    const box = $('#mbpYijingTiming');
    if (!box) return;
    const info = resolveYijingTiming(result);
    box.hidden = !info;
    if (!info) {
      box.innerHTML = '';
      return;
    }

    const expanded = yijingTimingOpen;
    const yearName = result?.name || '流年卦';
    const monthName = info.monthGua?.name || '—';
    const dayName = info.dayGua?.name || '—';
    const dayLine = info.dayGua ? `${yijingTimingLineName(info.dayGua.activeLineIndex)} · ${yijingTimingLineType(info.dayGua)}` : '—';
    const note = info.isCurrentYear
      ? '月卦以节气为界，当前日期落入此月序与六日段。'
      : '该流年不在当前年份，默认列正月第一段，供查看流月与六日结构。';
    const payload = yijingTimingPayload(result, info);
    const timingKey = yijingTimingKeyFromPayload(payload);
    if (yijingTimingAiKey && yijingTimingAiKey !== timingKey) {
      yijingTimingAiResult = null;
      yijingTimingAiError = '';
      yijingTimingAiKey = '';
    }
    const aiResultHtml = yijingTimingAiResult && yijingTimingAiKey === timingKey
      ? renderYijingTimingAiResult(yijingTimingAiResult)
      : '';
    const aiErrorHtml = yijingTimingAiError
      ? `<div class="mbp-yijing-timing-error">${escapeHtml(yijingTimingAiError)}</div>`
      : '';

    box.innerHTML = `
      <button class="mbp-yijing-timing-toggle" type="button" data-yijing-timing-toggle aria-expanded="${expanded ? 'true' : 'false'}">
        <span>流年细分</span>
        <strong>${escapeHtml(yearName)} → ${escapeHtml(monthName)} → ${escapeHtml(dayName)}</strong>
        <i>${expanded ? '收起' : '展开'}</i>
      </button>
      <div class="mbp-yijing-timing-panel" ${expanded ? '' : 'hidden'}>
        <div class="mbp-yijing-timing-item">
          <span>流月卦</span>
          <strong>${yijingTimingMonthName(info.month)}月序 · ${escapeHtml(monthName)}</strong>
        </div>
        <div class="mbp-yijing-timing-item">
          <span>六日卦</span>
          <strong>${escapeHtml(info.sixDayRangeLabel)} · ${escapeHtml(dayName)}</strong>
        </div>
        <div class="mbp-yijing-timing-item">
          <span>今日爻位</span>
          <strong>${info.isCurrentYear ? `第${yijingTimingNumberName(info.dayInSegment)}日 · ${escapeHtml(dayLine)}` : '非当前年不定今日'}</strong>
        </div>
        <p>上方流年卦「${escapeHtml(yearName)}」是本年主卦；这里显示它往下推出的流月卦与六日卦。${escapeHtml(note)} 六日卦每卦管六日，只作流年应期细分。</p>
        <div class="mbp-yijing-timing-actions">
          <button type="button" data-yijing-timing-ai ${yijingTimingAiBusy ? 'disabled' : ''}>${yijingTimingAiBusy ? '生成中…' : (aiResultHtml ? '重新生成应期解读' : '生成应期解读')}</button>
        </div>
        ${aiErrorHtml}
        ${aiResultHtml}
      </div>
    `;
  }

  function renderYijingAssist() {
    const root = $('#mbpYijingAssist');
    if (!root) return;
    const result = fcActiveHexagram();
    const tabs = $('#mbpYijingTabs');
    if (tabs) {
      tabs.querySelectorAll('[data-yijing-tab]').forEach((button) => {
        const active = button.dataset.yijingTab === fcActiveTab;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
      });
    }

    const name = $('#mbpYijingName');
    const meta = $('#mbpYijingMeta');
    const lines = $('#mbpYijingLines');
    const years = $('#mbpYijingYears');
    const guaci = $('#mbpYijingGuaci');
    const masterTitle = $('#mbpYijingMasterTitle');
    const masterSummary = $('#mbpYijingMasterSummary');
    const masterText = $('#mbpYijingMasterText');
    const guaciTextValue = fcGuaciText(result);
    const masterRawBody = yijingMasterText(result);
    const masterBody = yijingDisplayMasterText(masterRawBody, guaciTextValue, result);
    const masterLead = yijingReadableSentence(masterBody);
    const masterDetail = yijingDetailWithoutLead(masterBody, masterLead);

    if (name) name.textContent = result?.name || '等待排盘';
    if (meta) {
      if (!result) {
        meta.textContent = '先完成排盘';
      } else if (fcActiveTab === '流年卦') {
        meta.textContent = `流年 · ${fcAgeToYear(fcActiveAge)}年 · ${fcActiveAge}岁`;
      } else {
        meta.textContent = `${yijingMasterLabel()} · ${result.num ? `第${result.num}卦` : '本命卦'}`;
      }
    }
    if (lines) lines.innerHTML = yijingLineHtml(result);
    renderYijingArt(result);

    if (years) {
      const showYears = fcActiveTab === '流年卦' && fcYearCards.length;
      years.hidden = !showYears;
      if (showYears) {
        years.innerHTML = fcYearCards.map((item) => `
          <button type="button" class="${item.age === fcActiveAge ? 'is-active' : ''}" data-yijing-age="${item.age}">
            ${item.age}岁<small>${item.year}年</small>
          </button>
        `).join('');
        requestAnimationFrame(() => {
          years.querySelector('.is-active')?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
        });
      } else {
        years.innerHTML = '';
      }
    }

    if (guaci) {
      if (guaciTextValue) {
        guaci.innerHTML = `<span class="mbp-yijing-source-label">古籍原文</span>${escapeHtml(guaciTextValue)}`;
      } else {
        guaci.textContent = result ? '此卦暂无卦辞数据，可先参考上方命盘与六卷解读。' : '先完成排盘。';
      }
    }

    if (masterTitle) {
      masterTitle.textContent = result ? `${yijingMasterLabel()} · ${result.name}` : '等待排盘';
    }
    if (masterSummary) {
      masterSummary.textContent = masterLead || (result ? '此卦暂无名师总论。' : '排盘后显示讲课式总论。');
    }
    if (masterText) {
      masterText.innerHTML = renderYijingTextSections(
        masterDetail,
        result ? '此卦暂无对应名师解读。' : '排盘后显示对应卦位的逐条讲解。'
      );
    }
    renderYijingTiming(result);
  }

  function pillarText(stem, branch) {
    return [stem, branch].filter(Boolean).join('') || '—';
  }

  function renderZipingFooter(pillars = fcBirthPillars) {
    const ids = [
      ['mbpZipingYear', 'yearStem', 'yearBranch'],
      ['mbpZipingMonth', 'monthStem', 'monthBranch'],
      ['mbpZipingDay', 'dayStem', 'dayBranch'],
      ['mbpZipingHour', 'hourStem', 'hourBranch'],
    ];
    ids.forEach(([id, stemKey, branchKey]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pillars ? pillarText(pillars[stemKey], pillars[branchKey]) : '—';
    });

    const note = $('#mbpZipingNote');
    if (!note) return;
    if (!pillars) {
      note.textContent = '排盘后显示子平法四柱摘要。';
      return;
    }

    const dayStem = pillars.dayStem || '—';
    const dayElement = stemElements[dayStem] ? `属${stemElements[dayStem]}` : '';
    const monthBranch = pillars.monthBranch || '—';
    const season = branchSeasons[monthBranch] || '节令';
    const guaNames = [fcXiantianResult?.name, fcHoutianResult?.name, fcLiunianResult?.name]
      .filter(Boolean)
      .join('、');
    note.textContent = `日主${dayStem}${dayElement}，月令${monthBranch}为${season}。这里先把年、月、日、时拆开，后续可与${guaNames || '先后天卦和流年卦'}一起看根气、格局与当下应期。`;
  }

  function fcSelectYear(age) {
    fcActiveAge = fcClampAge(age);
    state.selectedXiaoLianAge = clampXiaoLianAge(fcActiveAge);
    fcLoadYearly(fcAgeToYear(fcActiveAge));
    fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
    $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;
    fcRenderLiunianScroll();
    if (fcActiveTab === '流年卦') fcRenderHexagram();
    renderZipingFooter();
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
    fcRenderLuckLocator();
  }

  function renderClassicChart(chart, norm) {
    document.body.classList.remove('is-chart-pending');
    document.body.classList.add('is-chart-ready');
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
    $('#mbpFcLunar').textContent = norm.leapMonthRule?.applied
      ? `${chart.chineseDate || chart.lunarDate || '—'} · ${norm.leapMonthRule.actualLabel}按${norm.leapMonthRule.effectiveLabel}排盘`
      : (chart.chineseDate || chart.lunarDate || '—');
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
    renderZipingFooter(fcBirthPillars);
    fcRenderHighlight(fcActiveBranch);
    fcRenderLuckLocator();
  }

  function renderChart() {
    if (!state.chartReady) {
      document.body.classList.remove('is-chart-ready');
      document.body.classList.add('is-chart-pending');
      fcCurrentChart = null;
      fcXiantianResult = null;
      fcHoutianResult = null;
      fcLiunianResult = null;
      fcLiunianSeq = {};
      fcActiveTab = '先天卦';
      fcRenderTabs();
      updateHeroMeta({});
      fcClearCells('***', true);
      fcRenderLuckLocator();
      const summary = $('#mbpChartSummary');
      syncChatPanelState();
      if (summary) summary.textContent = '点击开始排盘后显示命盘摘要。';
      return;
    }

    document.body.classList.remove('is-chart-pending');
    const bundle = getChartBundle();
    updateHeroMeta(bundle);
    const summary = $('#mbpChartSummary');

    if (bundle.error) {
      document.body.classList.remove('is-chart-ready');
      fcCurrentChart = null;
      fcXiantianResult = null;
      fcHoutianResult = null;
      fcLiunianResult = null;
      fcLiunianSeq = {};
      fcClearCells(bundle.error);
      fcRenderLuckLocator();
      syncChatPanelState();
      if (summary) summary.textContent = bundle.error;
      return;
    }

    const { chart, norm } = bundle;
    state.chartRecordId = state.chartRecordId || makeLocalId();
    window._chartRecordId = state.chartRecordId;
    renderClassicChart(chart, norm);
    const four = mutagens(chart);
    if (summary) {
      summary.innerHTML = `命主身主：<b>${escapeHtml(chart.soul || '—')} · ${escapeHtml(chart.body || '—')}</b><br>四化分布：${escapeHtml(four.slice(0, 4).join('、') || '未读取到明显四化')}`;
    }
    syncChatPanelState();
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
          title: '身宫批命',
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
        ['专题批命', `身宫、婚姻、健康、财运、事业五项专题已在上方展开，适合作为深度报告主体。`],
        ['十年大限解读', `十年为一个大限，先看当前十年，再按用户选择批前后阶段。`],
        ['小限流年', `小限流年单独成卷，看当年触发、对宫应事与流年卦象。`],
        ['人生曲线', `把关键年份做成曲线阅读，帮助用户看清高低点和转折位置。`],
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
    text = text.replace(/^\uFEFF/, '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    text = text.replace(/^json\s*/i, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) text = text.slice(start, end + 1);
    if (!text.startsWith('{')) return null;
    try {
      return JSON.parse(text);
    } catch (_) {
      try {
        return JSON.parse(text.replace(/,\s*([}\]])/g, '$1'));
      } catch (__) {
        return null;
      }
    }
  }

  function decodeJsonFragment(value) {
    const text = String(value || '').replace(/\r?\n/g, '\\n');
    try {
      return JSON.parse(`"${text}"`).trim();
    } catch (_) {
      return String(value || '')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();
    }
  }

  function looseJsonString(source, key) {
    const match = String(source || '').match(new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, 'i'));
    return match ? decodeJsonFragment(match[1]) : '';
  }

  function looseAiCard(value) {
    const text = String(value || '').trim();
    if (!text || !/[{[]/.test(text) || !/"(title|content|summary|body|sections|profileBadge)"\s*:/.test(text)) return null;
    const card = {};
    const title = looseJsonString(text, 'title');
    const profileBadge = looseJsonString(text, 'profileBadge');
    const summary = looseJsonString(text, 'summary');
    const body = looseJsonString(text, 'body') || looseJsonString(text, 'content');
    const sectionSource = text.match(/"sections"\s*:\s*\[([\s\S]*?)\]\s*[,}]/i)?.[1] || '';
    const sections = (sectionSource.match(/\{[\s\S]*?\}/g) || [])
      .map((block) => ({
        title: looseJsonString(block, 'title') || '解读',
        content: looseJsonString(block, 'content') || looseJsonString(block, 'body') || looseJsonString(block, 'summary'),
      }))
      .filter((section) => section.title || section.content);
    if (title) card.title = title;
    if (profileBadge) card.profileBadge = profileBadge;
    if (summary) card.summary = summary;
    if (sections.length) card.sections = sections;
    else if (body) card.body = body;
    return (card.title || card.summary || card.body || card.sections || card.profileBadge) ? card : null;
  }

  function parsedAiCard(value) {
    const parsed = parseAiJson(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return looseAiCard(value);
    const card = parsed.card && typeof parsed.card === 'object' ? parsed.card : parsed;
    return (card.title || card.summary || card.body || card.content || card.sections || card.profileBadge)
      ? { ...card }
      : null;
  }

  function hasPlainAiPayload(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (value.card || value.finalAnswer || value.answer || value.text) return true;
    if (typeof value.result === 'string' && value.result.trim()) return true;
    return Boolean(value.title || value.summary || value.body || value.content || value.sections || value.profileBadge);
  }

  function unwrapAiEnvelope(data, depth = 0) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || depth > 4 || hasPlainAiPayload(data)) return data;
    const envelopeKeys = ['data', 'result', 'payload', 'output', 'response'];
    for (const key of envelopeKeys) {
      const value = data[key];
      if (!value) continue;
      if (typeof value === 'string') {
        const parsed = parseAiJson(value);
        const loose = parsed ? null : looseAiCard(value);
        if (!parsed && !loose && !value.trim()) continue;
        const unwrapped = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? unwrapAiEnvelope(parsed, depth + 1)
          : (loose ? { card: loose } : { finalAnswer: value });
        return { ...data, ...unwrapped };
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        const unwrapped = unwrapAiEnvelope(value, depth + 1);
        if (unwrapped !== value || hasPlainAiPayload(unwrapped)) {
          return {
            ...data,
            ...unwrapped,
            meta: data.meta || unwrapped.meta,
            backendSteps: data.backendSteps || unwrapped.backendSteps,
          };
        }
      }
    }
    return data;
  }

  function normalizeAiData(data) {
    if (!data) return data;
    if (typeof data === 'string') {
      const parsed = parseAiJson(data);
      const loose = parsed ? null : looseAiCard(data);
      return parsed ? normalizeAiData(parsed) : (loose ? { card: loose } : { card: { body: data } });
    }
    const unwrapped = unwrapAiEnvelope(data);
    if (unwrapped !== data) return normalizeAiData(unwrapped);
    const rootText = data.finalAnswer || data.answer || data.result || data.text;
    const parsedRoot = parseAiJson(rootText);
    const looseRoot = parsedRoot ? null : looseAiCard(rootText);
    const parsedCard = parseAiJson(data.card);
    const card = parsedCard || data.card || parsedRoot?.card || parsedRoot || looseRoot || {};
    const next = { ...data, ...(parsedRoot?.card ? parsedRoot : {}) };
    if (card && typeof card === 'object' && !Array.isArray(card)) {
      next.card = { ...card };
    }
    const bodyAsCard = parsedAiCard(next.card?.body || next.card?.summary || next.card?.content);
    if (bodyAsCard) {
      next.card = { ...next.card, ...bodyAsCard };
    }
    const nestedSectionCard = Array.isArray(next.card?.sections)
      ? next.card.sections.map((section) => parsedAiCard(section?.content || section?.body || section?.summary)).find(Boolean)
      : null;
    if (nestedSectionCard) {
      next.card = { ...next.card, ...nestedSectionCard };
    }
    const embeddedCard = findEmbeddedAiCard({
      card: next.card,
      finalAnswer: next.finalAnswer,
      answer: next.answer,
      result: next.result,
      text: next.text,
    });
    if (embeddedCard) {
      next.card = { ...next.card, ...embeddedCard };
    }
    return next;
  }

  function findEmbeddedAiCard(source, depth = 0) {
    if (!source || depth > 4) return null;
    if (typeof source === 'string') return parsedAiCard(source);
    if (Array.isArray(source)) {
      for (const item of source) {
        const found = findEmbeddedAiCard(item, depth + 1);
        if (found) return found;
      }
      return null;
    }
    if (typeof source !== 'object') return null;
    const textKeys = ['body', 'summary', 'content', 'text', 'finalAnswer', 'answer', 'result'];
    for (const key of textKeys) {
      const found = findEmbeddedAiCard(source[key], depth + 1);
      if (found) return found;
    }
    if (Array.isArray(source.sections)) {
      for (const section of source.sections) {
        const found = findEmbeddedAiCard(section?.content || section?.body || section?.summary || section, depth + 1);
        if (found) return found;
      }
    }
    const objectKeys = ['card', 'data', 'payload', 'output', 'response'];
    for (const key of objectKeys) {
      const found = findEmbeddedAiCard(source[key], depth + 1);
      if (found) return found;
    }
    return null;
  }

  function aiCardText(data) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const sections = Array.isArray(card.sections) ? card.sections : [];
    if (sections.length) {
      return sections.map((section) => [cleanAiInlineText(section.title), cleanAiText(section.content)].filter(Boolean).join('：')).filter(Boolean).join('\n\n');
    }
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    return cleanAiText(card.body || card.summary || card.content || card.text || finalAnswer || '');
  }

  function hasAiRenderableContent(data) {
    if (!data || data._error) return false;
    return Boolean(aiCardText(data));
  }

  function aiErrorData(task, message) {
    return {
      _error: true,
      card: {
        title: task?.label || '批命结果',
        body: `生成失败：${message}`,
      },
    };
  }

  function aiCardTitle(data, fallback) {
    return cleanAiInlineText(normalizeAiData(data)?.card?.title) || fallback;
  }

  function isTechnicalAiTitle(title) {
    const value = cleanAiInlineText(title);
    return !value || /^[a-z_]+$/i.test(value) || aiTasks.some((task) => task.module === value);
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
    const text = card.body || card.summary || card.content || card.text || finalAnswer || '';
    if (!text) return [];
    const fallbackTitle = cleanAiInlineText(card.title) || '解读';
    return aiTextSectionsFromMarkdown(text, fallbackTitle);
  }

  function insightSummary(data, fallback = '等待原站 AI 返回。', max = 88) {
    const normalized = normalizeAiData(data);
    const card = normalized?.card || {};
    const finalAnswer = parseAiJson(normalized?.finalAnswer) ? '' : normalized?.finalAnswer;
    const source = cleanAiText(card.summary || aiSections(data)[0]?.content || card.body || card.content || card.text || finalAnswer || fallback);
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

  function splitReadableSentences(text) {
    return cleanAiText(text)
      .replace(/\n+/g, ' ')
      .match(/[^。！？；.!?;]+[。！？；.!?;]?/g)
      ?.map((item) => item.trim())
      .filter(Boolean) || [];
  }

  function pickSentence(sentences, keywords, fallbackIndex = 0) {
    return sentences.find((sentence) => keywords.some((keyword) => sentence.includes(keyword)))
      || sentences[fallbackIndex]
      || sentences[0]
      || '';
  }

  function highlightInsightText(text) {
    return escapeHtml(text).replace(
      /(关键|重点|风险|压力|机会|建议|提醒|注意|不宜|适合|容易|43岁至52岁|33至42岁|53至62岁|43-52岁|33-42岁|53-62岁)/g,
      '<mark>$1</mark>'
    );
  }

  function specialTopicParts(section) {
    const content = cleanAiText(section?.content || section?.body || '');
    const sentences = splitReadableSentences(content);
    const lead = trimText(sentences[0] || content, 90);
    const focus = trimText(
      pickSentence(sentences.slice(1), ['关键', '重点', '代表', '方向', '当前', '大限', '机会', '格局'], 0),
      88
    );
    const warning = trimText(
      pickSentence([...sentences].reverse(), ['风险', '压力', '注意', '避免', '不要', '容易', '不宜', '提醒', '调理'], 0),
      88
    );
    const detail = trimText(
      sentences.filter((item) => item !== sentences[0] && item !== focus && item !== warning).slice(0, 2).join(''),
      128
    );
    return {
      title: cleanAiInlineText(section?.title) || '专题批命',
      lead: lead || '等待专题结论生成。',
      focus: focus || lead || '先看主线，再看细节。',
      warning: warning || '稳住节奏，避免被单一事件牵动。',
      detail,
    };
  }

  function renderSpecialTopicSegments(section) {
    const part = specialTopicParts(section);
    return `
      <div class="mbp-topic-segments">
        <p class="mbp-topic-lead"><b>结论</b><span>${highlightInsightText(part.lead)}</span></p>
        <div class="mbp-topic-split">
          <section>
            <strong>重点</strong>
            <p>${highlightInsightText(part.focus)}</p>
          </section>
          <section>
            <strong>提醒</strong>
            <p>${highlightInsightText(part.warning)}</p>
          </section>
        </div>
        ${part.detail ? `<p class="mbp-topic-detail">${highlightInsightText(part.detail)}</p>` : ''}
      </div>
    `;
  }

  function specialTopicTag(title) {
    const text = normalizeText(title);
    if (text.includes('身宫')) return '行动模式';
    if (text.includes('婚姻') || text.includes('夫妻')) return '关系模式';
    if (text.includes('健康') || text.includes('疾厄')) return '身体节律';
    if (text.includes('财') || text.includes('财帛')) return '钱财路径';
    if (text.includes('事业') || text.includes('官禄')) return '职业上升';
    return '专题提醒';
  }

  function specialReportParts(section) {
    const title = cleanAiInlineText(section?.title) || '专题批命';
    const content = cleanAiText(section?.content || section?.body || '');
    const sentences = splitReadableSentences(content);
    const noteSource = pickSentence(
      [...sentences].reverse(),
      ['提醒', '注意', '不要', '避免', '不宜', '风险', '压力', '容易', '忌'],
      Math.max(sentences.length - 1, 0)
    );
    const leadSentences = sentences.slice(0, 2).join('');
    const lead = trimText(leadSentences || content, 260);
    const note = trimText(noteSource || '重点看完正文，再看这条提醒。', 220);
    const bodySentences = sentences.filter((item) => item !== noteSource && !leadSentences.includes(item));
    const detail = trimText(
      (bodySentences.length ? bodySentences.join('') : content.replace(leadSentences, '').replace(noteSource, '')).trim(),
      1200
    );
    return {
      title,
      tag: specialTopicTag(title),
      lead: lead || '等待专题结论生成。',
      detail: detail || trimText(content, 260) || '专题正文生成后显示。',
      note,
    };
  }

  function renderSpecialReportTopic(section, index) {
    const part = specialReportParts(section);
    const number = String(index + 1).padStart(2, '0');
    return `
      <section class="mbp-special-reading-item">
        <div class="mbp-special-reading-main">
          <header>
            <span class="mbp-special-reading-no">${number}</span>
            <h4>${escapeHtml(part.title)}</h4>
          </header>
          <p class="mbp-special-reading-lead">${highlightInsightText(part.lead)}</p>
          <p class="mbp-special-reading-detail">${highlightInsightText(part.detail)}</p>
        </div>
        <aside class="mbp-special-reading-note">
          <strong>${escapeHtml(part.tag)}</strong>
          <p>${highlightInsightText(part.note)}</p>
          <small>重点看完正文，再看这条提醒。</small>
        </aside>
      </section>
    `;
  }

  function renderSpecialChapterBlock(sections, fallbackText) {
    const topics = (sections || [])
      .map((section) => ({ title: section.title, content: cleanAiText(section.content || '') }))
      .filter((section) => section.content);
    const list = topics.length ? topics : [{ title: '专题批命', content: fallbackText || '五项专题等待原站 AI 返回。' }];
    const overview = list.slice(0, 2).map((section) => specialReportParts(section).lead).join(' ');
    return `
      <div class="mbp-special-chapter mbp-special-reading">
        <div class="mbp-special-reading-overview">
          <span>专题总览</span>
          <strong>先看结论，再读五个专题</strong>
          <p>${highlightInsightText(trimText(overview || fallbackText || '专题批命生成后显示。', 260))}</p>
        </div>
        <div class="mbp-special-reading-list">
          ${list.map(renderSpecialReportTopic).join('')}
        </div>
      </div>
    `;
  }

  function renderInsightBlock(data, fallbackTitle, fallbackText, options = {}) {
    const sections = aiSections(data);
    const summary = insightSummary(data, fallbackText, options.summaryMax || 88);
    const bullets = sectionBullets(sections, options.bulletLimit ?? 3, summary);
    const detail = sections.length ? sections : [{ title: fallbackTitle, content: fallbackText }];
    const detailLabel = options.detailLabel || '展开完整解读';
    if (options.direct) {
      const summaryHead = normalizeText(summary).slice(0, 32);
      const hasStructuredDetail = sections.length > 1 || sections.some((section) => {
        const title = normalizeText(section.title);
        return title && title !== '解读' && title !== normalizeText(fallbackTitle);
      });
      const repeatsDetail = detail.some((section) => {
        const title = normalizeText(section.title);
        const content = normalizeText(section.content);
        const contentHead = content.slice(0, 32);
        return (title && summary.startsWith(title))
          || (contentHead && summary.includes(contentHead))
          || (summaryHead && content.startsWith(summaryHead));
      });
      const showSummary = !!summaryHead && !hasStructuredDetail && !repeatsDetail;
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

  function adviceRiskSentences(text) {
    const riskWords = [
      '风险', '压力', '注意', '提醒', '容易', '不宜', '避免', '波折', '变动', '分离',
      '冷战', '疾病', '疾厄', '心血管', '血压', '心律', '财务', '现金流', '合同',
      '口舌', '是非', '官司', '婚姻', '健康', '消耗', '破', '忌', '凶', '不稳',
    ];
    return splitReadableSentences(text)
      .filter((sentence) => sentence.length >= 12 && riskWords.some((word) => sentence.includes(word)))
      .map((sentence) => trimText(sentence, 110));
  }

  function actionAdviceData(overall, luck, xiaoLian) {
    const modules = [
      ['命格', overall],
      ['十年大限', luck],
      ['小限流年', xiaoLian],
      ['身宫', state.aiResults.shengong],
      ['婚姻', state.aiResults.hunyin],
      ['健康', state.aiResults.jiankang],
      ['财运', state.aiResults.caiyun],
      ['事业', state.aiResults.shiye],
    ];
    const overallCard = normalizeAiData(overall)?.card || {};
    const sources = modules
      .map(([label, data]) => ({ label, text: aiCardText(data) }))
      .filter((item) => item.text);
    const seen = new Set();
    const risks = [];
    const pushRisk = (label, text) => {
      const value = trimText(cleanAiText(text), 110);
      const key = normalizeText(value).slice(0, 54);
      if (!key || seen.has(key)) return;
      seen.add(key);
      risks.push({ label, text: value });
    };
    if (overallCard.risk) pushRisk('总览', overallCard.risk);
    sources.forEach((source) => {
      adviceRiskSentences(source.text).slice(0, 2).forEach((text) => {
        pushRisk(source.label, text);
      });
    });
    const fallbackRisk = '命盘里出现的压力、变动与破耗，都先合在一起看；不要只盯单点吉凶，要看哪里最容易牵动情绪、关系、健康和财务。';
    const summary = risks.length ? risks : [{ label: '总括', text: fallbackRisk }];
    return {
      risks: summary.slice(0, 8),
      steps: [
        {
          title: '第一，先改心态',
          text: '命盘看见风险，不是让人害怕，是提醒先把念头收正。心一正，选择就不偏；一念正，就是走正道。',
        },
        {
          title: '第二，再借居住方位扶正一念',
          text: '笔记里讲“运操之在自己手中”，居住环境也会牵动人的念头。可以用居住方位、常坐常睡的位置、房间功能，帮助自己把心念从偏处拉回正处。',
        },
        {
          title: '第三，方位上避凶取稳',
          text: '厨房、厕所这类口舌、是非、刀火之象，尽量不要压在常住的位置；客厅取稳定、承载的位置更好。阳宅调整不是迷信动作，是让环境天天提醒自己走正念、做正事。',
        },
      ],
      note: '方位是外缘，心念是根本；外在位置调顺，是为了让里面那一念更容易正。',
    };
  }

  function renderActionAdviceBlock(overall, luck, xiaoLian) {
    const advice = actionAdviceData(overall, luck, xiaoLian);
    return `
      <div class="mbp-advice-chapter">
        <section class="mbp-advice-risk">
          <span>风险总括</span>
          <strong>先把上面提到的风险收成一张清单</strong>
          <ul>
            ${advice.risks.map((item) => `
              <li><b>${escapeHtml(item.label)}</b><span>${highlightInsightText(item.text)}</span></li>
            `).join('')}
          </ul>
        </section>
        <div class="mbp-advice-steps">
          ${advice.steps.map((step) => `
            <section>
              <h4>${escapeHtml(step.title)}</h4>
              <p>${highlightInsightText(step.text)}</p>
            </section>
          `).join('')}
        </div>
        <p class="mbp-advice-note">${highlightInsightText(advice.note)}</p>
      </div>
    `;
  }

  function curveClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function curveSafeNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function curveStarScore(star) {
    const name = typeof star === 'string' ? star : (star?.name || '');
    if (!name) return 0;
    const major = {
      紫微: 9, 天府: 8, 武曲: 6, 天相: 6, 太阳: 5, 太阴: 5, 天梁: 4, 天同: 3,
      天机: 3, 贪狼: 2, 廉贞: 1, 巨门: -4, 七杀: -3, 破军: -4,
      左辅: 5, 右弼: 5, 文昌: 5, 文曲: 5, 天魁: 6, 天钺: 6, 禄存: 7,
      擎羊: -8, 陀罗: -7, 火星: -7, 铃星: -7, 地空: -8, 地劫: -8,
      天刑: -5, 天哭: -5, 天虚: -5, 天姚: -3,
    };
    let score = major[name] || 0;
    const mutagen = star?.mutagen || '';
    if (mutagen === '化禄') score += 10;
    if (mutagen === '化权') score += 7;
    if (mutagen === '化科') score += 6;
    if (mutagen === '化忌') score -= 12;
    const brightness = star?.brightness || '';
    if (/庙|旺/.test(brightness)) score += 2;
    if (/陷|弱/.test(brightness)) score -= 3;
    return score;
  }

  function curvePalaceScore(palace) {
    if (!palace) return 0;
    const stars = allReadableStars(palace);
    if (!stars.length) return -2;
    const raw = stars.reduce((sum, star) => sum + curveStarScore(star), 0);
    return curveClamp(raw, -26, 26);
  }

  function curveGuaScore(liunian) {
    const name = String(liunian?.name || '');
    const good = ['泰', '大有', '晋', '升', '鼎', '益', '观', '需', '小畜', '家人', '中孚', '谦', '恒', '节', '临', '比', '既济'];
    const hard = ['否', '蹇', '坎', '困', '蛊', '剥', '噬嗑', '讼', '师', '夬', '未济', '遁', '旅', '涣'];
    let score = 0;
    if (good.some((item) => name.includes(item))) score += 5;
    if (hard.some((item) => name.includes(item))) score -= 6;
    if (liunian?.lineType === 'yang') score += 1;
    if (liunian?.lineType === 'yin') score -= 1;
    return score;
  }

  function curveScoreBand(score) {
    const value = curveSafeNumber(score, 50);
    if (value >= 78) return '高峰段';
    if (value >= 66) return '上升段';
    if (value >= 48) return '平稳段';
    if (value >= 36) return '调整段';
    return '低位段';
  }

  function curvePointTone(age, score) {
    const band = curveScoreBand(score);
    if (band === '高峰段') return '高点';
    if (band === '低位段') return '低点';
    if (age <= 24) return '起步';
    if (age <= 44) return '中段';
    if (age <= 64) return '转折';
    return '后势';
  }

  function buildLifeCurvePoint(chart, age, currentAge) {
    const info = xiaoLianInfoForAge(chart, age, currentAge);
    const decade = info.decade || decadeItemsForChart(chart, age).find((item) => age >= item.start && age <= item.end) || null;
    const domain = decade?.domain || palaceDomain(info.xiaoLianPalace?.name || '');
    const decadeScore = 55 + (curvePalaceScore(decade?.palace) * 0.62);
    const xiaoScore = curvePalaceScore(info.xiaoLianPalace) * 0.46;
    const oppositeScore = curvePalaceScore(info.oppositePalace) * 0.28;
    const guaScore = curveGuaScore(info.liunian);
    const ageWave = Math.sin(age / 4.8) * 2.8 + Math.cos(age / 8.5) * 2.2;
    const rawScore = curveClamp(Math.round(decadeScore + xiaoScore + oppositeScore + guaScore + ageWave), 12, 94);
    const xiaoName = normalizePalaceName(info.xiaoLianPalace?.name || info.xiaoLabel || '');
    const oppositeName = normalizePalaceName(info.oppositePalace?.name || info.oppositeLabel || '');
    return {
      age,
      year: info.year,
      score: rawScore,
      rawScore,
      domain,
      decadeRange: decade?.rangeLabel || '',
      decadePalace: decade?.palaceName || '',
      xiaoLianPalace: xiaoName,
      oppositePalace: oppositeName,
      liunianGuaName: info.liunian?.name || '',
      summary: `${curveScoreBand(rawScore)}，${domain}受${xiaoName || '小限'}牵动，对宫看${oppositeName || '外部应事'}。`,
    };
  }

  function smoothLifeCurveScores(points) {
    return points.map((point, index) => {
      const prev = points[index - 1] || point;
      const next = points[index + 1] || point;
      const score = curveClamp(Math.round((prev.rawScore * 0.18) + (point.rawScore * 0.64) + (next.rawScore * 0.18)), 10, 96);
      return {
        ...point,
        score,
        summary: `${curveScoreBand(score)}，${point.domain}受${point.xiaoLianPalace || '小限'}牵动，对宫看${point.oppositePalace || '外部应事'}。`,
      };
    });
  }

  function normalizeLifeCurveAmplitude(points) {
    if (!points.length) return [];
    const values = points.map((point) => point.score);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const targetMin = 28;
    const targetMax = 88;
    return points.map((point) => {
      const score = curveClamp(Math.round(targetMin + ((point.score - min) / span) * (targetMax - targetMin)), 18, 94);
      return {
        ...point,
        score,
        summary: `${curveScoreBand(score)}，${point.domain}受${point.xiaoLianPalace || '小限'}牵动，对宫看${point.oppositePalace || '外部应事'}。`,
      };
    });
  }

  function localCurveExtrema(points, type = 'peak') {
    const compare = type === 'peak'
      ? (point, prev, next) => point.score >= prev.score && point.score >= next.score
      : (point, prev, next) => point.score <= prev.score && point.score <= next.score;
    return points
      .filter((point, index) => index > 0 && index < points.length - 1 && compare(point, points[index - 1], points[index + 1]))
      .sort((a, b) => type === 'peak' ? b.score - a.score : a.score - b.score);
  }

  function clearLifeCurveData() {
    window._fcLifeCurveData = null;
    window._fcLifeCurveMode = '';
    window._fcLifeCurveCriticalYear = null;
  }

  function ensureLifeCurveData(options = {}) {
    const key = profileHistoryKey(state.profile);
    const existing = window._fcLifeCurveData;
    if (!options.force && existing?.profileKey === key && Array.isArray(existing.scores) && existing.scores.length) return existing;
    const bundle = getChartBundle();
    const chart = bundle.chart || state.chart || fcCurrentChart;
    if (!chart) return { profileKey: key, scores: [], decades: [], peakAges: [], valleyAges: [] };
    const ageState = fcAgeSupportState(xiaoLianMaxAge());
    const currentAge = ageState.displayAge;
    const maxAge = xiaoLianMaxAge();
    const rawPoints = Array.from({ length: maxAge }, (_, index) => buildLifeCurvePoint(chart, index + 1, currentAge));
    const scores = normalizeLifeCurveAmplitude(smoothLifeCurveScores(rawPoints));
    const peaks = localCurveExtrema(scores, 'peak').slice(0, 6);
    const valleys = localCurveExtrema(scores, 'valley').slice(0, 6);
    const current = scores.find((point) => point.age === currentAge) || scores[scores.length - 1] || scores[0] || null;
    const decades = decadeItemsForChart(chart, currentAge).map((item) => ({
      range: item.rangeLabel,
      start: item.start,
      end: item.end,
      palace: item.palaceName,
      branch: item.branch,
      domain: item.domain,
      summary: `${item.rangeLabel}走${item.palaceName}，主看${item.domain}。`,
    }));
    const data = {
      profileKey: key,
      mode: 'age_score_1_100',
      generatedAt: new Date().toISOString(),
      currentAge,
      realCurrentAge: ageState.realAge,
      supportedMaxAge: ageState.supportedMaxAge,
      isCurrentAgeOverflow: ageState.isOverflow,
      current,
      scores,
      decades,
      peakAges: peaks.map((point) => point.age),
      valleyAges: valleys.map((point) => point.age),
    };
    window._fcLifeCurveData = data;
    window._fcLifeCurveMode = data.mode;
    window._fcLifeCurveCriticalYear = null;
    return data;
  }

  function curveDataFromAi(data) {
    const card = normalizeAiData(data)?.card || {};
    const list = Array.isArray(card.scores)
      ? card.scores
      : (Array.isArray(card.lifeCurveData) ? card.lifeCurveData : (Array.isArray(card.curveScores) ? card.curveScores : []));
    const scores = list
      .map((item) => ({
        ...item,
        age: Math.floor(curveSafeNumber(item?.age, 0)),
        year: Math.floor(curveSafeNumber(item?.year, 0)) || fcAgeToYear(item?.age),
        score: curveClamp(Math.round(curveSafeNumber(item?.score ?? item?.finalScore, 50)), 0, 100),
        summary: cleanAiText(item?.summary || item?.reason || ''),
      }))
      .filter((item) => item.age >= 1 && item.age <= xiaoLianMaxAge());
    if (!scores.length) return null;
    scores.sort((a, b) => a.age - b.age);
    const supportedMaxAge = scores[scores.length - 1]?.age || xiaoLianMaxAge();
    const ageState = fcAgeSupportState(supportedMaxAge);
    const currentAge = ageState.displayAge;
    return {
      profileKey: profileHistoryKey(state.profile),
      mode: 'backend_scores',
      currentAge,
      realCurrentAge: ageState.realAge,
      supportedMaxAge: ageState.supportedMaxAge,
      isCurrentAgeOverflow: ageState.isOverflow,
      current: scores.find((point) => point.age === currentAge) || scores[scores.length - 1] || null,
      scores,
      peakAges: localCurveExtrema(scores, 'peak').slice(0, 6).map((point) => point.age),
      valleyAges: localCurveExtrema(scores, 'valley').slice(0, 6).map((point) => point.age),
    };
  }

  function curveDataForRender(data) {
    const fromAi = curveDataFromAi(data);
    if (fromAi?.scores?.length) return fromAi;
    return ensureLifeCurveData();
  }

  function mapCurvePoints(scores, width = 760, height = 250) {
    const left = 46;
    const right = 24;
    const top = 24;
    const bottom = 34;
    const minAge = scores[0]?.age || 1;
    const maxAge = scores[scores.length - 1]?.age || xiaoLianMaxAge();
    const span = Math.max(1, maxAge - minAge);
    return scores.map((point) => ({
      ...point,
      x: left + ((point.age - minAge) / span) * (width - left - right),
      y: top + ((100 - point.score) / 100) * (height - top - bottom),
    }));
  }

  function smoothSvgPath(mapped) {
    if (!mapped.length) return '';
    if (mapped.length === 1) return `M ${mapped[0].x.toFixed(1)} ${mapped[0].y.toFixed(1)}`;
    const parts = [`M ${mapped[0].x.toFixed(1)} ${mapped[0].y.toFixed(1)}`];
    for (let index = 1; index < mapped.length - 1; index += 1) {
      const midX = (mapped[index].x + mapped[index + 1].x) / 2;
      const midY = (mapped[index].y + mapped[index + 1].y) / 2;
      parts.push(`Q ${mapped[index].x.toFixed(1)} ${mapped[index].y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`);
    }
    const last = mapped[mapped.length - 1];
    parts.push(`T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`);
    return parts.join(' ');
  }

  function curveRenderMarkers(curve, mapped) {
    const byAge = new Map(mapped.map((point) => [point.age, point]));
    const currentAge = curve.currentAge || fcCurrentVirtualAge();
    const focusEndAge = Math.min(84, currentAge + 40);
    const future = mapped.filter((point) => point.age >= currentAge && point.age <= focusEndAge);
    const allFuture = mapped.filter((point) => point.age >= currentAge);
    const past = mapped.filter((point) => point.age <= currentAge);
    const candidates = [
      { point: byAge.get(currentAge), label: curve?.isCurrentAgeOverflow ? '末段参考' : '当前', type: 'current' },
      { point: [...future].sort((a, b) => b.score - a.score)[0] || [...allFuture].sort((a, b) => b.score - a.score)[0] || [...mapped].sort((a, b) => b.score - a.score)[0], label: '高点', type: 'peak' },
      { point: [...future].sort((a, b) => a.score - b.score)[0] || [...allFuture].sort((a, b) => a.score - b.score)[0] || [...mapped].sort((a, b) => a.score - b.score)[0], label: '低点', type: 'valley' },
      { point: [...past].sort((a, b) => b.score - a.score)[0], label: '已验高点', type: 'peak' },
      { point: [...past].sort((a, b) => a.score - b.score)[0], label: '已验低点', type: 'valley' },
    ];
    const seen = new Set();
    return candidates
      .filter((item) => item.point && !seen.has(item.point.age) && seen.add(item.point.age))
      .slice(0, 5);
  }

  function renderLifeCurveSvg(curve) {
    const scores = curve?.scores || [];
    if (!scores.length) return '';
    const width = 760;
    const height = 250;
    const bottomY = 216;
    const mapped = mapCurvePoints(scores, width, height);
    const path = smoothSvgPath(mapped);
    const first = mapped[0];
    const last = mapped[mapped.length - 1];
    const areaPath = `${path} L ${last.x.toFixed(1)} ${bottomY} L ${first.x.toFixed(1)} ${bottomY} Z`;
    const markers = curveRenderMarkers(curve, mapped);
    const tickAges = [1, 20, 40, 60, 80, 100].filter((age) => age >= scores[0].age && age <= scores[scores.length - 1].age);
    const scoreLines = [80, 60, 40, 20];
    return `
      <div class="mbp-curve-chart" aria-label="人生曲线">
        <svg viewBox="0 0 ${width} ${height}" role="img">
          ${scoreLines.map((score) => {
            const y = 24 + ((100 - score) / 100) * (height - 24 - 34);
            return `<line x1="46" y1="${y.toFixed(1)}" x2="736" y2="${y.toFixed(1)}"></line><text class="mbp-curve-axis" x="12" y="${(y + 4).toFixed(1)}">${score}</text>`;
          }).join('')}
          ${tickAges.map((age) => {
            const x = 46 + ((age - scores[0].age) / Math.max(1, scores[scores.length - 1].age - scores[0].age)) * (width - 46 - 24);
            return `<text class="mbp-curve-axis" x="${x.toFixed(1)}" y="238" text-anchor="middle">${age}岁</text>`;
          }).join('')}
          <path class="mbp-curve-fill" d="${areaPath}"></path>
          <path class="mbp-curve-line" d="${path}"></path>
          ${markers.map(({ point, label, type }) => {
            const anchor = point.x > 660 ? 'end' : (point.x < 90 ? 'start' : 'middle');
            const labelY = Math.max(16, point.y - 14);
            return `
              <circle class="mbp-curve-marker ${type === 'valley' ? 'is-warn' : ''} ${type === 'current' ? 'is-current' : ''}" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${type === 'current' ? 8 : 6}"></circle>
              <text class="mbp-curve-label" x="${point.x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}">${point.age}岁</text>
              <text class="mbp-curve-note" x="${point.x.toFixed(1)}" y="${(labelY + 16).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(label)} ${point.score}分</text>
            `;
          }).join('')}
        </svg>
      </div>
    `;
  }

  function renderCurveCards(curve) {
    const points = curve?.scores || [];
    if (!points.length) return '';
    const currentAge = curve.currentAge || fcCurrentVirtualAge();
    const current = points.find((point) => point.age === currentAge) || points[0];
    const focusEndAge = Math.min(84, currentAge + 40);
    const future = points.filter((point) => point.age >= currentAge && point.age <= focusEndAge);
    const allFuture = points.filter((point) => point.age >= currentAge);
    const futureSource = future.length ? future : (allFuture.length ? allFuture : points);
    const high = [...futureSource].sort((a, b) => b.score - a.score)[0];
    const low = [...futureSource].sort((a, b) => a.score - b.score)[0];
    const rows = [
      { title: curve?.isCurrentAgeOverflow ? '参考末段' : '当前', point: current },
      { title: '低点', point: low },
      { title: '高点', point: high },
    ];
    return `
      <div class="mbp-curve-cards">
        ${rows.map(({ title, point }) => `
          <section>
            <strong>${escapeHtml(title)}</strong>
            <p><b>${point.age}岁 · ${point.score}分</b>${escapeHtml(point.summary || `${curveScoreBand(point.score)}，重点看${point.domain || '命盘主线'}。`)}</p>
          </section>
        `).join('')}
      </div>
    `;
  }

  function isCurvePastSection(section) {
    return /过去验证|先验过去|过往节点/.test(cleanAiInlineText(section?.title || ''));
  }

  function renderCurveAiSections(data, fallbackText, options = {}) {
    const allSections = hasAiRenderableContent(data) ? aiSections(data) : [];
    const sections = options.onlyPast
      ? allSections.filter(isCurvePastSection)
      : allSections.filter((section) => !isCurvePastSection(section));
    if (!sections.length) {
      return options.emptyHtml ?? `<p class="mbp-luck-placeholder">${escapeHtml(fallbackText || '点击“生成曲线”后，后台提示词会结合这条曲线生成说明。')}</p>`;
    }
    const limit = options.limit || (options.onlyPast ? 1 : 4);
    return `
      <div class="mbp-curve-ai-sections${options.onlyPast ? ' is-past' : ''}">
        ${sections.slice(0, limit).map((section) => `
          <section>
            ${section.title ? `<b>${escapeHtml(cleanAiInlineText(section.title))}</b>` : ''}
            <p>${highlightInsightText(cleanAiText(section.content))}</p>
          </section>
        `).join('')}
      </div>
    `;
  }

  function renderCurveChapterBlock(data, fallbackText) {
    const curve = curveDataForRender(data);
    const points = curve?.scores || [];
    if (!points.length) return renderPendingChapterBlock(fallbackText || '点击“生成曲线”后生成。');
    const current = curve.current || points.find((point) => point.age === (curve.currentAge || fcCurrentVirtualAge())) || points[0];
    const focusEndAge = Math.min(84, current.age + 40);
    const future = points.filter((point) => point.age >= current.age && point.age <= focusEndAge);
    const allFuture = points.filter((point) => point.age >= current.age);
    const futureSource = future.length ? future : (allFuture.length ? allFuture : points);
    const nextPeak = [...futureSource].sort((a, b) => b.score - a.score)[0] || current;
    const nextValley = [...futureSource].sort((a, b) => a.score - b.score)[0] || current;
    const pastItems = curvePastValidationItems(curve);
    return `
      <div class="mbp-curve-panel" data-curve-panel>
        <div class="mbp-curve-switch" role="tablist" aria-label="人生曲线视图">
          <button class="is-active" type="button" role="tab" aria-selected="true" data-curve-view="future">曲线走势</button>
          <button type="button" role="tab" aria-selected="false" data-curve-view="past">过去验证</button>
        </div>
        <div class="mbp-curve-view is-active" data-curve-pane="future">
          <div class="mbp-curve-summary">
            <div>
              <strong>${escapeHtml(curve.isCurrentAgeOverflow
                ? `当前${curve.realCurrentAge}岁，曲线仅展示至${curve.supportedMaxAge}岁，末段参考落在${current.age}岁。`
                : `${current.age}岁在${curveScoreBand(current.score)}，后面高点看${nextPeak.age}岁，低点看${nextValley.age}岁。`)}</strong>
              <p>${escapeHtml(curve.isCurrentAgeOverflow
                ? currentAgeOverflowNote('人生曲线', curve.realCurrentAge, curve.supportedMaxAge)
                : '曲线按命盘大限底色、小限落宫、对宫应事和流年卦逐岁评分；后台提示词负责把曲线翻成命书说明。')}</p>
            </div>
            <em>${escapeHtml(curve.isCurrentAgeOverflow ? `当前${curve.realCurrentAge}岁 · 仅展示至${curve.supportedMaxAge}岁` : '1-100岁逐岁评分')}</em>
          </div>
          ${renderLifeCurveSvg(curve)}
          ${renderCurveCards(curve)}
          ${renderCurveAiSections(data, fallbackText)}
        </div>
        <div class="mbp-curve-view" data-curve-pane="past">
          <div class="mbp-curve-verify-head">
            <span>先验过去</span>
            <strong>先看过往节点是否对得上，再看未来走势。</strong>
            <p>这些节点来自同一条逐岁评分曲线，不是固定模板。</p>
          </div>
          ${renderCurveAiSections(data, '', { onlyPast: true, emptyHtml: '' })}
          <div class="mbp-curve-verify-grid">
            ${pastItems.map((item) => `
              <section class="mbp-curve-verify-card" data-curve-verify-card>
                <div class="mbp-curve-verify-top">
                  <b>${escapeHtml(item.ageLabel)}</b>
                  <span>${escapeHtml(item.yearLabel)}</span>
                </div>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.body)}</p>
                <small>${escapeHtml(item.evidence)}</small>
                <div class="mbp-curve-feedback" aria-label="过往验证反馈">
                  <button type="button" data-curve-feedback="hit">对得上</button>
                  <button type="button" data-curve-feedback="weak">不明显</button>
                  <button type="button" data-curve-feedback="unknown">记不清</button>
                </div>
              </section>
            `).join('')}
          </div>
          <p class="mbp-curve-verify-result" data-curve-verify-result>先点几个过往节点，系统会给出这条曲线的参考可信度。</p>
        </div>
      </div>
    `;
  }

  function curvePastValidationItems(curve = ensureLifeCurveData()) {
    const points = (curve?.scores || []).filter((point) => point.age <= (curve.currentAge || fcCurrentVirtualAge()));
    const source = points.length ? points : (curve?.scores || []);
    if (!source.length) return [];
    const extrema = [
      ...localCurveExtrema(source, 'peak').slice(0, 3),
      ...localCurveExtrema(source, 'valley').slice(0, 3),
      source[source.length - 1],
    ]
      .filter(Boolean)
      .sort((a, b) => a.age - b.age);
    const seen = new Set();
    const picked = extrema.filter((point) => !seen.has(point.age) && seen.add(point.age)).slice(-4);
    return picked.map((point) => {
      const event = curvePastValidationEvent(point);
      return {
        ageLabel: `${point.age}岁`,
        yearLabel: `${point.year || fcAgeToYear(point.age)}年`,
        title: `${event.title} · ${curveScoreBand(point.score)} · ${point.score}分`,
        body: event.recall,
        evidence: `${point.xiaoLianPalace || '小限落点'}落点，对宫看${point.oppositePalace || '对宫应事'}；流年卦：${point.liunianGuaName || '未显'}。`,
      };
    });
  }

  function curvePastValidationEvent(point) {
    const names = [point.decadePalace, point.xiaoLianPalace, point.oppositePalace].map((name) => normalizePalaceName(name || ''));
    const score = curveSafeNumber(point.score, 50);
    const good = score >= 66;
    const hard = score <= 44;
    const has = (...targets) => names.some((name) => targets.includes(name));
    if (has('夫妻', '福德')) {
      return good
        ? { title: '婚缘成局年', recall: '可回想：这一年是否确定关系、结婚、同居、订婚、关系公开，或关系正式稳定。' }
        : { title: hard ? '关系承压年' : '关系定调年', recall: hard ? '可回想：这一年是否冷战、分开、异地，或关系压力明显加重。' : '可回想：这一年关系是否进入更明确的阶段，态度、名分或相处模式是否定下来。' };
    }
    if (has('财帛', '田宅')) {
      return good
        ? { title: '财运起势年', recall: '可回想：这一年是否收入上升、项目进账、置业、扩店，或开始掌握更大资源。' }
        : { title: hard ? '财路承压年' : '钱财调整年', recall: hard ? '可回想：这一年是否破财、投资失手、收入下滑，或资金周转明显卡住。' : '可回想：这一年钱财、房产或资源安排是否有调整。' };
    }
    if (has('官禄', '迁移', '命')) {
      return good
        ? { title: '事业抬头年', recall: '可回想：这一年是否升职、换平台、创业启动、考试证照顺利，或开始掌权带团队。' }
        : { title: hard ? '事业受阻年' : '事业换挡年', recall: hard ? '可回想：这一年是否岗位变动、项目停摆、上级压力，或工作推进明显受卡。' : '可回想：这一年事业方向、工作地点或角色责任是否有明显变化。' };
    }
    if (has('疾厄') || (has('福德', '命') && hard)) {
      return {
        title: hard ? '身心耗损年' : '状态调整年',
        recall: hard ? '可回想：这一年是否病痛、旧疾反复、过劳，或睡眠情绪明显下滑。' : '可回想：这一年身体状态、作息或心理压力是否需要重新调整。',
      };
    }
    return good
      ? { title: '走运抬头年', recall: '可回想：这一年是否机会变多、贵人出现、状态转顺，或某件重要事情开始成形。' }
      : { title: hard ? '运势收缩年' : '阶段调整年', recall: hard ? '可回想：这一年是否压力变大、计划停顿、人事反复，或明显感觉不易展开。' : '可回想：这一年生活节奏、方向选择或重要关系是否出现调整。' };
  }

  function switchCurveView(button) {
    const panel = button.closest('[data-curve-panel]');
    if (!panel) return;
    const view = button.dataset.curveView || 'past';
    panel.querySelectorAll('[data-curve-view]').forEach((item) => {
      const active = item.dataset.curveView === view;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panel.querySelectorAll('[data-curve-pane]').forEach((pane) => {
      pane.classList.toggle('is-active', pane.dataset.curvePane === view);
    });
  }

  function updateCurveVerificationSummary(panel) {
    const result = panel.querySelector('[data-curve-verify-result]');
    if (!result) return;
    const counts = { hit: 0, weak: 0, unknown: 0 };
    panel.querySelectorAll('[data-curve-verify-card]').forEach((card) => {
      const value = card.dataset.curveResult;
      if (counts[value] !== undefined) counts[value] += 1;
    });
    const checked = counts.hit + counts.weak + counts.unknown;
    result.dataset.tone = '';
    if (!checked) {
      result.textContent = '先点几个过往节点，系统会给出这条曲线的参考可信度。';
      return;
    }
    if (counts.hit >= 2) {
      result.dataset.tone = 'strong';
      result.textContent = `已有 ${counts.hit} 个过往节点对得上，这条人生曲线可以作为后续趋势参考。`;
      return;
    }
    if (counts.weak > counts.hit) {
      result.dataset.tone = 'caution';
      result.textContent = '过往节点不够明显，建议回到宫位和应事领域再校正，不急着看未来。';
      return;
    }
    result.textContent = '已有节点可参考，继续多核对几项，判断会更稳。';
  }

  function applyCurveFeedback(button) {
    const card = button.closest('[data-curve-verify-card]');
    const panel = button.closest('[data-curve-panel]');
    if (!card || !panel) return;
    card.dataset.curveResult = button.dataset.curveFeedback || '';
    card.querySelectorAll('[data-curve-feedback]').forEach((item) => {
      item.classList.toggle('is-active', item === button);
    });
    updateCurveVerificationSummary(panel);
  }

  function handleCurvePanelClick(event) {
    const viewButton = event.target.closest('[data-curve-view]');
    if (viewButton) {
      switchCurveView(viewButton);
      return true;
    }
    const feedbackButton = event.target.closest('[data-curve-feedback]');
    if (feedbackButton) {
      applyCurveFeedback(feedbackButton);
      return true;
    }
    return false;
  }

  function rangeFromDecadal(palace) {
    const range = palace?.decadal?.range;
    if (Array.isArray(range) && range.length >= 2) return [Number(range[0]), Number(range[1])];
    const match = String(range || '').match(/(\d+)/g);
    return match && match.length >= 2 ? [Number(match[0]), Number(match[1])] : null;
  }

  function shouldDisplayDecadeRange(range) {
    const start = Number(range?.[0]);
    return Number.isFinite(start) && start <= decadeDisplayMaxStartAge;
  }

  function visibleDecadeMaxAge(chart) {
    const ages = (chart?.palaces || [])
      .map((palace) => rangeFromDecadal(palace))
      .filter((range) => shouldDisplayDecadeRange(range))
      .map((range) => Number(range?.[1]))
      .filter((age) => Number.isFinite(age) && age >= 1);
    return ages.length ? Math.max(...ages) : fcMaxAge();
  }

  function findDecadePalace(chart, age) {
    return (chart?.palaces || []).find((palace) => {
      const range = rangeFromDecadal(palace);
      return range && age >= range[0] && age <= range[1];
    }) || null;
  }

  function decadeRangeKey(item) {
    if (!item) return '';
    return `${item.start}-${item.end}-${item.branch || item.palaceName || ''}`;
  }

  function decadeItemsForChart(chart, currentAge = fcCurrentVirtualAge()) {
    return (chart?.palaces || [])
      .map((palace, index) => {
        const range = rangeFromDecadal(palace);
        if (!range) return null;
        const [start, end] = range;
        if (!shouldDisplayDecadeRange(range)) return null;
        const palaceName = normalizePalaceName(palace?.name || '大限宫');
        const branch = palace?.earthlyBranch || '';
        const stars = palaceMainLabel(palace);
        const domain = palaceDomain(palaceName);
        const item = {
          index,
          palace,
          start,
          end,
          range,
          rangeLabel: `${start}-${end}岁`,
          palaceName,
          branch,
          stars,
          domain,
          theme: decadeTheme(domain),
          isCurrent: Number.isFinite(currentAge) && currentAge >= start && currentAge <= end,
        };
        item.key = decadeRangeKey(item);
        return item;
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);
  }

  function selectedLuckInfo(options = {}) {
    const bundle = getChartBundle();
    const chart = bundle.chart || state.chart;
    const ageState = fcAgeSupportState(visibleDecadeMaxAge(chart));
    const items = decadeItemsForChart(chart, ageState.isOverflow ? null : ageState.realAge);
    const underflowCurrent = !ageState.isOverflow && items.length && ageState.realAge < items[0].start;
    const current = ageState.isOverflow
      ? null
      : (items.find((item) => item.isCurrent) || (underflowCurrent ? items[0] : null));
    const fallback = ageState.isOverflow
      ? (items[items.length - 1] || items[0] || null)
      : (items[0] || items[items.length - 1] || null);
    const selectedKey = options.forceCurrent ? (current?.key || fallback?.key) : (state.selectedLuckRangeKey || current?.key || fallback?.key);
    const selected = items.find((item) => item.key === selectedKey) || current || fallback || null;
    if (selected && !options.readonly && (!state.selectedLuckRangeKey || options.forceCurrent || !items.some((item) => item.key === state.selectedLuckRangeKey))) {
      state.selectedLuckRangeKey = selected.key;
    }
    return {
      chart,
      items,
      current,
      selected,
      currentAge: ageState.displayAge,
      realCurrentAge: ageState.realAge,
      supportedMaxAge: ageState.supportedMaxAge,
      isOverflowCurrentAge: ageState.isOverflow,
    };
  }

  function decadePayload(item) {
    if (!item) return {};
    const palace = item.palace || {};
    const majorStars = (palace.majorStars || []).map((star) => ({
      name: star.name || '',
      brightness: star.brightness || '',
      mutagen: star.mutagen || null,
    }));
    return {
      rangeKey: item.key,
      rangeLabel: item.rangeLabel,
      ageStart: item.start,
      ageEnd: item.end,
      palaceName: item.palaceName,
      palaceBranch: item.branch,
      palaceStem: palace?.decadal?.heavenlyStem || '',
      domain: item.domain,
      theme: item.theme,
      majorStars,
      minorStars: (palace.minorStars || []).map((star) => star.name || star).filter(Boolean),
      helperStars: allSmallStars(palace).map((star) => star.name || star).filter(Boolean),
    };
  }

  function currentLuckExtraParams(options = {}) {
    const info = selectedLuckInfo({ forceCurrent: options.forceCurrentLuck });
    const selectedDayun = decadePayload(info.selected);
    return {
      activeAge: info.realCurrentAge,
      currentAge: info.realCurrentAge,
      viewedAge: info.selected?.end || info.currentAge,
      selectedDayun,
      decadeData: selectedDayun,
      realCurrentAge: info.realCurrentAge,
      supportedMaxAge: info.supportedMaxAge,
      isCurrentAgeOverflow: info.isOverflowCurrentAge,
      currentAgeNotice: info.isOverflowCurrentAge ? currentAgeOverflowNote('十年大限', info.realCurrentAge, info.supportedMaxAge) : '',
    };
  }

  function palacePayload(palace) {
    if (!palace) return {};
    return {
      name: normalizePalaceName(palace.name || ''),
      branch: palace.earthlyBranch || '',
      heavenlyStem: palace.heavenlyStem || '',
      majorStars: (palace.majorStars || []).map((star) => ({
        name: star.name || '',
        brightness: star.brightness || '',
        mutagen: star.mutagen || null,
      })),
      minorStars: (palace.minorStars || []).map((star) => star.name || star).filter(Boolean),
      helperStars: allSmallStars(palace).map((star) => star.name || star).filter(Boolean),
    };
  }

  function xiaoLianAgeKey(age) {
    return String(clampXiaoLianAge(age));
  }

  function xiaoLianInfoForAge(chart, age, currentAge = fcCurrentVirtualAge()) {
    const safeAge = clampXiaoLianAge(age);
    const liunian = fcLiunianSeq?.[safeAge] || {};
    const year = xiaoLianAgeToYear(safeAge) || new Date().getFullYear();
    const yearGz = liunian.yearGanzhi ? `${liunian.yearGanzhi.stem || ''}${liunian.yearGanzhi.branch || ''}` : ganzhiYear(year);
    const xiaoLianBranch = fcResolveXiaoLianBranch(safeAge);
    const xiaoLianPalace = fcPalaceByBranch(chart, xiaoLianBranch);
    const oppositeBranch = fcOppositeBranch(xiaoLianBranch);
    const oppositePalace = fcPalaceByBranch(chart, oppositeBranch);
    const xiaoLabel = palaceViewLabel(xiaoLianPalace, xiaoLianBranch);
    const oppositeLabel = palaceViewLabel(oppositePalace, oppositeBranch);
    const decadeItems = decadeItemsForChart(chart, safeAge);
    const decade = decadeItems.find((item) => safeAge >= item.start && safeAge <= item.end) || null;
    return {
      key: xiaoLianAgeKey(safeAge),
      age: safeAge,
      year,
      yearGz,
      liunian,
      xiaoLianBranch,
      xiaoLianPalace,
      oppositeBranch,
      oppositePalace,
      xiaoLabel,
      oppositeLabel,
      decade,
      isCurrent: Number.isFinite(currentAge) && safeAge === currentAge,
    };
  }

  function xiaoLianAgeItems(chart, currentAge = fcCurrentVirtualAge()) {
    return Array.from({ length: xiaoLianMaxAge() }, (_, index) => xiaoLianInfoForAge(chart, index + 1, currentAge));
  }

  function selectedXiaoLianInfo(options = {}) {
    const bundle = getChartBundle();
    const chart = bundle.chart || state.chart;
    const ageState = fcAgeSupportState(xiaoLianMaxAge());
    const items = xiaoLianAgeItems(chart, ageState.isOverflow ? null : ageState.realAge);
    const current = ageState.isOverflow ? null : (items.find((item) => item.age === ageState.realAge) || null);
    const fallback = items[items.length - 1] || items[0] || null;
    const defaultSelectedAge = options.forceCurrentXiaoLian
      ? (current?.age || fallback?.age || 1)
      : clampXiaoLianAge(state.selectedXiaoLianAge || current?.age || fallback?.age || 1);
    const selected = items.find((item) => item.age === defaultSelectedAge) || current || fallback || null;
    if (selected && !options.readonly && (!state.selectedXiaoLianAge || options.forceCurrentXiaoLian || !items.some((item) => item.age === Number(state.selectedXiaoLianAge)))) {
      state.selectedXiaoLianAge = selected.age;
    }
    return {
      chart,
      items,
      current,
      selected,
      currentAge: ageState.displayAge,
      realCurrentAge: ageState.realAge,
      supportedMaxAge: ageState.supportedMaxAge,
      isOverflowCurrentAge: ageState.isOverflow,
      selectedDecade: selected?.decade || null,
      currentDecade: current?.decade || null,
    };
  }

  function xiaoLianExtraParams(options = {}) {
    const info = selectedXiaoLianInfo({ forceCurrentXiaoLian: options.forceCurrentXiaoLian, readonly: true });
    const selected = info.selected || {};
    const selectedDayun = decadePayload(info.selectedDecade || info.currentDecade);
    const selectedYear = {
      age: selected.age,
      solarYear: selected.year,
      yearGanzhi: selected.yearGz,
      xiaolianBranch: selected.xiaoLianBranch || '',
      xiaolianPalaceName: normalizePalaceName(selected.xiaoLianPalace?.name || ''),
      xiaolianPalace: palacePayload(selected.xiaoLianPalace),
      oppositeBranch: selected.oppositeBranch || '',
      oppositePalaceName: normalizePalaceName(selected.oppositePalace?.name || ''),
      oppositePalace: palacePayload(selected.oppositePalace),
      liunianGuaName: selected.liunian?.name || '',
      liunianGuaPeriod: selected.liunian?.period || '',
      lineNum: selected.liunian?.lineNum || '',
      lineType: selected.liunian?.lineType || '',
      tianjiLineNum: selected.liunian?.lineNum || '',
      tianjiLineType: selected.liunian?.lineType || '',
    };
    return {
      activeAge: info.realCurrentAge,
      currentAge: info.realCurrentAge,
      viewedAge: selected.age,
      referenceAge: selected.age,
      selectedDayun,
      decadeData: selectedDayun,
      selectedYear,
      liunianData: selectedYear,
      realCurrentAge: info.realCurrentAge,
      supportedMaxAge: info.supportedMaxAge,
      isCurrentAgeOverflow: info.isOverflowCurrentAge,
      currentAgeNotice: info.isOverflowCurrentAge ? currentAgeOverflowNote('小流年', info.realCurrentAge, info.supportedMaxAge) : '',
    };
  }

  function luckDataForSelected(info = selectedLuckInfo({ readonly: true })) {
    if (!info.selected) return null;
    return normalizeAiData(state.luckAiResults[info.selected.key] || (info.selected.key === info.current?.key ? state.aiResults.current_luck : null));
  }

  function xiaoLianDataForSelected(info = selectedXiaoLianInfo({ readonly: true })) {
    if (!info.selected) return null;
    return normalizeAiData(state.xiaoLianAiResults[info.selected.key] || (info.selected.isCurrent ? state.aiResults.xiaoxian_liunian : null));
  }

  function hasAnyLuckResult() {
    return hasAiRenderableContent(state.aiResults.current_luck) || Object.values(state.luckAiResults || {}).some(hasAiRenderableContent);
  }

  function hasAnyXiaoLianResult() {
    return hasAiRenderableContent(state.aiResults.xiaoxian_liunian) || Object.values(state.xiaoLianAiResults || {}).some(hasAiRenderableContent);
  }

  function refreshReportSelectionViews() {
    if (hasAnyLuckResult() || hasAnyXiaoLianResult() || state.curveGenerated || state.adviceGenerated) {
      renderChaptersFromAi();
    }
  }

  function moduleHasRenderable(moduleKey) {
    if (moduleKey === 'current_luck') return hasAnyLuckResult();
    if (moduleKey === 'xiaoxian_liunian') return hasAnyXiaoLianResult();
    return hasAiRenderableContent(state.aiResults[moduleKey]);
  }

  function storeAiResult(moduleKey, data, options = {}) {
    if (moduleKey === 'xiaoxian_liunian') {
      const info = selectedXiaoLianInfo({ forceCurrentXiaoLian: options.forceCurrentXiaoLian });
      if (!info.selected) {
        state.aiResults.xiaoxian_liunian = data;
        return true;
      }
      state.xiaoLianAiResults[info.selected.key] = data;
      if (info.selected.isCurrent) state.aiResults.xiaoxian_liunian = data;
      return hasAnyXiaoLianResult();
    }
    if (moduleKey !== 'current_luck') {
      state.aiResults[moduleKey] = data;
      return true;
    }
    const info = selectedLuckInfo({ forceCurrent: options.forceCurrentLuck });
    if (!info.selected) {
      state.aiResults.current_luck = data;
      return true;
    }
    state.luckAiResults[info.selected.key] = data;
    const isCurrent = info.selected.key === info.current?.key;
    if (isCurrent) state.aiResults.current_luck = data;
    return hasAnyLuckResult();
  }

  function ganzhiYear(year) {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const index = ((Number(year) - 1984) % 60 + 60) % 60;
    return `${stems[index % 10]}${branches[index % 12]}`;
  }

  function palaceDomain(name = '') {
    const value = normalizePalaceName(name);
    if (value.includes('官禄')) return '事业与职位';
    if (value.includes('财帛')) return '财运与现金流';
    if (value.includes('田宅')) return '家庭、房产与根基';
    if (value.includes('夫妻')) return '伴侣与合作关系';
    if (value.includes('疾厄')) return '健康与消耗';
    if (value.includes('迁移')) return '外部机会与出行';
    if (value.includes('交友') || value.includes('仆役')) return '人脉与合作';
    if (value.includes('福德')) return '心态、休息与长期福分';
    if (value.includes('父母')) return '长辈、文书与规则';
    if (value.includes('子女')) return '子女、作品与延伸成果';
    if (value.includes('兄弟')) return '同辈、团队与资源分配';
    return '命盘主线与个人节奏';
  }

  function decadeTheme(domain = '') {
    if (domain.includes('家庭') || domain.includes('房产')) return '稳住根基';
    if (domain.includes('事业')) return '定住方向';
    if (domain.includes('财')) return '稳住现金流';
    if (domain.includes('伴侣') || domain.includes('合作')) return '稳住关系';
    if (domain.includes('健康')) return '护住消耗';
    if (domain.includes('外部')) return '有序外拓';
    return '稳住主轴';
  }

  function sectionTextByKeywords(sections, keywords = [], max = 58) {
    const section = sections.find((item) => keywords.some((keyword) => normalizeText(item.title).includes(keyword) || normalizeText(item.content).includes(keyword)));
    return section ? trimText(section.content || section.title, max) : '';
  }

  function luckSectionText(sections, sentences, used, titleKeywords = [], textKeywords = [], fallback = '', max = 150) {
    const titled = sections.find((item) => titleKeywords.some((keyword) => normalizeText(item.title).includes(keyword)));
    if (titled) return trimText(titled.content || titled.title, max);
    const found = sentences.find((sentence) => !used.has(sentence) && textKeywords.some((keyword) => sentence.includes(keyword)));
    const picked = found || sentences.find((sentence) => !used.has(sentence)) || '';
    if (picked) used.add(picked);
    return trimText(picked || fallback, max);
  }

  function renderLuckSummaryParts(parts) {
    return `
      <div class="mbp-luck-summary">
        ${parts.map((part) => `
          <section>
            <b>${escapeHtml(part.title)}</b>
            <p>${highlightInsightText(part.text)}</p>
          </section>
        `).join('')}
      </div>
    `;
  }

  function palaceViewLabel(palace, branch = '') {
    const name = normalizePalaceName(palace?.name || '');
    if (name && branch) return `${name} · ${branch}`;
    if (name) return name;
    return branch ? `${branch}宫` : '未定';
  }

  function palaceStarBrief(palace) {
    const majors = majorNames(palace).slice(0, 3);
    if (majors.length) return majors.join('、');
    const helpers = allSmallStars(palace).map((star) => star.name || star).filter(Boolean).slice(0, 2);
    return helpers.length ? `辅星：${helpers.join('、')}` : '空宫';
  }

  function formatGuaLine(lineType, lineNum) {
    const numberMap = ['', '初', '二', '三', '四', '五', '上'];
    const typeMap = { yang: '阳', yin: '阴' };
    const num = Number(lineNum);
    const label = Number.isFinite(num) ? (numberMap[num] || `${num}`) : '';
    const type = typeMap[String(lineType || '').toLowerCase()] || lineType || '';
    return label ? `${label}爻${type ? ` · ${type}` : ''}` : '当年应期';
  }

  function currentLuckViewInfo() {
    const luckInfo = selectedLuckInfo();
    const chart = luckInfo.chart;
    const year = new Date().getFullYear();
    const currentAge = luckInfo.currentAge;
    const decadePalace = luckInfo.selected?.palace || findDecadePalace(chart, currentAge);
    const decadeRange = luckInfo.selected?.range || rangeFromDecadal(decadePalace) || [Math.max(1, currentAge - 4), currentAge + 5];
    const palaceName = luckInfo.selected?.palaceName || decadePalace?.name || '大限宫';
    const stars = luckInfo.selected?.stars || palaceMainLabel(decadePalace);
    const domain = luckInfo.selected?.domain || palaceDomain(palaceName);
    const theme = luckInfo.selected?.theme || decadeTheme(domain);
    const liunian = fcLiunianSeq?.[currentAge] || {};
    const yearGz = liunian.yearGanzhi ? `${liunian.yearGanzhi.stem || ''}${liunian.yearGanzhi.branch || ''}` : ganzhiYear(year);
    const xiaoLianBranch = fcResolveXiaoLianBranch(currentAge);
    const xiaoLianPalace = fcPalaceByBranch(chart, xiaoLianBranch);
    const oppositeBranch = fcOppositeBranch(xiaoLianBranch);
    const oppositePalace = fcPalaceByBranch(chart, oppositeBranch);
    const xiaoLabel = palaceViewLabel(xiaoLianPalace, xiaoLianBranch);
    const oppositeLabel = palaceViewLabel(oppositePalace, oppositeBranch);
    const yearFocus = oppositePalace?.name
      ? `小限${normalizePalaceName(xiaoLianPalace?.name || `${xiaoLianBranch}宫`)} · 对宫${normalizePalaceName(oppositePalace.name)}`
      : (xiaoLianPalace?.name ? `${xiaoLianPalace.name} · ${palaceDomain(xiaoLianPalace.name)}` : domain);
    return {
      chart,
      year,
      currentAge,
      decadePalace,
      decadeRange,
      palaceName,
      stars,
      domain,
      theme,
      liunian,
      yearGz,
      xiaoLianBranch,
      xiaoLianPalace,
      oppositeBranch,
      oppositePalace,
      xiaoLabel,
      oppositeLabel,
      yearFocus,
      decadeItems: luckInfo.items,
      currentDecade: luckInfo.current,
      selectedDecade: luckInfo.selected,
      realCurrentAge: luckInfo.realCurrentAge,
      supportedMaxAge: luckInfo.supportedMaxAge,
      isOverflowCurrentAge: luckInfo.isOverflowCurrentAge,
    };
  }

  function renderXiaoLianYearBlock(info) {
    const lineText = info.liunian.lineNum
      ? formatGuaLine(info.liunian.lineType, info.liunian.lineNum)
      : (info.liunian.period || '当年应期');
    const readHint = info.oppositePalace
      ? `小限看今年落点，对宫看应事对象。${info.oppositeLabel}要优先观察，结合大限背景落到现实安排。`
      : '先完成排盘后，再显示小限落宫与对宫应事。';
    return `
      <div class="mbp-xiaolian-panel">
        <div class="mbp-xiaolian-head">
          <span>小流年</span>
          <strong>${escapeHtml(`${info.year} ${info.yearGz} · ${info.age}岁`)}</strong>
          <p>大限看十年背景，小流年看当年触发，对宫看外部牵动。</p>
        </div>
        <div class="mbp-xiaolian-grid">
          <section>
            <b>小限落宫</b>
            <strong>${escapeHtml(info.xiaoLabel)}</strong>
            <p>${escapeHtml(`${palaceDomain(info.xiaoLianPalace?.name || '')} · ${palaceStarBrief(info.xiaoLianPalace)}`)}</p>
          </section>
          <section class="is-opposite">
            <b>对宫应事</b>
            <strong>${escapeHtml(info.oppositeLabel)}</strong>
            <p>${escapeHtml(`${palaceDomain(info.oppositePalace?.name || '')} · ${palaceStarBrief(info.oppositePalace)}`)}</p>
          </section>
          <section>
            <b>流年卦线</b>
            <strong>${escapeHtml(info.liunian.name || '待排盘')}</strong>
            <p>${escapeHtml(lineText)}</p>
          </section>
        </div>
        <div class="mbp-xiaolian-callout">
          <b>读法</b>
          <p>${escapeHtml(readHint)}</p>
        </div>
      </div>
    `;
  }

  function renderXiaoLianAgeRail(info) {
    const selectedAge = info.selected?.age || info.currentAge;
    return `
      <div class="mbp-decade-rail mbp-xiaolian-age-rail" data-xiaolian-age-rail aria-label="小限流年年龄选择">
        ${info.items.map((item) => `
          <button type="button" class="${item.age === selectedAge ? 'is-active' : ''}${item.isCurrent ? ' is-current' : ''}" data-xiaolian-age="${item.age}" ${item.isCurrent ? 'data-xiaolian-current="true"' : ''} title="${escapeHtml(`${item.age}岁 · ${item.year} ${item.yearGz} · ${item.xiaoLabel}`)}">
            <span>${item.age}岁</span>
            <strong>${escapeHtml(item.xiaoLabel)}</strong>
            ${item.isCurrent ? '<em>当前</em>' : ''}
          </button>
        `).join('')}
      </div>
      ${info.isOverflowCurrentAge ? `<p class="mbp-luck-overflow-note">${escapeHtml(currentAgeOverflowNote('小流年', info.realCurrentAge, info.supportedMaxAge))}</p>` : ''}
    `;
  }

  function renderLuckDecadeRail(info) {
    const selectedKey = info.selectedDecade?.key || '';
    const currentKey = info.currentDecade?.key || '';
    return `
      <div class="mbp-decade-rail" data-luck-decade-rail aria-label="十年大限选择">
        ${info.decadeItems.map((item) => `
          <button type="button" class="${item.key === selectedKey ? 'is-active' : ''}${item.key === currentKey ? ' is-current' : ''}" data-luck-decade="${escapeHtml(item.key)}" ${item.key === currentKey ? 'data-luck-current="true"' : ''} title="${escapeHtml(`${item.rangeLabel} · ${item.palaceName} · ${item.domain}`)}">
            <span>${escapeHtml(item.rangeLabel)}</span>
            <strong>${escapeHtml(item.palaceName)}</strong>
            ${item.key === currentKey ? '<em>当前</em>' : ''}
          </button>
        `).join('')}
      </div>
      ${info.isOverflowCurrentAge ? `<p class="mbp-luck-overflow-note">${escapeHtml(currentAgeOverflowNote('十年大限', info.realCurrentAge, info.supportedMaxAge))}</p>` : ''}
    `;
  }

  function renderReadingActionPrompt(text, moduleKey, label) {
    return `
      <div class="mbp-luck-empty-action">
        <p class="mbp-luck-placeholder">${escapeHtml(text)}</p>
        <button class="mbp-chapter-ai-btn" type="button" data-report-module="${escapeHtml(moduleKey)}">${escapeHtml(label)}</button>
      </div>
    `;
  }

  function renderReadingPassivePrompt(text) {
    return `
      <div class="mbp-luck-empty-action">
        <p class="mbp-luck-placeholder">${escapeHtml(text)}</p>
      </div>
    `;
  }

  function renderLuckReading(data, _fallbackText, info) {
    const hasContent = hasAiRenderableContent(data);
    const sections = hasContent ? aiSections(data) : [];
    const rawText = hasContent ? aiCardText(data) : '';
    const paragraphs = sections.length
      ? sections.map((section) => ({
        title: cleanAiInlineText(section.title),
        content: cleanAiText(section.content),
      })).filter((section) => section.content || section.title)
      : rawText.split(/\n{2,}/).map((content) => ({ title: '', content: cleanAiText(content) })).filter((section) => section.content);
    const selected = info.selectedDecade;
    const isCurrentSelected = !!selected && selected.key === info.currentDecade?.key;
    const placeholder = info.isOverflowCurrentAge
      ? `当前${info.realCurrentAge}岁已超出十年大限展示区间，以下仅参考 ${selected?.rangeLabel || `${info.supportedMaxAge}岁前后`} 的末段走势，不把 ${info.supportedMaxAge}岁当成当前年龄。`
      : (isCurrentSelected
      ? `${selected?.rangeLabel || '当前十年'} · ${selected?.palaceName || '大限宫'}。当前十年会随“总批命”自动生成，不需要单独点击。`
      : `${selected?.rangeLabel || '选中十年'} · ${selected?.palaceName || '大限宫'}。点击“批选中十年”，按后台大限提示词生成这一段整体解盘。`);
    return `
      <div class="mbp-luck-reading">
        <div class="mbp-luck-reading-head">
          <span>${info.isOverflowCurrentAge ? '超高龄参考十年' : (selected?.key === info.currentDecade?.key ? '当前十年' : '选中十年')}</span>
          <strong>${escapeHtml(info.isOverflowCurrentAge
            ? `${selected?.rangeLabel || `参考至${info.supportedMaxAge}岁`} · ${selected?.palaceName || '大限宫'} · 末段参考`
            : `${selected?.rangeLabel || ''} · ${selected?.palaceName || '大限宫'} · ${selected?.theme || '十年主轴'}`)}</strong>
          <p>${escapeHtml(info.isOverflowCurrentAge
            ? currentAgeOverflowNote('十年大限', info.realCurrentAge, info.supportedMaxAge)
            : `主星：${selected?.stars || '待排盘'}；领域：${selected?.domain || '命盘主线'}`)}</p>
        </div>
        <div class="mbp-luck-reading-body">
          ${paragraphs.length ? paragraphs.map((section) => `
            <section>
              ${section.title && section.title !== '解读' ? `<b>${escapeHtml(section.title)}</b>` : ''}
              <p>${highlightInsightText(section.content || section.title)}</p>
            </section>
          `).join('') : (isCurrentSelected ? renderReadingPassivePrompt(placeholder) : renderReadingActionPrompt(placeholder, 'current_luck', '批选中十年'))}
        </div>
      </div>
    `;
  }

  function renderXiaoLianReading(data, _fallbackText, info) {
    const hasContent = hasAiRenderableContent(data);
    const sections = hasContent ? aiSections(data) : [];
    const rawText = hasContent ? aiCardText(data) : '';
    const paragraphs = sections.length
      ? sections.map((section) => ({
        title: cleanAiInlineText(section.title),
        content: cleanAiText(section.content),
      })).filter((section) => section.content || section.title)
      : rawText.split(/\n{2,}/).map((content) => ({ title: '', content: cleanAiText(content) })).filter((section) => section.content);
    const selected = info.selected || {};
    const yearText = `${selected.year || ''} ${selected.yearGz || ''}`.trim();
    const title = selected.age
      ? `${info.isOverflowCurrentAge ? `参考${selected.age}岁` : `${selected.age}岁`} · ${yearText || '流年'} · ${selected.liunian?.name || '流年卦'}`
      : '小限流年';
    const meta = info.isOverflowCurrentAge
      ? currentAgeOverflowNote('小流年', info.realCurrentAge, info.supportedMaxAge)
      : `小限：${selected.xiaoLabel || '未定'}；对宫：${selected.oppositeLabel || '未定'}`;
    const placeholder = info.isOverflowCurrentAge
      ? `当前${info.realCurrentAge}岁已超出小流年展示区间，以下仅参考 ${selected.age || info.supportedMaxAge} 岁这一年，不把它当成当前年龄。`
      : '选择上方 1-100 岁，再点“单独批小限”生成这一年的小限流年解读。';
    return `
      <div class="mbp-luck-reading">
        <div class="mbp-luck-reading-head">
          <span>${info.isOverflowCurrentAge ? '超高龄参考小流年' : (selected.isCurrent ? '当前小流年' : '选中小流年')}</span>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(meta)}</p>
        </div>
        <div class="mbp-luck-reading-body">
          ${paragraphs.length ? paragraphs.map((section) => `
            <section>
              ${section.title && section.title !== '解读' ? `<b>${escapeHtml(section.title)}</b>` : ''}
              <p>${highlightInsightText(section.content || section.title)}</p>
            </section>
          `).join('') : renderReadingActionPrompt(placeholder, 'xiaoxian_liunian', '单独批小限')}
        </div>
      </div>
    `;
  }

  function renderLuckChapterBlock(_data, fallbackText) {
    const info = currentLuckViewInfo();
    const selectedData = luckDataForSelected({
      selected: info.selectedDecade,
      current: info.currentDecade,
    });
    return `
      ${renderLuckDecadeRail(info)}
      ${renderLuckReading(selectedData, fallbackText, info)}
    `;
  }

  function renderPendingChapterBlock(text) {
    return `<p class="mbp-luck-placeholder">${escapeHtml(text)}</p>`;
  }

  function renderXiaoLianChapterBlock(data, fallbackText) {
    const info = selectedXiaoLianInfo();
    const selected = info.selected || {};
    const selectedData = xiaoLianDataForSelected(info) || (selected.isCurrent ? normalizeAiData(data) : null);
    return `
      ${renderXiaoLianAgeRail(info)}
      ${renderXiaoLianReading(selectedData, fallbackText, info)}
    `;
  }

  function centerActiveReportRails() {
    document.querySelectorAll('[data-luck-decade-rail], [data-xiaolian-age-rail]').forEach((rail) => {
      const active = rail.querySelector('.is-active') || rail.querySelector('.is-current');
      if (!active) return;
      const left = active.offsetLeft - ((rail.clientWidth - active.clientWidth) / 2);
      rail.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
    });
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
    if (title) title.textContent = fallbackTitle;
    if (body) {
      body.innerHTML = renderSpecialTopicSegments({
        title: fallbackTitle,
        content: aiCardText(normalized) || insightSummary(normalized, '原站 AI 暂未返回内容，请稍后重试。', 180),
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
    setPdfHint(enabled ? '已生成，可下载客户版 PDF' : '生成后可下载客户版命盘解读', enabled ? 'ready' : '');
  }

  function generatedModuleCount() {
    return aiTasks.filter((task) => moduleHasRenderable(task.module)).length;
  }

  const reportChapterProgressGroups = [
    { modules: ['overall'] },
    { modules: ['shengong', 'hunyin', 'jiankang', 'caiyun', 'shiye'] },
    { modules: ['current_luck'] },
    { modules: ['xiaoxian_liunian'] },
    { modules: ['life_curve'] },
    { modules: ['action_advice'] },
  ];
  const reportChapterTotal = reportChapterProgressGroups.length;

  function reportChapterDoneCount() {
    return reportChapterProgressGroups.filter((group) => {
      const modules = group.modules || [];
      return modules.length && modules.every((moduleKey) => moduleHasRenderable(moduleKey));
    }).length;
  }

  function reportChapterProgressValue(runningModule = '') {
    return reportChapterProgressGroups.reduce((sum, group) => {
      const modules = group.modules || [];
      if (!modules.length) return sum;
      const done = modules.filter((moduleKey) => moduleHasRenderable(moduleKey)).length;
      if (done >= modules.length) return sum + 1;
      if (runningModule && modules.includes(runningModule)) return sum + Math.max(done / modules.length, 0.12);
      if (done > 0) return sum + (done / modules.length);
      return sum;
    }, 0);
  }

  function reportChapterProgress(group, runningModule, totalDone, totalModules) {
    if (group.modules) {
      const done = group.modules.filter((moduleKey) => moduleHasRenderable(moduleKey)).length;
      const total = group.modules.length;
      const running = group.modules.includes(runningModule);
      if (done >= total) return { ratio: 1, state: 'done', text: '完成' };
      if (running) return { ratio: Math.max(done / total, 0.12), state: 'running', text: total > 1 ? `${done}/${total}` : '生成中' };
      if (done > 0) return { ratio: done / total, state: 'partial', text: `${done}/${total}` };
      return { ratio: 0, state: 'pending', text: '等待' };
    }
    return { ratio: 0, state: 'pending', text: '等待' };
  }

  function updateBookProgress(done = 0, runningIndex = -1, stateText = '待生成') {
    const total = reportChapterTotal;
    const runningModule = aiTasks[runningIndex]?.module || '';
    const safeDone = reportChapterDoneCount();
    const progressValue = Math.max(0, Math.min(reportChapterProgressValue(runningModule), total));
    const percent = total ? Math.round((progressValue / total) * 100) : 0;
    const text = $('#mbpBookProgressText');
    const fill = $('#mbpBookProgressFill');
    const track = fill?.closest('.mbp-book-progress-track');
    const hint = $('#mbpBookProgressHint');
    if (text) text.textContent = `${percent}%`;
    if (fill) fill.style.width = `${percent}%`;
    if (track) track.setAttribute('aria-valuenow', String(percent));
    if (hint) {
      hint.textContent = percent >= 100
        ? '六卷命书已生成，可继续查看细节或打包报告。'
        : (runningModule ? `正在生成：${stateText}` : '等待客户确认排盘后开始生成。');
    }
    document.querySelectorAll('[data-report-nav]').forEach((button) => {
      const index = Number(button.dataset.reportNav) || 0;
      const item = reportChapterProgress(reportChapterProgressGroups[index] || {}, runningModule, safeDone, total);
      const row = button.closest('li');
      row?.classList.toggle('is-done', item.state === 'done');
      row?.classList.toggle('is-running', item.state === 'running');
      row?.classList.toggle('is-partial', item.state === 'partial');
      row?.style.setProperty('--mbp-chapter-progress', `${Math.round(item.ratio * 100)}%`);
      const article = document.querySelector(`[data-report-chapter="${index}"]`);
      article?.classList.toggle('is-running', item.state === 'running');
      article?.classList.toggle('is-done', item.state === 'done');
      article?.classList.toggle('is-partial', item.state === 'partial');
      const stateNode = button.querySelector('[data-report-progress-state]');
      if (stateNode) stateNode.textContent = item.text;
    });
  }

  function updateDecodeAllButtonProgress(done = 0, runningIndex = -1, stateText = '待生成') {
    const total = reportChapterTotal || 6;
    const runningModule = aiTasks[runningIndex]?.module || '';
    const safeDone = Math.max(0, Math.min(reportChapterDoneCount(), total));
    const progressValue = Math.max(0, Math.min(reportChapterProgressValue(runningModule), total));
    const degrees = total ? (progressValue / total) * 360 : 0;
    const isGenerating = runningIndex >= 0 && safeDone < total;
    const isComplete = safeDone >= total;
    document.querySelectorAll('[data-decode-all]').forEach((button) => {
      const isRunning = button.classList.contains('is-running') && isGenerating;
      const hasProgress = progressValue > 0 || isRunning || isComplete;
      button.style.setProperty('--decode-progress', `${degrees}deg`);
      button.dataset.decodeDone = String(safeDone);
      button.dataset.decodeTotal = String(total);
      button.classList.toggle('has-progress', hasProgress);
      button.classList.toggle('is-complete', isComplete);
      button.setAttribute('aria-label', `${stateText}，已完成 ${safeDone}/${total} 卷`);
      const progressLabel = button.querySelector('[data-decode-progress-label]');
      if (progressLabel) progressLabel.textContent = `${safeDone}/${total}`;
      const main = button.querySelector('[data-decode-main]');
      const sub = button.querySelector('[data-decode-sub]');
      if (main) main.textContent = isRunning ? '生成' : (isComplete ? '已完' : '总批');
      if (sub) sub.textContent = isRunning ? '中' : (isComplete ? '成' : '命');
    });
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
    const label = $('#mbpReportStateText');
    if (label) label.textContent = stateText;
    updateDecodeAllButtonProgress(done, runningIndex, stateText);
    updateBookProgress(done, runningIndex, stateText);
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
    document.querySelectorAll('[data-report-chapter]').forEach((chapter) => {
      const isActive = Number(chapter.dataset.reportChapter) === activeIndex;
      chapter.classList.toggle('is-active', isActive);
      chapter.setAttribute('aria-current', isActive ? 'true' : 'false');
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

  function pdfReportReady() {
    return state.decoded && generatedModuleCount() > 0 && $('#mbpChapters')?.classList.contains('is-generated');
  }

  function setPdfHint(text, mode = '') {
    const hint = $('#mbpPdfHint');
    const btn = $('#mbpExportPdf');
    if (hint) {
      hint.textContent = text;
      hint.classList.toggle('is-ready', mode === 'ready');
      hint.classList.toggle('is-error', mode === 'error');
    }
    if (btn) {
      btn.classList.toggle('is-ready', mode === 'ready');
      btn.classList.toggle('is-error', mode === 'error');
    }
  }

  function pdfGeneratedAt() {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  }

  function cleanCloneIds(root) {
    root.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    return root;
  }

  function buildPdfSyncedChaptersHtml() {
    const source = $('#mbpChapters');
    if (!source || !source.classList.contains('is-generated')) return '';
    const clone = cleanCloneIds(source.cloneNode(true));
    clone.classList.add('mbp-pdf-synced-chapters');
    clone.querySelectorAll('button, .mbp-report-actions, [data-luck-decade-rail], [data-xiaolian-age-rail]').forEach((node) => node.remove());
    clone.querySelectorAll('[aria-live], [aria-current], [tabindex], [role]').forEach((node) => {
      node.removeAttribute('aria-live');
      node.removeAttribute('aria-current');
      node.removeAttribute('tabindex');
      node.removeAttribute('role');
    });
    return clone.outerHTML;
  }

  function pdfPillarLine(pillars = fcBirthPillars) {
    if (!pillars) return '—';
    return [
      pillarText(pillars.yearStem, pillars.yearBranch),
      pillarText(pillars.monthStem, pillars.monthBranch),
      pillarText(pillars.dayStem, pillars.dayBranch),
      pillarText(pillars.hourStem, pillars.hourBranch),
    ].join(' ');
  }

  function pdfPalaceAge(palace) {
    const range = palace?.decadal?.range;
    if (Array.isArray(range) && range.length >= 2) return `${range[0]}-${range[1]}`;
    const match = String(range || '').match(/(\d+)/g);
    return match && match.length >= 2 ? `${match[0]}-${match[1]}` : '';
  }

  function pdfPalaceMajor(palace) {
    return (palace?.majorStars || [])
      .slice(0, 3)
      .map((star) => `${star.name || ''}${star.brightness || ''}`.trim())
      .filter(Boolean)
      .join(' · ') || '空宫';
  }

  function pdfPalaceMinor(palace) {
    return allSmallStars(palace || {})
      .slice(0, 5)
      .map(starText)
      .filter(Boolean)
      .join('、');
  }

  function buildPdfBasicCards(bundle, generatedAt) {
    const chart = bundle.chart;
    const norm = bundle.norm || {};
    const life = findLifePalace(chart);
    const body = findBodyPalace(chart);
    const gender = state.profile.gender === 'female' ? '女命' : '男命';
    const name = state.profile.name || gender;
    const city = state.profile.cityName || state.profile.city || '未填地点';
    const time = `${dateStr(state.profile)} ${pad2(state.profile.hour)}:${pad2(state.profile.minute)}`;
    const basics = [
      ['命主', name],
      ['性别', gender],
      ['出生资料', time],
      ['出生地点', city],
      ['农历', chart.chineseDate || chart.lunarDate || '—'],
      ['真太阳时', $('#mbpFcTst')?.textContent || '—'],
      ['排盘时辰', $('#mbpFcShichen')?.textContent || `${shichenLabel(norm)}时`],
      ['节气四柱', pdfPillarLine()],
      ['五行局', chart.fiveElementsClass || '—'],
      ['命主身主', `${chart.soul || '—'} · ${chart.body || '—'}`],
      ['命宫', `${life?.earthlyBranch || '—'} · ${life?.name || '命宫'}`],
      ['身宫', `${body?.earthlyBranch || '—'} · ${body?.name || '身宫'}`],
      ['生成时间', generatedAt],
    ];
    return basics.map(([label, value]) => `
      <div class="mbp-pdf-basic-card">
        <b>${escapeHtml(label)}</b>
        <span>${escapeHtml(value)}</span>
      </div>
    `).join('');
  }

  function buildPdfChartGrid(bundle) {
    const chart = bundle.chart;
    const palaces = new Map((chart?.palaces || []).map((palace) => [palace.earthlyBranch, palace]));
    const cells = [
      ['巳', 1, 1], ['午', 2, 1], ['未', 3, 1], ['申', 4, 1],
      ['辰', 1, 2], ['酉', 4, 2],
      ['卯', 1, 3], ['戌', 4, 3],
      ['寅', 1, 4], ['丑', 2, 4], ['子', 3, 4], ['亥', 4, 4],
    ];
    const solar = $('#mbpFcSolar')?.textContent || '';
    const lunar = $('#mbpFcLunar')?.textContent || '';
    const tst = $('#mbpFcTst')?.textContent || '';
    const mutagenText = mutagens(chart).slice(0, 4).join('、') || '—';
    const cellHtml = cells.map(([branch, column, row]) => {
      const palace = palaces.get(branch) || {};
      const tags = [palace.isSoulPalace ? '命宫' : '', palace.isBodyPalace ? '身宫' : ''].filter(Boolean);
      const minor = pdfPalaceMinor(palace);
      const stemBranch = `${palace.heavenlyStem || ''}${palace.earthlyBranch || branch}`;
      const age = pdfPalaceAge(palace);
      return `
        <section class="mbp-pdf-palace" style="grid-column:${column};grid-row:${row};">
          <header>
            <strong>${escapeHtml(palace.name || branch)}</strong>
            <span>${escapeHtml(stemBranch)}</span>
          </header>
          ${tags.length ? `<em>${escapeHtml(tags.join(' · '))}</em>` : ''}
          <b>${escapeHtml(pdfPalaceMajor(palace))}</b>
          <p>${escapeHtml(minor || '—')}</p>
          <footer><span>${escapeHtml(age || '—')}</span><strong>${escapeHtml(palace.name || '')}</strong></footer>
        </section>
      `;
    }).join('');
    return `
      <div class="mbp-pdf-chart-panel">
        <div class="mbp-pdf-zw-grid">
          ${cellHtml}
          <div class="mbp-pdf-chart-center">
            <h3>紫微排盘</h3>
            <dl>
              <div><dt>公历</dt><dd>${escapeHtml(solar || '—')}</dd></div>
              <div><dt>农历</dt><dd>${escapeHtml(lunar || '—')}</dd></div>
              <div><dt>真太阳时</dt><dd>${escapeHtml(tst || '—')}</dd></div>
              <div><dt>四柱</dt><dd>${escapeHtml(pdfPillarLine())}</dd></div>
              <div><dt>四化</dt><dd>${escapeHtml(mutagenText)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    `;
  }

  function buildPdfTextCards(data, fallbackTitle, fallbackText, limit = 6) {
    const sections = aiSections(data).filter((section) => section.content || section.title);
    const list = sections.length ? sections.slice(0, limit) : [{ title: fallbackTitle, content: fallbackText }];
    return list.map((section) => `
      <section class="mbp-pdf-text-card">
        <strong>${escapeHtml(section.title || fallbackTitle)}</strong>
        <p>${escapeHtml(cleanAiText(section.content || fallbackText || '等待生成。'))}</p>
      </section>
    `).join('');
  }

  function buildPdfChapter(index, title, innerHtml) {
    return `
      <article class="mbp-pdf-chapter">
        <header class="mbp-pdf-chapter-head">
          <span>卷${index}</span>
          <h3>${escapeHtml(title)}</h3>
        </header>
        <div class="mbp-pdf-chapter-body">${innerHtml}</div>
      </article>
    `;
  }

  function buildPdfChaptersHtml() {
    const overall = normalizeAiData(state.aiResults.overall);
    const luck = normalizeAiData(state.aiResults.current_luck);
    const xiaoLian = normalizeAiData(state.aiResults.xiaoxian_liunian);
    const overallText = aiCardText(overall);
    const luckText = aiCardText(luck);
    const xiaoText = aiCardText(xiaoLian);
    const specialModules = [
      ['shengong', '身宫批命'],
      ['hunyin', '婚姻批命'],
      ['jiankang', '健康批命'],
      ['caiyun', '财运批命'],
      ['shiye', '事业批命'],
    ];
    const specialHtml = specialModules.map(([key, title]) => {
      const data = normalizeAiData(state.aiResults[key]);
      const generatedTitle = aiCardTitle(data, '');
      const fullText = aiCardText(data);
      const summary = fullText || insightSummary(data, `${title}等待原站 AI 返回。`, 180);
      const content = generatedTitle && generatedTitle !== title && !isTechnicalAiTitle(generatedTitle) && summary && !summary.startsWith(generatedTitle)
        ? `${generatedTitle}：${summary}`
        : summary;
      return `
        <section class="mbp-pdf-text-card">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(content)}</p>
        </section>
      `;
    }).join('');
    const advice = actionAdviceData(overall, luck, xiaoLian);
    const adviceHtml = `
      <section class="mbp-pdf-text-card">
        <strong>风险总括</strong>
        <p>${escapeHtml(advice.risks.map((item) => `${item.label}：${item.text}`).join('\n'))}</p>
      </section>
      ${advice.steps.map((step) => `
        <section class="mbp-pdf-text-card">
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(step.text)}</p>
        </section>
      `).join('')}
      <section class="mbp-pdf-text-card">
        <strong>收束</strong>
        <p>${escapeHtml(advice.note)}</p>
      </section>
    `;
    return [
      buildPdfChapter(1, aiCardTitle(overall, '命格总览'), buildPdfTextCards(overall, '命格总览', overallText || '整体批命等待原站 AI 返回。')),
      buildPdfChapter(2, '专题批命', specialHtml),
      buildPdfChapter(3, '十年大限解读', buildPdfTextCards(luck, '十年大限解读', luckText || '十年大限等待原站 AI 返回。')),
      buildPdfChapter(4, '小限流年', buildPdfTextCards(xiaoLian, '小限流年', xiaoText || '小限流年等待原站 AI 返回。')),
      buildPdfChapter(5, '人生曲线', `
        <section class="mbp-pdf-text-card">
          <strong>整体走势</strong>
          <p>人生曲线用于看关键年份、高低点与转折节奏。后续接入原站曲线评分后，这里会自动替换为客户版曲线结论。</p>
        </section>
      `),
      buildPdfChapter(6, '行动建议', adviceHtml),
    ].join('');
  }

  function buildPdfReportElement() {
    const bundle = getChartBundle();
    if (bundle.error) throw new Error(bundle.error);
    renderChart();
    if (pdfReportReady()) renderChaptersFromAi();
    const facts = chartFacts();
    const name = state.profile.name || (state.profile.gender === 'female' ? '女命' : '男命');
    const gender = state.profile.gender === 'female' ? '女命' : '男命';
    const city = state.profile.cityName || state.profile.city || '未填地点';
    const time = `${dateStr(state.profile)} ${pad2(state.profile.hour)}:${pad2(state.profile.minute)}`;
    const generatedAt = pdfGeneratedAt();
    const report = document.createElement('article');
    report.className = 'mbp-pdf-report';
    report.innerHTML = `
      <header class="mbp-pdf-head">
        <span>阅天 · 紫微命盘深度报告</span>
        <h1>${escapeHtml(name)}个人命盘解读</h1>
        <p>${escapeHtml(gender)} · ${escapeHtml(time)} · ${escapeHtml(city)}</p>
        <p>${escapeHtml(facts.subtitle || '命盘解读')}</p>
        <div class="mbp-pdf-meta">
          <div><b>命主信息</b><span>${escapeHtml(name)} · ${escapeHtml(gender)}</span></div>
          <div><b>出生资料</b><span>${escapeHtml(time)}</span></div>
          <div><b>生成时间</b><span>${escapeHtml(generatedAt)}</span></div>
        </div>
        <ol class="mbp-pdf-toc">
          <li>命格总览</li>
          <li>专题批命</li>
          <li>十年大限解读</li>
          <li>小限流年</li>
          <li>人生曲线</li>
          <li>行动建议</li>
        </ol>
      </header>
      <section class="mbp-pdf-section mbp-pdf-basic-section">
        <h2>基础资料</h2>
        <div class="mbp-pdf-basic-grid">${buildPdfBasicCards(bundle, generatedAt)}</div>
      </section>
      <section class="mbp-pdf-section mbp-pdf-chart-section">
        <h2>命盘</h2>
        ${buildPdfChartGrid(bundle)}
      </section>
      <section class="mbp-pdf-section">
        <h2>命盘解读</h2>
        <div class="mbp-pdf-chapters-slot">${buildPdfSyncedChaptersHtml() || buildPdfChaptersHtml()}</div>
      </section>
    `;
    return report;
  }

  async function downloadMingbookPdf() {
    const btn = $('#mbpExportPdf');
    if (!pdfReportReady()) {
      setDecodeStatus('请先完成一键批命，再打包深度报告。');
      setPdfHint('先生成六卷命书，再下载客户版 PDF', 'error');
      $('#mbpDecodeBtn')?.focus({ preventScroll: true });
      return;
    }
    const original = btn?.innerHTML || '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>正在打包…</span><small>PDF</small>';
    }
    setPdfHint('正在整理命盘、六卷解读与目录…', 'ready');
    setDecodeStatus('正在打包深度报告 PDF…');
    const host = document.createElement('div');
    host.className = 'mbp-pdf-export-host';
    const report = buildPdfReportElement();
    host.appendChild(report);
    document.body.classList.add('is-pdf-exporting');
    document.body.appendChild(host);
    try {
      const html2pdf = await loadHtml2Pdf();
      const profileKey = dateStr(state.profile).replace(/-/g, '');
      const filename = `${safePdfFileName(state.profile.name || '个人命盘')}-${profileKey}-紫微命盘深度报告.pdf`;
      const pdfWidth = Math.ceil(report.scrollWidth || report.getBoundingClientRect().width || 794);
      const pdfPageHeight = 1123;
      const rawPdfHeight = Math.ceil(report.scrollHeight || report.getBoundingClientRect().height || pdfPageHeight);
      const pdfHeight = Math.ceil((rawPdfHeight + pdfPageHeight) / pdfPageHeight) * pdfPageHeight;
      await html2pdf().set({
        filename,
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#f5efe4',
          width: pdfWidth,
          height: pdfHeight,
          windowWidth: pdfWidth,
          windowHeight: pdfHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: 'px', format: [794, pdfPageHeight], orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.mbp-pdf-basic-card', '.mbp-pdf-chart-section'] },
      }).from(report).save();
      setDecodeStatus('PDF 已开始下载。');
      setPdfHint('已生成客户版 PDF，可重新打包', 'ready');
    } catch (error) {
      console.error(error);
      setDecodeStatus('PDF 打包失败，请刷新后重试。');
      setPdfHint('PDF 打包失败，请检查网络后重试', 'error');
    } finally {
      document.body.classList.remove('is-pdf-exporting');
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
    const luckInfo = selectedLuckInfo({ readonly: true });
    const luck = luckDataForSelected(luckInfo) || normalizeAiData(state.aiResults.current_luck);
    const xiaoLian = normalizeAiData(state.aiResults.xiaoxian_liunian);
    const lifeCurve = normalizeAiData(state.aiResults.life_curve);
    const actionAdvice = normalizeAiData(state.aiResults.action_advice);
    const overallText = aiCardText(overall);
    const luckText = aiCardText(luck);
    const xiaoText = aiCardText(xiaoLian);
    const curveText = aiCardText(lifeCurve);
    const adviceText = aiCardText(actionAdvice);
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
        const generatedTitle = aiCardTitle(data, '');
        const fullText = aiCardText(data);
        const summary = fullText || insightSummary(data, '', 180);
        return {
          title,
          content: generatedTitle && generatedTitle !== title && !isTechnicalAiTitle(generatedTitle) && summary && !summary.startsWith(generatedTitle)
            ? `${generatedTitle}：${summary}`
            : summary,
        };
      })
      .filter((item) => item?.content);
    const specialBriefText = specialBriefSections
      .map((section) => `${section.title}：${section.content}`)
      .join('\n\n');
    const decodeList = $('#mbpDecodeList');
    if (decodeList) {
      const highlights = [
        ['主线', overallText || '整体批命生成后显示'],
        ['十年', luckText || '十年大限生成后显示'],
        ['小限', xiaoText || '小限流年生成后显示'],
        ['建议', adviceText || curveText || specialText || '曲线与建议生成后显示'],
      ];
      decodeList.innerHTML = highlights.map((item) => `
        <p><strong>${escapeHtml(item[0])}</strong>${escapeHtml(trimText(item[1], 48))}</p>
      `).join('');
    }
    const chaptersData = [
      [aiCardTitle(overall, '命格总览'), overallText || '整体批命等待原站 AI 返回。', null, 'overall'],
      ['专题批命', specialBriefText || '五项专题等待原站 AI 返回。', specialBriefSections, 'specials'],
      ['十年大限解读', luckText || '选择十年大限后，点击“批选中十年”生成整体解盘。', null, 'luck'],
      ['小限流年', xiaoText || '点击“单独批小限”后生成小限流年解读。', null, 'xiaoxian'],
      [aiCardTitle(lifeCurve, '人生曲线'), curveText || '点击“生成曲线”后生成。', null, 'life_curve'],
      [aiCardTitle(actionAdvice, '行动建议'), adviceText || '点击“生成建议”后生成。', null, 'action_advice'],
    ];
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.classList.add('is-generated');
      chapters.innerHTML = chaptersData.map((item, index) => {
        const type = item[3] || '';
        const data = type === 'overall' ? overall : type === 'luck' ? luck : type === 'xiaoxian' ? xiaoLian : type === 'life_curve' ? lifeCurve : type === 'action_advice' ? actionAdvice : { card: { title: item[0], body: item[1], sections: item[2] || null } };
        return `
        <article class="mbp-report-row" id="mbp-chapter-${index}" data-report-chapter="${index}">
          <span>卷${index + 1}</span>
          <div class="mbp-report-title">
            <h3>${escapeHtml(item[0])}</h3>
            ${chapterActionButton(index)}
          </div>
            <div class="mbp-report-content">
              ${type === 'specials' ? renderSpecialChapterBlock(item[2], item[1]) : type === 'luck' ? renderLuckChapterBlock(data, item[1]) : type === 'xiaoxian' ? renderXiaoLianChapterBlock(data, item[1]) : type === 'life_curve' ? ((state.curveGenerated || moduleHasRenderable(type) || window._fcLifeCurveData?.scores?.length) ? renderCurveChapterBlock(data, item[1]) : renderPendingChapterBlock(item[1])) : type === 'action_advice' && !moduleHasRenderable(type) ? renderPendingChapterBlock(item[1]) : renderInsightBlock(data, item[0], item[1], {
                summaryMax: 128,
                bulletLimit: 0,
                direct: true,
              })}
            </div>
        </article>
      `;
      }).join('');
    }
    syncBookClientMeta();
    requestAnimationFrame(() => {
      syncReportNav();
      centerActiveReportRails();
    });
  }

  async function callOriginalAi(moduleKey, options = {}) {
    if (typeof window._aipCallBackend !== 'function') {
      throw new Error('原站 AI 批命脚本未加载');
    }
    if (moduleKey === 'life_curve') {
      ensureLifeCurveData({ force: true });
    }
    const backendModule = moduleKey === 'current_luck'
      ? 'current_luck'
      : (moduleKey === 'xiaoxian_liunian' ? 'xiaoxian_liunian' : moduleKey);
    const extraParams = moduleKey === 'current_luck'
      ? currentLuckExtraParams(options)
      : (moduleKey === 'xiaoxian_liunian' ? xiaoLianExtraParams(options) : (moduleKey === 'life_curve' ? {
        currentStage: window._fcLifeCurveData?.current?.summary || '',
        currentAge: window._fcLifeCurveData?.currentAge || fcCurrentVirtualAge(),
        peakAges: window._fcLifeCurveData?.peakAges || [],
        valleyAges: window._fcLifeCurveData?.valleyAges || [],
      } : (moduleKey === 'yijing_timing' ? {
        yijingTiming: options.yijingTiming || {},
      } : {})));
    return normalizeAiData(await window._aipCallBackend(backendModule, extraParams));
  }

  function setModuleButtonsBusy(moduleKey, busy) {
    document.querySelectorAll(`[data-ai-module="${moduleKey}"], [data-report-module="${moduleKey}"]`).forEach((button) => {
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

  function ensureChartReady() {
    if (state.chartReady && state.chartConfirmedKey && state.chartConfirmedKey === profileHistoryKey(state.profile)) return true;
    const message = '请先输入出生信息，并点击“开始排盘”生成命盘后再批命。';
    guideUserToBirthForm(message);
    return false;
  }

  async function decodeSingleModule(moduleKey, options = {}) {
    if (!ensureChartReady()) return false;
    const bundle = getChartBundle();
    if (bundle.error) {
      guideUserToBirthForm(bundle.error);
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
      if (task.module === 'life_curve') {
        state.curveGenerated = true;
        ensureLifeCurveData({ force: true });
      }
      const data = await callOriginalAi(task.module, options);
      if (!hasAiRenderableContent(data)) {
        throw new Error('AI 已返回，但没有可展示正文，请重试');
      }
      const countsAsModule = storeAiResult(task.module, data, options);
      const moduleDone = task.module === 'current_luck' || task.module === 'xiaoxian_liunian'
        ? countsAsModule || moduleHasRenderable(task.module)
        : true;
      setModuleDone(task.module, moduleDone);
      if (task.key) {
        renderSpecialAi(task.key, data, task.label);
        setSpecialStatus(task.key, '已生成', 'done');
      }
      if (task.module === 'life_curve') state.curveGenerated = true;
      if (task.module === 'action_advice') state.adviceGenerated = true;
      if (generatedModuleCount() >= aiTasks.length) {
        state.curveGenerated = true;
        state.adviceGenerated = true;
      }
      renderChaptersFromAi();
      updateDecodeProgress(generatedModuleCount(), -1, '已生成');
      setDecodeStatus(`${task.label} 已生成。`);
      return true;
    } catch (error) {
      const message = friendlyAiError(error);
      const errorData = aiErrorData(task, message);
      storeAiResult(task.module, errorData, options);
      if (task.key) {
        renderSpecialAi(task.key, errorData, task.label);
        setSpecialStatus(task.key, message, 'error');
      }
      renderChaptersFromAi();
      updateDecodeProgress(generatedModuleCount(), -1, '生成失败');
      setDecodeStatus(`${task.label} 失败：${message}`);
      return false;
    } finally {
      setModuleButtonsBusy(task.module, false);
    }
  }

  function setDecodeAllButtonsBusy(busy, label = '') {
    document.querySelectorAll('[data-decode-all]').forEach((button) => {
      button.disabled = busy;
      button.classList.toggle('is-running', busy);
      if (busy) {
        const main = button.querySelector('[data-decode-main]');
        const sub = button.querySelector('[data-decode-sub]');
        if (main) main.textContent = '生成';
        if (sub) sub.textContent = '中';
      } else {
        const done = Number(button.dataset.decodeDone) || 0;
        const total = Number(button.dataset.decodeTotal) || reportChapterTotal || 6;
        const main = button.querySelector('[data-decode-main]');
        const sub = button.querySelector('[data-decode-sub]');
        if (!done) {
          button.style.setProperty('--decode-progress', '0deg');
          button.classList.remove('has-progress', 'is-complete');
          button.setAttribute('aria-label', '总批命');
          if (main) main.textContent = '总批';
          if (sub) sub.textContent = '命';
          const progressLabel = button.querySelector('[data-decode-progress-label]');
          if (progressLabel) progressLabel.textContent = `0/${total}`;
        } else if (done < total) {
          if (main) main.textContent = '总批';
          if (sub) sub.textContent = '命';
        }
      }
    });
  }

  async function decodeReports() {
    if (!ensureChartReady()) return false;
    const bundle = getChartBundle();
    if (bundle.error) {
      guideUserToBirthForm(bundle.error);
      return false;
    }
    const btn = $('#mbpDecodeBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '生成中…';
    }
    setDecodeAllButtonsBusy(true, '生成中');
    state.decoded = true;
    state.aiResults = {};
    state.luckAiResults = {};
    state.xiaoLianAiResults = {};
    clearLifeCurveData();
    state.selectedLuckRangeKey = '';
    state.selectedXiaoLianAge = '';
    state.curveGenerated = false;
    state.adviceGenerated = false;
    state.batchDecoding = true;
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
        const taskOptions = task.module === 'current_luck'
          ? { forceCurrentLuck: true }
          : (task.module === 'xiaoxian_liunian' ? { forceCurrentXiaoLian: true } : {});
        if (task.module === 'life_curve') {
          state.curveGenerated = true;
          ensureLifeCurveData({ force: true });
        }
        const data = await callOriginalAi(task.module, taskOptions);
        if (!hasAiRenderableContent(data)) {
          throw new Error('AI 已返回，但没有可展示正文，请重试');
        }
        storeAiResult(task.module, data, taskOptions);
        successCount = generatedModuleCount();
        setModuleDone(task.module, true);
        if (task.key) {
          renderSpecialAi(task.key, data, task.label);
          setSpecialStatus(task.key, '已生成', 'done');
        }
        if (task.module === 'life_curve') state.curveGenerated = true;
        if (task.module === 'action_advice') state.adviceGenerated = true;
        renderChaptersFromAi();
        updateDecodeProgress(successCount, index, task.label);
      } catch (error) {
        const message = friendlyAiError(error);
        const errorData = aiErrorData(task, message);
        const taskOptions = task.module === 'current_luck'
          ? { forceCurrentLuck: true }
          : (task.module === 'xiaoxian_liunian' ? { forceCurrentXiaoLian: true } : {});
        storeAiResult(task.module, errorData, taskOptions);
        if (task.key) {
          renderSpecialAi(task.key, errorData, task.label);
          setSpecialStatus(task.key, message, 'error');
        }
        renderChaptersFromAi();
        updateDecodeProgress(successCount, index, '生成失败');
      }
    }

    successCount = generatedModuleCount();
    state.batchDecoding = false;
    state.curveGenerated = successCount >= aiTasks.length;
    state.adviceGenerated = successCount >= aiTasks.length;
    renderChaptersFromAi();
    setDecodeStatus(successCount ? `已接入原站 AI：完成 ${reportChapterDoneCount()}/${reportChapterTotal} 卷。` : 'AI 服务暂未连接，请稍后重试。');
    updateDecodeProgress(successCount, -1, successCount ? '已生成' : '生成失败');
    setAllModuleButtonsBusy(false);
    if (btn) {
      btn.disabled = false;
      btn.textContent = successCount ? '重新生成' : '重试生成';
    }
    setDecodeAllButtonsBusy(false);
    return successCount > 0;
  }

  function generateCurveChapter() {
    if (!ensureChartReady()) return;
    const bundle = getChartBundle();
    if (bundle.error) {
      guideUserToBirthForm(bundle.error);
      return false;
    }
    state.decoded = true;
    state.curveGenerated = true;
    ensureLifeCurveData({ force: true });
    document.body.classList.add('is-decoded');
    renderChaptersFromAi();
    updateDecodeProgress(generatedModuleCount(), -1, '曲线已生成');
    setDecodeStatus('人生曲线已生成。');
    return true;
  }

  async function decodeSpecialChapter() {
    const modules = ['shengong', 'hunyin', 'jiankang', 'caiyun', 'shiye'];
    let success = 0;
    for (const moduleKey of modules) {
      if (await decodeSingleModule(moduleKey)) success += 1;
    }
    setDecodeStatus(success ? `专题批命已完成 ${success}/${modules.length} 项。` : '专题批命生成失败，请稍后重试。');
    return success > 0;
  }

  function resetAiContent() {
    setReportGeneratedState(false);
    resetModuleDoneStates();
    state.batchDecoding = false;
    state.curveGenerated = false;
    state.adviceGenerated = false;
    clearLifeCurveData();
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
      chapters.innerHTML = ['命格总览', '专题批命', '十年大限解读', '小限流年', '人生曲线', '行动建议'].map((title, index) => `
        <article id="mbp-chapter-${index}" data-report-chapter="${index}"><span>卷${index + 1}</span><h3>${title}</h3><p>等待一键批命。</p>${chapterActionButton(index)}</article>
      `).join('');
    }
    syncBookClientMeta();
    const decodeList = $('#mbpDecodeList');
    if (decodeList) {
      decodeList.innerHTML = `
        <p>整体批命先给主线</p>
        <p>五项专题直接出结论</p>
        <p>命书卷轴沉浸阅读</p>
        <p>深度报告可继续追问</p>
      `;
    }
    const btn = $('#mbpDecodeBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '生成命书';
    }
    setAllModuleButtonsBusy(false);
    setDecodeStatus('排盘后生成六卷命书。');
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

  const shichenTimeGroups = [
    {
      key: 'before-dawn',
      label: '凌晨',
      hint: '夜深到天亮前',
      candidates: ['子时', '丑时', '寅时'],
      details: [
        { key: 'midnight', label: '半夜', candidates: ['子时'] },
        { key: 'deep-night', label: '凌晨', candidates: ['丑时'] },
        { key: 'pre-dawn', label: '天亮前', candidates: ['寅时'] },
      ],
    },
    {
      key: 'morning',
      label: '早上',
      hint: '天亮后到上午',
      candidates: ['卯时', '辰时', '巳时'],
      details: [
        { key: 'daybreak', label: '天亮后', candidates: ['卯时'] },
        { key: 'breakfast', label: '早饭时', candidates: ['辰时'] },
        { key: 'late-morning', label: '上午', candidates: ['巳时'] },
      ],
    },
    {
      key: 'daytime',
      label: '白天',
      hint: '白天范围较长，建议再细选',
      candidates: ['卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时'],
      details: [
        { key: 'daybreak', label: '天亮后', candidates: ['卯时'] },
        { key: 'breakfast', label: '早饭时', candidates: ['辰时'] },
        { key: 'late-morning', label: '上午', candidates: ['巳时'] },
        { key: 'noon', label: '中午', candidates: ['午时'] },
        { key: 'after-noon', label: '午后', candidates: ['未时'] },
        { key: 'afternoon', label: '下午', candidates: ['申时'] },
        { key: 'sunset-before', label: '日落前', candidates: ['酉时'] },
      ],
    },
    {
      key: 'noon',
      label: '中午',
      hint: '约 11 点到 13 点',
      candidates: ['午时'],
      details: [],
    },
    {
      key: 'afternoon',
      label: '下午',
      hint: '午后到日落前',
      candidates: ['未时', '申时', '酉时'],
      details: [
        { key: 'after-noon', label: '午后', candidates: ['未时'] },
        { key: 'mid-afternoon', label: '下午三四点', candidates: ['申时'] },
        { key: 'sunset-before', label: '日落前', candidates: ['酉时'] },
      ],
    },
    {
      key: 'night',
      label: '晚上',
      hint: '日落后到睡前、夜里',
      candidates: ['戌时', '亥时', '子时'],
      details: [
        { key: 'dinner-after', label: '晚饭后', candidates: ['戌时'] },
        { key: 'before-sleep', label: '睡前', candidates: ['亥时'] },
        { key: 'late-night', label: '夜里', candidates: ['子时'] },
      ],
    },
  ];

  function openShichenModal() {
    const overlay = $('#mbpShichenOverlay');
    if (!overlay) return;
    renderShichenTimeQuick();
    overlay.hidden = false;
    $('#mbpShichenQuestions').hidden = false;
    $('#mbpShichenResult').hidden = true;
    $('#mbpShichenTimeQuick [data-shichen-time]')?.focus();
  }

  function closeShichenModal() {
    const overlay = $('#mbpShichenOverlay');
    if (overlay) overlay.hidden = true;
  }

  function candidateByName(name) {
    return shichenCandidates.find((item) => item.name === name);
  }

  function uniqueShichenCandidates(items) {
    const seen = new Set();
    return items.filter((item) => {
      if (!item || seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    });
  }

  function shichenTimeGroupByKey(key) {
    return shichenTimeGroups.find((item) => item.key === key) || null;
  }

  function shichenTimeDetailByKey(group, key) {
    return (group?.details || []).find((item) => item.key === key) || null;
  }

  function setShichenTimeSelection(groupKey, detailKey = '') {
    const group = shichenTimeGroupByKey(groupKey);
    if (!group) return;
    const detail = shichenTimeDetailByKey(group, detailKey);
    const names = detail?.candidates || group.candidates || [];
    const input = $('#mbpVagueTime');
    if (input) {
      input.value = [group.label, detail?.label].filter(Boolean).join(' · ');
      input.dataset.group = group.key;
      input.dataset.detail = detail?.key || '';
      input.dataset.candidates = names.join(',');
    }
    renderShichenTimeDetail(group.key);
    syncShichenTimeButtons();
    const hint = $('#mbpShichenTimeHint');
    if (hint) hint.textContent = detail ? `${group.label} · ${detail.label}：已细化到 ${names.join(' / ')}` : `${group.hint}：可继续点下面细化词。`;
  }

  function renderShichenTimeQuick() {
    const root = $('#mbpShichenTimeQuick');
    if (!root || root.dataset.ready === '1') {
      syncShichenTimeButtons();
      return;
    }
    root.innerHTML = shichenTimeGroups.map((item) => `
      <div class="mbp-shichen-time-card" data-shichen-card="${escapeHtml(item.key)}">
        <button type="button" class="mbp-shichen-time-main" data-shichen-time="${escapeHtml(item.key)}">
          <b>${escapeHtml(item.label)}</b>
          <small>${escapeHtml(item.hint)}</small>
        </button>
        <div class="mbp-shichen-time-card-detail" data-shichen-card-detail="${escapeHtml(item.key)}" hidden></div>
      </div>
    `).join('');
    root.dataset.ready = '1';
    renderShichenTimeDetail($('#mbpVagueTime')?.dataset?.group || '');
    syncShichenTimeButtons();
  }

  function renderShichenTimeDetail(groupKey) {
    const box = $('#mbpShichenTimeDetail');
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
    const group = shichenTimeGroupByKey(groupKey);
    const details = group?.details || [];
    document.querySelectorAll('[data-shichen-card-detail]').forEach((detailBox) => {
      const isCurrent = detailBox.dataset.shichenCardDetail === groupKey;
      detailBox.hidden = !isCurrent || !details.length;
      detailBox.innerHTML = isCurrent && details.length
        ? `<span>可细选</span>${details.map((item) => `
          <button type="button" data-shichen-detail="${escapeHtml(item.key)}">
            ${escapeHtml(item.label)}
          </button>
        `).join('')}`
        : '';
    });
  }

  function syncShichenTimeButtons() {
    const input = $('#mbpVagueTime');
    const groupKey = input?.dataset?.group || '';
    const detailKey = input?.dataset?.detail || '';
    document.querySelectorAll('[data-shichen-time]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.shichenTime === groupKey);
    });
    document.querySelectorAll('[data-shichen-card]').forEach((card) => {
      card.classList.toggle('is-active', card.dataset.shichenCard === groupKey);
    });
    document.querySelectorAll('[data-shichen-detail]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.shichenDetail === detailKey);
    });
  }

  function selectedTimeCandidates() {
    const input = $('#mbpVagueTime');
    const names = (input?.dataset?.candidates || '').split(',').filter(Boolean);
    if (names.length) return uniqueShichenCandidates(names.map(candidateByName));
    const vague = normalizeText(input?.value);
    return shichenCandidates.filter((item) => item.keys.some((key) => vague.includes(key)));
  }

  function getSelectedShichenTimeMeta() {
    const input = $('#mbpVagueTime');
    const group = shichenTimeGroupByKey(input?.dataset?.group || '');
    const detail = shichenTimeDetailByKey(group, input?.dataset?.detail || '');
    const hasDetail = Boolean(detail);
    const hasCoarseGroup = Boolean(group && !hasDetail);
    return { group, detail, hasDetail, hasCoarseGroup };
  }

  function inferShichenCandidates() {
    const whorl = document.querySelector('input[name="mbpWhorl"]:checked')?.value;
    const byText = selectedTimeCandidates();
    const byWhorl = (whorlGroups[whorl] || []).map(candidateByName).filter(Boolean);
    const timeMeta = getSelectedShichenTimeMeta();
    const merged = byText.filter((item) => byWhorl.some((match) => match.name === item.name));
    const roughTimeOnly = timeMeta.hasCoarseGroup && !timeMeta.hasDetail;
    const picks = roughTimeOnly && byWhorl.length
      ? byWhorl
      : merged.length ? merged : byText.length ? byText : byWhorl.length ? byWhorl : [candidateByName('午时')];
    return {
      picks: uniqueShichenCandidates(picks).slice(0, 4),
      byText,
      byWhorl,
      merged,
      timeMeta,
      roughTimeOnly,
    };
  }

  function shichenCandidateScore(candidate, context) {
    const inTime = context.byText.some((item) => item.name === candidate.name);
    const inWhorl = context.byWhorl.some((item) => item.name === candidate.name);
    if (inTime && inWhorl && context.merged.length === 1) return 96;
    if (inTime && inWhorl) return 88;
    if (inTime) return 76;
    if (inWhorl) return 68;
    return 58;
  }

  function shichenApplyHour(candidate) {
    const start = Number(candidate?.hour);
    if (!Number.isFinite(start)) return 12;
    return candidate?.name === '子时' ? 0 : (start + 1) % 24;
  }

  function shichenRangeText(candidate) {
    const start = Number(candidate?.hour);
    if (!Number.isFinite(start)) return '';
    return `${pad2(start)}:00-${pad2((start + 2) % 24)}:00`;
  }

  function renderShichenResult() {
    const whorlInput = document.querySelector('input[name="mbpWhorl"]:checked');
    if (!whorlInput) {
      const hint = $('#mbpShichenTimeHint');
      if (hint) hint.textContent = '头旋位置为必选项，请先选一个头旋，再推算时辰。';
      document.querySelector('.mbp-shichen-field-whorl')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    const context = inferShichenCandidates();
    const picks = context.picks;
    const title = $('#mbpShichenResultTitle');
    const reason = $('#mbpShichenResultReason');
    const list = $('#mbpShichenCandidates');
    const vague = normalizeText($('#mbpVagueTime')?.value) || '未填写大概时间';
    const whorl = whorlInput?.dataset?.label || '未选择头旋';
    const hasSingleHit = !context.roughTimeOnly && context.merged.length === 1;
    if (title) title.textContent = hasSingleHit ? `最符合：${picks[0].name}` : `候选：${picks.map((item) => item.name).join(' / ')}`;
    if (reason) {
      reason.textContent = context.roughTimeOnly
        ? `依据：${vague}；${whorl}。未细化具体时段，先按头旋给出 ${picks.length} 个候选。`
        : `依据：${vague}；${whorl}。时间词与头旋交叉后${hasSingleHit ? '只剩 1 个时辰' : `得到 ${picks.length} 个候选`}。`;
    }
    if (list) {
      list.innerHTML = picks.map((item) => {
        const score = shichenCandidateScore(item, context);
        const range = shichenRangeText(item);
        const applyHour = shichenApplyHour(item);
        return `
          <button type="button" data-shichen-hour="${applyHour}" data-shichen-name="${escapeHtml(item.name)}" data-shichen-range="${escapeHtml(range)}" data-shichen-score="${score}">
            <span>${escapeHtml(item.name)} · ${escapeHtml(range)}</span>
            <em><i>推合</i>${score}%</em>
          </button>
        `;
      }).join('');
    }
    $('#mbpShichenQuestions').hidden = true;
    $('#mbpShichenResult').hidden = false;
  }

  function applyShichenCandidate(button) {
    const hour = Number(button.dataset.shichenHour);
    const name = button.dataset.shichenName || '候选时辰';
    const range = button.dataset.shichenRange || '';
    const hourEl = $('#mbpHour');
    const minuteEl = $('#mbpMinute');
    if (hourEl) hourEl.value = String(hour);
    if (minuteEl) minuteEl.value = '0';
    updateTrueSolarPreview();
    const preview = $('#mbpShichenPreview');
    const score = button.dataset.shichenScore ? `（推合${button.dataset.shichenScore}%）` : '';
    if (preview) preview.textContent = `已按天纪推时辰采用：${name}${range ? ` ${range}` : ''}${score}。${preview.textContent ? ` ${preview.textContent}` : ''}`;
    closeShichenModal();
  }

  function desktopLiuyaoLineType(value) {
    return {
      6: { name: '老阴', broken: true, moving: true },
      7: { name: '少阳', broken: false, moving: false },
      8: { name: '少阴', broken: true, moving: false },
      9: { name: '老阳', broken: false, moving: true },
    }[Number(value)] || null;
  }

  function makeDesktopLiuyaoCast() {
    const coins = Array.from({ length: 3 }, () => (Math.random() < 0.5 ? 2 : 3));
    const value = coins.reduce((sum, coin) => sum + coin, 0);
    const type = desktopLiuyaoLineType(value);
    return { value, coins, ...type };
  }

  function desktopLiuyaoQuestion() {
    const text = String($('#mbpLiuyaoQuestion')?.value || desktopLiuyaoState.question || '').trim();
    desktopLiuyaoState.question = text;
    return text;
  }

  function desktopLiuyaoBit(cast, changed = false) {
    const value = Number(cast?.value);
    if (changed && value === 6) return '1';
    if (changed && value === 9) return '0';
    return value === 7 || value === 9 ? '1' : '0';
  }

  function resolveDesktopLiuyaoHex(casts, changed = false) {
    if (!casts || casts.length !== 6 || casts.some((cast) => !cast)) return null;
    const lowerBits = casts.slice(0, 3).map((cast) => desktopLiuyaoBit(cast, changed)).join('');
    const upperBits = casts.slice(3, 6).map((cast) => desktopLiuyaoBit(cast, changed)).join('');
    const lower = desktopLiuyaoTrigrams[lowerBits];
    const upper = desktopLiuyaoTrigrams[upperBits];
    const entry = upper && lower ? desktopLiuyaoHexMap[`${upper.gua}-${lower.gua}`] : null;
    return {
      no: entry?.no || '',
      name: entry?.name || `${upper?.name || ''}${lower?.name || ''}`,
      upper,
      lower,
    };
  }

  function getDesktopLiuyaoResult() {
    const casts = desktopLiuyaoState.casts;
    if (casts.length !== 6 || casts.some((cast) => !cast)) return null;
    return {
      question: desktopLiuyaoState.question,
      primary: resolveDesktopLiuyaoHex(casts, false),
      changed: resolveDesktopLiuyaoHex(casts, true),
      movingLines: casts
        .map((cast, index) => ({ ...cast, index, label: desktopLiuyaoLineLabels[index] }))
        .filter((line) => line.moving),
    };
  }

  function renderDesktopLiuyaoCoins() {
    const coins = $('#mbpLiuyaoCoins');
    if (!coins) return;
    const values = desktopLiuyaoState.lastCoins.length ? desktopLiuyaoState.lastCoins : [null, null, null];
    coins.innerHTML = values.map((coin) => {
      const label = coin === 3 ? '阳' : coin === 2 ? '阴' : '待';
      const className = [
        'mbp-liuyao-coin',
        coin === 2 ? 'is-yin' : '',
        coin == null ? 'is-waiting' : '',
      ].filter(Boolean).join(' ');
      return `<span class="${className}">${escapeHtml(label)}</span>`;
    }).join('');
  }

  function renderDesktopLiuyaoStack() {
    const stack = $('#mbpLiuyaoStack');
    if (!stack) return;
    stack.innerHTML = Array.from({ length: 6 }, (_, row) => {
      const index = 5 - row;
      const cast = desktopLiuyaoState.casts[index];
      const type = cast ? desktopLiuyaoLineType(cast.value) : null;
      const lineClass = [
        'mbp-liuyao-line',
        !cast ? 'is-empty' : '',
        type?.broken ? 'is-yin' : '',
        type?.moving ? 'is-moving' : '',
      ].filter(Boolean).join(' ');
      const segments = type?.broken ? '<i></i><i></i>' : '<i></i>';
      const text = type ? `${type.name}${type.moving ? '动' : '静'}` : '待投';
      return `
        <div class="mbp-liuyao-line-row">
          <span>${escapeHtml(desktopLiuyaoLineLabels[index])}</span>
          <span class="${lineClass}">${segments}</span>
          <span>${escapeHtml(text)}</span>
        </div>
      `;
    }).join('');
  }

  function renderDesktopLiuyaoResult() {
    const box = $('#mbpLiuyaoResult');
    if (!box) return;
    const result = getDesktopLiuyaoResult();
    if (!result) {
      box.innerHTML = '<p class="mbp-liuyao-note">按初爻到上爻投满六次，这里显示本卦、动爻、变卦。</p>';
      return;
    }
    const movingText = result.movingLines.length
      ? `${result.movingLines.map((line) => line.label.replace('爻', '')).join('、')}爻动`
      : '无动爻';
    const movingDetail = result.movingLines.length > 3
      ? `${result.movingLines.length}个动爻，变化较重，先看本卦再看变卦`
      : result.movingLines.length
        ? result.movingLines.map((line) => `${line.label}${line.name}`).join('、')
        : '动爻看变化，应期与关键转折';
    const changedText = result.movingLines.length ? result.changed?.name : '同本卦';
    const questionText = result.question
      ? `${result.question}${/[。！？!?]$/.test(result.question) ? '' : '。'}`
      : '未填写。';
    const card = (label, title, sub, type = '') => `
      <article class="mbp-liuyao-result-card ${type}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(title || '待定')}</strong>
        <small>${escapeHtml(sub || '')}</small>
      </article>
    `;
    box.innerHTML = `
      <div class="mbp-liuyao-result-grid">
        ${card('本卦', result.primary?.name, `第${result.primary?.no || '-'}卦 · 上${result.primary?.upper?.name || ''}下${result.primary?.lower?.name || ''}`, 'is-primary')}
        ${card('变卦', changedText, result.movingLines.length ? `第${result.changed?.no || '-'}卦 · 看事情转向` : '没有动爻，先按本卦判断')}
        ${card('动爻', movingText, movingDetail, result.movingLines.length ? 'is-moving' : '')}
      </div>
      <p class="mbp-liuyao-note">问事：${escapeHtml(questionText)}先看本卦定当前，动爻看变化，变卦看趋势。</p>
    `;
  }

  function syncDesktopLiuyaoProgress(count) {
    const progressText = $('#mbpLiuyaoProgressText');
    const progressBar = $('#mbpLiuyaoProgressBar');
    if (progressText) progressText.textContent = `${count} / 6`;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, count / 6 * 100))}%`;
    const hasQuestion = Boolean(String($('#mbpLiuyaoQuestion')?.value || desktopLiuyaoState.question || '').trim());
    document.querySelectorAll('[data-liuyao-step]').forEach((step) => {
      const key = step.dataset.liuyaoStep;
      step.classList.toggle('is-active',
        (key === 'question' && !hasQuestion)
        || (key === 'cast' && hasQuestion && count < 6)
        || (key === 'read' && count >= 6));
    });
  }

  function renderDesktopLiuyao() {
    const count = desktopLiuyaoState.casts.length;
    const status = $('#mbpLiuyaoStatus');
    const toss = $('#mbpLiuyaoToss');
    if (status) {
      status.classList.toggle('is-error', Boolean(desktopLiuyaoState.error));
      status.textContent = desktopLiuyaoState.error
        || (count >= 6 ? '已成卦，可看本卦、动爻、变卦。' : `已成 ${count}/6 爻，下一步投${desktopLiuyaoLineLabels[count]}。`);
    }
    if (toss) {
      toss.disabled = count >= 6;
      toss.textContent = count >= 6 ? '已成卦' : `投第 ${count + 1} 爻`;
    }
    syncDesktopLiuyaoProgress(count);
    renderDesktopLiuyaoCoins();
    renderDesktopLiuyaoStack();
    renderDesktopLiuyaoResult();
  }

  function openDesktopLiuyao(event) {
    if (event) event.preventDefault();
    desktopLiuyaoState.open = true;
    desktopLiuyaoState.error = '';
    const overlay = $('#mbpLiuyaoOverlay');
    if (overlay) overlay.hidden = false;
    renderDesktopLiuyao();
    setTimeout(() => $('#mbpLiuyaoQuestion')?.focus(), 0);
  }

  function closeDesktopLiuyao() {
    desktopLiuyaoState.open = false;
    const overlay = $('#mbpLiuyaoOverlay');
    if (overlay) overlay.hidden = true;
  }

  function resetDesktopLiuyao() {
    desktopLiuyaoQuestion();
    desktopLiuyaoState.casts = [];
    desktopLiuyaoState.lastCoins = [];
    desktopLiuyaoState.error = '';
    renderDesktopLiuyao();
  }

  function ensureDesktopLiuyaoQuestion() {
    if (desktopLiuyaoQuestion()) {
      desktopLiuyaoState.error = '';
      return true;
    }
    desktopLiuyaoState.error = '先写清楚一件事，再起卦。';
    renderDesktopLiuyao();
    $('#mbpLiuyaoQuestion')?.focus();
    return false;
  }

  function tossDesktopLiuyaoLine() {
    if (!ensureDesktopLiuyaoQuestion()) return;
    if (desktopLiuyaoState.casts.length >= 6) return;
    const cast = makeDesktopLiuyaoCast();
    desktopLiuyaoState.casts.push(cast);
    desktopLiuyaoState.lastCoins = cast.coins;
    renderDesktopLiuyao();
  }

  function autoDesktopLiuyao() {
    if (!ensureDesktopLiuyaoQuestion()) return;
    while (desktopLiuyaoState.casts.length < 6) {
      const cast = makeDesktopLiuyaoCast();
      desktopLiuyaoState.casts.push(cast);
      desktopLiuyaoState.lastCoins = cast.coins;
    }
    renderDesktopLiuyao();
  }

  function saveProfile() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.profile));
    } catch (_) {}
  }

  function bindEvents() {
    function renderChartFromProfile(profile) {
      showFormError('');
      state.profile = normalizeProfile(profile);
      const reusableRecordId = getReusableClientRecordId(state.profile);
      formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
      resetForProfileChange();
      state.chartRecordId = reusableRecordId || makeLocalId();
      state.chartReady = true;
      state.chartConfirmedKey = profileHistoryKey(state.profile);
      saveProfile();
      saveProfileToHistory(state.profile, { id: reusableRecordId || state.chartRecordId });
      updateForm();
      renderChart();
    }

    function stepChartHour(delta) {
      const profile = collectProfileFromForm();
      if (profile.error) {
        guideUserToBirthForm(profile.error);
        return;
      }
      const currentHour = Number(profile.hour) || 0;
      renderChartFromProfile({
        ...profile,
        hour: (currentHour + delta + 24) % 24,
      });
    }

    function invalidateChartFromFormEdit() {
      if (!state.chartReady && !state.chartConfirmedKey && !state.decoded) return;
      const currentProfile = collectProfileFromForm();
      if (!currentProfile.error && state.chartConfirmedKey && profileHistoryKey(currentProfile) === state.chartConfirmedKey) return;
      resetForProfileChange();
      renderChart();
    }

    $('#mbpBirthForm')?.addEventListener('input', invalidateChartFromFormEdit);
    $('#mbpBirthForm')?.addEventListener('change', invalidateChartFromFormEdit);

    $('#mbpClientToggle')?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleClientMenu('#mbpClientMenu', '#mbpClientToggle');
    });

    $('#mbpXuClientToggle')?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleClientMenu('#mbpXuClientMenu', '#mbpXuClientToggle');
    });

    $('#mbpClientList')?.addEventListener('click', (event) => {
      handleClientListClick(event);
    });

    $('#mbpXuClientList')?.addEventListener('click', (event) => {
      handleClientListClick(event);
    });

    $('#mbpClientSave')?.addEventListener('click', saveCurrentClientRecord);
    $('#mbpXuClientSave')?.addEventListener('click', saveCurrentClientRecord);

    $('#mbpClientNew')?.addEventListener('click', () => {
      startNewClientProfile();
    });

    $('#mbpXuClientNew')?.addEventListener('click', () => {
      startNewClientProfile();
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#mbpClientPicker') && !event.target.closest('#mbpXuClientPicker')) closeClientMenu();
    });

    document.querySelectorAll('.mbp-fc-card .fc-tab').forEach((button) => {
      button.addEventListener('click', () => {
        fcSwitchTab(button.dataset.tab || '先天卦');
      });
    });

    $('#mbpYijingAssist')?.addEventListener('click', (event) => {
      const timingButton = event.target.closest('[data-yijing-timing-toggle]');
      if (timingButton) {
        yijingTimingOpen = !yijingTimingOpen;
        renderYijingAssist();
        return;
      }

      const timingAiButton = event.target.closest('[data-yijing-timing-ai]');
      if (timingAiButton) {
        const result = fcActiveHexagram();
        generateYijingTimingReading(result);
        return;
      }

      const helpButton = event.target.closest('[data-yijing-help]');
      if (helpButton) {
        const note = $('#mbpYijingHelpNote');
        const text = helpButton.dataset.yijingHelp || '';
        if (note) {
          note.textContent = text;
          note.hidden = !text;
        }
        return;
      }
      const tabButton = event.target.closest('[data-yijing-tab]');
      if (tabButton) {
        const note = $('#mbpYijingHelpNote');
        if (note) note.hidden = true;
        fcSwitchTab(tabButton.dataset.yijingTab || '先天卦');
        return;
      }
      const ageButton = event.target.closest('[data-yijing-age]');
      if (ageButton) {
        fcActiveTab = '流年卦';
        fcRenderTabs();
        fcSelectYear(ageButton.dataset.yijingAge);
        return;
      }
    });

    $('#mbpFcScrollLeft')?.addEventListener('click', () => {
      $('#mbpFcLiunianScroll')?.scrollBy({ left: -100, behavior: 'smooth' });
    });
    $('#mbpFcScrollRight')?.addEventListener('click', () => {
      $('#mbpFcLiunianScroll')?.scrollBy({ left: 100, behavior: 'smooth' });
    });
    $('#mbpFcTimeUp')?.addEventListener('click', () => {
      stepChartHour(1);
    });
    $('#mbpFcTimeDown')?.addEventListener('click', () => {
      stepChartHour(-1);
    });

    document.querySelectorAll('.nf-gender-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $('#mbpGender').value = btn.dataset.v;
        document.querySelectorAll('.nf-gender-btn').forEach((item) => item.classList.toggle('active', item === btn));
        invalidateChartFromFormEdit();
      });
    });

    document.querySelectorAll('.nf-cal-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.dataset.cal || 'solar';
        setCalMode(nextMode, { autoDefaultLeap: nextMode === 'lunar' });
        invalidateChartFromFormEdit();
      });
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
        updateLunarLeapState({ autoDefault: true });
        updateDatePreview();
      });
      $(selector)?.addEventListener('input', () => {
        updateLunarLeapState({ autoDefault: true });
        updateDatePreview();
      });
    });
    $('#mbpLunarDay')?.addEventListener('change', updateDatePreview);
    $('#mbpLunarLeap')?.addEventListener('change', () => {
      updateLunarLeapState();
      updateDatePreview();
    });
    $('#mbpHour')?.addEventListener('change', updateTrueSolarPreview);
    $('#mbpMinute')?.addEventListener('change', updateTrueSolarPreview);

    $('#mbpUnknownTime')?.addEventListener('click', openShichenModal);
    $('#mbpShichenClose')?.addEventListener('click', closeShichenModal);
    $('#mbpShichenOverlay')?.addEventListener('click', (event) => {
      if (event.target.id === 'mbpShichenOverlay') closeShichenModal();
    });
    $('#mbpShichenCalc')?.addEventListener('click', renderShichenResult);
    $('#mbpShichenTimeQuick')?.addEventListener('click', (event) => {
      const detail = event.target.closest('[data-shichen-detail]');
      if (detail) {
        const groupKey = detail.closest('[data-shichen-card]')?.dataset?.shichenCard || $('#mbpVagueTime')?.dataset?.group || '';
        if (groupKey) setShichenTimeSelection(groupKey, detail.dataset.shichenDetail);
        return;
      }
      const button = event.target.closest('[data-shichen-time]');
      if (button) setShichenTimeSelection(button.dataset.shichenTime);
    });
    $('#mbpShichenTimeDetail')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-shichen-detail]');
      const groupKey = $('#mbpVagueTime')?.dataset?.group || '';
      if (button && groupKey) setShichenTimeSelection(groupKey, button.dataset.shichenDetail);
    });
    $('#mbpShichenBack')?.addEventListener('click', () => {
      $('#mbpShichenQuestions').hidden = false;
      $('#mbpShichenResult').hidden = true;
      $('#mbpShichenTimeQuick [data-shichen-time]')?.focus();
    });
    $('#mbpShichenCandidates')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-shichen-hour]');
      if (button) applyShichenCandidate(button);
    });

    document.querySelectorAll('[data-liuyao-open]').forEach((button) => {
      button.addEventListener('click', openDesktopLiuyao);
    });
    $('#mbpLiuyaoClose')?.addEventListener('click', closeDesktopLiuyao);
    $('#mbpLiuyaoOverlay')?.addEventListener('click', (event) => {
      if (event.target === $('#mbpLiuyaoOverlay')) closeDesktopLiuyao();
    });
    $('#mbpLiuyaoQuestion')?.addEventListener('input', () => {
      desktopLiuyaoState.question = $('#mbpLiuyaoQuestion')?.value || '';
      desktopLiuyaoState.error = '';
      renderDesktopLiuyao();
    });
    document.querySelectorAll('[data-liuyao-question]').forEach((button) => {
      button.addEventListener('click', () => {
        const textarea = $('#mbpLiuyaoQuestion');
        if (textarea) textarea.value = button.dataset.liuyaoQuestion || '';
        desktopLiuyaoState.question = textarea?.value || '';
        desktopLiuyaoState.error = '';
        renderDesktopLiuyao();
        textarea?.focus();
      });
    });
    $('#mbpLiuyaoToss')?.addEventListener('click', tossDesktopLiuyaoLine);
    $('#mbpLiuyaoAuto')?.addEventListener('click', autoDesktopLiuyao);
    $('#mbpLiuyaoReset')?.addEventListener('click', resetDesktopLiuyao);

    document.querySelectorAll('[data-city-scope]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setCityScope(btn.dataset.cityScope);
        $('#mbpCityDropdown').style.display = 'none';
        updateTrueSolarPreview();
      });
    });
    syncCityScopeUi();

    $('#mbpCitySearch')?.addEventListener('input', () => {
      const input = $('#mbpCitySearch');
      const dropdown = $('#mbpCityDropdown');
      const q = input.value.trim().toLowerCase();
      resetCityDeleteArmed(input);
      selectedCity = null;
      $('#mbpClearCity').style.display = q ? '' : 'none';
      $('#mbpCitySelected').style.display = 'none';
      if (!q) {
        dropdown.style.display = 'none';
        updateTrueSolarPreview();
        return;
      }
      const results = findCitySuggestionRows(q, cityScope, 12);
      if (!results.length) {
        dropdown.style.display = 'none';
        return;
      }
      dropdown.innerHTML = results.map((row, index) => {
        const city = cityFromRow(row);
        return `
        <div class="nf-city-item" data-index="${index}">
          <b>${escapeHtml(formatCityLabel(city))}</b>
          <span>${escapeHtml(formatCityTimeZoneLabelForForm(city))} · ${escapeHtml(formatGeoCoord(row[2], 'lon'))}, ${escapeHtml(formatGeoCoord(row[3], 'lat'))}</span>
        </div>
      `;
      }).join('');
      dropdown._mbpResults = results;
      dropdown.style.display = 'block';
      updateTrueSolarPreview();
    });

    $('#mbpCitySearch')?.addEventListener('keydown', (event) => {
      const input = event.currentTarget;
      const dropdown = $('#mbpCityDropdown');
      if ((event.key === 'Backspace' || event.key === 'Delete') && selectedCity && input.value) {
        event.preventDefault();
        if (cityDeleteArmed || cityInputFullySelected(input)) {
          clearCityField();
          return;
        }
        if (dropdown) dropdown.style.display = 'none';
        armCityDeletion(input);
        return;
      }
      if (event.key === 'Enter') {
        const city = applyFirstCitySuggestion({ hideDropdown: true });
        if (city) event.preventDefault();
      }
    });

    $('#mbpCityDropdown')?.addEventListener('click', (event) => {
      const item = event.target.closest('.nf-city-item');
      if (!item) return;
      const row = $('#mbpCityDropdown')._mbpResults?.[Number(item.dataset.index)];
      applySelectedCity(cityFromRow(row));
      $('#mbpCityDropdown').style.display = 'none';
    });

    $('#mbpClearCity')?.addEventListener('click', () => {
      clearCityField();
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#mbpCitySearch') && !event.target.closest('#mbpCityDropdown') && !event.target.closest('#mbpClearCity')) {
        applyFirstCitySuggestion({ hideDropdown: true });
        const dropdown = $('#mbpCityDropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    });

    function setAiGender(gender) {
      if (!gender) return;
      const value = gender === 'female' || gender === '女' ? 'female' : 'male';
      $('#mbpGender').value = value;
      document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.v === value));
    }

    function setAiCity(cityName) {
      const text = String(cityName || '').trim();
      if (!text) return;
      const city = findCity(text, 'global');
      if (city) {
        applySelectedCity(city);
        return;
      }
      selectedCity = null;
      const input = $('#mbpCitySearch');
      const clear = $('#mbpClearCity');
      const selected = $('#mbpCitySelected');
      if (input) input.value = text;
      if (clear) clear.style.display = '';
      if (selected) selected.style.display = 'none';
      updateTrueSolarPreview();
    }

    function aiNumber(value) {
      if (value === '' || value == null) return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    }

    function applyAiBirthData(data, options = {}) {
      if (!data) return;
      const calType = data.calType === 'lunar' ? 'lunar' : 'solar';
      const year = aiNumber(data.year);
      const month = aiNumber(data.month);
      const day = aiNumber(data.day);
      if (calType === 'lunar') {
        if (Number.isFinite(year)) $('#mbpLunarYear').value = year;
        if (Number.isFinite(month)) $('#mbpLunarMonth').value = month;
        refreshLunarDayOptions();
        if (Number.isFinite(day)) $('#mbpLunarDay').value = day;
        else if (options.clearMissing) $('#mbpLunarDay').value = '';
        $('#mbpLunarLeap').checked = !!data.isLeap;
        updateLunarLeapState();
      } else {
        if (Number.isFinite(year)) $('#mbpYear').value = year;
        if (Number.isFinite(month)) $('#mbpMonth').value = month;
        refreshDayOptions();
        if (Number.isFinite(day)) $('#mbpDay').value = day;
        else if (options.clearMissing) $('#mbpDay').value = '';
      }
      const hour = aiNumber(data.hour);
      const minute = aiNumber(data.minute);
      if (Number.isFinite(hour)) $('#mbpHour').value = Math.max(0, Math.min(23, hour));
      else if (options.clearMissing) $('#mbpHour').value = '';
      if (Number.isFinite(minute)) $('#mbpMinute').value = Math.max(0, Math.min(59, minute));
      else if (options.clearMissing) $('#mbpMinute').value = '';
      setAiGender(data.gender);
      if (options.clearMissing && !data.gender) {
        $('#mbpGender').value = '';
        document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.remove('active'));
      }
      setAiCity(data.city);
      if (options.clearMissing && !data.city) {
        applySelectedCity(null);
        const cityInput = $('#mbpCitySearch');
        if (cityInput) cityInput.value = '';
      }
      setCalMode(options.keepAiOpen ? 'ai' : calType);
      updateDatePreview();
      showFormError('');
    }

    function addMbpAiBubble(role, text) {
      const list = $('#mbpAiMessages');
      if (!list) return null;
      const div = document.createElement('div');
      div.className = `ai-msg ${role === 'user' ? 'ai-msg-user' : 'ai-msg-ai'}`;
      div.innerHTML = escapeHtml(text || '').replace(/\n/g, '<br>');
      list.appendChild(div);
      list.scrollTop = list.scrollHeight;
      return div;
    }

    function addMbpAiThinking() {
      const list = $('#mbpAiMessages');
      if (!list) return null;
      const div = document.createElement('div');
      div.className = 'ai-msg-thinking';
      div.textContent = '正在识别…';
      list.appendChild(div);
      list.scrollTop = list.scrollHeight;
      return div;
    }

    function setMbpAiBusy(on) {
      mbpAiBusy = !!on;
      const input = $('#mbpAiInput');
      const send = $('#mbpAiSend');
      if (input) input.disabled = mbpAiBusy;
      if (send) {
        send.disabled = mbpAiBusy;
        send.textContent = mbpAiBusy ? '识别中' : '发送';
      }
    }

    function setMbpAiTip(text) {
      const tip = $('#mbpAiTip');
      if (tip) tip.textContent = text;
    }

    function normalizeAiText(text) {
      return String(text || '')
        .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
        .replace(/[，。；、]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function chineseNumber(token) {
      const text = String(token || '').trim();
      if (!text) return null;
      if (/^\d+$/.test(text)) return Number(text);
      const alias = { 正: 1, 冬: 11, 腊: 12, 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
      if (alias[text] != null) return alias[text];
      if (text === '十') return 10;
      const teen = text.match(/^十([一二两三四五六七八九])$/);
      if (teen) return 10 + alias[teen[1]];
      const ten = text.match(/^([一二两三四五六七八九])十$/);
      if (ten) return alias[ten[1]] * 10;
      const mixed = text.match(/^([一二两三四五六七八九])十([一二两三四五六七八九])$/);
      if (mixed) return alias[mixed[1]] * 10 + alias[mixed[2]];
      const early = text.match(/^初([一二两三四五六七八九十])$/);
      if (early) return chineseNumber(early[1]);
      const late = text.match(/^廿([一二两三四五六七八九])?$/);
      if (late) return 20 + (late[1] ? alias[late[1]] : 0);
      const thirty = text.match(/^三十([一])?$/);
      if (thirty) return 30 + (thirty[1] ? 1 : 0);
      return null;
    }

    function normalizeAiYear(value) {
      const raw = String(value || '').trim();
      const year = Number(raw);
      if (!Number.isFinite(year)) return null;
      if (raw.length === 2) {
        const currentTwo = new Date().getFullYear() % 100;
        return year <= currentTwo ? 2000 + year : 1900 + year;
      }
      return year >= 1900 && year <= 2030 ? year : null;
    }

    function aiDataMissing(data) {
      const missing = [];
      if (data.year == null || !(Number(data.year) >= 1900 && Number(data.year) <= 2030)) missing.push('出生年份');
      if (data.month == null || !(Number(data.month) >= 1 && Number(data.month) <= 12)) missing.push('出生月份');
      if (data.day == null || !(Number(data.day) >= 1 && Number(data.day) <= 31)) missing.push('具体日期');
      if (data.hour == null || !(Number(data.hour) >= 0 && Number(data.hour) <= 23)) missing.push('出生时间');
      if (!data.gender) missing.push('性别');
      if (!String(data.city || '').trim()) missing.push('出生城市');
      return missing;
    }

    function finalizeAiDraft(data) {
      const out = { ...(data || {}) };
      if (out.minute == null && out.hour != null) out.minute = 0;
      out.missing = aiDataMissing(out);
      out.complete = out.missing.length === 0;
      return out;
    }

    function hasAiValue(field, value) {
      if (value == null || value === '') return false;
      if (field === 'year') return Number(value) >= 1900 && Number(value) <= 2030;
      if (field === 'month') return Number(value) >= 1 && Number(value) <= 12;
      if (field === 'day') return Number(value) >= 1 && Number(value) <= 31;
      if (field === 'hour') return Number(value) >= 0 && Number(value) <= 23;
      if (field === 'minute') return Number(value) >= 0 && Number(value) <= 59;
      if (field === 'gender') return value === 'male' || value === 'female' || value === '男' || value === '女';
      if (field === 'city') return String(value || '').trim().length > 0;
      if (field === 'calType') return value === 'solar' || value === 'lunar';
      return value != null && value !== '';
    }

    function mergeAiBirthData(base, patch) {
      const out = { ...(base || {}) };
      const data = patch || {};
      ['calType', 'year', 'month', 'day', 'hour', 'minute', 'gender', 'city'].forEach((field) => {
        if (hasAiValue(field, data[field])) out[field] = field === 'gender' ? (data[field] === '女' ? 'female' : data[field] === '男' ? 'male' : data[field]) : data[field];
      });
      if (data.isLeap != null) out.isLeap = !!data.isLeap;
      if (!out.calType) out.calType = 'solar';
      return finalizeAiDraft(out);
    }

    function describeAiKnown(data) {
      const parts = [];
      if (data.year) parts.push(`${data.year}年`);
      if (data.month) parts.push(`${data.month}月`);
      if (data.day) parts.push(`${data.day}日`);
      if (data.hour != null) parts.push(`${pad2(data.hour)}:${pad2(data.minute || 0)}`);
      if (data.gender) parts.push(data.gender === 'female' ? '女' : '男');
      if (data.city) parts.push(data.city);
      return parts.join('，');
    }

    function buildAiReply(data, remoteReply, localHadValue) {
      if (data.complete) return remoteReply && !/我还差|还需要|可以这样发/.test(remoteReply) ? remoteReply : '已识别完整，已填入表单，请核对后开始排盘。';
      const known = describeAiKnown(data);
      const missing = (data.missing || []).slice(0, 4).join('、');
      if (known || localHadValue) return `已识别：${known || '部分信息'}。还差：${missing}。`;
      return remoteReply || '我还需要出生年月日、具体时间、性别和出生城市。';
    }

    function normalizeAiHour(hour, raw) {
      let value = chineseNumber(hour);
      if (!Number.isFinite(value)) return null;
      if (/下午|晚上|夜里|傍晚|晚间|pm/i.test(raw) && value >= 1 && value <= 11) value += 12;
      if (/凌晨|早上|上午|清晨|am/i.test(raw) && value === 12) value = 0;
      if (value === 24) value = 0;
      return value >= 0 && value <= 23 ? value : null;
    }

    function localAiBirthFallback(rawText) {
      const text = normalizeAiText(rawText);
      const nums = text.match(/\d{1,4}/g) || [];
      const dateParts = text.match(/((?:19|20)?\d{2})\s*[-/.]\s*(\d{1,2})(?:\s*[-/.]\s*(\d{1,2}))?/);
      const yearToken = dateParts?.[1]
        || text.match(/((?:19|20)\d{2})\s*年?/)?.[1]
        || text.match(/(?:^|[^\d])(\d{2})\s*年/)?.[1]
        || text.match(/(?:^|[^\d])(\d{2})\s*(?:年生|出生|生人)/)?.[1];
      const year = normalizeAiYear(yearToken);
      const yearIndex = yearToken ? nums.findIndex((num) => num === yearToken) : -1;
      const monthToken = dateParts?.[2]
        || text.match(/(\d{1,2})\s*(?:月|月份)/)?.[1]
        || text.match(/([正冬腊一二两三四五六七八九十]{1,3})\s*月/)?.[1]
        || (yearIndex >= 0 ? nums[yearIndex + 1] : null);
      const dayToken = dateParts?.[3]
        || text.match(/(\d{1,2})\s*(?:日|号)/)?.[1]
        || text.match(/(?:月|月份)\s*([初廿一二两三四五六七八九十]{1,3})/)?.[1]
        || (yearIndex >= 0 ? nums[yearIndex + 2] : null);
      const month = chineseNumber(monthToken);
      const day = chineseNumber(dayToken);
      const timeMatch = text.match(/(?:^|[^\d])(\d{1,2}|[零〇一二两三四五六七八九十]{1,3})\s*(?:点|时|:|：)\s*(?:(半|一刻|三刻)|(\d{1,2})\s*分?|([零〇一二两三四五六七八九十]{1,3})\s*分?)?/);
      const shichen = text.match(/([子丑寅卯辰巳午未申酉戌亥])时/);
      const shichenHour = shichen ? { 子: 23, 丑: 1, 寅: 3, 卯: 5, 辰: 7, 巳: 9, 午: 11, 未: 13, 申: 15, 酉: 17, 戌: 19, 亥: 21 }[shichen[1]] : null;
      const hour = timeMatch ? normalizeAiHour(timeMatch[1], text) : null;
      let minute = null;
      if (timeMatch?.[2] === '半') minute = 30;
      else if (timeMatch?.[2] === '一刻') minute = 15;
      else if (timeMatch?.[2] === '三刻') minute = 45;
      else if (timeMatch?.[3] != null) minute = Math.max(0, Math.min(59, Number(timeMatch[3])));
      else if (timeMatch?.[4] != null) minute = Math.max(0, Math.min(59, chineseNumber(timeMatch[4]) || 0));
      else if (hour != null || shichenHour != null) minute = 0;
      const gender = /女|女生|女孩|女命|女士/.test(text) ? 'female' : (/男|男生|男孩|男命|先生/.test(text) ? 'male' : null);
      const city = findCity(text);
      const data = {
        complete: false,
        calType: /农历|阴历|lunar|yinli/i.test(text) ? 'lunar' : (/公历|阳历|solar/i.test(text) ? 'solar' : null),
        year,
        month,
        day,
        hour: hour != null ? hour : shichenHour,
        minute,
        gender,
        city: city ? formatCityLabel(city) : '',
        isLeap: /闰/.test(text),
      };
      return finalizeAiDraft(data);
    }

    async function callMbpAiChat(messages) {
      if (typeof fetch !== 'function') throw new Error('fetch unavailable');
      const controller = typeof AbortController === 'function' ? new AbortController() : null;
      const timer = setTimeout(() => { if (controller) controller.abort(); }, 45000);
      try {
        fetch(`${aiBackendBase}/api/ping`).catch(() => {});
        const response = await fetch(`${aiBackendBase}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
          signal: controller ? controller.signal : undefined,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        if (!json || !json.ok) throw new Error(json?.error || 'AI识别失败');
        return json.data;
      } finally {
        clearTimeout(timer);
      }
    }

    async function applyAiText() {
      const input = $('#mbpAiInput');
      const text = String(input?.value || '').trim();
      if (!text || mbpAiBusy) return;
      input.value = '';
      addMbpAiBubble('user', text);
      mbpAiHistory.push({ role: 'user', content: text });
      const localData = localAiBirthFallback(text);
      mbpAiDraft = mergeAiBirthData(mbpAiDraft, localData);
      setMbpAiBusy(true);
      setMbpAiTip('正在调用 AI 识别出生信息…');
      const thinking = addMbpAiThinking();
      let remoteData = null;
      try {
        remoteData = await callMbpAiChat(mbpAiHistory.slice());
      } catch (_) {
        remoteData = null;
      } finally {
        if (thinking) thinking.remove();
        setMbpAiBusy(false);
      }
      const data = mergeAiBirthData(mbpAiDraft, remoteData);
      mbpAiDraft = data;
      const localHadValue = describeAiKnown(localData).length > 0;
      const reply = buildAiReply(data, remoteData?.reply, localHadValue);
      addMbpAiBubble('ai', reply);
      mbpAiHistory.push({ role: 'assistant', content: reply });
      applyAiBirthData(data, { keepAiOpen: !data?.complete, clearMissing: true });
      setMbpAiTip(data?.complete ? '已填入表单，请核对后点击开始排盘。' : '继续补充缺失信息，AI会结合上文继续识别。');
      if (!data?.complete) $('#mbpAiInput')?.focus();
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
      const reusableRecordId = getReusableClientRecordId(state.profile);
      formCalMode = profile.isLunar ? 'lunar' : 'solar';
      resetAiContent();
      state.chart = null;
      state.chartKey = '';
      state.chartRecordId = reusableRecordId || makeLocalId();
      state.norm = null;
      state.chartReady = true;
      state.chartConfirmedKey = profileHistoryKey(profile);
      state.decoded = false;
      state.aiResults = {};
      state.luckAiResults = {};
      state.xiaoLianAiResults = {};
      state.selectedLuckRangeKey = '';
      state.selectedXiaoLianAge = '';
      state.batchDecoding = false;
      document.body.classList.remove('is-decoded');
      saveProfile();
      saveProfileToHistory(state.profile, { id: reusableRecordId || state.chartRecordId });
      renderChart();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
      $('#chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#mbpDecodeBtn')?.addEventListener('click', decodeReports);

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

    $('#report')?.addEventListener('click', async (event) => {
      if (handleCurvePanelClick(event)) return;
      const allButton = event.target.closest('[data-decode-all]');
      if (allButton) {
        await decodeReports();
        return;
      }
      const decadeButton = event.target.closest('[data-luck-decade]');
      if (decadeButton) {
        state.selectedLuckRangeKey = decadeButton.dataset.luckDecade || '';
        fcRenderLuckLocator();
        const info = selectedLuckInfo({ readonly: true });
        if (info.selected?.branch) fcRenderHighlight(info.selected.branch);
        renderChaptersFromAi();
        return;
      }
      const xiaoLianAgeButton = event.target.closest('[data-xiaolian-age]');
      if (xiaoLianAgeButton) {
        state.selectedXiaoLianAge = clampXiaoLianAge(xiaoLianAgeButton.dataset.xiaolianAge);
        fcActiveTab = '流年卦';
        fcRenderTabs();
        fcSelectYear(state.selectedXiaoLianAge);
        renderChaptersFromAi();
        return;
      }
      const moduleButton = event.target.closest('[data-report-module]');
      if (moduleButton) {
        await decodeSingleModule(moduleButton.dataset.reportModule);
        return;
      }
      const actionButton = event.target.closest('[data-report-action]');
      if (!actionButton) return;
      actionButton.disabled = true;
      actionButton.classList.add('is-running');
      try {
        if (actionButton.dataset.reportAction === 'curve') await decodeSingleModule('life_curve');
        if (actionButton.dataset.reportAction === 'specials') await decodeSpecialChapter();
      } finally {
        actionButton.disabled = false;
        actionButton.classList.remove('is-running');
      }
    });

    $('#mbpLuckDecadeSelect')?.addEventListener('change', (event) => {
      state.selectedLuckRangeKey = event.target.value || '';
      const info = selectedLuckInfo();
      fcRenderLuckLocator();
      if (info.selected?.branch) fcRenderHighlight(info.selected.branch);
      refreshReportSelectionViews();
    });

    $('#mbpXiaoLianToggle')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const toggle = event.currentTarget;
      const menu = $('#mbpXiaoLianMenu');
      if (!menu || toggle.disabled) return;
      const opening = menu.hidden;
      menu.hidden = !opening;
      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (opening) {
        requestAnimationFrame(() => {
          const selected = menu.querySelector('.is-selected') || menu.querySelector('.is-current');
          if (!selected) {
            menu.scrollTop = 0;
            return;
          }
          menu.scrollTop = selected.offsetTop - ((menu.clientHeight - selected.offsetHeight) / 2);
        });
      }
    });

    $('#mbpXiaoLianMenu')?.addEventListener('click', (event) => {
      const option = event.target.closest('[data-xiaolian-option]');
      if (!option) return;
      event.preventDefault();
      event.stopPropagation();
      const age = clampXiaoLianAge(option.dataset.xiaolianOption);
      $('#mbpXiaoLianMenu').hidden = true;
      $('#mbpXiaoLianToggle')?.setAttribute('aria-expanded', 'false');
      fcLocateXiaoLianAge(age);
      refreshReportSelectionViews();
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('#mbpXiaoLianToggle, #mbpXiaoLianMenu')) return;
      const menu = $('#mbpXiaoLianMenu');
      if (menu) menu.hidden = true;
      $('#mbpXiaoLianToggle')?.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const menu = $('#mbpXiaoLianMenu');
      if (menu) menu.hidden = true;
      $('#mbpXiaoLianToggle')?.setAttribute('aria-expanded', 'false');
    });

    $('#mbpExportPdf')?.addEventListener('click', downloadMingbookPdf);

    $('#mbpAuthTrigger')?.addEventListener('click', () => {
      openDesktopAuth(desktopAuthState.session?.user ? desktopAuthState.mode : 'login');
    });
    $('#mbpMemberPayTrigger')?.addEventListener('click', () => openDesktopMemberPayment());
    $('#mbpAuthClose')?.addEventListener('click', closeDesktopAuth);
    $('#mbpAuthOverlay')?.addEventListener('click', (event) => {
      if (event.target === $('#mbpAuthOverlay') && !desktopAuthState.loading) closeDesktopAuth();
    });
    $('#mbpPayClose')?.addEventListener('click', closeDesktopPayment);
    $('#mbpPayOverlay')?.addEventListener('click', (event) => {
      if (event.target === $('#mbpPayOverlay') && !desktopPaymentState.loading) closeDesktopPayment();
    });
    $('#mbpRefundTicketOpen')?.addEventListener('click', openDesktopRefundTicket);
    $('#mbpRefundTicketClose')?.addEventListener('click', closeDesktopRefundTicket);
    $('#mbpRefundTicketOverlay')?.addEventListener('click', (event) => {
      if (event.target === $('#mbpRefundTicketOverlay') && !desktopRefundTicketState.loading) closeDesktopRefundTicket();
    });
    $('#mbpRefundTicketReload')?.addEventListener('click', loadDesktopRefundOrders);
    $('#mbpRefundTicketSubmit')?.addEventListener('click', submitDesktopRefundTicket);
    $('#mbpRefundTicketOrder')?.addEventListener('change', (event) => {
      desktopRefundTicketState.orderNo = event.target.value || '';
      syncDesktopRefundTicketFromOrder();
      desktopRefundTicketState.error = '';
      renderDesktopRefundTicket();
    });
    $('#mbpRefundTicketProvider')?.addEventListener('change', (event) => {
      desktopRefundTicketState.paymentProvider = event.target.value || 'wechat';
    });
    $('#mbpRefundTicketPaidDate')?.addEventListener('input', (event) => {
      desktopRefundTicketState.paidDate = event.target.value || '';
    });
    $('#mbpRefundTicketContact')?.addEventListener('input', (event) => {
      desktopRefundTicketState.contact = event.target.value || '';
    });
    $('#mbpRefundTicketNote')?.addEventListener('input', (event) => {
      desktopRefundTicketState.note = event.target.value || '';
    });
    $('#mbpRefundTicketScreenshot')?.addEventListener('change', (event) => {
      const file = event.target.files?.[0] || null;
      if (file) handleDesktopRefundScreenshot(file);
    });
    document.querySelectorAll('.mbp-pay-method').forEach((button) => {
      button.addEventListener('click', () => {
        const provider = button.dataset.provider || 'wechat';
        const meta = getDesktopPaymentProviderMeta(provider);
        if (!meta.enabled || desktopPaymentState.status === 'pending') return;
        desktopPaymentState.provider = provider;
        desktopPaymentState.error = '';
        desktopPaymentState.message = '权益绑定当前账号，电脑和手机共用。';
        renderDesktopPayment();
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && desktopAuthState.open && !desktopAuthState.loading) closeDesktopAuth();
      if (event.key === 'Escape' && desktopPaymentState.open && !desktopPaymentState.loading) closeDesktopPayment();
      if (event.key === 'Escape' && desktopRefundTicketState.open && !desktopRefundTicketState.loading) closeDesktopRefundTicket();
      if (event.key === 'Escape' && desktopLiuyaoState.open) closeDesktopLiuyao();
    });
    document.querySelectorAll('[data-auth-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        if (desktopAuthState.loading) return;
        desktopAuthState.mode = button.dataset.authMode === 'register' ? 'register' : 'login';
        desktopAuthState.error = '';
        renderDesktopAuth();
        focusDesktopAuthField();
      });
    });
    $('#mbpAuthSubmit')?.addEventListener('click', submitDesktopAuth);
    $('#mbpAuthGoogle')?.addEventListener('click', startDesktopGoogleLogin);
    $('#mbpAuthMemberPay')?.addEventListener('click', () => {
      closeDesktopAuth();
      openDesktopMemberPayment();
    });
    $('#mbpPayPrimary')?.addEventListener('click', handleDesktopPayPrimary);
    $('#mbpPayRefresh')?.addEventListener('click', checkDesktopPaymentStatus);
    $('#mbpPayOpenLink')?.addEventListener('click', () => {
      desktopPaymentState.message = `${getDesktopPaymentProviderLabel()}已打开，支付完成后请返回刷新状态。`;
      renderDesktopPayment();
    });
    $('#mbpAuthPassword')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitDesktopAuth();
      }
    });
    $('#mbpAuthChangeAccount')?.addEventListener('click', () => signOutDesktopAuth({ reopen: true }));
    $('#mbpAuthLogout')?.addEventListener('click', () => signOutDesktopAuth());

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
    window.addEventListener('resize', () => {
      requestAnimationFrame(() => fcRenderSanfangLines(fcActiveBranch));
    });
    syncReportNav();
  }

  updateForm();
  renderDesktopAuth();
  renderDesktopPayment();
  bindEvents();
  renderChart();
  bootDesktopAuth();
  hydrateCustomerRecordsFromRemote({ rerender: true });
}());

