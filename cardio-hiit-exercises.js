// ============================================================================
// NIMBLE SHRED — HIIT / CONDITIONING CARDIO PACK (v1.0.0)
// ============================================================================
// 14 HIIT-influenced cardio/conditioning moves to expand the thin cardio bucket.
// Authored in the EXACT createEx() shape used by index.html's window.allExercises
// (name, cat[], equip, type, prep[], exec[], tips[], benefits[], muscles[], setupF9?).
//
// NOT yet loaded by index.html — prep module, mirrors exercise-metadata.js's
// standalone stance. To integrate (a deliberate, separate step):
//     <script src="cardio-hiit-exercises.js"></script>   // AFTER the DB block
//     window.allExercises = window.allExercises.concat(window.cardioHiitExercises);
// then add the matching window.exerciseMeta rows from _cardio_hiit_meta.md.
//
// DESIGN PRIORITY — 40+ JOINT AWARENESS:
//   • The set is deliberately LOW-IMPACT-FIRST. 10 of 14 moves involve no
//     jumping/landing at all; 2 are low-to-moderate; only 2 are ballistic.
//   • Every higher-impact move carries an explicit low-impact regression in its
//     tips[] (look for "LOW-IMPACT:").
//   • type is "Calisthenics" for sustained conditioning, "Plyo" only for the two
//     truly ballistic moves (Pop Squat, Pogo Hops).
//
// This file is self-contained: it uses index.html's global createEx() if present,
// otherwise falls back to an identical local factory so it parses standalone.
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

    window.cardioHiitExercises = [

        // ---- 1. MARCH IN PLACE (LOW IMPACT — foundation / true-beginner cardio)
        _createEx("March in Place", ["Cardio"], "Bodyweight", "Calisthenics",
            ["Stand tall, feet hip-width, core gently braced.", "Let arms bend to 90 degrees at your sides."],
            ["Lift one knee to a comfortable height (hip height or lower).", "Pump the opposite arm as the knee rises.", "Lower softly and alternate in a steady rhythm.", "Keep contact light — roll through the foot, no stomping."],
            ["Drive the pace through the arms when legs tire.", "Keep knees pointing straight ahead, not collapsing in.", "Zero impact — both feet never leave the floor at once. The safest way to raise heart rate with cranky knees."],
            ["Raises heart rate with no joint impact.", "Warms the hips and ankles for harder work.", "Self-paceable from gentle to brisk."],
            ["Hip Flexors", "Cardio"]),

        // ---- 2. STEP TOUCH (LOW IMPACT — lateral conditioning)
        _createEx("Step Touch", ["Cardio"], "Bodyweight", "Calisthenics",
            ["Stand tall with feet together, knees soft.", "Hands up ready to swing or guard."],
            ["Step one foot out to the side.", "Bring the other foot in to tap beside it.", "Step back out the opposite way and tap again.", "Add an arm swing or overhead reach to raise intensity."],
            ["Stay on the balls of the feet but keep them grounded — no hop.", "Widen the step or speed up to push the heart rate.", "Knee-friendly lateral option that trains side-to-side coordination without the landing forces of skater hops."],
            ["Trains lateral movement with no impact.", "Gentle on knees and ankles.", "Improves balance and rhythm."],
            ["Glutes", "Cardio"]),

        // ---- 3. LATERAL SHUFFLE (LOW IMPACT — athletic side-to-side)
        _createEx("Lateral Shuffle", ["Cardio", "Legs"], "Bodyweight", "Calisthenics",
            ["Drop into a quarter-squat athletic stance, chest up.", "Weight on the balls of the feet, knees tracking over toes."],
            ["Push off the trailing leg and shuffle two or three steps to one side.", "Stay low — don't bob up and down.", "Reverse and shuffle back the other way.", "Keep feet from clicking together; maintain the wide base."],
            ["Sink the hips to keep it low-impact and glute-driven.", "Shorten the distance if space or ankles are limited.", "No leaping — feet skim the floor, so it loads the hips and ankles without the impact of bounds."],
            ["Builds lateral conditioning and hip strength.", "Reinforces an athletic, knee-safe stance.", "Low-impact alternative to skater hops."],
            ["Glutes", "Quads", "Cardio"]),

        // ---- 4. STANDING KNEE-TO-ELBOW (LOW IMPACT — standing core cardio)
        _createEx("Standing Knee-to-Elbow", ["Cardio", "Core"], "Bodyweight", "Calisthenics",
            ["Stand tall, hands behind the head or out wide.", "Brace the core and stand on one stable leg."],
            ["Drive one knee up and across toward the opposite elbow.", "Crunch the torso slightly to meet it.", "Return tall and repeat on the other side.", "Find a steady, breathing rhythm."],
            ["Rotate from the ribcage, not by yanking the neck.", "Lower the knee height if balance or hips complain.", "Standing alternative to floor crunches — gets the core and heart working with no pressure on the spine or wrists."],
            ["Standing core conditioning with a cardio bias.", "No floor contact — easy on wrists and lower back.", "Trains balance on a single leg."],
            ["Obliques", "Hip Flexors", "Cardio"]),

        // ---- 5. SHADOW BOXING (LOW IMPACT — upper-body cardio, knee-sparing)
        _createEx("Shadow Boxing", ["Cardio"], "Bodyweight", "Calisthenics",
            ["Stand in a staggered boxing stance, hands up guarding the chin.", "Soft knees, weight balanced, core braced."],
            ["Throw controlled jab-cross combinations into the air.", "Rotate through the torso and pivot the back foot on the cross.", "Mix in hooks; keep the non-punching hand up.", "Stay light on the feet with a small bounce or steady base."],
            ["Don't fully snap/lock the elbows — keep punches loose to protect the joint.", "Keep the feet quiet and grounded if knees or ankles are sore — the work is all upper body.", "Best heart-rate driver in the set for anyone resting the lower body."],
            ["Raises heart rate while sparing the knees and ankles.", "Trains coordination, rhythm and shoulder endurance.", "Great low-body-impact conditioning option."],
            ["Shoulders", "Core", "Cardio"]),

        // ---- 6. SQUAT TO CALF RAISE (LOW IMPACT — no-jump leg conditioning)
        _createEx("Squat to Calf Raise", ["Cardio", "Legs"], "Bodyweight", "Calisthenics",
            ["Stand feet shoulder-width, toes slightly out.", "Arms ready to swing forward for momentum and balance."],
            ["Sit back into a comfortable-depth bodyweight squat.", "Drive up through the heels to standing.", "At the top, rise onto the balls of the feet into a calf raise.", "Lower the heels and flow straight into the next squat."],
            ["Control the calf raise — don't bounce off the ankle.", "Reduce squat depth to a box/chair height if knees object.", "A continuous, no-jump way to train leg power-endurance — the safe substitute for jump squats."],
            ["Builds leg and calf endurance with zero landing impact.", "Trains the squat-to-extension pattern continuously.", "Scalable depth for any knee."],
            ["Quads", "Glutes", "Calves", "Cardio"]),

        // ---- 7. FAST FEET SHUFFLE (LOW IMPACT — quick-feet drill)
        _createEx("Fast Feet Shuffle", ["Cardio"], "Bodyweight", "Calisthenics",
            ["Stand in a low athletic stance, weight on the balls of the feet.", "Hands up in front for rhythm."],
            ["Pump the feet up and down as fast as possible in tiny, quick steps.", "Keep the steps low and light — barely leaving the floor.", "Stay low in the hips throughout.", "Work in short, sharp bursts."],
            ["Think 'hot coals' — minimal ground contact, maximum turnover.", "Keep it gentle and slow the cadence if the calves cramp.", "Quick-feet conditioning that lights up the heart rate without the jarring of plyometric jumps."],
            ["Spikes heart rate fast in short bursts.", "Trains foot speed and calf endurance.", "Low-impact alternative to the Dot Drill."],
            ["Calves", "Cardio"]),

        // ---- 8. SLOW MOUNTAIN CLIMBER (LOW IMPACT — controlled regression of MCs)
        _createEx("Slow Mountain Climber", ["Cardio", "Core"], "Bodyweight", "Calisthenics",
            ["Set up in a strong high-plank: hands under shoulders, body in a straight line.", "Brace the core and squeeze the glutes."],
            ["Slowly and deliberately draw one knee toward the chest.", "Return it under control to the plank.", "Alternate legs at a steady, smooth tempo.", "Keep the hips low and level — no piking or bouncing."],
            ["Slower than classic mountain climbers — the deliberate tempo removes the bounce and protects the lower back.", "Drop to forearms or raise the hands onto a bench/step to ease wrist and shoulder load.", "Note: still a plank, so it loads the wrists and shoulders — swap to a standing move if those are the sore joints."],
            ["Core conditioning without the impact of fast climbers.", "Builds shoulder and trunk stability.", "Tempo is fully self-controlled."],
            ["Core", "Shoulders", "Cardio"]),

        // ---- 9. REVERSE LUNGE TO KNEE DRIVE (LOW IMPACT — unilateral, no jump)
        _createEx("Reverse Lunge to Knee Drive", ["Cardio", "Legs"], "Bodyweight", "Calisthenics",
            ["Stand tall on one leg, the other ready to step back.", "Arms bent and ready to pump."],
            ["Step one foot back into a controlled reverse lunge.", "Drive out of the front heel back to standing.", "As you rise, drive the rear knee up high to hip height.", "Complete the reps on one side, then switch."],
            ["Step back rather than forward — it keeps the front knee behind the toes and easier on the joint.", "Shorten the lunge or skip the knee drive if balance is shaky.", "A knee-friendly unilateral conditioner and the no-jump answer to jumping lunges."],
            ["Builds single-leg strength and balance under a cardio load.", "No jumping or landing impact.", "Trains each leg independently to fix imbalances."],
            ["Quads", "Glutes", "Cardio"]),

        // ---- 10. STANDING OBLIQUE TWIST (LOW IMPACT — rotational core cardio)
        _createEx("Standing Oblique Twist", ["Cardio", "Core"], "Bodyweight", "Calisthenics",
            ["Stand feet shoulder-width, knees soft.", "Bring hands together in front of the chest or behind the head."],
            ["Rotate the torso smoothly to one side, pivoting the back foot.", "Return through center and rotate to the other side.", "Keep a steady, rhythmic pace.", "Let the rotation come from the trunk, hips facing forward-ish."],
            ["Move smoothly — never wrench or ballistically snap the spine.", "Reduce the range and slow the tempo if the lower back is sensitive.", "Note: rotation loads the lower back, so keep it controlled and swap to a non-rotational move if the back is the issue."],
            ["Conditions the obliques and trunk with a cardio rhythm.", "Standing and impact-free.", "Improves rotational mobility when done controlled."],
            ["Obliques", "Core", "Cardio"]),

        // ---- 11. LOW STEP-UP (FAST) (LOW–MODERATE — scalable step conditioning)
        _createEx("Low Step-Up (Fast)", ["Cardio", "Legs"], "Bodyweight", "Calisthenics",
            ["Stand facing a low, stable step or platform (start low — 15–20cm).", "Arms ready to pump for rhythm."],
            ["Step up with one foot, driving through the heel to stand tall on the step.", "Step back down softly under control.", "Keep a brisk, steady cadence, alternating or leading legs.", "Pump the arms to keep the pace up."],
            ["Use a LOW step and full foot contact to keep the knee comfortable.", "Step DOWN softly — most knee stress comes from a heavy landing.", "LOW-IMPACT: lower the step height or slow the cadence; this is the joint-smart stand-in for box jumps."],
            ["Cardio with a strong leg-endurance component.", "Height is fully scalable to your knees.", "Far gentler than jumping onto a box."],
            ["Quads", "Glutes", "Cardio"]),

        // ---- 12. NO-JUMP BURPEE (LOW–MODERATE — full-body, jump removed)
        _createEx("No-Jump Burpee", ["Cardio", "Full Body"], "Bodyweight", "Calisthenics",
            ["Stand tall with room to place hands on the floor in front.", "Feet hip-width, core braced."],
            ["Squat down and place both hands on the floor.", "Step the feet back one at a time into a plank (no jump).", "Step the feet back in toward the hands one at a time.", "Stand tall and reach overhead instead of jumping."],
            ["Stepping the feet (rather than jumping them) cuts the impact dramatically — ideal for 40+ joints.", "Raise the hands onto a bench to reduce wrist and shoulder load and shorten the range.", "Add an optional push-up only if shoulders are happy; the overhead reach replaces the jump."],
            ["Full-body conditioning that elevates heart rate fast.", "Low-impact version of the burpee, no landing.", "Trains the get-down/get-up pattern useful for daily life."],
            ["Full Body", "Core", "Cardio"]),

        // ---- 13. POP SQUAT (MODERATE IMPACT — light ballistic, regression given)
        _createEx("Pop Squat", ["Legs", "Cardio"], "Bodyweight", "Plyo",
            ["Stand with feet together, knees soft and ready.", "Hands in front for balance."],
            ["Hop the feet out wide and sit into a quick squat as you land.", "Spring the feet back together with a small hop.", "Land softly — toes first, then heels, knees bending to absorb.", "Keep a light, springy rhythm."],
            ["Keep the hops SMALL and the landings quiet — soft knees absorb the force.", "LOW-IMPACT: replace each hop with a STEP out and in (no leaving the floor) — that turns it into a no-impact lateral squat.", "Skip entirely on flared-up knees or ankles; use Squat to Calf Raise instead."],
            ["Adds light plyometric power to leg conditioning.", "Trains soft, controlled landings.", "Quickly elevates heart rate."],
            ["Quads", "Glutes", "Calves", "Cardio"]),

        // ---- 14. POGO HOPS (MODERATE–HIGH IMPACT — ankle-driven, regression given)
        _createEx("Pogo Hops", ["Cardio", "Legs"], "Bodyweight", "Plyo",
            ["Stand tall, feet together, knees nearly straight but unlocked.", "Arms relaxed at the sides for a small rhythmic swing."],
            ["Hop straight up using mostly the ankles and calves — like a pogo stick.", "Keep the knees fairly stiff so the bounce comes from the feet.", "Land on the balls of the feet and rebound immediately.", "Stay light, tall and rhythmic."],
            ["Stay tall and springy — short, quick, quiet hops, never deep heavy ones.", "Highest-impact move in the set: build ankle tolerance gradually and keep volume low.", "LOW-IMPACT: do Fast Feet Shuffle or controlled calf raises instead — same calf/ankle stimulus with no landing."],
            ["Builds calf and ankle stiffness and reactive strength.", "Trains the lower-leg spring for running and athletics.", "Short, sharp heart-rate spikes."],
            ["Calves", "Cardio"])

    ];

    // Optional auto-merge if the host app is present and hasn't already merged us.
    if (window.allExercises && Array.isArray(window.allExercises)) {
        var have = {};
        window.allExercises.forEach(function (e) { have[e.name] = true; });
        window.cardioHiitExercises.forEach(function (e) { if (!have[e.name]) window.allExercises.push(e); });
    }
})();
