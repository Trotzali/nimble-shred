// ============================================================================
// REHAB / MOBILITY EXERCISE EXPANSION — PREP BUILD (NOT WIRED INTO APP)
// ============================================================================
// Status: STAGING ONLY. This file is NOT loaded by index.html. Integration is
// a later serial build, at which point:
//   - entries get concat'd into window.allExercises (drop or keep `region`)
//   - `region` tags get reconciled with T3's rehabCategory taxonomy
//   - media candidates below get verified and merged into exerciseMedia
//
// Shape contract: createRehabEx() mirrors createEx() (index.html L1964-1979)
// exactly — {name, cat, equip, type, guide:{prep, exec, tips, benefits,
// muscles}, setup} — plus one extra field: `region`. All entries are
// equip:"Bodyweight", type:"Mobility", setup default {arms:"N/A", pulleys:"N/A"}.
//
// Name-collision check vs. the 163 existing allExercises names: NONE (verified
// programmatically 2026-06-06). Bonus: "Pigeon Pose" and "Child's Pose" already
// exist as exerciseMedia keys (currently orphaned), so they gain GIF + YouTube
// coverage automatically on integration with zero media work.
// ============================================================================

function createRehabEx(name, cat, equip, type, prep, exec, tips, benefits, muscles, region, setupF9) {
    return {
        name: name,
        cat: cat,
        equip: equip,
        type: type,
        guide: {
            prep: prep,
            exec: exec,
            tips: tips,
            benefits: benefits,
            muscles: muscles
        },
        setup: setupF9 || { arms: "N/A", pulleys: "N/A" },
        region: region
    };
}

const rehabMobilityExercises = [

    // ==================== SHOULDER ====================
    createRehabEx("Arm Circles", ["Shoulders"], "Bodyweight", "Mobility",
        ["Stand tall, feet shoulder-width apart.", "Arms straight out to the sides at shoulder height."],
        ["Make small forward circles, gradually growing larger.", "Reverse direction after 20-30 seconds.", "Keep ribs down; the movement comes from the shoulder, not the torso."],
        ["Stay slow and controlled — no bouncing.", "Keep shoulders away from your ears."],
        ["Warms up the rotator cuff and deltoids.", "Safe first move in any shoulder warm-up."],
        ["Deltoids", "Rotator Cuff"], "shoulder"),

    createRehabEx("Prone Y-T-W Raise", ["Shoulders", "Back"], "Bodyweight", "Mobility",
        ["Lie face down on the floor.", "Forehead resting on a towel, neck neutral.", "Arms overhead, thumbs pointing up."],
        ["Raise straight arms overhead into a 'Y'; hold 2 seconds.", "Move arms out to the sides into a 'T'; hold.", "Bend elbows to form a 'W', squeezing shoulder blades together; hold.", "Lower and repeat the full sequence."],
        ["Thumbs point up throughout.", "Lift from the shoulder blades, not by arching the lower back."],
        ["Strengthens lower traps and rear delts — key scapular stabilizers.", "Counteracts desk posture and rounded shoulders."],
        ["Lower Traps", "Rear Delts", "Rhomboids"], "shoulder"),

    createRehabEx("Sleeper Stretch", ["Shoulders"], "Bodyweight", "Mobility",
        ["Lie on your side with the bottom shoulder stacked directly under you.", "Bottom arm straight out in front, elbow bent 90 degrees, fingers pointing up."],
        ["Use the top hand to gently press the bottom forearm down towards the floor.", "Stop at a comfortable stretch in the back of the shoulder.", "Hold 20-30 seconds; switch sides."],
        ["Gentle pressure only — never force into pain.", "Keep the shoulder blade pinned; don't roll your torso backward to cheat range."],
        ["Restores shoulder internal rotation.", "Targets the posterior capsule — a common stiff spot in lifters."],
        ["Rotator Cuff", "Rear Delts"], "shoulder"),

    // ==================== THORACIC SPINE ====================
    createRehabEx("Thread the Needle", ["Back"], "Bodyweight", "Mobility",
        ["Start on hands and knees.", "Hips stacked over knees."],
        ["Slide one arm under your chest, palm up, reaching across to the far side.", "Let the shoulder and ear sink toward the floor.", "Hold the stretch, then sweep the arm back up toward the ceiling, rotating the chest open.", "Repeat, then switch sides."],
        ["Keep hips square and still — rotate from the mid-back only.", "Exhale as you reach through."],
        ["Mobilizes thoracic rotation.", "Releases tension between the shoulder blades."],
        ["Thoracic Spine", "Rhomboids", "Rear Delts"], "thoracic"),

    createRehabEx("Open Book Stretch", ["Back"], "Bodyweight", "Mobility",
        ["Lie on your side with knees bent 90 degrees and stacked.", "Both arms straight out in front, palms together."],
        ["Keeping the knees glued together, sweep the top arm up and over to the opposite side.", "Follow your hand with your eyes.", "Let the chest open toward the ceiling; hold for 2-3 breaths.", "Return and repeat, then switch sides."],
        ["Knees stay down — if they lift, you're rotating from the lower back instead.", "Move with the breath; exhale into the opening."],
        ["Pure thoracic rotation with the lumbar spine locked out.", "Great filler between sets of pressing."],
        ["Thoracic Spine", "Pecs", "Obliques"], "thoracic"),

    createRehabEx("Quadruped Thoracic Rotation", ["Back"], "Bodyweight", "Mobility",
        ["Start on hands and knees.", "Place one hand behind your head, elbow pointing out."],
        ["Rotate that elbow down toward the opposite wrist.", "Then rotate it up toward the ceiling as far as you can.", "Follow the elbow with your eyes.", "Complete all reps, then switch sides."],
        ["Sit the hips slightly back toward the heels to lock out the lower back.", "Move slowly; the range grows with each rep."],
        ["Trains active thoracic rotation under control.", "Improves overhead and squat positions."],
        ["Thoracic Spine", "Obliques"], "thoracic"),

    // ==================== HIP ====================
    createRehabEx("Pigeon Pose", ["Legs", "Glutes"], "Bodyweight", "Mobility",
        ["From hands and knees, bring one knee forward behind the same-side wrist.", "Angle the shin across your body; extend the back leg straight behind you."],
        ["Square the hips and sink them toward the floor.", "Fold the torso forward over the front shin for a deeper stretch.", "Hold 30-60 seconds, breathing into the hip.", "Switch sides."],
        ["Place a cushion under the front hip if it floats off the floor.", "Keep the back leg's toes pointing straight back."],
        ["Deep stretch for the glutes and hip external rotators.", "Relieves hip tightness from sitting and heavy squatting."],
        ["Glutes", "Piriformis", "Hip Flexors"], "hip"),

    createRehabEx("Frog Stretch", ["Legs"], "Bodyweight", "Mobility",
        ["Start on hands and knees.", "Spread the knees wide; ankles in line with the knees, feet flexed outward."],
        ["Rock the hips back toward your heels until you feel an inner-thigh stretch.", "Pause, then rock forward to the start.", "Settle 20-30 seconds in the deepest comfortable position."],
        ["Keep the lower back flat — don't let it round.", "Pad the knees on a mat or towel."],
        ["Opens the adductors and groin.", "Unlocks a wider, deeper squat stance."],
        ["Adductors", "Hip Flexors"], "hip"),

    createRehabEx("Standing Hip CARs", ["Legs"], "Bodyweight", "Mobility",
        ["Stand tall next to a wall for balance.", "Brace the core; one hand on the wall."],
        ["Lift one knee to hip height.", "Rotate the knee out to the side while keeping it high.", "Rotate the thigh inward as the leg sweeps behind you.", "Reverse the circle. 3-5 slow circles each way, each leg."],
        ["Move as slowly as possible — fight for range without leaning the torso.", "Keep the standing hip tall; don't hike or sag."],
        ["Controlled Articular Rotations train usable hip range.", "Daily joint maintenance for squats and lunges."],
        ["Hip Flexors", "Glutes", "Adductors"], "hip"),

    // ==================== KNEE ====================
    createRehabEx("Reverse Nordic Curl", ["Legs"], "Bodyweight", "Mobility",
        ["Kneel on a pad, knees hip-width apart.", "Body upright in one line from knees to head, toes pointed back."],
        ["Keeping the hips locked straight, lean the whole body backward.", "Go only as far as you can control.", "Pull back up to vertical using the quads."],
        ["Squeeze the glutes to keep hips straight — don't hinge at the waist.", "Start with a small range and progress slowly."],
        ["Loads the quads and patellar tendon through a long range.", "Builds knee-tendon resilience plus a deep quad stretch."],
        ["Quads", "Hip Flexors"], "knee"),

    createRehabEx("Eccentric Step Down", ["Legs"], "Bodyweight", "Mobility",
        ["Stand on a low step or box on one leg.", "Free leg hovering out in front."],
        ["Bend the standing knee and lower the free heel to the floor over 3-5 seconds.", "Tap the heel lightly — don't transfer weight onto it.", "Push back up through the standing leg and repeat."],
        ["Keep the standing knee tracking over the toes — don't let it cave inward.", "Slower is better; control beats depth."],
        ["Gold-standard patellar tendon and knee-control drill.", "Builds single-leg strength for stairs, hiking and running."],
        ["Quads", "Glutes"], "knee"),

    // ==================== ANKLE ====================
    createRehabEx("Knee-to-Wall Ankle Rock", ["Legs"], "Bodyweight", "Mobility",
        ["Face a wall with one foot about a hand-width away from it.", "Hands on the wall for support."],
        ["Drive the front knee straight toward the wall while keeping the heel planted.", "Touch (or reach toward) the wall, then rock back.", "10-15 slow rocks, then switch sides.", "Move the foot further back as the range improves."],
        ["The heel must stay down — that's the whole drill.", "Drive the knee over the second toe, not inward."],
        ["Improves ankle dorsiflexion for deeper, more upright squats.", "Classic rehab test and drill in one."],
        ["Calves", "Tibialis Anterior"], "ankle"),

    createRehabEx("Ankle Alphabet", ["Legs"], "Bodyweight", "Mobility",
        ["Sit with one leg extended, or cross the ankle over the opposite knee.", "Foot relaxed in the air."],
        ["Trace the alphabet from A to Z with your big toe.", "Make each letter as large as the ankle allows.", "Move from the ankle only — keep the leg still.", "Switch feet."],
        ["Slow, exaggerated letters beat fast scribbles.", "Easy to do while watching TV."],
        ["Moves the ankle through every available direction.", "Staple drill for rebuilding mobility after ankle sprains."],
        ["Calves", "Tibialis Anterior"], "ankle"),

    // ==================== LOWER BACK ====================
    createRehabEx("Child's Pose", ["Back", "Core"], "Bodyweight", "Mobility",
        ["Kneel with big toes together and knees wide.", "Sit the hips back onto the heels."],
        ["Walk the hands forward and lower the chest toward the floor.", "Rest the forehead down, arms long.", "Breathe into the lower back for 30-60 seconds."],
        ["Walk the hands to one side to bias each lat.", "Let the hips stay heavy on the heels."],
        ["Gentle lower-back and lat decompression.", "Down-regulates the nervous system between hard sets or after a session."],
        ["Lower Back", "Lats"], "lower-back"),

    createRehabEx("McGill Curl-Up", ["Core"], "Bodyweight", "Mobility",
        ["Lie on your back with one knee bent and one leg straight.", "Slide both hands under the natural arch of your lower back."],
        ["Lift the head and shoulders a few centimetres off the floor as one unit.", "No neck curl — keep the chin tucked.", "Hold 8-10 seconds while breathing normally.", "Lower and repeat; switch the bent leg halfway through."],
        ["The arch in your back must not flatten — that's why your hands are there.", "Think 'stiffen the trunk', not 'crunch'."],
        ["Trains core stiffness without bending the spine.", "Completes the McGill Big 3 alongside Bird Dog and Side Plank (already in the database)."],
        ["Abs", "Obliques"], "lower-back"),

    createRehabEx("Prone Press-Up", ["Back"], "Bodyweight", "Mobility",
        ["Lie face down with hands under the shoulders.", "Hips and legs relaxed on the floor."],
        ["Press the chest up, straightening the arms as far as comfortable.", "Keep the hips glued to the floor — let the lower back extend.", "Pause 1-2 seconds at the top, then lower slowly."],
        ["Exhale as you press up; keep the glutes relaxed.", "Stop short of any pinching pain."],
        ["McKenzie-style extension that counters sitting and flexion-heavy training.", "Gentle, self-dosed lower-back mobility."],
        ["Lower Back", "Spinal Erectors"], "lower-back"),

    // ==================== WRIST ====================
    createRehabEx("Wrist Flexor Stretch", ["Arms"], "Bodyweight", "Mobility",
        ["Extend one arm straight in front, palm facing up.", "Grip the fingers with the other hand."],
        ["Gently pull the fingers down and back toward the floor.", "Feel the stretch along the underside of the forearm.", "Hold 20-30 seconds; switch arms."],
        ["Keep the elbow straight to deepen the stretch.", "Mild tension only — never yank."],
        ["Loosens the forearm flexors loaded by gripping, curling and typing.", "Improves wrist comfort in push-ups and front-rack positions."],
        ["Forearms"], "wrist"),

    createRehabEx("Wrist Extensor Stretch", ["Arms"], "Bodyweight", "Mobility",
        ["Extend one arm straight in front, palm facing down.", "Place the other hand over the back of the hand."],
        ["Gently press the hand down so the fingers point toward the floor.", "Feel the stretch along the top of the forearm.", "Hold 20-30 seconds; switch arms."],
        ["Make a loose fist for a deeper line of pull.", "Keep the shoulder relaxed — don't shrug."],
        ["Releases the muscles overworked by typing and gripping.", "Classic tennis-elbow prehab."],
        ["Forearms"], "wrist")
];

// ============================================================================
// TASK 2 — MEDIA GAP AUDIT (exercise list vs. exerciseMedia keys)
// ============================================================================
// Programmatic comparison run 2026-06-06 against index.html v60
// (createEx names vs. exerciseMedia keys, resolving through mediaAliases):
//
//   - 163 exercises in window.allExercises
//   - 158 keys in exerciseMedia
//   - 94 exercises resolve to a media entry (direct key or alias)
//   - 69 exercises have NO media entry  <-- NOT 6
//   - 64 media keys are ORPHANED (no matching exercise: barbell / machine /
//     kettlebell / cardio entries from the original 158-entry media pack)
//   - 5 media entries have gif:"placeholder" (Treadmill Run, Stationary Bike,
//     Stair Climber, Elliptical, Foam Roll — all orphaned anyway)
//
// FINDING: the "6 missing GIFs" figure in _ideas.md / _project_state.md is
// count arithmetic (163 exercises − ~158 media keys ≈ 6) and assumed every
// media key matched an exercise. A true name-level comparison shows the gap
// is 69. The full missing list, for the later media-sourcing build:
//
//   DB Floor Press, Renegade Row, Seated Calf Raise, Lunge (BW), Inverted Row,
//   Handstand Hold, Calf Raise (BW), Dead Bug, Thoracic Extension,
//   World's Greatest Stretch, Shoulder Dislocates, Wall Slides, Deep Squat Hold,
//   Bird Dog, Cable Front Squat, Cable Zercher Squat, Cable Donkey Kick,
//   Standing Cable Row, Lying Cable Curl, Cable French Press,
//   Cable Hip Abduction (Standing), Cable Hip Adduction (Standing),
//   Cable Wrist Curl, Cable Reverse Wrist Curl, Flutter Kicks, Reverse Crunch,
//   Plank Jack, Toe Touch, Wide Grip Push-up, Decline Push-up, Incline Push-up,
//   Scapular Push-up, Sumo Squat (DB), Curtsy Lunge, Side Lunge, Jumping Jacks,
//   High Knees, Skater Hops, Jumping Lunge, Swimmers, Bench Dip,
//   Close Grip Push-up, Plate Pinch, Svend Press, Cable Curl (Behind Back),
//   Cable Row (Wide Grip), Standing Cable Crunch, Bear Crawl, Crab Walk,
//   Kick Through, Beast Reach, Duck Walk, Tibialis Raise, ATG Split Squat,
//   Lu Raise, Powell Raise, Wrist Rocks, Cossack Squat, Jefferson Curl,
//   Scorpion Stretch, Inchworm, Thoracic Bridge, Lateral Bounds, Dot Drill,
//   Tuck Jumps, A-Skips, Horse Stance Hold, Reverse Plank, Copenhagen Plank
//
// The "known 6" item (per _audit_v60.md flow-sweep note: "Handstand Hold,
// Beast Reach, Kick Through, and a few Nimble entries") maps to the six most
// user-visible gaps — Handstand Hold plus the five animal-flow moves that
// headline the Nimble workout type. Candidates for those six are proposed
// below. The remaining 63 should be triaged in the integration build (many
// are minor variations that could alias to existing keys, e.g.
// "Wide Grip Push-up" -> "Push-up", "Lunge (BW)" -> "Reverse Lunge").
// ============================================================================

// UNVERIFIED — URLs need checking before integration.
// gif URLs follow the two CDN slug patterns used by the existing 158 entries
// (fitnessprogramer.com / inspireusafoundation.org) but have NOT been
// fetched/confirmed. yt values are YouTube SEARCH links — replace each with a
// specific vetted video (good sources: GMB Fitness, Calisthenicmovement,
// Squat University, MoveU) before merging into exerciseMedia.
const missingMediaCandidates = {
    "Handstand Hold": {
        gif: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/handstand-hold.gif",          // UNVERIFIED
        gifAlt: "https://fitnessprogramer.com/wp-content/uploads/2022/06/Handstand.gif",                    // UNVERIFIED
        yt: "https://www.youtube.com/results?search_query=wall+handstand+hold+tutorial",                    // SEARCH — pick a specific video
        note: "Interim option: alias to existing 'Handstand Push-up' media key until a hold-specific GIF is verified."
    },
    "Bear Crawl": {
        gif: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/bear-crawl.gif",              // UNVERIFIED
        gifAlt: "https://fitnessprogramer.com/wp-content/uploads/2022/01/Bear-Crawl.gif",                   // UNVERIFIED
        yt: "https://www.youtube.com/results?search_query=bear+crawl+form+tutorial"                         // SEARCH — pick a specific video
    },
    "Crab Walk": {
        gif: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/crab-walk.gif",               // UNVERIFIED
        gifAlt: "https://fitnessprogramer.com/wp-content/uploads/2022/01/Crab-Walk.gif",                    // UNVERIFIED
        yt: "https://www.youtube.com/results?search_query=crab+walk+exercise+tutorial"                      // SEARCH — pick a specific video
    },
    "Kick Through": {
        gif: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/kick-through.gif",            // UNVERIFIED
        gifAlt: "https://fitnessprogramer.com/wp-content/uploads/2022/01/Kick-Through.gif",                 // UNVERIFIED
        yt: "https://www.youtube.com/results?search_query=animal+flow+kick+through+tutorial"                // SEARCH — pick a specific video
    },
    "Beast Reach": {
        gif: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/beast-reach.gif",             // UNVERIFIED — niche move; CDN hit unlikely, may need custom GIF
        gifAlt: null,
        yt: "https://www.youtube.com/results?search_query=animal+flow+loaded+beast+reach+tutorial"          // SEARCH — pick a specific video
    },
    "Duck Walk": {
        gif: "https://fitnessprogramer.com/wp-content/uploads/2022/01/Duck-Walk.gif",                       // UNVERIFIED
        gifAlt: "https://www.inspireusafoundation.org/wp-content/uploads/2023/07/duck-walk.gif",            // UNVERIFIED
        yt: "https://www.youtube.com/results?search_query=duck+walk+exercise+tutorial"                      // SEARCH — pick a specific video
    }
};

// Browser global for the future integration build; harmless under Node.
if (typeof window !== "undefined") {
    window.rehabMobilityExercises = rehabMobilityExercises;
    window.missingMediaCandidates = missingMediaCandidates;
}
