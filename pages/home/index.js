const templateApi = require("../../utils/template-api");
const templateSelection = require("../../utils/template-selection");

const EMPTY_FEATURED_TEMPLATE = {
  id: "",
  name: "",
  categoryName: "",
  summary: "",
  description: "",
  themeLabel: "",
  badgeText: "",
  photoSuggestionText: "",
  pageCount: 0,
  priceText: "",
  coverImage: "",
  previewImages: [],
  storyHighlights: []
};

function formatLoadErrorMessage(error, fallbackText) {
  if (!error) {
    return fallbackText;
  }

  const message = typeof error.message === "string" ? error.message : "";

  if (!message) {
    return fallbackText;
  }

  if (message.includes("加载失败") || message.includes("请求失败") || message.includes("超时")) {
    return fallbackText;
  }

  return `${fallbackText}，请过一会儿再来看看。`;
}

function decorateCategories(categories, activeCategoryCode) {
  return (categories || []).map((item) => {
    return Object.assign({}, item, {
      activeClass: item.code === activeCategoryCode ? "active" : ""
    });
  });
}

function decorateTemplates(templates, selectedTemplateId) {
  return (templates || []).map((item) => {
    return Object.assign({}, item, {
      selectedClass: item.id === selectedTemplateId ? "is-selected" : "",
      selectedText: item.id === selectedTemplateId ? "✓" : "›"
    });
  });
}

Page({
  data: {
    loading: true,
    loadFailed: false,
    errorText: "",
    featuredTemplate: EMPTY_FEATURED_TEMPLATE,
    categories: [],
    activeCategoryCode: "all",
    templates: [],
    selectedTemplateId: ""
  },

  onLoad() {
    this.bootstrap();
  },

  onShow() {
    const selectedTemplateId = templateSelection.getSelectedTemplateId();
    this.setData({
      selectedTemplateId,
      templates: decorateTemplates(this.data.templates, selectedTemplateId)
    });
  },

  bootstrap() {
    this.setData({
      loading: true,
      loadFailed: false,
      errorText: ""
    });

    Promise.all([
      templateApi.getFeaturedTemplate(),
      templateApi.getTemplateCategories(),
      templateApi.getTemplateList({ categoryCode: "all" })
    ])
      .then(([featuredTemplate, categories, templates]) => {
        const selectedTemplateId = templateSelection.getSelectedTemplateId();
        this.setData({
          loading: false,
          featuredTemplate,
          categories: decorateCategories(categories, "all"),
          activeCategoryCode: "all",
          templates: decorateTemplates(templates, selectedTemplateId),
          selectedTemplateId
        });
      })
      .catch((error) => {
        this.setData({
          loading: false,
          loadFailed: true,
          errorText: formatLoadErrorMessage(error, "可能是网络有点忙，模板还没顺利赶到")
        });
      });
  },

  switchCategory(event) {
    const categoryCode = event.currentTarget.dataset.code;
    if (!categoryCode || categoryCode === this.data.activeCategoryCode) {
      return;
    }

    this.setData({
      activeCategoryCode: categoryCode,
      categories: decorateCategories(this.data.categories, categoryCode)
    });

    wx.showLoading({ title: "加载模板" });
    templateApi.getTemplateList({ categoryCode })
      .then((templates) => {
        const selectedTemplateId = templateSelection.getSelectedTemplateId();
        this.setData({
          templates: decorateTemplates(templates, selectedTemplateId),
          selectedTemplateId
        });
      })
      .catch((error) => {
        wx.showToast({
          title: formatLoadErrorMessage(error, "这一类模板还没顺利带出来"),
          icon: "none"
        });
      })
      .then(() => {
        wx.hideLoading();
      }, () => {
        wx.hideLoading();
      });
  },

  openFeaturedTemplate() {
    if (!this.data.featuredTemplate.id) {
      return;
    }
    wx.navigateTo({
      url: `/pages/template-detail/index?id=${this.data.featuredTemplate.id}`
    });
  },

  openTemplateDetail(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    wx.navigateTo({
      url: `/pages/template-detail/index?id=${id}`
    });
  },

  goProfile() {
    wx.switchTab({
      url: "/pages/profile/index"
    });
  },

  retryLoad() {
    this.bootstrap();
  }
});
