# Nimble Shred — Project State

**Updated:** 2026-02-11
**Current version:** v60
**Deployed:** trotzali.github.io/nimble-shred
**Repo:** GitHub Pages (static deploy — push to main, auto-deploys)
**Backend:** Vercel (API routes for Gemini AI, Supabase cloud sync)

---

## Architecture

Single-file web app: `index.html` (~8,500 lines). Everything inline — CSS, JS, 164-exercise database, all features. No build tools, no bundler, no framework. Vanilla JS + HTML + CSS.

### External dependencies (CDN only)
- Chart.js (analytics charts)
- Supabase JS SDK (cloud sync)
- Google Fonts: Inter

### Backend (Vercel — separate repo)
- `/api/drive` — proxies Gemini AI calls (system prompt + messages → response)
- Supabase for cloud sync (workout history, plans, settings)
- Backend URL stored in `BACKEND_URL` constant in the HTML

### State management
- `appState` object → `localStorage` key `nimbleState_v45`
- `exerciseHistory` → `localStorage` (per-exercise set logs with date, weight, reps)
- `completedWorkouts` → `localStorage` (daily completion records with RPE)
- `consultProfile` → `localStorage` (AI consultation answers)
- `strengthProfile` → `localStorage` (assessment-derived movement pattern weights)
- `currentPlan` → `localStorage` (full AI-generated plan JSON)
- Cloud sync via Supabase (optional, toggled by `CLOUD_SYNC_ENABLED`)

---

## Exercise database

164 exercises defined in `window.allExercises` array via `createEx()` factory function.

Each exercise has: name, categories (array), equipment type, workout type, prep steps, execution steps, tips, benefits, target muscles, and optional Torque F9 setup config.

### Equipment types
- `Cable` (56 exercises) — Torque F9 functional trainer
- `Dumbbell` (28 exercises)
- `Bodyweight` (77 exercises, includes calisthenics + mobility + nimble)

### Categories
Chest, Back, Shoulders, Arms, Legs, Core, Full Body

### Workout types
Strength, Muscle Build, Calisthenics, Mobility, Nimble

### Exercise media
GIF URLs and YouTube links stored in `exerciseMedia` object (separate from exercise definitions). 158/164 exercises have GIFs.

---

## Feature inventory (what's built and working)

### Core workout flow
- **Quick Start:** tap Push/Pull/Legs chip → warmup sequence → one-exercise-at-a-time workout flow
- **Warmup system:** type-specific warmup sequences with timed exercises (push/pull/legs each have their own)
- **Set logging:** weight + reps per set, saved to exerciseHistory with sessionDate
- **Flexible set completion:** user decides when exercise is done (no forced 3-set minimum)
- **Exercise cards:** show GIF, YouTube link, setup instructions, execution cues, tips
- **Workout completion:** RPE rating (1-10) with optional tags (joint pain, great pump, etc.)

### Equipment system
- **Session gear:** gym / home / travel / bodyweight presets
- **Custom equipment:** granular chip toggles (Cable, Dumbbells, Pull-up Bar, Bands, etc.)
- **Travel Agent:** saved location profiles with custom equipment
- **Equipment filtering:** workout generation respects selected equipment

### AI systems
- **AI Chat** (floating button): conversational AI via Gemini, quick action buttons, message history
- **Coach Consultation** (v58): replaces old 3-question wizard with guided conversational interview
  - Hybrid UI: bubble suggestions + free text input
  - Collects 8 profile fields: goal, days, age, experience, equipment, injuries, timePerSession, preferences
  - AI determines plan vs single workout from conversation
  - Profile persists in localStorage, recognised on return visits
  - Progress dots + profile tag bar show collection progress
  - Generates real training plans (weekly schedule + phases) or single workouts
- **Fitness Assessment** (v60): 6-exercise test workout based on equipment
  - Offered after consultation, before plan generation (skippable)
  - Tests 6 movement patterns: horizontal push/pull, vertical push/pull, squat, hinge
  - Builds strength profile with working weights per pattern
  - Strength ratios extrapolate starting weights for ALL related exercises
  - Smart Spotter uses profile as fallback when no exercise history exists

### Smart Spotter (progression system)
- Analyses last session per exercise
- Suggests: weight increase (if hit 12+ reps), same weight/more reps, or deload (if <6 reps)
- Stall detection (3+ sessions same weight)
- Check-in weight multiplier applied (Age-Proof)
- Falls back to strength profile estimate for new exercises (v60)

### Human Check-In + Age-Proof Protocol (v57)
- Modal before every workout: Fresh / Normal / Tired / Pain
- Adjusts warmup duration (1.0×–1.5× multiplier)
- Adjusts weight suggestions (80%–100%)
- Sets rest timer duration (60s–120s)
- Tired/Pain adds extra mobility exercise to warmup start
- Check-in badge shown on active exercise card

### Rest timer (v57)
- Appears after every set log
- Countdown with progress bar, voice countdown at 3-2-1
- Duration based on check-in (60s fresh → 120s pain)
- Skip button available

### Analytics & intelligence
- **Recovery Scorecard** (Recovery tab): A-F grade based on rest days, RPE trends, consecutive training, pain flags, volume spikes
- **The Mechanic** (Plan tab): pattern detection — declining weight, declining reps, skipped exercises, muscle imbalances
- **Deload Detective** (Plan tab): volume analysis, overtraining detection
- **Weekly Briefing** (Plan tab): summary of last 7 days
- **Session Replay**: last session comparison shown during workout
- **Workout History**: view/edit/delete past sessions

### Other features
- **Wedge Sessions:** time-based mini workouts (10/15/20/30 min)
- **Custom Workout Builder:** manually pick exercises
- **Plan calendar:** weekly schedule view with day types (push/pull/legs/rest/cardio/nimble)
- **Plan Overview card** (v59): shows plan name, phases, schedule, consultation profile, strength profile
- **Exercise Encyclopedia:** searchable/filterable exercise library
- **Cloud sync:** Supabase-backed sync for multi-device
- **Version badge:** teal pill next to header, updates each version

---

## File structure (single file)

The HTML file is organised in this order:

1. **`<head>`** — meta, Google Fonts, Chart.js CDN, Supabase CDN
2. **`<style>`** — all CSS (~1,100 lines)
3. **`<body>` HTML** — all page containers, modals, overlays
   - Navigation bar (Coach / Plan / Encyclopedia / Recovery / Settings tabs)
   - Coach page: equipment toggles, workout type chips, wedge session, custom builder, AI consultation button
   - Plan page: AI consultation card, plan overview, calendar, history, analytics cards
   - Encyclopedia page: search/filter, exercise cards
   - Recovery page: scorecard, Garmin placeholder
   - Settings page: equipment, plan management, cloud sync, data export
   - Modals: warmup, RPE, check-in, consultation chat
   - AI chat panel (floating)
4. **`<script>` block 1** — exercise database (`window.allExercises`, ~1,000 lines)
5. **`<script>` block 2** — constants, cloud sync config
6. **`<script>` block 3** — main application logic (~5,000 lines)
   - State management (loadAppState, saveAppState)
   - Tab switching
   - Workout generation (generateWorkoutByType, equipment filtering)
   - Warmup system
   - Active workout flow (renderWorkout, logSet, finishWorkout)
   - Smart Spotter (getProgression)
   - Session RPE
   - Exercise encyclopedia
   - Plan calendar
   - Workout history
   - Analytics (Weekly Briefing, Deload Detective, Mechanic, Recovery Scorecard)
   - AI chat system
   - Coach Consultation system
   - Fitness Assessment system
   - Cloud sync functions
   - TTS (speak function)
   - Settings UI

---

## Key technical details

### Equipment filtering
`generateWorkoutByType(type, count)` filters `window.allExercises` by:
- Category match (push → Chest+Shoulders+Arms, pull → Back+Arms, legs → Legs)
- Equipment match against `appState.equipment` or `appState.customEquipment`
- Workout type match (Strength/Muscle Build for main workouts)

### Consultation AI response format
The AI returns text with embedded blocks:
```
[BUBBLES]Option 1|Option 2|Option 3[/BUBBLES]
[PROFILE]{"goal":"muscle","days":"4",...,"ready":false}[/PROFILE]
```
`parseConsultResponse()` strips these, renders bubbles as tap buttons, merges profile data.

### Strength profile ratios
`strengthRatios` object maps each movement pattern → exercise name → percentage of test weight.
`getEstimatedWeight(exerciseName)` looks up the ratio and multiplies by the assessed base weight.

### Assessment workout patches
`patchRenderWorkoutForAssessment()` and `patchFinishWorkoutForAssessment()` wrap the existing `renderWorkout` and `finishWorkout` functions to inject assessment-specific UI (instruction cards, progress bar) and handle assessment completion (build strength profile, reopen consultation).

---

## Known issues / tech debt

1. **Single-file monolith** — 8,500 lines. Works but hard to navigate. Future: split into CSS + JS modules.
2. **UTF-8 / encoding issues** — historical mojibake from emoji handling. Mostly resolved in v55-v56 SVG icon migration, but some exercise descriptions still have `Â°` artifacts.
3. **Exercise media coverage** — 158/164 exercises have GIFs. 6 still missing.
4. **AI hallucination** — Gemini sometimes returns invalid JSON from plan generation. `generateFromConsultation()` has try/catch but error recovery is basic.
5. **No offline support** — AI features require internet. Core workout flow works offline via localStorage.
6. **Assessment exercise matching** — `startAssessment()` picks exercises by equipment keyword matching on `consultProfile.equipment` string. Could be more robust.
7. **Theme system** — `theme-system-v52.js` exists but was never integrated. CSS uses hardcoded dark theme with `--bg`, `--card`, `--sec`, `--primary` custom properties.

---

## Roadmap (priority order)

### Completed ✅
1. Session RPE Rating
2. Exercise GIFs + YouTube (158/163)
3. Smart Spotter progression
4. Session Replay
5. Weekly Briefing
6. Wedge Sessions
7. Travel Agent equipment profiles
8. Deload Detective
9. Workout History UI
10. One-exercise-at-a-time flow
11. Flexible set completion
12. AI Chat prompt fix
13. Recovery Scorecard
14. Mechanic pattern detection
15. Human Check-In + Age-Proof Protocol
16. Coach Consultation (replaced wizard)
17. Plan Overview card
18. Fitness Assessment + Strength Profile

### Pending 🔲
1. **Superset Brain (M)** — intelligent exercise pairing for time efficiency
2. **Hands-Free Mode (G)** — voice commands via Web Speech API
3. **AI Actions System (Option B)** — JSON commands so chat can create/start workouts directly
4. **Theme System** — 4 themes + light/dark toggle (theme-system-v52.js exists)
5. **Glass-morphism + animations** — visual polish
6. **GIF coverage** — 6 exercises still missing GIFs
7. **Gym Scanner** — photo → AI vision → equipment detection
8. **Accountability Notifications (K)** — push notifications
9. **Form Library AI (L)** — rotating coaching cues
10. **Garmin integration** — recovery data from wearable
11. **File split** — decompose monolith into modules

---

## Development patterns

### How edits are made
- Surgical `str_replace` or `sed` — never full file rewrites
- Version bump on every change (`sed -i 's/v59/v60/'` on the version badge)
- Node.js syntax check after every edit: parse each `<script>` block with `new Function(code)`
- User tests on device before next change

### Version badge location
In the Coach page header, next to "Workout Coach" h2. Styled as teal pill with monospace font:
```html
<span style="font-size:...;background:rgba(3,218,198,0.15);color:var(--sec);padding:2px 8px;border-radius:8px;font-family:monospace;">v60</span>
```

### Key CSS custom properties
```css
--bg: #121212 (background)
--card: #1e1e1e (card background)
--sec: #03dac6 (teal accent — buttons, badges, progress)
--primary: #bb86fc (purple accent — headers, links)
```

### Testing approach
1. Syntax check (Node.js `new Function()` on each script block)
2. User opens file on mobile device
3. User tests specific checklist items
4. Next version only proceeds after user confirms

---

## Backend reference

### Gemini API call pattern
```javascript
fetch(BACKEND_URL + '/api/drive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'gemini',
        system: 'System prompt here',
        messages: [{ role: 'user', content: 'User message' }]
    })
});
// Response: { content: [{ text: 'AI response' }] }
```

### Supabase tables
- Used for cloud sync of workout history, plans, settings
- Toggled by `CLOUD_SYNC_ENABLED` constant
- Functions: `savePlanToCloud()`, `syncToCloud()`, `syncFromCloud()`
