import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { AdminDataService } from "../admin-data/admin-data.service";
import {
  AdminTemplateCategoryCode,
  AdminTemplateRecord,
  AdminTemplateVersionRecord,
  TemplateGenerateInput
} from "../admin-data/admin-data.types";
import { buildTemplateGeneratedResult } from "./template-generator";
import {
  AdminTemplateCategoryItem,
  AdminTemplateDetail,
  AdminTemplateListItem,
  AdminTemplatePreviewPayload,
  CreateTemplatePayload,
  GenerateTemplatePayload,
  RegenerateTemplatePayload,
  TemplateListQuery,
  UpdateTemplatePayload
} from "./admin-templates.types";

const templateCategoryMeta: Array<{
  code: "all" | AdminTemplateCategoryCode;
  name: string;
  description: string;
}> = [
  {
    code: "all",
    name: "全部分类",
    description: "先查看全部模板，再按分类继续筛选。"
  },
  {
    code: "graduation",
    name: "毕业纪念",
    description: "适合毕业典礼、老师寄语和班级合照。"
  },
  {
    code: "growth",
    name: "成长记录",
    description: "适合日常成长、课堂笑脸和活动留念。"
  },
  {
    code: "classroom",
    name: "班级活动",
    description: "适合班级活动、春游故事和热闹合辑。"
  }
];

const previewImageCatalog: Record<AdminTemplateCategoryCode, string[]> = {
  graduation: [
    "/assets/templates/summer-square/cover.jpg",
    "/assets/templates/graduation-memory/page-1.jpg",
    "/assets/templates/graduation-vertical-20/page-2.jpg",
    "/assets/templates/graduation-landscape/page-2.jpg"
  ],
  growth: [
    "/assets/templates/growth-album/cover.jpg",
    "/assets/templates/growth-album/page-1.jpg",
    "/assets/templates/illustration-square/page-2.jpg",
    "/assets/templates/psd-30-square/page-1.jpg"
  ],
  classroom: [
    "/assets/templates/class-square/cover.jpg",
    "/assets/templates/class-square/page-2.jpg",
    "/assets/templates/storybook-sample-30/page-1.jpg",
    "/assets/templates/storybook-sample-30/page-2.jpg"
  ]
};

function nowIso() {
  return new Date().toISOString();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueBySlug(baseSlug: string, existingSlugs: string[]) {
  let nextSlug = baseSlug;
  let suffix = 2;

  while (existingSlugs.includes(nextSlug)) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return nextSlug;
}

function formatPrice(priceInCents: number) {
  return `¥${(priceInCents / 100).toFixed(0)}`;
}

function statusText(status: AdminTemplateRecord["status"]) {
  if (status === "draft") {
    return "草稿中";
  }
  if (status === "published") {
    return "已上架";
  }
  return "已下架";
}

function currentVersionNo(template: AdminTemplateRecord) {
  return (
    template.versions.find((item) => item.id === template.currentVersionId)?.versionNo || null
  );
}

function publishedVersionNo(template: AdminTemplateRecord) {
  return (
    template.versions.find((item) => item.id === template.publishedVersionId)?.versionNo ||
    null
  );
}

@Injectable()
export class AdminTemplatesService {
  constructor(private readonly adminDataService: AdminDataService) {}

  getCategories() {
    const snapshot = this.adminDataService.read();

    const categories = templateCategoryMeta.map<AdminTemplateCategoryItem>((item) => {
      const templates =
        item.code === "all"
          ? snapshot.templates
          : snapshot.templates.filter((template) => template.categoryCode === item.code);

      return {
        code: item.code,
        name: item.name,
        description: item.description,
        templateCount: templates.length,
        publishedCount: templates.filter((template) => template.status === "published").length
      };
    });

    return successResponse(categories);
  }

  listTemplates(query: TemplateListQuery) {
    const snapshot = this.adminDataService.read();
    const safeCategoryCode = this.normalizeCategoryCode(query.categoryCode);
    const safeStatus = this.normalizeStatus(query.status);
    const keyword = String(query.keyword || "").trim().toLowerCase();

    const items = snapshot.templates
      .filter((template) => {
        if (safeCategoryCode !== "all" && template.categoryCode !== safeCategoryCode) {
          return false;
        }

        if (safeStatus && template.status !== safeStatus) {
          return false;
        }

        if (!keyword) {
          return true;
        }

        return [
          template.name,
          template.summary,
          template.description,
          template.themeLabel,
          template.badgeText
        ].some((field) => field.toLowerCase().includes(keyword));
      })
      .sort((left, right) => {
        if (left.isFeatured !== right.isFeatured) {
          return Number(right.isFeatured) - Number(left.isFeatured);
        }

        return right.updatedAt.localeCompare(left.updatedAt);
      })
      .map((template) => this.toListItem(template, snapshot.works));

    return successResponse(items);
  }

  getTemplateDetail(templateId: string) {
    const snapshot = this.adminDataService.read();
    const template = this.findTemplateOrThrow(snapshot.templates, templateId);

    return successResponse(this.toDetail(template, snapshot.works));
  }

  createTemplate(payload: CreateTemplatePayload) {
    const validated = this.validateBasicPayload(payload);

    return successResponse(
      this.adminDataService.update((snapshot) => {
        const slug = uniqueBySlug(
          slugify(validated.name),
          snapshot.templates.map((item) => item.slug)
        );
        const template: AdminTemplateRecord = {
          id: `tpl-${Date.now()}`,
          slug,
          name: validated.name,
          categoryCode: validated.categoryCode,
          categoryName: this.getCategoryName(validated.categoryCode),
          summary: validated.summary,
          description: validated.description,
          themeLabel: validated.themeLabel,
          badgeText: validated.badgeText,
          pageCount: validated.pageCount,
          minPhotos: validated.minPhotos,
          maxPhotos: validated.maxPhotos,
          photoSuggestionText: `建议准备 ${validated.minPhotos}-${validated.maxPhotos} 张照片`,
          priceInCents: validated.priceInCents,
          coverTone: "#EAF3D9",
          accentTone: "#8CCB9B",
          coverImage: previewImageCatalog[validated.categoryCode][0],
          previewImages: previewImageCatalog[validated.categoryCode].slice(0, 4),
          storyHighlights: [],
          suitableScenes: [],
          status: "draft",
          isFeatured: false,
          hasUnpublishedChanges: false,
          currentVersionId: null,
          publishedVersionId: null,
          versions: [],
          createdAt: nowIso(),
          updatedAt: nowIso(),
          publishedAt: null
        };

        snapshot.templates.unshift(template);
        return this.toDetail(template, snapshot.works);
      })
    );
  }

  updateTemplate(templateId: string, payload: UpdateTemplatePayload) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);
        const next = this.validateUpdatePayload(template, payload);
        const generationChanged =
          next.name !== template.name ||
          next.categoryCode !== template.categoryCode ||
          next.pageCount !== template.pageCount ||
          next.minPhotos !== template.minPhotos ||
          next.maxPhotos !== template.maxPhotos;

        template.name = next.name;
        template.categoryCode = next.categoryCode;
        template.categoryName = this.getCategoryName(next.categoryCode);
        template.themeLabel = next.themeLabel;
        template.summary = next.summary;
        template.description = next.description;
        template.badgeText = next.badgeText;
        template.pageCount = next.pageCount;
        template.minPhotos = next.minPhotos;
        template.maxPhotos = next.maxPhotos;
        template.photoSuggestionText = `建议准备 ${next.minPhotos}-${next.maxPhotos} 张照片`;
        template.priceInCents = next.priceInCents;
        template.updatedAt = nowIso();
        template.slug = uniqueBySlug(
          slugify(next.name),
          snapshot.templates
            .filter((item) => item.id !== template.id)
            .map((item) => item.slug)
        );

        if (generationChanged && template.versions.length) {
          template.hasUnpublishedChanges = true;
        }

        return this.toDetail(template, snapshot.works);
      })
    );
  }

  generateTemplate(payload: GenerateTemplatePayload) {
    const input = this.validateGenerationInput(payload);

    return successResponse(
      this.adminDataService.update((snapshot) => {
        const slug = uniqueBySlug(
          slugify(input.name),
          snapshot.templates.map((item) => item.slug)
        );
        const templateId = `tpl-${Date.now()}`;
        const version = this.createVersionRecord(templateId, 1, input, "首次根据主题生成");
        const template: AdminTemplateRecord = {
          id: templateId,
          slug,
          name: input.name,
          categoryCode: input.categoryCode,
          categoryName: this.getCategoryName(input.categoryCode),
          summary: version.result.summary,
          description: version.result.description,
          themeLabel: input.themeTitle,
          badgeText: version.result.badgeText,
          pageCount: input.pageCount,
          minPhotos: input.minPhotos,
          maxPhotos: input.maxPhotos,
          photoSuggestionText: version.result.photoSuggestionText,
          priceInCents: input.priceInCents,
          coverTone: version.result.coverTone,
          accentTone: version.result.accentTone,
          coverImage: version.result.coverImage,
          previewImages: version.result.previewImages,
          storyHighlights: version.result.storyHighlights,
          suitableScenes: version.result.suitableScenes,
          status: "draft",
          isFeatured: false,
          hasUnpublishedChanges: true,
          currentVersionId: version.id,
          publishedVersionId: null,
          versions: [version],
          createdAt: nowIso(),
          updatedAt: nowIso(),
          publishedAt: null
        };

        snapshot.templates.unshift(template);
        return this.toDetail(template, snapshot.works);
      })
    );
  }

  regenerateTemplate(templateId: string, payload: RegenerateTemplatePayload) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);
        const input = this.buildRegenerationInput(template, payload);
        const version = this.createVersionRecord(
          template.id,
          template.versions.length + 1,
          input,
          payload.changeNote?.trim() || "根据新的提示词重新生成"
        );

        template.name = input.name;
        template.slug = uniqueBySlug(
          slugify(input.name),
          snapshot.templates
            .filter((item) => item.id !== template.id)
            .map((item) => item.slug)
        );
        template.categoryCode = input.categoryCode;
        template.categoryName = this.getCategoryName(input.categoryCode);
        template.themeLabel = input.themeTitle;
        template.pageCount = input.pageCount;
        template.minPhotos = input.minPhotos;
        template.maxPhotos = input.maxPhotos;
        template.photoSuggestionText = version.result.photoSuggestionText;
        template.priceInCents = input.priceInCents;
        template.summary = version.result.summary;
        template.description = version.result.description;
        template.badgeText = version.result.badgeText;
        template.coverTone = version.result.coverTone;
        template.accentTone = version.result.accentTone;
        template.coverImage = version.result.coverImage;
        template.previewImages = version.result.previewImages;
        template.storyHighlights = version.result.storyHighlights;
        template.suitableScenes = version.result.suitableScenes;
        template.currentVersionId = version.id;
        template.hasUnpublishedChanges = true;
        template.updatedAt = nowIso();
        template.versions.unshift(version);

        return this.toDetail(template, snapshot.works);
      })
    );
  }

  getTemplatePreview(templateId: string, versionId?: string) {
    const snapshot = this.adminDataService.read();
    const template = this.findTemplateOrThrow(snapshot.templates, templateId);
    const version = this.findVersionOrThrow(template, versionId || template.currentVersionId);
    return successResponse(this.toPreviewPayload(template, version));
  }

  publishTemplate(templateId: string) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);

        if (!template.currentVersionId) {
          throw new BadRequestException({
            code: "TEMPLATE_PUBLISH_VERSION_MISSING",
            message: "请先生成模板版本，再执行上架"
          });
        }

        template.status = "published";
        template.publishedVersionId = template.currentVersionId;
        template.publishedAt = nowIso();
        template.updatedAt = nowIso();
        template.hasUnpublishedChanges = false;

        return this.toDetail(template, snapshot.works);
      })
    );
  }

  offlineTemplate(templateId: string) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);

        if (template.status !== "published") {
          throw new BadRequestException({
            code: "TEMPLATE_OFFLINE_STATUS_INVALID",
            message: "当前模板不在上架状态，无法执行下架"
          });
        }

        template.status = "offline";
        template.updatedAt = nowIso();
        return this.toDetail(template, snapshot.works);
      })
    );
  }

  featureTemplate(templateId: string) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);

        if (template.status !== "published" || !template.publishedVersionId) {
          throw new BadRequestException({
            code: "TEMPLATE_FEATURE_STATUS_INVALID",
            message: "只有已上架模板才能设为推荐"
          });
        }

        snapshot.templates.forEach((item) => {
          item.isFeatured = item.id === template.id;
        });

        template.updatedAt = nowIso();
        return this.toDetail(template, snapshot.works);
      })
    );
  }

  unfeatureTemplate(templateId: string) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);
        template.isFeatured = false;
        template.updatedAt = nowIso();
        return this.toDetail(template, snapshot.works);
      })
    );
  }

  deleteTemplate(templateId: string) {
    return successResponse(
      this.adminDataService.update((snapshot) => {
        const template = this.findTemplateOrThrow(snapshot.templates, templateId);
        const deleteRule = this.getDeleteRule(template, snapshot.works);

        if (!deleteRule.canDelete) {
          throw new BadRequestException({
            code: "TEMPLATE_DELETE_FORBIDDEN",
            message: deleteRule.deleteReason || "当前模板暂时不能删除"
          });
        }

        snapshot.templates = snapshot.templates.filter((item) => item.id !== template.id);

        return {
          deleted: true,
          templateId
        };
      })
    );
  }

  private normalizeCategoryCode(categoryCode?: string) {
    if (!categoryCode || categoryCode === "all") {
      return "all";
    }

    if (!["graduation", "growth", "classroom"].includes(categoryCode)) {
      throw new BadRequestException({
        code: "ADMIN_TEMPLATE_CATEGORY_INVALID",
        message: "模板分类不存在"
      });
    }

    return categoryCode as AdminTemplateCategoryCode;
  }

  private normalizeStatus(status?: string) {
    if (!status || status === "all") {
      return null;
    }

    if (!["draft", "published", "offline"].includes(status)) {
      throw new BadRequestException({
        code: "ADMIN_TEMPLATE_STATUS_INVALID",
        message: "模板状态不存在"
      });
    }

    return status as AdminTemplateRecord["status"];
  }

  private validateBasicPayload(payload: CreateTemplatePayload) {
    if (!payload.name?.trim()) {
      throw new BadRequestException({
        code: "TEMPLATE_NAME_REQUIRED",
        message: "请输入模板名称"
      });
    }

    if (!payload.themeLabel?.trim()) {
      throw new BadRequestException({
        code: "TEMPLATE_THEME_REQUIRED",
        message: "请输入主题词"
      });
    }

    if (!payload.summary?.trim() || !payload.description?.trim()) {
      throw new BadRequestException({
        code: "TEMPLATE_DESCRIPTION_REQUIRED",
        message: "请输入模板简介和说明"
      });
    }

    if (!payload.badgeText?.trim()) {
      throw new BadRequestException({
        code: "TEMPLATE_BADGE_REQUIRED",
        message: "请输入模板标签"
      });
    }

    if (!["graduation", "growth", "classroom"].includes(payload.categoryCode)) {
      throw new BadRequestException({
        code: "TEMPLATE_CATEGORY_REQUIRED",
        message: "请选择模板分类"
      });
    }

    if (payload.minPhotos <= 0 || payload.maxPhotos <= payload.minPhotos) {
      throw new BadRequestException({
        code: "TEMPLATE_PHOTO_RANGE_INVALID",
        message: "请设置正确的照片数量范围"
      });
    }

    if (![16, 20, 24, 28, 32].includes(payload.pageCount)) {
      throw new BadRequestException({
        code: "TEMPLATE_PAGE_COUNT_INVALID",
        message: "页数只支持 16 / 20 / 24 / 28 / 32 页"
      });
    }

    if (payload.priceInCents <= 0) {
      throw new BadRequestException({
        code: "TEMPLATE_PRICE_INVALID",
        message: "请输入正确的模板价格"
      });
    }

    return {
      name: payload.name.trim(),
      categoryCode: payload.categoryCode,
      themeLabel: payload.themeLabel.trim(),
      summary: payload.summary.trim(),
      description: payload.description.trim(),
      badgeText: payload.badgeText.trim(),
      pageCount: payload.pageCount,
      minPhotos: payload.minPhotos,
      maxPhotos: payload.maxPhotos,
      priceInCents: payload.priceInCents
    };
  }

  private validateUpdatePayload(
    template: AdminTemplateRecord,
    payload: UpdateTemplatePayload
  ): CreateTemplatePayload {
    return this.validateBasicPayload({
      name: payload.name || template.name,
      categoryCode: payload.categoryCode || template.categoryCode,
      themeLabel: payload.themeLabel || template.themeLabel,
      summary: payload.summary || template.summary,
      description: payload.description || template.description,
      badgeText: payload.badgeText || template.badgeText,
      pageCount: payload.pageCount || template.pageCount,
      minPhotos: payload.minPhotos || template.minPhotos,
      maxPhotos: payload.maxPhotos || template.maxPhotos,
      priceInCents: payload.priceInCents || template.priceInCents
    });
  }

  private validateGenerationInput(payload: GenerateTemplatePayload): TemplateGenerateInput {
    const base = this.validateBasicPayload({
      name: payload.name,
      categoryCode: payload.categoryCode,
      themeLabel: payload.themeTitle,
      summary: "生成中",
      description: "生成中",
      badgeText: "生成中",
      pageCount: payload.pageCount,
      minPhotos: payload.minPhotos,
      maxPhotos: payload.maxPhotos,
      priceInCents: payload.priceInCents
    });

    if (!payload.promptText?.trim()) {
      throw new BadRequestException({
        code: "TEMPLATE_PROMPT_REQUIRED",
        message: "请输入生成模板用的提示词"
      });
    }

    return {
      name: base.name,
      themeTitle: payload.themeTitle.trim(),
      categoryCode: base.categoryCode,
      pageCount: base.pageCount,
      minPhotos: base.minPhotos,
      maxPhotos: base.maxPhotos,
      priceInCents: base.priceInCents,
      promptText: payload.promptText.trim()
    };
  }

  private buildRegenerationInput(
    template: AdminTemplateRecord,
    payload: RegenerateTemplatePayload
  ): TemplateGenerateInput {
    return this.validateGenerationInput({
      name: payload.name || template.name,
      themeTitle: payload.themeTitle || template.themeLabel,
      categoryCode: payload.categoryCode || template.categoryCode,
      pageCount: payload.pageCount || template.pageCount,
      minPhotos: payload.minPhotos || template.minPhotos,
      maxPhotos: payload.maxPhotos || template.maxPhotos,
      priceInCents: payload.priceInCents || template.priceInCents,
      promptText: payload.promptText
    });
  }

  private createVersionRecord(
    templateId: string,
    versionNo: number,
    input: TemplateGenerateInput,
    changeNote: string
  ): AdminTemplateVersionRecord {
    const result = buildTemplateGeneratedResult(
      input,
      previewImageCatalog[input.categoryCode]
    );

    return {
      id: `${templateId}-v${versionNo}`,
      versionNo,
      createdAt: nowIso(),
      promptText: input.promptText,
      changeNote,
      input,
      result
    };
  }

  private findTemplateOrThrow(templates: AdminTemplateRecord[], templateId: string) {
    const template = templates.find(
      (item) => item.id === templateId || item.slug === templateId
    );

    if (!template) {
      throw new NotFoundException({
        code: "ADMIN_TEMPLATE_NOT_FOUND",
        message: "模板不存在"
      });
    }

    return template;
  }

  private findVersionOrThrow(
    template: AdminTemplateRecord,
    versionId: string | null | undefined
  ) {
    if (!versionId) {
      throw new BadRequestException({
        code: "TEMPLATE_VERSION_MISSING",
        message: "当前模板还没有可预览版本"
      });
    }

    const version = template.versions.find((item) => item.id === versionId);

    if (!version) {
      throw new NotFoundException({
        code: "TEMPLATE_VERSION_NOT_FOUND",
        message: "模板版本不存在"
      });
    }

    return version;
  }

  private getCategoryName(categoryCode: AdminTemplateCategoryCode) {
    return templateCategoryMeta.find((item) => item.code === categoryCode)?.name || "未分类";
  }

  private getRelatedWorkCount(templateId: string, works: Array<{ templateId: string }>) {
    return works.filter((item) => item.templateId === templateId).length;
  }

  private getDeleteRule(
    template: AdminTemplateRecord,
    works: Array<{ templateId: string }>
  ) {
    const relatedWorkCount = this.getRelatedWorkCount(template.id, works);

    if (template.isFeatured) {
      return {
        canDelete: false,
        deleteReason: "模板当前是推荐模板，请先取消推荐再删除"
      };
    }

    if (template.status === "published") {
      return {
        canDelete: false,
        deleteReason: "模板已上架，请先下架再删除"
      };
    }

    if (relatedWorkCount > 0) {
      return {
        canDelete: false,
        deleteReason: "模板已经被用户作品引用，当前不允许删除"
      };
    }

    return {
      canDelete: true,
      deleteReason: null
    };
  }

  private toPreviewPayload(
    template: AdminTemplateRecord,
    version: AdminTemplateVersionRecord
  ): AdminTemplatePreviewPayload {
    return {
      templateId: template.id,
      templateName: template.name,
      versionId: version.id,
      versionNo: version.versionNo,
      promptText: version.promptText,
      changeNote: version.changeNote,
      createdAt: version.createdAt,
      result: version.result,
      isCurrent: template.currentVersionId === version.id,
      isPublished: template.publishedVersionId === version.id
    };
  }

  private toListItem(
    template: AdminTemplateRecord,
    works: Array<{ templateId: string }>
  ): AdminTemplateListItem {
    return {
      id: template.id,
      slug: template.slug,
      name: template.name,
      categoryCode: template.categoryCode,
      categoryName: template.categoryName,
      status: template.status,
      statusText: statusText(template.status),
      isFeatured: template.isFeatured,
      hasUnpublishedChanges: template.hasUnpublishedChanges,
      summary: template.summary,
      themeLabel: template.themeLabel,
      pageCount: template.pageCount,
      minPhotos: template.minPhotos,
      maxPhotos: template.maxPhotos,
      priceInCents: template.priceInCents,
      priceText: formatPrice(template.priceInCents),
      coverImage: template.coverImage,
      updatedAt: template.updatedAt,
      versionCount: template.versions.length,
      currentVersionNo: currentVersionNo(template),
      publishedVersionNo: publishedVersionNo(template),
      relatedWorkCount: this.getRelatedWorkCount(template.id, works)
    };
  }

  private toDetail(
    template: AdminTemplateRecord,
    works: Array<{ templateId: string }>
  ): AdminTemplateDetail {
    const currentVersion = template.currentVersionId
      ? this.toPreviewPayload(
          template,
          this.findVersionOrThrow(template, template.currentVersionId)
        )
      : null;
    const publishedVersion = template.publishedVersionId
      ? this.toPreviewPayload(
          template,
          this.findVersionOrThrow(template, template.publishedVersionId)
        )
      : null;
    const deleteRule = this.getDeleteRule(template, works);

    return {
      ...template,
      priceText: formatPrice(template.priceInCents),
      relatedWorkCount: this.getRelatedWorkCount(template.id, works),
      versions: template.versions.map((version) => ({
        id: version.id,
        versionNo: version.versionNo,
        createdAt: version.createdAt,
        promptText: version.promptText,
        changeNote: version.changeNote,
        isCurrent: template.currentVersionId === version.id,
        isPublished: template.publishedVersionId === version.id
      })),
      currentVersion,
      publishedVersion,
      rules: {
        canPublish: Boolean(template.currentVersionId),
        canFeature: template.status === "published" && Boolean(template.publishedVersionId),
        canDelete: deleteRule.canDelete,
        deleteReason: deleteRule.deleteReason
      }
    };
  }
}
