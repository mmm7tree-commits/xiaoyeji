export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 500, code = "UNKNOWN_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || "http://127.0.0.1:3100";

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || (payload && payload.ok === false)) {
    throw new ApiError(
      payload?.message || "请求失败，请稍后重试",
      response.status,
      payload?.code || "REQUEST_FAILED"
    );
  }

  return payload?.data as T;
}
