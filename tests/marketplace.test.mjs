import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAccessory } from '../src/accessories.js';
import { isAggregateVehicle, marketplaceLinks, motofanLinks, safeGearImage, safeImage } from '../src/marketplace.js';
import { normalizeVehicle } from '../src/engine.js';

test('头盔入门预算保留具体候选，但通用建议不做品牌安全背书', () => {
  const result = evaluateAccessory('helmet', {
    usage: 'city', fit: 'unknown', priority: 'weight', style: 'stealth', budget: 'entry'
  });
  assert.match(result.brandHints.join(' '), /不构成安全或合规背书/);
  assert.doesNotMatch(result.brandHints.join(' '), /赛羽/);
  assert.match(result.priceWarning, /预算在1000元以内.*具体型号.*现行国内标准/);
  assert.doesNotMatch(result.priceWarning, /穷哥们|太便宜/);
  assert.match(result.budgetAdvice, /现行 GB 811-2022/);
  assert.deepEqual(result.referenceLinks.map((item) => item.label), ['国家标准 GB 811-2022（现行）']);
  assert.equal(result.referenceLinks[0].url, 'https://std.samr.gov.cn/gb/search/gbDetailed?id=F0ADFAAEF0811328E05397BE0A0AD5A4');
  assert.ok(result.searchKeywords.length >= 2);
});

test('装备结果生成三个平台比价入口', () => {
  const links = marketplaceLinks('街道运动手套 长护腕');
  assert.deepEqual(links.map((x) => x.id), ['jd', 'taobao', 'tmall']);
  links.forEach((link) => assert.match(link.url, /^https:\/\//));
});

test('车型公开图、来源页和搜索词可保留', () => {
  const vehicle = normalizeVehicle({
    brand: '测试品牌', model: '测试车型', type: 'street', budget: [10000, 15000],
    image_url: 'https://example.com/bike.jpg', source_url: 'https://m.58moto.com/garage/detail/1'
  });
  assert.equal(safeImage(vehicle), 'https://example.com/bike.jpg');
  const links = motofanLinks(vehicle);
  assert.equal(links.direct, 'https://m.58moto.com/garage/detail/1');
  assert.match(links.keyword, /测试品牌/);
});

test('detail_url 可直接成为摩托范详情入口', () => {
  const vehicle = normalizeVehicle({
    brand: '测试品牌', model: '详情车型', type: 'street', budget: [10000, 15000],
    detail_url: 'https://m.58moto.com/garage/detail/2'
  });
  assert.equal(motofanLinks(vehicle).direct, 'https://m.58moto.com/garage/detail/2');
});

test('无真实图时使用本地车型和装备方向图', () => {
  assert.match(safeImage({ type: 'adv' }), /assets\/vehicles\/adv\.svg/);
  assert.match(safeGearImage('gloves', {}), /assets\/gear\/gloves\.svg/);
});

test('组合车型即使带外部图也必须使用类别方向图', () => {
  const grouped = { model: '250SR / 450SR / 675SR', type: 'sport', image_url: 'https://example.com/450sr.jpg' };
  assert.equal(isAggregateVehicle(grouped), true);
  assert.match(safeImage(grouped), /assets\/vehicles\/sport\.svg/);
});

test('外部图只接受HTTPS且摩托范详情仅接受官方域名', () => {
  assert.match(safeImage({ type: 'street', image_url: 'javascript:alert(1)' }), /assets\/vehicles\/street\.svg/);
  assert.equal(motofanLinks({ brand: '测试', model: '车', sourceUrl: 'https://evil.example/detail/1' }).direct, '');
  assert.equal(motofanLinks({ brand: '测试', model: '车', sourceUrl: 'https://m.58moto.com/garage/detail/1' }).direct, 'https://m.58moto.com/garage/detail/1');
});
