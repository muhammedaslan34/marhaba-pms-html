const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, '..', 'res-data.json'), 'utf8');
const data = JSON.parse(JSON.parse(raw));

// Room-type bed icons (match source .rz-typeicon paths)
const ROOM_ICON_INNER = {
  'Apartment': '<path d="M2 17v-3.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V17"></path><path d="M2 17v2.5M22 17v2.5M2 13.5h20"></path><rect x="4.5" y="8.5" width="7" height="4" rx="1.2"></rect><rect x="12.5" y="8.5" width="7" height="4" rx="1.2"></rect>',
  'Double Room': '<path d="M2 17v-3.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V17"></path><path d="M2 17v2.5M22 17v2.5M2 13.5h20"></path><rect x="4.5" y="8.5" width="7" height="4" rx="1.2"></rect><rect x="12.5" y="8.5" width="7" height="4" rx="1.2"></rect>',
  'Twin Room': '<rect x="2" y="10" width="8.5" height="7.5" rx="1.5"></rect><rect x="13.5" y="10" width="8.5" height="7.5" rx="1.5"></rect><path d="M3.5 12.5h5.5M15 12.5h5.5M2 17.5v1.6M22 17.5v1.6"></path>',
  'Single Room': '<path d="M3 17v-3.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2V17"></path><path d="M3 17v2.5M21 17v2.5M3 13.5h18"></path><rect x="8.5" y="8.5" width="7" height="4" rx="1.2"></rect>',
};
function roomIconInner(roomType) {
  for (const key of Object.keys(ROOM_ICON_INNER)) {
    if (roomType.includes(key)) return ROOM_ICON_INNER[key];
  }
  return ROOM_ICON_INNER['Double Room'];
}

// Card "state" config: color, foot bg, foot icon, foot label (match source)
// arrival (وصول اليوم)  -> purple #7B4FC8, log-in
// departure (مغادرة اليوم) -> blue #2E7FE8, log-out
// inhouse (نزيل حالي)    -> red #C44755, user-check
// awaiting (بانتظار الدخول) -> purple prop, split red|blue foot, log-in
const ICON_LOGIN = '<path d="m10 17 5-5-5-5"></path><path d="M15 12H3"></path><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>';
const ICON_LOGOUT = '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path>';
const ICON_USERCHECK = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="m16 11 2 2 4-4"></path>';
const ICON_CHEVRON = '<path d="m15 18-6-6 6-6"></path>';

function cardState(r, ci, co) {
  if (ci === TODAY) return { key: 'arrival', propColor: '#7B4FC8', propBg: 'rgba(123,79,200,0.1)', footBg: 'rgb(123,79,200)', icon: ICON_LOGIN, footLabel: 'وصول اليوم' };
  if (co === TODAY) return { key: 'departure', propColor: '#2E7FE8', propBg: 'rgba(46,127,232,0.1)', footBg: 'rgb(46,127,232)', icon: ICON_LOGOUT, footLabel: 'مغادرة اليوم' };
  if (r.status.includes('حالي')) return { key: 'inhouse', propColor: '#C44755', propBg: 'rgba(196,71,85,0.1)', footBg: 'rgb(196,71,85)', icon: ICON_USERCHECK, footLabel: 'نزيل حالي' };
  return { key: 'awaiting', propColor: '#7B4FC8', propBg: 'rgba(123,79,200,0.1)', footBg: 'linear-gradient(115deg,#C44755 0,#C44755 49%,#3B82F6 51%,#3B82F6 100%)', icon: ICON_LOGIN, footLabel: 'بانتظار الدخول' };
}

function statusBadge(status) {
  const s = status.trim();
  if (s.includes('حالي')) return { cls: 'badge-success', label: 'نزيل حالي' };
  if (s.includes('بانتظار')) return { cls: 'badge-primary', label: 'بانتظار الدخول' };
  if (s.includes('وصول')) return { cls: 'badge-info', label: 'وصول اليوم' };
  if (s.includes('مغادرة')) return { cls: 'badge-info', label: 'مغادرة اليوم' };
  if (s.includes('مغادرة') || s.includes('منته')) return { cls: 'badge-neutral', label: 'منتهٍ' };
  if (s.includes('ملغ')) return { cls: 'badge-danger', label: 'ملغى' };
  if (s.includes('غير مؤكد')) return { cls: 'badge-warning', label: 'غير مؤكد' };
  return { cls: 'badge-neutral', label: s || '—' };
}

function parseMoney(money) {
  // e.g. "مدفوع بالكاملالإجمالي 1,500 USD · المستلم 1,500 USD"
  // e.g. "المتبقي 900 USDالإجمالي 900 USD"
  const m = money.trim();
  const idx = m.indexOf('الإجمالي');
  let primary = idx >= 0 ? m.slice(0, idx) : m;
  let meta = idx >= 0 ? 'الإجمالي ' + m.slice(idx + 'الإجمالي'.length) : '';
  primary = primary.trim();
  meta = meta.trim();
  const isPaid = primary.includes('مدفوع');
  const isDue = primary.includes('المتبقي');
  let primaryCls = 'money-credit';
  if (isPaid) primaryCls = 'money-credit';
  else if (isDue) primaryCls = 'money-due';
  return { primary, meta, primaryCls, isPaid, isDue };
}

function parseStay(stay) {
  // "13 Aug 2026 → 14 Aug 20261 ليلة"
  const m = stay.match(/^(\d{1,2} \w{3,4}\.? \d{4} → \d{1,2} \w{3,4}\.? \d{4})\s*(.+)$/);
  if (m) return { range: m[1].trim(), nights: m[2].trim() };
  return { range: stay.trim(), nights: '' };
}

function parseRoomParts(room) {
  // "Double Room · 201" | "Double Room · 109، 201، 301، 401" | "Double Room · 401، 110 · Single Room · 114"
  const parts = room.split(' · ').map(s => s.trim()).filter(Boolean);
  const types = parts.filter((_, i) => i % 2 === 0);
  const nums = parts.filter((_, i) => i % 2 === 1);
  return {
    type: (types.join('، ') || room).trim(),
    num: (nums.join('، ') || '').trim(),
  };
}

function roomType(room) {
  return parseRoomParts(room).type;
}

// ---- Compute chip counts ----
const TODAY = '2026-08-13';
function toDate(dmy) {
  const m = dmy.match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!m) return '';
  const map = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Sept:'09',Oct:'10',Nov:'11',Dec:'12' };
  const dd = m[1].padStart(2,'0');
  return `${m[3]}-${map[m[2]]}-${dd}`;
}
const counts = { all: data.length, arrivals: 0, departures: 0, inhouse: 0, warning: 0, due: 0 };
data.forEach(r => {
  const st = parseStay(r.stay);
  const ci = toDate(st.range.split('→')[0]);
  const co = toDate(st.range.split('→')[1]);
  if (ci === TODAY) counts.arrivals++;
  if (co === TODAY) counts.departures++;
  if (r.status.includes('حالي')) counts.inhouse++;
  if (r.status.includes('غير مؤكد')) counts.warning++;
  const mo = parseMoney(r.money);
  if (mo.isDue) counts.due++;
});

// ---- Generate table rows ----
const tableRows = data.map(r => {
  const st = parseStay(r.stay);
  const mo = parseMoney(r.money);
  const sb = statusBadge(r.status);
  const rp = parseRoomParts(r.room);
  const room = r.room;
  const rt = rp.type;
  return `                    <tr data-res="${r.res}" data-guest="${r.guest.replace(/"/g,'')}" data-phone="${r.phone}" data-room="${rt}" data-checkin="${toDate(st.range.split('→')[0])}" data-checkout="${toDate(st.range.split('→')[1])}" data-status="${r.status.includes('حالي')?'inhouse':(r.status.includes('بانتظار')?'confirmed':'other')}" data-balance="${mo.isDue?'due':'paid'}">
                      <td class="font-extrabold text-primary"><a href="reservation-detail.html">${r.res}</a></td>
                      <td class="font-semibold">${r.guest}<br/><span class="text-xs text-slate-400 font-medium">${r.phone}</span></td>
                      <td><span class="badge badge-neutral">${room}</span></td>
                      <td>${st.range}<br/><span class="text-xs text-slate-400">${st.nights}</span></td>
                      <td><span class="badge ${sb.cls}">${sb.label}</span></td>
                      <td>
                        <div class="money-primary ${mo.primaryCls}">${mo.primary}</div>
                        <div class="money-meta">${mo.meta}</div>
                      </td>
                      <td>
                        <div class="action-cell justify-center w-full">
                          <a class="icon-btn" href="reservation-detail.html" title="عرض الحجز" aria-label="عرض الحجز"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></a>
                          <a class="icon-btn is-success" href="${r.whatsapp}" target="_blank" rel="noopener" title="واتساب" aria-label="واتساب"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.2c-.24.68-1.4 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.37-.15-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36l.57.01c.18.01.43-.07.67.51.24.59.82 2.03.89 2.18.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.61-.13.24.09 1.55.73 1.82.86.27.14.45.2.51.31.07.11.07.64-.17 1.32Z"/></svg></a>
                          <button type="button" class="icon-btn" title="العقد" aria-label="العقد" data-action="toast" data-message="فتح العقد"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6" stroke-linecap="round"/></svg></button>
                        </div>
                      </td>
                    </tr>`;
}).join('\n');

// ---- Generate cards (source rz-card style) ----
const WA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path></svg>';
const CONTRACT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>';
const EYE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>';

const cards = data.map(r => {
  const st = parseStay(r.stay);
  const mo = parseMoney(r.money);
  const ci = toDate(st.range.split('→')[0]);
  const co = toDate(st.range.split('→')[1]);
  const cs = cardState(r, ci, co);
  const rp = parseRoomParts(r.room);
  const stat = r.status.includes('حالي') ? 'inhouse' : (r.status.includes('بانتظار') ? 'confirmed' : 'other');
  const balClass = mo.isDue ? 'rz-bal due' : 'rz-bal paid';
  const balText = mo.isDue ? mo.primary.replace('المتبقي', 'متبقي').trim() : 'مدفوع بالكامل';
  return `              <article class="rz-card" data-res="${r.res}" data-guest="${r.guest.replace(/"/g,'')}" data-phone="${r.phone}" data-room="${rp.type}" data-checkin="${ci}" data-checkout="${co}" data-status="${stat}" data-balance="${mo.isDue?'due':'paid'}">
                <a class="rz-link" aria-label="${r.guest}" href="reservation-detail.html">
                  <div class="rz-top rz-top-stack">
                    <div class="rz-guest truncate rz-guest-full">${r.guest}</div>
                    <div class="rz-sub-row">
                      <div class="rz-room-number" title="رقم الغرفة"><strong dir="ltr">${rp.num || '—'}</strong></div>
                      <span class="rz-prop" title="${r.room}" style="--prop: ${cs.propColor}; background: ${cs.propBg};"><svg class="rz-typeicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${roomIconInner(rp.type)}</svg></span>
                    </div>
                    <div class="rz-room-type truncate rz-room-type-full">${rp.type}</div>
                  </div>
                  <div class="rz-mid"><span class="${balClass}" dir="ltr">${balText}</span></div>
                  <div class="rz-foot" style="background: ${cs.footBg};"><span class="rz-foot-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cs.icon}</svg>${cs.footLabel}</span></div>
                </a>
                <div class="rz-icons">
                  <a href="${r.whatsapp}" target="_blank" rel="noreferrer" class="rz-ico is-wa" title="واتساب" aria-label="واتساب">${WA_ICON}</a>
                  <button type="button" class="rz-ico" title="العقد" aria-label="العقد" data-action="toast" data-message="فتح العقد">${CONTRACT_ICON}</button>
                  <a class="rz-ico" title="عرض" aria-label="عرض" href="reservation-detail.html">${EYE_ICON}</a>
                </div>
              </article>`;
}).join('\n');

const chips = `        <div class="flex flex-wrap gap-2" data-chip-group="single" id="res-chips">
          <button type="button" class="chip is-active" data-tone="all">الكل <span class="count">${counts.all}</span></button>
          <button type="button" class="chip" data-tone="arrivals">وصول اليوم <span class="count">${counts.arrivals}</span></button>
          <button type="button" class="chip" data-tone="departures">مغادرة اليوم <span class="count">${counts.departures}</span></button>
          <button type="button" class="chip" data-tone="inhouse">مقيمون <span class="count">${counts.inhouse}</span></button>
          <button type="button" class="chip" data-tone="warning">غير مؤكد <span class="count">${counts.warning}</span></button>
          <button type="button" class="chip" data-tone="due">رصيد مستحق <span class="count">${counts.due}</span></button>
        </div>`;

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>الحجوزات — Marhaba PMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { DEFAULT: '#0027B7', soft: '#EEF2FF' },
            secondary: '#079DD8',
          },
          fontFamily: { sans: ['Cairo', 'sans-serif'] },
        },
      },
    };
  </script>
  <link rel="stylesheet" href="../assets/css/app.css?v=res2" />
  <style>
    .rz-grid { display:grid; gap:14px; grid-template-columns:repeat(1,minmax(0,1fr)); }
    @media (min-width:640px){ .rz-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
    @media (min-width:1024px){
      .rz-grid[data-cols="2"]{ grid-template-columns:repeat(2,minmax(0,1fr)); }
      .rz-grid[data-cols="3"]{ grid-template-columns:repeat(3,minmax(0,1fr)); }
      .rz-grid[data-cols="4"]{ grid-template-columns:repeat(4,minmax(0,1fr)); }
      .rz-grid[data-cols="5"]{ grid-template-columns:repeat(5,minmax(0,1fr)); }
      .rz-grid[data-cols="6"]{ grid-template-columns:repeat(6,minmax(0,1fr)); }
    }
    .rz-grid.is-compact { gap:10px; }
    .rz-card { display:flex; flex-direction:column; background:#fff; border:1px solid #E8ECF1; border-radius:14px; overflow:hidden; box-shadow:0 1px 2px rgba(15,23,42,.05); transition:transform .15s, box-shadow .15s; }
    .rz-card:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(15,23,42,.09); }
    .rz-link { display:flex; flex-direction:column; flex:1; color:inherit; text-decoration:none; }
    .rz-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; padding:12px 14px 6px; }
    .rz-top.rz-top-stack { flex-direction:column; gap:6px; }
    .rz-guest-full { width:100%; }
    .rz-sub-row { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; }
    .rz-room-type-full { width:100%; margin-top:0; }
    .rz-grid[data-cols="5"] .rz-prop, .rz-grid[data-cols="6"] .rz-prop { width:36px; height:36px; border-radius:10px; }
    .rz-grid[data-cols="5"] .rz-prop .rz-typeicon, .rz-grid[data-cols="6"] .rz-prop .rz-typeicon { width:21px; height:21px; }
    .rz-grid[data-cols="5"] .rz-room-number strong, .rz-grid[data-cols="6"] .rz-room-number strong { font-size:1.05rem; }
    .rz-grid[data-cols="5"] .rz-guest, .rz-grid[data-cols="6"] .rz-guest { font-size:.92rem; }
    .rz-grid[data-cols="5"] .rz-room-type, .rz-grid[data-cols="6"] .rz-room-type { font-size:.82rem; }
    .rz-guest { font-weight:800; color:#0f172a; font-size:1.02rem; line-height:1.2; }
    .rz-room-type { font-size:.92rem; font-weight:800; color:#475569; line-height:1.2; margin-top:4px; }
    .rz-room-number { display:inline-flex; align-items:center; gap:6px; width:max-content; max-width:100%; margin-top:7px; padding:5px 10px; border-radius:9px; background:#e8efff; color:#123a9b; font-size:.78rem; font-weight:800; }
    .rz-room-number strong { font-size:1.25rem; line-height:1; letter-spacing:.03em; }
    .rz-prop { width:44px; height:44px; flex-shrink:0; border-radius:12px; display:grid; place-items:center; }
    .rz-prop .rz-typeicon { width:26px; height:26px; color:var(--prop,#94a3b8); }
    .rz-mid { padding:2px 14px 10px; display:flex; flex-wrap:wrap; gap:6px; align-items:center; flex:1; }
    .rz-bal { display:inline-flex; align-items:center; gap:6px; border-radius:999px; padding:3px 11px; font-size:.74rem; font-weight:800; }
    .rz-bal.due { background:rgba(196,71,85,.12); color:#8f2f39; }
    .rz-bal.paid { background:rgba(85,160,111,.12); color:#2f6b47; }
    .rz-foot { margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 13px; color:#fff; font-weight:800; font-size:.84rem; }
    .rz-foot-l { display:inline-flex; align-items:center; gap:7px; width:100%; }
    .rz-foot svg { width:16px; height:16px; }
    .rz-icons { display:flex; align-items:center; gap:5px; padding:8px 11px; border-top:1px solid #eef2f7; }
    .rz-ico { display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:9px; border:1px solid #e7ebf1; color:#475569; background:#fff; transition:.12s; cursor:pointer; }
    .rz-ico:hover { border-color:#cbd5e1; color:#0f172a; }
    .rz-ico svg { width:17px; height:17px; }
    .rz-ico.is-wa { background:#25d366; border-color:#25d366; color:#fff; }
    .rz-ico.is-in { background:var(--color-primary,#0027B7); border-color:var(--color-primary,#0027B7); color:#fff; }
    .rz-compact .rz-top { padding:9px 11px 4px; }
    .rz-compact .rz-guest { font-size:.9rem; }
    .rz-compact .rz-mid { padding:2px 11px 7px; }
    .rz-compact .rz-foot { padding:7px 11px; font-size:.78rem; }
    .rz-compact .rz-icons { padding:6px 9px; }
    html.dark .rz-card { background:#111827; border-color:#1f293d; }
    html.dark .rz-guest { color:#e5e7eb; }
    html.dark .rz-ico { background:#111827; border-color:#1f293d; color:#cbd5e1; }
    html.dark .rz-icons { border-top-color:#1f293d; }
  </style>
</head>
<body class="app-bg font-sans" data-page="reservations" data-title="الحجوزات"
  data-crumbs='[{"label":"PMS","href":"dashboard.html"},{"label":"الحجوزات"}]'>
  <div class="min-h-screen lg:flex">
    <aside id="app-sidebar"></aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <header id="app-header"></header>
      <main class="flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
        <div class="page-hero">
          <div>
            <p class="page-kicker">تصفّح وأدِر الحجوزات</p>
            <p class="text-slate-800 font-extrabold mt-1">${counts.inhouse} نزيل حالي · ${counts.all} إجمالي</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <a href="availability.html" class="btn btn-ghost">الغرف الشاغرة</a>
            <div class="view-toggle" data-tabs data-tabs-target="res-views" id="view-switcher">
              <button type="button" class="view-toggle-btn is-active" data-tab="table" title="جدول" aria-label="عرض الجدول">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>
              </button>
              <button type="button" class="view-toggle-btn" data-tab="cards" title="بطاقات" aria-label="عرض البطاقات">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              </button>
              <button type="button" class="view-toggle-btn" data-tab="calendar" title="تقويم" aria-label="عرض التقويم">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round"/></svg>
              </button>
            </div>
            <button type="button" class="btn btn-ghost" data-action="open-drawer" data-target="filters-drawer">الفلاتر</button>
            <a href="reservation-new.html" class="btn btn-primary">حجز جديد</a>
          </div>
        </div>

${chips}

        <div class="panel p-3 sm:p-4 bg-gradient-to-l from-primary-soft/40 to-white">
          <div class="search-input">
            <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" stroke-linecap="round"/></svg>
            <input type="search" id="res-search" class="field-input" placeholder="بحث الحجوزات" />
          </div>
        </div>

        <div data-tabs id="res-views" class="space-y-4">
          <div data-tab-panel="table">
            <div class="panel overflow-hidden">
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>الحجز</th>
                      <th>النزيل</th>
                      <th>الغرفة</th>
                      <th>الإقامة</th>
                      <th>الحالة</th>
                      <th>المبالغ</th>
                      <th class="text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
${tableRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="hidden" data-tab-panel="cards">
            <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
              <p class="text-sm text-slate-500 font-bold">العرض</p>
              <div class="view-toggle" id="cards-density" role="group" aria-label="كثافة البطاقات بكل صف">
                <button type="button" class="view-toggle-btn" data-cols="2" title="2 بكل صف" aria-label="2 بكل صف">2</button>
                <button type="button" class="view-toggle-btn" data-cols="3" title="3 بكل صف" aria-label="3 بكل صف">3</button>
                <button type="button" class="view-toggle-btn is-active" data-cols="4" title="4 بكل صف" aria-label="4 بكل صف">4</button>
                <button type="button" class="view-toggle-btn" data-cols="5" title="5 بكل صف" aria-label="5 بكل صف">5</button>
                <button type="button" class="view-toggle-btn" data-cols="6" title="6 بكل صف" aria-label="6 بكل صف">6</button>
              </div>
              <div class="view-toggle" id="cards-density-mode" role="group" aria-label="كثافة البطاقة">
                <button type="button" class="view-toggle-btn is-active" data-mode="cozy" title="مريح" aria-label="مريح">مريح</button>
                <button type="button" class="view-toggle-btn" data-mode="compact" title="مضغوط" aria-label="مضغوط">مضغوط</button>
              </div>
            </div>
            <div class="rz-grid" id="res-cards-grid" data-cols="4">
${cards}
            </div>
          </div>

          <div class="hidden" data-tab-panel="calendar">
            <div class="panel p-5">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-extrabold text-lg text-primary">أغسطس 2026</h2>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-sm">السابق</button>
                  <button class="btn btn-ghost btn-sm">التالي</button>
                </div>
              </div>
              <div class="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 mb-2 font-bold">
                <div>الأحد</div><div>الاثنين</div><div>الثلاثاء</div><div>الأربعاء</div><div>الخميس</div><div>الجمعة</div><div>السبت</div>
              </div>
              <div class="grid grid-cols-7 gap-2 text-sm">
                <div class="aspect-square rounded-xl border-2 border-primary bg-primary-soft p-2 font-extrabold text-primary">13<br/><span class="text-[10px] font-bold text-primary/80">وصول ${counts.arrivals} · مغادرة ${counts.departures}</span></div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">14</div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">15</div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">16</div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">17</div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">18</div>
                <div class="aspect-square rounded-xl bg-slate-50 p-2 text-slate-400">19</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <div id="filters-drawer" class="drawer p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-extrabold">فلاتر متقدمة</h3>
      <button class="btn btn-ghost btn-sm" data-action="close-drawer">إغلاق</button>
    </div>
    <div class="space-y-4">
      <div>
        <label class="field-label">الحالة</label>
        <select id="drawer-status" class="field-select"><option value="all">الكل</option><option value="confirmed">بانتظار الدخول</option><option value="inhouse">نزيل حالي</option><option value="other">أخرى</option></select>
      </div>
      <div>
        <label class="field-label">من تاريخ</label>
        <input type="date" id="drawer-from" class="field-input" value="2026-08-01" />
      </div>
      <div>
        <label class="field-label">إلى تاريخ</label>
        <input type="date" id="drawer-to" class="field-input" value="2026-08-31" />
      </div>
      <button class="btn btn-primary w-full" data-action="close-drawer" id="drawer-apply">تطبيق</button>
    </div>
  </div>

  <script src="../assets/js/pms-data.js"></script>
  <script>
    (function () {
      var RES_PROPERTY_MAP = {};
      document.querySelectorAll("[data-res]").forEach(function (el) {
        var pid = RES_PROPERTY_MAP[el.getAttribute("data-res")];
        if (pid) el.setAttribute("data-record-property", pid);
      });
    })();
  </script>
  <script src="../assets/js/app.js"></script>
  <script>
    // Sync icon view switcher with panels (switcher is outside the panels root)
    (function () {
      const switcher = document.getElementById('view-switcher');
      const panelsRoot = document.getElementById('res-views');
      if (!switcher || !panelsRoot) return;
      switcher.querySelectorAll('[data-tab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.tab;
          switcher.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('is-active', b === btn));
          panelsRoot.querySelectorAll('[data-tab-panel]').forEach((panel) => {
            panel.classList.toggle('hidden', panel.dataset.tabPanel !== id);
          });
        });
      });
    })();

    // ---- Cards density: columns per row (2–6) with persistence ----
    (function () {
      const grid = document.getElementById('res-cards-grid');
      const toggle = document.getElementById('cards-density');
      if (!grid || !toggle) return;
      const KEY = 'res-cards-cols';
      const clamp = (n) => (Number.isFinite(n) && n >= 2 && n <= 6 ? n : 4);
      const apply = (cols) => {
        grid.setAttribute('data-cols', String(cols));
        toggle.querySelectorAll('[data-cols]').forEach((b) => {
          b.classList.toggle('is-active', Number(b.dataset.cols) === cols);
        });
      };
      let saved = parseInt(localStorage.getItem(KEY), 10);
      saved = Number.isFinite(saved) ? clamp(saved) : 4;
      apply(saved);
      toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cols]');
        if (!btn || !toggle.contains(btn)) return;
        const cols = clamp(parseInt(btn.dataset.cols, 10));
        apply(cols);
        try { localStorage.setItem(KEY, String(cols)); } catch (_) {}
      });

      // cozy / compact mode
      const modeToggle = document.getElementById('cards-density-mode');
      if (modeToggle) {
        const applyMode = (mode) => {
          const compact = mode === 'compact';
          grid.classList.toggle('is-compact', compact);
          grid.querySelectorAll('.rz-card').forEach((c) => c.classList.toggle('rz-compact', compact));
          modeToggle.querySelectorAll('[data-mode]').forEach((b) => {
            b.classList.toggle('is-active', b.dataset.mode === mode);
          });
        };
        applyMode('cozy');
        modeToggle.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-mode]');
          if (!btn || !modeToggle.contains(btn)) return;
          applyMode(btn.dataset.mode);
        });
      }
    })();

    // ---- Filters: chips + search + drawer (status / date range) ----
    (function () {
      const TODAY = '2026-08-13';
      const root = document.getElementById('res-views');
      if (!root) return;
      const items = Array.from(root.querySelectorAll('tr[data-res], article.rz-card[data-res]'));
      const uniqueItems = Array.from(root.querySelectorAll('tbody tr[data-res]'));
      const tableBody = root.querySelector('tbody');
      const cardsGrid = root.querySelector('#res-cards-grid');
      const chips = document.getElementById('res-chips');
      const searchInput = document.getElementById('res-search');
      const drawerStatus = document.getElementById('drawer-status');
      const drawerFrom = document.getElementById('drawer-from');
      const drawerTo = document.getElementById('drawer-to');

      const state = { chip: 'all', query: '', status: 'all', from: '', to: '' };

      const matchChip = {
        all: () => true,
        arrivals: (d) => d.checkin === TODAY,
        departures: (d) => d.checkout === TODAY,
        inhouse: (d) => d.status === 'inhouse',
        warning: (d) => d.status === 'unconfirmed',
        due: (d) => d.balance === 'due',
      };

      const readItem = (el) => ({
        res: (el.dataset.res || '').toLowerCase(),
        guest: (el.dataset.guest || '').toLowerCase(),
        phone: (el.dataset.phone || '').toLowerCase(),
        room: (el.dataset.room || '').toLowerCase(),
        checkin: el.dataset.checkin || '',
        checkout: el.dataset.checkout || '',
        status: el.dataset.status || '',
        balance: el.dataset.balance || '',
      });

      const passes = (d) => {
        if (!matchChip[state.chip](d)) return false;
        if (state.status !== 'all' && d.status !== state.status) return false;
        if (state.from && d.checkout < state.from) return false;
        if (state.to && d.checkin > state.to) return false;
        if (state.query) {
          const hay = d.res + ' ' + d.guest + ' ' + d.phone + ' ' + d.room;
          if (!hay.includes(state.query)) return false;
        }
        return true;
      };

      const MSG = 'لا توجد حجوزات مطابقة للفلاتر الحالية.';
      let emptyTable, emptyCards;
      (function ensureEmpty() {
        if (tableBody) {
          emptyTable = document.createElement('tr');
          emptyTable.className = 'hidden';
          emptyTable.innerHTML = '<td colspan="7" class="text-center text-slate-400 font-semibold py-10">' + MSG + '</td>';
          tableBody.appendChild(emptyTable);
        }
        if (cardsGrid) {
          emptyCards = document.createElement('div');
          emptyCards.className = 'hidden col-span-full text-center text-slate-400 font-semibold py-10';
          emptyCards.textContent = MSG;
          cardsGrid.appendChild(emptyCards);
        }
      })();

      const toggleEmpty = (isEmpty) => {
        if (emptyTable) emptyTable.classList.toggle('hidden', !isEmpty);
        if (emptyCards) emptyCards.classList.toggle('hidden', !isEmpty);
      };

      function applyFilters() {
        let visible = 0;
        const seen = new Set();
        for (const el of items) {
          const d = readItem(el);
          const show = passes(d);
          el.classList.toggle('hidden', !show);
          if (show && !seen.has(el.dataset.res)) {
            seen.add(el.dataset.res);
            visible++;
          }
        }
        toggleEmpty(visible === 0);
      }

      function updateCounts() {
        const counts = { all: 0, arrivals: 0, departures: 0, inhouse: 0, warning: 0, due: 0 };
        for (const el of uniqueItems) {
          const d = readItem(el);
          for (const key of Object.keys(matchChip)) if (matchChip[key](d)) counts[key]++;
        }
        chips.querySelectorAll('.chip').forEach((c) => {
          const span = c.querySelector('.count');
          if (span) span.textContent = counts[c.dataset.tone || 'all'] || 0;
        });
      }

      if (chips) {
        chips.addEventListener('click', (e) => {
          const chip = e.target.closest('.chip');
          if (!chip || !chips.contains(chip)) return;
          chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          state.chip = chip.dataset.tone || 'all';
          applyFilters();
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', () => {
          state.query = searchInput.value.trim().toLowerCase();
          applyFilters();
        });
      }

      [drawerStatus, drawerFrom, drawerTo].forEach((el) => {
        if (!el) return;
        el.addEventListener('change', () => {
          state.status = drawerStatus ? drawerStatus.value : state.status;
          state.from = drawerFrom ? drawerFrom.value : state.from;
          state.to = drawerTo ? drawerTo.value : state.to;
          applyFilters();
        });
      });

      updateCounts();
      applyFilters();
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'pages', 'reservations.html'), html, 'utf8');
console.log('Generated pages/reservations.html with', data.length, 'reservations');
console.log('Counts:', JSON.stringify(counts));
