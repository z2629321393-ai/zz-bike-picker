import { TYPE_LABELS, budgetLabel, labelFor } from './config.js';

const TYPE_KEYS = Object.keys(TYPE_LABELS);
const CURRENT_YEAR = new Date().getFullYear();

const TYPE_SCORE_RULES = {
  usage: {
    commute: { scooter: 9, street: 5, retro: 2 },
    fun: { street: 5, sport: 5, retro: 3, cruiser: 3 },
    travel: { adv: 10, scooter: 3, street: 2 },
    status: { cruiser: 7, sport: 5, retro: 4, adv: 2 },
    track: { sport: 10, street: 4, offroad: 1 },
    collect: { collector: 12, retro: 4, cruiser: 3 }
  },
  personality: {
    practical: { scooter: 6, street: 4, retro: 1 },
    stable: { adv: 4, scooter: 4, street: 4 },
    show: { cruiser: 6, sport: 5, retro: 5 },
    aggressive: { sport: 8, street: 4, offroad: 3 },
    freedom: { adv: 8, offroad: 5, street: 1 },
    minimal: { scooter: 4, street: 4, retro: 2 }
  },
  experience: {
    new: { scooter: 5, street: 4, retro: 2, sport: -3, offroad: -4, adv: -2 },
    beginner: { scooter: 3, street: 3, retro: 2, sport: -1, offroad: -2 },
    intermediate: { street: 3, sport: 2, adv: 3, cruiser: 2 },
    advanced: { sport: 4, adv: 4, offroad: 4, cruiser: 2, collector: 1 }
  },
  maintenance: {
    low: { scooter: 6, street: 3, collector: -6, offroad: -3, sport: -2 },
    mid: { street: 3, adv: 2, retro: 2 },
    high: { sport: 4, adv: 4, offroad: 4, cruiser: 2 },
    whatever: { sport: 4, cruiser: 5, collector: 4 }
  },
  ownership: {
    low: { scooter: 7, street: 3, collector: -5, cruiser: -2, sport: -2 },
    mid: { street: 4, retro: 2, adv: 2 },
    high: { adv: 4, sport: 4, cruiser: 4 },
    notcare: { cruiser: 6, sport: 5, collector: 4 }
  },
  looks: {
    low: { scooter: 4, street: 3 },
    mid: { street: 4, adv: 2, retro: 2 },
    high: { sport: 5, cruiser: 5, retro: 4 },
    unique: { cruiser: 7, collector: 5, retro: 4 }
  },
  mod: {
    none: { scooter: 4, street: 3, retro: 1 },
    light: { adv: 3, scooter: 2, cruiser: 2 },
    medium: { street: 3, sport: 4, adv: 3 },
    heavy: { sport: 5, cruiser: 5, collector: 3 }
  },
  power: {
    low: { scooter: 6, retro: 3, street: 2 },
    mid: { street: 6, adv: 3, cruiser: 3 },
    high: { sport: 7, street: 4, adv: 3 },
    extreme: { sport: 10, cruiser: 4, street: 1 }
  },
  road: {
    city: { scooter: 6, street: 4, retro: 3 },
    mixed: { adv: 5, street: 4, scooter: 1 },
    bad: { adv: 7, offroad: 8, street: -1, sport: -2 },
    mountain: { sport: 6, street: 6, offroad: 2 }
  },
  load: {
    solo: { sport: 2, street: 2, retro: 1 },
    passenger: { adv: 4, scooter: 4, cruiser: 3, sport: -2 },
    luggage: { adv: 7, scooter: 3, sport: -3 },
    both: { adv: 9, scooter: 3, cruiser: 2, sport: -5 }
  },
  commuteDistance: {
    short: { scooter: 5, street: 3, retro: 3 },
    medium: { scooter: 4, street: 4, adv: 2 },
    long: { adv: 5, scooter: 4, street: 2, sport: -2 },
    weekend: { sport: 3, cruiser: 3, retro: 3, street: 2 }
  },
  parking: {
    indoor: { collector: 2, cruiser: 1, sport: 1 },
    monitored: { street: 1, scooter: 1 },
    outdoor: { scooter: 2, street: 1, collector: -4, cruiser: -2, sport: -2 },
    uncertain: { scooter: 3, street: 1, collector: -5, cruiser: -3, sport: -3 }
  },
  age: {
    new: { scooter: 1, street: 1, sport: 1, adv: 1, cruiser: 1 },
    young: { street: 2, adv: 2, sport: 2, retro: 1 },
    old: { collector: 4, retro: 3, cruiser: 2 },
    collector: { collector: 15, retro: 4, cruiser: 3 }
  }
};

export function calculateTypeScores(answers) {
  const scores = Object.fromEntries(TYPE_KEYS.map((key) => [key, 0]));

  for (const [field, options] of Object.entries(TYPE_SCORE_RULES)) {
    applyScoreMap(scores, options[answers[field]]);
  }

  const h = Number(answers.height || 0);
  const w = Number(answers.weight || 0);

  if (h >= 180) applyScoreMap(scores, { adv: 3, cruiser: 2, street: 1, scooter: -1, retro: -1 });
  if (h >= 188) applyScoreMap(scores, { adv: 5, cruiser: 4, scooter: -3, retro: -3 });
  if (h <= 165) applyScoreMap(scores, { scooter: 4, cruiser: 2, adv: -4, offroad: -6 });
  if (w >= 90) applyScoreMap(scores, { adv: 2, cruiser: 2, street: 1 });

  for (const item of answers.avoid || []) {
    const avoidMap = {
      repair: { scooter: 4, street: 3, collector: -7, offroad: -2 },
      hot: { scooter: 3, sport: -3, cruiser: -2 },
      heavy: { scooter: 3, sport: 1, adv: -3, cruiser: -3 },
      short: { adv: 4, cruiser: 4, scooter: -4, retro: -3 },
      expensive: { scooter: 4, street: 3, sport: -3, collector: -3 },
      boring: { sport: 4, cruiser: 4, retro: 3, scooter: -3 }
    }[item];
    applyScoreMap(scores, avoidMap);
  }

  for (const key of TYPE_KEYS) scores[key] = Math.max(0, Math.round(scores[key]));
  return scores;
}

export function normalizeVehicle(vehicle, index = 0) {
  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(vehicle, key);
  const sourceText = `${vehicle.brand || ''} ${vehicle.model || vehicle.name || ''} ${vehicle.category || ''}`;
  const type = TYPE_LABELS[vehicle.type] ? vehicle.type : guessType(sourceText);
  const budget = normalizeBudget(vehicle);
  const year = asNumber(vehicle.year || vehicle.release_year || vehicle.first_release_year);
  const seat = asNumber(vehicle.seat || vehicle.seat_height);
  const weight = asNumber(vehicle.weight || vehicle.curb_weight || vehicle.ready_weight);
  const source = vehicle.source || (vehicle.source_url ? 'public_page' : 'sample');
  const dataQuality = vehicle.dataQuality || inferDataQuality(vehicle, source);
  const cost = hasOwn('cost') ? vehicle.cost : inferCost(budget);
  const maint = hasOwn('maint') ? vehicle.maint : inferMaintenance(type, budget);
  const power = hasOwn('power') ? vehicle.power : inferPower(type, budget, vehicle.displacement);
  const model = vehicle.model || vehicle.name || `车型${index + 1}`;

  return {
    id: String(vehicle.id || vehicle.source_id || `${slug(vehicle.brand)}-${slug(vehicle.model || vehicle.name)}-${index}`),
    brand: vehicle.brand || '待识别品牌',
    model,
    type,
    budget,
    seat,
    weight,
    year,
    displacement: asNumber(vehicle.displacement),
    status: vehicle.status || '公开数据待校准',
    source,
    sourceUrl: vehicle.source_url || vehicle.sourceUrl || '',
    updatedAt: vehicle.updated_at || vehicle.fetched_at || '',
    dataQuality,
    cost,
    maint,
    looks: hasOwn('looks') ? vehicle.looks : inferLooks(type),
    power,
    tags: Array.isArray(vehicle.tags) ? vehicle.tags.slice(0, 5) : [],
    why: vehicle.why || `符合${TYPE_LABELS[type].short}方向，建议结合当地价格和实车试坐继续筛选。`,
    warn: vehicle.warn || '公开数据只做初筛，价格、在售状态、座高和整备质量必须再次核验。',
    usedMinPrice: asNumber(vehicle.used_min_price),
    abs: normalizeBoolean(vehicle.abs),
    tcs: normalizeBoolean(vehicle.tcs),
    beginnerFriendly: hasOwn('beginnerFriendly')
      ? vehicle.beginnerFriendly
      : (dataQuality === 'sample' ? inferBeginnerFriendly(type, budget, weight, power, vehicle.displacement) : null),
    parkingRisk: vehicle.parkingRisk || inferParkingRisk(budget, type),
    bodyScale: vehicle.bodyScale || inferBodyScale(type, weight, seat),
    aggregateModel: vehicle.aggregateModel ?? /\s(?:\/|、)\s|\//.test(model),
    recommendable: hasOwn('recommendable') ? vehicle.recommendable === true : null
  };
}

export function mergeAndNormalizeVehicles(...lists) {
  const all = lists.flat().filter(Boolean).map((item, index) => normalizeVehicle(item, index));
  const map = new Map();

  for (const vehicle of all) {
    const key = `${normalizeName(vehicle.brand)}|${normalizeName(vehicle.model)}`;
    const current = map.get(key);
    if (!current || qualityRank(vehicle.dataQuality) > qualityRank(current.dataQuality)) map.set(key, vehicle);
  }

  return [...map.values()];
}

export function rankVehicles(vehicles, answers, typeScores, limit = 4) {
  const sortedTypes = Object.entries(typeScores).sort((a, b) => b[1] - a[1]);
  const primary = sortedTypes[0]?.[0] || 'street';
  const secondary = sortedTypes[1]?.[0] || primary;

  const allScored = vehicles
    .map((vehicle) => scoreVehicleDetailed(vehicle, answers, typeScores, primary, secondary))
    .sort((a, b) => b.score - a.score);
  const scored = allScored.filter((item) => item.score >= 38 && item.hardBlocks.length === 0);

  const selected = [];
  const brandCount = new Map();
  const typeCount = new Map();

  for (const item of scored) {
    const sameBrand = brandCount.get(item.vehicle.brand) || 0;
    const sameType = typeCount.get(item.vehicle.type) || 0;
    if (sameBrand >= 2 || sameType >= 3) continue;
    selected.push(item);
    brandCount.set(item.vehicle.brand, sameBrand + 1);
    typeCount.set(item.vehicle.type, sameType + 1);
    if (selected.length >= limit) break;
  }

  return {
    primary,
    secondary,
    sortedTypes,
    recommendations: selected,
    allScored,
    excluded: allScored.filter((item) => item.hardBlocks.length > 0)
  };
}

export function scoreVehicleDetailed(vehicle, answers, typeScores, primary, secondary) {
  let score = 0;
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];

  if (vehicle.recommendable !== true) {
    hardBlocks.push('车型尚未通过推荐资格审核');
  }

  const typeAffinity = Number(typeScores[vehicle.type] || 0);
  score += Math.min(32, typeAffinity * 1.8);
  if (vehicle.type === primary) {
    score += 35;
    reasons.push(`与你的主方向“${TYPE_LABELS[primary].short}”一致`);
  } else if (vehicle.type === secondary) {
    score += 18;
    reasons.push(`符合你的第二倾向“${TYPE_LABELS[secondary].short}”`);
  }

  const budgetResult = scoreBudget(vehicle, answers);
  score += budgetResult.delta;
  reasons.push(...budgetResult.reasons);
  warnings.push(...budgetResult.warnings);
  hardBlocks.push(...budgetResult.hardBlocks);

  const bodyResult = scoreBodyFit(vehicle, answers);
  score += bodyResult.delta;
  reasons.push(...bodyResult.reasons);
  warnings.push(...bodyResult.warnings);
  hardBlocks.push(...bodyResult.hardBlocks);

  const experienceResult = scoreExperience(vehicle, answers);
  score += experienceResult.delta;
  reasons.push(...experienceResult.reasons);
  warnings.push(...experienceResult.warnings);
  hardBlocks.push(...experienceResult.hardBlocks);

  const usageResult = scoreUsageDetails(vehicle, answers);
  score += usageResult.delta;
  reasons.push(...usageResult.reasons);
  warnings.push(...usageResult.warnings);
  hardBlocks.push(...usageResult.hardBlocks);

  const ownershipResult = scoreOwnership(vehicle, answers);
  score += ownershipResult.delta;
  reasons.push(...ownershipResult.reasons);
  warnings.push(...ownershipResult.warnings);

  const ageResult = scoreAge(vehicle, answers);
  score += ageResult.delta;
  reasons.push(...ageResult.reasons);
  warnings.push(...ageResult.warnings);
  hardBlocks.push(...ageResult.hardBlocks);

  const avoidResult = scoreAvoid(vehicle, answers);
  score += avoidResult.delta;
  reasons.push(...avoidResult.reasons);
  warnings.push(...avoidResult.warnings);
  hardBlocks.push(...avoidResult.hardBlocks);

  if (vehicle.aggregateModel) {
    warnings.push('当前记录聚合了多个车型版本，参数只能作为方向参考');
  }

  const confidence = calculateDataConfidence(vehicle);
  if (confidence < 55) warnings.push('车型数据仍需校准，结果只作为试坐方向');

  return {
    vehicle,
    score: Math.max(0, Math.min(100, Math.round(score))),
    confidence,
    reasons: unique(reasons).slice(0, 4),
    warnings: unique(warnings).slice(0, 4),
    hardBlocks: unique(hardBlocks)
  };
}

export function analyzeConflicts(answers, primary) {
  const list = [];
  if (answers.budget <= 25000 && ['high', 'extreme'].includes(answers.power)) {
    list.push('预算偏紧，但动力需求偏高。车价能压下来，轮胎、刹车、车况和后期成本压不下来。');
  }
  if (answers.maintenance === 'low' && ['sport', 'offroad', 'collector'].includes(primary)) {
    list.push('你不想花精力维护，但结果偏性能或硬核。要么降低车型强度，要么提高维护意愿。');
  }
  if (answers.ownership === 'low' && ['sport', 'cruiser', 'adv', 'collector'].includes(primary)) {
    list.push('你要求低持有成本，但目标车型通常更重、更费耗材或折旧更明显。');
  }
  if (answers.height <= 165 && ['adv', 'offroad'].includes(primary)) {
    list.push('身高与高座车型存在硬冲突。必须实车确认单脚支撑、掉头和倒车挪车。');
  }
  if (answers.height >= 188 && ['scooter', 'retro'].includes(primary)) {
    list.push('你身高较高，小踏板和迷你复古可能实用，但视觉比例容易显小。');
  }
  if (answers.usage === 'commute' && answers.power === 'extreme') {
    list.push('核心用途是通勤，却选择极端动力。日常热量、油耗、轮胎和低速体验可能反过来消耗你。');
  }
  if (answers.load === 'both' && primary === 'sport') {
    list.push('经常带人带行李与仿赛姿态冲突。后座、装载和重心会明显妥协。');
  }
  if (answers.age === 'collector' && answers.maintenance === 'low') {
    list.push('收藏老车却不愿维护，冲突很大。老车真正贵的是时间、配件和维修渠道。');
  }
  if (answers.parking === 'outdoor' && ['status', 'collect'].includes(answers.usage)) {
    list.push('你想买高存在感或收藏向车型，但停车环境偏开放。盗抢、风吹日晒和剐蹭风险会放大。');
  }
  if (answers.experience === 'new' && answers.power === 'extreme') {
    list.push('完全新手却选择极端动力。不是绝对不能买，而是容错率与学习成本严重不匹配。');
  }
  return list;
}

export function buildAvoidAdvice(answers, primary) {
  const list = [];
  if (answers.height <= 165) list.push('高座拉力和重心偏高的大ADV：先别被外观带走，低速失误成本高。');
  if (answers.height >= 188) list.push('迷你复古、小踏板和小轮径玩乐车：除非你明确接受“骑上去显小”。');
  if (answers.ownership === 'low') list.push('进口大排、冷门小众和高价覆盖件仿赛：摔一次、等一次件，成本都不低。');
  if (answers.maintenance === 'low') list.push('高压榨性能车、老车和重改车：它们需要持续维护，不是买完就结束。');
  if (answers.usage === 'commute') list.push('纯赛道化坐姿、极端排气和过重巡航：每天骑时，缺点会被放大。');
  if (answers.parking === 'outdoor' || answers.parking === 'uncertain') list.push('价格高、外观扎眼、零件易拆的车型：停车环境会把盗抢和剐蹭焦虑放大。');
  if (answers.age !== 'collector') list.push('手续不清、来源不明的水车或报废车：不进入日常上路推荐范围。');
  if (primary === 'collector') list.unshift('没有合法手续、没有配件渠道、没有维修师傅的“便宜情怀车”。');
  return unique(list).slice(0, 5);
}

export function calculateClarity(sortedTypes, conflicts, recommendationCount) {
  const top = sortedTypes[0]?.[1] || 0;
  const second = sortedTypes[1]?.[1] || 0;
  const gap = Math.max(0, top - second);
  const dataPenalty = recommendationCount === 0 ? 12 : recommendationCount < 3 ? 5 : 0;
  return Math.max(52, Math.min(96, Math.round(68 + gap * 2.2 - conflicts.length * 4 - dataPenalty)));
}

export function buildDecisionProfile(answers, primary, secondary) {
  const mustHave = [];
  const tradeoffs = [];
  const redFlags = [];

  if (answers.usage === 'commute') mustHave.push('低速好控、停车方便、售后稳定');
  if (answers.usage === 'travel') mustHave.push('坐姿、续航、装载和风阻控制');
  if (answers.usage === 'track') mustHave.push('制动、轮胎、车架反馈和护具预算');
  if (answers.load === 'both') mustHave.push('后座承托、后避震和满载制动余量');
  if (answers.parking !== 'indoor') mustHave.push('防盗方案与低调停放能力');
  if (answers.experience === 'new') mustHave.push('ABS优先、车重可控、动力输出线性');

  if (answers.looks === 'high' || answers.looks === 'unique') tradeoffs.push('外观越极端，实用性和摔车件成本越可能妥协');
  if (answers.mod === 'heavy') tradeoffs.push('重度改装会增加匹配、合法性、可靠性和转手难度');
  if (answers.power === 'extreme') tradeoffs.push('动力越暴躁，轮胎、刹车、油耗和犯错成本越高');
  if (primary === 'adv') tradeoffs.push('通过性和装载换来更高座高、更大体量和更重低速负担');
  if (primary === 'cruiser') tradeoffs.push('姿态和气场换来转弯半径、车重和低速灵活性的损失');

  if (answers.age === 'old' || answers.age === 'collector') redFlags.push('登记日期、手续、维修渠道、配件供应和剩余使用年限');
  if (answers.parking === 'outdoor' || answers.parking === 'uncertain') redFlags.push('露天停放、盗抢、日晒雨淋和小剐蹭');
  if (answers.maintenance === 'low') redFlags.push('冷门品牌、压榨性能平台和重改二手车');
  if (answers.ownership === 'low') redFlags.push('高价覆盖件、进口零件和高折旧车型');

  return {
    headline: `${TYPE_LABELS[primary].name}，第二倾向是${TYPE_LABELS[secondary].short}`,
    mustHave: unique(mustHave).slice(0, 4),
    tradeoffs: unique(tradeoffs).slice(0, 4),
    redFlags: unique(redFlags).slice(0, 4)
  };
}

export function buildCopyText({ answers, primary, secondary, recommendations, conflicts }) {
  const lines = [
    '【骑不快的ZZ｜性格选车访谈】',
    `我的结果：${TYPE_LABELS[primary].name}`,
    `第二倾向：${TYPE_LABELS[secondary].short}`,
    `核心用途：${labelFor('usage', answers.usage)}`,
    `预算：${budgetLabel(answers.budget)}｜身高体重：${answers.height}cm / ${answers.weight}kg`,
    `经验：${labelFor('experience', answers.experience)}｜停车：${labelFor('parking', answers.parking)}`,
    '',
    `ZZ判断：${TYPE_LABELS[primary].desc}`,
    '',
    '优先试坐：'
  ];

  if (recommendations.length) {
    recommendations.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.vehicle.brand} ${item.vehicle.model}｜${item.reasons[0] || item.vehicle.why}`);
    });
  } else {
    lines.push('当前车型库里没有足够可靠的精确匹配，先按车型方向试坐，不要直接下单。');
  }

  lines.push('', '现实提醒：');
  if (conflicts.length) conflicts.slice(0, 2).forEach((text) => lines.push(`- ${text}`));
  else lines.push('- 你的主要答案没有明显打架，下一步重点是试坐、当地落地价和售后。');

  lines.push('', '别只问别人哪台车最好。先问自己买回来到底是通勤、撑场面、摩旅、收藏，还是单纯想爽。用途不清楚，越贵越容易后悔。');
  return lines.join('\n');
}

export function formatPrice(range) {
  const [min, max] = Array.isArray(range) ? range : [0, 0];
  if (!min && !max) return '价格待校准';
  if (max >= 999999) return `${formatWan(min)}起`;
  if (min === max) return formatWan(min);
  return `${formatWan(min)}—${formatWan(max)}`;
}

export function dataQualityLabel(value) {
  return ({
    sample: '示例库',
    public: '公开页',
    partial: '部分校准',
    verified: '双核通过'
  })[value] || '待校准';
}

function scoreBudget(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;
  const [min, max] = vehicle.budget;
  const totalBudget = Number(answers.budget || 0);
  const vehicleBudget = Math.max(0, totalBudget * 0.86);

  if (!min) {
    warnings.push('缺少可靠价格数据');
    delta -= 5;
    return { delta, reasons, warnings, hardBlocks };
  }

  if (min <= vehicleBudget && (!max || max >= vehicleBudget * 0.55)) {
    delta += 20;
    reasons.push('价格落在你的可承受区间');
  } else if (min <= totalBudget) {
    delta += 8;
    warnings.push('裸车可能够，但装备和落地费用会挤压预算');
  } else if (min <= totalBudget * 1.18) {
    delta -= 12;
    warnings.push('预算需要上探，容易出现贷款或压缩护具预算');
  } else {
    delta -= 35;
    hardBlocks.push('最低参考价明显超过总预算');
  }

  return { delta, reasons, warnings, hardBlocks };
}

function heavyAvoidWeightLimit(answers) {
  const height = Number(answers.height || 0);
  const bodyWeight = Number(answers.weight || 0);

  if (answers.experience === 'new' || height <= 165) return 180;
  if (height >= 188 && bodyWeight >= 85) return 210;
  return 195;
}

function scoreBodyFit(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;
  const h = Number(answers.height || 0);
  const w = Number(answers.weight || 0);

  if (!vehicle.seat && !vehicle.weight) {
    warnings.push('座高和整备质量待校准');
    delta -= 2;
    return { delta, reasons, warnings, hardBlocks };
  }

  if (vehicle.seat) {
    if (h <= 160 && vehicle.seat >= 810) {
      delta -= 28;
      hardBlocks.push('座高对当前身高过于激进');
    } else if (h <= 165 && answers.experience === 'new' && vehicle.seat > 800 && ['adv', 'offroad'].includes(vehicle.type)) {
      delta -= 24;
      hardBlocks.push('新手身高与高座车型低速容错冲突');
    } else if (h <= 165 && vehicle.seat >= 835) {
      delta -= 24;
      hardBlocks.push('座高对当前身高过于激进');
    } else if (h <= 160 && vehicle.seat >= 795) {
      delta -= 18;
      warnings.push('座高接近当前身高的激进边界，必须实车确认撑地');
    } else if (h <= 165 && vehicle.seat > 800) {
      delta -= 18;
      warnings.push('必须实车确认撑地和低速掉头');
    } else if (h >= 188 && vehicle.seat < 760 && vehicle.type !== 'cruiser') {
      delta -= 12;
      warnings.push('骑姿和视觉比例可能偏局促');
    } else {
      delta += 6;
      reasons.push('座高与身高没有明显硬冲突');
    }
  }

  if (vehicle.weight) {
    const heavyLimit = heavyAvoidWeightLimit(answers);
    if (h <= 160 && w <= 60 && vehicle.weight > 200) {
      delta -= 26;
      hardBlocks.push('当前身高体重与整备质量的低速负担冲突');
    } else if (answers.avoid?.includes('heavy') && vehicle.weight > heavyLimit) {
      delta -= 24;
      hardBlocks.push(`整备质量超过你选择的重车舒适边界（${heavyLimit}kg）`);
    } else if (answers.experience === 'new' && vehicle.weight > 230) {
      delta -= 24;
      hardBlocks.push('新手不建议直接选择整备质量过高的车型');
    } else if (w >= 95 && vehicle.weight < 130) {
      delta -= 6;
      warnings.push('车架体量可能偏小');
    } else {
      delta += 4;
    }
  }

  return { delta, reasons, warnings, hardBlocks };
}

function scoreExperience(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;

  if (answers.experience === 'new') {
    if (vehicle.beginnerFriendly === true) {
      delta += 10;
      reasons.push('动力和车重对新手更友好');
    } else if (vehicle.beginnerFriendly === false) {
      delta -= 12;
      warnings.push('不属于高容错新手方向');
    } else {
      delta -= 4;
      warnings.push('新手友好度待核验');
    }
    if (vehicle.power === 'high') {
      delta -= 24;
      hardBlocks.push('完全新手不推荐高动力低容错车型');
    }
    if (vehicle.abs === false) {
      delta -= 20;
      hardBlocks.push('完全新手不推荐明确缺少ABS的车型');
    } else if (vehicle.abs === null) {
      warnings.push('ABS配置待核验，新手试车前必须确认');
    }
  }

  if (answers.experience === 'advanced' && ['sport', 'adv', 'offroad'].includes(vehicle.type)) {
    delta += 6;
    reasons.push('你的经验能覆盖更高的技术门槛');
  }

  return { delta, reasons, warnings, hardBlocks };
}

function scoreUsageDetails(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;

  if (answers.usage === 'commute') {
    if (vehicle.type === 'scooter') {
      delta += 12;
      reasons.push('通勤停车和日常装载更省事');
    }
    if (vehicle.weight > 220) {
      delta -= 8;
      warnings.push('每天挪车会放大车重缺点');
    }
  }

  if (answers.usage === 'travel') {
    if (vehicle.type === 'adv' || vehicle.type === 'scooter') {
      delta += 9;
      reasons.push('更符合长途坐姿和装载需求');
    }
    if (vehicle.type === 'sport') {
      delta -= 10;
      warnings.push('长途舒适和装载会明显妥协');
    }
  }

  if (answers.load === 'both' && vehicle.type === 'adv') {
    delta += 8;
    reasons.push('更适合带人和带行李');
  }

  if (answers.road === 'bad' && ['adv', 'offroad'].includes(vehicle.type)) {
    delta += 10;
    reasons.push('路况适配度更高');
  }

  if (answers.commuteDistance === 'long' && vehicle.type === 'sport') {
    delta -= 8;
    warnings.push('长距离日常骑行会放大坐姿和热量问题');
  }

  if (answers.parking === 'outdoor' || answers.parking === 'uncertain') {
    if (vehicle.parkingRisk === 'high') {
      delta -= 10;
      warnings.push('停车环境与车型价值/存在感不匹配');
      if (['status', 'collect'].includes(answers.usage)) {
        hardBlocks.push('露天或临时停车不适合高价值/高关注度车型');
      }
    }
  }

  return { delta, reasons, warnings, hardBlocks };
}

function scoreOwnership(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  let delta = 0;

  if (answers.maintenance === 'low' && vehicle.maint === 'low') {
    delta += 8;
    reasons.push('维护强度与你的意愿匹配');
  }
  if (answers.maintenance === 'low' && vehicle.maint === 'high') {
    delta -= 14;
    warnings.push('维护强度高于你的意愿');
  }
  if (answers.ownership === 'low' && vehicle.cost === 'low') {
    delta += 9;
    reasons.push('持有成本更接近你的要求');
  }
  if (answers.ownership === 'low' && vehicle.cost === 'high') {
    delta -= 16;
    warnings.push('油耗、耗材、折旧或摔车件成本偏高');
  }
  if (answers.looks === 'high' && ['high', 'unique'].includes(vehicle.looks)) delta += 6;
  if (answers.looks === 'unique' && vehicle.looks === 'unique') delta += 8;
  if (answers.power === 'high' && vehicle.power === 'high') delta += 8;
  if (answers.power === 'low' && vehicle.power === 'high') delta -= 8;

  return { delta, reasons, warnings };
}

function scoreAge(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;
  const age = vehicle.year ? CURRENT_YEAR - vehicle.year : null;
  const status = String(vehicle.status || '');
  const illegalRoadStatus = /水车|报废|无手续|手续不清|来源不明|不建议上路|不可上路|不上路|仅内容|拼装|盗抢/.test(status);

  if (illegalRoadStatus) {
    delta -= 60;
    hardBlocks.push('手续或上路状态不适合日常上路推荐');
  }

  if (answers.age === 'new' && /停产|停售|收藏/.test(status)) {
    delta -= 30;
    hardBlocks.push('你只看新车，但车型状态偏老或已停产');
  }

  if (answers.age === 'young' && age !== null && age > 5) {
    delta -= 16;
    warnings.push('车龄超过你选择的近5年范围');
  }

  if (answers.age !== 'collector' && age !== null && age >= 13) {
    delta -= 35;
    hardBlocks.push('按常见13年使用年限做保守筛选，车龄已不适合日常推荐');
  }

  if (answers.age === 'collector' && vehicle.type === 'collector') {
    delta += 24;
    reasons.push('符合收藏模式');
  }

  if (answers.age === 'old' && age !== null && age <= 12) {
    delta += 4;
    reasons.push('车龄仍处于保守可讨论范围');
  }

  if (!vehicle.year) warnings.push('缺少年款或首次发布信息');
  return { delta, reasons, warnings, hardBlocks };
}

function scoreAvoid(vehicle, answers) {
  const reasons = [];
  const warnings = [];
  const hardBlocks = [];
  let delta = 0;
  const avoid = new Set(answers.avoid || []);

  if (avoid.has('repair') && vehicle.maint === 'high') {
    delta -= 24;
    hardBlocks.push('与你不接受小毛病/高维护的一票否决项冲突');
  }
  if (avoid.has('heavy') && vehicle.weight > heavyAvoidWeightLimit(answers)) {
    delta -= 24;
    hardBlocks.push('车重超过你选择的一票否决边界');
  }
  const comfortText = `${vehicle.warn || ''} ${(vehicle.tags || []).join(' ')}`;
  if (avoid.has('hot') && (vehicle.type === 'sport' || /热|震|吵|手腕|腰|战斗坐姿|高转|排气/.test(comfortText))) {
    delta -= 20;
    hardBlocks.push('与你不接受热、累、震或吵的一票否决项冲突');
  }
  if (avoid.has('short') && vehicle.bodyScale === 'small') {
    delta -= 20;
    hardBlocks.push('车身体量与你不接受显小的一票否决项冲突');
  }
  if (avoid.has('expensive') && vehicle.cost === 'high') {
    delta -= 20;
    hardBlocks.push('摔车件和持有成本与你的一票否决项冲突');
  }
  if (avoid.has('boring') && vehicle.power === 'low' && vehicle.type === 'scooter') {
    delta -= 18;
    hardBlocks.push('低动力踏板与你不接受无聊的一票否决项冲突');
  }

  return { delta, reasons, warnings, hardBlocks };
}

function normalizeBudget(vehicle) {
  const raw = Array.isArray(vehicle.budget)
    ? vehicle.budget
    : [vehicle.price_min ?? vehicle.price ?? 0, vehicle.price_max ?? vehicle.price ?? 0];
  let min = asNumber(raw[0]) || 0;
  let max = asNumber(raw[1]) || min || 0;
  if (min > 0 && min < 500) min *= 10000;
  if (max > 0 && max < 500) max *= 10000;
  if (!max && min) max = min;
  if (max && min && max < min) [min, max] = [max, min];
  return [min, max];
}

function guessType(text) {
  const value = String(text || '').toLowerCase();
  if (/踏板|scooter|大踏板/.test(value)) return 'scooter';
  if (/adv|拉力|摩旅|探险|旅行拉力|\bds\b|\bmt\b|trk|\brx\b/.test(value)) return 'adv';
  if (/巡航|太子|cruiser|cl-c|金吉拉|闪\d|bobber|chopper/.test(value)) return 'cruiser';
  if (/仿赛|跑车|竞速|超跑|\brr\b|\bsr\b|\brc\b|ninja|zx|cbr|gsx-r/.test(value)) return 'sport';
  if (/复古|retro|幼狮|咖啡|scrambler|\bac\b/.test(value)) return 'retro';
  if (/越野|rally|enduro|cross|林道/.test(value)) return 'offroad';
  return 'street';
}

function inferCost([min, max]) {
  const price = max || min || 0;
  if (!price) return null;
  if (price && price <= 15000) return 'low';
  if (price && price <= 45000) return 'mid';
  return 'high';
}

function inferMaintenance(type, budget) {
  const cost = inferCost(budget);
  if (type === 'offroad' || type === 'collector') return 'high';
  if (type === 'sport' && cost === 'high') return 'high';
  if (cost === null) return null;
  if (cost === 'low') return 'low';
  return 'mid';
}

function inferLooks(type) {
  if (['sport', 'cruiser', 'retro'].includes(type)) return 'high';
  return 'mid';
}

function inferPower(type, budget, displacement) {
  const max = budget[1] || budget[0] || 0;
  if (Number(displacement || 0) >= 600 || max >= 60000) return 'high';
  if (type === 'sport' && max >= 25000) return 'high';
  if (max >= 20000) return 'mid';
  if (!max && !Number(displacement || 0)) return null;
  return 'low';
}

function inferBeginnerFriendly(type, budget, weight, power, displacement) {
  const max = budget[1] || budget[0] || 0;
  if (type === 'offroad' || type === 'collector') return false;
  if (power === 'high' || Number(displacement || 0) >= 500) return false;
  if (type === 'sport' && max > 45000) return false;
  if (weight && weight > 225) return false;
  if (!max && !weight && !Number(displacement || 0)) return null;
  return ['scooter', 'street', 'retro'].includes(type) || max <= 30000;
}

function inferParkingRisk(budget, type) {
  const max = budget[1] || budget[0] || 0;
  if (max >= 60000 || ['collector'].includes(type)) return 'high';
  if (max >= 30000 || ['sport', 'cruiser'].includes(type)) return 'mid';
  return 'low';
}

function inferBodyScale(type, weight, seat) {
  if (weight >= 215 || seat >= 820 || ['adv', 'cruiser'].includes(type)) return 'large';
  if ((weight && weight <= 145) || (seat && seat <= 750 && ['scooter', 'retro'].includes(type))) return 'small';
  return 'medium';
}

function inferDataQuality(vehicle, source) {
  const complete = [vehicle.price || vehicle.price_min || vehicle.budget, vehicle.seat || vehicle.seat_height, vehicle.weight || vehicle.curb_weight, vehicle.year].filter(Boolean).length;
  if (vehicle.verified === true || source === 'brand_official') return 'verified';
  if (source === 'sample') return 'sample';
  if (complete >= 3) return 'partial';
  if (source === 'public_page' || source === 'motofan_public_page') return 'public';
  return 'sample';
}

function calculateDataConfidence(vehicle) {
  let score = 25;
  if (vehicle.budget[0]) score += 20;
  if (vehicle.seat) score += 15;
  if (vehicle.weight) score += 15;
  if (vehicle.year) score += 10;
  if (vehicle.sourceUrl) score += 8;
  score += { sample: 0, public: 5, partial: 10, verified: 20 }[vehicle.dataQuality] || 0;
  const qualityCap = { sample: 55, public: 70, partial: 85, verified: 100 }[vehicle.dataQuality] || 55;
  const aggregateCap = vehicle.aggregateModel ? 45 : qualityCap;
  return Math.min(100, qualityCap, aggregateCap, score);
}

function qualityRank(value) {
  return ({ sample: 1, public: 2, partial: 3, verified: 4 })[value] || 0;
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  if (value === 1 || value === '1' || /有|标配|yes|true/i.test(String(value || ''))) return true;
  if (value === 0 || value === '0' || /无|no|false/i.test(String(value || ''))) return false;
  return null;
}

function asNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(number) ? number : null;
}

function applyScoreMap(target, map) {
  if (!map) return;
  for (const [key, value] of Object.entries(map)) target[key] = (target[key] || 0) + value;
}

function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[\s/·|_-]+/g, '');
}

function slug(value) {
  return normalizeName(value) || 'unknown';
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function formatWan(value) {
  const number = Number(value || 0);
  return number >= 10000 ? `${Math.round(number / 1000) / 10}万` : `${number}元`;
}
