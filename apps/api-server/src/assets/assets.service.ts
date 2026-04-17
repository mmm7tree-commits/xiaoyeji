import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import { UploadedAssetRecord } from "./assets.types";

function buildId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

@Injectable()
export class AssetsService {
  private readonly storageRoot = path.resolve(
    process.cwd(),
    process.env.STORAGE_LOCAL_ROOT || "./uploads"
  );
  private readonly assetBaseUrl =
    process.env.ASSET_PUBLIC_BASE_URL ||
    `http://${process.env.API_SERVER_HOST || "127.0.0.1"}:${process.env.API_SERVER_PORT || "3100"}`;

  saveWorkPhoto(
    file: { originalname?: string; mimetype?: string; size?: number; buffer?: Buffer },
    meta: { sourceLocalPath?: string; sourceTempPath?: string }
  ) {
    if (!file || !file.buffer || !file.buffer.length) {
      throw new BadRequestException({
        code: "ASSET_FILE_REQUIRED",
        message: "缺少上传图片文件"
      });
    }

    const originalName = sanitizeFileName(file.originalname || "photo.jpg");
    const extension = path.extname(originalName) || ".jpg";
    const folder = path.join(
      "work-assets",
      `${new Date().getFullYear()}`,
      `${new Date().getMonth() + 1}`.padStart(2, "0")
    );
    const relativeFilePath = path.join(folder, `${buildId("asset")}${extension}`);
    const absoluteFilePath = path.join(this.storageRoot, relativeFilePath);

    fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });
    fs.writeFileSync(absoluteFilePath, file.buffer);

    const relativePath = `/storage/${relativeFilePath.replace(/\\/g, "/")}`;
    const publicUrl = `${this.assetBaseUrl}${relativePath}`;
    const uploadedAt = new Date().toISOString();

    const result: UploadedAssetRecord = {
      assetId: buildId("assetref"),
      source: {
        kind: "wx_local",
        localPath: String(meta.sourceLocalPath || ""),
        tempPath: String(meta.sourceTempPath || ""),
        originalFileName: originalName
      },
      persisted: {
        storageDriver: "local",
        relativePath,
        publicUrl,
        mimeType: String(file.mimetype || "application/octet-stream"),
        size: Number(file.size || file.buffer.length || 0)
      },
      previewUrl: publicUrl,
      fulfillmentUrl: publicUrl,
      uploadedAt
    };

    return result;
  }
}
