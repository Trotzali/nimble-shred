# Spec — Quick-win batch (issues #16, Assessment relabel, #14 links)

**Type:** Build-ready spec. T4 produced this from READ-ONLY analysis.
**No edits to `index.html` were made; no git was run.** Apply in a later build.
**Date:** 2026-06-08 · **Target:** `index.html` (v67, header `v67` at L1180)
Line numbers are **indicative** — locate by function/pattern, they may drift.

---

## #16 — Hide the redundant "Number of Exercises" slider in the Custom Builder

### Why
There are **two** `<input type="range">` count sliders, both (incorrectly)
sharing `id="exercise-count-slider"`:

| Where | Lines | Display span | Used by | Verdict |
|---|---|---|---|---|
| **Quick Start panel** (Coach/Home tab) | L1186–1204 | `exercise-count-display` | auto-pick path | **KEEP** |
| **Custom Builder modal** | L1777–1781 | `builder-count-display` | hand-pick path | **HIDE** |

Both write `appState.exerciseCount` via `updateExerciseCount()`. In the Builder
the user hand-picks exercises, so a "how many to auto-generate" slider is
meaningless there — that's the redundancy in #16.

**Critical subtlety (do not skip):** the Builder slider is *not* purely
cosmetic. Its only functional effect is to set `appState.exerciseCount`, which
`toggleExerciseSelection()` uses as the **selection cap**:

```js
// toggleExerciseSelection()  ~L5124–5140
} else {
    if(appState.selectedExercises.length < appState.exerciseCount) {   // L5130
        appState.selectedExercises.push(exercise);
    } else {
        alert(`Maximum ${appState.exerciseCount} exercises selected`);  // L5133
        return;
    }
}
```

Because `appState.exerciseCount` is **shared** with the Quick Start slider
(default `6`, app state at L3033), if you hide the Builder slider *without*
touching this cap, hand-picking is silently limited to whatever Quick Start was
last set to — the user hits "Maximum 6 exercises selected" with no visible
control. So hiding the slider **requires** relaxing this cap. (`startCustomWorkout()`
itself, L5149–5157, does **not** read `exerciseCount` — it just uses
`appState.selectedExercises` — confirming the slider has no other purpose in the
Builder.)

### Change 1 — remove the slider block from the Builder modal (HTML)
Pattern: inside `#custom-builder-modal` (opens L1770), the first child block.
**Before** (~L1777–1781):
```html
<div style="margin-bottom: 15px;">
    <label>Number of Exercises: <span id="builder-count-display">6</span></label>
    <input type="range" id="exercise-count-slider" min="3" max="10" value="6"
           oninput="updateExerciseCount(this.value)">
</div>
```
**After:** delete the block entirely (preferred), or wrap with
`style="display:none"` if a no-DOM-removal change is required.

- Deleting is safe: `updateExerciseCount()` already null-guards the builder
  display (`const builderEl = document.getElementById('builder-count-display'); if (builderEl) ...`,
  L3449–3450 / L4974–4975), so its disappearance throws nothing.
- **Bonus:** this also resolves the duplicate `id="exercise-count-slider"`
  (L1192 + L1779) — invalid HTML; `getElementById` only ever returned the
  Quick Start one (first in DOM order), so the Builder slider was already
  unreachable by id and only worked via its inline `oninput`.

### Change 2 — relax the Builder selection cap (JS, REQUIRED companion)
Pattern: `toggleExerciseSelection()` ~L5124–5140. The hand-pick flow should not
be bounded by the auto-pick count. **Recommended:** drop the cap entirely so the
user picks freely:
```js
function toggleExerciseSelection(exercise) {
    const index = appState.selectedExercises.findIndex(e => e.name === exercise.name);
    if (index > -1) {
        appState.selectedExercises.splice(index, 1);
    } else {
        appState.selectedExercises.push(exercise);   // no exerciseCount cap in hand-pick mode
    }
    renderBuilderExerciseList();
    updateSelectedCount();
}
```
**Minor product choice (flag, don't assume):** if an upper bound is still
wanted as a sanity guard, use a *fixed* Builder constant (e.g. `12`) rather than
`appState.exerciseCount`, so it's independent of the Quick Start setting.

### Keep (do not touch) — the auto-pick path
- Quick Start slider L1186–1204 → `updateExerciseCount()` → `appState.exerciseCount`.
- `quickStartWorkout(type)` L3411 → `generateWorkoutByType(type, appState.exerciseCount)` (~L3424).
- `generateRandomWorkout()` L3454 → `quickStartWorkout(randomType)`.
- `updateSettingsUI()` slider-sync L5882–5886 (reads the Quick Start slider).

### Optional cleanup (not required)
`updateExerciseCount()` is **defined twice**, identically (L3446–3452 and
L4971–4977); the second wins. Harmless; could be de-duped in a hygiene pass.

### Test
Quick Start + Random still respect the slider (4–10); Builder modal shows no
slider; hand-pick allows selecting more than 6 with no "Maximum" alert; starting
a custom workout runs exactly the picked set.

---

## Relabel "Redo Assessment" → "Fitness Assessment"

### Why / scope
Single visible string. The button always reads "Redo Assessment" even for new
users who've never done one. Other UI already says "Fitness Assessment"
(`startAssessment` flow: notification L7746, progress header L7806), so this
aligns the label.

### Change — one site, HTML text node
Pattern: button with `onclick="startAssessmentDirect()"` in the AI Coach
Consultation card. **Only occurrence** of the string (grep-confirmed).
**Before** (~L1325–1327):
```html
<button class="btn" onclick="startAssessmentDirect()" style="...">
    💪 Redo Assessment
</button>
```
**After:**
```html
<button class="btn" onclick="startAssessmentDirect()" style="...">
    💪 Fitness Assessment
</button>
```
Text-only change; keep the 💪 emoji, handler, and styles. No JS touched.

---

## #14 — "Watch Form Tutorial" links (build-ready recommendation)

Full diagnosis in `_audit_links.md`. Handler is correct; issues are in the
`exerciseMedia` data (L3044–3206). Recommendation below.

### A. DEFINITELY FIX — the one dead URL (no decision needed)
**Cable Lateral Raise**, `exerciseMedia` entry ~L3061. `yt` is a paste error
(`v=PPrzBWZDOhttps` — a truncated 11-char ID with `https` stuck on). Confirmed
dead (oEmbed → HTTP 400).
**Before:**
```js
"Cable Lateral Raise": {gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif", yt: "https://www.youtube.com/watch?v=PPrzBWZDOhttps"},
```
**After:** replace only the `yt` value with a verified cable-lateral-raise
tutorial. The original ID is unrecoverable from the corruption, so it must be
sourced and checked before commit:
```js
"Cable Lateral Raise": {gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=<VERIFIED_ID>"},
// UNVERIFIED — confirm the replacement video ID resolves (oEmbed 200) before integration
```
GIF on this entry is fine; leave it. This is a one-line, high-value fix.

### B. 69 exercises with NO media entry (no button) — **USER DECISION**
These render no tutorial button at all (the `if (media && media.yt)` guard hides
it). Not "dead," just absent. Pick one:

| Option | What | Pros | Cons |
|---|---|---|---|
| **B1. Leave as-is** | Do nothing | Zero effort/risk; no wrong content | 69 exercises stay tutorial-less |
| **B2. Alias to a close existing video** (handler-free; data only) | Add `mediaAliases` like `"Wide Grip Push-up" → "Push-up"` for the easy variants | Cheap; reuses verified URLs; fixes a big chunk fast | Some are approximations (variant ≠ exact move); doesn't cover the genuinely-novel moves (animal-flow, plyo) |
| **B3. Source new verified URLs** | Add real `exerciseMedia` entries for all 69 | Accurate, complete | Most effort; needs sourcing + oEmbed verification (UNVERIFIED until checked) |
| **B4. Generic search-link fallback** (handler change) | If no `yt`, render a "Search YouTube" link: `https://www.youtube.com/results?search_query=<name>+exercise+form` | Never dead; covers 69 + all future gaps in one code change | Touches both render sites (L3640, L5606); a search page, not a curated video |

**Recommendation (for review, not assumed):** **B2 for the obvious variants**
(fast, free, reuses verified links) **+ B4 as the long-term safety net** so any
remaining/new gaps degrade to a search link instead of a missing button.
Defer B4 to an integration build since it's the only handler change. Flag B3 as
follow-up content work. **Confirm with product before building.**

### C. 13 shared/borrowed video IDs (wrong clip, but live) — **USER DECISION**
Live links showing a generic or different movement (e.g. **Cable Squat** plays a
**Barbell Squat**; full list in `_audit_links.md` §3.C). Not dead, so lower
urgency. Pick one:

| Option | What | Pros | Cons |
|---|---|---|---|
| **C1. Leave as-is** | Accept borrowed clips | Zero effort; links work | Mild inaccuracy (e.g. cable vs barbell) |
| **C2. Fix the worst mismatches only** | Re-source the few where the movement genuinely differs (esp. Cable Squat→barbell, machine vs cable pairs) | Targeted; biggest accuracy win for least work | Still needs sourcing + verification per item (UNVERIFIED) |
| **C3. De-dupe all 13** | Unique verified video per exercise | Fully accurate | Most effort; some near-identical moves don't really need distinct clips |

**Recommendation (for review, not assumed):** **C2** — fix only the genuine
movement mismatches (Cable Squat is the clearest), leave near-equivalents (e.g.
Dumbbell vs Barbell Shrug) sharing a clip. Treat as **content polish, not a
blocker**, after A and the #16/relabel changes ship. **Confirm scope with
product.**

### #14 build order
1. **A** — fix the dead Cable Lateral Raise URL (do now; needs a verified ID).
2. **B/C** — bring options + tradeoffs above to product; do **not** assume.
   B2+B4 and C2 are the recommended directions pending that decision.

---

## Risk / blast radius summary

| Change | Files | Handler change? | Risk |
|---|---|---|---|
| #16 hide Builder slider + relax cap | `index.html` (HTML L1777–1781 + JS L5124–5140) | no (DOM + small JS) | low |
| Relabel assessment button | `index.html` (HTML L1326) | no (text only) | trivial |
| #14-A dead URL | `index.html` (data L3061) | no (one value) | trivial (needs verified ID) |
| #14-B / #14-C | `index.html` (data; B4 = handler) | B4 only | deferred — pending product decision |

— Claude (T4), 2026-06-08 15:39 (+09:30 local)
