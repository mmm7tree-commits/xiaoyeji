# 小叶记 miniapp adapter 目录结构

## M1 目录

```text
apps/miniapp/src/
  adapters/
    index.ts
    types.ts
    platforms/
      wechat.ts
      douyin.ts
      xiaohongshu.ts
  config/
    runtime.ts
  constants/
    storage.ts
  services/
    http.ts
    storage.ts
    token.ts
  stores/
    session.ts
  types/
    auth.ts
```

## 职责说明

- `adapters/platforms/*`
  - 收口微信 / 抖音 / 小红书平台差异
  - M1 仅保留获取平台登录 code 的占位接口
- `services/http.ts`
  - 统一请求封装入口
- `services/token.ts`
  - 统一 token / user 持久化读写
- `stores/session.ts`
  - 统一登录态管理
- `config/runtime.ts`
  - 统一运行时配置

## M1 边界

当前还没有接完整 uni-app 页面，也没有接真实三端授权细节。  
这一层先作为后续页面接入时的稳定基础。
