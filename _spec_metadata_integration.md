# Spec — folding the staged packs into exercise-metadata.js

**Type:** Plan / doc only. **No merge performed** (avoids a race with T2 finalising
its packs). Read-only on `index.html`, `exercise-metadata.js`, and all pack files.
No git. **Date:** see sign-off.
**Goal:** ONE integration build that lands all THREE staged packs together, with
the metadata layer and the live app converging at **202 / 202**, self-check green.

Packs in scope:
1. **14 HIIT cardio** — `cardio-hiit-exercises.js` (committed defs) + rows **already
   in `exercise-metadata.js`** (folded v1.3.0 dense pass).
2. **7 mobility gap-fill** — `mobility-gapfill-exercises.js` defs + FINAL rows in
   `_mobility_gapfill_meta.md` (canonical-compound values).
3. **18 rehab/mobility** — `rehab-mobility-exercises.js` defs (region-tagged) —
   **defs-only, NO metadata rows exist yet** (predate the schema; need an
   authoring pass — see §3).

---

## 0. TL;DR — the numbers (verified against the live files)

| | now | after merge | delta | who |
|---|--:|--:|--:|---|
| **metadata entries** (`exercise-metadata.js`) | **177** | **202** | **+25 rows** (7 gapfill + 18 rehab) | metadata file (T3) |
| **live app** (`window.allExercises`) | **163** | **202** | **+39 defs** (14 cardio + 7 gapfill + 18 rehab) | index.html (T1) |
| staged (metadata-ahead-of-app) | 14 | 0 | −14 | converges |

Intermediate (if folded pack-by-pack): metadata `177 → 184` (gapfill) `→ 202`
(rehab); live `163 → 184 → 202`.

> ⚠ **Two count caveats, both confirmed by parse:**
> 1. The **14 cardio metadata rows are already present** (the 14 current "staged"
>    entries: 12 `cardio` + 2 `power`). So the metadata file grows by **+25 rows
>    (7 gapfill + 18 rehab), not +39** — cardio metadata is done; only its *defs*
>    still need to land in `index.html`. (This is why an earlier "→191" estimate
>    was a double-count.)
> 2. **The 18 rehab moves have NO metadata at all** — they ship as defs only.
>    They are the gating item: someone must author 18 v1.4.0 rows first (§3).

---

## 1. Current state (confirmed)

- `exercise-metadata.js` is **v1.4.0, 177 entries** (163 canonical + 14 cardio
  staged) and is **already loaded by index.html** — `<script src="exercise-metadata.js">`
  at **L3015**, right after the DB block (`]; // END EXERCISE DATA` L3011,
  `</script>` L3012). Its self-check IIFE already runs and logs the 14 cardio as
  staged (`console.info`).
- No pack is wired into `index.html` yet (no pack `<script>` tags, no `concat`).
- All three def files are self-contained, expose a global array, integrate by
  `concat` after the DB block:
  - `window.cardioHiitExercises` (14) — `createEx()`-shaped.
  - `window.mobilityGapfillExercises` (7) — `createEx()`-shaped.
  - `window.rehabMobilityExercises` (18) — `createRehabEx()`-shaped = `createEx`
    shape **plus an extra `region` field**.
- **No name collisions** anywhere: the 18 rehab names are unique vs the 163, the
  14 cardio, AND the 7 gapfill (verified). Cross-pack uniqueness holds across all
  three packs.

---

## 2. Pack 1 (cardio) & Pack 2 (gapfill) — unchanged from the prior plan

**Cardio (14):** metadata rows already in-file (canonical 12-field v1.4.0). Action
= land the *defs* only (T1). Do NOT re-paste from the superseded v1.2.0
`_cardio_hiit_meta.md` block.

**Gapfill (7):** paste the FINAL rows from `_mobility_gapfill_meta.md` verbatim
(field order already matches the 12-field schema). Introduces rehabCategory
`neck-prehab` (×3) + `elbow-prehab` (×2), the live `neck` muscle key, and a new
`cat:["Neck"]` display surface (→ T5). `compound`: true×3 / false×4, canonical.
movementPattern values used (`rotation`, `mobility`) are valid in the canonical
enum.

> ⚠ **movementPattern enum divergence (still open, now affects Pack 3 too).**
> `_mobility_gapfill_meta.md` documents a *camelCase* enum with
> `core`/`isometric`/`plyometric` (`horizontalPush·…·antiRotation·core·isometric·plyometric·mobility`).
> The **canonical** enum enforced by `exercise-metadata.js` v1.4.0 is **hyphenated**
> (`push-horizontal · anti-rotation · anti-extension · isolation`; no
> core/isometric/plyometric). Gapfill's 7 rows only use `rotation`/`mobility`
> (common to both) so they pass — but **Pack 3 must be authored against the
> canonical hyphenated enum** (§3), and T5 must reconcile the two vocabularies in
> `_taxonomy_resolution.md` before anyone uses `core`/`isometric`/`plyometric`.

---

## 3. Pack 3 (rehab-mobility, 18) — schema-parity audit + required upgrade pass

### 3a. Audit result — they predate the schema entirely
`rehab-mobility-exercises.js` carries **defs only**: `createRehabEx()` returns the
`createEx` shape (`name, cat, equip, type, guide{prep,exec,tips,benefits,muscles},
setup`) **plus one extra `region` field**. There is **no companion `_meta.md`** and
**no `window.exerciseMeta` rows**.

**Parity against v1.4.0 (12 fields): 0 / 18 rows exist.** For every one of the 18,
ALL of the following are **missing** (not divergent — absent):
`alternatives, jointLoad (dense 9-joint), strainScore, aggravates, rehabCategory,
logMode, bucket, equipmentNorm, musclesTargeted, movementPattern, laterality,
compound`.

The only metadata-adjacent field present is **`region`** (one of: shoulder,
thoracic, hip, knee, ankle, lower-back, wrist) — a coarse precursor to
`rehabCategory`, **not** a v1.4.0 field. It is **not 1:1** with rehabCategory (see
3c, McGill Curl-Up).

→ **This is a full authoring pass, not a patch. Owner: T2** (same author/format as
the cardio & gapfill `_*_meta.md` companions). Deliverable: **`_rehab_mobility_meta.md`**
with 18 v1.4.0 rows. Until it exists, the rehab defs **cannot** land (a def with no
metadata is a self-check `console.error`).

### 3b. Authoring requirements for T2 (per the v1.4.0 contract)
- **Dense 9-joint `jointLoad`** (`neck, shoulder, elbow, wrist, tSpine, lowBack,
  hip, knee, ankle`, each 0–3, explicit zeros — a `0` must mean "spared"). Per
  `_joint_tagging_rubric.md`.
- **Derived** `strainScore = min(10, Σ)` and `aggravates = joints ≥ 2`.
- **`compound` = canonical rule: (#joints with load ≥ 1) ≥ 2** — computed strictly,
  the self-check re-derives it.
- **`movementPattern`: hyphenated canonical enum only** (see §2 flag). Most of
  the 18 are `mobility`; the CARs-style drills are `rotation`; McGill Curl-Up is
  `anti-extension`. Seed suggestions in 3c (T2 finalises with the jointLoad).
- **`laterality`** ∈ `bilateral | unilateral | alternating`.
- **`bucket`: all 18 → `resilience`** (type `Mobility`, equip `Bodyweight`).
- **`equipmentNorm`: all 18 → `bodyweight`**. **`logMode`:** stretches/holds →
  `time`; CARs / curl-ups / step-downs / press-ups (counted) → `reps`.
- **`musclesTargeted` (24-vocab).** ⚠ Two source tokens are **not in the
  normaliser** and must be mapped first: **`Piriformis` → `glutes`** and
  **`Spinal Erectors` → `lowerBack`**. (`Thoracic Spine` already maps to
  `lowerBack` — acceptable.)
- **`alternatives`** must resolve to `allExercises ∪ metadata keys` (existing
  mobility moves — e.g. Cat-Cow, 90/90 Hip Switch, Wall Slides, Couch Stretch — or
  in-pack names). The self-check validates this.

### 3c. region → rehabCategory + seed movementPattern/laterality (for T2)
**No NEW rehabCategory values are required** — all 18 map into the existing 12
(post-gapfill). One region≠category exception is flagged.

| # | move | region | → rehabCategory | seed movementPattern | seed laterality |
|---|---|---|---|---|---|
| 1 | Arm Circles | shoulder | shoulder-prehab | mobility | bilateral |
| 2 | Prone Y-T-W Raise | shoulder | shoulder-prehab | isolation | bilateral |
| 3 | Sleeper Stretch | shoulder | shoulder-prehab | mobility | unilateral |
| 4 | Thread the Needle | thoracic | spine-mobility | mobility | unilateral |
| 5 | Open Book Stretch | thoracic | spine-mobility | mobility | unilateral |
| 6 | Quadruped Thoracic Rotation | thoracic | spine-mobility | rotation | unilateral |
| 7 | Pigeon Pose | hip | hip-mobility | mobility | unilateral |
| 8 | Frog Stretch | hip | hip-mobility | mobility | bilateral |
| 9 | Standing Hip CARs | hip | hip-mobility | rotation | unilateral |
| 10 | Reverse Nordic Curl | knee | knee-prehab | mobility | bilateral |
| 11 | Eccentric Step Down | knee | knee-prehab | lunge | unilateral |
| 12 | Knee-to-Wall Ankle Rock | ankle | ankle-prehab | mobility | unilateral |
| 13 | Ankle Alphabet | ankle | ankle-prehab | mobility | unilateral |
| 14 | Child's Pose | lower-back | spine-mobility | mobility | bilateral |
| 15 | McGill Curl-Up | lower-back | **core-stability** ⚠ | anti-extension | bilateral |
| 16 | Prone Press-Up | lower-back | spine-mobility | mobility | bilateral |
| 17 | Wrist Flexor Stretch | wrist | wrist-prehab | mobility | unilateral |
| 18 | Wrist Extensor Stretch | wrist | wrist-prehab | mobility | unilateral |

⚠ **McGill Curl-Up** is `region:"lower-back"` but is an anti-flexion *core-stiffness*
drill → `rehabCategory:"core-stability"`, not spine-mobility. region tags are
coarser than rehabCategory; map per-move, not per-region.

ℹ Optional taxonomy call (T5): "thoracic" rows fold into `spine-mobility`. A
dedicated `tspine-mobility` could be added for granularity (the `tSpine` joint
already exists), but the default recommendation is **keep `spine-mobility`** — no
vocab bloat.

ℹ **No new display `cat`** from this pack (uses existing Shoulders/Back/Legs/
Glutes/Core/Arms) — unlike gapfill's "Neck". **Media bonus:** `Pigeon Pose` and
`Child's Pose` already exist as orphaned `exerciseMedia` keys → they gain GIF/YT
for free on integration.

---

## 4. Bucket re-tally (all three packs)

**Metadata-file bucket counts:**
| bucket | 177 (now) | 184 (+7 gapfill) | **202 (+18 rehab)** | total Δ |
|---|--:|--:|--:|--:|
| strength | 110 | 110 | **110** | 0 |
| resilience | 40 | 47 | **65** | **+25** (7 + 18, all resilience) |
| cardio | 17 | 17 | **17** | 0 *(already counted)* |
| power | 10 | 10 | **10** | 0 *(already counted)* |

**Live-app bucket deltas** as defs land, `163 → 202`:
| bucket | 163 baseline | **202 final** | Δ | from |
|---|--:|--:|--:|---|
| cardio | 5 | **17** | +12 | cardio defs |
| power | 8 | **10** | +2 | cardio defs (Pop Squat, Pogo Hops) |
| resilience | 40 | **65** | **+25** | gapfill (7) + rehab (18) |
| strength | 110 | 110 | 0 | — |

### rehabCategory re-tally (metadata, 177 → 202) — distinct count stays **12**
| category | 177 | +gapfill | +rehab | **202** |
|---|--:|--:|--:|--:|
| (null) | 140 | — | — | 140 |
| shoulder-prehab | 10 | — | +3 | 13 |
| spine-mobility | 5 | — | +5 (3 thoracic, 2 lower-back) | 10 |
| hip-mobility | 6 | — | +3 | 9 |
| movement-prep | 6 | — | — | 6 |
| knee-prehab | 1 | +1 | +2 | 4 |
| ankle-prehab | 1 | +1 | +2 | 4 |
| wrist-prehab | 1 | — | +2 | 3 |
| core-stability | 2 | — | +1 (McGill) | 3 |
| adductor-prehab | 3 | — | — | 3 |
| **neck-prehab** *(new, gapfill)* | 0 | +3 | — | 3 |
| hip-prehab | 2 | — | — | 2 |
| **elbow-prehab** *(new, gapfill)* | 0 | +2 | — | 2 |

→ **Only the gapfill pack introduces new rehabCategory values** (`neck-prehab`,
`elbow-prehab`). The 18 rehab moves add **no** new categories. Non-null total 62 +
140 null = **202** ✓.

---

## 5. Self-check updates (one consolidated edit, metadata file)

- **`movementPattern` / `laterality` / `compound`: already validated** in v1.4.0
  (enum membership + `compound` re-derivation). No code change — provided Pack 3 is
  authored to the canonical enum (§3b). Pack-3 patterns used (`mobility`,
  `rotation`, `isolation`, `lunge`, `anti-extension`) are all in the canonical enum.
- **`rehabCategory` enum guard (required):** currently rehabCategory is NOT
  enum-checked. Add a guard listing the **12** allowed values (+`null`):
  `shoulder-prehab, hip-prehab, adductor-prehab, knee-prehab, ankle-prehab,
  wrist-prehab, neck-prehab, elbow-prehab, hip-mobility, spine-mobility,
  core-stability, movement-prep`.
- **Header doc:** rehabCategory vocabulary 10 → 12; note `neck` muscle key live;
  bump **v1.4.0 → v1.5.0**.
- Baseline after merge: `missing 0 · staged 0 · incomplete 0 · badEnums 0 ·
  badAlts 0` across all **202**.

---

## 6. Ownership split & ordering (ONE integration build)

| change | owner | file |
|---|---|---|
| **Author 18 rehab v1.4.0 rows** → `_rehab_mobility_meta.md` (canonical enum, dense joints, Piriformis/Spinal-Erectors normalised) | **T2** (BLOCKER) | new `_meta.md` |
| Finalise the 7 gapfill rows | T2 | `_mobility_gapfill_meta.md` (done) |
| Merge into metadata: +7 gapfill +18 rehab rows; rehabCategory guard; header; **v1.5.0** | metadata (T3) | `exercise-metadata.js` |
| Add 3 pack `<script>` tags + one `concat`; live 163→202; **commit** | **T1** | `index.html` |
| Reconcile movementPattern enum; "Neck" cat; optional `tspine-mobility` | T5 | taxonomy |

### index.html edit (T1) — placement is load-bearing
Insert **between L3012 (`</script>` of the DB block) and L3015
(`<script src="exercise-metadata.js">`)** so `allExercises` is complete *before* the
metadata self-check runs:

```html
]; // END EXERCISE DATA            (L3011)
</script>                          (L3012)

<script src="cardio-hiit-exercises.js"></script>
<script src="mobility-gapfill-exercises.js"></script>
<script src="rehab-mobility-exercises.js"></script>
<script>
  window.allExercises = window.allExercises.concat(
      window.cardioHiitExercises,
      window.mobilityGapfillExercises,
      window.rehabMobilityExercises);            // 163 -> 202
</script>

<!-- Exercise metadata ... -->
<script src="exercise-metadata.js"></script>     (was L3015)
```
- The `region` field on the 18 rehab defs is an extra key on each
  `allExercises` entry — **harmless** (the app reads name/cat/equip/type/guide).
  Keep it (reconciliation breadcrumb) or strip on concat; cosmetic only.

### Co-landing rules (prevent self-check error spam)
- **Cardio defs** may land independently — rows already exist.
- **Gapfill defs** must land **with** their rows (T2 done).
- **Rehab defs** must land **only after** T2 authors + T3 merges the 18 rows —
  otherwise 18 `console.error` "no metadata". Rehab is gated on T2's pass.
- **Safe sequence for the single build:** (1) T2 authors the 18 rehab rows;
  (2) T3 merges all rows (7 gapfill + 18 rehab → 202) + self-check/header/v1.5.0;
  (3) T1 adds the 3 tags + concat (→202) and commits — steps 2 & 3 in the same
  commit (or 2 before 3). Landing rows ahead of defs only yields benign
  `console.info` "staged"; landing defs ahead of rows yields `console.error`.

---

## 7. Acceptance — self-check fully green at 202 / 202

- `missing` 0 · `staged` 0 · `incomplete` (9-joint / strain / aggravates /
  **compound**) 0 · `badEnums` (incl. movementPattern/laterality/**rehabCategory**)
  0 · `badAlts` 0.
- **Name parity** (enforced by missing/staged): each pack's metadata keys ==
  its def names (14 / 7 / 18). Cross-pack uniqueness already verified.
- Compound canonical-rule check passes for all 202 (cardio done; gapfill true×3/
  false×4; rehab per T2's authoring).

---

## 8. Out of scope / not folded here

- The superseded paste-blocks `_cardio_hiit_meta.md` (v1.2.0, 7-joint) — reference
  only; canonical cardio rows already live in `exercise-metadata.js`.
- `missingMediaCandidates` (6 UNVERIFIED GIF/YT entries in
  `rehab-mobility-exercises.js`) + the 69-exercise media-gap audit — a separate
  media-sourcing build, not this metadata merge.
