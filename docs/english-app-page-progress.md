# 英文 App 页面排查进度

更新时间：2026-07-02

## 当前进度

- 已完成历史项：英文公共入口、会员页 PayPal 文案、`?lang=en` 强制英文、英文文章入口与链路复查。
- 本轮已完成：`screen-50` `Office Layout`，主标题已从英文断行为单行收纳。
- 本轮已完成：`screen-51` `Guide`，步骤标题已从英文断行为单行收纳。
- 本轮已完成：`screen-45` `Guide`，英文教程页标题、引导卡与步骤说明已压缩收纳，返回与开始按钮已复查。
- 本轮已完成：`screen-44` `Placement`，英文空状态页复查通过，无明显遮挡、溢出或异常换行。
- 本轮已完成：`screen-43` `Choose Members`，成员选择弹层长英文已改为单行收纳，背景提示与选中后确认按钮文案也已修正。
- 本轮已完成：`screen-42` `Nine Palaces`，中宫指南针按钮已改为单行，开启后的英文状态异常也已修正。
- 本轮已完成：`screen-41` `Password`，未登录态说明文案已压缩为单行，登录入口跳转已复查。
- 本轮已完成：`screen-40` `Login Methods`，页头副标题已压缩为单行，返回入口已复查。
- 本轮已完成：`screen-39` `Basic Info`，游客态头像、副标题与提示文案已压缩为单行，保存与返回已复查。
- 本轮已完成：`screen-38` `Settings`，底部提醒卡文案已压缩为单行，四个入口与返回已复查。
- 本轮已完成：`screen-37` `Language`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查返回与英文确认链路。
- 本轮已完成：`screen-36` `About`，底部版权英文已压缩为单行，并复查隐私协议、用户协议提示、检查更新与返回链路。
- 本轮已完成：`screen-35` `Contact`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查邮箱复制提示与返回链路。
- 本轮已完成：`screen-34` `Share`，四个分享入口英文标签已压缩为单行，并复查复制提示、邮件分享提示与关闭链路。
- 本轮已完成：`screen-33` `Membership Plans`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查支付方式切换、提交跳转与返回链路。
- 本轮已完成：`screen-32` `Account Settings`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查四个入口与返回链路。
- 本轮已完成：`screen-31` `Mine`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查主入口、列表项、文章入口与底部导航。
- 本轮已完成：`screen-30` `Payment`，右上角状态标签英文已压缩为单行，并复查支付按钮、返回与底部导航链路。
- 本轮已完成：`screen-29` `Membership / Recharge`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查支付方式、提交、返回与底部导航链路。
- 本轮已完成：`screen-27` `Ziwei Report`，英文页复查通过，无明显遮挡、溢出或异常换行，并复查更多菜单、易经切换、Volume 入口、Read Chart、返回与底部导航链路。
- 本轮已完成：`screen-26` `Chart Form`，已修复真太阳时英文状态说明换行，并复查姓名、性别、公历/农历、说明开关、出生地、提交、返回与底部导航链路。
- 本轮已完成：`screen-25` `Archives`，已修复英文档案卡片姓名截断，并复查空态与单档案态下的 `+ New`、批量模式、搜索、Open Chart、编辑、删除、返回与底部导航链路。
- 本轮已完成：`screen-24` `Invite Details`，已修复英文邀请链接换行，并复查复制邀请码、复制链接的登录拦截、返回与底部导航链路。
- 本轮已完成：`screen-22` `Invite Friends`，已修复登录态英文邀请页残留占位词 `Text/day`、`Reward Rules` 覆盖输入框，以及 `System Share` 仍复制中文文案的问题，并复查登录入口、返回、底部导航、复制邀请码、复制链接与系统分享链路。
- 本轮已完成：`screen-12` `Quick Questions`，英文页复查通过，无明显遮挡、溢出或异常换行；并复查返回、聊天记录入口、输入框、加号、问题 chips 与底部导航链路。
- 本轮已完成：`screen-17` `Liuyao Casting`，已将英文输入框 placeholder 缩短为单行收纳，并复查空态提交、提交具体问题后进入起卦流程、返回与底部导航链路；同时补齐了线上问卦与会员状态接口缺少 `x-wentian-client-id` 的 CORS 放行。
- 本轮已完成：`screen-18` `Liuyao Cast Step 2`，已将英文提问页主标题、审题提示与 4 个示例按钮压缩为单行收纳，并复查示例填充、提交具体问题后进入起卦流程、返回与底部导航链路。
- 本轮已完成：`screen-19` `Liuyao Cast Step 3`，已修复英文完成态残留占位文案 `Text / Regenerate in English.`，并将本卦、变卦摘要压缩为 `Water / Fire`、`Hex 63 · Kan/Li` 这类可完整收纳的英文格式；已复查 `Read Hexagram`、卡片内 `View Reading` 与结果页返回链路。
- 本轮已完成：`screen-20` `Liuyao Result`，已修复英文结果态 `Original / Changed` 卦名被省略号截断的问题，并复查空态返回、空态 `Back to Casting`、从 `screen-17` 进入结果页、返回、`Start AI Reading`、`Cast Again` 二次确认与底部导航链路。
- 本轮已完成：`screen-11` `Compatibility Profile Select`，已修复英文选人卡片姓名被省略号截断的问题，并复查空态、有档案态、双人选择、进入结果页、编辑时间弹层、新建档案入口与返回链路。
- 本轮已完成：`screen-9` `Chat History`，已修复英文聊天头部档案名与历史摘要被截断的问题，并复查切换档案、新建对话、历史记录跳转与返回链路。
- 本轮已完成：`screen-8` `Long Reading`，英文页复查通过，无中文残留、无明显遮挡或溢出，并复查从 `screen-7` 进入、返回、`Ask Follow-up` 与底部导航链路。
- 本轮已完成：`screen-7` `Reply`，英文页复查通过，无中文残留、无明显遮挡或溢出，并复查从 `screen-6` 进入、返回、`View Full Reading`、追问入口与底部导航链路。
- 本轮已完成：`screen-6` `Asking`，英文页复查通过，无中文残留、无明显遮挡或溢出，并复查从 `screen-7` 追问进入、返回、`View Reply` 与底部导航链路。
- 本轮已完成：`screen-5` `Choose Profile`，英文页复查通过，无中文残留、无明显遮挡或溢出，并复查从 `screen-4` 进入、返回、`Exit Selection`、空态 `Confirm` 提示、`+ New` 与底部导航链路。
- 本轮已完成：`screen-4` `Chat`，已修复顶部英文 `Chart / Switch` 挤成两行的问题，改为单行收纳；并复查返回、切换档案、聊天记录、FAQ 展开与输入发送链路。聊天页本身不展示底部导航，复查为预期。
- 本轮已完成：`screen-3` `AI`，英文页复查通过，无中文残留、无明显遮挡或溢出，并复查 `Switch`、顾问卡片进入聊天页与底部导航链路。进入聊天页时顶部额度会短暂显示 `-- left`，随后会自动恢复为正常额度，复查为瞬时加载态。
- 本轮已完成：公共六爻移动页 `liuyao.html` / `liuyao-v2.html` 的 `?lang=en` 入口改为直接进入英文 App 六爻页，避免英文用户落到整页中文的独立六爻实现。
- 当前停靠点：已处理到 `screen-3`
- 下一页：`screen-2` `Home / Report Mall`

## 英文页面总清单

| 状态 | Screen | 英文页名 | 备注 |
| --- | --- | --- | --- |
| 待排查 | `screen-1` | Authorization | 入口页 |
| 待排查 | `screen-2` | Home / Report Mall | 商城首页 |
| 已完成 | `screen-3` | AI | 英文页复查通过，无中文残留、无明显遮挡或溢出，已复查 `Switch`、顾问卡片进入聊天页与底部导航链路；进入聊天页时顶部额度会短暂显示 `-- left`，随后会自动恢复为正常额度 |
| 已完成 | `screen-4` | Chat | 已修复顶部英文 `Chart / Switch` 挤成两行的问题，改为单行收纳；已复查返回、切换档案、聊天记录、FAQ 展开与输入发送链路，聊天页不展示底部导航为预期 |
| 已完成 | `screen-5` | Choose Profile | 英文页复查通过，无中文残留、无明显遮挡或溢出，已复查从 `screen-4` 进入、返回、`Exit Selection`、空态 `Confirm` 提示、`+ New` 与底部导航链路 |
| 已完成 | `screen-6` | Asking | 英文页复查通过，无中文残留、无明显遮挡或溢出，已复查从 `screen-7` 追问进入、返回、`View Reply` 与底部导航链路 |
| 已完成 | `screen-7` | Reply | 英文页复查通过，无中文残留、无明显遮挡或溢出，已复查从 `screen-6` 进入、返回、`View Full Reading`、追问入口与底部导航链路 |
| 已完成 | `screen-8` | Long Reading | 英文页复查通过，无中文残留、无明显遮挡或溢出，已复查从 `screen-7` 进入、返回、`Ask Follow-up` 与底部导航链路 |
| 已完成 | `screen-9` | Chat History | 已修复英文聊天头部档案名与历史摘要被截断，复查切换档案、新建对话、历史记录跳转与返回链路 |
| 已完成 | `screen-11` | Compatibility Profile Select | 已修复英文选人卡片姓名被省略号截断，复查空态、有档案态、双人选择、进入结果页、编辑时间弹层、新建档案入口与返回链路 |
| 已完成 | `screen-12` | Quick Questions | 英文页复查通过，无明显遮挡、溢出或异常换行，已复查返回、聊天记录入口、输入框、加号、问题 chips 与底部导航链路 |
| 已完成 | `screen-17` | Liuyao Casting | 已将英文输入框 placeholder 缩短为单行收纳，复查空态提交、提交具体问题后进入起卦流程、返回与底部导航链路，并补齐线上问卦与会员状态接口缺少 `x-wentian-client-id` 的 CORS 放行 |
| 已完成 | `screen-18` | Liuyao Cast Step 2 | 已将英文提问页主标题、审题提示与 4 个示例按钮改为单行收纳，复查示例填充、提交具体问题后进入起卦流程、返回与底部导航链路 |
| 已完成 | `screen-19` | Liuyao Cast Step 3 | 已修复英文完成态占位文案 `Text / Regenerate in English.`，并将本卦、变卦摘要改为可完整收纳的短英文格式，复查 `Read Hexagram`、`View Reading` 与结果页返回链路 |
| 已完成 | `screen-20` | Liuyao Result | 已修复英文结果态 `Original / Changed` 卦名省略号截断，并复查空态、返回、AI 入口、重起卦确认与底部导航链路 |
| 已完成 | `screen-22` | Invite Friends | 已修复登录态英文邀请页残留占位词 `Text/day`、`Reward Rules` 覆盖输入框，以及 `System Share` 中文分享文案问题，并复查登录入口、返回、底部导航与分享链路 |
| 已完成 | `screen-24` | Invite Details | 已修复英文邀请链接换行，并复查复制邀请码、复制链接的登录拦截、返回与底部导航链路 |
| 已完成 | `screen-25` | Archives | 已修复英文档案卡片姓名截断，并复查空态与单档案态下的 `+ New`、批量模式、搜索、Open Chart、编辑、删除、返回与底部导航链路 |
| 已完成 | `screen-26` | Chart Form | 已修复真太阳时英文状态说明换行，并复查姓名、性别、公历/农历、说明开关、出生地、提交、返回与底部导航链路 |
| 已完成 | `screen-27` | Ziwei Report | 英文页复查通过，无需额外样式修改，已复查更多菜单、易经切换、Volume 入口、Read Chart、返回与底部导航链路 |
| 已完成 | `screen-29` | Membership / Recharge | 英文页复查通过，无需额外样式修改，已复查支付方式、提交、返回与底部导航链路 |
| 已完成 | `screen-30` | Payment | 已修复右上角状态标签英文换行，并复查支付按钮、返回与底部导航链路 |
| 已完成 | `screen-31` | Mine | 英文页复查通过，无需额外样式修改，已复查主入口、列表项、文章入口与底部导航 |
| 已完成 | `screen-32` | Account Settings | 英文页复查通过，无需额外样式修改，已复查四个入口与返回链路 |
| 已完成 | `screen-33` | Membership Plans | 英文页复查通过，无需额外样式修改，已复查支付方式切换、提交跳转与返回链路 |
| 已完成 | `screen-34` | Share | 已修复四个分享入口英文标签换行，并复查复制提示、邮件分享提示与关闭链路 |
| 已完成 | `screen-35` | Contact | 英文页复查通过，无需额外样式修改，已复查邮箱复制提示与返回链路 |
| 已完成 | `screen-36` | About | 已修复底部版权英文换行，并复查隐私协议、用户协议提示、检查更新与返回链路 |
| 已完成 | `screen-37` | Language | 英文页复查通过，无需额外样式修改，已复查返回与英文确认链路 |
| 已完成 | `screen-38` | Settings | 已修复底部提醒卡英文换行，并复查四个入口与返回 |
| 已完成 | `screen-39` | Basic Info | 已修复游客态头像文案、副标题与提示文案英文换行，并复查保存与返回 |
| 已完成 | `screen-40` | Login Methods | 已修复页头副标题英文换行，并复查返回入口 |
| 已完成 | `screen-41` | Password | 已修复未登录态说明文案英文换行，并复查登录入口跳转 |
| 已完成 | `screen-42` | Nine Palaces | 已修复中宫指南针按钮英文换行与开启后状态文案异常 |
| 已完成 | `screen-43` | Choose Members | 已修复成员选择弹层长英文换行、背景提示过长与选中后确认按钮英文异常 |
| 已完成 | `screen-44` | Placement | 英文空状态页复查通过，无需额外样式修改 |
| 已完成 | `screen-45` | Guide | 已修复英文教程页标题、引导卡与步骤说明过长挤压问题，并复查返回与开始按钮 |
| 已完成 | `screen-46` | Liuren | 已修复动态英文残留、流程卡换行与宫位英文标签拥挤问题 |
| 已完成 | `screen-47` | Liuren Guide | 已修复英文说明卡与宫位顺序文案过长换行问题 |
| 已完成 | `screen-48` | Orders | 已修复英文空状态与订单状态文案过长换行问题，并复查登录入口跳转 |
| 已完成 | `screen-49` | Compatibility Result | 已修复英文异常态文案、规则说明与按钮过长问题，并复查两个入口跳转 |
| 已完成 | `screen-50` | Office Layout | 本轮已修英文标题收纳 |
| 已完成 | `screen-51` | Office Layout Guide | 已修步骤标题英文收纳 |
| 已完成 | `screen-52` | Office Layout Result | 已复查通过，无需改样式 |

## 路由别名说明

- `screen-10` 实际进入 `screen-11`
- `screen-21` 实际进入 `screen-29`
- `screen-23` 实际进入 `screen-22`
- `screen-28` 实际进入 `screen-31`
