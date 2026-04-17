export type AdminWorkStatus = "draft" | "ready" | "ordered";

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

export interface AdminWorkDetail extends AdminWorkListItem {
  childName: string;
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  detailSections: Array<{
    label: string;
    value: string;
  }>;
  previewEntrance: {
    title: string;
    description: string;
    frames: Array<{
      pageNo: number;
      section: "cover" | "opening" | "content" | "closing";
      layoutType: string;
      title: string;
      image: string;
      caption: string;
    }>;
  };
}
