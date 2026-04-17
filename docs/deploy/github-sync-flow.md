# GitHub clean main 同步流程

## 当前正式口径

当前测试环境唯一正式同步方式为：

- `B：标准化同步脚本`

也就是在测试服务器项目目录执行：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

这条脚本会固定完成：

1. 从 GitHub 拉取最新 `main`
2. 将当前代码重置到 `origin/main`
3. 以 Docker 方式重建 `api-server`
4. 以 Docker 方式构建并发布 `admin-web` 静态文件

## 备选口径

### A：手动 Git 同步

仅作为备选排障口径保留，不作为日常推荐入口。

```bash
cd /opt/xiaoyeji/api
git fetch origin main
git reset --hard origin/main
bash deploy/scripts/rebuild-api.sh
bash deploy/scripts/publish-admin.sh
```

### C：GitHub Actions 推送式同步

作为后续增强方向保留，本轮不强行接完。

## 脚本入口

### 1. 完整同步

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

### 2. 仅重建 API

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/rebuild-api.sh
```

### 3. 仅发布后台静态文件

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/publish-admin.sh
```

## 后台静态发布方式

后台静态文件的正式发布方式已经固定为：

- `deploy/docker/publish-admin-static.sh`

但它不再依赖宿主机 `npm/pnpm`，而是：

1. 使用 `deploy/docker/admin-web.Dockerfile` 进行 Docker 构建
2. 从临时容器中拷贝 `/usr/share/nginx/html` 到：
   - `/opt/1panel/www/sites/admin/index`

因此，测试服务器不需要宿主机预装 `pnpm`。

## 回滚方式

如果最新 `main` 需要回退到上一个稳定提交：

```bash
cd /opt/xiaoyeji/api
git fetch origin
git reset --hard <稳定 commit SHA>
bash deploy/scripts/rebuild-api.sh
bash deploy/scripts/publish-admin.sh
```

如果需要回到远程正式主线：

```bash
cd /opt/xiaoyeji/api
git fetch origin
git reset --hard origin/main
bash deploy/scripts/sync-test-env.sh
```

## 同步完成后的最小检查

```bash
curl -I https://admin.ecomleaf.cn
curl -I https://api.ecomleaf.cn/api/health
curl -I https://api.ecomleaf.cn/storage/
```

再按：

- `docs/deploy/minimal-smoke-checklist.md`

执行完整联调检查。
