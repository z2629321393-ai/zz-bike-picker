import {
  APP_VERSION,
  DATA_VERSION,
  DEFAULT_ANSWERS,
  QUESTIONS,
  TYPE_LABELS,
  budgetLabel,
  labelFor
} from './config.js';
import { BASE_VEHICLES } from '../data/base-vehicles.js';
import { MOTOFAN_VEHICLES } from './vehicles.generated.js';
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
import {
  ACCESSORY_CATEGORIES,
  REMINDER_CONFIG,
  accessoryResultCopy,
  categoryById,
  clearAccessorySession,
  createAccessorySession,
  evaluateAccessory,
  loadAccessorySession,
  saveAccessorySession
} from './accessories.js';
import { isAggregateVehicle, marketplaceLinks, motofanLinks, safeGearImage, safeImage } from './marketplace.js';

const VEHICLES = mergeAndNormalizeVehicles(BASE_VEHICLES, MOTOFAN_VEHICLES);
let state = createInitialState();
let currentResult = null;
let autoAdvanceTimer = null;
let accessorySession = loadAccessorySession();
let currentAccessoryResult = null;

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
  progressBar: document.getElementById('progressBar'),
  continueBtn: document.getElementById('continueBtn'),
  entryGrid: document.getElementById('entryGrid'),
  dataPill: document.getElementById('dataPill'),
  toast: document.getElementById('toast'),
  vehicleModal: document.getElementById('vehicleModal'),
  vehicleModalContent: document.getElementById('vehicleModalContent'),
  posterModal: document.getElementById('posterModal'),
  posterCanvas: document.getElementById('posterCanvas'),
  dataModal: document.getElementById('dataModal'),
  dataModalContent: document.getElementById('dataModalContent'),
  promo: document.getElementById('promoView'),
  promoImage: document.getElementById('promoImage'),
  promoTitle: document.getElementById('promoTitle'),
  promoText: document.getElementById('promoText'),
  promoCtaText: document.getElementById('promoCtaText'),
  promoContinueBtn: document.getElementById('promoContinueBtn'),
  accessoryHub: document.getElementById('accessoryHubView'),
  accessoryGrid: document.getElementById('accessoryGrid'),
  accessoryInterview: document.getElementById('accessoryInterviewView'),
  accessorySideIcon: document.getElementById('accessorySideIcon'),
  accessorySideAccent: document.getElementById('accessorySideAccent'),
  accessorySideTitle: document.getElementById('accessorySideTitle'),
  accessorySideSubtitle: document.getElementById('accessorySideSubtitle'),
  accessoryProgressBar: document.getElementById('accessoryProgressBar'),
  accessoryProgressText: document.getElementById('accessoryProgressText'),
  accessoryQuestionCard: document.getElementById('accessoryQuestionCard'),
  accessoryResult: document.getElementById('accessoryResultView'),
  accessoryResultKicker: document.getElementById('accessoryResultKicker'),
  accessoryResultHeadline: document.getElementById('accessoryResultHeadline'),
  accessoryResultSummary: document.getElementById('accessoryResultSummary'),
  accessoryPriorities: document.getElementById('accessoryPriorities'),
  accessoryAvoid: document.getElementById('accessoryAvoid'),
  accessoryChecklist: document.getElementById('accessoryChecklist'),
  accessoryTradeoffs: document.getElementById('accessoryTradeoffs'),
  accessoryFeelNote: document.getElementById('accessoryFeelNote'),
  accessoryStyleNote: document.getElementById('accessoryStyleNote'),
  accessoryMetrics: document.getElementById('accessoryMetrics'),
  accessorySpokenLine: document.getElementById('accessorySpokenLine'),
  accessoryCopyText: document.getElementById('accessoryCopyText'),
  accessoryMarketImage: document.getElementById('accessoryMarketImage'),
  accessoryBudgetAdvice: document.getElementById('accessoryBudgetAdvice'),
  accessoryBrandHints: document.getElementById('accessoryBrandHints'),
  accessoryPriceWarning: document.getElementById('accessoryPriceWarning'),
  accessorySearchKeywords: document.getElementById('accessorySearchKeywords'),
  accessoryMarketLinks: document.getElementById('accessoryMarketLinks')
};

init();

function init() {
  updateDataPill();
  applyReminderConfig();
  renderEntryChoices();
  renderAccessoryHub();
  const saved = loadState();
  if (saved && !saved.completed && saved.current > 0) els.continueBtn.classList.remove('is-hidden');

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
}

function handleClick(event) {
  const copyNode = event.target.closest('[data-copy-text]');
  if (copyNode) {
    copyPlainText(copyNode.dataset.copyText || '');
    return;
  }
  if (event.target.closest('a[href]')) return;
  const actionNode = event.target.closest('[data-action]');
  if (actionNode) {
    const action = actionNode.dataset.action;
    if (action === 'start') startFresh();
    if (action === 'continue') continueSaved();
    if (action === 'home') goHome();
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
    if (action === 'open-extension') openPromo('hub');
    if (action === 'promo-continue') continueFromPromo();
    if (action === 'back-to-result') showView('result');
    if (action === 'back-to-accessory-hub') openAccessoryHub();
    if (action === 'reset-accessories') resetAccessories();
    if (action === 'accessory-back') previousAccessoryQuestion();
    if (action === 'accessory-next') nextAccessoryQuestion();
    if (action === 'copy-accessory-result') copyAccessoryResult();
    if (action === 'accessory-finish') goHome();
    return;
  }

  const select = event.target.closest('[data-select]');
  if (select) {
    const key = select.dataset.select;
    const value = key === 'budget' ? Number(select.dataset.value) : select.dataset.value;
    state.answers[key] = value;
    saveState(state);
    renderQuestion();
    clearTimeout(autoAdvanceTimer);
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

  const entryCategory = event.target.closest('[data-entry-category]');
  if (entryCategory) {
    const categoryId = entryCategory.dataset.entryCategory;
    if (categoryId === 'motorcycle') {
      startFresh();
    } else {
      openPromo(`category:${categoryId}`);
    }
    return;
  }

  const accessoryCategory = event.target.closest('[data-accessory-category]');
  if (accessoryCategory) {
    startAccessory(accessoryCategory.dataset.accessoryCategory);
    return;
  }

  const accessoryOption = event.target.closest('[data-accessory-option]');
  if (accessoryOption) {
    selectAccessoryOption(accessoryOption.dataset.accessoryOption);
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
}

function handleKeys(event) {
  if (event.key === 'Escape') {
    if (els.vehicleModal.open) els.vehicleModal.close();
    if (els.posterModal.open) els.posterModal.close();
    if (els.dataModal.open) els.dataModal.close();
  }

  const typingTarget = event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
  if (!typingTarget && event.key.toLowerCase() === 'u' && !els.accessoryInterview?.classList.contains('is-active')) {
    event.preventDefault();
    openAccessoryHub();
    return;
  }
  if (els.accessoryInterview?.classList.contains('is-active')) {
    if (event.key === 'Enter') { event.preventDefault(); nextAccessoryQuestion(); return; }
    if (event.key === 'ArrowLeft') { event.preventDefault(); previousAccessoryQuestion(); return; }
    if (/^[1-9]$/.test(event.key)) {
      const cards = [...els.accessoryQuestionCard.querySelectorAll('[data-accessory-option]')];
      cards[Number(event.key) - 1]?.click();
      return;
    }
  }
  if (!els.interview.classList.contains('is-active')) return;
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
  state = createInitialState();
  saveState(state);
  showView('interview');
  renderQuestion();
}

function continueSaved() {
  state = loadState() || createInitialState();
  state.answers = {
    ...DEFAULT_ANSWERS,
    ...(state.answers || {}),
    avoid: Array.isArray(state.answers?.avoid) ? state.answers.avoid : []
  };
  showView('interview');
  renderQuestion();
}

function restart() {
  clearTimeout(autoAdvanceTimer);
  clearState();
  state = createInitialState();
  currentResult = null;
  els.continueBtn.classList.add('is-hidden');
  history.replaceState({}, '', location.pathname);
  showView('intro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  renderEntryChoices();
  showView('intro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showView(name) {
  [els.intro, els.interview, els.result, els.promo, els.accessoryHub, els.accessoryInterview, els.accessoryResult]
    .forEach((element) => element?.classList.remove('is-active'));
  const target = ({
    intro: els.intro,
    interview: els.interview,
    result: els.result,
    promo: els.promo,
    accessoryHub: els.accessoryHub,
    accessoryInterview: els.accessoryInterview,
    accessoryResult: els.accessoryResult
  })[name];
  target?.classList.add('is-active');
}

function renderQuestion() {
  const question = QUESTIONS[state.current];
  const progress = Math.round(((state.current + 1) / QUESTIONS.length) * 100);
  els.stepLabel.textContent = `第${state.current + 1}轮 / 共${QUESTIONS.length}轮`;
  els.sectionLabel.textContent = question.section;
  els.progressNumber.textContent = `${progress}%`;
  els.progressBar.style.width = `${progress}%`;
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
    <h2 class="question-title">${escapeHtml(question.title)}</h2>
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
    <button class="option-card ${String(selected) === String(option.value) ? 'is-selected' : ''}" type="button" data-select="${escapeHtml(question.id)}" data-value="${escapeHtml(option.value)}">
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
    <button class="option-card ${state.answers.avoid.includes(option.value) ? 'is-selected' : ''}" type="button" data-multi="avoid" data-value="${option.value}">
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
      <button class="segment ${state.answers[key] === value ? 'is-selected' : ''}" type="button" data-segment="${key}" data-value="${value}">${label}</button>
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
  const question = QUESTIONS[state.current];
  if (!isQuestionComplete(question)) {
    if (!auto) showToast('先回答这一题');
    return;
  }

  if (state.current < QUESTIONS.length - 1) {
    state.current += 1;
    saveState(state);
    renderQuestion();
    return;
  }

  state.completed = true;
  saveState(state);
  buildResult();
}

function previousQuestion() {
  clearTimeout(autoAdvanceTimer);
  if (state.current <= 0) return;
  state.current -= 1;
  saveState(state);
  renderQuestion();
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
  const copyText = `${buildCopyText({
    answers,
    primary: ranking.primary,
    secondary: ranking.secondary,
    recommendations: ranking.recommendations,
    conflicts
  })}

顺便念一句：${REMINDER_CONFIG.spokenLine}`;

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
  document.getElementById('avoidAdvice').innerHTML = renderAdvice(avoidAdvice, 'bad');
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
    vehicle.weight ? `${vehicle.weight}kg` : '车重待校准',
    availabilityLabel(vehicle)
  ];
  const source = motofanLinks(vehicle);
  const image = safeImage(vehicle);
  const isPublicPhoto = !isAggregateVehicle(vehicle) && /^https:\/\//i.test(image);

  return `<article class="vehicle-card" data-vehicle-id="${escapeHtml(vehicle.id)}" tabindex="0" role="button" aria-label="查看${escapeHtml(vehicle.brand)}${escapeHtml(vehicle.model)}详情">
    <div class="vehicle-image-wrap">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}" loading="lazy" onerror="this.src='assets/vehicles/${escapeHtml(vehicle.type)}.svg'">
      <span>${isPublicPhoto ? '公开页面车型图 · 请复核来源' : '车型方向示意图 · 非具体实拍'}</span>
    </div>
    <div class="vehicle-rank">RECOMMEND ${String(index + 1).padStart(2, '0')}</div>
    <h4>${escapeHtml(vehicle.brand)}｜${escapeHtml(vehicle.model)}</h4>
    <div class="vehicle-tags">
      ${specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}
      <span class="quality">${escapeHtml(dataQualityLabel(vehicle.dataQuality))}</span>
    </div>
    <div class="reason-list">${item.reasons.slice(0, 3).map((reason) => `<span>${escapeHtml(reason)}</span>`).join('')}</div>
    <p><b>现实代价：</b>${escapeHtml(item.warnings[0] || vehicle.warn)}</p>
    <div class="vehicle-source-actions">
      ${source.direct ? `<a class="mini-link primary" href="${escapeHtml(source.direct)}" target="_blank" rel="noopener noreferrer">摩托范看图和参数</a>` : `<a class="mini-link primary" href="${escapeHtml(source.search)}" target="_blank" rel="noopener noreferrer">搜索摩托范资料</a>`}
      <a class="mini-link" href="${escapeHtml(source.search)}" target="_blank" rel="noopener noreferrer">继续查车型</a>
    </div>
    <div class="match-line"><span>点击查看完整解释</span><strong>${item.score}</strong></div>
  </article>`;
}

function noVehicleCard() {
  return `<article class="vehicle-card">
    <div class="vehicle-rank">NO CLEAR MATCH</div>
    <h4>当前没有足够可靠的精确匹配</h4>
    <p><b>建议：</b>先按结果页的车型大类去试坐。车型库数据不完整时，系统不会硬装成“精确推荐”。</p>
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
  const source = motofanLinks(vehicle);
  const image = safeImage(vehicle);
  els.vehicleModalContent.innerHTML = `<div class="modal-body">
    <span class="decision-label">匹配度 ${item.score} · 数据可信度 ${item.confidence}</span>
    <div class="vehicle-modal-media">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}" onerror="this.src='assets/vehicles/${escapeHtml(vehicle.type)}.svg'">
      <div><h3>${escapeHtml(vehicle.brand)}｜${escapeHtml(vehicle.model)}</h3><p>图片用于识别车型方向；公开图和参数仍以来源页及品牌官网为准。</p></div>
    </div>
    <div class="vehicle-tags">
      <span>${escapeHtml(TYPE_LABELS[vehicle.type].short)}</span>
      <span>${escapeHtml(formatPrice(vehicle.budget))}</span>
      <span>${vehicle.seat ? `座高${vehicle.seat}mm` : '座高待校准'}</span>
      <span>${vehicle.weight ? `${vehicle.weight}kg` : '车重待校准'}</span>
      <span>${escapeHtml(availabilityLabel(vehicle))}</span>
      <span class="quality">${escapeHtml(dataQualityLabel(vehicle.dataQuality))}</span>
    </div>
    <div class="modal-section"><h4>为什么进入名单</h4><div class="modal-list">${item.reasons.map((reason) => `<div>${escapeHtml(reason)}</div>`).join('')}</div></div>
    <div class="modal-section"><h4>现实代价</h4><div class="modal-list">${item.warnings.map((warning) => `<div>${escapeHtml(warning)}</div>`).join('') || `<div>${escapeHtml(vehicle.warn)}</div>`}</div></div>
    <div class="modal-section"><h4>继续核验</h4><p>${escapeHtml(vehicle.status)}。${vehicle.year ? `年款/发布时间参考：${vehicle.year}。` : '年款信息待补充。'}图片、指导价、实际成交价和在售状态都可能变化，请再到公开来源与当地经销商核验。</p>
      <div class="market-link-row">
        ${source.direct ? `<a class="market-link primary" href="${escapeHtml(source.direct)}" target="_blank" rel="noopener noreferrer">摩托范车型页</a>` : ''}
        <a class="market-link" href="${escapeHtml(source.search)}" target="_blank" rel="noopener noreferrer">搜索摩托范：${escapeHtml(source.keyword)}</a>
      </div>
    </div>
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
  els.posterModal.showModal();
}

function openDataInfo() {
  const quality = VEHICLES.reduce((accumulator, vehicle) => {
    accumulator[vehicle.dataQuality] = (accumulator[vehicle.dataQuality] || 0) + 1;
    return accumulator;
  }, {});
  els.dataModalContent.innerHTML = `
    <div class="data-stats">
      <div class="data-stat"><strong>${VEHICLES.length}</strong><span>当前可用车型记录</span></div>
      <div class="data-stat"><strong>${MOTOFAN_VEHICLES.length}</strong><span>公开页生成记录</span></div>
      <div class="data-stat"><strong>${quality.verified || 0}</strong><span>已校准记录</span></div>
    </div>
    <div class="modal-section"><h4>数据原则</h4><div class="modal-list">
      <div>推荐引擎与车型数据分离。换数据不需要重写访谈逻辑。</div>
      <div>基础示例库只保证网站能演示，不假装是完整全网数据库。</div>
      <div>公开页记录会显示可信度；缺少座高、车重、年款时会主动提示。</div>
      <div>版本：App ${APP_VERSION}｜数据口径 ${DATA_VERSION}</div>
    </div></div>
  `;
  els.dataModal.showModal();
}

function updateDataPill() {
  const generated = MOTOFAN_VEHICLES.length;
  els.dataPill.textContent = generated ? `车型库 ${VEHICLES.length} 条 · 公开页${generated}` : `车型库 ${VEHICLES.length} 条 · 示例模式`;
}


function renderEntryChoices() {
  if (!els.entryGrid) return;
  const motorcycleCard = `
    <button class="entry-card entry-card-main" type="button" data-entry-category="motorcycle">
      <span class="entry-card-icon">车</span>
      <span class="entry-card-copy"><b>摩托车选择推荐</b><small>12轮访谈：用途、预算、身高、经验、成本和停车环境</small></span>
      <span class="entry-card-status">开始选车 →</span>
    </button>`;
  const gearCards = ACCESSORY_CATEGORIES.map((category) => {
    const completed = Boolean(accessorySession.resultsByCategory?.[category.id]);
    return `
      <button class="entry-card ${completed ? 'is-complete' : ''}" type="button" data-entry-category="${escapeHtml(category.id)}">
        <span class="entry-card-icon">${escapeHtml(category.icon)}</span>
        <span class="entry-card-copy"><b>${escapeHtml(category.title)}</b><small>${escapeHtml(category.subtitle)}</small></span>
        <span class="entry-card-status">${completed ? '已测过 · 可重测' : '只测这一项 →'}</span>
      </button>`;
  }).join('');
  els.entryGrid.innerHTML = motorcycleCard + gearCards;
}

function applyReminderConfig(category = null) {
  if (els.promoImage) els.promoImage.src = REMINDER_CONFIG.promoImage;
  const categoryName = category?.title?.replace('如何选', '') || '装备';
  setText('promoTitle', category ? `先看一张提醒，再开始${categoryName}测试` : REMINDER_CONFIG.promoTitle);
  setText('promoText', category ? `${category.subtitle}这一轮只做${categoryName}，不会要求你继续完成其他项目。` : REMINDER_CONFIG.promoText);
  setText('promoCtaText', REMINDER_CONFIG.spokenLine);
  setText('accessorySpokenLine', REMINDER_CONFIG.spokenLine);
  if (els.promoContinueBtn) els.promoContinueBtn.textContent = category ? `下一步，开始${categoryName}测试 →` : '下一步，进入单项选择 →';
}

function openPromo(next = 'hub') {
  accessorySession.promoNext = next;
  saveAccessorySession(accessorySession);
  const categoryId = next.startsWith('category:') ? next.slice('category:'.length) : null;
  applyReminderConfig(categoryById(categoryId));
  showView('promo');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function continueFromPromo() {
  const next = accessorySession.promoNext || 'hub';
  if (next === 'result') {
    showView('accessoryResult');
    return;
  }
  if (next.startsWith('category:')) {
    startAccessory(next.slice('category:'.length));
    return;
  }
  openAccessoryHub();
}

function openAccessoryHub() {
  renderAccessoryHub();
  showView('accessoryHub');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAccessoryHub() {
  if (!els.accessoryGrid) return;
  els.accessoryGrid.innerHTML = ACCESSORY_CATEGORIES.map((category, index) => {
    const completed = Boolean(accessorySession.resultsByCategory?.[category.id]);
    return `<button class="accessory-card ${completed ? 'is-complete' : ''}" type="button" data-accessory-category="${escapeHtml(category.id)}">
      <span class="accessory-card-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="accessory-card-icon">${escapeHtml(category.icon)}</span>
      <span class="accessory-card-copy"><b>${escapeHtml(category.title)}</b><small>${escapeHtml(category.subtitle)}</small></span>
      <span class="accessory-card-status">${completed ? '已完成 · 可重测' : '开始测试 →'}</span>
    </button>`;
  }).join('');
}

function resetAccessories() {
  clearAccessorySession();
  accessorySession = createAccessorySession();
  currentAccessoryResult = null;
  renderAccessoryHub();
  showToast('扩展包记录已重置');
}

function startAccessory(categoryId) {
  const category = categoryById(categoryId);
  if (!category) return;
  accessorySession.currentCategoryId = categoryId;
  accessorySession.currentQuestion = 0;
  accessorySession.answersByCategory[categoryId] = {};
  saveAccessorySession(accessorySession);
  renderAccessoryQuestion();
  showView('accessoryInterview');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAccessoryQuestion() {
  const category = categoryById(accessorySession.currentCategoryId);
  if (!category) return openAccessoryHub();
  const question = category.questions[accessorySession.currentQuestion];
  const answers = accessorySession.answersByCategory[category.id] || {};
  const selected = answers[question.id];
  const progress = Math.round(((accessorySession.currentQuestion + 1) / category.questions.length) * 100);

  setText('accessorySideIcon', category.icon);
  setText('accessorySideAccent', category.accent);
  setText('accessorySideTitle', category.title);
  setText('accessorySideSubtitle', category.subtitle);
  els.accessoryProgressBar.style.width = `${progress}%`;
  setText('accessoryProgressText', `第${accessorySession.currentQuestion + 1}题 / 共${category.questions.length}题`);

  els.accessoryQuestionCard.innerHTML = `
    <div class="question-eyebrow">${escapeHtml(category.title)}</div>
    <h2 class="question-title">${escapeHtml(question.title)}</h2>
    <p class="question-help">${escapeHtml(question.help)}</p>
    <div class="option-grid">${question.options.map(([value, label, detail], index) => `
      <button class="option-card ${selected === value ? 'is-selected' : ''}" type="button" data-accessory-option="${escapeHtml(value)}">
        <span class="option-icon">${index + 1}</span>
        <span class="option-main"><b>${escapeHtml(label)}</b><small>${escapeHtml(detail)}</small></span>
        <span class="option-key">${index + 1}</span>
      </button>`).join('')}</div>`;

  const back = document.querySelector('[data-action="accessory-back"]');
  const next = document.querySelector('[data-action="accessory-next"]');
  if (back) back.disabled = accessorySession.currentQuestion === 0;
  if (next) next.textContent = accessorySession.currentQuestion === category.questions.length - 1 ? '生成建议 →' : '下一题 →';
}

function selectAccessoryOption(value) {
  const category = categoryById(accessorySession.currentCategoryId);
  if (!category) return;
  const question = category.questions[accessorySession.currentQuestion];
  const answers = accessorySession.answersByCategory[category.id] || {};
  answers[question.id] = value;
  accessorySession.answersByCategory[category.id] = answers;
  saveAccessorySession(accessorySession);
  renderAccessoryQuestion();
}

function previousAccessoryQuestion() {
  if (accessorySession.currentQuestion <= 0) return;
  accessorySession.currentQuestion -= 1;
  saveAccessorySession(accessorySession);
  renderAccessoryQuestion();
}

function nextAccessoryQuestion() {
  const category = categoryById(accessorySession.currentCategoryId);
  if (!category) return;
  const question = category.questions[accessorySession.currentQuestion];
  const answers = accessorySession.answersByCategory[category.id] || {};
  if (!answers[question.id]) {
    showToast('先回答这一题');
    return;
  }
  if (accessorySession.currentQuestion < category.questions.length - 1) {
    accessorySession.currentQuestion += 1;
    saveAccessorySession(accessorySession);
    renderAccessoryQuestion();
    return;
  }
  buildAccessoryResult(category);
}

function buildAccessoryResult(category) {
  const answers = accessorySession.answersByCategory[category.id] || {};
  const result = evaluateAccessory(category.id, answers, currentResult);
  const copyText = accessoryResultCopy(category, result);
  currentAccessoryResult = { category, answers, result, copyText };
  accessorySession.resultsByCategory[category.id] = { answers, result, updatedAt: new Date().toISOString() };
  saveAccessorySession(accessorySession);

  setText('accessoryResultKicker', `${category.title} · ZZ建议`);
  setText('accessoryResultHeadline', result.headline);
  setText('accessoryResultSummary', result.summary);
  els.accessoryPriorities.innerHTML = renderAccessoryList(result.priorities);
  els.accessoryTradeoffs.innerHTML = renderAccessoryList(result.tradeoffs);
  els.accessoryAvoid.innerHTML = renderAccessoryList(result.avoid);
  els.accessoryChecklist.innerHTML = renderAccessoryList(result.checklist);
  setText('accessoryFeelNote', result.feelNote);
  setText('accessoryStyleNote', result.styleNote);
  setText('accessorySpokenLine', result.spokenLine);
  els.accessoryMetrics.innerHTML = renderAccessoryMetrics(result.metrics);
  renderAccessoryMarket(category, result);
  setText('accessoryCopyText', copyText);
  renderAccessoryHub();
  renderEntryChoices();
  showView('accessoryResult');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAccessoryMarket(category, result) {
  const keyword = result.searchKeywords?.[0] || result.headline;
  const links = marketplaceLinks(keyword);
  if (els.accessoryMarketImage) {
    els.accessoryMarketImage.src = safeGearImage(category.id, result);
    els.accessoryMarketImage.alt = `${category.title}推荐方向图`;
  }
  setText('accessoryBudgetAdvice', result.budgetAdvice || '预算建议待补充');
  setText('accessoryPriceWarning', result.priceWarning || '价格提醒待补充');
  if (els.accessoryBrandHints) els.accessoryBrandHints.innerHTML = renderAccessoryList(result.brandHints || []);
  if (els.accessorySearchKeywords) {
    els.accessorySearchKeywords.innerHTML = (result.searchKeywords || []).map((item) => `<button class="search-keyword" type="button" data-copy-text="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('');
  }
  if (els.accessoryMarketLinks) {
    const references = (result.referenceLinks || []).map((item) => `<a class="market-link reference" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`);
    const markets = links.map((item) => `<a class="market-link ${item.id === 'jd' ? 'primary' : ''}" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`);
    els.accessoryMarketLinks.innerHTML = [...references, ...markets].join('');
  }
}

function renderAccessoryList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function availabilityLabel(vehicle = {}) {
  const status = String(vehicle.status || '');
  if (/水车|报废|无手续|不上路|纯摆件|仅内容/.test(status)) return '国内不可合法上路';
  if (/停产|收藏/.test(status)) return '国内新车通常买不到 · 仅二手/收藏';
  if (/在售/.test(status)) return '国内在售方向 · 库存需复核';
  return '国内可购状态待复核';
}

function renderAccessoryMetrics(metrics = []) {
  return metrics.map((item) => `<div class="gear-metric"><div><b>${escapeHtml(item.label)}</b><span>${Number(item.value) || 0}</span></div><div class="gear-metric-bar"><i style="width:${Math.max(0, Math.min(100, Number(item.value) || 0))}%"></i></div></div>`).join('');
}

async function copyPlainText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast(`已复制：${text}`);
  } catch (_) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast(`已复制：${text}`);
  }
}

async function copyAccessoryResult() {
  const text = currentAccessoryResult?.copyText || els.accessoryCopyText?.textContent?.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('装备建议已复制');
  } catch {
    showToast('浏览器禁止自动复制，请手动复制');
  }
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
