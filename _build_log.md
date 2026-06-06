# Nimble Shred — Build Log

**Recent-at-top**

---

## v60 — Fitness Assessment + Strength Profile (2026-02-11)

**What shipped:**
- Assessment system: 6-exercise test workout offered after consultation
- Three equipment tracks: Cable (6 exercises), Dumbbell (5), Bodyweight (5)
- Strength profile builder: analyses logged sets → working weight per movement pattern
- Strength ratios: extrapolates starting weights for ALL exercises from 6 test results
- Smart Spotter fallback: uses strength profile when no exercise history exists
- Plan Overview card: shows strength profile bars on Plan tab
- "Redo Assessment" button on Plan page

**Key functions:** `startAssessment()`, `buildStrengthProfile()`, `getEstimatedWeight()`, `patchRenderWorkoutForAssessment()`, `patchFinishWorkoutForAssessment()`

---

## v59 — Plan Overview + Mode Selection (2026-02-11)

**What shipped:**
- Plan Overview card on Plan tab: plan name, phases, weekly schedule, consultation profile
- AI consultation now asks "plan or workout?" as first question (both buttons open same flow)
- Consultation mode detection: AI sets `mode` field in profile JSON
- All entry points unified to `startConsultation()` with no preset mode

---

## v58 — Coach Consultation (2026-02-11)

**What shipped:**
- Full conversational AI consultation replacing old 3-question wizard
- Hybrid UI: bubble suggestions + free text input
- AI-driven conversation with system prompt guiding natural interview
- 8 profile fields collected: goal, days, age, experience, equipment, injuries, timePerSession, preferences
- Progress bar (8 dots) + profile tag bar
- Profile persists in localStorage across sessions
- Plan generation from consultation data (weekly schedule + phases)
- Workout generation from consultation data
- Entry points on Coach page and Plan page
- Backward compatibility: old `startAIPlanWizard()` redirects to `startConsultation()`

**Key functions:** `startConsultation()`, `callConsultAI()`, `buildConsultSystemPrompt()`, `parseConsultResponse()`, `generateFromConsultation()`

---

## v57 — Human Check-In + Age-Proof Protocol (2026-02-11)

**What shipped:**
- Check-in modal (4 options) before every workout: Fresh / Normal / Tired / Pain
- Warmup duration multiplier (1.0×–1.5×) based on feeling
- Weight suggestion multiplier (80%–100%) via Smart Spotter
- Rest timer between sets: countdown, progress bar, voice at 3-2-1, skip button
- Duration by feeling: 60s (fresh) → 120s (pain)
- Extra mobility exercise prepended to warmup for tired/pain
- Check-in badge on active exercise card
- Applied to Quick Start, Random, and Wedge sessions

**Key functions:** `showCheckIn()`, `processCheckIn()`, `startRestTimer()`, `skipRestTimer()`, `endRestTimer()`

---

## v56 — Recovery Scorecard + Mechanic + AI Fix (2026-02-11)

**What shipped:**
- AI chat system prompt updated: explicit limitations (can't save/create workouts)
- Recovery Scorecard: A-F grade on Recovery tab (rest days, RPE, consecutive training, pain flags, volume spikes)
- The Mechanic: pattern detection on Plan tab (declining weight, declining reps, skipped exercises, muscle imbalances)

**Key functions:** `renderRecoveryScorecard()`, `renderMechanic()`

---

## v55 — Mobile UI Polish + Equipment Cleanup (2026-02-11)

**What shipped:**
- CSS overhaul: centered chips, gear toggles, buttons; subtle card borders; press animations
- Equipment system unified: removed duplicate wedgeGear, single sessionGear controls all
- Section labels and dividers for visual hierarchy
- Version badge styled as teal pill
- Default equipment changed from 'home' to 'gym'

---

## v54–v55 — Feature Bundle (2026-02-11)

**What shipped:**
- Smart Spotter: session-aware weight/rep progression with stall detection
- Session Replay: last session comparison during workout
- Weekly Briefing: 7-day training summary
- Wedge Sessions: time-based mini workouts (10/15/20/30 min)
- Travel Agent: equipment location profiles
- Deload Detective: volume analysis and overtraining detection

---

## v53 — RPE + GIFs + History (2026-02-10)

**What shipped:**
- Session RPE rating modal (1-10 scale with descriptive tags)
- Exercise GIF integration (158/164 coverage)
- YouTube link integration
- Workout History viewer with edit/delete
- Flexible set completion (removed forced 3-set minimum)
- One-exercise-at-a-time flow

---

## v51 — Baseline (pre-session)

**Starting state:** 5,460 lines. 164 exercises, AI chat, cloud sync, plan calendar, encyclopedia, settings. All core workout flow functional.
