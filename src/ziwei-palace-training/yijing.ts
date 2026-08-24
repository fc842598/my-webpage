export type TrainingLevel = 1 | 2 | 3;

export type YijingModuleId =
  | "trigram-symbol"
  | "trigram-nature"
  | "trigram-family"
  | "trigram-element"
  | "xiantian-position"
  | "houtian-position"
  | "hex-compose"
  | "hex-decompose"
  | "moving-line";

export type YijingModuleDefinition = {
  id: YijingModuleId;
  group: "八卦基础" | "方位次序" | "六十四卦" | "爻变进阶";
  label: string;
  mark: string;
  description: string;
};

export type Trigram = {
  index: number;
  name: string;
  pinyin: string;
  lines: [number, number, number];
  nature: string;
  family: string;
  element: string;
};

export type YijingOption = {
  id: string;
  label: string;
  subLabel?: string;
  reveal: string;
  trigramIndex?: number;
};

export type YijingVisual =
  | { kind: "trigram"; trigramIndex: number }
  | { kind: "concept"; text: string; kicker: string }
  | { kind: "bagua"; arrangement: "xiantian" | "houtian"; title: string }
  | { kind: "hexagram"; upperIndex: number; lowerIndex: number; movingLine?: number };

export type YijingQuestion = {
  prompt: string;
  hint: string;
  visual: YijingVisual;
  options: YijingOption[];
  targetIds: string[];
  answerDetail: string;
};

// 三爻按初爻到上爻保存；渲染时再反转为从上到下。
export const trigrams: Trigram[] = [
  { index: 0, name: "坤", pinyin: "kūn", lines: [0, 0, 0], nature: "地", family: "母亲", element: "土" },
  { index: 1, name: "艮", pinyin: "gèn", lines: [0, 0, 1], nature: "山", family: "少男", element: "土" },
  { index: 2, name: "坎", pinyin: "kǎn", lines: [0, 1, 0], nature: "水", family: "中男", element: "水" },
  { index: 3, name: "巽", pinyin: "xùn", lines: [0, 1, 1], nature: "风", family: "长女", element: "木" },
  { index: 4, name: "震", pinyin: "zhèn", lines: [1, 0, 0], nature: "雷", family: "长男", element: "木" },
  { index: 5, name: "离", pinyin: "lí", lines: [1, 0, 1], nature: "火", family: "中女", element: "火" },
  { index: 6, name: "兑", pinyin: "duì", lines: [1, 1, 0], nature: "泽", family: "少女", element: "金" },
  { index: 7, name: "乾", pinyin: "qián", lines: [1, 1, 1], nature: "天", family: "父亲", element: "金" },
];

export const yijingModules: YijingModuleDefinition[] = [
  { id: "trigram-symbol", group: "八卦基础", label: "卦象识别", mark: "象", description: "按从下往上的顺序观察三条爻，认出乾坤震巽坎离艮兑。" },
  { id: "trigram-nature", group: "八卦基础", label: "自然八象", mark: "物", description: "练熟乾天、坤地、震雷、巽风、坎水、离火、艮山、兑泽。" },
  { id: "trigram-family", group: "八卦基础", label: "家庭六亲", mark: "亲", description: "把八卦对应到父母与长、中、少男少女。" },
  { id: "trigram-element", group: "八卦基础", label: "五行属性", mark: "五", description: "记忆乾兑金、震巽木、坎水、离火、坤艮土。" },
  { id: "xiantian-position", group: "方位次序", label: "先天方位", mark: "先", description: "按北上南下的现代方位图，记忆先天八卦的八个位置。" },
  { id: "houtian-position", group: "方位次序", label: "后天方位", mark: "后", description: "按北上南下的现代方位图，记忆文王后天八卦方位。" },
  { id: "hex-compose", group: "六十四卦", label: "上下卦合成", mark: "合", description: "从上卦与下卦组合，辨认对应的六十四卦。" },
  { id: "hex-decompose", group: "六十四卦", label: "卦名拆解", mark: "名", description: "看到卦名或六爻卦象，拆出正确的上卦与下卦。" },
  { id: "moving-line", group: "爻变进阶", label: "动爻变卦", mark: "变", description: "识别初爻到上爻的变化，并判断变化后的卦名。" },
];

export type BaguaPosition = { direction: string; row: number; column: number };
type HexEntry = [number, string, string];
type HexTable = HexEntry[][];
type HexInfo = { number: number; name: string; fullName: string; upperIndex: number; lowerIndex: number };

export const baguaPositions: BaguaPosition[] = [
  { direction: "西北", row: 1, column: 1 },
  { direction: "北", row: 1, column: 2 },
  { direction: "东北", row: 1, column: 3 },
  { direction: "西", row: 2, column: 1 },
  { direction: "东", row: 2, column: 3 },
  { direction: "西南", row: 3, column: 1 },
  { direction: "南", row: 3, column: 2 },
  { direction: "东南", row: 3, column: 3 },
];

const baguaMaps: Record<"xiantian" | "houtian", Record<string, number>> = {
  xiantian: { 北: 0, 东北: 4, 东: 5, 东南: 6, 南: 7, 西南: 3, 西: 2, 西北: 1 },
  houtian: { 北: 2, 东北: 1, 东: 4, 东南: 3, 南: 5, 西南: 0, 西: 6, 西北: 7 },
};

const yaoLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

export function getBaguaTrigramIndex(arrangement: "xiantian" | "houtian", direction: string) {
  return baguaMaps[arrangement][direction];
}

export function hexagramLines(upperIndex: number, lowerIndex: number) {
  return [...trigrams[lowerIndex].lines, ...trigrams[upperIndex].lines];
}

const randomIndex = (length: number) => Math.floor(Math.random() * length);
const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const trigramId = (index: number) => `trigram-${index}`;
const valueId = (value: string) => `value-${value}`;

function levelHint(hint: string, level: TrainingLevel) {
  if (level === 1) return hint;
  return level === 2 ? `第2关 · 提速：${hint}` : `第3关 · 综合：${hint}`;
}

function trigramOption(trigram: Trigram, showSymbol = false): YijingOption {
  return {
    id: trigramId(trigram.index),
    label: showSymbol ? `选项 ${String.fromCharCode(65 + trigram.index)}` : trigram.name,
    subLabel: showSymbol ? undefined : trigram.pinyin,
    reveal: `${trigram.name} · ${trigram.nature} · ${trigram.family} · ${trigram.element}`,
    trigramIndex: showSymbol ? trigram.index : undefined,
  };
}

function valueOptions(values: string[]): YijingOption[] {
  return values.map((value) => ({ id: valueId(value), label: value, reveal: value }));
}

function getHexTable(): HexTable {
  const table = (window as Window & { HEX_TABLE?: HexTable }).HEX_TABLE;
  if (!table || table.length !== 8) throw new Error("Missing Yijing HEX_TABLE data");
  return table;
}

function allHexagrams(): HexInfo[] {
  return getHexTable().flatMap((row, upperIndex) => row.map((entry, lowerIndex) => ({
    number: entry[0],
    name: entry[1],
    fullName: entry[2],
    upperIndex,
    lowerIndex,
  })));
}

function randomHexagram(): HexInfo {
  const upperIndex = randomIndex(8);
  const lowerIndex = randomIndex(8);
  const entry = getHexTable()[upperIndex][lowerIndex];
  return { number: entry[0], name: entry[1], fullName: entry[2], upperIndex, lowerIndex };
}

function hexOption(hexagram: HexInfo): YijingOption {
  return {
    id: `hex-${hexagram.number}`,
    label: hexagram.fullName,
    subLabel: `第 ${hexagram.number} 卦`,
    reveal: `${hexagram.fullName} · 第${hexagram.number}卦`,
  };
}

function pairOption(hexagram: HexInfo): YijingOption {
  const upper = trigrams[hexagram.upperIndex];
  const lower = trigrams[hexagram.lowerIndex];
  return {
    id: `pair-${hexagram.upperIndex}-${hexagram.lowerIndex}`,
    label: `上${upper.name} · 下${lower.name}`,
    subLabel: `${upper.nature} / ${lower.nature}`,
    reveal: `上${upper.name}（${upper.nature}）· 下${lower.name}（${lower.nature}）`,
  };
}

function answerSet(correct: HexInfo, optionFactory: (hexagram: HexInfo) => YijingOption) {
  const distractors = shuffled(allHexagrams().filter((item) => item.number !== correct.number)).slice(0, 3);
  return shuffled([correct, ...distractors]).map(optionFactory);
}

function indexFromLines(lines: number[]) {
  return lines[0] * 4 + lines[1] * 2 + lines[2];
}

function symbolQuestion(level: TrainingLevel): YijingQuestion {
  const trigram = trigrams[randomIndex(trigrams.length)];
  const reverse = level === 3 && Math.random() < 0.5;

  if (reverse) {
    return {
      prompt: `请选出「${trigram.name}卦」的三爻卦象`,
      hint: levelHint("八个选项都按初爻到上爻辨认", level),
      visual: { kind: "concept", text: trigram.name, kicker: `${trigram.nature} · ${trigram.family}` },
      options: shuffled(trigrams).map((item) => trigramOption(item, true)),
      targetIds: [trigramId(trigram.index)],
      answerDetail: `${trigram.name} · ${trigram.nature} · ${trigram.family} · ${trigram.element}`,
    };
  }

  return {
    prompt: "请认出这个三爻卦",
    hint: levelHint("先看阴阳爻组合，再选择卦名", level),
    visual: { kind: "trigram", trigramIndex: trigram.index },
    options: (level === 1 ? trigrams : shuffled(trigrams)).map((item) => trigramOption(item)),
    targetIds: [trigramId(trigram.index)],
    answerDetail: `${trigram.name} · ${trigram.nature} · ${trigram.family} · ${trigram.element}`,
  };
}

function mappingQuestion(field: "nature" | "family", label: string, level: TrainingLevel): YijingQuestion {
  const trigram = trigrams[randomIndex(trigrams.length)];
  const value = trigram[field];
  const valueFirst = level === 1 || Math.random() < 0.55;

  if (valueFirst) {
    return {
      prompt: `「${value}」对应哪一卦？`,
      hint: levelHint(`从八卦中找到正确的${label}对应`, level),
      visual: { kind: "concept", text: value, kicker: label },
      options: (level === 1 ? trigrams : shuffled(trigrams)).map((item) => trigramOption(item)),
      targetIds: [trigramId(trigram.index)],
      answerDetail: `${trigram.name} · ${value}`,
    };
  }

  const values = shuffled([...new Set(trigrams.map((item) => item[field]))]);
  return {
    prompt: `「${trigram.name}卦」对应哪个${label}？`,
    hint: levelHint("观察卦象后作答", level),
    visual: { kind: "trigram", trigramIndex: trigram.index },
    options: valueOptions(values),
    targetIds: [valueId(value)],
    answerDetail: `${trigram.name} · ${value}`,
  };
}

function elementQuestion(level: TrainingLevel): YijingQuestion {
  if (level > 1 && Math.random() < 0.5) {
    const element = ["金", "木", "水", "火", "土"][randomIndex(5)];
    const targets = trigrams.filter((item) => item.element === element);
    return {
      prompt: `请选出全部属「${element}」的卦`,
      hint: levelHint(`共 ${targets.length} 个，可不分顺序`, level),
      visual: { kind: "concept", text: element, kicker: "五行" },
      options: shuffled(trigrams).map((item) => trigramOption(item)),
      targetIds: targets.map((item) => trigramId(item.index)),
      answerDetail: `${element}：${targets.map((item) => item.name).join("、")}`,
    };
  }

  const trigram = trigrams[randomIndex(trigrams.length)];
  return {
    prompt: `「${trigram.name}卦」五行属什么？`,
    hint: levelHint("从金木水火土中选择", level),
    visual: { kind: "trigram", trigramIndex: trigram.index },
    options: valueOptions(level === 1 ? ["金", "木", "水", "火", "土"] : shuffled(["金", "木", "水", "火", "土"])),
    targetIds: [valueId(trigram.element)],
    answerDetail: `${trigram.name} · ${trigram.element}`,
  };
}

function positionQuestion(arrangement: "xiantian" | "houtian", level: TrainingLevel): YijingQuestion {
  const title = arrangement === "xiantian" ? "先天八卦" : "后天八卦";
  const target = trigrams[randomIndex(trigrams.length)];
  const direction = Object.entries(baguaMaps[arrangement]).find(([, trigramIndex]) => trigramIndex === target.index)?.[0] ?? "北";
  const options = baguaPositions.map((position) => {
    const trigram = trigrams[getBaguaTrigramIndex(arrangement, position.direction)];
    return {
      id: `direction-${position.direction}`,
      label: position.direction,
      reveal: `${position.direction} · ${trigram.name}（${trigram.nature}）`,
    };
  });
  return {
    prompt: `请点出${title}中「${target.name}卦」的位置`,
    hint: levelHint("方位图采用现代地图方向：北在上，南在下", level),
    visual: { kind: "bagua", arrangement, title },
    options,
    targetIds: [`direction-${direction}`],
    answerDetail: `${title}：${target.name}在${direction}`,
  };
}

function composeQuestion(level: TrainingLevel): YijingQuestion {
  const hexagram = randomHexagram();
  const upper = trigrams[hexagram.upperIndex];
  const lower = trigrams[hexagram.lowerIndex];
  const prompt = level === 1
    ? `上${upper.name}（${upper.nature}）下${lower.name}（${lower.nature}），合成哪一卦？`
    : level === 2
      ? `上${upper.nature}下${lower.nature}，是哪一卦？`
      : "请根据六爻卦象辨认卦名";
  return {
    prompt,
    hint: levelHint("上卦看上三爻，下卦看下三爻", level),
    visual: { kind: "hexagram", upperIndex: hexagram.upperIndex, lowerIndex: hexagram.lowerIndex },
    options: answerSet(hexagram, hexOption),
    targetIds: [`hex-${hexagram.number}`],
    answerDetail: `${hexagram.fullName} · 第${hexagram.number}卦`,
  };
}

function decomposeQuestion(level: TrainingLevel): YijingQuestion {
  const hexagram = randomHexagram();
  const upper = trigrams[hexagram.upperIndex];
  const lower = trigrams[hexagram.lowerIndex];
  const prompt = level === 1
    ? `「${hexagram.fullName}」由哪两个经卦组成？`
    : level === 2
      ? `「${hexagram.name}卦」的上卦与下卦是？`
      : "请拆出这个六爻卦的上卦与下卦";
  return {
    prompt,
    hint: levelHint("六爻从下往上数，下三爻为下卦，上三爻为上卦", level),
    visual: { kind: "hexagram", upperIndex: hexagram.upperIndex, lowerIndex: hexagram.lowerIndex },
    options: answerSet(hexagram, pairOption),
    targetIds: [`pair-${hexagram.upperIndex}-${hexagram.lowerIndex}`],
    answerDetail: `${hexagram.fullName}：上${upper.name}（${upper.nature}）· 下${lower.name}（${lower.nature}）`,
  };
}

function movingLineQuestion(level: TrainingLevel): YijingQuestion {
  const original = randomHexagram();
  const movingLine = randomIndex(6);
  const changedLines = hexagramLines(original.upperIndex, original.lowerIndex);
  changedLines[movingLine] = changedLines[movingLine] ? 0 : 1;
  const lowerIndex = indexFromLines(changedLines.slice(0, 3));
  const upperIndex = indexFromLines(changedLines.slice(3, 6));
  const entry = getHexTable()[upperIndex][lowerIndex];
  const changed: HexInfo = { number: entry[0], name: entry[1], fullName: entry[2], upperIndex, lowerIndex };
  return {
    prompt: `「${original.fullName}」${yaoLabels[movingLine]}变化后，成为哪一卦？`,
    hint: levelHint("金色标记为动爻，只改变这一爻的阴阳", level),
    visual: { kind: "hexagram", upperIndex: original.upperIndex, lowerIndex: original.lowerIndex, movingLine },
    options: answerSet(changed, hexOption),
    targetIds: [`hex-${changed.number}`],
    answerDetail: `${original.fullName} → ${changed.fullName}`,
  };
}

export function makeYijingQuestion(moduleId: YijingModuleId, level: TrainingLevel): YijingQuestion {
  if (moduleId === "trigram-symbol") return symbolQuestion(level);
  if (moduleId === "trigram-nature") return mappingQuestion("nature", "自然象", level);
  if (moduleId === "trigram-family") return mappingQuestion("family", "家庭角色", level);
  if (moduleId === "trigram-element") return elementQuestion(level);
  if (moduleId === "xiantian-position") return positionQuestion("xiantian", level);
  if (moduleId === "houtian-position") return positionQuestion("houtian", level);
  if (moduleId === "hex-compose") return composeQuestion(level);
  if (moduleId === "hex-decompose") return decomposeQuestion(level);
  return movingLineQuestion(level);
}

export const initialYijingQuestion = makeYijingQuestion("trigram-symbol", 1);
