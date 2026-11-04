import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('js/wentian-app.js', 'utf8');
const extract = (from, to) => source.slice(source.indexOf(from), source.indexOf(to));
const ctx = vm.createContext({
  getWentianAiSections: data => data.sections,
  splitWentianReadingParagraphs: text => [text],
  normalizeWentianAiText: text => String(text || '').trim(),
  trimWentianAiText: (text, max) => text.slice(0, max),
});
vm.runInContext(extract('function getWentianXiaoLianReadingGroups(', 'function renderWentianXiaoLianTags('), ctx);
const groups = ctx.getWentianXiaoLianReadingGroups({ sections: [
  { title: '年运主线', content: '今年先整理工作安排。' },
  { title: '今年提醒', content: '按实际时间安排休息。' },
] });
assert(groups.every(group => group.content), 'a completed reading must not fabricate an empty opposite-palace section');
assert.equal(groups.length, 2);
vm.runInContext(extract('function getWentianAdvicePlanItems(', 'function renderWentianAdviceDetail('), ctx);
const plan = ctx.getWentianAdvicePlanItems([{ content: '事业上走专业、管理、压力型路线，适合开拓与重组型任务。' }]);
assert.equal(new Set(plan.map(item => item[1])).size, 3, '7-day, 30-day and review steps must not reuse one sentence');
const reset = vm.createContext({
  yangzhaiState: { placements: { xun: ['母亲'] }, pendingItems: [], expanded: {} },
  YANGZHAI_ELDER_AGE_DEFAULTS: {}, saveYangzhaiState() {}, navigate() {},
  getWentianCompactText: zh => zh,
  yangzhaiResetConfirmOpen: false,
});
vm.runInContext(extract('function resetYangzhai(', 'function autoFillYangzhai('), reset);
reset.resetYangzhai();
assert.equal(reset.yangzhaiState.placements.xun[0], '母亲', 'asking for confirmation preserves current placements');
assert.equal(reset.yangzhaiResetConfirmOpen, true);
reset.resetYangzhai({ confirmed: true });
assert.equal(Object.keys(reset.yangzhaiState.placements).length, 0);
console.log('DEEP_RECORD_UI_OK: no false empty section, distinct action steps, reset confirmation');
