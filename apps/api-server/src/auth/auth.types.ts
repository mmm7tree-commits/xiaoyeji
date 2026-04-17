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

export interface UserRecord {
  id: string;
  account: string;
  password: string;
  name: string;
  role: UserRole;
  permissions: PermissionCode[];
  status: UserStatus;
}

export interface AuthUserProfile {
  id: string;
  account: string;
  name: string;
  role: UserRole;
  permissions: PermissionCode[];
  status: UserStatus;
}

export interface JwtPayload {
  sub: string;
  account: string;
  role: UserRole;
}

export interface LoginRequestDto {
  account: string;
  password: string;
}
