const store = require("../../utils/store");
const templateDraft = require("../../utils/template-draft");
const templatePreview = require("../../utils/template-preview");
const workApi = require("../../utils/work-api");

const PAGE_TYPE_LABELS = {
  cover: "封面",
  hero: "大图页",
  single: "单图页",
  duo: "双图页",
  mosaic: "拼贴页",
  grid: "合辑页",
  timeline: "成长页",
  quote: "寄语页",
  letter: "结尾页"
};

const TEMPLATE_FORMATS = {
  square: {
    ratio: 1,
    label: "方版"
  },
  portrait: {
    ratio: 0.74,
    label: "竖版"
  },
  landscape: {
    ratio: 1.34,
    label: "横版"
  }
};

const PREVIEW_SLOT_COUNTS = {
  square: {
    mosaic: 4,
    grid: 4,
    timeline: 3
  },
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

function getPhotoById(photos, photoId) {
  const photo = (photos || []).find((item) => item.id === photoId);
  if (photo) {
    return photo;
  }
  return {
    id: photoId,
    path: "",
    placeholder: true
  };
}

function fillPhotoSlots(photos, count, pageId) {
  const safePhotos = Array.isArray(photos) ? photos.slice(0, count) : [];
  const slots = safePhotos.slice();
  while (slots.length < count) {
    slots.push({
      id: `${pageId}_placeholder_${slots.length}`,
      path: "",
      placeholder: true
    });
  }
  return slots;
}

function getTemplateProfile(work) {
  const template = work.templateSnapshot || store.getTemplateById(work.templateId) || {};
  const bookFormat = work.bookFormat || template.bookFormat || "square";
  const formatInfo = TEMPLATE_FORMATS[bookFormat] || TEMPLATE_FORMATS.square;
  return {
    bookFormat,
    formatLabel: work.formatLabel || template.formatLabel || formatInfo.label,
    pageAspectRatio: work.pageAspectRatio || template.pageAspectRatio || formatInfo.ratio,
    styleFamily: work.styleFamily || template.styleFamily || "clean",
    styleLabel: work.styleLabel || template.styleLabel || "清新风格"
  };
}

function getSlotCount(profile, page, type) {
  const explicitCount = page && Array.isArray(page.photoIds) ? page.photoIds.length : 0;
  if (explicitCount) {
    return explicitCount;
  }
  const formatSlots = PREVIEW_SLOT_COUNTS[profile.bookFormat] || PREVIEW_SLOT_COUNTS.square;
  return formatSlots[type] || 1;
}

function buildPreviewMetrics(profile) {
  let windowWidth = 375;
  try {
    const info = wx.getSystemInfoSync();
    windowWidth = info.windowWidth || windowWidth;
  } catch (error) {
    windowWidth = 375;
  }

  const pageWidth = Math.max(260, Math.min(windowWidth - 52, 420));
  const pageHeight = Math.round(pageWidth / (profile.pageAspectRatio || 1));
  return {
    pageFrameStyle: `width:${pageWidth}px;height:${pageHeight}px;`,
    stageStyle: `height:${pageHeight + 44}px;`,
    frameHintText: `${profile.formatLabel} · ${profile.styleLabel} · 单页翻页预览`
  };
}

function buildBookPages(work, profile) {
  const photos = work.photos || [];
  const layoutPlan = work.previewData && work.previewData.pages
    ? { pages: work.previewData.pages }
    : work.layoutPlan && work.layoutPlan.pages
      ? work.layoutPlan
      : store.buildLayoutPlanFromWork(work);
  return layoutPlan.pages.map((page, pageIndex) => {
    const resolvedPhotos = (page.photoIds || []).map((photoId) => getPhotoById(photos, photoId));
    const firstPhoto = resolvedPhotos[0] || {
      id: `${page.id}_placeholder_0`,
      path: "",
      placeholder: true
    };
    const duoCount = getSlotCount(profile, page, "duo");
    const mosaicCount = getSlotCount(profile, page, "mosaic");
    const gridCount = getSlotCount(profile, page, "grid");
    const timelineCount = getSlotCount(profile, page, "timeline");

    return Object.assign({}, page, {
      pageNo: pageIndex + 1,
      pageLabel: `第 ${pageIndex + 1} 页`,
      layoutTypeText: PAGE_TYPE_LABELS[page.type] || "内容页",
      sheetClassName: `format-${profile.bookFormat} theme-${profile.styleFamily} type-${page.type}`,
      photos: resolvedPhotos,
      firstPhoto,
      duoPhotos: fillPhotoSlots(resolvedPhotos, duoCount, `${page.id}_duo`),
      mosaicPhotos: fillPhotoSlots(resolvedPhotos, mosaicCount, `${page.id}_mosaic`),
      gridPhotos: fillPhotoSlots(resolvedPhotos, gridCount, `${page.id}_grid`),
      timelineRows: fillPhotoSlots(resolvedPhotos, timelineCount, `${page.id}_timeline`).map((photo, index) => {
        return {
          id: `${page.id}_timeline_${index}`,
          photo,
          label: `成长片段 ${index + 1}`
        };
      })
    });
  });
}

function buildTemplatePages(work) {
  const previewFrames = work.templateSnapshot
    && work.templateSnapshot.previewModel
    && Array.isArray(work.templateSnapshot.previewModel.previewFrames)
    ? work.templateSnapshot.previewModel.previewFrames
    : [];

  if (previewFrames.length) {
    return previewFrames.map((frame, index) => {
      return {
        id: `template_${index}`,
        image: frame.image,
        label: frame.title || `模板参考 ${index + 1}`
      };
    });
  }

  return (work.previewImages || []).map((image, index) => {
    return {
      id: `template_${index}`,
      image,
      label: `模板参考 ${index + 1}`
    };
  });
}

function buildPageState(pages, pageIndex) {
  const total = pages.length;
  const safeIndex = Math.max(0, Math.min(pageIndex, Math.max(total - 1, 0)));
  const activePage = pages[safeIndex] || null;
  return {
    currentPageIndex: safeIndex,
    currentPageIndicator: activePage ? `第 ${activePage.pageNo} 页 · ${activePage.layoutTypeText}` : "",
    pageProgressText: total ? `${safeIndex + 1} / ${total}` : "0 / 0",
    prevDisabled: safeIndex <= 0,
    nextDisabled: safeIndex >= total - 1
  };
}

Page({
  data: {
    work: null,
    sourceMode: "work",
    pages: [],
    currentPageIndex: 0,
    currentPageIndicator: "",
    pageProgressText: "0 / 0",
    prevDisabled: true,
    nextDisabled: true,
    templatePages: [],
    pageFrameStyle: "",
    stageStyle: "",
    frameHintText: "",
    previewMetaText: "",
    previewNoteText: "",
    pageSectionTitle: "",
    pageSectionSubtitle: "",
    priceText: "",
    createdText: "",
    layoutText: "",
    previewModeLabel: "",
    bottomPrimaryText: "",
    bottomSecondaryText: ""
  },

  onLoad(options) {
    if (options.mode === "draft") {
      this.loadDraftPreview(options.templateId);
      return;
    }
    this.loadWork(options.id);
  },

  applyPageState(pageIndex) {
    this.setData(buildPageState(this.data.pages, pageIndex));
  },

  loadWork(id) {
    workApi.getWorkDetail(id)
      .then((work) => {
        this.renderWorkPreview(work);
      })
      .catch((error) => {
        const cachedWork = store.getWorkById(id);
        if (cachedWork) {
          this.renderWorkPreview(cachedWork);
          wx.showToast({
            title: "当前先展示本地缓存预览",
            icon: "none"
          });
          return;
        }

        wx.showToast({ title: error.message || "作品不存在", icon: "none" });
        setTimeout(() => wx.navigateBack(), 800);
      });
  },

  renderWorkPreview(work) {
    const profile = getTemplateProfile(work);
    const previewMetrics = buildPreviewMetrics(profile);
    const pages = buildBookPages(work, profile);

    this.setData(Object.assign({
      work,
      sourceMode: "work",
      pages,
      templatePages: buildTemplatePages(work),
      pageFrameStyle: previewMetrics.pageFrameStyle,
      stageStyle: previewMetrics.stageStyle,
      frameHintText: previewMetrics.frameHintText,
      previewMetaText: `${store.formatDate(work.createdAt)} · ${(work.photos || []).length} 张照片 · ${work.pageCount} 页模板`,
      previewNoteText: "历史作品预览会优先使用保存作品时冻结下来的模板快照和预览结构，不会被新模板版本改动。",
      pageSectionTitle: "单页翻页预览",
      pageSectionSubtitle: "左右滑动切换页面，确认当前模板在移动端里的成书效果",
      priceText: work.statusText || work.status || "我的作品",
      createdText: store.formatDate(work.createdAt),
      layoutText: `${work.layoutLabel || "自动排版"} · ${profile.formatLabel} · ${profile.styleLabel} · ${pages.length} 个书页`,
      previewModeLabel: "作品预览",
      bottomPrimaryText: "查看作品信息",
      bottomSecondaryText: "回作品集"
    }, buildPageState(pages, 0)));
  },

  loadDraftPreview(templateId) {
    if (!templateId) {
      wx.showToast({ title: "模板参数缺失", icon: "none" });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    const draft = templateDraft.getDraft(templateId);
    const previewData = templatePreview.buildPreviewData(Object.assign({}, draft, { templateId }));

    if (!previewData.photos.length || !previewData.pages.length) {
      wx.showToast({ title: "先补充照片再预览", icon: "none" });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    const work = {
      id: `draft_${templateId}`,
      title: previewData.coverTitle || previewData.templateName,
      templateId: previewData.templateId,
      templateName: previewData.templateName,
      price: 0,
      pageCount: previewData.generatedPageCount,
      coverImage: previewData.coverImage,
      previewImages: previewData.previewImages,
      photos: previewData.photos,
      createdAt: previewData.generatedAt,
      layoutLabel: previewData.layoutLabel,
      formatLabel: previewData.formatLabel,
      bookFormat: previewData.bookFormat,
      pageAspectRatio: previewData.pageAspectRatio,
      styleFamily: previewData.styleFamily,
      styleLabel: previewData.styleLabel,
      layoutPlan: {
        pages: previewData.pages
      }
    };

    const profile = getTemplateProfile(work);
    const previewMetrics = buildPreviewMetrics(profile);
    const pages = buildBookPages(work, profile);

    this.setData(Object.assign({
      work,
      sourceMode: "draft",
      pages,
      templatePages: buildTemplatePages(work),
      pageFrameStyle: previewMetrics.pageFrameStyle,
      stageStyle: previewMetrics.stageStyle,
      frameHintText: `${profile.formatLabel} · ${profile.styleLabel} · 已按当前照片顺序生成预览`,
      previewMetaText: `${previewData.generatedPageCount} 页预览 · ${previewData.photoCount} 张照片`,
      previewNoteText: "先从封面开始往后翻，看看这套模板下已经生成好的页面",
      pageSectionTitle: "完整翻页预览",
      pageSectionSubtitle: "左右滑动切换页面，确认当前模板下的封面和内容页效果",
      priceText: `${previewData.photoCount} 张照片`,
      createdText: `${previewData.generatedPageCount} 页预览 · 最少建议 ${previewData.minPhotos} 张`,
      layoutText: `${previewData.layoutLabel} · 当前只展示已生成好的页面，不会循环重复照片`,
      previewModeLabel: "完整预览",
      bottomPrimaryText: "返回继续编辑",
      bottomSecondaryText: "继续补照片"
    }, buildPageState(pages, 0)));
  },

  onPageChange(event) {
    this.applyPageState(event.detail.current);
  },

  goPrevPage() {
    if (this.data.prevDisabled) {
      return;
    }
    this.applyPageState(this.data.currentPageIndex - 1);
  },

  goNextPage() {
    if (this.data.nextDisabled) {
      return;
    }
    this.applyPageState(this.data.currentPageIndex + 1);
  },

  orderNow() {
    if (this.data.sourceMode === "draft") {
      this.backToEditor();
      return;
    }
    if (!this.data.work) {
      return;
    }
    wx.navigateTo({
      url: `/pages/work-detail/index?id=${this.data.work.id}`
    });
  },

  backWorks() {
    if (this.data.sourceMode === "draft") {
      this.backToEditor();
      return;
    }
    wx.switchTab({ url: "/pages/works/index" });
  },

  backToEditor() {
    if (this.data.work && this.data.work.templateId) {
      wx.navigateBack({
        fail: () => {
          wx.navigateTo({
            url: `/pages/template-detail/index?id=${this.data.work.templateId}`
          });
        }
      });
    }
  }
});
