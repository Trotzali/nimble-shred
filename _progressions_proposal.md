# Regressions / Progressions ladder — REVIEW proposal (derived)

**Terminal:** T2 (READ-ONLY — `exercise-metadata.js` & `index.html` untouched, no git). Additive; **propose only**, T1 applies later.
**Input:** `exercise-metadata.js` v1.6.0 (202 entries) + `_media_order_gymvisual.md` (name↔slug). Difficulty grouped from existing fields (`movementPattern`, `equipmentNorm`, `strainScore`, `laterality`, `musclesTargeted`); ladder *ordering* authored by movement-skill knowledge, **using only slugs already in the set** — no exercise invented.
**Output:** `_progressions_patch.json` — `slug → { regressions[], progressions[] }` (values are slugs).

> **Key space:** keyed by **slug**, and regressions/progressions are **slugs** — the whole field stays in one id-space (the brief said "use slugs"). T1 maps slug→entry-name via the order doc, as it did for `_synergist_patch.json`.

## Coverage
| metric | value |
|---|--:|
| entries | 202 |
| **laddered (≥1 regression or progression)** | **144** |
| flagged (no in-set variant — left `[]`/`[]`) | 58 |
| chains authored | 34 |
| patch self-check | all refs resolve · **every link reciprocal** (A→prog B ⟺ B→reg A) |

---

## How it was derived
Each family is an ordered set of **rungs** (easiest→hardest); a slug's `regressions` = the rung below, `progressions` = the rung above. **Unioned across chains**, so a node on two ladders gets both (e.g. `bodyweight-squat` → `goblet-squat` *and* `pop-squat`). Chains **cross movementPattern** where the real skill ladder does (the brief's own example: `incline-push-up ← push-up ← diamond → pike → handstand` spans push-horizontal→push-vertical). Head/tail nodes are legitimately one-sided (e.g. `cable-bicep-curl` has progressions, no regression) and are **not** flagged — only *both-empty* entries are.

### The 34 chains (rungs, easiest → hardest)
**Push / press**
- Bodyweight push skill: `incline-push-up` → `push-up` → [`wide-grip-push-up`,`decline-push-up`] → [`close-grip-push-up`,`diamond-push-up`] → `pike-push-up` → `handstand-hold`
- Dips: `bench-dip` → `dips`
- Loaded chest: `db-floor-press` → [`dumbbell-bench-press`,`dumbbell-incline-press`] → `cable-chest-press` → `single-arm-cable-chest-press`
- Shoulder press: [`dumbbell-shoulder-press`,`cable-overhead-press`] → `arnold-press`

**Pull**
- Vertical: `inverted-row` → `lat-pulldown-standing` → `chin-ups` → `pull-up`
- Horizontal row: `inverted-row` → [`seated-cable-row`,`single-arm-cable-row`,`dumbbell-row`] → `standing-cable-row` → `renegade-row`

**Squat**
- Strength: `horse-stance-hold` → [`bodyweight-squat`,`squat-to-calf-raise`] → [`goblet-squat`,`sumo-squat-db`,`cable-squat`] → [`cable-front-squat`,`cable-zercher-squat`] → `pistol-squat`
- Plyo: `bodyweight-squat` → `pop-squat` → [`box-jump`,`jump-squat`] → `tuck-jumps`

**Lunge**
- Forward/loaded: `lunge-bw` → [`reverse-lunge-to-knee-drive`,`curtsy-lunge`] → [`dumbbell-lunge`,`cable-lunge`,`bulgarian-split-squat`] → `atg-split-squat` → `jumping-lunge`
- Step: `low-step-up-fast` → `step-up` → `eccentric-step-down`
- Lateral: `side-lunge` → `cossack-squat`

**Hinge**
- Bridge: `glute-bridge` → `single-leg-glute-bridge`
- Hip hinge: `good-morning` → [`cable-pull-through`,`cable-rdl`] → `romanian-deadlift-dumbbell` → `single-leg-rdl` → `nordic-curl`

**Core**
- Anti-extension: `dead-bug` → `mcgill-curl-up` → `plank` → `l-sit`
- Anti-rotation: `bird-dog` → `pallof-press` → `side-plank` → `copenhagen-plank`
- Rotation/oblique: `standing-knee-to-elbow` → `bicycle-crunch` → [`russian-twist`,`standing-oblique-twist`] → [`woodchopper-high-to-low`,`woodchopper-low-to-high`]
- Abs iso: `reverse-crunch` → [`toe-touch`,`standing-cable-crunch`,`cable-crunch`] → [`flutter-kicks`,`v-up`,`leg-raise`]
- Extension: `superman` → `swimmers`

**Isolation (only where a real variant ladder exists)**
- Curls: [`cable-bicep-curl`,`dumbbell-curl`,`lying-cable-curl`,`cable-hammer-curl`,`hammer-curl`] → [`concentration-curl`,`bayesian-curl`,`zottman-curl`,`cable-curl-behind-back`]
- Triceps: [`tricep-pushdown-rope`,`cable-kickback`,`tricep-kickback`] → [`tricep-pushdown-bar`,`reverse-grip-pushdown`] → [`skull-crusher`,`overhead-cable-extension`,`cable-french-press`]
- Lateral raise: [`cable-lateral-raise`,`lateral-raise`] → `lu-raise`
- Calf: `calf-raise-bw` → [`cable-calf-raise`,`seated-calf-raise`]
- Chest fly: `dumbbell-fly` → `cable-chest-fly-mid` → [`cable-chest-fly-high`,`cable-chest-fly-low`,`cable-crossover`]

**Locomotion / conditioning**
- Run drills: `march-in-place` → `high-knees` → `a-skips`
- Lateral: `step-touch` → `lateral-shuffle` → [`skater-hops`,`lateral-bounds`]
- Feet/plyo: `fast-feet-shuffle` → `dot-drill` → `pogo-hops`
- `slow-mountain-climber` → `mountain-climbers` · `no-jump-burpee` → `burpees`
- Animal flow: `bear-crawl` → [`crab-walk`,`kick-through`] → `beast-reach`

**Mobility (depth/skill progressions only)**
- Spine: `cat-cow-stretch` → [`thread-the-needle`,`open-book-stretch`,`thoracic-extension`] → `thoracic-bridge`
- Hip depth: `90-90-hip-stretch` → `pigeon-pose` → `deep-squat-hold`
- `couch-stretch` → `worlds-greatest-stretch` · `ankle-alphabet` → `knee-to-wall-ankle-rock` · `terminal-knee-extension` → `reverse-nordic-curl`

---

## Flagged — no in-set variant (58, left `[]`/`[]`, not invented)
Grouped by why. These are **correct** flags, not gaps to fill with fabricated moves.

- **Isolation accessories — load-autoregulated, sibling-only (21):** `cable-pullover-bench`, `straight-arm-pulldown`, `dumbbell-pullover`, `cable-shrugs`, `dumbbell-shrug`, `cable-rear-delt-fly`, `powell-raise`, `cable-front-raise`, `front-raise`, `cable-external-rotation`, `cable-internal-rotation`, `cable-y-raise`, `prone-y-t-w-raise`, `scapular-push-up`, `cable-abductor`, `cable-hip-abduction-standing`, `cable-adductor`, `cable-hip-adduction-standing`, `cable-wrist-curl`, `cable-reverse-wrist-curl`, `tibialis-raise`. *(Difficulty for these is dialled by weight/reps, not by swapping movement — no exercise-ladder exists in-set.)*
- **Mobility / correctives — not difficulty-laddered (16):** `arm-circles`, `shoulder-dislocates`, `wall-slides`, `sleeper-stretch`, `upper-trap-levator-stretch`, `chin-tuck`, `dead-hang`, `frog-stretch`, `childs-pose`, `prone-press-up`, `scorpion-stretch`, `jefferson-curl`, `wrist-rocks`, `wrist-flexor-stretch`, `wrist-extensor-stretch`, `banded-ankle-eversion-inversion`.
- **Rotation / CARs — mobility, not strength ladder (7):** `neck-cars`, `elbow-cars`, `forearm-pronation-supination`, `standing-hip-cars`, `quadruped-thoracic-rotation`, `shadow-boxing`, `cable-side-bend`.
- **Standalone conditioning (4):** `plank-jack`, `jumping-jacks`, `duck-walk`, `inchworm`.
- **Pull/upper-back accessory cluster (4):** `face-pulls`, `high-row-rope`, `cable-row-wide-grip`, `cable-upright-row`.
- **Hinge glute-iso siblings (2):** `cable-kickback-glute`, `cable-donkey-kick`.
- **Carry / grip (2):** `farmers-walk`, `plate-pinch`.
- **Other (2):** `svend-press` (isometric chest), `reverse-plank` (posterior anti-extension).

### ⚠ Borderline flags — a reviewer *could* hand-link these (I declined, to keep precision over invention)
Each has a plausible cross-pattern neighbour already in the set, but the movement isn't the *same* enough to assert automatically:
- `plank-jack` → regression `plank` (different pattern: anti-extension vs locomotion).
- `jefferson-curl` → regression `toe-touch` (loaded spinal-flexion progression).
- `svend-press` → progression `db-floor-press` (easiest loaded chest).
- `farmers-walk` → regression `plate-pinch` (lighter grip demand; but adds legs/traps).
- `reverse-plank` → regression `glute-bridge` (posterior chain).
- `cable-upright-row` → could sibling onto the lateral-raise delt ladder.
- `face-pulls`/`high-row-rope`/`cable-row-wide-grip` → could attach as a light rung under `seated-cable-row`.

If you want these wired, say so and I'll add the explicit links in a v2 patch — kept out of v1 so every shipped link is high-confidence.

---

## Apply notes (T1)
- Additive fields `regressions` / `progressions` (slugs) on each entry; flagged entries get `[]`/`[]` — same additive pattern as `synergists` (v1.6.0).
- Links are reciprocal in the patch; if the self-check is extended, it can assert `B ∈ A.progressions ⟺ A ∈ B.regressions` and that every slug resolves.

---

**Sign-off:** T2 — 2026-06-15 10:17
