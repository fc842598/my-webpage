import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../js/wentian-app.js',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const member={isMember:false,chartUsed:0,chartLimit:1,daily:'2/3',dailyLimit:'3 uses',title:'Guest',subtitle:'3 questions total'};
const context=vm.createContext({getWentianMemberSnapshot:()=>member,isWentianEnglishUi:()=>true,wentianMemberState:{loaded:true,campaign:{active:true,monthLabel:'9月'}},figBox:()=>'',wentianBackPill:()=>'',figButton:()=>'',figText:(_id,text)=>text,escapeHtml:String,formatWentianQuotaTextForUi:String});
const start=source.indexOf('function sourceMembershipScreen()');
vm.runInContext(source.slice(start,source.indexOf('\n}',start)+2),context);
let html=context.sourceMembershipScreen();
assert.match(html,/Free access/);
assert.match(html,/Register and sign in to activate/);
assert.match(html,/Unlimited profiles · 100\/day/);
assert.doesNotMatch(html,/80\/day|0\/1Life/);
context.wentianMemberState.loaded=false;
assert.match(context.sourceMembershipScreen(),/Checking access/);
const finalize=source.slice(source.indexOf('function finalizeWentianLanguageText('),source.indexOf('\nfunction ',source.indexOf('function finalizeWentianLanguageText(')+1));
assert.doesNotMatch(finalize,/80\/day|\[data-node-id="wt33-card-sub"\]/);
assert.match(source,/"可用追问": "Remaining"/);
const nodes=new Map();
context.figText=(id,text,x,y,width,size)=>{nodes.set(id,{text,x,y,width,size});return text;};
context.wentianMemberState.loaded=true;
context.sourceMembershipScreen();
for(const name of ['three','unlimited']) {
  const title=nodes.get(`wt33-${name}-title`),price=nodes.get(`wt33-${name}-price`),desc=nodes.get(`wt33-${name}-desc`);
  assert.ok(price.y >= title.y + title.size + 8);
  assert.ok(desc.y >= price.y + price.size + 8);
  assert.equal(price.x,title.x);
}
console.log('PASS English membership retains live campaign terms and readable quota labels');
