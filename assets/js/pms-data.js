/**
 * Marhaba PMS — multi-property mock data, persistence & access control.
 * Loaded before app.js on every page. Everything here is client-side/demo only.
 */
(function () {
  "use strict";

  const LS_PROPERTIES = "pmsProperties";
  const LS_USERS = "pmsUsers";
  const LS_ROOMS = "pmsRooms";
  const LS_SELECTED_PROPERTY = "selectedPropertyId";
  const CURRENT_USER_ID = "m.aslan@dpmena.com";

  // ─── Default seed data ────────────────────────────────────────────────
  const DEFAULT_PROPERTIES = [
    {
      id: "HOMS1",
      code: "HOMS1",
      name: "Homs",
      arabicName: "فندق حمص",
      type: "Hotel",
      country: "Syria",
      city: "Homs",
      address: "شارع القوتلي، حمص",
      timezone: "Asia/Damascus",
      currency: "SYP",
      rooms: 42,
      beds: 68,
      floors: 6,
      roomNumberingStyle: "Floor + Sequence (101, 102…)",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      weekendDays: ["Friday", "Saturday"],
      taxIncluded: true,
      autoCheckout: true,
      autoCleaning: true,
      autoMaintenance: false,
      ownerName: "أسامة الحمصي",
      ownerPhone: "+963931000111",
      supervisorName: "ريم فيصل",
      supervisorPhone: "+963931000222",
      mainEmail: "info@homshotel.sy",
      reservationsEmail: "reservations@homshotel.sy",
      receptionNumber: "+963311234567",
      website: "https://homshotel.sy",
      status: "active",
      createdAt: "2025-11-02",
    },
    {
      id: "HALEP1",
      code: "HALEP1",
      name: "Halep",
      arabicName: "فندق حلب",
      type: "Hotel",
      country: "Syria",
      city: "Aleppo",
      address: "شارع بارون، حلب",
      timezone: "Asia/Damascus",
      currency: "SYP",
      rooms: 30,
      beds: 46,
      floors: 5,
      roomNumberingStyle: "Floor + Sequence (101, 102…)",
      checkInTime: "15:00",
      checkOutTime: "12:00",
      weekendDays: ["Friday", "Saturday"],
      taxIncluded: true,
      autoCheckout: true,
      autoCleaning: false,
      autoMaintenance: false,
      ownerName: "عمر الحلبي",
      ownerPhone: "+963941000111",
      supervisorName: "خالد الحربي",
      supervisorPhone: "+963941000222",
      mainEmail: "info@halephotel.sy",
      reservationsEmail: "reservations@halephotel.sy",
      receptionNumber: "+963211234567",
      website: "https://halephotel.sy",
      status: "active",
      createdAt: "2025-12-14",
    },
  ];

  // Every individual role string the system understands, grouped by module.
  const ROLE_CATALOG = [
    "PMS Dashboard",
    "PMS Availability",
    "PMS Reservations",
    "PMS Receptionist",
    "PMS Check-In/Out",
    "PMS Payments",
    "PMS Cashier",
    "PMS Housekeeping",
    "PMS Reports",
    "Housekeeping Manager",
    "Property Settings Manager",
    "User Manager",
    "Accountant",
  ];

  // Preset -> bundle of roles it grants. Deliberately excludes any
  // System Manager / HR / unrestricted-accounting style roles.
  const ROLE_PRESETS = {
    "Hotel Manager": {
      label: "مدير الفندق",
      description: "صلاحيات تشغيلية كاملة على فندق واحد أو أكثر — دون إدارة النظام أو الموارد البشرية.",
      roles: [
        "PMS Dashboard",
        "PMS Availability",
        "PMS Reservations",
        "PMS Receptionist",
        "PMS Check-In/Out",
        "PMS Payments",
        "PMS Cashier",
        "PMS Housekeeping",
        "PMS Reports",
      ],
    },
    Receptionist: {
      label: "موظف استقبال",
      description: "الحجوزات وتسجيل الوصول والمغادرة والنزلاء.",
      roles: ["PMS Dashboard", "PMS Reservations", "PMS Receptionist", "PMS Check-In/Out"],
    },
    "Housekeeping Manager": {
      label: "مدير التدبير الفندقي",
      description: "إشراف كامل على فرق التدبير الفندقي وحالة الغرف.",
      roles: ["PMS Dashboard", "PMS Housekeeping", "Housekeeping Manager", "PMS Reports"],
    },
    Housekeeper: {
      label: "عامل تدبير فندقي",
      description: "تحديث حالة الغرف والمهام اليومية فقط.",
      roles: ["PMS Housekeeping"],
    },
    Cashier: {
      label: "أمين صندوق",
      description: "تحصيل الدفعات وإدارة الورديات.",
      roles: ["PMS Dashboard", "PMS Payments", "PMS Cashier"],
    },
    Accountant: {
      label: "محاسب",
      description: "الاطلاع على التقارير المالية والدفعات دون صلاحيات تشغيلية.",
      roles: ["PMS Payments", "PMS Reports", "Accountant"],
    },
  };

  const PERMISSION_MODULES = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "availability", label: "التوفر" },
    { id: "reservations", label: "الحجوزات" },
    { id: "guests", label: "النزلاء" },
    { id: "checkin", label: "الوصول والمغادرة" },
    { id: "payments", label: "الدفعات" },
    { id: "cashier", label: "الصندوق" },
    { id: "housekeeping", label: "التدبير الفندقي" },
    { id: "reports", label: "التقارير" },
    { id: "property-settings", label: "إعدادات المنشأة" },
    { id: "user-management", label: "إدارة المستخدمين" },
  ];

  const PERMISSION_ACTIONS = [
    { id: "view", label: "عرض" },
    { id: "create", label: "إنشاء" },
    { id: "edit", label: "تعديل" },
    { id: "delete", label: "حذف" },
    { id: "approve", label: "اعتماد" },
    { id: "export", label: "تصدير" },
  ];

  // grid[preset][module] = array of allowed action ids
  const PERMISSION_MATRIX = {
    "Hotel Manager": {
      dashboard: ["view"],
      availability: ["view", "create", "edit"],
      reservations: ["view", "create", "edit", "approve"],
      guests: ["view", "create", "edit"],
      checkin: ["view", "create", "edit"],
      payments: ["view", "create", "edit", "approve", "export"],
      cashier: ["view", "create", "edit", "approve"],
      housekeeping: ["view", "create", "edit", "approve"],
      reports: ["view", "export"],
      "property-settings": ["view"],
      "user-management": [],
    },
    Receptionist: {
      dashboard: ["view"],
      availability: ["view"],
      reservations: ["view", "create", "edit"],
      guests: ["view", "create", "edit"],
      checkin: ["view", "create", "edit"],
      payments: ["view"],
      cashier: [],
      housekeeping: ["view"],
      reports: [],
      "property-settings": [],
      "user-management": [],
    },
    "Housekeeping Manager": {
      dashboard: ["view"],
      availability: ["view"],
      reservations: ["view"],
      guests: [],
      checkin: ["view"],
      payments: [],
      cashier: [],
      housekeeping: ["view", "create", "edit", "delete", "approve"],
      reports: ["view", "export"],
      "property-settings": [],
      "user-management": [],
    },
    Housekeeper: {
      dashboard: [],
      availability: [],
      reservations: [],
      guests: [],
      checkin: [],
      payments: [],
      cashier: [],
      housekeeping: ["view", "edit"],
      reports: [],
      "property-settings": [],
      "user-management": [],
    },
    Cashier: {
      dashboard: ["view"],
      availability: [],
      reservations: ["view"],
      guests: ["view"],
      checkin: [],
      payments: ["view", "create", "edit"],
      cashier: ["view", "create", "edit", "approve"],
      housekeeping: [],
      reports: [],
      "property-settings": [],
      "user-management": [],
    },
    Accountant: {
      dashboard: ["view"],
      availability: [],
      reservations: ["view"],
      guests: [],
      checkin: [],
      payments: ["view", "export"],
      cashier: ["view", "export"],
      housekeeping: [],
      reports: ["view", "export"],
      "property-settings": [],
      "user-management": [],
    },
  };

  const DEFAULT_CURRENT_USER = {
    id: CURRENT_USER_ID,
    email: CURRENT_USER_ID,
    firstName: "Mohammed",
    lastName: "Aslan",
    username: "m.aslan",
    status: "active",
    userType: "system-user",
    language: "ar",
    timezone: "Asia/Damascus",
    defaultPropertyId: "HOMS1",
    assignedPropertyIds: ["HOMS1", "HALEP1"],
    roles: [
      "PMS Dashboard",
      "PMS Availability",
      "PMS Reservations",
      "PMS Receptionist",
      "PMS Check-In/Out",
      "PMS Payments",
      "PMS Cashier",
      "PMS Housekeeping",
      "PMS Reports",
      "Housekeeping Manager",
    ],
    rolePreset: "Hotel Manager",
    roleLabel: "Hotel Manager",
    lastLogin: "2026-07-30 09:12",
    twoFactorEnabled: false,
    requirePasswordChange: false,
    assistantAccess: true,
  };

  const DEFAULT_USERS = [
    DEFAULT_CURRENT_USER,
    {
      id: "r.saleh@dpmena.com",
      email: "r.saleh@dpmena.com",
      firstName: "Rana",
      lastName: "Saleh",
      username: "r.saleh",
      status: "active",
      userType: "system-user",
      language: "ar",
      timezone: "Asia/Damascus",
      defaultPropertyId: "HOMS1",
      assignedPropertyIds: ["HOMS1"],
      roles: ROLE_PRESETS["Receptionist"].roles,
      rolePreset: "Receptionist",
      roleLabel: "Receptionist",
      lastLogin: "2026-07-30 08:40",
      twoFactorEnabled: false,
      requirePasswordChange: false,
      assistantAccess: false,
    },
    {
      id: "k.harbi@dpmena.com",
      email: "k.harbi@dpmena.com",
      firstName: "Khaled",
      lastName: "Al-Harbi",
      username: "k.harbi",
      status: "active",
      userType: "system-user",
      language: "ar",
      timezone: "Asia/Damascus",
      defaultPropertyId: "HALEP1",
      assignedPropertyIds: ["HALEP1"],
      roles: ROLE_PRESETS["Housekeeping Manager"].roles,
      rolePreset: "Housekeeping Manager",
      roleLabel: "Housekeeping Manager",
      lastLogin: "2026-07-29 19:05",
      twoFactorEnabled: false,
      requirePasswordChange: false,
      assistantAccess: false,
    },
    {
      id: "n.saad@dpmena.com",
      email: "n.saad@dpmena.com",
      firstName: "Noura",
      lastName: "Saad",
      username: "n.saad",
      status: "active",
      userType: "system-user",
      language: "ar",
      timezone: "Asia/Damascus",
      defaultPropertyId: "HOMS1",
      assignedPropertyIds: ["HOMS1", "HALEP1"],
      roles: ROLE_PRESETS["Housekeeper"].roles,
      rolePreset: "Housekeeper",
      roleLabel: "Housekeeper",
      lastLogin: "2026-07-30 07:55",
      twoFactorEnabled: false,
      requirePasswordChange: true,
      assistantAccess: false,
    },
    {
      id: "o.ali@dpmena.com",
      email: "o.ali@dpmena.com",
      firstName: "Omar",
      lastName: "Ali",
      username: "o.ali",
      status: "invited",
      userType: "system-user",
      language: "ar",
      timezone: "Asia/Damascus",
      defaultPropertyId: "HALEP1",
      assignedPropertyIds: ["HALEP1"],
      roles: ROLE_PRESETS["Cashier"].roles,
      rolePreset: "Cashier",
      roleLabel: "Cashier",
      lastLogin: null,
      twoFactorEnabled: false,
      requirePasswordChange: true,
      assistantAccess: false,
    },
    {
      id: "l.khoury@dpmena.com",
      email: "l.khoury@dpmena.com",
      firstName: "Lina",
      lastName: "Khoury",
      username: "l.khoury",
      status: "disabled",
      userType: "system-user",
      language: "ar",
      timezone: "Asia/Damascus",
      defaultPropertyId: "HOMS1",
      assignedPropertyIds: ["HOMS1"],
      roles: ROLE_PRESETS["Accountant"].roles,
      rolePreset: "Accountant",
      roleLabel: "Accountant",
      lastLogin: "2026-06-11 11:20",
      twoFactorEnabled: false,
      requirePasswordChange: false,
      assistantAccess: false,
    },
  ];

  // ─── Operational mock records (tagged with propertyId) ─────────────────
  const RESERVATIONS = [
    { id: "RES-1001", propertyId: "HOMS1", guestName: "Ahmad Khaled", status: "confirmed", room: "201", nights: 2 },
    { id: "RES-1002", propertyId: "HALEP1", guestName: "Omar Ali", status: "checked-in", room: "108", nights: 1 },
    { id: "RES-1003", propertyId: "HOMS1", guestName: "ابراهيم", status: "checked-in", room: "109", nights: 1 },
    { id: "RES-1004", propertyId: "HALEP1", guestName: "لطيفة أحمد الزهراني", status: "unconfirmed", room: "203", nights: 1 },
    { id: "RES-1005", propertyId: "HOMS1", guestName: "محمد سعد العتيبي", status: "confirmed", room: "110", nights: 3 },
    { id: "RES-1006", propertyId: "HALEP1", guestName: "عمر خالد الغامدي", status: "checked-in", room: "106", nights: 3 },
  ];

  const GUESTS = [
    { id: "GST-01", propertyId: "HOMS1", name: "ابراهيم", phone: "966564179297" },
    { id: "GST-02", propertyId: "HOMS1", name: "محمد سعد العتيبي", phone: "0551234007" },
    { id: "GST-03", propertyId: "HALEP1", name: "عمر خالد الغامدي", phone: "0551234009" },
    { id: "GST-04", propertyId: "HALEP1", name: "لطيفة أحمد الزهراني", phone: "0551234010" },
    { id: "GST-05", propertyId: "HOMS1", name: "عبدالرحمن", phone: "966599035677" },
    { id: "GST-06", propertyId: "HALEP1", name: "LISTFIX GUEST", phone: "0500222111" },
  ];

  const ROOMS = [
    { id: "R-101", propertyId: "HOMS1", number: "101", status: "occupied" },
    { id: "R-102", propertyId: "HOMS1", number: "102", status: "vacant" },
    { id: "R-103", propertyId: "HOMS1", number: "103", status: "dirty" },
    { id: "R-201", propertyId: "HALEP1", number: "201", status: "occupied" },
    { id: "R-202", propertyId: "HALEP1", number: "202", status: "vacant" },
    { id: "R-203", propertyId: "HALEP1", number: "203", status: "maintenance" },
  ];

  const PAYMENTS = [
    { id: "PAY-5001", propertyId: "HOMS1", amount: 5000, currency: "SAR", method: "تحويل بنكي" },
    { id: "PAY-5002", propertyId: "HOMS1", amount: 1000, currency: "SAR", method: "نقداً" },
    { id: "PAY-5003", propertyId: "HALEP1", amount: 2000, currency: "SAR", method: "شام كاش" },
    { id: "PAY-5004", propertyId: "HALEP1", amount: 700, currency: "SAR", method: "نقداً" },
  ];

  const HOUSEKEEPING_TASKS = [
    { id: "HK-01", propertyId: "HOMS1", room: "301", status: "rented-dirty" },
    { id: "HK-02", propertyId: "HOMS1", room: "107", status: "dirty" },
    { id: "HK-03", propertyId: "HALEP1", room: "402", status: "dirty" },
    { id: "HK-04", propertyId: "HALEP1", room: "203", status: "maintenance" },
  ];

  // ─── Storage helpers ────────────────────────────────────────────────
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function getProperties() {
    let list = readJSON(LS_PROPERTIES, null);
    if (!list) {
      list = DEFAULT_PROPERTIES.slice();
      writeJSON(LS_PROPERTIES, list);
    }
    return list;
  }

  function saveProperties(list) {
    writeJSON(LS_PROPERTIES, list);
  }

  function getPropertyById(id) {
    return getProperties().find(function (p) { return p.id === id; }) || null;
  }

  function addProperty(property) {
    const list = getProperties();
    list.push(property);
    saveProperties(list);
    return property;
  }

  function updateProperty(id, patch) {
    const list = getProperties();
    const idx = list.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    saveProperties(list);
    return list[idx];
  }

  function getRooms() {
    let list = readJSON(LS_ROOMS, null);
    if (!list) {
      list = ROOMS.slice();
      writeJSON(LS_ROOMS, list);
    }
    return list;
  }

  function saveRooms(list) {
    writeJSON(LS_ROOMS, list);
  }

  function getRoomsByProperty(propertyId) {
    return getRooms().filter(function (r) { return r.propertyId === propertyId; });
  }

  function addRoom(room) {
    const list = getRooms();
    list.push(room);
    saveRooms(list);
    return room;
  }

  function updateRoom(id, patch) {
    const list = getRooms();
    const idx = list.findIndex(function (r) { return r.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    saveRooms(list);
    return list[idx];
  }

  function deleteRoom(id) {
    const list = getRooms().filter(function (r) { return r.id !== id; });
    saveRooms(list);
  }

  function getUsers() {
    let list = readJSON(LS_USERS, null);
    if (!list) {
      list = DEFAULT_USERS.slice();
      writeJSON(LS_USERS, list);
    }
    return list;
  }

  function saveUsers(list) {
    writeJSON(LS_USERS, list);
  }

  function getUserById(id) {
    return getUsers().find(function (u) { return u.id === id; }) || null;
  }

  function addUser(user) {
    const list = getUsers();
    list.push(user);
    saveUsers(list);
    return user;
  }

  function updateUser(id, patch) {
    const list = getUsers();
    const idx = list.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    saveUsers(list);
    return list[idx];
  }

  function getCurrentUser() {
    return getUserById(CURRENT_USER_ID) || DEFAULT_CURRENT_USER;
  }

  // ─── Access control ─────────────────────────────────────────────────
  function canAccessProperty(user, propertyId) {
    if (!user || !propertyId) return false;
    return user.assignedPropertyIds.indexOf(propertyId) !== -1;
  }

  function hasMultiPropertyAccess(user) {
    return !!user && user.assignedPropertyIds.length > 1;
  }

  function getAssignedProperties(user) {
    const u = user || getCurrentUser();
    const all = getProperties();
    return all.filter(function (p) { return u.assignedPropertyIds.indexOf(p.id) !== -1; });
  }

  // ─── Selected property (self-healing against stale/unauthorized ids) ──
  function getSelectedPropertyId() {
    const user = getCurrentUser();
    let id = null;
    try {
      id = localStorage.getItem(LS_SELECTED_PROPERTY);
    } catch (_) {}

    if (id === "all") {
      if (hasMultiPropertyAccess(user)) return "all";
      id = null;
    }
    if (id && canAccessProperty(user, id)) return id;

    // Access denied / stale selection — fall back to the user's default property.
    const fallback = canAccessProperty(user, user.defaultPropertyId)
      ? user.defaultPropertyId
      : (user.assignedPropertyIds[0] || null);
    if (fallback) setSelectedPropertyId(fallback, { silent: true });
    return fallback;
  }

  function setSelectedPropertyId(id, opts) {
    try {
      localStorage.setItem(LS_SELECTED_PROPERTY, id);
    } catch (_) {}
    if (!opts || !opts.silent) {
      try {
        window.dispatchEvent(new CustomEvent("pms:property-changed", { detail: { propertyId: id } }));
      } catch (_) {}
    }
  }

  function getVisibleRecords(records) {
    const user = getCurrentUser();
    const selected = getSelectedPropertyId();
    if (selected === "all") {
      return records.filter(function (r) { return canAccessProperty(user, r.propertyId); });
    }
    return records.filter(function (r) {
      return r.propertyId === selected && canAccessProperty(user, r.propertyId);
    });
  }

  function getPropertyStats(propertyId) {
    const rooms = getRoomsByProperty(propertyId);
    const total = getPropertyById(propertyId)?.rooms || rooms.length;
    const occupied = rooms.filter(function (r) { return r.status === "occupied"; }).length;
    const reservations = RESERVATIONS.filter(function (r) { return r.propertyId === propertyId; });
    const arrivals = reservations.filter(function (r) { return r.status === "confirmed"; }).length;
    const departures = reservations.filter(function (r) { return r.status === "checked-in"; }).length;
    const revenueToday = PAYMENTS.filter(function (p) { return p.propertyId === propertyId; })
      .reduce(function (sum, p) { return sum + p.amount; }, 0);
    return {
      totalRooms: total,
      occupiedRooms: occupied,
      availableRooms: Math.max(0, total - occupied),
      arrivalsToday: arrivals,
      departuresToday: departures,
      occupancy: total ? Math.round((occupied / total) * 100) : 0,
      revenueToday: revenueToday,
    };
  }

  function resetDemoData() {
    try {
      localStorage.removeItem(LS_PROPERTIES);
      localStorage.removeItem(LS_USERS);
      localStorage.removeItem(LS_SELECTED_PROPERTY);
    } catch (_) {}
    location.reload();
  }

  window.PMSData = {
    // config
    ROLE_CATALOG: ROLE_CATALOG,
    ROLE_PRESETS: ROLE_PRESETS,
    PERMISSION_MODULES: PERMISSION_MODULES,
    PERMISSION_ACTIONS: PERMISSION_ACTIONS,
    PERMISSION_MATRIX: PERMISSION_MATRIX,
    PROPERTY_TYPES: ["Hotel", "Serviced Apartment", "Furnished Apartment", "Resort"],

    // raw operational data (already tagged with propertyId)
    reservations: RESERVATIONS,
    guests: GUESTS,
    payments: PAYMENTS,
    housekeepingTasks: HOUSEKEEPING_TASKS,

    // rooms (persisted)
    getRooms: getRooms,
    saveRooms: saveRooms,
    getRoomsByProperty: getRoomsByProperty,
    addRoom: addRoom,
    updateRoom: updateRoom,
    deleteRoom: deleteRoom,

    // properties
    getProperties: getProperties,
    saveProperties: saveProperties,
    getPropertyById: getPropertyById,
    addProperty: addProperty,
    updateProperty: updateProperty,
    getPropertyStats: getPropertyStats,

    // users
    getUsers: getUsers,
    saveUsers: saveUsers,
    getUserById: getUserById,
    addUser: addUser,
    updateUser: updateUser,
    getCurrentUser: getCurrentUser,

    // access
    canAccessProperty: canAccessProperty,
    hasMultiPropertyAccess: hasMultiPropertyAccess,
    getAssignedProperties: getAssignedProperties,

    // selection
    getSelectedPropertyId: getSelectedPropertyId,
    setSelectedPropertyId: setSelectedPropertyId,
    getVisibleRecords: getVisibleRecords,

    resetDemoData: resetDemoData,
  };
})();
