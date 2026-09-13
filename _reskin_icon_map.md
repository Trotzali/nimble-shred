# Reskin — Icon & asset map

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors are line + selector (re-anchor by name; lines drift).

**Scope:** every icon (the `IC` lucide registry + inline literal `<svg>`) and every
emoji used as UI, where each appears, and the mapping to a **single consistent
lucide set** ("redesign-10"). No `redesign-10` spec file exists on disk, so the
"→ lucide" column below is my **proposed canonical** name for the reskin to ratify;
"(confident)" = path matches that lucide icon, "(custom→nearest)" = bespoke SVG, no
exact lucide, nearest proposed.

**Three icon systems live today (inconsistent — the reskin's core problem):**
1. `IC` registry — **30** lucide-style SVG strings (`const IC` @L2034–2065).
2. **86 inline literal `<svg>`** in markup that bypass `IC` (5 nav + ~81 header/
   button/chip icons) — many duplicate paths already in `IC`.
3. **~45 distinct emoji used as UI** across ~130 sites, mixed in with the SVGs.

---

## A. `IC` registry (30) — lucide name · usage · logic flag · mapping

Usage counts exclude the definition block. "Surface" = what the usage renders.

### A1. Workout-TYPE badges — ⚑ LOGIC-TIED (keyed by `type` string)
Selected via `{push:IC.push, pull:IC.pull, …}[type]` at **L5896** (today banner),
**L6030** (calendar bubble), **L6159** (plan preview); `IC.fire` fallback @L7221.

| IC key | glyph today | → lucide | logic | note |
|---|---|---|---|---|
| `push` | bespoke (same path as the **Coach nav** icon, sparkles-like) | **dumbbell** (custom→nearest) | type badge | ⚠ glyph collides with Coach nav (§B) |
| `pull` | up-arrow over baseline | **move-up** / arrow-up-from-line (custom→nearest) | type badge | |
| `legs` | two stick-legs | **footprints** (custom→nearest; no lucide "legs") | type badge | |
| `cardio` | bicycle | **bike** (confident) | type badge | **identical path to `IC.bike`** — dedupe |
| `nimble` | figure w/ motion lines | **activity** (custom→nearest) | type badge | "nimble"=Mobility; align w/ vocab rename |
| `rest` | three waves | **moon** / bed (custom→nearest) | type badge | rest-day semantics |

**Reskin rule:** swap the glyph, **keep the `IC.<type>` keys** so the `[type]` maps
keep resolving. Verify all three map sites after swap.

### A2. Cardio SUB-TYPE — ⚑ LOGIC-TIED (keyed by `session.type`)
`{run:IC.run, swim:IC.swim, walk:IC.walk, row:IC.row, bike:IC.bike}[session.type]`
@**L6449** (cardio history); `IC.run` also @L7965.

| IC key | → lucide | note |
|---|---|---|
| `run` | **footprints** (custom→nearest) | |
| `swim` | **waves** (custom→nearest) | |
| `walk` | **footprints** (custom→nearest) | dup intent w/ run |
| `row` | **rowing/sailboat** (custom→nearest; no lucide rower) | |
| `bike` | **bike** (confident) | == `cardio` path |

### A3. Status / action icons (confident lucide)
| IC key | → lucide | usage (count · sample L) | surface |
|---|---|---|---|
| `check` | **circle-check-big** | 13 · L4150,5903,6697,7616,7632 | log-set/finish, completed day, consult confirms |
| `cross` | **circle-x** | 8 · L7616,7635,7681,7705,7939 | modal/consult close, delete |
| `warn` | **triangle-alert** | 2 · L7199,7560 | warnings |
| `stop` | **circle-minus** | 1 · L7210 | stop/halt |
| `refresh` | **rotate-cw** | 3 · L7685,7712,7940 | regenerate/retry |
| `target` | **target** | 1 · L7183 | goal |
| `fire` | **flame** | 7 · L5896,6030,6159,7221 | streak + **type-map fallback** (⚑ touches A1) |

### A4. Content / section icons (confident lucide)
| IC key | → lucide | usage (count · sample L) |
|---|---|---|
| `robot` | **bot** | 2 · L7471,8753 (AI notifications) |
| `chart` | **bar-chart-3** | 1 · L7960 |
| `doc` | **file** | 1 · L7297 |
| `book` | **book-open** | 1 · L5751 (== Library nav path) |
| `home` | **house** | 1 · L6470 |
| `hotel` | **hotel** | 1 · L6471 |
| `pin` | **map-pin** | 1 · L9182 |
| `bulb` | **lightbulb** | 1 · L7546 |
| `party` | **party-popper** | 1 · L4234 |

### A5. DEAD `IC` entries — defined, **zero consumers** → drop or wire in reskin
| IC key | → lucide | status |
|---|---|---|
| `brain` | brain | **UNUSED** |
| `chat` | message-square | **UNUSED** |
| `download` | download | **UNUSED** (note: a `download` glyph is still drawn *inline* elsewhere — see §C) |

---

## B. Nav-bar icons (5) — inline literals, ⚑ LOGIC/NAV-tied
`<button class="nav-btn" onclick="switchTab('…')">` @**L1821–1835**; active state is
CSS `.nav-btn.active{color:var(--accent)}` (L116), driven by `switchTab` (L3401).
Icons are **inline `<svg>`, not via `IC`**.

| Tab | line | glyph today | → lucide | note |
|---|---|---|---|---|
| Coach | 1822 | sparkles-style (**same path as `IC.push`**) | **sparkles** | ⚠ collision with push type-badge (§A1) — give Coach and Push distinct glyphs |
| Recovery (garmin) | 1825 | heart + pulse line | **heart-pulse** (confident) | |
| Plan | 1828 | calendar | **calendar** (confident) | |
| Library (encyclopedia) | 1831 | two-page book (== `IC.book`) | **book-open** (confident) | dedupe w/ `IC.book` |
| Settings | 1834 | gear | **settings** (confident) | |

**Reskin rule:** nav icons are wayfinding — must be in the set; keep one glyph per
tab; resolve the Coach/Push sparkles collision; consider routing nav through `IC`
(or the new set) instead of inline literals.

---

## C. Other inline literal `<svg>` (~81) — header/button/chip icons bypassing `IC`
86 inline `<svg>` total − 5 nav (§B) = **~81** scattered in markup. Lines:
`1211,1215,1218,1255–1259,1270,1273–1275,1385,1388,1392,1413,1448,1451,1454–1458,
1465–1469,1475,1486,1489,1502,1503,1508,1517,1528,1536,1544,1549,1560,1565,1566,
1602,1603,1608,1612,1613,1617,1638,1650,1654,1665,1669,1670,1681,1726,1732,1741,
1746,1775,1781,1789,1796,1822,1825,1828,1831,1834,1842,1884,1905,1927,1937,1968,
2021,2024,5602,6132,6133,9162,9348,9354,9362,9365,9368,9374,9388`.

These are section-header and button icons (Quick-Start chips, modal headers, card
headers, Garmin/export steps, etc.). **Many replicate paths already in `IC`**
(calendar, chart, target, book, download, refresh, file) — i.e. the same lucide
icon is hard-coded inline rather than referenced. **Reskin action:** assign each a
lucide name from the single set and **route through the set** (component/`IC`),
deleting the inline duplicates. (Per-site glyph assignment is a build task; this
list is the worklist. None are logic-keyed except the nav block in §B.)

---

## D. Emoji used as UI (~45 glyphs, ~130 sites) → lucide mapping
(Emoji only in `console.log`/comments are excluded — see §E. ⚑ = logic-tied.)

### D1. ⚑ Check-in FEELING faces — keyed by feeling, **paired sites**
Modal options @**L1306,1311,1316,1321** + `checkInConfig` labels @**L3428–3431**.
| emoji | feeling | → lucide | note |
|---|---|---|---|
| 💪 | fresh | **smile** / heart-pulse | also used non-feeling (RPE hero L1354, assess L1395/8235) |
| 👍 | normal | **thumbs-up** | |
| 😩 | tired | **frown** / battery-low | lucide core has no expressive faces — see flag |
| 🤕 | pain | **frown** / bandage | |

> Flag: lucide core lacks emotive faces. Either adopt a smile/meh/frown trio
> (smile/meh/frown exist in lucide) or **keep these 4 as deliberate emoji** (design
> call). If swapped, change **both** the modal (L1306–1321) and `checkInConfig`
> labels (L3428–3431) together.

### D2. ⚑ Movement-pattern labels — keyed by pattern @L8594–8596 (assessment)
| emoji | pattern | → lucide |
|---|---|---|
| ↔️ | horizontal push/pull | **move-horizontal** |
| ⬆️ | vertical push | **arrow-up** |
| ⬇️ | vertical pull | **arrow-down** |
| 🦵 | squat | **footprints** (align w/ `legs`) |
| 🔗 | hinge | **link** |

### D3. ⚑ Session-gear selectors — keyed by `data-session-gear` @L1247–1250
| emoji | gear | → lucide |
|---|---|---|
| 🏋 | full gym | **dumbbell** (also profile/consult equipment tag L1805/8195) |
| 🔌 | (powered/machines?) | **plug** / power — verify intent at build |
| 🔩 | dumbbells | **dumbbell** |
| 🤸 | bodyweight | **person-standing** / activity |

### D4. Arrows-as-UI (navigation/trend)
| emoji | U+ | sites | → lucide |
|---|---|---|---|
| → | 2192 | 13 · L1345,1750,1950,4113,4203,5336,8317 | **arrow-right** (CTAs "Next/View →"); **chevron-right** for inline |
| ↑ / ↓ | 2191/2193 | 4 / 3 · L4071–4113,4374–4386,4960–4969 | **trending-up / trending-down** (progression/analytics deltas) |
| ↔ ⬆ ⬇ | 2194/2B06/2B07 | L8594–8595 | see D2 (pattern labels) |
| ← | 2190 | 1 · L3339 (comment-ish UI) | **arrow-left** |

### D5. Check / close / play — **already have IC equivalents → consolidate**
| emoji | sites | → use |
|---|---|---|
| ✓ | 6 · L4022,4200,4241,4699,5933,6144 | **`IC.check`** (lucide check / circle-check-big) |
| ✕ | 10 · L1806,1843,1895,1906,1964,1979,4700,6574,7656,8753 | **`IC.cross`** (lucide x / circle-x) |
| ▶ | 2 · L4052,6363 | **play** (lucide) — "Watch Form Tutorial"/Start |
| ▸ | 2 · L230(CSS ::before),4656 | **chevron-right** / CSS |

### D6. Status / section / tag emoji → lucide
| emoji | meaning · sample L | → lucide |
|---|---|---|
| ⚠ | warnings/injuries · L1374,4072,4402,5361,8196 | **triangle-alert** (== `IC.warn`) |
| 🎯 | goal/focused · L1371,4141,5872,8191 | **target** (== `IC.target`) |
| 📊 | briefing/experience · L1422,4316,5874,8194 | **bar-chart-3** (== `IC.chart`) |
| 📋 | history/plan · L1439,5796,8313 | **clipboard-list** / file |
| 🔍 | search · L5090,5101,5109 | **search** |
| 🗑 | delete · L1440,4662 | **trash-2** |
| 💡 | tip · L5280 | **lightbulb** (== `IC.bulb`) |
| 📉 | decline · L5334 | **trending-down** |
| 🚫 | blocked · L5379 | **ban** |
| ⚖ | deload detective · L5411 | **scale** |
| 🔧 | mechanic · L5424 | **wrench** |
| 🟢 / ⚪ | phase current/incomplete · L5812 | **circle-dot** / **circle** |
| 🚴 | cardio toast · L6426 | **bike** (== `IC.bike`) |
| 🎂 | age tag · L5873,8193 | **cake** |
| 📅 | days/wk tag · L8192 | **calendar** |
| 🏆 | new-PB / RPE · L1373 | **trophy** |
| 🔥 | great-pump / RPE · L1375 | **flame** (== `IC.fire`) |
| 😵‍💫 | RPE distracted · L1372 | **dizzy** (no core lucide → keep or "wind") |
| ✨ | "Build My…" buttons · L8219,8226,8642 | **sparkles** |
| ➤ | consult send · L1815 | **send** / arrow-right |
| ✅ | status (3 UI + 10 console) · L8313,8321,8627 | **circle-check-big** (== `IC.check`) |
| ❌ | error alert · L6725 | **circle-x** (== `IC.cross`) |

---

## E. Emoji NOT in UI (console/comment only — out of reskin scope)
🔄 (×1), 🆔 (×1), 📥 (×6) — `console.log` strings only. Leave (or strip during a
log-cleanup), not user-facing.

---

## F. ⚑ Logic-tied icons — consolidated flag (do NOT break key→glyph maps)
Swap the **glyph**; preserve the **key→icon structure**; re-verify every branch.

| group | keys | map site(s) | keyed by |
|---|---|---|---|
| Workout type badge | push/pull/legs/cardio/nimble/rest (+ fire fallback) | L5896, L6030, L6159, L7221 | `type` |
| Cardio sub-type | run/swim/walk/row/bike | L6449 (+L7965) | `session.type` |
| Nav tabs | coach/recovery/plan/library/settings | L1821–1835 (+CSS .active, switchTab L3401) | `switchTab(tab)` |
| Check-in feeling | 💪/👍/😩/🤕 | L1306–1321 **+** L3428–3431 | feeling |
| Movement pattern | ↔️/⬆️/⬇️/🦵/🔗 | L8594–8596 | pattern key |
| Session gear | 🏋/🔌/🔩/🤸 | L1247–1250 | `data-session-gear` |

---

## G. Reskin recommendations
1. **One set, referenced — not inlined.** Promote the single lucide set as the only
   source; route the **86 inline `<svg>`** (§B+§C) and the IC entries through it;
   delete inline duplicates of IC paths.
2. **Emoji-as-icon → out.** Replace the ~45 UI emoji per §D; where an `IC`
   equivalent already exists (✓✕⚠🎯📊💡🔥🚴✅❌), reuse it — don't add a parallel glyph.
3. **Dedupe & collisions:** `cardio`==`bike` (one path); **Coach nav == Push type**
   (sparkles) — give distinct glyphs.
4. **Dead icons:** drop or wire `IC.brain`, `IC.chat`, `IC.download` (§A5).
5. **Bespoke type/movement icons** (push/pull/legs/nimble/rest/run/swim/walk/row)
   have no exact lucide — pick deliberate lucide stand-ins (§A1/A2) so the whole UI
   is one family; these are the only glyphs needing a design judgement call beyond a
   1:1 swap.
6. **Logic-tied (§F):** glyph-only swaps; keep keys; test each map branch.

— T4, 2026-06-14 21:57 (+10:00)
