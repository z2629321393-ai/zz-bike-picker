import {
  extractSpecSummary,
  extractTypeKeywords,
  limitPublicText,
  normalizeSpace,
  parseMoneyRange,
  sanitizeDetailUrl,
  sanitizeHttpsImageUrl
} from './pipeline-core.mjs';

const LEVELS = new Set(['low', 'mid', 'high', null]);
const VEHICLE_TYPES = new Set(['scooter', 'adv', 'cruiser', 'sport', 'street', 'retro', 'offroad', 'collector']);
const LOOKS_LEVELS = new Set(['low', 'mid', 'high', 'unique', null]);
const FORBIDDEN_KEYS = new Set([
  'detail_text', 'list_text', 'links', 'comments', 'comment_users',
  'dealer_text', 'brand_category_raw', 'contact', 'phone', 'email'
]);
const ALLOWED_VEHICLE_KEYS = new Set([
  'source', 'source_id', 'source_url', 'detail_url', 'image_url',
  'image_source_url', 'fetched_at', 'brand', 'model',
  'display_name', 'type', 'budget', 'price_text', 'seat', 'weight',
  'displacement', 'year', 'status', 'cost', 'maint', 'looks', 'power',
  'tags', 'why', 'warn', 'used_min_price', 'ranks', 'dataQuality',
  'review_status'
]);
const TEXT_LIMITS = {
  source: 40,
  source_id: 64,
  source_url: 500,
  detail_url: 500,
  image_url: 1000,
  image_source_url: 500,
  fetched_at: 40,
  brand: 80,
  model: 160,
  display_name: 180,
  type: 24,
  price_text: 160,
  status: 80,
  cost: 16,
  maint: 16,
  looks: 16,
  power: 16,
  why: 240,
  warn: 320,
  dataQuality: 24,
  review_status: 16
};

const clean = (value = '') => normalizeSpace(value);

export function splitBrandModel(name = '') {
  const value = clean(name).replace(/^\d{4}款\s*/, '').replace(/^全新车型\s*/, '');
  const parts = value.split(' ').filter(Boolean);
  if (parts.length >= 2) return { brand: parts[0], model: parts.slice(1).join(' ') };
  return { brand: '', model: value };
}

export function inferType(row = {}) {
  const text = [
    row.source,
    row.detail_title,
    row.list_name
  ].join(' ');
  if (/踏板|大踏板|复古踏板|通勤踏板/i.test(text)) return 'scooter';
  if (/拉力|ADV|探险|长途摩旅|旅行拉力|多功能/i.test(text)) return 'adv';
  if (/太子|巡航|美式|Bobber|Chopper|巡旅/i.test(text)) return 'cruiser';
  if (/跑车|仿赛|竞速|超跑|赛道|\bRR\b|\bSR\b|Ninja|CBR|GSX/i.test(text)) return 'sport';
  if (/复古|咖啡|Scrambler|攀爬/i.test(text)) return 'retro';
  if (/越野|林道|Rally|场地|非铺装/i.test(text)) return 'offroad';
  if (/街车|通勤跨骑|裸车/i.test(text)) return 'street';
  return null;
}

function validPrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function normalizeBudget(row = {}) {
  const parsedText = parseMoneyRange(row.detail_price_text || row.price_text || '');
  const directMin = validPrice(row.price_min);
  const directMax = validPrice(row.price_max);
  const parsedMin = validPrice(parsedText.price_min);
  const parsedMax = validPrice(parsedText.price_max);
  const min = directMin ?? parsedMin;
  const max = directMax ?? parsedMax;
  if (min === null && max === null) return null;
  const low = min ?? max;
  const high = max ?? min;
  return low <= high ? [low, high] : [high, low];
}

function tagsFor(type, row) {
  const base = {
    scooter: ['踏板', '通勤', '省心'],
    adv: ['ADV', '摩旅', '装载'],
    cruiser: ['巡航', '姿态', '回头率'],
    sport: ['仿赛', '运动', '操控'],
    street: ['街车', '均衡', '日常'],
    retro: ['复古', '情绪', '好拍'],
    offroad: ['越野', '烂路', '练技术']
  }[type] || [];
  const ranks = Array.isArray(row.ranks) ? row.ranks.slice(0, 1) : [];
  return [...base, ...ranks].map((tag) => limitPublicText(tag, 32)).slice(0, 4);
}

export function normalizeRow(row = {}) {
  const name = limitPublicText(row.detail_title || row.list_name || '', 180);
  const brandModel = splitBrandModel(name);
  const type = inferType(row);
  const budget = normalizeBudget(row);
  const cost = null;
  const detailText = [
    ...(Array.isArray(row.spec_fragments) ? row.spec_fragments : []),
    row.detail_text || ''
  ].join(' ');
  const specs = extractSpecSummary(detailText, row.specs || {});
  const year = Number(String(name).match(/(20\d{2})款/)?.[1] || 0) || null;
  const priceText = limitPublicText(row.detail_price_text || row.price_text || '', 160);
  const explicitNoPrice = /暂无报价|即将上市/.test(priceText);
  const detailUrl = sanitizeDetailUrl(row.detail_url) || sanitizeDetailUrl(row.url);
  const imageUrl = sanitizeHttpsImageUrl(row.image_url);
  const imageSourceUrl = imageUrl
    ? sanitizeDetailUrl(row.image_source_url) || detailUrl
    : '';

  return {
    source: 'motofan_public_page',
    source_id: limitPublicText(row.id, 64),
    source_url: detailUrl,
    detail_url: detailUrl,
    image_url: imageUrl,
    image_source_url: imageSourceUrl,
    fetched_at: limitPublicText(row.fetched_at, 40),
    brand: limitPublicText(brandModel.brand || row.brand || '', 80),
    model: limitPublicText(brandModel.model || row.detail_title || name, 160),
    display_name: name || limitPublicText(row.detail_title, 180),
    type,
    budget,
    price_text: priceText,
    seat: specs.seat_mm,
    weight: specs.weight_kg,
    displacement: specs.displacement_cc,
    year,
    status: budget === null
      ? (explicitNoPrice ? '即将上市/暂无报价' : '价格及在售状态待校准')
      : '公开报价待校准',
    cost,
    maint: null,
    looks: null,
    power: null,
    tags: tagsFor(type, row),
    why: budget === null
      ? '公开价格、车型类别、持有成本、维护强度、动力和规格均待人工校准。'
      : `公开指导价可参考${priceText || `${budget[0]}-${budget[1]} 元`}；车型类别、持有成本、维护强度、动力和规格仍待人工校准。`,
    warn: '公开页面价格不等于当地成交价；发布前必须人工核验在售状态、价格、座高、整备质量、售后和现车。',
    used_min_price: validPrice(row.used_min_price),
    ranks: Array.isArray(row.ranks) ? row.ranks.map((rank) => limitPublicText(rank, 32)).slice(0, 4) : [],
    dataQuality: specs.seat_mm && specs.weight_kg && year ? 'partial' : 'public',
    review_status: 'pending'
  };
}

export function normalizeRows(rows) {
  if (!Array.isArray(rows)) throw new TypeError('motofan_details.json 必须是 JSON 数组。');
  return rows.map(normalizeRow).filter((vehicle) => vehicle.model);
}

function findForbiddenKey(value, prefix = '') {
  if (!value || typeof value !== 'object') return null;
  for (const [key, child] of Object.entries(value)) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) return current;
    const nested = findForbiddenKey(child, current);
    if (nested) return nested;
  }
  return null;
}

function validateSourceUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:'
      && parsed.hostname === 'm.58moto.com'
      && !parsed.username
      && !parsed.password
      && /^\/garage\/detail\/\d+\/?$/.test(parsed.pathname)
      && !parsed.search
      && !parsed.hash;
  } catch {
    return false;
  }
}

export function validateReviewedVehicles(vehicles) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    throw new Error('审核候选必须是非空 JSON 数组。');
  }

  const seenIds = new Set();
  vehicles.forEach((vehicle, index) => {
    const label = `第 ${index + 1} 条`;
    if (!vehicle || typeof vehicle !== 'object') throw new TypeError(`${label}不是对象。`);
    const unknownKeys = Object.keys(vehicle).filter((key) => !ALLOWED_VEHICLE_KEYS.has(key));
    if (unknownKeys.length > 0) throw new Error(`${label}包含非白名单字段：${unknownKeys.join(', ')}。`);
    for (const [key, maxLength] of Object.entries(TEXT_LIMITS)) {
      const value = vehicle[key];
      if (value !== null && value !== undefined && (typeof value !== 'string' || value.length > maxLength)) {
        throw new Error(`${label}的 ${key} 类型错误或超过 ${maxLength} 字符。`);
      }
    }
    if (vehicle.review_status !== 'approved') throw new Error(`${label}尚未将 review_status 标记为 approved。`);
    if (!clean(vehicle.model)) throw new Error(`${label}缺少 model。`);
    if (!VEHICLE_TYPES.has(vehicle.type)) throw new Error(`${label}的 type 未校准或非法。`);
    if (!clean(vehicle.source_id)) throw new Error(`${label}缺少 source_id。`);
    if (seenIds.has(String(vehicle.source_id))) throw new Error(`${label}的 source_id 重复。`);
    seenIds.add(String(vehicle.source_id));
    if (!validateSourceUrl(vehicle.source_url)) throw new Error(`${label}的 source_url 不是规范的摩托范公开详情 URL。`);
    if (!validateSourceUrl(vehicle.detail_url) || vehicle.detail_url !== vehicle.source_url) {
      throw new Error(`${label}的 detail_url 必须与规范的摩托范公开来源 URL 一致。`);
    }
    const safeImageUrl = sanitizeHttpsImageUrl(vehicle.image_url);
    if (vehicle.image_url) {
      if (!safeImageUrl || safeImageUrl !== vehicle.image_url) throw new Error(`${label}的 image_url 不是安全的 HTTPS 图片 URL。`);
      if (!validateSourceUrl(vehicle.image_source_url) || vehicle.image_source_url !== vehicle.detail_url) {
        throw new Error(`${label}的 image_source_url 必须指向对应的摩托范公开详情页。`);
      }
    } else if (vehicle.image_source_url) {
      throw new Error(`${label}没有 image_url 时 image_source_url 必须为空。`);
    }

    if (vehicle.budget !== null) {
      const validBudget = Array.isArray(vehicle.budget)
        && vehicle.budget.length === 2
        && vehicle.budget.every((price) => Number.isFinite(price) && price > 0)
        && vehicle.budget[0] <= vehicle.budget[1];
      if (!validBudget) throw new Error(`${label}的 budget 必须为 null 或递增的正数区间。`);
    } else if (vehicle.cost !== null || vehicle.power !== null) {
      throw new Error(`${label}缺少价格时 cost 与 power 必须保持 null，不能伪装为 low。`);
    }

    if (!LEVELS.has(vehicle.cost)) throw new Error(`${label}的 cost 非法。`);
    if (!LEVELS.has(vehicle.maint)) throw new Error(`${label}的 maint 非法。`);
    if (!LEVELS.has(vehicle.power)) throw new Error(`${label}的 power 非法。`);
    if (!LOOKS_LEVELS.has(vehicle.looks)) throw new Error(`${label}的 looks 非法。`);
    if (!Array.isArray(vehicle.tags) || vehicle.tags.length > 5 || vehicle.tags.some((tag) => typeof tag !== 'string' || tag.length > 32)) {
      throw new Error(`${label}的 tags 非法。`);
    }
    if (!Array.isArray(vehicle.ranks) || vehicle.ranks.length > 4 || vehicle.ranks.some((rank) => typeof rank !== 'string' || rank.length > 32)) {
      throw new Error(`${label}的 ranks 非法。`);
    }
    const forbiddenKey = findForbiddenKey(vehicle);
    if (forbiddenKey) throw new Error(`${label}包含禁止持久化字段 ${forbiddenKey}。`);
    const piiText = JSON.stringify({
      brand: vehicle.brand,
      model: vehicle.model,
      display_name: vehicle.display_name,
      price_text: vehicle.price_text,
      status: vehicle.status,
      tags: vehicle.tags,
      why: vehicle.why,
      warn: vehicle.warn,
      ranks: vehicle.ranks
    });
    if (
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(piiText)
      || /\b1[3-9]\d{9}\b/.test(piiText)
      || /评论用户|用户昵称|微信号|联系方式|\btel:|\bmailto:/i.test(piiText)
    ) {
      throw new Error(`${label}疑似包含评论用户、邮箱、手机号或其他联系方式。`);
    }
  });

  return vehicles;
}

export function preparePublishedVehicles(vehicles) {
  validateReviewedVehicles(vehicles);
  return vehicles.map(({ review_status: _reviewStatus, ...vehicle }) => vehicle);
}

export function renderGeneratedModule(vehicles) {
  const published = preparePublishedVehicles(vehicles);
  return `// 自动生成：仅由 scrapers/motofan/publish-reviewed.mjs 在人工审核后输出\nexport const MOTOFAN_VEHICLES = ${JSON.stringify(published, null, 2)};\n`;
}

export function collectTypeHints(row = {}) {
  return extractTypeKeywords([
    row.source,
    ...(Array.isArray(row.type_keywords) ? row.type_keywords : []),
    row.detail_title,
    row.list_name
  ].join(' '));
}
