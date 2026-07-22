export const GEAR_FALLBACK_IMAGES = Object.freeze({
  helmet: 'assets/gear/helmet.svg',
  gloves: 'assets/gear/gloves.svg',
  armor: 'assets/gear/armor.svg',
  boots: 'assets/gear/boots.svg',
  luggage: 'assets/gear/luggage.svg',
  lights: 'assets/gear/lights.svg',
  intercom: 'assets/gear/intercom.svg',
  theft: 'assets/gear/theft.svg'
});

export const VEHICLE_FALLBACK_IMAGES = Object.freeze({
  scooter: 'assets/vehicles/scooter.svg',
  street: 'assets/vehicles/street.svg',
  sport: 'assets/vehicles/sport.svg',
  adv: 'assets/vehicles/adv.svg',
  cruiser: 'assets/vehicles/cruiser.svg',
  retro: 'assets/vehicles/retro.svg',
  offroad: 'assets/vehicles/offroad.svg',
  collector: 'assets/vehicles/collector.svg'
});

export function encodeQuery(value = '') {
  return encodeURIComponent(String(value).trim());
}

export function marketplaceLinks(keyword = '') {
  const q = encodeQuery(keyword);
  return [
    { id: 'jd', label: '京东比价', url: `https://search.jd.com/Search?keyword=${q}` },
    { id: 'taobao', label: '淘宝比价', url: `https://s.taobao.com/search?q=${q}` },
    { id: 'tmall', label: '天猫比价', url: `https://list.tmall.com/search_product.htm?q=${q}` }
  ];
}

export function motofanLinks(vehicle = {}) {
  const keyword = `${vehicle.brand || ''} ${vehicle.model || ''}`.trim();
  const direct = safeMotofanUrl(vehicle.sourceUrl || vehicle.detailUrl || vehicle.imageSourceUrl || vehicle.motofanUrl || '');
  return {
    direct,
    search: `https://www.baidu.com/s?wd=${encodeQuery(`site:m.58moto.com 摩托范 ${keyword}`)}`,
    keyword
  };
}

export function safeImage(vehicle = {}) {
  const fallback = VEHICLE_FALLBACK_IMAGES[vehicle.type] || VEHICLE_FALLBACK_IMAGES.street;
  if (isAggregateVehicle(vehicle)) return fallback;
  const candidate = vehicle.image || vehicle.imageUrl || vehicle.image_url || '';
  return safeAssetUrl(candidate) || fallback;
}

export function safeGearImage(categoryId, result = {}) {
  const fallback = GEAR_FALLBACK_IMAGES[categoryId] || GEAR_FALLBACK_IMAGES.helmet;
  return safeAssetUrl(result.image, { allowLocal: true }) || fallback;
}

export function isAggregateVehicle(vehicle = {}) {
  if (vehicle.aggregateModel === true) return true;
  const model = String(vehicle.model || vehicle.name || '');
  return /\s(?:\/|／|\||、)\s|\s(?:或|及)\s/.test(model);
}

function safeAssetUrl(value, { allowLocal = false } = {}) {
  const input = String(value || '').trim();
  if (!input) return '';
  if (allowLocal && /^(?:\.\/)?assets\/[a-z0-9/_-]+\.(?:svg|png|jpe?g|webp)$/i.test(input)) return input;
  try {
    const url = new URL(input);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function safeMotofanUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (host === '58moto.com' || host.endsWith('.58moto.com')) ? url.href : '';
  } catch {
    return '';
  }
}
