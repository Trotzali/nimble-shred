# Rehab/Mobility Pack — exercise-metadata.js rows (v1.4.0 schema)

**Author:** T2 (read-only authoring terminal)
**Companion to:** `rehab-mobility-exercises.js` (18 staged moves, defs-only — predate the schema). These rows are the missing metadata, authored to T3's `_spec_metadata_integration.md` §3 contract so the 18 rehab defs can land in the single 202/202 integration build.
**Read-only:** `index.html`, `exercise-metadata.js` untouched; no git.

Worked from **T3's seed table (`_spec_metadata_integration.md` §3c)** — region→rehabCategory, seed movementPattern/laterality — finalising jointLoad + the derived/remaining fields.

---

## Schema — v1.4.0, 12 fields per row

Field order matches `exercise-metadata.js`: `alternatives · jointLoad · strainScore · aggravates · rehabCategory · logMode · bucket · equipmentNorm · musclesTargeted · movementPattern · laterality · compound`.

**Conformance to T3 §3b:**
- **Dense 9-joint `jointLoad`** (`neck, shoulder, elbow, wrist, tSpine, lowBack, hip, knee, ankle`), explicit zeros — a `0` means *spared*. Per `_joint_tagging_rubric.md` (end-range stretch/CAR at the target = `2`).
- **Derived:** `strainScore = min(10, Σ)`; `aggravates = joints ≥ 2` in key order. Both recomputed below.
- **`compound` = CANONICAL rule `(#joints with load ≥ 1) ≥ 2`.** Result: **true ×15 / false ×3** (false = Arm Circles, Sleeper Stretch, Ankle Alphabet — single-joint).
- **`movementPattern` — CANONICAL HYPHENATED enum only.** Values used: `mobility` ×13, `rotation` ×2 (Quadruped Thoracic Rotation, Standing Hip CARs), `isolation` ×1 (Prone Y-T-W Raise), `lunge` ×1 (Eccentric Step Down), `anti-extension` ×1 (McGill Curl-Up). No camelCase `core`/`isometric`/`plyometric`.
- **`laterality`** ∈ `bilateral | unilateral | alternating` (per §3c seeds).
- **`bucket`: resilience ×18. `equipmentNorm`: bodyweight ×18.**
- **`logMode`:** stretches/holds → `time` (×9); CARs / curl-ups / step-downs / press-ups / counted ROM → `reps` (×9).
- **`musclesTargeted` (24-vocab), with T3's normaliser gotchas applied:** `Piriformis → glutes` (Pigeon Pose), `Spinal Erectors → lowerBack` (Prone Press-Up), `Thoracic Spine → lowerBack` (Thread the Needle / Open Book / Quadruped Rotation). No new vocab keys.
- **`rehabCategory`: existing 12 values only** — no new ones. **McGill Curl-Up is region `lower-back` but `core-stability`** (anti-flexion core stiffness, not spine-mobility) per the §3c ⚠ exception.
- **`alternatives`** resolve to `allExercises` names or in-pack (rehab) names — none depend on the cardio/gapfill packs landing.

---

## Paste block

```js
// ===== REHAB/MOBILITY PACK (18 rows, v1.4.0) =====

"Arm Circles": {
    alternatives: ["Shoulder Dislocates", "Wall Slides"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 1,
    aggravates: [],
    rehabCategory: "shoulder-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["frontDelts", "sideDelts", "rearDelts", "rotatorCuff"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: false
},
"Prone Y-T-W Raise": {
    alternatives: ["Wall Slides", "Scapular Push-up"],
    jointLoad: { neck: 0, shoulder: 2, elbow: 0, wrist: 0, tSpine: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["shoulder"],
    rehabCategory: "shoulder-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["traps", "rearDelts", "rhomboids"],
    movementPattern: "isolation",
    laterality: "bilateral",
    compound: true
},
"Sleeper Stretch": {
    alternatives: ["Wall Slides", "Cable External Rotation"],
    jointLoad: { neck: 0, shoulder: 2, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 2,
    aggravates: ["shoulder"],
    rehabCategory: "shoulder-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["rotatorCuff", "rearDelts"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: false
},
"Thread the Needle": {
    alternatives: ["Open Book Stretch", "Cat-Cow"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 0, wrist: 1, tSpine: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 4,
    aggravates: ["tSpine"],
    rehabCategory: "spine-mobility",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["lowerBack", "rhomboids", "rearDelts"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
},
"Open Book Stretch": {
    alternatives: ["Thread the Needle", "Quadruped Thoracic Rotation"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 0, wrist: 0, tSpine: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["tSpine"],
    rehabCategory: "spine-mobility",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["lowerBack", "chest", "obliques"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
},
"Quadruped Thoracic Rotation": {
    alternatives: ["Open Book Stretch", "Thread the Needle"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 0, wrist: 1, tSpine: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 4,
    aggravates: ["tSpine"],
    rehabCategory: "spine-mobility",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["lowerBack", "obliques"],
    movementPattern: "rotation",
    laterality: "unilateral",
    compound: true
},
"Pigeon Pose": {
    alternatives: ["90/90 Hip Switch", "Standing Hip CARs"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
    strainScore: 4,
    aggravates: ["hip"],
    rehabCategory: "hip-mobility",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["glutes", "hipFlexors"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
},
"Frog Stretch": {
    alternatives: ["Cossack Squat", "Deep Squat Hold"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
    strainScore: 4,
    aggravates: ["hip"],
    rehabCategory: "hip-mobility",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["adductors", "hipFlexors"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: true
},
"Standing Hip CARs": {
    alternatives: ["90/90 Hip Switch", "World's Greatest Stretch"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 2, knee: 1, ankle: 1 },
    strainScore: 4,
    aggravates: ["hip"],
    rehabCategory: "hip-mobility",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["hipFlexors", "glutes", "adductors"],
    movementPattern: "rotation",
    laterality: "unilateral",
    compound: true
},
"Reverse Nordic Curl": {
    alternatives: ["Couch Stretch", "ATG Split Squat"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 1, knee: 2, ankle: 0 },
    strainScore: 3,
    aggravates: ["knee"],
    rehabCategory: "knee-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["quads", "hipFlexors"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: true
},
"Eccentric Step Down": {
    alternatives: ["Glute Bridge", "DB Step Up"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 1, knee: 2, ankle: 1 },
    strainScore: 4,
    aggravates: ["knee"],
    rehabCategory: "knee-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["quads", "glutes"],
    movementPattern: "lunge",
    laterality: "unilateral",
    compound: true
},
"Knee-to-Wall Ankle Rock": {
    alternatives: ["Ankle Alphabet", "Deep Squat Hold"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
    strainScore: 3,
    aggravates: ["ankle"],
    rehabCategory: "ankle-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["calves", "tibialis"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
},
"Ankle Alphabet": {
    alternatives: ["Knee-to-Wall Ankle Rock", "Tibialis Raise"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 1 },
    strainScore: 1,
    aggravates: [],
    rehabCategory: "ankle-prehab",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["calves", "tibialis"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: false
},
"Child's Pose": {
    alternatives: ["Cat-Cow", "Dead Hang"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 0, wrist: 0, tSpine: 0, lowBack: 1, hip: 1, knee: 1, ankle: 0 },
    strainScore: 4,
    aggravates: [],
    rehabCategory: "spine-mobility",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["lowerBack", "lats"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: true
},
"McGill Curl-Up": {
    alternatives: ["Dead Bug", "Bird Dog"],
    jointLoad: { neck: 1, shoulder: 0, elbow: 0, wrist: 0, tSpine: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
    strainScore: 2,
    aggravates: [],
    rehabCategory: "core-stability",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["abs", "obliques"],
    movementPattern: "anti-extension",
    laterality: "bilateral",
    compound: true
},
"Prone Press-Up": {
    alternatives: ["Cat-Cow", "Thoracic Extension"],
    jointLoad: { neck: 0, shoulder: 1, elbow: 1, wrist: 1, tSpine: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
    strainScore: 5,
    aggravates: ["lowBack"],
    rehabCategory: "spine-mobility",
    logMode: "reps",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["lowerBack"],
    movementPattern: "mobility",
    laterality: "bilateral",
    compound: true
},
"Wrist Flexor Stretch": {
    alternatives: ["Wrist Extensor Stretch", "Wrist Rocks"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 1, wrist: 2, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["wrist"],
    rehabCategory: "wrist-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["forearms"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
},
"Wrist Extensor Stretch": {
    alternatives: ["Wrist Flexor Stretch", "Wrist Rocks"],
    jointLoad: { neck: 0, shoulder: 0, elbow: 1, wrist: 2, tSpine: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3,
    aggravates: ["wrist"],
    rehabCategory: "wrist-prehab",
    logMode: "time",
    bucket: "resilience",
    equipmentNorm: "bodyweight",
    musclesTargeted: ["forearms"],
    movementPattern: "mobility",
    laterality: "unilateral",
    compound: true
}
```

---

## Per-move rationale

| # | move | region → rehabCategory | jointLoad (non-zero) | strain | aggravates | pattern · laterality · compound | logMode · scoring rationale |
|---|------|------------------------|----------------------|:--:|---|---|---|
| 1 | Arm Circles | shoulder → shoulder-prehab | shoulder 1 | 1 | — | mobility · bilateral · **false** | time · gentle unloaded dynamic warm-up; single light joint → spared elsewhere, no aggravates. |
| 2 | Prone Y-T-W Raise | shoulder → shoulder-prehab | shoulder 2, tSpine 1 | 3 | shoulder | isolation · bilateral · true | reps · overhead "Y" = end-range shoulder (2); mild prone thoracic extension (1); lowBack cued OUT → 0. |
| 3 | Sleeper Stretch | shoulder → shoulder-prehab | shoulder 2 | 2 | shoulder | mobility · unilateral · **false** | time · end-range posterior-capsule stretch at the target (2); body side-lying supported. |
| 4 | Thread the Needle | thoracic → spine-mobility | shoulder 1, wrist 1, tSpine 2 | 4 | tSpine | mobility · unilateral · true | time · end-range thoracic rotation (2); quadruped → light wrist/support-shoulder (1). |
| 5 | Open Book Stretch | thoracic → spine-mobility | shoulder 1, tSpine 2 | 3 | tSpine | mobility · unilateral · true | time · thoracic rotation with lumbar locked (knees down) → tSpine 2, lowBack 0; sweeping arm 1. |
| 6 | Quadruped Thoracic Rotation | thoracic → spine-mobility | shoulder 1, wrist 1, tSpine 2 | 4 | tSpine | rotation · unilateral · true | reps · CAR-style counted thoracic rotation (2); quadruped wrist/shoulder support (1). |
| 7 | Pigeon Pose | hip → hip-mobility | lowBack 1, hip 2, knee 1 | 4 | hip | mobility · unilateral · true | time · deep glute/ER end-range (hip 2); front knee flexed-loaded (1); forward fold (lowBack 1). Piriformis→glutes. |
| 8 | Frog Stretch | hip → hip-mobility | lowBack 1, hip 2, knee 1 | 4 | hip | mobility · bilateral · true | time · deep adductor end-range (hip 2); knees wide on floor (1); flat-back cue (lowBack 1). |
| 9 | Standing Hip CARs | hip → hip-mobility | hip 2, knee 1, ankle 1 | 4 | hip | rotation · unilateral · true | reps · controlled end-range hip rotation (2); raised-knee + standing-balance leg (1/1). |
| 10 | Reverse Nordic Curl | knee → knee-prehab | hip 1, knee 2 | 3 | knee | mobility · bilateral · true | reps · long-range patellar-tendon load (knee 2); hip-flexor stretch / glute-set (1). |
| 11 | Eccentric Step Down | knee → knee-prehab | hip 1, knee 2, ankle 1 | 4 | knee | lunge · unilateral · true | reps · single-leg eccentric knee control (2); glute control (1); balance/dorsiflex (ankle 1). |
| 12 | Knee-to-Wall Ankle Rock | ankle → ankle-prehab | knee 1, ankle 2 | 3 | ankle | mobility · unilateral · true | reps · end-range loaded dorsiflexion (ankle 2); knee drives forward (1). |
| 13 | Ankle Alphabet | ankle → ankle-prehab | ankle 1 | 1 | — | mobility · unilateral · **false** | reps · seated, unloaded all-direction ROM; gentle (1), the spared-ankle option, no aggravates. |
| 14 | Child's Pose | lower-back → spine-mobility | shoulder 1, lowBack 1, hip 1, knee 1 | 4 | — | mobility · bilateral · true | time · diffuse light load (decompression position); 4 joints at 1 → compound but **no aggravates** (nothing ≥2). |
| 15 | McGill Curl-Up | lower-back → **core-stability** ⚠ | neck 1, lowBack 1 | 2 | — | anti-extension · bilateral · true | reps · lumbar arch deliberately PRESERVED (hands support) → lowBack 1; small head lift → neck 1. Region≠category. |
| 16 | Prone Press-Up | lower-back → spine-mobility | shoulder 1, elbow 1, wrist 1, lowBack 2 | 5 | lowBack | mobility · bilateral · true | reps · end-range lumbar extension (2 — aggravates an irritable lumbar); press on hands (1/1/1). Spinal Erectors→lowerBack. |
| 17 | Wrist Flexor Stretch | wrist → wrist-prehab | elbow 1, wrist 2 | 3 | wrist | mobility · unilateral · true | time · end-range wrist-extension stretch (2); straight-elbow assist (1). |
| 18 | Wrist Extensor Stretch | wrist → wrist-prehab | elbow 1, wrist 2 | 3 | wrist | mobility · unilateral · true | time · end-range wrist-flexion stretch (2); straight-elbow assist (1). |

**Pack shape:** strain 1–5 (all low — joint-care drills). `rehabCategory`: shoulder-prehab ×3 · spine-mobility ×5 (3 thoracic + 2 lower-back) · hip-mobility ×3 · knee-prehab ×2 · ankle-prehab ×2 · wrist-prehab ×2 · core-stability ×1 — **all within the existing 12, zero new values**. `movementPattern`: mobility ×13 · rotation ×2 · isolation ×1 · lunge ×1 · anti-extension ×1 (canonical hyphenated). `laterality`: bilateral ×7 · unilateral ×11. `logMode`: time ×9 · reps ×9. `compound`: true ×15 · false ×3. `bucket`: resilience ×18 · `equipmentNorm`: bodyweight ×18. Matches T3 §4 tally exactly (+18 resilience; rehabCategory distribution: shoulder-prehab +3, spine-mobility +5, hip-mobility +3, knee-prehab +2, ankle-prehab +2, wrist-prehab +2, core-stability +1).

**Integration checks (for T3's merge):**
- **All 36 `alternatives` resolve** to a confirmed `allExercises` name (Shoulder Dislocates, Wall Slides, Cable External Rotation, Cat-Cow, 90/90 Hip Switch, World's Greatest Stretch, Cossack Squat, Deep Squat Hold, Couch Stretch, ATG Split Squat, Glute Bridge, DB Step Up, Tibialis Raise, Dead Hang, Dead Bug, Bird Dog, Thoracic Extension, Wrist Rocks, Scapular Push-up) or an in-pack rehab name (Open Book Stretch, Quadruped Thoracic Rotation, Thread the Needle, Standing Hip CARs, Ankle Alphabet, Knee-to-Wall Ankle Rock, Wrist Flexor/Extensor Stretch). **No dependency on the cardio or gapfill packs landing.**
- **Normaliser gotchas applied:** Piriformis→glutes (#7), Spinal Erectors→lowerBack (#16), Thoracic Spine→lowerBack (#4/#5/#6). No out-of-vocab muscle tokens.
- **No new `rehabCategory`** (the gapfill pack already added neck-prehab/elbow-prehab; this pack adds none). **No new display `cat`** (uses existing Shoulders/Back/Legs/Glutes/Core/Arms).
- **Derived fields self-consistent:** every `strainScore` = Σ jointLoad; every `aggravates` = joints ≥2 in key order; every `compound` = (#joints ≥1) ≥ 2. Safe for the self-check re-derivation.
- Ship these 18 rows **with** the 18 rehab defs in the same build (def-without-row = `console.error`; row-without-def = benign `console.info` "staged").

---

**Sign-off:** T2 — 2026-06-11 14:29
