const STORAGE_KEY = "xiaoyeji_selected_template_id";

function getSelectedTemplateId() {
  return wx.getStorageSync(STORAGE_KEY) || "";
}

function saveSelectedTemplateId(templateId) {
  wx.setStorageSync(STORAGE_KEY, templateId || "");
}

module.exports = {
  getSelectedTemplateId,
  saveSelectedTemplateId
};
