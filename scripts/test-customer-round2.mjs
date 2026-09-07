import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const app = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8');
const yl = readFileSync(new URL('../js/yl.js', import.meta.url), 'utf8');
function extract(source, name) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(line => line.includes(`function ${name}(`));
  assert.ok(start >= 0);
  const indent = lines[start].match(/^\s*/)[0];
  const end = lines.findIndex((line, i) => i > start && line === `${indent}}`);
  return lines.slice(start, end + 1).join('\n');
}
let claims = ['one'];
let archives = [{chartRecordId:'one'}];
const ctx = vm.createContext({readWentianChartPersonClaims:()=>claims, getWentianArchiveList:()=>archives});
vm.runInContext(extract(app, 'getWentianChartUsageForDisplay'), ctx);
vm.runInContext(extract(yl, 'normalizeHealthRegistrationPhone'), ctx);
assert.equal(ctx.getWentianChartUsageForDisplay({},true),1);
assert.equal(ctx.getWentianChartUsageForDisplay({chartUsage:{used:0}},true),1);
assert.equal(ctx.getWentianChartUsageForDisplay({chartUsage:{used:4}},false),4);
claims=[]; archives=[];
assert.equal(ctx.getWentianChartUsageForDisplay({},true),0);
assert.equal(ctx.normalizeHealthRegistrationPhone('+44 20 7946 0000'),'442079460000');
assert.equal(ctx.normalizeHealthRegistrationPhone('+1 (202) 555-0100'),'12025550100');
assert.equal(ctx.normalizeHealthRegistrationPhone('13800138000'),'13800138000');
for(const raw of ['abc123456','123','000000','1+234567','<img>']) assert.equal(ctx.normalizeHealthRegistrationPhone(raw),'');
console.log('PASS: scoped chart usage, server authority, international phone formats, invalid input');
