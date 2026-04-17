# Nginx / OpenResty 配置目录

当前已经补齐测试环境最小配置：

- `admin-static.conf`
- `openresty-test.conf`
- `openresty-1panel.conf`

## 文件说明

- `admin-static.conf`
  - 提供后台静态站点
  - 支持 `Vue Router` 的 history fallback

- `openresty-test.conf`
  - 作为测试环境统一入口
  - 反向代理规则：
    - `/api/` -> `api-server:3100`
    - `/storage/` -> `api-server:3100`
    - `/` -> `admin-web:8080`

- `openresty-1panel.conf`
  - 适配 1Panel / 已有 OpenResty 的站点配置示例
  - 反向代理规则：
    - `admin.ecomleaf.cn /api/` -> `127.0.0.1:3100`
    - `admin.ecomleaf.cn /` -> `/opt/1panel/www/sites/admin/index`
    - `api.ecomleaf.cn /api/` -> `127.0.0.1:3100`
    - `api.ecomleaf.cn /storage/` -> `127.0.0.1:3100`

## 当前用途

这套配置优先服务于：

- 测试环境部署
- API / 后台静态页 / 图片资源统一入口
- 后续继续接入真实域名和 HTTPS 前的最小联通验证

如果服务器已经由 1Panel 接管 OpenResty：

- 不要再启动 `docker-compose.test.yml` 里的 `openresty`
- 改用 `docker-compose.1panel.yml`
- 把 `openresty-1panel.conf` 中的路由结构配置到 1Panel 站点里
