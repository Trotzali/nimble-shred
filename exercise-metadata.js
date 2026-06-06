// ============================================================================
// NIMBLE SHRED — EXERCISE METADATA SUBSTRATE (v1.0.0)
// ============================================================================
// Standalone data layer for pain-aware exercise swapping and prehab/rehab
// programming. NOT yet loaded by index.html — prep substrate for a future
// feature. Keyed by the EXACT exercise name as it appears in
// window.allExercises (index.html v60, 163 exercises).
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
// GENERATED from the canonical exercise database in index.html (v60).
// All 163 exercises covered; all alternative names validated to resolve.
// ============================================================================

window.exerciseMeta = {
    "Cable Chest Press": {
        alternatives: ["DB Floor Press", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Chest Fly (High)": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Chest Fly (Low)": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Chest Fly (Mid)": {
        alternatives: ["Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Single Arm Cable Chest Press": {
        alternatives: ["Cable Chest Press", "DB Floor Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Crossover": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Pullover (Bench)": {
        alternatives: ["Straight Arm Pulldown"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Lat Pulldown (Standing)": {
        alternatives: ["Straight Arm Pulldown", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 1, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "Seated Cable Row": {
        alternatives: ["Single Arm Cable Row", "Inverted Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Face Pulls": {
        alternatives: ["Cable Rear Delt Fly", "Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Straight Arm Pulldown": {
        alternatives: ["Lat Pulldown (Standing)"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Single Arm Cable Row": {
        alternatives: ["Inverted Row", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Shrugs": {
        alternatives: ["DB Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Rear Delt Fly": {
        alternatives: ["Face Pulls", "Powell Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "High Row (Rope)": {
        alternatives: ["Face Pulls", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Overhead Press": {
        alternatives: ["Dumbbell Shoulder Press", "Cable Front Raise"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Cable Lateral Raise": {
        alternatives: ["Lateral Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Front Raise": {
        alternatives: ["Front Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable External Rotation": {
        alternatives: ["Face Pulls", "Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Cable Internal Rotation": {
        alternatives: ["Cable External Rotation", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Cable Upright Row": {
        alternatives: ["Cable Lateral Raise", "Lateral Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Cable Y-Raise": {
        alternatives: ["Wall Slides", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Tricep Pushdown (Rope)": {
        alternatives: ["Cable Kickback"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Tricep Pushdown (Bar)": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null
    },
    "Overhead Cable Extension": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null
    },
    "Cable Bicep Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Hammer Curl": {
        alternatives: ["Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Bayesian Curl": {
        alternatives: ["Cable Bicep Curl", "Cable Hammer Curl"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null
    },
    "Cable Kickback": {
        alternatives: ["Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Reverse Grip Pushdown": {
        alternatives: ["Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null
    },
    "Cable Squat": {
        alternatives: ["Bodyweight Squat", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null
    },
    "Cable Pull-Through": {
        alternatives: ["Glute Bridge", "Cable Kickback (Glute)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null
    },
    "Cable RDL": {
        alternatives: ["Cable Pull-Through", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null
    },
    "Cable Lunge": {
        alternatives: ["Lunge (BW)", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null
    },
    "Cable Kickback (Glute)": {
        alternatives: ["Glute Bridge", "Cable Donkey Kick"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Calf Raise": {
        alternatives: ["Calf Raise (BW)", "Seated Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 2 },
        strainScore: 2,
        aggravates: ["ankle"],
        rehabCategory: null
    },
    "Cable Abductor": {
        alternatives: ["Cable Hip Abduction (Standing)", "Side Plank"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "hip-prehab"
    },
    "Cable Adductor": {
        alternatives: ["Cable Hip Adduction (Standing)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "adductor-prehab"
    },
    "Cable Crunch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Woodchopper (High to Low)": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Pallof Press": {
        alternatives: ["Dead Bug", "Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Side Bend": {
        alternatives: ["Side Plank", "Pallof Press"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Woodchopper (Low to High)": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Dumbbell Bench Press": {
        alternatives: ["DB Floor Press", "Push-ups"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Dumbbell Incline Press": {
        alternatives: ["DB Floor Press", "Decline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Dumbbell Fly": {
        alternatives: ["Cable Chest Fly (Mid)", "Svend Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Dumbbell Shoulder Press": {
        alternatives: ["Front Raise", "Lateral Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Arnold Press": {
        alternatives: ["Dumbbell Shoulder Press", "Front Raise"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Lateral Raise": {
        alternatives: ["Cable Lateral Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Front Raise": {
        alternatives: ["Cable Front Raise"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Dumbbell Row": {
        alternatives: ["Seated Cable Row", "Inverted Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "Dumbbell Pullover": {
        alternatives: ["Straight Arm Pulldown"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Goblet Squat": {
        alternatives: ["Bodyweight Squat", "Cable Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Dumbbell Lunge": {
        alternatives: ["Lunge (BW)", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["knee"],
        rehabCategory: null
    },
    "Bulgarian Split Squat": {
        alternatives: ["DB Step Up", "Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Romanian Deadlift (DB)": {
        alternatives: ["Cable Pull-Through", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 3, hip: 2, knee: 1, ankle: 0 },
        strainScore: 6,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null
    },
    "Dumbbell Curl": {
        alternatives: ["Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Hammer Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Tricep Kickback": {
        alternatives: ["Cable Kickback", "Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Skull Crusher (DB)": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null
    },
    "Farmers Walk": {
        alternatives: ["Plank", "DB Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 1, knee: 1, ankle: 1 },
        strainScore: 6,
        aggravates: [],
        rehabCategory: null
    },
    "Zottman Curl": {
        alternatives: ["Hammer Curl", "Dumbbell Curl"],
        jointLoad: { shoulder: 0, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow", "wrist"],
        rehabCategory: null
    },
    "Concentration Curl": {
        alternatives: ["Dumbbell Curl", "Cable Bicep Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "DB Floor Press": {
        alternatives: ["Svend Press", "Incline Push-up"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Renegade Row": {
        alternatives: ["Dumbbell Row", "Bird Dog"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "lowBack"],
        rehabCategory: null
    },
    "DB Step Up": {
        alternatives: ["Lunge (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 1 },
        strainScore: 4,
        aggravates: ["knee"],
        rehabCategory: null
    },
    "DB Shrugs": {
        alternatives: ["Cable Shrugs"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Seated Calf Raise": {
        alternatives: ["Calf Raise (BW)", "Cable Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
        strainScore: 3,
        aggravates: ["ankle"],
        rehabCategory: null
    },
    "Push-ups": {
        alternatives: ["Incline Push-up", "DB Floor Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Pull-ups": {
        alternatives: ["Lat Pulldown (Standing)", "Inverted Row"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null
    },
    "Chin-ups": {
        alternatives: ["Lat Pulldown (Standing)", "Inverted Row"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null
    },
    "Dips": {
        alternatives: ["Close Grip Push-up", "Push-ups"],
        jointLoad: { shoulder: 3, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null
    },
    "Bodyweight Squat": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Lunge (BW)": {
        alternatives: ["Bodyweight Squat", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Glute Bridge": {
        alternatives: ["Cable Kickback (Glute)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Plank": {
        alternatives: ["Dead Bug", "Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Side Plank": {
        alternatives: ["Pallof Press"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder"],
        rehabCategory: null
    },
    "Mountain Climbers": {
        alternatives: ["Dead Bug", "High Knees"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "hip"],
        rehabCategory: null
    },
    "Burpees": {
        alternatives: ["Jumping Jacks", "Mountain Climbers"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 2, hip: 2, knee: 2, ankle: 2 },
        strainScore: 10,
        aggravates: ["shoulder", "wrist", "lowBack", "hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Hanging Leg Raise": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 1, hip: 2, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: null
    },
    "Pike Push-up": {
        alternatives: ["Dumbbell Shoulder Press", "Push-ups"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Pistol Squat": {
        alternatives: ["Bulgarian Split Squat", "DB Step Up"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Nordic Curl": {
        alternatives: ["Single Leg RDL (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 2, ankle: 0 },
        strainScore: 3,
        aggravates: ["knee"],
        rehabCategory: null
    },
    "Inverted Row": {
        alternatives: ["Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Handstand Hold": {
        alternatives: ["Pike Push-up", "Dumbbell Shoulder Press"],
        jointLoad: { shoulder: 3, elbow: 1, wrist: 3, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Calf Raise (BW)": {
        alternatives: ["Seated Calf Raise"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 1 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null
    },
    "Cat-Cow": {
        alternatives: ["Thoracic Extension"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "spine-mobility"
    },
    "Dead Bug": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "core-stability"
    },
    "Thoracic Extension": {
        alternatives: ["Cat-Cow"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 0,
        aggravates: [],
        rehabCategory: "spine-mobility"
    },
    "World's Greatest Stretch": {
        alternatives: ["90/90 Hip Switch", "Cat-Cow"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 1, ankle: 1 },
        strainScore: 5,
        aggravates: [],
        rehabCategory: "hip-mobility"
    },
    "90/90 Hip Switch": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "hip-mobility"
    },
    "Shoulder Dislocates": {
        alternatives: ["Wall Slides"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab"
    },
    "Wall Slides": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Deep Squat Hold": {
        alternatives: ["90/90 Hip Switch", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "hip-mobility"
    },
    "Couch Stretch": {
        alternatives: ["90/90 Hip Switch", "World's Greatest Stretch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 0 },
        strainScore: 4,
        aggravates: ["hip", "knee"],
        rehabCategory: "hip-mobility"
    },
    "Bird Dog": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 1, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "core-stability"
    },
    "Cable Front Squat": {
        alternatives: ["Cable Squat", "Goblet Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Cable Zercher Squat": {
        alternatives: ["Cable Front Squat", "Goblet Squat"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 0, lowBack: 2, hip: 2, knee: 2, ankle: 1 },
        strainScore: 8,
        aggravates: ["lowBack", "hip", "knee"],
        rehabCategory: null
    },
    "Cable Donkey Kick": {
        alternatives: ["Cable Kickback (Glute)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Standing Cable Row": {
        alternatives: ["Seated Cable Row", "Single Arm Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 2, hip: 1, knee: 1, ankle: 0 },
        strainScore: 7,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Lying Cable Curl": {
        alternatives: ["Cable Hammer Curl"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Cable French Press": {
        alternatives: ["Tricep Pushdown (Rope)", "Cable Kickback"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["shoulder", "elbow"],
        rehabCategory: null
    },
    "Cable Hip Abduction (Standing)": {
        alternatives: ["Cable Abductor"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "hip-prehab"
    },
    "Cable Hip Adduction (Standing)": {
        alternatives: ["Cable Adductor"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "adductor-prehab"
    },
    "Cable Wrist Curl": {
        alternatives: ["Wrist Rocks"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null
    },
    "Cable Reverse Wrist Curl": {
        alternatives: ["Wrist Rocks"],
        jointLoad: { shoulder: 0, elbow: 1, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["wrist"],
        rehabCategory: null
    },
    "Russian Twist": {
        alternatives: ["Pallof Press", "Side Plank"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Bicycle Crunch": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Flutter Kicks": {
        alternatives: ["Dead Bug", "Reverse Crunch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null
    },
    "V-Ups": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: null
    },
    "Reverse Crunch": {
        alternatives: ["Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Plank Jack": {
        alternatives: ["Plank", "Jumping Jacks"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 1 },
        strainScore: 6,
        aggravates: ["wrist"],
        rehabCategory: null
    },
    "Toe Touch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: null
    },
    "Diamond Push-up": {
        alternatives: ["Close Grip Push-up", "Push-ups"],
        jointLoad: { shoulder: 2, elbow: 2, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 7,
        aggravates: ["shoulder", "elbow", "wrist"],
        rehabCategory: null
    },
    "Wide Grip Push-up": {
        alternatives: ["Push-ups", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Decline Push-up": {
        alternatives: ["Push-ups", "Incline Push-up"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Incline Push-up": {
        alternatives: ["DB Floor Press"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Scapular Push-up": {
        alternatives: ["Wall Slides"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Sumo Squat (DB)": {
        alternatives: ["Goblet Squat", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 2, ankle: 1 },
        strainScore: 6,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Curtsy Lunge": {
        alternatives: ["Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Side Lunge": {
        alternatives: ["Sumo Squat (DB)", "Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Single Leg Glute Bridge": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 1, knee: 1, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Good Morning (BW)": {
        alternatives: ["Glute Bridge", "Cable Pull-Through"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 2, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack", "hip"],
        rehabCategory: "hip-mobility"
    },
    "Jumping Jacks": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "High Knees": {
        alternatives: ["Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 1, ankle: 2 },
        strainScore: 5,
        aggravates: ["hip", "ankle"],
        rehabCategory: null
    },
    "Jump Squat": {
        alternatives: ["Bodyweight Squat", "Box Jump"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Skater Hops": {
        alternatives: ["Side Lunge", "Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Jumping Lunge": {
        alternatives: ["Lunge (BW)"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Box Jump": {
        alternatives: ["DB Step Up", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Superman": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Swimmers": {
        alternatives: ["Bird Dog"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: null
    },
    "Bench Dip": {
        alternatives: ["Close Grip Push-up", "Tricep Pushdown (Rope)"],
        jointLoad: { shoulder: 3, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 7,
        aggravates: ["shoulder", "elbow", "wrist"],
        rehabCategory: null
    },
    "Close Grip Push-up": {
        alternatives: ["Tricep Pushdown (Rope)", "Incline Push-up"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["elbow", "wrist"],
        rehabCategory: null
    },
    "Plate Pinch": {
        alternatives: ["Farmers Walk", "Dead Hang"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null
    },
    "Svend Press": {
        alternatives: [],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: [],
        rehabCategory: null
    },
    "Cable Curl (Behind Back)": {
        alternatives: ["Cable Bicep Curl"],
        jointLoad: { shoulder: 1, elbow: 2, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["elbow"],
        rehabCategory: null
    },
    "Cable Row (Wide Grip)": {
        alternatives: ["Face Pulls", "Seated Cable Row"],
        jointLoad: { shoulder: 1, elbow: 1, wrist: 1, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: [],
        rehabCategory: null
    },
    "Standing Cable Crunch": {
        alternatives: ["Reverse Crunch", "Dead Bug"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 0, knee: 0, ankle: 0 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: null
    },
    "Bear Crawl": {
        alternatives: ["Bird Dog", "Dead Bug"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep"
    },
    "Crab Walk": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 0, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "movement-prep"
    },
    "Kick Through": {
        alternatives: ["Bear Crawl"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "movement-prep"
    },
    "Beast Reach": {
        alternatives: ["Cat-Cow", "Bear Crawl"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 0, hip: 1, knee: 1, ankle: 1 },
        strainScore: 6,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep"
    },
    "Duck Walk": {
        alternatives: ["Deep Squat Hold", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "movement-prep"
    },
    "Tibialis Raise": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 0, ankle: 1 },
        strainScore: 1,
        aggravates: [],
        rehabCategory: "ankle-prehab"
    },
    "ATG Split Squat": {
        alternatives: ["Lunge (BW)", "Couch Stretch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 3, ankle: 2 },
        strainScore: 7,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "knee-prehab"
    },
    "Lu Raise": {
        alternatives: ["Lateral Raise", "Wall Slides"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab"
    },
    "Powell Raise": {
        alternatives: ["Cable Rear Delt Fly", "Face Pulls"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: [],
        rehabCategory: "shoulder-prehab"
    },
    "Wrist Rocks": {
        alternatives: [],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 2, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 2,
        aggravates: ["wrist"],
        rehabCategory: "wrist-prehab"
    },
    "Dead Hang": {
        alternatives: [],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 1, lowBack: 0, hip: 0, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["shoulder"],
        rehabCategory: "shoulder-prehab"
    },
    "Cossack Squat": {
        alternatives: ["Side Lunge", "90/90 Hip Switch"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: "hip-mobility"
    },
    "Jefferson Curl": {
        alternatives: ["Cat-Cow"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 3,
        aggravates: ["lowBack"],
        rehabCategory: "spine-mobility"
    },
    "Scorpion Stretch": {
        alternatives: ["Cat-Cow", "90/90 Hip Switch"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 2, hip: 1, knee: 0, ankle: 0 },
        strainScore: 4,
        aggravates: ["lowBack"],
        rehabCategory: "spine-mobility"
    },
    "Inchworm": {
        alternatives: ["Cat-Cow", "World's Greatest Stretch"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 5,
        aggravates: ["wrist"],
        rehabCategory: "movement-prep"
    },
    "Thoracic Bridge": {
        alternatives: ["Thoracic Extension", "Cat-Cow"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: "spine-mobility"
    },
    "Single Leg RDL (BW)": {
        alternatives: ["Good Morning (BW)", "Glute Bridge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 1, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: null
    },
    "Lateral Bounds": {
        alternatives: ["Side Lunge"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 2 },
        strainScore: 6,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "Dot Drill": {
        alternatives: ["Jumping Jacks", "High Knees"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 0, knee: 1, ankle: 2 },
        strainScore: 3,
        aggravates: ["ankle"],
        rehabCategory: null
    },
    "Tuck Jumps": {
        alternatives: ["Jump Squat", "Box Jump"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 3, ankle: 2 },
        strainScore: 8,
        aggravates: ["hip", "knee", "ankle"],
        rehabCategory: null
    },
    "A-Skips": {
        alternatives: ["High Knees", "Jumping Jacks"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 1, knee: 1, ankle: 2 },
        strainScore: 4,
        aggravates: ["ankle"],
        rehabCategory: null
    },
    "Horse Stance Hold": {
        alternatives: ["Deep Squat Hold", "Bodyweight Squat"],
        jointLoad: { shoulder: 0, elbow: 0, wrist: 0, lowBack: 0, hip: 2, knee: 2, ankle: 1 },
        strainScore: 5,
        aggravates: ["hip", "knee"],
        rehabCategory: null
    },
    "Reverse Plank": {
        alternatives: ["Glute Bridge"],
        jointLoad: { shoulder: 2, elbow: 0, wrist: 2, lowBack: 1, hip: 1, knee: 0, ankle: 0 },
        strainScore: 6,
        aggravates: ["shoulder", "wrist"],
        rehabCategory: null
    },
    "Copenhagen Plank": {
        alternatives: ["Side Plank", "Cable Adductor"],
        jointLoad: { shoulder: 1, elbow: 0, wrist: 0, lowBack: 1, hip: 2, knee: 1, ankle: 0 },
        strainScore: 5,
        aggravates: ["hip"],
        rehabCategory: "adductor-prehab"
    },
    "L-Sit (Tuck)": {
        alternatives: ["Reverse Crunch", "Hanging Leg Raise"],
        jointLoad: { shoulder: 2, elbow: 1, wrist: 2, lowBack: 1, hip: 2, knee: 0, ankle: 0 },
        strainScore: 8,
        aggravates: ["shoulder", "wrist", "hip"],
        rehabCategory: null
    }
};

// ---------------------------------------------------------------------------
// Self-check (runs only if the app's exercise list is present). Logs loudly
// on any divergence between this file and window.allExercises.
// ---------------------------------------------------------------------------
(function () {
    if (typeof window === 'undefined' || !window.allExercises || !window.allExercises.length) return;
    try {
        var names = window.allExercises.map(function (e) { return e.name; });
        var missing = names.filter(function (n) { return !window.exerciseMeta[n]; });
        var orphans = Object.keys(window.exerciseMeta).filter(function (n) { return names.indexOf(n) === -1; });
        var badAlts = [];
        Object.keys(window.exerciseMeta).forEach(function (n) {
            window.exerciseMeta[n].alternatives.forEach(function (a) {
                if (names.indexOf(a) === -1) badAlts.push(n + ' -> ' + a);
            });
        });
        if (missing.length) console.error('[exerciseMeta] Exercises with no metadata:', missing);
        if (orphans.length) console.error('[exerciseMeta] Metadata for unknown exercises:', orphans);
        if (badAlts.length) console.error('[exerciseMeta] Unresolvable alternatives:', badAlts);
    } catch (err) {
        console.error('[exerciseMeta] self-check failed:', err);
    }
})();
