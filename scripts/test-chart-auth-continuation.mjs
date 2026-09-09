import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8');
function section(start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
}
function authContext(returnState, { fail = false, pending = false } = {}) {
  const calls = [];
  const context = vm.createContext({
    calls, returnState, wentianPendingPaymentAfterLogin: pending,
    wentianAuthState: { mode: 'login', account: 'test@example.invalid', password: 'fixture-only' },
    syncWentianAuthDraftFromDom() {}, syncWentianAuthUi() {},
    inputToWentianAuthEmail: value => value,
    wentianFetchJson: async () => { if (fail) throw new Error('fixture login failed'); return { session: { user: { id: 'fixture' } } }; },
    setWentianAuthSession() {}, clearWentianAuthDraft() {},
    bindWentianPendingInvite: async () => {}, hydrateWentianInvite: async () => {},
    getWentianAuthReturnState: () => returnState,
    clearWentianAuthReturnState: () => calls.push('cleared'),
    replaceCurrentWentianRoute: route => calls.push(route),
    navigate: route => calls.push(route),
    setWentianChartStatus: value => calls.push(value),
    isWentianEnglishUi: () => false,
    completeWentianExternalAuthReturn: () => false,
    startWentianMemberPayment: async () => calls.push('payment'),
    normalizeWentianAuthErrorMessage: value => value,
    document: { getElementById: () => null }, window: {},
  });
  vm.runInContext(section('function getWentianChartAuthReturnRoute(', 'function replaceWentianUrlRoute('), context);
  vm.runInContext(section('async function submitWentianAuth(', 'async function startWentianGoogleLogin('), context);
  return context;
}

for (const route of ['screen-26', 'screen-27']) {
  test(`password login resumes ${route} from persisted state after a reload`, async () => {
    const ctx = authContext({ source: 'chart_reading', returnRoute: route });
    await ctx.submitWentianAuth();
    assert.ok(ctx.calls.includes(route));
    assert.ok(!ctx.calls.includes('payment'));
    assert.ok(!ctx.calls.includes('screen-31'));
  });
}
test('old chart-slot login state resumes the form instead of opening checkout', async () => {
  const ctx = authContext({ source: 'chart_person_limit', after: 'member-payment' }, { pending: true });
  await ctx.submitWentianAuth();
  assert.ok(ctx.calls.includes('screen-26'));
  assert.ok(!ctx.calls.includes('payment'));
  assert.equal(ctx.wentianPendingPaymentAfterLogin, false);
});
test('ordinary login still opens the account center', async () => {
  const ctx = authContext(null);
  await ctx.submitWentianAuth();
  assert.deepEqual(ctx.calls, ['screen-31']);
});
test('registration also resumes the original chart', async () => {
  const ctx = authContext({ source: 'chart_reading', returnRoute: 'screen-27' });
  ctx.wentianAuthState.account = '19900000000';
  await ctx.submitWentianAuth('register');
  assert.ok(ctx.calls.includes('screen-27'));
  assert.ok(!ctx.calls.includes('screen-31'));
});
test('failed login retains continuation and does not navigate', async () => {
  const ctx = authContext({ source: 'chart_reading', returnRoute: 'screen-27' }, { fail: true });
  await ctx.submitWentianAuth();
  assert.deepEqual(ctx.calls, []);
  assert.match(ctx.wentianAuthState.error, /failed/);
});
test('continuation only accepts chart routes', () => {
  const ctx = authContext(null);
  assert.equal(ctx.getWentianChartAuthReturnRoute({ source: 'chart_reading', returnRoute: 'https://example.com' }), '');
});
test('basic chart submission with an existing archive has no auth or slot dependency', async () => {
  const calls = [];
  const ctx = vm.createContext({
    setWentianChartStatus() {}, getWentianChartFormData: () => ({ gender: 'male', name: 'Fixture' }),
    getWentianIztroLib: () => ({}), createWentianChartWithLeapRule: () => ({}),
    document: { getElementById: () => ({ value: '1991-05-12T15:21' }) }, window: {},
    saveWentianChartFormDraft() {}, getWentianArchiveEditId: () => '',
    getWentianArchiveList: () => [{ chartRecordId: 'already-used-free-slot' }],
    findWentianArchiveDuplicate: () => null, resetWentianChartRecordId: () => 'new-chart',
    buildWentianChartPayload: () => ({}), resetWentianChartAiState() {},
    saveWentianChart: chart => calls.push(chart.chartData.chartRecordId),
    clearWentianChartFormDraft() {}, getWentianArchiveEditReturnRoute: () => '',
    clearWentianArchiveEditContext() {}, resetWentianXuChatRuntime() {},
    navigate: route => calls.push(route),
  });
  vm.runInContext(section('async function submitWentianChartForm()', 'function initWentianChartForm()'), ctx);
  await ctx.submitWentianChartForm();
  assert.deepEqual(calls, ['new-chart', 'screen-27']);
});
