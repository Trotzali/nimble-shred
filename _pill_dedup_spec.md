# Pill / tag dedup — consolidation spec

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors are line + selector (re-anchor by selector; lines drift).

## 0. Summary
Three visually-near-identical pill controls exist; **`.chip` (v113) is canonical**.
`.rpe-tag` and `.consult-bubble` are the duplicates to retire, and the **equipment
(session-gear) chips are stuck on `.rpe-tag`** (the v113 chip reskin's own comment
says so, L141). Consolidate everything onto `.chip`.

**The crux (class-name divergence):** `.chip` shows selection via **`.active`**;
the `.rpe-tag` family shows it via **`.selected`**. All `.rpe-tag` groups select
off a **data-attribute** (`data-session-gear` / `data-niggle` / `data-tag` /
`data-weight-unit`) + the `.selected` class — *not* off the `.rpe-tag` class —
**except** the RPE tags, whose `submitRPE`/reset read the **global `.rpe-tag.selected`**
selector. So migration = (a) swap markup class, (b) unify the toggled/read class on
`.active`, (c) scope the two global RPE selectors. Recommended: **unify on `.active`**.

**Bonus — the dedup fixes 2 live cross-contamination bugs** (§5): the global
`.rpe-tag.selected` reads currently also catch the default-selected **gym gear** and
**kg unit** (both `.rpe-tag selected`).

---

## 1. Canonical pill — `.chip` (v113)  ·  CSS @L140–154
```
.chip            padding:10px 18px; background:var(--surface-2); border:1px solid var(--line);
                 border-radius:10px; font-size:.85em; font-weight:500; color:#ccc; transition:all .2s
.chip.active     background:rgba(3,218,198,.10); color:#EAFFFB; border-color:var(--sec)   ← SELECTED STATE
.chip svg        opacity:.65   /   .chip.active svg{opacity:1}
.chip-container  flex; wrap; gap:8px; centered  (L140)
```
**Selected class = `.active`.** Container = `.chip-container` (gear/weight-unit may
keep `.gear-row` L584 — layout-only, no functional tie).

### Already-canonical `.chip` sites (NO change — reference for parity)
| sites | handler | selects via | active class |
|---|---|---|---|
| QS type chips L1286–1290 | `setQsType` L3633 | `[data-qs-type]` | `.active` (L3636–37) |
| QS focus chips L1295–1298 | `setQsFocus` L3642 | `[data-qs-focus]` | `.active` (L3645–46) |
| Encyclopedia filters L1721–1742 | `filterEncyclopedia` L5726 | scoped `#view-encyclopedia .chip` | `.active` (L5739–63) |
| Builder filters L1887–1908 | `filterBuilder` L5538 | scoped `#custom-builder-modal .chip` | `.active` (L5552–79) |
| Day-editor types L2000→render L6000 | `setDayType` | inline `' active'` | `.active` |
| Plan freq/goal L2019–2047 | `selectFrequency`/`selectGoal` L6066/6073 | (per-step) | `.active` |

These define the target contract: **attribute- or scope-keyed selection + `.active`.**

---

## 2. `.rpe-tag` — CSS @L564–581 (DELETE after migration) · 4 distinct groups

`.rpe-tag` = pill radius 25, `.selected` = **solid teal fill** (visual delta vs
chip's tint — see §6). Every group keys off a data-attribute; class toggled is
`.selected`.

| # | group | markup | handler / readers | keyed by | → becomes |
|---|---|---|---|---|---|
| R1 | **Equipment / session-gear** | L1278–1281 (`gym` is `rpe-tag selected`) | `setSessionGear` toggles `.selected` @L3612–3613 | `[data-session-gear]` | **`.chip`** (default `chip active`) |
| R2 | **Niggle joints** | L1367–1375 (in `#niggle-joint-chips`) | toggle `toggleNiggleChip` L3526; reset L3479; restore L3499; **read** `confirmNiggles` L3532 (`[data-niggle].selected`) | `[data-niggle]` | **`.chip`** |
| R3 | **RPE tags** | L1402–1407 (in `#rpe-tags-container` L1401) | toggle `toggleRPETag` L4597; **read** `submitRPE` L4602 (`.rpe-tag.selected`); reset `showRPEModal` L4584 (`.rpe-tag`) | `[data-tag]` + **global `.rpe-tag` selector** | **`.chip`** |
| R4 | **Weight-unit** | L1688–1689 (`kg` is `rpe-tag selected`) | `setWeightUnit` L3409; sync L3413 + L6699 toggle `.selected` | `[data-weight-unit]` | **`.chip`** (default `chip active`) |

## 3. `.consult-bubble` — CSS @L661–667 (DELETE after migration)
| markup | handler | state |
|---|---|---|
| rendered L8106 `class="consult-bubble"`, inside container `.consult-bubbles` (#consult-bubbles L1843) | `bubbleClick(text)` — **one-shot** (sends/fills, then bubbles re-render) | **no persistent selected state** |
→ becomes **`.chip`** (base look only; no `.active`). **Keep the `.consult-bubbles`
container** (L656–660: border-top, padding, flex-shrink — layout, not a pill).

---

## 4. Migration — exact edits (recommended: unify on `.active`)

### R1 — Equipment chips (the headline fix)
- **Markup L1278–1281:** `class="rpe-tag selected"`→`class="chip active"` (gym);
  `class="rpe-tag"`→`class="chip"` (cable/dumbbell/bodyweight). `onclick` +
  `data-session-gear` unchanged.
- **JS `setSessionGear` L3612–3613:** `remove('selected')`→`remove('active')`,
  `add('selected')`→`add('active')`.
- **No state moves:** the active gear is held in the `sessionGear` JS var
  (`applySessionGear` L3616 reads the var, not the DOM) — selection logic untouched.
- Container `.gear-row` (L584): keep as-is, or switch to `.chip-container` for parity
  (cosmetic).

### R2 — Niggle chips
- **Markup L1367–1375:** `class="rpe-tag"`→`class="chip"`.
- **JS — 4 sites, `.selected`→`.active`:** reset L3479, restore L3499, toggle L3526,
  **reader `confirmNiggles` L3532** (`'[data-niggle].selected'`→`'[data-niggle].active'`).
  All `[data-niggle]`-scoped → logic intact; only the class name changes.

### R3 — RPE tags  (⚠ the global selectors MUST change)
- **Markup L1402–1407:** `class="rpe-tag"`→`class="chip"`.
- **JS toggle `toggleRPETag` L4597:** `toggle('selected')`→`toggle('active')`.
- **JS read `submitRPE` L4602:** `querySelectorAll('.rpe-tag.selected')`
  → **`querySelectorAll('#rpe-tags-container .chip.active')`** (scope to the container
  L1401 — both renames the class AND removes the global match).
- **JS reset `showRPEModal` L4584:** `querySelectorAll('.rpe-tag')`
  → **`querySelectorAll('#rpe-tags-container .chip')`**.

### R4 — Weight-unit
- **Markup L1688–1689:** `class="rpe-tag selected"`→`class="chip active"` (kg);
  `class="rpe-tag"`→`class="chip"` (lbs).
- **JS sync L3413 and L6699:** `classList.toggle('selected', …)`→`toggle('active', …)`
  (both keyed by `[data-weight-unit]`). `setWeightUnit` body persists `appState.weightUnit`
  (state already lives there — nothing to move).

### Consult bubbles
- **Render L8106:** `class="consult-bubble"`→`class="chip"`. Handler `bubbleClick`
  unchanged; container `.consult-bubbles` kept.

### CSS deletions (after the above)
- Remove `.rpe-tag`, `.rpe-tag:hover/:active/.selected` (L564–581).
- Remove `.consult-bubble`, `:hover`, `:active` (L661–667). **Keep** `.consult-bubbles`.
- Keep `.chip*` (L140–154), `.gear-row` (L584) if reused.

---

## 5. ⚑ Cross-contamination bugs the dedup FIXES (verify gone after)
Because gym gear (L1278) and kg unit (L1688) are **`.rpe-tag selected`**, the two
**global** RPE selectors currently leak across controls:
1. `submitRPE` L4602 `querySelectorAll('.rpe-tag.selected')` also matches gym + kg →
   their `dataset.tag` is `undefined` → `tags` array gets `undefined` entries saved to
   `rpeHistory`. Scoping to `#rpe-tags-container` (R3) **fixes it**.
2. `showRPEModal` reset L4584 `querySelectorAll('.rpe-tag')…remove('selected')` strips
   the visual selected state from gym + kg **every time the RPE modal opens**. Scoping
   (R3) + moving them off `.rpe-tag` (R1/R4) **fixes it**.
These are real today; the dedup is correctness, not just cosmetics.

---

## 6. State / markup that must move · risk · verify
- **Class unification is the only behavioural change.** Pick ONE: **(A, recommended)**
  `.selected`→`.active` everywhere above (clean, one active-class). **(B, fallback)**
  add `.chip.active,.chip.selected{…}` alias so attribute-keyed togglers (R1/R2/R4)
  need no JS edit — **but R3's global selectors must still be renamed+scoped**, and B
  leaves two active-class names (debt). Prefer A.
- **Visual delta (intended):** `.rpe-tag` selected = solid teal fill; `.chip.active` =
  teal tint + light text; radius 25→10; `.consult-bubble` radius 20→10. This is the
  point (one pill) — get design sign-off that gear/RPE/weight-unit/bubbles adopt the
  tint look.
- **Tag swap:** `.rpe-tag`/`.consult-bubble` sites are `<button>`; canonical `.chip`
  sites are `<div>`. `.chip` is class-based so it styles `<button>` fine — keep
  `<button>` for the interactive migrated ones (better a11y). Verify no UA `<button>`
  padding/font leaks (the `.chip` rule sets padding/font; should be fine).
- **Defaults preserved:** gym (`chip active`) and kg (`chip active`) keep their
  initial selected look.
- **No data/state migration:** `sessionGear` var, `appState.weightUnit`,
  `appState.niggleJoints`, `rpeHistory` are all unchanged — only DOM classes/selectors
  move.

### Verify checklist (post-migration)
1. Gear: tapping gym/cable/dumbbell/bodyweight moves the teal-tint active state; only
   one active; `applySessionGear` still sets the right pool.
2. Weight-unit: kg/lbs toggle persists + reflects on settings re-open (L6699 sync).
3. Niggle: multi-select tint; `confirmNiggles` collects the right joints (L3532).
4. RPE: multi-select tint; `submitRPE` tags = only `[data-tag]` (no `undefined`);
   reopening the modal clears RPE tags **without** touching gear/kg (bug §5 gone).
5. Consult bubbles: render as `.chip`, click still sends; no stuck active state.
6. Grep shows **zero** remaining `.rpe-tag` / `.consult-bubble` (class + CSS).

---

## 7. Phasing (one category)
Single CSS+markup category, but stage to limit blast radius:
1. **R1 + R4** (gear + weight-unit) — pure attribute-keyed; lowest risk; immediately
   un-sticks equipment chips onto v113 and removes them from the RPE global selectors.
2. **R3** (RPE) — the only selector-scoping edits; test the §5 contamination is gone.
3. **R2** (niggle) — class rename across 4 sites.
4. **Consult bubbles** + **delete `.rpe-tag`/`.consult-bubble` CSS**.
Each step is independently shippable; after step 4, `.chip` is the sole pill.

— T4, 2026-06-15 10:40 (+10:00)
