import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_CATALOG, productCatalogStats, recommendProductLadder } from '../src/product-catalog.js';
import { evaluateAccessory, REMINDER_CONFIG } from '../src/accessories.js';

const expectedCounts = { helmet:25, gloves:20, armor:21, boots:19, luggage:13, lights:13, intercom:47, theft:10 };

test('V6.4装备目录保持168条且八类计数准确', () => {
  const stats = productCatalogStats();
  assert.equal(stats.total, 168);
  assert.deepEqual(stats.byCategory, expectedCounts);
  assert.equal(stats.withMarketSignal, 22);
});

test('品牌型号规范化后没有重复记录', () => {
  const keys = PRODUCT_CATALOG.map((product) => `${product.brand}|${product.model}`.toLowerCase().replace(/[\s\-–—_/]+/g, ''));
  assert.equal(new Set(keys).size, keys.length);
});

test('缺少直接SKU证据的渠道型号保留记录但不会进入推荐', () => {
  const disabled = ['intercom-hengjiang-a50pro','intercom-hengjiang-c50pro','intercom-hengjiang-s1pro','intercom-hengjiang-s1prosa','intercom-asmax-s1pro'];
  for (const id of disabled) assert.equal(PRODUCT_CATALOG.find((product) => product.id === id)?.recommendable, false, id);
  const ladderIds = recommendProductLadder('intercom', { group:'large', priority:'talk', helmetFit:'normal', operation:'voice', look:'tech' }).items.map((entry) => entry.product.id);
  assert.ok(disabled.every((id) => !ladderIds.includes(id)));
});

test('赛道装备不会降档成通勤装备', () => {
  const cases = [
    ['gloves', { usage:'track', protection:'race', feel:'protectFirst', season:'mild', style:'race' }, ['protection', 'race']],
    ['armor', { usage:'track', climate:'mild', wearing:'full', look:'leather', priority:'weak' }, ['usage', 'track']],
    ['boots', { usage:'track', walk:'little', feel:'protect', weather:'no', style:'sport' }, ['usage', 'track']]
  ];
  for (const [category, answers, [key, value]] of cases) {
    const ladder = recommendProductLadder(category, answers);
    assert.ok(ladder.items.length >= 1, category);
    assert.ok(ladder.items.every((entry) => entry.product.fit[key].includes(value)), category);
  }
});

test('没有安全替代时允许少于三项而不凑数', () => {
  const ladder = recommendProductLadder('armor', { usage:'track', climate:'mild', wearing:'full', look:'leather', priority:'weak' });
  assert.equal(ladder.items.length, 1);
  assert.match(ladder.intro, /不补入不适用|只有1项/);
});

test('城市辅助灯即使误选泛光也只给有截止的公路方向', () => {
  const ladder = recommendProductLadder('lights', { usage:'city', beam:'flood', electric:'unknown', control:'simple', look:'hidden' });
  assert.ok(ladder.items.length >= 1);
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('city') && entry.product.fit.beam.includes('cutoff')));
});

test('高价值露天防盗不把AirTag或基础碟刹锁作为首选', () => {
  const anchored = recommendProductLadder('theft', { parking:'outdoor', value:'premium', anchor:'yes', convenience:'full', look:'visible' });
  assert.equal(anchored.items[0].product.id, 'theft-layered');
  const noAnchor = recommendProductLadder('theft', { parking:'outdoor', value:'high', anchor:'no', convenience:'normal', look:'hidden' });
  assert.notEqual(noAnchor.items[0].product.id, 'theft-apple-airtag');
  assert.notEqual(noAnchor.items[0].product.id, 'theft-disc-basic');
  assert.match(noAnchor.items[1]?.whyRelaxed || '', /互补防护层/);
});

test('赛道头盔与入门预算冲突时明确标注而不假装精确匹配', () => {
  const ladder = recommendProductLadder('helmet', { usage:'track', fit:'unknown', priority:'weight', style:'race', budget:'entry' });
  assert.equal(ladder.exactEnough, false);
  assert.match(ladder.items[0].label, /超出预算/);
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('track')));
});

test('头盔结果保留合规提醒和自然的购买提示', () => {
  const result = evaluateAccessory('helmet', { usage:'city', fit:'unknown', priority:'heat', style:'stealth', budget:'entry' });
  assert.ok(result.productLadder.items.some((entry) => /赛羽|HJC|LS2/.test(entry.product.brand)));
  assert.ok(result.productLadder.items.every((entry) => /GB 811-2022/.test(entry.product.complianceNote)));
  assert.doesNotMatch(REMINDER_CONFIG.spokenLine, /不跳链接|不要求购买|这里只是提醒|顺手支持/);
  assert.match(REMINDER_CONFIG.spokenLine, /骑不快的ZZ/);
});
