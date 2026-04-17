<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ApiError } from "../services/http";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref("");
const form = reactive({
  account: "",
  password: ""
});

const redirectTarget = computed(() => {
  const target = route.query.redirect;
  return typeof target === "string" && target ? target : "/dashboard";
});

async function handleSubmit() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await authStore.login(form);
    await router.replace(redirectTarget.value);
  } catch (error) {
    errorMessage.value =
      error instanceof ApiError ? error.message : "登录失败，请检查当前配置";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-layout">
    <section class="auth-card">
      <div class="auth-brand">小叶记管理后台</div>
      <h1>先登录，再继续进入后台</h1>
      <p class="auth-copy">
        Milestone 1 先接通最小登录链路。当前账号由 API 服务读取环境变量生成，用于本地开发和验收。
      </p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>账号</span>
          <input v-model.trim="form.account" type="text" placeholder="请输入后台账号" />
        </label>

        <label class="field">
          <span>密码</span>
          <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
        </label>

        <p v-if="errorMessage" class="feedback feedback-error">{{ errorMessage }}</p>

        <button class="primary-button" :disabled="loading" type="submit">
          {{ loading ? "登录中..." : "登录后台" }}
        </button>
      </form>

      <div class="auth-note">
        <strong>验收提示</strong>
        <p>本地开发默认账号请查看根目录 `.env.dev` 中的认证配置。</p>
      </div>
    </section>
  </div>
</template>
