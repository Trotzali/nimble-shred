# Spec — Workout History Fix (audit #7: logged session missing)

**Author:** T2 (read-only investigation terminal)
**Date:** 2026-06-08 16:13
**Scope:** `index.html` — the set-logging → history pipeline. Trace only; no code changed, no git run. File left untracked.
**Locked decision (given, not re-litigated):** history shows only exercises with ≥1 logged set; skipped / "Next Exercise" items correctly do not appear. That filter is correct as-is. This spec finds the *remaining* bug: why a session that **did** have logged sets failed to show up where the user expected ("the 6-exercise Monday").

Line numbers are indicative (they drift as builds land); the fix is specified by **function name + pattern**.

---

## The pipeline, traced

| Stage | Function | What it does with the date |
|---|---|---|
| log | `logSet(name, idx)` ~L3808 | validates, then `saveSetToHistory(name, {weight, reps, date: new Date().toISOString()})` ~L3818 — **commits to storage right here**, then `saveAppState()` + `renderWorkout()` |
| write | `saveSetToHistory(name, setData)` ~L3844 | `const today = new Date().toISOString().split('T')[0];` → pushes `{...setData, sessionDate: today}` into `exerciseHistory[name]` and `localStorage.setItem('exerciseHistory', …)` ~L3845–3849 |
| group | `getWorkoutsByDate()` ~L4130 | iterates every set of every exercise, buckets by `set.sessionDate`; `if (!date) return` is the only skip — **no other filter** |
| render | `renderWorkoutHistory()` ~L4147 | `Object.keys(byDate).sort().reverse()`, renders each date; labels with `new Date(date + 'T12:00:00')` (local) |

Verified writers of `exerciseHistory`: only `saveSetToHistory` (create) and the history editors (`saveHistorySet`, `deleteHistorySet`, `deleteWorkoutDay`, `clearAllWorkoutHistory`). **Cloud restore does not write `exerciseHistory`** (audit H-05 — it's never synced), so there is no overwrite/clobber path that could erase a fresh session.

---

## Verdict on the three candidates

### 1. finish/flush — RULED OUT
Sets are persisted to `localStorage` **at `logSet` time** via `saveSetToHistory`, not at finish. `finishWorkout()` (~L3989) and `endWorkout()` (~L3974) only `markDayCompleted()`, stash `window._lastWorkout*`, null `appState.currentWorkout`, and open the RPE modal — **neither ever touches `exerciseHistory`**. So finishing can neither commit nor lose already-logged sets; there is no flush step that could drop them. (A set the user *typed but never tapped "Log Set"* is intentionally not saved — that is the locked-correct "≥1 logged set" behaviour, not this bug.)

### 2. date-grouping (timezone) — **CONFIRMED ROOT CAUSE**
`saveSetToHistory` stamps `sessionDate` from **`new Date().toISOString()`**, which is **UTC**. The user is in Australia (`en-AU`, Queensland → **UTC+10, no DST**). `toISOString()` therefore yields the **previous calendar day** for any session logged before **10:00 local**, and a session that **straddles 10:00 local gets split** across two `sessionDate` keys.

Consequence for "the 6-exercise Monday":
- Trained **Monday morning before 10:00 AEST** → every set stamped **Sunday's** date → the session renders under **"Sun"**, so it is **absent from Monday** — exactly the "it's missing" report. It was never dropped by a filter; it is **misfiled to the adjacent day**.
- Trained **across 10:00 AEST** → sets split into a Sunday bucket *and* a Monday bucket → the coherent 6-exercise session shows as **two partial days**, neither of which is the complete workout.

This is purely a **write-key** defect. Grouping itself is self-consistent (every reader uses the same UTC string), which is why the data isn't lost — it's just keyed to the wrong local day.

### 3. in-progress vs finished — RULED OUT (as the cause of "missing")
History reads `exerciseHistory`, which is populated at `logSet` time, so logged sets are visible **immediately** — switching to the Plan tab mid-session (`switchTab('plan')` calls `renderWorkoutHistory`, ~L3281) shows them before any finish. Visibility is not gated on `finishWorkout`. (Note: the RPE *badge* only attaches after `saveRPEData` writes `rpeHistory`, but the **session row itself appears without it** — absence of an RPE badge is not absence of the session.)

---

## The consistency trap (critical for the fix)

Every date key in the app is currently derived the **same UTC way**, so they all agree with each other today:

- `saveSetToHistory` → `sessionDate` (history bucket key) — UTC
- `getTodaysSetData()` ~L3853 and `getProgression()`'s `today` ~L3875 — UTC (define "today" for prefill/Smart Spotter)
- `getDateForDay(dayIndex)` ~L4033 (`target.toISOString().split('T')[0]`) → used by `markDayCompleted`/`isDayCompleted` (calendar tick) and by `window._lastWorkoutDate` → the **RPE history key** in `saveRPEData` ~L4093
- `buildStrengthProfile()` ~L7882 and the assessment finish path ~L7836 — UTC

**Therefore: fixing `saveSetToHistory` alone would DESYNC it from the RPE badge and the calendar tick** (which would still be UTC), so a corrected-to-local Monday session would lose its RPE pairing and its day-completed checkmark. The fix must move **all** day-key derivations to local **together**.

---

## Surgical fix (by function + pattern)

**1. Add one shared local-date helper** (place near `getDateForDay`):
```js
function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');   // LOCAL calendar day
}
```

**2. Replace the UTC date-key pattern** `new Date().toISOString().split('T')[0]` (and `target.toISOString().split('T')[0]` in `getDateForDay`) with `dateKey(...)` in **all of these, as one change set**:
- `saveSetToHistory` — the `today` that becomes `sessionDate` *(the primary fix)*
- `getTodaysSetData` — its `today`
- `getProgression` — its `today`
- `getDateForDay` — return `dateKey(target)` (fixes calendar tick + RPE key alignment)
- `saveRPEData` — the `|| new Date()...` fallback
- `buildStrengthProfile` and the assessment-finish `today` (~L7836)

Leave `new Date().toISOString()` **as-is** wherever it's a full timestamp (the per-set `date:` field, `rpeHistory.timestamp`, cloud `created_at`, AI log timestamps, export `exportDate`) — those are not day-bucket keys and are correct.

*(Secondary, same spirit: the analytics week-range builders — Weekly Briefing/Deload/Mechanic ~L4356/4395/4526/4666/4673/4819 — also push `d.toISOString().split('T')[0]` and compare against `sessionDate`. Once `sessionDate` is local, those comparison arrays should use `dateKey` too or week bucketing will be off by the same offset. Not required to make #7's session appear, but bundle it so analytics stay aligned.)*

**3. Do NOT migrate existing stored data.** Old `sessionDate` values were written in UTC; converting them retroactively is risky and unnecessary (mirrors the H-01 "treat stored numbers/keys as entered, never convert" principle). After the fix, **new** sessions key to the correct local day and group whole; pre-existing entries remain visible exactly as they are. A one-time migration is *possible* but should be a separate, explicitly-opted change — out of scope here.

---

## Test checklist (on-device, AEST)

1. **Morning session (pre-10:00 local):** log 2 sets across 2 exercises before 10am → Plan tab → the session appears under **today's** weekday, not yesterday's. *(This is the exact #7 repro.)*
2. **Straddle 10:00 local:** log a set at 09:55 and another at 10:05 → both land in **one** day group, not two.
3. **RPE + tick alignment:** finish a morning workout, set RPE → the **RPE badge** shows on the same history row, and the **calendar day** for today gets its checkmark (no off-by-one).
4. **Same-day grouping:** two separate exercises logged in one session group under a single date with correct "N exercises · M sets".
5. **Mid-session visibility (candidate-3 sanity):** log a set, switch to Plan **without finishing** → the session row is already present.
6. **Regression:** evening session (post-10:00) still files under today (unchanged behaviour); existing historical entries still render.

---

**Sign-off:** T2 — 2026-06-08 16:13
