# Milestone 3：制作入口与预览数据模型

## 当前仍在 legacy 微信小程序目录里的实现

Milestone 3 继续复用仓库根目录微信小程序 demo，不直接迁入 `apps/miniapp`：

- `pages/template-detail/*`
- `pages/preview/*`
- `utils/template-draft.js`
- `utils/template-preview.js`
- `utils/http.js`
- `utils/template-api.js`

这样做的原因是：M3 只验证“上传照片 + 封面信息 + 完整预览入口”主链路，先在现有可运行 demo 上小步迭代，不在这一轮做 uni-app 页面迁移。

## 后续会迁移到 `apps/miniapp` 的能力

后续里程碑会把以下能力迁移到 `apps/miniapp`：

- 制作入口页状态管理
- 上传照片组件
- 模板详情到编辑页的导航状态
- 结构化预览数据生成器
- 预览页翻页状态
- 平台 adapter 下的上传与本地存储封装

当前已经形成可迁移的“数据结构 + 页面状态模型”，后面迁移时可以直接复用规则和字段，不需要重新设计页面状态。

## 当前草稿数据结构

制作入口页使用 `templateDraft` 维护模板级草稿：

```js
{
  templateId: "summer-square",
  coverTitle: "小一班毕业啦",
  babyInfo: "向日葵幼儿园 · 小一班",
  coverPhrase: "把最后一个夏天的笑脸留在这里",
  photos: [
    {
      id: "draft_photo_...",
      path: "...",
      tempPath: "...",
      size: 0,
      saved: true
    }
  ],
  updatedAt: 0
}
```

## 当前预览数据结构

完整预览页使用 `templatePreview.buildPreviewData()` 生成结构化结果：

```js
{
  version: 1,
  mode: "draft",
  generatedAt: 0,
  templateId: "summer-square",
  templateName: "小花园毕业册",
  coverTitle: "小一班毕业啦",
  babyInfo: "向日葵幼儿园 · 小一班",
  coverPhrase: "把最后一个夏天的笑脸留在这里",
  minPhotos: 8,
  maxPhotos: 40,
  photoCount: 12,
  generatedPageCount: 6,
  photos: [],
  pages: [
    {
      id: "draft_cover",
      type: "cover",
      title: "小一班毕业啦",
      subtitle: "向日葵幼儿园 · 小一班",
      caption: "把最后一个夏天的笑脸留在这里",
      photoIds: ["photo_1"]
    }
  ]
}
```

## 照片顺序规则

- 上传时，按用户本次选择的先后顺序追加到草稿末尾
- 删除照片后，剩余照片保持原顺序不变
- 完整预览按当前草稿中的照片顺序消费
- 当前版本不会自动打乱、不会按内容智能重排

## 最少 / 最多照片规则

- 每个模板都有两套最少值：
  - `suggestedMinPhotos`：建议最少值，影响“预览是否更完整”
  - `orderMinPhotos`：待下单作品最少值，影响“保存后是什么作品状态”
- `maxPhotos` 仍表示当前模板的上传上限
- 达到上限后，不再继续加入新照片，并提示“当前模板最多可上传 X 张照片，请删除后继续添加”
- 少于 `suggestedMinPhotos` 时：
  - 允许继续预览
  - 但会提示当前只展示已生成好的页面
- 少于 `orderMinPhotos` 时：
  - 允许继续预览
  - 允许先保存为“继续补充”作品
  - 但不能保存成“待下单”作品
- 预览页只展示当前已经能生成的页面，不会循环重复照片补满整册

## 预览生成规则

- 采用“规则驱动 + 结构化 JSON 结果”
- 先生成封面页
- 再按模板的 opening / middle / closing 布局规则生成内容页
- 每一页根据当前剩余照片数量选择最合适的布局
- 当剩余照片不足以支撑更多页面时，停止生成

## 当前是过渡实现，不是最终归宿

Milestone 3 的目标是把主链路做通，不是把这套实现永远留在 legacy 目录。

后续迁移到 `apps/miniapp` 时，会保持：

- 字段结构不变
- 规则驱动思路不变
- 页面状态模型不变

这样可以降低迁移成本，也能让后端模板规则和前端预览规则逐步收口。
