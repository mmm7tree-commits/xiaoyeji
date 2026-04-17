import { request } from "./http";
import type {
  AdminTemplateCategoryItem,
  AdminTemplateDetail,
  AdminTemplateListItem,
  AdminTemplatePreviewPayload,
  TemplateBasicForm,
  TemplateGenerateForm,
  TemplateStatus
} from "../types/template-admin";

export function fetchAdminTemplateCategories(token: string) {
  return request<AdminTemplateCategoryItem[]>("/admin/templates/categories", {
    method: "GET",
    token
  });
}

export function fetchAdminTemplates(
  token: string,
  query: {
    keyword?: string;
    categoryCode?: string;
    status?: string;
  }
) {
  const params = new URLSearchParams();

  if (query.keyword?.trim()) {
    params.set("keyword", query.keyword.trim());
  }

  if (query.categoryCode && query.categoryCode !== "all") {
    params.set("categoryCode", query.categoryCode);
  }

  if (query.status && query.status !== "all") {
    params.set("status", query.status);
  }

  const suffix = params.size ? `?${params.toString()}` : "";

  return request<AdminTemplateListItem[]>(`/admin/templates${suffix}`, {
    method: "GET",
    token
  });
}

export function fetchAdminTemplateDetail(token: string, templateId: string) {
  return request<AdminTemplateDetail>(`/admin/templates/${templateId}`, {
    method: "GET",
    token
  });
}

export function fetchAdminTemplatePreview(
  token: string,
  templateId: string,
  versionId?: string
) {
  const suffix = versionId ? `?versionId=${encodeURIComponent(versionId)}` : "";

  return request<AdminTemplatePreviewPayload>(
    `/admin/templates/${templateId}/preview${suffix}`,
    {
      method: "GET",
      token
    }
  );
}

export function createAdminTemplate(token: string, form: TemplateBasicForm) {
  return request<AdminTemplateDetail>("/admin/templates", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: form.name,
      categoryCode: form.categoryCode,
      themeLabel: form.themeLabel,
      summary: form.summary,
      description: form.description,
      badgeText: form.badgeText,
      pageCount: form.pageCount,
      minPhotos: form.minPhotos,
      maxPhotos: form.maxPhotos,
      priceInCents: Math.round(form.priceYuan * 100)
    })
  });
}

export function updateAdminTemplate(
  token: string,
  templateId: string,
  form: TemplateBasicForm
) {
  return request<AdminTemplateDetail>(`/admin/templates/${templateId}`, {
    method: "PUT",
    token,
    body: JSON.stringify({
      name: form.name,
      categoryCode: form.categoryCode,
      themeLabel: form.themeLabel,
      summary: form.summary,
      description: form.description,
      badgeText: form.badgeText,
      pageCount: form.pageCount,
      minPhotos: form.minPhotos,
      maxPhotos: form.maxPhotos,
      priceInCents: Math.round(form.priceYuan * 100)
    })
  });
}

export function generateAdminTemplate(
  token: string,
  form: TemplateBasicForm,
  generator: TemplateGenerateForm
) {
  return request<AdminTemplateDetail>("/admin/templates/generate", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: form.name,
      themeTitle: form.themeLabel,
      categoryCode: form.categoryCode,
      pageCount: form.pageCount,
      minPhotos: form.minPhotos,
      maxPhotos: form.maxPhotos,
      priceInCents: Math.round(form.priceYuan * 100),
      promptText: generator.promptText
    })
  });
}

export function regenerateAdminTemplate(
  token: string,
  templateId: string,
  form: TemplateBasicForm,
  generator: TemplateGenerateForm
) {
  return request<AdminTemplateDetail>(
    `/admin/templates/${templateId}/regenerate`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        name: form.name,
        themeTitle: form.themeLabel,
        categoryCode: form.categoryCode,
        pageCount: form.pageCount,
        minPhotos: form.minPhotos,
        maxPhotos: form.maxPhotos,
        priceInCents: Math.round(form.priceYuan * 100),
        promptText: generator.promptText,
        changeNote: generator.changeNote
      })
    }
  );
}

function postTemplateAction(
  token: string,
  templateId: string,
  action: "publish" | "offline" | "feature" | "unfeature"
) {
  return request<AdminTemplateDetail>(
    `/admin/templates/${templateId}/${action}`,
    {
      method: "POST",
      token
    }
  );
}

export function publishAdminTemplate(token: string, templateId: string) {
  return postTemplateAction(token, templateId, "publish");
}

export function offlineAdminTemplate(token: string, templateId: string) {
  return postTemplateAction(token, templateId, "offline");
}

export function featureAdminTemplate(token: string, templateId: string) {
  return postTemplateAction(token, templateId, "feature");
}

export function unfeatureAdminTemplate(token: string, templateId: string) {
  return postTemplateAction(token, templateId, "unfeature");
}

export function deleteAdminTemplate(token: string, templateId: string) {
  return request<{ deleted: boolean; templateId: string }>(
    `/admin/templates/${templateId}`,
    {
      method: "DELETE",
      token
    }
  );
}
