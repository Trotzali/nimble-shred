// ============================================================================
// NIMBLE SHRED — EXERCISE METADATA SUBSTRATE (v1.1.0)
// ============================================================================
// Standalone data layer for pain-aware exercise swapping, prehab/rehab
// programming, set-logging UX, and training-bucket / equipment filtering.
// NOT yet loaded by index.html — prep substrate for a future feature. Keyed by
// the EXACT exercise name as it appears in window.allExercises (index.html v60,
// 163 exercises).
//
// SCHEMA — window.exerciseMeta[exerciseName] = {
//
//   alternatives: string[]
//       Exercises with the same (or closely related) movement pattern that
//       impose LOWER or differently-distributed joint stress — candidates
//       for a pain-driven swap. Every name is guaranteed to exist in the
//       canonical 163-exercise list. An empty array means the exercise is
//       already the lowest-stress option for its pattern in the database.
//
//   jointLoad: { shoulder, elbow, wrist, lowBack, hip, knee, ankle }
//       Mechanical stress this exercise places on each joint/region:
//       0 = none, 1 = low, 2 = moderate, 3 = high.
//       Derived from the movement pattern, loading position, and target
//       muscles documented in the exercise's index.html entry.
//
//   strainScore: number (0-10)
//       Overall systemic strain, DERIVED from jointLoad:
//       strainScore = min(10, sum of all seven jointLoad values).
//
//   aggravates: string[]
//       Joint keys this exercise is likely to irritate when already sore.
//       DERIVED from jointLoad: every joint with load >= 2.
//
//   rehabCategory: string | null
//       null for main training lifts. Otherwise tags the drill's
//       prep/rehab role. Vocabulary:
//         "shoulder-prehab"  - rotator cuff / scapular health
//         "hip-prehab"       - glute med / abductor strength
//         "adductor-prehab"  - groin strength & resilience
//         "knee-prehab"      - knee-over-toes strengthening
//         "ankle-prehab"     - tibialis / lower-leg strengthening
//         "wrist-prehab"     - wrist / forearm conditioning
//         "hip-mobility"     - hip range-of-motion drills
//         "spine-mobility"   - spinal range-of-motion drills
//         "core-stability"   - motor-control / anti-movement drills
//         "movement-prep"    - locomotion & animal-flow warmup drills
//
//   ── T3 ADDITIONS (v1.1.0) ────────────────────────────────────────────────
//
//   logMode: "weight_reps" | "reps" | "time" | "distance"   (how a set is logged)
//       "weight_reps"  loaded rep work (cable / dumbbell / free-weight lifts).
//       "reps"         bodyweight rep movements (push-ups, squats, jumps,
//                      mobility reps).
//       "time"         isometric holds, loaded/grip carries, travelling
//                      locomotion (bear crawl, crab walk, skips), and
//                      sustained-cardio / agility drills done for duration.
//       "distance"     reserved (sprint / sled / run-for-distance). No v60
//                      exercise uses it — travelling locomotion is logged by
//                      time per the convention above.
//       Derived from the exercise's movement + equipment in index.html.
//
//   bucket: "strength" | "power" | "resilience"   (training-stimulus class)
//       "strength"    loaded strength, muscle-build, calisthenic strength,
//                     nimble strength, and steady-state conditioning.
//       "power"       plyometric / ballistic work (type "Plyo" plus the
//                     jump/bound/hop moves: Jump Squat, Jumping Lunge,
//                     Box Jump, Skater Hops).
//       "resilience"  mobility drills (type "Mobility") and anything carrying
//                     a rehabCategory (prehab). Prehab wins over strength for
//                     dual-purpose nimble moves (e.g. Tibialis Raise,
//                     Dead Hang, Copenhagen Plank, Powell Raise).
//       Priority: (Mobility OR rehabCategory) -> resilience; else Plyo/jump
//       -> power; else -> strength.
//
//   equipmentNorm: "bodyweight" | "dumbbell" | "cable" | "gym/machines"
//       Normalised equipment that reconciles the two in-app filter vocabularies:
//         Builder     cables / dumbbells / barbells / bodyweight
//         Quick Start full gym / dumbbells / bodyweight
//       Cross-walk:
//         "bodyweight"   <- Bodyweight   (Builder "bodyweight" / QS "bodyweight")
//         "dumbbell"     <- Dumbbell     (Builder "dumbbells"  / QS "dumbbells")
//         "cable"        <- Cable        (Builder "cables", part of QS "full gym")
//         "gym/machines" <- Free Weight  (Builder "barbells" + plates/fixed
//                                          machines, the gym-only slice of QS
//                                          "full gym")
//       Quick Start "full gym" = { cable, gym/machines }.
//
// The three T3 fields are independent of the original five and can be read,
// edited, or dropped without affecting pain-swap logic.
//
// GENERATED from the canonical exercise database in index.html (v60).
// All 163 exercises covered; all alternative names validated to resolve.
// ============================================================================

window.exerciseMeta = {
    "Cable Chest Press": {
        alternatives: ["DB Floor Press", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Chest Fly (High)": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Chest Fly (Low)": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Chest Fly (Mid)": {
        alternatives: ["Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Single Arm Cable Chest Press": {
        alternatives: ["Cable Chest Press", "DB Floor Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Crossover": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Pullover (Bench)": {
        alternatives: ["Straight Arm Pulldown"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Lat Pulldown (Standing)": {
        alternatives: ["Straight Arm Pulldown", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 1, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Seated Cable Row": {
        alternatives: ["Single Arm Cable Row", "Inverted Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Face Pulls": {
        alternatives: ["Cable Rear Delt Fly", "Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Straight Arm Pulldown": {
        alternatives: ["Lat Pulldown (Standing)"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Single Arm Cable Row": {
        alternatives: ["Inverted Row", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Shrugs": {
        alternatives: ["DB Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Rear Delt Fly": {
        alternatives: ["Face Pulls", "Powell Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "High Row (Rope)": {
        alternatives: ["Face Pulls", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Overhead Press": {
        alternatives: ["Dumbbell Shoulder Press", "Cable Front Raise"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Lateral Raise": {
        alternatives: ["Lateral Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Front Raise": {
        alternatives: ["Front Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable External Rotation": {
        alternatives: ["Face Pulls", "Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Internal Rotation": {
        alternatives: ["Cable External Rotation", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Upright Row": {
        alternatives: ["Cable Lateral Raise", "Lateral Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Y-Raise": {
        alternatives: ["Wall Slides", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Tricep Pushdown (Rope)": {
        alternatives: ["Cable Kickback"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Tricep Pushdown (Bar)": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Overhead Cable Extension": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Bicep Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Hammer Curl": {
        alternatives: ["Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Bayesian Curl": {
        alternatives: ["Cable Bicep Curl", "Cable Hammer Curl"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Kickback": {
        alternatives: ["Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Reverse Grip Pushdown": {
        alternatives: ["Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Squat": {
        alternatives: ["Bodyweight Squat", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Pull-Through": {
        alternatives: ["Glute Bridge", "Cable Kickback (Glute)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable RDL": {
        alternatives: ["Cable Pull-Through", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Lunge": {
        alternatives: ["Lunge (BW)", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Kickback (Glute)": {
        alternatives: ["Glute Bridge", "Cable Donkey Kick"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Calf Raise": {
        alternatives: ["Calf Raise (BW)", "Seated Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 2 },
        strainScore: 2,
        aggravates: ["ankle"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Abductor": {
        alternatives: ["Cable Hip Abduction (Standing)", "Side Plank"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "hip-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Adductor": {
        alternatives: ["Cable Hip Adduction (Standing)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "adductor-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Crunch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Woodchopper (High to Low)": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Pallof Press": {
        alternatives: ["Dead Bug", "Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Side Bend": {
        alternatives: ["Side Plank", "Pallof Press"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Woodchopper (Low to High)": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Dumbbell Bench Press": {
        alternatives: ["DB Floor Press", "Push-ups"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Incline Press": {
        alternatives: ["DB Floor Press", "Decline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Fly": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Shoulder Press": {
        alternatives: ["Front Raise", "Lateral Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Arnold Press": {
        alternatives: ["Dumbbell Shoulder Press", "Front Raise"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Lateral Raise": {
        alternatives: ["Cable Lateral Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Front Raise": {
        alternatives: ["Cable Front Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Row": {
        alternatives: ["Seated Cable Row", "Inverted Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Pullover": {
        alternatives: ["Straight Arm Pulldown"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Goblet Squat": {
        alternatives: ["Bodyweight Squat", "Cable Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Lunge": {
        alternatives: ["Lunge (BW)", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Bulgarian Split Squat": {
        alternatives: ["DB Step Up", "Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Romanian Deadlift (DB)": {
        alternatives: ["Cable Pull-Through", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 3, hip: 2, knee: 1, ankle: 0 },
        strainScore: 6,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Dumbbell Curl": {
        alternatives: ["Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Hammer Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Tricep Kickback": {
        alternatives: ["Cable Kickback", "Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Skull Crusher (DB)": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Farmers Walk": {
        alternatives: ["Plank", "DB Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 1, knee: 1, ankle: 1 },
        strainScore: 6,
        aggravates: [],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Zottman Curl": {
        alternatives: ["Hammer Curl", "Dumbbell Curl"],
        jointLoad: { shoulder: 0, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow", "wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Concentration Curl": {
        alternatives: ["Dumbbell Curl", "Cable Bicep Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "DB Floor Press": {
        alternatives: ["Svend Press", "Incline Push-up"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Renegade Row": {
        alternatives: ["Dumbbell Row", "Bird Dog"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "DB Step Up": {
        alternatives: ["Lunge (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 1 },
        strainScore: 4,
        aggravates: ["knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "DB Shrugs": {
        alternatives: ["Cable Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Seated Calf Raise": {
        alternatives: ["Calf Raise (BW)", "Cable Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
        strainScore: 3,
        aggravates: ["ankle"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Push-ups": {
        alternatives: ["Incline Push-up", "DB Floor Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Pull-ups": {
        alternatives: ["Lat Pulldown (Standing)", "Inverted Row"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Chin-ups": {
        alternatives: ["Lat Pulldown (Standing)", "Inverted Row"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Dips": {
        alternatives: ["Close Grip Push-up", "Push-ups"],
        jointLoad: { shoulder: 3, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Bodyweight Squat": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Lunge (BW)": {
        alternatives: ["Bodyweight Squat", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Glute Bridge": {
        alternatives: ["Cable Kickback (Glute)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Plank": {
        alternatives: ["Dead Bug", "Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Side Plank": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Mountain Climbers": {
        alternatives: ["Dead Bug", "High Knees"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "hip"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Burpees": {
        alternatives: ["Jumping Jacks", "Mountain Climbers"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 2, hip: 2, knee: 2, ankle: 2 },
        strainScore: 10,
        aggravates: ["shoulder", "wrist", "lowBack", "hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Hanging Leg Raise": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 2, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Pike Push-up": {
        alternatives: ["Dumbbell Shoulder Press", "Push-ups"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Pistol Squat": {
        alternatives: ["Bulgarian Split Squat", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Nordic Curl": {
        alternatives: ["Single Leg RDL (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 0 },
        strainScore: 3,
        aggravates: ["knee"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Inverted Row": {
        alternatives: ["Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Handstand Hold": {
        alternatives: ["Pike Push-up", "Dumbbell Shoulder Press"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 3, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Calf Raise (BW)": {
        alternatives: ["Seated Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 1 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Cat-Cow": {
        alternatives: ["Thoracic Extension"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "spine-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Dead Bug": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "core-stability",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Thoracic Extension": {
        alternatives: ["Cat-Cow"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 0,
        aggravates: [],
        rehabCategory: "spine-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "World's Greatest Stretch": {
        alternatives: ["90/90 Hip Switch", "Cat-Cow"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 1, ankle: 1 },
        strainScore: 5,
        aggravates: [],
        rehabCategory: "hip-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "90/90 Hip Switch": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "hip-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Shoulder Dislocates": {
        alternatives: ["Wall Slides"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Wall Slides": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Deep Squat Hold": {
        alternatives: ["90/90 Hip Switch", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "hip-mobility",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Couch Stretch": {
        alternatives: ["90/90 Hip Switch", "World's Greatest Stretch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 0 },
        strainScore: 4,
        aggravates: ["hip", "knee"],
        rehabCategory: "hip-mobility",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Bird Dog": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "core-stability",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Cable Front Squat": {
        alternatives: ["Cable Squat", "Goblet Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Zercher Squat": {
        alternatives: ["Cable Front Squat", "Goblet Squat"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 0, lowBack: 2, hip: 2, knee: 2, ankle: 1 },
        strainScore: 8,
        aggravates: ["lowBack", "hip", "knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Donkey Kick": {
        alternatives: ["Cable Kickback (Glute)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Standing Cable Row": {
        alternatives: ["Seated Cable Row", "Single Arm Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 2, hip: 1, knee: 1, ankle: 0 },
        strainScore: 7,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Lying Cable Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable French Press": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Hip Abduction (Standing)": {
        alternatives: ["Cable Abductor"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "hip-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Hip Adduction (Standing)": {
        alternatives: ["Cable Adductor"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "adductor-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "cable"
    },
    "Cable Wrist Curl": {
        alternatives: ["Wrist Rocks"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Reverse Wrist Curl": {
        alternatives: ["Wrist Rocks"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Russian Twist": {
        alternatives: ["Pallof Press", "Side Plank"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Bicycle Crunch": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Flutter Kicks": {
        alternatives: ["Dead Bug", "Reverse Crunch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "V-Ups": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Reverse Crunch": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Plank Jack": {
        alternatives: ["Plank", "Jumping Jacks"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 1 },
        strainScore: 6,
        aggravates: ["wrist"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Toe Touch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Diamond Push-up": {
        alternatives: ["Close Grip Push-up", "Push-ups"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 7,
        aggravates: ["shoulder", "elbow", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Wide Grip Push-up": {
        alternatives: ["Push-ups", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Decline Push-up": {
        alternatives: ["Push-ups", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Incline Push-up": {
        alternatives: ["DB Floor Press"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Scapular Push-up": {
        alternatives: ["Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Sumo Squat (DB)": {
        alternatives: ["Goblet Squat", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "dumbbell"
    },
    "Curtsy Lunge": {
        alternatives: ["Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Side Lunge": {
        alternatives: ["Sumo Squat (DB)", "Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Single Leg Glute Bridge": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 1, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Good Morning (BW)": {
        alternatives: ["Glute Bridge", "Cable Pull-Through"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: "hip-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Jumping Jacks": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "High Knees": {
        alternatives: ["Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 1, ankle: 2 },
        strainScore: 5,
        aggravates: ["hip", "ankle"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Jump Squat": {
        alternatives: ["Bodyweight Squat", "Box Jump"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Skater Hops": {
        alternatives: ["Side Lunge", "Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Jumping Lunge": {
        alternatives: ["Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Box Jump": {
        alternatives: ["DB Step Up", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Superman": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Swimmers": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Bench Dip": {
        alternatives: ["Close Grip Push-up", "Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 3, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 7,
        aggravates: ["shoulder", "elbow", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Close Grip Push-up": {
        alternatives: ["Tricep Pushdown (Rope)", "Incline Push-up"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["elbow", "wrist"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Plate Pinch": {
        alternatives: ["Farmers Walk", "Dead Hang"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "gym/machines"
    },
    "Svend Press": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "gym/machines"
    },
    "Cable Curl (Behind Back)": {
        alternatives: ["Cable Bicep Curl"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Cable Row (Wide Grip)": {
        alternatives: ["Face Pulls", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Standing Cable Crunch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null,
        logMode: "weight_reps",
        bucket: "strength",
        equipmentNorm: "cable"
    },
    "Bear Crawl": {
        alternatives: ["Bird Dog", "Dead Bug"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Crab Walk": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "movement-prep",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Kick Through": {
        alternatives: ["Bear Crawl"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "movement-prep",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Beast Reach": {
        alternatives: ["Cat-Cow", "Bear Crawl"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 6,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Duck Walk": {
        alternatives: ["Deep Squat Hold", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "movement-prep",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Tibialis Raise": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 1 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "ankle-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "ATG Split Squat": {
        alternatives: ["Lunge (BW)", "Couch Stretch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "knee-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Lu Raise": {
        alternatives: ["Lateral Raise", "Wall Slides"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "dumbbell"
    },
    "Powell Raise": {
        alternatives: ["Cable Rear Delt Fly", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab",
        logMode: "weight_reps",
        bucket: "resilience",
        equipmentNorm: "dumbbell"
    },
    "Wrist Rocks": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["wrist"],
        rehabCategory: "wrist-prehab",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Dead Hang": {
        alternatives: [],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Cossack Squat": {
        alternatives: ["Side Lunge", "90/90 Hip Switch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "hip-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Jefferson Curl": {
        alternatives: ["Cat-Cow"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: "spine-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Scorpion Stretch": {
        alternatives: ["Cat-Cow", "90/90 Hip Switch"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: "spine-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Inchworm": {
        alternatives: ["Cat-Cow", "World's Greatest Stretch"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Thoracic Bridge": {
        alternatives: ["Thoracic Extension", "Cat-Cow"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "spine-mobility",
        logMode: "reps",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "Single Leg RDL (BW)": {
        alternatives: ["Good Morning (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 1, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Lateral Bounds": {
        alternatives: ["Side Lunge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Dot Drill": {
        alternatives: ["Jumping Jacks", "High Knees"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
        strainScore: 3,
        aggravates: ["ankle"],
        rehabCategory: null,
        logMode: "time",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Tuck Jumps": {
        alternatives: ["Jump Squat", "Box Jump"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null,
        logMode: "reps",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "A-Skips": {
        alternatives: ["High Knees", "Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 2 },
        strainScore: 4,
        aggravates: ["ankle"],
        rehabCategory: null,
        logMode: "time",
        bucket: "power",
        equipmentNorm: "bodyweight"
    },
    "Horse Stance Hold": {
        alternatives: ["Deep Squat Hold", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Reverse Plank": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    },
    "Copenhagen Plank": {
        alternatives: ["Side Plank", "Cable Adductor"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: "adductor-prehab",
        logMode: "time",
        bucket: "resilience",
        equipmentNorm: "bodyweight"
    },
    "L-Sit (Tuck)": {
        alternatives: ["Reverse Crunch", "Hanging Leg Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 2, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "hip"],
        rehabCategory: null,
        logMode: "time",
        bucket: "strength",
        equipmentNorm: "bodyweight"
    }
};

// ---------------------------------------------------------------------------
// Self-check (runs only if the app's exercise list is present). Logs loudly
// on any divergence between this file and window.allExercises, and on any
// out-of-vocabulary logMode / bucket / equipmentNorm value.
// ---------------------------------------------------------------------------
(function () {
    if (typeof window === 'undefined' || !window.allExercises || !window.allExercises.length) return;
    try {
        var names = window.allExercises.map(function (e) { return e.name; });
        var missing = names.filter(function (n) { return !window.exerciseMeta[n]; });
        var orphans = Object.keys(window.exerciseMeta).filter(function (n) { return names.indexOf(n) === -1; });
        var badAlts = [];
        var badEnums = [];
        var LOG = ['weight_reps', 'reps', 'time', 'distance'];
        var BUCK = ['strength', 'power', 'resilience'];
        var EQ = ['bodyweight', 'dumbbell', 'cable', 'gym/machines'];
        Object.keys(window.exerciseMeta).forEach(function (n) {
            var m = window.exerciseMeta[n];
            m.alternatives.forEach(function (a) {
                if (names.indexOf(a) === -1) badAlts.push(n + ' -> ' + a);
            });
            if (LOG.indexOf(m.logMode) === -1) badEnums.push(n + ' logMode=' + m.logMode);
            if (BUCK.indexOf(m.bucket) === -1) badEnums.push(n + ' bucket=' + m.bucket);
            if (EQ.indexOf(m.equipmentNorm) === -1) badEnums.push(n + ' equipmentNorm=' + m.equipmentNorm);
        });
        if (missing.length) console.error('[exerciseMeta] Exercises with no metadata:', missing);
        if (orphans.length) console.error('[exerciseMeta] Metadata for unknown exercises:', orphans);
        if (badAlts.length) console.error('[exerciseMeta] Unresolvable alternatives:', badAlts);
        if (badEnums.length) console.error('[exerciseMeta] Out-of-vocabulary field values:', badEnums);
    } catch (err) {
        console.error('[exerciseMeta] self-check failed:', err);
    }
})();
