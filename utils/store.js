const { templates } = require("../data/templates");
const templateDraft = require("./template-draft");
const templatePreview = require("./template-preview");
const templateRuntime = require("./template-runtime");

const STORAGE_KEYS = {
  profile: "xiaoyeji_profile",
  works: "xiaoyeji_works",
  orders: "xiaoyeji_orders",
  addresses: "xiaoyeji_addresses"
};

const WORK_STATUS = {
  draft: {
    code: "draft",
    label: "继续补充"
  },
  ready: {
    code: "ready",
    label: "待下单"
  }
};

const ORDER_STATUS = {
  pendingPayment: {
    code: "pending_payment",
    label: "待支付",
    hint: "支付能力将在后续里程碑接入，当前先保留订单记录和待支付状态。"
  },
  pendingShipment: {
    code: "pending_shipment",
    label: "待发货",
    hint: "这个状态先作为支付完成后的占位状态，后续会接入真实支付与履约。"
  },
  closed: {
    code: "closed",
    label: "已关闭",
    hint: "当前先作为取消或超时关闭的占位状态。"
  }
};

const DEFAULT_LAYOUTS = ["cover", "hero", "duo", "mosaic", "letter"];

const LAYOUT_CAPACITY = {
  cover: 1,
  hero: 1,
  single: 1,
  duo: 2,
  mosaic: 4,
  grid: 6,
  timeline: 3,
  quote: 1,
  letter: 1
};

const LAYOUT_COPY = {
  cover: {
    title: "小小纪念册",
    subtitle: "这一页从最喜欢的笑脸开始",
    caption: "小页记"
  },
  hero: {
    title: "最想记住的笑脸",
    subtitle: "留一张大图给今天的开心",
    caption: "今日主角"
  },
  single: {
    title: "今天的主角",
    subtitle: "把一张照片认真放大",
    caption: "慢慢长大"
  },
  duo: {
    title: "一起长大的日子",
    subtitle: "把笑声、奔跑和拥抱留在这一页",
    caption: "好朋友"
  },
  mosaic: {
    title: "闪亮的日常",
    subtitle: "多张照片自动组合，保留更多小瞬间",
    caption: "成长碎片"
  },
  grid: {
    title: "班级小合辑",
    subtitle: "适合活动照、合影和连续抓拍",
    caption: "快乐集合"
  },
  timeline: {
    title: "成长小片段",
    subtitle: "按上传顺序串起一组温柔记忆",
    caption: "一步一步"
  },
  quote: {
    title: "留一句喜欢的话",
    subtitle: "给照片留出呼吸感，也留给孩子一句祝福",
    caption: "愿你每天都有新发现"
  },
  letter: {
    title: "写给未来的你",
    subtitle: "愿你翻到这里，还记得这个像橘子汽水一样的夏天。",
    caption: "亲爱的宝贝，愿你带着今天的光，去遇见更多好奇和快乐。"
  }
};

const LAYOUT_BACKGROUNDS = {
  hero: "linear-gradient(135deg, #F7FAF8, #E8F7F0)",
  single: "linear-gradient(135deg, #FFF8E9, #EAF7F1)",
  duo: "linear-gradient(135deg, #F5F6F5, #E8F7F0)",
  mosaic: "linear-gradient(135deg, #F7FAF8, #E5F4F6)",
  grid: "linear-gradient(135deg, #EEF8F1, #F7F3E5)",
  timeline: "linear-gradient(135deg, #F8FAF7, #EAF4FF)",
  quote: "linear-gradient(135deg, #FFFFFF, #F5F1E8)",
  letter: "linear-gradient(135deg, #FFFFFF, #F1F3F6)"
};

const OPENING_LAYOUT_ORDER = ["hero", "single", "timeline", "duo", "mosaic", "grid", "quote", "letter"];
const CLOSING_LAYOUT_ORDER = ["letter", "quote", "timeline", "mosaic", "duo", "single", "hero", "grid"];
const FORMAT_LAYOUT_CAPACITY = {
  portrait: {
    mosaic: 2,
    grid: 4,
    timeline: 2
  },
  landscape: {
    grid: 4,
    timeline: 2
  }
};

function ensureSeedData() {
  if (!wx.getStorageSync(STORAGE_KEYS.works)) {
    wx.setStorageSync(STORAGE_KEYS.works, []);
  }
  if (!wx.getStorageSync(STORAGE_KEYS.orders)) {
    wx.setStorageSync(STORAGE_KEYS.orders, []);
  }
  if (!wx.getStorageSync(STORAGE_KEYS.addresses)) {
    wx.setStorageSync(STORAGE_KEYS.addresses, []);
  }
}

function getTemplates() {
  return templates;
}

function getTemplateById(id) {
  return templates.find((template) => template.id === id) || templates[0];
}

function normalizeLayouts(layouts) {
  const safeLayouts = Array.isArray(layouts) && layouts.length ? layouts : DEFAULT_LAYOUTS;
  const uniqueLayouts = safeLayouts.filter((layout, index) => {
    return safeLayouts.indexOf(layout) === index;
  });
  if (uniqueLayouts[0] === "cover") {
    return uniqueLayouts;
  }
  return ["cover"].concat(uniqueLayouts);
}

function pickLayout(contentLayouts, preferredOrder, fallback) {
  for (let index = 0; index < preferredOrder.length; index += 1) {
    const layout = preferredOrder[index];
    if (contentLayouts.indexOf(layout) > -1) {
      return layout;
    }
  }
  return fallback;
}

function getLayoutCapacity(template, type) {
  const templateOverrides = template && template.layoutCapacityOverrides ? template.layoutCapacityOverrides : {};
  const formatOverrides = template && template.bookFormat ? FORMAT_LAYOUT_CAPACITY[template.bookFormat] || {} : {};
  return templateOverrides[type] || formatOverrides[type] || LAYOUT_CAPACITY[type] || LAYOUT_CAPACITY.single;
}

function buildPageTypes(template, contentLayouts, maxPages, photoCount) {
  const safeContentLayouts = contentLayouts.length ? contentLayouts : DEFAULT_LAYOUTS.filter((layout) => layout !== "cover");
  const templateOpening = template && template.openingLayout && safeContentLayouts.indexOf(template.openingLayout) > -1
    ? template.openingLayout
    : "";
  const templateClosing = template && template.closingLayout && safeContentLayouts.indexOf(template.closingLayout) > -1
    ? template.closingLayout
    : "";
  const openingType = templateOpening || pickLayout(safeContentLayouts, OPENING_LAYOUT_ORDER, safeContentLayouts[0] || "single");
  const closingType = templateClosing || pickLayout(
    safeContentLayouts,
    CLOSING_LAYOUT_ORDER,
    safeContentLayouts[safeContentLayouts.length - 1] || openingType || "letter"
  );
  const middleLayouts = safeContentLayouts.filter((layout) => {
    return layout !== openingType && layout !== closingType;
  });
  const templateMiddleLayouts = template && Array.isArray(template.middleLayoutSequence)
    ? template.middleLayoutSequence.filter((layout) => middleLayouts.indexOf(layout) > -1)
    : [];
  const reusableMiddleLayouts = templateMiddleLayouts.length
    ? templateMiddleLayouts
    : middleLayouts.length
      ? middleLayouts
      : safeContentLayouts.filter((layout) => layout !== closingType);
  const flowMiddleLayouts = reusableMiddleLayouts.length ? reusableMiddleLayouts : [openingType];
  const averageMiddleCapacity = flowMiddleLayouts.length
    ? flowMiddleLayouts.reduce((total, layout) => total + getLayoutCapacity(template, layout), 0) / flowMiddleLayouts.length
    : 1;
  const openingCapacity = getLayoutCapacity(template, openingType);
  const closingCapacity = getLayoutCapacity(template, closingType);
  const remainingPhotos = Math.max(photoCount - 1 - openingCapacity - closingCapacity, 0);
  const estimatedPages = 1 + 1 + Math.ceil(remainingPhotos / averageMiddleCapacity) + 1;
  const minPreviewPages = Math.min(maxPages, 4);
  const targetPages = Math.max(minPreviewPages, Math.min(maxPages, estimatedPages));
  const pageTypes = ["cover"];
  let middleCursor = 0;

  if (targetPages === 1) {
    return pageTypes;
  }

  pageTypes.push(openingType);
  while (pageTypes.length < targetPages - 1) {
    const middleType = flowMiddleLayouts[middleCursor % flowMiddleLayouts.length] || openingType;
    pageTypes.push(middleType);
    middleCursor += 1;
  }
  pageTypes.push(closingType || openingType);
  return pageTypes.slice(0, maxPages);
}

function takePhotoIds(photos, cursor, count, fillPlaceholders, pageIndex) {
  const photoIds = [];
  let nextCursor = cursor;
  for (let index = 0; index < count; index += 1) {
    const photo = photos[nextCursor];
    if (photo && photo.id) {
      photoIds.push(photo.id);
      nextCursor += 1;
    } else if (fillPlaceholders) {
      photoIds.push(`placeholder_${pageIndex}_${index}`);
    }
  }
  return {
    photoIds,
    nextCursor
  };
}

function buildLayoutPage({ template, type, pageIndex, photoIds }) {
  const copy = LAYOUT_COPY[type] || LAYOUT_COPY.single;
  return {
    id: `page_${pageIndex + 1}_${type}`,
    type,
    title: type === "cover" ? template.name : copy.title,
    subtitle: copy.subtitle,
    caption: copy.caption,
    background: type === "cover" ? `linear-gradient(135deg, ${template.coverTone}, ${template.accentTone})` : LAYOUT_BACKGROUNDS[type] || LAYOUT_BACKGROUNDS.single,
    photoIds,
    bookFormat: template.bookFormat || "square",
    styleFamily: template.styleFamily || "clean",
    formatLabel: template.formatLabel || "方版",
    styleLabel: template.styleLabel || "清新风格"
  };
}

function buildLayoutPlan({ template, photos }) {
  const safeTemplate = template || templates[0];
  const safePhotos = Array.isArray(photos) ? photos : [];
  const layouts = normalizeLayouts(safeTemplate.layouts);
  const contentLayouts = layouts.filter((layout) => layout !== "cover");
  const maxPages = Math.max(1, Math.min(safeTemplate.pageCount || 12, 30));
  const pageTypes = buildPageTypes(safeTemplate, contentLayouts, maxPages, safePhotos.length);
  const pages = [];
  let cursor = 0;
  const minPreviewPages = Math.min(pageTypes.length, 4);

  for (let index = 0; index < pageTypes.length; index += 1) {
    const type = pageTypes[index];
    const capacity = getLayoutCapacity(safeTemplate, type);
    const shouldFillPlaceholders = index < minPreviewPages || index === pageTypes.length - 1;
    const result = takePhotoIds(safePhotos, cursor, capacity, shouldFillPlaceholders, index);
    if (!result.photoIds.length) {
      continue;
    }
    cursor = result.nextCursor;
    pages.push(buildLayoutPage({
      template: safeTemplate,
      type,
      pageIndex: index,
      photoIds: result.photoIds
    }));
  }

  return {
    version: 1,
    generatedAt: Date.now(),
    layoutLabel: safeTemplate.layoutLabel || "自动排版",
    pageCount: pages.length,
    pages
  };
}

function buildLayoutPlanFromWork(work) {
  return buildLayoutPlan({
    template: Object.assign({}, getTemplateById(work.templateId), work.templateSnapshot || {}, work),
    photos: work.photos || []
  });
}

function formatPrice(price) {
  return `¥${(price / 100).toFixed(2)}`;
}

function getUserProfile() {
  return wx.getStorageSync(STORAGE_KEYS.profile) || null;
}

function saveUserProfile(profile) {
  const nextProfile = {
    nickName: profile.nickName || "小页记用户",
    avatarUrl: profile.avatarUrl || "",
    updatedAt: Date.now()
  };
  wx.setStorageSync(STORAGE_KEYS.profile, nextProfile);
  return nextProfile;
}

function getWorks() {
  const works = wx.getStorageSync(STORAGE_KEYS.works);
  return Array.isArray(works) ? works : [];
}

function saveWorksCache(works) {
  const nextWorks = Array.isArray(works) ? works : [];
  wx.setStorageSync(STORAGE_KEYS.works, nextWorks);
  return nextWorks;
}

function replaceWorksCache(works) {
  const currentMap = getWorks().reduce((accumulator, work) => {
    accumulator[work.id] = work;
    return accumulator;
  }, {});
  const nextWorks = (Array.isArray(works) ? works : []).map((work) => {
    return Object.assign({}, currentMap[work.id] || {}, work);
  });
  return saveWorksCache(nextWorks);
}

function upsertWorkCache(work) {
  if (!work || !work.id) {
    return null;
  }
  const currentWorks = getWorks().filter((item) => item.id !== work.id);
  saveWorksCache([Object.assign({}, getWorkById(work.id) || {}, work)].concat(currentWorks));
  return work;
}

function getWorkById(id) {
  return getWorks().find((work) => work.id === id) || null;
}

function canWorkCreateOrder(work) {
  if (!work) {
    return false;
  }
  const photoCount = work.photoCount || (work.photos || []).length;
  return work.statusCode === WORK_STATUS.ready.code
    && photoCount >= (work.orderMinPhotos || 1)
    && areWorkAssetsReady(work);
}

function resolveWorkStatus(photoCount, orderMinPhotos) {
  if (photoCount < orderMinPhotos) {
    return WORK_STATUS.draft;
  }
  return WORK_STATUS.ready;
}

function createWorkFromDraft({ templateId, draft }) {
  const safeDraft = Object.assign({}, templateDraft.createEmptyDraft(templateId), draft);
  const template = templatePreview.getTemplateRule(safeDraft.templateSnapshot || templateId);
  const templateSnapshot = templateRuntime.toTemplateSnapshot(template);
  const now = Date.now();
  const previewData = templatePreview.buildPreviewData(Object.assign({}, safeDraft, {
    templateId,
    templateSnapshot
  }));
  const status = resolveWorkStatus(previewData.photoCount, previewData.orderMinPhotos);
  const work = {
    id: `work_${now}`,
    title: previewData.coverTitle || template.name,
    templateId,
    templateName: template.name,
    templateSourceMode: template.sourceMode || "seed_fallback",
    templateVersionId: template.templateVersion && template.templateVersion.id ? template.templateVersion.id : null,
    templateVersionNo: template.templateVersion && template.templateVersion.versionNo ? template.templateVersion.versionNo : null,
    templateSnapshot,
    scene: template.scene,
    price: template.price || template.priceInCents || 0,
    pageCount: previewData.generatedPageCount,
    targetPageCount: template.pageCount,
    coverTone: template.coverTone,
    accentTone: template.accentTone,
    coverImage: previewData.coverImage || template.coverImage,
    previewImages: template.previewImages,
    sourceName: template.sourceName,
    layouts: template.layouts,
    layoutLabel: template.layoutLabel,
    recommendedPhotoCount: template.recommendedPhotoCount,
    formatLabel: template.formatLabel,
    bookFormat: template.bookFormat,
    pageAspectRatio: template.pageAspectRatio,
    styleFamily: template.styleFamily,
    styleLabel: template.styleLabel,
    openingLayout: template.openingLayout,
    closingLayout: template.closingLayout,
    middleLayoutSequence: template.middleLayoutSequence,
    layoutCapacityOverrides: template.layoutCapacityOverrides,
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
  const works = [work].concat(getWorks());
  wx.setStorageSync(STORAGE_KEYS.works, works);
  return work;
}

function createWork({ templateId, photos }) {
  return createWorkFromDraft({
    templateId,
    draft: {
      templateId,
      photos: Array.isArray(photos) ? photos : []
    }
  });
}

function cleanupWorkLocalFiles(work) {
  if (work && work.photos) {
    work.photos.forEach((photo) => {
      if (photo.saved && photo.path) {
        wx.removeSavedFile({ filePath: photo.path });
      }
    });
  }
}

function deleteWork(id) {
  const targetWork = getWorkById(id);
  cleanupWorkLocalFiles(targetWork);
  const works = getWorks().filter((work) => work.id !== id);
  wx.setStorageSync(STORAGE_KEYS.works, works);
  return works;
}

function updateWorkStatus(id, status) {
  const works = getWorks().map((work) => {
    if (work.id !== id) {
      return work;
    }
    const statusCode = status === WORK_STATUS.ready.label ? WORK_STATUS.ready.code : work.statusCode;
    return Object.assign({}, work, {
      statusCode,
      statusText: status,
      status,
      updatedAt: Date.now()
    });
  });
  wx.setStorageSync(STORAGE_KEYS.works, works);
  return getWorkById(id);
}

function getOrderStatusByCode(code) {
  const allStatus = Object.keys(ORDER_STATUS).map((key) => ORDER_STATUS[key]);
  return allStatus.find((item) => item.code === code) || ORDER_STATUS.pendingPayment;
}

function resolveLegacyOrderStatus(order) {
  if (order.statusCode) {
    return getOrderStatusByCode(order.statusCode);
  }
  if (order.status === ORDER_STATUS.closed.label || order.status === "已取消") {
    return ORDER_STATUS.closed;
  }
  if (order.status === ORDER_STATUS.pendingPayment.label) {
    return ORDER_STATUS.pendingPayment;
  }
  return ORDER_STATUS.pendingShipment;
}

function buildAddressSnapshot(address) {
  if (!address) {
    return null;
  }
  return {
    id: address.id || "",
    name: address.name || "",
    phone: address.phone || "",
    region: address.region || "",
    regionParts: Array.isArray(address.regionParts) ? address.regionParts : [],
    detail: address.detail || "",
    isDefault: !!address.isDefault
  };
}

function isAddressSnapshotComplete(addressSnapshot) {
  return !!(
    addressSnapshot
    && String(addressSnapshot.name || "").trim()
    && String(addressSnapshot.phone || "").trim()
    && String(addressSnapshot.region || "").trim()
    && String(addressSnapshot.detail || "").trim()
  );
}

function buildWorkSnapshot(work) {
  return {
    id: work.id,
    title: work.title,
    templateId: work.templateId,
    templateName: work.templateName,
    templateSourceMode: work.templateSourceMode || "",
    templateVersionId: work.templateVersionId || "",
    templateVersionNo: work.templateVersionNo || null,
    scene: work.scene,
    coverTitle: work.coverTitle,
    babyInfo: work.babyInfo,
    coverPhrase: work.coverPhrase,
    coverTone: work.coverTone,
    accentTone: work.accentTone,
    coverImage: work.coverImage || "",
    coverPhoto: work.photos && work.photos[0] ? work.photos[0].path : "",
    photoCount: work.photoCount || (work.photos || []).length,
    generatedPageCount: work.pageCount || 0,
    targetPageCount: work.targetPageCount || work.pageCount || 0,
    price: work.price || 0,
    previewPageCount: work.previewData ? work.previewData.generatedPageCount : work.pageCount || 0,
    suggestedMinPhotos: work.suggestedMinPhotos || 1,
    orderMinPhotos: work.orderMinPhotos || 1,
    assetReady: areWorkAssetsReady(work),
    statusCode: work.statusCode,
    statusText: work.statusText
  };
}

function areWorkAssetsReady(work) {
  if (!work || !Array.isArray(work.photos) || !work.photos.length) {
    return false;
  }
  return work.photos.every((photo) => {
    return !!(
      photo
      && photo.asset
      && photo.asset.publicUrl
      && photo.previewUrl
      && photo.fulfillmentUrl
    );
  });
}

function isWorkSnapshotComplete(workSnapshot) {
  return !!(
    workSnapshot
    && String(workSnapshot.id || "").trim()
    && String(workSnapshot.title || "").trim()
    && String(workSnapshot.templateId || "").trim()
    && String(workSnapshot.templateName || "").trim()
    && Number(workSnapshot.generatedPageCount || 0) > 0
    && Number(workSnapshot.photoCount || 0) > 0
  );
}

function isTemplateVersionComplete(workSnapshot) {
  return !!(
    workSnapshot
    && (
      String(workSnapshot.templateVersionId || "").trim()
      || Number(workSnapshot.templateVersionNo || 0) > 0
    )
  );
}

function buildProductionReadinessCheck(code, label, passed, description, blocker) {
  return {
    code,
    label,
    passed,
    description,
    blocker: passed ? "" : blocker
  };
}

function buildOrderProductionReadiness(order) {
  const workSnapshot = order && order.workSnapshot ? order.workSnapshot : null;
  const addressSnapshot = order && order.addressSnapshot ? order.addressSnapshot : null;
  const checks = [
    buildProductionReadinessCheck(
      "assets_ready",
      "图片资产齐全",
      !!(workSnapshot && workSnapshot.assetReady),
      "作品图片已经具备服务端资源引用，后续可以继续接 PDF 和履约。",
      "作品图片还没有全部完成服务端持久化，当前不能继续用于 PDF 或履约。"
    ),
    buildProductionReadinessCheck(
      "work_snapshot_complete",
      "作品快照完整",
      isWorkSnapshotComplete(workSnapshot),
      "作品标题、模板、页数和照片数都已经冻结，历史回看会更稳定。",
      "作品快照缺少标题、模板或页数信息，当前不适合继续进入生产流程。"
    ),
    buildProductionReadinessCheck(
      "template_version_complete",
      "模板版本完整",
      isTemplateVersionComplete(workSnapshot),
      "当前订单已经冻结模板版本号，后续新版模板不会影响历史订单。",
      "模板版本号还不完整，当前无法保证后续使用的是哪一版模板。"
    ),
    buildProductionReadinessCheck(
      "address_complete",
      "地址快照完整",
      isAddressSnapshotComplete(addressSnapshot),
      "收货地址快照已经齐全，后续履约时可以直接使用。",
      "收货地址快照还不完整，当前无法继续进入后续履约流程。"
    )
  ];
  const blockers = checks.filter((item) => !item.passed).map((item) => item.blocker);
  const ready = blockers.length === 0;
  return {
    ready,
    label: ready ? "已具备后续生产条件" : "暂不具备后续生产条件",
    description: ready
      ? "当前订单所需的图片、作品快照、模板版本和地址都已经齐全，后续可以继续接支付、PDF 和履约动作。"
      : "当前还有关键信息缺失，建议先补齐后再继续接支付、PDF 或履约能力。",
    blockers,
    checks
  };
}

function buildOrderActionAvailability(order) {
  const productionReadiness = order && order.productionReadiness
    ? order.productionReadiness
    : buildOrderProductionReadiness(order);
  const statusCode = order && order.statusCode
    ? order.statusCode
    : resolveLegacyOrderStatus(order).code;

  function buildAction(visible, enabled, blocked, reason, requiredChecks) {
    return {
      visible,
      enabled,
      blocked,
      reason,
      requiredChecks
    };
  }

  let payAction;
  if (statusCode === ORDER_STATUS.pendingPayment.code) {
    payAction = buildAction(
      true,
      true,
      false,
      "当前只保留支付入口位，后续会接正式支付能力。",
      ["status_pending_payment"]
    );
  } else if (statusCode === ORDER_STATUS.closed.code) {
    payAction = buildAction(
      true,
      false,
      true,
      "订单已关闭，当前不能继续支付。",
      ["status_pending_payment"]
    );
  } else {
    payAction = buildAction(
      true,
      false,
      true,
      "订单已经进入待发货占位状态，当前不需要重复支付。",
      ["status_pending_payment"]
    );
  }

  const productionRequiredChecks = ["production_ready", "status_not_closed"];
  let pdfAction;
  let fulfillmentAction;
  if (statusCode === ORDER_STATUS.closed.code) {
    pdfAction = buildAction(
      true,
      false,
      true,
      "订单已关闭，当前不能继续生成 PDF。",
      productionRequiredChecks
    );
    fulfillmentAction = buildAction(
      true,
      false,
      true,
      "订单已关闭，当前不能继续进入履约。",
      productionRequiredChecks
    );
  } else if (!productionReadiness.ready) {
    pdfAction = buildAction(
      true,
      false,
      true,
      "当前还有前置条件缺失，请先补齐图片、模板版本、作品快照或地址快照。",
      productionRequiredChecks
    );
    fulfillmentAction = buildAction(
      true,
      false,
      true,
      "当前还有关键信息缺失，先补齐后再继续进入履约。",
      productionRequiredChecks
    );
  } else {
    pdfAction = buildAction(
      true,
      true,
      false,
      "当前只保留 PDF 入口位，后续会接真实 PDF 生成。",
      productionRequiredChecks
    );
    fulfillmentAction = buildAction(
      true,
      true,
      false,
      "当前只保留履约入口位，后续会接发货、物流与后台履约动作。",
      productionRequiredChecks
    );
  }

  return {
    payAction,
    pdfAction,
    fulfillmentAction
  };
}

function hydrateOrder(order) {
  const status = resolveLegacyOrderStatus(order);
  const productionReadiness = order.productionReadiness || buildOrderProductionReadiness(order);
  return Object.assign({}, order, {
    statusCode: status.code,
    statusText: status.label,
    status: status.label,
    statusHint: order.statusHint || status.hint,
    addressSnapshot: order.addressSnapshot || buildAddressSnapshot(order.address),
    workSnapshot: order.workSnapshot || {
      id: order.workId,
      title: order.workTitle,
      templateId: order.templateId,
      templateName: order.templateName
    },
    productionReadiness,
    actionAvailability: order.actionAvailability || buildOrderActionAvailability(Object.assign({}, order, {
      statusCode: status.code,
      productionReadiness
    }))
  });
}

function getOrders() {
  const orders = wx.getStorageSync(STORAGE_KEYS.orders);
  return Array.isArray(orders) ? orders.map(hydrateOrder) : [];
}

function saveOrdersCache(orders) {
  const nextOrders = Array.isArray(orders) ? orders.map(hydrateOrder) : [];
  wx.setStorageSync(STORAGE_KEYS.orders, nextOrders);
  return nextOrders;
}

function replaceOrdersCache(orders) {
  const currentMap = getOrders().reduce((accumulator, order) => {
    accumulator[order.id] = order;
    return accumulator;
  }, {});
  const nextOrders = (Array.isArray(orders) ? orders : []).map((order) => {
    return hydrateOrder(Object.assign({}, currentMap[order.id] || {}, order));
  });
  return saveOrdersCache(nextOrders);
}

function upsertOrderCache(order) {
  if (!order || !order.id) {
    return null;
  }
  const currentOrders = getOrders().filter((item) => item.id !== order.id);
  saveOrdersCache([hydrateOrder(Object.assign({}, getOrderById(order.id) || {}, order))].concat(currentOrders));
  return order;
}

function getOrderById(id) {
  return getOrders().find((order) => order.id === id) || null;
}

function createOrder({ work, address, quantity, remark }) {
  if (!work || !canWorkCreateOrder(work) || !address) {
    return null;
  }
  const now = Date.now();
  const status = ORDER_STATUS.pendingPayment;
  const addressSnapshot = buildAddressSnapshot(address);
  const workSnapshot = buildWorkSnapshot(work);
  const order = {
    id: `order_${now}`,
    orderNo: `XYJ${now}`,
    workId: work.id,
    workTitle: work.title,
    templateId: work.templateId,
    templateName: work.templateName,
    statusCode: status.code,
    statusText: status.label,
    status: status.label,
    statusHint: status.hint,
    unitPrice: work.price,
    amount: work.price * quantity,
    quantity,
    addressId: addressSnapshot ? addressSnapshot.id : "",
    addressSnapshot,
    workSnapshot,
    remark: remark || "",
    paymentCapabilityReady: false,
    createdAt: now,
    updatedAt: now
  };
  wx.setStorageSync(STORAGE_KEYS.orders, [order].concat(getOrders()));
  return hydrateOrder(order);
}

function markOrderPaid(orderId) {
  const nextStatus = ORDER_STATUS.pendingShipment;
  let nextOrder = null;
  const orders = getOrders().map((order) => {
    if (order.id !== orderId) {
      return order;
    }
    nextOrder = Object.assign({}, order, {
      statusCode: nextStatus.code,
      statusText: nextStatus.label,
      status: nextStatus.label,
      statusHint: nextStatus.hint,
      updatedAt: Date.now()
    });
    return nextOrder;
  });
  wx.setStorageSync(STORAGE_KEYS.orders, orders);
  return nextOrder;
}

function closeOrder(orderId) {
  const nextStatus = ORDER_STATUS.closed;
  let nextOrder = null;
  const orders = getOrders().map((order) => {
    if (order.id !== orderId) {
      return order;
    }
    nextOrder = Object.assign({}, order, {
      statusCode: nextStatus.code,
      statusText: nextStatus.label,
      status: nextStatus.label,
      statusHint: nextStatus.hint,
      updatedAt: Date.now()
    });
    return nextOrder;
  });
  wx.setStorageSync(STORAGE_KEYS.orders, orders);
  return nextOrder;
}

function getAddresses() {
  const addresses = wx.getStorageSync(STORAGE_KEYS.addresses);
  return Array.isArray(addresses)
    ? addresses.map((address) => {
      return Object.assign({}, address, {
        regionParts: Array.isArray(address.regionParts) ? address.regionParts : []
      });
    })
    : [];
}

function saveAddressesCache(addresses) {
  const nextAddresses = Array.isArray(addresses) ? addresses : [];
  wx.setStorageSync(STORAGE_KEYS.addresses, nextAddresses);
  return nextAddresses;
}

function replaceAddressesCache(addresses) {
  return saveAddressesCache(addresses);
}

function getAddressById(id) {
  return getAddresses().find((address) => address.id === id) || null;
}

function getDefaultAddress() {
  const addresses = getAddresses();
  return addresses.find((address) => address.isDefault) || null;
}

function saveAddress(address) {
  const now = Date.now();
  const addresses = getAddresses();
  const existingAddress = address.id ? getAddressById(address.id) : null;
  const shouldSetDefault = addresses.length === 0 || !!address.isDefault;
  const nextAddress = {
    id: address.id || `addr_${now}`,
    name: address.name,
    phone: address.phone,
    region: address.region || (Array.isArray(address.regionParts) ? address.regionParts.join("") : ""),
    regionParts: Array.isArray(address.regionParts)
      ? address.regionParts
      : existingAddress && existingAddress.regionParts
        ? existingAddress.regionParts
        : [],
    detail: address.detail,
    isDefault: shouldSetDefault ? true : !!(existingAddress && existingAddress.isDefault),
    updatedAt: now
  };
  const rest = addresses.filter((item) => item.id !== nextAddress.id).map((item) => {
    return shouldSetDefault ? Object.assign({}, item, { isDefault: false }) : item;
  });
  wx.setStorageSync(STORAGE_KEYS.addresses, [nextAddress].concat(rest));
  return nextAddress;
}

function setDefaultAddress(id) {
  let nextAddress = null;
  const nextList = getAddresses().map((address) => {
    const isDefault = address.id === id;
    const nextItem = Object.assign({}, address, { isDefault });
    if (isDefault) {
      nextAddress = nextItem;
    }
    return nextItem;
  });
  wx.setStorageSync(STORAGE_KEYS.addresses, nextList);
  return nextAddress;
}

function deleteAddress(id) {
  const addresses = getAddresses().filter((address) => address.id !== id);
  const nextAddresses = addresses.map((address, index) => {
    if (addresses.some((item) => item.isDefault)) {
      return address;
    }
    return Object.assign({}, address, { isDefault: index === 0 });
  });
  wx.setStorageSync(STORAGE_KEYS.addresses, nextAddresses);
  return nextAddresses;
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

function getAdminSummary() {
  const works = getWorks();
  const orders = getOrders();
  return {
    registeredUsers: getUserProfile() ? 1 : 0,
    visitors: Math.max(18, works.length * 4 + 18),
    generatedWorks: works.length,
    paidOrders: orders.filter((order) => order.statusCode === ORDER_STATUS.pendingShipment.code).length,
    orderCount: orders.length
  };
}

module.exports = {
  ensureSeedData,
  formatDate,
  formatPrice,
  buildLayoutPlan,
  buildLayoutPlanFromWork,
  getTemplates,
  getTemplateById,
  WORK_STATUS,
  ORDER_STATUS,
  getUserProfile,
  saveUserProfile,
  getWorks,
  saveWorksCache,
  replaceWorksCache,
  upsertWorkCache,
  getWorkById,
  createWorkFromDraft,
  createWork,
  deleteWork,
  cleanupWorkLocalFiles,
  updateWorkStatus,
  getOrders,
  saveOrdersCache,
  replaceOrdersCache,
  upsertOrderCache,
  getOrderById,
  createOrder,
  markOrderPaid,
  closeOrder,
  canWorkCreateOrder,
  areWorkAssetsReady,
  buildOrderProductionReadiness,
  buildOrderActionAvailability,
  getAddresses,
  saveAddressesCache,
  replaceAddressesCache,
  getAddressById,
  getDefaultAddress,
  saveAddress,
  setDefaultAddress,
  deleteAddress,
  getAdminSummary
};
