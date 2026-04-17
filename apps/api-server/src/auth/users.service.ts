import { Injectable } from "@nestjs/common";
import {
  AuthUserProfile,
  PermissionCode,
  UserRecord,
  UserRole
} from "./auth.types";

function getRolePermissions(role: UserRole): PermissionCode[] {
  if (role === "SUPER_ADMIN") {
    return [
      "dashboard:read",
      "users:read",
      "templates:read",
      "templates:manage",
      "works:read",
      "orders:read",
      "orders:manage",
      "accounts:manage"
    ];
  }

  if (role === "ADMIN") {
    return [
      "dashboard:read",
      "users:read",
      "templates:read",
      "templates:manage",
      "works:read",
      "orders:read",
      "orders:manage"
    ];
  }

  return [
    "dashboard:read",
    "users:read",
    "templates:read",
    "works:read",
    "orders:read"
  ];
}

@Injectable()
export class UsersService {
  private readonly users: UserRecord[] = [
    {
      id: "user-super-admin",
      account: process.env.AUTH_SUPER_ADMIN_ACCOUNT || "superadmin",
      password: process.env.AUTH_SUPER_ADMIN_PASSWORD || "SuperAdmin123!",
      name: process.env.AUTH_SUPER_ADMIN_NAME || "超级管理员",
      role: "SUPER_ADMIN",
      permissions: getRolePermissions("SUPER_ADMIN"),
      status: "ACTIVE"
    },
    {
      id: "user-admin",
      account: process.env.AUTH_ADMIN_ACCOUNT || "admin",
      password: process.env.AUTH_ADMIN_PASSWORD || "Admin123!",
      name: process.env.AUTH_ADMIN_NAME || "后台管理员",
      role: "ADMIN",
      permissions: getRolePermissions("ADMIN"),
      status: "ACTIVE"
    },
    {
      id: "user-operator",
      account: process.env.AUTH_OPERATOR_ACCOUNT || "operator",
      password: process.env.AUTH_OPERATOR_PASSWORD || "Operator123!",
      name: process.env.AUTH_OPERATOR_NAME || "运营同学",
      role: "OPERATOR",
      permissions: getRolePermissions("OPERATOR"),
      status: "ACTIVE"
    }
  ];

  findByAccount(account: string): UserRecord | undefined {
    return this.users.find((item) => item.account === account);
  }

  findById(id: string): UserRecord | undefined {
    return this.users.find((item) => item.id === id);
  }

  toProfile(user: UserRecord): AuthUserProfile {
    return {
      id: user.id,
      account: user.account,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      status: user.status
    };
  }
}
