# Audit — Deadwood & consolidation (holistic pass)

**Type:** Read-only audit. No code changed, no git, `index.html` untouched.
**Date:** 2026-06-08 · Target: `index.html` (v67-line tree). Line numbers indicative.
**Scope guard:** no proposals touch exercise data (`window.allExercises` /
`exercise-metadata.js`). Every item below is sequenceable as its own one-category
build.

**Coordination with T5.** `_spec_quickstart_rework.md` does **not exist yet** at
audit time. Boundary: *this audit identifies* the duplication/roll-up surface;
**T5 owns the configurable-Quick-Start design**. Items R1/R2 below are handed to
T5 as requirements, not designs. Where I've already specced something elsewhere I
cross-reference rather than redesign (`_spec_quickwins.md` #16 = the duplicate
count slider).

---

## 1. DUPLICATION — same job in two places

### D1 — Equipment chosen in two unrelated systems, different vocab
- **Front page:** `sessionGear` (`gym | dumbbell | bodyweight`), 3 preset buttons
  L1215–1219 → `setSessionGear` (L3398) → `applySessionGear` (L3404) maps to
  `appState.equipment`/`customEquipment`.
- **Builder:** multi-select equip chips `Cable | Dumbbell | Barbell | Bodyweight`
  (L1801–1805) → `filterBuilder` → `appState.builderFilters`.
- Two mechanisms, two vocabularies (preset-gear vs per-equip multiselect; gear
  `dumbbell` ≠ chip `Dumbbell`). A user setting gear on the front page gets no
  reflection in the Builder and vice-versa.
- **Sub-finding (dead):** the Builder **`Barbell` chip matches 0 exercises** —
  real `equip` values are `Cable(56) · Dumbbell(28) · Bodyweight(77) · Free
  Weight(2)`. No exercise is `Barbell`. And `Free Weight` (2) has **no** chip.
  Vocabulary is out of sync with the data.

### D2 — Focus lives only in the Builder; front page has none
- **Builder** has focus selectors: muscle chips `Chest/Back/Legs/Shoulders/Arms`
  + style chips `Mobility/Nimble/Calisthenics/Plyo` (L1791–1812).
- **Front page** has only the 5 Workout-Type chips (L1222–1227) which *immediately
  start* a session (`quickStartWorkout(type)`), so there is no "pick a focus, then
  start" affordance. The requested "Focus on the front page" capability exists in
  the Builder and is duplicable as a shared control (see R2).

### D3 — Three generation paths, one engine
All funnel into `generateWorkoutByType(type,count)` (L3515) + `sessionGear`:
| Path | Entry | Type | Count | Warmup | Check-in |
|---|---|---|---|---|---|
| Quick Start chips | `quickStartWorkout(type)` L3417 | user-chosen (5) | slider | yes (push/pull/legs) | yes |
| Random Workout | `generateRandomWorkout()` L3460 | **random of push/pull/legs only** → calls `quickStartWorkout` | slider | yes | yes |
| Wedge Session | `startWedgeSession(min)` L3466 → `_executeWedgeSession` L3472 | **auto = least-recently-trained** push/pull/legs | `minutes/5` | **skipped** | yes |
- **Random = Quick Start with a randomised type** (a 3-way `Math.random` over
  push/pull/legs; excludes full/nimble). Thin wrapper.
- **Wedge = Quick Start with auto-type + time→count + no warmup.** Also a
  variant, not a separate engine. (Note the L1244 hint "Skips warmup" is right,
  but it does **not** skip check-in — `startWedgeSession` calls `showCheckIn`.)

### D4 — Two plan-creation flows
- **Old Plan Generator** (multi-step wizard): `openPlanGenerator` L5675 →
  `showGenStep(1..3)` L5685, modal `#plan-generator-modal`. **Still reachable** —
  wired to "New Plan" (L1352) and "Regenerate" (L1931).
- **AI Coach Consultation:** `startConsultation` (the promoted path).
- Two parallel ways to build a plan. Compounded by the `acceptPlan` collision in
  DW1 — the old wizard's "accept" is silently hijacked by the consultation's.

### D5 — Duplicate exercise-count slider (already specced)
Same `id="exercise-count-slider"` on the front page (L1191) **and** in the Builder
(L1778) — invalid duplicate id. **Already covered** in `_spec_quickwins.md` #16
(hide the Builder one + relax the selection cap). Listed here only for the
consolidation map; no new work.

### D6 — Type→color mapping hardcoded vs CSS vars
`typeColors` literal at **L5551** (`push:'#FF6B6B' … nimble:'#9b59b6' …`)
re-hardcodes colors already defined as CSS custom properties
(`--push-color:#FF6B6B` L37, `--nimble-color:#9b59b6` L38, etc.) and consumed
elsewhere (e.g. `.workout-type-nimble{border-color:var(--nimble-color)}` L177–178).
Two sources of truth for the same palette; drift risk.

---

## 2. DEAD WOOD — renders/defines but does nothing

### DW1 — `acceptPlan` defined twice; L5742 is dead (H-04 leftover)
- L5742 `acceptPlan(){ saveAppState(); closePlanGenerator(); renderPlanCalendar();
  speak('Plan activated!'); }` (old-generator version).
- L7893 `acceptPlan(){ closeConsultation(); switchTab('plan'); renderPlanCalendar(); }`
  (consultation version, under comment "old function redirects to new").
- **Last declaration wins → L5742 never executes.** This is the unfinished H-04
  "de-duplicate acceptPlan". **Hazard:** the old wizard's step-3 accept therefore
  runs the *consultation's* handler, which does **not** `closePlanGenerator()` —
  so the old generator modal can be left without its intended close/save path.

### DW2 — Orphaned compatibility shims
`startAIPlanWizard(){ startConsultation(); }` (L7891) and `closeAIWizard(){
closeConsultation(); }` (L7892) — **zero callsites** (grep-confirmed). Leftover
from the wizard→consultation rename. Safe to delete.

### DW3 — `getAlternatives(name)` orphaned
L5837 `function getAlternatives(name) // niggle / pain-swap` — **no callsite**
(grep-confirmed). Inert until a pain-swap UI exists.

### DW4 — Niggle hooks present but inert
`getNiggleJoints(){ return appState.niggleJoints || []; }` (L3588) — nothing ever
sets `appState.niggleJoints`; `recentlyHammeredJoints(type)` is a declared-inert
stub (L3587). Both feed `smartSelect`'s joint term (L3542/3639), so the
**RESPECT-joints term is always inert** today. **Not harmful** (zero-cost, the
engine's SPAN/BALANCE/COMPOUND still work) and intentionally a seam — but it is
dead until a niggle input lands. Track, don't rip out.

### DW5 — Builder `Barbell` chip (see D1) is inert
0 matching exercises → selecting it filters to nothing. Either remove or remap the
Builder equip vocabulary to the real values (and add `Free Weight`).

### DW6 — Check-in is NOT dead (hypothesis corrected)
The task flagged check-in "if it doesn't change behaviour" — **it does.**
`checkInConfig` (L3303–3309) drives, per feeling: **rest** (`restBase`
60/75/90/120, used L3339), **weight** (`weightMult` 1.0/1.0/0.9/0.8, applied to
the suggestion L3906–3907), **warmup** (`warmupMult` 1.0/1.15/1.4/1.5, L6548), and
a per-feeling banner (L3873–3877). **Keep.** *Gap (not deadwood):* the `pain`
option only scales weight/rest/warmup — it does **not** feed the niggle/joint
system (DW4), so "Something Hurts" never swaps exercises. That's a wiring
opportunity if/when the niggle UI lands, not dead code.

---

## 3. ROLL-UP — what could merge

### R1 — Configurable Quick Start absorbs Random + Wedge  → **hand to T5**
A single panel (**equipment + type + focus + count + Start**) can subsume both
variants, since both are already `generateWorkoutByType` + `sessionGear` (D3):
- **Random** → a "Surprise me" type option (random/auto type) on that panel.
- **Wedge** → a "by time" count mode (`minutes/5`) + a "skip warmup" toggle +
  auto-type. Wedge's only unique logic is least-recently-trained type selection
  (L3472–3494) and time→count — both become options, not a separate widget.
- Net: delete `generateRandomWorkout` (L3460) and the Wedge UI block (L1236–1245)
  once their behaviours are options. **T5 owns this design.**

### R2 — One equipment/focus filter component, shared by Builder + Quick Start
Fixes D1 + D2 + D5 + DW5 at once: a single control with **one vocabulary** sourced
from the real `equip` values + the focus taxonomy, written to **one** state field,
rendered in both the front page and the Builder. Removes the gear-vs-chip split
and the dead Barbell chip; gives the front page the focus selector D2 wants.

### R3 — Single type→color source
Have the JS read the CSS custom properties (or a single JS palette const) instead
of the L5551 literal. One source of truth; fixes D6.

### R4 — Single plan-creation entry
Consolidate D4: either retire the old step wizard in favour of AI Consultation
(removing `openPlanGenerator`/`showGenStep`/`closePlanGenerator`/`regeneratePlan`
+ modal + the "New Plan"/"Regenerate" buttons and DW1/DW2), or keep it but resolve
the `acceptPlan` collision so each flow owns its own accept. Product decision on
which flow survives — flag, don't assume.

---

## 4. Per-item recommendation · risk/effort · sequencing

| # | Item | Recommendation | Risk | Effort | Build category |
|---|---|---|---|---|---|
| DW2 | Orphan shims `startAIPlanWizard`/`closeAIWizard` (L7891–92) | **Remove** | trivial | XS | dead-code delete |
| DW3 | `getAlternatives` orphan (L5837) | **Remove** (or wire when pain-swap lands) | trivial | XS | dead-code delete |
| DW1 | Dead `acceptPlan` L5742 + accept hijack | **Fix/merge** — delete L5742, ensure surviving accept closes whatever opened it | med (plan flow) | S | plan-flow hygiene |
| DW5 | Builder `Barbell` dead chip | **Fix** — remap Builder equip vocab to real values (+`Free Weight`), drop `Barbell` | low | XS | builder filter |
| D6 | `typeColors` hardcode (L5551) | **Merge** to CSS-var/palette source (R3) | trivial | XS | styling cleanup |
| D5 | Duplicate count-slider id | **Already specced** (`_spec_quickwins.md` #16) | low | S | (defer to that build) |
| DW4 | Inert niggle hooks | **Keep** (intentional seam); revisit with niggle UI | none | — | no-op / track |
| DW6 | Check-in options | **Keep** (functional); optional later: pain→niggle wiring | none | — | no change |
| D1/D2/R2 | Split equipment + missing front-page focus | **Merge** into one shared filter component | med (shared UI/state) | M | filter consolidation |
| D3/R1 | Random + Wedge vs Quick Start | **Merge** into configurable Quick Start → **T5** | med (start paths) | M | quick-start rework (T5) |
| D4/R4 | Two plan-creation flows | **Decide + consolidate** (product call) | med-high (plan engine) | M–L | plan-flow consolidation |

**Suggested sequence (low-risk hygiene → structural):**
1. **dead-code delete** — DW2, DW3 (XS, isolated).
2. **styling cleanup** — D6 (XS).
3. **builder filter** — DW5 vocab fix (XS), folds naturally into…
4. **plan-flow hygiene** — DW1 (the `acceptPlan` collision) before any bigger plan
   work.
5. **filter consolidation** — D1/D2/R2 (shared equipment+focus component).
6. **quick-start rework** — D3/R1, coordinated with **T5** (builds on the shared
   filter from step 5).
7. **plan-flow consolidation** — D4/R4 last (product decision + largest blast
   radius).

Each row is independently shippable; the only ordering constraint is that R1 (T5)
benefits from R2 landing first (shared filter), and DW1 should precede D4/R4.

— Claude (T4), 2026-06-08 17:41 (+09:30 local)
