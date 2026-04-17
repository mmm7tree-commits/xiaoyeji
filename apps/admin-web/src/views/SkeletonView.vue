<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
const apiBaseUrl = computed(() => import.meta.env.VITE_ADMIN_API_BASE_URL || "http://127.0.0.1:3100");
</script>

<template>
  <div class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Milestone 0</p>
      <h1>{{ appStore.appName }}</h1>
      <p class="hero-copy">
        当前已经完成后台骨架初始化。下一步会在这个工程里逐步接入登录、权限、模板管理、作品管理和订单履约。
      </p>

      <div class="info-grid">
        <div class="info-card">
          <span class="info-label">当前状态</span>
          <strong>骨架可启动</strong>
          <small>Vue3 + Vite + TS + Element Plus + Pinia + Router</small>
        </div>
        <div class="info-card">
          <span class="info-label">接口基线</span>
          <strong>{{ apiBaseUrl }}</strong>
          <small>Milestone 0 使用健康检查接口验证联通</small>
        </div>
        <div class="info-card">
          <span class="info-label">迁移策略</span>
          <strong>保留 demo</strong>
          <small>当前不搬业务代码，只记录映射和目标目录</small>
        </div>
      </div>
    </section>
  </div>
</template>
