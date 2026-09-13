# Assessment build trace — extend the v60 intake to emit the new profile schema

**Type:** Read-only trace → fireable plan. No `index.html` edits, no git.
Anchors = function / id; line numbers indicative (v106 working tree, drift).
**Spec:** `_spec_assessment.md` (schema §1, phasing §5) + `_spec_sport_overlays.md §1`
(sport/sportContext). **Principle: EXTEND the existing intake, don't rebuild.**

---

## 1. The existing v60-era assessment (3 pillars + where data lives)

### A. Conversational interview (AI consultation) — the intake UI
- `var consultProfile = {}` (**L8041**), `var consultMode` (L8042),
  **`consultFields = ['goal','days','age','experience','equipment','injuries','timePerSession','preferences']`** (**L8043**).
- `startConsultation(mode)` (**L8045**) — opens chat; rehydrates `consultProfile`
  from `localStorage 'consultProfile'` (L8060-8066).
- `sendConsultMessage` (**L8115**) → AI reply parsed for `[BUBBLES]` + `[PROFILE]`
  (**L8166-8185**): `consultProfile[key] = parsed.profile[key]` for each emitted
  key, then **persists** `localStorage.setItem('consultProfile', …)` (**L8185**).
  → **The parser already copies ANY field the AI emits** — new schema keys flow in
  for free once the prompt asks for them.
- Consult **system/gen prompt** builder (~**L8400-8460**, `genPrompt` L8324) injects
  `consultProfile` + the field list and defines the `[PROFILE]` contract.
- Profile chips/tags rendered from `consultProfile` (L8240-8261): goal, days, age,
  experience, equipment, injuries, timePerSession.
- **Captures today:** goal, days, age, experience, equipment, injuries (free text),
  timePerSession, preferences — all **AI free-text**, not enums.

### B. Assessment workout + strength profiling — capacity anchors
- `assessmentExercises = {…}` (**L8466**), `assessmentExerciseList = []` (L8543),
  `startAssessment()` (**L8545**), `startAssessmentDirect()` (**L8774**, the Plan-tab
  "💪 Fitness Assessment" entry, button L1394).
- On completion, builds `profile[pattern] = {testExercise, weight, reps, date,
  equipType}` and **writes `localStorage 'strengthProfile'`** (**L8743**), keyed by
  movement pattern (`h_push, v_push, h_pull, v_pull, squat, hinge`).
- Consumed by `getEstimatedWeight` (**L6377**) → starting weights for unseen lifts.

### C. Niggle / jointLoad system — the live injury safety layer
- `appState.niggleJoints` / `niggleSetAt` (**L3187-3188**) — **ephemeral**: set at
  check-in, expire after 3 days (load backstop L3381) / 48h pre-tick (L3496),
  cleared at session end (L4500/4523).
- Check-in capture: `#checkin-niggle-step` / `#niggle-joint-chips`
  (`data-niggle="neck|shoulder|elbow|wrist|tSpine|lowBack|hip|knee|ankle"`),
  `toggleNiggleChip` (**L3525**) → `confirmNiggles(workAround)` (**L3529**) sets
  `niggleJoints`/`niggleSetAt` (L3536-3537).
- Enforced by `niggleSafe(e)` (**L3928**) inside generation; `getNiggleJoints` (L3874).
- **Joint vocab == the 9-joint `jointLoad` keys** — the new schema's `niggles[].joint`
  must reuse this exact vocab to stay wired.

### D. Equipment
- `appState.equipment` / `customEquipment` (session gear, `setSessionGear`), plus the
  persistent equipment presets/profiles in Settings (`renderEquipmentPresets`).

### E. Storage today — scattered, profiles NOT cloud-synced
| data | where | persistence | cloud? |
|---|---|---|---|
| consult answers | `localStorage 'consultProfile'` | yes | **no** |
| strength caps | `localStorage 'strengthProfile'` | yes | **no** |
| niggles (ephemeral) | `appState.niggleJoints/SetAt` (`nimbleState_v45`) | yes | **no** |
| equipment | `appState.equipment` | yes | **no** |
| cloud blob payload | `saveHistoryToCloud` (**L7921**) | — | exerciseHistory · completedWorkouts · adherence **only** |
| plan | `savePlanToCloud` (L7867), separate row | — | yes |

**Gap:** no single `profile` object; the schema's data is scattered across 4 stores;
goal/experience/equipment are AI free-text (not enums); niggles are ephemeral (no
persistent injury history); **no `sport`/`sportContext`**; profiles don't cloud-sync.

---

## 2. AS-1 — profile schema + storage (SILENT; nothing reads it yet)

Goal: one canonical `profile` object (spec §1), persisted + cloud-synced, assembled
from the existing stores, `source:"default"` fallback. **All edits additive.**

1. **Add the object to `appState`** (after `adherence`, ~**L3189**) — rides existing
   `saveAppState`/`nimbleState_v45`:
   ```js
   profile: { goalPrimary:null, goalSecondary:null, trainingAge:null, yearsTraining:null,
              age:null, sex:'unspecified', equipment:[], daysPerWeek:null, sessionMinutes:null,
              niggles:[], sport:'none', sportContext:null, strengthProfile:null,
              dislikes:[], varietyBias:0.5, source:'default', updatedAt:null }
   ```
2. **`buildProfile()` assembler** (new fn) — maps the existing stores into the schema
   with small normalizers (`mapGoal`, `mapExperience→trainingAge`, `mapEquipment`):
   reads `consultProfile` (goal/age/experience/equipment/days/timePerSession),
   `localStorage 'strengthProfile'`, `appState.equipment`, `appState.niggleJoints`
   (→ `niggles:[{joint,status:'current'}]`). `source='assessment'` if `consultProfile`
   non-empty else `'default'`; stamp `updatedAt`. Writes `appState.profile` + `saveAppState()`.
3. **Cloud blob** — add `profile: appState.profile` to the payload (**L7921**, +1 line)
   and restore in `loadFromCloud` after the adherence block (**L7970-7974**, ~+4 lines,
   newer-`updatedAt`-wins merge). Mirrors the v99 adherence pattern exactly.
4. **Silent:** no consumer reads `appState.profile` yet (that's AS-3). `getProfile()`
   accessor returns it for later wiring.

**Touch count:** appState literal (+1 key), payload (+1), loadFromCloud (+~4),
`buildProfile`/normalizers (+1 block). Zero behaviour change.

---

## 3. AS-2 — wire the intake to emit the schema (EXTEND, not rebuild)

The `[PROFILE]` parser (L8166-8185) already absorbs any emitted key, so AS-2 is
mostly **prompt + field-list + niggle/sport capture**, then `buildProfile()`.

1. **Extend `consultFields`** (L8043): add `'sport'`, `'sportContext'`, `'niggles'`,
   `'goalSecondary'`, `'sex'`. (Parser/persistence handle them with no other change.)
2. **Extend the consult prompt** (~L8400-8460 / `genPrompt` L8324) to run the spec §3
   tiers and emit the schema **enums** (not free text):
   - *Tier 1 (always, ~6 taps):* `goalPrimary` enum, `trainingAge` enum, `equipment`
     enum list, `age` band, `daysPerWeek`, **niggle check**.
   - *Tier 2 (optional):* `sport` enum + its 2-4 `sportContext` sub-Qs (per
     `_spec_sport_overlays.md §1`), `goalSecondary`, `sessionMinutes`, `dislikes`.
   Constraining the AI to the enums removes the free-text→enum normalization burden
   (decision §4.3).
3. **Niggle capture wired to the live system:** reuse the existing
   `#niggle-joint-chips` / `data-niggle` set (same 9-joint vocab) as the Tier-1 injury
   question (or an AI follow-up that emits `niggles:[{joint,status,note}]`). On
   confirm: write persistent `profile.niggles` **and** seed `appState.niggleJoints`
   for the current session so `niggleSafe` honours it (decision §4.1).
4. **Sport question:** a Tier-2 chip (`afl_masters | surfing | none`) + the per-sport
   sub-questions → `consultProfile.sport`/`sportContext` → `profile`.
5. **Emit on completion:** call `buildProfile()` right after the `[PROFILE]` persist
   (L8185) and after generate (L8366 region) so `appState.profile` reflects the intake.
6. **Assessment workout (Tier 3) unchanged** — `strengthProfile` already exists;
   `buildProfile` just points `profile.strengthProfile` at it.

**Touch count:** `consultFields` (+5), prompt strings (extend), reuse existing niggle
chips, one new sport chip block, `buildProfile()` calls. No rebuild of the chat UI.

---

## 4. Product decisions to flag (lock before building)

1. **Persistent niggle ↔ ephemeral check-in.** Profile `niggles` are durable
   (`current`/`history`); `appState.niggleJoints` is ephemeral (3-day expiry). Does a
   `status:"current"` profile niggle **auto-seed** every check-in (safer, but could
   nag), or only prompt a re-confirm? Spec §4 wants a human in the loop for
   serious/acute — recommend: current niggles **pre-tick** the check-in chips (like
   the existing 48h pre-tick L3496), user confirms; never silently hard-filter.
2. **Severity / "see a pro" gate.** Schema has no severity field; spec §4 needs one to
   route acute/sharp pain to caution (not an auto-workaround). Add `niggles[].severity`
   or a `current+sharp` flag? (Capture in AS-2 so AS-3 can gate.) **Decision needed.**
3. **Enum vs free-text normalization.** Existing `consultProfile.goal/experience/
   equipment` are AI free-text. Constrain the AI to schema enums (cleaner) **or** keep
   free-text + a `mapGoal/mapExperience/mapEquipment` layer in `buildProfile`?
   Recommend constrain-the-prompt; keep a fallback map for legacy stored profiles.
4. **Profile store location.** `appState.profile` (one persistence + the v99
   cloud-merge pattern) vs a new `localStorage 'userProfile'` key. Recommend
   `appState.profile`. **Confirm.**
5. **Equipment source of truth.** `profile.equipment[]` from the AI answer vs
   `appState.equipment`/gear vs Settings presets. Recommend derive from the live
   equipment system (normalized), not a separate AI free-text. **Confirm.**
6. **`injuries` (legacy free text) vs structured `niggles[]`.** Replace the old
   `consultProfile.injuries` string with structured `niggles`, or keep both during
   transition? Recommend: emit `niggles`, retain `injuries` as a display note.
7. **Sport capture: AI-inferred vs explicit chip.** A dedicated chip is more reliable
   for a safety-adjacent enum than free conversation. Recommend explicit Tier-2 chip.

---

## 5. Sequence & gates
- **AS-1 first (silent):** ships behind no UI — assemble + store + cloud-sync the
  profile; verify it persists + round-trips through the cloud blob; no behaviour change.
- **AS-2 next (visible intake):** extend `consultFields` + prompt + niggle/sport
  capture → emit schema; verify `appState.profile` fills from a real consultation and
  niggle pre-tick works; assessment workout still writes `strengthProfile`.
- **AS-3 (out of scope here):** wire consumers (program designer/engine/overlays) —
  **gated on `_spec_programming_rules.md` review** (injury + 40-54 modifiers) before it
  changes prescription. Do not let AS-1/AS-2 reach into prescription early.

Each phase is additive and independently shippable; only AS-3 is user-facing prescription.
