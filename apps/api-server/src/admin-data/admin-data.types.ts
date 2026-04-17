import { TemplateCategoryCode } from "../templates/templates.types";

export type AdminTemplateCategoryCode = Exclude<TemplateCategoryCode, "all">;
export type AdminTemplateStatus = "draft" | "published" | "offline";
export type AdminWorkStatus = "draft" | "ready" | "ordered";

export interface TemplateGenerateInput {
  name: string;
  themeTitle: string;
  categoryCode: AdminTemplateCategoryCode;
  pageCount: number;
  minPhotos: number;
  maxPhotos: number;
  priceInCents: number;
  promptText: string;
}

export interface TemplatePageBlueprint {
  pageNo: number;
  section: "cover" | "opening" | "content" | "closing";
  layoutType: string;
  title: string;
  caption: string;
  decorativeElements: string[];
}

export interface TemplatePreviewFrame {
  pageNo: number;
  section: "cover" | "opening" | "content" | "closing";
  layoutType: string;
  title: string;
  image: string;
  caption: string;
}

export interface TemplateGeneratedResult {
  categoryName: string;
  themeLabel: string;
  badgeText: string;
  summary: string;
  description: string;
  storyHighlights: string[];
  suitableScenes: string[];
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  photoSuggestionText: string;
  coverTitle: string;
  coverPhrase: string;
  moodLabel: string;
  sceneKeywords: string[];
  sectionPlan: string[];
  pageBlueprints: TemplatePageBlueprint[];
  previewFrames: TemplatePreviewFrame[];
}

export interface AdminTemplateVersionRecord {
  id: string;
  versionNo: number;
  createdAt: string;
  promptText: string;
  changeNote: string;
  input: TemplateGenerateInput;
  result: TemplateGeneratedResult;
}

export interface AdminTemplateRecord {
  id: string;
  slug: string;
  name: string;
  categoryCode: AdminTemplateCategoryCode;
  categoryName: string;
  summary: string;
  description: string;
  themeLabel: string;
  badgeText: string;
  pageCount: number;
  minPhotos: number;
  maxPhotos: number;
  photoSuggestionText: string;
  priceInCents: number;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  storyHighlights: string[];
  suitableScenes: string[];
  status: AdminTemplateStatus;
  isFeatured: boolean;
  hasUnpublishedChanges: boolean;
  currentVersionId: string | null;
  publishedVersionId: string | null;
  versions: AdminTemplateVersionRecord[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface AdminWorkRecord {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  templateCategoryCode: AdminTemplateCategoryCode;
  parentName: string;
  kindergartenInfo: string;
  childName: string;
  status: AdminWorkStatus;
  photoCount: number;
  pageCount: number;
  previewPageCount: number;
  coverImage: string;
  previewSummary: string;
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  previewFrames: TemplatePreviewFrame[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStoreSnapshot {
  templates: AdminTemplateRecord[];
  works: AdminWorkRecord[];
}
