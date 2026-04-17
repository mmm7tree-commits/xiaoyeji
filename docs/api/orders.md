# 订单接口说明（Milestone 16）

当前订单接口已经开始正式后端化，但当前仍然只做到“创建订单 + 订单列表 + 订单详情 + 关闭订单 + 可生产性判断”这条最小链路。

## 设备标识

所有订单接口当前都需要请求头：

- `X-Xiaoyeji-Client-Id`

它当前仍然是开发阶段的设备级隔离方案，不等价于正式用户登录。

## 1. 创建订单

### `POST /api/orders`

请求体：

```json
{
  "workId": "work_123",
  "addressId": "addr_123",
  "quantity": 2,
  "remark": "请帮我备注小一班"
}
```

返回字段：

- `id`
- `orderNo`
- `workId / workTitle`
- `templateId / templateName`
- `templateVersionId / templateVersionNo`
- `statusCode / statusText / statusHint`
- `unitPrice / quantity / amount`
- `addressSnapshot`
- `workSnapshot`
- `remark`
- `paymentCapabilityReady`
- `productionReadiness`
- `actionAvailability`
- `createdAt / updatedAt`

说明：

- 创建订单时不会只保存 `workId`
- 会同时冻结订单快照
- 会同时返回当前订单的可生产性判断
- 当前还没有接入真实支付

## 2. 订单列表

### `GET /api/orders`

查询参数：

- `statusCode`：可选，`pending_payment / pending_shipment / closed`

返回字段：

- `id`
- `orderNo`
- `workId / workTitle`
- `templateId / templateName`
- `templateVersionNo`
- `statusCode / statusText / statusHint`
- `unitPrice / quantity / amount`
- `workSnapshot`
- `createdAt / updatedAt`

## 3. 订单详情

### `GET /api/orders/:id`

返回字段：

- 列表字段全部保留
- `templateVersionId`
- `addressId`
- `addressSnapshot`
- `workSnapshot`
- `remark`
- `paymentCapabilityReady`
- `productionReadiness`
- `actionAvailability`

`productionReadiness` 结构：

- `ready`
- `label`
- `description`
- `blockers`
- `checks`

`actionAvailability` 结构：

- `payAction`
- `pdfAction`
- `fulfillmentAction`

每个动作至少包含：

- `visible`
- `enabled`
- `blocked`
- `reason`
- `requiredChecks`

`checks` 当前至少包含：

- `assets_ready`
- `work_snapshot_complete`
- `template_version_complete`
- `address_complete`

## 4. 关闭订单

### `POST /api/orders/:id/close`

返回字段：

- 完整订单结构

说明：

- 当前只允许关闭“待支付”订单
- 当前只是关闭占位，不触发真实退款

## 5. 支付占位动作

### `POST /api/orders/:id/pay-action`

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

- 当前只做“支付动作占位接口”
- 不会真的发起扣款
- 不会改变订单状态
- 会先复用后端统一的 `payAction` 判断

## 6. PDF 占位动作

### `POST /api/orders/:id/pdf-action`

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

- 当前只做“PDF 动作占位接口”
- 不会真的生成 PDF 文件
- 不会改变订单状态
- 会先复用后端统一的 `pdfAction` 判断

## 7. 履约占位动作

### `POST /api/orders/:id/fulfillment-action`

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

- 当前只做“履约动作占位接口”
- 不会真的触发发货、物流或履约动作
- 不会改变订单状态
- 会先复用后端统一的 `fulfillmentAction` 判断

## 当前状态边界

当前正式实现：

- `pending_payment`
- `closed`

当前仍然只是未来占位：

- `pending_shipment`

## 当前动作可用性模型

当前会把“状态判断”和“动作判断”分开返回：

- `statusCode`：订单当前状态
- `actionAvailability`：动作当前是否可用

### 1. `payAction`

前置条件：

- `statusCode = pending_payment`

说明：

- 满足条件时也只进入“支付动作占位说明”
- 不代表已经接入真实支付

### 2. `pdfAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 满足条件时也只进入“PDF 动作占位说明”
- 不代表已经生成真实 PDF

### 3. `fulfillmentAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 满足条件时也只进入“履约动作占位说明”
- 不代表已经接入真实发货、物流或履约动作

## 当前可生产性规则

订单当前只有在以下条件都满足时，才算具备后续生产 / 履约准备：

- 图片资产已经具备服务端资源引用
- 作品快照完整
- 模板版本完整
- 地址快照完整

如果其中任何一项缺失：

- 当前不会阻止历史订单查看
- 但会明确标记为“不具备后续生产条件”
- 后续 PDF / 履约能力接入时，应先拦截这类订单

## 当前动作占位返回规则

点击任一动作后：

- 如果 `blocked = true`
  - 返回明确拦截原因
  - 当前不会进入真实动作
  - 当前不会改变订单状态
- 如果 `accepted = true`
  - 返回对应动作的占位说明
  - 当前不会真的执行支付、PDF 或履约
  - 当前仍保持原有订单状态

## 当前边界

Milestone 16 不包含：

- 真支付
- 支付回调
- PDF 真实生成
- 发货
- 物流
- 退款售后
