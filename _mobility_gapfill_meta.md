# Mobility Gap-Fill Pack — exercise-metadata.js rows (v1.4.0 schema)

**Author:** T2 (read-only authoring terminal)
**Date:** 2026-06-08 18:36
**Companion to:** `mobility-gapfill-exercises.js` (7 new moves). Read-only on index.html / exercise-metadata.js / git — no edits. These rows are to PASTE into `window.exerciseMeta` when the pack is integrated.
**Closes:** the two empty regions from `_mobility_gap_analysis.md` — **neck (0→3)** and **elbow (0→2)** — plus a knee and an ankle top-up.

---

## Schema — v1.4.0 (introduced here: 3 new fields)

Builds on v1.3.0 (dense 9-joint `jointLoad`; derived `strainScore`/`aggravates`; 24-key `musclesTargeted`; `logMode`/`bucket`/`equipmentNorm`/`rehabCategory`/`alternatives` per `_joint_tagging_rubric.md` and the file header). **v1.4.0 adds three fields** the niggle/Quick-Start work needs:

```
movementPattern: <shared enum>   // what the move IS, mechanically (one value)
laterality:      "bilateral" | "unilateral" | "alternating"
compound:        boolean         // DERIVED — see rule below
```

- **`movementPattern` — shared enum** (the single vocabulary the whole library uses; the muscle-split types map to it too):
  `horizontalPush · verticalPush · horizontalPull · verticalPull · squat · hinge · lunge · carry · rotation · antiRotation · core · isometric · locomotion · plyometric · mobility`
  Per the brief, the gap-fill moves are **mostly `mobility`**; the **CARs / forearm-rotation drills are `rotation`** (controlled articular rotation).
- **`laterality`** — `bilateral` (one midline structure / both limbs together), `unilateral` (one side at a time), `alternating` (sides trade rhythmically).
- **`compound` — DERIVED, never hand-set:** `compound = (count of joints with jointLoad ≥ 2) ≥ 2`. i.e. *true* when two or more joints are meaningfully loaded; *false* for single-joint isolation/mobility. All 7 gap-fill moves are single-joint → **`compound: false`** (each loads exactly one joint at ≥2). The self-check should re-derive this alongside `strainScore`/`aggravates`.

> `strainScore = min(10, Σ of all 9 jointLoad)` and `aggravates = joints with load ≥ 2` (key order), exactly as v1.3.0 — recomputed below.

### Two NEW `rehabCategory` values introduced
The v1.3.0 vocabulary had no neck or elbow slot (the rubric §5 explicitly reserved the `neck` muscle key for "a future neck-prehab drill"). This pack adds the first of each:
- **`neck-prehab`** — Neck CARs, Chin Tuck, Upper-Trap & Levator Stretch
- **`elbow-prehab`** — Forearm Pronation-Supination, Elbow CARs

(Knee/ankle moves reuse the existing `knee-prehab` / `ankle-prehab`.) Add both new values to the self-check's allowed `rehabCategory` list, mirroring how `shoulder-prehab` already spans strengthening + CARs-style + stretches.

### One NEW `cat` (display) value
The 3 neck moves use **`cat: ["Neck"]`** — no neck category existed. Flagged for the category-layer owner (T5): "Neck" is a new muscle/region label; per `_taxonomy_resolution.md` it sits on the muscle axis. The `neck` **muscle** key (24-vocab) also goes live here for the first time.

---

## Paste block

```js
// ===== MOBILITY GAP-FILL PACK (v1.4.0 rows) =====

"Neck CARs": {
    alternatives: ["Chin Tuck", "Upper-Trap & Levator Stretch"],
    jointLoad: { neck: 2, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 2,
    aggravates: ["neck"],
    rehabCategory: "neck-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["neck", "traps"],
    movementPattern: "rotation",
    laterality: "bilateral",
    compound: false
},
"Chin Tuck": {
    alternatives: ["Wall Slides"],
    jointLoad: { neck: 1, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 1,
    aggravates: [],
    rehabCategory: "neck-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["neck"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: false
},
"Upper-Trap & Levator Stretch": {
    alternatives: ["Chin Tuck"],
    jointLoad: { neck: 2, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 2,
    aggravates: ["neck"],
    rehabCategory: "neck-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["traps", "neck"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: false
},
"Forearm Pronation-Supination": {
    alternatives: ["Wrist Rocks"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 2, wrist: 1, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["elbow"],
    rehabCategory: "elbow-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["forearms", "biceps"],
    movementPattern: "rotation",
    laterality: "unilateral",
    compound: false
},
"Elbow CARs": {
    alternatives: ["Wrist Rocks", "Forearm Pronation-Supination"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 2, wrist: 1, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["elbow"],
    rehabCategory: "elbow-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["biceps", "triceps", "forearms"],
    movementPattern: "rotation",
    laterality: "unilateral",
    compound: false
},
"Terminal Knee Extension": {
    alternatives: ["Glute Bridge"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 1, knee: 2, ankle: 1 },
    strainScore: 4,
    aggravates: ["knee"],
    rehabCategory: "knee-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["quads"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: false
},
"Banded Ankle Eversion-Inversion": {
    alternatives: ["Tibialis Raise"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 2 },
    strainScore: 2,
    aggravates: ["ankle"],
    rehabCategory: "ankle-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["tibialis", "calves"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: false
}
```

---

## Per-move notes (region · pattern · impact · scoring rationale)

| # | Move | Region | movementPattern | logMode | strain | aggravates | Why these numbers (40+ joint-first) |
|---|------|--------|-----------------|---------|:--:|---|-------------------------------------|
| 1 | Neck CARs | neck | rotation | reps | 2 | neck | End-range cervical rotation under head-weight only → neck **2** (rubric: end-range = 2); all else **0**. Aggravates neck by design — a maintenance drill, so the niggle feature correctly routes around it during an acute neck flare and serves Chin Tuck instead. |
| 2 | Chin Tuck | neck | mobility | time | **1** | — | Mid-range gentle isometric, not end-range → neck **1**, nothing ≥2 → **no aggravates**. The one neck drill servable to a mildly stiff neck — the gentle first-line option. |
| 3 | Upper-Trap & Levator Stretch | neck | mobility | time | 2 | neck | End-range cervical side-bend/rotation stretch → neck **2** (consistent with how deep static stretches like Couch Stretch score their target). Shoulder kept **0** (light hand assist, gravity-led). |
| 4 | Forearm Pronation-Supination | elbow | rotation | reps | 3 | elbow | Radioulnar rotation, light/optional load → elbow **2** (the limiting joint, end-range rotation), wrist **1** (holds/rotates). The only forearm-rotation drill in the library. |
| 5 | Elbow CARs | elbow | rotation | reps | 3 | elbow | Full end-range elbow flex/extend + forearm turn → elbow **2**, wrist **1**; upper arm braced so shoulder **0**. Restores the terminal extension pressing erodes. |
| 6 | Terminal Knee Extension | knee | mobility | reps | 4 | knee | Terminal-range knee extension, light band → knee **2** (target/end-range), hip **1** + ankle **1** (standing stabilise). Single moderate joint → isolation, `compound:false`. |
| 7 | Banded Ankle Eversion-Inversion | ankle | mobility | reps | **2** | ankle | Seated, shin still, light band → ankle **2** only; everything else **0**. Adds the loaded side-to-side ankle plane the existing ankle work skips. |

**Pack shape:** strain 1–4 (all low — these are joint-care drills, not conditioning). `movementPattern`: **rotation ×3** (the two CARs + forearm rotation), **mobility ×4** — matching the brief's "most = mobility, CARs = rotation/mobility". `laterality`: bilateral ×2 (the two midline neck activations), unilateral ×5. `compound`: false ×7 (all single-joint isolation by the derived rule). `bucket`: resilience ×7.

**Integration checks (for whoever merges):**
- All `alternatives` resolve to a confirmed `allExercises` name (`Wall Slides`, `Wrist Rocks`, `Glute Bridge`, `Tibialis Raise`) or a move in *this* pack (`Chin Tuck`, `Upper-Trap & Levator Stretch`, `Forearm Pronation-Supination`) — the self-check validates against `allExercises ∪ metadata keys`.
- **Self-check updates required before integration:** add `neck-prehab` + `elbow-prehab` to the allowed `rehabCategory` list; add `movementPattern` / `laterality` / `compound` to the field-presence + vocabulary checks (and the `compound` re-derivation). Until then these 7 will read as "staged" (`console.info`), which is expected.
- The `neck` **muscle** key (24-vocab, previously reserved/unused) and a **"Neck"** display `cat` both go live with this pack — flag to T5 (category layer) and confirm the muscle-vocab self-check already lists `neck` (it does — key 1 of 24).
- Ship the defs (`mobility-gapfill-exercises.js`) AND these rows together; the self-check flags exercises-without-metadata and metadata-without-exercises.

---

**Sign-off:** T2 — 2026-06-08 18:36
