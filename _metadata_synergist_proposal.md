# GymVisual Target + Synergist enrichment — REVIEW proposal

**Terminal:** T2 (read-only on index.html & exercise-metadata.js — *nothing mutated*). Separate-file proposal only; the apply step is gated behind Troy's review.
**Inputs:** `gymvisual_muscle_data_175.csv` (175 rows) · `_media_order_gymvisual.md` (202-row slug↔ID mapping) · `exercise-metadata.js` (v1.4.0, 202 entries, 24-key `musclesTargeted`).
**Join:** CSV `gymvisual_id` → order-doc mapping (entry/slug/ID/status) → metadata entry. The **23 aliases inherit their source's GymVisual data** (4 MERGE share the source ID inline; 19 SWAP resolve through `reuse → <source>`).

## Coverage
| metric | value |
|---|--:|
| metadata entries | 202 |
| **enriched (target and/or synergists proposed)** | **132** |
| gaps (no GymVisual muscle data — left empty, unflagged) | 70 |
| distinct GymVisual muscle terms | 39 |
| terms with **no clean 24-key match** | 0 (none — all mapped) |
| terms mapped **approximately** (⚠ flagged) | 7 |

**Gap breakdown (70):** NO-MATCH 2 · ORDER 53 · MERGE 2 · SWAP 11 · CUSTOM 2.
ORDER gaps = cardio/plyo/yoga/mobility GIFs whose GymVisual catalogue row carries no Target (e.g. Burpees, Jumping Jacks, Bear Crawl, Box Jump, Couch Stretch, Worlds Greatest Stretch). SWAP gaps = aliases whose reuse-source also has no Target. CUSTOM (2) + NO-MATCH (2) = the 4 outstanding. *(The brief's "~53" estimate counted ORDER-only no-target rows; the true all-empty total incl. SWAP-inherited-empty + custom/no-match is 70.)*

**Verdict tally (targetPrimary vs our existing musclesTargeted):** OK 94 · OK\* 28 · DISAGREE 10 · NEW 0.
- **OK** = our musclesTargeted already contains GymVisual's full mapped target.
- **OK\*** = overlap, but GymVisual names an *extra* primary we don't list (candidate addition — see note column).
- **DISAGREE** = zero overlap (review individually — §3).
- **NEW** = our musclesTargeted was empty → **0** (every entry already had muscles; this pass adds **synergists**, which we had none of, + a target cross-check).

---

## 1. Vocab-mapping dictionary (GymVisual term → our 24-key)
GymVisual is granular (fibre/head-level); collapsed to our keys. ⚠ = anatomically approximate, sanity-check at apply.

| GymVisual term | our key | |
|---|---|---|
| `Adductor Brevis` | `adductors` |
| `Adductor Longus` | `adductors` |
| `Adductor Magnus` | `adductors` |
| `Biceps Brachii` | `biceps` |
| `Brachialis` | `biceps` |
| `Brachioradialis` | `forearms` |
| `Deltoid Anterior` | `frontDelts` |
| `Deltoid Lateral` | `sideDelts` |
| `Deltoid Posterior` | `rearDelts` |
| `Erector Spinae` | `lowerBack` |
| `Gastrocnemius` | `calves` |
| `Gluteus Maximus` | `glutes` |
| `Gluteus Medius` | `abductors` |
| `Gracilis` | `adductors` | ⚠ approx
| `Hamstrings` | `hamstrings` |
| `Iliopsoas` | `hipFlexors` |
| `Infraspinatus` | `rotatorCuff` |
| `Latissimus Dorsi` | `lats` |
| `Levator Scapulae` | `traps` | ⚠ approx
| `Obliques` | `obliques` |
| `Pectineous` | `adductors` | ⚠ approx
| `Pectineus` | `adductors` | ⚠ approx
| `Pectoralis Major Clavicular Head` | `chest` |
| `Pectoralis Major Sternal Head` | `chest` |
| `Quadriceps` | `quads` |
| `Rectus Abdominis` | `abs` |
| `Sartorius` | `hipFlexors` | ⚠ approx
| `Serratus Anterior` | `serratus` |
| `Soleus` | `calves` |
| `Sternocleidomastoid` | `neck` |
| `Tensor Fasciae Latae` | `abductors` | ⚠ approx
| `Teres Major` | `lats` | ⚠ approx
| `Teres Minor` | `rotatorCuff` |
| `Tibialis Anterior` | `tibialis` |
| `Trapezius Lower Fibers` | `traps` |
| `Trapezius Middle Fibers` | `traps` |
| `Trapezius Upper Fibers` | `traps` |
| `Triceps Brachii` | `triceps` |
| `Wrist Extensors` | `forearms` |
| `Wrist Flexors` | `forearms` |

**⚠ approximate-mapping rationale (flagged, not forced):**
- `Teres Major` → `lats` (functional lat synergist; no teres key). `Teres Minor`,`Infraspinatus` → `rotatorCuff` (correct).
- `Levator Scapulae` → `traps` (scapular elevator; could be `neck` in cervical contexts e.g. Neck CARs).
- `Tensor Fasciae Latae` → `abductors`; `Gluteus Medius` → `abductors`.
- `Sartorius` → `hipFlexors`; `Iliopsoas` → `hipFlexors` (correct).
- `Pectineus`/`Pectineous`, `Gracilis`, `Adductor (Magnus/Brevis/Longus)` → `adductors`.
No term was left unmatched.

---

## 2. Per-exercise proposal (132 enriched)
`slug` → proposed **synergists** (new field) · GymVisual **target** (mapped) · our **current musclesTargeted** · verdict. `src` = inherited via MERGE/SWAP.

| slug | proposed synergists | GymVisual target | our musclesTargeted | verdict | src/note |
|---|---|---|---|---|---|
| ankle-alphabet | — | calves, tibialis | calves, tibialis | OK | — |
| arm-circles | — | frontDelts, sideDelts, rearDelts | frontDelts, sideDelts, rearDelts, rotatorCuff | OK | — |
| arnold-press | sideDelts, serratus, triceps | frontDelts | frontDelts, sideDelts, rearDelts | OK | — |
| atg-split-squat | adductors, calves | glutes, quads | quads, hipFlexors | OK* | via SWAP 229013 +glutes |
| bench-dip | frontDelts, lats, traps, chest | triceps | triceps | OK | — |
| bird-dog | frontDelts, glutes | lowerBack | abs, glutes, lowerBack | OK | — |
| bodyweight-squat | adductors, calves | glutes, quads | quads, glutes | OK | — |
| bulgarian-split-squat | adductors, calves | glutes, quads | glutes, quads | OK | — |
| cable-bicep-curl | forearms | biceps | biceps | OK | — |
| cable-calf-raise | — | calves | calves | OK | — |
| cable-chest-fly-high | biceps, frontDelts | chest | chest, frontDelts | OK | — |
| cable-chest-fly-low | biceps, frontDelts | chest | chest, frontDelts | OK | — |
| cable-chest-fly-mid | biceps, sideDelts | chest | chest | OK | — |
| cable-chest-press | frontDelts, triceps | chest | chest, triceps, frontDelts | OK | — |
| cable-crossover | frontDelts | chest | chest | OK | — |
| cable-crunch | obliques | abs | abs | OK | — |
| cable-curl-behind-back | forearms | biceps | biceps | OK | via SWAP 015613 |
| cable-donkey-kick | hamstrings | glutes | glutes | OK | — |
| cable-external-rotation | rearDelts | lats, rotatorCuff | rotatorCuff | OK* |  +lats |
| cable-french-press | — | triceps | triceps | OK | via MERGE 019413 |
| cable-front-raise | sideDelts, chest, serratus | frontDelts | frontDelts | OK | — |
| cable-front-squat | adductors, calves | glutes, quads | quads, abs | OK* | via MERGE 334913 +glutes |
| cable-hammer-curl | biceps | forearms | biceps, forearms | OK | — |
| cable-internal-rotation | — | frontDelts, chest | rotatorCuff | DISAGREE | — |
| cable-kickback | — | triceps | triceps | OK | — |
| cable-lateral-raise | frontDelts, serratus | sideDelts | sideDelts | OK | — |
| cable-lunge | — | glutes, quads | quads, glutes | OK | — |
| cable-overhead-press | sideDelts, serratus, triceps | frontDelts | frontDelts, triceps | OK | — |
| cable-pull-through | lowerBack, hamstrings | glutes | glutes, hamstrings | OK | — |
| cable-pullover-bench | traps, chest, triceps | lats | serratus, lats, chest | OK | — |
| cable-rear-delt-fly | sideDelts, rotatorCuff, traps | rearDelts | rearDelts | OK | — |
| cable-reverse-wrist-curl | — | forearms | forearms | OK | — |
| cable-row-wide-grip | biceps, forearms, rearDelts | rotatorCuff, lats, traps | rearDelts, rhomboids | DISAGREE | — |
| cable-shrugs | — | traps | traps | OK | — |
| cable-side-bend | — | obliques | obliques | OK | — |
| cable-squat | adductors, calves | glutes, quads | quads, glutes | OK | — |
| cable-upright-row | biceps, forearms, frontDelts, rotatorCuff, serratus, traps | sideDelts | sideDelts, traps | OK | — |
| cable-wrist-curl | — | forearms | forearms | OK | — |
| cable-y-raise | — | sideDelts | traps, sideDelts | OK | — |
| cable-zercher-squat | adductors, calves | glutes, quads | quads, rhomboids, traps | OK* | via SWAP 334913 +glutes |
| calf-raise-bw | — | calves | calves | OK | — |
| cat-cow-stretch | — | lowerBack, obliques, abs | lowerBack | OK* |  +obliques/abs |
| chin-ups | biceps, forearms, rearDelts, chest, traps | lats | biceps, lats | OK | — |
| close-grip-push-up | frontDelts, chest | triceps | triceps | OK | — |
| concentration-curl | forearms | biceps | biceps | OK | — |
| cossack-squat | adductors, abductors, calves | glutes, quads | adductors, quads | OK* |  +glutes |
| db-floor-press | frontDelts, triceps | chest | triceps, chest | OK | — |
| dead-bug | glutes, quads | abs | abs, hipFlexors | OK | — |
| dead-hang | biceps, forearms | rotatorCuff, lats, traps | lats, forearms | OK* |  +rotatorCuff/traps |
| decline-push-up | frontDelts, triceps | chest | chest | OK | — |
| deep-squat-hold | adductors, calves | glutes, quads | glutes, hipFlexors, adductors, calves | OK* | via SWAP 078713 +quads |
| diamond-push-up | frontDelts, chest | triceps | triceps, chest | OK | — |
| dips | frontDelts, lats, traps, triceps | chest | chest, triceps | OK | — |
| dumbbell-bench-press | frontDelts, triceps | chest | chest, triceps, frontDelts | OK | — |
| dumbbell-curl | forearms | biceps | biceps | OK | — |
| dumbbell-fly | biceps, frontDelts | chest | chest | OK | — |
| dumbbell-incline-press | frontDelts, triceps | chest | chest, frontDelts | OK | — |
| dumbbell-lunge | adductors, calves | glutes, quads | quads, glutes, hamstrings | OK | — |
| dumbbell-pullover | rearDelts, lats, triceps | chest | lats, serratus | DISAGREE | — |
| dumbbell-row | biceps, forearms, rearDelts, chest | rotatorCuff, lats, traps | lats, rhomboids, biceps | OK* |  +rotatorCuff/traps |
| dumbbell-shoulder-press | sideDelts, chest, serratus, triceps | frontDelts | frontDelts, sideDelts, rearDelts, triceps | OK | — |
| dumbbell-shrug | — | traps | traps | OK | — |
| eccentric-step-down | adductors, calves | glutes, quads | quads, glutes | OK | via SWAP 043113 |
| face-pulls | biceps, forearms, sideDelts, rotatorCuff, traps | rearDelts | rearDelts, rotatorCuff | OK | — |
| farmers-walk | — | adductors, calves, glutes, hamstrings, quads | abs, forearms, traps | DISAGREE | — |
| flutter-kicks | hamstrings | glutes | abs | DISAGREE | — |
| frog-stretch | hamstrings | glutes, abductors | adductors, hipFlexors | DISAGREE | — |
| front-raise | sideDelts, chest, serratus | frontDelts | frontDelts | OK | — |
| glute-bridge | hamstrings, quads | glutes | glutes | OK | — |
| goblet-squat | adductors, abductors, calves | glutes, quads | quads, glutes, abs | OK | — |
| good-morning | adductors, glutes | hamstrings | hamstrings, lowerBack | OK | — |
| hammer-curl | biceps | forearms | biceps, forearms | OK | — |
| high-row-rope | biceps, forearms, rearDelts | rotatorCuff, lats, traps | rhomboids, rearDelts | DISAGREE | — |
| horse-stance-hold | adductors, calves, abductors | glutes, quads | quads, adductors | OK* | via SWAP 232213 +glutes |
| inchworm | adductors, glutes, hamstrings, chest, quads, serratus, traps, forearms | frontDelts, obliques, abs, triceps | hamstrings, frontDelts, abs, serratus | OK* |  +obliques/triceps |
| incline-push-up | frontDelts, triceps | chest | chest | OK | — |
| inverted-row | biceps, forearms, rearDelts, chest | rotatorCuff, lats, traps | lats, rhomboids | OK* |  +rotatorCuff/traps |
| jump-squat | adductors, calves | glutes, quads | quads, glutes, calves | OK | — |
| l-sit | — | hipFlexors, quads, abs, abductors, triceps | abs, hipFlexors | OK* |  +quads/abductors/triceps |
| lat-pulldown-standing | biceps, forearms, rearDelts, rotatorCuff, traps | lats | lats, biceps | OK | — |
| lateral-raise | frontDelts, serratus | sideDelts | sideDelts | OK | — |
| leg-raise | adductors, serratus, abductors | hipFlexors | abs, hipFlexors | OK | — |
| low-step-up-fast | adductors, calves | glutes, quads | quads, glutes, calves | OK | — |
| lunge-bw | adductors, calves | glutes, quads | quads, glutes, hamstrings | OK | — |
| lying-cable-curl | forearms | biceps | biceps | OK | — |
| mcgill-curl-up | obliques | abs | abs, obliques | OK | — |
| neck-cars | — | traps, neck | neck, traps | OK | — |
| open-book-stretch | — | frontDelts, obliques, chest, abs | lowerBack, chest, obliques | OK* |  +frontDelts/abs |
| overhead-cable-extension | — | triceps | triceps | OK | — |
| pallof-press | — | obliques | abs | DISAGREE | — |
| pigeon-pose | — | adductors, lowerBack, glutes, abductors, hamstrings, hipFlexors, quads | glutes, hipFlexors | OK* |  +adductors/lowerBack/abductors/hamstrings/quads |
| pike-push-up | chest, serratus, triceps | frontDelts | frontDelts, sideDelts, rearDelts, triceps | OK | — |
| plank | frontDelts, glutes, abductors, obliques, hipFlexors | abs | abs | OK | — |
| plank-jack | frontDelts, glutes, obliques, triceps | abductors, chest | abs, frontDelts, abductors | OK* |  +chest |
| plate-pinch | adductors, glutes, quads, calves | forearms | forearms | OK | — |
| prone-press-up | lowerBack, glutes, hamstrings | abs | lowerBack | DISAGREE | — |
| pull-up | biceps, forearms, rearDelts, rotatorCuff, traps | lats | lats, biceps | OK | — |
| renegade-row | biceps, forearms, rearDelts, chest | rotatorCuff, lats, traps | lats, abs, obliques | OK* |  +rotatorCuff/traps |
| reverse-crunch | obliques | abs | abs | OK | — |
| reverse-grip-pushdown | — | triceps | triceps | OK | — |
| reverse-plank | rearDelts, hamstrings, lats, obliques, triceps | glutes, abs | lowerBack, glutes | OK* |  +abs |
| romanian-deadlift-dumbbell | quads, calves | glutes, hamstrings | hamstrings, glutes, lowerBack | OK | — |
| russian-twist | hipFlexors | obliques | obliques | OK | — |
| seated-cable-row | biceps, forearms, rearDelts, chest | rotatorCuff, lats, traps | rhomboids, traps, lats | OK* |  +rotatorCuff |
| seated-calf-raise | — | calves | calves | OK | — |
| shoulder-dislocates | rotatorCuff, lats, chest, serratus, traps | frontDelts, sideDelts, rearDelts | frontDelts, rearDelts, rotatorCuff, chest | OK* |  +sideDelts |
| side-lunge | adductors, abductors, calves | glutes, quads | adductors, quads | OK* |  +glutes |
| side-plank | — | obliques | obliques, lowerBack | OK | — |
| single-arm-cable-chest-press | frontDelts, obliques, abductors | chest | chest, obliques, triceps | OK | — |
| single-arm-cable-row | biceps, forearms, rearDelts, chest | rotatorCuff, lats, traps | lats, obliques | OK* |  +rotatorCuff/traps |
| skull-crusher | — | triceps | triceps | OK | — |
| sleeper-stretch | — | frontDelts, chest | rotatorCuff, rearDelts | DISAGREE | via SWAP 508813 |
| squat-to-calf-raise | glutes, quads | calves | quads, glutes, calves | OK | — |
| standing-cable-crunch | obliques | abs | abs | OK | — |
| standing-cable-row | biceps, forearms, rearDelts | rotatorCuff, lats, traps | lats, quads, glutes, abs | OK* |  +rotatorCuff/traps |
| standing-hip-cars | — | lowerBack, abductors, hipFlexors, obliques, abs | hipFlexors, glutes, adductors | OK* |  +lowerBack/abductors/obliques/abs |
| step-up | adductors, calves | glutes, quads | glutes, quads | OK | — |
| straight-arm-pulldown | rearDelts, triceps | lats | lats | OK | — |
| sumo-squat-db | adductors, calves, abductors | glutes, quads | adductors, quads | OK* |  +glutes |
| superman | glutes, hamstrings | lowerBack | lowerBack, glutes | OK | — |
| svend-press | frontDelts, triceps | chest | chest | OK | — |
| thoracic-bridge | — | calves, glutes, hamstrings, rotatorCuff, lats, obliques, traps | lowerBack, glutes, frontDelts | OK* |  +calves/hamstrings/rotatorCuff/lats/obliques/traps |
| toe-touch | frontDelts, sideDelts, calves, obliques, chest, serratus | lowerBack, glutes, hamstrings, abs | abs | OK* |  +lowerBack/glutes/hamstrings |
| tricep-kickback | — | triceps | triceps | OK | — |
| tricep-pushdown-bar | — | triceps | triceps | OK | — |
| tricep-pushdown-rope | — | triceps | triceps | OK | — |
| v-up | adductors, obliques, quads, abductors | hipFlexors, abs | abs | OK* |  +hipFlexors |
| wide-grip-push-up | frontDelts, triceps | chest | chest | OK | — |
| wrist-extensor-stretch | — | forearms | forearms | OK | — |
| wrist-flexor-stretch | — | forearms | forearms | OK | — |
| wrist-rocks | — | forearms | forearms | OK | via SWAP 185013 |
| zottman-curl | forearms | biceps | biceps, forearms | OK | — |

---

## 3. DISAGREE review (10) — targetPrimary conflicts, do NOT auto-apply
Recommendation per row (T2 view). Synergists for these are still safe to add; the **target** is the contested field.

| slug | GymVisual target | our musclesTargeted | recommendation |
|---|---|---|---|
| cable-internal-rotation | frontDelts, chest | rotatorCuff | KEEP OURS (`rotatorCuff`). GymVisual lists the gross movers (delt/pec); cuff is the correct training intent. |
| cable-row-wide-grip | rotatorCuff, lats, traps | rearDelts, rhomboids | Keep ours + consider `lats`. Same lat-vs-upperback split as High Row. |
| dumbbell-pullover | chest | lats, serratus | Reviewer call. GymVisual=`chest`-dominant; ours=`lats`/`serratus`. Classic disputed lift — add `chest` as synergist, keep lats primary. |
| farmers-walk | adductors, calves, glutes, hamstrings, quads | abs, forearms, traps | KEEP OURS (`forearms`/`traps`/`abs`). GymVisual's row is a leg-tagged carry (all-legs target, no grip) — misleading for our grip/carry intent. |
| flutter-kicks | glutes | abs | KEEP OURS (`abs`). GymVisual target `glutes` is off for a lower-ab/hip-flexor move. |
| frog-stretch | glutes, abductors | adductors, hipFlexors | KEEP OURS (`adductors`/`hipFlexors`). GymVisual's 'Rocking Frog' rows it glute/glute-med; groin/adductor (ours) is the stretch intent. |
| high-row-rope | rotatorCuff, lats, traps | rhomboids, rearDelts | Keep ours + consider adding `lats`. GymVisual rows this as lat-dominant; rhomboids/rearDelts (ours) are the upper-back emphasis — both valid, lats worth adding. |
| pallof-press | obliques | abs | Switch to `obliques` (GymVisual right — Pallof is anti-rotation/oblique, not rectus `abs`). |
| prone-press-up | abs | lowerBack | KEEP OURS (`lowerBack`). GymVisual `abs` is the muscle being *stretched* (cobra), not the extensor working. |
| sleeper-stretch | frontDelts, chest | rotatorCuff, rearDelts | KEEP OURS (`rotatorCuff`/`rearDelts`). Target inherited via SWAP from the *Cable Internal Rotation* GIF stand-in — wrong muscle emphasis for a posterior-capsule stretch. **Synergists from this source are also unreliable here.** |

---

## 4. Alias inheritance (23) — note for the apply step
**MERGE (4)** — same movement, inherit cleanly: Cable Front Squat←Cable Squat · Cable French Press←Overhead Cable Extension · Cable Hip Abduction (Standing)←Cable Abductor · Cable Hip Adduction (Standing)←Cable Adductor.
**SWAP (19)** — GIF stand-in; muscle inheritance is sound where the movement matches (the squat/curl/step family) but **suspect where it doesn't**. Of the 19, only 8 inherit non-empty data; the rest resolve to no-target sources (cardio/mobility) → empty, fine. **One flagged conflict:** `sleeper-stretch` (←Cable Internal Rotation) — see §3; recommend NOT inheriting its target/synergists.

---

## 5. Output artifact
`_synergist_patch.json` — `slug → { synergists[], targetPrimary[] }` for the 132 enriched entries (proposal only; **not applied**). The apply step should: add `synergists` wholesale (we have none today), and treat `targetPrimary` as a *cross-check* — apply OK rows, hold DISAGREE rows per §3.

---

**Sign-off:** T2 | 2026-06-14 16:53
