# Docker 部署目录

当前已经补齐两套部署件：

- `api-server.Dockerfile`
- `admin-web.Dockerfile`
- `docker-compose.test.yml`
- `docker-compose.1panel.yml`
- `publish-admin-static.sh`
- `.env.test.example`

## 目录说明

- `api-server.Dockerfile`
  - 构建并启动 NestJS API
  - 运行时通过环境变量注入数据文件路径、存储目录和鉴权配置

- `admin-web.Dockerfile`
  - 构建后台静态资源
  - 最终用 OpenResty 作为静态站点容器
  - 同时把仓库根目录 `assets/` 复制进镜像，方便后台继续展示模板和作品预览图

- `docker-compose.test.yml`
  - 组合 3 个服务：
    - `api-server`
    - `admin-web`
    - `openresty`
  - `openresty` 作为测试环境统一入口

- `docker-compose.1panel.yml`
  - 适配 1Panel / 已有 OpenResty 的版本
  - 只启动 `api-server`
  - 不再抢占 `80/443`

- `publish-admin-static.sh`
  - 构建后台静态资源
  - 发布到服务器目录
  - 供 1Panel/OpenResty 直接读取静态文件
  - 当前已固定为 Docker 容器化构建，不再依赖宿主机 `pnpm`

- `.env.test.example`
  - 测试环境的最小变量模板

## 启动方式

```bash
cd deploy/docker
cp .env.test.example .env.test
docker compose -f docker-compose.test.yml --env-file .env.test up -d --build
```

如果服务器已经由 1Panel 管理 OpenResty，请改用：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

说明：

- `deploy/scripts/sync-test-env.sh` 是 1Panel 场景下唯一正式同步入口
- `deploy/scripts/rebuild-api.sh` 用于只重建 API
- `deploy/scripts/publish-admin.sh` 用于只发布后台静态文件

## 持久化目录

当前 compose 会把以下目录持久化到 `deploy/docker/runtime/`：

- `runtime/data`
- `runtime/uploads`

它们分别承载：

- 后端 JSON 数据文件
- 图片资产本地文件存储

1Panel 场景下，建议把它们改成服务器绝对路径，例如：

- `/opt/xiaoyeji/runtime/data`
- `/opt/xiaoyeji/runtime/uploads`

建议同时准备：

- `/opt/1panel/www/sites/admin/index`
- `/opt/xiaoyeji/backups`
