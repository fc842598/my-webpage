import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../js/wentian-app.js',import.meta.url),'utf8').replace(/\r\n/g,'\n');
function extract(name) {
  const start=source.search(new RegExp(`^(?:async )?function ${name}\\(`,'m'));
  assert.ok(start>=0);
  return source.slice(start,source.indexOf('\n}',start)+2);
}
let saved=null, context=null, requests=0;
const ctx=vm.createContext({getWentianSavedChart:()=>saved,getWentianXuChatContext:()=>context,getWentianCompactText:zh=>zh,wentianPostJson:()=>{requests++;}});
for(const name of ['canStartWentianXuChat','ensureWentianXuSession','sourceWentianChatEmptyScreen']) vm.runInContext(extract(name),ctx);
assert.equal(ctx.canStartWentianXuChat(),false);
await assert.rejects(ctx.ensureWentianXuSession(),/请先选择命盘/);
assert.equal(requests,0);
assert.match(ctx.sourceWentianChatEmptyScreen(),/新建命盘/);
assert.ok(!ctx.sourceWentianChatEmptyScreen().includes('已接入命盘'));
saved={chartData:{}};
assert.equal(ctx.canStartWentianXuChat(),true);
saved=null; context={type:'liuyao',recordId:'test-context'};
assert.equal(ctx.canStartWentianXuChat(),true,'non-chart feature chats must stay available');
console.log('PASS: empty chart blocks session request; saved chart and divination contexts stay available');
