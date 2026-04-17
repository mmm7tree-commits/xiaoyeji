# Milestone 4：草稿转作品与作品状态模型

## 草稿转作品时保留的字段

当前从模板草稿保存为作品时，会保留这些核心字段：

- 模板信息：`templateId`、`templateName`、`scene`
- 封面信息：`coverTitle`、`babyInfo`、`coverPhrase`
- 照片信息：`photos`、`photoCount`
- 模板规则：`suggestedMinPhotos`、`orderMinPhotos`、`maxPhotos`
- 版式信息：`layoutLabel`、`formatLabel`、`bookFormat`、`styleFamily`
- 预览结果：`previewData`、`layoutPlan`
- 作品状态：`statusCode`、`statusText`
- 时间信息：`createdAt`、`updatedAt`

## 作品状态流转规则

Milestone 4 只建模最小作品状态，不进入订单与履约：

- `draft / 继续补充`
  - 照片数 `< orderMinPhotos`
  - 允许保存
  - 允许回看预览
  - 说明这本作品还没到待下单门槛

- `ready / 待下单`
  - 照片数 `>= orderMinPhotos`
  - 允许保存
  - 允许回看预览
  - 为后续里程碑进入下单链路做准备

当前 M4 不做：

- 已下单
- 待支付
- 制作中
- 已完成

这些状态会在后续订单里程碑再接入。

## 作品再次进入预览时的数据复用

当前保存作品时，会把结构化 `previewData` 一并落到作品记录中。

因此从作品再次进入预览时：

- 优先复用同一份 `previewData.pages`
- 不需要重新做一次不同口径的排版计算
- 预览页和保存时看到的是同一套页面结果

如果是历史作品还没有 `previewData`，则退回到已有 `layoutPlan` 兼容读取。

## 当前哪些状态模型已经可以直接迁移到 `apps/miniapp`

已经可以直接迁移的模型包括：

- 模板草稿模型
- 模板照片限制模型
- 结构化预览结果模型
- 作品模型
- 作品状态模型

也就是说，后续从 legacy 微信小程序迁到 `apps/miniapp` 时，可以直接复用：

- 字段结构
- 状态判断
- 页面间导航所依赖的数据形态

需要迁的主要是：

- 页面实现
- 平台上传适配
- 存储层封装

而不是重新设计业务模型本身。
