import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/wentian-app.js', 'utf8');
const context = vm.createContext({});
for (const name of ['escapeHtml', 'renderWentianArchiveDisplayName', 'renderWentianArchiveNameWithAgeBadge', 'renderWentianProfileActionRow']) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing ${name}`);
  const end = source.indexOf('\nfunction ', start + 1);
  vm.runInContext(source.slice(start, end), context);
}
const result = context.renderWentianArchiveNameWithAgeBadge({
  name: '合成姓名 · 27岁', baseName: '合成姓名', ageText: '27岁', ageBadge: '虚岁',
});
assert.match(result, /data-wentian-i18n-skip="true">合成姓名<\/span>/);
assert.match(result, /<\/span> · <span>27岁<\/span>/, 'age stays outside protected name');
assert.match(result, /wentian-archive-age-badge">虚岁<\/span>/, 'nominal-age badge remains translatable');
assert(!context.renderWentianArchiveDisplayName({baseName:'<img src=x onerror=alert(1)>'}).includes('<img'));
assert.match(context.renderWentianArchiveDisplayName({name:'Amy & Alex'}), /Amy &amp; Alex/);
assert.match(source, /class="fc-center-name" data-wentian-i18n-skip="true"/);
assert.match(source, /data-node-id="source-4-profile-text" data-wentian-i18n-skip="true"/);
const actions = context.renderWentianProfileActionRow({id:'synthetic'}, {name:'合成姓名 · 27岁',baseName:'合成姓名',ageText:'27岁'}, false, false, true);
assert.match(actions, /aria-label="Edit 合成姓名 · Age 27"/);
assert.match(actions, /data-wentian-i18n-skip-attributes="true"/);
console.log('NAME_LANGUAGE_PROTECTION_OK: preserve supplied names, translate age separately, escape markup');
