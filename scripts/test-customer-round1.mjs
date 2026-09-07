import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/wentian-app.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function extract(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'));
  assert.ok(start >= 0, name);
  const rest = source.slice(start);
  const end = rest.indexOf('\n}\n') >= 0 ? rest.indexOf('\n}\n') + 2 : rest.indexOf('\r\n}\r\n') + 3;
  return rest.slice(0, end);
}
const escapeHtml = (s) => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
const runtime = { generation: 0, messages: [{role:'assistant', text:'welcome', opening:true}], sessionPromise:null, sessionId:null, payloadKey:'' };
let payload = {mode:'chart', chartRecordId:'chart-a', chartData:{}};
let resolveRequest;
const context = vm.createContext({
  wentianXuChat:runtime, getWentianXuChatPayload:()=>payload, canStartWentianXuChat:()=>true,
  getWentianArchiveStorageScopeId:()=> 'local-only',
  resetWentianXuChatRuntime:()=> { runtime.generation++; runtime.messages=[]; runtime.sessionId=null; runtime.sessionPromise=null; },
  wentianPostJson:()=>new Promise(resolve=>{resolveRequest=resolve;}),
  setWentianChatStatus(){}, getWentianXuModeText:()=>'', getWentianAiLanguageParams:()=>({}),
  loadWentianTransientState:()=>null, saveWentianTransientState(){}, setWentianQuota(){},
  isWentianEnglishMode:()=>false, renderWentianMessages(){}, getWentianFriendlyError:e=>e.message,
  getWentianCompactText:zh=>zh, escapeHtml, renderWentianSafeInlineMarkdown:escapeHtml,
  addWentianMessage:(role,text)=>runtime.messages.push({role,text}), getWentianXuOpeningText:()=> 'welcome',
  getWentianAiSections:data=>data.sections, getWentianAiCard:data=>data.card,
  getWentianAiEvidenceMap:()=>({}), normalizeWentianAiText:s=>s, hasWentianHanText:()=>false,
  renderWentianMobileActionButton:()=>'', renderWentianOverallEvidenceTags:()=>'',
});
for (const name of ['getWentianXuPayloadKey','ensureWentianXuSession','renderWentianChatHistoryRecords','renderWentianOverallReading']) vm.runInContext(extract(name),context);

const loading = context.ensureWentianXuSession({silent:true});
resolveRequest({sessionId:'session-a',messages:[{sender:'user',content:'真实问题',createdAt:'2026-09-07T06:00:00Z'},{sender:'assistant',content:'真实回答'}]});
await loading;
assert.deepEqual(Array.from(runtime.messages,m=>m.text), ['真实问题','真实回答'], 'welcome must not block restored history');
assert.match(context.renderWentianChatHistoryRecords(), /真实问题/);
assert.match(context.renderWentianChatHistoryRecords(), /真实回答/);
runtime.messages=[{role:'user',text:'<img src=x onerror=alert(1)>'}];
assert.ok(!context.renderWentianChatHistoryRecords().includes('<img'), 'untrusted history must be escaped');
runtime.messages=[];
assert.match(context.renderWentianChatHistoryRecords(), /暂无对话记录/);

runtime.sessionId=null;
const stale = context.ensureWentianXuSession({silent:true});
runtime.generation++;
payload={mode:'chart',chartRecordId:'chart-b',chartData:{}};
resolveRequest({sessionId:'old', messages:[{sender:'assistant',content:'旧命盘回答'}]});
await stale;
assert.equal(runtime.messages.length,0, 'old chart response must not enter new chart');

const result=context.renderWentianOverallReading({sections:[{title:'总断',content:'迁移化禄'}],card:{risk:'现金流建议'}}, '', '', '');
assert.match(result,/重点提醒/);
assert.ok(!result.includes('迁移化忌冲命'));
assert.ok(!result.includes('贪狼'));
const withoutRisk=context.renderWentianOverallReading({sections:[{title:'总断',content:'真实正文'}],card:{}}, '', '', '');
assert.ok(!withoutRisk.includes('wentian-mb-overall-risk'), 'missing risk must not invent a chart fact');
console.log('PASS: history restore, empty state, escaping, stale-chart isolation, factual reading fallback');
