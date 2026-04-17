# 小叶记公开模板接口契约

Milestone 8 开始，用户端公开模板接口已经从“只读本地 seed”逐步切到：

1. 优先读取后台已发布模板版本
2. 如果本地开发环境还没有后台已发布模板，再回退到现有 seed 数据

当前仍然保持“规则驱动 + 结构化 JSON”路线，不做重 AI 集成。

## 1. 推荐模板接口

### 请求

`GET /api/templates/featured`

### 返回字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 模板 ID |
| `slug` | `string` | 模板短标识 |
| `name` | `string` | 模板名称 |
| `categoryCode` | `string` | 模板分类编码 |
| `categoryName` | `string` | 模板分类名称 |
| `summary` | `string` | 首页推荐卡短说明 |
| `description` | `string` | 模板详情描述 |
| `themeLabel` | `string` | 用户可感知的风格标签 |
| `badgeText` | `string` | 推荐角标文案 |
| `photoSuggestionText` | `string` | 建议准备的照片数量文案 |
| `pageCount` | `number` | 当前模板页数 |
| `minPhotos` | `number` | 最少建议照片数 |
| `suggestedMinPhotos` | `number` | 当前建议最少照片数 |
| `orderMinPhotos` | `number` | 后续进入待下单作品的最少照片数 |
| `maxPhotos` | `number` | 当前模板允许上传的最大照片数 |
| `priceInCents` | `number` | 价格，单位分 |
| `priceText` | `string` | 格式化价格文案 |
| `coverTone` | `string` | 封面背景主色 |
| `accentTone` | `string` | 封面背景辅助色 |
| `coverImage` | `string` | 首页封面图路径 |
| `isFeatured` | `boolean` | 是否为当前推荐模板 |
| `isPublished` | `boolean` | 当前是否为已发布模板 |
| `sourceMode` | `"admin_published" \| "seed_fallback"` | 数据来源模式 |
| `templateVersionId` | `string \| null` | 当前用户端消费的模板版本 ID |
| `templateVersionNo` | `number \| null` | 当前用户端消费的模板版本号 |
| `featureTitle` | `string` | 推荐模块标题 |
| `featureDescription` | `string` | 推荐模块说明 |
| `storyHighlights` | `string[]` | 适合展示的回忆点关键词 |
| `previewImages` | `string[]` | 首页预览缩略图数组 |

## 2. 模板分类接口

### 请求

`GET /api/templates/categories`

### 返回字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `string` | 分类编码，当前有 `all / graduation / growth / classroom` |
| `name` | `string` | 分类名称 |
| `description` | `string` | 首页分类说明 |
| `templateCount` | `number` | 当前分类下模板数量 |
| `isDefault` | `boolean` | 是否默认分类 |

## 3. 模板列表接口

### 请求

`GET /api/templates?categoryCode=all`

### 查询参数

| 参数 | 是否必填 | 说明 |
| --- | --- | --- |
| `categoryCode` | 否 | 模板分类编码，默认 `all` |

### 返回字段

返回数组中的每一项包含：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 模板 ID |
| `slug` | `string` | 模板短标识 |
| `name` | `string` | 模板名称 |
| `categoryCode` | `string` | 模板分类编码 |
| `categoryName` | `string` | 模板分类名称 |
| `summary` | `string` | 卡片短说明 |
| `description` | `string` | 模板详情说明 |
| `themeLabel` | `string` | 风格标签 |
| `badgeText` | `string` | 角标文案 |
| `photoSuggestionText` | `string` | 建议照片数文案 |
| `pageCount` | `number` | 模板页数 |
| `minPhotos` | `number` | 最少建议照片数 |
| `suggestedMinPhotos` | `number` | 当前建议最少照片数 |
| `orderMinPhotos` | `number` | 后续进入待下单作品的最少照片数 |
| `maxPhotos` | `number` | 当前模板允许上传的最大照片数 |
| `priceInCents` | `number` | 价格，单位分 |
| `priceText` | `string` | 格式化价格文案 |
| `coverTone` | `string` | 封面背景主色 |
| `accentTone` | `string` | 封面背景辅助色 |
| `coverImage` | `string` | 模板封面图路径 |
| `isFeatured` | `boolean` | 是否推荐模板 |
| `isPublished` | `boolean` | 当前是否为已发布模板 |
| `sourceMode` | `"admin_published" \| "seed_fallback"` | 数据来源模式 |
| `templateVersionId` | `string \| null` | 当前用户端消费的模板版本 ID |
| `templateVersionNo` | `number \| null` | 当前用户端消费的模板版本号 |

### 错误情况

如果 `categoryCode` 不存在，返回：

```json
{
  "ok": false,
  "code": "TEMPLATE_CATEGORY_INVALID",
  "message": "模板分类不存在"
}
```

## 4. 模板详情接口

### 请求

`GET /api/templates/:id`

### 返回字段

除模板列表字段外，额外补充：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `storyHighlights` | `string[]` | 这套模板适合保留的回忆点 |
| `suitableScenes` | `string[]` | 适合的照片场景 |
| `previewImages` | `string[]` | 模板内页预览图数组 |
| `templateVersion` | `object` | 当前用户端消费的模板版本信息 |
| `consumptionConfig` | `object` | 用户端消费模板时使用的运行时配置 |
| `previewModel` | `object` | 用户端预览时消费的结构化结果 |

### `templateVersion`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string \| null` | 当前模板版本 ID |
| `versionNo` | `number \| null` | 当前模板版本号 |
| `createdAt` | `string \| null` | 当前模板版本生成时间 |
| `sourceMode` | `"admin_published" \| "seed_fallback"` | 当前模板版本来源 |

### `consumptionConfig`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `layoutLabel` | `string` | 用户端展示的排版模式文案 |
| `formatLabel` | `string` | 用户端展示的成册规格文案 |
| `bookFormat` | `"square" \| "portrait" \| "landscape"` | 页面比例类别 |
| `pageAspectRatio` | `number` | 用户端预览页比例 |
| `styleFamily` | `string` | 用户端主题样式标识 |
| `styleLabel` | `string` | 用户端主题文案 |
| `suggestedMinPhotos` | `number` | 建议最少照片数 |
| `orderMinPhotos` | `number` | 待下单作品最少照片数 |
| `maxPhotos` | `number` | 最大照片数 |
| `openingLayout` | `string` | 开场页布局类型 |
| `closingLayout` | `string` | 收尾页布局类型 |
| `middleLayoutSequence` | `string[]` | 中段布局顺序 |
| `layoutCapacityOverrides` | `Record<string, number>` | 特定布局的容量覆盖 |

### `previewModel`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `coverTitle` | `string` | 模板默认封面标题语气 |
| `coverPhrase` | `string` | 模板默认封面短语语气 |
| `moodLabel` | `string` | 模板氛围标签 |
| `sceneKeywords` | `string[]` | 模板偏好的场景关键词 |
| `sectionPlan` | `string[]` | 模板章节计划 |
| `pageBlueprints` | `array` | 用户端预览消费的页面蓝图 |
| `previewFrames` | `array` | 模板预览图帧，用户端模板参考区可直接使用 |

### `previewModel.pageBlueprints[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `pageNo` | `number` | 页序号 |
| `section` | `"cover" \| "opening" \| "content" \| "closing"` | 所属章节 |
| `layoutType` | `string` | 页面布局类型 |
| `title` | `string` | 页面主标题 |
| `caption` | `string` | 页面说明文案 |
| `decorativeElements` | `string[]` | 页面装饰元素标识 |

### `previewModel.previewFrames[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `pageNo` | `number` | 页序号 |
| `section` | `string` | 所属章节 |
| `layoutType` | `string` | 页面布局类型 |
| `title` | `string` | 预览标题 |
| `image` | `string` | 预览图地址 |
| `caption` | `string` | 预览图说明 |

## 当前公开模板接口的来源规则

- 如果后台存在已发布模板：公开模板接口只返回“已发布模板”
- 后台推荐模板：优先影响 `GET /api/templates/featured`
- 后台下架模板：会从公开模板列表和模板详情里移除
- 如果当前开发环境还没有任何已发布模板：才回退到 seed 数据

## 当前仍然保留 seed 的部分

当前为了平滑过渡，仍保留一层本地 seed / runtime meta 兜底，主要是：

- `formatLabel`
- `bookFormat`
- `pageAspectRatio`
- `styleFamily`
- `styleLabel`
- `layoutLabel`
- `orderMinPhotos`
- `openingLayout / closingLayout / middleLayoutSequence`
- `layoutCapacityOverrides`

这些字段在后台模板表和模板版本完全接齐之前，仍作为用户端运行时兜底。

### 错误情况

模板不存在时，返回：

```json
{
  "ok": false,
  "code": "TEMPLATE_NOT_FOUND",
  "message": "模板不存在或已下线"
}
```
