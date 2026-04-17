# 小叶记 M7 后台模板管理接口

Milestone 7 只覆盖后台模板管理与模板生成闭环，不包含订单 API 收口、地址 API 收口、真实支付、PDF 和后台订单联动。

## 1. 模板分类接口

### 请求

`GET /api/admin/templates/categories`

### 返回字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `all \| graduation \| growth \| classroom` | 分类编码 |
| `name` | `string` | 分类名称 |
| `description` | `string` | 分类说明 |
| `templateCount` | `number` | 当前分类下模板总数 |
| `publishedCount` | `number` | 当前分类下已上架模板数 |

## 2. 模板列表接口

### 请求

`GET /api/admin/templates?keyword=&categoryCode=&status=`

### 查询参数

| 参数 | 是否必填 | 说明 |
| --- | --- | --- |
| `keyword` | 否 | 搜索模板名称、摘要、主题词 |
| `categoryCode` | 否 | `graduation / growth / classroom` |
| `status` | 否 | `draft / published / offline` |

### 返回字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 模板 ID |
| `slug` | `string` | 模板短标识 |
| `name` | `string` | 模板名称 |
| `categoryCode` | `string` | 分类编码 |
| `categoryName` | `string` | 分类名称 |
| `status` | `draft \| published \| offline` | 模板状态 |
| `statusText` | `string` | 状态文案 |
| `isFeatured` | `boolean` | 是否推荐模板 |
| `hasUnpublishedChanges` | `boolean` | 是否存在未发布版本 |
| `summary` | `string` | 列表摘要 |
| `themeLabel` | `string` | 模板主题词 |
| `pageCount` | `number` | 页数 |
| `minPhotos` | `number` | 最少照片数 |
| `maxPhotos` | `number` | 最多照片数 |
| `priceInCents` | `number` | 价格，单位分 |
| `priceText` | `string` | 价格文案 |
| `coverImage` | `string` | 封面图 |
| `updatedAt` | `string` | 最近更新时间 |
| `versionCount` | `number` | 版本数量 |
| `currentVersionNo` | `number \| null` | 当前预览版本号 |
| `publishedVersionNo` | `number \| null` | 已上架版本号 |
| `relatedWorkCount` | `number` | 被作品引用次数 |

## 3. 模板详情接口

### 请求

`GET /api/admin/templates/:id`

### 返回字段

除列表字段外，还会返回：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `description` | `string` | 详细说明 |
| `badgeText` | `string` | 标签文案 |
| `photoSuggestionText` | `string` | 建议照片数文案 |
| `coverTone` | `string` | 主色 |
| `accentTone` | `string` | 辅助色 |
| `previewImages` | `string[]` | 预览图数组 |
| `storyHighlights` | `string[]` | 重点内容关键词 |
| `suitableScenes` | `string[]` | 适用场景 |
| `currentVersionId` | `string \| null` | 当前预览版本 ID |
| `publishedVersionId` | `string \| null` | 当前线上版本 ID |
| `publishedAt` | `string \| null` | 上架时间 |
| `versions` | `array` | 版本列表摘要 |
| `currentVersion` | `object \| null` | 当前预览版本内容 |
| `publishedVersion` | `object \| null` | 线上版本内容 |
| `rules.canPublish` | `boolean` | 是否允许上架 |
| `rules.canFeature` | `boolean` | 是否允许设推荐 |
| `rules.canDelete` | `boolean` | 是否允许删除 |
| `rules.deleteReason` | `string \| null` | 删除限制原因 |

## 4. 新增模板接口

### 请求

`POST /api/admin/templates`

### 输入字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 模板名称 |
| `categoryCode` | `graduation \| growth \| classroom` | 模板分类 |
| `themeLabel` | `string` | 模板主题词 |
| `summary` | `string` | 列表摘要 |
| `description` | `string` | 模板说明 |
| `badgeText` | `string` | 标签文案 |
| `pageCount` | `16 \| 20 \| 24 \| 28 \| 32` | 页数 |
| `minPhotos` | `number` | 最少照片数 |
| `maxPhotos` | `number` | 最多照片数 |
| `priceInCents` | `number` | 价格，单位分 |

## 5. 编辑模板基础信息接口

### 请求

`PUT /api/admin/templates/:id`

### 输入字段

与新增模板相同，支持部分更新。

## 6. 根据主题生成模板接口

### 请求

`POST /api/admin/templates/generate`

### 输入字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 模板名称 |
| `themeTitle` | `string` | 本次生成的主题词 |
| `categoryCode` | `graduation \| growth \| classroom` | 分类 |
| `pageCount` | `16 \| 20 \| 24 \| 28 \| 32` | 页数 |
| `minPhotos` | `number` | 最少照片数 |
| `maxPhotos` | `number` | 最多照片数 |
| `priceInCents` | `number` | 价格，单位分 |
| `promptText` | `string` | 生成提示词 |

### 返回结果

返回最新模板详情，里面会直接包含：

- 第一版 `versions`
- `currentVersion`
- `currentVersion.result.pageBlueprints`
- `currentVersion.result.previewFrames`

## 7. 提示词调整后重新生成接口

### 请求

`POST /api/admin/templates/:id/regenerate`

### 输入字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `promptText` | `string` | 新提示词 |
| `changeNote` | `string` | 版本备注 |
| `name` | `string` | 可选，覆盖模板名称 |
| `themeTitle` | `string` | 可选，覆盖主题词 |
| `categoryCode` | `string` | 可选，覆盖分类 |
| `pageCount` | `number` | 可选，覆盖页数 |
| `minPhotos` | `number` | 可选，覆盖最少照片 |
| `maxPhotos` | `number` | 可选，覆盖最多照片 |
| `priceInCents` | `number` | 可选，覆盖价格 |

## 8. 模板预览接口

### 请求

`GET /api/admin/templates/:id/preview?versionId=`

### 说明

- 不传 `versionId` 时，默认返回当前预览版本
- 传入 `versionId` 时，返回指定版本

## 9. 模板上架 / 下架 / 推荐 / 删除

### 上架

`POST /api/admin/templates/:id/publish`

### 下架

`POST /api/admin/templates/:id/offline`

### 设为推荐

`POST /api/admin/templates/:id/feature`

### 取消推荐

`POST /api/admin/templates/:id/unfeature`

### 删除

`DELETE /api/admin/templates/:id`

### 删除校验

当前删除会被这些规则拦住：

- 推荐模板不能删
- 已上架模板不能删
- 已被作品引用的模板不能删
