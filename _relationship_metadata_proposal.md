# Relationship-metadata layer — REVIEW proposal (free, derived)

**Terminal:** T2 (READ-ONLY — `exercise-metadata.js` and `index.html` untouched, no git). Propose only; **T1 applies** later.
**Input:** `exercise-metadata.js` v1.6.0 (202 entries). **Derived purely from existing fields** — `movementPattern`, `musclesTargeted`, `jointLoad`, `equipmentNorm`, `compound`, `laterality`. No new judgement data; every value is computed by the rules below.
**Output:** `_relationship_metadata_patch.json` — `entry → { antagonistOf[], redundantWith[], forceVector, axialLoad }` for all 202.

**Self-check on the patch:** 202 entries · all 4 fields well-formed · `redundantWith` symmetric · every `antagonistOf` value within the 24-muscle vocab.

---

## Field 1 — `antagonistOf` : string[] (24-vocab muscle keys)
The muscle groups *opposed* by this exercise's primary movers — for antagonist supersets / push-pull balance.

**Rule:** `antagonistOf = ⋃ ANTAGONIST[m] for m in musclesTargeted`, deduped, **minus the entry's own musclesTargeted** (a move that already trains both sides isn't "antagonist of" itself).

**ANTAGONIST muscle map (the opposing-pair table):**
| muscle | → antagonist | | muscle | → antagonist |
|---|---|---|---|---|
| chest | lats, rhomboids, rearDelts | | abs | lowerBack |
| frontDelts | rearDelts, lats | | lowerBack | abs |
| rearDelts | chest, frontDelts | | obliques | lowerBack |
| lats | chest, frontDelts | | hipFlexors | glutes |
| rhomboids | chest, serratus | | glutes | hipFlexors |
| serratus | rhomboids | | quads | hamstrings |
| biceps | triceps | | hamstrings | quads |
| triceps | biceps | | adductors | abductors |
| calves | tibialis | | abductors | adductors |
| tibialis | calves | | | |

**⚠ No clean single-antagonist (mapped to `[]`, flagged):** `sideDelts` (lateral raise — abduction has no isolating antagonist), `traps` (shrug/elevation), `forearms` (wrist flexors↔extensors both collapse to one key), `rotatorCuff` (ext↔int rotation are intra-group), `neck`. Entries whose primary set is only these get `antagonistOf: []`.

**`antagonistOf: []` count = 25.** Two distinct, both-correct causes:
1. **No-clean-antagonist muscle** (above) — e.g. Lateral Raise, Cable/DB Shrugs, Cable Y-Raise, Cable Internal Rotation, wrist curls, Neck CARs, Chin Tuck.
2. **Self-balanced move** — trains a muscle *and* its antagonist, so the set self-cancels: Ankle Alphabet & Knee-to-Wall Ankle Rock & Banded Ankle Eversion-Inversion (calves+tibialis), Cat-Cow (abs+lowerBack), Standing Hip CARs, Reverse Lunge to Knee Drive. These are *intentionally* balanced; `[]` is the right answer.

*45 entries include a no-clean-antagonist muscle in their set (their antagonistOf may be partial — the opposable movers still resolve; the unopposable ones contribute nothing).*

---

## Field 2 — `redundantWith` : string[] (entry names)
Near-identical training stimulus, for picker variety / dedup.

**Rule:** two entries are redundant when **same `movementPattern`** AND **Jaccard(musclesTargeted) ≥ 0.67**. Symmetric, deduped, sorted. Equipment is intentionally ignored (a push-up and a DB bench are interchangeable *stimulus* for variety). High-precision by design — the 0.67 cut favours true twins over loose cousins.

**Result:** 134 entries have ≥1 redundant peer · 68 are unique (`[]`) · **45 clusters**. Largest:
- **8** — triceps extension family: Cable French Press, Cable Kickback, Overhead Cable Extension, Reverse Grip Pushdown, Skull Crusher (DB), Tricep Kickback, Tricep Pushdown (Bar/Rope)
- **6** — biceps curl family: Bayesian Curl, Cable Bicep Curl, Cable Curl (Behind Back), Concentration Curl, Dumbbell Curl, Lying Cable Curl
- **6** — lunge family: ATG Split Squat, Dumbbell Lunge, Jumping Lunge, Low Step-Up (Fast), Lunge (BW), Reverse Lunge to Knee Drive
- **6** — loaded-squat/jump family: Box Jump, Horse Stance Hold, Jump Squat, Pop Squat, Squat to Calf Raise, Sumo Squat (DB)
- **5** — lateral locomotion: Duck Walk, Lateral Bounds, Lateral Shuffle, Skater Hops, Step Touch
- plus glute-bridge, step-up, crunch clusters (4 each), etc.

**⚠ Threshold is a tunable judgement call (flagged).** 0.67 is high-precision: it will *miss* loose variants whose `musclesTargeted` sets diverge by a muscle (e.g. a push-up listing `serratus`/`abs` won't pair with a bench listing only `chest/triceps/frontDelts`). Lower to ~0.5 for broader dedup; raise to 1.0 for exact-twins only. T1 can re-derive at a different cut without new data.

---

## Field 3 — `forceVector` : vertical | horizontal | lateral | rotational | axial
Primary line of resistance/movement.

**Rule (movementPattern → vector, with isolation/mobility falling back to the primary muscle):**
| movementPattern | forceVector |
|---|---|
| push-vertical, pull-vertical | vertical |
| push-horizontal, pull-horizontal | horizontal |
| squat, hinge, lunge | vertical |
| rotation, anti-rotation | rotational |
| carry | axial |
| anti-extension | **axial** ⚠ |
| locomotion | **horizontal** ⚠ |
| isolation, mobility | **by primary muscle** ⚠ (see below) |

**isolation/mobility → primary-muscle fallback:** `rotatorCuff` → rotational · {sideDelts, abductors, adductors, obliques} → lateral · {chest, rearDelts, lats, rhomboids} → horizontal · `lowerBack` → axial · everything else (limb flexion/extension vs gravity) → **vertical** (default).

**Distribution:** vertical 104 · horizontal 53 · rotational 20 · axial 17 · lateral 8.

**⚠ Low-confidence calls flagged (115 entries):** every `isolation` (58), `mobility` (30), `anti-extension` (5), `locomotion` (22). These have no clean *external* force line (bodyweight stretches, holds, carries-as-locomotion), so the vector is a best-effort from pattern/muscle rather than a measured load direction. The big-lift patterns (push/pull/squat/hinge/lunge/rotation/carry — 87 entries) are high-confidence. Notable judgement points: `anti-extension` (Plank family) → **axial** (treated as trunk-stabilisation axis, not the gravity-down line); `locomotion` (Bear Crawl, shuffles) → **horizontal** (travel direction).

---

## Field 4 — `axialLoad` : boolean — does the load compress the spine?
**Rule:** `true` when `movementPattern ∈ {squat, hinge, push-vertical, carry}`, OR `lunge` with a loaded implement (`equipmentNorm ∈ {dumbbell, gym/machines}`). Everything else `false`.

**Distribution:** true 35 · false 167.

**Design notes (deliberate, not bugs):**
- **Vertical *pulls* are `false`** — Pull-ups / Chin-ups / Lat Pulldown put the spine in **traction**, not compression. (Only vertical *pushes*/overhead compress.)
- **Horizontal presses/rows, all cable work, isolation, supine/prone core → `false`** — supported or non-compressive, matching the brief's "leg press/cable false". A standing cable *row* loads `lowBack` as a stabiliser but the force is horizontal, so `axialLoad` is **not** inferred from `jointLoad.lowBack`.
- **Bodyweight lunges → `false`, loaded lunges → `true`** (only a held/loaded implement adds meaningful spinal compression).

**⚠ Low-confidence calls flagged (14):**
- `cable-vertical` (1): **Cable Overhead Press** → `true`. Overhead pressing compresses the spine regardless of cable; the brief's "cable = false" generalisation doesn't hold for an overhead cable press. Kept `true` — confirm.
- `bw-low-magnitude` (13): bodyweight squats/hinges marked `true` but low absolute load — Bodyweight Squat, Glute Bridge, Pistol Squat, Nordic Curl, Single Leg Glute Bridge, Good Morning (BW), Jump Squat, Box Jump, Single Leg RDL (BW), Tuck Jumps, Horse Stance Hold, Squat to Calf Raise, Pop Squat. The *pattern* loads the spine axially (upright torso bearing bodyweight); flagged so T1 can downgrade to `false` if `axialLoad` is meant strictly as *external/heavy* compression.

---

## Coverage
| field | populated | empty/`[]`/`false` | notes |
|---|--:|--:|---|
| antagonistOf | 177 | 25 (`[]`) | 25 = no-clean-antagonist muscle or self-balanced |
| redundantWith | 134 | 68 (`[]`) | 45 clusters; threshold 0.67 (tunable) |
| forceVector | 202 | — | 87 high-confidence · 115 flagged (isolation/mobility/anti-ext/locomotion) |
| axialLoad | 35 `true` | 167 `false` | 14 flagged (1 cable-vertical, 13 bw-low-magnitude) |

All four are **derivations** — no external data was introduced, so T1 can re-run/re-tune deterministically. Apply note: these are independent additive fields (like v1.6.0's `synergists`); none overwrite existing values.

---

**Sign-off:** T2 — 2026-06-14 20:48
