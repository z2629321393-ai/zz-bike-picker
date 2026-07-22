# 从V6.1覆盖升级到V6.2

将更新包中的文件按原目录覆盖到V6.1项目根目录。

新增目录：

```text
assets/gear/
assets/vehicles/
```

新增文件：

```text
src/marketplace.js
tests/marketplace.test.mjs
CHANGELOG-V6.2.md
```

主要覆盖文件：

```text
index.html
styles.css
src/app.js
src/accessories.js
src/engine.js
src/config.js
scrapers/motofan/crawl-motofan.mjs
scrapers/motofan/normalize-to-vehicles.mjs
README.md
data/SCHEMA.md
package.json
CODEX_PROMPT.md
AGENTS.md
```

覆盖后执行：

```bash
npm run check
npm run build
npm run dev
```

如果要让车型卡片显示公开车型图，再执行摩托范采集与归一化。没有真实图时页面会使用本地车型类别方向图。
