# 2026-11-05 客户体验核查（持续更新，未全部完成）

前端隔离工作区：`C:/Users/1/Desktop/yuetian-leap-20261105`，基于 origin/master 517493e4。主工作区大量无关修改，未改动、未清理。
后端工作区：`C:/Users/1/Desktop/ai-piming-backend/.codex-worktrees/qa-20261103`。
只使用合成资料“测试用户QA”，2000-01-01 12:00；本地未选出生地，按页面北京默认。未创建账号、未购买、未使用真实客户会话。

## 逐项状态

| 项目 | 证据与处理 | 状态 |
|---|---|---|
| 7 命主人数恒0 | 原实现对登录用户直接采用权益占用表 used，即使档案列表已有内容。改为与档案页同一个账号范围的去重列表数量，并更名“已建命盘”；不修改真实权益。合成7条档案/服务端0及99均显示7的回归通过。 | 前端已发布；真实登录账号7份场景仍待授权测试 |
| 8 额度回涨 | 后台 main 的既有80b5add已取消失败额外补偿，仅退款，但线上仍旧。新增前端完整快照替换，避免旧 dailyRemaining 混入新 remaining；增加版本号，防止发送前发起的旧状态请求晚返回覆盖新扣次结果。账号配额仍由后台权威计算，不做虚假截小。新增迟到101不能覆盖90测试通过。 | 前端防陈旧修复已发布；后台补偿修复仍未部署，不能算解决回涨 |
| 9 规则截断 | “我的”账号状态改为简短完整的“注册账号限时免费”，扩大状态文字宽度，英文同义。 | 前端已发布；登录活动账号视觉待复核 |
| 10 改年清月日 | 线上浏览器输入1995/1/1再改1900，月份1月与1日均保留，没有清空；现有日期函数保留值并对1900年2月31日夹到28日，回归通过。 | 本轮未复现，不乱改 |
| 11 按钮需多点 | 本地浏览器一次“立即排盘”成功到screen-27，一次“读命盘”成功到screen-4；发送一次立即有等待提示并禁用。排盘增加提交互斥、aria-busy和绘制等待，单元测试双击只执行一次，失败恢复按钮。 | 防重复修复已发布；尚未证明原报告所有无响应原因均已消除 |
| 12 长回答无法回看 | 对话容器原本有overflow-y:auto。新增长文容器可键盘聚焦、触摸纵向滚动，用户上滑/按PageUp停止追随；重绘时保留已固定的scrollTop。单元测试模拟重绘清零后恢复140，通过。 | 前端已发布；真实500字以上AI回答滚动未完成（请求失败），不宣称端到端通过 |
| 13 英文指令失效 | 后台先判断zh-Hant界面参数再检测英文，确有优先级问题。前端按本次问题传语言，后台也把显式语言和英文提问放在界面默认之前，9个后端用例、6个前端用例通过。 | 前端已发布；后端ea0a71d已推main未部署，实际模型回答未验证 |
| 14 翻译质量 | 确认21篇现有英文文章含pride of face；其中一篇把命宫写Self Palace，索引/Feed也有。同义修为concern about appearances及Life Palace，同步JSON-LD、摘要、索引、Feed、sitemap修改时间，保留发表日期和URL。两种生成通道加窄范围术语标准化，防止重生旧词。后台已有术语表，补充固定宫名及自然英语要求。本轮英文HTML未查到“凑”，不能断言全站所有翻译均已人工校对。 | 静态21篇修复已发布；动态模型术语规则后台未部署 |
| 15 绑定邮箱说明错误 | 登录方式底部原为无条件“当前账号已绑定邮箱”。按auth user真实邮箱判断，排除*.local手机号内部标识；中英分别显示未绑定/已绑定。未假装已有绑定邮箱功能。 | 前端已发布；合成手机号和邮箱用例通过，真实登录UI待验证 |
| 16 我的报告误导 | 当前入口路由screen-27实际为最近命盘，主“我的”页更名最近命盘/Recent Chart。未伪造报告列表或下载产物。 | 前端已发布，游客页面浏览器已看到 |

## 独立核查：农历闰月

电脑线上2020年四月十六：月份只有正月至十二月，但选四月后自动出现并勾选“闰4月·按下个月排盘”，预览2020-06-07；取消勾选后预览2020-05-08。手机农历输入也有默认勾选“闰月按下个月计算”。
所以报告“完全无法输入闰月”不准确，但把闰月身份与排盘规则耦合、普通四月自动判闰有真实误选风险。此轮仅取证，未改变高风险历法/紫微流派规则，未将其标记修复。

## 提交与验证

- 前端99c3e312：档案计数、真实绑定说明、最近命盘、规则可见。
- 前端6513c565：滚动意图、防重复提交、语言参数、旧额度快照防覆盖。
- 前端bd7643a7：21篇已有英文文章术语修正（不是新增21篇，不追加发布配额）。
- 后端ea0a71d54ba9a87235ccc412cff245f7954df967：语言优先级、术语提示；远端main一致，但不等于生产上线。
- `node scripts/qa-20261105-account-display.mjs`、`node scripts/qa-20261103-regressions.mjs`、Node语法、`git diff --check`通过。
- 英文修订引擎先dry-run后apply，校验JSON-LD/canonical/索引/sitemap及发表时间；Local GEO check通过。
- 后端语言9例、AI_RECOVERY_OK、MEMBERSHIP_RULES_OK、Next构建通过，有原有多锁文件与模块类型警告。
- 99c3e312上线后线上HTML/JS/CSS均HTTP200，与本地换行标准化后完全相同；Chrome线上“我的”看到已建命盘、最近命盘。
- 本地英文长答请求显示网络失败，未收到模型内容；没据此宣称语言或长回答端到端通过。

## 后台实际阻碍及新增风险

2026-11-05读取线上member-status，合成chartRecordId返回guest、quotaMode=lifetime、remaining=3、chartLimit=1、limit=3；main预期chartLimit=null。证明线上仍旧。
Chrome GitHub安装页面当前仍为aa15989267747-lang，仅授权hk-landing、fatemaster-ai-web；目标私库属于fc842598。未扩权、未新建Vercel项目、未更改域名。需要用户切换GitHub到fc842598后，按既有许可只授权ai-piming-backend并连接原Vercel项目。

`npm audit --omit=dev --audit-level=high`另报4项原有依赖问题：Next critical、sharp high、source-map-js high、baseline-browser-mapping moderate。尚未完成可达性分析或依赖升级，不能声称安全审计通过；未为这次文案修复自动做跨版本升级。生产发布前须进一步复核这些告警和部署权限。

## 测试入口

- https://yuetianai.com/pages/wentian-app.html#screen-31
- https://yuetianai.com/pages/wentian-app.html#screen-26
- https://yuetianai.com/pages/mingbook-onepage.html
- https://yuetianai.com/articles/en/ziwei-lianzhen-tianxiang-zai-minggong.html

回滚仅revert对应提交并push；无数据迁移，不改客户档案和实际次数。
