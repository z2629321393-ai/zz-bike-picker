import {
  APP_VERSION,
  DATA_VERSION,
  DEFAULT_ANSWERS,
  QUESTIONS,
  TYPE_LABELS,
  budgetLabel,
  labelFor
} from './config.js';
import { CATALOG_META, CATALOG_STATUS, PUBLIC_CATALOG } from './catalog.generated.js';
import { CATALOG_REVIEW_META, CATALOG_REVIEWS } from './catalog-reviews.js';
import { DEMO_VEHICLE_META } from './demo-meta.js';
import { VERIFIED_REVIEW_META, VERIFIED_VEHICLES } from './vehicles.verified.js';
import {
  analyzeConflicts,
  buildAvoidAdvice,
  buildCopyText,
  buildDecisionProfile,
  calculateClarity,
  calculateTypeScores,
  dataQualityLabel,
  formatPrice,
  mergeAndNormalizeVehicles,
  rankVehicles
} from './engine.js';
import { clearState, createInitialState, loadState, saveState } from './storage.js';
import { downloadCanvas, renderResultPoster } from './poster.js';

// 正式结果只允许双状态审核脚本生成的白名单；示例库与第三方候选永不参与用户推荐。
const VEHICLES = mergeAndNormalizeVehicles(VERIFIED_VEHICLES);
const VERIFIED_RECOMMENDATION_COUNT = VERIFIED_REVIEW_META.recommendable;
const CATALOG_REVIEW_BY_ID = new Map(CATALOG_REVIEWS.map((review) => [review.source_id, review]));
const OFFICIAL_EVIDENCE_STATUSES = new Set([
  'official_current',
  'official_family_current',
  'official_catalog_only',
  'official_orderable_mismatch',
  'official_store_current',
  'successor_current_ambiguous',
  'superseded_or_ambiguous',
  'china_mention_only'
]);
const CATALOG_OFFICIAL_EVIDENCE_COUNT = CATALOG_REVIEWS.filter((review) =>
  OFFICIAL_EVIDENCE_STATUSES.has(review.market_status)
).length;
const CATALOG_IDENTITY_ISSUE_COUNT = CATALOG_REVIEW_META.reviewed - CATALOG_OFFICIAL_EVIDENCE_COUNT;
const CATALOG_PAGE_SIZE = 60;
const catalogState = { query: '', status: 'all', review: 'all', visible: CATALOG_PAGE_SIZE };
let state = createInitialState();
let currentResult = null;
let autoAdvanceTimer = null;

function cancelAutoAdvance() {
  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = null;
}

const els = {
  intro: document.getElementById('introView'),
  interview: document.getElementById('interviewView'),
  result: document.getElementById('resultView'),
  questionCard: document.getElementById('questionCard'),
  hostSpeech: document.getElementById('hostSpeech'),
  profileChips: document.getElementById('profileChips'),
  stepLabel: document.getElementById('stepLabel'),
  sectionLabel: document.getElementById('sectionLabel'),
  progressNumber: document.getElementById('progressNumber'),
  progressTrack: document.getElementById('progressTrack'),
  progressBar: document.getElementById('progressBar'),
  continueBtn: document.getElementById('continueBtn'),
  dataPill: document.getElementById('dataPill'),
  toast: document.getElementById('toast'),
  vehicleModal: document.getElementById('vehicleModal'),
  vehicleModalContent: document.getElementById('vehicleModalContent'),
  posterModal: document.getElementById('posterModal'),
  posterCanvas: document.getElementById('posterCanvas'),
  dataModal: document.getElementById('dataModal'),
  dataModalContent: document.getElementById('dataModalContent')
};

init();

function init() {
  updateDataPill();
  syncContinueButton();

  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('keydown', handleKeys);

  const sharedType = new URLSearchParams(location.search).get('result');
  if (TYPE_LABELS[sharedType]) {
    const shared = document.createElement('div');
    shared.className = 'feature-row';
    shared.innerHTML = `<span>分享结果：${escapeHtml(TYPE_LABELS[sharedType].name)}</span>`;
    document.querySelector('.intro-copy .microcopy')?.before(shared);
  }

  window.scrollTo({ top: 0, behavior: 'auto' });
}

function handleClick(event) {
  const actionNode = event.target.closest('[data-action]');
  if (actionNode) {
    const action = actionNode.dataset.action;
    if (action === 'start') startFresh();
    if (action === 'continue') continueSaved();
    if (action === 'home') {
      cancelAutoAdvance();
      showView('intro');
    }
    if (action === 'restart') restart();
    if (action === 'back') previousQuestion();
    if (action === 'next') nextQuestion();
    if (action === 'share') copyResult();
    if (action === 'poster') openPoster();
    if (action === 'download-poster') downloadCanvas(els.posterCanvas);
    if (action === 'close-modal') els.vehicleModal.close();
    if (action === 'close-poster') els.posterModal.close();
    if (action === 'data-info') openDataInfo();
    if (action === 'close-data') els.dataModal.close();
    if (action === 'load-catalog') {
      catalogState.visible += CATALOG_PAGE_SIZE;
      renderCatalogResults();
    }
    return;
  }

  const select = event.target.closest('[data-select]');
  if (select) {
    const key = select.dataset.select;
    const value = key === 'budget' ? Number(select.dataset.value) : select.dataset.value;
    state.answers[key] = value;
    saveState(state);
    renderQuestion();
    cancelAutoAdvance();
    autoAdvanceTimer = setTimeout(() => nextQuestion(true), 420);
    return;
  }

  const segment = event.target.closest('[data-segment]');
  if (segment) {
    state.answers[segment.dataset.segment] = segment.dataset.value;
    saveState(state);
    renderQuestion();
    return;
  }

  const multi = event.target.closest('[data-multi]');
  if (multi) {
    const set = new Set(state.answers.avoid || []);
    set.has(multi.dataset.value) ? set.delete(multi.dataset.value) : set.add(multi.dataset.value);
    state.answers.avoid = [...set];
    saveState(state);
    renderQuestion();
    return;
  }

  const vehicle = event.target.closest('[data-vehicle-id]');
  if (vehicle) openVehicleModal(vehicle.dataset.vehicleId);
}

function handleInput(event) {
  if (event.target.id === 'heightRange') {
    state.answers.height = Number(event.target.value);
    saveState(state);
    updateBodyLive();
  }
  if (event.target.id === 'weightRange') {
    state.answers.weight = Number(event.target.value);
    saveState(state);
    updateBodyLive();
  }
  if (event.target.id === 'catalogSearch') {
    catalogState.query = event.target.value;
    catalogState.visible = CATALOG_PAGE_SIZE;
    renderCatalogResults();
  }
  if (event.target.id === 'catalogStatus') {
    catalogState.status = event.target.value;
    catalogState.visible = CATALOG_PAGE_SIZE;
    renderCatalogResults();
  }
  if (event.target.id === 'catalogReview') {
    catalogState.review = event.target.value;
    catalogState.visible = CATALOG_PAGE_SIZE;
    renderCatalogResults();
  }
}

function handleKeys(event) {
  if (event.key === 'Escape') {
    if (els.vehicleModal.open) els.vehicleModal.close();
    if (els.posterModal.open) els.posterModal.close();
    if (els.dataModal.open) els.dataModal.close();
  }

  const answerControl = event.target.closest?.('[data-select],[data-segment],[data-multi]');
  if (answerControl && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    answerControl.click();
    return;
  }

  const vehicle = event.target.closest?.('[data-vehicle-id]');
  if (vehicle && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openVehicleModal(vehicle.dataset.vehicleId);
    return;
  }

  if (!els.interview.classList.contains('is-active')) return;
  if (event.target.closest?.('button,input,select,textarea')) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    nextQuestion();
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    previousQuestion();
  }
  if (/^[1-9]$/.test(event.key)) {
    const cards = [...els.questionCard.querySelectorAll('[data-select],[data-multi]')];
    cards[Number(event.key) - 1]?.click();
  }
}

function startFresh() {
  cancelAutoAdvance();
  state = createInitialState();
  saveState(state);
  showView('interview');
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'auto' });
  focusCurrentQuestion();
}

function continueSaved() {
  cancelAutoAdvance();
  state = loadState() || createInitialState();
  state.answers = {
    ...DEFAULT_ANSWERS,
    ...(state.answers || {}),
    avoid: Array.isArray(state.answers?.avoid) ? state.answers.avoid : []
  };
  showView('interview');
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'auto' });
  focusCurrentQuestion();
}

function restart() {
  cancelAutoAdvance();
  clearState();
  state = createInitialState();
  currentResult = null;
  els.continueBtn.classList.add('is-hidden');
  history.replaceState({}, '', location.pathname);
  showView('intro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showView(name) {
  [els.intro, els.interview, els.result].forEach((element) => element.classList.remove('is-active'));
  ({ intro: els.intro, interview: els.interview, result: els.result })[name].classList.add('is-active');
  if (name === 'intro') syncContinueButton();
}

function syncContinueButton() {
  const saved = loadState();
  const canContinue = Boolean(saved && !saved.completed && (saved.current > 0 || saved.answers?.usage));
  els.continueBtn.classList.toggle('is-hidden', !canContinue);
}

function focusCurrentQuestion() {
  els.questionCard.querySelector('.question-title')?.focus({ preventScroll: true });
}

function renderQuestion() {
  const question = QUESTIONS[state.current];
  const progress = Math.round(((state.current + 1) / QUESTIONS.length) * 100);
  els.stepLabel.textContent = `第${state.current + 1}轮 / 共${QUESTIONS.length}轮`;
  els.sectionLabel.textContent = question.section;
  els.progressNumber.textContent = `${progress}%`;
  els.progressBar.style.width = `${progress}%`;
  els.progressTrack.setAttribute('aria-valuenow', String(progress));
  els.hostSpeech.innerHTML = getHostSpeech(question.id);
  updateProfileChips();

  const renderer = {
    single: renderSingle,
    body: renderBody,
    cost: renderCost,
    style: renderStyle,
    roadload: renderRoadLoad,
    commuteParking: renderCommuteParking,
    multi: renderMulti
  }[question.type];

  els.questionCard.innerHTML = `
    <div class="question-eyebrow">${escapeHtml(question.eyebrow)}</div>
    <h2 class="question-title" tabindex="-1">${escapeHtml(question.title)}</h2>
    <p class="question-help">${escapeHtml(question.help)}</p>
    ${renderer(question)}
  `;

  const back = document.querySelector('[data-action="back"]');
  const next = document.querySelector('[data-action="next"]');
  back.disabled = state.current === 0;
  next.textContent = state.current === QUESTIONS.length - 1 ? '生成结论 →' : '下一题 →';
}

function renderSingle(question) {
  const selected = state.answers[question.id];
  return `<div class="option-grid">${question.options.map((option, index) => `
    <button class="option-card ${String(selected) === String(option.value) ? 'is-selected' : ''}" type="button" data-select="${escapeHtml(question.id)}" data-value="${escapeHtml(option.value)}" aria-pressed="${String(selected) === String(option.value)}">
      <span class="option-icon">${escapeHtml(option.icon)}</span>
      <span class="option-main"><b>${escapeHtml(option.label)}</b><small>${escapeHtml(option.detail)}</small></span>
      <span class="option-key">${index + 1}</span>
    </button>
  `).join('')}</div>`;
}

function renderBody() {
  const height = state.answers.height;
  const weight = state.answers.weight;
  const fit = bodyFitText(height, weight);
  return `<div class="body-layout">
    <div class="range-card">
      <div class="range-top"><span>身高</span><strong id="heightValue">${height} cm</strong></div>
      <input id="heightRange" type="range" min="145" max="205" step="1" value="${height}" aria-label="身高">
      <div class="range-marks"><span>145</span><span>175</span><span>205</span></div>
    </div>
    <div class="range-card">
      <div class="range-top"><span>体重</span><strong id="weightValue">${weight} kg</strong></div>
      <input id="weightRange" type="range" min="35" max="145" step="1" value="${weight}" aria-label="体重">
      <div class="range-marks"><span>35</span><span>90</span><span>145</span></div>
    </div>
    <div class="body-preview">
      <small>当前人车比例判断</small>
      <strong id="bodyFitTitle">${escapeHtml(fit.title)}</strong>
      <p id="bodyFitDesc">${escapeHtml(fit.desc)}</p>
    </div>
  </div>`;
}

function renderCost() {
  return `<div class="dual-grid">
    ${controlCard('maintenance', '保养维护意愿', '机油、轮胎、刹车、维修和定期检查', [['low', '基础就行'], ['mid', '正常养护'], ['high', '愿意升级'], ['whatever', '体验优先']])}
    ${controlCard('ownership', '持有成本承受', '油耗、保险、折旧、摔车件和停车风险', [['low', '越省越好'], ['mid', '合理即可'], ['high', '值得就行'], ['notcare', '开心优先']])}
  </div>`;
}

function renderStyle() {
  return `<div class="dual-grid">
    ${controlCard('looks', '外观精致要求', '你愿不愿意为了外形接受实用性损失', [['low', '能看就行'], ['mid', '顺眼即可'], ['high', '必须精致'], ['unique', '越怪越好']])}
    ${controlCard('mod', '改装倾向', '原厂、轻改、性能升级还是重度姿态化', [['none', '完全原厂'], ['light', '轻改实用'], ['medium', '性能升级'], ['heavy', '重度改装']])}
  </div>`;
}

function renderRoadLoad() {
  return `<div class="dual-grid">
    ${controlCard('road', '主要路况', '你真正骑得最多的路，不是梦想里的路', [['city', '城市铺装'], ['mixed', '城市+郊区'], ['bad', '烂路/乡道'], ['mountain', '跑山弯道']])}
    ${controlCard('load', '载人装载', '长期带人、带箱会改变车的重心和需求', [['solo', '基本单人'], ['passenger', '经常带人'], ['luggage', '经常带箱'], ['both', '带人+行李']])}
  </div>`;
}

function renderCommuteParking() {
  return `<div class="dual-grid">
    ${controlCard('commuteDistance', '日常骑行距离', '距离越长，坐姿、风阻和舒适问题越难忽略', [['short', '10km以内'], ['medium', '10—30km'], ['long', '30km以上'], ['weekend', '周末为主']])}
    ${controlCard('parking', '主要停车环境', '停车环境会改变你对价格、体量和防盗的选择', [['indoor', '室内固定'], ['monitored', '监控看管'], ['outdoor', '露天公共'], ['uncertain', '临时停放']])}
  </div>`;
}

function renderMulti() {
  const options = [
    { value: 'repair', icon: '修', label: '小毛病多', detail: '不想把时间耗在维修店' },
    { value: 'hot', icon: '热', label: '热、累、震、吵', detail: '通勤体验不能太折磨' },
    { value: 'heavy', icon: '重', label: '车太重', detail: '停车挪车和低速掉头压力大' },
    { value: 'short', icon: '小', label: '骑上去显小', detail: '很在意人车视觉比例' },
    { value: 'expensive', icon: '贵', label: '摔一下太贵', detail: '不接受高价覆盖件和进口配件' },
    { value: 'boring', icon: '闷', label: '太无聊', detail: '没有情绪价值就不想骑' }
  ];

  return `<div class="option-grid">${options.map((option, index) => `
    <button class="option-card ${state.answers.avoid.includes(option.value) ? 'is-selected' : ''}" type="button" data-multi="avoid" data-value="${option.value}" aria-pressed="${state.answers.avoid.includes(option.value)}">
      <span class="option-icon">${option.icon}</span>
      <span class="option-main"><b>${option.label}</b><small>${option.detail}</small></span>
      <span class="option-key">${index + 1}</span>
    </button>
  `).join('')}</div>
  <div class="multi-note"><span>没有明显雷区也可以直接生成结果。</span><b>已选 ${state.answers.avoid.length} 项</b></div>`;
}

function controlCard(key, title, description, options) {
  return `<div class="control-card">
    <h4>${escapeHtml(title)}</h4>
    <p>${escapeHtml(description)}</p>
    <div class="segmented four">${options.map(([value, label]) => `
      <button class="segment ${state.answers[key] === value ? 'is-selected' : ''}" type="button" data-segment="${key}" data-value="${value}" aria-pressed="${state.answers[key] === value}">${label}</button>
    `).join('')}</div>
  </div>`;
}

function updateBodyLive() {
  const fit = bodyFitText(state.answers.height, state.answers.weight);
  setText('heightValue', `${state.answers.height} cm`);
  setText('weightValue', `${state.answers.weight} kg`);
  setText('bodyFitTitle', fit.title);
  setText('bodyFitDesc', fit.desc);
  els.hostSpeech.innerHTML = getHostSpeech('body');
  updateProfileChips();
}

function bodyFitText(height, weight) {
  if (height >= 188) return { title: '优先大车架', desc: '小踏板和迷你复古容易显小。重点试ADV、大车架街车和中大型巡航。' };
  if (height >= 180) return { title: '注意视觉比例', desc: '不是不能骑小车，但镜头里容易像骑玩具。试坐时看膝角和上身比例。' };
  if (height <= 160) return { title: '座高是硬门槛', desc: '优先低座、窄坐垫和轻车。高座拉力必须实际试撑地和低速掉头。' };
  if (height <= 168) return { title: '先控座高和车重', desc: '多数街车和踏板可选，ADV要看坐垫宽度，不要只看座高参数。' };
  if (weight >= 100) return { title: '车架与避震要够用', desc: '过小过轻的车可能显得局促，带人时更要看后避震和制动余量。' };
  return { title: '主流车型适配面广', desc: '你的人车比例没有明显硬伤，最终差异主要来自用途、预算和成本。' };
}

function getHostSpeech(id) {
  const answers = state.answers;
  const speeches = {
    usage: '先别说品牌。<br>我得先知道这台车到底替你干什么。<small>同一台车，通勤和跑山的评价可以完全相反。</small>',
    budget: `预算先卡死。<br>不然后面所有推荐都是空谈。<small>当前暂定：${budgetLabel(answers.budget)}</small>`,
    body: `${answers.height >= 180 ? '你这个身高，车不能只看座高，还得看体量。' : answers.height <= 165 ? '你这里先不谈帅，能稳稳撑住才是第一步。' : '你的身高适配面不窄，后面主要看用途。'}<small>${answers.height}cm / ${answers.weight}kg，先做视觉和控车初筛。</small>`,
    experience: '经验不是面子。<br>它决定你犯错以后还有多少余量。<small>新手更需要线性、ABS和可控车重。</small>',
    personality: '这一题最容易装。<br>别选别人觉得理性的，选你真会掏钱的。<small>买车动机不诚实，推荐一定会歪。</small>',
    cost: '很多人买车只看首付。<br>真正劝退人的，是第二年以后。<small>轮胎、保险、摔车件和折旧都算持有成本。</small>',
    style: '外观党没问题。<br>问题是你愿不愿意为好看付出代价。<small>姿态、排气、避震不是装上去就结束。</small>',
    power: '排量不是面子分。<br>动力越大，犯错成本越大。<small>我更关心你在哪里用，而不是你能买多大。</small>',
    roadload: '空车试骑和满载摩旅，<br>基本是两台不同的车。<small>载人、尾箱和烂路都会改变重心。</small>',
    commuteParking: '停车环境也在替你选车。<br>露天临停和室内车位，不是同一种持有难度。<small>防盗、剐蹭、日晒和挪车都要算。</small>',
    age: '老车不一定便宜。<br>便宜的车价，可能换来昂贵的时间。<small>手续、车况、配件和维修师傅缺一不可。</small>',
    avoid: '最后不问你喜欢什么。<br>我问你什么东西绝对忍不了。<small>排除法通常比“猜你喜欢”更准确。</small>'
  };
  return speeches[id] || '';
}

function updateProfileChips() {
  const answers = state.answers;
  const chips = [];
  if (answers.usage) chips.push(labelFor('usage', answers.usage));
  if (answers.budget) chips.push(budgetLabel(answers.budget));
  if (answers.height) chips.push(`${answers.height}cm`);
  if (answers.experience) chips.push(labelFor('experience', answers.experience));
  if (answers.personality) chips.push(labelFor('personality', answers.personality));
  if (answers.power) chips.push(labelFor('power', answers.power));
  if (answers.parking) chips.push(labelFor('parking', answers.parking));
  if (answers.age === 'collector') chips.push('收藏模式');
  els.profileChips.innerHTML = chips.length
    ? chips.slice(0, 8).map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')
    : '<span class="empty-chip">回答后实时更新</span>';
}

function nextQuestion(auto = false) {
  if (auto) {
    autoAdvanceTimer = null;
  } else {
    cancelAutoAdvance();
  }
  const question = QUESTIONS[state.current];
  if (!isQuestionComplete(question)) {
    if (!auto) showToast('先回答这一题');
    return;
  }

  if (state.current < QUESTIONS.length - 1) {
    state.current += 1;
    saveState(state);
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'auto' });
    focusCurrentQuestion();
    return;
  }

  state.completed = true;
  saveState(state);
  buildResult();
}

function previousQuestion() {
  cancelAutoAdvance();
  if (state.current <= 0) return;
  state.current -= 1;
  saveState(state);
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'auto' });
  focusCurrentQuestion();
}

function isQuestionComplete(question) {
  if (question.type === 'single') {
    return state.answers[question.id] !== null && state.answers[question.id] !== undefined;
  }
  return true;
}

function buildResult() {
  const answers = { ...state.answers, avoid: [...state.answers.avoid] };
  const typeScores = calculateTypeScores(answers);
  const ranking = rankVehicles(VEHICLES, answers, typeScores, 4);
  const conflicts = analyzeConflicts(answers, ranking.primary);
  const avoidAdvice = buildAvoidAdvice(answers, ranking.primary);
  const clarity = calculateClarity(ranking.sortedTypes, conflicts, ranking.recommendations.length);
  const decisionProfile = buildDecisionProfile(answers, ranking.primary, ranking.secondary);
  const copyText = buildCopyText({
    answers,
    primary: ranking.primary,
    secondary: ranking.secondary,
    recommendations: ranking.recommendations,
    conflicts
  });

  currentResult = {
    answers,
    typeScores,
    ...ranking,
    conflicts,
    avoidAdvice,
    clarity,
    decisionProfile,
    copyText
  };

  setText('secondaryType', `第二倾向：${TYPE_LABELS[ranking.secondary].name}`);
  setText('resultType', TYPE_LABELS[ranking.primary].name);
  setText('resultDesc', TYPE_LABELS[ranking.primary].desc);
  setText('clarityValue', String(clarity));
  document.getElementById('clarityRing').style.background = `conic-gradient(var(--orange) 0 ${clarity}%,rgba(255,255,255,.12) ${clarity}% 100%)`;
  document.getElementById('traitStrip').innerHTML = getTraits(answers, ranking.primary).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  document.getElementById('decisionSummary').innerHTML = renderDecisionSummary(decisionProfile);
  document.getElementById('vehicleGrid').innerHTML = ranking.recommendations.length
    ? ranking.recommendations.map((item, index) => vehicleCard(item, index)).join('')
    : noVehicleCard();
  document.getElementById('conflictList').innerHTML = renderAdvice(conflicts.length ? conflicts : ['你的主要答案没有明显打架，下一步重点是试坐、当地落地价和售后。'], conflicts.length ? '' : 'ok');
  const specificExclusions = ranking.excluded.slice(0, 3).map((item) => (
    `${item.vehicle.brand}｜${item.vehicle.model}：${item.hardBlocks[0]}`
  ));
  document.getElementById('avoidAdvice').innerHTML = renderAdvice(
    [...specificExclusions, ...avoidAdvice].slice(0, 5),
    'bad'
  );
  renderScoreBars(ranking.sortedTypes);
  setText('copyText', copyText);

  history.replaceState({}, '', `${location.pathname}?result=${encodeURIComponent(ranking.primary)}`);
  showView('result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function vehicleCard(item, index) {
  const vehicle = item.vehicle;
  const specs = [
    TYPE_LABELS[vehicle.type]?.short || '待分类',
    formatPrice(vehicle.budget),
    vehicle.seat ? `座高${vehicle.seat}mm` : '座高待校准',
    vehicle.weight ? `${vehicle.weight}kg` : '车重待校准'
  ];

  return `<article class="vehicle-card" data-vehicle-id="${escapeHtml(vehicle.id)}" tabindex="0" role="button" aria-label="查看${escapeHtml(vehicle.brand)}${escapeHtml(vehicle.model)}详情">
    <div class="vehicle-rank">试坐方向 ${String(index + 1).padStart(2, '0')}</div>
    <h4>${escapeHtml(vehicle.brand)}｜${escapeHtml(vehicle.model)}</h4>
    <div class="vehicle-tags">
      ${specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}
      <span class="quality">${escapeHtml(dataQualityLabel(vehicle.dataQuality))}</span>
    </div>
    <div class="reason-list">${item.reasons.slice(0, 3).map((reason) => `<span>${escapeHtml(reason)}</span>`).join('')}</div>
    <p><b>现实代价：</b>${escapeHtml(item.warnings[0] || vehicle.warn)}</p>
    <div class="match-line"><span>点击查看完整解释</span><strong>${item.score}</strong></div>
  </article>`;
}

function noVehicleCard() {
  return `<article class="vehicle-card">
    <div class="vehicle-rank">VERIFIED LIST EMPTY</div>
    <h4>当前没有通过双重核验的具体车型</h4>
    <p><b>建议：</b>先按结果页的车型大类了解骑姿和用途，暂时不要把任何具体型号当成下单或上牌结论。</p>
  </article>`;
}

function renderDecisionSummary(profile) {
  const columns = [
    ['must', '必须保留', profile.mustHave],
    ['trade', '必须接受', profile.tradeoffs],
    ['red', '重点核验', profile.redFlags]
  ];
  return columns.map(([className, title, items]) => `
    <div class="summary-column ${className}">
      <span class="decision-label">${className === 'must' ? 'Must have' : className === 'trade' ? 'Trade-off' : 'Red flag'}</span>
      <h3>${title}</h3>
      <ul>${(items.length ? items : ['当前没有明显新增条件']).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderAdvice(items, className = '') {
  return `<div class="advice-list">${items.map((item) => `<div class="advice-item ${className}">${escapeHtml(item)}</div>`).join('')}</div>`;
}

function renderScoreBars(sortedTypes) {
  const max = Math.max(...sortedTypes.map((item) => item[1]), 1);
  document.getElementById('scoreBars').innerHTML = sortedTypes.map(([key, value]) => `
    <div class="score-row">
      <b>${escapeHtml(TYPE_LABELS[key].short)}</b>
      <div class="score-line"><span style="width:${Math.round((value / max) * 100)}%"></span></div>
      <em>${value}</em>
    </div>
  `).join('');
}

function getTraits(answers, primary) {
  const traits = [
    TYPE_LABELS[primary].short,
    budgetLabel(answers.budget),
    `${answers.height}cm`,
    labelFor('experience', answers.experience),
    labelFor('ownership', answers.ownership),
    labelFor('mod', answers.mod),
    labelFor('parking', answers.parking)
  ];
  if (answers.load === 'both') traits.push('载人+装载');
  if (answers.age === 'collector') traits.push('收藏模式');
  return traits.filter(Boolean).slice(0, 8);
}

function openVehicleModal(id) {
  const item = currentResult?.recommendations.find((candidate) => candidate.vehicle.id === id);
  if (!item) return;
  const vehicle = item.vehicle;
  els.vehicleModalContent.innerHTML = `<div class="modal-body">
    <span class="decision-label">匹配度 ${item.score} · 数据可信度 ${item.confidence}</span>
    <h3 id="vehicleModalTitle">${escapeHtml(vehicle.brand)}｜${escapeHtml(vehicle.model)}</h3>
    <div class="vehicle-tags">
      <span>${escapeHtml(TYPE_LABELS[vehicle.type].short)}</span>
      <span>${escapeHtml(formatPrice(vehicle.budget))}</span>
      <span>${vehicle.seat ? `座高${vehicle.seat}mm` : '座高待校准'}</span>
      <span>${vehicle.weight ? `${vehicle.weight}kg` : '车重待校准'}</span>
      <span class="quality">${escapeHtml(dataQualityLabel(vehicle.dataQuality))}</span>
    </div>
    <div class="modal-section"><h4>为什么进入名单</h4><div class="modal-list">${item.reasons.map((reason) => `<div>${escapeHtml(reason)}</div>`).join('')}</div></div>
    <div class="modal-section"><h4>现实代价</h4><div class="modal-list">${item.warnings.map((warning) => `<div>${escapeHtml(warning)}</div>`).join('') || `<div>${escapeHtml(vehicle.warn)}</div>`}</div></div>
    <div class="modal-section"><h4>数据状态</h4><p>${escapeHtml(vehicle.status)}。${vehicle.year ? `年款/发布时间参考：${vehicle.year}。` : '年款信息待补充。'}${vehicle.sourceUrl ? ' 已保留公开来源链接用于人工核验。' : ' 当前为基础示例数据。'}</p></div>
  </div>`;
  els.vehicleModal.showModal();
}

async function copyResult() {
  const text = currentResult?.copyText || document.getElementById('copyText')?.textContent || '';
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('结果文案已复制');
  } catch (_) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('结果文案已复制');
  }
}

async function openPoster() {
  if (!currentResult) return;
  await renderResultPoster(els.posterCanvas, currentResult, 'assets/zz-logo.jpeg');
  const names = currentResult.recommendations.slice(0, 3).map((item) => `${item.vehicle.brand}${item.vehicle.model}`).join('、');
  els.posterCanvas.setAttribute('aria-label', `${TYPE_LABELS[currentResult.primary].name}结果海报。优先试坐：${names || '暂无精确车型'}。`);
  els.posterModal.showModal();
}

function openDataInfo() {
  const explicitlyUnavailable = CATALOG_META.status_counts.not_introduced + CATALOG_META.status_counts.discontinued;
  catalogState.visible = CATALOG_PAGE_SIZE;
  els.dataModalContent.innerHTML = `
    <div class="data-stats">
      <div class="data-stat"><strong>${CATALOG_META.total}</strong><span>公开两轮车型索引记录</span></div>
      <div class="data-stat"><strong>${explicitlyUnavailable}</strong><span>明确停售或大陆未引进</span></div>
      <div class="data-stat"><strong>${CATALOG_REVIEW_META.reviewed}</strong><span>已完成人工一手检索初核</span></div>
      <div class="data-stat is-warning"><strong>${VERIFIED_RECOMMENDATION_COUNT}</strong><span>已完成双重核验的具体版本</span></div>
    </div>
    <div class="catalog-alert" role="note">
      <strong>先说清楚：目录 ≠ 已核验可买 ≠ 推荐。</strong>
      <span>正式推荐池目前只有 ${VEHICLES.length} 个双核具体版本。另有 ${DEMO_VEHICLE_META.total} 条合并示例只用于开发与算法测试，不会加载到生产推荐或打包进部署成品。下面 ${CATALOG_META.total} 条两轮索引可能混有电动自行车、非道路和历史车型，只用于查漏；公开指导价不能证明现在有货或当地能上牌。</span>
    </div>
    <div class="modal-section"><h4>核验规则</h4><div class="modal-list">
      <div>道路准入看工信部公告与 CCC；市场可买看品牌中国官网、官方订购/询价和授权渠道。两项必须分开核。</div>
      <div>来源明确写“停售”“大陆未引进”“即将上市”的车型不会进入当前新车推荐。</div>
      <div>无手续、非正规进口、报废、拼装及纯赛道/非道路车型永久排除；同名正规官方进口车型要按具体车辆手续判断。</div>
      <div>已优先初核：新车上市 ${CATALOG_REVIEW_META.status_counts.new_listing} 条、即将上市 ${CATALOG_REVIEW_META.status_counts.upcoming} 条、暂无报价 ${CATALOG_REVIEW_META.status_counts.unquoted} 条，共 ${CATALOG_REVIEW_META.reviewed} 条；目前 ${VERIFIED_RECOMMENDATION_COUNT} 条完成具体版本准入闭环。初核日期：${escapeHtml(CATALOG_REVIEW_META.as_of)}。</div>
      <div>索引快照：${escapeHtml(CATALOG_META.snapshot_date)}｜App ${APP_VERSION}｜数据口径 ${DATA_VERSION}</div>
    </div></div>
    <section class="catalog-browser" aria-labelledby="catalogBrowserTitle">
      <div class="catalog-heading">
        <div><h4 id="catalogBrowserTitle">公开两轮车型索引</h4><p>${escapeHtml(CATALOG_META.source_name)}，车型类别未核实前不会冒充摩托车，每条都保留来源链接。</p></div>
        <a href="${escapeHtml(CATALOG_META.source_home)}" target="_blank" rel="noopener noreferrer">查看来源站</a>
      </div>
      <div class="catalog-toolbar">
        <label><span>搜索品牌或车型</span><input id="catalogSearch" type="search" value="${escapeHtml(catalogState.query)}" placeholder="例如：本田、450MT、踏板" autocomplete="off"></label>
        <label><span>状态筛选</span><select id="catalogStatus">
          <option value="all">全部状态（${CATALOG_META.total}）</option>
          ${Object.entries(CATALOG_STATUS).map(([key, item]) => `<option value="${key}"${catalogState.status === key ? ' selected' : ''}>${escapeHtml(item.label)}（${CATALOG_META.status_counts[key]}）</option>`).join('')}
        </select></label>
        <label><span>一手来源核验</span><select id="catalogReview">
          <option value="all"${catalogState.review === 'all' ? ' selected' : ''}>全部核验进度</option>
          <option value="reviewed"${catalogState.review === 'reviewed' ? ' selected' : ''}>已初核（${CATALOG_REVIEW_META.reviewed}）</option>
          <option value="official_evidence"${catalogState.review === 'official_evidence' ? ' selected' : ''}>中国官网/渠道有相关内容，不等于在售（${CATALOG_OFFICIAL_EVIDENCE_COUNT}）</option>
          <option value="identity_issue"${catalogState.review === 'identity_issue' ? ' selected' : ''}>名称/渠道存在问题（${CATALOG_IDENTITY_ISSUE_COUNT}）</option>
          <option value="unreviewed"${catalogState.review === 'unreviewed' ? ' selected' : ''}>尚未初核（${CATALOG_META.total - CATALOG_REVIEW_META.reviewed}）</option>
        </select></label>
      </div>
      <p class="catalog-count" id="catalogCount" aria-live="polite"></p>
      <div class="catalog-results" id="catalogResults"></div>
      <div class="catalog-more" id="catalogMore"></div>
    </section>
  `;
  renderCatalogResults();
  els.dataModal.showModal();
}

function getFilteredCatalog() {
  const query = catalogState.query.trim().toLocaleLowerCase('zh-CN');
  return PUBLIC_CATALOG.filter((row) => {
    if (catalogState.status !== 'all' && row.catalog_status !== catalogState.status) return false;
    const review = CATALOG_REVIEW_BY_ID.get(row.source_id);
    if (catalogState.review === 'reviewed' && !review) return false;
    if (catalogState.review === 'unreviewed' && review) return false;
    if (catalogState.review === 'official_evidence' && (!review || !OFFICIAL_EVIDENCE_STATUSES.has(review.market_status))) return false;
    if (catalogState.review === 'identity_issue' && (!review || OFFICIAL_EVIDENCE_STATUSES.has(review.market_status))) return false;
    if (!query) return true;
    return `${row.display_name} ${row.price_label} ${row.status_label} ${review?.official_name || ''} ${review?.summary || ''}`.toLocaleLowerCase('zh-CN').includes(query);
  });
}

function renderCatalogResults() {
  const results = document.getElementById('catalogResults');
  const count = document.getElementById('catalogCount');
  const more = document.getElementById('catalogMore');
  if (!results || !count || !more) return;

  const filtered = getFilteredCatalog();
  const visible = filtered.slice(0, catalogState.visible);
  count.textContent = `找到 ${filtered.length} 条；当前显示 ${visible.length} 条。所有记录默认不进入推荐。`;
  results.innerHTML = visible.length ? visible.map((row) => {
    const review = CATALOG_REVIEW_BY_ID.get(row.source_id);
    return `
    <article class="catalog-row">
      <div class="catalog-row-main">
        <div class="catalog-row-title"><strong>${escapeHtml(row.display_name)}</strong>${review ? '<span class="catalog-review-badge">一手初核：暂不推荐</span>' : ''}<span class="catalog-status is-${escapeHtml(row.catalog_status)}">索引标注：${escapeHtml(row.status_label)}</span></div>
        ${review ? renderCatalogReview(review) : `<p>${escapeHtml(row.availability_note)}</p>`}
      </div>
      <div class="catalog-row-meta">
        <strong class="catalog-index-price">${escapeHtml(row.price_label)}</strong>
        <span>第三方索引参考价｜${row.variant_count ? `${row.variant_count} 个公开款型` : '款型数待核'}｜道路准入待核</span>
        <a href="${escapeHtml(row.source_url)}" target="_blank" rel="noopener noreferrer">来源详情 ↗</a>
      </div>
    </article>
  `;
  }).join('') : '<div class="catalog-empty">没有匹配记录。可以换一个车型名或状态。</div>';
  more.innerHTML = filtered.length > visible.length
    ? `<button class="secondary-btn" type="button" data-action="load-catalog">再显示 ${Math.min(CATALOG_PAGE_SIZE, filtered.length - visible.length)} 条</button>`
    : '';
}

function renderCatalogReview(review) {
  const codes = review.model_codes.length ? `候选型号：${review.model_codes.join('、')}` : '具体工厂型号未核实';
  const links = review.evidence.length
    ? review.evidence.map((item) => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)} ↗</a>`).join('')
    : '<span>暂未找到允许范围内的一手公开页面</span>';
  return `
    <div class="catalog-review-summary"><strong>${escapeHtml(review.official_name)}</strong><p>${escapeHtml(review.summary)}</p></div>
    <div class="catalog-review-state"><span>市场：${escapeHtml(review.market_label)}</span><span>准入：${escapeHtml(review.road_label)}</span><span>${escapeHtml(codes)}</span></div>
    <div class="catalog-review-links">${links}</div>
  `;
}

function updateDataPill() {
  els.dataPill.textContent = `公开索引 ${CATALOG_META.total} 条 · 正式可推荐 ${VERIFIED_RECOMMENDATION_COUNT}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add('is-show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('is-show'), 1800);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}
