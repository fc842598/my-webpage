(function () {
  const $ = (selector) => document.querySelector(selector);
  const CLIENT_ID_KEY = 'ziwei_client_id';
  const AUTH_SESSION_KEY = 'wentian-app-auth-session-v1';
  const XU_CONTEXT_KEY = 'wentian-xubanxian-context-v1';
  const LIUYAO_DAILY_LIMIT = 3;
  const LIUYAO_TOSS_ANIMATION_MS = 980;
  const LIUYAO_PULL_MAX = 132;
  const LIUYAO_READY_POWER = 0.18;
  const LIUYAO_DEFAULT_POWER = 0.62;
  const LIUYAO_VALUES = [7, 8, 9, 6];
  const LIUYAO_MANUAL_EMPTY_COINS = [null, null, null];
  const lineLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  const trigrams = {
    111: { gua: '乾', name: '天' },
    110: { gua: '兑', name: '泽' },
    101: { gua: '离', name: '火' },
    100: { gua: '震', name: '雷' },
    '011': { gua: '巽', name: '风' },
    '010': { gua: '坎', name: '水' },
    '001': { gua: '艮', name: '山' },
    '000': { gua: '坤', name: '地' },
  };
  const hexPairs = [
    ['乾-乾', '乾为天'], ['坤-坤', '坤为地'], ['坎-震', '水雷屯'], ['艮-坎', '山水蒙'],
    ['坎-乾', '水天需'], ['乾-坎', '天水讼'], ['坤-坎', '地水师'], ['坎-坤', '水地比'],
    ['巽-乾', '风天小畜'], ['乾-兑', '天泽履'], ['坤-乾', '地天泰'], ['乾-坤', '天地否'],
    ['乾-离', '天火同人'], ['离-乾', '火天大有'], ['坤-艮', '地山谦'], ['震-坤', '雷地豫'],
    ['兑-震', '泽雷随'], ['艮-巽', '山风蛊'], ['坤-兑', '地泽临'], ['巽-坤', '风地观'],
    ['离-震', '火雷噬嗑'], ['艮-离', '山火贲'], ['艮-坤', '山地剥'], ['坤-震', '地雷复'],
    ['乾-震', '天雷无妄'], ['艮-乾', '山天大畜'], ['艮-震', '山雷颐'], ['兑-巽', '泽风大过'],
    ['坎-坎', '坎为水'], ['离-离', '离为火'], ['兑-艮', '泽山咸'], ['震-巽', '雷风恒'],
    ['乾-艮', '天山遁'], ['震-乾', '雷天大壮'], ['离-坤', '火地晋'], ['坤-离', '地火明夷'],
    ['巽-离', '风火家人'], ['离-兑', '火泽睽'], ['坎-艮', '水山蹇'], ['震-坎', '雷水解'],
    ['艮-兑', '山泽损'], ['巽-震', '风雷益'], ['兑-乾', '泽天夬'], ['乾-巽', '天风姤'],
    ['兑-坤', '泽地萃'], ['坤-巽', '地风升'], ['兑-坎', '泽水困'], ['坎-巽', '水风井'],
    ['兑-离', '泽火革'], ['离-巽', '火风鼎'], ['震-震', '震为雷'], ['艮-艮', '艮为山'],
    ['巽-艮', '风山渐'], ['震-兑', '雷泽归妹'], ['震-离', '雷火丰'], ['离-艮', '火山旅'],
    ['巽-巽', '巽为风'], ['兑-兑', '兑为泽'], ['巽-坎', '风水涣'], ['坎-兑', '水泽节'],
    ['巽-兑', '风泽中孚'], ['震-艮', '雷山小过'], ['坎-离', '水火既济'], ['离-坎', '火水未济'],
  ];
  const hexMap = Object.fromEntries(hexPairs.map(([key, name], index) => [key, { no: String(index + 1), name }]));
  const state = {
    question: '',
    mode: 'online',
    casts: [],
    manualCoins: Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice()),
    lastCoins: [],
    error: '',
    statusTone: '',
    questionGate: null,
    gateLoading: false,
    quotaLoading: false,
    quota: { limit: LIUYAO_DAILY_LIMIT, used: 0, remaining: LIUYAO_DAILY_LIMIT },
    tossAnimation: null,
    drag: null,
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function lineType(value) {
    return {
      6: { value: 6, name: '老阴', nature: '阴动', broken: true, moving: true, mark: '×', changesTo: '阳', changedBroken: false, coinText: '反反反' },
      7: { value: 7, name: '少阳', nature: '阳静', broken: false, moving: false, mark: '', changesTo: '阳', changedBroken: false, coinText: '正反反' },
      8: { value: 8, name: '少阴', nature: '阴静', broken: true, moving: false, mark: '', changesTo: '阴', changedBroken: true, coinText: '正正反' },
      9: { value: 9, name: '老阳', nature: '阳动', broken: false, moving: true, mark: '○', changesTo: '阴', changedBroken: true, coinText: '正正正' },
    }[Number(value)] || null;
  }

  function makeCast(options = {}) {
    const coins = Array.from({ length: 3 }, () => (Math.random() < 0.5 ? 2 : 3));
    const value = coins.reduce((sum, coin) => sum + coin, 0);
    return {
      value,
      coins,
      manual: Boolean(options.manual),
      power: Math.round(Number(options.power || LIUYAO_DEFAULT_POWER) * 100),
      at: Date.now(),
      ...lineType(value),
    };
  }

  function makeCastFromCoins(coins, options = {}) {
    const faces = [0, 1, 2].map((index) => Number(coins?.[index]));
    if (faces.some((coin) => coin !== 2 && coin !== 3)) return null;
    const value = faces.reduce((sum, coin) => sum + coin, 0);
    return {
      value,
      coins: faces,
      manual: Boolean(options.manual),
      power: Math.round(Number(options.power || LIUYAO_DEFAULT_POWER) * 100),
      at: Date.now(),
      ...lineType(value),
    };
  }

  function getCoinFaceLabel(coin) {
    return Number(coin) === 3 ? '正' : '反';
  }

  function getProgress() {
    return state.casts.filter(Boolean).length;
  }

  function ensureManualRows() {
    if (!Array.isArray(state.manualCoins) || state.manualCoins.length < 6) {
      state.manualCoins = Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice());
    }
    for (let i = 0; i < 6; i += 1) {
      if (!Array.isArray(state.manualCoins[i])) state.manualCoins[i] = LIUYAO_MANUAL_EMPTY_COINS.slice();
    }
  }

  function questionText() {
    const text = String($('#mbpLiuyaoQuestion')?.value || state.question || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    state.question = text;
    return text;
  }

  function normalizeQuestion(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  function getAiBackendBase() {
    const params = new URLSearchParams(window.location.search || '');
    const queryBase = params.get('aiBackendBase') || params.get('apiBase') || '';
    const configBase = window.SITE_CONFIG?.aiBackendBase || '';
    return (queryBase || configBase || 'https://api.yuetianai.com').replace(/\/+$/, '');
  }

  function makeUuid() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const value = Math.random() * 16 | 0;
      return (char === 'x' ? value : (value & 0x3 | 0x8)).toString(16);
    });
  }

  function getClientId() {
    try {
      let id = localStorage.getItem(CLIENT_ID_KEY);
      if (!/^[a-zA-Z0-9:_-]{16,96}$/.test(String(id || ''))) {
        id = makeUuid();
        localStorage.setItem(CLIENT_ID_KEY, id);
      }
      return id;
    } catch (_err) {
      return 'anonymous';
    }
  }

  function getStoredAuthToken() {
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
      return session?.access_token || '';
    } catch (_err) {
      return '';
    }
  }

  function normalizeQuota(raw) {
    const limit = Math.max(1, Number(raw?.limit || raw?.dailyLimit || LIUYAO_DAILY_LIMIT));
    const used = Math.max(0, Number(raw?.used ?? raw?.dailyUsed ?? 0));
    const remaining = Math.max(0, Number(raw?.remaining ?? raw?.dailyRemaining ?? (limit - used)));
    return { limit, used, remaining, date: String(raw?.date || ''), exhausted: remaining <= 0 };
  }

  function normalizeGate(raw, question = state.question) {
    if (!raw || typeof raw !== 'object') return null;
    const gateQuestion = normalizeQuestion(raw.question || '');
    if (gateQuestion && gateQuestion !== normalizeQuestion(question)) return null;
    return {
      question: normalizeQuestion(question),
      allowed: raw.allowed === true,
      reason: normalizeQuestion(raw.reason || (raw.allowed ? '审题通过，可以起卦。' : '问题还不够清楚，暂不起卦。')).slice(0, 80),
      suggestion: normalizeQuestion(raw.suggestion || '').slice(0, 100),
      labels: Array.isArray(raw.labels) ? raw.labels.map(normalizeQuestion).filter(Boolean).slice(0, 4) : [],
      quota: normalizeQuota(raw.quota || state.quota),
      checkedAt: Date.now(),
    };
  }

  function getGateButtonMeta(question = state.question) {
    const normalizedQuestion = normalizeQuestion(question);
    const gate = normalizeGate(state.questionGate, normalizedQuestion);
    const exhausted = normalizeQuota(state.quota).remaining <= 0 && !gate?.allowed;
    if (state.gateLoading) return { label: '审题中…', disabled: true, state: 'loading' };
    if (exhausted) return { label: '今日已满', disabled: true, state: 'error' };
    if (gate?.allowed) return { label: '已通过', disabled: true, state: 'approved' };
    if (gate && !gate.allowed) return { label: '修改后重审', disabled: !normalizedQuestion, state: 'rejected' };
    return { label: '提交审题', disabled: !normalizedQuestion, state: 'idle' };
  }

  function getGateBadgeMeta(question = state.question) {
    const normalizedQuestion = normalizeQuestion(question);
    const gate = normalizeGate(state.questionGate, normalizedQuestion);
    const exhausted = normalizeQuota(state.quota).remaining <= 0 && !gate?.allowed;
    if (state.gateLoading) return { label: '审题中', state: 'loading' };
    if (exhausted) return { label: '今日已满', state: 'error' };
    if (gate?.allowed) return { label: '已通过', state: 'ok' };
    if (gate && !gate.allowed) return { label: '需修改', state: 'error' };
    return { label: normalizedQuestion ? '待确认' : '待审题', state: 'idle' };
  }

  function getGateTags(question = state.question) {
    const normalizedQuestion = normalizeQuestion(question);
    const gate = normalizeGate(state.questionGate, normalizedQuestion);
    const tags = gate?.labels?.length ? gate.labels.slice(0, 3) : ['一卦一问'];
    if (gate?.allowed) return [...tags, '可起卦'].slice(0, 3);
    if (state.gateLoading) return [...tags, '确认中'].slice(0, 3);
    if (!normalizedQuestion) return ['一卦一问', '审题后可起卦'];
    if (gate && !gate.allowed) return [...tags, '改好后重审'].slice(0, 3);
    return ['一卦一问', '审题后可起卦'];
  }

  function parseGateJson(text) {
    const raw = String(text || '').trim();
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const source = fenced ? fenced[1] : raw;
    const start = source.indexOf('{');
    const end = source.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(source.slice(start, end + 1));
    } catch (_err) {
      return null;
    }
  }

  function reviewQuestionLocally(question) {
    const normalizedQuestion = normalizeQuestion(question);
    const compact = normalizedQuestion.replace(/[\s，。！？、,.!?；;：“”"'（）()【】\[\]]+/g, '');
    const fail = (reason, suggestion, labels = ['一事一占']) => ({
      allowed: false,
      normalizedQuestion,
      reason,
      suggestion,
      labels,
    });

    if (!normalizedQuestion) {
      return fail('请先写清楚要问的一件事。', '一句话只问一件具体事情，再起卦。');
    }
    if (/^(随便|随机|娱乐|玩玩|试试|测试|乱点|看看|不知道|无所谓|都行|随便玩玩|随便看看|随机看看|测一下|测测|试一下|试试看|占着玩|测着玩)$/.test(compact)) {
      return fail('这个问题太随意，暂不起卦。', '请写清楚具体对象和想看的结果。', ['问题太散']);
    }
    if (/^(事业|财运|感情|婚姻|健康|工作|学业|运势|赚钱|求财|桃花|考试|合作|项目|网站)(怎么样|如何|好吗|看看|测测|测一下)?$/.test(compact)) {
      return fail('问题还太泛，暂不起卦。', '请具体到一件事，例如“这个项目本月能不能推进”。', ['问题太泛']);
    }
    if ((normalizedQuestion.match(/[？?]/g) || []).length > 1 || /同时|另外|还有|顺便|以及/.test(normalizedQuestion)) {
      return fail('一次只问一件事。', '请先删到一个核心问题，再提交。', ['一事一占']);
    }

    const hasSpecificSubject = /(我|我们|本人|自己|这个|这件|该|现在|本月|今年|最近|网站|项目|公司|店|生意|工作|客户|合作|合同|订单|产品|账号|平台|考试|offer|面试|房子|投资|资金|对方|他|她|TA|孩子|家人|父母|伴侣|对象|老板|同事|合伙人)/i.test(normalizedQuestion);
    const hasOutcome = /(能不能|能否|是否|可否|会不会|要不要|该不该|适不适合|可以吗|成不成|有没有|何时|多久|结果|赚钱|盈利|回本|成交|签约|通过|录取|复合|结婚|分手|离职|跳槽|搬家|买|卖|租|开店|上线|发布|推进|合作|投资|到账|怀孕|好转)/i.test(normalizedQuestion);
    const hasQuestionCue = /[？?]|吗|呢|如何|怎样|怎么样|能|该|是否|可否|会不会|要不要/.test(normalizedQuestion);

    if (compact.length < 8 || !hasSpecificSubject || !hasOutcome || !hasQuestionCue) {
      return fail('问题还不够具体，暂不起卦。', '请写清对象、事件和想看的结果。', ['问题不具体']);
    }
    return {
      allowed: true,
      normalizedQuestion,
      reason: '问题具体到对象、事件和结果，符合一事一占原则。',
      suggestion: '',
      labels: ['一事一占'],
    };
  }

  async function postGateQuestion(question) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = getStoredAuthToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${getAiBackendBase()}/api/ai/liuyao-question`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question,
          clientId: getClientId(),
          chatMode: 'liuyao_question_gate',
          divinationContext: { type: 'liuyao_question_gate', question, clientId: getClientId() },
        }),
        signal: controller.signal,
      });
      const contentType = String(response.headers.get('content-type') || '');
      const data = contentType.includes('application/json') ? await response.json() : { reply: await response.text() };
      if (!response.ok || data.error) throw new Error(data.error || `审题服务异常 ${response.status}`);
      return data;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function reviewQuestion(question) {
    const localGate = reviewQuestionLocally(question);
    if (String(window.SITE_CONFIG?.liuyaoQuestionGateMode || 'remote').toLowerCase() === 'local') return localGate;
    if (!localGate.allowed) return localGate;
    try {
      const data = await postGateQuestion(question);
      if (typeof data?.allowed === 'boolean') return data;
      const parsed = parseGateJson(data?.reply);
      if (!parsed) throw new Error('gate parse failed');
      return parsed;
    } catch (_err) {
      return {
        allowed: false,
        normalizedQuestion: question,
        reason: '后台暂时不可用，无法确认今日次数，先不起卦。',
        suggestion: '请稍后再试。',
        labels: ['次数未确认'],
        quota: state.quota,
      };
    }
  }

  async function refreshQuota() {
    if (state.quotaLoading) return;
    state.quotaLoading = true;
    render();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = getStoredAuthToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${getAiBackendBase()}/api/ai/liuyao-question`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'quota',
          clientId: getClientId(),
          divinationContext: { type: 'liuyao_quota', clientId: getClientId() },
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (data?.quota) state.quota = normalizeQuota(data.quota);
    } catch (_err) {
      // Keep the last known quota label; the server still enforces the hard limit.
    } finally {
      window.clearTimeout(timer);
      state.quotaLoading = false;
      render();
    }
  }

  function lineBit(cast, changed = false) {
    const value = Number(cast?.value);
    if (changed && value === 6) return '1';
    if (changed && value === 9) return '0';
    return value === 7 || value === 9 ? '1' : '0';
  }

  function resolveHex(casts, changed = false) {
    if (!casts || casts.length !== 6 || casts.some((cast) => !cast)) return null;
    const lowerBits = casts.slice(0, 3).map((cast) => lineBit(cast, changed)).join('');
    const upperBits = casts.slice(3, 6).map((cast) => lineBit(cast, changed)).join('');
    const lower = trigrams[lowerBits];
    const upper = trigrams[upperBits];
    const entry = upper && lower ? hexMap[`${upper.gua}-${lower.gua}`] : null;
    return {
      no: entry?.no || '',
      name: entry?.name || `${upper?.name || ''}${lower?.name || ''}`,
      upper,
      lower,
    };
  }

  function getResult() {
    const casts = state.casts;
    if (casts.length !== 6 || casts.some((cast) => !cast)) return null;
    const lines = casts.map((cast, index) => ({ ...lineType(cast.value), ...cast, index, label: lineLabels[index] }));
    return {
      question: state.question,
      createdAt: Date.now(),
      lines,
      primary: resolveHex(casts, false),
      changed: resolveHex(casts, true),
      movingLines: lines.filter((line) => line.moving),
    };
  }

  function formatHexMeta(hex) {
    const noText = hex?.no ? `第${hex.no}卦` : '卦象';
    const upper = hex?.upper?.name || '';
    const lower = hex?.lower?.name || '';
    return `${noText}${upper || lower ? ` · ${upper}上${lower}下` : ''}`;
  }

  function formatMovingText(movingLines, prefix = '') {
    const lines = Array.isArray(movingLines) ? movingLines : [];
    if (!lines.length) return `${prefix}无动爻`;
    return `${prefix}${lines.map((line) => line.label).join('、')}动`;
  }

  function getHexReading(hex) {
    if (!hex) return { summary: '本卦资料待补。', xian: '', hou: '', liu: '', source: '' };
    const master = window.getYijingMasterEntryByName?.(hex.name) || window.getYijingMasterEntryByNum?.(hex.no);
    const guaci = window.getGuaciEntryByName?.(hex.name);
    return {
      summary: master?.summary || guaci?.liu || '此卦重在审时度势，先明当前处境，再定进退。',
      xian: master?.xian || guaci?.xian || '',
      hou: master?.hou || guaci?.hou || '',
      liu: master?.liu || guaci?.liu || '',
      source: master?.source || '',
    };
  }

  function getZhouyiOriginal(hex) {
    const reading = getHexReading(hex);
    const fallback = firstReadableSentence(reading.liu || reading.summary, '');
    return {
      label: '卦辞摘录',
      text: fallback ? compactText(fallback, 72) : '此卦卦辞待补录，先按卦象结构与动爻取用。',
      source: formatOriginalSource(reading.source),
    };
  }

  function firstReadableSentence(text, fallback = '') {
    const source = String(text || '').replace(/原句：/g, '').replace(/讲解：/g, '').replace(/\s+/g, ' ').trim();
    return source.split(/[。！？；]/).find((part) => part.trim().length >= 6)?.trim() || fallback;
  }

  function compactText(text, maxLength = 72) {
    const chars = Array.from(String(text || '').replace(/\s+/g, ' ').trim());
    if (chars.length <= maxLength) return chars.join('');
    return `${chars.slice(0, maxLength).join('')}…`;
  }

  function formatOriginalSource(source) {
    const clean = String(source || '').trim();
    if (!clean || /^output[\\/]/i.test(clean)) return '本地卦辞资料';
    return clean;
  }

  function getHexImageSrc(no) {
    const index = Number(no);
    if (!Number.isInteger(index) || index < 1 || index > 64) return '';
    return `../images/yijing-hexagrams/${String(index).padStart(2, '0')}.webp`;
  }

  function renderCoins() {
    const coins = $('#mbpLiuyaoCoins');
    if (!coins) return;
    const last = state.casts.filter(Boolean).at(-1);
    const animating = state.tossAnimation?.active;
    const values = animating ? state.tossAnimation.cast.coins : (state.lastCoins.length ? state.lastCoins : [3, 2, 3]);
    const progress = getProgress();
    const questionReady = Boolean(normalizeGate(state.questionGate, state.question)?.allowed);
    const exhausted = normalizeQuota(state.quota).remaining <= 0 && !questionReady;
    const disabled = state.mode !== 'online' || state.gateLoading || exhausted || !questionReady || progress >= 6;
    const power = animating ? Math.max(18, Math.min(100, Number(state.tossAnimation.power) || 62)) : 0;
    const pull = state.drag?.pull || 0;
    const dragReady = state.drag?.ready;
    const label = animating
      ? `铜钱翻转中，落入${lineLabels[progress] || '本爻'}`
      : disabled
        ? (progress >= 6 ? '六爻已成' : exhausted ? '今日已满，明天再起卦。' : '先提交审题，通过后投第 1 爻')
        : `按住上拉，松手投${lineLabels[progress] || '本爻'}`;
    coins.innerHTML = `
        <div class="mbp-liuyao-coin-stage ${animating ? 'is-tossing' : ''} ${disabled ? 'is-disabled' : ''} ${state.drag ? 'is-dragging' : ''} ${dragReady ? 'is-ready' : ''}"
        id="mbpLiuyaoCoinStage"
        role="button"
        tabindex="${disabled ? '-1' : '0'}"
        aria-disabled="${disabled ? 'true' : 'false'}"
        aria-label="${escapeHtml(label)}"
        style="--pull-y:${-pull}px;--drag-rot:${Math.round(pull / 5)}deg;--drag-rot-neg:${Math.round(-pull / 5)}deg;--power:${(power / 100).toFixed(2)};--throw-y:${Math.round(-66 - power * .72)}px;">
        ${values.map((coin, index) => `
          <span class="mbp-liuyao-coin-token ${coin === 3 ? 'is-head' : 'is-tail'}" style="--d:${index * .1}s">
            <span class="mbp-liuyao-coin ${coin === 3 ? 'is-yang' : 'is-yin'}">
              <i>阅</i><b></b><i>天</i>
            </span>
            <em>${escapeHtml(animating || last || state.lastCoins.length ? getCoinFaceLabel(coin) : '待')}</em>
          </span>
        `).join('')}
        <span class="mbp-liuyao-power"><i></i></span>
        <strong>${escapeHtml(label)}</strong>
      </div>
      <div class="mbp-liuyao-coin-faces">
        <span>${last ? `第 ${progress} 爻` : '待投铜钱'}</span>
        ${values.map((coin, index) => `<em class="${coin === 3 ? 'is-head' : 'is-tail'}">${index + 1} ${escapeHtml(animating || last || state.lastCoins.length ? getCoinFaceLabel(coin) : '待')}</em>`).join('')}
      </div>
    `;
  }

  function renderStack() {
    const stack = $('#mbpLiuyaoStack');
    if (!stack) return;
    stack.innerHTML = Array.from({ length: 6 }, (_, row) => {
      const index = 5 - row;
      const cast = state.casts[index];
      const type = cast ? lineType(cast.value) : null;
      const lineClass = [
        'mbp-liuyao-line',
        !cast ? 'is-empty' : '',
        type?.broken ? 'is-yin' : '',
        type?.moving ? 'is-moving' : '',
      ].filter(Boolean).join(' ');
      const segments = type?.broken ? '<i></i><i></i>' : '<i></i>';
      const text = type ? `${type.value} ${type.name}${type.mark ? ` ${type.mark}` : ''}` : '未定';
      return `
        <div class="mbp-liuyao-line-row ${type?.moving ? 'is-moving' : ''}">
          <span>${escapeHtml(lineLabels[index])}</span>
          <span class="${lineClass}">${segments}</span>
          <span>${escapeHtml(text)}</span>
        </div>
      `;
    }).join('');
  }

  function renderResult() {
    const box = $('#mbpLiuyaoResult');
    if (!box) return;
    const result = getResult();
    if (!result) {
      box.innerHTML = `
        <section class="mbp-liuyao-empty-preview" aria-label="解读结果预览">
          <span>解读结果预览</span>
          <strong>投满 6 爻后，这里会直接生成完整结果</strong>
          <div>
            <em>本卦</em>
            <em>变卦</em>
            <em>动爻</em>
            <em>卦辞摘录</em>
            <em>AI 解卦</em>
          </div>
          <p>不用猜会看到什么：先看当前局面，再看变化方向，最后可交给许半仙继续细断。</p>
        </section>
      `;
      return;
    }
    const movingText = formatMovingText(result.movingLines);
    const text = result.question
      ? `${result.question}${/[。！？!?]$/.test(result.question) ? '' : '。'}`
      : '未填写。';
    const primaryOriginal = getZhouyiOriginal(result.primary);
    const changedOriginal = getZhouyiOriginal(result.changed);
    const image = (hex, label) => {
      const src = getHexImageSrc(hex?.no);
      return src ? `<img class="mbp-liuyao-hex-image" src="${escapeHtml(src)}" alt="${escapeHtml(`${label} ${hex?.name || ''}`)}" loading="lazy">` : '';
    };
    const miniHex = (changed = false) => `
      <span class="mbp-liuyao-minihex" aria-hidden="true">
        ${[5, 4, 3, 2, 1, 0].map((index) => {
          const line = result.lines[index];
          const broken = changed && line?.moving ? line.changedBroken : line?.broken;
          return `<i class="${broken ? 'is-yin' : 'is-yang'} ${line?.moving ? 'is-moving' : ''}"><b></b>${broken ? '<b></b>' : ''}</i>`;
        }).join('')}
      </span>
    `;
    const original = (item) => `
      <div class="mbp-liuyao-original">
        <b>${escapeHtml(item.label)}</b>
        <p>${escapeHtml(item.text)}</p>
        <small>${escapeHtml(item.source)}</small>
      </div>
    `;
    const pairCard = (label, hex, originalItem, changed = false) => `
      <article class="mbp-liuyao-hex-card">
        <span>${escapeHtml(label)}</span>
        <div>
          <strong>${escapeHtml(hex?.name || label)}</strong>
          ${miniHex(changed)}
        </div>
        ${image(hex, label)}
        ${original(originalItem)}
        <em>${escapeHtml(formatHexMeta(hex))}</em>
      </article>
    `;
    box.innerHTML = `
      <section class="mbp-liuyao-result-hero">
        <span>本卦</span>
        <strong>${escapeHtml(result.primary?.name || '本卦')}</strong>
        <em>${escapeHtml(formatHexMeta(result.primary))}</em>
        <b>${escapeHtml(movingText)}</b>
      </section>
      <div class="mbp-liuyao-result-pair">
        ${pairCard('本卦', result.primary, primaryOriginal, false)}
        ${pairCard('变卦', result.changed, changedOriginal, true)}
      </div>
      <article class="mbp-liuyao-reading-card">
        <span>所问之事</span>
        <strong>${escapeHtml(text)}</strong>
      </article>
      <article class="mbp-liuyao-reading-card is-lines">
        <span>六爻明细</span>
        <div>
          ${result.lines.map((line) => `<em>${escapeHtml(`${line.label} ${line.value}${line.name}${line.mark ? ` ${line.mark}` : ''} · ${line.coins.map(getCoinFaceLabel).join(' ')}`)}</em>`).join('')}
        </div>
      </article>
      <article class="mbp-liuyao-ai-card">
        <span>AI 解卦</span>
        <strong>交给许半仙，按本卦、变卦、动爻继续细断</strong>
        <p>本卦：${escapeHtml(primaryOriginal.text)}${result.changed?.name !== result.primary?.name ? `<br>变卦：${escapeHtml(changedOriginal.text)}` : ''}</p>
        <button type="button" id="mbpLiuyaoAskXu">开始 AI 解卦</button>
      </article>
    `;
  }

  function renderModePanel() {
    const panel = $('#mbpLiuyaoModePanel');
    if (!panel) return;
    const progress = getProgress();
    const gate = normalizeGate(state.questionGate, state.question);
    const ready = Boolean(gate?.allowed);
    const exhausted = normalizeQuota(state.quota).remaining <= 0 && !ready;
    const disabled = state.gateLoading || exhausted || !ready;
    const lockText = exhausted
      ? '今日已满 3 次，明天再起卦。'
      : state.gateLoading
        ? '正在审题，合格后才起卦。'
        : '先提交审题，通过后可在线投币或手动录入。';
    if (state.mode !== 'manual') {
      panel.innerHTML = `
        <div class="mbp-liuyao-online-card ${disabled ? 'is-locked' : ''}">
          <strong>动态投币</strong>
          <span class="${disabled ? 'is-lock' : ''}">${disabled ? lockText : `点击“投第 ${Math.min(progress + 1, 6)} 爻”，或按住右侧铜钱上拉松手，铜钱翻转后落爻。`}</span>
        </div>
      `;
      return;
    }
    ensureManualRows();
    while (state.casts.length < 6) state.casts.push(null);
    const activeIndex = state.casts.findIndex((cast) => !cast);
    const complete = activeIndex < 0;
    const currentIndex = complete ? 5 : activeIndex;
    const currentCoins = complete ? [] : state.manualCoins[currentIndex];
    const currentCast = complete ? null : makeCastFromCoins(currentCoins, { manual: true });
    const renderFaceButton = (lineIndex, coinIndex, value, current) => `
      <button type="button"
        class="${current === value ? 'is-active' : ''}"
        data-manual-coin="${value}"
        data-line-index="${lineIndex}"
        data-coin-index="${coinIndex}"
        ${disabled ? 'disabled' : ''}>${escapeHtml(getCoinFaceLabel(value))}</button>
    `;
    panel.innerHTML = `
      <div class="mbp-liuyao-manual-card ${disabled ? 'is-disabled is-locked' : ''}">
        <div class="mbp-liuyao-manual-head">
          <div>
            <span>真实铜钱录入</span>
            <strong>按初爻到上爻，逐爻填三枚铜钱</strong>
          </div>
          <em>${progress}/6</em>
        </div>
        ${complete ? `
          <div class="mbp-liuyao-manual-done">
            <strong>六爻已录完</strong>
            <span>可看本卦、变卦、动爻和许半仙解卦。</span>
            <button type="button" data-manual-clear-last ${disabled ? 'disabled' : ''}>重录上一爻</button>
          </div>
        ` : `
          <div class="mbp-liuyao-manual-current">
            <div>
              <strong>${escapeHtml(lineLabels[currentIndex])}</strong>
              <em>本爻 ${currentCoins.filter(Boolean).length}/3 枚</em>
            </div>
            <p>${disabled ? lockText : (currentCast ? `本爻已成：${currentCast.value} ${currentCast.name}。确认后进入下一爻。` : '现实中投三枚铜钱后，依次录入第 1、2、3 枚。')}</p>
            <div class="mbp-liuyao-manual-coins">
              ${[0, 1, 2].map((coinIndex) => `
                <div>
                  <i>第 ${coinIndex + 1} 枚</i>
                  <span>
                    ${renderFaceButton(currentIndex, coinIndex, 3, currentCoins[coinIndex])}
                    ${renderFaceButton(currentIndex, coinIndex, 2, currentCoins[coinIndex])}
                  </span>
                </div>
              `).join('')}
            </div>
            <div class="mbp-liuyao-manual-actions">
              <button type="button" data-manual-clear-line="${currentIndex}" ${disabled || !currentCoins.some(Boolean) ? 'disabled' : ''}>清空本爻</button>
              <button type="button" data-manual-confirm="${currentIndex}" ${disabled || !currentCast ? 'disabled' : ''}>${currentIndex >= 5 ? '确认成卦' : '确认本爻'}</button>
            </div>
          </div>
        `}
        ${progress ? `
          <div class="mbp-liuyao-manual-history">
            <span>已录入</span>
            <div>${state.casts.map((cast, index) => cast ? `<i>${escapeHtml(`${lineLabels[index]} ${cast.value}${cast.name}${cast.mark || ''}`)}</i>` : '').join('')}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function syncProgress(count) {
    const progressText = $('#mbpLiuyaoProgressText');
    const progressBar = $('#mbpLiuyaoProgressBar');
    if (progressText) progressText.textContent = `${count >= 6 ? '已完成' : '已成'} ${count}/6 爻`;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, count / 6 * 100))}%`;
    const hasQuestion = Boolean(String($('#mbpLiuyaoQuestion')?.value || state.question || '').trim());
    document.querySelectorAll('[data-liuyao-step]').forEach((step) => {
      const key = step.dataset.liuyaoStep;
      step.classList.toggle('is-active',
        (key === 'question' && !hasQuestion)
        || (key === 'cast' && hasQuestion && count < 6)
        || (key === 'read' && count >= 6));
    });
  }

  function render() {
    const count = getProgress();
    const status = $('#mbpLiuyaoStatus');
    const toss = $('#mbpLiuyaoToss');
    const auto = $('#mbpLiuyaoAuto');
    const quota = $('#mbpLiuyaoQuota');
    const gateButton = $('#mbpLiuyaoGateSubmit');
    const gateBadge = $('#mbpLiuyaoGateBadge');
    const gateTags = $('#mbpLiuyaoGateTags');
    const gate = normalizeGate(state.questionGate, state.question);
    const ready = Boolean(gate?.allowed);
    const exhausted = normalizeQuota(state.quota).exhausted && !ready;
    if (status) {
      status.classList.toggle('is-error', exhausted || (Boolean(state.error) && !['ok', 'loading'].includes(state.statusTone)));
      status.classList.toggle('is-ok', state.statusTone === 'ok');
      status.classList.toggle('is-loading', state.statusTone === 'loading');
      status.textContent = state.error
        || (count >= 6 ? '已成卦，可看本卦、动爻、变卦。'
          : ready ? (count > 0 ? `审题已通过，已成 ${count}/6 爻，继续投${lineLabels[count]}。` : (gate?.reason || '审题通过，可以起卦。'))
            : (state.question ? '先点“提交审题”，通过后再起卦。' : '先写清一件事，或点示例问题自动填入。'));
      if (exhausted) status.textContent = '今日六爻占卜已满 3 次，明天再起卦。';
    }
    if (gateBadge) {
      const badgeMeta = getGateBadgeMeta();
      gateBadge.textContent = badgeMeta.label;
      gateBadge.className = `mbp-liuyao-gate-badge${badgeMeta.state ? ` is-${badgeMeta.state}` : ''}`;
    }
    if (gateButton) {
      const meta = getGateButtonMeta();
      gateButton.textContent = meta.label;
      gateButton.disabled = meta.disabled;
      gateButton.className = `mbp-liuyao-gate-submit${meta.state ? ` is-${meta.state}` : ''}`;
    }
    if (gateTags) {
      gateTags.innerHTML = getGateTags().map((item) => `<span>${escapeHtml(item)}</span>`).join('');
    }
    if (toss) {
      toss.disabled = state.mode !== 'online' || !ready || state.gateLoading || state.tossAnimation?.active || exhausted || count >= 6;
      toss.textContent = state.gateLoading ? '审题中…'
        : !ready ? '先提交审题'
          : state.mode !== 'online' ? '手动录入中'
            : count >= 6 ? '已成卦' : `投第 ${count + 1} 爻`;
      if (exhausted) toss.textContent = '今日已满';
    }
    if (auto) {
      auto.disabled = state.mode !== 'online' || !ready || state.gateLoading || state.tossAnimation?.active || exhausted || count >= 6;
      auto.textContent = exhausted ? '今日已满' : (!ready ? '待审题' : '一键成卦');
    }
    document.querySelectorAll('[data-liuyao-mode]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.liuyaoMode === state.mode);
    });
    if (quota) {
      const daily = normalizeQuota(state.quota);
      quota.textContent = state.quotaLoading ? '今日次数确认中…' : `今日次数 ${daily.used}/${daily.limit}`;
      quota.classList.toggle('is-empty', daily.remaining <= 0);
    }
    syncProgress(count);
    renderModePanel();
    renderCoins();
    renderStack();
    renderResult();
  }

  function reset() {
    questionText();
    state.casts = [];
    state.manualCoins = Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice());
    state.lastCoins = [];
    state.error = '';
    state.statusTone = '';
    state.questionGate = null;
    state.gateLoading = false;
    state.tossAnimation = null;
    state.drag = null;
    render();
  }

  async function ensureQuestionAllowed() {
    const question = questionText();
    const cached = normalizeGate(state.questionGate, question);
    if (cached?.allowed) {
      state.error = '';
      state.statusTone = 'ok';
      return true;
    }
    if (!question) {
      state.error = '先写清楚一件事，再起卦。';
      state.statusTone = '';
      render();
      $('#mbpLiuyaoQuestion')?.focus();
      return false;
    }
    if (normalizeQuota(state.quota).remaining <= 0) {
      state.error = '今日六爻占卜已满 3 次，明天再起卦。';
      state.statusTone = '';
      render();
      return false;
    }

    state.gateLoading = true;
    state.error = '正在接入后台审题，合格后才起卦。';
    state.statusTone = 'loading';
    render();
    try {
      const gate = normalizeGate(await reviewQuestion(question), question);
      state.questionGate = gate;
      if (gate?.quota) state.quota = normalizeQuota(gate.quota);
      if (gate?.allowed) {
        state.error = gate.reason || '审题通过，可以起卦。';
        state.statusTone = 'ok';
        return true;
      }
      state.error = `${gate?.reason || '问题还不够清楚，暂不起卦。'}${gate?.suggestion ? ` ${gate.suggestion}` : ''}`;
      state.statusTone = '';
      $('#mbpLiuyaoQuestion')?.focus();
      return false;
    } catch (_err) {
      state.error = '审题服务暂时不可用，请稍后再试。';
      state.statusTone = '';
      return false;
    } finally {
      state.gateLoading = false;
      render();
    }
  }

  function placeNextCast(cast) {
    const index = state.casts.findIndex((item) => !item);
    if (index >= 0) state.casts[index] = cast;
    else state.casts.push(cast);
    state.casts = state.casts.slice(0, 6);
    state.lastCoins = cast.coins;
    return index >= 0 ? index : state.casts.length - 1;
  }

  async function tossLine(power = LIUYAO_DEFAULT_POWER) {
    if (state.tossAnimation?.active) return;
    if (!await ensureQuestionAllowed()) return;
    if (getProgress() >= 6) return;
    state.mode = 'online';
    const cast = makeCast({ power });
    const lineIndex = state.casts.findIndex((item) => !item);
    state.tossAnimation = {
      active: true,
      cast,
      lineIndex: lineIndex >= 0 ? lineIndex : getProgress(),
      power: Math.round(power * 100),
    };
    state.lastCoins = cast.coins;
    render();
    window.setTimeout(() => {
      if (!state.tossAnimation?.active) return;
      placeNextCast(cast);
      state.tossAnimation = null;
      state.drag = null;
      render();
    }, LIUYAO_TOSS_ANIMATION_MS);
  }

  async function autoCast() {
    if (!await ensureQuestionAllowed()) return;
    state.mode = 'online';
    while (getProgress() < 6) {
      const cast = makeCast();
      placeNextCast(cast);
    }
    render();
  }

  function setMode(mode) {
    if (mode !== 'manual' && mode !== 'online') return;
    state.mode = mode;
    state.error = '';
    state.statusTone = '';
    render();
  }

  async function setManualCoin(lineIndex, coinIndex, face) {
    if (!await ensureQuestionAllowed()) return;
    ensureManualRows();
    const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
    const coin = Math.max(0, Math.min(2, Math.round(Number(coinIndex) || 0)));
    const value = Number(face) === 2 ? 2 : 3;
    state.mode = 'manual';
    while (state.casts.length < 6) state.casts.push(null);
    state.manualCoins[line][coin] = value;
    state.casts[line] = null;
    state.lastCoins = state.manualCoins[line].filter(Boolean);
    render();
  }

  async function confirmManualLine(lineIndex) {
    if (!await ensureQuestionAllowed()) return;
    ensureManualRows();
    const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
    const cast = makeCastFromCoins(state.manualCoins[line], { manual: true });
    if (!cast) return;
    state.mode = 'manual';
    while (state.casts.length < 6) state.casts.push(null);
    state.casts[line] = cast;
    state.manualCoins[line] = cast.coins.slice();
    state.lastCoins = cast.coins;
    state.error = line >= 5 ? '六爻已成，可看本卦、动爻、变卦。' : `已录入${lineLabels[line]}，继续录${lineLabels[line + 1]}。`;
    state.statusTone = 'ok';
    render();
  }

  function clearManualLine(lineIndex) {
    ensureManualRows();
    const line = Math.max(0, Math.min(5, Math.round(Number(lineIndex) || 0)));
    state.mode = 'manual';
    while (state.casts.length < 6) state.casts.push(null);
    state.manualCoins[line] = LIUYAO_MANUAL_EMPTY_COINS.slice();
    state.casts[line] = null;
    state.lastCoins = [];
    render();
  }

  function clearLastManualLine() {
    ensureManualRows();
    state.mode = 'manual';
    while (state.casts.length < 6) state.casts.push(null);
    for (let line = 5; line >= 0; line -= 1) {
      if (state.casts[line]) {
        state.manualCoins[line] = LIUYAO_MANUAL_EMPTY_COINS.slice();
        state.casts[line] = null;
        state.lastCoins = [];
        render();
        return;
      }
    }
  }

  function openXuChat() {
    const result = getResult();
    if (!result) return;
    const primaryReading = getHexReading(result.primary);
    const changedReading = getHexReading(result.changed);
    const primaryOriginal = getZhouyiOriginal(result.primary);
    const changedOriginal = getZhouyiOriginal(result.changed);
    const movingText = formatMovingText(result.movingLines);
    const context = {
      type: 'liuyao',
      recordId: makeUuid(),
      title: `六爻占卜：${result.primary?.name || '本卦'}${result.movingLines.length ? ` 之 ${result.changed?.name || '变卦'}` : ''}`,
      summaryLine: movingText,
      question: result.question,
      createdAt: Date.now(),
      castAtText: new Date().toLocaleString('zh-CN', { hour12: false }),
      primaryText: `${formatHexMeta(result.primary)} ${result.primary?.name || ''}`,
      changedText: `${formatHexMeta(result.changed)} ${result.changed?.name || ''}`,
      movingText,
      linesText: result.lines.map((line) => `${line.label}:${line.value}${line.name}${line.mark || ''}`).join('；'),
      primaryOriginalText: primaryOriginal.text,
      changedOriginalText: changedOriginal.text,
      primaryTip: firstReadableSentence(primaryReading.summary, '先看本卦所处局面。'),
      changedTip: result.movingLines.length ? firstReadableSentence(changedReading.summary, '变卦看后续走向。') : '无动爻时变卦与本卦同体，重在守当前局面。',
      advice: '先看本卦定当前，动爻看变化，变卦看趋势。',
    };
    try {
      sessionStorage.setItem(XU_CONTEXT_KEY, JSON.stringify(context));
    } catch (_err) {}
    window.location.href = './wentian-app.html#screen-4';
  }

  function bindEvents() {
    $('#mbpLiuyaoQuestion')?.addEventListener('input', () => {
      const nextQuestion = normalizeQuestion($('#mbpLiuyaoQuestion')?.value || '');
      const hadGate = Boolean(state.questionGate);
      if (state.question !== nextQuestion && state.casts.length) {
        state.casts = [];
        state.manualCoins = Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice());
        state.lastCoins = [];
      }
      state.question = nextQuestion;
      state.questionGate = null;
      state.error = nextQuestion && hadGate ? '改好后点“提交审题”，重新确认。' : '';
      state.statusTone = '';
      render();
    });
    document.querySelectorAll('[data-liuyao-question]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const textarea = $('#mbpLiuyaoQuestion');
        if (textarea) textarea.value = button.dataset.liuyaoQuestion || '';
        if (state.casts.length) {
          state.casts = [];
          state.manualCoins = Array.from({ length: 6 }, () => LIUYAO_MANUAL_EMPTY_COINS.slice());
          state.lastCoins = [];
        }
        state.question = normalizeQuestion(textarea?.value || '');
        state.questionGate = null;
        state.error = state.question ? '示例已填入，确认无误后点“提交审题”。' : '';
        state.statusTone = '';
        render();
        textarea?.focus();
      });
    });
    $('#mbpLiuyaoGateSubmit')?.addEventListener('click', ensureQuestionAllowed);
    $('#mbpLiuyaoToss')?.addEventListener('click', tossLine);
    $('#mbpLiuyaoAuto')?.addEventListener('click', autoCast);
    $('#mbpLiuyaoReset')?.addEventListener('click', reset);
    document.addEventListener('click', (event) => {
      const modeButton = event.target.closest('[data-liuyao-mode]');
      if (modeButton) {
        setMode(modeButton.dataset.liuyaoMode);
        return;
      }
      const manualCoin = event.target.closest('[data-manual-coin]');
      if (manualCoin) {
        setManualCoin(manualCoin.dataset.lineIndex, manualCoin.dataset.coinIndex, manualCoin.dataset.manualCoin);
        return;
      }
      const manualConfirm = event.target.closest('[data-manual-confirm]');
      if (manualConfirm) {
        confirmManualLine(manualConfirm.dataset.manualConfirm);
        return;
      }
      const manualClearLine = event.target.closest('[data-manual-clear-line]');
      if (manualClearLine) {
        clearManualLine(manualClearLine.dataset.manualClearLine);
        return;
      }
      if (event.target.closest('[data-manual-clear-last]')) {
        clearLastManualLine();
        return;
      }
      if (event.target.closest('#mbpLiuyaoAskXu')) {
        openXuChat();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      const stage = event.target.closest('#mbpLiuyaoCoinStage');
      if (!stage || stage.getAttribute('aria-disabled') === 'true' || state.tossAnimation?.active) return;
      state.drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, pull: 0, ready: false };
      stage.setPointerCapture?.(event.pointerId);
      renderCoins();
    });
    document.addEventListener('pointermove', (event) => {
      if (!state.drag || state.drag.id !== event.pointerId) return;
      const pull = Math.max(0, Math.min(LIUYAO_PULL_MAX, Math.round(state.drag.startY - event.clientY)));
      state.drag.pull = pull;
      state.drag.ready = pull >= Math.round(LIUYAO_PULL_MAX * LIUYAO_READY_POWER);
      renderCoins();
    });
    document.addEventListener('pointerup', (event) => {
      if (!state.drag || state.drag.id !== event.pointerId) return;
      const power = Math.max(LIUYAO_READY_POWER, Math.min(1, state.drag.pull / LIUYAO_PULL_MAX));
      const shouldToss = state.drag.ready;
      state.drag = null;
      if (shouldToss) tossLine(power);
      else renderCoins();
    });
    document.addEventListener('keydown', (event) => {
      if (event.target?.id === 'mbpLiuyaoCoinStage' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        tossLine();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    render();
    if (window.SITE_CONFIG?.liuyaoQuotaRefresh === true) refreshQuota();
  });
}());
