import type { PlatformName } from "../types/auth";

export interface PlatformLoginPayload {
  code: string;
  platform: PlatformName;
}

export interface PlatformAdapter {
  platform: PlatformName;
  getPlatformCode(): Promise<PlatformLoginPayload>;
  getRuntimeName(): string;
}
