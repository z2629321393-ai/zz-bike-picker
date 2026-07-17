# 骑不快的ZZ｜性格选车访谈 V4

V4不是继续堆问题，而是把V3升级成一个可维护、可解释、可扩展的选车产品原型。

## 本版解决了什么

- 保留“一题一屏”的访谈交互，不改回长表单。
- 由10轮扩展为12轮，新增骑行经验、通勤距离和停车环境。
- 推荐逻辑与车型数据彻底分离。
- 每台推荐车型都会给出：匹配理由、现实代价、硬性排除原因、数据可信度。
- 新增3:4结果海报。
- 新增车型详情弹窗。
- 新增数据状态面板，不再把不完整数据假装成精确结果。
- 新增 1,482 条脱敏公开两轮车型索引，可搜索并按停售、未引进、即将上市等状态筛选；其中可能包含电动自行车、非道路和历史车型，未经分类核验永不自动进入推荐。
- 已优先初核 23 条：13 条“新车上市”、5 条“即将上市”、5 条“暂无报价”；页面会分开显示市场证据、道路准入证据、车型类别和阻断原因，当前 0 条进入正式推荐。
- 基础示例、第三方候选与正式推荐池已严格隔离；没有通过双状态账本的具体版本时，结果只给车型方向，不输出未核验型号。
- 加入新手、预算、座高、车重、停车和老车年限的硬过滤。
- 使用 Node 自带测试；主站不需要前端依赖，公开数据采集器要求 Node 18+。
- 当前自动测试共 56 项：正式账本 15 项、推荐/场景 23 项、采集管道 18 项。

## 直接运行

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:4173
```

## 检查项目

```bash
npm run check
```

## 生成可部署目录

```bash
npm run build
```

生成的 `dist/` 可部署到GitHub Pages、Vercel或Netlify。

## 目录结构

```text
index.html
styles.css
assets/
data/
  base-vehicles.js
  official-vehicle-reviews.json
  official-vehicle-reviews.schema.json
  OFFICIAL_REVIEW_LEDGER.md
src/
  app.js
  catalog.generated.js
  catalog-reviews.js
  config.js
  demo-meta.js
  engine.js
  poster.js
  storage.js
  vehicles.generated.js
  vehicles.verified.js
scripts/
  serve.mjs
  build.mjs
  check-data.mjs
  check-catalog.mjs
  check-catalog-reviews.mjs
  check-official-reviews.mjs
  generate-public-catalog.mjs
tests/
  engine.test.mjs
  official-reviews.test.mjs
  scenarios.test.mjs
scrapers/motofan/
  pipeline.test.mjs
AGENTS.md
CODEX_PROMPT.md
CATALOG_COVERAGE.md
NEW_LISTING_AUDIT_2026-07-17.md
UPCOMING_UNQUOTED_AUDIT_2026-07-17.md
GITHUB_PAGES_DEPLOY.md
.github/workflows/pages.yml
```

## 车型数据策略

`data/base-vehicles.js` 是基础示例库，只用于开发和算法场景测试，不进入正式用户推荐，也不会复制进 `dist/`。生产界面只读取 `src/demo-meta.js` 中的示例数量说明。

`src/catalog.generated.js` 是从 1,482 条公开两轮索引生成的脱敏浏览目录。索引可能包含电动自行车、摩托车、非道路和历史车型；它只保留车型名、公开参考价、状态提示、款型数与来源链接，全部固定为 `recommendable: false`，不会传入推荐引擎。当前已完成车型分类、道路准入与官方市场供应核验的具体版本仍为 0；完整口径见 `CATALOG_COVERAGE.md`。

`src/catalog-reviews.js` 保存车型族初核摘要，只用于把来源名称纠错、官方页面、候选工厂型号和缺证原因展示给用户，不会进入推荐引擎。首批 13 条见 `NEW_LISTING_AUDIT_2026-07-17.md`，第二批 10 条见 `UPCOMING_UNQUOTED_AUDIT_2026-07-17.md`。

`data/official-vehicle-reviews.json` 才是精确到单一版本的正式双状态账本。校验器会核对中国大陆官方供应、工信部记录、有效 CCC、证据时效、推荐参数和人工复核，并生成 `src/vehicles.verified.js`。主站只从这个生成模块读取具体推荐车型；任何未显式生成 `recommendable: true` 的记录都会被引擎默认阻断。

摩托范公开页采用“采集 → 待审核候选 → 人工逐条审核 → 显式发布”的安全流程：

```text
data/motofan_raw.json
data/motofan_details.json
data/vehicles.motofan.json（全部初始为 pending）
```

`normalize-to-vehicles.mjs` 只生成候选，不会修改前端。只有逐条核对来源、价格、车型类别、年款、规格和在售状态，并将可靠记录标为 `approved` 后，才可运行：

```powershell
Set-Location .\scrapers\motofan
npm.cmd run publish-reviewed -- --confirm-reviewed
```

发布器只会把人工整理后的第三方候选写入 `src/vehicles.generated.js`，供继续查证和算法测试；它仍不具备正式推荐资格。只有再拆成单一版本并完成正式双状态账本闭环的记录，才会进入 `src/vehicles.verified.js`。未经审核的 raw、details 和 pending 文件不会被复制进 `dist/`。

## 重要说明

- 本测试用于内容互动和选车初筛，不替代试坐、试骑、当地落地价、车况检测、手续核验、保险和当地法规确认。
- 老车年限过滤是保守启发式判断，实际应以登记日期和当地规定为准。
- 无手续水车、报废车不进入日常上路推荐。
- 公开指导价不等于当地成交价；未知的车型类别、持有成本、维护、动力、年款或规格必须保留为空，不能靠价格或弱关键词猜测。
- GitHub Pages 已配好自动检查与构建工作流，首次上传和后续更新见 `GITHUB_PAGES_DEPLOY.md`。
