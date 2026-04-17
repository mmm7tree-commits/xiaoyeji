<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const navigationItems = computed(() => {
  const items = [
    {
      key: "dashboard",
      label: "数据概览",
      kicker: "总览",
      to: "/dashboard",
      visible: true
    },
    {
      key: "templates",
      label: "模板管理",
      kicker: "核心能力",
      to: "/templates",
      visible: authStore.currentUser?.role !== "OPERATOR"
    },
    {
      key: "works",
      label: "作品管理",
      kicker: "用户侧",
      to: "/works",
      visible: true
    },
    {
      key: "orders",
      label: "订单管理",
      kicker: "交易侧",
      to: "/orders",
      visible: true
    },
    {
      key: "system-accounts",
      label: "账号管理",
      kicker: "系统",
      to: "/system-accounts",
      visible: authStore.currentUser?.role === "SUPER_ADMIN"
    }
  ];

  return items.filter((item) => item.visible);
});

const pageMeta = computed(() => ({
  kicker: (route.meta.kicker as string) || "管理后台",
  title: (route.meta.title as string) || "小叶记",
  description:
    (route.meta.description as string) ||
    "维护模板、查看作品和管理后台运行情况。"
}));

function logout() {
  authStore.logout();
  router.replace("/login");
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-caption">小叶记</div>
        <h1 class="sidebar-title">管理后台</h1>
        <p class="sidebar-copy">模板生成与作品回看在这里完成闭环。</p>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navigationItems"
          :key="item.key"
          :to="item.to"
          class="sidebar-link"
          active-class="is-active"
        >
          <span class="sidebar-kicker">{{ item.kicker }}</span>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-user">
        <div class="sidebar-user-name">{{ authStore.currentUser?.name }}</div>
        <div class="sidebar-user-meta">
          {{ authStore.currentUser?.account }} · {{ authStore.currentUser?.role }}
        </div>
        <button class="sidebar-logout" type="button" @click="logout">退出登录</button>
      </div>
    </aside>

    <main class="admin-content">
      <header class="content-header">
        <div>
          <p class="content-kicker">{{ pageMeta.kicker }}</p>
          <h2 class="content-title">{{ pageMeta.title }}</h2>
          <p class="content-description">{{ pageMeta.description }}</p>
        </div>
        <div class="content-header-chip">M12 订单骨架对齐</div>
      </header>

      <router-view />
    </main>
  </div>
</template>
