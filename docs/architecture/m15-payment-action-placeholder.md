# M15 支付占位接口边界

Milestone 15 只做：

- 支付动作的后端占位接口
- 用户端与后台统一走后端支付动作判断
- 支付占位返回结构
- 支付入口文案与状态提示收口

当前不包含：

- 真支付
- 支付回调
- 自动状态流转
- PDF
- 物流
- 退款售后

## 1. 目标

当前要把支付入口从“前端按钮占位”推进成“后端支付动作占位接口”。

这一步的重点不是扣款，而是先固定：

- 支付入口边界
- 支付动作前置条件
- 支付占位返回结构
- 用户端与后台共用同一套支付动作判断

## 2. 统一原则

当前仍然明确区分：

- `statusCode`：订单状态
- `actionAvailability.payAction`：支付动作当前是否可用

两者不能混用。

## 3. 支付动作前置条件

当前 `payAction` 只依赖：

- `statusCode = pending_payment`

说明：

- 当前不要求和 `productionReadiness` 永久强绑定
- 生产条件仍然主要作为 PDF / 履约动作的统一前置依据

## 4. 支付占位接口

当前分别提供：

- 用户端：`POST /api/orders/:id/pay-action`
- 后台：`POST /api/admin/orders/:id/pay-action`

两端都返回统一结构：

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

## 5. 返回规则

### 5.1 可进入占位流程

当 `payAction` 当前可用时：

- `accepted = true`
- `blocked = false`
- 返回“支付能力开发中”等占位说明
- 当前不会真的发起扣款
- 当前不会修改订单状态

### 5.2 被拦截

当 `payAction` 不可用时：

- `accepted = false`
- `blocked = true`
- 返回明确拦截原因
- 当前不会发起支付
- 当前不会修改订单状态

## 6. 当前正式实现与未来占位

当前正式实现：

- 支付动作前置判断
- 支付占位接口
- 用户端 / 后台统一走后端判断
- 支付入口文案与提示收口

当前仍然只是未来占位：

- 真支付
- 支付回调
- 自动进入 `pending_shipment`
- 真实支付成功后的后续履约流
