const templateRuntime = require("./template-runtime");

const DEFAULT_LAYOUTS = ["cover", "hero", "duo", "mosaic", "letter"];

const LAYOUT_CAPACITY = {
  cover: 1,
  hero: 1,
  single: 1,
  duo: 2,
  mosaic: 4,
  grid: 6,
  timeline: 3,
  quote: 1,
  letter: 1
};

const FORMAT_LAYOUT_CAPACITY = {
  portrait: {
    mosaic: 2,
    grid: 4,
    timeline: 2
  },
  landscape: {
    mosaic: 3,
    grid: 4,
    timeline: 2
  }
};

const LAYOUT_COPY = {
  cover: {
    title: "把今天的笑脸留在这里",
    subtitle: "这本小书会从最喜欢的一张照片开始",
    caption: "小页记"
  },
  hero: {
    title: "这一页先留给最想记住的笑脸",
    subtitle: "把今天最喜欢的一张照片放在前面",
    caption: "今天的主角"
  },
  single: {
    title: "把一个小瞬间认真放大",
    subtitle: "适合留住孩子最自然的一张笑脸",
    caption: "慢慢长大"
  },
  duo: {
    title: "把两个小瞬间放在一起",
    subtitle: "笑声、拥抱和并肩站着的样子，都适合留在这一页",
    caption: "一起长大的日子"
  },
  mosaic: {
    title: "把热闹的瞬间排在一起",
    subtitle: "适合活动照片和同一天里发生的小片段",
    caption: "热闹的一页"
  },
  grid: {
    title: "把更多笑脸收在同一页",
    subtitle: "适合班级合照、活动合辑和一组连续的小动作",
    caption: "笑脸合集"
  },
  timeline: {
    title: "按上传顺序把故事慢慢讲下去",
    subtitle: "这一页会按你选照片的顺序排下来",
    caption: "顺着回忆往下翻"
  },
  quote: {
    title: "留一句会想再读一遍的话",
    subtitle: "给这段回忆留一点安静和一点想说的话",
    caption: "愿你一直好奇、一直快乐"
  },
  letter: {
    title: "翻到这里，回忆就慢慢落下来了",
    subtitle: "把最后一页留给喜欢的人和舍不得忘记的时刻",
    caption: "愿今天的笑脸，以后还会想起来"
  }
};

const OPENING_LAYOUT_ORDER = ["hero", "single", "timeline", "duo", "mosaic", "grid", "quote", "letter"];
const CLOSING_LAYOUT_ORDER = ["letter", "quote", "timeline", "mosaic", "duo", "single", "hero", "grid"];
const FALLBACK_LAYOUT_ORDER = ["single", "duo", "timeline", "mosaic", "grid", "quote", "letter"];

function getTemplateRule(templateId) {
  if (templateId && typeof templateId === "object") {
    return templateRuntime.normalizeTemplateData(templateId);
  }

  const localTemplate = templateRuntime.getLocalTemplateMeta(templateId) || templateRuntime.getLocalTemplateMeta("summer-square");
  return templateRuntime.normalizeTemplateData(localTemplate);
}

function parseMaxPhotos(recommendedPhotoCount, fallback) {
  const matched = String(recommendedPhotoCount || "").match(/(\d+)\s*-\s*(\d+)/);
  if (matched) {
    return Number(matched[2]);
  }
  return fallback;
}

function getTemplatePhotoLimit(template) {
  const safeTemplate = getTemplateRule(template);
  const suggestedMinPhotos = safeTemplate.minPhotos || 1;
  const orderMinPhotos = safeTemplate.orderMinPhotos || Math.max(1, Math.ceil(suggestedMinPhotos * 0.75));
  return {
    minPhotos: suggestedMinPhotos,
    suggestedMinPhotos,
    orderMinPhotos,
    maxPhotos: parseMaxPhotos(
      safeTemplate.recommendedPhotoCount,
      Math.max((safeTemplate.pageCount || 20) * 2, suggestedMinPhotos)
    )
  };
}

function normalizeLayouts(layouts) {
  const safeLayouts = Array.isArray(layouts) && layouts.length ? layouts : DEFAULT_LAYOUTS;
  const uniqueLayouts = safeLayouts.filter((layout, index) => safeLayouts.indexOf(layout) === index);
  if (uniqueLayouts[0] === "cover") {
    return uniqueLayouts;
  }
  return ["cover"].concat(uniqueLayouts);
}

function getLayoutCapacity(template, type) {
  const templateOverrides = template && template.layoutCapacityOverrides ? template.layoutCapacityOverrides : {};
  const formatOverrides = template && template.bookFormat ? FORMAT_LAYOUT_CAPACITY[template.bookFormat] || {} : {};
  return templateOverrides[type] || formatOverrides[type] || LAYOUT_CAPACITY[type] || 1;
}

function pickLayout(contentLayouts, preferredOrder, fallback) {
  for (let index = 0; index < preferredOrder.length; index += 1) {
    const layout = preferredOrder[index];
    if (contentLayouts.indexOf(layout) > -1) {
      return layout;
    }
  }
  return fallback;
}

function chooseBestFitLayout(template, contentLayouts, remainingPhotos, preferredLayouts) {
  const orderedCandidates = []
    .concat(preferredLayouts || [])
    .concat(contentLayouts)
    .concat(FALLBACK_LAYOUT_ORDER);

  for (let index = 0; index < orderedCandidates.length; index += 1) {
    const layout = orderedCandidates[index];
    if (contentLayouts.indexOf(layout) === -1) {
      continue;
    }
    const capacity = getLayoutCapacity(template, layout);
    if (capacity <= remainingPhotos) {
      return layout;
    }
  }

  return "";
}

function buildCoverPage(template, draft, photos) {
  const coverCopy = template.previewModel || LAYOUT_COPY.cover;
  const firstPhoto = photos[0];
  if (!firstPhoto) {
    return null;
  }

  return {
    id: "draft_cover",
    type: "cover",
    title: draft.coverTitle || coverCopy.coverTitle || template.name,
    subtitle: draft.babyInfo || template.summary || LAYOUT_COPY.cover.subtitle,
    caption: draft.coverPhrase || coverCopy.coverPhrase || LAYOUT_COPY.cover.caption,
    photoIds: [firstPhoto.id],
    bookFormat: template.bookFormat || "square",
    styleFamily: template.styleFamily || "clean",
    formatLabel: template.formatLabel || "方版",
    styleLabel: template.styleLabel || "清新风格"
  };
}

function buildContentPage(template, type, pageIndex, photoIds, blueprint) {
  const copy = LAYOUT_COPY[type] || LAYOUT_COPY.single;
  const decorativeElements = blueprint && Array.isArray(blueprint.decorativeElements)
    ? blueprint.decorativeElements
    : [];
  return {
    id: `draft_page_${pageIndex + 1}_${type}`,
    type,
    title: blueprint && blueprint.title ? blueprint.title : copy.title,
    subtitle: blueprint && blueprint.caption ? blueprint.caption : copy.subtitle,
    caption: decorativeElements.length ? decorativeElements.slice(0, 2).join(" · ") : copy.caption,
    photoIds,
    decorativeElements,
    section: blueprint && blueprint.section ? blueprint.section : "content",
    bookFormat: template.bookFormat || "square",
    styleFamily: template.styleFamily || "clean",
    formatLabel: template.formatLabel || "方版",
    styleLabel: template.styleLabel || "清新风格"
  };
}

function buildPagesFromBlueprints(template, draft, photos) {
  const blueprints = template.previewModel && Array.isArray(template.previewModel.pageBlueprints)
    ? template.previewModel.pageBlueprints.slice().sort((left, right) => left.pageNo - right.pageNo)
    : [];

  if (!blueprints.length) {
    return [];
  }

  const pages = [];
  let cursor = 0;

  for (let index = 0; index < blueprints.length; index += 1) {
    const blueprint = blueprints[index];
    if (blueprint.section === "cover") {
      const coverPage = buildCoverPage(template, draft, photos);
      if (coverPage) {
        pages.push(Object.assign({}, coverPage, {
          id: `draft_page_${blueprint.pageNo}_cover`,
          section: blueprint.section,
          decorativeElements: blueprint.decorativeElements || []
        }));
        cursor = Math.max(cursor, 1);
      }
      continue;
    }

    const remainingPhotos = photos.length - cursor;
    const capacity = Math.min(getLayoutCapacity(template, blueprint.layoutType), Math.max(remainingPhotos, 0));
    if (capacity <= 0) {
      break;
    }

    const pagePhotos = photos.slice(cursor, cursor + capacity);
    pages.push(buildContentPage(template, blueprint.layoutType, pages.length, pagePhotos.map((item) => item.id), blueprint));
    cursor += capacity;
  }

  return pages;
}

function buildPreviewData(draft) {
  const template = getTemplateRule(draft.templateSnapshot || draft.templateId);
  const photos = Array.isArray(draft.photos) ? draft.photos : [];
  const limits = getTemplatePhotoLimit(template);
  const safePhotos = photos.slice(0, limits.maxPhotos);
  const layouts = normalizeLayouts(template.layouts);
  const contentLayouts = layouts.filter((layout) => layout !== "cover");
  const openingType = template.openingLayout && contentLayouts.indexOf(template.openingLayout) > -1
    ? template.openingLayout
    : pickLayout(contentLayouts, OPENING_LAYOUT_ORDER, contentLayouts[0] || "single");
  const closingType = template.closingLayout && contentLayouts.indexOf(template.closingLayout) > -1
    ? template.closingLayout
    : pickLayout(contentLayouts, CLOSING_LAYOUT_ORDER, contentLayouts[contentLayouts.length - 1] || "letter");
  const preferredMiddleLayouts = Array.isArray(template.middleLayoutSequence) && template.middleLayoutSequence.length
    ? template.middleLayoutSequence.filter((layout) => contentLayouts.indexOf(layout) > -1)
    : contentLayouts.filter((layout) => layout !== openingType && layout !== closingType);

  let pages = buildPagesFromBlueprints(template, draft, safePhotos);

  if (!pages.length) {
    pages = [];
    const coverPage = buildCoverPage(template, draft, safePhotos);
    if (coverPage) {
      pages.push(coverPage);
    }

    let cursor = coverPage ? 1 : 0;
    const maxPreviewPages = Math.max(1, Math.min(template.pageCount || 20, 32));
    const reusableMiddleLayouts = preferredMiddleLayouts.length ? preferredMiddleLayouts : contentLayouts;
    let middleCursor = 0;

    while (cursor < safePhotos.length && pages.length < maxPreviewPages) {
      const remainingPhotos = safePhotos.length - cursor;
      const isClosingSlot = remainingPhotos <= getLayoutCapacity(template, closingType);
      const preferredLayouts = isClosingSlot
        ? [closingType].concat(reusableMiddleLayouts)
        : reusableMiddleLayouts.slice(middleCursor).concat(reusableMiddleLayouts.slice(0, middleCursor)).concat([openingType, closingType]);
      const layoutType = chooseBestFitLayout(template, contentLayouts, remainingPhotos, preferredLayouts);

      if (!layoutType) {
        break;
      }

      const capacity = Math.min(getLayoutCapacity(template, layoutType), remainingPhotos);
      const pagePhotos = safePhotos.slice(cursor, cursor + capacity);
      pages.push(buildContentPage(template, layoutType, pages.length, pagePhotos.map((item) => item.id)));
      cursor += capacity;

      if (reusableMiddleLayouts.length) {
        middleCursor = (middleCursor + 1) % reusableMiddleLayouts.length;
      }
    }
  }

  return {
    version: 1,
    mode: "draft",
    generatedAt: Date.now(),
    templateId: template.id,
    templateName: template.name,
    templateDescription: template.description,
    layoutLabel: template.layoutLabel || "自动排版",
    formatLabel: template.formatLabel || "方版",
    bookFormat: template.bookFormat || "square",
    pageAspectRatio: template.pageAspectRatio || 1,
    styleFamily: template.styleFamily || "clean",
    styleLabel: template.styleLabel || "清新风格",
    sourceMode: template.sourceMode || "seed_fallback",
    templateVersion: template.templateVersion || null,
    coverImage: template.coverImage,
    previewImages: template.previewImages || [],
    previewModel: template.previewModel || null,
    coverTitle: draft.coverTitle || template.name,
    babyInfo: draft.babyInfo || "",
    coverPhrase: draft.coverPhrase || "",
    minPhotos: limits.minPhotos,
    suggestedMinPhotos: limits.suggestedMinPhotos,
    orderMinPhotos: limits.orderMinPhotos,
    maxPhotos: limits.maxPhotos,
    photoCount: safePhotos.length,
    generatedPageCount: pages.length,
    photos: safePhotos,
    pages
  };
}

module.exports = {
  buildPreviewData,
  getTemplatePhotoLimit,
  getTemplateRule
};
