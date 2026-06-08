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
