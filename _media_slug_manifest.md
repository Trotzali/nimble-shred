# Media Slug Manifest — GymVisual pack unpacked + renamed

**Terminal:** T3 (read-only on index.html; filesystem/scratch only — no git, no repo GIFs).
**Pack:** `175-GIFs-pack-20260614T022951Z-3-001.zip` (529 MB) → 175 nested per-move zips, each with 1080/720/360/180.
**Chosen resolution:** **720p** (~0.7-0.9 MB/GIF; matches `_spec_media_hosting.md` §1 ~1 MB footprint and the 250px card).
**Scratch:** raw `C:\nimble-media\gymvisual_raw\` · slugged `C:\nimble-media\gymvisual_slugged\` (upload THIS to Supabase `exercise-gifs`).
**Naming:** `slug(canonicalName).gif` per `_spec_media_hosting.md` §2.

## Self-verify
| check | result |
|---|---|
| ordered IDs in mapping | 175 |
| slugged files written (OK) | **175** |
| missing (ordered ID with no pack file) | 0 |
| extra delivered files (no mapping) | 0 |
| zero-size files | 0 |
| mediaAliases (MERGE+SWAP) | 23 |
| outstanding (2 custom + 2 no-match) | 4 |

Result: **COMPLETE** — 175/175 ordered GIFs slugged.

---

## 1. Slugged files  (slug → source GymVisual ID → final filename → status)

| # | slug | source ID | final filename | size | status |
|--:|---|---|---|--:|---|
| 1 | a-skips | 319913 | a-skips.gif | 757 KB | OK |
| 2 | ankle-alphabet | 136813 | ankle-alphabet.gif | 696 KB | OK |
| 3 | arm-circles | 025413 | arm-circles.gif | 701 KB | OK |
| 4 | arnold-press | 213713 | arnold-press.gif | 826 KB | OK |
| 5 | banded-ankle-eversion-inversion | 312713 | banded-ankle-eversion-inversion.gif | 877 KB | OK |
| 6 | bear-crawl | 336013 | bear-crawl.gif | 856 KB | OK |
| 7 | bench-dip | 012913 | bench-dip.gif | 757 KB | OK |
| 8 | bicycle-crunch | 621113 | bicycle-crunch.gif | 619 KB | OK |
| 9 | bird-dog | 013513 | bird-dog.gif | 808 KB | OK |
| 10 | bodyweight-squat | 078713 | bodyweight-squat.gif | 638 KB | OK |
| 11 | box-jump | 050913 | box-jump.gif | 669 KB | OK |
| 12 | bulgarian-split-squat | 229013 | bulgarian-split-squat.gif | 668 KB | OK |
| 13 | burpees | 116013 | burpees.gif | 1056 KB | OK |
| 14 | cable-abductor | 1126613 | cable-abductor.gif | 912 KB | OK |
| 15 | cable-adductor | 1126713 | cable-adductor.gif | 799 KB | OK |
| 16 | cable-bicep-curl | 015613 | cable-bicep-curl.gif | 609 KB | OK |
| 17 | cable-calf-raise | 137513 | cable-calf-raise.gif | 863 KB | OK |
| 18 | cable-chest-fly-high | 015813 | cable-chest-fly-high.gif | 569 KB | OK |
| 19 | cable-chest-fly-low | 017913 | cable-chest-fly-low.gif | 816 KB | OK |
| 20 | cable-chest-fly-mid | 018813 | cable-chest-fly-mid.gif | 616 KB | OK |
| 21 | cable-chest-press | 106613 | cable-chest-press.gif | 1117 KB | OK |
| 22 | cable-crossover | 015513 | cable-crossover.gif | 494 KB | OK |
| 23 | cable-crunch | 017513 | cable-crunch.gif | 786 KB | OK |
| 24 | cable-donkey-kick | 442113 | cable-donkey-kick.gif | 908 KB | OK |
| 25 | cable-external-rotation | 023513 | cable-external-rotation.gif | 1571 KB | OK |
| 26 | cable-front-raise | 016213 | cable-front-raise.gif | 750 KB | OK |
| 27 | cable-hammer-curl | 016613 | cable-hammer-curl.gif | 635 KB | OK |
| 28 | cable-internal-rotation | 508813 | cable-internal-rotation.gif | 829 KB | OK |
| 29 | cable-kickback | 086013 | cable-kickback.gif | 1126 KB | OK |
| 30 | cable-kickback-glute | 758913 | cable-kickback-glute.gif | 1007 KB | OK |
| 31 | cable-lateral-raise | 017813 | cable-lateral-raise.gif | 885 KB | OK |
| 32 | cable-lunge | 335113 | cable-lunge.gif | 963 KB | OK |
| 33 | cable-overhead-press | 021913 | cable-overhead-press.gif | 630 KB | OK |
| 34 | cable-pull-through | 120613 | cable-pull-through.gif | 1038 KB | OK |
| 35 | cable-pullover-bench | 018413 | cable-pullover-bench.gif | 692 KB | OK |
| 36 | cable-rdl | 655213 | cable-rdl.gif | 883 KB | OK |
| 37 | cable-rear-delt-fly | 022513 | cable-rear-delt-fly.gif | 553 KB | OK |
| 38 | cable-reverse-wrist-curl | 021013 | cable-reverse-wrist-curl.gif | 719 KB | OK |
| 39 | cable-row-wide-grip | 021813 | cable-row-wide-grip.gif | 893 KB | OK |
| 40 | cable-shrugs | 022013 | cable-shrugs.gif | 811 KB | OK |
| 41 | cable-side-bend | 022213 | cable-side-bend.gif | 943 KB | OK |
| 42 | cable-squat | 334913 | cable-squat.gif | 870 KB | OK |
| 43 | cable-upright-row | 024613 | cable-upright-row.gif | 864 KB | OK |
| 44 | cable-wrist-curl | 024713 | cable-wrist-curl.gif | 750 KB | OK |
| 45 | cable-y-raise | 334213 | cable-y-raise.gif | 1220 KB | OK |
| 46 | calf-raise-bw | 041713 | calf-raise-bw.gif | 573 KB | OK |
| 47 | cat-cow-stretch | 458013 | cat-cow-stretch.gif | 772 KB | OK |
| 48 | childs-pose | 094513 | childs-pose.gif | 1213 KB | OK |
| 49 | chin-tuck | 314913 | chin-tuck.gif | 447 KB | OK |
| 50 | chin-ups | 132613 | chin-ups.gif | 701 KB | OK |
| 51 | close-grip-push-up | 025913 | close-grip-push-up.gif | 1268 KB | OK |
| 52 | concentration-curl | 029713 | concentration-curl.gif | 1135 KB | OK |
| 53 | cossack-squat | 256913 | cossack-squat.gif | 1655 KB | OK |
| 54 | couch-stretch | 455713 | couch-stretch.gif | 1038 KB | OK |
| 55 | crab-walk | 588113 | crab-walk.gif | 1182 KB | OK |
| 56 | curtsy-lunge | 631813 | curtsy-lunge.gif | 2433 KB | OK |
| 57 | db-floor-press | 366813 | db-floor-press.gif | 935 KB | OK |
| 58 | dead-bug | 027613 | dead-bug.gif | 1068 KB | OK |
| 59 | dead-hang | 505513 | dead-hang.gif | 705 KB | OK |
| 60 | decline-push-up | 028013 | decline-push-up.gif | 629 KB | OK |
| 61 | diamond-push-up | 028313 | diamond-push-up.gif | 1022 KB | OK |
| 62 | dips | 025113 | dips.gif | 642 KB | OK |
| 63 | dot-drill | 596913 | dot-drill.gif | 1619 KB | OK |
| 64 | duck-walk | 386713 | duck-walk.gif | 573 KB | OK |
| 65 | dumbbell-bench-press | 028913 | dumbbell-bench-press.gif | 885 KB | OK |
| 66 | dumbbell-curl | 029413 | dumbbell-curl.gif | 690 KB | OK |
| 67 | dumbbell-fly | 030813 | dumbbell-fly.gif | 968 KB | OK |
| 68 | dumbbell-incline-press | 031413 | dumbbell-incline-press.gif | 758 KB | OK |
| 69 | dumbbell-lunge | 033613 | dumbbell-lunge.gif | 1590 KB | OK |
| 70 | dumbbell-pullover | 037513 | dumbbell-pullover.gif | 1018 KB | OK |
| 71 | dumbbell-row | 123613 | dumbbell-row.gif | 831 KB | OK |
| 72 | dumbbell-shoulder-press | 040513 | dumbbell-shoulder-press.gif | 869 KB | OK |
| 73 | dumbbell-shrug | 040613 | dumbbell-shrug.gif | 718 KB | OK |
| 74 | face-pulls | 560913 | face-pulls.gif | 1097 KB | OK |
| 75 | farmers-walk | 213313 | farmers-walk.gif | 1252 KB | OK |
| 76 | flutter-kicks | 045913 | flutter-kicks.gif | 720 KB | OK |
| 77 | forearm-pronation-supination | 182113 | forearm-pronation-supination.gif | 708 KB | OK |
| 78 | frog-stretch | 257113 | frog-stretch.gif | 708 KB | OK |
| 79 | front-raise | 031013 | front-raise.gif | 662 KB | OK |
| 80 | glute-bridge | 247113 | glute-bridge.gif | 1231 KB | OK |
| 81 | goblet-squat | 176013 | goblet-squat.gif | 631 KB | OK |
| 82 | good-morning | 004413 | good-morning.gif | 750 KB | OK |
| 83 | hammer-curl | 031313 | hammer-curl.gif | 721 KB | OK |
| 84 | handstand-hold | 654513 | handstand-hold.gif | 622 KB | OK |
| 85 | high-knees | 047713 | high-knees.gif | 778 KB | OK |
| 86 | high-row-rope | 016713 | high-row-rope.gif | 733 KB | OK |
| 87 | inchworm | 147113 | inchworm.gif | 1512 KB | OK |
| 88 | incline-push-up | 049313 | incline-push-up.gif | 1094 KB | OK |
| 89 | inverted-row | 049913 | inverted-row.gif | 928 KB | OK |
| 90 | jefferson-curl | 1075213 | jefferson-curl.gif | 533 KB | OK |
| 91 | jump-squat | 051413 | jump-squat.gif | 590 KB | OK |
| 92 | jumping-jacks | 051613 | jumping-jacks.gif | 660 KB | OK |
| 93 | jumping-lunge | 514813 | jumping-lunge.gif | 565 KB | OK |
| 94 | kick-through | 633513 | kick-through.gif | 2211 KB | OK |
| 95 | l-sit | 140213 | l-sit.gif | 672 KB | OK |
| 96 | lat-pulldown-standing | 019813 | lat-pulldown-standing.gif | 903 KB | OK |
| 97 | lateral-bounds | 056313 | lateral-bounds.gif | 748 KB | OK |
| 98 | lateral-raise | 033413 | lateral-raise.gif | 811 KB | OK |
| 99 | lateral-shuffle | 425713 | lateral-shuffle.gif | 1730 KB | OK |
| 100 | leg-raise | 047213 | leg-raise.gif | 576 KB | OK |
| 101 | low-step-up-fast | 080113 | low-step-up-fast.gif | 487 KB | OK |
| 102 | lu-raise | 1085813 | lu-raise.gif | 946 KB | OK |
| 103 | lunge-bw | 061213 | lunge-bw.gif | 1396 KB | OK |
| 104 | lying-cable-curl | 018313 | lying-cable-curl.gif | 703 KB | OK |
| 105 | mcgill-curl-up | 301613 | mcgill-curl-up.gif | 630 KB | OK |
| 106 | mountain-climbers | 063013 | mountain-climbers.gif | 1316 KB | OK |
| 107 | neck-cars | 399413 | neck-cars.gif | 1029 KB | OK |
| 108 | nordic-curl | 774613 | nordic-curl.gif | 806 KB | OK |
| 109 | open-book-stretch | 460113 | open-book-stretch.gif | 619 KB | OK |
| 110 | overhead-cable-extension | 019413 | overhead-cable-extension.gif | 590 KB | OK |
| 111 | pallof-press | 120213 | pallof-press.gif | 894 KB | OK |
| 112 | pigeon-pose | 194313 | pigeon-pose.gif | 647 KB | OK |
| 113 | pike-push-up | 292113 | pike-push-up.gif | 1171 KB | OK |
| 114 | pistol-squat | 298413 | pistol-squat.gif | 892 KB | OK |
| 115 | plank | 046313 | plank.gif | 505 KB | OK |
| 116 | plank-jack | 147813 | plank-jack.gif | 620 KB | OK |
| 117 | plate-pinch | 104413 | plate-pinch.gif | 822 KB | OK |
| 118 | pogo-hops | 907013 | pogo-hops.gif | 597 KB | OK |
| 119 | pop-squat | 078513 | pop-squat.gif | 723 KB | OK |
| 120 | powell-raise | 1033013 | powell-raise.gif | 1063 KB | OK |
| 121 | prone-press-up | 148213 | prone-press-up.gif | 599 KB | OK |
| 122 | prone-y-t-w-raise | 854613 | prone-y-t-w-raise.gif | 904 KB | OK |
| 123 | pull-up | 065213 | pull-up.gif | 665 KB | OK |
| 124 | push-up | 288113 | push-up.gif | 1289 KB | OK |
| 125 | renegade-row | 298013 | renegade-row.gif | 1916 KB | OK |
| 126 | reverse-crunch | 067113 | reverse-crunch.gif | 955 KB | OK |
| 127 | reverse-grip-pushdown | 020713 | reverse-grip-pushdown.gif | 839 KB | OK |
| 128 | reverse-lunge-to-knee-drive | 741213 | reverse-lunge-to-knee-drive.gif | 1263 KB | OK |
| 129 | reverse-plank | 086713 | reverse-plank.gif | 729 KB | OK |
| 130 | romanian-deadlift-dumbbell | 145913 | romanian-deadlift-dumbbell.gif | 766 KB | OK |
| 131 | russian-twist | 068713 | russian-twist.gif | 1519 KB | OK |
| 132 | scapular-push-up | 411713 | scapular-push-up.gif | 1013 KB | OK |
| 133 | scorpion-stretch | 463113 | scorpion-stretch.gif | 858 KB | OK |
| 134 | seated-cable-row | 086113 | seated-cable-row.gif | 844 KB | OK |
| 135 | seated-calf-raise | 008813 | seated-calf-raise.gif | 885 KB | OK |
| 136 | shoulder-dislocates | 460713 | shoulder-dislocates.gif | 1110 KB | OK |
| 137 | side-lunge | 297213 | side-lunge.gif | 779 KB | OK |
| 138 | side-plank | 071513 | side-plank.gif | 78 KB | OK |
| 139 | single-arm-cable-chest-press | 121113 | single-arm-cable-chest-press.gif | 908 KB | OK |
| 140 | single-arm-cable-row | 018913 | single-arm-cable-row.gif | 880 KB | OK |
| 141 | single-leg-glute-bridge | 479113 | single-leg-glute-bridge.gif | 797 KB | OK |
| 142 | single-leg-rdl | 497113 | single-leg-rdl.gif | 906 KB | OK |
| 143 | skater-hops | 336113 | skater-hops.gif | 1616 KB | OK |
| 144 | skull-crusher | 035113 | skull-crusher.gif | 1095 KB | OK |
| 145 | squat-to-calf-raise | 416013 | squat-to-calf-raise.gif | 886 KB | OK |
| 146 | standing-cable-crunch | 022613 | standing-cable-crunch.gif | 713 KB | OK |
| 147 | standing-cable-row | 509013 | standing-cable-row.gif | 841 KB | OK |
| 148 | standing-hip-cars | 341113 | standing-hip-cars.gif | 1113 KB | OK |
| 149 | standing-knee-to-elbow | 044213 | standing-knee-to-elbow.gif | 1532 KB | OK |
| 150 | standing-oblique-twist | 485513 | standing-oblique-twist.gif | 734 KB | OK |
| 151 | step-up | 043113 | step-up.gif | 509 KB | OK |
| 152 | straight-arm-pulldown | 023813 | straight-arm-pulldown.gif | 922 KB | OK |
| 153 | sumo-squat-db | 232213 | sumo-squat-db.gif | 530 KB | OK |
| 154 | superman | 080413 | superman.gif | 486 KB | OK |
| 155 | svend-press | 085613 | svend-press.gif | 567 KB | OK |
| 156 | swimmers | 161213 | swimmers.gif | 427 KB | OK |
| 157 | thoracic-bridge | 455313 | thoracic-bridge.gif | 1340 KB | OK |
| 158 | thoracic-extension | 1157213 | thoracic-extension.gif | 580 KB | OK |
| 159 | thread-the-needle | 590413 | thread-the-needle.gif | 565 KB | OK |
| 160 | tibialis-raise | 927213 | tibialis-raise.gif | 1139 KB | OK |
| 161 | toe-touch | 321213 | toe-touch.gif | 676 KB | OK |
| 162 | tricep-kickback | 496113 | tricep-kickback.gif | 1020 KB | OK |
| 163 | tricep-pushdown-bar | 160513 | tricep-pushdown-bar.gif | 994 KB | OK |
| 164 | tricep-pushdown-rope | 020013 | tricep-pushdown-rope.gif | 703 KB | OK |
| 165 | tuck-jumps | 157013 | tuck-jumps.gif | 1210 KB | OK |
| 166 | upper-trap-levator-stretch | 179113 | upper-trap-levator-stretch.gif | 791 KB | OK |
| 167 | v-up | 082513 | v-up.gif | 504 KB | OK |
| 168 | wall-slides | 294113 | wall-slides.gif | 1038 KB | OK |
| 169 | wide-grip-push-up | 131113 | wide-grip-push-up.gif | 947 KB | OK |
| 170 | woodchopper-high-to-low | 1125113 | woodchopper-high-to-low.gif | 578 KB | OK |
| 171 | woodchopper-low-to-high | 819313 | woodchopper-low-to-high.gif | 788 KB | OK |
| 172 | worlds-greatest-stretch | 463313 | worlds-greatest-stretch.gif | 794 KB | OK |
| 173 | wrist-extensor-stretch | 184913 | wrist-extensor-stretch.gif | 617 KB | OK |
| 174 | wrist-flexor-stretch | 185013 | wrist-flexor-stretch.gif | 643 KB | OK |
| 175 | zottman-curl | 043913 | zottman-curl.gif | 1102 KB | OK |

---

## 2. mediaAliases  (entry → reuses canonical file; T1 Phase-B re-point)

These entries get **no file of their own** — they point at an already-uploaded slug.

| entry | entry slug | kind | reuses canonical | file (.gif) |
|---|---|---|---|---|
| ATG Split Squat | atg-split-squat | SWAP | Bulgarian Split Squat | bulgarian-split-squat.gif |
| Beast Reach | beast-reach | SWAP | Bear Crawl | bear-crawl.gif |
| Cable Curl (Behind Back) | cable-curl-behind-back | SWAP | Cable Bicep Curl | cable-bicep-curl.gif |
| Cable French Press | cable-french-press | MERGE | Overhead Cable Extension | overhead-cable-extension.gif |
| Cable Front Squat | cable-front-squat | MERGE | Cable Squat | cable-squat.gif |
| Cable Hip Abduction (Standing) | cable-hip-abduction-standing | MERGE | Cable Abductor | cable-abductor.gif |
| Cable Hip Adduction (Standing) | cable-hip-adduction-standing | MERGE | Cable Adductor | cable-adductor.gif |
| Cable Zercher Squat | cable-zercher-squat | SWAP | Cable Squat | cable-squat.gif |
| Deep Squat Hold | deep-squat-hold | SWAP | Bodyweight Squat | bodyweight-squat.gif |
| Eccentric Step Down | eccentric-step-down | SWAP | Step-up | step-up.gif |
| Elbow CARs | elbow-cars | SWAP | Forearm Pronation-Supination | forearm-pronation-supination.gif |
| Fast Feet Shuffle | fast-feet-shuffle | SWAP | Lateral Shuffle | lateral-shuffle.gif |
| Horse Stance Hold | horse-stance-hold | SWAP | Sumo Squat (DB) | sumo-squat-db.gif |
| Knee-to-Wall Ankle Rock | knee-to-wall-ankle-rock | SWAP | Tibialis Raise | tibialis-raise.gif |
| March in Place | march-in-place | SWAP | High Knees | high-knees.gif |
| No-Jump Burpee | no-jump-burpee | SWAP | Burpees | burpees.gif |
| Quadruped Thoracic Rotation | quadruped-thoracic-rotation | SWAP | Thread the Needle | thread-the-needle.gif |
| Reverse Nordic Curl | reverse-nordic-curl | SWAP | Couch Stretch | couch-stretch.gif |
| Shadow Boxing | shadow-boxing | SWAP | Jumping Jacks | jumping-jacks.gif |
| Sleeper Stretch | sleeper-stretch | SWAP | Cable Internal Rotation | cable-internal-rotation.gif |
| Slow Mountain Climber | slow-mountain-climber | SWAP | Mountain Climbers | mountain-climbers.gif |
| Step Touch | step-touch | SWAP | Lateral Shuffle | lateral-shuffle.gif |
| Wrist Rocks | wrist-rocks | SWAP | Wrist Flexor Stretch | wrist-flexor-stretch.gif |

---

## 3. Outstanding  (NOT in the pack — handle separately)

### Custom (keyframe method)
- **Copenhagen Plank** (slug `copenhagen-plank`) — keyframe method
- **Terminal Knee Extension** (slug `terminal-knee-extension`) — keyframe method

### No GymVisual match (left hotlinked / YouTube)
- **Bayesian Curl** (slug `bayesian-curl`) — no confident GymVisual match (currently inspireus)
- **90/90 Hip Switch** (slug `90-90-hip-stretch`) — no confident GymVisual match (currently inspireus)

---

*GIFs live only in the scratch dir; none added to the repo or git. index.html untouched.*
