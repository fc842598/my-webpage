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
require('dotenv').config();

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

async function callDeepSeek(system, user) {
  const resp = await deepseek.chat.completions.create({
    model   : MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user   },
    ],
    response_format: { type: 'json_object' },
    temperature    : 0.7,
    max_tokens     : 800,
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
      const text = await callDeepSeekRaw(_rawPrompt.system || '', _rawPrompt.user || '');
      return res.json({ ok: true, topic, model: MODEL, text });
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

// ── 启动 ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[piming-api] 运行中 → http://localhost:${PORT}`);
  console.log(`[piming-api] 模型: ${MODEL}  Key: ${API_KEY.slice(0,8)}...`);
});
