# Milestone 8：用户端模板消费对齐 + 后台模板发布结果接入

## 1. 当前目标

Milestone 8 的重点不是把订单、地址、支付继续往后推，而是先把“模板系统”真正接到用户端：

1. 用户端首页与模板入口开始优先消费后台已发布模板
2. 后台模板的推荐 / 上下架结果开始影响用户端模板展示
3. 用户端模板详情与编辑入口开始消费后台模板版本结构
4. 后台模板版本结果与用户端预览结构正式对齐

## 2. 字段边界

### 2.1 后台内部字段

这些字段只服务后台模板管理，不直接给用户端业务页面消费：

- `currentVersionId`
- `publishedVersionId`
- `hasUnpublishedChanges`
- `versions[].promptText`
- `versions[].changeNote`
- `rules.canPublish`
- `rules.canFeature`
- `rules.canDelete`
- `rules.deleteReason`
- `relatedWorkCount`
- 后台列表的内部统计字段

### 2.2 用户端消费字段

这些字段会进入首页、模板列表、模板详情和制作入口：

- `id / slug / name`
- `categoryCode / categoryName`
- `summary / description`
- `themeLabel / badgeText`
- `photoSuggestionText`
- `pageCount`
- `minPhotos / suggestedMinPhotos / orderMinPhotos / maxPhotos`
- `priceInCents / priceText`
- `coverTone / accentTone`
- `coverImage / previewImages`
- `storyHighlights / suitableScenes`
- `isFeatured / isPublished`
- `sourceMode`
- `templateVersion`
- `consumptionConfig`

### 2.3 预览专用字段

这些字段不直接决定首页卡片展示，而是决定制作入口页和完整预览页的结构：

- `previewModel.coverTitle`
- `previewModel.coverPhrase`
- `previewModel.moodLabel`
- `previewModel.sceneKeywords`
- `previewModel.sectionPlan`
- `previewModel.pageBlueprints`
- `previewModel.previewFrames`

### 2.4 进入作品快照的字段

当前会进入作品快照或作品预览上下文的字段：

- `templateId / templateName`
- `templateSourceMode`
- `templateVersionId / templateVersionNo`
- `templateSnapshot`
- `coverTone / accentTone`
- `coverImage / previewImages`
- `pageCount / minPhotos / suggestedMinPhotos / orderMinPhotos / maxPhotos`
- `layoutLabel / formatLabel / bookFormat / pageAspectRatio`
- `styleFamily / styleLabel`
- `openingLayout / closingLayout / middleLayoutSequence`
- `layoutCapacityOverrides`
- `previewModel`

## 3. 模板版本与用户端预览的映射关系

### 3.1 当前映射方式

后台模板的“已发布版本”会产出：

- `pageBlueprints`
- `previewFrames`
- `coverTitle`
- `coverPhrase`
- `sectionPlan`

用户端当前的完整预览会优先按这套结构来生成：

1. 先用 `pageBlueprints` 决定页面顺序和布局类型
2. 再按用户上传照片顺序依次填充页面
3. 不循环复用照片
4. 如果照片不足，就只展示已经能生成出来的页面

### 3.2 当前仍然保留的本地兜底

为了避免一次性推翻现有 demo，当前仍保留一层本地 runtime meta 兜底：

- 页面比例
- 版式容量
- 开场 / 收尾 / 中段顺序
- 样式族和格式标签

这意味着当前用户端已经“不再只吃本地 seed”，但还保留少量本地规则作为运行时兜底。

## 4. 推荐 / 上下架对用户端的影响

### 推荐

- 后台设为推荐后：
  - `GET /api/templates/featured` 会优先返回这套已发布模板
  - 用户端首页“推荐模板”区域会同步更新

### 上架

- 只有已上架模板会出现在：
  - 首页推荐区
  - 模板分类列表
  - 模板详情入口

### 下架

- 模板下架后：
  - 不再出现在公开模板列表
  - 也不能再通过公开模板详情接口进入制作入口

## 5. 当前仍保留本地 seed 的部分

当前还保留本地 seed / legacy runtime meta 的部分是：

- `formatLabel`
- `bookFormat`
- `pageAspectRatio`
- `styleFamily`
- `styleLabel`
- `layoutLabel`
- `orderMinPhotos`
- `openingLayout`
- `closingLayout`
- `middleLayoutSequence`
- `layoutCapacityOverrides`

这些字段当前的职责是：

“在后台模板版本结构已经接入用户端的前提下，继续为 legacy 微信小程序提供稳定的运行时兜底。”

## 6. 当前仍未做的事情

Milestone 8 仍然没有提前做：

- 订单 API 正式收口
- 地址 API 正式收口
- miniapp 全量迁移到 `apps/miniapp`
- 真支付
- PDF
- 后台订单联动
