# Spec — Assessment guided step-through, NON-AI structural layer (#12)

**Type:** READ-ONLY analysis / build-ready design. No `index.html` edits, no git commands. One spec file.
**Refines:** `_spec_assessment.md` §4a into an implementation-ready structural layer. The AI layer (`_spec_assessment.md` §4b) is **explicitly out of scope** here — see §7.
**Scope:** four deliverables — (1) orientation card, (2) dedicated `renderAssessmentExercise()` replacing the monkey-patch, (3) per-set step states + deterministic per-set cues, (4) rules-based weight nudges + next-exercise preview. All deterministic; zero model calls.

---

## 0. Engine facts this design relies on (verified)

| Fact | Evidence |
|---|---|
| `appState.currentSetIndex[name]` = count of sets logged for an exercise; incremented on each log | `logSet()` `index.html:3823-3824` |
| `appState.exerciseDone[name]` = bool; set **only** by the user tapping "Next Exercise →" | `skipExercise()` `index.html:3839` |
| **No auto-advance**: logging the Nth set does not complete the exercise — the engine waits for a manual skip | `logSet()` `:3810-3835` (no done-flag write) |
| Both `logSet()` and `skipExercise()` re-render via `renderWorkout(appState.currentWorkout)` | `:3827`, `:3841` |
| Generic render already builds: progress bar, completed-minis, active card (GIF/yt/how-to/Smart Spotter), `set-active` input, and an "Up Next" dimmed list | `renderWorkout()` `:3578-3808` (Up Next `:3774-3787`) |
| Assessment builds exercises carrying `_assessPattern / _assessInstruction / _assessLabel`; `assessmentExerciseList` holds `{name,pattern,label,instruction}` | `startAssessment()` `:7707-7717`; data `:7614-7637` |
| Current assessment UI is a **monkey-patch**: wraps `window.renderWorkout`, then injects `.assess-instruction` + re-inserts `.assess-progress-wrap` each render | `patchRenderWorkoutForAssessment()` `:7744-7802`, init `:7917` |
| Pattern → emoji label helper exists | `getPatternLabel()` `:7804-7811` |

**Implication for step states:** because there is no auto-advance, the step machine must itself detect "target sets reached" and switch the card into a *complete* state whose primary CTA advances — otherwise a user who logs 3/3 sets sees an unchanged "Set 4" input.

---

## 1. Integration — one dispatch point, monkey-patch removed

**Remove** `patchRenderWorkoutForAssessment()` (`:7744-7802`) and its init call (`:7917`); stop wrapping `window.renderWorkout`.

**Add** a single guard at the top of `renderWorkout()` (`:3578`):
```
function renderWorkout(exercises) {
    if (assessmentInProgress) return renderAssessmentWorkout(exercises);   // <-- new dispatch
    /* …existing generic body unchanged… */
}
```
Because `logSet()` and `skipExercise()` already call `renderWorkout(appState.currentWorkout)`, every re-render during an assessment routes to the dedicated renderer automatically — no DOM re-query, no second pass, no per-render re-insertion. This is the entire wiring change; the generic path is untouched for normal workouts.

> Rationale vs. today: the monkey-patch runs *after* the generic render, re-queries `.exercise-card`, and rebuilds the progress bar on every call (`:7791-7800`). A dedicated renderer owns the markup once and is not order-dependent.

---

## 2. `renderAssessmentWorkout(exercises)` — container orchestrator

Mirrors the generic container structure but assessment-flavoured. Pseudostructure:

```
renderAssessmentWorkout(exercises):
    container = #workout-list ; container.innerHTML = ''
    done   = exercises.filter(e => exerciseDone[e.name]).length
    currentIdx = first index where !exerciseDone[name]  (== exercises.length when all done)

    1. progress header  → "Fitness Assessment  ·  {done}/{total} movements" + bar   (replaces .assess-progress-wrap)
    2. if (isFreshStart(exercises)) → append renderAssessmentIntro(exercises); return   (§3)
    3. completed movements (collapsed minis, reuse existing mini style :3610-3615) with recorded top number
    4. if (currentIdx < total) → append renderAssessmentExercise(exercises[currentIdx], currentIdx, exercises)   (§4–§6)
    5. else → append completion CTA (reuse finishWorkout button :3794-3799)
```

`isFreshStart(exercises)` = `Object.keys(exerciseDone).length === 0 && exercises.every(e => !(currentSetIndex[e.name] > 0))`.

---

## 3. Orientation / intro card  — `renderAssessmentIntro(exercises)`

Shown once, before exercise 1 (replaces today's toast-only intro `:7738`). Pure static copy + data already in `assessmentExerciseList`.

Content:
- **Title:** "Fitness Assessment"
- **Sub:** "{N} movements · about 15 min · we find your working weights so every plan starts at the right load."
- **Movement list:** for each `assessmentExerciseList[i]` → `getPatternLabel(pattern)` badge + `label`.
- **Safety line (static):** "Stop any movement that causes sharp pain, numbness, or pain that radiates — skip it and note it." *(plain copy; not the AI rehab layer)*
- **CTA:** "Start Assessment →" → sets a flag / logs nothing, just calls `renderAssessmentWorkout` again which now falls through to the first exercise. (Simplest: a module-level `assessmentIntroSeen` boolean flipped by the button, checked in `isFreshStart`.)

```
┌────────────────────────────────────────────┐
│ Fitness Assessment                          │
│ 6 movements · ~15 min · find your weights   │
│                                             │
│ ↔️ Chest Press     ⬆️ Shoulder Press        │
│ ↔️ Seated Row      ⬇️ Lat Pulldown          │
│ 🦵 Cable Squat     🔗 Pull-Through          │
│                                             │
│ ⚠ Stop anything that hurts — skip & note.   │
│            [ Start Assessment → ]           │
└────────────────────────────────────────────┘
```

---

## 4. Per-exercise card — `renderAssessmentExercise(exercise, idx, exercises)`

Owns the active-card markup for the current movement. Sections, top to bottom:

1. **Pattern header:** `getPatternLabel(pattern)` badge + `label` + "Movement {idx+1} of {total}".
2. **Media/how-to:** reuse existing GIF/YouTube/`guide` blocks (`:3631-3653`) — same helpers, no change.
3. **Step state block** (§5) — set chips + the current set's deterministic cue.
4. **Set input** — reuse the `set-active` input markup (`:3750-3768`): weight/reps fields, `logSet(name, idx)`, and the manual `skipExercise(name)` button relabelled per state (§5).
5. **Post-set nudge** (§6) — rules-based, shown after a set is logged.
6. **Next-exercise preview** (§6) — focused "Next: …" rather than the full dimmed list.

The card reuses `logSet()`/`skipExercise()` **unchanged** — the structural layer is presentation only; it reads `currentSetIndex`, never writes engine state.

---

## 5. Step states + deterministic per-set cues

### 5a. Set plan (target count + cues) — `assessmentSetPlan(exercise)`
The single `instruction` string (`:7616-7635`) is replaced *for display* by a deterministic plan derived from the exercise's metadata. Two ways to source it — pick one in build:

- **Option A (no data-file change):** a helper classifies by `logMode`/equipment + name:
  - **Loaded (weight_reps, e.g. cable/DB):** `targetSets = 3`, ramping cues (5b).
  - **Bodyweight max-rep test (Push-ups, Pull-ups, Inverted Row, Dips):** `targetSets = 1`, single all-out cue.
  - **Bodyweight rep/endurance (BW Squat 20, Lunge 10/leg):** `targetSets = 1`, hit-the-target cue.
- **Option B (recommended, small data shape change in a later build task):** extend each `assessmentExercises` entry with explicit `sets` and `cues: [..]`, keeping legacy `instruction` as a one-line fallback/summary. Cleaner and authorable; flagged as the follow-up.

> This spec specifies the behaviour; Option A makes it shippable with **zero** edits to the `assessmentExercises` data.

### 5b. Deterministic cues — loaded 3-set ramp (splits the one instruction into 1/2/3)
| set index | label | cue (static) |
|---|---|---|
| 1 | Calibration | "Pick a weight you could do ~12 times. We're finding your baseline — leave reps in the tank." |
| 2 | Build | "Add ~10–20%. Aim for 8–10 solid reps with clean form." |
| 3 | Top set | "Last working set — the final 2 reps should be hard but clean. This is the number we record." |

Bodyweight max-rep (1 set): "One all-out set. Max clean reps, full range. Log reps with weight = 0."
Bodyweight endurance (1 set): "Bodyweight test — hit the rep target with good form; stop if it breaks down."

### 5c. Step state machine (driven by `currentSetIndex[name]` vs `targetSets`)
Let `c = currentSetIndex[name] || 0`, `T = plan.targetSets`.

- **`c < T` → ACTIVE(set c+1):** render set chips `[① done][② done][③ ←now][…]`; show cue for set `c+1`; input header "Set {c+1} of {T}"; primary CTA = **Log Set**; secondary = "Skip movement →".
- **`c >= T` → READY-TO-ADVANCE:** all chips filled; hide weight/reps input; show recorded top number (§6); primary CTA becomes **"Done — Next movement →"** (calls existing `skipExercise(name)`); cue = "All sets in. Tap next when you're ready." This is the state the engine cannot reach on its own (no auto-advance) and is the key UX fix.

Set chips example (T=3, c=2): `①✓  ②✓  ③●`  → after 3rd: `①✓ ②✓ ③✓  → Next`.

---

## 6. Rules-based weight nudge + next-exercise preview

### 6a. Post-set nudge — `assessmentNudge(exercise, lastSet, setIndex, plan)` (deterministic)
Computed from the just-logged `{weight, reps}` (read via `getTodaysSetData(name)` `:3854-3858`) against a rep band — **pure rules, no model.**

For loaded movements, non-final set:
| logged reps | nudge |
|---|---|
| ≥ 12 | "That looked submaximal — add ~5–10% next set." |
| 8–11 | "Good working range — repeat or nudge up slightly." |
| ≤ 7 | "Heavy — hold this weight or drop a touch next set." |

Final/top set (loaded): "Recorded: {weight}{unit} × {reps}. That's your number for {pattern}."
Bodyweight: "Recorded {reps} reps." (no weight nudge; weight = 0).

These map 1:1 onto the per-set state and are shown in the post-set nudge slot (§4.5). The *conversational, individualised* rewrite of these lines is the AI version — **parked** (§7).

### 6b. Next-exercise preview
Replace the generic full "Up Next" list (`:3774-3787`) with a single focused preview under the active card:
```
Next: {getPatternLabel(nextPattern)}  {nextLabel}
```
where `next` = first index `> currentIdx` with `!exerciseDone`. On the last movement show "Last movement — finish to build your profile." Keeps the guided, one-thing-at-a-time feel.

---

## 7. Explicitly OUT of scope — parked on the Gemini decision

The following stay in `_spec_assessment.md` §4b and are **not** part of this structural layer:
- **NL adaptive feedback** — conversational per-set coaching beyond the fixed rules in §6a.
- **Personalised form cues** — history/injury-aware cueing.
- **End-of-assessment narrative summary** — natural-language read of the `strengthProfile` built by `buildStrengthProfile()` (`:7865-7893`). The structural completion CTA (§2.5) and existing handoff (`:7838-7857`) stand without it.

Everything in §1–§6 runs fully offline; the AI layer is purely additive on top.

---

## 8. Build checklist (structural only)

1. Delete `patchRenderWorkoutForAssessment()` + init (`:7744-7802`, `:7917`); remove `window.renderWorkout` wrapping.
2. Add dispatch guard in `renderWorkout()` (`:3578`) → `renderAssessmentWorkout(exercises)`.
3. Implement `renderAssessmentWorkout()` (§2), `renderAssessmentIntro()` (§3), `renderAssessmentExercise()` (§4).
4. Implement `assessmentSetPlan()` (§5a Option A) + cue tables (§5b) + state machine (§5c).
5. Implement `assessmentNudge()` (§6a) + focused next preview (§6b).
6. Reuse unchanged: `logSet`, `skipExercise`, `getTodaysSetData`, `getPatternLabel`, GIF/yt/guide blocks, finish button.
7. No changes to engine state writes, to the `assessmentExercises` data (Option A), or to non-assessment rendering.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 16:48 AEST (06:48 UTC). Read-only: no index.html edits, no git commands.*
