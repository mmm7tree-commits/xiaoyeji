import type { PlatformName } from "../types/auth";

export interface MiniappRuntimeConfig {
  apiBaseUrl: string;
  platform: PlatformName;
}

export function createRuntimeConfig(partial?: Partial<MiniappRuntimeConfig>): MiniappRuntimeConfig {
  return {
    apiBaseUrl: partial?.apiBaseUrl || "http://127.0.0.1:3100",
    platform: partial?.platform || "wechat"
  };
}
