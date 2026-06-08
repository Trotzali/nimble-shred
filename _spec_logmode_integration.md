# Spec — logMode integration (audit #5, parent of #1 / #2)

**Type:** Read-only analysis / implementation spec. No code was changed by this pass.
**Targets a future build.** index.html is to be edited later by a serial build, not here.
**Line numbers are indicative** — current working tree (post-v61, ~+11 vs the v60 audit).
Re-anchor by function name before editing; the tree shifts as sibling builds land.

---

## 0. Pre-flight (confirmed)

`exercise-metadata.js` on disk is **v1.1.0** and every one of the 163 entries carries
`logMode`, `bucket`, `equipmentNorm` (verified by parse). Schema/derivation are
documented in that file's header.

> Caveat: git commit state was **not** checked (no-git constraint for this task).
> Only the working-tree file was verified. A build that wires this in must confirm
> the file is committed/deployed (see §1 deploy note).

`logMode` vocabulary: `"weight_reps" | "reps" | "time" | "distance"`.
Counts today: weight_reps 84 · reps 56 · time 23 · distance 0 (reserved).

---

## 1. Loading exercise-metadata.js into index.html (#5)

### Current script topology (classic scripts, no `defer`, execute top-to-bottom)
| Lines | Block | Defines / does |
|---|---|---|
| 9, 11 | `<head>` CDN | chart.js, supabase |
| 12–32 | `<head>` inline | Supabase config |
| 1934–3010 | inline | `createEx()` + **`window.allExercises`** (`= [` @1992, `]; // END EXERCISE DATA` @3009) |
| 3012–8564 | inline | whole app: `getExerciseMedia` @5580, `renderWorkout` @3580, `logSet` @3808, `saveSetToHistory` @3844, `getProgression` @3858, `startRestTimer` @3332, `window.onload` @3215, `exerciseMedia` @3044 |

### Insert point — one new tag between the two inline blocks
After `</script>` (@3010), before `<script>` (@3012), on the blank line @3011:

```html
<script src="exercise-metadata.js"></script>
```

**Why here, not `<head>` and not end-of-body:**
- `exercise-metadata.js` ends with a self-check that reads `window.allExercises`, so
  it must load **after** the data block (≥ 3010). Placing it at 3011 satisfies that
  and keeps the existing data-then-logic ordering (mirrors `exerciseMedia`).
- All blocks are synchronous classic scripts → execution order is guaranteed; by the
  time any consumer runs (`window.onload` @3215, or any user action) `window.exerciseMeta`
  exists. End-of-body would also work at runtime but skips the self-check's allExercises
  check and splits the data layer — avoid.

### Safe guard — app must work with the file/field absent
The file is now a **separate asset**; on GitHub Pages a missing/404 file makes the tag
fail silently and `window.exerciseMeta` stays `undefined`. Add accessors in the app
block (mirror `getExerciseMedia` @5580), and route ALL reads through them — never touch
`window.exerciseMeta[...]` directly:

```js
// Place near getExerciseMedia (~L5580). Single source of truth for metadata reads.
function getExerciseMeta(name) {
    return (window.exerciseMeta && window.exerciseMeta[name]) || null;
}
function getLogMode(name) {
    var m = getExerciseMeta(name);
    var mode = m && m.logMode;
    // Unknown / missing / reserved 'distance' all fall back to today's behaviour.
    return (mode === 'reps' || mode === 'time') ? mode : 'weight_reps';
}
```

- With the file absent, `getLogMode()` returns `'weight_reps'` for everything ⇒ the UI
  and logging behave **exactly as v61 today**. Zero regression is the contract.
- Emit one `console.warn('[meta] exercise-metadata.js not loaded — weight_reps fallback')`
  guarded by a run-once flag, so absence is visible in dev but silent for users.
- `'distance'` deliberately collapses to `weight_reps` until a distance UI exists (no
  exercise uses it yet) — keeps the four-value enum forward-compatible without dead UI.

**Deploy flag:** GitHub Pages deploy must now ship `exercise-metadata.js` alongside
`index.html`. If a cache-bust is needed, append `?v=1.1.0` to the src.

---

## 2. Mode-aware set logging

Three sites render or read the weight/reps pair. All three branch on `getLogMode(name)`.
Add one shared formatter so display stays consistent:

```js
// Format a stored set for display, by the mode recorded on the set (fallback to lookup).
function formatSetLine(set, name) {
    var mode = set.mode || getLogMode(name);
    if (mode === 'time')  return (set.seconds || 0) + 's';
    if (mode === 'reps')  return (set.reps || 0) + ' reps';
    return set.weight + ' ' + getWeightUnit() + ' × ' + set.reps + ' reps'; // weight_reps
}
```

### 2a. `renderWorkout()` — current-set INPUT block  (@3748–3766)
Today it unconditionally emits a Weight input (`#weight-{idx}` @3753) and a Reps input
(`#reps-{idx}` @3757). Branch by `var mode = getLogMode(ex.name);`:

- **weight_reps** — unchanged (Weight @3753 + Reps @3757).
- **reps** — render **Reps only**; omit the Weight input entirely. *(This is the #2
  resolution — see audit C-02: bodyweight moves shouldn't ask for a weight.)*
- **time** — render a **Seconds** input `#seconds-{idx}` (default from §3) plus an
  optional **Start countdown** button that runs an exercise countdown and toggles the
  screen wake lock (§2d, ties to #4). The "✓ Log Set" button stays.
- **distance** — falls back to weight_reps via `getLogMode` (reserved; no UI yet).

Keep the `logSet(name, idx)` button wiring (@3760) identical — the branch lives inside
`logSet`, so the onclick contract doesn't change.

### 2b. `renderWorkout()` — COMPLETED-set display  (@3730–3737)
Currently hardcodes `set.weight + ' ' + getWeightUnit() + ' × ' + set.reps + ' reps'`
(@3734). Replace with `formatSetLine(set, ex.name)` so a 30s plank reads "30s", not
"0 kg × 0 reps".

### 2c. `renderWorkout()` — collapsed mini-summary  (@3615–3616)
Second display site: `setData.map(s => s.weight + '×' + s.reps)` (@3615). Also route
through `formatSetLine` (or a compact variant). **Easy to miss — flagged.**
The same `weight×reps` pattern recurs in history/details UI (`viewExerciseDetails`
neighbourhood ~L5354) — out of scope for #5 but the same formatter should be reused
when those are touched.

### 2d. `logSet()` — read the right inputs  (@3808–3833)
Current: reads `#weight-{idx}` + `#reps-{idx}`, validates `isNaN(weight) || !reps`
(@3812 — note: already uses `isNaN`, so weight 0 is accepted; C-02's weight-0 bug is
already fixed in this tree), then calls
`saveSetToHistory(name, {weight, reps, date: new Date().toISOString()})` (@3818).

Branch by mode and build a mode-correct record (shape in §4):

| mode | reads | validate | record fields beyond {date} |
|---|---|---|---|
| weight_reps | weight, reps | `isNaN(weight) || !reps` | `weight, reps, mode:'weight_reps'` |
| reps | reps | `!reps` | `weight:0, reps, mode:'reps'` |
| time | seconds | `!seconds` | `weight:0, reps:0, seconds, mode:'time'` |

Everything after the save (counter increment @3821, `saveAppState` @3824, re-render @3825,
rest timer @3829–3831) is mode-agnostic and stays as is.

### 2e. Countdown + wake lock hook (#4)
There is **no wake lock anywhere** in the app today (confirmed — no `navigator.wakeLock`
references). #4 introduces it. This spec only fixes the **hook points**, not the impl:

- On **time**-mode "Start countdown": `requestWakeLock()` → run an exercise countdown
  (reuse the `setInterval`/`formatRestTime` machinery in `startRestTimer` @3332) → on
  completion auto-fill `#seconds-{idx}` and `releaseWakeLock()`.
- Recommended pair (implemented under #4, called here):
  `navigator.wakeLock.request('screen')` on start; `lock.release()` on countdown end,
  on `logSet`, and on `visibilitychange`. Must be feature-detected and try/caught so
  unsupported browsers degrade to a plain countdown.

---

## 3. Pre-fill — per-mode default = last session's ACTUAL values (#1)

### Current behaviour  (@3740–3747)
1. Seed default from Smart Spotter: `suggestedWeight` (@3741, check-in-adjusted) and
   `suggestedReps` (@3742) from `getProgression()`.
2. Override with **today's** last set if any (`lastSetToday` @3743–3747).

So when there's no set *today*, the default is the **Smart Spotter suggestion**, not what
was actually done last session. #1 wants the **last session's real values** as the default,
with Smart Spotter demoted to a hint.

### Target pre-fill priority (per mode)
1. **Last set logged *today*** (carry-forward) — already in scope as `setData`
   (`getTodaysSetData` @3852); keep this top priority.
2. **Else last *session's* actual values** — from `getProgression().lastSession.sets`
   (@3958–3965, real stored sets). Use the **last element** of `lastSession.sets`:
   - weight_reps → its `weight` + `reps`
   - reps → its `reps`
   - time → its `seconds`
3. **Else** assessment estimate (`getEstimatedWeight` @7903, weight_reps only) → else
   blank/sensible zero.

Smart Spotter (`progression.suggest` string) stays **only** as the badge at @3719–3727 —
a suggestion, never the input default. (Today its *numbers* leak into the default via
@3741–3742; #1 stops that.)

### Gate Smart Spotter math to weight_reps  — flag
`getProgression()` is entirely weight-centric: `lastMaxWeight` (@3893), `weight*reps`
volume (@3895, 3906), and all hint branches (@3921–3956) compare weights. For **reps**
and **time** modes those hints are meaningless (weight is 0). Gate hint generation by
mode: for non-weight modes, replace the weight hints with a plain
"Last time: {formatSetLine(lastSet)}" and skip the ±2.5 / deload / stall logic. The
`lastSession`/`prevSession` replay blocks (@3673–3704) should use `formatSetLine` too so
time/reps sessions read correctly.

---

## 4. `saveSetToHistory()` record shape — compatibility with the #7 fix  ⚑

### Exact current shape  (@3844–3850)
`saveSetToHistory(name, setData)` does:
`history[name].push({ ...setData, sessionDate: today })` → localStorage `exerciseHistory`.
A stored set today is:

```js
{ weight: <number>, reps: <number>, date: <ISO string>, sessionDate: "YYYY-MM-DD" }
```

### Consumers that depend on this shape (must not break)
- `getTodaysSetData` @3852 (filter by `sessionDate`)
- `getProgression` @3858 — `s.weight`, `s.reps`, `weight*reps` volume (@3895, 3906)
- `renderWorkout` completed/mini/replay (@3615, 3686–3688, 3734)
- analytics volume aggregation (`exerciseVolumes`/`weekExercises` ~L4338)
- history/details render ~L5354
- (audit) cloud sync / export reach into `exerciseHistory` too

### Proposed change is ADDITIVE ONLY — and that's the whole point for #7
Add fields; **never remove or repurpose** `weight`/`reps`/`date`/`sessionDate`:

```js
{
  weight: <number>,        // ALWAYS present; 0 for reps/time modes
  reps:   <number>,        // ALWAYS present; 0 for time mode
  date:   <ISO string>,
  sessionDate: "YYYY-MM-DD",
  mode:   "weight_reps" | "reps" | "time",   // NEW — self-describing
  seconds: <number>        // NEW — present only when mode === "time"
  // distance: reserved, not emitted yet
}
```

**Rules that keep #7 compatible:**
1. **Keep `weight` and `reps` numeric (default 0)** on every record. Volume math
   (`weight*reps`) then yields 0 for bodyweight/time instead of `NaN`/`undefined`, so
   every existing consumer AND whatever #7 reshapes/syncs stays valid. This is the single
   most important constraint.
2. **Stamp `mode` on the record at log time.** History becomes self-describing, so
   display/analytics format old sets correctly even if an exercise's metadata changes
   later. Readers default missing `mode` → `'weight_reps'` (back-compat for v60 records).
3. `saveSetToHistory`'s **signature is unchanged**; only the object the caller passes
   gains keys. The spread at @3848 already forwards arbitrary keys — no edit to the
   function body is required for the additive fields (it just works), which is exactly
   what keeps it orthogonal to #7.

### What to FLAG to the #7 owner (shape-level decisions, do NOT silently make them here)
- **Time "volume."** Time sets contribute 0 to `weight*reps` volume. If #7 wants
  hold-time in analytics/totals (e.g. `sets×seconds`), that is a #7 schema/analytics
  decision — surface it; don't change volume math under #5.
- **Single schema owner.** #5 (this) and #7 both touch the per-set record. Land them on
  **one** agreed target shape (the object above). If #7 also adds e.g. `unit`
  (lbs/kg, audit H-01) or `workoutType` (audit M-08), fold them into the same record so
  there's one schema, one migration, one sync mapping.
- **Back-compat read path.** Any #7 migration/sync must treat `mode`-less records as
  `weight_reps` and tolerate `seconds`/extra keys it doesn't recognise.

---

## 5. Change-site summary (by function)

| Function @line | Change | Audit tie |
|---|---|---|
| *(new `<script>` @3011)* | load `exercise-metadata.js` after allExercises | #5 |
| `getExerciseMeta`/`getLogMode` (new, ~@5580) | guarded accessors, weight_reps fallback | #5 |
| `formatSetLine` (new) | mode-aware set display | #5 |
| `renderWorkout` input @3748–3766 | branch input UI by mode (reps-only / seconds+countdown) | #2, #4 |
| `renderWorkout` completed @3730–3737 | `formatSetLine` | #5 |
| `renderWorkout` mini @3615–3616 | `formatSetLine` (easy to miss) | #5 |
| `renderWorkout` replay @3673–3704 | `formatSetLine` | #5 |
| `renderWorkout` prefill @3740–3747 | default = last-session actual, per mode; Spotter→hint only | #1 |
| `logSet` @3808–3833 | read inputs by mode; build mode-correct record | #2 |
| countdown + wake lock (under #4) | hook at time-mode start/stop | #4 |
| `getProgression` @3858–3974 | gate weight hints to weight_reps; plain "last time" otherwise | #1 |
| `saveSetToHistory` @3844–3850 | **no body change**; additive record from callers; keep weight/reps numeric | #7 ⚑ |

## 6. Non-negotiables / risk flags
- **Zero-regression fallback:** metadata absent ⇒ everything is weight_reps ⇒ identical to
  today. Route every read through `getLogMode`/`getExerciseMeta`.
- **Additive history only:** never drop `weight`/`reps`/`date`/`sessionDate`; default the
  numerics to 0. This is the contract that keeps #5 orthogonal to #7.
- **Three display sites** for the weight×reps string (current set, completed, mini) plus
  replay — fix all via `formatSetLine` or one will show "0 kg × 0 reps".
- **`distance`** stays reserved (no exercise uses it) — collapses to weight_reps until a
  dedicated UI exists.
- **Deploy:** ship `exercise-metadata.js` with the Pages deploy; it's a separate asset now.
- Line numbers drift — re-anchor by function name before editing.
