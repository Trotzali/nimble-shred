# Proposal — sport-quality tags (`sportQualities[]`) for the AFL + surf overlays

**Terminal:** T3 (read-only; propose-only, ADDITIVE). No `index.html`/metadata edits, no git.
**Spec:** `_spec_sport_overlays.md` §2-3 (priorities) + §124 (vocab). **Source fields:** `musclesTargeted`, `movementPattern`, `jointLoad`, `laterality`, `bucket`, `rehabCategory` (exercise-metadata.js v1.5.0, 202 entries).
**Field to add (proposed):** `sportQualities: string[]` per entry — the JSON map is `_sport_quality_patch.json`.

> Additive & derived: every tag is reproducible from existing fields by the rules below — re-run to regenerate. Non-negotiables (the safety-critical auto-inserts) are a separate hand-curated per-sport list per spec §124; **not** derived here.

## Coverage
- 202 entries · **118 carry ≥1 quality** · 84 carry none (pure isolation/mobility with no sport bias).
- Seed validation (spec-named examples): **PASS** — Nordic Curl & RDL→eccentric-hamstring, Copenhagen→adductor, Face Pulls & Prone Y-T-W→scapular-cuff, Woodchopper & Pallof→rotational-power, SL-RDL & Bulgarian→single-leg.

| quality | count | sport role |
|---|--:|---|
| `eccentric-hamstring` | 6 | AFL #1 non-negotiable (HSI prevention) |
| `adductor` | 12 | AFL #3 non-negotiable-if-niggle (groin) |
| `calf-eccentric` | 21 | AFL #4 (calf/Achilles, weekly) |
| `scapular-cuff` | 21 | Surf #1 non-negotiable (paddle shoulder) |
| `rotational-power` | 17 | Surf #3 (rotational power + anti-rotation) |
| `single-leg` | 18 | AFL #5 + Surf #4 (ACL-relevant / balance) |
| `lumbar-endurance` | 12 | Surf #5 non-negotiable-weekly (paddle low-back) |
| `landing-decel` | 14 | AFL #5 (landing/decel, ACL) |
| `posterior-chain` | 35 | AFL #2 (hinge strength) |
| `repeat-effort` | 28 | AFL #6 + Surf #7 (repeat-effort/conditioning) |

---

## Per-quality rule + members + flags

### `eccentric-hamstring`  (6)
- **Rule:** `movementPattern == "hinge"` AND `hamstrings ∈ musclesTargeted`
- **Sport:** AFL #1 non-negotiable (HSI prevention)
- **Flag:** Glute-dominant hinges with no hamstring tag (Glute Bridge, Cable Kickback (Glute), Cable Donkey Kick) are correctly excluded (concentric glute, not lengthening-hamstring).
- **Members:** Cable Pull-Through, Cable RDL, Romanian Deadlift (DB), Nordic Curl, Good Morning (BW), Single Leg RDL (BW)

### `adductor`  (12)
- **Rule:** `adductors ∈ musclesTargeted` (OR name = Copenhagen Plank)
- **Sport:** AFL #3 non-negotiable-if-niggle (groin)
- **Flag:** Pure abductor work (Cable Abductor, skater bounds) correctly NOT tagged. Copenhagen Plank carries adductor + rotational-power + lumbar-endurance (all true).
- **Members:** Cable Adductor, Deep Squat Hold, Cable Hip Adduction (Standing), Sumo Squat (DB), Side Lunge, Cossack Squat, Horse Stance Hold, Copenhagen Plank, Pop Squat, Pigeon Pose, Frog Stretch, Standing Hip CARs

### `calf-eccentric`  (21)
- **Rule:** `calves ∈ musclesTargeted` AND (`movementPattern == "isolation"` OR `jointLoad.ankle ≥ 2`)
- **Sport:** AFL #4 (calf/Achilles, weekly)
- **Flag:** Includes lateral/fast-feet footwork (Lateral/Fast Feet Shuffle, Dot Drill) via `ankle≥2` — calf-spring, not classic eccentric heel-drop. Calf Raise (BW) is in via `isolation`.
- **Members:** Cable Calf Raise, Seated Calf Raise, Calf Raise (BW), Deep Squat Hold, High Knees, Jump Squat, Skater Hops, Jumping Lunge, Box Jump, Duck Walk, Lateral Bounds, Dot Drill, Tuck Jumps, A-Skips, Lateral Shuffle, Squat to Calf Raise, Fast Feet Shuffle, Pop Squat, Pogo Hops, Banded Ankle Eversion-Inversion, Knee-to-Wall Ankle Rock

### `scapular-cuff`  (21)
- **Rule:** `rotatorCuff ∈ musclesTargeted` OR `rehabCategory == "shoulder-prehab"` (OR name = Cable Rear Delt Fly)
- **Sport:** Surf #1 non-negotiable (paddle shoulder)
- **Flag:** Includes `shoulder-prehab` drills that are decompression/lateral-delt rather than cuff strength (Dead Hang, Lu Raise) — relevant to shoulder health but not cuff-loading; flagged. `serratus`-only crawls (Bear Crawl, Inchworm) deliberately NOT tagged.
- **Members:** Seated Cable Row, Face Pulls, Single Arm Cable Row, Cable Rear Delt Fly, Cable External Rotation, Cable Internal Rotation, Cable Y-Raise, Dumbbell Row, Renegade Row, Inverted Row, Shoulder Dislocates, Wall Slides, Standing Cable Row, Scapular Push-up, Lu Raise, Powell Raise, Dead Hang, Thoracic Bridge, Arm Circles, Prone Y-T-W Raise, Sleeper Stretch

### `rotational-power`  (17)
- **Rule:** `movementPattern ∈ {rotation, anti-rotation}`
- **Sport:** Surf #3 (rotational power + anti-rotation)
- **Flag:** Bundles true rotational power (woodchop, twist) with anti-rotation/anti-lateral STABILITY (Pallof, Bird Dog, Side Plank, Copenhagen) per spec §3.3 row 3 ("rotational power + anti-rotation core"). Stability items are not ballistic — weight accordingly.
- **Members:** Woodchopper (High to Low), Pallof Press, Cable Side Bend, Woodchopper (Low to High), Side Plank, Bird Dog, Russian Twist, Bicycle Crunch, Copenhagen Plank, Standing Knee-to-Elbow, Shadow Boxing, Standing Oblique Twist, Neck CARs, Forearm Pronation-Supination, Elbow CARs, Quadruped Thoracic Rotation, Standing Hip CARs

### `single-leg`  (18)
- **Rule:** `laterality ∈ {unilateral, alternating}` AND `movementPattern ∈ {lunge, squat, hinge}`
- **Sport:** AFL #5 + Surf #4 (ACL-relevant / balance)
- **Flag:** Single-leg PLYO (Skater Hops, Lateral Bounds) is `movementPattern=locomotion` → NOT caught here; it carries `landing-decel`. Consider whether the overlay wants those under single-leg too.
- **Members:** Cable Lunge, Cable Kickback (Glute), Dumbbell Lunge, Bulgarian Split Squat, DB Step Up, Lunge (BW), Pistol Squat, Cable Donkey Kick, Curtsy Lunge, Side Lunge, Single Leg Glute Bridge, Jumping Lunge, ATG Split Squat, Cossack Squat, Single Leg RDL (BW), Reverse Lunge to Knee Drive, Low Step-Up (Fast), Eccentric Step Down

### `lumbar-endurance`  (12)
- **Rule:** `movementPattern ∈ {anti-extension, carry}` OR `rehabCategory == "core-stability"` OR name ∈ {Side Plank, Superman, Swimmers, Prone Press-Up}
- **Sport:** Surf #5 non-negotiable-weekly (paddle low-back)
- **Flag:** Loaded carries (Farmers Walk, Plate Pinch) included via `carry` — they load anti-flexion/bracing, though Plate Pinch is grip-led. Superman/Swimmers/Prone Press-Up added by name (extension endurance/tolerance).
- **Members:** Farmers Walk, Plank, Side Plank, Dead Bug, Bird Dog, Superman, Swimmers, Plate Pinch, Reverse Plank, L-Sit (Tuck), McGill Curl-Up, Prone Press-Up

### `landing-decel`  (14)
- **Rule:** `bucket == "power"` OR `rehabCategory == "knee-prehab"`
- **Sport:** AFL #5 (landing/decel, ACL)
- **Flag:** Includes footwork plyo (A-Skips, Dot Drill — less true landing) and eccentric knee drills (Reverse Nordic, Terminal Knee Extension via `knee-prehab` — decel-relevant, not jumps).
- **Members:** Jump Squat, Skater Hops, Jumping Lunge, Box Jump, ATG Split Squat, Lateral Bounds, Dot Drill, Tuck Jumps, A-Skips, Pop Squat, Pogo Hops, Terminal Knee Extension, Reverse Nordic Curl, Eccentric Step Down

### `posterior-chain`  (35)
- **Rule:** `(glutes OR hamstrings) ∈ musclesTargeted` AND `movementPattern ∈ {hinge, squat, lunge}`
- **Sport:** AFL #2 (hinge strength)
- **Flag:** Squat-pattern entries are in when they carry glutes (Goblet/Cable/Sumo/Pistol/Bodyweight Squat). Hip-extension accessories (kickbacks, bridges) included via `hinge`+glutes.
- **Members:** Cable Squat, Cable Pull-Through, Cable RDL, Cable Lunge, Cable Kickback (Glute), Goblet Squat, Dumbbell Lunge, Bulgarian Split Squat, Romanian Deadlift (DB), DB Step Up, Bodyweight Squat, Lunge (BW), Glute Bridge, Pistol Squat, Nordic Curl, Cable Front Squat, Cable Zercher Squat, Cable Donkey Kick, Sumo Squat (DB), Curtsy Lunge, Side Lunge, Single Leg Glute Bridge, Good Morning (BW), Jump Squat, Jumping Lunge, Box Jump, ATG Split Squat, Cossack Squat, Single Leg RDL (BW), Horse Stance Hold, Squat to Calf Raise, Reverse Lunge to Knee Drive, Low Step-Up (Fast), Pop Squat, Eccentric Step Down

### `repeat-effort`  (28)
- **Rule:** `bucket == "cardio"` OR `movementPattern == "locomotion"`
- **Sport:** AFL #6 + Surf #7 (repeat-effort/conditioning)
- **Flag:** cardio bucket + every locomotion drill (crawls, marches, shuffles, skips). Captures repeat-sprint/paddle-conditioning surrogates; not a power measure.
- **Members:** Mountain Climbers, Burpees, Plank Jack, Jumping Jacks, High Knees, Skater Hops, Bear Crawl, Crab Walk, Kick Through, Beast Reach, Duck Walk, Inchworm, Lateral Bounds, Dot Drill, A-Skips, March in Place, Step Touch, Lateral Shuffle, Standing Knee-to-Elbow, Shadow Boxing, Squat to Calf Raise, Fast Feet Shuffle, Slow Mountain Climber, Reverse Lunge to Knee Drive, Standing Oblique Twist, Low Step-Up (Fast), No-Jump Burpee, Pogo Hops

---

## Untagged entries (no sport bias)

Cable Chest Press, Cable Chest Fly (High), Cable Chest Fly (Low), Cable Chest Fly (Mid), Single Arm Cable Chest Press, Cable Crossover, Cable Pullover (Bench), Lat Pulldown (Standing), Straight Arm Pulldown, Cable Shrugs, High Row (Rope), Cable Overhead Press, Cable Lateral Raise, Cable Front Raise, Cable Upright Row, Tricep Pushdown (Rope), Tricep Pushdown (Bar), Overhead Cable Extension, Cable Bicep Curl, Cable Hammer Curl, Bayesian Curl, Cable Kickback, Reverse Grip Pushdown, Cable Abductor, Cable Crunch, Dumbbell Bench Press, Dumbbell Incline Press, Dumbbell Fly, Dumbbell Shoulder Press, Arnold Press, Lateral Raise, Front Raise, Dumbbell Pullover, Dumbbell Curl, Hammer Curl, Tricep Kickback, Skull Crusher (DB), Zottman Curl, Concentration Curl, DB Floor Press, DB Shrugs, Push-ups, Pull-ups, Chin-ups, Dips, Hanging Leg Raise, Pike Push-up, Handstand Hold, Cat-Cow, Thoracic Extension, World's Greatest Stretch, 90/90 Hip Switch, Couch Stretch, Lying Cable Curl, Cable French Press, Cable Hip Abduction (Standing), Cable Wrist Curl, Cable Reverse Wrist Curl, Flutter Kicks, V-Ups, Reverse Crunch, Toe Touch, Diamond Push-up, Wide Grip Push-up, Decline Push-up, Incline Push-up, Bench Dip, Close Grip Push-up, Svend Press, Cable Curl (Behind Back), Cable Row (Wide Grip), Standing Cable Crunch, Tibialis Raise, Wrist Rocks, Jefferson Curl, Scorpion Stretch, Chin Tuck, Upper-Trap & Levator Stretch, Thread the Needle, Open Book Stretch, Ankle Alphabet, Child's Pose, Wrist Flexor Stretch, Wrist Extensor Stretch

## Caveats (carry from spec §6 before this drives selection)
- Tags are a **selection bias vector**, not prescription. The **goal** still sets the dose; the overlay only weights *what* gets picked.
- AFL evidence is elite-male; surf is Grade B/C — treat the weighting a notch softer for 40+ rec athletes.
- `rotational-power` deliberately co-tags anti-rotation stability; `landing-decel` co-tags eccentric-knee drills — split later if the engine needs power-vs-control granularity.
- Non-negotiable auto-inserts (eccentric-hamstring always; adductor/calf/cuff/lumbar per sport) must be the **hand-curated** list, not just "any tagged entry" — pick the safest progressions.
