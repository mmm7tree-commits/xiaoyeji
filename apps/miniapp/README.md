# apps/miniapp

Milestone 1 先完成多端小程序的基础框架文件，不迁移业务页面。

当前已补的最小能力：

- 请求封装骨架：`src/services/http.ts`
- token 存取：`src/services/token.ts`
- 登录态管理：`src/stores/session.ts`
- platform adapter 骨架：`src/adapters/*`

当前可运行的小程序原型仍然保留在仓库根目录，供微信开发者工具继续打开和调试：

- `/Users/yettree/Documents/kidsphotos/app.js`
- `/Users/yettree/Documents/kidsphotos/app.json`
- `/Users/yettree/Documents/kidsphotos/pages/*`

后续里程碑会把现有 demo 中可复用的页面、状态和排版逻辑，按 uni-app 方式逐步迁入这里。
