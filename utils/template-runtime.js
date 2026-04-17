const { templates } = require("../data/templates");

const DEFAULT_RUNTIME = {
  layoutLabel: "自动排版",
  formatLabel: "方版",
  bookFormat: "square",
  pageAspectRatio: 1,
  styleFamily: "clean",
  styleLabel: "清新风格",
  suggestedMinPhotos: 1,
  orderMinPhotos: 1,
  maxPhotos: 24,
  openingLayout: "hero",
  closingLayout: "letter",
  middleLayoutSequence: ["duo", "mosaic", "timeline"],
  layoutCapacityOverrides: {}
};

function parseMaxPhotos(text, fallback) {
  const matched = String(text || "").match(/(\d+)\s*-\s*(\d+)/);
  if (matched) {
    return Number(matched[2]);
  }
  return fallback;
}

function getLocalTemplateMeta(idOrSlug) {
  return templates.find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
}

function normalizeTemplateData(template) {
  if (!template || typeof template !== "object") {
    return null;
  }

  const local = getLocalTemplateMeta(template.id || template.slug || "");
  const consumptionConfig = template.consumptionConfig || {};
  const previewModel = template.previewModel || {};
  const baseMinPhotos = template.minPhotos || consumptionConfig.suggestedMinPhotos || (local && local.minPhotos) || 1;
  const fallbackMaxPhotos = Math.max((template.pageCount || (local && local.pageCount) || 20) * 2, baseMinPhotos);
  const previewFrames = Array.isArray(previewModel.previewFrames) ? previewModel.previewFrames : [];
  const previewImages = Array.isArray(template.previewImages) && template.previewImages.length
    ? template.previewImages
    : previewFrames.map((item) => item.image).filter(Boolean);

  return Object.assign({}, local || {}, template, {
    sourceMode: template.sourceMode || "seed_fallback",
    templateVersion: template.templateVersion || {
      id: template.templateVersionId || null,
      versionNo: template.templateVersionNo || null,
      createdAt: null,
      sourceMode: template.sourceMode || "seed_fallback"
    },
    layoutLabel: consumptionConfig.layoutLabel || template.layoutLabel || (local && local.layoutLabel) || DEFAULT_RUNTIME.layoutLabel,
    formatLabel: consumptionConfig.formatLabel || template.formatLabel || (local && local.formatLabel) || DEFAULT_RUNTIME.formatLabel,
    bookFormat: consumptionConfig.bookFormat || template.bookFormat || (local && local.bookFormat) || DEFAULT_RUNTIME.bookFormat,
    pageAspectRatio: consumptionConfig.pageAspectRatio || template.pageAspectRatio || (local && local.pageAspectRatio) || DEFAULT_RUNTIME.pageAspectRatio,
    styleFamily: consumptionConfig.styleFamily || template.styleFamily || (local && local.styleFamily) || DEFAULT_RUNTIME.styleFamily,
    styleLabel: consumptionConfig.styleLabel || template.styleLabel || (local && local.styleLabel) || DEFAULT_RUNTIME.styleLabel,
    suggestedMinPhotos: consumptionConfig.suggestedMinPhotos || template.suggestedMinPhotos || baseMinPhotos,
    orderMinPhotos: consumptionConfig.orderMinPhotos || template.orderMinPhotos || (local && local.orderMinPhotos) || Math.max(1, Math.ceil(baseMinPhotos * 0.75)),
    maxPhotos: consumptionConfig.maxPhotos || template.maxPhotos || parseMaxPhotos(template.photoSuggestionText || (local && local.recommendedPhotoCount), fallbackMaxPhotos),
    openingLayout: consumptionConfig.openingLayout || template.openingLayout || (local && local.openingLayout) || DEFAULT_RUNTIME.openingLayout,
    closingLayout: consumptionConfig.closingLayout || template.closingLayout || (local && local.closingLayout) || DEFAULT_RUNTIME.closingLayout,
    middleLayoutSequence: consumptionConfig.middleLayoutSequence || template.middleLayoutSequence || (local && local.middleLayoutSequence) || DEFAULT_RUNTIME.middleLayoutSequence,
    layoutCapacityOverrides: consumptionConfig.layoutCapacityOverrides || template.layoutCapacityOverrides || (local && local.layoutCapacityOverrides) || DEFAULT_RUNTIME.layoutCapacityOverrides,
    previewImages: previewImages.length ? previewImages : ((local && local.previewImages) || []),
    coverImage: template.coverImage || (previewFrames[0] && previewFrames[0].image) || (local && local.coverImage) || "",
    previewModel: {
      coverTitle: previewModel.coverTitle || template.name || (local && local.name) || "",
      coverPhrase: previewModel.coverPhrase || template.summary || "",
      moodLabel: previewModel.moodLabel || template.themeLabel || "",
      sceneKeywords: Array.isArray(previewModel.sceneKeywords) ? previewModel.sceneKeywords : [],
      sectionPlan: Array.isArray(previewModel.sectionPlan) ? previewModel.sectionPlan : [],
      pageBlueprints: Array.isArray(previewModel.pageBlueprints) ? previewModel.pageBlueprints : [],
      previewFrames
    }
  });
}

function normalizeTemplateList(items) {
  return (items || []).map((item) => normalizeTemplateData(item)).filter(Boolean);
}

function toTemplateSnapshot(template) {
  const normalized = normalizeTemplateData(template);
  if (!normalized) {
    return null;
  }

  return {
    id: normalized.id,
    slug: normalized.slug,
    name: normalized.name,
    categoryCode: normalized.categoryCode,
    categoryName: normalized.categoryName,
    summary: normalized.summary,
    description: normalized.description,
    themeLabel: normalized.themeLabel,
    badgeText: normalized.badgeText,
    photoSuggestionText: normalized.photoSuggestionText,
    pageCount: normalized.pageCount,
    minPhotos: normalized.minPhotos,
    suggestedMinPhotos: normalized.suggestedMinPhotos,
    orderMinPhotos: normalized.orderMinPhotos,
    maxPhotos: normalized.maxPhotos,
    priceInCents: normalized.priceInCents,
    priceText: normalized.priceText,
    coverTone: normalized.coverTone,
    accentTone: normalized.accentTone,
    coverImage: normalized.coverImage,
    previewImages: normalized.previewImages,
    storyHighlights: normalized.storyHighlights || [],
    suitableScenes: normalized.suitableScenes || [],
    isFeatured: Boolean(normalized.isFeatured),
    isPublished: normalized.isPublished !== false,
    sourceMode: normalized.sourceMode,
    templateVersion: normalized.templateVersion,
    layoutLabel: normalized.layoutLabel,
    formatLabel: normalized.formatLabel,
    bookFormat: normalized.bookFormat,
    pageAspectRatio: normalized.pageAspectRatio,
    styleFamily: normalized.styleFamily,
    styleLabel: normalized.styleLabel,
    openingLayout: normalized.openingLayout,
    closingLayout: normalized.closingLayout,
    middleLayoutSequence: normalized.middleLayoutSequence,
    layoutCapacityOverrides: normalized.layoutCapacityOverrides,
    previewModel: normalized.previewModel
  };
}

module.exports = {
  getLocalTemplateMeta,
  normalizeTemplateData,
  normalizeTemplateList,
  toTemplateSnapshot
};
