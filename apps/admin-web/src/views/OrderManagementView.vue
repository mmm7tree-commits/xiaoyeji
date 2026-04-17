<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  fetchAdminOrderDetail,
  fetchAdminOrders,
  triggerAdminFulfillmentAction,
  triggerAdminPayAction,
  triggerAdminPdfAction
} from "../services/admin-orders";
import { useAuthStore } from "../stores/auth";
import type {
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrderStatusCode
} from "../types/order-admin";

const authStore = useAuthStore();
const orders = ref<AdminOrderListItem[]>([]);
const selectedOrder = ref<AdminOrderDetail | null>(null);
const loading = ref(false);
const errorText = ref("");
const actionFeedback = ref<{
  type: "error" | "success";
  message: string;
} | null>(null);
const filters = reactive({
  keyword: "",
  statusCode: "all"
});

const statusOptions: Array<{
  value: "all" | AdminOrderStatusCode;
  label: string;
}> = [
  { value: "all", label: "全部状态" },
  { value: "pending_payment", label: "待支付" },
  { value: "pending_shipment", label: "待发货" },
  { value: "closed", label: "已关闭" }
];

function requireToken() {
  if (!authStore.token) {
    throw new Error("登录已失效，请重新登录");
  }
  return authStore.token;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatPrice(value: number) {
  return `¥${(value / 100).toFixed(2)}`;
}

function statusClass(code: string) {
  if (code === "pending_payment") {
    return "featured";
  }
  if (code === "pending_shipment") {
    return "warning";
  }
  if (code === "closed") {
    return "gray";
  }
  return "";
}

async function loadOrders(selectId?: string) {
  loading.value = true;
  errorText.value = "";

  try {
    orders.value = await fetchAdminOrders(requireToken(), filters);
    const targetId = selectId || selectedOrder.value?.id || orders.value[0]?.id;
    if (targetId) {
      await openOrder(targetId);
    } else {
      selectedOrder.value = null;
    }
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "订单列表加载失败";
  } finally {
    loading.value = false;
  }
}

async function openOrder(orderId: string) {
  try {
    actionFeedback.value = null;
    selectedOrder.value = await fetchAdminOrderDetail(requireToken(), orderId);
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "订单详情加载失败";
  }
}

async function handleAction(actionKey: "payAction" | "pdfAction" | "fulfillmentAction") {
  if (!selectedOrder.value) {
    return;
  }
  try {
    const triggerMap = {
      payAction: triggerAdminPayAction,
      pdfAction: triggerAdminPdfAction,
      fulfillmentAction: triggerAdminFulfillmentAction
    } as const;
    const result = await triggerMap[actionKey](requireToken(), selectedOrder.value.id);
    actionFeedback.value = {
      type: result.blocked ? "error" : "success",
      message: `${result.placeholderTitle}：${result.message} ${result.nextStepHint}`
    };
  } catch (error) {
    const fallbackMessage = actionKey === "payAction"
      ? "支付占位动作暂时不可用"
      : actionKey === "pdfAction"
        ? "PDF 占位动作暂时不可用"
        : "履约占位动作暂时不可用";
    actionFeedback.value = {
      type: "error",
      message: error instanceof Error ? error.message : fallbackMessage
    };
  }
}

const actionEntries = computed(() => {
  if (!selectedOrder.value) {
    return [];
  }
  return [
    {
      key: "payAction" as const,
      label: "支付",
      data: selectedOrder.value.actionAvailability.payAction
    },
    {
      key: "pdfAction" as const,
      label: "PDF",
      data: selectedOrder.value.actionAvailability.pdfAction
    },
    {
      key: "fulfillmentAction" as const,
      label: "履约",
      data: selectedOrder.value.actionAvailability.fulfillmentAction
    }
  ].filter((item) => item.data.visible);
});

const statusSummary = computed(() => {
  return statusOptions
    .filter((item) => item.value !== "all")
    .map((item) => ({
      value: item.value,
      label: item.label,
      count: orders.value.filter((order) => order.statusCode === item.value).length
    }));
});

const orderAddressText = computed(() => {
  if (!selectedOrder.value?.addressSnapshot) {
    return "当前没有保存地址快照。";
  }
  const address = selectedOrder.value.addressSnapshot;
  return `${address.name} ${address.phone}\n${address.region} ${address.detail}`;
});

const workSnapshotSummary = computed(() => {
  if (!selectedOrder.value?.workSnapshot) {
    return "当前没有可用的作品快照。";
  }
  const work = selectedOrder.value.workSnapshot;
  return `${work.templateName} · V${work.templateVersionNo || "—"} · ${work.generatedPageCount} 页预览 · ${work.photoCount} 张照片`;
});

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="admin-grid admin-grid-work">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">订单列表</p>
          <h3 class="panel-title">订单管理骨架</h3>
        </div>
      </div>

      <div class="toolbar-grid toolbar-grid-compact">
        <input
          v-model="filters.keyword"
          class="panel-input"
          type="search"
          placeholder="搜索订单号、作品名、收货人、手机号"
          @keyup.enter="loadOrders()"
        />
        <select v-model="filters.statusCode" class="panel-input" @change="loadOrders()">
          <option v-for="item in statusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
        <button class="panel-button" type="button" @click="loadOrders()">刷新列表</button>
      </div>

      <div class="category-strip">
        <div v-for="item in statusSummary" :key="item.value" class="metric-pill">
          <strong>{{ item.label }}</strong>
          <span>{{ item.count }} 个订单</span>
        </div>
      </div>

      <p v-if="errorText" class="feedback error">{{ errorText }}</p>

      <div v-if="loading" class="panel-empty">订单列表加载中...</div>
      <div v-else-if="!orders.length" class="panel-empty">当前筛选条件下没有订单。</div>
      <div v-else class="list-stack">
        <article
          v-for="order in orders"
          :key="order.id"
          class="list-card order-list-card"
          :class="{ 'is-active': order.id === selectedOrder?.id }"
          @click="openOrder(order.id)"
        >
          <div class="list-copy">
            <div class="list-top">
              <div>
                <h4>{{ order.workTitle }}</h4>
                <p>{{ order.orderNo }} · {{ order.templateName }}</p>
              </div>
              <span class="status-chip" :class="statusClass(order.statusCode)">
                {{ order.statusText }}
              </span>
            </div>
            <div class="meta-line">
              收货人：{{ order.consigneeName }} · {{ order.consigneePhone }}
            </div>
            <div class="meta-line">
              {{ formatPrice(order.unitPrice) }} × {{ order.quantity }} 本 = {{ formatPrice(order.amount) }}
            </div>
            <div class="detail-mini-meta">
              <span>模板版本 {{ order.templateVersionNo ? `V${order.templateVersionNo}` : "待补充" }}</span>
              <span>{{ order.assetReady ? "图片可履约" : "图片待补全" }}</span>
              <span>更新于 {{ formatDate(order.updatedAt) }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="panel panel-detail">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">订单详情</p>
          <h3 class="panel-title">{{ selectedOrder?.orderNo || "请选择订单" }}</h3>
        </div>
      </div>

      <div v-if="!selectedOrder" class="panel-empty">
        先从左侧选择一个订单，我们再核对订单快照和后续履约准备情况。
      </div>
      <template v-else>
        <div class="detail-hero order-detail-hero">
          <div class="detail-hero-copy">
            <div class="tag-row">
              <span class="status-chip" :class="statusClass(selectedOrder.statusCode)">
                {{ selectedOrder.statusText }}
              </span>
              <span class="status-chip warning">
                模板版本 {{ selectedOrder.templateVersionNo ? `V${selectedOrder.templateVersionNo}` : "待补充" }}
              </span>
              <span class="status-chip" :class="selectedOrder.assetReadiness.ready ? 'warning' : 'gray'">
                {{ selectedOrder.assetReadiness.label }}
              </span>
            </div>
            <h4>{{ selectedOrder.workTitle }}</h4>
            <p>{{ selectedOrder.statusHint }}</p>
            <div class="meta-line">订单创建于 {{ formatDate(selectedOrder.createdAt) }}</div>
            <div class="meta-line">
              {{ formatPrice(selectedOrder.unitPrice) }} × {{ selectedOrder.quantity }} 本 = {{ formatPrice(selectedOrder.amount) }}
            </div>
          </div>
        </div>

        <div class="detail-section-grid">
          <div v-for="item in selectedOrder.detailSections" :key="item.label" class="detail-section-card">
            <strong>{{ item.label }}</strong>
            <p>{{ item.value }}</p>
          </div>
        </div>

        <div class="preview-summary-card">
          <h4>地址快照</h4>
          <p class="multiline-copy">{{ orderAddressText }}</p>
        </div>

        <div class="preview-summary-card">
          <h4>作品快照摘要</h4>
          <p>{{ workSnapshotSummary }}</p>
          <div class="meta-line">{{ selectedOrder.assetReadiness.description }}</div>
          <div class="detail-mini-meta">
            <span>作品状态 {{ selectedOrder.workSnapshot.statusText }}</span>
            <span>封面 {{ selectedOrder.workSnapshot.coverTitle }}</span>
            <span>来源 {{ selectedOrder.workSnapshot.templateSourceMode }}</span>
          </div>
        </div>

        <div class="preview-summary-card">
          <h4>后续生产准备情况</h4>
          <p>{{ selectedOrder.productionReadiness.label }}</p>
          <div class="meta-line">{{ selectedOrder.productionReadiness.description }}</div>
          <div class="detail-section-grid">
            <div
              v-for="check in selectedOrder.productionReadiness.checks"
              :key="check.code"
              class="detail-section-card"
            >
              <strong>{{ check.label }}</strong>
              <p>{{ check.passed ? check.description : check.blocker || check.description }}</p>
              <span class="status-chip" :class="check.passed ? 'warning' : 'gray'">
                {{ check.passed ? "已满足" : "待补齐" }}
              </span>
            </div>
          </div>
        </div>

        <div class="preview-summary-card">
          <h4>动作入口占位</h4>
          <p>按钮会先走统一前置校验，满足条件也只进入占位说明，不会伪装成真实支付、PDF 或履约已经完成。</p>
          <div class="action-row">
            <button
              v-for="action in actionEntries"
              :key="action.key"
              class="panel-button compact"
              :class="action.data.blocked ? 'ghost' : 'primary'"
              type="button"
              @click="handleAction(action.key)"
            >
              {{ action.label }}
            </button>
          </div>
          <div class="detail-section-grid">
            <div
              v-for="action in actionEntries"
              :key="`${action.key}-rule`"
              class="detail-section-card"
            >
              <strong>{{ action.label }}</strong>
              <p>{{ action.data.reason }}</p>
              <div class="detail-mini-meta">
                <span>{{ action.data.enabled ? "当前可点" : "当前拦截" }}</span>
                <span>依赖 {{ action.data.requiredChecks.join(" / ") }}</span>
              </div>
            </div>
          </div>
          <p v-if="actionFeedback" class="feedback" :class="actionFeedback.type">
            {{ actionFeedback.message }}
          </p>
        </div>

        <div class="preview-summary-card">
          <h4>当前边界</h4>
          <p>
            当前后台订单模块只做订单列表、订单详情和后续生产条件核对。支付、PDF、履约和退款按钮会在后续里程碑接入。
          </p>
        </div>
      </template>
    </section>
  </div>
</template>
