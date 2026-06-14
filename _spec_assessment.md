# _spec_assessment.md — v0.1 (draft)

**Scope:** The optional, conversational AI **intake** and the **user-profile schema** it produces. This is step 1 of the coaching loop. It does **not** design the program (that's the AI program designer) or prescribe numbers (that's `_spec_programming_rules.md`) or select exercises (Smart Picker). It produces the *profile object* everything downstream reads.
**Author:** orchestration layer. **Status:** draft for review.
**Feeds:** `_spec_programming_rules.md` (program designer + engine) · `_spec_sport_overlays.md` (sport field).
**Reuses:** the existing v60-era assessment (conversational interview + assessment workout + strength profiling). **This spec formalises the OUTPUT schema and extends it — it does not rebuild the intake from scratch.**

---

## 0. Where it sits

```
OPTIONAL AI ASSESSMENT  ──►  USER PROFILE (this spec)  ──►  AI PROGRAM DESIGNER (async)
(conversational, occasional)   structured object            sets goal emphasis, volume,
                                                            progression, injury constraints
                                                                      │
                                                                      ▼
                                                       DETERMINISTIC ENGINE (runtime)
                                                       prescription + autoregulation + swaps
```

The assessment is the **only** place this AI intake runs (once, plus an explicit "redo"). Its job is to fill the profile; everything after reads the profile, not the AI.

**Two hard principles:**
1. **Optional & progressive.** A long mandatory intake kills onboarding. Capture the essentials up front, let the user skip, and deepen over time / only where it matters. The app must be fully usable with a default profile and no assessment.
2. **The profile is starting priors, not gospel.** The autoregulation loop personalises from real logged performance; the assessment just sets sensible starting points.

---

## 1. The profile schema

The single object the loop reads. Stored locally + synced to the cloud blob.

```
profile = {
  // GOALS
  goalPrimary: "hypertrophy" | "strength" | "power" | "fatloss" | "resilience" | "conditioning",
  goalSecondary?: same enum,            // optional emphasis blend

  // EXPERIENCE
  trainingAge: "novice" | "intermediate" | "advanced",
  yearsTraining?: int,

  // DEMOGRAPHICS (for 40+ modifiers)
  age?: int,                            // drives the masters/recovery modifiers
  sex?: "male" | "female" | "unspecified",

  // EQUIPMENT  (reuse the existing equipment system / Travel Agent)
  equipment: [ "cable" | "dumbbell" | "barbell" | "bodyweight" | "machine" | ... ],

  // SCHEDULE
  daysPerWeek?: int,
  sessionMinutes?: int,                 // feeds time-adaptive sessions later

  // INJURY / NIGGLE LAYER  (the liability layer — see §4)
  niggles: [ { joint: "knee"|"shoulder"|"hip"|"low_back"|"ankle"|"elbow"|...,
               status: "current" | "history",
               note?: string } ],

  // SPORT  (from _spec_sport_overlays.md §1)
  sport: "afl_masters" | "surfing" | "none",
  sportContext?: { /* position, boardType, sessionsPerWeek, niggleHistory, ... per sport spec */ },

  // CAPACITY ANCHORS  (from the existing assessment workout / strength profiling)
  strengthProfile?: {                   // working weight per movement pattern
    horizontalPush?, verticalPush?, horizontalPull?, verticalPull?, squat?, hipHinge?
  },

  // PREFERENCES
  dislikes?: [exercise names/slugs],    // soft-exclude in the picker
  varietyBias?: 0..1,                   // low = same lifts, high = rotate

  // META
  source: "assessment" | "default" | "manual",
  updatedAt: ISO
}
```

Everything here already has a home or a clear consumer — no orphan fields.

---

## 2. Field → what it drives

| Profile field | Consumer | Effect |
|---|---|---|
| goalPrimary/Secondary | program designer + engine | dose (sets/reps/load/RIR/rest/tempo) + goal-conditioned cues |
| trainingAge | engine | volume landing point (MEV→MAV), progression aggressiveness |
| age | masters overlay (`_spec_sport_overlays.md §4`) | deload size, volume ceiling, warm-up length, readiness gating |
| equipment | Smart Picker | candidate pool |
| daysPerWeek / sessionMinutes | program designer / time-adaptive | split + session length |
| niggles | jointLoad / niggle safety invariant + injury layer | joint-aware swaps, prevention non-negotiables, safety gate |
| sport / sportContext | sport overlay | quality emphasis + prevention non-negotiables |
| strengthProfile | engine | starting-weight estimates for unseen exercises (ratios) |
| dislikes / varietyBias | Smart Picker | soft-exclude + rotation |

---

## 3. The intake flow (conversational, optional, progressive)

Reuse the existing v60-era interview UI (hybrid chat bubbles + quick-select chips + free text). Structure the questions in **tiers** so the user can stop early:

- **Tier 1 — essentials (always asked, ~6 quick taps):** primary goal, experience, equipment, age band, days/week, and the **injury/niggle check**.
- **Tier 2 — sport & specifics (optional):** sport + its 2–4 sub-questions; secondary goal; session length; dislikes.
- **Tier 3 — capacity (optional, the assessment workout):** the existing short assessment session → `strengthProfile`. Skippable; if skipped, the engine starts conservative and the autoregulation loop calibrates over the first sessions.

AI's role: it runs the conversation, probes deeper **only where it matters** (e.g. follows up on a flagged niggle), and emits the structured profile. The user can **skip** at any tier and **redo** later (the existing "Redo Assessment" entry).

---

## 4. Honesty / safety flags (read before this drives prescription)

- **Onboarding drop-off.** Keep Tier 1 short; everything else optional. Never block app use on a completed assessment.
- **Injuries = the liability layer.** The assessment *captures* injuries; it must frame everything as **general guidance, not medical advice — see a professional for acute or worsening pain.** Anything that would **auto-modify loading around an injury keeps a human in the loop** (surface the adjustment + a "see a pro" flag; don't silently prescribe around a serious/acute injury). A user reporting current sharp pain or a recent significant injury should be routed to caution, not a programmed workaround.
- **Self-reported capacity is noisy.** strengthProfile estimates are starting priors; the autoregulation loop owns the real calibration.
- **Privacy.** The profile holds health-adjacent data (injuries, age, sport). Store locally + cloud-sync with the existing blob; be transparent about what's stored. No third-party AI training on it (consistent with the deterministic-runtime architecture — the profile isn't shipped to model training).

---

## 5. Build phasing (v52-safe)

- **AS-1** — profile schema + storage (local + cloud blob), `source:"default"` fallback. Silent; nothing reads it yet.
- **AS-2** — wire the existing intake UI to emit the new schema (extend, don't rebuild); add the Tier-1/2 questions incl. `sport` + niggle capture.
- **AS-3** — connect the profile to the program designer + engine (goal/equipment/age/niggle/sport actually influence output).
- **AS-4** — redo/edit profile; surface a readable "your profile" summary.

Device-test gate between each. AS-1/AS-2 are safe to run alongside other work; AS-3 is the one that changes user-facing prescription — phase it carefully and gate on the programming-rules review.

---

## 6. Dependencies

- **Blocks on:** `_spec_programming_rules.md` review (injury section + 40–54 modifiers) before AS-3 drives real prescription.
- **Pairs with:** `_spec_sport_overlays.md` (sport field) and the wearable-readiness discussion (Garmin/Oura sleep+HRV would later feed the same profile/readiness layer).

*— end v0.1 —*
