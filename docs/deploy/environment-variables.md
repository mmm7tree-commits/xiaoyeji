# 小叶记环境变量说明

## 根目录环境文件

- `.env.example`
- `.env.dev`
- `.env.test`
- `.env.prod`

## 当前已定义变量

### 通用

- `APP_NAME`
- `NODE_ENV`

### 现有 demo

- `LEGACY_DEMO_PORT`

### admin-web

- `ADMIN_WEB_PORT`
- `ADMIN_WEB_HOST`
- `VITE_ADMIN_APP_NAME`
- `VITE_ADMIN_API_BASE_URL`
- `VITE_ADMIN_ASSET_BASE_URL`

### api-server

- `API_SERVER_PORT`
- `API_SERVER_HOST`
- `API_SERVER_PREFIX`
- `TEMPLATE_FEATURED_ID`
- `ADMIN_DATA_FILE`
- `PUBLIC_WORKS_DATA_FILE`
- `PUBLIC_ADDRESSES_DATA_FILE`
- `PUBLIC_ORDERS_DATA_FILE`
- `ASSET_PUBLIC_BASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_SUPER_ADMIN_ACCOUNT`
- `AUTH_SUPER_ADMIN_PASSWORD`
- `AUTH_SUPER_ADMIN_NAME`
- `AUTH_ADMIN_ACCOUNT`
- `AUTH_ADMIN_PASSWORD`
- `AUTH_ADMIN_NAME`
- `AUTH_OPERATOR_ACCOUNT`
- `AUTH_OPERATOR_PASSWORD`
- `AUTH_OPERATOR_NAME`

### 数据层

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`

### 文件存储

- `STORAGE_DRIVER`
- `STORAGE_LOCAL_ROOT`

## 说明

Milestone 0 只完成变量归档和说明，不在这个阶段接入完整数据库、Redis 和对象存储。

Milestone 1 已接入最小登录骨架，当前后台本地验收账号通过以上 `AUTH_*` 变量生成。

这些账号只用于本地开发验证。后续接入数据库后，必须替换为正式管理员表与真实登录逻辑。

Milestone 7 新增：

- `ADMIN_DATA_FILE`：后台模板与作品骨架数据的本地 JSON 文件路径
- `VITE_ADMIN_ASSET_BASE_URL`：后台预览图素材来源地址，开发环境默认指向 legacy 静态服务

Milestone 9 新增：

- `PUBLIC_WORKS_DATA_FILE`：用户端作品后端化阶段使用的本地 JSON 文件路径，用来保存作品快照与冻结后的模板版本数据

Milestone 10 新增：

- `PUBLIC_ADDRESSES_DATA_FILE`：地址 API 使用的本地 JSON 文件路径
- `ASSET_PUBLIC_BASE_URL`：图片资产公开访问域名或基础地址，开发环境默认使用本地 API 地址

Milestone 11 新增：

- `PUBLIC_ORDERS_DATA_FILE`：订单 API 使用的本地 JSON 文件路径，用于当前开发环境的订单主存储

## 测试环境推荐补充说明

如果准备开始跑测试环境，建议重点确认以下变量：

### 后台访问路径

- `VITE_ADMIN_API_BASE_URL`
  - 推荐测试环境使用 `/api`
  - 这样后台页面和 API 可以统一走同一个域名，减少跨域配置

- `VITE_ADMIN_ASSET_BASE_URL`
  - 如果后台预览图与站点同域，可留空
  - 如果素材仍托管在单独域名或旧静态服务，再填完整地址

### API 对外访问

- `API_SERVER_HOST`
  - 容器或服务器环境推荐设为 `0.0.0.0`

- `API_SERVER_PORT`
  - 容器内部默认 `3100`

- `ASSET_PUBLIC_BASE_URL`
  - 这个值会直接进入图片资产公开 URL
  - 测试环境建议填写成真实可访问域名，例如：
    - `https://test.example.com`
    - 或 `http://服务器IP:端口`

### 测试环境持久化文件

以下变量建议在测试环境中指向独立持久化目录，而不是继续使用仓库内相对目录：

- `ADMIN_DATA_FILE`
- `PUBLIC_WORKS_DATA_FILE`
- `PUBLIC_ADDRESSES_DATA_FILE`
- `PUBLIC_ORDERS_DATA_FILE`
- `STORAGE_LOCAL_ROOT`

## 当前测试环境建议

当前仓库已经补了一套最小测试环境部署件，参考：

- `deploy/docker/.env.test.example`
- `deploy/docker/docker-compose.test.yml`
- `deploy/nginx/openresty-test.conf`
- `docs/deploy/test-environment.md`

## 1Panel OpenResty 场景建议

如果测试服务器已经由 1Panel 接管 OpenResty，建议额外关注这些变量：

- `API_SERVER_BIND_PORT`
  - 建议：`3100`
  - 作用：仅绑定 `127.0.0.1:3100`，供 OpenResty 反代
- `PROJECT_DEPLOY_ROOT`
  - 当前服务器建议：`/opt/xiaoyeji`
- `ADMIN_STATIC_ROOT`
  - 当前服务器建议：`/opt/1panel/www/sites/admin/index`
- `API_DATA_ROOT`
  - 当前服务器建议：`/opt/xiaoyeji/runtime/data`
- `API_UPLOADS_ROOT`
  - 当前服务器建议：`/opt/xiaoyeji/runtime/uploads`
- `BACKUP_ROOT`
  - 当前服务器建议：`/opt/xiaoyeji/backups`

在 1Panel 场景下：

- 不再使用 compose 自带 `openresty`
- `VITE_ADMIN_API_BASE_URL` 继续建议保持 `/api`
- `VITE_ADMIN_ASSET_BASE_URL` 继续建议留空
- `ASSET_PUBLIC_BASE_URL` 建议直接填写测试域名，例如：
  - `https://api.ecomleaf.cn`

进一步参考：

- `deploy/docker/docker-compose.1panel.yml`
- `deploy/nginx/openresty-1panel.conf`
- `docs/deploy/test-environment-1panel.md`
