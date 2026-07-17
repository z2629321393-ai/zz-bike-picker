/**
 * 将人工审核完成的 vehicles.motofan.json 发布到前端 generated 模块。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderGeneratedModule } from './normalize-core.mjs';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_FILE);
export const ROOT = path.resolve(SCRIPT_DIR, '../..');
const IN_FILE = path.join(ROOT, 'data', 'vehicles.motofan.json');
const OUT_JS = path.join(ROOT, 'src', 'vehicles.generated.js');

function showHelp() {
  console.log(`用法：node ${path.basename(SCRIPT_FILE)} --confirm-reviewed

仅当 ${IN_FILE} 已完成人工逐条审核，且每条 review_status 均为 approved 时使用。
发布前还会检查来源 URL、价格空值、禁止全文字段和疑似联系方式。`);
}

export async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  if (args.length !== 1 || args[0] !== '--confirm-reviewed') {
    throw new Error('拒绝发布：必须显式传入 --confirm-reviewed，并先完成人工逐条审核。');
  }

  let vehicles;
  try {
    vehicles = JSON.parse(await fs.readFile(IN_FILE, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`找不到待审核文件 ${IN_FILE}。`);
    throw error;
  }

  const source = renderGeneratedModule(vehicles);
  await fs.mkdir(path.dirname(OUT_JS), { recursive: true });
  const temporary = `${OUT_JS}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporary, source, 'utf8');
    await fs.rename(temporary, OUT_JS);
  } finally {
    await fs.rm(temporary, { force: true }).catch(() => {});
  }

  console.log(`[OK] 已发布人工审核车型：${vehicles.length}`);
  console.log(OUT_JS);
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_FILE) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
