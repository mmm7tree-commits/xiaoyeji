import { douyinAdapter } from "./platforms/douyin";
import { wechatAdapter } from "./platforms/wechat";
import { xiaohongshuAdapter } from "./platforms/xiaohongshu";
import type { PlatformAdapter } from "./types";
import type { PlatformName } from "../types/auth";

const adapters: Record<PlatformName, PlatformAdapter> = {
  wechat: wechatAdapter,
  douyin: douyinAdapter,
  xiaohongshu: xiaohongshuAdapter
};

export function getPlatformAdapter(platform: PlatformName) {
  return adapters[platform];
}

export { adapters };
