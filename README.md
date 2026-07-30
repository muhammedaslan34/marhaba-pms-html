# Solvfast PMS — Frontend Redesign

Static HTML redesign of the Solvfast hotel PMS demo (`pmsdemo.solvfaster.com`), built from a full live inventory (2026-07-30).

## Stack

- Semantic HTML5
- Tailwind CSS (CDN) + `assets/css/app.css`
- Vanilla JavaScript (`assets/js/app.js`)
- RTL Arabic first (`dir="rtl"`), LTR-ready logical properties
- Brand primary: `#0027B7`

## Open locally

Open `index.html` or `pages/login.html` in a browser (no build step).

Demo login form submits to `pages/dashboard.html` (no real auth).

## Page map (existing → redesign)

| Existing URL | Redesign file | Status |
|--------------|---------------|--------|
| `/pms-login` | `pages/login.html` | Done |
| `/pms` | `pages/dashboard.html` | Done |
| `/pms/reservations` | `pages/reservations.html` | Done |
| `/pms/reservations/new` | `pages/reservation-new.html` | Done |
| `/pms/reservations/view/…` | `pages/reservation-detail.html` | Done |
| `/pms/checkin` | `pages/checkin.html` | Done |
| `/pms/guests` | `pages/guests.html` | Done |
| `/pms/guests/…` | `pages/guest-detail.html` | Done |
| `/pms/availability` | `pages/availability.html` | Done |
| `/pms/housekeeping` | `pages/housekeeping.html` | Done |
| `/pms/payments` | `pages/payments.html` | Done |
| `/pms/cashier` | `pages/cashier.html` | Done |
| `/pms/reports` | `pages/reports.html` | Done |
| `/pms/settings` | `pages/settings.html` | Done |

## Docs

- Inventory: `docs/inventory/`
- Design spec: `docs/superpowers/specs/2026-07-30-pms-redesign-design.md`
- Plan: `docs/superpowers/plans/2026-07-30-pms-redesign.md`

## UX improvements included

- Checkout + collect actions on departure cards
- Localized payment method labels
- Clearer balance hierarchy on reservations
- Housekeeping attention-first default chip
- Reports emphasize detail exports over duplicate dashboard charts
- Breadcrumbs, off-canvas mobile nav, filter drawers
- Cashier labels clarify drawer vs shift totals

## Notes

- All mutations are simulated (toasts only); no live API.
- Sample content mirrors the Madinah Plaza demo data.
