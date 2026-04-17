# 小叶记项目结构说明

## Milestone 0 目标

当前阶段只建立 monorepo 骨架与迁移边界，不搬运大规模业务代码。

## 当前结构

```text
apps/
  miniapp/      # uni-app 目标目录，当前仅初始化
  admin-web/    # Vue3 + Vite + TS 后台骨架
  api-server/   # NestJS 后端骨架与健康检查
deploy/
  docker/
  nginx/
docs/
  api/
  architecture/
  deploy/
  prd/
  release/
scripts/
```

## 遗留 demo 保留策略

以下目录在 Milestone 0 继续保留在根目录，不迁移，只做映射：

- `pages/`、`app.js`、`app.json`、`app.wxss`：当前微信小程序原型
- `h5/`：当前用户端 H5 原型
- `admin/`：当前后台原型
- `server.js`、`server-data/`：当前本地联调服务
- `assets/`、`uploads/`：素材与本地文件

## 后续迁移原则

1. 先保留可运行 demo。
2. 后续按页面和模块逐步迁移到 `apps/*`。
3. 没有真实复用需求前，不提前拆分共享包。
