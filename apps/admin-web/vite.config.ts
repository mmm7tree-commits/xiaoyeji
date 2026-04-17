import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL("../../", import.meta.url));
  const env = loadEnv(mode, envDir, "");

  return {
    envDir,
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: env.ADMIN_WEB_HOST || "127.0.0.1",
      port: Number(env.ADMIN_WEB_PORT || 5173)
    }
  };
});
