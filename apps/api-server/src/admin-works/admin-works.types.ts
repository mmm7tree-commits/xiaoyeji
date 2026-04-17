import {
  AdminWorkRecord,
  AdminWorkStatus,
  TemplatePreviewFrame
} from "../admin-data/admin-data.types";

export interface AdminWorkListItem {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  status: AdminWorkStatus;
  statusText: string;
  parentName: string;
  kindergartenInfo: string;
  photoCount: number;
  pageCount: number;
  previewPageCount: number;
  coverImage: string;
  previewSummary: string;
  updatedAt: string;
}

export interface AdminWorkDetail extends AdminWorkRecord {
  statusText: string;
  detailSections: Array<{
    label: string;
    value: string;
  }>;
  previewEntrance: {
    title: string;
    description: string;
    frames: TemplatePreviewFrame[];
  };
}
