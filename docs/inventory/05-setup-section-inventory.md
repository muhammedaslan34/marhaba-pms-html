# PMS `/setup` Admin Section — Complete Inventory

**Source:** Live exploration of `https://app.marhaba-syria.sy/setup`  
**Captured:** 2026-08-04  
**Screenshots:** `setup-*.png` in repo root (76 files)

**Top-level sidebar categories:** Company, Blocks & Floors, Units, Financial, General Settings, Reporting, Outlets, Rules, Housekeeping Settings, Subscriptions, Guest Supplies

---

## Setup Landing — `/setup`

- Entry point for all admin configuration.
- Persistent “Your property still not ready” onboarding checklist (6 steps) with Start / Remind me later.

---

## Company

### Properties — `/company/propertysetup`
- Filters: Name/Code, Country, Status, Account Version
- Columns: Property, Code, Status, Account Version, Country, City, District, Actions

### Property Info — `/company/propertyInfo`
- Filters: Name/Code, Status
- Columns: Property, Code, Status, Tourism License Details, Commercial Details, Property photos, Actions
- Edit: Commercial Details (Comm. Reg. No.*, Activity License, VAT Reg. No., Comm. Reg. File), Property Details (Rating, Description bilingual), Property photos

### Users — `/users/usersetup`
- Filters: Properties, Full Name, Role, User Type, Username, Status, Mobile, Email
- Columns: Full Name, Username, Status, Role, User Type, Properties, Mobile, Email, Actions
- New User: User Type*, Role*, Username*/Password, Language, Expiry, Employment Data, Contact, Property assignment dual-list

### Roles — `/users/roles`
- Filters: Name, Status, Is Default
- Columns: Role, Source, Status, Description, Actions
- New Role: Name*, Description, Full/Limit Access, privilege groups with View/Add/Edit/Delete + advanced privileges

---

## Blocks & Floors

### Blocks — `/block-Floor/blooks`
- Columns: Block Name, Status, No. of Floors, Description, Actions
- Edit: Active toggle, Block Name* (bilingual), Description

### Floors — `/block-Floor/floors`
- Filters: Block, Order, Name, Description
- Columns: Block Name, Order, Floor, Status, Description, Actions
- Add: Block Name, Order*, Floor Name*, Description

---

## Units

### Type Customization — `/units-management/unit-type-customization`
- New: Unit Type*, Area, Single/Double Beds, Base Occupancy, Description, Images

### Units Amenities — `/general-settings/unit-amenities`
- Columns: Name, Status, Type, Description
- Add: Amenity*, Description

### Unit Setup — `/units-management/unit-setup`
- Card grid; filters: Block, Floor, Unit Number, Status, Class, Type, Group
- New: Unit Number*, Class*, Type*, Can be merged, Block/Floor*, Phone Extension, Toilets, Kitchen*, Hall*, Area, Beds, Amenities, Description

### Merge Settings — `/units-management/unit-merge-settings`
- New: Block, Floor, Classes, Unit A*, Unit B*

### Base Rate — `/financial/base-rate/edit`
- Per unit type: Low/High Weekdays Rate, Min Rate, Monthly Rate

### Seasonal Rate — `/financial/seasonal-rates`
- Add: Name*, Start/End*, Description, Currency*, per-type Low/High/Min rates

### Special Rate — `/financial/special-rates`
- Add: Name*, Start/End*, Description, Currency*, per-type Rate/Min Rate

### Rate Plans — `/financial/rate-plans`
- Tabs: Rent Rate | Meals; per-type daily/monthly; meal Adult/Child prices

---

## Financial

### Bank Accounts — `/financial/bank-setup`
- New: Bank Name*, Account Number*, Currency*, IBAN, Description

### Cost Centers — `/financial/CostCenter`
- Add: Name*, Category*, Description

### Security Deposit — `/financial/insurance/edit`
- Per unit type editable Security Deposit amounts + Save

### Taxes & Fees — `/financial/taxesCustomization`
- New: Use for expenses vouchers, Type Tax/Fee, Tax Name*, Method*, Amount*, Applied On*, dates, Charged on fee(s)

### Currencies — `/financial/currency-customization`
- New: Currency*, Default Currency, Exchange Rate*, Pricing Currency

### Payment Methods — `/general-settings/payment-methods`
- Add: Payment Method* (picker). Seeded: Cash, Mada, Cheque, Visa, Master Card, Amex, Bank Transfer, Sham Cash

### Discount Types — `/control-panel/discount-types`
- Add: Discount Type*, Report Name*, Description

---

## General Settings

### Date/Time — `/general-settings/date-time-settings`
- Time Zone readonly, Date Format*, Time Format AM/PM | 24h

### Reservation Sources — `/control-panel/reservation-sources`
- Add: Source*, Report Name*, Url, Nazeel Percentage, Description

### Guest Classes — `/guest-classes`
- New: Blacklist toggle, Class Name*, Order*, Icon, Discount Method/Amount, Description

### Loyalty — `/general-settings/loyalty-program-settings`
- Auto Upgrade Settings; Criteria*, Score*, Upgrade to Class*

### SMS Auto Send — `/sms/auto-send-settings`
- Tabs For Guests | For Users; trigger cards; user assignment table

### Property Facilities — `/general-settings/property-facility-customization`
- Add: Facility Category, Property Facility*, Description

---

## Reporting

### Numbering Options — `/reporting/numbering-options`
- Edit: Naming Method*, Prefix, Seq starting No.*, Example preview

### Printing Options — `/reporting/printing-options`
- Contract template Double/Single Language; Letter Head / Blank Paper; per-report paper checkboxes

---

## Outlets

### Outlet Setup — `/items-addons/outlet-setup`
- Dialog: Operating Status*, Code*, Name*, Description

### Items Categories — `/items-addons/outlets-categories`
- Dialog: Outlet*, Name, Description

### Items — `/items-addons/items-setup`
- New page: Name, Type*, Outlet*, Category*, Description, Suggested Price* (+ currency), Tax Exempted / Free Item / User Defined Price toggles

---

## Rules

### Terms & Conditions — `/policies/propertiescondition`
- New: Order, Condition* (bilingual)

### Penalties — `/policies/penalities`
- New: Tax Excluded, Name*, Category*, Calculation Method Amount|Percentage, Calculated Of, Description

### Reservation — `/general-settings/reservation`
- Check-in/out times, grace period, auto-extend, unit change rules, unconfirmed/monthly/no-show/OTA cancel toggles

### Cancel / No Show Reasons — `/policies/cancelreasons`
- New: Name*, Description, Assign Penalties

### Change Unit Reasons — `/policies/ChangeUnitReasons`
- Dialog: Comment Is Required, Name*

### Night Audit — `/night-audit/nightSetting`
- Switch On, Allowance Period, Cancellation Threshold

### Guest Feedback Metrics — `/policies/guest-feedback-metrics/guest-feedback-metrics-list`
- Append: Metric* picker

---

## Housekeeping Settings

### Housekeepers — `/house-keeping/house-keepers`
- Add: User*, Enable SMS Notifications

### Task Types — `/house-keeping/house-keeping-task-type-customization`
- Add: Task type*, Set as Routine

---

## Subscriptions — `/subscription-management/service-management`

Tabs: Marhaba | SMS | MOI system | Syria Stats | PayTabs | Tap  
Each tab: status/credentials/toggles + Related Activation Requests table.

---

## Guest Supplies

### Categories — `/guest-supplies/supplies-category`
- Add: Category Name*, Description

### Guest Supplies — `/guest-supplies/guest-supplies`
- Add: Supply Name*, Category*, Description

### Unit Usages — `/guest-supplies/Supplies-Unit-Usages`
- New: Unit Type multi-select, Category, Supply, Daily/Weekly Quantity, Append grid

---

## Mapping to redesign pages

| Live area | Redesign file |
|-----------|---------------|
| `/setup` | `pages/setup.html` |
| Company…Guest Supplies tabs | `pages/setup-*.html` (45 screens) |

Screenshots remain in repo root as visual reference for further field-level refinement.
