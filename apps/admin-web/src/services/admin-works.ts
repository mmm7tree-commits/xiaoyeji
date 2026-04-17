import { request } from "./http";
import type { AdminWorkDetail, AdminWorkListItem } from "../types/work-admin";

export function fetchAdminWorks(
  token: string,
  query: {
    keyword?: string;
    status?: string;
    templateId?: string;
  }
) {
  const params = new URLSearchParams();

  if (query.keyword?.trim()) {
    params.set("keyword", query.keyword.trim());
  }

  if (query.status && query.status !== "all") {
    params.set("status", query.status);
  }

  if (query.templateId && query.templateId !== "all") {
    params.set("templateId", query.templateId);
  }

  const suffix = params.size ? `?${params.toString()}` : "";

  return request<AdminWorkListItem[]>(`/admin/works${suffix}`, {
    method: "GET",
    token
  });
}

export function fetchAdminWorkDetail(token: string, workId: string) {
  return request<AdminWorkDetail>(`/admin/works/${workId}`, {
    method: "GET",
    token
  });
}
