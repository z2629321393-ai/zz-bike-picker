import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACCESSORY_CATEGORIES } from '../src/accessories.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');

test('首页采用单项入口：1个选车加8个装备类目', () => {
  assert.equal(ACCESSORY_CATEGORIES.length, 8);
  assert.match(html, /id="entryGrid"/);
  assert.match(app, /data-entry-category="motorcycle"/);
  assert.match(app, /openPromo\(`category:\$\{categoryId\}`\)/);
});

test('单项结果结束后不强制进入下一项目', () => {
  assert.doesNotMatch(html, /下一步：看提醒图，再选下一项/);
  assert.match(html, /完成，返回项目选择/);
  assert.match(html, /不用按顺序，也不用全部做完/);
});

test('车型卡明确国内在售与买不到状态，并标注聚合车型方向图', () => {
  assert.match(app, /国内在售方向 · 库存需复核/);
  assert.match(app, /国内新车通常买不到 · 仅二手\/收藏/);
  assert.match(app, /车型方向示意图 · 非具体实拍/);
});
