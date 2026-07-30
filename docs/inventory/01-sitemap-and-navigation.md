# Solvfast PMS — Sitemap & Navigation Hierarchy

**Source:** https://pmsdemo.solvfaster.com/pms/  
**Inspected:** 2026-07-30  
**Locale observed:** Arabic (`lang=ar`, `dir=rtl`)  
**Property:** فندق المدينة بلازا (MADINAH1)  
**Login:** `/pms-login` → redirects to `/pms`

---

## Visited checklist

| # | Page | URL | Status |
|---|------|-----|--------|
| 1 | Login | `/pms-login` | Visited |
| 2 | Dashboard (الرئيسية) | `/pms` | Visited |
| 3 | Reservations list | `/pms/reservations` | Visited |
| 4 | New reservation wizard | `/pms/reservations/new` | Visited (no submit) |
| 5 | Reservation detail | `/pms/reservations/view/{id}` | Visited |
| 6 | Check-in / Check-out | `/pms/checkin` | Visited |
| 7 | Guests list | `/pms/guests` | Visited |
| 8 | Guest profile | `/pms/guests/{id}` | Visited |
| 9 | Availability | `/pms/availability` | Visited (timeline/calendar/cards) |
| 10 | Housekeeping | `/pms/housekeeping` | Visited + room editor |
| 11 | Payments | `/pms/payments` | Visited + payment form |
| 12 | Cashier / Shifts | `/pms/cashier` | Visited + close-shift dialog (cancelled) |
| 13 | Reports | `/pms/reports` | Visited + Arrivals detail |
| 14 | Settings | `/pms/settings` | Visited |

**Not modified:** No reservations created, no payments saved, no shift closed, no guest edits saved, no settings saved.

---

## Sidebar navigation hierarchy

```
Solvfast PMS
├── الرئيسية                          → /pms
├── عمليات اليوم (group label)
│   ├── الحجوزات                      → /pms/reservations
│   ├── الوصول والمغادرة              → /pms/checkin
│   ├── النزلاء                       → /pms/guests
│   ├── التوفر                        → /pms/availability
│   └── التدبير الفندقي               → /pms/housekeeping
├── المالية (group label)
│   ├── الدفعات                       → /pms/payments
│   └── الصندوق والورديات             → /pms/cashier
├── التقارير                          → /pms/reports
└── الإدارة (group label)
    └── الإعدادات                     → /pms/settings
```

Group labels (عمليات اليوم / المالية / الإدارة) are section headers, not links.

---

## Secondary / nested routes

| Route pattern | Purpose |
|---------------|---------|
| `/pms/reservations/new` | 4-step create reservation wizard |
| `/pms/reservations/view/{RES-…}` | Reservation detail / folio |
| `/pms/guests/{id}` | Guest profile |

---

## Global chrome (all authenticated pages)

| Element | Observed behavior |
|---------|-------------------|
| Brand | “S” mark + “Solvfast PMS” in sidebar |
| Breadcrumb area | `PMS` + current page title |
| Property selector | “فندق المدينة بلازا” (header) — click did not expose alternate properties in this session |
| Quick create | Header “جديد” → links to `/pms/reservations/new` |
| Global search | Header input placeholder `بحث…` |
| User | Avatar initial “M” (manager) |
| Language / RTL | Full RTL Arabic UI; Settings offers English / العربية |
| Mobile | Sidebar hidden; hamburger opens off-canvas sidebar |

---

## Reservation statuses (observed)

- غير مؤكد (Unconfirmed)
- مؤكد (Confirmed)
- تم الدخول / مسجّل الدخول (Checked-in)
- تمت المغادرة (Checked-out)
- ملغى (Cancelled)
- لم يحضر (No-show)
- مكتمل (Completed)
- منتهٍ (Ended — filter chip)

## Room / housekeeping statuses (observed)

- جاهزة (Ready / vacant clean)
- مشغولة (Occupied)
- تنظيف (Dirty / cleaning)
- قيد التنفيذ (In progress)
- صيانة (Maintenance)
- محظورة (Blocked)
- تنظيف (شاغرة) / تنظيف (مشغولة) — availability filters
