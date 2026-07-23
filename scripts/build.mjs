import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const publicRootEntries = ['index.html', 'styles.css', 'assets'];
const publicDataFiles = ['base-vehicles.js'];
const publicSrcFiles = [
  'accessories.js',
  'app.js',
  'config.js',
  'engine.js',
  'marketplace.js',
  'poster.js',
  'product-catalog-expanded.js',
  'product-catalog.js',
  'storage.js',
  'vehicles.generated.js'
];

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
for (const entry of publicRootEntries) {
  await fs.cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
}

await fs.mkdir(path.join(dist, 'data'), { recursive: true });
for (const file of publicDataFiles) {
  await fs.cp(path.join(root, 'data', file), path.join(dist, 'data', file));
}

await fs.mkdir(path.join(dist, 'src'), { recursive: true });
for (const file of publicSrcFiles) {
  await fs.cp(path.join(root, 'src', file), path.join(dist, 'src', file));
}

await assertExactEntries(dist, [...publicRootEntries, 'data', 'src']);
await assertExactEntries(path.join(dist, 'data'), publicDataFiles);
await assertExactEntries(path.join(dist, 'src'), publicSrcFiles);

const requiredFiles = new Set([
  'index.html',
  'styles.css',
  ...publicDataFiles.map((file) => `data/${file}`),
  ...publicSrcFiles.map((file) => `src/${file}`)
]);
const builtFiles = await listFiles(dist);
const missingFiles = [...requiredFiles].filter((file) => !builtFiles.includes(file));
const unexpectedFiles = builtFiles.filter(
  (file) => !requiredFiles.has(file) && !file.startsWith('assets/')
);
if (missingFiles.length || unexpectedFiles.length) {
  throw new Error([
    missingFiles.length ? `dist 缺少白名单文件：${missingFiles.join(', ')}` : '',
    unexpectedFiles.length ? `dist 出现非白名单文件：${unexpectedFiles.join(', ')}` : ''
  ].filter(Boolean).join('\n'));
}

console.log(
  `Build complete: ${dist} (${builtFiles.length} files; src/data strict allowlist verified)`
);

async function assertExactEntries(directory, expectedEntries) {
  const actualEntries = (await fs.readdir(directory)).sort();
  const expected = [...expectedEntries].sort();
  if (JSON.stringify(actualEntries) !== JSON.stringify(expected)) {
    throw new Error(
      `${path.relative(root, directory) || 'dist'} 目录白名单不一致：${actualEntries.join(', ')}`
    );
  }
}

async function listFiles(directory, relativeDirectory = '') {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`dist 不允许符号链接：${relativePath}`);
    }
    if (entry.isDirectory()) {
      files.push(...await listFiles(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    } else {
      throw new Error(`dist 包含不支持的文件类型：${relativePath}`);
    }
  }
  return files.sort();
}
