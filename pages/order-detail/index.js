const store = require("../../utils/store");
const orderApi = require("../../utils/order-api");

const STATUS_CLASS = {
  pending_payment: "orange",
  pending_shipment: "green",
  closed: "gray"
};

const ACTION_LABELS = {
  payAction: "支付",
  pdfAction: "PDF",
  fulfillmentAction: "履约"
};

function buildOrderViewState(order) {
  const address = order.addressSnapshot || null;
  const workSnapshot = order.workSnapshot || {};
  const productionReadiness = order.productionReadiness || store.buildOrderProductionReadiness(order);
  const actionAvailability = order.actionAvailability || store.buildOrderActionAvailability(Object.assign({}, order, {
    productionReadiness
  }));
  const readinessChecks = (productionReadiness.checks || []).map((item) => {
    return Object.assign({}, item, {
      statusText: item.passed ? "已满足" : "待补齐",
      statusClass: item.passed ? "green" : "gray",
      displayText: item.passed ? item.description : (item.blocker || item.description)
    });
  });
  const placeholderActions = Object.keys(ACTION_LABELS).map((key) => {
    const action = actionAvailability[key];
    return {
      key,
      label: ACTION_LABELS[key],
      canTap: key === "payAction",
      enabled: !!(action && action.enabled),
      blocked: !!(action && action.blocked),
      requiredChecksText: action && Array.isArray(action.requiredChecks)
        ? action.requiredChecks.join(" / ")
        : "",
      hint: action && action.reason
        ? action.reason
        : "当前动作信息还没有准备好。"
    };
  }).filter((item) => {
    const action = actionAvailability[item.key];
    return !!(action && action.visible);
  });
  return Object.assign({}, order, {
    createdText: store.formatDate(order.createdAt),
    updatedText: store.formatDate(order.updatedAt),
    amountText: store.formatPrice(order.amount),
    unitPriceText: store.formatPrice(order.unitPrice || 0),
    quantityText: `${order.quantity} 本`,
    statusClass: STATUS_CLASS[order.statusCode] || "gray",
    statusNote: order.statusHint,
    addressText: address
      ? `${address.name} ${address.phone}\n${address.region} ${address.detail}`
      : "还没有收货地址快照",
    workMetaText: `${workSnapshot.templateName || order.templateName} · ${(workSnapshot.generatedPageCount || 0)} 页预览 · ${(workSnapshot.photoCount || 0)} 张照片`,
    canClose: order.statusCode === store.ORDER_STATUS.pendingPayment.code,
    productionReadiness,
    readinessChecks,
    actionAvailability,
    statusPromptTitle: order.statusCode === store.ORDER_STATUS.pendingPayment.code
      ? "这笔订单还在待支付阶段"
      : productionReadiness.ready
        ? "这笔订单的后续准备已经齐了"
        : "这笔订单还不能继续往后生产",
    statusPromptText: order.statusCode === store.ORDER_STATUS.pendingPayment.code
      ? "当前支付能力还没有正式接通，点击“支付”只会进入占位说明，不会真的扣款；订单状态也会继续保持在待支付。"
      : productionReadiness.ready
        ? "当前图片、作品快照、模板版本和地址都已经齐全，后续接入支付、PDF 和履约时可以直接继续。"
        : productionReadiness.description,
    placeholderActions
  });
}

Page({
  data: {
    loading: true,
    loadFailed: false,
    errorText: "",
    order: null,
    actionFeedback: null
  },

  onLoad(options) {
    this.loadOrder(options.id || "");
  },

  loadOrder(id) {
    if (!id) {
      this.setData({
        loading: false,
        loadFailed: true,
        errorText: "订单参数缺失，请从订单列表重新进入。"
      });
      return;
    }

    orderApi.getOrderDetail(id)
      .then((order) => {
        this.setData({
          loading: false,
          loadFailed: false,
          errorText: "",
          order: buildOrderViewState(order),
          actionFeedback: null
        });
      })
      .catch((error) => {
        const cachedOrder = store.getOrderById(id);
        if (cachedOrder) {
          this.setData({
            loading: false,
            loadFailed: false,
            errorText: "",
            order: buildOrderViewState(cachedOrder),
            actionFeedback: null
          });
          wx.showToast({
            title: error.message || "订单读取失败，先展示本地缓存",
            icon: "none"
          });
          return;
        }
        this.setData({
          loading: false,
          loadFailed: true,
          errorText: error.message || "订单暂时没有找到，可能已经被删除。"
        });
      });
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.redirectTo({ url: "/pages/order-list/index" });
      }
    });
  },

  handlePayAction() {
    if (!this.data.order) {
      return;
    }
    orderApi.openPayAction(this.data.order.id)
      .then((result) => {
        this.setData({
          actionFeedback: {
            type: result.blocked ? "error" : "success",
            title: result.placeholderTitle,
            message: `${result.message} ${result.nextStepHint}`
          }
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.message || "支付入口暂时不可用",
          icon: "none"
        });
      });
  },

  closeOrder() {
    if (!this.data.order || !this.data.order.canClose) {
      return;
    }
    wx.showModal({
      title: "关闭订单？",
      content: "关闭后会保留订单记录，这一步当前只做取消占位，不会触发真实退款。",
      confirmText: "关闭订单",
      confirmColor: "#B45849",
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        orderApi.closeOrder(this.data.order.id)
          .then(() => {
            wx.showToast({ title: "订单已关闭", icon: "success" });
            this.loadOrder(this.data.order.id);
          })
          .catch((error) => {
            wx.showToast({
              title: error.message || "关闭订单失败",
              icon: "none"
            });
          });
      }
    });
  },

  openWorkPreview() {
    if (!this.data.order) {
      return;
    }
    wx.navigateTo({
      url: `/pages/preview/index?id=${this.data.order.workId}`
    });
  }
});
