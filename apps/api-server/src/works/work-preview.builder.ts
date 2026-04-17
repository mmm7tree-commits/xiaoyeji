import { createRequire } from "node:module";
import * as path from "node:path";
import { TemplateDetail } from "../templates/templates.types";
import {
  FrozenTemplateSnapshot,
  WorkDraftPayload,
  WorkPreviewData
} from "./works.types";

type TemplateRuntimeModule = {
  toTemplateSnapshot: (template: TemplateDetail) => FrozenTemplateSnapshot;
};

type TemplatePreviewModule = {
  buildPreviewData: (draft: {
    templateId: string;
    coverTitle: string;
    babyInfo: string;
    coverPhrase: string;
    photos: WorkDraftPayload["photos"];
    templateSnapshot: FrozenTemplateSnapshot;
  }) => WorkPreviewData;
};

const localRequire = createRequire(__filename);
const workspaceRoot = path.resolve(__dirname, "../../../../");

// Reuse the existing rule-driven preview builder so legacy miniapp and api-server
// freeze the same preview structure during the transition period.
const templateRuntime = localRequire(path.resolve(
  workspaceRoot,
  "utils/template-runtime.js"
)) as TemplateRuntimeModule;
const templatePreview = localRequire(path.resolve(
  workspaceRoot,
  "utils/template-preview.js"
)) as TemplatePreviewModule;

export function buildFrozenTemplateSnapshot(template: TemplateDetail) {
  return templateRuntime.toTemplateSnapshot(template);
}

export function buildFrozenPreviewData(
  template: TemplateDetail,
  draft: WorkDraftPayload,
  templateSnapshot: FrozenTemplateSnapshot
) {
  return templatePreview.buildPreviewData({
    templateId: template.id,
    coverTitle: draft.coverTitle,
    babyInfo: draft.babyInfo,
    coverPhrase: draft.coverPhrase,
    photos: Array.isArray(draft.photos) ? draft.photos : [],
    templateSnapshot
  });
}
