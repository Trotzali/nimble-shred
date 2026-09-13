# Spec — exercise-text font sizes → minimal consistent bump (40+ legibility)

**Type:** READ-ONLY. No index.html edits, no git. By selector/symbol.
**Problem (Troy):** exercise text reads too small for a 40+ audience — fix **consistently** across surfaces, not one.
**Base:** `body` has no `font-size` → **16px**; `h1–h4` route to Archivo with **no font-size** → `<h3>` ≈ browser default **18.7px** (large enough). The small text is the **meta lines** (all `.text-muted` 0.85em = 13.6px) and the **up-next name** (0.85em = 13.6px). No exercise row sets `line-height` → "normal" (~1.2).

---

## 1. Current sizes by site (selector/symbol · font-size · line-height)

| # | Site / symbol | Element | current font-size | line-height |
|---|---|---|---|---|
| 1 | **Builder list** — `.exercise-list-item` (`renderBuilderExerciseList`) | name `<strong>` | **16px** (inherits base, bold) | normal |
| | | meta `<small class="text-muted">cat • equip` | `.text-muted` 0.85em → **13.6px** (class beats `<small>`) | normal |
| 2 | **Active-session card** — `.exercise-card` (`renderWorkout`) | name `<h3 style="margin:0">` | **~18.7px** (h3 default, Archivo) | normal |
| | | meta `<div class="text-muted">cat • equip` | 0.85em → **13.6px** | normal |
| 3 | **Up-next list** — `renderWorkout` `upHtml` | row `<div style="font-size:0.85em">` "N. Name" | **13.6px** | normal |
| | | tag `<span>• cat` (inherits row) | **13.6px** | normal |
| | | "Up Next" header `font-size:0.8em` | 12.8px | normal |
| 4 | **Encyclopedia rows** — `.card` (`renderEncyclopedia`) | name `<h3 style="margin:0 0 5px">` | **~18.7px** | normal |
| | | meta `<div class="text-muted">cat • equip • type` | 0.85em → **13.6px** | normal |

**Pattern:** all four meta lines are 13.6px via `.text-muted` (0.85em); the up-next *name* is the only name that's also 13.6px. The two `<h3>` names (active + encyclopedia) are already ~18.7px and read fine.

---

## 2. Minimal consistent bump (conservative)

Two consistent floors: **exercise name ≥ ~16px**, **exercise meta ≥ ~14.5px**, with `line-height: 1.4` on bumped meta. Implemented **scoped to exercise containers** so the shared `.text-muted` is not touched globally (see §4).

| # | Site · element | current → target | how (selector-scoped) |
|---|---|---|---|
| A | **meta — all three card contexts** (builder, active, encyclopedia) | 13.6px → **14.4px** (0.9em) + `line-height:1.4` | `.exercise-card .text-muted, .exercise-list-item .text-muted, #encyclopedia-list .card .text-muted { font-size:0.9em; line-height:1.4; }` |
| B | **Builder name** `.exercise-list-item strong` | 16px → **17px** (1.0625em) | `.exercise-list-item strong { font-size:1.0625em; }` |
| C | **Up-next row** (`upHtml` inline) | name+tag 13.6px → **15.2px** (0.95em) + `line-height:1.4` | at the render site: row `font-size:0.85em` → `0.85em`→`0.95em`; add `line-height:1.4` |
| D | **Active card name `<h3>`** | 18.7px → **leave** | already large |
| E | **Encyclopedia name `<h3>`** | 18.7px → **leave** | already large |

Net effect: every exercise name now ≥16px (builder 17, up-next 15.2, h3 18.7) and every meta line 14.4px — consistent across all four surfaces, ~+0.8px on meta and the up-next name lifted off the floor. Deliberately small steps so nothing reflows hard.

---

## 3. Overflow / re-wrap notes (all low-risk; rows grow, none clip)
- **Builder (B):** `.exercise-list-item` is flex — name/meta block left, info button right. At name 17px a very long name (e.g. *Cable Hip Adduction (Standing)*) may wrap to 2 lines on narrow phones; the row grows, button stays — **no overflow**, just taller. Acceptable.
- **Encyclopedia (A):** meta is 3 parts (`cat • equip • type`); long combos (e.g. *Chest, Shoulders, Triceps • Bodyweight • Calisthenics*) already wrap at 13.6px — 14.4px makes a 2-line meta marginally more likely. Card is full-width; **wraps cleanly, no clip**.
- **Up-next (C):** rows are single-line "N. Name • cat" in a div — at 15.2px a long name may wrap to 2 lines; **div wraps, no overflow**.
- **Active card (A):** meta is full card width; 14.4px **fits, no wrap risk**.
No fixed-height containers wrap these rows, so every bump grows the row rather than clipping.

---

## 4. FLAG — `.text-muted` is a SHARED class; do NOT bump it globally
`.text-muted { color:#aaa; font-size:0.85em; }` (one rule) is used far beyond exercises:
- empty states ("No workouts logged yet", "No cardio sessions yet", "No saved locations"),
- consult prompts ("How many days per week?", "What do you want most from training?"),
- "Selected: N exercises" count,
- **`.preset-card` descriptions** — note this uses the *same* `<strong>name</strong><br><small class="text-muted">desc</small>` shape as the Builder, so a blanket `.text-muted strong`/`small` bump would leak into equipment presets.

→ **Apply A as a *scoped descendant* rule** (`.exercise-card`/`.exercise-list-item`/`#encyclopedia-list .card`), never edit the base `.text-muted`. Apply B scoped to `.exercise-list-item strong` (not `.preset-card strong`). This keeps the bump inside exercise rows only.

---

## 5. LEAVE list — exercise/adjacent text that should stay small
- **"Up Next" section header** (`0.8em` uppercase) — a label, not exercise content.
- **`.set-active .set-eyebrow`** (11px uppercase) — set-log instrument label.
- **Active-card "How to" guide block** (`0.85em`, `#bbb`) — dense instructional copy, not name/meta.
- **History set-rows** (`.history-set-row .set-num`/`.set-unit`, ~13.6px) — dense logged-set tables; bumping bloats history. Leave (contrast retoken is separate, per the a11y manifest).
- **Mono data captions** (e.g. the 11.5px muscle/data caption) — data, not exercise name/meta; out of scope.
- The two `<h3>` exercise names (active, encyclopedia) — already ~18.7px.

---

## 6. Summary
- All exercise **meta** is 13.6px (shared `.text-muted` 0.85em); the **up-next name** is also 13.6px. The `<h3>` names (active + encyclopedia) are already ~18.7px.
- Minimal consistent fix: meta **0.85em→0.9em (14.4px) + line-height 1.4**, builder name **16→17px**, up-next row **0.85em→0.95em (15.2px)** — scoped to exercise containers. Names floor at 16px, meta at ~14.5px, consistently.
- **Critical flag:** scope the meta bump to exercise rows — do **not** touch the global `.text-muted` (leaks into empty states, consult prompts, preset cards). One scoped descendant rule + one `.exercise-list-item strong` rule + one inline up-next tweak.
- Wrap risk is limited to long names/metas growing a row to 2 lines on narrow phones — no clipping.

---

SIGN OFF: T5 | 2026-06-15 | 17:50 AEST (07:50 UTC)
