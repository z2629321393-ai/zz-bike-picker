import { GEAR_FALLBACK_IMAGES, marketplaceLinks } from './marketplace.js';
import { EXPANDED_PRODUCT_CATALOG } from './product-catalog-expanded.js';
import { DIRECTORY_PRODUCT_CATALOG } from './product-catalog-directory.js';

// 这是目录代码与人工校对的更新日期，不是每一条型号都在当天完成了库存核验。
export const CATALOG_CODE_UPDATED_AT = '2026-07-23';
// 保留旧导出名，避免外部页面或旧脚本引用中断；界面统一使用“目录代码更新”表述。
export const CATALOG_UPDATED_AT = CATALOG_CODE_UPDATED_AT;

// 中文来源证据的强度分级。只有具体中文官方/旗舰店型号页（或防盗的非 SKU 分层方案）
// 能进入默认结果；榜单、价格页和排行页只保留为“公开出现快照”。这避免“搜得到”
// 被错误写成“国内现货”。
export const CN_EVIDENCE_LABELS = Object.freeze({
  cn_sku_snapshot: '中文公开渠道型号快照',
  cn_exact_public: '中文官方具体型号资料（库存另核）',
  system_direction: '非 SKU 的安全方案方向',
  catalog_reference: '产品线/型号资料（国内购买待核验）'
});

const DEFAULT_RECOMMENDATION_EVIDENCE = new Set(['cn_exact_public']);

const CANONICAL_FAMILY_BY_ID = Object.freeze({
  'light-denali-d3': 'denali-d3',
  'lights-denali-d3': 'denali-d3',
  'luggage-givi-trekker': 'givi-trekker-outback',
  'luggage-givi-trekker-v64': 'givi-trekker-outback'
});

// 旧候选库建立时只有“用途”标签。V6.5 的问卷会明确问盔型/服装结构，
// 因此这些已审核候选也补上结构标签；没有标签的产品不能借由宽松匹配跨类型出现。
const FIT_PATCH_BY_ID = Object.freeze({
  'helmet-scoyco-entry': { helmetType: ['fullFace'] },
  'helmet-hjc-c10': { helmetType: ['fullFace'] },
  'helmet-ls2-storm2': { helmetType: ['fullFace'] },
  'helmet-hjc-i71': { helmetType: ['sportFullFace'] },
  'helmet-shoei-z8': { helmetType: ['sportFullFace'] },
  'helmet-shoei-gtair3': { helmetType: ['fullFace'] },
  'helmet-shoei-x15': { helmetType: ['raceFullFace'] },
  'helmet-scoyco-sy666': { helmetType: ['sportFullFace'] },
  'helmet-agv-k6s': { helmetType: ['sportFullFace'] },
  'helmet-bilmola-er34': { helmetType: ['sportFullFace'] },
  'helmet-ls2-rapid2': { helmetType: ['fullFace'] },
  'helmet-kyt-ttcourse': { helmetType: ['sportFullFace'] },
  'helmet-mt-thunder4': { helmetType: ['fullFace'] },
  'helmet-arai-rx7x': { helmetType: ['raceFullFace'] },
  'helmet-arai-rapide': { helmetType: ['retroFullFace'] },
  'helmet-shark-spartan': { helmetType: ['sportFullFace'] },
  // N80-8 是公路全盔；“运动旅行”是定位，不应把它从用户选择的全盔筛选里排除。
  'helmet-nolan-n808': { helmetType: ['fullFace'] },
  'helmet-scorpion-exo520': { helmetType: ['fullFace'] },
  'helmet-yohe-fullface': { helmetType: ['fullFace'] },
  'helmet-zeus-fullface': { helmetType: ['fullFace'] },
  'helmet-hjc-rpha12': { helmetType: ['raceFullFace'] },
  'helmet-ls2-vector2': { helmetType: ['sportFullFace'] },
  'helmet-bell-qualifier': { helmetType: ['sportFullFace'] },
  'helmet-xlite-x804': { helmetType: ['raceFullFace'] },
  'helmet-airoh-spark2': { helmetType: ['fullFace'] },

  'armor-scoyco-mesh': { garmentType: ['meshJacket'] },
  'armor-astar-smxair': { garmentType: ['meshJacket'] },
  'armor-revit-sand4': { garmentType: ['advTouring'] },
  // 这是街道运动皮衣方向，不把运动皮衣误标为复古皮衣。
  'armor-astar-leather': { garmentType: ['twoPieceLeather'] },
  'armor-track-suit': { garmentType: ['onePieceLeather'] },
  'armor-scoyco-jk321': { garmentType: ['meshJacket'] },
  'armor-scoyco-jk103': { garmentType: ['meshJacket'] },
  'armor-duhan-suit': { garmentType: ['textileSuit'] },
  'armor-minortune-yuanshan': { garmentType: ['advTouring'] },
  'armor-richa-touring': { garmentType: ['advTouring'] },
  'armor-dainese-aircrono2': { garmentType: ['meshJacket'] },
  'armor-dainese-racing5': { garmentType: ['twoPieceLeather'] },
  'armor-dainese-tempest3': { garmentType: ['textileSuit'] },
  'armor-astar-tgpv4air': { garmentType: ['meshJacket'] },
  'armor-astar-andesv3': { garmentType: ['advTouring'] },
  'armor-revit-eclipse2': { garmentType: ['meshJacket'] },
  'armor-revit-tornado4': { garmentType: ['advTouring'] },
  'armor-komine-jk128': { garmentType: ['meshJacket'] },
  'armor-rstaichi-rsj336': { garmentType: ['meshJacket'] },
  'armor-nerve-touring': { garmentType: ['advTouring'] },
  'armor-benkia-summer': { garmentType: ['meshJacket'] }
});

const TYPE_LABELS = Object.freeze({
  helmetType: {
    fullFace: '通勤/街道全盔', sportFullFace: '运动全盔', raceFullFace: '赛道全盔', modular: '揭面盔',
    adv: '拉力/ADV盔', offroad: '越野盔', retroFullFace: '复古全盔', threeQuarter: '3/4盔', openFace: '半盔'
  },
  garmentType: {
    meshJacket: '夏季网眼骑行服', textileSuit: '日常骑行服 + 骑行裤', advTouring: 'ADV / 拉力摩旅服',
    twoPieceLeather: '分体皮衣 / 皮裤', onePieceLeather: '连体皮衣', armoredShirt: '护甲衬衣 + 耐磨外层',
    retroLeather: '复古皮衣', ridingPants: '骑行裤 / 下装优先', protectiveJeans: '防护牛仔裤'
  },
  protection: {
    urban: '通勤短手套', roadSport: '街道运动手套', touring: '摩旅 / ADV 手套', race: '赛道长护腕手套'
  },
  style: {
    sneaker: '城市骑行鞋', sport: '街道运动靴', adv: 'ADV / 摩旅靴', retro: '复古骑行靴', offroad: '越野靴'
  },
  system: {
    topbox: '尾箱', hard3: '硬壳三箱', soft: '软包系统', seat: '尾包 / 坐垫包'
  },
  beam: {
    cutoff: '带截止线近光', spot: '远射补光', flood: '泛光（非公共道路）', combo: '分区组合补光'
  },
  group: {
    solo: '单人导航 / 音乐', pair: '双人对讲', small: '小车队', large: '多人 Mesh 车队'
  },
  parking: {
    indoor: '室内停车', monitored: '有人值守 / 监控', outdoor: '露天高风险', uncertain: '环境不确定'
  }
});

function typeKeyForCategory(categoryId) {
  return ({
    helmet: 'helmetType',
    gloves: 'protection',
    armor: 'garmentType',
    boots: 'style',
    luggage: 'system',
    lights: 'beam',
    intercom: 'group',
    theft: 'parking'
  })[categoryId] || '';
}

const mergeFit = (data) => {
  const existing = data.fit || {};
  const patch = FIT_PATCH_BY_ID[data.id] || {};
  const keys = new Set([...Object.keys(existing), ...Object.keys(patch)]);
  return Object.fromEntries([...keys].map((key) => [
    key,
    [...new Set([...(existing[key] || []), ...(patch[key] || [])])]
  ]));
};

const inferredTaxonomy = (data, fit) => {
  if (data.taxonomy) return data.taxonomy;
  const typeKey = typeKeyForCategory(data.categoryId);
  const type = typeKey ? (fit[typeKey] || []).map((value) => TYPE_LABELS[typeKey]?.[value] || value).join(' / ') : '';
  const fallbackDesign = {
    helmet: '按盔型、用途与头型试戴比较',
    gloves: '按护腕长度、掌根结构与手感比较',
    armor: '按服装结构、护具位置与骑姿比较',
    boots: '按鞋筒覆盖、抗扭与换挡感比较',
    luggage: '按载重、固定方式与车辆适配比较',
    lights: '按光型、电路与道路使用边界比较',
    intercom: '按车队规模、盔体空间与操作方式比较',
    theft: '按停车环境与分层防护比较'
  }[data.categoryId] || '按用途与具体版本继续比较';
  return {
    type: type || '结构/类型待按具体型号核验',
    usage: fit.usage || [],
    designLanguage: fallbackDesign,
    persona: data.idealFor || '按实际用途、合身与公开资料继续比较',
    fitNote: data.categoryId === 'helmet'
      ? '头围仅作初筛；请按品牌尺码表和连续试戴判断头型、太阳穴、后脑与脸颊包裹。'
      : data.categoryId === 'armor'
        ? '请按骑姿试穿，确认护具在肩、肘、膝、髋或背部正确位置。'
        : ''
  };
};

const inferRecordType = (data) => {
  const model = `${data.model || ''}`;
  if (data.recordType) return data.recordType;
  if (/组合方案|固定物重链\+/.test(model)) return 'bundle';
  if (/方向|主力款|主力系列|具体型号/.test(model)) return 'direction';
  if (/系列|套装|\//.test(model)) return 'series';
  return 'exact';
};

const inferChinaAvailability = (data) => {
  if (data.cnAvailability) return data.cnAvailability;
  if (data.marketSignal) return `公开平台有在售信号（${data.marketSignal.observedAt || '日期待核验'}快照）`;
  return '国内正规渠道与当前价格待核验';
};

const item = (data) => {
  const fit = mergeFit(data);
  const recordType = inferRecordType(data);
  const marketSignal = data.marketSignal
    ? {
        ...data.marketSignal,
        sourceUrl: data.marketSignal.sourceUrl || data.reviewUrl || ''
      }
    : null;
  const sourceCheckedAt = data.sourceCheckedAt || marketSignal?.observedAt || '';
  const cnEvidenceTier = data.cnEvidenceTier
    || (marketSignal?.sourceUrl
      ? 'cn_sku_snapshot'
      : (data.catalogScope === 'source-checked-candidate' && data.sourceUrl && sourceCheckedAt)
        ? 'cn_exact_public'
        : (data.categoryId === 'theft' && recordType === 'bundle')
          ? 'system_direction'
          : 'catalog_reference');
  const hasDomesticSpecificEvidence = DEFAULT_RECOMMENDATION_EVIDENCE.has(cnEvidenceTier);
  // 只有中文官方/旗舰店明确型号页才能进入默认推荐。带日期的榜单和价格页只证明
  // 公开出现过，仍不足以代替实时 SKU、卖家主体和库存核验。
  // 防盗“组合方案”保留为例外：它代表分层安全策略，不伪装成一个可购买的 SKU。
  const recommendable = (
    (recordType === 'exact' && hasDomesticSpecificEvidence)
    || (data.categoryId === 'theft' && recordType === 'bundle' && cnEvidenceTier === 'system_direction')
  ) && data.recommendable !== false;
  // 没有中文在售证据的具体型号仍可以作为“选型参考”出现，但标签会明确说明国内购买待核验。
  // 目录条目、系列、方向、历史资料与被显式禁用的记录均不能借此回到结果推荐里。
  const selectionEligible = recordType === 'exact'
    && data.recommendable !== false
    && data.selectionEligible !== false
    && data.catalogScope !== 'directory';
  const hasDirectoryMetadata = Boolean(data.sourceUrl || data.sourceLabel || data.taxonomy?.fitNote);
  const catalogScope = data.catalogScope === 'directory'
    ? 'directory'
    : recommendable
      ? (cnEvidenceTier === 'cn_exact_public' || data.catalogScope === 'source-checked-candidate'
        ? 'source-checked-candidate'
        : 'candidate')
      : selectionEligible || data.recommendable === false
        ? 'verification-needed'
        : hasDirectoryMetadata
          ? 'directory'
          : 'verification-needed';
  const rawSourceType = data.sourceType || '';
  const sourceType = !marketSignal && /(热卖|排行|热门|热度)/.test(rawSourceType)
    ? '公开资料（无独立市场快照）'
    : !marketSignal && /(官方在售|公开在售)/.test(rawSourceType)
      ? '品牌产品资料（不等同于中国大陆在售）'
      : (rawSourceType || '公开资料');
  const rawReviewSummary = data.reviewSummary || '';
  const reviewSummary = !marketSignal && /(热卖|排行|榜|TOP\s*\d|销量|售出|评论量)/i.test(rawReviewSummary)
    ? '公开页面曾收录这个候选，但缺少带日期的独立市场快照；这里只作为目录参考，不代表市场表现先后。'
    : !marketSignal
      ? rawReviewSummary.replaceAll('热门', '常见').replaceAll('热度', '公开资料能见度')
      : rawReviewSummary;
  return {
    confidence: 'medium',
    sourceType: '公开资料',
    image: '',
    reviewUrl: '',
    officialUrl: '',
    sourceUrl: '',
    searchKeyword: `${data.brand || ''} ${data.model || ''}`.trim(),
    fit,
    taxonomy: inferredTaxonomy(data, fit),
    catalogScope,
    tier: 2,
    popularityScore: 50,
    marketSignal: null,
    aliases: [],
    recommendable,
    selectionEligible,
    cnEvidenceTier,
    sourceCheckedAt,
    recordType,
    cnAvailability: inferChinaAvailability(data),
    complianceNote: data.categoryId === 'helmet'
      ? '国内使用前请核对该具体型号的 GB 811-2022 标志、生产信息与正规销售渠道。'
      : '',
    ...data,
    fit,
    taxonomy: inferredTaxonomy(data, fit),
    canonicalFamilyId: data.canonicalFamilyId || CANONICAL_FAMILY_BY_ID[data.id] || data.id,
    recordType,
    catalogScope,
    recommendable,
    selectionEligible,
    cnEvidenceTier,
    sourceCheckedAt,
    sourceType,
    reviewSummary,
    marketSignal,
    // 旧候选有的只留了品牌资料链接。目录浏览也必须能回到一个可核验来源，
    // 因此按“显式来源 → 品牌资料 → 公开快照”的顺序补齐，但不把它升级成在售证明。
    sourceUrl: data.sourceUrl || data.officialUrl || data.reviewUrl || ''
  };
};

export const PRODUCT_CATALOG = Object.freeze([
  // 头盔
  item({ id:'helmet-scoyco-entry', categoryId:'helmet', brand:'赛羽', model:'入门全盔方向（具体型号按在售核验）', priceBand:'约300—900元', tier:1, confidence:'low', sourceType:'品牌产品线+平台核验', officialUrl:'https://jp.scoyco.com/products.html', fit:{ usage:['city'], budget:['entry'], style:['stealth','race'] }, idealFor:'预算压得很紧、愿意先线下试戴并核对GB 811-2022的人。', reviewSummary:'可作为低预算候选池，但不把品牌名直接等同于安全；必须逐个型号核对标准、生产日期、扣具、镜片、尺码和售后。', compromise:'放弃更好的气动、风噪、内衬与做工，先保住合规和合头。' }),
  item({ id:'helmet-hjc-c10', categoryId:'helmet', brand:'HJC', model:'C10', priceBand:'约900—1500元', tier:1, confidence:'high', officialUrl:'https://hjchelmets.eu/products/c10-full-face-motorcycle-helmet', fit:{ usage:['city','sport'], budget:['entry','mid'], style:['stealth','race'] }, idealFor:'入门街道、通勤和偶尔跑山，想要正规品牌基础全盔的人。', reviewSummary:'官方定位为聚碳酸酯全盔，提供通风、可拆洗内衬、Pinlock预留和蓝牙耳机槽；重点仍是头型是否匹配。', compromise:'内置遮阳与高端气动不是重点，配置取向更基础。' }),
  item({ id:'helmet-ls2-storm2', categoryId:'helmet', brand:'LS2', model:'FF800 Storm II（地区/存量版本待核验）', priceBand:'约1000—1800元', tier:2, confidence:'low', sourceType:'品牌历史/地区产品资料', officialUrl:'https://ls2helmets.com/helmets/full-face/storm-ii', catalogScope:'directory', recordType:'archived', cnAvailability:'地区/存量版本资料；中国大陆具体版本、库存与认证标志待核验，不作为默认推荐', recommendable:false, fit:{ usage:['city','touring'], budget:['mid'], priority:['glasses','heat'], style:['stealth','race'] }, idealFor:'仅供查找旧代/地区旅行全盔资料；准备购买时优先比较当前代产品和正规渠道信息。', reviewSummary:'资料页曾列出 KPA 壳体、内置遮阳等配置；不能据此判断中国大陆当前版本、在售状态或认证标志。', compromise:'不作为默认推荐；同名库存需逐一核对具体版本、生产日期、尺码与合规信息。' }),
  item({ id:'helmet-hjc-i71', categoryId:'helmet', brand:'HJC', model:'i71', priceBand:'约1800—3000元', tier:2, confidence:'high', officialUrl:'https://hjchelmets.eu/pages/i71', fit:{ usage:['touring','city'], budget:['mid','high'], priority:['glasses','heat'], style:['stealth','premium'] }, idealFor:'偏运动旅行、需要内置遮阳和日常便利的人。', reviewSummary:'官方定位为运动旅行全盔，强调通风、可调内遮阳、Pinlock预留与SMART HJC耳机兼容。', compromise:'比纯运动盔更便利，但结构和重量更偏旅行取向。' }),
  item({ id:'helmet-shoei-z8', categoryId:'helmet', brand:'SHOEI', model:'Z-8', priceBand:'约3500—5500元', tier:3, confidence:'high', sourceType:'中文官方具体型号页', sourceLabel:'SHOEI 中国官网：Z-8 产品页', sourceUrl:'https://www.shoei-shanghai.com.cn/product/full-face/Z8.html', officialUrl:'https://www.shoei-shanghai.com.cn/product/full-face/Z8.html', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'SHOEI 中国官网列出 Z-8 的具体颜色、尺码和建议零售价；实际经销商库存、生产批次与 GB 标志需下单前核验', fit:{ usage:['sport','city'], budget:['high','premium'], priority:['weight','noise'], style:['premium','race','stealth'] }, idealFor:'街道运动、跑山和重视轻盈、包裹、做工的人。', reviewSummary:'中文官网列出 Z-8 的具体颜色、尺码、建议零售价、重量和 D 环扣信息；这证明产品型号资料可公开核对，不替代实时库存。', compromise:'价格高，没有内置遮阳，头型不合仍然会压痛。' }),
  item({ id:'helmet-shoei-gtair3', categoryId:'helmet', brand:'SHOEI', model:'GT-Air 3', priceBand:'约4500—7000元', tier:4, confidence:'high', sourceType:'中文官方具体型号页', sourceLabel:'SHOEI 中国官网：GT-Air 3 产品页', sourceUrl:'https://www.shoei-shanghai.com.cn/product/full-face/GTAir3.html', officialUrl:'https://www.shoei-shanghai.com.cn/product/full-face/GTAir3.html', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'SHOEI 中国官网列出 GT-Air 3 的具体颜色、尺码和建议零售价；实际经销商库存、生产批次与 GB 标志需下单前核验', fit:{ usage:['touring'], budget:['premium'], priority:['noise','glasses'], style:['premium','stealth'] }, idealFor:'长途摩旅、重视安静、便利和长期佩戴的人。', reviewSummary:'中文官网列出 GT-Air 3 的具体颜色、尺码和建议零售价；产品资料可核验，但不把页面当作经销商实时库存。', compromise:'体积、重量和价格都高于纯运动轻量盔。' }),
  item({ id:'helmet-shoei-x15', categoryId:'helmet', brand:'SHOEI', model:'X-Fifteen', priceBand:'约5500—8500元以上', tier:5, confidence:'high', sourceType:'中文官方具体型号页', sourceLabel:'SHOEI 中国官网：X-Fifteen 产品页', sourceUrl:'https://www.shoei-shanghai.com.cn/product/full-face/XFifteen.html', officialUrl:'https://www.shoei-shanghai.com.cn/product/full-face/XFifteen.html', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'SHOEI 中国官网列出 X-Fifteen 的具体色号、尺码和建议零售价；实际经销商库存、生产批次与 GB 标志需下单前核验', fit:{ usage:['track'], budget:['premium'], priority:['weight','heat'], style:['race','premium'] }, idealFor:'明确有赛道或高速运动需求、低伏视野和气动优先的人。', reviewSummary:'中文官网列出 X-Fifteen 的具体色号、尺码、建议零售价、重量和 D 环扣信息；这是国内型号资料线索，不是实时库存承诺。', compromise:'通勤穿脱、低速安静、便利和价格都不是优势。' }),

  // 手套
  item({ id:'glove-scoyco-urban', categoryId:'gloves', brand:'赛羽', model:'春夏短护腕通勤系列', priceBand:'约100—300元', tier:1, confidence:'medium', officialUrl:'https://www.scoyco-japan.com/products', fit:{ usage:['city'], protection:['urban'], feel:['thin'], season:['hot','mild'], style:['stealth','match'] }, idealFor:'城市通勤、频繁穿脱、重视油门和刹车手感的人。', reviewSummary:'品牌产品线覆盖春夏手套；具体型号应核对掌根耐磨、腕带固定、掌宽与指长。', compromise:'短护腕和轻量结构的覆盖、固定和高速耐磨上限较低。' }),
  item({ id:'glove-astar-smx1', categoryId:'gloves', brand:'Alpinestars', model:'SMX-1 Air V2', priceBand:'约450—800元', tier:2, confidence:'high', officialUrl:'https://www.alpinestars.com/collections/all-road-products/products/smx-1-air-v2-gloves', fit:{ usage:['city','mountain'], protection:['urban','roadSport'], feel:['thin','balanced'], season:['hot','mild'], style:['race','stealth'] }, idealFor:'夏季城市和街道运动，想要较好抓握、通风和基础硬壳防护的人。', reviewSummary:'官方说明其采用穿孔皮革和网布，定位街道/城市，强调掌部抓握区和操作灵敏度。', compromise:'短护腕，腕部覆盖和赛道级掌根结构有限。' }),
  item({ id:'glove-astar-sp8', categoryId:'gloves', brand:'Alpinestars', model:'SP-8 V3', priceBand:'约850—1500元', tier:3, confidence:'high', officialUrl:'https://www.alpinestars.com/products/sp-8-v3', fit:{ usage:['mountain','touring'], protection:['roadSport'], feel:['balanced','breakin'], season:['mild'], style:['race','match','stealth'] }, idealFor:'跑山、街道运动和想要长护腕但不想上纯赛道的人。', reviewSummary:'官方定位为带赛车基因的通用街道手套，山羊皮、预弯和掌拇指抓握区兼顾保护与活动。', compromise:'比短手套热、穿脱慢，掌心反馈仍不如轻量通勤手套直接。' }),
  item({ id:'glove-scoyco-sr8', categoryId:'gloves', brand:'赛羽', model:'SR-8公路赛道手套', priceBand:'约600—1200元', tier:3, confidence:'medium', officialUrl:'https://jp.scoyco.com/products.html', fit:{ usage:['mountain','track'], protection:['race','roadSport'], feel:['breakin','protectFirst'], season:['mild'], style:['race','match'] }, idealFor:'预算有限、想体验长护腕和赛道结构，又能接受先试尺码的人。', reviewSummary:'官方产品目录列有SR-8公路赛道手套；购买前应重点核对掌根滑块、双腕带、预弯和缝线。', compromise:'版型与皮料手感需要实际试戴，不能只看赛道外形。' }),
  item({ id:'glove-astar-gppro', categoryId:'gloves', brand:'Alpinestars', model:'GP Pro R4', priceBand:'约1800—3000元', tier:5, confidence:'high', officialUrl:'https://www.alpinestars.com/products/gp-pro-r4-gloves', fit:{ usage:['track'], protection:['race'], feel:['protectFirst','breakin'], season:['mild'], style:['race'] }, idealFor:'赛道日、明确高速摔车风险、愿意牺牲通勤舒适的人。', reviewSummary:'当前产品页对应 GP Pro R4；购买前仍要按手掌宽度、指长、预弯和腕部固定实际试戴。', compromise:'更紧、更硬、更热，低速操作反馈会明显减弱，日常穿戴率较低。' }),

  // 骑行服/护具
  item({ id:'armor-scoyco-mesh', categoryId:'armor', brand:'赛羽', model:'网眼通勤骑行服系列', priceBand:'约400—1000元', tier:1, confidence:'medium', officialUrl:'https://www.scoyco-japan.com/shop', fit:{ usage:['commute'], climate:['hot','mild'], wearing:['fast','normal'], look:['daily','sport'], priority:['heat','ugly'] }, idealFor:'夏季通勤、想提高真实穿戴率的人。', reviewSummary:'品牌当前产品线覆盖夹克、裤装和护具；具体型号需核对肩肘背护具、耐磨区和版型。', compromise:'轻量网眼服的耐磨、覆盖和高速保护上限有限。' }),
  item({ id:'armor-astar-smxair', categoryId:'armor', brand:'Alpinestars', model:'SMX Air Jacket', priceBand:'约1400—2600元', tier:2, confidence:'high', officialUrl:'https://eu.alpinestars.com/products/smx-air-jacket-black-anthracite', fit:{ usage:['commute','sport'], climate:['hot','mild'], wearing:['normal'], look:['sport'], priority:['heat','ugly'] }, idealFor:'夏季街道运动、重视通风和运动外观的人。', reviewSummary:'官方产品为高流量网眼运动夹克，带肩部滑块风格，适合热天街道使用。', compromise:'防雨、低温和长途多天气能力需要额外分层。' }),
  item({ id:'armor-revit-sand4', categoryId:'armor', brand:'REV’IT!', model:'Sand 4 H2O系列', priceBand:'约3000—6000元', tier:4, confidence:'medium', officialUrl:'https://www.revitsport.com/', fit:{ usage:['touring'], climate:['mild','rain','cold'], wearing:['normal','layer'], look:['adv'], priority:['move','weak'] }, idealFor:'多天气摩旅、重视分层和储物的人。', reviewSummary:'典型多层摩旅体系，适合温差、雨水和长途；具体代际与在售状态应在官网和经销商核验。', compromise:'体积、重量、价格和穿脱复杂度都高。' }),
  item({ id:'armor-astar-leather', categoryId:'armor', brand:'Alpinestars', model:'街道运动皮衣系列', priceBand:'约3000—8000元', tier:4, confidence:'medium', officialUrl:'https://www.alpinestars.com/collections/motorcycle-jackets', fit:{ usage:['sport'], climate:['mild'], wearing:['full'], look:['leather','sport'], priority:['move','weak'] }, idealFor:'跑山和街道运动，重视耐磨、贴身固定和整体造型的人。', reviewSummary:'皮衣系列更强调耐磨和贴身固定；应根据骑姿、胸围、腰围和护具位置试穿。', compromise:'更热、更重、走路和穿脱更麻烦。' }),
  item({ id:'armor-track-suit', categoryId:'armor', brand:'Alpinestars / Dainese', model:'连体赛道皮衣方向', priceBand:'约7000—20000元以上', tier:5, confidence:'medium', officialUrl:'https://www.alpinestars.com/collections/motorcycle-suits', fit:{ usage:['track'], climate:['mild'], wearing:['full'], look:['leather','sport'], priority:['weak'] }, idealFor:'赛道使用、接受专业试穿和可能改尺寸的人。', reviewSummary:'连体皮衣是赛道取向，保护、耐磨和护具固定最强，品牌只是候选，合身比Logo重要。', compromise:'通勤几乎不实用，热、重、贵、穿脱慢。' }),

  // 骑行靴
  item({ id:'boot-scoyco-mt016', categoryId:'boots', brand:'赛羽', model:'MT016-2城市骑行鞋', priceBand:'约350—700元', tier:1, confidence:'medium', officialUrl:'https://www.scoyco-japan.com/shop', fit:{ usage:['city'], walk:['much','work','normal'], feel:['sensitive','newbie'], weather:['no','sometimes'], style:['sneaker','sport'] }, idealFor:'城市通勤、下车走路多、想保留换挡脚感的人。', reviewSummary:'官网产品列表显示MT016-2；购买前应核对脚踝支撑、鞋底横向抗扭和换挡区。', compromise:'走路舒服，但高筒覆盖、胫骨和赛道级抗扭有限。' }),
  item({ id:'boot-scoyco-mt107wp', categoryId:'boots', brand:'赛羽', model:'MT107WP防水骑行靴', priceBand:'约600—1200元', tier:2, confidence:'medium', officialUrl:'https://www.scoyco-japan.com/shop', fit:{ usage:['touring','city'], walk:['normal'], feel:['balanced','newbie'], weather:['yes','cold','sometimes'], style:['adv','sport'] }, idealFor:'预算有限的摩旅、雨天和中高筒需求。', reviewSummary:'官网现有产品列表包含MT107WP；WP方向通常以防水和全天使用为主，仍需试脚型。', compromise:'防水层会更热，鞋头和脚感可能比城市鞋更钝。' }),
  item({ id:'boot-astar-smxs', categoryId:'boots', brand:'Alpinestars', model:'SMX S', priceBand:'约1400—2400元', tier:3, confidence:'medium', officialUrl:'https://www.fc-moto.com/zh-cn/p/alpinestars-smx-s-mo-tuo-che-xue-APS-2223517.v', fit:{ usage:['sport'], walk:['little','normal'], feel:['balanced','protect'], weather:['no'], style:['sport'] }, idealFor:'街道运动和入门赛道，想要高筒保护但不追最硬赛靴的人。', reviewSummary:'产品资料强调超细纤维鞋面、支撑与性能结构，属于街道/赛道之间的运动靴。', compromise:'走路和夏季舒适不如城市骑行鞋。' }),
  item({ id:'boot-astar-smx6v3', categoryId:'boots', brand:'Alpinestars', model:'SMX-6 V3', priceBand:'约2200—3500元', tier:4, confidence:'high', officialUrl:'https://www.alpinestars.com/collections/smx-boots/products/smx-6-v3-boots', fit:{ usage:['sport','track'], walk:['little'], feel:['protect','balanced'], weather:['no'], style:['sport'] }, idealFor:'跑山、赛道日和重视脚踝抗扭、胫骨与滑块的人。', reviewSummary:'官方在售运动靴系列，具有TPU护板、脚踝支撑和可更换滑块等赛道/街道结构。', compromise:'硬、热、走路累，换挡脚感需要重新适应。' }),
  item({ id:'boot-astar-smx6gtx', categoryId:'boots', brand:'Alpinestars', model:'SMX-6 V3 Gore-Tex', priceBand:'约3000—4500元', tier:5, confidence:'high', officialUrl:'https://www.alpinestars.com/collections/road-track-boots/products/smx-6-v3-goretex-boots', fit:{ usage:['touring','sport'], walk:['little','normal'], feel:['protect'], weather:['yes','cold'], style:['sport'] }, idealFor:'长途和多雨环境，又不愿放弃运动高筒保护的人。', reviewSummary:'官方提供Gore-Tex版本，兼顾运动结构和防水。', compromise:'价格高、通风和轻便性不如无膜版本。' }),

  // 三箱/行李
  item({ id:'luggage-softbag', categoryId:'luggage', brand:'通用可靠品牌', model:'防水尾包/坐垫包方向', priceBand:'约200—800元', tier:1, confidence:'medium', officialUrl:'', fit:{ usage:['commute','touring'], system:['seat','soft'], road:['city','mixed'], volume:['small','medium'], look:['clean','hidden'] }, idealFor:'小车、仿赛、街车和不想长期背支架的人。', reviewSummary:'轻、对重心影响小，适合作为第一套装载；重点核对固定带、防烫和防水。', compromise:'防盗、快速开合和大容量不如硬箱。' }),
  item({ id:'luggage-shad-top', categoryId:'luggage', brand:'SHAD', model:'SH系列尾箱方向', priceBand:'约700—2500元', tier:2, confidence:'medium', officialUrl:'https://www.shad.es/', fit:{ usage:['commute','passenger'], system:['topbox'], road:['city','highway'], volume:['small','medium'], look:['practical','clean'] }, idealFor:'通勤、放头盔和经常开合的人。', reviewSummary:'成熟尾箱体系，优势是便利、锁扣和支架适配；应按车型支架与真实载荷选。', compromise:'重心高且靠后，装重物会明显影响操控。' }),
  item({ id:'luggage-givi-trekker', categoryId:'luggage', brand:'GIVI', model:'Trekker / Outback系列', priceBand:'约3000—10000元以上', tier:4, confidence:'medium', officialUrl:'https://www.givi.it/', fit:{ usage:['touring','camp'], system:['hard3'], road:['highway','mixed'], volume:['large','huge'], look:['adv'] }, idealFor:'中大型ADV、多日摩旅和需要完整硬箱体系的人。', reviewSummary:'品牌长期提供尾箱、边箱、支架与备件体系；具体箱体宽度和支架承载必须按车型核对。', compromise:'宽、重、贵、风阻大，低速和钻缝更麻烦。' }),
  item({ id:'luggage-soft-adv', categoryId:'luggage', brand:'Giant Loop / Enduristan', model:'软边包系统方向', priceBand:'约2000—6000元', tier:3, confidence:'medium', officialUrl:'https://www.giantloopmoto.com/', fit:{ usage:['touring','camp'], system:['soft'], road:['mixed','offroad'], volume:['large','huge'], look:['adv','hidden'] }, idealFor:'非铺装、摔车概率高和重视低重心的人。', reviewSummary:'软包更轻、可变形，烂路对副车架冲击更小；重点是固定、防烫和防水组织。', compromise:'防盗和快速开合较弱，整理成本高。' }),

  // 射灯
  item({ id:'light-cutoff-budget', categoryId:'lights', brand:'正规国产品牌', model:'小体积有截止铺路灯方向', priceBand:'约400—1200元含基础线束', tier:1, confidence:'low', officialUrl:'', fit:{ usage:['city','touring'], beam:['cutoff'], electric:['unknown','basic'], control:['simple','highbeam'], look:['hidden','factory'] }, idealFor:'城市和夜间国道，优先不晃人、近场铺路的人。', reviewSummary:'具体品牌变化快，必须看同曝光光型、截止、线束、保险和售后，不按流明宣传直接推荐。', compromise:'远射能力有限，极端夜路仍需控制车速。' }),
  item({ id:'light-denali-d3', categoryId:'lights', brand:'DENALI', model:'D3系列方向', priceBand:'约2500—5000元', tier:3, confidence:'medium', officialUrl:'https://denalielectronics.com/', fit:{ usage:['touring','fog'], beam:['cutoff','spot'], electric:['basic','ready'], control:['highbeam','smart','split'], look:['factory','performance'] }, idealFor:'中高预算摩旅、重视线束和控制体系的人。', reviewSummary:'成熟辅助灯和控制器生态，适合规范布线与分区控制；具体镜片和版本需按用途选。', compromise:'价格高，安装与控制器配置更复杂。' }),
  item({ id:'light-baja-squadron', categoryId:'lights', brand:'Baja Designs', model:'Squadron系列方向', priceBand:'约3000—7000元', tier:4, confidence:'medium', officialUrl:'https://www.bajadesigns.com/', fit:{ usage:['offroad'], beam:['flood','combo','spot'], electric:['ready','modified'], control:['split','smart'], look:['adv','performance'] }, idealFor:'非铺装、拉力和有专业电路安装能力的人。', reviewSummary:'高性能越野照明方向，光量和镜片组合丰富，更适合非铺装与封闭环境。', compromise:'公共道路眩光风险和电路负担更高，必须可关闭并规范调校。' }),
  item({ id:'light-fog-low', categoryId:'lights', brand:'正规国产品牌', model:'低位雾灯/宽近场方向', priceBand:'约600—1800元含线束', tier:2, confidence:'low', officialUrl:'', fit:{ usage:['fog','touring'], beam:['flood','cutoff'], electric:['basic','ready'], control:['simple','split'], look:['hidden','factory','adv'] }, idealFor:'雨雾、山路弯道和低位宽近场补光。', reviewSummary:'应优先低色温、低位安装和可控光型，过曝宣传图不能当证据。', compromise:'照得宽但不等于照得远，错误角度仍会反光和晃人。' }),

  // 蓝牙耳机/对讲
  item({ id:'intercom-alien-et002', categoryId:'intercom', brand:'外星蜗牛', model:'ET002', priceBand:'约80—150元', tier:1, confidence:'low', sourceType:'公开评测', reviewUrl:'https://www.bilibili.com/video/BV1Qu7WzLEqj/', fit:{ group:['solo'], priority:['nav','music'], helmetFit:['normal','large'], operation:['simple','buttons'], look:['hidden','notcare'] }, idealFor:'极低预算，只要导航、电话和能响，不追多人对讲的人。', reviewSummary:'公开视频以约82元极低价格、能正常播放并做了泡水测试为卖点。只能作为“能用型”候选，不把单次视频当长期耐久结论。', compromise:'不期待高质量高速麦克风、成熟组网、顶级音质和完善售后。' }),
  item({ id:'intercom-hengjiang-bt30', categoryId:'intercom', brand:'恒疆', model:'BT30', priceBand:'约100—250元', tier:1, confidence:'low', sourceType:'电商在售信号', officialUrl:'https://mall.jd.com/index-13264821.html', fit:{ group:['solo'], priority:['nav','call'], helmetFit:['tight','normal'], operation:['simple','buttons'], look:['hidden','slim'] }, idealFor:'外卖/通勤、单人导航电话、预算较低的人。', reviewSummary:'京东旗舰店在售定位为内置一体式、长续航、降噪方向；需重点核对全盔/半盔麦克风版本和售后。', compromise:'多人对讲和音质上限不是重点。' }),
  item({ id:'intercom-hengjiang-c50', categoryId:'intercom', brand:'恒疆', model:'C50', priceBand:'约200—400元', tier:2, confidence:'medium', sourceType:'旗舰店+公开评测', officialUrl:'https://mall.jd.com/index-13264821.html', reviewUrl:'https://www.bilibili.com/video/BV1tb4y1G7my/', fit:{ group:['solo','pair','small'], priority:['music','talk','nav'], helmetFit:['normal','large'], operation:['buttons','simple'], look:['tech','notcare'] }, idealFor:'预算有限、要大音量、低音和基础跨品牌互联的人。', reviewSummary:'公开评测称其音量大、低音够用、声音饱满，200元级可考虑；品牌店也持续在售C50。', compromise:'不能把宣传的多人互联等同于高端Mesh稳定性，高速麦克风、重连和长期电池要看更多反馈。' }),
  item({ id:'intercom-ejeas-e1', categoryId:'intercom', brand:'爱骑仕', model:'E1+', priceBand:'官方价约239元', tier:2, confidence:'high', officialUrl:'https://www.ejeas.cn/products/', fit:{ group:['solo'], priority:['nav','call','music'], helmetFit:['tight','normal'], operation:['buttons','simple'], look:['slim','hidden'] }, idealFor:'单人通勤、只需要导航电话和基础音乐的人。', reviewSummary:'官方将E1+归为头盔蓝牙耳机，不是多人组网主力；适合把功能做简单。', compromise:'不适合把多人车队对讲当核心需求。' }),
  item({ id:'intercom-ejeas-v6', categoryId:'intercom', brand:'爱骑仕', model:'V6 Pro+', priceBand:'官方促销约298元', tier:2, confidence:'high', sourceType:'中文官方具体型号页', sourceLabel:'爱骑仕中国官网：V6 Pro+ 产品页', sourceUrl:'https://www.ejeas.cn/product/v6-pro/', officialUrl:'https://www.ejeas.cn/product/v6-pro/', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'爱骑仕中国官网展示 V6 Pro+ 的具体产品页、价格与规格；实际促销、库存、包装版本和售后渠道需下单前确认', fit:{ group:['pair'], priority:['talk','nav'], helmetFit:['normal','large'], operation:['buttons','simple'], look:['tech','notcare'] }, idealFor:'两人固定搭档、预算有限、要较长续航的人。', reviewSummary:'中文官方产品页列出 V6 Pro+ 的价格、单/双包装内容、续航与保修资料；这不是第三方平台的实时库存接口。', compromise:'双人蓝牙对讲为主，不是高阶多人Mesh。' }),
  item({ id:'intercom-sena-5s', categoryId:'intercom', brand:'SENA', model:'5S', priceBand:'约800—1500元', tier:3, confidence:'high', sourceType:'SENA 中文具体型号页', sourceLabel:'SENA 中国：5S 产品页', sourceUrl:'https://senachina.com/product/5s/', officialUrl:'https://senachina.com/product/5s/', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'SENA 中文官网展示 5S 的具体型号与规格；实际版本、价格、库存和售后渠道需下单前确认', fit:{ group:['pair'], priority:['talk','nav','call'], helmetFit:['normal','large'], operation:['dial','buttons'], look:['tech','notcare'] }, idealFor:'两人对讲、重视旋钮盲操作、稳定和官方生态的人。', reviewSummary:'SENA 中文产品页列出 5S 的蓝牙 5、高清音频、对讲、LCD 与 Jog Dial 等资料；页面不是实时库存承诺。', compromise:'只支持双人，不适合多人车队；价格高于国产双人方案。' }),
  item({ id:'intercom-vimoto-v10x', categoryId:'intercom', brand:'维迈通', model:'V10X', priceBand:'约450—800元（活动浮动大）', tier:3, confidence:'high', sourceType:'维迈通中文具体型号页', sourceLabel:'维迈通：V10X 产品页', sourceUrl:'https://www.vimoto.com/headset/v10x', officialUrl:'https://www.vimoto.com/headset/v10x', reviewUrl:'https://www.bilibili.com/video/BV14G1RYpEkT/', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'维迈通中文官网展示 V10X 的具体产品页与规格资料；实际版本、价格、库存和车队兼容性需购买前确认', fit:{ group:['solo','pair','small','large'], priority:['music','talk','nav'], helmetFit:['normal','large'], operation:['buttons','voice'], look:['tech','notcare'] }, idealFor:'国内车队生态、音乐与多人对讲都想兼顾的人。', reviewSummary:'中文官方产品页列出 V10X 的产品资料及其声学、降噪和组网卖点；涉及实验室数据的宣传不作为独立实测结论。', compromise:'功能多意味着设置和生态更复杂，具体车队兼容性要提前统一。' }),
  item({ id:'intercom-asmax-z1', categoryId:'intercom', brand:'ASMAX', model:'Z1', priceBand:'约700—1300元（平台波动）', tier:3, confidence:'medium', officialUrl:'https://www.asmax.net/', reviewUrl:'https://www.bilibili.com/video/BV1LH4y1Z7HZ/', fit:{ group:['solo','pair','small'], priority:['music','nav','talk'], helmetFit:['normal','large'], operation:['voice','buttons'], look:['tech'] }, idealFor:'喜欢智能语音、外观和新品牌生态，愿意研究APP的人。', reviewSummary:'官方将Z1定位为Z世代骑行头盔蓝牙耳机；公开深度体验视频讨论F1/Z1的性价比。', compromise:'生态与长期售后认知不如老牌成熟，建议看固件、APP和售后反馈。' }),
  item({ id:'intercom-asmax-s2', categoryId:'intercom', brand:'ASMAX', model:'S2', priceBand:'海外官方约15899日元，国内价需核验', tier:3, confidence:'high', officialUrl:'https://asmax.customjapan.net/', fit:{ group:['solo','pair','small'], priority:['talk','nav'], helmetFit:['tight','normal'], operation:['voice','buttons'], look:['slim','tech'] }, idealFor:'想要较轻机身、入门Mesh与语音操作的人。', reviewSummary:'日本官方标注41g、HiFi、ENC、快充、蓝牙5.4，定位入门Mesh。', compromise:'国内渠道价格与售后需核验，音质和大车队上限低于旗舰。' }),
  item({ id:'intercom-ejeas-q8', categoryId:'intercom', brand:'爱骑仕', model:'Q8', priceBand:'官方促销约598元', tier:3, confidence:'high', sourceType:'中文官方具体型号页', sourceLabel:'爱骑仕中国官网：Q8 产品页', sourceUrl:'https://www.ejeas.cn/product/q8/', officialUrl:'https://www.ejeas.cn/product/q8/', reviewUrl:'https://www.bilibili.com/video/BV13KpceMEB3/', sourceCheckedAt:'2026-07-23', cnEvidenceTier:'cn_exact_public', cnAvailability:'爱骑仕中国官网展示 Q8 的具体产品页、价格与规格；实际促销、库存、包装版本和售后渠道需下单前确认', fit:{ group:['small'], priority:['talk','nav'], helmetFit:['normal','large'], operation:['buttons','simple'], look:['tech','notcare'] }, idealFor:'6人以内固定车队、预算有限、需要Mesh自动重连思路的人。', reviewSummary:'中文官方产品页列出 Q8 的价格、6 人 Mesh、续航和包装资料；标称距离只适用于理想条件，实际需以路况与车队实测为准。', compromise:'人数和距离是理想条件，跨品牌与复杂地形不能按宣传上限理解。' }),
  item({ id:'intercom-vimoto-v11x', categoryId:'intercom', brand:'维迈通', model:'V11X', priceBand:'约900—1500元（平台核验）', tier:4, confidence:'medium', officialUrl:'https://www.vimoto.com/', fit:{ group:['small','large'], priority:['music','talk'], helmetFit:['normal','large'], operation:['voice','buttons'], look:['tech'] }, idealFor:'希望维迈通最新一代体验、固定车队统一生态的人。', reviewSummary:'官网当前产品阵列将V11X列为主力新型号；具体规格与价格应进入官方详情和平台核验。', compromise:'新品实际长期稳定与价格性价比需要更多用户周期反馈。' }),
  item({ id:'intercom-cardo-spirit-hd', categoryId:'intercom', brand:'Cardo', model:'Spirit HD', priceBand:'约900—1500元', tier:3, confidence:'high', officialUrl:'https://cardosystems.cn/', fit:{ group:['pair'], priority:['music','nav','call'], helmetFit:['tight','normal'], operation:['voice','buttons'], look:['slim','stealth'] }, idealFor:'两人或单人、重视防水和音质、无需大Mesh车队的人。', reviewSummary:'Cardo官网产品线中Spirit HD为基础高清音频方向，品牌强调防水与语音生态。', compromise:'多人组网和旗舰JBL/DMC能力有限。' }),
  item({ id:'intercom-cardo-freecom4x', categoryId:'intercom', brand:'Cardo', model:'Freecom 4X', priceBand:'约1800—2800元', tier:4, confidence:'high', officialUrl:'https://cardosystems.cn/', fit:{ group:['pair','small'], priority:['music','talk','call'], helmetFit:['normal','large'], operation:['voice','buttons'], look:['slim','premium'] }, idealFor:'2—4人、重视JBL音质、语音和防水，但不需要大Mesh的人。', reviewSummary:'Cardo官网将Freecom 4X列为中高阶产品，适合多数普通骑士的蓝牙对讲和JBL音频。', compromise:'价格高于国产，复杂车队Mesh不如Packtalk。' }),
  item({ id:'intercom-asmax-f1pro', categoryId:'intercom', brand:'ASMAX', model:'F1 Pro', priceBand:'约1800—2600元（渠道波动）', tier:4, confidence:'high', officialUrl:'https://www.asmaxmoto.com/Products', fit:{ group:['small','large'], priority:['music','talk'], helmetFit:['normal','large'], operation:['voice'], look:['tech'] }, idealFor:'重视音质、智能语音、Mesh与新生态的人。', reviewSummary:'官方称其为现实骑行的智能对讲，品牌强调声学实验室、Mesh和语音控制。', compromise:'价格和生态接近高端，实际车队最好统一品牌并先测试。' }),
  item({ id:'intercom-sena-50s', categoryId:'intercom', brand:'SENA', model:'50S', priceBand:'约2500—3800元', tier:5, confidence:'high', officialUrl:'https://senachina.com/', fit:{ group:['large'], priority:['talk','music'], helmetFit:['normal','large'], operation:['dial','voice'], look:['tech','premium'] }, idealFor:'多人Mesh车队、重视哈曼卡顿音频和成熟生态的人。', reviewSummary:'SENA中国将50S列为哈曼卡顿音效与Mesh通信主力，适合统一SENA生态的车队。', compromise:'价格高，跨品牌组队不如同生态顺滑，机身与功能更复杂。' }),
  item({ id:'intercom-cardo-edge', categoryId:'intercom', brand:'Cardo', model:'Packtalk Edge', priceBand:'约2800—4200元', tier:5, confidence:'high', officialUrl:'https://cardosystems.cn/', reviewUrl:'https://www.bilibili.com/video/BV1nS4y1v7G9/', fit:{ group:['large'], priority:['talk','music'], helmetFit:['normal','large'], operation:['voice','buttons'], look:['premium','tech'] }, idealFor:'多人DMC车队、重视JBL、防水、自然语音和磁吸底座的人。', reviewSummary:'官网强调JBL、防水、DMC动态网络和自然语音；公开体验视频讨论磁吸底座与使用体验。', compromise:'价格高，车队不统一Cardo时价值会打折。' }),

  // 防盗
  item({ id:'theft-disc-basic', categoryId:'theft', brand:'正规锁具品牌', model:'带提醒绳碟刹锁方向', priceBand:'约100—400元', tier:1, confidence:'medium', fit:{ parking:['indoor','monitored','uncertain'], value:['low','mid'], anchor:['no','sometimes'], convenience:['fast'], look:['visible','clean'] }, idealFor:'临停和基础提醒，不想每天扛重锁的人。', reviewSummary:'主要作用是增加操作时间和防止忘锁，不阻止整车被抬走。', compromise:'不能单独承担高风险露天停车。' }),
  item({ id:'theft-abus-8077', categoryId:'theft', brand:'ABUS', model:'GRANIT Detecto XPlus 8077方向', priceBand:'约1000—1800元', tier:3, confidence:'medium', officialUrl:'https://www.abus.com/', fit:{ parking:['monitored','outdoor','uncertain'], value:['mid','high','premium'], anchor:['no','sometimes'], convenience:['normal'], look:['visible','notcare'] }, idealFor:'高价值车、临停、需要较强锁体和报警威慑的人。', reviewSummary:'高等级报警碟刹锁方向，锁体和威慑强；仍不能阻止多人抬车。', compromise:'重、贵、携带麻烦，忘记解锁可能伤碟盘。' }),
  item({ id:'theft-moni9', categoryId:'theft', brand:'Monimoto', model:'Monimoto 9方向', priceBand:'约1500—2500元+服务费', tier:4, confidence:'medium', officialUrl:'https://monimoto.com/', fit:{ parking:['outdoor','uncertain'], value:['high','premium'], anchor:['no','sometimes'], convenience:['normal','full'], look:['hidden'] }, idealFor:'露天停车、高价值车、重视独立定位和异常通知的人。', reviewSummary:'独立摩托车定位报警方向；应核对蜂窝网络、订阅、续航和国内可用性。', compromise:'定位只能帮助发现和追踪，不能替代机械阻碍与合法处置。' }),
  ...EXPANDED_PRODUCT_CATALOG.map(item),
  ...DIRECTORY_PRODUCT_CATALOG.map(item),

  item({ id:'theft-layered', categoryId:'theft', brand:'组合方案', model:'固定物重链+双定位+车罩', priceBand:'约1500—5000元', tier:5, confidence:'medium', fit:{ parking:['outdoor','uncertain'], value:['high','premium'], anchor:['yes','sometimes'], convenience:['full','managed'], look:['visible','hidden','notcare'] }, idealFor:'长期露天、高价值和改装投入高的人。', reviewSummary:'不同逻辑叠加：实体阻碍、报警、隐蔽追踪、降低目标暴露和保障材料。', compromise:'最麻烦、最重、最影响整洁；最优先仍是换更安全停车点。' })
]);

const HARD_MATCH_KEYS = {
  helmet: ['usage', 'helmetType'],
  gloves: ['usage', 'protection'],
  armor: ['usage', 'garmentType'],
  boots: ['usage', 'style'],
  luggage: ['system'],
  lights: ['usage', 'beam'],
  intercom: ['group'],
  theft: ['value']
};

const APPROXIMATE_KEY_BY_CATEGORY = Object.freeze({
  helmet: 'helmetType',
  gloves: 'protection',
  armor: 'garmentType',
  boots: 'style',
  luggage: 'system',
  lights: 'beam',
  intercom: 'group',
  theft: 'parking'
});

const APPROXIMATE_FALLBACKS = Object.freeze({
  helmet: {
    openFace: ['threeQuarter'],
    threeQuarter: ['retroFullFace', 'fullFace'],
    adv: ['fullFace', 'sportFullFace'],
    offroad: ['adv', 'fullFace'],
    modular: ['fullFace'],
    raceFullFace: ['sportFullFace', 'fullFace'],
    sportFullFace: ['fullFace'],
    retroFullFace: ['fullFace', 'threeQuarter'],
    fullFace: ['sportFullFace', 'modular']
  },
  gloves: {
    race: ['roadSport'],
    touring: ['roadSport', 'urban'],
    urban: ['roadSport'],
    roadSport: ['touring', 'urban']
  },
  armor: {
    onePieceLeather: ['twoPieceLeather'],
    twoPieceLeather: ['meshJacket', 'textileSuit'],
    advTouring: ['textileSuit', 'meshJacket'],
    armoredShirt: ['meshJacket'],
    ridingPants: ['protectiveJeans'],
    protectiveJeans: ['ridingPants'],
    textileSuit: ['meshJacket', 'advTouring'],
    meshJacket: ['textileSuit', 'armoredShirt']
  },
  boots: {
    offroad: ['adv'],
    adv: ['sport', 'sneaker'],
    sport: ['sneaker'],
    retro: ['sneaker'],
    sneaker: ['sport']
  },
  luggage: {
    hard3: ['topbox', 'soft'],
    soft: ['seat', 'topbox'],
    seat: ['soft', 'topbox'],
    topbox: ['hard3', 'soft']
  },
  lights: {
    flood: ['combo', 'cutoff'],
    combo: ['cutoff', 'spot'],
    spot: ['combo'],
    cutoff: ['combo']
  },
  intercom: {
    large: ['small'],
    small: ['pair'],
    pair: ['solo'],
    solo: ['pair']
  },
  theft: {
    outdoor: ['uncertain', 'monitored'],
    uncertain: ['outdoor', 'monitored'],
    monitored: ['indoor', 'uncertain'],
    indoor: ['monitored']
  }
});

function typeLabel(categoryId, key) {
  const typeKey = APPROXIMATE_KEY_BY_CATEGORY[categoryId] || typeKeyForCategory(categoryId);
  return TYPE_LABELS[typeKey]?.[key] || key || '';
}

function approximateTargets(categoryId, answers = {}) {
  const key = APPROXIMATE_KEY_BY_CATEGORY[categoryId] || typeKeyForCategory(categoryId);
  const requested = answers?.[key];
  const raw = APPROXIMATE_FALLBACKS[categoryId]?.[requested] || [];
  return { key, requested, alternatives: raw.filter(Boolean) };
}

function approximateFallbackReason(categoryId, answers = {}) {
  const { requested, alternatives } = approximateTargets(categoryId, answers);
  if (!requested || !alternatives.length) return '';
  const requestedLabel = typeLabel(categoryId, requested);
  const altLabels = alternatives.map((value) => typeLabel(categoryId, value)).filter(Boolean);
  if (!altLabels.length) return '';
  return `当前没有与你选择的“${requestedLabel}”完全匹配的可核验候选，可以先看下方近似方向：${altLabels.join(' / ')}。`;
}

function isApproximateCompatible(categoryId, product, answers) {
  const { key, requested, alternatives } = approximateTargets(categoryId, answers);
  if (!key || !requested || !alternatives.length) return false;
  if (!includesFit(product, key, alternatives[0]) && !alternatives.some((value) => includesFit(product, key, value))) return false;

  if (categoryId === 'helmet') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'helmetType', value));
  }
  if (categoryId === 'gloves') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'protection', value));
  }
  if (categoryId === 'armor') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'garmentType', value));
  }
  if (categoryId === 'boots') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'style', value));
  }
  if (categoryId === 'luggage') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'system', value));
  }
  if (categoryId === 'lights') {
    return includesFit(product, 'usage', answers.usage) && alternatives.some((value) => includesFit(product, 'beam', value));
  }
  if (categoryId === 'intercom') {
    return alternatives.some((value) => includesFit(product, 'group', value));
  }
  if (categoryId === 'theft') {
    return includesFit(product, 'value', answers.value) && alternatives.some((value) => includesFit(product, 'parking', value));
  }
  return false;
}

const includesFit = (product, key, value) => !value || product.fit?.[key]?.includes(value);

const isCoreCompatible = (categoryId, product, answers) => {
  if (categoryId === 'gloves' && answers.usage === 'track') {
    // 赛道场景不能因为保护选项自相矛盾而降成城市或摩旅手套。
    return includesFit(product, 'usage', 'track') && includesFit(product, 'protection', 'race');
  }

  if (categoryId === 'gloves') {
    // 复古和赛道是明确的结构/风格选择；其余风格不把选择范围压得过窄。
    const requiresStyle = ['retro', 'race'].includes(answers.style);
    return includesFit(product, 'usage', answers.usage)
      && includesFit(product, 'protection', answers.protection)
      && (!requiresStyle || includesFit(product, 'style', answers.style));
  }

  if (categoryId === 'boots') {
    return includesFit(product, 'usage', answers.usage)
      && includesFit(product, 'style', answers.style);
  }

  if (categoryId === 'luggage') {
    // 装载用途和系统会影响乘客空间、上下车与重心；非铺装还要额外限制路况适配。
    return includesFit(product, 'usage', answers.usage)
      && includesFit(product, 'system', answers.system)
      && (answers.road !== 'offroad' || includesFit(product, 'road', 'offroad'));
  }

  if (categoryId === 'lights' && answers.usage === 'city') {
    // 公共道路城市使用优先守住有截止的光型，不能因用户误选泛光而推荐眩光方案。
    return includesFit(product, 'usage', 'city') && includesFit(product, 'beam', 'cutoff');
  }

  if (categoryId === 'theft' && ['outdoor', 'uncertain'].includes(answers.parking)) {
    return includesFit(product, 'parking', answers.parking)
      && includesFit(product, 'value', answers.value)
      && includesFit(product, 'anchor', answers.anchor);
  }

  return (HARD_MATCH_KEYS[categoryId] || []).every((key) => includesFit(product, key, answers[key]));
};

const safetyPriority = (categoryId, product, answers) => {
  if (categoryId === 'theft' && ['outdoor', 'uncertain'].includes(answers.parking) && ['high', 'premium'].includes(answers.value)) {
    const canAnchor = ['yes', 'sometimes'].includes(answers.anchor);
    if (product.id === 'theft-layered') return canAnchor ? 120 : -20;
    if (product.id === 'theft-abus-chain') return canAnchor ? 70 : -30;
    if (product.id === 'theft-abus-8077') return canAnchor ? 35 : 120;
    if (product.id === 'theft-xena-xx15') return canAnchor ? 30 : 110;
    if (product.id === 'theft-kovix-alarm') return canAnchor ? 25 : 100;
    if (product.id === 'theft-moni9') return canAnchor ? 45 : 90;
    if (product.id === 'theft-gps-generic') return canAnchor ? 30 : 65;
    if (['theft-disc-basic', 'theft-apple-airtag'].includes(product.id)) return -100;
  }

  const protectionFirst = (
    (categoryId === 'helmet' && answers.usage === 'track')
    || (categoryId === 'gloves' && answers.protection === 'race')
    || (categoryId === 'armor' && answers.usage === 'track')
    || (categoryId === 'boots' && answers.usage === 'track')
  );
  return protectionFirst ? product.tier * 8 : 0;
};

const answerMatchScore = (categoryId, product, answers) => {
  let score = 0;
  let matched = 0;
  let considered = 0;
  Object.entries(product.fit || {}).forEach(([key, values]) => {
    const actual = answers?.[key];
    if (!actual) return;
    considered += 1;
    if (values.includes(actual)) { score += 12; matched += 1; }
    else score -= 4;
  });
  const confidenceBonus = product.confidence === 'high' ? 3 : product.confidence === 'medium' ? 1 : 0;
  const popularityBonus = product.marketSignal
    ? Math.max(-2, Math.min(5, Math.round(((product.popularityScore || 50) - 50) / 10)))
    : 0;
  return {
    score: score + confidenceBonus + popularityBonus + safetyPriority(categoryId, product, answers),
    matched,
    considered
  };
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  return items.filter((entry) => {
    const key = keyFn(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function recommendProductLadder(categoryId, answers = {}, result = null) {
  const recommendationProducts = PRODUCT_CATALOG.filter((entry) => entry.categoryId === categoryId
    && entry.recommendable === true
    && (entry.recordType === 'exact' || (categoryId === 'theft' && entry.recordType === 'bundle')));
  const selectionReferences = PRODUCT_CATALOG.filter((entry) => entry.categoryId === categoryId
    && entry.selectionEligible === true
    && entry.recordType === 'exact');
  if (!recommendationProducts.length && !selectionReferences.length) {
    return { exactEnough: false, intro: '当前还没有可用于这个场景的具体型号资料。请先浏览完整目录，或调整筛选条件。', items: [] };
  }

  const rankProducts = (items) => items.map((product) => ({ product, ...answerMatchScore(categoryId, product, answers) }))
    .sort((a, b) => b.score - a.score
      || b.matched - a.matched
      || (b.product.marketSignal ? b.product.popularityScore || 0 : 0) - (a.product.marketSignal ? a.product.popularityScore || 0 : 0)
      || a.product.tier - b.product.tier
      || `${a.product.canonicalFamilyId}`.localeCompare(`${b.product.canonicalFamilyId}`, 'zh-Hans-CN'));

  let compatible = uniqueBy(
    rankProducts(recommendationProducts).filter((entry) => isCoreCompatible(categoryId, entry.product, answers)),
    (entry) => entry.product.canonicalFamilyId
  );
  // 如果没有中国公开渠道可核验的同场景型号，才展示“选型参考”。它能帮助用户从
  // 用途、盔型/服装结构开始继续找，但不会用“最接近你的需求”伪装成国内现货推荐。
  let usingSelectionFallback = false;
  if (!compatible.length) {
    compatible = uniqueBy(
      rankProducts(selectionReferences).filter((entry) => isCoreCompatible(categoryId, entry.product, answers)),
      (entry) => entry.product.canonicalFamilyId
    );
    usingSelectionFallback = compatible.length > 0;
  }
  let usingApproximateFallback = false;
  if (!compatible.length && ['helmet', 'gloves', 'armor', 'boots', 'luggage', 'intercom'].includes(categoryId)) {
    compatible = uniqueBy(
      rankProducts(selectionReferences.length ? selectionReferences : recommendationProducts).filter((entry) => isApproximateCompatible(categoryId, entry.product, answers)),
      (entry) => entry.product.canonicalFamilyId
    );
    usingApproximateFallback = compatible.length > 0;
  }

  // 灯光和赛道皮衣先守住用途、光型/结构；如果没有可核验的具体 SKU，才回退到
  // 明确标为“选型方向”的记录，帮助用户继续找型号，而不是把不相干产品硬凑进结果。
  let usingDirectionFallback = false;
  if (!compatible.length && ['lights', 'armor'].includes(categoryId)) {
    const directions = PRODUCT_CATALOG.filter((entry) => entry.categoryId === categoryId
      && entry.recordType === 'direction'
      && entry.catalogScope !== 'directory');
    compatible = uniqueBy(
      rankProducts(directions).filter((entry) => isCoreCompatible(categoryId, entry.product, answers)),
      (entry) => entry.product.canonicalFamilyId
    );
    usingDirectionFallback = compatible.length > 0;
  }
  if (!compatible.length) {
    return {
      exactEnough: false,
      intro: '当前目录里没有同时符合这些核心筛选条件的产品。建议调整条件或到线下确认，页面不会加入不适用的型号补足数量。',
      items: [],
      updatedAt: CATALOG_UPDATED_AT
    };
  }

  const first = compatible.find((entry) => entry.product.role !== 'secondary-tracker') || compatible[0];
  const second = compatible.find((entry) => entry.product.id !== first.product.id && entry.product.tier < first.product.tier)
    || compatible.find((entry) => entry.product.id !== first.product.id && entry.product.tier === first.product.tier);
  const secondTier = second?.product.tier ?? first.product.tier;
  const third = compatible.find((entry) => ![first.product.id, second?.product.id].includes(entry.product.id) && entry.product.tier < secondTier)
    || compatible.find((entry) => ![first.product.id, second?.product.id].includes(entry.product.id) && entry.product.tier === secondTier);
  let chosen = uniqueBy([first, second, third].filter(Boolean), (entry) => entry.product.id);
  // 露天且无锚点时，机械碟刹锁不能承担所有防盗职责。若没有第二个可核验 SKU，
  // 明确追加“定位方案方向”，并将它标成非具体型号的互补层，而不是把 AirTag 当主方案。
  if (categoryId === 'theft' && ['outdoor', 'uncertain'].includes(answers.parking) && ['no', 'sometimes'].includes(answers.anchor)) {
    const trackerDirection = rankProducts(PRODUCT_CATALOG.filter((entry) => entry.id === 'theft-gps-generic'
      && entry.recordType === 'direction'))
      .find((entry) => isCoreCompatible(categoryId, entry.product, answers));
    if (trackerDirection && !chosen.some((entry) => entry.product.id === trackerDirection.product.id)) {
      chosen = [...chosen, trackerDirection];
    }
  }
  const budgetConflict = Boolean(
    answers.budget
    && first.product.fit?.budget?.length
    && !first.product.fit.budget.includes(answers.budget)
  );
  const exactEnough = !budgetConflict && first.considered > 0 && first.matched >= Math.max(2, Math.ceil(first.considered * 0.7));
  const verificationText = ({
    helmet: '仍需连续试戴并核对具体型号合规信息。',
    gloves: '仍需试戴并确认握把、刹车和腕部固定。',
    armor: '仍需试穿并确认骑姿下护具位置与活动范围。',
    boots: '仍需试穿并确认换挡、走路和脚踝支撑。',
    luggage: '仍需核对车型支架、允许载荷和安装间隙。',
    lights: '仍需安装后核验光型、电路与当地改装和使用要求。',
    intercom: '仍需试装并实测压耳、操作、连接和麦克风。'
  })[categoryId] || '仍需按真实使用条件核验。';

  const items = chosen.map((entry, index) => {
    const product = entry.product;
    const previousTier = chosen[index - 1]?.product.tier;
    const movedDown = index > 0 && product.tier < previousTier;
    const isDirectionFallback = usingDirectionFallback && product.recordType === 'direction';
    const isSelectionReference = usingSelectionFallback && product.selectionEligible === true;
    const isApproximateFallback = usingApproximateFallback && !isDirectionFallback && !isSelectionReference;
    const isTheftDirection = categoryId === 'theft' && product.recordType === 'direction';
    const label = isDirectionFallback
      ? (categoryId === 'armor' ? '装备结构方向（需核对具体型号）' : '选型方向（需核对具体型号）')
      : isSelectionReference
        ? (index === 0 ? '选型参考（国内购买待核验）' : `同场景参考 ${index + 1}（国内购买待核验）`)
      : isApproximateFallback
        ? (index === 0 ? '没有完全合适的：先看近似方向' : index === 1 ? '近似替代 2' : '近似替代 3')
      : isTheftDirection
        ? '补充防护方向（非具体 SKU）'
      : categoryId === 'theft'
      ? (index === 0 ? '核心防盗方案' : `需要叠加的第${index + 1}层`)
      : index === 0
        ? (budgetConflict ? '最接近场景，但超出预算' : '最接近你的需求')
        : index === 1
          ? (movedDown ? '保留核心条件的替代' : '同级另一选择')
          : (movedDown ? '更基础的可选方案' : '同级备选');
    const whyRelaxed = isDirectionFallback
      ? `当前资料没有同时满足这些条件的可核验具体型号；这里仅保留用途和${categoryId === 'armor' ? '服装结构' : '光型'}正确的选型方向，不能直接等同于某一 SKU 或购买建议。`
      : isSelectionReference
        ? '它符合当前的用途和类型筛选，但尚未找到带日期的中文公开渠道快照或中文官方具体型号资料。这里只作为继续核对的选型参考，不能当作国内现货或默认购买建议。'
      : isApproximateFallback
        ? (index === 0
            ? `${approximateFallbackReason(categoryId, answers)} 先守住用途和安全边界，再用近似类型继续缩小范围。`
            : '这是在核心使用场景不变的前提下，向相近结构或功能退一步后的近似选择。')
      : isTheftDirection
        ? '这是互补防护层的选型方向：优先找有持续服务、低电提醒和位移/断电通知的具体定位器；不能单独替代机械阻碍和停车管理。'
      : index === 0
      ? (categoryId === 'theft'
          ? '这是当前风险下的核心方向，仍需与其他防护层和更安全的停车环境配合。'
          : budgetConflict
            ? '当前目录没有同时满足该使用场景和预算的候选；不建议为了压低价格放弃你选择的保护取向。'
            : exactEnough ? `匹配了${entry.matched}项核心条件，${verificationText}` : `没有完全对应的成品，这是当前数据里最相近的一项。`)
      : categoryId === 'theft'
        ? '这是互补防护层，必须和机械阻碍、定位/报警及停车管理组合使用，不能单独替代完整方案。'
        : movedDown
          ? '在不改变核心使用场景的前提下，降低一档配置、材料或功能复杂度；价格仍以购买时的正规渠道为准。'
          : '核心场景和档位相近，可以按版型、安装条件、售后与实际成交价再比较。';
    return {
      rank: index + 1,
      label,
      whyRelaxed,
      product,
      marketLinks: marketplaceLinks(product.searchKeyword || `${product.brand} ${product.model}`),
      image: product.image || GEAR_FALLBACK_IMAGES[categoryId]
    };
  });

  return {
    exactEnough: usingDirectionFallback || usingSelectionFallback || usingApproximateFallback ? false : exactEnough,
    mode: usingSelectionFallback ? 'selection-reference' : usingDirectionFallback ? 'direction' : usingApproximateFallback ? 'approximate' : 'recommendation',
    approximateReason: usingApproximateFallback ? approximateFallbackReason(categoryId, answers) : '',
    requestedTypeLabel: usingApproximateFallback ? typeLabel(categoryId, approximateTargets(categoryId, answers).requested) : '',
    intro: usingSelectionFallback
      ? '当前没有同时符合这些条件的中文公开渠道可核验候选。以下是用途和类型匹配的具体型号资料，国内该版本的库存、价格、认证和售后仍待核验；页面不会把它们写成国内现货。'
      : usingDirectionFallback
      ? `当前没有同时满足这些条件的可核验具体型号。以下只给出用途和${categoryId === 'armor' ? '服装结构' : '光型'}正确的选型方向；请打开来源或搜索词，逐一核对具体型号、${categoryId === 'armor' ? '护具位置、版型和耐磨层' : '线束、截止线和道路使用要求'}。`
      : usingApproximateFallback
      ? `${approximateFallbackReason(categoryId, answers)} 下面这些不是“完全符合”，而是在核心使用场景不变前提下最接近的近似方案。`
      : categoryId === 'theft'
      ? '防盗手段不是互相替代的三选一。下面按当前风险列出需要组合的防护层，并优先建议更安全的停车环境。'
      : chosen.length < 3
      ? `当前目录只有${chosen.length}项符合核心筛选条件，因此不再加入不适用的产品补足数量。`
      : exactEnough
        ? '下面不是唯一答案，而是按你的核心条件排出的几个相近候选。'
        : '没有一款能同时满足全部条件，下面只在不改变核心使用场景的前提下给出替代。',
    items,
    updatedAt: CATALOG_UPDATED_AT
  };
}

export function popularProductsForCategory(categoryId, limit = 10) {
  const signalSortKey = (product) => {
    const text = product.marketSignal?.rankText || '';
    const top = text.match(/TOP\s*(\d+)/i);
    if (top) return Number(top[1]);
    if (text.includes('前三')) return 3;
    if (text.includes('前列')) return 20;
    return 50;
  };
  return uniqueBy(PRODUCT_CATALOG
    .filter((product) => product.categoryId === categoryId && product.recommendable === true)
    .sort((a, b) => {
      if (Boolean(a.marketSignal) !== Boolean(b.marketSignal)) return a.marketSignal ? -1 : 1;
      const ar = signalSortKey(a);
      const br = signalSortKey(b);
      if (ar !== br) return ar - br;
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      if ((confidenceOrder[b.confidence] || 0) !== (confidenceOrder[a.confidence] || 0)) {
        return (confidenceOrder[b.confidence] || 0) - (confidenceOrder[a.confidence] || 0);
      }
      return `${a.brand}|${a.model}|${a.id}`.localeCompare(`${b.brand}|${b.model}|${b.id}`, 'zh-Hans-CN');
    })
  , (product) => product.canonicalFamilyId)
    .slice(0, limit);
}

const catalogSort = (a, b) => `${a.brand}|${a.model}|${a.id}`.localeCompare(`${b.brand}|${b.model}|${b.id}`, 'zh-Hans-CN');

// 完整资料库不参与“热度”排序。筛选结果仅按品牌和型号稳定排列，方便用户
// 自己横向比较；目录记录与自动推荐候选也会在状态标签上明确区分。
export function catalogProductsForCategory(categoryId, filters = {}) {
  const typeKey = typeKeyForCategory(categoryId);
  const search = `${filters.search || ''}`.trim().toLocaleLowerCase('zh-Hans-CN');
  return PRODUCT_CATALOG
    .filter((product) => product.categoryId === categoryId)
    .filter((product) => !filters.type || product.fit?.[typeKey]?.includes(filters.type))
    .filter((product) => !filters.usage || product.fit?.usage?.includes(filters.usage))
    .filter((product) => !filters.brand || product.brand === filters.brand)
    .filter((product) => !filters.scope || product.catalogScope === filters.scope)
    .filter((product) => !search || `${product.brand} ${product.model} ${product.taxonomy?.type || ''} ${product.taxonomy?.designLanguage || ''}`.toLocaleLowerCase('zh-Hans-CN').includes(search))
    .sort(catalogSort);
}

export function catalogFacetsForCategory(categoryId) {
  const products = catalogProductsForCategory(categoryId);
  const typeKey = typeKeyForCategory(categoryId);
  const types = [...new Set(products.flatMap((product) => product.fit?.[typeKey] || []))]
    .map((value) => ({ value, label: TYPE_LABELS[typeKey]?.[value] || value }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-Hans-CN'));
  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  const scopes = [...new Set(products.map((product) => product.catalogScope || 'candidate'))];
  return { types, brands, scopes, total: products.length };
}

export function productCatalogStats() {
  return PRODUCT_CATALOG.reduce((acc, product) => {
    acc.total += 1;
    if (product.marketSignal) acc.withMarketSignal += 1;
    if (product.recommendable === true) acc.recommendable += 1;
    if (product.catalogScope === 'directory') acc.directoryOnly += 1;
    if (product.catalogScope === 'source-checked-candidate') acc.sourceCheckedCandidates += 1;
    if (product.cnEvidenceTier === 'cn_exact_public') acc.cnExactPublic += 1;
    if (product.selectionEligible && product.recommendable !== true) acc.selectionReferences += 1;
    acc.byCategory[product.categoryId] = (acc.byCategory[product.categoryId] || 0) + 1;
    acc.byRecordType[product.recordType] = (acc.byRecordType[product.recordType] || 0) + 1;
    return acc;
  }, { total: 0, recommendable: 0, withMarketSignal: 0, directoryOnly: 0, sourceCheckedCandidates: 0, cnExactPublic: 0, selectionReferences: 0, byCategory: {}, byRecordType: {} });
}
