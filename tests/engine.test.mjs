import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_ANSWERS } from '../src/config.js';
import {
  analyzeConflicts,
  calculateTypeScores,
  mergeAndNormalizeVehicles,
  rankVehicles,
  scoreVehicleDetailed
} from '../src/engine.js';

const sampleVehicles = mergeAndNormalizeVehicles([
  { brand: '测试', model: '城市踏板', type: 'scooter', budget: [10000, 15000], seat: 740, weight: 125, year: 2025, cost: 'low', maint: 'low', power: 'low' },
  { brand: '测试', model: '中排街车', type: 'street', budget: [22000, 30000], seat: 790, weight: 180, year: 2025, cost: 'mid', maint: 'mid', power: 'mid' },
  { brand: '测试', model: '高座拉力', type: 'adv', budget: [35000, 45000], seat: 870, weight: 220, year: 2025, cost: 'mid', maint: 'mid', power: 'mid' },
  { brand: '测试', model: '高性能仿赛', type: 'sport', budget: [55000, 65000], seat: 820, weight: 195, year: 2025, cost: 'high', maint: 'high', power: 'high', beginnerFriendly: false },
  { brand: '测试', model: '手续问题车', type: 'collector', budget: [8000, 12000], seat: 760, weight: 160, year: 2018, status: '无手续水车/报废车', cost: 'high', maint: 'high', power: 'mid' },
  { brand: '测试', model: '高价值收藏车', type: 'collector', budget: [85000, 120000], seat: 790, weight: 190, year: 2016, status: '停产/二手/收藏', cost: 'high', maint: 'high', power: 'mid' }
].map((vehicle) => ({ ...vehicle, recommendable: true })));

test('通勤新手应优先踏板或街车', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'new', personality: 'practical', power: 'low' };
  const scores = calculateTypeScores(answers);
  assert.ok(scores.scooter > scores.sport);
  const result = rankVehicles(sampleVehicles, answers, scores, 3);
  assert.equal(result.recommendations[0].vehicle.type, 'scooter');
});

test('矮个新手不应推荐高座拉力作为精确车型', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'travel', experience: 'new', personality: 'freedom', power: 'mid', height: 158, budget: 40000 };
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(sampleVehicles, answers, scores, 4);
  assert.equal(result.recommendations.some((item) => item.vehicle.model === '高座拉力'), false);
});

test('160cm轻体重用户不应推荐高座重型ADV作为精确车型', () => {
  const answers = {
    ...DEFAULT_ANSWERS,
    usage: 'travel',
    experience: 'intermediate',
    personality: 'freedom',
    power: 'mid',
    height: 160,
    weight: 55,
    budget: 40000
  };
  const vehicle = mergeAndNormalizeVehicles([
    { brand: '测试', model: '高座重型ADV', type: 'adv', budget: [30000, 40000], seat: 820, weight: 210, year: 2025, cost: 'mid', maint: 'mid', power: 'mid', recommendable: true }
  ])[0];
  const scores = calculateTypeScores(answers);
  const scored = scoreVehicleDetailed(vehicle, answers, scores, 'adv', 'street');
  assert.ok(scored.hardBlocks.some((item) => item.includes('座高') || item.includes('身高体重')));
});

test('新手极端动力应产生冲突提示', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'new', power: 'extreme', personality: 'aggressive' };
  const conflicts = analyzeConflicts(answers, 'sport');
  assert.ok(conflicts.some((item) => item.includes('完全新手')));
});

test('188cm以上撑场面用户不应被小踏板方向压过巡航方向', () => {
  const answers = {
    ...DEFAULT_ANSWERS,
    usage: 'status',
    personality: 'style',
    looks: 'high',
    height: 190,
    weight: 95,
    budget: 65000
  };
  const scores = calculateTypeScores(answers);
  assert.ok(scores.cruiser > scores.scooter);
});

test('完全新手不应推荐高动力低容错车型', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'status', experience: 'new', personality: 'aggressive', power: 'extreme', budget: 70000 };
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(sampleVehicles, answers, scores, 4);
  assert.equal(result.recommendations.some((item) => item.vehicle.model === '高性能仿赛'), false);
});

test('完全新手把重车列为一票否决后不应推荐190kg通勤车', () => {
  const answers = {
    ...DEFAULT_ANSWERS,
    usage: 'commute',
    experience: 'new',
    personality: 'practical',
    power: 'low',
    avoid: ['heavy']
  };
  const vehicles = mergeAndNormalizeVehicles([
    { brand: '测试', model: '轻量通勤车', type: 'scooter', budget: [12000, 18000], seat: 750, weight: 145, year: 2025, cost: 'low', maint: 'low', power: 'low', recommendable: true },
    { brand: '测试', model: '重型通勤车', type: 'scooter', budget: [18000, 24000], seat: 755, weight: 190, year: 2025, cost: 'low', maint: 'low', power: 'low', recommendable: true }
  ]);
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(vehicles, answers, scores, 4);
  assert.equal(result.recommendations.some((item) => item.vehicle.model === '重型通勤车'), false);
  assert.equal(result.recommendations.some((item) => item.vehicle.model === '轻量通勤车'), true);
});

test('手续或上路状态异常的车辆不进入推荐', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'collect', experience: 'advanced', personality: 'collector', power: 'mid', budget: 50000, age: 'collector' };
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(sampleVehicles, answers, scores, 4);
  assert.equal(result.recommendations.some((item) => item.vehicle.model === '手续问题车'), false);
});

test('公开目录或待审核车型即使分数很高也不进入推荐', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'intermediate', personality: 'practical', power: 'low', budget: 18000 };
  const vehicles = mergeAndNormalizeVehicles([{
    brand: '测试',
    model: '待审核高分踏板',
    type: 'scooter',
    budget: [10000, 15000],
    seat: 740,
    weight: 125,
    year: 2026,
    cost: 'low',
    maint: 'low',
    power: 'low',
    recommendable: false
  }]);
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(vehicles, answers, scores, 4);
  assert.equal(result.recommendations.length, 0);
  assert.ok(result.excluded[0].hardBlocks.includes('车型尚未通过推荐资格审核'));
});

test('未显式获得推荐资格的车型默认被阻断', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'intermediate', personality: 'practical', power: 'low', budget: 18000 };
  const vehicles = mergeAndNormalizeVehicles([{
    brand: '测试', model: '缺少审核字段的踏板', type: 'scooter', budget: [10000, 15000],
    seat: 740, weight: 125, year: 2026, cost: 'low', maint: 'low', power: 'low'
  }]);
  const scores = calculateTypeScores(answers);
  const result = rankVehicles(vehicles, answers, scores, 4);
  assert.equal(result.recommendations.length, 0);
  assert.ok(result.excluded[0].hardBlocks.includes('车型尚未通过推荐资格审核'));
});

test('收藏模式与低维护意愿应明确提示冲突', () => {
  const answers = {
    ...DEFAULT_ANSWERS,
    usage: 'collect',
    personality: 'collector',
    age: 'collector',
    maintenance: 'low'
  };
  const conflicts = analyzeConflicts(answers, 'collector');
  assert.ok(conflicts.some((item) => item.includes('收藏老车却不愿维护')));
});

test('露天停车会排除高价值高关注度收藏车型', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'collect', experience: 'advanced', personality: 'collector', power: 'mid', budget: 130000, age: 'collector', parking: 'outdoor' };
  const scores = calculateTypeScores(answers);
  const scored = scoreVehicleDetailed(sampleVehicles.find((vehicle) => vehicle.model === '高价值收藏车'), answers, scores, 'collector', 'retro');
  assert.ok(scored.hardBlocks.some((item) => item.includes('露天或临时停车')));
});
