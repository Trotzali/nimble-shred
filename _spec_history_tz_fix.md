# Spec — History date timezone bug (#7) — diagnosis + minimal fix

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors are line + function (re-anchor by name; lines drift). User tz: **Melbourne
UTC+10** (also UTC+11 during AEDT — same bug, wider window).

---

## 1. The bug in one sentence

Date **keys** (`YYYY-MM-DD`) are written in **UTC** via
`new Date().toISOString().split('T')[0]`, but every "which day is it" decision and
the render layer use **local** time — so for UTC+10, any workout logged between
**local 00:00 and 10:00** is stamped with **yesterday's** date.

### Worked failure (the reported "near midnight" case)
- User finishes a set at **Tue 07:00 Melbourne** (= **Mon 21:00 UTC**).
- `new Date().toISOString()` → `"…Mon…T21:00:00Z"` → `.split('T')[0]` = **Monday**.
- `sessionDate` (and `completedWorkouts[…]`) keyed = **Monday**.
- History groups + renders it under **Monday**, though it's Tuesday locally.
- Failure window = **local 00:00–10:00 every day** (the hours where local date is
  ahead of UTC date); felt most "at midnight." Under AEDT (UTC+11) the window is
  00:00–11:00.

---

## 2. Trace — write (UTC) vs decide/render (local)

### 2a. WRITE / KEY sites — all produce a **UTC** calendar date  ⚑ the bug
| Function @line | Pattern | Key it sets |
|---|---|---|
| `saveSetToHistory` @4291 | `new Date().toISOString().split('T')[0]` | `sessionDate` on every logged set (4294) |
| `getTodaysSetData` @4299 | same | "today" filter for carry-forward |
| `getProgression` @4321 | same | "today" used to exclude today from "last session" (4332) |
| `getDateForDay` @4484–4489 | local `getDay()`/`getDate()`/`setDate` **then** `target.toISOString().split('T')[0]` | **the central one** — feeds `markDayCompleted`, `isDayCompleted`, `finishWorkout` |
| `endWorkout` @4425 | `new Date().toISOString().split('T')[0]` | `window._lastWorkoutDate` |
| `saveRPEData` @4544 | `… || new Date().toISOString().split('T')[0]` | `rpeHistory[date]` fallback |
| analytics week arrays @4828, 4867, 4998, 5145 (+today 5138), 5291 | local `getDate()` arithmetic **then** `d.toISOString().split('T')[0]` | `weekDates`/`last14`/`last28` membership tests vs `sessionDate` |

**The core defect is `getDateForDay` (4484):** it does the day-offset arithmetic in
**local** time (`today.getDay()`, `today.getDate()`, `setDate`) and then serialises
with **`toISOString()` (UTC)**. For "today" (`diff = 0`) it's literally
`now.toISOString()`'s date → the UTC day. So local intent → UTC key, off by one
every local morning.

`markDayCompleted` (4462) keys `completedWorkouts[getDateForDay(...)]` and
`isDayCompleted` (5928) reads `completedWorkouts[getDateForDay(idx)]` — both UTC, so
they're *internally* consistent (the calendar dot still lights), but the stored key
(and the cloud `workout.date` at 4471, and `_lastWorkoutDate`) is the wrong day.

> Distinction: the per-set **`date`** field (full ISO instant — `record.date` @4251/
> 4255/4260, spread into the set @4294) is a *timestamp*, correctly an instant; leave
> it. Only the **`YYYY-MM-DD` grouping keys** (`sessionDate`, `completedWorkouts`,
> `rpeHistory`, week arrays) are wrong. This instant is also what makes the optional
> migration in §4 possible.

### 2b. DECIDE sites — **local** (correct intent, but mixed with UTC output)
- `finishWorkout` @4442 `new Date().getDay()` (local weekday) → `markDayCompleted` →
  `getDateForDay` re-serialises to UTC. Local in, UTC out.
- Week-boundary math @4813–4827 / 4989–4998 / 5144 / 5290: Monday/offset from local
  `getDay()`/`getDate()`, **then** UTC-serialised → at week edges this can include or
  drop the wrong day for the morning window.

### 2c. RENDER sites — already **local-correct**, leave unchanged ✅
- Session-replay date @4079: `new Date(ls.date + 'T12:00:00')` — parses the key as
  **local noon** (deliberately dodges parse-as-UTC off-by-one), then
  `toLocaleDateString('en-AU', …)` @4080. Correct.
- History headers @4620–4621, weekly labels: `toLocaleDateString('en-AU', …)` —
  local. Correct.

**Conclusion:** render is fine; the fix is entirely in the **write/key layer**. The
fault is a write/render tz **mismatch**, not a render bug.

---

## 3. Minimal fix — one local-date helper, used for every `YYYY-MM-DD` key

Add a single helper (place near `getDateForDay` ~4484):
```js
// Local calendar date as YYYY-MM-DD (NOT UTC). Fixes #7: keys must match the
// user's local day, the same basis the render layer already uses.
function localDateKey(d) {
    d = d || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
```
*(One-line alternative: `d.toLocaleDateString('en-CA')` yields `YYYY-MM-DD` in local
tz — but it's locale/runtime-dependent; the explicit getters above are the robust
choice.)*

Then replace each UTC key derivation with `localDateKey(...)` — **by function +
pattern**:

| @line | Function | Change |
|---|---|---|
| 4489 | `getDateForDay` | `return localDateKey(target);`  ← **the key fix** (also fixes `markDayCompleted`, `isDayCompleted`, `finishWorkout`, cloud `workout.date`) |
| 4291 | `saveSetToHistory` | `const today = localDateKey();` |
| 4299 | `getTodaysSetData` | `const today = localDateKey();` |
| 4321 | `getProgression` | `var today = localDateKey();` |
| 4425 | `endWorkout` | `window._lastWorkoutDate = localDateKey();` |
| 4544 | `saveRPEData` | `… || localDateKey();` |
| 4828, 4867, 4998, 5145, 5291 | analytics arrays | build dates with `localDateKey(d)` instead of `d.toISOString().split('T')[0]` |
| 5138 | weekly briefing `today` | `localDateKey(now)` |

Pattern rule: **every `…toISOString().split('T')[0]` that becomes a date *key*
→ `localDateKey(…)`.** Leave the full-instant `…toISOString()` timestamps
(`record.date`, `niggleSetAt` @3500, RPE `timestamp` @4553/4566) untouched — those
are points in time, not day buckets.

Because all keys now derive from the same local helper that the render layer already
assumes, write↔decide↔render are consistent end-to-end. **Net effect:** a workout
logged at Tue 07:00 Melbourne keys to **Tuesday**.

---

## 4. Data migration (optional, low-risk) + notes

- **Existing localStorage keeps its UTC keys.** No crash — they're still date
  strings and group per-key. Only pre-fix entries logged in the local-morning window
  remain a day early. The minimal fix simply **stops new mis-keying**; rewriting
  history is not required.
- **Optional precise back-fix for `exerciseHistory`:** each stored set also carries
  a full ISO `date` instant (spread in @4294), so a one-time pass can recompute the
  correct key: `s.sessionDate = localDateKey(new Date(s.date))`. This retro-corrects
  morning-logged sets accurately. `completedWorkouts` and `rpeHistory` store **only**
  the date key (no instant) → can't be retro-derived; leave them.
- **Cloud sync:** `markDayCompleted` (4471) and history push (`saveHistoryToCloud`)
  send the key; post-fix they send the **local** date. Cross-device stays consistent
  as long as all devices use `localDateKey`. Pre-fix cloud rows keep their UTC keys
  (same harmless drift as local).
- **Scope guard:** do not change the `+ 'T12:00:00'` render parse (4079) — it's the
  correct way to read a date-only key as local; it already works.

---

## 5. Test gates

1. **Morning-edge (the bug):** set device clock to **Melbourne, 00:30 and 07:00**;
   log a set + finish a workout. Assert `sessionDate`, `completedWorkouts` key,
   `rpeHistory` key, and the History header all read **today's local date** (not
   yesterday). Pre-fix this fails; post-fix passes.
2. **Calendar dot:** finishing "today" lights today's bubble (`isDayCompleted`) and
   stores today's local date in `completedWorkouts` + cloud `workout.date`.
3. **Carry-forward:** `getTodaysSetData`/`getProgression` treat morning-logged sets
   as *today* (prefill carries; today excluded from "last session").
4. **Week boundaries:** a Mon-morning workout counts in **this** week's volume
   (analytics arrays), not last week's.
5. **No regression daytime:** repeat at **14:00** local (UTC date == local date) —
   behaviour unchanged.
6. **Render unchanged:** history/replay dates still format correctly (render path
   untouched).

— T4, 2026-06-14 20:48 (+10:00)
