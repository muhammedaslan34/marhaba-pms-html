/**
 * Finance module pages:
 * - finance-transactions.html
 * - finance-cashboxes.html
 * - finance-rates.html
 * - finance-categories.html
 * Depends on window.PMSData and window.FinanceData being loaded first.
 */
(function () {
  "use strict";

  const PD = window.PMSData;
  const FD = window.FinanceData;
  const fmt = FD.formatMoneyWithSymbol;
  const page = document.body.dataset.page || "finance-transactions";
  function el(id) { return document.getElementById(id); }
  function on(id, event, fn) {
    const node = el(id);
    if (node) node.addEventListener(event, fn);
  }

  const TYPE_LABELS = { income: "إيراد", expense: "مصروف", exchange: "تحويل عملة", transfer: "تحويل", adjustment: "تسوية" };
  const TYPE_BADGE = { income: "badge-success", expense: "badge-danger", exchange: "badge-info", transfer: "badge-primary", adjustment: "badge-neutral" };
  const STATUS_LABELS = { draft: "مسودة", confirmed: "مؤكدة", cancelled: "ملغاة" };
  const STATUS_BADGE = { draft: "badge-warning", confirmed: "badge-success", cancelled: "badge-neutral" };
  const SOURCE_LABELS = { manual: "يدوي", central: "تسعير مركزي", "exchange-office": "مكتب صرافة", bank: "بنك", api: "API", "base-currency": "العملة الأساسية" };

  let editingTxnId = null;
  let duplicateFromId = null;

  // The whole demo treats 2026-07-30 as "today" (matches dashboard.html and
  // every other seeded record) rather than the real system date.
  function todayISO() { return "2026-07-30"; }
  function todayDate() { return new Date(2026, 6, 30); }
  // Local Y-M-D formatting — toISOString() converts to UTC first, which can
  // shift the date by one day depending on the browser's local timezone.
  function isoDate(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }
  function currentUser() { return PD.getCurrentUser(); }
  function assignedProps() { return PD.getAssignedProperties(currentUser()); }

  function propertyOptionsHtml(selected) {
    return assignedProps().map(function (p) {
      return '<option value="' + p.id + '"' + (p.id === selected ? " selected" : "") + '>' + p.name + " (" + p.code + ")</option>";
    }).join("");
  }

  // ─── date range ────────────────────────────────────────────────────
  function dateRangeBounds() {
    const v = document.getElementById("date-range").value;
    if (v === "all") return null;
    const days = Number(v);
    const to = todayDate();
    const from = todayDate();
    from.setDate(from.getDate() - days);
    return { from: isoDate(from), to: isoDate(to) };
  }

  // ─── filters ───────────────────────────────────────────────────────
  function activeFilters() {
    return {
      search: (document.getElementById("f-search").value || "").trim().toLowerCase(),
      type: document.getElementById("f-type").value,
      category: document.getElementById("f-category").value,
      currency: document.getElementById("f-currency").value,
      account: document.getElementById("f-account").value,
      status: document.getElementById("f-status").value,
      property: document.getElementById("f-property").value,
      from: document.getElementById("f-from").value,
      to: document.getElementById("f-to").value,
    };
  }

  function filteredTransactions() {
    const f = activeFilters();
    const range = dateRangeBounds();
    let list = FD.getVisibleTransactions();

    if (f.property !== "all") list = list.filter(function (t) { return t.propertyId === f.property; });
    if (f.type !== "all") list = list.filter(function (t) { return t.type === f.type; });
    if (f.category !== "all") list = list.filter(function (t) { return t.category === f.category; });
    if (f.currency !== "all") list = list.filter(function (t) { return t.currency === f.currency; });
    if (f.account !== "all") list = list.filter(function (t) { return t.paymentAccountId === f.account; });
    if (f.status !== "all") list = list.filter(function (t) { return t.status === f.status; });
    if (f.from) list = list.filter(function (t) { return t.transactionDate >= f.from; });
    if (f.to) list = list.filter(function (t) { return t.transactionDate <= f.to; });
    if (range) list = list.filter(function (t) { return t.transactionDate >= range.from && t.transactionDate <= range.to; });
    if (f.search) {
      list = list.filter(function (t) {
        const hay = ((t.referenceId || "") + " " + t.id + " " + (t.description || "")).toLowerCase();
        return hay.indexOf(f.search) !== -1;
      });
    }
    return list.sort(function (a, b) { return a.transactionDate < b.transactionDate ? 1 : -1; });
  }

  function renderActiveFilterChips() {
    const f = activeFilters();
    const labels = [];
    if (f.search) labels.push(["search", "بحث: " + f.search]);
    if (f.type !== "all") labels.push(["type", TYPE_LABELS[f.type]]);
    if (f.category !== "all") labels.push(["category", f.category]);
    if (f.currency !== "all") labels.push(["currency", f.currency]);
    if (f.account !== "all") { const a = FD.getCashboxById(f.account); labels.push(["account", a ? a.name : f.account]); }
    if (f.status !== "all") labels.push(["status", STATUS_LABELS[f.status]]);
    if (f.property !== "all") { const p = PD.getPropertyById(f.property); labels.push(["property", p ? p.name : f.property]); }
    if (f.from) labels.push(["from", "من " + f.from]);
    if (f.to) labels.push(["to", "إلى " + f.to]);

    const wrap = document.getElementById("active-filters");
    if (!labels.length) { wrap.innerHTML = ""; return; }
    wrap.innerHTML = labels.map(function (l) {
      return '<span class="chip is-active" style="cursor:default">' + l[1] +
        '<button type="button" data-clear-filter="' + l[0] + '" class="ms-1" aria-label="إزالة الفلتر" style="margin-inline-start:.35rem">×</button></span>';
    }).join("") + '<button type="button" class="btn btn-ghost btn-sm" id="clear-filters-btn">مسح كل الفلاتر</button>';

    wrap.querySelectorAll("[data-clear-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () { clearOneFilter(btn.dataset.clearFilter); });
    });
    const clearAll = document.getElementById("clear-filters-btn");
    if (clearAll) clearAll.addEventListener("click", clearAllFilters);
  }

  function clearDateFilter(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = "";
    const field = el.closest("[data-datepicker]");
    const text = field && field.querySelector(".dp-text");
    if (text) {
      text.textContent = field.dataset.placeholder || "اختر التاريخ";
      text.classList.add("is-empty");
    }
  }

  function syncSelectLabel(id) {
    const node = document.getElementById(id);
    if (!node) return;
    node.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setDateField(id, iso) {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = iso || "";
    const field = input.closest("[data-datepicker]");
    const text = field && field.querySelector(".dp-text");
    if (!text) return;
    if (!iso) {
      text.textContent = (field && field.dataset.placeholder) || "اختر التاريخ";
      text.classList.add("is-empty");
      return;
    }
    const parts = String(iso).split("-");
    if (parts.length === 3) {
      text.textContent = parts[1] + "/" + parts[2] + "/" + parts[0];
      text.classList.remove("is-empty");
    } else {
      text.textContent = iso;
      text.classList.remove("is-empty");
    }
  }

  function setSelectHtml(id, html, value) {
    const node = document.getElementById(id);
    if (!node) return;
    node.innerHTML = html;
    if (value != null && value !== "") node.value = value;
    syncSelectLabel(id);
  }

  function clearOneFilter(key) {
    const map = { search: "f-search", type: "f-type", category: "f-category", currency: "f-currency", account: "f-account", status: "f-status", property: "f-property", from: "f-from", to: "f-to" };
    if (key === "from" || key === "to") {
      clearDateFilter(map[key]);
      renderAll();
      return;
    }
    const el = document.getElementById(map[key]);
    if (el) el.value = el.tagName === "SELECT" ? "all" : "";
    if (el && el.tagName === "SELECT") syncSelectLabel(map[key]);
    renderAll();
  }
  function clearAllFilters() {
    document.getElementById("f-search").value = "";
    clearDateFilter("f-from");
    clearDateFilter("f-to");
    ["f-type", "f-category", "f-currency", "f-account", "f-status", "f-property"].forEach(function (id) {
      document.getElementById(id).value = "all";
      syncSelectLabel(id);
    });
    renderAll();
  }

  function populateFilterSelects() {
    const keep = function (id) { return document.getElementById(id).value; };
    const cat = keep("f-category");
    const acc = keep("f-account");
    const prop = keep("f-property");
    document.getElementById("f-category").innerHTML = '<option value="all">كل الفئات</option>' +
      FD.getCategories().filter(function (c) { return c.status === "active"; })
        .map(function (c) { return '<option value="' + c.name + '">' + c.name + "</option>"; }).join("");
    document.getElementById("f-account").innerHTML = '<option value="all">كل الحسابات</option>' +
      FD.getVisibleCashboxes().map(function (a) { return '<option value="' + a.id + '">' + a.name + "</option>"; }).join("");
    document.getElementById("f-property").innerHTML = '<option value="all">كل المنشآت</option>' +
      assignedProps().map(function (p) { return '<option value="' + p.id + '">' + p.name + "</option>"; }).join("");
    document.getElementById("f-category").value = cat;
    document.getElementById("f-account").value = acc;
    document.getElementById("f-property").value = prop;
    syncSelectLabel("f-category");
    syncSelectLabel("f-account");
    syncSelectLabel("f-property");
  }

  // Summary cards + charts appear on all four finance pages, but only the
  // transactions page has the filter toolbar — so they read straight from
  // FD.getVisibleTransactions() rather than the local, filter-UI-dependent
  // filteredTransactions().
  function summaryTransactions() {
    return FD.getVisibleTransactions();
  }

  // ─── summary cards ─────────────────────────────────────────────────
  function renderSummary() {
    if (!el("sum-income")) return;
    const selected = PD.getSelectedPropertyId();
    const banner = el("consolidated-banner");
    if (banner) banner.classList.toggle("hidden", selected !== "all");
    if (selected === "all" && el("consolidated-count")) el("consolidated-count").textContent = String(assignedProps().length);

    const list = summaryTransactions().filter(function (t) { return t.status !== "cancelled"; });
    let incomeBase = 0, expenseBase = 0;
    const incomeOrig = {}, expenseOrig = {};
    list.forEach(function (t) {
      const base = Number(t.baseAmount);
      if (t.type === "income") {
        incomeBase += base;
        incomeOrig[t.currency] = (incomeOrig[t.currency] || 0) + Number(t.amount);
      } else if (t.type === "expense") {
        expenseBase += base;
        expenseOrig[t.currency] = (expenseOrig[t.currency] || 0) + Number(t.amount);
      }
    });
    const net = incomeBase - expenseBase;

    document.getElementById("sum-income").textContent = fmt(incomeBase, "SYP");
    document.getElementById("sum-income-orig").innerHTML = "الأصل: " + origSummaryHtml(incomeOrig);
    document.getElementById("sum-expense").textContent = fmt(expenseBase, "SYP");
    document.getElementById("sum-expense-orig").innerHTML = "الأصل: " + origSummaryHtml(expenseOrig);
    document.getElementById("sum-net").textContent = fmt(net, "SYP");
    document.getElementById("sum-net-orig").textContent = net >= 0 ? "صافي موجب" : "صافي سالب";
    document.getElementById("sum-income-trend").textContent = "+12.5% مقارنة بالفترة السابقة";
    document.getElementById("sum-expense-trend").textContent = "+4.1% مقارنة بالفترة السابقة";

    const boxes = FD.getVisibleCashboxes();
    const usdTotal = boxes.filter(function (c) { return c.currency === "USD"; }).reduce(function (s, c) { return s + Number(c.balance); }, 0);
    const sypTotal = boxes.filter(function (c) { return c.currency === "SYP"; }).reduce(function (s, c) { return s + Number(c.balance); }, 0);
    document.getElementById("sum-cash-usd").textContent = fmt(usdTotal, "USD");
    document.getElementById("sum-cash-syp").textContent = fmt(sypTotal, "SYP");
  }

  // Wrap each amount in <bdi> so the bidi algorithm can't reorder the
  // LTR currency symbol/number pairs (e.g. "$145.00") inside RTL text.
  function origSummaryHtml(map) {
    const parts = Object.keys(map).map(function (cur) { return "<bdi>" + fmt(map[cur], cur) + "</bdi>"; });
    return parts.length ? parts.join(" + ") : "لا يوجد";
  }

  // ─── charts (tailwind bars, no canvas) ────────────────────────────
  function renderCharts() {
    if (!el("chart-trend")) return;
    const list = summaryTransactions().filter(function (t) { return t.status !== "cancelled"; });

    // trend: last 7 days income vs expense (base amount)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = todayDate();
      d.setDate(d.getDate() - i);
      days.push(isoDate(d));
    }
    const dayTotals = days.map(function (d) {
      const inc = list.filter(function (t) { return t.transactionDate === d && t.type === "income"; }).reduce(function (s, t) { return s + Number(t.baseAmount); }, 0);
      const exp = list.filter(function (t) { return t.transactionDate === d && t.type === "expense"; }).reduce(function (s, t) { return s + Number(t.baseAmount); }, 0);
      return { d: d, inc: inc, exp: exp };
    });
    const maxVal = Math.max.apply(null, dayTotals.map(function (x) { return Math.max(x.inc, x.exp); }).concat([1]));
    document.getElementById("chart-trend").innerHTML = dayTotals.map(function (x) {
      const incH = Math.max(4, Math.round((x.inc / maxVal) * 100));
      const expH = Math.max(4, Math.round((x.exp / maxVal) * 100));
      return '<div class="flex-1 flex items-end justify-center gap-0.5" title="' + x.d + '">' +
        '<div class="w-2 rounded-t bg-emerald-400" style="height:' + incH + '%"></div>' +
        '<div class="w-2 rounded-t bg-red-300" style="height:' + expH + '%"></div>' +
        "</div>";
    }).join("");

    // income by currency
    const byCurrency = {};
    list.filter(function (t) { return t.type === "income"; }).forEach(function (t) { byCurrency[t.currency] = (byCurrency[t.currency] || 0) + Number(t.baseAmount); });
    const totalCur = Object.values(byCurrency).reduce(function (a, b) { return a + b; }, 0) || 1;
    document.getElementById("chart-currency").innerHTML = Object.keys(byCurrency).length
      ? Object.keys(byCurrency).map(function (cur) {
          const pct = Math.round((byCurrency[cur] / totalCur) * 100);
          return '<div><div class="flex justify-between text-xs font-bold mb-1"><span>' + cur + '</span><span>' + pct + '%</span></div>' +
            '<div class="h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-primary" style="width:' + pct + '%"></div></div></div>';
        }).join("")
      : '<p class="text-xs text-slate-400 font-semibold">لا يوجد إيراد بعد</p>';

    // expenses by category (top 4)
    const byCat = {};
    list.filter(function (t) { return t.type === "expense"; }).forEach(function (t) { byCat[t.category] = (byCat[t.category] || 0) + Number(t.baseAmount); });
    const catEntries = Object.entries(byCat).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 4);
    const maxCat = catEntries.length ? catEntries[0][1] : 1;
    document.getElementById("chart-expense-category").innerHTML = catEntries.length
      ? catEntries.map(function (e) {
          const pct = Math.round((e[1] / maxCat) * 100);
          return '<div><div class="flex justify-between text-xs font-bold mb-1"><span class="truncate">' + e[0] + '</span><span>' + fmt(e[1], "SYP") + '</span></div>' +
            '<div class="h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-red-400" style="width:' + pct + '%"></div></div></div>';
        }).join("")
      : '<p class="text-xs text-slate-400 font-semibold">لا توجد مصروفات بعد</p>';

    // income by property
    const byProp = {};
    list.filter(function (t) { return t.type === "income"; }).forEach(function (t) { byProp[t.propertyId] = (byProp[t.propertyId] || 0) + Number(t.baseAmount); });
    const propEntries = Object.entries(byProp);
    const maxProp = propEntries.length ? Math.max.apply(null, propEntries.map(function (e) { return e[1]; })) : 1;
    document.getElementById("chart-property").innerHTML = propEntries.length
      ? propEntries.map(function (e) {
          const p = PD.getPropertyById(e[0]);
          const pct = Math.round((e[1] / maxProp) * 100);
          return '<div><div class="flex justify-between text-xs font-bold mb-1"><span>' + (p ? p.name : e[0]) + '</span><span>' + fmt(e[1], "SYP") + '</span></div>' +
            '<div class="h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-secondary" style="width:' + pct + '%"></div></div></div>';
        }).join("")
      : '<p class="text-xs text-slate-400 font-semibold">لا يوجد إيراد بعد</p>';
  }

  // ─── transactions table + cards ────────────────────────────────────
  function actionButtonsHtml(t) {
    let html = '<button type="button" class="icon-btn" data-action="view-txn" data-id="' + t.id + '" title="عرض" aria-label="عرض">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button>';
    if (t.status === "draft") {
      html += '<button type="button" class="icon-btn" data-action="edit-txn" data-id="' + t.id + '" title="تعديل" aria-label="تعديل">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    }
    return html;
  }

  function txnRowHtml(t) {
    const acc = FD.getCashboxById(t.paymentAccountId);
    const prop = PD.getPropertyById(t.propertyId);
    return (
      "<tr>" +
      '<td class="text-slate-500 font-semibold">' + t.transactionDate + "</td>" +
      '<td class="font-extrabold text-primary">' + (t.referenceId || t.id) + "</td>" +
      "<td>" + (prop ? prop.code : t.propertyId) + "</td>" +
      '<td><span class="badge ' + TYPE_BADGE[t.type] + '">' + TYPE_LABELS[t.type] + "</span></td>" +
      "<td>" + (t.category || "—") + "</td>" +
      '<td class="max-w-[12rem] truncate">' + (t.description || "—") + "</td>" +
      "<td>" + (acc ? acc.name : t.paymentAccountId) + "</td>" +
      '<td class="font-extrabold">' + fmt(t.amount, t.currency) + "</td>" +
      "<td>" + (t.currency === "SYP" ? "—" : Number(t.exchangeRate).toLocaleString("en-US")) + "</td>" +
      '<td class="font-extrabold ' + (t.type === "income" ? "money-credit" : t.type === "expense" ? "money-due" : "") + '">' + fmt(t.baseAmount, "SYP") + "</td>" +
      "<td><span class=\"badge " + STATUS_BADGE[t.status] + "\">" + STATUS_LABELS[t.status] + "</span></td>" +
      '<td><div class="action-cell justify-center w-full">' + actionButtonsHtml(t) + "</div></td>" +
      "</tr>"
    );
  }

  function txnCardHtml(t) {
    const acc = FD.getCashboxById(t.paymentAccountId);
    const prop = PD.getPropertyById(t.propertyId);
    return (
      '<article class="panel p-4 space-y-2.5" data-action="view-txn" data-id="' + t.id + '" style="cursor:pointer">' +
      '<div class="flex items-center justify-between gap-2">' +
      '<span class="badge ' + TYPE_BADGE[t.type] + '">' + TYPE_LABELS[t.type] + "</span>" +
      "<span class=\"badge " + STATUS_BADGE[t.status] + "\">" + STATUS_LABELS[t.status] + "</span>" +
      "</div>" +
      '<div class="font-extrabold text-slate-800">' + (t.description || t.category) + "</div>" +
      '<div class="text-xs text-slate-500 font-semibold">' + (prop ? prop.name : t.propertyId) + " · " + t.transactionDate + " · " + (acc ? acc.name : "") + "</div>" +
      '<div class="flex items-center justify-between pt-1 border-t border-slate-100">' +
      '<span class="font-extrabold">' + fmt(t.amount, t.currency) + "</span>" +
      '<span class="font-extrabold ' + (t.type === "income" ? "money-credit" : t.type === "expense" ? "money-due" : "") + '">' + fmt(t.baseAmount, "SYP") + "</span>" +
      "</div>" +
      "</article>"
    );
  }

  function renderTransactionsList() {
    const list = filteredTransactions();
    document.getElementById("txn-table-body").innerHTML = list.map(txnRowHtml).join("");
    document.getElementById("txn-cards").innerHTML = list.map(txnCardHtml).join("");
    document.getElementById("txn-empty-desktop").classList.toggle("hidden", list.length > 0);
    document.getElementById("txn-empty-mobile").classList.toggle("hidden", list.length > 0);
  }

  // ─── Add / Edit transaction drawer ─────────────────────────────────
  function categoryOptionsHtml(type) {
    const names = type === "income" ? FD.INCOME_CATEGORY_NAMES : FD.EXPENSE_CATEGORY_NAMES;
    const active = FD.getCategories().filter(function (c) { return c.type === type && c.status === "active"; }).map(function (c) { return c.name; });
    const use = active.length ? active : names;
    return use.map(function (n) { return '<option value="' + n + '">' + n + "</option>"; }).join("");
  }

  function accountOptionsHtml(propertyId) {
    return FD.getCashboxesByProperty(propertyId).filter(function (c) { return c.status === "active"; })
      .map(function (c) { return '<option value="' + c.id + '" data-currency="' + c.currency + '">' + c.name + " (" + c.currency + ")</option>"; }).join("");
  }

  function recalcTxnBase() {
    const accId = document.getElementById("t-account").value;
    const acc = FD.getCashboxById(accId);
    const currency = acc ? acc.currency : "SYP";
    document.getElementById("t-currency-display").textContent = currency;
    const amount = Number(document.getElementById("t-amount").value) || 0;
    const rateInput = document.getElementById("t-rate");
    const propertyId = document.getElementById("t-property").value;
    const date = document.getElementById("t-date").value || todayISO();

    let rate = Number(rateInput.value) || 0;
    const rateWarn = document.getElementById("t-rate-warning");
    if (currency === "SYP") {
      rate = 1;
      rateInput.value = "1";
      rateInput.readOnly = true;
      document.getElementById("t-rate-auto-label").textContent = "(ثابت لعملة الأساس)";
      rateWarn.classList.add("hidden");
    } else {
      rateInput.readOnly = false;
      const auto = FD.getCurrentRate(propertyId, "USD", "SYP");
      if (auto && (!rateInput.dataset.touched || !rateInput.value)) {
        rateInput.value = auto;
        rate = Number(auto);
      }
      document.getElementById("t-rate-auto-label").textContent = "(محمَّل تلقائياً — قابل للتعديل)";
      rateWarn.classList.remove("hidden");
    }
    const base = amount * rate;
    document.getElementById("t-base-amount").value = FD.formatMoney(base, "SYP") + " SYP";
    document.getElementById("t-calc-line").textContent =
      currency === "USD"
        ? "$" + FD.formatMoney(amount, "USD") + " × " + FD.formatMoney(rate, "SYP") + " = " + FD.formatMoney(base, "SYP") + " SYP"
        : FD.formatMoney(amount, "SYP") + " SYP (بدون تحويل — العملة الأساسية)";

    // balance guard for expenses
    const balWarn = document.getElementById("t-balance-warning");
    const type = document.getElementById("t-type").value;
    if (type === "expense" && acc) {
      const availableBase = FD.toMinorUnits(acc.balance, currency);
      const neededBase = FD.toMinorUnits(String(amount), currency);
      if (neededBase > availableBase) {
        balWarn.textContent = "تنبيه: المبلغ يتجاوز رصيد الصندوق المتاح (" + fmt(acc.balance, currency) + ").";
        balWarn.classList.remove("hidden");
      } else {
        balWarn.classList.add("hidden");
      }
    } else {
      balWarn.classList.add("hidden");
    }
  }

  function resetTxnForm() {
    editingTxnId = null;
    duplicateFromId = null;
    document.getElementById("txn-drawer-title").textContent = "إضافة حركة مالية";
    const selectedProp = PD.getSelectedPropertyId();
    const defaultProp = selectedProp === "all" ? (assignedProps()[0] || {}).id : selectedProp;
    setSelectHtml("t-property", propertyOptionsHtml(defaultProp), defaultProp);
    document.getElementById("t-type").value = "income";
    syncSelectLabel("t-type");
    setSelectHtml("t-category", categoryOptionsHtml("income"));
    setDateField("t-date", todayISO());
    document.getElementById("t-description").value = "";
    document.getElementById("t-ref-type").value = "";
    syncSelectLabel("t-ref-type");
    document.getElementById("t-ref-id").value = "";
    setSelectHtml("t-account", accountOptionsHtml(defaultProp));
    document.getElementById("t-amount").value = "";
    document.getElementById("t-rate").value = "1";
    document.getElementById("t-rate").dataset.touched = "";
    document.getElementById("t-status").value = "draft";
    syncSelectLabel("t-status");
    document.getElementById("t-status-section").classList.remove("hidden");
    recalcTxnBase();
  }

  function fillTxnForm(t) {
    setSelectHtml("t-property", propertyOptionsHtml(t.propertyId), t.propertyId);
    document.getElementById("t-type").value = t.type === "expense" ? "expense" : t.type === "adjustment" ? "adjustment" : "income";
    syncSelectLabel("t-type");
    setSelectHtml("t-category", categoryOptionsHtml(document.getElementById("t-type").value), t.category);
    setDateField("t-date", t.transactionDate);
    document.getElementById("t-description").value = t.description || "";
    document.getElementById("t-ref-type").value = t.referenceType || "";
    syncSelectLabel("t-ref-type");
    document.getElementById("t-ref-id").value = t.referenceId || "";
    setSelectHtml("t-account", accountOptionsHtml(t.propertyId), t.paymentAccountId);
    document.getElementById("t-amount").value = t.amount;
    document.getElementById("t-rate").value = t.exchangeRate;
    document.getElementById("t-rate").dataset.touched = "1";
    document.getElementById("t-status").value = t.status === "confirmed" ? "confirmed" : "draft";
    syncSelectLabel("t-status");
    recalcTxnBase();
  }

  function openAddTxnDrawer() {
    resetTxnForm();
    PMS.openDrawer("txn-drawer");
  }
  function openEditTxnDrawer(id) {
    const t = FD.getTransactionById(id);
    if (!t) return;
    if (t.status === "confirmed") {
      PMS.toast("لا يمكن تعديل حركة مؤكدة مباشرة — أنشئ حركة تسوية أو ألغِ الحركة أولاً");
      return;
    }
    editingTxnId = id;
    duplicateFromId = null;
    document.getElementById("txn-drawer-title").textContent = "تعديل الحركة — " + id;
    fillTxnForm(t);
    PMS.openDrawer("txn-drawer");
  }
  function openDuplicateTxnDrawer(id) {
    const t = FD.getTransactionById(id);
    if (!t) return;
    editingTxnId = null;
    duplicateFromId = id;
    document.getElementById("txn-drawer-title").textContent = "تكرار الحركة";
    fillTxnForm(t);
    document.getElementById("t-status").value = "draft";
    syncSelectLabel("t-status");
    PMS.closeDrawer();
    PMS.openDrawer("txn-drawer");
  }

  function validateTxnForm() {
    const property = document.getElementById("t-property").value;
    const type = document.getElementById("t-type").value;
    const category = document.getElementById("t-category").value;
    const account = document.getElementById("t-account").value;
    const amount = Number(document.getElementById("t-amount").value);
    const acc = FD.getCashboxById(account);

    if (!property) { PMS.toast("يرجى اختيار المنشأة"); return false; }
    if (!type) { PMS.toast("يرجى اختيار نوع الحركة"); return false; }
    if (!category) { PMS.toast("يرجى اختيار الفئة"); return false; }
    if (!account) { PMS.toast("يرجى اختيار حساب الدفع"); return false; }
    if (!amount || amount <= 0) { PMS.toast("يجب أن يكون المبلغ أكبر من صفر"); return false; }
    if (acc && acc.currency === "USD" && (!document.getElementById("t-rate").value || Number(document.getElementById("t-rate").value) <= 0)) {
      PMS.toast("يتطلب المبلغ بالدولار سعر صرف صالح");
      return false;
    }
    return true;
  }

  function saveTxn(statusOverride) {
    if (!validateTxnForm()) return;
    const propertyId = document.getElementById("t-property").value;
    const accId = document.getElementById("t-account").value;
    const acc = FD.getCashboxById(accId);
    const currency = acc.currency;
    const amount = Number(document.getElementById("t-amount").value).toFixed(currency === "SYP" ? 0 : 2);
    const rate = currency === "SYP" ? "1.000000" : Number(document.getElementById("t-rate").value).toFixed(6);
    const baseAmount = String(Math.round(Number(amount) * Number(rate)));
    const status = statusOverride || document.getElementById("t-status").value;
    const type = document.getElementById("t-type").value;

    if (type === "expense" && status === "confirmed") {
      const availableBase = FD.toMinorUnits(acc.balance, currency);
      const neededBase = FD.toMinorUnits(amount, currency);
      if (neededBase > availableBase) {
        PMS.toast("لا يمكن تأكيد الحركة — الرصيد غير كافٍ في " + acc.name);
        return;
      }
    }

    const payload = {
      propertyId: propertyId,
      transactionDate: document.getElementById("t-date").value || todayISO(),
      type: type,
      category: document.getElementById("t-category").value,
      description: document.getElementById("t-description").value.trim(),
      paymentAccountId: accId,
      amount: amount,
      currency: currency,
      exchangeRate: rate,
      baseCurrency: "SYP",
      baseAmount: baseAmount,
      exchangeRateDate: document.getElementById("t-date").value || todayISO(),
      exchangeRateSource: currency === "SYP" ? "base-currency" : "manual",
      referenceType: document.getElementById("t-ref-type").value || null,
      referenceId: document.getElementById("t-ref-id").value.trim() || null,
      status: status,
    };

    if (editingTxnId) {
      const before = FD.getTransactionById(editingTxnId);
      FD.updateTransaction(editingTxnId, payload);
      if (status === "confirmed" && before.status !== "confirmed") {
        applyTxnToCashbox(Object.assign({}, before, payload));
      }
      PMS.toast("تم حفظ التعديلات على " + editingTxnId);
    } else {
      const id = "TXN-" + Date.now();
      payload.id = id;
      payload.createdBy = currentUser().firstName + " " + currentUser().lastName;
      payload.createdAt = new Date().toISOString().slice(0, 16).replace("T", " ");
      FD.addTransaction(payload);
      if (status === "confirmed") applyTxnToCashbox(payload);
      PMS.toast(status === "confirmed" ? "تم إنشاء الحركة وتأكيدها" : "تم حفظ الحركة كمسودة");
    }

    PMS.closeDrawer();
    renderAll();
  }

  function applyTxnToCashbox(t) {
    const sign = t.type === "income" ? 1 : t.type === "expense" ? -1 : 0;
    if (!sign) return;
    const delta = sign === 1 ? t.amount : "-" + t.amount;
    FD.adjustCashboxBalance(t.paymentAccountId, t.currency, delta);
  }
  function reverseTxnFromCashbox(t) {
    const sign = t.type === "income" ? -1 : t.type === "expense" ? 1 : 0;
    if (!sign) return;
    const delta = sign === 1 ? t.amount : "-" + t.amount;
    FD.adjustCashboxBalance(t.paymentAccountId, t.currency, delta);
  }

  // ─── details drawer ────────────────────────────────────────────────
  function renderTxnDetails(id) {
    const t = FD.getTransactionById(id);
    if (!t) return;
    const acc = FD.getCashboxById(t.paymentAccountId);
    const prop = PD.getPropertyById(t.propertyId);
    const rows = [
      ["رقم الحركة", t.id],
      ["المنشأة", prop ? prop.name : t.propertyId],
      ["التاريخ", t.transactionDate + (t.createdAt ? " · " + t.createdAt : "")],
      ["بواسطة", t.createdBy || "—"],
      ["النوع", TYPE_LABELS[t.type]],
      ["الفئة", t.category],
      ["الوصف", t.description || "—"],
      ["المبلغ الأصلي", fmt(t.amount, t.currency) + " (" + t.currency + ")"],
      ["سعر الصرف المحفوظ", Number(t.exchangeRate).toLocaleString("en-US") + " (" + SOURCE_LABELS[t.exchangeRateSource] + ")"],
      ["المبلغ بالعملة الأساسية", fmt(t.baseAmount, "SYP")],
      ["حساب الدفع", acc ? acc.name : t.paymentAccountId],
      ["مرتبط بـ", t.referenceId ? (t.referenceType || "") + " · " + t.referenceId : "—"],
    ];
    document.getElementById("txn-details-body").innerHTML =
      '<div class="flex items-center gap-2"><span class="badge ' + TYPE_BADGE[t.type] + '">' + TYPE_LABELS[t.type] + '</span><span class="badge ' + STATUS_BADGE[t.status] + '">' + STATUS_LABELS[t.status] + "</span></div>" +
      '<dl class="grid grid-cols-1 gap-2">' + rows.map(function (r) {
        return '<div class="summary-tile"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>";
      }).join("") + "</dl>" +
      '<div><h4 class="font-extrabold text-sm text-slate-800 mb-2">السجل الزمني</h4><div class="space-y-2 text-sm">' +
      '<div class="flex items-start gap-2"><span class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span><div><div class="font-bold">تم الإنشاء</div><div class="text-xs text-slate-400 font-semibold">' + (t.createdAt || t.transactionDate) + " · " + (t.createdBy || "—") + "</div></div></div>" +
      (t.status === "confirmed" ? '<div class="flex items-start gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span><div><div class="font-bold">تم التأكيد</div><div class="text-xs text-slate-400 font-semibold">' + t.transactionDate + "</div></div></div>" : "") +
      (t.status === "cancelled" ? '<div class="flex items-start gap-2"><span class="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></span><div><div class="font-bold">تم الإلغاء</div></div></div>' : "") +
      "</div></div>";

    const actions = [];
    actions.push('<button type="button" class="btn btn-ghost" data-action="print-txn" data-id="' + t.id + '">طباعة الإيصال</button>');
    actions.push('<button type="button" class="btn btn-secondary" data-action="duplicate-txn" data-id="' + t.id + '">تكرار</button>');
    if (t.status === "draft") {
      actions.push('<button type="button" class="btn btn-ghost" data-action="edit-txn" data-id="' + t.id + '">تعديل المسودة</button>');
      actions.push('<button type="button" class="btn btn-primary" data-action="confirm-txn" data-id="' + t.id + '">تأكيد</button>');
    }
    if (t.status !== "cancelled" && FD.financePermissions.cancel) {
      actions.push('<button type="button" class="btn btn-danger" data-action="cancel-txn" data-id="' + t.id + '">إلغاء الحركة</button>');
    }
    document.getElementById("txn-details-actions").innerHTML = actions.join("");
  }

  function confirmTxn(id) {
    const t = FD.getTransactionById(id);
    if (!t || t.status !== "draft") return;
    if (t.type === "expense") {
      const acc = FD.getCashboxById(t.paymentAccountId);
      const availableBase = FD.toMinorUnits(acc.balance, t.currency);
      const neededBase = FD.toMinorUnits(t.amount, t.currency);
      if (neededBase > availableBase) { PMS.toast("لا يمكن التأكيد — الرصيد غير كافٍ"); return; }
    }
    FD.updateTransaction(id, { status: "confirmed" });
    applyTxnToCashbox(t);
    PMS.toast("تم تأكيد الحركة " + id);
    renderAll();
    renderTxnDetails(id);
  }

  function cancelTxn(id) {
    if (!FD.financePermissions.cancel) { PMS.toast("لا تملك صلاحية إلغاء الحركات"); return; }
    const t = FD.getTransactionById(id);
    if (!t || t.status === "cancelled") return;
    if (t.status === "confirmed") reverseTxnFromCashbox(t);
    FD.updateTransaction(id, { status: "cancelled" });
    PMS.toast("تم إلغاء الحركة " + id);
    renderAll();
    renderTxnDetails(id);
  }

  // ─── Cashboxes tab ─────────────────────────────────────────────────
  function cashboxCardHtml(c) {
    const prop = PD.getPropertyById(c.propertyId);
    const rate = c.currency === "USD" ? FD.getCurrentRate(c.propertyId, "USD", "SYP") : "1";
    const baseEquivalent = c.currency === "USD" && rate ? Number(c.balance) * Number(rate) : c.balance;
    const lastTxn = FD.getTransactions().filter(function (t) { return t.paymentAccountId === c.id; }).sort(function (a, b) { return a.transactionDate < b.transactionDate ? 1 : -1; })[0];
    return (
      '<article class="prop-card">' +
      '<div class="prop-card-top">' +
      '<div class="flex items-center gap-3 min-w-0">' +
      '<div class="prop-card-icon">' + (c.currency === "USD" ? "$" : "ل.س") + "</div>" +
      '<div class="min-w-0"><div class="font-extrabold text-slate-800 truncate">' + c.name + '</div><div class="text-xs text-slate-500 font-semibold truncate">' + (prop ? prop.name : c.propertyId) + "</div></div>" +
      "</div>" +
      '<span class="badge badge-neutral">' + c.currency + "</span>" +
      "</div>" +
      '<div class="prop-card-body">' +
      '<div class="prop-card-meta"><div class="prop-card-meta-label">الرصيد الحالي</div><div class="prop-card-meta-value">' + fmt(c.balance, c.currency) + "</div></div>" +
      (c.currency === "USD" ? '<div class="prop-card-meta"><div class="prop-card-meta-label">المعادل بالعملة الأساسية</div><div class="prop-card-meta-value">' + (rate ? fmt(baseEquivalent, "SYP") : "—") + "</div></div>" : "") +
      '<div class="text-xs text-slate-400 font-semibold">آخر حركة: ' + (lastTxn ? lastTxn.transactionDate : "لا توجد حركات") + "</div>" +
      '<button type="button" class="btn btn-secondary btn-sm w-full justify-center" data-action="view-account-txns" data-id="' + c.id + '">عرض الحركات</button>' +
      "</div>" +
      "</article>"
    );
  }
  function renderCashboxes() {
    const grid = el("cashbox-grid");
    if (!grid) return;
    const boxes = FD.getVisibleCashboxes();
    grid.innerHTML = boxes.map(cashboxCardHtml).join("");
    const empty = el("cashbox-empty");
    if (empty) empty.classList.toggle("hidden", boxes.length > 0);
  }

  // ─── Currency exchange modal ───────────────────────────────────────
  function populateExchangeForm() {
    const selectedProp = PD.getSelectedPropertyId();
    const defaultProp = selectedProp === "all" ? (assignedProps()[0] || {}).id : selectedProp;
    document.getElementById("x-property").innerHTML = propertyOptionsHtml(defaultProp);
    refreshExchangeAccounts();
    document.getElementById("x-date").value = todayISO();
    document.getElementById("x-from-amount").value = "";
    document.getElementById("x-actual-amount").value = "";
    document.getElementById("x-notes").value = "";
    recalcExchange();
  }
  function refreshExchangeAccounts() {
    const propertyId = document.getElementById("x-property").value;
    const boxes = FD.getCashboxesByProperty(propertyId).filter(function (c) { return c.status === "active"; });
    const opts = accountOptionsHtml(propertyId);
    document.getElementById("x-from-account").innerHTML = opts;
    document.getElementById("x-to-account").innerHTML = opts;
    // Default to a sensible USD -> SYP pair (matching the typical exchange use-case) when available.
    const usdBox = boxes.find(function (c) { return c.currency === "USD"; });
    const sypBox = boxes.find(function (c) { return c.currency === "SYP"; });
    if (usdBox) document.getElementById("x-from-account").value = usdBox.id;
    if (sypBox) document.getElementById("x-to-account").value = sypBox.id;
  }
  function recalcExchange() {
    const propertyId = document.getElementById("x-property").value;
    const fromAcc = FD.getCashboxById(document.getElementById("x-from-account").value);
    const toAcc = FD.getCashboxById(document.getElementById("x-to-account").value);
    const fromAmount = Number(document.getElementById("x-from-amount").value) || 0;
    if (!fromAcc || !toAcc) return;
    const rate = fromAcc.currency === "USD" ? FD.getCurrentRate(propertyId, "USD", "SYP") : (toAcc.currency === "USD" ? 1 / Number(FD.getCurrentRate(propertyId, "USD", "SYP") || 1) : 1);
    document.getElementById("x-book-rate").value = rate ? Number(rate).toLocaleString("en-US") : "—";
    const bookValueSyp = fromAcc.currency === "USD" ? fromAmount * Number(rate || 0) : fromAmount;
    document.getElementById("x-book-value").textContent = "القيمة الدفترية: " + fmt(bookValueSyp, "SYP");

    const actual = Number(document.getElementById("x-actual-amount").value) || 0;
    const actualSyp = toAcc.currency === "USD" ? actual * Number(FD.getCurrentRate(propertyId, "USD", "SYP") || 0) : actual;
    const diff = actualSyp - bookValueSyp;
    const el = document.getElementById("x-gain-loss");
    if (!actual) { el.textContent = "فرق الصرف: —"; el.className = "rounded-2xl p-3 text-sm font-extrabold bg-slate-50"; }
    else {
      el.textContent = (diff >= 0 ? "ربح صرف: +" : "خسارة صرف: ") + fmt(Math.abs(diff), "SYP");
      el.className = "rounded-2xl p-3 text-sm font-extrabold " + (diff >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700");
    }
  }
  function saveExchange() {
    const propertyId = document.getElementById("x-property").value;
    const fromAcc = FD.getCashboxById(document.getElementById("x-from-account").value);
    const toAcc = FD.getCashboxById(document.getElementById("x-to-account").value);
    const fromAmount = document.getElementById("x-from-amount").value;
    const actualAmount = document.getElementById("x-actual-amount").value;
    if (!fromAcc || !toAcc || fromAcc.id === toAcc.id) { PMS.toast("يرجى اختيار صندوقين مختلفين"); return; }
    if (!fromAmount || Number(fromAmount) <= 0) { PMS.toast("يرجى إدخال المبلغ المعطى"); return; }
    if (!actualAmount || Number(actualAmount) <= 0) { PMS.toast("يرجى إدخال المبلغ المستلم فعلياً"); return; }
    const availableBase = FD.toMinorUnits(fromAcc.balance, fromAcc.currency);
    const neededBase = FD.toMinorUnits(fromAmount, fromAcc.currency);
    if (neededBase > availableBase) { PMS.toast("الرصيد غير كافٍ في " + fromAcc.name); return; }

    const rate = FD.getCurrentRate(propertyId, "USD", "SYP") || "1";
    const date = document.getElementById("x-date").value || todayISO();
    const notes = document.getElementById("x-notes").value.trim();
    const ts = Date.now();

    FD.adjustCashboxBalance(fromAcc.id, fromAcc.currency, "-" + fromAmount);
    FD.adjustCashboxBalance(toAcc.id, toAcc.currency, actualAmount);

    FD.addTransaction({
      id: "TXN-" + ts + "-A", propertyId: propertyId, transactionDate: date, type: "exchange",
      category: "Currency Exchange", description: "تحويل من " + fromAcc.name + " إلى " + toAcc.name + (notes ? " — " + notes : ""),
      paymentAccountId: fromAcc.id, amount: fromAmount, currency: fromAcc.currency, exchangeRate: rate,
      baseCurrency: "SYP", baseAmount: String(FD.toMinorUnits(fromAmount, fromAcc.currency) * (fromAcc.currency === "USD" ? Math.round(Number(rate)) : 1) / (fromAcc.currency === "USD" ? 1 : 1)),
      exchangeRateDate: date, exchangeRateSource: "manual", referenceType: null, referenceId: null, status: "confirmed",
      createdBy: currentUser().firstName + " " + currentUser().lastName, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    });
    FD.addTransaction({
      id: "TXN-" + ts + "-B", propertyId: propertyId, transactionDate: date, type: "exchange",
      category: "Currency Exchange", description: "استلام من " + fromAcc.name + " إلى " + toAcc.name + (notes ? " — " + notes : ""),
      paymentAccountId: toAcc.id, amount: actualAmount, currency: toAcc.currency, exchangeRate: rate,
      baseCurrency: "SYP", baseAmount: String(FD.toMinorUnits(actualAmount, toAcc.currency) * (toAcc.currency === "USD" ? Math.round(Number(rate)) : 1) / (toAcc.currency === "USD" ? 1 : 1)),
      exchangeRateDate: date, exchangeRateSource: "manual", referenceType: null, referenceId: null, status: "confirmed",
      createdBy: currentUser().firstName + " " + currentUser().lastName, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    });

    PMS.toast("تم تنفيذ التحويل بنجاح");
    PMS.closeModal("exchange-modal");
    renderAll();
  }

  // ─── Exchange rates tab ────────────────────────────────────────────
  function renderRates() {
    const body = el("rates-table-body");
    if (!body) return;
    const homs = el("rate-current-homs");
    const halep = el("rate-current-halep");
    if (homs) homs.textContent = fmt(FD.getCurrentRate("HOMS1", "USD", "SYP") || 0, "SYP");
    if (halep) halep.textContent = fmt(FD.getCurrentRate("HALEP1", "USD", "SYP") || 0, "SYP");
    const rates = FD.getExchangeRates().sort(function (a, b) { return a.effectiveFrom < b.effectiveFrom ? 1 : -1; });
    body.innerHTML = rates.map(function (r) {
      const p = PD.getPropertyById(r.propertyId);
      return "<tr><td>" + r.effectiveFrom + "</td><td>" + (p ? p.name : r.propertyId) + "</td><td>" + r.fromCurrency + "</td><td>" + r.toCurrency + "</td>" +
        '<td class="font-extrabold">' + Number(r.rate).toLocaleString("en-US") + "</td><td>" + SOURCE_LABELS[r.source] + "</td><td>" + (r.createdBy || "—") + "</td>" +
        '<td><span class="badge ' + (r.status === "active" ? "badge-success" : "badge-neutral") + '">' + (r.status === "active" ? "فعّال" : "غير فعّال") + "</span></td></tr>";
    }).join("");
  }
  function openAddRateModal() {
    const selectedProp = PD.getSelectedPropertyId();
    document.getElementById("r-property").innerHTML = propertyOptionsHtml(selectedProp === "all" ? (assignedProps()[0] || {}).id : selectedProp);
    document.getElementById("r-rate").value = "";
    document.getElementById("r-date").value = todayISO();
    PMS.openModal("rate-modal");
  }
  function saveRate() {
    const rate = document.getElementById("r-rate").value;
    if (!rate || Number(rate) <= 0) { PMS.toast("يرجى إدخال سعر صرف صالح"); return; }
    FD.addExchangeRate({
      id: "RATE-" + Date.now(), propertyId: document.getElementById("r-property").value,
      fromCurrency: "USD", toCurrency: "SYP", rate: Number(rate).toFixed(6),
      effectiveFrom: document.getElementById("r-date").value || todayISO(),
      source: document.getElementById("r-source").value, createdBy: currentUser().firstName + " " + currentUser().lastName, status: "active",
    });
    PMS.toast("تم إضافة سعر الصرف الجديد");
    PMS.closeModal("rate-modal");
    renderAll();
  }

  // ─── Categories tab ────────────────────────────────────────────────
  function categoryRowHtml(c) {
    const chips = c.propertyIds.map(function (pid) { const p = PD.getPropertyById(pid); return '<span class="mini-chip">' + (p ? p.code : pid) + "</span>"; }).join(" ");
    return (
      '<li class="px-5 py-3.5 flex items-center justify-between gap-3">' +
      '<div class="min-w-0"><div class="font-extrabold text-slate-800 truncate">' + c.name + '</div>' +
      '<div class="flex items-center gap-1.5 mt-1 flex-wrap"><span class="text-xs text-slate-400 font-semibold">' + (c.accountingCode || "—") + "</span>" + chips + "</div></div>" +
      '<div class="flex items-center gap-2 shrink-0">' +
      "<span class=\"badge " + (c.status === "active" ? "badge-success" : "badge-neutral") + "\">" + (c.status === "active" ? "فعّالة" : "معطّلة") + "</span>" +
      '<button type="button" class="icon-btn" data-action="edit-category" data-id="' + c.id + '" title="تعديل" aria-label="تعديل"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button type="button" class="icon-btn" data-action="toggle-category" data-id="' + c.id + '" title="' + (c.status === "active" ? "تعطيل" : "تفعيل") + '" aria-label="تبديل الحالة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      "</div></li>"
    );
  }
  function renderCategories() {
    const incomeList = el("cat-income-list");
    const expenseList = el("cat-expense-list");
    if (!incomeList || !expenseList) return;
    const cats = FD.getCategories();
    incomeList.innerHTML = cats.filter(function (c) { return c.type === "income"; }).map(categoryRowHtml).join("");
    expenseList.innerHTML = cats.filter(function (c) { return c.type === "expense"; }).map(categoryRowHtml).join("");
  }
  let editingCategoryId = null;
  function categoryPropertyPickersHtml(selectedIds) {
    return assignedProps().map(function (p) {
      const checked = (selectedIds || []).indexOf(p.id) !== -1;
      return '<label class="property-pick-card' + (checked ? " is-active" : "") + '"><input type="checkbox" data-cat-property value="' + p.id + '" ' + (checked ? "checked" : "") + " /><span>" + p.name + "</span></label>";
    }).join("");
  }
  function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById("cat-modal-title").textContent = "إضافة فئة";
    document.getElementById("c-name").value = "";
    document.getElementById("c-type").value = "income";
    document.getElementById("c-code").value = "";
    document.getElementById("c-properties").innerHTML = categoryPropertyPickersHtml(assignedProps().map(function (p) { return p.id; }));
    PMS.openModal("category-modal");
  }
  function openEditCategoryModal(id) {
    const c = FD.getCategories().find(function (x) { return x.id === id; });
    if (!c) return;
    editingCategoryId = id;
    document.getElementById("cat-modal-title").textContent = "تعديل فئة";
    document.getElementById("c-name").value = c.name;
    document.getElementById("c-type").value = c.type;
    document.getElementById("c-code").value = c.accountingCode || "";
    document.getElementById("c-properties").innerHTML = categoryPropertyPickersHtml(c.propertyIds);
    PMS.openModal("category-modal");
  }
  function saveCategory() {
    const name = document.getElementById("c-name").value.trim();
    if (!name) { PMS.toast("يرجى إدخال اسم الفئة"); return; }
    const propertyIds = Array.from(document.querySelectorAll("[data-cat-property]:checked")).map(function (el) { return el.value; });
    const payload = { name: name, type: document.getElementById("c-type").value, accountingCode: document.getElementById("c-code").value.trim(), propertyIds: propertyIds };
    if (editingCategoryId) {
      FD.updateCategory(editingCategoryId, payload);
      PMS.toast("تم حفظ تعديلات الفئة");
    } else {
      payload.id = "CAT-" + Date.now();
      payload.status = "active";
      FD.addCategory(payload);
      PMS.toast("تمت إضافة الفئة");
    }
    PMS.closeModal("category-modal");
    renderCategories();
    if (el("f-category")) {
      populateFilterSelects();
      renderActiveFilterChips();
    }
  }

  function applyAccountQueryFilter() {
    try {
      const params = new URLSearchParams(window.location.search);
      const account = params.get("account");
      if (!account || !el("f-account")) return;
      el("f-account").value = account;
      if (typeof syncSelectLabel === "function") syncSelectLabel("f-account");
    } catch (err) { /* ignore */ }
  }

  // ─── master render ─────────────────────────────────────────────────
  function renderAll() {
    if (page === "finance-transactions") {
      renderActiveFilterChips();
      renderSummary();
      renderCharts();
      renderTransactionsList();
      return;
    }
    if (page === "finance-cashboxes") {
      renderCashboxes();
      return;
    }
    if (page === "finance-rates") {
      renderRates();
      return;
    }
    if (page === "finance-categories") {
      renderCategories();
    }
  }

  // ─── wiring ────────────────────────────────────────────────────────
  // Prefill drawer selects before app.js enhances them on DOMContentLoaded.
  if (el("t-property")) {
    const selectedProp = PD.getSelectedPropertyId();
    const defaultProp = selectedProp === "all" ? (assignedProps()[0] || {}).id : selectedProp;
    el("t-property").innerHTML = propertyOptionsHtml(defaultProp);
    if (el("t-category")) el("t-category").innerHTML = categoryOptionsHtml("income");
    if (el("t-account")) el("t-account").innerHTML = accountOptionsHtml(defaultProp);
    if (el("t-date") && !el("t-date").value) setDateField("t-date", todayISO());
  }

  // Populate dynamic filter options before app.js enhances selects (same tick after DOM parse).
  if (el("f-category")) populateFilterSelects();

  document.addEventListener("DOMContentLoaded", function () {
    if (page === "finance-transactions") applyAccountQueryFilter();
    renderAll();

    if (page === "finance-transactions") {
      on("f-search", "input", renderAll);
      ["f-type", "f-category", "f-currency", "f-account", "f-status", "f-property", "f-from", "f-to", "date-range"].forEach(function (id) {
        on(id, "change", renderAll);
      });
      document.querySelectorAll(".fin-filters [data-datepicker]").forEach(function (field) {
        field.addEventListener("datepicker:change", renderAll);
      });
      on("clear-filters-top", "click", clearAllFilters);
      on("add-txn-btn", "click", openAddTxnDrawer);
      on("add-txn-btn-mobile", "click", openAddTxnDrawer);
      on("export-btn", "click", function () { PMS.toast("تم تصدير البيانات (تجريبي)"); });

      on("t-property", "change", function () {
        setSelectHtml("t-account", accountOptionsHtml(this.value));
        recalcTxnBase();
      });
      on("t-type", "change", function () {
        setSelectHtml("t-category", categoryOptionsHtml(this.value === "expense" ? "expense" : "income"));
        const statusSec = el("t-status-section");
        if (statusSec) statusSec.classList.toggle("hidden", false);
      });
      on("t-account", "change", recalcTxnBase);
      on("t-amount", "input", recalcTxnBase);
      on("t-rate", "input", function () { this.dataset.touched = "1"; recalcTxnBase(); });
      on("t-date", "change", recalcTxnBase);
      const txnDateField = document.querySelector("#txn-drawer [data-datepicker]");
      if (txnDateField) {
        txnDateField.addEventListener("datepicker:change", recalcTxnBase);
      }
      on("t-save-draft", "click", function () { saveTxn("draft"); });
      on("t-save-confirm", "click", function () { saveTxn("confirmed"); });
    }

    if (page === "finance-cashboxes") {
      on("add-exchange-btn", "click", function () { populateExchangeForm(); PMS.openModal("exchange-modal"); });
      on("x-property", "change", function () { refreshExchangeAccounts(); recalcExchange(); });
      on("x-from-account", "change", recalcExchange);
      on("x-to-account", "change", recalcExchange);
      on("x-from-amount", "input", recalcExchange);
      on("x-actual-amount", "input", recalcExchange);
      on("x-save-btn", "click", saveExchange);
    }

    if (page === "finance-rates") {
      on("add-rate-btn", "click", openAddRateModal);
      on("r-save-btn", "click", saveRate);
    }

    if (page === "finance-categories") {
      on("add-category-btn", "click", openAddCategoryModal);
      on("c-save-btn", "click", saveCategory);
      on("c-properties", "click", function (e) {
        const label = e.target.closest(".property-pick-card");
        if (!label) return;
        window.setTimeout(function () { label.classList.toggle("is-active", label.querySelector("input").checked); }, 0);
      });
    }

    document.body.addEventListener("click", function (e) {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (action === "view-txn") { renderTxnDetails(id); PMS.openDrawer("txn-details-drawer"); }
      if (action === "edit-txn") { PMS.closeDrawer(); openEditTxnDrawer(id); }
      if (action === "duplicate-txn") { openDuplicateTxnDrawer(id); }
      if (action === "confirm-txn") { confirmTxn(id); }
      if (action === "cancel-txn") { cancelTxn(id); }
      if (action === "print-txn") { PMS.toast("تم إرسال الإيصال للطباعة (تجريبي)"); }
      if (action === "view-account-txns") {
        window.location.href = "finance-transactions.html?account=" + encodeURIComponent(id);
      }
      if (action === "edit-category") openEditCategoryModal(id);
      if (action === "toggle-category") {
        const c = FD.getCategories().find(function (x) { return x.id === id; });
        if (c) { FD.updateCategory(id, { status: c.status === "active" ? "disabled" : "active" }); renderCategories(); }
      }
    });

    window.addEventListener("pms:property-changed", renderAll);
  });
})();
