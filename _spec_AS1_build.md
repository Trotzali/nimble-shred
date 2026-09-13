# _spec_AS1_build.md — AS-1: silent assessment schema + storage (paste-ready)

**Terminal:** T3 (read-only on `index.html`; spec file only — no edits, no git).
**Inputs:** `_assessment_build_trace.md`, `_spec_assessment.md` (§1 schema, §5 phasing).
**Scope:** AS-1 ONLY — define the profile object, store it, expose null-safe
versioned read/write, and assemble it from the existing stores **without forking
them**. **SILENT: nothing reads it, nothing prescribes.** AS-3 rules-logic (incl.
the injury pro-gate) stays gated behind human review — **not specced here**.

---

## 1. Assessment object shape (fields · types · enums)

Flat shape, mirroring `_spec_assessment.md §1` + the niggle-severity add. All fields
nullable; a fresh profile is the default object (§3).

```js
// ENUMS
// goal:        "hypertrophy" | "strength" | "power" | "fatloss" | "resilience" | "conditioning"
// trainingAge: "novice" | "intermediate" | "advanced"
// sex:         "male" | "female" | "unspecified"
// equipment[]: "cable" | "dumbbell" | "barbell" | "bodyweight" | "machine"
// joint:       "neck" | "shoulder" | "elbow" | "wrist" | "tSpine" | "lowBack" | "hip" | "knee" | "ankle"
//              (== the 9 jointLoad keys — MUST match the niggle/jointLoad vocab)
// status:      "current" | "history"
// severity:    "mild" | "moderate" | "sharp"          // §2 — store only
// sport:       "afl_masters" | "surfing" | "none"

profile = {
  schemaVersion: 1,                 // int — drives migration (§3)
  source:        "default",         // "assessment" | "default" | "manual"
  updatedAt:     null,              // ISO string | null

  // GOALS
  goalPrimary:   null,              // goal enum | null
  goalSecondary: null,              // goal enum | null

  // EXPERIENCE
  trainingAge:   null,              // trainingAge enum | null
  yearsTraining: null,              // int | null

  // DEMOGRAPHICS (40+ modifiers — AS-3)
  age:           null,              // int | null
  sex:           "unspecified",     // sex enum

  // EQUIPMENT (schema enum; see §4 for app equipmentNorm mapping)
  equipment:     [],                // [equipment enum]

  // SCHEDULE
  daysPerWeek:   null,              // int | null
  sessionMinutes:null,              // int | null

  // INJURY / NIGGLE LAYER (liability layer — capture only in AS-1)
  niggles: [],                      // [{ joint, status, severity, note, setAt }]
  //   joint:    joint enum (required)
  //   status:   status enum (default "current")
  //   severity: severity enum | null   // §2 — null when unknown (legacy seed)
  //   note:     string | null
  //   setAt:    ISO string

  // SPORT (from _spec_sport_overlays.md §1)
  sport:         "none",            // sport enum
  sportContext:  null,              // { } per sport | null

  // CAPACITY (mirror of the existing strengthProfile — NOT a second source of truth)
  strengthProfile: null,           // { pattern: {testExercise,weight,reps,date,equipType} } | null

  // PREFERENCES
  dislikes:      [],                // [string]
  varietyBias:   0.5               // 0..1
}
```

No orphan fields — every one has a future consumer named in `_spec_assessment.md §2`.
None are consumed in AS-1.

---

## 2. Niggle severity — `mild | moderate | sharp` (STORE ONLY)

- Each `niggles[]` entry carries `severity ∈ {mild, moderate, sharp}` (or `null` when
  unknown, e.g. legacy-seeded from the severity-less check-in system).
- **AS-1 stores and validates it. No code reads it. No gating.** It is the seed for
  the future **pro-gate** (acute/`sharp` + `current` → "see a professional", route to
  caution instead of an auto-workaround) — that logic is **AS-3, human-reviewed, not
  here**. Writing the field now means the gate can light up later with zero re-capture.

---

## 3. Storage — key + null-safe versioned helpers (paste-ready)

Dedicated, versioned localStorage key (separate from `nimbleState_v45`, so the
profile has its own migration lane and the read/write stays a clean unit).

```js
// ── AS-1 profile store (SILENT) ──────────────────────────────────────────────
var PROFILE_KEY = 'nimbleProfile_v1';
var PROFILE_SCHEMA_VERSION = 1;

function defaultProfile() {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION, source: 'default', updatedAt: null,
    goalPrimary: null, goalSecondary: null, trainingAge: null, yearsTraining: null,
    age: null, sex: 'unspecified', equipment: [], daysPerWeek: null, sessionMinutes: null,
    niggles: [], sport: 'none', sportContext: null, strengthProfile: null,
    dislikes: [], varietyBias: 0.5
  };
}

// null-safe read: missing/corrupt -> default; old version -> migrate; always returns a
// COMPLETE object (any missing key backfilled from default).
function readProfile() {
  var base = defaultProfile();
  try {
    var raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return base;
    var p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return base;
    p = migrateProfile(p);                 // future-proof; v1 is identity
    return Object.assign(base, p);         // backfill any missing keys
  } catch (e) { return base; }
}

// additive merge write: stamps version + updatedAt; never throws.
function writeProfile(patch) {
  try {
    var next = Object.assign(readProfile(), patch || {});
    next.schemaVersion = PROFILE_SCHEMA_VERSION;
    next.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    return next;
  } catch (e) { return readProfile(); }
}

// migration hook — v1 is a no-op; bump PROFILE_SCHEMA_VERSION + add a branch later.
function migrateProfile(p) {
  // if (p.schemaVersion < 2) { /* reshape */ p.schemaVersion = 2; }
  return p;
}

function getProfile() { return readProfile(); }   // silent accessor for later phases
```

- **Null-safe:** every path returns a complete object; a corrupt/absent store yields
  the default; `writeProfile` swallows quota/serialise errors.
- **Versioned:** `schemaVersion` + `migrateProfile` so a future shape change can't
  brick an old store.
- **Cloud (optional, out of AS-1's required scope):** to match `_spec_assessment.md`'s
  "local + cloud blob," a later one-liner can add `profile: getProfile()` to the
  existing `saveHistoryToCloud` payload (`index.html` ~L7921) and restore in
  `loadFromCloud` (~L7948), mirroring the v99 `adherence` pattern. **localStorage is
  the AS-1 source of truth;** cloud is additive and not required for the silent landing.

---

## 4. Wire points vs existing stores — EXTEND, do not fork/duplicate

AS-1 adds **one read-only assembler** that maps the existing stores into the profile.
It **reads** them; it does **not** rewrite, move, or duplicate their writers — existing
consumers keep using the originals unchanged.

```js
// Assemble the profile from what's already captured. NON-destructive: reads the
// legacy stores, writes ONLY nimbleProfile_v1. Call once on load + after an intake
// later wires it (AS-2). Silent.
function syncProfileFromLegacy() {
  var consult  = safeJSON(localStorage.getItem('consultProfile'));   // existing: L8041/L8185
  var strength = safeJSON(localStorage.getItem('strengthProfile'));  // existing: L8743
  var nj = (appState && appState.niggleJoints) || [];                // existing: L3187
  var setAt = (appState && appState.niggleSetAt) || null;

  var patch = {};
  if (consult) {
    if (consult.goal)          patch.goalPrimary   = mapGoal(consult.goal);
    if (consult.experience)    patch.trainingAge   = mapTrainingAge(consult.experience);
    if (consult.age != null)   patch.age           = parseInt(consult.age) || null;
    if (consult.days != null)  patch.daysPerWeek   = parseInt(consult.days) || null;
    if (consult.timePerSession)patch.sessionMinutes= parseInt(consult.timePerSession) || null;
    if (consult.equipment)     patch.equipment     = mapEquipment(consult.equipment);
    patch.source = 'assessment';
  }
  if (strength && Object.keys(strength).length) patch.strengthProfile = strength;  // mirror, not move
  if (nj.length) patch.niggles = nj.map(function (j) {
    return { joint: j, status: 'current', severity: null, note: null, setAt: setAt };  // severity unknown from check-in
  });
  if (Object.keys(patch).length) writeProfile(patch);
  return getProfile();
}

function safeJSON(s){ try { return s ? JSON.parse(s) : null; } catch(e){ return null; } }

// Normalizers — free-text legacy -> schema enum; unknown -> null (AS-2 can constrain
// the AI to emit enums directly and retire most of this).
function mapGoal(t){ t=(t||'').toLowerCase();
  if(/muscle|hypertroph|size|tone/.test(t)) return 'hypertrophy';
  if(/strong|strength|1rm|heav/.test(t))    return 'strength';
  if(/power|explos|speed|athlet/.test(t))   return 'power';
  if(/fat|lean|cut|weight loss|shred/.test(t)) return 'fatloss';
  if(/resilien|injur|mobility|prehab|pain/.test(t)) return 'resilience';
  if(/condition|cardio|endur|fitness/.test(t)) return 'conditioning';
  return null; }
function mapTrainingAge(t){ t=(t||'').toLowerCase();
  if(/nov|begin|new|start/.test(t)) return 'novice';
  if(/adv|expert|elite|year/.test(t)) return 'advanced';
  if(/inter|some|moderate/.test(t)) return 'intermediate';
  return null; }
function mapEquipment(v){ var s=(Array.isArray(v)?v.join(' '):String(v||'')).toLowerCase(); var out=[];
  if(/cable/.test(s)) out.push('cable');
  if(/dumbbell|db/.test(s)) out.push('dumbbell');
  if(/barbell|bar\b/.test(s)) out.push('barbell');
  if(/body|calisthenic|none|home/.test(s)) out.push('bodyweight');
  if(/machine|gym/.test(s)) out.push('machine');
  return out; }
```

**Symbol-level contract (do NOT fork):**
- `consultProfile` / `consultFields` (L8041/L8043) and its `[PROFILE]` persist (L8185)
  — **unchanged.** AS-1 only *reads* `localStorage 'consultProfile'`.
- `strengthProfile` (LS key, written L8743) — remains the source of truth for
  `getEstimatedWeight` (L6377). The profile holds a **mirror copy**, not a replacement.
- Niggle system — `appState.niggleJoints`/`niggleSetAt` (L3187-3188), `confirmNiggles`
  (L3529), `niggleSafe` (L3928) — **unchanged and still authoritative for live session
  safety.** AS-1 only *reads* `niggleJoints` to seed `profile.niggles`; it does not
  write back, so the ephemeral 3-day-expiry behaviour is untouched. (How persistent
  `profile.niggles` re-seeds future check-ins is an **AS-2** decision, not AS-1.)
- Equipment — reads `consult.equipment`; the live `appState.equipment` gear system is
  unchanged.

---

## 5. OUT OF SCOPE for AS-1 (so T1 doesn't drift)

AS-1 is **schema + storage + silent assembly only.** Do **not** build, in this phase:
- **Any prescription / program design** — no sets/reps/load/split decisions read the profile.
- **RIR autoregulation** — none of the readiness/deload logic touches the profile.
- **The injury pro-gate / any injury gating** — `severity` is *stored only*; no
  "see a pro" routing, no auto-modify-around-injury. That's AS-3, human-reviewed.
- **Sport overlay weighting** — `sport`/`sportContext` are stored; Smart Picker/engine
  must not weight on them yet.
- **AS-2 intake changes** — no new consult questions, no prompt/`consultFields` edits,
  no niggle-severity capture UI here (AS-2 captures it; AS-1 just reserves the field).
- **Reading the profile anywhere user-facing** — `getProfile()` exists but has **no
  consumers**; the app behaves identically with or without the store.
- **Forking/duplicating** `consultProfile` / `strengthProfile` / the niggle system —
  AS-1 reads them; it never becomes a second writer.

### Acceptance (silent landing)
`writeProfile({goalPrimary:'strength'})` then `readProfile()` round-trips and merges;
absent/corrupt store → full default; an unknown `severity`/enum is just stored as-is
(no validation throw); `syncProfileFromLegacy()` populates from existing
consult/strength/niggle data without altering them; **no behavioural diff anywhere**.
