import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import router from "./router";
import { pinia } from "./stores/pinia";
import { useAuthStore } from "./stores/auth";

useAuthStore(pinia).hydrate();

createApp(App).use(pinia).use(router).mount("#app");
