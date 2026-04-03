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
const OpenAI  = require('openai').default ?? require('openai');

// ── 配置 ────────────────────────────────────────────────
const PORT    = process.env.PORT    || 3001;
const MODEL   = process.env.DEEPSEEK_MODEL || 'deepseek-chat';  // 改成 deepseek-reasoner 即升级推理
const API_KEY = process.env.DEEPSEEK_API_KEY;
const MINGGONG_DEBUG_DOC_PATH = path.join(__dirname, '..', 'docs', 'minggong-ai-debug-base.md');

if (!API_KEY) {
  console.error('[piming-api] 缺少 DEEPSEEK_API_KEY 环境变量，请在 server/.env 中设置');
  process.exit(1);
}

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey : API_KEY,
});

function readTextFileSafe(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_err) {
    return fallback;
  }
}

const FALLBACK_MINGGONG_DEBUG_DOC = `
## 命宫总批 AI 调试文档（基础版）
- 只处理命宫格局卡片
- 只看命宫与三方四正
- 标题沿用前端标题
- summary 必须引用命宫主星和至少一个三方四正宫位
- risk 只写一条最关键提醒
- basis 只写本次判断主要依据
`.trim();
const MINGGONG_DEBUG_DOC = readTextFileSafe(MINGGONG_DEBUG_DOC_PATH, FALLBACK_MINGGONG_DEBUG_DOC);

// ── 评分缓存（文件级，同命盘同年龄段不重复调用 AI）──────────────
const PROMPT_VERSION = 'v3-two-layer';
// 算法升级版本号：修改此值会使旧 chunk 缓存全部失效，强制用新算法重算
const LIFE_CURVE_ALGO_VERSION = 'v2-critical-year';
const CACHE_DIR = path.join(__dirname, '.cache', 'life-curve');

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

// ── Prompt 构建 ──────────────────────────────────────────

function buildPrompt(topic, body) {
  const RETURN_SCHEMA = `
返回严格JSON（只返回JSON，不要任何额外说明或 markdown 代码块）：
{
  "overview":    "命格/阶段一句话总结（≤30字）",
  "minggong":    "命宫格局分析（≤60字，必须引用主星名）",
  "currentLuck": "当前大限/流年重点（≤60字，引用具体宫位或卦名）",
  "risks":       "最需注意的风险点（≤40字）",
  "advice":      "核心建议（≤40字）"
}`;

  if (topic === 'base') {
    return {
      system: '你是一位精通紫微斗数的命理师，分析简洁、有依据，不说空泛套话。',
      user  : `请根据以下本命盘数据，对"本命格局"进行结构化批命分析：

${body}

重点分析：命宫主星与特质、身宫辅助、三方四正对命宫的影响、生年四化中的重点。
currentLuck 字段本命批命不适用，填写 "（见大限流年）" 即可。
${RETURN_SCHEMA}`,
    };
  }

  if (topic === 'luck') {
    return {
      system: '你是一位精通紫微斗数和子平法的命理师，分析精准、有依据，不说空泛套话。',
      user  : `请根据以下当前大限/流年数据，进行结构化批命分析：

${body}

重点分析：当前大限阶段特质、流年卦象提示、小限落宫的宫位意义、近期行动建议。
minggong 字段大限流年批命不适用，填写 "（见本命批命）" 即可。
${RETURN_SCHEMA}`,
    };
  }

  // 通用主题（婚姻/财运/事业/健康）预留
  return {
    system: '你是一位精通紫微斗数的命理师，分析简洁有依据。',
    user  : `主题：${topic}\n\n${body}\n\n${RETURN_SCHEMA}`,
  };
}

function buildMinggongDevPrompt(req) {
  const { cardTitle = '', ctx = {}, taskPrompt = '' } = req || {};
  const contextText = JSON.stringify(ctx || {}, null, 2);
  const system = [
    '你是紫微斗数命宫总批模块的开发调试分析助手。',
    '你只处理命宫格局这一张卡片，不扩写其它主题。',
    '你必须严格依照调试文档和结构化上下文输出，不得杜撰未提供的星曜、宫位、四化。',
    '你必须返回严格 JSON，不要 markdown，不要代码块。',
  ].join('\n');

  const user = [
    '【当前卡片标题】',
    cardTitle || '（未提供）',
    '',
    '【调试文档】',
    MINGGONG_DEBUG_DOC.trim(),
    '',
    ...(taskPrompt ? ['【任务补充】', taskPrompt.trim(), ''] : []),
    '【结构化命盘上下文】',
    contextText,
    '',
    '【输出格式】',
    '{',
    '  "title": "沿用当前卡片标题",',
    '  "summary": "80到160字，必须引用命宫主星，并至少提到一个三方四正宫位",',
    '  "risk": "一句最关键提醒，50字内",',
    '  "basis": "开发调试字段，说明本次判断主要依据，必须点名命宫和至少一个三方四正宫位"',
    '}',
  ].join('\n');

  return {
    system,
    user,
    contextText,
    trace: {
      docPath: MINGGONG_DEBUG_DOC_PATH,
      debugDoc: MINGGONG_DEBUG_DOC.trim(),
      steps: [
        '收到 /api/piming topic=minggong_dev',
        `载入调试文档：${path.basename(MINGGONG_DEBUG_DOC_PATH)}`,
        '整理命宫与三方四正结构化上下文',
        `调用 DeepSeek 模型：${MODEL}`,
        '解析 JSON 返回并回传前端',
      ],
    },
  };
}

// ── 调用 DeepSeek ────────────────────────────────────────

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

function formatBody(req) {
  const { chartSummary = '', palaces = [], focus = '', activeAge, gua } = req;
  let lines = [];
  if (chartSummary) lines.push('【命盘摘要】', chartSummary, '');
  if (palaces.length) {
    lines.push('【宫位数据】');
    palaces.forEach(p => {
      const stars = [...(p.majorStars||[]), ...(p.minorStars||[])];
      const starStr = stars.map(s => s.name + (s.mutagen ? s.mutagen : '')).join('、') || '空宫';
      lines.push(`  ${p.name}：${starStr}`);
    });
    lines.push('');
  }
  if (activeAge) lines.push(`【当前虚岁】${activeAge}岁`);
  if (gua)       lines.push(`【流年卦】${gua.name || '—'}（${gua.period || ''}）`);
  if (focus)     lines.push('', '【重点关注】', focus);
  return lines.join('\n');
}

// ── AI 智能识别对话接口 ──────────────────────────────────
const CHAT_SYSTEM = `你是紫微斗数排盘信息采集助手，唯一任务是收集命盘所需的出生信息。

【必须收集的字段】
- calType: "solar"（公历）或 "lunar"（农历）——必须明确，未说明则主动问
- year: 出生年（整数）
- month: 出生月（1-12）
- day: 出生日（1-31）
- hour: 出生小时（0-23制）
- gender: male 或 female
- city: 出生城市（影响真太阳时，务必询问，用户说不知道或不填才留空）
- isLeap: 农历闰月时为 true，否则 false（仅 calType=lunar 时需要）

【格式解析规则】
- 时辰→小时：子=0,丑=1,寅=3,卯=5,辰=7,巳=9,午=11,未=13,申=15,酉=17,戌=19,亥=21
- "晚上/下午X点"加12，"早上/上午X点"不加
- "96年"="1996年"，"08年"="2008年"（90后默认19xx，00后默认20xx）
- 用户未说明公历/农历时，中国大陆出生的老年人（1970前）倾向农历，其他默认公历，但仍需主动确认
- 不规范输入尽量猜测，猜到就直接记录，不再追问该字段
- 从对话历史中提取已有信息，已知字段不再追问

【回复规则】
- 每次只返回 JSON，不要任何其他文字
- 与命盘信息无关的问题，reply 固定回复：这里只做命盘信息识别，请告诉我你的出生信息。
- 缺多个字段时合并一句话问，简短自然，优先级：calType > 年月日 > 时 > 性别 > 城市
- 询问城市时加一句"影响真太阳时"

【返回格式】
完整时：
{"complete":true,"calType":"solar","year":1991,"month":2,"day":16,"hour":22,"minute":0,"gender":"male","city":"上海"}
农历示例：
{"complete":true,"calType":"lunar","year":1990,"month":12,"day":3,"isLeap":false,"hour":5,"minute":0,"gender":"female","city":"南昌"}
city 未提供则省略。

不完整时：
{"complete":false,"reply":"好的，公历还是农历？几号几点，出生城市？"}`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages 字段缺失或为空' });
  }
  try {
    const resp = await deepseek.chat.completions.create({
      model          : MODEL,
      messages       : [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
      response_format: { type: 'json_object' },
      temperature    : 0.3,
      max_tokens     : 200,
    });
    const raw = resp.choices[0]?.message?.content || '{}';
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { complete: false, reply: '抱歉，请重新输入你的出生信息。' }; }
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('[chat-api] DeepSeek 调用失败:', err.message);
    return res.status(502).json({ error: 'AI 调用失败：' + err.message });
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
    if (topic === 'minggong_dev') {
      const prompt = buildMinggongDevPrompt(req.body);
      const result = await callDeepSeek(prompt.system, prompt.user, {
        temperature: 0.4,
        maxTokens: 900,
      });
      const out = {
        title  : sanitizeAiText(result.title || req.body.cardTitle || ''),
        summary: sanitizeAiText(result.summary || ''),
        risk   : sanitizeAiText(result.risk || ''),
        basis  : sanitizeAiText(result.basis || ''),
      };
      return res.json({
        ok: true,
        topic,
        model: MODEL,
        result: out,
        trace: {
          ...prompt.trace,
          system: prompt.system,
          user: prompt.user,
          context: prompt.contextText,
          response: JSON.stringify(out, null, 2),
        },
      });
    }

    const body   = formatBody(req.body);
    const prompt = buildPrompt(topic, body);
    const result = await callDeepSeek(prompt.system, prompt.user);

    // 保证返回结构完整（缺字段时填默认值）
    const out = {
      overview   : result.overview    || '',
      minggong   : result.minggong    || '',
      currentLuck: result.currentLuck || '',
      risks      : result.risks       || '',
      advice     : result.advice      || '',
    };
    res.json({ ok: true, topic, model: MODEL, result: out });
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
