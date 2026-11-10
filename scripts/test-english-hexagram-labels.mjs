import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/wentian-app.js', 'utf8');
const context = vm.createContext({getWentianLanguageOption:code=>({code})});
vm.runInContext(source.slice(source.indexOf('const WENTIAN_I18N ='), source.indexOf('function rememberWentianTextSource(')), context);
for (const name of ['YANGZHAI_HEX_INDEX', 'YANGZHAI_EN_ROLE_GUA']) {
  const start = source.indexOf(`const ${name} =`);
  const end = source.indexOf('\n};', start) + 3;
  assert(start >= 0 && end > start);
  vm.runInContext(source.slice(start, end), context);
}
const start = source.indexOf('function getYangzhaiEnglishHexName(');
const end = source.indexOf('\nfunction ', start + 1);
vm.runInContext(source.slice(start, end), context);
const tableSource = fs.readFileSync('pages/liuyao-data.js','utf8');
const tableContext = vm.createContext({});
vm.runInContext(tableSource.slice(0, tableSource.indexOf('const YAO_TYPES =')) + '\nthis.table = HEX_TABLE;', tableContext);
const natures = ['Earth','Mountain','Water','Wind','Thunder','Fire','Lake','Heaven'];
const numbers = new Set();
for (let upper=0; upper<8; upper++) {
  for (let lower=0; lower<8; lower++) {
    const [no,,name] = tableContext.table[upper][lower];
    numbers.add(no);
    const expected = `${natures[upper]} over ${natures[lower]}`;
    assert.equal(context.getYangzhaiEnglishHexName({no,name}), expected, `${no} ${name}`);
    assert.equal(context.getYangzhaiEnglishHexName({name}), expected, name);
    assert.equal(context.translateWentianText(name, 'en'), expected, `shared UI translation ${name}`);
    assert.equal(context.getYangzhaiEnglishHexName({no}), expected, `number-only ${no}`);
  }
}
assert.equal(numbers.size,64);
assert.equal(context.getYangzhaiEnglishHexName({name:'天雷無妄'}),'Heaven over Thunder');
assert.equal(context.getYangzhaiEnglishHexName({name:'乾為天'}),'Heaven over Heaven');
assert.equal(context.getYangzhaiEnglishHexName({name:'未知資料'}),'Hexagram');
assert.equal(context.getYangzhaiEnglishHexName({no:99}),'Hexagram');
console.log('ENGLISH_HEXAGRAM_LABELS_OK: all 64 upper/lower pairs, names, numbers, traditional aliases, unknown fallback');
