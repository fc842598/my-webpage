# AI中医体质分析专题实测审计

日期：2026-06-29  
范围：`https://yuetianai.com/yl.html` 的首页、自评、报告、追问、会员入口。  
方式：浏览器自动化实测 3 轮，保存 16 张截图和状态数据。  
截图目录：`docs/health-audit/screenshots/`  
状态数据：`docs/health-audit/evidence.json`

## 5 个用户角色

1. 忙碌上班族：想快速完成自评，马上看到结论。
2. 中老年或父母用户：不熟悉网页交互，需要按钮和状态非常清楚。
3. 健康焦虑用户：可能输入明显不适，系统要及时提示就医。
4. 回访用户：上次填过，希望知道是继续上次还是重新测。
5. 付费意向用户：想确认会员权益、额度、价格和支付方式。

## 3 轮实测路径

### 第 1 轮：移动端新用户完整流程

步骤：
1. 进入首页：`#home`，截图 `r1-01-mobile-home-fresh.png`。
2. 点击开始自评：进入 `#assessment`，初始显示 `0/8`，截图 `r1-02-mobile-assessment-initial.png`。
3. 点击第一个选项：进度变 `1/8`，截图 `r1-03-first-option-selected.png`。
4. 完成 8 类：进度变 `8/8`，按钮变“生成体质报告”，截图 `r1-04-mobile-assessment-complete.png`。
5. 生成报告：进入 `#report`，截图 `r1-05-mobile-report.png`。
6. 进入追问：`#chat`，截图 `r1-06-mobile-chat-before-ask.png`。
7. 发送“睡眠先调什么？”：接口返回 DeepSeek 健康回答，额度变“剩余 19”，截图 `r1-07-mobile-chat-after-ask.png`。
8. 进入会员页：`#member`，截图 `r1-08-mobile-member.png`。

健康度：主流程能走通，移动端没有横向溢出；但报告生成状态和回访状态需要修。

### 第 2 轮：移动端回访用户复现 8/8

步骤：
1. 完成过一次后回到自评页：仍显示 `8/8`，截图 `r2-01-mobile-return-assessment-persisted.png`。
2. 点击重新自评：恢复 `0/8`，截图 `r2-02-mobile-after-reset.png`。
3. 跳到腰腿类目并选一项：显示 `1/8`，截图 `r2-03-mobile-mid-category-one-selected.png`。

健康度：能重置，但“上次结果保留”没有解释，用户会以为页面一直显示错。

### 第 3 轮：桌面端直接跳页、急症追问、PayPal 金额

步骤：
1. 桌面首页：截图 `r3-01-desktop-home.png`。
2. 未自评直接打开报告：显示示例报告，截图 `r3-02-desktop-report-example-empty.png`。
3. 未自评直接打开追问：默认带入“平和倾向”，截图 `r3-03-desktop-chat-empty-context.png`。
4. 输入“胸痛呼吸困难怎么办”：返回及时就医提示，截图 `r3-04-desktop-chat-urgent-reply.png`。
5. 会员页切 PayPal：金额显示 `$2.99`，按钮同步 `$2.99`，截图 `r3-05-desktop-member-paypal-selected.png`。

健康度：支付金额和急症兜底正常；但未自评时仍显示默认报告/默认上下文，容易误导。

## 发现的问题与未来修正点

| 编号 | 链接 | 位置 | 问题描述 | 影响角色 | 未来修正点 | 证据 |
|---|---|---|---|---|---|---|
| H-01 | `https://yuetianai.com/yl.html#assessment` | 自评页顶部进度和底部进度条 | 回访后一直显示 `8/8`。技术上是本地保存了上次 selections，但页面没有说明“这是上次结果”。 | 回访用户、中老年用户 | 增加“已恢复上次自评”状态条，并把主按钮改成“查看上次报告 / 重新自评”。 | `r2-01-mobile-return-assessment-persisted.png` |
| H-02 | `https://yuetianai.com/yl.html#assessment` | 自评完成但未点生成时 | 选满 8 类后，内部 `reportState` 已经变成“已生成你的体质自评报告”，但用户还没点“生成体质报告”。 | 忙碌上班族、回访用户 | 拆分 `assessmentCompleted` 和 `reportGenerated` 两个状态；只有点击生成后才进入“已生成”。 | `evidence.json` 中 `r1-04-mobile-assessment-complete` |
| H-03 | `https://yuetianai.com/yl.html#report` | 报告页默认状态 | 未完成自评也可以直接打开“报告示例”，页面展示 84 分和平和倾向，容易被误解成个人结果。 | 新用户、中老年用户 | 未自评时改为空状态：提示“完成 8 类后生成你的报告”，示例报告必须明确标注为示例并弱化分数。 | `r3-02-desktop-report-example-empty.png` |
| H-04 | `https://yuetianai.com/yl.html#chat` | 追问页上下文 | 未完成自评也可以直接进入追问，并默认显示“平和倾向、健康值 84分”。这会让用户以为 AI 已经了解自己。 | 健康焦虑用户、新用户 | 追问页未自评时先显示“请先完成体质自评”，聊天仍可问急症，但不带默认体质上下文。 | `r3-03-desktop-chat-empty-context.png` |
| H-05 | `https://yuetianai.com/yl.html#chat` | AI 回答内容 | 普通健康追问中出现“入睡困难与气虚、阳虚有关”这类较确定表达，容易像诊断。 | 健康焦虑用户 | 后端中医提示词加强软化：改为“从你填写的信息看，可能呈现某种倾向”，避免确定因果和诊断式措辞。 | `r1-07-mobile-chat-after-ask.png` |
| H-06 | `https://yuetianai.com/yl.html#chat` | 移动端额度胶囊 | “免费 20条/天 · 剩余 19”在手机上换行，视觉有点挤。 | 付费意向用户、移动用户 | 手机端压缩成“余 19/20”或放到标题下方，避免胶囊换行。 | `r1-07-mobile-chat-after-ask.png` |
| H-07 | `https://yuetianai.com/yl.html#assessment` | 重新自评入口 | 回访 `8/8` 时，“重新自评”是弱文本按钮，用户不容易发现怎么清空。 | 回访用户、中老年用户 | 在 8/8 回访态给两个并列主操作：“查看报告”“重新测一次”。 | `r2-01-mobile-return-assessment-persisted.png` |
| H-08 | `https://yuetianai.com/yl.html#home` | 桌面首页 | 桌面端仍是单个手机框居中，两侧空白很大，像手机预览而不是桌面产品页。 | 桌面用户、付费意向用户 | 桌面首页改成左侧产品价值+右侧报告视觉，或在右侧增加“示例报告/会员权益”模块。 | `r3-01-desktop-home.png` |
| H-09 | `https://yuetianai.com/yl.html#member` | 会员页 | 会员页权益能看懂，PayPal 金额也正确；但“阅天综合会员”与健康权益之间缺少一句“同一会员也服务其它阅天功能”。 | 付费意向用户 | 加一条短说明：开通后使用阅天体系统一会员权益，健康专题内享完整报告与 100 条追问。 | `r1-08-mobile-member.png` |

## 已确认正常的点

- 新用户初始自评显示 `0/8`，不是一开始就错。
- 点击选项后进度能从 `0/8` 到 `1/8`，再到 `8/8`。
- 点击“重新自评”后能恢复 `0/8`。
- 移动端和桌面端均无横向溢出。
- 健康追问接口已返回实际模型内容，额度会从 20 变为剩余 19。
- 急症类输入会返回及时就医提示。
- PayPal 选中后价格显示 `$2.99`，按钮也同步 `$2.99`。
- 未发现“命理/算命/排盘”文案串场。

## 优先级建议

1. 先修 H-01、H-02：把 `8/8` 回访态和“生成报告”状态分开，这是当前最容易让用户觉得页面坏了的点。
2. 再修 H-03、H-04：未自评时不要默认给个人报告和个人体质上下文。
3. 再修 H-05：中医模型表达更保守，降低合规风险。
4. 最后修 H-06 到 H-09：主要是展示和转化优化。

## 截图证据索引

- 第 1 轮移动端新用户：`r1-01-mobile-home-fresh.png` 到 `r1-08-mobile-member.png`
- 第 2 轮移动端回访用户：`r2-01-mobile-return-assessment-persisted.png` 到 `r2-03-mobile-mid-category-one-selected.png`
- 第 3 轮桌面端检查：`r3-01-desktop-home.png` 到 `r3-05-desktop-member-paypal-selected.png`

## 审计限制

- 本次没有创建真实支付订单，只检查了会员页、支付方式切换和金额显示。
- 本次用浏览器自动化控制页面，不是人工长期使用后的留存测试。
- 可见截图不能证明完整 WCAG 合规，只能发现明显的视觉、状态、流程和响应式问题。
