# Media Purchase Gap List — GymVisual buy prep (#14)

**Type:** Doc only. Read-only on `index.html` + the three packs. No edits, no git.
**Purpose:** the full **post-integration (202-exercise)** name list, one per line,
for diffing against GymVisual's catalogue spreadsheet, annotated with current media
status and a best-guess match class so the GIF buy can be scoped and priced.

## Method / legend
- **Names** = the 202 that exist after the three packs land (163 `index.html`
  `window.allExercises` + 14 cardio + 7 gapfill + 18 rehab). Verified live.
- **HAVE** = resolves to a real GIF today via `exerciseMedia` (the pre-loaded
  `exercise_media.js` data), directly or through `mediaAliases`. `(media key: "…")`
  shows the differently-named key the app already maps to — **search GymVisual under
  that name too** when confirming. No purchase needed.
- **media-less** = no GIF today → a buy (or custom) candidate. Best-guess class:
  - **exact-match-likely** — a standard movement GymVisual almost certainly stocks
    under the same/obvious name. Buy with high confidence.
  - **substitute-needed** — a near-variant exists but our name differs / it's a
    combo or app-specific framing; buy the closest match (verify it represents the
    movement) or alias to an existing GIF.
  - **custom-needed** — niche/bespoke; unlikely in any catalogue → commission or
    record in-house (NOT a $0.90 buy).

## Summary

| | count | @ $0.90/GIF |
|---|--:|--:|
| **Total post-integration** | **202** | — |
| Already have media (no spend) | 96 | $0.00 |
| **Media-less (gaps)** | **106** | — |
| &nbsp;&nbsp;exact-match-likely | 69 | $62.10 |
| &nbsp;&nbsp;substitute-needed | 33 | $29.70 |
| &nbsp;&nbsp;custom-needed | 4 | — (bespoke) |
| **Buyable from GymVisual (exact + substitute)** | **102** | **$91.80** |

- **Expected GymVisual spend ≈ $91.80** for 102 GIFs.
- **High-confidence floor** (exact only) = 69 × $0.90 = **$62.10**; the 33
  substitutes ($29.70) are likely-buyable pending the name match in the diff.
- **custom-needed (4, not purchasable at $0.90):** Beast Reach, Lu Raise,
  Powell Raise, Dot Drill — budget separately for custom creation.
- Some substitutes may flip to custom (or to "alias an existing GIF") once checked
  against the actual catalogue — that's the point of the diff. Treat $91.80 as the
  ceiling for the GymVisual line item.

> Note: 69 of the 163 canonical exercises and 104 of the 106 gaps are new since the
> original "6 missing GIFs" figure — that estimate was count arithmetic, not a
> name-level diff (see `_audit_links.md` Finding B). The real gap is 106 across 202.

---

## Full 202 list — one per line (for catalogue diff)

## CANONICAL (index.html)  (163)
Cable Chest Press                | HAVE
Cable Chest Fly (High)           | HAVE
Cable Chest Fly (Low)            | HAVE
Cable Chest Fly (Mid)            | HAVE
Single Arm Cable Chest Press     | HAVE
Cable Crossover                  | HAVE
Cable Pullover (Bench)           | HAVE
Lat Pulldown (Standing)          | HAVE
Seated Cable Row                 | HAVE
Face Pulls                       | HAVE
Straight Arm Pulldown            | HAVE
Single Arm Cable Row             | HAVE
Cable Shrugs                     | HAVE
Cable Rear Delt Fly              | HAVE
High Row (Rope)                  | HAVE
Cable Overhead Press             | HAVE
Cable Lateral Raise              | HAVE
Cable Front Raise                | HAVE
Cable External Rotation          | HAVE
Cable Internal Rotation          | HAVE
Cable Upright Row                | HAVE
Cable Y-Raise                    | HAVE
Tricep Pushdown (Rope)           | HAVE
Tricep Pushdown (Bar)            | HAVE
Overhead Cable Extension         | HAVE
Cable Bicep Curl                 | HAVE
Cable Hammer Curl                | HAVE
Bayesian Curl                    | HAVE
Cable Kickback                   | HAVE
Reverse Grip Pushdown            | HAVE
Cable Squat                      | HAVE
Cable Pull-Through               | HAVE
Cable RDL                        | HAVE
Cable Lunge                      | HAVE
Cable Kickback (Glute)           | HAVE
Cable Calf Raise                 | HAVE
Cable Abductor                   | HAVE
Cable Adductor                   | HAVE
Cable Crunch                     | HAVE
Woodchopper (High to Low)        | HAVE
Pallof Press                     | HAVE
Cable Side Bend                  | HAVE
Woodchopper (Low to High)        | HAVE
Dumbbell Bench Press             | HAVE
Dumbbell Incline Press           | HAVE
Dumbbell Fly                     | HAVE
Dumbbell Shoulder Press          | HAVE
Arnold Press                     | HAVE
Lateral Raise                    | HAVE
Front Raise                      | HAVE
Dumbbell Row                     | HAVE
Dumbbell Pullover                | HAVE
Goblet Squat                     | HAVE
Dumbbell Lunge                   | HAVE
Bulgarian Split Squat            | HAVE
Romanian Deadlift (DB)           | HAVE  (media key: "Romanian Deadlift (Dumbbell)")
Dumbbell Curl                    | HAVE
Hammer Curl                      | HAVE
Tricep Kickback                  | HAVE
Skull Crusher (DB)               | HAVE  (media key: "Skull Crusher")
Farmers Walk                     | HAVE  (media key: "Farmer's Walk")
Zottman Curl                     | HAVE
Concentration Curl               | HAVE
DB Floor Press                   | media-less | exact-match-likely
Renegade Row                     | media-less | exact-match-likely
DB Step Up                       | HAVE  (media key: "Step-up")
DB Shrugs                        | HAVE  (media key: "Dumbbell Shrug")
Seated Calf Raise                | media-less | exact-match-likely
Push-ups                         | HAVE  (media key: "Push-up")
Pull-ups                         | HAVE  (media key: "Pull-up")
Chin-ups                         | HAVE
Dips                             | HAVE
Bodyweight Squat                 | HAVE
Lunge (BW)                       | media-less | substitute-needed
Glute Bridge                     | HAVE
Plank                            | HAVE
Side Plank                       | HAVE
Mountain Climbers                | HAVE
Burpees                          | HAVE
Hanging Leg Raise                | HAVE  (media key: "Leg Raise")
Pike Push-up                     | HAVE
Pistol Squat                     | HAVE
Nordic Curl                      | HAVE
Inverted Row                     | media-less | exact-match-likely
Handstand Hold                   | media-less | exact-match-likely
Calf Raise (BW)                  | media-less | exact-match-likely
Cat-Cow                          | HAVE  (media key: "Cat-Cow Stretch")
Dead Bug                         | media-less | exact-match-likely
Thoracic Extension               | media-less | exact-match-likely
World's Greatest Stretch         | media-less | exact-match-likely
90/90 Hip Switch                 | HAVE  (media key: "90/90 Hip Stretch")
Shoulder Dislocates              | media-less | exact-match-likely
Wall Slides                      | media-less | exact-match-likely
Deep Squat Hold                  | media-less | substitute-needed
Couch Stretch                    | HAVE
Bird Dog                         | media-less | exact-match-likely
Cable Front Squat                | media-less | substitute-needed
Cable Zercher Squat              | media-less | substitute-needed
Cable Donkey Kick                | media-less | exact-match-likely
Standing Cable Row               | media-less | exact-match-likely
Lying Cable Curl                 | media-less | substitute-needed
Cable French Press               | media-less | exact-match-likely
Cable Hip Abduction (Standing)   | media-less | exact-match-likely
Cable Hip Adduction (Standing)   | media-less | exact-match-likely
Cable Wrist Curl                 | media-less | exact-match-likely
Cable Reverse Wrist Curl         | media-less | exact-match-likely
Russian Twist                    | HAVE
Bicycle Crunch                   | HAVE
Flutter Kicks                    | media-less | exact-match-likely
V-Ups                            | HAVE  (media key: "V-Up")
Reverse Crunch                   | media-less | exact-match-likely
Plank Jack                       | media-less | exact-match-likely
Toe Touch                        | media-less | exact-match-likely
Diamond Push-up                  | HAVE
Wide Grip Push-up                | media-less | exact-match-likely
Decline Push-up                  | media-less | exact-match-likely
Incline Push-up                  | media-less | exact-match-likely
Scapular Push-up                 | media-less | exact-match-likely
Sumo Squat (DB)                  | media-less | exact-match-likely
Curtsy Lunge                     | media-less | exact-match-likely
Side Lunge                       | media-less | exact-match-likely
Single Leg Glute Bridge          | HAVE  (media key: "Single-Leg Glute Bridge")
Good Morning (BW)                | HAVE  (media key: "Good Morning")
Jumping Jacks                    | media-less | exact-match-likely
High Knees                       | media-less | exact-match-likely
Jump Squat                       | HAVE
Skater Hops                      | media-less | exact-match-likely
Jumping Lunge                    | media-less | exact-match-likely
Box Jump                         | HAVE
Superman                         | HAVE
Swimmers                         | media-less | substitute-needed
Bench Dip                        | media-less | exact-match-likely
Close Grip Push-up               | media-less | exact-match-likely
Plate Pinch                      | media-less | substitute-needed
Svend Press                      | media-less | exact-match-likely
Cable Curl (Behind Back)         | media-less | substitute-needed
Cable Row (Wide Grip)            | media-less | substitute-needed
Standing Cable Crunch            | media-less | exact-match-likely
Bear Crawl                       | media-less | exact-match-likely
Crab Walk                        | media-less | exact-match-likely
Kick Through                     | media-less | substitute-needed
Beast Reach                      | media-less | custom-needed
Duck Walk                        | media-less | exact-match-likely
Tibialis Raise                   | media-less | exact-match-likely
ATG Split Squat                  | media-less | substitute-needed
Lu Raise                         | media-less | custom-needed
Powell Raise                     | media-less | custom-needed
Wrist Rocks                      | media-less | substitute-needed
Dead Hang                        | HAVE
Cossack Squat                    | media-less | exact-match-likely
Jefferson Curl                   | media-less | exact-match-likely
Scorpion Stretch                 | media-less | exact-match-likely
Inchworm                         | media-less | exact-match-likely
Thoracic Bridge                  | media-less | substitute-needed
Single Leg RDL (BW)              | HAVE  (media key: "Single-Leg RDL")
Lateral Bounds                   | media-less | exact-match-likely
Dot Drill                        | media-less | custom-needed
Tuck Jumps                       | media-less | exact-match-likely
A-Skips                          | media-less | exact-match-likely
Horse Stance Hold                | media-less | substitute-needed
Reverse Plank                    | media-less | exact-match-likely
Copenhagen Plank                 | media-less | exact-match-likely
L-Sit (Tuck)                     | HAVE  (media key: "L-Sit")

## CARDIO PACK  (14)
March in Place                   | media-less | exact-match-likely
Step Touch                       | media-less | exact-match-likely
Lateral Shuffle                  | media-less | exact-match-likely
Standing Knee-to-Elbow           | media-less | substitute-needed
Shadow Boxing                    | media-less | exact-match-likely
Squat to Calf Raise              | media-less | substitute-needed
Fast Feet Shuffle                | media-less | substitute-needed
Slow Mountain Climber            | media-less | substitute-needed
Reverse Lunge to Knee Drive      | media-less | substitute-needed
Standing Oblique Twist           | media-less | substitute-needed
Low Step-Up (Fast)               | media-less | substitute-needed
No-Jump Burpee                   | media-less | substitute-needed
Pop Squat                        | media-less | exact-match-likely
Pogo Hops                        | media-less | exact-match-likely

## GAPFILL PACK  (7)
Neck CARs                        | media-less | substitute-needed
Chin Tuck                        | media-less | exact-match-likely
Upper-Trap & Levator Stretch     | media-less | substitute-needed
Forearm Pronation-Supination     | media-less | substitute-needed
Elbow CARs                       | media-less | substitute-needed
Terminal Knee Extension          | media-less | exact-match-likely
Banded Ankle Eversion-Inversion  | media-less | substitute-needed

## REHAB PACK  (18)
Arm Circles                      | media-less | exact-match-likely
Prone Y-T-W Raise                | media-less | substitute-needed
Sleeper Stretch                  | media-less | exact-match-likely
Thread the Needle                | media-less | exact-match-likely
Open Book Stretch                | media-less | exact-match-likely
Quadruped Thoracic Rotation      | media-less | exact-match-likely
Pigeon Pose                      | HAVE
Frog Stretch                     | media-less | exact-match-likely
Standing Hip CARs                | media-less | substitute-needed
Reverse Nordic Curl              | media-less | exact-match-likely
Eccentric Step Down              | media-less | substitute-needed
Knee-to-Wall Ankle Rock          | media-less | substitute-needed
Ankle Alphabet                   | media-less | substitute-needed
Child's Pose                     | HAVE
McGill Curl-Up                   | media-less | substitute-needed
Prone Press-Up                   | media-less | exact-match-likely
Wrist Flexor Stretch             | media-less | exact-match-likely
Wrist Extensor Stretch           | media-less | exact-match-likely

---

## custom-needed shortlist (NOT a GymVisual buy — bespoke)
- **Beast Reach** — loaded animal-flow reach; unlikely in any stock catalogue.
- **Lu Raise** — niche leaning lateral-raise variant.
- **Powell Raise** — niche rear-delt raise variant.
- **Dot Drill** — specific dot-pattern agility footwork.

(If a substitute lateral/rear-delt or agility GIF is acceptable, Lu Raise /
Powell Raise / Dot Drill could downgrade to substitute-needed and the bespoke
list shrinks to Beast Reach alone.)

## Diff guidance
- Diff the names above against the GymVisual catalogue export. For each
  **media-less**, the class is the starting bet — confirm/adjust against the real
  catalogue, then buy.
- For **HAVE (media key: "…")** rows, the app already has a GIF; if you re-source
  for consistency, search GymVisual under the bracketed key name.
- 18 cable accessory variants are media-less but standard machine moves — most are
  `exact-match-likely`; a few cable-specific framings (Front/Zercher/Behind-Back,
  Wide-Grip Row) are `substitute-needed`.
