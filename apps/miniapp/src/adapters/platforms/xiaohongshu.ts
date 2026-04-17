import type { PlatformAdapter } from "../types";

export const xiaohongshuAdapter: PlatformAdapter = {
  platform: "xiaohongshu",
  async getPlatformCode() {
    return {
      code: "",
      platform: "xiaohongshu"
    };
  },
  getRuntimeName() {
    return "小红书小程序";
  }
};
