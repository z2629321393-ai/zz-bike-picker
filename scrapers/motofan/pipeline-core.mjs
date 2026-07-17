const BLOCK_TEXT_PATTERNS = [
  ['验证码或人机验证', /验证码|图形验证|滑块验证|人机验证|安全验证|完成验证|captcha|verify\s+(?:that\s+)?you\s+are\s+human/i],
  ['访问频率或访问限制', /访问(?:受限|限制|过于频繁)|请求(?:过于)?频繁|操作过于频繁|禁止访问|拒绝访问|稍后再试|access\s+denied|too\s+many\s+requests|rate\s*limit/i],
  ['登录阻断', /请先登录|登录后(?:查看|访问|继续)|登录才能|需要登录|账号登录|login\s+required|sign\s+in\s+to\s+continue/i]
];

const SPEC_LIMITS = {
  seat_mm: [400, 1200],
  weight_kg: [30, 600],
  displacement_cc: [30, 3000]
};

export class AccessBlockedError extends Error {
  constructor(reason, { status = null, url = '', phase = '' } = {}) {
    const context = [phase, url].filter(Boolean).join(' ');
    super(`采集因访问阻断而中止：${reason}${context ? `（${context}）` : ''}`);
    this.name = 'AccessBlockedError';
    this.code = 'ACCESS_BLOCKED';
    this.reason = reason;
    this.status = status;
  }
}

export function normalizeSpace(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

export function redactSensitiveText(value = '') {
  return String(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[已隐藏邮箱]')
    .replace(/\b1[3-9]\d{9}\b/g, '[已隐藏手机号]')
    .replace(/\b(?:0\d{2,3}[- ]?)?\d{7,8}\b/g, '[已隐藏电话]')
    .replace(/(?:微信|微信号|V信|电话|手机|QQ|联系方式)\s*[:：]?\s*[A-Za-z0-9_-]{5,}/gi, '[已隐藏联系方式]');
}

export function limitPublicText(value, maxLength = 240) {
  return normalizeSpace(redactSensitiveText(value)).slice(0, maxLength);
}

export function parseMaxDetails(value) {
  if (value === undefined) return 0;
  const text = String(value);
  if (!/^(?:[1-9]\d?|100)$/.test(text)) {
    throw new RangeError('MAX_DETAILS 必须是 1..100 的整数；不限制时请移除该环境变量。');
  }
  const parsed = Number(text);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 100) {
    throw new RangeError('MAX_DETAILS 必须是 1..100 的整数；不限制时请移除该环境变量。');
  }
  return parsed;
}

export function detectAccessBlock({ status = null, text = '', title = '', finalUrl = '' } = {}) {
  const numericStatus = Number(status);
  if (numericStatus === 403 || numericStatus === 429) return `HTTP ${numericStatus}`;

  if (finalUrl) {
    try {
      const pathname = new URL(finalUrl).pathname;
      if (/(?:^|\/)(?:login|signin|passport|captcha|verify)(?:\/|$)/i.test(pathname)) return '页面跳转到登录或验证入口';
    } catch {
      // URL 解析失败不应掩盖后续正文检测。
    }
  }

  const sample = normalizeSpace(`${title}\n${text}`).slice(0, 30000);
  for (const [reason, pattern] of BLOCK_TEXT_PATTERNS) {
    if (pattern.test(sample)) return reason;
  }
  return null;
}

export function assertPublicAccess(context = {}) {
  const reason = detectAccessBlock(context);
  if (reason) throw new AccessBlockedError(reason, context);
}

export function isAccessBlockedError(error) {
  return error instanceof AccessBlockedError || error?.code === 'ACCESS_BLOCKED';
}

export function parseMoneyRange(text = '') {
  const line = normalizeSpace(text);
  if (/暂无报价|即将上市/.test(line)) {
    return { price_min: null, price_max: null, price_text: limitPublicText(line, 160) };
  }

  const nums = [];
  const first = line.match(/[¥￥]\s*([0-9][0-9,]*)/);
  if (first) {
    nums.push(Number(first[1].replace(/,/g, '')));
    const rest = line.slice((first.index || 0) + first[0].length);
    const second = rest.match(/(?:-|–|—|~|至)\s*(?:[¥￥]\s*)?([0-9][0-9,]*)/);
    if (second) nums.push(Number(second[1].replace(/,/g, '')));
  }

  const finite = nums.filter(Number.isFinite);
  if (finite.length === 0) {
    return { price_min: null, price_max: null, price_text: limitPublicText(line, 160) };
  }
  return {
    price_min: Math.min(...finite),
    price_max: Math.max(...finite),
    price_text: limitPublicText(line, 160)
  };
}

function finiteNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function boundedNumber(value, [min, max]) {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= min && parsed <= max ? parsed : null;
}

export function extractSpecFragments(text = '') {
  const compact = normalizeSpace(text);
  const patterns = [
    /(?:座高|座椅高度)[^0-9。；;]{0,12}\d{3,4}\s*mm/i,
    /(?:整备质量|整车质量)[^0-9。；;]{0,12}\d{2,3}\s*kg/i,
    /排量[^0-9。；;]{0,12}\d{2,4}\s*(?:cc|mL)/i
  ];
  return patterns
    .map((pattern) => compact.match(pattern)?.[0] || '')
    .map((fragment) => limitPublicText(fragment, 100))
    .filter(Boolean);
}

export function extractSpecSummary(text = '', existing = {}) {
  const source = normalizeSpace(text);
  const read = (patterns) => {
    for (const pattern of patterns) {
      const match = source.match(pattern);
      if (match) return Number(match[1]);
    }
    return null;
  };

  return {
    seat_mm: boundedNumber(
      existing.seat_mm ?? existing.seat,
      SPEC_LIMITS.seat_mm
    ) ?? boundedNumber(read([/(?:座高|座椅高度)[^0-9]{0,12}(\d{3,4})\s*mm/i]), SPEC_LIMITS.seat_mm),
    weight_kg: boundedNumber(
      existing.weight_kg ?? existing.weight,
      SPEC_LIMITS.weight_kg
    ) ?? boundedNumber(read([/(?:整备质量|整车质量)[^0-9]{0,12}(\d{2,3})\s*kg/i]), SPEC_LIMITS.weight_kg),
    displacement_cc: boundedNumber(
      existing.displacement_cc ?? existing.displacement,
      SPEC_LIMITS.displacement_cc
    ) ?? boundedNumber(read([/排量[^0-9]{0,12}(\d{2,4})\s*(?:cc|mL)/i]), SPEC_LIMITS.displacement_cc)
  };
}

export function extractUniqueParameterSpecs(text = '') {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => normalizeSpace(line))
    .filter(Boolean);

  const readUniqueValue = (label) => {
    const index = lines.findIndex((line) => line === label);
    if (index < 0) return null;
    const values = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const value = lines[cursor];
      if (value === '-') continue;
      if (!/^\d+(?:\.\d+)?$/.test(value)) break;
      values.push(Number(value));
    }
    const unique = [...new Set(values.filter(Number.isFinite))];
    return unique.length === 1 ? unique[0] : null;
  };

  const exactDisplacement = readUniqueValue('精确排量(cc)');
  return extractSpecSummary('', {
    seat_mm: readUniqueValue('座高(mm)'),
    weight_kg: readUniqueValue('整备质量(kg)') ?? readUniqueValue('整车质量(kg)'),
    displacement_cc: exactDisplacement ?? readUniqueValue('排量(cc)')
  });
}

export function extractTypeKeywords(text = '') {
  const matches = normalizeSpace(text).match(/踏板|拉力|ADV|探险|旅行|太子|巡航|Bobber|Chopper|跑车|仿赛|竞速|赛道|Ninja|CBR|GSX|复古|咖啡|Scrambler|攀爬|越野|林道|Rally|街车/gi) || [];
  return [...new Set(matches.map((item) => limitPublicText(item, 24)))].slice(0, 12);
}

function safePrice(value) {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed >= 0 ? parsed : null;
}

function safeUrl(value) {
  const text = String(value || '').slice(0, 500);
  try {
    const parsed = new URL(text);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'm.58moto.com') return '';
    if (parsed.username || parsed.password) return '';
    if (!/^\/garage\/detail\/\d+\/?$/.test(parsed.pathname)) return '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.href;
  } catch {
    return '';
  }
}

export function sanitizeListRecord(row = {}) {
  const parsedPrice = parseMoneyRange(row.price_text || row.list_text || '');
  const priceMin = safePrice(row.price_min) ?? parsedPrice.price_min;
  const priceMax = safePrice(row.price_max) ?? parsedPrice.price_max ?? priceMin;
  const variantCount = Number(row.variant_count);

  return {
    source: limitPublicText(row.source, 80),
    id: limitPublicText(row.id, 64),
    url: safeUrl(row.url),
    list_name: row.list_name ? limitPublicText(row.list_name, 160) : null,
    variant_count: Number.isInteger(variantCount) && variantCount >= 0 ? variantCount : null,
    price_min: priceMin,
    price_max: priceMax,
    price_text: limitPublicText(row.price_text || parsedPrice.price_text, 160)
  };
}

export function sanitizeDetailRecord(row = {}) {
  const list = sanitizeListRecord(row);
  const legacyText = [
    ...(Array.isArray(row.spec_fragments) ? row.spec_fragments : []),
    row.detail_text || ''
  ].join(' ');
  const specFragments = extractSpecFragments(legacyText).slice(0, 3);
  const specs = extractSpecSummary([legacyText, ...specFragments].join(' '), row.specs || {});
  const typeKeywords = [
    ...(Array.isArray(row.type_keywords) ? row.type_keywords : []),
    ...extractTypeKeywords(`${row.brand_category_raw || ''} ${legacyText}`)
  ].map((item) => limitPublicText(item, 24)).filter(Boolean);
  const parsedDetailPrice = parseMoneyRange(row.detail_price_text || row.price_text || '');
  const explicitNoPrice = /暂无报价|即将上市/.test(String(row.detail_price_text || ''));
  const priceMin = explicitNoPrice
    ? null
    : safePrice(row.price_min) ?? parsedDetailPrice.price_min ?? list.price_min;
  const priceMax = explicitNoPrice
    ? null
    : safePrice(row.price_max) ?? parsedDetailPrice.price_max ?? list.price_max ?? priceMin;
  const usedMinPrice = safePrice(row.used_min_price);
  const ranks = (Array.isArray(row.ranks) ? row.ranks : [])
    .map((rank) => limitPublicText(rank, 32))
    .filter((rank) => /^(?:人气榜|口碑榜)NO\.\d+$/i.test(rank))
    .slice(0, 4);

  return {
    ...list,
    price_min: priceMin,
    price_max: priceMax,
    detail_title: limitPublicText(row.detail_title || row.list_name, 180),
    detail_price_text: limitPublicText(row.detail_price_text || parsedDetailPrice.price_text || row.price_text, 160),
    used_min_price: usedMinPrice,
    ranks,
    type_keywords: [...new Set(typeKeywords)].slice(0, 12),
    specs,
    spec_fragments: specFragments,
    parameter_checked: Boolean(row.parameter_checked),
    fetched_at: limitPublicText(row.fetched_at, 40)
  };
}

export function assertNonEmptyUnique(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('列表去重后为 0 条；为保护已有数据，本次不写入 motofan_raw.json。');
    error.code = 'NO_UNIQUE_ITEMS';
    throw error;
  }
  return items;
}
