# GitHub Pages 部署教程（本项目专用）

本项目推荐用 **GitHub Desktop + GitHub Actions**。以后每次只提交并推送源码，GitHub 会自动运行校验、生成 `dist/` 并发布；不要手工提交 `dist/`。

项目目录：

```text
D:\1GBT\摩托车网站\zz-bike-picker-v4-codex
```

## 1. 发布前本地检查

在 PowerShell 运行：

```powershell
Set-Location "D:\1GBT\摩托车网站\zz-bike-picker-v4-codex"
npm.cmd run check
npm.cmd run build
```

两条都成功后再上传。不要删除 `.gitignore`，也不要强制上传：

```text
node_modules/
dist/
data/motofan_raw.json
data/motofan_details.json
data/vehicles.motofan.json
```

仓库若设为 Public，源码、说明和采集脚本也会公开；网页实际只部署 Actions 构建出的 `dist/`。

## 2. 选择旧仓库还是新仓库

### 继续使用以前的网站仓库（想保留原网址时推荐）

1. 先给旧项目做一份本地备份。
2. 在旧 GitHub 仓库点击 `Code` → `Open with GitHub Desktop`，克隆到另一个文件夹。
3. 把本项目源码复制进克隆后的目录；保留里面的隐藏 `.git` 文件夹。
4. 删除确认不用的旧网页文件，避免它们继续留在仓库。
5. 检查 `.github/workflows/`：Pages 发布工作流只保留一个。
6. GitHub Desktop 中检查 Changes，提交并 Push；不要用 force push 覆盖旧历史。

### 创建新仓库（不需要旧网址时）

1. 安装并登录 [GitHub Desktop](https://desktop.github.com/)。
2. 点击 `File` → `Add local repository`，选择本项目目录。
3. 如果提示不是仓库，点击 `create a repository`。
4. 仓库名可填 `zz-bike-picker`，分支使用 `main`。
5. 填写提交说明，点击 `Commit to main`。
6. 点击 `Publish repository`。
7. GitHub Free 最省事的方式是取消 `Keep this code private`，发布为 Public。

GitHub Desktop 官方教程：[添加本地仓库](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop)、[发布现有项目](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop)。

## 3. 命令行上传（可选）

先在 GitHub 网页创建一个空的 Public 仓库。全新仓库不要预先添加 README、License 或 `.gitignore`，然后运行：

```powershell
Set-Location "D:\1GBT\摩托车网站\zz-bike-picker-v4-codex"

git init -b main
git add .
git status
git commit -m "首次发布摩托车推荐网站"

git remote add origin https://github.com/你的用户名/你的仓库名.git
git remote -v
git push -u origin main
```

`git add .` 后一定先看 `git status`，确认没有原始采集文件、待审核数据、`node_modules` 或 `dist`。若远端已有旧网站或 README，不要照此强推；请先 clone 旧仓库，再复制文件并正常提交。

官方教程：[创建仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)、[上传本地代码](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)。

## 4. 仅用 GitHub 网页上传（不推荐，但可以）

网页拖拽不会自动按本地 `.gitignore` 排除文件，所以不要拖整个目录。只上传源码，明确排除第 1 节列出的五类内容。工作流文件必须位于：

```text
.github/workflows/pages.yml
```

官方教程：[网页添加文件](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。

## 5. 打开 GitHub Pages

第一次推送完成后：

1. 打开仓库页面。
2. 进入 `Settings` → 左侧 `Pages`。
3. 在 `Build and deployment` 中，把 `Source` 设为 `GitHub Actions`。

项目已经包含 `.github/workflows/pages.yml`，无需再手工复制工作流。它会依次执行：

```text
npm run check → npm run build → 上传 dist → 发布 Pages
```

根项目目前没有第三方 npm 依赖，所以工作流不需要 `npm install`。以后若增加依赖，请提交 `package-lock.json`，并在检查前加入 `npm ci`。

当前工作流版本按 GitHub 官方 Pages 文档配置：`checkout@v6`、`configure-pages@v5`、`upload-pages-artifact@v4`、`deploy-pages@v4`。官方说明：[自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 6. 查看发布结果

1. 打开仓库的 `Actions` 标签。
2. 点开 `Deploy ZZ Bike Picker to GitHub Pages`。
3. 等待 `Check and build` 与 `Deploy` 都变绿。
4. 到 `Settings` → `Pages` 点击网站地址。

若工作流先运行、后设置 Pages Source 而失败，设置好 `GitHub Actions` 后回到 Actions，点击 `Run workflow` 重新运行。

## 7. 网站网址规则

普通项目仓库：

```text
https://你的用户名.github.io/仓库名/
```

例如用户名 `zhangsan`、仓库 `zz-bike-picker`：

```text
https://zhangsan.github.io/zz-bike-picker/
```

仓库名若恰好是 `你的用户名.github.io`，网址则是 `https://你的用户名.github.io/`。本项目资源使用相对路径，可以放在带 `/仓库名/` 的项目网址下。以后不要把资源改成 `/styles.css`、`/src/app.js` 这种从域名根目录开始的路径。

## 8. 以后更新网站

每次修改后先运行：

```powershell
npm.cmd run check
npm.cmd run build
```

然后在 GitHub Desktop 中 `Commit to main` → `Push origin`。命令行方式为：

```powershell
git status
git add .
git commit -m "更新车型和推荐规则"
git push
```

不要执行 `git add -f dist`；GitHub Actions 会重新生成它。

## 9. 常见问题

### Actions 中没有工作流

确认文件路径是 `.github/workflows/pages.yml`，且已提交到默认分支。旧仓库若仍使用 `master`，把工作流的触发分支由 `main` 改为 `master`。

### Actions 变红

- `Run all checks` 失败：先在本地执行 `npm.cmd run check`。
- `Build production files` 失败：执行 `npm.cmd run build` 查看原因。
- Upload 找不到目录：确认构建生成 `dist/index.html`。
- Deploy 权限失败：确认 Pages Source 为 GitHub Actions，且工作流保留 `pages: write` 与 `id-token: write`。

### 网站 404

检查 Actions 的 Build/Deploy 都成功、Pages Source 正确、网址包含仓库名、artifact 顶层存在小写 `index.html`。首次发布可能需要等待数分钟，然后按 `Ctrl + F5` 强制刷新。官方排查：[Pages 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)。

### 页面有 HTML，但没有样式或按钮失效

通常是资源路径以 `/` 开头造成的。项目站点有 `/仓库名/` 前缀，应继续使用相对路径。

### 推送后网页没变化

确认已经 Push 而不只是 Commit；检查 Actions 发布的是最新提交；随后等待一两分钟并按 `Ctrl + F5`。

## 10. 自定义域名（可选）

没有域名时直接使用 `github.io` 地址即可。

1. GitHub 个人 `Settings` → `Pages` → `Add a domain`，按提示添加 TXT 记录验证所有权；不要删除验证记录。
2. 仓库 `Settings` → `Pages` → `Custom domain`，输入 `www.example.com`。
3. 域名服务商添加：`www CNAME 你的用户名.github.io`（不要加仓库名或 `https://`）。
4. 若使用根域名，添加四条 A 记录：

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

5. DNS 生效后在 Pages 勾选 `Enforce HTTPS`。DNS 和证书可能需要最长 24 小时。

官方说明：[验证域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)、[管理自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)、[启用 HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)。
