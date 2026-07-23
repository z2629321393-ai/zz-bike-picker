// V6.5 资料库：这里的记录用于“品牌 → 产品线 → 型号”浏览，不参与自动推荐。
//
// 资料优先来自中文品牌站、品牌京东店或中文公开零售目录。目录能证明“可查到该
// 产品线”，不能替代某一个颜色/尺码/SKU 此刻有货的证据；因此每条都保留来源和
// 国内状态，避免把海外产品线或旧款直接说成国内现货。

const SOURCE = Object.freeze({
  'hjc-jd': {
    label: 'HJC 京东旗舰店公开目录',
    url: 'https://mall.jd.com/index-13261800.html?from=pc',
    availability: '中文品牌店公开目录可见；具体颜色、尺码、版本、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'shoei-jd': {
    label: 'SHOEI 京东公开目录',
    url: 'https://mall.jd.com/view_search-3488238-26714602-99-1-24-1.html',
    availability: '中文公开目录可见；具体版本、尺码、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'shoei-neotec-cn': {
    label: 'SHOEI 中国官网：NEOTEC 3 产品页',
    url: 'https://shoei-shanghai.com.cn/product/system/neotec.html',
    availability: 'SHOEI 中国官网列出 NEOTEC 3 的具体型号资料；实际颜色、尺码、库存、生产批次与 GB 标志需下单前核验',
    confidence: 'high',
    sourceCheckedAt: '2026-07-23',
    exactModelKeys: ['helmet|SHOEI|NEOTEC 3']
  },
  'shoei-hornet-cn': {
    label: 'SHOEI 中国官网：HORNET ADV 产品页',
    url: 'https://www.shoei-shanghai.com.cn/product/offroad/hornet.html',
    availability: 'SHOEI 中国官网列出 HORNET ADV 的具体型号资料；实际颜色、尺码、库存、生产批次与 GB 标志需下单前核验',
    confidence: 'high',
    sourceCheckedAt: '2026-07-23',
    exactModelKeys: ['helmet|SHOEI|HORNET ADV']
  },
  'agv-jd': {
    label: 'AGV 京东公开目录',
    url: 'https://www.jd.com/brand/1318f727ed258b2defcf.html',
    availability: '中文公开目录可见；具体版本、尺码、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'schuberth-jd': {
    label: '舒伯特京东公开目录',
    url: 'https://www.jd.com/hprm/6728519a23fbf1b4648b.html',
    availability: '中文公开目录可见；具体版本、尺码、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'ls2-jd': {
    label: 'LS2 京东公开目录',
    url: 'https://www.jd.com/jiage/737c8d32d5af0f36e54.html',
    availability: '中文公开目录可见；具体版本、尺码、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'scoyco-jd': {
    label: '赛羽京东自营旗舰店公开目录',
    url: 'https://mall.jd.com/view_search-906571-14242622-99-1-20-1.html',
    availability: '中文品牌店公开目录可见；具体颜色、尺码、版本、认证标志与当前库存待核验',
    confidence: 'medium'
  },
  'dainese-jd': {
    label: 'DAINESE 京东官方旗舰店公开目录',
    url: 'https://mall.jd.com/index-10305111.html',
    availability: '中文品牌店公开目录可见；具体颜色、尺码、版本与当前库存待核验',
    confidence: 'medium'
  },
  'astar-jd': {
    label: 'Alpinestars 京东公开目录',
    url: 'https://mall.jd.com/view_search-1002325-8604602-99-1-20-1.html',
    availability: '中文公开目录可见；具体颜色、尺码、版本与当前库存待核验',
    confidence: 'medium'
  },
  'taichi-cn': {
    label: 'RS TAICHI 简体中文官方目录',
    url: 'https://www.rs-taichi.com/feature/2026ss/?lang=zh-hans',
    availability: '简体中文官方产品线资料可见；中国大陆具体供货、尺码与库存待核验',
    confidence: 'high'
  },
  'taichi-shoes-cn': {
    label: 'RS TAICHI 简体中文骑行鞋目录',
    url: 'https://www.rs-taichi.com/feature/shoes/?lang=zh-hans',
    availability: '简体中文官方产品线资料可见；中国大陆具体供货、尺码与库存待核验',
    confidence: 'high'
  },
  'komine-jd': {
    label: 'KOMINE 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=KOMINE%20%E6%91%A9%E6%89%98%E8%BD%A6%E9%AA%91%E8%A1%8C%E6%9C%8D',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码与库存待核验',
    confidence: 'low'
  },
  'revit-jd': {
    label: 'REV’IT! 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=REVIT%20%E6%91%A9%E6%89%98%E8%BD%A6%E9%AA%91%E8%A1%8C%E6%9C%8D',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码与库存待核验',
    confidence: 'low'
  },
  'klim-global': {
    label: 'KLIM 海外官方产品线目录',
    url: 'https://www.klim.com/motorcycle/mens/new-products',
    availability: '海外官方产品线资料；未逐款确认中国正规渠道，不能默认国内有货',
    confidence: 'medium'
  },
  'arai-jd': {
    label: 'Arai 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=Arai%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'mt-jd': {
    label: 'MT Helmets 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=MT%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'kyt-jd': {
    label: 'KYT 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=KYT%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'nolan-jd': {
    label: 'NOLAN / X-LITE 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=NOLAN%20X-LITE%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'shark-jd': {
    label: 'SHARK 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=SHARK%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'bell-jd': {
    label: 'BELL 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=BELL%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'scorpion-jd': {
    label: 'SCORPION 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=SCORPION%20%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录可见；不等同于品牌官方供货，具体版本、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'other-helmet-cn': {
    label: '中文公开头盔目录',
    url: 'https://search.jd.com/Search?keyword=%E6%91%A9%E6%89%98%E8%BD%A6%E5%A4%B4%E7%9B%94',
    availability: '中文公开零售目录线索；具体品牌、型号、尺码、认证标志与库存待核验',
    confidence: 'low'
  },
  'rst-cn': {
    label: 'RST 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=RST%20%E6%91%A9%E6%89%98%E8%BD%A6%E9%AA%91%E8%A1%8C%E6%9C%8D',
    availability: '中文公开零售目录可见；具体版本、尺码与库存待核验',
    confidence: 'low'
  },
  'richa-cn': {
    label: 'RICHA 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=RICHA%20%E6%91%A9%E6%89%98%E8%BD%A6%E9%AA%91%E8%A1%8C%E6%9C%8D',
    availability: '中文公开零售目录可见；具体版本、尺码与库存待核验',
    confidence: 'low'
  },
  'spidi-cn': {
    label: 'SPIDI 中文公开零售目录',
    url: 'https://search.jd.com/Search?keyword=SPIDI%20%E6%91%A9%E6%89%98%E8%BD%A6%E9%AA%91%E8%A1%8C%E6%9C%8D',
    availability: '中文公开零售目录可见；具体版本、尺码与库存待核验',
    confidence: 'low'
  },
  'luggage-cn': {
    label: '中文公开摩旅箱包目录',
    url: 'https://search.jd.com/Search?keyword=%E6%91%A9%E6%89%98%E8%BD%A6%20%E5%B0%BE%E7%AE%B1%20%E8%BE%B9%E7%AE%B1',
    availability: '中文公开零售目录线索；具体车型支架、载荷、版本与库存待核验',
    confidence: 'low'
  },
  'lights-cn': {
    label: '中文公开摩托车辅助照明目录',
    url: 'https://search.jd.com/Search?keyword=%E6%91%A9%E6%89%98%E8%BD%A6%20%E8%BE%85%E5%8A%A9%E7%81%AF',
    availability: '中文公开零售目录线索；具体光型、线束、安装、电路余量与法规适用待核验',
    confidence: 'low'
  },
  'intercom-cn': {
    label: '中文公开头盔耳机目录',
    url: 'https://search.jd.com/Search?keyword=%E6%91%A9%E6%89%98%E8%BD%A6%20%E5%A4%B4%E7%9B%94%E8%93%9D%E7%89%99%E8%80%B3%E6%9C%BA',
    availability: '中文公开零售目录线索；具体版本、配对协议、安装适配与库存待核验',
    confidence: 'low'
  },
  'theft-cn': {
    label: '中文公开摩托车防盗目录',
    url: 'https://search.jd.com/Search?keyword=%E6%91%A9%E6%89%98%E8%BD%A6%20%E9%98%B2%E7%9B%97%20%E7%A2%9F%E5%88%B9%E9%94%81',
    availability: '中文公开零售目录线索；锁芯、尺寸、固定条件与库存待核验',
    confidence: 'low'
  }
});

const CATEGORY_COPY = Object.freeze({
  helmet: { noun: '头盔', fit: '头围只能用于初筛；请按品牌尺码表测量，并连续试戴 15—20 分钟，确认太阳穴、后脑和脸颊没有持续压痛。' },
  gloves: { noun: '骑行手套', fit: '请同时量掌围与中指长度；掌宽、指长、拳峰高度和预弯会因品牌不同而变化。' },
  armor: { noun: '骑行服、骑行裤或护具', fit: '请按胸围、腰围、臀围、臂长和骑姿试穿，确认肩肘膝髋护具在骑车时仍贴在正确位置。' },
  boots: { noun: '骑行鞋或骑行靴', fit: '请按脚长、脚宽、小腿围和换挡习惯试穿，确认脚踝支撑、鞋底抗扭和换挡区不顶脚。' },
  luggage: { noun: '箱包系统', fit: '必须以车型专用支架、说明书载荷、排气管距离、乘客空间和实际箱体宽度核对。' },
  lights: { noun: '辅助照明', fit: '必须核对车辆发电余量、保险/继电器、安装位置、散热和法规要求；不要只按流明数字选。' },
  intercom: { noun: '头盔耳机', fit: '先检查头盔耳槽、麦克风位置、底座空间和同行设备协议；扬声器压耳会直接影响佩戴安全。' },
  theft: { noun: '防盗产品或方案', fit: '锁具尺寸、可固定物、停车环境和日常使用频率决定是否真正有效；单一产品不能替代停车管理。' }
});

const usageText = (usage) => usage.split('|').map((item) => ({
  city: '通勤', touring: '摩旅', sport: '跑山/街道运动', track: '赛道', offroad: '越野',
  commute: '通勤', adv: 'ADV/拉力', summer: '夏季', allSeason: '四季', retro: '复古/巡航',
  daily: '日常', rain: '雨天', passenger: '载人', camp: '露营', highway: '高速',
  night: '夜路', pair: '双人', group: '车队', security: '防盗'
}[item] || item)).join('、');

const normaliseUsageForQuestion = (categoryId, rawUsage) => {
  const values = rawUsage.split('|');
  const map = {
    helmet: { adv: 'touring', offroad: 'offroad', city: 'city', touring: 'touring', sport: 'sport', track: 'track', retro: 'city' },
    armor: { city: 'commute', commute: 'commute', daily: 'commute', summer: 'commute', touring: 'touring', adv: 'touring', offroad: 'offroad', allSeason: 'touring', rain: 'touring', sport: 'sport', track: 'track', retro: 'commute', cold: 'touring' },
    gloves: { city: 'city', commute: 'city', summer: 'city', touring: 'touring', adv: 'touring', offroad: 'offroad', sport: 'mountain', track: 'track', rain: 'touring', cold: 'touring' },
    boots: { city: 'city', commute: 'city', daily: 'city', touring: 'touring', adv: 'touring', sport: 'sport', track: 'track', offroad: 'offroad', rain: 'touring', retro: 'city' },
    luggage: { city: 'commute', commute: 'commute', touring: 'touring', adv: 'camp', camp: 'camp', passenger: 'passenger', offroad: 'camp', highway: 'touring' },
    lights: { city: 'city', touring: 'touring', night: 'touring', rain: 'fog', offroad: 'offroad', highway: 'touring' },
    intercom: { solo: 'solo', pair: 'pair', group: 'large', city: 'solo', touring: 'small' },
    theft: { security: 'outdoor', city: 'uncertain', touring: 'uncertain' }
  };
  return [...new Set(values.map((item) => map[categoryId]?.[item]).filter(Boolean))];
};

const typeFit = (categoryId, type) => {
  if (categoryId === 'helmet') {
    const value = {
      '通勤/街道全盔': 'fullFace', '通勤全盔': 'fullFace', '通勤旅行全盔': 'fullFace', '旅行全盔': 'fullFace', '静音旅行全盔': 'fullFace', '运动全盔': 'sportFullFace', '运动旅行全盔': 'sportFullFace',
      '赛道全盔': 'raceFullFace', '揭面盔': 'modular', '拉力揭面盔': 'adv', '拉力盔 / ADV盔': 'adv',
      '越野盔': 'offroad', '复古越野盔': 'offroad', '复古全盔': 'retroFullFace', '3/4盔': 'threeQuarter',
      '开放式盔': 'openFace', '可变开放式盔': 'openFace'
    }[type];
    return value ? { helmetType: [value] } : {};
  }
  if (categoryId === 'armor') {
    // 一件衣服可能同时是网眼、防水、皮革或旅行取向；单值覆盖会让用户按“网眼”或
    // “分体皮衣/皮裤”筛选时找不到它。因此保留真实的多重结构标签，而不按关键词最后一次命中覆盖。
    const garmentTypes = new Set();
    // 裤装和上衣必须分开：夏季网眼裤、速干裤不能因为名称里有“网眼/夏季”
    // 出现在“夏季网眼骑行服”结果里。
    const pantsOnly = /裤/.test(type) && !/上下装|套装|夹克|上衣|连体|两件式/.test(type);
    if (pantsOnly) {
      garmentTypes.add('ridingPants');
      if (/牛仔/.test(type)) garmentTypes.add('protectiveJeans');
      return { garmentType: [...garmentTypes] };
    }
    if (/网眼|速干|夏季/.test(type)) garmentTypes.add('meshJacket');
    if (/ADV|拉力|探险|层压/.test(type)) garmentTypes.add('advTouring');
    if (/旅行|四季/.test(type)) garmentTypes.add('textileSuit');
    if (/连体/.test(type)) garmentTypes.add('onePieceLeather');
    else if (/两件式|分体|皮衣|皮革|皮裤/.test(type)) garmentTypes.add('twoPieceLeather');
    if (/护甲|气囊背心/.test(type)) garmentTypes.add('armoredShirt');
    if (/复古.*皮/.test(type)) garmentTypes.add('retroLeather');
    if (/牛仔/.test(type)) garmentTypes.add('protectiveJeans');
    if (/裤/.test(type)) garmentTypes.add('ridingPants');
    if (!garmentTypes.size) garmentTypes.add('textileSuit');
    return { garmentType: [...garmentTypes] };
  }
  if (categoryId === 'gloves') {
    let protection = 'urban';
    if (/赛道/.test(type)) protection = 'race';
    else if (/旅行|防水|ADV/.test(type)) protection = 'touring';
    else if (/运动|皮革/.test(type)) protection = 'roadSport';
    const style = /复古/.test(type) ? 'retro' : /赛道|运动/.test(type) ? 'race' : '';
    return { protection: [protection], ...(style ? { style: [style] } : {}) };
  }
  if (categoryId === 'boots') {
    const style = /ADV|越野/.test(type) ? 'adv' : /赛道|运动/.test(type) ? 'sport' : /复古/.test(type) ? 'retro' : 'sneaker';
    return { style: [style] };
  }
  return {};
};

function entry(categoryId, index, row) {
  const [sourceId, brand, model, type, usage, designLanguage, persona = '按结构和用途继续比较'] = row;
  const source = SOURCE[sourceId];
  if (!source) throw new Error(`未知目录来源：${sourceId}`);
  const category = CATEGORY_COPY[categoryId];
  const directoryKey = `${categoryId}|${brand}|${model}`;
  const isLegacyDirectoryRecord = LEGACY_DIRECTORY_KEYS.has(directoryKey);
  const isSeries = /系列|产品线|方向|系统|方案/.test(model);
  const usageList = normaliseUsageForQuestion(categoryId, usage);
  // 店铺首页、品牌类目页只能证明“这个品牌/产品线可查到”，不能证明某个具体
  // 型号的当前中国大陆 SKU。在接入逐型号链接前，这批待复核键一律只做目录浏览。
  const isCuratedDirectoryCandidate = !isLegacyDirectoryRecord
    && CURATED_DIRECTORY_KEYS.has(directoryKey)
    && Boolean(source.exactModelKeys?.includes(directoryKey));
  const displayModel = isLegacyDirectoryRecord ? `${model}（旧款/存量待核验）` : model;
  return {
    id: `directory-${categoryId}-${String(index + 1).padStart(3, '0')}`,
    categoryId,
    brand,
    model: displayModel,
    recordType: isLegacyDirectoryRecord ? 'archived' : isSeries ? 'series' : 'exact',
    catalogScope: isCuratedDirectoryCandidate ? 'source-checked-candidate' : 'directory',
    recommendable: isCuratedDirectoryCandidate,
    cnEvidenceTier: isCuratedDirectoryCandidate ? 'cn_exact_public' : 'catalog_reference',
    sourceCheckedAt: isCuratedDirectoryCandidate ? source.sourceCheckedAt || '' : '',
    confidence: source.confidence,
    sourceType: `${isLegacyDirectoryRecord ? '历史/地区目录资料' : '公开目录资料'} · ${source.label}`,
    sourceUrl: source.url,
    sourceLabel: source.label,
    cnAvailability: isLegacyDirectoryRecord
      ? '历史型号或地区/存量资料；不作为默认推荐，中国大陆具体版本、库存与认证标志待核验'
      : source.availability,
    priceBand: '请以当前版本与正规渠道实际价格为准',
    searchKeyword: `${brand} ${model} ${category.noun}`,
    fit: { usage: usageList, ...typeFit(categoryId, type) },
    taxonomy: {
      type,
      usage: usageList,
      designLanguage,
      persona,
      fitNote: category.fit,
      sourceLabel: source.label,
      catalogRole: '品牌—产品线—型号资料'
    },
    idealFor: `想按“${type}”结构、以${usageText(usage)}为主线继续核对的人。`,
    reviewSummary: isLegacyDirectoryRecord
      ? `该条是${source.label}中的历史/地区或存量资料，不据此断定中国大陆当前在售、具体版本或认证标志。`
      : `该条来自${source.label}，用于浏览品牌—产品线—型号，不据此断定某一颜色、尺码或配置现在有现货。`,
    compromise: isCuratedDirectoryCandidate
      ? `该记录仅因中文官方/品牌店公开目录能核对到型号而进入候选池；型号代际、认证标志、尺码/版型与国内库存仍需购买前逐项核验。`
      : `不进入自动推荐；型号代际、认证标志、尺码/版型与国内库存会变化，购买前需打开来源页和正规渠道逐项核验。`,
    aliases: []
  };
}

const expand = (categoryId, rows) => rows.map((row, index) => entry(categoryId, index, row));

// 行格式：来源、品牌、型号、类型、主要用途、设计语言（编辑分类）、使用画像。
// “设计语言”是方便筛选的编辑标签，不是对品牌国籍或骑手性格的事实判断。
const HELMETS = [
  ['hjc-jd', 'HJC', 'RPHA 1', '赛道全盔', 'track|sport', '运动/竞赛', '低伏视野、固定与气动优先'],
  ['hjc-jd', 'HJC', 'RPHA 71', '运动旅行全盔', 'touring|sport', '运动旅行', '长途便利与运动骑姿兼顾'],
  ['hjc-jd', 'HJC', 'RPHA 91', '揭面盔', 'touring|city', '旅行便利', '经常停车沟通或戴眼镜'],
  ['hjc-jd', 'HJC', 'i80', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '站姿、通风与旅行路线'],
  ['hjc-jd', 'HJC', 'i70', '通勤旅行全盔', 'city|touring', '实用旅行', '日常道路与中短途'],
  ['hjc-jd', 'HJC', 'F71', '运动全盔', 'sport|city', '街道运动', '跑山和街车使用'],
  ['hjc-jd', 'HJC', 'C71', '通勤全盔', 'city|touring', '基础实用', '通勤优先'],
  ['hjc-jd', 'HJC', 'C91', '揭面盔', 'city|touring', '旅行便利', '常摘戴和城市通勤'],
  ['hjc-jd', 'HJC', 'C80', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '旅行与非铺装路线'],
  ['hjc-jd', 'HJC', 'DS-X1', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '通风、帽檐和护目镜方向'],
  ['hjc-jd', 'HJC', 'V10', '复古全盔', 'city|retro', '复古街道', '复古车与日常道路'],
  ['hjc-jd', 'HJC', 'V31', '3/4盔', 'city|retro', '复古开放式', '低速城市与开放感需求'],
  ['hjc-jd', 'HJC', 'i31', '3/4盔', 'city|touring', '城市旅行', '通勤与低速城市使用'],
  ['shoei-neotec-cn', 'SHOEI', 'NEOTEC 3', '揭面盔', 'touring|city', '高端旅行', '长途、沟通和便利优先'],
  ['shoei-jd', 'SHOEI', 'GLAMSTER', '复古全盔', 'city|retro', '日系复古', '复古外观但保留全盔结构'],
  ['shoei-jd', 'SHOEI', 'J-CRUISE 2', '3/4盔', 'city|touring', '城市旅行', '通勤、眼镜和开阔视野'],
  ['shoei-hornet-cn', 'SHOEI', 'HORNET ADV', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '旅行与站姿路线'],
  ['shoei-jd', 'SHOEI', 'VFX-WR 06', '越野盔', 'offroad', '越野竞赛', '护目镜和越野运动'],
  ['shoei-jd', 'SHOEI', 'JO+', '3/4盔', 'city|retro', '复古开放式', '城市巡航和复古搭配'],
  ['shoei-jd', 'SHOEI', 'EX-ZERO', '复古越野盔', 'city|retro|offroad', '复古越野', '复古街车与轻度非铺装'],
  ['agv-jd', 'AGV', 'K1 S', '运动全盔', 'sport|city', '意式街道运动', '跑山、街车与初阶运动'],
  ['agv-jd', 'AGV', 'K3', '通勤旅行全盔', 'city|touring', '实用旅行', '日常道路和短途'],
  ['agv-jd', 'AGV', 'K5 S', '运动旅行全盔', 'touring|sport', '运动旅行', '长途与街道运动兼顾'],
  ['agv-jd', 'AGV', 'PISTA GP RR', '赛道全盔', 'track', '竞赛', '赛道和高速运动专用取向'],
  ['agv-jd', 'AGV', 'PISTA GP R', '赛道全盔', 'track', '竞赛', '赛道和高速运动专用取向'],
  ['agv-jd', 'AGV', 'TOURMODULAR', '揭面盔', 'touring|city', '高端旅行', '旅行便利、耳机与日常使用'],
  ['agv-jd', 'AGV', 'SPORTMODULAR', '揭面盔', 'touring|sport', '运动旅行', '高速旅行与运动骑姿'],
  ['agv-jd', 'AGV', 'AX9', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '旅行、帽檐与护目镜方向'],
  ['agv-jd', 'AGV', 'X101', '复古全盔', 'city|retro', '复古街道', '复古/巡航路线'],
  ['agv-jd', 'AGV', 'X70', '3/4盔', 'city|retro', '复古开放式', '低速巡航和复古车'],
  ['agv-jd', 'AGV', 'ORBYT', '3/4盔', 'city', '城市实用', '城市短途和踏板车路线'],
  ['schuberth-jd', 'SCHUBERTH', 'C5', '揭面盔', 'touring|city', '德系旅行', '长途、通勤与便利取向'],
  ['schuberth-jd', 'SCHUBERTH', 'E2', '拉力揭面盔', 'adv|touring', 'ADV/拉力', '旅行、站姿与模块化需求'],
  ['schuberth-jd', 'SCHUBERTH', 'S3', '旅行全盔', 'touring|sport', '德系旅行', '公路长途与安静性取向'],
  ['schuberth-jd', 'SCHUBERTH', 'M1 PRO', '3/4盔', 'city|touring', '城市旅行', '开放感、通勤与耳机适配'],
  ['schuberth-jd', 'SCHUBERTH', 'J2', '3/4盔', 'city|touring', '城市旅行', '开放式日常骑行'],
  ['schuberth-jd', 'SCHUBERTH', 'C4 PRO', '揭面盔', 'touring|city', '德系旅行', '长途和通勤便利'],
  ['schuberth-jd', 'SCHUBERTH', 'E1', '拉力揭面盔', 'adv|touring', 'ADV/拉力', '旅行与轻非铺装方向'],
  ['schuberth-jd', 'SCHUBERTH', 'S2 SPORT', '运动全盔', 'sport|touring', '街道运动', '高速公路和运动骑姿'],
  ['ls2-jd', 'LS2', 'FF801', '运动全盔', 'sport|city', '街道运动', '跑山和街车使用'],
  ['ls2-jd', 'LS2', 'FF807 Dragon', '运动全盔', 'sport|city', '街道运动', '日常运动骑行'],
  ['ls2-jd', 'LS2', 'FF805 Thunder', '赛道全盔', 'track|sport', '竞赛', '赛道和高速运动'],
  ['ls2-jd', 'LS2', 'FF901 Advant X', '揭面盔', 'touring|city', '旅行便利', '旅行、通勤与经常摘戴'],
  ['ls2-jd', 'LS2', 'FF906 Advant', '揭面盔', 'touring|city', '旅行便利', '长途和多用途道路'],
  ['ls2-jd', 'LS2', 'MX701 Explorer', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '旅行与护目镜方向'],
  ['ls2-jd', 'LS2', 'MX700 Subverter EVO II', '越野盔', 'offroad', '越野竞赛', '越野、护目镜和高通风'],
  ['ls2-jd', 'LS2', 'FF358', '通勤全盔', 'city', '基础实用', '城市通勤'],
  ['ls2-jd', 'LS2', 'FF325 Strobe', '揭面盔', 'city|touring', '基础旅行', '日常摘戴便利'],
  ['ls2-jd', 'LS2', 'OF606 Drifter', '拉力盔 / ADV盔', 'adv|city', '城市ADV', '城市与轻旅行路线'],
  ['ls2-jd', 'LS2', 'OF603 Infinity II', '3/4盔', 'city|touring', '城市旅行', '通勤与开阔视野'],
  ['arai-jd', 'Arai', 'QUANTIC', '运动旅行全盔', 'touring|sport', '日系运动旅行', '长途和街道运动'],
  ['arai-jd', 'Arai', 'CONCEPT-XE', '复古全盔', 'city|retro', '日系复古', '复古外形与道路全盔结构'],
  ['arai-jd', 'Arai', 'TOUR-CROSS V', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '旅行和轻非铺装路线'],
  ['arai-jd', 'Arai', 'VZ-RAM', '3/4盔', 'city|touring', '城市旅行', '通勤与公路旅行'],
  ['arai-jd', 'Arai', 'MX-V', '越野盔', 'offroad', '越野竞赛', '越野、护目镜和高通风'],
  ['arai-jd', 'Arai', 'SZ-R VAS', '3/4盔', 'city|touring', '城市旅行', '开放式公路骑行'],
  ['mt-jd', 'MT Helmets', 'KRE+ S', '赛道全盔', 'track|sport', '竞赛', '赛道和高速运动'],
  ['mt-jd', 'MT Helmets', 'KRE+', '赛道全盔', 'track|sport', '竞赛', '赛道和高速运动'],
  ['mt-jd', 'MT Helmets', 'TARGO PRO', '通勤全盔', 'city|sport', '基础运动', '日常和街道运动'],
  ['mt-jd', 'MT Helmets', 'STINGER 2', '通勤全盔', 'city', '基础实用', '城市通勤'],
  ['mt-jd', 'MT Helmets', 'ATOM 2', '揭面盔', 'city|touring', '旅行便利', '日常摘戴和短途'],
  ['mt-jd', 'MT Helmets', 'BRAKER SV', '揭面盔', 'city|touring', '基础旅行', '通勤与旅行'],
  ['mt-jd', 'MT Helmets', 'JARAMA', '复古全盔', 'city|retro', '复古街道', '复古/巡航路线'],
  ['mt-jd', 'MT Helmets', 'DISTRICT SV', '3/4盔', 'city|touring', '城市旅行', '城市短途与开放感'],
  ['mt-jd', 'MT Helmets', 'AVENUE SV', '3/4盔', 'city', '城市实用', '日常城市路线'],
  ['kyt-jd', 'KYT', 'NZ-RACE', '赛道全盔', 'track|sport', '竞赛', '赛道和高速运动'],
  ['kyt-jd', 'KYT', 'NF-R', '运动全盔', 'sport|city', '街道运动', '跑山与街车'],
  ['kyt-jd', 'KYT', 'TT-REVO', '运动全盔', 'sport|city', '街道运动', '日常运动骑行'],
  ['kyt-jd', 'KYT', 'KX-1 RACE GP', '赛道全盔', 'track', '竞赛', '明确赛道取向'],
  ['kyt-jd', 'KYT', 'STRIKE EAGLE', '通勤全盔', 'city|sport', '基础运动', '日常与轻度跑山'],
  ['nolan-jd', 'NOLAN', 'N120-1', '揭面盔', 'touring|city', '旅行便利', '旅行与日常摘戴'],
  ['nolan-jd', 'NOLAN', 'N100-6', '揭面盔', 'touring|city', '旅行便利', '长途与通勤'],
  ['nolan-jd', 'NOLAN', 'N70-2 X', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '多用途旅行路线'],
  ['nolan-jd', 'NOLAN', 'N60-6', '通勤全盔', 'city|sport', '基础运动', '城市和街道运动'],
  ['nolan-jd', 'X-LITE', 'X-903 ULTRA CARBON', '运动旅行全盔', 'touring|sport', '运动旅行', '高速旅行和公路运动'],
  ['nolan-jd', 'X-LITE', 'X-552 ULTRA CARBON', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '摩旅、站姿与护目镜方向'],
  ['shark-jd', 'SHARK', 'RACE-R PRO GP', '赛道全盔', 'track', '竞赛', '赛道与高速运动'],
  ['shark-jd', 'SHARK', 'AERON GP', '赛道全盔', 'track', '竞赛', '赛道与气动优先'],
  ['shark-jd', 'SHARK', 'SPARTAN RS', '运动旅行全盔', 'touring|sport', '运动旅行', '高速道路与旅行'],
  ['shark-jd', 'SHARK', 'SKWAL i3', '运动全盔', 'city|sport', '街道运动', '通勤与街道运动'],
  ['shark-jd', 'SHARK', 'RIDILL 2', '通勤全盔', 'city', '基础实用', '城市通勤'],
  ['shark-jd', 'SHARK', 'OXO', '揭面盔', 'touring|city', '旅行便利', '长途和日常摘戴'],
  ['scorpion-jd', 'SCORPION', 'EXO-R1 AIR', '赛道全盔', 'track|sport', '竞赛', '赛道与高速运动'],
  ['scorpion-jd', 'SCORPION', 'EXO-1400 EVO II', '运动旅行全盔', 'touring|sport', '运动旅行', '高速公路和长途'],
  ['scorpion-jd', 'SCORPION', 'EXO-TECH EVO', '揭面盔', 'touring|city', '旅行便利', '旅行和日常'],
  ['scorpion-jd', 'SCORPION', 'ADX-2', '拉力揭面盔', 'adv|touring', 'ADV/拉力', '旅行、帽檐与模块化'],
  ['scorpion-jd', 'SCORPION', 'ADF-9000 AIR', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '摩旅和轻非铺装'],
  ['scorpion-jd', 'SCORPION', 'BELFAST EVO', '复古全盔', 'city|retro', '复古街道', '复古/巡航路线'],
  ['bell-jd', 'BELL', 'RACE STAR FLEX DLX', '赛道全盔', 'track|sport', '竞赛', '赛道和高速运动'],
  ['bell-jd', 'BELL', 'STAR DLX MIPS', '运动全盔', 'sport|city', '街道运动', '跑山与街道运动'],
  ['bell-jd', 'BELL', 'SRT MODULAR', '揭面盔', 'touring|city', '旅行便利', '通勤和旅行'],
  ['bell-jd', 'BELL', 'MX-9 ADVENTURE MIPS', '拉力盔 / ADV盔', 'adv|offroad', 'ADV/拉力', '旅行与轻越野'],
  ['bell-jd', 'BELL', 'CUSTOM 500', '开放式盔', 'city|retro', '复古开放式', '复古/巡航路线'],
  ['bell-jd', 'BELL', 'BULLITT GT', '复古全盔', 'city|retro', '复古街道', '复古外观和城市道路'],
  ['bell-jd', 'BELL', 'BROOZER', '可变开放式盔', 'city|retro', '城市个性', '开放式外观取向'],
  ['klim-global', 'KLIM', 'KRIOS PRO', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '摩旅与非铺装路线；国内供应需单独核验'],
  ['klim-global', 'KLIM', 'KRIOS', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '旅行和站姿路线；国内供应需单独核验'],
  ['klim-global', 'KLIM', 'X1 ALPHA', '运动旅行全盔', 'touring|sport', '高端旅行', '公路长途；国内供应需单独核验'],
  ['klim-global', 'KLIM', 'F3 CARBON PRO', '越野盔', 'offroad', '越野竞赛', '越野与护目镜路线；国内供应需单独核验'],
  ['klim-global', 'KLIM', 'F5 KOROYD', '越野盔', 'offroad', '越野竞赛', '越野与高通风路线；国内供应需单独核验'],
  ['other-helmet-cn', '瑞狮', 'M50 复古全盔系列', '复古全盔', 'city|retro', '国产复古', '复古/巡航路线'],
  ['other-helmet-cn', '瑞狮', 'T300 3/4盔系列', '3/4盔', 'city|retro', '国产复古', '城市巡航与开放感'],
  ['other-helmet-cn', '永恒', '977 全盔系列', '通勤全盔', 'city', '国产实用', '城市通勤'],
  ['other-helmet-cn', '永恒', '半盔 / 3/4盔系列', '开放式盔', 'city', '国产实用', '低速城市使用，需理解保护边界'],
  ['other-helmet-cn', 'BILMOLA', 'RAPID RS', '运动全盔', 'sport|city', '泰式街道运动', '跑山和街车'],
  ['other-helmet-cn', 'BILMOLA', 'RAPID RSLT', '运动全盔', 'sport|city', '泰式街道运动', '街道运动与日常'],
  ['other-helmet-cn', 'BILMOLA', 'DEFENDER', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '旅行与轻非铺装'],
  ['other-helmet-cn', 'AIROH', 'COMMANDER 2', '拉力盔 / ADV盔', 'adv|touring|offroad', 'ADV/拉力', '摩旅、站姿和护目镜方向'],
  ['other-helmet-cn', 'AIROH', 'AVIATOR 3', '越野盔', 'offroad', '越野竞赛', '越野和护目镜路线'],
  ['other-helmet-cn', 'NEXX', 'X.WED3', '拉力盔 / ADV盔', 'adv|touring', 'ADV/拉力', '摩旅和长途路线'],
  ['other-helmet-cn', 'NEXX', 'X.R3R', '运动全盔', 'sport|track', '街道运动', '跑山与高速运动'],
  ['other-helmet-cn', 'CABERG', 'Flyon II', '3/4盔', 'city|touring', '意式城市旅行', '通勤和轻旅行'],
  ['other-helmet-cn', 'NOLAN', 'N21 Visor', '开放式盔', 'city|retro', '意式复古开放式', '城市巡航和复古路线']
];

const ARMOR = [
  ['scoyco-jd', '赛羽', 'JK188 + P188', '拉力/四季上下装', 'adv|touring|allSeason', '国产拉力', '温差、摩旅和上下装搭配'],
  ['scoyco-jd', '赛羽', 'JK189 + P189', '网眼上下装', 'summer|commute|touring', '国产夏季实用', '炎热天气和日常骑行'],
  ['scoyco-jd', '赛羽', 'JK186 防水骑行服系列', '四季纺织骑行服', 'touring|rain|allSeason', '国产四季实用', '雨天与通勤摩旅'],
  ['scoyco-jd', '赛羽', 'JK181 网眼骑行服系列', '夏季网眼骑行服', 'summer|commute', '国产夏季实用', '城市夏季与近郊'],
  ['scoyco-jd', '赛羽', 'P188 骑行裤', '拉力/纺织骑行裤', 'adv|touring|allSeason', '国产拉力', '补齐裤装或与同系列上衣搭配'],
  ['scoyco-jd', '赛羽', 'P183 骑行牛仔裤系列', '防护牛仔裤', 'city|commute|daily', '城市低调', '下车后仍希望日常化的人'],
  ['dainese-jd', 'DAINESE', 'Carve Master 4 Gore-Tex', '层压/防水旅行夹克', 'touring|rain|allSeason', '意式旅行机能', '多天气公路摩旅'],
  ['dainese-jd', 'DAINESE', 'Air Frame D1 Tex', '夏季网眼骑行服', 'summer|commute|sport', '意式城市运动', '炎热天气和街道运动'],
  ['dainese-jd', 'DAINESE', 'Avro 5 Tex Jacket', '街道运动夹克', 'sport|city', '意式街道运动', '跑山与运动街车'],
  ['dainese-jd', 'DAINESE', 'Hydraflux 2 Air D-Dry', '可拆防水网眼夹克', 'summer|rain|commute', '意式城市机能', '夏季但偶遇雨天'],
  ['dainese-jd', 'DAINESE', 'Herosphere Air Tex', '夏季网眼骑行服', 'summer|commute', '意式轻量城市', '高温通勤'],
  ['dainese-jd', 'DAINESE', 'Ignite Tex Jacket', '城市纺织骑行服', 'city|commute|daily', '意式城市休闲', '低调日常外观'],
  ['dainese-jd', 'DAINESE', 'Super Rider 2 Absoluteshell', '运动纺织夹克', 'sport|rain|city', '意式街道运动', '气候变化下的跑山'],
  ['dainese-jd', 'DAINESE', 'Sterrato Tex Jacket', 'ADV/拉力夹克', 'adv|touring|summer', '意式探险', '摩旅、站姿与多口袋需求'],
  ['dainese-jd', 'DAINESE', 'Desert Tex Jacket', 'ADV/拉力夹克', 'adv|touring|summer', '意式探险', '高温摩旅和分层穿法'],
  ['dainese-jd', 'DAINESE', 'Springbok 3L Absoluteshell', '层压ADV夹克', 'adv|touring|rain', '意式探险', '多天气长线旅行'],
  ['dainese-jd', 'DAINESE', 'Laguna Seca 5 2PCS', '两件式皮衣', 'sport|track', '意式赛道运动', '跑山、赛道日与上下装连接'],
  ['dainese-jd', 'DAINESE', 'Laguna Seca 6 1PC', '连体皮衣', 'track', '意式赛道竞技', '正规封闭赛道'],
  ['dainese-jd', 'DAINESE', 'Misano 3 D-air', '气囊连体皮衣', 'track', '意式赛道竞技', '赛道与气囊体系'],
  ['dainese-jd', 'DAINESE', 'Delta 4 Leather Pants', '骑行皮裤', 'sport|track', '意式赛道运动', '皮衣上下装连接或赛道日'],
  ['dainese-jd', 'DAINESE', 'Drake 2 Super Air Pants', '夏季网眼骑行裤', 'summer|commute|sport', '意式夏季运动', '高温街道骑行'],
  ['dainese-jd', 'DAINESE', 'Casual Regular Tex Pants', '防护休闲裤', 'city|commute|daily', '城市低调', '下车仍想像普通裤装'],
  ['astar-jd', 'Alpinestars', 'T-SPS Air V2', '夏季运动纺织夹克', 'summer|commute|sport', '街道运动', '高温通勤和跑山'],
  ['astar-jd', 'Alpinestars', 'GP Force V2 Leather Jacket', '街道运动皮衣', 'sport|track', '赛道街道', '跑山与皮衣上下装路线'],
  ['astar-jd', 'Alpinestars', 'GP Plus R V4 Rideknit', '运动皮衣', 'sport|track', '赛道街道', '公路运动与高强度跑山'],
  ['astar-jd', 'Alpinestars', 'Missile V3 Leather Jacket', '运动皮衣', 'sport|track', '赛道街道', '护具固定和耐磨优先'],
  ['astar-jd', 'Alpinestars', 'Halo Drystar', '四季/ADV夹克', 'adv|touring|rain', 'ADV机能', '多天气摩旅'],
  ['astar-jd', 'Alpinestars', 'Bogotá Pro Drystar', '四季/ADV夹克', 'adv|touring|rain', 'ADV机能', '雨天和长途分层'],
  ['astar-jd', 'Alpinestars', 'AMT-10R DrystarXF', '层压ADV夹克', 'adv|touring|rain', 'ADV机能', '高强度长途和天气变化'],
  ['astar-jd', 'Alpinestars', 'ST-1 WP', '防水通勤夹克', 'commute|rain|touring', '城市旅行', '日常下雨与中短途'],
  ['astar-jd', 'Alpinestars', 'T-Jaws V4 WP', '防水运动夹克', 'sport|rain|city', '街道运动', '雨天跑山和街车'],
  ['astar-jd', 'Alpinestars', 'T-Supertech Air', '夏季运动网眼夹克', 'summer|sport', '街道运动', '高温下的运动骑姿'],
  ['astar-jd', 'Alpinestars', 'Boulder Gore-Tex', '防水旅行夹克', 'touring|rain|allSeason', '长途机能', '多雨长途'],
  ['astar-jd', 'Alpinestars', 'Andes V4 Drystar', '四季旅行夹克', 'touring|rain|allSeason', '旅行实用', '预算内的四季摩旅'],
  ['astar-jd', 'Alpinestars', 'Tech-Air 5 Plasma', '气囊背心', 'sport|touring|track', '安全叠穿', '希望给现有骑行服增加气囊层'],
  ['astar-jd', 'Alpinestars', 'Bionic Action V2 Protection Jacket', '护甲衬衣', 'sport|adv|offroad', '护甲叠穿', '作为护具层搭配耐磨外层'],
  ['revit-jd', 'REV’IT!', 'Sand 5 H2O', 'ADV/拉力夹克', 'adv|touring|rain', '荷兰ADV机能', '多天气摩旅'],
  ['revit-jd', 'REV’IT!', 'Offtrack 2 H2O', 'ADV/拉力夹克', 'adv|touring|rain', '荷兰ADV机能', '公路与轻非铺装旅行'],
  ['revit-jd', 'REV’IT!', 'Levante 2 H2O', '网眼旅行夹克', 'summer|touring|rain', '荷兰旅行机能', '夏季旅行和可拆防水层'],
  ['revit-jd', 'REV’IT!', 'Cayenne 2', '高通风ADV夹克', 'summer|adv|touring', '荷兰ADV机能', '炎热摩旅与站姿活动'],
  ['revit-jd', 'REV’IT!', 'Airwave 4', '夏季网眼骑行服', 'summer|commute|touring', '荷兰夏季机能', '高温通勤与旅行'],
  ['revit-jd', 'REV’IT!', 'Hyperspeed 2 H2O', '防水运动夹克', 'sport|rain|city', '荷兰街道运动', '雨天街道运动'],
  ['revit-jd', 'REV’IT!', 'Quantum 2 H2O', '运动纺织夹克', 'sport|city', '荷兰街道运动', '街车和跑山'],
  ['revit-jd', 'REV’IT!', 'Apex Leather Jacket', '街道运动皮衣', 'sport|track', '赛道街道', '皮衣路线'],
  ['revit-jd', 'REV’IT!', 'Ignition 4 H2O', '网眼皮衣/防水夹克', 'summer|sport|rain', '运动旅行', '夏季跑山与天气变化'],
  ['revit-jd', 'REV’IT!', 'Control Leather Jacket', '街道运动皮衣', 'sport|track', '赛道街道', '运动皮衣和护具固定'],
  ['revit-jd', 'REV’IT!', 'Poseidon 3 GTX', '层压防水旅行夹克', 'touring|rain|allSeason', '高端旅行', '长线多雨摩旅'],
  ['revit-jd', 'REV’IT!', 'Neptune 3 GTX', '防水旅行夹克', 'touring|rain|allSeason', '旅行机能', '四季通勤与长途'],
  ['taichi-cn', 'RS TAICHI', 'RSJ356 LITE AIR JACKET', '夏季网眼骑行服', 'summer|commute', '日系城市机能', '炎热城市通勤'],
  ['taichi-cn', 'RS TAICHI', 'RSJ354 AIR PARKA', '夏季连帽网眼骑行服', 'summer|commute|daily', '日系城市休闲', '下车后仍想自然穿着'],
  ['taichi-cn', 'RS TAICHI', 'RSJ335 QUICK DRY PARKA', '速干骑行服', 'summer|commute|daily', '日系城市休闲', '高温和频繁短途'],
  ['taichi-cn', 'RS TAICHI', 'RSJ342 QUICK DRY RACER JACKET', '夏季运动骑行服', 'summer|sport', '日系街道运动', '跑山和夏季街车'],
  ['taichi-cn', 'RS TAICHI', 'RSJ334 AIR FLIP PARKA', '夏季连帽网眼骑行服', 'summer|commute|daily', '日系城市休闲', '城市通勤与日常比例'],
  ['taichi-cn', 'RS TAICHI', 'RSJ351 AIR FLIGHT JACKET', 'MA-1网眼骑行服', 'summer|commute|daily', '日系街头复古', '城市和复古车搭配'],
  ['taichi-cn', 'RS TAICHI', 'RSJ353 MILES AIR JACKET', '工装网眼骑行服', 'summer|commute|touring', '日系工装机能', '高温通勤和轻摩旅'],
  ['taichi-cn', 'RS TAICHI', 'RSJ343 QUICK DRY FLIGHT JACKET', '速干飞行夹克', 'summer|commute|daily', '日系街头复古', '日常穿着优先'],
  ['taichi-cn', 'RS TAICHI', 'RSJ355 QUICK DRY SMART JACKET', '速干城市骑行服', 'summer|commute|daily', '日系城市简约', '低调通勤'],
  ['taichi-cn', 'RS TAICHI', 'RSY273 CORDURA LITE AIR PANTS', '夏季骑行裤', 'summer|commute', '日系城市机能', '补齐夏季下装'],
  ['taichi-cn', 'RS TAICHI', 'RSY258 QUICK DRY CARGO PANTS', '速干工装骑行裤', 'summer|commute|daily', '日系工装机能', '城市通勤和日常外观'],
  ['taichi-cn', 'RS TAICHI', 'RSY271 QUICK DRY STRAIGHT PANTS', '速干直筒骑行裤', 'summer|commute|daily', '日系城市简约', '日常下装优先'],
  ['taichi-cn', 'RS TAICHI', 'RSY272 QUICK DRY MESH PANTS', '速干网眼骑行裤', 'summer|commute', '日系夏季机能', '炎热天气补齐裤装'],
  ['komine-jd', 'KOMINE', 'JK-155 Protect Mesh Rider Shirt', '网眼骑行衬衫', 'summer|commute|daily', '日系城市休闲', '夏季低调外观'],
  ['komine-jd', 'KOMINE', 'JK-162 Protect Mesh Hoodie', '连帽网眼骑行服', 'summer|commute|daily', '日系城市休闲', '日常城市骑行'],
  ['komine-jd', 'KOMINE', 'JK-146 Protect Half Mesh Jacket', '半网眼骑行服', 'summer|commute', '日系通勤', '炎热城市和近郊'],
  ['komine-jd', 'KOMINE', 'JK-114 Protect Mesh Parka-TEN', '网眼连帽骑行服', 'summer|commute|daily', '日系城市休闲', '下车后不突兀'],
  ['komine-jd', 'KOMINE', 'JK-112 Protect Half Mesh Jacket', '半网眼骑行服', 'summer|commute', '日系通勤', '高温短途'],
  ['komine-jd', 'KOMINE', 'JK-087 Protect Riding Mesh Parka', '网眼连帽骑行服', 'summer|commute|daily', '日系城市休闲', '城市日常'],
  ['komine-jd', 'KOMINE', 'JK-590 Protect Softshell Winter Parka', '冬季软壳骑行服', 'commute|cold|rain', '日系冬季通勤', '低温通勤'],
  ['komine-jd', 'KOMINE', 'JK-597 Full Year Jacket', '四季纺织骑行服', 'touring|rain|allSeason', '日系四季实用', '四季通勤和旅行'],
  ['komine-jd', 'KOMINE', 'JK-613 Protect Mesh Adventure Jacket', 'ADV网眼骑行服', 'summer|adv|touring', '日系ADV', '夏季摩旅与轻非铺装'],
  ['klim-global', 'KLIM', 'Badlands Pro A3 Jacket + Pant', '高端ADV套装', 'adv|touring|rain', '北美探险', '重装长线摩旅；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Carlsbad Jacket + Pant', 'ADV/拉力套装', 'adv|touring|rain', '北美探险', '多天气探险路线；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Kodiak Jacket + Pant', '层压旅行套装', 'touring|rain|allSeason', '北美旅行', '公路长途；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Latitude Jacket + Pant', '层压旅行套装', 'touring|rain|allSeason', '北美旅行', '多雨长途；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Marrakesh Jacket', '高透气纺织骑行服', 'summer|commute|touring', '北美城市机能', '炎热地区道路骑行；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Induction Pro Jacket', '夏季网眼骑行服', 'summer|commute|touring', '北美夏季机能', '高温通勤与摩旅；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Baja S4 Jacket + Pant', '高通风ADV套装', 'summer|adv|touring', '北美探险', '高温摩旅；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Dakar Jacket + Pant', '越野/拉力外层', 'adv|offroad|summer', '北美越野', '林道与轻越野叠穿；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Traverse Jacket + Pant', '防水越野/拉力外层', 'adv|offroad|rain', '北美越野', '雨天越野与叠穿；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'K Fifty 1 Relaxed Jean', '防护牛仔裤', 'city|commute|daily', '北美复古城市', '复古/城市路线；国内具体版本待核验'],
  ['rst-cn', 'RST', 'TracTech Evo 5 Jacket + Pant', '两件式皮衣', 'sport|track', '英式赛道运动', '跑山和赛道日'],
  ['rst-cn', 'RST', 'Adventure-X Jacket + Pant', 'ADV/拉力套装', 'adv|touring|rain', '英式探险', '摩旅和复杂天气'],
  ['rst-cn', 'RST', 'Pro Series Adventure-X Airbag', '气囊ADV套装', 'adv|touring|rain', '英式探险', '气囊与长途路线'],
  ['rst-cn', 'RST', 'S-1 CE Leather Jacket', '街道运动皮衣', 'sport|track', '英式街道运动', '跑山和运动街车'],
  ['rst-cn', 'RST', 'Pilot Evo CE Textile Jacket', '纺织旅行夹克', 'touring|rain|commute', '英式实用旅行', '通勤和中短途'],
  ['richa-cn', 'RICHA', 'Atlantic 2 GTX Jacket + Pant', '层压旅行套装', 'touring|rain|allSeason', '欧式旅行机能', '多天气长途'],
  ['richa-cn', 'RICHA', 'Airsummer Jacket', '夏季网眼骑行服', 'summer|commute', '欧式夏季实用', '炎热通勤'],
  ['richa-cn', 'RICHA', 'Cyclone 2 GTX Jacket', '防水旅行夹克', 'touring|rain|allSeason', '欧式旅行机能', '雨天与长途'],
  ['richa-cn', 'RICHA', 'Toulon 2 Jacket', '城市复古皮衣', 'city|retro|daily', '欧式复古', '复古/巡航路线'],
  ['spidi-cn', 'SPIDI', '4 Season Evo', '四季ADV夹克', 'adv|touring|rain', '意式探险', '多天气摩旅'],
  ['spidi-cn', 'SPIDI', 'Traveler 3', '防水旅行夹克', 'touring|rain|allSeason', '意式旅行', '公路摩旅'],
  ['spidi-cn', 'SPIDI', 'Allroad H2Out', 'ADV/拉力夹克', 'adv|touring|rain', '意式探险', '旅行与轻非铺装'],
  ['spidi-cn', 'SPIDI', 'Netstream', '夏季网眼骑行服', 'summer|commute|sport', '意式夏季运动', '高温街道骑行'],
  ['spidi-cn', 'SPIDI', 'Track Wind Pro', '连体赛道皮衣', 'track', '意式赛道竞技', '正规封闭赛道']
];

const GLOVES = [
  ['scoyco-jd', '赛羽', 'MC183', '夏季短护腕手套', 'summer|commute', '国产夏季实用', '高温通勤与手机操作'],
  ['scoyco-jd', '赛羽', 'MC74 复古皮革手套系列', '复古短护腕手套', 'city|retro', '国产复古', '复古/巡航和城市路线'],
  ['scoyco-jd', '赛羽', 'MC29 防水保暖手套系列', '防水保暖手套', 'touring|rain|cold', '国产旅行实用', '低温雨天和摩旅'],
  ['astar-jd', 'Alpinestars', 'SP-2 V3', '街道运动长护腕手套', 'sport|touring', '街道运动', '跑山和公路运动'],
  ['astar-jd', 'Alpinestars', 'GP Plus R V3', '赛道长护腕手套', 'track|sport', '赛道竞技', '赛道日与高速运动'],
  ['astar-jd', 'Alpinestars', 'GP Tech V2', '赛道长护腕手套', 'track', '赛道竞技', '明确赛道防护优先'],
  ['astar-jd', 'Alpinestars', 'Halo Leather Gloves', '旅行/运动手套', 'touring|sport', '旅行机能', '多用途公路骑行'],
  ['astar-jd', 'Alpinestars', 'Tourer W-7 Drystar', '防水保暖手套', 'touring|rain|cold', '旅行机能', '低温多雨长途'],
  ['astar-jd', 'Alpinestars', 'WR-2 V2 Gore-Tex', '防水保暖手套', 'touring|rain|cold', '旅行机能', '寒冷雨天'],
  ['astar-jd', 'Alpinestars', 'Copper Gloves', '城市短护腕手套', 'city|commute|summer', '城市实用', '日常通勤'],
  ['astar-jd', 'Alpinestars', 'Reef V2 Gloves', '夏季短护腕手套', 'summer|commute', '城市夏季', '炎热天气'],
  ['astar-jd', 'Alpinestars', 'Andes V3 Drystar Gloves', '防水旅行手套', 'touring|rain|cold', '旅行机能', '雨天摩旅'],
  ['astar-jd', 'Alpinestars', 'Bogotá Drystar XF Gloves', '防水旅行手套', 'touring|rain', 'ADV机能', '多天气ADV'],
  ['dainese-jd', 'DAINESE', '4 Stroke 2', '街道运动短护腕手套', 'sport|summer', '意式街道运动', '夏季跑山'],
  ['dainese-jd', 'DAINESE', 'MIG 3 Air', '夏季短护腕手套', 'summer|commute', '意式夏季城市', '高温通勤'],
  ['dainese-jd', 'DAINESE', 'Blackjack 2', '复古皮革手套', 'city|retro', '意式复古', '复古/巡航路线'],
  ['dainese-jd', 'DAINESE', 'Tempest 3 D-Dry Long', '防水长护腕手套', 'touring|rain|cold', '意式旅行机能', '低温雨天摩旅'],
  ['dainese-jd', 'DAINESE', 'X-Ride 2 Ergo-Tek', '旅行/运动手套', 'touring|sport', '意式运动旅行', '公路多用途'],
  ['dainese-jd', 'DAINESE', 'Scout 2 Gore-Tex', '防水保暖手套', 'touring|rain|cold', '意式旅行机能', '雨天和低温'],
  ['dainese-jd', 'DAINESE', 'Bora Gloves', '夏季短护腕手套', 'summer|commute', '意式夏季城市', '高温通勤'],
  ['revit-jd', 'REV’IT!', 'Sand 5 Gloves', 'ADV通风手套', 'adv|touring|summer', '荷兰ADV机能', '高温摩旅与站姿'],
  ['revit-jd', 'REV’IT!', 'Sand 5 H2O Gloves', '防水ADV手套', 'adv|touring|rain', '荷兰ADV机能', '雨天摩旅'],
  ['revit-jd', 'REV’IT!', 'Volcano 3 Gloves', '夏季网眼手套', 'summer|commute|touring', '荷兰夏季机能', '高温通勤和旅行'],
  ['revit-jd', 'REV’IT!', 'Dirt 4 Gloves', 'ADV护甲手套', 'adv|offroad|touring', '荷兰ADV机能', '探险和轻非铺装'],
  ['revit-jd', 'REV’IT!', 'League 2 Gloves', '赛道长护腕手套', 'track|sport', '赛道竞技', '赛道日'],
  ['revit-jd', 'REV’IT!', 'Quantum 2 Gloves', '街道运动手套', 'sport|city', '荷兰街道运动', '跑山和街车'],
  ['revit-jd', 'REV’IT!', 'RSR 4 Gloves', '街道运动手套', 'sport|city', '荷兰街道运动', '公路运动'],
  ['revit-jd', 'REV’IT!', 'Hydra 3 H2O Gloves', '防水手套', 'commute|rain|cold', '荷兰城市机能', '雨天通勤'],
  ['revit-jd', 'REV’IT!', 'Livengood GTX Gloves', '防水保暖手套', 'touring|rain|cold', '荷兰旅行机能', '低温摩旅'],
  ['revit-jd', 'REV’IT!', 'Kinetic 2 Gloves', '夏季短护腕手套', 'summer|commute', '荷兰夏季城市', '炎热日常'],
  ['taichi-cn', 'RS TAICHI', 'RST474 LITE AIR GLOVES', '夏季网眼手套', 'summer|commute', '日系夏季机能', '炎热城市通勤'],
  ['taichi-cn', 'RS TAICHI', 'RST444', '夏季街道手套', 'summer|commute|sport', '日系街道运动', '日常与跑山'],
  ['taichi-cn', 'RS TAICHI', 'RST448', '城市骑行手套', 'city|commute', '日系城市机能', '短途通勤'],
  ['taichi-cn', 'RS TAICHI', 'RST451', '运动骑行手套', 'sport|city', '日系街道运动', '跑山和街车'],
  ['taichi-cn', 'RS TAICHI', 'RST454', '防水保暖手套', 'touring|rain|cold', '日系旅行机能', '雨天和低温'],
  ['komine-jd', 'KOMINE', 'GK-215 Protect 3D Mesh Gloves', '夏季网眼手套', 'summer|commute', '日系通勤', '高温城市'],
  ['komine-jd', 'KOMINE', 'GK-217 CE Protect Leather Gloves', '皮革街道手套', 'sport|city', '日系街道运动', '跑山和街车'],
  ['komine-jd', 'KOMINE', 'GK-235 Titanium Racing Gloves', '赛道长护腕手套', 'track|sport', '赛道竞技', '赛道与高强度跑山'],
  ['komine-jd', 'KOMINE', 'GK-245 Protect Rain Short Gloves', '短护腕防水手套', 'commute|rain', '日系城市机能', '雨天通勤'],
  ['komine-jd', 'KOMINE', 'GK-247 Protect Leather Mesh Gloves', '皮革网眼手套', 'summer|sport', '日系街道运动', '夏季跑山'],
  ['komine-jd', 'KOMINE', 'GK-266 Protect 3D Mesh Gloves', '夏季网眼手套', 'summer|commute', '日系通勤', '高温短途'],
  ['rst-cn', 'RST', 'TracTech Evo 4 Gloves', '赛道长护腕手套', 'track|sport', '英式赛道竞技', '赛道日'],
  ['rst-cn', 'RST', 'Adventure-X Gloves', 'ADV/旅行手套', 'adv|touring|rain', '英式探险', '多天气摩旅'],
  ['rst-cn', 'RST', 'Atlas Waterproof Gloves', '防水保暖手套', 'touring|rain|cold', '英式旅行', '低温雨天'],
  ['richa-cn', 'RICHA', 'Stealth Gloves', '街道运动手套', 'sport|city', '欧式街道运动', '跑山和街车'],
  ['richa-cn', 'RICHA', 'Atlantic 2 GTX Gloves', '防水旅行手套', 'touring|rain|cold', '欧式旅行机能', '雨天摩旅'],
  ['spidi-cn', 'SPIDI', 'Carbo Track EVO', '赛道长护腕手套', 'track', '意式赛道竞技', '赛道使用'],
  ['spidi-cn', 'SPIDI', 'X-Force Gloves', '运动短护腕手套', 'sport|city', '意式街道运动', '跑山和街车'],
  ['klim-global', 'KLIM', 'Baja S4 Gloves', 'ADV通风手套', 'summer|adv|touring', '北美探险', '高温摩旅；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Dakar Pro Gloves', '越野/ADV手套', 'adv|offroad', '北美越野', '林道与轻越野；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Induction Gloves', '夏季网眼手套', 'summer|commute|touring', '北美夏季机能', '高温公路；国内具体版本待核验']
];

const BOOTS = [
  ['scoyco-jd', '赛羽', 'MT040', '城市短靴', 'city|commute|daily', '国产城市运动', '通勤和下车走路'],
  ['scoyco-jd', '赛羽', 'MT048', '城市短靴', 'city|commute|daily', '国产城市运动', '日常通勤'],
  ['scoyco-jd', '赛羽', 'R2 骑行短靴', '城市短靴', 'city|commute|sport', '国产街道运动', '街车与短途'],
  ['astar-jd', 'Alpinestars', 'SMX Plus V2', '赛道高筒靴', 'track|sport', '赛道竞技', '赛道日与运动骑行'],
  ['astar-jd', 'Alpinestars', 'Tech 7 Enduro Drystar', '越野高筒靴', 'offroad|adv', '越野探险', '林道和非铺装'],
  ['astar-jd', 'Alpinestars', 'Tech 10', '越野竞赛靴', 'offroad', '越野竞技', '场地越野和高强度越野'],
  ['astar-jd', 'Alpinestars', 'Toucan Gore-Tex', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '多天气长途'],
  ['astar-jd', 'Alpinestars', 'Corozal Adventure Drystar', 'ADV中高筒靴', 'adv|touring|rain', 'ADV探险', '摩旅和轻非铺装'],
  ['astar-jd', 'Alpinestars', 'Belize Drystar', 'ADV中筒靴', 'adv|touring|rain', 'ADV探险', '旅行与步行折中'],
  ['astar-jd', 'Alpinestars', 'Andes V2 Drystar', '防水旅行靴', 'touring|rain|commute', '旅行实用', '雨天摩旅'],
  ['astar-jd', 'Alpinestars', 'CR-X Drystar', '城市骑行鞋', 'city|commute|rain', '城市机能', '通勤与城市步行'],
  ['astar-jd', 'Alpinestars', 'Sektor', '城市骑行鞋', 'city|commute|sport', '街道运动', '短途和街车'],
  ['dainese-jd', 'DAINESE', 'Axial 2', '赛道高筒靴', 'track|sport', '意式赛道竞技', '赛道日'],
  ['dainese-jd', 'DAINESE', 'Sport Master Gore-Tex', '防水运动靴', 'sport|touring|rain', '意式运动旅行', '雨天跑山和旅行'],
  ['dainese-jd', 'DAINESE', 'Fulcrum 3 Gore-Tex', '防水旅行靴', 'touring|rain|allSeason', '意式旅行机能', '四季摩旅'],
  ['dainese-jd', 'DAINESE', 'Atipica Air 2', '夏季城市骑行鞋', 'summer|commute', '意式城市夏季', '炎热通勤'],
  ['dainese-jd', 'DAINESE', 'Suburb Air', '夏季城市骑行鞋', 'summer|commute|daily', '意式城市休闲', '日常短途'],
  ['dainese-jd', 'DAINESE', 'York Air', '夏季城市骑行鞋', 'summer|commute|daily', '意式城市休闲', '下车走路较多'],
  ['dainese-jd', 'TCX', 'Hero WP', '防水旅行靴', 'touring|rain|commute', '意式旅行实用', '雨天和长途'],
  ['dainese-jd', 'TCX', 'Drifter WP', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '旅行与轻非铺装'],
  ['dainese-jd', 'TCX', 'Explorer 4 GTX', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '多天气摩旅'],
  ['dainese-jd', 'TCX', 'Infinity 3 GTX', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '长途和烂路'],
  ['dainese-jd', 'TCX', 'Climatrek Surround', '防水旅行靴', 'touring|rain|allSeason', '旅行机能', '多天气公路摩旅'],
  ['dainese-jd', 'TCX', 'Dartwood WP', '城市骑行鞋', 'city|commute|rain', '城市机能', '日常防水通勤'],
  ['dainese-jd', 'TCX', 'Ikasu Air', '夏季城市骑行鞋', 'summer|commute|daily', '城市夏季', '高温短途'],
  ['other-helmet-cn', 'SIDI', 'ST', '赛道高筒靴', 'track|sport', '意式赛道竞技', '赛道与跑山'],
  ['other-helmet-cn', 'SIDI', 'MAG-1', '赛道高筒靴', 'track', '意式赛道竞技', '赛道日'],
  ['other-helmet-cn', 'SIDI', 'Vertigo 2', '运动高筒靴', 'sport|track', '意式街道运动', '跑山与运动骑行'],
  ['other-helmet-cn', 'SIDI', 'Crossfire 3', '越野竞赛靴', 'offroad', '越野竞技', '场地越野'],
  ['other-helmet-cn', 'SIDI', 'Adventure 2 Mid', 'ADV中高筒靴', 'adv|touring|rain', 'ADV探险', '摩旅与步行折中'],
  ['other-helmet-cn', 'SIDI', 'Performer', '运动高筒靴', 'sport|track', '意式街道运动', '跑山和赛道日'],
  ['other-helmet-cn', 'SIDI', 'Aria Gore-Tex', '防水旅行靴', 'touring|rain|commute', '旅行机能', '雨天公路旅行'],
  ['other-helmet-cn', 'SIDI', 'Nucleus', '城市骑行鞋', 'city|commute|daily', '城市运动', '通勤和城市步行'],
  ['other-helmet-cn', 'FORMA', 'Adventure Dry', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '摩旅和轻非铺装'],
  ['other-helmet-cn', 'FORMA', 'Terra EVO Dry', 'ADV高筒靴', 'adv|touring|offroad', 'ADV探险', '旅行和烂路'],
  ['other-helmet-cn', 'FORMA', 'Terra EVO Low Dry', 'ADV中筒靴', 'adv|touring|daily', 'ADV实用', '旅行与步行折中'],
  ['other-helmet-cn', 'FORMA', 'Freccia EVO', '运动高筒靴', 'sport|track', '街道运动', '跑山和赛道日'],
  ['other-helmet-cn', 'FORMA', 'Ice Pro', '赛道高筒靴', 'track', '赛道竞技', '赛道使用'],
  ['other-helmet-cn', 'FORMA', 'Pilot', '越野竞赛靴', 'offroad', '越野竞技', '越野使用'],
  ['other-helmet-cn', 'GAERNE', 'GP-1 EVO', '赛道高筒靴', 'track|sport', '意式赛道竞技', '赛道日'],
  ['other-helmet-cn', 'GAERNE', 'SG-12', '越野竞赛靴', 'offroad', '越野竞技', '场地越野'],
  ['other-helmet-cn', 'GAERNE', 'Dakar Gore-Tex', 'ADV高筒靴', 'adv|touring|rain', 'ADV探险', '摩旅和烂路'],
  ['other-helmet-cn', 'GAERNE', 'G-Adventure', 'ADV中高筒靴', 'adv|touring|rain', 'ADV探险', '轻非铺装与旅行'],
  ['other-helmet-cn', 'GAERNE', 'Balance Pro-Tech', '越野/林道靴', 'offroad|adv', '越野探险', '林道和低速越野'],
  ['taichi-shoes-cn', 'RS TAICHI', 'RSS010 DRYMASTER COMBAT SHOES', 'ADV中筒靴', 'adv|touring|rain', '日系ADV机能', '全天候旅行和烂路'],
  ['taichi-shoes-cn', 'RS TAICHI', 'RSS011 DRYMASTER-FIT HOOP SHOES', '城市骑行鞋', 'city|commute|rain', '日系城市机能', '防水通勤'],
  ['taichi-shoes-cn', 'RS TAICHI', 'RSS012 HOOP AIR SHOES', '夏季城市骑行鞋', 'summer|commute', '日系夏季城市', '炎热通勤'],
  ['taichi-shoes-cn', 'RS TAICHI', 'RSS014 DRYMASTER BREAK SHOES', '防水复古城市鞋', 'city|commute|rain|retro', '日系复古城市', '复古外观和全天候通勤'],
  ['taichi-shoes-cn', 'RS TAICHI', 'RSS016 DRYMASTER STRIKER SHOES', '防水运动骑行鞋', 'city|commute|rain|sport', '日系街道运动', '雨天街车'],
  ['komine-jd', 'KOMINE', 'BK-096 Dial Fit WP Riding Shoes', '防水城市骑行鞋', 'city|commute|rain', '日系城市机能', '雨天通勤'],
  ['komine-jd', 'KOMINE', 'BK-097 WP Adventure Short Boots', 'ADV中筒靴', 'adv|touring|rain', '日系ADV实用', '旅行与轻非铺装'],
  ['komine-jd', 'KOMINE', 'BK-100 Protect WP Boots', '防水旅行靴', 'touring|rain|commute', '日系旅行实用', '雨天通勤与摩旅'],
  ['komine-jd', 'KOMINE', 'BK-078 3D Mesh Riding Shoes', '夏季城市骑行鞋', 'summer|commute', '日系夏季城市', '高温短途'],
  ['klim-global', 'KLIM', 'Adventure GTX Boot', 'ADV高筒靴', 'adv|touring|rain', '北美探险', '多天气摩旅；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Outlander GTX Boot', 'ADV中筒靴', 'adv|touring|rain', '北美探险', '旅行和步行折中；国内具体版本待核验'],
  ['klim-global', 'KLIM', 'Blak Jak GTX Leather Boot', '复古城市皮靴', 'city|commute|retro|rain', '北美复古城市', '复古/巡航；国内具体版本待核验']
];

const LUGGAGE = [
  ['luggage-cn', 'GIVI', 'Trekker Outback EVO', '铝合金三箱系统', 'touring|camp|highway', '欧式ADV旅行', '多日摩旅和硬箱体系'],
  ['luggage-cn', 'GIVI', 'Alaska ALA36 / ALA44', '铝合金边箱系统', 'touring|camp|highway', '欧式ADV旅行', '中大型ADV和长途'],
  ['luggage-cn', 'GIVI', 'Dolomiti DLM30 / DLM46', '铝合金边箱系统', 'touring|camp|highway', '欧式经典旅行', '公路摩旅与硬箱体系'],
  ['luggage-cn', 'GIVI', 'Monokey V47 / V56', '硬质尾箱', 'city|touring|passenger', '通勤旅行', '通勤放头盔和载人短途'],
  ['luggage-cn', 'GIVI', 'Canyon GRT 系列', '软边包系统', 'adv|touring|offroad', 'ADV/拉力', '烂路和轻非铺装'],
  ['luggage-cn', 'GIVI', 'UT801 U-TREKKER', '软边包系统', 'touring|camp|offroad', 'ADV/拉力', '旅行和低重心装载'],
  ['luggage-cn', 'GIVI', 'EA133B EA 系列', '防水尾包', 'city|touring|camp', '实用旅行', '小车和不装支架路线'],
  ['luggage-cn', 'SHAD', 'SH58X Expandable', '可扩展硬质尾箱', 'city|touring|passenger', '西班牙通勤旅行', '日常通勤与短途旅行'],
  ['luggage-cn', 'SHAD', 'SH59X Expandable', '可扩展硬质尾箱', 'touring|passenger|camp', '西班牙通勤旅行', '大容量尾箱'],
  ['luggage-cn', 'SHAD', 'Terra TR48 / TR50', '铝合金尾箱', 'touring|camp|highway', 'ADV/拉力', '摩旅和露营'],
  ['luggage-cn', 'SHAD', 'Terra TR36 / TR47', '铝合金边箱', 'touring|camp|highway', 'ADV/拉力', '三箱体系'],
  ['luggage-cn', 'SW-MOTECH', 'TRAX ADV', '铝合金三箱系统', 'touring|camp|highway', '德系ADV旅行', '车型专用支架与长途'],
  ['luggage-cn', 'SW-MOTECH', 'DUSC', '硬质边箱系统', 'touring|camp|highway', '德系实用旅行', '公路摩旅和耐用系统'],
  ['luggage-cn', 'SW-MOTECH', 'PRO Side Carrier + SysBag WP', '软边包系统', 'touring|camp|offroad', '德系模块化', '轻量、模块化旅行'],
  ['luggage-cn', 'SW-MOTECH', 'Drybag 600', '防水尾包', 'city|touring|camp', '德系实用旅行', '不常出行的可拆卸装载'],
  ['luggage-cn', 'Kriega', 'OS-BASE + OS-32', '软边包系统', 'adv|touring|offroad', '英式ADV轻量', '轻非铺装和低重心'],
  ['luggage-cn', 'Kriega', 'Trail18 Adventure Backpack', '骑士背包', 'city|adv|touring', '英式轻量旅行', '少量随身装备'],
  ['luggage-cn', 'Giant Loop', 'Coyote Saddlebag', '无支架软驮包', 'adv|offroad|camp', '北美越野探险', '越野和轻量露营'],
  ['luggage-cn', 'Giant Loop', 'Great Basin Saddlebag', '无支架软驮包', 'adv|touring|camp', '北美越野探险', '多日摩旅和非铺装'],
  ['luggage-cn', 'Giant Loop', 'Siskiyou Panniers', '软边包系统', 'adv|touring|offroad', '北美越野探险', '低重心和烂路'],
  ['luggage-cn', 'Enduristan', 'Blizzard Saddle Bags', '无支架软边包', 'adv|offroad|touring', '瑞士ADV机能', '非铺装和轻量旅行'],
  ['luggage-cn', 'Enduristan', 'Monsoon EVO', '软边包系统', 'adv|touring|offroad', '瑞士ADV机能', '长途防水与轻非铺装'],
  ['luggage-cn', 'Enduristan', 'Tornado Pack Sack', '防水尾包', 'touring|camp|offroad', '瑞士ADV机能', '露营和防水打包'],
  ['luggage-cn', 'Enduristan', 'Sandstorm 4 Tank Bag', '油箱包', 'city|touring|adv', '瑞士ADV机能', '导航和小物快速取用'],
  ['luggage-cn', 'Mosko Moto', 'Reckless 80', '无支架软驮包', 'adv|offroad|camp', '北美越野探险', '重度非铺装与露营'],
  ['luggage-cn', 'Mosko Moto', 'Backcountry 35', '软边包系统', 'adv|touring|offroad', '北美越野探险', '远途和摔车风险更高路线'],
  ['luggage-cn', '洛克兄弟', '防水尾包系列', '防水尾包', 'city|touring|camp', '国产实用旅行', '预算通勤和短途'],
  ['luggage-cn', 'NICECNC', '车型侧包支架系统', '车型支架/软包附件', 'adv|touring|offroad', '国产改装机能', '先核对车型适配'],
  ['luggage-cn', 'HEPCO & BECKER', 'XPLORER Cutout', '铝合金边箱', 'touring|camp|highway', '德系旅行', '长途和支架体系'],
  ['luggage-cn', 'KAPPA', 'KGR52 Garda', '硬质尾箱', 'city|touring|passenger', '意式实用旅行', '通勤与放头盔']
];

const LIGHTS = [
  ['lights-cn', 'DENALI', 'D3 LED Driving Light', '公路辅助灯', 'night|touring|highway', '美式模块化照明', '夜间国道和公路摩旅'],
  ['lights-cn', 'DENALI', 'D4 LED Light Pods', '远近兼顾辅助灯', 'night|touring|highway', '美式模块化照明', '长途和可调光型需求'],
  ['lights-cn', 'DENALI', 'D7 PRO', '远射辅助灯', 'night|touring|highway', '美式模块化照明', '高速夜路，必须注意对向眩光'],
  ['lights-cn', 'DENALI', 'S4 LED Light Pods', '小体积辅助灯', 'night|city|touring', '美式模块化照明', '车头空间有限的道路照明'],
  ['lights-cn', 'DENALI', 'DRL Daytime Running Light', '日行灯/被看见灯', 'city|night', '美式安全可见性', '提高白天可见性，不能替代主照明'],
  ['lights-cn', 'Baja Designs', 'S1', '微型辅助灯', 'night|city|offroad', '北美越野照明', '小体积安装与近场补光'],
  ['lights-cn', 'Baja Designs', 'Squadron Pro', '越野辅助灯', 'night|offroad', '北美越野照明', '非铺装与夜间越野'],
  ['lights-cn', 'Baja Designs', 'LP4', '远射/泛光组合灯', 'night|offroad|touring', '北美越野照明', '长途和多光型组合'],
  ['lights-cn', 'Baja Designs', 'LP6', '高功率越野灯', 'night|offroad', '北美越野照明', '封闭或非铺装场景，公路安装需严格核对法规'],
  ['lights-cn', 'PIAA', 'LP530', '公路辅助灯', 'night|touring|highway', '日系公路照明', '夜间公路和摩旅'],
  ['lights-cn', 'PIAA', 'LP550', '远射辅助灯', 'night|touring|highway', '日系公路照明', '长距离照明，防眩和安装方向优先'],
  ['lights-cn', 'Cyclops', 'Aurora 2.0', '公路辅助灯', 'night|touring|highway', '北美旅行照明', '夜间摩旅'],
  ['lights-cn', 'Clearwater', 'Darla', '公路辅助灯', 'night|touring|highway', '北美旅行照明', '公路长途'],
  ['lights-cn', 'Clearwater', 'Erica', '远射辅助灯', 'night|touring|highway', '北美旅行照明', '长距离夜路'],
  ['lights-cn', 'Rigid Industries', 'D-Series Pro', '越野辅助灯', 'night|offroad|touring', '北美越野照明', '越野和多用途安装'],
  ['lights-cn', 'Rigid Industries', '360-Series', '模块化辅助灯', 'night|offroad|touring', '北美越野照明', '多光型组合'],
  ['lights-cn', '国产合规改装方案', '带截止线铺路灯 + 独立线束', '截止线近场辅助灯方案', 'night|city|touring', '国产实用安全', '城市与国道，优先不晃人'],
  ['lights-cn', '国产合规改装方案', '雾天黄光/宽角辅助灯 + 继电器保险', '雾天宽角辅助灯方案', 'night|rain|touring', '国产实用安全', '雨雾可见性，不能替代减速'],
  ['lights-cn', '车型专用改装方案', 'CAN 总线兼容控制器 + 低功耗辅助灯', '车辆电路适配方案', 'night|touring', '车型原厂感', '有CAN总线车型，先核对电路和保修']
];

const INTERCOM = [
  ['intercom-cn', 'SENA', '50C', '摄像一体头盔耳机', 'solo|pair|group', '科技旅行', '记录骑行且需要对讲'],
  ['intercom-cn', 'SENA', '10S', '双人/小队对讲耳机', 'pair|group|touring', '成熟蓝牙生态', '固定小队和长途'],
  ['intercom-cn', 'SENA', '20S EVO', '小队对讲耳机', 'pair|group|touring', '成熟蓝牙生态', '公路摩旅与小队'],
  ['intercom-cn', 'SENA', '10C Pro', '摄像一体头盔耳机', 'solo|pair|touring', '科技旅行', '记录骑行与双人对讲'],
  ['intercom-cn', 'SENA', '3S Plus', '超薄头盔耳机', 'solo|pair|city', '轻量实用', '耳槽紧、需要薄扬声器的通勤用户'],
  ['intercom-cn', 'SENA', '5R', '双人/小队对讲耳机', 'pair|city|touring', '轻量实用', '固定搭档和导航'],
  ['intercom-cn', 'SENA', 'SF4', '小队对讲耳机', 'group|touring', '实用旅行', '3—4人小队'],
  ['intercom-cn', 'SENA', 'SMH5', '基础双人对讲耳机', 'pair|city', '基础实用', '双人通话和导航'],
  ['intercom-cn', 'SENA', 'MeshPort Blue', '头盔外网状通讯模块', 'group|touring', '网状通讯', '与SENA mesh生态协作'],
  ['intercom-cn', 'Cardo', 'PACKTALK PRO', '高端网状对讲耳机', 'group|touring', '科技旅行', '多人车队和音频优先'],
  ['intercom-cn', 'Cardo', 'PACKTALK CUSTOM', '可升级网状对讲耳机', 'group|touring', '模块化科技', '车队与按需功能'],
  ['intercom-cn', 'Cardo', 'PACKTALK BOLD JBL', '网状对讲耳机', 'group|touring', '科技旅行', '多人车队和音频需求'],
  ['intercom-cn', 'Cardo', 'FREECOM 1X', '双人/单人头盔耳机', 'solo|pair|city', '基础实用', '导航、电话和固定搭档'],
  ['intercom-cn', '维迈通', 'V8S', '小队对讲耳机', 'pair|group|touring', '国产实用', '固定小队与摩旅'],
  ['intercom-cn', '维迈通', 'V6S', '双人/小队对讲耳机', 'pair|group|city', '国产实用', '预算车队通讯'],
  ['intercom-cn', '维迈通', 'V9X', '小队对讲耳机', 'group|touring', '国产科技', '多人摩旅'],
  ['intercom-cn', '维迈通', 'V10S', '小队对讲耳机', 'group|touring', '国产科技', '车队通讯'],
  ['intercom-cn', '外星蜗牛', 'ET001', '头盔耳机', 'solo|pair|city', '国产科技', '导航和双人通讯'],
  ['intercom-cn', '外星蜗牛', 'ET005', '头盔耳机', 'pair|group|touring', '国产科技', '小队摩旅'],
  ['intercom-cn', '爱骑仕', 'Q9', '头盔耳机', 'solo|pair|city', '国产实用', '导航、电话和通勤'],
  ['intercom-cn', '爱骑仕', 'V8S', '头盔耳机', 'pair|group|touring', '国产实用', '双人和小队'],
  ['intercom-cn', '爱骑仕', 'MS8', '网状对讲耳机', 'group|touring', '国产科技', '多人车队通讯'],
  ['intercom-cn', '爱骑仕', 'V4 Plus', '双人/小队对讲耳机', 'pair|group|city', '国产实用', '预算双人和小队通讯'],
  ['intercom-cn', 'FODSPORTS', 'M1-S Pro', '头盔耳机', 'pair|group|touring', '国产实用', '双人和小队对讲'],
  ['intercom-cn', 'FODSPORTS', 'FX8 Air', '头盔耳机', 'pair|group|touring', '国产实用', '摩旅通讯'],
  ['intercom-cn', 'FODSPORTS', 'M1-S Air', '头盔耳机', 'pair|group|touring', '国产实用', '双人和小队对讲'],
  ['intercom-cn', 'FODSPORTS', 'M1-S Plus', '头盔耳机', 'pair|group|touring', '国产实用', '双人和小队'],
  ['intercom-cn', 'LEXIN', 'G16', '头盔耳机', 'pair|group|touring', '国产实用', '车队和长途'],
  ['intercom-cn', 'LEXIN', 'B4FM', '头盔耳机', 'pair|group|city', '国产实用', '小队和通勤'],
  ['intercom-cn', 'FreedConn', 'T-COM VB', '头盔耳机', 'pair|city', '基础实用', '双人通勤'],
  ['intercom-cn', 'FreedConn', 'KY Pro', '头盔耳机', 'pair|group|touring', '基础实用', '小队通讯']
];

const THEFT = [
  ['theft-cn', 'ABUS', 'GRANIT Detecto XPlus 8077', '报警碟刹锁', 'security|city|touring', '德系高防护', '临停时增加机械阻碍和报警'],
  ['theft-cn', 'ABUS', 'GRANIT Detecto XPlus 8008', '报警碟刹锁', 'security|city|touring', '德系高防护', '临停时增加机械阻碍和报警'],
  ['theft-cn', 'ABUS', 'GRANIT 37/60', 'U锁', 'security|city|touring', '德系高防护', '能连接固定物的停车位'],
  ['theft-cn', 'ABUS', 'GRANIT CityChain 1010', '链条锁', 'security|city|touring', '德系高防护', '固定物和较长停放'],
  ['theft-cn', 'ABUS', 'WBA 100', '地锁固定锚', 'security', '德系固定防护', '私人车位或车库'],
  ['theft-cn', 'XENA', 'XX14', '报警碟刹锁', 'security|city|touring', '英式机械报警', '临停与便携防盗'],
  ['theft-cn', 'XENA', 'XX15', '报警碟刹锁', 'security|city|touring', '英式机械报警', '较高价值车辆临停'],
  ['theft-cn', 'XENA', 'XZZ6L', '报警碟刹锁', 'security|city', '英式机械报警', '城市短停'],
  ['theft-cn', 'KOVIX', 'KD6', '报警碟刹锁', 'security|city|touring', '机械报警', '便携临停'],
  ['theft-cn', 'KOVIX', 'KBL12', '报警碟刹锁', 'security|city|touring', '机械报警', '临停和旅行'],
  ['theft-cn', 'KOVIX', 'KAL14', '报警碟刹锁', 'security|city', '机械报警', '城市短停'],
  ['theft-cn', 'Oxford', 'Boss Alarm', '报警碟刹锁', 'security|city|touring', '英式实用防护', '临停和旅行'],
  ['theft-cn', 'Oxford', 'Monster Chain', '重链条锁', 'security', '英式实用防护', '固定物和长停'],
  ['theft-cn', 'Oxford', 'Beast Lock', '重型U锁', 'security', '英式实用防护', '固定物和车库'],
  ['theft-cn', 'Litelok', 'X1 Moto', '高安全U锁', 'security|city', '高防护', '可固定停车位'],
  ['theft-cn', 'Hiplok', 'D1000', '高安全U锁', 'security|city', '高防护', '城市固定物停车'],
  ['theft-cn', 'Apple', 'AirTag', '定位标签', 'security|city|touring', '隐蔽定位', '辅助找回，不能替代机械阻碍'],
  ['theft-cn', 'Invoxia', 'GPS Tracker Pro', 'GPS定位器', 'security|city|touring', '隐蔽定位', '辅助找回和异动提醒'],
  ['theft-cn', '通用方案', '重链 + 固定锚 + 报警碟刹锁', '组合防盗方案', 'security', '分层防护', '长期停车和高价值车辆'],
  ['theft-cn', '通用方案', 'U锁 + 报警碟刹锁 + 双定位', '组合防盗方案', 'security|city', '分层防护', '无固定物的城市停车'],
  ['theft-cn', '通用方案', '车罩 + 机械锁 + 停车环境管理', '停车管理方案', 'security|city|touring', '分层防护', '降低被盯上概率，不替代锁具']
];

// 历史型号和地区/存量资料只用于目录浏览，不能与当前型号并列成默认推荐。
const LEGACY_DIRECTORY_KEYS = new Set([
  'helmet|AGV|K5 S',
  'helmet|AGV|PISTA GP R',
  'helmet|AGV|SPORTMODULAR',
  'helmet|AGV|ORBYT',
  'helmet|HJC|DS-X1',
  'helmet|HJC|i70',
  'helmet|SCHUBERTH|C4 PRO',
  'helmet|SCHUBERTH|E1',
  'helmet|SCHUBERTH|M1 PRO',
  'helmet|SCHUBERTH|S2 SPORT',
  'helmet|LS2|FF325 Strobe',
  'helmet|SHOEI|J-CRUISE 2'
]);

// 这份清单是“待补逐型号 SKU 证据”的候选池，不会仅凭店铺/类目页参与自动推荐。
// 只有在相应 SOURCE 中补入 exactModelKeys 后，才会自动提升为来源可核验候选。
const CURATED_DIRECTORY_KEYS = new Set([
  'helmet|HJC|RPHA 91',
  'helmet|HJC|RPHA 71',
  'helmet|HJC|i80',
  'helmet|HJC|V10',
  'helmet|HJC|V31',
  'helmet|SHOEI|NEOTEC 3',
  'helmet|SHOEI|GLAMSTER',
  'helmet|SHOEI|HORNET ADV',
  'helmet|AGV|AX9',
  'helmet|AGV|TOURMODULAR',
  'helmet|SCHUBERTH|C5',
  'helmet|SCHUBERTH|E2',
  'helmet|SCHUBERTH|S3',
  'helmet|LS2|FF901 Advant X',
  'helmet|LS2|FF906 Advant',
  'helmet|LS2|MX701 Explorer',
  'helmet|LS2|MX700 Subverter EVO II',
  'armor|DAINESE|Laguna Seca 5 2PCS',
  'armor|DAINESE|Laguna Seca 6 1PC',
  'armor|Alpinestars|Bionic Action V2 Protection Jacket',
  'armor|RS TAICHI|RSJ356 LITE AIR JACKET',
  'armor|RS TAICHI|RSJ354 AIR PARKA',
  'armor|RS TAICHI|RSJ342 QUICK DRY RACER JACKET',
  'armor|RS TAICHI|RSY258 QUICK DRY CARGO PANTS',
  'armor|RS TAICHI|RSY273 CORDURA LITE AIR PANTS',
  'boots|RS TAICHI|RSS010 DRYMASTER COMBAT SHOES',
  'boots|RS TAICHI|RSS011 DRYMASTER-FIT HOOP SHOES',
  'boots|RS TAICHI|RSS012 HOOP AIR SHOES',
  'boots|RS TAICHI|RSS014 DRYMASTER BREAK SHOES',
  'boots|RS TAICHI|RSS016 DRYMASTER STRIKER SHOES'
]);

export const DIRECTORY_PRODUCT_CATALOG = Object.freeze([
  ...expand('helmet', HELMETS),
  ...expand('armor', ARMOR),
  ...expand('gloves', GLOVES),
  ...expand('boots', BOOTS),
  ...expand('luggage', LUGGAGE),
  ...expand('lights', LIGHTS),
  ...expand('intercom', INTERCOM),
  ...expand('theft', THEFT)
]);

export const DIRECTORY_SOURCES = SOURCE;
