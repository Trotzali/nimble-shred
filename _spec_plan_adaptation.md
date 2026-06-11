# Spec — Plan adaptation: missed-session / no-guilt return (#20 + #19)

**Type:** READ-ONLY analysis + build spec. No edits, no git, index.html untouched.
**Audited against:** committed/on-disk `index.html` at **v87**.
**Thesis:** make the plan **forgiving** — when you return after missing planned session(s), a calm, low-guilt prompt offers to catch up, swap, or skip, with auto-defaults so the plan **never nags**. **Deterministic-first** (works with zero AI); an optional AI re-plan (#19) handles multi-week derailment later.

---

## 1. How adherence is tracked TODAY (and what happens on a miss: nothing)

### 1.1 The plan model
- `appState.activePlan = { name, frequency, schedule:{0..6:type}, week, phase }` (`:3076`, `:5807`, default `createDefaultPlan` `:3287`).
- **`schedule` is a recurring weekly template** — a Sun→Sat map of day-index → type (`push/pull/legs/full/cardio/nimble/rest`). It repeats every week; there is **no per-date plan instance**.
- **`week` and `phase` are static display labels** — rendered by `updatePhaseDisplay` (`:5754` "Week N - Phase") but **never auto-incremented** anywhere in the file. The plan does not advance itself.

### 1.2 Completion / adherence
- `completedWorkouts` = `localStorage` map **keyed by date string** (`YYYY-MM-DD`) → `true`. Written by `markDayCompleted(dayIndex)` (`:4312`) via `getDateForDay(dayIndex)` (`:4334`, = the date of that weekday **in the current week**).
- `isDayCompleted(idx)` (`:5746`) = `completedWorkouts[getDateForDay(idx)] === true`.
- `updatePhaseDisplay` (`:5752`) shows **this week's** `done/total` (non-rest days completed).
- Calendar (`renderPlanCalendar` `:5705`) renders the current Sun→Sat week; a completed day gets a check (`:5726`).

### 1.3 What happens on a MISSED day: **nothing deterministic**
- A planned non-rest weekday in the past with no completion simply **renders without a check mark** — the calendar doesn't even visually flag "missed."
- The **only** response is `updateAiCoach()` (called from `renderPlanCalendar` `:5733`): a static **guilt-flavoured** card — at <50% weekly adherence it shows *"Need More Consistency … You've missed several workouts this week"* (`:6850-6857`). No catch-up, no shift, no recovery path.
- **App-open sequence** (`window.onload` `:3268`): `loadAppState → renderPlanCalendar → updateTodaysBanner`. This is the hook point for a return prompt (state is loaded, plan + completions available).
- `updateTodaysBanner` (`:5883`) hides itself if today is rest or already done, else shows "Start Workout" for `schedule[today]`. `startTodaysWorkout` (`:5906`) runs `quickStartWorkout(schedule[today])`.

**Net:** the app tracks completion-by-date and shows weekly adherence, but a miss produces only a guilt message — no structured way to recover. That's the gap #20 fills.

---

## 2. Deterministic-first adaptation layer

### 2.1 New state (persisted via `saveAppState`, key `nimbleState_v45`)
```
appState.adherence = {
  skipped:   { 'YYYY-MM-DD': true, … },   // misses resolved as "skip" (manual OR auto after N days) — suppresses re-prompt
  overrides: { 'YYYY-MM-DD': 'pull', … }, // a date's EFFECTIVE session type (set by catch-up / swap)
  lastPrompt: '2026-06-11'                 // date the return prompt last shown — one prompt per calendar day
}
```
Additive; absent → treated as empty (no behaviour change). **Flag:** include `adherence` in the cloud blob (`:7512` / restore `:7552`) so overrides/skips sync across devices.

### 2.2 Effective-type resolver (one choke point)
```
function getEffectiveType(date, dayIdx) {
    var ov = appState.adherence && appState.adherence.overrides;
    return (ov && ov[date]) || appState.activePlan.schedule[dayIdx];
}
```
Repoint the two consumers to it so catch-up/swap actually take effect:
- `updateTodaysBanner` (`:5890`) — `type = getEffectiveType(todayDate, dayIdx)`.
- `startTodaysWorkout` (`:5908`) — `quickStartWorkout(getEffectiveType(todayDate, dayIdx))`.
Calendar may optionally show an override badge; not required for function.

### 2.3 Missed-session detection (deterministic, rolling, capped)
```
function detectMissedSessions() {
    // rolling lookback spans the Sun/Sat week boundary; cap so a long absence can't surface 20 misses
    LOOKBACK = 7 days;  AUTO_SKIP_AFTER = 3 days
    for each date d in [today-LOOKBACK .. yesterday]:
        wd = weekday(d)
        type = activePlan.schedule[wd]
        if type === 'rest' → continue
        if completedWorkouts[d] → continue          // done
        if adherence.skipped[d] → continue           // already resolved
        if adherence.overrides[d] → continue          // already moved
        if (today - d) > AUTO_SKIP_AFTER → mark skipped[d]=true (SILENT, no prompt) and continue
        else → push {date:d, weekday:wd, type} to missed[]
    return missed   // open, recent, unresolved
}
```
- **Rolling 7-day lookback** so opening on Monday still sees last Fri/Sat (week-boundary edge).
- **Auto-skip > N=3 days** → stale misses are silently resolved, never shown. The plan can't nag about old misses.

### 2.4 The low-guilt return prompt
Shown in `window.onload` after `loadAppState`/`renderPlanCalendar`, **only if** `missed.length > 0` AND `adherence.lastPrompt !== today` AND there's an active plan AND today isn't already done. Set `lastPrompt = today` on show (one per day).

**Tone:** warm, no judgement. Headline e.g. *"Welcome back — life happens. Want to pick up where you left off?"* Then the missed session(s) and three actions:

| Action | Effect (deterministic) |
|---|---|
| **(a) Do it today** *(shift week)* | `overrides[today] = missed.type`; resolve the missed date (`skipped[missedDate]=true`). Today's banner/Start now run the missed session. "(shift week)" = the week effectively slides; the displaced original recurs next week (template is recurring, so no data loss). *Minimal deterministic version overrides today's slot; full cascade reflow is a flagged enhancement, §4.* |
| **(b) Swap with today** | Two-slot swap: `overrides[today] = missed.type` AND `overrides[missedDate] = todaysOriginalType` (record-keeping / next-up intent). You do the missed type today; today's original is the next thing queued. No cascade. |
| **(c) Skip & continue** | `skipped[missedDate] = true` for all surfaced misses; schedule unchanged; plan proceeds. No re-prompt. |

**Multiple misses (no pile-up):** if `missed.length > 1`, summarise ("2 sessions slipped: Pull · Tue, Legs · Wed") but offer catch-up for **only the most recent one** today; the remainder are skip-noted on (a)/(b) and fully skipped on (c). Never present a guilt stack of N catch-ups.

**Long absence (> LOOKBACK days since `lastPrompt`/last completion):** don't enumerate — show a single **"Welcome back after a break"** card: auto-skip all stale misses and offer **(1) Resume plan from today** (clear nothing, just proceed) or **(2) Adjust my plan** (the optional AI re-plan, §3). This is the #19 entry point.

### 2.5 Soften the existing guilt card
`updateAiCoach`'s <50% branch (`:6850-6857`, "Need More Consistency / You've missed several workouts") is the guilt this feature exists to remove. Reword to no-guilt, action-oriented copy (e.g. *"Some sessions slipped this week — totally normal. Tap a day to pick one back up when you're ready."*) and, when `missed.length>0`, link it to the return prompt. Part of the same build.

---

## 3. Optional AI extension later (#19 — multi-week derailment → re-plan)
**Deterministic-first stays authoritative; AI is opt-in and additive.**
- **Trigger (never automatic):** the "Adjust my plan" button on the long-absence card (§2.4), or chronic derailment (e.g. ≥2 consecutive weeks <50% adherence). It is always a tap, never a silent rewrite.
- **Mechanism:** reuse the existing **consultation generate path** (`generateFromConsultation` `:7778`, `_spec_ai_features_wiring.md` §1) seeded with `consultProfile` + a short adherence summary ("trained 1/4 last 2 weeks; available days likely fewer than planned"). The AI returns a fresh `weekSchedule` → applied via the existing `appState.activePlan`/`currentPlan` write.
- **Prompt sketch addendum (system):** "The client has fallen behind their current plan. Propose a realistic, lower-friction schedule (fewer days if needed) rather than guilt. Same JSON shape as plan generation." 
- **Degradation:** AI unavailable → the deterministic "Resume plan from today" path always works. No AI failure blocks return.
- **No backend change** — rides the existing `/api/drive` consultation contract.

---

## 4. Edge cases (explicit)
- **Multiple misses:** §2.4 — summarise, offer one catch-up, skip-note the rest; no guilt stack.
- **Week boundary:** rolling 7-day lookback (`detectMissedSessions`) spans Sat→Sun; `completedWorkouts` is global-by-date so detection is correct across the boundary even though the calendar renders one week.
- **Phase boundary:** `phase` is a static multi-week label and `week` never auto-advances, so an intra-week shift/swap **cannot cross a phase** today — no special handling needed. **Flag for the future:** if `week` ever auto-advances, a catch-up that pushes a session into a new week must inherit that week's phase; revisit then.
- **Long absence (weeks):** single welcome-back card, auto-skip all stale, resume/re-plan — never a wall of misses.
- **No active plan / today is rest / today already completed:** no prompt (guards in §2.4).
- **Already prompted today:** `lastPrompt === today` → silent.
- **Override hygiene:** `overrides[date]` for a date that has since been completed is harmless (resolver only consults today's date); optionally garbage-collect overrides older than the lookback on open.
- **Default plan (`createDefaultPlan`):** treated like any plan; its rest days are skipped by detection.
- **Metadata/AI absent:** irrelevant to the deterministic layer — it uses only `schedule` + `completedWorkouts`.

---

## 5. Build phasing — ONE category ("no-guilt return"), test gates

| Phase | Scope | Build | Test gate |
|---|---|---|---|
| **PA-1 State + resolver** | `appState.adherence` shape; `getEffectiveType`; repoint banner + `startTodaysWorkout`; add to cloud blob | resolver + 2 call-site swaps; no UI prompt yet | Set `overrides[today]='pull'` manually → banner + Start run Pull; no override → identical to today; persists across reload + cloud sync |
| **PA-2 Detection + prompt** | `detectMissedSessions` (rolling 7d, auto-skip >3d); low-guilt return prompt with (a)/(b)/(c); once-per-day guard; soften `updateAiCoach` copy | onload hook after `renderPlanCalendar`; modal/card UI | See gates below |
| **PA-3 (optional, later) AI re-plan** | Long-absence "Adjust my plan" → consultation generate seeded with adherence | reuse `generateFromConsultation`; trigger button only | Long absence → welcome-back; "Adjust" → fresh schedule applied; AI down → "Resume" still works |

**PA-2 test gates:**
1. Miss planned Tue (no completion), open Wed → prompt once; lists "Pull · Tue"; 3 actions.
2. **(a) Do it today** → `overrides[today]=pull`, missed Tue resolved; banner/Start = Pull.
3. **(b) Swap** → `overrides[today]=pull` AND `overrides[Tue]=todayOriginal`; both reflected.
4. **(c) Skip** → `skipped[Tue]=true`; schedule unchanged; reopen same day → **no** re-prompt.
5. Reopen same day after any action → no re-prompt (`lastPrompt` guard).
6. Miss > 3 days old → **auto-skipped silently** on open, no prompt.
7. Absence > 7 days → single welcome-back card; all stale auto-skipped; resume/re-plan offered.
8. No plan / today rest / today already done → **no prompt**.
9. Multiple misses (Tue+Wed) → summarised; one catch-up offered; remainder skip-noted; no guilt stack.
10. `updateAiCoach` <50% → no-guilt copy (no "Need More Consistency").

PA-1 ships alone (silent, behaviour-preserving). PA-2 is the visible feature. PA-3 is optional and rides the existing AI consultation — no backend change.

---

## 6. Summary
- **Today:** plan = recurring weekly template; `week`/`phase` are static (never advance); completion logged by date; a miss yields **only** a guilt card (`updateAiCoach` <50%). No recovery path.
- **#20 (deterministic):** on app open, `detectMissedSessions` (rolling 7d, auto-skip >3d) → a **low-guilt prompt**: (a) do it today / shift, (b) swap with today, (c) skip & continue — via an `adherence{skipped,overrides,lastPrompt}` state and a `getEffectiveType` resolver wired into the banner + `startTodaysWorkout`. One prompt/day; stale misses auto-skip so it **never nags**. Soften the existing guilt copy.
- **#19 (optional AI, later):** long-absence/chronic derailment → opt-in "Adjust my plan" reusing the consultation generate path; deterministic resume always works without it.
- **Edge cases** (multiple misses, week boundary, phase boundary, long absence, no plan) all defined; **no backend change** required.

---

*Signed off — T5, terminal pts/T5, 2026-06-11 17:58 AEST (07:58 UTC). Read-only: no edits, no git, index.html untouched.*
