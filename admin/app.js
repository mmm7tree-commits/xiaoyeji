"use strict";

const refs = {
  pageKicker: document.getElementById("page-kicker"),
  pageTitle: document.getElementById("page-title"),
  pageDesc: document.getElementById("page-desc"),
  topPeriodSelect: document.getElementById("top-period-select"),
  refreshButton: document.getElementById("refresh-button"),
  sidebarLinks: Array.from(document.querySelectorAll(".sidebar-link")),
  sectionPanels: Array.from(document.querySelectorAll("[data-section-panel]")),
  summaryGrid: document.getElementById("summary-grid"),
  templateNewButton: document.getElementById("template-new-button"),
  templateForm: document.getElementById("template-form"),
  templateId: document.getElementById("template-id"),
  templateTitle: document.getElementById("template-title"),
  templateCategory: document.getElementById("template-category"),
  templateStatus: document.getElementById("template-status"),
  templatePrice: document.getElementById("template-price"),
  templatePages: document.getElementById("template-pages"),
  templateRange: document.getElementById("template-range"),
  templateCoverImage: document.getElementById("template-cover-image"),
  templateNote: document.getElementById("template-note"),
  templateFeatured: document.getElementById("template-featured"),
  templateAdminList: document.getElementById("template-admin-list"),
  workSearchInput: document.getElementById("work-search-input"),
  workTemplateFilter: document.getElementById("work-template-filter"),
  workStatusFilter: document.getElementById("work-status-filter"),
  workCount: document.getElementById("work-count"),
  workList: document.getElementById("work-list"),
  orderSearchInput: document.getElementById("order-search-input"),
  orderTemplateFilter: document.getElementById("order-template-filter"),
  orderStatusFilter: document.getElementById("order-status-filter"),
  orderBatchPrintButton: document.getElementById("order-batch-print-button"),
  orderCount: document.getElementById("order-count"),
  orderAdminList: document.getElementById("order-admin-list"),
  toast: document.getElementById("toast")
};

const sectionMeta = {
  summary: {
    kicker: "经营侧",
    title: "数据概括",
    desc: "查看注册、访问、作品、订单和分享等核心数据，快速判断当前业务状态。"
  },
  works: {
    kicker: "用户侧",
    title: "用户管理",
    desc: "查看家长生成的作品、筛选状态，并回看封面、模板和班级信息。"
  },
  templates: {
    kicker: "内容侧",
    title: "模板管理",
    desc: "维护模板名称、价格、封面图和推荐文案，让前台模板中心同步更新。"
  },
  orders: {
    kicker: "交易侧",
    title: "订单管理",
    desc: "查看订单、处理发货、维护物流和下载打印文件。"
  }
};

const state = {
  activeSection: "orders",
  activePeriod: "month",
  summary: null,
  templates: [],
  works: [],
  orders: [],
  workSearch: "",
  orderSearch: "",
  workTemplateFilter: "all",
  workStatusFilter: "all",
  orderTemplateFilter: "all",
  orderStatusFilter: "all"
};

let toastTimer = 0;

async function request(path, options = {}) {
  const response = await fetch(path, Object.assign({
    headers: {
      "Content-Type": "application/json"
    }
  }, options));
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || "请求失败");
  }
  return payload.data;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  refs.toast.textContent = message;
  refs.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    refs.toast.classList.remove("is-visible");
  }, 2400);
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function getTemplateOptions() {
  return [{ id: "all", title: "全部模板" }].concat(state.templates.map((item) => ({
    id: item.id,
    title: item.title
  })));
}

function getTemplateStatusMeta(status) {
  if (status === "online") {
    return { label: "上架中", className: "live" };
  }
  if (status === "draft") {
    return { label: "草稿", className: "draft" };
  }
  return { label: "已归档", className: "archived" };
}

function getWorkStatusMeta(status) {
  if (status === "draft") {
    return { label: "草稿中", className: "draft" };
  }
  if (status === "generated") {
    return { label: "待确认", className: "generated" };
  }
  return { label: "已下单", className: "ordered" };
}

function getPdfStatusMeta(order) {
  if (order.status === "pending_payment") {
    return { label: "待生成", className: "pending" };
  }
  if (order.status === "awaiting_ship" && !order.logisticsCompany && !order.logisticsNo) {
    return { label: "待生成", className: "pending" };
  }
  return { label: "生成成功", className: "success" };
}

function getQuickActionLabel(order) {
  if (order.status === "awaiting_ship") {
    return "发货";
  }
  if (order.status === "shipped") {
    return "完成";
  }
  return "保存";
}

function parseAddressText(addressText) {
  const parts = String(addressText || "").trim().split(/\s+/).filter(Boolean);
  return {
    receiver: parts[0] || "未命名用户",
    phone: parts[1] || "暂无手机号",
    detail: parts.slice(2).join(" ") || "地址待补充"
  };
}

function getWorkMetaLine(work) {
  const lines = [
    work.templateName,
    work.previewSummary,
    work.coverClass
  ].filter(Boolean);
  return lines.join(" · ");
}

function findTemplateById(templateId) {
  return state.templates.find((item) => item.id === templateId) || null;
}

function renderSectionChrome() {
  const current = sectionMeta[state.activeSection];
  refs.pageKicker.textContent = current.kicker;
  refs.pageTitle.textContent = current.title;
  refs.pageDesc.textContent = current.desc;

  refs.sidebarLinks.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === state.activeSection);
  });

  refs.sectionPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.sectionPanel !== state.activeSection);
  });
}

function renderSummary() {
  if (!state.summary) {
    refs.summaryGrid.innerHTML = "";
    return;
  }
  refs.topPeriodSelect.value = state.activePeriod;
  const current = state.summary.periods[state.activePeriod];
  refs.summaryGrid.innerHTML = [
    { label: "注册人数", value: current.registrations, extra: "累计注册和近周期新增用户" },
    { label: "访问人数", value: current.visits, extra: "首页、分享页和后台访问都计入" },
    { label: "生成作品", value: current.works, extra: "包含草稿、预览和已下单作品" },
    { label: "订单数量", value: current.orders, extra: "当前时间范围内的创建订单数" },
    { label: "已支付订单", value: current.paidOrders, extra: "进入制作和发货流程的订单" },
    { label: "分享次数", value: current.shares, extra: "家长发给家人的分享链接点击量" }
  ].map((item) => `
    <div class="summary-card">
      <span class="summary-label">${item.label}</span>
      <span class="summary-value">${item.value}</span>
      <span class="summary-extra">${item.extra}</span>
    </div>
  `).join("");
}

function fillTemplateForm(template) {
  refs.templateId.value = template ? template.id : "";
  refs.templateTitle.value = template ? template.title : "";
  refs.templateCategory.value = template ? template.category : "graduation";
  refs.templateStatus.value = template ? template.status : "online";
  refs.templatePrice.value = template ? template.price : 129;
  refs.templatePages.value = template ? template.pages : 24;
  refs.templateRange.value = template ? template.photoRange : "";
  refs.templateCoverImage.value = template ? template.coverImage : "";
  refs.templateNote.value = template ? template.note : "";
  refs.templateFeatured.value = template ? template.featuredDesc : "";
}

function renderTemplates() {
  refs.templateAdminList.innerHTML = state.templates.map((item) => {
    const status = getTemplateStatusMeta(item.status);
    return `
      <article class="template-row">
        <img class="template-cover" src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(item.title)}" />
        <div class="template-meta">
          <div class="template-meta-row">
            <div>
              <div class="template-title">${escapeHtml(item.title)}</div>
              <span class="template-note">${escapeHtml(item.note)}</span>
            </div>
            <div class="price-cell">¥${escapeHtml(item.price)}</div>
          </div>
          <div class="template-pills">
            <span class="pill">${escapeHtml(item.pages)}页</span>
            <span class="pill">${escapeHtml(item.photoRange || "未设置")}</span>
            <span class="pill ${status.className}">${status.label}</span>
          </div>
          <span class="template-note">更新于 ${formatDateTime(item.updatedAt)}</span>
        </div>
        <button class="row-button" type="button" data-template-id="${escapeHtml(item.id)}">编辑模板</button>
      </article>
    `;
  }).join("");
}

function renderFilters() {
  const options = getTemplateOptions();
  const html = options.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join("");
  refs.workTemplateFilter.innerHTML = html;
  refs.orderTemplateFilter.innerHTML = html;
  refs.workTemplateFilter.value = state.workTemplateFilter;
  refs.orderTemplateFilter.value = state.orderTemplateFilter;
  refs.workStatusFilter.value = state.workStatusFilter;
  refs.orderStatusFilter.value = state.orderStatusFilter;
  refs.workSearchInput.value = state.workSearch;
  refs.orderSearchInput.value = state.orderSearch;
}

function getFilteredWorks() {
  const keyword = state.workSearch.trim().toLowerCase();
  return state.works.filter((item) => {
    if (state.workTemplateFilter !== "all" && item.templateId !== state.workTemplateFilter) {
      return false;
    }
    if (state.workStatusFilter !== "all" && item.status !== state.workStatusFilter) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [
      item.title,
      item.templateName,
      item.coverClass,
      item.previewSummary
    ].some((field) => String(field || "").toLowerCase().includes(keyword));
  });
}

function getFilteredOrders() {
  const keyword = state.orderSearch.trim().toLowerCase();
  return state.orders.filter((item) => {
    if (state.orderTemplateFilter !== "all" && item.templateId !== state.orderTemplateFilter) {
      return false;
    }
    if (state.orderStatusFilter !== "all" && item.status !== state.orderStatusFilter) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [
      item.id,
      item.albumTitle,
      item.templateName,
      item.addressText
    ].some((field) => String(field || "").toLowerCase().includes(keyword));
  });
}

function renderWorks() {
  const works = getFilteredWorks();
  refs.workCount.textContent = String(works.length);
  if (!works.length) {
    refs.workList.innerHTML = `<div class="table-empty">当前筛选条件下没有作品，可以先去前台做一本再回来查看。</div>`;
    return;
  }
  refs.workList.innerHTML = works.map((item) => {
    const workStatus = getWorkStatusMeta(item.status);
    const template = findTemplateById(item.templateId);
    return `
      <article class="work-row">
        <div class="work-cover-cell">
          <img class="cover-thumb" src="${escapeHtml(item.coverImage || (template ? template.coverImage : ""))}" alt="${escapeHtml(item.title)}" />
          <div>
            <div class="table-title">${escapeHtml(item.title)}</div>
            <div class="table-sub">${escapeHtml(getWorkMetaLine(item))}</div>
          </div>
        </div>
        <div>
          <div class="table-title" style="font-size:16px;">${escapeHtml(item.templateName)}</div>
          <div class="table-sub">${escapeHtml(item.photoCount)} 张照片 · 已生成 ${escapeHtml(item.generatedPages || item.selectedPages || 0)} 页</div>
        </div>
        <div>
          <span class="status-pill work-status ${workStatus.className}">${workStatus.label}</span>
        </div>
        <div>
          <div class="table-sub">${formatDateTime(item.updateTime)}</div>
        </div>
      </article>
    `;
  }).join("");
}

function renderOrders() {
  const orders = getFilteredOrders();
  refs.orderCount.textContent = String(orders.length);
  if (!orders.length) {
    refs.orderAdminList.innerHTML = `<div class="table-empty">当前没有匹配的订单，去前台提交一单后这里会同步出现。</div>`;
    return;
  }
  refs.orderAdminList.innerHTML = orders.map((item) => {
    const address = parseAddressText(item.addressText);
    const pdfStatus = getPdfStatusMeta(item);
    const template = findTemplateById(item.templateId);
    const printLabel = pdfStatus.className === "success" ? "下载PDF" : "生成PDF";
    return `
      <article class="order-row" data-order-row="${escapeHtml(item.id)}">
        <div class="order-row-head">
          <div class="order-cover-cell">
            <img class="cover-thumb" src="${escapeHtml(template ? template.coverImage : "")}" alt="${escapeHtml(item.albumTitle)}" />
            <div>
              <div class="table-title">${escapeHtml(item.albumTitle)}</div>
              <div class="table-sub">${escapeHtml(item.templateName)}</div>
            </div>
          </div>
          <div>
            <div class="table-title" style="font-size:16px;">${escapeHtml(item.id)}</div>
            <div class="table-sub">${formatDateTime(item.createdAt)}</div>
            <div class="table-sub">${escapeHtml(item.pages)}页 · ${escapeHtml(item.quantity)} 本</div>
          </div>
          <div>
            <div class="table-title" style="font-size:16px;">${escapeHtml(address.receiver)}</div>
            <div class="table-sub">${escapeHtml(address.phone)}</div>
            <div class="table-sub">${escapeHtml(address.detail)}</div>
          </div>
          <div class="price-cell">¥${escapeHtml(item.amount)}</div>
          <div>
            <span class="status-pill ${escapeHtml(item.status)}">${escapeHtml(item.statusLabel)}</span>
          </div>
          <div>
            <span class="pdf-pill ${pdfStatus.className}">${pdfStatus.label}</span>
          </div>
          <div class="action-stack">
            <a class="row-button" href="/api/admin/orders/${escapeHtml(item.id)}/print" target="_blank" rel="noreferrer">${printLabel}</a>
            <button class="row-button-dark" type="button" data-order-quick="${escapeHtml(item.id)}">${getQuickActionLabel(item)}</button>
            <button class="row-button" type="button" data-order-toggle="${escapeHtml(item.id)}">详情</button>
          </div>
        </div>

        <div class="order-editor">
          <div class="inline-grid">
            <label class="inline-field">
              订单状态
              <select data-order-field="status" data-order-id="${escapeHtml(item.id)}">
                <option value="pending_payment" ${item.status === "pending_payment" ? "selected" : ""}>待支付</option>
                <option value="awaiting_ship" ${item.status === "awaiting_ship" ? "selected" : ""}>待发货</option>
                <option value="shipped" ${item.status === "shipped" ? "selected" : ""}>已发货</option>
              </select>
            </label>
            <label class="inline-field">
              物流公司
              <input data-order-field="logisticsCompany" data-order-id="${escapeHtml(item.id)}" value="${escapeHtml(item.logisticsCompany || "")}" placeholder="例如 顺丰速运" />
            </label>
            <label class="inline-field">
              物流单号
              <input data-order-field="logisticsNo" data-order-id="${escapeHtml(item.id)}" value="${escapeHtml(item.logisticsNo || "")}" placeholder="例如 SF20260401" />
            </label>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderAll() {
  renderSectionChrome();
  renderSummary();
  renderTemplates();
  renderFilters();
  renderWorks();
  renderOrders();
}

async function loadAll() {
  const [summary, templates, works, orders] = await Promise.all([
    request("/api/admin/summary"),
    request("/api/admin/templates"),
    request("/api/admin/works"),
    request("/api/admin/orders")
  ]);
  state.summary = summary;
  state.templates = templates;
  state.works = works;
  state.orders = orders;
  renderAll();
}

async function saveTemplate(event) {
  event.preventDefault();
  const payload = {
    id: refs.templateId.value || undefined,
    title: refs.templateTitle.value.trim(),
    category: refs.templateCategory.value,
    status: refs.templateStatus.value,
    price: Number(refs.templatePrice.value),
    pages: Number(refs.templatePages.value),
    photoRange: refs.templateRange.value.trim(),
    coverImage: refs.templateCoverImage.value.trim(),
    note: refs.templateNote.value.trim(),
    featuredDesc: refs.templateFeatured.value.trim()
  };
  await request("/api/admin/templates", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  await loadAll();
  showToast("模板信息已保存");
}

async function saveOrderStatus(orderId, options = {}) {
  const statusField = refs.orderAdminList.querySelector(`[data-order-field="status"][data-order-id="${orderId}"]`);
  const companyField = refs.orderAdminList.querySelector(`[data-order-field="logisticsCompany"][data-order-id="${orderId}"]`);
  const noField = refs.orderAdminList.querySelector(`[data-order-field="logisticsNo"][data-order-id="${orderId}"]`);
  if (!statusField || !companyField || !noField) {
    throw new Error("订单字段未找到");
  }

  if (options.forceStatus) {
    statusField.value = options.forceStatus;
  }

  await request(`/api/admin/orders/${orderId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: statusField.value,
      logisticsCompany: companyField.value,
      logisticsNo: noField.value
    })
  });
  await loadAll();
  showToast("订单状态已更新");
}

function bindEvents() {
  refs.sidebarLinks.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSection = button.dataset.section;
      renderSectionChrome();
    });
  });

  refs.topPeriodSelect.addEventListener("change", () => {
    state.activePeriod = refs.topPeriodSelect.value;
    renderSummary();
  });

  refs.refreshButton.addEventListener("click", () => {
    loadAll().then(() => {
      showToast("数据已刷新");
    }).catch((error) => showToast(error.message));
  });

  refs.templateNewButton.addEventListener("click", () => {
    fillTemplateForm(null);
  });

  refs.templateForm.addEventListener("submit", (event) => {
    saveTemplate(event).catch((error) => showToast(error.message));
  });

  refs.templateAdminList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-template-id]");
    if (!button) {
      return;
    }
    const template = state.templates.find((item) => item.id === button.dataset.templateId);
    if (!template) {
      return;
    }
    fillTemplateForm(template);
    state.activeSection = "templates";
    renderSectionChrome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  refs.workSearchInput.addEventListener("input", () => {
    state.workSearch = refs.workSearchInput.value;
    renderWorks();
  });
  refs.workTemplateFilter.addEventListener("change", () => {
    state.workTemplateFilter = refs.workTemplateFilter.value;
    renderWorks();
  });
  refs.workStatusFilter.addEventListener("change", () => {
    state.workStatusFilter = refs.workStatusFilter.value;
    renderWorks();
  });

  refs.orderSearchInput.addEventListener("input", () => {
    state.orderSearch = refs.orderSearchInput.value;
    renderOrders();
  });
  refs.orderTemplateFilter.addEventListener("change", () => {
    state.orderTemplateFilter = refs.orderTemplateFilter.value;
    renderOrders();
  });
  refs.orderStatusFilter.addEventListener("change", () => {
    state.orderStatusFilter = refs.orderStatusFilter.value;
    renderOrders();
  });

  refs.orderBatchPrintButton.addEventListener("click", () => {
    const ids = getFilteredOrders().map((item) => item.id);
    if (!ids.length) {
      showToast("当前筛选结果没有订单可打印");
      return;
    }
    window.open("/api/admin/orders/batch-print?ids=" + encodeURIComponent(ids.join(",")), "_blank", "noopener,noreferrer");
  });

  refs.orderAdminList.addEventListener("click", (event) => {
    const toggleButton = event.target.closest("[data-order-toggle]");
    if (toggleButton) {
      const row = refs.orderAdminList.querySelector(`[data-order-row="${toggleButton.dataset.orderToggle}"]`);
      if (row) {
        row.classList.toggle("is-open");
      }
      return;
    }

    const quickButton = event.target.closest("[data-order-quick]");
    if (quickButton) {
      const order = state.orders.find((item) => item.id === quickButton.dataset.orderQuick);
      const nextStatus = order && order.status === "awaiting_ship" ? "shipped" : "";
      saveOrderStatus(quickButton.dataset.orderQuick, { forceStatus: nextStatus }).catch((error) => showToast(error.message));
    }
  });
}

async function init() {
  fillTemplateForm(null);
  bindEvents();
  try {
    await loadAll();
  } catch (error) {
    showToast(error.message);
  }
}

init();
