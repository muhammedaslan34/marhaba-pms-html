# Page completion checklist

| # | Page | File | Mapped from | Verified features |
|---|------|------|-------------|-------------------|
| 1 | Login | `pages/login.html` | `/pms-login` | Email/password, CTA |
| 2 | Dashboard | `pages/dashboard.html` | `/pms` | Stats, charts, quick actions |
| 3 | Reservations | `pages/reservations.html` | `/pms/reservations` | Filters, table/cards/calendar, payment modal |
| 4 | New reservation | `pages/reservation-new.html` | `/pms/reservations/new` | 4-step wizard |
| 5 | Reservation detail | `pages/reservation-detail.html` | `/pms/reservations/view/…` | Stay, rooms, folio, more menu |
| 6 | Check-in/out | `pages/checkin.html` | `/pms/checkin` | Arrivals + departures with checkout CTAs |
| 7 | Guests | `pages/guests.html` | `/pms/guests` | Table + new guest modal |
| 8 | Guest profile | `pages/guest-detail.html` | `/pms/guests/{id}` | Profile, RES, payments, contracts |
| 9 | Availability | `pages/availability.html` | `/pms/availability` | Timeline/calendar/cards + filters |
| 10 | Housekeeping | `pages/housekeeping.html` | `/pms/housekeeping` | Status tiles + room drawer |
| 11 | Payments | `pages/payments.html` | `/pms/payments` | Stats, invoices, payment modal |
| 12 | Cashier | `pages/cashier.html` | `/pms/cashier` | Shift summary, collect, close dialog |
| 13 | Reports | `pages/reports.html` | `/pms/reports` | 12 detail reports + exports |
| 14 | Settings | `pages/settings.html` | `/pms/settings` | Theme, lang/dir, FX, demo info |

## Responsive / RTL

- Shell: collapsible off-canvas sidebar `< lg`
- Logical CSS: `start/end`, `inset-inline`, `ms/me` where applicable
- Settings English toggle switches `dir` to `ltr`
- Tables: horizontal scroll via `.table-wrap`
- Filters: drawer on mobile (reservations, availability)
