export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  code: string;
  message: string;
  path: string;
  timestamp: string;
}

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    ok: true,
    data
  };
}
