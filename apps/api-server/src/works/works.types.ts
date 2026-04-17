import { TemplateDetail } from "../templates/templates.types";

export type WorkStatusCode = "draft" | "ready";

export interface WorkPhotoRecord {
  id: string;
  path: string;
  localPath?: string;
  tempPath?: string;
  size?: number;
  saved?: boolean;
  source?: {
    kind: "wx_local" | "unknown";
    localPath: string;
    tempPath?: string;
  };
  asset?: {
    assetId: string;
    storageDriver: "local";
    relativePath: string;
    publicUrl: string;
    mimeType: string;
    uploadedAt: string;
  };
  previewUrl?: string;
  fulfillmentUrl?: string;
}

export interface WorkDraftPayload {
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  photos: WorkPhotoRecord[];
}

export interface CreateWorkPayload {
  templateId: string;
  draft: WorkDraftPayload;
}

export interface WorkPreviewPage {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  caption: string;
  photoIds: string[];
  decorativeElements?: string[];
  section?: string;
  bookFormat?: string;
  styleFamily?: string;
  formatLabel?: string;
  styleLabel?: string;
}

export interface WorkPreviewData {
  version: number;
  mode: string;
  generatedAt: number;
  templateId: string;
  templateName: string;
  templateDescription: string;
  layoutLabel: string;
  formatLabel: string;
  bookFormat: string;
  pageAspectRatio: number;
  styleFamily: string;
  styleLabel: string;
  sourceMode: string;
  templateVersion: TemplateDetail["templateVersion"] | null;
  coverImage: string;
  previewImages: string[];
  previewModel: TemplateDetail["previewModel"] | null;
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  minPhotos: number;
  suggestedMinPhotos: number;
  orderMinPhotos: number;
  maxPhotos: number;
  photoCount: number;
  generatedPageCount: number;
  photos: WorkPhotoRecord[];
  pages: WorkPreviewPage[];
}

export interface FrozenTemplateSnapshot {
  id: string;
  slug: string;
  name: string;
  categoryCode: string;
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
  previewImages: string[];
  storyHighlights: string[];
  suitableScenes: string[];
  isFeatured: boolean;
  isPublished: boolean;
  sourceMode: string;
  templateVersion: TemplateDetail["templateVersion"] | null;
  layoutLabel: string;
  formatLabel: string;
  bookFormat: string;
  pageAspectRatio: number;
  styleFamily: string;
  styleLabel: string;
  openingLayout: string;
  closingLayout: string;
  middleLayoutSequence: string[];
  layoutCapacityOverrides: Record<string, number>;
  previewModel: TemplateDetail["previewModel"] | null;
}

export interface WorkRecord {
  id: string;
  clientId: string;
  title: string;
  templateId: string;
  templateName: string;
  templateSourceMode: string;
  templateVersionId: string | null;
  templateVersionNo: number | null;
  templateSnapshot: FrozenTemplateSnapshot;
  scene: string;
  price: number;
  pageCount: number;
  targetPageCount: number;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  previewImages: string[];
  sourceName: string;
  layouts: string[];
  layoutLabel: string;
  recommendedPhotoCount: string;
  formatLabel: string;
  bookFormat: string;
  pageAspectRatio: number;
  styleFamily: string;
  styleLabel: string;
  openingLayout: string;
  closingLayout: string;
  middleLayoutSequence: string[];
  layoutCapacityOverrides: Record<string, number>;
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  suggestedMinPhotos: number;
  orderMinPhotos: number;
  maxPhotos: number;
  photoCount: number;
  previewData: WorkPreviewData;
  layoutPlan: {
    version: number;
    generatedAt: number;
    layoutLabel: string;
    pageCount: number;
    pages: WorkPreviewPage[];
  };
  photos: WorkPhotoRecord[];
  statusCode: WorkStatusCode;
  statusText: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

export interface WorksSnapshot {
  works: WorkRecord[];
}

export interface WorkListItem {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  templateSourceMode: string;
  templateVersionNo: number | null;
  scene: string;
  coverTone: string;
  accentTone: string;
  coverImage: string;
  coverPhoto: string;
  photoCount: number;
  pageCount: number;
  suggestedMinPhotos: number;
  orderMinPhotos: number;
  statusCode: WorkStatusCode;
  statusText: string;
  createdAt: number;
  updatedAt: number;
}
