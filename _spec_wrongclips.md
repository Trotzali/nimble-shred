# Spec — Wrong-clip fixes (issue #14, Finding C)

**Type:** Read-only analysis / fix spec. No code changed. No git run.
**Targets:** `index.html` `exerciseMedia` object (L3044–3203, v61 working tree) — a later
**data-only** build edits it; this pass only specifies the changes.
**Source:** `_audit_links.md` Finding C (13 shared/duplicate video IDs).
**Method:** Re-resolved every app exercise through the real media path
(`mediaAliases` → `exerciseMedia`, mirroring `getExerciseMedia`) to find which
*app* exercise actually renders each borrowed clip. Candidate replacements were
sourced via web search and **liveness-checked through YouTube oEmbed** (HTTP 200 +
title match) on 2026-06-08 — the same endpoint the audit used.

---

## TL;DR

- Finding C lists **13 shared video IDs**. Resolved to the 163-exercise app, they
  map to **7 app exercises that show a genuinely wrong/borrowed clip** (worth
  fixing), **~5 "variant-borrow" cases that are acceptable** (same movement, minor
  difference), and **2 rows with no app impact** (dead media keys / alias resolves
  correctly). All 13 are itemised below so the count reconciles.
- Worst offender: **Cable Squat** — its `yt` *and* its `gif` are both barbell-squat
  assets (`BARBELL-SQUAT.gif` + `v=ultWZbUMPL8`, shared with the unused
  "Barbell Squat" media key). Fix both fields.
- **7 verified candidate replacements** are provided (oEmbed-200, title-matched).
  A visual spot-check before merge is still recommended (oEmbed proves the video is
  live and correctly *titled*, not that the footage is flawless).

> ⚠ **Dependency for "remove yt → search-fallback":** removing a `yt` only yields a
> useful link **if** audit Fix Option 5 (handler search-fallback) has shipped.
> Today, removing `yt` just hides the button (still better than a wrong clip, but
> not a search link). Where this spec says "remove → fallback", it presupposes
> Option 5. Until then, prefer the verified replacement IDs below.

---

## Fix table — worst mismatches first

| # | App exercise (media line) | Current WRONG `v=` | What the clip actually shows | Sev | Recommendation |
|---|---|---|---|---|---|
| 1 | **Cable Squat** (L3075) | `ultWZbUMPL8` | **Barbell back squat** (shared w/ unused "Barbell Squat" L3115; gif is also `BARBELL-SQUAT.gif`) | 🔴 HIGH | **Replace** yt → `D3fsGiG8WzY` ✓ + **also replace the gif** (it's barbell). |
| 2 | **Cable Y-Raise** (L3066) | `TU0hP7tdcwo` | **Upright row** (shared w/ Cable Upright Row L3065 + unused "Upright Row") | 🔴 HIGH | **Replace** yt → `NBkMIWWkIKQ` ✓ |
| 3 | **Single Arm Cable Chest Press** (L3049) | `8iPEnn-CzS8` | **DB incline / landmine press** (shared w/ Dumbbell Incline Press L3089 + unused "Landmine Press") | 🔴 HIGH | **Replace** yt → `w6Ar00OUUkg` ✓ |
| 4 | **Cable Abductor** (L3081) | `bU8yKk4vI3M` | **Seated leg-abductor machine** (shared w/ unused "Leg Abductor Machine") | 🟠 MED | **Replace** yt → `bGlm-qTnfTI` ✓ |
| 5 | **Cable Adductor** (L3082) | `VqzWOt6T7iQ` | **Seated leg-adductor machine** (shared w/ unused "Leg Adductor Machine") | 🟠 MED | **Replace** yt → `SIQrpq6YnT8` ✓ |
| 6 | **Lat Pulldown (Standing)** (L3052) | `CAwf7n6Luuc` | **Seated lat-pulldown machine** (shared w/ unused "Lat Pulldown Machine"); app move is a *kneeling cable* pulldown | 🟠 MED | **Replace** yt → `H-s-a2r0aB4` ✓ |
| 7 | **Cable Calf Raise** (L3080) | `JbyjNymZOt0` | **Calf-raise machine** (shared w/ unused "Calf Raise Machine") | 🟡 MED-LOW | **Replace** yt → `Z6l_MUXvonY` ✓ |
| 8 | **Cable Crossover** (L3050) | `taI4XduLpTk` | A **cable chest fly** (shared w/ Cable Chest Fly (High) L3046) | 🟡 LOW | **KEEP** (near-identical variant) *or* remove yt → fallback. Optional. |
| 9 | **Tricep Pushdown (Bar)** (L3068) | `2-LAMcpzODU` | A **tricep pushdown** (shared w/ Rope L3067) | 🟢 LOW | **KEEP** (same movement, attachment differs). Optional. |
| 10 | **Cable Hammer Curl** (L3071) | `TwD-YGVP4Bk` | A **hammer curl** (shared w/ DB Hammer Curl / "Hammer Curl") | 🟢 LOW | **KEEP** (same movement, cable vs DB). Optional. |
| 11 | **Goblet Squat** (L3104) | `MeIiIdhvXT4` | A **kettlebell goblet squat** (shared w/ unused "Kettlebell Goblet Squat") | 🟢 LOW | **KEEP** (KB ≈ DB goblet). |
| 12 | **DB Shrugs** → key "Dumbbell Shrug" (L3098) | `g6qbq4Lf1FI` | A **dumbbell shrug** — key is correctly named (shared w/ unused "Barbell Shrug") | ⚪ NONE | **No fix** — clip matches the app move. Liveness-check only. |
| 13 | *(no app exercise)* — "Decline Bench Press" L3111 / "Decline Dumbbell Press" L3185 | `LfyQBUKR8SE` | A decline press | ⚪ NONE | **No action.** Neither key is in the 163, so the button never renders. Optional dead-entry cleanup. |

`✓` = candidate liveness-checked via oEmbed (HTTP 200, title matches movement) on 2026-06-08.

---

## Verified candidate replacements (full detail)

Each was sourced for the *exact* app movement and confirmed live + correctly titled
via `https://www.youtube.com/oembed?url=...&format=json` → HTTP 200.
**Status = VERIFIED-LIVE (oEmbed 200, title-matched). Visual spot-check recommended pre-merge.**

| App exercise | New `v=` | Video title | Channel |
|---|---|---|---|
| Cable Squat | `D3fsGiG8WzY` | "How to do Cable Squats" | Compound Body |
| Cable Y-Raise | `NBkMIWWkIKQ` | "How To Cable Y-Raise (Grow Your Medial Delts) \| Form Tutorial" | Physique Development |
| Single Arm Cable Chest Press | `w6Ar00OUUkg` | "Single Arm Cable Chest Press" | OPEX Fitness |
| Cable Abductor | `bGlm-qTnfTI` | "How To Do A STANDING CABLE HIP ABDUCTION \| Exercise Demonstration…" | Live Lean TV |
| Cable Adductor | `SIQrpq6YnT8` | "How To Do A STANDING CABLE HIP ADDUCTION \| Exercise Demonstration…" | Live Lean TV |
| Lat Pulldown (Standing) | `H-s-a2r0aB4` | "Kneeling Cable Pull Down (Lat Pulldown Progression)" | Brookbush Institute |
| Cable Calf Raise | `Z6l_MUXvonY` | "How To Do: Cable Calf Raise \| Leg Workout Exercise" | Fitway - Workout Trainer |

### Exact edits (data-only; a later build applies these to `index.html`)
Replace only the `yt` value on each line (and the `gif` on Cable Squat):

```js
// L3075  Cable Squat — BOTH gif and yt are barbell-squat assets today
"Cable Squat": { gif: "<replace barbell gif with a real cable-squat gif/UNVERIFIED>", yt: "https://www.youtube.com/watch?v=D3fsGiG8WzY" },
// L3066  Cable Y-Raise (leave Cable Upright Row L3065 on TU0hP7tdcwo — the upright-row clip is correct for IT)
"Cable Y-Raise": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=NBkMIWWkIKQ" },
// L3049  Single Arm Cable Chest Press (leave Dumbbell Incline Press L3089 — clip is ~correct for an incline press)
"Single Arm Cable Chest Press": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=w6Ar00OUUkg" },
// L3081  Cable Abductor
"Cable Abductor": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=bGlm-qTnfTI" },
// L3082  Cable Adductor
"Cable Adductor": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=SIQrpq6YnT8" },
// L3052  Lat Pulldown (Standing)
"Lat Pulldown (Standing)": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=H-s-a2r0aB4" },
// L3080  Cable Calf Raise
"Cable Calf Raise": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=Z6l_MUXvonY" },
```

---

## Reconciliation: why "13 shared IDs" ≠ "13 app fixes"

The audit counted 13 *shared video IDs* in `exerciseMedia`. Many are shared between
an app exercise and a media key for a movement **not in the 163** (e.g. "Barbell
Squat", "Leg Abductor Machine", "Lat Pulldown Machine"). Those non-163 keys are
never rendered — but they're the tell for what the borrowed clip *actually* depicts,
which is exactly why the app exercise's clip is wrong.

- **7 real fixes** (#1–7): app exercise shows the wrong movement or wrong
  implement → verified replacements above.
- **4 acceptable variant-borrows** (#8–11): the shared clip is the *same* movement
  with a minor difference (rope vs bar, KB vs DB, high-fly vs crossover). Safe to
  KEEP; fix only if you want per-variant precision. When fixing, give the *wrong*
  partner a unique clip and leave the correctly-matched partner's `yt` alone.
- **2 no-op** (#12–13): "DB Shrugs" aliases to the correctly-named "Dumbbell Shrug"
  key (clip matches); the Decline pair are dead media keys with no app exercise.

Distinct app exercises whose clip is correct *as the partner* and must NOT be
repointed: Cable Upright Row (L3065), Cable Chest Fly (High) (L3046), Tricep
Pushdown (Rope) (L3067), Dumbbell Incline Press (L3089), "Hammer Curl" (DB).

## Notes / caveats
- **Separate from the one truly-dead URL** (Finding A): Cable Lateral Raise
  (`v=PPrzBWZDOhttps`, HTTP 400) — out of scope here, tracked in `_audit_links.md`.
- oEmbed-200 proves the candidate is **live** and **titled** for the right movement;
  a 30-second visual check before merge guards against a mistitled clip.
- Line numbers are current working tree (v61) and drift as sibling builds land —
  re-anchor by the `"<name>":` media key before editing.
- This is a **data-only** change set (the `exerciseMedia` object). No handler change
  is required for #1–11; the search-fallback (audit Option 5) is a separate handler
  build and is the prerequisite for any "remove yt" choice.
