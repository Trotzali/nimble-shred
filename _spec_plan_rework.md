# Spec — Plan Tab + Plan Generator + Hero Banner Rework

**Author:** T2 (read-only investigation terminal)
**Date:** 2026-06-08 14:57
**Scope:** `index.html` only — hero banner, Plan tab (`#view-plan`), Generate Training Plan modal. Issues #6a/#6b, #9, #10a–10e.
**Status:** SPEC ONLY — no code changed, no git run. File left untracked.

All line numbers verified against the current working tree (v63 live: badge L1180, `getWeightUnit()` at L3242, `acceptPlan` still duplicated at L5510/L7607).

---

## Architecture recap (so the fixes below are unambiguous)

There are **two distinct plan systems** sharing one tab, and most of these bugs come from their overlap:

- **System A — the AI Consultation** (`startConsultation`, the v63 path). Writes `localStorage.currentPlan` (rich object: `name`, `duration`, `guidance`, `phases[]`, `weekSchedule`) **and** `appState.activePlan` (the runtime schedule). Rendered by **`renderPlanOverview()`** (L5277) into `#plan-overview-card` (L1332).
- **System B — the legacy 3-step Generate Training Plan modal** (`openPlanGenerator`, the "New Plan" button). Writes **only** `appState.activePlan`; never touches `currentPlan`. Rendered by **`renderPlanCalendar()`** (L5374) into `#week-grid` (L1346), with the phase/adherence header `#phase-display` (L1339).

`appState.activePlan` always exists — `loadAppState()` (L3225) calls `createDefaultPlan()` (L3258) when none is saved, seeding **`name:'5-Day Balanced'`** with schedule `{Sun:rest, Mon:push, Tue:cardio, Wed:pull, Thu:rest, Fri:legs, Sat:nimble}`.

---

## #6 — Hero "Monday / Start Workout" banner

### #6a — Why it shows on every tab

**Current behaviour:** the purple gradient banner is visible on Coach, Plan, Encyclopedia, Recovery, Settings — every tab.

**Root cause:** `#todays-banner` (**L1167–1174**) is a direct child of `<body>`, placed *before* and *outside* every `<div class="container" id="view-…">`. Tab switching is purely class-driven: `switchTab()` (**L3242–3256**) does `querySelectorAll('.container').forEach(remove 'active')` then adds `.active` to the one `#view-<tab>`. The banner is **not** a `.container`, so no tab switch ever hides or shows it. Its visibility is governed *solely* by its own inline `style.display`, toggled only by `updateTodaysBanner()` (L5524). Once that sets `display:block`, it stays block on all tabs.

**Is "every tab" wrong?** That's a product call, but the banner is styled and worded as a *Coach-page hero* ("Planned: PUSH → Start Workout"), and Start launches a workout whose UI lives in `#view-coach`. Seeing "Start Workout" while on Settings/Encyclopedia is the reported oddity.

**Proposed surgical fix (choose one):**
- **(A, minimal/recommended)** Move the banner markup **inside `#view-coach`**, immediately after the opening tag (L1177), so it inherits coach-tab visibility for free. One block move; `updateTodaysBanner` and `startTodaysWorkout` unchanged. Risk: low — pure relocation; verify it sits above the Quick Start card.
- **(B)** Keep it body-level but gate it in `switchTab`: hide unless `tab === 'coach'`. More code, and it fights the existing `display` logic (two owners of the same style) — not preferred.

### #6b — Whether it reflects a completed session

**Current behaviour:** complete today's planned workout → the banner still says "Planned: PUSH / Start Workout" until a full page reload.

**Root cause:** `updateTodaysBanner()` (L5524) *does* contain the correct guard — `if (type === 'rest' || isDayCompleted(dayIdx)) { banner.style.display='none'; return; }` (**L5533**), and `isDayCompleted` (L5414) reads `completedWorkouts[date] === true`. The problem is **it is almost never called.** Call sites are only:
1. `window.onload` (**L3220**) — initial load.
2. `loadFromCloud` success (**L7148**) — cloud restore.

`finishWorkout()` (**L3989**) → `markDayCompleted()` (**L4006**, writes `completed[date]=true`) does **not** call `updateTodaysBanner()`. Neither does `endWorkout()` (L3974), the RPE-save path, nor `switchTab()`. So the underlying data flips to completed, but the banner isn't re-evaluated until the next reload. (Even fix #6a-B wouldn't help; fix #6a-A wouldn't either — the banner is already block and nothing re-runs the guard.)

**Proposed surgical fix:** add `updateTodaysBanner();` at the end of `markDayCompleted()` (L4006, after the localStorage write) — single source that covers both finish and assessment-completion paths. Also add it to `switchTab` for the coach (or banner-owning) tab as a cheap belt-and-braces re-evaluation. Risk: low — `updateTodaysBanner` is null-guarded (L5526) and idempotent.

> Note: `editDay()` (L5405) mutating the schedule also doesn't refresh the banner — same fix family (call `updateTodaysBanner` after `saveAppState`). Optional, lower priority.

---

## #9 — Plan tab: duplicate strip + non-clickable "5-Day Balanced"

**Current behaviour:** the Plan tab shows the plan name/schedule **twice** — once as the "5-Day Balanced" overview strip (the colored day-pills) and again as the "Week 1 - Foundation" calendar card below it — and the "5-Day Balanced" strip can't be tapped.

**Root cause — two renderers paint overlapping data into two cards (the System A / System B overlap):**

1. **"5-Day Balanced" strip** = `#plan-overview-card` (L1332), painted by **`renderPlanOverview()`** (L5277). Its title is `savedPlan.name || activePlan.name` (L5290); with no AI plan saved, that resolves to the default `activePlan.name` = **"5-Day Balanced"** (L3260). The weekly row at **L5315–5330** draws Sun–Sat day-pills from `weekSchedule || activePlan.schedule`. It is built as **`innerHTML` static markup with no `onclick`** anywhere (verified) — hence not clickable.

2. **"Week 1 - Foundation" card** = the static card at **L1336–1347**; header `#phase-display` set by `updatePhaseDisplay()` (L5420) to `Week ${week} - ${phase}`, and `#week-grid` painted by **`renderPlanCalendar()`** (L5374). *These* day bubbles **are** interactive — `bubble.onclick = () => editDay(idx)` (**L5386**), cycling the day's type.

Both run on every Plan-tab entry — `switchTab('plan')` calls `renderPlanOverview()` **and** `renderPlanCalendar()` back-to-back (L3252). So the same 7-day schedule is rendered twice: once read-only (overview), once editable (calendar). The overview was added (v59) as an AI-plan summary; for a default/legacy plan it has nothing extra to show beyond the schedule the calendar already shows → pure duplication. The "can't click 5-Day Balanced" complaint is the user trying to edit via the *first* (read-only) strip, not realizing the editable one is the card below.

**Proposed surgical fix (pick per product intent):**
- **(A, recommended) De-duplicate by role.** Make `renderPlanOverview()` render **only when a rich AI plan exists** and **only the parts the calendar lacks** (name, duration, `guidance`, `phases[]`, strength/consultation profile) — drop its day-pill row (L5315–5330) entirely, since the calendar owns the schedule. Guard: `if (!savedPlan) { card.style.display='none'; return; }` (currently it shows for `activePlan`-only too, L5285). Net: legacy/default users see just the editable calendar; AI-plan users see calendar + a non-redundant summary. Small deletion + one guard tweak.
- **(B) Make the overview the single source** and remove the calendar card — larger, loses inline `editDay`, not recommended.
- **Independent of A/B:** if the overview strip is kept visible at all, either make its day-pills call `editDay(idx)` (wire the same handler) or add a visual "read-only summary" caption so users stop trying to tap it.

Risk: low (A is deletion + guard). Re-test: AI-plan render still shows phases/profile; default-plan Plan tab shows one schedule only.

---

## #10 — Generate Training Plan modal

Modal markup **L1897–1931**; logic `openPlanGenerator` L5443 → `showGenStep` L5453 → `selectFrequency` L5460 → `selectGoal` L5466 → `acceptPlan` L5510 / `regeneratePlan` L5517.

### #10a + #10b — Frequency and Focus allow multi-select

**Current behaviour:** in Step 1 you can tap 3 Days *and* 5 Days and both stay highlighted; same for the three Focus chips in Step 2. Visually several look "selected" though only one value is actually used.

**Root cause:** the chips (L1908–1911 frequency, L1919–1921 focus) are plain `.chip` divs. Their handlers **only add** the active class and **never clear siblings**:
- `selectFrequency(days)` (L5460): `planData.frequency = days; event.target.classList.add('active');` — no removal from the other frequency chips.
- `selectGoal(goal)` (L5466): `planData.goal = goal; event.target.classList.add('active');` — same.

(Contrast: the builder's `filterBuilder()` deliberately *toggles* for multi-select; here multi-select is unintended.) Data-wise only the last tap wins (`planData.frequency`/`.goal` are scalars), but the UI implies multi-select. Worse, because Step 1 auto-advances after 300ms (L5463) and chips are never reset, **re-entering a step shows stale highlights** (see 10c).

**Proposed surgical fix:** before adding `.active`, clear it from the group. Two clean lines per handler, e.g. in `selectFrequency`:
```js
document.querySelectorAll('#generator-step-1 .chip').forEach(c => c.classList.remove('active'));
event.target.classList.add('active');
```
and the `#generator-step-2 .chip` equivalent in `selectGoal`. (Also note both rely on `window.event`, the same fragile pattern v63 removed from `switchTab`; passing the element or using `this` would be more robust but is optional.) Risk: trivial.

### #10c — Regenerate doesn't reset prior picks

**Current behaviour:** Step 3 → tap **Regenerate** → returns to Step 1, but the previously chosen frequency/focus chips are still highlighted and `planData` still holds the old values.

**Root cause:** `regeneratePlan()` (**L5517–5519**) is literally just `showGenStep(1)`. It does not clear `planData` (the module-level object, L5441) nor remove `.active` from any chip. `showGenStep` (L5453) only flips step visibility. Compare `openPlanGenerator` (L5443), which at least resets `planData = {}` — but even that never clears chip highlight classes, so the stale-highlight bug exists on reopen too.

**Proposed surgical fix:** make `regeneratePlan()` reset state, and factor the chip-clear so both entry points use it:
```js
function regeneratePlan() {
    planData = {};
    document.querySelectorAll('#plan-generator-modal .chip').forEach(c => c.classList.remove('active'));
    showGenStep(1);
}
```
Add the same `querySelectorAll(...).remove('active')` line to `openPlanGenerator()` (L5443) so a fresh open is also clean. Risk: trivial. (Fixing 10a/10b makes the highlight clears partly redundant within a session, but resetting on Regenerate/open is still needed to drop the *previous* session's marks.)

### #10d — "Accept & Start" does nothing

**Current behaviour:** Step 3 → **Accept & Start** closes nothing useful and the plan isn't reliably persisted; user is left where they were.

**Root cause — `acceptPlan` is defined twice and the wrong one wins (audit H-04, still live):**
- Intended generator handler at **L5510**: `saveAppState(); closePlanGenerator(); renderPlanCalendar(); speak('Plan activated!');` — correct.
- A v58 consultation back-compat shim at **L7607**: `function acceptPlan() { closeConsultation(); switchTab('plan'); renderPlanCalendar(); }`.

Both are plain function declarations in the same script block; **the later declaration (L7607) overrides the earlier one**, so the button at L1928 (`onclick="acceptPlan()"`) runs the shim. The shim calls `closeConsultation()` (closes the *consultation* modal, which isn't open) — it does **not** call `closePlanGenerator()`, so the generator modal stays up, and it **never calls `saveAppState()`**, so the `appState.activePlan` that `selectGoal()` already mutated in memory (L5485) is not persisted (survives only incidentally if some later action saves). Net effect from the user's seat: button appears dead.

**Proposed surgical fix:** eliminate the name collision. Preferred: **rename the shim** (it exists only for legacy consultation callers — `startAIPlanWizard`/`closeAIWizard` neighbours at L7605–7606) to e.g. `acceptConsultPlan` and update any caller, **or** delete it outright if nothing calls it (grep shows the only `acceptPlan()` invocation is the generator button L1928 — verify before deleting). That restores the real L5510 handler. Risk: low; this is the documented H-04 fix. Pairs naturally with L-05 (dedupe the other duplicate declarations).

### #10e — Where workout-type selection + post-generation editing hook in

**What exists today:** the generator picks a **schedule template** (push/pull/legs/cardio/nimble/rest per day) from the hardcoded `schedules` map in `selectGoal()` (**L5471–5476**, keyed by frequency 3/4/5/6). There is **no** per-day type choice in the modal and **no** exercise-level content — "workout type selection" today means only which split lands on which weekday, and that's template-fixed.

**Two natural hook points:**

1. **Post-generation day-type editing — already half-built.** After Accept, each calendar bubble's `editDay(idx)` (**L5405–5412**) cycles `rest→push→pull→legs→cardio→nimble`. So per-day type editing *exists on the Plan calendar* once the plan is accepted — it's just not surfaced in the modal and not discoverable (ties to #9: users tap the wrong, read-only strip). The cleanest "post-generation editing" path is to **lean on `editDay` and make the editable calendar the obvious one** (fix #9-A), optionally adding it to the Step-3 preview: render `#plan-preview` (L5494) day rows as tappable, reusing `editDay` against the in-memory `appState.activePlan.schedule` before Accept.

2. **Workout-type selection as a new Step / preview affordance.** The Step-3 preview (`plan-preview`, built at L5494–5505) is the place to insert editable controls *before* Accept. Hook: replace the static `<div>` rows with per-day `<select>`/cycle buttons calling a small `setPlanDay(idx, type)` that mutates `appState.activePlan.schedule[idx]` and re-renders the preview. No new persistence needed — `acceptPlan` (once #10d is fixed) already saves `appState.activePlan`.

   Exercise-level selection (which specific lifts on a push day) does **not** belong here — that's the Quick Start drill-down's job (see `_design_spec_quickstart_drilldown.md`); the plan layer should stay at the schedule/type altitude and let the per-session generator pick exercises at launch via `quickStartWorkout(type)` (already how `startTodaysWorkout` L5547 works).

**Proposed surgical direction (not a one-liner — flag for product):** (a) fix #10d so Accept persists; (b) make Step-3 preview rows editable via a thin `setPlanDay` wrapper over the existing schedule mutation; (c) ensure the accepted plan's editable surface is the single calendar (fix #9). Risk: medium (new UI in preview), but built entirely on existing `schedule`/`editDay` plumbing — no new data model.

---

## Suggested fix order

| # | Item | Category | Risk |
|---|---|---|---|
| 1 | **#10d** rename/delete the shim `acceptPlan` (H-04) | name collision | low |
| 2 | **#10a/10b/10c** clear-siblings + reset on regenerate/open | modal state | trivial |
| 3 | **#6b** call `updateTodaysBanner()` from `markDayCompleted` (+ switchTab) | banner refresh | low |
| 4 | **#6a** move banner into `#view-coach` | banner scope | low |
| 5 | **#9** de-dupe: overview = AI-plan-only summary, calendar owns schedule | Plan tab render | low |
| 6 | **#10e** editable Step-3 preview via `setPlanDay`/`editDay` | new UI | medium |

**Testing note:** Node syntax check per script block, then on-device — generator end-to-end (each frequency, single-highlight chips, Regenerate clears, Accept closes+persists+shows on calendar), complete a workout → banner disappears without reload, Plan tab shows one schedule (default plan) / calendar+summary (AI plan), banner absent on non-coach tabs.

---

**Sign-off:** T2 — 2026-06-08 14:57
