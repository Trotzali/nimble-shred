# Media Buy List — GymVisual reconciliation (FINAL, #14)

**Type:** Doc only. Read-only on the live files + `Gym-Visual-EXERCISES-list.xlsx`.
No edits, no git. **Date:** see sign-off.
**Pool:** the **202 LIVE** post-integration exercises (metadata v1.5.0 merged;
the staged-vs-live split is obsolete — all 202 treated as live). Reconciled
against the live `exerciseMedia` (`exercise_media.js` pre-load): **96 already
have a GIF**, **106 are gaps**. This list resolves those 106 against GymVisual's
**"Animated GIFs"** sheet (6,450 entries).

## Method
- **Normalisation** (app → catalogue): lower-case; `DB`→`Dumbbell`, `(BW)`→drop,
  `RDL`→`romanian deadlift`; strip `(male)`/`(female)` and other parentheticals;
  fold plurals (`-s`/`-ies`); punctuation→space. Match = gap tokens ⊆ catalogue
  tokens (closest superset), then verified by hand against BodyPart/Equipment.
- **BUY** = a catalogue GIF reasonably depicts the movement → `app → ID + exact name`.
- **NO-MATCH** = absent/inadequate in catalogue → graded swap to the nearest
  **already-covered** move (a HAVE GIF or a BUY above) with the same
  `movementPattern` + overlapping `musclesTargeted` + comparable `jointLoad`
  (metadata v1.5.0): **EQUAL-SWAP** / **DEGRADED-SWAP** (loss stated) / **KEEP**.

## Totals @ $0.90/GIF  (detail in §3)
| strategy | spend | coverage |
|---|--:|---|
| **buy-as-is** (buy all 85 matches) | **$76.50** | 96 + 85 = 181/202; 21 via swap/custom |
| **hybrid** (buy distinct, reuse GIFs for variants + NO-MATCH swaps) | **$57.60** + 2 custom | full (200/202 + 2 custom) |
| **full-swap** (buy nothing, reuse existing GIFs only) | **$0.00** | ~157/202 (≈78%), 45 uncovered |

---

## 1. BUY list — 85 gaps with a catalogue match  (`app name → ID | exact catalogue name`)

### Canonical (61)
```
DB Floor Press                  -> 366813  | Dumbbell Lying on Floor Chest Press
Renegade Row                    -> 298013  | Dumbbell Renegade Row
Seated Calf Raise               -> 008813  | Barbell Seated Calf Raise        (equip: barbell)
Lunge (BW)                      -> 061213  | Lunge
Inverted Row                    -> 049913  | Inverted Row
Handstand Hold                  -> 654513  | Handstand Hold on Wall (male)
Calf Raise (BW)                 -> 041713  | Dumbbell Standing Calf Raise     (equip: dumbbell)
Dead Bug                        -> 027613  | Dead Bug
Thoracic Extension              -> 1157213 | Lying Thoracic Extensions on Foam Roller (female)
Shoulder Dislocates             -> 460713  | PVC Pass Through
Wall Slides                     -> 294113  | Forearm Wall Slide
Bird Dog                        -> 013513  | Bird Dog
Cable Front Squat               -> 334913  | Cable Front Squat
Cable Donkey Kick               -> 442113  | Cable Donkey Kickback (female)
Standing Cable Row              -> 509013  | Cable Standing Row
Lying Cable Curl                -> 018313  | Cable Lying Curl
Cable French Press              -> 019413  | Cable Overhead Triceps Extension (rope attachment)
Cable Hip Abduction (Standing)  -> 1126613 | Cable Standing Hip Abduction (VERSION 3)
Cable Hip Adduction (Standing)  -> 1126713 | Cable Standing Hip Adduction (VERSION 3)
Cable Wrist Curl                -> 024713  | Cable Wrist Curl
Cable Reverse Wrist Curl        -> 021013  | Cable Reverse Wrist Curl
Flutter Kicks                   -> 045913  | Flutter Kicks
Reverse Crunch                  -> 067113  | Reverse Crunch
Plank Jack                      -> 147813  | Jack Plank
Toe Touch                       -> 321213  | Basic Toe Touch (male)
Wide Grip Push-up               -> 131113  | Wide Hand Push up
Decline Push-up                 -> 028013  | Decline Push up
Incline Push-up                 -> 049313  | Incline Push up
Scapular Push-up                -> 411713  | Kneeling Scapular Push-Up (male)
Sumo Squat (DB)                 -> 232213  | Dumbbell Sumo Squat (female)
Curtsy Lunge                    -> 631813  | Single Curtsy Lunge (female)
Side Lunge                      -> 297213  | Side Lunge
Jumping Jacks                   -> 051613  | Jumping Jack
High Knees                      -> 047713  | High Knee Skips
Skater Hops                     -> 336113  | Skater Hops
Jumping Lunge                   -> 514813  | Jumping Single Leg Lunge
Swimmers                        -> 161213  | Swimmer
Bench Dip                       -> 012913  | Bench Dip (knees bent)
Close Grip Push-up              -> 025913  | Close Grip Push up
Plate Pinch                     -> 104413  | Plate Pinch
Svend Press                     -> 085613  | Weighted Svend Press
Cable Row (Wide Grip)           -> 021813  | Cable Seated Wide grip Row
Standing Cable Crunch           -> 022613  | Cable Standing Crunch
Bear Crawl                      -> 336013  | Bear Crawl
Crab Walk                       -> 588113  | Crab Walk (male)
Kick Through                    -> 633513  | Side Kick Through (male)
Duck Walk                       -> 386713  | Duck Walk (male)
Tibialis Raise                  -> 927213  | Sitting Floor Tibialis Raise (male)   (seated variant)
Lu Raise                        -> 1085813 | Dumbbell LU Raise (male)
Powell Raise                    -> 1033013 | Dumbbell Powell Raise (male)
Cossack Squat                   -> 256913  | Cossack Squats (female)
Jefferson Curl                  -> 1075213 | Bodyweight Jefferson Curl (male)
Scorpion Stretch                -> 463113  | Scorpion Stretch
Inchworm                        -> 147113  | Inchworm
Thoracic Bridge                 -> 455313  | Thoracic Bridge
Lateral Bounds                  -> 056313  | Lateral Bound
Dot Drill                       -> 596913  | Dot Drill (male)
Tuck Jumps                      -> 157013  | Knee Tuck Jump
A-Skips                         -> 319913  | Skips
Reverse Plank                   -> 086713  | Reverse plank
World's Greatest Stretch        -> 463313  | Worlds Greatest Stretch
```
### Cardio pack (8)
```
Lateral Shuffle                 -> 425713  | Shuffle
Standing Knee-to-Elbow          -> 044213  | Elbow To Knee Twists
Squat to Calf Raise             -> 416013  | Squat Hold Calf Raise
Reverse Lunge to Knee Drive     -> 741213  | Reverse Lunge High Knee Forward Lunge (male)
Standing Oblique Twist          -> 485513  | Bodyweight Standing Oblique Twist
Low Step-Up (Fast)              -> 080113  | Step up
Pop Squat                       -> 078513  | Squat Jacks
Pogo Hops                       -> 907013  | Pogo Jump 2 Foot (male)
```
### Gapfill pack (5)
```
Neck CARs                       -> 399413  | Neck Circle Stretch
Chin Tuck                       -> 314913  | Chin Tuck
Upper-Trap & Levator Stretch    -> 179113  | Trap and Neck Stretch
Forearm Pronation-Supination    -> 182113  | Elbow Extension And Supination - Pronation Forearm Stretch
Banded Ankle Eversion-Inversion -> 312713  | Resistance Band Foot Eversion   (+ 312813 Inversion for full ROM)
```
### Rehab pack (11)
```
Arm Circles                     -> 025413  | Circles Arm
Prone Y-T-W Raise               -> 854613  | Lying Prone Y to T to W (male)
Thread the Needle               -> 590413  | Thread the Needle Pose (female)
Open Book Stretch               -> 460113  | Open Book Stretch
Frog Stretch                    -> 257113  | Rocking Frog Stretch
Standing Hip CARs               -> 341113  | Standing Hip Circle (female)
Ankle Alphabet                  -> 136813  | Ankle Circles                   (alphabet ≈ full-ROM circles)
McGill Curl-Up                  -> 301613  | Curl-up
Prone Press-Up                  -> 148213  | Cobra Yoga Pose                 (McKenzie press-up ≈ cobra)
Wrist Flexor Stretch            -> 185013  | Wrist Flexor Stretch
Wrist Extensor Stretch          -> 184913  | Wrist Extensor Stretch
```

**BUY total: 85 GIFs.** (A handful are loaded/gender variants of the exact move —
noted inline; all depict the movement.)

---

## 2. NO-MATCH list — 21 gaps, with swap-feasibility grade

### EQUAL-SWAP (2) — reuse an existing GIF, no meaningful loss
| gap | swap to (covered) | why equal |
|---|---|---|
| Slow Mountain Climber | **Mountain Climbers** (HAVE) | identical movement; "slow" is a tempo cue only (mJ 0.75). |
| Quadruped Thoracic Rotation | **Thread the Needle** (BUY 590413) | both are quadruped thoracic-rotation drills — visually the same. |

### DEGRADED-SWAP (17) — usable substitute, with the stated loss
| gap | swap to (covered) | loss |
|---|---|---|
| Deep Squat Hold | Bodyweight Squat (HAVE) | the sustained bottom-position **hold** (mobility intent) reads as a rep. |
| Cable Zercher Squat | Cable Front Squat (BUY) | Zercher elbow-cradle load vs front-rack (minor). |
| Cable Curl (Behind Back) | Cable Bicep Curl (HAVE) | behind-body arm position / biceps peak-stretch. |
| Beast Reach | Bear Crawl (BUY 336013) | the stationary reach + anti-rotation hold (vs travelling crawl). |
| ATG Split Squat | Bulgarian Split Squat (HAVE) | the ATG knee-over-toe **depth** — the knee-prehab point. |
| Wrist Rocks | Wrist Flexor/Extensor Stretch (BUY) | radial/ulnar **deviation** plane (≠ flex/extend). |
| Horse Stance Hold | Sumo Squat (BUY) / Bodyweight Squat | the isometric wide-stance **hold**. |
| March in Place | High Knees (BUY 047713) | the **low-impact** (no airborne) joint-sparing distinction. |
| Step Touch | Lateral Shuffle (BUY 425713) | even-lower-impact simple lateral step. |
| Shadow Boxing | Jumping Jacks (BUY) | leg-sparing **upper-body** + rotational character. |
| Fast Feet Shuffle | Lateral Shuffle (BUY 425713) | in-place quick-feet vs lateral travel. |
| No-Jump Burpee | Burpees (HAVE) | the GIF shows the **jump** this low-impact variant removes. |
| Elbow CARs | Forearm Pronation-Supination (BUY 182113) | full elbow flex/extend ROM beyond forearm rotation. |
| Sleeper Stretch | Cable Internal Rotation (HAVE) | passive end-range IR **stretch** vs active IR (intent). |
| Reverse Nordic Curl | Couch Stretch (HAVE) | loaded eccentric quad/tendon **stimulus** vs a passive stretch. |
| Eccentric Step Down | DB Step Up (HAVE) | the **eccentric-lowering** control (GIF shows the concentric mirror). |
| Knee-to-Wall Ankle Rock | Tibialis Raise (BUY 927213) | dorsiflexion **ROM mobilisation** vs tib strengthening. |

### KEEP (2) — irreplaceable, no acceptable swap → custom GIF
| gap | why KEEP |
|---|---|
| **Copenhagen Plank** | unique **loaded hip-ADDUCTION** side-plank; the sole `adductor-prehab` strength move; no covered analog (its adductor role can't be faked by any plank/adductor we own). |
| **Terminal Knee Extension** | terminal-range/VMO banded knee extension; the only terminal-knee `knee-prehab` drill; Reverse Nordic is long-range (not terminal) and we own no leg-extension. |

---

## 3. Three totals @ $0.90/GIF

**A. Buy-as-is — buy every catalogue match.**
`85 × $0.90 = `**`$76.50`**`.` Covers 96 HAVE + 85 = **181/202**; the 21 NO-MATCH
stay uncovered until swapped/customised.

**B. Hybrid (recommended) — buy the distinct moves; reuse an existing GIF for
obvious variants and for the NO-MATCH swaps; custom only the 2 KEEP.**
Skip buying **21** BUY items that are grip/angle/tempo/loaded-vs-bodyweight or
same-pattern variants of a move we already have a GIF for (reuse it instead):
> Wide Grip / Close Grip / Decline / Incline Push-up → Push-ups/Diamond;
> Standing Cable Crunch + Reverse Crunch → Cable Crunch; Lunge (BW) → Dumbbell
> Lunge; Calf Raise (BW) + Seated Calf Raise → Cable Calf Raise; Lying Cable Curl
> → Cable Bicep Curl; Cable Row (Wide Grip) → Seated Cable Row; Bench Dip → Dips;
> Toe Touch → V-Ups; Standing Oblique Twist → Russian Twist; Cable Front Squat →
> Goblet Squat; Cable French Press → Overhead Cable Extension; Cable Donkey Kick →
> Cable Kickback (Glute); Cable Hip Abduction/Adduction (Standing) → Cable
> Abductor/Adductor; Low Step-Up (Fast) → DB Step Up; Pop Squat → Jump Squat.

Buy the remaining **64** + reuse for all 19 swappable NO-MATCH + **2 custom**:
`64 × $0.90 = `**`$57.60`**` + 2 custom GIFs.` → effectively **full coverage**.

**C. Full-swap — buy nothing; cover gaps only by reusing existing HAVE GIFs.**
`$0.00`. Heuristic coverage (a gap is coverable when a HAVE move shares its
`movementPattern`, overlaps `musclesTargeted`, and is within ±3 strain): **≈157/202
(78%)**. **45 remain uncovered** — the genuinely-distinct lifts (e.g. Lu/Powell
Raise, Plate Pinch, Svend Press, Jefferson Curl) and the novel cardio/CARs/rehab
moves with no existing analog. Not recommended (degrades many moves), but it
frames the floor.

> **Recommendation:** **Hybrid (~$57.60 + 2 custom).** Buy-as-is over-spends ~$19
> on variants you already have a GIF for; full-swap leaves 45 moves wrong or
> uncovered. The 2 KEEP customs (Copenhagen Plank, Terminal Knee Extension) are
> worth commissioning — both are flagship 40+ prehab moves with unique joint roles.

## Caveats
- IDs/names are from the live `Gym-Visual-EXERCISES-list.xlsx` "Animated GIFs"
  sheet; gender/loaded variants are flagged inline — confirm the exact SKU at
  purchase.
- `Banded Ankle Eversion-Inversion` and `Forearm Pronation-Supination` each cover
  a two-direction drill; buy the paired GIF (eversion **+** inversion = +$0.90) if
  you want both directions shown.
- Swap targets are exercises that **will** have a GIF (a HAVE move or a BUY above);
  swapping never points at another uncovered gap.
- Full-swap's 78% is a metadata heuristic (pattern+muscle+strain), not a hand
  audit — treat as directional.
