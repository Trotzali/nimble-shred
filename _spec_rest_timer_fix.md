# Spec — rest-timer orphaned-interval fix

**Terminal:** T2 (READ-ONLY on `index.html` — no edits, no git). Spec only; T1 applies.
**Symbols referenced by name** (line numbers indicative only).

## 1. The symbols

| role | symbol | notes |
|---|---|---|
| interval id (single source) | **`restTimerInterval`** | module-level `var`, inits `null` |
| countdown value | `restTimerSeconds` | module-level `var` |
| start fn | **`startRestTimer(containerEl)`** | builds the timer DOM, starts the `setInterval` |
| skip fn | **`skipRestTimer()`** | onclick of the "Skip rest" button |
| teardown fn | **`endRestTimer()`** | removes `#active-rest-timer`, restores `#hidden-set-input`, **`speak('Go!')`** |
| re-render fn (the leak site) | **`renderWorkout(exercises)`** | rebuilds `#workout-list` innerHTML wholesale |
| timer DOM | ids `#active-rest-timer`, `#rest-timer-display`, `#rest-progress-fill`, `#hidden-set-input` | all live *inside* the workout-list that `renderWorkout` rebuilds |

**The one and only `setInterval`** for the rest timer is inside `startRestTimer` (assigned to `restTimerInterval`, 1 000 ms tick). There is **no `setTimeout`** in this feature. (The other intervals — `gpsInterval`, `warmupTimer` — are unrelated.)

**Every existing clear of it** (the complete set):
- `startRestTimer` — `if (restTimerInterval) clearInterval(restTimerInterval)` immediately before re-assigning (clear-before-start ✓).
- inside the tick callback — at `restTimerSeconds <= 0`: `clearInterval; restTimerInterval = null; endRestTimer()` (natural completion ✓).
- `skipRestTimer` — `clearInterval; restTimerInterval = null; endRestTimer()` (user skip ✓).

## 2. Where the leak happens

`renderWorkout` **rebuilds `#workout-list` via innerHTML**, which destroys the `#active-rest-timer` node — **but it does NOT clear `restTimerInterval`.** So any re-render that fires while a rest countdown is live orphans the interval: it keeps ticking against a removed DOM.

The orphaned tick is *null-guarded* (`if (display) … / if (fill) …`) so it throws no error — which is exactly why it slipped through. It still:
- keeps decrementing `restTimerSeconds`,
- calls `speak(n)` at ≤3s, and
- at ≤0 calls **`endRestTimer()` → phantom `speak('Go!')`** — announced after the original card is long gone (possibly on another tab, or after the session ended).

**Leak paths (renderWorkout / DOM-destroy with a live interval, none of which clear it):**
1. **`skipExercise()` → `renderWorkout()`** — tapping "Skip / Next Exercise" mid-rest. ← primary repro.
2. **`logSet()` done-branch** — `logSet` calls `renderWorkout` *then* only calls `startRestTimer` when `!appState.exerciseDone[name]`. If the set completes the exercise (no new timer), the prior interval is orphaned. (The normal continue-branch is safe: `startRestTimer`'s clear-before-start covers it.)
3. **`switchTab()` away from Coach mid-rest** — interval keeps running invisibly and will `speak` the countdown/"Go!" on another tab.
4. **`endWorkout()` / `finishWorkout()` mid-rest** — session ends, `#workout-interface` hidden, but the interval lives on → phantom "Go!" after the session.
5. *(benign)* **`window.onload` re-show** calls `renderWorkout`, but no interval is live on a fresh page — no leak, just covered for free by the fix.

## 3. Fix — single source of truth + clear-before-start + clear-on-re-render

`restTimerInterval` is already the single id; the gap is that *clearing* it is scattered and the destroy-path (`renderWorkout`) doesn't clear at all. Centralise the clear and call it from every teardown point.

**Add one helper:**
```js
function clearRestTimer() {
    if (restTimerInterval) { clearInterval(restTimerInterval); restTimerInterval = null; }
}
```

**Wire it (surgical, no refactor):**
| where | change | purpose |
|---|---|---|
| **top of `renderWorkout(exercises)`** | add `clearRestTimer();` as the first statement | **the core fix** — clear-on-re-render; covers skipExercise, logSet done-branch, reload |
| `startRestTimer` | replace the inline `if (restTimerInterval) clearInterval(...)` with `clearRestTimer();` | keep clear-before-start, one code path |
| `skipRestTimer` | replace its inline `clearInterval; restTimerInterval = null;` with `clearRestTimer();` | dedupe |
| `endWorkout` **and** `finishWorkout` | add `clearRestTimer();` | end-session edge case → no phantom "Go!" |

That's **1 helper + 1 critical insertion (renderWorkout) + 4 one-line swaps/adds.** `restTimerInterval` stays the sole id; no behaviour change to the happy path.

### Why `renderWorkout` should call the *raw* clear (not `endRestTimer`)
`renderWorkout` is wiping and rebuilding the DOM, so it must **silence the ticker only** — it must NOT call `endRestTimer()` (that would fire `speak('Go!')` and try to restore a `#hidden-set-input` that's about to be replaced). `clearRestTimer()` is the correct kill-without-announce. The fresh timer (when `logSet` continues) is added *after* `renderWorkout` returns, so the top-of-render clear never removes the new one.

## 4. Edge cases
- **logSet normal flow:** `renderWorkout` (now clears) → `startRestTimer` (clears again via helper, then starts). Idempotent — no double interval, no double "Go!".
- **End session mid-rest:** covered by adding `clearRestTimer()` to `endWorkout`/`finishWorkout`; otherwise the only place a phantom "Go!" could still fire.
- **Pause/resume:** none exists today. If added later, pause→`clearRestTimer()`, resume→`startRestTimer` (or a resume variant) using the same single id — flagged so it isn't reintroduced.
- **Natural completion** (tick hits 0): unchanged — it already clears + nulls + `endRestTimer()`. With the renderWorkout guard in place, a re-render now pre-empts that path cleanly (no race where both fire).
- **`restTimerSeconds`** stale value is harmless — reset on next `startRestTimer`.
- Leaves `gpsInterval` / `warmupTimer` untouched (separate features, already cleared in their own paths).

---

**Sign-off:** T2 | 2026-06-15 11:26
