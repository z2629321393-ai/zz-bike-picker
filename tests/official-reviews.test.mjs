import test from 'node:test';
import assert from 'node:assert/strict';
import {
  auditOfficialReviews,
  renderVerifiedModule,
  toPublicVerifiedVehicle
} from '../scripts/check-official-reviews.mjs';

const NOW = '2026-07-17';

function makeEntry(overrides = {}) {
  const entry = {
    reviewId: 'cfmoto-450nk-standard-2026',
    identity: {
      manufacturer: '浙江春风动力股份有限公司',
      brand: '春风',
      modelName: '450NK',
      trimName: '标准版',
      modelYear: 2026,
      modelCode: 'CF400-8',
      approvalRoute: 'domestic',
      vehicleClass: 'motorcycle',
      propulsion: 'ice',
      displacementCc: 449
    },
    marketStatus: 'officially_available',
    roadApprovalStatus: 'approved',
    evidence: {
      market: [{
        sourceTitle: '春风官网 450NK 具体车型页',
        url: 'https://www.cfmoto.com/motorcycles/450nk',
        checkedAt: '2026-07-10',
        modelCode: 'CF400-8',
        scope: 'china_availability'
      }],
      miit: [{
        sourceTitle: '工信部道路机动车辆产品公告',
        url: 'https://www.miit.gov.cn/zwgk/zcwj/wjfb/gg/art/2026/example.html',
        checkedAt: '2026-07-10',
        modelCode: 'CF400-8',
        recordType: 'domestic_product_announcement',
        referenceId: '第406批-CF400-8'
      }],
      ccc: [{
        sourceTitle: '国家认监委CCC证书查询',
        url: 'https://cx.cnca.cn/CertECloud/result/2026011100000001',
        checkedAt: '2026-07-10',
        modelCode: 'CF400-8',
        certificateNumber: '2026011100000001',
        certificateStatus: 'valid'
      }]
    },
    recommendationData: {
      category: 'street',
      priceCny: { min: 26980, max: 26980 },
      seatHeightMm: 795,
      curbWeightKg: 173,
      abs: true,
      ratedPowerKw: 37,
      powerClass: null
    },
    reviewStatus: 'approved',
    reviewedAt: '2026-07-11',
    reviewer: '内部双人复核'
  };
  return {
    ...entry,
    ...overrides,
    identity: { ...entry.identity, ...(overrides.identity || {}) },
    evidence: {
      ...entry.evidence,
      ...(overrides.evidence || {})
    },
    recommendationData: overrides.recommendationData === undefined
      ? entry.recommendationData
      : overrides.recommendationData
  };
}

function auditEntries(entries) {
  return auditOfficialReviews({ schemaVersion: 2, asOf: NOW, entries }, { now: NOW });
}

test('只有双状态、双证据和人工复核均有效的具体版本进入白名单', () => {
  const entry = makeEntry();
  const audit = auditEntries([entry]);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.recommendableEntries.length, 1);
  const published = toPublicVerifiedVehicle(entry);
  assert.equal(published.recommendable, true);
  assert.equal(published.model_code, 'CF400-8');
  assert.equal(published.type, 'street');
  assert.deepEqual(published.budget, [26980, 26980]);
  assert.equal(published.abs, true);
  assert.equal(published.power, 'high');
  assert.equal(own(published, 'reviewer'), false);
  assert.deepEqual(Object.keys(published.source_urls).sort(), ['ccc', 'market', 'miit']);
  assert.match(renderVerifiedModule({ schemaVersion: 2, asOf: NOW, entries: [entry] }, [entry]), /VERIFIED_VEHICLES/);
});

test('账本禁止人工填写 recommendable', () => {
  const audit = auditEntries([{ ...makeEntry(), recommendable: true }]);
  assert.ok(audit.errors.some((message) => message.includes('禁止手填')));
  assert.equal(audit.recommendableEntries.length, 0);
});

test('pending 审核状态被阻断', () => {
  const audit = auditEntries([makeEntry({ reviewStatus: 'pending', reviewedAt: null, reviewer: null })]);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.decisions[0].recommendable, false);
  assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('pending')));
});

test('停售和大陆未引进均被阻断', () => {
  for (const marketStatus of ['discontinued', 'not_introduced']) {
    const audit = auditEntries([makeEntry({ marketStatus })]);
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.recommendableEntries.length, 0);
    assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes(marketStatus)));
  }
});

test('缺少工信部或CCC任一类证据都被阻断', () => {
  const missingMiit = auditEntries([makeEntry({ evidence: { miit: [] } })]);
  assert.deepEqual(missingMiit.errors, []);
  assert.equal(missingMiit.recommendableEntries.length, 0);
  assert.ok(missingMiit.decisions[0].blockers.includes('缺少工信部准入记录'));

  const missingCcc = auditEntries([makeEntry({ evidence: { ccc: [] } })]);
  assert.deepEqual(missingCcc.errors, []);
  assert.equal(missingCcc.recommendableEntries.length, 0);
  assert.ok(missingCcc.decisions[0].blockers.includes('缺少CCC证书记录'));
});

test('证据或人工复核过期后自动退出白名单', () => {
  const entry = makeEntry({
    reviewedAt: '2026-01-01',
    evidence: {
      market: [{
        sourceTitle: '春风官网 450NK 具体车型页',
        url: 'https://www.cfmoto.com/motorcycles/450nk',
        checkedAt: '2026-01-01',
        modelCode: 'CF400-8',
        scope: 'china_availability'
      }],
      miit: [{
        sourceTitle: '工信部道路机动车辆产品公告',
        url: 'https://www.miit.gov.cn/zwgk/zcwj/wjfb/gg/art/2026/example.html',
        checkedAt: '2026-01-01',
        modelCode: 'CF400-8',
        recordType: 'domestic_product_announcement',
        referenceId: '第400批-CF400-8'
      }],
      ccc: [{
        sourceTitle: '国家认监委CCC证书查询',
        url: 'https://cx.cnca.cn/CertECloud/result/2026011100000001',
        checkedAt: '2026-01-01',
        modelCode: 'CF400-8',
        certificateNumber: '2026011100000001',
        certificateStatus: 'valid'
      }]
    }
  });
  const audit = auditEntries([entry]);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.recommendableEntries.length, 0);
  assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('中国官网在售证据已超过')));
  assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('工信部证据已超过')));
  assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('CCC证据已超过')));
});

test('无效CCC状态和CCC错域都不能通过', () => {
  const revoked = makeEntry().evidence.ccc.map((item) => ({ ...item, certificateStatus: 'revoked' }));
  const invalidStatus = auditEntries([makeEntry({ evidence: { ccc: revoked } })]);
  assert.deepEqual(invalidStatus.errors, []);
  assert.equal(invalidStatus.recommendableEntries.length, 0);
  assert.ok(invalidStatus.decisions[0].blockers.includes('没有状态为 valid 的CCC证书'));

  const wrongDomain = makeEntry().evidence.ccc.map((item) => ({
    ...item,
    url: 'https://www.cfmoto.com/certificates/2026011100000001'
  }));
  const invalidDomain = auditEntries([makeEntry({ evidence: { ccc: wrongDomain } })]);
  assert.ok(invalidDomain.errors.some((message) => message.includes('域名不在白名单')));
  assert.equal(invalidDomain.recommendableEntries.length, 0);
});

test('全球或历史参考证据不能冒充中国大陆当前在售', () => {
  for (const scope of ['global_reference', 'historical_reference']) {
    const market = [{
      sourceTitle: '凯旋全球官方媒体资料',
      url: 'https://triumph-mediakits.com/en/all-motorcycles/example.html',
      checkedAt: '2026-07-10',
      modelCode: 'CF400-8',
      scope
    }];
    const audit = auditEntries([makeEntry({ evidence: { market } })]);
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.recommendableEntries.length, 0);
    assert.ok(audit.decisions[0].blockers.includes('缺少中国品牌官网在售证据'));
  }
});

test('海外媒体域不能声明中国在售，贝纳利中国证据必须使用cn-zh路径', () => {
  const globalAsChina = auditEntries([makeEntry({ evidence: { market: [{
    sourceTitle: '凯旋全球官方媒体资料',
    url: 'https://triumph-mediakits.com/en/all-motorcycles/example.html',
    checkedAt: '2026-07-10',
    modelCode: 'CF400-8',
    scope: 'china_availability'
  }] } })]);
  assert.ok(globalAsChina.errors.some((message) => message.includes('域名不在白名单')));

  const wrongBenelliPath = auditEntries([makeEntry({ evidence: { market: [{
    sourceTitle: '贝纳利全球发布资料',
    url: 'https://www.benelli.com/pt-pt/news/example',
    checkedAt: '2026-07-10',
    modelCode: 'CF400-8',
    scope: 'china_availability'
  }] } })]);
  assert.ok(wrongBenelliPath.errors.some((message) => message.includes('/cn-zh/')));
});

test('工信部记录类型必须与国产或正规进口准入路径匹配', () => {
  const wrongRoute = makeEntry().evidence.miit.map((item) => ({
    ...item,
    recordType: 'imported_vehicle_record'
  }));
  const audit = auditEntries([makeEntry({ evidence: { miit: wrongRoute } })]);
  assert.ok(audit.errors.some((message) => message.includes('approvalRoute=domestic')));
  assert.equal(audit.recommendableEntries.length, 0);
});

test('聚合车型名不能进入账本发布流程', () => {
  const audit = auditEntries([makeEntry({ identity: { modelName: '450NK / 450SR' } })]);
  assert.ok(audit.errors.some((message) => message.includes('疑似聚合车型')));
  assert.equal(audit.recommendableEntries.length, 0);
});

test('电动自行车、非道路车辆和未知类别在双状态通过时仍被阻断', () => {
  for (const vehicleClass of ['electric_bicycle', 'non_road', 'unknown']) {
    const audit = auditEntries([makeEntry({
      identity: {
        vehicleClass,
        propulsion: vehicleClass === 'unknown' ? 'unknown' : 'electric',
        displacementCc: null
      }
    })]);
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.recommendableEntries.length, 0);
    assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('不属于可推荐道路摩托')));
  }
});

test('纯电道路摩托允许空排量并仍需双状态和双证据', () => {
  const audit = auditEntries([makeEntry({
    identity: {
      vehicleClass: 'electric_motorcycle',
      propulsion: 'electric',
      displacementCc: null
    }
  })]);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.recommendableEntries.length, 1);
  assert.equal(toPublicVerifiedVehicle(audit.recommendableEntries[0]).displacement, null);
});

test('缺任一关键推荐参数都不能生成给推荐引擎', () => {
  const complete = makeEntry().recommendationData;
  const cases = [
    { ...complete, category: null },
    { ...complete, priceCny: null },
    { ...complete, seatHeightMm: null },
    { ...complete, curbWeightKg: null },
    { ...complete, abs: null },
    { ...complete, ratedPowerKw: null, powerClass: null }
  ];
  for (const recommendationData of cases) {
    const audit = auditEntries([makeEntry({ recommendationData })]);
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.recommendableEntries.length, 0);
    assert.ok(audit.decisions[0].blockers.some((reason) => reason.includes('缺少关键推荐参数')));
  }
});

test('非 HTTPS、非白名单域和型号不一致都会导致校验失败', () => {
  const audit = auditEntries([makeEntry({
    evidence: {
      market: [{
        sourceTitle: '非官方页面',
        url: 'http://example.com/model/450nk',
        checkedAt: '2026-07-10',
        modelCode: 'OTHER-1',
        scope: 'china_availability'
      }]
    }
  })]);
  assert.ok(audit.errors.some((message) => message.includes('必须使用 HTTPS')));
  assert.ok(audit.errors.some((message) => message.includes('域名不在白名单')));
  assert.ok(audit.errors.some((message) => message.includes('完全对应')));
  assert.equal(audit.recommendableEntries.length, 0);
});

function own(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
