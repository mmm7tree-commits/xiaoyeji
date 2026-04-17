const templateApi = require("../../utils/template-api");
const templateSelection = require("../../utils/template-selection");
const templateDraft = require("../../utils/template-draft");
const templatePreview = require("../../utils/template-preview");
const templateRuntime = require("../../utils/template-runtime");
const store = require("../../utils/store");
const workApi = require("../../utils/work-api");
const assetApi = require("../../utils/asset-api");

function buildDraftViewState(templateId, template, draft) {
  if (!template) {
    return {
      coverTitle: "",
      babyInfo: "",
      coverPhrase: "",
      photos: [],
      suggestedMinPhotos: 0,
      orderMinPhotos: 0,
      maxPhotos: 0,
      canPreview: false,
      canSaveWork: false,
      photoCountText: "",
      photoOrderText: "",
      previewRuleText: "",
      saveRuleText: "",
      templateSourceText: "",
      templateVersionText: "",
      uploadLimitText: "",
      previewSummaryText: "",
      saveSummaryText: "",
      saveButtonText: "保存到我的作品"
    };
  }

  const safeDraft = draft || templateDraft.getDraft(templateId);
  const templateSnapshot = templateRuntime.toTemplateSnapshot(template) || safeDraft.templateSnapshot;
  const limits = templatePreview.getTemplatePhotoLimit(templateSnapshot || template);
  const previewData = templatePreview.buildPreviewData(Object.assign({}, safeDraft, {
    templateId,
    templateSnapshot
  }));
  const photoCount = safeDraft.photos.length;
  const belowSuggestedMinimum = photoCount < limits.suggestedMinPhotos;
  const belowOrderMinimum = photoCount < limits.orderMinPhotos;

  return {
    coverTitle: safeDraft.coverTitle,
    babyInfo: safeDraft.babyInfo,
    coverPhrase: safeDraft.coverPhrase,
    photos: safeDraft.photos,
    suggestedMinPhotos: limits.suggestedMinPhotos,
    orderMinPhotos: limits.orderMinPhotos,
    maxPhotos: limits.maxPhotos,
    canPreview: photoCount > 0,
    canSaveWork: photoCount > 0,
    templateSourceText: template.sourceMode === "admin_published"
      ? "当前模板入口已接入后台已发布版本，首页推荐、上下架和推荐结果会同步影响这里。"
      : "当前还在使用本地模板兜底数据，后续会继续收口到后台已发布模板。",
    templateVersionText: template.templateVersion && template.templateVersion.versionNo
      ? `当前使用后台第 ${template.templateVersion.versionNo} 版模板结构`
      : "当前使用本地模板参考结构",
    photoCountText: photoCount ? `已添加 ${photoCount} / ${limits.maxPhotos} 张照片` : `还没有添加照片，最多可放 ${limits.maxPhotos} 张`,
    photoOrderText: photoCount
      ? "当前会按你上传的先后顺序排版，删除照片后其余顺序会保持不变。"
      : "上传时会按你选择的先后顺序保存，后面预览也会先按这个顺序排。",
    previewRuleText: belowSuggestedMinimum
      ? `这套模板建议至少准备 ${limits.suggestedMinPhotos} 张照片。现在也可以先看已生成的页面。`
      : `已经达到建议照片数，翻页时会看到更完整的页面节奏。`,
    saveRuleText: belowOrderMinimum
      ? `至少准备 ${limits.orderMinPhotos} 张照片后，才能保存为“待下单”作品。现在保存会先标记为“继续补充”。`
      : "已经达到可保存为“待下单”作品的最少张数。",
    uploadLimitText: `当前模板最多可上传 ${limits.maxPhotos} 张照片，达到上限后请先删除再继续添加。`,
    previewSummaryText: previewData.generatedPageCount
      ? `按当前内容，已经可以生成 ${previewData.generatedPageCount} 页预览。`
      : "添加照片后，就能看到这套模板下的完整翻页预览。",
    saveSummaryText: photoCount === 0
      ? "先添加至少 1 张照片，再把当前内容保存到我的作品。"
      : belowOrderMinimum
        ? "现在可以先保存为“继续补充”，后面再回来补图。"
        : "现在可以保存到我的作品，后面从作品列表继续回看。"
  };
}

Page({
  data: {
    templateId: "",
    loading: true,
    loadFailed: false,
    errorText: "",
    template: null,
    isSelected: false,
    coverTitle: "",
    babyInfo: "",
    coverPhrase: "",
    photos: [],
    suggestedMinPhotos: 0,
    orderMinPhotos: 0,
    maxPhotos: 0,
    canPreview: false,
    canSaveWork: false,
    photoCountText: "",
    photoOrderText: "",
    previewRuleText: "",
    saveRuleText: "",
    uploadLimitText: "",
    previewSummaryText: "",
    saveSummaryText: "",
    saveButtonText: "保存到我的作品",
    isSavingPhotos: false,
    isSavingWork: false
  },

  onLoad(options) {
    const templateId = options.id || "";
    this.setData({ templateId });
    this.loadTemplateDetail(templateId);
  },

  onShow() {
    if (!this.data.templateId || !this.data.template) {
      return;
    }
    this.applyDraftState(templateDraft.getDraft(this.data.templateId));
  },

  loadTemplateDetail(templateId) {
    if (!templateId) {
      this.setData({
        loading: false,
        loadFailed: true,
        errorText: "模板参数缺失，请返回首页重新选择"
      });
      return;
    }

    this.setData({
      loading: true,
      loadFailed: false,
      errorText: ""
    });

    templateApi.getTemplateDetail(templateId)
      .then((template) => {
        templateSelection.saveSelectedTemplateId(template.id);
        templateDraft.patchDraft(template.id, {
          templateSnapshot: templateRuntime.toTemplateSnapshot(template)
        });
        this.setData({
          loading: false,
          template,
          isSelected: true
        });
        this.applyDraftState(templateDraft.getDraft(template.id));
      })
      .catch((error) => {
        this.setData({
          loading: false,
          loadFailed: true,
          errorText: error.message || "模板详情加载失败，请稍后再试"
        });
      });
  },

  applyDraftState(draft) {
    this.setData(buildDraftViewState(this.data.templateId, this.data.template, draft));
  },

  patchDraft(partialDraft) {
    const nextDraft = templateDraft.patchDraft(this.data.templateId, partialDraft);
    this.applyDraftState(nextDraft);
  },

  onCoverTitleInput(event) {
    this.patchDraft({
      coverTitle: event.detail.value
    });
  },

  onBabyInfoInput(event) {
    this.patchDraft({
      babyInfo: event.detail.value
    });
  },

  onCoverPhraseInput(event) {
    this.patchDraft({
      coverPhrase: event.detail.value
    });
  },

  uploadPhotos() {
    if (this.data.isSavingPhotos) {
      return;
    }

    const remainingCount = this.data.maxPhotos - this.data.photos.length;
    if (remainingCount <= 0) {
      wx.showToast({
        title: `当前模板最多可上传 ${this.data.maxPhotos} 张照片，请删除后继续添加`,
        icon: "none"
      });
      return;
    }

    if (!wx.chooseMedia) {
      this.chooseImagesFallback(Math.min(remainingCount, 20));
      return;
    }

    wx.chooseMedia({
      count: Math.min(remainingCount, 20),
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["original"],
      success: (res) => {
        this.persistChosenPhotos(res.tempFiles || []);
      },
      fail: () => {
        wx.showToast({ title: "没有选择照片", icon: "none" });
      }
    });
  },

  chooseImagesFallback(count) {
    wx.chooseImage({
      count,
      sizeType: ["original"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const files = (res.tempFilePaths || []).map((path) => {
          return { tempFilePath: path, size: 0 };
        });
        this.persistChosenPhotos(files);
      },
      fail: () => {
        wx.showToast({ title: "没有选择照片", icon: "none" });
      }
    });
  },

  persistChosenPhotos(files) {
    if (!files.length) {
      wx.showToast({ title: "没有选择照片", icon: "none" });
      return;
    }

    const remainingCount = this.data.maxPhotos - this.data.photos.length;
    if (files.length > remainingCount) {
      wx.showToast({
        title: `当前模板最多可上传 ${this.data.maxPhotos} 张照片，请删除后继续添加`,
        icon: "none"
      });
      return;
    }

    this.setData({ isSavingPhotos: true });
    wx.showLoading({ title: "保存照片" });

    const currentPhotos = this.data.photos || [];
    const now = Date.now();
    Promise.all(files.map((file, index) => this.savePhotoFile(file, index, now)))
      .then((nextPhotos) => {
        const mergedPhotos = currentPhotos.concat(nextPhotos);
        this.patchDraft({ photos: mergedPhotos });
      })
      .catch(() => {
        wx.showToast({ title: "照片保存失败，请重试", icon: "none" });
      })
      .then(() => {
        wx.hideLoading();
        this.setData({ isSavingPhotos: false });
      }, () => {
        wx.hideLoading();
        this.setData({ isSavingPhotos: false });
      });
  },

  savePhotoFile(file, index, now) {
    const tempFilePath = file.tempFilePath || file.path;
    return new Promise((resolve, reject) => {
      if (!tempFilePath) {
        reject(new Error("missing photo path"));
        return;
      }

      wx.saveFile({
        tempFilePath,
        success: (res) => {
          resolve({
            id: `draft_photo_${now}_${index}`,
            path: res.savedFilePath,
            tempPath: tempFilePath,
            size: file.size || 0,
            saved: true
          });
        },
        fail: () => {
          resolve({
            id: `draft_photo_${now}_${index}`,
            path: tempFilePath,
            tempPath: tempFilePath,
            size: file.size || 0,
            saved: false
          });
        }
      });
    });
  },

  removePhoto(event) {
    const id = event.currentTarget.dataset.id;
    const targetPhoto = this.data.photos.find((item) => item.id === id);
    const nextPhotos = this.data.photos.filter((item) => item.id !== id);
    if (targetPhoto && targetPhoto.saved && targetPhoto.path) {
      wx.removeSavedFile({ filePath: targetPhoto.path });
    }
    this.patchDraft({ photos: nextPhotos });
  },

  openFullPreview() {
    if (!this.data.photos.length) {
      wx.showToast({
        title: "先添加至少 1 张照片",
        icon: "none"
      });
      return;
    }

    if (this.data.photos.length < this.data.suggestedMinPhotos) {
      wx.showModal({
        title: "照片还可以再多一点",
        content: `当前模板建议至少 ${this.data.suggestedMinPhotos} 张照片。现在可以先看已生成的页面，也可以继续补照片。`,
        confirmText: "先看预览",
        cancelText: "继续补图",
        success: (res) => {
          if (res.confirm) {
            this.goPreviewPage();
          }
        }
      });
      return;
    }

    this.goPreviewPage();
  },

  goPreviewPage() {
    wx.navigateTo({
      url: `/pages/preview/index?mode=draft&templateId=${this.data.templateId}`
    });
  },

  saveCurrentWork() {
    if (!this.data.photos.length || this.data.isSavingWork) {
      wx.showToast({
        title: this.data.isSavingWork ? "正在保存，请稍候" : "先添加至少 1 张照片",
        icon: "none"
      });
      return;
    }

    const draft = templateDraft.getDraft(this.data.templateId);
    this.setData({
      isSavingWork: true,
      saveButtonText: "正在上传图片"
    });
    wx.showLoading({ title: "保存作品" });

    assetApi.ensurePhotosUploaded(draft.photos)
      .then((uploadedPhotos) => {
        templateDraft.patchDraft(this.data.templateId, {
          photos: uploadedPhotos
        });
        this.setData({
          saveButtonText: "正在保存作品"
        });
        return workApi.createWork({
          templateId: this.data.templateId,
          draft: {
            coverTitle: draft.coverTitle,
            babyInfo: draft.babyInfo,
            coverPhrase: draft.coverPhrase,
            photos: uploadedPhotos
          }
        });
      })
      .then((work) => {
      wx.showToast({
        title: work.statusText === "继续补充" ? "已保存为继续补充" : "已保存到我的作品",
        icon: "success"
      });

      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/work-detail/index?id=${work.id}`
        });
      }, 250);
    }).catch((error) => {
      wx.showToast({
        title: error.message || "作品保存失败，请稍后再试",
        icon: "none"
      });
    }).then(() => {
      wx.hideLoading();
      this.setData({
        isSavingWork: false,
        saveButtonText: "保存到我的作品"
      });
    }, () => {
      wx.hideLoading();
      this.setData({
        isSavingWork: false,
        saveButtonText: "保存到我的作品"
      });
    });
  },

  retryLoad() {
    this.loadTemplateDetail(this.data.templateId);
  }
});
