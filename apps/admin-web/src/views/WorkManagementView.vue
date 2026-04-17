<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { fetchAdminTemplates } from "../services/admin-templates";
import { fetchAdminWorkDetail, fetchAdminWorks } from "../services/admin-works";
import { useAuthStore } from "../stores/auth";
import type { AdminTemplateListItem } from "../types/template-admin";
import type { AdminWorkDetail, AdminWorkListItem } from "../types/work-admin";
import { resolveAssetUrl } from "../utils/assets";

const authStore = useAuthStore();
const templates = ref<AdminTemplateListItem[]>([]);
const works = ref<AdminWorkListItem[]>([]);
const selectedWork = ref<AdminWorkDetail | null>(null);
const previewVisible = ref(false);
const loading = ref(false);
const errorText = ref("");
const filters = reactive({
  keyword: "",
  status: "all",
  templateId: "all"
});

const filteredStatusOptions = [
  { value: "all", label: "全部状态" },
  { value: "draft", label: "继续补充" },
  { value: "ready", label: "待下单" },
  { value: "ordered", label: "已下单" }
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

async function loadTemplates() {
  templates.value = await fetchAdminTemplates(requireToken(), {});
}

async function loadWorks(selectId?: string) {
  loading.value = true;
  errorText.value = "";

  try {
    works.value = await fetchAdminWorks(requireToken(), filters);
    const targetId = selectId || selectedWork.value?.id || works.value[0]?.id;

    if (targetId) {
      await openWork(targetId);
    } else {
      selectedWork.value = null;
    }
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "作品列表加载失败";
  } finally {
    loading.value = false;
  }
}

async function openWork(workId: string) {
  try {
    selectedWork.value = await fetchAdminWorkDetail(requireToken(), workId);
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "作品详情加载失败";
  }
}

const statusSummary = computed(() => {
  return filteredStatusOptions
    .filter((item) => item.value !== "all")
    .map((item) => ({
      ...item,
      count: works.value.filter((work) => work.status === item.value).length
    }));
});

onMounted(async () => {
  await Promise.all([loadTemplates(), loadWorks()]);
});
</script>

<template>
  <div class="admin-grid admin-grid-work">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">作品列表</p>
          <h3 class="panel-title">用户作品骨架</h3>
        </div>
      </div>

      <div class="toolbar-grid">
        <input
          v-model="filters.keyword"
          class="panel-input"
          type="search"
          placeholder="搜索作品名、家长、幼儿园信息"
          @keyup.enter="loadWorks()"
        />
        <select v-model="filters.status" class="panel-input" @change="loadWorks()">
          <option v-for="item in filteredStatusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
        <select v-model="filters.templateId" class="panel-input" @change="loadWorks()">
          <option value="all">全部模板</option>
          <option v-for="item in templates" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <button class="panel-button" type="button" @click="loadWorks()">刷新列表</button>
      </div>

      <div class="category-strip">
        <div v-for="item in statusSummary" :key="item.value" class="metric-pill">
          <strong>{{ item.label }}</strong>
          <span>{{ item.count }} 个作品</span>
        </div>
      </div>

      <p v-if="errorText" class="feedback error">{{ errorText }}</p>

      <div v-if="loading" class="panel-empty">作品列表加载中...</div>
      <div v-else-if="!works.length" class="panel-empty">当前筛选条件下没有作品。</div>
      <div v-else class="list-stack">
        <article
          v-for="work in works"
          :key="work.id"
          class="list-card"
          :class="{ 'is-active': work.id === selectedWork?.id }"
          @click="openWork(work.id)"
        >
          <img :src="resolveAssetUrl(work.coverImage)" :alt="work.title" class="list-thumb" />
          <div class="list-copy">
            <div class="list-top">
              <div>
                <h4>{{ work.title }}</h4>
                <p>{{ work.templateName }} · {{ work.parentName }}</p>
              </div>
              <span class="status-chip">{{ work.statusText }}</span>
            </div>
            <div class="meta-line">
              {{ work.photoCount }} 张照片 · {{ work.pageCount }} 页 · 更新于
              {{ formatDate(work.updatedAt) }}
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="panel panel-detail">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">作品详情</p>
          <h3 class="panel-title">{{ selectedWork?.title || "请选择作品" }}</h3>
        </div>
        <button
          v-if="selectedWork"
          class="panel-button ghost"
          type="button"
          @click="previewVisible = true"
        >
          查看预览入口
        </button>
      </div>

      <div v-if="!selectedWork" class="panel-empty">
        先从左侧选择一个作品，我们再看作品详情和预览入口。
      </div>
      <template v-else>
        <div class="detail-hero">
          <img
            :src="resolveAssetUrl(selectedWork.coverImage)"
            :alt="selectedWork.title"
            class="detail-hero-image"
          />
          <div class="detail-hero-copy">
            <div class="tag-row">
              <span class="status-chip">{{ selectedWork.statusText }}</span>
              <span class="status-chip warning">{{ selectedWork.templateName }}</span>
            </div>
            <h4>{{ selectedWork.coverTitle }}</h4>
            <p>{{ selectedWork.coverPhrase }}</p>
            <div class="meta-line">{{ selectedWork.babyInfo }}</div>
          </div>
        </div>

        <div class="detail-section-grid">
          <div v-for="item in selectedWork.detailSections" :key="item.label" class="detail-section-card">
            <strong>{{ item.label }}</strong>
            <p>{{ item.value }}</p>
          </div>
        </div>

        <div class="preview-summary-card">
          <h4>{{ selectedWork.previewEntrance.title }}</h4>
          <p>{{ selectedWork.previewEntrance.description }}</p>
          <div class="meta-line">{{ selectedWork.previewSummary }}</div>
        </div>
      </template>
    </section>

    <div v-if="previewVisible && selectedWork" class="preview-modal" @click.self="previewVisible = false">
      <div class="preview-modal-card">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">预览入口</p>
            <h3 class="panel-title">{{ selectedWork.title }}</h3>
          </div>
          <button class="panel-button ghost compact" type="button" @click="previewVisible = false">
            关闭
          </button>
        </div>

        <div class="preview-frame-grid">
          <article
            v-for="frame in selectedWork.previewEntrance.frames"
            :key="frame.pageNo"
            class="preview-frame-card"
          >
            <img :src="resolveAssetUrl(frame.image)" :alt="frame.title" />
            <div>
              <strong>PAGE {{ String(frame.pageNo).padStart(2, '0') }}</strong>
              <h5>{{ frame.title }}</h5>
              <p>{{ frame.layoutType }} · {{ frame.caption }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
