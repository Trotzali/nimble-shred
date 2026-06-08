# Mobility Pool — Gap Analysis & Targeted Authoring List

**Author:** T2 (read-only analysis terminal)
**Date:** 2026-06-08 17:38
**Sources (read-only):** `index.html` (Mobility/Nimble `createEx` entries), `exercise-metadata.js` (`rehabCategory` tags), `rehab-mobility-exercises.js` (T3's 18 staged, region-tagged drills). No edits, no git.
**Region vocab (aligned with T3):** neck · shoulder · elbow · wrist · lowBack · hip · knee · ankle · T-spine. *(The staged file uses `thoracic`→T-spine and `lower-back`→lowBack; mapped accordingly.)*

**Headline:** the pool is **already deep (~53 mobility/joint-health moves once the staged file lands)** and well-covered in 6 of 9 regions. This is **not** a bulk-expansion job. Two regions are **empty/near-empty (neck, elbow)** and one style is **thin (true CARs)**. Recommended: **7 surgical additions (up to 9 with two optional).**

---

## 1. Existing inventory

### A. Live in `index.html` (~35 mobility/joint-health moves)
**Cable (type:"Mobility"):** Face Pulls, Cable External Rotation, Cable Internal Rotation, Cable Y-Raise, Cable Abductor, Cable Adductor, Cable Hip Abduction (Standing), Cable Hip Adduction (Standing), Woodchopper (High→Low), Woodchopper (Low→High), Cable Side Bend.
**Bodyweight (type:"Mobility"):** Cat-Cow, Dead Bug, Thoracic Extension, World's Greatest Stretch, 90/90 Hip Switch, Shoulder Dislocates, Wall Slides, Deep Squat Hold, Couch Stretch, Bird Dog, Scapular Push-up, Good Morning (BW).
**Nimble bucket (cat:"Nimble", mixed types):** Bear Crawl, Crab Walk, Kick Through, Beast Reach, Duck Walk, Tibialis Raise, ATG Split Squat, Lu Raise, Powell Raise, Wrist Rocks, Dead Hang, Cossack Squat, Jefferson Curl, Scorpion Stretch, Inchworm, Thoracic Bridge, Single Leg RDL (BW), Horse Stance Hold, Reverse Plank, Copenhagen Plank.
*(Excluded as non-mobility: Lateral Bounds, Dot Drill, Tuck Jumps, A-Skips = Plyo/cardio; L-Sit = calisthenics strength.)*

`exercise-metadata.js` corroborates these with `rehabCategory` tags: shoulder-prehab, hip-prehab, adductor-prehab, knee-prehab, ankle-prehab, wrist-prehab, hip-mobility, spine-mobility, core-stability, movement-prep. **No `neck-*` and no `elbow-*` category exists** — the taxonomy itself has no neck or elbow slot.

### B. Staged in `rehab-mobility-exercises.js` (18, not yet wired) — region-tagged
- **shoulder (3):** Arm Circles, Prone Y-T-W Raise, Sleeper Stretch
- **T-spine (3):** Thread the Needle, Open Book Stretch, Quadruped Thoracic Rotation
- **hip (3):** Pigeon Pose, Frog Stretch, Standing Hip CARs
- **knee (2):** Reverse Nordic Curl, Eccentric Step Down
- **ankle (2):** Knee-to-Wall Ankle Rock, Ankle Alphabet
- **lowBack (3):** Child's Pose, McGill Curl-Up, Prone Press-Up
- **wrist (2):** Wrist Flexor Stretch, Wrist Extensor Stretch

The authoring list below is de-duplicated against **both** A and B.

---

## 2. Coverage map (1) — by REGION

| Region | Count (live + staged) | Representative moves | Verdict |
|---|:--:|---|---|
| **neck** | **0** | — | **EMPTY — top priority** |
| **elbow** | **~0** | (only indirect via wrist-extensor stretch / forearm work) | **NEAR-EMPTY** |
| shoulder | ~15 | Face Pulls, Ext/Int Rot, Y-Raise, Dislocates, Wall Slides, Scapular Push-up, Lu/Powell Raise, Dead Hang, Arm Circles, Prone Y-T-W, Sleeper | well covered |
| wrist | 3 | Wrist Rocks, Wrist Flexor/Extensor Stretch | adequate |
| lowBack | ~9 | Cat-Cow, Dead Bug, Bird Dog, Cable Side Bend, Jefferson Curl, Child's Pose, McGill Curl-Up, Prone Press-Up | well covered (McGill Big-3 complete) |
| hip | ~14 | 90/90, WGS, Deep Squat Hold, Couch, Cossack, Duck Walk, Abd/Add ×4, Pigeon, Frog, Hip CARs | **strongest region** |
| knee | ~4 | ATG Split Squat, Reverse Nordic Curl, Eccentric Step Down, (Horse Stance ISO) | adequate, slightly thin |
| ankle | ~4 | Tibialis Raise, Duck Walk, Knee-to-Wall Rock, Ankle Alphabet | adequate |
| **T-spine** | ~9 | Thoracic Extension, Thoracic Bridge, Woodchopper ×2, Kick Through, Beast Reach, Scorpion, Thread the Needle, Open Book, Quadruped Rotation | well covered |

**Region gaps, ranked:** **neck (0)** ≫ **elbow (~0)** ≫ knee/ankle (minor top-up) ≫ everything else (done).

> Why neck matters most here: the target user is **40+ and desk/phone-bound** (the flagship's whole framing). Forward-head/upper-trap load is the most common chronic complaint in that cohort, and the pool — and the metadata taxonomy — currently has **nothing** for it. Elbow is the second structural hole: lifters lose terminal extension and get golfer's/tennis-elbow tendinopathy, and there's no dedicated drill or `elbow-*` rehabCategory.

## 3. Coverage map (2) — by STYLE

| Style | Count | Examples | Verdict |
|---|:--:|---|---|
| **dynamic / CARs** | strong on *dynamic*, **thin on true CARs** | dynamic: Cat-Cow, Dislocates, Wall Slides, 90/90, Thread-Needle, Open Book, Quad Rotation, Scorpion, Arm Circles, Ankle Alphabet, Knee-to-Wall. **True CARs: only Hip CARs (+ Arm Circles, loosely)** | **CARs discipline thin** |
| static / long-hold | well covered | Couch, Deep Squat Hold, Pigeon, Frog, Sleeper, Child's Pose, Wrist stretches, Dead Hang, Horse Stance, Prone Press-Up | done |
| loaded mobility | well covered (a real strength) | Jefferson Curl, Cossack, ATG Split Squat, Reverse Nordic, Eccentric Step Down, Good Morning, SL-RDL, Woodchoppers, Cable Ext/Int Rot, Tibialis Raise, Copenhagen | done |
| flow | adequate | World's Greatest Stretch, Inchworm, Bear Crawl, Crab Walk, Kick Through, Beast Reach, Thoracic Bridge | done |

**Style gap:** **true CARs** (slow, controlled, full-range articular rotations) exist for the **hip only**. Neck and elbow — the two empty regions — are also exactly where a CAR is the natural maintenance drill, so the region and style gaps overlap and a few additions close both at once.

---

## 4. The intersection (where to author)

Thin/missing = **{neck, elbow} regions × {true CARs} style**, plus minor knee/ankle top-ups. Everything else is mature; adding there would duplicate. So the authoring list is deliberately small and aimed only at real holes.

---

## 5. TARGETED authoring list — **7 essential** (+2 optional)

No duplicates of the ~53 live/staged moves. All `equip:"Bodyweight"`, `type:"Mobility"` (matching the staged-file contract), each ready for a `region` tag.

### Essential (7)

| # | Drill | Region | Style | One-line why (no existing equivalent) |
|---|---|---|---|---|
| 1 | **Neck CARs (Controlled Neck Rotations)** | neck | dynamic / CARs | The only neck joint-maintenance drill in the whole pool; slow full-range chin circles — closes the empty region *and* the thin CARs style at once. |
| 2 | **Chin Tuck (Cervical Retraction)** | neck | static / isometric | The #1 forward-head / desk-posture corrective for 40+; activates deep neck flexors — nothing in the pool trains them. |
| 3 | **Upper-Trap & Levator Stretch** | neck | static / long-hold | Releases the chronic upper-trap/levator tension from sitting and phone use; the most-requested "stiff neck" relief, currently absent. |
| 4 | **Forearm Pronation–Supination** | elbow | loaded mobility | Trains the radioulnar joint (palm-up/palm-down under light load) — zero coverage today; key for elbow comfort in pressing/curling. |
| 5 | **Elbow CARs (full flexion–extension)** | elbow | dynamic / CARs | Lifters lose terminal elbow extension; this maintains end-range — no dedicated elbow drill exists, and it adds a second true CAR. |
| 6 | **Terminal Knee Extension (TKE, banded)** | knee | loaded mobility | Isolates terminal extension / VMO for knee tracking — complements the eccentric drills already staged (Reverse Nordic, Eccentric Step Down) without overlapping them. |
| 7 | **Banded Ankle Eversion/Inversion** | ankle | loaded mobility | Existing ankle work is all dorsiflexion / unloaded; loaded lateral ankle (sprain-prehab) is the one missing plane. |

### Optional stretch-goals (+2, only if a fuller pass is wanted)

| # | Drill | Region | Style | Why optional |
|---|---|---|---|---|
| 8 | **Scalene / SCM Neck Stretch** | neck | static / long-hold | Rounds neck out to 4 drills (front/side cervical lines); nice-to-have once 1–3 exist. |
| 9 | **Shoulder CARs** | shoulder | dynamic / CARs | Would add the missing *true* shoulder CAR — but **borders on duplicating the staged "Arm Circles"**; only author if clearly framed as the slow end-range FRC-style rotation vs. Arm Circles' warm-up swings. Otherwise skip. |

---

## 6. The quantified answer

- **Current pool:** ~53 mobility/joint-health moves (≈35 live in `index.html` + 18 staged). **6 of 9 regions already well covered; static/loaded/flow styles mature.**
- **Add 7** (not a bulk expansion — surgical hole-filling): **neck ×3, elbow ×2, knee ×1, ankle ×1.**
- **Effect:** neck **0 → 3**, elbow **~0 → 2**, true-CARs style **1 → 3** (Hip + Neck + Elbow), knee **4 → 5**, ankle **4 → 5**. Two optional drills (Scalene/SCM stretch; Shoulder CARs) take it to **9** for a maximal pass.
- **Do NOT** add to shoulder / hip / lowBack / T-spine / wrist — those are covered; further additions there would duplicate existing or staged moves.
- **Taxonomy note for T3:** the metadata `rehabCategory` vocabulary has **no `neck-*` or `elbow-*` slot** — integrating these 7 will require two new categories (suggest `neck-prehab` / `neck-mobility` and `elbow-prehab`) so the substrate can tag them.

---

**Sign-off:** T2 — 2026-06-08 17:38
