"use strict";

(function () {
  const TEMPLATE_ID = "yofus-6095-14300-xiaoxiaoyouer";

  const refs = {
    heroTitle: document.getElementById("hero-title"),
    heroDesc: document.getElementById("hero-desc"),
    heroMeta: document.getElementById("hero-meta"),
    sourceLink: document.getElementById("source-link"),
    coverImage: document.getElementById("cover-image"),
    coverCaption: document.getElementById("cover-caption"),
    galleryStage: document.getElementById("gallery-stage"),
    galleryImage: document.getElementById("gallery-image"),
    galleryStatus: document.getElementById("gallery-status"),
    galleryCaption: document.getElementById("gallery-caption"),
    galleryPrev: document.getElementById("gallery-prev"),
    galleryNext: document.getElementById("gallery-next"),
    thumbRow: document.getElementById("thumb-row"),
    patternList: document.getElementById("pattern-list"),
    confirmedTags: document.getElementById("confirmed-tags"),
    inferredTags: document.getElementById("inferred-tags"),
    specList: document.getElementById("spec-list"),
    paletteList: document.getElementById("palette-list"),
    importId: document.getElementById("import-id"),
    importRule: document.getElementById("import-rule"),
    noteList: document.getElementById("note-list")
  };

  const templates = Array.isArray(window.externalTemplates) ? window.externalTemplates : [];
  const template = templates.find((item) => item.id === TEMPLATE_ID) || templates[0];
  const singlePagePages = getSinglePageDemoPages(template);
  const singlePagePatterns = getSinglePagePatterns(template);

  let activeIndex = 0;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setText(el, value) {
    if (!el) {
      return;
    }
    el.textContent = value || "";
  }

  function appendChip(container, text) {
    const chip = document.createElement("span");
    chip.className = "meta-chip";
    chip.textContent = text;
    container.appendChild(chip);
  }

  function getSinglePageDemoPages(currentTemplate) {
    const assets = (currentTemplate && currentTemplate.previewAssets) || {};
    if (Array.isArray(assets.singlePagePages) && assets.singlePagePages.length > 0) {
      return assets.singlePagePages;
    }

    return (assets.demoPages || [])
      .filter((url) => /page1|page8/.test(url))
      .map((url, index) => {
        return {
          id: `single-${index + 1}`,
          url,
          sourcePage: index === 0 ? 1 : 8,
          role: index === 0 ? "cover" : "closing",
          label: index === 0 ? "封面单页" : "结尾单页",
          caption: index === 0 ? "封面单页。" : "结尾单页。"
        };
      });
  }

  function getSinglePagePatterns(currentTemplate) {
    return ((currentTemplate && currentTemplate.layoutPatterns) || []).filter((item) => {
      return item.layoutScope !== "spread" && item.layoutScope !== "double";
    });
  }

  function buildHero() {
    const profile = template.normalizedProfile || {};
    const meta = template.sourceMeta || {};
    setText(refs.heroTitle, `${meta.templateName || "模板"} · ${profile.styleLabel || "模板预览"}`);
    setText(
      refs.heroDesc,
      `${profile.scene || "纪念册模板"}，来源于 ${template.providerLabel || "外部平台"}。这页只保留可直接进入模板库筛选的单页样张，跨页内容已经过滤，方便你先看单页排版值不值得收。`
    );

    refs.heroMeta.innerHTML = "";
    [
      meta.productName,
      `${profile.formatLabel || "未知规格"} · ${profile.bindingLabel || ""}`.trim(),
      "单页预览模式",
      meta.singlePagePreviewCount ? `已筛出 ${meta.singlePagePreviewCount} 张单页` : "",
      meta.photoCapacityText ? `${meta.photoCapacityText} 容量` : "",
      meta.optionSummary && meta.optionSummary.defaultPageCount
        ? `默认 ${meta.optionSummary.defaultPageCount} 页`
        : ""
    ]
      .filter(Boolean)
      .forEach((item) => appendChip(refs.heroMeta, item));

    refs.sourceLink.href = template.sourceUrl || "#";
    refs.coverImage.src = template.previewAssets.coverBrief;
    refs.coverImage.alt = `${meta.templateName || "模板"} 封面预览`;
    setText(
      refs.coverCaption,
      `${meta.sourceFolder || ""} · brief 封面图`
    );
  }

  function buildSpecs() {
    const meta = template.sourceMeta || {};
    const optionSummary = meta.optionSummary || {};
    const items = [
      ["来源平台", template.providerLabel || template.provider || "未知"],
      ["模板名称", meta.templateName || "未知"],
      ["商品型号", meta.productName || "未知"],
      ["goods_sn", meta.goodsSn || "未知"],
      ["style_id", meta.styleId || "未知"],
      ["分类", meta.subjectLabel || "未知"],
      ["单页样张", meta.singlePagePreviewCount ? `${meta.singlePagePreviewCount} 张` : "未整理"],
      ["照片容量", meta.photoCapacityText || "未知"],
      ["规格选项", `${(optionSummary.pageCounts || []).join(" / ")} 页`],
      ["材质选项", (optionSummary.finishes || []).join(" / ")]
    ];

    refs.specList.innerHTML = items
      .map(([label, value]) => {
        return `
          <div class="spec-item">
            <div class="spec-top">
              <div class="spec-label">${escapeHtml(label)}</div>
              <div class="spec-value">${escapeHtml(value || "未整理")}</div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function buildPalette() {
    const colors = (template.normalizedProfile && template.normalizedProfile.palette) || [];
    refs.paletteList.innerHTML = colors
      .map((item) => {
        return `
          <div class="palette-item">
            <div class="palette-chip" style="background:${escapeHtml(item.hex)};"></div>
            <div class="palette-top">
              <div class="palette-usage">${escapeHtml(item.usage)}</div>
              <div class="spec-value">${escapeHtml(item.hex)}</div>
            </div>
            <div class="palette-evidence">${escapeHtml(item.evidence)}</div>
          </div>
        `;
      })
      .join("");
  }

  function buildPatterns() {
    if (singlePagePatterns.length === 0) {
      refs.patternList.innerHTML = '<div class="note-item">当前没有筛出可复用的单页版式。</div>';
      return;
    }

    refs.patternList.innerHTML = singlePagePatterns
      .map((item) => {
        return `
          <div class="pattern-item">
            <div class="pattern-top">
              <div class="pattern-label">${escapeHtml(item.label)}</div>
              <span class="status-chip">${escapeHtml(item.confidence || "medium")}</span>
            </div>
            <div class="pattern-evidence">${escapeHtml(item.evidence || "")}</div>
          </div>
        `;
      })
      .join("");
  }

  function buildInventory() {
    const inventory = template.elementInventory || {};
    refs.confirmedTags.innerHTML = (inventory.confirmed || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
    refs.inferredTags.innerHTML = (inventory.inferred || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  function buildImportInfo() {
    const mapping = template.importMapping || {};
    setText(refs.importId, mapping.suggestedLocalTemplateId || "待确定");
    setText(refs.importRule, mapping.suggestedPreviewStrategy || "待补充");
    refs.noteList.innerHTML = (template.notes || [])
      .map((item) => `<div class="note-item">${escapeHtml(item)}</div>`)
      .join("");
  }

  function renderThumbs() {
    refs.thumbRow.innerHTML = singlePagePages
      .map((page, index) => {
        return `
          <button class="thumb-btn ${index === activeIndex ? "is-active" : ""}" type="button" data-index="${index}">
            <img src="${escapeHtml(page.url)}" alt="${escapeHtml(page.label || `单页 ${index + 1}`)}" loading="lazy" />
            <span>${escapeHtml(page.label || `单页 ${index + 1}`)}</span>
          </button>
        `;
      })
      .join("");

    refs.thumbRow.querySelectorAll(".thumb-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const nextIndex = Number(button.getAttribute("data-index") || 0);
        setActiveIndex(nextIndex);
      });
    });
  }

  function renderGallery() {
    const current = singlePagePages[activeIndex];
    if (!current) {
      refs.galleryStage.classList.add("gallery-stage--empty");
      refs.galleryImage.removeAttribute("src");
      refs.galleryStatus.textContent = "0 / 0";
      refs.galleryCaption.textContent = "当前模板没有筛出可用的单页样张。";
      refs.galleryPrev.disabled = true;
      refs.galleryNext.disabled = true;
      refs.thumbRow.innerHTML = "";
      return;
    }

    refs.galleryStage.classList.remove("gallery-stage--empty");
    refs.galleryImage.src = current.url;
    refs.galleryImage.alt = `${template.sourceMeta.templateName} ${current.label || `单页 ${activeIndex + 1}`}`;
    refs.galleryStatus.textContent = `${activeIndex + 1} / ${singlePagePages.length}`;
    refs.galleryCaption.textContent =
      current.caption || "这一张是可继续进入单页模板库的候选页面。";

    refs.galleryStage.classList.remove("gallery-stage--portrait", "gallery-stage--spread");
    refs.galleryStage.classList.add("gallery-stage--portrait");

    refs.galleryPrev.disabled = activeIndex <= 0;
    refs.galleryNext.disabled = activeIndex >= singlePagePages.length - 1;

    renderThumbs();
  }

  function setActiveIndex(index) {
    activeIndex = Math.max(0, Math.min(index, singlePagePages.length - 1));
    renderGallery();
  }

  function bindEvents() {
    refs.galleryPrev.addEventListener("click", () => {
      setActiveIndex(activeIndex - 1);
    });

    refs.galleryNext.addEventListener("click", () => {
      setActiveIndex(activeIndex + 1);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        setActiveIndex(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex(activeIndex + 1);
      }
    });
  }

  function renderEmptyState() {
    setText(refs.heroTitle, "没有找到模板数据");
    setText(refs.heroDesc, "请先确认 externalTemplates 数据已经加载，或者当前模板已经筛出了单页样张。");
  }

  function init() {
    if (!template || singlePagePages.length === 0) {
      renderEmptyState();
      return;
    }

    buildHero();
    buildSpecs();
    buildPalette();
    buildPatterns();
    buildInventory();
    buildImportInfo();
    renderGallery();
    bindEvents();
  }

  init();
})();
