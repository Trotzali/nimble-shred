// ============================================================================
// NIMBLE SHRED — MOBILITY GAP-FILL PACK (v1.0.0)
// ============================================================================
// 7 joint-health drills that close the two empty regions found in
// _mobility_gap_analysis.md: NECK (0 moves) and ELBOW (~0 moves), plus a knee
// and an ankle top-up. Authored in the EXACT createEx() shape used by
// index.html's window.allExercises (name, cat[], equip, type, prep[], exec[],
// tips[], benefits[], muscles[], setupF9?).
//
// NOT yet loaded by index.html — prep module, mirrors the staging stance of
// cardio-hiit-exercises.js and rehab-mobility-exercises.js. To integrate:
//     <script src="mobility-gapfill-exercises.js"></script>   // AFTER the DB block
//     window.allExercises = window.allExercises.concat(window.mobilityGapfillExercises);
// then add the matching window.exerciseMeta rows from _mobility_gapfill_meta.md.
//
// DESIGN PRIORITY — 40+ JOINT FIRST:
//   • All 7 are low-load mobility/prehab. Highest strainScore in the pack is 4.
//   • All type:"Mobility", equip:"Bodyweight" → resilience bucket on integration.
//   • Each carries a gentle regression in tips[] (look for "EASE OFF:").
//   • region (for T3 reconciliation) is noted in a trailing comment per entry;
//     it is NOT a createEx field, so the defs drop straight into allExercises.
//
// NEW SURFACES INTRODUCED (flagged in _mobility_gapfill_meta.md):
//   • a "Neck" cat value (no neck category existed) — the 3 neck moves.
//   • two new rehabCategory values: "neck-prehab", "elbow-prehab".
//
// Self-contained: uses index.html's global createEx() if present, else an
// identical local fallback so the file parses standalone.
// ============================================================================

(function () {
    var _createEx = (typeof createEx === 'function')
        ? createEx
        : function (name, cat, equip, type, prep, exec, tips, benefits, muscles, setupF9) {
            return {
                name: name, cat: cat, equip: equip, type: type,
                guide: { prep: prep, exec: exec, tips: tips, benefits: benefits, muscles: muscles },
                setup: setupF9 || { arms: "N/A", pulleys: "N/A" }
            };
        };

    window.mobilityGapfillExercises = [

        // ===== NECK ×3 =====================================================

        // region: neck
        _createEx("Neck CARs", ["Neck"], "Bodyweight", "Mobility",
            ["Sit or stand tall, shoulders down and relaxed, ribs stacked over hips.", "Lengthen the back of the neck as if gently growing taller."],
            ["Drop the chin toward the chest, then slowly roll the head to one shoulder.", "Continue rolling the head back (only as far as is comfortable), then to the other shoulder, and back to the chest.", "Trace the biggest pain-free circle you can, moving as slowly as possible.", "Do 2-3 circles one way, then reverse."],
            ["Go slow and stay inside a pain-free range — never force the back-of-neck position.", "Keep the shoulders still and down; the movement is the head only.", "EASE OFF: shrink the circle (small ovals) or do Chin Tuck instead if any rotation pinches; skip entirely during an acute neck flare."],
            ["Maintains usable, controlled neck range — the cervical joint's daily maintenance.", "Counters the stiffness of desk and phone posture.", "Self-paceable from tiny to full circles."],
            ["Neck", "Upper Traps"]),

        // region: neck
        _createEx("Chin Tuck", ["Neck"], "Bodyweight", "Mobility",
            ["Sit or stand tall with the shoulders relaxed.", "Look straight ahead, eyes level."],
            ["Gently draw the chin straight back, making a 'double chin' — a small, level glide, not a nod down.", "Feel a light lengthening at the base of the skull.", "Hold 5-10 seconds, breathing normally.", "Release slowly and repeat."],
            ["It's a tiny movement — glide the head back over the shoulders, don't tip it down.", "Keep it gentle; you should feel activation, never pain.", "The single most useful drill for forward-head/desk posture, and the gentlest neck option here."],
            ["Activates the deep neck flexors that hold the head over the shoulders.", "Directly counters forward-head posture from screens.", "Gentle enough to do at a desk, several times a day."],
            ["Deep Neck Flexors", "Neck"]),

        // region: neck
        _createEx("Upper-Trap & Levator Stretch", ["Neck"], "Bodyweight", "Mobility",
            ["Sit or stand tall. Let one arm hang and lightly anchor that shoulder down.", "Place the opposite hand gently over the top of the head."],
            ["For the upper trap: gently guide the ear toward the same-side shoulder.", "For the levator: turn the nose toward the armpit and let the head drop diagonally.", "Hold each position 20-30 seconds, breathing into the stretch.", "Release slowly and switch sides."],
            ["Use the hand only for a light assist — gravity does most of the work; never crank the neck.", "Keep the anchored shoulder pulled down to deepen the line, not by pulling harder with the hand.", "EASE OFF: drop the hand and just let the head fall under its own weight if the stretch feels strong."],
            ["Releases the chronic upper-trap and levator tension from sitting and phone use.", "Relieves the most common 40+ 'stiff neck/shoulder' spot.", "Restores comfortable side-bend and rotation."],
            ["Upper Traps", "Levator Scapulae"]),

        // ===== ELBOW ×2 ====================================================

        // region: elbow
        _createEx("Forearm Pronation-Supination", ["Arms"], "Bodyweight", "Mobility",
            ["Sit or stand and tuck the working elbow into your side, bent to 90 degrees.", "Hold a light object (a small dumbbell, a hammer, or nothing) with the forearm horizontal, thumb up."],
            ["Slowly rotate the palm down toward the floor (pronation).", "Pause, then slowly rotate the palm up toward the ceiling (supination).", "Keep the elbow pinned to your side throughout — only the forearm rotates.", "Move through the full comfortable range under control."],
            ["Keep the elbow glued to your ribs so the rotation comes from the forearm, not the shoulder.", "Light load only — this is tendon conditioning, not a strength lift.", "EASE OFF: do it with no weight at all if the elbow is tender; classic tennis/golfer's-elbow prehab."],
            ["Trains the radioulnar (forearm) rotation that nothing else in the library covers.", "Builds elbow-tendon resilience for curling, pressing and gripping.", "Keeps the forearm comfortable for daily tasks like turning keys and handles."],
            ["Forearms", "Pronators", "Supinators"]),

        // region: elbow
        _createEx("Elbow CARs", ["Arms"], "Bodyweight", "Mobility",
            ["Stand tall and raise one arm, or brace the upper arm against your side or the other hand to keep it still.", "Start with the arm fully but comfortably straight."],
            ["Slowly bend the elbow to its fullest comfortable flexion, bringing the hand toward the shoulder.", "Add a slow turn of the palm at the top and bottom.", "Straighten back to full (but not locked-hard) extension under control.", "Do 3-5 slow reps, then switch arms."],
            ["Keep the upper arm completely still — the work is end-range elbow flexion and extension.", "Reach for terminal range gently; lifters lose full extension, so chase it without forcing.", "EASE OFF: reduce the range and skip the palm rotation if the elbow is irritated."],
            ["Maintains full elbow flexion and extension that pressing-heavy training erodes.", "Keeps the elbow joint healthy and well-lubricated.", "Pairs with Forearm Pronation-Supination for complete elbow care."],
            ["Biceps", "Triceps", "Forearms"]),

        // ===== KNEE ×1 =====================================================

        // region: knee
        _createEx("Terminal Knee Extension", ["Legs"], "Bodyweight", "Mobility",
            ["Loop a light resistance band behind one knee and anchor it in front at knee height (or stand to do an unbanded short-arc version).", "Stand tall, a slight bend in the working knee, light tension on the band."],
            ["Straighten the working knee fully, squeezing the thigh (especially the inner-quad) at the top.", "Hold the locked-out position for a second.", "Slowly let the knee bend back to the start against the band.", "Complete the reps, then switch legs."],
            ["Focus on the last few degrees of straightening — that's the 'terminal' range this drill trains.", "Keep the movement small and controlled; the kneecap should track over the toes.", "EASE OFF: no band needed — a standing thigh squeeze (quad set) gives the same terminal-range work pain-free."],
            ["Strengthens the terminal-range quad/VMO that controls the kneecap.", "A gold-standard knee-tracking and post-niggle drill for stairs and walking.", "Complements the eccentric knee drills with a gentle, low-load option."],
            ["Quads", "VMO"]),

        // ===== ANKLE ×1 ====================================================

        // region: ankle
        _createEx("Banded Ankle Eversion-Inversion", ["Legs"], "Bodyweight", "Mobility",
            ["Sit with one leg extended, a light band looped around the forefoot (or use a towel, or self-resist with the other foot).", "Keep the shin still; only the foot will move."],
            ["Eversion: with the band pulling inward, turn the sole of the foot outward against it; return slowly.", "Inversion: anchor the band the other way and turn the sole inward against it; return slowly.", "Move only at the ankle, through a comfortable range.", "Complete the reps each direction, then switch feet."],
            ["Move slowly and keep the shin/knee still — the work is at the ankle only.", "Light tension is plenty; this is lateral-ankle conditioning, not a strength test.", "EASE OFF: drop the band and do slow unresisted turns (or trace the alphabet) if the ankle is sore — the one missing plane is loaded side-to-side ankle work."],
            ["Strengthens the side-to-side ankle stability that sprain-prone and 40+ ankles lack.", "Adds the loaded eversion/inversion plane the rest of the ankle work skips.", "Builds confidence on uneven ground."],
            ["Peroneals", "Tibialis Posterior"])

    ];

    // Optional auto-merge if the host app is present and hasn't already merged us.
    if (window.allExercises && Array.isArray(window.allExercises)) {
        var have = {};
        window.allExercises.forEach(function (e) { have[e.name] = true; });
        window.mobilityGapfillExercises.forEach(function (e) { if (!have[e.name]) window.allExercises.push(e); });
    }
})();
