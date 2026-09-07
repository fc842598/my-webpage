import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const start = source.indexOf('function getYangzhaiResultCardHeight(');
const context = vm.createContext({YANGZHAI_RESULT_CARD_HEIGHT: 200});
vm.runInContext(source.slice(start, source.indexOf('\n}', start) + 2), context);
for (const length of [0, 16, 17, 100, 800]) {
  const height = context.getYangzhaiResultCardHeight({desc: '字'.repeat(length)});
  assert.ok(height >= 112 + Math.ceil(length / 16) * 32.4 + 24);
}
assert.match(source, /item.desc, 42, y \+ 112, 300, 18,/);
assert.match(source, /aria-label="\$\{escapeHtml\(optionText\)\}" aria-pressed=/);
console.log('PASS enlarged house reading fits card and member controls have state');
