import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCESSORY_CATEGORIES,
  REMINDER_CONFIG,
  accessoryResultCopy,
  categoryById,
  evaluateAccessory
} from '../src/accessories.js';

test('扩展包包含八个核心模块且每项都有细分问题', () => {
  assert.equal(ACCESSORY_CATEGORIES.length, 8);
  for (const id of ['helmet', 'gloves', 'armor', 'boots', 'luggage', 'lights', 'intercom', 'theft']) {
    const category = categoryById(id);
    assert.ok(category);
    assert.ok(category.questions.length >= 5);
  }
});

test('长途头盔结果强调风噪和长期佩戴', () => {
  const result = evaluateAccessory('helmet', {
    usage: 'touring', fit: 'unknown', priority: 'noise', style: 'stealth', budget: 'mid'
  });
  assert.match(result.headline, /摩旅|风噪/);
  assert.ok(result.priorities.some((item) => item.includes('试')));
  assert.ok(result.metrics.length >= 5);
});

test('赛道手套明确提示舒适和握持感代价', () => {
  const result = evaluateAccessory('gloves', {
    usage: 'track', protection: 'race', feel: 'thin', season: 'mild', style: 'race'
  });
  assert.match(result.headline, /赛道/);
  assert.match(result.feelNote, /握屎感/);
  assert.ok(result.tradeoffs.some((item) => /舒适|手感|操作/.test(item)));
  const comfort = result.metrics.find((item) => item.label === '舒适')?.value;
  const protection = result.metrics.find((item) => item.label === '防护')?.value;
  assert.ok(protection > comfort);
});

test('街道运动手套比纯赛道更兼顾舒适和抓握', () => {
  const result = evaluateAccessory('gloves', {
    usage: 'mountain', protection: 'roadSport', feel: 'balanced', season: 'mild', style: 'match'
  });
  assert.match(result.headline, /街道运动/);
  assert.match(result.feelNote, /不.*那么明显|更贴近日常/);
});

test('露天高价值车辆防盗结果升级为多层方案', () => {
  const result = evaluateAccessory('theft', {
    parking: 'outdoor', value: 'premium', anchor: 'no', convenience: 'full', look: 'visible'
  });
  assert.match(result.headline, /高风险|双定位|保障/);
  assert.ok(result.priorities.some((item) => item.includes('保障')));
});

test('非铺装大容量装载提醒软包和低重心', () => {
  const result = evaluateAccessory('luggage', {
    usage: 'camp', system: 'soft', road: 'offroad', volume: 'huge', look: 'adv'
  }, { primary: 'adv' });
  assert.match(result.headline, /软包|露营/);
  assert.ok(result.priorities.some((item) => item.includes('低位') || item.includes('软包')));
});

test('结果文案只有口播式橱窗提醒，不包含链接或购买按钮语义', () => {
  const category = categoryById('intercom');
  const result = evaluateAccessory('intercom', {
    group: 'pair', priority: 'talk', helmetFit: 'normal', operation: 'buttons', look: 'slim'
  });
  const text = accessoryResultCopy(category, result);
  assert.match(text, /顺便念一句/);
  assert.match(text, /抖音.*橱窗/);
  assert.doesNotMatch(text, /https?:\/\//);
  assert.doesNotMatch(text, /点击购买|立即购买|跳转/);
  assert.equal('shopUrl' in REMINDER_CONFIG, false);
});
