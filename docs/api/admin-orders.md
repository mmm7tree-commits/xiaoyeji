# 后台订单接口说明（Milestone 16）

当前后台订单接口只做骨架能力：

- 订单列表
- 订单详情
- 后台读取后端订单数据
- 和用户端统一 `statusCode`
- 订单可生产性 / 可履约性判断

当前不包含：

- 真支付
- 支付回调
- 物流
- PDF
- 退款售后

## 鉴权

后台订单接口需要：

- `Authorization: Bearer <token>`

并要求账号具备：

- `orders:read`

## 统一状态枚举

用户端与后台当前共用：

- `pending_payment`
- `pending_shipment`
- `closed`

其中：

- `pending_payment`：当前正式实现
- `closed`：当前正式实现
- `pending_shipment`：未来状态占位，当前还没有真实支付链路

## 1. 后台订单列表

### `GET /api/admin/orders`

查询参数：

- `keyword`：可选，支持订单号、作品名、模板名、收货人、手机号模糊搜索
- `statusCode`：可选，支持 `pending_payment / pending_shipment / closed`

返回字段：

- `id`
- `orderNo`
- `clientId`
- `workId`
- `workTitle`
- `templateName`
- `templateVersionNo`
- `statusCode`
- `statusText`
- `statusHint`
- `unitPrice`
- `quantity`
- `amount`
- `consigneeName`
- `consigneePhone`
- `assetReady`
- `createdAt`
- `updatedAt`

## 2. 后台订单详情

### `GET /api/admin/orders/:id`

返回字段：

- 订单基础信息
- `addressSnapshot`
- `workSnapshot`
- `templateVersionId`
- `templateVersionNo`
- `detailSections`
- `assetReadiness`
- `productionReadiness`
- `actionAvailability`

### `POST /api/admin/orders/:id/pay-action`

返回字段：

- `actionKey`
- `accepted`
- `blocked`
- `statusCode`
- `statusText`
- `message`
- `placeholderTitle`
- `placeholderDescription`
- `nextStepHint`
- `actionAvailability`

说明：

- 后台当前只接入支付动作占位接口
- 点击时会先走统一的 `payAction` 判断
- 不会真的发起支付
- 不会自动把订单改成 `pending_shipment`

### `POST /api/admin/orders/:id/pdf-action`

返回字段：

- `actionKey`
- `accepted`
- `blocked`
- `statusCode`
- `statusText`
- `message`
- `placeholderTitle`
- `placeholderDescription`
- `nextStepHint`
- `actionAvailability`

说明：

- 后台当前只接入 PDF 动作占位接口
- 点击时会先走统一的 `pdfAction` 判断
- 不会真的生成 PDF
- 不会改变订单状态

### `POST /api/admin/orders/:id/fulfillment-action`

返回字段：

- `actionKey`
- `accepted`
- `blocked`
- `statusCode`
- `statusText`
- `message`
- `placeholderTitle`
- `placeholderDescription`
- `nextStepHint`
- `actionAvailability`

说明：

- 后台当前只接入履约动作占位接口
- 点击时会先走统一的 `fulfillmentAction` 判断
- 不会真的触发发货、物流或履约动作
- 不会改变订单状态

### 详情必须至少能看到

- 订单基础信息
- 地址快照
- 作品快照摘要
- 模板版本号
- 图片资产是否具备后续履约条件
- 当前是否具备后续生产条件

### `productionReadiness` 结构

- `ready`
- `label`
- `description`
- `blockers`
- `checks`

### `actionAvailability` 结构

- `payAction`
- `pdfAction`
- `fulfillmentAction`

每个动作至少包含：

- `visible`
- `enabled`
- `blocked`
- `reason`
- `requiredChecks`

### `checks` 当前至少包含

- `assets_ready`
- `work_snapshot_complete`
- `template_version_complete`
- `address_complete`

## 当前动作判断与状态判断的关系

后台订单详情当前明确区分：

- `statusCode`：订单当前状态
- `actionAvailability`：动作当前是否可用

后台展示文案可以调整，但底层 `statusCode` 必须和用户端一致，不允许后台单独维护另一套状态值。

当前支付动作流也遵守同一规则：

- `statusCode` 仍然只表示订单状态
- `payAction` 只是支付动作当前是否可用

当前 PDF / 履约动作也遵守同一规则：

- `statusCode` 仍然只表示订单状态
- `pdfAction / fulfillmentAction` 只是各自动作当前是否可用

## 当前动作前置规则

### `payAction`

- 仅在 `pending_payment` 时可点
- 满足条件后也只进入支付占位说明

### `pdfAction`

- 依赖 `productionReadiness.ready = true`
- 且订单不能是 `closed`
- 满足条件后也只进入 PDF 占位说明
- 不代表已经生成真实 PDF

### `fulfillmentAction`

- 依赖 `productionReadiness.ready = true`
- 且订单不能是 `closed`
- 满足条件后也只进入履约占位说明
- 不代表已经接入真实发货、物流或履约动作

## 当前可生产性规则

后台当前把以下 4 项作为后续生产 / 履约前置条件：

- 图片资产已经具备服务端资源引用
- 作品快照完整
- 模板版本完整
- 地址快照完整

如果任意一项不满足：

- 订单仍然可以查看
- 但后台详情会明确显示“不具备后续生产条件”
- 后续 PDF / 履约动作接入时，应先拦截这类订单
