import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_CATALOG, popularProductsForCategory, recommendProductLadder } from '../src/product-catalog.js';

const categories = ['helmet','gloves','armor','boots','luggage','lights','intercom','theft'];

test('公开平台快照必须带日期和HTTPS来源', () => {
  const snapshots = PRODUCT_CATALOG.filter((product) => product.marketSignal);
  assert.ok(snapshots.length > 0);
  for (const product of snapshots) {
    assert.match(product.marketSignal.observedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(product.marketSignal.sourceUrl, /^https:\/\//);
  }
});

test('目录候选与公开热卖快照不会混用措辞', () => {
  for (const category of categories) {
    const items = popularProductsForCategory(category, 10);
    assert.ok(items.length <= 10);
    for (const product of items.filter((entry) => !entry.marketSignal)) {
      assert.doesNotMatch(product.sourceType, /热卖|排行|热门/);
    }
  }
});

test('SENA C30多人Mesh资料与官方页面一致', () => {
  const c30 = PRODUCT_CATALOG.find((product) => product.id === 'intercom-sena-c30');
  assert.equal(c30.officialUrl, 'https://senachina.com/product/c30/');
  assert.ok(c30.fit.group.includes('small'));
  assert.ok(c30.fit.group.includes('large'));
  assert.ok(c30.fit.priority.includes('talk'));
});

test('FODSPORTS FX2保留正式品牌名并删除无证据别名', () => {
  const fx2 = PRODUCT_CATALOG.find((product) => product.id === 'intercom-fodsports-fx2');
  assert.equal(fx2.brand, 'FODSPORTS');
  assert.deepEqual(fx2.aliases, []);
  assert.match(fx2.officialUrl, /fodsports\.com\/fx2/);
});

test('每档替代的tier不高于上一档', () => {
  const optionSets = {
    helmet: { usage:['city','touring','sport','track'], fit:['unknown'], priority:['noise'], style:['stealth'], budget:['entry','mid','high','premium'] },
    gloves: { usage:['city','touring','mountain','track'], protection:['urban','roadSport','touring','race'], feel:['balanced'], season:['mild'], style:['stealth'] },
    armor: { usage:['commute','touring','sport','track'], climate:['mild'], wearing:['normal','full'], look:['sport'], priority:['weak'] },
    boots: { usage:['city','touring','sport','track'], walk:['normal'], feel:['balanced'], weather:['no'], style:['sport'] },
    luggage: { usage:['commute','touring','camp','passenger'], system:['topbox','hard3','soft','seat'], road:['mixed'], volume:['medium'], look:['practical'] },
    lights: { usage:['city','touring','fog','offroad'], beam:['cutoff','spot','flood','combo'], electric:['basic'], control:['simple'], look:['factory'] },
    intercom: { group:['solo','pair','small','large'], priority:['nav','talk','music','call'], helmetFit:['normal'], operation:['buttons'], look:['tech'] },
    theft: { parking:['indoor','monitored','outdoor','uncertain'], value:['low','mid','high','premium'], anchor:['yes','no'], convenience:['normal'], look:['visible'] }
  };

  const expand = (entries, index = 0, answers = {}, output = []) => {
    if (index === entries.length) { output.push(answers); return output; }
    const [key, values] = entries[index];
    for (const value of values) expand(entries, index + 1, { ...answers, [key]: value }, output);
    return output;
  };

  for (const [category, dimensions] of Object.entries(optionSets)) {
    for (const answers of expand(Object.entries(dimensions))) {
      const tiers = recommendProductLadder(category, answers).items.map((entry) => entry.product.tier);
      for (let index = 1; index < tiers.length; index += 1) {
        assert.ok(tiers[index] <= tiers[index - 1], `${category} ${JSON.stringify(answers)}: ${tiers.join('>')}`);
      }
    }
  }
});
