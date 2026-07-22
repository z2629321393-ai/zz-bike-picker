# 车型数据字段 V6.2

```js
{
  source: 'sample | motofan_public_page | brand_official',
  source_id: '来源ID',
  source_url: '公开车型来源页面',
  detail_url: '摩托范公开车型详情页（如有）',
  image_url: '公开车型图片URL',
  image_source_url: '图片来源页面',
  searchKeyword: '品牌 + 车型搜索词',
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

## 数据纪律

- 字段未知时保留 `null` 或空值，不得编造。
- 类别示意图只作为回退图，不得冒充具体车型图片。
- 聚合车型（例如 `250SR / 450SR / 675SR`）必须使用类别方向图，不得挂某一款具体车型的实拍图。
- 外部图片必须保留 `image_source_url` 或车型来源页。
- `status` 必须明确在售、停产/仅二手或不可合法上路；国内库存和上牌条件仍需用户按所在地复核。
- 指导价不等于实际成交价，平台搜索价格不等于实时最低价。
