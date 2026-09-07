import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}
const context = vm.createContext({});
for (const name of ['phoneToWentianEmail']) vm.runInContext(extract(name), context);
const convert = context.phoneToWentianEmail;
for (const [input, digits] of [
  ['+1 (202) 555-0123', '12025550123'],
  ['+44 20 7946 0000', '442079460000'],
  ['13800138000', '13800138000'],
  ['0061 412 345 678', '0061412345678'],
]) assert.equal(convert(input), `phone_${digits}@yuetianai.local`, input);
for (const input of ['abc+1 202-555-0123', '12+3456789', '++12345678', '0000000000', '12345', '1'.repeat(21), '<12345678>', '']) {
  assert.equal(convert(input), '', input);
}
console.log('PASS international phone format validation without OTP');

