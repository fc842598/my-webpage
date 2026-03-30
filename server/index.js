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

if (!API_KEY) {
  console.error('[piming-api] 缺少 DEEPSEEK_API_KEY 环境变量，请在 server/.env 中设置');
  process.exit(1);
}

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey : API_KEY,
});

// ── 评分缓存（文件级，同命盘同年龄段不重复调用 AI）──────────────
const PROMPT_VERSION = 'v2-structured';
const CACHE_DIR = path.join(__dirname, '.cache', 'life-curve');

function buildChunkCacheKey(chartSummary, yearsChunk) {
  const keyData = JSON.stringify({
    v     : PROMPT_VERSION,
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
app.use(express.json({ limit: '64kb' }));

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

const LIFE_CURVE_CHUNK_SIZE = 20;

// 校验并重算 finalScore（防止 AI 随意填数）
function computeValidatedScore(item) {
  const base = Math.max(20, Math.min(80, Math.round(Number(item?.baseScore)     || 60)));
  const d1   = Math.max(-20, Math.min(20, Math.round(Number(item?.xiaoLianDelta) || 0)));
  const d2   = Math.max(-15, Math.min(15, Math.round(Number(item?.oppositeDelta) || 0)));
  const d3   = Math.max(-15, Math.min(15, Math.round(Number(item?.decadalDelta)  || 0)));
  const d4   = Math.max(-10, Math.min(10, Math.round(Number(item?.guaDelta)      || 0)));
  const computed = base + d1 + d2 + d3 + d4;
  const claimed  = Math.round(Number(item?.finalScore) || computed);
  // 若 AI 的 finalScore 与算出值偏差 ≤ 8 则采纳，否则用算出值
  const final = Math.abs(claimed - computed) <= 8 ? claimed : computed;
  return Math.max(5, Math.min(98, final));
}

function buildLifeCurvePrompt(chartSummary, yearsChunk) {
  const chunkText = yearsChunk.map(year => [
    `- ${year.age}岁 / ${year.year}年`,
    `  流年卦: ${year.liunianGua?.name || '—'} ${year.liunianGua?.period || ''}`.trim(),
    `  小流年本宫: ${year.xiaoLian?.palace || '—'}（${year.xiaoLian?.branch || '—'}）`,
    `  本宫星曜: ${year.xiaoLian?.stars || '—'}`,
    `  对宫: ${year.opposite?.palace || '—'}（${year.opposite?.branch || '—'}）`,
    `  对宫星曜: ${year.opposite?.stars || '—'}`,
    `  十年大运: ${year.decadal?.palace || '—'} ${year.decadal?.range ? `（${year.decadal.range}）` : ''}`.trim(),
    `  大运星曜: ${year.decadal?.stars || '—'}`,
  ].join('\n')).join('\n');

  return {
    system: [
      '你是紫微斗数流年评分助手，按海厦体系的命理精神做年度趋势评分。',
      '你只负责给每一个年龄单独评分，不要把相邻年龄机械合并成同一结果。',
      '评分规则（四维度分解）：',
      '  baseScore [20-80]：命盘先天格局底分，全段相同。',
      '  xiaoLianDelta [-20~+20]：小流年本宫星曜的当年影响（忌煞为负，吉曜为正）。',
      '  oppositeDelta [-15~+15]：对宫星曜对本宫的反冲影响（同上规则）。',
      '  decadalDelta  [-15~+15]：十年大运整体底色（大运劣则全段偏负）。',
      '  guaDelta      [-10~+10]：流年卦提示的吉凶调整量。',
      '  finalScore = baseScore + xiaoLianDelta + oppositeDelta + decadalDelta + guaDelta，夹在 5-98 之间。',
      '60 为普通，80 以上明显顺，40 以下明显低谷。',
      '返回必须是严格 JSON，不要 markdown，不要解释过程。'
    ].join('\n'),
    user: [
      '请根据下面命盘摘要和年度数据，为每一个年龄给出四维度分解评分。',
      '',
      '【命盘摘要】',
      `姓名：${chartSummary?.name || '—'}`,
      `性别：${chartSummary?.gender || '—'}`,
      `公历：${chartSummary?.solar || '—'}`,
      `农历：${chartSummary?.lunar || '—'}`,
      `节气四柱：${chartSummary?.sizhu || '—'}`,
      `先天卦：${chartSummary?.xianTian || '—'}`,
      `后天卦：${chartSummary?.houTian || '—'}`,
      `当前流年卦：${chartSummary?.currentLiuNian || '—'}`,
      `五行局：${chartSummary?.fiveElementsClass || '—'}`,
      '',
      '【待评分年龄数据】',
      chunkText,
      '',
      '返回格式（严格遵守，不得增删字段）：',
      '{',
      '  "scores": [',
      '    {',
      '      "age": 1,',
      '      "baseScore": 58,',
      '      "xiaoLianDelta": 5,',
      '      "oppositeDelta": -3,',
      '      "decadalDelta": 2,',
      '      "guaDelta": 0,',
      '      "finalScore": 62,',
      '      "summary": "一句话主因，15字内"',
      '    }',
      '  ]',
      '}',
      '',
      '要求：',
      '1. 每个年龄都必须返回一条，不允许漏年龄。',
      '2. finalScore 必须等于四个 delta 与 baseScore 之和（允许 ±2 舍入误差）。',
      '3. summary 直接点出高低分主因，不要重复年龄数字。',
      '4. 不允许把多个年龄合并描述。',
    ].join('\n')
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

function normalizeLifeCurveScores(rawScores, yearsChunk) {
  const map = new Map();
  if (Array.isArray(rawScores)) {
    rawScores.forEach(item => {
      const age = Number(item?.age);
      if (!Number.isFinite(age)) return;
      const score   = computeValidatedScore(item);
      const summary = sanitizeAiText(item?.summary || '').slice(0, 48);
      map.set(age, { age, score, summary });
    });
  }
  return yearsChunk.map(year => {
    const hit = map.get(year.age);
    if (hit) return hit;
    return {
      age    : year.age,
      score  : estimateFallbackScore(year),
      summary: '模型未返回，按盘面规则估算',
    };
  });
}

async function scoreLifeCurveChunk(chartSummary, yearsChunk) {
  const cacheKey = buildChunkCacheKey(chartSummary, yearsChunk);
  const cached = getCachedChunk(cacheKey);
  if (cached) {
    console.log(`[piming-api] 命中缓存 ${cacheKey.slice(0, 8)} ages ${yearsChunk[0]?.age}-${yearsChunk[yearsChunk.length - 1]?.age}`);
    return cached;
  }

  const prompt = buildLifeCurvePrompt(chartSummary, yearsChunk);
  let result = null;
  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      result = await callDeepSeek(prompt.system, prompt.user, {
        maxTokens  : 2400,
        temperature: 0,
      });
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!result) {
    return {
      model  : MODEL,
      scores : normalizeLifeCurveScores([], yearsChunk).map(item => ({
        ...item,
        summary: `接口异常，规则估算：${item.summary}`.slice(0, 48),
      })),
      warning: lastError?.message || '模型调用失败',
    };
  }
  const out = {
    model  : MODEL,
    scores : normalizeLifeCurveScores(result?.scores, yearsChunk),
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
    let done = 0;
    let allScores = [];
    let warningCount = 0;
    for (const chunk of chunks) {
      const result = await scoreLifeCurveChunk(chartSummary, chunk);
      if (result.warning) warningCount += 1;
      allScores = allScores.concat(result.scores);
      await writeEvent({
        type: 'partial',
        model: result.model || MODEL,
        scores: result.scores || [],
        done: done + chunk.length,
        total: years.length,
        warnings: warningCount,
      });
      done += chunk.length;
      await writeEvent({
        type: 'progress',
        done,
        total: years.length,
        warnings: warningCount,
      });
    }
    allScores.sort((a, b) => a.age - b.age);
    await writeEvent({
      type: 'result',
      model: MODEL,
      scores: allScores,
      warnings: warningCount,
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
