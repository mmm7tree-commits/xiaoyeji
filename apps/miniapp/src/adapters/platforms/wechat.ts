import type { PlatformAdapter } from "../types";

export const wechatAdapter: PlatformAdapter = {
  platform: "wechat",
  async getPlatformCode() {
    return {
      code: "",
      platform: "wechat"
    };
  },
  getRuntimeName() {
    return "微信小程序";
  }
};
