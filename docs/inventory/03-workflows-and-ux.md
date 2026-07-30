# Workflows, Connections & UX Analysis

## Main workflows

### A. Create reservation
1. Dashboard / header **جديد** or Reservations **حجز جديد**
2. `/pms/reservations/new` → select or create guest
3. Stay details (dates, source, pax)
4. Pick room quantities from live availability
5. Review → create (not executed in inspection)
6. Lands in reservation list / detail

### B. Check-in
1. Dashboard **تسجيل الدخول** or sidebar **الوصول والمغادرة** or reservation row **دخول**
2. On arrival card: optional **تحصيل دفعة** then **تسجيل الدخول**
3. Or reservation detail **تسجيل الدخول** / room-level **Assign & check-in**

### C. Check-out
1. Reservation detail **تسجيل الخروج** (header or per-room)
2. Departures board links to detail via **عرض** (no dedicated checkout CTA on departures list)

### D. Collect payment
1. Payments page **دفعة**, or reservation **دفعة**, or check-in **تحصيل دفعة**, or cashier list
2. Currency + amount + method → save (not saved in inspection)
3. Multi-currency with FX from Settings

### E. Housekeeping cycle
1. Housekeeping board filtered by status
2. Open room → set status / assignee / ETA / notes
3. Status feeds availability filters (dirty vacant/occupied)

### F. Guest CRM
1. Guests list → **فتح** profile
2. Edit, WhatsApp, new reservation, view RES / payments / contracts

### G. End-of-day cashier
1. Cashier page open shift summary
2. Collect remaining payments
3. **إغلاق الوردية** → count cash → confirm (cancelled in inspection)

### H. Reporting
1. Reports overview charts
2. Pick detail report → Excel / PDF / print

---

## Page connections map

```
Login → Dashboard
Dashboard ⇄ Reservations / Check-in / Availability / Housekeeping / Reports
Reservations → New wizard → (create) → Detail
Reservations → Detail ⇄ Payments / Guests / Check-in actions
Check-in → Detail / Payment form
Guests → Profile → Detail / New reservation
Availability → Book (احجز) → New reservation
Payments → Detail / Payment form
Cashier → Payment form / Close shift
Settings → preferences affecting all pages (lang, FX, theme)
```

---

## UX issues (observed)

| # | Issue | Impact | Recommendation |
|---|-------|--------|----------------|
| 1 | Mixed AR/EN labels (“Assign & check-in”, “Financials”, “Overpaid”, payment method keys `credit_card`) | Inconsistent professionalism; hard for Arabic-first staff | Unify all UI strings; localize method labels |
| 2 | Departures list only has **عرض** — no checkout / settle CTA | Extra clicks on busiest workflow | Add تسجيل الخروج + تحصيل on departure cards |
| 3 | Dense multi-currency amounts in reservation table | Hard to scan balance at a glance | Primary balance badge + expand for FX breakdown |
| 4 | Duplicate global vs page search fields | Visual noise | One global search; page-specific filters in toolbar |
| 5 | Availability timeline + many filters = cognitive load | Risk of mis-booking | Progressive disclosure; sticky legend; default “today + 7 days” |
| 6 | Housekeeping room tiles all equal weight | Dirty/occupied rooms don’t pop | Stronger status color + sort “needs attention first” |
| 7 | Reports duplicate dashboard charts | Redundant | Dashboard = today ops; Reports = historical + exports |
| 8 | Payment method summary uses snake_case English | Unpolished | Human labels matching payment form |
| 9 | Cashier “current balance 0” with large received total | Confusing meaning of “current” | Clarify labels: drawer vs shift totals |
| 10 | Property selector appears non-interactive (single property) | Dead affordance if only one hotel | Hide selector or show single-property static label |
| 11 | Wizard blocked by weak validation messaging | Friction | Inline field errors, not only footer hint |
| 12 | Mobile header collapses to “M” only | Weak orientation | Keep page title + menu + primary CTA |
| 13 | Status chips on reservations are many (8) | Filter overload | Group: operational filters vs status filters |
| 14 | No breadcrumbs beyond PMS / page | Hard to return from deep guest/RES pages | Full breadcrumb trail |

---

## What to preserve

- Full module set and routes
- Reservation wizard steps and fields
- Multi-currency + FX + cash accounts
- Shift open/close cashier model
- Housekeeping statuses and assignment
- Contract / WhatsApp / offline copy features
- Report catalog and export actions
- RTL-first Arabic experience + language toggle

## Explicit non-goals for redesign

- No new hotel business rules
- No removed capabilities without documented reason
- No React/Vue/Angular (static HTML + Tailwind + vanilla JS)
