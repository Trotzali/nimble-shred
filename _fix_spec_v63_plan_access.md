# Fix Spec v63 — Plan Access Criticals (C-01 + C-03)

**Author:** T2 (read-only investigation terminal)
**Date:** 2026-06-06 19:54
**Source:** `_audit_v60.md` C-01, C-03 (with L-10, L-13 folded in where required)
**Status:** SPEC ONLY — no code changed, no git run. File left untracked for T1.

All line numbers below were **re-verified against the current working tree today** (they drift slightly from the audit's estimates: `generateFromConsultation()` actually starts at L7367, not ~7362; the mode checks are at **L7384** and **L7414**, not L7379 — L7379 is the prompt-intro ternary).

---

## Part 1 — C-01: "Build My Plan" generates a workout, not a plan

### Verified root-cause trace

| Step | Location | Behaviour |
|---|---|---|
| 1 | `startConsultation(mode)` **L7108–7109** | All 3 entry buttons (Coach L1223, Plan L1322, Settings L1497) call it **with no argument** → `consultMode = 'undecided'` |
| 2 | `callConsultAI()` **L7241–7243** | Mode only becomes `'plan'`/`'workout'` if Gemini emits `"mode"` in a parseable `[PROFILE]` block. Omitted/malformed/misclassified → stays `'undecided'` |
| 3 | `showGenerateButton()` **L7337/L7344/L7351** | Only `=== 'workout'` gets the workout button; `'undecided'` falls into the **else** branches and shows **"✨ Build My Plan"** / the assessment offer — the UI promises a plan |
| 4 | `generateFromConsultation()` **L7384** | `if (consultMode === 'plan')` — `'undecided'` falls to the **else** → requests single-workout JSON |
| 5 | Same function **L7414** | Second `if (consultMode === 'plan')` — `'undecided'` again falls to the workout branch: `quickStartWorkout(result.type || 'full')` at **L7438**, `result.exercises` discarded, **`currentPlan` never written** (only written at **L7424**, inside the plan branch) |

The internal inconsistency: the function's **ternaries** (L7368 message, L7379 prompt intro, L7405 system prompt) already default `'undecided'` → "plan" wording, but the two **equality ifs** (L7384, L7414) default it → workout behaviour. The chat literally says "Building your personalised training plan…" while requesting and executing a workout.

### The surgical fix (2 additions, 0 deletions)

**Edit 1 — resolve mode once, at the top of `generateFromConsultation()`.**
Insert as the first statement of the function (immediately after the `async function generateFromConsultation() {` line, **L7367**, before the `addConsultMsg` at L7368):

```js
    // 'undecided' must honour the button the user tapped — showGenerateButton()
    // only offers "Build My Workout" when mode === 'workout'; everything else
    // was promised a plan.
    if (consultMode !== 'workout') consultMode = 'plan';
```

Why here and not at the call sites: this single line makes **all five** downstream `consultMode` reads (L7368, L7379, L7384, L7405, L7414) consistent at once, and it also covers the no-arg fallback call at **L7622** (`startAssessment()` → "couldn't find matching exercises" → `generateFromConsultation()`), which a button-parameter approach (`generateFromConsultation('plan')`) would miss.

**Edit 2 — render the Plan Overview card immediately after the plan is saved.**
Inside the plan branch, after `localStorage.setItem('currentPlan', JSON.stringify(result));` (**L7424**) — keep it before the cloud-sync line so a sync failure can't skip it:

```js
            renderPlanOverview();
            renderPlanCalendar();
```

Why: `renderPlanOverview()` (**L5247**) currently only runs via `switchTab('plan')` (**L3254**). The "View My Plan →" button (L7431) does call `switchTab('plan')`, so that path is fine — but if the user opened the consultation **from the Plan tab** (L1322, the primary entry) and closes with ✕ (`closeConsultation()`, L7140), no tab switch occurs and the overview card stays `display:none` (audit **L-13**, "can't find my plan" contributor). Both functions are safe to call while `#view-plan` is hidden (pure DOM writes into the hidden container; `renderPlanOverview` is null-guarded at L5250) and are idempotent — the later `switchTab('plan')` simply re-renders.

### What NOT to touch

- **`showGenerateButton()` (L7330–7365)** — labels and assessment-offer logic are correct once mode resolves; leave as-is.
- **The workout branch (L7433–7440)** — yes, it discards `result.exercises` and random-generates instead. That is a real defect but a **separate behaviour change** (name-matching against `allExercises`, fallback handling). Do not bundle it into v63; it needs its own test pass.
- **The catch block (L7442–7446)** — the lying "Try again/Close" bubbles are audit **H-03**, scheduled v66.
- **`parseConsultResponse()` / mode inference (L7241–7243, L7281–7289)** — silent profile-parse failure is **M-10**, scheduled v66. The whole point of Edit 1 is that generation no longer depends on the AI getting mode right.
- **`startConsultation()` default (L7109)** — `'undecided'` during the interview is correct; it drives the "help me decide" conversation. Only generation must resolve it.
- **The stale global init/comment at L7105** (`var consultMode = 'plan'; // 'plan' or 'workout'`) — dead after `startConsultation()` runs; cosmetic, leave for the v71 polish batch.

### Risk: LOW

One added guard line + two added render calls, all inside one function. The happy paths are provably unchanged: `mode === 'plan'` skips Edit 1's assignment (already 'plan'); `mode === 'workout'` is excluded by the condition. Only `'undecided'` changes behaviour — from the broken workout path to the plan path the button promised.

### On-device test checklist (C-01)

1. **Undecided → plan (the bug):** Coach tab → AI Coach Consultation → open with "Not sure — help me decide" → answer through to ready → tap **"✨ Build My Plan"**. Expect: "✅ Your plan is ready!" with plan name + weeks (NOT "Starting your session now…"), no check-in modal, no workout starts.
2. **Persistence:** after (1), Plan tab shows Plan Overview card + calendar; force-close and reopen the app → plan still there (`currentPlan` + `appState.activePlan` written).
3. **✕-close case (Edit 2):** run the consultation **from the Plan tab**, generate the plan, close with **✕** (not "View My Plan →") → Plan Overview card is already visible behind the modal, without leaving the tab.
4. **Workout regression:** new consultation → "Just a workout for today" → button reads **"Build My Workout"** → tapping it still starts a single workout (check-in modal then session). Mode `'workout'` path must be byte-identical in behaviour.
5. **New-user assessment offer:** with `strengthProfile` cleared and <10 history entries → consultation → ready → assessment offer appears → **"Skip — Build My Plan"** → plan generated (not a workout).
6. **"View My Plan →"** still switches to Plan tab with calendar rendered.

---

## Part 2 — C-03: workouts started from Plan/Settings render into a hidden container

### Verified mechanics

`#workout-interface` (**L1240**) lives inside `#view-coach`. Tab visibility is class-driven: `switchTab()` (**L3242–3259**) toggles `.active` on `.container` elements. There are **two** places that reveal the workout interface, and **neither** switches tabs:

1. `startWorkout()` **L3534–3545** — reveal + scroll at **L3540–3541**.
2. `continueToWorkout()` **L6325–6330** — reveal + scroll at **L6327–6328**. This is the **warmup path's** reveal: Quick Start for push/pull/legs (`_executeQuickStart` **L3411–3413**) calls `startWarmup(type); renderWorkout(exercises);` and **never calls `startWorkout()` at all** — the interface only appears when the warmup modal ends (`completeWarmup` L6318 / `skipWarmup` L6312 → `continueToWorkout`). A fix in `startWorkout()` alone would miss this path.

**Entry points that reach a workout from a non-Coach tab** (all confirmed; `switchTab('coach')` is called programmatically **nowhere** — zero hits):

| Entry | Tab | Path | Reveal point |
|---|---|---|---|
| "Redo Assessment" L1325 | Plan | `startAssessmentDirect()` L7822 → `startAssessment()` L7594 → `startWorkout()` L7636 | `startWorkout` |
| Consultation → assessment offer | Plan/Settings (modal opened at L1322/L1497) | `startAssessment()` → `startWorkout()` L7636 | `startWorkout` |
| Consultation → workout mode | Plan/Settings | L7436 `setTimeout` → `quickStartWorkout(type)` L3384 → check-in → `_executeQuickStart` L3391 → **push/pull/legs:** warmup → `continueToWorkout()`; **other types:** `startWorkout()` L3415 | **both** |

(Coach-tab-only launchers — Quick Start chips L1215–1219, Random L1225, Wedge L3487, Custom Builder L5120 — go through the same two reveal points but from a visible tab.)

**The nav-highlight trap (why the bare one-liner is NOT enough):** `switchTab()` clears `.active` from **all** nav buttons (L3244), then re-highlights via `event?.target.closest('.nav-btn')` (**L3249–3252**). When `switchTab('coach')` is called programmatically:

- from a click on a non-nav element (Quick Start chip, "Redo Assessment" button): `window.event.target` is that element → `.closest('.nav-btn')` is `null` → **no nav button highlighted at all**. So the bare one-liner would visibly break Quick Start from the Coach tab — every chip tap would wipe the Coach highlight.
- from a `setTimeout` (consultation workout path, L7436) or timer callback (`completeWarmup`): `window.event` is undefined → same outcome.

So the highlight lookup must be fixed in the same build (this is audit **L-10**, folded in here because C-03 *requires* it, not as scope creep).

### The surgical fix (3 edits)

**Edit 1 — `startWorkout()` (L3534):** insert immediately before the reveal line `document.getElementById('workout-interface').style.display = 'block';` (**L3540**):

```js
    switchTab('coach'); // workout UI lives inside #view-coach (C-03)
```

**Edit 2 — `continueToWorkout()` (L6325):** insert the identical line immediately before its reveal (**L6327**). Invariant for both: *whoever reveals `#workout-interface` first ensures its parent tab is active.*

**Edit 3 — `switchTab()` nav highlight (L3249–3252):** replace the event-based block

```js
    if(event?.target) {
        const btn = event.target.closest('.nav-btn');
        if(btn) btn.classList.add('active');
    }
```

with a lookup by tab name (the five nav buttons L1741–1754 carry literal `onclick="switchTab('<tab>')"` attributes — exact-match attribute selector, no substring risk):

```js
    const navBtn = document.querySelector('.nav-btn[onclick="switchTab(\'' + tab + '\')"]');
    if(navBtn) navBtn.classList.add('active');
```

For direct nav taps this resolves the same button the event lookup did; for programmatic calls it now works where the old code silently didn't. `'cardio'` has no nav button (H-06) → `null` → guarded, no throw.

### Double-fire / Coach-tab regression analysis (asked explicitly)

- **Idempotent:** `switchTab('coach')` when already on Coach removes and re-adds the same classes. There is **no** `if(tab === 'coach')` render hook (the per-tab hooks at L3254–3258 cover plan/cardio/garmin/encyclopedia/settings only), so switching **to** coach triggers zero re-renders, zero fetches. Calling it redundantly is free.
- **No double-fire:** the two reveal points are mutually exclusive per launch — warmup path (push/pull/legs Quick Start) reveals via `continueToWorkout()` only; every other path via `startWorkout()` only. Even if both ever ran, the call is idempotent.
- **Expensive renders not triggered:** the heavy hook is `switchTab('plan')` (6 render calls, L3254). This fix only ever switches to `'coach'`; the "View My Plan →" button's existing `switchTab('plan')` is unchanged.
- **Quick Start from Coach tab:** with Edit 3 in place, chip tap → check-in → `startWorkout`/`continueToWorkout` → `switchTab('coach')` → view stays, Coach nav button re-highlighted correctly. **Without Edit 3 it would lose the highlight — do not ship Edits 1–2 without Edit 3.**
- **Modal overlays unaffected:** check-in and warmup modals are `body`-level overlays, visible regardless of active tab; the tab switch can happen before or under them safely.
- **`scrollIntoView` now meaningful:** previously a no-op on a `display:none` ancestor; after the switch it scrolls to the session as intended.

### What NOT to touch

- **Do not move `#workout-interface` out of `#view-coach`** — correct long-term, but it's an HTML+CSS restructure with broad blast radius; out of scope.
- **`showCheckIn()` / check-in flow (L3278+)** — the check-in-interrupts-consultation friction is a flow-sweep note, not v63.
- **`_executeQuickStart` / `_executeWedgeSession` equipment save/restore logic** — don't relocate the tab switch into these; keeping it at the reveal points covers all callers including future ones (e.g. the M-03 reload-resume fix).
- **The five nav `onclick` attributes (L1741–1754)** — Edit 3's selector depends on them verbatim; don't reformat them in this build.
- **`speak()` calls and notification toasts** — leave ordering as-is.

### Risk: LOW

Two identical one-line insertions plus one 4-line block swapped for 2 lines. The only edit with app-wide reach is Edit 3 (every nav tap flows through it) — mechanically simple, but it's the item the device pass must hammer (test 6 below).

### On-device test checklist (C-03)

1. **Plan tab → "Redo Assessment"** → app switches to Coach tab, assessment session visible and scrolled to, Coach nav button highlighted.
2. **Plan tab → consultation → workout mode → Build My Workout** → check-in → for non-push/pull/legs types: lands on Coach with session visible. (Run after C-01 so mode handling is sane.)
3. **Same as (2) but a push/pull/legs workout** → warmup modal plays (or Skip) → on close, Coach tab active, session visible — this exercises the `continueToWorkout()` edit specifically.
4. **Settings tab → New AI Consultation → workout** → same expectation as (2).
5. **Coach-tab regression:** Quick Start each of Push / Full / Random / Wedge 10min / Custom Builder → session appears as before AND the **Coach nav button stays highlighted** after every launch.
6. **Nav sweep:** tap all five nav buttons in sequence — exactly one highlight at a time, correct button each time, no console errors (Edit 3 regression check).
7. **Bonus (L-10 fixed for free):** after generating a plan, "View My Plan →" now highlights the **Plan** nav button (previously: page switched, no highlight).

---

## Combined build notes for T1

- **Order:** C-01 Edits 1–2 → Node syntax check → C-03 Edits 1–3 → Node syntax check → single combined device pass (checklists above). The fixes are independent; if one device-fails, the other can ship alone.
- **Syntax check:** per project pattern — extract each of the 3 `<script>` blocks, `new Function(code)` under Node, all must parse.
- **Version bump:** target v63 per audit ordering (this spec covers the audit's v61+v62 items as one build). NOTE audit **L-01**: the badge is stuck at "v55" (L1180) and the documented `sed s/vNN/vNN+1/` has been failing silently — bump the badge text manually and verify the string actually changed, or this build will be untestable-by-eye on device like the last five.
- **Untouched neighbours to re-verify after merge:** `bubbleClick` (L7173), `closeConsultation` (L7140), `renderWorkout` (L3550) — referenced but not modified.

---

## Part 3 — Assessment access: why the Fitness Assessment can't be reached, and how v63 fixes it

*(Appended 2026-06-06 20:04. Line numbers re-verified against the current working tree, which now includes the v62 weight-0 fix — note `logSet()` has shifted to **L3778**, +5 vs the audit's L3773.)*

### 3.1 Entry-point inventory for `startAssessment()` (L7594)

Every path that can trigger the assessment, and its current status:

| # | Entry point | Location | Currently works? | Why / why not |
|---|---|---|---|---|
| A | **Consultation assessment offer** — "💪 Do the Assessment (recommended)" | `showGenerateButton()` else-branch **L7351–7361** | **Conditionally** | Only *rendered* for effectively-new users: gated at **L7334–7335** on no `strengthProfile` AND ≤10 `exerciseHistory` keys (`hasHistory = … > 10`). When shown: works **from the Coach tab**; from the **Plan (L1322) or Settings (L1497) consultation buttons** it dead-ends — `startAssessment()` → `startWorkout()` **L7636** renders into the hidden `#view-coach` (**C-03**). Reaching the offer at all also depends on the AI emitting `ready:true` in a parseable `[PROFILE]` block (M-10 fragility) — the C-01-broken consultation is the only funnel. |
| B | **"💪 Redo Assessment" button, Plan tab** | Button **L1325–1327** → `startAssessmentDirect()` **L7822–7827** → `startAssessment()` | **No — pure C-03** | The button exists and is correctly wired (loads saved `consultProfile`, sets `consultMode='plan'` explicitly, no check-in gate). It fails *only* because it launches from the Plan tab: the session renders hidden, the user sees just a "💪 Fitness Assessment started!" toast and an unchanged Plan page. Not blocked by C-01 (mode is set explicitly at L7825). |
| C | **Post-assessment plan handoff** | `patchFinishWorkoutForAssessment()` **L7743–7757** | **Yes** (once an assessment completes) | Reopens the consultation, explicitly sets `consultMode='plan'` (**L7749**) before its "✨ Build My Plan" button — so this path was never C-01-vulnerable. Cosmetic only: its `switchTab('plan')` at **L7739** loses the nav highlight (L-10; fixed by Part 2 Edit 3). |
| D | **"Skip — Build My Plan"** (declining the offer in A) | **L7359–7360** → `generateFromConsultation()` | **No — C-01** | Skipping the assessment with mode still `'undecided'` hits the C-01 workout branch: random workout, no plan. Fixed by Part 1 Edit 1. |
| E | **Exercise-match failure fallback** | `startAssessment()` **L7620–7623** → `generateFromConsultation()` no-arg | **No — C-01** (edge case) | Same `'undecided'` exposure; covered by Part 1 Edit 1 (this is the L7622 call site that motivated resolving mode *inside* the function rather than at the buttons). |

Two structural observations that explain "I can't find the assessment":

1. **For any user with training history, entry A never renders.** The `existingProfile || hasHistory` gate (L7344) routes straight to "Build My Plan". The real user — months of logged sets — can *only* reach the assessment via entry B, a button labelled "**Redo** Assessment" (implying you've already done one) that then visibly does nothing (C-03). One tap teaches them it's broken.
2. **The C-03 dead-end leaves live state armed:** entry A/B failures still set `assessmentInProgress = true` and `appState.currentWorkout` (L7629–7633), and `#workout-interface` has already had `display:block` set — so the session is actually sitting on the Coach tab if the user happens to navigate there manually (undiscoverable, but explains "ghost workout" reports). Worse, if they never do, the patched `finishWorkout` (**L7723–7726**) will treat whatever workout they complete *next* as the assessment. Both hazards disappear once C-03 is fixed, because the user lands on the session immediately.

### 3.2 The assessment itself works once reached (verified in current tree)

- **Weight-0 logging (v62 fix confirmed live):** `logSet()` **L3782** now validates `if(isNaN(weight) || !reps)` with the updated alert "Enter a weight (0 = bodyweight) and reps" — `0` passes, empty input (`NaN`) still rejected. The bodyweight track's own instructions ("Log reps with weight as 0", e.g. **L7536**) are now followable.
- **History stamping:** `saveSetToHistory()` **L3814–3820** stamps `sessionDate` on every set, so `buildStrengthProfile()`'s today-filter (**L7776**) selects the assessment's sets correctly (with a last-3-sets fallback at L7777 regardless).
- **Profile build handles 0:** `buildStrengthProfile()` **L7779** uses `s.weight || 0`; a bodyweight assessment yields `weight: 0` per pattern plus `reps`, and the profile is written (L7791). `getEstimatedWeight()` (**L7796**) then returns `{weight: 0, reps: …}` for ratio-matched exercises — i.e. "bodyweight at these reps", which is the correct semantic for that track. No crash, no NaN.
- Known non-blockers, already scheduled elsewhere: ~20 `strengthRatios` key/DB-name mismatches limit extrapolation *coverage* (M-05, v71 batch); equipment keyword matching in `startAssessment()` is crude but defaults safely to the cable track (project-state known issue #6).

**Conclusion: the only blocker is ACCESS.** Every in-assessment mechanism — logging, profile build, estimation, completion handoff — is sound in the current tree.

### 3.3 Minimal v63 change for assessment reachability: NONE beyond Parts 1–2

No new edits are required. Assessment access is a corollary of the already-specified fixes:

- **Part 2 Edit 1** (`switchTab('coach')` in `startWorkout()`) fixes entries **A** (from Plan/Settings) and **B** — the assessment path reveals via `startWorkout()` at L7636, never via the warmup path, so Edit 2 (`continueToWorkout`) isn't even needed for it.
- **Part 2 Edit 3** (nav-highlight lookup) keeps the tab state honest for B and for C's `switchTab('plan')`.
- **Part 1 Edit 1** (mode resolution) fixes entries **D** and **E**.

**Add to the v63 device pass** (extends the Part 2 checklist):

8. **Plan tab → "Redo Assessment"** → lands on Coach tab with the assessment session visible, instruction card and progress bar shown (the v60 assessment patches), toast fires.
9. **End-to-end bodyweight assessment:** clear `strengthProfile` / use a fresh profile state → run the assessment on the bodyweight track → log sets with **weight 0** → finish → "✅ Assessment complete!" → consultation reopens with "Build My Plan" → generates a **plan** (entry C). Verify `strengthProfile` in storage has per-pattern entries with `weight: 0` and sensible reps.
10. **Assessment offer → "Skip — Build My Plan"** (fresh profile state, consultation from the Plan tab) → produces a plan, not a workout (entry D regression for Part 1 Edit 1).

### 3.4 OPTIONAL — discoverability (decision pending, NOT part of the core v63 fix)

> **Status: OPTIONAL / for us to decide.** Everything below is excluded from the C-01/C-03 build. v63 makes the assessment *functional*; this item is about making it *findable*. Do not implement without explicit go-ahead.

**Finding:** even after v63, an existing user (history >10 exercises) can only ever reach the assessment through one button, on the Plan tab, labelled "**Redo** Assessment" — a label that tells first-timers it isn't for them. The proactive offer (entry A) is new-users-only by design.

**Smallest direct entry point, two candidates (either is a single, isolated edit reusing the v63-tested `startAssessmentDirect()` path — no new logic):**

1. **Relabel the existing Plan-tab button** (L1326): "💪 Redo Assessment" → "💪 Fitness Assessment". One string edit, zero new elements, zero new code paths. Cheapest possible; still Plan-tab-only.
2. **Add a mirror button on the Coach tab**, next to "AI Coach Consultation" (L1223 block): `<button class="btn" onclick="startAssessmentDirect()" …>💪 Fitness Assessment</button>` styled like its neighbours. One HTML line; puts the entry on the tab where workouts actually live (and where v63 now sends the user anyway).

Recommendation if/when approved: **do both** (they're independent one-liners), but (1) alone removes the worst signal. Defer anything richer — e.g. re-offering the assessment in-consultation for users *with* history, or surfacing "last assessed: N weeks ago" on the strength-profile card — to the post-cleanup roadmap (pairs naturally with the exercise-metadata pass).

---

**Sign-off:** T2 — 2026-06-06 19:54 (Parts 1–2) · **Part 3 appended: T2 — 2026-06-06 20:04**
