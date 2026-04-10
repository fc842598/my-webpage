'use strict';

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const chartHtml = fs.readFileSync(path.join(BASE, 'pages', 'chart.html'), 'utf8');
const aiPiming = fs.readFileSync(path.join(BASE, 'js', 'ai-piming.js'), 'utf8');

function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg);
  }
}

function hasId(id) {
  return chartHtml.includes(`id="${id}"`) || chartHtml.includes(`id='${id}'`);
}

function hasText(text) {
  return chartHtml.includes(text) || aiPiming.includes(text);
}

function main() {
  const requiredIds = [
    'aip-life-ttl',
    'aip-life-body',
    'aip-life-risk',
    'aip-life-basis',
    'aip-life-ev',
    'aip-profile-badge',
    'aip-struct',
    // 命宫
    'aip-struct-life-maj',
    'aip-struct-life-min',
    // 三方四正 4 宫
    'aip-sf-life-maj',   'aip-sf-life-min',
    'aip-sf-career-maj', 'aip-sf-career-min',
    'aip-sf-wealth-maj', 'aip-sf-wealth-min',
    'aip-sf-move-maj',   'aip-sf-move-min',
    // AI 补充行
    'aip-struct-pattern-row',
    'aip-struct-pattern',
    'aip-struct-break-row',
    'aip-struct-break',
  ];

  requiredIds.forEach(id => {
    assert(hasId(id), `missing DOM id: ${id}`);
  });

  const requiredAiMappings = [
    'profileBadge',
    'aip-struct-pattern-row',
    'aip-struct-break-row',
    'aip-life-risk',
    'aip-life-basis',
    'aip-life-ev',
  ];

  requiredAiMappings.forEach(text => {
    assert(aiPiming.includes(text), `missing ai-piming mapping: ${text}`);
  });

  assert(aiPiming.includes('_aipRenderResult(moduleKey, data)'), 'missing _aipRenderResult');
  assert(hasText('_aipFillStructLocal'), 'missing _aipFillStructLocal');
  assert(chartHtml.includes('_aipFillStructLocal(_chart)'), 'renderAIPiming must call _aipFillStructLocal(_chart)');

  console.log(JSON.stringify({
    ok: true,
    checkedIds: requiredIds.length,
    checkedMappings: requiredAiMappings.length,
  }, null, 2));
}

main();
