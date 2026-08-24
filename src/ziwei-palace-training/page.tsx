"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  baguaPositions,
  getBaguaTrigramIndex,
  hexagramLines,
  initialYijingQuestion,
  makeYijingQuestion,
  trigrams,
  yijingModules,
  type TrainingLevel,
  type YijingModuleId,
  type YijingQuestion,
} from "./yijing";

const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const gridSlots = [
  { row: 4, column: 3 }, { row: 4, column: 2 }, { row: 4, column: 1 },
  { row: 3, column: 1 }, { row: 2, column: 1 }, { row: 1, column: 1 },
  { row: 1, column: 2 }, { row: 1, column: 3 }, { row: 1, column: 4 },
  { row: 2, column: 4 }, { row: 3, column: 4 }, { row: 4, column: 4 },
];

const hours = ["23–01时", "01–03时", "03–05时", "05–07时", "07–09时", "09–11时", "11–13时", "13–15时", "15–17时", "17–19时", "19–21时", "21–23时"];
const zodiac = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const meridians = ["胆经", "肝经", "肺经", "大肠经", "胃经", "脾经", "心经", "小肠经", "膀胱经", "肾经", "心包经", "三焦经"];
const lunarMonths = ["十一月", "十二月", "正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月"];
const directions = ["正北", "东北偏北", "东北偏东", "正东", "东南偏东", "东南偏南", "正南", "西南偏南", "西南偏西", "正西", "西北偏西", "西北偏北"];
const elements = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];
const yinYang = ["阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴"];
const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const stemElements = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
const stemYinYang = ["阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴"];
// 《天纪02》的身体、体型盘位：人体正面朝向看盘者，故盘左为身体右侧。
// 子、丑两格原课明确说“这两个同样算”：男看膀胱，女看子宫、卵巢，不硬拆成两个单一器官。
const bodyRegions = ["男·膀胱／女·子宫卵巢", "男·膀胱／女·子宫卵巢", "右足", "右胁", "右胸", "右肩", "头部", "头部", "左肩", "左胸", "左胁", "左足"];
const bodyRegionGroups = [
  { label: "右肩", targets: [5] }, { label: "头部", targets: [6, 7] }, { label: "左肩", targets: [8] },
  { label: "右胸", targets: [4] }, { label: "左胸", targets: [9] }, { label: "右胁", targets: [3] },
  { label: "左胁", targets: [10] }, { label: "右足", targets: [2] }, { label: "男·膀胱／女·子宫卵巢", targets: [0, 1] },
  { label: "左足", targets: [11] },
];

const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "官禄", "田宅", "福德", "父母"];
const palaceMeanings = ["自我与性格", "手足与同辈", "婚姻与伴侣", "子女与晚辈", "财务与赚钱", "健康与体质", "外出与环境", "朋友与部属", "事业与工作", "家宅与不动产", "精神与享受", "父母与长辈"];

const mod = (value: number) => ((value % 12) + 12) % 12;
const shuffle = (items: number[]) => [...items].sort(() => Math.random() - 0.5);
const randomIndex = (length: number) => Math.floor(Math.random() * length);

type DifficultyLevel = TrainingLevel;
type ModuleProgress = { level: DifficultyLevel; correct: number; recentMs: number[] };
type Discipline = "ziwei" | "yijing";

type ModuleId =
  | "position" | "hours" | "zodiac" | "meridian" | "months" | "directions" | "body-map" | "stem-order" | "stem-attributes"
  | "elements" | "yin-yang" | "clash" | "harmony"
  | "palace-order" | "palace-meaning" | "palace-opposite" | "palace-trine";

type ModuleDefinition = {
  id: ModuleId;
  group: "基础对应" | "地支关系" | "紫微宫位";
  label: string;
  mark: string;
  description: string;
};

const modules: ModuleDefinition[] = [
  { id: "position", group: "基础对应", label: "地支格位", mark: "位", description: "在十二格盘面中定位十二地支。" },
  { id: "hours", group: "基础对应", label: "十二时辰", mark: "时", description: "双向记忆每个地支对应的两个小时。" },
  { id: "zodiac", group: "基础对应", label: "十二生肖", mark: "肖", description: "练熟子鼠、丑牛到亥猪的固定对应。" },
  { id: "meridian", group: "基础对应", label: "经络时辰", mark: "经", description: "记忆传统子午流注中的十二时辰与经络。" },
  { id: "months", group: "基础对应", label: "农历月建", mark: "月", description: "寅为正月，依序记到丑为十二月。" },
  { id: "directions", group: "基础对应", label: "十二方位", mark: "向", description: "从正北的子到十二地支的细分方位。" },
  { id: "body-map", group: "基础对应", label: "身体体型盘", mark: "身", description: "依《天纪02》原课：中宫为脐，记忆头肩、胸胁、双足，以及子丑两格的男女身体对应。" },
  { id: "stem-order", group: "基础对应", label: "十天干", mark: "干", description: "通过上一个、下一个与连续顺排，熟记十天干循环顺序。" },
  { id: "stem-attributes", group: "基础对应", label: "天干属性", mark: "属", description: "双向练习十天干的阴阳与五行属性。" },
  { id: "elements", group: "地支关系", label: "五行归属", mark: "五", description: "一次选出同属金、木、水、火、土的地支。" },
  { id: "yin-yang", group: "地支关系", label: "阴阳属性", mark: "阴", description: "区分六阳支与六阴支。" },
  { id: "clash", group: "地支关系", label: "六冲", mark: "冲", description: "记住子午、丑未、寅申等六组对冲。" },
  { id: "harmony", group: "地支关系", label: "三合局", mark: "合", description: "练习申子辰、亥卯未、寅午戌、巳酉丑。" },
  { id: "palace-order", group: "紫微宫位", label: "十二宫序", mark: "宫", description: "命宫定点后，逆时针找兄弟、夫妻到父母宫。" },
  { id: "palace-meaning", group: "紫微宫位", label: "宫位含义", mark: "义", description: "把事业、财务、健康等主题对应到正确宫位。" },
  { id: "palace-opposite", group: "紫微宫位", label: "六组对宫", mark: "对", description: "记忆命迁、兄友、夫官、子田、财福、疾父。" },
  { id: "palace-trine", group: "紫微宫位", label: "三方四正", mark: "三", description: "由本宫找出两个三合宫与一个对宫。" },
];

const levelNames: Record<DifficultyLevel, string> = { 1: "认识", 2: "提速", 3: "自由练" };
const yijingLevelNames: Record<DifficultyLevel, string> = { 1: "识形", 2: "提速", 3: "综合练" };
const levelTargets: Record<1 | 2, number> = { 1: 20, 2: 40 };
const speedTargets: Record<1 | 2, number> = { 1: 5000, 2: 3500 };

function freshModuleProgress(): Record<ModuleId, ModuleProgress> {
  return Object.fromEntries(modules.map((item) => [item.id, { level: 1, correct: 0, recentMs: [] }])) as unknown as Record<ModuleId, ModuleProgress>;
}

function freshYijingProgress(): Record<YijingModuleId, ModuleProgress> {
  return Object.fromEntries(yijingModules.map((item) => [item.id, { level: 1, correct: 0, recentMs: [] }])) as unknown as Record<YijingModuleId, ModuleProgress>;
}

type Question = {
  prompt: string;
  hint: string;
  targets: number[];
  ordered: boolean;
  cellLabels: string[];
  revealLabels: string[];
  targetLabels: string[];
  sourceLabels: Record<number, string>;
  inactiveCells?: number[];
};

const emptyLabels = () => Array(12).fill("");

const initialQuestion: Question = {
  prompt: "请点出「子」的位置",
  hint: "空盘盲点，点击后才揭晓",
  targets: [0],
  ordered: true,
  cellLabels: Array(12).fill(""),
  revealLabels: branches,
  targetLabels: ["子"],
  sourceLabels: {},
};

function withLevelHint(question: Question, level: DifficultyLevel): Question {
  if (level === 1) return question;
  return {
    ...question,
    hint: level === 2 ? `第2关 · 提速：${question.hint}` : "第3关 · 自由练习，凭第一反应作答",
  };
}

const mappingDirectionQueues: Record<string, boolean[]> = {};

function drawTopicFirst(label: string) {
  if (!mappingDirectionQueues[label]?.length) {
    mappingDirectionQueues[label] = [true, true, true, true, true, true, true, false, false, false]
      .sort(() => Math.random() - 0.5);
  }
  return mappingDirectionQueues[label].pop() ?? true;
}

function mappingQuestion(values: string[], label: string, level: DifficultyLevel): Question {
  const index = randomIndex(12);
  const topicFirst = drawTopicFirst(label);
  return withLevelHint({
    prompt: topicFirst ? `「${values[index]}」对应哪个地支？` : `「${branches[index]}」对应哪个${label}？`,
    hint: topicFirst ? "点击盘面上的正确地支" : `点击盘面上的正确${label}`,
    targets: [index],
    ordered: false,
    cellLabels: topicFirst ? branches : values,
    revealLabels: branches.map((branch, item) => `${branch} · ${values[item]}`),
    targetLabels: [branches[index]],
    sourceLabels: {},
  }, level);
}

const tenChoiceLabels = (items: string[]) => [...items, "", ""];
const tenInactiveCells = [10, 11];
const stemProperties = heavenlyStems.map((_, index) => `${stemYinYang[index]}${stemElements[index]}`);
const stemAnswerLabels = heavenlyStems.map((stem, index) => `${stem} · ${stemProperties[index]}`);

function bodyMapQuestion(level: DifficultyLevel): Question {
  const topicFirst = drawTopicFirst("人体盘位");
  if (topicFirst) {
    const group = bodyRegionGroups[randomIndex(bodyRegionGroups.length)];
    return withLevelHint({
      prompt: `请点出人体的「${group.label}」位于哪些地支格位`,
      hint: group.targets.length > 1 ? `原课按这 ${group.targets.length} 格同看；人体正面朝向你` : "人体正面朝向你，盘左是身体右侧",
      targets: group.targets,
      ordered: false,
      cellLabels: branches,
      revealLabels: branches.map((branch, index) => `${branch} · ${bodyRegions[index]}`),
      targetLabels: group.targets.map((index) => branches[index]),
      sourceLabels: {},
    }, level);
  }

  // 反向题也必须保持人体图的固定空间关系，不能把部位当成普通选项依次塞进十二格。
  // 子丑原课同看、显示相同，反向题会产生两个同名选项，因此留在正向多选题中练习。
  const branchIndex = 2 + randomIndex(10);
  return withLevelHint({
    prompt: `身体体型盘中，「${branches[branchIndex]}」对应哪里？`,
    hint: "人体图保持正确方位：头在上、足在下，盘左是身体右侧",
    targets: [branchIndex],
    ordered: false,
    cellLabels: bodyRegions,
    revealLabels: branches.map((branch, index) => `${branch} · ${bodyRegions[index]}`),
    targetLabels: [bodyRegions[branchIndex]],
    sourceLabels: {},
  }, level);
}

function stemOrderQuestion(level: DifficultyLevel): Question {
  const count = level;
  const source = randomIndex(10);
  const forward = drawTopicFirst("十天干顺序");
  const direction = forward ? 1 : -1;
  const targets = Array.from({ length: count }, (_, index) => (source + direction * (index + 1) + 10) % 10);
  const stepLabels = targets.map((_, index) => count === 1 ? (forward ? "下一个" : "上一个") : `第${index + 1}步`);
  return withLevelHint({
    prompt: count === 1
      ? `「${heavenlyStems[source]}」的${forward ? "下一个" : "上一个"}天干是？`
      : `从「${heavenlyStems[source]}」${forward ? "之后" : "之前"}开始，依次${forward ? "顺排" : "倒排"} ${count} 个天干`,
    hint: count === 1 ? "根据甲乙丙丁的循环顺序作答" : `连续作答 ${count} 个，顺序不能错；癸后回到甲`,
    targets,
    ordered: true,
    cellLabels: tenChoiceLabels(heavenlyStems),
    revealLabels: tenChoiceLabels(stemAnswerLabels),
    targetLabels: stepLabels,
    sourceLabels: { [source]: `${heavenlyStems[source]} · 起点` },
    inactiveCells: tenInactiveCells,
  }, level);
}

function stemAttributeQuestion(level: DifficultyLevel): Question {
  const topicFirst = drawTopicFirst("天干属性");
  if (topicFirst) {
    const askElement = Math.random() < 0.65;
    const value = askElement ? ["木", "火", "土", "金", "水"][randomIndex(5)] : (Math.random() < 0.5 ? "阳" : "阴");
    const values = askElement ? stemElements : stemYinYang;
    const targets = values.map((item, index) => item === value ? index : -1).filter((index) => index >= 0);
    return withLevelHint({
      prompt: `请选出全部属「${value}」的天干`,
      hint: `共 ${targets.length} 个，可不分顺序`,
      targets,
      ordered: false,
      cellLabels: tenChoiceLabels(heavenlyStems),
      revealLabels: tenChoiceLabels(stemAnswerLabels),
      targetLabels: targets.map((index) => heavenlyStems[index]),
      sourceLabels: {},
      inactiveCells: tenInactiveCells,
    }, level);
  }

  const index = randomIndex(10);
  return withLevelHint({
    prompt: `天干「${heavenlyStems[index]}」的阴阳与五行是？`,
    hint: "点击正确的组合属性",
    targets: [index],
    ordered: false,
    cellLabels: tenChoiceLabels(stemProperties),
    revealLabels: tenChoiceLabels(stemAnswerLabels),
    targetLabels: [stemProperties[index]],
    sourceLabels: {},
    inactiveCells: tenInactiveCells,
  }, level);
}

function palaceByBranch(lifeIndex: number) {
  return branches.map((_, branchIndex) => palaceNames[mod(lifeIndex - branchIndex)]);
}

function makeQuestion(moduleId: ModuleId, lifeIndex: number, level: DifficultyLevel): Question {
  if (moduleId === "position") {
    const targets = shuffle(Array.from({ length: 12 }, (_, index) => index)).slice(0, level);
    return withLevelHint({
      prompt: `请点出「${branches[targets[0]]}」的位置`,
      hint: "空盘盲点，点击后才揭晓",
      targets,
      ordered: true,
      cellLabels: emptyLabels(),
      revealLabels: branches,
      targetLabels: targets.map((index) => branches[index]),
      sourceLabels: {},
    }, level);
  }
  if (moduleId === "hours") return mappingQuestion(hours, "时间", level);
  if (moduleId === "zodiac") return mappingQuestion(zodiac, "生肖", level);
  if (moduleId === "meridian") return mappingQuestion(meridians, "经络", level);
  if (moduleId === "months") return mappingQuestion(lunarMonths, "月份", level);
  if (moduleId === "directions") return mappingQuestion(directions, "方位", level);
  if (moduleId === "body-map") return bodyMapQuestion(level);
  if (moduleId === "stem-order") return stemOrderQuestion(level);
  if (moduleId === "stem-attributes") return stemAttributeQuestion(level);

  if (moduleId === "elements") {
    const element = ["金", "木", "水", "火", "土"][randomIndex(5)];
    const targets = elements.map((item, index) => item === element ? index : -1).filter((index) => index >= 0);
    return withLevelHint({ prompt: `请选出所有属「${element}」的地支`, hint: `共 ${targets.length} 个，可不分顺序`, targets, ordered: false, cellLabels: branches, revealLabels: branches.map((branch, index) => `${branch} · ${elements[index]}`), targetLabels: targets.map((index) => branches[index]), sourceLabels: {} }, level);
  }
  if (moduleId === "yin-yang") {
    const nature = Math.random() >= 0.5 ? "阳" : "阴";
    const targets = yinYang.map((item, index) => item === nature ? index : -1).filter((index) => index >= 0);
    return withLevelHint({ prompt: `请选出全部「${nature}支」`, hint: "六个答案，可不分顺序", targets, ordered: false, cellLabels: branches, revealLabels: branches.map((branch, index) => `${branch} · ${yinYang[index]}`), targetLabels: targets.map((index) => branches[index]), sourceLabels: {} }, level);
  }
  if (moduleId === "clash") {
    const source = randomIndex(12);
    const target = mod(source + 6);
    return withLevelHint({ prompt: `与「${branches[source]}」相冲的是？`, hint: "六冲在盘面上彼此相对", targets: [target], ordered: false, cellLabels: branches, revealLabels: branches.map((branch, index) => `${branch}${index === target ? " · 相冲" : ""}`), targetLabels: [branches[target]], sourceLabels: { [source]: `${branches[source]} · 本支` } }, level);
  }
  if (moduleId === "harmony") {
    const groups = [
      { name: "水局", targets: [8, 0, 4] },
      { name: "木局", targets: [11, 3, 7] },
      { name: "火局", targets: [2, 6, 10] },
      { name: "金局", targets: [5, 9, 1] },
    ];
    const group = groups[randomIndex(groups.length)];
    return withLevelHint({ prompt: `请选出「${group.name}」的三合地支`, hint: "共三个答案，可不分顺序", targets: group.targets, ordered: false, cellLabels: branches, revealLabels: branches.map((branch, index) => group.targets.includes(index) ? `${branch} · ${group.name}` : branch), targetLabels: group.targets.map((index) => branches[index]), sourceLabels: {} }, level);
  }

  const palaces = palaceByBranch(lifeIndex);
  if (moduleId === "palace-order") {
    const palaceIndex = 1 + randomIndex(11);
    const target = mod(lifeIndex - palaceIndex);
    return withLevelHint({ prompt: `请点出「${palaceNames[palaceIndex]}」的位置`, hint: `命宫定在「${branches[lifeIndex]}」，宫序逆时针`, targets: [target], ordered: false, cellLabels: emptyLabels(), revealLabels: palaces, targetLabels: [palaceNames[palaceIndex]], sourceLabels: { [lifeIndex]: "命宫" } }, level);
  }
  if (moduleId === "palace-meaning") {
    const palaceIndex = randomIndex(12);
    const target = mod(lifeIndex - palaceIndex);
    return withLevelHint({ prompt: `「${palaceMeanings[palaceIndex]}」对应哪一宫？`, hint: "点击盘面上的宫名", targets: [target], ordered: false, cellLabels: palaces, revealLabels: palaces.map((palace, index) => `${palace} · ${palaceMeanings[mod(lifeIndex - index)]}`), targetLabels: [palaceNames[palaceIndex]], sourceLabels: {} }, level);
  }
  if (moduleId === "palace-opposite") {
    const sourcePalace = randomIndex(12);
    const targetPalace = mod(sourcePalace + 6);
    const sourceBranch = mod(lifeIndex - sourcePalace);
    const targetBranch = mod(lifeIndex - targetPalace);
    return withLevelHint({ prompt: `「${palaceNames[sourcePalace]}」的对宫在哪里？`, hint: "回忆六组固定对宫，再在盘面定位", targets: [targetBranch], ordered: false, cellLabels: emptyLabels(), revealLabels: palaces, targetLabels: [palaceNames[targetPalace]], sourceLabels: { [sourceBranch]: palaceNames[sourcePalace] } }, level);
  }

  const sourcePalace = randomIndex(12);
  const relatedPalaces = [mod(sourcePalace + 4), mod(sourcePalace + 8), mod(sourcePalace + 6)];
  const sourceBranch = mod(lifeIndex - sourcePalace);
  const targets = relatedPalaces.map((palace) => mod(lifeIndex - palace));
  return withLevelHint({ prompt: `点出「${palaceNames[sourcePalace]}」的三方四正`, hint: "不含本宫：两个三合宫，加一个对宫", targets, ordered: false, cellLabels: emptyLabels(), revealLabels: palaces, targetLabels: relatedPalaces.map((index) => palaceNames[index]), sourceLabels: { [sourceBranch]: `${palaceNames[sourcePalace]} · 本宫` } }, level);
}

function TrigramLines({ index, compact = false }: { index: number; compact?: boolean }) {
  const trigram = trigrams[index];
  return (
    <span className={`trigram-lines ${compact ? "compact" : ""}`} aria-label={`${trigram.name}卦`}>
      {[...trigram.lines].reverse().map((line, lineIndex) => (
        <i className={line ? "yang" : "yin"} key={`${trigram.name}-${lineIndex}`} aria-hidden="true">
          {!line && <><b /><b /></>}
        </i>
      ))}
    </span>
  );
}

function HexagramLines({ upperIndex, lowerIndex, movingLine }: { upperIndex: number; lowerIndex: number; movingLine?: number }) {
  const lines = hexagramLines(upperIndex, lowerIndex).map((line, bottomIndex) => ({ line, bottomIndex })).reverse();
  return (
    <div className="hexagram-visual" aria-label={`上${trigrams[upperIndex].name}下${trigrams[lowerIndex].name}`}>
      <span className="hexagram-lines">
        {lines.map(({ line, bottomIndex }) => (
          <i className={`${line ? "yang" : "yin"} ${movingLine === bottomIndex ? "moving" : ""}`} key={bottomIndex} aria-hidden="true">
            {!line && <><b /><b /></>}
            {movingLine === bottomIndex && <em>动</em>}
          </i>
        ))}
      </span>
      <small>上{trigrams[upperIndex].name}（{trigrams[upperIndex].nature}） · 下{trigrams[lowerIndex].name}（{trigrams[lowerIndex].nature}）</small>
    </div>
  );
}

export default function Home() {
  const [discipline, setDiscipline] = useState<Discipline>("ziwei");
  const [moduleId, setModuleId] = useState<ModuleId>("position");
  const [yijingModuleId, setYijingModuleId] = useState<YijingModuleId>("trigram-symbol");
  const [lifeIndex, setLifeIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<Record<ModuleId, ModuleProgress>>(freshModuleProgress);
  const [yijingProgress, setYijingProgress] = useState<Record<YijingModuleId, ModuleProgress>>(freshYijingProgress);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [solved, setSolved] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [yijingQuestion, setYijingQuestion] = useState<YijingQuestion>(initialYijingQuestion);
  const [yijingSolved, setYijingSolved] = useState<string[]>([]);
  const [yijingPicked, setYijingPicked] = useState<string | null>(null);
  const [yijingFeedback, setYijingFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const pendingTimer = useRef<number | null>(null);
  const questionStartedAt = useRef(0);
  const boardRef = useRef<HTMLElement | null>(null);

  const activeModule = modules.find((item) => item.id === moduleId) ?? modules[0];
  const activeYijingModule = yijingModules.find((item) => item.id === yijingModuleId) ?? yijingModules[0];
  const activeProgress = discipline === "ziwei" ? moduleProgress[moduleId] : yijingProgress[yijingModuleId];
  const groupedModules = useMemo(() => ["基础对应", "地支关系", "紫微宫位"].map((group) => ({ group, items: modules.filter((item) => item.group === group) })), []);
  const groupedYijingModules = useMemo(() => ["八卦基础", "方位次序", "六十四卦", "爻变进阶"].map((group) => ({ group, items: yijingModules.filter((item) => item.group === group) })), []);
  const activeLabel = discipline === "ziwei" ? activeModule.label : activeYijingModule.label;
  const activeDescription = discipline === "ziwei" ? activeModule.description : activeYijingModule.description;
  const activeLevelName = discipline === "ziwei" ? levelNames[activeProgress.level] : yijingLevelNames[activeProgress.level];
  const isPalaceModule = discipline === "ziwei" && moduleId.startsWith("palace-");
  const isStemModule = discipline === "ziwei" && (moduleId === "stem-order" || moduleId === "stem-attributes");
  const boardNote = discipline === "ziwei" && moduleId === "body-map"
    ? "《天纪02》身体体型盘：人体正面朝向你，盘左为身体右侧；中宫为脐；子丑两格同看"
    : isStemModule ? "甲乙丙丁戊己庚辛壬癸是十天干；两格留空不参与作答" : null;
  const currentTarget = question.ordered ? question.targets[solved.length] : question.targets.find((target) => !solved.includes(target));
  const prompt = moduleId === "position" && currentTarget !== undefined ? `请点出「${branches[currentTarget]}」的位置` : question.prompt;
  const recentAverage = activeProgress.recentMs.length ? activeProgress.recentMs.reduce((sum, item) => sum + item, 0) / activeProgress.recentMs.length : null;
  const upgradeLevel = activeProgress.level === 1 || activeProgress.level === 2 ? activeProgress.level : null;
  const levelTarget = upgradeLevel ? levelTargets[upgradeLevel] : null;
  const speedTarget = upgradeLevel ? speedTargets[upgradeLevel] : null;
  const levelStart = activeProgress.level === 1 ? 0 : activeProgress.level === 2 ? 20 : 40;
  const levelProgress = levelTarget ? Math.min(100, ((activeProgress.correct - levelStart) / (levelTarget - levelStart)) * 100) : 100;
  const remainingLabel = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const yijingPickedOption = yijingQuestion.options.find((item) => item.id === yijingPicked);
  const yijingPickedReveal = yijingPickedOption?.reveal ?? "";
  const baguaArrangement = yijingQuestion.visual.kind === "bagua" ? yijingQuestion.visual.arrangement : "xiantian";

  useEffect(() => {
    const savedCorrect = Number(window.localStorage.getItem("ziwei-correct-count") ?? 0);
    const savedBest = Number(window.localStorage.getItem("ziwei-best-streak") ?? 0);
    const nextProgress = freshModuleProgress();
    const nextYijingProgress = freshYijingProgress();
    try {
      const savedProgress = JSON.parse(window.localStorage.getItem("ziwei-module-progress-v1") ?? "{}");
      modules.forEach(({ id }) => {
        const saved = savedProgress[id];
        if (!saved) return;
        const level = saved.level === 2 || saved.level === 3 ? saved.level : 1;
        nextProgress[id] = {
          level,
          correct: Math.max(0, Number(saved.correct) || 0),
          recentMs: Array.isArray(saved.recentMs) ? saved.recentMs.filter((item: unknown) => typeof item === "number").slice(-5) : [],
        };
      });
    } catch {
      // 损坏的本机记录直接从第一关重新开始。
    }
    try {
      const savedProgress = JSON.parse(window.localStorage.getItem("yijing-module-progress-v1") ?? "{}");
      yijingModules.forEach(({ id }) => {
        const saved = savedProgress[id];
        if (!saved) return;
        const level = saved.level === 2 || saved.level === 3 ? saved.level : 1;
        nextYijingProgress[id] = {
          level,
          correct: Math.max(0, Number(saved.correct) || 0),
          recentMs: Array.isArray(saved.recentMs) ? saved.recentMs.filter((item: unknown) => typeof item === "number").slice(-5) : [],
        };
      });
    } catch {
      // 易经练习记录损坏时仅重置易经模块，不影响紫微进度。
    }
    const restoreTimer = window.setTimeout(() => {
      setCorrectCount(savedCorrect);
      setBest(savedBest);
      setModuleProgress(nextProgress);
      setYijingProgress(nextYijingProgress);
      setQuestion(makeQuestion("position", 0, nextProgress.position.level));
      setYijingQuestion(makeYijingQuestion("trigram-symbol", nextYijingProgress["trigram-symbol"].level));
      questionStartedAt.current = performance.now();
      setStatsLoaded(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!statsLoaded) return;
    window.localStorage.setItem("ziwei-correct-count", String(correctCount));
    window.localStorage.setItem("ziwei-best-streak", String(best));
    window.localStorage.setItem("ziwei-module-progress-v1", JSON.stringify(moduleProgress));
    window.localStorage.setItem("yijing-module-progress-v1", JSON.stringify(yijingProgress));
  }, [best, correctCount, moduleProgress, statsLoaded, yijingProgress]);

  useEffect(() => {
    if (activeProgress.level !== 3 || durationSeconds === 0 || sessionEnded || showAnswers) return;
    const countdownTimer = window.setTimeout(() => {
      if (remainingSeconds <= 1) {
        clearTimer();
        setRemainingSeconds(0);
        setPicked(null);
        setFeedback(null);
        setSessionEnded(true);
      } else {
        setRemainingSeconds(remainingSeconds - 1);
      }
    }, 1000);
    return () => window.clearTimeout(countdownTimer);
  }, [activeProgress.level, durationSeconds, remainingSeconds, sessionEnded, showAnswers]);

  useEffect(() => () => {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
  }, []);

  function clearTimer() {
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    pendingTimer.current = null;
  }

  function resetRound(nextModule = moduleId, nextLife = lifeIndex, nextLevel = moduleProgress[nextModule].level) {
    clearTimer();
    setQuestion(makeQuestion(nextModule, nextLife, nextLevel));
    setSolved([]);
    setPicked(null);
    setFeedback(null);
    setShowAnswers(false);
    questionStartedAt.current = performance.now();
  }

  function resetYijingRound(nextModule = yijingModuleId, nextLevel = yijingProgress[nextModule].level) {
    clearTimer();
    setYijingQuestion(makeYijingQuestion(nextModule, nextLevel));
    setYijingSolved([]);
    setYijingPicked(null);
    setYijingFeedback(null);
    setShowAnswers(false);
    questionStartedAt.current = performance.now();
  }

  function focusBoardOnMobile() {
    if (!window.matchMedia("(max-width: 800px)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => boardRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }));
  }

  function selectDiscipline(nextDiscipline: Discipline) {
    if (nextDiscipline === discipline) return;
    setDiscipline(nextDiscipline);
    setDurationSeconds(0);
    setRemainingSeconds(0);
    setSessionEnded(false);
    if (nextDiscipline === "ziwei") resetRound(moduleId, lifeIndex, moduleProgress[moduleId].level);
    else resetYijingRound(yijingModuleId, yijingProgress[yijingModuleId].level);
    focusBoardOnMobile();
  }

  function selectModule(nextModule: ModuleId) {
    setModuleId(nextModule);
    setDurationSeconds(0);
    setRemainingSeconds(0);
    setSessionEnded(false);
    resetRound(nextModule, lifeIndex, moduleProgress[nextModule].level);
    focusBoardOnMobile();
  }

  function selectYijingModule(nextModule: YijingModuleId) {
    setYijingModuleId(nextModule);
    setDurationSeconds(0);
    setRemainingSeconds(0);
    setSessionEnded(false);
    resetYijingRound(nextModule, yijingProgress[nextModule].level);
    focusBoardOnMobile();
  }

  function chooseLife(nextLife: number) {
    setLifeIndex(nextLife);
    resetRound(moduleId, nextLife, activeProgress.level);
    focusBoardOnMobile();
  }

  function startPractice(seconds: number) {
    setDurationSeconds(seconds);
    setRemainingSeconds(seconds);
    setSessionEnded(false);
    if (discipline === "ziwei") resetRound(moduleId, lifeIndex, activeProgress.level);
    else resetYijingRound(yijingModuleId, activeProgress.level);
    focusBoardOnMobile();
  }

  function toggleAnswers() {
    const nextValue = !showAnswers;
    setShowAnswers(nextValue);
    if (!nextValue) questionStartedAt.current = performance.now();
  }

  function nextProgressAfterCorrect(current: ModuleProgress, elapsed: number): ModuleProgress {
    const correct = current.correct + 1;
    const recentMs = [...current.recentMs, elapsed].slice(-5);
    const currentUpgradeLevel = current.level === 1 || current.level === 2 ? current.level : null;
    if (currentUpgradeLevel) {
      const average = recentMs.reduce((sum, item) => sum + item, 0) / recentMs.length;
      if (correct >= levelTargets[currentUpgradeLevel] && recentMs.length === 5 && average <= speedTargets[currentUpgradeLevel]) {
        return { level: (currentUpgradeLevel + 1) as DifficultyLevel, correct, recentMs: [] };
      }
    }
    return { ...current, correct, recentMs };
  }

  function answer(index: number) {
    if (feedback || solved.includes(index) || sessionEnded || showAnswers || question.inactiveCells?.includes(index)) return;
    const expected = question.ordered ? index === currentTarget : question.targets.includes(index);
    setPicked(index);
    setFeedback(expected ? "correct" : "wrong");

    if (!expected) {
      setStreak(0);
      pendingTimer.current = window.setTimeout(() => {
        setPicked(null);
        setFeedback(null);
      }, 760);
      return;
    }

    const nextSolved = [...solved, index];
    const nextCorrect = correctCount + 1;
    const nextStreak = streak + 1;
    const elapsed = Math.max(0, performance.now() - questionStartedAt.current);
    const nextModuleProgress = nextProgressAfterCorrect(activeProgress, elapsed);
    setSolved(nextSolved);
    setCorrectCount(nextCorrect);
    setStreak(nextStreak);
    setBest((value) => Math.max(value, nextStreak));
    setModuleProgress((current) => ({ ...current, [moduleId]: nextModuleProgress }));

    const roundComplete = nextSolved.length === question.targets.length;
    pendingTimer.current = window.setTimeout(() => {
      if (roundComplete) {
        setQuestion(makeQuestion(moduleId, lifeIndex, nextModuleProgress.level));
        setSolved([]);
        setShowAnswers(false);
      }
      setPicked(null);
      setFeedback(null);
      questionStartedAt.current = performance.now();
    }, roundComplete ? 520 : 360);
  }

  function answerYijing(optionId: string) {
    if (yijingFeedback || yijingSolved.includes(optionId) || sessionEnded || showAnswers) return;
    const expected = yijingQuestion.targetIds.includes(optionId);
    setYijingPicked(optionId);
    setYijingFeedback(expected ? "correct" : "wrong");

    if (!expected) {
      setStreak(0);
      pendingTimer.current = window.setTimeout(() => {
        setYijingPicked(null);
        setYijingFeedback(null);
      }, 760);
      return;
    }

    const nextSolved = [...yijingSolved, optionId];
    const nextCorrect = correctCount + 1;
    const nextStreak = streak + 1;
    const elapsed = Math.max(0, performance.now() - questionStartedAt.current);
    const nextModuleProgress = nextProgressAfterCorrect(activeProgress, elapsed);
    setYijingSolved(nextSolved);
    setCorrectCount(nextCorrect);
    setStreak(nextStreak);
    setBest((value) => Math.max(value, nextStreak));
    setYijingProgress((current) => ({ ...current, [yijingModuleId]: nextModuleProgress }));

    const roundComplete = nextSolved.length === yijingQuestion.targetIds.length;
    pendingTimer.current = window.setTimeout(() => {
      if (roundComplete) {
        setYijingQuestion(makeYijingQuestion(yijingModuleId, nextModuleProgress.level));
        setYijingSolved([]);
        setShowAnswers(false);
      }
      setYijingPicked(null);
      setYijingFeedback(null);
      questionStartedAt.current = performance.now();
    }, roundComplete ? 520 : 360);
  }

  function clearProgress() {
    setStreak(0);
    if (discipline === "ziwei") {
      setModuleProgress((current) => ({ ...current, [moduleId]: { level: 1, correct: 0, recentMs: [] } }));
    } else {
      setYijingProgress((current) => ({ ...current, [yijingModuleId]: { level: 1, correct: 0, recentMs: [] } }));
    }
    setDurationSeconds(0);
    setRemainingSeconds(0);
    setSessionEnded(false);
    if (discipline === "ziwei") resetRound(moduleId, lifeIndex, 1);
    else resetYijingRound(yijingModuleId, 1);
  }

  const pickedReveal = picked === null ? "" : question.revealLabels[picked];

  return (
    <main className="app-shell">
      <div className="paper-texture" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="返回阅天首页">
          <span className="brand-seal">{discipline === "ziwei" ? "斗" : "易"}</span>
          <span><strong>术数记忆库</strong><small>紫微 · 易经 · 八卦</small></span>
        </a>
        <nav className="topbar-links" aria-label="训练场导航">
          <a href="/articles/">学习紫微</a>
          <a href="/pages/mingbook-onepage.html">免费排盘</a>
        </nav>
        <div className="scoreboard" aria-label="训练记录">
          <span>累计答对 <b>{correctCount}</b></span><i />
          <span>连对 <b>×{streak}</b></span><i />
          <span>最佳 <b>{best}</b></span>
        </div>
      </header>

      <section className="intro-strip">
        <div><p className="eyebrow">从固定对应开始，练到第一反应</p><h1>选一个体系，<em>马上开练。</em></h1></div>
      </section>

      <nav className="discipline-switch" aria-label="选择训练体系">
        <span>训练体系</span>
        <button aria-pressed={discipline === "ziwei"} className={discipline === "ziwei" ? "active" : ""} type="button" onClick={() => selectDiscipline("ziwei")}>
          <strong>紫微十二格</strong><small>{modules.length} 项</small>
        </button>
        <button aria-pressed={discipline === "yijing"} className={discipline === "yijing" ? "active" : ""} type="button" onClick={() => selectDiscipline("yijing")}>
          <strong>易经八卦</strong><small>{yijingModules.length} 项</small>
        </button>
        <div className="learning-path">{discipline === "ziwei" ? "定位 → 对宫 → 三方四正" : "认形 → 记象 → 定位 → 合卦 → 变卦"}</div>
      </nav>

      <section className="trainer-layout" id="trainer">
        <aside className="library-panel">
          <div className="library-heading"><span>{discipline === "ziwei" ? "训练目录" : "易经练习"}</span><strong>共 {discipline === "ziwei" ? modules.length : yijingModules.length} 项</strong></div>
          {discipline === "ziwei" ? groupedModules.map(({ group, items }) => (
              <div className="module-group" key={group}>
                {group !== "基础对应" && <h2>{group}</h2>}
                <div className="module-list">
                  {items.map((item) => (
                    <button className={moduleId === item.id ? "active" : ""} key={item.id} type="button" onClick={() => selectModule(item.id)}>
                      <span>{item.mark}</span><strong>{item.label}</strong><em>{moduleProgress[item.id].level}</em>
                    </button>
                  ))}
                </div>
              </div>
            )) : groupedYijingModules.map(({ group, items }) => (
              <div className="module-group" key={group}>
                <h2>{group}</h2>
                <div className="module-list">
                  {items.map((item) => (
                    <button className={yijingModuleId === item.id ? "active" : ""} key={item.id} type="button" onClick={() => selectYijingModule(item.id)}>
                      <span>{item.mark}</span><strong>{item.label}</strong><em>{yijingProgress[item.id].level}</em>
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="active-module-card">
            <span>当前训练</span>
            <strong>{activeLabel}</strong>
            <p>{activeDescription}</p>
          </div>

          {isPalaceModule && (
            <div className="life-picker">
              <div><span>命宫落点</span><strong>{branches[lifeIndex]}</strong></div>
              <div className="life-grid">
                {branches.map((branch, index) => <button className={lifeIndex === index ? "active" : ""} key={branch} type="button" onClick={() => chooseLife(index)}>{branch}</button>)}
              </div>
            </div>
          )}

          <div className="level-card">
            <div><span>当前主题难度</span><strong>第 {activeProgress.level} 关 · {activeLevelName}</strong></div>
            <div className="level-track"><i style={{ width: `${levelProgress}%` }} /></div>
            {levelTarget && speedTarget ? (
              <small>
                {activeProgress.correct < levelTarget ? `再答对 ${levelTarget - activeProgress.correct} 次` : "次数已达标"}
                {` · 最近5次平均需≤${(speedTarget / 1000).toFixed(1)}秒`}
                {recentAverage !== null && `（当前 ${(recentAverage / 1000).toFixed(1)}秒）`}
              </small>
            ) : <small>最高关已解锁，不再升级，可自由选择练习时长。</small>}
          </div>

          {activeProgress.level === 3 && (
            <div className="practice-duration">
              <div><span>自由练习时长</span><strong>{durationSeconds === 0 ? "不限时" : sessionEnded ? "已完成" : remainingLabel}</strong></div>
              <div>
                {[{ label: "不限时", value: 0 }, { label: "3分钟", value: 180 }, { label: "5分钟", value: 300 }, { label: "10分钟", value: 600 }].map((item) => (
                  <button className={durationSeconds === item.value ? "active" : ""} key={item.value} type="button" onClick={() => startPractice(item.value)}>{item.label}</button>
                ))}
              </div>
            </div>
          )}
          <button className="reset-button" type="button" onClick={clearProgress}>重置当前主题进度</button>
        </aside>

        <section className="board-stage" ref={boardRef} aria-live="polite">
          {discipline === "ziwei" ? (
            <>
              <div className="grid-chart">
                <div className="center-prompt">
                  {sessionEnded ? (
                    <>
                      <span>第 3 关 · 本轮结束</span>
                      <h2>练习完成</h2>
                      <p>{activeLabel}已完成本次限时训练，成绩已经保存在本机。</p>
                      <button className="restart-session" type="button" onClick={() => startPractice(durationSeconds)}>再练一轮</button>
                    </>
                  ) : (
                    <>
                      <span>第 {activeProgress.level} 关</span>
                      <h2>{prompt}</h2>
                      <p>{question.hint}</p>
                      {activeProgress.level === 3 && durationSeconds > 0 && <div className="countdown">本轮剩余 <b>{remainingLabel}</b></div>}
                      {question.ordered && question.targets.length > 1 && (
                        <div className="target-sequence">
                          {question.targetLabels.map((label, index) => <b className={index < solved.length ? "done" : index === solved.length ? "current" : ""} key={`${label}-${index}`}>{label}</b>)}
                        </div>
                      )}
                      {!question.ordered && question.targets.length > 1 && <div className="target-progress">已找到 <b>{solved.length}</b> / {question.targets.length}</div>}
                      <button className={`answer-guide-button ${showAnswers ? "active" : ""}`} type="button" disabled={Boolean(feedback)} onClick={toggleAnswers}>
                        {showAnswers ? "收起答案，继续作答" : "查看全部答案"}
                      </button>
                      <div className={`instant-feedback ${feedback ?? "idle"}`}>
                        {feedback === "correct" ? `正确 · ${pickedReveal}` : feedback === "wrong" ? `这里是「${pickedReveal}」，再试一次` : showAnswers ? "答案已展开，收起后重新计时" : "点击十二格作答，完成后自动换题"}
                      </div>
                    </>
                  )}
                </div>

                {branches.map((branch, index) => {
                  const slot = gridSlots[index];
                  const sourceLabel = question.sourceLabels[index];
                  const isSolved = solved.includes(index);
                  const isPicked = picked === index;
                  const isWrong = feedback === "wrong" && isPicked;
                  const isInactive = question.inactiveCells?.includes(index) ?? false;
                  const isAnswerKey = showAnswers && question.targets.includes(index);
                  const reveal = showAnswers || isSolved || isPicked;
                  const visibleLabel = reveal ? question.revealLabels[index] : sourceLabel || question.cellLabels[index];
                  return (
                    <button
                      aria-label={`盘面第 ${index + 1} 格${visibleLabel ? `，${visibleLabel}` : "，空格"}`}
                      className={`grid-cell ${visibleLabel ? "has-label" : "is-blank"} ${sourceLabel ? "is-source" : ""} ${isInactive ? "is-inactive" : ""} ${showAnswers ? "is-guide" : ""} ${isAnswerKey ? "is-answer-key" : ""} ${isSolved ? "is-solved" : ""} ${isWrong ? "is-wrong" : ""}`}
                      key={branch}
                      style={{ gridRow: slot.row, gridColumn: slot.column }}
                      type="button"
                      disabled={sessionEnded || isInactive}
                      onClick={() => answer(index)}
                    >
                      {visibleLabel ? <strong>{visibleLabel}</strong> : <span aria-hidden="true" />}
                      {isWrong && <small>你点中了这里</small>}
                      {isSolved && !isWrong && <small>正确</small>}
                      {isAnswerKey && !isSolved && <small>本题答案</small>}
                      {isPicked && feedback && <span className={`answer-burst ${feedback}`} aria-hidden="true">{feedback === "correct" ? "✓" : "×"}</span>}
                    </button>
                  );
                })}
              </div>
              {boardNote && <div className="board-note"><span />{boardNote}</div>}
            </>
          ) : (
            <>
              <div className="yijing-question-card">
                {sessionEnded ? (
                  <div className="yijing-finished">
                    <span>第 3 关 · 本轮结束</span>
                    <h2>练习完成</h2>
                    <p>{activeLabel}已完成本次限时训练，成绩已经保存在本机。</p>
                    <button className="restart-session" type="button" onClick={() => startPractice(durationSeconds)}>再练一轮</button>
                  </div>
                ) : (
                  <>
                    <div className="yijing-question-meta"><b>第 {activeProgress.level} 关 · {activeLevelName}</b><span>{activeLabel}</span></div>
                    <div className="yijing-prompt">
                      <h2>{yijingQuestion.prompt}</h2>
                      <p>{yijingQuestion.hint}</p>
                      {activeProgress.level === 3 && durationSeconds > 0 && <div className="countdown">本轮剩余 <b>{remainingLabel}</b></div>}
                    </div>

                    <div className={`yijing-visual ${yijingQuestion.visual.kind}`}>
                      {yijingQuestion.visual.kind === "trigram" && (
                        <div><TrigramLines index={yijingQuestion.visual.trigramIndex} /><small>从下往上读爻</small></div>
                      )}
                      {yijingQuestion.visual.kind === "concept" && (
                        <div className="concept-visual"><span>{yijingQuestion.visual.kicker}</span><strong>{yijingQuestion.visual.text}</strong></div>
                      )}
                      {yijingQuestion.visual.kind === "hexagram" && (
                        <HexagramLines lowerIndex={yijingQuestion.visual.lowerIndex} movingLine={yijingQuestion.visual.movingLine} upperIndex={yijingQuestion.visual.upperIndex} />
                      )}
                      {yijingQuestion.visual.kind === "bagua" && (
                        <div className="bagua-board">
                          <div className="bagua-center"><strong>{yijingQuestion.visual.title}</strong><small>北上南下</small></div>
                          {baguaPositions.map((position) => {
                            const optionId = `direction-${position.direction}`;
                            const trigramIndex = getBaguaTrigramIndex(baguaArrangement, position.direction);
                            const isSolved = yijingSolved.includes(optionId);
                            const isPicked = yijingPicked === optionId;
                            const isWrong = yijingFeedback === "wrong" && isPicked;
                            const isAnswerKey = showAnswers && yijingQuestion.targetIds.includes(optionId);
                            const reveal = showAnswers || isSolved || isPicked;
                            return (
                              <button
                                aria-label={reveal ? `${position.direction}，${trigrams[trigramIndex].name}卦` : position.direction}
                                className={`${isSolved ? "is-solved" : ""} ${isWrong ? "is-wrong" : ""} ${isAnswerKey ? "is-answer-key" : ""}`}
                                disabled={sessionEnded || showAnswers}
                                key={position.direction}
                                style={{ gridRow: position.row, gridColumn: position.column }}
                                type="button"
                                onClick={() => answerYijing(optionId)}
                              >
                                <span>{position.direction}</span>
                                {reveal && <strong>{trigrams[trigramIndex].name}</strong>}
                                {reveal && <small>{trigrams[trigramIndex].nature}</small>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {yijingQuestion.targetIds.length > 1 && <div className="target-progress">已找到 <b>{yijingSolved.length}</b> / {yijingQuestion.targetIds.length}</div>}
                    {yijingQuestion.visual.kind !== "bagua" && (
                      <div className="yijing-options">
                        {yijingQuestion.options.map((option) => {
                          const isSolved = yijingSolved.includes(option.id);
                          const isPicked = yijingPicked === option.id;
                          const isWrong = yijingFeedback === "wrong" && isPicked;
                          const isAnswerKey = showAnswers && yijingQuestion.targetIds.includes(option.id);
                          const reveal = showAnswers || isSolved || isPicked;
                          return (
                            <button
                              aria-label={reveal ? option.reveal : option.label}
                              className={`${isSolved ? "is-solved" : ""} ${isWrong ? "is-wrong" : ""} ${isAnswerKey ? "is-answer-key" : ""}`}
                              disabled={sessionEnded || showAnswers}
                              key={option.id}
                              type="button"
                              onClick={() => answerYijing(option.id)}
                            >
                              {option.trigramIndex !== undefined && <TrigramLines compact index={option.trigramIndex} />}
                              <strong>{reveal && option.trigramIndex !== undefined ? trigrams[option.trigramIndex].name : option.label}</strong>
                              {(reveal ? option.reveal : option.subLabel) && <small>{reveal ? option.reveal : option.subLabel}</small>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button className={`answer-guide-button ${showAnswers ? "active" : ""}`} type="button" disabled={Boolean(yijingFeedback)} onClick={toggleAnswers}>
                      {showAnswers ? "收起答案，继续作答" : "查看全部答案"}
                    </button>
                    <div className={`instant-feedback ${yijingFeedback ?? "idle"}`}>
                      {yijingFeedback === "correct" ? `正确 · ${yijingQuestion.answerDetail}` : yijingFeedback === "wrong" ? `这里是「${yijingPickedReveal}」，再试一次` : showAnswers ? "答案已展开，收起后重新计时" : "选择答案，完成后自动换题"}
                    </div>
                  </>
                )}
              </div>
              <div className="board-note"><span />{yijingQuestion.visual.kind === "bagua" ? "方位图采用现代地图方向：北在上，南在下。" : yijingQuestion.visual.kind === "hexagram" ? "六爻从下往上数：下三爻为下卦，上三爻为上卦。" : "三爻均按初爻到上爻理解；先练确定对应，再进入六十四卦与动爻。"}</div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
