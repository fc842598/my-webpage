// liuyao-data.jsx — 六爻卦象数据与工具函数

const TRIGRAM_NAMES = ['坤','艮','坎','巽','震','离','兑','乾'];
const TRIGRAM_NATURE = ['地','山','水','风','雷','火','泽','天'];
const YAO_LABELS = ['初爻','二爻','三爻','四爻','五爻','上爻'];

// HEX_TABLE[upper][lower] = [序号, 卦名, 全称]
const HEX_TABLE = [
  [[2,'坤','坤为地'],[15,'谦','地山谦'],[7,'师','地水师'],[46,'升','地风升'],[24,'复','地雷复'],[36,'明夷','地火明夷'],[19,'临','地泽临'],[11,'泰','地天泰']],
  [[23,'剥','山地剥'],[52,'艮','艮为山'],[4,'蒙','山水蒙'],[18,'蛊','山风蛊'],[27,'颐','山雷颐'],[22,'贲','山火贲'],[41,'损','山泽损'],[26,'大畜','山天大畜']],
  [[8,'比','水地比'],[39,'蹇','水山蹇'],[29,'坎','坎为水'],[48,'井','水风井'],[3,'屯','水雷屯'],[63,'既济','水火既济'],[60,'节','水泽节'],[5,'需','水天需']],
  [[20,'观','风地观'],[53,'渐','风山渐'],[59,'涣','风水涣'],[57,'巽','巽为风'],[42,'益','风雷益'],[37,'家人','风火家人'],[61,'中孚','风泽中孚'],[9,'小畜','风天小畜']],
  [[16,'豫','雷地豫'],[62,'小过','雷山小过'],[40,'解','雷水解'],[32,'恒','雷风恒'],[51,'震','震为雷'],[55,'丰','雷火丰'],[54,'归妹','雷泽归妹'],[34,'大壮','雷天大壮']],
  [[35,'晋','火地晋'],[56,'旅','火山旅'],[64,'未济','火水未济'],[50,'鼎','火风鼎'],[21,'噬嗑','火雷噬嗑'],[30,'离','离为火'],[38,'睽','火泽睽'],[14,'大有','火天大有']],
  [[45,'萃','泽地萃'],[31,'咸','泽山咸'],[47,'困','泽水困'],[28,'大过','泽风大过'],[17,'随','泽雷随'],[49,'革','泽火革'],[58,'兑','兑为泽'],[43,'夬','泽天夬']],
  [[12,'否','天地否'],[33,'遁','天山遁'],[6,'讼','天水讼'],[44,'姤','天风姤'],[25,'无妄','天雷无妄'],[13,'同人','天火同人'],[10,'履','天泽履'],[1,'乾','乾为天']]
];

const YAO_TYPES = {
  6: { name: '老阴', isYin: true, changes: true },
  7: { name: '少阳', isYin: false, changes: false },
  8: { name: '少阴', isYin: true, changes: false },
  9: { name: '老阳', isYin: false, changes: true },
};

function triIdx(l0, l1, l2) { return l0 * 4 + l1 * 2 + l2; }

function getHexInfo(vals) {
  const ln = vals.map(v => YAO_TYPES[v].isYin ? 0 : 1);
  const lo = triIdx(ln[0], ln[1], ln[2]);
  const up = triIdx(ln[3], ln[4], ln[5]);
  const e = HEX_TABLE[up][lo];
  return { number: e[0], name: e[1], fullName: e[2], upper: up, lower: lo };
}

function getChangedHex(vals) {
  return getHexInfo(vals.map(v => v === 6 ? 7 : v === 9 ? 8 : v));
}

function getDynamic(vals) {
  return vals.reduce((a, v, i) => (v === 6 || v === 9) ? [...a, i] : a, []);
}

function genAIText(hex, chHex, dynYao, q) {
  const up = TRIGRAM_NATURE[hex.upper], lo = TRIGRAM_NATURE[hex.lower];
  const upN = TRIGRAM_NAMES[hex.upper], loN = TRIGRAM_NAMES[hex.lower];
  let t = `【卦象概述】\n所得卦象为${hex.fullName}（第${hex.number}卦）。上卦${upN}为${up}，下卦${loN}为${lo}。`;
  t += up === lo ? `上下同体，纯卦之象，力量集中而纯粹。` : `${up}居上而${lo}居下，两者相互作用，需审卦中各爻之动静。`;
  t += `\n\n【针对所问】\n就「${q}」而言，此卦提示：`;
  const n = hex.number;
  if (n <= 16) t += `当前形势尚在发展初期，宜静观其变，不宜急进。保持耐心，等待时机成熟。事物初生，虽有艰难，但蕴含无限可能。`;
  else if (n <= 32) t += `目前处于关键转折期，需审时度势，把握机会。顺应时势而动，可得事半功倍之效。但须谨慎行事，不可冒进。`;
  else if (n <= 48) t += `形势已经较为明朗，宜顺势而为。注意守住已有成果，稳中求进。此时最忌贪多冒进，当知足常乐。`;
  else t += `当前局面已近圆满，宜收束整理。反思过往经验，总结得失，为未来新的起点做好充分准备。`;
  if (dynYao.length > 0) {
    t += `\n\n【动爻分析】\n本卦有${dynYao.length}个动爻：${dynYao.map(i => YAO_LABELS[i]).join('、')}。动爻为卦中变化之关键，提示事态发展的方向与力量。`;
    if (chHex) t += `变卦为${chHex.fullName}，事态将由${hex.name}之象转向${chHex.name}之象，即从${up}${lo}之势演变为${TRIGRAM_NATURE[chHex.upper]}${TRIGRAM_NATURE[chHex.lower]}之格局。需顺应变化，灵活应对。`;
  } else {
    t += `\n\n【稳定之卦】\n本卦无动爻，为静卦。事态较为稳定，不会有太大变化。宜保持现状，循序渐进。`;
  }
  t += `\n\n【总结】\n综合卦象分析，建议保持内心清明，顺应自然规律。凡事以诚为本，不必过分焦虑。时机到来之时，自然水到渠成。`;
  return t;
}

Object.assign(window, {
  TRIGRAM_NAMES, TRIGRAM_NATURE, YAO_LABELS, HEX_TABLE, YAO_TYPES,
  getHexInfo, getChangedHex, getDynamic, genAIText
});
