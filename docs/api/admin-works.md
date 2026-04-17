# 小叶记 M7 后台作品管理接口

Milestone 7 的后台作品管理只做到骨架层，不做复杂联动。

## 1. 作品列表接口

### 请求

`GET /api/admin/works?keyword=&status=&templateId=`

### 查询参数

| 参数 | 是否必填 | 说明 |
| --- | --- | --- |
| `keyword` | 否 | 搜索作品名、家长、幼儿园信息 |
| `status` | 否 | `draft / ready / ordered` |
| `templateId` | 否 | 按模板 ID 筛选 |

### 返回字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 作品 ID |
| `title` | `string` | 作品标题 |
| `templateId` | `string` | 模板 ID |
| `templateName` | `string` | 模板名称 |
| `status` | `draft \| ready \| ordered` | 作品状态 |
| `statusText` | `string` | 状态文案 |
| `parentName` | `string` | 家长称呼 |
| `kindergartenInfo` | `string` | 幼儿园 / 班级信息 |
| `photoCount` | `number` | 照片数 |
| `pageCount` | `number` | 页数 |
| `previewPageCount` | `number` | 后台可看的预览页数 |
| `coverImage` | `string` | 封面图 |
| `previewSummary` | `string` | 当前预览摘要 |
| `updatedAt` | `string` | 更新时间 |

## 2. 作品详情接口

### 请求

`GET /api/admin/works/:id`

### 返回字段

除列表字段外，还返回：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `childName` | `string` | 孩子昵称 |
| `coverTitle` | `string` | 封面标题 |
| `babyInfo` | `string` | 幼儿园 / 宝宝信息 |
| `coverPhrase` | `string` | 封面短语 |
| `detailSections` | `array` | 详情摘要 |
| `previewEntrance.title` | `string` | 预览入口标题 |
| `previewEntrance.description` | `string` | 预览入口说明 |
| `previewEntrance.frames` | `array` | 预览帧列表 |

## 当前边界

M7 的后台作品管理只做到了：

- 列表
- 详情
- 预览入口

当前还没有做：

- 后台编辑作品
- 后台改作品状态
- 与订单联动
- 与模板版本强绑定回滚
