import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_VEHICLES } from '../data/base-vehicles.js';
import { DEFAULT_ANSWERS } from '../src/config.js';
import {
  calculateTypeScores,
  mergeAndNormalizeVehicles,
  normalizeVehicle,
  rankVehicles,
  scoreVehicleDetailed
} from '../src/engine.js';

function answers(overrides = {}) {
  return {
    ...DEFAULT_ANSWERS,
    usage: 'commute',
    experience: 'intermediate',
    personality: 'practical',
    power: 'mid',
    age: 'young',
    ...overrides
  };
}

function score(rawVehicle, answerOverrides = {}) {
  const profile = answers(answerOverrides);
  const vehicle = normalizeVehicle({
    brand: '安全回归',
    model: '测试车型',
    type: 'street',
    budget: [15000, 22000],
    seat: 780,
    weight: 170,
    year: 2025,
    status: '在售',
    cost: 'mid',
    maint: 'mid',
    power: 'mid',
    abs: true,
    ...rawVehicle
  });
  const typeScores = calculateTypeScores(profile);
  return scoreVehicleDetailed(vehicle, profile, typeScores, vehicle.type, 'scooter');
}

test('未设置 recommendable 的基础车型仍可进入推荐', () => {
  const profile = answers();
  const vehicles = mergeAndNormalizeVehicles([{
    brand: '安全回归',
    model: '普通在售街车',
    type: 'street',
    budget: [15000, 22000],
    seat: 780,
    weight: 170,
    year: 2025,
    status: '在售',
    cost: 'mid',
    maint: 'mid',
    power: 'mid',
    abs: true
  }]);
  const result = rankVehicles(vehicles, profile, calculateTypeScores(profile));

  assert.equal(vehicles[0].recommendable, null);
  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0].vehicle.model, '普通在售街车');
});

test('现有 33 条基础方向车型无需资格标记也能参与安全筛选', () => {
  const profile = answers({ power: 'low' });
  const vehicles = mergeAndNormalizeVehicles(BASE_VEHICLES);
  const result = rankVehicles(vehicles, profile, calculateTypeScores(profile), 8);

  assert.equal(vehicles.length, 33);
  assert.ok(result.recommendations.length > 0);
  assert.equal(result.allScored.some((item) => item.hardBlocks.includes('车型尚未通过推荐资格审核')), false);
});

test('水车、报废、无手续与不建议上路状态均为硬阻断', () => {
  for (const status of ['无手续水车', '已报废', '手续不清', '来源不明', '不建议上路', '仅内容分支']) {
    const result = score({ model: status, status });
    assert.ok(
      result.hardBlocks.some((item) => item.includes('手续或上路状态')),
      `${status} 应被硬阻断`
    );
  }
});

test('完全新手的高动力车型和明确无 ABS 车型均为硬阻断', () => {
  const newRider = { experience: 'new' };
  const highPower = score({ model: '高动力车', power: 'high', abs: true }, newRider);
  const noAbs = score({ model: '无ABS车', power: 'low', abs: false }, newRider);

  assert.ok(highPower.hardBlocks.some((item) => item.includes('完全新手')));
  assert.ok(noAbs.hardBlocks.some((item) => item.includes('缺少ABS')));
});

test('矮小轻体重与高座、重车组合均为硬阻断', () => {
  const smallRider = { height: 160, weight: 55, experience: 'intermediate' };
  const highSeat = score({ model: '高座车', seat: 820, weight: 180 }, smallRider);
  const heavyBike = score({ model: '低座重车', seat: 770, weight: 205 }, smallRider);

  assert.ok(highSeat.hardBlocks.some((item) => item.includes('座高')));
  assert.ok(heavyBike.hardBlocks.some((item) => item.includes('身高体重')));
});

test('露天停车与高价值高关注度用途组合为硬阻断', () => {
  const result = score(
    { model: '高价值车', parkingRisk: 'high', cost: 'high' },
    { usage: 'status', parking: 'outdoor', budget: 100000 }
  );
  assert.ok(result.hardBlocks.some((item) => item.includes('露天或临时停车')));
});

test('六类 avoid 一票否决都产生硬阻断', () => {
  const cases = [
    ['repair', { maint: 'high' }],
    ['hot', { type: 'sport', warn: '战斗坐姿与热量明显' }],
    ['heavy', { weight: 210 }],
    ['short', { bodyScale: 'small' }],
    ['expensive', { cost: 'high' }],
    ['boring', { type: 'scooter', power: 'low' }]
  ];

  for (const [avoid, fields] of cases) {
    const result = score({ model: `${avoid}冲突车`, ...fields }, { avoid: [avoid] });
    assert.ok(result.hardBlocks.some((item) => item.includes('一票否决')), `${avoid} 应被硬阻断`);
  }
});

test('聚合车型自动识别，保留图片字段且可信度最高 45', () => {
  const vehicle = normalizeVehicle({
    brand: '安全回归',
    model: '250SR / 450SR / 675SR',
    type: 'sport',
    budget: [18000, 60000],
    seat: 795,
    weight: 190,
    year: 2025,
    source: 'brand_official',
    image_url: 'https://example.com/direction.svg',
    image_source_url: 'https://example.com/source'
  });
  const result = scoreVehicleDetailed(
    vehicle,
    answers({ usage: 'fun', budget: 80000 }),
    { scooter: 0, street: 0, sport: 20, adv: 0, cruiser: 0, retro: 0, offroad: 0, collector: 0 },
    'sport',
    'street'
  );

  assert.equal(vehicle.aggregateModel, true);
  assert.equal(vehicle.image, 'https://example.com/direction.svg');
  assert.equal(vehicle.imageSourceUrl, 'https://example.com/source');
  assert.equal(result.confidence, 45);
  assert.ok(result.warnings.some((item) => item.includes('聚合')));
});
