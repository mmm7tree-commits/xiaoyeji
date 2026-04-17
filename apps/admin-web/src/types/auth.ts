export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
export type UserStatus = "ACTIVE" | "DISABLED";

export type PermissionCode =
  | "dashboard:read"
  | "users:read"
  | "templates:read"
  | "templates:manage"
  | "works:read"
  | "orders:read"
  | "orders:manage"
  | "accounts:manage";

export interface AuthUser {
  id: string;
  account: string;
  name: string;
  role: UserRole;
  permissions: PermissionCode[];
  status: UserStatus;
}

export interface LoginPayload {
  account: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: AuthUser;
}
