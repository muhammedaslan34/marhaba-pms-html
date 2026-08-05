/**
 * Generate all pages/setup-*.html (Arabic-only static PMS setup screens).
 * Run: node scripts/generate-setup-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "pages");

function shell(opts) {
  const {
    id,
    title,
    kicker,
    subtitle,
    crumbs,
    body,
    modals = "",
    script = "",
  } = opts;
  const crumbsJson = JSON.stringify(crumbs).replace(/'/g, "&#39;");
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Marhaba PMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { primary: { DEFAULT: '#0027B7', soft: '#EEF2FF' }, secondary: '#079DD8' },
          fontFamily: { sans: ['Cairo', 'sans-serif'] },
        },
      },
    };
  </script>
  <link rel="stylesheet" href="../assets/css/app.css?v=setup1" />
</head>
<body class="app-bg font-sans" data-page="${id}" data-title="${title}"
  data-crumbs='${crumbsJson}'>
  <div class="min-h-screen lg:flex">
    <aside id="app-sidebar"></aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <header id="app-header"></header>
      <main class="flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
        <div class="page-hero">
          <div>
            <p class="page-kicker">${kicker}</p>
            <p class="text-slate-800 font-extrabold mt-1 text-lg">${subtitle}</p>
          </div>
          ${opts.heroActions || ""}
        </div>
        ${body}
      </main>
    </div>
  </div>
  ${modals}
  <script src="../assets/js/pms-data.js"></script>
  <script src="../assets/js/app.js?v=setup1"></script>
  <script src="../assets/js/setup-pages.js?v=setup1"></script>
  <script>
${script}
  </script>
</body>
</html>
`;
}

function crumbs(title) {
  return [
    { label: "PMS", href: "dashboard.html" },
    { label: "التهيئة", href: "setup.html" },
    { label: title },
  ];
}

function addBtn(label, modalId) {
  return `<button type="button" class="btn btn-primary" data-action="open-modal" data-target="${modalId}">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
            ${label}
          </button>`;
}

function filters(searchId, extras = "") {
  return `<section class="panel p-4">
          <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div class="flex-1">
              <label class="field-label" for="${searchId}">بحث</label>
              <div class="search-input">
                <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>
                <input type="search" id="${searchId}" class="field-input" placeholder="ابحث…" />
              </div>
            </div>
            ${extras}
          </div>
        </section>`;
}

function tableBlock(thead, tbodyId) {
  return `<section class="panel overflow-hidden">
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr>${thead.map((h) => `<th>${h}</th>`).join("")}<th class="text-center">إجراءات</th></tr></thead>
              <tbody id="${tbodyId}"></tbody>
            </table>
          </div>
          <div id="${tbodyId}-empty" class="empty-state hidden p-8 text-center">
            <p class="font-extrabold" data-empty-title>لا توجد عناصر بعد</p>
            <p class="text-sm text-slate-500 mt-1" data-empty-desc>ابدأ بإضافة أول عنصر.</p>
          </div>
          <div class="px-4 py-3 border-t border-slate-100 text-sm text-slate-500">المعروض: <span data-visible-count>0</span></div>
        </section>`;
}

function modal(id, title, fieldsHtml) {
  return `<div id="${id}" class="modal">
  <div class="p-5 border-b border-slate-200 flex justify-between items-center">
    <h3 class="font-extrabold">${title}</h3>
    <button class="icon-btn" title="إغلاق" aria-label="إغلاق" data-action="close-modal" data-target="${id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>
    </button>
  </div>
  <form id="${id}-form" class="p-5 space-y-4">
    ${fieldsHtml}
    <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
      <button type="button" class="btn btn-ghost" data-action="close-modal" data-target="${id}">إلغاء</button>
      <button type="submit" class="btn btn-primary">حفظ</button>
    </div>
  </form>
</div>`;
}

function field(label, inputHtml) {
  return `<div><label class="field-label">${label}</label>${inputHtml}</div>`;
}

function statusBadge(key) {
  return `function(r){return Setup.badge(r.${key}, r.${key}==='نشط'||r.${key}==='مفعّل'?'badge-success':(r.${key}==='معطّل'||r.${key}==='غير مفعّل'?'badge-danger':'badge-neutral'));}`;
}

function listPage(cfg) {
  const modalId = cfg.modalId || "setup-item-modal";
  const searchId = cfg.searchId || "setup-search";
  const tbodyId = cfg.tbodyId || "setup-tbody";
  const fields = (cfg.fields || [])
    .map((f) => {
      if (f.type === "select") {
        const opts = (f.options || []).map((o) => `<option>${o}</option>`).join("");
        return field(f.label, `<select class="field-select" name="${f.name}">${opts}</select>`);
      }
      if (f.type === "textarea") {
        return field(f.label, `<textarea class="field-input" name="${f.name}" rows="3" placeholder="${f.placeholder || ""}"></textarea>`);
      }
      if (f.type === "toggle") {
        return `<div class="flex items-center justify-between gap-3 py-1"><div><div class="font-semibold text-sm">${f.label}</div></div><label class="toggle"><input type="checkbox" name="${f.name}" checked /><span></span></label></div>`;
      }
      return field(
        f.label,
        `<input class="field-input" name="${f.name}" type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} />`
      );
    })
    .join("\n    ");

  const filterExtras = cfg.statusFilter
    ? `<div class="w-full sm:w-44">
              <label class="field-label" for="setup-status">الحالة</label>
              <select id="setup-status" class="field-select"><option value="all">الكل</option><option>نشط</option><option>معطّل</option></select>
            </div>`
    : "";

  const colDefs = cfg.columns
    .map((c) => {
      if (c.badge) return `{ key: '${c.key}', label: '${c.label}', render: ${statusBadge(c.key)} }`;
      return `{ key: '${c.key}', label: '${c.label}' }`;
    })
    .join(",\n        ");

  const rowsJs = JSON.stringify(cfg.rows, null, 2);

  return shell({
    id: cfg.id,
    title: cfg.title,
    kicker: cfg.kicker || "التهيئة",
    subtitle: cfg.subtitle,
    crumbs: crumbs(cfg.title),
    heroActions: addBtn(cfg.addLabel || "إضافة", modalId),
    body: `${filters(searchId, filterExtras)}\n        ${tableBlock(
      cfg.columns.map((c) => c.label),
      tbodyId
    )}`,
    modals: modal(modalId, cfg.addLabel || "إضافة", fields),
    script: `    Setup.crud({
      table: '${tbodyId}',
      search: '${searchId}',
      empty: '${tbodyId}-empty',
      rows: ${rowsJs},
      columns: [
        ${colDefs}
      ]${
        cfg.statusFilter
          ? `,
      filters: [{ id: 'setup-status', value: function(row, sel){ return row.status === sel; } }]`
          : ""
      }
    });
    Setup.bindFormSubmit('${modalId}-form', 'تم الحفظ (تجريبي)');`,
  });
}

function formPage(cfg) {
  const groups = (cfg.groups || [])
    .map((g) => {
      const fields = g.fields
        .map((f) => {
          if (f.type === "toggle") {
            return `<div class="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
              <div><div class="font-semibold">${f.label}</div>${f.hint ? `<div class="text-sm text-slate-500">${f.hint}</div>` : ""}</div>
              <label class="toggle"><input type="checkbox" ${f.checked === false ? "" : "checked"} /><span></span></label>
            </div>`;
          }
          if (f.type === "select") {
            const opts = (f.options || []).map((o) => `<option ${o === f.value ? "selected" : ""}>${o}</option>`).join("");
            return field(f.label, `<select class="field-select">${opts}</select>`);
          }
          if (f.type === "textarea") {
            return field(f.label, `<textarea class="field-input" rows="4">${f.value || ""}</textarea>`);
          }
          return field(
            f.label,
            `<input class="field-input" type="${f.type || "text"}" value="${f.value || ""}" placeholder="${f.placeholder || ""}" />`
          );
        })
        .join("\n            ");
      return `<section class="panel p-5 space-y-4">
          <div>
            <h2 class="font-extrabold text-lg">${g.title}</h2>
            ${g.desc ? `<p class="text-sm text-slate-500">${g.desc}</p>` : ""}
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            ${fields}
          </div>
        </section>`;
    })
    .join("\n\n        ");

  return shell({
    id: cfg.id,
    title: cfg.title,
    kicker: cfg.kicker || "التهيئة",
    subtitle: cfg.subtitle,
    crumbs: crumbs(cfg.title),
    heroActions: `<button type="button" class="btn btn-primary" data-action="toast" data-message="تم حفظ الإعدادات (تجريبي)">حفظ الإعدادات</button>`,
    body: groups,
    script: `    /* settings form — mutations simulated via toasts */`,
  });
}

const pages = {};

// Landing
pages["setup.html"] = shell({
  id: "setup",
  title: "التهيئة",
  kicker: "إعداد المنشأة",
  subtitle: "أكمل إعدادات المنشأة من الأقسام التالية",
  crumbs: [
    { label: "PMS", href: "dashboard.html" },
    { label: "التهيئة" },
  ],
  heroActions: "",
  body: `<section class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          ${[
            ["الشركة", "المنشآت، المعلومات، المستخدمون والأدوار", "setup-properties.html"],
            ["البلوكات والطوابق", "هيكل المبنى والوحدات", "setup-blocks.html"],
            ["الوحدات والأسعار", "الأنواع، المرافق، الأسعار وخطط الأسعار", "setup-unit-setup.html"],
            ["المالية", "البنوك، الضرائب، العملات وطرق الدفع", "setup-bank-accounts.html"],
            ["إعدادات عامة", "التاريخ، المصادر، الولاء والرسائل", "setup-date-time-settings.html"],
            ["التقارير والطباعة", "الترقيم وخيارات الطباعة", "setup-numbering-options.html"],
            ["المنافذ", "تهيئة المنافذ والأصناف", "setup-outlet-setup.html"],
            ["القواعد", "الشروط، الغرامات وقواعد الحجز", "setup-terms-conditions.html"],
            ["التدبير الفندقي", "المنظفون وأنواع المهام", "setup-housekeepers.html"],
            ["الاشتراكات", "الخدمات والتكاملات", "setup-subscriptions.html"],
            ["مستلزمات النزلاء", "الفئات والاستخدامات", "setup-guest-supplies.html"],
          ]
            .map(
              ([t, d, href]) => `<a href="${href}" class="panel p-5 hover:border-primary transition block">
            <h3 class="font-extrabold text-base">${t}</h3>
            <p class="text-sm text-slate-500 mt-1">${d}</p>
          </a>`
            )
            .join("\n          ")}
        </section>`,
  script: "",
});

// Company
pages["setup-properties.html"] = listPage({
  id: "setup-properties",
  title: "المنشآت",
  kicker: "الشركة",
  subtitle: "إدارة منشآت الشركة وربطها بالنظام",
  addLabel: "إضافة منشأة",
  statusFilter: true,
  columns: [
    { key: "name", label: "الاسم" },
    { key: "code", label: "الرمز" },
    { key: "city", label: "المدينة" },
    { key: "type", label: "النوع" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "حمص الحديثة", code: "HOMS1", city: "حمص", type: "فندق", status: "نشط" },
    { name: "حلب بلازا", code: "HALEP1", city: "حلب", type: "فندق", status: "نشط" },
    { name: "دمشق سنتر", code: "DAM1", city: "دمشق", type: "شقق فندقية", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "اسم المنشأة *", required: true, placeholder: "مثال: فندق المطار" },
    { name: "code", label: "الرمز *", required: true, placeholder: "HOMS2" },
    { name: "city", label: "المدينة", placeholder: "حمص" },
    { name: "type", label: "النوع", type: "select", options: ["فندق", "شقق فندقية", "منتجع"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-property-info.html"] = formPage({
  id: "setup-property-info",
  title: "معلومات المنشأة",
  kicker: "الشركة",
  subtitle: "البيانات التجارية وتفاصيل المنشأة",
  groups: [
    {
      title: "التفاصيل التجارية",
      desc: "أرقام التسجيل والترخيص والضريبة",
      fields: [
        { label: "رقم السجل التجاري *", value: "1234567890" },
        { label: "رقم رخصة النشاط", value: "LIC-99881" },
        { label: "الرقم الضريبي", value: "3100000000" },
        { label: "ملف السجل التجاري", type: "text", placeholder: "ارفع الملف…" },
      ],
    },
    {
      title: "تفاصيل المنشأة",
      fields: [
        { label: "تصنيف المنشأة", type: "select", options: ["غير مصنّف", "نجمة", "نجمتان", "ثلاث نجوم", "أربع نجوم", "خمس نجوم"], value: "ثلاث نجوم" },
        { label: "وصف المنشأة", type: "textarea", value: "منشأة فندقية حديثة في قلب المدينة." },
        { label: "الهاتف", value: "+963 31 000000" },
        { label: "البريد الإلكتروني", value: "info@property.sy" },
      ],
    },
  ],
});

pages["setup-users.html"] = listPage({
  id: "setup-users",
  title: "مستخدمو التهيئة",
  kicker: "الشركة",
  subtitle: "مستخدمو النظام المرتبطون بالمنشأة",
  addLabel: "إضافة مستخدم",
  statusFilter: true,
  columns: [
    { key: "name", label: "الاسم" },
    { key: "email", label: "البريد" },
    { key: "role", label: "الدور" },
    { key: "property", label: "المنشأة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "محمد أصلان", email: "m.aslan@demo.sy", role: "مدير النظام", property: "حمص الحديثة", status: "نشط" },
    { name: "سارة أحمد", email: "sara@demo.sy", role: "استقبال", property: "حمص الحديثة", status: "نشط" },
    { name: "خالد عمر", email: "khaled@demo.sy", role: "محاسب", property: "حلب بلازا", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "الاسم الكامل *", required: true },
    { name: "email", label: "البريد *", required: true, type: "email" },
    { name: "role", label: "الدور", type: "select", options: ["مدير النظام", "استقبال", "محاسب", "تدبير فندقي"] },
    { name: "property", label: "المنشأة", type: "select", options: ["حمص الحديثة", "حلب بلازا"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-roles.html"] = listPage({
  id: "setup-roles",
  title: "الأدوار",
  kicker: "الشركة",
  subtitle: "تعريف أدوار المستخدمين وصلاحياتهم",
  addLabel: "إضافة دور",
  columns: [
    { key: "name", label: "اسم الدور" },
    { key: "users", label: "عدد المستخدمين" },
    { key: "scope", label: "النطاق" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "مدير النظام", users: "2", scope: "كل المنشآت", status: "نشط" },
    { name: "استقبال", users: "5", scope: "منشأة واحدة", status: "نشط" },
    { name: "محاسب", users: "3", scope: "منشأة واحدة", status: "نشط" },
    { name: "تدبير فندقي", users: "4", scope: "منشأة واحدة", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "اسم الدور *", required: true },
    { name: "scope", label: "النطاق", type: "select", options: ["كل المنشآت", "منشأة واحدة"] },
    { name: "desc", label: "الوصف", type: "textarea" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Blocks & floors
pages["setup-blocks.html"] = listPage({
  id: "setup-blocks",
  title: "البلوكات",
  kicker: "البلوكات والطوابق",
  subtitle: "تعريف بلوكات المبنى",
  addLabel: "إضافة بلوك",
  columns: [
    { key: "name", label: "اسم البلوك" },
    { key: "code", label: "الرمز" },
    { key: "floors", label: "عدد الطوابق" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "البلوك أ", code: "A", floors: "5", status: "نشط" },
    { name: "البلوك ب", code: "B", floors: "4", status: "نشط" },
    { name: "البلوك ج", code: "C", floors: "3", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "اسم البلوك *", required: true },
    { name: "code", label: "الرمز *", required: true },
    { name: "floors", label: "عدد الطوابق", type: "number", placeholder: "5" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-floors.html"] = listPage({
  id: "setup-floors",
  title: "الطوابق",
  kicker: "البلوكات والطوابق",
  subtitle: "إدارة طوابق كل بلوك",
  addLabel: "إضافة طابق",
  columns: [
    { key: "name", label: "اسم الطابق" },
    { key: "block", label: "البلوك" },
    { key: "order", label: "الترتيب" },
    { key: "units", label: "عدد الوحدات" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "الطابق الأرضي", block: "البلوك أ", order: "0", units: "8", status: "نشط" },
    { name: "الطابق 1", block: "البلوك أ", order: "1", units: "12", status: "نشط" },
    { name: "الطابق 2", block: "البلوك ب", order: "2", units: "10", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "اسم الطابق *", required: true },
    { name: "block", label: "البلوك", type: "select", options: ["البلوك أ", "البلوك ب", "البلوك ج"] },
    { name: "order", label: "الترتيب", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Units
pages["setup-unit-type-customization.html"] = listPage({
  id: "setup-unit-type-customization",
  title: "تخصيص الأنواع",
  kicker: "الوحدات",
  subtitle: "تخصيص أنواع الوحدات وطاقاتها",
  addLabel: "إضافة نوع",
  columns: [
    { key: "name", label: "النوع" },
    { key: "code", label: "الرمز" },
    { key: "adults", label: "بالغون" },
    { key: "children", label: "أطفال" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "غرفة مفردة", code: "SGL", adults: "1", children: "0", status: "نشط" },
    { name: "غرفة مزدوجة", code: "DBL", adults: "2", children: "1", status: "نشط" },
    { name: "جناح", code: "STE", adults: "3", children: "2", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "اسم النوع *", required: true },
    { name: "code", label: "الرمز *", required: true },
    { name: "adults", label: "البالغون", type: "number" },
    { name: "children", label: "الأطفال", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-unit-amenities.html"] = listPage({
  id: "setup-unit-amenities",
  title: "مرافق الوحدات",
  kicker: "الوحدات",
  subtitle: "المرافق المتاحة داخل الوحدات",
  addLabel: "إضافة مرفق",
  columns: [
    { key: "name", label: "المرفق" },
    { key: "category", label: "الفئة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "تكييف", category: "راحة", status: "نشط" },
    { name: "واي فاي", category: "تقني", status: "نشط" },
    { name: "ميني بار", category: "خدمة", status: "نشط" },
    { name: "شرفة", category: "إطلالة", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "اسم المرفق *", required: true },
    { name: "category", label: "الفئة", type: "select", options: ["راحة", "تقني", "خدمة", "إطلالة"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-unit-setup.html"] = listPage({
  id: "setup-unit-setup",
  title: "تهيئة الوحدات",
  kicker: "الوحدات",
  subtitle: "إنشاء وربط الوحدات بالبلوك والطابق والنوع",
  addLabel: "إضافة وحدة",
  columns: [
    { key: "number", label: "رقم الوحدة" },
    { key: "type", label: "النوع" },
    { key: "block", label: "البلوك" },
    { key: "floor", label: "الطابق" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { number: "101", type: "مزدوجة", block: "أ", floor: "1", status: "نشط" },
    { number: "102", type: "مفردة", block: "أ", floor: "1", status: "نشط" },
    { number: "201", type: "جناح", block: "ب", floor: "2", status: "نشط" },
    { number: "202", type: "مزدوجة", block: "ب", floor: "2", status: "معطّل" },
  ],
  fields: [
    { name: "number", label: "رقم الوحدة *", required: true },
    { name: "type", label: "النوع", type: "select", options: ["مفردة", "مزدوجة", "جناح"] },
    { name: "block", label: "البلوك", type: "select", options: ["أ", "ب", "ج"] },
    { name: "floor", label: "الطابق", type: "select", options: ["الأرضي", "1", "2", "3"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-unit-merge-settings.html"] = formPage({
  id: "setup-unit-merge-settings",
  title: "إعدادات الدمج",
  kicker: "الوحدات",
  subtitle: "قواعد دمج الوحدات المتجاورة",
  groups: [
    {
      title: "قواعد الدمج",
      fields: [
        { label: "السماح بدمج الوحدات", type: "toggle", checked: true, hint: "تمكين دمج وحدتين أو أكثر في حجز واحد" },
        { label: "يجب أن تكون على نفس الطابق", type: "toggle", checked: true },
        { label: "يجب أن تكون من نفس النوع", type: "toggle", checked: false },
        { label: "الحد الأقصى للوحدات المدمجة", type: "number", value: "3" },
      ],
    },
  ],
});

pages["setup-base-rate.html"] = formPage({
  id: "setup-base-rate",
  title: "السعر الأساسي",
  kicker: "الوحدات",
  subtitle: "تعيين السعر الأساسي لكل نوع وحدة",
  groups: [
    {
      title: "أسعار الأنواع",
      desc: "العملة الافتراضية: ل.س",
      fields: [
        { label: "غرفة مفردة", type: "number", value: "150000" },
        { label: "غرفة مزدوجة", type: "number", value: "220000" },
        { label: "جناح", type: "number", value: "450000" },
        { label: "يشمل الإفطار", type: "toggle", checked: true },
      ],
    },
  ],
});

pages["setup-seasonal-rate.html"] = listPage({
  id: "setup-seasonal-rate",
  title: "السعر الموسمي",
  kicker: "الوحدات",
  subtitle: "فترات الأسعار الموسمية",
  addLabel: "إضافة موسم",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "from", label: "من" },
    { key: "to", label: "إلى" },
    { key: "adj", label: "التعديل" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "موسم الصيف", from: "2026-06-01", to: "2026-08-31", adj: "+20%", status: "نشط" },
    { name: "موسم الشتاء", from: "2026-12-01", to: "2027-02-28", adj: "+10%", status: "نشط" },
    { name: "عروض الربيع", from: "2026-03-01", to: "2026-04-30", adj: "-5%", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "اسم الموسم *", required: true },
    { name: "from", label: "من تاريخ", type: "date" },
    { name: "to", label: "إلى تاريخ", type: "date" },
    { name: "adj", label: "نسبة التعديل %", type: "number", placeholder: "20" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-special-rate.html"] = listPage({
  id: "setup-special-rate",
  title: "السعر الخاص",
  kicker: "الوحدات",
  subtitle: "أسعار خاصة لتواريخ أو مناسبات محددة",
  addLabel: "إضافة سعر خاص",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "date", label: "التاريخ" },
    { key: "type", label: "نوع الوحدة" },
    { key: "rate", label: "السعر" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "عيد الفطر", date: "2026-03-20", type: "مزدوجة", rate: "350000", status: "نشط" },
    { name: "رأس السنة", date: "2026-12-31", type: "جناح", rate: "700000", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "date", label: "التاريخ", type: "date" },
    { name: "type", label: "نوع الوحدة", type: "select", options: ["مفردة", "مزدوجة", "جناح"] },
    { name: "rate", label: "السعر", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-rate-plans.html"] = listPage({
  id: "setup-rate-plans",
  title: "خطط الأسعار",
  kicker: "الوحدات",
  subtitle: "خطط الأسعار والوجبات المرتبطة",
  addLabel: "إضافة خطة",
  columns: [
    { key: "name", label: "الخطة" },
    { key: "meals", label: "الوجبات" },
    { key: "refund", label: "الاسترجاع" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "غرفة فقط", meals: "بدون", refund: "قابل للاسترجاع", status: "نشط" },
    { name: "إفطار", meals: "إفطار", refund: "قابل للاسترجاع", status: "نشط" },
    { name: "نصف إقامة", meals: "إفطار + عشاء", refund: "غير قابل", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "اسم الخطة *", required: true },
    { name: "meals", label: "الوجبات", type: "select", options: ["بدون", "إفطار", "إفطار + عشاء", "إقامة كاملة"] },
    { name: "refund", label: "سياسة الاسترجاع", type: "select", options: ["قابل للاسترجاع", "غير قابل"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Financial
pages["setup-bank-accounts.html"] = listPage({
  id: "setup-bank-accounts",
  title: "الحسابات البنكية",
  kicker: "المالية",
  subtitle: "حسابات البنوك المرتبطة بالمنشأة",
  addLabel: "إضافة حساب",
  columns: [
    { key: "bank", label: "البنك" },
    { key: "account", label: "رقم الحساب" },
    { key: "currency", label: "العملة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { bank: "البنك التجاري السوري", account: "001-223344", currency: "ل.س", status: "نشط" },
    { bank: "بنك بيمو", account: "99887766", currency: "د.أ", status: "نشط" },
  ],
  fields: [
    { name: "bank", label: "اسم البنك *", required: true },
    { name: "account", label: "رقم الحساب *", required: true },
    { name: "currency", label: "العملة", type: "select", options: ["ل.س", "د.أ", "يورو"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-cost-centers.html"] = listPage({
  id: "setup-cost-centers",
  title: "مراكز التكلفة",
  kicker: "المالية",
  subtitle: "مراكز التكلفة للمحاسبة الداخلية",
  addLabel: "إضافة مركز",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "code", label: "الرمز" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "الإقامة", code: "CC-ROOM", status: "نشط" },
    { name: "المطعم", code: "CC-FNB", status: "نشط" },
    { name: "الغسيل", code: "CC-LAUN", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "code", label: "الرمز *", required: true },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-security-deposit.html"] = formPage({
  id: "setup-security-deposit",
  title: "التأمينات",
  kicker: "المالية",
  subtitle: "إعدادات مبلغ التأمين على الحجوزات",
  groups: [
    {
      title: "قواعد التأمين",
      fields: [
        { label: "تفعيل التأمين", type: "toggle", checked: true },
        { label: "المبلغ الافتراضي", type: "number", value: "50000" },
        { label: "العملة", type: "select", options: ["ل.س", "د.أ"], value: "ل.س" },
        { label: "إلزامي عند تسجيل الدخول", type: "toggle", checked: true },
      ],
    },
  ],
});

pages["setup-taxes-fees.html"] = listPage({
  id: "setup-taxes-fees",
  title: "الضرائب والرسوم",
  kicker: "المالية",
  subtitle: "الضرائب والرسوم المطبقة على الحجوزات",
  addLabel: "إضافة ضريبة/رسم",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "type", label: "النوع" },
    { key: "value", label: "القيمة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "ضريبة القيمة المضافة", type: "نسبة", value: "0%", status: "نشط" },
    { name: "رسوم بلدية", type: "مبلغ ثابت", value: "5000", status: "نشط" },
    { name: "خدمة", type: "نسبة", value: "5%", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "type", label: "النوع", type: "select", options: ["نسبة", "مبلغ ثابت"] },
    { name: "value", label: "القيمة", placeholder: "5" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-currencies.html"] = listPage({
  id: "setup-currencies",
  title: "العملات",
  kicker: "المالية",
  subtitle: "العملات المعتمدة وأسعار الصرف",
  addLabel: "إضافة عملة",
  columns: [
    { key: "code", label: "الرمز" },
    { key: "name", label: "الاسم" },
    { key: "rate", label: "السعر" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { code: "SYP", name: "الليرة السورية", rate: "1", status: "نشط" },
    { code: "USD", name: "الدولار الأمريكي", rate: "0.00007", status: "نشط" },
    { code: "EUR", name: "اليورو", rate: "0.00006", status: "معطّل" },
  ],
  fields: [
    { name: "code", label: "رمز ISO *", required: true, placeholder: "USD" },
    { name: "name", label: "الاسم *", required: true },
    { name: "rate", label: "سعر الصرف", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-payment-methods.html"] = listPage({
  id: "setup-payment-methods",
  title: "طرق الدفع",
  kicker: "المالية",
  subtitle: "طرق الدفع المستخدمة في المنشأة",
  addLabel: "إضافة طريقة",
  statusFilter: true,
  columns: [
    { key: "name", label: "طريقة الدفع" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "نقداً", status: "نشط" },
    { name: "بطاقة فيزا", status: "نشط" },
    { name: "تحويل بنكي", status: "نشط" },
    { name: "شيك", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-discount-types.html"] = listPage({
  id: "setup-discount-types",
  title: "أنواع الخصم",
  kicker: "المالية",
  subtitle: "أنواع الخصومات المسموح بها",
  addLabel: "إضافة نوع خصم",
  columns: [
    { key: "name", label: "النوع" },
    { key: "mode", label: "الطريقة" },
    { key: "max", label: "الحد الأقصى" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "خصم موظف", mode: "نسبة", max: "15%", status: "نشط" },
    { name: "خصم شركة", mode: "نسبة", max: "20%", status: "نشط" },
    { name: "خصم ترويجي", mode: "مبلغ", max: "50000", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "mode", label: "الطريقة", type: "select", options: ["نسبة", "مبلغ"] },
    { name: "max", label: "الحد الأقصى", placeholder: "15" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// General
pages["setup-date-time-settings.html"] = formPage({
  id: "setup-date-time-settings",
  title: "إعدادات التاريخ والوقت",
  kicker: "إعدادات عامة",
  subtitle: "المنطقة الزمنية وأوقات الدخول والخروج",
  groups: [
    {
      title: "التوقيت",
      fields: [
        { label: "المنطقة الزمنية", type: "select", options: ["Asia/Damascus", "Asia/Riyadh", "UTC"], value: "Asia/Damascus" },
        { label: "تنسيق التاريخ", type: "select", options: ["يوم/شهر/سنة", "سنة-شهر-يوم"], value: "يوم/شهر/سنة" },
        { label: "وقت تسجيل الدخول", type: "time", value: "14:00" },
        { label: "وقت المغادرة", type: "time", value: "12:00" },
      ],
    },
  ],
});

pages["setup-reservation-sources.html"] = listPage({
  id: "setup-reservation-sources",
  title: "مصادر الحجز",
  kicker: "إعدادات عامة",
  subtitle: "قنوات ومصادر الحجوزات",
  addLabel: "إضافة مصدر",
  columns: [
    { key: "name", label: "المصدر" },
    { key: "channel", label: "القناة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "مباشر", channel: "الاستقبال", status: "نشط" },
    { name: "موقع إلكتروني", channel: "أونلاين", status: "نشط" },
    { name: "Booking.com", channel: "OTA", status: "نشط" },
    { name: "هاتف", channel: "اتصال", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "channel", label: "القناة", type: "select", options: ["الاستقبال", "أونلاين", "OTA", "اتصال"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-guest-classes.html"] = listPage({
  id: "setup-guest-classes",
  title: "فئات النزلاء",
  kicker: "إعدادات عامة",
  subtitle: "تصنيف النزلاء لأغراض التسعير والولاء",
  addLabel: "إضافة فئة",
  columns: [
    { key: "name", label: "الفئة" },
    { key: "discount", label: "الخصم" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "عادي", discount: "0%", status: "نشط" },
    { name: "VIP", discount: "10%", status: "نشط" },
    { name: "شركة", discount: "15%", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "discount", label: "نسبة الخصم", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-loyalty-program-settings.html"] = listPage({
  id: "setup-loyalty-program-settings",
  title: "برنامج الولاء",
  kicker: "إعدادات عامة",
  subtitle: "مستويات برنامج الولاء ونقاط المكافآت",
  addLabel: "إضافة مستوى",
  columns: [
    { key: "name", label: "المستوى" },
    { key: "points", label: "نقاط الدخول" },
    { key: "benefit", label: "الميزة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "برونزي", points: "0", benefit: "ترحيب", status: "نشط" },
    { name: "فضي", points: "500", benefit: "ترقية غرفة", status: "نشط" },
    { name: "ذهبي", points: "1500", benefit: "إفطار مجاني", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "اسم المستوى *", required: true },
    { name: "points", label: "نقاط الدخول", type: "number" },
    { name: "benefit", label: "الميزة", placeholder: "إفطار مجاني" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-sms-auto-send.html"] = formPage({
  id: "setup-sms-auto-send",
  title: "إرسال SMS التلقائي",
  kicker: "إعدادات عامة",
  subtitle: "رسائل SMS التلقائية للنزلاء والمستخدمين",
  groups: [
    {
      title: "رسائل النزلاء",
      fields: [
        { label: "تأكيد الحجز", type: "toggle", checked: true },
        { label: "تذكير قبل الوصول", type: "toggle", checked: true },
        { label: "رسالة بعد المغادرة", type: "toggle", checked: false },
      ],
    },
    {
      title: "رسائل المستخدمين",
      fields: [
        { label: "تنبيه وصول اليوم", type: "toggle", checked: true },
        { label: "تنبيه المراجعة الليلية", type: "toggle", checked: true },
      ],
    },
  ],
});

pages["setup-property-facilities.html"] = listPage({
  id: "setup-property-facilities",
  title: "مرافق المنشآت",
  kicker: "إعدادات عامة",
  subtitle: "مرافق عامة على مستوى المنشأة",
  addLabel: "إضافة مرفق",
  columns: [
    { key: "name", label: "المرفق" },
    { key: "hours", label: "ساعات العمل" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "مسبح", hours: "08:00–22:00", status: "نشط" },
    { name: "صالة رياضية", hours: "06:00–23:00", status: "نشط" },
    { name: "موقف سيارات", hours: "24 ساعة", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "hours", label: "ساعات العمل", placeholder: "08:00–22:00" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Reporting
pages["setup-numbering-options.html"] = formPage({
  id: "setup-numbering-options",
  title: "خيارات الترقيم",
  kicker: "التقارير",
  subtitle: "بادئات وأرقام تسلسلية للمستندات",
  groups: [
    {
      title: "الترقيم",
      fields: [
        { label: "بادئة الحجوزات", value: "RES-" },
        { label: "بادئة الفواتير", value: "INV-" },
        { label: "بادئة سندات القبض", value: "RV-" },
        { label: "بادئة سندات الصرف", value: "PV-" },
        { label: "إعادة الترقيم سنوياً", type: "toggle", checked: true },
      ],
    },
  ],
});

pages["setup-printing-options.html"] = formPage({
  id: "setup-printing-options",
  title: "خيارات الطباعة",
  kicker: "التقارير",
  subtitle: "إعدادات طباعة الفواتير والإيصالات",
  groups: [
    {
      title: "الطباعة",
      fields: [
        { label: "إظهار الشعار", type: "toggle", checked: true },
        { label: "إظهار الشروط والأحكام", type: "toggle", checked: true },
        { label: "حجم الورق", type: "select", options: ["A4", "A5", "حراري 80مم"], value: "A4" },
        { label: "نص التذييل", type: "textarea", value: "شكراً لإقامتكم معنا" },
      ],
    },
  ],
});

// Outlets
pages["setup-outlet-setup.html"] = listPage({
  id: "setup-outlet-setup",
  title: "تهيئة المنافذ",
  kicker: "المنافذ",
  subtitle: "منافذ البيع والخدمات داخل المنشأة",
  addLabel: "إضافة منفذ",
  columns: [
    { key: "name", label: "المنفذ" },
    { key: "type", label: "النوع" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "المطعم الرئيسي", type: "مطعم", status: "نشط" },
    { name: "خدمة الغرف", type: "خدمة غرف", status: "نشط" },
    { name: "الميني بار", type: "مبيعات", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "type", label: "النوع", type: "select", options: ["مطعم", "خدمة غرف", "مبيعات", "سبا"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-items-categories.html"] = listPage({
  id: "setup-items-categories",
  title: "فئات الأصناف",
  kicker: "المنافذ",
  subtitle: "فئات أصناف المنافذ",
  addLabel: "إضافة فئة",
  columns: [
    { key: "name", label: "الفئة" },
    { key: "outlet", label: "المنفذ" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "مشروبات", outlet: "المطعم الرئيسي", status: "نشط" },
    { name: "أطباق رئيسية", outlet: "المطعم الرئيسي", status: "نشط" },
    { name: "وجبات خفيفة", outlet: "خدمة الغرف", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "outlet", label: "المنفذ", type: "select", options: ["المطعم الرئيسي", "خدمة الغرف", "الميني بار"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-items.html"] = listPage({
  id: "setup-items",
  title: "الأصناف",
  kicker: "المنافذ",
  subtitle: "أصناف البيع والأسعار",
  addLabel: "إضافة صنف",
  columns: [
    { key: "name", label: "الصنف" },
    { key: "category", label: "الفئة" },
    { key: "price", label: "السعر" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "عصير برتقال", category: "مشروبات", price: "15000", status: "نشط" },
    { name: "شريحة لحم", category: "أطباق رئيسية", price: "85000", status: "نشط" },
    { name: "ماء معدني", category: "مشروبات", price: "5000", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "category", label: "الفئة", type: "select", options: ["مشروبات", "أطباق رئيسية", "وجبات خفيفة"] },
    { name: "price", label: "السعر", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Rules
pages["setup-terms-conditions.html"] = listPage({
  id: "setup-terms-conditions",
  title: "الشروط والأحكام",
  kicker: "القواعد",
  subtitle: "نصوص الشروط والأحكام المعروضة للنزلاء",
  addLabel: "إضافة نص",
  columns: [
    { key: "title", label: "العنوان" },
    { key: "lang", label: "اللغة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { title: "شروط الإقامة العامة", lang: "العربية", status: "نشط" },
    { title: "سياسة الإلغاء", lang: "العربية", status: "نشط" },
  ],
  fields: [
    { name: "title", label: "العنوان *", required: true },
    { name: "lang", label: "اللغة", type: "select", options: ["العربية", "English"] },
    { name: "body", label: "النص", type: "textarea" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-penalties.html"] = listPage({
  id: "setup-penalties",
  title: "الغرامات",
  kicker: "القواعد",
  subtitle: "غرامات الإلغاء والتأخير والأضرار",
  addLabel: "إضافة غرامة",
  columns: [
    { key: "name", label: "الغرامة" },
    { key: "type", label: "النوع" },
    { key: "amount", label: "القيمة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "إلغاء متأخر", type: "نسبة", amount: "50%", status: "نشط" },
    { name: "عدم حضور", type: "ليلة كاملة", amount: "100%", status: "نشط" },
    { name: "تلف ممتلكات", type: "مبلغ", amount: "حسب التقدير", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "type", label: "النوع", type: "select", options: ["نسبة", "ليلة كاملة", "مبلغ"] },
    { name: "amount", label: "القيمة", placeholder: "50" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-reservation-rules.html"] = formPage({
  id: "setup-reservation-rules",
  title: "قواعد الحجز",
  kicker: "القواعد",
  subtitle: "قيود ومدد الحجز الافتراضية",
  groups: [
    {
      title: "القواعد",
      fields: [
        { label: "الحد الأدنى لليالي", type: "number", value: "1" },
        { label: "الحد الأقصى لليالي", type: "number", value: "30" },
        { label: "السماح بالحجز المتداخل", type: "toggle", checked: false },
        { label: "طلب دفعة مقدمة", type: "toggle", checked: true },
        { label: "نسبة الدفعة المقدمة", type: "number", value: "30" },
      ],
    },
  ],
});

pages["setup-cancel-no-show-reasons.html"] = listPage({
  id: "setup-cancel-no-show-reasons",
  title: "أسباب الإلغاء وعدم الحضور",
  kicker: "القواعد",
  subtitle: "قائمة الأسباب عند الإلغاء أو عدم الحضور",
  addLabel: "إضافة سبب",
  columns: [
    { key: "name", label: "السبب" },
    { key: "kind", label: "النوع" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "طلب النزيل", kind: "إلغاء", status: "نشط" },
    { name: "خطأ في الحجز", kind: "إلغاء", status: "نشط" },
    { name: "عدم حضور", kind: "عدم حضور", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "السبب *", required: true },
    { name: "kind", label: "النوع", type: "select", options: ["إلغاء", "عدم حضور"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-change-unit-reasons.html"] = listPage({
  id: "setup-change-unit-reasons",
  title: "أسباب تغيير الوحدة",
  kicker: "القواعد",
  subtitle: "أسباب نقل النزيل إلى وحدة أخرى",
  addLabel: "إضافة سبب",
  columns: [
    { key: "name", label: "السبب" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "طلب النزيل", status: "نشط" },
    { name: "صيانة", status: "نشط" },
    { name: "ترقية", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "السبب *", required: true },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-night-audit-settings.html"] = formPage({
  id: "setup-night-audit-settings",
  title: "إعدادات المراجعة الليلية",
  kicker: "القواعد",
  subtitle: "توقيت وقواعد إقفال اليوم",
  groups: [
    {
      title: "المراجعة الليلية",
      fields: [
        { label: "وقت التشغيل التلقائي", type: "time", value: "00:30" },
        { label: "ترحيل الأسعار تلقائياً", type: "toggle", checked: true },
        { label: "إقفال الحجوزات المنتهية", type: "toggle", checked: true },
        { label: "إرسال تقرير بعد الإقفال", type: "toggle", checked: true },
      ],
    },
  ],
});

pages["setup-guest-feedback-metrics.html"] = listPage({
  id: "setup-guest-feedback-metrics",
  title: "مقاييس تقييم النزلاء",
  kicker: "القواعد",
  subtitle: "معايير تقييم تجربة النزيل",
  addLabel: "إضافة مقياس",
  columns: [
    { key: "name", label: "المقياس" },
    { key: "weight", label: "الوزن" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "النظافة", weight: "30%", status: "نشط" },
    { name: "الخدمة", weight: "25%", status: "نشط" },
    { name: "الموقع", weight: "15%", status: "نشط" },
    { name: "القيمة مقابل السعر", weight: "30%", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "weight", label: "الوزن %", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Housekeeping
pages["setup-housekeepers.html"] = listPage({
  id: "setup-housekeepers",
  title: "قائمة المنظّفين",
  kicker: "التدبير الفندقي",
  subtitle: "موظفو التدبير الفندقي",
  addLabel: "إضافة منظّف",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "shift", label: "الوردية" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "فاطمة حسن", shift: "صباحية", status: "نشط" },
    { name: "ليلى محمود", shift: "مسائية", status: "نشط" },
    { name: "نور الدين", shift: "صباحية", status: "معطّل" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "shift", label: "الوردية", type: "select", options: ["صباحية", "مسائية", "ليلية"] },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-housekeeping-task-types.html"] = listPage({
  id: "setup-housekeeping-task-types",
  title: "أنواع المهام",
  kicker: "التدبير الفندقي",
  subtitle: "أنواع مهام التدبير الفندقي",
  addLabel: "إضافة نوع مهمة",
  columns: [
    { key: "name", label: "النوع" },
    { key: "duration", label: "المدة (دقيقة)" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "تنظيف مغادرة", duration: "40", status: "نشط" },
    { name: "تنظيف إقامة", duration: "25", status: "نشط" },
    { name: "تعقيم", duration: "60", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "duration", label: "المدة بالدقائق", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

// Subscriptions
pages["setup-subscriptions.html"] = formPage({
  id: "setup-subscriptions",
  title: "الاشتراكات",
  kicker: "الخدمات",
  subtitle: "خدمات وتكاملات الاشتراك",
  groups: [
    {
      title: "الخدمات المفعّلة",
      fields: [
        { label: "مرحبا (القناة الرسمية)", type: "toggle", checked: true, hint: "تكامل الحجز المحلي" },
        { label: "SMS", type: "toggle", checked: true },
        { label: "PayTabs", type: "toggle", checked: false },
        { label: "Tap", type: "toggle", checked: false },
        { label: "نظام MOI", type: "toggle", checked: false },
        { label: "إحصاءات سوريا", type: "toggle", checked: false },
      ],
    },
  ],
});

// Supplies
pages["setup-supplies-categories.html"] = listPage({
  id: "setup-supplies-categories",
  title: "فئات المستلزمات",
  kicker: "مستلزمات النزلاء",
  subtitle: "فئات مستلزمات الغرف والنزلاء",
  addLabel: "إضافة فئة",
  columns: [
    { key: "name", label: "الفئة" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "أدوات استحمام", status: "نشط" },
    { name: "منسوجات", status: "نشط" },
    { name: "مشروبات ترحيبية", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-guest-supplies.html"] = listPage({
  id: "setup-guest-supplies",
  title: "مستلزمات النزلاء",
  kicker: "مستلزمات النزلاء",
  subtitle: "أصناف المستلزمات المقدمة للنزلاء",
  addLabel: "إضافة مستلزم",
  columns: [
    { key: "name", label: "المستلزم" },
    { key: "category", label: "الفئة" },
    { key: "qty", label: "الكمية الافتراضية" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { name: "شامبو", category: "أدوات استحمام", qty: "1", status: "نشط" },
    { name: "منشفة يد", category: "منسوجات", qty: "2", status: "نشط" },
    { name: "ماء معدني", category: "مشروبات ترحيبية", qty: "2", status: "نشط" },
  ],
  fields: [
    { name: "name", label: "الاسم *", required: true },
    { name: "category", label: "الفئة", type: "select", options: ["أدوات استحمام", "منسوجات", "مشروبات ترحيبية"] },
    { name: "qty", label: "الكمية الافتراضية", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

pages["setup-supplies-unit-usages.html"] = listPage({
  id: "setup-supplies-unit-usages",
  title: "استخدامات الوحدات",
  kicker: "مستلزمات النزلاء",
  subtitle: "ربط المستلزمات بأنواع الوحدات",
  addLabel: "إضافة ربط",
  columns: [
    { key: "unitType", label: "نوع الوحدة" },
    { key: "supply", label: "المستلزم" },
    { key: "qty", label: "الكمية" },
    { key: "status", label: "الحالة", badge: true },
  ],
  rows: [
    { unitType: "مزدوجة", supply: "شامبو", qty: "2", status: "نشط" },
    { unitType: "مزدوجة", supply: "ماء معدني", qty: "2", status: "نشط" },
    { unitType: "جناح", supply: "منشفة يد", qty: "4", status: "نشط" },
  ],
  fields: [
    { name: "unitType", label: "نوع الوحدة", type: "select", options: ["مفردة", "مزدوجة", "جناح"] },
    { name: "supply", label: "المستلزم", type: "select", options: ["شامبو", "منشفة يد", "ماء معدني"] },
    { name: "qty", label: "الكمية", type: "number" },
    { name: "active", label: "نشط", type: "toggle" },
  ],
});

let created = 0;
for (const [file, html] of Object.entries(pages)) {
  fs.writeFileSync(path.join(OUT, file), html, "utf8");
  created++;
  console.log("wrote", file);
}
console.log("DONE", created, "files");
