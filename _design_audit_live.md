# Design audit — LIVE state (v75) vs `_spec_design_language.md`

**Type:** READ-ONLY live-state audit. No edits, no git, index.html untouched.
**Audited against:** the committed/on-disk `index.html` — working tree == HEAD, both **v75** (`:1180`). The v75 picker work doesn't touch design surfaces.
**Spec note:** `_spec_design_language.md` is **not in the repo** (closest tracked file is `_design_spec_quickstart_drilldown.md`, a different doc). This audit is therefore run against the **11 checks enumerated in the tasking**, mapped to phases P1–P11, with the two phase anchors the tasking fixed (P1 = tokens; P7 = set-log restyle). The only spec constraint I had verbatim: **accent LOCKED = teal `#03DAC6` = existing `--sec`.**
**Status key:** DONE = spec's target already true in live · PARTIAL = partly · TODO = work remains. (For "AI tells," the target is *removal*, so an absent tell = DONE.)

---

## P1–P11 status table

| # | Check | Status | Live value / selector | Anchor |
|---|---|---|---|---|
| **P1** | `--primary` still purple `#BB86FC`? | **TODO** (tell present) | `--primary: #BB86FC` — the Material-dark default. Consumed by `.btn-action{background:var(--primary)}` + purple gradient tints | `:35`, `:67`, `:676` |
| **P2** | `--sec` = teal, accent wired end-to-end? | **DONE** | `--sec:#03DAC6`; btn-main, nav-active, set-active border, version badge all read it | `:35,:66,:101,:132,:1180` |
| **P3** | 4 bundled themes + switcher? | **DONE** (absent) | no `data-theme`, no Athletic/Premium/Tech/Minimal, no switcher in markup or JS | — |
| **P4** | Glassmorphism blur + stacked shadows on `.card`/`.nav-bar`? | **DONE** (absent) | **no `backdrop-filter` anywhere**; `.card` single shadow `0 2px 12px`; `.nav-bar` solid `#1a1a1a` | `:51-55`, `:90-95` |
| **P5** | Null gradients `linear-gradient(…--sec…--sec…)`? | **DONE** (none) | 21 gradients, all distinct stops; `:676` is a legit teal→purple two-color | grep (21) |
| **P6** | Universal `*{transition}` + `.card:hover translateY(-2px)`? | **DONE** (absent) | `*{}` is box-sizing only; **no `.card:hover` rule exists**; only scoped `.btn` transition + `.btn:hover translateY(-1px)` | `:41,:64` |
| **P7** | Icons emoji→SVG, or emoji/mojibake in source? | **PARTIAL** | SVG system live (`IC` consts + inline SVG on nav/chips/buttons) **but ~109 emoji remain** (notifications, check-in labels, headers) **+ 4 mojibake `Â`** (corrupt `°`) in exercise text | `:1933`; e.g. `:2002` |
| **P8** | Version badge nested in Coach h2 / accent / matching size? | **DONE** (w/ nuance) | sibling `<span>` in the h2 header flex row, `color:var(--sec)`, `1.3em` == h2's `1.3em` (paired, not a literal `<h2>` child) | `:1178-1181` |
| **P9** | Real exercise count (spec 164 vs likely 163)? | **CONFIRMED = 164** | `createEx(` calls = **164** in `window.allExercises`. ⚠ metadata has **177** keys → 13-entry divergence (data, not design) | data block `:1986+` |
| **P10** | Current set-log row markup (for P7 restyle) | **DOCUMENTED** | `.set-active` (#2c2c2c, `2px var(--sec)`, teal glow) / `.set-completed` (green gradient, `border-left var(--success)`); render builds `Set N` + inputs + Log Set/Next | CSS `:124-134`; render `:3938-3947` |
| **P11** | Old "40+ Friendly" chips vs new focus chips — swapped? | **TODO** (not swapped) | "40+ Friendly" chips live (Mobility/Nimble/Calisthenics/Plyo); **no focus chips**; `getBucket` has **zero consumers**; `generateWorkoutByType` still uses legacy `nimble` branch | chips `:1803-1806`; `:3524` |

**Headline:** most of the design "AI tells" are **already neutralised at v75** (P3/P4/P5/P6 absent, P2 wired, P8 done). The remaining design-language work is narrow: **P1** (`--primary` is still the Material-default purple), **P7** (emoji + 4 mojibake cleanup), and **P11** (chip swap — gated on Keystone Phase B, which has **not** started although **Phase A has landed**, `:3006-3007` + accessors `:5812-5847`).

---

## Detail per item

**P1 — `--primary` purple.** `:35` `--primary: #BB86FC`. This + `--sec:#03DAC6` is verbatim the **Material Design dark reference palette** (Purple 200 + Teal 200) — the canonical "looks AI-generated" signature. Consumers of `--primary`: `.btn-action{background:var(--primary)}` (`:67`); the teal→purple gradient `linear-gradient(90deg,var(--sec),var(--primary))` (`:676`); and rgba purple tints `rgba(187,134,252,…)` in card-header gradients (`:566,:654,:666,:1223,:1318`). **Changing `--primary` is the core of P1** — blast radius is those buttons + ~6 gradient tints.

**P2 — accent teal, end-to-end (DONE).** `--sec:#03DAC6` (`:35`) → `.btn-main` (`:66`), `.nav-btn.active{color:var(--sec)}` (`:101`), `.set-active` border + glow (`:132-133`), version badge (`:1180`), and many rgba(3,218,198,…) accents. Accent is already the locked teal everywhere it matters.

**P3 — themes (DONE/absent).** No theme system in markup or JS. The four-theme switcher described against v51 is gone/never shipped in v75.

**P4 — glassmorphism (DONE/absent).** Zero `backdrop-filter`. `.card` = `background:var(--card); box-shadow:0 2px 12px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.04)` (single, flat). `.nav-bar` = solid `#1a1a1a`, `border-top:1px solid #333` (`:90-95`). No blur, no stacked shadows.

**P5 — null gradients (DONE/none).** All 21 `linear-gradient`s use distinct stops. The only `--sec`-bearing one (`:676`) pairs `--sec`→`--primary` (teal→purple), which is real, not a same-color null.

**P6 — motion (DONE/absent).** `*{box-sizing/margin/padding}` only (`:41`) — **no universal transition**. **No `.card:hover` rule** at all. Transitions are scoped to `.btn{transition:all .2s}` (`:61`) with `.btn:hover{transform:translateY(-1px)}` (`:64`) — a button affordance, not the card-lift tell.

**P7 — icons (PARTIAL).** SVG system present: `const IC = {…}` (`:1933`) and inline `<svg>` on nav buttons, Quick-Start chips (`:1803-1806`), version-badge h2 (`:1179`), and most action buttons. **Remaining emoji (~109 glyphs)** are in dynamic strings, not structural icons: notifications (`✅ 💪 ⚠ 📥 🎯 📊`), check-in labels (`💪 👍 😩 🤕`), and the `✓ Log Set` button (`:3942`). **4 mojibake `Â`** (a corrupted `°`, e.g. "lean torso 30Â°" `:2002`) sit in `createEx` exercise text. P7 finish = migrate the remaining emoji + fix the 4 mojibake.

**P8 — version badge (DONE).** `:1178-1181` — a flex header row holding `<h2 style="font-size:1.3em">…Workout Coach</h2>` and a sibling `<span style="font-size:1.3em; color:var(--sec)">v75</span>`. Accent teal ✓, size matches the h2 ✓. Nuance: it's a sibling span in the header row, not a literal child of `<h2>` — visually paired as intended.

**P9 — count = 164.** `createEx(` = **164**. Spec's 164 is correct; live is not 163. ⚠ **Divergence flag (data, not design):** `exercise-metadata.js` v1.4.0 has **177** keys vs 164 in `allExercises` → ~13 metadata orphans; the metadata self-check will `console.error` them at runtime. Belongs to whoever integrates the incoming exercise packs (T2/T3), surfaced here only because P9 asked for the real number.

**P10 — set-log markup (for P7 restyle).**
- CSS `:124-134`: `.set-completed{ background:linear-gradient(90deg,#1a4d2e,#2d5f3d); border-left:3px solid var(--success); display:flex; justify-content:space-between }` · `.set-active{ background:#2c2c2c; border:2px solid var(--sec); box-shadow:0 0 10px rgba(3,218,198,0.2) }`.
- Render `:3938-3947`: `<div class="set-active"><strong>Set N</strong>` + `inputsHtml` (weight/reps `<input type=number>`, `:3920-3935`) + `<button class="btn btn-main">✓ Log Set</button>` + `<button class="btn btn-action">Next Exercise →</button>`. Note the `✓` emoji on the log button (P7 overlap) and that `.set-active` already carries the teal accent (P2-consistent).

**P11 — chip taxonomy NOT swapped.** Builder "40+ Friendly" chips live at `:1803-1806`: `filterBuilder('Mobility')`/`('Nimble')`/`('Calisthenics')`/`('Plyo')`. No `filterBuilder('Strength'|'Power'|'Resilience'|'Cardio')`. `getBucket` exists (`:5815`) but has **no consumers**; `generateWorkoutByType` still `type==='nimble' → ex.cat.includes('Nimble')||ex.type==='Mobility'` (`:3524`). So the focus-chip swap (Keystone Phase B / `_taxonomy_resolution.md` §5) is genuinely pending — Phase A is in and silent, exactly as specced.

---

## Build-ready PHASE 1 (tokens) — live-anchored rewrite

**Goal (only locked input):** accent = teal `#03DAC6`. So P1 is **not** an accent change — `--sec` is already correct and wired (P2 DONE). P1's real job is **the lone remaining color tell: the Material-default purple `--primary`.**

### Current `:root` (verbatim, `:34-40`) — the real surface T1 edits
```css
:root {
    --bg: #121212; --card: #1e1e1e; --primary: #BB86FC; --sec: #03DAC6;
    --text: #fff; --gold: #FFD700; --danger: #CF6679; --warn: #FF9800;
    --success: #00C853; --push-color: #FF6B6B; --pull-color: #4ECDC4;
    --legs-color: #95E1D3; --cardio-color: #3498db; --nimble-color: #9b59b6;
    --rest-color: #555;
}
```

### P1 edit — exactly one token changes
```css
/* BEFORE */  --primary: #BB86FC;   /* Material Purple 200 — the AI tell */
/* AFTER  */  --primary: <NEUTRALISED_PRIMARY>;   /* product sign-off needed — see options */
```
Everything else in `:root` stays. `--sec` is **not** touched (accent locked teal).

**`<NEUTRALISED_PRIMARY>` is the one value needing a decision** (the spec file wasn't in the tree, so I won't invent the brand value). Options, in order of least surprise — all break the Material-pair signature:
1. **Desaturated slate** `#8A8F98` (neutral secondary-action grey-blue) — most "de-AI," keeps `.btn-action` legible on dark.
2. **Warm graphite** `#9AA0A6` — neutral, pairs calmly with teal.
3. **A teal-family tint** (e.g. `#5BC8BE`) — if the brand wants a mono-accent system; but then `.btn-action` and `.btn-main` look similar — confirm that's wanted.

Recommend **(1)** unless the spec dictates a brand hue. Contrast: `.btn-action` sets `color:#000` (`:67`), so the new `--primary` must stay light enough for black text (all three options pass).

### Blast radius of changing `--primary` (verify visually after the edit)
| Consumer | Where | Effect |
|---|---|---|
| `.btn-action` background | `:67` | secondary action buttons recolor (Random Workout, Next Exercise, etc.) |
| teal→primary gradient | `:676` | the one two-color accent gradient shifts its second stop |
| purple rgba tints `rgba(187,134,252,…)` | `:566,:654,:666,:1223,:1318` | **not** driven by the token — hard-coded purple. **These do NOT update when `--primary` changes.** To fully kill the purple tell, T1 must also replace these literals (or convert them to `color-mix`/rgba of the new primary). **Flag:** token change alone leaves 5 purple gradient tints behind. |

### Tokens the spec may assume but that **do not exist live** (flag before P1 build)
The live file has **15 tokens** (above) and otherwise uses **inline hex/rgba** heavily. If `_spec_design_language.md` references any of these, they must be **created** in `:root` first, or the spec's selectors won't resolve:
- `--accent` → **does not exist**; live uses `--sec` directly. (If the spec says `--accent`, alias it: `--accent: var(--sec);`.)
- `--surface` / `--surface-2` → **absent**; live uses `--card` (`:1e1e1e`) + inline `#2c2c2c`/`#1a1a1a`.
- `--border` → **absent**; live uses inline `rgba(255,255,255,0.04)` (card), `#333` (nav).
- `--text-muted` → **absent**; live uses a `.text-muted` class + inline `#888`/`#666`.
- `--radius` → **absent**; live uses inline `14px`/`10px`/`6px`.
- `--shadow` → **absent**; live uses inline `0 2px 12px rgba(0,0,0,0.3)`.

If P1 in the spec is "introduce a token system," that's a larger refactor than a one-line `--primary` swap — call it out and scope separately. If P1 is just "kill the AI palette," it's **`--primary` recolor + the 5 hard-coded purple tints**, and nothing else (accent already teal).

---

## Summary
- **Already done (no work):** P2 (teal accent wired), P3 (no themes), P4 (no glassmorphism), P5 (no null gradients), P6 (no universal transition / card-lift), P8 (version badge). Keystone Phase A is also in and silent.
- **Remaining design work:** **P1** recolor `--primary` (+ 5 hard-coded purple tints), **P7** finish emoji→SVG and fix 4 mojibake, **P11** focus-chip swap (gated on Phase B).
- **Facts:** P9 count = **164** (live) vs 177 (metadata — data divergence flag); P10 set-log markup documented for the P7 restyle.
- **P1 build:** one `:root` line (`--primary`) — value needs product sign-off; the accent stays teal. Flagged: 5 purple rgba literals aren't token-driven, and 6 common design tokens the spec might assume don't exist live.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 20:56 AEST (10:56 UTC). Read-only: no edits, no git, index.html untouched.*
