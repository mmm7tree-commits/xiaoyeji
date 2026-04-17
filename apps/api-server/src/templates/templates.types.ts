export type TemplateCategoryCode = "all" | "graduation" | "growth" | "classroom";
export type TemplateSourceMode = "admin_published" | "seed_fallback";

export interface TemplateSeed {
  id: string;
  slug: string;
  name: string;
  categoryCode: Exclude<TemplateCategoryCode, "all">;
  categoryName: string;
  summary: string;
  description: string;
  themeLabel: string;
  badgeText: string;
  photoSuggestionText: string;
  storyHighlights: string[];
  suitableScenes: string[];
  pageCount: number;
  minPhotos: number;
  priceInCents: number;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  isFeatured?: boolean;
}

export interface TemplateCategoryItem {
  code: TemplateCategoryCode;
  name: string;
  description: string;
  templateCount: number;
  isDefault: boolean;
}

export interface TemplateListItem {
  id: string;
  slug: string;
  name: string;
  categoryCode: Exclude<TemplateCategoryCode, "all">;
  categoryName: string;
  summary: string;
  description: string;
  themeLabel: string;
  badgeText: string;
  photoSuggestionText: string;
  pageCount: number;
  minPhotos: number;
  suggestedMinPhotos: number;
  orderMinPhotos: number;
  maxPhotos: number;
  priceInCents: number;
  priceText: string;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  sourceMode: TemplateSourceMode;
  templateVersionId: string | null;
  templateVersionNo: number | null;
}

export interface FeaturedTemplateDetail extends TemplateListItem {
  featureTitle: string;
  featureDescription: string;
  storyHighlights: string[];
  previewImages: string[];
}

export interface TemplateVersionInfo {
  id: string | null;
  versionNo: number | null;
  createdAt: string | null;
  sourceMode: TemplateSourceMode;
}

export interface TemplateConsumptionConfig {
  layoutLabel: string;
  formatLabel: string;
  bookFormat: "square" | "portrait" | "landscape";
  pageAspectRatio: number;
  styleFamily: string;
  styleLabel: string;
  suggestedMinPhotos: number;
  orderMinPhotos: number;
  maxPhotos: number;
  openingLayout: string;
  closingLayout: string;
  middleLayoutSequence: string[];
  layoutCapacityOverrides: Record<string, number>;
}

export interface TemplatePreviewBlueprint {
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

export interface TemplatePreviewModel {
  coverTitle: string;
  coverPhrase: string;
  moodLabel: string;
  sceneKeywords: string[];
  sectionPlan: string[];
  pageBlueprints: TemplatePreviewBlueprint[];
  previewFrames: TemplatePreviewFrame[];
}

export interface TemplateDetail extends TemplateListItem {
  storyHighlights: string[];
  suitableScenes: string[];
  previewImages: string[];
  templateVersion: TemplateVersionInfo;
  consumptionConfig: TemplateConsumptionConfig;
  previewModel: TemplatePreviewModel;
}
