const store = require("../../utils/store");
const workApi = require("../../utils/work-api");

const FILTERS = [
  { code: "all", label: "全部作品" },
  { code: store.WORK_STATUS.draft.code, label: store.WORK_STATUS.draft.label },
  { code: store.WORK_STATUS.ready.code, label: store.WORK_STATUS.ready.label }
];

function formatWork(work) {
  const coverPhoto = work.coverPhoto || (work.photos && work.photos[0] ? work.photos[0].path : "");
  return Object.assign({}, work, {
    coverPhoto,
    createdText: store.formatDate(work.createdAt),
    photoCountText: `${work.photoCount || (work.photos || []).length} 张照片`,
    pageCountText: `${work.pageCount || 0} 页预览`,
    statusText: work.statusText || work.status || "继续补充"
  });
}

Page({
  data: {
    works: [],
    filteredWorks: [],
    filters: FILTERS,
    activeFilter: "all",
    summaryText: "先把草稿保存下来，后面可以继续回看和补充。",
    loading: false
  },

  onShow() {
    this.loadWorks();
  },

  loadWorks() {
    this.setData({ loading: true });
    workApi.getWorkList()
      .then((works) => {
        const formattedWorks = works.map(formatWork);
        this.setData({
          works: formattedWorks,
          loading: false
        });
        this.applyFilter(this.data.activeFilter, formattedWorks);
      })
      .catch((error) => {
        const cachedWorks = store.getWorks().map(formatWork);
        this.setData({
          works: cachedWorks,
          loading: false
        });
        this.applyFilter(this.data.activeFilter, cachedWorks);
        wx.showToast({
          title: error.message || "作品列表加载失败，先展示本地缓存",
          icon: "none"
        });
      });
  },

  applyFilter(filterCode, sourceWorks) {
    const works = Array.isArray(sourceWorks) ? sourceWorks : this.data.works;
    const filteredWorks = filterCode === "all"
      ? works
      : works.filter((item) => item.statusCode === filterCode);
    const summaryText = filterCode === "all"
      ? `共保存了 ${works.length} 本作品。`
      : `当前有 ${filteredWorks.length} 本“${FILTERS.find((item) => item.code === filterCode).label}”作品。`;
    this.setData({
      activeFilter: filterCode,
      filteredWorks,
      summaryText
    });
  },

  switchFilter(event) {
    const filterCode = event.currentTarget.dataset.code;
    this.applyFilter(filterCode);
  },

  openWorkDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/work-detail/index?id=${id}`
    });
  },

  previewWork(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/preview/index?id=${id}`
    });
  },

  deleteWork(event) {
    const id = event.currentTarget.dataset.id;
    wx.showModal({
      title: "删除作品？",
      content: "删除后，这本作品会从当前设备和当前后端草稿列表里一起移除。",
      confirmText: "删除",
      confirmColor: "#B45849",
      success: (res) => {
        if (res.confirm) {
          workApi.deleteWork(id)
            .then(() => {
              this.loadWorks();
              wx.showToast({ title: "已删除", icon: "success" });
            })
            .catch((error) => {
              wx.showToast({
                title: error.message || "删除失败，请稍后再试",
                icon: "none"
              });
            });
        }
      }
    });
  },

  goHome() {
    wx.switchTab({ url: "/pages/home/index" });
  }
});
