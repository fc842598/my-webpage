import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/wentian-app.js', 'utf8');
function load(name, context) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, name);
  const end = source.indexOf('\nfunction ', start + 1);
  vm.runInContext(source.slice(start, end), context);
}
const ctx = vm.createContext({
  getWentianArchiveList: () => Array.from({ length: 7 }, (_, id) => ({ id })),
  wentianAuthSession: { user: { email: 'phone_00000000000@yuetianai.local' } },
  isWentianEnglishUi: () => false,
});
for (const name of ['getWentianChartUsageForDisplay', 'getWentianLinkedEmail', 'getWentianAccountBindingNote']) load(name, ctx);
assert.equal(ctx.getWentianChartUsageForDisplay({ chartUsage: { used: 0 } }, false), 7);
assert.equal(ctx.getWentianChartUsageForDisplay({ chartUsage: { used: 99 } }, true), 7);
assert.equal(ctx.getWentianLinkedEmail(), '');
assert.match(ctx.getWentianAccountBindingNote(), /尚未绑定/);
assert.match(ctx.getWentianAccountBindingNote(true), /No email address/);
ctx.wentianAuthSession.user.email = 'qa@example.invalid';
assert.equal(ctx.getWentianLinkedEmail(), 'qa@example.invalid');
assert.match(ctx.getWentianAccountBindingNote(), /已绑定邮箱/);
const day = { value: '31', innerHTML: '' };
load('updateWentianChartDayOptions', ctx);
ctx.updateWentianChartDayOptions(day, 1900, 2);
assert.equal(day.value, '28');
day.value = '1';
ctx.updateWentianChartDayOptions(day, 1900, 1);
assert.equal(day.value, '1');
assert(source.includes('isEn ? "Recent Chart" : "最近命盘"'));
console.log('QA_ACCOUNT_DISPLAY_OK: archive count, real email binding, recent-chart label, date clamp');

ctx.getWentianLanguageCode = () => 'zh-Hant';
load('getWentianAiLanguageParams', ctx);
assert.equal(ctx.getWentianAiLanguageParams('我住纽约。Please answer in English.').responseLanguage, 'en');
assert.equal(ctx.getWentianAiLanguageParams('What should I focus on at work?').responseLanguage, 'en');
assert.equal(ctx.getWentianAiLanguageParams('请用英文回答').responseLanguage, 'en');
assert.equal(ctx.getWentianAiLanguageParams('Please answer in traditional Chinese.').responseLanguage, 'zh-Hant');
assert.equal(ctx.getWentianAiLanguageParams('请用中文回答').responseLanguage, 'zh-Hans');
assert.equal(ctx.getWentianAiLanguageParams('我想看事业').responseLanguage, 'zh-Hant');
const box = { scrollTop: 140, set innerHTML(value) { this.scrollTop = 0; }, dataset: {} };
ctx.document = { getElementById: () => box };
ctx.wentianXuChat = { userPinned: true, autoScroll: false, messages: [] };
ctx.isWentianChatNearBottom = () => true;
ctx.bindWentianChatScrollBox = () => {};
ctx.updateWentianChatScrollButton = () => {};
ctx.scrollWentianChatToBottom = () => assert.fail('must not pull a pinned reader to the bottom');
load('renderWentianMessages', ctx);
ctx.renderWentianMessages();
assert.equal(box.scrollTop, 140);
const submitSource = source.slice(source.indexOf('async function submitWentianChartForm('), source.indexOf('function initWentianChartForm('));
const button = { disabled: false, setAttribute() {}, removeAttribute() {} };
let attempts = 0;
ctx.wentianChartSubmitting = false;
ctx.document = { querySelectorAll: () => [button] };
ctx.requestAnimationFrame = fn => fn();
ctx.setWentianChartStatus = () => {};
ctx.getWentianChartFormData = () => { attempts++; throw new Error('synthetic invalid date'); };
vm.runInContext(submitSource, ctx);
await Promise.all([ctx.submitWentianChartForm(), ctx.submitWentianChartForm()]);
assert.equal(attempts, 1, 'double click must not calculate twice');
assert.equal(button.disabled, false, 'failure must restore the submit control');
console.log('QA_CHAT_INTERACTION_OK: language priority, pinned scroll position, duplicate-submit guard');

ctx.document = { querySelector: () => null };
ctx.wentianMemberState = { loaded: false, quota: { dailyRemaining: 101 } };
ctx.wentianQuotaRevision = 0;
ctx.normalizeWentianQuota = quota => quota;
load('setWentianQuota', ctx);
ctx.setWentianQuota({ remaining: 91, quotaMode: 'daily' });
assert.equal(ctx.wentianMemberState.quota.dailyRemaining, undefined, 'do not retain an old alias');
let resolveStatus;
ctx.wentianMemberStatusPromise = null;
ctx.getWentianChartPayload = () => ({ chartRecordId: 'synthetic' });
ctx.wentianFetchJson = () => new Promise(resolve => { resolveStatus = resolve; });
ctx.getWentianPaymentProviderMeta = () => ({ enabled: true });
ctx.wentianPaymentState = { provider: 'paypal' };
ctx.state = { route: 'test' };
load('hydrateWentianMemberStatus', ctx);
const pending = ctx.hydrateWentianMemberStatus();
ctx.setWentianQuota({ remaining: 90, quotaMode: 'daily' });
resolveStatus({ quota: { remaining: 101, quotaMode: 'daily' } });
await pending;
assert.equal(ctx.wentianMemberState.quota.remaining, 90, 'late status must not overwrite a send response');
console.log('QA_QUOTA_ORDER_OK: no stale alias or late status overwrite');
