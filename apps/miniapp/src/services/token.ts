import { MINIAPP_TOKEN_KEY, MINIAPP_USER_KEY } from "../constants/storage";
import type { MiniappUser } from "../types/auth";
import type { StorageAdapter } from "./storage";

export function createTokenManager(storage: StorageAdapter) {
  return {
    getToken() {
      return storage.get<string>(MINIAPP_TOKEN_KEY);
    },
    setToken(token: string) {
      storage.set(MINIAPP_TOKEN_KEY, token);
    },
    clearToken() {
      storage.remove(MINIAPP_TOKEN_KEY);
    },
    getUser() {
      return storage.get<MiniappUser>(MINIAPP_USER_KEY);
    },
    setUser(user: MiniappUser) {
      storage.set(MINIAPP_USER_KEY, user);
    },
    clearUser() {
      storage.remove(MINIAPP_USER_KEY);
    }
  };
}
