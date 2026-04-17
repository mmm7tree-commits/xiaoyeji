const store = require("../../utils/store");
const addressApi = require("../../utils/address-api");

Page({
  data: {
    addresses: [],
    editingId: "",
    returnToOrder: false,
    form: {
      name: "",
      phone: "",
      region: [],
      detail: "",
      isDefault: false
    },
    regionText: "",
    regionDisplayText: "选择省市区",
    formTitle: "新增地址",
    submitText: "保存地址",
    canCancelEdit: false,
    loading: false
  },

  onLoad(options) {
    this.setData({
      returnToOrder: options.from === "order"
    });
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    this.setData({ loading: true });
    addressApi.getAddressList()
      .then((addresses) => {
        this.setData({
          addresses,
          loading: false
        });
        if (!this.data.editingId && !addresses.length) {
          this.setData({
            "form.isDefault": true
          });
        }
      })
      .catch((error) => {
        const addresses = store.getAddresses();
        this.setData({
          addresses,
          loading: false
        });
        if (!this.data.editingId && !addresses.length) {
          this.setData({
            "form.isDefault": true
          });
        }
        wx.showToast({
          title: error.message || "地址加载失败，先展示本地缓存",
          icon: "none"
        });
      });
  },

  inputField(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  changeDefaultSwitch(event) {
    this.setData({
      "form.isDefault": !!event.detail.value
    });
  },

  changeRegion(event) {
    this.setData({
      "form.region": event.detail.value,
      regionText: event.detail.value.join(" / "),
      regionDisplayText: event.detail.value.join(" / ")
    });
  },

  importWechatAddress() {
    wx.chooseAddress({
      success: (res) => {
        addressApi.createAddress({
          name: res.userName,
          phone: res.telNumber,
          region: `${res.provinceName}${res.cityName}${res.countyName}`,
          regionParts: [res.provinceName, res.cityName, res.countyName],
          detail: res.detailInfo,
          isDefault: !this.data.addresses.length
        }).then(() => {
          this.loadAddresses();
          wx.showToast({ title: "已导入地址", icon: "success" });
          this.returnAfterSelection();
        }).catch((error) => {
          wx.showToast({ title: error.message || "导入地址失败", icon: "none" });
        });
      },
      fail: () => {
        wx.showToast({ title: "可手动填写地址", icon: "none" });
      }
    });
  },

  saveManualAddress() {
    const form = this.data.form;
    const name = form.name.trim();
    const phone = form.phone.trim();
    const detail = form.detail.trim();
    const regionValue = form.region.length ? form.region.join("") : this.data.regionText.split(" / ").join("");
    if (!name || !phone || !regionValue || !detail) {
      wx.showToast({ title: "请补全地址信息", icon: "none" });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: "请填写正确手机号", icon: "none" });
      return;
    }
    const action = this.data.editingId
      ? addressApi.updateAddress(this.data.editingId, {
        name,
        phone,
        region: regionValue,
        regionParts: form.region,
        detail,
        isDefault: !!form.isDefault
      })
      : addressApi.createAddress({
        name,
        phone,
        region: regionValue,
        regionParts: form.region,
        detail,
        isDefault: !!form.isDefault
      });
    action.then(() => {
      this.resetForm();
      this.loadAddresses();
      wx.showToast({ title: "地址已保存", icon: "success" });
      this.returnAfterSelection();
    }).catch((error) => {
      wx.showToast({ title: error.message || "地址保存失败", icon: "none" });
    });
  },

  resetForm() {
    this.setData({
      editingId: "",
      form: {
        name: "",
        phone: "",
        region: [],
        detail: "",
        isDefault: this.data.addresses.length === 0
      },
      regionText: "",
      regionDisplayText: "选择省市区",
      formTitle: "新增地址",
      submitText: "保存地址",
      canCancelEdit: false
    });
  },

  editAddress(event) {
    const id = event.currentTarget.dataset.id;
    const target = store.getAddressById(id);
    if (!target) {
      return;
    }
    this.setData({
      editingId: target.id,
      form: {
        name: target.name,
        phone: target.phone,
        region: target.regionParts || [],
        detail: target.detail,
        isDefault: !!target.isDefault
      },
      regionText: (target.regionParts || []).length ? (target.regionParts || []).join(" / ") : (target.region || ""),
      regionDisplayText: (target.regionParts || []).length ? (target.regionParts || []).join(" / ") : (target.region || "选择省市区"),
      formTitle: "编辑地址",
      submitText: "更新地址",
      canCancelEdit: true
    });
  },

  cancelEdit() {
    this.resetForm();
  },

  setDefaultAddress(event) {
    const id = event.currentTarget.dataset.id;
    addressApi.setDefaultAddress(id)
      .then(() => {
        this.loadAddresses();
        wx.showToast({ title: "已设为默认地址", icon: "success" });
        this.returnAfterSelection();
      })
      .catch((error) => {
        wx.showToast({ title: error.message || "默认地址设置失败", icon: "none" });
      });
  },

  deleteAddress(event) {
    const id = event.currentTarget.dataset.id;
    wx.showModal({
      title: "删除地址？",
      content: "删除后下单时需要重新填写收货地址。",
      confirmText: "删除",
      confirmColor: "#B45849",
      success: (res) => {
        if (res.confirm) {
          addressApi.deleteAddress(id)
            .then(() => {
              this.loadAddresses();
              if (this.data.editingId === id) {
                this.resetForm();
              }
              wx.showToast({ title: "地址已删除", icon: "success" });
            })
            .catch((error) => {
              wx.showToast({ title: error.message || "删除地址失败", icon: "none" });
            });
        }
      }
    });
  },

  returnAfterSelection() {
    if (!this.data.returnToOrder) {
      return;
    }
    setTimeout(() => {
      wx.navigateBack();
    }, 400);
  }
});
