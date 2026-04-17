# 小叶记 M1 登录链路说明

## 后端

1. `POST /api/auth/login`
2. 后端根据环境变量生成的最小用户模型校验账号密码
3. 签发 JWT access token
4. `GET /api/auth/me` 使用 Bearer Token 读取当前用户

说明：当前 `AUTH_*` 账号只用于本地开发验收，不是正式产品方案。后续接数据库后，会切换到正式管理员表与真实登录逻辑。

## admin-web

1. 用户进入 `/login`
2. 登录成功后将 `token + user` 持久化到 localStorage
3. 路由守卫在进入受保护页面前：
   - 先检查 token 是否存在
   - 再调用 `ensureSession()` 验证 `/api/auth/me`
   - 无 token 或 token 失效跳到 `/401`
   - 角色不满足跳到 `/403`

说明：当前“未登录跳 `/401`”是 Milestone 1 的临时技术验证方案，用来快速校验 token 与守卫是否生效。

后续在后台业务页正式铺开时，会调整为更符合产品体验的方案：

- 未登录：直接回到登录页，并保留原始目标地址
- token 失效：先提示登录已过期，再引导重新登录
- `/401` 页面：保留为辅助说明页，而不是主要登录入口

这项调整计划放到后台业务页开始成型的里程碑再一起收口。

## miniapp

1. 先通过 platform adapter 获取平台登录 code
2. 再通过请求封装调用后端登录接口
3. token 与用户信息通过统一 token manager 持久化
4. 页面层后续只依赖 session store，不直接处理平台差异

## token 生命周期

- 当前仅使用 access token
- 签发时长来自 `JWT_EXPIRES_IN`
- M1 默认值：`7d`
- M1 暂不实现 refresh token
