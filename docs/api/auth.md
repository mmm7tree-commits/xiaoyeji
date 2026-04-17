# 小叶记 M1 鉴权接口说明

## 当前范围

Milestone 1 只提供最小鉴权骨架，不提供完整用户系统。

## 接口

### 1. 登录

`POST /api/auth/login`

请求体：

```json
{
  "account": "admin",
  "password": "Admin123!"
}
```

返回：

```json
{
  "ok": true,
  "data": {
    "accessToken": "jwt-token",
    "tokenType": "Bearer",
    "expiresIn": "7d",
    "user": {
      "id": "user-admin",
      "account": "admin",
      "name": "后台管理员",
      "role": "ADMIN",
      "permissions": ["dashboard:read", "users:read", "templates:read", "orders:read", "orders:manage"],
      "status": "ACTIVE"
    }
  }
}
```

### 2. 当前用户

`GET /api/auth/me`

请求头：

```text
Authorization: Bearer <accessToken>
```

返回：

```json
{
  "ok": true,
  "data": {
    "id": "user-admin",
    "account": "admin",
    "name": "后台管理员",
    "role": "ADMIN",
    "permissions": ["dashboard:read", "users:read", "templates:read", "orders:read", "orders:manage"],
    "status": "ACTIVE"
  }
}
```

## 错误返回结构

```json
{
  "ok": false,
  "code": "AUTH_TOKEN_MISSING",
  "message": "未登录或登录已过期",
  "path": "/api/auth/me",
  "timestamp": "2026-04-13T10:00:00.000Z"
}
```

## 本地开发账号

当前账号由根目录 `.env.dev` 生成：

- 超级管理员：`superadmin / SuperAdmin123!`
- 管理员：`admin / Admin123!`
- 运营：`operator / Operator123!`

仅用于本地开发与验收，后续会替换为正式账号体系。
