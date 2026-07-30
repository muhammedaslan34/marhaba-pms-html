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
    {
      group: null,
      id: "finance",
      href: "finance-transactions.html",
      label: "الإيرادات والمصروفات",
      icon: "cashFlow",
      children: [
        { id: "finance-transactions", href: "finance-transactions.html", label: "الحركات المالية" },
        { id: "finance-cashboxes", href: "finance-cashboxes.html", label: "الصناديق" },
        { id: "finance-rates", href: "finance-rates.html", label: "أسعار الصرف" },
        { id: "finance-categories", href: "finance-categories.html", label: "الفئات" },
      ],
    },
    { group: null, id: "cashier", href: "cashier.html", label: "الصندوق والورديات", icon: "cash" },
    { group: null, id: "reports", href: "reports.html", label: "التقارير", icon: "chart" },
    { group: "إدارة المنشآت", id: "properties", href: "properties.html", label: "المنشآت", icon: "building" },
    { group: null, id: "users", href: "users.html", label: "المستخدمون", icon: "userCog" },
    { group: null, id: "roles", href: "roles-permissions.html", label: "الأدوار والصلاحيات", icon: "shield" },
    { group: "الإدارة", id: "settings", href: "settings.html", label: "الإعدادات", icon: "settings" },
  ];

  // Multi-property identity/data lives in pms-data.js (loaded before this file).
  const PD = window.PMSData;
  const CURRENT_USER = PD.getCurrentUser();
  const USER = {
    name: CURRENT_USER.firstName + " " + CURRENT_USER.lastName,
    role: CURRENT_USER.roleLabel || "مستخدم",
    email: CURRENT_USER.email,
    initial: CURRENT_USER.firstName.charAt(0).toUpperCase(),
  };

  // Combined country data: dial code (for phone) + demonym nat/natEn (for nationality)
  const COUNTRIES = [
    { iso: "SA", flag: "🇸🇦", dial: "+966", name: "السعودية", nameEn: "Saudi Arabia", nat: "سعودي", natEn: "Saudi" },
    { iso: "AE", flag: "🇦🇪", dial: "+971", name: "الإمارات", nameEn: "United Arab Emirates", nat: "إماراتي", natEn: "Emirati" },
    { iso: "KW", flag: "🇰🇼", dial: "+965", name: "الكويت", nameEn: "Kuwait", nat: "كويتي", natEn: "Kuwaiti" },
    { iso: "QA", flag: "🇶🇦", dial: "+974", name: "قطر", nameEn: "Qatar", nat: "قطري", natEn: "Qatari" },
    { iso: "BH", flag: "🇧🇭", dial: "+973", name: "البحرين", nameEn: "Bahrain", nat: "بحريني", natEn: "Bahraini" },
    { iso: "OM", flag: "🇴🇲", dial: "+968", name: "عُمان", nameEn: "Oman", nat: "عماني", natEn: "Omani" },
    { iso: "EG", flag: "🇪🇬", dial: "+20", name: "مصر", nameEn: "Egypt", nat: "مصري", natEn: "Egyptian" },
    { iso: "JO", flag: "🇯🇴", dial: "+962", name: "الأردن", nameEn: "Jordan", nat: "أردني", natEn: "Jordanian" },
    { iso: "PS", flag: "🇵🇸", dial: "+970", name: "فلسطين", nameEn: "Palestine", nat: "فلسطيني", natEn: "Palestinian" },
    { iso: "LB", flag: "🇱🇧", dial: "+961", name: "لبنان", nameEn: "Lebanon", nat: "لبناني", natEn: "Lebanese" },
    { iso: "SY", flag: "🇸🇾", dial: "+963", name: "سوريا", nameEn: "Syria", nat: "سوري", natEn: "Syrian" },
    { iso: "IQ", flag: "🇮🇶", dial: "+964", name: "العراق", nameEn: "Iraq", nat: "عراقي", natEn: "Iraqi" },
    { iso: "YE", flag: "🇾🇪", dial: "+967", name: "اليمن", nameEn: "Yemen", nat: "يمني", natEn: "Yemeni" },
    { iso: "SD", flag: "🇸🇩", dial: "+249", name: "السودان", nameEn: "Sudan", nat: "سوداني", natEn: "Sudanese" },
    { iso: "LY", flag: "🇱🇾", dial: "+218", name: "ليبيا", nameEn: "Libya", nat: "ليبي", natEn: "Libyan" },
    { iso: "TN", flag: "🇹🇳", dial: "+216", name: "تونس", nameEn: "Tunisia", nat: "تونسي", natEn: "Tunisian" },
    { iso: "DZ", flag: "🇩🇿", dial: "+213", name: "الجزائر", nameEn: "Algeria", nat: "جزائري", natEn: "Algerian" },
    { iso: "MA", flag: "🇲🇦", dial: "+212", name: "المغرب", nameEn: "Morocco", nat: "مغربي", natEn: "Moroccan" },
    { iso: "MR", flag: "🇲🇷", dial: "+222", name: "موريتانيا", nameEn: "Mauritania", nat: "موريتاني", natEn: "Mauritanian" },
    { iso: "SO", flag: "🇸🇴", dial: "+252", name: "الصومال", nameEn: "Somalia", nat: "صومالي", natEn: "Somali" },
    { iso: "DJ", flag: "🇩🇯", dial: "+253", name: "جيبوتي", nameEn: "Djibouti", nat: "جيبوتي", natEn: "Djiboutian" },
    { iso: "KM", flag: "🇰🇲", dial: "+269", name: "جزر القمر", nameEn: "Comoros", nat: "قمري", natEn: "Comorian" },
    { iso: "TR", flag: "🇹🇷", dial: "+90", name: "تركيا", nameEn: "Turkey", nat: "تركي", natEn: "Turkish" },
    { iso: "IR", flag: "🇮🇷", dial: "+98", name: "إيران", nameEn: "Iran", nat: "إيراني", natEn: "Iranian" },
    { iso: "US", flag: "🇺🇸", dial: "+1", name: "الولايات المتحدة", nameEn: "United States", nat: "أمريكي", natEn: "American" },
    { iso: "GB", flag: "🇬🇧", dial: "+44", name: "المملكة المتحدة", nameEn: "United Kingdom", nat: "بريطاني", natEn: "British" },
    { iso: "FR", flag: "🇫🇷", dial: "+33", name: "فرنسا", nameEn: "France", nat: "فرنسي", natEn: "French" },
    { iso: "DE", flag: "🇩🇪", dial: "+49", name: "ألمانيا", nameEn: "Germany", nat: "ألماني", natEn: "German" },
    { iso: "IT", flag: "🇮🇹", dial: "+39", name: "إيطاليا", nameEn: "Italy", nat: "إيطالي", natEn: "Italian" },
    { iso: "ES", flag: "🇪🇸", dial: "+34", name: "إسبانيا", nameEn: "Spain", nat: "إسباني", natEn: "Spanish" },
    { iso: "NL", flag: "🇳🇱", dial: "+31", name: "هولندا", nameEn: "Netherlands", nat: "هولندي", natEn: "Dutch" },
    { iso: "BE", flag: "🇧🇪", dial: "+32", name: "بلجيكا", nameEn: "Belgium", nat: "بلجيكي", natEn: "Belgian" },
    { iso: "CH", flag: "🇨🇭", dial: "+41", name: "سويسرا", nameEn: "Switzerland", nat: "سويسري", natEn: "Swiss" },
    { iso: "AT", flag: "🇦🇹", dial: "+43", name: "النمسا", nameEn: "Austria", nat: "نمساوي", natEn: "Austrian" },
    { iso: "SE", flag: "🇸🇪", dial: "+46", name: "السويد", nameEn: "Sweden", nat: "سويدي", natEn: "Swedish" },
    { iso: "NO", flag: "🇳🇴", dial: "+47", name: "النرويج", nameEn: "Norway", nat: "نرويجي", natEn: "Norwegian" },
    { iso: "DK", flag: "🇩🇰", dial: "+45", name: "الدنمارك", nameEn: "Denmark", nat: "دنماركي", natEn: "Danish" },
    { iso: "FI", flag: "🇫🇮", dial: "+358", name: "فنلندا", nameEn: "Finland", nat: "فنلندي", natEn: "Finnish" },
    { iso: "IE", flag: "🇮🇪", dial: "+353", name: "أيرلندا", nameEn: "Ireland", nat: "أيرلندي", natEn: "Irish" },
    { iso: "PT", flag: "🇵🇹", dial: "+351", name: "البرتغال", nameEn: "Portugal", nat: "برتغالي", natEn: "Portuguese" },
    { iso: "GR", flag: "🇬🇷", dial: "+30", name: "اليونان", nameEn: "Greece", nat: "يوناني", natEn: "Greek" },
    { iso: "PL", flag: "🇵🇱", dial: "+48", name: "بولندا", nameEn: "Poland", nat: "بولندي", natEn: "Polish" },
    { iso: "RU", flag: "🇷🇺", dial: "+7", name: "روسيا", nameEn: "Russia", nat: "روسي", natEn: "Russian" },
    { iso: "UA", flag: "🇺🇦", dial: "+380", name: "أوكرانيا", nameEn: "Ukraine", nat: "أوكراني", natEn: "Ukrainian" },
    { iso: "RO", flag: "🇷🇴", dial: "+40", name: "رومانيا", nameEn: "Romania", nat: "روماني", natEn: "Romanian" },
    { iso: "CZ", flag: "🇨🇿", dial: "+420", name: "التشيك", nameEn: "Czech Republic", nat: "تشيكي", natEn: "Czech" },
    { iso: "IN", flag: "🇮🇳", dial: "+91", name: "الهند", nameEn: "India", nat: "هندي", natEn: "Indian" },
    { iso: "PK", flag: "🇵🇰", dial: "+92", name: "باكستان", nameEn: "Pakistan", nat: "باكستاني", natEn: "Pakistani" },
    { iso: "BD", flag: "🇧🇩", dial: "+880", name: "بنغلاديش", nameEn: "Bangladesh", nat: "بنغلاديشي", natEn: "Bangladeshi" },
    { iso: "ID", flag: "🇮🇩", dial: "+62", name: "إندونيسيا", nameEn: "Indonesia", nat: "إندونيسي", natEn: "Indonesian" },
    { iso: "MY", flag: "🇲🇾", dial: "+60", name: "ماليزيا", nameEn: "Malaysia", nat: "ماليزي", natEn: "Malaysian" },
    { iso: "TH", flag: "🇹🇭", dial: "+66", name: "تايلاند", nameEn: "Thailand", nat: "تايلاندي", natEn: "Thai" },
    { iso: "PH", flag: "🇵🇭", dial: "+63", name: "الفلبين", nameEn: "Philippines", nat: "فلبيني", natEn: "Filipino" },
    { iso: "VN", flag: "🇻🇳", dial: "+84", name: "فيتنام", nameEn: "Vietnam", nat: "فيتنامي", natEn: "Vietnamese" },
    { iso: "CN", flag: "🇨🇳", dial: "+86", name: "الصين", nameEn: "China", nat: "صيني", natEn: "Chinese" },
    { iso: "JP", flag: "🇯🇵", dial: "+81", name: "اليابان", nameEn: "Japan", nat: "ياباني", natEn: "Japanese" },
    { iso: "KR", flag: "🇰🇷", dial: "+82", name: "كوريا الجنوبية", nameEn: "South Korea", nat: "كوري", natEn: "Korean" },
    { iso: "HK", flag: "🇭🇰", dial: "+852", name: "هونغ كونغ", nameEn: "Hong Kong", nat: "هونغ كونغي", natEn: "Hongkongese" },
    { iso: "SG", flag: "🇸🇬", dial: "+65", name: "سنغافورة", nameEn: "Singapore", nat: "سنغافوري", natEn: "Singaporean" },
    { iso: "AU", flag: "🇦🇺", dial: "+61", name: "أستراليا", nameEn: "Australia", nat: "أسترالي", natEn: "Australian" },
    { iso: "NZ", flag: "🇳🇿", dial: "+64", name: "نيوزيلندا", nameEn: "New Zealand", nat: "نيوزيلندي", natEn: "New Zealander" },
    { iso: "CA", flag: "🇨🇦", dial: "+1", name: "كندا", nameEn: "Canada", nat: "كندي", natEn: "Canadian" },
    { iso: "MX", flag: "🇲🇽", dial: "+52", name: "المكسيك", nameEn: "Mexico", nat: "مكسيكي", natEn: "Mexican" },
    { iso: "BR", flag: "🇧🇷", dial: "+55", name: "البرازيل", nameEn: "Brazil", nat: "برازيلي", natEn: "Brazilian" },
    { iso: "AR", flag: "🇦🇷", dial: "+54", name: "الأرجنتين", nameEn: "Argentina", nat: "أرجنتيني", natEn: "Argentine" },
    { iso: "ZA", flag: "🇿🇦", dial: "+27", name: "جنوب أفريقيا", nameEn: "South Africa", nat: "جنوب أفريقي", natEn: "South African" },
    { iso: "NG", flag: "🇳🇬", dial: "+234", name: "نيجيريا", nameEn: "Nigeria", nat: "نيجيري", natEn: "Nigerian" },
    { iso: "KE", flag: "🇰🇪", dial: "+254", name: "كينيا", nameEn: "Kenya", nat: "كيني", natEn: "Kenyan" },
    { iso: "ET", flag: "🇪🇹", dial: "+251", name: "إثيوبيا", nameEn: "Ethiopia", nat: "إثيوبي", natEn: "Ethiopian" },
    { iso: "GH", flag: "🇬🇭", dial: "+233", name: "غانا", nameEn: "Ghana", nat: "غاني", natEn: "Ghanaian" },
    { iso: "SN", flag: "🇸🇳", dial: "+221", name: "السنغال", nameEn: "Senegal", nat: "سنغالي", natEn: "Senegalese" },
  ];

  function flagImg(iso, size) {
    const code = String(iso || "").toLowerCase();
    const wh = size === "sm" ? 'width="20" height="15"' : 'width="24" height="18"';
    return (
      '<img class="flag-img" src="https://flagcdn.com/w40/' +
      code +
      '.png" ' +
      wh +
      ' alt="' +
      String(iso || "").toUpperCase() +
      '" loading="lazy" decoding="async" />'
    );
  }

  // Shared searchable dropdown (portaled to <body> so it escapes modal transforms)
  function initSearchableSelect(root, config) {
    const trigger = root.querySelector("[data-ss-trigger]");
    const flagEl = root.querySelector("[data-ss-flag]");
    const textEl = root.querySelector("[data-ss-text]");
    const dropdown = root.querySelector("[data-ss-dropdown]");
    const searchInput = root.querySelector("[data-ss-search]");
    const listEl = root.querySelector("[data-ss-list]");
    if (!trigger || !dropdown || !listEl) return;

    document.body.appendChild(dropdown);

    let selected = config.items.find(function (c) { return c.iso === config.defaultIso; }) || config.items[0];
    let query = "";

    function render() {
      const q = query.trim().toLowerCase();
      const items = config.items.filter(function (c) { return !q || config.match(c, q); });
      if (!items.length) {
        listEl.innerHTML = '<div class="phone-dropdown-empty">لا توجد نتائج مطابقة</div>';
        return;
      }
      listEl.innerHTML = items.map(function (c) {
        const sel = c.iso === selected.iso ? " is-selected" : "";
        return (
          '<button type="button" class="phone-dropdown-item' + sel + '" data-iso="' + c.iso + '" role="option">' +
            flagImg(c.iso, "sm") +
            '<span class="country-name">' + config.itemPrimary(c) + '</span>' +
            '<span class="dial-code">' + config.itemSecondary(c) + '</span>' +
          "</button>"
        );
      }).join("");
    }

    function apply(c) {
      selected = c;
      if (flagEl) flagEl.innerHTML = flagImg(c.iso);
      if (textEl) textEl.textContent = config.triggerText(c);
      root.dataset.iso = c.iso;
      if (config.onChange) config.onChange(c);
      close();
      render();
    }

    function getScrollParent(el) {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const ov = getComputedStyle(node).overflowY;
        if (ov === "auto" || ov === "scroll") return node;
        node = node.parentElement;
      }
      return null;
    }

    function ensureRoomBelow() {
      const needed = 340;
      const rect = root.getBoundingClientRect();
      const overflow = rect.bottom + needed + 8 - window.innerHeight;
      if (overflow > 0) {
        const scroller = getScrollParent(root);
        if (scroller) scroller.scrollTop += overflow + 8;
      }
    }

    function position() {
      const rect = root.getBoundingClientRect();
      const ddW = Math.max(rect.width, 272);
      dropdown.style.width = ddW + "px";
      const isRTL = document.documentElement.dir === "rtl";
      let left = isRTL ? rect.right - ddW : rect.left;
      const top = rect.bottom + 6;
      const margin = 8;
      if (left < margin) left = margin;
      if (left + ddW > window.innerWidth - margin) left = window.innerWidth - ddW - margin;
      dropdown.style.top = top + "px";
      dropdown.style.left = left + "px";
    }

    function open() {
      dropdown.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      query = "";
      searchInput.value = "";
      render();
      ensureRoomBelow();
      position();
      setTimeout(function () { searchInput.focus(); }, 30);
    }

    function close() {
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function toggle() {
      if (dropdown.classList.contains("is-open")) close();
      else open();
    }

    trigger.addEventListener("click", function (e) { e.preventDefault(); toggle(); });
    document.addEventListener("scroll", function () {
      if (dropdown.classList.contains("is-open")) position();
    }, true);
    window.addEventListener("resize", function () {
      if (dropdown.classList.contains("is-open")) position();
    });
    if (searchInput) {
      searchInput.addEventListener("input", function () { query = searchInput.value; render(); });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { close(); trigger.focus(); }
      });
    }
    listEl.addEventListener("click", function (e) {
      const item = e.target.closest("[data-iso]");
      if (!item) return;
      const c = config.items.find(function (x) { return x.iso === item.dataset.iso; });
      if (c) apply(c);
    });
    listEl.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const items = Array.from(listEl.querySelectorAll("[data-iso]"));
      if (!items.length) return;
      const idx = items.indexOf(listEl.querySelector("[data-iso].is-selected"));
      let next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
      if (next < 0) next = 0;
      if (next > items.length - 1) next = items.length - 1;
      const c = config.items.find(function (x) { return x.iso === items[next].dataset.iso; });
      if (c) apply(c);
    });
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target) && !dropdown.contains(e.target)) close();
    });

    apply(selected);

    root.__ssSetIso = function (iso) {
      const c = config.items.find(function (x) { return x.iso === String(iso || "").toUpperCase(); });
      if (c) apply(c);
    };
  }

  function initPhoneFields() {
    document.querySelectorAll("[data-phone-field]").forEach(function (root) {
      initSearchableSelect(root, {
        items: COUNTRIES,
        defaultIso: "SA",
        triggerText: function (c) { return c.dial; },
        itemPrimary: function (c) { return c.name; },
        itemSecondary: function (c) { return c.dial; },
        match: function (c, q) {
          return (
            c.name.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.dial.replace("+", "").includes(q.replace("+", "")) ||
            c.iso.toLowerCase() === q
          );
        },
        onChange: function (c) { root.dataset.dialCode = c.dial; },
      });
    });
  }

  function initNationalityFields() {
    document.querySelectorAll("[data-nationality-field]").forEach(function (root) {
      initSearchableSelect(root, {
        items: COUNTRIES,
        defaultIso: "SY",
        triggerText: function (c) { return c.nat; },
        itemPrimary: function (c) { return c.nat; },
        itemSecondary: function (c) { return c.name; },
        match: function (c, q) {
          return (
            c.nat.toLowerCase().includes(q) ||
            (c.natEn || "").toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.iso.toLowerCase() === q
          );
        },
        onChange: function (c) { root.dataset.nationality = c.nat; },
      });
    });
  }

  const SS_CHEVRON =
    '<svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  function initTablePagination() {
    const PAGE_SIZES = [20, 50, 100];
    const chevPrev =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
    const chevNext =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';

    document.querySelectorAll("table.data-table, table.hk-list-table").forEach(function (table) {
      if (table.dataset.paged === "1") return;
      if (table.hasAttribute("data-no-pager")) return;
      if (table.classList.contains("avail-board-table")) return;
      const tbody = table.tBodies[0];
      if (!tbody) return;

      table.dataset.paged = "1";
      const rows = Array.from(tbody.rows);
      let page = 1;
      let pageSize = Number(table.getAttribute("data-page-size")) || 20;
      if (PAGE_SIZES.indexOf(pageSize) === -1) pageSize = 20;

      const bar = document.createElement("div");
      bar.className = "table-pager";
      bar.setAttribute("data-table-pager", "");
      bar.innerHTML =
        '<div class="table-pager-meta">' +
        '<label class="table-pager-size">عرض' +
        '<select class="field-select w-auto" data-pager-size aria-label="عدد الصفوف في الصفحة">' +
        PAGE_SIZES.map(function (n) {
          return (
            '<option value="' +
            n +
            '"' +
            (n === pageSize ? " selected" : "") +
            ">" +
            n +
            "</option>"
          );
        }).join("") +
        "</select>" +
        "</label>" +
        '<div class="table-pager-info" data-pager-info></div>' +
        "</div>" +
        '<div class="table-pager-nav" data-pager-nav></div>';

      const host = table.closest(".table-wrap") || table;
      const parent = host.parentNode;
      if (parent) parent.insertBefore(bar, host.nextSibling);

      const infoEl = bar.querySelector("[data-pager-info]");
      const navEl = bar.querySelector("[data-pager-nav]");
      const sizeSelect = bar.querySelector("[data-pager-size]");

      function totalPages() {
        return Math.max(1, Math.ceil(rows.length / pageSize) || 1);
      }

      function pageList(current, total) {
        if (total <= 7) {
          return Array.from({ length: total }, function (_, i) { return i + 1; });
        }
        const pages = [1];
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push("…");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push("…");
        pages.push(total);
        return pages;
      }

      function render() {
        const total = rows.length;
        const pages = totalPages();
        if (page > pages) page = pages;
        if (page < 1) page = 1;
        const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, total);

        rows.forEach(function (row, idx) {
          const show = idx >= (page - 1) * pageSize && idx < page * pageSize;
          row.hidden = !show;
          row.style.display = show ? "" : "none";
        });

        infoEl.innerHTML =
          total === 0
            ? "لا توجد نتائج"
            : "عرض <span>" + start + "–" + end + "</span> من <span>" + total + "</span>";

        const nums = pageList(page, pages);
        navEl.innerHTML =
          '<button type="button" class="table-pager-btn is-icon" data-pager-go="prev" aria-label="الصفحة السابقة"' +
          (page <= 1 ? " disabled" : "") +
          ">" +
          chevPrev +
          "</button>" +
          nums
            .map(function (item) {
              if (item === "…") return '<span class="table-pager-ellipsis">…</span>';
              return (
                '<button type="button" class="table-pager-btn' +
                (item === page ? " is-active" : "") +
                '" data-pager-page="' +
                item +
                '">' +
                item +
                "</button>"
              );
            })
            .join("") +
          '<button type="button" class="table-pager-btn is-icon" data-pager-go="next" aria-label="الصفحة التالية"' +
          (page >= pages ? " disabled" : "") +
          ">" +
          chevNext +
          "</button>";
      }

      navEl.addEventListener("click", function (e) {
        const btn = e.target.closest("button");
        if (!btn || btn.disabled) return;
        if (btn.hasAttribute("data-pager-go")) {
          page += btn.getAttribute("data-pager-go") === "next" ? 1 : -1;
          render();
          return;
        }
        if (btn.hasAttribute("data-pager-page")) {
          page = Number(btn.getAttribute("data-pager-page"));
          render();
        }
      });

      sizeSelect.addEventListener("change", function () {
        pageSize = Number(sizeSelect.value) || 20;
        page = 1;
        render();
      });

      render();
    });
  }

  // Turn native <select class="field-select"> into الجنسية-style custom dropdowns
  function initEnhancedSelects() {
    document.querySelectorAll("select.field-select").forEach(function (select) {
      if (select.dataset.enhanced === "1") return;
      select.dataset.enhanced = "1";

      const wrap = document.createElement("div");
      wrap.className = "ss-field";
      if (select.classList.contains("w-auto")) wrap.classList.add("is-auto");
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      select.classList.add("ss-native-hidden");
      select.tabIndex = -1;

      function readOptions() {
        return Array.prototype.map.call(select.options, function (opt, index) {
          return {
            index: index,
            value: opt.value,
            label: (opt.textContent || "").trim(),
            disabled: !!opt.disabled,
            placeholder: !!opt.disabled && (opt.value === "" || !opt.value),
          };
        });
      }

      let options = readOptions();

      function selectableCount() {
        return readOptions().filter(function (o) {
          return !o.placeholder && !o.disabled;
        }).length;
      }

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "ss-select-btn";
      trigger.setAttribute("data-ss-trigger", "");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "listbox");
      if (select.id) trigger.id = select.id + "-trigger";
      if (select.hasAttribute("required")) trigger.setAttribute("aria-required", "true");
      trigger.innerHTML =
        '<span class="ss-select-text" data-ss-text></span>' + SS_CHEVRON;

      const dropdown = document.createElement("div");
      dropdown.className = "phone-dropdown ss-dropdown-panel";
      dropdown.setAttribute("data-ss-dropdown", "");
      dropdown.setAttribute("role", "listbox");
      dropdown.innerHTML =
        '<div class="phone-dropdown-search search-input" data-ss-search-wrap hidden>' +
        '<svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>' +
        '<input type="search" placeholder="بحث…" data-ss-search />' +
        "</div>" +
        '<div class="phone-dropdown-list" data-ss-list></div>';

      wrap.appendChild(trigger);
      document.body.appendChild(dropdown);

      const textEl = trigger.querySelector("[data-ss-text]");
      const listEl = dropdown.querySelector("[data-ss-list]");
      const searchWrap = dropdown.querySelector("[data-ss-search-wrap]");
      const searchInput = dropdown.querySelector("[data-ss-search]");
      let query = "";

      function currentOption() {
        const opt = select.options[select.selectedIndex];
        return opt || null;
      }

      function syncLabel() {
        const opt = currentOption();
        if (!opt || ((opt.disabled || !String(opt.value || "").length) && (opt.textContent || "").trim() === "")) {
          textEl.textContent = (opt && (opt.textContent || "").trim()) || "اختر…";
          textEl.classList.add("is-empty");
        } else if (!opt.value && opt.disabled) {
          textEl.textContent = (opt.textContent || "").trim() || "اختر…";
          textEl.classList.add("is-empty");
        } else {
          textEl.textContent = (opt.textContent || "").trim();
          textEl.classList.remove("is-empty");
        }
      }

      function renderList() {
        options = readOptions();
        const q = query.trim().toLowerCase();
        const items = options.filter(function (o) {
          if (o.placeholder) return false;
          if (o.disabled) return false;
          if (!q) return true;
          return o.label.toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q);
        });
        if (!items.length) {
          listEl.innerHTML = '<div class="phone-dropdown-empty">لا توجد نتائج مطابقة</div>';
          return;
        }
        const selectedVal = select.value;
        listEl.innerHTML = items
          .map(function (o) {
            const sel = String(o.value) === String(selectedVal) ? " is-selected" : "";
            return (
              '<button type="button" class="phone-dropdown-item' +
              sel +
              '" data-value="' +
              String(o.value).replace(/"/g, "&quot;") +
              '" data-index="' +
              o.index +
              '" role="option">' +
              '<span class="country-name">' +
              o.label +
              "</span>" +
              "</button>"
            );
          })
          .join("");
      }

      function position() {
        const rect = trigger.getBoundingClientRect();
        const ddW = Math.max(rect.width, 220);
        dropdown.style.width = ddW + "px";
        const isRTL = document.documentElement.dir === "rtl";
        let left = isRTL ? rect.right - ddW : rect.left;
        const top = rect.bottom + 6;
        const margin = 8;
        if (left < margin) left = margin;
        if (left + ddW > window.innerWidth - margin) left = window.innerWidth - ddW - margin;
        dropdown.style.top = top + "px";
        dropdown.style.left = left + "px";
      }

      function open() {
        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        query = "";
        if (searchInput) searchInput.value = "";
        if (searchWrap) searchWrap.hidden = selectableCount() < 7 && select.options.length < 7;
        renderList();
        position();
        if (searchInput && searchWrap && !searchWrap.hidden) {
          setTimeout(function () { searchInput.focus(); }, 20);
        }
      }

      function close() {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }

      function toggle() {
        if (dropdown.classList.contains("is-open")) close();
        else open();
      }

      syncLabel();
      renderList();

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });
      listEl.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-index]");
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        select.selectedIndex = idx;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncLabel();
        close();
      });
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          query = searchInput.value;
          renderList();
        });
        searchInput.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            close();
            trigger.focus();
          }
        });
      }
      select.addEventListener("change", syncLabel);
      document.addEventListener(
        "scroll",
        function () {
          if (dropdown.classList.contains("is-open")) position();
        },
        true
      );
      window.addEventListener("resize", function () {
        if (dropdown.classList.contains("is-open")) position();
      });
      document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target) && !dropdown.contains(e.target)) close();
      });
    });
  }


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
    building: '<path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 10h5a1 1 0 0 1 1 1v10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 8h2M7 11h2M7 14h2M7 17h2M17 14h1M17 17h1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    userCog: '<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="17" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M18 13.3v.9M18 19.8v.9M21.2 17h-.9M15.7 17h-.9M20.3 14.7l-.6.6M16.3 18.7l-.6.6M20.3 19.3l-.6-.6M16.3 15.3l-.6-.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    cashFlow: '<path d="M3 7h13M3 7l3-3M3 7l3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 17H8m13 0-3-3m3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
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
        <div class="sidebar-logo">
          <img src="https://app.marhaba-syria.sy/assets/img/logo-syria.svg" alt="Marhaba Syria" />
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

      const children = item.children || [];
      const childActive = children.some((child) => child.id === active);
      const branchOpen = childActive || item.id === active;

      if (children.length) {
        html += `<div class="sidebar-branch${branchOpen ? " is-open" : ""}${childActive ? " has-active" : ""}" data-nav-branch="${item.id}">`;
        html += `<div class="sidebar-branch-head">`;
        html += `<a class="sidebar-link${childActive ? " is-branch-active" : ""}" href="${item.href}" data-nav="${item.id}" title="${item.label}">${icon(item.icon)}<span>${item.label}</span></a>`;
        html += `<button type="button" class="sidebar-branch-toggle" data-action="toggle-nav-branch" aria-expanded="${branchOpen ? "true" : "false"}" aria-label="إظهار أو إخفاء ${item.label}">`;
        html += `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        html += `</button></div>`;
        html += `<div class="sidebar-subnav">`;
        children.forEach((child) => {
          const subActive = child.id === active ? " is-active" : "";
          html += `<a class="sidebar-sublink${subActive}" href="${child.href}" data-nav="${child.id}">${child.label}</a>`;
        });
        html += `</div></div>`;
        return;
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
        <button type="button" class="pswitch-badge" data-action="toggle-user-menu" aria-label="المنشأة الحالية — لتبديلها افتح قائمة الحساب" title="المنشأة الحالية — لتبديلها افتح قائمة الحساب">
          ${PSWITCH_BUILDING_ICON}
          <span class="pswitch-badge-code" data-pswitch-code>${propertySwitcherTriggerLabel(PD.getSelectedPropertyId()).code}</span>
        </button>
        <div class="header-switchers">
          <button type="button" class="header-icon-btn" data-action="toggle-lang" aria-label="${lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}" title="${lang === "en" ? "English → العربية" : "العربية → English"}">
            ${langIcon}
          </button>
          <button type="button" class="header-icon-btn" data-action="toggle-theme" aria-label="${theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}" title="${theme === "dark" ? "Light mode" : "Dark mode"}">
            ${themeIcon}
          </button>
        </div>
        <a href="reservation-new.html" class="btn btn-primary btn-sm" title="حجز جديد">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
          <span class="hidden sm:inline">حجز جديد</span>
        </a>
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
            <div class="px-2 pt-2 pb-1">
              <div class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide px-1 mb-1.5">المنشأة</div>
              <div class="flex flex-col gap-2" data-pswitch-menu>${propertySwitcherMenuHtml()}</div>
            </div>
            <div class="border-t border-slate-100 mt-1 pt-1">
              <a href="settings.html" class="block px-3 py-2 text-sm rounded-lg hover:bg-primary-soft font-semibold text-slate-700">الإعدادات</a>
              <a href="login.html" class="block px-3 py-2 text-sm rounded-lg hover:bg-red-50 font-semibold text-red-600">تسجيل الخروج</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  const PSWITCH_BUILDING_ICON =
    '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" stroke-linejoin="round"/><path d="M14 10h5a1 1 0 0 1 1 1v10" stroke-linejoin="round"/><path d="M7 8h2M7 11h2M7 14h2M7 17h2M17 14h1M17 17h1" stroke-linecap="round"/></svg>';

  function propertySwitcherOptionHtml(p, selectedId) {
    const sel = p.id === selectedId;
    return (
      '<button type="button" class="pswitch-option' +
      (sel ? " is-selected" : "") +
      '" data-action="select-property-switcher" data-property-id="' +
      p.id +
      '" role="option" aria-selected="' +
      (sel ? "true" : "false") +
      '" data-search="' +
      (p.name + " " + p.arabicName + " " + p.code + " " + p.city).toLowerCase() +
      '">' +
      '<span class="pswitch-option-dot" aria-hidden="true"></span>' +
      '<span class="min-w-0 flex-1 text-start">' +
      '<span class="block truncate font-extrabold text-sm">' + p.name + '</span>' +
      '<span class="block truncate text-xs text-slate-400 font-semibold">' + p.arabicName + '</span>' +
      '</span>' +
      '<span class="pswitch-option-code">' + p.code + '</span>' +
      (sel
        ? '<svg class="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : "") +
      "</button>"
    );
  }

  function propertySwitcherMenuHtml() {
    const user = CURRENT_USER;
    const selectedId = PD.getSelectedPropertyId();
    const options = PD.getAssignedProperties(user).map(function (p) {
      return propertySwitcherOptionHtml(p, selectedId);
    }).join("");
    const allOption = PD.hasMultiPropertyAccess(user)
      ? '<button type="button" class="pswitch-option pswitch-option-all' +
        (selectedId === "all" ? " is-selected" : "") +
        '" data-action="select-property-switcher" data-property-id="all" role="option" aria-selected="' +
        (selectedId === "all" ? "true" : "false") +
        '" data-search="جميع المنشآت all properties">' +
        '<span class="pswitch-option-dot is-all" aria-hidden="true"></span>' +
        '<span class="min-w-0 flex-1 text-start"><span class="block truncate font-extrabold text-sm">جميع المنشآت</span><span class="block truncate text-xs text-slate-400 font-semibold">تقرير موحّد عبر كل المنشآت المتاحة لك</span></span>' +
        (selectedId === "all"
          ? '<svg class="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : "") +
        "</button>"
      : "";
    return (
      '<div class="pswitch-search search-input">' +
      '<svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>' +
      '<input type="search" placeholder="ابحث عن منشأة…" data-pswitch-search aria-label="بحث عن منشأة" />' +
      "</div>" +
      '<div class="pswitch-list" data-pswitch-list role="listbox">' + allOption + options + "</div>" +
      '<a href="properties.html" class="pswitch-manage">' +
      '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>' +
      "إدارة المنشآت</a>"
    );
  }

  function propertySwitcherTriggerLabel(selectedId) {
    if (selectedId === "all") return { name: "جميع المنشآت", code: String(CURRENT_USER.assignedPropertyIds.length) + " منشآت" };
    const p = PD.getPropertyById(selectedId);
    if (!p) return { name: "—", code: "" };
    return { name: p.name, code: p.code };
  }

  function closePropertySwitcher() {
    document.getElementById("user-menu")?.classList.add("hidden");
  }

  function filterPropertySwitcherList(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll("[data-pswitch-list] [data-search]").forEach(function (opt) {
      const match = !q || opt.getAttribute("data-search").indexOf(q) !== -1;
      opt.classList.toggle("hidden", !match);
    });
  }

  function selectPropertySwitcher(id) {
    if (id !== "all" && !PD.canAccessProperty(CURRENT_USER, id)) return;
    if (id === "all" && !PD.hasMultiPropertyAccess(CURRENT_USER)) return;
    closePropertySwitcher();

    const main = document.querySelector("main");
    if (main) main.classList.add("pms-loading");

    window.setTimeout(function () {
      PD.setSelectedPropertyId(id);
      const label = propertySwitcherTriggerLabel(id);
      document.querySelectorAll("[data-pswitch-code]").forEach(function (el) { el.textContent = label.code; });
      document.querySelectorAll("[data-pswitch-menu]").forEach(function (el) { el.innerHTML = propertySwitcherMenuHtml(); });
      if (main) main.classList.remove("pms-loading");
      toast(id === "all" ? "تم التبديل إلى جميع المنشآت" : "تم التبديل إلى " + label.name);
    }, 320 + Math.round(Math.random() * 160));
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
      const buttons = [...root.querySelectorAll("[data-tab]")].filter(
        (btn) => btn.closest("[data-tabs]") === root
      );
      const panelsRoot = root.dataset.tabsTarget
        ? document.getElementById(root.dataset.tabsTarget)
        : root;
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
          if (!panelsRoot) return;
          panelsRoot.querySelectorAll("[data-tab-panel]").forEach((panel) => {
            panel.classList.toggle("hidden", panel.dataset.tabPanel !== id);
          });
        });
      });
    });
  }

  const DP_MONTHS_AR = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const DP_WEEKDAYS_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toISODate(d) {
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function parseISODate(value) {
    if (!value) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function formatDisplayDate(d) {
    return pad2(d.getMonth() + 1) + "/" + pad2(d.getDate()) + "/" + d.getFullYear();
  }

  function initDatePickers() {
    function closeAll(except) {
      document.querySelectorAll(".dp-field.is-open").forEach((field) => {
        if (field === except) return;
        field.classList.remove("is-open");
        const pop = field._dpPopover;
        if (pop) pop.classList.remove("is-open");
        pop?.querySelector(".dp-months")?.classList.remove("is-open");
        pop?.querySelector(".dp-years")?.classList.remove("is-open");
        pop?.querySelector(".dp-calendar")?.classList.remove("is-hidden");
      });
    }

    document.querySelectorAll("[data-datepicker]").forEach((field) => {
      if (field.dataset.dpReady) return;
      field.dataset.dpReady = "1";

      const hidden = field.querySelector('input[type="hidden"]');
      const trigger = field.querySelector(".dp-trigger");
      const textEl = field.querySelector(".dp-text");
      const popover = field.querySelector(".dp-popover");
      const daysEl = field.querySelector("[data-dp-days]");
      let monthsEl = field.querySelector(".dp-months");
      const calendarEl = field.querySelector(".dp-calendar");
      if (!hidden || !trigger || !popover || !daysEl || !calendarEl) return;

      document.body.appendChild(popover);
      field._dpPopover = popover;

      // Ensure month/year header controls exist
      const head = popover.querySelector(".dp-head");
      let monthNameEl = popover.querySelector("[data-dp-month-name]");
      let yearBtn = popover.querySelector("[data-dp-year-toggle]");
      let monthBtn = popover.querySelector("[data-dp-month-toggle]");
      if (head && (!monthNameEl || !yearBtn)) {
        const title = document.createElement("div");
        title.className = "dp-head-title";
        title.innerHTML =
          '<button type="button" class="dp-month-btn" data-dp-month-toggle aria-label="اختيار الشهر">' +
          '<span data-dp-month-name></span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</button>" +
          '<button type="button" class="dp-year-btn" data-dp-year-toggle aria-label="اختيار السنة">' +
          '<span data-dp-year-label></span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</button>";
        const oldLabelBtn = head.querySelector("[data-dp-month-toggle]");
        if (oldLabelBtn) oldLabelBtn.replaceWith(title);
        else head.insertBefore(title, head.firstChild);
        monthNameEl = popover.querySelector("[data-dp-month-name]");
        yearBtn = popover.querySelector("[data-dp-year-toggle]");
        monthBtn = popover.querySelector("[data-dp-month-toggle]");
      }
      const yearLabel = popover.querySelector("[data-dp-year-label]");

      if (!monthsEl) {
        monthsEl = document.createElement("div");
        monthsEl.className = "dp-months";
        monthsEl.setAttribute("aria-label", "اختيار الشهر");
        calendarEl.parentNode.insertBefore(monthsEl, calendarEl);
      }

      let yearsEl = popover.querySelector(".dp-years");
      if (!yearsEl) {
        yearsEl = document.createElement("div");
        yearsEl.className = "dp-years";
        yearsEl.setAttribute("aria-label", "اختيار السنة");
        monthsEl.parentNode.insertBefore(yearsEl, monthsEl.nextSibling);
      }

      let view = parseISODate(hidden.value) || new Date();
      view = new Date(view.getFullYear(), view.getMonth(), 1);
      let mode = "calendar"; // calendar | months | years
      let yearPageStart = view.getFullYear() - 5;

      function selected() {
        return parseISODate(hidden.value);
      }

      function position() {
        const rect = trigger.getBoundingClientRect();
        const width = Math.min(296, window.innerWidth - 16);
        popover.style.width = width + "px";
        let left = rect.left;
        if (document.documentElement.dir === "rtl") left = rect.right - width;
        const margin = 8;
        if (left < margin) left = margin;
        if (left + width > window.innerWidth - margin) left = window.innerWidth - width - margin;
        let finalTop = rect.bottom + 6;
        const approxH = 360;
        if (finalTop + approxH > window.innerHeight - margin) {
          finalTop = Math.max(margin, rect.top - approxH - 6);
        }
        popover.style.left = left + "px";
        popover.style.top = finalTop + "px";
      }

      function setMode(next) {
        mode = next;
        calendarEl.classList.toggle("is-hidden", mode !== "calendar");
        monthsEl.classList.toggle("is-open", mode === "months");
        yearsEl.classList.toggle("is-open", mode === "years");
        if (mode === "years") {
          yearPageStart = view.getFullYear() - 5;
        }
        render();
      }

      function setOpen(open) {
        field.classList.toggle("is-open", open);
        popover.classList.toggle("is-open", open);
        if (open) {
          setMode("calendar");
          position();
        }
      }

      function setValue(dateOrNull) {
        if (!dateOrNull) {
          hidden.value = "";
          textEl.textContent = field.dataset.placeholder || "اختر التاريخ";
          textEl.classList.add("is-empty");
        } else {
          hidden.value = toISODate(dateOrNull);
          textEl.textContent = formatDisplayDate(dateOrNull);
          textEl.classList.remove("is-empty");
          view = new Date(dateOrNull.getFullYear(), dateOrNull.getMonth(), 1);
        }
        hidden.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(
          new CustomEvent("datepicker:change", {
            bubbles: true,
            detail: { value: hidden.value, date: dateOrNull },
          })
        );
        render();
      }

      function renderYears() {
        const cells = [];
        for (let i = 0; i < 12; i++) {
          const y = yearPageStart + i;
          const active = y === view.getFullYear() ? " is-active" : "";
          cells.push(
            '<button type="button" class="dp-year-option' +
              active +
              '" data-year="' +
              y +
              '">' +
              y +
              "</button>"
          );
        }
        yearsEl.innerHTML = cells.join("");
      }

      function render() {
        if (monthNameEl) monthNameEl.textContent = DP_MONTHS_AR[view.getMonth()];
        if (yearLabel) yearLabel.textContent = String(view.getFullYear());
        // fallback old single label
        const legacyLabel = popover.querySelector("[data-dp-month-label]");
        if (legacyLabel) {
          legacyLabel.textContent = DP_MONTHS_AR[view.getMonth()] + " " + view.getFullYear();
        }

        if (monthsEl) {
          monthsEl.querySelectorAll(".dp-month-option").forEach((btn, i) => {
            btn.classList.toggle("is-active", i === view.getMonth());
          });
        }
        if (mode === "years") renderYears();

        const year = view.getFullYear();
        const month = view.getMonth();
        const firstDow = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDays = new Date(year, month, 0).getDate();
        const sel = selected();
        const todayIso = toISODate(new Date());

        const cells = [];
        for (let i = 0; i < 42; i++) {
          let d;
          let muted = false;
          if (i < firstDow) {
            d = new Date(year, month - 1, prevDays - firstDow + i + 1);
            muted = true;
          } else if (i - firstDow + 1 > daysInMonth) {
            d = new Date(year, month + 1, i - firstDow - daysInMonth + 1);
            muted = true;
          } else {
            d = new Date(year, month, i - firstDow + 1);
          }
          const iso = toISODate(d);
          const isSel = sel && toISODate(sel) === iso;
          const isToday = iso === todayIso;
          cells.push(
            '<button type="button" class="dp-day' +
              (muted ? " is-muted" : "") +
              (isSel ? " is-selected" : "") +
              (isToday ? " is-today" : "") +
              '" data-date="' +
              iso +
              '" aria-label="' +
              iso +
              '">' +
              d.getDate() +
              "</button>"
          );
        }
        daysEl.innerHTML = cells.join("");
      }

      if (!popover.querySelector("[data-dp-weekdays]")) {
        const week = document.createElement("div");
        week.className = "dp-weekdays";
        week.setAttribute("data-dp-weekdays", "");
        week.innerHTML = DP_WEEKDAYS_AR.map((d) => "<span>" + d + "</span>").join("");
        calendarEl.insertBefore(week, daysEl);
      }

      if (monthsEl && !monthsEl.children.length) {
        monthsEl.innerHTML = DP_MONTHS_AR.map(
          (name, i) =>
            '<button type="button" class="dp-month-option" data-month="' + i + '">' + name + "</button>"
        ).join("");
      }

      const initial = selected();
      if (initial) {
        textEl.textContent = formatDisplayDate(initial);
        textEl.classList.remove("is-empty");
      } else {
        textEl.textContent = field.dataset.placeholder || "اختر التاريخ";
        textEl.classList.add("is-empty");
      }
      render();

      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !field.classList.contains("is-open");
        closeAll(field);
        setOpen(willOpen);
      });

      popover.querySelector("[data-dp-prev]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mode === "years") {
          yearPageStart -= 12;
          renderYears();
          return;
        }
        if (mode === "months") {
          view = new Date(view.getFullYear() - 1, view.getMonth(), 1);
        } else {
          view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        }
        render();
      });
      popover.querySelector("[data-dp-next]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mode === "years") {
          yearPageStart += 12;
          renderYears();
          return;
        }
        if (mode === "months") {
          view = new Date(view.getFullYear() + 1, view.getMonth(), 1);
        } else {
          view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        }
        render();
      });

      monthBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        setMode(mode === "months" ? "calendar" : "months");
      });
      yearBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        setMode(mode === "years" ? "calendar" : "years");
      });

      monthsEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-month]");
        if (!btn) return;
        view = new Date(view.getFullYear(), Number(btn.dataset.month), 1);
        setMode("calendar");
      });
      yearsEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-year]");
        if (!btn) return;
        view = new Date(Number(btn.dataset.year), view.getMonth(), 1);
        setMode("months");
      });
      daysEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-date]");
        if (!btn) return;
        const d = parseISODate(btn.dataset.date);
        if (!d) return;
        setValue(d);
        setOpen(false);
      });
      popover.querySelector("[data-dp-clear]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        setValue(null);
      });
      popover.querySelector("[data-dp-today]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        setValue(new Date());
        setOpen(false);
      });

      document.addEventListener(
        "scroll",
        function () {
          if (field.classList.contains("is-open")) position();
        },
        true
      );
      window.addEventListener("resize", function () {
        if (field.classList.contains("is-open")) position();
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest(".dp-field") || e.target.closest(".dp-popover")) return;
      closeAll();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  function applyPropertyFilterToDom() {
    const user = PD.getCurrentUser();
    const selected = PD.getSelectedPropertyId();
    document.querySelectorAll("[data-record-property]").forEach(function (el) {
      const pid = el.getAttribute("data-record-property");
      const visible = selected === "all" ? PD.canAccessProperty(user, pid) : pid === selected;
      el.classList.toggle("is-hidden-by-property", !visible);
    });
    document.querySelectorAll("[data-property-filter-scope]").forEach(function (scope) {
      const items = scope.querySelectorAll("[data-record-property]");
      if (!items.length) return;
      const anyVisible = Array.prototype.some.call(items, function (el) {
        return !el.classList.contains("is-hidden-by-property");
      });
      const emptyEl = scope.querySelector("[data-property-filter-empty]");
      if (emptyEl) emptyEl.classList.toggle("hidden", anyVisible);
    });
    document.querySelectorAll("[data-property-scope-label]").forEach(function (el) {
      if (selected === "all") {
        el.textContent = "جميع المنشآت";
      } else {
        const p = PD.getPropertyById(selected);
        el.textContent = p ? p.name : "—";
      }
    });
  }

  function checkPropertyAccessOnLoad() {
    const user = PD.getCurrentUser();
    let raw = null;
    try {
      raw = localStorage.getItem("selectedPropertyId");
    } catch (_) {}
    const invalid =
      raw && ((raw === "all" && !PD.hasMultiPropertyAccess(user)) || (raw !== "all" && !PD.canAccessProperty(user, raw)));
    // getSelectedPropertyId() self-heals (and persists) an invalid selection.
    PD.getSelectedPropertyId();
    if (invalid) {
      toast("لا تملك صلاحية الوصول لهذه المنشأة — تم إرجاعك إلى منشأتك الافتراضية");
    }
  }

  function initShell() {
    checkPropertyAccessOnLoad();
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
    initDatePickers();
    initPhoneFields();
    initNationalityFields();
    initTablePagination();
    initEnhancedSelects();

    document.body.addEventListener("click", (e) => {
      const actionEl = e.target.closest("[data-action]");
      if (!actionEl) {
        if (!e.target.closest("#user-menu") && !e.target.closest('[data-action="toggle-user-menu"]')) {
          document.getElementById("user-menu")?.classList.add("hidden");
        }
        return;
      }
      const action = actionEl.dataset.action;
      if (action === "toggle-sidebar") toggleMobileSidebar();
      if (action === "collapse-sidebar") toggleCollapseSidebar();
      if (action === "close-sidebar") closeSidebar();
      if (action === "toggle-nav-branch") {
        e.preventDefault();
        const branch = actionEl.closest(".sidebar-branch");
        if (!branch) return;
        const open = branch.classList.toggle("is-open");
        actionEl.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }
      if (action === "toggle-user-menu") {
        const menu = document.getElementById("user-menu");
        const willOpen = menu?.classList.contains("hidden");
        menu?.classList.toggle("hidden");
        if (willOpen) {
          const search = menu.querySelector("[data-pswitch-search]");
          if (search) { search.value = ""; filterPropertySwitcherList(""); }
        }
      }
      if (action === "select-property-switcher") {
        e.preventDefault();
        e.stopPropagation();
        selectPropertySwitcher(actionEl.dataset.propertyId);
        return;
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

    document.body.addEventListener("input", (e) => {
      if (e.target.matches("[data-pswitch-search]")) {
        filterPropertySwitcherList(e.target.value);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSidebar();
        closeAllModals();
        closeDrawer();
        closePropertySwitcher();
        document.getElementById("user-menu")?.classList.add("hidden");
        document.getElementById("global-search")?.blur();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        focusGlobalSearch();
      }
    });

    applyPropertyFilterToDom();
    window.addEventListener("pms:property-changed", applyPropertyFilterToDom);

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
