# 小叶记现有 demo 迁移映射表

| 原目录 / 文件 | 是否保留 | 迁移目标目录 | 迁移原因 |
| --- | --- | --- | --- |
| `/Users/yettree/Documents/kidsphotos/app.js` | 保留 | `apps/miniapp/src/App.vue` | 当前微信小程序全局原型入口，后续迁移为 uni-app 应用入口 |
| `/Users/yettree/Documents/kidsphotos/app.json` | 保留 | `apps/miniapp/src/pages.json` / `manifest.json` | 当前页面路由和导航配置可作为 uni-app 页面结构参考 |
| `/Users/yettree/Documents/kidsphotos/app.wxss` | 保留 | `apps/miniapp/src/styles/` | 当前小程序全局样式可提炼为多端基础样式 |
| `/Users/yettree/Documents/kidsphotos/pages/*` | 保留 | `apps/miniapp/src/pages/*` | 现有用户端页面和交互可分阶段迁移，不在 M0 大规模搬运 |
| `/Users/yettree/Documents/kidsphotos/utils/store.js` | 保留 | `apps/miniapp/src/services/legacy-store.ts` | 当前前端状态与排版演示逻辑可作为业务规则参考 |
| `/Users/yettree/Documents/kidsphotos/data/templates.js` | 保留 | `apps/api-server/src/modules/templates/seed` | 当前模板样例、标签和封面图数据可作为后台模板 seed |
| `/Users/yettree/Documents/kidsphotos/h5/*` | 保留 | `apps/miniapp` / `apps/admin-web` 参考实现 | H5 中已有的交互、预览和页面结构是最重要的 demo 资产 |
| `/Users/yettree/Documents/kidsphotos/admin/*` | 保留 | `apps/admin-web/src/legacy-demo` | 当前后台原型已验证过视觉和流程，可逐页迁入正式后台 |
| `/Users/yettree/Documents/kidsphotos/server.js` | 保留 | `apps/api-server/src/modules/*` | 现有本地服务已串起模板、作品、订单和地址数据，是后端接口拆分的直接依据 |
| `/Users/yettree/Documents/kidsphotos/server-data/db.json` | 保留 | `apps/api-server/prisma/seed` 或 `src/seeds` | 当前联调数据可转化为初始 seed 数据 |
| `/Users/yettree/Documents/kidsphotos/uploads/*` | 保留 | `storage/local/` | 当前本地上传文件先保留，后续统一为本地存储抽象层 |
| `/Users/yettree/Documents/kidsphotos/assets/*` | 保留 | `apps/*/src/assets` 或 `public/assets` | 模板封面、logo、样片图都需要持续复用 |
| `/Users/yettree/Documents/kidsphotos/README.md` | 保留并更新 | 仓库根 `README.md` | 需要从原型说明升级为 monorepo 启动说明 |

## 迁移原则

1. Milestone 0 只记录映射，不执行大规模迁移。
2. 后续迁移时优先以“功能模块”为单位，不按文件一次性平移。
3. 迁移成功后再逐步废弃 legacy demo，而不是提前删除。
