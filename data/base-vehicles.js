// V4基础示例车型库：仅用于数据抓取未完成时的产品演示。
// 价格、座高、整备质量和在售状态上线前必须再次校准。
export const BASE_VEHICLES = [
  // scooters
  {brand:"豪爵",model:"AFR125 / UHR150 / ADX125",type:"scooter",budget:[10000,20000],seat:735,weight:130,year:2024,status:"在售/主流",cost:"low",maint:"low",looks:"mid",power:"low",tags:["通勤","省心","低成本"],why:"适合日常高频使用、重视可靠性和售后便利的人。",warn:"动力取向偏温和，更适合看重省心而不是强烈性能感的人。"},
  {brand:"无极",model:"SR150 / SR250GT",type:"scooter",budget:[12000,25000],seat:770,weight:160,year:2024,status:"在售/主流",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["城市","轻摩旅","配置"],why:"比125级踏板更有余量，城市和短途都能兼顾。",warn:"车重与轮胎成本高于小排量踏板，需要一并计算。"},
  {brand:"赛科龙",model:"RT2 / RT3",type:"scooter",budget:[18000,32000],seat:755,weight:190,year:2024,status:"在售/主流",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["大踏板","舒适","中短途"],why:"适合重视舒适、带人和中短途使用的人。",warn:"停车挪车比小踏板费力，试坐时也要体验低速和倒车。"},
  {brand:"升仕",model:"350E / 350D",type:"scooter",budget:[25000,42000],seat:770,weight:190,year:2024,status:"在售/配置型",cost:"high",maint:"mid",looks:"high",power:"mid",tags:["配置","科技感","长途踏板"],why:"适合喜欢配置、外观和舒适巡航的人。",warn:"电子配置多，后期维护要比纯工具踏板更上心。"},

  // street
  {brand:"春风",model:"250NK / 450NK / 800NK",type:"street",budget:[18000,52000],seat:795,weight:180,year:2024,status:"在售/主流",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["街车","年轻化","好玩"],why:"适合想兼顾通勤与周末骑行、又不希望车型过于极端的人。",warn:"800级别对控制能力和耗材预算要求更高，完全新手应循序渐进。"},
  {brand:"无极",model:"300AC / 525R / CU525",type:"street",budget:[18000,35000],seat:790,weight:190,year:2024,status:"在售/主流",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["均衡","性价比","日常"],why:"适合预算有限又想体验中排量车型的人。",warn:"配置表只能初筛，最终还要试坐并确认当地售后。"},
  {brand:"QJMOTOR",model:"追系列 / 赛系列街车",type:"street",budget:[15000,45000],seat:790,weight:190,year:2024,status:"在售/矩阵多",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["选择多","配置高","价格卷"],why:"适合希望在预算内比较多个配置与排量平台的人。",warn:"型号较多，应优先核对发动机平台、具体版本和本地售后。"},
  {brand:"豪爵",model:"铃木平台街车/通勤跨骑",type:"street",budget:[9000,22000],seat:760,weight:145,year:2024,status:"在售/保守可靠",cost:"low",maint:"low",looks:"low",power:"low",tags:["可靠","省心","保值"],why:"适合把车辆主要作为通勤工具、重视可靠性的人。",warn:"动力与设计更偏实用，重视强烈运动感的人可能不合适。"},
  {brand:"贝纳利",model:"幼狮500 / 752S / TRK系列",type:"street",budget:[28000,65000],seat:800,weight:210,year:2024,status:"在售/部分平台较老",cost:"high",maint:"mid",looks:"high",power:"mid",tags:["大车感","欧式味","适合高个"],why:"适合身高较高、喜欢大车架和厚重感的人。",warn:"车重明显，停车挪车、油耗和耗材成本要接受。"},

  // sport
  {brand:"春风",model:"250SR / 450SR / 675SR",type:"sport",budget:[18000,60000],seat:795,weight:190,year:2024,status:"在售/热门",cost:"mid",maint:"mid",looks:"high",power:"high",tags:["仿赛","颜值","操控"],why:"适合喜欢运动外观、想要强反馈、拍视频也有识别度的人。",warn:"仿赛坐姿、手腕、腰和摔车件成本都要提前接受。"},
  {brand:"凯越",model:"321RR / 450RR / 450RR-R",type:"sport",budget:[22000,45000],seat:780,weight:170,year:2024,status:"在售/性能向",cost:"mid",maint:"high",looks:"high",power:"high",tags:["性能","赛道味","轻量"],why:"适合愿意为操控和性能投入维护精力的人。",warn:"运动取向越强，通勤舒适与低速便利越少；经验较少时应优先评估控制难度。"},
  {brand:"无极",model:"RR525 / RR660S",type:"sport",budget:[30000,50000],seat:790,weight:190,year:2024,status:"在售/进阶",cost:"mid",maint:"mid",looks:"high",power:"high",tags:["仿赛","中排","配置"],why:"适合想要中排运动感，但又不想直接上进口大排的人。",warn:"动力上来以后，轮胎、刹车、护具预算也要同步上来。"},
  {brand:"赛科龙",model:"RC250 / RC401 / RC600",type:"sport",budget:[16000,40000],seat:785,weight:180,year:2024,status:"在售/入门到中排",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["入门仿赛","预算友好","练手"],why:"适合预算有限又想体验运动骑姿的人。",warn:"这是入门至中排量运动平台，重点应放在学习操控和实际适配。"},
  {brand:"川崎",model:"Ninja 400/500 / ZX-4R",type:"sport",budget:[45000,80000],seat:785,weight:190,year:2024,status:"进口/热门",cost:"high",maint:"mid",looks:"high",power:"high",tags:["进口","保值","成熟"],why:"适合预算足、想要成熟进口仿赛体验的人。",warn:"进口车摔车件、保险和维修周期要提前算。"},

  // adv
  {brand:"春风",model:"450MT / 800MT",type:"adv",budget:[32000,65000],seat:820,weight:210,year:2024,status:"在售/热门ADV",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["ADV","摩旅","装载"],why:"适合摩旅、装载和混合路况使用，又希望本地渠道相对容易核验的人。",warn:"加装三箱后重心更高，经验较少时应先从轻载与铺装路面适应。"},
  {brand:"无极",model:"DS525X / DS625X / DS900X",type:"adv",budget:[30000,65000],seat:820,weight:220,year:2024,status:"在售/主流ADV",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["ADV","性价比","长途"],why:"适合预算相对克制，又希望获得中大排量ADV配置的人。",warn:"不同身材的体验差异较大，应结合坐垫宽度、车重和重心实际试坐。"},
  {brand:"凯越",model:"510X / 800X / 450Rally",type:"adv",budget:[35000,80000],seat:835,weight:200,year:2024,status:"在售/硬核",cost:"high",maint:"high",looks:"mid",power:"high",tags:["拉力","硬核","非铺装"],why:"适合确有复杂路况需求、愿意练习相应技巧的人。",warn:"座高与维护要求都较高，应先确认真实用途、低速控制和本地维修条件。"},
  {brand:"贝纳利",model:"TRK502 / TRK552",type:"adv",budget:[33000,45000],seat:805,weight:235,year:2024,status:"在售/大车感",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["大车感","适合高个","摩旅"],why:"适合180cm以上、想要视觉体量和长途坐姿的人。",warn:"重量是现实问题，低速掉头和挪车要有心理准备。"},
  {brand:"升仕",model:"703F / 350T",type:"adv",budget:[26000,48000],seat:820,weight:210,year:2024,status:"在售/配置型",cost:"mid",maint:"mid",looks:"high",power:"mid",tags:["配置","科技","摩旅"],why:"适合喜欢配置、外观和中长途功能的人。",warn:"配置越多越要关注长期维护和本地售后。"},

  // cruiser
  {brand:"奔达",model:"金吉拉 / 拿破仑 / 灰石 / LFC700",type:"cruiser",budget:[20000,65000],seat:700,weight:230,year:2024,status:"在售/风格强",cost:"high",maint:"mid",looks:"unique",power:"mid",tags:["巡航","回头率","姿态"],why:"适合外观党、内容拍摄、想要强烈个人风格的人。",warn:"巡航不是轻松代步车，车重、热、轮胎和改装会增加成本。"},
  {brand:"春风",model:"450CL-C / 250CL-C",type:"cruiser",budget:[18000,32000],seat:690,weight:185,year:2024,status:"在售/复古巡航",cost:"mid",maint:"mid",looks:"high",power:"mid",tags:["复古巡航","颜值","城市"],why:"适合想要好看、好骑、不要太大太沉的人。",warn:"舒适巡航不等于长途神器，装载和风阻要另算。"},
  {brand:"无极",model:"CU525 / CU625",type:"cruiser",budget:[26000,42000],seat:710,weight:215,year:2024,status:"在售/巡航",cost:"mid",maint:"mid",looks:"mid",power:"mid",tags:["巡航","均衡","中排"],why:"适合想要中排巡航，但不想走太极端外观的人。",warn:"带人、改装、油耗和低速操控都要实际试。"},
  {brand:"QJMOTOR",model:"闪系列巡航",type:"cruiser",budget:[18000,50000],seat:700,weight:215,year:2024,status:"在售/选择多",cost:"mid",maint:"mid",looks:"high",power:"mid",tags:["巡航","配置","价格带广"],why:"适合想在巡航里按预算精确卡配置的人。",warn:"车型太多时，优先看发动机、车架、售后和实际骑姿。"},
  {brand:"高金",model:"GK500 / Thor 1000 / 巡航系列",type:"cruiser",budget:[30000,80000],seat:720,weight:240,year:2024,status:"在售/大排调性",cost:"high",maint:"mid",looks:"high",power:"high",tags:["大排","质感","巡航"],why:"适合预算更高、喜欢大排量巡航质感和成熟外观的人。",warn:"还要实际评估停车挪车、热量、油耗与轮胎成本。"},

  // retro
  {brand:"本田",model:"幼兽/复古小排系列",type:"retro",budget:[13000,25000],seat:750,weight:110,year:2024,status:"进口/合资部分",cost:"mid",maint:"low",looks:"high",power:"low",tags:["复古","轻巧","情绪"],why:"适合慢节奏城市骑行、内容拍摄和喜欢小型复古车氛围的人。",warn:"身材较高时应重点核对膝部空间、车把距离和长时间骑姿。"},
  {brand:"春风",model:"XO狒狒 / 250CL-C",type:"retro",budget:[9000,22000],seat:760,weight:150,year:2024,status:"在售/年轻化",cost:"low",maint:"low",looks:"high",power:"low",tags:["复古","轻玩","好拍"],why:"适合预算不高、喜欢轻量与个性风格的人。",warn:"身材较高时，小尺寸车架可能限制腿部空间，需要实际试坐。"},
  {brand:"贝纳利",model:"幼狮500",type:"retro",budget:[28000,40000],seat:810,weight:210,year:2024,status:"在售/大车感",cost:"mid",maint:"mid",looks:"high",power:"mid",tags:["复古","大车架","高个"],why:"适合高个、喜欢复古但又不想车太小的人。",warn:"车重和热量比小复古更明显。"},
  {brand:"无极",model:"AC系列",type:"retro",budget:[15000,30000],seat:790,weight:170,year:2024,status:"在售/性价比",cost:"low",maint:"low",looks:"mid",power:"mid",tags:["复古街车","均衡","省心"],why:"适合喜欢复古风格，同时重视日常实用性的人。",warn:"整体取向均衡，追求极端造型或性能的人可能觉得不够鲜明。"},

  // offroad
  {brand:"凯越",model:"450Rally / 800X Rally",type:"offroad",budget:[45000,90000],seat:890,weight:190,year:2024,status:"在售/硬核拉力",cost:"high",maint:"high",looks:"mid",power:"high",tags:["拉力","越野","硬核"],why:"适合确有非铺装需求、愿意学习相应技巧的人。",warn:"座高、坐垫宽度、车重和重心都需要实车验证，不能只按外观选择。"},
  {brand:"无极",model:"300GY / 300DS",type:"offroad",budget:[16000,26000],seat:830,weight:160,year:2024,status:"在售/轻量ADV",cost:"low",maint:"mid",looks:"mid",power:"low",tags:["轻量","烂路","练手"],why:"适合想轻量探索，不想一上来买大车的人。",warn:"动力不是强项，重点是轻和通过性。"},
  {brand:"宗申/赛科龙",model:"RX系列 / 越野入门平台",type:"offroad",budget:[12000,30000],seat:830,weight:170,year:2024,status:"在售/入门",cost:"low",maint:"mid",looks:"low",power:"low",tags:["入门","烂路","工具"],why:"适合预算有限、先练习非铺装基本功的人。",warn:"定位是入门练习与工具使用，不应按高阶拉力车型的性能和配置预期。"},

  // collector
  {brand:"收藏分支",model:"合法手续老车/停产情怀车",type:"collector",budget:[10000,200000],seat:780,weight:190,year:2015,status:"停产/二手/收藏",cost:"high",maint:"high",looks:"unique",power:"mid",tags:["收藏","情怀","不建议日常"],why:"适合了解车况、手续和配件渠道，主要用于收藏或偶尔合法短途的人。",warn:"老车应优先核对手续、车况、配件、维修渠道和剩余使用年限，而不是只比较购入价格。"},
  {brand:"不建议上路",model:"无手续水车/报废车/纯摆件",type:"collector",budget:[1000,999999],seat:780,weight:190,year:2010,status:"仅内容分支",cost:"high",maint:"high",looks:"unique",power:"mid",tags:["摆件","风险提示","不上路"],why:"只适合做静态收藏、道具、摆件，不进入公共道路。",warn:"不建议购买无手续车辆上路。上路会涉及登记、保险、年检和执法风险。"}
];
