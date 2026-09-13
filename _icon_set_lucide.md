# Icon set — consolidated lucide (drop-in for the icon phase)

**Type:** Drop-in spec. Read-only on `index.html` — **no edits, no git.** Source:
`_reskin_icon_map.md`. Convention matches the existing `IC` block: `width="18"
height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round"` (size is overridden at some call
sites; that still works). Paths are current lucide; icons already-correct in the
app are reused **verbatim** from the live file (authentic), new ones are standard
lucide.

**One source of truth:** §1 defines the SVG for **every** glyph the app needs.
§2 (emoji→lucide) and §4 (logic-tied 1:1) repeat the exact SVG inline for copy-
paste. §3 = the 3 dead icons to delete. §5 = the bespoke glyphs needing a design
call (kept in §1 as current SVG + lucide alternative).

---

## 1. Canonical `IC` set (replaces `const IC` @L2034–2065)

```js
const IC = {
  // ── STATUS / ACTION (lucide, reused verbatim) ───────────────────────────────
  check:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', // circle-check-big
  cross:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>', // circle-x
  warn:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>', // triangle-alert
  target:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', // target
  fire:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>', // flame
  stop:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>', // circle-minus
  refresh:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>', // rotate-cw
  // ── STATUS / ACTION (new lucide) ─────────────────────────────────────────────
  ban:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>', // ban (🚫)
  play:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>', // play (▶)
  search:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>', // search (🔍)
  trash:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>', // trash-2 (🗑)
  send:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>', // send (➤)

  // ── CONTENT / SECTION (reused verbatim) ──────────────────────────────────────
  robot:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>', // bot
  chart:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>', // bar-chart-3
  doc:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', // file
  book:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', // book-open
  home:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', // house
  hotel:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>', // hotel
  pin:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>', // map-pin
  bulb:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>', // lightbulb
  party:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/></svg>', // party-popper
  scale:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>', // scale (⚖)
  wrench:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', // wrench (🔧)
  cake:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>', // cake (🎂)
  trophy:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>', // trophy (🏆)
  clipboard:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>', // clipboard-list (📋)
  calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>', // calendar (📅 + Plan nav)
  download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>', // download (kept: drawn inline in export UI)

  // ── ARROWS / TREND ───────────────────────────────────────────────────────────
  arrowRight:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  arrowLeft:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
  chevronRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  arrowUp:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
  arrowDown:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
  trendingUp:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  trendingDown: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>',
  moveHorizontal:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg>',
  circle:       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  circleDot:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>',
  link:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', // link (🔗 hinge)

  // ── NAV (5 tabs) — reused verbatim where lucide; calendar/coach noted ─────────
  coach:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>', // sparkles — resolves the Coach/Push collision (Push gets its own glyph, §5)
  recovery: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>', // heart-pulse (verbatim from current Recovery nav)
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>', // settings (verbatim)
  // nav 'plan' → IC.calendar (above);  nav 'library' → IC.book (above)

  // ── GEAR (equipment selectors, §4) ───────────────────────────────────────────
  dumbbell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3-1-1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>', // dumbbell (🏋/🔩 gym + dumbbells)
  plug:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>', // plug (🔌 — verify intent)
  bodyweight:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>', // person-standing (🤸)

  // ── CHECK-IN FEELINGS (§4 — DESIGN CALL, lucide faces proposed) ──────────────
  fresh:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>', // smile (💪)
  normal:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>', // meh (👍)
  tired:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>', // frown (😩)
  pain:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><path d="m8.5 8.5 1 1"/><path d="m9.5 8.5-1 1"/><path d="m14.5 8.5 1 1"/><path d="m15.5 8.5-1 1"/></svg>', // frown + x-eyes (🤕) — DESIGN CALL (see §4)

  // ── TYPE BADGES & CARDIO SUBTYPE — BESPOKE, DESIGN CALL (current SVG kept; §5) ─
  push:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>', // CURRENT (collides w/ coach) → §5 proposes dumbbell
  pull:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v15"/><path d="m6 8 6-6 6 6"/><path d="M5 21h14"/></svg>', // CURRENT → §5 proposes move-up
  legs:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4v4l-2 4-1 4-2 5"/><path d="M9 4v4l2 4 1 4 2 5"/><path d="M8 21h3"/><path d="M13 21h3"/></svg>', // CURRENT → §5 proposes footprints
  cardio: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>', // bike (lucide) — keep
  nimble: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M8 20h8"/><path d="M12 8v5"/><path d="M7 14c0 0 2-1 5-1s5 1 5 1"/><path d="M5 17c0 0 3-2 7-2s7 2 7 2"/></svg>', // CURRENT → §5 proposes activity
  rest:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h20"/><path d="M2 12c2-4 6-4 10 0 4 4 8 4 10 0"/><path d="M2 20h20"/></svg>', // CURRENT → §5 proposes moon
  run:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="m7 21 3-7"/><path d="M10 14h4l3 7"/><path d="m8 10 4-2 4 2"/></svg>', // CURRENT → §5 proposes footprints
  swim:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M8 12c2-2 4-4 4-4l4 4"/></svg>', // CURRENT → §5 proposes waves
  walk:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M14 20h-4l-1-5h6z"/><path d="M12 8v4"/></svg>', // CURRENT (walk not in design-call list; footprints alt)
  row:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0"/><path d="M4 16l8-8 8 8"/><circle cx="12" cy="7" r="1"/></svg>', // CURRENT → §5 proposes sailboat
  bike:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>', // bike (== cardio; dedupe — keep one)
};
```
> `IC.cardio` and `IC.bike` are the identical bike path — keep both keys (different
> logic maps reference each) but they share one glyph; that's intended dedupe.

---

## 2. Emoji → lucide replacement (each with its SVG, via the §1 key)

Every target below is a key defined in §1 (its exact SVG is there — copy from §1).
Where an `IC` glyph already existed, **reuse it** (don't add a parallel icon).

| emoji | sites (sample L) | → `IC` key (SVG in §1) |
|---|---|---|
| ✓ | 4022,4200,4241,4699,5933,6144 | `IC.check` |
| ✅ | 8313,8321,8627 | `IC.check` |
| ✕ | 1806,1843,1895,1906,1964,1979,4700,6574,7656,8753 | `IC.cross` |
| ❌ | 6725 | `IC.cross` |
| ⚠ | 1374,4072,4402,5361,5875,8196 | `IC.warn` |
| 🎯 | 1371,4141,5872,8191 | `IC.target` |
| 🔥 | 1375 | `IC.fire` |
| 📊 | 1422,4316,5874,8194 | `IC.chart` |
| 📋 | 1439,5796,8313 | `IC.clipboard` |
| 🔍 | 5090,5101,5109 | `IC.search` |
| 🗑 | 1440,4662 | `IC.trash` |
| 💡 | 5280 | `IC.bulb` |
| 🚫 | 5379 | `IC.ban` |
| ⚖ | 5411 | `IC.scale` |
| 🔧 | 5424 | `IC.wrench` |
| 📉 | 5334 | `IC.trendingDown` |
| 🎂 | 5873,8193 | `IC.cake` |
| 📅 | 8192 | `IC.calendar` |
| 🏆 | 1373 | `IC.trophy` |
| 🚴 | 6426 | `IC.bike` |
| ▶ | 4052,6363 | `IC.play` |
| ▸ | 230(CSS),4656 | `IC.chevronRight` (or keep CSS `::before`) |
| ➤ | 1815 | `IC.send` |
| ✨ | 8219,8226,8642 | `IC.coach` (sparkles) |
| → | 1345,1750,1950,4113,4203,5336,8317 | `IC.arrowRight` (CTAs) / `IC.chevronRight` (inline) |
| ← | 3339 | `IC.arrowLeft` |
| ↑ | 4071,4113,4374,4960 | `IC.trendingUp` |
| ↓ | 4113,4386,4969 | `IC.trendingDown` |
| 🟢 | 5812 | `IC.circleDot` (current phase) |
| ⚪ | 5812 | `IC.circle` (incomplete phase) |
| 😵‍💫 | 1372 | **no clean lucide** — keep emoji, or `IC.warn` (RPE "distracted") — DESIGN CALL |

Movement-pattern label emoji (↔️⬆️⬇️🦵🔗 @L8594–8596) are logic-tied → see §4.

---

## 3. Dead icons to DROP (defined in `IC`, zero consumers)
Delete these three keys from `const IC` — no usage anywhere:
```
brain      // (was: brain)        — UNUSED
chat       // (was: message-square)— UNUSED
download   // (was: download)     — UNUSED as IC.download; BUT a download glyph is
           //                       drawn INLINE in the export UI. Keep IC.download
           //                       (re-added in §1) and route that inline svg to it
           //                       instead of deleting. Only brain + chat are true drops.
```
**True drops: `brain`, `chat`.** Keep `download` (re-pointed from the inline copy).

---

## 4. Logic-tied 1:1 swaps (keys preserved, glyph replaced)

Swap the **glyph only**; the key→icon map structure stays so every branch resolves.
Re-verify each map site after the swap.

### 4a. Workout-type badges — maps @L5896 / L6030 / L6159 (keyed by `type`)
| key | new glyph | SVG | note |
|---|---|---|---|
| `push` | dumbbell | `IC.dumbbell` (§1) | **frees sparkles for Coach nav** |
| `pull` | move-up | `<svg ...><path d="M8 6 12 2l4 4"/><path d="M12 2v20"/></svg>` | DESIGN CALL (§5) |
| `legs` | footprints | `IC` footprints (§5) | DESIGN CALL |
| `cardio` | bike | `IC.cardio` (§1) | keep |
| `nimble` | activity | `<svg ...><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>` | DESIGN CALL; align w/ "Mobility" rename |
| `rest` | moon | `<svg ...><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>` | DESIGN CALL |

### 4b. Cardio sub-type — map @L6449 (keyed by `session.type`)
| key | glyph | SVG |
|---|---|---|
| `run` / `walk` | footprints | §5 footprints |
| `swim` | waves | `<svg ...><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>` |
| `row` | sailboat | `<svg ...><path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z"/><path d="M21 14 10 2 3 14h18Z"/><path d="M10 2v16"/></svg>` |
| `bike` | bike | `IC.bike` (§1) |

### 4c. Nav tabs — @L1821–1835 (inline → route to set; active state CSS, unchanged)
| tab | key | SVG |
|---|---|---|
| Coach | `IC.coach` | sparkles (§1) — **was the push glyph; now distinct** |
| Recovery | `IC.recovery` | heart-pulse (§1, verbatim) |
| Plan | `IC.calendar` | calendar (§1) |
| Library | `IC.book` | book-open (§1) |
| Settings | `IC.settings` | settings (§1, verbatim) |

### 4d. Session-gear selectors — @L1247–1250 (keyed by `data-session-gear`)
| emoji today | gear | key | SVG |
|---|---|---|---|
| 🏋 | gym | `IC.dumbbell` | §1 |
| 🔌 | machines/powered | `IC.plug` | §1 — **verify the intended meaning at build** |
| 🔩 | dumbbells | `IC.dumbbell` | §1 |
| 🤸 | bodyweight | `IC.bodyweight` | §1 (person-standing) |

### 4e. Check-in feelings — @L1306–1321 (modal) **+** L3428–3431 (`checkInConfig` labels)
⚑ **DESIGN CALL.** lucide core has no rich emotive faces. Two options:
- **(A) lucide faces** (provided in §1): fresh→`IC.fresh` (smile), normal→`IC.normal`
  (meh), tired→`IC.tired` (frown), pain→`IC.pain` (frown + x-eyes, improvised).
- **(B) keep the 4 emoji** as deliberate brand glyphs (💪/👍/😩/🤕) — they read
  warmer than monochrome faces.
If (A): change **both** the modal markup **and** the `checkInConfig` label strings
together (paired sites). `pain` has no canonical lucide face → its §1 glyph is an
improvised frown+x-eyes; sign off or keep 🤕.

### 4f. Movement-pattern labels — @L8594–8596 (keyed by pattern)
| emoji | pattern | key |
|---|---|---|
| ↔️ | h-push/pull | `IC.moveHorizontal` |
| ⬆️ | v-push | `IC.arrowUp` |
| ⬇️ | v-pull | `IC.arrowDown` |
| 🦵 | squat | footprints (§5) — align w/ `legs` |
| 🔗 | hinge | `IC.link` |

---

## 5. ⚑ Bespoke body/movement icons — DESIGN CALL (not 1:1)
`push, pull, legs, nimble, rest, run, swim, row` have **no exact lucide**; their §1
entries hold the **current bespoke SVG** so the set stays drop-in, with the
recommended lucide alternative noted. Pick deliberately for one cohesive family:

| key | current | recommended lucide | SVG (recommended) |
|---|---|---|---|
| `push` | sparkles-ish (collides w/ Coach) | **dumbbell** | `IC.dumbbell` (§1) |
| `pull` | up-arrow/line | **move-up** | `<path d="M8 6 12 2l4 4"/><path d="M12 2v20"/>` |
| `legs` | stick-legs | **footprints** | `<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>` |
| `nimble` | figure+motion | **activity** | see §4a |
| `rest` | waves | **moon** (or `bed`) | see §4a |
| `run` | runner | **footprints** | (as legs) |
| `swim` | swimmer | **waves** | see §4b |
| `row` | wave+chevron | **sailboat** | see §4b |

These 8 are the **only** glyphs needing a judgement call beyond a 1:1 swap. `cardio`/
`bike` (bike) and `walk` (footprints) are already lucide-clean.

---

## 6. Build notes
- §1 is the complete drop-in `IC` (replaces L2034–2065). Then: route the **86 inline
  `<svg>`** (nav §4c + ~81 header/button copies) and the **emoji-as-UI** (§2) through
  these keys; delete inline duplicates and the two dead keys (§3).
- Keep stroke-width per family (status/content = 2; type/cardio badges = 2.5) or
  normalise to one in the reskin — a single global choice.
- Logic-tied groups (§4): glyph-only; keys unchanged; verify each `[type]`/
  `[session.type]`/feeling/pattern/gear branch renders post-swap.
- Two product/design decisions to confirm: check-in faces (§4e) and the 8 bespoke
  movement glyphs (§5). Everything else is mechanical.

— T4, 2026-06-15 10:19 (+10:00)  *(superseded by §7 below)*

---

## 7. FINALISED — reskin #6 unblock

All open calls resolved. SVGs below are lucide, IC convention
(`width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`).

### 7.1 — Emoji→lucide 1:1 logic-tied swaps: CONFIRMED + flags
| group | status | resolution |
|---|---|---|
| **Type** (push/pull/legs/cardio/nimble/rest) | already SVG (inline `data-qs-type` + IC type-map) — not emoji | covered by §7.3 (bespoke) |
| **Focus** (strength/power/resilience/cardio) | **text-only today** — no emoji to swap | OPTIONAL icons: strength→`dumbbell`, power→`zap`, resilience→`shield`, cardio→`activity`. Not required for #6. |
| **Nav** (coach/recovery/plan/library/settings) | already SVG (§4c) | CONFIRMED 1:1: sparkles / heart-pulse / calendar / book-open / settings |
| **Equipment** (gear chips — still emoji) | **needs swap** | 2 clean, 2 flagged ↓ |

**Equipment gear @L1278–1281 (keyed by `data-session-gear`):**
| emoji | gear | → lucide | clean? |
|---|---|---|---|
| 🤸 | bodyweight | `person-standing` `<svg ...><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>` | ✅ |
| 🔩 | dumbbells | `dumbbell` `<svg ...><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3-1-1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>` | ✅ |
| 🏋 | full gym | **NO CLEAN LUCIDE** (would collide with `dumbbell`). Interim `building-2` `<svg ...><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>` or label-only | ⚑ FLAG |
| 🔌 | cables | **NO CLEAN LUCIDE** (lucide `cable` = electrical, semantic mismatch). Custom pulley SVG recommended, or `cable` with caveat | ⚑ FLAG |

> **2 flagged emoji with no clean lucide:** `🏋 full-gym` and `🔌 cables`. Recommend
> a small **custom pair** (barbell + cable-stack) so the 4 gear chips read as one
> family, OR ship bodyweight/dumbbell as lucide + keep full-gym/cables label-only
> until custom SVGs exist. Decision needed at build; everything else is unblocked.

### 7.2 — DESIGN CALL A (check-in faces): RESOLVED → lucide smile family
Map the 4 readiness states to a monotonic smile→frown ramp (`checkInConfig` keys).
Edit the **paired sites together**: the check-in modal options **and** the
`checkInConfig` label strings.
| state | lucide | SVG |
|---|---|---|
| `fresh` | **laugh** | `<svg ...><circle cx="12" cy="12" r="10"/><path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>` |
| `normal` | **smile** | `<svg ...><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>` |
| `tired` | **meh** | `<svg ...><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>` |
| `pain` | **frown** | `<svg ...><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>` |
Replaces §1 `fresh/normal/tired/pain` and supersedes the §4e "improvised x-eyes"
glyph. `laugh/smile/meh/frown` are all real lucide icons → no improvisation, clean
family. (`pain` still also opens the niggle picker — that's behaviour, unaffected.)

### 7.3 — DESIGN CALL B (8 bespoke movement glyphs): RESOLVED
**Each resolves to a SINGLE lucide base — no multi-icon compositing required.**
7 are accepted nearest-lucide; **only `row` is flagged** for a custom decision.
| key | → lucide base | call |
|---|---|---|
| `push` | **dumbbell** | accept (also frees sparkles for Coach nav) |
| `pull` | **move-up** `<svg ...><path d="M8 6 12 2l4 4"/><path d="M12 2v20"/></svg>` | accept |
| `legs` | **footprints** `<svg ...><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>` | accept |
| `nimble` | **activity** `<svg ...><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>` | accept (matches "Mobility") |
| `rest` | **moon** `<svg ...><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>` | accept |
| `run` | **footprints** (same as `legs`) | accept — `legs` (type badge) and `run` (cardio sub-type) never co-occur, so a shared glyph is fine |
| `swim` | **waves** `<svg ...><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>` | accept |
| `row` | ~~sailboat~~ → **RESOLVED: custom rowing-machine glyph** | authored in **§7.5 #3** |

### 7.4 — Button colour fix (record for the build)
| element | current | → target | tokens |
|---|---|---|---|
| **Watch Form Tutorial** (▶ link) @L4080 (workout card) **and** @L6381 (detail modal) | hardcoded red: `background:rgba(255,0,0,0.1); border:1px solid rgba(255,0,0,0.3); color:#ff4444` | **teal ghost** | `background: var(--accent-weak); border: 1px solid var(--accent); color: var(--accent)` — same recipe as `.btn-action:hover` (L96–97). Keep ▶ → `IC.play`. |
| **End** (session) @L1289 `class="btn btn-danger btn-small"` | `.btn-danger` → `--danger: #CF6679` (Material **pink**) | **destructive token** | keep `.btn-danger`; target token **`--danger`**. ⚑ Palette note: retokenise `--danger` off Material pink `#CF6679` to a true destructive red (parallel to the earlier `--primary` purple fix) — fixes End **and** all `.btn-danger` siblings (Clear All L1439, Clear History L1602, Delete Day L4693, modal-close L294). |

**Net:** removes the last two off-palette colours — red is no longer used for a
non-destructive action (tutorial → teal), and the only destructive colour is the
`--danger` token (no ad-hoc pink/red literals).

**`--danger` HEX — LOCKED:** `--danger: #EF4444;` (replaces Material pink `#CF6679`).
- Clearly **red, not pink** — hue 0° (R 239, G=B 68; pink needs B>G, this has B=G).
- **Contrast on graphite `#0F1011` = 5.06:1** ✓ (≥4.5 required; computed WCAG 2.x).
- Harmonises with teal `#03DAC6` + amber `#E0A35C` — clean primary-red corner of a
  red/teal/amber set; a standard destructive red (Tailwind red-500).
- White button text on `#EF4444` = **3.76:1** → passes AA for **bold/large** text,
  which `.btn-danger` labels are (keep `color:#fff`). If any small/normal-weight
  danger text appears on the fill, use graphite text there instead.
- One-line build change in `:root`: `--danger: #EF4444;`. Auto-fixes End (L1289) +
  every `.btn-danger` sibling (Clear All L1439, Clear History L1602, Delete Day
  L4693, modal-close L294) and all `var(--danger)` accents.

---

## 7.5 — Custom SVG glyphs (Troy: authored)

Closes the three flags that had no clean lucide (§7.1 full-gym + cables, §7.3 row).
All three: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
`stroke-width="2"`, round caps/joins, **`currentColor` only** (no colour literals →
token tinting + `.active` states work), optimised paths, sized `18×18` to match the
IC set. Drop-in `IC` keys: `gym`, `cables`, `row`.

**1. `gym` — loaded barbell w/ plates** (reads distinct from `dumbbell`: long
horizontal bar + graduated plates each side, vs the dumbbell's diagonal cluster):
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h2"/><path d="M5 9v6"/><path d="M7 7v10"/><path d="M7 12h10"/><path d="M17 7v10"/><path d="M19 9v6"/><path d="M19 12h2"/></svg>
```
(grip bar `M7 12h10`; inner plates `M7 7v10`/`M17 7v10` tall; outer plates
`M5 9v6`/`M19 9v6` short; sleeve tips `M3 12h2`/`M19 12h2`.)

**2. `cables` — cable/pulley station** (weight stack + overhead beam + pulley wheel
+ cable + handle; NOT lucide's electrical `cable`):
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="6" height="11" rx="1"/><path d="M3 13h6"/><path d="M3 16.5h6"/><path d="M6 9V5"/><path d="M6 5h11"/><circle cx="17" cy="7" r="2"/><path d="M17 9v6"/><path d="M14.5 15h5"/></svg>
```
(stack `rect` + plate dividers; riser `M6 9V5`; beam `M6 5h11`; pulley `circle 17,7`;
cable `M17 9v6`; handle bar `M14.5 15h5`.)

**3. `row` — rowing machine (erg)** (flywheel + monorail + chain + handle + seat;
distinct from the `footprints` shared by legs/run):
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="8" r="3"/><path d="M6 11v9"/><path d="M3 20h18"/><path d="M9 9l7 4"/><path d="M16 11v6"/><path d="M11 17h4"/></svg>
```
(flywheel `circle 6,8 r3`; front upright `M6 11v9`; floor rail `M3 20h18`; chain
`M9 9l7 4`; handle `M16 11v6`; seat `M11 17h4`.)

> With these three landed, the canonical set has **zero** unresolved glyphs — every
> emoji/inline icon maps to a lucide entry or one of these customs. Reskin #6 is
> fully unblocked.

---
SIGN OFF: T4 | 2026-06-15 13:39 (+10:00)
