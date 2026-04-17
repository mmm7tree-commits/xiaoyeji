# 适配 1Panel OpenResty 的测试环境部署方案

## 适用场景

这份文档适用于：

- 服务器已经通过 1Panel 安装并启用了 OpenResty
- `80/443` 已由 1Panel OpenResty 占用
- 当前不能再额外启动一个容器去抢占 `80/443`

因此，这套方案会采用：

- `api-server` 通过 Docker Compose 启动
- `admin-web` 通过 Docker 构建静态文件并发布到服务器目录
- 由 1Panel/OpenResty 统一承接：
  - `/` -> admin 静态站点
  - `/api/` -> api-server
  - `/storage/` -> api-server 文件资源

## 当前正式同步方式

M17 收口后，测试环境唯一正式同步方式固定为：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

这条脚本会统一完成：

1. 从 GitHub 拉取最新 `main`
2. 将代码重置到 `origin/main`
3. 通过 Docker 重建 `api-server`
4. 通过 Docker 构建并发布后台静态文件

说明：

- `A：手动 git fetch/reset + 手动重建` 只保留为备选排障口径
- `C：GitHub Actions 推送式同步` 作为后续增强，不在本轮强行接完

## 1. 当前服务器目录规划

当前按你的服务器实际目录收口为：

```text
/opt/xiaoyeji/
  api/                 # 项目代码目录
  admin/               # 预留后台构建/归档目录
  runtime/data/        # API 持久化数据目录
  runtime/uploads/     # 图片上传目录
  backups/             # 备份目录

/opt/1panel/www/sites/admin/index
  # 已连通的 admin 静态站点目录
```

建议先准备：

```bash
mkdir -p /opt/xiaoyeji/api
mkdir -p /opt/xiaoyeji/admin
mkdir -p /opt/xiaoyeji/runtime/data
mkdir -p /opt/xiaoyeji/runtime/uploads
mkdir -p /opt/xiaoyeji/backups
mkdir -p /opt/1panel/www/sites/admin/index
```

## 2. `.env.test` 实际值填写建议

```dotenv
APP_NAME=小叶记
NODE_ENV=test

API_SERVER_BIND_PORT=3100

PROJECT_DEPLOY_ROOT=/opt/xiaoyeji
ADMIN_STATIC_ROOT=/opt/1panel/www/sites/admin/index
API_DATA_ROOT=/opt/xiaoyeji/runtime/data
API_UPLOADS_ROOT=/opt/xiaoyeji/runtime/uploads
BACKUP_ROOT=/opt/xiaoyeji/backups

VITE_ADMIN_APP_NAME=小叶记管理后台（测试）
VITE_ADMIN_API_BASE_URL=/api
VITE_ADMIN_ASSET_BASE_URL=

API_SERVER_PREFIX=api
TEMPLATE_FEATURED_ID=summer-square
ASSET_PUBLIC_BASE_URL=https://api.ecomleaf.cn

JWT_SECRET=请替换成正式测试环境密钥
JWT_EXPIRES_IN=7d
AUTH_SUPER_ADMIN_ACCOUNT=superadmin
AUTH_SUPER_ADMIN_PASSWORD=请替换成强密码
AUTH_SUPER_ADMIN_NAME=超级管理员
AUTH_ADMIN_ACCOUNT=admin
AUTH_ADMIN_PASSWORD=请替换成强密码
AUTH_ADMIN_NAME=后台管理员
AUTH_OPERATOR_ACCOUNT=operator
AUTH_OPERATOR_PASSWORD=请替换成强密码
AUTH_OPERATOR_NAME=运营同学
```

说明：

- `VITE_ADMIN_API_BASE_URL=/api`
- `VITE_ADMIN_ASSET_BASE_URL=` 保持留空
- 当前建议域名分工：
  - `admin.ecomleaf.cn` -> 后台静态站点
  - `api.ecomleaf.cn` -> API 与图片资源
  - `static.ecomleaf.cn` -> 当前方案暂不启用，后续如拆 CDN/静态资源域名再接入

## 3. API 容器启动方式

1Panel 场景不要再使用 `docker-compose.test.yml`，因为它包含 `openresty` 服务，会和现有 OpenResty 冲突。

当前 API 的正式重建入口是：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/rebuild-api.sh
```

脚本内部实际执行的是：

```bash
cd /opt/xiaoyeji/api/deploy/docker
docker compose -f docker-compose.1panel.yml --env-file .env.test up -d --build
```

这份 compose 只启动 `api-server`，并将端口绑定到：

```text
127.0.0.1:3100 -> container:3100
```

## 4. admin-web 静态文件构建与发布

后台静态文件的正式发布入口是：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/publish-admin.sh
```

`publish-admin.sh` 会调用：

- `deploy/docker/publish-admin-static.sh`

当前正式发布方式已经固定为容器化构建，不再依赖宿主机 `npm/pnpm`。

脚本会：

1. 使用 `deploy/docker/admin-web.Dockerfile` 进行 Docker 构建
2. 从临时容器拷贝 `/usr/share/nginx/html`
3. 发布到 `/opt/1panel/www/sites/admin/index`

## 5. 1Panel/OpenResty 配置方式

当前建议在 1Panel 中配置两个站点：

- `admin.ecomleaf.cn`
- `api.ecomleaf.cn`

把：

- `deploy/nginx/openresty-1panel.conf`

中的路由结构配置到 1Panel 站点中。

核心规则：

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3100;
}

location / {
  root /opt/1panel/www/sites/admin/index;
  try_files $uri $uri/ /index.html;
}
```

`api.ecomleaf.cn` 站点则配置：

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3100;
}

location /storage/ {
  proxy_pass http://127.0.0.1:3100;
}
```

## 6. 首次部署命令

```bash
cd /opt/xiaoyeji
git clone <仓库地址> api
cd /opt/xiaoyeji/api
cd deploy/docker
cp .env.test.example .env.test
```

编辑好 `deploy/docker/.env.test` 后，执行：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

然后在 1Panel 中：

- 在 1Panel 中确认 `admin.ecomleaf.cn` 站点根目录为 `/opt/1panel/www/sites/admin/index`
- 在 `admin.ecomleaf.cn` 站点中增加 `/api/` 反代
- 在 `api.ecomleaf.cn` 站点中增加 `/api/` 和 `/storage/` 反代
- 重载 OpenResty

## 7. 升级命令

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

## 8. 回滚命令

### 代码回滚

```bash
cd /opt/xiaoyeji/api
git fetch origin
git reset --hard <上一个稳定 commit SHA>
bash deploy/scripts/rebuild-api.sh
bash deploy/scripts/publish-admin.sh
```

### 数据回滚

从：

```text
/opt/xiaoyeji/backups
```

恢复：

- `runtime/data`
- `runtime/uploads`

### 备选手动同步口径

仅在标准同步脚本排障时使用：

```bash
cd /opt/xiaoyeji/api
git fetch origin main
git reset --hard origin/main
bash deploy/scripts/rebuild-api.sh
bash deploy/scripts/publish-admin.sh
```

## 9. 常见故障排查清单

### 后台首页 404

- 检查 `/opt/1panel/www/sites/admin/index/index.html` 是否存在
- 检查是否执行过 `bash deploy/scripts/publish-admin.sh`
- 检查 1Panel 站点根目录是否指向 `/opt/1panel/www/sites/admin/index`

### `/api/health` 返回 502

先执行：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/rebuild-api.sh
docker compose -f deploy/docker/docker-compose.1panel.yml --env-file deploy/docker/.env.test ps
docker logs <api-server-container>
```

并确认：

- API 是否绑定到 `127.0.0.1:3100`
- 1Panel/OpenResty 是否反代到了同一端口

### `/storage/...` 无法访问

- 检查 `/opt/xiaoyeji/runtime/uploads` 是否存在
- 检查 `ASSET_PUBLIC_BASE_URL` 是否与测试域名一致
- 检查 OpenResty 是否把 `/storage/` 正确反代到 API

### 后台样式或图片资源 404

- 检查 `/opt/1panel/www/sites/admin/index/assets` 是否已复制
- 检查 `bash deploy/scripts/publish-admin.sh` 是否执行成功
- 检查 `VITE_ADMIN_ASSET_BASE_URL` 是否误填成旧开发地址

### 登录失败

- 检查 `.env.test` 中 `AUTH_*` 是否正确
- 检查 API 容器是否已重建
- 检查 `admin.ecomleaf.cn` 站点是否配置了 `/api/` 反代

## 10. 当前边界

当前这套 1Panel 方案只解决：

- API 可启动
- 管理后台可访问
- `/api/` `/storage/` 可联通
- 后台和用户端能跑测试环境联调

当前仍不包含：

- 真支付
- PDF 真实生成
- 发货 / 物流
- 退款售后
