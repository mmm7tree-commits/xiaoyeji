# 测试环境部署文档

## 目标

这份文档只服务于当前阶段的“可联通测试环境”：

- 后端 API 可启动
- 后台可访问
- 图片资源可访问
- OpenResty / Nginx 统一做代理入口

当前不包含：

- 真支付
- PDF 真实生成
- 发货 / 物流
- 退款售后

## 当前推荐拓扑

测试环境推荐最小拓扑：

```text
浏览器
  -> OpenResty/Nginx (80/443)
      -> /            admin-web
      -> /api/        api-server
      -> /storage/    api-server
```

## 1. 准备目录

在服务器上准备一个部署目录，例如：

```bash
/srv/xiaoyeji-test
```

并把项目代码同步上去。

## 2. 准备环境变量

进入：

```bash
cd deploy/docker
cp .env.test.example .env.test
```

建议至少确认这些变量：

- `TEST_HTTP_PORT`
- `VITE_ADMIN_APP_NAME`
- `VITE_ADMIN_API_BASE_URL`
- `VITE_ADMIN_ASSET_BASE_URL`
- `ASSET_PUBLIC_BASE_URL`
- `JWT_SECRET`
- `AUTH_*`

### 推荐值

如果测试环境通过同一个域名访问：

- `VITE_ADMIN_API_BASE_URL=/api`
- `VITE_ADMIN_ASSET_BASE_URL=` 留空即可
- `ASSET_PUBLIC_BASE_URL=https://你的测试域名`

如果只是本机端口测试：

- `TEST_HTTP_PORT=8080`
- `ASSET_PUBLIC_BASE_URL=http://127.0.0.1:8080`

## 3. 启动测试环境

```bash
cd deploy/docker
docker compose -f docker-compose.test.yml --env-file .env.test up -d --build
```

## 4. 验证服务

### 后台首页

打开：

```text
http://127.0.0.1:8080/
```

或你的测试域名。

### API 健康检查

```bash
curl http://127.0.0.1:8080/api/health
```

### 图片资源

如果已经有上传后的图片资源，可以直接访问：

```text
http://127.0.0.1:8080/storage/...
```

## 5. 数据持久化

当前 compose 会把数据保存到：

- `deploy/docker/runtime/data`
- `deploy/docker/runtime/uploads`

其中：

- `runtime/data`
  - 后台模板 / 作品骨架
  - 用户端作品
  - 地址
  - 订单

- `runtime/uploads`
  - 图片资产本地文件

## 6. 当前部署方式说明

### 后端 API

- 使用 `deploy/docker/api-server.Dockerfile`
- 容器内部端口：`3100`
- 通过 OpenResty 暴露 `/api/` 和 `/storage/`

### 管理后台

- 使用 `deploy/docker/admin-web.Dockerfile`
- 先构建 Vite 产物
- 再由 OpenResty 容器提供静态文件

### OpenResty / Nginx

- 使用 `deploy/nginx/openresty-test.conf`
- 统一承接：
  - 后台静态页
  - API
  - 图片存储访问

## 7. 当前边界

测试环境部署准备当前只保证：

- 服务可启动
- 页面可访问
- API 可调用
- 图片可访问

当前还不保证：

- 真支付可用
- PDF 可下载
- 发货 / 物流已打通
- 退款售后可用

## 8. 如果服务器已由 1Panel 管理 OpenResty

如果你的测试服务器已经由 1Panel 的 OpenResty 占用了 `80/443`，不要再使用 `docker-compose.test.yml` 里的 `openresty` 服务。

请改看这份专用方案：

- `docs/deploy/test-environment-1panel.md`

它会改成：

- 只启动 `api-server` 容器
- 后台静态文件直接发布到服务器目录
- 由 1Panel/OpenResty 统一代理：
  - `/`
  - `/api/`
  - `/storage/`
