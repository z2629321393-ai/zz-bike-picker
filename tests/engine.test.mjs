import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_ANSWERS } from '../src/config.js';
import { analyzeConflicts, calculateTypeScores, mergeAndNormalizeVehicles, rankVehicles } from '../src/engine.js';

const sampleVehicles = mergeAndNormalizeVehicles([
  { brand: '测试', model: '城市踏板', type: 'scooter', budget: [10000, 15000], seat: 740, weight: 125, year: 2025, cost: 'low', maint: 'low', power: 'low' },
  { brand: '测试', model: '中排街车', type: 'street', budget: [22000, 30000], seat: 790, weight: 180, year: 2025, cost: 'mid', maint: 'mid', power: 'mid' },
  { brand: '测试', model: '高座拉力', type: 'adv', budget: [35000, 45000], seat: 870, weight: 220, year: 2025, cost: 'mid', maint: 'mid', power: 'mid' },
  { brand: '测试', model: '高性能仿赛', type: 'sport', budget: [55000, 65000], seat: 820, weight: 195, year: 2025, cost: 'high', maint: 'high', power: 'high', beginnerFriendly: false }
]);

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

test('新手极端动力应产生冲突提示', () => {
  const answers = { ...DEFAULT_ANSWERS, usage: 'commute', experience: 'new', power: 'extreme', personality: 'aggressive' };
  const conflicts = analyzeConflicts(answers, 'sport');
  assert.ok(conflicts.some((item) => item.includes('完全新手')));
});
