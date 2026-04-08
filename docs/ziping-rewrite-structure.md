# 子平法重写结构清单

最后整理时间：2026-04-03

## 目标

这份文档只做一件事：

- 把当前项目里“子平法/四柱命卦/先天卦/后天卦/流年卦”相关的文件、调用链、算法分层、页面耦合点全部列清楚
- 方便下一步直接删旧逻辑、重写一套新的

这份文档不代表当前算法正确，只代表“现在代码长什么样、彼此怎么连”。

---

## 一、当前结构总览

```text
pages/chart.html
  ├─ 引入 pages/guaci-data.js
  ├─ 引入 src/ziping/tianji-bazi.js
  ├─ 引入 src/ziping/tables.js
  ├─ 引入 src/ziping/generator.js
  ├─ 引入 src/ziping/validator.js
  ├─ 引入 src/ziping/runtime.js
  └─ 引入 fixtures/ziping-golden-cases.js

src/ziping/
  ├─ tianji-bazi.js       四柱来源适配层
  ├─ tables.js            常量表
  ├─ generator.js         主算法
  ├─ runtime.js           页面运行时包装层
  └─ validator.js         黄金样本校验层

fixtures/
  └─ ziping-golden-cases.js   黄金样本

pages/
  └─ guaci-data.js        卦辞文案库（先天/后天/流年）

间接依赖
  ├─ js/vendor/lunar-javascript.js   给 tianji-bazi.js 提供 Solar/Lunar
  └─ js/vendor/iztro.min.js          页面主排盘引擎，extractPillars 有 fallback 会读它
```

---

## 二、核心文件清单

### 1. 算法主文件

#### `src/ziping/generator.js`

作用：

- 当前子平法主算法都在这里
- 负责从四柱算出：
  - 先天卦
  - 元堂爻
  - 后天卦
  - 流年卦序列
  - 小限分支

当前主要函数：

- `getSanyuan(birthYear)`
- `getJigong(birthYear, gender, isYangPerson)`
- `getRemainderDetail(sum, isHeaven)`
- `numToTrigram(sum, isHeaven, birthYear, gender, isYangPerson)`
- `hexLines6(upper, lower)`
- `flipTrigram(trigramNum, lineInTrigram)`
- `buildGua(upper, lower, isYangPerson)`
- `flipHex(gua, lineNum)`
- `getYuanTangDetail(upper, lower, hourBranch, isYangPerson)`
- `getYuanTang(upper, lower, hourBranch, isYangPerson)`
- `yingLine(lineNum)`
- `yearGanzhi(year)`
- `calcXiaoLian(birthYearBranch, gender, xuAge)`
- `computeXianTian(pillars, gender, birthYear)`
- `getLingType(monthBranch)`
- `computeHouTian(xianTian, yuanTangLine, monthBranch, warnings)`
- `buildLiuNianMap(xianTian, houTian, xianYuanTangLine, houYuanTangLine, birthYear, maxAge, gender, birthYearBranch)`
- `generate(pillars, gender, birthYear, maxAge)`

这是下一步重写时最应该整体替换的文件。

#### `src/ziping/tables.js`

作用：

- 当前算法使用的所有表驱动常量都在这里

当前内容：

- 天干配数：`STEM_NUM`
- 地支取数：`BRANCH_NUM`
- 天干序列：`STEMS`
- 地支序列：`BRANCHES`
- 八卦三爻线：`TRIGRAM_LINES`
- 5 寄宫：`JIGONG`
- 阴时/阳时分组：`YANG_HOURS`、`YIN_HOURS`
- 洛书数到卦：`LUOSHU_TO_TRIGRAM`
- 三至尊卦集合：`THREE_ZIZUN`
- 六十四卦名称：`HEX_NAME`
- 上下卦到文王卦序：`GUA_TABLE`
- 小限起点：`XIAOLIAN_MALE_START`、`XIAOLIAN_FEMALE_START`

如果重写算法表，这个文件通常也要一起重写。

### 2. 四柱来源适配

#### `src/ziping/tianji-bazi.js`

作用：

- 不是命卦算法本身
- 只是把页面输入的出生日期/真太阳时，转成“当前项目要喂给子平法的四柱”

当前主要函数：

- `resolveTimeSlot(norm)`
- `buildHourPillar(dayStem, branch)`
- `computePillarsFromSolarLib(Solar, norm)`

当前依赖：

- `window.Solar`
- 来自 `js/vendor/lunar-javascript.js`

当前职责：

- 把公历输入转成：
  - `yearStem/yearBranch`
  - `monthStem/monthBranch`
  - `dayStem/dayBranch`
  - `hourStem/hourBranch`
- 处理早子/夜子

如果下一版要保留“天纪口径四柱”，这个文件可以保留并重写。
如果下一版连四柱来源都换，则这个文件也应替换。

### 3. 页面运行时包装

#### `src/ziping/runtime.js`

作用：

- 页面不直接调 `generator.js`
- 中间走一个运行时包装层

当前函数：

- `compute(pillars, gender, birthYear, maxAge)`
- `getLastResult()`
- `runValidation(options)`

额外逻辑：

- `applyUiOverrides(result, pillars, gender, birthYear)`
- 只有 `window.__ZIPING_ENABLE_UI_OVERRIDES__ === true` 才会启用样本覆盖

如果下一版页面仍想保留“统一入口”，可以保留这个文件壳子。
如果不需要中间层，也可以一起删。

### 4. 样本校验层

#### `src/ziping/validator.js`

作用：

- 跑黄金样本
- 比对 `expected` 和当前生成结果

当前函数：

- `diffExpected(caseId, expected, result)`
- `runCase(goldenCase)`
- `validate(cases, options)`

如果你下一版还要保留“样本驱动校验”，这个文件可以重写后继续用。
如果不需要校验器，也可以删。

### 5. 黄金样本库

#### `fixtures/ziping-golden-cases.js`

作用：

- 放当前子平法样本
- 包含书本样本和天纪软件样本

当前内容类型：

- 书本规则样本
- 天纪软件样本
- `verified: true` 的硬校验样本

它不是运行必需，但现在：

- `runtime.runValidation()` 依赖它
- 历史上 `applyUiOverrides()` 也会读取它

如果你下一版要重新建立样本库，这个文件建议整个重建。

### 6. 页面上的卦辞文案库

#### `pages/guaci-data.js`

作用：

- 不是算法
- 是卦名对应的文案库

当前数据结构：

- `GUACI_DATA[卦名].xian`
- `GUACI_DATA[卦名].hou`
- `GUACI_DATA[卦名].liu`

如果只是重写算法，这个文件不一定要删。
如果连卦名映射和文案体系也要重做，可以一起重整。

---

## 三、页面接线点

核心页面文件：

#### `pages/chart.html`

这个文件是当前子平法在前端的总接线点。

### 1. script 引入区

顶部直接引入了这些子平法相关脚本：

- `pages/guaci-data.js`
- `src/ziping/tianji-bazi.js`
- `src/ziping/tables.js`
- `src/ziping/generator.js`
- `src/ziping/validator.js`
- `src/ziping/runtime.js`
- `fixtures/ziping-golden-cases.js`

如果你下一步要“整包拆掉旧子平法”，这里就是第一刀。

### 2. 四柱来源入口

关键函数：

- `extractPillars(chart)`

当前逻辑：

1. 优先用 `TianjiBazi.computePillarsFromSolarLib(Solar, _chartInputs.norm)`
2. 如果失败，再 fallback 到 `iztro` 返回的 `chart/rawDates/chineseDate`

这意味着：

- 当前子平法四柱并不是完全独立
- 它仍然和页面主排盘引擎 `iztro` 有 fallback 耦合

如果你下一版想彻底去耦，应该把这里改成单来源。

### 3. 页面级状态

当前页面里保存子平法状态的变量：

- `_fcActiveTab`
- `_fcActiveAge`
- `_fcBirthYear`
- `_fcXiaoLianBranch`
- `_xianTianGuaResult`
- `_houTianGuaResult`
- `_liunianGuaResult`
- `_liunianSeq`
- `_birthPillarsCache`
- `_birthGender`

这些都在 `chart.html` 里，不在 `src/ziping/` 内。

### 4. 页面小限计算

页面里还有一套自己的小限函数：

- `calcXiaoLianBranch(yearBranch, gender, xuAge)`
- `_fcResolveXiaoLianBranch(age)`
- `_fcResolveDisplayedXiaoLianBranch(age)`
- `_fcComputeXiaoLian()`

注意：

- `generator.js` 里也有 `calcXiaoLian`
- 页面层和算法层都有小限逻辑
- 这部分是典型重复耦合点

如果你要重写子平法，建议下一版只保留一套来源。

### 5. 页面实际调用子平法的总入口

关键位置：

- `const _zipingResult = ZipingRuntime.compute(_birthPillarsCache, gender, _fcBirthYear);`

随后页面从结果里读取：

- `_zipingResult.xiantian`
- `_zipingResult.houtian`
- `_zipingResult.liunianMap`
- `_zipingResult.debug`

再写回：

- `#fc-c-xiantian`
- `#fc-c-houtian`
- `#fc-c-liunian`
- 以及 hexagram 图形区、流年年份滚动条、AI 批命上下文

这意味着：

- 页面和算法结果对象字段名已经强耦合
- 如果下一版结果结构改名，`chart.html` 这一段必须一起改

### 6. 页面上直接依赖流年序列的区域

当前页面至少这些地方会用到 `_liunianSeq / _liunianGuaResult`：

- 中央面板“流年卦”
- 下方流年年份横向滚动条
- 卦象绘制区
- 小限高亮宫位
- AI 批命调试台上下文
- AI 批命文案说明

也就是说，重写时不只是“把 generate 改掉”，还要一起处理这几个渲染点。

### 7. 页面上的调试入口

当前页面末尾还有：

- `ZipingRuntime.runValidation()`

也就是浏览器控制台可以直接跑样本校验。

如果要彻底拆旧逻辑，这个入口也要一起删或替换。

---

## 四、当前算法链路

下面是“现在代码实际上怎么跑”的顺序。

### 链路 A：四柱生成

输入：

- 页面表单日期
- 真太阳时
- 性别

过程：

1. `pages/chart.html -> extractPillars(chart)`
2. `extractPillars()` 优先调用 `src/ziping/tianji-bazi.js`
3. `tianji-bazi.js` 通过 `Solar` 算出四柱
4. 如果这条链失败，再 fallback 到 `iztro` 返回的四柱/中文日期

输出：

- `pillars = { yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, hourStem, hourBranch }`

### 链路 B：先天卦

文件：

- `src/ziping/generator.js`

过程：

1. `computeXianTian(pillars, gender, birthYear)`
2. 天干地支先转数
3. 奇数求天数，偶数求地数
4. 天数走 `mod 25`
5. 地数走 `mod 30`
6. 余数再转先天八卦
7. 再根据 `isYangPerson` 决定上下卦顺序
8. `buildGua()` 产出先天卦对象

输出：

- `xiantian`
- `debug`

### 链路 C：元堂爻

文件：

- `src/ziping/generator.js`

过程：

1. `getYuanTangDetail(upper, lower, hourBranch, isYangPerson)`
2. 先把先天卦转成六爻
3. 再按：
   - 阳爻池
   - 阴爻池
   - 上六时 / 下六时
   - 命阴阳
4. 选出当前元堂爻

输出：

- `yuanTangLine`
- 以及一些 debug 字段

### 链路 D：后天卦

文件：

- `src/ziping/generator.js`

过程：

1. `computeHouTian(xianTian, yuanTangLine, monthBranch, warnings)`
2. 普通卦：
   - 元堂爻变
   - 外卦入内、内卦出外
3. 三至尊卦：
   - 使用 `THREE_ZIZUN_HOUTIAN_RULES`
   - 按月令阴阳取特殊映射

输出：

- `houtian`

### 链路 E：流年卦

文件：

- `src/ziping/generator.js`

过程：

1. `buildLiuNianMap(...)`
2. 以元堂爻为起点
3. 先跑先天期
4. 再跑后天期
5. 每条爻按阴爻 6 年、阳爻 9 年推进
6. 每年记录：
   - 卦名
   - 卦号
   - 上下卦
   - 所处 period
   - lineNum
   - lineType
   - 年干支
   - 小限分支

输出：

- `liunianMap`

### 链路 F：页面展示

文件：

- `pages/chart.html`

过程：

1. `ZipingRuntime.compute(...)`
2. 页面取：
   - `xiantian`
   - `houtian`
   - `liunianMap`
3. 页面写入中央面板
4. 页面渲染卦象图
5. 页面渲染流年年份滚动条
6. 页面渲染小限高亮
7. 页面把当前流年卦喂给 AI 批命上下文

---

## 五、真正会影响重写的耦合点

这些是你下一步删旧逻辑时最容易漏的地方。

### 1. `chart.html` 不是只调用一次

子平法结果不只是中央面板在用，还连着：

- 中央面板卦名
- 卦象可视化
- 流年滚动条
- 小限宫位高亮
- AI 调试台上下文
- AI 文案生成

### 2. 小限逻辑有双份

一份在：

- `src/ziping/generator.js`

另一份在：

- `pages/chart.html`

如果下一版不统一，小限还会继续前后不一致。

### 3. 四柱来源是双通道

当前 `extractPillars()`：

- 先走 `TianjiBazi`
- 再 fallback `iztro`

如果你要彻底重写，最好改成单通道。

### 4. `runtime.js` 仍带 UI override 能力

虽然默认关闭，但代码还在：

- `applyUiOverrides()`
- `__ZIPING_ENABLE_UI_OVERRIDES__`

如果你要绝对干净的新子平法，这块建议一起删除。

### 5. 样本和算法是绑死的

`validator.js` 默认会假设 `generator.js` 产出的字段结构如下：

- `debug`
- `xiantian`
- `houtian`
- `liunianMap`

如果下一版返回结构改了，`validator.js` 和 `fixtures/ziping-golden-cases.js` 也要一起改。

---

## 六、外部参考件

这些不是运行时文件，但当前子平法重写时你很可能还会继续参考。

### 项目外参考

- [C:\Users\1\Desktop\tianji_bazi_spec.md](C:/Users/1/Desktop/tianji_bazi_spec.md)
- [C:\Users\1\Desktop\tianji_bazi_reference.py](C:/Users/1/Desktop/tianji_bazi_reference.py)

作用：

- 天纪四柱口径说明
- 日期、月柱、日柱、夜子处理参考

### 项目内参考性文本

- `tmp/pdfs/sizhuminggua.txt`

作用：

- 当前仓库里收着的一份四柱命卦文本资料
- 更偏文案/卦辞参考，不是运行代码

注意：

- `tmp/` 是临时目录，不建议把新算法正式实现放这里

---

## 七、如果下一步要“整包删了重写”，建议这样切

### A. 可以整包替换的核心

建议直接替换：

- `src/ziping/generator.js`
- `src/ziping/tables.js`
- `src/ziping/runtime.js`
- `src/ziping/validator.js`
- `fixtures/ziping-golden-cases.js`

理由：

- 这是现有子平法的完整算法层和校验层

### B. 建议保留但可能重写内部实现

建议保留壳子，内部再决定是否重写：

- `src/ziping/tianji-bazi.js`

理由：

- 它承担的是“四柱来源适配”
- 不一定等于命卦算法

### C. 页面必须同步改的点

删除或替换旧子平法时，`pages/chart.html` 至少这些位置要同步处理：

- script 引入区
- `extractPillars(chart)`
- `_xianTianGuaResult`
- `_houTianGuaResult`
- `_liunianGuaResult`
- `_liunianSeq`
- 小限相关函数
- `ZipingRuntime.compute(...)` 调用处
- `ZipingRuntime.runValidation()` 调用处

### D. 可单独决定是否保留

- `pages/guaci-data.js`

理由：

- 它只是卦辞文案库
- 是否保留取决于下一版是否继续复用当前卦名和文案映射

---

## 八、建议的重写切法

如果你下一步真要删旧重写，我建议按这个顺序，不要一把全拆。

### 第一步

先保留页面 UI，只拔掉旧算法入口：

- 保留 `chart.html` 展示壳子
- 新建一个新的最小 runtime 接口
- 先只返回：
  - 四柱
  - 先天卦
  - 后天卦
  - 当前年龄流年卦

### 第二步

再补流年全序列：

- 1-100 岁
- 小限
- 元堂 debug

### 第三步

最后再恢复样本校验：

- 先 3 条 verified
- 再 7 条 verified
- 再扩展更多样本

这样切，风险最小。

---

## 九、最小删除边界

如果你下一步想让我“先清旧子平法，再建新版”，最小清理集合建议是：

```text
src/ziping/generator.js
src/ziping/tables.js
src/ziping/runtime.js
src/ziping/validator.js
fixtures/ziping-golden-cases.js
```

然后在 `pages/chart.html` 里同步删掉：

- 对这些文件的 `<script>` 引入
- `ZipingRuntime.compute(...)`
- `ZipingRuntime.runValidation()`
- 旧 `_liunianSeq` 读法
- 页面层重复小限逻辑

---

## 十、当前结论

现在的子平法不是只有一个文件。

它实际上是 5 层：

1. 四柱来源层
2. 常量表层
3. 主算法层
4. 页面运行时包装层
5. 样本校验层

真正重写时，最容易漏的是：

- `chart.html` 里的页面级小限和流年渲染
- `extractPillars()` 的 fallback
- `guaci-data.js` 的文案依赖

如果下一步继续，我建议直接从这份文档出发，先做：

- “旧子平法拆除清单”
- 然后再建一份新的最小接口文档
