import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCESSORY_CATEGORIES,
  REMINDER_CONFIG,
  accessorySelectionItems,
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

test('装备问卷明确覆盖用途、类型、适配与风格，而不只问一个笼统偏好', () => {
  const requiredByCategory = {
    helmet: ['usage', 'helmetType', 'headSize', 'fit', 'style'],
    gloves: ['usage', 'protection', 'handFit', 'style'],
    armor: ['usage', 'garmentType', 'garmentFocus', 'bodyFit', 'look'],
    boots: ['usage', 'footWidth', 'calfFit', 'style'],
    luggage: ['usage', 'system', 'road', 'look'],
    lights: ['usage', 'beam', 'electric', 'look'],
    intercom: ['group', 'priority', 'helmetFit', 'look'],
    theft: ['parking', 'anchor', 'convenience', 'look']
  };
  for (const [categoryId, ids] of Object.entries(requiredByCategory)) {
    const category = categoryById(categoryId);
    const questionIds = category.questions.map((question) => question.id);
    assert.ok(category.questions.every((question) => question.stage), `${categoryId} questions need a visible decision stage`);
    for (const id of ids) assert.ok(questionIds.includes(id), `${categoryId} should include ${id}`);
  }
});

test('头盔和骑行服结果回显类型、尺码/版型等实际筛选条件', () => {
  const helmetAnswers = {
    usage: 'touring', helmetType: 'adv', headSize: '57to58', fit: 'neutral', priority: 'noise', style: 'retro', budget: 'mid'
  };
  const helmet = evaluateAccessory('helmet', helmetAnswers);
  assert.match(helmet.headline, /拉力\/ADV/);
  assert.match(helmet.selectionSummary, /盔型 \/ 类型：拉力盔 \/ ADV盔/);
  assert.match(helmet.selectionSummary, /头围 \/ 尺码：57—58cm/);
  assert.ok(accessorySelectionItems('helmet', helmetAnswers).some((item) => item.questionId === 'helmetType'));

  const armor = evaluateAccessory('armor', {
    usage: 'sport', garmentType: 'twoPieceLeather', garmentFocus: 'sportRoad', climate: 'mild', bodyFit: 'broad', wearing: 'full', look: 'sport', priority: 'weak'
  });
  assert.match(armor.headline, /分体皮衣/);
  assert.match(armor.selectionSummary, /服装类型：分体皮衣 \/ 街道运动皮裤/);
  assert.match(armor.selectionSummary, /体型 \/ 版型：肩背宽/);
  assert.ok(armor.selectionItems.some((item) => item.questionId === 'bodyFit' && item.label.includes('肩背宽')));
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
  assert.match(result.feelNote, /厚重|隔离感/);
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
  assert.match(result.headline, /高风险.*无固定锚点|轮体机械阻碍/);
  assert.ok(result.priorities.some((item) => /定位.*不能替代实体阻碍/.test(item)));
  assert.ok(result.priorities.every((item) => !/重链连接.*固定物/.test(item)));
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
  assert.match(text, /购买渠道提醒/);
  assert.match(text, /抖音.*橱窗/);
  assert.match(text, /橱窗属于作者自有推广.*不参与本站推荐排序/);
  assert.doesNotMatch(text, /https?:\/\//);
  assert.doesNotMatch(text, /点击购买|立即购买|跳转/);
  assert.equal('shopUrl' in REMINDER_CONFIG, false);
});
