import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../js/wentian-app.js',import.meta.url),'utf8');
new vm.Script(source);
const names=['AppHeader','CastStage','CoinSummary','FlowSteps','ManualCoinInput','ModeCard','QuestionStage'].map(n=>'renderLiuyao'+n);
const blocks=names.map(name=>{
  const found=[...source.matchAll(new RegExp('^function '+name+'\\b[\\s\\S]*?^}', 'gm'))];
  assert.equal(found.length,1,`${name} must have one authoritative implementation`);
  return found[0][0];
});
for(const lang of ['en','zh-Hans']) for(const count of [0,3,6]) {
  const state={mode:'manual',question:'A <test> question',createdAt:1,casts:Array.from({length:count},()=>({value:7,coins:[3,2,2],power:50}))};
  const ctx=vm.createContext({
    getWentianLanguageCode:()=>lang,translateWentianText:t=>t,
    getLiuyaoState:()=>state,getLiuyaoQuota:()=>({used:0,limit:3}),
    getLiuyaoProgress:()=>count,getLiuyaoValidCasts:()=>state.casts,
    normalizeLiuyaoCast:c=>c||null,getLiuyaoManualCoins:()=>[],
    makeLiuyaoManualCastFromCoins:()=>null,getLiuyaoCoinFaceLabel:c=>c===3?'Heads':'Tails',
    getLiuyaoLineType:()=>({name:'Young Yang',mark:''}),liuyaoTossAnimation:null,
    LIUYAO_LINE_LABELS:['1','2','3','4','5','6'],LIUYAO_QUESTION_MAX_LENGTH:500,
    escapeHtml:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),
    wentianBackPill:()=>'<button>Back</button>',getLiuyaoQuestionInputValue:s=>s.question,
    formatLiuyaoQuestionCount:q=>q.length,renderLiuyaoQuestionStartButton:()=>'',
    renderLiuyaoQuotaBadge:()=>'',renderLiuyaoQuestionGateStatus:()=>'',renderLiuyaoQuestionSuggestions:()=>'',
    getLiuyaoCastLines:()=>[],getLiuyaoResult:()=>null,normalizeLiuyaoQuestion:q=>q,
    formatWentianDateTime:()=>'',renderLiuyaoHexStack:()=>'',formatLiuyaoMovingLineText:()=>'',
  });
  vm.runInContext(blocks.join('\n'),ctx);
  assert.match(ctx.renderLiuyaoCoinSummary(state,{complete:count===6}),new RegExp(count===6?'liuyao-show-result':'liuyao-open-caster'));
  assert.match(ctx.renderLiuyaoManualCoinInput(state),new RegExp(count===6?'liuyao-show-result':'liuyao-manual-confirm-line'));
  assert.match(ctx.renderLiuyaoQuestionStage(state),/A &lt;test&gt; question/);
  assert.match(ctx.renderLiuyaoAppHeader('test','Liuyao',state),/0\/3/);
  assert.match(ctx.renderLiuyaoModeCard(state,true),/disabled/);
  assert.match(ctx.renderLiuyaoCastStage(state,{complete:count===6,questionReady:true}),/liuyao-stage-cast/);
}
console.log('PASS single authoritative Liuyao renderers across English/Chinese and 0/3/6-line states');
const suggestions=source.match(/^function getLiuyaoQuestionSuggestions\b[\s\S]*?^}/m)[0];
const suggestionContext=vm.createContext({
  normalizeLiuyaoQuestion:q=>q,normalizeLiuyaoQuestionGate:g=>g,
  liuyaoQuestionGateLoading:false,getWentianLanguageCode:()=> 'en',
});
vm.runInContext(suggestions,suggestionContext);
for(const question of ['', '这个项目本月能不能继续推进并见到效果？', 'Can this project move forward?']) {
  const items=suggestionContext.getLiuyaoQuestionSuggestions({question});
  assert.equal(items.length,4);
  assert.ok(items.every(item=>!/[\u3400-\u9fff]/u.test(item)));
}
assert.equal(suggestionContext.getLiuyaoQuestionSuggestions({question:'Approved',questionGate:{allowed:true}}).length,0);
console.log('PASS English question suggestions contain real English values');
