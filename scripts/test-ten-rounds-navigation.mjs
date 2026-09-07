import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}
const context = vm.createContext({ escapeHtml: value => String(value), convertedByNo: new Map([[1, { title: '授权书' }], [3, { title: '档案列表' }]]), figBox: () => '', figText: () => '', wentianBottomNavIcon: () => '' });
for (const name of ['inferFigButtonAriaLabel', 'figButton', 'sourceAppBottomNav', 'getWentianBottomNavActive']) vm.runInContext(extract(name), context);
assert.match(context.inferFigButtonAriaLabel('data-route="screen-1"'), /首页/);
assert.match(context.inferFigButtonAriaLabel('data-route="screen-3"'), /阅天AI/);
assert.equal(context.getWentianBottomNavActive('screen-3'), '阅天AI');
assert.equal(context.getWentianBottomNavActive('screen-25'), '档案');
const nav = context.sourceAppBottomNav('阅天AI');
assert.equal((nav.match(/aria-current="page"/g) || []).length, 1);
assert.match(nav, /aria-label="阅天AI" aria-current="page"/);
assert.doesNotMatch(nav, /授权书|档案列表/);
console.log('PASS mobile navigation names and active state');
