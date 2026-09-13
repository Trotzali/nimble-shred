# Engine autopilot map — can it recommend a session with ZERO config?

**Terminal:** T3 (read-only on `index.html`; map file only — no edits, no git).
Anchors = symbol / line (indicative, v106). **Question:** can the deterministic
engine self-produce "Today: Pull · 6 · ~35min" with no chip input?

## TL;DR
**Partly — most inputs already self-drive; one is missing.** A no-chip start works
*today* (defaults to **Full · 6 · gym**). To upgrade that to a *recommendation*
("Today: **Pull** · 6 · ~35min") needs 3 small additive pieces (a type-deriver, a
duration↔count helper, a goal→focus map) + an orchestrator/surface. Nothing in the
core engine has to change — it already takes `(type, count, focus)` and supplies
equipment + niggle-safety itself.

---

## 1. The engine choke point

`generateWorkoutByType(type, count = 6, focus)` (**L3876**) — single generator:
1. `type` → category filter (push/pull/legs/nimble/cardio/full) (L3877-3885).
2. equipment → `filterExercisesByEquipment(filtered)` reads `appState.equipment`
   (`presets[appState.equipment] || presets.gym`, **L4080**) — **self-supplied, defaults to gym**.
3. `focus` → bucket intersection w/ empty-guard fallback (L3893-3901).
4. selection → `smartSelect(filtered, count, type, { niggle: getNiggleJoints() })`
   (**L3905**) — scored greedy + recent-exclusion (`recentPicks`, `RECENT_WINDOW=2`)
   + **niggle hard-filter auto-applied** (L3908-3914).
5. returns `count` picks; `rememberPicks` (L3916).

So the engine needs only **type, count, focus** as inputs; **equipment and
niggle-safety it already self-drives.**

## 2. Can each input be derived WITHOUT chips? (by symbol)

| input | self-drivable today? | mechanism (symbol) | gap |
|---|---|---|---|
| **type** | **YES (two paths)** | (a) plan: `getEffectiveType(getDateForDay(dayIdx), dayIdx)` → `activePlan.schedule[dayIdx]` (used by `startTodaysWorkout`/banner). (b) history rotation: `_executeWedgeSession` (L3825-3851) picks **least-recently-trained** of push/pull/legs from `exerciseHistory` per-category `lastDate` → `bestType`. | rotation is **inline in the wedge fn**, not reusable; covers **only push/pull/legs** (no full/cardio/nimble). No single `recommendType()`. |
| **count** | **YES** | `_executeWedgeSession` L3818: `Math.max(2, Math.round(minutes/5))` (≈5min/exercise). Otherwise `appState.exerciseCount` (default **6**). | no default **duration** source feeding it; minutes are user-picked (10/15/20/30). No `count↔minutes` shared helper / "~35min" label. |
| **equipment** | **YES (default)** | `filterExercisesByEquipment` → `appState.equipment` (default `gym`); `applySessionGear(sessionGear)` sets it. | not read from `profile.equipment` (AS-1 store is silent); default works, so refinement not blocker. |
| **focus** | **NO** | `generateWorkoutByType(…, focus)`; no chip → `focus = null` (all buckets, balanced). | **no `goal → bucket` map**; `goalPrimary` is only in the silent AS-1 profile — nothing maps strength→`strength`, fatloss→`cardio`, etc. This is the real miss. |
| **niggle** | **YES (auto)** | `getNiggleJoints()` (L3874) → `smartSelect` hard-filter (L3905-3914). | none — already automatic + guarded. |

## 3. What a zero-config start produces RIGHT NOW

`startConfiguredWorkout()` (**L3750**) with nothing selected →
`_executeQuickStart(appState.qsType || 'full', appState.qsFocus || null)` →
`generateWorkoutByType('full', appState.exerciseCount /*6*/, null)`.
**Result: a Full-body · 6-exercise · gym · niggle-safe session — no config required.**
And a plan-day user already auto-gets the *right type*: `startTodaysWorkout` →
`quickStartWorkout(getEffectiveType(...))`. So **"zero-config session" is already
real**; what's missing is the *smart recommendation* (type rotation for no-plan users,
duration tuning, goal-driven focus) and a *non-committal "here's today's pick" surface*.

## 4. Gap list → "Today: Pull · 6 · ~35min" (additive, no core-engine change)

1. **`recommendType()`** — unify the two existing derivers into one reusable fn:
   plan-today (`getEffectiveType`) → else history rotation (lift the L3825-3851
   least-recently-trained block out of `_executeWedgeSession`) → else `'full'`.
   *Extend rotation past push/pull/legs* (or document that no-plan rotation is p/p/l).
2. **Duration↔count helper + a default length** — wrap the L3818 ratio as
   `countForMinutes(min) = max(2, round(min/5))` and the inverse
   `minutesForCount(n) ≈ n*5` for the "~35min" label. Feed it a default session length
   (`profile.sessionMinutes` once wired, else a constant e.g. 35 → 7, or keep count 6 →
   label "~30min"). *Today the ratio lives only inside the wedge.*
3. **`focusFromGoal(goalPrimary)`** — the missing map: `strength→strength`,
   `power→power`, `resilience→resilience`, `fatloss|conditioning→cardio`,
   `hypertrophy→null`. **Reads `goalPrimary`**, which is only in the silent AS-1
   profile → needs a read (and live goal-driven prescription is **AS-3, gated on the
   programming-rules/injury review** — keep this map data-only until then; a null
   focus is a safe default meanwhile).
4. **`recommendSession()` orchestrator** — compose the above into a **read-only**
   `{ type, count, durationMin, focus, equipment }` with **no side effects** (no
   check-in, no `currentWorkout` write) for the "Today: Pull · 6 · ~35min" label, plus
   a one-tap **Start** that calls the existing `_executeQuickStart(type, focus)` with
   the derived count. *Does not exist.*
5. **Surface** — a home/hero "recommended session" card rendering the label + Start
   (ties to redesign-10's joint-aware hero; `_reskin_ia_map.md §3a`). UI only.

## 5. Flags
- **Niggle thinning shrinks the count.** The recommended "· 6" is pre-filter; if
  flagged joints thin the pool, `generateWorkoutByType` already warns/blocks
  (L3908-3914) — the *displayed* count may exceed what actually starts. Recommend the
  label reads the **post-filter** pool, or shows "up to 6".
- **No-plan rotation is push/pull/legs only** — full/cardio/nimble never surface from
  the history rotation; a no-plan user cycles P/P/L. Decide whether `recommendType()`
  should widen.
- **Goal is not consumed anywhere yet.** `focusFromGoal` is the one piece that needs a
  profile read; until AS-3 is cleared, ship the recommendation with `focus = null`
  (balanced) — type + count + equipment already self-drive, so "Today: Pull · 6 ·
  ~35min" is reachable *without* goal-focus.
- **The ~5min/exercise constant** (L3818) is the only time model; "~35min" is an
  estimate, not measured — fine for a label, flag if it ever drives prescription.
- **Equipment "from profile"** is a refinement: today `appState.equipment` (gym
  default) drives the filter; wiring `profile.equipment` is optional and additive.

**Bottom line:** the engine can self-drive **type, count, equipment, niggle-safety
today**; only **goal→focus** is genuinely absent (and safely defaults to null). The
work is *assembly* (`recommendType` + `count↔min` + `recommendSession` + a surface),
not new selection logic — the core `generateWorkoutByType` is already config-optional.
