/**
 * Marhaba PMS — Setup area shared helpers
 *
 * Loaded by pages/setup-*.html AFTER assets/js/app.js.
 * Provides compact utilities so each CRUD list page stays declarative:
 *   Setup.crud({ search, table, rows, columns, filters })
 *   Setup.toast / Setup.openModal / Setup.closeModal  (delegate to PMS)
 *   Setup.bindFormSubmit(formId, message)
 */
(function () {
  "use strict";

  function escape(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function badge(text, cls) {
    return '<span class="badge ' + (cls || "badge-neutral") + '">' + escape(text) + "</span>";
  }

  function kebab(html) {
    return (
      '<div class="relative" data-kebab-root>' +
      '<button type="button" class="kebab-btn" data-action="toggle-kebab" aria-label="إجراءات إضافية" aria-expanded="false">' +
      '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>' +
      "</button>" +
      '<div class="kebab-menu" data-kebab-menu>' + html + "</div>" +
      "</div>"
    );
  }

  function defaultRowActions() {
    return kebab(
      '<button type="button" class="kebab-menu-item" data-action="toast" data-message="تعديل (تجريبي)">تعديل</button>' +
      '<button type="button" class="kebab-menu-item" data-action="toast" data-message="تم التكرار (تجريبي)">تكرار</button>' +
      '<div class="kebab-menu-sep"></div>' +
      '<button type="button" class="kebab-menu-item is-danger" data-action="toast" data-message="تم الحذف (تجريبي)">حذف</button>'
    );
  }

  function renderRow(row, columns) {
    return "<tr>" + columns.map(function (c) {
      if (c.render) return "<td" + (c.center ? ' class="text-center"' : "") + ">" + (c.render(row) || "—") + "</td>";
      const v = row[c.key];
      return "<td" + (c.center ? ' class="text-center"' : "") + ">" + (v == null || v === "" ? "—" : escape(v)) + "</td>";
    }).join("") + "</tr>";
  }

  function closeAllKebabs(except) {
    document.querySelectorAll("[data-kebab-menu].is-open").forEach(function (m) {
      if (m === except) return;
      m.classList.remove("is-open");
    });
  }

  /**
   * Declarative CRUD list.
   * @param {Object} cfg
   *   cfg.table     — tbody id
   *   cfg.search    — search input id (optional)
   *   cfg.empty     — empty state id (optional)
   *   cfg.rows      — array of row objects
   *   cfg.columns   — [{ key, label, render?, center? }]
   *   cfg.filters   — [{ id, value(row) }] optional select filters; each select id
   *   cfg.actions   — function(row)=>html for last cell; default kebab menu
   *   cfg.searchIn  — function(row, q) custom search predicate (default: all column values)
   */
  function crud(cfg) {
    const tbody = document.getElementById(cfg.table);
    if (!tbody) return;
    const searchEl = cfg.search ? document.getElementById(cfg.search) : null;
    const emptyEl = cfg.empty ? document.getElementById(cfg.empty) : null;
    const filterEls = (cfg.filters || []).map(function (f) {
      return { el: document.getElementById(f.id), pred: f.value };
    }).filter(function (f) { return f.el; });

    function defaultSearch(row, q) {
      return cfg.columns.some(function (c) {
        const v = c.render ? c.render(row) : row[c.key];
        return String(v == null ? "" : v).toLowerCase().indexOf(q) !== -1;
      });
    }
    const searchIn = cfg.searchIn || defaultSearch;

    function visible() {
      const q = searchEl ? searchEl.value.trim().toLowerCase() : "";
      return cfg.rows.filter(function (row) {
        if (q && !searchIn(row, q)) return false;
        for (let i = 0; i < filterEls.length; i++) {
          const sel = filterEls[i].el.value;
          if (sel && sel !== "all" && !filterEls[i].pred(row, sel)) return false;
        }
        return true;
      });
    }

    function render() {
      const list = visible();
      const cols = cfg.columns.slice();
      cols.push({ key: "__actions", center: true, render: cfg.actions || defaultRowActions });
      tbody.innerHTML = list.map(function (r) { return renderRow(r, cols); }).join("");
      if (emptyEl) {
        emptyEl.classList.toggle("hidden", list.length > 0);
        const t = emptyEl.querySelector("[data-empty-title]");
        const d = emptyEl.querySelector("[data-empty-desc]");
        if (t) t.textContent = cfg.rows.length === 0 ? "لا توجد عناصر بعد" : "لا توجد نتائج مطابقة";
        if (d) d.textContent = cfg.rows.length === 0 ? "ابدأ بإضافة أول عنصر من زر «إضافة»." : "جرّب تعديل البحث أو الفلاتر.";
      }
      // visible count span if present
      const countEl = document.querySelector("[data-visible-count]");
      if (countEl) countEl.textContent = String(list.length);
    }

    if (searchEl) searchEl.addEventListener("input", render);
    filterEls.forEach(function (f) { f.el.addEventListener("change", render); });

    // Kebab handling (delegated; stopPropagation-safe)
    tbody.addEventListener("click", function (e) {
      const btn = e.target.closest('[data-action="toggle-kebab"]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const menu = btn.closest("[data-kebab-root]").querySelector("[data-kebab-menu]");
      const willOpen = !menu.classList.contains("is-open");
      closeAllKebabs(menu);
      menu.classList.toggle("is-open", willOpen);
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-kebab-root]")) closeAllKebabs();
    });

    render();
    return { rerender: render };
  }

  function bindFormSubmit(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (window.PMS && PMS.toast) PMS.toast(message || "تم الحفظ (تجريبي)");
      if (window.PMS && PMS.closeModal) {
        // close the nearest modal
        const modal = form.closest(".modal");
        if (modal) PMS.closeModal(modal.id);
      }
      form.reset();
    });
  }

  function bindToggleInputs(root) {
    (root || document).querySelectorAll(".toggle input[type=\"checkbox\"]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        if (window.PMS && PMS.toast) PMS.toast(cb.checked ? "تم التفعيل (تجريبي)" : "تم الإيقاف (تجريبي)");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindToggleInputs(document);
  });

  window.Setup = {
    escape,
    badge,
    kebab,
    crud,
    bindFormSubmit,
    bindToggleInputs,
    toast: function (m) { if (window.PMS && PMS.toast) PMS.toast(m); },
    openModal: function (id) { if (window.PMS && PMS.openModal) PMS.openModal(id); },
    closeModal: function (id) { if (window.PMS && PMS.closeModal) PMS.closeModal(id); },
  };
})();