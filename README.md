# 小叶记 Monorepo（Milestone 0）

当前仓库已经进入 monorepo 初始化阶段。

Milestone 0 的目标不是迁移大规模业务代码，而是先建立：

- 最小可用的 monorepo 骨架
- admin-web 启动骨架
- api-server 启动骨架
- 环境变量基线
- 现有 demo 迁移映射
- 开发与部署文档基础目录

## 当前仓库同时包含两部分

### 1. 新骨架

- `apps/admin-web`：Vue3 + Vite + TypeScript 后台骨架
- `apps/api-server`：NestJS 后端骨架
- `apps/miniapp`：uni-app 目标目录初始化

### 2. 现有 legacy demo

- 仓库根目录微信小程序原型
- `h5/` 用户端 H5 原型
- `admin/` 后台原型
- `server.js` 本地联调服务

这些 legacy demo 在 Milestone 0 继续保留，不做大规模迁移。

Milestone 1 已额外补齐：

- api-server 最小 JWT 鉴权骨架
- admin-web 登录页、路由守卫、401 / 403 / 404 页面
- miniapp 请求层、token 管理、session store、platform adapter 骨架

Milestone 2 已额外补齐：

- api-server 模板分类、推荐模板、模板列表、模板详情接口
- legacy 微信小程序首页模板主链路
- 模板详情页与模板选择记忆

Milestone 3 已额外补齐：

- legacy 微信小程序制作入口页
- 上传照片、封面信息、完整预览入口
- 规则驱动的结构化预览数据
- 照片顺序、最少/最多照片提示与限制

Milestone 4 已额外补齐：

- 草稿保存为作品
- 作品状态建模
- 我的作品列表
- 作品详情与从作品回看预览

Milestone 5 已额外补齐：

- 地址管理（新增 / 编辑 / 删除 / 默认地址）
- 从待下单作品进入确认订单页
- 数量选择与价格计算
- 订单基础结构与订单详情页
- 支付占位状态与默认地址自动带出

Milestone 6 已额外补齐：

- 我的页登录态 / 未登录态整理
- 独立我的订单列表页
- 订单状态筛选
- 订单列表到订单详情的跳转关系
- 我的作品 / 我的订单 / 我的地址 入口收口

Milestone 7 已额外补齐：

- 后台模板列表、搜索与分类筛选
- 新增模板与编辑模板基础信息
- 根据主题 + 分类 + 页数生成模板
- 提示词调整后重新生成模板
- 模板预览、版本记录、上架 / 下架 / 推荐 / 删除校验
- 后台作品管理骨架（列表 / 详情 / 预览入口）

Milestone 8 已额外补齐：

- 用户端模板接口优先消费后台已发布模板
- 后台模板推荐 / 上下架结果开始影响用户端首页与模板入口
- 用户端模板详情与制作入口开始消费后台模板版本结构
- 后台模板生成结果与用户端预览结构完成第一版字段对齐
- 本地 seed 从“主数据源”收缩为“运行时兜底”

Milestone 9 已额外补齐：

- 作品保存接口后端化
- 我的作品列表接口后端化
- 作品详情接口后端化
- 历史作品预览优先读取冻结快照
- 模板版本与作品快照的隔离规则正式落地

Milestone 10 已额外补齐：

- 图片资产后端化（开发环境先采用服务端本地文件存储 + 可访问 URL）
- 地址 API 正式收口
- 确认订单页开始读取后端作品详情与后端地址数据
- 作品图片从设备本地路径逐步过渡到服务端资源引用

Milestone 11 已额外补齐：

- 订单创建接口后端化
- 我的订单列表接口后端化
- 订单详情接口后端化
- 订单快照冻结规则落地
- 订单状态开始从本地占位模型过渡到后端主存储

Milestone 12 已额外补齐：

- 后台订单列表页
- 后台订单详情页骨架
- 后台正式读取后端订单数据
- 用户端与后台订单状态字段对齐

Milestone 13 已额外补齐：

- 订单可生产性判断规则
- 后台订单详情里的履约准备信息
- 用户端订单详情状态提示收口
- 为后续支付 / PDF / 履约按钮预留位置
- 统一订单 `statusCode` 枚举

Milestone 14 已额外补齐：

- 后台订单动作按钮位
- 统一 `actionAvailability` 模型
- 点击前先走统一前置校验
- 不满足条件时返回明确拦截原因
- 满足条件时只进入动作占位说明

Milestone 15 已额外补齐：

- 支付动作后端占位接口
- 用户端与后台统一走后端支付动作判断
- 支付占位返回结构
- 支付入口文案与状态提示收口

Milestone 16 已额外补齐：

- PDF 动作后端占位接口
- 履约动作后端占位接口
- 后台订单详情页接入 PDF / 履约动作
- 统一前置校验与统一返回结构继续复用支付动作模型

当前优先级已切到“测试环境部署准备 + 部署文档收口”，先不继续扩产品功能。

当前已经补齐：

- 后端 API Docker 部署方式
- 管理后台 Docker 部署方式
- OpenResty / Nginx 反向代理方案
- 测试环境部署文档
- 最小联调检查清单

如果服务器已经由 1Panel 接管 OpenResty，请改看：

- `docs/deploy/test-environment-1panel.md`

当前按真实测试服务器收口的域名与目录为：

- `admin.ecomleaf.cn`
- `api.ecomleaf.cn`
- `/opt/xiaoyeji/api`
- `/opt/1panel/www/sites/admin/index`
- `/opt/xiaoyeji/runtime/data`
- `/opt/xiaoyeji/runtime/uploads`
- `/opt/xiaoyeji/backups`

## 当前正式代码与同步口径

当前 GitHub `main` 已经收成 clean `main`，后续：

- 本地开发认远程 `main`
- 测试环境认远程 `main`
- Codex 后续修改也认这条主线

测试环境唯一正式同步方式固定为：

```bash
cd /opt/xiaoyeji/api
bash deploy/scripts/sync-test-env.sh
```

说明：

- `B：标准化同步脚本` 是当前唯一正式口径
- `A：手动 git fetch/reset + 手动重建` 只作为备选
- `C：GitHub Actions 推送式同步` 作为后续增强，不在当前阶段强行接完

后台静态发布已经固定为容器化方式，不再依赖宿主机 `pnpm install`。

## 快速开始

### 安装依赖

```bash
pnpm install
```

如果当前机器的 `pnpm` 没有加入 PATH，可以改用：

```bash
./scripts/pnpmw install
```

### 启动 admin-web 骨架

```bash
pnpm dev:admin
```

或：

```bash
./scripts/pnpmw dev:admin
```

### 启动 api-server 骨架

```bash
pnpm dev:api
```

或：

```bash
./scripts/pnpmw dev:api
```

### 启动当前 legacy demo 服务

```bash
pnpm dev:legacy-demo
```

或：

```bash
./scripts/pnpmw dev:legacy-demo
```

### 同步 legacy 小程序运行时配置

当前仓库根目录微信小程序 demo 仍在复用中。若你修改了 `.env.dev` 里的 API 地址，请执行：

```bash
pnpm sync:legacy-runtime
```

或：

```bash
./scripts/pnpmw sync:legacy-runtime
```

## 文档入口

- 项目结构说明：`docs/project-structure.md`
- 开发启动说明：`docs/dev-start.md`
- 环境变量说明：`docs/deploy/environment-variables.md`
- GitHub 主线同步方式：`docs/deploy/github-sync-flow.md`
- demo 迁移映射：`docs/architecture/demo-migration-map.md`
- 鉴权接口说明：`docs/api/auth.md`
- 模板接口说明：`docs/api/templates.md`
- 后台模板接口说明：`docs/api/admin-templates.md`
- 后台作品接口说明：`docs/api/admin-works.md`
- 登录链路说明：`docs/architecture/auth-flow.md`
- miniapp adapter 结构：`docs/architecture/miniapp-adapter-structure.md`
- M3 预览数据与页面状态模型：`docs/architecture/m3-draft-preview-model.md`
- M4 作品状态与数据模型：`docs/architecture/m4-work-state-model.md`
- M5 地址与订单状态模型：`docs/architecture/m5-order-address-model.md`
- M6 我的页与订单列表模型：`docs/architecture/m6-profile-order-list-model.md`
- M7 模板管理与作品管理骨架模型：`docs/architecture/m7-template-management-model.md`
- M8 用户端模板消费与模板发布接入模型：`docs/architecture/m8-template-consumption-model.md`
- 作品接口说明：`docs/api/works.md`
- M9 作品后端收口与模板快照冻结模型：`docs/architecture/m9-work-snapshot-model.md`
- 地址接口说明：`docs/api/addresses.md`
- M10 图片资产与地址接口模型：`docs/architecture/m10-image-address-model.md`
- 订单接口说明：`docs/api/orders.md`
- M11 订单后端收口模型：`docs/architecture/m11-order-backend-model.md`
- 后台订单接口说明：`docs/api/admin-orders.md`
- M12 后台订单骨架与状态对齐模型：`docs/architecture/m12-order-admin-model.md`
- M13 订单可生产性与履约准备模型：`docs/architecture/m13-order-production-readiness.md`
- M14 订单动作可用性模型：`docs/architecture/m14-order-action-availability.md`
- M15 支付占位接口边界：`docs/architecture/m15-payment-action-placeholder.md`
- M16 PDF / 履约动作占位边界：`docs/architecture/m16-order-pdf-fulfillment-placeholder.md`
- 测试环境部署文档：`docs/deploy/test-environment.md`
- 测试环境最小联调检查清单：`docs/deploy/minimal-smoke-checklist.md`
- 1Panel OpenResty 测试环境部署文档：`docs/deploy/test-environment-1panel.md`

## 当前目录结构

```text
apps/
  admin-web/
  api-server/
  miniapp/
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

## Milestone 0 明确不做

- 不迁移大规模业务代码
- 不重写现有 demo
- 不提前拆复杂共享包
- 不提前接数据库、Redis、支付、PDF 生成
- 不在这个阶段把三端小程序业务全部落完
