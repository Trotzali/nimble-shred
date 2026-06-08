# Spec — Equipment + Training-Bucket filter rework (#15 + #13)

**Type:** READ-ONLY analysis. No `index.html` edits, no git commands. One spec file output.
**Wired to:** `exercise-metadata.js` (v1.1.0) — confirmed present with both `equipmentNorm` and `bucket` on all 163 entries; self-check + enum validation already in the file (`exercise-metadata.js:1732-1759`).

---

## 0. Gate check — PASS

`exercise-metadata.js` header reads `v1.1.0` (`:2`). Every one of the 163 entries carries `equipmentNorm` (∈ `bodyweight | dumbbell | cable | gym/machines`) and `bucket` (∈ `strength | power | resilience`). Cross-walk + bucket priority are documented at `:61-85`. Proceeding.

### Verified distributions (computed directly from the file)
| `equipmentNorm` | count | | `bucket` | count |
|---|---|---|---|---|
| bodyweight | 77 | | strength | 115 |
| cable | 56 | | resilience | 40 |
| dumbbell | 28 | | power | 8 |
| gym/machines | **2** | | | |
| **total** | **163** | | **total** | **163** |

`gym/machines` = exactly **Plate Pinch, Svend Press** (both stored as `equip: "Free Weight"` in `allExercises`). Matches the brief's "barbell/machines near-zero (2)". Buckets partition cleanly (115+40+8 = 163, no overlap) — unlike the current style tags, which overlap heavily (see §3).

---

## 1. Current filter code

### 1a. Quick Start — equipment (Coach page)
- **UI:** 3 single-select gear buttons — `index.html:1207-1211`
  `setSessionGear(this,'gym')` 🏋️ Full Gym / `'dumbbell'` 🔩 Dumbbells / `'bodyweight'` 🤸 Bodyweight
- **State:** `setSessionGear()` `index.html:3392-3396` sets global `sessionGear`.
- **Apply:** `applySessionGear()` `index.html:3398-3409`:
  - `bodyweight` → `customEquipment = ['Bodyweight']`
  - `dumbbell` → `customEquipment = ['Bodyweight','Dumbbell']`
  - `gym` → `equipment='gym'`, `customEquipment=[]` → preset `gym: ['All']` → **all 163**
- **Enforced by:** `filterExercisesByEquipment()` `index.html:3539-3559` (presets `home/hotel/gym`; `'All'` short-circuits; otherwise `available.indexOf(ex.equip) !== -1 || ex.equip === 'Bodyweight'`).

### 1b. Custom Builder — equipment + style (modal)
- **UI chips:** `index.html:1788-1813`
  - *Muscle Group:* All / Chest / Back / Legs / Shoulders / Arms (`:1791-1796`)
  - *Equipment:* **Cables / Dumbbells / Barbells / Bodyweight** (`:1801-1804`)
  - *"40+ Friendly" (styles):* **Mobility (36) / Nimble (25) / Calisthenics (41) / Plyometric** (`:1809-1812`)
- **State + toggle:** `filterBuilder()` `index.html:4987-5034` (multi-select; `'all'` resets).
- **Filter engine:** `renderBuilderExerciseList()` `index.html:5036-5083`. Pattern (`:5045-5074`):
  ```
  muscles  = ['Chest','Back','Legs','Shoulders','Arms']      → ex.cat.includes(m)
  equipment= ['Cable','Dumbbell','Barbell','Bodyweight']     → activeEquip.includes(ex.equip)
  styles   = ['Mobility','Nimble','Calisthenics','Plyo']     → ex.cat.includes(s) || ex.type === s
  result = (muscleMatch) AND (equipMatch) AND (styleMatch), then filterExercisesByEquipment()
  ```

### 1c. Underlying data (`createEx(name, cat[], equip, type, …)`, `index.html:1992+`)
- `ex.equip` distinct values: **Cable 56, Dumbbell 28, Bodyweight 77, Free Weight 2** — **`"Barbell"` = 0 (the value does not exist in the database).**
- `ex.type` distinct values: Strength 41, Muscle Build 41, Mobility 36, Calisthenics 41, Plyo 4.
- `Nimble` is a **`cat`** value (not a `type`); the other three styles are `type` values. So the style row mixes two fields.

---

## 2. #15 — Equipment taxonomy rework (one vocabulary from `equipmentNorm`)

### Problems found
1. **Two vocabularies that don't line up.** Builder = {Cables, Dumbbells, Barbells, Bodyweight}; Quick Start = {Full Gym, Dumbbells, Bodyweight}. Cable is a first-class Builder chip but is folded inside Quick Start's "Full Gym". No shared source of truth.
2. **"Barbells" is a dead chip.** `filterBuilder('Barbell')` filters on `ex.equip === 'Barbell'`, but **no exercise has that value** → always 0 results ("No exercises match…"). The data's only gym-only items are 2 `Free Weight` moves (Plate Pinch, Svend Press), which **no Builder equipment chip can reach** (there is no "Free Weight"/"Gym" chip, and "Barbell" doesn't match them).
3. **Library is effectively a 3-equipment library:** bodyweight (77) / cable (56) / dumbbell (28). Barbell/machines is a rounding error (2).

### Proposed taxonomy — single canonical set = `equipmentNorm`
Drive **both** UIs from `meta[name].equipmentNorm` (4 values), replacing the `ex.equip` string-matching:

| Canonical chip | `equipmentNorm` | count |
|---|---|---|
| 🤸 Bodyweight | `bodyweight` | 77 |
| 🔩 Dumbbell | `dumbbell` | 28 |
| 🔌 Cable | `cable` | 56 |
| 🏋️ Gym / Machines | `gym/machines` | 2 |

- **Quick Start "Full Gym"** = the union **{cable + dumbbell + bodyweight + gym/machines}** = all 163 (preserves today's behaviour where `gym` → `['All']`). I.e. "Full Gym" is the superset, not a 4th peer category.
- **Quick Start "Dumbbells"** = {dumbbell + bodyweight}; **"Bodyweight"** = {bodyweight} — unchanged semantics, now expressed in `equipmentNorm`.
- **Builder** keeps multi-select but over the same 4 canonical chips, so a Builder selection and a Quick Start gear mean the same thing.

### Proposed UI

Quick Start (unchanged shape, now backed by the canonical map):
```
Equipment:  [🏋️ Full Gym]  [🔩 Dumbbells]  [🤸 Bodyweight]
            (= all 4 norms) (DB + BW)        (BW only)
```

Custom Builder equipment row (replaces `:1801-1804`):
```
Equipment:  [🔌 Cable]  [🔩 Dumbbell]  [🤸 Bodyweight]  [🏋️ Gym/Machines (2)]
```
Each chip filters `meta[ex.name].equipmentNorm === chipValue` (OR across selected chips), instead of `activeEquip.includes(ex.equip)`.

### Decisions to make (#15)
- **D1 — Adopt `equipmentNorm` as the single equipment source for both Builder and Quick Start?** (Recommended: yes — kills the two-vocabulary drift.)
- **D2 — The near-empty Barbell/Gym slice (2 exercises). Pick one:**
  - **(a) Rename** Builder "Barbells" → **"Gym/Machines"** mapped to `equipmentNorm:'gym/machines'`, making Plate Pinch + Svend Press reachable for the first time. *(Recommended — cheap, no longer a dead/empty chip.)*
  - **(b) Drop** the chip entirely (2 items isn't worth a filter; they still appear under "All"/Full Gym).
  - Either way the current "Barbells" chip must not survive as-is — it is guaranteed-empty and misleading.
- **D3 — Confirm "Full Gym" = all four norms** (cable + dumbbell + bodyweight + gym/machines). (Recommended: yes.)
- **D4 — Builder multi-select vs Quick Start single-select:** keep the current interaction models (Builder multi, QS single); only the *taxonomy* is unified. Confirm no behaviour change requested here.

---

## 3. #13 — Training buckets (replace the style tags)

### Current state
The "40+ Friendly" style row (`:1809-1812`) exposes **Mobility (36) / Nimble (25) / Calisthenics (41) / Plyometric (4)** — four overlapping tags drawn from two fields (`ex.type` for Mobility/Calisthenics/Plyo, `ex.cat` for Nimble). They sum to >100 because they overlap (a move can be both Nimble and Calisthenics, etc.), so they don't give the user a clean mental model.

### Proposed — 3 buckets from `meta[name].bucket`
Replace the 4 style chips with **3 mutually-exclusive bucket chips**:

| Bucket chip | `bucket` | count | subtext |
|---|---|---|---|
| 💪 Strength | `strength` | 115 | — |
| ⚡ Power | `power` | 8 | — |
| 🧘 Resilience | `resilience` | 40 | **"mobility & joint health"** |

```
Training focus:  [💪 Strength]   [⚡ Power]   [🧘 Resilience]
                                              mobility & joint health
```
Filter: `meta[ex.name].bucket === chipValue` (OR across selected). Clean partition of all 163, no overlap. `power` members (8): Jump Squat, Skater Hops, Jumping Lunge, Box Jump, Lateral Bounds, Dot Drill, Tuck Jumps, A-Skips. `resilience` = all `type:"Mobility"` + every prehab move (header rule, `:61-72`).

### Decision to make (#13) — **FLAG: conditioning / cardio moves**
The metadata header deliberately files "steady-state conditioning" under `strength` (`:62-63`). As a result these **conditioning moves currently sit in the Strength bucket:**

| move | bucket | logMode |
|---|---|---|
| Burpees | strength | reps |
| Jumping Jacks | strength | time |
| Mountain Climbers | strength | time |
| High Knees | strength | time |
| Plank Jack | strength | time |

(For contrast: Dot Drill / A-Skips / Skater Hops are already `power`; Bear Crawl / Crab Walk are `resilience`/movement-prep.)

**Open question for the user:** with only 3 buckets, a user filtering "Strength" gets burpees and jumping jacks mixed in with loaded lifts. Options:
- **(a) Leave as-is** — conditioning stays in Strength (matches the documented design; zero data change). *Simplest.*
- **(b) Add a 4th "Cardio / Conditioning" bucket** for these moves. ⚠️ This requires extending the `bucket` enum in `exercise-metadata.js` (currently fixed to 3 values and enforced by the self-check at `:1741,1749`) and re-tagging the ~5 moves — a **metadata change, out of scope for this read-only spec**; flag for a follow-up build task if chosen.
- **(c) Derive** a soft "Conditioning" filter without touching the enum (e.g. `bucket==='strength' && logMode==='time'` ∪ Burpees) — avoids a schema change but is a heuristic and would also sweep in planks/holds (Plank, Side Plank, L-Sit, Farmers Walk are also `strength`+`time`), so **not recommended** without curation.

Recommendation: **(a)** for the first cut (ship the 3-bucket UI now), revisit **(b)** only if users ask for cardio separation. Either way this is the user's call.

---

## 4. Summary

- **Gate:** PASS — `equipmentNorm` + `bucket` present on all 163 (`exercise-metadata.js` v1.1.0).
- **#15:** Two equipment vocabularies (Builder `Cables/Dumbbells/Barbells/Bodyweight` vs Quick Start `Full Gym/Dumbbells/Bodyweight`) → collapse to one driven by `equipmentNorm` (bodyweight/dumbbell/cable/gym-machines). The **"Barbells" chip matches 0 exercises today** and must be dropped or rebadged "Gym/Machines" (2 items). "Full Gym" = all four norms. Decisions D1–D4.
- **#13:** Replace 4 overlapping style tags (Mobility/Nimble/Calisthenics/Plyo) with 3 clean buckets (Strength 115 / Power 8 / Resilience 40, Resilience subtext "mobility & joint health"). **Flagged decision:** conditioning moves (Burpees, Jumping Jacks, Mountain Climbers, High Knees, Plank Jack) currently live in Strength — leave them, or add a Cardio bucket (needs a metadata enum change, separate build task).
- All current behaviour preserved unless a decision above changes it. No code or metadata modified by this spec.

---

*Signed off — T5, terminal pts/T5, 2026-06-08 16:14 AEST (06:14 UTC). Read-only: no index.html edits, no git commands, no metadata changes.*
