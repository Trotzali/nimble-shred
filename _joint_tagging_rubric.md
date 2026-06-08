# Joint-tagging rubric — `jointLoad` (exercise-metadata.js v1.3.0)

**Purpose:** the foundation for the *"train around a niggle"* feature. Every
exercise gets a **complete, dense** per-joint load score so that a **`0`
reliably means the joint is SPARED** — never "unknown / not yet scored". With
that guarantee, the app can confidently filter exercises out for a sore region
and serve the ones that leave it alone.

**Scope of this pass:** all **177** entries in `exercise-metadata.js` — the 163
canonical `window.allExercises` moves **plus** the 14 staged Cardio/HIIT moves
from `_cardio_hiit_meta.md`. Read-only on `index.html`; no app edits.

---

## 1. Fixed joint vocabulary (9)

`jointLoad` always contains exactly these keys, in this order:

| key | region |
|---|---|
| `neck` | cervical spine |
| `shoulder` | glenohumeral + scapular |
| `elbow` | elbow |
| `wrist` | wrist + hand |
| `tSpine` | **thoracic** (mid-back) spine — scored **separately** from `lowBack` |
| `lowBack` | **lumbar** (low-back) spine |
| `hip` | hip joint + groin |
| `knee` | knee |
| `ankle` | ankle + foot |

**Why `tSpine` is split from `lowBack`:** a mid-back niggle and a low-back
niggle want different swaps. Rotation / overhead / extension drills load the
thoracic spine; hinges and rotation load the lumbar. Keeping them separate lets
the feature spare one without spuriously banning the other. (`neck` was added
this pass for the same reason — bridges, shrugs, crunches and animal-flow holds
genuinely load the cervical spine and a stiff neck is a common 40+ complaint.)

---

## 2. The 0–3 scale

Score each joint by the **mechanical demand the movement places on that joint**
(load × range × position), independent of which muscle is the "target".

| score | meaning | how to read it |
|:--:|---|---|
| **0** | **Uninvolved / SPARED** | The joint is not meaningfully loaded or moved under tension. Safe to serve to someone whose this-joint is sore. **This is a promise, not a default.** |
| **1** | **Low** | Light involvement: stabiliser role, supported position, light/partial ROM, or low external load. Usually tolerable on a mildly cranky joint. |
| **2** | **Moderate** | Meaningful load OR end-range OR repeated impact through the joint. A real contributor to strain; likely to irritate if that joint is already sore → appears in `aggravates`. |
| **3** | **Primary high load** | The joint is the limiting/most-stressed structure: heavy load, deep end-range under load, or hard impact. First thing to remove for a flare in that joint. |

### Decision aids
- **Supported vs free:** a head/back supported on a bench → that spinal segment
  trends lower; bearing bodyweight on hands → wrist/shoulder trend higher.
- **Impact:** any airborne landing adds ≥1 to knee & ankle (≥2/3 for repeated
  hops). Grounded "low-impact" variants are the whole reason the Cardio pack
  exists — see `_cardio_hiit_meta.md`.
- **End-range under load** (deep squat, bottom of a dip, full thoracic flexion)
  pushes the governing joint to 2–3 even at bodyweight.
- **Rotation** loads `tSpine` and `lowBack` together — score both.

---

## 3. Per-joint anchors (examples drawn from the dataset)

> Examples are real entries; their numbers are exactly what's in the file.

- **neck** — `0` Cable Chest Press (head supported) · `1` Cable Shrugs, Bicycle
  Crunch, Cat-Cow, Bear Crawl (head held up / cervical flexion) · `2` Handstand
  Hold, Thoracic Bridge (cervical weight-bearing). *Max in current DB = 2; a
  loaded neck-harness extension would be a `3`.*
- **shoulder** — `0` Bodyweight Squat · `1` Cable Bicep Curl (stabiliser) ·
  `2` Dumbbell Bench Press · `3` Dips, Pike Push-up, Handstand Hold, Cable
  Overhead Press, Arnold Press.
- **elbow** — `0` Squat · `1` most presses/curls (moving but light) · `2` Skull
  Crusher, Zottman Curl, Pull-ups · `3` reserved for max elbow-torque (none in DB).
- **wrist** — `0` most leg work · `1` curls/pushdowns · `2` Push-ups, Diamond
  Push-up, Bench Dip, plank-on-hands · `3` Handstand Hold (full loaded extension).
- **tSpine** — `0` isolation curls, calf raises · `1` rows, pulldowns, overhead
  press, RDLs, Goblet/Front Squat, Pallof, Bird Dog · `2` Woodchoppers, Russian
  Twist, Cat-Cow, Scorpion Stretch, Superman, Zercher Squat · `3` Jefferson
  Curl, Thoracic Extension, Thoracic Bridge.
- **lowBack** — `0` supported presses, isolation · `1` squats, planks, carries ·
  `2` Good Morning, Russian Twist, Cable Side Bend, Renegade Row, Burpees ·
  `3` Romanian Deadlift (DB) (loaded lumbar hinge).
- **hip** — `0` bench press · `1` lunges, bridges · `2` Goblet/Deep Squat, RDL,
  Bulgarian Split Squat, Pistol Squat, ATG Split Squat. *Max in current DB = 2.*
- **knee** — `0` upper-body isolation · `1` light squats/bridges · `2` Goblet
  Squat, Bulgarian Split Squat, Box Jump · `3` Pistol Squat, ATG Split Squat,
  Jump Squat, Jumping Lunge, Tuck Jumps, Duck Walk.
- **ankle** — `0` bench/seated work · `1` standing squats/lunges · `2` calf
  raises, Lateral Bounds, jump take-offs/landings · `3` Pogo Hops (repeated
  max-impact hops).

---

## 4. Derived fields (computed strictly from the numbers — never hand-set)

- **`strainScore` = `min(10, Σ of all 9 jointLoad values)`** — overall systemic
  load, capped at 10. Recomputed this pass over 9 joints (so totals rose for
  multi-joint moves vs the old 7-joint sums). Range observed: 1–10.
- **`aggravates` = every joint with load ≥ 2**, listed in `jointLoad` key order.
  This is the exact list the niggle-swap feature reads to exclude an exercise
  for a sore region.

Because both are derived, they can never disagree with `jointLoad`. The
self-check IIFE re-derives and flags any drift (see §6).

---

## 5. Muscle vocabulary (`musclesTargeted`) — secondary

So that *"trained X → serve non-X"* is derivable, every entry also carries
`musclesTargeted` against this **fixed 24-key vocabulary**, normalised from
`index.html` `guide.muscles`:

```
neck, traps, frontDelts, sideDelts, rearDelts, rotatorCuff, chest, serratus,
lats, rhomboids, lowerBack, biceps, triceps, forearms, abs, obliques,
hipFlexors, glutes, quads, hamstrings, adductors, abductors, calves, tibialis
```

Normalisation rules applied:
- Pec sub-regions (Upper/Lower/Inner Pectorals, Pecs) → `chest`.
- Delt heads kept distinct (`frontDelts`/`sideDelts`/`rearDelts`); generic
  "Deltoids"/"Shoulders" → the relevant heads (+`rotatorCuff` for "Shoulders").
- Cuff terms (Infraspinatus, Subscapularis, External Rotators) → `rotatorCuff`.
- Trap regions (Upper/Lower Traps, Trapezius) → `traps`; Brachialis → `biceps`;
  Brachioradialis → `forearms`; Quadratus Lumborum / "Spine" / "Thoracic Spine"
  → `lowerBack`; Glute Medius → `abductors`; Soleus/Gastrocnemius → `calves`;
  VMO → `quads`.
- Non-muscle source tags (**Full Body, Cardio, Coordination, Stabilizers**) and
  empty/missing muscle lists were **expanded to the actual movers** per exercise
  (e.g. Burpees → chest, frontDelts, triceps, quads, glutes, abs).

> **`neck` (muscle) is reserved / currently unused** — no exercise in the set
> isolates the cervical muscles (shrugs map to `traps`). The key is kept so the
> joint and muscle vocabularies stay parallel and a future neck-prehab drill has
> a home. 23 of 24 keys are in active use.

---

## 6. Self-check contract (exercise-metadata.js IIFE, v1.3.0)

Runs in the browser only when `window.allExercises` is present. Logs loudly on:

1. **App exercise with no metadata** (`console.error`).
2. **Incomplete / inconsistent joint score** — any entry whose `jointLoad` is
   not all 9 keys as integers 0–3, or whose `strainScore` ≠ `min(10, Σ)`, or
   whose `aggravates` ≠ joints ≥ 2 (`console.error`). *This is the new v1.3.0
   guard that enforces the "0 = spared, no gaps" contract.*
3. **Out-of-vocabulary** `logMode` / `bucket` / `equipmentNorm` / muscle, or
   empty `musclesTargeted` (`console.error`).
4. **Unresolvable `alternatives`** — validated against `allExercises ∪ metadata
   keys` so in-pack cardio cross-references resolve (`console.error`).
5. **Staged entries** — metadata present for exercises not yet in the app (the
   14-move Cardio/HIIT pack) is reported as **`console.info`, not an error**, so
   shipping metadata ahead of the app defs is expected, not a failure.

---

## 7. Coverage summary (this pass)

- 177/177 entries carry a complete 9-joint score (no gaps, explicit zeros).
- `neck` loaded in 27 entries; `tSpine` in 54.
- `strainScore` distribution: 1×9, 2×21, 3×30, 4×23, 5×34, 6×27, 7×19, 8×8, 9×2, 10×4.
- Buckets across 177: strength 110 · resilience 40 · cardio 17 · power 10.
- 36 entries fully spare neck + tSpine + all upper-limb + lowBack (pure
  lower-body options for someone with any upper-body/spine niggle) — a concrete
  demonstration that the "spared = 0" contract is usable.
