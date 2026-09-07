import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/wentian-app.css', import.meta.url), 'utf8');
const context = vm.createContext({ getWentianLanguageOption: code => ({code}) });
vm.runInContext(source.slice(source.indexOf('const WENTIAN_I18N ='), source.indexOf('function rememberWentianTextSource(')), context);
for (const [input, expected] of [
  ['排盘表单', 'Create Chart'],
  ['办公室布局', 'Office Layout'],
  ['办公室布局说明', 'Office Layout Guide'],
  ['地脉道教程', 'Home Feng Shui Guide'],
  ['生成阳宅解读', 'Analyze Placements'],
  ['按顺序填入', 'Auto Align Family Members'],
  ['重置阳宅方位', 'Reset Placements'],
  ['手机号或邮箱', 'Phone or email'],
  ['海外号码请带国家区号', 'Include country code (e.g. +44)'],
  ['使用 Google 登录', 'Sign in with Google'],
  ['打开六爻占卜新版', 'Open Liuyao Coin Casting'],
  ['东南，长女位，选择安位', 'SE, 1st Daughter, choose placement'],
]) assert.equal(context.translateWentianText(input, 'en'), expected);
assert.equal(context.translateWentianText('返回', 'zh-Hans'), '返回');
const back = css.match(/html\[lang="en"\] \[data-node-id\$="-back-copy"\] \{([^}]+)\}/)[1];
assert.match(back, /display: block/);
assert.match(back, /font-size: 14px/);
const kicker = css.match(/html\[lang="en"\] \[data-node-id="source-1-hero-kicker"\] \{([^}]+)\}/)[1];
assert.match(kicker, /width: 210px/);
assert.match(kicker, /white-space: nowrap/);
console.log('PASS English customer navigation, placement labels, and header layout');
