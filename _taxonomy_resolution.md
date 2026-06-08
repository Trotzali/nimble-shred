# Spec — Category / Filter taxonomy resolution

**Type:** READ-ONLY analysis. No `index.html` / `exercise-metadata.js` edits, no git. One spec file.
**Sources read:** `index.html`, `exercise-metadata.js` (now **v1.2.0** — the `cardio` bucket has landed since earlier specs).
**Boundary:** I own the **category / filter layer** (labels, membership rules, filter UI, `generateWorkoutByType` branches). **Per-joint / per-muscle scoring (`jointLoad`, `strainScore`, `aggravates`) is T3's** — untouched here.

All counts below are computed directly from the two files (163 exercises).

---

## 0. The headline problem

There are **three** independent labelling systems answering the question "what kind of exercise is this?", and they disagree:

| System | Source field | Loaded by app? | Partitions cleanly? |
|---|---|---|---|
| **A. Buckets** | `meta[name].bucket` | **No** — `index.html` never loads `exercise-metadata.js` (0 refs) | ✅ yes (mutually exclusive, sums to 163) |
| **B. "40+ Friendly" style filters** | `ex.type` + `ex.cat` | Yes (Builder + Encyclopedia) | ❌ heavy overlap, spans buckets |
| **C. "Nimble" as a Quick Start TYPE** | `ex.cat` + `ex.type` (union) | Yes (`generateWorkoutByType`) | ❌ different rule from B's "Nimble" |

The same word means different sets in different places ("Nimble" = 25 or 48; "cardio" = 5 or 10). The clean system (A) isn't even wired in.

---

## 1. What each label currently MEANS

### System A — metadata `bucket` (v1.2.0, the clean axis)
Membership computed in `exercise-metadata.js` by the documented priority (`:77-78`): `(Mobility OR rehabCategory) → resilience; else Plyo/jump → power; else steady-state conditioning → cardio; else strength`. Mutually exclusive.

| bucket | count | meaning (`:62-76`) |
|---|---|---|
| strength | 110 | loaded/calisthenic/nimble strength, isometric holds, carries |
| resilience | 40 | `type:Mobility` (36) + prehab (`rehabCategory`) (4) |
| power | 8 | plyo/ballistic jumps & bounds |
| cardio | 5 | steady-state conditioning: Burpees, Jumping Jacks, Mountain Climbers, High Knees, Plank Jack |

**Used by:** nothing in the running app — `index.html` has **zero** references to `exerciseMeta` or `exercise-metadata.js`. Pure substrate.

### System B — Builder "40+ Friendly" style filters (`renderBuilderExerciseList` `index.html:5048-5070`; mirror in `filterEncyclopedia` `:1638-1641`)
Each chip matches `ex.cat.includes(s) || ex.type === s` (`:5069-5070`). Chips at `:1809-1812`:

| chip (label) | rule (as computed) | count | how it lands across buckets |
|---|---|---|---|
| Mobility (36) | `type === 'Mobility'` | **36** | 100% resilience |
| Calisthenics (41) | `type === 'Calisthenics'` | **41** | strength 32 / cardio 5 / power 4 — **spans 3 buckets** |
| Plyometric | `type === 'Plyo'` | **4** | 100% power — but power has **8** (misses 4) |
| Nimble (25) | `cat.includes('Nimble')` | **25** | resilience 17 / strength 4 / power 4 |

### System C — "Nimble" as a Quick Start workout TYPE (`generateWorkoutByType` `index.html:3520`)
`if (type === 'nimble') return ex.cat.includes('Nimble') || ex.type === 'Mobility';` → **48** exercises (Nimble-cat 25 ∪ Mobility-type 36, overlap 13). Triggered by the QS "Nimble" chip (`:1219`) → `quickStartWorkout('nimble')` → `_executeQuickStart` (`:3418`) → this branch.

### Supporting fields (for reference)
- `ex.type` (5): Strength 41, Muscle Build 41, Mobility 36, Calisthenics 41, Plyo 4.
- `ex.cat` is a **mixed bag** of muscle groups **and** pseudo-style tags: Chest 18, Back 27, Shoulders 21, Arms 24, Triceps 9, Biceps 8, Lats 1, Traps 4, Legs 44, Glutes 6, Hamstrings 2, Calves 3, Core 27, FullBody 2 — **plus** `Cardio 10`, `Nimble 25`, `Mobility 2`. Muscle filters (`:5046`, `:3517-3519`) read the muscle members; style filters read the pseudo members.

---

## 2. Overlaps & contradictions (the evidence)

1. **"Nimble" means two different sets.** Builder filter "Nimble" = 25 (`cat`), Quick Start "Nimble" TYPE = 48 (`cat ∪ Mobility-type`). Same label, two membership rules; a user filtering "Nimble" in the Builder and starting a "Nimble" workout see different libraries. **Contradiction.**

2. **"cardio" means two different sets.** `bucket:'cardio'` = 5 (steady-state metcon) vs `cat:'Cardio'` = 10 (includes jumps/agility that the bucket sends to `power`/`resilience`). Same word, two memberships.

3. **"Plyometric" filter under-covers Power by half.** `type:'Plyo'` = 4, but the `power` bucket = 8 — the other 4 (Jump Squat, Skater Hops, Jumping Lunge, Box Jump) are `type:'Calisthenics'`. So the Builder "Plyometric" chip silently hides half the explosive moves.

4. **"Calisthenics" is not a stimulus** — it's a bodyweight-skill modality. Its 41 members split strength 32 / cardio 5 / power 4, and all 41 are `equipmentNorm:'bodyweight'`. It belongs on the **equipment** axis, not as a training-focus filter.

5. **"Mobility" filter ≈ Resilience but not equal.** `type:'Mobility'` = 36, all resilience; but `resilience` = 40 (the extra 4 are `type:'Strength'` prehab moves like Tibialis Raise). The legacy filter misses those 4 prehab items.

6. **Nimble overlaps Mobility.** 13 of the 25 Nimble-cat exercises are also `type:'Mobility'` → the "Mobility" and "Nimble" chips double-count, and 36 of the 48 in the "Nimble" TYPE are exactly the Mobility set.

7. **The clean axis is dormant.** `bucket`/`equipmentNorm` partition cleanly but `index.html` doesn't load the metadata, so every filter today runs on the overlapping `cat`/`type` strings.

**Root cause:** `cat` and `type` each conflate **two orthogonal axes** — *what it trains* (focus/stimulus) and *what it needs* (equipment/modality) — plus muscle group. The buckets already separate focus; `equipmentNorm` already separates equipment. The app just isn't using them.

---

## 3. Proposed consolidated taxonomy — TWO orthogonal axes + muscle split

Collapse the three systems onto the two clean metadata axes. Nothing in the "category layer" needs a third taxonomy.

### Axis 1 — TRAINING FOCUS = `meta[name].bucket` (4 values)
The single source for "what kind of training." Drives both the Builder focus chips and the focus-style Quick Start types.

| Focus chip | bucket | count | subtext |
|---|---|---|---|
| 💪 Strength | strength | 110 | — |
| ⚡ Power | power | 8 | explosive / plyometric |
| 🧘 Resilience | resilience | 40 | mobility & joint health |
| ❤️ Cardio | cardio | 5 | conditioning |

This **replaces all four** "40+ Friendly" chips:
- Mobility → **Resilience** (now also picks up the 4 prehab moves the old chip missed).
- Plyometric → **Power** (now full 8, not 4).
- Calisthenics → moves to **Axis 2** (= Bodyweight equipment).
- Nimble → dissolved (see §3.1).

### Axis 2 — EQUIPMENT = `meta[name].equipmentNorm` (4 values)
Per `_spec_equipment_buckets.md`: Bodyweight 77 / Dumbbell 28 / Cable 56 / Gym-Machines 2. "Calisthenics" (41) is simply the bodyweight slice — represented by the Bodyweight equipment chip, not a focus filter.

### Axis 3 — MUSCLE GROUP (unchanged) = `ex.cat` muscle members
Chest/Back/Legs/Shoulders/Arms/Core etc. Keep for the Builder muscle row (`:5046`) and the Push/Pull/Legs/Full split in `generateWorkoutByType` (`:3517-3521`). **No change** — but see migration note about purging *pseudo*-cats (Nimble/Cardio/Mobility/FullBody) from `cat[]` so it holds muscle groups only.

### 3.1 How "Nimble" resolves
"Nimble" is incoherent as a category (its 25 members span resilience/strength/power) and contradictory as a label (25 vs 48). **Retire "Nimble" as a filter/style label.** Its *intent* — joint-friendly, low-impact, mobility-led sessions — is exactly the **Resilience** bucket.

- **Quick Start:** rename the "Nimble" chip (`:1219`) to **"Mobility"** (or "Recovery"), and point its branch at `bucket === 'resilience'` (40) instead of the `cat ∪ Mobility-type` union (48). The type then means the same thing as the Resilience focus chip — one definition.
- **Brand note:** "Nimble Shred" the *product name* is untouched — this only retires "Nimble" as an **exercise category**.
- If product wants the broader 48-move "active-recovery" feel, define it explicitly as `bucket IN (resilience)` ± a capped cardio slice — but the clean default is `resilience`.

### Resulting surfaces
- **Quick Start types:** Push / Pull / Legs / Full *(muscle split, `cat`)* + **Mobility** *(→ resilience)* + **Cardio** *(→ cardio)*. The two focus-types map 1:1 to buckets.
- **Builder:** Muscle row *(cat)* · Equipment row *(equipmentNorm, 4 chips)* · **Focus row (Strength/Power/Resilience/Cardio, replacing "40+ Friendly")**.
- **One label = one membership rule everywhere.**

---

## 4. Migration note — re-tags / renames implied

**No `bucket` re-tags required** — v1.2.0 already partitions cleanly (strength 110 / resilience 40 / power 8 / cardio 5). The migration is wiring + chip relabels, plus optional `cat[]` hygiene.

| Change | Kind | Where | Required? |
|---|---|---|---|
| **Load `exercise-metadata.js`** in `index.html` (a `<script src>` before the app logic) | wiring | `index.html` `<head>`/pre-script | **Yes — blocking.** Every bucket/equipmentNorm filter depends on it. Today: 0 refs. |
| Rename Quick Start "Nimble" chip → "Mobility"/"Recovery" | rename | `:1219` | Yes |
| Repoint `generateWorkoutByType('nimble')` → `'resilience'` via `bucket` | branch | `:3520` | Yes |
| Replace Builder "40+ Friendly" chips (Mobility/Nimble/Calisthenics/Plyo) with focus chips (Strength/Power/Resilience/Cardio) | chips + filter | `:1809-1812`, `:5048-5070` | Yes |
| Mirror the same chip swap in Encyclopedia | chips + filter | `:1638-1641` | Yes (consistency) |
| Purge pseudo-style tags (`Nimble`, `Cardio`, `Mobility`, `FullBody`) from `ex.cat[]` so `cat` = muscle groups only | **data re-tag** | `createEx(...)` calls in `allExercises` | Optional / follow-up — *touches data; flag, don't bundle.* Bucket already supersedes them, so they can simply stop being read first, then be removed later. |
| Deprecate `ex.type` as a filter source (Strength/Muscle Build/Mobility/Calisthenics/Plyo) | deprecate | filters reading `ex.type` | Yes (focus now from `bucket`) — leave the field as data. |

**Sequencing:** load metadata → swap filters to read `bucket`/`equipmentNorm` → relabel chips/types. The `cat[]` purge is a later data-hygiene pass and can lag (filters stop reading the pseudo-cats first, so they become inert).

---

## 5. Flags — what this changes in code

**Builder chips (`index.html`):**
- **Remove** the 4 "40+ Friendly" chips `:1809-1812` (Mobility/Nimble/Calisthenics/Plyometric).
- **Add** 4 focus chips (Strength/Power/Resilience/Cardio) reading `meta[ex.name].bucket`.
- `filterBuilder()` (`:4987`) state logic is generic and needs no change; `renderBuilderExerciseList()` (`:5048-5070`) `styles` array + matcher must switch from `ex.cat/ex.type` to `meta[name].bucket`.
- Muscle row + Equipment row handled in their own specs; unchanged here except equipment per `_spec_equipment_buckets.md`.

**`generateWorkoutByType` branches (`:3515-3531`):**
- `push/pull/legs/full` — **unchanged** (muscle split on `cat`).
- `nimble` branch `:3520` — **replace** with `resilience`: `if (type === 'resilience') return meta[ex.name]?.bucket === 'resilience';` and rename the chip accordingly.
- **Add** `cardio` branch: `if (type === 'cardio') return meta[ex.name]?.bucket === 'cardio';` (per `_spec_cardio_workout_type.md`).
- All bucket-reading branches require the metadata to be loaded (§4) and a safe fallback if `meta` is absent.

**Out of scope (T3):** `jointLoad`, `strainScore`, `aggravates`, `alternatives`, `rehabCategory`, `logMode` semantics — none are touched by this taxonomy; the category layer only consumes `bucket` (focus) and `equipmentNorm` (equipment).

---

## 6. Summary

- Three labelling systems disagree; the clean one (`bucket`) isn't loaded by the app.
- Collapse to **two orthogonal axes** — **Focus = `bucket`** (Strength/Power/Resilience/Cardio) and **Equipment = `equipmentNorm`** — plus the existing **muscle-group** split. One label, one rule, everywhere.
- **"Nimble" retired as a category:** its intent is the **Resilience** bucket; rename the QS type to "Mobility"/"Recovery" and repoint it at `bucket==='resilience'` (collapses the 25-vs-48 contradiction). Product name unaffected.
- Legacy "40+ Friendly" filters dissolve: Mobility→Resilience, Plyometric→Power (now complete, 8 not 4), Calisthenics→Bodyweight equipment.
- **No bucket re-tags needed** (v1.2.0 is clean). Blocking prerequisite: **`index.html` must load `exercise-metadata.js`** (0 refs today). Optional follow-up: purge pseudo-style tags from `cat[]`.
- Changes land in Builder chips, the two Encyclopedia/Builder filter functions, and three `generateWorkoutByType` branches — all enumerated in §5.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 17:39 AEST (07:39 UTC). Read-only: no edits, no git.*
