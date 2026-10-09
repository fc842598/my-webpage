# 紫微斗数 2026-09-11 补齐批次 调研留痕（catchup）

## 背景与方法
- 本站中文文章已达 2526 篇，入门/四化/看盘/格局/主星总论/辅煞总论/大限流年/FAQ/十二宫总论等**基础主题已全覆盖**（候选基础主题经全文中文关键词检测全部命中）。
- 故本批不做泛网络调研，改用**「星曜 × 十二宫」组合矩阵自动枚举空白**：对 14 主星 + 26 颗常用辅煞杂曜 × 12 宫共 480 个组合逐一比对全站 articles 文件名，定位 57 个确凿缺失，从中定稿 40 个，零重复、零冲突。
- 归类规则（按星类型，经现有文章面包屑核验）：14 主星坐宫 cat=zhuxing（hub ziwei-main-stars.html）；辅煞杂曜坐宫 cat=fuzhu（hub ziwei-helper-malice-stars.html）。
- 补做日 2026-10-09；文章 datePublished/batch 统一用历史日期 2026-10-09T10:00:00+08:00 之外的 **2026-09-11T10:00:00+08:00**。

## 40 slug 定稿
### zhuxing（14）主星在疾厄宫
| slug | focus |
|---|---|
| ziwei-ziwei-zai-jiegong | 紫微在疾厄宫 |
| ziwei-tianji-zai-jiegong | 天机在疾厄宫 |
| ziwei-taiyang-zai-jiegong | 太阳在疾厄宫 |
| ziwei-wuqu-zai-jiegong | 武曲在疾厄宫 |
| ziwei-tiantong-zai-jiegong | 天同在疾厄宫 |
| ziwei-lianzhen-zai-jiegong | 廉贞在疾厄宫 |
| ziwei-tianfu-zai-jiegong | 天府在疾厄宫 |
| ziwei-taiyin-zai-jiegong | 太阴在疾厄宫 |
| ziwei-tanlang-zai-jiegong | 贪狼在疾厄宫 |
| ziwei-jumen-zai-jiegong | 巨门在疾厄宫 |
| ziwei-tianxiang-zai-jiegong | 天相在疾厄宫 |
| ziwei-tianliang-zai-jiegong | 天梁在疾厄宫 |
| ziwei-qisha-zai-jiegong | 七杀在疾厄宫 |
| ziwei-pojun-zai-jiegong | 破军在疾厄宫 |

### fuzhu（26）辅煞杂曜坐宫
| slug | focus |
|---|---|
| ziwei-zuofu-zai-jiegong | 左辅在疾厄宫 |
| ziwei-youbi-zai-jiegong | 右弼在疾厄宫 |
| ziwei-wenchang-zai-jiegong | 文昌在疾厄宫 |
| ziwei-wenqu-zai-jiegong | 文曲在疾厄宫 |
| ziwei-tianguan-zai-minggong | 天官在命宫 |
| ziwei-tianguan-zai-xiongdigong | 天官在兄弟宫 |
| ziwei-tianguan-zai-fuqigong | 天官在夫妻宫 |
| ziwei-tianguan-zai-zinvgong | 天官在子女宫 |
| ziwei-tianguan-zai-caibogong | 天官在财帛宫 |
| ziwei-tianguan-zai-jiegong | 天官在疾厄宫 |
| ziwei-tianguan-zai-qianyi | 天官在迁移宫 |
| ziwei-tianguan-zai-puyigong | 天官在仆役宫 |
| ziwei-tianguan-zai-tianzhaigong | 天官在田宅宫 |
| ziwei-tianguan-zai-fudegong | 天官在福德宫 |
| ziwei-tianguan-zai-fumugong | 天官在父母宫 |
| ziwei-dahao-zai-xiongdigong | 大耗在兄弟宫 |
| ziwei-dahao-zai-fuqigong | 大耗在夫妻宫 |
| ziwei-dahao-zai-zinvgong | 大耗在子女宫 |
| ziwei-dahao-zai-guanlugong | 大耗在官禄宫 |
| ziwei-dahao-zai-qianyi | 大耗在迁移宫 |
| ziwei-dahao-zai-fudegong | 大耗在福德宫 |
| ziwei-tiankong-zai-guanlugong | 天空在官禄宫 |
| ziwei-tiankong-zai-tianzhaigong | 天空在田宅宫 |
| ziwei-tiankong-zai-fudegong | 天空在福德宫 |
| ziwei-jieshen-zai-jiegong | 解神在疾厄宫 |
| ziwei-jieshen-zai-caibogong | 解神在财帛宫 |

## 分组（5×8，防中断）
- 组1 `_catchup_0911_01.js`：主星疾厄宫前8（紫微/天机/太阳/武曲/天同/廉贞/天府/太阴）
- 组2 `_catchup_0911_02.js`：主星疾厄宫后6 + 左辅/右弼疾厄宫
- 组3 `_catchup_0911_03.js`：文昌/文曲疾厄宫 + 天官前6
- 组4 `_catchup_0911_04.js`：天官后5 + 大耗前3
- 组5 `_catchup_0911_05.js`：大耗后3 + 天空3 + 解神2

## 合规
- 14 篇主星疾厄宫及 4 篇辅煞疾厄宫、解神疾厄宫、天官疾厄宫等健康相关篇，正文写「倾向非诊断、以正规就医为准」。
- 大耗财帛、解神财帛、天官财帛等涉财篇写「不构成投资建议、以持牌机构和正规产品说明为准」。
- 正文禁同行站名/作者/品牌/外链；英文严禁中英混杂。
