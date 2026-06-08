# Spec — Metadata load KEYSTONE (+ taxonomy swap)

**Type:** READ-ONLY analysis / build-ready design. No `index.html` / `exercise-metadata.js` edits, no git. One spec file.
**Why "keystone":** `index.html` has **0 references** to `exercise-metadata.js` / `exerciseMeta`. Until it loads, every metadata consumer is dead. Loading it is the single unblock for **#5 (logMode logging), #24 (cardio type), the taxonomy swap (`_taxonomy_resolution.md`), and the niggle/pain-aware feature** (which reads `alternatives`/`jointLoad`/`aggravates`). See §5.

Built in **two serial phases** so you can test between them:
- **Phase A — silent foundation:** load the file + guarded accessors. Console-verifiable, **zero UI change.**
- **Phase B — visible swap:** focus chips + `generateWorkoutByType` repoint (per `_taxonomy_resolution.md` §5).

Line numbers indicative; fixes by **function + pattern**.

---

## 0. Script topology (verified)

`index.html` has three relevant inline `<script>` blocks:

| block | lines | contents |
|---|---|---|
| config | 12–32 | `BACKEND_URL`, etc. |
| **exercise data** | **1928–3004** | `createEx()` (`:1969`) then `window.allExercises = [ … ]` (`:1986`) closing `]; // END EXERCISE DATA` (`:3003`), `</script>` (`:3004`) |
| **app logic** | **3006–8565** | opens with the fallback `if(typeof window.allExercises === 'undefined')` (`:3008`); all functions live here |

So `window.allExercises` is fully populated when the data block closes at **3004**, before the app-logic block opens at **3006**. That gap is the correct, dependency-safe seam for the metadata.

`exercise-metadata.js` (now **v1.4.0**, 177 exercises) sits in the repo root **next to `index.html`** (relative `src` resolves on GitHub Pages). Its trailing self-check IIFE (`exercise-metadata.js:~2539`) reads `window.allExercises` and `console.error`s on any name mismatch / out-of-vocab enum — so loading it **after** the data block gives a free integrity check (see Phase A tests). The app already loads external scripts (chart.js `:9`, supabase `:11`), so a local `<script src>` is consistent and CSP-safe.

---

## PHASE A — silent foundation (no UI change)

### A1. Insert the metadata `<script>` tag

**Exact insertion point: a new line at `:3005`**, between the data block's `</script>` (`:3004`) and the app-logic `<script>` (`:3006`):

```html
</script>            <!-- :3004  END EXERCISE DATA block -->
<script src="exercise-metadata.js"></script>   <!-- NEW :3005 — defines window.exerciseMeta -->
<script>             <!-- :3006  app logic begins -->
```

Why here (not elsewhere):
- **After** `:3004` → `window.allExercises` exists, so the metadata self-check validates instead of early-returning.
- **Before** `:3006` → `window.exerciseMeta` is defined before any app function runs, so the Phase-B filters and the #5/#24 consumers can rely on it at call time.
- It is a **separate external tag**, not inlined — keeps the 1,760-line data file out of `index.html` and lets it be cached/edited independently.

**Deploy note:** `exercise-metadata.js` must ship alongside `index.html` (already in repo root). If the app is ever bundled/inlined, this tag becomes an inline block — flag for whoever owns deploy.

### A2. Guarded accessors (app-logic block, near `getExerciseMedia` `:5580`)

Add small, null-safe readers so **no caller ever touches `window.exerciseMeta` directly** and a missing file / missing field degrades gracefully (returns a safe default, never throws):

```
function getExerciseMeta(name) {
    return (window.exerciseMeta && window.exerciseMeta[name]) || null;
}
function getBucket(name) {            // focus axis — Phase B, #24
    var m = getExerciseMeta(name);
    return (m && m.bucket) || 'strength';     // safe default: treat unknown as strength
}
function getEquipmentNorm(name) {     // equipment axis — _spec_equipment_buckets
    var m = getExerciseMeta(name);
    return (m && m.equipmentNorm) || null;
}
function getLogMode(name) {           // #5 set-logging
    var m = getExerciseMeta(name);
    return (m && m.logMode) || 'weight_reps';  // safe default: current behaviour
}
function getAlternatives(name) {      // niggle / pain-swap feature
    var m = getExerciseMeta(name);
    return (m && Array.isArray(m.alternatives)) ? m.alternatives : [];
}

// ── v1.4.0 selection-engine accessors (T3's three new fields, all 177 covered) ──
function getMovementPattern(name) {   // enum of 14 (see below); primary pattern only
    var m = getExerciseMeta(name);
    if (m && m.movementPattern) return m.movementPattern;     // v1.4.0 field — the canonical source
    // fallback ONLY if the field is absent: the legacy assessment pattern getPatternLabel renders.
    // ⚠ different vocabulary (6 codes: h_push/v_push/…), so callers must not assume the 14-enum here.
    var ae = (typeof assessmentExerciseList !== 'undefined' && assessmentExerciseList)
        ? assessmentExerciseList.find(function (a) { return a.name === name; }) : null;
    return ae ? ae.pattern : null;    // else null — never a guessed pattern
}
function getLaterality(name) {        // 'bilateral' | 'unilateral' | 'alternating'
    var m = getExerciseMeta(name);
    return (m && m.laterality) || 'bilateral';   // safe default on miss
}
function getCompound(name) {          // boolean; canonical derivation is T3's
    var m = getExerciseMeta(name);
    return (m && typeof m.compound === 'boolean') ? m.compound : false;  // default false
}
```

**`getMovementPattern` enum (14, `exercise-metadata.js:33-41`):** `push-horizontal, push-vertical, pull-horizontal, pull-vertical, squat, hinge, lunge, carry, rotation, anti-rotation, anti-extension, isolation, mobility, locomotion`. One **primary** value per exercise (the dominant pattern, not every pattern present); all 177 populated (0 missing).

**`getCompound` default note:** the canonical rule is **T3's** — `compound = true` when ≥2 of the 9 joints carry `jointLoad ≥ 1` (`exercise-metadata.js:47-50`), derived strictly from the numbers. The accessor only *reads* the stored boolean and falls back to `false` when absent; it does not recompute. (`jointLoad` itself stays T3-owned.)

Design rules:
- **Defaults preserve today's behaviour:** `getLogMode` → `'weight_reps'` (current UI), `getBucket` → `'strength'`. So if the file fails to load, the app still runs exactly as now — Phase A is genuinely silent.
- **One accessor per field consumed**; callers in #5/#24/Phase B/niggle use these, never `exerciseMeta[...]` inline.
- **`jointLoad`/`strainScore`/`aggravates` accessors are T3's** — not specced here; this keystone only adds the category/logging/alternatives readers. If T3 wants its own `getJointLoad`, it slots beside these.

**Update (v1.4.0) — `movementPattern` now exists, so `getMovementPattern` is in.** The earlier draft declined to invent this accessor because v1.2.0 had no such field. T3's v1.4.0 adds `movementPattern` (the 14-enum above), `laterality`, and `compound` to **all 177**, so the three accessors are now specced above. Note the **two pattern vocabularies are different**: the metadata's 14-value enum (`push-horizontal`, `hinge`, …) is the canonical one `getMovementPattern` returns; the legacy assessment layer (`assessmentExercises[].pattern` / `strengthRatios` `:7614+`, rendered by `getPatternLabel()` `:7813`) uses a 6-code enum (`h_push`, `v_push`, …) and is used **only** as the absent-field fallback. Because all 177 are populated, that fallback effectively never fires today — it is belt-and-suspenders, and any caller relying on it must handle the 6-code vocabulary, not the 14-enum.

### A3. Phase-A device / console test checklist (no UI should change)
1. Load app → DevTools console: **no** `[exerciseMeta]` errors (self-check clean ⇒ names + enums match `allExercises`).
2. `Object.keys(window.exerciseMeta).length` → **177**.
3. `getBucket('Burpees')` → `'cardio'`; `getBucket('Cable Chest Press')` → `'strength'`; `getEquipmentNorm('Goblet Squat')` → `'dumbbell'`; `getLogMode('Plank')` → `'time'`.
4. `getExerciseMeta('NoSuchExercise')` → `null`; `getBucket('NoSuchExercise')` → `'strength'` (fallback, no throw); `getAlternatives('NoSuchExercise')` → `[]`.
4a. **v1.4.0 accessors:** `getMovementPattern('Cable Chest Press')` → `'push-horizontal'`; `getLaterality('Single Arm Cable Chest Press')` → `'unilateral'`; `getCompound('Cable Chest Press')` → `true`. Miss-defaults: `getMovementPattern('NoSuchExercise')` → `null`, `getLaterality('NoSuchExercise')` → `'bilateral'`, `getCompound('NoSuchExercise')` → `false` (all no-throw).
5. Temporarily rename the `src` to a bad path → app still loads, no crash, accessors return defaults (proves graceful degradation). Restore.
6. **UI unchanged:** Builder chips, Quick Start, Encyclopedia all look/behave exactly as before (Phase A adds no visible feature).

**Gate:** do not start Phase B until 1–6 pass. Phase A is the foundation #5, #24, taxonomy, and niggle all stand on.

---

## PHASE B — visible taxonomy swap (rides on Phase A)

Implements `_taxonomy_resolution.md` §5. All membership now reads `getBucket(name)` instead of `ex.cat`/`ex.type`.

### B1. Builder focus chips — replace the "40+ Friendly" row
- **Remove** the 4 chips at `index.html:1809-1812` (Mobility / Nimble / Calisthenics / Plyometric).
- **Add** 4 focus chips calling the existing `filterBuilder()` toggler:
  ```html
  <div class="chip" onclick="filterBuilder('Strength')">💪 Strength</div>
  <div class="chip" onclick="filterBuilder('Power')">⚡ Power</div>
  <div class="chip" onclick="filterBuilder('Resilience')">🧘 Resilience</div>
  <div class="chip" onclick="filterBuilder('Cardio')">❤️ Cardio</div>
  ```
- **`renderBuilderExerciseList()` (`:5048-5070`):** change the `styles` group from `['Mobility','Nimble','Calisthenics','Plyo']` to `['Strength','Power','Resilience','Cardio']`, and change the matcher from `ex.cat.includes(s) || ex.type === s` to **`getBucket(ex.name).toLowerCase() === s.toLowerCase()`**. The `filterBuilder()` state machine (`:4987`) is generic — no change.

### B2. Encyclopedia — mirror the same swap
- Replace chips at `:1638-1641` with the same 4 focus chips (calling `filterEncyclopedia('Strength'|…)`).
- Update `filterEncyclopedia` membership to read `getBucket(name)` for the focus chips (keep muscle/equipment chips as-is).

### B2a. FLAG — T2's incoming 7-move pack touches the category axis (post-keystone)
T2's pending pack adds **7 exercises** introducing a **new `Neck` muscle-group `cat`** and **two new `rehabCategory` values: `neck-prehab`, `elbow-prehab`** (neither is in v1.4.0 yet — current `rehabCategory` set is shoulder/hip/adductor/spine/core/hip-mobility/movement-prep/ankle/knee/wrist). When that pack integrates (**after** this keystone), the category layer must account for them:
- **Muscle-group axis:** the Builder muscle row (`:5046` `['Chest','Back','Legs','Shoulders','Arms']`) and any muscle-split logic will **not** surface "Neck" until `Neck` is added to that list (and to the Encyclopedia muscle chips `:1621-1625`). Decide whether Neck is its own chip or folds under an existing group.
- **rehabCategory axis:** any filter/derivation keyed on `rehabCategory` (the niggle/prehab feature; and the bucket rule already maps `rehabCategory != null → resilience`) must treat `neck-prehab`/`elbow-prehab` as valid — confirm they fall to **Resilience** like the other prehab tags, and that the metadata self-check enum (if it validates `rehabCategory`) is extended. **No keystone change** — these are integration tasks for whoever lands T2's pack; flagged here so the cat/rehab axis isn't silently under-counting the 7 new moves.

### B3. `generateWorkoutByType` repoint (`:3515-3531`)
- `push` / `pull` / `legs` / `full` — **unchanged** (muscle split on `ex.cat`, `:3517-3521`).
- **Replace** the `nimble` branch (`:3520`, `ex.cat.includes('Nimble') || ex.type === 'Mobility'`) with:
  ```
  if (type === 'resilience') return getBucket(ex.name) === 'resilience';
  ```
  and **rename** the Quick Start chip "Nimble" (`:1219`) → **"Mobility"** (or "Recovery"), `onclick="quickStartWorkout('resilience')"`. Collapses the 25-vs-48 "Nimble" contradiction (`_taxonomy_resolution.md` §3.1).
- **Cardio branch (#24)** and **logMode logging (#5)** also consume Phase A but are specced separately (`_spec_cardio_workout_type.md`, and #5). Do not duplicate here; they slot in once their own specs build.
- Keep a safe fallback: if `window.exerciseMeta` is absent, bucket branches yield `getBucket → 'strength'` default — so a metadata load failure produces a strength circuit, not an empty one.

### B4. Phase-B device test checklist
1. Builder focus chips render (Strength/Power/Resilience/Cardio); old Mobility/Nimble/Calisthenics/Plyometric gone.
2. Selecting **Strength** → 110 results; **Power** → 10; **Resilience** → 40; **Cardio** → 17 (v1.4.0/177 bucket counts; re-confirm against the file at build time — they shift as T3/T2 packs land).
3. **Power shows all 10** (incl. Jump Squat, Box Jump — the explosive moves the old "Plyometric"=4 chip used to hide).
4. Focus × muscle × equipment multi-select intersect correctly (e.g. Resilience + Legs; Strength + Bodyweight).
5. Quick Start "Mobility/Recovery" chip → builds from the resilience pool (joint-friendly), **not** a 48-move union; push/pull/legs/full unchanged from before.
6. Encyclopedia mirrors the same focus chips + counts.
7. Regression: a normal Push/Pull/Legs/Full Quick Start still generates as before; sessions log normally.

---

## 5. Flag — Phase A is the gate for four workstreams

Loading the metadata (Phase A) is the **single prerequisite** for all of these; none can build until A passes:

| Workstream | Needs from Phase A | Spec |
|---|---|---|
| **Taxonomy swap (Phase B)** | `getBucket` | this doc §B / `_taxonomy_resolution.md` |
| **#24 Cardio as a type** | `getBucket` + cardio branch | `_spec_cardio_workout_type.md` |
| **#5 logMode logging** | `getLogMode` driving the set input | (its own spec) |
| **Niggle / pain-aware swap** | `getAlternatives` + T3's `jointLoad`/`aggravates` | (its own spec) |

Build order: **Phase A → (then independently) Phase B, #5, #24, niggle.** Phase A must be merged and verified first; the rest can parallelise behind it.

---

## 6. Summary

- **Keystone:** add `<script src="exercise-metadata.js"></script>` (v1.4.0, 177 moves) at **`:3005`** (between the data block `</script>` `:3004` and app-logic `<script>` `:3006`) + null-safe accessors near `:5580`. Defaults preserve today's behaviour ⇒ Phase A is silent and console-verifiable.
- **v1.4.0 accessors now included:** `getMovementPattern` (14-enum; `getPatternLabel` `:7813` is only the absent-field fallback, different 6-code vocabulary), `getLaterality` (default `'bilateral'`), `getCompound` (default `false`; canonical rule is T3's ≥2-joints-at-load).
- **Phase B** swaps Builder + Encyclopedia "40+ Friendly" chips for 4 focus chips and repoints `generateWorkoutByType` (`nimble→resilience`; push/pull/legs/full unchanged), all reading `getBucket`. **Flagged (B2a):** T2's incoming 7-move pack adds a `Neck` cat + `neck-prehab`/`elbow-prehab` rehabCategories the cat/rehab axis must account for post-keystone.
- **Phase A gates #5, #24, the taxonomy, and the niggle feature** — merge and verify it first.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 18:32 AEST (08:32 UTC). Read-only: no edits, no git.*
*Amended — T5, terminal pts/T5, 2026-06-08 18:50 AEST (08:50 UTC): added v1.4.0 accessors (getMovementPattern/getLaterality/getCompound); flagged T2's Neck/rehabCategory pack for the Phase B cat axis; refreshed counts to 177. Read-only: no edits, no git.*
