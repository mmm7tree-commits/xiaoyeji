const store = require("../../utils/store");
const orderApi = require("../../utils/order-api");

function buildStatusCards(orders) {
  const cards = [
    {
      code: "all",
      label: "全部",
      count: orders.length,
      hint: "所有订单"
    },
    {
      code: "pending_payment",
      label: "待支付",
      count: orders.filter((order) => order.statusCode === store.ORDER_STATUS.pendingPayment.code).length,
      hint: "后续会在这里接支付"
    },
    {
      code: "pending_shipment",
      label: "待发货",
      count: orders.filter((order) => order.statusCode === store.ORDER_STATUS.pendingShipment.code).length,
      hint: "未来状态占位"
    },
    {
      code: "closed",
      label: "已关闭",
      count: orders.filter((order) => order.statusCode === store.ORDER_STATUS.closed.code).length,
      hint: "取消或超时关闭"
    }
  ];
  return cards.map((card) => {
    return Object.assign({}, card, {
      countText: `${card.count}`
    });
  });
}

Page({
  data: {
    profile: null,
    profileName: "欢迎来到小页记",
    profileText: "登录后可查看自己的作品、订单和地址。",
    hasAvatar: false,
    loggedIn: false,
    showLoginButton: true,
    servicePhone: "",
    statusCards: [],
    worksCountText: "0 本作品",
    ordersCountText: "0 个订单",
    addressStatusText: "还没有默认地址"
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    const profile = store.getUserProfile();
    const works = store.getWorks();
    const defaultAddress = store.getDefaultAddress();
    const applyState = (orders) => {
      this.setData({
        profile,
        profileName: profile ? profile.nickName : "欢迎来到小页记",
        profileText: profile ? "愿每一页都留住今天的光，也把常用入口都收在这里。" : "登录后可查看自己的作品、订单和地址。",
        hasAvatar: !!(profile && profile.avatarUrl),
        loggedIn: !!profile,
        showLoginButton: !profile,
        servicePhone: getApp().globalData.servicePhone,
        statusCards: buildStatusCards(orders),
        worksCountText: `${works.length} 本作品`,
        ordersCountText: `${orders.length} 个订单`,
        addressStatusText: defaultAddress ? "已设置默认地址" : "还没有默认地址"
      });
    };

    if (!profile) {
      applyState([]);
      return;
    }

    orderApi.getOrderList()
      .then((orders) => {
        applyState(orders);
      })
      .catch(() => {
        applyState(store.getOrders());
      });
  },

  ensureLogin(actionText) {
    if (this.data.loggedIn) {
      return true;
    }
    wx.showToast({
      title: actionText || "请先登录",
      icon: "none"
    });
    return false;
  },

  openOrderList(event) {
    if (!this.ensureLogin("请先登录后查看订单")) {
      return;
    }
    const status = event.currentTarget.dataset.status || "all";
    wx.navigateTo({
      url: `/pages/order-list/index?status=${status}`
    });
  },

  authorizeProfile() {
    wx.getUserProfile({
      desc: "用于展示头像和昵称，方便查看自己的订单",
      success: (res) => {
        store.saveUserProfile(res.userInfo);
        wx.showToast({ title: "登录成功", icon: "success" });
        this.loadProfile();
      },
      fail: () => {
        wx.showToast({ title: "授权后可查看订单", icon: "none" });
      }
    });
  },

  goWorks() {
    wx.switchTab({ url: "/pages/works/index" });
  },

  goAddress() {
    if (!this.ensureLogin("请先登录后管理地址")) {
      return;
    }
    wx.navigateTo({ url: "/pages/address/index" });
  },

  callService() {
    wx.makePhoneCall({
      phoneNumber: this.data.servicePhone
    });
  },

  goAdmin() {
    wx.navigateTo({ url: "/pages/admin/dashboard/index" });
  }
});
