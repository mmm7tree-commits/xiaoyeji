const store = require("../../utils/store");
const workApi = require("../../utils/work-api");

function buildDetailViewState(work) {
  const photoCount = work.photoCount || (work.photos || []).length;
  const canBeOrdered = store.canWorkCreateOrder(work);
  return Object.assign({}, work, {
    coverPhoto: work.photos && work.photos[0] ? work.photos[0].path : "",
    createdText: store.formatDate(work.createdAt),
    updatedText: store.formatDate(work.updatedAt),
    photoCountText: `${photoCount} 张照片`,
    generatedPageCountText: `${work.pageCount || 0} 页预览`,
    suggestedRuleText: `建议至少准备 ${work.suggestedMinPhotos || 1} 张照片，这样能看到更完整的页面。`,
    saveRuleText: canBeOrdered
      ? `已经达到待下单作品的最少张数：${work.orderMinPhotos || 1} 张。`
      : `还差 ${Math.max((work.orderMinPhotos || 1) - photoCount, 0)} 张照片，才能成为待下单作品。`,
    statusHintText: canBeOrdered
      ? "这本作品已经准备好了，后面可以继续进入下单链路。"
      : "这本作品先按“继续补充”保存，后面补图后还可以再保存一次。"
  });
}

Page({
  data: {
    loading: true,
    loadFailed: false,
    errorText: "",
    work: null
  },

  onLoad(options) {
    this.loadWork(options.id || "");
  },

  loadWork(id) {
    if (!id) {
      this.setData({
        loading: false,
        loadFailed: true,
        errorText: "作品参数缺失，请返回作品列表重新进入。"
      });
      return;
    }

    workApi.getWorkDetail(id)
      .then((work) => {
        this.setData({
          loading: false,
          loadFailed: false,
          errorText: "",
          work: buildDetailViewState(work)
        });
      })
      .catch((error) => {
        const cachedWork = store.getWorkById(id);
        if (cachedWork) {
          this.setData({
            loading: false,
            loadFailed: false,
            errorText: "",
            work: buildDetailViewState(cachedWork)
          });
          wx.showToast({
            title: "当前先展示本地缓存作品",
            icon: "none"
          });
          return;
        }

        this.setData({
          loading: false,
          loadFailed: true,
          errorText: error.message || "这本作品没有找到，可能已经被删除。"
        });
      });
  },

  openPreview() {
    if (!this.data.work) {
      return;
    }
    wx.navigateTo({
      url: `/pages/preview/index?id=${this.data.work.id}`
    });
  },

  openOrder() {
    if (!this.data.work || !store.canWorkCreateOrder(this.data.work)) {
      wx.showToast({ title: "还没达到待下单条件", icon: "none" });
      return;
    }
    wx.navigateTo({
      url: `/pages/order/index?workId=${this.data.work.id}`
    });
  },

  backWorks() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({ url: "/pages/works/index" });
      }
    });
  }
});
