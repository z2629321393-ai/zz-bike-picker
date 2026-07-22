# 从V5更新到V6

将更新包内文件覆盖到V5项目根目录：

```text
index.html
styles.css
package.json
src/app.js
src/accessories.js
src/config.js
tests/accessories.test.mjs
assets/extension-promo.png
README.md
AGENTS.md
CODEX_PROMPT.md
CHANGELOG-V6.md
```

覆盖后执行：

```bash
npm run check
npm run build
```

旧浏览器里V5装备答案使用不同的本地存储Key，不会污染V6结果。
