import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCT_CATALOG,
  catalogFacetsForCategory,
  catalogProductsForCategory,
  popularProductsForCategory,
  productCatalogStats,
  recommendProductLadder
} from '../src/product-catalog.js';
import { accessoryResultCopy, ACCESSORY_CATEGORIES, evaluateAccessory, REMINDER_CONFIG } from '../src/accessories.js';

const minimumCounts = { helmet:130, gloves:70, armor:110, boots:70, luggage:40, lights:30, intercom:75, theft:30 };

test('V6.5装备资料库覆盖八类，并把推荐候选与目录资料分层', () => {
  const stats = productCatalogStats();
  assert.ok(stats.total >= 580);
  assert.ok(stats.directoryOnly >= 380);
  assert.ok(stats.sourceCheckedCandidates >= 6);
  assert.ok(stats.withMarketSignal >= 22);
  for (const [category, minimum] of Object.entries(minimumCounts)) {
    assert.ok((stats.byCategory[category] || 0) >= minimum, category);
  }
});

test('完整目录能按头盔和服装类型筛选，资料库条目不进入自动推荐', () => {
  const advHelmets = catalogProductsForCategory('helmet', { type: 'adv' });
  const onePiece = catalogProductsForCategory('armor', { type: 'onePieceLeather' });
  assert.ok(advHelmets.length >= 10);
  assert.ok(onePiece.length >= 2);
  assert.ok(advHelmets.every((product) => product.fit.helmetType.includes('adv')));
  assert.ok(onePiece.every((product) => product.fit.garmentType.includes('onePieceLeather')));
  assert.ok(PRODUCT_CATALOG.filter((product) => product.catalogScope === 'directory').every((product) => product.recommendable === false));
});

test('八类目录都能按关键结构筛选，骑行裤不会混入网眼上衣', () => {
  for (const categoryId of ['helmet', 'gloves', 'armor', 'boots', 'luggage', 'lights', 'intercom', 'theft']) {
    assert.ok(catalogFacetsForCategory(categoryId).types.length > 0, categoryId);
  }
  const meshJackets = catalogProductsForCategory('armor', { type: 'meshJacket' });
  const pants = catalogProductsForCategory('armor', { type: 'ridingPants' });
  assert.ok(meshJackets.every((product) => !/裤|pants/i.test(product.model)), '夏季网眼上衣不能混入裤装');
  assert.ok(pants.length >= 8 && pants.every((product) => product.fit.garmentType.includes('ridingPants')));
});

test('店铺或类目来源不冒充逐型号在售证据，历史盔型只供资料库浏览', () => {
  const historicHjc = PRODUCT_CATALOG.find((product) => product.categoryId === 'helmet' && product.model.startsWith('i70'));
  assert.equal(historicHjc?.recordType, 'archived');
  assert.equal(historicHjc?.recommendable, false);
  const sourceChecked = PRODUCT_CATALOG.filter((product) => product.catalogScope === 'source-checked-candidate');
  assert.ok(sourceChecked.every((product) => product.recommendable
    && product.recordType === 'exact'
    && product.cnEvidenceTier === 'cn_exact_public'
    && product.sourceUrl
    && /^\d{4}-\d{2}-\d{2}$/.test(product.sourceCheckedAt)));
});

test('公开榜单和价格页只作出现快照，不能越过中文具体型号资料进入默认推荐', () => {
  const snapshots = PRODUCT_CATALOG.filter((product) => product.cnEvidenceTier === 'cn_sku_snapshot');
  assert.ok(snapshots.length >= 20);
  assert.ok(snapshots.every((product) => product.recommendable === false));
  assert.ok(snapshots.every((product) => product.selectionEligible === true || product.recordType !== 'exact'));
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

test('赛道手套答案冲突时不会用城市手套冒充安全替代', () => {
  const ladder = recommendProductLadder('gloves', { usage:'track', protection:'urban', feel:'balanced', season:'mild', style:'stealth' });
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('track') && entry.product.fit.protection.includes('race')));
});

test('非铺装箱包不会跨场景推荐城市尾箱', () => {
  const ladder = recommendProductLadder('luggage', { usage:'camp', system:'topbox', road:'offroad', volume:'large', look:'adv' });
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('camp') && entry.product.fit.system.includes('topbox') && entry.product.fit.road.includes('offroad')));
});

test('载人装载不会推荐未保留乘客空间的系统', () => {
  const ladder = recommendProductLadder('luggage', { usage:'passenger', system:'hard3', road:'offroad', volume:'huge', look:'clean' });
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('passenger')));
});

test('同一产品家族不会在候选阶梯或目录参考中重复出现', () => {
  const cases = [
    recommendProductLadder('lights', { usage:'fog', beam:'spot', electric:'ready', control:'split', look:'performance' }).items,
    recommendProductLadder('luggage', { usage:'touring', system:'hard3', road:'highway', volume:'large', look:'adv' }).items,
    popularProductsForCategory('lights', 13),
    popularProductsForCategory('luggage', 13)
  ];
  for (const productsOrEntries of cases) {
    const products = productsOrEntries.map((entry) => entry.product || entry);
    assert.equal(new Set(products.map((product) => product.canonicalFamilyId)).size, products.length);
  }
});

test('六人以内的Q8不会进入大车队候选', () => {
  const q8 = PRODUCT_CATALOG.find((product) => product.id === 'intercom-ejeas-q8');
  assert.deepEqual(q8.fit.group, ['small']);
  const ladder = recommendProductLadder('intercom', { group:'large', priority:'talk', helmetFit:'normal', operation:'buttons', look:'tech' });
  assert.ok(ladder.items.every((entry) => entry.product.id !== q8.id));
});

test('赛道骑行服不会为了补足数量跨到非赛道结构', () => {
  const ladder = recommendProductLadder('armor', { usage:'track', climate:'mild', wearing:'full', look:'leather', priority:'weak' });
  assert.ok(ladder.items.length >= 1 && ladder.items.length <= 3);
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('track')));
});

test('城市辅助灯即使误选泛光也只给有截止的公路方向', () => {
  const ladder = recommendProductLadder('lights', { usage:'city', beam:'flood', electric:'unknown', control:'simple', look:'hidden' });
  assert.ok(ladder.items.length >= 1);
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('city') && entry.product.fit.beam.includes('cutoff')));
});

test('辅助灯不会跨越公路、雨雾和越野用途硬推不相干光型', () => {
  const cases = [
    { usage:'touring', beam:'flood', electric:'ready', control:'split', look:'performance' },
    { usage:'fog', beam:'flood', electric:'ready', control:'split', look:'performance' },
    { usage:'offroad', beam:'cutoff', electric:'ready', control:'split', look:'performance' }
  ];
  for (const answers of cases) {
    const ladder = recommendProductLadder('lights', answers);
    assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes(answers.usage)), answers.usage);
    assert.ok(ladder.items.every((entry) => entry.product.fit.beam.includes(answers.beam)), answers.beam);
  }
});

test('没有日期化市场快照的目录项不会冒用热卖或榜单文案', () => {
  const unsupported = PRODUCT_CATALOG.filter((product) => !product.marketSignal);
  for (const product of unsupported) {
    assert.doesNotMatch(`${product.sourceType} ${product.reviewSummary}`, /热卖|排行|热门|热度|TOP\s*\d|销量|售出|评论量/i, product.id);
  }
});

test('无市场快照的人工热度分不会影响推荐或目录顺序', () => {
  const candidates = PRODUCT_CATALOG.filter((product) => product.categoryId === 'luggage' && !product.marketSignal);
  const originalScores = candidates.map((product) => product.popularityScore);
  const answers = { usage:'touring', system:'hard3', road:'highway', volume:'large', look:'adv' };
  try {
    candidates.forEach((product, index) => { product.popularityScore = index % 2 ? 1000 : -1000; });
    const firstOrder = recommendProductLadder('luggage', answers).items.map((entry) => entry.product.id);
    const firstDirectory = popularProductsForCategory('luggage', 10).map((product) => product.id);
    candidates.forEach((product, index) => { product.popularityScore = index % 2 ? -1000 : 1000; });
    assert.deepEqual(recommendProductLadder('luggage', answers).items.map((entry) => entry.product.id), firstOrder);
    assert.deepEqual(popularProductsForCategory('luggage', 10).map((product) => product.id), firstDirectory);
  } finally {
    candidates.forEach((product, index) => { product.popularityScore = originalScores[index]; });
  }
});

test('高价值露天防盗不把AirTag或基础碟刹锁作为首选', () => {
  const anchored = recommendProductLadder('theft', { parking:'outdoor', value:'premium', anchor:'yes', convenience:'full', look:'visible' });
  assert.equal(anchored.items[0].product.id, 'theft-layered');
  const noAnchor = recommendProductLadder('theft', { parking:'outdoor', value:'high', anchor:'no', convenience:'normal', look:'hidden' });
  assert.match(noAnchor.items[0].product.id, /theft-(abus-8077|xena-xx15|kovix-alarm)/);
  assert.ok(noAnchor.items.every((entry) => entry.product.fit.anchor.includes('no')));
  assert.notEqual(noAnchor.items[0].product.id, 'theft-apple-airtag');
  assert.notEqual(noAnchor.items[0].product.id, 'theft-disc-basic');
  assert.match(noAnchor.items[1]?.whyRelaxed || '', /互补防护层/);
  assert.match(noAnchor.intro, /组合|防护层/);
});

test('赛道头盔与入门预算冲突时明确标注而不假装精确匹配', () => {
  const ladder = recommendProductLadder('helmet', { usage:'track', fit:'unknown', priority:'weight', style:'race', budget:'entry' });
  assert.equal(ladder.exactEnough, false);
  assert.match(ladder.items[0].label, /超出预算/);
  assert.ok(ladder.items.every((entry) => entry.product.fit.usage.includes('track')));
});

test('头盔结果保留合规提醒和自然的购买提示', () => {
  const result = evaluateAccessory('helmet', { usage:'city', fit:'unknown', priority:'heat', style:'stealth', budget:'entry' });
  assert.ok(result.productLadder.items.some((entry) => entry.product.brand === 'SHOEI'));
  assert.ok(result.productLadder.items.every((entry) => entry.product.cnEvidenceTier === 'cn_exact_public'));
  assert.ok(result.productLadder.items.every((entry) => /GB 811-2022/.test(entry.product.complianceNote)));
  assert.doesNotMatch(REMINDER_CONFIG.spokenLine, /不跳链接|不要求购买|这里只是提醒|顺手支持/);
  assert.match(REMINDER_CONFIG.spokenLine, /骑不快的ZZ/);
  const helmetCategory = ACCESSORY_CATEGORIES.find((category) => category.id === 'helmet');
  const copy = accessoryResultCopy(helmetCategory, result);
  assert.match(copy, new RegExp(`候选（${result.productLadder.items.length}项）`));
  assert.match(copy, /记录类型：|国内状态：|合规提醒：.*GB 811-2022/);
});
