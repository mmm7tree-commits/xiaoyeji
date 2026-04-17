import type { PlatformAdapter } from "../types";

export const douyinAdapter: PlatformAdapter = {
  platform: "douyin",
  async getPlatformCode() {
    return {
      code: "",
      platform: "douyin"
    };
  },
  getRuntimeName() {
    return "抖音小程序";
  }
};
