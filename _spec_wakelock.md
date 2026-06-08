# Spec — Keep screen awake during workouts (audit #4)

**Type:** Read-only analysis / implementation spec. No code was changed by this pass.
**Targets a future serial build.** `index.html` is to be edited later, not here.
**No git was run.** Line numbers are **indicative** (current tree, header `v67`);
re-anchor by function name before editing — the tree drifts as sibling builds land.

---

## 0. Pre-flight (confirmed)

- **No wake lock exists today.** Zero `navigator.wakeLock` / `wakeLock` /
  `visibilitychange` references in `index.html` (grep-confirmed). Audit #4 stands.
- **Session "active" flag already exists:** `appState.currentWorkout` is set on
  start and nulled on end (see §3). This spec keys the lock off that flag, so
  "only while a session is active" needs no new state beyond the toggle.
- **State persistence:** `saveAppState()` L3237 → localStorage `nimbleState_v45`;
  `loadAppState()` L3225 merges **shallow**: `appState = {...appState, ...JSON.parse(saved)}`
  (L3229). Adding a default to the `appState` literal therefore back-fills for
  existing users automatically (their saved blob lacks the key, so the default
  survives the spread). No migration needed.
- **Alignment target:** T3's `_spec_logmode_integration.md` §2e/§5 already names
  `requestWakeLock()` and `releaseWakeLock()` as the functions its time-mode
  countdown (#5) calls on start / on countdown-end / on `logSet` /
  on `visibilitychange`. This spec **defines** those two functions plus one
  declarative core so #4 (toggle) and #5 (countdown) share exactly one path
  (see §5 — Reconciliation).

---

## 1. Settings toggle (UI) + appState

### 1a. State — add one field to the `appState` literal  (L3023–3035)
Mirror the existing `voiceEnabled` flag. **Default ON** (the feature is the
point; product may flip to opt-in — flagged).
```js
let appState = {
    ...
    voiceEnabled: true,
    voiceLevel: 'standard',
    weightUnit: 'kg',
    keepAwake: true,        // NEW — #4 screen wake lock; default on
    selectedExercises: [],
    ...
};
```
Back-compat: existing users (no `keepAwake` in saved state) inherit `true` via
the L3229 shallow merge. New users get `true`. Once toggled, it persists.

### 1b. Settings card — new toggle, mirroring the Voice Coach card  (insert after L1582)
The Voice Coach card (L1568–1582) is the exact pattern to copy:
`<div class="card"><h3>…icon… Title</h3><label><input type="checkbox" id="…" checked onchange="…()"> Label</label></div>`.
Insert a sibling card right after it (after the Voice Coach card closes, ~L1582,
before the Weight Unit card at L1584):
```html
<div class="card">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        style="display:inline-block;vertical-align:middle;margin-right:4px">
        <rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/></svg> Display</h3>
    <label>
        <input type="checkbox" id="keep-awake" checked onchange="saveWakeSettings()">
        Keep screen awake during workouts
    </label>
    <p class="text-muted" style="margin-top:10px; font-size:0.8em;">
        Stops your screen dimming or locking while a session is active. Released
        automatically when you finish. Not available on every browser.
    </p>
</div>
```
- `id="keep-awake"` is unique (checked — no collision; cf. the duplicate
  `exercise-count-slider` issue noted in `_spec_quickwins.md`, don't repeat it).
- `checked` is just the static default; real state is applied in `updateSettingsUI`
  (§1d), same as `voice-enabled`.

### 1c. Handler — `saveWakeSettings()`  (new, beside `saveVoiceSettings` ~L5910)
Mirror `saveVoiceSettings()` (L5910–5914), then reconcile the lock immediately so
flipping it mid-session takes effect at once:
```js
function saveWakeSettings() {
    appState.keepAwake = document.getElementById('keep-awake').checked;
    saveAppState();
    syncWakeLock();   // apply now: acquire if a session is live, else release
}
```

### 1d. Settings sync — reflect saved state on the toggle  (`updateSettingsUI` L5880–5897)
Mirror the `voice-enabled` sync block (L5881–5882). Add, null-guarded:
```js
if (document.getElementById('keep-awake')) {
    document.getElementById('keep-awake').checked = appState.keepAwake !== false; // default-on
}
```

---

## 2. The wake-lock module (new — single source of truth)

Place near the other lifecycle helpers (e.g. just below `saveAppState` L3239, or
beside the voice block). One declarative core + two named wrappers T3 calls.

```js
// ===== Screen Wake Lock (#4) — declarative: lock is held iff a session is
// active AND the user opted in AND the API is available. Everything routes here. =====
let _wakeLock = null;
let _wakeWarned = false;

async function syncWakeLock() {
    const supported = ('wakeLock' in navigator);
    if (!supported) {
        if (appState.keepAwake && !_wakeWarned) {        // dev-visible, user-silent
            _wakeWarned = true;
            console.warn('[wakelock] Screen Wake Lock API unsupported — feature inert.');
        }
        return;                                          // fail silently (req: unsupported)
    }
    const want = !!appState.keepAwake && !!appState.currentWorkout;
    if (want && !_wakeLock && document.visibilityState === 'visible') {
        try {
            _wakeLock = await navigator.wakeLock.request('screen');
            // Browser auto-releases on tab-hide/device-lock; null our ref so the
            // visibilitychange handler (§4) re-acquires on return — the standard gotcha.
            _wakeLock.addEventListener('release', () => { _wakeLock = null; });
        } catch (e) { /* policy / no user-gesture / unsupported surface — silent */ }
    } else if (!want && _wakeLock) {
        try { await _wakeLock.release(); } catch (e) {}
        _wakeLock = null;
    }
}

// T3 (#5) compatibility — the countdown calls these by name. Both are the SAME
// path: syncWakeLock() reads desired state, so it never drops a live session
// lock at countdown-end / logSet, and never double-acquires. (See §5.)
function requestWakeLock() { return syncWakeLock(); }
function releaseWakeLock() { return syncWakeLock(); }
```

Why declarative (not imperative acquire/release): a single `syncWakeLock()` that
reconciles to `keepAwake && currentWorkout` is idempotent and race-free. The
toggle, the four lifecycle hooks, the countdown, and the visibility handler all
call the *same* function; correctness falls out of the state, not call ordering.

---

## 3. Lifecycle hook points (request on start, release on end)

`appState.currentWorkout` is the active-session flag. Call `syncWakeLock()`
**immediately after** each site that changes it. Two start sites (one bypasses
`startWorkout`), two end sites.

| Hook | Function @line | currentWorkout transition | Add |
|---|---|---|---|
| Start (main funnel: custom builder, assessment, quick-start cardio/nimble) | `startWorkout()` set @L3562 | null → exercises | `syncWakeLock();` after `saveAppState()` (L3565) |
| Start (**bypass** — quick-start push/pull/legs warmup branch) | `_executeQuickStart()` set @L3432 | null → exercises | `syncWakeLock();` after `saveAppState()` (L3435) |
| End (early, confirmed) | `endWorkout()` null @L3988 | exercises → null | `releaseWakeLock();` after `saveAppState()` (L3990) |
| End (completed; also assessment via `patchFinishWorkoutForAssessment`) | `finishWorkout()` null @L4009 | exercises → null | `releaseWakeLock();` after `saveAppState()` (L4011) |

Notes:
- **Two start sites, not one.** `_executeQuickStart` (L3418) sets `currentWorkout`
  directly at L3432; its push/pull/legs branch (L3438–3440) runs `startWarmup` +
  `renderWorkout` and **does not** call `startWorkout`, while its else branch
  (L3442) does. Hooking only `startWorkout` would miss warmup-led sessions —
  hence the explicit `_executeQuickStart` hook. (Assessment L7744 also sets it but
  then calls `startWorkout` L7750, so it's covered by the funnel.)
- **End ordering matters:** both end functions null `currentWorkout` *before* we
  call `releaseWakeLock()`, so `syncWakeLock()` sees `want=false` and actually
  releases. Keep the call after the null assignments.
- **No new end paths needed:** any future "session over" route just needs to null
  `currentWorkout` and call `syncWakeLock()`. `skipExercise()` (L3837) advances
  within a session and must **not** release.

---

## 4. visibilitychange re-acquire (the standard gotcha)

A screen wake lock is **auto-released by the browser whenever the page is hidden**
(tab switch, minimise, device lock). Our `release` listener nulls `_wakeLock`, so
on return we must re-acquire. Register **once** during init, after `loadAppState()`
(called at L3216, inside the onload/init path):

```js
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncWakeLock();  // re-acquire iff session+optin
});
```
- Re-acquisition only fires when the tab is visible (required: `request()` throws
  if called while hidden — `syncWakeLock` already gates acquire on
  `visibilityState === 'visible'`).
- No action needed on `hidden`: the browser releases for us; `syncWakeLock` will
  rebuild the lock on the next `visible`.
- An initial `syncWakeLock()` at end of init is harmless (no session yet → no-op),
  and self-heals if a session were ever restored as active.

---

## 5. Reconciliation with T3's #5 countdown — "one path"

T3 §2e: time-mode "Start countdown" calls `requestWakeLock()`; countdown-end and
`logSet` call `releaseWakeLock()`. Naive imperative versions would **fight the
toggle** — e.g. the first `logSet` would drop a lock the session still needs.
This spec removes the conflict by making both names resolve to `syncWakeLock()`:

| #5 countdown event | calls | `syncWakeLock()` outcome (session live, opted in) |
|---|---|---|
| Start countdown | `requestWakeLock()` | lock already held by the session → no-op (or acquires if somehow absent) |
| Countdown end | `releaseWakeLock()` | session still active → **lock kept** (not dropped) |
| `logSet` | `releaseWakeLock()` | session still active → **lock kept** |
| Session finish/end | (§3) `releaseWakeLock()` after `currentWorkout=null` | `want=false` → **released** |

So the lock's true lifetime is the **session**, gated by the **toggle**; the
countdown is just another caller of the same reconciler. If the toggle is OFF,
`want` is false throughout and the countdown still runs — it just doesn't hold a
lock (degrades to a plain countdown, matching T3's "degrade gracefully"). #4 and
#5 therefore implement **zero** duplicate lock logic; T3 calls the functions
defined here verbatim. No edits to T3's countdown are implied beyond using these
names.

---

## 6. Change-site summary (by function)

| Function @line | Change | Tie |
|---|---|---|
| `appState` literal @L3023–3035 | add `keepAwake: true` | #4 |
| Settings UI @~L1582 (after Voice Coach card) | new "Display" card + `#keep-awake` toggle | #4 |
| `saveWakeSettings()` (new, ~L5914) | persist toggle + `syncWakeLock()` | #4 |
| `updateSettingsUI()` @L5880–5897 | sync `#keep-awake.checked` (default-on) | #4 |
| `syncWakeLock` / `requestWakeLock` / `releaseWakeLock` (new, ~L3239) | the module | #4, #5 |
| `startWorkout()` @L3565 | `syncWakeLock();` after save | #4 |
| `_executeQuickStart()` @L3435 | `syncWakeLock();` after save (warmup-bypass) | #4 |
| `endWorkout()` @L3990 | `releaseWakeLock();` after save | #4 |
| `finishWorkout()` @L4011 | `releaseWakeLock();` after save | #4 |
| init/onload @~L3216 | register `visibilitychange` re-acquire | #4 |

---

## 7. Non-negotiables / risk flags

- **Feature-detect + try/catch everywhere.** `'wakeLock' in navigator` guard; all
  `request`/`release` in try/catch. Unsupported (iOS < 16.4, older Firefox) or a
  rejected request degrades silently — never throw, never block a workout.
- **Only while a session is active.** Lock is gated by `appState.currentWorkout`;
  it must never persist after finish/end. The §3 end hooks + declarative `want`
  guarantee this.
- **Re-acquire on return** (§4) — without it the lock is silently lost after the
  first tab-switch/lock. This is the most common wake-lock bug; do not omit.
- **Two start sites** — the quick-start push/pull/legs warmup branch bypasses
  `startWorkout`; hook `_executeQuickStart` too or warmup-led sessions never lock.
- **One path with #5** — `requestWakeLock`/`releaseWakeLock` are aliases of
  `syncWakeLock`; do not give the countdown its own imperative acquire/release or
  it will drop the session lock mid-set (§5).
- **Default value** — `keepAwake: true` is a product choice (feature on by
  default vs opt-in). Flag to product; the merge-on-load makes either safe.
- **No secure-context surprise** — Wake Lock needs HTTPS; GitHub Pages is HTTPS,
  so production is fine. `file://`/local test may report unsupported — expected.
- Line numbers drift — re-anchor by function name before editing.

— Claude (T4), 2026-06-08 16:12 (+09:30 local)
