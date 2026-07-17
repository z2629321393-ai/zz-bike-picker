import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = path.join(root, 'data', 'motofan_raw.json');
const outputPath = path.join(root, 'src', 'catalog.generated.js');

const rawRows = JSON.parse(await fs.readFile(inputPath, 'utf8'));
if (!Array.isArray(rawRows)) throw new TypeError('motofan_raw.json 顶层必须是数组');

const STATUS = {
  not_introduced: {
    label: '大陆未引进',
    note: '来源页明确标注“大陆未引进”，不按国内官方渠道可买车型处理。'
  },
  discontinued: {
    label: '来源页标注停售',
    note: '可能仅有二手车或历史库存，不按当前新车推荐。'
  },
  upcoming: {
    label: '即将上市',
    note: '尚未按已上市车型处理，价格、交付和上牌状态都需等待确认。'
  },
  unquoted: {
    label: '暂无公开报价',
    note: '是否在售、能否订车及能否上牌均待核验。'
  },
  new_listing: {
    label: '来源页标注新车上市',
    note: '有公开上市信息；当地库存、交付和上牌仍需品牌门店与工信部公告双重核验。'
  },
  public_price: {
    label: '有历史/公开指导价',
    note: '公开报价不等于当前有货，也不等于当地可以登记上牌。'
  }
};

function sourceText(row) {
  return `${row.list_name || ''} ${row.price_text || ''}`.trim();
}

function classify(row) {
  const text = sourceText(row);
  if (text.includes('大陆未引进')) return 'not_introduced';
  if (text.includes('停售')) return 'discontinued';
  if (text.includes('即将上市')) return 'upcoming';
  if (text.includes('暂无报价') && row.price_min == null && row.price_max == null) return 'unquoted';
  if (text.includes('新车上市')) return 'new_listing';
  if (Number.isFinite(row.price_min) || Number.isFinite(row.price_max)) return 'public_price';
  return 'unquoted';
}

function cleanName(row) {
  const original = String(row.list_name || row.price_text || `车型 ${row.id}`).trim();
  const cleaned = original
    .replace(/^全新车型\s*/, '')
    .replace(/\s*(?:大陆未引进|即将上市|停售|暂无报价|指导价).*$/, '')
    .replace(/新车上市/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || `车型 ${row.id}`;
}

function formatPrice(min, max) {
  const validMin = Number.isFinite(min);
  const validMax = Number.isFinite(max);
  if (!validMin && !validMax) return '暂无公开报价';
  const low = validMin ? min : max;
  const high = validMax ? max : min;
  const number = (value) => Number(value).toLocaleString('zh-CN');
  return low === high ? `¥${number(low)}` : `¥${number(low)}–${number(high)}`;
}

function assertSourceUrl(url, id) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'm.58moto.com' || parsed.pathname !== `/garage/detail/${id}`) {
    throw new Error(`车型 ${id} 的来源链接不符合公开详情页规则`);
  }
  return parsed.href;
}

const seenIds = new Set();
const catalog = rawRows.map((row) => {
  const sourceId = String(row.id || '').trim();
  if (!/^\d+$/.test(sourceId)) throw new Error(`无效来源 ID: ${sourceId || '(空)'}`);
  if (seenIds.has(sourceId)) throw new Error(`重复来源 ID: ${sourceId}`);
  seenIds.add(sourceId);

  const catalogStatus = classify(row);
  const status = STATUS[catalogStatus];
  return {
    source_id: sourceId,
    display_name: cleanName(row),
    price_min: Number.isFinite(row.price_min) ? row.price_min : null,
    price_max: Number.isFinite(row.price_max) ? row.price_max : null,
    price_label: formatPrice(row.price_min, row.price_max),
    variant_count: Number.isInteger(row.variant_count) && row.variant_count > 0 ? row.variant_count : null,
    source_url: assertSourceUrl(row.url, sourceId),
    catalog_status: catalogStatus,
    status_label: status.label,
    availability_note: status.note,
    road_legal: null,
    recommendable: false
  };
});

const statusCounts = Object.fromEntries(Object.keys(STATUS).map((key) => [
  key,
  catalog.filter((row) => row.catalog_status === key).length
]));

const meta = {
  snapshot_date: '2026-07-16',
  generated_at: new Date().toISOString(),
  source_name: '摩托范公开两轮车型索引快照',
  source_home: 'https://www.58moto.com/',
  total: catalog.length,
  recommendation_groups: 33,
  status_counts: statusCounts,
  scope_note: '索引可能包含电动自行车、摩托车、非道路车型和历史车型；记录不等于已核验在售或可上牌，且默认不进入推荐。'
};

const output = `// 由 scripts/generate-public-catalog.mjs 生成，请勿手工编辑。\n` +
  `// 只保留公开车型名、公开价格、状态、款数与来源链接；原始抓取文本不随网站发布。\n` +
  `export const CATALOG_STATUS = ${JSON.stringify(STATUS, null, 2)};\n\n` +
  `export const CATALOG_META = ${JSON.stringify(meta, null, 2)};\n\n` +
  `export const PUBLIC_CATALOG = [\n${catalog.map((row) => `  ${JSON.stringify(row)}`).join(',\n')}\n];\n`;

await fs.writeFile(outputPath, output, 'utf8');
console.log(`Generated ${catalog.length} sanitized catalog rows: ${outputPath}`);
console.log(JSON.stringify(statusCounts));
