export type TrainingLevel = 1 | 2 | 3;

export type YijingModuleId =
  | "trigram-symbol"
  | "trigram-nature"
  | "trigram-family"
  | "trigram-element";

export type YijingModuleDefinition = {
  id: YijingModuleId;
  group: "八卦基础";
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
  | { kind: "concept"; text: string; kicker: string };

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
];

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

export function makeYijingQuestion(moduleId: YijingModuleId, level: TrainingLevel): YijingQuestion {
  if (moduleId === "trigram-symbol") return symbolQuestion(level);
  if (moduleId === "trigram-nature") return mappingQuestion("nature", "自然象", level);
  if (moduleId === "trigram-family") return mappingQuestion("family", "家庭角色", level);
  return elementQuestion(level);
}

export const initialYijingQuestion = makeYijingQuestion("trigram-symbol", 1);
