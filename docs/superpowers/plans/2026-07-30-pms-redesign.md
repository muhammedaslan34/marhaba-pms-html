# PMS Redesign Implementation Plan

> **For agentic workers:** Use Approach A — one HTML file per page, shared assets.

**Goal:** Ship a complete static HTML/Tailwind/vanilla-JS redesign of Solvfast PMS mapped 1:1 to the inventory.

**Tech:** Tailwind CDN + `assets/css/app.css` + `assets/js/app.js` · RTL Arabic · primary `#0027B7`

## Files

| Path | Responsibility |
|------|----------------|
| `index.html` | Redirect to `pages/dashboard.html` |
| `assets/css/app.css` | Shell, tables, badges, RTL helpers |
| `assets/js/app.js` | Sidebar, modals, toasts, filters, dir helper |
| `pages/*.html` | 14 screens (see design spec mapping) |
| `README.md` | How to open + page map |

## Tasks

1. Shared design system (CSS + JS + shell patterns)
2. Auth + dashboard + reservations suite
3. Ops pages (checkin, guests, availability, housekeeping)
4. Finance + reports + settings
5. README + mapping checklist + responsive/RTL smoke check

No live API. Demo data from inventory. No destructive behaviors.
