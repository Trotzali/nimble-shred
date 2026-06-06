# Nimble Shred — Ideas / Backlog

**Recent-at-top**

---

## FLAGSHIP (post-cleanup): Pain-Aware Training + Rehab/Prehab Assistant

Conversational injury/soreness assistant for 40+. MODIFIES TRAINING AND TRIAGES — NEVER DIAGNOSES, NEVER NAMES CONDITIONS.

- Structured intake: location, timing (during/after/night), aggravating movement, severity 0–10, duration.
- Red-flag gate FIRST: numbness/tingling, radiating pain, night pain, sudden swelling, can't bear weight, pain after a fall → STOP, refer to a professional.
- If clear: swap the aggravating lift for a mechanical alternative from the DB, reduce load, offer region-specific prehab/mobility.
- Log issues → trend detection for recurring sore spots.
- System prompt constrains Gemini: not a doctor, no diagnosis, movement + referral only.
- **Substrate:** exercise metadata (mechanical alternatives, joint-load profile, contraindication tags, rehab/prehab category) — shared with pain-swap, joint-stress, ramped-warmup.
- **Phases:** (1) intake + red-flag gate + swap, (2) persistent injury tracking, (3) dedicated rehab routines reusing the Wedge engine.

**Sequencing:** slots after analytics consolidation + the exercise-metadata pass.

**Existing hooks to build on:** Check-In "Pain" path + Age-Proof multipliers, RPE "joint pain" tag (already logged per session), The Mechanic's pattern detection (trend substrate), Wedge engine (phase 3), consultation chat UI + `[BUBBLES]`/`[PROFILE]` parse pattern (structured intake), Gemini system-prompt constraint pattern from v56 chat fix.

---

## Active roadmap

### Near-term (next to build)
- **Superset Brain** — intelligent exercise pairing for time efficiency. Group complementary exercises (push+pull, or agonist+antagonist) to cut session time.
- **AI Actions System** — let the AI chat create/start/modify workouts via JSON commands. Currently chat is text-only and can't execute anything.
- **Hands-Free Mode** — Web Speech API for voice commands during workout. "Next set", "Log 80kg 10 reps", "Skip exercise".

### Medium-term
- **Theme System** — 4 themes + light/dark toggle. `theme-system-v52.js` already exists but was never integrated. CSS custom properties are already in place.
- **Glass-morphism + animations** — visual polish pass. Frosted glass cards, smoother transitions.
- **GIF coverage** — 6 exercises still missing GIFs. Need to source or create.
- **File split** — decompose the 8,500-line monolith into separate CSS + JS module files. Needed for maintainability but not blocking features.

### Long-term
- **Gym Scanner** — phone camera → AI vision → detect available equipment automatically
- **Garmin integration** — pull recovery/HRV/sleep data to feed into Recovery Scorecard and Check-In
- **Accountability Notifications** — push notifications for training reminders
- **Form Library AI** — rotating coaching cues shown during exercises, personalised to common form errors
- **Progressive Web App** — offline support, install to home screen, service worker

---

## Banked ideas (discussed but not prioritised)

- **Plate Math** — visual barbell loading calculator. User said "skip" but could be useful for barbell users.
- **Social/sharing** — share workouts or progress with friends. Low priority, privacy concerns.
- **Macro tracking** — nutrition logging. Scope creep risk, probably better as a separate app.
- **Exercise video recording** — record sets for form review. Storage/privacy complexity.
- **Workout templates** — save and reuse custom workouts. Partially covered by consultation system.
- **Heart rate zones** — if Garmin integration happens, use HR data for cardio guidance.
- **Periodisation engine** — deterministic progressive overload with auto-deload weeks. Partially covered by Smart Spotter + Deload Detective.
- **Dynamic plan modification** — AI adjusts the active plan based on completion rates and RPE trends. Depends on AI Actions System.
