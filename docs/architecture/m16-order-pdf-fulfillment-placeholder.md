# M16 PDF / 履约动作占位模型

## 本轮目标

Milestone 16 只做两件事：

- 把 `pdfAction`
- 把 `fulfillmentAction`

正式接入和 `payAction` 同一套后端动作流。

本轮明确不做：

- PDF 真实生成
- 发货
- 物流
- 退款售后
- 真实状态流转

## 统一动作返回结构

M16 沿用 M15 已经建立的动作占位返回结构，不再额外新造一套返回格式。

统一结构：

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

## 动作前置条件

### 1. `payAction`

前置条件：

- `statusCode = pending_payment`

说明：

- 当前不和 `productionReadiness` 永久强绑定
- 可进入时也只是支付占位说明

### 2. `pdfAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 满足条件时也只是 PDF 占位说明
- 当前不会真的生成 PDF 文件

### 3. `fulfillmentAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 满足条件时也只是履约占位说明
- 当前不会真的发货，也不会进入物流链路

## 点击动作时的规则

### 被拦截

如果：

- `blocked = true`

则：

- 返回明确原因
- 当前不会进入真实动作
- 当前不会修改订单状态

### 可以进入

如果：

- `accepted = true`

则：

- 返回动作占位说明
- 当前仍然不会执行真实支付 / PDF / 履约
- 当前不会修改订单状态

## 后台接入范围

后台订单详情页当前已经接入：

- 支付动作入口
- PDF 动作入口
- 履约动作入口

三者都统一走后端接口与前置校验，不再只靠前端本地判断。

## 当前边界

本轮正式实现的是：

- 动作可用性判断
- 动作占位接口
- 动作点击前置拦截
- 后台详情页接入统一动作流

本轮仍然只是未来占位的是：

- 真支付
- 支付回调
- PDF 真实生成
- 发货
- 物流
- 退款售后
