import {
  AdminStoreSnapshot,
  AdminTemplateRecord,
  AdminTemplateVersionRecord,
  AdminWorkRecord,
  TemplateGenerateInput
} from "./admin-data.types";
import { templateSeeds } from "../templates/templates.seed";
import { buildTemplateGeneratedResult } from "../admin-templates/template-generator";

function toIso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function parseMaxPhotos(text: string, pageCount: number) {
  const matched = text.match(/(\d+)\s*-\s*(\d+)/);

  if (matched) {
    return Number(matched[2]);
  }

  return Math.max(pageCount * 2, 24);
}

function createVersion(
  templateId: string,
  versionNo: number,
  input: TemplateGenerateInput,
  imagePool: string[],
  createdAt: string
): AdminTemplateVersionRecord {
  const result = buildTemplateGeneratedResult(input, imagePool);

  return {
    id: `${templateId}-v${versionNo}`,
    versionNo,
    createdAt,
    promptText: input.promptText,
    changeNote: versionNo === 1 ? "初始模板版本" : "调整提示词后重新生成",
    input,
    result
  };
}

function createTemplateRecord(seed: (typeof templateSeeds)[number], index: number): AdminTemplateRecord {
  const createdAt = toIso(Date.now() - (index + 7) * 24 * 60 * 60 * 1000);
  const input: TemplateGenerateInput = {
    name: seed.name,
    themeTitle: seed.themeLabel,
    categoryCode: seed.categoryCode,
    pageCount: seed.pageCount,
    minPhotos: seed.minPhotos,
    maxPhotos: parseMaxPhotos(seed.photoSuggestionText, seed.pageCount),
    priceInCents: seed.priceInCents,
    promptText: seed.description
  };
  const version = createVersion(seed.id, 1, input, seed.previewImages, createdAt);

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
    pageCount: seed.pageCount,
    minPhotos: seed.minPhotos,
    maxPhotos: input.maxPhotos,
    photoSuggestionText: seed.photoSuggestionText,
    priceInCents: seed.priceInCents,
    coverTone: seed.coverTone,
    accentTone: seed.accentTone,
    coverImage: seed.coverImage,
    previewImages: seed.previewImages,
    storyHighlights: seed.storyHighlights,
    suitableScenes: seed.suitableScenes,
    status: "published",
    isFeatured: Boolean(seed.isFeatured),
    hasUnpublishedChanges: false,
    currentVersionId: version.id,
    publishedVersionId: version.id,
    versions: [version],
    createdAt,
    updatedAt: createdAt,
    publishedAt: createdAt
  };
}

function createWorkRecord(
  template: AdminTemplateRecord,
  workId: string,
  title: string,
  status: AdminWorkRecord["status"],
  owner: string,
  kindergartenInfo: string,
  childName: string,
  daysAgo: number
): AdminWorkRecord {
  const now = Date.now();
  const previewFrames = template.versions[0]?.result.previewFrames.slice(0, 4) || [];

  return {
    id: workId,
    title,
    templateId: template.id,
    templateName: template.name,
    templateCategoryCode: template.categoryCode,
    parentName: owner,
    kindergartenInfo,
    childName,
    status,
    photoCount: template.minPhotos + 4,
    pageCount: template.pageCount,
    previewPageCount: previewFrames.length,
    coverImage: template.coverImage,
    previewSummary:
      status === "ordered"
        ? "已成册作品，当前只开放回看入口"
        : "当前作品还在用户侧编辑与确认阶段",
    coverTitle: title,
    babyInfo: kindergartenInfo,
    coverPhrase: template.versions[0]?.result.coverPhrase || "把幼儿园的笑脸留在这里",
    previewFrames,
    createdAt: toIso(now - (daysAgo + 1) * 24 * 60 * 60 * 1000),
    updatedAt: toIso(now - daysAgo * 24 * 60 * 60 * 1000)
  };
}

export function createInitialAdminData(): AdminStoreSnapshot {
  const templates = templateSeeds.map(createTemplateRecord);

  return {
    templates,
    works: [
      createWorkRecord(
        templates[0],
        "work-admin-001",
        "小一班毕业啦",
        "ready",
        "王妈妈",
        "向日葵幼儿园 · 小一班",
        "小安",
        1
      ),
      createWorkRecord(
        templates[1],
        "work-admin-002",
        "把老师的话也留下来",
        "ordered",
        "李爸爸",
        "向日葵幼儿园 · 小二班",
        "乐乐",
        2
      ),
      createWorkRecord(
        templates[2],
        "work-admin-003",
        "春游那天真的好开心",
        "draft",
        "陈妈妈",
        "晨风幼儿园 · 中一班",
        "米米",
        3
      ),
      createWorkRecord(
        templates[3],
        "work-admin-004",
        "全班的笑脸都留住",
        "ready",
        "赵爸爸",
        "向日葵幼儿园 · 大二班",
        "豆豆",
        4
      )
    ]
  };
}
