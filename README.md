# Marhaba PMS — Frontend Redesign

Static HTML redesign of the Marhaba hotel PMS demo (`pmsdemo.marhaba.com`), built from a full live inventory (2026-07-30).

## Stack

- Semantic HTML5
- Tailwind CSS (CDN for local pages) + `assets/css/app.css`
- Vanilla JavaScript (`assets/js/app.js`)
- RTL Arabic first (`dir="rtl"`), LTR-ready logical properties
- Brand primary: `#0027B7`

## Run locally

### Option A — recommended (local server)

Needs **Node.js 18+**.

```bash
cd PMSDEMO
npm start
```

Then open:

- http://localhost:4173/
- or http://localhost:4173/pages/login.html

`npm start` serves the project folder with [`serve`](https://www.npmjs.com/package/serve) (no install required beyond Node).

### Option B — open files directly

1. Open `index.html` or `pages/login.html` in your browser  
   (double-click, or drag into Chrome/Edge).
2. Demo login submits to `pages/dashboard.html` (no real auth).

> Tip: a local server (Option A) is better for navigation, relative assets, and avoiding some browser `file://` limits.

### Option C — Python server (no npm)

```bash
cd PMSDEMO
python -m http.server 4173
```

Open http://localhost:4173/

### Demo login

Any values work on the login form — it just navigates to the dashboard. There is no backend auth.

## Build for Cloudflare (optional)

Local browsing uses the Tailwind CDN in the HTML pages. For Workers/Pages deploy, build a `dist/` folder without the CDN:

```bash
npm install
npm run build
npx wrangler deploy
```

- `npm run build:css` — compile Tailwind to `assets/css/tailwind.css`
- `npm run build` — CSS + copy/transform site into `dist/`
- Config: `wrangler.jsonc` (assets from `./dist`)

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
