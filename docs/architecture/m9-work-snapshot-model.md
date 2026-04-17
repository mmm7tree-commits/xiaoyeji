# M9 作品后端收口与模板快照冻结规则

## 1. 当前目标

Milestone 9 只解决一件关键事：

- 让作品从“本地存储优先”进入“后端保存优先”
- 同时把模板版本与作品快照的边界固定下来

## 2. 作品保存规则

### 新建草稿或新进入模板时

- 可以消费当前最新已发布模板版本
- 这一步仍然允许看到模板最新结果

### 一旦保存为作品

必须冻结以下内容：

- `templateVersionId`
- `templateVersionNo`
- `templateSnapshot`
- `previewData`
- `previewModel`
- 当前预览生成依赖的关键模板字段

## 3. 历史作品与新模板版本的隔离

后台后续如果重新生成并发布了新模板版本：

- 不会回写旧作品
- 不会重新覆盖旧作品的 `templateSnapshot`
- 不会重新覆盖旧作品的 `previewData`

历史作品回看预览时：

- 优先使用作品保存时冻结下来的 `previewData.pages`
- 模板参考区优先使用 `templateSnapshot.previewModel.previewFrames`
- 不再回头消费“当前最新模板版本”

## 4. 作品后端数据结构

当前后端作品记录主要分为 4 层：

### 4.1 基础层

- `id`
- `clientId`
- `title`
- `statusCode / statusText`
- `createdAt / updatedAt`

### 4.2 模板冻结层

- `templateId / templateName`
- `templateSourceMode`
- `templateVersionId / templateVersionNo`
- `templateSnapshot`

### 4.3 预览冻结层

- `previewData`
- `layoutPlan`
- `pageCount / photoCount`

### 4.4 封面与照片层

- `coverTitle`
- `babyInfo`
- `coverPhrase`
- `photos`
- `coverImage`

## 5. 当前仍保留的本地作品逻辑

虽然作品保存已经优先走后端，但当前还保留了一层本地缓存：

- 作品列表读取失败时，可回退到本地缓存
- 作品详情读取失败时，可回退到本地缓存
- 删除作品时，仍会顺手清理当前设备上保存过的本地图片文件
- “我的”页和后续订单占位链路，当前仍会读本地作品缓存做兼容

这层本地逻辑现在的定位是：

- 缓存与兼容层

而不是：

- 作品主存储

## 6. 用户端与后端作品接口契约

### 创建作品

用户端传：

- `templateId`
- `draft.coverTitle`
- `draft.babyInfo`
- `draft.coverPhrase`
- `draft.photos`

后端返回：

- 完整作品记录
- 冻结后的 `templateSnapshot`
- 冻结后的 `previewData`

### 读取作品列表

用户端拿到：

- 作品列表摘要字段
- 用于列表展示的状态、封面、页数、照片数

### 读取作品详情

用户端拿到：

- 完整作品结构
- 预览页直接消费这份作品详情

## 7. 当前边界

M9 仍然没有做：

- 地址 API 正式收口
- 订单 API 正式收口
- 真支付
- PDF
- 后台订单联动
- miniapp 全量迁移
