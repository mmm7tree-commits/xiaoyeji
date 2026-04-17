# Milestone 7：后台模板管理与模板生成闭环 + 作品管理骨架

## 1. 模板生成输入项

当前模板生成输入固定为：

```ts
{
  name: string;
  themeTitle: string;
  categoryCode: "graduation" | "growth" | "classroom";
  pageCount: 16 | 20 | 24 | 28 | 32;
  minPhotos: number;
  maxPhotos: number;
  priceInCents: number;
  promptText: string;
}
```

说明：

- `name`：模板名称
- `themeTitle`：当前模板主题词，影响摘要、封面语气和布局组合
- `categoryCode`：决定模板走毕业纪念 / 成长记录 / 班级活动哪套规则
- `pageCount`：决定蓝图页数
- `minPhotos / maxPhotos`：决定照片建议区间
- `priceInCents`：模板价格
- `promptText`：本轮生成提示词，用来控制内容倾向和场景重心

## 2. 模板生成结果结构

当前不是直接生成自由文本，而是先生成结构化结果：

```ts
{
  categoryName: string;
  themeLabel: string;
  badgeText: string;
  summary: string;
  description: string;
  storyHighlights: string[];
  suitableScenes: string[];
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  photoSuggestionText: string;
  coverTitle: string;
  coverPhrase: string;
  moodLabel: string;
  sceneKeywords: string[];
  sectionPlan: string[];
  pageBlueprints: Array<{
    pageNo: number;
    section: "cover" | "opening" | "content" | "closing";
    layoutType: string;
    title: string;
    caption: string;
    decorativeElements: string[];
  }>;
  previewFrames: Array<{
    pageNo: number;
    section: "cover" | "opening" | "content" | "closing";
    layoutType: string;
    title: string;
    image: string;
    caption: string;
  }>;
}
```

这套结构当前已经足够支撑：

- 模板列表展示
- 模板详情展示
- 后台版本预览
- 后续继续接用户端预览和模板生成服务

## 3. 提示词重生成与版本处理规则

当前规则如下：

1. 首次生成会创建 `V1`
2. 之后每次“调整提示词后重新生成”，都会新建一个版本
3. 新版本不会覆盖旧版本，而是进入版本列表
4. `currentVersionId` 指向当前预览版本
5. `publishedVersionId` 指向当前线上版本
6. 如果模板已经上架，再重新生成：
   - 线上版本仍然保留
   - 新生成版本会作为当前预览版本
   - `hasUnpublishedChanges = true`

这意味着当前后台已经支持：

- 先看新版本
- 再决定是否上架覆盖线上版本

## 4. 模板状态流转

当前最小模板状态为：

- `draft`
- `published`
- `offline`

### 状态说明

- `draft`
  - 草稿或还未正式上架
  - 可以继续编辑和重生成

- `published`
  - 当前模板已经上架
  - `publishedVersionId` 指向线上版本

- `offline`
  - 模板已经下架
  - 可以继续保留版本记录与预览

### 典型流转

```text
新增模板 -> draft
首次生成 -> draft
上架 -> published
已上架模板重生成 -> published + hasUnpublishedChanges=true
再次上架当前预览版本 -> published + hasUnpublishedChanges=false
下架 -> offline
```

## 5. 模板上架 / 推荐 / 删除规则

### 上架

- 必须先有当前版本
- 上架后：
  - `publishedVersionId = currentVersionId`
  - `status = published`
  - `hasUnpublishedChanges = false`

### 推荐

- 只有已上架模板可以设为推荐
- 当前实现默认只有一套推荐模板
- 设置推荐时，会自动取消其他模板的推荐状态

### 删除

当前删除校验规则为：

1. 推荐模板不能删
2. 已上架模板不能删，必须先下架
3. 已被作品引用的模板不能删

删除通过后，才会真正从后台模板数据中移除。

## 6. 后台作品管理当前做到哪一层

当前后台作品管理只做到了骨架层：

- 作品列表
- 作品筛选
- 作品详情
- 预览入口

当前还没有做：

- 与订单联动
- 与模板版本强回溯
- 后台修改作品内容
- 后台改用户作品状态
- 分享、支付、PDF、物流相关能力

因此 M7 的作品管理定位是：

“让运营先能看见作品、回看预览、判断模板适配情况”，而不是完整运营后台。
