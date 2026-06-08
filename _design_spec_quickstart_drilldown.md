# Design Spec — Quick Start Drill-Down (multi-select → preview → swap → Start)

**Author:** T2 (read-only investigation terminal)
**Date:** 2026-06-06 20:58
**Tree state:** verified against the current working tree — **v63 is live** (badge L1180; `switchTab('coach')` in `startWorkout()` at L3538; attribute-based nav highlight at L3249–3250). `exercise-metadata.js` (T3's substrate, v1.0.0) exists on disk but is **not yet loaded** by index.html.
**Status:** DESIGN ONLY — no code changed, no git run. File left untracked.

**Goal:** replace "one tap = instant random workout" with: select across dimensions → **Build** → preview the generated list → swap individual exercises → **Start**.

---

## 1. Current flow (verified, exact)

### Chip → session, step by step

| Step | Location | What happens |
|---|---|---|
| 1 | Chips **L1215–1219** (Quick Start card, Coach page) | `onclick="quickStartWorkout('push'|'pull'|'legs'|'full'|'nimble')"` — tap launches immediately, no preview |
| 2 | `quickStartWorkout(type)` **L3382–3387** | Wraps the launch in `showCheckIn(callback)` — check-in modal first |
| 3 | `_executeQuickStart(type)` **L3389–3415** | Saves global equipment → `applySessionGear(sessionGear)` (**L3369**, the gym/dumbbell/bodyweight toggles at L1207–1211) → **generates** → restores equipment → writes `appState.currentWorkoutType/currentWorkout/currentSetIndex/exerciseDone` → `saveAppState()` |
| 4a | push/pull/legs: **L3409–3411** | `startWarmup(type)` (modal overlay) + `renderWorkout(exercises)`; the workout is *revealed* later by `continueToWorkout()` **L6324** (which since v63 also calls `switchTab('coach')`) |
| 4b | everything else: **L3413** | `startWorkout(exercises)` **L3532–3544** — re-writes the same state, `switchTab('coach')` (v63, L3538), reveals `#workout-interface` (L1240, lives inside `#view-coach`), `renderWorkout()` |

### All `quickStartWorkout` callers (the programmatic API surface that must keep working)

| Caller | Location | Notes |
|---|---|---|
| 5 Quick Start chips | L1215–1219 | the only ones the drill-down should rewire |
| `generateRandomWorkout()` | **L3425–3429** (button L1225) | picks a random p/p/l type |
| `startTodaysWorkout()` | **L5516–5519** (today-banner button L1173) | launches the plan's day type |
| Consultation workout mode | **L7444** | the v63-fixed AI workout path |

`generateWorkoutByType` itself has exactly **two** callers: `_executeQuickStart` (L3395) and `_executeWedgeSession` (L3473).

---

## 2. Generation engine: `generateWorkoutByType(type, count = 6)` — L3492–3508

Current logic, in full:

1. **Category filter** (L3493–3500): single `type` string mapped to a hardcoded category test —
   `push` → cat ∩ {Chest, Shoulders, Triceps}; `pull` → cat ∩ {Back, Lats, Biceps}; `legs` → cat ∩ {Legs, Quads, Hamstrings, Glutes}; `nimble` → cat includes Nimble OR `ex.type === 'Mobility'`; `full` (and any unknown string, incl. `cardio` — audit M-01) → everything.
2. **Equipment filter** (L3503): `filterExercisesByEquipment()` **L3510–3530** — custom-equipment list OR home/hotel/gym presets; Bodyweight always passes.
3. **Pick** (L3506–3507): `filtered.sort(() => 0.5 - Math.random()).slice(0, count)` — biased shuffle (known JS anti-pattern; fine to keep for now, but the new engine should use Fisher-Yates since it's being rewritten anyway).

It is **stateless apart from `appState` equipment** and returns plain exercise objects — exactly what a preview needs. Nothing in it depends on the check-in (verified: check-in only affects warmup length, weight suggestions, rest timer), so **generation can move before the check-in without behaviour change**.

### What it takes to accept a SET of filters

The multi-dimension AND/OR filter **already exists in this codebase** — `renderBuilderExerciseList()` **L5020–5037** implements `(muscle₁ OR muscle₂) AND (equip₁ OR equip₂) AND (style₁ OR style₂)` over the same `ex.cat`/`ex.equip`/`ex.type` fields. The engine change is an *extraction*, not an invention:

```js
// NEW — single shared engine (pseudocode, target shape)
// filters = { types: ['push','pull'], muscles: ['Chest'], styles: ['Calisthenics'],
//             count: 6 }   // every array optional; empty/missing = no constraint
function generateWorkoutFromFilters(filters) {
    const TYPE_CATS = {            // single source of truth — today this map is
        push: ['Chest','Shoulders','Triceps'],   // duplicated 2× (L3494-3496 and
        pull: ['Back','Lats','Biceps'],          // _executeWedgeSession L3459-3467)
        legs: ['Legs','Quads','Hamstrings','Glutes']
    };
    // 1. pool per selected type (union), 'full' = all, 'nimble' = Nimble/Mobility test
    // 2. AND-apply muscles / styles using the L5020-5037 bucket logic verbatim
    // 3. filterExercisesByEquipment(pool)        // unchanged, L3510
    // 4. Fisher-Yates shuffle
    // 5. BALANCED DRAW: round-robin across the selected types' buckets until
    //    count reached (prevents push+pull yielding 5 push / 1 pull), dedupe by name
    return picks;
}

// KEPT — back-compat wrapper, zero call-site changes for wedge & legacy paths
function generateWorkoutByType(type, count = 6) {
    return generateWorkoutFromFilters({ types: [type], count: count });
}
```

Key points:

- **`types` becomes an array** (union of category pools); **muscles/styles are AND-narrowing** within it, identical semantics to the builder's proven filter. A muscle selection with no type selection means "filter the full DB by muscle" — same as the builder today.
- **Balanced draw** is the only genuinely new logic. Everything else is relocation.
- The wrapper keeps `_executeWedgeSession` (L3473) and any future `generateWorkoutByType` callers working untouched.
- `nimble` stays a special pool test (it keys off `ex.type`, not categories); `full` short-circuits to the whole DB.
- Empty-result handling: the builder already renders "No exercises match this exact combination. Try removing a filter." (L5057–5062) — the drill-down preview reuses the same message and **disables Start** when the pool < 1 (and warns when pool < count, since `slice` silently under-fills today).

---

## 3. Custom Workout Builder overlap — recommendation: **coexist now, converge at Phase 3**

What the builder (modal L1758–1812, logic L4923–5120) already owns:

- **Multi-select chip filtering across 3 dimensions** (`filterBuilder()` L4950–4997, state in `appState.builderFilters`) — muscles / equipment / styles, with an All-reset and empty-safety.
- The **smart AND/OR filter** (L5020–5037) the new engine needs.
- A **selection model** (`appState.selectedExercises`, capped at `appState.exerciseCount`, L5087–5103) and a launch that is already v63-correct (`startCustomWorkout()` L5112 → `startWorkout()`).
- Detail peek per exercise (`viewExerciseDetails`, L5077).

Assessment of the three options:

| Option | Verdict | Why |
|---|---|---|
| **Replace** the builder | No (yet) | Manual search-and-pick assembly is a distinct capability; preview+swap approximates but doesn't cover "I want exactly these 6". Killing a working feature in the same build that rewires the launch path doubles regression surface. |
| **Fold drill-down into the builder modal** | No | Wrong surface: Quick Start lives inline on the Coach page; burying it in a modal adds a tap and makes the chips vestigial. The builder modal is also already long (filters + search + 300px list + footer). |
| **Coexist with shared internals → converge** | **Yes** | Phase 1–2: drill-down renders inline in the Quick Start card and *shares* the extracted filter engine — zero logic duplicated (the builder's L5020–5037 block is replaced by a call to the same shared function). Phase 3: once swap + "add via search" exist in the preview, the builder's only unique value (manual assembly) lives inside the drill-down — then retire the modal and its launcher button (L1224). |

The convergence end-state: one Quick Start card = filters → Build → preview (swap / remove / add-via-search) → Start. The builder modal disappears; `startCustomWorkout`'s capped-selection model becomes the preview's data model (`appState.selectedExercises` can be reused as the preview list, which makes "Start" literally `startCustomWorkout()` — already tested, already v63-safe).

**Duplication to actively avoid in Phase 1:** do not write a second chip-multi-select implementation. Either generalise `filterBuilder()` (it's `event.target`-dependent — needs the same de-`event`-ing treatment switchTab got in v63) or write the toggle once, parameterised by a state array, and have both surfaces call it.

---

## 4. Preview + swap

### Where the preview renders

Inline in the Quick Start card, in a new container directly after the chip row (insert after the closing `</div>` of `.chip-container` at **L1220**, before the consultation/builder buttons at L1222):

```html
<div id="quickstart-preview" style="display:none;">
    <!-- one .exercise-list-item row per pick + Build/Start footer -->
</div>
```

- Reuse the `.exercise-list-item` style already used by the builder list (L5066) and its row layout (name + `cat.join(', ') • equip` small line + an icon button slot) — visual consistency for free.
- Row affordances: **swap** (⟳), **remove** (✕), and tap-to-peek via the existing `viewExerciseDetails(name)`.
- Footer: count indicator (reuse the `exercise-count-display` slider value), **Build/Rebuild** (re-runs `generateWorkoutFromFilters`, replaces the list) and **▶ Start** (runs the launch path — §5).
- The preview list lives in a module-level var (or `appState.quickstartPreview`) **separate from `appState.currentWorkout`** — nothing downstream may see a workout until Start is tapped, otherwise the M-03-style reload-resume logic and `endWorkout` semantics get confused.

### Swap mechanics — reusing `exercise-metadata.js` (T3's substrate)

Substrate facts (verified): `window.exerciseMeta[name]` covers all 163 exercises with `alternatives: string[]` (validated to resolve against `allExercises`; lower-or-differently-loaded same-pattern movements; **may be empty** — e.g. `Wall Slides`, `90/90 Hip Switch`, `Svend Press`, `Jumping Jacks`), `jointLoad`, `strainScore`, `aggravates`, `rehabCategory`. The file is standalone, self-checking (IIFE logs unresolvable names to console), and **not yet referenced by index.html** — its header says exactly that.

Swap candidate policy for exercise E (first non-empty tier wins; within a tier filter by: passes `filterExercisesByEquipment`, not already in the preview):

1. **`exerciseMeta[E.name].alternatives`** — same movement pattern, sensible by construction. Pick in listed order (the substrate orders them by relevance), or cycle on repeated taps.
2. **Same-bucket pool** — re-run the current filter set, exclude current preview names, prefer exercises sharing ≥1 category with E.
3. **Anything left in the filtered pool** (last resort; if even that's empty, disable the swap icon with a "no alternatives for your equipment" toast).

Loading consideration: Phase 3 needs the substrate in the page. Two options — **(a) `<script src="exercise-metadata.js"></script>` added after the exercise-database script block** (recommended: file is built standalone with a self-check designed to run at load; keeps ~1,200 lines out of the monolith; GitHub Pages serves it as a sibling static file; needs T3 to declare the file deploy-ready/versioned) or (b) inline-paste into index.html (consistent with the single-file philosophy but bloats it and forks T3's source of truth). Decide with T3 before Phase 3; **nothing in Phases 1–2 depends on the substrate**, and tier-2/3 of the swap policy works without it — so swap could even ship degraded if the substrate slips.

Note the substrate's `alternatives` are *pain-swap biased* (lower joint stress). For drill-down swaps ("give me something else") that bias is acceptable — same pattern, never a sillier choice — and it means this UI exercises the exact lookup the flagship Pain-Aware assistant will use later. One shared `getSwapCandidates(ex, opts)` helper should serve both.

---

## 5. Phasing & regression risk

### The new flow (end-state)

```
[type chips = toggles] [muscle/style/length filters (P2)]
        ↓ Build (no check-in yet)
[preview list — swap ⟳ / remove ✕ (P3/P1)]
        ↓ Start
showCheckIn() → warmup (if any p/p/l type selected) → session
```

Check-in moves from *before generation* (today: L3384) to *after preview, at Start* — verified safe in §2 (generation never reads check-in state).

### Phase 1 — multi-select types + Build + preview + Start (no flow breakage)

- Chips L1215–1219: `onclick` → `toggleQuickType('push')` etc.; visual `.active` toggling like the builder's chips. **This is the only call-site change.**
- New `generateWorkoutFromFilters` + back-compat `generateWorkoutByType` wrapper (§2).
- New `buildQuickstartPreview()` (Build button) and `startQuickstartWorkout()` (Start button). Start composes the **existing** launch internals: `showCheckIn(...)` → gear save/apply/restore + state writes exactly as `_executeQuickStart` L3389–3406 does → warmup branch: if ≥1 of p/p/l is selected use the **first selected** type's `startWarmup`, else `startWorkout()` directly. Set `appState.currentWorkoutType` to the single selected type when exactly one is chosen (today's behaviour, byte-identical) or the first selected type otherwise.
- **Untouched and must stay untouched:** `quickStartWorkout()` itself and its non-chip callers — Random (L3428), `startTodaysWorkout` (L5519), consultation (L7444) — plus `_executeWedgeSession`, `startCustomWorkout`. They keep the old tap-to-launch contract.
- Single-type selection + Build + Start must produce the same *kind* of result as today's chip tap (same pool, same count, same warmup) — that's the Phase 1 acceptance bar.

### Phase 2 — muscle / style / length filters

- Add muscle + style chip rows to the Quick Start card (same vocabularies as the builder: muscles {Chest, Back, Legs, Shoulders, Arms}, styles {Mobility, Nimble, Calisthenics, Plyo} — L5009–5011). Skip an equipment row: the session-gear toggles (L1207) already cover it and feed `filterExercisesByEquipment`.
- Length: the existing `exercise-count-slider` (L1191) **is** the length control; optionally display a duration estimate using the wedge heuristic (≈5 min/exercise, L3438).
- Builder's `renderBuilderExerciseList` switches to the shared filter engine (behaviour-identical refactor; its device test is "chip combos return the same counts as before").

### Phase 3 — swap (+ builder convergence)

- Load `exercise-metadata.js` (decision from §4), implement `getSwapCandidates` + the ⟳ button, then fold manual add-via-search into the preview and retire the builder modal.

### ⚠ Regression risk — this touches the launch path v63 just stabilised

- **Same functions, same region:** Phase 1 edits the chip handlers and adds a second path into `startWarmup`/`startWorkout` — the exact surfaces v63's C-03 fix changed (`startWorkout` L3538, `continueToWorkout` L6324, `switchTab` L3249). Any Phase 1 build must **re-run the full v63 device checklist** (`_fix_spec_v63_plan_access.md`, tests 1–10), not just new-feature tests — especially: consultation→workout from the Plan tab, Redo Assessment, and "Coach nav button stays highlighted after every launch".
- **Keep `quickStartWorkout` as the programmatic API.** If it gets renamed or its check-in-first contract altered, the consultation path (L7444), Random (L3428) and today-banner (L5519) silently break — that's a C-01-class regression.
- **Duplicate id hazard (audit L-04, still live):** `exercise-count-slider` exists at **L1191** (Coach, min=4) *and* **L1768** (builder modal, min=3). Any new drill-down code must not query that id (use the value via `appState.exerciseCount` instead); fixing the duplicate is a candidate rider for the Phase 1 build since this card is being edited anyway.
- **State hygiene:** the preview must not write `appState.currentWorkout` before Start (see §4); and Build must not call `applySessionGear` destructively without the save/restore dance (L3391–3399) or the user's global equipment setting gets clobbered.
- **Don't break Wedge:** it bypasses everything here via the wrapper — keep `generateWorkoutByType`'s signature and return shape identical.

### Suggested device pass (Phase 1)

1. Single chip (Push) → Build → preview shows N push exercises respecting gear toggle → Start → check-in → warmup → session on Coach tab, nav highlight correct.
2. Multi-chip (Push+Pull) → Build → roughly balanced mix → Start works; currentWorkoutType = first selected.
3. Rebuild regenerates; remove (✕) drops a row and Start launches the reduced list.
4. Bodyweight gear + Legs → pool shrinks correctly; absurd combo (e.g. future muscle filters) → "no exercises" message, Start disabled.
5. Random Workout button, Wedge buttons, today-banner Start, consultation→workout: all behave exactly as v63 (untouched paths).
6. Full v63 checklist re-run (`_fix_spec_v63_plan_access.md`).

---

**Sign-off:** T2 — 2026-06-06 20:58
