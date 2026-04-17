<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  createAdminTemplate,
  deleteAdminTemplate,
  featureAdminTemplate,
  fetchAdminTemplateCategories,
  fetchAdminTemplateDetail,
  fetchAdminTemplatePreview,
  fetchAdminTemplates,
  generateAdminTemplate,
  offlineAdminTemplate,
  publishAdminTemplate,
  regenerateAdminTemplate,
  unfeatureAdminTemplate,
  updateAdminTemplate
} from "../services/admin-templates";
import { useAuthStore } from "../stores/auth";
import type {
  AdminTemplateCategoryItem,
  AdminTemplateDetail,
  AdminTemplateListItem,
  AdminTemplatePreviewPayload,
  TemplateBasicForm,
  TemplateGenerateForm
} from "../types/template-admin";
import { resolveAssetUrl } from "../utils/assets";

const authStore = useAuthStore();

const categories = ref<AdminTemplateCategoryItem[]>([]);
const templates = ref<AdminTemplateListItem[]>([]);
const selectedTemplate = ref<AdminTemplateDetail | null>(null);
const selectedPreview = ref<AdminTemplatePreviewPayload | null>(null);
const loadingList = ref(false);
const loadingDetail = ref(false);
const saving = ref(false);
const createMode = ref(false);
const feedback = ref("");
const errorText = ref("");
const filters = reactive({
  keyword: "",
  categoryCode: "all",
  status: "all"
});
const basicForm = reactive<TemplateBasicForm>({
  name: "",
  categoryCode: "graduation",
  themeLabel: "",
  summary: "",
  description: "",
  badgeText: "",
  pageCount: 24,
  minPhotos: 8,
  maxPhotos: 32,
  priceYuan: 129
});
const generateForm = reactive<TemplateGenerateForm>({
  promptText: "",
  changeNote: ""
});

const versionCountText = computed(() =>
  selectedTemplate.value ? `${selectedTemplate.value.versions.length} 个版本` : "还没有版本"
);
const selectableCategories = computed(() =>
  categories.value.filter((item) => item.code !== "all")
);

function requireToken() {
  if (!authStore.token) {
    throw new Error("登录已失效，请重新登录");
  }

  return authStore.token;
}

function resetFeedback() {
  feedback.value = "";
  errorText.value = "";
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function fillBasicForm(detail: AdminTemplateDetail) {
  basicForm.name = detail.name;
  basicForm.categoryCode = detail.categoryCode;
  basicForm.themeLabel = detail.themeLabel;
  basicForm.summary = detail.summary;
  basicForm.description = detail.description;
  basicForm.badgeText = detail.badgeText;
  basicForm.pageCount = detail.pageCount;
  basicForm.minPhotos = detail.minPhotos;
  basicForm.maxPhotos = detail.maxPhotos;
  basicForm.priceYuan = Math.round(detail.priceInCents / 100);
}

function fillGenerateForm(detail: AdminTemplateDetail) {
  generateForm.promptText =
    detail.currentVersion?.promptText ||
    `围绕${detail.themeLabel}，用更适合幼儿园家庭的语言和版式生成一套${detail.pageCount}页模板。`;
  generateForm.changeNote = "";
}

async function loadCategories() {
  categories.value = await fetchAdminTemplateCategories(requireToken());
}

async function loadTemplates(options?: { selectId?: string | null }) {
  loadingList.value = true;
  resetFeedback();

  try {
    templates.value = await fetchAdminTemplates(requireToken(), filters);

    const nextId =
      options?.selectId ||
      selectedTemplate.value?.id ||
      templates.value[0]?.id ||
      null;

    if (nextId) {
      await openTemplate(nextId);
    } else {
      selectedTemplate.value = null;
      selectedPreview.value = null;
    }
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "模板列表加载失败";
  } finally {
    loadingList.value = false;
  }
}

async function openTemplate(templateId: string) {
  loadingDetail.value = true;
  createMode.value = false;

  try {
    const detail = await fetchAdminTemplateDetail(requireToken(), templateId);
    selectedTemplate.value = detail;
    fillBasicForm(detail);
    fillGenerateForm(detail);
    selectedPreview.value = detail.currentVersion || detail.publishedVersion || null;
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "模板详情加载失败";
  } finally {
    loadingDetail.value = false;
  }
}

function startCreate() {
  createMode.value = true;
  selectedTemplate.value = null;
  selectedPreview.value = null;
  feedback.value = "先补基础信息，再生成第一版模板。";
  errorText.value = "";
  basicForm.name = "";
  basicForm.categoryCode = "graduation";
  basicForm.themeLabel = "";
  basicForm.summary = "";
  basicForm.description = "";
  basicForm.badgeText = "";
  basicForm.pageCount = 24;
  basicForm.minPhotos = 8;
  basicForm.maxPhotos = 32;
  basicForm.priceYuan = 129;
  generateForm.promptText =
    "请生成一套适合幼儿园纪念册的模板，封面温柔，内页要兼顾老师寄语、集体笑脸和孩子的成长瞬间。";
  generateForm.changeNote = "";
}

async function saveBasicInfo() {
  const wasCreateMode = createMode.value;

  if (!wasCreateMode && !selectedTemplate.value) {
    errorText.value = "请先选择一套模板，或点击新增模板。";
    return;
  }

  saving.value = true;
  resetFeedback();

  try {
    const detail = wasCreateMode
      ? await createAdminTemplate(requireToken(), basicForm)
      : await updateAdminTemplate(requireToken(), selectedTemplate.value!.id, basicForm);

    selectedTemplate.value = detail;
    createMode.value = false;
    fillBasicForm(detail);
    fillGenerateForm(detail);
    selectedPreview.value = detail.currentVersion || detail.publishedVersion || null;
    feedback.value = wasCreateMode ? "已创建模板草稿。" : "模板基础信息已保存。";
    await loadTemplates({ selectId: detail.id });
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "保存模板失败";
  } finally {
    saving.value = false;
  }
}

async function generateTemplate() {
  const wasCreateMode = createMode.value;

  if (!wasCreateMode && !selectedTemplate.value) {
    errorText.value = "请先选择一套模板，或点击新增模板。";
    return;
  }

  saving.value = true;
  resetFeedback();

  try {
    const detail = wasCreateMode
      ? await generateAdminTemplate(requireToken(), basicForm, generateForm)
      : await regenerateAdminTemplate(
          requireToken(),
          selectedTemplate.value!.id,
          basicForm,
          generateForm
        );

    selectedTemplate.value = detail;
    createMode.value = false;
    fillBasicForm(detail);
    fillGenerateForm(detail);
    selectedPreview.value = detail.currentVersion || null;
    feedback.value = wasCreateMode
      ? "模板第一版已经生成。"
      : "已根据新提示词生成新版本。";
    await loadTemplates({ selectId: detail.id });
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "模板生成失败";
  } finally {
    saving.value = false;
  }
}

async function loadPreview(versionId?: string) {
  if (!selectedTemplate.value) {
    return;
  }

  try {
    selectedPreview.value = await fetchAdminTemplatePreview(
      requireToken(),
      selectedTemplate.value.id,
      versionId
    );
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "模板预览加载失败";
  }
}

async function runAction(
  action: "publish" | "offline" | "feature" | "unfeature" | "delete"
) {
  if (!selectedTemplate.value) {
    return;
  }

  saving.value = true;
  resetFeedback();

  try {
    if (action === "publish") {
      selectedTemplate.value = await publishAdminTemplate(
        requireToken(),
        selectedTemplate.value.id
      );
      feedback.value = "模板已上架，当前预览版本已成为线上版本。";
    }

    if (action === "offline") {
      selectedTemplate.value = await offlineAdminTemplate(
        requireToken(),
        selectedTemplate.value.id
      );
      feedback.value = "模板已下架，当前不再对外展示。";
    }

    if (action === "feature") {
      selectedTemplate.value = await featureAdminTemplate(
        requireToken(),
        selectedTemplate.value.id
      );
      feedback.value = "已设为推荐模板。";
    }

    if (action === "unfeature") {
      selectedTemplate.value = await unfeatureAdminTemplate(
        requireToken(),
        selectedTemplate.value.id
      );
      feedback.value = "已取消推荐。";
    }

    if (action === "delete") {
      await deleteAdminTemplate(requireToken(), selectedTemplate.value.id);
      feedback.value = "模板已删除。";
      selectedTemplate.value = null;
      selectedPreview.value = null;
      createMode.value = false;
    }

    await loadTemplates();
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : "模板操作失败";
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadTemplates()]);
});
</script>

<template>
  <div class="admin-grid admin-grid-template">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">模板列表</p>
          <h3 class="panel-title">模板管理工作台</h3>
        </div>
        <button class="panel-button ghost" type="button" @click="startCreate">新增模板</button>
      </div>

      <div class="toolbar-grid">
        <input
          v-model="filters.keyword"
          class="panel-input"
          type="search"
          placeholder="搜索模板名称、摘要或主题"
          @keyup.enter="loadTemplates()"
        />
        <select v-model="filters.categoryCode" class="panel-input" @change="loadTemplates()">
          <option value="all">全部分类</option>
          <option v-for="item in selectableCategories" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
        <select v-model="filters.status" class="panel-input" @change="loadTemplates()">
          <option value="all">全部状态</option>
          <option value="draft">草稿中</option>
          <option value="published">已上架</option>
          <option value="offline">已下架</option>
        </select>
        <button class="panel-button" type="button" @click="loadTemplates()">刷新列表</button>
      </div>

      <div class="category-strip">
        <div v-for="item in categories" :key="item.code" class="metric-pill">
          <strong>{{ item.name }}</strong>
          <span>{{ item.templateCount }} 套 · 已上架 {{ item.publishedCount }} 套</span>
        </div>
      </div>

      <div v-if="loadingList" class="panel-empty">模板列表加载中...</div>
      <div v-else-if="!templates.length" class="panel-empty">当前还没有模板，先新增一套开始生成。</div>
      <div v-else class="list-stack">
        <article
          v-for="item in templates"
          :key="item.id"
          class="list-card"
          :class="{ 'is-active': item.id === selectedTemplate?.id }"
          @click="openTemplate(item.id)"
        >
          <img :src="resolveAssetUrl(item.coverImage)" :alt="item.name" class="list-thumb" />
          <div class="list-copy">
            <div class="list-top">
              <div>
                <h4>{{ item.name }}</h4>
                <p>{{ item.summary }}</p>
              </div>
              <span class="price-chip">{{ item.priceText }}</span>
            </div>
            <div class="tag-row">
              <span class="status-chip">{{ item.statusText }}</span>
              <span v-if="item.isFeatured" class="status-chip featured">推荐中</span>
              <span v-if="item.hasUnpublishedChanges" class="status-chip warning">有未发布改动</span>
            </div>
            <div class="meta-line">
              {{ item.pageCount }} 页 · {{ item.minPhotos }}-{{ item.maxPhotos }} 张 · 版本
              {{ item.currentVersionNo || "—" }}/{{ item.versionCount }}
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="panel panel-detail">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">{{ createMode ? "新增模板" : "模板详情" }}</p>
          <h3 class="panel-title">
            {{ createMode ? "先补基础信息，再生成第一版模板" : selectedTemplate?.name || "请选择模板" }}
          </h3>
        </div>
        <div class="detail-mini-meta" v-if="selectedTemplate && !createMode">
          <span>{{ selectedTemplate.status === "published" ? "已上架" : selectedTemplate.status === "offline" ? "已下架" : "草稿中" }}</span>
          <span>{{ versionCountText }}</span>
        </div>
      </div>

      <p v-if="feedback" class="feedback success">{{ feedback }}</p>
      <p v-if="errorText" class="feedback error">{{ errorText }}</p>

      <div v-if="loadingDetail" class="panel-empty">正在加载模板详情...</div>
      <template v-else>
        <section class="form-section">
          <div class="section-title-row">
            <h4>基础信息</h4>
            <span class="section-hint">这里只维护模板信息，不直接生成内容。</span>
          </div>
          <div class="form-grid">
            <label>
              模板名称
              <input v-model="basicForm.name" class="panel-input" />
            </label>
            <label>
              分类
              <select v-model="basicForm.categoryCode" class="panel-input">
                <option value="graduation">毕业纪念</option>
                <option value="growth">成长记录</option>
                <option value="classroom">班级活动</option>
              </select>
            </label>
            <label>
              主题词
              <input v-model="basicForm.themeLabel" class="panel-input" placeholder="例如：花园留白 / 成长故事" />
            </label>
            <label>
              标签
              <input v-model="basicForm.badgeText" class="panel-input" placeholder="例如：老师寄语更多" />
            </label>
            <label>
              页数
              <select v-model.number="basicForm.pageCount" class="panel-input">
                <option :value="16">16 页</option>
                <option :value="20">20 页</option>
                <option :value="24">24 页</option>
                <option :value="28">28 页</option>
                <option :value="32">32 页</option>
              </select>
            </label>
            <label>
              价格（元）
              <input v-model.number="basicForm.priceYuan" class="panel-input" type="number" min="1" />
            </label>
            <label>
              最少照片
              <input v-model.number="basicForm.minPhotos" class="panel-input" type="number" min="1" />
            </label>
            <label>
              最多照片
              <input v-model.number="basicForm.maxPhotos" class="panel-input" type="number" min="2" />
            </label>
            <label class="span-2">
              摘要
              <textarea v-model="basicForm.summary" class="panel-textarea" rows="3" />
            </label>
            <label class="span-2">
              模板说明
              <textarea v-model="basicForm.description" class="panel-textarea" rows="4" />
            </label>
          </div>
          <div class="action-row">
            <button class="panel-button" type="button" :disabled="saving" @click="saveBasicInfo">
              {{ createMode ? "先保存模板草稿" : "保存基础信息" }}
            </button>
          </div>
        </section>

        <section class="form-section">
          <div class="section-title-row">
            <h4>模板生成</h4>
            <span class="section-hint">先按规则生成结构化结果，再决定是否上架。</span>
          </div>
          <div class="form-grid">
            <label class="span-2">
              生成提示词
              <textarea
                v-model="generateForm.promptText"
                class="panel-textarea"
                rows="4"
                placeholder="例如：突出老师寄语、班级笑脸和毕业典礼的仪式感。"
              />
            </label>
            <label class="span-2">
              版本备注
              <input
                v-model="generateForm.changeNote"
                class="panel-input"
                placeholder="例如：把封面改得更温柔、班级合照更多"
              />
            </label>
          </div>
          <div class="action-row">
            <button class="panel-button primary" type="button" :disabled="saving" @click="generateTemplate">
              {{ createMode ? "根据主题生成模板" : "调整提示词后重新生成" }}
            </button>
            <button
              v-if="selectedTemplate"
              class="panel-button ghost"
              type="button"
              :disabled="saving || !selectedTemplate.rules.canPublish"
              @click="runAction('publish')"
            >
              上架当前版本
            </button>
            <button
              v-if="selectedTemplate?.status === 'published'"
              class="panel-button ghost"
              type="button"
              :disabled="saving"
              @click="runAction('offline')"
            >
              下架模板
            </button>
            <button
              v-if="selectedTemplate && !selectedTemplate.isFeatured"
              class="panel-button ghost"
              type="button"
              :disabled="saving || !selectedTemplate.rules.canFeature"
              @click="runAction('feature')"
            >
              设为推荐
            </button>
            <button
              v-if="selectedTemplate?.isFeatured"
              class="panel-button ghost"
              type="button"
              :disabled="saving"
              @click="runAction('unfeature')"
            >
              取消推荐
            </button>
            <button
              v-if="selectedTemplate"
              class="panel-button danger"
              type="button"
              :disabled="saving || !selectedTemplate.rules.canDelete"
              @click="runAction('delete')"
            >
              删除模板
            </button>
          </div>
          <p
            v-if="selectedTemplate && !selectedTemplate.rules.canDelete && selectedTemplate.rules.deleteReason"
            class="section-hint danger-text"
          >
            删除限制：{{ selectedTemplate.rules.deleteReason }}
          </p>
        </section>

        <section class="preview-grid">
          <div class="preview-panel">
            <div class="section-title-row">
              <h4>模板预览</h4>
              <span class="section-hint" v-if="selectedPreview">
                版本 V{{ selectedPreview.versionNo }} · {{ formatDate(selectedPreview.createdAt) }}
              </span>
            </div>

            <div v-if="!selectedPreview" class="panel-empty">
              这套模板还没有可预览版本，先生成第一版。
            </div>
            <div v-else>
              <div class="preview-summary-card">
                <div class="tag-row">
                  <span class="status-chip">{{ selectedPreview.result.moodLabel }}</span>
                  <span v-if="selectedPreview.isPublished" class="status-chip featured">线上版本</span>
                  <span v-if="selectedPreview.isCurrent" class="status-chip warning">当前预览</span>
                </div>
                <h4>{{ selectedPreview.result.coverTitle }}</h4>
                <p>{{ selectedPreview.result.coverPhrase }}</p>
              </div>

              <div class="preview-frame-grid">
                <article
                  v-for="frame in selectedPreview.result.previewFrames"
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

          <div class="preview-panel">
            <div class="section-title-row">
              <h4>版本记录</h4>
              <span class="section-hint">
                {{ selectedTemplate ? `${selectedTemplate.versions.length} 个版本` : "0 个版本" }}
              </span>
            </div>

            <div v-if="!selectedTemplate?.versions.length" class="panel-empty">
              当前还没有版本记录。
            </div>
            <div v-else class="version-list">
              <article v-for="version in selectedTemplate.versions" :key="version.id" class="version-card">
                <div class="version-top">
                  <div>
                    <strong>版本 V{{ version.versionNo }}</strong>
                    <p>{{ formatDate(version.createdAt) }}</p>
                  </div>
                  <div class="tag-row">
                    <span v-if="version.isCurrent" class="status-chip warning">当前预览</span>
                    <span v-if="version.isPublished" class="status-chip featured">线上版本</span>
                  </div>
                </div>
                <p class="version-note">{{ version.changeNote }}</p>
                <p class="version-prompt">{{ version.promptText }}</p>
                <button class="panel-button ghost compact" type="button" @click="loadPreview(version.id)">
                  查看这个版本
                </button>
              </article>
            </div>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>
