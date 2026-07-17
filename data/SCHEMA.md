# 车型数据字段

```js
{
  source: 'sample | motofan_public_page | brand_official',
  source_id: '来源ID',
  source_url: '公开来源页面',
  fetched_at: '采集时间',
  brand: '品牌',
  model: '车型',
  type: 'scooter | adv | cruiser | sport | street | retro | offroad | collector',
  budget: [最低参考价, 最高参考价],
  seat: 795,
  weight: 180,
  displacement: 450,
  year: 2026,
  status: '在售/停售/即将上市/待校准',
  cost: 'low | mid | high',
  maint: 'low | mid | high',
  looks: 'low | mid | high | unique',
  power: 'low | mid | high',
  tags: [],
  why: '基础推荐理由',
  warn: '现实代价',
  dataQuality: 'sample | public | partial | verified'
}
```

字段未知时保留 `null` 或空值，不得编造。

## 公开浏览目录（不进入推荐）

`src/catalog.generated.js` 中每条只允许公开以下字段：

```js
{
  source_id: '公开来源ID',
  display_name: '来源车型名',
  price_min: 10000,
  price_max: 12000,
  price_label: '¥10,000–12,000',
  variant_count: 2,
  source_url: 'HTTPS公开来源',
  catalog_status: 'not_introduced | discontinued | upcoming | unquoted | new_listing | public_price',
  status_label: '面向用户的状态文案',
  availability_note: '不夸大可买/上牌的说明',
  road_legal: null,
  recommendable: false
}
```

第三方公开索引不能证明道路准入或当前市场供应，所以 `road_legal` 必须为 `null`，`recommendable` 必须为 `false`。

`src/catalog-reviews.js` 只保存车型族初核摘要：官方名称、市场状态、道路状态、候选工厂型号和一手链接。它不能填写或生成正式推荐资格，也不会被推荐引擎导入。

正式精确车型写入 `data/official-vehicle-reviews.json`，字段和发布门槛以 `data/official-vehicle-reviews.schema.json` 与 `data/OFFICIAL_REVIEW_LEDGER.md` 为准。推荐资格只能由校验器在单一版本、中国大陆官方供应、工信部记录、有效 CCC、参数完整度、证据时效与人工审核全部通过时计算，并生成 `src/vehicles.verified.js`；不得由抓取器或人工直接填写 `recommendable`。
