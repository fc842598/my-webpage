(function () {
  const storageKey = 'yt_mingbook_onepage_profile_v1';
  const legacyHistoryKey = 'yt_zw_history_v1';
  const chartHistoryKey = 'ziwei_local_chart_history_v1';
  const html2PdfUrl = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
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
    chartRecordId: '',
    norm: null,
    chartReady: false,
    chartConfirmedKey: '',
    decoded: false,
    aiResults: {},
    curveGenerated: false,
    adviceGenerated: false,
  };
  let formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
  let selectedCity = null;
  let clientRecordsCache = [];
  let html2PdfPromise = null;
  let inputGuideTimer = null;
  let mbpAiHistory = [];
  let mbpAiBusy = false;
  let mbpAiDraft = {};
  const aiBackendBase = ((window.SITE_CONFIG && window.SITE_CONFIG.aiBackendBase) || 'https://ai-piming-backend-production.up.railway.app').replace(/\/$/, '');
  const desktopSupabaseUrl = 'https://jmmlijqeexdbxgpfyhgf.supabase.co';
  const desktopSupabaseKey = 'sb_publishable_Y2W9eDscfJwK1sgSitbmFA_ta5btvaR';
  const desktopGoogleRedirectBridge = 'https://fc842598.github.io/my-webpage/pages/mingbook-onepage.html';
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
  let desktopAuthClient = null;
  let desktopAuthReadyPromise = null;
  let desktopAuthListenerAttached = false;

  const aiTasks = [
    { module: 'overall', label: '整体批命' },
    { module: 'current_luck', label: '大限流年' },
    { module: 'shengong', key: 'body', label: '身宫批命' },
    { module: 'hunyin', key: 'marriage', label: '婚姻批命' },
    { module: 'jiankang', key: 'health', label: '健康批命' },
    { module: 'caiyun', key: 'wealth', label: '财运批命' },
    { module: 'shiye', key: 'career', label: '事业批命' },
  ];

  const chapterActions = [
    { label: '单独批总局', module: 'overall' },
    { label: '单独批专题', action: 'specials' },
    { label: '单独批走势', module: 'current_luck' },
    { label: '生成曲线', action: 'curve' },
    { label: '生成建议', module: 'overall' },
  ];

  function chapterActionButton(index) {
    const action = chapterActions[index];
    if (!action) return '';
    const attr = action.module
      ? `data-report-module="${escapeHtml(action.module)}"`
      : `data-report-action="${escapeHtml(action.action)}"`;
    return `
      <div class="mbp-report-actions">
        <button class="mbp-chapter-ai-btn" type="button" ${attr}>${escapeHtml(action.label)}</button>
        <span class="mbp-reading-badge">阅读中</span>
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

  function getDesktopAuthClient() {
    if (desktopAuthClient) return desktopAuthClient;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    desktopAuthClient = window.supabase.createClient(desktopSupabaseUrl, desktopSupabaseKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
      },
    });
    return desktopAuthClient;
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

  function getDesktopAuthHashSessionPayload() {
    const accessToken = getDesktopAuthCallbackValue('access_token');
    if (!accessToken) return null;
    const refreshToken = getDesktopAuthCallbackValue('refresh_token');
    if (!refreshToken) throw new Error('Google 登录信息不完整，请重新登录');
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  function clearDesktopAuthCallbackUrl() {
    const params = new URLSearchParams(window.location.search);
    desktopAuthUrlKeys.forEach((key) => params.delete(key));
    const query = params.toString();
    const hash = hasDesktopAuthParams(window.location.hash) ? '' : window.location.hash;
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${hash || ''}`);
  }

  function getDesktopGoogleRedirectUrl() {
    if (window.location.hostname === 'yuetianai.com') return desktopGoogleRedirectBridge;
    return new URL(window.location.pathname, window.location.origin).toString();
  }

  function attachDesktopAuthListener(client) {
    if (desktopAuthListenerAttached || !client?.auth?.onAuthStateChange) return;
    desktopAuthListenerAttached = true;
    client.auth.onAuthStateChange((_event, session) => {
      desktopAuthState.session = session || null;
      if (!session?.user) desktopAuthState.quota = null;
      renderDesktopAuth();
      updateDesktopQuotaDisplay();
      if (session?.user) hydrateDesktopMemberStatus({ force: true });
    });
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

  async function getDesktopAuthSession(options = {}) {
    if (desktopAuthState.session && !options.force) return desktopAuthState.session;
    const client = getDesktopAuthClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      desktopAuthState.session = data?.session || null;
      return desktopAuthState.session;
    } catch (_) {
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

  function updateDesktopQuotaDisplay(quota) {
    if (quota) {
      desktopAuthState.quota = {
        ...(desktopAuthState.quota || {}),
        ...quota,
      };
    }
    const loggedIn = !!desktopAuthState.session?.user;
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

    const daily = $('#mbpAuthQuotaDaily');
    if (daily) {
      const remaining = desktopAuthState.quota?.dailyRemaining ?? '--';
      const limit = desktopAuthState.quota?.dailyLimit ?? '--';
      daily.textContent = `${remaining}/${limit}`;
    }
    const monthly = $('#mbpAuthQuotaMonthly');
    if (monthly) {
      const remaining = desktopAuthState.quota?.monthlyRemaining ?? '--';
      const limit = desktopAuthState.quota?.monthlyLimit ?? '--';
      monthly.textContent = `${remaining}/${limit}`;
    }
    const badge = $('#mbpAuthSessionBadge');
    if (badge) badge.textContent = desktopAuthState.quota?.isMember ? '会员' : '账号';
  }

  window._updateQuotaDisplay = updateDesktopQuotaDisplay;

  function renderDesktopAuth() {
    const loggedIn = !!desktopAuthState.session?.user;
    const trigger = $('#mbpAuthTrigger');
    if (trigger) {
      trigger.classList.toggle('is-logged-in', loggedIn);
      trigger.setAttribute('aria-expanded', desktopAuthState.open ? 'true' : 'false');
      trigger.disabled = desktopAuthState.loading;
    }
    const triggerLabel = $('#mbpAuthTriggerLabel');
    if (triggerLabel) triggerLabel.textContent = loggedIn ? shortenDesktopAuthLabel(getDesktopAuthUserLabel()) : '登录/注册';
    const triggerMeta = $('#mbpAuthTriggerMeta');
    if (triggerMeta) triggerMeta.textContent = loggedIn ? '电脑端已登录' : '电脑端账号';

    const overlay = $('#mbpAuthOverlay');
    if (overlay) overlay.hidden = !desktopAuthState.open;
    document.body.classList.toggle('mbp-auth-open', desktopAuthState.open);

    const sessionCard = $('#mbpAuthSessionCard');
    const formWrap = $('#mbpAuthFormWrap');
    if (sessionCard) sessionCard.hidden = !loggedIn;
    if (formWrap) formWrap.hidden = loggedIn;

    const title = $('#mbpAuthTitle');
    if (title) title.textContent = loggedIn ? '电脑端账号' : (desktopAuthState.mode === 'register' ? '电脑端注册' : '电脑端登录');

    if (loggedIn) {
      const label = getDesktopAuthUserLabel();
      const sessionLabel = $('#mbpAuthSessionLabel');
      if (sessionLabel) sessionLabel.textContent = shortenDesktopAuthLabel(label) || '已登录';
      const sessionMeta = $('#mbpAuthSessionMeta');
      if (sessionMeta) sessionMeta.textContent = '电脑端与手机端共用同一账号状态';
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
      if (google) google.disabled = desktopAuthState.loading;
      const note = $('#mbpAuthNote');
      if (note) note.textContent = isRegister
        ? '注册后会直接登录，同一账号可在电脑端和手机端共用。'
        : '电脑端登录后，账号状态会和手机端保持连通。';
    }

    ['#mbpAuthClose', '#mbpAuthLogout', '#mbpAuthChangeAccount'].forEach((selector) => {
      const el = $(selector);
      if (el) el.disabled = desktopAuthState.loading;
    });

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
    if (!options.noAuth) {
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
      return data;
    } catch (_) {
      return null;
    }
  }

  async function submitDesktopAuth() {
    const client = getDesktopAuthClient();
    if (!client) {
      setDesktopAuthError('登录组件加载失败，请刷新后重试');
      return;
    }
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
      if (desktopAuthState.mode === 'register') {
        await desktopFetchJson('/api/auth/register-phone', {
          method: 'POST',
          body: { phone: account, password },
          noAuth: true,
        }).catch((error) => {
          if (!/已注册|already|exists/i.test(error.message || '')) throw error;
        });
      }
      const signed = await client.auth.signInWithPassword({ email, password });
      if (signed.error) throw signed.error;
      desktopAuthState.session = signed.data?.session || null;
      desktopAuthState.error = '';
      $('#mbpAuthAccount').value = '';
      $('#mbpAuthPassword').value = '';
      closeDesktopAuth();
      await hydrateDesktopMemberStatus({ force: true });
      if (typeof window._chatPanelRefresh === 'function' && window._chartRecordId) window._chatPanelRefresh();
    } catch (error) {
      setDesktopAuthError(error.message || '登录失败');
    } finally {
      desktopAuthState.loading = false;
      renderDesktopAuth();
    }
  }

  async function signOutDesktopAuth(options = {}) {
    const client = getDesktopAuthClient();
    desktopAuthState.loading = true;
    renderDesktopAuth();
    try {
      if (client?.auth?.signOut) await client.auth.signOut();
      desktopAuthState.session = null;
      desktopAuthState.quota = null;
      desktopAuthState.mode = 'login';
      desktopAuthState.error = '';
      desktopAuthState.open = !!options.reopen;
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
    const client = getDesktopAuthClient();
    if (!client) {
      setDesktopAuthError('登录组件加载失败，请刷新后重试');
      return;
    }
    desktopAuthState.loading = true;
    desktopAuthState.error = '';
    renderDesktopAuth();
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: getDesktopGoogleRedirectUrl() },
      });
      if (error) throw error;
    } catch (error) {
      desktopAuthState.loading = false;
      setDesktopAuthError(error.message || 'Google 登录失败，请稍后重试');
      renderDesktopAuth();
    }
  }

  async function consumeDesktopAuthCallback() {
    const error = getDesktopAuthCallbackError();
    if (error) throw new Error(error);
    const client = getDesktopAuthClient();
    if (!client) throw new Error('登录组件加载失败，请刷新后重试');
    attachDesktopAuthListener(client);
    const hashSession = getDesktopAuthHashSessionPayload();
    if (hashSession) {
      if (typeof client.auth.setSession !== 'function') throw new Error('登录组件版本过旧，请刷新后重试');
      const settled = await client.auth.setSession(hashSession);
      if (settled.error) throw settled.error;
      desktopAuthState.session = settled.data?.session || null;
      return desktopAuthState.session || getDesktopAuthSession({ force: true });
    }
    const code = getDesktopAuthCallbackValue('code');
    if (code && typeof client.auth.exchangeCodeForSession === 'function') {
      const exchanged = await client.auth.exchangeCodeForSession(code);
      if (exchanged.error) throw exchanged.error;
      desktopAuthState.session = exchanged.data?.session || null;
      return desktopAuthState.session;
    }
    return getDesktopAuthSession({ force: true });
  }

  async function initDesktopAuth() {
    if (desktopAuthReadyPromise) return desktopAuthReadyPromise;
    const client = getDesktopAuthClient();
    if (!client) {
      renderDesktopAuth();
      return null;
    }
    desktopAuthReadyPromise = client.auth.getSession().then(({ data }) => {
      desktopAuthState.session = data?.session || null;
      renderDesktopAuth();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
      attachDesktopAuthListener(client);
      return desktopAuthState.session;
    }).catch(() => null);
    return desktopAuthReadyPromise;
  }

  async function bootDesktopAuth() {
    if (!isDesktopAuthCallbackUrl()) {
      await initDesktopAuth();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
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
    state.chartRecordId = '';
    state.norm = null;
    state.chartReady = false;
    state.chartConfirmedKey = '';
    state.decoded = false;
    state.aiResults = {};
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

  function fcClampAge(age) {
    const num = Math.floor(Number(age) || 1);
    return Math.max(1, Math.min(fcMaxAge(), num));
  }

  function fcAgeToYear(age) {
    return fcSequenceStartYear + fcClampAge(age) - 1;
  }

  function fcCurrentVirtualAge() {
    const curYear = new Date().getFullYear();
    const startYear = Number(fcSequenceStartYear) || Number(fcBirthYear) || Number(state.profile.year) || curYear;
    return fcClampAge(curYear - startYear + 1);
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

  function fcBranchRect(branch) {
    const grid = $('#mbpChartGrid');
    const cellId = fcBranchId[branch];
    const cell = cellId ? document.getElementById(cellId) : null;
    if (!grid || !cell) return null;
    const gridRect = grid.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    if (!gridRect.width || !gridRect.height) return null;

    return {
      left: ((cellRect.left - gridRect.left) / gridRect.width) * 100,
      right: ((cellRect.right - gridRect.left) / gridRect.width) * 100,
      top: ((cellRect.top - gridRect.top) / gridRect.height) * 100,
      bottom: ((cellRect.bottom - gridRect.top) / gridRect.height) * 100,
      cx: ((cellRect.left + cellRect.width / 2 - gridRect.left) / gridRect.width) * 100,
      cy: ((cellRect.top + cellRect.height / 2 - gridRect.top) / gridRect.height) * 100,
    };
  }

  function fcEdgePointToward(from, to) {
    if (!from || !to) return null;
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    if (!dx && !dy) return { x: from.cx, y: from.cy };
    const halfW = Math.max(.01, (from.right - from.left) / 2);
    const halfH = Math.max(.01, (from.bottom - from.top) / 2);
    const scaleX = dx ? halfW / Math.abs(dx) : Infinity;
    const scaleY = dy ? halfH / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);
    const x = from.cx + dx * scale;
    const y = from.cy + dy * scale;
    return {
      x: Math.max(from.left, Math.min(from.right, x)),
      y: Math.max(from.top, Math.min(from.bottom, y)),
    };
  }

  function fcSanfangSegment(from, to) {
    const start = fcEdgePointToward(from, to);
    const end = fcEdgePointToward(to, from);
    if (!start || !end) return null;
    return { start, end, d: `M ${start.x} ${start.y} L ${end.x} ${end.y}` };
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
    const sanheRects = sanheBranches.map(fcBranchRect);
    const oppositeRect = fcBranchRect(oppositeBranch);
    if (sanheRects.some((rect) => !rect) || !oppositeRect) {
      fcClearSanfangLines(svg);
      return;
    }

    const [r0, r1, r2] = sanheRects;
    const sanheSegments = [
      fcSanfangSegment(r0, r1),
      fcSanfangSegment(r1, r2),
      fcSanfangSegment(r2, r0),
    ].filter(Boolean);
    const oppositeSegment = fcSanfangSegment(r0, oppositeRect);
    svg.querySelector('.fc-sanfang-triangle')?.setAttribute('d', sanheSegments.map((segment) => segment.d).join(' '));
    svg.querySelector('.fc-sanfang-opposite')?.setAttribute('d', oppositeSegment?.d || '');
    const points = svg.querySelector('.fc-sanfang-points');
    if (points) {
      points.innerHTML = [...sanheSegments.flatMap((segment) => [segment.start, segment.end]), ...(oppositeSegment ? [oppositeSegment.start, oppositeSegment.end] : [])]
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
      fcLoadYearly(fcAgeToYear(fcActiveAge));
      fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
      $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;
    }
    fcRenderTabs();
    if (fcActiveTab === '流年卦') fcRenderLiunianScroll();
    fcRenderHexagram();
    renderZipingFooter();
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
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

  function yijingMasterText(result, tab = fcActiveTab) {
    const entry = fcMasterEntry(result);
    if (!entry) return '';
    return entry[fcGuaciKey(tab)] || entry.summary || '';
  }

  function yijingAssistSummary(result) {
    if (!result) return '排盘后，这里会落出先天、后天与流年的辅助判断。';
    if (fcActiveTab === '先天卦') return `${result.name}落在先天位，主看命盘底色、根气与早年基调。`;
    if (fcActiveTab === '后天卦') return `${result.name}落在后天位，主看中后段转化、选择与修正方向。`;
    return `${result.name}落在${fcActiveAge}岁流年位，主看当下应期与这一年的动静。`;
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

  function yijingReadableSentence(text, fallback = '') {
    const source = cleanYijingReadingText(text).replace(/\s+/g, ' ').trim();
    if (!source) return fallback;
    const match = source.match(/^(.{14,96}?[。！？；])/);
    return match ? match[1] : source.slice(0, 88);
  }

  function yijingImageReadingHtml(result, text, summary = '') {
    if (!result) return '排盘后显示读图要点。';
    const originalLines = [...String(text || '').matchAll(/原句[:：]\s*([^\n]+)/g)]
      .map((match) => match[1].trim())
      .filter(Boolean)
      .slice(0, 3);
    const source = cleanYijingReadingText(text || summary);
    const sentence = yijingReadableSentence(
      source.replace(/原句[:：]\s*[^\n]+/g, '').replace(/\n/g, ' '),
      `${result.name}先看图中主象，再看它落在${yijingMasterLabel()}位时被哪类人事触发。`
    );
    const lead = originalLines.length
      ? `图中先取「${originalLines.join('、')}」这些象。`
      : `图中先看「${result.name}」的主象。`;
    return `<strong>海厦读图要点</strong>${escapeHtml(lead + sentence)}`;
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
    const caption = $('#mbpYijingImageCaption');
    const imageUrl = yijingImageUrl(result);

    if (title) title.textContent = result?.name || '等待排盘';
    if (lines) lines.innerHTML = yijingLineHtml(result);
    if (caption) caption.textContent = result?.name
      ? `${fcActiveTab} · ${result.name}图位`
      : '排盘后显示当前卦图。';

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
    const summary = $('#mbpYijingSummary');
    const lines = $('#mbpYijingLines');
    const years = $('#mbpYijingYears');
    const guaci = $('#mbpYijingGuaci');
    const masterTitle = $('#mbpYijingMasterTitle');
    const masterSummary = $('#mbpYijingMasterSummary');
    const masterText = $('#mbpYijingMasterText');
    const imageReading = $('#mbpYijingImageReading');
    const master = fcMasterEntry(result);
    const guaciTextValue = fcGuaciText(result);
    const masterBody = yijingMasterText(result);

    if (name) name.textContent = result?.name || '等待排盘';
    if (summary) summary.textContent = yijingAssistSummary(result);
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
      guaci.textContent = guaciTextValue || (result ? '此卦暂无卦辞数据，可先参考上方命盘与五卷解读。' : '先完成排盘。');
    }

    if (imageReading) {
      imageReading.innerHTML = yijingImageReadingHtml(result, masterBody, master?.summary);
    }

    if (masterTitle) {
      masterTitle.textContent = result ? `${yijingMasterLabel()} · ${result.name}` : '等待排盘';
    }
    if (masterSummary) {
      masterSummary.textContent = cleanYijingReadingText(master?.summary) || (result ? '此卦暂无名师总论。' : '排盘后显示讲课式总论。');
    }
    if (masterText) {
      masterText.innerHTML = renderYijingTextSections(
        masterBody,
        result ? '此卦暂无对应名师解读。' : '排盘后显示对应卦位的逐条讲解。'
      );
    }
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
    fcLoadYearly(fcAgeToYear(fcActiveAge));
    fcLiunianResult = fcLiunianSeq[fcActiveAge] || null;
    $('#mbpFcLiunian').textContent = `${fcActiveAge}岁 · ${fcLiunianResult?.name || '—'}`;
    fcRenderLiunianScroll();
    if (fcActiveTab === '流年卦') fcRenderHexagram();
    renderZipingFooter();
    fcRenderHighlight(fcActiveBranch || fcCurrentChart?.earthlyBranchOfSoulPalace || '卯');
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
    renderZipingFooter(fcBirthPillars);
    fcRenderHighlight(fcActiveBranch);
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
        ['大限流年', `当前页面先接命盘主线，后续可把原版大限流年结论并入这里，形成十年节奏。`],
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

  function normalizeAiData(data) {
    if (!data) return data;
    if (typeof data === 'string') {
      const parsed = parseAiJson(data);
      const loose = parsed ? null : looseAiCard(data);
      return parsed ? normalizeAiData(parsed) : (loose ? { card: loose } : { card: { body: data } });
    }
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

  function renderSpecialChapterBlock(sections, fallbackText) {
    const topics = (sections || [])
      .map((section) => ({ title: section.title, content: cleanAiText(section.content || '') }))
      .filter((section) => section.content);
    const list = topics.length ? topics : [{ title: '专题批命', content: fallbackText || '五项专题等待原站 AI 返回。' }];
    const points = list.slice(0, 3).map((section) => specialTopicParts(section).lead);
    return `
      <div class="mbp-special-chapter">
        <div class="mbp-special-overview">
          <span>专题总览</span>
          <strong>先看结论，再看重点和提醒</strong>
          <ul>
            ${points.map((point) => `<li>${highlightInsightText(point)}</li>`).join('')}
          </ul>
        </div>
        <div class="mbp-special-topic-grid">
          ${list.map((section) => `
            <section class="mbp-special-topic-card">
              <header>
                <span>专题</span>
                <h4>${escapeHtml(section.title || '专题批命')}</h4>
              </header>
              ${renderSpecialTopicSegments(section)}
            </section>
          `).join('')}
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

  function actionAdviceData(overall, luck) {
    const modules = [
      ['命格', overall],
      ['大运', luck],
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

  function renderActionAdviceBlock(overall, luck) {
    const advice = actionAdviceData(overall, luck);
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

  function renderCurveChapterBlock() {
    const pastItems = curvePastValidationItems();
    return `
      <div class="mbp-curve-panel" data-curve-panel>
        <div class="mbp-curve-switch" role="tablist" aria-label="人生曲线视图">
          <button class="is-active" type="button" role="tab" aria-selected="true" data-curve-view="past">过去验证</button>
          <button type="button" role="tab" aria-selected="false" data-curve-view="future">未来趋势</button>
        </div>
        <div class="mbp-curve-view is-active" data-curve-pane="past">
          <div class="mbp-curve-verify-head">
            <span>先验过去</span>
            <strong>先看过往是否对得上，再看未来才有底。</strong>
            <p>下面列出命盘曲线里的已发生节点，客户可以逐项核对真实经历。</p>
          </div>
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
        <div class="mbp-curve-view" data-curve-pane="future">
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
        </div>
      </div>
    `;
  }

  function curvePointTone(age) {
    if (age <= 24) return '起步期';
    if (age <= 32) return '发力期';
    if (age <= 39) return '低谷校验';
    if (age <= 46) return '高点前奏';
    if (age <= 52) return '调整期';
    return '二次抬升';
  }

  function curvePastValidationItems() {
    const bundle = getChartBundle();
    const chart = bundle.chart || state.chart || fcCurrentChart;
    const currentAge = Math.max(1, fcCurrentVirtualAge());
    const baseAges = [21, 29, 36, 44, 49, 56];
    let ages = baseAges.filter((age) => age <= currentAge);
    if (!ages.length) ages = [Math.max(1, currentAge)];
    ages = ages.slice(-4);
    return ages.map((age) => {
      const year = fcAgeToYear(age);
      const palace = findDecadePalace(chart, age);
      const xiaoBranch = fcResolveXiaoLianBranch(age);
      const xiaoPalace = fcPalaceByBranch(chart, xiaoBranch);
      const oppositePalace = fcPalaceByBranch(chart, fcOppositeBranch(xiaoBranch));
      const domain = palaceDomain(palace?.name || xiaoPalace?.name || '');
      const palaceLabel = palace?.name ? normalizePalaceName(palace.name) : '大限主线';
      const xiaoLabel = xiaoPalace?.name ? normalizePalaceName(xiaoPalace.name) : (xiaoBranch ? `${xiaoBranch}宫` : '小限落点');
      const oppositeLabel = oppositePalace?.name ? normalizePalaceName(oppositePalace.name) : '对宫应事';
      const stars = palaceStarBrief(palace || xiaoPalace);
      return {
        ageLabel: `命盘${age}岁`,
        yearLabel: `${year}年`,
        title: `${curvePointTone(age)} · ${domain}`,
        body: `${palaceLabel}牵动${domain}，重点回想这一阶段是否有方向、关系、资源或居住安排的明显变化。`,
        evidence: `${xiaoLabel}落点，对宫看${oppositeLabel}；星曜线索：${stars}。`,
      };
    });
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

  function findDecadePalace(chart, age) {
    return (chart?.palaces || []).find((palace) => {
      const range = rangeFromDecadal(palace);
      return range && age >= range[0] && age <= range[1];
    }) || null;
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

  function renderXiaoLianYearBlock(info) {
    const lineText = info.liunian.lineNum
      ? `${info.liunian.lineType || ''}${info.liunian.lineNum}爻`
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
            <p>${escapeHtml(`${palaceDomain(info.xiaoPalace?.name || '')} · ${palaceStarBrief(info.xiaoPalace)}`)}</p>
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

  function renderLuckChapterBlock(data, fallbackText) {
    const bundle = getChartBundle();
    const chart = bundle.chart || state.chart;
    const year = new Date().getFullYear();
    const currentAge = Math.max(1, Number(fcActiveAge) || (year - Number(state.profile.year || year) + 1));
    const decadePalace = findDecadePalace(chart, currentAge);
    const decadeRange = rangeFromDecadal(decadePalace) || [Math.max(1, currentAge - 4), currentAge + 5];
    const palaceName = decadePalace?.name || '大限宫';
    const stars = palaceMainLabel(decadePalace);
    const domain = palaceDomain(palaceName);
    const theme = decadeTheme(domain);
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
    const sections = aiSections(data);
    const summary = insightSummary(data, fallbackText || `${palaceName}主${domain}，这十年先稳住根基，再看机会扩张。`, 170);
    const summarySentences = splitReadableSentences(summary);
    const usedSummarySentences = new Set();
    const opportunity = luckSectionText(sections, summarySentences, usedSummarySentences, ['机会', '优势', '适合'], ['机会', '适合', '利于', '推进', '学习', '沟通', '合作'], `${domain}有推进空间，先抓可落地的资源。`);
    const risk = luckSectionText(sections, summarySentences, usedSummarySentences, ['风险', '注意', '留意', '压力'], ['风险', '压力', '注意', '避免', '不宜', '消耗', '拉扯'], '避免急转方向，注意关系拉扯与现金流波动。');
    const yearPoint = luckSectionText(sections, summarySentences, usedSummarySentences, ['今年', '今年重点'], ['今年', '流年', String(year), yearGz, '重点'], `${year} ${yearGz}，重点看${yearFocus}。`);
    const startYear = fcAgeToYear(decadeRange[0]);
    const endYear = fcAgeToYear(decadeRange[1]);
    const midAge = Math.round((decadeRange[0] + decadeRange[1]) / 2);
    const turnYear = fcAgeToYear(Math.min(decadeRange[1], Math.max(decadeRange[0], midAge)));
    const guardYear = year >= startYear && year <= endYear ? year : startYear;
    const smoothYear = fcAgeToYear(Math.min(decadeRange[1], Math.max(decadeRange[0], midAge + 2)));
    const advice = [
      domain.includes('财') ? '先稳现金流，再谈扩大投入。' : `先把${domain}的基本盘稳住。`,
      '重大决定多留一天复盘，避免单独拍板。',
      yearFocus.includes('田宅') ? '房产、家庭、居住安排优先清理。' : '保留合作弹性，给后续转折留空间。',
    ];

    return `
      <div class="mbp-luck-hero">
        <div>
          <em>当前大限</em>
          <strong>${escapeHtml(`${decadeRange[0]}-${decadeRange[1]}岁 · ${normalizePalaceName(palaceName)} · ${theme}`)}</strong>
          <p>${escapeHtml(`大限主星：${stars}；当前流年：${year} ${yearGz}`)}</p>
        </div>
        <div class="mbp-luck-age-wrap">
          <span class="mbp-luck-age-badge">${escapeHtml(`${currentAge}岁`)}</span>
          <details class="mbp-luck-age-note">
            <summary>岁数说明</summary>
            <p>这里直接使用命盘流年序列的岁数，和上方命盘一致，不按身份证年龄另算，也不额外加一岁。</p>
          </details>
        </div>
      </div>
      <div class="mbp-luck-kv">
        <section><b>大限宫位</b><strong>${escapeHtml(palaceName)}</strong><p>${escapeHtml(domain)}</p></section>
        <section><b>重点星曜</b><strong>${escapeHtml(stars)}</strong><p>看十年主轴与发力方式</p></section>
        <section><b>今年重点</b><strong>${escapeHtml(yearFocus)}</strong><p>${escapeHtml(`${year} ${yearGz}`)}</p></section>
      </div>
      ${renderLuckSummaryParts([
        { title: '机会', text: opportunity },
        { title: '风险', text: risk },
        { title: '今年重点', text: yearPoint },
      ])}
      ${renderXiaoLianYearBlock({
        age: currentAge,
        year,
        yearGz,
        liunian,
        xiaoPalace: xiaoLianPalace,
        xiaoLabel,
        oppositePalace,
        oppositeLabel,
      })}
      <div class="mbp-luck-bottom">
        <section>
          <h4>行动建议</h4>
          <ol>${advice.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
        </section>
        <section>
          <h4>时间节奏</h4>
          <div class="mbp-luck-timing">
            <span><b>要守</b>${escapeHtml(`${guardYear}年`)}</span>
            <span><b>转折</b>${escapeHtml(`${turnYear}年`)}</span>
            <span><b>偏顺</b>${escapeHtml(`${smoothYear}年`)}</span>
          </div>
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
    return aiTasks.filter((task) => state.aiResults[task.module]).length;
  }

  const reportChapterProgressGroups = [
    { modules: ['overall'] },
    { modules: ['shengong', 'hunyin', 'jiankang', 'caiyun', 'shiye'] },
    { modules: ['current_luck'] },
    { virtual: 'curve' },
    { virtual: 'advice' },
  ];

  function reportChapterProgress(group, runningModule, totalDone, totalModules) {
    if (group.modules) {
      const done = group.modules.filter((moduleKey) => state.aiResults[moduleKey]).length;
      const total = group.modules.length;
      const running = group.modules.includes(runningModule);
      if (done >= total) return { ratio: 1, state: 'done', text: '完成' };
      if (running) return { ratio: Math.max(done / total, 0.12), state: 'running', text: total > 1 ? `${done}/${total}` : '生成中' };
      if (done > 0) return { ratio: done / total, state: 'partial', text: `${done}/${total}` };
      return { ratio: 0, state: 'pending', text: '等待' };
    }
    if (group.virtual === 'curve') {
      if (state.curveGenerated || totalDone >= totalModules) return { ratio: 1, state: 'done', text: '完成' };
      if (totalDone > 0 || runningModule) return { ratio: Math.min(.72, Math.max(.18, totalDone / totalModules)), state: 'running', text: '整理中' };
    }
    if (group.virtual === 'advice') {
      if (state.adviceGenerated || totalDone >= totalModules) return { ratio: 1, state: 'done', text: '完成' };
      if (totalDone > 1 || runningModule) return { ratio: Math.min(.82, Math.max(.12, totalDone / totalModules)), state: 'running', text: '整理中' };
    }
    return { ratio: 0, state: 'pending', text: '等待' };
  }

  function updateBookProgress(done = 0, runningIndex = -1, stateText = '待生成') {
    const total = aiTasks.length;
    const safeDone = Math.max(0, Math.min(done, total));
    const percent = total ? Math.round((safeDone / total) * 100) : 0;
    const runningModule = aiTasks[runningIndex]?.module || '';
    const text = $('#mbpBookProgressText');
    const fill = $('#mbpBookProgressFill');
    const track = fill?.closest('.mbp-book-progress-track');
    const hint = $('#mbpBookProgressHint');
    if (text) text.textContent = `${percent}%`;
    if (fill) fill.style.width = `${percent}%`;
    if (track) track.setAttribute('aria-valuenow', String(percent));
    if (hint) {
      hint.textContent = percent >= 100
        ? '五卷命书已生成，可继续查看细节或打包报告。'
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
      const stateNode = button.querySelector('[data-report-progress-state]');
      if (stateNode) stateNode.textContent = item.text;
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
    const count = $('#mbpReportReadyCount');
    if (count) count.textContent = `${Math.min(done, total)}/${total}`;
    const label = $('#mbpReportStateText');
    if (label) label.textContent = stateText;
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
    const overallText = aiCardText(overall);
    const luckText = aiCardText(luck);
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
    const advice = actionAdviceData(overall, luck);
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
      buildPdfChapter(3, '大限流年', buildPdfTextCards(luck, '大限流年', luckText || '大限流年等待原站 AI 返回。')),
      buildPdfChapter(4, '人生曲线', `
        <section class="mbp-pdf-text-card">
          <strong>整体走势</strong>
          <p>人生曲线用于看关键年份、高低点与转折节奏。后续接入原站曲线评分后，这里会自动替换为客户版曲线结论。</p>
        </section>
      `),
      buildPdfChapter(5, '行动建议', adviceHtml),
    ].join('');
  }

  function buildPdfReportElement() {
    const bundle = getChartBundle();
    if (bundle.error) throw new Error(bundle.error);
    renderChart();
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
          <li>大限流年</li>
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
        <div class="mbp-pdf-chapters-slot">${buildPdfChaptersHtml()}</div>
      </section>
    `;
    return report;
  }

  async function downloadMingbookPdf() {
    const btn = $('#mbpExportPdf');
    if (!pdfReportReady()) {
      setDecodeStatus('请先完成一键批命，再打包深度报告。');
      setPdfHint('先生成五卷命书，再下载客户版 PDF', 'error');
      $('#mbpDecodeBtn')?.focus({ preventScroll: true });
      return;
    }
    const original = btn?.innerHTML || '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>正在打包…</span><small>PDF</small>';
    }
    setPdfHint('正在整理命盘、五卷解读与目录…', 'ready');
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
    const overallCard = normalizeAiData(overall)?.card || {};
    const decodeList = $('#mbpDecodeList');
    if (decodeList) {
      const highlights = [
        ['主线', overallText || '整体批命生成后显示'],
        ['走势', luckText || '大限流年生成后显示'],
        ['专题', specialText || '五项专题生成后显示'],
      ];
      decodeList.innerHTML = highlights.map((item) => `
        <p><strong>${escapeHtml(item[0])}</strong>${escapeHtml(trimText(item[1], 48))}</p>
      `).join('');
    }
    const chaptersData = [
      [aiCardTitle(overall, '命格总览'), overallText || '整体批命等待原站 AI 返回。', null, 'overall'],
      ['专题批命', specialBriefText || '五项专题等待原站 AI 返回。', specialBriefSections, 'specials'],
      ['大限流年', luckText || '当前大限流年接口暂未返回，后续继续接原站大限模块。', null, 'luck'],
      ['人生曲线', '人生曲线属于原站独立模块，下一步接入原站曲线评分与关键年份。', null, 'curve'],
      ['行动建议', overallCard.risk ? `要留意：${overallCard.risk}` : '先看命盘底色，再看大运节奏；重要决策不只问准不准，还要知道何时动、如何动。', null, 'advice'],
    ];
    const chapters = $('#mbpChapters');
    if (chapters) {
      chapters.classList.add('is-generated');
      chapters.innerHTML = chaptersData.map((item, index) => {
        const type = item[3] || '';
        const data = type === 'overall' ? overall : type === 'luck' ? luck : { card: { title: item[0], body: item[1], sections: item[2] || null } };
        return `
        <article class="mbp-report-row" id="mbp-chapter-${index}" data-report-chapter="${index}">
          <span>卷${index + 1}</span>
          <div class="mbp-report-title">
            <h3>${escapeHtml(item[0])}</h3>
            ${chapterActionButton(index)}
          </div>
            <div class="mbp-report-content">
              ${type === 'specials' ? renderSpecialChapterBlock(item[2], item[1]) : type === 'luck' ? renderLuckChapterBlock(data, item[1]) : type === 'curve' ? renderCurveChapterBlock() : type === 'advice' ? renderActionAdviceBlock(overall, luck) : renderInsightBlock(data, item[0], item[1], {
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
    requestAnimationFrame(syncReportNav);
  }

  async function callOriginalAi(moduleKey) {
    if (typeof window._aipCallBackend !== 'function') {
      throw new Error('原站 AI 批命脚本未加载');
    }
    return normalizeAiData(await window._aipCallBackend(moduleKey));
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
      const data = await callOriginalAi(task.module);
      state.aiResults[task.module] = data;
      setModuleDone(task.module, true);
      if (task.key) {
        renderSpecialAi(task.key, data, task.label);
        setSpecialStatus(task.key, '已生成', 'done');
      }
      renderChaptersFromAi();
      if (generatedModuleCount() >= aiTasks.length) {
        state.curveGenerated = true;
        state.adviceGenerated = true;
      }
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

  function setDecodeAllButtonsBusy(busy, label = '') {
    document.querySelectorAll('[data-decode-all]').forEach((button) => {
      if (!button.dataset.defaultText) {
        button.dataset.defaultText = button.textContent.trim();
        button.dataset.defaultHtml = button.innerHTML;
      }
      button.disabled = busy;
      button.classList.toggle('is-running', busy);
      if (busy) {
        button.textContent = label || '生成中';
      } else if (button.dataset.defaultHtml) {
        button.innerHTML = button.dataset.defaultHtml;
      } else {
        button.textContent = button.dataset.defaultText;
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
    state.curveGenerated = false;
    state.adviceGenerated = false;
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
    state.curveGenerated = successCount >= aiTasks.length;
    state.adviceGenerated = successCount >= aiTasks.length;
    setDecodeStatus(successCount ? `已接入原站 AI：完成 ${successCount}/${aiTasks.length} 个模块。` : 'AI 服务暂未连接，请稍后重试。');
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
    document.body.classList.add('is-decoded');
    renderChaptersFromAi();
    updateDecodeProgress(generatedModuleCount(), -1, '曲线已生成');
    setDecodeStatus('人生曲线已生成。');
    scrollToReportChapter(3);
    return true;
  }

  async function decodeSpecialChapter() {
    const modules = ['shengong', 'hunyin', 'jiankang', 'caiyun', 'shiye'];
    let success = 0;
    for (const moduleKey of modules) {
      if (await decodeSingleModule(moduleKey)) success += 1;
    }
    setDecodeStatus(success ? `专题批命已完成 ${success}/${modules.length} 项。` : '专题批命生成失败，请稍后重试。');
    if (success) scrollToReportChapter(1);
    return success > 0;
  }

  function resetAiContent() {
    setReportGeneratedState(false);
    resetModuleDoneStates();
    state.curveGenerated = false;
    state.adviceGenerated = false;
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
      chapters.innerHTML = ['命格总览', '专题批命', '大限流年', '人生曲线', '行动建议'].map((title, index) => `
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
    function renderChartFromProfile(profile) {
      showFormError('');
      state.profile = normalizeProfile(profile);
      formCalMode = state.profile.isLunar ? 'lunar' : 'solar';
      resetForProfileChange();
      state.chartRecordId = makeLocalId();
      state.chartReady = true;
      state.chartConfirmedKey = profileHistoryKey(state.profile);
      saveProfile();
      saveProfileToHistory(state.profile);
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
      resetForProfileChange();
      renderChart();
    }

    $('#mbpBirthForm')?.addEventListener('input', invalidateChartFromFormEdit);
    $('#mbpBirthForm')?.addEventListener('change', invalidateChartFromFormEdit);

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
      if (record?.profile) applyClientProfile(record.profile, {
        chartRecordId: record.id && record.id !== 'current' ? record.id : '',
      });
    });

    $('#mbpClientNew')?.addEventListener('click', () => {
      applyClientProfile({ ...defaultProfile, name: '' }, { chartReady: false });
      $('#mbpBirthForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#mbpClientPicker')) closeClientMenu();
    });

    document.querySelectorAll('.mbp-fc-card .fc-tab').forEach((button) => {
      button.addEventListener('click', () => {
        fcSwitchTab(button.dataset.tab || '先天卦');
      });
    });

    $('#mbpYijingAssist')?.addEventListener('click', (event) => {
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
        setCalMode(btn.dataset.cal || 'solar');
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

    function setAiGender(gender) {
      if (!gender) return;
      const value = gender === 'female' || gender === '女' ? 'female' : 'male';
      $('#mbpGender').value = value;
      document.querySelectorAll('.nf-gender-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.v === value));
    }

    function setAiCity(cityName) {
      const text = String(cityName || '').trim();
      if (!text) return;
      const city = findCity(text);
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
      formCalMode = profile.isLunar ? 'lunar' : 'solar';
      resetAiContent();
      state.chart = null;
      state.chartKey = '';
      state.chartRecordId = makeLocalId();
      state.norm = null;
      state.chartReady = true;
      state.chartConfirmedKey = profileHistoryKey(profile);
      state.decoded = false;
      state.aiResults = {};
      document.body.classList.remove('is-decoded');
      saveProfile();
      saveProfileToHistory(state.profile);
      renderChart();
      if (desktopAuthState.session?.user) hydrateDesktopMemberStatus({ force: true });
      $('#chart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#mbpDecodeBtn')?.addEventListener('click', async () => {
      if (await decodeReports()) scrollToReportChapter(0);
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

    $('#report')?.addEventListener('click', async (event) => {
      if (handleCurvePanelClick(event)) return;
      const allButton = event.target.closest('[data-decode-all]');
      if (allButton) {
        if (await decodeReports()) scrollToReportChapter(0);
        return;
      }
      const moduleButton = event.target.closest('[data-report-module]');
      if (moduleButton) {
        const chapter = moduleButton.closest('[data-report-chapter]');
        const chapterIndex = Number(chapter?.dataset.reportChapter) || 0;
        if (await decodeSingleModule(moduleButton.dataset.reportModule)) scrollToReportChapter(chapterIndex);
        return;
      }
      const actionButton = event.target.closest('[data-report-action]');
      if (!actionButton) return;
      actionButton.disabled = true;
      actionButton.classList.add('is-running');
      try {
        if (actionButton.dataset.reportAction === 'curve') generateCurveChapter();
        if (actionButton.dataset.reportAction === 'specials') await decodeSpecialChapter();
      } finally {
        actionButton.disabled = false;
        actionButton.classList.remove('is-running');
      }
    });

    $('#mbpExportPdf')?.addEventListener('click', downloadMingbookPdf);

    $('#mbpAuthTrigger')?.addEventListener('click', () => {
      openDesktopAuth(desktopAuthState.session?.user ? desktopAuthState.mode : 'login');
    });
    $('#mbpAuthClose')?.addEventListener('click', closeDesktopAuth);
    $('#mbpAuthOverlay')?.addEventListener('click', (event) => {
      if (event.target === $('#mbpAuthOverlay') && !desktopAuthState.loading) closeDesktopAuth();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && desktopAuthState.open && !desktopAuthState.loading) closeDesktopAuth();
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
  bindEvents();
  renderChart();
  bootDesktopAuth();
}());

