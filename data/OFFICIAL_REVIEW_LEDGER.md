# 具体车型双状态审核账本

`official-vehicle-reviews.json` 只记录中国大陆市场中“精确到单一版本”的人工审核事实。公开报价、媒体目录或经销商库存均不能单独证明车辆当前可买、可以登记上牌。

## 字段与状态

- `identity`：必须同时填写生产企业、品牌、车型名、单一版本名、年款、公告/产品型号代码、准入路径、车辆类别、动力形式和排量。`/`、`系列`、`全系`、`多款`等聚合名称禁止发布。
- `approvalRoute`：`domestic` 表示国产产品公告路径，`official_import` 表示正规进口车辆记录路径；工信部证据类型必须与其一致。
- `vehicleClass`：`motorcycle`（燃油/混动道路摩托）、`electric_motorcycle`（电动道路摩托）、`electric_bicycle`（电动自行车）、`non_road`（非道路车辆）、`unknown`。只有前两类可能获得推荐资格。
- `propulsion`：`ice`、`electric`、`hybrid`、`unknown`。燃油/混动车排量必须为正整数；纯电车型的 `displacementCc` 必须为 `null` 或 `0`。
- `marketStatus`：`officially_available`（品牌官方当前在售）、`discontinued`（停售）、`not_introduced`（大陆未官方引进）、`upcoming`（即将上市）、`unknown`（无法确认）。
- `roadApprovalStatus`：`approved`（已取得且复核到有效道路准入证据）、`not_approved`（无准入）、`unknown`（无法确认）。
- `evidence.market`：品牌官方网站证据，必须填写 `scope`。只有 `china_availability` 能证明中国大陆当前在售；`global_reference` 与 `historical_reference` 只保留作身份/历史参考，永不贡献推荐资格。
- `evidence.miit`：工信部或其政务查询系统的具体记录，含 `recordType` 与 `referenceId`。国产车必须是 `domestic_product_announcement`，正规进口车必须是 `imported_vehicle_record`。
- `evidence.ccc`：国家认监委/CCC 查询证据，必须保存证书编号和证书状态。只有 `certificateStatus: valid` 能贡献推荐资格。
- `reviewStatus`：`pending`、`approved`、`rejected`。人工审核通过只是必要条件，不等于自动获得推荐资格。
- `reviewedAt` / `reviewer`：人工复核日期和内部审核标识；生成的公开模块不会包含审核人。
- `recommendationData`：推荐引擎所需的已核验参数。必须精确填写 `category`、人民币价格区间、座高、整备质量、ABS，以及额定功率或明确动力级别；待审核记录可以填 `null`，但不能因此进入白名单。

账本中不得填写 `recommendable`。`scripts/check-official-reviews.mjs` 唯一负责计算推荐资格，并生成 `src/vehicles.verified.js`。

## 自动推荐资格

只有同时满足以下条件的单一具体车型才会被生成到白名单：

1. `reviewStatus` 为 `approved`；
2. `marketStatus` 为 `officially_available`；
3. `roadApprovalStatus` 为 `approved`；
4. 至少一条 90 天内、`scope` 为 `china_availability` 的品牌中国官网在售证据；
5. 至少一条 180 天内、类型与 `approvalRoute` 匹配的工信部记录；
6. 至少一条 90 天内、状态为 `valid` 的 CCC 证书记录；
7. 人工复核在 30 天内，且审核标识非空；
8. 市场、工信部和 CCC 证据的型号代码均与单一版本身份完全一致；
9. 所有 URL 使用 HTTPS、属于对应用途的白名单域名并指向非首页路径；
10. 车辆类别是道路摩托或电动道路摩托，动力形式已确认；电动自行车、非道路车辆和未知类别永不推荐；
11. 推荐参数完整：类别、价格上下限、座高、整备质量、ABS 都是明确值，并且额定功率或动力级别至少有一项明确。

日期时效按运行校验时的 UTC 日期计算，而不是只按账本的 `asOf` 计算。证据过期后，车型会自动退出生成白名单；停售、未引进、即将上市、状态未知、审核待定和无道路证据的记录都可以留在账本中供审计，但永远不会被发布为可推荐车型。

新增品牌中国官网域名时，必须先人工确认域名所有权，再在校验脚本的 `ALLOWED_MARKET_DOMAINS` 中代码审查后加入；不能把媒体、电商或经销商域名加入中国在售白名单。全球官方媒体只能进入 `ALLOWED_REFERENCE_DOMAINS` 并使用非中国 `scope`。例如 `triumph-mediakits.com` 只能作为全球参考，贝纳利 `benelli.com` 只有 `/cn-zh/` 路径可声明 `china_availability`。

脚本校验的是账本结构、证据标识、域名和时效，不会自动读取网页正文。审核人仍必须在标记 `approved` 前实际打开工信部记录与 CCC 查询结果，确认型号、企业、证书状态和具体版本一致。
