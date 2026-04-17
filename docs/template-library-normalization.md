# 外部模板归一化说明

## 目标

把外部模板先整理成统一的“模板源数据”，再决定是否进入当前小程序使用的 `data/templates.js`。

这样做有三个好处：

1. 商品规格和视觉风格可以分开维护，不会因为页数或材质变化就重复建模板。
2. 外部来源的路径、预览图、风格信息都能保留，后续复盘和批量导入更轻松。
3. 只有版式已经核实清楚的模板，才进入当前成书预览和自动排版链路。

## 建议分层

### 1. 源模板层

存放在 `data/externalTemplates.js`，用于保留外部来源的完整信息。

建议字段：

- `sourceUrl`: 原始模板页面
- `sourceMeta`: 商品 ID、模板 ID、目录路径、照片容量、规格选项
- `previewAssets`: brief 图和 demo 页预览
- `normalizedProfile`: 场景、尺寸、装订、风格、颜色、容量
- `layoutPatterns`: 先记录粗粒度版式段落
- `elementInventory`: 先区分已确认元素和推断元素

### 2. 本地模板层

存放在 `data/templates.js`，只保留当前小程序已经能直接消费的字段。

当前仓库已经使用的核心字段是：

- `formatLabel`
- `bookFormat`
- `pageAspectRatio`
- `styleFamily`
- `styleLabel`
- `openingLayout`
- `closingLayout`
- `middleLayoutSequence`
- `layouts`
- `previewImages`

### 3. 版式验证层

只有完成下面动作后，才建议把模板提升进 `data/templates.js`：

1. 逐张确认 demo 页属于 `cover / hero / single / duo / mosaic / grid / timeline / quote / letter` 的哪一种。
2. 确认每种内容页的照片槽位数量。
3. 确认封面和结尾页是否有固定文案区。
4. 确认是否需要本地化预览图。

## 模版 1 的当前结论

模板名：`小小幼儿`

已确认信息：

- 来源平台：有福
- 商品号：`yfs006054-6095`
- 模板号：`style_id=14300`
- 商品名：`高清蝴蝶精装竖册`
- 分类：`儿童`
- 照片容量：`46张`
- 规格选项：`22/30 页`、`光膜/高清绒面`
- 资源目录：`resource/design/studio_photo/shuang_8x12_shu/baby/xiaoxiaoyouer/`
- 演示页数量：`8`

已抽出的归一化信息：

- 成书方向：竖版
- 风格家族：`baby`
- 风格标签：童趣明快风
- 可用颜色锚点：亮黄、浅蓝绿、奶油白、白色
- 页面结构至少包含：封面竖页、多个内容跨页、结尾或封底竖页

## 进入现有模板体系的建议流程

### 阶段 A

先把模板录入 `data/externalTemplates.js`，完成来源归档。

### 阶段 B

逐张拆解 demo 预览，把模板映射为现有的 `openingLayout / middleLayoutSequence / closingLayout`。

### 阶段 C

下载并本地化预览图，生成你们自己的 `assets/templates/<slug>/`。

### 阶段 D

补一条 `data/templates.js` 记录，把它接入首页模板卡片和移动端预览页。

## 下一步最值得做的事

如果继续推进模版 1，建议优先做这两步：

1. 把 8 张 demo 预览逐张标成你们自己的版式类型。
2. 把 brief 图和 demo 图同步到本地 `assets/templates/`，避免正式模板库依赖外链。
