# Spec — Fitness / Redo Assessment flow (#11 + #12)

**Type:** READ-ONLY analysis. No code changed, index.html untouched, git untouched.
**Scope:** Maps the assessment flow in `index.html`, diagnoses #11 (full Coach panel renders above the active session), and proposes the #12 guided step-through. AI-dependent parts are flagged separately because they are blocked on the Gemini quota decision (free tier = 20 req/day; see backend diagnostics).

---

## 1. Function / DOM map

### Entry points
| What | Where | Notes |
|---|---|---|
| "💪 Do the Assessment" button (new-user consult) | `index.html:7450` → `startAssessment()` | Offered after consult, before plan build |
| "💪 Redo Assessment" button (Plan page) | `index.html:1325-1326` → `startAssessmentDirect()` | `startAssessmentDirect()` at `7921-7926` rehydrates `consultProfile`, sets `consultMode='plan'`, calls `startAssessment()` |

### Core functions
| Function | Lines | Role |
|---|---|---|
| `assessmentExercises` (data) | `7614-7637` | Per-equipment test list (cable / dumbbell / bodyweight). Each item: `{name, pattern, label, instruction}` — `instruction` is a single hard-coded string |
| `strengthRatios` (data) | `7640-7688` | %-of-test-weight table per movement pattern, used to seed plan weights |
| `startAssessment()` | `7693-7739` | Picks equipment key, builds `exercises[]` from `allExercises` with `_assessPattern/_assessInstruction/_assessLabel`, sets `appState.currentWorkoutType='assessment'`, `closeConsultation()`, then `startWorkout(exercises)` |
| `patchRenderWorkoutForAssessment()` | `7744-7802` | Monkey-patches `window.renderWorkout`: after the normal render, injects an `.assess-instruction` div into `.exercise-card` and an `.assess-progress-wrap` bar into the container |
| `getPatternLabel()` | `7804-7811` | Emoji label for a movement pattern |
| `patchFinishWorkoutForAssessment()` | `7816-7863` | Wraps `window.finishWorkout`: on assessment finish, `buildStrengthProfile()`, record completed workout, reset state, `switchTab('plan')`, re-open consult to offer "Build My Plan" |
| `buildStrengthProfile()` | `7865-7893` | Reads `exerciseHistory`, takes heaviest set per test exercise → `localStorage.strengthProfile` |
| `getEstimatedWeight()` | `7895-7914` | Maps any exercise → estimated working weight via `strengthRatios` × profile |
| patches initialised | `7917-7918` | `patchRenderWorkoutForAssessment(); patchFinishWorkoutForAssessment();` at load |

### Shared workout engine (reused by assessment)
| Function | Lines | Role |
|---|---|---|
| `startWorkout(exercises)` | `3561-3573` | `switchTab('coach')` → `#workout-interface` `display:block` → `scrollIntoView` → `renderWorkout()` |
| `renderWorkout(exercises)` | `3578-…` | Renders progress bar, collapsed done-exercises, and the full active `.exercise-card` (GIF, YouTube, how-to, set logging) into `#workout-list` |
| `switchTab(tab)` | `3271-3286` | Toggles `.container.active`; **no special-case for `coach`** |
| `endWorkout()` | `3974-3987` | Confirms, hides `#workout-interface`, clears state, RPE modal |
| `finishWorkout()` | `3989-…` | Normal completion; hides `#workout-interface`, RPE modal |

### DOM structure of the Coach tab (`#view-coach`)
```
#view-coach  (container, line 1177)            ← the tab
 ├─ <div class="card">  (lines 1183-1238)      ← "Quick Start" = the full Workout Coach panel
 │     • Exercises-per-workout slider (1186-1204)
 │     • Equipment toggles            (1206-1211)
 │     • Workout Type chips           (1213-1220)
 │     • AI Consultation / Custom Builder / Random (1222-1226)
 │     • Wedge Session buttons        (1228-1237)
 └─ <div id="workout-interface" style="display:none"> (1240-1246)  ← "Active Session"
        ├─ <h3>Active Session</h3> + End button (1241-1244)
        └─ <div id="workout-list"></div>          ← renderWorkout target
```

---

## 2. Current behaviour

1. User triggers an assessment → `startAssessment()` builds the 5–6 test exercises and calls `startWorkout()`.
2. `startWorkout()` switches to the Coach tab, sets `#workout-interface` visible, and scrolls to it.
3. `renderWorkout()` (patched) renders the standard active-exercise card into `#workout-list`, then the assessment patch prepends a static instruction line + a "X/total exercises" progress bar.
4. The user logs sets exactly like a normal workout. On finish, `buildStrengthProfile()` runs and the plan-build consult re-opens.

**The assessment card today = the generic workout card + one static `instruction` string + a progress bar.** There is no per-set guidance, no step states, no orientation screen — just "log your sets normally."

---

## 3. Root cause — #11 (full Coach panel renders ABOVE the active session)

**The Quick Start panel is never hidden when a session starts.**

- `startWorkout()` (`3561-3573`) only sets `#workout-interface` to `display:block`. It does **not** touch the Quick Start `.card` at `1183`.
- That `.card` lives inside the same `#view-coach` container and **sits before** `#workout-interface` in DOM order (line 1183 < line 1240). So once the session is visible, the running session renders *below* the still-visible slider/equipment/type/consult/Wedge panel.
- `scrollIntoView()` (`3569`) scrolls down to the session, masking the issue on launch — but the whole Coach panel is still there as soon as the user scrolls up, and on shorter content / after layout it shows above the session.
- The teardown side confirms the asymmetry: `endWorkout()` (`3980`) and `finishWorkout()` (`3998`) hide `#workout-interface` but, again, never touched the Quick Start card — because it was never hidden in the first place.

**Not assessment-specific.** Every launcher has the same bug — `quickStartWorkout` path, `startTodaysWorkout` (`3838`), `startWedgeSession` (`6362`) — all set `#workout-interface` visible without hiding Quick Start. It is most jarring in the assessment because that flow is meant to be a focused, guided sequence.

### Fix for #11 (non-AI, structural)
Show **only** the active session while a workout is live:

- **Option A (minimal, recommended):** give the Quick Start `.card` (line 1183) an id, e.g. `id="quickstart-panel"`. In `startWorkout()` set `quickstart-panel` `display:none` alongside showing `#workout-interface`; in `endWorkout()` + `finishWorkout()` restore it to `display:block`. Fixes all launchers at once (they all funnel through these three functions).
- **Option B:** wrap the launcher card and the session in mutually-exclusive views and toggle a single state flag, so "setup vs in-session" is one source of truth rather than two independent `display` toggles. Cleaner long-term; larger diff.
- Edge cases to cover: restoring on `endWorkout` cancel (the `confirm()` returns false → panel must stay hidden, session stays); and `switchTab` away/back during a live session (currently `switchTab('coach')` would re-show the tab with both visible — the show/hide should be driven by "is a workout active", e.g. `appState.currentWorkout`, not by tab switching alone).

All of #11 is non-AI.

---

## 4. Proposed guided flow — #12 (detailed, coach-led step-through)

Goal: replace the "generic card + one static blurb" with a focused, step-by-step assessment experience. Below, **structural** items need no model; **[AI]** items are blocked on the Gemini quota decision and should ship behind a flag / degrade gracefully to the structural version.

### 4a. Non-AI structural changes (can build now)

1. **Orientation / intro card (new).** Before exercise 1, a card explaining the assessment: how many movements, ~time, what "find your working weight" means, and "stop any exercise that hurts." Today this is only a toast (`7738`). Render it as the first state of the assessment view.

2. **Dedicated assessment render path instead of DOM injection.** The current monkey-patch (`7756-7801`) appends to the generic card after the fact, which is fragile (depends on `.exercise-card` existing, re-queries DOM, re-inserts a progress bar each render). Replace with a first-class `renderAssessmentExercise()` that owns the card layout when `assessmentInProgress` is true. Pure refactor of existing behaviour; no new copy required.

3. **Per-set step state machine.** Drive the card from `appState.currentSetIndex[exname]` (already tracked) against a target set count. Render explicit states: `Set 1 of 3 → Set 2 of 3 → Set 3 of 3 → ✓ Done, next: <label>`. Today there is no per-set framing — it's just the generic logger.

4. **Structured per-set cues (data restructure).** Split the single `instruction` string (`7616-7635`) into deterministic per-set cues, e.g.:
   - Set 1: "Pick a weight you could do ~12 times. This is calibration."
   - Set 2: "Add 10–20%. Aim for 8–10 solid reps."
   - Set 3: "Top set — last 2 reps should be hard but clean. This sets your number."
   These are fixed rules keyed off set index + pattern, not personalised, so **no AI needed.** Keep the existing free-text `instruction` as a fallback/summary line.

5. **Deterministic "what next" weight nudge.** After a logged set, a rules-based hint ("that looked submaximal → go up next set" vs "near failure → hold"). Can be derived from reps vs target (e.g. reps ≥ 12 → suggest +weight). **Rules-based = non-AI**; only the conversational phrasing is the AI upgrade (see 4b).

6. **Next-exercise preview + clearer transition.** Show the upcoming movement + its pattern badge (`getPatternLabel`) so the sequence feels guided, not a flat list.

7. **Keep/relocate the progress bar** (already exists, `7794-7800`) into the dedicated render path so it isn't re-inserted on every render.

8. **Pairs with #11:** because the assessment is the focus, the Quick Start panel must be hidden (see §3) — these two land together for the assessment to read as a guided flow rather than a sub-section of the Coach page.

### 4b. AI-driven coaching copy — **[AI] blocked on Gemini quota decision**

1. **[AI] Adaptive per-set feedback in natural language.** Using what the user just logged ("12 × 20 kg looked easy — jump to 25 kg and aim for 8"). The deterministic nudge in 4a/5 is the non-AI floor; this is the conversational, individualised layer.
2. **[AI] Personalised form cues** tailored to the user's stated injuries / history (ties into the rehab red-flag work; must respect the not-a-doctor constraints).
3. **[AI] End-of-assessment narrative summary.** Turn the `strengthProfile` (`buildStrengthProfile`, `7865`) into a plain-language read: relative strengths/weaknesses across patterns and what it means for the plan. Today the handoff is a single canned line (`7851`).
4. **[AI] Dynamic encouragement / pacing** between exercises.

All four degrade cleanly: if the Gemini budget is unavailable, the assessment still runs fully on the structural layer (orientation card, step states, fixed per-set cues, rules-based nudges, deterministic profile). The AI layer is purely additive.

---

## 5. Summary

- **#11 root cause:** Quick Start `.card` (`index.html:1183`) is never hidden; `startWorkout()` (`3561`) only reveals `#workout-interface` (`1240`), which sits below it in DOM order. Fix = hide that card on workout start, restore on end/finish (Option A). Affects all launchers, not just assessment. **Non-AI.**
- **#12:** Current assessment card = generic workout card + one static instruction + progress bar (patched in at `7744-7802`). Proposed guided step-through is mostly **non-AI** (orientation card, dedicated render path, per-set step states, structured per-set cues, rules-based weight nudges, next-exercise preview). The **[AI]** layer (adaptive feedback, personalised form cues, narrative result summary) is additive and **blocked on the Gemini quota decision** — the structural flow stands alone without it.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 14:58 AEST (04:58 UTC). Read-only: no code changes, index.html and git untouched.*
