# Pre-Merge Validation — three packs + live metadata v1.4.0

**Author:** T2 (read-only validation terminal)
**Purpose:** final cross-pack consistency gate before T3 merges the 7 gapfill + 18 rehab rows into `exercise-metadata.js` and T1 lands all 39 defs in `index.html` (163 → 202).
**Read-only:** no edits to any project file, no git. Validation ran via a throwaway Node script in the OS temp dir (loaded the live files, wrote nothing to the project, removed itself).

## Method (not eyeballed — loaded the actual files)
- **live 163** — `createEx("…")` names regex-extracted from `index.html`.
- **cardio 14 / gapfill 7 / rehab 18** — the three pack files `eval`'d via a `window` shim → their exported arrays.
- **metadata 177** — `exercise-metadata.js` `eval`'d in an isolated scope → `window.exerciseMeta` keys (self-check IIFE no-ops without `window.allExercises`).
- **the 39 rows under test** — cardio from the **live `exercise-metadata.js`** (already v1.4.0), gapfill from `_mobility_gapfill_meta.md`, rehab from `_rehab_mobility_meta.md`.
- Canonical enums taken from the `exercise-metadata.js` v1.4.0 header: **14 movementPatterns**, 3 lateralities, 12 rehabCategories + `null`.

---

## CHECK 1 — Name collisions → **PASS**

| assertion | result |
|---|---|
| 39 new defs all distinct (no internal dup across cardio∪gapfill∪rehab) | ✅ `Set(39).size === 39`, dups: none |
| 39 new ∩ 163 live = ∅ | ✅ none |
| 163 live internally unique | ✅ no self-dups |
| metadata keys == live ∪ cardio (= 177) | ✅ 177 |
| gapfill/rehab names NOT yet in metadata (expected — rows unmerged) | ✅ `[]` |

Zero duplicates anywhere across the 39 new defs + 163 live + 177 metadata keys. **No fix needed.**

## CHECK 2 — Alternatives graph → **PASS**

- **73 alternatives** across the 39 rows; **all 73 resolve** to the 202-name build universe (163 live ∪ 14 cardio ∪ 7 gapfill ∪ 18 rehab). **0 unresolved.**
- **Cross-pack dependencies: NONE.** Every alternative points to either the **live DB** or its **own pack** — no rehab→gapfill, gapfill→cardio, etc. (The earlier rehab-pack draft's references to `Terminal Knee Extension` were swapped out for live-DB names during authoring; confirmed gone.)
- **Consequence:** each pack's alternatives are self-satisfied by live + own pack, so the alternatives graph imposes **no inter-pack landing-order constraint** (stronger than the "flag cross-pack deps" requirement — there are none to flag).

**No fix needed.**

## CHECK 3 — Enum compliance + derived fields (all 39 rows) → **PASS**

| check | result |
|---|---|
| all 12 v1.4.0 fields present per row | ✅ none missing |
| `movementPattern` ∈ 14-pattern hyphenated enum | ✅ 0 bad |
| `laterality` ∈ {bilateral, unilateral, alternating} | ✅ 0 bad |
| `rehabCategory` ∈ 12 values + `null` (incl. neck-/elbow-prehab) | ✅ 0 bad |
| `compound` == canonical re-derivation `(#joints load ≥1) ≥ 2` | ✅ 0 mismatch |
| *(bonus)* `strainScore` == `min(10, Σ jointLoad)` | ✅ 0 mismatch |
| *(bonus)* `aggravates` == joints with load ≥ 2 (key order) | ✅ 0 mismatch |

Validated across **all 39** — including the 14 cardio rows read from the live metadata file. Every `movementPattern` is hyphenated-canonical (no camelCase `core`/`isometric`/`plyometric` leaked in); every `compound` matches the strict re-derivation the self-check will run. **No fix needed.**

## CHECK 4 — Post-merge tallies T3 will assert → **PASS**

Computed over the merged set (177 metadata + 7 gapfill + 18 rehab):

| metric | computed | T3 asserts | match |
|---|--:|--:|:--:|
| total entries | **202** | 202 | ✅ |
| strength | 110 | 110 | ✅ |
| **resilience** | **65** | 65 | ✅ |
| cardio | 17 | 17 | ✅ |
| power | 10 | 10 | ✅ |

Per-pack bucket contribution (confirms the deltas): **cardio** = {cardio 12, power 2}; **gapfill** = {resilience 7}; **rehab** = {resilience 18}. resilience 40 (baseline) + 7 + 18 = **65** ✓. **No fix needed.**

---

## Verdict: **ALL FOUR CHECKS PASS — packs are merge-ready. No pack fixes required (T2, T3, or T1).**

The three pack files (`cardio-hiit-exercises.js`, `mobility-gapfill-exercises.js`, `rehab-mobility-exercises.js`) and the two meta docs (`_mobility_gapfill_meta.md`, `_rehab_mobility_meta.md`) are internally consistent, collision-free, enum-clean, and reconcile to T3's 202/65/17/10 targets.

**Not validated here (out of scope — they are T3/T1 merge-time actions, not pack defects):**
- T3 must still add the **`rehabCategory` enum guard** (12 values + null) to the self-check and bump the header **v1.4.0 → v1.5.0** (per `_spec_metadata_integration.md` §5). These are file-merge steps; they don't change any pack row.
- T1's `index.html` script-tag + `concat` placement (before the metadata `<script>`) per §6 — load order is the only remaining gotcha, already specced.
- Landing rule reminder: ship each pack's **defs with its rows** (def-without-row = `console.error`; row-without-def = benign `console.info` "staged").

---

**Sign-off:** T2 — 2026-06-11 14:40
