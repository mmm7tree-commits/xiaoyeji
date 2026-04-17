<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const redirectText = computed(() => {
  const target = route.query.redirect;
  return typeof target === "string" && target ? target : "/dashboard";
});
</script>

<template>
  <div class="status-layout">
    <section class="status-card">
      <p class="status-code">401</p>
      <h1>还没有登录，暂时不能继续访问</h1>
      <p>请先登录后台。登录成功后，我们会继续带你回到：{{ redirectText }}</p>
      <router-link class="primary-button inline-flex" :to="{ path: '/login', query: { redirect: redirectText } }">
        去登录
      </router-link>
    </section>
  </div>
</template>
