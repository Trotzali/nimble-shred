# Cardio / HIIT Pack — exercise-metadata.js rows (v1.2.0 schema)

**Author:** T2 (read-only authoring terminal)
**Date:** 2026-06-08 17:15
**Companion to:** `cardio-hiit-exercises.js` (14 new moves). Read-only on index.html / exercise-metadata.js — no edits, no git. These are the metadata rows to PASTE into `window.exerciseMeta` when the pack is integrated.

## v1.2.0 schema used here

Extends the existing v1.x row with two new keys the cardio bucket needs:

```
window.exerciseMeta["<exact name>"] = {
  logMode:       "time" | "reps",   // NEW — "time" for sustained/locomotion, "reps" for counted
  bucket:        "cardio" | "power",// NEW — "cardio" = sustained conditioning; "power" = truly ballistic
  equipmentNorm: "bodyweight",      // normalised equipment key
  jointLoad:     { shoulder, elbow, wrist, lowBack, hip, knee, ankle },  // 0–3 each, honest
  strainScore:   number,            // = min(10, sum of jointLoad) — DERIVED
  aggravates:    string[],          // every joint with load >= 2 — DERIVED
  alternatives:  string[],          // same/related pattern, LOWER or differently-distributed stress; all names resolve
  rehabCategory: null               // null — these are conditioning, not prehab/rehab drills
}
```

> Honesty notes baked in: jumping moves carry high knee/ankle; floor-plank moves carry wrist/shoulder; rotational/standing-core moves carry lowBack. `aggravates` is computed strictly from `jointLoad >= 2`, and `strainScore` from the sum, so they stay consistent with the numbers.

---

## Paste block

```js
// ===== HIIT / CONDITIONING CARDIO PACK (v1.2.0 rows) =====

"March in Place": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
    strainScore: 3, aggravates: [],
    alternatives: ["Step Touch", "Shadow Boxing"], rehabCategory: null
},
"Step Touch": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
    strainScore: 3, aggravates: [],
    alternatives: ["March in Place", "Lateral Shuffle"], rehabCategory: null
},
"Lateral Shuffle": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 2 },
    strainScore: 4, aggravates: ["ankle"],
    alternatives: ["Step Touch", "Fast Feet Shuffle"], rehabCategory: null
},
"Standing Knee-to-Elbow": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
    strainScore: 2, aggravates: [],
    alternatives: ["March in Place", "Standing Oblique Twist"], rehabCategory: null
},
"Shadow Boxing": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
    strainScore: 3, aggravates: [],
    alternatives: ["March in Place", "Step Touch"], rehabCategory: null
},
"Squat to Calf Raise": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 2 },
    strainScore: 4, aggravates: ["ankle"],
    alternatives: ["Bodyweight Squat", "March in Place"], rehabCategory: null
},
"Fast Feet Shuffle": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
    strainScore: 3, aggravates: ["ankle"],
    alternatives: ["March in Place", "Step Touch"], rehabCategory: null
},
"Slow Mountain Climber": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
    strainScore: 7, aggravates: ["shoulder", "wrist"],
    alternatives: ["March in Place", "Reverse Lunge to Knee Drive"], rehabCategory: null
},
"Reverse Lunge to Knee Drive": {
    logMode: "reps", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
    strainScore: 5, aggravates: ["knee"],
    alternatives: ["March in Place", "Step Touch"], rehabCategory: null
},
"Standing Oblique Twist": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
    strainScore: 3, aggravates: ["lowBack"],
    alternatives: ["Standing Knee-to-Elbow", "March in Place"], rehabCategory: null
},
"Low Step-Up (Fast)": {
    logMode: "time", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 1 },
    strainScore: 4, aggravates: ["knee"],
    alternatives: ["March in Place", "Step Touch"], rehabCategory: null
},
"No-Jump Burpee": {
    logMode: "reps", bucket: "cardio", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 1, knee: 1, ankle: 0 },
    strainScore: 8, aggravates: ["shoulder", "wrist"],
    alternatives: ["Squat to Calf Raise", "March in Place"], rehabCategory: null
},
"Pop Squat": {
    logMode: "reps", bucket: "power", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 2 },
    strainScore: 7, aggravates: ["hip", "knee", "ankle"],
    alternatives: ["Squat to Calf Raise", "Bodyweight Squat"], rehabCategory: null
},
"Pogo Hops": {
    logMode: "reps", bucket: "power", equipmentNorm: "bodyweight",
    jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 3 },
    strainScore: 6, aggravates: ["knee", "ankle"],
    alternatives: ["Fast Feet Shuffle", "Calf Raise (BW)"], rehabCategory: null
}
```

---

## Per-move impact-level note

| # | Move | Impact | logMode | bucket | strain | Joint-awareness note |
|---|------|--------|---------|--------|:--:|----------------------|
| 1 | March in Place | **LOW** (no airborne phase) | time | cardio | 3 | The floor of the set — feet never both leave the ground. Safe HR-raiser for cranky knees. |
| 2 | Step Touch | **LOW** | time | cardio | 3 | Grounded lateral steps; knee-/ankle-friendly coordination work. |
| 3 | Lateral Shuffle | **LOW** | time | cardio | 4 | No leap, but side-to-side loads the ankle (load 2). Low-impact stand-in for skater hops. |
| 4 | Standing Knee-to-Elbow | **LOW** | time | cardio | 2 | Lowest strain. Standing core — no spine/wrist pressure. |
| 5 | Shadow Boxing | **LOW** (lower-body sparing) | time | cardio | 3 | Knee/ankle load = 0. The go-to when the legs need a complete rest. |
| 6 | Squat to Calf Raise | **LOW** | time | cardio | 4 | No jump; ankle load 2 from the raise. The safe replacement for jump squats. |
| 7 | Fast Feet Shuffle | **LOW** | time | cardio | 3 | Tiny ground-skimming steps; ankle 2. Low-impact alt to the Dot Drill. |
| 8 | Slow Mountain Climber | **LOW** (cardio impact) | time | cardio | 7 | Knee/ankle 0, BUT it's a plank → wrist/shoulder 2. Honest: not for sore wrists/shoulders; controlled tempo protects the back. |
| 9 | Reverse Lunge to Knee Drive | **LOW** | reps | cardio | 5 | No jump; step-back keeps the knee behind the toe (knee load 2). No-jump answer to jumping lunges. |
| 10 | Standing Oblique Twist | **LOW** | time | cardio | 3 | Standing/impact-free, but rotation loads lowBack 2 → keep controlled; swap if back-sensitive. |
| 11 | Low Step-Up (Fast) | **LOW–MODERATE** | time | cardio | 4 | Scalable step height; soft step-down is the key. Joint-smart stand-in for box jumps. *Regression in tips[].* |
| 12 | No-Jump Burpee | **LOW–MODERATE** | reps | cardio | 8 | Jump removed = far less impact, but the plank phase loads wrist/shoulder 2 (highest strain in set). Hands-elevated regression in tips[]. |
| 13 | Pop Squat | **MODERATE** (ballistic) | reps | **power** | 7 | Small hop → hip/knee/ankle all 2. **Regression in tips[]:** step out-and-in for a no-impact version. |
| 14 | Pogo Hops | **MODERATE–HIGH** (ballistic) | reps | **power** | 6 | Highest-impact move — ankle load 3. **Regression in tips[]:** Fast Feet Shuffle or calf raises for the same stimulus, no landing. |

**Set balance:** 10 LOW · 2 LOW–MODERATE · 2 ballistic (the only two `bucket:"power"`). Not a single jump is mandatory to use the pack — the two ballistic moves each name an explicit no-impact regression, satisfying the 40+ joint-first brief.

**Integration checks (for whoever merges):**
- All `alternatives` resolve — either to a move in this pack or to a confirmed existing DB name (`Bodyweight Squat`, `Calf Raise (BW)` — both verified present in index.html). The exercise-metadata.js self-check IIFE will log loudly if any name drifts.
- Add the defs (`cardio-hiit-exercises.js`) AND these rows together; the self-check flags exercises-without-metadata and metadata-without-exercises.

---

**Sign-off:** T2 — 2026-06-08 17:15
