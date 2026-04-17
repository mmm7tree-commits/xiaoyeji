import { defineStore } from "pinia";
import { fetchCurrentUser, login } from "../services/auth";
import type { AuthUser, LoginPayload } from "../types/auth";

const TOKEN_KEY = "xiaoyeji.admin.token";
const USER_KEY = "xiaoyeji.admin.user";

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    currentUser: null as AuthUser | null,
    hydrated: false
  }),
  getters: {
    isAuthenticated(state) {
      return Boolean(state.token && state.currentUser);
    }
  },
  actions: {
    hydrate() {
      if (this.hydrated || typeof window === "undefined") {
        return;
      }

      this.token = safeRead<string>(TOKEN_KEY);
      this.currentUser = safeRead<AuthUser>(USER_KEY);
      this.hydrated = true;
    },

    persist() {
      if (typeof window === "undefined") {
        return;
      }

      if (this.token) {
        window.localStorage.setItem(TOKEN_KEY, JSON.stringify(this.token));
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }

      if (this.currentUser) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }
    },

    setSession(token: string, user: AuthUser) {
      this.token = token;
      this.currentUser = user;
      this.persist();
    },

    clearSession() {
      this.token = null;
      this.currentUser = null;
      this.persist();
    },

    async login(payload: LoginPayload) {
      const result = await login(payload);
      this.setSession(result.accessToken, result.user);
      return result;
    },

    async ensureSession() {
      this.hydrate();

      if (!this.token) {
        return null;
      }

      if (this.currentUser) {
        return this.currentUser;
      }

      try {
        const user = await fetchCurrentUser(this.token);
        this.currentUser = user;
        this.persist();
        return user;
      } catch (error) {
        this.clearSession();
        throw error;
      }
    },

    async refreshCurrentUser() {
      if (!this.token) {
        return null;
      }

      const user = await fetchCurrentUser(this.token);
      this.currentUser = user;
      this.persist();
      return user;
    },

    logout() {
      this.clearSession();
    }
  }
});
