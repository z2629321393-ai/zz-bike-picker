/**
 * 摩托范公开页面车型数据采集脚本。
 *
 * 只采集公开页面的有限车型字段；不登录、不绕验证码、不采集评论用户或联系方式。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertNonEmptyUnique,
  assertPublicAccess,
  extractSpecFragments,
  extractUniqueParameterSpecs,
  extractTypeKeywords,
  isAccessBlockedError,
  limitPublicText,
  parseMaxDetails,
  parseMoneyRange,
  sanitizeHttpsImageUrl,
  sanitizeDetailRecord,
  sanitizeListRecord
} from './pipeline-core.mjs';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_FILE);
export const ROOT = path.resolve(SCRIPT_DIR, '../..');
const OUT_DIR = path.join(ROOT, 'data');
const RAW_OUT = path.join(OUT_DIR, 'motofan_raw.json');
const DETAIL_OUT = path.join(OUT_DIR, 'motofan_details.json');

const PRICE_BUCKETS = [
  '0-0.5', '0.5-1', '1-2', '2-3', '3-5', '5-8', '8-10',
  '10-15', '15-20', '20-30', '30-50', '50-100', '100-999'
];

const TYPE_KEYWORDS = ['街车', '跑车', '踏板', '太子', '拉力', '复古', '旅行', '三轮', '弯梁'];

const BASE_CONFIG = {
  headless: true,
  slowMo: 0,
  listScrollRounds: 18,
  detailScrollRounds: 5,
  minDelayMs: 1000,
  maxDelayMs: 2200,
  resume: true
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = (config) => Math.round(
  config.minDelayMs + Math.random() * (config.maxDelayMs - config.minDelayMs)
);

function showHelp() {
  console.log(`用法：node ${path.basename(SCRIPT_FILE)} [--help]

环境变量：
  MAX_DETAILS  可选；必须是 1..100 的整数。未设置时采集全部去重详情。
  PARAMETERS_ONLY  可选；设为 1 时复用现有 raw/details，只补采未检查的公开参数页。
  CHROMIUM_EXECUTABLE_PATH  可选；使用电脑已有的 Chrome/Chromium 可执行文件。

输出路径固定按脚本位置解析，与当前工作目录无关：
  ${RAW_OUT}
  ${DETAIL_OUT}`);
}

async function pathExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function createLaunchOptions(env = process.env, config = BASE_CONFIG) {
  const options = { headless: config.headless, slowMo: config.slowMo };
  const configuredPath = String(env.CHROMIUM_EXECUTABLE_PATH || '').trim();
  if (!configuredPath) return options;

  const executablePath = path.resolve(configuredPath);
  const executable = await fs.stat(executablePath).catch(() => null);
  if (!executable?.isFile()) {
    throw new Error(`CHROMIUM_EXECUTABLE_PATH 不是可执行文件：${executablePath}`);
  }
  return { ...options, executablePath };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeRawRecords(file, items) {
  const safeItems = assertNonEmptyUnique(items);
  await writeJson(file, safeItems);
  return safeItems;
}

function parseIdFromUrl(url = '') {
  const match = String(url).match(/\/garage\/detail\/(\d+)/);
  return match ? match[1] : null;
}

async function autoScroll(page, rounds = 10) {
  let lastHeight = 0;
  for (let index = 0; index < rounds; index += 1) {
    const height = await page.evaluate(() => document.body?.scrollHeight || 0).catch(() => 0);
    if (height === lastHeight && index > 2) break;
    lastHeight = height;
    await page.evaluate(() => window.scrollTo(0, document.body?.scrollHeight || 0)).catch(() => {});
    await sleep(700);
  }
}

async function assertPageIsPublic(page, response, requestedUrl, phase) {
  const status = response?.status?.() ?? null;
  const finalUrl = page.url?.() || requestedUrl;
  assertPublicAccess({ status, finalUrl, url: requestedUrl, phase });

  const probe = await page.evaluate(() => {
    const title = document.title || '';
    const text = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
    const patterns = [
      /验证码|图形验证|滑块验证|人机验证|安全验证|完成验证|captcha|verify\s+(?:that\s+)?you\s+are\s+human/i,
      /访问(?:受限|限制|过于频繁)|请求(?:过于)?频繁|操作过于频繁|禁止访问|拒绝访问|稍后再试|access\s+denied|too\s+many\s+requests|rate\s*limit/i,
      /请先登录|登录后(?:查看|访问|继续)|登录才能|需要登录|账号登录|login\s+required|sign\s+in\s+to\s+continue/i
    ];
    const obstruction = patterns.map((pattern) => text.match(pattern)?.[0] || '').find(Boolean) || '';
    return { title: title.slice(0, 300), text: `${text.slice(0, 24000)} ${obstruction}` };
  }).catch(() => ({ title: '', text: '' }));

  assertPublicAccess({ ...probe, status, finalUrl, url: requestedUrl, phase });
}

async function collectListPage(page, url, sourceTag, config) {
  console.log('[LIST]', sourceTag, url);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await assertPageIsPublic(page, response, url, '列表页加载');
  await autoScroll(page, config.listScrollRounds);
  await assertPageIsPublic(page, response, url, '列表页滚动后');

  const items = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll('a[href*="/garage/detail/"]')];
    return anchors.map((anchor) => ({
      href: new URL(anchor.getAttribute('href') || '', location.origin).href,
      text: (anchor.innerText || anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 800)
    })).filter((item) => item.href && item.text);
  });

  return items.map((item) => {
    const id = parseIdFromUrl(item.href);
    const price = parseMoneyRange(item.text);
    const modelMatch = item.text.match(/(?:\d{4}款|全新车型)?\s*([^指]+?)\s*指导价/);
    const countMatch = item.text.match(/共(\d+)款车符合条件/);
    return sanitizeListRecord({
      source: sourceTag,
      id,
      url: item.href,
      list_text: item.text,
      list_name: modelMatch ? limitPublicText(modelMatch[1], 160) : null,
      variant_count: countMatch ? Number(countMatch[1]) : null,
      ...price
    });
  }).filter((item) => item.id && item.url);
}

async function collectDetailPage(page, item, config) {
  console.log('[DETAIL]', item.id, item.list_name || item.url);
  const response = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await assertPageIsPublic(page, response, item.url, '详情页加载');
  await autoScroll(page, config.detailScrollRounds);
  await assertPageIsPublic(page, response, item.url, '详情页滚动后');

  const data = await page.evaluate(() => {
    const text = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
    const title = document.querySelector('h1,h2,h3,h4')?.innerText?.trim() || '';
    const absoluteUrl = (value) => {
      try {
        return new URL(String(value || '').trim(), location.href).href;
      } catch {
        return '';
      }
    };
    const metaImage = absoluteUrl(
      document.querySelector('meta[property="og:image"],meta[name="og:image"],meta[property="twitter:image"],meta[name="twitter:image"]')
        ?.getAttribute('content')
    );
    const titleTokens = title.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((token) => token.length >= 2);
    const imageCandidates = [...document.querySelectorAll('img')].map((image, index) => {
      const sources = [
        image.currentSrc,
        image.getAttribute('data-src'),
        image.getAttribute('data-original'),
        image.getAttribute('data-lazy-src'),
        image.getAttribute('src'),
        image.getAttribute('srcset')?.split(',')[0]?.trim().split(/\s+/)[0]
      ].map((value) => String(value || '').trim()).filter(Boolean);
      const rawSource = sources.find((value) => !/^(?:data|blob):/i.test(value) && !/placeholder|default/i.test(value)) || sources[0] || '';
      const src = absoluteUrl(rawSource);
      const alt = (image.getAttribute('alt') || '').trim();
      const marker = `${src} ${alt} ${image.className || ''} ${image.parentElement?.className || ''}`.toLowerCase();
      const width = image.naturalWidth || Number(image.getAttribute('width')) || image.clientWidth || 0;
      const height = image.naturalHeight || Number(image.getAttribute('height')) || image.clientHeight || 0;
      const area = width * height;
      let score = Math.min(area, 2_000_000) / 10_000;
      if (image.matches('[class*="cover"],[class*="vehicle"],[class*="motor"],[class*="swiper"] img')) score += 160;
      if (image.closest('[class*="banner"],[class*="gallery"],[class*="photo"],[class*="vehicle"],[class*="motor"],[class*="swiper"]')) score += 120;
      if (titleTokens.some((token) => alt.toLowerCase().includes(token))) score += 80;
      if (area === 0) score += Math.max(0, 20 - index / 10);
      if (/logo|avatar|icon|qrcode|qr-code|二维码|头像|经销商|dealer|advert|\bad\b|placeholder|default/i.test(marker)) score -= 1000;
      if (/^(?:data|blob):/i.test(src) || (width > 0 && height > 0 && (width < 240 || height < 140))) score -= 1000;
      return { src, score };
    }).filter((candidate) => candidate.src && candidate.score > -500);
    imageCandidates.sort((left, right) => right.score - left.score);
    const priceLine = text.match(/厂商指导价[:：]\s*[¥￥]?\s*[0-9,]+(?:\s*(?:-|–|—|~|至)\s*[¥￥]?\s*[0-9,]+)?|厂商指导价[:：]\s*(?:暂无报价|即将上市)/)?.[0] || '';
    const usedMin = text.match(/二手摩托\s*最低[:：]?\s*[¥￥]\s*([0-9,]+)/)?.[1] || '';
    const ranks = [...text.matchAll(/(人气榜NO\.\d+|口碑榜NO\.\d+)/gi)].map((match) => match[1]).slice(0, 4);
    const typeKeywords = [...new Set(text.match(/踏板|拉力|ADV|探险|旅行|太子|巡航|Bobber|Chopper|跑车|仿赛|竞速|赛道|Ninja|CBR|GSX|复古|咖啡|Scrambler|攀爬|越野|林道|Rally|街车/gi) || [])].slice(0, 12);
    const specPatterns = [
      /(?:座高|座椅高度)[^0-9。；;]{0,12}\d{3,4}\s*mm/i,
      /(?:整备质量|整车质量)[^0-9。；;]{0,12}\d{2,3}\s*kg/i,
      /排量[^0-9。；;]{0,12}\d{2,4}\s*(?:cc|mL)/i
    ];
    const specFragments = specPatterns.map((pattern) => text.match(pattern)?.[0] || '').filter(Boolean).map((fragment) => fragment.slice(0, 100));
    return {
      title: title.slice(0, 180),
      priceLine: priceLine.slice(0, 160),
      usedMin,
      ranks,
      typeKeywords,
      specFragments,
      metaImage,
      primaryImage: imageCandidates[0]?.src || ''
    };
  });

  const fallbackTitle = data.title || item.list_name || '';
  const hTitle = fallbackTitle.match(/#{1,6}\s*([^¥￥]+?)\s*厂商指导价/)?.[1] || fallbackTitle;
  const detailPriceText = data.priceLine || item.price_text || '';
  const imageUrl = sanitizeHttpsImageUrl(data.metaImage) || sanitizeHttpsImageUrl(data.primaryImage);

  return sanitizeDetailRecord({
    ...item,
    detail_url: item.url,
    image_url: imageUrl,
    image_source_url: imageUrl ? item.url : '',
    detail_title: limitPublicText(hTitle.replace(/^#+\s*/, ''), 180),
    detail_price_text: detailPriceText,
    ...parseMoneyRange(detailPriceText),
    used_min_price: data.usedMin ? Number(data.usedMin.replace(/,/g, '')) : null,
    ranks: data.ranks,
    type_keywords: extractTypeKeywords(data.typeKeywords.join(' ')),
    spec_fragments: extractSpecFragments(data.specFragments.join(' ')),
    fetched_at: new Date().toISOString()
  });
}

async function collectParameterPage(page, item, config) {
  const url = `https://m.58moto.com/garage/parameter/${encodeURIComponent(item.id)}?type=all`;
  console.log('[PARAMETER]', item.id, url);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await assertPageIsPublic(page, response, url, '参数页加载');
  await autoScroll(page, Math.min(config.detailScrollRounds, 3));
  await assertPageIsPublic(page, response, url, '参数页滚动后');
  const pageText = await page.locator('body').innerText();
  return extractUniqueParameterSpecs(pageText);
}

export function selectResumeDetails(rows, targets, maxDetails = 0) {
  const allowedIds = maxDetails > 0 ? new Set(targets.map((row) => String(row.id))) : null;
  const byId = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const safe = sanitizeDetailRecord(row);
    if (!safe.id || !safe.url) continue;
    if (allowedIds && !allowedIds.has(String(safe.id))) continue;
    if (!byId.has(safe.id)) byId.set(safe.id, safe);
  }
  const selected = [...byId.values()];
  return maxDetails > 0 ? selected.slice(0, maxDetails) : selected;
}

export function shouldCollectDetailPage(detail, parametersOnly = false) {
  return !detail || (!parametersOnly && !detail.image_url);
}

function rethrowIfBlocked(error) {
  if (isAccessBlockedError(error)) throw error;
}

export async function main(args = process.argv.slice(2), env = process.env) {
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  const unknownArgs = args.filter((arg) => !['--help', '-h'].includes(arg));
  if (unknownArgs.length > 0) throw new Error(`未知参数：${unknownArgs.join(' ')}`);

  if (env.PARAMETERS_ONLY !== undefined && !['0', '1'].includes(env.PARAMETERS_ONLY)) {
    throw new Error('PARAMETERS_ONLY 只接受 0、1 或未设置。');
  }
  const parametersOnly = env.PARAMETERS_ONLY === '1';
  const config = { ...BASE_CONFIG, maxDetails: parseMaxDetails(env.MAX_DETAILS) };
  const { chromium } = await import('@playwright/test');
  await fs.mkdir(OUT_DIR, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch(await createLaunchOptions(env, config));
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 },
      locale: 'zh-CN'
    });
    const page = await context.newPage();

    let unique;
    if (parametersOnly) {
      if (!await pathExists(RAW_OUT)) throw new Error(`找不到 ${RAW_OUT}，无法只补采参数页。`);
      unique = assertNonEmptyUnique((await readJson(RAW_OUT)).map(sanitizeListRecord));
      console.log(`[RESUME] existing list: ${unique.length} <- ${RAW_OUT}`);
    } else {
      const collected = [];
      for (const bucket of PRICE_BUCKETS) {
        const url = `https://m.58moto.com/garage/list?p=${encodeURIComponent(bucket)}`;
        try {
          collected.push(...await collectListPage(page, url, `price:${bucket}`, config));
          await sleep(jitter(config));
        } catch (error) {
          rethrowIfBlocked(error);
          console.warn('[WARN] list failed:', url, error.message);
        }
      }

      for (const keyword of TYPE_KEYWORDS) {
        const url = `https://m.58moto.com/garage/list?keyword=${encodeURIComponent(keyword)}`;
        try {
          collected.push(...await collectListPage(page, url, `type:${keyword}`, config));
          await sleep(jitter(config));
        } catch (error) {
          rethrowIfBlocked(error);
          console.warn('[WARN] type list failed:', url, error.message);
        }
      }

      const byId = new Map();
      for (const item of collected) {
        if (!byId.has(item.id)) byId.set(item.id, sanitizeListRecord(item));
      }
      unique = [...byId.values()];
      await writeRawRecords(RAW_OUT, unique);
      console.log(`[OK] list unique: ${unique.length} -> ${RAW_OUT}`);
    }

    const targets = config.maxDetails > 0 ? unique.slice(0, config.maxDetails) : unique;
    let details = [];
    if (config.resume && await pathExists(DETAIL_OUT)) {
      const loaded = await readJson(DETAIL_OUT);
      if (!Array.isArray(loaded)) throw new TypeError(`${DETAIL_OUT} 必须是 JSON 数组。`);
      details = selectResumeDetails(loaded, targets, config.maxDetails);
      // 将旧版 resume 数据立即投影到白名单，清除历史 body、评论或联系方式字段。
      await writeJson(DETAIL_OUT, details);
    }

    for (const item of targets) {
      try {
        const existingIndex = details.findIndex((detail) => detail.id === item.id);
        let detail = existingIndex >= 0 ? details[existingIndex] : null;
        if (!detail && parametersOnly) throw new Error(`详情 ${item.id} 尚不存在，不能只补采参数页。`);
        if (shouldCollectDetailPage(detail, parametersOnly)) {
          const previous = detail;
          const refreshed = await collectDetailPage(page, item, config);
          detail = sanitizeDetailRecord({
            ...refreshed,
            specs: previous?.specs || refreshed.specs,
            parameter_checked: Boolean(previous?.parameter_checked)
          });
        }
        if (!detail.parameter_checked) {
          const specs = await collectParameterPage(page, item, config);
          detail = sanitizeDetailRecord({ ...detail, specs, parameter_checked: true });
        }
        if (existingIndex >= 0) details[existingIndex] = detail;
        else details.push(detail);
        await writeJson(DETAIL_OUT, details);
        await sleep(jitter(config));
      } catch (error) {
        rethrowIfBlocked(error);
        console.warn('[WARN] detail failed:', item.url, error.message);
      }
    }

    console.log(`[OK] detail total: ${details.length} -> ${DETAIL_OUT}`);
  } finally {
    await browser?.close().catch(() => {});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_FILE) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
