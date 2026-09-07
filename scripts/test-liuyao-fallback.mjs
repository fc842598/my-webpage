import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
for (const file of ['liuyao-data.js', 'liuyao-data.jsx']) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(readFileSync(new URL(`../pages/${file}`, import.meta.url), 'utf8'), context);
  const api = context.window;
  const vals = [8, 8, 9, 7, 8, 6];
  const text = api.genAIText(api.getHexInfo(vals), api.getChangedHex(vals), api.getDynamic(vals), '本周能否验收通过？');
  assert.match(text, /第62卦/);
  assert.match(text, /三爻、上爻/);
  assert.match(text, /AI 解读暂未完成/);
  assert.doesNotMatch(text, /当前局面已近圆满|水到渠成|不会有太大变化/);
}
console.log('PASS Liuyao fallback records facts without inventing a personalized answer');
