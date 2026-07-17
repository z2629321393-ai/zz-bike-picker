# 13 条“新车上市”索引审计（2026-07-17）

## 结论

- 审计范围：公开来源页标注“新车上市”的 13 条车型族索引。
- **进入推荐：0 条。** 这些记录只用于公开目录说明，不得合并进推荐引擎。
- 商业证据与道路准入是两件事：品牌官网有产品、价格、预订或经销商入口，只能说明商业状态；正式推荐还要求精确到单一版本和工厂型号的工信部记录与有效 CCC 两条证据链同时闭环。
- `approval_pending` 表示证据尚未闭环，不等于已经认定“不能上牌”；`not_found` 表示本轮一手来源中没有找到对应记录，也不能反推车辆一定没有准入。

## 总览

| ID | 索引对应的官方名称 | 中国大陆商业证据 | 道路准入证据 | 推荐 |
|---|---|---|---|---|
| 20470 | 九号 远航家M系（M80C / M85C / M95C） | **官方当前车型族，须拆分。** [官方车型页](https://ninebot.com/escooter/products/series-m.html)；[官方说明书](https://imgweboss.ninebot.com/segway-website/system/other/202306/08/35ca724849699c6c5a4e416a9ae9f319.pdf)列出 JH800DQT-6、JH1200DT-6、JH1500DT-4。M80C 是电轻摩，另外两款是电摩。 | **待闭环。** 未找到三个型号各自对应的精确公告批次与有效 CCC。 | 否 |
| 22637 | 极核 AE3 Pro（电摩 / 电轻摩） | **官方当前车型，但索引混合类别。** [AE3 Pro 官方页](https://www.zeehoev.com/content/zeeho/cn/products-dqm/ae/ae3-pro.html)；[电摩说明书](https://www.zeehoev.com/content/dam/zeeho/china/products/dm/ae/ae3/ZH1300DT-6%20%20ZH1300DT-6C%28FE49-380101-2300-11%20CN261%29%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V6-20260428.pdf)列 ZH1300DT-6、ZH1300DT-6C。 | **待闭环。** [工信部第 404 批](https://www.miit.gov.cn/zwgk/zcwj/wjfb/gg/art/2026/art_f11332e9ca5448ffabe9386255ee2657.html)只能支持产品族，尚不能把销售版本与精确后缀一一对应。 | 否 |
| 22527 | 破界 机核（精确销售名未核实） | **未找到品牌一手销售页面。** 当前第三方信息不能证明官方在售。 | **未找到。** 制造企业、工厂型号、公告批次与 CCC 均未核实。 | 否 |
| 21272 | 五羊本田 NWF125（官方目录未找到） | **身份未确认。** [五羊本田产品总表](https://www.wuyang-honda.com/home/cpzs/index.shtml)与 [Honda 中国全系页](https://www.honda.com.cn/motorcycle.html?type=list)只有 NWF150；125 踏板另有 NWX125、NPF125、NWM125 等，禁止猜测替换。 | **未找到。** 没有对应工厂型号或准入记录。 | 否 |
| 20367 | 维多利亚 Sixties 150Si+ / Sixties 5G 150 | **旧名与当前销售名不一致。** [官方历史](https://www.victoria-motorrad.com/cms/index/about.html)证明旧 150Si 曾在中国上市；当前使用 [150Si+ / Sixties 5G 150](https://www.victoria-motorrad.com/en/prod/Sixties5G150.html)，并有[国内经销网络](https://www.victoria-motorrad.com/cms/index/service.html)。 | **待闭环。** 未找到精确工厂型号、公告批次与有效 CCC。 | 否 |
| 21730 | 豪爵 UFR150 / UFR150 4 Valves VVL | **官方在售，但新旧款并存。** [官方产品与价格表](https://www.haojue.com/products.html)；[旧款参数](https://www.haojue.com/UFR150/canshu.html)列 HJ150T-29/-29A；[VVL 参数](https://www.haojue.com/UFR1504ValvesVVL/canshu.html)列 HJ150T-29C/-29D。 | **待闭环。** 四个工厂型号仍缺各自的精确公告与有效 CCC 对应。 | 否 |
| 22534 | 五羊本田 NWF150 | **中国官网当前在售。** [官方车型页](https://www.wuyang-honda.com/home/cpzs/ryj/tbj/detail-1711.shtml)标价 ¥14,980 起；[官方说明书](https://www.wuyang-honda.com/data/cms/category/201705%283%29/46/NWF150%28WH150T-6_6A_6B%29B000.pdf)涉及 WH150T-6/-6A/-6B。 | **待闭环。** 三个后缀尚未分别对应到精确公告批次与有效 CCC。 | 否 |
| 20861 | 春风 150SC | **中国官网当前在售。** [官方车型页](https://www.cfmoto.com/motorcycles/150SC)标价 ¥13,580 起；[官方说明书](https://cfimages.cfmoto.com/cfmoto/CF_150_c3344799c3.pdf)列 CF150T-31/-31A，不能与 150SC-F 的 -33/-33A 混合。 | **待闭环。** 尚缺精确工信部批次与有效 CCC 对应。 | 否 |
| 20912 | 贝纳利 TRK 552X | **仅能确认中国官网收录。** [贝纳利中国车型页](https://www.benelli.com/cn-zh/products/trk-552x)价格为 N/A、无专属订购入口；不能采用第三方版本和价格。 | **待闭环。** [钱江官方环保文件](https://www.qjmotor.com/uploads/files/20240313/7b4c59365e36c1859c5c73665c86bf25.pdf)提供 BJ500-5H 候选映射，但环保公开不等于道路准入闭环。 | 否 |
| 19844 | 凯越 450RR（曼岛 / 标准版 / 性能版） | **官网可预订，但与索引配置和价格不一致。** 官方页：[曼岛](https://cn.kovemoto.com/index.php?c=show&id=3523)、[标准版](https://cn.kovemoto.com/index.php?c=show&id=3244)、[性能版](https://cn.kovemoto.com/index.php?c=show&id=3243)；三页均未标索引所称年款。 | **待闭环。** 候选型号 ZF400-2 尚未与三个销售配置逐一对应。 | 否 |
| 22848 | 凯旋 Tracker 400 MY2026 | **只有全球官方发布。** [全球媒体资料](https://triumph-mediakits.com/en/all-motorcycles/modern-classics/2026-tracker-400-and-thruxton-400.html)不能证明大陆在售；[凯旋中国配置器](https://www.triumphmotorcycles.cn/configure)未收录。 | **未找到。** 没有大陆工信部或 CCC 对应记录。 | 否 |
| 21279 | 贝纳利 TRK 902 Xplorer / Stradale MY2026 | **只有海外官方发布。** 官方分别发布 [Xplorer](https://www.benelli.com/pt-pt/news/nova-trk-902-xplorer) 与 [Stradale](https://www.benelli.com/pt-pt/news/nova-trk-902-stradale)，中国官网未找到销售入口。 | **未找到。** 没有大陆公告型号、CCC 或进口环保记录。 | 否 |
| 22847 | 凯旋 Thruxton 400 MY2026 | **中国官网仅文字提及。** [400cc 家族页](https://www.triumphmotorcycles.cn/bikes/classic/400cc)有名称，但[中国配置器](https://www.triumphmotorcycles.cn/configure)未开放独立配置、售价或订购。 | **未找到。** 没有大陆工信部或 CCC 对应记录。 | 否 |

## 发布门槛

一条记录只有在以下条件同时满足后，才可重新评估推荐资格：

1. 拆分为单一销售版本，品牌、年款、配置和工厂型号完全一致；
2. 品牌中国官方渠道能够证明当前在售；
3. 工信部产品/进口记录与有效 CCC 都能够与同一工厂型号精确对应；
4. 价格、座高、整备质量、ABS 和动力等推荐参数均有可追溯来源；
5. 人工复核通过，且商业证据与道路准入证据都在有效期内。

在此之前，13 条记录均保持 `recommendable: false`。
