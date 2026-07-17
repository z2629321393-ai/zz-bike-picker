import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  AccessBlockedError,
  assertNonEmptyUnique,
  assertPublicAccess,
  detectAccessBlock,
  extractUniqueParameterSpecs,
  parseMaxDetails,
  parseMoneyRange,
  sanitizeDetailRecord
} from './pipeline-core.mjs';
import {
  normalizeBudget,
  normalizeRow,
  renderGeneratedModule,
  validateReviewedVehicles
} from './normalize-core.mjs';
import { createLaunchOptions, ROOT as CRAWL_ROOT, selectResumeDetails, writeRawRecords } from './crawl-motofan.mjs';
import { ROOT as NORMALIZE_ROOT } from './normalize-to-vehicles.mjs';
import { ROOT as PUBLISH_ROOT } from './publish-reviewed.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXPECTED_ROOT = path.resolve(HERE, '../..');

test('ROOT 由 import.meta.url 解析，不依赖 cwd', () => {
  assert.equal(CRAWL_ROOT, EXPECTED_ROOT);
  assert.equal(NORMALIZE_ROOT, EXPECTED_ROOT);
  assert.equal(PUBLISH_ROOT, EXPECTED_ROOT);
});

test('三个 CLI 的 --help 可从任意 cwd 离线执行', () => {
  for (const script of ['crawl-motofan.mjs', 'normalize-to-vehicles.mjs', 'publish-reviewed.mjs']) {
    const result = spawnSync(process.execPath, [path.join(HERE, script), '--help'], {
      cwd: os.tmpdir(),
      encoding: 'utf8'
    });
    assert.equal(result.status, 0, `${script}: ${result.stderr}`);
    assert.match(result.stdout, /用法/);
  }
});

test('MAX_DETAILS 仅接受未设置或规范的 1..100 整数', () => {
  assert.equal(parseMaxDetails(undefined), 0);
  assert.equal(parseMaxDetails('1'), 1);
  assert.equal(parseMaxDetails('30'), 30);
  assert.equal(parseMaxDetails('100'), 100);
  for (const invalid of ['', '0', '101', '-1', '1.5', '1e2', '01', '+1', ' 30 ', 'NaN', 'abc']) {
    assert.throws(() => parseMaxDetails(invalid), /1\.\.100/);
  }
});

test('采集器可显式使用电脑已有的 Chromium 可执行文件', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zz-browser-'));
  const executable = path.join(tempDir, 'chrome.exe');
  try {
    await fs.writeFile(executable, 'fixture');
    assert.deepEqual(
      await createLaunchOptions(
        { CHROMIUM_EXECUTABLE_PATH: executable },
        { headless: true, slowMo: 12 }
      ),
      { headless: true, slowMo: 12, executablePath: path.resolve(executable) }
    );
    await assert.rejects(
      () => createLaunchOptions({ CHROMIUM_EXECUTABLE_PATH: path.join(tempDir, 'missing.exe') }),
      /CHROMIUM_EXECUTABLE_PATH/
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('非法 MAX_DETAILS 在加载 Playwright 前非零退出', () => {
  const result = spawnSync(process.execPath, [path.join(HERE, 'crawl-motofan.mjs')], {
    cwd: os.tmpdir(),
    env: { ...process.env, MAX_DETAILS: '0' },
    encoding: 'utf8'
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /MAX_DETAILS/);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /playwright|ERR_MODULE_NOT_FOUND/i);
});

test('非法 PARAMETERS_ONLY 在加载 Playwright 前非零退出', () => {
  const result = spawnSync(process.execPath, [path.join(HERE, 'crawl-motofan.mjs')], {
    cwd: os.tmpdir(),
    env: { ...process.env, PARAMETERS_ONLY: 'yes' },
    encoding: 'utf8'
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /PARAMETERS_ONLY/);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /playwright|ERR_MODULE_NOT_FOUND/i);
});

test('403/429、验证码、访问限制与登录阻断均被识别', () => {
  assert.equal(detectAccessBlock({ status: 403 }), 'HTTP 403');
  assert.equal(detectAccessBlock({ status: 429 }), 'HTTP 429');
  assert.match(detectAccessBlock({ text: '请输入验证码后继续' }), /验证/);
  assert.match(detectAccessBlock({ text: '请求过于频繁，请稍后再试' }), /限制/);
  assert.match(detectAccessBlock({ text: '请先登录后继续访问' }), /登录/);
  assert.match(detectAccessBlock({ finalUrl: 'https://m.58moto.com/captcha/' }), /验证/);
  assert.equal(detectAccessBlock({ text: '首页 车型库 登录 注册 关于我们' }), null);
});

test('访问阻断抛出可识别的致命错误', () => {
  assert.throws(
    () => assertPublicAccess({ status: 429, url: 'https://m.58moto.com/garage/list', phase: '列表页' }),
    (error) => error instanceof AccessBlockedError && error.code === 'ACCESS_BLOCKED'
  );
});

test('unique 为 0 时在写文件前失败', () => {
  assert.throws(() => assertNonEmptyUnique([]), (error) => error.code === 'NO_UNIQUE_ITEMS');
  assert.equal(assertNonEmptyUnique([{ id: '1' }]).length, 1);
});

test('unique 为 0 时已有 raw 字节保持不变', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'motofan-zero-'));
  const rawFile = path.join(directory, 'motofan_raw.json');
  const sentinel = '{"sentinel":true}\n';
  try {
    await fs.writeFile(rawFile, sentinel, 'utf8');
    await assert.rejects(() => writeRawRecords(rawFile, []), (error) => error.code === 'NO_UNIQUE_ITEMS');
    assert.equal(await fs.readFile(rawFile, 'utf8'), sentinel);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('详情白名单只保留有限字段和规格片段，清除全文与联系方式', () => {
  const record = sanitizeDetailRecord({
    source: 'price:1-2',
    id: '12345',
    url: 'https://m.58moto.com/garage/detail/12345?from=comment#user',
    list_name: '测试 街车 400',
    list_text: '指导价 ¥19,800 评论用户独特昵称 手机 13800138000',
    price_text: '厂商指导价：¥19,800',
    detail_title: '测试 街车 400',
    detail_text: '座高 790 mm；整备质量 180 kg；排量 399 cc；街车。评论用户独特昵称，微信 abcdef88，电话 13800138000。',
    links: [{ href: 'tel:13800138000' }],
    dealer_text: '某经销商 13800138000',
    comments: ['独特评论内容'],
    fetched_at: '2026-07-16T00:00:00.000Z'
  });

  assert.equal(record.url, 'https://m.58moto.com/garage/detail/12345');
  assert.deepEqual(record.specs, { seat_mm: 790, weight_kg: 180, displacement_cc: 399 });
  assert.ok(record.type_keywords.includes('街车'));
  for (const key of ['detail_text', 'list_text', 'links', 'dealer_text', 'comments', 'brand_category_raw']) {
    assert.equal(Object.hasOwn(record, key), false);
  }
  const serialized = JSON.stringify(record);
  assert.doesNotMatch(serialized, /13800138000|独特昵称|abcdef88|独特评论内容|tel:/);
  assert.ok(serialized.length < 2000);
});

test('价格区间支持单个货币符号，暂无报价保持 null', () => {
  assert.deepEqual(parseMoneyRange('厂商指导价：¥12,980 - 15,980'), {
    price_min: 12980,
    price_max: 15980,
    price_text: '厂商指导价：¥12,980 - 15,980'
  });
  assert.deepEqual(normalizeBudget({ price_min: null, price_max: null, price_text: '暂无报价' }), null);
  assert.deepEqual(normalizeBudget({ price_min: 22000, price_max: null }), [22000, 22000]);
  assert.deepEqual(normalizeBudget({ price_min: 30000, price_max: 20000 }), [20000, 30000]);
  const explicitNoPrice = sanitizeDetailRecord({
    id: '8',
    url: 'https://m.58moto.com/garage/detail/8',
    price_text: '指导价 ¥12,000',
    price_min: 12000,
    price_max: 12000,
    detail_price_text: '厂商指导价：暂无报价'
  });
  assert.equal(explicitNoPrice.price_min, null);
  assert.equal(explicitNoPrice.price_max, null);
});

test('参数页仅在所有版本一致时写入单值规格', () => {
  const specs = extractUniqueParameterSpecs(`
排量(cc)
125
125
125
精确排量(cc)
124
124
124
座高(mm)
725
725
725
轴距(mm)
1247
1247
1247
整备质量(kg)
99
99
104
前倾角度(°)
-
  `);
  assert.deepEqual(specs, { seat_mm: 725, weight_kg: null, displacement_cc: 124 });

  const electricSpecs = extractUniqueParameterSpecs(`
车辆属性
电自
电轻摩
座高(mm)
750
750
整备质量(kg)
55
120
  `);
  assert.deepEqual(electricSpecs, { seat_mm: 750, weight_kg: null, displacement_cc: null });
});

test('MAX_DETAILS 对 resume 后的最终详情总量仍是硬上限', () => {
  const rows = ['1', '2', '3'].map((id) => ({
    id,
    url: `https://m.58moto.com/garage/detail/${id}`,
    parameter_checked: true
  }));
  const targets = rows.slice(0, 2);
  const selected = selectResumeDetails([...rows, rows[0]], targets, 2);
  assert.deepEqual(selected.map((row) => row.id), ['1', '2']);
  assert.ok(selected.every((row) => row.parameter_checked));
});

test('缺价车型不会变成 [0,0]，cost/power 不会伪装 low', () => {
  const vehicle = normalizeRow({
    id: '99',
    url: 'https://m.58moto.com/garage/detail/99',
    list_name: '测试 未报价车型',
    price_min: 0,
    price_max: null,
    detail_price_text: '暂无报价',
    fetched_at: '2026-07-16T00:00:00.000Z'
  });
  assert.equal(vehicle.budget, null);
  assert.equal(vehicle.cost, null);
  assert.equal(vehicle.power, null);
  assert.equal(vehicle.maint, null);
  assert.match(vehicle.why, /价格.*待人工校准/);
  assert.equal(vehicle.review_status, 'pending');
});

test('公开报价不用于猜持有成本、维护、动力、外观或未知车型类别', () => {
  const vehicle = normalizeRow({
    id: '98',
    url: 'https://m.58moto.com/garage/detail/98',
    list_name: '测试 车型新车上市',
    detail_title: '测试 车型',
    price_min: 3999,
    price_max: 16999,
    type_keywords: ['竞速', '旅行']
  });
  assert.equal(vehicle.display_name, '测试 车型');
  assert.equal(vehicle.type, null);
  assert.equal(vehicle.cost, null);
  assert.equal(vehicle.maint, null);
  assert.equal(vehicle.power, null);
  assert.equal(vehicle.looks, null);
  assert.deepEqual(vehicle.tags, []);
  assert.match(vehicle.why, /仍待人工校准/);
});

test('publish 只接受逐条 approved 的安全候选，并移除审核字段', () => {
  const pending = normalizeRow({
    id: '100',
    url: 'https://m.58moto.com/garage/detail/100',
    source: 'type:街车',
    list_name: '测试 安全车型',
    price_min: 12000,
    price_max: 15000
  });
  assert.throws(() => validateReviewedVehicles([pending]), /approved/);

  const approved = { ...pending, review_status: 'approved' };
  const reviewed = [approved];
  assert.strictEqual(validateReviewedVehicles(reviewed), reviewed);
  const generated = renderGeneratedModule([approved]);
  assert.doesNotMatch(generated, /review_status/);
  assert.match(generated, /MOTOFAN_VEHICLES/);

  assert.throws(
    () => validateReviewedVehicles([{ ...approved, detail_text: '整页正文' }]),
    /非白名单字段|禁止持久化字段/
  );
  assert.throws(
    () => validateReviewedVehicles([{ ...approved, warn: '联系 13800138000' }]),
    /手机号/
  );
  assert.throws(
    () => validateReviewedVehicles([{ ...approved, type: null }]),
    /type 未校准/
  );
});

test('publish 缺少显式确认参数时先失败', () => {
  const result = spawnSync(process.execPath, [path.join(HERE, 'publish-reviewed.mjs')], {
    cwd: os.tmpdir(),
    encoding: 'utf8'
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /--confirm-reviewed/);
});
