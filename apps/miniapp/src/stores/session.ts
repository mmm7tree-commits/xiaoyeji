import type { MiniappLoginResult, SessionStatus } from "../types/auth";
import type { StorageAdapter } from "../services/storage";
import { createTokenManager } from "../services/token";

export interface SessionState {
  token: string | null;
  status: SessionStatus;
  userName: string | null;
}

export function createSessionStore(storage: StorageAdapter) {
  const tokenManager = createTokenManager(storage);

  const state: SessionState = {
    token: tokenManager.getToken(),
    status: tokenManager.getToken() ? "AUTHENTICATED" : "ANONYMOUS",
    userName: tokenManager.getUser()?.name || null
  };

  return {
    state,
    hydrate() {
      state.token = tokenManager.getToken();
      state.userName = tokenManager.getUser()?.name || null;
      state.status = state.token ? "AUTHENTICATED" : "ANONYMOUS";
    },
    setSession(result: MiniappLoginResult) {
      tokenManager.setToken(result.accessToken);
      tokenManager.setUser(result.user);
      state.token = result.accessToken;
      state.userName = result.user.name;
      state.status = "AUTHENTICATED";
    },
    clearSession() {
      tokenManager.clearToken();
      tokenManager.clearUser();
      state.token = null;
      state.userName = null;
      state.status = "ANONYMOUS";
    }
  };
}
