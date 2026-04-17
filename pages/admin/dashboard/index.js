const store = require("../../../utils/store");

const PERIODS = [
  { key: "day", label: "按天" },
  { key: "week", label: "按周" },
  { key: "month", label: "按月" }
];

function decoratePeriods(activePeriod) {
  return PERIODS.map((period) => {
    return Object.assign({}, period, {
      activeClass: period.key === activePeriod ? "active" : ""
    });
  });
}

function formatTemplate(template) {
  return Object.assign({}, template, {
    priceText: store.formatPrice(template.price)
  });
}

function formatWork(work) {
  return Object.assign({}, work, {
    createdText: store.formatDate(work.createdAt),
    photoCountText: `${work.photos.length} 张照片`
  });
}

function formatOrder(order) {
  return Object.assign({}, order, {
    amountText: store.formatPrice(order.amount),
    createdText: store.formatDate(order.createdAt)
  });
}

Page({
  data: {
    periods: decoratePeriods("day"),
    activePeriod: "day",
    summaryCards: [],
    templates: [],
    templateOptions: [],
    works: [],
    visibleWorks: [],
    orders: [],
    visibleOrders: [],
    activeWorkTemplate: "all",
    activeWorkTemplateIndex: 0,
    activeWorkTemplateName: "全部模板",
    activeOrderTemplate: "all",
    activeOrderTemplateIndex: 0,
    activeOrderTemplateName: "全部模板"
  },

  onShow() {
    this.loadDashboard();
  },

  loadDashboard() {
    const templates = store.getTemplates().map(formatTemplate);
    const templateOptions = [{ id: "all", name: "全部模板" }].concat(templates.map((template) => {
      return { id: template.id, name: template.name };
    }));
    const works = store.getWorks().map(formatWork);
    const orders = store.getOrders().map(formatOrder);
    const workOption = this.getTemplateOption(templateOptions, this.data.activeWorkTemplateIndex);
    const orderOption = this.getTemplateOption(templateOptions, this.data.activeOrderTemplateIndex);
    this.setData({
      periods: decoratePeriods(this.data.activePeriod),
      summaryCards: this.getSummaryCards(this.data.activePeriod),
      templates,
      templateOptions,
      works,
      visibleWorks: this.filterByTemplate(works, this.data.activeWorkTemplate),
      orders,
      visibleOrders: this.filterByTemplate(orders, this.data.activeOrderTemplate),
      activeWorkTemplateName: workOption.name,
      activeOrderTemplateName: orderOption.name
    });
  },

  getTemplateOption(templateOptions, index) {
    return templateOptions[index] || templateOptions[0] || { id: "all", name: "全部模板" };
  },

  filterByTemplate(items, templateId) {
    if (templateId === "all") {
      return items;
    }
    return items.filter((item) => item.templateId === templateId);
  },

  getSummaryCards(period) {
    const summary = store.getAdminSummary();
    const multiplier = period === "month" ? 6 : period === "week" ? 3 : 1;
    return [
      { label: "注册人数", value: summary.registeredUsers * multiplier },
      { label: "访问人数", value: summary.visitors * multiplier },
      { label: "生成作品数", value: summary.generatedWorks * multiplier },
      { label: "下单数", value: summary.orderCount * multiplier }
    ];
  },

  switchPeriod(event) {
    const activePeriod = event.currentTarget.dataset.key;
    this.setData({
      activePeriod,
      periods: decoratePeriods(activePeriod),
      summaryCards: this.getSummaryCards(activePeriod)
    });
  },

  switchWorkTemplate(event) {
    const index = Number(event.detail.value);
    const option = this.getTemplateOption(this.data.templateOptions, index);
    this.setData({
      activeWorkTemplate: option.id,
      activeWorkTemplateIndex: index,
      activeWorkTemplateName: option.name,
      visibleWorks: this.filterByTemplate(this.data.works, option.id)
    });
  },

  switchOrderTemplate(event) {
    const index = Number(event.detail.value);
    const option = this.getTemplateOption(this.data.templateOptions, index);
    this.setData({
      activeOrderTemplate: option.id,
      activeOrderTemplateIndex: index,
      activeOrderTemplateName: option.name,
      visibleOrders: this.filterByTemplate(this.data.orders, option.id)
    });
  },

  editTemplate(event) {
    const name = event.currentTarget.dataset.name;
    wx.showModal({
      title: "模板维护",
      content: `${name} 的名称、图片、描述、价格后续建议接入后台表单与素材库。`,
      showCancel: false
    });
  },

  downloadPdf(event) {
    const orderNo = event.currentTarget.dataset.order;
    wx.showModal({
      title: "下载打印 PDF",
      content: `订单 ${orderNo} 的高清 PDF 需由服务端使用原图生成并返回下载地址。`,
      showCancel: false
    });
  },

  batchDownloadPdf() {
    if (!this.data.visibleOrders.length) {
      wx.showToast({ title: "暂无订单可下载", icon: "none" });
      return;
    }
    wx.showModal({
      title: "批量下载 PDF",
      content: `将按当前筛选结果处理 ${this.data.visibleOrders.length} 个订单。正式后台建议生成 ZIP 包，避免在小程序端直接处理大文件。`,
      showCancel: false
    });
  }
});
