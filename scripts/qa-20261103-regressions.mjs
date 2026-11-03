import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const desktop = fs.readFileSync('js/mingbook-onepage.js', 'utf8');
const input = { value: '', focus() {} };
const applied = [];
const requests = [];
const ctx = vm.createContext({
  console, document: {}, mbpAiBusy: false, mbpAiDraft: {}, mbpAiHistory: [],
  $: () => input, pad2: n => String(n).padStart(2, '0'),
  findCity: text => /深圳/.test(text) ? { name: '深圳' } : null,
  formatCityLabel: city => city.name,
  addMbpAiBubble() {}, addMbpAiThinking: () => null,
  setMbpAiBusy() {}, setMbpAiTip() {},
  callMbpAiChat: async history => { requests.push(history); return null; },
  applyAiBirthData: data => applied.push(data),
});
vm.runInContext(desktop.slice(desktop.indexOf('    function normalizeAiText('), desktop.indexOf('    async function callMbpAiChat(')), ctx);
vm.runInContext(desktop.slice(desktop.indexOf('    async function applyAiText('), desktop.indexOf("    $('#mbpAiSend')?.addEventListener")), ctx);
async function send(text) { input.value = text; await ctx.applyAiText(); return applied.at(-1); }
assert.equal((await send('公历2000年1月1日中午12点，男性，深圳')).complete, true);
const missing = await send('2000年出生，不记得具体生日和时辰');
assert.equal(missing.complete, false);
assert.equal(missing.year, 2000);
for (const key of ['month', 'day', 'hour', 'minute']) assert.equal(missing[key], null);
assert.equal(missing.gender, undefined);
assert.equal(missing.city, undefined);
assert.equal(requests[1].length, 1, 'previous person must not reach the recognition service');
assert.equal((await send('2月3日晚上8点，男，深圳')).complete, true, 'explicit partial follow-up remains supported');

const mobile = fs.readFileSync('js/wentian-app.js', 'utf8');
const guaContext = vm.createContext({ window: {}, LIUYAO_ZHOUYI_ORIGINALS: {} });
vm.runInContext(fs.readFileSync('pages/zhouyi-originals.js', 'utf8'), guaContext);
vm.runInContext(mobile.slice(mobile.indexOf('function getLiuyaoZhouyiOriginal('), mobile.indexOf('function getYijingHexagramImageSrc(')), guaContext);
for (const [no, phrase] of [[18, '先甲三日'], [39, '利西南']]) {
  const quote = guaContext.getLiuyaoZhouyiOriginal({ no });
  assert.equal(quote.label, '周易原文');
  assert(quote.text.includes(phrase));
  assert(!/中医|流年/.test(quote.text));
}
assert.equal(guaContext.getLiuyaoZhouyiOriginal({ no: 64 }).label, '卦辞待核');
console.log('QA_20261103_REGRESSIONS_OK: new-person isolation, missing fields, partial follow-up, Zhouyi sources');
