import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AdminDataService } from "../admin-data/admin-data.service";
import {
  AdminTemplateRecord,
  AdminTemplateVersionRecord
} from "../admin-data/admin-data.types";
import { successResponse } from "../common/interfaces/api-response.interface";
import {
  FeaturedTemplateDetail,
  TemplateCategoryCode,
  TemplateCategoryItem,
  TemplateDetail,
  TemplateListItem,
  TemplatePreviewModel,
  TemplateSourceMode,
  TemplateSeed
} from "./templates.types";
import { templateSeeds } from "./templates.seed";
import { getLegacyTemplateRuntimeMeta } from "./legacy-template-runtime";

const categoryMeta: Array<{
  code: TemplateCategoryCode;
  name: string;
  description: string;
}> = [
  {
    code: "all",
    name: "全部模板",
    description: "先看看全部可选风格，再挑一套最适合孩子的纪念册。"
  },
  {
    code: "graduation",
    name: "毕业纪念",
    description: "适合毕业典礼、老师寄语和班级大合照。"
  },
  {
    code: "growth",
    name: "成长记录",
    description: "适合日常成长、校园生活和轻松一点的回忆。"
  },
  {
    code: "classroom",
    name: "班级活动",
    description: "适合班级活动、春游故事和热闹一点的集体回忆。"
  }
];

@Injectable()
export class TemplatesService {
  private readonly featuredTemplateId = process.env.TEMPLATE_FEATURED_ID || "summer-square";

  constructor(private readonly adminDataService: AdminDataService) {}

  getFeaturedTemplate() {
    const source = this.getPublicTemplateSource();
    const featuredItem =
      source.mode === "admin_published"
        ? source.items.find((item) => item.isFeatured) || source.items[0]
        : this.findTemplate(this.featuredTemplateId) || source.items.find((item) => item.isFeatured) || source.items[0];

    if (!featuredItem) {
      throw new NotFoundException({
        code: "TEMPLATE_NOT_FOUND",
        message: "暂时没有可展示的模板"
      });
    }

    if (source.mode === "admin_published") {
      const featuredTemplateRecord =
        source.items.find((item) => item.isFeatured) || source.items[0];
      if (!featuredTemplateRecord) {
        throw new NotFoundException({
          code: "TEMPLATE_NOT_FOUND",
          message: "暂时没有可展示的模板"
        });
      }
      const featuredTemplate = this.toFeaturedFromAdmin(featuredTemplateRecord, source.mode);
      return successResponse<FeaturedTemplateDetail>(featuredTemplate);
    }

    const featuredSeed = featuredItem as TemplateSeed;
    return successResponse<FeaturedTemplateDetail>(this.toFeaturedFromSeed(featuredSeed));
  }

  getTemplateCategories() {
    const source = this.getPublicTemplateSource();
    const categories = categoryMeta.map((category) => {
      const templateCount = source.mode === "admin_published"
        ? this.countTemplatesByCategory(source.items, category.code)
        : this.countTemplateSeedsByCategory(source.items, category.code);

      if (category.code === "all") {
        return {
          code: category.code,
          name: category.name,
          description: category.description,
          templateCount,
          isDefault: true
        };
      }

      return {
        code: category.code,
        name: category.name,
        description: category.description,
        templateCount,
        isDefault: false
      };
    });

    return successResponse<TemplateCategoryItem[]>(categories);
  }

  getTemplateList(categoryCode: string | undefined) {
    const safeCategoryCode = this.normalizeCategoryCode(categoryCode);
    const source = this.getPublicTemplateSource();

    if (source.mode === "admin_published") {
      const items = source.items
        .filter((item) => {
          if (safeCategoryCode === "all") {
            return true;
          }
          return item.categoryCode === safeCategoryCode;
        })
        .map((item) => this.toListItemFromAdmin(item, source.mode));
      return successResponse(items);
    }

    const items = source.items
      .filter((item) => {
        if (safeCategoryCode === "all") {
          return true;
        }
        return item.categoryCode === safeCategoryCode;
      })
      .map((item) => this.toListItemFromSeed(item));

    return successResponse(items);
  }

  getTemplateDetail(id: string) {
    return successResponse(this.getTemplateDetailData(id));
  }

  getTemplateDetailData(id: string) {
    const source = this.getPublicTemplateSource();

    if (source.mode === "admin_published") {
      const template =
        source.items.find((item) => item.id === id || item.slug === id) || null;

      if (!template) {
        throw new NotFoundException({
          code: "TEMPLATE_NOT_FOUND",
          message: "模板不存在或已下线"
        });
      }

      return this.toDetailFromAdmin(template, source.mode);
    }

    const seed = this.findTemplate(id);
    if (!seed) {
      throw new NotFoundException({
        code: "TEMPLATE_NOT_FOUND",
        message: "模板不存在或已下线"
      });
    }

    return this.toDetailFromSeed(seed);
  }

  private normalizeCategoryCode(categoryCode?: string): TemplateCategoryCode {
    if (!categoryCode || categoryCode === "all") {
      return "all";
    }

    const matched = categoryMeta.find((item) => item.code === categoryCode);

    if (!matched) {
      throw new BadRequestException({
        code: "TEMPLATE_CATEGORY_INVALID",
        message: "模板分类不存在"
      });
    }

    return matched.code;
  }

  private findTemplate(idOrSlug: string) {
    return templateSeeds.find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
  }

  private getPublicTemplateSource():
    | { mode: "admin_published"; items: AdminTemplateRecord[] }
    | { mode: "seed_fallback"; items: TemplateSeed[] } {
    const snapshot = this.adminDataService.read();
    const publishedTemplates = snapshot.templates.filter((item) => {
      return item.status === "published" && Boolean(item.publishedVersionId);
    });

    if (publishedTemplates.length) {
      return {
        mode: "admin_published",
        items: publishedTemplates
      };
    }

    return {
      mode: "seed_fallback",
      items: templateSeeds
    };
  }

  private countTemplatesByCategory(templates: AdminTemplateRecord[], categoryCode: TemplateCategoryCode) {
    if (categoryCode === "all") {
      return templates.length;
    }
    return templates.filter((item) => item.categoryCode === categoryCode).length;
  }

  private countTemplateSeedsByCategory(items: TemplateSeed[], categoryCode: TemplateCategoryCode) {
    if (categoryCode === "all") {
      return items.length;
    }
    return items.filter((item) => item.categoryCode === categoryCode).length;
  }

  private findPublishedVersion(template: AdminTemplateRecord) {
    if (!template.publishedVersionId) {
      return null;
    }
    return template.versions.find((item) => item.id === template.publishedVersionId) || null;
  }

  private resolveRuntimeMeta(templateId: string, fallbackMinPhotos: number) {
    const runtimeMeta = getLegacyTemplateRuntimeMeta(templateId);
    const safeMinPhotos = Math.max(1, fallbackMinPhotos || 1);
    return {
      layoutLabel: runtimeMeta?.layoutLabel || "自动排版",
      formatLabel: runtimeMeta?.formatLabel || "方版",
      bookFormat: runtimeMeta?.bookFormat || "square",
      pageAspectRatio: runtimeMeta?.pageAspectRatio || 1,
      styleFamily: runtimeMeta?.styleFamily || "clean",
      styleLabel: runtimeMeta?.styleLabel || "清新风格",
      orderMinPhotos: runtimeMeta?.orderMinPhotos || Math.max(1, Math.ceil(safeMinPhotos * 0.75)),
      openingLayout: runtimeMeta?.openingLayout || "hero",
      closingLayout: runtimeMeta?.closingLayout || "letter",
      middleLayoutSequence: Array.isArray(runtimeMeta?.middleLayoutSequence) ? runtimeMeta.middleLayoutSequence : [],
      layoutCapacityOverrides: runtimeMeta?.layoutCapacityOverrides || {}
    };
  }

  private buildPreviewModelFromAdminVersion(version: AdminTemplateVersionRecord): TemplatePreviewModel {
    return {
      coverTitle: version.result.coverTitle,
      coverPhrase: version.result.coverPhrase,
      moodLabel: version.result.moodLabel,
      sceneKeywords: version.result.sceneKeywords,
      sectionPlan: version.result.sectionPlan,
      pageBlueprints: version.result.pageBlueprints.map((page) => ({
        pageNo: page.pageNo,
        section: page.section,
        layoutType: page.layoutType,
        title: page.title,
        caption: page.caption,
        decorativeElements: page.decorativeElements
      })),
      previewFrames: version.result.previewFrames.map((frame) => ({
        pageNo: frame.pageNo,
        section: frame.section,
        layoutType: frame.layoutType,
        title: frame.title,
        image: frame.image,
        caption: frame.caption
      }))
    };
  }

  private buildPreviewModelFromSeed(seed: TemplateSeed): TemplatePreviewModel {
    return {
      coverTitle: seed.name,
      coverPhrase: seed.summary,
      moodLabel: seed.themeLabel,
      sceneKeywords: seed.suitableScenes.slice(0, 3),
      sectionPlan: [seed.categoryName, seed.themeLabel, seed.summary],
      pageBlueprints: [],
      previewFrames: seed.previewImages.map((image, index) => ({
        pageNo: index + 1,
        section: index === 0 ? "cover" : "content",
        layoutType: index === 0 ? "cover" : "mosaic",
        title: index === 0 ? seed.name : seed.storyHighlights[index - 1] || seed.themeLabel,
        image,
        caption: index === 0 ? seed.summary : seed.description
      }))
    };
  }

  private toListItemFromAdmin(template: AdminTemplateRecord, sourceMode: TemplateSourceMode): TemplateListItem {
    const runtimeMeta = this.resolveRuntimeMeta(template.id, template.minPhotos);
    return {
      id: template.id,
      slug: template.slug,
      name: template.name,
      categoryCode: template.categoryCode,
      categoryName: template.categoryName,
      summary: template.summary,
      description: template.description,
      themeLabel: template.themeLabel,
      badgeText: template.badgeText,
      photoSuggestionText: template.photoSuggestionText,
      pageCount: template.pageCount,
      minPhotos: template.minPhotos,
      suggestedMinPhotos: template.minPhotos,
      orderMinPhotos: runtimeMeta.orderMinPhotos,
      maxPhotos: template.maxPhotos,
      priceInCents: template.priceInCents,
      priceText: this.formatPrice(template.priceInCents),
      coverTone: template.coverTone,
      accentTone: template.accentTone,
      coverImage: template.coverImage,
      isFeatured: template.isFeatured,
      isPublished: template.status === "published",
      sourceMode,
      templateVersionId: template.publishedVersionId,
      templateVersionNo: this.findPublishedVersion(template)?.versionNo || null
    };
  }

  private toListItemFromSeed(seed: TemplateSeed): TemplateListItem {
    const runtimeMeta = this.resolveRuntimeMeta(seed.id, seed.minPhotos);
    return {
      id: seed.id,
      slug: seed.slug,
      name: seed.name,
      categoryCode: seed.categoryCode,
      categoryName: seed.categoryName,
      summary: seed.summary,
      description: seed.description,
      themeLabel: seed.themeLabel,
      badgeText: seed.badgeText,
      photoSuggestionText: seed.photoSuggestionText,
      pageCount: seed.pageCount,
      minPhotos: seed.minPhotos,
      suggestedMinPhotos: seed.minPhotos,
      orderMinPhotos: runtimeMeta.orderMinPhotos,
      maxPhotos: Math.max(seed.pageCount * 2, seed.minPhotos),
      priceInCents: seed.priceInCents,
      priceText: this.formatPrice(seed.priceInCents),
      coverTone: seed.coverTone,
      accentTone: seed.accentTone,
      coverImage: seed.coverImage,
      isFeatured: seed.id === this.featuredTemplateId || Boolean(seed.isFeatured),
      isPublished: true,
      sourceMode: "seed_fallback",
      templateVersionId: null,
      templateVersionNo: null
    };
  }

  private toFeaturedFromAdmin(template: AdminTemplateRecord, sourceMode: TemplateSourceMode): FeaturedTemplateDetail {
    const version = this.findPublishedVersion(template);
    const previewImages = version ? version.result.previewFrames.map((frame) => frame.image) : template.previewImages;
    return {
      ...this.toListItemFromAdmin(template, sourceMode),
      featureTitle: "推荐模板",
      featureDescription: template.summary,
      storyHighlights: template.storyHighlights,
      previewImages
    };
  }

  private toFeaturedFromSeed(seed: TemplateSeed): FeaturedTemplateDetail {
    return {
      ...this.toListItemFromSeed(seed),
      featureTitle: "推荐模板",
      featureDescription: seed.summary,
      storyHighlights: seed.storyHighlights,
      previewImages: seed.previewImages
    };
  }

  private toDetailFromAdmin(template: AdminTemplateRecord, sourceMode: TemplateSourceMode): TemplateDetail {
    const version = this.findPublishedVersion(template);
    if (!version) {
      throw new NotFoundException({
        code: "TEMPLATE_NOT_FOUND",
        message: "模板不存在或已下线"
      });
    }
    const runtimeMeta = this.resolveRuntimeMeta(template.id, template.minPhotos);
    const previewModel = this.buildPreviewModelFromAdminVersion(version);
    return {
      ...this.toListItemFromAdmin(template, sourceMode),
      storyHighlights: template.storyHighlights,
      suitableScenes: template.suitableScenes,
      previewImages: previewModel.previewFrames.map((frame) => frame.image),
      templateVersion: {
        id: version.id,
        versionNo: version.versionNo,
        createdAt: version.createdAt,
        sourceMode
      },
      consumptionConfig: {
        layoutLabel: runtimeMeta.layoutLabel,
        formatLabel: runtimeMeta.formatLabel,
        bookFormat: runtimeMeta.bookFormat,
        pageAspectRatio: runtimeMeta.pageAspectRatio,
        styleFamily: runtimeMeta.styleFamily,
        styleLabel: runtimeMeta.styleLabel,
        suggestedMinPhotos: template.minPhotos,
        orderMinPhotos: runtimeMeta.orderMinPhotos,
        maxPhotos: template.maxPhotos,
        openingLayout: runtimeMeta.openingLayout,
        closingLayout: runtimeMeta.closingLayout,
        middleLayoutSequence: runtimeMeta.middleLayoutSequence,
        layoutCapacityOverrides: runtimeMeta.layoutCapacityOverrides
      },
      previewModel
    };
  }

  private toDetailFromSeed(seed: TemplateSeed): TemplateDetail {
    const runtimeMeta = this.resolveRuntimeMeta(seed.id, seed.minPhotos);
    const previewModel = this.buildPreviewModelFromSeed(seed);
    return {
      ...this.toListItemFromSeed(seed),
      storyHighlights: seed.storyHighlights,
      suitableScenes: seed.suitableScenes,
      previewImages: seed.previewImages,
      templateVersion: {
        id: null,
        versionNo: null,
        createdAt: null,
        sourceMode: "seed_fallback"
      },
      consumptionConfig: {
        layoutLabel: runtimeMeta.layoutLabel,
        formatLabel: runtimeMeta.formatLabel,
        bookFormat: runtimeMeta.bookFormat,
        pageAspectRatio: runtimeMeta.pageAspectRatio,
        styleFamily: runtimeMeta.styleFamily,
        styleLabel: runtimeMeta.styleLabel,
        suggestedMinPhotos: seed.minPhotos,
        orderMinPhotos: runtimeMeta.orderMinPhotos,
        maxPhotos: Math.max(seed.pageCount * 2, seed.minPhotos),
        openingLayout: runtimeMeta.openingLayout,
        closingLayout: runtimeMeta.closingLayout,
        middleLayoutSequence: runtimeMeta.middleLayoutSequence,
        layoutCapacityOverrides: runtimeMeta.layoutCapacityOverrides
      },
      previewModel
    };
  }

  private formatPrice(priceInCents: number) {
    return `¥${(priceInCents / 100).toFixed(0)}`;
  }
}
