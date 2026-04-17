# Milestone 5：地址与订单基础状态模型

## 地址数据结构

当前地址先保存在 legacy 微信小程序本地存储，字段如下：

```js
{
  id: "addr_...",
  name: "王妈妈",
  phone: "13800000000",
  region: "上海市上海市徐汇区",
  regionParts: ["上海市", "上海市", "徐汇区"],
  detail: "漕溪北路 18 号 2 楼",
  isDefault: true,
  updatedAt: 0
}
```

## 默认地址逻辑

- 有默认地址时，确认订单页会自动带出默认地址
- 没有默认地址时，确认订单页会明确提示“请先新增默认地址”
- 地址页支持：
  - 新增地址
  - 编辑地址
  - 删除地址
  - 设为默认地址
- 删除默认地址后：
  - 若仍有其他地址，则自动补一条默认地址
  - 若没有其他地址，则当前无默认地址

## 作品进入下单页时携带的字段

M5 保持“作品与订单分离”，因此进入确认订单页时，读取的是作品快照信息，而不是把作品本体改写成订单。

当前会带入这些字段：

- `id`
- `title`
- `templateId`
- `templateName`
- `price`
- `coverTone`
- `accentTone`
- `photos`
- `photoCount`
- `pageCount`
- `coverTitle`
- `babyInfo`
- `coverPhrase`
- `statusCode`
- `statusText`
- `orderMinPhotos`

只有 `statusCode === ready` 且照片数达到 `orderMinPhotos` 的作品，才允许进入确认订单页。

## 订单数据结构

当前订单结构如下：

```js
{
  id: "order_...",
  orderNo: "XYJ...",
  workId: "work_...",
  workTitle: "小一班毕业啦",
  templateId: "summer-square",
  templateName: "小花园毕业册",
  statusCode: "pending_payment",
  statusText: "待支付",
  status: "待支付",
  statusHint: "支付能力将在后续里程碑接入，当前先保留订单记录和待支付状态。",
  unitPrice: 12900,
  amount: 25800,
  quantity: 2,
  addressId: "addr_...",
  addressSnapshot: {
    id: "addr_...",
    name: "王妈妈",
    phone: "13800000000",
    region: "上海市上海市徐汇区",
    regionParts: ["上海市", "上海市", "徐汇区"],
    detail: "漕溪北路 18 号 2 楼",
    isDefault: true
  },
  workSnapshot: {
    id: "work_...",
    title: "小一班毕业啦",
    templateId: "summer-square",
    templateName: "小花园毕业册",
    coverTitle: "小一班毕业啦",
    babyInfo: "向日葵幼儿园 · 小一班",
    coverPhrase: "把最后一个夏天的笑脸留在这里",
    coverTone: "#EAF7D6",
    accentTone: "#F7EAA2",
    coverPhoto: "...",
    photoCount: 12,
    generatedPageCount: 8,
    suggestedMinPhotos: 8,
    orderMinPhotos: 12,
    statusCode: "ready",
    statusText: "待下单"
  },
  remark: "",
  paymentCapabilityReady: false,
  createdAt: 0,
  updatedAt: 0
}
```

## 订单状态流转规则

M5 先只做最小订单状态：

- `pending_payment / 待支付`
  - 生成订单后的默认状态
  - 当前不代表已经接通支付能力

- `pending_shipment / 待发货`
  - 先作为支付完成后的占位状态预留
  - 本轮不接真实支付与发货流程

- `closed / 已关闭`
  - 先作为取消 / 超时关闭的占位状态
  - 本轮不会接真实退款

## 当前哪些能力仍然只是占位

以下能力在 M5 仍然只是状态预留或页面占位，不算“已完成”：

- 真实支付
- 微信支付 / 抖音支付 / 小红书支付接入
- 发货与物流
- 退款与售后
- PDF 生成
- 后台订单联动

因此，M5 的定位是：

- 可以生成订单
- 可以查看订单详情
- 可以保留订单状态

但还不能宣称“已完成支付链路”。

## 已形成可迁移的模型

当前以下模型已经可以从 legacy 微信小程序平滑迁移到 `apps/miniapp`：

- 地址模型
- 默认地址规则
- 订单模型
- 订单状态模型
- 作品进入下单页的作品快照模型

后续迁移时，需要替换的主要是：

- 页面实现
- 存储层
- 平台支付与下单能力接入

而不是重新设计这些基础字段和状态。
