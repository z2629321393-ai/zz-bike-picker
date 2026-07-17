// 公开车型族初核摘要：只表达已经找到的一手证据和阻断原因。
// 这里的记录不是“具体版本正式审核账本”，不得合并进推荐引擎。
export const CATALOG_REVIEW_META = Object.freeze({
  as_of: '2026-07-17',
  reviewed: 23,
  recommendable: 0,
  scope: '优先初核：13 条新车上市、5 条即将上市、5 条暂无报价',
  status_counts: Object.freeze({ new_listing: 13, upcoming: 5, unquoted: 5 })
});

export const CATALOG_REVIEWS = Object.freeze([
  {
    source_id: '20470',
    official_name: '九号 远航家M系（M80C / M85C / M95C）',
    market_status: 'official_family_current',
    market_label: '官方当前车型族，必须拆分版本',
    road_status: 'approval_pending',
    road_label: '三个工厂型号的公告/CCC闭环待核',
    summary: 'M80C 是电动轻便摩托车，M85C、M95C 是电动摩托车；三者不能共用一条推荐参数。',
    model_codes: ['JH800DQT-6', 'JH1200DT-6', 'JH1500DT-4'],
    evidence: [
      { label: '九号官方远航家M系', url: 'https://ninebot.com/escooter/products/series-m.html' },
      { label: '九号官方说明书', url: 'https://imgweboss.ninebot.com/segway-website/system/other/202306/08/35ca724849699c6c5a4e416a9ae9f319.pdf' }
    ],
    recommendable: false
  },
  {
    source_id: '22637',
    official_name: '极核 AE3 Pro（电摩/电轻摩版本）',
    market_status: 'official_family_current',
    market_label: '官方当前车型，版本类别仍混合',
    road_status: 'approval_pending',
    road_label: '第404批只确认产品族，精确后缀待闭环',
    summary: '公开索引写 AE3，官方当前销售名为 AE3 Pro；电摩与电轻摩必须分开审核。',
    model_codes: ['ZH1300DT-6', 'ZH1300DT-6C'],
    evidence: [
      { label: '极核官方 AE3 Pro', url: 'https://www.zeehoev.com/content/zeeho/cn/products-dqm/ae/ae3-pro.html' },
      { label: '极核官方电摩说明书', url: 'https://www.zeehoev.com/content/dam/zeeho/china/products/dm/ae/ae3/ZH1300DT-6%20%20ZH1300DT-6C%28FE49-380101-2300-11%20CN261%29%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V6-20260428.pdf' },
      { label: '工信部第404批', url: 'https://www.miit.gov.cn/zwgk/zcwj/wjfb/gg/art/2026/art_f11332e9ca5448ffabe9386255ee2657.html' }
    ],
    recommendable: false
  },
  {
    source_id: '22527',
    official_name: '破界 机核（精确销售名未核实）',
    market_status: 'no_official_channel_found',
    market_label: '未找到品牌一手销售页面',
    road_status: 'not_found',
    road_label: '制造企业、工厂型号与准入证据均未找到',
    summary: '目前只见第三方资料；在品牌主体和工厂型号确认前，不能写成官方在售或可上牌。',
    model_codes: [],
    evidence: [],
    recommendable: false
  },
  {
    source_id: '21272',
    official_name: '五羊本田 NWF125（当前官方目录未找到）',
    market_status: 'identity_not_found',
    market_label: '疑似名称串错，禁止自动纠正',
    road_status: 'not_found',
    road_label: '未找到对应工厂型号或准入证据',
    summary: '五羊本田当前目录只有 NWF150；125 踏板另有 NWX125、NPF125、NWM125 等，不能猜测替换。',
    model_codes: [],
    evidence: [
      { label: '五羊本田当前产品总表', url: 'https://www.wuyang-honda.com/home/cpzs/index.shtml' },
      { label: 'Honda 中国摩托车全系页', url: 'https://www.honda.com.cn/motorcycle.html?type=list' }
    ],
    recommendable: false
  },
  {
    source_id: '20367',
    official_name: '维多利亚 Sixties 150Si+ / Sixties 5G 150',
    market_status: 'superseded_or_ambiguous',
    market_label: '旧名与当前销售名不一致',
    road_status: 'approval_pending',
    road_label: '工厂型号、公告批次与CCC待核',
    summary: '旧 150Si 有中国上市历史，但当前官方页已使用 150Si+ / Sixties 5G 150，不能当成同一具体版本。',
    model_codes: [],
    evidence: [
      { label: '维多利亚官方品牌历史', url: 'https://www.victoria-motorrad.com/cms/index/about.html' },
      { label: '维多利亚当前产品页', url: 'https://www.victoria-motorrad.com/en/prod/Sixties5G150.html' },
      { label: '维多利亚国内经销网络', url: 'https://www.victoria-motorrad.com/cms/index/service.html' }
    ],
    recommendable: false
  },
  {
    source_id: '21730',
    official_name: '豪爵 UFR150 / UFR150 4 Valves VVL',
    market_status: 'official_family_current',
    market_label: '官方在售，但旧款与VVL共四个型号',
    road_status: 'approval_pending',
    road_label: '四个工厂型号的公告/CCC批次待闭环',
    summary: '旧 UFR150 与 2026-07-15 发布的 VVL 版本并存，必须按具体型号和配置拆分。',
    model_codes: ['HJ150T-29', 'HJ150T-29A', 'HJ150T-29C', 'HJ150T-29D'],
    evidence: [
      { label: '豪爵官方产品与价格总表', url: 'https://www.haojue.com/products.html' },
      { label: '旧 UFR150 官方参数', url: 'https://www.haojue.com/UFR150/canshu.html' },
      { label: 'UFR150 VVL 官方参数', url: 'https://www.haojue.com/UFR1504ValvesVVL/canshu.html' }
    ],
    recommendable: false
  },
  {
    source_id: '22534',
    official_name: '五羊本田 NWF150',
    market_status: 'official_current',
    market_label: '中国官网当前在售，具体后缀待拆分',
    road_status: 'approval_pending',
    road_label: '三个工厂型号的公告/CCC批次待闭环',
    summary: '官方价 ¥14,980 起；WH150T-6、6A、6B 仍需分别对应具体配置与准入证据。',
    model_codes: ['WH150T-6', 'WH150T-6A', 'WH150T-6B'],
    evidence: [
      { label: '五羊本田 NWF150 官方页', url: 'https://www.wuyang-honda.com/home/cpzs/ryj/tbj/detail-1711.shtml' },
      { label: '五羊本田官方说明书', url: 'https://www.wuyang-honda.com/data/cms/category/201705%283%29/46/NWF150%28WH150T-6_6A_6B%29B000.pdf' }
    ],
    recommendable: false
  },
  {
    source_id: '20861',
    official_name: '春风 150SC',
    market_status: 'official_current',
    market_label: '中国官网当前在售，两个型号待拆分',
    road_status: 'approval_pending',
    road_label: '精确工信部批次或CCC待闭环',
    summary: '标准版官方价 ¥13,580；CF150T-31 与 -31A 不能和 150SC-F 的 -33/-33A 混合。',
    model_codes: ['CF150T-31', 'CF150T-31A'],
    evidence: [
      { label: '春风 150SC 官方页', url: 'https://www.cfmoto.com/motorcycles/150SC' },
      { label: '春风 150SC 官方说明书', url: 'https://cfimages.cfmoto.com/cfmoto/CF_150_c3344799c3.pdf' }
    ],
    recommendable: false
  },
  {
    source_id: '20912',
    official_name: '贝纳利 TRK 552X',
    market_status: 'official_catalog_only',
    market_label: '中国官网收录，但价格为N/A且无专属订购',
    road_status: 'approval_pending',
    road_label: '仅找到环保候选映射，未完成准入闭环',
    summary: '中国官网只确认 TRK 552X；不能把第三方公路版、三箱版与2026款价格当成官方信息。',
    model_codes: ['BJ500-5H'],
    evidence: [
      { label: '贝纳利中国 TRK 552X', url: 'https://www.benelli.com/cn-zh/products/trk-552x' },
      { label: '钱江官方环保公开文件', url: 'https://www.qjmotor.com/uploads/files/20240313/7b4c59365e36c1859c5c73665c86bf25.pdf' }
    ],
    recommendable: false
  },
  {
    source_id: '19844',
    official_name: '凯越 450RR（曼岛 / 标准版 / 性能版）',
    market_status: 'official_orderable_mismatch',
    market_label: '官网可预定，但配置/价格与索引记录不一致',
    road_status: 'approval_pending',
    road_label: '候选型号 ZF400-2 尚未与三个配置闭环',
    summary: '官网三个配置都未标年款，不能把第三方所称2026纪念版或价格直接对应过去。',
    model_codes: ['ZF400-2'],
    evidence: [
      { label: '凯越 450RR 曼岛', url: 'https://cn.kovemoto.com/index.php?c=show&id=3523' },
      { label: '凯越 450RR 标准版', url: 'https://cn.kovemoto.com/index.php?c=show&id=3244' },
      { label: '凯越 450RR 性能版', url: 'https://cn.kovemoto.com/index.php?c=show&id=3243' }
    ],
    recommendable: false
  },
  {
    source_id: '22848',
    official_name: '凯旋 Tracker 400 MY2026',
    market_status: 'no_cn_official_channel',
    market_label: '全球官方发布，中国官网未收录/未开放订购',
    road_status: 'not_found',
    road_label: '未找到中国大陆工信部或CCC对应记录',
    summary: '海外上市时间和价格不能证明中国大陆官方在售；当前中国配置器未收录。',
    model_codes: [],
    evidence: [
      { label: '凯旋全球官方媒体资料', url: 'https://triumph-mediakits.com/en/all-motorcycles/modern-classics/2026-tracker-400-and-thruxton-400.html' },
      { label: '凯旋中国配置器', url: 'https://www.triumphmotorcycles.cn/configure' }
    ],
    recommendable: false
  },
  {
    source_id: '21279',
    official_name: '贝纳利 TRK 902 Xplorer / Stradale MY2026',
    market_status: 'no_cn_official_channel',
    market_label: '全球车型已发布，中国官网未找到销售入口',
    road_status: 'not_found',
    road_label: '未找到中国大陆公告型号、CCC或进口环保记录',
    summary: 'Xplorer 与 Stradale 是两个版本；全球“2026到店”不能证明中国大陆当前在售。',
    model_codes: [],
    evidence: [
      { label: '贝纳利官方 Xplorer 发布', url: 'https://www.benelli.com/pt-pt/news/nova-trk-902-xplorer' },
      { label: '贝纳利官方 Stradale 发布', url: 'https://www.benelli.com/pt-pt/news/nova-trk-902-stradale' }
    ],
    recommendable: false
  },
  {
    source_id: '22847',
    official_name: '凯旋 Thruxton 400 MY2026',
    market_status: 'china_mention_only',
    market_label: '中国官网仅文字提及，未开放独立配置/售价',
    road_status: 'not_found',
    road_label: '未找到中国大陆工信部或CCC对应记录',
    summary: '出现在中国官网400cc家族说明中，但不在当前配置器内，不能标成中国官方在售。',
    model_codes: [],
    evidence: [
      { label: '凯旋中国 400cc 家族页', url: 'https://www.triumphmotorcycles.cn/bikes/classic/400cc' },
      { label: '凯旋中国配置器', url: 'https://www.triumphmotorcycles.cn/configure' }
    ],
    recommendable: false
  },
  {
    source_id: '21027',
    official_name: '极核 AE4i / AE4i Max / AE4i Max Pro（电动自行车）',
    market_status: 'legacy_or_availability_unverified',
    market_label: '官方说明书仍可查，当前在售未证实',
    road_status: 'non_motor_vehicle',
    road_label: '属于电动自行车，不进入摩托车准入与推荐池',
    summary: '早期说明书型号为 CF10500DJ / CF10500DJ-A；后期 Max 版本映射未闭环，且法定类别不是电摩。',
    model_codes: ['CF10500DJ', 'CF10500DJ-A'],
    evidence: [
      { label: '极核 AE4i 早期官方说明书', url: 'https://www.zeehoev.com/content/dam/zeeho/china/products/dz/ae/ae4i/product-manuals/AE4i%20%E4%BA%A7%E5%93%81%E7%94%B5%E5%AD%90%E8%AF%B4%E6%98%8E%E4%B9%A6.pdf' },
      { label: '极核 AE4i Max 系列官方说明书', url: 'https://www.zeehoev.com/content/dam/zeeho/china/products/dz/ae/ae4i/product-manuals/AE4I-%E4%BA%A7%E5%93%81%E7%94%B5%E5%AD%90%E8%AF%B4%E6%98%8E%E4%B9%A6.pdf' }
    ],
    recommendable: false
  },
  {
    source_id: '22801',
    official_name: '九号 Fz5 110（电动自行车）',
    market_status: 'official_store_current',
    market_label: '官方旗舰店当前销售，但类别是国标电动自行车',
    road_status: 'non_motor_vehicle',
    road_label: '不走摩托车公告链，整车型号与电自CCC仍待闭环',
    summary: '索引名“Fz5”应规范为 Fz5 110；它不是电轻摩或电摩，不能进入摩托车推荐。',
    model_codes: [],
    evidence: [
      { label: '九号京东官方旗舰店 Fz5 110 分类页', url: 'https://jiuhaodiandong.jd.com/view_search-1782071-1016908165-99-1-20-1.html' },
      { label: '九号官方支持入口', url: 'https://support.ninebot.com/' }
    ],
    recommendable: false
  },
  {
    source_id: '20113',
    official_name: '极核 AE6（电动摩托车）',
    market_status: 'official_current',
    market_label: '中国官网有购买、试驾与门店入口',
    road_status: 'approval_pending',
    road_label: '内地具体版本、工信部记录与有效CCC尚未闭环',
    summary: '候选型号 ZH2500DT-A 来自澳门 AE6+ 核准记录，只能作身份线索，不能替代中国内地准入。',
    model_codes: ['ZH2500DT-A'],
    evidence: [
      { label: '极核中国 AE6 现行产品页', url: 'https://www.zeehoev.com/cn/products-dm/ae/ae6.html' },
      { label: '极核中国 AE6 售后页', url: 'https://www.zeehoev.com/cn/service/after-sales/dm/ae6.html' },
      { label: '澳门交通事务局 AE6+ 核准线索', url: 'https://www.dsat.gov.mo/car_new/carparts.aspx?language=p&sv_code=481&sv_year=2022' }
    ],
    recommendable: false
  },
  {
    source_id: '22766',
    official_name: '豪爵 旅行者 TVL350（扶手版 / 箱杠版）',
    market_status: 'official_catalog_only',
    market_label: '中国官网已发布，预计2026年三季度上市',
    road_status: 'not_found',
    road_label: '未找到具体工厂型号、工信部记录与有效CCC',
    summary: '截至核验日官网仍未列价格或订购入口，不能把“预计上市”标成已经可买。',
    model_codes: [],
    evidence: [
      { label: '豪爵 TVL350 官方发布', url: 'https://www.haojue.com/news/info/397.html' },
      { label: '豪爵 TVL350 官方产品页', url: 'https://www.haojue.com/TVL350/' },
      { label: '豪爵官方当前产品目录', url: 'https://www.haojue.com/products.html' }
    ],
    recommendable: false
  },
  {
    source_id: '22242',
    official_name: '凯越 650RR（全球测试阶段）',
    market_status: 'global_reference_only',
    market_label: '仅有全球测试发布，中国官网未收录',
    road_status: 'not_found',
    road_label: '未找到具体工厂型号、工信部记录与有效CCC',
    summary: '官方国际资料只说 Euro 5+ 版本接近发布，不能证明中国大陆已经上市、定价或可订。',
    model_codes: [],
    evidence: [
      { label: '凯越中国官网当前车型入口', url: 'https://cn.kovemoto.com/' },
      { label: 'KOVE 官方国际 650RR 测试发布', url: 'https://www.kovemoto.com/kove-650rr-and-450r-euro-5-complete-high-altitude-testing-in-kangding?c=show&id=218' }
    ],
    recommendable: false
  },
  {
    source_id: '5721',
    official_name: '建设雅马哈 YBR150-4 / YBR150-5（历史车型）',
    market_status: 'historical_only',
    market_label: '仅确认历史资料，当前官方在售未证实',
    road_status: 'approval_pending',
    road_label: '公告候选与旧索引映射未闭环，CCC未核',
    summary: '历史零件目录为 BF71/BF72；JYM150-7/-8/-8A 只是有效候选，不能自动等同旧索引。',
    model_codes: ['JYM150-7', 'JYM150-8', 'JYM150-8A'],
    evidence: [
      { label: '雅马哈官方 YBR150 历史零件目录', url: 'https://www.yamaha-motor.com.cn/mc/public/uploads/YBR150-BF7-12.pdf' },
      { label: '工信部 JYM150-8 产品记录', url: 'https://service.miit-eidc.org.cn/miitxxgk/gonggao/xxgk/queryCpData?dataTag=Z&gid=U6123124&pc=335' }
    ],
    recommendable: false
  },
  {
    source_id: '17765',
    official_name: '豪爵 GN125-5 / GN125-5F',
    market_status: 'official_family_current',
    market_label: '当前官网收录具体后缀，旧索引名是车型族',
    road_status: 'approval_pending',
    road_label: '具体公告候选已找到，有效CCC仍未闭环',
    summary: 'GN125 不能作为单一版本；当前至少要拆为 -5 与 -5F，再分别核价格、参数和CCC。',
    model_codes: ['GN125-5', 'GN125-5F'],
    evidence: [
      { label: '豪爵 GN125-5 官方参数', url: 'https://www.haojue.com/product/parameters.html?id=90' },
      { label: '工信部 GN125-5 产品记录', url: 'https://service.miit-eidc.org.cn/miitxxgk/gonggao/xxgk/queryCpData?dataTag=Z&gid=X7169418&pc=337' }
    ],
    recommendable: false
  },
  {
    source_id: '4687',
    official_name: '豪爵 翼爽 DM125E',
    market_status: 'successor_current_ambiguous',
    market_label: '当前官网为DM125E，旧DM125名称边界未闭环',
    road_status: 'approval_pending',
    road_label: '候选型号与品牌名映射、有效CCC仍待闭环',
    summary: 'HJ125-23A/-23D 是候选工厂型号，不能把旧索引“DM125”自动等同任一当前后缀。',
    model_codes: ['HJ125-23A', 'HJ125-23D'],
    evidence: [
      { label: '豪爵翼爽 DM125E 官方页', url: 'https://www.haojue.com/dm/index125e.html' },
      { label: '豪爵 DM125E 官方参数', url: 'https://www.haojue.com/product/parameters.html?id=18' },
      { label: '工信部 HJ125-23A 产品记录', url: 'https://service.miit-eidc.org.cn/miitxxgk/gonggao/xxgk/queryCpData?dataTag=Z&gid=V2123406&pc=363' }
    ],
    recommendable: false
  },
  {
    source_id: '5307',
    official_name: '豪爵 HJ125-8W / 8X / 8Y / 8Q',
    market_status: 'official_family_current',
    market_label: '当前官网有多个后缀，旧索引名是聚合车型族',
    road_status: 'approval_pending',
    road_label: '具体公告候选已找到，有效CCC仍未闭环',
    summary: 'HJ125-8 不是单一版本，至少要按 8W、8X、8Y、8Q 分拆后逐项核验。',
    model_codes: ['HJ125-8W', 'HJ125-8X', 'HJ125-8Y', 'HJ125-8Q'],
    evidence: [
      { label: '豪爵 HJ125-8W/8X 官方页', url: 'https://www.haojue.com/HJ1258/index8w.html' },
      { label: '豪爵 HJ125-8 官方参数', url: 'https://www.haojue.com/product/parameters.html?id=82' },
      { label: '工信部 HJ125-8W 产品记录', url: 'https://service.miit-eidc.org.cn/miitxxgk/gonggao/xxgk/queryCpData?dataTag=Z&gid=X6166947&pc=351' }
    ],
    recommendable: false
  },
  {
    source_id: '145',
    official_name: '宗申 全新一代炫风 / PRS150（历史发布）',
    market_status: 'historical_only',
    market_label: '仅找到2019年历史发布，当前产品与价格未找到',
    road_status: 'approval_pending',
    road_label: 'ZS150-38F仅为候选，名称映射与有效CCC未闭环',
    summary: '旧索引“新炫风”不能凭历史发布直接写成当前在售；当前品牌目录也未找到精确销售页。',
    model_codes: ['ZS150-38F'],
    evidence: [
      { label: '宗申官方全新一代炫风历史发布', url: 'https://www.zonsen.cn/newsdetail/119.html' },
      { label: '宗申当前官方车型站', url: 'https://zonsenmotor.com/' },
      { label: '工信部 ZS150-38F 产品记录', url: 'https://service.miit-eidc.org.cn/miitxxgk/gonggao/xxgk/queryCpData?dataTag=Z&gid=W6155693&pc=350' }
    ],
    recommendable: false
  }
]);
