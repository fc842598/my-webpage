import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../js/wentian-app.js',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const start=source.indexOf('function getWentianHistoryDisplayText(');
const context=vm.createContext({});
vm.runInContext(source.slice(start,source.indexOf('\n}',start)+2),context);
const display=context.getWentianHistoryDisplayText;
for(const prefix of ['关系合盘','六壬法','易经推命','六爻占卜']) {
  const content=`【${prefix}追问】\n课式说明\n我的追问：请核对时间\n我的追问：保留这行`;
  assert.equal(display({sender:'user',content}),'请核对时间\n我的追问：保留这行');
  assert.equal(display({sender:'assistant',content}),content);
}
assert.equal(display({sender:'user',content:'普通提问\n我的追问：不删'}),'普通提问\n我的追问：不删');
assert.equal(display({sender:'user',content:'【六壬法追问】\n缺少分隔'}),'【六壬法追问】\n缺少分隔');
console.log('PASS history shows original user question without altering stored content');
