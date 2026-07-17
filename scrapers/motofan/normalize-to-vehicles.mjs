/**
 * 将 motofan_details.json 归一化为待人工审核的候选 JSON。
 * 本脚本不会写 src/vehicles.generated.js。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeRows } from './normalize-core.mjs';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_FILE);
export const ROOT = path.resolve(SCRIPT_DIR, '../..');
const IN_FILE = path.join(ROOT, 'data', 'motofan_details.json');
const OUT_JSON = path.join(ROOT, 'data', 'vehicles.motofan.json');

function showHelp() {
  console.log(`用法：node ${path.basename(SCRIPT_FILE)} [--help]

读取：${IN_FILE}
写入：${OUT_JSON}

该命令只生成 review_status=pending 的候选数据，不会覆盖 vehicles.generated.js。
人工逐条审核并改为 approved 后，再运行 publish-reviewed.mjs --confirm-reviewed。`);
}

export async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  if (args.length > 0) throw new Error(`未知参数：${args.join(' ')}`);

  let rows;
  try {
    rows = JSON.parse(await fs.readFile(IN_FILE, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`找不到 ${IN_FILE}，请先运行 npm.cmd run crawl。`);
    throw error;
  }

  const vehicles = normalizeRows(rows);
  if (vehicles.length === 0) throw new Error('归一化结果为 0 条；为保护审核文件，本次不写入。');
  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(OUT_JSON, `${JSON.stringify(vehicles, null, 2)}\n`, 'utf8');

  console.log(`[OK] 待人工审核 vehicles: ${vehicles.length}`);
  console.log(OUT_JSON);
  console.log('未写入 src/vehicles.generated.js。审核完成后请运行 publish-reviewed。');
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_FILE) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
