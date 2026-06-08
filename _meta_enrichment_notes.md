# T3 — exercise-metadata.js enrichment notes

**Date:** see sign-off in chat.
**File touched:** `exercise-metadata.js` (v1.0.0 -> v1.1.0). index.html read READ-ONLY; no git run.
**Scope:** added 3 independent fields per entry — `logMode`, `bucket`, `equipmentNorm`.
The original 5 fields (alternatives / jointLoad / strainScore / aggravates /
rehabCategory) are byte-preserved by value (verified programmatically).

Coverage: **163 / 163** entries enriched. Embedded self-check now also flags
any out-of-vocabulary logMode / bucket / equipmentNorm value.

---

## logMode counts (#5)
- `reps`: 56
- `time`: 23
- `weight_reps`: 84

Rule: holds / carries / locomotion / sustained-cardio = `time`; bodyweight rep
moves = `reps`; loaded lifts (cable / dumbbell / free weight) = `weight_reps`.
`distance` is reserved (no v60 exercise uses it — travelling locomotion is
logged by time per the brief).

The 23 `time` entries (holds / carries / locomotion / timed cardio):
- Farmers Walk
- Plank
- Side Plank
- Mountain Climbers
- Handstand Hold
- Deep Squat Hold
- Couch Stretch
- Flutter Kicks
- Plank Jack
- Jumping Jacks
- High Knees
- Plate Pinch
- Bear Crawl
- Crab Walk
- Kick Through
- Duck Walk
- Dead Hang
- Dot Drill
- A-Skips
- Horse Stance Hold
- Reverse Plank
- Copenhagen Plank
- L-Sit (Tuck)

---

## bucket counts (#13)
- `power`: 8
- `resilience`: 40
- `strength`: 115

Rule (priority): `(Mobility type OR rehabCategory != null)` -> **resilience**;
else `(Plyo type OR jump/bound/hop)` -> **power**; else -> **strength**.
Prehab wins over strength for dual-purpose nimble moves (Tibialis Raise,
Dead Hang, Copenhagen Plank, Powell Raise -> resilience), while pure nimble
strength holds with no rehab tag stay strength (Horse Stance Hold, Reverse
Plank, Single Leg RDL (BW)).

`power` members (8): A-Skips, Box Jump, Dot Drill, Jump Squat, Jumping Lunge, Lateral Bounds, Skater Hops, Tuck Jumps.
Note: steady-state conditioning typed "Calisthenics" (Burpees, High Knees,
Jumping Jacks, Mountain Climbers, Plank Jack) falls to **strength** — there is
no cardio bucket; only ballistic jump/bound/hop work is power.

---

## equipmentNorm counts (#15)
- `bodyweight`: 77
- `cable`: 56
- `dumbbell`: 28
- `gym/machines`: 2

Source `equip` (from index.html) for reference:
- `Bodyweight`: 77
- `Cable`: 56
- `Dumbbell`: 28
- `Free Weight`: 2

Cross-walk (Builder vs Quick Start reconciliation):

| equipmentNorm | source equip | Builder filter | Quick Start filter |
|---|---|---|---|
| `bodyweight`   | Bodyweight  | bodyweight | bodyweight |
| `dumbbell`     | Dumbbell    | dumbbells  | dumbbells |
| `cable`        | Cable       | cables     | full gym |
| `gym/machines` | Free Weight | barbells   | full gym |

Quick Start "full gym" = { `cable`, `gym/machines` }. No barbell-only
exercises exist in v60, but the `gym/machines` value carries Builder's
"barbells" bucket and the plate/fixed-machine moves (Plate Pinch, Svend Press).

---

## Separability
The three new fields sit after `rehabCategory` in each entry and are not
referenced by the original pain-swap data. They can be edited or removed
independently. Re-running the T3 generator is idempotent.

---

# ADDENDUM — Cardio bucket added (#13 decision) — exercise-metadata.js v1.1.0 -> v1.2.0

Edit applied **in place** to the on-disk `exercise-metadata.js` (the file already
carrying all three enriched fields). Only `bucket` values changed; `logMode`,
`equipmentNorm`, and all five original fields are untouched. Internal version
bumped v1.1.0 -> v1.2.0. Embedded self-check `BUCK` array now includes `cardio`.

## bucket enum (was 3, now 4)
`"strength" | "power" | "resilience" | "cardio"`

## Re-tagged strength -> cardio (5 moves)
Every move changed, and why it qualifies as steady-state conditioning / metcon
(non-ballistic, sustained heart-rate work — not a loaded lift, not a jump):

| move | logMode | source cat / type | reason |
|---|---|---|---|
| Burpees           | reps | Full Body / Calisthenics | full-body metcon conditioning |
| Jumping Jacks     | time | Cardio / Calisthenics    | steady-state cardio |
| Mountain Climbers | time | Core / Calisthenics      | sustained cardio/core conditioning |
| High Knees        | time | Cardio / Calisthenics    | steady-state running-in-place cardio |
| Plank Jack        | time | Core,Cardio / Calisthenics | sustained cardio/core conditioning |

## Deliberately NOT moved (boundary calls)
- **Ballistic / plyo stays `power`** (8, unchanged): A-Skips, Box Jump, Dot Drill,
  Jump Squat, Jumping Lunge, Lateral Bounds, Skater Hops, Tuck Jumps. These are
  explosive jump/bound/hop work, not steady-state conditioning.
- **Loaded strength stays `strength`**: e.g. Farmers Walk, Plate Pinch (loaded
  carry / grip), all cable/dumbbell lifts.
- **Mobility / rehab stays `resilience`** (40, unchanged): incl. locomotion
  drills tagged `movement-prep` (Bear Crawl, Crab Walk, etc.).
- **Flutter Kicks stays `strength`** — core-isolation endurance, not whole-body
  metcon; logMode `time` but it is an ab exercise, not cardio conditioning.
- Isometric STRENGTH holds stay `strength` (Plank, Side Plank, Handstand Hold,
  L-Sit (Tuck), Horse Stance Hold, Reverse Plank).

## New bucket counts (sum = 163 across 4 buckets)
- `strength`: 110  (was 115; −5)
- `resilience`: 40  (unchanged)
- `power`: 8  (unchanged)
- `cardio`: 5  (new)
- **total: 163** ✓

Verified by re-parse: 163 entries, exactly 5 entries carry `bucket:"cardio"`,
field set/order intact on every entry, embedded self-check clean.
