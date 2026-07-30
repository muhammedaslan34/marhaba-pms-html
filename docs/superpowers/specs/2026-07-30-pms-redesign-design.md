# Solvfast PMS Frontend Redesign — Design Spec (Draft)

**Date:** 2026-07-30  
**Status:** Awaiting user approval before implementation  
**Source inventory:** `docs/inventory/`

---

## Goals

1. Preserve 100% of observed PMS functionality mapped page-for-page.
2. Deliver a modern, spacious, long-session hotel ops UI with primary accent `#0027B7`.
3. Semantic HTML5 + Tailwind CSS + vanilla JS only.
4. RTL-first structure (`dir="rtl"`) with LTR swap readiness.
5. One shared application shell; custom HTML file per page.

---

## Proposed information architecture

Keep the existing module groups; refine labels and visual weight only:

```
Operations
  Dashboard · Reservations · Arrivals/Departures · Guests · Availability · Housekeeping
Finance
  Payments · Cashier & Shifts
Insights
  Reports
Admin
  Settings
```

Arabic labels remain as in the demo for v1 UI copy.

**UX improvements to apply (functionality preserved):**

1. Departure cards get checkout + collect actions (same as arrivals pattern).
2. Unified localized status/payment method badges.
3. Reservation money column: primary balance chip + secondary FX summary.
4. Housekeeping default sort: Dirty → Occupied → In progress → Ready.
5. Reports overview charts de-emphasized; detail reports elevated.
6. Breadcrumbs: PMS › Module › Entity.
7. Mobile: sticky ops bar (New reservation / Check-in) + off-canvas nav.

---

## Design system (tokens)

| Token | Value |
|-------|-------|
| Primary | `#0027B7` |
| Primary dark (sidebar) | `#001A7A` |
| Secondary | `#079DD8` |
| Background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Text | `#1E293B` |
| Muted | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |

**Typography:** IBM Plex Sans Arabic + IBM Plex Sans (expressive, bilingual).  
**Radius:** 10–12px controls; 16px cards. Soft shadows only. No purple glow / pill spam.

### Components (shared partials via JS include or copy patterns)

- App shell (sidebar, header, breadcrumb, content)
- Stat card, data table, filter bar, status badge
- Buttons (primary/secondary/ghost/danger)
- Modal, drawer, toast, empty, skeleton
- Tabs, pagination, date range, form fields
- Reservation money cell, room status tile

---

## Page deliverable mapping

| Existing URL | Redesign file |
|--------------|---------------|
| `/pms-login` | `pages/login.html` |
| `/pms` | `pages/dashboard.html` |
| `/pms/reservations` | `pages/reservations.html` |
| `/pms/reservations/new` | `pages/reservation-new.html` |
| `/pms/reservations/view/…` | `pages/reservation-detail.html` |
| `/pms/checkin` | `pages/checkin.html` |
| `/pms/guests` | `pages/guests.html` |
| `/pms/guests/…` | `pages/guest-detail.html` |
| `/pms/availability` | `pages/availability.html` |
| `/pms/housekeeping` | `pages/housekeeping.html` |
| `/pms/payments` | `pages/payments.html` |
| `/pms/cashier` | `pages/cashier.html` |
| `/pms/reports` | `pages/reports.html` |
| `/pms/settings` | `pages/settings.html` |

Shared: `assets/css` (Tailwind via CDN + theme), `assets/js/app.js` (shell, sidebar, modals, toasts), `partials` patterns documented in README.

---

## Implementation approaches

### Approach A — Multi-page static HTML (recommended)

- One `.html` file per screen; shared `app.js` injects/toggles shell behavior.
- Pros: Matches “custom HTML page per page”; simple hosting; clear mapping.
- Cons: Some shell markup repeated (mitigate with small JS shell enhancer or build-time note).

### Approach B — Single-page shell + fetch page fragments

- One `index.html` shell; load content fragments.
- Pros: DRY shell.
- Cons: Closer to an SPA; more JS; less aligned with “custom HTML page” request.

### Approach C — Tailwind + Nunjucks/static site generator

- Templates compile to HTML pages.
- Pros: Best DRY for large set.
- Cons: Extra toolchain; user asked for HTML/Tailwind/vanilla JS without frameworks—generator may be overkill.

**Recommendation:** Approach A.

---

## Out of scope for HTML prototype

- Live API binding to solvfaster demo
- Persisting mutations
- Auth beyond a visual login page

Demo data will be hardcoded from inventory samples.
