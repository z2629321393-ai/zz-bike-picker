import assert from 'node:assert/strict';
import { CATALOG_META, CATALOG_STATUS, PUBLIC_CATALOG } from '../src/catalog.generated.js';

const allowedKeys = [
  'availability_note',
  'catalog_status',
  'display_name',
  'price_label',
  'price_max',
  'price_min',
  'recommendable',
  'road_legal',
  'source_id',
  'source_url',
  'status_label',
  'variant_count'
].sort();
const ids = new Set();
const urls = new Set();
const actualCounts = Object.fromEntries(Object.keys(CATALOG_STATUS).map((key) => [key, 0]));

assert.equal(PUBLIC_CATALOG.length, CATALOG_META.total, '目录总数必须和元数据一致');
assert.ok(PUBLIC_CATALOG.length > 1000, '公开目录不应意外退化成少量样本');

for (const row of PUBLIC_CATALOG) {
  assert.deepEqual(Object.keys(row).sort(), allowedKeys, `车型 ${row.source_id} 含未批准公开字段`);
  assert.match(row.source_id, /^\d+$/, '来源 ID 必须是数字字符串');
  assert.equal(ids.has(row.source_id), false, `重复来源 ID: ${row.source_id}`);
  ids.add(row.source_id);

  const parsed = new URL(row.source_url);
  assert.equal(parsed.protocol, 'https:', '来源必须使用 HTTPS');
  assert.equal(parsed.hostname, 'm.58moto.com', '来源域名不在白名单');
  assert.equal(parsed.pathname, `/garage/detail/${row.source_id}`, '来源 ID 与链接不一致');
  assert.equal(urls.has(row.source_url), false, `重复来源链接: ${row.source_url}`);
  urls.add(row.source_url);

  assert.ok(row.display_name.length > 0 && row.display_name.length <= 100, '公开车型名长度异常');
  assert.ok(Object.hasOwn(CATALOG_STATUS, row.catalog_status), `未知目录状态: ${row.catalog_status}`);
  assert.equal(row.status_label, CATALOG_STATUS[row.catalog_status].label, '状态标签与定义不一致');
  assert.equal(row.availability_note, CATALOG_STATUS[row.catalog_status].note, '状态说明与定义不一致');
  assert.equal(row.recommendable, false, '未审核公开索引不得进入推荐');
  assert.equal(row.road_legal, null, '未取得准入证据时不得猜测道路合法性');
  actualCounts[row.catalog_status] += 1;
}

assert.deepEqual(actualCounts, CATALOG_META.status_counts, '目录状态计数与元数据不一致');
assert.equal(Object.values(actualCounts).reduce((sum, count) => sum + count, 0), PUBLIC_CATALOG.length);
assert.equal(actualCounts.not_introduced, 24, '大陆未引进标记数量异常');
assert.equal(actualCounts.discontinued, 422, '停售标记数量异常');
assert.equal(actualCounts.upcoming, 5, '即将上市标记数量异常');

console.log(`Catalog check passed: ${PUBLIC_CATALOG.length} rows, ${Object.keys(CATALOG_STATUS).length} statuses`);
