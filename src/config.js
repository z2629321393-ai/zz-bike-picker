export const APP_VERSION = '4.0.0';
export const DATA_VERSION = '2026-07-16';
export const STORAGE_KEY = 'zz-bike-picker-v4';

export const TYPE_LABELS = {
  scooter: {
    name: '省心通勤型',
    short: '踏板/通勤',
    tone: '把生活复杂度降下来',
    desc: '你要的是每天都愿意骑，而不是每次出门都要做心理建设。省心、好停、好挪、装载够用，比极限性能更重要。'
  },
  adv: {
    name: '远方务实型',
    short: 'ADV/摩旅',
    tone: '路况和装载比姿态更重要',
    desc: '你真正需要的是坐姿、续航、装载和复杂路况适应性。ADV适合愿意跑远的人，但车重、座高和满载重心必须接受。'
  },
  cruiser: {
    name: '气场巡航型',
    short: '巡航',
    tone: '姿态和存在感优先',
    desc: '你买车很看重体量、声浪和镜头表现。巡航能给你情绪价值，但低速操控、车重、轮胎和改装成本不会消失。'
  },
  sport: {
    name: '刺激仿赛型',
    short: '仿赛/跑车',
    tone: '反馈越直接，代价越明显',
    desc: '你对操控、动力和运动外形更敏感。仿赛能给你强反馈，但手腕、腰、热量、摔车件和轮胎成本要一起算。'
  },
  street: {
    name: '均衡街车型',
    short: '街车',
    tone: '不极端，通常最少后悔',
    desc: '你需要一台能通勤、能周末玩、成本也不至于失控的车。街车不是最炸，但往往是最不容易买错的大类。'
  },
  retro: {
    name: '复古情绪型',
    short: '复古',
    tone: '速度不是唯一价值',
    desc: '你在意调性、质感和日常氛围。复古车不一定最快，但更适合慢慢骑、拍内容、城市短途和轻摩旅。'
  },
  offroad: {
    name: '硬核越野型',
    short: '越野/拉力',
    tone: '技术门槛比参数更真实',
    desc: '你不是只想看风景，而是想进入烂路和非铺装。越野和拉力很有乐趣，但座高、摔车、维护和技术门槛都更现实。'
  },
  collector: {
    name: '收藏情怀型',
    short: '收藏/老车',
    tone: '买的是故事，也买下后续责任',
    desc: '你真正买的可能不是交通工具，而是一段故事。老车和停产车可以收藏，但手续、车况、配件和维修渠道必须排在外观前面。'
  }
};

export const DEFAULT_ANSWERS = {
  usage: null,
  budget: 25000,
  height: 175,
  weight: 70,
  experience: null,
  personality: null,
  maintenance: 'mid',
  ownership: 'mid',
  looks: 'mid',
  mod: 'light',
  power: null,
  road: 'mixed',
  load: 'solo',
  commuteDistance: 'medium',
  parking: 'monitored',
  age: 'new',
  avoid: []
};

export const LABELS = {
  usage: {
    commute: '通勤代步',
    fun: '周末玩乐',
    travel: '摩旅长途',
    status: '撑场面/拍视频',
    track: '跑山赛道',
    collect: '收藏情怀'
  },
  experience: {
    new: '完全新手',
    beginner: '1年以内',
    intermediate: '1—3年',
    advanced: '3年以上'
  },
  personality: {
    practical: '务实省心',
    stable: '稳重安全',
    show: '外观优先',
    aggressive: '动力操控',
    freedom: '自由摩旅',
    minimal: '原厂极简'
  },
  power: {
    low: '动力够用',
    mid: '中等动力',
    high: '明显刺激',
    extreme: '极端动力'
  },
  maintenance: {
    low: '基础保养',
    mid: '正常养护',
    high: '愿意升级',
    whatever: '体验优先'
  },
  ownership: {
    low: '低持有成本',
    mid: '成本适中',
    high: '愿为体验付费',
    notcare: '开心优先'
  },
  mod: {
    none: '完全原厂',
    light: '轻改实用',
    medium: '性能升级',
    heavy: '重度改装'
  },
  commuteDistance: {
    short: '单程10km以内',
    medium: '单程10—30km',
    long: '单程30km以上',
    weekend: '不固定/周末为主'
  },
  parking: {
    indoor: '室内固定车位',
    monitored: '有监控/有人看管',
    outdoor: '露天公共区域',
    uncertain: '经常临时停放'
  },
  age: {
    new: '只看新车/准新车',
    young: '接受近5年二手',
    old: '接受合法老车',
    collector: '收藏模式'
  }
};

export const QUESTIONS = [
  {
    id: 'usage',
    section: '核心用途',
    eyebrow: '先定任务',
    title: '这台车买回来，最主要替你干什么？',
    help: '只能先选一个最核心的。用途不清楚，配置越高越容易买错。',
    type: 'single',
    options: [
      { value: 'commute', icon: '城', label: '通勤代步', detail: '每天骑，省心、好停、好挪最重要' },
      { value: 'fun', icon: '玩', label: '周末玩乐', detail: '平时不开，周末出去找情绪价值' },
      { value: 'travel', icon: '旅', label: '摩旅长途', detail: '续航、坐姿、装载和烂路能力' },
      { value: 'status', icon: '镜', label: '撑场面/拍视频', detail: '体量、外观、声浪和镜头表现' },
      { value: 'track', icon: '弯', label: '跑山/赛道', detail: '操控、刹车、轮胎和动力反馈' },
      { value: 'collect', icon: '藏', label: '收藏情怀', detail: '不一定常骑，故事和稀缺性更重要' }
    ]
  },
  {
    id: 'budget',
    section: '预算边界',
    eyebrow: '先看钱包',
    title: '不贷款硬撑，你能接受的落地预算是多少？',
    help: '按“买车+保险+第一轮必要装备/小改”的总预算选，不要只填裸车价。',
    type: 'single',
    options: [
      { value: 8000, icon: '¥', label: '8000以内', detail: '二手工具车、小排通勤' },
      { value: 15000, icon: '¥', label: '8000—1.5万', detail: '基础通勤、入门小排' },
      { value: 25000, icon: '¥', label: '1.5—2.5万', detail: '主流入门玩乐区间' },
      { value: 40000, icon: '¥', label: '2.5—4万', detail: '国产中排主战场' },
      { value: 65000, icon: '¥', label: '4—6.5万', detail: '中高阶玩具、部分进口' },
      { value: 100000, icon: '¥', label: '6.5万以上', detail: '大排、进口、强情绪价值' }
    ]
  },
  {
    id: 'body',
    section: '人车比例',
    eyebrow: '硬性门槛',
    title: '先看你能不能把车撑住、挪动、骑得协调。',
    help: '座高只是一个数字，腿长、体重、车宽和重心同样重要。这里先做初筛，最终必须试坐。',
    type: 'body'
  },
  {
    id: 'experience',
    section: '骑行经验',
    eyebrow: '风险过滤',
    title: '你现在的骑行经验，最接近哪一档？',
    help: '经验不会直接决定你能不能买大排，但会决定犯错后留给你的余量。',
    type: 'single',
    options: [
      { value: 'new', icon: '0', label: '完全新手', detail: '还没有稳定的低速和制动习惯' },
      { value: 'beginner', icon: '1', label: '1年以内', detail: '能正常骑，但经验场景还不够多' },
      { value: 'intermediate', icon: '3', label: '1—3年', detail: '有通勤、跑山或摩旅经验' },
      { value: 'advanced', icon: '+', label: '3年以上', detail: '对车辆反馈和风险边界较熟悉' }
    ]
  },
  {
    id: 'personality',
    section: '性格底色',
    eyebrow: '买车动机',
    title: '下面哪句话，最像你买车时的真实想法？',
    help: '不要选“正确答案”，选你真正会掏钱的那一个。',
    type: 'single',
    options: [
      { value: 'practical', icon: '稳', label: '别天天修就行', detail: '可靠、售后、保值比参数更重要' },
      { value: 'stable', icon: '安', label: '稳重和安全感', detail: '坐姿、制动、电子辅助要踏实' },
      { value: 'show', icon: '帅', label: '帅能抵一半缺点', detail: '外观、质感、回头率优先' },
      { value: 'aggressive', icon: '冲', label: '必须有拉扯感', detail: '动力、操控和声浪不能无聊' },
      { value: 'freedom', icon: '远', label: '路不能限制我', detail: '烂路、长途、装载都要兼顾' },
      { value: 'minimal', icon: '简', label: '原厂够硬就别折腾', detail: '不追复杂配置，也不想长期改装' }
    ]
  },
  {
    id: 'cost',
    section: '养车意愿',
    eyebrow: '买得起≠养得起',
    title: '车买回来以后，你愿意为它付出到什么程度？',
    help: '保养意愿和持有成本分开看。有人愿意勤保养，但不愿意承担高油耗和高折旧。',
    type: 'cost'
  },
  {
    id: 'style',
    section: '外观与改装',
    eyebrow: '情绪价值',
    title: '你对“好看”和“改装”的执念有多重？',
    help: '改装不只花钱，还可能带来噪音、年检、匹配和可靠性问题。',
    type: 'style'
  },
  {
    id: 'power',
    section: '动力反馈',
    eyebrow: '别被排量绑架',
    title: '你真正需要的动力，是哪一种？',
    help: '动力越大，轮胎、刹车、油耗、保险和犯错成本都会一起变大。',
    type: 'single',
    options: [
      { value: 'low', icon: '轻', label: '够用就行', detail: '城市跟车轻松，维护压力低' },
      { value: 'mid', icon: '中', label: '中等动力', detail: '超车不憋屈，日常也能控制' },
      { value: 'high', icon: '快', label: '要明显刺激', detail: '加速和出弯要有拉扯感' },
      { value: 'extreme', icon: '猛', label: '越暴躁越好', detail: '愿意为极端体验接受代价' }
    ]
  },
  {
    id: 'roadload',
    section: '使用环境',
    eyebrow: '现实路况',
    title: '你平常在哪骑，又要带多少东西？',
    help: '很多车单人空载很好骑，一旦带人、装箱、走烂路，性格会完全变。',
    type: 'roadload'
  },
  {
    id: 'commuteParking',
    section: '距离与停车',
    eyebrow: '日常代价',
    title: '你每天要骑多远，车平常停在哪里？',
    help: '通勤距离决定舒适和风阻，停车环境决定你该不该买太贵、太重、太显眼的车。',
    type: 'commuteParking'
  },
  {
    id: 'age',
    section: '车龄接受度',
    eyebrow: '新车还是情怀',
    title: '你能接受多老的车？',
    help: '越老的车越要看手续、维修渠道、配件供应和剩余使用年限。',
    type: 'single',
    options: [
      { value: 'new', icon: '新', label: '只看新车/准新车', detail: '省心，价格透明，售后更完整' },
      { value: 'young', icon: '5', label: '接受近5年二手', detail: '用折旧换性价比' },
      { value: 'old', icon: '旧', label: '接受合法老车', detail: '愿意检查车况、手续和维修渠道' },
      { value: 'collector', icon: '藏', label: '收藏模式', detail: '停产情怀车，甚至不上路也可以' }
    ]
  },
  {
    id: 'avoid',
    section: '最后排雷',
    eyebrow: '一票否决',
    title: '下面哪些问题，会让你买回来直接后悔？',
    help: '可以多选。没有明显雷区也可以直接看结果。',
    type: 'multi'
  }
];

export function budgetLabel(value) {
  return ({
    8000: '8000以内',
    15000: '8000—1.5万',
    25000: '1.5—2.5万',
    40000: '2.5—4万',
    65000: '4—6.5万',
    100000: '6.5万以上'
  })[value] || `${Math.round(Number(value || 0) / 1000) / 10}万级`;
}

export function labelFor(key, value) {
  return LABELS[key]?.[value] || String(value ?? '');
}
