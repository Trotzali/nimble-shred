# Spec — Plan tab fix (#9 / #10): overview ↔ calendar schedule desync

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors = function + pattern; line numbers indicative (v99 working tree, drift).

## TL;DR
The Plan tab renders, but its **three schedule surfaces read from two different
sources** and drift apart:

| surface | function | reads |
|---|---|---|
| Calendar bubbles (`#week-grid`) | `renderPlanCalendar` | **`activePlan.schedule`** |
| Hero banner / Start | `updateTodaysBanner` → `getEffectiveType` | **`activePlan.schedule`** |
| Overview day-pills (`#plan-overview-content`) | `renderPlanOverview` | **`currentPlan.weekSchedule`** ← the odd one out |

A day edit (`setDayType`) writes **`activePlan.schedule` only**. So once an AI
**consultation** plan is active (which is the only state where `currentPlan`
exists), editing any day updates the calendar + banner but **not** the overview
pills — and the divergence **persists across reload** (and across devices via
cloud). That's the "broken Plan tab".

---

## 1. Render path trace (what actually happens)

- **Init is fine.** `window.onload` (L3335) → `loadAppState` (L3352) defaults
  `appState.activePlan = createDefaultPlan()` (L3360) *before* `renderPlanCalendar`
  (L3338). So `activePlan` is never null at render. `createDefaultPlan` (L3385)
  uses numeric keys `{0..6}`; all readers index `schedule[idx]` with a number —
  JS coerces, so string/number keys are not the issue.
- **`switchTab('plan')`** (L3408) shows `#view-plan` (exists, L1384) and calls
  `renderPlanOverview · renderPlanCalendar · …`. All target IDs exist
  (`#plan-overview-card` L1401, `#week-grid` L1415, `#phase-display` L1408,
  `#adherence-display` L1410, `#day-editor-*` L1963-1968). No missing-element
  early-return, no duplicate function defs (verified: 1 each).
- **`renderPlanCalendar`** (L5855): `plan = activePlan`; bubbles from
  `plan.schedule[idx]`; `bubble.onclick = () => editDay(idx)`; then
  `updatePhaseDisplay` (week/phase + `done/total` from `activePlan.schedule`) and
  `updateAiCoach`. Correct.
- **`renderPlanOverview`** (L5758): name/phases/guidance from `currentPlan`, then
  the **weekly day-pills** at **L5797**:
  ```js
  var schedule = (savedPlan && savedPlan.weekSchedule) ? savedPlan.weekSchedule
               : (activePlan ? activePlan.schedule : null);
  ```
  → **prefers `currentPlan.weekSchedule`.** Pills render `schedule[i]` with
  `onclick="editDay(i)"`.
- **`editDay` → `openDayEditor` → `renderDayEditor`** (L5888-5913) reads/show
  `activePlan.schedule[idx]`; **`setDayType`** (L5915):
  ```js
  appState.activePlan.schedule[idx] = token;   // activePlan ONLY
  saveAppState(); renderPlanCalendar(); renderPlanOverview(); updateTodaysBanner();
  ```
  → re-renders the overview, but the overview re-reads **`currentPlan.weekSchedule`**
  (unchanged) → pills show the **old** type while the calendar/banner show the new.

### Why the two sources exist
Two plan-write paths:
- **Consultation** (L8272-8283) sets **both** `activePlan.schedule = result.weekSchedule`
  **and** `localStorage.currentPlan = result`. In sync *at creation* → the bug is
  latent until an edit.
- **"New Plan" generator** (`selectGoal` L5989 sets `activePlan` via
  `templateSchedule`; `acceptPlan` L~6048 **removes** `currentPlan`). After the
  generator, `currentPlan` is gone → overview falls back to `activePlan.schedule`
  → no desync. **So the bug is consultation-plan-specific.**

This is exactly the duality `_spec_plan_v2.md` flagged out-of-scope ("two plan
sources … note the duality for a future reconcile").

---

## 2. Repro
1. Run an AI **consultation** to "plan" (writes `currentPlan` + `activePlan`).
2. Plan tab: calendar and overview pills agree (just created).
3. Tap a day → day editor → change its type (`setDayType`).
4. **Calendar bubble updates; overview pill does NOT.** Reload → still mismatched
   (overview reads stale `currentPlan.weekSchedule`; calendar reads edited
   `activePlan.schedule`). Banner agrees with the calendar, deepening the "which
   is right?" confusion.

---

## 3. Minimal surgical fix

**One line — make `activePlan.schedule` the single display source for the day
grid** (it's the live, editable, banner-backing source; `currentPlan` stays the
source for name/duration/phases/guidance, none of which day-edits touch).

`renderPlanOverview`, **L5797** — flip the precedence:
```js
// before: prefers currentPlan.weekSchedule (goes stale on edits)
// after:  prefer the live, editable activePlan.schedule; currentPlan only as fallback
var schedule = (activePlan && activePlan.schedule) ? activePlan.schedule
             : ((savedPlan && savedPlan.weekSchedule) || null);
```
Safe: on a fresh consultation plan the two are identical (set together,
L8277/8282), so first render is unchanged; after any edit, all three surfaces
read `activePlan.schedule` and stay in sync. `activePlan.schedule` always has
all 7 keys (default / template / consultation copy / cloud restore), so no blank
pills.

### 3b. Complementary (flag — needed for cross-device correctness, not for the visible fix)
Day edits never reach the cloud: `setDayType` (L5916) updates `activePlan.schedule`
but **not** `currentPlan.weekSchedule`, and `loadFromCloud` (L7890-7895) restores
`activePlan.schedule` **from** `cloudPlan.weekSchedule`. So on device B, an edit
made on device A is lost (and `savePlanToCloud` syncs `currentPlan`, not the
edit). If cross-device edit persistence matters, also mirror in `setDayType`:
```js
appState.activePlan.schedule[idx] = token;
var cp = JSON.parse(localStorage.getItem('currentPlan') || 'null');
if (cp && cp.weekSchedule) { cp.weekSchedule[idx] = token;
    localStorage.setItem('currentPlan', JSON.stringify(cp));
    if (CLOUD_SYNC_ENABLED) { try { savePlanToCloud(cp); } catch(e){} } }
```
3a alone fixes the on-screen desync (#9/#10). 3b is the durability follow-on.

---

## 4. Overlap with `_spec_plan_adaptation.md` (PA-1 shipped v99) — no conflict

- **PA-1** added `getEffectiveType(date, dayIdx) = adherence.overrides[date] ||
  activePlan.schedule[dayIdx]` and wired it into `updateTodaysBanner` +
  `startTodaysWorkout`. It reads the **same `activePlan.schedule`** my fix unifies
  on → **compatible**; the fix actually *helps* PA-2 by making the Plan tab's
  schedule a single source.
- **`overrides` are a per-DATE layer**, separate from the weekly **template**
  (`activePlan.schedule`). The Plan calendar/overview intentionally render the
  template (per the adaptation spec: "Calendar may optionally show an override
  badge; not required for function"). My fix does **not** touch `overrides` and
  does **not** route the Plan tab through `getEffectiveType` — so it can't clash
  with PA-2's detection/prompt work.
- **Watch-out for whoever does PA-2 / a Plan-tab override badge:** if you later
  make the Plan calendar override-aware, route **both** `renderPlanCalendar` and
  `renderPlanOverview` through `getEffectiveType(getDateForDay(idx), idx)` — after
  3a they share one source, so it's one consistent change, not two.
- `setDayType` edits the template (`activePlan.schedule`), which is `getEffectiveType`'s
  fallback; an `overrides[date]` for the same weekday still wins in the banner.
  That's the spec's intended precedence — leave as is.

---

## 5. Verified NOT broken (so the fix stays narrow)
- `#view-plan` / `#week-grid` / `#phase-display` / `#adherence-display` /
  `#day-editor-*` / generator `#generator-step-*` all present and wired.
- `activePlan` non-null at every render (defaulted in `loadAppState`).
- No duplicate definitions of any plan function (single `renderPlanCalendar`,
  `renderPlanOverview`, `editDay`, `openDayEditor`, `setDayType`, `acceptPlan`,
  `templateSchedule`, …).
- Generator path intact: `selectFrequency`→`selectGoal` (builds `activePlan` via
  `templateSchedule`, valid `{0..6}` map) → step-3 `Accept & Start`→`acceptPlan`.
- Consultation path sets both sources in sync at creation.

## 6. Test gate
Consultation → plan → Plan tab: calendar + overview pills + banner all show the
same week. Edit a day → **all three** update immediately and agree; reload →
still agree. Generator "New Plan" → calendar + overview match (currentPlan
cleared). No console errors; adherence/phase unchanged.
