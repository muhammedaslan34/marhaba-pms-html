/**
 * Solvfast PMS — shared shell & interactions
 */
(function () {
  const NAV = [
    { group: null, id: "dashboard", href: "dashboard.html", label: "الرئيسية", icon: "home" },
    { group: "عمليات اليوم", id: "reservations", href: "reservations.html", label: "الحجوزات", icon: "calendar" },
    { group: null, id: "checkin", href: "checkin.html", label: "الوصول والمغادرة", icon: "door" },
    { group: null, id: "guests", href: "guests.html", label: "النزلاء", icon: "users" },
    { group: null, id: "availability", href: "availability.html", label: "التوفر", icon: "grid" },
    { group: null, id: "housekeeping", href: "housekeeping.html", label: "التدبير الفندقي", icon: "sparkles" },
    { group: "المالية", id: "payments", href: "payments.html", label: "الدفعات", icon: "wallet" },
    { group: null, id: "cashier", href: "cashier.html", label: "الصندوق والورديات", icon: "cash" },
    { group: null, id: "reports", href: "reports.html", label: "التقارير", icon: "chart" },
    { group: "الإدارة", id: "settings", href: "settings.html", label: "الإعدادات", icon: "settings" },
  ];

  const USER = { name: "محمد العبدالله", role: "مدير عام", email: "manager@solvfast.com", initial: "م" };

  const PROPERTIES = [
    { id: "madinah1", name: "فندق المدينة بلازا", code: "MADINAH1" },
    { id: "riyadh1", name: "فندق الرياض جراند", code: "RIYADH1" },
    { id: "jeddah1", name: "فندق جدة رويال", code: "JEDDAH1" },
    { id: "makkah1", name: "فندق مكة السلام", code: "MAKKAH1" },
  ];

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    door: '<path d="M5 21V5a2 2 0 0 1 2-2h7v18H7a2 2 0 0 1-2-2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M14 3h3a2 2 0 0 1 2 2v16M12 12h.01" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    users: '<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5M16 8a2.5 2.5 0 1 0 0-5M21 19c0-2.2-1.8-4-4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    sparkles: '<path d="M12 3l1.2 4.2L17.5 8.5 13.2 9.8 12 14l-1.2-4.2L6.5 8.5l4.3-1.3L12 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14Z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18M16 14.5h2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    chart: '<path d="M4 19V5M4 19h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 15v-4M12 15V8M16 15v-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    settings: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  };

  function icon(name) {
    return `<svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  function isMac() {
    return /Mac|iPhone|iPad|iPod/.test(navigator.platform || "") ||
      /Mac OS/.test(navigator.userAgent || "");
  }

  function shortcutLabel() {
    return isMac() ? "⌘K" : "Ctrl+K";
  }

  function renderSidebar(active) {
    let html = `
      <div class="sidebar-brand">
        <div class="sidebar-brand-mark">S</div>
        <div class="sidebar-brand-text flex-1 min-w-0">
          <div class="font-extrabold text-[0.95rem] leading-tight">Solvfast PMS</div>
          <div class="text-[11px] text-white/70 font-semibold mt-0.5">إدارة الفندق</div>
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="القائمة الرئيسية">`;

    let lastGroup = undefined;
    NAV.forEach((item) => {
      if (item.group && item.group !== lastGroup) {
        html += `<div class="nav-group">${item.group}</div>`;
        lastGroup = item.group;
      } else if (!item.group && lastGroup === undefined) {
        lastGroup = null;
      }
      const activeClass = item.id === active ? " is-active" : "";
      html += `<a class="sidebar-link${activeClass}" href="${item.href}" data-nav="${item.id}" title="${item.label}">${icon(item.icon)}<span>${item.label}</span></a>`;
    });

    html += `</nav>`;
    return html;
  }

  function renderHeader(opts) {
    const title = opts.title || "";
    const crumbs = opts.crumbs || [];
    // Parents only — last crumb often duplicates the page title (e.g. الدفعات / المدفوعات)
    const parents = crumbs.slice(0, Math.max(0, crumbs.length - 1));
    const parentHtml = parents
      .map((c) => {
        if (c.href) {
          return `<a href="${c.href}" class="header-crumb-link">${c.label}</a><span class="header-crumb-sep">/</span>`;
        }
        return `<span class="header-crumb-muted">${c.label}</span><span class="header-crumb-sep">/</span>`;
      })
      .join("");

    const theme = getStoredTheme();
    const lang = getStoredLang();
    const themeIcon =
      theme === "dark"
        ? `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>`
        : `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" stroke-linejoin="round"/></svg>`;
    const langIcon = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" stroke-linecap="round"/></svg>`;

    return `
      <div class="flex items-center gap-3 min-w-0">
        <button type="button" class="lg:hidden btn btn-ghost btn-sm" data-action="toggle-sidebar" aria-label="القائمة">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>
        </button>
        <button type="button" class="hidden lg:inline-flex btn btn-ghost btn-sm !px-2.5" data-action="collapse-sidebar" aria-label="طي الشريط الجانبي" title="طي / توسيع القائمة">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10M4 18h16" stroke-linecap="round"/><path d="m15 9 3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <nav class="header-crumbs min-w-0" aria-label="مسار الصفحة">
          ${parentHtml}
          <h1 class="header-crumb-current">${title || (crumbs[crumbs.length - 1] && crumbs[crumbs.length - 1].label) || "PMS"}</h1>
        </nav>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <label class="search-field" for="global-search">
          <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>
          <input id="global-search" type="search" placeholder="بحث…" aria-label="بحث عام" />
          <kbd class="search-kbd" aria-hidden="true">${shortcutLabel()}</kbd>
        </label>
        <div class="relative">
          <button type="button" class="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-semibold" data-action="toggle-property-menu" aria-haspopup="menu" aria-label="المنشأة" title="تبديل المنشأة">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="truncate max-w-[9rem]" data-property-badge>${currentProperty().name}</span>
            <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div id="property-menu" class="hidden absolute end-0 mt-2 w-64 panel p-2 z-50">
            <div class="px-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wide mb-1">المنشأة</div>
            <div class="space-y-0.5 max-h-64 overflow-y-auto" data-property-list>${propertyListHtml()}</div>
          </div>
        </div>
        <div class="header-switchers">
          <button type="button" class="header-icon-btn" data-action="toggle-lang" aria-label="${lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}" title="${lang === "en" ? "English → العربية" : "العربية → English"}">
            ${langIcon}
          </button>
          <button type="button" class="header-icon-btn" data-action="toggle-theme" aria-label="${theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}" title="${theme === "dark" ? "Light mode" : "Dark mode"}">
            ${themeIcon}
          </button>
        </div>
        <a href="reservation-new.html" class="btn btn-primary btn-sm">حجز جديد</a>
        <button type="button" class="relative btn btn-ghost btn-sm !px-2.5" data-action="toggle-notifications" aria-label="الإشعارات">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 19a2 2 0 0 0 4 0" stroke-linecap="round"/></svg>
          <span class="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </button>
        <div class="relative">
          <button type="button" class="w-10 h-10 rounded-full bg-primary text-white font-extrabold text-sm shadow-md shadow-primary/25" data-action="toggle-user-menu" aria-label="حساب المستخدم">${USER.initial}</button>
          <div id="user-menu" class="hidden absolute end-0 mt-2 w-72 panel p-2 z-50">
            <div class="px-3 py-2.5 border-b border-slate-100 mb-1">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-primary text-white font-extrabold text-sm grid place-items-center shrink-0">${USER.initial}</div>
                <div class="min-w-0">
                  <div class="font-extrabold text-sm truncate">${USER.name}</div>
                  <div class="text-xs text-slate-500 truncate font-semibold">${USER.role}</div>
                </div>
              </div>
              <div class="text-xs text-slate-400 truncate font-semibold mt-1.5">${USER.email}</div>
            </div>
            <div class="px-1 pt-1.5 pb-1">
              <div class="px-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wide mb-1">المنشأة</div>
              <div class="space-y-0.5 max-h-52 overflow-y-auto" data-property-list>
                ${propertyListHtml()}
              </div>
            </div>
            <div class="border-t border-slate-100 mt-1 pt-1">
              <a href="settings.html" class="block px-3 py-2 text-sm rounded-lg hover:bg-primary-soft font-semibold text-slate-700">الإعدادات</a>
              <a href="login.html" class="block px-3 py-2 text-sm rounded-lg hover:bg-red-50 font-semibold text-red-600">تسجيل الخروج</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem("pms-theme") === "dark" ? "dark" : "light";
    } catch (_) {
      return "light";
    }
  }

  function getStoredLang() {
    try {
      return localStorage.getItem("pms-lang") === "en" ? "en" : "ar";
    } catch (_) {
      return "ar";
    }
  }

  function currentProperty() {
    let id = null;
    try {
      id = localStorage.getItem("pms-property");
    } catch (_) {}
    return PROPERTIES.find(function (p) { return p.id === id; }) || PROPERTIES[0];
  }

  function propertyListHtml() {
    const currentId = currentProperty().id;
    return PROPERTIES.map(function (p) {
      const sel = p.id === currentId;
      return (
        '<button type="button" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors ' +
        (sel ? 'bg-primary-soft text-primary' : 'text-slate-700 hover:bg-slate-50') +
        '" data-action="select-property" data-property-id="' + p.id + '">' +
          '<span class="w-2 h-2 rounded-full ' + (sel ? 'bg-emerald-500' : 'bg-slate-300') + ' shrink-0"></span>' +
          '<span class="flex-1 text-start truncate">' + p.name + '</span>' +
          '<span class="text-[11px] text-slate-400 font-bold">' + p.code + '</span>' +
          (sel ? '<svg class="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') +
        '</button>'
      );
    }).join('');
  }

  function selectProperty(id) {
    const exists = PROPERTIES.some(function (p) { return p.id === id; });
    if (!exists) return;
    try {
      localStorage.setItem("pms-property", id);
    } catch (_) {}
    const prop = PROPERTIES.find(function (p) { return p.id === id; });
    // Update header badge text + re-render property lists (moves the green dot)
    document.querySelectorAll("[data-property-badge]").forEach(function (el) {
      el.textContent = prop.name;
    });
    document.querySelectorAll("[data-property-list]").forEach(function (el) {
      el.innerHTML = propertyListHtml();
    });
    toast("تم التبديل إلى " + prop.name);
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("pms-theme", dark ? "dark" : "light");
    } catch (_) {}
  }

  function applyLang(lang) {
    const en = lang === "en";
    document.documentElement.lang = en ? "en" : "ar";
    document.documentElement.dir = en ? "ltr" : "rtl";
    try {
      localStorage.setItem("pms-lang", en ? "en" : "ar");
    } catch (_) {}
  }

  function toggleTheme() {
    const next = getStoredTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    const header = document.getElementById("app-header");
    if (header) {
      const title = document.body.dataset.title || "";
      const crumbs = JSON.parse(document.body.dataset.crumbs || "[]");
      header.innerHTML = renderHeader({ title, crumbs });
    }
    toast(next === "dark" ? "تم تفعيل الوضع الداكن" : "تم تفعيل الوضع الفاتح");
  }

  function toggleLang() {
    const next = getStoredLang() === "en" ? "ar" : "en";
    applyLang(next);
    const header = document.getElementById("app-header");
    if (header) {
      const title = document.body.dataset.title || "";
      const crumbs = JSON.parse(document.body.dataset.crumbs || "[]");
      header.innerHTML = renderHeader({ title, crumbs });
    }
    toast(next === "en" ? "Language: English" : "اللغة: العربية");
  }

  function ensureOverlay() {
    let el = document.getElementById("app-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "app-overlay";
      el.className = "overlay";
      el.addEventListener("click", () => {
        closeSidebar();
        closeAllModals();
        closeDrawer();
      });
      document.body.appendChild(el);
    }
    return el;
  }

  function ensureToastStack() {
    let el = document.getElementById("toast-stack");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-stack";
      el.className = "toast-stack";
      document.body.appendChild(el);
    }
    return el;
  }

  function openOverlay() {
    ensureOverlay().classList.add("is-open");
  }

  function closeOverlayIfIdle() {
    const sidebarOpen = document.getElementById("app-sidebar")?.classList.contains("is-open");
    const modalOpen = document.querySelector(".modal.is-open");
    const drawerOpen = document.querySelector(".drawer.is-open");
    if (!sidebarOpen && !modalOpen && !drawerOpen) {
      ensureOverlay().classList.remove("is-open");
    }
  }

  function openSidebar() {
    document.getElementById("app-sidebar")?.classList.add("is-open");
    openOverlay();
  }

  function closeSidebar() {
    document.getElementById("app-sidebar")?.classList.remove("is-open");
    closeOverlayIfIdle();
  }

  function toggleMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    if (sidebar.classList.contains("is-open")) closeSidebar();
    else openSidebar();
  }

  function applyCollapsedState(collapsed) {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("is-collapsed", collapsed);
    try {
      localStorage.setItem("pms-sidebar-collapsed", collapsed ? "1" : "0");
    } catch (_) {}
    document.querySelectorAll('[data-action="collapse-sidebar"]').forEach((btn) => {
      btn.setAttribute("aria-pressed", collapsed ? "true" : "false");
      btn.title = collapsed ? "توسيع القائمة" : "طي القائمة";
    });
  }

  function toggleCollapseSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    applyCollapsedState(!sidebar.classList.contains("is-collapsed"));
  }

  function focusGlobalSearch() {
    const input = document.getElementById("global-search");
    if (!input) return;
    input.focus();
    input.select();
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach((m) => m.classList.remove("is-open"));
    closeOverlayIfIdle();
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("is-open");
    openOverlay();
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("is-open");
    closeOverlayIfIdle();
  }

  function openDrawer(id) {
    document.getElementById(id)?.classList.add("is-open");
    openOverlay();
  }

  function closeDrawer() {
    document.querySelectorAll(".drawer.is-open").forEach((d) => d.classList.remove("is-open"));
    closeOverlayIfIdle();
  }

  function toast(message) {
    const stack = ensureToastStack();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 200);
    }, 2800);
  }

  function initChips() {
    document.querySelectorAll("[data-chip-group]").forEach((group) => {
      group.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip || !group.contains(chip)) return;
        if (group.dataset.chipGroup === "multi") {
          chip.classList.toggle("is-active");
        } else {
          group.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
          chip.classList.add("is-active");
        }
      });
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((root) => {
      const buttons = root.querySelectorAll("[data-tab]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.tab;
          buttons.forEach((b) => {
            const active = b === btn;
            b.classList.toggle("is-active", active);
            if (b.classList.contains("btn")) {
              b.classList.toggle("btn-secondary", active);
              b.classList.toggle("btn-ghost", !active);
            }
          });
          root.querySelectorAll("[data-tab-panel]").forEach((panel) => {
            panel.classList.toggle("hidden", panel.dataset.tabPanel !== id);
          });
        });
      });
    });
  }

  function initShell() {
    const page = document.body.dataset.page || "dashboard";
    const title = document.body.dataset.title || "";
    const crumbs = JSON.parse(document.body.dataset.crumbs || "[]");

    const sidebar = document.getElementById("app-sidebar");
    const header = document.getElementById("app-header");
    if (sidebar) {
      sidebar.className = "sidebar fixed lg:static inset-y-0 start-0 z-[45] flex flex-col shrink-0";
      sidebar.innerHTML = renderSidebar(page);
      let collapsed = false;
      try {
        collapsed = localStorage.getItem("pms-sidebar-collapsed") === "1";
      } catch (_) {}
      if (collapsed) sidebar.classList.add("is-collapsed");
    }
    if (header) {
      header.className = "app-header sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6";
      applyTheme(getStoredTheme());
      applyLang(getStoredLang());
      header.innerHTML = renderHeader({ title, crumbs });
    }

    ensureOverlay();
    ensureToastStack();
    initChips();
    initTabs();

    document.body.addEventListener("click", (e) => {
      const actionEl = e.target.closest("[data-action]");
      if (!actionEl) {
        if (!e.target.closest("#user-menu") && !e.target.closest('[data-action="toggle-user-menu"]')) {
          document.getElementById("user-menu")?.classList.add("hidden");
        }
        if (!e.target.closest("#property-menu") && !e.target.closest('[data-action="toggle-property-menu"]')) {
          document.getElementById("property-menu")?.classList.add("hidden");
        }
        return;
      }
      const action = actionEl.dataset.action;
      if (action === "toggle-sidebar") toggleMobileSidebar();
      if (action === "collapse-sidebar") toggleCollapseSidebar();
      if (action === "close-sidebar") closeSidebar();
      if (action === "toggle-user-menu") {
        document.getElementById("property-menu")?.classList.add("hidden");
        document.getElementById("user-menu")?.classList.toggle("hidden");
      }
      if (action === "toggle-property-menu") {
        document.getElementById("user-menu")?.classList.add("hidden");
        document.getElementById("property-menu")?.classList.toggle("hidden");
      }
      if (action === "select-property") {
        selectProperty(actionEl.dataset.propertyId);
        document.getElementById("user-menu")?.classList.add("hidden");
        document.getElementById("property-menu")?.classList.add("hidden");
      }
      if (action === "toggle-notifications") toast("لا توجد إشعارات جديدة");
      if (action === "toggle-theme") toggleTheme();
      if (action === "toggle-lang") toggleLang();
      if (action === "open-modal") openModal(actionEl.dataset.target);
      if (action === "close-modal") closeModal(actionEl.dataset.target);
      if (action === "open-drawer") openDrawer(actionEl.dataset.target);
      if (action === "close-drawer") closeDrawer();
      if (action === "toast") toast(actionEl.dataset.message || "تم");
      if (action === "prevent") e.preventDefault();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSidebar();
        closeAllModals();
        closeDrawer();
        document.getElementById("user-menu")?.classList.add("hidden");
        document.getElementById("property-menu")?.classList.add("hidden");
        document.getElementById("global-search")?.blur();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        focusGlobalSearch();
      }
    });

    enhanceSearchFields();
  }

  function enhanceSearchFields() {
    const iconHtml =
      '<svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>';

    document.querySelectorAll('input[type="search"]').forEach((input) => {
      if (input.closest(".search-field")) return;

      const parent = input.parentElement;
      if (!parent) return;

      // Already wrapped with our class
      if (parent.classList.contains("search-input")) {
        if (!parent.querySelector(".search-input-icon, :scope > svg")) {
          parent.insertAdjacentHTML("afterbegin", iconHtml);
        }
        return;
      }

      // Parent already has a leading SVG icon (manual markup)
      const leadingSvg = Array.from(parent.children).find(
        (el) => el.tagName === "SVG" && el !== input
      );
      if (leadingSvg && (parent.classList.contains("relative") || getComputedStyle(parent).position !== "static")) {
        parent.classList.add("search-input");
        leadingSvg.classList.add("search-input-icon");
        return;
      }

      const wrap = document.createElement("div");
      wrap.className = "search-input";

      // Preserve sizing utilities that belonged on the input
      ["sm:max-w-xs", "max-w-xs", "hk-search", "w-full"].forEach((cls) => {
        if (input.classList.contains(cls)) {
          wrap.classList.add(cls);
          if (cls !== "w-full" && cls !== "hk-search") input.classList.remove(cls);
        }
      });

      parent.insertBefore(wrap, input);
      wrap.insertAdjacentHTML("afterbegin", iconHtml);
      wrap.appendChild(input);
    });
  }

  window.PMS = {
    toast,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    initShell,
  };

  document.addEventListener("DOMContentLoaded", initShell);
})();
