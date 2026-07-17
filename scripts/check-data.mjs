import { BASE_VEHICLES } from '../data/base-vehicles.js';
import { MOTOFAN_VEHICLES } from '../src/vehicles.generated.js';
import { DEMO_VEHICLE_META } from '../src/demo-meta.js';
import { mergeAndNormalizeVehicles } from '../src/engine.js';

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

if (DEMO_VEHICLE_META.total !== vehicles.length) {
  errors.push(`公开示例数量元数据为 ${DEMO_VEHICLE_META.total}，实际为 ${vehicles.length}`);
}

console.log(`示例/第三方候选总数：${vehicles.length}`);
console.log(`数据提醒：${warnings.length}`);
if (warnings.length) console.log(warnings.slice(0, 12).map((item) => `- ${item}`).join('\n'));
if (warnings.length > 12) console.log(`... 其余 ${warnings.length - 12} 条省略`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('数据结构检查通过。');
