import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { TemplatesService } from "../templates/templates.service";
import { TemplateDetail } from "../templates/templates.types";
import {
  buildFrozenPreviewData,
  buildFrozenTemplateSnapshot
} from "./work-preview.builder";
import {
  CreateWorkPayload,
  WorkDraftPayload,
  WorkListItem,
  WorkPhotoRecord,
  WorkRecord,
  WorkStatusCode
} from "./works.types";
import { WorksDataService } from "./works-data.service";

const WORK_STATUS: Record<WorkStatusCode, { code: WorkStatusCode; label: string }> = {
  draft: {
    code: "draft",
    label: "继续补充"
  },
  ready: {
    code: "ready",
    label: "待下单"
  }
};

function buildId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

@Injectable()
export class WorksService {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly worksDataService: WorksDataService
  ) {}

  listWorks(clientId: string, query: { statusCode?: string }) {
    const safeClientId = this.requireClientId(clientId);
    const safeStatusCode = this.normalizeStatusCode(query.statusCode);
    const snapshot = this.worksDataService.read();
    const items = snapshot.works
      .filter((work) => work.clientId === safeClientId)
      .filter((work) => {
        if (!safeStatusCode || safeStatusCode === "all") {
          return true;
        }
        return work.statusCode === safeStatusCode;
      })
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .map<WorkListItem>((work) => ({
        id: work.id,
        title: work.title,
        templateId: work.templateId,
        templateName: work.templateName,
        templateSourceMode: work.templateSourceMode,
        templateVersionNo: work.templateVersionNo,
        scene: work.scene,
        coverTone: work.coverTone,
        accentTone: work.accentTone,
        coverImage: work.coverImage,
        coverPhoto: work.photos[0]?.path || work.coverImage || "",
        photoCount: work.photoCount,
        pageCount: work.pageCount,
        suggestedMinPhotos: work.suggestedMinPhotos,
        orderMinPhotos: work.orderMinPhotos,
        statusCode: work.statusCode,
        statusText: work.statusText,
        createdAt: work.createdAt,
        updatedAt: work.updatedAt
      }));

    return successResponse(items);
  }

  getWorkDetail(clientId: string, workId: string) {
    const work = this.findWork(clientId, workId);
    return successResponse(work);
  }

  getWorkRecord(clientId: string, workId: string) {
    return this.findWork(clientId, workId);
  }

  createWork(clientId: string, payload: CreateWorkPayload) {
    const safeClientId = this.requireClientId(clientId);
    const safePayload = this.normalizeCreatePayload(payload);
    const template = this.templatesService.getTemplateDetailData(safePayload.templateId);
    const templateSnapshot = buildFrozenTemplateSnapshot(template);
    const previewData = buildFrozenPreviewData(
      template,
      safePayload.draft,
      templateSnapshot
    );
    const status = this.resolveWorkStatus(previewData.photoCount, previewData.orderMinPhotos);
    const now = Date.now();
    const work: WorkRecord = {
      id: buildId("work"),
      clientId: safeClientId,
      title: previewData.coverTitle || template.name,
      templateId: template.id,
      templateName: template.name,
      templateSourceMode: template.sourceMode,
      templateVersionId: template.templateVersion.id,
      templateVersionNo: template.templateVersion.versionNo,
      templateSnapshot,
      scene: template.themeLabel,
      price: template.priceInCents,
      pageCount: previewData.generatedPageCount,
      targetPageCount: template.pageCount,
      coverTone: template.coverTone,
      accentTone: template.accentTone,
      coverImage: previewData.coverImage || template.coverImage,
      previewImages: template.previewImages,
      sourceName: template.sourceMode === "admin_published" ? "后台已发布模板" : "本地兜底模板",
      layouts: this.extractLayouts(template),
      layoutLabel: template.consumptionConfig.layoutLabel,
      recommendedPhotoCount: template.photoSuggestionText,
      formatLabel: template.consumptionConfig.formatLabel,
      bookFormat: template.consumptionConfig.bookFormat,
      pageAspectRatio: template.consumptionConfig.pageAspectRatio,
      styleFamily: template.consumptionConfig.styleFamily,
      styleLabel: template.consumptionConfig.styleLabel,
      openingLayout: template.consumptionConfig.openingLayout,
      closingLayout: template.consumptionConfig.closingLayout,
      middleLayoutSequence: template.consumptionConfig.middleLayoutSequence,
      layoutCapacityOverrides: template.consumptionConfig.layoutCapacityOverrides,
      coverTitle: previewData.coverTitle,
      babyInfo: previewData.babyInfo,
      coverPhrase: previewData.coverPhrase,
      suggestedMinPhotos: previewData.suggestedMinPhotos,
      orderMinPhotos: previewData.orderMinPhotos,
      maxPhotos: previewData.maxPhotos,
      photoCount: previewData.photoCount,
      previewData,
      layoutPlan: {
        version: previewData.version,
        generatedAt: previewData.generatedAt,
        layoutLabel: previewData.layoutLabel,
        pageCount: previewData.generatedPageCount,
        pages: previewData.pages
      },
      photos: previewData.photos,
      statusCode: status.code,
      statusText: status.label,
      status: status.label,
      createdAt: now,
      updatedAt: now
    };

    this.worksDataService.update((snapshot) => {
      snapshot.works = [work].concat(
        snapshot.works.filter((item) => item.clientId !== safeClientId || item.id !== work.id)
      );
    });

    return successResponse(work);
  }

  deleteWork(clientId: string, workId: string) {
    const safeClientId = this.requireClientId(clientId);
    const existing = this.findWork(safeClientId, workId);
    this.worksDataService.update((snapshot) => {
      snapshot.works = snapshot.works.filter((work) => {
        return !(work.clientId === safeClientId && work.id === workId);
      });
    });
    return successResponse({
      id: existing.id,
      deleted: true
    });
  }

  private findWork(clientId: string, workId: string) {
    const safeClientId = this.requireClientId(clientId);
    const snapshot = this.worksDataService.read();
    const work = snapshot.works.find((item) => {
      return item.clientId === safeClientId && item.id === workId;
    });

    if (!work) {
      throw new NotFoundException({
        code: "WORK_NOT_FOUND",
        message: "作品不存在，或不属于当前设备"
      });
    }

    return work;
  }

  private requireClientId(clientId?: string) {
    const safeClientId = String(clientId || "").trim();
    if (!safeClientId) {
      throw new BadRequestException({
        code: "CLIENT_ID_REQUIRED",
        message: "缺少当前设备标识，请重新打开小程序后再试"
      });
    }
    return safeClientId;
  }

  private normalizeStatusCode(statusCode?: string) {
    if (!statusCode || statusCode === "all") {
      return "all";
    }
    if (!Object.prototype.hasOwnProperty.call(WORK_STATUS, statusCode)) {
      throw new BadRequestException({
        code: "WORK_STATUS_INVALID",
        message: "作品状态不存在"
      });
    }
    return statusCode as WorkStatusCode;
  }

  private normalizeCreatePayload(payload: CreateWorkPayload) {
    if (!payload || typeof payload !== "object") {
      throw new BadRequestException({
        code: "WORK_PAYLOAD_INVALID",
        message: "作品保存参数缺失"
      });
    }

    const templateId = String(payload.templateId || "").trim();
    if (!templateId) {
      throw new BadRequestException({
        code: "WORK_TEMPLATE_REQUIRED",
        message: "缺少模板信息，请重新进入模板后再保存"
      });
    }

    const rawDraft = payload.draft || ({} as WorkDraftPayload);
    const rawPhotos = Array.isArray(rawDraft.photos) ? rawDraft.photos : [];
    const photos = this.normalizePhotos(rawPhotos);
    if (rawPhotos.length && photos.length !== rawPhotos.length) {
      throw new BadRequestException({
        code: "WORK_PHOTOS_ASSET_REQUIRED",
        message: "请先把作品图片同步到服务端资源后，再保存作品"
      });
    }
    if (!photos.length) {
      throw new BadRequestException({
        code: "WORK_PHOTOS_REQUIRED",
        message: "请至少添加 1 张照片后再保存作品"
      });
    }

    return {
      templateId,
      draft: {
        coverTitle: String(rawDraft.coverTitle || "").trim(),
        babyInfo: String(rawDraft.babyInfo || "").trim(),
        coverPhrase: String(rawDraft.coverPhrase || "").trim(),
        photos
      }
    };
  }

  private normalizePhotos(photos: WorkPhotoRecord[] | undefined) {
    if (!Array.isArray(photos)) {
      return [];
    }

    return photos
      .filter((photo) => photo && typeof photo === "object")
      .map<WorkPhotoRecord>((photo, index) => ({
        id: String(photo.id || buildId(`photo_${index}`)),
        path: String(photo.previewUrl || (photo.asset && photo.asset.publicUrl) || photo.path || "").trim(),
        localPath: photo.localPath ? String(photo.localPath) : String(photo.path || "").trim(),
        tempPath: photo.tempPath ? String(photo.tempPath) : "",
        size: Number(photo.size || 0),
        saved: Boolean(photo.saved),
        source: photo.source
          ? {
            kind: photo.source.kind === "wx_local" ? "wx_local" : "unknown",
            localPath: String(photo.source.localPath || photo.path || "").trim(),
            tempPath: photo.source.tempPath ? String(photo.source.tempPath) : ""
          }
          : {
            kind: "wx_local",
            localPath: String(photo.path || "").trim(),
            tempPath: photo.tempPath ? String(photo.tempPath) : ""
          },
        asset: photo.asset
          ? {
            assetId: String(photo.asset.assetId || ""),
            storageDriver: "local",
            relativePath: String(photo.asset.relativePath || ""),
            publicUrl: String(photo.asset.publicUrl || ""),
            mimeType: String(photo.asset.mimeType || "application/octet-stream"),
            uploadedAt: String(photo.asset.uploadedAt || new Date().toISOString())
          }
          : undefined,
        previewUrl: String(photo.previewUrl || (photo.asset && photo.asset.publicUrl) || photo.path || "").trim(),
        fulfillmentUrl: String(photo.fulfillmentUrl || (photo.asset && photo.asset.publicUrl) || photo.path || "").trim()
      }))
      .filter((photo) => Boolean(photo.path) && Boolean(photo.asset && photo.asset.publicUrl));
  }

  private resolveWorkStatus(photoCount: number, orderMinPhotos: number) {
    if (photoCount < orderMinPhotos) {
      return WORK_STATUS.draft;
    }
    return WORK_STATUS.ready;
  }

  private extractLayouts(template: TemplateDetail) {
    const layouts = new Set<string>();
    layouts.add("cover");

    if (template.previewModel && Array.isArray(template.previewModel.pageBlueprints)) {
      template.previewModel.pageBlueprints.forEach((page) => {
        if (page.layoutType) {
          layouts.add(page.layoutType);
        }
      });
    }

    if (template.consumptionConfig.openingLayout) {
      layouts.add(template.consumptionConfig.openingLayout);
    }
    if (template.consumptionConfig.closingLayout) {
      layouts.add(template.consumptionConfig.closingLayout);
    }
    template.consumptionConfig.middleLayoutSequence.forEach((layout) => layouts.add(layout));

    return Array.from(layouts);
  }
}
