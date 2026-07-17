import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const entries = ['index.html', 'styles.css', 'assets'];
const publicSrcFiles = [
  'app.js',
  'catalog.generated.js',
  'catalog-reviews.js',
  'config.js',
  'demo-meta.js',
  'engine.js',
  'poster.js',
  'storage.js',
  'vehicles.verified.js'
];

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
for (const entry of entries) {
  await fs.cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
}
await fs.mkdir(path.join(dist, 'src'), { recursive: true });
for (const file of publicSrcFiles) {
  await fs.cp(path.join(root, 'src', file), path.join(dist, 'src', file));
}
const builtSrcFiles = (await fs.readdir(path.join(dist, 'src'))).sort();
if (JSON.stringify(builtSrcFiles) !== JSON.stringify([...publicSrcFiles].sort())) {
  throw new Error(`dist/src 文件白名单不一致：${builtSrcFiles.join(', ')}`);
}
console.log(`Build complete: ${dist}`);
