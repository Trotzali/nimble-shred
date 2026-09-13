# Map — Quick Start config-state & data-flow

**Terminal:** T2 (READ-ONLY — `index.html` not edited, no git). Map only.

## 1. Where each selection lives + how chips set it

| selection | state var | persisted? | setter (chip) | values |
|---|---|---|---|---|
| **Equipment** | module var **`sessionGear`** (default `'gym'`) | **No** — plain `var`, resets to `'gym'` every reload | `setSessionGear(btn, gear)` — chips `[data-session-gear]` (`gym`/`cable`/`dumbbell`/`bodyweight`); toggles `.active` | gym · cable · dumbbell · bodyweight |
| **Workout Type** | **`appState.qsType`** (default `null`) | **Yes** (`saveAppState`) | `setQsType(btn, type)` — chips `[data-qs-type]`; tap-again deselects (→`null`); reflected on load by `applyQsTypeSelection()` | push · pull · legs · full · cardio (`null`→`'full'`) |
| **Focus** | **`appState.qsFocus`** (default `null`) | **Yes** | `setQsFocus(btn, focus)` — chips `[data-qs-focus]`; tap-again deselects | strength · power · resilience · cardio (bucket axis, optional) |
| **Count (slider)** | **`appState.exerciseCount`** (default `6`) | **Yes** | `updateExerciseCount(value)` — range `#exercise-count-slider` `oninput` | 4–10 |

Note: Type chips are **decoupled** (B-1) — they only *select* state now, they don't generate. `sessionGear` is the odd one out: it's the only selection **not** in `appState` and **not persisted** (always reverts to gym).

## 2. Path: selections → generation

```
[Start Quick Workout] onclick="startConfiguredWorkout()"
  → showCheckIn(cb)                       // check-in modal: sets `sessionCheckIn` + `appState.niggleJoints`
  → cb: _executeQuickStart(appState.qsType || 'full', appState.qsFocus || null)
       → applySessionGear(sessionGear)     // TRANSIENT: writes appState.equipment/customEquipment from sessionGear
       → generateWorkoutByType(type, appState.exerciseCount, focus)   // ← the generation call
       → (restore appState.equipment/customEquipment)
       → set appState.currentWorkout / currentWorkoutType / currentWorkoutMeta
       → push/pull/legs/full → startWarmup; else → startWorkout
```
(Wedge "Random" uses `startWedgeSession`→`_executeWedgeSession`; the consultation/today-plan paths call `quickStartWorkout(type)` / `_executeQuickStart` too — same engine.)

### What `generateWorkoutByType(type, count, focus)` actually READS
| input | source it reads | how used |
|---|---|---|
| pool | `window.allExercises` (202) | base set |
| **type** | arg ← `appState.qsType`‖`'full'` | `ex.cat` match (push/pull/legs) · `getBucket()` (cardio→cardio, internal nimble→resilience) · `full`→all |
| **equipment** | `filterExercisesByEquipment()` reads **`appState.equipment` / `appState.customEquipment`** (set transiently from `sessionGear` by `applySessionGear`) | filter pool by gear |
| **focus** | arg ← `appState.qsFocus` | intersect `getBucket(name)===focus`, with thin-pool fallback (focus-only → drop focus; never empty) |
| **count** | arg ← `appState.exerciseCount` | `smartSelect` target size |
| **niggle** | `getNiggleJoints()` ← **`appState.niggleJoints`** (from check-in) | **HARD exclusion** in `smartSelect` (blocks start if pool empties) |
| **recency** | **`appState.recentPicks[type]`** (last `RECENT_WINDOW`=2 sessions) | excluded in `smartSelect` Phase-1 (variety) |
| side-effect | — | `rememberPicks(type, names)` writes `appState.recentPicks` |

So the 4 taps map 1:1 to engine args: **type=`qsType`, equipment=`sessionGear`→customEquipment, focus=`qsFocus`, count=`exerciseCount`.** Check-in adds `sessionCheckIn` (warmup/load mult) + `niggleJoints` (exclusion) — already auto, not a tap.

## 3. Could these be PRE-FILLED instead of tapped? (per input → auto-source)

**Key finding — the substrate already exists and is current but unconsumed:** `nimbleProfile_v1` (AS-1, v119) is **assembled on every load** by `syncProfileFromLegacy()` (maps `consultProfile` + `strengthProfile` + `appState.niggleJoints` → schema enums via `mapGoal`/`mapEquipment`/`mapTrainingAge`) — but **`getProfile()` has zero call sites**: nothing reads it back. One `readProfile()` already yields `{ goalPrimary, equipment[], sessionMinutes, daysPerWeek, niggles[], strengthProfile, age, … }`. The Quick Start inputs simply don't consume it.

| input | potential auto-source(s) | mapping (precedent already in code) |
|---|---|---|
| **Equipment** (`sessionGear`) | `nimbleProfile_v1.equipment[]` (← `consultProfile.equipment` via `mapEquipment`) · also `appState.equipmentProfiles` (Travel Agent) | profile equip → gear chip: only `bodyweight`→bodyweight · has `cable` only→cables · has `dumbbell`→dumbbell · else→gym. *(Today: hardcoded `'gym'`, ignores all profiles.)* |
| **Workout Type** (`qsType`) | **(a)** `appState.activePlan.schedule[today]` (plan's day-type) — already read by `startTodaysWorkout` / day-editor · **(b)** workout history rotation — `_executeWedgeSession` **already computes least-recently-trained** push/pull/legs from `exerciseHistory` (`lastTrained`); reuse it to pre-pick the "due" split · `appState.recentPicks` also available | plan-today type, or PPL rotation by last-trained date. *(Today: `null`→`'full'`.)* |
| **Focus** (`qsFocus`) | `nimbleProfile_v1.goalPrimary` (← `consultProfile.goal` via `mapGoal`) · `niggles[]`/`injuries` | goal→bucket: `strength`→strength · `power`→power · `resilience`→resilience · `conditioning`/`fatloss`→cardio · `hypertrophy`→strength. Any active niggle → bias `resilience`. *(Today: `null` = no focus.)* |
| **Count** (`exerciseCount`) | `nimbleProfile_v1.sessionMinutes` (← `consultProfile.timePerSession`) | minutes→count using the wedge heuristic `clamp(round(min/5), 4, 10)`. *(Today: default `6` / last value.)* |
| *(niggle exclusion)* | already auto from check-in → `appState.niggleJoints`; AS-1 also mirrors to `profile.niggles` | not a tap — already flows into generation |

**Punchline:** every one of the four taps is derivable from state the app **already holds and refreshes on load** — equipment / focus / count from `nimbleProfile_v1` (or its `consultProfile` source), type from `activePlan.schedule[today]` or the existing history-rotation logic. AS-1 is the ready single read (`readProfile()`); the cleanest pre-fill would set the chip `.active` + the `appState.qs*`/`exerciseCount`/`sessionGear` defaults on load (mirroring `applyQsTypeSelection`'s reflection), leaving every chip a manual override. Inventory/data-flow only — no behaviour change proposed here.

---

**Sign-off:** T2 | 2026-06-16 19:33
