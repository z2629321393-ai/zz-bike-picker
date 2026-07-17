import assert from 'node:assert/strict';
import { PUBLIC_CATALOG } from '../src/catalog.generated.js';
import { CATALOG_REVIEW_META, CATALOG_REVIEWS } from '../src/catalog-reviews.js';

const allowedDomains = [
  'benelli.com',
  'cfmoto.com',
  'haojue.com',
  'honda.com.cn',
  'jd.com',
  'kovemoto.com',
  'miit.gov.cn',
  'miit-eidc.org.cn',
  'ninebot.com',
  'qjmotor.com',
  'dsat.gov.mo',
  'triumph-mediakits.com',
  'triumphmotorcycles.cn',
  'victoria-motorrad.com',
  'wuyang-honda.com',
  'yamaha-motor.com.cn',
  'zeehoev.com',
  'zonsen.cn',
  'zonsenmotor.com'
];
const allowedMarketStatuses = new Set([
  'official_current',
  'official_family_current',
  'official_catalog_only',
  'official_orderable_mismatch',
  'superseded_or_ambiguous',
  'no_official_channel_found',
  'no_cn_official_channel',
  'identity_not_found',
  'china_mention_only',
  'legacy_or_availability_unverified',
  'official_store_current',
  'global_reference_only',
  'historical_only',
  'successor_current_ambiguous'
]);
const allowedRoadStatuses = new Set(['approval_pending', 'not_found', 'non_motor_vehicle']);
const allowedKeys = [
  'evidence',
  'market_label',
  'market_status',
  'model_codes',
  'official_name',
  'recommendable',
  'road_label',
  'road_status',
  'source_id',
  'summary'
].sort();
const catalogById = new Map(PUBLIC_CATALOG.map((row) => [row.source_id, row]));
const ids = new Set();
const reviewedStatusCounts = Object.fromEntries(Object.keys(CATALOG_REVIEW_META.status_counts).map((key) => [key, 0]));

assert.match(CATALOG_REVIEW_META.as_of, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(CATALOG_REVIEWS.length, CATALOG_REVIEW_META.reviewed);
assert.equal(CATALOG_REVIEW_META.reviewed, 23, '当前应完整覆盖两批共23条优先索引');
assert.deepEqual(CATALOG_REVIEW_META.status_counts, { new_listing: 13, upcoming: 5, unquoted: 5 });
assert.equal(CATALOG_REVIEW_META.recommendable, 0);

for (const review of CATALOG_REVIEWS) {
  assert.deepEqual(Object.keys(review).sort(), allowedKeys, `${review.source_id} 含未批准字段`);
  assert.equal(ids.has(review.source_id), false, `重复初核来源ID: ${review.source_id}`);
  ids.add(review.source_id);

  const catalogRow = catalogById.get(review.source_id);
  assert.ok(catalogRow, `初核记录 ${review.source_id} 不在公开索引`);
  assert.ok(Object.hasOwn(reviewedStatusCounts, catalogRow.catalog_status), `${review.source_id} 不属于当前优先审核批次`);
  reviewedStatusCounts[catalogRow.catalog_status] += 1;
  assert.equal(review.recommendable, false, '车型族初核记录不得进入推荐');
  assert.ok(allowedMarketStatuses.has(review.market_status), `未知市场初核状态: ${review.market_status}`);
  assert.ok(allowedRoadStatuses.has(review.road_status), `未知道路初核状态: ${review.road_status}`);
  assert.ok(review.official_name.length >= 3 && review.official_name.length <= 120);
  assert.ok(review.summary.length >= 10 && review.summary.length <= 240);
  assert.ok(review.market_label.length >= 4 && review.road_label.length >= 4);
  assert.ok(Array.isArray(review.model_codes));
  assert.equal(new Set(review.model_codes).size, review.model_codes.length, `${review.source_id} 型号代码重复`);
  assert.ok(Array.isArray(review.evidence));

  for (const evidence of review.evidence) {
    assert.deepEqual(Object.keys(evidence).sort(), ['label', 'url']);
    assert.ok(evidence.label.length >= 4 && evidence.label.length <= 80);
    const url = new URL(evidence.url);
    assert.equal(url.protocol, 'https:', '公开初核证据必须使用HTTPS');
    assert.equal(url.username || url.password, '', '公开初核证据不得包含账号信息');
    assert.ok(allowedDomains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)), `证据域名未审核: ${url.hostname}`);
  }
}

assert.equal(ids.size, CATALOG_REVIEW_META.reviewed);
assert.deepEqual(reviewedStatusCounts, CATALOG_REVIEW_META.status_counts, '初核批次状态计数不一致');
console.log(`Catalog review check passed: ${CATALOG_REVIEWS.length} reviewed, 0 recommendation-eligible`);
