import { BASE_VEHICLES } from '../data/base-vehicles.js';
import { MOTOFAN_VEHICLES } from '../src/vehicles.generated.js';
import { DEMO_VEHICLE_META } from '../src/demo-meta.js';
import { mergeAndNormalizeVehicles } from '../src/engine.js';
import { PRODUCT_CATALOG, productCatalogStats } from '../src/product-catalog.js';

const vehicles = mergeAndNormalizeVehicles(BASE_VEHICLES, MOTOFAN_VEHICLES);
const errors = [];
const warnings = [];
const ids = new Set();

for (const vehicle of vehicles) {
  if (!vehicle.brand || !vehicle.model) errors.push(`缺少品牌或车型：${JSON.stringify(vehicle)}`);
  if (!Array.isArray(vehicle.budget) || vehicle.budget.length !== 2) errors.push(`${vehicle.brand} ${vehicle.model} budget格式错误`);
  if (vehicle.budget[0] < 0 || vehicle.budget[1] < 0) errors.push(`${vehicle.brand} ${vehicle.model} 价格不能为负数`);
  if (ids.has(vehicle.id)) errors.push(`重复ID：${vehicle.id}`);
  ids.add(vehicle.id);
  if (vehicle.recommendable === true) errors.push(`${vehicle.brand} ${vehicle.model} 属于示例/第三方候选，禁止直接获得正式推荐资格`);
  if (!vehicle.seat) warnings.push(`${vehicle.brand} ${vehicle.model} 缺少座高`);
  if (!vehicle.weight) warnings.push(`${vehicle.brand} ${vehicle.model} 缺少整备质量`);
  if (!vehicle.year) warnings.push(`${vehicle.brand} ${vehicle.model} 缺少年款`);
}

const expectedProductCounts = {
  helmet: 25,
  gloves: 20,
  armor: 21,
  boots: 19,
  luggage: 13,
  lights: 13,
  intercom: 47,
  theft: 10
};
const productStats = productCatalogStats();
const productIds = new Set();
const productNames = new Set();
const recordTypes = new Set(['exact', 'series', 'direction', 'bundle']);

if (productStats.total !== 168) errors.push(`装备候选目录应为168条，实际为${productStats.total}条`);
for (const [categoryId, expected] of Object.entries(expectedProductCounts)) {
  const actual = productStats.byCategory[categoryId] || 0;
  if (actual !== expected) errors.push(`${categoryId}装备目录应为${expected}条，实际为${actual}条`);
}

for (const product of PRODUCT_CATALOG) {
  if (!product.id || !product.categoryId || !product.brand || !product.model) {
    errors.push(`装备记录缺少必填字段：${JSON.stringify(product)}`);
    continue;
  }
  if (productIds.has(product.id)) errors.push(`装备目录重复ID：${product.id}`);
  productIds.add(product.id);

  const canonicalName = `${product.brand}|${product.model}`.toLowerCase().replace(/[\s\-–—_/]+/g, '');
  if (productNames.has(canonicalName)) errors.push(`装备目录重复品牌/型号：${product.brand} ${product.model}`);
  productNames.add(canonicalName);

  if (!recordTypes.has(product.recordType)) errors.push(`${product.id} recordType无效：${product.recordType}`);
  if (!product.cnAvailability) errors.push(`${product.id} 缺少国内渠道状态`);
  if (!Array.isArray(product.aliases)) errors.push(`${product.id} aliases必须是数组`);
  if (!product.priceBand || !product.idealFor || !product.reviewSummary || !product.compromise) {
    errors.push(`${product.id} 缺少价格、适合对象、资料摘要或取舍说明`);
  }
  for (const [field, url] of [
    ['officialUrl', product.officialUrl],
    ['reviewUrl', product.reviewUrl],
    ['marketSignal.sourceUrl', product.marketSignal?.sourceUrl]
  ]) {
    if (url && !url.startsWith('https://')) errors.push(`${product.id} ${field}必须使用HTTPS`);
  }
  if (product.marketSignal && (!product.marketSignal.observedAt || !product.marketSignal.sourceUrl)) {
    errors.push(`${product.id} 公开平台快照缺少日期或来源链接`);
  }
  if (!product.marketSignal && /(热卖|排行|热门)/.test(product.sourceType || '')) {
    errors.push(`${product.id} 没有公开快照却使用热卖/排行措辞`);
  }
}

if (DEMO_VEHICLE_META.total !== vehicles.length) {
  errors.push(`公开示例数量元数据为 ${DEMO_VEHICLE_META.total}，实际为 ${vehicles.length}`);
}

console.log(`示例/第三方候选总数：${vehicles.length}`);
console.log(`装备候选目录：${productStats.total}条（公开平台快照${productStats.withMarketSignal}条）`);
console.log(`数据提醒：${warnings.length}`);
if (warnings.length) console.log(warnings.slice(0, 12).map((item) => `- ${item}`).join('\n'));
if (warnings.length > 12) console.log(`... 其余 ${warnings.length - 12} 条省略`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('数据结构检查通过。');
