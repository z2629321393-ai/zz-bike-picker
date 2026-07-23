import { recommendProductLadder } from './product-catalog.js';

export const ACCESSORY_STORAGE_KEY = 'zz-bike-picker-v6.5-accessories';

export const REMINDER_CONFIG = {
  promoImage: 'assets/extension-promo.png',
  promoTitle: '开始前，先确认一件事',
  promoText: '这次只回答你所选项目的问题，完成后就能查看建议；其他装备可以以后再测。',
  spokenLine: '如果你还想看看我整理的头盔、蓝牙耳机或其他骑行装备，可以到抖音“骑不快的ZZ”的橱窗作资料参考。橱窗属于作者自有推广，不参与本站推荐排序；先按使用场景和尺码选，再决定是否购买。'
};

// 每个装备项目都用同一套决策语言：先明确平时用途，再选结构类型，
// 然后确认身体/车辆适配，最后才谈功能偏好和外观。这样结果页也能清楚
// 说明“为什么会得到这组候选”，而不是只留下一个模糊的最终结论。
const QUESTION_STAGE = Object.freeze({
  usage: '平时用途',
  helmetType: '盔型 / 类型',
  headSize: '头围 / 尺码',
  fit: '头型 / 试戴',
  priority: '最在意的体验',
  style: '风格喜好',
  budget: '预算范围',
  protection: '手套类型',
  handFit: '手型 / 尺码',
  season: '天气 / 季节',
  garmentType: '服装类型',
  garmentFocus: '穿着重点',
  climate: '当地气候',
  bodyFit: '体型 / 版型',
  wearing: '穿戴习惯',
  walk: '下车活动',
  feel: '操作感偏好',
  weather: '防水需求',
  footWidth: '脚型 / 鞋楦',
  calfFit: '小腿围 / 靴筒',
  system: '系统类型',
  road: '主要路况',
  volume: '实际容量',
  beam: '光型 / 类型',
  electric: '车辆电路',
  control: '控制方式',
  group: '使用人数',
  helmetFit: '头盔适配',
  operation: '操作偏好',
  parking: '停车环境',
  value: '车辆价值',
  anchor: '固定条件',
  convenience: '日常习惯',
  look: '风格喜好'
});

const q = (id, title, help, options, stage = QUESTION_STAGE[id] || '偏好') => ({ id, title, help, options, stage });

export const ACCESSORY_CATEGORIES = [
  {
    id: 'helmet', icon: '盔', title: '帮我选头盔', accent: '安全核心',
    subtitle: '先选盔型和用途，再按头围、头型、试戴、风格与预算筛选。',
    questions: [
      q('usage', '你平时最常在哪种场景骑行？', '按大多数时候的真实用途选择，不用为一年只有一两次的极端场景买单。', [
        ['city', '城市通勤', '频繁穿脱、低速、短途，便利与通风更重要'],
        ['touring', '长途摩旅', '连续佩戴、高速风噪、颈部负担更重要'],
        ['sport', '跑山/运动骑行', '高速稳定、贴合和上方视野更重要'],
        ['track', '赛道使用', '低伏视野、气动、固定与双D扣取向更强'],
        ['offroad', '林道/场地越野', '护目镜、防尘、通风和活动空间更重要；不和赛道混为一类']
      ]),
      q('helmetType', '这次想找哪一种盔型？', '盔型先决定视野、下颌覆盖、气动、重量和使用边界；同一品牌也不能把不同盔型混在一起比较。', [
        ['fullFace', '通勤/街道全盔', '覆盖完整，适合日常道路使用的基础方向'],
        ['sportFullFace', '运动全盔', '跑山/街车取向，更重视高速稳定与上方视野'],
        ['raceFullFace', '赛道全盔', '低伏视野、固定和气动优先，日常舒适要让步'],
        ['modular', '揭面盔 / 可掀盔', '沟通和摘戴方便，但要接受结构、重量与风噪取舍'],
        ['adv', '拉力盔 / ADV盔', '站姿、通风和护目镜/帽檐兼容取向更强'],
        ['offroad', '越野盔', '配护目镜和越野强度使用；道路场景要单独核对合规与适配'],
        ['retroFullFace', '复古全盔', '保留完整下颌覆盖，再选择复古外形'],
        ['threeQuarter', '3/4盔', '便于日常使用，但下颌覆盖与全盔不同，不能等价比较'],
        ['openFace', '半盔', '开放感强，但保护范围最有限，明确接受其使用边界']
      ]),
      q('headSize', '你的头围大约是多少？', '用软尺绕眉骨上方、耳朵上方一圈测量。头围只用于先筛尺码，不能代替连续试戴。', [
        ['unknown', '还没量过', '先测量再看品牌尺码表，不直接按平时帽子尺码买'],
        ['under54', '54cm及以下', '更要确认最小壳体和内衬不会松动'],
        ['55to56', '55—56cm', '常见尺码区间，仍需按品牌尺码表核验'],
        ['57to58', '57—58cm', '常见尺码区间，重点确认脸颊和后脑包裹'],
        ['over59', '59cm及以上', '留意壳体尺寸、夹点和耳机/眼镜空间']
      ]),
      q('fit', '你的头型和试戴情况？', '头围只是尺码起点；头型不合，即使是高价头盔也可能持续压痛。', [
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
    subtitle: '先分通勤、跑山、摩旅、轻越野或赛道，再看手型、护腕结构、天气与风格。',
    questions: [
      q('usage', '你主要在哪种强度下骑？', '街道运动和封闭赛道的风险与装备结构不同，请按真实使用强度选择。', [
        ['city', '城市通勤', '频繁穿脱、低速操作、手机和舒适优先'],
        ['touring', '长途摩旅', '长时间舒适、防风防雨和疲劳控制'],
        ['mountain', '跑山/街道运动', '要保护，也要保留刹车和油门细腻感'],
        ['track', '赛道', '高速摔车风险、长护腕、掌根滑块和固定优先'],
        ['offroad', '林道/轻越野', '防尘、活动性和握把控制优先；不把它当公路赛道使用']
      ]),
      q('protection', '你更偏向哪种保护取向？', '越偏赛道，通常越紧、越硬，也越需要磨合。', [
        ['urban', '轻量通勤型', '短护腕、薄掌心、舒服，但覆盖和固定有限'],
        ['roadSport', '街道运动型', '中/长护腕，保护和手感比较均衡'],
        ['touring', '旅行 / ADV 防护型', '全天舒适、防风防水与轻越野适配优先，但膜层会损失一点手感'],
        ['race', '赛道长护腕型', '保护最强，刚戴时更硬、更紧，低速手感未必舒服']
      ]),
      q('handFit', '你的手型和尺码情况？', '量主手掌最宽处的掌围和中指长度；同一标码在不同品牌的掌宽、指长和预弯差异很大。', [
        ['unknown', '还没量过', '先量掌围和中指长度，再对照具体品牌尺码表'],
        ['narrow', '手掌偏窄', '注意指根、掌心不能留下明显空量'],
        ['regular', '常规手型', '仍要确认掌宽、指长和虎口活动'],
        ['wide', '手掌偏宽/手背高', '重点看拳峰、掌宽和腕口是否顶住'],
        ['longFingers', '手指偏长', '重点排除指尖顶住、弯指受限']
      ]),
      q('feel', '你对握把反馈有多敏感？', '厚重手套会削弱油门、刹车和按键反馈，需要在保护与操作感之间取舍。', [
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
        ['match', '跟车和骑行服配色', '整体协调，但尺码和结构仍应优先']
      ])
    ]
  },
  {
    id: 'armor', icon: '甲', title: '帮我选骑行服/护具', accent: '穿戴率与覆盖',
    subtitle: '区分网眼、拉力服、皮衣、骑行裤与护甲衬衣，再看体型、气候与骑姿。',
    questions: [
      q('usage', '主要骑行场景？', '按80%的真实使用选。', [
        ['commute', '城市通勤', '快穿脱、透气、日常外观'],
        ['touring', '长途摩旅', '全天舒适、温差、防雨和储物'],
        ['sport', '跑山/运动骑行', '贴身固定、耐磨、上下装连接'],
        ['track', '赛道', '连体/分体皮衣、滑块和高覆盖优先'],
        ['offroad', '林道/轻越野', '活动性、耐磨外层和护具稳定优先；不与公路赛道混为一类']
      ]),
      q('garmentType', '这次想优先看哪种骑行服/下装结构？', '“骑行服”不是一个单一类别；拉力服、夏季网眼、分体皮衣、连体皮衣、骑行裤和护甲衬衣的边界不同。', [
        ['meshJacket', '夏季网眼骑行服', '大面积通风，适合热天；防雨和低温要另做分层'],
        ['textileSuit', '日常骑行服 + 骑行裤', '分体织物上下装，兼顾通勤与一般长途'],
        ['advTouring', 'ADV / 拉力摩旅服', '分层、防雨、储物与长途活动性优先'],
        ['twoPieceLeather', '分体皮衣 / 街道运动皮裤', '街道运动和跑山取向，重点看上下装连接'],
        ['onePieceLeather', '连体皮衣', '赛道/高强度取向，保护与耐磨优先，日常便利让步'],
        ['armoredShirt', '护甲衬衣 + 耐磨外层', '方便叠穿，必须同时确认外层耐磨与护具稳定'],
        ['retroLeather', '复古皮衣', '复古/巡航风格，注意护具位置、耐磨与炎热天气'],
        ['ridingPants', '骑行裤 / 下装优先', '纺织骑行裤、皮裤或夏季下装；重点核对膝髋护具与裤脚搭接'],
        ['protectiveJeans', '防护牛仔裤', '日常外观友好，重点核对膝髋护具和耐磨区域']
      ]),
      q('garmentFocus', '你希望它优先解决什么？', '这项和“盔型/结构”分开问：同一件衣服可能很适合夏季，也可能更适合全天候摩旅。', [
        ['commute', '上班/短途好穿', '方便、低调、提高每天穿戴率'],
        ['summerMesh', '夏天不闷', '通风和速干优先，同时接受雨天与低温边界'],
        ['allSeasonWaterproof', '四季/雨天管理', '内胆、防水层和分层能力优先'],
        ['advTouring', '摩旅/拉力活动性', '温差、储物、站姿和长时间舒适优先'],
        ['retro', '复古/巡航搭配', '皮革质感和日常比例优先，仍需保留护具定位'],
        ['sportRoad', '跑山/街道运动', '贴身、耐磨、护具固定和上下装连接优先'],
        ['track', '赛道使用', '连体/分体皮衣、护背和高覆盖优先']
      ]),
      q('climate', '当地气候？', '太热穿不住，买再高级也等于没穿。', [
        ['hot', '炎热潮湿', '大面积网眼和快干'],
        ['mild', '温和', '多用途织物或皮衣'],
        ['rain', '雨水多', '分层防水和快干'],
        ['cold', '低温多', '防风、保暖和内层管理']
      ]),
      q('bodyFit', '你的体型/版型需求更接近哪种？', '胸围、腰围、臀围、臂长和骑姿都会影响护具是否跑位；这个回答只做初筛，不能代替试穿。', [
        ['unknown', '还没量过', '先量胸腰臀和臂长，再对照品牌尺码表'],
        ['slim', '偏瘦 / 四肢较长', '注意护具是否贴住关节、袖口是否过长'],
        ['regular', '常规体型', '重点看坐上车后护具是否仍在正确位置'],
        ['broad', '肩背宽 / 胸腰较大', '重点排除肩肘顶住、腰腹勒紧或护具外翻']
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
    subtitle: '先按用途选鞋型，再看脚型、靴筒、换挡脚感、防水与步行。',
    questions: [
      q('usage', '主要场景？', '通勤、摩旅、跑山、赛道和越野是不同鞋。', [
        ['city', '城市通勤', '走路、穿脱和日常外观'],
        ['touring', '长途摩旅', '全天舒适、防水和脚踝支撑'],
        ['sport', '跑山/街道运动', '中高筒、抗扭和换挡手感'],
        ['track', '赛道', '高筒、胫骨、铰链和滑块保护'],
        ['offroad', '林道/场地越野', '越野靴、抗扭、护胫和护目镜/护膝搭配；不与赛道靴混为一类']
      ]),
      q('footWidth', '你的脚型/鞋楦更接近哪种？', '用平时运动鞋号码只能做起点；宽脚、脚背高和长脚趾要分别检查鞋头、脚踝和换挡区。', [
        ['unknown', '还没量过', '先按品牌鞋楦试穿，站立和骑姿都要确认'],
        ['narrow', '脚偏窄 / 脚背低', '避免鞋腔过大导致脚跟抬起或脚踝晃动'],
        ['regular', '常规脚型', '仍要确认脚趾余量、后跟锁定和换挡区'],
        ['wide', '脚偏宽 / 脚背高', '重点看鞋头宽度、脚背压迫和拉链闭合']
      ]),
      q('calfFit', '小腿围和裤脚搭配情况？', '高筒靴要和骑行裤、护膝和袜子一起试；靴筒能拉上不等于骑姿舒适。', [
        ['unknown', '还没确认', '试穿时带上常用骑行裤和护具'],
        ['slim', '小腿偏细', '确认靴筒收紧后不松垮、不磨踝'],
        ['regular', '常规小腿围', '确认靴口与裤脚搭接不顶不漏'],
        ['wide', '小腿较粗 / 常穿护膝', '重点看靴筒调节、拉链余量和护具兼容']
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
        ['newbie', '不确定', '优先选择容易适应的结构与脚感']
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
    subtitle: '从用途、容量、支架承载和重心入手，不只比较标称容积。',
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
        ['city', '城市提高存在感', '低亮度、受控光型，并核对当地要求'],
        ['touring', '夜间长途', '近场铺路+远场补充'],
        ['fog', '雨雾天气', '低位宽光、减少反射'],
        ['offroad', '非铺装', '宽近场和远场组合，公路可关闭']
      ]),
      q('beam', '你更需要哪种光？', '一对灯不可能同时把所有区域照好。', [
        ['cutoff', '有截止的近场铺路', '更容易控制眩光，但不代表自动符合上路要求'],
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

// 让结果页和可复制摘要回显用户真正做过的选择。产品目录可以逐步补充更多
// fit 标签；即便某个新标签暂时没有覆盖到所有旧产品，也不会因此伪造“精确
// 命中”，用户仍能一眼看见推荐所依据的用途、类型、适配和风格。
export function accessorySelectionItems(categoryOrId, answers = {}) {
  const category = typeof categoryOrId === 'string' ? categoryById(categoryOrId) : categoryOrId;
  if (!category) return [];
  return category.questions.map((question) => {
    const option = question.options.find(([value]) => value === answers[question.id]);
    return option ? { stage: question.stage || '偏好', label: option[1], questionId: question.id } : null;
  }).filter(Boolean);
}

export function accessorySelectionSummary(categoryOrId, answers = {}) {
  return accessorySelectionItems(categoryOrId, answers)
    .map((item) => `${item.stage}：${item.label}`)
    .join(' · ');
}

export function evaluateAccessory(categoryId, answers = {}, vehicleResult = null) {
  const evaluators = { helmet: evaluateHelmet, gloves: evaluateGloves, armor: evaluateArmor, boots: evaluateBoots, luggage: evaluateLuggage, lights: evaluateLights, intercom: evaluateIntercom, theft: evaluateTheft };
  const result = evaluators[categoryId]?.(answers, vehicleResult);
  if (!result) throw new Error(`Unknown accessory category: ${categoryId}`);
  const productLadder = recommendProductLadder(categoryId, answers, result);
  const category = categoryById(categoryId);
  const selectionItems = accessorySelectionItems(category, answers);
  return {
    categoryId,
    ...result,
    ...buildAccessoryMarketProfile(categoryId, answers, result),
    productLadder,
    selectionItems,
    selectionSummary: accessorySelectionSummary(category, answers),
    spokenLine: REMINDER_CONFIG.spokenLine
  };
}

export function accessoryResultCopy(category, result) {
  const ladderItems = result.productLadder?.items || [];
  const ladderHeading = category.id === 'theft'
    ? `组合防护层（${ladderItems.length}层，按停车风险叠加）：`
    : `符合核心筛选条件的候选（${ladderItems.length}项）：`;
  const recordTypeText = { exact: '具体型号', series: '系列', direction: '选购方向', bundle: '组合方案', archived: '历史/地区记录' };
  const confidenceText = { high: '较高', medium: '中等', low: '较低' };
  return [
    `【骑不快的ZZ｜${category.title}】`,
    `推荐方向：${result.headline}`,
    result.selectionSummary ? `你的筛选：${result.selectionSummary}` : '',
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
    '', ladderHeading,
    ...ladderItems.flatMap((entry) => [
      `${entry.rank}. ${entry.label}：${entry.product.brand} ${entry.product.model}（${entry.product.priceBand}）`,
      `   记录类型：${recordTypeText[entry.product.recordType] || '目录候选'}；资料可信度：${confidenceText[entry.product.confidence] || '待核验'}`,
      `   国内状态：${entry.product.cnAvailability || '当前销售渠道待核验'}`,
      entry.product.complianceNote ? `   合规提醒：${entry.product.complianceNote}` : '',
      `   ${entry.whyRelaxed}`,
      `   取舍：${entry.product.compromise}`
    ].filter(Boolean)),
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
  r.priorities.push('测头围后连续试戴15—20分钟，确认额头、太阳穴和后脑没有尖锐压痛', '摇头时头盔不能明显滞后，脸颊应均匀包裹', '在中国大陆购买或道路使用前，核验具体型号的 GB 811-2022 标识、生产者、生产日期与正规销售渠道；境外认证不自动等于国内合规');
  r.avoid.push('只按品牌、碳纤维纹路或材料营销词下单', '为了不夹直接买大一号', '只在店里戴30秒就判断舒适');
  r.checklist.push('骑姿下视野完整，尤其是低伏时上方视野', '镜片密封、防雾片和通风口可戴手套操作', '耳槽和眼镜通道不压耳');
  if (a.usage === 'touring') {
    r.headline = '轻量摩旅全盔：风噪、重心和一小时后的舒适更重要';
    r.summary = '摩旅盔不是越轻越好，而是重心、密封、风噪和内衬压力要平衡。长途最怕的不是第一分钟不舒服，而是一个小时后颈部和耳朵开始累。';
    r.metrics = metricSet({ 安全固定: 88, 长途舒适: 91, 风噪控制: 86, 通风: 74, 外观协调: 74 });
    r.tradeoffs.push('更安静通常会牺牲部分通风；大风道通常会增加风噪');
  } else if (a.usage === 'sport') {
    r.headline = '街道运动全盔：高速稳定和贴合优先，同时兼顾日常使用';
    r.metrics = metricSet({ 安全固定: 93, 长途舒适: 68, 风噪控制: 70, 通风: 84, 外观协调: 88 });
    r.tradeoffs.push('运动盔包裹更紧、风道更多，日常穿脱和安静程度未必最好');
  } else if (a.usage === 'offroad') {
    r.headline = '越野盔方向：护目镜、防尘、通风与非铺装活动性优先';
    r.summary = '林道和场地越野的头盔、护目镜与颈部装备需要作为一套试戴；它的开口、风道和高速体验不能按公路赛道盔来理解。';
    r.metrics = metricSet({ 安全固定: 94, 长途舒适: 62, 风噪控制: 48, 通风: 94, 外观协调: 82 });
    r.tradeoffs.push('越野盔更重视活动与通风；高速道路的风噪、气动和镜片防护体验需按具体产品与使用场景单独核对');
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
  applyHelmetType(r, a);
  applyHeadSizeGuidance(r, a);
  r.styleNote = styleHelmet(a.style);
  return finalize(r);
}

function applyHelmetType(r, a) {
  const labels = {
    fullFace: '通勤/街道全盔',
    sportFullFace: '运动全盔',
    raceFullFace: '赛道全盔',
    modular: '揭面盔',
    adv: '拉力/ADV盔',
    offroad: '越野盔',
    retroFullFace: '复古全盔',
    threeQuarter: '3/4盔',
    openFace: '半盔'
  };
  if (!a.helmetType) return;
  r.priorities.unshift(`先在“${labels[a.helmetType] || '所选盔型'}”内比较具体型号，再核对头型、头围、镜片/护目镜和中国道路使用要求`);
  if (a.helmetType === 'sportFullFace') {
    r.headline = '运动全盔：跑山稳定、上方视野和贴合优先，兼顾街道使用';
    r.summary = '运动全盔适合把高速稳定、贴合和上方视野放在前面的人。先确认头型、视野与固定，再比较通风、重量和外观。';
    r.tradeoffs.push('运动全盔通常比旅行盔更紧、更注重风道和气动，日常安静与便利未必最好');
  } else if (a.helmetType === 'raceFullFace') {
    r.headline = '赛道全盔：低伏视野、固定与气动优先，日常舒适不是第一位';
    r.summary = '赛道全盔把低伏视野、固定与气动放在前面；它适合明确的封闭场地或高强度使用，不代表日常更舒服。';
    r.tradeoffs.push('赛道全盔更紧、穿脱更费事，通勤风噪和便利性通常要让步');
    if (a.usage !== 'track') r.avoid.push('仅为了赛车外观，把赛道全盔当作所有日常场景的默认答案');
  } else if (a.helmetType === 'modular') {
    r.headline = '揭面盔：摘戴和沟通方便，仍要把锁止、重量、风噪和合头做对';
    r.summary = '揭面盔适合频繁摘戴、沟通和旅行便利需求；具体型号的锁止、佩戴重量、风噪和头型适配都要实际确认。';
    r.tradeoffs.push('可掀结构带来便利，也可能增加重量、风噪和结构复杂度；按具体型号核对锁止与道路使用状态');
    r.checklist.push('开合、锁止和下颌部件可戴手套确认，骑行前按说明处于正确锁定状态');
  } else if (a.helmetType === 'adv') {
    r.headline = '拉力/ADV盔：站姿视野、通风和多路况适配优先';
    r.summary = '拉力/ADV盔兼顾站姿视野、通风、护目镜/帽檐兼容与多路况使用。高速风噪、帽檐受风和头型仍要靠实骑或连续试戴确认。';
    r.tradeoffs.push('帽檐、风道和护目镜兼容更有特点，高速风噪、抬头受风与重量要实骑确认');
    r.checklist.push('站姿、风挡后高速和低头看仪表时都检查帽檐受风、视野和护目镜密封');
  } else if (a.helmetType === 'offroad') {
    r.headline = '越野盔：护目镜、通风和非铺装活动性优先，使用边界要单独确认';
    r.summary = '越野盔更重视护目镜、通风与非铺装活动性。它与全盔的风道、开口和高速体验不同，使用场景及具体产品标识要单独核对。';
    r.tradeoffs.push('越野盔的风道和开口适合高活动量；高速道路风噪、气动和镜片防护体验与全盔不同');
    r.priorities.push('护目镜、防尘、颈托和下颌部位的实际活动空间需整套试戴；道路场景按当地规则和具体产品标识核验');
  } else if (a.helmetType === 'retroFullFace') {
    r.headline = '复古全盔：完整下颌覆盖与复古比例一起看';
    r.summary = '复古全盔先保留完整下颌覆盖，再选择外形、镜片和内衬质感；不能只凭复古造型忽略头型、视野和固定。';
    r.tradeoffs.push('复古外形不等于牺牲视野和固定；镜片、防雾、风噪和耳机空间要按具体型号试戴');
  } else if (a.helmetType === 'threeQuarter') {
    r.headline = '3/4盔：开放感和日常便利优先，明确接受下颌覆盖边界';
    r.summary = '3/4盔适合重视开放感与日常便利的人，但它与全盔的下颌覆盖不同；先明确使用边界，再比较头型、视野和固定。';
    r.tradeoffs.push('3/4盔与全盔的下颌覆盖不同，不能把它们当作同一保护范围来比较');
    r.avoid.push('把3/4盔的开放感误解为和全盔等价的覆盖与高速防护');
  } else if (a.helmetType === 'openFace') {
    r.headline = '半盔：开放感最强，但保护范围最有限，明确接受使用边界';
    r.summary = '半盔强调开放感和轻便，但不提供完整面部与下颌覆盖；应先接受保护范围的差异，再比较合头、固定和具体道路使用要求。';
    r.tradeoffs.push('半盔不提供完整面部和下颌覆盖，不应与全盔作为等价安全选择比较');
    r.avoid.push('只因轻便或造型忽略半盔与全盔的覆盖差异');
  }
}

function applyHeadSizeGuidance(r, a) {
  if (a.headSize === 'unknown') r.priorities.unshift('先用软尺测头围并按具体品牌尺码表初筛；头围数字不能代替连续试戴');
  if (a.headSize === 'under54') r.checklist.push('确认最小尺码的壳体与内衬能稳定包裹，摇头时不能明显滞后');
  if (a.headSize === 'over59') r.checklist.push('确认大尺码壳体、耳机/眼镜空间和后脑/额头没有集中压点');
}

function evaluateGloves(a) {
  const r = baseResult('街道运动长护腕手套：保护、手感和舒适做平衡', '你真正需要的是“戴得住、抓得清、摔车不容易脱”。拳峰硬壳只是其中一部分，掌根、腕部固定、尺码和预弯更重要。', metricSet({ 防护: 78, 舒适: 78, 握持感: 80, 通风: 68, 美观: 82 }));
  r.priorities.push('掌根耐磨/滑块、腕部独立固定和合理护腕长度', '握把时指尖不顶、虎口不拉、手指自然弯曲', '刹车、油门、离合和转向灯必须能细腻操作');
  r.avoid.push('只看拳峰硬壳，不看掌根和腕带', '尺码过大导致摔车时旋转或脱落', '为了外观选过厚掌心或不匹配的预弯');
  r.checklist.push('戴好后握把30秒，确认指根不被缝线勒', '腕带拉紧后手套不能从手上直接拽脱', '弯指时护壳不顶关节、指尖不麻');

  const race = a.protection === 'race' || a.usage === 'track';
  const roadSport = a.protection === 'roadSport' || a.usage === 'mountain';
  const adventure = a.usage === 'offroad';
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
  } else if (adventure) {
    r.headline = 'ADV / 轻越野手套：活动性、防尘和握把控制优先';
    r.summary = '林道和轻越野需要的手套要兼顾握把控制、活动空间与防护；它不是赛道长护腕的替代，也不能只靠薄手套承担越野摔车风险。';
    r.metrics = metricSet({ 防护: 78, 舒适: 80, 握持感: 84, 通风: 82, 美观: 76 });
    r.tradeoffs.push('越野/ADV 取向通常更强调灵活和通风；极端天气、防水和公路高速耐磨需要按实际路线另做取舍');
    r.priorities.push('戴上护目镜、护甲和常用把套后，确认手背不顶、指尖不顶、握把和离合操作仍自然');
  } else if (touring) {
    r.headline = '旅行长护腕手套：全天舒适和防风防雨优先';
    r.metrics = metricSet({ 防护: 76, 舒适: 90, 握持感: 68, 通风: a.season === 'hot' ? 74 : 52, 美观: 72 });
    r.feelNote = '旅行手套更舒服，但防水膜、保暖层会让掌心变厚，刹车和油门手感会比单层皮手套钝一些。';
    r.tradeoffs.push('防水、保暖越强，握持细腻感和通风通常越差');
    r.priorities.push('袖口和骑行服要形成顺水搭接，防止雨水灌入');
  } else if (urban) {
    r.headline = '轻量城市手套：日常舒适和操作感优先，同时明确保护边界';
    r.metrics = metricSet({ 防护: 58, 舒适: 94, 握持感: 94, 通风: 88, 美观: 80 });
    r.feelNote = '薄掌心、柔软织物或软皮会让油门和刹车反馈更直接；代价是护腕短，固定和耐磨上限较低。';
    r.tradeoffs.push('舒服、灵活、适合通勤，但不适合承担高速跑山或赛道风险');
  }

  if (a.feel === 'thin' && race) r.tradeoffs.unshift('你的手感要求和赛道级结构冲突，优先考虑街道运动型而不是纯赛道型');
  if (a.feel === 'protectFirst') r.priorities.push('允许更厚更紧，但必须保留清晰刹车操作，不能靠用更大力补偿');
  if (a.feel === 'breakin') r.checklist.push('磨合后应变贴手；若持续麻、顶指或虎口拉扯，说明不是磨合问题而是版型不合');
  if (a.season === 'cold') r.tradeoffs.push('保暖层会明显增加厚度并降低握把反馈，必要时可用加热手把分担保暖任务');
  if (a.season === 'rain') r.priorities.push('湿手抓握、防水膜固定和袖口防灌水比触屏更重要');
  applyHandFitGuidance(r, a);
  r.styleNote = styleGloves(a.style, race);
  return finalize(r);
}

function applyHandFitGuidance(r, a) {
  if (a.handFit === 'unknown') {
    r.priorities.unshift('量主手掌围和中指长度；按具体品牌尺码表初筛后，仍要实际握把、捏刹车和弯指试戴');
  } else if (a.handFit === 'narrow') {
    r.checklist.push('手掌偏窄时，确认掌心没有明显褶皱，指根和虎口不会在握把时堆料');
  } else if (a.handFit === 'wide') {
    r.checklist.push('手掌偏宽/手背高时，确认拳峰、掌宽和腕口不顶手；不能靠买大一号解决');
  } else if (a.handFit === 'longFingers') {
    r.checklist.push('手指偏长时，握把和捏刹车都不能顶到指尖；指节护壳应落在正确位置');
  }
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
  } else if (a.usage === 'offroad') {
    r.headline = '林道 / 轻越野叠穿系统：活动性、耐磨外层和护具稳定优先';
    r.metrics = metricSet({ 撞击保护: 84, 耐磨: 84, 舒适: 74, 穿脱便利: 66, 美观: 72 });
    r.tradeoffs.push('轻越野需要活动空间和通风，但护甲衬衣、耐磨外层、护膝/护肘仍要在骑姿和站姿中稳定固定');
    r.priorities.push('把护甲、外层、护膝和常用背包一起试穿；不能把公路赛道皮衣或日常网眼服直接当成越野套装');
  } else if (a.usage === 'track') {
    r.headline = '赛道皮衣系统：保护和耐磨最高，舒适与便利明显让步';
    r.metrics = metricSet({ 撞击保护: 98, 耐磨: 98, 舒适: 42, 穿脱便利: 25, 美观: 96 });
    r.feelNote = '站着会勒、走路不自然，坐上车才进入正确姿态；这不是日常舒适装备。';
    r.tradeoffs.push('保护高，但热、重、穿脱慢，日常穿戴率很低');
  }
  if (a.climate === 'hot') r.priorities.push('大面积网眼和浅色更现实，必要时把防雨层独立携带');
  if (a.priority === 'ugly') r.styleNote = '优先修身版型、隐藏式护具和低调配色；但护具不能为了显瘦被挤出关节位置。';
  else r.styleNote = styleArmor(a.look);
  if (a.wearing === 'fast') r.avoid.push('穿戴流程过于复杂、导致日常使用频率很低的完整套装');
  applyArmorGarmentType(r, a);
  applyArmorFitGuidance(r, a);
  return finalize(r);
}

function applyArmorGarmentType(r, a) {
  const type = a.garmentType;
  if (type === 'meshJacket') {
    r.headline = '夏季网眼骑行服：先把高温穿戴率、护具固定和耐磨层做对';
    r.tradeoffs.push('网眼服更适合炎热环境，但防雨、低温和高速防风能力需要独立分层补足');
    r.priorities.unshift('检查网眼区域之外的高磨损区、肩肘背护具位置和夏季骑姿下的固定性');
  } else if (type === 'textileSuit') {
    r.headline = '分体织物骑行服 + 骑行裤：日常与一般长途的平衡方案';
    r.tradeoffs.push('分体织物上下装便于日常使用，但耐磨、护具固定和上下装连接需逐件核对');
    r.priorities.unshift('优先用常见骑姿试上衣和骑行裤，确认腰部、膝部和肘部护具不会跑位');
  } else if (type === 'advTouring') {
    r.headline = 'ADV / 拉力摩旅服：分层、防雨、储物和长时间活动性优先';
    r.tradeoffs.push('层数、口袋和防水结构越多，重量、体积与穿脱复杂度越高');
    r.priorities.unshift('确认站姿、坐姿和加内胆后护具仍在关节中心；防水层、裤脚和手套形成完整搭接');
  } else if (type === 'twoPieceLeather') {
    r.headline = '分体皮衣 / 皮裤：街道运动耐磨与上下装连接优先';
    r.tradeoffs.push('皮革贴身、耐磨和护具固定更强，但炎热、雨天、走路和穿脱会更不方便');
    r.priorities.unshift('确认上衣和裤子的连接拉链、骑姿下的肩肘膝护具以及内搭空间');
  } else if (type === 'onePieceLeather') {
    r.headline = '连体皮衣：赛道/高强度骑行取向，保护、耐磨和固定优先';
    r.tradeoffs.push('连体皮衣的高覆盖以热、重、走路不便和穿脱慢为代价，不是日常通勤的轻松答案');
    r.priorities.unshift('坐上车后再判断合身：护具应落在肩肘膝髋背的正确位置，必要时找专业修改');
    if (a.usage !== 'track' && a.garmentFocus !== 'track') r.avoid.push('只为外观买连体皮衣，却没有接受日常穿戴、雨天和下车活动的限制');
  } else if (type === 'armoredShirt') {
    r.headline = '护甲衬衣 + 耐磨外层：便于叠穿，但两层保护都要核对';
    r.tradeoffs.push('护甲衬衣本身不等于完整耐磨外层；外层过松也可能让护具在骑姿中偏移');
    r.priorities.unshift('确认衬衣把护具固定在关节中心，外层同时具备足够耐磨与天气管理能力');
  } else if (type === 'retroLeather') {
    r.headline = '复古皮衣：风格和耐磨并重，重点是护具位置与高温穿戴率';
    r.tradeoffs.push('复古皮衣的质感通常伴随更热、更重和雨天保养成本；版型不能只看站立时好看');
    r.priorities.unshift('确认肩肘背护具可调且骑姿不跑位，袖口、裤型与手套/靴子搭配不露缝');
  } else if (type === 'ridingPants') {
    r.headline = '骑行裤 / 下装优先：先把膝髋护具、耐磨区和裤脚搭接做对';
    r.tradeoffs.push('下装好穿不代表保护充分；不同面料、护具位置和裤脚结构会明显影响炎热、雨天和步行体验');
    r.priorities.unshift('坐上车并屈膝确认膝髋护具仍覆盖正确位置，检查高磨损区、腰部固定和裤脚与靴子的搭接');
  } else if (type === 'protectiveJeans') {
    r.headline = '防护牛仔裤：日常外观友好，重点看膝髋护具和耐磨区域';
    r.tradeoffs.push('像普通牛仔裤的版型更容易日常穿，但覆盖、耐磨和护具固定上限需按具体产品确认');
    r.priorities.unshift('坐上车并屈膝确认膝髋护具仍覆盖正确位置，检查高磨损区和裤脚与靴子的搭接');
  }

  const focus = {
    commute: '上班/短途优先：控制穿脱步骤和日常比例，确保你愿意每天穿上。',
    summerMesh: '高温优先：把通风、快干和浅色作为重点，防雨/保暖层改为按需携带。',
    allSeasonWaterproof: '全天候优先：核对防水层位置、透气、内胆、袖口和裤脚搭接，而不是只看“防水”标签。',
    advTouring: '摩旅/拉力优先：站姿、储物、分层和全天活动性要在实际骑姿中试穿。',
    retro: '复古搭配优先：保留版型与皮革比例，同时不牺牲护具位置和耐磨边界。',
    sportRoad: '跑山/街道运动优先：贴身固定、耐磨、高磨损区和上下装连接优先。',
    track: '赛道优先：按场地规则核对连体/分体连接、护背、滑块和合身程度。'
  };
  if (a.garmentFocus && focus[a.garmentFocus]) r.priorities.push(focus[a.garmentFocus]);
}

function applyArmorFitGuidance(r, a) {
  if (a.bodyFit === 'unknown') {
    r.priorities.unshift('量胸围、腰围、臀围和臂长；按品牌尺码表初筛后，用骑姿连续试穿确认护具位置');
  } else if (a.bodyFit === 'slim') {
    r.checklist.push('偏瘦或四肢较长时，确认袖肘和膝部护具不下滑，腰部收紧后也不露出后背');
  } else if (a.bodyFit === 'broad') {
    r.checklist.push('肩背宽、胸腰较大时，确认抬臂和前倾不勒肩、不顶肘，护具也不会被挤到关节外侧');
  }
}

function evaluateBoots(a) {
  const r = baseResult('中筒街道骑行靴：脚踝支撑、换挡感和步行做平衡', '骑行靴的价值是在车辆倒地或发生滑行时限制脚踝过度扭转，并保护脚背、后跟和胫骨。', metricSet({ 脚踝保护: 80, 步行舒适: 76, 换挡脚感: 78, 防水: 55, 美观: 82 }));
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
    r.feelNote = '脚踝活动会受限制，换挡需要重新适应；它以摔车保护为主，不适合长时间步行。';
    r.tradeoffs.push('保护最高，但走路累、穿脱慢、夏天热，日常通勤并不舒服');
  } else if (a.usage === 'offroad') {
    r.headline = '越野 / 林道靴：抗扭、护胫和站姿活动优先，不与赛道靴混为一类';
    r.metrics = metricSet({ 脚踝保护: 96, 步行舒适: 44, 换挡脚感: 62, 防水: 54, 美观: 80 });
    r.feelNote = '越野靴在站姿、护膝和脚踏受力时更有支撑，但更硬、更高、走路和换挡需要适应。';
    r.tradeoffs.push('越野抗扭和护胫能力以体积、硬度和步行便利为代价；公路高速与赛道需求要按具体用途另看');
  } else if (a.usage === 'city') {
    r.headline = '城市骑行鞋：步行与日常搭配优先，同时接受保护上限';
    r.metrics = metricSet({ 脚踝保护: 62, 步行舒适: 94, 换挡脚感: 90, 防水: 45, 美观: 92 });
    r.tradeoffs.push('外观和走路更自然，但高筒覆盖、抗扭和胫骨保护有限');
  }
  if (a.feel === 'sensitive') r.priorities.push('优先薄鞋头、清晰前掌弯折和适合原车换挡杆高度');
  if (a.feel === 'protect') r.tradeoffs.push('抗扭越强，脚感越硬；不能用“像运动鞋一样软”作为评价标准');
  if (a.weather === 'yes') r.checklist.push('防水膜、鞋舌结构和裤脚搭接必须完整');
  applyBootFitGuidance(r, a);
  r.styleNote = styleBoots(a.style);
  return finalize(r);
}

function applyBootFitGuidance(r, a) {
  if (a.footWidth === 'unknown') {
    r.priorities.unshift('按品牌鞋楦试穿；站立、屈膝、上车换挡和踩后刹都要确认，不只看平时运动鞋号码');
  } else if (a.footWidth === 'narrow') {
    r.checklist.push('脚偏窄/脚背低时，确认后跟锁定和脚踝支撑，不让鞋腔内横向晃动');
  } else if (a.footWidth === 'wide') {
    r.checklist.push('脚偏宽/脚背高时，确认鞋头、脚背和拉链不顶压；不能因挤脚直接买过长的尺码');
  }
  if (a.calfFit === 'unknown') {
    r.checklist.push('高筒靴要与常用骑行裤、护膝和袜子一起试，确认靴口搭接与调节余量');
  } else if (a.calfFit === 'slim') {
    r.checklist.push('小腿偏细时，确认靴筒收紧后不松垮、不磨踝，也不会影响裤脚搭接');
  } else if (a.calfFit === 'wide') {
    r.checklist.push('小腿较粗或常穿护膝时，确认靴筒调节、拉链余量和护具兼容，不能硬拉闭合');
  }
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
    r.tradeoffs.push('通过狭窄空间和推车更困难，满载后车尾惯性和侧风影响更明显', '空箱也有自重，支架长期给副车架增加负担');
  } else if (a.system === 'soft') {
    r.headline = '软包系统：更轻、更适合烂路，但防盗和快速开合要让步';
    r.metrics = metricSet({ 容量: 84, 稳定性: 90, 便利: 62, 耐用: 72, 外观协调: 78 });
    r.tradeoffs.push('防盗弱、雨天整理麻烦，需要更认真固定和防烫');
  } else if (a.system === 'seat') {
    r.headline = '尾包/坐垫包：最轻、最不破坏操控和外观，容量有限';
    r.metrics = metricSet({ 容量: 54, 稳定性: 94, 便利: 70, 耐用: 68, 外观协调: 92 });
    r.tradeoffs.push('容量和防盗有限，拿取不如尾箱方便');
  } else {
    r.tradeoffs.push('尾箱便利，但重心高且靠后，装入重物后会明显增加低速操控负担');
  }
  if (a.road === 'offroad') r.priorities.push('非铺装优先可变形软包和低重心，减少勾挂和支架冲击');
  if (a.volume === 'huge') r.tradeoffs.push('露营重装必须计算总重量；能装下不等于车辆允许载荷、支架和轮胎都能长期承受');
  if (vehicleResult?.primary === 'sport') r.avoid.push('仿赛长期装超大三箱，破坏尾部结构、重心和视觉比例');
  if (vehicleResult?.primary === 'scooter') r.priorities.push('踏板先利用座桶，再按实际缺口增加尾箱，避免重复增加容量和车尾负担');
  r.styleNote = styleLuggage(a.look, a.system);
  return finalize(r);
}

function evaluateLights(a) {
  const r = baseResult('小体积受控截止补光：先把近场铺路和眩光控制做好', '辅助灯不是越亮越安全。错误光型会影响对向视线，也会让自己在雨雾中看到大片反光。光型和布线描述不代表可以合法上路。', metricSet({ 有效照明: 78, 光型控制: 90, 电路可靠: 86, 安装简洁: 88, 外观协调: 86 }));
  r.priorities.push('确认光型、安装高度和照射角度，不直射对向', '独立保险、合适线径、继电器/控制器和可靠接地', '灯体、接头、开关和控制器具备防水与耐振');
  r.avoid.push('只看瓦数和流明', '直接破线并联原车灯线', '为了外观装超大灯体挡风或干涉转向');
  r.checklist.push('怠速和低转电压稳定，不影响启动充电', '保留独立总开关和故障旁路', '安装和使用前核对当地改装、登记/检验及产品适用要求；越野泛光灯只在非公共道路或获准场景使用');
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
    r.tradeoffs.push('有截止的近场灯更容易控制公共道路眩光，但仍需核对当地安装和使用要求，远距离照明也弱于远射灯');
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
  r.priorities.push('至少两种不同逻辑：机械锁+定位/报警', '优先明亮、有人流、有监控的正规停车区；有合适锚点时再连接固定物', '定期检查定位器电量、通知和备用定位');
  r.avoid.push('只依赖龙头锁或单个碟刹锁', '定位器装得明显且只装一个', '为了外观不带任何实体锁');
  r.checklist.push('机械锁不干涉刹车盘、轮胎和线束', '手机异常位移通知正常', '保留购车、改装、钥匙和停车证据并核对保障条款');
  if (parking === 'outdoor' || parking === 'uncertain') {
    r.headline = a.anchor === 'no'
      ? '高风险且无固定锚点：轮体机械阻碍+报警/定位，优先换停车点'
      : '高风险停车：固定物重锁+报警/定位+保障核对';
    r.metrics = metricSet({ 威慑: 94, 实际阻碍: 92, 隐蔽追踪: 90, 日常便利: 42, 外观影响: 48 });
    r.tradeoffs.push('更安全意味着更重、更麻烦、更影响整洁；首先应考虑换停车点');
    if (a.anchor === 'no') {
      r.priorities.unshift('没有固定锚点时，先用高强度轮体机械阻碍和报警增加作案时间；定位只能辅助发现，不能替代实体阻碍');
      r.checklist.push('确认停车规则允许使用的机械锁不会伤车或妨碍他人，不把路边设施当作未经许可的锚点');
    } else {
      r.priorities.unshift('用合适的重链连接车架或后轮与正规固定物，并让锁体尽量离地');
    }
  } else if (parking === 'indoor') {
    r.tradeoffs.push('室内不等于绝对安全，门禁、钥匙和长期无人查看仍是风险');
  }
  if (a.convenience === 'fast') r.tradeoffs.push('10秒方案便利，但只能做基础威慑，不能替代固定锁和停车管理');
  if (a.convenience === 'full') r.priorities.push(a.anchor === 'no'
    ? '叠加报警轮锁、隐蔽定位和车罩，并把更安全的停车位放在第一优先级'
    : '重链连接车架/后轮与固定物，车罩降低目标暴露');
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
    brandHints: profile.brandHints || ['品牌只作为候选池；具体产品仍要核对尺码、标准、售后和多来源公开评价。'],
    priceWarning: profile.priceWarning || '低价不自动等于不能用，但低到无法说明材料、标准、售后和结构时，不建议只图便宜。',
    searchKeywords: profile.searchKeywords || [result.headline],
    referenceLinks: profile.referenceLinks || []
  };
}

function helmetMarket(a, result) {
  const base = {
    budgetAdvice: '预算必须给试戴、替换镜片、防雾片和耳塞留余量；先买合头的正规全盔，再谈轻量和涂装。',
    brandHints: ['品牌只用于建立候选目录，不构成安全或合规背书。', '按具体型号核对 GB 811-2022 标识、生产信息、头型、扣具、镜片耗材、正规渠道和售后。'],
    priceWarning: '预算在1000元以内时，也应先确认具体型号合头且符合现行国内标准，再比较材料、涂装和附加配置。',
    searchKeywords: ['摩托车全盔 GB 811-2022 具体型号', '摩托车全盔 试戴 头型', '摩托车头盔 防雾片 双D扣'],
    referenceLinks: [
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
  const helmetTypeKeyword = {
    fullFace: '摩托车通勤全盔 头型 试戴',
    sportFullFace: '摩托车运动全盔 跑山 试戴',
    raceFullFace: '摩托车赛道全盔 双D扣 低伏视野',
    modular: '摩托车揭面盔 锁止 头型 试戴',
    adv: '摩托车ADV拉力盔 护目镜 帽檐 试戴',
    offroad: '摩托车越野盔 护目镜 尺码',
    retroFullFace: '摩托车复古全盔 头型 试戴',
    threeQuarter: '摩托车3/4盔 头型 尺码',
    openFace: '摩托车半盔 头型 尺码'
  }[a.helmetType];
  if (helmetTypeKeyword) base.searchKeywords.unshift(helmetTypeKeyword);
  if (a.headSize && a.headSize !== 'unknown') base.searchKeywords.push(`摩托车头盔 ${a.headSize === 'under54' ? '54cm以下' : a.headSize === '55to56' ? '55-56cm' : a.headSize === '57to58' ? '57-58cm' : '59cm以上'} 尺码表`);
  return base;
}

function glovesMarket(a, result) {
  const race = a.protection === 'race' || a.usage === 'track';
  const road = a.protection === 'roadSport' || a.usage === 'mountain';
  const offroad = a.usage === 'offroad';
  const touring = a.protection === 'touring' || a.usage === 'touring';
  const urban = a.protection === 'urban' || a.usage === 'city';
  const searchKeywords = race
    ? ['摩托车赛道长护腕手套 掌根滑块', '赛道手套 小指联动 双腕带', '摩托车长护腕手套 尺码表']
    : road
      ? ['街道运动手套 长护腕 掌根滑块', '跑山骑行手套 皮革 预弯', '摩托车手套 握持感']
      : offroad
        ? ['ADV轻越野手套 护腕 防尘', '林道骑行手套 握把 护目镜', '摩托车手套 掌围 中指长度 尺码表']
      : touring
        ? ['摩旅防水手套 长护腕', '摩托车旅行手套 防风 防雨', '骑行手套 湿手防滑']
        : ['夏季通勤骑行手套 透气', '轻量摩托车手套 掌根耐磨', '摩托车手套 短护腕']
  return {
    budgetAdvice: race ? '赛道手套不能只压价格：掌根滑块、腕部固定、皮料和版型不到位，外形再像赛道也没有意义。' : '街道和通勤优先买一副真正愿意长期戴、握把自然、腕带可靠的手套，不必为了最高赛道等级牺牲穿戴率。',
    brandHints: ['先看掌根滑块、腕带、指长/掌宽版型和售后尺码政策，再看品牌和硬壳外观。', '同一品牌不同系列的手感差异可能很大，电商评价要重点看“掌宽、指长、是否顶指、虎口是否拉扯”。'],
    priceWarning: race ? '价格异常低的“赛道外形手套”可能只有外观硬壳，未必有可靠掌根滑块、腕部固定和耐磨结构。' : '价格异常低的手套可能在缝线、掌心耐磨和腕带固定上压缩成本；不能只看拳峰硬壳。',
    searchKeywords: a.handFit && a.handFit !== 'unknown'
      ? [...searchKeywords, '摩托车手套 掌围 中指长度 尺码表']
      : searchKeywords
  };
}

function armorMarket(a) {
  const garmentTypeKeyword = {
    meshJacket: '夏季网眼骑行服 肩肘背 护具',
    textileSuit: '摩托车骑行服 骑行裤 分体 耐磨',
    advTouring: 'ADV拉力摩旅服 分层 防水 护具',
    twoPieceLeather: '摩托车分体皮衣 皮裤 连接拉链',
    onePieceLeather: '摩托车连体皮衣 赛道 护背',
    armoredShirt: '摩托车护甲衬衣 耐磨外层',
    retroLeather: '摩托车复古皮衣 护具 耐磨',
    ridingPants: '摩托车骑行裤 膝髋护具 耐磨',
    protectiveJeans: '摩托车骑行牛仔裤 膝髋护具 耐磨'
  }[a.garmentType];
  const searchKeywords = a.usage === 'track'
    ? ['摩托车赛道皮衣 护背 连体', '摩托车分体皮衣 上下连接']
    : a.usage === 'offroad'
      ? ['林道轻越野骑行服 护甲 耐磨外层', 'ADV拉力骑行服 护具 站姿']
    : a.usage === 'touring'
      ? ['摩旅骑行服 防水 分层 护具', 'ADV骑行服 夏季 网眼']
      : ['摩托车骑行服 护具 耐磨', '夏季网眼骑行服 肩肘背'];
  if (garmentTypeKeyword) searchKeywords.unshift(garmentTypeKeyword);
  if (a.bodyFit && a.bodyFit !== 'unknown') searchKeywords.push('骑行服 胸围 腰围 臀围 骑姿 试穿');
  return {
    budgetAdvice: a.usage === 'track' ? '赛道皮衣和护具要把合身修改、内搭和维护成本一起算，不能只看吊牌价。' : '先保证肩肘背护具位置稳定、外层耐磨和夏季愿意穿，再逐步升级。',
    brandHints: ['优先看护具标识、位置调节、耐磨面料、接缝加强和售后尺码。', '网眼通勤服、街道运动服、摩旅服和皮衣是不同使用方向，不要拿一件衣服四季全覆盖。'],
    priceWarning: '价格异常低且无法说明护具、耐磨层和高磨损区结构的产品，不能只凭硬壳外观判断。',
    searchKeywords
  };
}

function bootsMarket(a) {
  return {
    budgetAdvice: '骑行靴预算要先买到脚踝、后跟、鞋头和鞋底抗扭结构；日常走路需求越高，越要试穿。',
    brandHints: ['重点对比脚型、鞋楦、鞋头厚度、脚踝支撑和换挡区域，不要只看高筒外观。', '电商评论重点筛“宽脚/瘦脚、脚背高低、是否磨踝、换挡杆是否干涉”。'],
    priceWarning: '普通高帮鞋即使外观像骑行靴，也不等于具备抗扭、后跟和脚踝保护。',
    searchKeywords: a.usage === 'track' ? ['摩托车赛道高筒靴 铰链 抗扭', '赛道骑行靴 胫骨 滑块'] : a.usage === 'offroad' ? ['摩托车越野靴 抗扭 护胫', '林道越野靴 护膝 搭配'] : a.usage === 'touring' ? ['摩旅骑行靴 防水 中高筒', 'ADV骑行靴 抗扭'] : ['城市骑行鞋 脚踝保护', '街道运动骑行靴 换挡']
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
    budgetAdvice: '辅助灯预算要包含合适线束、继电器/控制器、保险、支架和专业安装；不能只买灯体。光型受控、布线整齐或联动远光，都不自动等于允许公共道路安装或使用。',
    brandHints: ['优先比较真实光型、截止、色温、防水、散热、线束和售后。', '对比图要看同一曝光和同一墙面，过曝宣传图不能说明照明效果。'],
    priceWarning: '低价高功率产品可能在光型、驱动、防水和线束上压缩成本。购买前还要核对当地改装、登记/检验及使用要求；越野泛光灯只用于非公共道路或获准场景。',
    searchKeywords: a.beam === 'spot' ? ['摩托车远射辅助灯 独立开关 保险', '摩托车辅助灯 远光联动 当地改装要求'] : a.beam === 'flood' ? ['摩托车宽泛光辅助灯 非公共道路', '摩托车雾灯 低位 宽光'] : ['摩托车辅助灯 截止线 近场铺路', '摩托车辅助灯 线束 继电器 保险']
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
    priceWarning: '价格异常低的锁具、定位器和报警器可能在锁芯、材料、信号、续航和通知稳定性上失效；不能只看外观是否粗壮。',
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
    practical: '重视实用也要控制宽度和高度，避免箱体体积过大而影响整车比例。',
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
