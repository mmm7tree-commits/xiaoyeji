export type TemplateCategoryCode = "graduation" | "growth" | "classroom";
export type TemplateStatus = "draft" | "published" | "offline";

export interface AdminTemplateCategoryItem {
  code: "all" | TemplateCategoryCode;
  name: string;
  description: string;
  templateCount: number;
  publishedCount: number;
}

export interface AdminTemplateListItem {
  id: string;
  slug: string;
  name: string;
  categoryCode: TemplateCategoryCode;
  categoryName: string;
  status: TemplateStatus;
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

export interface TemplatePreviewFrame {
  pageNo: number;
  section: "cover" | "opening" | "content" | "closing";
  layoutType: string;
  title: string;
  image: string;
  caption: string;
}

export interface AdminTemplatePreviewPayload {
  templateId: string;
  templateName: string;
  versionId: string;
  versionNo: number;
  promptText: string;
  changeNote: string;
  createdAt: string;
  result: {
    coverTitle: string;
    coverPhrase: string;
    moodLabel: string;
    sceneKeywords: string[];
    sectionPlan: string[];
    pageBlueprints: Array<{
      pageNo: number;
      section: "cover" | "opening" | "content" | "closing";
      layoutType: string;
      title: string;
      caption: string;
      decorativeElements: string[];
    }>;
    previewFrames: TemplatePreviewFrame[];
  };
  isCurrent: boolean;
  isPublished: boolean;
}

export interface AdminTemplateDetail {
  id: string;
  slug: string;
  name: string;
  categoryCode: TemplateCategoryCode;
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
  priceText: string;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  storyHighlights: string[];
  suitableScenes: string[];
  status: TemplateStatus;
  isFeatured: boolean;
  hasUnpublishedChanges: boolean;
  currentVersionId: string | null;
  publishedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  relatedWorkCount: number;
  versions: Array<{
    id: string;
    versionNo: number;
    createdAt: string;
    promptText: string;
    changeNote: string;
    isCurrent: boolean;
    isPublished: boolean;
  }>;
  currentVersion: AdminTemplatePreviewPayload | null;
  publishedVersion: AdminTemplatePreviewPayload | null;
  rules: {
    canPublish: boolean;
    canFeature: boolean;
    canDelete: boolean;
    deleteReason: string | null;
  };
}

export interface TemplateBasicForm {
  name: string;
  categoryCode: TemplateCategoryCode;
  themeLabel: string;
  summary: string;
  description: string;
  badgeText: string;
  pageCount: number;
  minPhotos: number;
  maxPhotos: number;
  priceYuan: number;
}

export interface TemplateGenerateForm {
  promptText: string;
  changeNote: string;
}
