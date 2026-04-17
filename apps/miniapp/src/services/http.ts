export interface MiniappHttpRequest {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  token?: string | null;
}

export interface MiniappHttpTransport {
  request<T>(options: MiniappHttpRequest): Promise<T>;
}

export function createHttpClient(transport: MiniappHttpTransport) {
  return {
    request: <T>(options: MiniappHttpRequest) => transport.request<T>(options)
  };
}
