import {
  AdminTemplateCategoryCode,
  AdminTemplateRecord,
  AdminTemplateStatus,
  TemplateGenerateInput,
  TemplateGeneratedResult
} from "../admin-data/admin-data.types";

export interface AdminTemplateCategoryItem {
  code: "all" | AdminTemplateCategoryCode;
  name: string;
  description: string;
  templateCount: number;
  publishedCount: number;
}

export interface AdminTemplateListItem {
  id: string;
  slug: string;
  name: string;
  categoryCode: AdminTemplateCategoryCode;
  categoryName: string;
  status: AdminTemplateStatus;
  statusText: string;
  isFeatured: boolean;
  hasUnpublishedChanges: boolean;
  summary: string;
  themeLabel: string;
  pageCount: number;
  minPhotos: number;
  maxPhotos: number;
  priceInCents: number;
  priceText: string;
  coverImage: string;
  updatedAt: string;
  versionCount: number;
  currentVersionNo: number | null;
  publishedVersionNo: number | null;
  relatedWorkCount: number;
}

export interface AdminTemplateVersionSummary {
  id: string;
  versionNo: number;
  createdAt: string;
  promptText: string;
  changeNote: string;
  isCurrent: boolean;
  isPublished: boolean;
}

export interface AdminTemplatePreviewPayload {
  templateId: string;
  templateName: string;
  versionId: string;
  versionNo: number;
  promptText: string;
  changeNote: string;
  createdAt: string;
  result: TemplateGeneratedResult;
  isCurrent: boolean;
  isPublished: boolean;
}

export interface AdminTemplateDetail extends Omit<AdminTemplateRecord, "versions"> {
  priceText: string;
  relatedWorkCount: number;
  versions: AdminTemplateVersionSummary[];
  currentVersion: AdminTemplatePreviewPayload | null;
  publishedVersion: AdminTemplatePreviewPayload | null;
  rules: {
    canPublish: boolean;
    canFeature: boolean;
    canDelete: boolean;
    deleteReason: string | null;
  };
}

export interface TemplateListQuery {
  keyword?: string;
  categoryCode?: string;
  status?: string;
}

export interface CreateTemplatePayload {
  name: string;
  categoryCode: AdminTemplateCategoryCode;
  themeLabel: string;
  summary: string;
  description: string;
  badgeText: string;
  pageCount: number;
  minPhotos: number;
  maxPhotos: number;
  priceInCents: number;
}

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export type GenerateTemplatePayload = TemplateGenerateInput;

export interface RegenerateTemplatePayload extends Partial<TemplateGenerateInput> {
  promptText: string;
  changeNote?: string;
}
