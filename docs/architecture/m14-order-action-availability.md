# M14 后台订单动作可用性模型

Milestone 14 只做：

- 后台订单详情中的动作按钮位
- 统一动作可用性判断
- 点击前置校验与拦截原因
- 用户端与后台共用动作判断口径

当前不包含：

- 真支付
- 支付回调
- PDF 真实生成
- 发货
- 物流
- 退款售后

## 1. 模型目标

当前订单模块里，需要把这两层明确拆开：

- `statusCode`：订单当前状态
- `actionAvailability`：当前动作是否可用

它们不能混成一套逻辑。

## 2. 动作可用性模型

当前统一返回：

- `payAction`
- `pdfAction`
- `fulfillmentAction`

每个动作至少包含：

- `visible`
- `enabled`
- `blocked`
- `reason`
- `requiredChecks`

## 3. 动作前置条件

### 3.1 支付动作 `payAction`

前置条件：

- `statusCode = pending_payment`

说明：

- 如果订单已经关闭，支付动作会被拦截
- 如果订单已经进入未来状态占位，也不会继续开放支付动作
- 就算当前可点，也只进入“支付占位说明”

### 3.2 PDF 动作 `pdfAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 当前图片资产、作品快照、模板版本、地址快照 4 项都要齐
- 满足条件后也只进入“PDF 占位说明”

### 3.3 履约动作 `fulfillmentAction`

前置条件：

- `productionReadiness.ready = true`
- `statusCode != closed`

说明：

- 当前和 PDF 共用同一套可生产性前置条件
- 满足条件后也只进入“履约占位说明”

## 4. 点击拦截规则

点击动作前必须先看 `actionAvailability`：

- `blocked = true`
  - 不进入后续流程
  - 直接展示 `reason`
- `enabled = true`
  - 也不代表能力已完成
  - 只进入“动作占位说明”

## 5. 后端优先原则

当前后端是动作判断的主来源：

- 后端返回 `productionReadiness`
- 后端返回 `actionAvailability`

本地缓存层只允许做兜底：

- 仅当后端没有返回相关字段时，才允许本地补算
- 本地补算不能覆盖后端已经返回的 `productionReadiness`
- 本地补算不能覆盖后端已经返回的 `actionAvailability`

## 6. 当前边界

当前已经正式实现：

- 动作模型结构
- 动作前置条件判断
- 点击前置拦截
- 后台动作按钮位
- 用户端动作说明同步

当前仍然只是未来占位：

- 真支付
- 支付回调
- PDF 真实生成
- 发货
- 物流
- 退款售后
