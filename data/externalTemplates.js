const externalTemplates = [
  {
    id: "yofus-6095-14300-xiaoxiaoyouer",
    provider: "yofus",
    providerLabel: "有福",
    importStatus: "draft",
    sourceUrl: "https://www.yofus.com/yfapp.php?sid=14300&style_name=%E5%B0%8F%E5%B0%8F%E5%B9%BC%E5%84%BF&goods_sn=yfs006054-6095#/",
    previewAssets: {
      coverBrief:
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/brief/normal.jpg",
      demoPages: [
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page1.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page2.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page3.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page4.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page5.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page6.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page7.png",
        "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page8.png"
      ],
      singlePagePages: [
        {
          id: "page1",
          url: "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page1.png",
          sourcePage: 1,
          role: "cover",
          label: "封面单页",
          caption: "封面型单页：大面积主背景 + 标题区 + 单张主视觉，适合抽成 cover 类模板。"
        },
        {
          id: "page8",
          url: "https://www.yofus.com/resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/demo/page8.png",
          sourcePage: 8,
          role: "closing",
          label: "结尾单页",
          caption: "收尾型单页：延续封面系主色，可承载结束文案、署名或封底信息。"
        }
      ]
    },
    sourceMeta: {
      goodsId: "6095",
      goodsSn: "yfs006054-6095",
      styleId: "14300",
      subjectId: "10486",
      subjectLabel: "儿童",
      templateName: "小小幼儿",
      productName: "高清蝴蝶精装竖册",
      sourceFolder: "resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/",
      previewCount: 8,
      singlePagePreviewCount: 2,
      photoCapacityText: "46张",
      optionSummary: {
        defaultFinish: "光膜",
        defaultPageCount: 22,
        finishes: ["光膜", "高清绒面"],
        pageCounts: [22, 30]
      }
    },
    normalizedProfile: {
      scene: "儿童成长纪念册",
      formatLabel: "竖版",
      bookFormat: "portrait",
      productSizeLabel: "8x12 竖册",
      bindingLabel: "高清蝴蝶精装",
      styleFamily: "baby",
      styleLabel: "童趣明快风",
      palette: [
        {
          hex: "#EBDE37",
          usage: "封面/结束页主背景",
          evidence: "preview demo page1/page8 dominant color"
        },
        {
          hex: "#FFFFFF",
          usage: "留白与文字承载底色",
          evidence: "single-page cover/ending preview"
        }
      ],
      toneKeywords: ["儿童", "明快", "柔和", "成长记录", "轻插画"],
      photoCapacity: {
        recommended: 46,
        label: "46张"
      }
    },
    layoutPatterns: [
      {
        key: "cover-portrait",
        label: "封面单页",
        evidence: "preview demo page1 is portrait-sized",
        confidence: "high",
        layoutScope: "single"
      },
      {
        key: "ending-portrait",
        label: "结尾/封底单页",
        evidence: "preview demo page8 is portrait-sized",
        confidence: "high",
        layoutScope: "single"
      },
      {
        key: "single-copy-zone",
        label: "单页标题/落款区",
        evidence: "page1/page8 both reserve clean text-friendly area",
        confidence: "medium",
        layoutScope: "single"
      }
    ],
    elementInventory: {
      confirmed: [
        "封面主视觉图",
        "2 张单页样张（page1/page8）",
        "单页标题或落款区",
        "儿童主题资源目录",
        "22/30 页规格切换",
        "光膜/高清绒面切换"
      ],
      inferred: [
        "儿童贴纸/插画装饰",
        "单张主图 + 留白构图",
        "结尾页文案或封底信息"
      ]
    },
    reusableRules: [
      "先拆商品规格，再拆视觉主题，避免把页数或材质写死在模板名称里。",
      "保留 sourceFolder 和 previewAssets，方便后续批量抓取同目录模板。",
      "单页模板先抽为 cover / closing / text-zone 三类，跨页排版先不过模板库。"
    ],
    importMapping: {
      targetCollection: "externalTemplates",
      suggestedLocalTemplateId: "baby-portrait-xiaoxiaoyouer",
      suggestedPreviewStrategy:
        "第一阶段沿用远程 previewAssets；确认版权和质量后再转存到 assets/templates。"
    },
    notes: [
      "当前条目基于公开商品页和预览资源整理，适合作为模板库源数据。",
      "当前预览模式只保留 page1 和 page8 两张单页样张，page2-page7 的跨页内容已过滤。",
      "8 张 demo 预览并不等于完整 22 页源文件，只能先作为版式抽样。",
      "如果要精确到每页照片槽位和文字层，需要继续解析编辑器内的 XML/AMF 模板数据。"
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    externalTemplates
  };
}

if (typeof window !== "undefined") {
  window.externalTemplates = externalTemplates;
}
