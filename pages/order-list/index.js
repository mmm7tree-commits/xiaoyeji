const store = require("../../utils/store");
const orderApi = require("../../utils/order-api");

const FILTERS = [
  { code: "all", label: "全部", status: "" },
  { code: "pending_payment", label: "待支付", status: "待支付" },
  { code: "pending_shipment", label: "待发货", status: "待发货" },
  { code: "closed", label: "已关闭", status: "已关闭" }
];

const STATUS_CLASS = {
  pending_payment: "orange",
  pending_shipment: "green",
  closed: "gray"
};

function formatOrder(order) {
  const workSnapshot = order.workSnapshot || {};
  return Object.assign({}, order, {
    amountText: store.formatPrice(order.amount),
    createdText: store.formatDate(order.createdAt),
    quantityText: `${order.quantity} 本`,
    statusClass: STATUS_CLASS[order.statusCode] || "gray",
    previewMetaText: `${workSnapshot.templateName || order.templateName} · ${(workSnapshot.generatedPageCount || 0)} 页预览 · ${(workSnapshot.photoCount || 0)} 张照片`,
    nextStepText: order.statusCode === store.ORDER_STATUS.pendingPayment.code
      ? "支付入口待接入，当前先保留待支付状态。"
      : order.statusCode === store.ORDER_STATUS.pendingShipment.code
        ? "待发货当前只是未来状态占位，M11 还没有接入真实支付。"
        : "订单已关闭，当前保留历史记录。"
  });
}

function buildFilterState(orders, activeCode) {
  return FILTERS.map((filter) => {
    const count = filter.code === "all"
      ? orders.length
      : orders.filter((order) => order.statusCode === filter.code).length;
    return {
      code: filter.code,
      label: filter.label,
      count,
      activeClass: filter.code === activeCode ? "active" : ""
    };
  });
}

Page({
  data: {
    loggedIn: false,
    showLoginButton: true,
    filters: [],
    activeFilter: "all",
    orders: [],
    visibleOrders: [],
    emptyTitle: "还没有订单",
    emptyText: "从待下单作品进入确认订单页后，就会在这里看到订单记录。"
  },

  onLoad(options) {
    const activeFilter = options.status || "all";
    this.setData({
      activeFilter: FILTERS.some((item) => item.code === activeFilter) ? activeFilter : "all"
    });
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    const profile = store.getUserProfile();
    if (!profile) {
      this.setData({
        loggedIn: false,
        showLoginButton: true,
        orders: [],
        visibleOrders: [],
        filters: buildFilterState([], this.data.activeFilter),
        emptyTitle: "还没有订单",
        emptyText: "登录后可以查看自己的订单记录。"
      });
      return;
    }
    orderApi.getOrderList()
      .then((orders) => {
        this.applyOrderState(orders.map(formatOrder), true);
      })
      .catch((error) => {
        const orders = store.getOrders().map(formatOrder);
        this.applyOrderState(orders, true);
        wx.showToast({
          title: error.message || "订单加载失败，先展示本地缓存",
          icon: "none"
        });
      });
  },

  applyOrderState(orders, loggedIn) {
    const visibleOrders = this.filterOrders(orders, this.data.activeFilter);
    this.setData({
      loggedIn: !!loggedIn,
      showLoginButton: !loggedIn,
      orders,
      visibleOrders,
      filters: buildFilterState(orders, this.data.activeFilter),
      emptyTitle: this.data.activeFilter === "all" ? "还没有订单" : `暂无${this.getFilterLabel(this.data.activeFilter)}订单`,
      emptyText: this.data.activeFilter === "all"
        ? "从待下单作品进入确认订单页后，就会在这里看到订单记录。"
        : "可以先切换到其他状态看看，或者继续去完善作品。"
    });
  },

  getFilterLabel(code) {
    const filter = FILTERS.find((item) => item.code === code);
    return filter ? filter.label : "该状态";
  },

  filterOrders(orders, activeCode) {
    if (activeCode === "all") {
      return orders;
    }
    return orders.filter((order) => order.statusCode === activeCode);
  },

  switchFilter(event) {
    const activeFilter = event.currentTarget.dataset.code;
    this.setData({
      activeFilter,
      visibleOrders: this.filterOrders(this.data.orders, activeFilter),
      filters: buildFilterState(this.data.orders, activeFilter),
      emptyTitle: activeFilter === "all" ? "还没有订单" : `暂无${this.getFilterLabel(activeFilter)}订单`,
      emptyText: activeFilter === "all"
        ? "从待下单作品进入确认订单页后，就会在这里看到订单记录。"
        : "可以先切换到其他状态看看，或者继续去完善作品。"
    });
  },

  authorizeProfile() {
    wx.getUserProfile({
      desc: "用于展示头像和昵称，方便查看自己的订单",
      success: (res) => {
        store.saveUserProfile(res.userInfo);
        wx.showToast({ title: "登录成功", icon: "success" });
        this.loadOrders();
      },
      fail: () => {
        wx.showToast({ title: "登录后可查看订单", icon: "none" });
      }
    });
  },

  openOrderDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/index?id=${id}`
    });
  },

  goWorks() {
    wx.switchTab({ url: "/pages/works/index" });
  },

  goProfile() {
    wx.switchTab({ url: "/pages/profile/index" });
  }
});
