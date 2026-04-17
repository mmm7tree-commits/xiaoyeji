function buildPreviewImages(slug) {
  return [
    `/assets/templates/${slug}/cover.jpg`,
    `/assets/templates/${slug}/page-1.jpg`,
    `/assets/templates/${slug}/page-2.jpg`,
    `/assets/templates/${slug}/page-3.jpg`
  ];
}

function buildTemplateMeta(options) {
  return {
    formatLabel: options.formatLabel,
    bookFormat: options.bookFormat,
    pageAspectRatio: options.pageAspectRatio,
    styleFamily: options.styleFamily,
    styleLabel: options.styleLabel,
    orderMinPhotos: options.orderMinPhotos,
    openingLayout: options.openingLayout,
    closingLayout: options.closingLayout,
    middleLayoutSequence: options.middleLayoutSequence,
    layoutCapacityOverrides: options.layoutCapacityOverrides || {}
  };
}

const templates = [
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "summer",
      styleLabel: "夏日清新风",
      orderMinPhotos: 6,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["timeline", "duo", "mosaic"]
    }),
    id: "summer-square",
    slug: "summer-square",
    name: "夏天毕业方版",
    scene: "毕业纪念册",
    description: "来自 20P 毕业季方版，适合幼儿园毕业季和班级合照。",
    price: 12800,
    pageCount: 20,
    minPhotos: 8,
    recommendedPhotoCount: "8-28 张",
    layoutLabel: "方版故事排版",
    coverTone: "#F7C96F",
    accentTone: "#77B979",
    sourceName: "2-幼儿园毕业季方版样册PSD模板70P=/20P 毕业季方版",
    tags: ["毕业模板", "方版", "20P"],
    previewImages: buildPreviewImages("summer-square"),
    coverImage: "/assets/templates/summer-square/cover.jpg",
    layouts: ["cover", "hero", "timeline", "duo", "mosaic", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "ceremony",
      styleLabel: "毕业典礼风",
      orderMinPhotos: 8,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["duo", "timeline", "grid"]
    }),
    id: "graduation-memory",
    slug: "graduation-memory",
    name: "毕业纪念册",
    scene: "毕业纪念册",
    description: "来自幼儿园毕业纪念册参考小样，页面层次更完整。",
    price: 13800,
    pageCount: 21,
    minPhotos: 10,
    recommendedPhotoCount: "10-32 张",
    layoutLabel: "毕业典藏排版",
    coverTone: "#F7B766",
    accentTone: "#83C7D8",
    sourceName: "幼儿园毕业纪念册=21=/设计效果参考小样",
    tags: ["毕业模板", "参考小样", "21P"],
    previewImages: buildPreviewImages("graduation-memory"),
    coverImage: "/assets/templates/graduation-memory/cover.jpg",
    layouts: ["cover", "hero", "duo", "timeline", "grid", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "growth",
      styleLabel: "成长插画风",
      orderMinPhotos: 8,
      openingLayout: "single",
      closingLayout: "quote",
      middleLayoutSequence: ["timeline", "duo", "mosaic"]
    }),
    id: "growth-album",
    slug: "growth-album",
    name: "幼儿园成长相册",
    scene: "成长纪念册",
    description: "来自幼儿园相册模板，轻快插画感适合日常成长记录。",
    price: 10800,
    pageCount: 25,
    minPhotos: 10,
    recommendedPhotoCount: "10-36 张",
    layoutLabel: "成长记录排版",
    coverTone: "#B8DDA4",
    accentTone: "#F2A08A",
    sourceName: "幼儿园相册模板=25=/PSD/图图",
    tags: ["成长记录", "清新自然", "25P"],
    previewImages: buildPreviewImages("growth-album"),
    coverImage: "/assets/templates/growth-album/cover.jpg",
    layouts: ["cover", "single", "timeline", "duo", "mosaic", "quote"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "classroom",
      styleLabel: "班级合辑风",
      orderMinPhotos: 8,
      openingLayout: "grid",
      closingLayout: "letter",
      middleLayoutSequence: ["mosaic", "timeline", "duo"],
      layoutCapacityOverrides: {
        grid: 4
      }
    }),
    id: "class-square",
    slug: "class-square",
    name: "班级毕业方版",
    scene: "班级纪念册",
    description: "来自毕业册幼儿园 27 方版，适合班级活动与集体照。",
    price: 15800,
    pageCount: 20,
    minPhotos: 12,
    recommendedPhotoCount: "12-40 张",
    layoutLabel: "班级合辑排版",
    coverTone: "#8ECDE7",
    accentTone: "#F6B16B",
    sourceName: "毕业册-幼儿园27-方版=20p=/JPG",
    tags: ["班级合辑", "方版", "20P"],
    previewImages: buildPreviewImages("class-square"),
    coverImage: "/assets/templates/class-square/cover.jpg",
    layouts: ["cover", "grid", "mosaic", "timeline", "duo", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "illustration",
      styleLabel: "手绘童趣风",
      orderMinPhotos: 8,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["duo", "quote", "mosaic"]
    }),
    id: "illustration-square",
    slug: "illustration-square",
    name: "手绘插画方版",
    scene: "毕业纪念册",
    description: "来自手绘插画方版模板，画面更童趣，适合温馨纪念册。",
    price: 14800,
    pageCount: 19,
    minPhotos: 10,
    recommendedPhotoCount: "10-30 张",
    layoutLabel: "手绘温馨排版",
    coverTone: "#F9C6A2",
    accentTone: "#8CCB9B",
    sourceName: "毕业册-幼儿园手绘插画-方版=19P=/JPG",
    tags: ["手绘插画", "温馨", "19P"],
    previewImages: buildPreviewImages("illustration-square"),
    coverImage: "/assets/templates/illustration-square/cover.jpg",
    layouts: ["cover", "hero", "duo", "quote", "mosaic", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "横版",
      bookFormat: "landscape",
      pageAspectRatio: 1.42,
      styleFamily: "ceremony",
      styleLabel: "活动纪实风",
      orderMinPhotos: 8,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["duo", "grid", "mosaic"],
      layoutCapacityOverrides: {
        grid: 4,
        timeline: 2
      }
    }),
    id: "graduation-landscape",
    slug: "graduation-landscape",
    name: "毕业季横版",
    scene: "毕业纪念册",
    description: "来自毕业季幼儿园横版模板，适合横向大合照和活动场景。",
    price: 16800,
    pageCount: 19,
    minPhotos: 12,
    recommendedPhotoCount: "12-34 张",
    layoutLabel: "横版活动排版",
    coverTone: "#B7DDF4",
    accentTone: "#F8C36B",
    sourceName: "毕业季幼儿园横版=19=/毕业季幼儿园横版",
    tags: ["横版", "毕业季", "19P"],
    previewImages: buildPreviewImages("graduation-landscape"),
    coverImage: "/assets/templates/graduation-landscape/cover.jpg",
    layouts: ["cover", "hero", "duo", "grid", "mosaic", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "竖版",
      bookFormat: "portrait",
      pageAspectRatio: 0.74,
      styleFamily: "portrait",
      styleLabel: "轻量成长风",
      orderMinPhotos: 4,
      openingLayout: "single",
      closingLayout: "letter",
      middleLayoutSequence: ["timeline", "duo"],
      layoutCapacityOverrides: {
        mosaic: 2,
        grid: 4,
        timeline: 2
      }
    }),
    id: "graduation-portrait",
    slug: "graduation-portrait",
    name: "毕业季竖版",
    scene: "毕业纪念册",
    description: "来自毕业季竖版模板，适合个人成长页和竖幅照片。",
    price: 9800,
    pageCount: 10,
    minPhotos: 6,
    recommendedPhotoCount: "6-18 张",
    layoutLabel: "轻量竖版排版",
    coverTone: "#F9D9A8",
    accentTone: "#9BC9EA",
    sourceName: "毕业季竖版=10=",
    tags: ["竖版", "轻量制作", "10P"],
    previewImages: buildPreviewImages("graduation-portrait"),
    coverImage: "/assets/templates/graduation-portrait/cover.jpg",
    layouts: ["cover", "single", "timeline", "duo", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "竖版",
      bookFormat: "portrait",
      pageAspectRatio: 0.74,
      styleFamily: "portrait",
      styleLabel: "毕业寄语风",
      orderMinPhotos: 6,
      openingLayout: "single",
      closingLayout: "quote",
      middleLayoutSequence: ["timeline", "duo", "mosaic"],
      layoutCapacityOverrides: {
        mosaic: 2,
        grid: 4,
        timeline: 2
      }
    }),
    id: "graduation-vertical-20",
    slug: "graduation-vertical-20",
    name: "毕业季竖版 20P",
    scene: "毕业纪念册",
    description: "适合竖幅人像、个人成长页和毕业寄语，版式更舒展。",
    price: 12800,
    pageCount: 20,
    minPhotos: 8,
    recommendedPhotoCount: "8-28 张",
    layoutLabel: "竖版成长排版",
    coverTone: "#F6DDA8",
    accentTone: "#7AC7D3",
    sourceName: "2-幼儿园毕业季方版样册PSD模板70P=/20P 毕业季竖版",
    tags: ["竖版", "毕业季", "20P"],
    previewImages: buildPreviewImages("graduation-vertical-20"),
    coverImage: "/assets/templates/graduation-vertical-20/cover.jpg",
    layouts: ["cover", "single", "timeline", "duo", "quote", "mosaic"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "横版",
      bookFormat: "landscape",
      pageAspectRatio: 1.3,
      styleFamily: "storybook",
      styleLabel: "故事样册风",
      orderMinPhotos: 10,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["grid", "timeline", "mosaic", "duo"],
      layoutCapacityOverrides: {
        grid: 4,
        timeline: 2
      }
    }),
    id: "storybook-sample-30",
    slug: "storybook-sample-30",
    name: "毕业故事样册 30P",
    scene: "毕业纪念册",
    description: "带人物参考的完整样册，适合照片量较多的班级故事。",
    price: 18800,
    pageCount: 30,
    minPhotos: 16,
    recommendedPhotoCount: "16-60 张",
    layoutLabel: "故事长册排版",
    coverTone: "#A7D9F6",
    accentTone: "#F6B871",
    sourceName: "2-幼儿园毕业季方版样册PSD模板70P=/JPG - 带人物可出样册",
    tags: ["长册", "班级故事", "30P"],
    previewImages: buildPreviewImages("storybook-sample-30"),
    coverImage: "/assets/templates/storybook-sample-30/cover.jpg",
    layouts: ["cover", "hero", "grid", "timeline", "mosaic", "duo", "letter"]
  },
  {
    ...buildTemplateMeta({
      formatLabel: "方版",
      bookFormat: "square",
      pageAspectRatio: 1,
      styleFamily: "clean",
      styleLabel: "清新简洁风",
      orderMinPhotos: 10,
      openingLayout: "hero",
      closingLayout: "letter",
      middleLayoutSequence: ["duo", "grid", "quote", "mosaic"],
      layoutCapacityOverrides: {
        grid: 4
      }
    }),
    id: "psd-30-square",
    slug: "psd-30-square",
    name: "清新方版 30P",
    scene: "成长纪念册",
    description: "从 PSD 模板转出轻量预览，适合成长记录和活动合集。",
    price: 17800,
    pageCount: 30,
    minPhotos: 14,
    recommendedPhotoCount: "14-56 张",
    layoutLabel: "清新方版排版",
    coverTone: "#CDE9B8",
    accentTone: "#F3A66E",
    sourceName: "2-幼儿园毕业季方版样册PSD模板70P=/30p=PSD模板",
    tags: ["方版", "成长合集", "30P"],
    previewImages: buildPreviewImages("psd-30-square"),
    coverImage: "/assets/templates/psd-30-square/cover.jpg",
    layouts: ["cover", "hero", "duo", "grid", "quote", "mosaic", "letter"]
  }
];

module.exports = {
  templates
};
