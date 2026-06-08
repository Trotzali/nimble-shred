# Spec — Cardio as a workout TYPE (supersedes the cardio-page approach)

**Type:** READ-ONLY analysis / build-ready design. No `index.html` edits, no git commands. One spec file.
**Maps from:** T2's `_spec_cardio_page.md` (the function/line map of the existing cardio feature).
**Decision reversal (given):** the cardio **PAGE/section is dropped**. Cardio becomes a Quick Start **workout type** that builds a real circuit from cardio-bucket exercises and renders in the normal session UI. This **overrides** T2's "route to `switchTab('cardio')`" recommendation (`_spec_cardio_page.md` §"Decision" and fixes #1/#3) — those page-reachability fixes are **no longer wanted** (see §6).

Line numbers indicative; fixes specified by **function + pattern**.

---

## 0. Hard prerequisites — this build sequences AFTER two others

| Dep | Why | State today |
|---|---|---|
| **A "cardio" bucket must exist** in `exercise-metadata.js` | The branch filters `meta[name].bucket === "cardio"`, but the `bucket` enum is currently `strength \| power \| resilience` only — **no exercise has `bucket:"cardio"`**, so the branch would match **zero** exercises and the circuit would be empty. | Not present. This is the unlanded **#13 decision (b)** (add a Cardio bucket; `_spec_equipment_buckets.md` §3). Requires re-tagging the conditioning moves + extending the enum **and the self-check** (`exercise-metadata.js:1741,1749`). |
| **#5 — logMode-driven set logging** | Cardio moves log by `reps`/`time` (`meta[name].logMode`), not weight×reps. The session UI logs weight×reps only today (`logSet()` reads `weight-`/`reps-` inputs, `index.html:3811-3812`). | Not landed. **This cardio build must sequence AFTER #5** so the normal session UI can render time/reps inputs for cardio moves. |

**Both A and #5 are blocking.** Until A lands the branch is dead; until #5 lands the rendered circuit logs incorrectly. The code wiring in §2–§4 is small and can be authored now, but should not ship before A and #5. Where the branch could yield an empty pool, it must **fall back gracefully** (§2c).

### Candidate cardio-bucket members (for the §0-A re-tag, informative — not part of this file's change)
Currently mis-housed in `strength`: **Burpees, Jumping Jacks, Mountain Climbers, High Knees, Plank Jack** (all `logMode` reps/time, bodyweight). Borderline (decide during the re-tag): the `power` plyo/agility set (Jump Squat, Jumping Lunge, Box Jump, Tuck Jumps, Skater Hops, Lateral Bounds, Dot Drill, A-Skips) and the `resilience` locomotion drills (Bear Crawl, Crab Walk, Kick Through, Duck Walk). Recommendation: keep plyometrics in `power` and locomotion in `resilience`; move only the conditioning five into `cardio`. Final membership is the #13 re-tag's call — this spec just consumes whatever ends up `bucket:"cardio"`.

---

## 1. Quick Start — add the "Cardio" chip

**Where:** the workout-type chip row, `index.html:1214-1220` (currently Push `:1215` / Pull `:1216` / Legs `:1217` / Full `:1218` / Nimble `:1219`).

**Add** a sixth chip mirroring the existing pattern:
```html
<div class="chip" onclick="quickStartWorkout('cardio')"><!-- IC cardio/heart-pulse glyph --> Cardio</div>
```
No new handler needed — `quickStartWorkout('cardio')` (`:3411`) → `showCheckIn` → `_executeQuickStart('cardio')` (`:3412`) → `generateWorkoutByType('cardio', …)` (`:3418`). The only logic change is the new branch in §2.

> Layout note: this makes six type chips; `.chip-container` already wraps, so no layout fix required (unlike the nav-bar crowding T2 flagged — moot now the page is dropped).

---

## 2. `generateWorkoutByType(type, count)` — add a cardio branch (~`:3515-3531`)

### 2a. Current behaviour (the M-01 bug)
The filter (`:3516-3523`) handles `push/pull/legs/nimble/full`; **`cardio` is unhandled** and hits the final `return true` (`:3522`) → the **entire** DB → equipment filter → shuffle → random lifts. So `quickStartWorkout('cardio')` today fabricates a barbell/mobility session.

### 2b. The fix — explicit cardio branch keyed on the bucket
Add a branch **before** the `full`/fallthrough, sourcing from the cardio bucket via metadata instead of `ex.cat`/`ex.type`:
```
if (type === 'cardio') {
    return window.exerciseMeta && window.exerciseMeta[ex.name]
        && window.exerciseMeta[ex.name].bucket === 'cardio';
}
```
(Pattern mirrors the `nimble` branch at `:3520`, but reads `exerciseMeta[name].bucket` rather than the legacy `cat`/`type` strings — consistent with the metadata-driven taxonomy specced in `_spec_equipment_buckets.md`.) Downstream is unchanged: `filterExercisesByEquipment` (`:3526`/`:3533`) then shuffle+slice (`:3529-3530`) → a real **cardio circuit** of `count` moves.

### 2c. Empty-pool fallback (until §0-A lands, and for bodyweight-only edge cases)
The cardio bucket is small and entirely bodyweight, so `filterExercisesByEquipment` won't thin it — but if `exerciseMeta` is absent or no move is tagged `cardio` (pre-§0-A), the filter returns `[]` and `startWorkout([])` would render an empty session. Guard it: if the cardio-filtered list is empty, **fall back** to a bodyweight `full` circuit (or surface a "Cardio circuit needs the cardio exercise tags — coming soon" notice). Prevents a blank session during the dependency window.

---

## 3. M-01 — planned cardio day's "Start" routes through the branch

**Chain:** today-banner "Start Workout" → `startTodaysWorkout()` (`:5545-5549`) → `quickStartWorkout(appState.activePlan.schedule[dayIdx])`. For a cardio day that is `quickStartWorkout('cardio')`.

With the §2 branch in place, **no special-casing is needed** — `'cardio'` now flows `quickStartWorkout('cardio')` → `_executeQuickStart('cardio')` → `generateWorkoutByType('cardio')` → a real cardio circuit, rendered by the normal session UI. M-01 ("cardio day → random lifts") is fixed **by the branch alone**.

> This is the opposite of T2's fix #3 (which special-cased `'cardio'` → `switchTab('cardio')`). Because the page is dropped, **remove that redirect from the plan** — cardio days must reach the circuit generator, not a page.

**Warmup note:** `_executeQuickStart` runs `startWarmup` only for `push/pull/legs` (`:3432`); `cardio` (like `full`/`nimble`) takes the `else` → `startWorkout(exercises)` directly (`:3436`). That's the right default — a cardio circuit is itself the warmup-free conditioning block. No change needed; flag only if a cardio-specific warmup is later wanted.

Cardio days are routinely scheduled — default plan Tue (`:3262`), plan generator 5-/6-day maps (~`:5485-5486`), `editDay` cycle (~`:5418`), AI plans (~`:7499/7501`) — so this path is hit in normal use; all of them benefit from the single §2 branch.

---

## 4. Rendering — normal session UI, logging via `logMode` (after #5)

No new render path. `startWorkout(exercises)` (`:3555`) → `renderWorkout` (`:3578`) renders the cardio circuit exactly like any session: progress bar, active card (GIF/how-to), set logging, "Up Next", finish button.

The only modality gap is logging: cardio moves are `reps`/`time` (`meta[name].logMode`), but `logSet()` currently parses weight+reps (`:3811-3812`). **#5** is the build that drives the set input off `logMode` (time/reps/weight_reps). Once #5 lands, a `time` move (e.g. Mountain Climbers) renders a duration input and a `reps` move renders a reps-only input — and the cardio circuit logs correctly with **zero** cardio-specific rendering code. Hence the explicit sequencing: **cardio-as-type ships after #5.** Before #5, the circuit still renders but would mislog as weight×reps — do not ship in that window.

---

## 5. What is intentionally NOT built (dropped from T2's spec)

The cardio **page** approach is abandoned. Specifically **do not** do T2's:
- **Fix #1 — page reachability** (add a `switchTab('cardio')` nav button / Coach/Plan entry). Not wanted.
- **`renderCardioHistory` fix** (`saveGpsRoute` → `loadCardioHistory`). The GPS save path is part of the dormant page; not in scope.
- **GPS suite / quick-log polish** (mark-day-complete on GPS save, `cardioHistory` ordering). Not in scope.

These belonged to "cardio is a page." With cardio reduced to a workout type, they have no entry point and are deliberately left unbuilt.

---

## 6. The cardio page is left ORPHANED/DORMANT — not deleted

`#view-cardio` (~`:1378-1413`), `#gps-tracking-modal` (~`:1839-1868`), and the cardio JS suite (`logCardioSession` ~`:5667`, `loadCardioHistory` ~`:5691`, GPS `startGpsTracking…saveGpsRoute` ~`:6050-6229`) **remain in the file, unreferenced**:
- `switchTab('cardio')` is already wired (`:3282` calls `loadCardioHistory`; nav-highlight is generic `:3278`) — but, per T2, **no call site invokes it**, and this spec adds none. So the page stays exactly as today: present, valid, unreachable.
- **Do not delete it.** Leaving it dormant is intentional — zero render cost (the container only mounts on `switchTab('cardio')`, which never fires), and it preserves the GPS/quick-log work if a future decision revives a cardio page. A later cleanup task may remove it; that is **not** this build.
- One-line acknowledgement for the build PR: "cardio page intentionally orphaned; cardio now ships as a Quick Start type."

---

## 7. Build checklist (in dependency order)

| # | Item | Pattern | Blocked by |
|---|---|---|---|
| 0a | **Create `cardio` bucket** + re-tag conditioning moves + extend enum & self-check | `exercise-metadata.js` (#13 decision b) | — (prereq) |
| 0b | **#5 logMode-driven set logging** lands | `logSet`/`renderWorkout` set input | — (prereq) |
| 1 | Add **"Cardio" chip** to Quick Start type row | markup `:1214-1220` | none |
| 2 | Add **cardio branch** to `generateWorkoutByType` (`bucket==='cardio'`) + empty-pool fallback | `:3515-3531` | 0a |
| 3 | **M-01**: confirm `startTodaysWorkout`/`quickStartWorkout('cardio')` flow through branch; **remove** any `'cardio'→switchTab` redirect | `:5545-5549`, `:3411` | 2 |
| 4 | Verify normal session UI logs cardio moves via `logMode` | `renderWorkout`/`logSet` | 0b |
| — | Leave cardio page dormant (no nav entry, no deletion) | — | — |

**Testing note:** after 0a+0b — Quick Start "Cardio" → check-in → a real cardio circuit (conditioning moves, not lifts), each logging via its `logMode`; planned cardio day → "Start Workout" → same circuit (M-01 gone, not random lifts); empty-pool guard fires cleanly if run before tags exist; `switchTab('cardio')` still never called (page stays orphaned).

---

*Signed off — T5, terminal pts/T5, 2026-06-08 17:14 AEST (07:14 UTC). Read-only: no index.html edits, no git commands.*
