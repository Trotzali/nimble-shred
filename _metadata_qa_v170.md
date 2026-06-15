# Metadata QA — `exercise-metadata.js` v1.7.0 (full-field audit)

**Type:** READ-ONLY data QA. No edits, no git. Prioritised defect list for a future T1 cleanup.
**Scope:** all 202 entries × all fields — `musclesTargeted, synergists, jointLoad, strainScore, aggravates, movementPattern, laterality, compound, antagonistOf, redundantWith, forceVector, axialLoad, logMode, bucket, equipmentNorm, rehabCategory, alternatives`.
**Method:** programmatic check against the file's own self-check vocabularies (`:3955-3966`) + relational rules from the v1.7.0 header (`:31-89`).

---

## 0. Verdict — the substrate is in excellent shape
202 entries; **zero** structural/vocab/derived-field defects. The only real findings are two **synergist data-hygiene** issues (same root cause) and one **advisory** on antagonist cross-talk. Nothing blocks consumption; the cleanup is polish.

### Clean (no action) — verified 0 defects each
| Check | Result |
|---|---|
| `musclesTargeted` empty | **0** (all populated) |
| `forceVector` empty / off-vocab | **0** (vocab `{vertical 104, horizontal 53, rotational 20, axial 17, lateral 8}`) |
| `axialLoad` non-boolean | **0** (`true` 35 / `false` 167) |
| Vocab violations (muscles / synergists / antagonistOf / movementPattern / forceVector) | **0** |
| `compound` ↔ jointLoad (true ⇒ ≥2 joints loaded) | **0** mismatches |
| `strainScore` = min(10, Σ jointLoad) | **0** errors |
| `aggravates` = joints ≥2 | **0** errors |
| `jointLoad` complete 9-joint 0–3 | **0** errors |
| `antagonistOf` includes own primary mover | **0** (no self-opposition) |
| `redundantWith` resolvable | **0** dangling |
| `redundantWith` symmetric (A↔B) | **0** asymmetries |
| `redundantWith` meets stated rule (same `movementPattern` AND Jaccard(muscles)≥0.67) | **0** violations |
| `forceVector` ↔ `movementPattern` (push/pull h-v, rotation) | **0** mismatches |
| Canonical antagonist pairs reciprocate (chest↔lats/rhomboids, biceps↔triceps, quads↔hamstrings, hipFlexors↔glutes, abs↔lowerBack, frontDelts↔rearDelts, abductors↔adductors, tibialis↔calves) | **9/9 OK** |

---

## 1. DEFECTS — prioritised

### P2 · MEDIUM — `synergists` duplicate `musclesTargeted` (43 entries / 21%)
**Issue:** `synergists` is specified as *secondary* movers distinct from primary (`:53`), but 43 entries list a muscle that is already in `musclesTargeted`. Root cause: v1.6.0 "merged 28 OK extra-primary additions into `musclesTargeted`" (`:25-29`) but did **not** remove them from `synergists` → double-listing. Any consumer summing primary+synergist (volume/landmark math) double-counts those muscles.
**Fix:** for each entry, `synergists = synergists − musclesTargeted` (keep the muscle in primary; drop from synergists).

| entry · field · issue (synergist ∩ primary) |
|---|
| Cable Chest Press — `[frontDelts, triceps]` |
| Cable Chest Fly (High) — `[frontDelts]` · Cable Chest Fly (Low) — `[frontDelts]` |
| Single Arm Cable Chest Press — `[obliques]` |
| Cable Pullover (Bench) — `[chest]` · Lat Pulldown (Standing) — `[biceps]` |
| Face Pulls — `[rotatorCuff]` · High Row (Rope) — `[rearDelts]` |
| Cable Overhead Press — `[triceps]` · Cable Upright Row — `[traps]` |
| Cable Hammer Curl — `[biceps]` · Cable Pull-Through — `[hamstrings]` |
| Dumbbell Bench Press — `[frontDelts, triceps]` · Dumbbell Incline Press — `[frontDelts]` |
| Dumbbell Shoulder Press — `[sideDelts, triceps]` · Arnold Press — `[sideDelts]` |
| Dumbbell Row — `[biceps]` · Dumbbell Pullover — `[lats]` |
| Hammer Curl — `[biceps]` · Zottman Curl — `[forearms]` · DB Floor Press — `[triceps]` |
| Pull-ups — `[biceps]` · Chin-ups — `[biceps]` · Dips — `[triceps]` · Pike Push-up — `[triceps]` |
| Shoulder Dislocates — `[rotatorCuff, chest]` · Deep Squat Hold — `[adductors, calves]` |
| Bird Dog — `[glutes]` · Plank Jack — `[frontDelts]` · Diamond Push-up — `[chest]` |
| Sumo Squat (DB) — `[adductors]` · Side Lunge — `[adductors]` · Cossack Squat — `[adductors]` |
| Jump Squat — `[calves]` · Superman — `[glutes]` · Cable Row (Wide Grip) — `[rearDelts]` |
| Dead Hang — `[forearms]` · Inchworm — `[hamstrings, serratus]` · Horse Stance Hold — `[adductors]` |
| Squat to Calf Raise — `[glutes, quads]` · Low Step-Up (Fast) — `[calves]` |
| McGill Curl-Up — `[obliques]` · Prone Press-Up — `[lowerBack]` |

### P2 · MEDIUM — a muscle is BOTH `synergists` and `antagonistOf` on the same entry (17 entries)
**Issue:** logical contradiction — a muscle cannot *assist* and *oppose* the same movement. In every case the muscle is correctly an antagonist (e.g. `chest` opposes a row) but wrongly also a synergist. So the **synergist entry is the error**, almost certainly the same v1.6.0 promotion noise as above. Higher severity than P2-a because it's contradictory, not merely redundant.
**Fix:** remove the contradicting muscle from `synergists` (it is correctly captured in `antagonistOf`). Resolving this also clears most of P2-a for these rows.

| entry — muscle in BOTH synergists & antagonistOf |
|---|
| Seated Cable Row — `chest` · Single Arm Cable Row — `chest` · Inverted Row — `chest` |
| Dumbbell Row — `chest` · Renegade Row — `chest` · Cable Row (Wide Grip) implied |
| Dumbbell Shoulder Press — `chest` · Pike Push-up — `chest` |
| Chin-ups — `chest` · Dips — `lats` · Shoulder Dislocates — `lats` |
| Romanian Deadlift (DB) — `quads` · Inchworm — `quads` · Dead Bug — `glutes` |
| Sumo Squat (DB) — `abductors` · Side Lunge — `abductors` · Cossack Squat — `abductors` · Horse Stance Hold — `abductors` |

### P3 · LOW / ADVISORY (not a defect) — `antagonistOf` muscle-level cross-talk on compound entries
**Observation:** aggregating `antagonistOf` to the muscle level shows 113 non-reciprocated oppositions (e.g. `chest→hamstrings`). These are **artifacts**, not errors: 73 entries have ≥3 primary movers AND an `antagonistOf`, so a compound move (e.g. a burpee targeting chest+quads, antagonistOf hamstrings) attributes its antagonist to *all* its primaries. The **canonical antagonist pairs all reciprocate cleanly** (§0), so the core push-pull model is sound — `antagonistOf` is reliable for single-target/isolation entries and approximate for compounds.
**Recommendation (optional):** if a consumer needs clean antagonist supersets from compound moves, derive `antagonistOf` from the **dominant mover only**, or document that compound `antagonistOf` is approximate. No urgent fix.

---

## 2. The 4 media-outstanding entries — metadata completeness: ALL COMPLETE
(Copenhagen Plank, Terminal Knee Extension, Bayesian Curl, 90/90 Hip Switch — per `_media_slug_manifest.md` §3.)

| entry | pattern · forceVector | muscles / synergists / antagonistOf / redundantWith | status |
|---|---|---|---|
| **Copenhagen Plank** | anti-rotation · rotational | `[adductors]` / `[]` / `[abductors]` / `[]` | complete, valid |
| **Terminal Knee Extension** | mobility · vertical | `[quads]` / `[]` / `[hamstrings]` / `[]` | complete, valid |
| **Bayesian Curl** | isolation · vertical | `[biceps]` / `[]` / `[triceps]` / `[Cable Bicep Curl, Cable Curl (Behind Back), Concentration Curl, Dumbbell Curl, Lying Cable Curl]` | complete, valid |
| **90/90 Hip Switch** | mobility · vertical | `[glutes]` / `[]` / `[hipFlexors]` / `[]` | complete, valid |

None of the four appears in the P2 defect lists — their metadata is clean. The "outstanding" status is **media-only** (GIF source), not metadata. (Note: these are also among the **staged** entries — metadata ahead of `window.allExercises` — which the self-check reports as expected, not an error.)

---

## 3. Summary
- **v1.7.0 substrate is structurally clean** — 0 vocab violations, 0 derived-field errors, 0 jointLoad/compound/strainScore/aggravates inconsistencies, `redundantWith` fully symmetric & rule-conformant, `forceVector`↔pattern consistent, canonical antagonists reciprocate, all 4 media-outstanding entries complete.
- **Two MEDIUM cleanups, one root cause** (v1.6.0 synergist→primary promotion left duplicates): **43 entries** with `synergists ∩ musclesTargeted`, of which **17** are the sharper contradiction `synergists ∩ antagonistOf`. Fix = strip the overlapping/contradicting muscles from `synergists`. Full entry lists in §1.
- **One ADVISORY:** compound entries spread `antagonistOf` across all primaries (113 muscle-pair asymmetries) — cosmetic; core model sound. Optionally derive from the dominant mover.
- Recommend the self-check gain two assertions so this can't regress: `synergists ∩ musclesTargeted === ∅` and `synergists ∩ antagonistOf === ∅`.

---

*Signed off — T5, terminal pts/T5, 2026-06-15 10:17 AEST (00:17 UTC). Read-only: no edits, no git.*
