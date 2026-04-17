export interface UploadedAssetRecord {
  assetId: string;
  source: {
    kind: "wx_local" | "unknown";
    localPath: string;
    tempPath?: string;
    originalFileName: string;
  };
  persisted: {
    storageDriver: "local";
    relativePath: string;
    publicUrl: string;
    mimeType: string;
    size: number;
  };
  previewUrl: string;
  fulfillmentUrl: string;
  uploadedAt: string;
}
