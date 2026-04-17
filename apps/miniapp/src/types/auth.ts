export type PlatformName = "wechat" | "douyin" | "xiaohongshu";
export type SessionStatus = "ANONYMOUS" | "AUTHENTICATED" | "EXPIRED";

export interface MiniappUser {
  id: string;
  account: string;
  name: string;
  role: "PARENT" | "GUEST";
}

export interface MiniappLoginResult {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: MiniappUser;
}
