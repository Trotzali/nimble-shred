# Spec — Custom Workout Builder selection fix

**Terminal:** T2 (READ-ONLY on `index.html` — no edits, no git). Spec only; T1 applies.
**Symptom:** clicking an exercise increments "Selected: N" (count works) but rows look un-highlighted and there's no list of what's picked. Troy wants BOTH (1) highlighted rows and (2) a visible list.

## 1. Exact symbols

| role | symbol |
|---|---|
| render fn (builds the list) | **`renderBuilderExerciseList()`** — wipes `#builder-exercise-list` innerHTML, re-builds one row per filtered exercise |
| row markup | inside `renderBuilderExerciseList`: `div.className = 'exercise-list-item'`; `div.innerHTML = …name + cat/equip + info-button…`; `div.onclick = () => toggleExerciseSelection(ex)` |
| click/select handler | **`toggleExerciseSelection(exercise)`** — add/remove in state, then `renderBuilderExerciseList()` + `updateSelectedCount()` |
| selection state | **`appState.selectedExercises`** — array of exercise **objects**; membership tested by `.name` (`findIndex(e => e.name === …)` / `some(e => e.name === …)`) |
| count element + updater | `#selected-count` span, set by **`updateSelectedCount()`** = `appState.selectedExercises.length` ✓ (confirmed: count reads that same state — that's why the number is correct) |
| selected CSS | **`.exercise-list-item.selected`** (rule EXISTS) |
| list container | `#builder-exercise-list`; footer has `<p>Selected: <span id="selected-count">…</span></p>` then `startCustomWorkout()` CTA |

## 2. Root cause of the missing highlight

**Not "class never toggled," and not "no CSS."** The render fn *does* re-add the class on every toggle:
```js
if (appState.selectedExercises.some(e => e.name === ex.name)) div.classList.add('selected');
```
and a rule exists:
```css
.exercise-list-item.selected { background: rgba(138,143,152,0.2); border-left-color: var(--primary); }
```
**The rule is just too weak to perceive on the dark theme.** `--primary` is slate `#8A8F98` (rgb 138,143,152); the selected state is that slate at **0.2 alpha** composited over a `#2c2c2c` row inside a `#1e1e1e` modal, with the left border shifting `#555` → slate (both muted greys). Selected vs unselected differ by a barely-visible grey-on-grey tint + a near-identical left border. So the highlight *works structurally but reads as "not highlighted."*

(Equal-specificity note: `.exercise-list-item:hover` and `.selected` are both `(0,2,0)`; `.selected` is defined later so its faint background wins even on hover — so hovering doesn't reveal it either.)

Separately, there is **no rendering of selected names anywhere** — the only feedback is the integer. So even with a strong highlight, a pick that's been scrolled past or filtered out is invisible.

## 3. Fix (1) — HIGHLIGHT: strengthen the `.selected` recipe to the chip/preset-active treatment

No JS change (the class already toggles). **Rewrite the one CSS rule** `.exercise-list-item.selected` from faint slate to the bright teal "active" recipe used by `.preset-card.active` / `.rpe-tag.selected` (surface-2 + teal tint + teal border):
```css
.exercise-list-item.selected {
    background: rgba(3,218,198,0.15);     /* teal tint (--sec @ .15), not slate @ .2 */
    border-left-color: var(--sec);        /* teal left border (bright, on-brand) */
    border-left-width: 4px;               /* optional: thicker bar so it reads at a glance */
}
.exercise-list-item.selected strong { color: var(--sec); }   /* optional: teal name */
```
- Surgical: **one CSS rule edited** (+1 optional helper line). Uses existing token `--sec` (`#03DAC6`).
- Optional extra clarity (row template, JS): prepend a `✓ ` to the name for selected rows — not required if the teal recipe is used.

## 4. Fix (2) — LISTED: show the picked exercise names

**Insertion point:** in the builder modal footer, **between the count `<p>` and the `startCustomWorkout()` CTA** (i.e. right after `<p class="text-muted">Selected: <span id="selected-count">0</span> exercises</p>`):
```html
<div id="builder-selected-list" style="display:flex; flex-wrap:wrap; gap:6px; margin:6px 0 10px;"></div>
```
**Render it** — fold into the already-wired `updateSelectedCount()` (so every existing call site — toggle AND `openCustomBuilder` — paints it; no new call-sites to thread):
```js
function updateSelectedCount() {
    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.textContent = appState.selectedExercises.length;
    const list = document.getElementById('builder-selected-list');
    if (list) list.innerHTML = appState.selectedExercises.map(e =>
        `<span class="profile-tag" style="cursor:pointer;" onclick="removeSelectedExercise('${e.name.replace(/'/g,"\\'")}')">${e.name} ✕</span>`
    ).join('');
}
```
**Add the deselect helper** (chip ✕ removes by name, then re-renders both surfaces):
```js
function removeSelectedExercise(name) {
    const i = appState.selectedExercises.findIndex(e => e.name === name);
    if (i > -1) appState.selectedExercises.splice(i, 1);
    renderBuilderExerciseList();   // drop the row highlight
    updateSelectedCount();         // repaint count + chips
}
```
- Uses the existing **`.profile-tag`** teal pill — consistent, zero new CSS.
- `openCustomBuilder()` already calls `updateSelectedCount()` after resetting `selectedExercises = []`, so the chips list clears on every fresh open for free.
- Surgical: **1 markup `<div>` + extend `updateSelectedCount` + 1 small helper.**

## 5. Edge cases (flagged)

- **Deselect:** two routes, both fine — click the highlighted row again (`toggleExerciseSelection` splices it off) **or** click a chip's ✕ (`removeSelectedExercise`). Both re-render → row loses `.selected`, chip disappears, count drops.
- **Search/filter re-render does NOT wipe selection — this is a *different* re-render class from the rest-timer bug.** `searchBuilderExercises()` / `filterBuilder()` only re-run `renderBuilderExerciseList()`, which re-derives `.selected` from `appState.selectedExercises` (state lives in `appState`, untouched). So selection survives filtering — **no state loss** (unlike the orphaned-interval rest-timer bug; this re-render is idempotent and state-safe). **BUT** a selected exercise that doesn't match the current filter/search drops out of the *visible* rows, so its highlight vanishes from view even though it's still selected and counted — **exactly the gap Fix (2) closes**: the chips list shows all picks regardless of the active filter. Worth a one-line note in the build.
- **Fresh open:** `openCustomBuilder()` resets `selectedExercises = []` then calls `renderBuilderExerciseList()` + `updateSelectedCount()` — so both the highlight and the new chips list reset cleanly each open (no stale carryover).
- **Cap:** `toggleExerciseSelection` enforces a 20-pick sanity bound (alert + early return); deselect path is unaffected. No change needed.

---

**Sign-off:** T2 | 2026-06-15 17:18
