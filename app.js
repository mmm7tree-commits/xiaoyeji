const store = require("./utils/store");

function serializeError(error) {
  if (!error) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error.message || error.stack) {
    return JSON.stringify({
      message: error.message || "",
      stack: error.stack || ""
    });
  }
  try {
    return JSON.stringify(error);
  } catch (jsonError) {
    return String(error);
  }
}

App({
  globalData: {
    productName: "小页记",
    servicePhone: "400-618-0520"
  },

  onLaunch() {
    try {
      console.info("app launch");
      store.ensureSeedData();
      console.info("storage ready");
    } catch (error) {
      console.error("launch error", serializeError(error), error);
    }
  },

  onError(error) {
    console.error("app error", serializeError(error), error);
  },

  onUnhandledRejection(result) {
    console.error("unhandled rejection", serializeError(result && result.reason), result);
  },

  onPageNotFound(result) {
    console.error("page not found", serializeError(result), result);
  },

  getProfile() {
    return store.getUserProfile();
  },

  saveProfile(profile) {
    return store.saveUserProfile(profile);
  }
});
