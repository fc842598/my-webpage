import {writeFileSync} from 'node:fs';
import a from './draft-20260911-a.mjs';
import b from './draft-20260911-b.mjs';
import c from './draft-20260911-c.mjs';
import replacements from './replacement-20260911.mjs';
const articles=[...a,...b,...c];
// These are specific edits after reading complete drafts, not a scoring gate.
const edits=[
[0,'这里把几种本领合成了一种：找出问题、组织论据、当场表达，实际可以差得很远。','能分析问题、能写清楚，和能当场讲出来，确实可能差得很远。','开头去掉编辑式旁白，直接回应写与说的差别。'],
[1,'经办、保管、拥有，是不同的关系。','你可能负责付款，却没有权利决定这笔钱用在哪里。','用实际权限替换三项抽象排比。'],
[2,'首先要分清：对方购买的是判断、方案，还是连执行也交给你。','要看对方只请你提出方案，还是也让你负责执行。','去掉首先与排比，保留合同角色差异而不作法律建议。'],
[3,'有吸引力、被关注、参加应酬、违背关系约定，是四件不同的事。','参加应酬时被人关注，不能证明这个人违背了伴侣间的约定。','将清单写成有具体对象的判断。'],
[4,'两者同宫', '两者同宫','占位：下方执行该篇真实编辑。'],
[5,'这个比较用于说明职务差异，不是根据星曜替两人排高低。','这个比较用于说明职务差异，不是根据星曜替两人排高低。','占位：下方执行该篇真实编辑。'],
[6,'星曜分类没有给人情定价。','分类讲的是解盘用法，现实中的帮助仍要按实际事情理解。','删去刻意金句。'],
[7,'让解释永远无法核对。','这样的说法无论考成怎样都能套用，却没有解释成绩。','把抽象方法评语改成读者能核对的结果。'],
[8,'兴趣与交付要求都值得问。','可以分别问：你喜欢做哪一段，工作又要求你反复完成哪一段。','用工作环节替代泛泛的值得问。'],
[9,'解读的帮助', '解读的帮助','占位：下方执行该篇真实编辑。'],
[10,'并不比硬凑同宫少一层价值。','不需要再改叫同宫。','去掉抽象价值比较。'],
[11,'便留下四个空宫。','就有四宫没有主星。','把数学例子的结尾落在准确的主星定义。'],
[12,'星曜的配对名称保留下来，位置关系也不会因此被省略。','例如“甲年魁钺，丑未相对”，名称和位置便都记清了。','末段用实记示例替代总结。'],
[13,'六颗、八颗和其他分组数字就不会互相打架。','就能知道每个数字在数什么。','删除拟人化结尾。'],
[14,'不要为了让一张盘看起来更好，把年解、月解和其他解厄星全加起来，当成几次保证。','把年解、月解分开记录；同样带“解”字，不代表现实里会得到几次帮助。','删去替读者揣测动机，保留不独立计数的判断。'],
[15,'前一部分可以讨论机会如何形成，后一部分应如实列作未知条件。','技能适合已经有了依据，交接安排则还需要向对方了解。','用具体已知与未知替换抽象分层。'],
[16,'反而漏掉争执围绕什么发生。','却没说两个人到底在争什么。','让语气更直接。'],
[17,'让具体反馈和职责说话，才能避免把一个专业角色写成固定的道德评价。','可以带上一条实际审核意见，说明依据是什么、对方怎样回应，别仅凭星名判断一个人是否公正。','删除拟人化说话与空泛总结。'],
[18,'把回应了什么、对方反对什么分别记下，比一句“太阳化忌很辛苦”更能帮助读者理解当前处境。','记下投诉的具体内容。对方反对的是延期，不等于反对你；如果确实批评了你的答复，也不要替它换成别的原因。','结尾落实到两种可核对的反馈。'],
[19,'空库着重讨论天府缺少禄的支持等资源条件；露库则着重讨论天府遇到煞曜时，保管与稳定受到干扰。','空库有不见禄的说法，也有把地空、天空同躔纳入条件的说法；露库常讨论煞曜交会下的保管与稳定问题。','读到具体派别口径后补足差异，避免把空库单一定义。'],
[20,'不如先把这次要谈的关系说清楚。','先看这次问的是论文指导，还是项目任务。','以具体双角色替换泛指关系。'],
[21,'没有发生的手足经历保留为空，比给命盘补一个不存在的故事更诚实。','没有手足，就保留这个事实；如果转谈同事，需要另说明采用的取象。','去掉道德化金句。'],
[22,'会使判断失去清楚的依据。','会让人无法知道这次到底按哪套规则解读。','消除抽象评价。'],
[23,'','','换题：租房原稿与9月5日居住变化不等于买房的意图重叠，整篇替换。'],
[24,'相同主星，只代表两张盘在这一项上相同。','相同的只是这一项主星配置，双方怎样相处还没有被说明。','避免同词循环。'],
[25,'一个人的动机则不能由“阴”或“煞”两个字判断。','“阴煞”这个名字并不能告诉你某个人在想什么。','把抽象动机判断写成直白人话。'],
[26,'把它记录清楚，后续追飞化路线时才不会把起点弄丢。','笔记里同时写宫名与宫干，例如“某宫丙干”，不要只抄一个丙字。','结尾改成具体记法，不虚构固定宫名。'],
[27,'','','换题：三合水局原稿与9月9日五行分类辨析意图接近，改写为十年与十二年周期。'],
[28,'历法或时辰校核是另一件事，不要被一个术语牵着做无关的精度推算。','若另外怀疑时辰有误，再单独校核出生资料；这不属于“同度”的含义。','去掉训诫口吻。'],
[29,'把两者直接画上等号。','从星名推出这项技能。','删除惯用比喻。']
];
edits[4]=[4,'人员、专业标准、某个项目，不能只用一个“权”字概括。','管理人员和审核专业标准，授权范围可能完全不同。','删去三段式与泛指权字，聚焦本文的两种职责。'];
edits[5]=[5,'这些感受与制度、评价方式有关，不能全归到一颗星的性质上。','岗位考核若只记录抢修次数，预防工作便可能不容易被看见；这需要先查工作制度。','把笼统归因改成可核查的评价方式。'];
edits[9]=[9,'它对这次工作的帮助就很有限。','就还没有回答这七次修改到底花在了哪里。','收尾回到开头的第七版，删除泛泛帮助评语。'];
const log=[];
for(const[i,from,to,note]of edits){
 if(from){if(!articles[i].body.includes(from))throw new Error(`Missing edit ${i+1}: ${from}`); articles[i].body=articles[i].body.replace(from,to);}
 log.push({order:i+1,slug:articles[i].slug,note,from,to});
}
articles[23]={slug:'ziwei-tianzhai-yougong-bu-dengyu-chaoxi',category:'宫位关系',title:'田宅宫在酉，就该住朝西的房子吗？',enTitle:'A Property Palace at You does not establish a west-facing home',enDescription:'Separate branch symbolism in a natal chart from the measured orientation of a real home. A Property Palace position is not a floor plan.',body:`田宅宫落酉，酉又常与西方相配，能不能据此选择朝西的房子？仅凭这一步对应，推不出适合的住宅朝向。命盘宫位和现场房屋坐向，是两类资料。

### 盘上的位置不是房子的测量结果
本命田宅宫由命盘排布确定，不会因为换了一套住宅就挪到别的本命宫位。现实中，一个人可以先后住过朝向不同的房子；同一住宅也可能住着出生资料完全不同的家人。若仅按田宅宫地支指定朝向，便无法说明这些情况怎样处理。

酉与西方的传统对应可以作为某些取象方法的背景，但它本身没有测出大门、建筑轴线或窗户的位置。也不能把屏幕上的田宅格子当成房屋平面图，指着左下角就认定现实中应该摆床。

### 谈居住，仍需说明实际住处
用斗数讨论家庭与居住变化时，可以描述搬家、同住安排、生活空间怎样变化。若另用阳宅方法讨论朝向，需要另取得现场资料，并说明使用的体系，不能省略这一步，把命盘的一个地支直接当结论。

提问时把两件事拆开：“我的田宅宫在酉”和“这套房实测朝向是什么”。前者属于出生盘，后者属于房屋。把资料分清，比硬把二者配成同一个西字更有意义。`,enBody:`A Property Palace at You does not establish that a west-facing home suits you. You's traditional directional association and a building's measured orientation are different kinds of information.

The natal Property Palace stays in place when a person moves. Someone can live in several homes with different orientations, while one home can house people with different birth charts. A palace label alone does not resolve those circumstances.

Nor does the chart's screen layout measure a doorway, building axis or window. A box at the lower left is not a room on a floor plan.

For a Zi Wei Dou Shu housing discussion, describe changes in living arrangements and household space. A separate geomancy method would require its own site information and stated rules.

Keep the two statements distinct: “My natal Property Palace is at You” and “This home's measured orientation is this.” Matching a directional word does not supply the missing evidence.`};
articles[27]={slug:'ziwei-liunian-shinian-sihua-shiernian-gongwei',category:'大限流年',title:'流年四化十年重复，为什么流年命宫十二年才回原位？',enTitle:'Ten-year transformation cycles and twelve-year annual palace cycles',enDescription:'Year stems repeat every ten years and branches every twelve. Explain why an annual transformation table can repeat before the annual Life Palace.',body:`2026和2036都是丙年，四化表相同，但采用太岁法定位流年命宫时，两年并不落在同一个地支。这不是软件前后不一致，而是天干与地支的周期不同。

### 十个天干，十二个地支
天干十年走完一轮，地支十二年走完一轮。2026是丙午，2036是丙辰，2046是丙寅：丙干重复，所配地支却还在变。按同一四化表取流年四化时，化禄等标记对应的星相同；按太岁法取年度命宫时，则分别以午、辰、寅定位。

这说明四化相同和年度宫位相同，是两个独立的核对项目。不能看到又逢丙干，就直接复制十年前的年度解读。

### 六十年重复的是干支名称
十与十二的最小公倍数是六十，因此年干支六十年一轮。但这并不意味着人生事件六十年重演。年龄、大限、家庭与工作条件都可能不同；年名相同也没有把这些条件复原。

如果某排盘采用其他年度定位方式，先查该系统的说明。本篇只解释常见太岁定位法与年干四化的周期差别。比较两年时，把干支全写出来，再分别核对四化与流年宫名，别只留下一个丙字。`,enBody:`Both 2026 and 2036 are Bing years, but their annual Life Palaces differ under the common year-branch method. Stems and branches have different cycle lengths.

### Ten versus twelve
The ten stems repeat every ten years; the twelve branches repeat every twelve. The sequence is Bing-Wu in 2026, Bing-Chen in 2036 and Bing-Yin in 2046. The same Bing transformation table selects the same stars, while the annual Life Palace is located at Wu, Chen and Yin respectively under this method.

Matching transformations and matching annual palace positions are therefore separate checks. A recurring stem does not justify copying the reading from ten years earlier.

The complete stem–branch year name repeats after sixty years, the least common multiple of ten and twelve. That is a naming cycle, not evidence that life events recur. Age, decade cycle and circumstances have changed.

If a system uses a different annual-position convention, identify it. Write the complete year designation and check transformations and palace placement separately.`};
log[23].replacementSlug=articles[23].slug;
log[27].replacementSlug=articles[27].slug;
// Align English with the substantive Chinese corrections.
articles[5].enBody=articles[5].enBody.replace('Those are features of the job and its evaluation system.','If evaluations count only emergency repairs, preventive work may become less visible. Check how the job is assessed.');
articles[19].enBody=articles[19].enBody.replace('Common explanations of an empty treasury emphasize missing Lu support.','Some empty-treasury definitions emphasize missing Lu support; others also include co-location with particular empty stars.');
const categories={'星曜组合':'主星细读','宫位关系':'宫位组合','事业职场':'财运事业','感情婚姻':'宫位组合'};
for(const replacement of replacements){
 const {order,...draft}=replacement;
 const from=order===25?'一个人的行为，需要由行为说明':order===27?'组织关系和私人来往可能走两条路':'有没有职责，比忙不忙更具体';
 const to=order===25?'化忌不能证明失约，化禄也不能替失约开脱':order===27?'不再共事，还可能继续来往':'先看现在负责什么';
 draft.body=draft.body.replace(from,to);
 log.push({order,oldSlug:articles[order-1].slug,replacementSlug:draft.slug,reason:'通读最相近旧文后避免重复；完整替换稿另存',from,to});
 articles[order-1]=draft;
}
for(const a of articles)a.category=categories[a.category]||a.category;
writeFileSync('docs/article-drafts/humanizer-20260911.mjs','export default '+JSON.stringify(articles,null,2)+';\n');
writeFileSync('docs/article-drafts/2026-09-11-humanizer-edits.json',JSON.stringify({editedAt:new Date().toISOString(),skill:'humanizer-zh',editor:'current agent',count:articles.length,changes:log},null,2)+'\n');
console.log(`Edited ${articles.length} complete bilingual drafts; replaced two overlapping topics.`);
