(function () {
  const $ = (selector) => document.querySelector(selector);
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
    casts: [],
    lastCoins: [],
    error: '',
    statusTone: '',
    questionGate: null,
    gateLoading: false,
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
      6: { name: '老阴', broken: true, moving: true },
      7: { name: '少阳', broken: false, moving: false },
      8: { name: '少阴', broken: true, moving: false },
      9: { name: '老阳', broken: false, moving: true },
    }[Number(value)] || null;
  }

  function makeCast() {
    const coins = Array.from({ length: 3 }, () => (Math.random() < 0.5 ? 2 : 3));
    const value = coins.reduce((sum, coin) => sum + coin, 0);
    return { value, coins, ...lineType(value) };
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
      checkedAt: Date.now(),
    };
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
      const response = await fetch(`${getAiBackendBase()}/api/ai/liuyao-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          chatMode: 'liuyao_question_gate',
          divinationContext: { type: 'liuyao_question_gate', question },
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
      return localGate;
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
    return {
      question: state.question,
      primary: resolveHex(casts, false),
      changed: resolveHex(casts, true),
      movingLines: casts
        .map((cast, index) => ({ ...cast, index, label: lineLabels[index] }))
        .filter((line) => line.moving),
    };
  }

  function renderCoins() {
    const coins = $('#mbpLiuyaoCoins');
    if (!coins) return;
    const values = state.lastCoins.length ? state.lastCoins : [null, null, null];
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
      const text = type ? `${type.name}${type.moving ? '动' : '静'}` : '待投';
      return `
        <div class="mbp-liuyao-line-row">
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
    const text = result.question
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
      <p class="mbp-liuyao-note">问事：${escapeHtml(text)}先看本卦定当前，动爻看变化，变卦看趋势。</p>
    `;
  }

  function syncProgress(count) {
    const progressText = $('#mbpLiuyaoProgressText');
    const progressBar = $('#mbpLiuyaoProgressBar');
    if (progressText) progressText.textContent = `${count} / 6`;
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
    const count = state.casts.length;
    const status = $('#mbpLiuyaoStatus');
    const toss = $('#mbpLiuyaoToss');
    const auto = $('#mbpLiuyaoAuto');
    if (status) {
      status.classList.toggle('is-error', Boolean(state.error) && !['ok', 'loading'].includes(state.statusTone));
      status.classList.toggle('is-ok', state.statusTone === 'ok');
      status.classList.toggle('is-loading', state.statusTone === 'loading');
      status.textContent = state.error
        || (count >= 6 ? '已成卦，可看本卦、动爻、变卦。' : `已成 ${count}/6 爻，下一步投${lineLabels[count]}。`);
    }
    if (toss) {
      toss.disabled = state.gateLoading || count >= 6;
      toss.textContent = state.gateLoading ? '审题中…' : count >= 6 ? '已成卦' : `投第 ${count + 1} 爻`;
    }
    if (auto) {
      auto.disabled = state.gateLoading || count >= 6;
    }
    syncProgress(count);
    renderCoins();
    renderStack();
    renderResult();
  }

  function reset() {
    questionText();
    state.casts = [];
    state.lastCoins = [];
    state.error = '';
    state.statusTone = '';
    state.questionGate = null;
    state.gateLoading = false;
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

    state.gateLoading = true;
    state.error = '正在接入后台审题，合格后才起卦。';
    state.statusTone = 'loading';
    render();
    try {
      const gate = normalizeGate(await reviewQuestion(question), question);
      state.questionGate = gate;
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

  async function tossLine() {
    if (!await ensureQuestionAllowed()) return;
    if (state.casts.length >= 6) return;
    const cast = makeCast();
    state.casts.push(cast);
    state.lastCoins = cast.coins;
    render();
  }

  async function autoCast() {
    if (!await ensureQuestionAllowed()) return;
    while (state.casts.length < 6) {
      const cast = makeCast();
      state.casts.push(cast);
      state.lastCoins = cast.coins;
    }
    render();
  }

  function bindEvents() {
    $('#mbpLiuyaoQuestion')?.addEventListener('input', () => {
      const nextQuestion = normalizeQuestion($('#mbpLiuyaoQuestion')?.value || '');
      if (state.question !== nextQuestion && state.casts.length) {
        state.casts = [];
        state.lastCoins = [];
      }
      state.question = nextQuestion;
      state.questionGate = null;
      state.error = '';
      state.statusTone = '';
      render();
    });
    document.querySelectorAll('[data-liuyao-question]').forEach((button) => {
      button.addEventListener('click', () => {
        const textarea = $('#mbpLiuyaoQuestion');
        if (textarea) textarea.value = button.dataset.liuyaoQuestion || '';
        if (state.casts.length) {
          state.casts = [];
          state.lastCoins = [];
        }
        state.question = normalizeQuestion(textarea?.value || '');
        state.questionGate = null;
        state.error = '';
        state.statusTone = '';
        render();
        textarea?.focus();
      });
    });
    $('#mbpLiuyaoToss')?.addEventListener('click', tossLine);
    $('#mbpLiuyaoAuto')?.addEventListener('click', autoCast);
    $('#mbpLiuyaoReset')?.addEventListener('click', reset);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    render();
  });
}());
