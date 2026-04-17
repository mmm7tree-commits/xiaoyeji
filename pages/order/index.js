const store = require("../../utils/store");
const workApi = require("../../utils/work-api");
const addressApi = require("../../utils/address-api");
const orderApi = require("../../utils/order-api");

function getDefaultAddress(addresses) {
  return (Array.isArray(addresses) ? addresses : []).find((item) => item.isDefault) || null;
}

Page({
  data: {
    workId: "",
    work: null,
    loading: true,
    addressLoading: false,
    address: null,
    hasAddress: false,
    addressLinkText: "去填写",
    quantity: 1,
    remark: "",
    unitPriceText: "",
    amountText: "",
    isSubmitting: false,
    submitButtonText: "生成订单",
    addressHintText: "请先新增或设置一个默认地址，再继续生成订单。",
    orderHintText: "当前先生成订单并保留待支付状态，支付能力将在后续里程碑接入。",
    assetReady: false,
    assetHintText: "",
    templateVersionText: "",
    templateSourceText: ""
  },

  updateViewState(extraData) {
    const nextData = Object.assign({}, this.data, extraData);
    this.setData(Object.assign({}, extraData, {
      hasAddress: !!nextData.address,
      addressLinkText: nextData.address ? "管理" : "去填写",
      submitButtonText: nextData.isSubmitting ? "提交中" : "生成订单"
    }));
  },

  onLoad(options) {
    const workId = String(options.workId || "").trim();
    if (!workId) {
      wx.showToast({ title: "作品不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    this.setData({ workId });
    this.loadWorkDetail(workId);
  },

  onShow() {
    if (!this.data.workId) {
      return;
    }
    this.loadAddressList();
  },

  loadWorkDetail(workId) {
    this.updateViewState({ loading: true });
    workApi.getWorkDetail(workId)
      .then((work) => {
        this.applyWorkState(work);
      })
      .catch((error) => {
        const cachedWork = store.getWorkById(workId);
        if (cachedWork) {
          this.applyWorkState(cachedWork);
          wx.showToast({
            title: error.message || "作品读取失败，先展示本地缓存",
            icon: "none"
          });
          return;
        }
        wx.showToast({
          title: error.message || "作品不存在",
          icon: "none"
        });
        setTimeout(() => wx.navigateBack(), 800);
      });
  },

  applyWorkState(work) {
    if (!work) {
      return;
    }
    if (!store.canWorkCreateOrder(work)) {
      wx.showToast({ title: "这本作品还没准备好下单", icon: "none" });
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/work-detail/index?id=${work.id}` });
      }, 600);
      return;
    }
    const templateVersionText = work.templateVersionNo
      ? `模板版本 V${work.templateVersionNo}`
      : "模板版本待补充";
    const templateSourceText = work.templateSourceMode === "admin_published"
      ? "已使用后台已发布模板版本"
      : "当前使用本地模板兜底版本";
    const assetReady = store.areWorkAssetsReady(work);
    const assetHintText = assetReady
      ? "这本作品的图片已经同步到服务端，后续可用于跨设备查看与履约。"
      : "这本作品的图片还没有全部同步到服务端，请返回作品重新保存后再下单。";
    this.updateViewState({
      loading: false,
      work,
      assetReady,
      assetHintText,
      templateVersionText,
      templateSourceText
    });
    this.refreshAmount();
  },

  loadAddressList() {
    this.updateViewState({ addressLoading: true });
    addressApi.getAddressList()
      .then((addresses) => {
        this.updateViewState({
          addressLoading: false,
          address: getDefaultAddress(addresses)
        });
      })
      .catch((error) => {
        this.updateViewState({
          addressLoading: false,
          address: store.getDefaultAddress()
        });
        wx.showToast({
          title: error.message || "地址读取失败，先展示本地缓存",
          icon: "none"
        });
      });
  },

  refreshAmount() {
    if (!this.data.work) {
      return;
    }
    this.setData({
      unitPriceText: store.formatPrice(this.data.work.price),
      amountText: store.formatPrice(this.data.work.price * this.data.quantity)
    });
  },

  decreaseQuantity() {
    if (this.data.quantity <= 1) {
      return;
    }
    this.setData({ quantity: this.data.quantity - 1 });
    this.refreshAmount();
  },

  increaseQuantity() {
    if (this.data.quantity >= 99) {
      wx.showToast({ title: "单次最多 99 本", icon: "none" });
      return;
    }
    this.setData({ quantity: this.data.quantity + 1 });
    this.refreshAmount();
  },

  inputRemark(event) {
    this.setData({ remark: event.detail.value });
  },

  manageAddress() {
    wx.navigateTo({ url: "/pages/address/index?from=order" });
  },

  submitOrder() {
    if (this.data.isSubmitting) {
      return;
    }
    if (!this.data.work) {
      wx.showToast({ title: "作品信息还没准备好", icon: "none" });
      return;
    }
    if (!this.data.assetReady) {
      wx.showToast({ title: "请先同步作品图片后再下单", icon: "none" });
      return;
    }
    if (!this.data.address) {
      wx.showToast({ title: "请先填写收货地址", icon: "none" });
      return;
    }
    this.updateViewState({ isSubmitting: true });
    orderApi.createOrder({
      workId: this.data.work.id,
      addressId: this.data.address.id,
      quantity: this.data.quantity,
      remark: this.data.remark
    }).then((order) => {
      wx.showToast({
        title: "订单已生成",
        icon: "success"
      });
      this.updateViewState({ isSubmitting: false });
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/order-detail/index?id=${order.id}` });
      }, 500);
    }).catch((error) => {
      this.updateViewState({ isSubmitting: false });
      wx.showToast({
        title: error.message || "订单生成失败，请稍后再试",
        icon: "none"
      });
    });
  }
});
