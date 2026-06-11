# Audit — Emoji & mojibake inventory (prep for design P7)

**Type:** Read-only audit. No code changed, no git, `index.html` untouched.
**Target:** `index.html` (v67-line tree). Anchors are by **line number** (exact)
+ nearest function/section (re-anchor by name before editing; lines drift).

## Totals (exact, scanned byte-level)
- **137** non-ASCII display glyphs across **45** distinct codepoints, split:
  - **109 emoji-proper** = 56 pictographic (U+1F300–1FAFF) + 29 symbol/dingbat
    emoji (U+2600–27BF, 2B00–2BFF) + 4 play/▸ triangles (U+25B6/25B8) +
    13 check/cross dingbats (✓ U+2713 ×4, ✕ U+2715 ×9) + 7 keycap/misc — this
    is the design brief's "~109".
  - **22** plain arrows (U+2190–2194: ← → ↑ ↓ ↔) used as trend/label text.
  - **+13 combining modifiers** not counted above: **12× U+FE0F** variation
    selector + **1× U+200D** ZWJ (in 😵‍💫). These ride on glyphs in the 137 and
    must be deleted *with* their base char (see Byte-safety).
- **4 mojibake bytes** = **U+00C2 `Â`** at L2004, L2633(×2), L2691 — each a
  `Â°` CP1252-corrupted degree sign.
- **Benign non-ASCII (NOT in scope, leave):** `×` U+00D7 ×5 (weight×reps display,
  intentional typography), `·` U+00B7 ×1 (L4383 separator), `§` U+00A7 ×4
  (L3587/3638/3641/3682 — JS comment section-refs), `—`/`'`/`…` general
  punctuation ×93 (copy). Listed so a future "strip all non-ASCII" pass doesn't
  mangle real typography.

`IC` SVG registry (L1941, 30 icons) available for swaps: `push pull legs cardio
nimble rest fire run swim walk row bike check cross robot target warn stop brain
refresh bulb pin chat doc chart home hotel party book download`.

---

## BATCH 1 — Mojibake `Â°` (P0, isolated, 4 sites) ⚑ byte-safety critical
All four sit in **exercise `guide.prep` strings** (`window.allExercises`).

| Line | Function/section | Char | Context (exercise text) | Replacement |
|---|---|---|---|---|
| 2004 | `allExercises` — Cable Chest Fly (High) prep | `Â°` | "lean torso 30**Â°** forward" | `30°` (delete `Â`) |
| 2633 | `allExercises` — 90/90-type mobility prep | `Â°`×2 | "bent 90**Â°** in front, back leg 90**Â°** to side" | `90°` ×2 |
| 2691 | `allExercises` — Cable Donkey Kick prep | `Â°` | "Keep knee bent 90**Â°**" | `90°` |

**Byte-safety notes (the CP1252 history):**
- File is **UTF-8, no BOM, CRLF**. `Â°` = bytes `C3 82 C2 B0`; the intended `°`
  (U+00B0) = `C2 B0`. The corruption is an extra `Â` (`C3 82`) prepended — it
  arose when UTF-8 `°` bytes (`C2 B0`) were once decoded as **CP1252**
  (`C2`→`Â`, `B0`→`°`) and re-saved UTF-8.
- **Fix = delete the `Â` (U+00C2) only**, keep `°`. Do it with an explicit
  **UTF-8 read/write** and assert the non-ASCII byte count drops by exactly the
  `Â` bytes (mirror the `fix_howto_typos.py` invariant check).
- **Do NOT open/save this file in a CP1252/ANSI editor** — a single ANSI round-
  trip re-corrupts *all* 137 emoji, not just these. Any tool touching the file
  must be UTF-8-pinned.
- **Zero-risk alternative:** replace `Â°` → ` degrees` (or `deg`), removing the
  non-ASCII entirely at these 4 sites (also drops the `°`). Trade-off: "90
  degrees" vs "90°". Recommend `°`-keep + UTF-8 discipline; offer pure-ASCII if
  the build can't guarantee the editor encoding.

---

## BATCH 2 — Console/comment glyphs (non-user-facing → delete, zero UI risk)
~20 instances in `console.log`/comments only; never rendered to users.

| Char | U+ | Lines | Anchor | Replacement |
|---|---|---|---|---|
| ✅ | 2705 | 16,17,18,3218,7292,7310,7335,7359,7391,7446 | head comments; `loadPreloadedImages`; supabase init/sync logs | **delete** (drop leading emoji from log string) |
| 📥 | 1F4E5 | 7320,7345,7369,7408,7422,7441 | cloud-load logs | **delete** |
| 🔄 | 1F504 | 7271 | supabase init log | **delete** |
| 🆔 | 1F194 | 7286 | user-id log | **delete** |
| ❌ | 274C | 7294 | supabase init error log | **delete** (`console.error` carries severity) |
| ← | 2190 | 3223 | init comment `// ← Load GIFs` | **delete** |

Single safe sweep; no DOM/visual impact. Lowest priority, lowest risk.

---

## BATCH 3 — Modal/close `✕` → `IC.cross` (8 sites, one consistent affordance)

| Char | U+ | Lines | Anchor | Replacement |
|---|---|---|---|---|
| ✕ | 2715 | 1745,1782,1834,1845,1903 | close buttons: consultation / custom-builder / exercise-detail / GPS-stop / plan-generator modals | `IC.cross` (or keep `✕` glyph, but standardise) |
| ✕ | 2715 | 4438 | `renderWorkoutHistory` delete-set btn (title="Delete") | `IC.cross` |
| ✕ | 2715 | 6111 | equipment-profile delete btn | `IC.cross` |
| ✕ | 2715 | 7179 | `showNotification` dismiss btn | `IC.cross` |

Note L1845 is `✕ Stop` (text follows) and L8258 already uses `IC.robot` in the
same notification family — good precedent for the SVG swap.

---

## BATCH 4 — Set-action `✓` / tutorial `▶` (workout card)

| Char | U+ | Lines | Anchor | Replacement |
|---|---|---|---|---|
| ✓ | 2713 | 3772 | `renderWorkout` mini-summary tick | `IC.check` |
| ✓ | 2713 | 3950 | `renderWorkout` "✓ Log Set" btn | `IC.check` + text |
| ✓ | 2713 | 3991 | `renderWorkout` "✓ Finish Workout" btn | `IC.check` + text |
| ✓ | 2713 | 4437 | history save-set btn (title="Save") | `IC.check` |
| ▶ | 25B6 | 3802 | `renderWorkout` "▶ Watch Form Tutorial" | keep glyph **or** CSS triangle (no play IC) |
| ▶ | 25B6 | 5900 | `viewExerciseDetails` tutorial link | keep / CSS triangle |
| ▸ | 25B8 | 223,4394 | CSS `::before` bullet (L223); inline history caret (L4394) | keep (decorative); CSS `content` |

---

## BATCH 5 — Header/label emoji with a DIRECT `IC` swap (clean)

| Char | U+ | Lines | Context · anchor | Replacement |
|---|---|---|---|---|
| 📊 | 1F4CA | 1361,5598,7702 | "Weekly Briefing" h3; profile/consult "experience" tag | `IC.chart` |
| 📊 | 1F4CA | 4066 | `getProgression` assessment-suggest **string** | `IC.chart` or plain text |
| 📋 | 1F4CB | 1378,5522,7818 | "Workout History" h3; plan-overview h3; plan-ready msg | `IC.doc` |
| 🎯 | 1F3AF | 1310,3891,5596,7699 | RPE "Focused" tag; progression suggest; profile "goal" tag | `IC.target` |
| 🔥 | 1F525 | 1314 | RPE "Great Pump" tag | `IC.fire` |
| 💡 | 1F4A1 | 5018 | alternatives/tip line | `IC.bulb` |
| ⚠️ | 26A0+FE0F | 1313,3822,4152,5099,5599,7704 | RPE "Pain" tag; progression warning; stall hint; analytics; profile/consult "injuries" | `IC.warn` (drop FE0F with base) |
| 🚴 | 1F6B4 | 5963 | `logCardioSession` "Cardio logged! 🚴" toast | `IC.bike` or **delete** |
| 🔄 | 1F504 | — | (console only — Batch 2) | — |

---

## BATCH 6 — Emoji with NO `IC` equivalent → **design decision (P7)**: extend `IC` or keep
These are user-facing but the registry has no matching SVG. P7 should decide:
add new `IC.*` icons, or keep the emoji deliberately, or plain-text.

| Char | U+ | Count·Lines | Context · anchor | Suggested |
|---|---|---|---|---|
| 🏋️ | 1F3CB+FE0F | 3 · 1216,1744,7703 | gym gear btn; consultation h3; consult "equipment" tag | new `IC.gym` (or keep) |
| 🔩 | 1F529 | 1 · 1217 | "Dumbbells" gear btn | new `IC.dumbbell` |
| 🤸 | 1F938 | 1 · 1218 | "Bodyweight" gear btn | new `IC.bodyweight` |
| 🗑 | 1F5D1 | 2 · 1379,4400 | "Clear All" / "Delete Day" btns | new `IC.trash` |
| 🔍 | 1F50D | 3 · 4828,4839,4847 | encyclopedia empty-state | new `IC.search` (or keep) |
| 🔧 | 1F527 | 1 · 5162 | "Mechanic" analytics icon | new `IC.wrench` |
| ⚖️ | 2696+FE0F | 1 · 5149 | "Deload Detective" icon | new `IC.scale` |
| 🚫 | 1F6AB | 1 · 5117 | analytics insight icon | new `IC.block` or keep |
| 📉 | 1F4C9 | 1 · 5072 | declining-trend insight icon | new `IC.trendDown` or keep |
| 📅 | 1F4C5 | 1 · 7700 | consult "days/wk" tag | new `IC.calendar` |
| 🎂 | 1F382 | 2 · 5597,7701 | profile/consult "age" tag | keep (or `IC.calendar`) |
| ✨ | 2728 | 3 · 7727,7734,8147 | "Build My Workout/Plan" btns | keep (decorative) or delete |
| 🟢/⚪ | 1F7E2/26AA | 2 · 5538 | plan-calendar current-day dot | CSS colored dot |
| ➤ | 27A4 | 1 · 1754 | consult send btn | new `IC.send` or keep |
| 💪 | 1F4AA | 6 · 1266,1293,1334,7743,8031,(3304 label) | check-in "Fresh"; RPE hero; "Fitness Assessment" btn; assessment toast | keep (brand glyph) — no muscle IC |
| 👍 😩 🤕 | 1F44D/629/915 | 1271/1276/1281 +labels 3305/3306/3307 | check-in option faces + `checkInConfig.label` | **keep** (the feeling UI *is* the emoji) |
| 😵‍💫 🏆 | 1F635+ZWJ+1F4AB / 1F3C6 | 1311,1312 | RPE "Distracted"/"New PB" tags | keep or `IC.party`/text |
| ❌ | 274C | 6262 | `importImages` error `alert('❌ …')` | **delete** (alert conveys error) |

**`checkInConfig` (L3304–3307)** holds 💪/👍/😩/🤕 inside `.label` strings — if
P7 keeps the check-in faces, these stay; if it swaps to IC, update both the modal
HTML (L1266–1281) **and** the config labels together (paired sites).

---

## BATCH 7 — Trend/pattern arrows in text (keep, or ASCII-normalize — low priority)
Semantic glyphs inside template strings; render fine, but non-ASCII.

| Char | U+ | Count·Lines | Context · anchor | Suggested |
|---|---|---|---|---|
| → | 2192 | 12 · 1689,1889,3863,3953,4130,4142,5074,5101,7072,7822 | Garmin step ("Profile → Settings"); "Next Exercise →"; progression "same weight"; analytics "a → b → c"; insight arrow | keep (or ASCII `->`) |
| ↑ | 2191 | 4 · 3821,3863,4124,4698 | progression-up badge/hint; weekly-briefing risers | keep (or `+`) |
| ↓ | 2193 | 3 · 3863,4136,4707 | progression-down/deload; fallers | keep (or `-`) |
| ↔️⬆️⬇️ | 2194/2B06/2B07 +FE0F | 4 · 8099,8100 | movement-pattern labels (h_push/v_push/h_pull/v_pull) | map to `IC.push`/`IC.pull`? or keep |
| 🦵 🔗 | 1F9B5/1F517 | 2 · 8101 | "Squat Pattern"/"Hip Hinge" labels | `IC.legs` / keep |

These are display-string edits with no behaviour change; batch last or skip.
If the movement-pattern labels (8099–8101) get IC-ified, note `IC.push`/`IC.pull`
already exist and fit h_push/h_pull.

---

## Build sequencing (each row = one safe, single-category build)
1. **Batch 1 (mojibake)** — P0, UTF-8-pinned, byte-asserted. Smallest, isolated.
2. **Batch 2 (console)** — trivial delete, zero UI risk.
3. **Batch 3 (✕→IC.cross)** — one affordance, 8 mechanical swaps, visually verifiable.
4. **Batch 4 (✓/▶ workout card)** — contained to `renderWorkout`/history/detail.
5. **Batch 5 (direct IC swaps)** — clean 1:1 emoji→IC mappings.
6. **Batch 6 (no-IC emoji)** — **gated on P7 decision** (extend `IC` vs keep); do
   after the registry direction is set; touch paired sites (modal + config) together.
7. **Batch 7 (text arrows)** — optional polish; defer or skip.

**Cross-batch invariant:** every build that edits this file must read/write UTF-8
(no BOM, CRLF preserved) and verify the non-ASCII byte delta equals exactly the
glyphs intended for that batch — the CP1252 history means an encoding slip
silently corrupts every other emoji. Reuse the `fix_howto_typos.py` byte-count
assertion pattern.

— T4, 2026-06-11 14:35 (+10:00)

