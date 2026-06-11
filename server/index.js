/**
 * AI批命后端中转接口
 * POST /api/piming → 组装 prompt → 调用 DeepSeek → 返回结构化 JSON
 *
 * 环境变量（.env 文件）：
 *   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
 *   PORT=3001                          （可选，默认 3001）
 *   ALLOWED_ORIGINS=https://your-site  （可选，默认允许所有）
 *
 * 切换模型：将 MODEL 常量改为 deepseek-reasoner 即可
 */

'use strict';
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors    = require('cors');
const nodemailer = require('nodemailer');
const OpenAI  = require('openai').default ?? require('openai');

// ── 配置 ────────────────────────────────────────────────
const PORT    = process.env.PORT    || 3001;
const MODEL   = process.env.DEEPSEEK_MODEL || 'deepseek-chat';  // 改成 deepseek-reasoner 即升级推理
const API_KEY = process.env.DEEPSEEK_API_KEY;
const CONTACT_NOTIFY_TO = (process.env.CONTACT_NOTIFY_TO || '842598522@qq.com').trim();
const CONTACT_SMTP_HOST = (process.env.CONTACT_SMTP_HOST || 'smtp.qq.com').trim();
const CONTACT_SMTP_PORT = Number(process.env.CONTACT_SMTP_PORT || 465);
const CONTACT_SMTP_SECURE = String(process.env.CONTACT_SMTP_SECURE || 'true').toLowerCase() !== 'false';
const CONTACT_SMTP_USER = (process.env.CONTACT_SMTP_USER || '').trim();
const CONTACT_SMTP_PASS = (process.env.CONTACT_SMTP_PASS || '').trim();
const CONTACT_FROM = (process.env.CONTACT_FROM || CONTACT_SMTP_USER || CONTACT_NOTIFY_TO).trim();
const CONTACT_ADMIN_TOKEN = (process.env.CONTACT_ADMIN_TOKEN || '').trim();
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 6;
const CONTACT_STORE_DIR = path.join(__dirname, 'data');
const CONTACT_STORE_FILE = path.join(CONTACT_STORE_DIR, 'contact-submissions.json');

if (!API_KEY) {
  console.error('[piming-api] 缺少 DEEPSEEK_API_KEY 环境变量，请在 server/.env 中设置');
  process.exit(1);
}

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey : API_KEY,
});

const contactRateWindow = new Map();
let contactTransporter = null;
let contactStoreCache = null;

// ── 评分缓存（文件级，同命盘同年龄段不重复调用 AI）──────────────
const PROMPT_VERSION = 'v3-two-layer';
// 算法升级版本号：修改此值会使旧 chunk 缓存全部失效，强制用新算法重算
const LIFE_CURVE_ALGO_VERSION = 'v2-critical-year';
const CACHE_DIR = path.join(__dirname, '.cache', 'life-curve');
const OVERALL_PIMING_PROMPT_RELATIVE_PATH = path.join('ai-prompts', 'overall-piming-minggong-sanfang-v1.txt');
const OVERALL_PIMING_PROMPT_CANDIDATES = [
  path.join(__dirname, OVERALL_PIMING_PROMPT_RELATIVE_PATH),
  path.join(__dirname, '..', 'docs', OVERALL_PIMING_PROMPT_RELATIVE_PATH),
];

function buildChunkCacheKey(chartSummary, yearsChunk) {
  const keyData = JSON.stringify({
    v     : PROMPT_VERSION,
    algo  : LIFE_CURVE_ALGO_VERSION,
    name  : chartSummary?.name   || '',
    solar : chartSummary?.solar  || '',
    gender: chartSummary?.gender || '',
    ages  : yearsChunk.map(y => y.age),
  });
  return crypto.createHash('md5').update(keyData).digest('hex');
}

function getCachedChunk(cacheKey) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, `${cacheKey}.json`), 'utf8'));
  } catch { return null; }
}

function setCachedChunk(cacheKey, data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(path.join(CACHE_DIR, `${cacheKey}.json`), JSON.stringify(data), 'utf8');
  } catch (err) {
    console.warn('[piming-api] 缓存写入失败:', err.message);
  }
}

function loadOverallPimingPromptGuide() {
  const tried = [];
  for (const candidatePath of OVERALL_PIMING_PROMPT_CANDIDATES) {
    tried.push(candidatePath);
    try {
      const rawText = fs.readFileSync(candidatePath, 'utf8').replace(/^\uFEFF/, '').trim();
      const outputMarker = '【输出要求】';
      const expressionMarker = '【表达原则】';
      const outputIdx = rawText.indexOf(outputMarker);
      const expressionIdx = rawText.indexOf(expressionMarker);

      const ruleText = (outputIdx >= 0 ? rawText.slice(0, outputIdx) : rawText).trim();
      const expressionText = (expressionIdx >= 0 ? rawText.slice(expressionIdx) : '').trim();
      const hash = crypto.createHash('md5').update(rawText).digest('hex').slice(0, 8);

      return {
        loaded        : true,
        path          : candidatePath,
        hash,
        rawText,
        ruleText,
        expressionText,
      };
    } catch (_err) {}
  }

  const error = `未找到提示词文件，尝试路径：${tried.join(' | ')}`;
  console.warn('[piming-api] 整体批命提示词文件读取失败:', error);
  return {
    loaded        : false,
    path          : tried[0] || '',
    hash          : null,
    rawText       : '',
    ruleText      : '',
    expressionText: '',
    error,
  };
}

function buildDecadeCacheKey(chartSummary, range) {
  const keyData = JSON.stringify({
    v     : PROMPT_VERSION,
    name  : chartSummary?.name   || '',
    solar : chartSummary?.solar  || '',
    gender: chartSummary?.gender || '',
    range,
  });
  return 'decade_' + crypto.createHash('md5').update(keyData).digest('hex');
}

// 从一组年数据里取代表年，构建十年段输入结构
function buildDecadeInput(rangeLabel, yearsInDecade) {
  const rep = yearsInDecade[0];
  const d   = rep?.decadal || {};
  return {
    range   : rangeLabel,
    palace  : d.palace   || '—',
    branch  : d.branch   || '',
    stars   : d.stars    || '—',
    opposite: d.opposite || { palace: '—', branch: '', stars: '—' },
    sanfang : d.sanfang  || [],
  };
}

function buildDecadeProfilePrompt(chartSummary, decadeInputs) {
  const decadeText = decadeInputs.map(d => {
    const lines = [
      `【${d.range}】大运宫：${d.palace}（${d.branch || '—'}）`,
      `  本宫星曜：${d.stars}`,
      `  对宫（${d.opposite?.branch || '—'}）${d.opposite?.palace || '—'}：${d.opposite?.stars || '—'}`,
    ];
    (d.sanfang || []).forEach((sf, i) => {
      lines.push(`  三合宫${i + 1}（${sf.branch || '—'}）${sf.palace || '—'}：${sf.stars || '—'}`);
    });
    return lines.join('\n');
  }).join('\n\n');

  return {
    system: [
      '你是紫微斗数大运分析助手，专注海厦体系的大限格局判断。',
      '每个十年大运段，必须综合本宫、对宫、两个三合宫四个宫位的星曜，才能判断底色。',
      '化忌、羊陀火铃空劫为煞，主压制；禄权科、左右昌曲魁钺禄存为吉，主助力。',
      'decadeBaseScore [20-80]：十年整体底色分，60=普通，高分明显顺，低分明显压。',
      'decadeFactor [0.55-1.25]：年度压制因子，好运>1，差运<1，作用于年度最终得分。',
      '若三方四正均差，decadeFactor 可低到 0.55；三方四正均好可到 1.25。',
      '返回必须是严格 JSON，不要 markdown，不要任何解释。',
    ].join('\n'),
    user: [
      '请为下列命盘的各个十年大运段，给出底色评分和压制因子。',
      '',
      '【命盘摘要】',
      `姓名：${chartSummary?.name || '—'}  性别：${chartSummary?.gender || '—'}`,
      `公历：${chartSummary?.solar || '—'}  五行局：${chartSummary?.fiveElementsClass || '—'}`,
      '',
      '【各十年大运段（本宫 + 对宫 + 三合宫）】',
      decadeText,
      '',
      '返回格式（严格遵守，不得增删字段）：',
      '{',
      '  "decades": [',
      '    {',
      '      "range": "1-10岁",',
      '      "decadeBaseScore": 58,',
      '      "decadeFactor": 0.95,',
      '      "summary": "十年底色一句话，20字内"',
      '    }',
      '  ]',
      '}',
      '',
      '要求：',
      '1. 每个十年段都必须返回一条，range 与输入完全一致。',
      '2. decadeFactor：四正均差可低至 0.55，四正均佳可到 1.25；普通约 0.90-1.05。',
      '3. 对宫与三合宫必须一并参考，不能只看本宫。',
      '4. summary 直接点出核心吉凶，不要重复 range 信息。',
    ].join('\n'),
  };
}

// 先解析 range 字符串中的起始岁数，用于容错匹配
function _rangeStartAge(rangeStr) {
  const m = String(rangeStr || '').match(/(\d+)/);
  return m ? Number(m[1]) : -1;
}

async function scoreDecadesBatch(chartSummary, years) {
  // 按大运 range 分组
  const decadeMap = new Map();
  years.forEach(y => {
    const range = y.decadal?.range || '—';
    if (!decadeMap.has(range)) decadeMap.set(range, []);
    decadeMap.get(range).push(y);
  });

  const allRanges    = [...decadeMap.keys()];
  const profilesMap  = new Map();
  const uncachedMeta = [];

  for (const range of allRanges) {
    const cacheKey = buildDecadeCacheKey(chartSummary, range);
    const cached   = getCachedChunk(cacheKey);
    if (cached) {
      profilesMap.set(range, cached);
    } else {
      uncachedMeta.push({ range, cacheKey, input: buildDecadeInput(range, decadeMap.get(range)) });
    }
  }

  if (uncachedMeta.length) {
    const prompt = buildDecadeProfilePrompt(chartSummary, uncachedMeta.map(u => u.input));
    let result = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await callDeepSeek(prompt.system, prompt.user, { maxTokens: 1200, temperature: 0 });
        break;
      } catch (err) {
        console.error('[piming-api] 大运层评分失败:', err.message);
      }
    }

    const aiDecades = result?.decades || [];
    uncachedMeta.forEach(({ range, cacheKey }) => {
      const startAge = _rangeStartAge(range);
      const hit = aiDecades.find(d => _rangeStartAge(d.range) === startAge) || aiDecades.find(d => d.range === range);
      const profile = hit
        ? {
            range,
            decadeBaseScore: Math.max(20, Math.min(80, Math.round(Number(hit.decadeBaseScore) || 55))),
            decadeFactor   : Math.max(0.55, Math.min(1.25, Number(hit.decadeFactor) || 1.0)),
            summary        : sanitizeAiText(hit.summary || '').slice(0, 40),
          }
        : { range, decadeBaseScore: 55, decadeFactor: 1.0, summary: '大运数据缺失，使用默认底色' };

      profilesMap.set(range, profile);
      setCachedChunk(cacheKey, profile);
    });
  }

  return profilesMap;
}

function buildDefaultDecadeProfilesMap(years) {
  const map = new Map();
  years.forEach(y => {
    const range = y?.decadal?.range || '—';
    if (map.has(range)) return;
    map.set(range, {
      range,
      decadeBaseScore: 55,
      decadeFactor: 1.0,
      summary: '十年底色预估中',
    });
  });
  return map;
}

// ── CORS ────────────────────────────────────────────────
function getContactTransporter() {
  if (contactTransporter) return contactTransporter;
  contactTransporter = nodemailer.createTransport({
    host: CONTACT_SMTP_HOST,
    port: CONTACT_SMTP_PORT,
    secure: CONTACT_SMTP_SECURE,
    auth: {
      user: CONTACT_SMTP_USER,
      pass: CONTACT_SMTP_PASS,
    },
  });
  return contactTransporter;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeContactText(value, maxLength, singleLine = false) {
  const source = String(value || '').replace(/\u0000/g, '');
  const normalized = singleLine
    ? source.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim()
    : source.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return normalized.slice(0, maxLength);
}

function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function isLikelyUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_err) {
    return false;
  }
}

function ensureContactStoreLoaded() {
  if (contactStoreCache) return contactStoreCache;
  try {
    const raw = fs.readFileSync(CONTACT_STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.items)) {
      contactStoreCache = { items: parsed.items };
      return contactStoreCache;
    }
  } catch (_err) {}
  contactStoreCache = { items: [] };
  return contactStoreCache;
}

function persistContactStore() {
  const store = ensureContactStoreLoaded();
  fs.mkdirSync(CONTACT_STORE_DIR, { recursive: true });
  fs.writeFileSync(CONTACT_STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function createContactSubmissionRecord(payload, meta) {
  const nowIso = new Date().toISOString();
  return {
    id: `ct_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    issueType: payload.issueType,
    name: payload.name,
    contact: payload.contact,
    title: payload.title,
    pageUrl: payload.pageUrl,
    accountInfo: payload.accountInfo,
    evidenceLink: payload.evidenceLink,
    message: payload.message,
    status: 'new',
    emailStatus: 'pending',
    emailError: '',
    emailAccepted: [],
    emailRejected: [],
    ip: meta.ip,
    originHost: meta.originHost,
    originPage: meta.originPage,
    submittedAt: meta.submittedAt,
    createdAt: nowIso,
    updatedAt: nowIso,
    adminNote: '',
    handledAt: '',
  };
}

function saveContactSubmission(record) {
  const store = ensureContactStoreLoaded();
  store.items.unshift(record);
  persistContactStore();
  return record;
}

function updateContactSubmission(id, updater) {
  const store = ensureContactStoreLoaded();
  const index = store.items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = store.items[index];
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  next.updatedAt = new Date().toISOString();
  store.items[index] = next;
  persistContactStore();
  return next;
}

function getContactSubmissionList() {
  const store = ensureContactStoreLoaded();
  return store.items.slice();
}

function getContactAdminAuthToken(req) {
  const authHeader = String(req.headers.authorization || '').trim();
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return String(req.query.token || req.headers['x-contact-admin-token'] || '').trim();
}

function requireContactAdmin(req, res, next) {
  if (!CONTACT_ADMIN_TOKEN) {
    return res.status(503).json({ ok: false, error: '后台尚未配置管理口令。' });
  }
  const token = getContactAdminAuthToken(req);
  if (!token || token !== CONTACT_ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: '后台未授权。' });
  }
  next();
}

function sanitizeAdminNote(value) {
  return sanitizeContactText(value, 1000, false);
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.ip || req.socket?.remoteAddress || 'unknown';
}

function checkContactRateLimit(ip) {
  const now = Date.now();
  const recent = (contactRateWindow.get(ip) || []).filter((ts) => now - ts < CONTACT_RATE_LIMIT_WINDOW_MS);
  if (recent.length >= CONTACT_RATE_LIMIT_MAX) {
    contactRateWindow.set(ip, recent);
    return false;
  }
  recent.push(now);
  contactRateWindow.set(ip, recent);
  return true;
}

function normalizeIssueType(value) {
  const issueMap = {
    service: '服务咨询',
    account: '账号问题',
    payment: '支付问题',
    privacy: '隐私请求',
  };
  const key = String(value || 'service').toLowerCase();
  return {
    key: issueMap[key] ? key : 'service',
    label: issueMap[key] || issueMap.service,
  };
}

function normalizeContactHandleStatus(value) {
  const allowed = new Set(['new', 'processing', 'resolved', 'archived']);
  const normalized = String(value || 'new').trim().toLowerCase();
  return allowed.has(normalized) ? normalized : 'new';
}

function buildContactMail(payload, meta) {
  const lines = [
    `问题类型：${payload.issueType.label}`,
    `问题标题：${payload.title}`,
    `联系方式：${payload.contact}`,
    `称呼：${payload.name || '未填写'}`,
    `页面链接：${payload.pageUrl || '未填写'}`,
    `账号/订单线索：${payload.accountInfo || '未填写'}`,
    `截图链接：${payload.evidenceLink || '未填写'}`,
    `提交时间：${meta.submittedAt}`,
    `来源页面：${meta.originPage}`,
    `来源站点：${meta.originHost}`,
    `客户端 IP：${meta.ip}`,
    '',
    '详细描述：',
    payload.message,
  ];

  const detailRows = [
    ['问题类型', payload.issueType.label],
    ['问题标题', payload.title],
    ['联系方式', payload.contact],
    ['称呼', payload.name || '未填写'],
    ['页面链接', payload.pageUrl || '未填写'],
    ['账号/订单线索', payload.accountInfo || '未填写'],
    ['截图链接', payload.evidenceLink || '未填写'],
    ['提交时间', meta.submittedAt],
    ['来源页面', meta.originPage],
    ['来源站点', meta.originHost],
    ['客户端 IP', meta.ip],
  ];

  const html = `
    <div style="font-family:Arial,'PingFang SC','Microsoft YaHei',sans-serif;color:#2b2115;line-height:1.7">
      <h2 style="margin:0 0 16px;font-size:22px;color:#7a5620">阅天联系表单新提交</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
        <tbody>
          ${detailRows.map(([label, value]) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee0bf;width:124px;color:#7c6a4a;font-weight:700;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee0bf;color:#2b2115">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="padding:16px 18px;border-radius:14px;background:#fff7e7;border:1px solid #ead2a0">
        <div style="font-weight:700;color:#7a5620;margin-bottom:8px">详细描述</div>
        <div style="white-space:pre-wrap">${escapeHtml(payload.message)}</div>
      </div>
    </div>
  `;

  return {
    subject: `[阅天联系表单] ${payload.issueType.label} - ${payload.title}`,
    text: lines.join('\n'),
    html,
  };
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : null;  // null = 允许所有（开发阶段）

const app = express();
app.use(cors({
  origin: allowedOrigins
    ? (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin))
    : true,
}));
app.use(express.json({ limit: '1mb' }));

// ── 健康检查 ─────────────────────────────────────────────
app.get('/api/ping', (_req, res) => res.json({ ok: true, model: MODEL }));

app.post('/api/contact/submit', async (req, res) => {
  const ip = getClientIp(req);
  let record = null;
  if (!checkContactRateLimit(ip)) {
    return res.status(429).json({ ok: false, error: '提交过于频繁，请十分钟后再试。' });
  }

  const issueType = normalizeIssueType(req.body?.issueType);
  const name = sanitizeContactText(req.body?.name, 40, true);
  const contact = sanitizeContactText(req.body?.contact, 120, true);
  const title = sanitizeContactText(req.body?.title, 80, true);
  const pageUrl = sanitizeContactText(req.body?.pageUrl, 220, true);
  const accountInfo = sanitizeContactText(req.body?.accountInfo, 120, true);
  const evidenceLink = sanitizeContactText(req.body?.evidenceLink, 220, true);
  const message = sanitizeContactText(req.body?.message, 2000, false);
  const honeypot = sanitizeContactText(req.body?.company, 80, true);

  if (honeypot) {
    return res.json({ ok: true, message: '已收到你的问题，我们会尽快处理。' });
  }

  if (!contact || !title || !message) {
    return res.status(400).json({ ok: false, error: '请填写联系方式、问题标题和详细描述。' });
  }

  if (pageUrl && !isLikelyUrl(pageUrl)) {
    return res.status(400).json({ ok: false, error: '问题页面链接格式不正确。' });
  }

  if (evidenceLink && !isLikelyUrl(evidenceLink)) {
    return res.status(400).json({ ok: false, error: '截图链接格式不正确。' });
  }

  try {
    const payload = {
      issueType,
      name,
      contact,
      title,
      pageUrl,
      accountInfo,
      evidenceLink,
      message,
    };

    const meta = {
      ip,
      originHost: req.headers.origin || req.headers.host || 'unknown',
      originPage: req.headers.referer || pageUrl || 'unknown',
      submittedAt: new Date().toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' }),
    };
    record = saveContactSubmission(createContactSubmissionRecord(payload, meta));
    if (!CONTACT_SMTP_USER || !CONTACT_SMTP_PASS) {
      updateContactSubmission(record.id, (current) => ({
        ...current,
        emailStatus: 'skipped',
        emailError: 'SMTP not configured',
      }));
      return res.status(503).json({ ok: false, error: '表单已收下，但邮件通知尚未配置。' });
    }

    const mail = buildContactMail(payload, meta);
    const transporter = getContactTransporter();
    const messageOptions = {
      from: CONTACT_FROM,
      to: CONTACT_NOTIFY_TO,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    };
    if (isLikelyEmail(contact)) {
      messageOptions.replyTo = contact;
    }

    const mailInfo = await transporter.sendMail(messageOptions);
    if (record) {
      updateContactSubmission(record.id, (current) => ({
        ...current,
        emailStatus: 'sent',
        emailAccepted: Array.isArray(mailInfo?.accepted) ? mailInfo.accepted : [],
        emailRejected: Array.isArray(mailInfo?.rejected) ? mailInfo.rejected : [],
        emailError: '',
      }));
    }

    return res.json({
      ok: true,
      message: '提交成功，我们已经收到你的问题。',
    });
  } catch (err) {
    if (record) {
      updateContactSubmission(record.id, (current) => ({
        ...current,
        emailStatus: 'failed',
        emailError: err.message || 'send failed',
      }));
    }
    console.error('[contact-api] submit failed:', err.message);
    return res.status(502).json({ ok: false, error: '提交失败，请稍后再试。' });
  }
});

// ── Prompt 构建 ──────────────────────────────────────────

app.get('/api/contact/admin/items', requireContactAdmin, (req, res) => {
  const queryStatus = sanitizeContactText(req.query.status, 20, true);
  const queryEmailStatus = sanitizeContactText(req.query.emailStatus, 20, true).toLowerCase();
  const q = sanitizeContactText(req.query.q, 80, true).toLowerCase();
  let items = getContactSubmissionList();

  if (queryStatus) {
    const status = normalizeContactHandleStatus(queryStatus);
    items = items.filter((item) => item.status === status);
  }
  if (queryEmailStatus) {
    items = items.filter((item) => String(item.emailStatus || '').toLowerCase() === queryEmailStatus);
  }
  if (q) {
    items = items.filter((item) => {
      const haystack = [
        item.title,
        item.contact,
        item.message,
        item.pageUrl,
        item.accountInfo,
        item.adminNote,
      ].join('\n').toLowerCase();
      return haystack.includes(q);
    });
  }

  return res.json({
    ok: true,
    items,
    summary: {
      total: items.length,
      new: items.filter((item) => item.status === 'new').length,
      processing: items.filter((item) => item.status === 'processing').length,
      resolved: items.filter((item) => item.status === 'resolved').length,
      archived: items.filter((item) => item.status === 'archived').length,
      failedEmail: items.filter((item) => item.emailStatus === 'failed').length,
    },
  });
});

app.patch('/api/contact/admin/items/:id', requireContactAdmin, (req, res) => {
  const id = sanitizeContactText(req.params.id, 80, true);
  const nextStatus = req.body?.status ? normalizeContactHandleStatus(req.body.status) : null;
  const nextNote = typeof req.body?.adminNote === 'string' ? sanitizeAdminNote(req.body.adminNote) : null;
  const updated = updateContactSubmission(id, (current) => ({
    ...current,
    status: nextStatus || current.status,
    adminNote: nextNote === null ? current.adminNote : nextNote,
    handledAt: nextStatus && nextStatus !== 'new' ? new Date().toISOString() : current.handledAt,
  }));

  if (!updated) {
    return res.status(404).json({ ok: false, error: '未找到该记录。' });
  }

  return res.json({ ok: true, item: updated });
});

app.get('/admin/contact', (_req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'contact-dashboard.html'));
});

function collectOverallSignals(cd) {
  // ── 安全取星名：兼容 string[] 和 {name}[] 两种形态 ──────────────────────────
  const starName   = s => (typeof s === 'string' ? s : s?.name) || '';
  const majorNames = p => (p?.majorStars || []).map(starName).filter(Boolean);
  const minorNames = p => (p?.minorStars || []).map(starName).filter(Boolean);

  // 四化 type 归一：裸字 禄/权/科/忌 → 化禄/化权/化科/化忌
  const normType = t => {
    if (!t) return '';
    if (String(t).startsWith('化')) return t;
    return { '禄': '化禄', '权': '化权', '科': '化科', '忌': '化忌' }[t] || t;
  };

  // 命宫四化：只有 lifePalace 带完整对象（含 mutagen 字段）
  const mutagenOf = (p, normalizedType) => [
    ...(p?.majorStars || []),
    ...(p?.minorStars || []),
  ].filter(s => typeof s === 'object' && normType(s?.mutagen) === normalizedType)
   .map(s => starName(s));

  const lp = cd.lifePalace        || null;
  const bp = cd.bodyPalaceDetail  || null;
  const cp = cd.careerPalace      || null;
  const wp = cd.wealthPalace      || null;
  const mp = cd.movePalace        || null;

  // 命宫辅星中有价值的（文昌/文曲/左辅/右弼/天魁/天钺）
  const AUX_STARS = ['文昌', '文曲', '左辅', '右弼', '天魁', '天钺', '天刑', '擎羊', '陀罗', '火星', '铃星'];
  const lifeAux = minorNames(lp).filter(n => AUX_STARS.includes(n));

  // 三方四正各宫主星（careerPalace 等只有字符串数组，majorNames 已兼容）
  const sanfang = {
    career : majorNames(cp),
    wealth : majorNames(wp),
    move   : majorNames(mp),
  };

  // 生年四化归一后过滤
  const mutagens = (cd.yearMutagens || []).map(m => ({ ...m, type: normType(m.type || '') }));
  const lu  = mutagens.filter(m => m.type === '化禄');
  const quan= mutagens.filter(m => m.type === '化权');
  const ke  = mutagens.filter(m => m.type === '化科');
  const ji  = mutagens.filter(m => m.type === '化忌');

  // 命宫落忌（凶）
  const lifeJi = mutagenOf(lp, '化忌');

  // 重点宫位落忌：只保留整体批命允许使用的四宫
  const KEY_JI_PALACES = ['命宫', '官禄宫', '财帛宫', '迁移宫'];
  const keyJiMutagens = mutagens.filter(m =>
    m.type === '化忌' && KEY_JI_PALACES.some(k => (m.palace || '').includes(k.replace('宫', '')))
  );

  // 命宫吉化
  const lifeGood = [
    ...mutagenOf(lp, '化禄').map(n => n + '禄'),
    ...mutagenOf(lp, '化权').map(n => n + '权'),
    ...mutagenOf(lp, '化科').map(n => n + '科'),
  ];

  // 三方四正（命+官+财+迁）所有主星合集
  const allSanfang = [
    ...majorNames(lp),
    ...majorNames(cp),
    ...majorNames(wp),
    ...majorNames(mp),
  ];

  // 三方四正落忌宫位
  const SANFANG_KEYS = ['命', '官禄', '财帛', '迁移'];
  const sanfangJi = mutagens.filter(m =>
    m.type === '化忌' && SANFANG_KEYS.some(k => (m.palace || '').includes(k))
  );

  // 三方四正落禄/权/科
  const sanfangLu   = lu.filter(m => SANFANG_KEYS.some(k => (m.palace || '').includes(k)));
  const sanfangQuan = quan.filter(m => SANFANG_KEYS.some(k => (m.palace || '').includes(k)));
  const sanfangKe   = ke.filter(m => SANFANG_KEYS.some(k => (m.palace || '').includes(k)));

  // 命宫是否有左辅/右弼
  const lifeHasFubei = minorNames(lp).some(n => ['左辅', '右弼'].includes(n));

  return {
    gender        : cd.gender || 'male',
    genderStr     : cd.gender === 'female' ? '女命' : '男命',
    fiveElements  : cd.fiveElementsClass || '',
    zodiac        : cd.zodiac || '',
    yearStem      : cd.yearStem || '',
    lifeMain      : majorNames(lp),   // 命宫主星（可能多颗）
    lifeAux,                          // 命宫有意义辅星
    lifeGood,                         // 命宫吉化
    lifeJi,                           // 命宫落忌星
    lifeHasFubei,                     // 命宫是否有辅弼
    bodyMain      : majorNames(bp),   // 身宫主星
    bodyPalaceName: bp?.name || '',
    sanfang,
    allSanfang,                       // 三方四正全部主星
    sanfangLu, sanfangQuan, sanfangKe, sanfangJi,
    lu, quan, ke, ji,
    keyJiMutagens,                    // 重点宫位化忌
    birthDate     : cd.birthDate || '',
  };
}

/**
 * Step 2: 从信号生成 evidence[] 证据列表
 */
function buildOverallEvidence(sig, options = {}) {
  const includeBody = !!options.includeBody;
  const ev = [];

  // 命宫底色
  ev.push({
    key  : 'minggong_main',
    label: '命宫主星',
    value: sig.lifeMain.join('+') || '空宫',
  });
  if (sig.lifeAux.length) {
    ev.push({ key: 'minggong_aux', label: '命宫辅星', value: sig.lifeAux.join('、') });
  }
  if (sig.lifeGood.length) {
    ev.push({ key: 'minggong_good', label: '命宫吉化', value: sig.lifeGood.join('、') });
  }
  if (sig.lifeJi.length) {
    ev.push({ key: 'minggong_ji', label: '命宫落忌', value: sig.lifeJi.join('、') + '化忌入命' });
  }

  // 三方四正
  if (sig.sanfang.career.length) {
    ev.push({ key: 'sanfang_career', label: '官禄宫主星', value: sig.sanfang.career.join('+') });
  }
  if (sig.sanfang.wealth.length) {
    ev.push({ key: 'sanfang_wealth', label: '财帛宫主星', value: sig.sanfang.wealth.join('+') });
  }
  if (sig.sanfang.move.length) {
    ev.push({ key: 'sanfang_move',   label: '迁移宫主星', value: sig.sanfang.move.join('+') });
  }

  // 生年四化
  if (sig.lu.length)   ev.push({ key: 'mutagen_lu',   label: '生年化禄', value: sig.lu.map(m=>`${m.star}禄在${m.palace}`).join('；') });
  if (sig.quan.length) ev.push({ key: 'mutagen_quan', label: '生年化权', value: sig.quan.map(m=>`${m.star}权在${m.palace}`).join('；') });
  if (sig.ke.length)   ev.push({ key: 'mutagen_ke',   label: '生年化科', value: sig.ke.map(m=>`${m.star}科在${m.palace}`).join('；') });
  if (sig.ji.length)   ev.push({ key: 'mutagen_ji',   label: '生年化忌', value: sig.ji.map(m=>`${m.star}忌在${m.palace}`).join('；') });

  // 身宫（overall 默认不喂给模型，仅在显式需要时附带）
  if (includeBody && sig.bodyMain.length) {
    ev.push({
      key  : 'shengong',
      label: `身宫（${sig.bodyPalaceName}）`,
      value: sig.bodyMain.join('+'),
    });
  }

  return ev;
}

/**
 * 三方四正命格定位（天纪规则）
 * 判断此人天生宜领薪/创业/掌权/专业
 */
function buildSanfangProfile(sig) {
  const hasLu   = sig.sanfangLu.length > 0;
  const hasQuan = sig.sanfangQuan.length > 0;
  const hasKe   = sig.sanfangKe.length > 0;

  let profile, label;
  if (hasLu && hasQuan && hasKe) {
    label   = '财官双美';
    profile = '三方四正科权禄俱会，财官双美，一方之主，可自立成大业';
  } else if (hasLu && hasQuan) {
    label   = '权禄相逢';
    profile = '三方四正权禄相逢，宜自立创业当老板，不甘人下';
  } else if (hasQuan && hasKe) {
    label   = '科权入宫';
    profile = '三方四正科权会入，宜公职或专业，可晋升主管';
  } else if (hasQuan) {
    label   = '化权入宫';
    profile = '三方四正有化权，宜掌管职权，公私皆可升任主管';
  } else if (hasLu) {
    label   = '化禄入宫';
    profile = '三方四正有化禄，财路顺畅，可经营或兼营自立';
  } else if (hasKe) {
    label   = '化科入宫';
    profile = '三方四正有化科，宜专业技术路线，以专长立身';
  } else {
    label   = '正才正官';
    profile = '三方四正无科权禄会入，宜专注本职，正才正官，领薪稳健';
  }

  return { label, profile };
}

/**
 * 格局识别（天纪规则，第一批）
 */
function detectOverallPatterns(sig) {
  const patterns = [];
  const all = sig.allSanfang;

  // 机月同梁格：三方四正含天机/太阴/天同/天梁 ≥3 颗
  const jyltStars = ['天机', '太阴', '天同', '天梁'];
  const jyltCount = jyltStars.filter(s => all.includes(s)).length;
  if (jyltCount >= 3) {
    patterns.push({
      name : '机月同梁',
      desc : '三方四正天机太阴天同天梁为主，宜公职或固定薪水，不宜孤注一掷自立创业',
      level: 'high',
    });
  }

  // 紫微孤君：命宫有紫微，但无左辅右弼
  if (sig.lifeMain.includes('紫微') && !sig.lifeHasFubei) {
    patterns.push({
      name : '紫微孤君',
      desc : '紫微无辅弼，孤高自守，领导力强但难聚人心，易孤立无援',
      level: 'medium',
    });
  }

  // 火贪格：命宫贪狼+火星
  if (sig.lifeMain.includes('贪狼') && sig.lifeAux.includes('火星')) {
    patterns.push({
      name : '火贪格',
      desc : '贪狼逢火星，火贪格成，事业有爆发力，主出武贵或商界突破',
      level: 'medium',
    });
  }

  // 铃贪格：命宫贪狼+铃星
  if (sig.lifeMain.includes('贪狼') && sig.lifeAux.includes('铃星')) {
    patterns.push({
      name : '铃贪格',
      desc : '贪狼逢铃星，铃贪格成，与火贪格同性质，主事业爆发',
      level: 'medium',
    });
  }

  return patterns;
}

/**
 * 破格/凶象识别（天纪规则，第一批）
 */
function detectOverallBreaks(sig) {
  const breaks = [];

  // 化忌入命（已在 mainRisk 中，这里作为 break 强调完整性）
  if (sig.lifeJi.length > 0) {
    breaks.push({
      name     : '化忌入命',
      desc     : `${sig.lifeJi.join('+')}化忌落命宫，本人自困，易有阻碍与伤损`,
      severity : 'high',
      confirmed: true,
    });
  }

  // 廉贞贪狼同宫（命宫）——需双陷才成凶格，当前未验证亮度，仅候选
  if (sig.lifeMain.includes('廉贞') && sig.lifeMain.includes('贪狼')) {
    breaks.push({
      name     : '廉贪同命',
      desc     : '廉贞贪狼同坐命宫，双陷时天纪论自杀格；庙旺则不成凶。需验亮度后才能定论',
      severity : 'high',
      confirmed: false,   // 条件不完整：需双陷才成格，当前未读命宫亮度
      reason   : '需双陷才成格，命宫亮度数据未验证',
    });
  }

  // 廉贞七杀同宫（命宫）——需双陷，仅候选
  if (sig.lifeMain.includes('廉贞') && sig.lifeMain.includes('七杀')) {
    breaks.push({
      name     : '廉杀同命',
      desc     : '廉贞七杀同坐命宫，双陷时天纪论横死，庙旺则刚强出将。需验亮度后才能定论',
      severity : 'high',
      confirmed: false,
      reason   : '需双陷才成格，命宫亮度数据未验证',
    });
  }

  // 武曲七杀同宫（命宫）——需双陷（卯宫陷地），仅候选
  if (sig.lifeMain.includes('武曲') && sig.lifeMain.includes('七杀')) {
    breaks.push({
      name     : '武杀同命',
      desc     : '武曲七杀同坐命宫，卯宫双陷时天纪论兵阵死亡，庙旺则将星得地。需验宫支+亮度',
      severity : 'high',
      confirmed: false,
      reason   : '需卯宫双陷才成格，当前未验证宫支与亮度',
    });
  }

  // 三方四正多重化忌（2个以上）
  if (sig.sanfangJi.length >= 2) {
    breaks.push({
      name     : '三方多忌',
      desc     : `三方四正${sig.sanfangJi.map(m => m.palace).join('、')}均落化忌，多宫受损，行运受阻`,
      severity : 'medium',
      confirmed: true,
    });
  }

  return breaks;
}

/**
 * 命格细化：给 admin/debug 用的结构化补充，不直接等于用户态文案
 */
function buildOverallToneDetails(sig) {
  const joinStars = (stars, empty = '无') => stars.length ? stars.join('+') : empty;
  const joinMutagens = (items, suffix) =>
    items.length ? items.map(m => `${m.star}${suffix}在${m.palace}`).join('；') : '无';

  return {
    lifeTone    : `${joinStars(sig.lifeMain, '空宫')}${sig.lifeAux.length ? `，辅有${sig.lifeAux.join('+')}` : ''}`,
    sanfangFocus: `官禄${joinStars(sig.sanfang.career, '空宫')} / 财帛${joinStars(sig.sanfang.wealth, '空宫')} / 迁移${joinStars(sig.sanfang.move, '空宫')}`,
    bodyFocus   : sig.bodyMain.length ? `${sig.bodyPalaceName || '身宫'} ${sig.bodyMain.join('+')}` : '无明显身宫修正',
    mutagenFocus: [
      `禄：${joinMutagens(sig.lu, '化禄')}`,
      `权：${joinMutagens(sig.quan, '化权')}`,
      `科：${joinMutagens(sig.ke, '化科')}`,
      `忌：${joinMutagens(sig.ji, '化忌')}`,
    ].join('\n'),
    riskFocus   : sig.keyJiMutagens.length
      ? sig.keyJiMutagens.map(m => `${m.star}化忌在${m.palace}`).join('；')
      : '暂无重点宫位化忌',
  };
}

/**
 * Step 3: 规则层结论（先于模型产出，喂给模型作为约束）
 */
function buildOverallRuleSummary(sig) {
  // 命宫底色
  const mainStar = sig.lifeMain[0] || '';
  let baseTone = mainStar ? `命宫${sig.lifeMain.join('+')}` : '命宫空宫';
  if (sig.lifeAux.length) baseTone += `，辅有${sig.lifeAux.join('+')}`;

  // 三方结构
  const sfParts = [];
  if (sig.sanfang.career.length) sfParts.push(`官禄${sig.sanfang.career.join('+')}`);
  if (sig.sanfang.wealth.length) sfParts.push(`财帛${sig.sanfang.wealth.join('+')}`);
  if (sig.sanfang.move.length)   sfParts.push(`迁移${sig.sanfang.move.join('+')}`);
  const structure = sfParts.length ? sfParts.join('，') : '三方数据不完整';

  // 四化影响
  const mutagenParts = [];
  if (sig.lu.length)   mutagenParts.push(sig.lu.map(m=>`${m.star}化禄入${m.palace}`).join('，'));
  if (sig.quan.length) mutagenParts.push(sig.quan.map(m=>`${m.star}化权入${m.palace}`).join('，'));
  if (sig.ke.length)   mutagenParts.push(sig.ke.map(m=>`${m.star}化科入${m.palace}`).join('，'));
  if (sig.ji.length)   mutagenParts.push(sig.ji.map(m=>`${m.star}化忌入${m.palace}`).join('，'));
  const mutagenEffect = mutagenParts.join('；') || '无明显生年四化';

  // 三方四正命格定位
  const sanfangProfile = buildSanfangProfile(sig);

  // 格局识别
  const patterns = detectOverallPatterns(sig);

  // 破格识别
  const breaks = detectOverallBreaks(sig);

  // 身宫修正（含七杀临身检测）
  const sameAsLife = sig.bodyMain.some(n => sig.lifeMain.includes(n));
  let bodyAdjustment = '';
  if (sig.bodyMain.length) {
    const bodyHasQisha = sig.bodyMain.includes('七杀');
    if (bodyHasQisha) {
      bodyAdjustment = `身宫（${sig.bodyPalaceName}）为七杀，天纪"七杀临身终不美"，一生多劳`;
    } else if (sameAsLife) {
      bodyAdjustment = `身宫（${sig.bodyPalaceName}）与命宫同星${sig.bodyMain[0]}，命身同星，特质高度聚焦`;
    } else {
      bodyAdjustment = `身宫（${sig.bodyPalaceName}）主星${sig.bodyMain.join('+')}，修正命宫方向`;
    }
  }

  // 主要风险（化忌 + 破格合并）
  const riskParts = [];
  if (sig.lifeJi.length) riskParts.push(`命宫落${sig.lifeJi.join('+')}化忌，自身受困`);
  sig.keyJiMutagens.forEach(m => {
    if (!sig.lifeJi.length || m.palace !== '命宫') {  // 避免与 lifeJi 重复
      riskParts.push(`${m.star}化忌入${m.palace}，该宫受损`);
    }
  });
  breaks.filter(b => b.severity === 'high' && b.name !== '化忌入命' && b.confirmed !== false).forEach(b => {
    riskParts.push(b.desc);
  });
  const mainRisk = riskParts.length ? riskParts.join('；') : '暂无明显重点风险';

  return { baseTone, structure, mutagenEffect, bodyAdjustment, mainRisk,
           sanfangProfile, patterns, breaks };
}

/**
 * Step 4: 组装 prompt（规则 + 证据 → 模型只负责表达）
 */
function buildOverallPimingPrompt(body) {
  const cd = body.chartData || body;

  const sig         = collectOverallSignals(cd);
  const promptGuide = loadOverallPimingPromptGuide();
  const evidence    = buildOverallEvidence(sig, { includeBody: false });
  const ruleSummary = buildOverallRuleSummary(sig);
  const toneDetails = buildOverallToneDetails(sig);

  const requestSummary = `${sig.fiveElements} ${sig.lifeMain.join('+')||'空宫'}命宫 ${sig.yearStem}年生 ${sig.genderStr}`;

  // 证据清单（给模型看）
  const evidenceText = evidence.map(e => `· ${e.label}：${e.value}`).join('\n');

  // 规则层结论（约束模型，不让它自由发挥）
  const patternLines = ruleSummary.patterns.length
    ? ruleSummary.patterns.map(p => `· ${p.name}：${p.desc}`).join('\n')
    : '· 无明显格局成立';
  const confirmedBreaks = ruleSummary.breaks.filter(b => b.name !== '化忌入命' && b.confirmed !== false);
  const breakLines = confirmedBreaks.length
    ? confirmedBreaks.map(b => `· 【${b.severity === 'high' ? '高' : '中'}】${b.name}：${b.desc}`).join('\n')
    : '· 无明显破格';

  const ruleText = [
    `命宫底色：${ruleSummary.baseTone}`,
    `三方结构：${ruleSummary.structure}`,
    `命格定位：${ruleSummary.sanfangProfile.label}——${ruleSummary.sanfangProfile.profile}`,
    `四化影响：${ruleSummary.mutagenEffect}`,
    `格局判断：\n${patternLines}`,
    `破格凶象：\n${breakLines}`,
    `主要风险：${ruleSummary.mainRisk}`,
  ].filter(Boolean).join('\n');

  const externalRuleBlocks = [];
  if (promptGuide.ruleText) {
    externalRuleBlocks.push(
      `【外部批命规则】（来源：${promptGuide.path}${promptGuide.hash ? `，hash ${promptGuide.hash}` : ''}）`,
      promptGuide.ruleText
    );
  }
  if (promptGuide.expressionText) {
    externalRuleBlocks.push(promptGuide.expressionText);
  }
  const externalRuleText = externalRuleBlocks.length
    ? externalRuleBlocks.join('\n\n')
    : `【外部批命规则】\n（未加载到提示词文件：${promptGuide.path}）`;

  const system = [
    '你是一位精通紫微斗数的命理师，语言简练有力，不说空泛套话。',
    '你只做整体命格分析，只围绕命宫、官禄、财帛、迁移四宫展开，不扩写大限流年，不展开子平法。',
    '如果已加载【外部批命规则】，你必须优先遵守其中关于可用宫位、肯定批法、提醒批法、表达原则的约束。',
    '外部批命规则中的输出版式只作为内容规范参考，最终返回格式仍以本文最后给出的 JSON 要求为准。',
    '以下【规则层结论】是后端已经依据星曜规则推算出的结果，你不得推翻或忽略这些结论。',
    '你的任务只是：在规则层结论的基础上，写出流畅、有依据感的批命文字。',
    '你必须返回严格 JSON，不要 markdown，不要代码块。',
  ].join('\n');

  const user = [
    externalRuleText,
    '',
    '【命盘证据】（已提取的星曜和宫位信息，只能引用不能杜撰）',
    evidenceText,
    '',
    '【规则层结论】（后端已推算，你必须以此为基础作文，不得矛盾）',
    ruleText,
    '',
    '请基于以上内容，返回以下 JSON（括号内是说明，不要输出括号内容）：',
    '{',
    '  "title": "一句话命格特质，≤20字，必须含命宫主星名",',
    '  "summary": "整体批命，120-200字，优先引用命宫主星与三方四正；若输入明确给出四化可引用，但不要自行扩写身宫、大限、流年、父母夫妻等额外层，语气肯定有据",',
    '  "risk": "最关键的一条风险，≤50字，必须源自规则层主要风险",',
    '  "basis": "判断依据简述，列出引用的主星和宫位，≤60字"',
    '}',
  ].join('\n');

  return {
    system,
    user,
    requestSummary,
    evidence,
    ruleSummary,
    toneDetails,
    promptGuideMeta: {
      loaded: !!promptGuide.loaded,
      path  : promptGuide.path,
      hash  : promptGuide.hash,
      error : promptGuide.error || null,
    },
    trace: [
      `提取信号：${requestSummary}`,
      `外部提示词：${promptGuide.loaded ? `已加载 ${promptGuide.path}${promptGuide.hash ? ` (${promptGuide.hash})` : ''}` : `未加载 ${promptGuide.path}`}`,
      `命宫：${sig.lifeMain.join('+')||'空宫'}，辅星：${sig.lifeAux.join('+')||'无'}`,
      `三方：官禄${sig.sanfang.career.join('+')||'空'}／财帛${sig.sanfang.wealth.join('+')||'空'}／迁移${sig.sanfang.move.join('+')||'空'}`,
      `化忌落宫：${sig.keyJiMutagens.map(m=>m.palace).join('，')||'无'}`,
      `命格定位：${ruleSummary.sanfangProfile.label}`,
      `格局：${ruleSummary.patterns.map(p=>p.name).join('、')||'无'}`,
      `破格：${ruleSummary.breaks.map(b=>b.name).join('、')||'无'}`,
      `规则结论 → baseTone: ${ruleSummary.baseTone}`,
      `规则结论 → mainRisk: ${ruleSummary.mainRisk}`,
      `调用 ${MODEL} 生成表达层`,
      '解析 JSON 返回 card 结构',
    ],
  };
}

async function callDeepSeek(system, user, options = {}) {
  const resp = await deepseek.chat.completions.create({
    model   : options.model || MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user   },
    ],
    response_format: options.responseFormat === false ? undefined : { type: 'json_object' },
    temperature    : options.temperature ?? 0.7,
    max_tokens     : options.maxTokens ?? 800,
  });
  const raw = resp.choices[0]?.message?.content || '{}';
  return JSON.parse(raw);
}

// 自由文本版（调试台模块使用，不强制 JSON schema）
async function callDeepSeekRaw(system, user) {
  const resp = await deepseek.chat.completions.create({
    model      : MODEL,
    messages   : [
      { role: 'system', content: system },
      { role: 'user',   content: user   },
    ],
    temperature: 0.7,
    max_tokens : 1200,
  });
  return resp.choices[0]?.message?.content || '';
}

async function callDeepSeekRawStream(system, user, onChunk) {
  const stream = await deepseek.chat.completions.create({
    model      : MODEL,
    messages   : [
      { role: 'system', content: system },
      { role: 'user',   content: user   },
    ],
    temperature: 0.7,
    max_tokens : 1200,
    stream     : true,
  });

  let fullText = '';
  for await (const part of stream) {
    const chunk = part?.choices?.[0]?.delta?.content || '';
    if (!chunk) continue;
    fullText += chunk;
    if (onChunk) await onChunk(chunk);
  }
  return fullText;
}

function sanitizeAiText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/```+/g, '')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const LIFE_CURVE_CHUNK_SIZE = 8;

// 校验并重算 finalScore（防止 AI 随意填数）
// v3：finalScore = round((base + deltas) * factor)，因子由大运层决定
function computeValidatedScore(item) {
  const base   = Math.max(20, Math.min(80,   Math.round(Number(item?.baseScore)     || 55)));
  const d1     = Math.max(-20, Math.min(20,  Math.round(Number(item?.xiaoLianDelta) || 0)));
  const d2     = Math.max(-15, Math.min(15,  Math.round(Number(item?.oppositeDelta) || 0)));
  const d3     = Math.max(-10, Math.min(10,  Math.round(Number(item?.guaDelta)      || 0)));
  const factor = Math.max(0.55, Math.min(1.25, Number(item?.decadeFactor)           || 1.0));
  const computed = Math.round((base + d1 + d2 + d3) * factor);
  const claimed  = Math.round(Number(item?.finalScore) || computed);
  // 偏差 ≤ 8 则采纳 AI 填报值，否则用算出值
  const final    = Math.abs(claimed - computed) <= 8 ? claimed : computed;
  return Math.max(5, Math.min(98, final));
}

// v3 两层评分：年度层 prompt，baseScore/factor 继承自大运底色
function buildLifeCurvePrompt(chartSummary, yearsChunk, decadeProfilesMap) {
  // 构建本 chunk 涉及的大运底色上下文
  const seenRanges  = new Set();
  const decadeLines = [];
  yearsChunk.forEach(y => {
    const range = y.decadal?.range || '';
    if (range && !seenRanges.has(range)) {
      seenRanges.add(range);
      const p = decadeProfilesMap?.get(range);
      if (p) decadeLines.push(
        `  ${range}：底色分=${p.decadeBaseScore}，压制因子=${p.decadeFactor}，${p.summary}`
      );
    }
  });

  const chunkText = yearsChunk.map(year => {
    const range   = year.decadal?.range || '—';
    const profile = decadeProfilesMap?.get(range);
    const memo    = profile ? `底色=${profile.decadeBaseScore}×${profile.decadeFactor}` : '底色=未知';
    return [
      `- ${year.age}岁 / ${year.year}年  大运[${range} ${memo}]`,
      `  流年卦: ${year.liunianGua?.name || '—'} ${year.liunianGua?.period || ''}`.trim(),
      `  小流年本宫: ${year.xiaoLian?.palace || '—'}（${year.xiaoLian?.branch || '—'}）  星曜: ${year.xiaoLian?.stars || '—'}`,
      `  对宫: ${year.opposite?.palace || '—'}（${year.opposite?.branch || '—'}）  星曜: ${year.opposite?.stars || '—'}`,
    ].join('\n');
  }).join('\n');

  return {
    system: [
      '你是紫微斗数流年评分助手（年度微调层），按海厦体系做年度细化评分。',
      '十年大运底色已由上层预先确定，你不要重新评估大运层。',
      '你的任务：根据当年小流年本宫、对宫、流年卦，计算年度微调量。',
      '评分公式（严格遵守）：',
      '  baseScore：直接沿用所属十年的 decadeBaseScore，不得改变。',
      '  xiaoLianDelta [-20~+20]：小流年本宫星曜当年调整（忌煞负，吉曜正）。',
      '  oppositeDelta [-15~+15]：对宫反冲影响（同规则）。',
      '  guaDelta      [-10~+10]：流年卦吉凶调整。',
      '  decadeFactor：沿用所属十年的值，不得改变。',
      '  finalScore = round((baseScore + xiaoLianDelta + oppositeDelta + guaDelta) * decadeFactor)，夹在 5-98。',
      '同一十年内不同年份必须有真实差异，不要机械重复同一 delta。',
      '返回必须是严格 JSON，不要 markdown，不要任何解释。',
    ].join('\n'),
    user: [
      '请根据以下十年底色和年度数据，为每一年给出年度微调评分。',
      '',
      '【命盘摘要】',
      `姓名：${chartSummary?.name || '—'}  五行局：${chartSummary?.fiveElementsClass || '—'}`,
      '',
      '【所属十年底色（已定，不可改变）】',
      decadeLines.join('\n') || '（底色数据缺失，请用 decadeBaseScore=55, decadeFactor=1.0）',
      '',
      '【待评分年龄数据（每行附有底色备注）】',
      chunkText,
      '',
      '返回格式（严格遵守，不得增删字段）：',
      '{',
      '  "scores": [',
      '    {',
      '      "age": 36,',
      '      "baseScore": 52,',
      '      "xiaoLianDelta": 8,',
      '      "oppositeDelta": -3,',
      '      "guaDelta": 4,',
      '      "decadeFactor": 0.75,',
      '      "finalScore": 46,',
      '      "summary": "一句话主因，15字内"',
      '    }',
      '  ]',
      '}',
      '',
      '要求：',
      '1. baseScore 和 decadeFactor 必须原样沿用所属十年的值，不得自行改变。',
      '2. finalScore = round((baseScore + xiaoLianDelta + oppositeDelta + guaDelta) * decadeFactor)。',
      '3. 每个年龄都必须返回一条，不允许漏年龄。',
      '4. 同一十年内各年份的 delta 值必须有真实差异，体现当年星曜实际情况。',
      '5. summary 直接点出当年主因，不要重复年龄或大运信息。',
    ].join('\n'),
  };
}

function countKeyword(text, list) {
  const source = String(text || '');
  return list.reduce((sum, keyword) => sum + (source.includes(keyword) ? 1 : 0), 0);
}

function estimateFallbackScore(year) {
  const positive = ['禄', '科', '权', '左辅', '右弼', '文昌', '文曲', '禄存', '天魁', '天钺', '天府', '紫微', '天相', '天梁', '化禄', '化科', '化权'];
  const negative = ['忌', '煞', '空', '劫', '羊', '陀', '火星', '铃星', '天刑', '病', '死', '绝', '旬空', '地空', '地劫', '天哭', '丧门'];
  const texts = [
    year?.xiaoLian?.stars || '',
    year?.opposite?.stars || '',
    year?.decadal?.stars || '',
    year?.liunianGua?.name || '',
  ];
  const pos = texts.reduce((sum, text) => sum + countKeyword(text, positive), 0);
  const neg = texts.reduce((sum, text) => sum + countKeyword(text, negative), 0);
  const raw = 58 + pos * 4 - neg * 6;
  return Math.max(18, Math.min(92, raw));
}

function normalizeLifeCurveScores(rawScores, yearsChunk, decadeProfilesMap) {
  const map = new Map();
  if (Array.isArray(rawScores)) {
    rawScores.forEach(item => {
      const age = Number(item?.age);
      if (!Number.isFinite(age)) return;
      const score   = computeValidatedScore(item);
      const summary = sanitizeAiText(item?.summary || '').slice(0, 48);
      map.set(age, {
        age,
        score,
        rawScore     : score,   // 保留原始分供 criticalYear 检测使用
        summary,
        decadeFactor : Math.max(0.55, Math.min(1.25, Number(item?.decadeFactor) || 1.0)),
        baseScore    : Math.max(20, Math.min(80, Math.round(Number(item?.baseScore) || 55))),
        xiaoLianDelta: Math.max(-20, Math.min(20, Math.round(Number(item?.xiaoLianDelta) || 0))),
        oppositeDelta: Math.max(-15, Math.min(15, Math.round(Number(item?.oppositeDelta) || 0))),
        guaDelta     : Math.max(-10, Math.min(10, Math.round(Number(item?.guaDelta)      || 0))),
      });
    });
  }
  return yearsChunk.map(year => {
    const hit = map.get(year.age);
    if (hit) return hit;
    const range   = year.decadal?.range || '';
    const profile = decadeProfilesMap?.get(range);
    const base    = profile?.decadeBaseScore || 55;
    const factor  = profile?.decadeFactor   || 1.0;
    const raw     = estimateFallbackScore(year);
    const blended = Math.round((base * 0.5 + raw * 0.5) * factor);
    const score   = Math.max(5, Math.min(98, blended));
    return {
      age          : year.age,
      score,
      rawScore     : score,
      summary      : '模型未返回，按盘面规则估算',
      decadeFactor : factor,
      baseScore    : base,
      xiaoLianDelta: 0,
      oppositeDelta: 0,
      guaDelta     : 0,
    };
  });
}

// ── 重大关口年检测 ────────────────────────────────────────────

/**
 * 统计 summary 中高危关键词命中数
 */
function countCriticalKeywords(text) {
  const keywords = ['忌', '空', '劫', '煞', '刑', '病', '死', '绝', '丧', '哭'];
  const t = String(text || '');
  return keywords.filter(kw => t.includes(kw)).length;
}

/**
 * 从完整年龄分数序列中检测"第一个结构性断崖年"
 * - 必须基于完整序列（不能在单个 chunk 内判断）
 * - 仅在 years.length >= 30 时调用（all 模式）
 * - 返回 criticalYear（整数年龄）或 null
 */
function detectCriticalYear(scores, decadeProfilesMap) {
  if (!Array.isArray(scores) || scores.length < 3) return null;

  const sorted = [...scores].sort((a, b) => a.age - b.age);

  // 解析并排序大运十年段
  const orderedDecades = [];
  decadeProfilesMap.forEach((profile, range) => {
    const m = String(range).match(/\d+/g);
    if (m && m.length >= 2) {
      const start = Number(m[0]), end = Number(m[1]);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        orderedDecades.push({
          range, start, end,
          decadeFactor   : profile.decadeFactor    || 1.0,
          decadeBaseScore: profile.decadeBaseScore  || 55,
          expected       : Math.max(5, Math.min(98,
            Math.round((profile.decadeBaseScore || 55) * (profile.decadeFactor || 1.0))
          )),
        });
      }
    }
  });
  orderedDecades.sort((a, b) => a.start - b.start);

  const getDecadeForAge = age =>
    orderedDecades.find(d => age >= d.start && age <= d.end) || null;

  for (let i = 1; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const prev = sorted[i - 1];
    const next = sorted[i + 1];

    const currDecade = getDecadeForAge(curr.age);
    if (!currDecade) continue;

    const currentExp    = currDecade.expected;
    const prevDecade    = orderedDecades.slice().reverse().find(d => d.end < currDecade.start);
    const prevExp       = prevDecade ? prevDecade.expected : currentExp;
    const futureDecades = orderedDecades.filter(d => d.start > currDecade.end);

    // 条件 A：弱大运（因子≤0.78 或期望分≤42）
    const condA = currDecade.decadeFactor <= 0.78 || currentExp <= 42;
    if (!condA) continue;

    // 条件 B：前一个十年明显更强
    const condB = (prevExp - currentExp) >= 10;
    if (!condB) continue;

    // 条件 C：未来没有明显翻盘十年
    const condC = futureDecades.every(d => d.expected <= currentExp + 5);
    if (!condC) continue;

    // 条件 D：前一年是局部高点（落差≥10）
    const condD = prev.score > curr.score && (prev.score - curr.score) >= 10;
    if (!condD) continue;

    // 条件 E：当前年已经断崖（分数≤35 或三角度量之和≤-18）
    const delta = (curr.xiaoLianDelta || 0) + (curr.oppositeDelta || 0) + (curr.guaDelta || 0);
    const condE = curr.score <= 35 || delta <= -18;
    if (!condE) continue;

    // 条件 F：下一年没有明显回升（≤当前+5）
    const condF = next.score <= curr.score + 5;
    if (!condF) continue;

    // 条件 G：凶象确认（二选一）
    const kwCount = countCriticalKeywords(curr.summary);
    const condG   = kwCount >= 2 || (curr.score <= 35 && next.score <= 38);
    if (!condG) continue;

    // 排除 P1：下一年强反弹（≥12分）
    if (next.score - curr.score >= 12) continue;

    // 排除 P2：未来仍有更强十年
    if (futureDecades.some(d => d.expected >= currentExp + 8)) continue;

    // 排除 P3：只是流年差，不是大运结构断崖
    if (currDecade.decadeFactor > 0.88 && currentExp > 48) continue;

    return curr.age;
  }
  return null;
}

/**
 * 对 criticalYear 之后的年份统一乘以 0.5
 * - criticalYear 当年本身不打折
 * - 打折范围：age > criticalYear
 * - 结果仍夹在 5-98
 */
function applyCriticalPenalty(scores, criticalYear) {
  if (criticalYear == null) return scores;
  return scores.map(item => {
    const rawScore = item.rawScore ?? item.score;
    if (item.age > criticalYear) {
      return {
        ...item,
        rawScore,
        score                 : Math.max(5, Math.min(98, Math.round(rawScore * 0.5))),
        criticalPenaltyApplied: true,
        criticalYear,
      };
    }
    return {
      ...item,
      rawScore,
      criticalPenaltyApplied: false,
      criticalYear,
    };
  });
}

async function scoreLifeCurveChunk(chartSummary, yearsChunk, decadeProfilesMap) {
  const cacheKey = buildChunkCacheKey(chartSummary, yearsChunk);
  const cached   = getCachedChunk(cacheKey);
  if (cached) {
    console.log(`[piming-api] 命中缓存 ${cacheKey.slice(0, 8)} ages ${yearsChunk[0]?.age}-${yearsChunk[yearsChunk.length - 1]?.age}`);
    return cached;
  }

  const prompt    = buildLifeCurvePrompt(chartSummary, yearsChunk, decadeProfilesMap);
  let result      = null;
  let lastError   = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      result = await callDeepSeek(prompt.system, prompt.user, { maxTokens: 2400, temperature: 0 });
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!result) {
    return {
      model  : MODEL,
      scores : normalizeLifeCurveScores([], yearsChunk, decadeProfilesMap).map(item => ({
        ...item,
        summary: `接口异常，规则估算：${item.summary}`.slice(0, 48),
      })),
      warning: lastError?.message || '模型调用失败',
    };
  }
  const out = {
    model  : MODEL,
    scores : normalizeLifeCurveScores(result?.scores, yearsChunk, decadeProfilesMap),
    warning: null,
  };
  setCachedChunk(cacheKey, out);
  return out;
}

// ── 请求体格式化（把前端数据转成可读文本）───────────────────

const CHAT_SYSTEM = `你是紫微斗数排盘信息采集助手，唯一任务是收集命盘所需的出生信息。

【必须收集的字段】
- calType: "solar"（公历）或 "lunar"（农历）
- year, month, day: 出生年月日
- hour: 出生小时（0-23制）；用户说"不知道"/"不记得"则用12，不要继续追问
- gender: male 或 female
- city: 出生城市（影响真太阳时）；用户没提就问一次，说不知道则留空
- isLeap: 仅农历闰月时为 true

【推断规则——能猜就猜，不要追问已能确定的字段】
- 时辰→小时：子=0,丑=1,寅=3,卯=5,辰=7,巳=9,午=11,未=13,申=15,酉=17,戌=19,亥=21
- "晚上/下午/傍晚X点"加12（>12不加），"早上/上午/凌晨X点"不加，"中午"=12
- "晚饭后"≈19，"午饭后"≈13，"早饭时"≈8，"天亮"≈6，"半夜"≈0，"睡前"≈22
- "96年"=1996，"08年"=2008；1990年后生人提到"初一/十五"等农历词汇仍用公历核实
- 含"农历/阴历/旧历/正月/腊月/初X"明显是农历，含"元旦/国庆/五一"明显是公历
- 未明说公历/农历：直接默认公历（calType="solar"），不要追问；仅当用户明确说"农历/阴历/旧历"时才用lunar
- 省份（广东/福建等）无法确定城市时，city填省名即可，不要追问
- 对话历史中已有的字段直接复用，不要重新确认

【回复规则】
- 只返回 JSON，不要其他文字
- 一次最多问2个缺失字段，合并成一句自然中文
- 缺字段优先级：年月日 > 时 > 性别 > calType（能猜就猜） > 城市
- 询问城市时加"影响真太阳时"

【返回格式】
完整：{"complete":true,"calType":"solar","year":1991,"month":2,"day":16,"hour":22,"minute":0,"gender":"male","city":"上海"}
农历：{"complete":true,"calType":"lunar","year":1990,"month":12,"day":3,"isLeap":false,"hour":5,"minute":0,"gender":"female","city":"南昌"}
city 未知则省略该字段。
不完整：{"complete":false,"reply":"几号出生？性别？"}`;

// ── 天纪 AI 辅助推时辰 ──────────────────────────────────────
const SHICHEN_INFER_SYSTEM = `你是出生时辰推断助手，依据倪海厦《天纪》规则。
用户不知道准确出生时辰，请根据所有线索推断最可能的出生时辰。

【天纪头旋规则（从后面看）】
- 单旋，居中或偏左 → 子午卯酉时辰组（子23-01、午11-13、卯05-07、酉17-19）
- 单旋，偏右 → 寅申巳亥时辰组（寅03-05、巳09-11、申15-17、亥21-23）
- 双旋/多旋 → 辰戌丑未时辰组（丑01-03、辰07-09、未13-15、戌19-21）

【推断方法】
1. 先用模糊时间描述（"早上""晚上""凌晨""日落""吃早饭时"等）缩小到粗时段
2. 再用头旋规则从粗时段内筛出候选时辰
3. 如果粗时段和头旋都有，取交集
4. 如果交集为空，以头旋组为主、粗时段为参考
5. 如果只有一条线索，基于该线索给出候选

【模糊时间→粗时段映射参考】
- 凌晨/深夜/半夜 → 23:00-03:00
- 天亮前/黎明 → 03:00-07:00
- 早上/上午/吃早饭 → 07:00-11:00
- 中午/正午/吃午饭 → 11:00-13:00
- 下午 → 13:00-17:00
- 傍晚/日落/黄昏 → 17:00-19:00
- 晚上/晚饭后 → 19:00-23:00

【返回格式 — 必须是纯 JSON】
{
  "approxTimeBand": "晚上(19:00-23:00)",
  "candidateHours": [
    {"shichen":"亥","hour":21,"range":"21:00-23:00"},
    {"shichen":"戌","hour":19,"range":"19:00-21:00"}
  ],
  "bestGuess": {"shichen":"亥","hour":21,"range":"21:00-23:00"},
  "confidence": "high",
  "followupQuestions": [],
  "reasonSummary": "用户说晚上出生，头旋偏右对应寅申巳亥组，亥时(21-23)落在晚上范围，推荐亥时。"
}

confidence 标准：
- high: 粗时段+头旋交集唯一，或信息足够明确
- medium: 可缩小到2-3个候选
- low: 信息太少，无法有效缩小

followupQuestions: 如果 confidence 不是 high，给出1-2个可以帮助进一步缩小的追问。
例如："是否记得当时天已经全黑了？""是在吃早饭前还是后？"

candidateHours 按可能性从高到低排列，最多4个。`;

app.post('/api/shichen-infer', async (req, res) => {
  const { birthDate, gender, city, vagueTime, whorlType, additionalInfo } = req.body || {};
  if (!vagueTime && !whorlType) {
    return res.status(400).json({ error: '至少提供模糊时间描述或头旋信息' });
  }

  const parts = [];
  if (birthDate) parts.push('出生日期：' + birthDate);
  if (gender) parts.push('性别：' + (gender === 'female' ? '女' : '男'));
  if (city) parts.push('出生城市：' + city);
  if (vagueTime) parts.push('模糊时间描述：' + vagueTime);
  if (whorlType === 'center-left') parts.push('头旋：单旋，居中或偏左');
  else if (whorlType === 'right') parts.push('头旋：单旋，偏右');
  else if (whorlType === 'double') parts.push('头旋：双旋/多旋');
  if (additionalInfo) parts.push('其他信息：' + additionalInfo);

  const userMsg = '请根据以下信息推断出生时辰：\n' + parts.join('\n');

  try {
    const resp = await deepseek.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SHICHEN_INFER_SYSTEM },
        { role: 'user', content: userMsg },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 400,
    });
    const raw = resp.choices[0]?.message?.content || '{}';
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { confidence: 'low', reasonSummary: '解析失败', candidateHours: [], followupQuestions: ['请提供更多信息'] }; }
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[shichen-infer] DeepSeek 调用失败:', err.message);
    return res.status(502).json({ error: 'AI 调用失败：' + err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages 字段缺失或为空' });
  }
  try {
    let resp = null;
    let lastErr = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        resp = await deepseek.chat.completions.create({
          model          : MODEL,
          messages       : [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
          response_format: { type: 'json_object' },
          temperature    : 0.3,
          max_tokens     : 200,
        });
        break;
      } catch (err) {
        lastErr = err;
        console.error(`[chat-api] DeepSeek 调用失败(第${attempt}/3次):`, err.message);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 250 * attempt));
        }
      }
    }
    if (!resp) throw lastErr || new Error('DeepSeek 无响应');

    const raw = resp.choices[0]?.message?.content || '{}';
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { complete: false, reply: '抱歉，请重新输入你的出生信息。' }; }
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[chat-api] DeepSeek 调用失败:', err.message);
    // 聊天识别走前端交互链路，这里统一降级为可继续对话，避免前端直接判定“服务不可用”。
    return res.json({
      ok: true,
      data: {
        complete: false,
        reply: 'AI服务繁忙，请稍后重试，或先手动填写下面的出生信息。',
      },
    });
  }
});

// ── 主接口 ───────────────────────────────────────────────

app.post('/api/piming', async (req, res) => {
  const { topic, _rawPrompt } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic 字段不能为空' });

  // 调试台透传模式：调用方自己组装 system+user，返回纯文本
  if (_rawPrompt) {
    try {
      if (_rawPrompt.stream) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-AI-Model', MODEL);
        await callDeepSeekRawStream(
          _rawPrompt.system || '',
          _rawPrompt.user || '',
          chunk => res.write(chunk)
        );
        return res.end();
      }

      const text = await callDeepSeekRaw(_rawPrompt.system || '', _rawPrompt.user || '');
      return res.json({ ok: true, topic, model: MODEL, text: sanitizeAiText(text) });
    } catch (err) {
      console.error('[piming-api] DeepSeek raw 调用失败:', err.message);
      return res.status(502).json({ error: 'AI 调用失败：' + err.message });
    }
  }

  try {
    if (topic === 'overall_piming') {
      const prompt = buildOverallPimingPrompt(req.body);
      const t0 = Date.now();
      const result = await callDeepSeek(prompt.system, prompt.user, {
        temperature: 0.7,
        maxTokens: 900,
      });
      const rs = prompt.ruleSummary;
      // 只向前端输出 confirmed !== false 的破格（条件不完整的仅留 debug）
      const userBreaks = (rs?.breaks || [])
        .filter(b => b.name !== '化忌入命' && b.confirmed !== false);
      const card = {
        title   : sanitizeAiText(result.title   || '整体命格分析'),
        summary : sanitizeAiText(result.summary  || ''),
        risk    : sanitizeAiText(result.risk     || ''),
        basis   : sanitizeAiText(result.basis    || ''),
        evidence: prompt.evidence,
        // 结构化字段：前端速览卡 AI 两行 + badge 使用
        sanfangProfile: rs?.sanfangProfile ? { label: rs.sanfangProfile.label } : null,
        profileBadge  : rs?.sanfangProfile?.label || null,   // 平铺字段，供前端直接读取
        patterns      : (rs?.patterns || []).map(p => ({ name: p.name, level: p.level })),
        patternText   : (rs?.patterns || []).map(p => p.name).join('、') || null,
        breaks        : userBreaks.map(b => ({ name: b.name, severity: b.severity })),
        breakText     : userBreaks.map(b => b.name).join('、') || null,
      };
      return res.json({
        ok    : true,
        module: 'overall_piming',
        card,
      debug : {
          topic            : 'overall_piming',
          requestSummary   : prompt.requestSummary,
          trace            : prompt.trace,
          rawResponse      : JSON.stringify(result),
          durationMs       : Date.now() - t0,
          model            : MODEL,
          promptGuide      : prompt.promptGuideMeta,
          ruleSummary      : prompt.ruleSummary,
          toneDetails      : prompt.toneDetails,
          // 完整格局/破格候选（含 confirmed:false），仅供调试
          patternCandidates: (rs?.patterns || []).map(p => ({ name: p.name, level: p.level, desc: p.desc })),
          breakConditions  : (rs?.breaks   || []).map(b => ({
            name     : b.name,
            severity : b.severity,
            confirmed: b.confirmed ?? true,
            reason   : b.reason || null,
            desc     : b.desc,
          })),
        },
      });
    }

    return res.status(400).json({
      ok: false,
      error: 'unsupported topic',
      supportedTopics: ['overall_piming'],
    });
  } catch (err) {
    console.error('[piming-api] DeepSeek 调用失败:', err.message);
    res.status(502).json({ error: 'AI 调用失败：' + err.message });
  }
});

app.post('/api/life-curve', async (req, res) => {
  const { chartSummary = {}, years = [], stream = true, chunkSize } = req.body || {};
  if (!Array.isArray(years) || !years.length) {
    return res.status(400).json({ ok: false, error: 'years 不能为空' });
  }

  const safeChunkSize = Math.max(1, Math.min(20, Number(chunkSize) || LIFE_CURVE_CHUNK_SIZE));
  const chunks = [];
  for (let i = 0; i < years.length; i += safeChunkSize) {
    chunks.push(years.slice(i, i + safeChunkSize));
  }

  const run = async writeEvent => {
    await writeEvent({
      type: 'stage',
      stage: 'queued',
      message: `已收到请求，准备评分 ${years.length} 个年龄点`,
    });
    await writeEvent({ type: 'progress', done: 0, total: years.length, warnings: 0 });

    const defaultDecadeProfiles = buildDefaultDecadeProfilesMap(years);
    await writeEvent({
      type: 'decades',
      decades: Array.from(defaultDecadeProfiles.values()),
      provisional: true,
    });

    // ── 第一层：先算十年大运底色 ──────────────────────────────
    let decadeProfilesMap = defaultDecadeProfiles;
    await writeEvent({
      type: 'stage',
      stage: 'decade',
      message: '正在分析十年大运底色…',
    });
    try {
      decadeProfilesMap = await scoreDecadesBatch(chartSummary, years);
      await writeEvent({
        type   : 'decades',
        decades: Array.from(decadeProfilesMap.values()),
        provisional: false,
      });
    } catch (err) {
      console.warn('[piming-api] 大运层评分失败:', err.message);
      await writeEvent({
        type: 'decades',
        decades: Array.from(defaultDecadeProfiles.values()),
        warning: err.message,
        provisional: true,
      });
    }

    await writeEvent({
      type: 'stage',
      stage: 'yearly',
      message: '十年底色已就绪，开始逐年精算…',
    });

    // ── 第二层：逐年评分，并发计算但按 chunk 原始顺序向前端发 partial ──
    const CONCURRENCY = 3;
    let done = 0;
    let allScores = [];
    let warningCount = 0;
    const pending = chunks.map((chunk, idx) => ({ idx, chunk }));
    const running = new Map();
    // 缓冲已完成但还不到发送顺序的 chunk，保证按 idx 升序 flush
    const completedBuffer = new Map();
    let nextToSend = 0;

    const launchOne = () => {
      if (!pending.length) return false;
      const task = pending.shift();
      const promise = scoreLifeCurveChunk(chartSummary, task.chunk, decadeProfilesMap)
        .then(result => ({ idx: task.idx, result }));
      running.set(task.idx, promise);
      return true;
    };

    for (let i = 0; i < CONCURRENCY; i++) {
      if (!launchOne()) break;
    }

    while (running.size) {
      const settled = await Promise.race([...running.values()]);
      running.delete(settled.idx);

      const result = settled.result || { scores: [], model: MODEL };
      if (result.warning) warningCount += 1;
      allScores = allScores.concat(result.scores || []);

      // 先缓冲，等待按 idx 升序发送，确保前端收到的 partial 严格按年龄从小到大
      completedBuffer.set(settled.idx, result);

      while (completedBuffer.has(nextToSend)) {
        const r = completedBuffer.get(nextToSend);
        completedBuffer.delete(nextToSend);
        done += (r.scores || []).length;
        await writeEvent({
          type    : 'partial',
          model   : r.model || MODEL,
          scores  : r.scores || [],
          done,
          total   : years.length,
          warnings: warningCount,
        });
        await writeEvent({ type: 'progress', done, total: years.length, warnings: warningCount });
        nextToSend++;
      }

      launchOne();
    }

    allScores.sort((a, b) => a.age - b.age);

    // ── 重大关口年检测（全局，仅在 all 模式 years >= 30 时执行）──────────────
    let criticalYear = null;
    if (years.length >= 30) {
      criticalYear = detectCriticalYear(allScores, decadeProfilesMap);
      if (criticalYear !== null) {
        console.log(`[piming-api] 重大关口年: ${criticalYear}岁，此后分数按 0.5 折减`);
        allScores = applyCriticalPenalty(allScores, criticalYear);
      }
    }

    await writeEvent({
      type        : 'result',
      model       : MODEL,
      scores      : allScores,
      decades     : Array.from(decadeProfilesMap.values()),
      warnings    : warningCount,
      criticalYear,
    });
    return allScores;
  };

  try {
    if (stream !== false) {
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-AI-Model', MODEL);
      await run(async evt => {
        res.write(`${JSON.stringify(evt)}\n`);
      });
      return res.end();
    }

    let scores = [];
    await run(async evt => {
      if (evt.type === 'result') scores = evt.scores || [];
    });
    return res.json({ ok: true, model: MODEL, scores });
  } catch (err) {
    console.error('[piming-api] life-curve 调用失败:', err.message);
    if (stream !== false && !res.headersSent) {
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
    }
    if (stream !== false) {
      res.write(`${JSON.stringify({ type: 'error', error: 'AI 年度评分失败：' + err.message })}\n`);
      return res.end();
    }
    return res.status(502).json({ ok: false, error: 'AI 年度评分失败：' + err.message });
  }
});

// ── 启动 ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[piming-api] 运行中 → http://localhost:${PORT}`);
  console.log(`[piming-api] 模型: ${MODEL}  Key: ${API_KEY.slice(0,8)}...`);
});
