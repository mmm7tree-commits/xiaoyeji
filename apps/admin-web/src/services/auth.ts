import { LoginPayload, LoginResult, AuthUser } from "../types/auth";
import { request } from "./http";

export function login(payload: LoginPayload) {
  return request<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchCurrentUser(token: string) {
  return request<AuthUser>("/auth/me", {
    method: "GET",
    token
  });
}
