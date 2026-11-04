import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('pages/liuyao-app.js', 'utf8');
const helpers = source.slice(source.indexOf('const LIUYAO_DAILY_LIMIT ='), source.indexOf('const LIUYAO_TYPE_TEXT ='));
let calls = [];
let fail = false;
let invalid = false;
const storage = new Map();
const context = vm.createContext({
  window: { SITE_CONFIG: { liuyaoQuestionGateMode: 'remote' }, location: { search: '' }, crypto: { randomUUID: () => 'e0ae1188-66c0-4e20-a550-85e8b070195a' } },
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  AbortController, DOMException, setTimeout, clearTimeout, URLSearchParams,
  fetch: async (_url, options) => {
    const payload = JSON.parse(options.body);
    calls.push(payload);
    if (payload.action === 'quota') return Response.json({ ok: true, quota: { limit: 3, used: 1, remaining: 2, date: '2026-11-03' } });
    if (fail) throw new Error('synthetic network failure');
    if (invalid) return Response.json({ reply: 'not a decision' });
    return Response.json({ allowed: true, quota: { limit: 3, used: 1, remaining: 2, date: '2026-11-03' } });
  },
});
vm.runInContext(helpers, context);
const api = vm.runInContext('({localQuestionGate,reviewQuestion})', context);
const question = '这次店铺改版能否顺利上线？还有哪些同一项目的准备要注意？';
assert.equal(api.localQuestionGate(question).allowed, true, 'punctuation must not classify related questions as independent events');
assert.equal(api.localQuestionGate('123456').allowed, false);
const quota = { limit: 3, used: 0, remaining: 3, date: '2026-11-03' };
assert.equal((await api.reviewQuestion(question, quota)).allowed, true);
assert.equal(calls.length, 1, 'valid event must reach remote review once');
fail = true;
const failed = await api.reviewQuestion(question, quota);
assert.equal(failed.allowed, false, 'network failure must not grant an unmetered use');
assert.equal(failed.quota.used, 1, 'reconcile usage after a lost response');
assert.equal(calls.at(-1).action, 'quota');
fail = false;
invalid = true;
assert.equal((await api.reviewQuestion(question, quota)).allowed, false, 'malformed model output must not fall back to local approval');
assert(source.includes('}, 35000)'), 'review must not abort at six seconds before the server can finish');
const quotaUi = vm.runInContext('({normalizeQuota,formatQuotaTagText,formatQuotaDetailText})', context);
assert.equal(quotaUi.formatQuotaTagText({ ...quota, syncPending: true }), '次数同步中…');
assert(quotaUi.formatQuotaDetailText({ limit: 3, used: 3, remaining: 0 }).includes('北京时间次日0点重置'));
assert(quotaUi.normalizeQuota({ testingUnlimited: true, syncPending: true }).syncPending);
assert(source.includes('refreshRemoteQuota(null)'), 'initial authoritative server response must not merge stale account/day usage');
vm.runInContext(fs.readFileSync('pages/liuyao-data.js', 'utf8'), context);
vm.runInContext(source.slice(source.indexOf('const LIUYAO_TYPE_TEXT ='), source.indexOf('function flattenReadingResponse(')), context);
vm.runInContext(source.slice(source.indexOf('function makeLiuyaoFollowupContext('), source.indexOf('function ResultStep(')), context);
const followup = context.makeLiuyaoFollowupContext({
  recordId: 'e0ae1188-66c0-4e20-a550-85e8b070195a', question: '合成问题', vals: [8, 9, 6, 7, 8, 7], results: [], reading: '合成解读',
});
assert.equal(followup.type, 'liuyao');
assert(followup.primaryText.includes('未济') && followup.changedText.includes('旅'));
assert.equal(followup.movingText, '二爻、三爻');
assert.equal(followup.advice, '合成解读');
assert.equal(calls.at(-1).action, 'quota', 'building follow-up context must not consume or re-cast anything');
console.log('LIUYAO_REVIEW_OK: related event delegated, invalid input blocked, network/malformed review fails closed, quota reconciled');
