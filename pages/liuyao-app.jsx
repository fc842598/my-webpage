const { useState, useEffect, useRef, useCallback } = React;

/* ─── Color Tokens ─── */
const C = {
  bg:          '#C8B888',  // rich warm parchment
  surface:     '#F2E8D0',  // deep cream
  primary:     '#5C1008',  // deep burgundy
  primaryDark: '#3E0A05',
  primarySoft: 'rgba(92,16,8,0.10)',
  gold:        '#946208',  // antique gold
  goldDeep:    '#724C06',
  goldBg:      '#E6D4A8',
  goldBorder:  '#C8B46E',
  text:        '#1C0A06',
  text2:       '#6A4020',
  text3:       '#A07840',
  border:      'rgba(100,58,16,0.11)',
  shadow:      '0 2px 14px rgba(60,28,8,0.13)',
};

const TOSS_COOLDOWN_MS = 450;
const MOTION_SINGLE_LINE_LOCK_MS = 1800;
const MOTION_REARM_STILL_MS = 900;
const LIUYAO_DAILY_LIMIT = 3;
const LIUYAO_QUESTION_MAX_LENGTH = 120;
const LIUYAO_CLIENT_ID_KEY = 'ziwei_client_id';
const LIUYAO_STATE_KEY = 'wentian-liuyao-v2-state-v1';

function makeUuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getClientId() {
  try {
    let id = localStorage.getItem(LIUYAO_CLIENT_ID_KEY);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id || '')) {
      id = makeUuid();
      localStorage.setItem(LIUYAO_CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'global';
  }
}

function normalizeQuestion(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, LIUYAO_QUESTION_MAX_LENGTH);
}

function normalizeQuota(raw) {
  if (raw?.testingUnlimited) {
    const limit = Math.max(1, Number(raw?.limit || raw?.dailyLimit || 999));
    const used = Math.max(0, Number(raw?.used ?? raw?.dailyUsed ?? 0));
    return {
      limit,
      used,
      remaining: limit,
      dailyLimit: limit,
      dailyUsed: used,
      dailyRemaining: limit,
      date: String(raw?.date || ''),
      exhausted: false,
      testingUnlimited: true,
      unlimitedUntil: raw?.unlimitedUntil || '',
      checkedAt: Number(raw?.checkedAt) || Date.now(),
    };
  }
  const limit = Math.max(1, Number(raw?.limit || raw?.dailyLimit || LIUYAO_DAILY_LIMIT));
  const used = Math.max(0, Number(raw?.used ?? raw?.dailyUsed ?? 0));
  const remaining = Math.max(0, Number(raw?.remaining ?? raw?.dailyRemaining ?? (limit - used)));
  return { limit, used, remaining, date: String(raw?.date || ''), exhausted: remaining <= 0, checkedAt: Number(raw?.checkedAt) || Date.now() };
}

function formatQuotaTagText(raw) {
  const quota = normalizeQuota(raw);
  const isEn = new URLSearchParams(window.location.search).get('lang') === 'en'
    || localStorage.getItem('wentian-app-language-v1') === 'en';
  if (quota.testingUnlimited) return isEn ? 'Test unlimited' : '测试不限';
  if (quota.remaining <= 0) return isEn ? 'No uses left today' : '今日已满';
  return isEn ? `${quota.remaining} left today` : `今日还余${quota.remaining}次`;
}

function mergeQuota(currentRaw, nextRaw) {
  const next = normalizeQuota(nextRaw);
  if (next.testingUnlimited) return next;
  if (!currentRaw) return next;
  const current = normalizeQuota(currentRaw);
  const sameDate = (current.date && next.date && current.date === next.date) || (!current.date && !next.date);
  return sameDate && next.used < current.used ? current : next;
}

function loadStoredQuota() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIUYAO_STATE_KEY) || 'null');
    return parsed?.quota ? normalizeQuota(parsed.quota) : normalizeQuota();
  } catch {
    return normalizeQuota();
  }
}

function saveStoredQuota(quota) {
  try {
    localStorage.setItem(LIUYAO_STATE_KEY, JSON.stringify({ quota: normalizeQuota(quota), updatedAt: Date.now() }));
  } catch {}
}

function parseGateJson(text) {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : raw;
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(source.slice(start, end + 1)); } catch { return null; }
}

function localQuestionGate(question) {
  const normalizedQuestion = normalizeQuestion(question);
  const compact = normalizedQuestion.replace(/[\s，。！？、,.!?'"“”‘’（）()[\]]+/g, '');
  const fail = (reason, suggestion, retryable = true) => ({ allowed:false, normalizedQuestion, reason, suggestion, retryable, labels:['一事一卦'] });
  if (!normalizedQuestion) return fail('请先写清楚要问的一件事。', '一句话只问一件具体事情，再起卦。');
  if (compact.length < 4) return fail('问题还不够具体，暂不起卦。', '请写清对象、事件和想看的结果。');
  const hasReadableText = /[\u4e00-\u9fffA-Za-z]/.test(compact);
  const onlyNumbersOrSymbols = !hasReadableText || /^[0-9０-９\-_.:：/\\]+$/.test(compact);
  if (onlyNumbersOrSymbols) {
    return fail('占问内容无效，暂不起卦。', '请用一句完整的话写清楚要问的事，例如：这次面试能通过吗？');
  }
  if (/^(随便|随机|娱乐|玩玩|试试|测试|乱点|看看|测一下|试一试|test|demo|random)$/i.test(compact)) {
    return fail('这个问题太随意，暂不起卦。', '请写清具体对象和想看的结果。');
  }
  const looksLikeCasualChat = /(宝宝|宝贝|亲爱的|老公|老婆|在吗|忙吗|吃了吗|睡了吗|下课了吗|上课了吗|到家了吗|回来了吗|想我吗|爱我吗|有没有空|你是不是|是不是你|是不是在|哈哈|呵呵|嘻嘻|早安|晚安)/i.test(normalizedQuestion);
  const hasDivinationMatter = /(项目|合作|客户|合同|订单|面试|考试|offer|录取|工作|离职|跳槽|创业|开店|上线|发布|推进|签约|回款|到账|投资|财运|感情|婚姻|复合|分手|怀孕|健康|手术|治疗|搬家|买房|卖房|租房|官司|家宅|父母|孩子|伴侣|对象|关系)/i.test(normalizedQuestion);
  if (looksLikeCasualChat && !hasDivinationMatter) {
    return fail('这句话更像日常聊天，不属于正式占问。', '请改成一件需要判断结果的事情，例如：这段关系这个月还能不能推进？');
  }
  const hasQuestionCue = /[？?]|吗|呢|能不能|能否|是否|可否|会不会|要不要|该不该|适不适合|成不成|有没有|如何|怎样|怎么样|结果|通过|合格|及格|过线|过关|考过|考上|拿证|拿到|录取|顺利|成交|签约|复合|结婚|分手|离职|跳槽|搬家|买|卖|租|开店|上线|发布|推进|合作|投资|到账|怀孕|好转/.test(normalizedQuestion);
  if (!hasQuestionCue) {
    return fail('占问还没有明确结果，暂不起卦。', '请写成一句明确的问题，例如：这次面试能通过吗？');
  }
  if ((normalizedQuestion.match(/[？?]/g) || []).length > 1 || /同时|另外|还有|以及|顺便/.test(normalizedQuestion)) {
    return fail('一次只问一件事。', '请先删到一个核心问题，再提交。');
  }
  return { allowed:true, normalizedQuestion, reason:'审题通过，可以起卦。', suggestion:'', retryable:true, labels:['一事一卦'] };
}

function getApiBase() {
  return String(window.SITE_CONFIG?.aiBackendBase || 'https://api.yuetianai.com').replace(/\/+$/, '');
}

function getWentianAuthToken() {
  try {
    const session = JSON.parse(localStorage.getItem('wentian-app-auth-session-v1') || 'null');
    return session?.access_token || '';
  } catch {
    return '';
  }
}

async function postJson(path, payload, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('request timeout', 'TimeoutError')), timeoutMs);
  const authToken = getWentianAuthToken();
  const headers = { 'Content-Type':'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      method:'POST',
      headers,
      body:JSON.stringify(payload),
      signal:controller.signal,
    });
    const contentType = String(res.headers.get('content-type') || '');
    const data = contentType.includes('application/json') ? await res.json() : { error: await res.text() };
    if (!res.ok || data.error) throw new Error(data.error || `request failed ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function refreshRemoteQuota(currentQuota) {
  const clientId = getClientId();
  const data = await postJson('/api/ai/liuyao-question', {
    action:'quota',
    clientId,
    divinationContext:{ type:'liuyao_quota', clientId },
  }, 6000);
  return data?.quota ? mergeQuota(currentQuota, data.quota) : normalizeQuota(currentQuota);
}

async function reviewQuestion(question, currentQuota) {
  const local = localQuestionGate(question);
  if (String(window.SITE_CONFIG?.liuyaoQuestionGateMode || 'remote').toLowerCase() === 'local') {
    return { ...local, quota: normalizeQuota(currentQuota) };
  }
  if (!local.allowed) return { ...local, quota: normalizeQuota(currentQuota) };
  const clientId = getClientId();
  try {
    const data = await postJson('/api/ai/liuyao-question', {
      question,
      clientId,
      chatMode:'liuyao_question_gate',
      divinationContext:{ type:'liuyao_question_gate', question, clientId, recordId:makeUuid() },
    }, 6000);
    const gate = typeof data?.allowed === 'boolean' ? data : (parseGateJson(data?.reply) || local);
    return { ...gate, quota: data?.quota || gate.quota || currentQuota };
  } catch {
    const quota = normalizeQuota(currentQuota);
    return quota.remaining > 0
      ? { ...local, allowed:true, reason:'本地审题通过，可以起卦。后台次数稍后同步。', quota }
      : { allowed:false, normalizedQuestion:question, reason:'今日六爻占卜已满 3 次，明天再起卦。', suggestion:'', retryable:false, quota };
  }
}

const LIUYAO_TYPE_TEXT = {
  6: '老阴',
  7: '少阳',
  8: '少阴',
  9: '老阳',
};

function buildLiuyaoReadingPayload({ question, vals, results }) {
  const hex = getHexInfo(vals);
  const dynamic = getDynamic(vals);
  const changedHex = dynamic.length > 0 ? getChangedHex(vals) : null;
  const lines = vals.map((value, index) => {
    const type = YAO_TYPES[value] || {};
    const source = results?.[index] || {};
    return {
      index: index + 1,
      label: YAO_LABELS[index],
      value,
      type: LIUYAO_TYPE_TEXT[value] || type.name || String(value),
      yinYang: type.isYin ? '阴' : '阳',
      moving: value === 6 || value === 9,
      coins: source.coins || null,
    };
  });
  const dynamicLines = dynamic.map(index => lines[index]).filter(Boolean);
  return {
    moduleKey: 'liuyao_reading',
    chartData: {
      type: 'liuyao',
      source: 'liuyao-v2',
      question,
      method: results?.some(item => Array.isArray(item?.coins)) ? 'online_coin' : 'manual',
      hex: {
        number: hex.number,
        name: hex.name,
        fullName: hex.fullName,
        upper: { index: hex.upper, name: TRIGRAM_NAMES[hex.upper], nature: TRIGRAM_NATURE[hex.upper] },
        lower: { index: hex.lower, name: TRIGRAM_NAMES[hex.lower], nature: TRIGRAM_NATURE[hex.lower] },
      },
      changedHex: changedHex ? {
        number: changedHex.number,
        name: changedHex.name,
        fullName: changedHex.fullName,
        upper: { index: changedHex.upper, name: TRIGRAM_NAMES[changedHex.upper], nature: TRIGRAM_NATURE[changedHex.upper] },
        lower: { index: changedHex.lower, name: TRIGRAM_NAMES[changedHex.lower], nature: TRIGRAM_NATURE[changedHex.lower] },
      } : null,
      upper: `${TRIGRAM_NAMES[hex.upper]}(${TRIGRAM_NATURE[hex.upper]})`,
      lower: `${TRIGRAM_NAMES[hex.lower]}(${TRIGRAM_NATURE[hex.lower]})`,
      lines,
      dynamicLines,
      generatedAt: new Date().toISOString(),
    },
    extraParams: {
      source: 'liuyao-v2',
      liuyao: { question, lines, dynamicLines },
    },
  };
}

function flattenReadingResponse(data, fallback) {
  const card = data?.card;
  if (card?.sections?.length) {
    const sections = card.sections
      .map(item => `${item.title ? `【${item.title}】\n` : ''}${item.content || ''}`.trim())
      .filter(Boolean);
    if (card.risk) sections.push(`【提醒】\n${card.risk}`);
    return sections.join('\n\n') || fallback;
  }
  return String(data?.finalAnswer || data?.rawResponse || data?.reply || fallback || '').trim();
}

async function fetchLiuyaoReading({ question, vals, results }) {
  const payload = buildLiuyaoReadingPayload({ question, vals, results });
  return postJson('/api/ai/run', payload, 60000);
}

const YAO_TYPE_INFO = {
  9: { name: '老阳', dynamic: true,  mark: '○', isYin: false },
  8: { name: '少阴', dynamic: false, mark: '',  isYin: true  },
  7: { name: '少阳', dynamic: false, mark: '',  isYin: false },
  6: { name: '老阴', dynamic: true,  mark: '×', isYin: true  },
};

/* ─── Header ─── */
function Header({ title, onBack, rightLabel, onRight, quota }) {
  const quotaText = formatQuotaTagText(quota && typeof quota === 'object' ? quota : {
    limit: LIUYAO_DAILY_LIMIT,
    used: Number(quota || 0),
  });
  return (
    <header style={{
      position:'sticky', top:0, zIndex:30, flexShrink:0, height:68,
      display:'grid', gridTemplateColumns:'112px 1fr 84px', alignItems:'center',
      padding:'12px 18px 10px', borderBottom:'1px solid rgba(194,149,60,.24)',
      background:'linear-gradient(180deg,#fffdf8 0%,#fbf3e5 100%)',
      boxShadow:'0 8px 18px rgba(126,88,42,.08)',
    }}>
      <button onClick={onBack} aria-label="返回阅天首页" style={{
        width:92, height:38, border:'1px solid rgba(194,149,60,.28)', borderRadius:19,
        background:'linear-gradient(180deg,#fffdf7 0%,#fbf1df 100%)',
        boxShadow:'0 8px 18px rgba(126,88,42,.12), inset 0 1px 0 rgba(255,255,255,.8)',
        display:'flex', alignItems:'center', justifyContent:'center', gap:4,
        color:'#96533d', fontSize:14, fontWeight:700, cursor:'pointer', padding:0,
      }}>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        返回
      </button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, minWidth:0 }}>
        <span style={{ fontSize:22, fontWeight:900, letterSpacing:0, color:'#25221f', fontFamily:"'Noto Serif SC','Songti SC',serif", whiteSpace:'nowrap' }}>{title}</span>
        {quota !== undefined && (
          <span style={{
            height:22, display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontSize:10, color:'#9a681c', padding:'0 8px', background:'#fff5e6',
            borderRadius:999, fontWeight:900, border:'1px solid rgba(210,166,90,.38)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.72)', whiteSpace:'nowrap'
          }}>{quotaText}</span>
        )}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        {rightLabel && <button onClick={onRight} style={{
          minWidth:58, height:32, border:'1px solid rgba(194,149,60,.24)', borderRadius:16,
          background:'rgba(255,253,248,.78)', color:'#9a681c', fontSize:13, fontWeight:800,
          cursor:'pointer', padding:'0 12px'
        }}>{rightLabel}</button>}
      </div>
    </header>
  );
}

function BottomNavIcon({ kind, active }) {
  const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  };
  const dot = { fill: 'currentColor', stroke: 'none' };
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false"
      style={{ display:'block', filter:active ? 'drop-shadow(0 7px 10px rgba(163,49,41,.16))' : 'none' }}>
      {active && <circle cx="20" cy="20" r="16" fill="#fff2d9" stroke="#d19b43" strokeWidth="1.2" />}
      {kind === 'archive' ? (
        <>
          <path d="M13 9.5h15.5l2 2V31H13c-2 0-3.5-1.4-3.5-3.5V13c0-2.1 1.4-3.5 3.5-3.5Z" {...line} />
          <path d="M28.5 9.5v6H31" {...line} />
          <path d="M14.5 17.5h9M14.5 22.5h11M14.5 27.5h7" {...line} />
          <path d="M10 13.2c2.8 1.4 5.6 1.4 8.4 0" {...line} />
        </>
      ) : kind === 'ai' ? (
        <>
          <circle cx="20" cy="20" r="10.5" {...line} />
          <path d="M20 7.5c6.5 3.2 7.1 8.7.9 12.4-6.2 3.8-5.7 9.2 1.1 12.6" {...line} />
          <path d="M20 7.5c-6.5 3.2-7.1 8.7-.9 12.4 6.2 3.8 5.7 9.2-1.1 12.6" {...line} />
          <circle cx="20" cy="13.2" r="1.7" {...dot} />
          <circle cx="20" cy="26.8" r="1.7" {...dot} />
          <path d="M10.4 20h19.2" {...line} />
        </>
      ) : kind === 'mine' ? (
        <>
          <path d="M20 9.2c3.4 0 6.1 2.7 6.1 6s-2.7 6-6.1 6-6.1-2.7-6.1-6 2.7-6 6.1-6Z" {...line} />
          <path d="M10.8 31.5c2.1-5.4 5.2-8 9.2-8s7.1 2.6 9.2 8" {...line} />
          <path d="M11.8 31.5h16.4" {...line} />
          <circle cx="27.8" cy="9.8" r="1.2" {...dot} />
        </>
      ) : (
        <>
          <circle cx="20" cy="20" r="12.5" {...line} />
          <circle cx="20" cy="20" r="4.2" {...line} />
          <path d="M20 6.5v5M20 28.5v5M6.5 20h5M28.5 20h5" {...line} />
          <path d="M11.8 28.2 28.2 11.8" {...line} />
          <circle cx="29" cy="27" r="1.3" {...dot} />
        </>
      )}
    </svg>
  );
}

/* ─── Tab Bar ─── */
function TabBar() {
  const go = (route) => { window.location.href = `./wentian-app.html#${route}`; };
  const tabs = [
    { label:'首页', route:'screen-1', active:true, kind:'home' },
    { label:'档案', route:'screen-25', kind:'archive' },
    { label:'阅天AI', route:'screen-3', kind:'ai' },
    { label:'我的', route:'screen-31', kind:'mine' },
  ];
  return (
    <nav style={{
      display:'grid', gridTemplateColumns:'repeat(4, 1fr)', flexShrink:0,
      minHeight:'89px',
      borderTop:'1px solid rgba(232,222,205,.9)',
      background:'linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,250,241,.98))',
      boxShadow:'0 -4px 14px rgba(62,38,18,.07)',
      padding:'6px 0 max(8px, env(safe-area-inset-bottom))',
      zIndex:25,
    }} aria-label="阅天底部导航">
      {tabs.map(t => (
        <button key={t.label} type="button" onClick={() => go(t.route)} aria-current={t.active ? 'page' : undefined} style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:2, minWidth:0, minHeight:72, border:0, background:'transparent',
          color:t.active ? '#a33129' : '#8c857b', cursor:'pointer', padding:'0 2px',
        }}>
          <BottomNavIcon kind={t.kind} active={t.active} />
          <span style={{ fontSize:12, lineHeight:1.08, fontWeight:t.active ? 800 : 500 }}>{t.label}</span>
          <i aria-hidden="true" style={{ width:18, height:3, borderRadius:999, background:t.active ? '#a33129' : 'transparent', opacity:.72, marginTop:4 }} />
        </button>
      ))}
    </nav>
  );
}

/* ─── Step 0: Question ─── */
function QuestionStep({ question, setQuestion, onSubmit, reviewing, gateMessage, quota }) {
  const valid = question.trim().length >= 4;
  const quotaInfo = normalizeQuota(quota);
  const disabled = !valid || reviewing || quotaInfo.remaining <= 0;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'26px 20px 24px' }}>
      <p style={{ fontSize:24, fontWeight:700, fontFamily:"'Noto Serif SC',serif", color:C.text, lineHeight:1.4, marginBottom:6 }}>你想问什么？</p>
      <p style={{ fontSize:14, color:C.text2, marginBottom:18 }}>一事一卦，越具体越准</p>
      <div style={{ background:C.surface, borderRadius:16, padding:'14px 16px 10px', boxShadow:C.shadow, display:'flex', flexDirection:'column', height:128, flexShrink:0 }}>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="例如：这周面试能顺利通过吗？" autoFocus rows={3} maxLength={LIUYAO_QUESTION_MAX_LENGTH}
          style={{ fontFamily:'inherit', fontSize:16, lineHeight:1.55, border:'none', outline:'none', resize:'none', background:'transparent', color:C.text, flex:1, width:'100%', minHeight:0 }}/>
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:6 }}>
          <span style={{ fontSize:12, color:valid ? C.gold : C.text3, transition:'color 0.2s' }}>{question.length} 字</span>
        </div>
      </div>
      <div style={{ minHeight:42, padding:'10px 2px 0', color:gateMessage?.tone === 'error' ? '#8e2f25' : gateMessage?.tone === 'ok' ? C.goldDeep : C.text2, fontSize:12, lineHeight:1.55 }}>
        {reviewing ? (
          <span style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
            <span className="liuyao-thinking-dot"></span>
            大模型正在审题，请稍候
          </span>
        ) : (gateMessage?.text || formatQuotaTagText(quotaInfo))}
      </div>
      <button onClick={onSubmit} disabled={disabled} style={{
        width:'100%', padding:'15px 0', marginTop:10, borderRadius:14, border:'none',
        background: !disabled ? `linear-gradient(135deg,${C.primary} 0%,#A33020 100%)` : '#DDD0C0',
        color: !disabled ? '#fff' : C.text3, fontSize:17, fontWeight:600,
        cursor: !disabled ? 'pointer' : 'default', letterSpacing:2, transition:'all 0.25s',
        boxShadow: !disabled ? '0 4px 18px rgba(107,29,16,0.3)' : 'none', fontFamily:'inherit',
      }}>{reviewing ? (
        <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:9 }}>
          <span className="liuyao-review-spinner"></span>
          审题中
        </span>
      ) : quotaInfo.remaining <= 0 ? '今日已满' : '提交占问'}</button>
    </div>
  );
}

/* ─── Trigram mark ─── */
function Trigram({ x, y, lines }) {
  const col = "rgba(50,30,2,0.75)";
  const lw = 1.3, hw = 7, br = 1.8, sp = 3;
  const ys = [-sp, 0, sp];
  return (
    <g>
      {lines.map((solid, i) => {
        const ly = y + ys[i];
        return solid
          ? <line key={i} x1={x-hw} y1={ly} x2={x+hw} y2={ly} stroke={col} strokeWidth={lw} strokeLinecap="round"/>
          : <g key={i}><line x1={x-hw} y1={ly} x2={x-br} y2={ly} stroke={col} strokeWidth={lw} strokeLinecap="round"/><line x1={x+br} y1={ly} x2={x+hw} y2={ly} stroke={col} strokeWidth={lw} strokeLinecap="round"/></g>;
      })}
    </g>
  );
}

/* ─── Brass Bagua Turtle Shell SVG ─── */
function VesselSVG() {
  const cx = 100, cy = 70, r = 27;
  // 先天八卦 positions, radius r from (cx,cy)
  const trig = [
    [cx,       cy-r,            [true, true, true]],           // 乾 ☰ top
    [cx+r*.707,cy-r*.707,       [false, true, true]],          // 兑 ☱ top-right
    [cx+r,     cy,              [true, false, true]],           // 离 ☲ right
    [cx+r*.707,cy+r*.707,       [false, false, true]],         // 震 ☳ bottom-right
    [cx,       cy+r,            [false, false, false]],        // 坤 ☷ bottom
    [cx-r*.707,cy+r*.707,       [true, true, false]],          // 巽 ☴ bottom-left
    [cx-r,     cy,              [false, true, false]],         // 坎 ☵ left
    [cx-r*.707,cy-r*.707,       [true, false, false]],         // 艮 ☶ top-left
  ];
  return (
    <svg width="200" height="148" viewBox="0 0 200 148" style={{ display:'block' }}>
      <defs>
        <radialGradient id="dG" cx="33%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#F4E454"/>
          <stop offset="18%"  stopColor="#D8AE28"/>
          <stop offset="48%"  stopColor="#9C7414"/>
          <stop offset="75%"  stopColor="#634808"/>
          <stop offset="100%" stopColor="#2C1C04"/>
        </radialGradient>
        <radialGradient id="rG" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="#8A6A10"/>
          <stop offset="100%" stopColor="#1E1204"/>
        </radialGradient>
        <radialGradient id="iG" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F0DC40"/>
          <stop offset="60%"  stopColor="#B08818"/>
          <stop offset="100%" stopColor="#5A3C08"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="143" rx="74" ry="8" fill="rgba(0,0,0,0.3)"/>

      {/* Shell bottom rim / depth */}
      <ellipse cx="100" cy="110" rx="80" ry="19" fill="url(#rG)"/>

      {/* Main dome surface */}
      <ellipse cx="100" cy="70" rx="80" ry="48" fill="url(#dG)"/>

      {/* ── Shell carapace segment lines ── */}
      {/* Central vertebral scute */}
      <path d="M100 44 L123 57 L123 83 L100 96 L77 83 L77 57 Z"
            fill="rgba(35,22,2,0.22)" stroke="rgba(35,22,2,0.65)" strokeWidth="2"/>
      {/* Left costal 1 */}
      <path d="M77 57 L54 46 L40 68 L54 83 L77 83" fill="none" stroke="rgba(35,22,2,0.5)" strokeWidth="1.6"/>
      {/* Left costal 2 */}
      <path d="M54 46 L42 27 L20 40 L18 68 L40 68" fill="none" stroke="rgba(35,22,2,0.38)" strokeWidth="1.4"/>
      {/* Right costal 1 */}
      <path d="M123 57 L146 46 L160 68 L146 83 L123 83" fill="none" stroke="rgba(35,22,2,0.5)" strokeWidth="1.6"/>
      {/* Right costal 2 */}
      <path d="M146 46 L158 27 L180 40 L182 68 L160 68" fill="none" stroke="rgba(35,22,2,0.38)" strokeWidth="1.4"/>
      {/* Bottom row */}
      <path d="M40 68 L54 83 L77 96 L100 102 L123 96 L146 83 L160 68" fill="none" stroke="rgba(35,22,2,0.42)" strokeWidth="1.4"/>

      {/* ── 8 Trigrams ── */}
      {trig.map(([x, y, lines], i) => <Trigram key={i} x={x} y={y} lines={lines}/>)}

      {/* ── Yin-Yang center ── */}
      <g transform={`translate(${cx},${cy})`}>
        <circle r="13" fill="rgba(22,14,2,0.78)" stroke="rgba(170,130,14,0.55)" strokeWidth="1.3"/>
        <path d="M0,-12 A12,12 0 0,1 0,12 A6,6 0 0,1 0,0 A6,6 0 0,0 0,-12 Z" fill="#C8A01C" opacity="0.88"/>
        <circle cx="0" cy="-6" r="2.2" fill="rgba(16,10,0,0.85)"/>
        <circle cx="0" cy="6"  r="2.2" fill="#C8A01C" opacity="0.88"/>
        <circle r="13" fill="none" stroke="rgba(160,120,10,0.45)" strokeWidth="0.8"/>
      </g>

      {/* Brass shine / highlight */}
      <ellipse cx="68" cy="48" rx="27" ry="15" fill="rgba(255,248,160,0.13)"/>
      {/* Outer edge glow */}
      <ellipse cx="100" cy="70" rx="80" ry="48" fill="none" stroke="rgba(200,165,22,0.38)" strokeWidth="2"/>
    </svg>
  );
}

/* ─── Ancient Coin Face ─── */
function CoinFace({ isHeads, uid }) {
  const gId = `cg${uid}`;
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" style={{ display:'block' }}>
      <defs>
        <radialGradient id={gId} cx="36%" cy="30%" r="68%">
          <stop offset="0%"   stopColor={isHeads ? "#F0E048" : "#C4960E"}/>
          <stop offset="30%"  stopColor={isHeads ? "#C8A01C" : "#9A7210"}/>
          <stop offset="65%"  stopColor={isHeads ? "#8A6810" : "#6A4C08"}/>
          <stop offset="100%" stopColor="#2C1C04"/>
        </radialGradient>
      </defs>
      {/* Ground shadow */}
      <ellipse cx="27" cy="51" rx="21" ry="3.5" fill="rgba(0,0,0,0.2)"/>
      {/* Main coin disk */}
      <circle cx="27" cy="26" r="24" fill={`url(#${gId})`}/>
      {/* Outer raised rim */}
      <circle cx="27" cy="26" r="24" fill="none" stroke="rgba(40,26,2,0.55)" strokeWidth="2"/>
      {/* Inner rim */}
      <circle cx="27" cy="26" r="19" fill="none" stroke="rgba(40,26,2,0.35)" strokeWidth="1.2"/>
      {/* Square hole */}
      <rect x="22.2" y="21.2" width="9.6" height="9.6" fill="rgba(12,7,0,0.96)" rx="0.8"/>
      {isHeads ? (
        /* 正 — 乾隆通宝 */
        <>
          <text x="27" y="17.5" textAnchor="middle" fill="rgba(25,15,2,0.82)" fontSize="7.8" fontWeight="bold" fontFamily="'Noto Serif SC',serif" letterSpacing="-0.5">通</text>
          <text x="27" y="38.5" textAnchor="middle" fill="rgba(25,15,2,0.82)" fontSize="7.8" fontWeight="bold" fontFamily="'Noto Serif SC',serif" letterSpacing="-0.5">宝</text>
          <text x="16"  y="29"   textAnchor="middle" fill="rgba(25,15,2,0.82)" fontSize="7.8" fontWeight="bold" fontFamily="'Noto Serif SC',serif">乾</text>
          <text x="38"  y="29"   textAnchor="middle" fill="rgba(25,15,2,0.82)" fontSize="7.8" fontWeight="bold" fontFamily="'Noto Serif SC',serif">隆</text>
        </>
      ) : (
        /* 反 — plain back with cross marks */
        <>
          <line x1="14" y1="26" x2="22.2" y2="26" stroke="rgba(25,15,2,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="31.8" y1="26" x2="40" y2="26" stroke="rgba(25,15,2,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="27" y1="14" x2="27" y2="21.2" stroke="rgba(25,15,2,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="27" y1="30.8" x2="27" y2="38" stroke="rgba(25,15,2,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
        </>
      )}
      {/* Highlight */}
      <ellipse cx="18" cy="16" rx="8" ry="5" fill="rgba(255,248,160,0.2)"/>
    </svg>
  );
}

/* ─── Flying / Settled Coin ─── */
function FlyingCoin({ index, animPhase, isHeads }) {
  const flyAnims = ['flyL', 'flyC', 'flyR'];
  const isFlying  = animPhase === 'flying' || animPhase === 'settled';
  const isSettled = animPhase === 'settled';

  return (
    <div style={{
      position:'absolute',
      left:'50%', top:62,
      marginLeft:-27, marginTop:-27,
      width:54, height:54,
      animation: isFlying
        ? `${flyAnims[index]} 0.88s cubic-bezier(0.15,0.8,0.22,1) ${index*0.09}s forwards`
        : 'none',
      zIndex:5,
    }}>
      {isFlying && <CoinFace isHeads={isSettled ? isHeads : false} uid={`${index}`}/>}
    </div>
  );
}

/* ─── Shake Scene (real 3D — Three.js) ─── */
function ShakeScene({ onlinePhase, coins, curYao, onTrigger, onTossComplete, shakeReady, onEnableShake, lastResult }) {
  const mountRef   = useRef(null);
  const sceneRef   = useRef(null);
  const runningRef = useRef(false);
  const triggerLockRef = useRef(false);
  const motionArmedRef = useRef(true);
  const lastTriggerAtRef = useRef(0);
  const lastMotionTossAtRef = useRef(0);
  const motionStillSinceRef = useRef(0);
  const cbRef      = useRef(onTossComplete);
  cbRef.current    = onTossComplete;

  const audioRef = useRef(null);
  const lastHapticRef = useRef(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = window.DivinationAudio ? new window.DivinationAudio() : null;
    }
  }, []);

  const playSound = useCallback((type) => {
    if (!audioRef.current) return;
    if (type === 'shake') audioRef.current.shake();
    else if (type === 'pour') audioRef.current.pour();
    else if (type === 'spin') audioRef.current.spin();
    else if (type === 'settle') audioRef.current.settle();
  }, []);

  const hapticFeedback = useCallback((type) => {
    const now = performance.now();
    if (now - lastHapticRef.current < 20) return; // debounce
    lastHapticRef.current = now;
    if (!window.Haptic) return;
    if (type === 'power') window.Haptic.intensity(Math.min(powerRef.current, 1));
    else if (type === 'settle') window.Haptic.settle();
    else if (type === 'full') window.Haptic.full();
  }, []);

  const [power, setPower]         = useState(0);
  const [lastCoins, setLastCoins] = useState(null);
  const powerRef  = useRef(0);
  const dragRef   = useRef({ active: false, lastX: 0, lastY: 0, velX: 0, velY: 0 });
  const lastMotionRef = useRef(null);

  const requestToss = useCallback((source) => {
    const now = performance.now();
    if (triggerLockRef.current || runningRef.current || onlinePhase !== 'idle' || curYao >= 6) return false;
    if (now - lastTriggerAtRef.current < TOSS_COOLDOWN_MS) return false;
    if (source === 'motion' && now - lastMotionTossAtRef.current < MOTION_SINGLE_LINE_LOCK_MS) return false;
    triggerLockRef.current = true;
    motionArmedRef.current = source !== 'motion';
    lastTriggerAtRef.current = now;
    if (source === 'motion') lastMotionTossAtRef.current = now;
    motionStillSinceRef.current = 0;
    powerRef.current = 0;
    setPower(0);
    if (sceneRef.current) sceneRef.current.setShakePower(0);
    if (audioRef.current?.resume) audioRef.current.resume();
    onTrigger();
    return true;
  }, [onlinePhase, curYao, onTrigger]);

  // mount 3D scene once
  useEffect(() => {
    if (!window.TurtleScene || !mountRef.current) return;
    const sc = window.TurtleScene(mountRef.current);
    sceneRef.current = sc;
    sc.setIdle();
    return () => { try { sc.dispose(); } catch(e) {} };
  }, []);

  // power decay (idle desktop)
  useEffect(() => {
    if (!shakeReady || onlinePhase !== 'idle' || curYao >= 6) return;
    const iv = setInterval(() => {
      const np = Math.max(0, powerRef.current - 0.016);
      powerRef.current = np; setPower(np);
      if (sceneRef.current) sceneRef.current.setShakePower(np);
    }, 50);
    return () => clearInterval(iv);
  }, [shakeReady, onlinePhase, curYao]);

  // DeviceMotion → power (mobile)
  useEffect(() => {
    if (!shakeReady || onlinePhase !== 'idle' || curYao >= 6) return;
    const h = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const cur = { x:a.x || 0, y:a.y || 0, z:a.z || 0 };
      const prev = lastMotionRef.current;
      lastMotionRef.current = cur;
      if (!prev) return;
      const jerk = Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y) + Math.abs(cur.z - prev.z);
      const now = performance.now();
      if (runningRef.current || onlinePhase !== 'idle' || curYao >= 6) {
        if (powerRef.current !== 0) {
          powerRef.current = 0;
          setPower(0);
          if (sceneRef.current) sceneRef.current.setShakePower(0);
        }
        return;
      }
      if (jerk < 1.6 && powerRef.current < 0.18) {
        if (!motionStillSinceRef.current) motionStillSinceRef.current = now;
        if (now - motionStillSinceRef.current > MOTION_REARM_STILL_MS) motionArmedRef.current = true;
      } else {
        motionStillSinceRef.current = 0;
      }
      if (!motionArmedRef.current) {
        if (powerRef.current !== 0) {
          powerRef.current = 0;
          setPower(0);
          if (sceneRef.current) sceneRef.current.setShakePower(0);
        }
        return;
      }
      const impulse = Math.max(0, jerk - 9.5);
      if (impulse <= 0) return;
      const np = Math.min(1, powerRef.current + impulse * 0.07);
      powerRef.current = np; setPower(np);
      hapticFeedback('power');
      if (sceneRef.current) sceneRef.current.setShakePower(np);
      if (np >= 0.94 && motionArmedRef.current) {
        const started = requestToss('motion');
        if (!started) {
          powerRef.current = 0;
          setPower(0);
          if (sceneRef.current) sceneRef.current.setShakePower(0);
        }
      }
    };
    window.addEventListener('devicemotion', h);
    return () => window.removeEventListener('devicemotion', h);
  }, [shakeReady, onlinePhase, curYao, requestToss, hapticFeedback]);

  useEffect(() => {
    if (onlinePhase !== 'idle' || curYao >= 6) return;
    const timer = setTimeout(() => {
      triggerLockRef.current = false;
      motionArmedRef.current = true;
      motionStillSinceRef.current = 0;
      lastMotionRef.current = null;
      powerRef.current = 0;
      setPower(0);
      if (sceneRef.current) sceneRef.current.setShakePower(0);
    }, TOSS_COOLDOWN_MS);
    return () => clearTimeout(timer);
  }, [onlinePhase, curYao]);

  // trigger 3D toss when phase → 'shaking'
  useEffect(() => {
    if (onlinePhase === 'shaking' && !runningRef.current && sceneRef.current) {
      runningRef.current = true;
      powerRef.current = 0; setPower(0);
      sceneRef.current.setShakePower(0);
      playSound('shake');
      hapticFeedback('full');
      const captured = coins; // capture before async
      // Setup pour sound trigger during animation
      if (audioRef.current) {
        setTimeout(() => { playSound('pour'); }, 820);
        setTimeout(() => { playSound('spin'); }, 1180);
      }
      sceneRef.current.toss(captured, (result) => {
        finishToss(result || captured);
      });

      let finished = false;
      const fallback = setTimeout(() => finishToss(captured), 3600);
      function finishToss(res) {
        if (finished) return;
        finished = true;
        clearTimeout(fallback);
        runningRef.current = false;
        triggerLockRef.current = true;
        setLastCoins(res);
        playSound('settle');
        hapticFeedback('settle');
        if (cbRef.current) cbRef.current(res);
      }
    }
  }, [onlinePhase]);

  // ── Desktop drag-to-shake handlers ──
  const onPtrDown = useCallback((e) => {
    if (triggerLockRef.current || onlinePhase === 'shaking' || curYao >= 6) return;
    audioRef.current?.resume?.();
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY, velX: 0, velY: 0 };
  }, [onlinePhase, curYao]);

  const onPtrMove = useCallback((e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX, dy = e.clientY - d.lastY;
    d.velX = dx; d.velY = dy;
    d.lastX = e.clientX; d.lastY = e.clientY;
    const speed = Math.sqrt(dx*dx + dy*dy);
    const np = Math.min(1, powerRef.current + speed * 0.028);
    powerRef.current = np; setPower(np);
    hapticFeedback('power');
    if (sceneRef.current) {
      sceneRef.current.setShakePower(np);
      sceneRef.current.setDragBias(Math.atan2(dy, dx));
    }
    if (np >= 0.94) {
      dragRef.current.active = false;
      requestToss('drag');
    }
  }, [requestToss]);

  const onPtrUp = useCallback((e) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const { velX, velY } = dragRef.current;
    const speed = Math.sqrt(velX*velX + velY*velY);
    if (sceneRef.current) sceneRef.current.setDragBias(Math.atan2(velY, velX));
    if (onlinePhase !== 'shaking' && curYao < 6) {
      if (powerRef.current > 0.65 || speed > 14) requestToss('drag');
    }
  }, [onlinePhase, curYao, requestToss]);

  const done      = curYao >= 6;
  const isShaking = onlinePhase === 'shaking';
  const isCharged = power >= 0.92;
  const lt        = lastResult ? YAO_TYPE_INFO[lastResult] : null;
  const RC=70, RR=58, RS=7;
  const circ = 2 * Math.PI * RR;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ position:'relative', width:280, height:270 }}>
        {/* Power ring */}
        {!done && shakeReady && (
          <div style={{ position:'absolute', left:'50%', top:16, transform:'translateX(-50%)', width:RC*2, height:RC*2, zIndex:8, pointerEvents:'none' }}>
            <svg width={RC*2} height={RC*2} viewBox={`0 0 ${RC*2} ${RC*2}`}>
              <circle cx={RC} cy={RC} r={RR} fill="none" stroke="rgba(180,140,30,0.13)" strokeWidth={RS}/>
              <circle cx={RC} cy={RC} r={RR} fill="none"
                stroke={isCharged ? '#F0C840' : '#C8941A'}
                strokeWidth={RS}
                strokeDasharray={`${circ * power} ${circ}`}
                strokeDashoffset={circ * 0.25}
                strokeLinecap="round"
                style={{ transition:'stroke-dasharray 0.08s ease, stroke 0.18s', filter: isCharged ? 'drop-shadow(0 0 7px #F0C840)' : 'none' }}
              />
              {power > 0.06 && (
                <text x={RC} y={RC+6} textAnchor="middle"
                  fill={isCharged ? '#F0C840' : '#C8941A'}
                  fontSize="15" fontWeight="700" fontFamily="-apple-system,sans-serif">
                  {Math.round(power*100)}%
                </text>
              )}
            </svg>
          </div>
        )}
        {/* Ripple rings when idle + low power */}
        {!isShaking && !done && power < 0.05 && (
          <div style={{ position:'absolute', width:140, height:140, left:'50%', top:44, transform:'translateX(-50%)', borderRadius:'50%', pointerEvents:'none', zIndex:1 }}>
            <div className="ripple-ring"/><div className="ripple-ring"/><div className="ripple-ring"/>
          </div>
        )}
        {/* 3D canvas with drag handlers */}
        <div ref={mountRef}
          onClick={() => !isShaking && !done && !dragRef.current.active && requestToss('tap')}
          onPointerDown={onPtrDown}
          onPointerMove={onPtrMove}
          onPointerUp={onPtrUp}
          onPointerLeave={onPtrUp}
          style={{ position:'absolute', inset:0, zIndex:2, cursor:(!isShaking && !done) ? 'grab' : 'default', touchAction:'none' }}/>
        {/* Done overlay */}
        {done && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, zIndex:3, background:'rgba(253,250,245,0.78)' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill={C.goldBg} stroke={C.goldBorder} strokeWidth="1.5"/>
              <text x="24" y="31" textAnchor="middle" fill={C.gold} fontSize="20" fontFamily="'Noto Serif SC',serif" fontWeight="700">卦</text>
            </svg>
            <p style={{ fontSize:15, fontWeight:600, color:C.primary }}>六爻已成</p>
          </div>
        )}
      </div>

      {/* 正/反 result labels */}
      {lastCoins && !isShaking && !done && (
        <div style={{ display:'flex', justifyContent:'center', marginTop:-14, marginBottom:0 }}>
          <div style={{
            display:'inline-flex',
            alignItems:'center',
            gap:8,
            padding:'8px 12px',
            borderRadius:18,
            background:'rgba(255,250,241,0.88)',
            border:`1px solid ${C.border}`,
            boxShadow:'0 6px 14px rgba(120,84,26,0.06)',
          }}>
            {lastCoins.map((isHeads, i) => (
              <div key={`compact-${i}`} style={{
                width:28,
                height:28,
                borderRadius:'50%',
                background: isHeads ? 'linear-gradient(135deg,#D4B050,#9A6E20)' : C.goldBg,
                border: isHeads ? 'none' : `1px solid ${C.goldBorder}`,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:13,
                fontWeight:700,
                fontFamily:"'Noto Serif SC',serif",
                color: isHeads ? '#fff' : C.gold,
              }}>{isHeads ? '正' : '反'}</div>
            ))}
            {lastResult && (
              <div style={{
                display:'inline-flex',
                alignItems:'center',
                padding:'0 12px',
                height:28,
                borderRadius:16,
                background:C.goldBg,
                border:`1px solid ${C.goldBorder}`,
                color:C.gold,
                fontSize:13,
                fontWeight:700,
                whiteSpace:'nowrap',
              }}>
                {lastResult}点 / {YAO_TYPE_INFO[lastResult]?.name}
              </div>
            )}
          </div>
        </div>
      )}

      {false && lastCoins && !isShaking && !done && (
        <div style={{ display:'flex', justifyContent:'center', marginTop:-10, marginBottom:-2 }}>
          {lastCoins.map((isHeads, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center' }}>
              <div style={{
                width:29, height:29, borderRadius:'50%',
                background: isHeads ? 'linear-gradient(135deg,#D4B050,#9A6E20)' : C.goldBg,
                border: isHeads ? 'none' : `1.5px solid ${C.goldBorder}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, fontWeight:700, fontFamily:"'Noto Serif SC',serif",
                color: isHeads ? '#fff' : C.gold,
              }}>{isHeads ? '正' : '反'}</div>
            </div>
          ))}
          {lastResult && (
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:4, marginLeft:8, padding:'0 12px', height:30, borderRadius:16, background:C.goldBg, border:`1px solid ${C.goldBorder}`, whiteSpace:'nowrap' }}>
              <span style={{ fontSize:14, fontWeight:700, color:C.gold }}>{lastResult}点</span>
              <span style={{ fontSize:13, color:C.gold, fontWeight:700 }}>· {YAO_TYPE_INFO[lastResult]?.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Hint text */}
      {!isShaking && !done && (
        <div style={{ textAlign:'center', marginTop:2, minHeight:22, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
          {shakeReady ? (
            <>
              <p style={{ fontSize:12, color:C.text2, fontWeight:500, lineHeight:1.35 }}>
                {isCharged ? '充能完成，自动起卦' : power > 0.35 ? '加速摇动中…' : '拖动 / 摇机 / 点龟起卦'}
              </p>
              {power > 0.05 && (
                <div style={{ display:'flex', gap:5 }}>
                  {[0.25,0.5,0.75,1.0].map(v => (
                    <div key={`compact-power-${v}`} style={{ width:7, height:7, borderRadius:'50%', background: power >= v ? C.gold : C.border, transition:'background 0.12s', boxShadow: power >= v && power > 0.8 ? `0 0 5px ${C.gold}` : 'none' }}/>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <p style={{ fontSize:12, color:C.text2, lineHeight:1.35 }}>拖动或点龟起卦</p>
              <button onClick={onEnableShake} style={{ background:'none', border:`1px solid ${C.goldBorder}`, padding:'5px 18px', borderRadius:20, fontSize:12, color:C.gold, cursor:'pointer', fontFamily:'inherit' }}>开启摇一摇</button>
            </div>
          )}
        </div>
      )}
      {isShaking && <p style={{ fontSize:13, color:C.text2, fontWeight:500, textAlign:'center', marginTop:2 }}>铜钱滚出中…</p>}

      <div style={{ display:'none', textAlign:'center', marginTop:2, minHeight:30, flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
        {!isShaking && !done && (
          shakeReady ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <p style={{ fontSize:12, color:C.text2, fontWeight:500, lineHeight:1.35 }}>
                {isCharged ? '🔥 充能完成，自动起卦！' : power > 0.35 ? '⚡ 加速摇动…' : '拖动 / 摇手机充能，点击即刻起卦'}
              </p>
              {power > 0.05 && (
                <div style={{ display:'flex', gap:5 }}>
                  {[0.25,0.5,0.75,1.0].map(v => (
                    <div key={v} style={{ width:7, height:7, borderRadius:'50%', background: power >= v ? C.gold : C.border, transition:'background 0.12s', boxShadow: power >= v && power > 0.8 ? `0 0 5px ${C.gold}` : 'none' }}/>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <p style={{ fontSize:13, color:C.text2 }}>拖动或点击龟甲即可起卦</p>
              <button onClick={onEnableShake} style={{ background:'none', border:`1px solid ${C.goldBorder}`, padding:'5px 18px', borderRadius:20, fontSize:12, color:C.gold, cursor:'pointer', fontFamily:'inherit' }}>📱 开启摇一摇</button>
            </div>
          )
        )}
        {isShaking && <p style={{ fontSize:14, color:C.text2, fontWeight:500 }}>铜钱滚出…</p>}
      </div>
    </div>
  );
}

/* ─── Hexagram lines visual ─── */
function HexLines({ results, large }) {
  const W=large?92:60, H=large?5:4, G=large?10:7, SP=large?12:8;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:SP, alignItems:'center' }}>
      {[5,4,3,2,1,0].map(i => {
        const r = results[i];
        const t = r ? YAO_TYPE_INFO[r.value] : null;
        const col = r ? (t.dynamic ? C.gold : (large ? 'rgba(255,255,255,0.88)' : C.text)) : C.border;
        return (
          <div key={i} style={{ display:'flex', gap:G, width:W }}>
            {t?.isYin
              ? <><div style={{ flex:1, height:H, background:col, borderRadius:H/2, transition:'background 0.3s' }}/><div style={{ flex:1, height:H, background:col, borderRadius:H/2, transition:'background 0.3s' }}/></>
              : <div style={{ flex:1, height:H, background:col, borderRadius:H/2, transition:'background 0.3s' }}/>
            }
          </div>
        );
      })}
    </div>
  );
}

/* ─── Online Cast ─── */
function OnlineCast({ results, curYao, phase, coins, onToss, onTossComplete, shakeReady, onEnableShake, lastResult }) {
  return (
    <div style={{ background:C.surface, borderRadius:18, padding:'20px 20px 22px', boxShadow:C.shadow }}>
      <div style={{ display:'flex', justifyContent:'center', gap:7, marginBottom:14 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:'50%', background: i<curYao ? C.primary : i===curYao ? C.gold : C.border, transition:'background 0.3s' }}/>
        ))}
      </div>
      <ShakeScene onlinePhase={phase} coins={coins} curYao={curYao} onTrigger={onToss} onTossComplete={onTossComplete} shakeReady={shakeReady} onEnableShake={onEnableShake} lastResult={lastResult}/>
      {results.length > 0 && (
        <div style={{ marginTop:6, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
          <p style={{ fontSize:11, color:C.text3, textAlign:'center', marginBottom:8, letterSpacing:1 }}>卦象成形</p>
          <HexLines results={results} large={false}/>
        </div>
      )}
    </div>
  );
}

/* ─── Manual Cast (compact — hex + labels inline) ─── */
function ManualCast({ results, onConfirmYao, onUndoLast }) {
  const cur  = results.length;
  const done = cur >= 6;
  const [coins, setCoins] = useState([null, null, null]);
  useEffect(() => { setCoins([null, null, null]); }, [cur]);

  const toggle = i => setCoins(prev => {
    const n = [...prev]; n[i] = n[i]===null ? true : n[i]===true ? false : null; return n;
  });
  const allSet   = coins.every(c => c !== null);
  const yaoValue = allSet ? coins.reduce((s,c) => s+(c?3:2), 0) : null;
  const yaoType  = yaoValue ? YAO_TYPE_INFO[yaoValue] : null;

  return (
    <div style={{ background:C.surface, borderRadius:18, overflow:'hidden', boxShadow:C.shadow }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 18px', borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:14, fontWeight:700, color:C.text }}>
          {done ? '六爻录入完成' : `录入${YAO_LABELS[cur]}`}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {results.length > 0 && (
            <button onClick={onUndoLast} style={{ background:'none', border:`1px solid ${C.goldBorder}`, padding:'3px 10px', borderRadius:14, fontSize:11, color:C.gold, cursor:'pointer', fontFamily:'inherit' }}>撤回</button>
          )}
          <span style={{ fontSize:12, color:C.gold, padding:'2px 10px', background:C.goldBg, borderRadius:14, fontWeight:700, border:`1px solid ${C.goldBorder}` }}>{cur}/6</span>
        </div>
      </div>

      {/* Hex lines with inline labels */}
      <div style={{ padding:'8px 18px 6px' }}>
        {[5,4,3,2,1,0].map(i => {
          const r = results[i];
          const t = r ? YAO_TYPE_INFO[r.value] : null;
          const isCurrent = i === cur && !done;
          const col = r ? (t.dynamic ? C.gold : C.text) : (isCurrent ? C.goldBorder : C.border);
          return (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'5px 8px', borderRadius:8, marginBottom:1,
              background: isCurrent ? C.goldBg : 'transparent',
              transition:'background 0.25s',
            }}>
              <span style={{ fontSize:11, width:28, color: isCurrent ? C.gold : (r ? C.text3 : C.border), fontWeight: isCurrent ? 700 : 400, flexShrink:0, textAlign:'right' }}>{YAO_LABELS[i]}</span>
              <div style={{ display:'flex', gap:8, flex:1, alignItems:'center' }}>
                {t?.isYin ? (
                  <><div style={{ flex:1, height:5, background:col, borderRadius:2.5, transition:'background 0.3s' }}/><div style={{ flex:1, height:5, background:col, borderRadius:2.5, transition:'background 0.3s' }}/></>
                ) : (
                  <div style={{ flex:1, height:5, background:col, borderRadius:2.5, transition:'background 0.3s' }}/>
                )}
              </div>
              <span style={{ fontSize:11, width:62, textAlign:'right', flexShrink:0, color: r ? (t.dynamic ? C.gold : C.text2) : (isCurrent ? C.gold : C.border), fontWeight: r && t.dynamic ? 700 : 400 }}>
                {r ? `${r.value}${t.name}${t.mark}` : isCurrent ? '← 录入' : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Coin input or done state */}
      {!done ? (
        <div style={{ padding:'10px 18px 16px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:10, marginBottom:10 }}>
            {[0,1,2].map(i => {
              const v = coins[i];
              return (
                <button key={i} onClick={() => toggle(i)} style={{
                  flex:1, height:54, borderRadius:10,
                  background: v===true ? 'linear-gradient(135deg,#D4B050,#9A6E20)' : v===false ? C.goldBg : '#EAE0CC',
                  color: v===true ? '#fff' : v===false ? C.gold : C.text3,
                  fontSize: v===null ? 22 : 17, fontWeight:700,
                  fontFamily:"'Noto Serif SC',serif",
                  cursor:'pointer', transition:'all 0.18s',
                  border: v===null ? `1.5px dashed ${C.border}` : 'none',
                  boxShadow: v===true ? '0 3px 12px rgba(160,110,32,0.28)' : 'none',
                }}>{v===true ? '正' : v===false ? '反' : '？'}</button>
              );
            })}
          </div>
          {allSet && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'7px 12px', background:C.goldBg, borderRadius:8, marginBottom:10 }}>
              <span style={{ fontSize:13, color:C.text2 }}>{YAO_LABELS[cur]}</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.gold }}>{yaoValue} · {yaoType?.name}{yaoType?.mark}</span>
            </div>
          )}
          <button onClick={() => allSet && onConfirmYao({ coins, value:yaoValue })} disabled={!allSet} style={{
            width:'100%', padding:'13px 0', borderRadius:10, border:'none',
            background: allSet ? `linear-gradient(135deg,${C.primary},#A33020)` : '#E0D4BC',
            color: allSet ? '#fff' : C.text3,
            fontSize:15, fontWeight:600, cursor: allSet ? 'pointer' : 'default',
            transition:'all 0.2s', fontFamily:'inherit',
            boxShadow: allSet ? '0 3px 12px rgba(92,16,8,0.22)' : 'none',
          }}>确认 · 下一爻</button>
        </div>
      ) : (
        <div style={{ padding:'12px 18px 16px', borderTop:`1px solid ${C.border}` }}>
          <button onClick={onUndoLast} style={{ width:'100%', padding:'12px 0', borderRadius:10, border:`1px solid ${C.goldBorder}`, background:C.goldBg, color:C.gold, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>重录上一爻</button>
        </div>
      )}
    </div>
  );
}

/* ─── Cast Step ─── */
function CastStep({ question, method, setMethod, onlineResults, onlineCur, onlinePhase, onlineCoins, onToss, onTossComplete, lastResult, manualResults, onManualConfirm, onManualUndo, shakeReady, onEnableShake }) {
  const canSwitch = onlineResults.length === 0 && manualResults.length === 0;
  const shouldCollapseMode = method === 'coin' && onlineResults.length > 0;
  return (
    <div style={{ flex:1, padding:'8px 20px 28px', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, alignSelf:'flex-start', background:C.surface, padding:'6px 10px', borderRadius:24, boxShadow:C.shadow, maxWidth:'100%' }}>
        <span style={{ fontSize:10, fontWeight:900, color:C.goldDeep, background:'rgba(148,98,8,0.10)', border:'1px solid rgba(148,98,8,0.12)', borderRadius:999, padding:'2px 6px', lineHeight:1.1, whiteSpace:'nowrap', flexShrink:0 }}>所占之事</span>
        <div style={{ width:6, height:6, borderRadius:'50%', background:C.gold, flexShrink:0 }}></div>
        <span style={{ fontSize:12, color:C.text2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{question}</span>
      </div>
      {!shouldCollapseMode && (
        <div style={{ background:C.surface, borderRadius:15, padding:'10px 12px', boxShadow:C.shadow }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>起卦方式</span>
            {!canSwitch && <span style={{ fontSize:12, color:C.text3 }}>{method==='coin'?'在线投币':'手动起卦'}</span>}
          </div>
          <div style={{ display:'flex', gap:7 }}>
            {['coin','manual'].map(m => {
              const active = method === m;
              return (
                <button key={m} onClick={() => canSwitch && setMethod(m)} style={{
                  flex:1, padding:'8px 0', borderRadius:10,
                  background: active ? C.goldBg : 'transparent',
                  border: active ? `1.5px solid ${C.goldBorder}` : `1px solid ${C.border}`,
                  color: active ? C.gold : C.text3,
                  fontSize:13, fontWeight:active?800:500,
                  cursor: canSwitch ? 'pointer' : 'default',
                  transition:'all 0.2s', fontFamily:'inherit',
                }}>{m==='coin'?'在线投币':'手动起卦'}</button>
              );
            })}
          </div>
        </div>
      )}
      {method==='coin'
        ? <OnlineCast results={onlineResults} curYao={onlineCur} phase={onlinePhase} coins={onlineCoins} onToss={onToss} onTossComplete={onTossComplete} shakeReady={shakeReady} onEnableShake={onEnableShake} lastResult={lastResult}/>
        : <ManualCast results={manualResults} onConfirmYao={onManualConfirm} onUndoLast={onManualUndo}/>
      }
    </div>
  );
}

/* ─── Typing Text ─── */
function TypingText({ text, speed=18 }) {
  const [len, setLen] = useState(0);
  useEffect(() => { setLen(0); }, [text]);
  useEffect(() => {
    if (len < text.length) { const t = setTimeout(() => setLen(l => l+1), speed); return () => clearTimeout(t); }
  }, [len, text, speed]);
  return (
    <span style={{ whiteSpace:'pre-wrap' }}>
      {text.slice(0, len)}
      {len < text.length && <span style={{ animation:'pulse 0.7s infinite', color:C.gold }}>▎</span>}
    </span>
  );
}

/* ─── Result Step ─── */
function ResultStep({ vals, question, results }) {
  const hex   = getHexInfo(vals);
  const dyn   = getDynamic(vals);
  const chHex = dyn.length > 0 ? getChangedHex(vals) : null;
  const fallbackAi = genAIText(hex, chHex, dyn, question);
  const [ai, setAi] = useState('');
  const [loadingAi, setLoadingAi] = useState(true);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    let alive = true;
    setAi('');
    setAiError('');
    setLoadingAi(true);
    fetchLiuyaoReading({ question, vals, results })
      .then(data => {
        if (!alive) return;
        setAi(flattenReadingResponse(data, fallbackAi) || fallbackAi);
      })
      .catch(() => {
        if (!alive) return;
        setAiError('后台解卦暂时繁忙，先显示基础解读。');
        setAi(fallbackAi);
      })
      .finally(() => {
        if (alive) setLoadingAi(false);
      });
    return () => { alive = false; };
  }, [question, vals.join('-')]);

  return (
    <div style={{ flex:1, padding:'20px 20px 32px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ background:`linear-gradient(160deg,${C.primaryDark} 0%,${C.primary} 50%,#B06030 100%)`, borderRadius:20, padding:'30px 24px 28px', display:'flex', flexDirection:'column', alignItems:'center', boxShadow:'0 8px 28px rgba(60,15,8,0.22)' }}>
        <HexLines results={vals.map(v => ({ value:v }))} large={true}/>
        <div style={{ marginTop:22, textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.42)', letterSpacing:2 }}>第 {hex.number} 卦</div>
          <h2 style={{ fontSize:38, fontWeight:700, fontFamily:"'Noto Serif SC',serif", letterSpacing:8, color:'#fff', marginTop:6, marginBottom:4 }}>{hex.name}</h2>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)' }}>{hex.fullName}</div>
          <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:12, fontSize:12, color:'rgba(255,255,255,0.35)' }}>
            <span>{TRIGRAM_NAMES[hex.upper]}（{TRIGRAM_NATURE[hex.upper]}）上</span>
            <span>·</span>
            <span>{TRIGRAM_NAMES[hex.lower]}（{TRIGRAM_NATURE[hex.lower]}）下</span>
          </div>
        </div>
      </div>
      {chHex && (
        <div style={{ background:C.surface, borderRadius:14, padding:'14px 18px', boxShadow:C.shadow, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:C.text3, marginBottom:3 }}>本卦</div>
            <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Noto Serif SC',serif" }}>{hex.name}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10h8M11 7l3 3-3 3" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', justifyContent:'center' }}>
              {dyn.map(i => <span key={i} style={{ fontSize:10, color:C.gold, background:C.goldBg, padding:'1px 6px', borderRadius:10, border:`1px solid ${C.goldBorder}` }}>{YAO_LABELS[i]}</span>)}
            </div>
          </div>
          <div style={{ flex:1, textAlign:'right' }}>
            <div style={{ fontSize:11, color:C.text3, marginBottom:3 }}>变卦</div>
            <div style={{ fontSize:16, fontWeight:700, fontFamily:"'Noto Serif SC',serif" }}>{chHex.name}</div>
          </div>
        </div>
      )}
      <div style={{ background:C.surface, borderRadius:16, padding:'18px 20px', boxShadow:C.shadow }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#D4B050,#9A6E20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>许</div>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text }}>许大师 解卦</div>
            <div style={{ fontSize:11, color:C.text3 }}>AI 命理分析</div>
          </div>
        </div>
        {loadingAi && !ai && (
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:C.text3, lineHeight:1.8, marginBottom:8 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.gold, boxShadow:'0 0 0 5px rgba(148,98,8,.10)', animation:'pulse 0.9s infinite' }}></span>
            大模型正在解卦，请稍等...
          </div>
        )}
        {aiError && <div style={{ fontSize:12, color:C.text3, marginBottom:8 }}>{aiError}</div>}
        <div style={{ fontSize:14, lineHeight:2, color:C.text }}><TypingText text={ai} speed={18}/></div>
      </div>
      <div style={{ height:8 }}></div>
    </div>
  );
}

/* ─── Root App ─── */
function App() {
  const [step, setStep]                   = useState(0);
  const [question, setQuestion]           = useState('');
  const [method, setMethod]               = useState('coin');
  const [onlineResults, setOnlineResults] = useState([]);
  const [onlineCur, setOnlineCur]         = useState(0);
  const [onlinePhase, setOnlinePhase]     = useState('idle');
  const [onlineCoins, setOnlineCoins]     = useState(null);
  const [lastResult, setLastResult]       = useState(null);
  const [manualResults, setManualResults] = useState([]);
  const [shakeReady, setShakeReady]       = useState(false);
  const [quota, setQuota]                 = useState(() => loadStoredQuota());
  const [questionGate, setQuestionGate]   = useState(null);
  const [reviewing, setReviewing]         = useState(false);
  const tossInFlightRef = useRef(false);
  const tossCooldownRef = useRef(null);

  useEffect(() => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission !== 'function') {
      setShakeReady(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (tossCooldownRef.current) clearTimeout(tossCooldownRef.current);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    refreshRemoteQuota(quota)
      .then((nextQuota) => {
        if (!alive) return;
        setQuota(nextQuota);
        saveStoredQuota(nextQuota);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    setQuestionGate(null);
  }, [question]);

  const enableShake = useCallback(async () => {
    try { window.DivinationAudio?.unlock?.(); } catch(e) {}
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try { const p = await DeviceMotionEvent.requestPermission(); if (p === 'granted') setShakeReady(true); } catch(e) {}
    } else { setShakeReady(true); }
  }, []);

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
      return;
    }
    if (document.referrer && document.referrer.includes(window.location.origin)) {
      window.history.back();
      return;
    }
    window.location.href = './wentian-app.html#screen-1';
  };

  const handleReset = () => {
    tossInFlightRef.current = false;
    if (tossCooldownRef.current) clearTimeout(tossCooldownRef.current);
    setStep(0); setQuestion(''); setMethod('coin');
    setOnlineResults([]); setOnlineCur(0); setOnlinePhase('idle'); setOnlineCoins(null); setLastResult(null);
    setManualResults([]); setQuestionGate(null); setReviewing(false);
  };

  const handleQuestionSubmit = useCallback(async () => {
    try { window.DivinationAudio?.unlock?.(); } catch(e) {}
    const clean = normalizeQuestion(question);
    if (!clean || reviewing) return;
    const quotaInfo = normalizeQuota(quota);
    if (quotaInfo.remaining <= 0) {
      setQuestionGate({ allowed:false, reason:'今日六爻占卜已满 3 次，明天再起卦。', suggestion:'', retryable:false, quota:quotaInfo });
      return;
    }
    setQuestion(clean);
    setReviewing(true);
    setQuestionGate({ allowed:false, reason:'正在审题，合格后才能起卦。', suggestion:'', retryable:true, quota:quotaInfo, loading:true });
    try {
      const result = await reviewQuestion(clean, quotaInfo);
      const nextQuota = result?.quota ? mergeQuota(quotaInfo, result.quota) : quotaInfo;
      setQuota(nextQuota);
      saveStoredQuota(nextQuota);
      setQuestionGate(result);
      if (result?.allowed) {
        setOnlineResults([]); setOnlineCur(0); setOnlinePhase('idle'); setOnlineCoins(null); setLastResult(null);
        setManualResults([]);
        setStep(1);
      }
    } finally {
      setReviewing(false);
    }
  }, [question, reviewing, quota]);

  const handleToss = useCallback(() => {
    if (tossInFlightRef.current || onlinePhase !== 'idle' || onlineCur >= 6 || step !== 1 || method !== 'coin') return;
    tossInFlightRef.current = true;
    const c = [Math.random()>0.5, Math.random()>0.5, Math.random()>0.5];
    setOnlineCoins(c);
    setOnlinePhase('shaking');
  }, [onlinePhase, onlineCur, step, method]);

  // Called by the 3D scene once the coins have settled
  const handleTossComplete = useCallback((c) => {
    if (!tossInFlightRef.current) return;
    tossInFlightRef.current = false;
    const val = c.reduce((s, h) => s+(h?3:2), 0);
    setLastResult(val);
    setOnlineResults(p => {
      if (p.length >= 6) return p;
      const next = p.length + 1;
      if (next >= 6) {
        setTimeout(() => setStep(2), 700);
      }
      return [...p, { coins:c, value:val }];
    });
    setOnlineCur(n => n + 1);
    setOnlineCoins(null);
    if (tossCooldownRef.current) clearTimeout(tossCooldownRef.current);
    tossCooldownRef.current = setTimeout(() => {
      setOnlinePhase('idle');
      tossCooldownRef.current = null;
    }, TOSS_COOLDOWN_MS);
  }, []);

  const handleManualConfirm = (yaoObj) => {
    const newR = [...manualResults, yaoObj];
    setManualResults(newR);
  };

  const vals   = (method === 'coin' ? onlineResults : manualResults).map(r => r.value);
  const titles = ['六爻占卜', '起卦', '解卦'];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', minHeight:'100dvh', background:C.bg, overflow:'hidden', paddingTop:'env(safe-area-inset-top, 0px)' }}>
      <Header title={titles[step]} onBack={handleBack} rightLabel={step>0?'重来':undefined} onRight={handleReset} quota={quota}/>
      <div style={{ flex:1, overflow:'auto', WebkitOverflowScrolling:'touch', display:'flex', flexDirection:'column' }}>
        {step === 0 && <QuestionStep question={question} setQuestion={setQuestion} onSubmit={handleQuestionSubmit} reviewing={reviewing} quota={quota}
          gateMessage={questionGate ? { tone: questionGate.loading ? 'hint' : questionGate.allowed ? 'ok' : 'error', text: `${questionGate.reason || ''}${questionGate.suggestion ? ` ${questionGate.suggestion}` : ''}` } : null}/>}
        {step === 1 && (
          <>
            <CastStep question={question} method={method} setMethod={setMethod}
              onlineResults={onlineResults} onlineCur={onlineCur} onlinePhase={onlinePhase} onlineCoins={onlineCoins} onToss={handleToss} onTossComplete={handleTossComplete} lastResult={lastResult}
              manualResults={manualResults} onManualConfirm={handleManualConfirm} onManualUndo={() => setManualResults(p => p.slice(0,-1))}
              shakeReady={shakeReady} onEnableShake={enableShake}/>
            {method === 'manual' && manualResults.length >= 6 && (
              <div style={{ padding:'0 20px 28px' }}>
                <button onClick={() => setStep(2)} style={{ width:'100%', padding:'16px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.primary},#A33020)`, color:'#fff', fontSize:17, fontWeight:600, cursor:'pointer', letterSpacing:1.5, boxShadow:'0 4px 18px rgba(107,29,16,0.3)', fontFamily:'inherit' }}>查看卦象解读</button>
              </div>
            )}
          </>
        )}
        {step === 2 && <ResultStep vals={vals} question={question} results={method === 'coin' ? onlineResults : manualResults}/>}
      </div>
      <TabBar/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
