# Code-health audit — index.html (single-file app)

**Terminal:** T2 (READ-ONLY — `index.html` not edited, no git). Static analysis only.
**Scope:** `index.html` — **9,459 lines** (1 style block L37–1233, 3 script blocks; packs + `exercise-metadata.js` now wired in at L3143–3159). The QA-catch treatment for code.
**Method:** Node static pass (function defs vs reference counts, identical-body hashing, brace-span lengths, `localStorage.getItem` key tallies, listener/timer/console counts) + CSS-selector reference scan, then manual verification of every flagged hit (false positives removed below).
**Constraint honoured:** *no behaviour changes proposed* — this is a prioritised cleanup inventory for a future T1 pass. Line numbers indicative (drift as builds land).

---

## P1 — Dead code, zero consumers (safe deletes, high value)

### 1.1 Dead functions (11) — defined, **never referenced anywhere** (incl. no `onclick` string)
Each has exactly 1 textual occurrence (its own definition). Verified by full-file bareword scan.

| location | function | note / likely origin |
|---|---|---|
| L6359 | `getEquipmentNorm()` | metadata accessor stub — no caller |
| L6369 | `getAlternatives()` | metadata accessor stub — no caller |
| L6381 | `getLaterality()` | metadata accessor stub — no caller |
| L6800 | `openGifSearch()` | GIF-search admin tooling |
| L6812 | `removeExerciseGif()` | GIF admin tooling |
| L6820 | `pasteImageUrl()` (~32 lines) | GIF admin tooling |
| L7297 | `capitalizeFirst()` | orphan utility |
| L7857 | `loadWorkoutsFromCloud()` | superseded cloud-restore variant |
| L8456 | `startAIPlanWizard()` | v58 back-compat shim (consultation replaced the wizard) |
| L8457 | `closeAIWizard()` | v58 back-compat shim |
| L9389 | `notifyUserOfAIUpdate()` (~19 lines) | parked Garmin daily-update notifier |

- **Risk:** Low. **Action:** delete; re-grep each name before removal to confirm no late-added string ref.
- **Note:** the 3 metadata accessor stubs (`getAlternatives`/`getEquipmentNorm`/`getLaterality`) are the *only* live touch-points of the now-loaded `exerciseMeta` (only **4** `exerciseMeta` refs in the whole file). The substrate is wired (L3159) but **not yet consumed** by any feature — keep the metadata load, but the accessors are dead today. Confirm they aren't an intended public API before deleting.

### 1.2 Duplicate function — `downloadBlob` defined **twice, identical body**
- **Location:** L8852 **and** L8867 (byte-identical). **Risk:** none (second silently wins). **Action:** delete one. *(Carryover of prior audit L-05 — still live.)*

### 1.3 Dead GIF-search / image-admin tooling (function + CSS cluster)
- `openGifSearch`/`removeExerciseGif`/`pasteImageUrl` (P1.1) + CSS `.gif-grid` / `.gif-item` / `.gif-actions` (defined, no live consumer) are a self-contained dead **dev tool** for hand-pasting GIF URLs. With the GymVisual media pipeline + `loadPreloadedImages` (L3360), it's obsolete.
- **Risk:** Low. **Action:** remove the tooling + its CSS together.

### 1.4 Dead CSS selectors (defined in `<style>`, referenced nowhere)
Genuinely unused (verified — excludes false positives, see note): **`.muscle-badge`**, **`.strength-profile-card`**, **`.gif-grid`/`.gif-item`/`.gif-actions`**, utilities **`.text-center`**, **`.row-wrap`**, **`.mb-10`**, **`.mt-10`**, and **`.md`** (verify).
- **Risk:** trivial. **Action:** delete declarations.
- ⚠ **False positives excluded** (do NOT remove): `.day-bubble`, `.workout-type-{push,pull,legs,cardio,nimble,rest}`, `.encyclopedia-section` — these are composed dynamically in JS template strings (`\`day-bubble workout-type-${type}\``) so they never appear as literal selectors but are very much live.

---

## P2 — Parked Recovery / Garmin subsystem (large dead-but-intentional cluster — decision-gated)

The Recovery tab is parked: nav button `display:none` (L1857) and `switchTab` **redirects `garmin → coach`** (L3435) — so `#view-garmin` (L1750–~1855) is **unreachable**. Everything hanging off it is therefore dead-by-reachability:

| location | item | ~lines |
|---|---|--:|
| L3447 | `if(tab==='garmin') renderRecoveryScorecard();` | dead branch (unreachable past the L3435 redirect) |
| L5205 | `renderRecoveryScorecard()` | ~146 |
| L7368 | `analyzeGarminData()` | ~171 |
| ~L7551–7667 | Garmin upload/analysis/render helpers | ~120 |
| L8782+ | Daily-AI-update subsystem (`checkDailyUpdates`/`performDailyUpdate`/`notifyUserOfAIUpdate`) | ~80 |
| L1750–1855 | `#view-garmin` markup | ~105 |

- **Risk:** Medium (it's a coherent ~700-line feature, not stray cruft). **Action — decision, not auto-delete:** if Garmin is roadmapped, **leave parked** (it's correctly gated, harmless) and just remove the dead `L3447` branch + park-comment the render fns. If Garmin is abandoned, excise the whole cluster in one build. *Inventory only — no behaviour change recommended here.*

---

## P3 — Performance smells

### 3.1 Repeated `localStorage` parse of the same large blobs
`localStorage.getItem` appears **73×**; hottest keys re-parsed many times:

| key | getItem count | where |
|---|--:|---|
| `exerciseHistory` | **18** | every analytics render + per-exercise progression lookups |
| `completedWorkouts` | **14** | adherence, calendar, briefing, deload, recovery |
| `currentPlan` | 7 · `rpeHistory` 6 · `consultProfile` 4 · `strengthProfile` 3 | analytics/plan |

- **Smell:** opening the **Plan tab** runs `renderPlanOverview + renderPlanCalendar + renderWorkoutHistory + renderWeeklyBriefing + renderDeloadDetective + renderMechanic` back-to-back (switchTab L~3441), and **each independently `JSON.parse`s `exerciseHistory` + `completedWorkouts`** — the same multi-KB blobs parsed ~6× per tab open. `renderWorkout` similarly re-parses `exerciseHistory` per exercise in its loop.
- **Risk:** Low (correctness fine; mobile jank on large histories). **Action:** parse each key once per render cycle and pass the object down (a tiny `loadState()` cache cleared on write). *No behaviour change — pure read consolidation.*

### 3.2 `renderWorkout` re-parse + full rebuild per set log
`renderWorkout` (P4.1) rebuilds the entire `#workout-list` `innerHTML` on every `logSet`, re-reading history/progression for all exercises. **Action:** note for the split (P4) — candidate for targeted row update rather than full re-render. Inventory only.

---

## P4 — Oversized functions (split candidates)

| location | function | ~lines | live? |
|---|---|--:|---|
| L4047–4307 | `renderWorkout()` | **261** | ✅ live (hottest path) |
| L4880–5046 | `renderWeeklyBriefing()` | 167 | ✅ |
| L5051–5200 | `renderDeloadDetective()` | 150 | ✅ |
| L5355–5504 | `renderMechanic()` | 150 | ✅ |
| L7368–7538 | `analyzeGarminData()` | 171 | ⛔ parked (P2) |
| L5205–5350 | `renderRecoveryScorecard()` | 146 | ⛔ parked (P2) |

- **Risk:** Low. **Action:** split the 4 live ones into compute-vs-render halves (e.g. `renderWorkout` → progress-bar / completed-list / active-card / rest-timer sections). The 2 parked ones inherit P2's decision. Inventory only.

---

## P5 — Duplicate / near-duplicate logic & fragile patterns

| location | issue | risk | action |
|---|---|---|---|
| L3525 `toggleNiggleChip` **==** L4596 `toggleRPETag` | **identical 3-line body** (two chip-toggle handlers) | low | consolidate to one parameterised toggler |
| L4047 `renderWorkout` / L4507 `finishWorkout` **reassigned** at L8609 / L8675 | assessment **monkey-patches** `window.renderWorkout`/`finishWorkout` (wrap originals) | medium | fragile (wrap order, double-patch guard exists); note for the renderWorkout split — fold assessment branch in rather than reassign |
| L3447 `if(tab==='garmin') renderRecoveryScorecard()` | dead branch after L3435 redirect | trivial | remove with P2 |
| analyzer artifact | `onclick ×3` "defs" | n/a | not real — `element.onclick = function` assignments, ignore |

---

## P6 — Leftover debug / raw-data hooks

| location | item | action |
|---|---|---|
| 52× `console.log/warn/error/info` across the file | incl. L3367 `'✅ Pre-loaded … media'`, L7834 `'✅ Supabase initialized … v53'`, strength-profile/cloud logs | gate behind a `DEBUG` flag or strip for prod |
| L3360 `loadPreloadedImages()` + `gif_*` localStorage writes | bulk-writes media URLs into localStorage on every load; pairs with the dead GIF admin tooling (P1.3) | review whether still needed post-GymVisual pipeline |
| GIF-admin tooling (P1.3) | raw URL-paste dev hook shipped to prod | remove |
| version string drift | console says `v53` (L7834) while app is ~v100+ | align to a single `APP_VERSION` const (carryover of prior audit L-01) |

---

## P7 — Listeners / timers (low, verify-not-leak)

- **`addEventListener` 12× vs `removeEventListener` 1×.** Most are one-shot (`DOMContentLoaded`, window load, persistent input handlers) so not leaks, but **action:** quick scan to confirm none are re-added on repeated renders (e.g. modal/chat open). Inventory only.
- **`setInterval` 3× / `clearInterval` 9×** (defensively over-cleared — fine). ⚠ **Rest-timer interval can outlive its DOM** if the active card re-renders mid-rest (carryover of prior audit L-12): the interval keeps counting after `renderWorkout` destroys the node. **Action:** clear the rest-timer interval at the top of `renderWorkout`/`skipExercise`. *(Flagged as a latent smell, not a behaviour change request.)*

---

## Summary (priority order for a future T1 cleanup)
1. **P1** — delete 11 dead functions, the duplicate `downloadBlob`, dead GIF-admin tooling + its CSS, and 9 dead CSS selectors. *(Largest safe win; ~150–200 lines.)*
2. **P2** — **decide** the parked Recovery/Garmin subsystem (~700 lines): keep-parked vs excise. Blocks nothing.
3. **P3** — consolidate repeated `localStorage` parses in the Plan-tab analytics fan-out (parse-once).
4. **P4** — split `renderWorkout` (261) + the 3 live analytics renders.
5. **P5/P6/P7** — dedupe the two chip togglers, de-fragile the assessment monkey-patch during the P4 split, strip/gate 52 console logs + version drift, and clear the rest-timer interval on re-render.

All findings are static-analysis-verified; none require a behaviour change to action — they're isolation/removal/refactor only.

---

**Sign-off:** T2 — 2026-06-15 10:32
