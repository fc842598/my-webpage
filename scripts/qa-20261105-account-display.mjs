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
