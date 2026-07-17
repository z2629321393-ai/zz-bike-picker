# 骑不快的ZZ V4｜家用电脑续跑说明

本轮交付压缩包：`zz-bike-picker-v4-codex-handoff-20260717-165659.zip`。压缩包包含源码、测试、审计说明、GitHub Pages 教程和已通过校验的 `dist/`。

## 当前状态

- 车型目录：1,482 条脱敏公开两轮索引、共 3,943 个来源款型计数；可能包含电动自行车、摩托车、非道路和历史车型。422 条标注停售、24 条大陆未引进、5 条即将上市，其余 1,031 条市场供应待逐款核验。
- 初核进度：已审计 23 条车型族（13 条新车上市、5 条即将上市、5 条暂无报价）；逐项见 `NEW_LISTING_AUDIT_2026-07-17.md` 与 `UPCOMING_UNQUOTED_AUDIT_2026-07-17.md`。
- 推荐数据：33 条合并基础示例组已与正式结果隔离；正式完成中国大陆市场、工信部记录、CCC 与参数审核的具体版本仍为 0，因此结果页暂不输出具体车型名。
- 推荐引擎：已补充新手高动力/ABS、身高座高、车重、手续异常、露天停车及全部“一票否决”硬过滤。
- 交互验收：桌面端与 390px 手机端的 12 轮流程、详情弹窗、返回续答、键盘操作和 900×1200 海报已走通。
- 自动校验：正式账本 15 项、推荐/场景 23 项、采集管道 18 项，共 56 项测试通过；基础数据、1,482 条公开目录和 23 条初核摘要校验也已通过，全部接入根目录 `npm.cmd run check`。
- 生产构建：已重新通过，`dist/` 只含公开前端白名单文件，不含 33 条示例名称、第三方候选模块或 raw/details/pending 试采数据。
- 摩托范试采：公开列表去重 1,482 条，按上限完成 30 条详情和 30 个参数页检查；19 条得到一致座高、7 条得到一致车重、9 条得到一致排量。
- 正式车型数据：`src/vehicles.verified.js` 仍为空。`src/vehicles.generated.js` 即使以后发布第三方候选，也只供继续查证，不会越过双状态账本进入正式推荐。
- GitHub Pages：已加入 `.github/workflows/pages.yml`，部署步骤见 `GITHUB_PAGES_DEPLOY.md`。

## 在家继续

在项目根目录运行：

```powershell
npm.cmd run check
npm.cmd run dev
```

打开：

```text
http://127.0.0.1:4173
```

准备部署时运行：

```powershell
npm.cmd run build
```

## 下一步优先级

1. 先沿两份 2026-07-17 审计报告中的候选工厂型号补齐工信部记录和 CCC，再按 `CATALOG_COVERAGE.md` 扩展到其余索引；不能只凭第三方指导价判断在售或可上牌。
2. 分别核对电动车与燃油踏板；当前推荐架构尚未建立电动车维度，不要用 `street/sport` 默认值代替人工判断。
3. 第三方候选的 `approved` 只表示采集内容通过人工整理；还必须拆成单一版本，写入 `data/official-vehicle-reviews.json` 并通过正式账本校验。
4. 每次补证后运行根目录 `npm.cmd run check` 和 `npm.cmd run build`，并再做一次目录面板与结果页抽查。

只补采现有 30 条的公开参数页时，可在 `scrapers/motofan/` 设置：

```powershell
$env:MAX_DETAILS = '30'
$env:PARAMETERS_ONLY = '1'
$env:CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run crawl
```

结束后删除这些临时环境变量。采集器遇到 403/429、验证码、访问限制或登录阻断会立即停止，不得绕过。

继续开发前先阅读 `AGENTS.md` 和 `CODEX_PROMPT.md`，不要编造车型数据，也不要把手续异常、水车或报废车推荐为上路车型。
