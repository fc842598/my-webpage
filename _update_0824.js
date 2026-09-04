const fs = require('fs');
const dateFull = '2026-08-24T10:30:00+08:00';

// All 100 article slugs and titles
const mainStarArticles = [
  {slug:'ziwei-jumen-zai-fudegong', cnTitle:'巨门在福德宫：心思太重的人，福气都被想没了', enTitle:'Ju Men in Fortune Palace: Overthinking Drains Away Blessings', enDesc:'Ju Men in Fortune means overthinking drains blessings; peace of mind is the key.'},
  {slug:'ziwei-jumen-zai-fumugong', cnTitle:'巨门在父母宫：跟父母沟通靠讲理，但家不是辩论场', enTitle:'Ju Men in Parents Palace: Reasoning with Parents', enDesc:'Ju Men in Parents means communication relies on reasoning, but home is not a debate court.'},
  {slug:'ziwei-tianxiang-zai-minggong', cnTitle:'天相在命宫：印星坐命：天生的二把手和协调者', enTitle:'Tian Xiang in Life Palace: The Seal Star in Life', enDesc:'Tian Xiang in Life gives a steady, methodical nature suited to coordination and support.'},
  {slug:'ziwei-tianxiang-zai-xiongdigong', cnTitle:'天相在兄弟宫：兄弟姐妹中有人当和事佬', enTitle:'Tian Xiang in Siblings Palace: A Peacemaker Among Siblings', enDesc:'Tian Xiang in Siblings brings a peacemaker among brothers and sisters.'},
  {slug:'ziwei-tianxiang-zai-fuqigong', cnTitle:'天相在夫妻宫：伴侣稳重体面，婚姻讲究门当户对', enTitle:'Tian Xiang in Spouse Palace: A Steady, Presentable Partner', enDesc:'Tian Xiang in Spouse means a steady, presentable partner; marriage values matching status.'},
  {slug:'ziwei-tianxiang-zai-zinvgong', cnTitle:'天相在子女宫：孩子懂事守规矩，教育要给主见', enTitle:'Tian Xiang in Children Palace: Well-Behaved Children', enDesc:'Tian Xiang in Children means well-behaved children; give them independent thinking.'},
  {slug:'ziwei-tianxiang-zai-caibogong', cnTitle:'天相在财帛宫：收入稳但不暴富，靠专业和信誉赚钱', enTitle:'Tian Xiang in Wealth Palace: Stable Income, No Windfalls', enDesc:'Tian Xiang in Wealth brings stable income through expertise and reputation.'},
  {slug:'ziwei-tianxiang-zai-jiegong', cnTitle:'天相在疾厄宫：注意肾脏和泌尿系统，饮食要规律', enTitle:'Tian Xiang in Health Palace: Kidneys and Urinary System', enDesc:'Tian Xiang in Health calls attention to kidneys and urinary system; regular eating matters.'},
  {slug:'ziwei-tianxiang-zai-qianyi', cnTitle:'天相在迁移宫：在外形象好，离乡靠口碑吃饭', enTitle:'Tian Xiang in Travel Palace: Good Reputation Outside', enDesc:'Tian Xiang in Travel means good image outside; earning by word of mouth.'},
  {slug:'ziwei-tianxiang-zai-puyigong', cnTitle:'天相在仆役宫：朋友多为正派人士，但知心不多', enTitle:'Tian Xiang in Friends Palace: Mostly Upright Friends', enDesc:'Tian Xiang in Friends brings mostly upright friends but few confidants.'},
  {slug:'ziwei-tianxiang-zai-guanlugong', cnTitle:'天相在官禄宫：适合辅佐型岗位，是最佳二把手', enTitle:'Tian Xiang in Career Palace: The Best Deputy', enDesc:'Tian Xiang in Career suits support roles and deputy positions.'},
  {slug:'ziwei-tianxiang-zai-tianzhaigong', cnTitle:'天相在田宅宫：家里整洁有序，居家运平稳', enTitle:'Tian Xiang in Property Palace: Tidy, Orderly Home', enDesc:'Tian Xiang in Property means a tidy, orderly home with stable domestic luck.'},
  {slug:'ziwei-tianxiang-zai-fudegong', cnTitle:'天相在福德宫：心态平和但容易纠结，学会做决定', enTitle:'Tian Xiang in Fortune Palace: Peaceful but Indecisive', enDesc:'Tian Xiang in Fortune brings peace but indecision; learn to choose.'},
  {slug:'ziwei-tianxiang-zai-fumugong', cnTitle:'天相在父母宫：父母有身份地位，家教严格', enTitle:'Tian Xiang in Parents Palace: Parents with Status', enDesc:'Tian Xiang in Parents means parents with status and strict family education.'},
  {slug:'ziwei-tianliang-zai-minggong', cnTitle:'天梁在命宫：荫星坐命：逢凶化吉的老灵魂', enTitle:'Tian Liang in Life Palace: The Shelter Star in Life', enDesc:'Tian Liang in Life gives an old-soul nature that turns misfortune into blessing.'},
  {slug:'ziwei-tianliang-zai-xiongdigong', cnTitle:'天梁在兄弟宫：兄弟姐妹中有贵人，年龄差距大', enTitle:'Tian Liang in Siblings Palace: A Benefactor with Age Gap', enDesc:'Tian Liang in Siblings brings a benefactor sibling with a large age gap.'},
  {slug:'ziwei-tianliang-zai-fuqigong', cnTitle:'天梁在夫妻宫：伴侣像长辈一样照顾你，感情有年龄差', enTitle:'Tian Liang in Spouse Palace: A Partner Who Cares Like an Elder', enDesc:'Tian Liang in Spouse means a caring partner with possible age gap.'},
  {slug:'ziwei-tianliang-zai-zinvgong', cnTitle:'天梁在子女宫：孩子懂事独立，教育要放手不要操心', enTitle:'Tian Liang in Children Palace: Independent Children', enDesc:'Tian Liang in Children means independent, sensible children; let go, do not fret.'},
  {slug:'ziwei-tianliang-zai-caibogong', cnTitle:'天梁在财帛宫：收入来自荫庇和专业，不适合投机', enTitle:'Tian Liang in Wealth Palace: Income from Shelter and Expertise', enDesc:'Tian Liang in Wealth means income from shelter and expertise; not for speculation.'},
  {slug:'ziwei-tianliang-zai-jiegong', cnTitle:'天梁在疾厄宫：注意脾胃和消化系统，长寿体质', enTitle:'Tian Liang in Health Palace: Spleen and Digestion; Longevity', enDesc:'Tian Liang in Health calls attention to spleen and digestion; longevity constitution.'},
  {slug:'ziwei-tianliang-zai-qianyi', cnTitle:'天梁在迁移宫：在外遇贵人，离乡发展有长辈提携', enTitle:'Tian Liang in Travel Palace: Benefactors Outside', enDesc:'Tian Liang in Travel means benefactors and elder support away from home.'},
  {slug:'ziwei-tianliang-zai-puyigong', cnTitle:'天梁在仆役宫：朋友多为年长者，诤友多', enTitle:'Tian Liang in Friends Palace: Older, Straight-Talking Friends', enDesc:'Tian Liang in Friends brings mostly older friends who speak frankly.'},
  {slug:'ziwei-tianliang-zai-guanlugong', cnTitle:'天梁在官禄宫：适合教育、医疗、法律等助人行业', enTitle:'Tian Liang in Career Palace: Helping Professions', enDesc:'Tian Liang in Career suits education, medicine, law, and other helping fields.'},
  {slug:'ziwei-tianliang-zai-tianzhaigong', cnTitle:'天梁在田宅宫：家产有荫庇，可能继承祖业', enTitle:'Tian Liang in Property Palace: Sheltered Family Assets', enDesc:'Tian Liang in Property means sheltered family assets and possible inheritance.'},
  {slug:'ziwei-tianliang-zai-fudegong', cnTitle:'天梁在福德宫：福气最厚的位置之一，心态好逢凶化吉', enTitle:'Tian Liang in Fortune Palace: One of the Most Blessed Positions', enDesc:'Tian Liang in Fortune is one of the most blessed positions; good mindset turns misfortune.'},
  {slug:'ziwei-tianliang-zai-fumugong', cnTitle:'天梁在父母宫：父母是你的保护伞，长辈缘极深', enTitle:'Tian Liang in Parents Palace: Parents as Your Umbrella', enDesc:'Tian Liang in Parents means parents are your umbrella with deepest elder bonds.'},
  {slug:'ziwei-qisha-zai-minggong', cnTitle:'七杀在命宫：将星坐命：独来独往的开路人', enTitle:'Qi Sha in Life Palace: An Independent Trailblazer', enDesc:'Qi Sha in Life gives a resolute, independent nature that pioneers new paths.'},
  {slug:'ziwei-qisha-zai-xiongdigong', cnTitle:'七杀在兄弟宫：兄弟姐妹个性强，关系淡但关键时刻靠得住', enTitle:'Qi Sha in Siblings Palace: Strong-Willed Siblings', enDesc:'Qi Sha in Siblings brings strong-willed siblings who are distant but reliable.'},
  {slug:'ziwei-qisha-zai-fuqigong', cnTitle:'七杀在夫妻宫：伴侣强势独立，感情像战友不像情侣', enTitle:'Qi Sha in Spouse Palace: A Strong, Independent Partner', enDesc:'Qi Sha in Spouse means a strong partner; love is like comradeship.'},
  {slug:'ziwei-qisha-zai-zinvgong', cnTitle:'七杀在子女宫：孩子好胜独立，教育要给空间不要压制', enTitle:'Qi Sha in Children Palace: Competitive, Independent Children', enDesc:'Qi Sha in Children means competitive children; give space, do not suppress.'},
  {slug:'ziwei-qisha-zai-caibogong', cnTitle:'七杀在财帛宫：财运大开大合，适合高风险高回报', enTitle:'Qi Sha in Wealth Palace: Big Swings in Wealth', enDesc:'Qi Sha in Wealth brings big swings; suited to high risk, high reward.'},
  {slug:'ziwei-qisha-zai-jiegong', cnTitle:'七杀在疾厄宫：注意外伤和急性病，运动要热身', enTitle:'Qi Sha in Health Palace: Injuries and Acute Illness', enDesc:'Qi Sha in Health calls attention to injuries and acute illness; warm up before exercise.'},
  {slug:'ziwei-qisha-zai-qianyi', cnTitle:'七杀在迁移宫：在外闯荡能出头，离乡反而是出路', enTitle:'Qi Sha in Travel Palace: Breaking Through Outside', enDesc:'Qi Sha in Travel means leaving home is the path to breakthrough.'},
  {slug:'ziwei-qisha-zai-puyigong', cnTitle:'七杀在仆役宫：朋友少而精，都是能一起扛事的人', enTitle:'Qi Sha in Friends Palace: Few but Loyal Friends', enDesc:'Qi Sha in Friends brings few but loyal friends who carry burdens with you.'},
  {slug:'ziwei-qisha-zai-guanlugong', cnTitle:'七杀在官禄宫：适合军警、创业、竞争性强的行业', enTitle:'Qi Sha in Career Palace: Military, Police, Entrepreneurship', enDesc:'Qi Sha in Career suits military, police, entrepreneurship, and competitive fields.'},
  {slug:'ziwei-qisha-zai-tianzhaigong', cnTitle:'七杀在田宅宫：房产运波动大，容易买卖频繁', enTitle:'Qi Sha in Property Palace: Volatile Property Luck', enDesc:'Qi Sha in Property means volatile property luck with frequent trading.'},
  {slug:'ziwei-qisha-zai-fudegong', cnTitle:'七杀在福德宫：停不下来的人，放松对他们来说很难', enTitle:'Qi Sha in Fortune Palace: Cannot Stop; Relaxation Is Hard', enDesc:'Qi Sha in Fortune means someone who cannot stop; relaxation is difficult.'},
  {slug:'ziwei-qisha-zai-fumugong', cnTitle:'七杀在父母宫：父母管教严厉，关系有距离感', enTitle:'Qi Sha in Parents Palace: Strict Parents, Distant Relationship', enDesc:'Qi Sha in Parents means strict parents with a distant relationship.'},
  {slug:'ziwei-pojun-zai-minggong', cnTitle:'破军在命宫：先锋星坐命：先破后立的变革者', enTitle:'Po Jun in Life Palace: A Revolutionary Who Destroys Then Rebuilds', enDesc:'Po Jun in Life gives a pioneering nature that destroys then rebuilds.'},
  {slug:'ziwei-pojun-zai-xiongdigong', cnTitle:'破军在兄弟宫：兄弟姐妹中有人不走寻常路', enTitle:'Po Jun in Siblings Palace: An Unconventional Sibling', enDesc:'Po Jun in Siblings brings a sibling who takes an unconventional path.'},
  {slug:'ziwei-pojun-zai-fuqigong', cnTitle:'破军在夫妻宫：感情波折多，伴侣需要能接受变化', enTitle:'Po Jun in Spouse Palace: Many Relationship Twists', enDesc:'Po Jun in Spouse brings many twists; partner must accept change.'},
  {slug:'ziwei-pojun-zai-zinvgong', cnTitle:'破军在子女宫：孩子叛逆有主见，教育要引导不要堵', enTitle:'Po Jun in Children Palace: Rebellious, Opinionated Children', enDesc:'Po Jun in Children means rebellious children; guide, do not block.'},
  {slug:'ziwei-pojun-zai-caibogong', cnTitle:'破军在财帛宫：财来财去波动大，适合创新行业', enTitle:'Po Jun in Wealth Palace: Volatile Cash Flow', enDesc:'Po Jun in Wealth brings volatile cash flow; suited to innovative industries.'},
  {slug:'ziwei-pojun-zai-jiegong', cnTitle:'破军在疾厄宫：注意牙齿和骨骼，旧伤容易复发', enTitle:'Po Jun in Health Palace: Teeth, Bones, Old Injuries', enDesc:'Po Jun in Health calls attention to teeth, bones, and recurring old injuries.'},
  {slug:'ziwei-pojun-zai-qianyi', cnTitle:'破军在迁移宫：在外开创新局面，离乡发展更精彩', enTitle:'Po Jun in Travel Palace: Creating New Frontiers Outside', enDesc:'Po Jun in Travel means creating new frontiers away from home.'},
  {slug:'ziwei-pojun-zai-puyigong', cnTitle:'破军在仆役宫：朋友流动性大，旧友去新友来', enTitle:'Po Jun in Friends Palace: High Friend Turnover', enDesc:'Po Jun in Friends means high turnover; old friends go, new ones come.'},
  {slug:'ziwei-pojun-zai-guanlugong', cnTitle:'破军在官禄宫：适合创业、改革、开拓新市场', enTitle:'Po Jun in Career Palace: Entrepreneurship and Reform', enDesc:'Po Jun in Career suits entrepreneurship, reform, and new market development.'},
  {slug:'ziwei-pojun-zai-tianzhaigong', cnTitle:'破军在田宅宫：居家环境常变，房产买卖频繁', enTitle:'Po Jun in Property Palace: Frequent Home Changes', enDesc:'Po Jun in Property means frequent home changes and active property trading.'},
  {slug:'ziwei-pojun-zai-fudegong', cnTitle:'破军在福德宫：精神上追求突破，不满足于现状', enTitle:'Po Jun in Fortune Palace: Spiritual Pursuit of Breakthrough', enDesc:'Po Jun in Fortune means never satisfied with the status quo; pursuing breakthrough.'},
  {slug:'ziwei-pojun-zai-fumugong', cnTitle:'破军在父母宫：与父母缘分多变，可能离家早', enTitle:'Po Jun in Parents Palace: Changeable Parental Bonds', enDesc:'Po Jun in Parents means changeable bonds; may leave home early.'}
];

const auxArticles = [
  {slug:'ziwei-zuofu-zai-minggong', cnTitle:'左辅在命宫：忠厚老实的好帮手，贵人来自你的靠谱', enTitle:'Zuo Fu in Life Palace: An Honest, Reliable Helper', enDesc:'Zuo Fu in Life gives honesty and reliability; benefactors come from trustworthiness.'},
  {slug:'ziwei-zuofu-zai-xiongdigong', cnTitle:'左辅在兄弟宫：兄弟姐妹是你的后盾，有人帮你扛事', enTitle:'Zuo Fu in Siblings Palace: Siblings as Backing', enDesc:'Zuo Fu in Siblings means siblings are your backing who help carry the load.'},
  {slug:'ziwei-zuofu-zai-fuqigong', cnTitle:'左辅在夫妻宫：伴侣是你的贤内助，婚姻稳定', enTitle:'Zuo Fu in Spouse Palace: A Supportive Partner', enDesc:'Zuo Fu in Spouse means a supportive partner and stable marriage.'},
  {slug:'ziwei-zuofu-zai-zinvgong', cnTitle:'左辅在子女宫：子女乖巧听话，教育上多给陪伴', enTitle:'Zuo Fu in Children Palace: Well-Behaved Children', enDesc:'Zuo Fu in Children means well-behaved children; give them companionship.'},
  {slug:'ziwei-zuofu-zai-caibogong', cnTitle:'左辅在财帛宫：收入靠稳扎稳打，有人带你赚钱', enTitle:'Zuo Fu in Wealth Palace: Steady Income with Guidance', enDesc:'Zuo Fu in Wealth means steady income with someone guiding you to earn.'},
  {slug:'ziwei-zuofu-zai-jiegong', cnTitle:'左辅在疾厄宫：体质偏壮实，但要注意饮食过量', enTitle:'Zuo Fu in Health Palace: Sturdy Constitution', enDesc:'Zuo Fu in Health gives a sturdy constitution; watch overeating.'},
  {slug:'ziwei-zuofu-zai-qianyi', cnTitle:'左辅在迁移宫：外出遇贵人帮忙，离乡有人照应', enTitle:'Zuo Fu in Travel Palace: Benefactors Help Outside', enDesc:'Zuo Fu in Travel means benefactors help when you are away from home.'},
  {slug:'ziwei-zuofu-zai-puyigong', cnTitle:'左辅在仆役宫：朋友忠诚可靠，是你的左膀右臂', enTitle:'Zuo Fu in Friends Palace: Loyal, Reliable Friends', enDesc:'Zuo Fu in Friends brings loyal, reliable friends who are your right and left hands.'},
  {slug:'ziwei-zuofu-zai-guanlugong', cnTitle:'左辅在官禄宫：职场上有贵人提拔，适合辅佐岗位', enTitle:'Zuo Fu in Career Palace: Benefactors Promote You', enDesc:'Zuo Fu in Career means benefactors promote you; suited to support roles.'},
  {slug:'ziwei-zuofu-zai-tianzhaigong', cnTitle:'左辅在田宅宫：家里有帮手，置业运稳', enTitle:'Zuo Fu in Property Palace: Help at Home, Stable Property', enDesc:'Zuo Fu in Property means help at home and stable property luck.'},
  {slug:'ziwei-zuofu-zai-fudegong', cnTitle:'左辅在福德宫：心态宽厚，福气来自厚道', enTitle:'Zuo Fu in Fortune Palace: Generous Mindset', enDesc:'Zuo Fu in Fortune brings a generous mindset; blessings come from kindness.'},
  {slug:'ziwei-zuofu-zai-fumugong', cnTitle:'左辅在父母宫：父母温和有助力，家庭氛围好', enTitle:'Zuo Fu in Parents Palace: Gentle, Helpful Parents', enDesc:'Zuo Fu in Parents means gentle, helpful parents and good family atmosphere.'},
  {slug:'ziwei-youbi-zai-minggong', cnTitle:'右弼在命宫：聪明圆融的交际家，到哪都有人帮', enTitle:'You Bi in Life Palace: A Clever, Harmonious Networker', enDesc:'You Bi in Life gives cleverness and social skill; helped wherever you go.'},
  {slug:'ziwei-youbi-zai-xiongdigong', cnTitle:'右弼在兄弟宫：兄弟姐妹中有人善交际，能帮你牵线', enTitle:'You Bi in Siblings Palace: A Sociable Sibling', enDesc:'You Bi in Siblings brings a sociable sibling who makes connections for you.'},
  {slug:'ziwei-youbi-zai-fuqigong', cnTitle:'右弼在夫妻宫：伴侣善解人意，但要防第三者', enTitle:'You Bi in Spouse Palace: An Understanding Partner', enDesc:'You Bi in Spouse means an understanding partner; watch for third parties.'},
  {slug:'ziwei-youbi-zai-zinvgong', cnTitle:'右弼在子女宫：孩子聪明机灵，教育要防分心', enTitle:'You Bi in Children Palace: Clever, Quick-Witted Children', enDesc:'You Bi in Children means clever children; prevent distraction.'},
  {slug:'ziwei-youbi-zai-caibogong', cnTitle:'右弼在财帛宫：赚钱靠人脉和机会，有人介绍生意', enTitle:'You Bi in Wealth Palace: Earning Through Connections', enDesc:'You Bi in Wealth means earning through connections and referrals.'},
  {slug:'ziwei-youbi-zai-jiegong', cnTitle:'右弼在疾厄宫：注意肾脏和内分泌，情绪影响健康', enTitle:'You Bi in Health Palace: Kidneys and Endocrine', enDesc:'You Bi in Health calls attention to kidneys and endocrine; emotions affect health.'},
  {slug:'ziwei-youbi-zai-qianyi', cnTitle:'右弼在迁移宫：在外人缘极好，出门靠朋友', enTitle:'You Bi in Travel Palace: Extremely Popular Outside', enDesc:'You Bi in Travel means extreme popularity; rely on friends away from home.'},
  {slug:'ziwei-youbi-zai-puyigong', cnTitle:'右弼在仆役宫：朋友遍天下，但要防表面朋友', enTitle:'You Bi in Friends Palace: Friends Everywhere', enDesc:'You Bi in Friends brings friends everywhere; beware superficial ones.'},
  {slug:'ziwei-youbi-zai-guanlugong', cnTitle:'右弼在官禄宫：职场上靠人际关系上位', enTitle:'You Bi in Career Palace: Advancing Through Relationships', enDesc:'You Bi in Career means advancing through interpersonal relationships.'},
  {slug:'ziwei-youbi-zai-tianzhaigong', cnTitle:'右弼在田宅宫：家里常有客人，居家氛围活跃', enTitle:'You Bi in Property Palace: Frequent Guests, Lively Home', enDesc:'You Bi in Property means frequent guests and lively home atmosphere.'},
  {slug:'ziwei-youbi-zai-fudegong', cnTitle:'右弼在福德宫：精神上需要陪伴，怕孤独', enTitle:'You Bi in Fortune Palace: Needs Companionship', enDesc:'You Bi in Fortune means needing companionship; fears loneliness.'},
  {slug:'ziwei-youbi-zai-fumugong', cnTitle:'右弼在父母宫：父母随和开明，沟通顺畅', enTitle:'You Bi in Parents Palace: Easy-Going, Open-Minded Parents', enDesc:'You Bi in Parents means easy-going parents with smooth communication.'},
  {slug:'ziwei-wenchang-zai-minggong', cnTitle:'文昌在命宫：文笔出众的读书人，靠知识改变命运', enTitle:'Wen Chang in Life Palace: An Outstanding Writer', enDesc:'Wen Chang in Life gives outstanding writing ability; knowledge changes destiny.'},
  {slug:'ziwei-wenchang-zai-xiongdigong', cnTitle:'文昌在兄弟宫：兄弟姐妹中有学霸，文书上能帮你', enTitle:'Wen Chang in Siblings Palace: A Scholarly Sibling', enDesc:'Wen Chang in Siblings brings a scholarly sibling who helps with documents.'},
  {slug:'ziwei-wenchang-zai-fuqigong', cnTitle:'文昌在夫妻宫：伴侣有学识，感情讲究精神共鸣', enTitle:'Wen Chang in Spouse Palace: An Educated Partner', enDesc:'Wen Chang in Spouse means an educated partner; love needs intellectual resonance.'},
  {slug:'ziwei-wenchang-zai-zinvgong', cnTitle:'文昌在子女宫：孩子读书好，教育上重视学业', enTitle:'Wen Chang in Children Palace: Academically Inclined Children', enDesc:'Wen Chang in Children means academically inclined children; value education.'},
  {slug:'ziwei-wenchang-zai-caibogong', cnTitle:'文昌在财帛宫：靠专业知识和文书赚钱', enTitle:'Wen Chang in Wealth Palace: Earning Through Expert Knowledge', enDesc:'Wen Chang in Wealth means earning through expert knowledge and documents.'},
  {slug:'ziwei-wenchang-zai-jiegong', cnTitle:'文昌在疾厄宫：注意呼吸系统和大肠，用脑过度', enTitle:'Wen Chang in Health Palace: Respiratory System, Overthinking', enDesc:'Wen Chang in Health calls attention to respiratory system and colon; overthinking drains.'},
  {slug:'ziwei-wenchang-zai-qianyi', cnTitle:'文昌在迁移宫：在外靠学历和证书立足', enTitle:'Wen Chang in Travel Palace: Credentials Outside', enDesc:'Wen Chang in Travel means establishing outside through credentials and certificates.'},
  {slug:'ziwei-wenchang-zai-puyigong', cnTitle:'文昌在仆役宫：朋友多为文化人，能交流学问', enTitle:'Wen Chang in Friends Palace: Literary Friends', enDesc:'Wen Chang in Friends brings mostly literary friends for intellectual exchange.'},
  {slug:'ziwei-wenchang-zai-guanlugong', cnTitle:'文昌在官禄宫：适合教育、写作、公职等文职', enTitle:'Wen Chang in Career Palace: Literary Fields', enDesc:'Wen Chang in Career suits education, writing, civil service, and literary fields.'},
  {slug:'ziwei-wenchang-zai-tianzhaigong', cnTitle:'文昌在田宅宫：家里书房布置好，有家学渊源', enTitle:'Wen Chang in Property Palace: A Good Study at Home', enDesc:'Wen Chang in Property means a good study and family scholarly tradition.'},
  {slug:'ziwei-wenchang-zai-fudegong', cnTitle:'文昌在福德宫：精神追求高雅，喜欢读书思考', enTitle:'Wen Chang in Fortune Palace: Refined Spiritual Pursuits', enDesc:'Wen Chang in Fortune brings refined pursuits; loves reading and thinking.'},
  {slug:'ziwei-wenchang-zai-fumugong', cnTitle:'文昌在父母宫：父母重视教育，学历运好', enTitle:'Wen Chang in Parents Palace: Parents Value Education', enDesc:'Wen Chang in Parents means parents value education; good academic luck.'},
  {slug:'ziwei-wenqu-zai-minggong', cnTitle:'文曲在命宫：多才多艺的创意人，靠才华吃饭', enTitle:'Wen Qu in Life Palace: A Versatile Creative', enDesc:'Wen Qu in Life gives versatility and creativity; living by talent.'},
  {slug:'ziwei-wenqu-zai-xiongdigong', cnTitle:'文曲在兄弟宫：兄弟姐妹中有才艺出众者', enTitle:'Wen Qu in Siblings Palace: An Artistically Talented Sibling', enDesc:'Wen Qu in Siblings brings a sibling with artistic talent.'},
  {slug:'ziwei-wenqu-zai-fuqigong', cnTitle:'文曲在夫妻宫：伴侣浪漫有情趣，感情丰富', enTitle:'Wen Qu in Spouse Palace: A Romantic, Charming Partner', enDesc:'Wen Qu in Spouse means a romantic, emotionally rich partner.'},
  {slug:'ziwei-wenqu-zai-zinvgong', cnTitle:'文曲在子女宫：孩子有艺术天赋，教育要因材施教', enTitle:'Wen Qu in Children Palace: Artistically Gifted Children', enDesc:'Wen Qu in Children means artistically gifted children; teach according to aptitude.'},
  {slug:'ziwei-wenqu-zai-caibogong', cnTitle:'文曲在财帛宫：靠才艺和口才赚钱，偏门财路多', enTitle:'Wen Qu in Wealth Palace: Earning Through Talent and Speech', enDesc:'Wen Qu in Wealth means earning through talent and eloquence; many side paths.'},
  {slug:'ziwei-wenqu-zai-jiegong', cnTitle:'文曲在疾厄宫：注意肾脏和生殖系统，不要熬夜', enTitle:'Wen Qu in Health Palace: Kidneys and Reproductive System', enDesc:'Wen Qu in Health calls attention to kidneys and reproductive system; avoid late nights.'},
  {slug:'ziwei-wenqu-zai-qianyi', cnTitle:'文曲在迁移宫：在外靠才艺和口才吸引人', enTitle:'Wen Qu in Travel Palace: Attracting Through Talent and Speech', enDesc:'Wen Qu in Travel means attracting others through talent and eloquence.'},
  {slug:'ziwei-wenqu-zai-puyigong', cnTitle:'文曲在仆役宫：朋友多为艺术圈人士', enTitle:'Wen Qu in Friends Palace: Friends from Artistic Circles', enDesc:'Wen Qu in Friends brings mostly friends from artistic circles.'},
  {slug:'ziwei-wenqu-zai-guanlugong', cnTitle:'文曲在官禄宫：适合艺术、传媒、策划等创意行业', enTitle:'Wen Qu in Career Palace: Creative Industries', enDesc:'Wen Qu in Career suits arts, media, planning, and creative industries.'},
  {slug:'ziwei-wenqu-zai-tianzhaigong', cnTitle:'文曲在田宅宫：家里有艺术氛围，装修有品味', enTitle:'Wen Qu in Property Palace: An Artistic, Tasteful Home', enDesc:'Wen Qu in Property means an artistic home with tasteful decoration.'},
  {slug:'ziwei-wenqu-zai-fudegong', cnTitle:'文曲在福德宫：精神世界浪漫多彩，喜欢享受', enTitle:'Wen Qu in Fortune Palace: A Romantic, Colorful Inner World', enDesc:'Wen Qu in Fortune brings a romantic inner world and love of enjoyment.'},
  {slug:'ziwei-wenqu-zai-fumugong', cnTitle:'文曲在父母宫：父母有才艺，家庭有艺术氛围', enTitle:'Wen Qu in Parents Palace: Artistic Parents', enDesc:'Wen Qu in Parents means artistic parents and creative family atmosphere.'},
  {slug:'ziwei-tiankui-zai-minggong', cnTitle:'天魁在命宫：贵人坐命：光明正大的好运气', enTitle:'Tian Kui in Life Palace: Open, Above-Board Good Fortune', enDesc:'Tian Kui in Life brings open, visible benefactor luck and above-board good fortune.'},
  {slug:'ziwei-tianyue-zai-minggong', cnTitle:'天钺在命宫：贵人坐命：暗中相助的好运气', enTitle:'Tian Yue in Life Palace: Hidden, Behind-the-Scenes Good Fortune', enDesc:'Tian Yue in Life brings hidden benefactor luck and behind-the-scenes assistance.'}
];

// Fix sidebar links in aux articles: ziwei-aux-stars.html -> ziwei-helper-malice-stars.html
console.log('Fixing sidebar links in aux articles...');
for (const a of auxArticles) {
  for (const dir of ['articles', 'articles/en']) {
    const filePath = `${dir}/${a.slug}.html`;
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/ziwei-aux-stars\.html/g, 'ziwei-helper-malice-stars.html');
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
console.log('Sidebar links fixed');

// 1. Update CN index
console.log('Updating CN index...');
let cnIndex = fs.readFileSync('articles/index.html', 'utf8');

// Add main star articles to 主星 section
if (!cnIndex.includes(mainStarArticles[0].slug)) {
  const h2Idx = cnIndex.indexOf('<h2>主星</h2>');
  const divIdx = cnIndex.indexOf('<div class="article-list">', h2Idx);
  const insertPos = cnIndex.indexOf('\n', divIdx) + 1;
  let cards = '';
  for (let i = 0; i < mainStarArticles.length; i++) {
    const a = mainStarArticles[i];
    const idx = String(i + 1).padStart(2, '0');
    cards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">主星</span><span><time datetime="${dateFull}">2026-08-24 10:30</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  // Update count
  const countMatch = cnIndex.substring(h2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    cnIndex = cnIndex.substring(0, h2Idx) + cnIndex.substring(h2Idx).replace(countMatch[0], `<span>${oldCount + 50} 篇</span>`);
  }
  console.log('  Main star cards added to CN index');
}

// Add aux articles to 辅煞曜 section
if (!cnIndex.includes(auxArticles[0].slug)) {
  const h2Idx = cnIndex.indexOf('<h2>辅煞曜</h2>');
  const divIdx = cnIndex.indexOf('<div class="article-list">', h2Idx);
  const insertPos = cnIndex.indexOf('\n', divIdx) + 1;
  let cards = '';
  for (let i = 0; i < auxArticles.length; i++) {
    const a = auxArticles[i];
    const idx = String(i + 1).padStart(2, '0');
    cards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">辅煞曜</span><span><time datetime="${dateFull}">2026-08-24 10:30</time></span></div>
              <h3>${a.cnTitle}</h3>
              <a class="card-link" href="${a.slug}.html">阅读全文</a>
            </div>
          </article>
`;
  }
  cnIndex = cnIndex.slice(0, insertPos) + cards + cnIndex.slice(insertPos);
  const countMatch = cnIndex.substring(h2Idx).match(/<span>(\d+) 篇<\/span>/);
  if (countMatch) {
    const oldCount = parseInt(countMatch[1]);
    cnIndex = cnIndex.substring(0, h2Idx) + cnIndex.substring(h2Idx).replace(countMatch[0], `<span>${oldCount + 50} 篇</span>`);
  }
  console.log('  Aux star cards added to CN index');
}
fs.writeFileSync('articles/index.html', cnIndex, 'utf8');

// 2. Update EN index
console.log('Updating EN index...');
let enIndex = fs.readFileSync('articles/en/index.html', 'utf8');
if (!enIndex.includes(mainStarArticles[0].slug)) {
  const listDiv = enIndex.indexOf('<div class="article-list">');
  const firstCardEnd = enIndex.indexOf('</article>', enIndex.indexOf('article-card', listDiv));
  const insertPos = enIndex.indexOf('\n', firstCardEnd) + 1;
  let enCards = '';
  const allArticles = [...mainStarArticles, ...auxArticles];
  for (let i = 0; i < allArticles.length; i++) {
    const a = allArticles[i];
    const idx = String(i + 2).padStart(2, '0');
    enCards += `          <article class="article-card" data-index="${idx}">
            <div class="card-body">
              <div class="card-meta"><span class="tag">Zi Wei Dou Shu</span><span><time datetime="${dateFull}">2026-08-24 10:30</time></span></div>
              <h3>${a.enTitle}</h3>
              <p>${a.enDesc}</p>
              <a class="card-link" href="${a.slug}.html">Read article</a>
            </div>
          </article>
`;
  }
  enIndex = enIndex.slice(0, insertPos) + enCards + enIndex.slice(insertPos);
  const countMatch = enIndex.match(/(\d+) Articles/);
  if (countMatch) {
    enIndex = enIndex.replace(countMatch[0], `${parseInt(countMatch[1]) + 100} Articles`);
  }
  fs.writeFileSync('articles/en/index.html', enIndex, 'utf8');
  console.log('  EN index updated');
}

// 3. Update topic pages
console.log('Updating topic pages...');
let mainTopic = fs.readFileSync('articles/ziwei-main-stars.html', 'utf8');
if (!mainTopic.includes(mainStarArticles[0].slug)) {
  const firstCard = mainTopic.indexOf('class="article-card"');
  const lineStart = mainTopic.lastIndexOf('\n', firstCard) + 1;
  let cards = '';
  for (const a of mainStarArticles) {
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${dateFull}">2026-08-24</time></a>\n`;
  }
  mainTopic = mainTopic.slice(0, lineStart) + cards + mainTopic.slice(lineStart);
  fs.writeFileSync('articles/ziwei-main-stars.html', mainTopic, 'utf8');
  console.log('  Main stars topic page updated');
}

let auxTopic = fs.readFileSync('articles/ziwei-helper-malice-stars.html', 'utf8');
if (!auxTopic.includes(auxArticles[0].slug)) {
  const firstCard = auxTopic.indexOf('class="article-card"');
  const lineStart = auxTopic.lastIndexOf('\n', firstCard) + 1;
  let cards = '';
  for (const a of auxArticles) {
    cards += `        <a class="article-card" href="${a.slug}.html"><h3>${a.cnTitle}</h3><time datetime="${dateFull}">2026-08-24</time></a>\n`;
  }
  auxTopic = auxTopic.slice(0, lineStart) + cards + auxTopic.slice(lineStart);
  fs.writeFileSync('articles/ziwei-helper-malice-stars.html', auxTopic, 'utf8');
  console.log('  Aux stars topic page updated');
}

// 4. Update feeds
console.log('Updating feeds...');
let cnFeed = fs.readFileSync('feed.xml', 'utf8');
if (!cnFeed.includes(mainStarArticles[0].slug)) {
  let items = '';
  for (const a of [...mainStarArticles, ...auxArticles]) {
    items += `  <item><title>${a.cnTitle}</title><link>https://yuetianai.com/articles/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/${a.slug}.html</guid><pubDate>Mon, 24 Aug 2026 10:30:00 +0800</pubDate><description><![CDATA[${a.cnTitle}]]></description></item>\n`;
  }
  cnFeed = cnFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('feed.xml', cnFeed, 'utf8');
  console.log('  CN feed updated');
}

let enFeed = fs.readFileSync('articles/en/feed.xml', 'utf8');
if (!enFeed.includes(mainStarArticles[0].slug)) {
  let items = '';
  for (const a of [...mainStarArticles, ...auxArticles]) {
    items += `  <item><title>${a.enTitle}</title><link>https://yuetianai.com/articles/en/${a.slug}.html</link><guid isPermaLink="true">https://yuetianai.com/articles/en/${a.slug}.html</guid><pubDate>Mon, 24 Aug 2026 10:30:00 +0800</pubDate><description><![CDATA[${a.enTitle}]]></description></item>\n`;
  }
  enFeed = enFeed.replace('<channel>', '<channel>\n' + items);
  fs.writeFileSync('articles/en/feed.xml', enFeed, 'utf8');
  console.log('  EN feed updated');
}

console.log('\nAll updates done.');
