const STORAGE_KEY = "xiaoyeji_client_id";

function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getClientId() {
  let clientId = wx.getStorageSync(STORAGE_KEY);
  if (clientId) {
    return clientId;
  }

  clientId = generateClientId();
  wx.setStorageSync(STORAGE_KEY, clientId);
  return clientId;
}

module.exports = {
  getClientId
};
