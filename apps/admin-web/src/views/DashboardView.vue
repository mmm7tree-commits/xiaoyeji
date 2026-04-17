<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { fetchAdminOrders } from "../services/admin-orders";
import { fetchAdminTemplates } from "../services/admin-templates";
import { fetchAdminWorks } from "../services/admin-works";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const templateCount = ref(0);
const publishedTemplateCount = ref(0);
const workCount = ref(0);
const orderedWorkCount = ref(0);
const orderCount = ref(0);
const pendingOrderCount = ref(0);
const errorText = ref("");

const roleLabel = computed(() => {
  if (authStore.currentUser?.role === "SUPER_ADMIN") {
    return "超级管理员";
  }
  if (authStore.currentUser?.role === "ADMIN") {
    return "后台管理员";
  }
  return "运营同学";
});

async function loadOverview() {
  if (!authStore.token) {
    return;
  }

  try {
    const [templates, works, orders] = await Promise.all([
      fetchAdminTemplates(authStore.token, {}),
      fetchAdminWorks(authStore.token, {}),
      fetchAdminOrders(authStore.token, {})
    ]);
    templateCount.value = templates.length;
    publishedTemplateCount.value = templates.filter(
      (item) => item.status === "published"
    ).length;
    workCount.value = works.length;
    orderedWorkCount.value = works.filter((item) => item.status === "ordered").length;
    orderCount.value = orders.length;
    pendingOrderCount.value = orders.filter((item) => item.statusCode === "pending_payment").length;
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "概览数据加载失败";
  }
}

onMounted(loadOverview);
</script>

<template>
  <div class="admin-grid admin-grid-dashboard">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">本轮重点</p>
          <h3 class="panel-title">模板系统优先推进</h3>
        </div>
      </div>
      <p class="panel-copy">
        当前已经补到 M12：模板、作品和订单骨架都能在后台回看，但支付、物流、PDF 和退款仍然保持后续里程碑推进。
      </p>
      <p v-if="errorText" class="feedback error">{{ errorText }}</p>
      <div class="metric-grid">
        <div class="metric-card">
          <strong>{{ templateCount }}</strong>
          <span>模板总数</span>
        </div>
        <div class="metric-card">
          <strong>{{ publishedTemplateCount }}</strong>
          <span>已上架模板</span>
        </div>
        <div class="metric-card">
          <strong>{{ workCount }}</strong>
          <span>作品骨架样本</span>
        </div>
        <div class="metric-card">
          <strong>{{ orderedWorkCount }}</strong>
          <span>已下单作品</span>
        </div>
        <div class="metric-card">
          <strong>{{ orderCount }}</strong>
          <span>订单总数</span>
        </div>
        <div class="metric-card">
          <strong>{{ pendingOrderCount }}</strong>
          <span>待支付订单</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">当前账号</p>
          <h3 class="panel-title">{{ authStore.currentUser?.name }}</h3>
        </div>
      </div>
      <div class="detail-section-grid">
        <div class="detail-section-card">
          <strong>角色</strong>
          <p>{{ roleLabel }}</p>
        </div>
        <div class="detail-section-card">
          <strong>账号</strong>
          <p>{{ authStore.currentUser?.account }}</p>
        </div>
        <div class="detail-section-card">
          <strong>权限数</strong>
          <p>{{ authStore.currentUser?.permissions.length || 0 }} 项</p>
        </div>
        <div class="detail-section-card">
          <strong>登录态</strong>
          <p>{{ authStore.isAuthenticated ? "已持久化" : "未登录" }}</p>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">快捷入口</p>
          <h3 class="panel-title">直接进入当前最重要的两个模块</h3>
        </div>
      </div>
      <div class="quick-link-grid">
        <RouterLink class="quick-link-card" to="/templates">
          <strong>模板管理</strong>
          <p>先做模板列表、生成、版本预览、上下架和推荐闭环。</p>
        </RouterLink>
        <RouterLink class="quick-link-card" to="/works">
          <strong>作品管理</strong>
          <p>先把作品列表、详情和预览入口搭起来，后续再接复杂联动。</p>
        </RouterLink>
        <RouterLink class="quick-link-card" to="/orders">
          <strong>订单管理</strong>
          <p>先核对订单快照、地址快照和图片履约条件，再往支付与履约继续推进。</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
