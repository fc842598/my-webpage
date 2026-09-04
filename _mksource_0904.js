const fs=require('fs');
const {CAT}=require('./_engine_topic.js');
const m=require('./_manifest_2026-09-04.json');
const SRC={
 rumen:{kw:'十二宫 / 十四主星 / 排盘 农历 / 庙旺落陷 / 身宫',view:'同行普遍把十二宫当名词表、把庙旺当吉凶加减分；本站差异化：用六组对宫与人生剧场串记，强调亮度是力量调节而非吉凶判决。'},
 sihua:{kw:'生年四化 大限四化 流年四化 / 化禄化权化科化忌 / 禄忌对冲 飞星',view:'同行提出三层四化（生年定底色→大限定方向→流年定细节）与禄忌对冲；本站差异化：每层给可操作的分步读法，并强调化忌是卡点功课而非灾祸。'},
 kanpan:{kw:'空宫借对宫 / 立太极 / 看盘顺序 / 主星与煞星 / 吉星多 / 定盘校时',view:'同行讲空宫借星、立太极、定盘反推时辰；本站差异化：借对宫前先看三方四正，立太极给重数关系宫的步骤，定盘强调多点交叉验证。'},
 geju:{kw:'紫府同宫 真假格局 / 阳梁昌禄 / 火贪格 / 三奇佳会 / 格局引动 破格',view:'同行强调成格条件、真假格与格局需引动；本站差异化：每个格局都拆成「成格条件—层级—引动—破格风险—行动建议」，不唱高也不吓。'},
 zhuxing:{kw:'十四主星性格 优缺点 / 主星夫妻宫 / 主星相处',view:'同行多做性格标签与伴侣排名；本站差异化：每颗主星给天赋—短板—辅佐需求—大限用法，夫妻宫强调读关系模式而非对象说明书。'},
 liunian:{kw:'大限与本命关系 / 流年落宫 / 大限好流年差 / 双忌叠加',view:'同行讲大限流年层级与双忌；本站差异化：本命—大限—流年三层叠加，给回调年与双忌年的具体防守动作。'},
 faq:{kw:'紫微准吗 / 早晚子时 / 紫微和八字区别 / 新手学习顺序',view:'同行FAQ覆盖定时、历法、学习路径；本站差异化：把准不准落到倾向vs决定，早晚子时给双盘定盘流程，学习顺序给六步路径。'},
 yingyong:{kw:'财运只看财帛宫吗 / 换工作怎么判断',view:'同行有投资映射十二宫类内容；本站差异化：财运走命财官迁田闭环，换工作看官禄命宫迁移大限流年，区分换平台/换赛道/补能力。'}
};
const catName={rumen:'入门基础',sihua:'四化飞星',kanpan:'看盘方法',geju:'格局',zhuxing:'主星性格配对',liunian:'大限流年',faq:'常见问题',yingyong:'应用场景'};
let out='# 调研驱动选题库 2026-09-04（同行主题归类 + 40 篇队列）\n\n';
out+='> 流程见 docs/article-research-driven-sop.md。只借同行的主题与观点框架，正文全部原创改写，不出现来源/品牌痕迹。\n\n';
out+='## 一、调研到的同行来源（按类型）\n\n';
out+='- 体系教学站：以十二宫/十四主星/四化飞星/格局成格条件为主线，含「三层四化」「立太极」「真假格局辨别」等框架。\n';
out+='- 事典型站点：14 主星×12 宫逐格释义、主星性格与伴侣配对。\n';
out+='- 内容平台（视频/图文）：火贪格、阳梁昌禄等格局逐格讲解、解盘技巧（禄忌对冲、双忌、权科解忌）。\n';
out+='- 工具/多语站：FAQ（时辰不准、早晚子时、阴历阳历、与八字区别、新手学习顺序）、三语排盘。\n';
out+='- 传统典籍白话站：王亭之格局论、诸星落宫参断，用于校验成格条件的传统依据。\n\n';
out+='## 二、选题归类与差异化（共 40 篇 = 80 HTML）\n\n';
const order=['rumen','sihua','kanpan','geju','zhuxing','liunian','faq','yingyong'];
let n=0;
for(const cat of order){
 const arr=m.filter(a=>a.cat===cat);
 out+=`### ${catName[cat]}（${arr.length} 篇）\n- 检索关键词：${SRC[cat].kw}\n- 借鉴观点 / 本站差异化：${SRC[cat].view}\n\n`;
 out+='| # | slug | 中文标题 | English title |\n|---|---|---|---|\n';
 for(const a of arr){n++;out+=`| ${String(n).padStart(2,'0')} | ${a.slug} | ${a.cnTitle} | ${a.enTitle} |\n`;}
 out+='\n';
}
out+='## 三、合规与去重\n\n- 正文为原创改写，仅吸收主题与论点结构，无逐字搬运、无同行站名/作者/外链。\n- 40 个 slug 已与 articles/ 现有文件、历史 queue/topic-bank 比对，均为新增（git 状态全部为未跟踪新文件）。\n- 技术件：中英双语、Article+Breadcrumb JSON-LD、双向 hreflang、canonical、OG、GA4、CTA、ol；入口含中英索引、分类专题页、双 Feed、三套 sitemap。\n';
fs.writeFileSync('docs/ziwei-research-2026-09-04-source.md',out,'utf8');
console.log('source doc written, topics',n);
