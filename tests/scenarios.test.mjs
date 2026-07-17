import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_VEHICLES } from '../data/base-vehicles.js';
import { DEFAULT_ANSWERS } from '../src/config.js';
import {
  analyzeConflicts,
  calculateTypeScores,
  mergeAndNormalizeVehicles,
  normalizeVehicle,
  rankVehicles,
  scoreVehicleDetailed
} from '../src/engine.js';

// 场景测试只验证排序与硬过滤；显式授权这些测试夹具，不能改变生产示例库的未核验状态。
const vehicles = mergeAndNormalizeVehicles(BASE_VEHICLES.map((vehicle) => ({ ...vehicle, recommendable: true })));

function rank(overrides, limit = 8) {
  const answers = { ...DEFAULT_ANSWERS, ...overrides };
  const scores = calculateTypeScores(answers);
  return { answers, scores, result: rankVehicles(vehicles, answers, scores, limit) };
}

test('六条关键路径：通勤新手低预算只保留低负担车型', () => {
  const { result } = rank({
    usage: 'commute',
    budget: 15000,
    experience: 'new',
    personality: 'practical',
    maintenance: 'low',
    ownership: 'low',
    looks: 'low',
    mod: 'none',
    power: 'low',
    road: 'city',
    commuteDistance: 'short',
    avoid: ['repair', 'heavy', 'expensive']
  });
  assert.ok(result.recommendations.length > 0);
  assert.ok(result.recommendations.every(({ vehicle }) => (
    vehicle.power !== 'high'
    && vehicle.maint !== 'high'
    && vehicle.cost !== 'high'
    && (!vehicle.weight || vehicle.weight <= 180)
  )));
});

test('六条关键路径：190cm撑场面用户主方向不是小踏板', () => {
  const { result } = rank({
    usage: 'status',
    budget: 65000,
    height: 190,
    weight: 95,
    experience: 'advanced',
    personality: 'style',
    looks: 'high',
    power: 'mid',
    parking: 'indoor'
  });
  assert.notEqual(result.primary, 'scooter');
  assert.equal(result.recommendations[0]?.vehicle.bodyScale, 'large');
});

test('六条关键路径：160cm轻体重摩旅用户不出现高座重型精确推荐', () => {
  const { result } = rank({
    usage: 'travel',
    budget: 40000,
    height: 160,
    weight: 55,
    experience: 'intermediate',
    personality: 'freedom',
    power: 'mid',
    road: 'bad',
    load: 'luggage',
    commuteDistance: 'weekend',
    parking: 'indoor',
    age: 'young'
  });
  assert.ok(result.recommendations.every(({ vehicle }) => (
    (!vehicle.seat || vehicle.seat < 810)
    && (!vehicle.weight || vehicle.weight <= 200)
  )));
  assert.ok(result.excluded.some(({ hardBlocks }) => hardBlocks.some((item) => item.includes('座高') || item.includes('身高体重'))));
});

test('六条关键路径：完全新手极端动力仍不出现高动力车型', () => {
  const { result } = rank({
    usage: 'status',
    budget: 65000,
    experience: 'new',
    personality: 'aggressive',
    power: 'extreme'
  });
  assert.ok(result.recommendations.every(({ vehicle }) => vehicle.power !== 'high'));
  assert.ok(result.excluded.some(({ hardBlocks }) => hardBlocks.some((item) => item.includes('完全新手'))));
});

test('六条关键路径：收藏模式低维护意愿给出明确冲突', () => {
  const { answers, result } = rank({
    usage: 'collect',
    budget: 65000,
    experience: 'advanced',
    personality: 'collector',
    maintenance: 'low',
    age: 'collector',
    power: 'mid',
    parking: 'indoor'
  });
  const conflicts = analyzeConflicts(answers, result.primary);
  assert.ok(conflicts.some((item) => item.includes('收藏老车却不愿维护')));
});

test('六条关键路径：露天停车排除高价值高关注度车型', () => {
  const { result } = rank({
    usage: 'status',
    budget: 130000,
    experience: 'advanced',
    personality: 'style',
    looks: 'high',
    power: 'high',
    parking: 'outdoor'
  });
  assert.ok(result.recommendations.every(({ vehicle }) => vehicle.parkingRisk !== 'high'));
  assert.ok(result.excluded.some(({ hardBlocks }) => hardBlocks.some((item) => item.includes('露天或临时停车'))));
});

test('六类一票否决都产生车型级硬排除', () => {
  const cases = [
    ['repair', { type: 'offroad', maint: 'high', power: 'mid', weight: 170, bodyScale: 'medium', cost: 'mid', warn: '维护频率高' }],
    ['hot', { type: 'sport', maint: 'mid', power: 'mid', weight: 170, bodyScale: 'medium', cost: 'mid', warn: '战斗坐姿与手腕负担明显' }],
    ['heavy', { type: 'street', maint: 'mid', power: 'mid', weight: 210, bodyScale: 'large', cost: 'mid', warn: '低速较重' }],
    ['short', { type: 'scooter', maint: 'mid', power: 'mid', weight: 130, bodyScale: 'small', cost: 'mid', warn: '车身紧凑' }],
    ['expensive', { type: 'street', maint: 'mid', power: 'mid', weight: 170, bodyScale: 'medium', cost: 'high', warn: '覆盖件贵' }],
    ['boring', { type: 'scooter', maint: 'low', power: 'low', weight: 130, bodyScale: 'small', cost: 'low', warn: '动力平顺' }]
  ];

  for (const [avoid, fields] of cases) {
    const answers = {
      ...DEFAULT_ANSWERS,
      usage: 'fun',
      budget: 100000,
      experience: 'intermediate',
      personality: 'practical',
      power: 'mid',
      age: 'young',
      avoid: [avoid]
    };
    const vehicle = mergeAndNormalizeVehicles([{
      brand: '测试',
      model: `${avoid}冲突车`,
      budget: [20000, 30000],
      seat: 780,
      year: 2025,
      recommendable: true,
      ...fields
    }])[0];
    const scores = calculateTypeScores(answers);
    const scored = scoreVehicleDetailed(vehicle, answers, scores, vehicle.type, 'street');
    assert.ok(scored.hardBlocks.length > 0, `${avoid} 应产生硬排除`);
  }
});

test('新手高动力街车与明确无ABS车型都被硬排除', () => {
  const answers = {
    ...DEFAULT_ANSWERS,
    usage: 'commute',
    experience: 'new',
    personality: 'practical',
    power: 'low',
    budget: 65000
  };
  const candidates = mergeAndNormalizeVehicles([
    { brand: '测试', model: '高动力街车', type: 'street', budget: [50000, 60000], seat: 790, weight: 190, year: 2025, power: 'high', beginnerFriendly: true, abs: true, recommendable: true },
    { brand: '测试', model: '无ABS入门车', type: 'street', budget: [10000, 15000], seat: 760, weight: 140, year: 2025, power: 'low', beginnerFriendly: true, abs: false, recommendable: true }
  ]);
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(candidates, answers, scores, 4);
  assert.equal(result.recommendations.length, 0);
  assert.equal(result.excluded.length, 2);
});

test('基础聚合示例的可信度不会伪装成已校准数据', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'intermediate', personality: 'practical', power: 'low' };
  const scores = calculateTypeScores(answers);
  const item = scoreVehicleDetailed(vehicles[0], answers, scores, 'scooter', 'street');
  assert.equal(item.vehicle.dataQuality, 'sample');
  assert.ok(item.vehicle.aggregateModel);
  assert.ok(item.confidence <= 45);
  assert.ok(item.warnings.some((warning) => warning.includes('聚合')));
});

test('采集缺价进入引擎后仍保持成本和动力待校准', () => {
  const vehicle = mergeAndNormalizeVehicles([{
    source: 'motofan_public_page',
    source_id: 'missing-price',
    brand: '测试',
    model: '待校准车型',
    type: 'street',
    budget: null,
    cost: null,
    power: null,
    seat: null,
    weight: null,
    year: null,
    status: '待校准'
  }])[0];
  assert.deepEqual(vehicle.budget, [0, 0]);
  assert.equal(vehicle.cost, null);
  assert.equal(vehicle.power, null);
  assert.equal(vehicle.beginnerFriendly, null);
});

test('公开候选的显式 null 不会再由价格猜成低成本、低维护或低动力', () => {
  const vehicle = normalizeVehicle({
    source: 'motofan_public_page',
    source_id: 'priced-unknowns',
    brand: '测试',
    model: '公开候选',
    type: 'scooter',
    budget: [5000, 12000],
    cost: null,
    maint: null,
    looks: null,
    power: null,
    dataQuality: 'public'
  });
  assert.equal(vehicle.cost, null);
  assert.equal(vehicle.maint, null);
  assert.equal(vehicle.looks, null);
  assert.equal(vehicle.power, null);
  assert.equal(vehicle.beginnerFriendly, null);
});
