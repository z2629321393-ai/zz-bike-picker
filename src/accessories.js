import { recommendProductLadder } from './product-catalog.js';

export const ACCESSORY_STORAGE_KEY = 'zz-bike-picker-v6.4-accessories';

export const REMINDER_CONFIG = {
  promoImage: 'assets/extension-promo.png',
  promoTitle: '开始前，先确认一件事',
  promoText: '这次只回答你所选项目的问题，完成后就能查看建议；其他装备可以以后再测。',
  spokenLine: '如果想看看我整理的头套、蓝牙耳机或其他骑行装备，也可以到抖音“骑不快的ZZ”的橱窗作参考。先按自己的使用场景选，合适再买。'
};

const q = (id, title, help, options) => ({ id, title, help, options });

export const ACCESSORY_CATEGORIES = [
  {
    id: 'helmet', icon: '盔', title: '帮我选头盔', accent: '安全核心',
    subtitle: '先看头型与佩戴，再比较通风、风噪、重量和预算。',
    questions: [
      q('usage', '你平时最常在哪种场景骑行？', '按大多数时候的真实用途选择，不用为一年只有一两次的极端场景买单。', [
        ['city', '城市通勤', '频繁穿脱、低速、短途，便利与通风更重要'],
        ['touring', '长途摩旅', '连续佩戴、高速风噪、颈部负担更重要'],
        ['sport', '跑山/运动骑行', '高速稳定、贴合和上方视野更重要'],
        ['track', '赛道使用', '低伏视野、气动、固定与双D扣取向更强']
      ]),
      q('fit', '你的头型和试戴情况？', '头围只是尺码起点，头型不合会让好头盔也变成刑具。', [
        ['unknown', '完全不知道', '必须先线下连续试戴15—20分钟'],
        ['round', '偏圆头', '两侧较宽，容易压太阳穴'],
        ['neutral', '中性头型', '主流盔型选择面较广'],
        ['long', '偏长头', '容易压前额或后脑']
      ]),
      q('priority', '你最想优先改善哪一点？', '先选择对你日常体验影响最大的一项。', [
        ['noise', '风噪大', '长途耳朵累、注意力下降'],
        ['weight', '头盔重', '颈部容易酸，频繁回头负担大'],
        ['heat', '闷热', '夏天穿戴率低'],
        ['glasses', '夹眼镜/压耳', '镜腿和耳机空间冲突']
      ]),
      q('style', '外观更偏哪一种？', '好看要顾，但外形不能排在头型和视野前面。', [
        ['stealth', '低调纯色', '黑灰白，容易搭车和骑行服'],
        ['race', '赛车涂装', '视觉强，但更挑整车配色'],
        ['retro', '复古圆润', '适合复古/巡航，但注意视野和气动'],
        ['premium', '精致材质感', '关注漆面、接缝、内衬与整体比例']
      ]),
      q('budget', '你准备为头盔投入多少预算？', '记得给试戴、镜片、防雾片和后续耗材留出余量。', [
        ['entry', '1000以内', '先保合规、合头、扣具可靠'],
        ['mid', '1000—2500', '兼顾重量、通风、内衬和外观'],
        ['high', '2500—5000', '更看重气动、舒适和长期使用细节'],
        ['premium', '5000以上', '高端材料与做工，但不自动等于更合头']
      ])
    ]
  },
  {
    id: 'gloves', icon: '套', title: '帮我选手套', accent: '手感与保护',
    subtitle: '按通勤、跑山、旅行或赛道选择，保护和手感一起看。',
    questions: [
      q('usage', '你主要在哪种强度下骑？', '跑山和赛道不是一个级别，别为了“看起来专业”买过头。', [
        ['city', '城市通勤', '频繁穿脱、低速操作、手机和舒适优先'],
        ['touring', '长途摩旅', '长时间舒适、防风防雨和疲劳控制'],
        ['mountain', '跑山/街道运动', '要保护，也要保留刹车和油门细腻感'],
        ['track', '赛道', '高速摔车风险、长护腕、掌根滑块和固定优先']
      ]),
      q('protection', '你更偏向哪种保护取向？', '越偏赛道，通常越紧、越硬，也越需要磨合。', [
        ['urban', '轻量通勤型', '短护腕、薄掌心、舒服，但覆盖和固定有限'],
        ['roadSport', '街道运动型', '中/长护腕，保护和手感比较均衡'],
        ['touring', '旅行防护型', '全天舒适、防风防水，但膜层会损失一点手感'],
        ['race', '赛道长护腕型', '保护最强，刚戴时更硬、更紧，低速手感未必舒服']
      ]),
      q('feel', '你对“握把手感”有多敏感？', '有些厚重手套会让你觉得像隔着东西抓油门，俗称“握屎感”。', [
        ['thin', '极度在意细腻手感', '希望刹车点、油门和离合都很清晰'],
        ['balanced', '可以接受适度厚度', '保护和手感取中间'],
        ['breakin', '能接受磨合', '前几次硬一点，之后慢慢贴手'],
        ['protectFirst', '保护优先', '接受厚、紧、热和操作不如薄手套灵活']
      ]),
      q('season', '最常骑的天气？', '一副手套很难四季通吃。', [
        ['hot', '炎热', '通风、速干、掌心薄'],
        ['mild', '春秋', '皮革/织物均衡'],
        ['rain', '雨天多', '防水、湿手防滑和袖口搭接'],
        ['cold', '低温', '保暖防风，但厚度会明显影响手感']
      ]),
      q('style', '你希望手套看起来什么感觉？', '外观会影响你是否愿意每次都戴，但不要用夸张硬壳替代真实保护。', [
        ['stealth', '低调黑色', '通勤、ADV、街车都容易搭'],
        ['race', '赛车感', '长护腕、亮色、护壳明显'],
        ['retro', '复古皮质', '巡航/复古车更协调'],
        ['match', '跟车和骑行服配色', '整体好看，但别为了配色买错尺码']
      ])
    ]
  },
  {
    id: 'armor', icon: '甲', title: '帮我选骑行服/护具', accent: '穿戴率与覆盖',
    subtitle: '气候、穿戴频率、耐磨与护具固定，决定你会不会真的穿。',
    questions: [
      q('usage', '主要骑行场景？', '按80%的真实使用选。', [
        ['commute', '城市通勤', '快穿脱、透气、日常外观'],
        ['touring', '长途摩旅', '全天舒适、温差、防雨和储物'],
        ['sport', '跑山/运动骑行', '贴身固定、耐磨、上下装连接'],
        ['track', '赛道', '连体/分体皮衣、滑块和高覆盖优先']
      ]),
      q('climate', '当地气候？', '太热穿不住，买再高级也等于没穿。', [
        ['hot', '炎热潮湿', '大面积网眼和快干'],
        ['mild', '温和', '多用途织物或皮衣'],
        ['rain', '雨水多', '分层防水和快干'],
        ['cold', '低温多', '防风、保暖和内层管理']
      ]),
      q('wearing', '你能接受多复杂的穿戴流程？', '真正愿意每次穿上，才算有效的安全装备。', [
        ['fast', '1分钟内', '护甲衬衣/轻量骑行服'],
        ['normal', '3—5分钟', '完整骑行服+骑行裤'],
        ['full', '愿意完整穿戴', '高覆盖皮衣/组合护具'],
        ['layer', '喜欢分层', '护具、耐磨层、防水层分开']
      ]),
      q('look', '外观诉求？', '骑行服不是只能像赛手，也不能只像普通外套。', [
        ['daily', '像日常衣服', '低调、上班也能穿'],
        ['sport', '运动机能', '贴身、线条明显、和仿赛街车搭'],
        ['adv', '摩旅机能', '口袋、模块化、ADV风格'],
        ['leather', '皮衣质感', '复古/巡航/运动都能做，但更热更重']
      ]),
      q('priority', '你最不愿接受哪种问题？', '请选择最容易让你放弃穿戴的一项。', [
        ['heat', '太热不想穿', '优先透气和轻量'],
        ['move', '护具跑位', '优先贴合和调节'],
        ['ugly', '穿起来太臃肿', '重视版型和隐藏式护具'],
        ['weak', '保护不够', '接受更重更硬的结构']
      ])
    ]
  },
  {
    id: 'boots', icon: '靴', title: '帮我选骑行靴', accent: '脚踝与操控',
    subtitle: '在脚踝保护、换挡脚感、防水和步行之间找平衡。',
    questions: [
      q('usage', '主要场景？', '通勤、摩旅、跑山、赛道和越野是不同鞋。', [
        ['city', '城市通勤', '走路、穿脱和日常外观'],
        ['touring', '长途摩旅', '全天舒适、防水和脚踝支撑'],
        ['sport', '跑山/街道运动', '中高筒、抗扭和换挡手感'],
        ['track', '赛道', '高筒、胫骨、铰链和滑块保护']
      ]),
      q('walk', '下车后要走多久？', '赛道靴保护高，但长时间步行通常像穿硬壳。', [
        ['little', '几乎不走', '可以更硬、更高筒'],
        ['normal', '正常步行', '保护与前掌弯折平衡'],
        ['much', '经常走很久', '更接近运动鞋脚感'],
        ['work', '上班全天穿', '低调外观和舒适优先']
      ]),
      q('feel', '你在意换挡和后刹脚感吗？', '鞋头过厚、鞋底过硬都会改变操作。', [
        ['sensitive', '非常在意', '鞋头薄一些、前掌更灵活'],
        ['balanced', '均衡即可', '适度支撑和操作感'],
        ['protect', '保护优先', '接受脚感变钝'],
        ['newbie', '不确定', '优先易适应、别一上来太硬']
      ]),
      q('weather', '防水需求？', '防水膜通常会牺牲通风。', [
        ['no', '不需要', '更轻、更透气'],
        ['sometimes', '偶尔雨骑', '防泼水即可'],
        ['yes', '经常雨骑', '完整防水内衬和鞋舌结构'],
        ['cold', '低温防风', '保暖和鞋底隔冷']
      ]),
      q('style', '外观更偏哪类？', '鞋是最容易影响整套造型的装备之一。', [
        ['sneaker', '像运动鞋', '低调好搭，但保护上限较低'],
        ['sport', '运动靴', '仿赛/街车协调'],
        ['adv', 'ADV高筒', '摩旅感强，但体积大'],
        ['retro', '复古皮靴', '巡航/复古协调，但注意抗扭结构']
      ])
    ]
  },
  {
    id: 'luggage', icon: '箱', title: '帮我选尾箱/箱包', accent: '重心与美观',
    subtitle: '从用途、容量、支架承载和重心入手，别只看能装多少。',
    questions: [
      q('usage', '装载目的？', '通勤放头盔和长途露营不是同一套方案。', [
        ['commute', '通勤收纳', '头盔、雨衣、电脑'],
        ['touring', '多日摩旅', '衣物、工具和补给'],
        ['camp', '露营重装', '体积大、形状不规则'],
        ['passenger', '经常带人', '保留后座空间和上下车路径']
      ]),
      q('system', '你更偏向哪种箱包系统？', '硬箱方便锁，软包更轻；没有全能答案。', [
        ['topbox', '单尾箱', '方便、防盗、通勤好用，但重心靠后'],
        ['hard3', '硬质三箱', '整齐、防护好，但宽、重、风阻大'],
        ['soft', '软包系统', '轻、摔车不易顶车架，但防盗较弱'],
        ['seat', '尾包/坐垫包', '最轻、最不破坏车感，但容量有限']
      ]),
      q('road', '主要路况？', '烂路会放大支架和锁扣冲击。', [
        ['city', '城市', '便利、防盗、停车宽度'],
        ['highway', '高速/国道', '风阻和摆动'],
        ['mixed', '铺装+烂路', '支架可靠和减震'],
        ['offroad', '非铺装多', '软包、低重心和可变形更友好']
      ]),
      q('volume', '你实际需要多大容量？', '按经常携带的东西来选，不要为“万一用得到”长期背着空箱。', [
        ['small', '只放一顶头盔', '小尾箱/尾包'],
        ['medium', '1—2天', '中等尾箱或双软包'],
        ['large', '多日摩旅', '分体装载'],
        ['huge', '露营重装', '必须做总重量管理']
      ]),
      q('look', '你在意三箱对整车外观的影响吗？', '大箱会改变车的比例，不是装上就一定更“ADV”。', [
        ['clean', '尽量不破坏原车线条', '快拆、小体积、同色'],
        ['adv', '喜欢硬派ADV感', '方箱和金属质感'],
        ['practical', '实用第一', '好开合、防水、容量优先'],
        ['hidden', '平时不要看见支架', '快拆支架和软包更合适']
      ])
    ]
  },
  {
    id: 'lights', icon: '灯', title: '帮我选辅助灯', accent: '光型与电路',
    subtitle: '先判断铺路、远射还是雨雾，再核对光型、电路和当地要求。',
    questions: [
      q('usage', '你安装辅助灯的主要目的是什么？', '用途不同，需要的光型和安装方式也不同。', [
        ['city', '城市提高存在感', '低亮度、规范光型'],
        ['touring', '夜间长途', '近场铺路+远场补充'],
        ['fog', '雨雾天气', '低位宽光、减少反射'],
        ['offroad', '非铺装', '宽近场和远场组合，公路可关闭']
      ]),
      q('beam', '你更需要哪种光？', '一对灯不可能同时把所有区域照好。', [
        ['cutoff', '有截止的近场铺路', '不晃人、日常最实用'],
        ['spot', '远射', '看远处，但近场可能不够'],
        ['flood', '宽泛光', '烂路好用，公路更容易眩光'],
        ['combo', '分区组合', '效果完整，但安装和控制更复杂']
      ]),
      q('electric', '原车电路情况？', '不知道发电余量，就不要先选功率。', [
        ['unknown', '完全不了解', '先测电压和发电余量'],
        ['basic', '知道基础参数', '按功率、线径和保险选'],
        ['ready', '有原厂预留', '仍需确认控制逻辑'],
        ['modified', '已经改过电路', '重新核查接地、保险和共用回路']
      ]),
      q('control', '控制方式？', '功能越多，故障点越多。', [
        ['simple', '独立开关', '简单可靠'],
        ['highbeam', '联动远光', '方便，但必须保留总开关'],
        ['smart', '智能调光', '功能多，控制器和兼容更复杂'],
        ['split', '分区控制', '近光/远光/雾灯分别控制']
      ]),
      q('look', '你希望装上后什么风格？', '灯体和支架太大，会让小车前脸显得拥挤。', [
        ['hidden', '小巧隐蔽', '尽量融入原车'],
        ['factory', '像原厂配置', '线束和支架整洁'],
        ['adv', '硬派拉力风', '大灯体、护网、外露结构'],
        ['performance', '性能感', '对称、低位、视觉更凶']
      ])
    ]
  },
  {
    id: 'intercom', icon: '音', title: '帮我选头盔耳机', accent: '连接与佩戴',
    subtitle: '单人导航、双人对讲和多人组队，是三种不同需求。',
    questions: [
      q('group', '最常见通话人数？', '单人、双人和多人组网需求完全不同。', [
        ['solo', '单人', '导航、电话、音乐'],
        ['pair', '两人', '骑手+后座/固定搭档'],
        ['small', '3—6人', '重连和稳定更重要'],
        ['large', '多人车队', '统一生态和组网优先']
      ]),
      q('priority', '最重要功能？', '不要为几乎不用的功能付费。', [
        ['nav', '导航清楚', '语音清晰、操作简单'],
        ['talk', '对讲稳定', '连接、距离、自动重连'],
        ['music', '音乐好听', '扬声器、调音和位置'],
        ['call', '电话/工作', '麦克风降噪和盲操作']
      ]),
      q('helmetFit', '头盔耳槽空间？', '扬声器压耳，再好听也戴不久。', [
        ['unknown', '不清楚', '先拆内衬看耳槽和走线'],
        ['tight', '很紧', '优先薄扬声器和小底座'],
        ['normal', '正常', '大多数设备可装'],
        ['large', '空间充足', '音响单元和安装自由度更高']
      ]),
      q('operation', '你在意哪种操作方式？', '骑行中操作越少越安全。', [
        ['buttons', '实体大按键', '戴手套容易盲操作'],
        ['dial', '旋钮', '音量方便，但机身可能更突出'],
        ['voice', '语音控制', '减少手部操作，但识别受风噪影响'],
        ['simple', '极简', '只保留导航和电话']
      ]),
      q('look', '你在意装上头盔后的外观吗？', '大机身会破坏复古盔或小盔的侧面线条。', [
        ['slim', '越薄越好', '贴壳、低风阻'],
        ['hidden', '尽量隐藏', '内置或小底座'],
        ['tech', '科技感', '灯效、屏幕、模块感'],
        ['notcare', '外观无所谓', '稳定和续航优先']
      ])
    ]
  },
  {
    id: 'theft', icon: '锁', title: '制定防盗方案', accent: '风险分层',
    subtitle: '按停车环境和车辆价值组合机械锁、定位、报警与保障。',
    questions: [
      q('parking', '最常见停车环境？', '按最差场景设计。', [
        ['indoor', '封闭室内', '风险较低，仍需基础锁和钥匙管理'],
        ['monitored', '监控/看管', '确认监控真实可调取'],
        ['outdoor', '露天公共区域', '机械锁+定位+报警+停车选择'],
        ['uncertain', '经常临停', '便携、多层、缩短无人看管时间']
      ]),
      q('value', '整车和改装大约投入多少？', '防盗投入应与可能承担的损失相匹配。', [
        ['low', '1.5万以内', '基础锁+定位'],
        ['mid', '1.5—4万', '双层机械+定位'],
        ['high', '4—8万', '多层防护和保障条款'],
        ['premium', '8万以上', '停车环境和保障优先级更高']
      ]),
      q('anchor', '停车时通常能连接固定物吗？', '只锁车轮，仍然无法阻止整车被抬走。', [
        ['yes', '经常可以', '链条/U锁连接固定物'],
        ['sometimes', '偶尔可以', '便携组合方案'],
        ['no', '不能', '更依赖定位、报警和停车管理'],
        ['garage', '私人车库', '重点看门禁、钥匙和内部风险']
      ]),
      q('convenience', '你每天愿意花多久上锁？', '太麻烦的方案最后很可能不用。', [
        ['fast', '10秒内', '碟刹锁+定位，便利但防护有限'],
        ['normal', '1分钟', 'U锁/链条+定位'],
        ['full', '愿意完整上锁', '重链、固定物、车罩和双定位'],
        ['managed', '优先换停车点', '把环境风险先降下来']
      ]),
      q('look', '你在意防盗设备是否影响外观？', '隐蔽性和威慑性是两种不同策略。', [
        ['visible', '明显威慑', '粗锁、提醒绳、车罩'],
        ['hidden', '尽量隐蔽', '定位器和暗装报警'],
        ['clean', '不想车上挂东西', '固定车位重锁+随车小锁'],
        ['notcare', '外观不重要', '只看风险降低效果']
      ])
    ]
  }
];

export function createAccessorySession() {
  return { currentCategoryId: null, currentQuestion: 0, answersByCategory: {}, resultsByCategory: {}, promoNext: 'hub' };
}
export function loadAccessorySession() {
  try {
    const raw = localStorage.getItem(ACCESSORY_STORAGE_KEY);
    if (!raw) return createAccessorySession();
    const parsed = JSON.parse(raw);
    return { ...createAccessorySession(), ...parsed, answersByCategory: parsed.answersByCategory || {}, resultsByCategory: parsed.resultsByCategory || {} };
  } catch { return createAccessorySession(); }
}
export function saveAccessorySession(session) { localStorage.setItem(ACCESSORY_STORAGE_KEY, JSON.stringify(session)); }
export function clearAccessorySession() { localStorage.removeItem(ACCESSORY_STORAGE_KEY); }
export function categoryById(id) { return ACCESSORY_CATEGORIES.find((item) => item.id === id) || null; }

export function evaluateAccessory(categoryId, answers = {}, vehicleResult = null) {
  const evaluators = { helmet: evaluateHelmet, gloves: evaluateGloves, armor: evaluateArmor, boots: evaluateBoots, luggage: evaluateLuggage, lights: evaluateLights, intercom: evaluateIntercom, theft: evaluateTheft };
  const result = evaluators[categoryId]?.(answers, vehicleResult);
  if (!result) throw new Error(`Unknown accessory category: ${categoryId}`);
  const productLadder = recommendProductLadder(categoryId, answers, result);
  return {
    categoryId,
    ...result,
    ...buildAccessoryMarketProfile(categoryId, answers, result),
    productLadder,
    spokenLine: REMINDER_CONFIG.spokenLine
  };
}

export function accessoryResultCopy(category, result) {
  return [
    `【骑不快的ZZ｜${category.title}】`,
    `推荐方向：${result.headline}`,
    '', result.summary,
    '', `真实使用感：${result.feelNote}`,
    `外观建议：${result.styleNote}`,
    '', '需要接受的取舍：', ...result.tradeoffs.map((item) => `- ${item}`),
    '', '优先看：', ...result.priorities.map((item) => `- ${item}`),
    '', '常见误区：', ...result.avoid.map((item) => `- ${item}`),
    '', '购买前核对：', ...result.checklist.map((item) => `- ${item}`),
    '', `预算建议：${result.budgetAdvice}`,
    '品牌/产品方向：', ...result.brandHints.map((item) => `- ${item}`),
    `价格提醒：${result.priceWarning}`,
    '平台搜索词：', ...result.searchKeywords.map((item) => `- ${item}`),
    '', '三档候选：',
    ...(result.productLadder?.items || []).flatMap((entry) => [
      `${entry.rank}. ${entry.label}：${entry.product.brand} ${entry.product.model}（${entry.product.priceBand}）`,
      `   ${entry.whyRelaxed}`,
      `   取舍：${entry.product.compromise}`
    ]),
    '', `购买渠道提醒：${result.spokenLine}`
  ].join('\n');
}

function baseResult(headline, summary, metrics) {
  return {
    headline, summary, metrics,
    feelNote: '实际感受仍要靠试穿、试戴或安装后验证，参数只能帮助你先筛选方向。',
    styleNote: '外观应和车型、骑行服及日常穿搭协调，但不能压过安全、合身和可用性。',
    tradeoffs: [], priorities: [], avoid: [], checklist: []
  };
}

function evaluateHelmet(a) {
  const r = baseResult('中性街道全盔，先把合头和长期舒适做对', '你更适合从合规、合头的全盔开始。头盔最重要的是碰撞时稳定留在正确位置，而不是材料名称或价格排名。', metricSet({ 安全固定: 88, 长途舒适: 74, 风噪控制: 68, 通风: 72, 外观协调: 76 }));
  r.priorities.push('测头围后连续试戴15—20分钟，确认额头、太阳穴和后脑没有尖锐压痛', '摇头时头盔不能明显滞后，脸颊应均匀包裹', '核对当前有效的合规/认证信息、扣具、镜片和替换耗材');
  r.avoid.push('只按品牌、碳纤维纹路或“K数”下单', '为了不夹直接买大一号', '只在店里戴30秒就判断舒适');
  r.checklist.push('骑姿下视野完整，尤其是低伏时上方视野', '镜片密封、防雾片和通风口可戴手套操作', '耳槽和眼镜通道不压耳');
  if (a.usage === 'touring') {
    r.headline = '轻量摩旅全盔：风噪、重心和一小时后的舒适更重要';
    r.summary = '摩旅盔不是越轻越好，而是重心、密封、风噪和内衬压力要平衡。长途最怕的不是第一分钟不舒服，而是一个小时后颈部和耳朵开始累。';
    r.metrics = metricSet({ 安全固定: 88, 长途舒适: 91, 风噪控制: 86, 通风: 74, 外观协调: 74 });
    r.tradeoffs.push('更安静通常会牺牲部分通风；大风道通常会增加风噪');
  } else if (a.usage === 'sport') {
    r.headline = '街道运动全盔：高速稳定和贴合优先，但别把赛道盔当通勤盔';
    r.metrics = metricSet({ 安全固定: 93, 长途舒适: 68, 风噪控制: 70, 通风: 84, 外观协调: 88 });
    r.tradeoffs.push('运动盔包裹更紧、风道更多，日常穿脱和安静程度未必最好');
  } else if (a.usage === 'track') {
    r.headline = '赛道取向全盔：低伏视野、气动和固定最强，日常舒适不是第一位';
    r.metrics = metricSet({ 安全固定: 98, 长途舒适: 55, 风噪控制: 60, 通风: 90, 外观协调: 92 });
    r.tradeoffs.push('赛道取向内衬更紧、风道更激进，通勤风噪和穿脱体验可能更差');
    r.feelNote = '戴上会更贴脸、更紧，低伏时视野好；但站直通勤、频繁摘戴时不一定舒服。';
  } else {
    r.tradeoffs.push('城市便利型设计更适合频繁穿脱，但高速气动和安静程度不一定顶级');
  }
  if (a.fit === 'unknown') r.priorities.unshift('先试不同内胆头型，不要直接按头围网购');
  if (a.fit === 'round') r.checklist.push('重点排除太阳穴两侧持续压痛');
  if (a.fit === 'long') r.checklist.push('重点排除前额和后脑集中压点');
  if (a.priority === 'noise') { r.priorities.push('风噪还受风挡、骑姿、密封和耳塞影响，不能只靠头盔解决'); r.metrics = adjustMetric(r.metrics, '风噪控制', 8); }
  if (a.priority === 'weight') r.priorities.push('看整盔重心和颈部感受，不只看克数');
  if (a.priority === 'heat') r.priorities.push('确认低速也有有效进排风，高速风道不直吹眼睛');
  if (a.priority === 'glasses') r.checklist.push('镜腿通道、耳机扬声器和眼镜同时安装后仍不压耳');
  r.styleNote = styleHelmet(a.style);
  return finalize(r);
}

function evaluateGloves(a) {
  const r = baseResult('街道运动长护腕手套：保护、手感和舒适做平衡', '你真正需要的是“戴得住、抓得清、摔车不容易脱”。拳峰硬壳只是其中一部分，掌根、腕部固定、尺码和预弯更重要。', metricSet({ 防护: 78, 舒适: 78, 握持感: 80, 通风: 68, 美观: 82 }));
  r.priorities.push('掌根耐磨/滑块、腕部独立固定和合理护腕长度', '握把时指尖不顶、虎口不拉、手指自然弯曲', '刹车、油门、离合和转向灯必须能细腻操作');
  r.avoid.push('只看拳峰硬壳，不看掌根和腕带', '尺码过大导致摔车时旋转或脱落', '为了外观选过厚掌心或不匹配的预弯');
  r.checklist.push('戴好后握把30秒，确认指根不被缝线勒', '腕带拉紧后手套不能从手上直接拽脱', '弯指时护壳不顶关节、指尖不麻');

  const race = a.protection === 'race' || a.usage === 'track';
  const roadSport = a.protection === 'roadSport' || a.usage === 'mountain';
  const touring = a.protection === 'touring' || a.usage === 'touring';
  const urban = a.protection === 'urban' || a.usage === 'city';

  if (race) {
    r.headline = '赛道长护腕手套：优先强化保护，舒适和低速握持感需要让步';
    r.summary = '赛道级手套通常有更强的掌根滑块、长护腕、腕骨固定、小指联动和厚实皮料。它适合高速摔车风险，不代表日常最好戴。';
    r.metrics = metricSet({ 防护: 98, 舒适: 48, 握持感: 58, 通风: 62, 美观: 94 });
    r.feelNote = '刚戴时会有明显的厚重和隔离感：掌心较厚、预弯较紧，滑块与护壳也会限制手指活动。正确尺码和磨合会改善，但不会像薄通勤手套那样直接。';
    r.tradeoffs.push('保护更强，但穿脱慢、夏天热、低速操作和手机使用更差', '皮料和预弯不合手时，刹车点和油门细腻感会明显下降');
    r.priorities.push('优先试赛道预弯是否和你的手掌宽度、指长匹配', '接受至少数次磨合，但不能靠忍受麻木或压痛来磨合');
    r.avoid.push('只为了赛车外观，日常通勤也买最硬最厚的赛道手套');
  } else if (roadSport) {
    r.headline = '街道运动手套：比纯赛道舒服，保护和抓握更适合跑山';
    r.summary = '这类手套保留长护腕、掌根防护和较好的腕部固定，但皮料、预弯和护壳没有纯赛道那么极端，跑山和街道激烈骑行更容易长期使用。';
    r.metrics = metricSet({ 防护: 86, 舒适: 76, 握持感: 82, 通风: 72, 美观: 90 });
    r.feelNote = '比赛道手套更贴近日常握把手感，厚重的隔离感更少；仍保留保护结构，也更容易感知离合、刹车和油门细节。';
    r.tradeoffs.push('保护上限不如纯赛道手套，但实际穿戴率和操作感通常更高');
  } else if (touring) {
    r.headline = '旅行长护腕手套：全天舒适和防风防雨优先';
    r.metrics = metricSet({ 防护: 76, 舒适: 90, 握持感: 68, 通风: a.season === 'hot' ? 74 : 52, 美观: 72 });
    r.feelNote = '旅行手套更舒服，但防水膜、保暖层会让掌心变厚，刹车和油门手感会比单层皮手套钝一些。';
    r.tradeoffs.push('防水、保暖越强，握持细腻感和通风通常越差');
    r.priorities.push('袖口和骑行服要形成顺水搭接，防止雨水灌入');
  } else if (urban) {
    r.headline = '轻量城市手套：最舒服、手感最好，但保护边界要说清楚';
    r.metrics = metricSet({ 防护: 58, 舒适: 94, 握持感: 94, 通风: 88, 美观: 80 });
    r.feelNote = '薄掌心、柔软织物或软皮会让油门和刹车反馈更直接；代价是护腕短，固定和耐磨上限较低。';
    r.tradeoffs.push('舒服、灵活、适合通勤，但不适合承担高速跑山或赛道风险');
  }

  if (a.feel === 'thin' && race) r.tradeoffs.unshift('你的手感要求和赛道级结构冲突，优先考虑街道运动型而不是纯赛道型');
  if (a.feel === 'protectFirst') r.priorities.push('允许更厚更紧，但必须保留清晰刹车操作，不能靠用更大力补偿');
  if (a.feel === 'breakin') r.checklist.push('磨合后应变贴手；若持续麻、顶指或虎口拉扯，说明不是磨合问题而是版型不合');
  if (a.season === 'cold') r.tradeoffs.push('保暖层会明显增加厚度并降低握把反馈，必要时可用加热手把分担保暖任务');
  if (a.season === 'rain') r.priorities.push('湿手抓握、防水膜固定和袖口防灌水比触屏更重要');
  r.styleNote = styleGloves(a.style, race);
  return finalize(r);
}

function evaluateArmor(a) {
  const r = baseResult('贴合的多用途骑行服：穿戴率、护具位置和耐磨一起做', '护具不是越多越安全。真正有效的是肩肘背在骑姿中不跑位，外层耐磨，而且你每次出门愿意穿。', metricSet({ 撞击保护: 78, 耐磨: 76, 舒适: 78, 穿脱便利: 72, 美观: 76 }));
  r.priorities.push('坐上车后肩、肘、背护具仍覆盖关节中心', '版型能固定护具，袖口、腰部和连接结构不松垮', '外层耐磨与护具撞击吸收是两件事，不能只看护具');
  r.avoid.push('买最厚重后因为热和麻烦不穿', '站立合适、骑姿却跑位', '只穿硬壳护甲，外面没有耐磨层');
  r.checklist.push('骑姿抬臂不勒肩、后背不露', '护具标签、位置和可替换性清楚', '拉链、接缝和高磨损区有加强');
  if (a.usage === 'commute') {
    r.headline = '城市轻量骑行服/护甲衬衣：日常好看和每次都穿更重要';
    r.metrics = metricSet({ 撞击保护: 70, 耐磨: 68, 舒适: 91, 穿脱便利: 94, 美观: 90 });
    r.tradeoffs.push('外观日常、穿脱快，但耐磨和覆盖上限低于皮衣或完整套装');
  } else if (a.usage === 'touring') {
    r.headline = '分层摩旅骑行服：温差、防雨和全天舒适优先';
    r.metrics = metricSet({ 撞击保护: 80, 耐磨: 82, 舒适: 86, 穿脱便利: 66, 美观: 74 });
    r.tradeoffs.push('口袋、内胆和防水层越多，体积和重量越大');
  } else if (a.usage === 'sport') {
    r.headline = '街道运动皮衣/耐磨织物：贴身固定和上下装连接优先';
    r.metrics = metricSet({ 撞击保护: 88, 耐磨: 90, 舒适: 65, 穿脱便利: 55, 美观: 91 });
    r.tradeoffs.push('版型更贴、保护更高，但热、紧、日常走路和穿脱更麻烦');
  } else if (a.usage === 'track') {
    r.headline = '赛道皮衣系统：保护和耐磨最高，舒适与便利明显让步';
    r.metrics = metricSet({ 撞击保护: 98, 耐磨: 98, 舒适: 42, 穿脱便利: 25, 美观: 96 });
    r.feelNote = '站着会勒、走路不自然，坐上车才进入正确姿态；这不是日常舒适装备。';
    r.tradeoffs.push('保护高，但热、重、穿脱慢，日常穿戴率很低');
  }
  if (a.climate === 'hot') r.priorities.push('大面积网眼和浅色更现实，必要时把防雨层独立携带');
  if (a.priority === 'ugly') r.styleNote = '优先修身版型、隐藏式护具和低调配色；但护具不能为了显瘦被挤出关节位置。';
  else r.styleNote = styleArmor(a.look);
  if (a.wearing === 'fast') r.avoid.push('需要十几分钟穿戴、最终只能挂墙的完整套装');
  return finalize(r);
}

function evaluateBoots(a) {
  const r = baseResult('中筒街道骑行靴：脚踝支撑、换挡感和步行做平衡', '骑行靴的价值是在压车、倒车和滑行时限制脚踝过度扭转，并保护脚背、后跟和胫骨。', metricSet({ 脚踝保护: 80, 步行舒适: 76, 换挡脚感: 78, 防水: 55, 美观: 82 }));
  r.priorities.push('脚踝两侧、后跟和鞋头有结构支撑，鞋底不易横向扭曲', '坐上车后能自然勾到换挡杆和踩后刹', '穿骑行袜试尺码，脚跟不抬、脚趾有合理余量');
  r.avoid.push('把普通高帮鞋当骑行靴', '为了走路软选择无抗扭结构', '鞋头太厚导致换挡杆位置不合');
  r.checklist.push('脚踝活动够用但不左右松垮', '鞋底遇油水不易打滑', '拉链/魔术贴关闭后不刮车漆');
  if (a.usage === 'touring') {
    r.headline = '中高筒摩旅靴：全天舒适、防水和脚踝支撑优先';
    r.metrics = metricSet({ 脚踝保护: 84, 步行舒适: 82, 换挡脚感: 66, 防水: 90, 美观: 70 });
    r.tradeoffs.push('防水层和高筒会让鞋更热、更厚，换挡脚感变钝');
  } else if (a.usage === 'sport') {
    r.headline = '街道运动高筒靴：比赛道靴好走，抗扭和换挡感更均衡';
    r.metrics = metricSet({ 脚踝保护: 90, 步行舒适: 62, 换挡脚感: 82, 防水: 30, 美观: 92 });
    r.tradeoffs.push('比通勤靴硬、热、走路累，但比纯赛道靴更适合街道');
  } else if (a.usage === 'track') {
    r.headline = '赛道高筒靴：胫骨、铰链和抗扭优先，走路与舒适明显让步';
    r.metrics = metricSet({ 脚踝保护: 99, 步行舒适: 28, 换挡脚感: 72, 防水: 10, 美观: 96 });
    r.feelNote = '脚踝被限制、走路像穿硬壳，换挡需要重新适应；它是为摔车保护设计，不是为逛街设计。';
    r.tradeoffs.push('保护最高，但走路累、穿脱慢、夏天热，日常通勤并不舒服');
  } else if (a.usage === 'city') {
    r.headline = '城市骑行鞋：最好走、最好搭，但必须接受保护上限';
    r.metrics = metricSet({ 脚踝保护: 62, 步行舒适: 94, 换挡脚感: 90, 防水: 45, 美观: 92 });
    r.tradeoffs.push('外观和走路更自然，但高筒覆盖、抗扭和胫骨保护有限');
  }
  if (a.feel === 'sensitive') r.priorities.push('优先薄鞋头、清晰前掌弯折和适合原车换挡杆高度');
  if (a.feel === 'protect') r.tradeoffs.push('抗扭越强，脚感越硬；不能用“像运动鞋一样软”作为评价标准');
  if (a.weather === 'yes') r.checklist.push('防水膜、鞋舌结构和裤脚搭接必须完整');
  r.styleNote = styleBoots(a.style);
  return finalize(r);
}

function evaluateLuggage(a, vehicleResult) {
  const r = baseResult('中等容量快拆尾箱/尾包：先解决真实收纳，同时控制车尾重心', '装载系统会改变重心、风阻、车宽、后避震和整车比例。容量越大不一定越实用。', metricSet({ 容量: 70, 稳定性: 82, 便利: 86, 耐用: 76, 外观协调: 82 }));
  r.priorities.push('查原车后货架和副车架允许载荷', '重物低、靠前、左右平衡，尾箱尽量放轻物', '满载后重测胎压、后避震和制动距离');
  r.avoid.push('只按升数买最大三箱', '忽略箱体自重和支架重量', '把大尾箱当后座长期受力靠背');
  r.checklist.push('锁扣、防水、支架螺丝和防松措施', '高速前先低速测试摆动和转向变化', '边箱不干涉排气、后座脚和转向');
  if ((a.usage === 'camp' || a.volume === 'huge') && (!a.system || a.system === 'soft')) {
    r.headline = '露营重装软包系统：容量够用，但重物必须低位分散';
    r.metrics = metricSet({ 容量: 92, 稳定性: 88, 便利: 58, 耐用: 72, 外观协调: 78 });
    r.tradeoffs.push('容量大但整理和防盗更麻烦，不能把所有重量堆在车尾最高处');
    r.priorities.push('睡袋等轻物可放高位，工具和水必须低位靠前');
  }
  if (a.system === 'hard3') {
    r.headline = '硬质三箱：整齐、防盗、硬派，但宽、重、风阻和重心代价最大';
    r.metrics = metricSet({ 容量: 96, 稳定性: a.road === 'offroad' ? 55 : 72, 便利: 82, 耐用: 88, 外观协调: a.look === 'adv' ? 92 : 62 });
    r.tradeoffs.push('停车钻缝更困难，满载后车尾惯性和侧风影响更明显', '空箱也有自重，支架长期给副车架增加负担');
  } else if (a.system === 'soft') {
    r.headline = '软包系统：更轻、更适合烂路，但防盗和快速开合要让步';
    r.metrics = metricSet({ 容量: 84, 稳定性: 90, 便利: 62, 耐用: 72, 外观协调: 78 });
    r.tradeoffs.push('防盗弱、雨天整理麻烦，需要更认真固定和防烫');
  } else if (a.system === 'seat') {
    r.headline = '尾包/坐垫包：最轻、最不破坏操控和外观，容量有限';
    r.metrics = metricSet({ 容量: 54, 稳定性: 94, 便利: 70, 耐用: 68, 外观协调: 92 });
    r.tradeoffs.push('容量和防盗有限，拿取不如尾箱方便');
  } else {
    r.tradeoffs.push('尾箱便利，但重心高且靠后，装重物最容易让车变笨');
  }
  if (a.road === 'offroad') r.priorities.push('非铺装优先可变形软包和低重心，减少勾挂和支架冲击');
  if (a.volume === 'huge') r.tradeoffs.push('露营重装必须计算总重量，不是箱子装得下车就扛得住');
  if (vehicleResult?.primary === 'sport') r.avoid.push('仿赛长期装超大三箱，破坏尾部结构、重心和视觉比例');
  if (vehicleResult?.primary === 'scooter') r.priorities.push('踏板先用座桶，再补尾箱，别重复堆容量');
  r.styleNote = styleLuggage(a.look, a.system);
  return finalize(r);
}

function evaluateLights(a) {
  const r = baseResult('小体积规范截止补光：先把近场铺路和不晃人做对', '射灯不是越亮越安全。错误光型会让对向看不清你，也会让自己在雨雾中看到一片反光。', metricSet({ 有效照明: 78, 光型控制: 90, 电路可靠: 86, 安装简洁: 88, 外观协调: 86 }));
  r.priorities.push('确认光型、安装高度和照射角度，不直射对向', '独立保险、合适线径、继电器/控制器和可靠接地', '灯体、接头、开关和控制器具备防水与耐振');
  r.avoid.push('只看瓦数和流明', '直接破线并联原车灯线', '为了外观装超大灯体挡风或干涉转向');
  r.checklist.push('怠速和低转电压稳定，不影响启动充电', '保留独立总开关和故障旁路', '核对当地道路、年检和使用要求');
  if (a.beam === 'spot') {
    r.headline = '远射补光：看得远，但必须补近场并严格控制使用场景';
    r.metrics = metricSet({ 有效照明: 90, 光型控制: 68, 电路可靠: 82, 安装简洁: 78, 外观协调: 80 });
    r.tradeoffs.push('远处亮，车头近场可能出现黑区；公路误开更容易晃人');
  } else if (a.beam === 'flood') {
    r.headline = '宽泛光：烂路近场好用，公共道路眩光风险最高';
    r.metrics = metricSet({ 有效照明: 88, 光型控制: 48, 电路可靠: 80, 安装简洁: 76, 外观协调: 78 });
    r.tradeoffs.push('照得宽但截止差，雨雾和公共道路更容易反光、眩目');
  } else if (a.beam === 'combo') {
    r.headline = '分区组合补光：效果最完整，但电路、控制和安装复杂度最高';
    r.metrics = metricSet({ 有效照明: 96, 光型控制: 84, 电路可靠: 70, 安装简洁: 45, 外观协调: 72 });
    r.tradeoffs.push('灯多、控制器多、线束多，故障点和外观拥挤同步增加');
  } else {
    r.tradeoffs.push('有截止的近场灯最适合日常，但极远距离照明不如远射灯');
  }
  if (a.electric === 'unknown') r.priorities.unshift('先测原车发电余量和电瓶状态，再谈功率');
  if (a.control === 'smart') r.tradeoffs.push('智能调光更方便，但控制器、兼容和故障排查也更复杂');
  r.styleNote = styleLights(a.look);
  return finalize(r);
}

function evaluateIntercom(a) {
  const r = baseResult('轻薄单人导航型耳机：舒适、操作和稳定优先', '摩托车耳机首先是信息工具，其次才是音响。头盔耳槽、按键、麦克风和连接稳定比参数表更影响体验。', metricSet({ 对讲稳定: 72, 音乐: 74, 佩戴舒适: 90, 操作便利: 88, 外观协调: 88 }));
  r.priorities.push('先检查耳槽、扬声器厚度和麦克风位置', '戴手套能盲操作主要功能', '高速实测麦克风、重连和导航清晰度');
  r.avoid.push('只看最大连接人数', '扬声器压耳后靠调大音量解决', '机身太大破坏头盔气动和外观');
  r.checklist.push('戴头盔30分钟耳朵不痛', '充电口、防水、续航和底座可靠', '主要功能不需要频繁看手机');
  if (a.group === 'pair') {
    r.headline = '稳定双人对讲：先看连接、麦克风和盲操作';
    r.metrics = metricSet({ 对讲稳定: 90, 音乐: 72, 佩戴舒适: 84, 操作便利: 84, 外观协调: 82 });
  } else if (a.group === 'small') {
    r.headline = '小车队组网：重连和统一生态，比理论距离更重要';
    r.metrics = metricSet({ 对讲稳定: 92, 音乐: 66, 佩戴舒适: 78, 操作便利: 72, 外观协调: 72 });
    r.tradeoffs.push('多人组网机身和操作通常更复杂，音乐不是第一优先');
  } else if (a.group === 'large') {
    r.headline = '多人车队组网：稳定重连与统一生态优先';
    r.metrics = metricSet({ 对讲稳定: 98, 音乐: 64, 佩戴舒适: 70, 操作便利: 58, 外观协调: 65 });
    r.tradeoffs.push('人数越多越依赖统一设备和流程，机身更大、续航和成本更高');
  }
  if (a.priority === 'music') { r.priorities.push('扬声器位置比单纯尺寸更重要，耳塞和风噪会改变音质'); r.metrics = adjustMetric(r.metrics, '音乐', 12); }
  if (a.helmetFit === 'tight') r.priorities.unshift('优先超薄扬声器和小底座，不能硬塞压耳');
  if (a.operation === 'voice') r.tradeoffs.push('语音控制能减少手部操作，但高速风噪下识别未必稳定');
  r.styleNote = styleIntercom(a.look);
  return finalize(r);
}

function evaluateTheft(a, vehicleResult) {
  const parking = a.parking || vehicleResult?.answers?.parking;
  const r = baseResult('基础分层防盗：机械锁+定位/报警+停车选择', '防盗不是买一个最贵的锁，而是同时增加偷车时间、噪声、工具要求和暴露概率。', metricSet({ 威慑: 78, 实际阻碍: 80, 隐蔽追踪: 76, 日常便利: 72, 外观影响: 74 }));
  r.priorities.push('至少两种不同逻辑：机械锁+定位/报警', '优先明亮、有人流、有监控且能锁固定物的位置', '定期检查定位器电量、通知和备用定位');
  r.avoid.push('只依赖龙头锁或单个碟刹锁', '定位器装得明显且只装一个', '为了外观不带任何实体锁');
  r.checklist.push('机械锁不干涉刹车盘、轮胎和线束', '手机异常位移通知正常', '保留购车、改装、钥匙和停车证据并核对保障条款');
  if (parking === 'outdoor' || parking === 'uncertain') {
    r.headline = '高风险停车：固定物重锁+双定位+异常位移提醒+保障核对';
    r.metrics = metricSet({ 威慑: 94, 实际阻碍: 92, 隐蔽追踪: 90, 日常便利: 42, 外观影响: 48 });
    r.tradeoffs.push('更安全意味着更重、更麻烦、更影响整洁；首先应考虑换停车点');
  } else if (parking === 'indoor') {
    r.tradeoffs.push('室内不等于绝对安全，门禁、钥匙和长期无人查看仍是风险');
  }
  if (a.convenience === 'fast') r.tradeoffs.push('10秒方案便利，但只能做基础威慑，不能替代固定锁和停车管理');
  if (a.convenience === 'full') r.priorities.push('重链连接车架/后轮与固定物，车罩降低目标暴露');
  if (a.value === 'high' || a.value === 'premium') r.priorities.push('比较盗抢保障、找车协助、找回期限、折旧和免责范围');
  r.styleNote = styleTheft(a.look);
  return finalize(r);
}

function metricSet(values) { return Object.entries(values).map(([label, value]) => ({ label, value })); }
function adjustMetric(metrics, label, delta) { return metrics.map((m) => m.label === label ? { ...m, value: clamp(m.value + delta, 0, 100) } : m); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function finalize(r) {
  r.tradeoffs = unique(r.tradeoffs).slice(0, 6);
  if (!r.tradeoffs.length) r.tradeoffs = ['没有全能方案：某一项更强，通常会在舒适、重量、便利、价格或美观上付出代价'];
  r.priorities = unique(r.priorities).slice(0, 7);
  r.avoid = unique(r.avoid).slice(0, 6);
  r.checklist = unique(r.checklist).slice(0, 7);
  return r;
}
function unique(items) { return [...new Set(items.filter(Boolean))]; }



function buildAccessoryMarketProfile(categoryId, answers, result) {
  const maps = {
    helmet: helmetMarket,
    gloves: glovesMarket,
    armor: armorMarket,
    boots: bootsMarket,
    luggage: luggageMarket,
    lights: lightsMarket,
    intercom: intercomMarket,
    theft: theftMarket
  };
  const profile = maps[categoryId]?.(answers, result) || {};
  return {
    image: `assets/gear/${categoryId}.svg`,
    budgetAdvice: profile.budgetAdvice || '先按使用频率和风险确定预算，不要先追求最高配置。',
    brandHints: profile.brandHints || ['品牌只作为候选池；具体产品仍要核对尺码、标准、售后和真实评价。'],
    priceWarning: profile.priceWarning || '低价不自动等于不能用，但低到无法说明材料、标准、售后和结构时，不建议只图便宜。',
    searchKeywords: profile.searchKeywords || [result.headline],
    referenceLinks: profile.referenceLinks || []
  };
}

function helmetMarket(a, result) {
  const base = {
    budgetAdvice: '预算必须给试戴、替换镜片、防雾片和耳塞留余量；先买合头的正规全盔，再谈轻量和涂装。',
    brandHints: ['赛羽：预算紧时可列入入门候选，优先看符合现行标准、尺码和头型合适的具体型号。', '其他正规品牌：按头型、扣具、镜片耗材、售后和试戴感受横向比较，不按品牌名直接判安全。'],
    priceWarning: '预算在1000元以内时，可以把赛羽等入门型号列入候选，但不建议只追求最低价。先确认合头、符合现行标准、扣具和镜片，再比较材料与涂装。',
    searchKeywords: ['赛羽 摩托车全盔 GB 811-2022', '摩托车全盔 试戴 头型', '摩托车头盔 防雾片 双D扣'],
    referenceLinks: [
      { label: '赛羽 SCOYCO 官方品牌信息', url: 'https://www.scoyco.com/' },
      { label: '国家标准 GB 811-2022（现行）', url: 'https://std.samr.gov.cn/gb/search/gbDetailed?id=F0ADFAAEF0811328E05397BE0A0AD5A4' }
    ]
  };
  if (a.budget === 'entry') {
    base.budgetAdvice = '1000元以内：先核对现行 GB 811-2022，再把合头、扣具、镜片和售后做对。不要为了“碳纤维”或炫涂装压缩基本安全预算。';
  } else if (a.budget === 'mid') {
    base.budgetAdvice = '1000—2500元：开始兼顾重量、通风、内衬、镜片系统和风噪，但仍以头型适配为第一优先。';
  } else if (a.budget === 'high') {
    base.budgetAdvice = '2500—5000元：重点比较高速气动、长时间压点、内衬质感、耗材供应和售后。';
  } else if (a.budget === 'premium') {
    base.budgetAdvice = '5000元以上：价格可以买到材料、做工和品牌体系，但不会自动买到最适合你的头型。';
  }
  if (a.usage === 'track') base.searchKeywords.unshift('赛道全盔 双D扣 低伏视野');
  if (a.usage === 'touring') base.searchKeywords.unshift('摩旅全盔 轻量 风噪');
  return base;
}

function glovesMarket(a, result) {
  const race = a.protection === 'race' || a.usage === 'track';
  const road = a.protection === 'roadSport' || a.usage === 'mountain';
  const touring = a.protection === 'touring' || a.usage === 'touring';
  const urban = a.protection === 'urban' || a.usage === 'city';
  const searchKeywords = race
    ? ['摩托车赛道长护腕手套 掌根滑块', '赛道手套 小指联动 双腕带', '摩托车长护腕手套 尺码表']
    : road
      ? ['街道运动手套 长护腕 掌根滑块', '跑山骑行手套 皮革 预弯', '摩托车手套 握持感']
      : touring
        ? ['摩旅防水手套 长护腕', '摩托车旅行手套 防风 防雨', '骑行手套 湿手防滑']
        : ['夏季通勤骑行手套 透气', '轻量摩托车手套 掌根耐磨', '摩托车手套 短护腕']
  return {
    budgetAdvice: race ? '赛道手套不能只压价格：掌根滑块、腕部固定、皮料和版型不到位，外形再像赛道也没有意义。' : '街道和通勤优先买一副真正愿意长期戴、握把自然、腕带可靠的手套，不必为了最高赛道等级牺牲穿戴率。',
    brandHints: ['先看掌根滑块、腕带、指长/掌宽版型和售后尺码政策，再看品牌和硬壳外观。', '同一品牌不同系列的手感差异可能很大，电商评价要重点看“掌宽、指长、是否顶指、虎口是否拉扯”。'],
    priceWarning: race ? '过低价的“赛道外形手套”可能只是硬壳多，未必有可靠掌根滑块、腕部固定和耐磨结构。' : '太便宜的手套容易在缝线、掌心耐磨和腕带固定上省成本；不要只看拳峰硬壳。',
    searchKeywords
  };
}

function armorMarket(a) {
  return {
    budgetAdvice: a.usage === 'track' ? '赛道皮衣和护具要把合身修改、内搭和维护成本一起算，不能只看吊牌价。' : '先保证肩肘背护具位置稳定、外层耐磨和夏季愿意穿，再逐步升级。',
    brandHints: ['优先看护具标识、位置调节、耐磨面料、接缝加强和售后尺码。', '网眼通勤服、街道运动服、摩旅服和皮衣是不同使用方向，不要拿一件衣服四季全覆盖。'],
    priceWarning: '太便宜但无法说明护具、耐磨层和高磨损区结构的产品，不建议只靠“硬壳看起来很厚”判断。',
    searchKeywords: a.usage === 'track' ? ['摩托车赛道皮衣 护背 连体', '摩托车分体皮衣 上下连接'] : a.usage === 'touring' ? ['摩旅骑行服 防水 分层 护具', 'ADV骑行服 夏季 网眼'] : ['摩托车骑行服 护具 耐磨', '夏季网眼骑行服 肩肘背']
  };
}

function bootsMarket(a) {
  return {
    budgetAdvice: '骑行靴预算要先买到脚踝、后跟、鞋头和鞋底抗扭结构；日常走路需求越高，越要试穿。',
    brandHints: ['重点对比脚型、鞋楦、鞋头厚度、脚踝支撑和换挡区域，不要只看高筒外观。', '电商评论重点筛“宽脚/瘦脚、脚背高低、是否磨踝、换挡杆是否干涉”。'],
    priceWarning: '普通高帮鞋即使外观像骑行靴，也不等于具备抗扭、后跟和脚踝保护。',
    searchKeywords: a.usage === 'track' ? ['摩托车赛道高筒靴 铰链 抗扭', '赛道骑行靴 胫骨 滑块'] : a.usage === 'touring' ? ['摩旅骑行靴 防水 中高筒', 'ADV骑行靴 抗扭'] : ['城市骑行鞋 脚踝保护', '街道运动骑行靴 换挡']
  };
}

function luggageMarket(a) {
  return {
    budgetAdvice: '三箱预算必须连支架、安装、防水、锁扣和后期维修一起算；箱体便宜但支架不可靠，风险更大。',
    brandHints: ['先核对原车货架/副车架承载、快拆结构、锁扣和备件供应。', '小车优先控制箱体宽度和高度；大ADV也不能把允许载荷当推荐长期满载。'],
    priceWarning: '超低价大铝箱常把成本省在支架、锁扣、防水和焊接上，不建议只按升数和外观选。',
    searchKeywords: a.system === 'hard3' ? ['摩托车三箱 支架 承重 快拆', 'ADV铝合金边箱 防水 锁扣'] : a.system === 'soft' ? ['摩托车软边包 防烫 固定', '摩旅软包 防水'] : ['摩托车尾箱 快拆 支架', '摩托车尾包 防水']
  };
}

function lightsMarket(a) {
  return {
    budgetAdvice: '射灯预算要包含合格线束、继电器/控制器、保险、支架和规范安装；不能只买灯体。',
    brandHints: ['优先比较真实光型、截止、色温、防水、散热、线束和售后。', '对比图要看同一曝光和同一墙面，过曝宣传图不能说明照明效果。'],
    priceWarning: '太便宜的高功率射灯容易在光型、驱动、防水和线束上省成本，亮不等于安全。',
    searchKeywords: a.beam === 'spot' ? ['摩托车远射射灯 独立开关 保险', '摩托车射灯 远光 联动'] : a.beam === 'flood' ? ['摩托车宽泛光射灯 非铺装', '摩托车雾灯 低位 宽光'] : ['摩托车射灯 截止线 近场铺路', '摩托车射灯 线束 继电器 保险']
  };
}

function intercomMarket(a) {
  return {
    budgetAdvice: '蓝牙耳机先买稳定连接、舒适扬声器、清晰麦克风和可盲操作；不用为几乎不使用的多人组网付费。',
    brandHints: ['固定车队最好统一生态；单人通勤重点看导航、电话、续航和耳槽适配。', '电商评价重点看高速麦克风、自动重连、按键手感、耳朵压痛和售后。'],
    priceWarning: '低价产品常在麦克风降噪、重连、底座、防水和电池寿命上拉开差距；不要只看“连接人数”和理论距离。',
    searchKeywords: a.group === 'large' ? ['摩托车蓝牙耳机 多人组网 自动重连', '摩托车车队对讲 Mesh'] : a.group === 'pair' ? ['摩托车蓝牙耳机 双人对讲', '骑手后座蓝牙耳机'] : ['摩托车蓝牙耳机 导航 电话 薄扬声器', '头盔蓝牙耳机 高速降噪']
  };
}

function theftMarket(a) {
  return {
    budgetAdvice: '防盗预算应和整车、改装件、停车风险匹配。先改善停车环境，再组合机械锁、定位、报警和保障。',
    brandHints: ['不同逻辑叠加比单买最贵的一把锁更有效：固定物重锁、碟刹锁、定位器、报警和车罩。', '保障产品要逐条核对找回期限、折旧、保障金额、免责和理赔材料。'],
    priceWarning: '太便宜的锁具、定位器和报警器可能在锁芯、材料、信号、续航和通知稳定性上失效；不能只看宣传图粗不粗。',
    searchKeywords: a.parking === 'outdoor' ? ['摩托车重链锁 固定物 防剪', '摩托车GPS定位器 异常位移', '摩托车盗抢保障 条款'] : ['摩托车碟刹锁 提醒绳', '摩托车定位器 防拆']
  };
}

function styleHelmet(v) {
  return ({
    stealth: '低调纯色最容易和不同车型、骑行服长期搭配，也更耐看。',
    race: '赛车涂装视觉最强，但要看车身主色、骑行服和镜片颜色，让整套配色保持协调。',
    retro: '复古外形适合复古/巡航，但不要为了圆润造型接受过窄视野或差气动。',
    premium: '精致感来自漆面、接缝、内衬、镜片和比例，不是只看碳纤维纹路。'
  })[v] || '优先选择和车型、骑行服协调且长期耐看的配色。';
}
function styleGloves(v, race) {
  const base = ({
    stealth: '低调黑色最耐搭，也不会让通勤装备看起来过于用力。',
    race: '赛车色和长护腕最有视觉冲击，但纯赛道结构也会带来更紧、更硬和更明显的握把隔离感。',
    retro: '复古皮手套和巡航/复古车协调，但必须补齐掌根耐磨和腕部固定。',
    match: '按车身和骑行服配色能提升整体感，但尺码、掌宽和手感优先级更高。'
  })[v] || '外观可以匹配车和骑行服，但不要让夸张护壳替代真实保护。';
  return race ? `${base} 赛道手套看起来最专业，但它的美观和保护是用舒适、穿脱和低速细腻感换来的。` : base;
}
function styleArmor(v) {
  return ({
    daily: '选择低调版型、隐藏护具和日常配色，提高上班通勤穿戴率。',
    sport: '贴身运动线条适合街车/仿赛，但太紧会让护具顶关节、太松会跑位。',
    adv: '摩旅机能风和ADV协调，但口袋和模块越多越容易臃肿。',
    leather: '皮衣质感强、耐磨好，但热、重、保养和雨天使用代价更高。'
  })[v] || '版型与车型协调，但护具位置和穿戴率优先。';
}
function styleBoots(v) {
  return ({
    sneaker: '运动鞋外观最好搭、最好走，但要确认脚踝、后跟和鞋底抗扭不是装饰。',
    sport: '运动高筒和仿赛/街车协调，视觉更完整，但日常走路更累。',
    adv: 'ADV高筒靴硬派、保护强，但体积大，配小排量街车可能显得头重脚重。',
    retro: '复古皮靴适合巡航/复古车，重点核对内部抗扭和脚踝结构。'
  })[v] || '鞋型要和车型、裤型协调，但不牺牲脚踝结构。';
}
function styleLuggage(v, system) {
  const text = ({
    clean: '优先同色、窄体、快拆和隐藏支架，保持原车线条。',
    adv: '方箱和金属质感能强化ADV视觉，但小车装过大箱会显得比例失衡。',
    practical: '实用第一也要控制宽度和高度，避免看起来像长期搬家。',
    hidden: '平时不想看见支架，优先软包、尾包或真正快拆的系统。'
  })[v] || '箱包应服从整车比例。';
  return system === 'hard3' ? `${text} 三硬箱最容易让车显得“满”，尺寸必须和车架体量匹配。` : text;
}
function styleLights(v) {
  return ({
    hidden: '小体积、低位、藏线最不破坏前脸，适合街车和小排量车。',
    factory: '原厂感来自对称支架、整洁线束、统一色温和不过度外露。',
    adv: '大灯体、护网和外露支架有拉力感，但小车前脸容易显拥挤。',
    performance: '低位对称和硬朗支架能增强性能感，前提是不干涉转向和风道。'
  })[v] || '灯体大小、位置和线束整洁度决定是否像原厂。';
}
function styleIntercom(v) {
  return ({
    slim: '优先薄机身、贴壳底座，减少风阻和侧面突兀。',
    hidden: '内置或小底座最适合复古盔和简洁外观，但功能和散热空间可能更有限。',
    tech: '灯效和模块感适合科技风，但体积、风噪和续航也要一起看。',
    notcare: '外观不敏感时，优先稳定、续航、按键和售后。'
  })[v] || '耳机应尽量不破坏头盔侧面线条。';
}
function styleTheft(v) {
  return ({
    visible: '明显粗锁和提醒绳有威慑作用，但更重、更影响整洁。',
    hidden: '定位器、暗装报警强调隐蔽追踪，但不能替代实体阻碍。',
    clean: '固定车位留重锁，随车只带小锁，能兼顾整洁和便利。',
    notcare: '不在意外观时，把风险降低效果放第一位。'
  })[v] || '防盗设备的明显威慑和隐蔽追踪应组合使用。';
}
