const runtime = require("../config/legacy-runtime");
const clientIdentity = require("./client-identity");

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${runtime.apiBaseUrl}${options.path}`,
      method: options.method || "GET",
      data: options.data || {},
      header: Object.assign({
        "X-Xiaoyeji-Client-Id": clientIdentity.getClientId()
      }, options.header || {}),
      success: (response) => {
        const payload = response.data || {};

        if (response.statusCode >= 200 && response.statusCode < 300 && payload.ok) {
          resolve(payload.data);
          return;
        }

        reject(new Error(payload.message || "请求失败，请稍后再试"));
      },
      fail: () => {
        reject(new Error("网络连接失败，请确认本地服务已启动"));
      }
    });
  });
}

module.exports = {
  request
};
