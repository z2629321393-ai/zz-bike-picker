# 摩托范公开车型数据管道

只读取公开页面可见的有限车型字段，不登录、不绕验证码、不破解接口。采集器默认低速、单浏览器串行运行；遇到 HTTP 403/429、验证码、访问限制或登录阻断会立即停止整个 crawl。

输出路径按脚本自身位置解析，不依赖当前工作目录。不过 npm 命令仍应在本目录执行。

## PowerShell 运行

要求 Node.js 18 或更高版本。首次准备依赖和浏览器（需要网络，只需按需执行一次）：

```powershell
Set-Location .\scrapers\motofan
npm.cmd install
npm.cmd run install-browsers
```

如果电脑已经安装 Chrome，也可以不下载 Playwright 自带浏览器。运行 crawl 前指定可执行文件：

```powershell
$env:CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
```

脚本会先验证该路径确实是文件；任务结束后可用 `Remove-Item Env:CHROMIUM_EXECUTABLE_PATH` 清理变量。

先做最多 30 个详情页的低量试跑：

```powershell
$env:MAX_DETAILS = '30'
try {
  npm.cmd run crawl
  if ($LASTEXITCODE -ne 0) { throw "crawl 失败，退出码 $LASTEXITCODE" }
}
finally {
  Remove-Item Env:MAX_DETAILS -ErrorAction SilentlyContinue
}
```

`MAX_DETAILS` 一旦设置，只接受规范的 `1` 到 `100` 整数。完整采集时应删除该环境变量，不能设置为 `0`：

```powershell
Remove-Item Env:MAX_DETAILS -ErrorAction SilentlyContinue
npm.cmd run crawl
```

如果详情已经存在，只想补查对应的公开“完整参配”页，可减少列表请求：

```powershell
$env:MAX_DETAILS = '30'
$env:PARAMETERS_ONLY = '1'
try {
  npm.cmd run crawl
}
finally {
  Remove-Item Env:MAX_DETAILS -ErrorAction SilentlyContinue
  Remove-Item Env:PARAMETERS_ONLY -ErrorAction SilentlyContinue
}
```

`PARAMETERS_ONLY=1` 会复用现有 raw/details；若缺少其中任何目标详情会报错，不会悄悄扩大采集范围。参数页只保存座高、整备质量和排量的有限汇总；只有所有公开版本数值一致时才写入单值，不一致时保持 `null`。

可离线运行管道单元测试：

```powershell
npm.cmd test
```

## 安全发布流程

归一化只生成待审核候选，不会修改前端 generated 文件：

```powershell
npm.cmd run normalize
```

然后人工逐条检查 `..\..\data\vehicles.motofan.json`：

1. 核对车型名称、来源详情 URL、价格区间、在售状态和规格。
2. 缺少公开价格的记录必须保持 `budget: null`；公开指导价也不能用来猜持有成本、维护、外观或动力，这些字段未知时必须保持 `null`。
3. 确认没有整页正文、评论用户、手机号、邮箱、微信号或其他联系方式。
4. 只有确认无误的记录才把 `review_status` 从 `pending` 改为 `approved`；不可靠的记录应修正或删除。

全部审核完成后，使用显式确认参数发布：

```powershell
npm.cmd run publish-reviewed -- --confirm-reviewed
Set-Location ..\..
npm.cmd run check
```

发布器会再次检查审核状态、来源 URL、价格空值、禁止全文字段和疑似联系方式；任一记录不合格都不会覆盖 `src/vehicles.generated.js`。`npm.cmd run all` 只执行 crawl 与 normalize，不会跳过人工审核自动发布。

## 输出

- `data/motofan_raw.json`：去重后的有限列表字段；若结果为 0，不创建或覆盖该文件。
- `data/motofan_details.json`：有限详情字段、类型提示、三个规格片段和参数页一致值；不保存整个页面正文、完整参数表或链接列表。
- `data/vehicles.motofan.json`：`normalize` 生成的人工审核候选。
- `src/vehicles.generated.js`：仅由 `publish-reviewed --confirm-reviewed` 在审核通过后生成。

恢复旧版 `motofan_details.json` 时，crawl 会先按字段白名单清洗旧记录，移除历史 `detail_text`、链接、经销商文本和其他未使用字段。

## 禁止事项

- 不高并发，不在网站拒绝访问后继续请求。
- 不绕验证码或访问限制。
- 不采集登录后的个人数据、评论用户信息或联系方式。
- 不把厂商指导价写成当地成交价或未经核验的在售结论。
