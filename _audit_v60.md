# Nimble Shred v60 — Code Audit (Read-Only)

**Date:** 2026-06-06
**Scope:** `index.html` (8,503 physical lines, 3 inline script blocks) — full read, all flows traced in code. No app changes made.
**Method:** Full file read → structure map → end-to-end flow tracing → Node syntax check (in-memory, no files written) → targeted verification greps.

**Integrity baseline:** All 3 script blocks parse clean (`new Function()` OK). **163 exercises** load (not 164 — see L-03). Equip split: Cable 56, Dumbbell 28, Bodyweight 77, Free Weight 2. No JS errors expected on load or tab switch in normal use.

---

## CRITICAL

### C-01 — A "plan" consultation silently produces a single random workout
- **Area:** Coach Consultation → plan generation (user-reported issue #1)
- **What's wrong:** The user finishes a consultation expecting a plan, taps **"✨ Build My Plan"**, and instead gets a check-in modal and a *single random workout*. No plan is ever written to `currentPlan`, so the Plan tab shows nothing new. This is the exact "I made a plan and can't find it anywhere" failure.
- **Location:** `generateFromConsultation()` ~L7362–7435, decision at **L7379** `if (consultMode === 'plan')`; `showGenerateButton()` ~L7325; `startConsultation()` ~L7103.
- **Trace of the break:**
  1. All 3 entry points (Coach L1223, Plan L1322, Settings L1497) call `startConsultation()` with no argument → `consultMode = 'undecided'`.
  2. Mode only becomes `'plan'` if Gemini emits `"mode":"plan"` inside a parseable `[PROFILE]` JSON block (`callConsultAI()` L7236). If the AI omits it, malforms the JSON (parse failure is just `console.warn`, L7281), or misclassifies, mode stays `'undecided'`.
  3. `showGenerateButton()` still shows a button labelled **"Build My Plan"** for any non-'workout' mode (L7339–7345).
  4. `generateFromConsultation()` branches `if (consultMode === 'plan')` — **`'undecided'` falls into the ELSE (workout) branch**. The chat even says "Building your personalised **training plan**…" (L7363) while requesting *workout* JSON (L7388).
  5. Workout branch then calls `quickStartWorkout(result.type || 'full')` (L7433) — **the AI's chosen exercises (`result.exercises`) are discarded entirely** and a random workout of that type is generated instead.
  6. `localStorage.currentPlan` is only written at L7419, inside the plan branch — never reached.
- **Root-cause hypothesis:** v59 changed mode from caller-supplied to AI-inferred three-state (`undecided/workout/plan`), but `generateFromConsultation()` kept a binary check. `'undecided'` was never given a branch.
- **Suggested fix:** Invert the check (`consultMode === 'workout' ? workout : plan`), or hard-block generation while mode is `'undecided'` (force a "Plan or workout?" tap-choice in the UI rather than trusting the AI to set it). Separately: use `result.exercises` in the workout branch (map names against `allExercises`, fall back to type-generation for misses).
- **Risk:** Low — confined to one function + button label; happy path (`mode==='plan'`) unchanged.

### C-02 — Sets with weight 0 cannot be logged → bodyweight exercises and bodyweight assessment are blocked
- **Area:** Set logging / Fitness Assessment
- **What's wrong:** `logSet()` validates `if(!weight || !reps)` — `parseFloat('0') === 0` is falsy, so **weight 0 is rejected** with "Enter weight and reps". All 77 bodyweight exercises require a fake weight to log. Worse, the bodyweight assessment track explicitly instructs *"Log reps with weight as 0"* (L7527–7531) — following the app's own instructions makes the assessment impossible to complete; the strength profile can't be built on that track.
- **Location:** `logSet()` **L3773–3780**; assessment instructions `assessmentExercises.bodyweight` L7526–7532.
- **Root-cause hypothesis:** Truthiness shortcut written for weighted exercises; the v60 assessment instructions were authored against the intended behaviour, not the actual validator.
- **Suggested fix:** Validate `isNaN(weight) || !reps` (reps must still be ≥1). Optionally hide/default the weight field for `equip === 'Bodyweight'`.
- **Risk:** Low — one condition; re-test normal weighted logging (empty input parses to NaN → still rejected).

### C-03 — Workouts/assessments started from the Plan or Settings tab render into a hidden container (dead-end)
- **Area:** Navigation / active workout flow
- **What's wrong:** `#workout-interface` lives inside `#view-coach` (L1240). `startWorkout()` sets it visible and scrolls to it but **never switches to the Coach tab**. The consultation (with its workout mode), and "Redo Assessment", are launched from the **Plan** and **Settings** tabs. Result: the modal closes, the check-in modal appears, the user picks a feeling… and then *nothing visible happens* — the workout is rendering inside a `display:none` container. Combined with C-01, this completes the user's "it vanished" experience.
- **Location:** `startWorkout()` **L3534–3545** (no `switchTab('coach')` — confirmed zero programmatic calls to it anywhere); `startAssessment()` L7589–7635; consultation workout path L7431–7434; `startAssessmentDirect()` L7817 (button on Plan page, L1325).
- **Root-cause hypothesis:** All original workout triggers lived on the Coach tab; v58–v60 added cross-tab entry points without adding a tab switch.
- **Suggested fix:** Call `switchTab('coach')` (and sync the nav-button highlight) at the top of `startWorkout()`.
- **Risk:** Low — one line plus nav-highlight handling (see L-10).

---

## HIGH

### H-01 — lbs/kg: no unit system exists at all; labels are internally contradictory
- **Area:** Units (user-reported issue #2)
- **What's wrong:** Searched the entire file: there is **no** `weightUnit`/unit setting, no toggle, nothing in `appState`, Settings UI, or storage. Units are hardcoded and *inconsistent*:
  - Live set log shows **"lbs"**: completed set row L3704, input label "Weight (lbs)" **L3717**.
  - Strength profile card shows **"lbs"**: L5313.
  - Workout History editor shows **"kg"**: **L4178**.
  - Cardio/GPS use km (metric) throughout; locale is `en-AU`.
- **Verdict:** Not half-built and not toggle-regressed *within this file* — the feature is **absent**. The "lbs" strings arrived with the Smart Spotter / one-exercise-at-a-time rewrite (v53–v55 per build log); if the user remembers choosing kg, that capability predates v51 and never survived the rewrite. Numbers themselves are unit-agnostic (stored raw), so only labels lie.
- **Location:** L3704, L3717, L4178, L5313.
- **Suggested fix (do not build yet, per audit scope):** Phase 1 — change the three "lbs" labels to "kg" for consistency (display-only, zero data risk). Phase 2 — proper `appState.weightUnit` setting + label indirection; **no value conversion** of stored history (treat stored numbers as entered).
- **Risk:** Phase 1 trivial. Phase 2 medium (touches every weight render; conversion of historical data should be explicitly avoided).

### H-02 — Set inputs don't carry forward the just-logged weight/reps (user-reported issue #3)
- **Area:** Set logging ergonomics
- **What's wrong:** After `logSet()` the card re-renders and the next set's inputs are pre-filled from `getProgression()` — which **only looks at past sessions** (`pastDates` excludes today, L3851) or the assessment estimate, else `0`. Consequences:
  - If the user adjusted the weight away from the suggestion (e.g. suggestion 20, lifted 25), set 2 resets to **20** — every set.
  - For an exercise with no history and no profile match, weight pre-fills **0** every set — the user re-types the weight for every single set (and with C-02, tapping Log Set on the 0 default just alerts).
- **Current behaviour confirmed:** prefill source is `progression.suggestedWeight/suggestedReps` at **L3710–3712**, injected at L3713–3724; `logSet` L3773 → `renderWorkout` L3790 recomputes the same suggestion.
- **Exact hook point for a fix (described only):** In `renderWorkout()`, today's sets are *already in scope* as `setData` (L3596, from `getTodaysSetData`). Pre-fill priority should be: `setData[setData.length-1]` (last logged set today) → `progression.suggestedWeight` → estimate → blank. ~3 lines at L3710–3712.
- **Risk:** Low — read-only data already fetched; no storage change.

### H-03 — Plan-generation failure is a dead-end with a lying error message
- **Area:** Consultation error recovery
- **What's wrong:** When Gemini returns invalid JSON (known issue per project notes), the catch says *"…closing this and using your profile to set up a standard plan"* — but it **does not close anything and sets up no plan**. It then shows bubbles `['Try again', 'Close']`, and `bubbleClick()` just **sends those words as chat messages to the AI** — 'Close' doesn't close, 'Try again' doesn't re-run `generateFromConsultation()`; it re-enters the interview loop, where the generate button only re-appears if the AI re-emits `ready:true`.
- **Location:** `generateFromConsultation()` catch **L7437–7441**; `bubbleClick()` L7168–7171. Same pattern in `callConsultAI()` catch L7258–7259 (benign there, since retry-as-message works for conversation).
- **Root-cause hypothesis:** Bubbles were designed as conversational answers; error-recovery actions were bolted onto the same mechanism.
- **Suggested fix:** Render real buttons in the catch: one re-invoking `generateFromConsultation()`, one calling `closeConsultation()`. Optionally a deterministic local fallback plan (the old `schedules` table at L5436 already exists).
- **Risk:** Low.

### H-04 — Old "New Plan" generator broken by `acceptPlan` redefinition (v58 regression)
- **Area:** Plan tab → "New Plan" 3-step generator
- **What's wrong:** `acceptPlan()` is defined twice. The v58 back-compat shim at **L7503** (`closeConsultation(); switchTab('plan'); renderPlanCalendar();`) overrides the original at **L5475** (`saveAppState(); closePlanGenerator(); …`). So "Accept & Start" in the generator modal: doesn't close the generator modal (closes the *consultation* modal, which isn't open), and **never saves `appState`** — the plan applied in memory by `selectGoal()` (L5450) is lost on reload (unless some later action incidentally calls `saveAppState`).
- **Location:** L5475 vs **L7503** (later declaration wins); button L1917.
- **Root-cause hypothesis:** v58 added the shim without checking the name was taken.
- **Suggested fix:** Rename the shim (it's only needed for legacy paths) or delete it and keep the original; alternatively retire the old generator entirely now the consultation exists.
- **Risk:** Low.

### H-05 — Cloud sync doesn't sync the data the app actually uses
- **Area:** Cloud sync / Supabase
- **What's wrong (three compounding problems):**
  1. Restore path writes to orphaned keys: `loadFromCloud()` writes `localStorage 'workouts'` and `'training_plan'` (**L7041–7059**) — **no UI code reads either key** (verified: only L7046/7050/7053/7065/7067 reference them). Multi-device restore is a no-op.
  2. The app's real data — `exerciseHistory` (every set ever logged), `rpeHistory`, `consultProfile`, `strengthProfile` — is **never synced at all**.
  3. What *is* pushed is junk: `markDayCompleted()` builds the cloud record from `appState.currentWorkout?.type / .exercises` (**L3980–3987**) — but `currentWorkout` is an **array**, so every cloud workout has `type:'unknown', exercises:[]`.
- **Root-cause hypothesis:** Cloud layer was written against an older data model and never re-pointed when the workout/state model changed (~v53).
- **Suggested fix:** Sync the five real keys (push on save, merge on load); fix the record builder to use `appState.currentWorkoutType` and the exercise list.
- **Risk:** Medium-high — storage/merge logic; needs careful conflict strategy and on-device testing.

### H-06 — Entire Cardio page unreachable; saving a GPS route throws `ReferenceError`
- **Area:** Cardio / GPS
- **What's wrong:** `#view-cardio` (L1378–1413: live GPS tracking, quick-log cardio, history) has **no nav button** and zero `switchTab('cardio')` calls — the page is dead/orphaned (nav has 5 buttons; cardio isn't one, L1740–1756). Additionally `saveGpsRoute()` calls **`renderCardioHistory()` which does not exist** (**L6178**; the real function is `loadCardioHistory`) — route data is saved and the modal closes first, then a `ReferenceError` lands in console.
- **Root-cause hypothesis:** Nav was rebuilt (v55 SVG migration) and the cardio button was dropped; the function was renamed without updating this call site.
- **Suggested fix:** Decide: restore a nav entry (6 tabs is crowded) or fold quick-log cardio into Coach/Recovery and delete the rest. Fix the call to `loadCardioHistory()`.
- **Risk:** Low (call rename) / Medium (navigation redesign).

---

## MEDIUM

### M-01 — Planned "cardio" day starts a random strength workout
`generateWorkoutByType()` (L3494–3502) has no `cardio` branch; the fallthrough `return true` selects from **all** exercises. Today's banner shows "Planned: CARDIO" → Start Workout → check-in → 6 random strength/mobility exercises. **Fix:** route cardio days to the (currently dead, H-06) cardio logger or show a "log cardio manually" card. Risk: low.

### M-02 — RPE context written to the wrong chat key (silent failure)
`addAIContextMessage()` writes to `localStorage 'chatHistory'` (**L4070–4076**); the chat system reads/writes `'chat_history'` (L8025/L8038). Session RPE context never reaches the AI coach; the orphan key grows forever. Root cause: naming drift between two authoring sessions. **Fix:** point `addAIContextMessage` at the chat system (`addAIMessageToChat` or the right key, with role-filtering already in place at L8253). Risk: low.

### M-03 — In-progress workout lost from view on reload
`appState.currentWorkout` persists, but `window.onload` (L3203–3211) never re-shows `#workout-interface` or re-renders it. After an accidental refresh mid-session, the workout looks gone (data intact). **Fix:** on load, if `currentWorkout?.length`, re-show + `renderWorkout`. Risk: low.

### M-04 — "Export All Data" / "Export Workout History" export almost nothing
`exportAllData()` exports only `completedWorkouts` (a date→true map) + `currentPlan`; `exportWorkoutHistory()` exports only `completedWorkouts` (**L7883–7893**). No `exerciseHistory` (the actual sets/weights/reps), no `rpeHistory`, `strengthProfile`, `consultProfile`. A user relying on this backup would lose everything that matters. **Fix:** include all real keys; add an import path. Risk: low.

### M-05 — ~20 `strengthRatios` keys don't match database exercise names
Assessment extrapolation (`getEstimatedWeight`, L7791) looks up exact names; mismatches return null silently → no starting-weight prefill for those exercises. Examples (ratio key → actual DB name): `Diamond Push-ups`→`Diamond Push-up`, `Tricep Dips`→`Dips`, `Bench Dips`→`Bench Dip`, `Close-Grip Push-ups`→`Close Grip Push-up`, `Skull Crushers (DB)`→`Skull Crusher (DB)`, `Dumbbell Kickback`→`Tricep Kickback`, `Lateral Raise (DB)`→`Lateral Raise`, `Front Raise (DB)`→`Front Raise`, `Pike Push-ups`→`Pike Push-up`, `Step-ups (DB)`→`DB Step Up`, `Good Mornings (DB)`→`Good Morning (BW)`, `Glute Bridge (BW)`→`Glute Bridge`, plus entries with no DB counterpart (`Upright Row (DB)`, `Handstand Push-ups`, `Hip Thrust (BW)`, `Wall Sit`, `Wide Push-ups`, `Decline Push-ups`, `Overhead Tricep Extension (DB)`, `Single Leg Deadlift (DB)`). Location: **L7536–7584**. **Fix:** rename keys to exact DB names (pure data edit). Risk: low.

### M-06 — Assessment completion never shows as a completed day
`patchFinishWorkoutForAssessment` stores `completed[today] = {type:'assessment',…}` (**L7726**) but `isDayCompleted()` requires `=== true` (**L5382**) → calendar tick missing for assessment days (weekly counts still count it, truthy — inconsistent). **Fix:** store `true` (or relax the check). Risk: low.

### M-07 — Adherence coach card reads `currentPlan` with the wrong shape
`updateAiCoach()` does `JSON.parse(localStorage.getItem('currentPlan') || '[]')` then indexes `plan[i]` (**L6335, L6360**). An AI plan is an object with `weekSchedule` → `plannedThisWeek` is always 0 → adherence messages suppressed/wrong once an AI plan exists. **Fix:** read `appState.activePlan.schedule` like everything else. Risk: low.

### M-08 — Workout type is never recorded anywhere
`finishWorkout`/`endWorkout`/`markDayCompleted` read `appState.currentWorkout?.type` (**L3943, L3961, L3982**) — `currentWorkout` is an array, so type is always `'unknown'`. The correct value sits unused in `appState.currentWorkoutType` (set at L3404/3481/7624). History meta and RPE records lose the push/pull/legs label. **Fix:** read `currentWorkoutType`. Risk: low.

### M-09 — Dead "Barbell" filter chips; "Free Weight" unfilterable
No exercise has `equip:'Barbell'` (Free Weight: 2, Cable/Dumbbell/Bodyweight rest). The Barbell chips in Encyclopedia (L1621) and Builder (L1792) yield "0 exercises found" when used alone. Conversely `Plate Pinch`/`Svend Press` (`Free Weight`) have no chip in either UI (group lists at L5006/L5178 exclude it). **Fix:** drop Barbell chips, add Free Weight (or merge those 2 exercises into Dumbbell). Risk: low.

### M-10 — `[PROFILE]` JSON parse failure silently stalls the consultation
If Gemini malforms the profile block, `parseConsultResponse` only `console.warn`s (**L7281**) — mode/ready are lost; the AI may *say* "ready to build?" while no button ever appears. Conversation dead-ends politely. **Fix:** on parse failure, re-ask once automatically, or show the generate button when the AI's *text* contains its ready phrasing; minimum: surface an inline "couldn't read coach data — tap to retry" chip. Risk: low.

---

## LOW

### L-01 — Version badge stuck at "v55"
Badge (L1180) reads **v55**; console logs say "Supabase v53" (L6938/6959). No "v60" string exists anywhere. The documented `sed s/v59/v60/` bumping has been failing silently since the badge styling changed in v55 (the sed patterns no longer matched). Makes device-vs-deployed-version verification impossible — likely contributed to confusion in user testing. **Fix:** update badge text + adopt a single `const APP_VERSION`. Risk: trivial.

### L-02 — Mojibake `Â°` ×4
L1991 (`30Â°` Cable Chest Fly High), L2620 (`90Â°` ×2, 90/90 Hip Switch), L2678 (`90Â°` Cable Donkey Kick). Classic UTF-8-read-as-Latin-1 of `°`. **Fix:** replace with `°` or "degrees". Risk: trivial (ensure editor saves UTF-8).

### L-03 — 163 exercises, not 164
`createEx()` instances: **163** (Cable 56 + Dumbbell 28 + Bodyweight 77 + Free Weight 2). The "164" in project docs/load expectations is off by one (docs' own category sums also total 163). The safety alert at L3003 only fires on total failure, so nothing flags the discrepancy. **Fix:** correct the docs, or log the count on load. Risk: none.

### L-04 — Duplicate element id `exercise-count-slider`
Coach page L1193 (min=4) and Builder modal L1768 (min=3). Invalid HTML; `getElementById` always returns the Coach one, so `updateSettingsUI` never syncs the builder slider, and the two sliders disagree on minimum. Works by accident today. **Fix:** rename the builder one. Risk: trivial.

### L-05 — Duplicate function declarations
`updateExerciseCount` (L3419/L4930) and `downloadBlob` (L7895/L7910) — identical bodies, harmless but confusing. `acceptPlan` duplication is the harmful one (see H-04). **Fix:** delete the dupes. Risk: trivial.

### L-06 — "Context-aware responses" checkbox can't be turned off
`saveChatSettings`: `contextAware: …?.checked || true` (**L7924**) — `false || true === true`. **Fix:** `?? true` / explicit `!== false`. Risk: trivial.

### L-07 — Chat context map uses wrong page IDs
`getCurrentContext()` maps `view-library`/`view-recovery` (**L8086–8094**) but real IDs are `view-encyclopedia`/`view-garmin` → context shows "App" on those pages. Also `getContextualData()` parses `completedWorkouts` (an object) with array default and takes `.length` → `workoutCount: undefined` in the system prompt (**L8103**). **Fix:** correct IDs; `Object.keys(...).length`. Risk: trivial.

### L-08 — Recovery scorecard unreachable branch
`if (restDaysLast7 < 2) … else if (restDaysLast7 < 1)` (**L4668–4669**) — the −40 "no rest at all" penalty can never apply (condition order inverted). **Fix:** check `< 1` first. Risk: trivial.

### L-09 — Voice "Level" setting mostly cosmetic
`speak()` (L5851) only distinguishes `silent`; `countdown`/`standard`/`motivational` behave identically. Settings UI promises behaviour that doesn't exist. **Fix:** gate non-countdown phrases by level, or trim the options. Risk: low.

### L-10 — Programmatic tab switches leave stale nav highlight
`switchTab()` relies on `window.event` to find the nav button (**L3249–3252**); calls from code (e.g. "View My Plan →" L7426, assessment completion L7734) switch the page but leave the old tab highlighted. **Fix:** look up the nav button by tab name instead of `event`. Risk: low.

### L-11 — Misleading comments
"round to nearest 2.5" — code rounds to nearest 0.5 (L3711, L7804). Cosmetic.

### L-12 — Rest timer survives card re-render
If the user taps "Next Exercise" (or logs again) mid-rest, the timer DOM is destroyed but the interval keeps counting and later announces "Go!" out of context (L3328–3342; `endRestTimer` is null-safe so no error). **Fix:** clear interval inside `renderWorkout`/`skipExercise`. Risk: low.

### L-13 — Plan Overview stays hidden if consultation is closed via ✕
`renderPlanOverview()` only runs on entering the Plan tab. After generation, if the user closes with ✕ instead of "View My Plan →" while *already on* the Plan tab, the overview card stays `display:none` until they leave and return. Minor contributor to "can't find my plan". **Fix:** call `renderPlanOverview()` after successful generation. Risk: trivial.

---

## Flow-sweep notes (clunky-but-working observations)

- **Check-in friction:** the check-in modal interrupts *every* start path — including the consultation's "Starting your session now…" handoff, where it feels like a malfunction (modal appears over the consultation's parting message). Consider pre-answering from the consultation or skipping when launched by AI flow.
- **`logSet` lookup by element id `weight-{idx}`** is fine today (only one active card), but the id embeds the exercise index while the handler receives the name — fragile pairing if multi-card view ever returns.
- **Quick actions in chat** ("Modify Workout", "Adjust Plan") ask the AI to do things its own system prompt says it cannot do (L8224–8227) — guaranteed disappointing replies.
- **`exerciseMedia` placeholders:** several entries have `gif:"placeholder"` (L3155–3166) which get written into localStorage by `loadPreloadedImages` and produce broken-image loads (hidden by `onerror`). Harmless noise.
- **Media alias coverage is good** (`mediaAliases` L5523) but `Handstand Hold`, `Beast Reach`, `Kick Through`, and a few Nimble entries have no media — matches the known 6-missing-GIFs item.
- **Encyclopedia chip counts** (Mobility 36 / Nimble 25 / Calisthenics 41) verified accurate against the data.
- **Warmup, RPE, rest-timer, history editor, Mechanic, Deload Detective, Weekly Briefing, Recovery Scorecard** logic all traced — sound apart from items listed above (L-08, M-06…M-08).

---

## Recommended fix order (one change category per build)

| Build | Fix | Category | Why this order |
|---|---|---|---|
| v61 | **C-01** mode gate + use AI-picked exercises | Consultation logic | Restores the headline feature; smallest isolated change with biggest user impact |
| v62 | **C-03** `switchTab('coach')` in `startWorkout` (+ L-10 nav highlight) | Navigation | One-liner; removes the "nothing happened" dead-end that compounds C-01 |
| v63 | **C-02** allow weight-0 logging | Set logging validation | Unblocks bodyweight exercises + assessment; single condition |
| v64 | **H-02** prefill carry-forward in `renderWorkout` | Set logging ergonomics | The ergonomics ask; builds on v63's logging tests |
| v65 | **H-01 phase 1** unify labels to kg (defer toggle) | Units (display only) | Three string edits; zero data risk |
| v66 | **H-03 + M-10** real Try-again/Close buttons + profile-parse recovery | Consultation error handling | Closes the remaining consultation dead-ends |
| v67 | **H-04 + L-05** de-duplicate `acceptPlan` (+ delete dup functions) | Code hygiene / old generator | Low risk, fixes silent regression |
| v68 | **H-06 + M-01** cardio decision (restore nav or remove page), fix `renderCardioHistory` call | Cardio/navigation | Needs a product decision first |
| v69 | **M-02, M-06, M-07, M-08** data-shape corrections | Local data layer | Group the small storage-shape fixes; test history/analytics after |
| v70 | **M-04** real export/import, then **H-05** cloud sync re-point | Backup & sync | Highest-risk storage work last, with v69's shapes settled; export-first gives users a safety net before touching sync |
| v71 | **L-01…L-13, M-05, M-09** cosmetic/data batch (badge, mojibake, ratio names, dead chips, scorecard branch, etc.) | Polish | Safe batch once behaviour is stable |

**Testing note for every build:** Node syntax check per script block, then on-device: consultation→plan→Plan tab, consultation→workout, bodyweight set log, assessment end-to-end, quick start from each tab.

---

*Audit complete. No app code was modified. This report (`_audit_v60.md`) is the only file written.*
