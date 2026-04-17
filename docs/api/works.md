# 作品接口说明（Milestone 9）

当前作品接口已经开始后端化，但仍处于“作品优先收口、订单与地址后置”的阶段。

## 设备标识

所有作品接口当前都需要请求头：

- `X-Xiaoyeji-Client-Id`

当前它用于区分不同设备上的作品数据，只是 M9 的过渡方案，不等价于正式用户登录。

## 1. 保存作品

### `POST /api/works`

请求体：

```json
{
  "templateId": "summer-square",
  "draft": {
    "coverTitle": "小一班毕业啦",
    "babyInfo": "向日葵幼儿园 · 小一班",
    "coverPhrase": "把最后一个夏天的笑脸留在这里",
    "photos": [
      {
        "id": "draft_photo_1",
        "path": "http://127.0.0.1:3100/storage/work-assets/2026/04/photo.jpg",
        "localPath": "wxfile://store/xxx.jpg",
        "tempPath": "wxfile://tmp/xxx.jpg",
        "size": 102400,
        "saved": true,
        "source": {
          "kind": "wx_local",
          "localPath": "wxfile://store/xxx.jpg",
          "tempPath": "wxfile://tmp/xxx.jpg"
        },
        "asset": {
          "assetId": "asset_xxx",
          "storageDriver": "local",
          "relativePath": "work-assets/2026/04/photo.jpg",
          "publicUrl": "http://127.0.0.1:3100/storage/work-assets/2026/04/photo.jpg",
          "mimeType": "image/jpeg",
          "uploadedAt": "2026-04-15T10:00:00.000Z"
        },
        "previewUrl": "http://127.0.0.1:3100/storage/work-assets/2026/04/photo.jpg",
        "fulfillmentUrl": "http://127.0.0.1:3100/storage/work-assets/2026/04/photo.jpg"
      }
    ]
  }
}
```

返回字段：

- `id`：作品 ID
- `templateId / templateName`
- `templateVersionId / templateVersionNo`
- `templateSnapshot`
- `previewData`
- `photos`
- `statusCode / statusText`
- `createdAt / updatedAt`

说明：

- 保存作品时会重新读取当前最新已发布模板版本
- 一旦保存成功，就会冻结模板快照和预览结果
- 保存作品前，图片必须先完成服务端持久化，不能只保留设备本地路径

## 2. 我的作品列表

### `GET /api/works`

查询参数：

- `statusCode`：可选，`draft / ready`

返回字段：

- `id`
- `title`
- `templateId / templateName`
- `templateSourceMode`
- `templateVersionNo`
- `scene`
- `coverTone / accentTone`
- `coverImage / coverPhoto`
- `photoCount`
- `pageCount`
- `suggestedMinPhotos / orderMinPhotos`
- `statusCode / statusText`
- `createdAt / updatedAt`

## 3. 作品详情

### `GET /api/works/:id`

返回字段：

- 列表字段全部保留
- `templateSnapshot`
- `previewData`
- `layoutPlan`
- `photos`
  - 每张图片里会区分：
    - 原始来源 `source`
    - 服务端持久化结果 `asset`
    - 当前预览 / 后续履约地址 `previewUrl / fulfillmentUrl`
- `coverTitle / babyInfo / coverPhrase`
- `formatLabel / bookFormat / pageAspectRatio`
- `styleFamily / styleLabel`
- `openingLayout / closingLayout / middleLayoutSequence`

说明：

- 历史作品详情优先使用保存时冻结下来的 `templateSnapshot + previewData`
- 不会回头消费当前最新模板版本

## 4. 删除作品

### `DELETE /api/works/:id`

当前只用于“我的作品”列表里的删除动作。

返回字段：

- `id`
- `deleted`

## 当前边界

M9 只做到：

- 作品保存接口后端化
- 我的作品列表接口后端化
- 作品详情接口后端化
- 历史作品预览读取快照化

当前还没有做：

- 订单 API 正式收口
- 真支付
- PDF
- 后台订单联动
