# 小叶记开发启动说明

## 1. 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

如果当前机器的 `pnpm` 没有加入 PATH，可以使用仓库内包装脚本：

```bash
./scripts/pnpmw install
```

## 2. 启动后台骨架

```bash
pnpm dev:admin
```

或：

```bash
./scripts/pnpmw dev:admin
```

默认地址：

```text
http://127.0.0.1:5173
```

## 3. 启动后端骨架

```bash
pnpm dev:api
```

或：

```bash
./scripts/pnpmw dev:api
```

健康检查：

```text
http://127.0.0.1:3100/api/health
```

## 4. 启动现有联调 demo

```bash
pnpm dev:legacy-demo
```

或：

```bash
./scripts/pnpmw dev:legacy-demo
```

默认地址：

```text
http://127.0.0.1:8877/h5/index.html
http://127.0.0.1:8877/admin/index.html
```

## 5. 小程序原型打开方式

Milestone 0 暂不迁移小程序业务代码，继续使用仓库根目录作为当前微信小程序开发入口：

```text
/Users/yettree/Documents/kidsphotos
```

使用微信开发者工具直接导入当前目录即可。

## 6. M1 本地登录验收

后台账号由根目录 `.env.dev` 生成，当前本地默认可使用：

- `superadmin / SuperAdmin123!`
- `admin / Admin123!`
- `operator / Operator123!`

## 7. M2 模板主链路验收

- `GET /api/templates/featured`
- `GET /api/templates/categories`
- `GET /api/templates`
- `GET /api/templates/:id`

legacy 微信小程序首页会直接读取以上接口。

## 8. M3 制作入口与完整预览验收

- 从首页进入任意模板详情页
- 在制作入口页填写：
  - 封面标题
  - 幼儿园 / 宝宝信息
  - 封面短语
- 上传照片后确认：
  - 当前顺序会按上传先后保存
  - 达到模板上限后，不再继续加入新照片
  - 未达到建议最少张数时，会先提示再决定是否预览
- 进入完整预览页后确认：
  - 可以左右翻页
  - 只展示已生成好的页面
  - 不会循环重复照片
  - 可以返回制作页继续编辑

## 9. M4 保存作品与作品列表验收

- 在模板制作入口页点击“保存到我的作品”
- 当照片数 `< orderMinPhotos` 时：
  - 允许保存
  - 作品状态应为“继续补充”
- 当照片数 `>= orderMinPhotos` 时：
  - 允许保存
  - 作品状态应为“待下单”
- 进入“我的作品”确认：
  - 能看到作品列表
  - 能按状态切换
  - 能打开作品详情
  - 能从作品再次进入完整预览
- 作品预览页应复用保存时的预览结果，不再重新生成另一套不一致的数据

## 10. legacy 微信小程序 API 地址同步

如果调整了 `.env.dev` 中的 `API_SERVER_HOST / API_SERVER_PORT / API_SERVER_PREFIX`，请同步执行：

```bash
./scripts/pnpmw sync:legacy-runtime
```

这样仓库根目录微信小程序 demo 会使用最新的本地 API 地址。

## 11. M5 地址与下单基础链路验收

- 从“待下单”作品进入作品详情页，再点击“去确认订单”
- 确认订单页应自动带出默认地址
- 如果还没有默认地址：
  - 页面会提示先新增默认地址
  - 进入地址页新增后，返回确认订单页即可自动带出
- 地址页需要支持：
  - 新增
  - 编辑
  - 删除
  - 设为默认地址
- 确认订单页需要支持：
  - 数量加减
  - 单本价格展示
  - 实时合计金额计算
  - 生成订单
- 生成订单后会进入订单详情页
- 订单详情页当前只做最小状态：
  - 待支付
  - 待发货（占位）
  - 已关闭
- 当前不要把“生成订单”理解为“已经完成支付”，支付能力仍是后续里程碑能力

## 12. M6 我的页与订单列表验收

- 打开“我的”页时：
  - 未登录应展示授权引导，不直接展示完整订单列表
  - 已登录应展示订单状态概览和“我的作品 / 我的订单 / 我的地址”入口
- 点击订单状态概览卡，应带着对应筛选进入“我的订单”列表页
- 点击“我的订单”入口，应进入独立订单列表页
- 订单列表页应支持：
  - 全部
  - 待支付
  - 待发货
  - 已关闭
- 点击订单列表项，应进入订单详情页
- 订单详情页返回时，应优先回到订单列表页
- 当前订单列表和订单详情里，不要误导成“已接通支付能力”

## 13. M7 后台模板管理与作品管理骨架验收

先启动：

```bash
pnpm dev:api
pnpm dev:legacy-demo
pnpm dev:admin
```

说明：

- `dev:api`：提供后台模板与作品接口
- `dev:legacy-demo`：提供后台预览图素材地址
- `dev:admin`：提供 Vue 管理后台

验收步骤：

- 登录后台：`http://127.0.0.1:5173/login`
- 进入“模板管理”页，确认可以：
  - 查看模板列表
  - 按分类筛选
  - 搜索模板
  - 新增模板草稿
  - 编辑模板基础信息
  - 根据主题 + 分类 + 页数生成模板
  - 调整提示词后重新生成模板
  - 查看模板预览与版本记录
  - 上架 / 下架
  - 设为推荐
  - 触发删除校验
- 进入“作品管理”页，确认可以：
  - 查看作品列表
  - 按状态筛选
  - 打开作品详情
  - 打开作品预览入口

## 14. M8 用户端模板消费对齐验收

先启动：

```bash
pnpm dev:api
pnpm dev:legacy-demo
```

然后：

- 用后台把某套模板设为推荐，确认用户端首页 `推荐模板` 会变化
- 用后台下架某套模板，确认这套模板会从用户端模板入口里消失
- 重新上架后，确认用户端可以再次看到这套模板
- 在用户端打开模板详情页，确认：
  - 当前会显示“已接入后台已发布版本”或“本地模板兜底”说明
  - 上传与预览规则使用当前模板的 `suggestedMinPhotos / orderMinPhotos / maxPhotos`
- 进入完整预览页，确认：
  - 会优先按照后台模板版本的 `pageBlueprints` 生成页面
  - 照片不足时只展示已生成的页面
  - 不会循环重复照片

## 15. M9 作品后端化与快照冻结验收

- 在模板制作页上传照片并保存作品
- 确认“我的作品”列表优先读取后端接口
- 打开作品详情与预览，确认历史作品仍然使用保存时冻结的模板版本与预览结果
- 后台再发布模板新版本后，历史作品预览不应变化

## 16. M10 图片资产后端化 + 地址 API + 确认订单依赖后端验收

先启动：

```bash
pnpm dev:api
pnpm sync:legacy-runtime
```

然后：

- 在模板制作页点击“保存到我的作品”前，图片会先上传到服务端本地文件存储
- 打开作品详情后，确认作品里的图片不再只依赖 `wxfile://` 本地路径
- 进入地址页，确认：
  - 地址列表读取后端接口
  - 新增 / 编辑 / 删除 / 默认地址都能生效
- 进入确认订单页，确认：
  - 作品信息读取后端作品详情
  - 地址读取后端地址接口
  - 页面显示模板版本、页数、照片数、单价
  - 若作品图片未完成服务端同步，则不能生成订单

## 17. M11 订单后端化验收

先启动：

```bash
pnpm dev:api
pnpm sync:legacy-runtime
```

然后：

- 从确认订单页生成订单，确认已经走后端订单接口
- 打开“我的订单”，确认列表优先读取后端订单数据
- 打开订单详情，确认读取的是后端订单详情
- 关闭订单后，确认状态会更新为“已关闭”
- 确认创建订单时已经冻结：
  - 模板名称
  - 模板版本号
  - 页数
  - 照片数
  - 单价
  - 数量
  - 金额
  - 地址快照
  - 作品快照

## 18. M12 后台订单管理骨架验收

先启动：

```bash
pnpm dev:api
pnpm dev:admin
```

然后：

- 登录后台后进入“订单管理”
- 验证订单列表支持：
  - 搜索订单号、作品名、收货人、手机号
  - 按 `待支付 / 待发货 / 已关闭` 筛选
- 选择任意订单后，确认详情至少展示：
  - 订单基础信息
  - 地址快照
  - 作品快照摘要
  - 模板版本号
  - 图片资产是否具备后续履约条件
- 对比用户端与后台，确认底层 `statusCode` 一致

## 19. M13 订单可生产性校验验收

先启动：

```bash
pnpm dev:api
pnpm dev:admin
```

然后：

- 在后台订单详情里确认可以直接看到：
  - 当前是否具备后续生产条件
  - 图片资产是否齐全
  - 作品快照是否完整
  - 模板版本是否完整
  - 地址快照是否完整
- 在用户端订单详情里确认：
  - 状态提示已经收口
  - 可以看到每一项生产准备检查结果
  - 支付 / PDF / 履约仍然只是按钮占位，没有被伪装成已完成能力

## 20. M14 后台订单动作占位验收

先启动：

```bash
pnpm dev:api
pnpm dev:admin
```

然后：

- 进入后台“订单管理”
- 打开任意订单详情，确认至少能看到 3 个动作入口：
  - 支付
  - PDF
  - 履约
- 确认每个动作都有：
  - 是否可点
  - 是否被拦截
  - 拦截或占位说明
  - 依赖检查项
- 确认动作判断和订单状态是分开的：
  - `statusCode` 只表示订单当前状态
  - `actionAvailability` 只表示动作是否可用
- 在用户端订单详情里确认：
  - 动作说明与后端判断一致
  - 如果后端已经返回 `productionReadiness` / `actionAvailability`，本地缓存不会覆盖它们

## 21. M15 支付占位接口验收

先启动：

```bash
pnpm dev:api
pnpm dev:admin
```

然后：

- 在用户端订单详情点击“支付”
- 确认当前不会真的扣款
- 确认会收到后端返回的支付占位说明
- 确认订单状态仍然保持原样，不会自动变成 `pending_shipment`
- 在后台订单详情点击“支付”
- 确认后台也走同一套后端支付动作判断
- 如果支付动作当前被拦截，确认能看到明确原因

## 22. M16 PDF / 履约占位接口验收

先启动：

```bash
pnpm dev:api
pnpm dev:admin
```

然后：

- 进入后台“订单管理”
- 打开任意订单详情，确认现在至少有 3 个动作入口：
  - 支付
  - PDF
  - 履约
- 分别点击 `PDF / 履约`
- 如果当前被拦截：
  - 确认会收到明确原因
  - 确认订单状态不变
- 如果当前可进入：
  - 确认只会收到占位说明
  - 确认不会真的生成 PDF
  - 确认不会真的触发履约
  - 确认订单状态不变
- 确认 3 个动作的返回结构风格一致，继续复用支付动作占位接口模型

## 23. 测试环境部署准备入口

如果当前优先级切到测试环境联通验证，直接看这两份文档：

- `docs/deploy/test-environment.md`
- `docs/deploy/minimal-smoke-checklist.md`

最小启动步骤：

```bash
cd deploy/docker
cp .env.test.example .env.test
docker compose -f docker-compose.test.yml --env-file .env.test up -d --build
```

联通后优先检查：

- 后台首页是否可访问
- `/api/health` 是否可访问
- `/storage/...` 是否可访问
- 后台登录、模板、作品、订单主链是否可跑通

## 24. 适配 1Panel OpenResty 的部署入口

如果测试服务器已经由 1Panel 的 OpenResty 占用了 `80/443`，不要再直接启动：

```bash
docker compose -f docker-compose.test.yml ...
```

请改走：

```bash
cd deploy/docker
cp .env.test.example .env.test
docker compose -f docker-compose.1panel.yml --env-file .env.test up -d --build
cd ../..
bash deploy/docker/publish-admin-static.sh deploy/docker/.env.test
```

然后把：

- `deploy/nginx/openresty-1panel.conf`

里的路由结构分别配置到：

- `admin.ecomleaf.cn`
- `api.ecomleaf.cn`

详细说明见：

- `docs/deploy/test-environment-1panel.md`
