"use strict";

const templates = [
  {
    id: "little-garden",
    title: "小花园毕业册",
    category: "graduation",
    filterStyle: "garden",
    theme: "garden",
    note: "适合毕业礼、老师寄语和孩子单人笑脸都想多放一点的纪念册。",
    featuredDesc: "会多放老师寄语、单人笑脸和草地上的温柔合影。",
    price: 129,
    pages: 24,
    photoRange: "8-40张",
    badgeLabel: "花园毕业册",
    layoutSignature: "老师寄语多一点",
    coverImage: "../assets/h5-template-covers/little-garden-cover.jpg",
    thumbImage: "../assets/h5-template-covers/little-garden-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/little-garden-preview-1.jpg",
      "../assets/h5-template-previews/little-garden-preview-2.jpg",
      "../assets/h5-template-previews/little-garden-preview-3.jpg"
    ],
    defaultTitle: "小一班毕业啦",
    defaultClass: "向日葵幼儿园 · 小一班",
    defaultSubtitle: "把最后一个夏天的笑脸留在这里",
    spreadTitle: "一起长大的日子",
    placeholders: ["毕业礼合影", "老师寄语", "牵手瞬间", "班级笑脸"],
    decorations: ["小花", "小草", "老师寄语"],
    ornamentSet: [
      { kind: "flower", label: "小花" },
      { kind: "grass", label: "小草" },
      { kind: "animal", label: "小兔" }
    ],
    chapterDefaults: ["一起长大的日子", "老师寄语", "把笑脸都留住"],
    openingLayouts: ["garden-poster", "teacher-letter"],
    layoutPlans: {
      airy: ["garden-poster", "teacher-letter", "quote-photo", "duo-story", "meadow-strip"],
      balanced: ["garden-poster", "teacher-letter", "duo-story", "meadow-strip", "timeline", "quote-photo"],
      rich: ["garden-poster", "duo-story", "quad-grid", "meadow-strip", "mosaic-five", "timeline"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["牵手往前走", "老师把爱写进来", "草地上的笑脸", "我们的教室", "毕业礼这一天", "把名字留在这一页"],
    noteBodies: [
      "愿你带着今天的小勇气和好奇心，继续去认识更大的世界。",
      "这一页留给老师，也留给每一个在幼儿园里慢慢长大的小朋友。",
      "翻到这里时，应该还能想起操场上的风、教室里的笑声和小伙伴们的名字。"
    ]
  },
  {
    id: "cloud-growth",
    title: "云朵成长册",
    category: "growth",
    filterStyle: "storybook",
    theme: "cloud",
    note: "更像一本幼儿园绘本，适合春游、手工课、节日活动和日常成长记录。",
    featuredDesc: "画面更安静，章节像小故事一样往后翻，适合做温柔的成长册。",
    price: 119,
    pages: 20,
    photoRange: "6-28张",
    badgeLabel: "成长绘本册",
    layoutSignature: "像一本成长故事",
    coverImage: "../assets/h5-template-covers/cloud-growth-cover.jpg",
    thumbImage: "../assets/h5-template-covers/cloud-growth-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/cloud-growth-preview-1.jpg",
      "../assets/h5-template-previews/cloud-growth-preview-2.jpg",
      "../assets/h5-template-previews/cloud-growth-preview-3.jpg"
    ],
    defaultTitle: "云朵成长册",
    defaultClass: "向日葵幼儿园 · 中二班",
    defaultSubtitle: "把会发光的小日常，慢慢装进这本成长小书里",
    spreadTitle: "今天也闪闪发光",
    placeholders: ["春游活动", "手工课堂", "节日表演", "午睡醒来"],
    decorations: ["云朵", "彩虹", "小星星"],
    ornamentSet: [
      { kind: "cloud", label: "云朵" },
      { kind: "star", label: "星星" },
      { kind: "animal", label: "小鸟" }
    ],
    chapterDefaults: ["今天也闪闪发光", "把故事慢慢翻开", "成长的一小步"],
    openingLayouts: ["hero-single", "buddy-pair"],
    layoutPlans: {
      airy: ["hero-single", "quote-photo", "buddy-pair", "duo-story", "teacher-letter"],
      balanced: ["hero-single", "duo-story", "timeline", "quote-photo", "buddy-pair", "teacher-letter"],
      rich: ["hero-single", "duo-story", "quad-grid", "timeline", "buddy-pair", "meadow-strip"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["今天的小发现", "会发光的课堂", "慢慢长大的样子", "把温柔都放进来", "春天从这一页经过", "明天继续闪亮"],
    noteBodies: [
      "成长册更适合留住那些安安静静的小表情，和慢慢发生的小变化。",
      "把这一页翻过去，像翻过今天；把这本小书留住，就像把当下也轻轻留住。",
      "希望长大以后再翻开，孩子还能认出今天的自己和身边的小伙伴。"
    ]
  },
  {
    id: "sticker-play",
    title: "贴贴游戏册",
    category: "class",
    filterStyle: "scrapbook",
    theme: "sticker",
    note: "拼贴和贴贴感更强，适合运动会、生日会、园游会和热闹抓拍特别多的班级册。",
    featuredDesc: "照片越多越好看，适合把游戏、互动和开心表情排成热闹的一本。",
    price: 139,
    pages: 24,
    photoRange: "12-48张",
    badgeLabel: "贴贴活动册",
    layoutSignature: "活动照片放得多",
    coverImage: "../assets/h5-template-covers/sticker-play-cover.jpg",
    thumbImage: "../assets/h5-template-covers/sticker-play-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/sticker-play-preview-1.jpg",
      "../assets/h5-template-previews/sticker-play-preview-2.jpg",
      "../assets/h5-template-previews/sticker-play-preview-3.jpg"
    ],
    defaultTitle: "贴贴游戏册",
    defaultClass: "向日葵幼儿园 · 大一班",
    defaultSubtitle: "把最热闹的小表情和游戏瞬间都贴进来",
    spreadTitle: "今天玩得真开心",
    placeholders: ["运动会", "生日会", "园游会", "游戏抓拍"],
    decorations: ["小贴纸", "胶带", "小花贴贴"],
    ornamentSet: [
      { kind: "flower", label: "贴贴花" },
      { kind: "star", label: "星星" },
      { kind: "animal", label: "小猫" }
    ],
    chapterDefaults: ["今天玩得真开心", "小贴纸到处飞", "把热闹都贴进来"],
    openingLayouts: ["scrapbook-burst", "animal-parade"],
    layoutPlans: {
      airy: ["scrapbook-burst", "duo-story", "buddy-pair", "quote-photo", "quad-grid"],
      balanced: ["scrapbook-burst", "trio-mix", "quad-grid", "buddy-pair", "mosaic-five", "quote-photo"],
      rich: ["scrapbook-burst", "mosaic-five", "class-grid", "quad-grid", "animal-parade", "trio-mix"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["游戏开始啦", "今天全班都很会玩", "生日帽和彩带", "你追我跑的一页", "笑声贴得到处都是", "最后留张合照吧"],
    noteBodies: [
      "热闹的模板更适合照片多、动作多、表情也很多的一天。",
      "这一套会把活动感放得更前面，翻起来像在看一整页一整页的小贴纸手账。",
      "想把今天的欢乐保存久一点，就把它们都贴在这一页里。"
    ]
  },
  {
    id: "sunny-memory",
    title: "小太阳毕业册",
    category: "graduation",
    filterStyle: "sunny",
    theme: "sunny",
    note: "更适合毕业典礼、节目表演、上台领奖和大合影比较多的毕业册。",
    featuredDesc: "会先看到上台、合照和老师拥抱这些重要时刻。",
    price: 129,
    pages: 20,
    photoRange: "8-32张",
    badgeLabel: "毕业礼纪念册",
    layoutSignature: "先看典礼和合照",
    coverImage: "../assets/h5-template-covers/sunny-memory-cover.jpg",
    thumbImage: "../assets/h5-template-covers/sunny-memory-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/sunny-memory-preview-1.jpg",
      "../assets/h5-template-previews/sunny-memory-preview-2.jpg",
      "../assets/h5-template-previews/sunny-memory-preview-3.jpg"
    ],
    defaultTitle: "我们毕业啦",
    defaultClass: "向日葵幼儿园 · 大二班",
    defaultSubtitle: "把小太阳一样明亮的毕业礼时刻都留在这里",
    spreadTitle: "毕业礼这一页",
    placeholders: ["上台领奖", "全班合照", "老师拥抱", "毕业帽瞬间"],
    decorations: ["小太阳", "气球", "毕业礼"],
    ornamentSet: [
      { kind: "sun", label: "小太阳" },
      { kind: "star", label: "星星" },
      { kind: "animal", label: "小鸭" }
    ],
    chapterDefaults: ["毕业礼这一页", "老师和孩子的拥抱", "把掌声留住"],
    openingLayouts: ["ceremony-stage", "garden-poster"],
    layoutPlans: {
      airy: ["ceremony-stage", "hero-single", "quote-photo", "teacher-letter", "duo-story"],
      balanced: ["ceremony-stage", "duo-story", "timeline", "quote-photo", "hero-single", "teacher-letter"],
      rich: ["ceremony-stage", "quad-grid", "class-grid", "duo-story", "hero-single", "timeline"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["上台前的小紧张", "掌声响起来了", "老师送来的拥抱", "毕业帽飞起来", "这一班真的毕业啦", "把仪式感留住"],
    noteBodies: [
      "毕业礼模板会把大场面和代表性照片放在更前面，让翻书时更像一次完整的仪式。",
      "这一页可以留给掌声、留给拥抱，也留给每一个准备奔向下一站的小朋友。",
      "等以后再翻开，还是会记得这一天的光、笑声和有点舍不得的心情。"
    ]
  },
  {
    id: "storybook-trip",
    title: "春游故事册",
    category: "growth",
    filterStyle: "storybook",
    theme: "trip",
    note: "更适合春游、秋游和园外活动，会把出发、玩耍到回园的顺序放得更清楚。",
    featuredDesc: "整本像一趟小旅行，适合把一次活动从头到尾记下来。",
    price: 126,
    pages: 28,
    photoRange: "10-36张",
    badgeLabel: "春游故事册",
    layoutSignature: "按春游顺序往后翻",
    coverImage: "../assets/h5-template-covers/storybook-trip-cover.jpg",
    thumbImage: "../assets/h5-template-covers/storybook-trip-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/storybook-trip-preview-1.jpg",
      "../assets/h5-template-previews/storybook-trip-preview-2.jpg",
      "../assets/h5-template-previews/storybook-trip-preview-3.jpg"
    ],
    defaultTitle: "春游故事册",
    defaultClass: "向日葵幼儿园 · 中一班",
    defaultSubtitle: "把一路上的笑声和小发现都记下来",
    spreadTitle: "一起出发去玩吧",
    placeholders: ["出发集合", "看花看草", "午餐时刻", "回园路上"],
    decorations: ["云朵", "小路牌", "小树叶"],
    ornamentSet: [
      { kind: "grass", label: "小草" },
      { kind: "leaf", label: "叶子" },
      { kind: "animal", label: "小鸟" }
    ],
    chapterDefaults: ["一起出发去玩吧", "沿路的小发现", "回园时也舍不得结束"],
    openingLayouts: ["journey-map", "meadow-strip"],
    layoutPlans: {
      airy: ["journey-map", "duo-story", "quote-photo", "timeline", "teacher-letter"],
      balanced: ["journey-map", "trio-mix", "timeline", "duo-story", "hero-single", "quote-photo"],
      rich: ["journey-map", "quad-grid", "mosaic-five", "timeline", "duo-story", "class-grid"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["先集合再出发", "一路都在看风景", "今天发现了好多新东西", "午餐和休息也很好玩", "最后来张回园照", "故事到这里先收好"],
    noteBodies: [
      "春游模板会把前后顺序排得更清楚，翻起来像在走一条慢慢往前的路线。",
      "每一站都可以留一两张代表性的照片，让整本册子更像一次完整的小旅行。",
      "希望以后再翻开，还是会记得今天去过哪里、看见了什么、跟谁一起笑。"
    ]
  },
  {
    id: "class-yearbook",
    title: "班级欢乐册",
    category: "class",
    filterStyle: "yearbook",
    theme: "yearbook",
    note: "适合想让更多孩子都出现在册子里，也适合班级统一做一本。",
    featuredDesc: "会多放全班笑脸、活动照片和大家一起玩的时候。",
    price: 132,
    pages: 28,
    photoRange: "16-60张",
    badgeLabel: "班级欢乐册",
    layoutSignature: "把全班笑脸收齐",
    coverImage: "../assets/h5-template-covers/class-yearbook-cover.jpg",
    thumbImage: "../assets/h5-template-covers/class-yearbook-cover.jpg",
    previewImages: [
      "../assets/h5-template-previews/class-yearbook-preview-1.jpg",
      "../assets/h5-template-previews/class-yearbook-preview-2.jpg",
      "../assets/h5-template-previews/class-yearbook-preview-3.jpg"
    ],
    defaultTitle: "班级欢乐册",
    defaultClass: "向日葵幼儿园 · 大一班",
    defaultSubtitle: "把这学期最热闹的班级时光都装进来",
    spreadTitle: "这一班的快乐合集",
    placeholders: ["班级活动", "全班笑脸", "课间游戏", "表演准备"],
    decorations: ["小草地", "班级徽章", "笑脸贴纸"],
    ornamentSet: [
      { kind: "flower", label: "小花" },
      { kind: "grass", label: "小草" },
      { kind: "animal", label: "小熊" }
    ],
    chapterDefaults: ["这一班的快乐合集", "把笑脸都排上去", "这一页属于我们班"],
    openingLayouts: ["smile-wall", "animal-parade"],
    layoutPlans: {
      airy: ["smile-wall", "class-grid", "duo-story", "buddy-pair", "teacher-letter"],
      balanced: ["class-grid", "smile-wall", "quad-grid", "duo-story", "timeline", "buddy-pair"],
      rich: ["class-grid", "smile-wall", "mosaic-five", "quad-grid", "animal-parade", "timeline"]
    },
    closingLayout: "farewell-note",
    sectionTitles: ["这一班先集合", "每个人都要露个脸", "课间和活动时间", "排练和准备也好看", "老师和孩子都在这里", "这一学期收在最后一页"],
    noteBodies: [
      "班级册会优先照顾到更多孩子都能在书里出现，合影和笑脸照片也会多放一些。",
      "如果想做一本全班统一下单的纪念册，这一套会更容易排出完整感。",
      "把这一班的名字、笑脸和声音都留在这本册子里，以后再翻也会很有画面。"
    ]
  }
];

const templateFilters = [
  { id: "all", label: "全部" },
  { id: "graduation", label: "毕业纪念" },
  { id: "growth", label: "成长记录" },
  { id: "class", label: "班级活动" },
  { id: "storybook", label: "绘本风" }
];

const layoutOptions = [
  { id: "airy", label: "温柔一点" },
  { id: "balanced", label: "日常一点" },
  { id: "rich", label: "热闹一点" }
];

const pageOptions = [16, 20, 24, 28, 32];

const layoutCapacities = {
  "hero-single": 1,
  "duo-story": 2,
  "trio-mix": 3,
  "quad-grid": 4,
  "mosaic-five": 5,
  timeline: 3,
  "class-grid": 6,
  "teacher-letter": 1,
  "quote-photo": 1,
  "ceremony-stage": 2,
  "journey-map": 3,
  "scrapbook-burst": 4,
  "smile-wall": 5,
  "garden-poster": 1,
  "petal-focus": 2,
  "meadow-strip": 3,
  "star-cluster": 4,
  "buddy-pair": 2,
  "animal-parade": 4,
  "farewell-note": 2
};

const pageOptionLabels = {
  16: "轻巧一点",
  20: "日常记录",
  24: "成长收藏",
  28: "珍藏更多",
  32: "全班热闹"
};

const legacyCopyMap = {
  "花边留白": "老师寄语多一点",
  "绘本叙事": "像一本成长故事",
  "贴纸拼贴": "活动照片放得多",
  "毕业仪式": "先看典礼和合照",
  "路线故事": "按春游顺序往后翻",
  "笑脸合集": "把全班笑脸收齐"
};

const orderFilters = [
  { id: "all", label: "全部订单" },
  { id: "pending_payment", label: "待支付" },
  { id: "awaiting_ship", label: "待发货" },
  { id: "shipped", label: "已发货" }
];

const workStatusMap = {
  draft: { label: "草稿中", extra: "可继续修改" },
  generated: { label: "待确认下单", extra: "已生成预览" },
  ordered: { label: "已下单", extra: "制作中" }
};

const orderStatusMap = {
  pending_payment: { label: "待支付", className: "status-pill status-warm" },
  awaiting_ship: { label: "待发货", className: "status-pill status-info" },
  shipped: { label: "已发货", className: "status-pill status-success" }
};

const defaultUser = {
  nickname: "王妈妈",
  phone: "13812345678",
  address: "上海市浦东新区晨曦路 18 号 2 单元 301 室"
};

const API_BASE = "/api";

const refs = {
  views: {
    home: document.getElementById("home-view"),
    studio: document.getElementById("studio-view"),
    preview: document.getElementById("preview-view"),
    checkout: document.getElementById("checkout-view"),
    payment: document.getElementById("payment-view"),
    share: document.getElementById("share-view"),
    address: document.getElementById("address-view"),
    orderDetail: document.getElementById("order-detail-view"),
    works: document.getElementById("works-view"),
    profile: document.getElementById("profile-view"),
    orders: document.getElementById("orders-view")
  },
  heroTags: document.getElementById("hero-tags"),
  featuredCard: document.getElementById("featured-card"),
  templateFilterRow: document.getElementById("template-filter-row"),
  templateList: document.getElementById("template-list"),
  templateEmpty: document.getElementById("template-empty"),
  homeGoProfile: document.getElementById("home-go-profile"),
  homeGoStudio: document.getElementById("home-go-studio"),
  studioTemplateImage: document.getElementById("studio-template-image"),
  studioTemplateTitle: document.getElementById("studio-template-title"),
  studioTemplateDesc: document.getElementById("studio-template-desc"),
  studioTemplateMeta: document.getElementById("studio-template-meta"),
  studioBackHome: document.getElementById("studio-back-home"),
  uploadMeta: document.getElementById("upload-meta"),
  choosePhotosButton: document.getElementById("choose-photos-button"),
  clearPhotosButton: document.getElementById("clear-photos-button"),
  photoStrip: document.getElementById("photo-strip"),
  coverTitle: document.getElementById("cover-title"),
  coverClass: document.getElementById("cover-class"),
  coverSubtitle: document.getElementById("cover-subtitle"),
  pageOptionsRow: document.getElementById("page-options-row"),
  styleOptionsRow: document.getElementById("style-options-row"),
  chapterText: document.getElementById("chapter-text"),
  previewSummary: document.getElementById("preview-summary"),
  previewBadgesRow: document.getElementById("preview-badges-row"),
  compactPreviewShell: document.getElementById("compact-preview-shell"),
  goPreviewButton: document.getElementById("go-preview-button"),
  studioBottomBack: document.getElementById("studio-bottom-back"),
  studioBottomPreview: document.getElementById("studio-bottom-preview"),
  previewBackStudio: document.getElementById("preview-back-studio"),
  previewMetaRow: document.getElementById("preview-meta-row"),
  previewStageShell: document.getElementById("preview-stage-shell"),
  previewSlideIndicator: document.getElementById("preview-slide-indicator"),
  previewPrevSlide: document.getElementById("preview-prev-slide"),
  previewNextSlide: document.getElementById("preview-next-slide"),
  templateSwitchRow: document.getElementById("template-switch-row"),
  previewShare: document.getElementById("preview-share"),
  previewOrder: document.getElementById("preview-order"),
  checkoutWorkTitle: document.getElementById("checkout-work-title"),
  checkoutWorkMeta: document.getElementById("checkout-work-meta"),
  checkoutWorkBadges: document.getElementById("checkout-work-badges"),
  checkoutAddressSummary: document.getElementById("checkout-address-summary"),
  checkoutChangeAddress: document.getElementById("checkout-change-address"),
  checkoutQuantity: document.getElementById("checkout-quantity"),
  checkoutNote: document.getElementById("checkout-note"),
  checkoutAmountRow: document.getElementById("checkout-amount-row"),
  checkoutBackPreview: document.getElementById("checkout-back-preview"),
  checkoutSubmit: document.getElementById("checkout-submit"),
  paymentOrderTitle: document.getElementById("payment-order-title"),
  paymentOrderMeta: document.getElementById("payment-order-meta"),
  paymentStatusRow: document.getElementById("payment-status-row"),
  paymentAddress: document.getElementById("payment-address"),
  paymentAmount: document.getElementById("payment-amount"),
  paymentGoOrders: document.getElementById("payment-go-orders"),
  paymentPayButton: document.getElementById("payment-pay-button"),
  shareCardTitle: document.getElementById("share-card-title"),
  shareCardMeta: document.getElementById("share-card-meta"),
  shareCardShell: document.getElementById("share-card-shell"),
  shareUrl: document.getElementById("share-url"),
  shareMessage: document.getElementById("share-message"),
  shareBackPreview: document.getElementById("share-back-preview"),
  shareCopyButton: document.getElementById("share-copy-button"),
  shareOpenButton: document.getElementById("share-open-button"),
  addressList: document.getElementById("address-list"),
  addressFormTitle: document.getElementById("address-form-title"),
  addressId: document.getElementById("address-id"),
  addressReceiver: document.getElementById("address-receiver"),
  addressPhone: document.getElementById("address-phone"),
  addressRegion: document.getElementById("address-region"),
  addressDetail: document.getElementById("address-detail"),
  addressDefault: document.getElementById("address-default"),
  addressSaveButton: document.getElementById("address-save-button"),
  addressBackButton: document.getElementById("address-back-button"),
  addressNewButton: document.getElementById("address-new-button"),
  orderDetailTitle: document.getElementById("order-detail-title"),
  orderDetailMeta: document.getElementById("order-detail-meta"),
  orderDetailStatusRow: document.getElementById("order-detail-status-row"),
  orderDetailLogistics: document.getElementById("order-detail-logistics"),
  orderDetailAddress: document.getElementById("order-detail-address"),
  orderDetailTime: document.getElementById("order-detail-time"),
  orderDetailBackButton: document.getElementById("order-detail-back-button"),
  orderDetailPayButton: document.getElementById("order-detail-pay-button"),
  worksContent: document.getElementById("works-content"),
  worksGoProfile: document.getElementById("works-go-profile"),
  worksGoHome: document.getElementById("works-go-home"),
  profileAccountAction: document.getElementById("profile-account-action"),
  profileAccountTitle: document.getElementById("profile-account-title"),
  profileAccountSubtitle: document.getElementById("profile-account-subtitle"),
  profileAccountMeta: document.getElementById("profile-account-meta"),
  orderShortcutRow: document.getElementById("order-shortcut-row"),
  profileWorkDesc: document.getElementById("profile-work-desc"),
  profileAddressDesc: document.getElementById("profile-address-desc"),
  profileContactDesc: document.getElementById("profile-contact-desc"),
  profileGoWorks: document.getElementById("profile-go-works"),
  profileGoAddress: document.getElementById("profile-go-address"),
  profileContact: document.getElementById("profile-contact"),
  profileLogout: document.getElementById("profile-logout"),
  ordersFilterRow: document.getElementById("orders-filter-row"),
  ordersContent: document.getElementById("orders-content"),
  ordersGoProfile: document.getElementById("orders-go-profile"),
  ordersGoHome: document.getElementById("orders-go-home"),
  photoInput: document.getElementById("photo-input"),
  toast: document.getElementById("toast")
};

const state = {
  currentView: "home",
  activeTemplateFilter: "all",
  activeOrderFilter: "all",
  selectedTemplateId: templates[0].id,
  selectedPages: templates[0].pages,
  layoutPreference: "balanced",
  pageMode: "auto",
  coverTitle: templates[0].defaultTitle,
  coverClass: templates[0].defaultClass,
  coverSubtitle: templates[0].defaultSubtitle,
  chapterText: buildDefaultChapterText(templates[0]),
  photos: [],
  addresses: [],
  checkoutQuantity: 1,
  checkoutNote: "",
  currentSlideIndex: 0,
  works: [],
  orders: [],
  currentWorkId: "",
  currentOrderId: "",
  shareDraft: null,
  addressReturnView: "profile",
  currentUser: null
};

let idSeed = 0;
let toastTimer = 0;
let draftSyncTimer = 0;

function buildDefaultChapterText(template) {
  return template.chapterDefaults.join("\n");
}

function nextId(prefix) {
  idSeed += 1;
  return prefix + "-" + Date.now() + "-" + idSeed;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(API_BASE + path, Object.assign({
    headers: {
      "Content-Type": "application/json"
    }
  }, options));
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || "请求失败");
  }
  return payload.data;
}

function syncTemplatesFromServer(remoteTemplates) {
  if (!Array.isArray(remoteTemplates)) {
    return;
  }
  remoteTemplates.forEach((remote) => {
    const local = templates.find((item) => item.id === remote.id);
    if (local) {
      Object.assign(local, {
        category: remote.category || local.category,
        price: remote.price != null ? remote.price : local.price,
        pages: remote.pages != null ? remote.pages : local.pages,
        photoRange: remote.photoRange || local.photoRange,
        status: remote.status || local.status,
        coverImage: remote.coverImage || local.coverImage,
        thumbImage: remote.coverImage || local.thumbImage
      });
    }
  });
}

function replaceWorkInState(work) {
  const index = state.works.findIndex((item) => item.id === work.id);
  if (index >= 0) {
    state.works.splice(index, 1, work);
  } else {
    state.works.unshift(work);
  }
}

function replaceOrderInState(order) {
  const index = state.orders.findIndex((item) => item.id === order.id);
  if (index >= 0) {
    state.orders.splice(index, 1, order);
  } else {
    state.orders.unshift(order);
  }
}

function getDefaultAddress() {
  return state.addresses.find((item) => item.isDefault) || state.addresses[0] || null;
}

function getOrderById(orderId) {
  return state.orders.find((item) => item.id === orderId) || null;
}

function getCurrentWork() {
  return state.works.find((item) => item.id === state.currentWorkId) || null;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTemplateById(id) {
  return templates.find((item) => item.id === id) || templates[0];
}

function getSelectedTemplate() {
  return getTemplateById(state.selectedTemplateId);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getLayoutPreferenceLabel() {
  const matched = layoutOptions.find((item) => item.id === state.layoutPreference);
  return matched ? matched.label : layoutOptions[1].label;
}

function getTemplateBadge(template) {
  return template.badgeLabel;
}

function getTemplateThemeClass(template = getSelectedTemplate()) {
  return "template-theme--" + template.theme;
}

function getRecommendedPageCount(photoCount, template = getSelectedTemplate()) {
  if (!photoCount) {
    return template.pages;
  }

  if (photoCount <= 6) {
    return 16;
  }
  if (photoCount <= 12) {
    return 20;
  }
  if (photoCount <= 22) {
    return 24;
  }
  if (photoCount <= 36) {
    return 28;
  }
  return 32;
}

function resolveLayoutDensity(photoCount) {
  const photoDrivenLevel = photoCount <= 8 ? 0 : photoCount <= 20 ? 1 : 2;
  const offset = {
    airy: -1,
    balanced: 0,
    rich: 1
  }[state.layoutPreference] || 0;
  const levels = ["airy", "balanced", "rich"];
  return levels[clamp(photoDrivenLevel + offset, 0, levels.length - 1)];
}

function maskPhone(phone) {
  if (!phone || phone.length < 11) {
    return "";
  }

  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return month + "月" + day + "日 " + hour + ":" + minute;
}

function getVisibleTemplates() {
  if (state.activeTemplateFilter === "all") {
    return templates;
  }

  return templates.filter((item) => {
    return item.category === state.activeTemplateFilter || item.filterStyle === state.activeTemplateFilter;
  });
}

function normalizeView(value) {
  const raw = String(value || "").replace(/^#\/?/, "");
  const allowed = ["home", "studio", "preview", "checkout", "payment", "share", "address", "orderDetail", "works", "profile", "orders"];
  return allowed.indexOf(raw) >= 0 ? raw : "home";
}

function setView(view, options = {}) {
  const nextView = normalizeView(view);
  state.currentView = nextView;
  renderAll();

  if (options.updateHash === false) {
    return;
  }

  const nextHash = "#" + nextView;
  if (window.location.hash !== nextHash) {
    window.location.hash = nextView;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  refs.toast.textContent = message;
  refs.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    refs.toast.classList.remove("is-visible");
  }, 2200);
}

function revokePhotos() {
  state.photos.forEach((photo) => {
    if (photo.url && photo.url.indexOf("blob:") === 0) {
      URL.revokeObjectURL(photo.url);
    }
  });
}

function resetStudioState(template, options = {}) {
  const nextTemplate = template || getSelectedTemplate();
  state.selectedTemplateId = nextTemplate.id;
  state.selectedPages = options.keepPhotos && state.photos.length
    ? getRecommendedPageCount(state.photos.length, nextTemplate)
    : nextTemplate.pages;
  state.layoutPreference = "balanced";
  state.pageMode = "auto";
  state.coverTitle = nextTemplate.defaultTitle;
  state.coverClass = nextTemplate.defaultClass;
  state.coverSubtitle = nextTemplate.defaultSubtitle;
  state.chapterText = buildDefaultChapterText(nextTemplate);
  state.currentSlideIndex = 0;
  state.currentWorkId = options.keepWork ? state.currentWorkId : "";

  if (!options.keepPhotos) {
    revokePhotos();
    state.photos = [];
  }
}

function startNewBook(templateId) {
  const template = getTemplateById(templateId);
  resetStudioState(template, {
    keepPhotos: false,
    keepWork: false
  });
  setView("studio");
}

function applyTemplateForCurrentFlow(templateId, options = {}) {
  const template = getTemplateById(templateId);
  const keepPhotos = options.keepPhotos !== false;
  const keepWork = options.keepWork !== false;
  resetStudioState(template, {
    keepPhotos: keepPhotos,
    keepWork: keepWork
  });

  if (keepPhotos && state.photos.length && keepWork) {
    upsertCurrentWork(state.orders.some((item) => item.workId === state.currentWorkId) ? "ordered" : "draft");
  }

  renderAll();
}

function getSelectedStyleClass() {
  return getTemplateThemeClass();
}

function getHeroTags() {
  return ["先看效果", "老师寄语", "发给家人看"];
}

function buildMetaPills(template) {
  return [
    "适合 " + template.photoRange,
    template.layoutSignature,
    template.badgeLabel
  ];
}

function getPageOptionLabel(pageCount) {
  return pageOptionLabels[pageCount] || (pageCount + "页");
}

function normalizeUiCopy(value) {
  let text = String(value || "");
  text = text.replace(/(\d+)P/g, "$1页");
  Object.keys(legacyCopyMap).forEach((key) => {
    text = text.replaceAll(key, legacyCopyMap[key]);
  });
  return text;
}

function getGeneratedPageCount(template = getSelectedTemplate()) {
  return buildSlides(template).length;
}

function getPreviewSummaryText(template = getSelectedTemplate()) {
  const generatedPages = getGeneratedPageCount(template);
  if (!state.photos.length) {
    return "先看看这套模板的示意效果，上传照片后会按数量排出合适的内容。";
  }
  return "当前已经排好 " + generatedPages + " 页预览，照片不够时会先保留已经做好的内容，不会重复放同一张照片。";
}

function getGeneratedPreviewSummary(template = getSelectedTemplate()) {
  return getGeneratedPageCount(template) + "页预览 · " + template.layoutSignature;
}

function getTemplateEffectAssets(template) {
  const baseAssets = [template.coverImage].concat(template.previewImages || []);
  return new Array(5).fill("").map((_, index) => baseAssets[index % baseAssets.length]);
}

function getTemplateEffectVariantFrameClass(variant) {
  if (variant === "featured") {
    return "featured-image";
  }
  if (variant === "list") {
    return "template-cover-image";
  }
  if (variant === "switch") {
    return "switch-image";
  }
  return "";
}

function isFlatTemplatePreview(variant) {
  return variant === "featured" || variant === "list" || variant === "summary" || variant === "switch";
}

function renderTemplateEffectSlot(url, className) {
  return `
    <div class="template-effect-slot ${className}">
      <img src="${escapeHtml(url)}" alt="" />
    </div>
  `;
}

function getTemplatePreviewScale(variant) {
  if (variant === "featured") {
    return 0.44;
  }
  if (variant === "list") {
    return 0.37;
  }
  if (variant === "summary") {
    return 0.43;
  }
  if (variant === "switch") {
    return 0.4;
  }
  return 1;
}

function renderTemplateFlatPreview(template, variant) {
  return `
    <div
      class="template-effect-preview template-effect-preview--flat ${escapeHtml(getTemplateEffectVariantFrameClass(variant))} template-effect-preview--${escapeHtml(variant)} ${getTemplateThemeClass(template)}"
      style="--template-flat-scale:${getTemplatePreviewScale(variant)};"
      aria-hidden="true"
    >
      <div class="template-flat-shell">
        <div class="compact-cover-card template-flat-card ${getTemplateThemeClass(template)}">
          <span class="compact-cover-badge">${escapeHtml(getTemplateBadge(template))}</span>
          <span class="compact-cover-title">${escapeHtml(template.defaultTitle || template.title)}</span>
          <span class="compact-cover-subtitle">${escapeHtml(template.defaultSubtitle || template.featuredDesc || template.note)}</span>
          <img class="compact-cover-photo" src="${escapeHtml(template.thumbImage || template.coverImage)}" alt="" />
          <div class="compact-cover-meta">
            <span>${escapeHtml(template.defaultClass || "向日葵幼儿园 · 小一班")}</span>
            <span>${escapeHtml(template.layoutSignature)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTemplateEffectCoverPage(template, assets, decorations) {
  const title = template.defaultTitle || template.title;
  const subtitle = template.defaultSubtitle || template.featuredDesc || template.note;
  const classLabel = template.defaultClass || "向日葵幼儿园 · 小一班";

  return `
    <div class="template-effect-page template-effect-page--cover">
      <div class="template-effect-cover-copy">
        <div class="template-effect-cover-top">
          <span class="template-effect-cover-badge">${escapeHtml(getTemplateBadge(template))}</span>
          <span class="template-effect-cover-mark">${escapeHtml(template.layoutSignature)}</span>
        </div>
        <div class="template-effect-cover-title">${escapeHtml(title)}</div>
        <div class="template-effect-cover-subtitle">${escapeHtml(subtitle)}</div>
      </div>
      <div class="template-effect-cover-hero">
        <img src="${escapeHtml(assets[0])}" alt="" />
      </div>
      <div class="template-effect-cover-meta">
        <span>${escapeHtml(classLabel)}</span>
        <span>${escapeHtml(template.layoutSignature)}</span>
      </div>
      <div class="template-effect-cover-foot">
        ${decorations.map((item) => `<span class="template-effect-deco">${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderTemplateEffectPreview(template, variant) {
  if (isFlatTemplatePreview(variant)) {
    return renderTemplateFlatPreview(template, variant);
  }

  const assets = getTemplateEffectAssets(template);
  const decorations = (template.decorations || []).slice(0, 2);
  const frameClass = getTemplateEffectVariantFrameClass(variant);

  return `
    <div class="template-effect-preview ${escapeHtml(frameClass)} template-effect-preview--${escapeHtml(variant)} ${getTemplateThemeClass(template)}" aria-hidden="true">
      <div class="template-effect-stack">
        <div class="template-effect-sheet template-effect-sheet--back">
          <div class="template-effect-page template-effect-page--grid">
            <div class="template-effect-mini-grid">
              ${assets.slice(1, 5).map((url) => `
                <span class="template-effect-mini-cell">
                  <img src="${escapeHtml(url)}" alt="" />
                </span>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="template-effect-sheet template-effect-sheet--middle">
          <div class="template-effect-page template-effect-page--story">
            <div class="template-effect-mini-hero">
              <img src="${escapeHtml(assets[1])}" alt="" />
            </div>
            <div class="template-effect-mini-row">
              <span class="template-effect-mini-chip">${escapeHtml(decorations[0] || template.badgeLabel)}</span>
              <span class="template-effect-mini-strip">
                <img src="${escapeHtml(assets[2])}" alt="" />
              </span>
              <span class="template-effect-mini-strip">
                <img src="${escapeHtml(assets[3])}" alt="" />
              </span>
            </div>
          </div>
        </div>

        <div class="template-effect-sheet template-effect-sheet--front">
          ${renderTemplateEffectCoverPage(template, assets, decorations)}
        </div>
      </div>
    </div>
  `;
}

function renderHome() {
  refs.heroTags.innerHTML = getHeroTags()
    .map((item) => `<span class="hero-tag">${escapeHtml(item)}</span>`)
    .join("");

  const featuredTemplate = templates[0];
  refs.featuredCard.innerHTML = `
    ${renderTemplateEffectPreview(featuredTemplate, "featured")}
    <div class="featured-copy">
      <span class="featured-kicker">推荐起步款</span>
      <span class="featured-title">${escapeHtml(featuredTemplate.title)}</span>
      <span class="featured-desc">${escapeHtml(featuredTemplate.featuredDesc)}</span>
      <div class="featured-meta">
        ${buildMetaPills(featuredTemplate).map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("")}
      </div>
      <div class="featured-action">从这套开始</div>
    </div>
  `;
  refs.featuredCard.dataset.id = featuredTemplate.id;

  refs.templateFilterRow.innerHTML = templateFilters.map((item) => {
    const className = item.id === state.activeTemplateFilter ? "chip chip-active" : "chip";
    return `<button class="${className}" type="button" data-filter="${item.id}">${escapeHtml(item.label)}</button>`;
  }).join("");

  const visibleTemplates = getVisibleTemplates();
  refs.templateEmpty.classList.toggle("hidden", visibleTemplates.length > 0);
  refs.templateList.classList.toggle("hidden", visibleTemplates.length === 0);
  refs.templateList.innerHTML = visibleTemplates.map((item) => {
    const active = item.id === state.selectedTemplateId;
    return `
      <button
        class="${active ? "template-list-card template-list-card-active" : "template-list-card"}"
        type="button"
        data-template-id="${item.id}"
      >
        ${renderTemplateEffectPreview(item, "list")}
        <div class="template-list-content">
          <div class="template-main">
            <div class="template-title-row">
              <span class="template-title">${escapeHtml(item.title)}</span>
              <span class="template-price">¥${escapeHtml(String(item.price))}</span>
            </div>
            <span class="template-subtitle">${escapeHtml(item.note)}</span>
          </div>
          <div class="template-footer">
            <div class="template-meta-row">
              ${buildMetaPills(item).map((pill) => `<span class="meta-pill">${escapeHtml(pill)}</span>`).join("")}
            </div>
            <div class="${active ? "template-action template-action-active" : "template-action"}">
              <span class="template-action-icon">${active ? "✓" : "›"}</span>
            </div>
          </div>
        </div>
      </button>
    `;
  }).join("");
}

function describeUploadMeta() {
  if (!state.photos.length) {
    return "上传后会按照片数量排出合适的内容，照片不够时只展示已经排好的部分。";
  }

  return "已经选了 " + state.photos.length + " 张照片，系统会先把更有代表性的照片放进封面和重点位置。";
}

function detectOrientation(file) {
  return file.width && file.height && file.width > file.height ? "横图" : "竖图";
}

function renderStudio() {
  const template = getSelectedTemplate();
  const generatedPages = getGeneratedPageCount(template);
  refs.studioTemplateImage.innerHTML = renderTemplateEffectPreview(template, "summary");
  refs.studioTemplateImage.setAttribute("aria-label", template.title + " 模板效果图");
  refs.studioTemplateTitle.textContent = template.title;
  refs.studioTemplateDesc.textContent = template.note;
  refs.uploadMeta.textContent = describeUploadMeta();
  refs.coverTitle.value = state.coverTitle;
  refs.coverClass.value = state.coverClass;
  refs.coverSubtitle.value = state.coverSubtitle;
  refs.chapterText.value = state.chapterText;

  refs.studioTemplateMeta.innerHTML = buildMetaPills({
    photoRange: template.photoRange,
    layoutSignature: template.layoutSignature,
    badgeLabel: template.badgeLabel
  }).map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");

  if (!state.photos.length) {
    refs.photoStrip.innerHTML = `<div class="thumb-empty">可以先放毕业礼合照、春游活动照和孩子单人笑脸，排出来会更像一本完整的幼儿园纪念册。</div>`;
  } else {
    refs.photoStrip.innerHTML = state.photos.map((item) => {
      return `
        <div class="thumb-card">
          <img class="thumb-image" src="${item.url}" alt="${escapeHtml(item.name)}" />
          <span class="thumb-badge">${escapeHtml(item.orientation)}</span>
          <button class="thumb-remove" type="button" data-photo-id="${item.id}">×</button>
        </div>
      `;
    }).join("");
  }

  refs.pageOptionsRow.innerHTML = pageOptions.map((value) => {
    const className = value === state.selectedPages ? "pill pill-active" : "pill";
    return `<button class="${className}" type="button" data-page-value="${value}">${escapeHtml(getPageOptionLabel(value))}</button>`;
  }).join("");

  refs.styleOptionsRow.innerHTML = layoutOptions.map((item) => {
    const className = item.id === state.layoutPreference ? "pill pill-active" : "pill";
    return `<button class="${className}" type="button" data-layout-preference="${item.id}">${escapeHtml(item.label)}</button>`;
  }).join("");

  refs.previewSummary.textContent = getPreviewSummaryText(template);
  refs.previewBadgesRow.innerHTML = [
    generatedPages + "页预览",
    state.photos.length + " 张照片",
    getLayoutPreferenceLabel(),
    template.layoutSignature
  ].map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");

  refs.compactPreviewShell.innerHTML = renderCompactPreviewCard(template);
}

function getChapterLines() {
  return state.chapterText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSlideBadges(template) {
  return [
    getGeneratedPageCount(template) + "页预览",
    state.photos.length + " 张照片",
    template.layoutSignature
  ];
}

function getUserPhotoSlot(index) {
  if (!state.photos.length || index < 0 || index >= state.photos.length) {
    return null;
  }

  const photo = state.photos[index];

  return {
    type: "photo",
    url: photo.url,
    label: photo.name ? photo.name.replace(/\.[^.]+$/, "") : "已上传照片"
  };
}

function getPhotoOrFallback(index, template) {
  if (state.photos.length) {
    return getUserPhotoSlot(index);
  }

  return {
    type: "sample",
    url: template.previewImages[index % template.previewImages.length],
    label: template.placeholders[index % template.placeholders.length]
  };
}

function takeSlots(template, cursor, count) {
  const slots = [];
  for (let index = 0; index < count; index += 1) {
    const slot = getPhotoOrFallback(cursor.index, template);
    if (!slot) {
      break;
    }
    slots.push(slot);
    cursor.index += 1;
  }
  return slots;
}

function buildPagePlan(template, totalPages, density) {
  const plan = ["cover"].concat(template.openingLayouts);
  const cycle = template.layoutPlans[density] || template.layoutPlans.balanced;
  let cycleIndex = 0;

  while (plan.length < totalPages - 1) {
    plan.push(cycle[cycleIndex % cycle.length]);
    cycleIndex += 1;
  }

  plan.push(template.closingLayout);
  return plan.slice(0, totalPages);
}

function resolveAdaptiveLayout(template, layoutKind, remainingPhotos, density) {
  if (remainingPhotos <= 0) {
    return null;
  }

  if ((layoutCapacities[layoutKind] || 1) <= remainingPhotos) {
    return layoutKind;
  }

  const themedCandidates = [
    layoutKind,
    ...(template.layoutPlans[density] || []),
    ...template.openingLayouts,
    template.closingLayout
  ];
  const fallbackCandidates = [
    "class-grid",
    "mosaic-five",
    "smile-wall",
    "quad-grid",
    "animal-parade",
    "scrapbook-burst",
    "star-cluster",
    "trio-mix",
    "timeline",
    "journey-map",
    "meadow-strip",
    "duo-story",
    "buddy-pair",
    "ceremony-stage",
    "farewell-note",
    "petal-focus",
    "garden-poster",
    "hero-single",
    "quote-photo",
    "teacher-letter"
  ];
  const candidates = [...new Set(themedCandidates.concat(fallbackCandidates))];
  let chosen = null;
  let chosenCapacity = 0;

  candidates.forEach((candidate) => {
    const capacity = layoutCapacities[candidate] || 1;
    if (capacity <= remainingPhotos && capacity > chosenCapacity) {
      chosen = candidate;
      chosenCapacity = capacity;
    }
  });

  return chosen;
}

function resolvePageTitle(template, pageNumber, chapters) {
  if (pageNumber === 2) {
    return chapters[0] || template.chapterDefaults[0];
  }
  if (pageNumber === 3) {
    return chapters[1] || template.chapterDefaults[1];
  }
  if (pageNumber === 4) {
    return chapters[2] || template.chapterDefaults[2];
  }
  return template.sectionTitles[(pageNumber - 2) % template.sectionTitles.length];
}

function buildNoteCopy(template, pageNumber, title) {
  return {
    badge: template.badgeLabel,
    title: title,
    body: template.noteBodies[(pageNumber - 2) % template.noteBodies.length]
  };
}

function materializeSlide(template, layoutKind, pageNumber, chapters, cursor) {
  if (layoutKind === "cover") {
    return {
      id: "page-1",
      type: "cover",
      pageNumber: "01"
    };
  }

  const title = resolvePageTitle(template, pageNumber, chapters);
  const page = {
    id: "page-" + pageNumber,
    type: "layout",
    layout: layoutKind,
    pageNumber: String(pageNumber).padStart(2, "0"),
    title: title,
    chips: template.decorations.slice(0, 3),
    note: buildNoteCopy(template, pageNumber, title),
    stepLabels: template.placeholders.slice(0, 3),
    slots: []
  };

  page.slots = takeSlots(template, cursor, layoutCapacities[layoutKind] || 1);

  if (layoutKind === "teacher-letter") {
    page.note.badge = "老师寄语";
    page.note.title = chapters[1] || "老师寄语";
  }

  if (layoutKind === "farewell-note") {
    page.note.badge = "小页记";
    page.note.title = chapters[2] || template.sectionTitles[template.sectionTitles.length - 1];
  }

  if (layoutKind === "journey-map") {
    page.stepLabels = ["出发", "沿路", "回园"];
  }

  if (layoutKind === "timeline") {
    page.stepLabels = ["开始", "进行中", "收进回忆里"];
  }

  if (layoutKind === "ceremony-stage") {
    page.chips = ["毕业典礼", "上台时刻", "老师拥抱"];
  }

  if (layoutKind === "class-grid" || layoutKind === "smile-wall") {
    page.chips = ["全班笑脸", "班级活动", "一起收藏"];
  }

  if (layoutKind === "scrapbook-burst") {
    page.chips = ["活动抓拍", "笑脸很多", "越看越热闹"];
  }

  if (layoutKind === "garden-poster") {
    page.chips = ["毕业留念", "老师寄语", "单人笑脸"];
  }

  if (layoutKind === "petal-focus") {
    page.chips = ["温柔笑脸", "老师寄语", "花园小记"];
  }

  if (layoutKind === "meadow-strip") {
    page.chips = ["一起玩耍", "草地时光", "慢慢翻看"];
  }

  if (layoutKind === "star-cluster") {
    page.chips = ["今天闪闪发光", "主角时刻", "值得留住"];
  }

  if (layoutKind === "buddy-pair") {
    page.chips = ["好朋友", "一起看镜头", "同框更甜"];
  }

  if (layoutKind === "animal-parade") {
    page.chips = ["全班热闹", "游戏时刻", "排在一起"];
  }

  return page;
}

function buildSlides(template) {
  const chapters = getChapterLines();
  const totalPages = clamp(state.selectedPages, 16, 32);
  const density = resolveLayoutDensity(state.photos.length);
  const plan = buildPagePlan(template, totalPages, density);
  const cursor = { index: state.photos.length ? 1 : 0 };
  const slides = [];

  for (let index = 0; index < plan.length; index += 1) {
    const layoutKind = plan[index];
    if (layoutKind === "cover") {
      slides.push(materializeSlide(template, layoutKind, slides.length + 1, chapters, cursor));
      continue;
    }

    if (!state.photos.length) {
      slides.push(materializeSlide(template, layoutKind, slides.length + 1, chapters, cursor));
      continue;
    }

    const remainingPhotos = state.photos.length - cursor.index;
    if (remainingPhotos <= 0) {
      break;
    }

    const adaptiveLayout = resolveAdaptiveLayout(template, layoutKind, remainingPhotos, density);
    if (!adaptiveLayout) {
      break;
    }

    slides.push(materializeSlide(template, adaptiveLayout, slides.length + 1, chapters, cursor));
  }

  return slides;
}

function renderCompactPreviewCard(template) {
  const photoUrl = state.photos[0] ? state.photos[0].url : template.thumbImage;
  return `
    <div class="compact-cover-card ${getSelectedStyleClass()}">
      <span class="compact-cover-badge">${escapeHtml(getTemplateBadge(template))}</span>
      <span class="compact-cover-title">${escapeHtml(state.coverTitle || template.defaultTitle)}</span>
      <span class="compact-cover-subtitle">${escapeHtml(state.coverSubtitle || template.defaultSubtitle)}</span>
      <img class="compact-cover-photo" src="${photoUrl}" alt="封面预览" />
      <div class="compact-cover-meta">
        <span>${escapeHtml(state.coverClass || template.defaultClass)}</span>
        <span>${escapeHtml(getLayoutPreferenceLabel())}</span>
      </div>
    </div>
  `;
}

function renderCoverSlide(template) {
  const photoUrl = state.photos[0] ? state.photos[0].url : template.thumbImage;
  return `
    <div class="cover-stage-shell">
      <div class="cover-card ${getSelectedStyleClass()}">
        ${renderPageOrnaments(template, 1, 3)}
        <div class="slide-fit-content slide-fit-content--cover">
          <div class="cover-top-row">
            <span class="cover-badge">${escapeHtml(getTemplateBadge(template))}</span>
            <span class="cover-chip">${escapeHtml(getLayoutPreferenceLabel())}</span>
          </div>
          <div class="cover-heading">
            <span class="cover-title">${escapeHtml(state.coverTitle || template.defaultTitle)}</span>
            <span class="cover-subtitle">${escapeHtml(state.coverSubtitle || template.defaultSubtitle)}</span>
          </div>
          <div class="cover-tag-row">
            ${template.decorations.map((item) => `<span class="cover-tag">${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="cover-photo-wrap">
            <img class="cover-photo" src="${photoUrl}" alt="封面主图" />
          </div>
          <div class="cover-accent-line"></div>
          <div class="cover-meta">
            <span>${escapeHtml(state.coverClass || template.defaultClass)}</span>
            <span>小页记</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPhotoPanel(slot, className = "") {
  return `
    <div class="photo-panel ${className} ${slot.type === "sample" ? "is-sample" : ""}">
      <img class="photo-panel-image" src="${slot.url}" alt="${escapeHtml(slot.label)}" />
      <span class="photo-panel-chip">${escapeHtml(slot.label)}</span>
    </div>
  `;
}

function renderNotePanel(note, className = "", chips = []) {
  return `
    <div class="note-card ${className}">
      <span class="note-badge">${escapeHtml(note.badge)}</span>
      <span class="note-title">${escapeHtml(note.title)}</span>
      <span class="note-body">${escapeHtml(note.body)}</span>
      ${chips.length ? `<div class="mini-chip-row">${chips.map((item) => `<span class="mini-chip">${escapeHtml(item)}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function getPageOrnaments(template, pageNumber, count = 3) {
  const ornaments = template.ornamentSet || [];
  if (!ornaments.length) {
    return [];
  }

  const base = Math.max(0, Number(pageNumber || 1) - 1);
  return new Array(count).fill(null).map((_, index) => {
    return ornaments[(base + index) % ornaments.length];
  });
}

function renderPageOrnaments(template, pageNumber, count = 4) {
  const positionClasses = [
    "page-ornament--top-left",
    "page-ornament--top-right",
    "page-ornament--mid-right",
    "page-ornament--bottom-left"
  ];
  const sizeClasses = [
    "page-ornament--sm",
    "page-ornament--md",
    "page-ornament--lg",
    "page-ornament--sm"
  ];
  const tiltClasses = [
    "page-ornament--tilt-a",
    "page-ornament--tilt-b",
    "page-ornament--tilt-c",
    "page-ornament--tilt-d"
  ];
  const ornaments = getPageOrnaments(template, pageNumber, count);

  return `
    <div class="page-ornaments" aria-hidden="true">
      ${ornaments.map((item, index) => `
        <span
          class="page-ornament page-ornament--${escapeHtml(item.kind)} ${positionClasses[index % positionClasses.length]} ${sizeClasses[index % sizeClasses.length]} ${tiltClasses[index % tiltClasses.length]}"
        ></span>
      `).join("")}
    </div>
  `;
}

function renderLayoutSlide(slide, template) {
  let layoutHtml = "";

  if (slide.layout === "hero-single") {
    layoutHtml = `
      <div class="layout layout-hero">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--hero")}
        ${renderNotePanel(slide.note, "note-card--side", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "duo-story") {
    layoutHtml = `
      <div class="layout layout-duo">
        <div class="dual-grid">
          ${renderPhotoPanel(slide.slots[0], "photo-panel--soft")}
          ${renderPhotoPanel(slide.slots[1], "photo-panel--soft")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "trio-mix") {
    layoutHtml = `
      <div class="layout layout-trio">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--hero")}
        <div class="trio-row">
          ${renderPhotoPanel(slide.slots[1], "photo-panel--small")}
          ${renderPhotoPanel(slide.slots[2], "photo-panel--small")}
        </div>
      </div>
    `;
  } else if (slide.layout === "quad-grid") {
    layoutHtml = `
      <div class="layout layout-grid-four">
        ${slide.slots.map((slot) => renderPhotoPanel(slot, "photo-panel--small")).join("")}
      </div>
    `;
  } else if (slide.layout === "mosaic-five") {
    layoutHtml = `
      <div class="layout layout-mosaic">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--hero")}
        <div class="mosaic-grid">
          ${slide.slots.slice(1).map((slot) => renderPhotoPanel(slot, "photo-panel--small")).join("")}
        </div>
      </div>
    `;
  } else if (slide.layout === "timeline") {
    layoutHtml = `
      <div class="layout timeline-list">
        ${slide.slots.map((slot, index) => `
          <div class="timeline-item">
            <div class="timeline-index">${index + 1}</div>
            ${renderPhotoPanel(slot, "photo-panel--timeline")}
            <div class="timeline-copy">
              <span class="timeline-title">${escapeHtml(slide.stepLabels[index] || slot.label)}</span>
              <span class="timeline-desc">${escapeHtml(slot.label)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (slide.layout === "class-grid") {
    layoutHtml = `
      <div class="layout layout-class-grid">
        <div class="class-grid">
          ${slide.slots.map((slot) => renderPhotoPanel(slot, "photo-panel--mini")).join("")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "teacher-letter") {
    layoutHtml = `
      <div class="layout layout-letter">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--wide")}
        ${renderNotePanel(slide.note, "note-card--letter", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "quote-photo") {
    layoutHtml = `
      <div class="layout layout-quote">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--quote")}
        ${renderNotePanel(slide.note, "note-card--quote", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "ceremony-stage") {
    layoutHtml = `
      <div class="layout layout-ceremony">
        <div class="mini-chip-row theme-ribbon">
          ${slide.chips.map((item) => `<span class="mini-chip">${escapeHtml(item)}</span>`).join("")}
        </div>
        ${renderPhotoPanel(slide.slots[0], "photo-panel--wide")}
        <div class="ceremony-bottom">
          ${renderNotePanel(slide.note, "note-card--compact")}
          ${renderPhotoPanel(slide.slots[1], "photo-panel--soft")}
        </div>
      </div>
    `;
  } else if (slide.layout === "journey-map") {
    layoutHtml = `
      <div class="layout layout-journey">
        <div class="journey-track">
          ${slide.slots.map((slot, index) => `
            <div class="journey-item">
              <span class="journey-stop">${escapeHtml(slide.stepLabels[index] || "这一站")}</span>
              ${renderPhotoPanel(slot, "photo-panel--soft")}
            </div>
          `).join("")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact")}
      </div>
    `;
  } else if (slide.layout === "scrapbook-burst") {
    layoutHtml = `
      <div class="layout layout-scrapbook">
        <div class="scrapbook-board">
          ${slide.slots.map((slot, index) => renderPhotoPanel(slot, "photo-panel--scrapbook scrapbook-card-" + (index + 1))).join("")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "smile-wall") {
    layoutHtml = `
      <div class="layout layout-smile-wall">
        <div class="smile-wall-grid">
          ${slide.slots.map((slot, index) => renderPhotoPanel(slot, index === 0 ? "photo-panel--wide" : "photo-panel--small")).join("")}
        </div>
        <div class="mini-chip-row">
          ${slide.chips.map((item) => `<span class="mini-chip">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    `;
  } else if (slide.layout === "garden-poster") {
    layoutHtml = `
      <div class="layout layout-poster">
        <div class="mini-chip-row poster-ribbon">
          ${slide.chips.map((item) => `<span class="mini-chip">${escapeHtml(item)}</span>`).join("")}
        </div>
        ${renderPhotoPanel(slide.slots[0], "photo-panel--hero")}
        ${renderNotePanel(slide.note, "note-card--compact")}
      </div>
    `;
  } else if (slide.layout === "petal-focus") {
    layoutHtml = `
      <div class="layout layout-petal-focus">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--hero")}
        <div class="petal-focus-bottom">
          ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
          ${renderPhotoPanel(slide.slots[1], "photo-panel--soft")}
        </div>
      </div>
    `;
  } else if (slide.layout === "meadow-strip") {
    layoutHtml = `
      <div class="layout layout-meadow-strip">
        <div class="mini-chip-row meadow-ribbon">
          ${slide.chips.map((item) => `<span class="mini-chip">${escapeHtml(item)}</span>`).join("")}
        </div>
        ${renderPhotoPanel(slide.slots[0], "photo-panel--wide meadow-strip-hero")}
        <div class="meadow-strip-grid">
          ${slide.slots.slice(1).map((slot) => renderPhotoPanel(slot, "photo-panel--strip")).join("")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact")}
      </div>
    `;
  } else if (slide.layout === "star-cluster") {
    layoutHtml = `
      <div class="layout layout-star-cluster">
        ${renderPhotoPanel(slide.slots[0], "photo-panel--wide star-cluster-hero")}
        <div class="star-cluster-grid">
          ${slide.slots.slice(1).map((slot) => renderPhotoPanel(slot, "photo-panel--small")).join("")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "buddy-pair") {
    layoutHtml = `
      <div class="layout layout-buddy-pair">
        <div class="dual-grid dual-grid--portrait">
          ${renderPhotoPanel(slide.slots[0], "photo-panel--portrait")}
          ${renderPhotoPanel(slide.slots[1], "photo-panel--portrait")}
        </div>
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
      </div>
    `;
  } else if (slide.layout === "animal-parade") {
    layoutHtml = `
      <div class="layout layout-animal-parade">
        ${renderNotePanel(slide.note, "note-card--compact", slide.chips)}
        <div class="animal-parade-grid">
          ${slide.slots.map((slot) => renderPhotoPanel(slot, "photo-panel--mini")).join("")}
        </div>
      </div>
    `;
  } else if (slide.layout === "farewell-note") {
    layoutHtml = `
      <div class="layout layout-farewell">
        ${renderNotePanel(slide.note, "note-card--letter", slide.chips)}
        <div class="dual-grid">
          ${slide.slots.map((slot) => renderPhotoPanel(slot, "photo-panel--soft")).join("")}
        </div>
      </div>
    `;
  } else {
    layoutHtml = `
      <div class="layout layout-grid-four">
        ${slide.slots.map((slot) => renderPhotoPanel(slot, "photo-panel--small")).join("")}
      </div>
    `;
  }

  return `
    <div class="inner-slide page-theme ${getTemplateThemeClass(template)}">
      ${renderPageOrnaments(template, slide.pageNumber, 3)}
      <div class="slide-fit-content slide-fit-content--page">
        <div class="page-header">
          <span class="page-number">PAGE ${escapeHtml(slide.pageNumber)}</span>
          <span class="page-title">${escapeHtml(slide.title)}</span>
        </div>
        ${layoutHtml}
      </div>
    </div>
  `;
}

function fitPreviewPages() {
  const pages = refs.previewStageShell.querySelectorAll(".cover-card, .inner-slide");
  pages.forEach((pageEl) => {
    const contentEl = pageEl.querySelector(".slide-fit-content");
    if (!contentEl) {
      return;
    }

    const measure = () => {
      pageEl.style.setProperty("--page-fit-scale", "1");
      pageEl.classList.remove("page-fit-active", "page-fit-tight");

      const styles = window.getComputedStyle(pageEl);
      const availableWidth = pageEl.clientWidth
        - parseFloat(styles.paddingLeft || 0)
        - parseFloat(styles.paddingRight || 0);
      const availableHeight = pageEl.clientHeight
        - parseFloat(styles.paddingTop || 0)
        - parseFloat(styles.paddingBottom || 0);
      const contentWidth = Math.max(contentEl.scrollWidth, contentEl.offsetWidth, 1);
      const contentHeight = Math.max(contentEl.scrollHeight, contentEl.offsetHeight, 1);
      const scale = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight);

      if (scale < 0.999) {
        pageEl.style.setProperty("--page-fit-scale", String(scale.toFixed(3)));
        pageEl.classList.add("page-fit-active");
        if (scale < 0.92) {
          pageEl.classList.add("page-fit-tight");
        }
      }
    };

    requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });

    contentEl.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", measure, { once: true });
        img.addEventListener("error", measure, { once: true });
      }
    });
  });
}

function renderPreview() {
  const template = getSelectedTemplate();
  const slides = buildSlides(template);
  state.currentSlideIndex = Math.max(0, Math.min(slides.length - 1, state.currentSlideIndex));
  const slide = slides[state.currentSlideIndex];

  refs.previewMetaRow.innerHTML = getSlideBadges(template)
    .map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`)
    .join("");

  refs.previewStageShell.innerHTML = slide.type === "cover"
    ? renderCoverSlide(template)
    : renderLayoutSlide(slide, template);
  fitPreviewPages();

  refs.previewSlideIndicator.textContent = state.currentSlideIndex + 1 + " / " + slides.length;
  refs.previewPrevSlide.disabled = state.currentSlideIndex === 0;
  refs.previewNextSlide.disabled = state.currentSlideIndex === slides.length - 1;

  refs.templateSwitchRow.innerHTML = templates.map((item) => {
    const active = item.id === state.selectedTemplateId ? "switch-card is-active" : "switch-card";
    return `
      <button class="${active}" type="button" data-switch-template-id="${item.id}">
        ${renderTemplateEffectPreview(item, "switch")}
        <div class="switch-copy">
          <span class="switch-title">${escapeHtml(item.title)}</span>
          <span class="switch-subtitle">${escapeHtml(item.featuredDesc)}</span>
          <span class="switch-action">${item.id === state.selectedTemplateId ? "当前这套" : "切换看看"}</span>
        </div>
      </button>
    `;
  }).join("");
}

function renderCheckout() {
  const template = getSelectedTemplate();
  const work = getCurrentWork();
  const address = getDefaultAddress();
  const quantity = Math.max(1, Number(state.checkoutQuantity || 1));
  const total = template.price * quantity;
  const generatedPages = getGeneratedPageCount(template);

  refs.checkoutQuantity.value = String(quantity);
  refs.checkoutNote.value = state.checkoutNote;
  refs.checkoutWorkTitle.textContent = work ? work.title : template.defaultTitle;
  refs.checkoutWorkMeta.textContent = template.title + " · " + generatedPages + "页预览 · " + state.photos.length + " 张照片";
  refs.checkoutWorkBadges.innerHTML = [
    template.badgeLabel,
    getLayoutPreferenceLabel(),
    "¥" + total
  ].map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");
  refs.checkoutAddressSummary.textContent = address
    ? address.receiver + " · " + address.phone + " · " + address.region + " " + address.detail
    : "还没有保存收货地址，先去补一条默认地址。";
  refs.checkoutAmountRow.innerHTML = [
    "单价 ¥" + template.price,
    quantity + " 本",
    "合计 ¥" + total
  ].map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");
}

function renderPayment() {
  const order = getOrderById(state.currentOrderId);
  if (!order) {
    refs.paymentOrderTitle.textContent = "还没有待支付订单";
    refs.paymentOrderMeta.textContent = "先去预览页确认一本纪念册，再回来继续支付。";
    refs.paymentStatusRow.innerHTML = "";
    refs.paymentAddress.textContent = "—";
    refs.paymentAmount.textContent = "¥0";
    return;
  }
  refs.paymentOrderTitle.textContent = order.albumTitle;
  refs.paymentOrderMeta.textContent = normalizeUiCopy(order.meta);
  refs.paymentStatusRow.innerHTML = [
    order.statusLabel,
    order.pages + "页",
    order.quantity + " 本"
  ].map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");
  refs.paymentAddress.textContent = order.addressText;
  refs.paymentAmount.textContent = "¥" + order.amount;
}

function renderShareView() {
  const work = getCurrentWork();
  const template = getSelectedTemplate();
  refs.shareCardTitle.textContent = work ? work.title : template.defaultTitle;
  refs.shareCardMeta.textContent = work ? normalizeUiCopy(work.previewSummary) : getGeneratedPreviewSummary(template);
  refs.shareCardShell.innerHTML = work ? renderCompactPreviewCard(template) : "";
  refs.shareUrl.value = state.shareDraft ? state.shareDraft.shareUrl : "";
  refs.shareMessage.value = state.shareDraft ? state.shareDraft.message : "";
}

function renderAddressView() {
  refs.addressFormTitle.textContent = refs.addressId.value ? "编辑地址" : "新增地址";
  if (!state.addresses.length) {
    refs.addressList.innerHTML = `
      <div class="empty-card">
        <span class="empty-title">还没有保存收货地址</span>
        <span class="empty-desc">先补一条地址，结算时就能直接带出来。</span>
      </div>
    `;
    return;
  }
  refs.addressList.innerHTML = state.addresses.map((item) => `
    <div class="work-card address-card">
      <div class="work-main">
        <span class="work-title">${escapeHtml(item.receiver)} ${item.isDefault ? "· 默认" : ""}</span>
        <span class="work-meta">${escapeHtml(item.phone)}</span>
        <span class="work-meta">${escapeHtml(item.region + " " + item.detail)}</span>
      </div>
      <div class="address-actions">
        <button class="secondary-button address-action-button" type="button" data-address-edit="${item.id}">编辑</button>
        <button class="secondary-button address-action-button" type="button" data-address-delete="${item.id}">删除</button>
      </div>
    </div>
  `).join("");
}

function renderOrderDetailView() {
  const order = getOrderById(state.currentOrderId);
  if (!order) {
    refs.orderDetailTitle.textContent = "没有找到这笔订单";
    refs.orderDetailMeta.textContent = "先回订单列表看一下。";
    refs.orderDetailStatusRow.innerHTML = "";
    refs.orderDetailLogistics.textContent = "";
    refs.orderDetailAddress.textContent = "";
    refs.orderDetailTime.textContent = "";
    refs.orderDetailPayButton.classList.add("hidden");
    return;
  }
  refs.orderDetailTitle.textContent = order.albumTitle;
  refs.orderDetailMeta.textContent = normalizeUiCopy(order.meta);
  refs.orderDetailStatusRow.innerHTML = [
    order.statusLabel,
    order.quantity + " 本",
    order.pages + "页"
  ].map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("");
  refs.orderDetailLogistics.textContent = order.logisticsText;
  refs.orderDetailAddress.textContent = order.addressText;
  refs.orderDetailTime.textContent = order.timeText;
  refs.orderDetailPayButton.classList.toggle("hidden", order.status !== "pending_payment");
}

function getWorkStatusMeta(status) {
  return workStatusMap[status] || workStatusMap.draft;
}

function upsertCurrentWork(status) {
  if (!state.photos.length && status === "draft") {
    return null;
  }

  const template = getSelectedTemplate();
  const now = Date.now();
  const workId = state.currentWorkId || nextId("work");
  const work = {
    id: workId,
    title: state.coverTitle || template.defaultTitle,
    templateId: template.id,
    templateName: template.title,
    photoCount: state.photos.length,
    previewSummary: getGeneratedPreviewSummary(template),
    updateTime: now,
    status: status,
    coverImage: state.photos[0] ? state.photos[0].url : template.coverImage,
    photos: state.photos.map((item) => Object.assign({}, item)),
    selectedPages: state.selectedPages,
    generatedPages: getGeneratedPageCount(template),
    layoutPreference: state.layoutPreference,
    coverTitle: state.coverTitle,
    coverClass: state.coverClass,
    coverSubtitle: state.coverSubtitle,
    chapterText: state.chapterText
  };

  const currentIndex = state.works.findIndex((item) => item.id === workId);
  if (currentIndex >= 0) {
    state.works.splice(currentIndex, 1, work);
  } else {
    state.works.unshift(work);
  }
  state.currentWorkId = workId;
  return work;
}

function loadWork(workId) {
  const work = state.works.find((item) => item.id === workId);
  if (!work) {
    return;
  }

  state.currentWorkId = work.id;
  state.selectedTemplateId = work.templateId;
  state.selectedPages = work.selectedPages;
  state.layoutPreference = work.layoutPreference || "balanced";
  state.pageMode = "manual";
  state.coverTitle = work.coverTitle;
  state.coverClass = work.coverClass;
  state.coverSubtitle = work.coverSubtitle;
  state.chapterText = work.chapterText;
  state.photos = (work.photos || []).map((item) => Object.assign({}, item));
  state.currentSlideIndex = 0;
}

async function bootstrapData() {
  const data = await apiRequest("/bootstrap");
  syncTemplatesFromServer(data.templates);
  state.currentUser = data.currentUser || null;
  state.addresses = Array.isArray(data.addresses) ? data.addresses : [];
  state.works = Array.isArray(data.works) ? data.works : [];
  state.orders = Array.isArray(data.orders) ? data.orders : [];
}

async function loginDemo() {
  const data = await apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({})
  });
  state.currentUser = data.currentUser || Object.assign({}, defaultUser);
  await bootstrapData();
}

async function logoutDemo() {
  await apiRequest("/logout", {
    method: "POST",
    body: JSON.stringify({})
  });
  state.currentUser = null;
  state.addresses = [];
  state.works = [];
  state.orders = [];
  state.currentOrderId = "";
}

async function persistWorkNow(status) {
  const work = upsertCurrentWork(status);
  if (!work || !state.currentUser) {
    return work;
  }
  const saved = await apiRequest("/works", {
    method: "POST",
    body: JSON.stringify(work)
  });
  replaceWorkInState(saved);
  state.currentWorkId = saved.id;
  return saved;
}

function scheduleWorkSync(status) {
  const work = upsertCurrentWork(status);
  if (!work || !state.currentUser) {
    return;
  }
  const snapshot = JSON.stringify(work);
  window.clearTimeout(draftSyncTimer);
  draftSyncTimer = window.setTimeout(() => {
    apiRequest("/works", {
      method: "POST",
      body: snapshot
    }).then((saved) => {
      replaceWorkInState(saved);
      state.currentWorkId = saved.id;
    }).catch((error) => {
      showToast(error.message);
    });
  }, 320);
}

function fillAddressForm(address) {
  refs.addressId.value = address ? address.id : "";
  refs.addressReceiver.value = address ? address.receiver : (state.currentUser ? state.currentUser.nickname : "");
  refs.addressPhone.value = address ? address.phone : (state.currentUser ? state.currentUser.phone : "");
  refs.addressRegion.value = address ? address.region : "";
  refs.addressDetail.value = address ? address.detail : "";
  refs.addressDefault.checked = address ? Boolean(address.isDefault) : !state.addresses.length;
  refs.addressFormTitle.textContent = address ? "编辑地址" : "新增地址";
}

function renderWorks() {
  if (!state.currentUser) {
    refs.worksContent.innerHTML = `
      <div class="empty-card">
        <span class="empty-title">先登录，再查看已保存的纪念册</span>
        <span class="empty-desc">登录后，排好的幼儿园纪念册会自动保存在“我的作品”。</span>
        <button class="primary-button block-button" type="button" id="works-login-button">登录后查看</button>
      </div>
    `;
    return;
  }

  if (!state.works.length) {
    refs.worksContent.innerHTML = `
      <div class="empty-card">
        <span class="empty-title">还没有保存的纪念册</span>
        <span class="empty-desc">去首页挑一套模板，上传照片后就会自动保存到这里。</span>
        <button class="primary-button block-button" type="button" id="works-create-button">去排一本</button>
      </div>
    `;
    return;
  }

  refs.worksContent.innerHTML = state.works.map((item) => {
    const statusMeta = getWorkStatusMeta(item.status);
    return `
      <button class="work-card" type="button" data-work-id="${item.id}">
        <img class="work-cover" src="${item.coverImage}" alt="${escapeHtml(item.title)} 封面" />
        <div class="work-main">
          <span class="work-title">${escapeHtml(item.title)}</span>
          <span class="work-meta">${escapeHtml(item.templateName)}</span>
          <span class="work-meta">${escapeHtml(item.photoCount + " 张照片 · " + normalizeUiCopy(item.previewSummary))}</span>
          <span class="work-meta">更新于 ${escapeHtml(formatDateTime(item.updateTime))}</span>
          <div class="meta-row">
            <span class="meta-pill">${escapeHtml(statusMeta.label)}</span>
            <span class="meta-pill">${escapeHtml(statusMeta.extra)}</span>
          </div>
        </div>
        <span class="work-arrow">›</span>
      </button>
    `;
  }).join("");
}

function buildOrderShortcuts() {
  const counts = {
    pending_payment: 0,
    awaiting_ship: 0,
    shipped: 0,
    all: state.orders.length
  };

  state.orders.forEach((item) => {
    if (item.status === "pending_payment") {
      counts.pending_payment += 1;
    }
    if (item.status === "awaiting_ship") {
      counts.awaiting_ship += 1;
    }
    if (item.status === "shipped") {
      counts.shipped += 1;
    }
  });

  return [
    { id: "pending_payment", label: "待支付", glyph: "¥", count: counts.pending_payment, className: "order-shortcut" },
    { id: "awaiting_ship", label: "待发货", glyph: "制", count: counts.awaiting_ship, className: "order-shortcut" },
    { id: "shipped", label: "已发货", glyph: "运", count: counts.shipped, className: "order-shortcut" },
    { id: "all", label: "全部订单", glyph: "全", count: counts.all, className: "order-shortcut order-shortcut-split" }
  ];
}

function renderProfile() {
  refs.profileLogout.classList.toggle("hidden", !state.currentUser);
  const defaultAddress = getDefaultAddress();

  if (!state.currentUser) {
    refs.profileAccountTitle.textContent = "家长登录";
    refs.profileAccountSubtitle.textContent = "登录后，孩子的纪念册和订单会自动同步到这里";
    refs.profileAccountMeta.textContent = "";
    refs.profileAddressDesc.textContent = "先保存收货信息，下单时会更省心";
    refs.profileWorkDesc.textContent = "已经排好的纪念册和草稿，都可以在这里继续修改。";
  } else {
    refs.profileAccountTitle.textContent = "Hi,";
    refs.profileAccountSubtitle.textContent = maskPhone(state.currentUser.phone) || state.currentUser.nickname;
    refs.profileAccountMeta.textContent = state.currentUser.nickname + " 家长";
    refs.profileAddressDesc.textContent = defaultAddress
      ? defaultAddress.region + " " + defaultAddress.detail
      : "还没有保存收货地址";
    refs.profileWorkDesc.textContent = state.works.length
      ? "最近在做《" + state.works[0].title + "》，随时可以回来继续修改。"
      : "已经排好的纪念册和草稿，都可以在这里继续修改。";
  }

  refs.profileContactDesc.textContent = "客服电话：400-800-2026";
  refs.orderShortcutRow.innerHTML = buildOrderShortcuts().map((item) => {
    return `
      <button class="${item.className}" type="button" data-order-shortcut="${item.id}">
        <span class="order-icon-shell">
          <span class="order-icon-glyph">${escapeHtml(item.glyph)}</span>
          ${item.count ? `<span class="order-count">${escapeHtml(String(item.count))}</span>` : ""}
        </span>
        <span class="order-label">${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join("");
}

function getVisibleOrders() {
  if (state.activeOrderFilter === "all") {
    return state.orders;
  }
  return state.orders.filter((item) => item.status === state.activeOrderFilter);
}

function renderOrders() {
  refs.ordersFilterRow.innerHTML = orderFilters.map((item) => {
    const className = item.id === state.activeOrderFilter ? "chip chip-active" : "chip";
    return `<button class="${className}" type="button" data-order-filter="${item.id}">${escapeHtml(item.label)}</button>`;
  }).join("");

  if (!state.currentUser) {
    refs.ordersContent.innerHTML = `
      <div class="empty-card">
        <span class="empty-title">先登录，再查看纪念册订单</span>
        <span class="empty-desc">登录后，支付状态、制作进度和物流信息都会同步到这里。</span>
        <button class="primary-button block-button" type="button" id="orders-login-button">登录后查看</button>
      </div>
    `;
    return;
  }

  const visibleOrders = getVisibleOrders();
  if (!visibleOrders.length) {
    refs.ordersContent.innerHTML = `
      <div class="empty-card">
        <span class="empty-title">还没有订单</span>
        <span class="empty-desc">先去排一本幼儿园纪念册，确认下单后订单会出现在这里。</span>
        <button class="primary-button block-button" type="button" id="orders-create-button">去排一本</button>
      </div>
    `;
    return;
  }

  refs.ordersContent.innerHTML = visibleOrders.map((item) => {
    const statusMeta = orderStatusMap[item.status] || orderStatusMap.pending_payment;
    return `
      <button class="order-item-card" type="button" data-order-id="${item.id}">
        <div class="order-main">
          <div class="order-top">
            <span class="order-title">${escapeHtml(item.albumTitle)}</span>
            <span class="${statusMeta.className}">${escapeHtml(statusMeta.label)}</span>
          </div>
          <span class="order-meta">${escapeHtml(normalizeUiCopy(item.meta))}</span>
          <span class="order-meta">${escapeHtml(item.timeText)}</span>
          <span class="order-meta">${escapeHtml(item.logisticsText)}</span>
        </div>
        <span class="order-arrow">›</span>
      </button>
    `;
  }).join("");
}

function renderViews() {
  Object.keys(refs.views).forEach((key) => {
    refs.views[key].classList.toggle("hidden", key !== state.currentView);
  });
}

function renderAll() {
  renderViews();
  renderHome();
  renderStudio();
  renderPreview();
  renderCheckout();
  renderPayment();
  renderShareView();
  renderAddressView();
  renderOrderDetailView();
  renderWorks();
  renderProfile();
  renderOrders();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function detectOrientationFromUrl(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(detectOrientation(image));
    image.onerror = () => resolve("竖图");
    image.src = url;
  });
}

async function handlePhotoSelection(files) {
  revokePhotos();
  state.pageMode = "auto";
  const imageFiles = Array.from(files || [])
    .filter((file) => file.type.indexOf("image/") === 0);

  if (!imageFiles.length) {
    return;
  }

  if (imageFiles.length > 60) {
    showToast("一次最多先放 60 张照片，已经为你保留前 60 张");
  }

  const limitedFiles = imageFiles.slice(0, 60);
  showToast("正在上传照片，请稍等");
  const nextPhotos = [];

  for (const file of limitedFiles) {
    const dataUrl = await readFileAsDataUrl(file);
    const uploaded = await apiRequest("/uploads", {
      method: "POST",
      body: JSON.stringify({
        name: file.name,
        dataUrl: dataUrl
      })
    });
    const remoteUrl = uploaded.url;
    const orientation = await detectOrientationFromUrl(remoteUrl);
    nextPhotos.push({
      id: uploaded.id || nextId("photo"),
      name: file.name,
      url: remoteUrl,
      orientation: orientation
    });
  }

  state.photos = nextPhotos;
  state.selectedPages = getRecommendedPageCount(state.photos.length, getSelectedTemplate());
  state.currentSlideIndex = 0;

  if (state.currentUser) {
    await persistWorkNow("draft");
  } else {
    upsertCurrentWork("draft");
  }
  renderAll();
  showToast("照片上传完成，已经帮你开始排版");
}

function handleFieldInput() {
  state.coverTitle = refs.coverTitle.value.trim() || getSelectedTemplate().defaultTitle;
  state.coverClass = refs.coverClass.value.trim() || getSelectedTemplate().defaultClass;
  state.coverSubtitle = refs.coverSubtitle.value.trim() || getSelectedTemplate().defaultSubtitle;
  state.chapterText = refs.chapterText.value;
  scheduleWorkSync("draft");
  renderStudio();
  renderPreview();
}

async function openCheckout() {
  if (!state.photos.length) {
    showToast("请先上传照片，再继续下单");
    return;
  }

  if (!state.currentUser) {
    await loginDemo();
  }

  await persistWorkNow("generated");
  state.checkoutQuantity = 1;
  state.checkoutNote = "";
  if (!state.addresses.length) {
    state.addressReturnView = "checkout";
    fillAddressForm(null);
    setView("address");
    showToast("先补一条收货地址，再继续下单");
    return;
  }
  setView("checkout");
}

async function submitOrder() {
  if (!state.currentUser) {
    await loginDemo();
  }
  const address = getDefaultAddress();
  if (!address) {
    state.addressReturnView = "checkout";
    setView("address");
    showToast("请先选择收货地址");
    return;
  }
  const work = await persistWorkNow("ordered");
  const order = await apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify({
      workId: work.id,
      addressId: address.id,
      quantity: state.checkoutQuantity,
      note: state.checkoutNote
    })
  });
  replaceOrderInState(order);
  state.currentOrderId = order.id;
  await bootstrapData();
  setView("payment");
  showToast("订单已生成，继续完成支付");
}

async function payCurrentOrder() {
  const order = getOrderById(state.currentOrderId);
  if (!order) {
    showToast("没有找到待支付订单");
    return;
  }
  const paidOrder = await apiRequest("/orders/" + order.id + "/pay", {
    method: "POST",
    body: JSON.stringify({})
  });
  replaceOrderInState(paidOrder);
  state.currentOrderId = paidOrder.id;
  renderAll();
  setView("orderDetail");
  showToast("支付成功，订单已经进入制作流程");
}

async function createShareDraft() {
  if (!state.photos.length) {
    showToast("先上传照片，再生成分享页");
    return;
  }
  if (!state.currentUser) {
    await loginDemo();
  }
  const work = await persistWorkNow("generated");
  const share = await apiRequest("/shares", {
    method: "POST",
    body: JSON.stringify({
      workId: work.id
    })
  });
  state.shareDraft = share;
  setView("share");
}

async function handleAccountAction() {
  if (state.currentUser) {
    showToast("这里后续可以接入真实的家长资料页");
    return;
  }

  await loginDemo();
  renderAll();
  showToast("已先为你登录示例家长账号");
}

function bindEvents() {
  refs.featuredCard.addEventListener("click", (event) => {
    const id = event.currentTarget.dataset.id || templates[0].id;
    startNewBook(id);
  });

  refs.templateFilterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
      return;
    }
    state.activeTemplateFilter = button.dataset.filter;
    renderHome();
  });

  refs.templateList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-template-id]");
    if (!button) {
      return;
    }
    startNewBook(button.dataset.templateId);
  });

  refs.homeGoProfile.addEventListener("click", () => setView("profile"));
  refs.homeGoStudio.addEventListener("click", () => startNewBook(state.selectedTemplateId));

  refs.studioBackHome.addEventListener("click", () => setView("home"));
  refs.studioBottomBack.addEventListener("click", () => setView("home"));
  refs.choosePhotosButton.addEventListener("click", () => refs.photoInput.click());
  refs.photoInput.addEventListener("change", async (event) => {
    try {
      await handlePhotoSelection(event.target.files);
    } catch (error) {
      showToast(error.message);
    } finally {
      refs.photoInput.value = "";
    }
  });
  refs.clearPhotosButton.addEventListener("click", () => {
    revokePhotos();
    state.photos = [];
    state.pageMode = "auto";
    state.selectedPages = getSelectedTemplate().pages;
    if (state.currentWorkId) {
      scheduleWorkSync("draft");
    }
    renderAll();
  });

  refs.photoStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-id]");
    if (!button) {
      return;
    }
    state.photos = state.photos.filter((item) => item.id !== button.dataset.photoId);
    if (state.pageMode === "auto") {
      state.selectedPages = getRecommendedPageCount(state.photos.length, getSelectedTemplate());
    }
    scheduleWorkSync("draft");
    renderAll();
  });

  [refs.coverTitle, refs.coverClass, refs.coverSubtitle, refs.chapterText].forEach((input) => {
    input.addEventListener("input", handleFieldInput);
  });

  refs.pageOptionsRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-value]");
    if (!button) {
      return;
    }
    state.selectedPages = Number(button.dataset.pageValue);
    state.pageMode = "manual";
    state.currentSlideIndex = 0;
    scheduleWorkSync("draft");
    renderStudio();
    renderPreview();
  });

  refs.styleOptionsRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-layout-preference]");
    if (!button) {
      return;
    }
    state.layoutPreference = button.dataset.layoutPreference;
    state.currentSlideIndex = 0;
    scheduleWorkSync("draft");
    renderStudio();
    renderPreview();
  });

  const openPreview = async () => {
    if (state.currentUser) {
      try {
        await persistWorkNow("generated");
      } catch (error) {
        showToast(error.message);
      }
    } else {
      upsertCurrentWork("generated");
    }
    state.currentSlideIndex = 0;
    setView("preview");
  };

  refs.goPreviewButton.addEventListener("click", () => openPreview());
  refs.studioBottomPreview.addEventListener("click", () => openPreview());
  refs.previewBackStudio.addEventListener("click", () => setView("studio"));
  refs.previewPrevSlide.addEventListener("click", () => {
    state.currentSlideIndex = Math.max(0, state.currentSlideIndex - 1);
    renderPreview();
  });
  refs.previewNextSlide.addEventListener("click", () => {
    const slideCount = buildSlides(getSelectedTemplate()).length;
    state.currentSlideIndex = Math.min(slideCount - 1, state.currentSlideIndex + 1);
    renderPreview();
  });
  refs.templateSwitchRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-switch-template-id]");
    if (!button) {
      return;
    }
    applyTemplateForCurrentFlow(button.dataset.switchTemplateId, {
      keepPhotos: true,
      keepWork: true
    });
  });
  refs.previewShare.addEventListener("click", () => {
    createShareDraft().catch((error) => showToast(error.message));
  });
  refs.previewOrder.addEventListener("click", () => {
    openCheckout().catch((error) => showToast(error.message));
  });

  refs.checkoutBackPreview.addEventListener("click", () => setView("preview"));
  refs.checkoutChangeAddress.addEventListener("click", () => {
    state.addressReturnView = "checkout";
    setView("address");
  });
  refs.checkoutQuantity.addEventListener("change", () => {
    state.checkoutQuantity = Number(refs.checkoutQuantity.value || 1);
    renderCheckout();
  });
  refs.checkoutNote.addEventListener("input", () => {
    state.checkoutNote = refs.checkoutNote.value;
  });
  refs.checkoutSubmit.addEventListener("click", () => {
    submitOrder().catch((error) => showToast(error.message));
  });

  refs.paymentGoOrders.addEventListener("click", () => setView("orders"));
  refs.paymentPayButton.addEventListener("click", () => {
    payCurrentOrder().catch((error) => showToast(error.message));
  });

  refs.shareBackPreview.addEventListener("click", () => setView("preview"));
  refs.shareCopyButton.addEventListener("click", async () => {
    if (!state.shareDraft) {
      showToast("还没有生成分享链接");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(state.shareDraft.shareUrl);
      showToast("分享链接已复制");
      return;
    }
    refs.shareUrl.focus();
    refs.shareUrl.select();
    showToast("已选中分享链接，可以直接复制");
  });
  refs.shareOpenButton.addEventListener("click", () => {
    if (!state.shareDraft) {
      showToast("还没有生成分享链接");
      return;
    }
    window.open(state.shareDraft.shareUrl, "_blank", "noopener,noreferrer");
  });

  refs.worksContent.addEventListener("click", (event) => {
    const loginButton = event.target.closest("#works-login-button");
    const createButton = event.target.closest("#works-create-button");
    const workButton = event.target.closest("[data-work-id]");
    if (loginButton) {
      loginDemo().then(() => {
        renderAll();
        showToast("已先为你登录示例家长账号");
      }).catch((error) => showToast(error.message));
      return;
    }
    if (createButton) {
      setView("home");
      return;
    }
    if (workButton) {
      loadWork(workButton.dataset.workId);
      setView("preview");
    }
  });

  refs.worksGoProfile.addEventListener("click", () => setView("profile"));
  refs.worksGoHome.addEventListener("click", () => setView("home"));

  refs.profileAccountAction.addEventListener("click", handleAccountAction);
  refs.orderShortcutRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-shortcut]");
    if (!button) {
      return;
    }
    state.activeOrderFilter = button.dataset.orderShortcut;
    setView("orders");
  });
  refs.profileGoWorks.addEventListener("click", () => setView("works"));
  refs.profileGoAddress.addEventListener("click", () => {
    const openAddressView = () => {
      state.addressReturnView = "profile";
      fillAddressForm(null);
      setView("address");
    };
    if (!state.currentUser) {
      loginDemo().then(() => {
        renderAll();
        openAddressView();
      }).catch((error) => showToast(error.message));
      return;
    }
    openAddressView();
  });
  refs.profileContact.addEventListener("click", () => showToast("客服电话：400-800-2026"));
  refs.profileLogout.addEventListener("click", () => {
    logoutDemo().then(() => {
      renderAll();
      showToast("已退出当前家长账号");
    }).catch((error) => showToast(error.message));
  });

  refs.ordersFilterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-filter]");
    if (!button) {
      return;
    }
    state.activeOrderFilter = button.dataset.orderFilter;
    renderOrders();
  });
  refs.ordersContent.addEventListener("click", (event) => {
    const loginButton = event.target.closest("#orders-login-button");
    const createButton = event.target.closest("#orders-create-button");
    const orderButton = event.target.closest("[data-order-id]");
    if (loginButton) {
      loginDemo().then(() => {
        renderAll();
        showToast("已先为你登录示例家长账号");
      }).catch((error) => showToast(error.message));
      return;
    }
    if (createButton) {
      setView("home");
      return;
    }
    if (orderButton) {
      state.currentOrderId = orderButton.dataset.orderId;
      setView("orderDetail");
    }
  });
  refs.ordersGoProfile.addEventListener("click", () => setView("profile"));
  refs.ordersGoHome.addEventListener("click", () => setView("home"));

  refs.addressSaveButton.addEventListener("click", () => {
    const payload = {
      id: refs.addressId.value || undefined,
      receiver: refs.addressReceiver.value.trim(),
      phone: refs.addressPhone.value.trim(),
      region: refs.addressRegion.value.trim(),
      detail: refs.addressDetail.value.trim(),
      isDefault: refs.addressDefault.checked
    };
    apiRequest("/addresses", {
      method: "POST",
      body: JSON.stringify(payload)
    }).then(async () => {
      const addresses = await apiRequest("/addresses");
      state.addresses = addresses;
      fillAddressForm(null);
      renderAll();
      showToast("地址已保存");
    }).catch((error) => showToast(error.message));
  });

  refs.addressList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-address-edit]");
    const deleteButton = event.target.closest("[data-address-delete]");
    if (editButton) {
      const address = state.addresses.find((item) => item.id === editButton.dataset.addressEdit);
      fillAddressForm(address || null);
      return;
    }
    if (deleteButton) {
      apiRequest("/addresses/" + deleteButton.dataset.addressDelete, {
        method: "DELETE"
      }).then(async () => {
        state.addresses = await apiRequest("/addresses");
        fillAddressForm(null);
        renderAll();
        showToast("地址已删除");
      }).catch((error) => showToast(error.message));
    }
  });

  refs.addressBackButton.addEventListener("click", () => {
    setView(state.addressReturnView || "profile");
  });
  refs.addressNewButton.addEventListener("click", () => fillAddressForm(null));

  refs.orderDetailBackButton.addEventListener("click", () => setView("orders"));
  refs.orderDetailPayButton.addEventListener("click", () => {
    if (!state.currentOrderId) {
      showToast("没有待支付订单");
      return;
    }
    setView("payment");
  });

  window.addEventListener("hashchange", () => {
    const view = normalizeView(window.location.hash);
    if (view !== state.currentView) {
      state.currentView = view;
      renderAll();
    }
  });

  window.addEventListener("beforeunload", revokePhotos);
}

async function init() {
  state.currentView = normalizeView(window.location.hash);
  fillAddressForm(null);
  try {
    await bootstrapData();
  } catch (error) {
    showToast(error.message);
  }
  renderAll();
  bindEvents();
}

init();
