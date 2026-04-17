import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appName: import.meta.env.VITE_ADMIN_APP_NAME || "小叶记管理后台"
  })
});
