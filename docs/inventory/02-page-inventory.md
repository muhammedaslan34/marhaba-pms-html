# Page-by-Page Feature Inventory

Sample data and UI elements observed 2026-07-30. Demo hotel: **فندق المدينة بلازا / MADINAH1** · **42 rooms**.

---

## 1. Login — `/pms-login`

| Item | Detail |
|------|--------|
| Purpose | Authenticate staff into PMS |
| Fields | Email, Password |
| Actions | Sign In |
| States | Console error observed on load (non-blocking); success redirects to `/pms` |
| Language | English labels on login (“Solvfast PMS”, “Sign in to continue”) |

---

## 2. Dashboard — `/pms` · الرئيسية

| Item | Detail |
|------|--------|
| Purpose | Today’s operational overview |
| Subtitle | نظرة عامة على اليوم · date · property code `MADINAH1` |
| Header actions | حجز جديد, تسجيل الدخول |
| Stat cards | الإشغال 14.3% (6/42), وصول اليوم 6, مغادرة اليوم 4, إيراد اليوم 3,000 SAR, المستحقات 4,350 SAR |
| Charts / panels | Occupancy last 14 days; الحجوزات حسب الحالة (8 total); الإيراد (ريال); الطلب على أنواع الغرف |
| Quick links | الحجوزات, التوفر, التدبير الفندقي, التقارير |
| Empty/loading | Not observed with current data |

---

## 3. Reservations — `/pms/reservations` · الحجوزات

| Item | Detail |
|------|--------|
| Purpose | Browse, filter, and manage reservations |
| CTA | حجز جديد |
| Views | جدول / بطاقات / تقويم |
| Filter chips | الكل 8, وصول اليوم 2, مغادرة اليوم 2, مقيمون 5, غير مؤكد 1, رصيد مستحق 4, منتهٍ 0, ملغى 0 |
| Search | بحث بالاسم/الهاتف/الهوية/الغرفة/رقم الحجز |
| Table columns | الحجز, النزيل, الغرفة, الإقامة, الحالة, المبالغ, actions |
| Row actions | عرض, دخول (when applicable), دفعة, العقد |
| Sample | RES-2026-00049 ابراهيم · Double Room ×5 · تم الدخول · multi-currency payments |
| Cards view | Same data as cards with totals/received/balance |
| Calendar view | Month grid with guest names, arrivals/departures counts |
| Pagination | All 8 shown; no pager observed |

---

## 4. New reservation — `/pms/reservations/new`

**Wizard steps:** النزيل → الإقامة → الغرف → المراجعة

### Step 1 — Guest
- Search existing guest (name / phone / ID)
- Match list: name, masked phone, prior stays count, “اختيار هذا النزيل”
- “لا أحد منهم — إضافة نزيل جديد” / “إضافة نزيل جديد”
- New guest fields: الاسم الكامل*, الهاتف, البريد, الجنسية, نوع الهوية (جواز سفر / هوية / إقامة / هوية خليجية / هوية / إخراج قيد), رقم الهوية
- Validation hint: “أدخل هاتفاً أو بريداً” when advancing without contact

### Step 2 — Stay
- Hotel (display): فندق المدينة بلازا
- Source: مباشر / بوكينج / إكسبيديا / وكيل
- Check-in date, check-out date
- Adults, children

### Step 3 — Rooms
- Live availability for stay length
- Room types with nightly rate + available count (Double 600, Single 350, Twin 850)
- Quantity number inputs per type
- Running total

### Step 4 — Review
- Not fully submitted (inspection only); expected confirmation before create

**Nav:** السابق / التالي

---

## 5. Reservation detail — `/pms/reservations/view/{id}`

| Section | Content |
|---------|---------|
| Header | Guest name, RES id, status badge |
| Primary actions | تسجيل الدخول / تسجيل الخروج (context-dependent), المزيد |
| More menu | دفعة, استرداد, طباعة/تنزيل العقد, إرسال العقد عبر واتساب, تمديد, تغيير الغرفة, حفظ نسخة دون إنترنت |
| Stay | Hotel, check-in, check-out, nights, guests (adults/children) |
| Guest | Phone, email, ID type, nationality |
| Financials (SAR) | Total, paid, balance, Overpaid / غير مدفوع |
| Rooms | Per room line: type, dates, assignment status, room code, amount; actions: تغيير الغرفة, تمديد, تسجيل الخروج, Assign & check-in |
| Offline contract | Warning + حفظ نسخة محلية |
| Payments table | التاريخ, النوع, الطريقة, المبلغ, الصندوق, سعر الصرف, القيمة الأساسية, استرداد |

**Mixed language note:** Some room actions are English (“Assign & check-in”, “Not assigned”, “Checked-out”, “Financials”, “Overpaid”).

---

## 6. Arrivals & Departures — `/pms/checkin`

| Item | Detail |
|------|--------|
| Purpose | Today’s arrivals and departures board |
| Arrivals (6) | Guest, room type code, hotel, date; actions: تحصيل دفعة, تسجيل الدخول, عرض |
| Departures (4) | Guest, room type, hotel, date; action: عرض |
| Links | عرض → reservation detail |

---

## 7. Guests — `/pms/guests`

| Item | Detail |
|------|--------|
| Count | 18 |
| CTA | نزيل جديد |
| Search | بالاسم، الجوال، الهوية، البريد |
| Columns | الاسم, الجوال, البريد, الجنسية, نوع الهوية, رقم الهوية, الحجوزات, فتح |
| New guest form | الاسم*, الجوال, البريد, الجنسية, نوع الهوية, رقم الهوية, الجنس (—/ذكر/أنثى), تاريخ الميلاد, المهنة · إلغاء / حفظ |

---

## 8. Guest profile — `/pms/guests/{id}`

| Section | Content |
|---------|---------|
| Actions | واتساب, تعديل, حجز جديد |
| Personal | Name, mobile, email, nationality |
| ID | Type, number, gender, occupation |
| Reservations table | الحجز, الفندق, الوصول, المغادرة, الحالة, الرصيد, عرض |
| Payments table | التاريخ, الحجز, النوع, الطريقة, المبلغ |
| Contracts | RES list with واتساب, فتح العقد |
| Edit panel | Same fields as create (subset) · إلغاء / حفظ |

---

## 9. Availability — `/pms/availability`

| Item | Detail |
|------|--------|
| Purpose | Rooms × days occupancy board |
| Date controls | اليوم, date range, 7ي / 14ي / 30ي |
| Views | المخطط الزمني, التقويم, بطاقات |
| Filters | Room type, reservation status, room status, balance |
| Legend | مؤكد, مسجّل الدخول, غير مؤكد, تمت المغادرة, متاح, محدود (≤2), ممتلئ |
| Timeline | Rows by room type (rate + inventory); daily available counts; reservation chips under types |
| Calendar | Month with مقيم/وصول/مغادرة counts |
| Cards | Per type: min availability, active reservations, احجز CTA |
| Room types | Double/Single/Twin × Haram View / Kaaba View |

---

## 10. Housekeeping — `/pms/housekeeping`

| Item | Detail |
|------|--------|
| Purpose | Room readiness / occupancy / cleaning / maintenance |
| Grouping | بدون تجميع / حسب الطابق / حسب النوع / حسب الحالة |
| Views | بطاقات / قائمة |
| Status filters | الكل 42, جاهزة 37, مشغولة 3, تنظيف 2, قيد التنفيذ 0, صيانة 0, محظورة 0 |
| Search | برقم الغرفة / النوع / الطابق |
| Room card | Number, type (توأمية/مزدوجة/مفردة), floor, status; guest + departure/arrival hints; payment flag |
| Room editor | Status radios, assignee (auto or staff names), ETA minutes, notes, status history · إلغاء / حفظ |

Staff names observed: ريم فيصل, سارة أحمد, عمر خالد, محمد عبدالعزيز

---

## 11. Payments — `/pms/payments` · المدفوعات

| Item | Detail |
|------|--------|
| Stats | الفواتير النشطة 11, المستحقات -1,475 SAR, تسويات معلّقة 4, إيراد اليوم 9,000 SAR |
| Methods summary | credit_card / cash / bank_transfer (raw English keys) |
| Invoice table | فاتورة (RES), النزيل, الرصيد, دفعة / فتح |
| Record payment form | العملة (SAR/SYP/USD), المبلغ, طريقة الدفع (Bank Draft, Cash, Cheque, Credit Card, Sham Cash, Wire Transfer) · إلغاء / حفظ الدفعة |

---

## 12. Cashier & Shifts — `/pms/cashier`

| Item | Detail |
|------|--------|
| Open shift | SHIFT-2026-0004 |
| Cashier | ريم فيصل - HR-EMP-00004 - SDH |
| Opened at | timestamp |
| Balances | Opening 100 SAR, current 0 SAR |
| Totals | Received 19,249.22 SAR, refunded 0, 9 transactions |
| By currency | SAR / SYP / USD with base conversion |
| By method | Bank Draft, Cash, Cheque, Sham Cash + % |
| Collect list | Reservations with تحصيل دفعة |
| Search | بحث في الحجوزات… |
| Close shift dialog | Expected cash, counted cash input · إلغاء / تأكيد الإغلاق |

---

## 13. Reports — `/pms/reports`

| Item | Detail |
|------|--------|
| Filters | من تاريخ, إلى تاريخ, العملة (default/SAR/SYP/USD) |
| Overview | Same chart widgets as dashboard + PDF |
| Detail reports | وصول اليوم, مغادرة اليوم, الإشغال الحالي, الإيراد اليومي, تقرير الإشغال الشهري, إشغال أنواع الوحدات, النزلاء الحاليون, تقرير عدم الحضور, تقرير الإلغاءات, تقرير طرق الدفع, الأرصدة المستحقة, ملخّص حالة الوحدات |
| Report panel example (Arrivals) | Title + Excel / PDF / طباعة; columns: النزيل, الفندق, Room Type, تسجيل الدخول, تسجيل الخروج, الحالة |

---

## 14. Settings — `/pms/settings`

### User preferences
- Appearance: light / dark (الوضع الداكن toggle)
- Language: English / العربية
- Default transaction currency: SAR / SYP / USD

### Financial
- Exchange rates: ISO code + “1 SAR = ? foreign”; table of currencies → cash accounts
- Audit log of rate changes

### Admin / demo data
- Demo stats: 14 reservations · 18 guests · daily refresh note
- Version: `01061d5 · 2026-07-30`

---

## Global search

Present on all pages (`بحث…`). Exact search scope not fully verified beyond presence; likely global/quick find.
