# M10 图片资产后端收口 + 地址 API + 确认订单依赖说明

## 1. 分层原则

Milestone 10 明确把“作品结构后端化”和“图片资产后端化”拆开建模：

- 作品结构：保存作品主记录、模板快照、预览快照
- 图片资产：负责把设备本地路径转成服务端可访问资源

两者不是同一层能力。

## 2. 图片资产结构

当前每张作品图片会区分三层信息：

- 原始来源：
  - `source.kind`
  - `source.localPath`
  - `source.tempPath`
- 服务端持久化结果：
  - `asset.assetId`
  - `asset.storageDriver`
  - `asset.relativePath`
  - `asset.publicUrl`
  - `asset.mimeType`
  - `asset.uploadedAt`
- 当前消费地址：
  - `path`
  - `previewUrl`
  - `fulfillmentUrl`

## 3. 本地路径到服务端资源引用的过渡

当前过渡路径固定为：

1. 用户在微信端选择图片，先拿到本地 `wxfile://` 路径
2. 制作页点击“保存到我的作品”前，先调用图片上传接口
3. 服务端把文件保存到本地磁盘目录
4. 服务端返回可访问 URL
5. 用户端再用这些服务端资源引用去保存作品

因此：

- 草稿阶段可以存在本地路径
- 一旦保存为作品，就必须具备服务端资源引用

## 4. 当前开发环境的图片可访问方案

当前开发环境使用：

- `STORAGE_DRIVER=local`
- `STORAGE_LOCAL_ROOT=./uploads`
- `ASSET_PUBLIC_BASE_URL=http://127.0.0.1:3100`

服务端会把图片写入本地目录，再通过：

- `/storage/...`

对外提供可访问 URL。

这套方案满足当前开发环境下：

- 用户换设备回看作品
- 后端读取作品图片
- 后续生成 PDF / 履约所需的基础资源访问

## 5. 模板快照与图片资产的关系

- 模板快照解决“版本变化不能影响旧作品”
- 图片资产解决“作品图片不能只停留在设备本地路径”

两者共同保证：

- 历史作品预览稳定
- 图片资源可被后端长期访问

## 6. 确认订单页当前正式依赖的后端字段

确认订单页这轮开始正式依赖：

- 作品详情：
  - `id`
  - `title`
  - `templateName`
  - `templateSourceMode`
  - `templateVersionId`
  - `templateVersionNo`
  - `price`
  - `pageCount`
  - `photoCount`
  - `statusCode`
  - `orderMinPhotos`
  - `photos`
- 地址数据：
  - `id`
  - `name`
  - `phone`
  - `region`
  - `regionParts`
  - `detail`
  - `isDefault`

## 7. 当前边界

Milestone 10 只做到：

- 图片资产后端化
- 地址 API 正式收口
- 确认订单页读取后端作品和后端地址

当前仍未做：

- 真支付
- PDF
- 后台订单联动
- 物流
- 退款
- miniapp 全量迁移
