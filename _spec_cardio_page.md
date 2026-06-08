# Spec — Cardio / GPS Page (audit #24, was H-06): make it reachable + fix `renderCardioHistory`

**Author:** T2 (read-only investigation terminal)
**Date:** 2026-06-08 16:48
**Scope:** `index.html` — cardio page, GPS tracking, cardio logging, cardio-day handling. Trace only; no code changed, no git run. File left untracked.
**Locked decision (given):** cardio is **staying**. This spec finds why it's unreachable, fixes the undefined `renderCardioHistory`, surfaces the other broken cardio refs, and decides whether a Quick Start "Cardio" type slots in.

Line numbers are indicative (they drift as builds land); fixes are specified by **function + pattern**.

---

## Current state

The cardio feature is **fully built but orphaned**. Everything exists except an entry point:

- **Page markup** `#view-cardio` ~L1378–1413 — a proper `<div class="container">` with three cards: Live GPS Tracking (activity select + Start), Quick Log Cardio (type/duration/distance + Log), Recent Cardio (`#cardio-history`).
- **GPS modal** `#gps-tracking-modal` ~L1839–1868 — live stats + canvas route map + Save Route.
- **Logic, all present:** `logCardioSession()` ~L5667, `loadCardioHistory()` ~L5691, the GPS suite `startGpsTracking`/`updateGpsPosition`/`updateGpsDuration`/`drawGpsRoute`/`stopGpsTracking`/`saveGpsRoute` ~L6050–6229.
- **`switchTab` already supports it:** the cardio branch `if (tab === 'cardio') loadCardioHistory();` ~L3282 is wired, and the nav-highlight lookup (attribute selector, ~L3278) handles any tab name generically.

So the container renders, the data loads, and the tab-switch handler works — but **nothing ever calls `switchTab('cardio')`**.

---

## Root cause 1 — unreachable page: no nav button / no route

The nav bar (`.nav-bar` ~L1751–1767) has exactly **five** buttons: Coach (`coach`), Recovery (`garmin`), Plan (`plan`), Library (`encyclopedia`), Settings (`settings`). **There is no cardio button**, and a full-file check confirms **zero `switchTab('cardio')` call sites** anywhere (markup or JS). The page is therefore an **orphan**: valid container + working handler, but no route to reach it. (This is exactly audit H-06/#24's "no nav entry; page is dead/orphaned.")

### Where a nav entry hooks in — surgical fix

Add a sixth `.nav-btn` inside `.nav-bar` (~L1751–1767), mirroring the existing pattern, e.g.:
```html
<button class="nav-btn" onclick="switchTab('cardio')">
    <div class="nav-icon"><!-- IC.cardio bike/run glyph --></div>Cardio
</button>
```
Nothing else is required for reachability: `switchTab('cardio')` already activates `#view-cardio`, highlights the button (attribute-selector at ~L3278), and calls `loadCardioHistory()` (~L3282).

**Flag (layout decision, not blocking):** six buttons crowd a mobile bottom bar. Options, in order of least change:
1. **6th nav button** (above) — most direct, makes cardio a first-class tab.
2. **Entry button on Coach or Plan** (`onclick="switchTab('cardio')"`) — keeps the bar at five; cardio is one tap deeper.
3. **Fold into Recovery** (`#view-garmin`) — thematically adjacent (both "conditioning/recovery"), no new nav slot; larger UI merge.
Recommend (1) if cardio is meant to be a peer of Plan/Recovery; (2) if the bar must stay at five. Either way the JS fix is identical (a `switchTab('cardio')` trigger).

---

## Root cause 2 — `renderCardioHistory` is undefined

**Where it's called:** exactly one site — `saveGpsRoute()` ~L6229, the last line after a GPS route is saved.

**The bug:** `renderCardioHistory` **does not exist**. The real renderer is **`loadCardioHistory()`** (~L5691). So finishing a GPS activity runs `saveGpsRoute`: validates (`gpsRoute.length < 2`), builds `routeData`, `unshift`s into `localStorage 'cardioHistory'`, persists, `speak(...)`, `stopGpsTracking()` (closes the modal) — **then throws `ReferenceError: renderCardioHistory is not defined`**. Because the localStorage write and `stopGpsTracking()` both run *before* the bad call, **the route is saved and the modal closes**; the error is uncaught console noise with nothing after it, so no data is lost — but the Recent Cardio list isn't refreshed in-place.

**What it should render / data it reads:** identical to `loadCardioHistory()` — read `localStorage 'cardioHistory'` (an array), render the last 10 (newest first) into `#cardio-history` with icon, type, date, duration, and optional distance.

**Surgical fix:** make the call resolve to the existing renderer. Either:
- **(A, minimal)** change the `saveGpsRoute` call site from `renderCardioHistory();` → `loadCardioHistory();`, **or**
- **(B)** add a thin alias near `loadCardioHistory`: `function renderCardioHistory() { loadCardioHistory(); }` (covers any future callers / matches the naming other render* functions use).
Recommend **A** (one-token change, no new symbol). No new rendering logic needed.

**Data-shape note (verified, no fix needed):** the two writers of `cardioHistory` produce compatible objects — quick-log `{type, duration, distance, date}` (`logCardioSession` ~L5672) and GPS `{type, date, distance, duration, route, pace}` (`saveGpsRoute` ~L6213). `loadCardioHistory` reads only `type/date/duration/distance`, so GPS entries render correctly and the extra `route`/`pace` are ignored. One minor inconsistency: `logCardioSession` `push`es (appends) while `saveGpsRoute` `unshift`s (prepends); `loadCardioHistory` does `.slice(-10).reverse()` (takes the **last** 10 then reverses), so prepended GPS entries can fall outside the "last 10" window once history grows. Cosmetic ordering only — flag for the same fix batch (prefer sorting by `date` desc, or standardise on one insert direction), not required for #24.

---

## Other broken / weak cardio refs

### Cardio-day handling routes to a random lifting workout (audit M-01) — still live
`generateWorkoutByType(type)` (~L3521) has **no `cardio` branch**: `push/pull/legs/nimble/full` are handled, and `cardio` falls through to the final `return true` (~L3528) → the **entire** exercise DB → a random strength/mobility workout. Triggers:
- **Planned cardio day → "Start Workout":** the today banner's `startTodaysWorkout()` (~L5558) does `quickStartWorkout(appState.activePlan.schedule[dayIdx])`; for a cardio day that's `quickStartWorkout('cardio')` → check-in → 6 random lifts. Cardio days are routinely scheduled: the **default plan** has cardio on Tue (~L3262), the **plan generator** schedules it (5-/6-day maps ~L5485–5486), `editDay` includes it in the cycle (~L5418), and **AI plans** emit `cardio` (~L7499/7501).

**Surgical fix (depends on the §"Quick Start Cardio" decision below):** give cardio an explicit destination instead of the lifting generator. Cleanest: in `startTodaysWorkout` (and anywhere `quickStartWorkout` may receive `'cardio'`), special-case it — `if (type === 'cardio') { switchTab('cardio'); return; }` — routing the user to the cardio page (GPS / quick-log) rather than fabricating a barbell session. (Once the cardio page is reachable via fix #1, this redirect has somewhere to land.)

### Minor
- **`stopGpsTracking` / `saveGpsRoute` ordering** — `saveGpsRoute` calls `stopGpsTracking()` (which closes the modal and clears `gpsRoute`/timers) *before* its final render call; fine today, but any future code reading `gpsRoute` after the save must run before `stopGpsTracking`. Note only.
- **`logCardioSession` marks the day complete** via `markDayCompleted(new Date().getDay())` (~L5684) using a local `getDay()` index — consistent with the calendar; GPS `saveGpsRoute` does **not** mark the day complete (inconsistency: a tracked run doesn't tick the planned cardio day). Flag for the fix batch — add `markDayCompleted(new Date().getDay())` to `saveGpsRoute` if a GPS session should satisfy a cardio day.

---

## Decision — does a Quick Start "Cardio" type slot in cleanly? **No — route to the cardio page instead.**

A "Cardio" chip alongside Push/Pull/Legs/Full/Nimble (~L1215–1219) would call `quickStartWorkout('cardio')` → `generateWorkoutByType('cardio')` → `startWorkout(exercises)`, which renders the **set-by-set weight×reps workout UI**. That is the wrong modality for cardio, which is logged by **duration/distance** (or tracked live via GPS), not as logged sets. Forcing cardio through the lifting flow would reproduce M-01 (random lifts) or require a parallel "cardio workout" rendering path — net complexity for no benefit.

**Cleaner:** make any cardio entry point — a Quick Start "Cardio" button **and** the planned-cardio-day "Start" — call **`switchTab('cardio')`** to land on the existing GPS/quick-log page. So:
- Do **not** add `cardio` to `generateWorkoutByType` or the set-based Quick Start flow.
- If a Quick Start "Cardio" affordance is wanted, wire it to `switchTab('cardio')` (a navigation shortcut, not a generated workout).
- Apply the same redirect in `startTodaysWorkout` for cardio days (see above).

This keeps cardio's logging model intact and reuses the page fix #1 makes reachable.

---

## Suggested fix order

| # | Item | Pattern | Risk |
|---|---|---|---|
| 1 | **Reachability** — add `switchTab('cardio')` nav button (or Coach/Plan entry) | nav-bar markup | low |
| 2 | **`renderCardioHistory`** — rename call in `saveGpsRoute` → `loadCardioHistory()` (or add alias) | one-token / alias | trivial |
| 3 | **Cardio-day redirect** — `startTodaysWorkout`/`quickStartWorkout` special-case `'cardio'` → `switchTab('cardio')` | guard clause | low |
| 4 | **Batch polish** — GPS save marks day complete; unify cardioHistory ordering (`date` desc) | `saveGpsRoute` / `loadCardioHistory` | low |

**Testing note:** Node syntax check per script block, then on-device — nav to Cardio page (button appears, page shows, highlight correct); Quick Log a session → appears in Recent Cardio; run GPS Start → Save Route → no console ReferenceError, route appears in Recent Cardio; planned cardio day → "Start Workout" lands on the cardio page (not a random lifting session).

---

**Sign-off:** T2 — 2026-06-08 16:48
