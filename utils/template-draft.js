const STORAGE_PREFIX = "xiaoyeji_template_draft_";

function createEmptyDraft(templateId) {
  return {
    templateId,
    coverTitle: "",
    babyInfo: "",
    coverPhrase: "",
    photos: [],
    templateSnapshot: null,
    updatedAt: 0
  };
}

function getStorageKey(templateId) {
  return `${STORAGE_PREFIX}${templateId}`;
}

function getDraft(templateId) {
  const draft = wx.getStorageSync(getStorageKey(templateId));
  if (!draft || typeof draft !== "object") {
    return createEmptyDraft(templateId);
  }

  return Object.assign(createEmptyDraft(templateId), draft, {
    photos: Array.isArray(draft.photos) ? draft.photos : [],
    templateSnapshot: draft.templateSnapshot && typeof draft.templateSnapshot === "object" ? draft.templateSnapshot : null
  });
}

function saveDraft(templateId, draft) {
  const nextDraft = Object.assign(createEmptyDraft(templateId), draft, {
    templateId,
    photos: Array.isArray(draft.photos) ? draft.photos : [],
    templateSnapshot: draft.templateSnapshot && typeof draft.templateSnapshot === "object" ? draft.templateSnapshot : null,
    updatedAt: Date.now()
  });
  wx.setStorageSync(getStorageKey(templateId), nextDraft);
  return nextDraft;
}

function patchDraft(templateId, partialDraft) {
  const currentDraft = getDraft(templateId);
  return saveDraft(templateId, Object.assign({}, currentDraft, partialDraft));
}

module.exports = {
  createEmptyDraft,
  getDraft,
  saveDraft,
  patchDraft
};
