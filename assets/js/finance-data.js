/**
 * Marhaba PMS — multi-currency finance (income & expenses) mock data.
 * Loaded after pms-data.js (reuses PMSData for property access control).
 */
(function () {
  "use strict";

  const LS_TXN = "pms_transactions";
  const LS_CASHBOXES = "pms_cashboxes";
  const LS_RATES = "pms_exchange_rates";
  const LS_CATEGORIES = "pms_finance_categories";

  const currencySettings = {
    baseCurrency: "SYP",
    supportedCurrencies: ["SYP", "USD"],
    currencies: {
      SYP: { code: "SYP", name: "Syrian Pound", symbol: "ل.س", decimalPlaces: 0 },
      USD: { code: "USD", name: "US Dollar", symbol: "$", decimalPlaces: 2 },
    },
  };

  const financePermissions = {
    view: true,
    createIncome: true,
    createExpense: true,
    editDraft: true,
    confirm: true,
    cancel: false,
    manageRates: true,
    export: true,
  };

  const DEFAULT_CASHBOXES = [
    { id: "HOMS-CASH-SYP", propertyId: "HOMS1", name: "Homs – Cash SYP", type: "cash", currency: "SYP", balance: "8500000", status: "active" },
    { id: "HOMS-CASH-USD", propertyId: "HOMS1", name: "Homs – Cash USD", type: "cash", currency: "USD", balance: "1250.00", status: "active" },
    { id: "HOMS-BANK-SYP", propertyId: "HOMS1", name: "Homs – Bank SYP", type: "bank", currency: "SYP", balance: "12000000", status: "active" },
    { id: "HALEP-CASH-SYP", propertyId: "HALEP1", name: "Halep – Cash SYP", type: "cash", currency: "SYP", balance: "4200000", status: "active" },
    { id: "HALEP-CASH-USD", propertyId: "HALEP1", name: "Halep – Cash USD", type: "cash", currency: "USD", balance: "600.00", status: "active" },
    { id: "HALEP-BANK-SYP", propertyId: "HALEP1", name: "Halep – Bank SYP", type: "bank", currency: "SYP", balance: "3000000", status: "active" },
  ];

  const DEFAULT_RATES = [
    { id: "RATE-1001", propertyId: "HOMS1", fromCurrency: "USD", toCurrency: "SYP", rate: "11500.000000", effectiveFrom: "2026-07-30", source: "manual", createdBy: "Mohammed Aslan", status: "active" },
    { id: "RATE-1000", propertyId: "HOMS1", fromCurrency: "USD", toCurrency: "SYP", rate: "11350.000000", effectiveFrom: "2026-07-15", source: "exchange-office", createdBy: "Mohammed Aslan", status: "active" },
    { id: "RATE-1002", propertyId: "HALEP1", fromCurrency: "USD", toCurrency: "SYP", rate: "11480.000000", effectiveFrom: "2026-07-30", source: "manual", createdBy: "Khaled Al-Harbi", status: "active" },
  ];

  const DEFAULT_CATEGORIES = [
    { id: "CAT-INC-01", name: "Room Revenue", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4000" },
    { id: "CAT-INC-02", name: "Restaurant Revenue", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4010" },
    { id: "CAT-INC-03", name: "Laundry Revenue", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4020" },
    { id: "CAT-INC-04", name: "Extra Services", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4030" },
    { id: "CAT-INC-05", name: "Late Checkout", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4040" },
    { id: "CAT-INC-06", name: "Cancellation Fee", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4050" },
    { id: "CAT-INC-07", name: "Other Income", type: "income", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "4090" },
    { id: "CAT-EXP-01", name: "Housekeeping Supplies", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5000" },
    { id: "CAT-EXP-02", name: "Maintenance", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5010" },
    { id: "CAT-EXP-03", name: "Utilities", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5020" },
    { id: "CAT-EXP-04", name: "Salaries", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5030" },
    { id: "CAT-EXP-05", name: "Food and Beverage", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5040" },
    { id: "CAT-EXP-06", name: "Transportation", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5050" },
    { id: "CAT-EXP-07", name: "Marketing", type: "expense", status: "active", propertyIds: ["HOMS1"], accountingCode: "5060" },
    { id: "CAT-EXP-08", name: "Other Expenses", type: "expense", status: "active", propertyIds: ["HOMS1", "HALEP1"], accountingCode: "5090" },
  ];

  const DEFAULT_TRANSACTIONS = [
    { id: "TXN-1001", propertyId: "HOMS1", transactionDate: "2026-07-30", type: "income", category: "Room Revenue", description: "Room payment for reservation RES-1001", paymentAccountId: "HOMS-CASH-USD", amount: "100.00", currency: "USD", exchangeRate: "11500.000000", baseCurrency: "SYP", baseAmount: "1150000", exchangeRateDate: "2026-07-30", exchangeRateSource: "manual", referenceType: "Reservation", referenceId: "RES-1001", status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-30 09:20" },
    { id: "TXN-1002", propertyId: "HOMS1", transactionDate: "2026-07-30", type: "expense", category: "Housekeeping Supplies", description: "Cleaning materials", paymentAccountId: "HOMS-CASH-USD", amount: "20.00", currency: "USD", exchangeRate: "11500.000000", baseCurrency: "SYP", baseAmount: "230000", exchangeRateDate: "2026-07-30", exchangeRateSource: "manual", referenceType: null, referenceId: null, status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-30 10:05" },
    { id: "TXN-1003", propertyId: "HALEP1", transactionDate: "2026-07-30", type: "income", category: "Room Revenue", description: "Cash room payment", paymentAccountId: "HALEP-CASH-SYP", amount: "800000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "800000", exchangeRateDate: "2026-07-30", exchangeRateSource: "base-currency", referenceType: "Reservation", referenceId: "RES-2001", status: "confirmed", createdBy: "Khaled Al-Harbi", createdAt: "2026-07-30 11:40" },
    { id: "TXN-1004", propertyId: "HOMS1", transactionDate: "2026-07-29", type: "expense", category: "Utilities", description: "فاتورة كهرباء تموز", paymentAccountId: "HOMS-BANK-SYP", amount: "650000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "650000", exchangeRateDate: "2026-07-29", exchangeRateSource: "base-currency", referenceType: null, referenceId: null, status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-29 16:10" },
    { id: "TXN-1005", propertyId: "HOMS1", transactionDate: "2026-07-29", type: "expense", category: "Salaries", description: "رواتب موظفي الاستقبال", paymentAccountId: "HOMS-BANK-SYP", amount: "2500000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "2500000", exchangeRateDate: "2026-07-29", exchangeRateSource: "base-currency", referenceType: null, referenceId: null, status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-29 17:00" },
    { id: "TXN-1006", propertyId: "HALEP1", transactionDate: "2026-07-28", type: "expense", category: "Maintenance", description: "صيانة مصعد", paymentAccountId: "HALEP-CASH-SYP", amount: "300000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "300000", exchangeRateDate: "2026-07-28", exchangeRateSource: "base-currency", referenceType: null, referenceId: null, status: "confirmed", createdBy: "Khaled Al-Harbi", createdAt: "2026-07-28 12:30" },
    { id: "TXN-1007", propertyId: "HOMS1", transactionDate: "2026-07-28", type: "income", category: "Restaurant Revenue", description: "إيراد المطعم اليومي", paymentAccountId: "HOMS-CASH-USD", amount: "45.00", currency: "USD", exchangeRate: "11350.000000", baseCurrency: "SYP", baseAmount: "510750", exchangeRateDate: "2026-07-28", exchangeRateSource: "exchange-office", referenceType: null, referenceId: null, status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-28 21:15" },
    { id: "TXN-1008", propertyId: "HALEP1", transactionDate: "2026-07-30", type: "income", category: "Late Checkout", description: "رسوم تأخير مغادرة", paymentAccountId: "HALEP-CASH-USD", amount: "15.00", currency: "USD", exchangeRate: "11480.000000", baseCurrency: "SYP", baseAmount: "172200", exchangeRateDate: "2026-07-30", exchangeRateSource: "manual", referenceType: "Reservation", referenceId: "RES-2004", status: "draft", createdBy: "Khaled Al-Harbi", createdAt: "2026-07-30 13:05" },
    { id: "TXN-1009", propertyId: "HOMS1", transactionDate: "2026-07-27", type: "expense", category: "Marketing", description: "إعلانات مواقع الحجز", paymentAccountId: "HOMS-BANK-SYP", amount: "400000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "400000", exchangeRateDate: "2026-07-27", exchangeRateSource: "base-currency", referenceType: null, referenceId: null, status: "cancelled", createdBy: "Mohammed Aslan", createdAt: "2026-07-27 10:00" },
    { id: "TXN-1010", propertyId: "HOMS1", transactionDate: "2026-07-26", type: "income", category: "Cancellation Fee", description: "رسوم إلغاء حجز", paymentAccountId: "HOMS-CASH-SYP", amount: "150000", currency: "SYP", exchangeRate: "1.000000", baseCurrency: "SYP", baseAmount: "150000", exchangeRateDate: "2026-07-26", exchangeRateSource: "base-currency", referenceType: "Reservation", referenceId: "RES-0998", status: "confirmed", createdBy: "Mohammed Aslan", createdAt: "2026-07-26 09:45" },
  ];

  // ─── storage helpers ────────────────────────────────────────────────
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function getTransactions() {
    let list = readJSON(LS_TXN, null);
    if (!list) { list = DEFAULT_TRANSACTIONS.slice(); writeJSON(LS_TXN, list); }
    return list;
  }
  function saveTransactions(list) { writeJSON(LS_TXN, list); }
  function getTransactionById(id) { return getTransactions().find(function (t) { return t.id === id; }) || null; }
  function addTransaction(txn) { const list = getTransactions(); list.push(txn); saveTransactions(list); return txn; }
  function updateTransaction(id, patch) {
    const list = getTransactions();
    const idx = list.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    saveTransactions(list);
    return list[idx];
  }

  function getCashboxes() {
    let list = readJSON(LS_CASHBOXES, null);
    if (!list) { list = DEFAULT_CASHBOXES.slice(); writeJSON(LS_CASHBOXES, list); }
    return list;
  }
  function saveCashboxes(list) { writeJSON(LS_CASHBOXES, list); }
  function getCashboxById(id) { return getCashboxes().find(function (c) { return c.id === id; }) || null; }
  function getCashboxesByProperty(propertyId) { return getCashboxes().filter(function (c) { return c.propertyId === propertyId; }); }

  function decimalsFor(currency) {
    return (currencySettings.currencies[currency] || {}).decimalPlaces ?? 2;
  }
  function toMinorUnits(amountStr, currency) {
    const d = decimalsFor(currency);
    return Math.round(Number(amountStr) * Math.pow(10, d));
  }
  function fromMinorUnits(minor, currency) {
    const d = decimalsFor(currency);
    return (minor / Math.pow(10, d)).toFixed(d);
  }

  function adjustCashboxBalance(cashboxId, currency, deltaAmountStr) {
    const list = getCashboxes();
    const idx = list.findIndex(function (c) { return c.id === cashboxId; });
    if (idx === -1) return null;
    const current = toMinorUnits(list[idx].balance, currency);
    const delta = toMinorUnits(deltaAmountStr, currency);
    list[idx] = Object.assign({}, list[idx], { balance: fromMinorUnits(current + delta, currency) });
    saveCashboxes(list);
    return list[idx];
  }

  function getExchangeRates() {
    let list = readJSON(LS_RATES, null);
    if (!list) { list = DEFAULT_RATES.slice(); writeJSON(LS_RATES, list); }
    return list;
  }
  function saveExchangeRates(list) { writeJSON(LS_RATES, list); }
  function addExchangeRate(rate) { const list = getExchangeRates(); list.push(rate); saveExchangeRates(list); return rate; }
  function getLatestRate(propertyId, fromCurrency, toCurrency, asOfDate) {
    if (fromCurrency === toCurrency) return "1.000000";
    const candidates = getExchangeRates()
      .filter(function (r) {
        return r.propertyId === propertyId && r.fromCurrency === fromCurrency && r.toCurrency === toCurrency &&
          r.status === "active" && r.effectiveFrom <= (asOfDate || "9999-12-31");
      })
      .sort(function (a, b) { return b.effectiveFrom < a.effectiveFrom ? -1 : 1; });
    return candidates.length ? candidates[0].rate : null;
  }
  function getCurrentRate(propertyId, fromCurrency, toCurrency) {
    return getLatestRate(propertyId, fromCurrency, toCurrency, new Date().toISOString().slice(0, 10));
  }

  function getCategories() {
    let list = readJSON(LS_CATEGORIES, null);
    if (!list) { list = DEFAULT_CATEGORIES.slice(); writeJSON(LS_CATEGORIES, list); }
    return list;
  }
  function saveCategories(list) { writeJSON(LS_CATEGORIES, list); }
  function addCategory(cat) { const list = getCategories(); list.push(cat); saveCategories(list); return cat; }
  function updateCategory(id, patch) {
    const list = getCategories();
    const idx = list.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    saveCategories(list);
    return list[idx];
  }

  function getVisibleTransactions() {
    const PD = window.PMSData;
    const user = PD.getCurrentUser();
    const selected = PD.getSelectedPropertyId();
    return getTransactions().filter(function (t) {
      if (!PD.canAccessProperty(user, t.propertyId)) return false;
      return selected === "all" ? true : t.propertyId === selected;
    });
  }
  function getVisibleCashboxes() {
    const PD = window.PMSData;
    const user = PD.getCurrentUser();
    const selected = PD.getSelectedPropertyId();
    return getCashboxes().filter(function (c) {
      if (!PD.canAccessProperty(user, c.propertyId)) return false;
      return selected === "all" ? true : c.propertyId === selected;
    });
  }

  function formatMoney(amount, currency) {
    const decimals = currency === "SYP" ? 0 : 2;
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(amount));
  }
  function formatMoneyWithSymbol(amount, currency) {
    const sym = (currencySettings.currencies[currency] || {}).symbol || currency;
    const num = formatMoney(amount, currency);
    return currency === "USD" ? sym + num : num + " " + sym;
  }

  function resetFinanceData() {
    try {
      localStorage.removeItem(LS_TXN);
      localStorage.removeItem(LS_CASHBOXES);
      localStorage.removeItem(LS_RATES);
      localStorage.removeItem(LS_CATEGORIES);
    } catch (_) {}
    location.reload();
  }

  window.FinanceData = {
    currencySettings: currencySettings,
    financePermissions: financePermissions,
    INCOME_CATEGORY_NAMES: ["Room Revenue", "Restaurant Revenue", "Laundry Revenue", "Extra Services", "Late Checkout", "Cancellation Fee", "Other Income"],
    EXPENSE_CATEGORY_NAMES: ["Housekeeping Supplies", "Maintenance", "Utilities", "Salaries", "Food and Beverage", "Transportation", "Marketing", "Other Expenses"],

    getTransactions: getTransactions,
    saveTransactions: saveTransactions,
    getTransactionById: getTransactionById,
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    getVisibleTransactions: getVisibleTransactions,

    getCashboxes: getCashboxes,
    saveCashboxes: saveCashboxes,
    getCashboxById: getCashboxById,
    getCashboxesByProperty: getCashboxesByProperty,
    getVisibleCashboxes: getVisibleCashboxes,
    adjustCashboxBalance: adjustCashboxBalance,

    getExchangeRates: getExchangeRates,
    saveExchangeRates: saveExchangeRates,
    addExchangeRate: addExchangeRate,
    getLatestRate: getLatestRate,
    getCurrentRate: getCurrentRate,

    getCategories: getCategories,
    saveCategories: saveCategories,
    addCategory: addCategory,
    updateCategory: updateCategory,

    toMinorUnits: toMinorUnits,
    fromMinorUnits: fromMinorUnits,
    formatMoney: formatMoney,
    formatMoneyWithSymbol: formatMoneyWithSymbol,

    resetFinanceData: resetFinanceData,
  };
})();
