import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REVIEW_SCHEMA_VERSION = 2;
export const MARKET_STATUSES = Object.freeze([
  'officially_available',
  'discontinued',
  'not_introduced',
  'upcoming',
  'unknown'
]);
export const ROAD_APPROVAL_STATUSES = Object.freeze(['approved', 'not_approved', 'unknown']);
export const REVIEW_STATUSES = Object.freeze(['pending', 'approved', 'rejected']);
export const VEHICLE_CLASSES = Object.freeze([
  'motorcycle',
  'electric_motorcycle',
  'electric_bicycle',
  'non_road',
  'unknown'
]);
export const PROPULSION_TYPES = Object.freeze(['ice', 'electric', 'hybrid', 'unknown']);
export const APPROVAL_ROUTES = Object.freeze(['domestic', 'official_import']);
export const MARKET_EVIDENCE_SCOPES = Object.freeze([
  'china_availability',
  'global_reference',
  'historical_reference'
]);
export const MIIT_RECORD_TYPES = Object.freeze([
  'domestic_product_announcement',
  'imported_vehicle_record'
]);
export const CCC_CERTIFICATE_STATUSES = Object.freeze([
  'valid',
  'suspended',
  'revoked',
  'expired',
  'unknown'
]);
export const FRESHNESS_DAYS = Object.freeze({ market: 90, miit: 180, ccc: 90, review: 30 });

// 只允许已人工确认的品牌官网基础域；媒体、经销商和电商域名不得加入。
export const ALLOWED_MARKET_DOMAINS = Object.freeze([
  'benelli.com',
  'benelli.com.cn',
  'cfmoto.com',
  'haojue.com',
  'honda.com.cn',
  'kawasaki-motor.cn',
  'kovemoto.com',
  'ninebot.com',
  'qjmotor.com',
  'triumphmotorcycles.cn',
  'victoria-motorrad.com',
  'vogemotor.com',
  'wuyang-honda.com',
  'yamaha-motor.com.cn',
  'zeehoev.com',
  'zonsen.cn',
  'zonsenmotor.com',
  'zontes.com'
]);
// 全球官方媒体只可作为参考证据，永远不能证明中国大陆当前在售。
export const ALLOWED_REFERENCE_DOMAINS = Object.freeze([
  'triumph-mediakits.com'
]);
export const ALLOWED_MIIT_DOMAINS = Object.freeze([
  'miit.gov.cn',
  'miit-eidc.org.cn'
]);
export const ALLOWED_CCC_DOMAINS = Object.freeze([
  'cnca.gov.cn',
  'cx.cnca.cn'
]);

const DAY_MS = 24 * 60 * 60 * 1000;
const AGGREGATE_PATTERN = /(?:[\/／|｜、]|系列|全系|多款|多个版本|车型矩阵)/u;
const ROOT_KEYS = ['asOf', 'entries', 'schemaVersion'];
const ENTRY_KEYS = [
  'evidence',
  'identity',
  'marketStatus',
  'notes',
  'recommendationData',
  'reviewedAt',
  'reviewer',
  'reviewId',
  'reviewStatus',
  'roadApprovalStatus'
];
const REQUIRED_ENTRY_KEYS = ENTRY_KEYS.filter((key) => key !== 'notes');
const IDENTITY_KEYS = [
  'approvalRoute',
  'brand',
  'displacementCc',
  'manufacturer',
  'modelCode',
  'modelName',
  'modelYear',
  'propulsion',
  'vehicleClass',
  'trimName'
];
const MARKET_EVIDENCE_KEYS = ['checkedAt', 'modelCode', 'scope', 'sourceTitle', 'url'];
const MIIT_EVIDENCE_KEYS = ['checkedAt', 'modelCode', 'recordType', 'referenceId', 'sourceTitle', 'url'];
const CCC_EVIDENCE_KEYS = ['certificateNumber', 'certificateStatus', 'checkedAt', 'modelCode', 'sourceTitle', 'url'];
const RECOMMENDATION_KEYS = [
  'abs',
  'category',
  'curbWeightKg',
  'powerClass',
  'priceCny',
  'ratedPowerKw',
  'seatHeightMm'
];
const ENGINE_CATEGORIES = ['scooter', 'adv', 'cruiser', 'sport', 'street', 'retro', 'offroad', 'collector'];

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function own(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function addExactKeyErrors(value, allowedKeys, requiredKeys, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} 必须是对象`);
    return false;
  }
  const unexpected = Object.keys(value).filter((key) => !allowedKeys.includes(key));
  const missing = requiredKeys.filter((key) => !own(value, key));
  if (unexpected.length) errors.push(`${label} 含未允许字段：${unexpected.join(', ')}`);
  if (missing.length) errors.push(`${label} 缺少字段：${missing.join(', ')}`);
  return !unexpected.length && !missing.length;
}

function findForbiddenRecommendable(value, pathLabel = '账本', errors = []) {
  if (!value || typeof value !== 'object') return errors;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = `${pathLabel}.${key}`;
    if (key === 'recommendable') errors.push(`${nextPath} 禁止手填；该字段只能由校验脚本计算`);
    findForbiddenRecommendable(child, nextPath, errors);
  }
  return errors;
}

function parseDateOnly(value, label, errors) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors.push(`${label} 必须是 YYYY-MM-DD`);
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    errors.push(`${label} 不是有效日期`);
    return null;
  }
  return date;
}

function normalizeNow(now, errors) {
  if (now instanceof Date && !Number.isNaN(now.getTime())) {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  return parseDateOnly(now, '运行日期', errors);
}

function ageInDays(checkedAt, now) {
  return Math.floor((now.getTime() - checkedAt.getTime()) / DAY_MS);
}

function hostIsAllowed(hostname, allowedDomains) {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  return allowedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function validateEvidenceUrl(rawUrl, allowedDomains, label, errors) {
  if (typeof rawUrl !== 'string') {
    errors.push(`${label} 必须是 URL 字符串`);
    return null;
  }
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') errors.push(`${label} 必须使用 HTTPS`);
    if (url.username || url.password) errors.push(`${label} 不得包含账号信息`);
    if (url.port && url.port !== '443') errors.push(`${label} 不得使用非标准端口`);
    if (!hostIsAllowed(url.hostname, allowedDomains)) errors.push(`${label} 域名不在白名单：${url.hostname}`);
    if (!url.pathname || url.pathname === '/') errors.push(`${label} 必须指向具体车型或公告页面，不能只填首页`);
    return url;
  } catch {
    errors.push(`${label} 不是有效 URL`);
    return null;
  }
}

function validateShortString(value, min, max, label, errors) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    errors.push(`${label} 长度必须为 ${min}–${max} 个字符`);
    return false;
  }
  return true;
}

function validateIdentity(identity, label, now, errors) {
  if (!addExactKeyErrors(identity, IDENTITY_KEYS, IDENTITY_KEYS, label, errors)) return null;
  validateShortString(identity.manufacturer, 2, 100, `${label}.manufacturer`, errors);
  validateShortString(identity.brand, 1, 50, `${label}.brand`, errors);
  validateShortString(identity.modelName, 1, 80, `${label}.modelName`, errors);
  validateShortString(identity.trimName, 1, 80, `${label}.trimName`, errors);

  for (const key of ['brand', 'modelName', 'trimName']) {
    if (typeof identity[key] === 'string' && AGGREGATE_PATTERN.test(identity[key])) {
      errors.push(`${label}.${key} 疑似聚合车型，必须拆成单一具体版本`);
    }
  }
  if (typeof identity.modelCode !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/.test(identity.modelCode)) {
    errors.push(`${label}.modelCode 必须是 2–40 位精确公告/产品型号代码`);
  }
  if (!APPROVAL_ROUTES.includes(identity.approvalRoute)) {
    errors.push(`${label}.approvalRoute 不是允许准入路径`);
  }
  const maximumYear = now ? now.getUTCFullYear() + 2 : 2100;
  if (!Number.isInteger(identity.modelYear) || identity.modelYear < 1980 || identity.modelYear > maximumYear) {
    errors.push(`${label}.modelYear 超出允许范围`);
  }
  if (!VEHICLE_CLASSES.includes(identity.vehicleClass)) {
    errors.push(`${label}.vehicleClass 不是允许类别`);
  }
  if (!PROPULSION_TYPES.includes(identity.propulsion)) {
    errors.push(`${label}.propulsion 不是允许动力形式`);
  }
  if (identity.propulsion === 'electric') {
    if (identity.displacementCc !== null && identity.displacementCc !== 0) {
      errors.push(`${label}.displacementCc 在纯电车型中必须为 null 或 0`);
    }
  } else if (identity.propulsion === 'ice' || identity.propulsion === 'hybrid') {
    if (!Number.isInteger(identity.displacementCc) || identity.displacementCc < 1 || identity.displacementCc > 2500) {
      errors.push(`${label}.displacementCc 在燃油/混动车型中必须是 1–2500 的整数`);
    }
  } else if (identity.displacementCc !== null && identity.displacementCc !== 0) {
    errors.push(`${label}.displacementCc 在未知动力形式中只能为 null 或 0`);
  }
  if (identity.vehicleClass === 'electric_motorcycle' && identity.propulsion !== 'electric') {
    errors.push(`${label} 电动摩托车的 propulsion 必须为 electric`);
  }
  if (identity.vehicleClass === 'motorcycle' && !['ice', 'hybrid'].includes(identity.propulsion)) {
    errors.push(`${label} 道路摩托车的 propulsion 必须为 ice 或 hybrid`);
  }
  return identity;
}

function validateRecommendationData(value, label, errors) {
  const missing = [];
  if (value === null) {
    return { value: null, missing: ['category', 'priceCny', 'seatHeightMm', 'curbWeightKg', 'abs', 'power'] };
  }
  if (!addExactKeyErrors(value, RECOMMENDATION_KEYS, RECOMMENDATION_KEYS, label, errors)) {
    return { value: null, missing: ['recommendationData'] };
  }

  if (value.category === null) missing.push('category');
  else if (!ENGINE_CATEGORIES.includes(value.category)) errors.push(`${label}.category 不是推荐引擎允许类别`);

  if (value.priceCny === null) {
    missing.push('priceCny');
  } else if (addExactKeyErrors(value.priceCny, ['max', 'min'], ['max', 'min'], `${label}.priceCny`, errors)) {
    if (!Number.isInteger(value.priceCny.min) || value.priceCny.min < 1) errors.push(`${label}.priceCny.min 必须是正整数`);
    if (!Number.isInteger(value.priceCny.max) || value.priceCny.max < 1) errors.push(`${label}.priceCny.max 必须是正整数`);
    if (Number.isInteger(value.priceCny.min) && Number.isInteger(value.priceCny.max) && value.priceCny.max < value.priceCny.min) {
      errors.push(`${label}.priceCny.max 不得小于 min`);
    }
  }

  if (value.seatHeightMm === null) missing.push('seatHeightMm');
  else if (!Number.isInteger(value.seatHeightMm) || value.seatHeightMm < 400 || value.seatHeightMm > 1200) {
    errors.push(`${label}.seatHeightMm 必须是 400–1200 的整数`);
  }
  if (value.curbWeightKg === null) missing.push('curbWeightKg');
  else if (!Number.isInteger(value.curbWeightKg) || value.curbWeightKg < 30 || value.curbWeightKg > 600) {
    errors.push(`${label}.curbWeightKg 必须是 30–600 的整数`);
  }
  if (value.abs === null) missing.push('abs');
  else if (typeof value.abs !== 'boolean') errors.push(`${label}.abs 必须是明确的 true、false 或待核验 null`);

  if (value.ratedPowerKw !== null
    && (typeof value.ratedPowerKw !== 'number' || !Number.isFinite(value.ratedPowerKw)
      || value.ratedPowerKw <= 0 || value.ratedPowerKw > 500)) {
    errors.push(`${label}.ratedPowerKw 必须是 0–500 的有效数值或 null`);
  }
  if (value.powerClass !== null && !['low', 'mid', 'high'].includes(value.powerClass)) {
    errors.push(`${label}.powerClass 必须是 low、mid、high 或 null`);
  }
  if (value.ratedPowerKw === null && value.powerClass === null) missing.push('ratedPowerKw/powerClass');
  return { value, missing };
}

function validateEvidenceDateAndModel(item, label, identity, asOf, now, errors) {
  validateShortString(item.sourceTitle, 2, 120, `${label}.sourceTitle`, errors);
  if (typeof item.modelCode !== 'string' || item.modelCode.trim().toUpperCase() !== identity.modelCode.trim().toUpperCase()) {
    errors.push(`${label}.modelCode 必须与 identity.modelCode 完全对应`);
  }
  const checkedAt = parseDateOnly(item.checkedAt, `${label}.checkedAt`, errors);
  if (checkedAt && asOf && checkedAt > asOf) errors.push(`${label}.checkedAt 不得晚于账本 asOf`);
  if (checkedAt && now && checkedAt > now) errors.push(`${label}.checkedAt 不得晚于运行日期`);
  return checkedAt;
}

function validateMarketEvidenceItem(item, index, entryLabel, identity, asOf, now, errors) {
  const label = `${entryLabel}.evidence.market[${index}]`;
  if (!addExactKeyErrors(item, MARKET_EVIDENCE_KEYS, MARKET_EVIDENCE_KEYS, label, errors)) return null;
  if (!MARKET_EVIDENCE_SCOPES.includes(item.scope)) errors.push(`${label}.scope 不是允许用途`);

  const isChinaAvailability = item.scope === 'china_availability';
  const allowedDomains = isChinaAvailability
    ? ALLOWED_MARKET_DOMAINS
    : [...ALLOWED_MARKET_DOMAINS, ...ALLOWED_REFERENCE_DOMAINS];
  const url = validateEvidenceUrl(item.url, allowedDomains, `${label}.url`, errors);
  if (isChinaAvailability && url && hostIsAllowed(url.hostname, ['benelli.com'])
    && !/^\/cn-zh(?:\/|$)/i.test(url.pathname)) {
    errors.push(`${label}.url 的 benelli.com 中国在售证据必须位于 /cn-zh/ 路径`);
  }
  const checkedAt = validateEvidenceDateAndModel(item, label, identity, asOf, now, errors);
  return { checkedAt, isChinaAvailability };
}

function validateMiitEvidenceItem(item, index, entryLabel, identity, asOf, now, errors) {
  const label = `${entryLabel}.evidence.miit[${index}]`;
  if (!addExactKeyErrors(item, MIIT_EVIDENCE_KEYS, MIIT_EVIDENCE_KEYS, label, errors)) return null;
  validateEvidenceUrl(item.url, ALLOWED_MIIT_DOMAINS, `${label}.url`, errors);
  if (!MIIT_RECORD_TYPES.includes(item.recordType)) errors.push(`${label}.recordType 不是允许记录类型`);
  const expectedRecordType = identity.approvalRoute === 'official_import'
    ? 'imported_vehicle_record'
    : 'domestic_product_announcement';
  if (item.recordType !== expectedRecordType) {
    errors.push(`${label}.recordType 必须与 identity.approvalRoute=${identity.approvalRoute} 匹配`);
  }
  if (!validateShortString(item.referenceId, 2, 120, `${label}.referenceId`, errors) || !/\d/.test(item.referenceId)) {
    errors.push(`${label}.referenceId 必须包含可核验的记录编号`);
  }
  return validateEvidenceDateAndModel(item, label, identity, asOf, now, errors);
}

function validateCccEvidenceItem(item, index, entryLabel, identity, asOf, now, errors) {
  const label = `${entryLabel}.evidence.ccc[${index}]`;
  if (!addExactKeyErrors(item, CCC_EVIDENCE_KEYS, CCC_EVIDENCE_KEYS, label, errors)) return null;
  validateEvidenceUrl(item.url, ALLOWED_CCC_DOMAINS, `${label}.url`, errors);
  if (typeof item.certificateNumber !== 'string' || !/^[A-Za-z0-9._-]{8,80}$/.test(item.certificateNumber)) {
    errors.push(`${label}.certificateNumber 必须是 8–80 位可核验证书编号`);
  }
  if (!CCC_CERTIFICATE_STATUSES.includes(item.certificateStatus)) {
    errors.push(`${label}.certificateStatus 不是允许状态`);
  }
  const checkedAt = validateEvidenceDateAndModel(item, label, identity, asOf, now, errors);
  return { checkedAt, isValid: item.certificateStatus === 'valid' };
}

function auditEntry(entry, index, asOf, now, ids, identities, errors) {
  const fallbackId = isPlainObject(entry) && typeof entry.reviewId === 'string' ? entry.reviewId : `#${index}`;
  const label = `entries[${index}](${fallbackId})`;
  const blockers = [];
  if (!addExactKeyErrors(entry, ENTRY_KEYS, REQUIRED_ENTRY_KEYS, label, errors)) {
    return { reviewId: fallbackId, recommendable: false, blockers: ['账本结构无效'], entry: null };
  }

  if (typeof entry.reviewId !== 'string' || !/^[a-z0-9][a-z0-9-]{2,79}$/.test(entry.reviewId)) {
    errors.push(`${label}.reviewId 必须是 3–80 位小写字母、数字或连字符`);
  } else if (ids.has(entry.reviewId)) {
    errors.push(`${label}.reviewId 重复`);
  } else {
    ids.add(entry.reviewId);
  }

  const identity = validateIdentity(entry.identity, `${label}.identity`, now, errors);
  if (identity) {
    const identityKey = [identity.manufacturer, identity.modelCode, identity.modelYear, identity.trimName]
      .map((part) => String(part).trim().toUpperCase())
      .join('|');
    if (identities.has(identityKey)) errors.push(`${label}.identity 与其他记录重复`);
    identities.add(identityKey);
  }

  if (!MARKET_STATUSES.includes(entry.marketStatus)) errors.push(`${label}.marketStatus 不是允许状态`);
  if (!ROAD_APPROVAL_STATUSES.includes(entry.roadApprovalStatus)) errors.push(`${label}.roadApprovalStatus 不是允许状态`);
  if (!REVIEW_STATUSES.includes(entry.reviewStatus)) errors.push(`${label}.reviewStatus 不是允许状态`);
  if (own(entry, 'notes')) validateShortString(entry.notes, 0, 500, `${label}.notes`, errors);
  const recommendationAudit = validateRecommendationData(entry.recommendationData, `${label}.recommendationData`, errors);

  const evidence = entry.evidence;
  const evidenceKeys = ['ccc', 'market', 'miit'];
  const evidenceShapeOkay = addExactKeyErrors(evidence, evidenceKeys, evidenceKeys, `${label}.evidence`, errors);
  const chinaMarketDates = [];
  const miitDates = [];
  const validCccDates = [];
  if (evidenceShapeOkay) {
    if (!Array.isArray(evidence.market)) errors.push(`${label}.evidence.market 必须是数组`);
    if (!Array.isArray(evidence.miit)) errors.push(`${label}.evidence.miit 必须是数组`);
    if (!Array.isArray(evidence.ccc)) errors.push(`${label}.evidence.ccc 必须是数组`);
    if (identity && Array.isArray(evidence.market)) {
      evidence.market.forEach((item, evidenceIndex) => {
        const result = validateMarketEvidenceItem(item, evidenceIndex, label, identity, asOf, now, errors);
        if (result?.checkedAt && result.isChinaAvailability) chinaMarketDates.push(result.checkedAt);
      });
    }
    if (identity && Array.isArray(evidence.miit)) {
      evidence.miit.forEach((item, evidenceIndex) => {
        const date = validateMiitEvidenceItem(item, evidenceIndex, label, identity, asOf, now, errors);
        if (date) miitDates.push(date);
      });
    }
    if (identity && Array.isArray(evidence.ccc)) {
      evidence.ccc.forEach((item, evidenceIndex) => {
        const result = validateCccEvidenceItem(item, evidenceIndex, label, identity, asOf, now, errors);
        if (result?.checkedAt && result.isValid) validCccDates.push(result.checkedAt);
      });
    }
  }

  let reviewedAt = null;
  if (entry.reviewedAt !== null) reviewedAt = parseDateOnly(entry.reviewedAt, `${label}.reviewedAt`, errors);
  if (reviewedAt && asOf && reviewedAt > asOf) errors.push(`${label}.reviewedAt 不得晚于账本 asOf`);
  if (reviewedAt && now && reviewedAt > now) errors.push(`${label}.reviewedAt 不得晚于运行日期`);
  if (entry.reviewer !== null) validateShortString(entry.reviewer, 2, 80, `${label}.reviewer`, errors);

  if (entry.reviewStatus !== 'approved') blockers.push(`人工审核状态为 ${entry.reviewStatus}`);
  if (!['motorcycle', 'electric_motorcycle'].includes(identity?.vehicleClass)) {
    blockers.push(`车辆类别 ${identity?.vehicleClass || 'unknown'} 不属于可推荐道路摩托`);
  }
  if (identity?.propulsion === 'unknown') blockers.push('动力形式未知');
  if (entry.marketStatus !== 'officially_available') blockers.push(`市场状态为 ${entry.marketStatus}`);
  if (entry.roadApprovalStatus !== 'approved') blockers.push(`道路准入状态为 ${entry.roadApprovalStatus}`);
  if (!Array.isArray(evidence?.market) || !evidence.market.some((item) => item?.scope === 'china_availability')) {
    blockers.push('缺少中国品牌官网在售证据');
  }
  if (!Array.isArray(evidence?.miit) || evidence.miit.length === 0) blockers.push('缺少工信部准入记录');
  if (!Array.isArray(evidence?.ccc) || evidence.ccc.length === 0) blockers.push('缺少CCC证书记录');
  if (Array.isArray(evidence?.ccc) && evidence.ccc.length > 0
    && !evidence.ccc.some((item) => item?.certificateStatus === 'valid')) {
    blockers.push('没有状态为 valid 的CCC证书');
  }
  if (!entry.reviewer || !reviewedAt) blockers.push('缺少完整人工复核信息');
  if (recommendationAudit.missing.length) {
    blockers.push(`缺少关键推荐参数：${recommendationAudit.missing.join(', ')}`);
  }

  const hasFreshMarketEvidence = now && chinaMarketDates.some((date) => ageInDays(date, now) <= FRESHNESS_DAYS.market);
  const hasFreshMiitEvidence = now && miitDates.some((date) => ageInDays(date, now) <= FRESHNESS_DAYS.miit);
  const hasFreshCccEvidence = now && validCccDates.some((date) => ageInDays(date, now) <= FRESHNESS_DAYS.ccc);
  const freshReview = now && reviewedAt && ageInDays(reviewedAt, now) <= FRESHNESS_DAYS.review;
  if (chinaMarketDates.length && !hasFreshMarketEvidence) blockers.push(`中国官网在售证据已超过 ${FRESHNESS_DAYS.market} 天`);
  if (miitDates.length && !hasFreshMiitEvidence) blockers.push(`工信部证据已超过 ${FRESHNESS_DAYS.miit} 天`);
  if (validCccDates.length && !hasFreshCccEvidence) blockers.push(`CCC证据已超过 ${FRESHNESS_DAYS.ccc} 天`);
  if (reviewedAt && !freshReview) blockers.push(`人工复核已超过 ${FRESHNESS_DAYS.review} 天`);

  return {
    reviewId: fallbackId,
    recommendable: blockers.length === 0,
    blockers,
    entry
  };
}

export function auditOfficialReviews(ledger, { now = new Date() } = {}) {
  const errors = [];
  findForbiddenRecommendable(ledger, '账本', errors);
  const today = normalizeNow(now, errors);

  if (!addExactKeyErrors(ledger, ROOT_KEYS, ROOT_KEYS, '账本', errors)) {
    return { errors, decisions: [], recommendableEntries: [] };
  }
  if (ledger.schemaVersion !== REVIEW_SCHEMA_VERSION) errors.push(`schemaVersion 必须为 ${REVIEW_SCHEMA_VERSION}`);
  const asOf = parseDateOnly(ledger.asOf, '账本.asOf', errors);
  if (asOf && today && asOf > today) errors.push('账本.asOf 不得晚于运行日期');
  if (!Array.isArray(ledger.entries)) {
    errors.push('账本.entries 必须是数组');
    return { errors, decisions: [], recommendableEntries: [] };
  }

  const ids = new Set();
  const identities = new Set();
  const decisions = ledger.entries.map((entry, index) => auditEntry(entry, index, asOf, today, ids, identities, errors));
  const recommendableEntries = errors.length
    ? []
    : decisions.filter((decision) => decision.recommendable).map((decision) => decision.entry);
  return { errors, decisions, recommendableEntries };
}

export function toPublicVerifiedVehicle(entry) {
  const { identity } = entry;
  const specs = entry.recommendationData;
  const power = specs.powerClass || powerClassFromRatedKw(specs.ratedPowerKw);
  const chinaMarketEvidence = entry.evidence.market.find((item) => item.scope === 'china_availability');
  return Object.freeze({
    review_id: entry.reviewId,
    brand: identity.brand,
    model: `${identity.modelName} ${identity.trimName}`.replace(/\s+/g, ' ').trim(),
    variant: identity.trimName,
    year: identity.modelYear,
    model_code: identity.modelCode,
    approval_route: identity.approvalRoute,
    vehicle_class: identity.vehicleClass,
    propulsion: identity.propulsion,
    displacement: identity.displacementCc,
    type: specs.category,
    budget: Object.freeze([specs.priceCny.min, specs.priceCny.max]),
    seat: specs.seatHeightMm,
    weight: specs.curbWeightKg,
    abs: specs.abs,
    power,
    source: 'official_review',
    source_url: chinaMarketEvidence.url,
    status: '中国官网在售/工信部/CCC已三重核验',
    dataQuality: 'verified',
    market_status: entry.marketStatus,
    road_approval_status: entry.roadApprovalStatus,
    reviewed_at: entry.reviewedAt,
    source_urls: Object.freeze({
      market: Object.freeze(entry.evidence.market.map((item) => item.url)),
      miit: Object.freeze(entry.evidence.miit.map((item) => item.url)),
      ccc: Object.freeze(entry.evidence.ccc.map((item) => item.url))
    }),
    recommendable: true
  });
}

function powerClassFromRatedKw(ratedPowerKw) {
  if (ratedPowerKw <= 15) return 'low';
  if (ratedPowerKw <= 35) return 'mid';
  return 'high';
}

export function renderVerifiedModule(ledger, recommendableEntries) {
  const vehicles = recommendableEntries.map(toPublicVerifiedVehicle);
  const meta = {
    schemaVersion: ledger.schemaVersion,
    asOf: ledger.asOf,
    reviewed: ledger.entries.length,
    recommendable: vehicles.length
  };
  return `// 由 scripts/check-official-reviews.mjs 自动生成，请勿手改。\n`
    + `export const VERIFIED_REVIEW_META = Object.freeze(${JSON.stringify(meta, null, 2)});\n\n`
    + `export const VERIFIED_VEHICLES = Object.freeze(${JSON.stringify(vehicles, null, 2)});\n`;
}

export async function runOfficialReviewCheck({
  inputPath = path.resolve('data/official-vehicle-reviews.json'),
  outputPath = path.resolve('src/vehicles.verified.js'),
  now = new Date()
} = {}) {
  const raw = await readFile(inputPath, 'utf8');
  const ledger = JSON.parse(raw.replace(/^\uFEFF/, ''));
  const audit = auditOfficialReviews(ledger, { now });
  if (audit.errors.length) {
    throw new Error(`具体车型审核账本校验失败：\n- ${audit.errors.join('\n- ')}`);
  }
  await writeFile(outputPath, renderVerifiedModule(ledger, audit.recommendableEntries), 'utf8');
  return { ledger, ...audit };
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    const result = await runOfficialReviewCheck();
    const blocked = result.decisions.filter((decision) => !decision.recommendable);
    console.log(`具体车型审核账本通过：${result.ledger.entries.length} 条，自动推荐白名单 ${result.recommendableEntries.length} 条，阻断 ${blocked.length} 条。`);
    for (const decision of blocked.slice(0, 20)) {
      console.log(`- ${decision.reviewId}: ${decision.blockers.join('；')}`);
    }
    if (blocked.length > 20) console.log(`... 其余 ${blocked.length - 20} 条阻断记录省略`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
