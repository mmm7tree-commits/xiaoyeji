import * as path from "node:path";
import { createRequire } from "node:module";

export interface LegacyTemplateRuntimeMeta {
  id: string;
  slug: string;
  formatLabel?: string;
  bookFormat?: "square" | "portrait" | "landscape";
  pageAspectRatio?: number;
  styleFamily?: string;
  styleLabel?: string;
  orderMinPhotos?: number;
  layoutLabel?: string;
  openingLayout?: string;
  closingLayout?: string;
  middleLayoutSequence?: string[];
  layoutCapacityOverrides?: Record<string, number>;
}

interface LegacyTemplateModule {
  templates?: LegacyTemplateRuntimeMeta[];
}

const requireFromRuntime = createRequire(__filename);
const workspaceRoot = path.resolve(__dirname, "../../../../");

function loadLegacyTemplateMeta() {
  const candidatePaths = [
    path.resolve(workspaceRoot, "data/templates.js"),
    path.resolve(process.cwd(), "data/templates.js")
  ];

  for (let index = 0; index < candidatePaths.length; index += 1) {
    const candidate = candidatePaths[index];
    try {
      const runtimeModule = requireFromRuntime(candidate) as LegacyTemplateModule;
      if (Array.isArray(runtimeModule.templates)) {
        return runtimeModule.templates;
      }
    } catch {
      // Continue to the next candidate path.
    }
  }

  try {
    // Reuse the existing demo template runtime metadata as the current public fallback source.
    // This keeps M8 aligned with the existing rule-driven preview behavior without introducing
    // a heavier shared package before it is truly needed.
    const runtimeModule = requireFromRuntime(path.resolve(workspaceRoot, "data/templates.js")) as LegacyTemplateModule;
    return Array.isArray(runtimeModule.templates) ? runtimeModule.templates : [];
  } catch {
    return [];
  }
}

const legacyTemplateMeta = loadLegacyTemplateMeta();

export function getLegacyTemplateRuntimeMeta(idOrSlug: string) {
  return legacyTemplateMeta.find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
}
