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
const currentDecade = { key: '25-34', currentKey: '25-34', rangeLabel: '25-34岁', palaceName: '福德宫' };
const futureDecade = { key: '35-44', currentKey: '25-34', rangeLabel: '35-44岁', palaceName: '田宅宫' };
let selectedDecade = futureDecade;
let completeRequest;
const pending = new Promise(resolve => { completeRequest = resolve; });
const race = vm.createContext({
  syncWentianChartAiStateFromStorage() {}, getWentianChartPayload: () => ({ chartRecordId: 'synthetic' }),
  wentianChartAiRunSerial: 0,
  wentianChartAiState: { status: 'idle', results: {}, luckAiResults: {} },
  getWentianChartAiStorageLanguageKey: () => 'zh',
  getWentianSelectedDecade: () => ({ ...selectedDecade, items: [currentDecade, futureDecade] }),
  getWentianSelectedXiaoLianYear: () => ({ key: '29' }),
  refreshWentianChartAiScreen() {}, getWentianAiTask: module => ({ module }),
  isWentianChartAiRunStale: () => false, callWentianChartAiModule: () => pending,
  saveWentianChartAiState() {}, hasWentianChartAiResults: () => true,
  getWentianReportError: error => { throw error; },
});
vm.runInContext(extract('async function decodeWentianChartAiModules(', 'async function decodeWentianChartAi()'), race);
const request = race.decodeWentianChartAiModules(['current_luck']);
selectedDecade = currentDecade;
completeRequest({ title: '35-44岁田宅宫' });
await request;
assert.equal(race.wentianChartAiState.luckAiResults['35-44']?.title, '35-44岁田宅宫', 'switching selection in flight must not relabel the completed reading');
assert.equal(race.wentianChartAiState.results.current_luck, undefined, 'a future-decade result must not replace the current decade');
Object.assign(race, {
  getWentianLuckAiResultForSelected: () => null, getWentianLuckReadingGroups: () => [],
  escapeHtml: text => text, renderWentianReadingParagraphs: text => text,
  renderWentianMobileActionButton: () => '<button>生成</button>',
});
selectedDecade = futureDecade;
vm.runInContext(extract('function renderWentianLuckReading(', 'function formatWentianGuaLine('), race);
assert(race.renderWentianLuckReading(null, '', '', '').includes('<h3>选中十年<br>35-44岁'));
Object.assign(race, {
  applyWentianLiunianTimingFields: chart => chart,
  getWentianAiLanguageParams: () => ({ responseLanguage: 'zh-Hans' }),
  getWentianAiCurrentDecade: () => currentDecade,
  getWentianAiCurrentYear: () => ({ age: 29 }),
  getWentianBackendAiModule: key => key,
});
vm.runInContext(extract('function getWentianChartAiExtraParams(', 'function getWentianBackendAiModule('), race);
vm.runInContext(extract('function buildWentianChartAiPayload(', 'async function callWentianChartAiModule('), race);
const payload = race.buildWentianChartAiPayload('current_luck', { activeAge: 29, currentDecade });
assert.equal(payload.chartData.currentDecade.rangeLabel, '35-44岁');
assert.equal(payload.extraParams.selectedDayun.palaceName, '田宅宫');
assert.equal(payload.chartData.activeAge, 29, 'reading a future decade must not change the person’s actual age');
let selectedYear = { key: '30' };
let completeYear;
race.callWentianChartAiModule = () => new Promise(resolve => { completeYear = resolve; });
race.getWentianSelectedXiaoLianYear = () => selectedYear;
race.wentianChartAiState.xiaoLianAgeKey = '29';
race.wentianChartAiState.results.xiaoxian_liunian = { title: '29岁原结果' };
const yearRequest = race.decodeWentianChartAiModules(['xiaoxian_liunian']);
assert.equal(race.wentianChartAiState.xiaoLianAgeKey, '29', 'old content must retain its original age while the new request is pending');
selectedYear = { key: '31' };
completeYear({ title: '30岁新结果' });
await yearRequest;
assert.equal(race.wentianChartAiState.xiaoLianAgeKey, '30', 'the response must retain the age requested before the selection changed');
let sensorTimeout;
const sensorEvents = [];
const sensor = vm.createContext({
  window: { DeviceOrientationEvent: {}, addEventListener() {} },
  stopYangzhaiCompass: () => sensorEvents.push('stopped'),
  handleYangzhaiCompassOrientation() {}, setYangzhaiCompassActiveUi() {},
  setYangzhaiCompassStatus: text => sensorEvents.push(text),
  setYangzhaiCompassPrompt: text => sensorEvents.push(text),
  getWentianLanguageCode: () => 'zh',
  setTimeout: (callback, ms) => { assert.equal(ms, 8000); sensorTimeout = callback; return 1; },
});
vm.runInContext(extract('async function startYangzhaiCompass(', 'function toggleYangzhaiCompass('), sensor);
await sensor.startYangzhaiCompass();
assert(sensorEvents.includes('读取中'));
sensorTimeout();
assert(sensorEvents.includes('未收到方向数据'));
assert(sensorEvents.some(text => text.includes('手动选择方位')));
console.log('DEEP_RECORD_UI_OK: honest sections, distinct action steps, reset confirmation, selected-decade response isolation, compass timeout');
