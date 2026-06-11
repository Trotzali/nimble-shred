# Spec — Quick Start rework (configurable, decoupled) + check-in audit

**Type:** READ-ONLY investigation + build spec. No edits, no git, index.html untouched.
**Audited against:** committed/on-disk `index.html` at **v77** (`:1188`). ⚠ The file moved **v75→v77 during this audit** (another terminal landed v76 `--primary` neutralise + v77 Keystone Phase-B focus-chip swap / Nimble→Mobility). All anchors below are re-read at v77.

---

# PART A — current Quick Start + "How are you feeling?" check-in

## A1. Trace: a Workout Type chip tap generates AND starts immediately
```
chip onclick="quickStartWorkout('push')"            :1223-1227
  → quickStartWorkout(type)                          :3417  → showCheckIn(cb)
  → showCheckIn shows #checkin-modal                 :3311  (sets sessionCheckIn='skip', stores cb)
  → user taps a feeling → processCheckIn(feeling)    :3318  (sets sessionCheckIn, hides modal, speak(), runs cb)
  → cb = _executeQuickStart(type)                    :3424
        applySessionGear(sessionGear)                :3428  (gym→all / dumbbell→[BW,DB] / bodyweight→[BW])
        generateWorkoutByType(type, exerciseCount)   :3430 → :3527
            filter by type (cat split; 'nimble'→getBucket==='resilience')  :3528-3535
            filterExercisesByEquipment(...)          :3538
            smartSelect(filtered,count,type,{niggle:getNiggleJoints()})    :3542
            rememberPicks(...)                       :3543
        push/pull/legs → startWarmup(type)+renderWorkout : else startWorkout()  :3444-3449
```
So a single chip tap = **generate + start**, gated only by the check-in modal. There is **no "select then start"** step and **no dedicated Start button** — the chip *is* the trigger.

## A2. What each check-in option ACTUALLY changes
Source: `checkInConfig` `:3303-3309`. Three numeric levers + label/colour; consumed in three places.

| Option | warmupMult | weightMult | restBase | extra |
|---|---|---|---|---|
| **Fresh** 💪 | 1.0 | 1.0 | **60s** | speak "Full intensity" |
| **Normal** 👍 | 1.15 | 1.0 | 75s | — |
| **Tired / Sore** 😩 | 1.4 | 0.9 | 90s | prepends "Gentle Full-Body Mobility" 60s to warmup |
| **Something Hurts** 🤕 (`pain`) | 1.5 | 0.8 | **120s** | prepends mobility 60s; speak "skip anything that hurts" |
| skip (modal dismissed) | 1.0 | 1.0 | 75s | no badge |

**Where each lever lands (and its real reach):**
- **`restBase` → rest-timer duration** between sets (`startRestTimer` `:3340`). The most reliably-felt effect; applies to every workout type.
- **`weightMult` → the PRE-FILLED suggested weight only** (`:3906-3907`: `suggestedWeight = progression.suggestedWeight × weightMult`). It nudges the number in the input box; once a set is logged, today's carry-forward overrides it. **Not an enforced cap** — a starting suggestion.
- **`warmupMult` → warmup durations**, but **only for push/pull/legs** (the only types with `warmupSequences`; `startWarmup` `:6548-6552`). `full` and `Mobility` skip warmup entirely (`:3447`), so for those two types Fresh-vs-Tired changes **only rest + the weight suggestion** — warmup scaling does nothing.
- **`tired`/`pain` extra:** unshift a 60s "Gentle Full-Body Mobility" block (`:6556-6562`) — again only on warmup'd (push/pull/legs) types.
- **label/colour → a status badge** in the active card (`:3873-3877`, e.g. "−10% weight • 90s rest").

**Net:** the check-in is a real (if modest) intensity dial — rest length always, warmup length on PPL, and a soft weight-suggestion nudge. It is **not** "just a label," but its two strongest levers (warmup, weight) are partial: warmup is PPL-only and weight is only the pre-fill.

## A3. "Something Hurts" — does it ask *what* hurts? Route anywhere? **No.**
- **No "what hurts?" prompt, no body-region picker, no alternate route.** `processCheckIn('pain')` (`:3318`) sets `sessionCheckIn='pain'`, speaks a generic "go easy / skip anything that hurts" line (`:3328`), and runs the **same** `_executeQuickStart` path. Nothing branches on pain beyond the intensity numbers in A2.
- **Niggle / pain-aware hooks are present but INERT (confirmed):**
  - `getNiggleJoints()` (`:3588`) returns `appState.niggleJoints || []` — and **`appState.niggleJoints` is never assigned anywhere in the file** (grep: the only reference is this read). So it is always `[]`.
  - `recentlyHammeredJoints(type)` (`:3589`) is a `return []` stub.
  - `smartSelect` receives `{niggle: []}`, so its hard-safety `niggleSafe()` (excludes exercises loading a flagged joint ≥2, `:3642-3648`) is a pass-through — **zero exercises excluded**.
- **Net: "Something Hurts" does nothing beyond the generic intensity nudge** (−20% suggested weight, +mobility warmup on PPL, 120s rest, voice/badge). It does **not** steer exercise selection away from any painful area. The pain-aware selection engine is fully wired (`smartSelect` accepts `niggle`, `niggleSafe` enforces it) but **dormant** because no UI captures *which* joint hurts. Activating it needs only a "what hurts?" capture writing `appState.niggleJoints` — flagged as the natural follow-on (§B6), out of scope for the front-page rework.

---

# PART B — front-page Quick Start rework

**Current panel:** `#quickstart-panel` `:1191-1246` — count slider, Equipment (Full Gym/Dumbbells/Bodyweight), Workout Type chips (Push/Pull/Legs/Full/Mobility), then three buttons (AI Coach Consultation / Custom Builder / Random Workout), then Wedge. **Already landed (v77):** the Builder's focus chips (Strength/Power/Resilience/Cardio, `:1811-1814`) and the Mobility-type rename; `getBucket` (`:5815`) is live. **Not yet:** focus chips on the *front page*, a Cables equipment option, or any decoupling.

## B1. Add FOCUS chips to Quick Start (Strength / Power / Resilience / Cardio)
A new "Focus" row in `#quickstart-panel` (after Workout Type, before the button group), mirroring the chip pattern but **select-only** (§B3):
```html
<div class="section-label" style="margin-top:16px;">Focus <span style="color:#666;font-size:0.8em;">(optional)</span></div>
<div class="chip-container" id="qs-focus-chips">
  <div class="chip" onclick="setQsFocus(this,'strength')">💪 Strength</div>
  <div class="chip" onclick="setQsFocus(this,'power')">⚡ Power</div>
  <div class="chip" onclick="setQsFocus(this,'resilience')">🧘 Resilience</div>
  <div class="chip" onclick="setQsFocus(this,'cardio')">❤️ Cardio</div>
</div>
```
**Generation:** Focus is the **bucket axis**, orthogonal to Type (muscle split). Extend `generateWorkoutByType` (`:3527-3535`) to apply a focus filter via `getBucket(ex.name) === focus` **intersected** with the type filter when both are set:
```
let pool = window.allExercises.filter(typeMatch);          // existing
if (focus) pool = pool.filter(ex => getBucket(ex.name) === focus);   // NEW (bucket axis)
```
Counts available (metadata v1.4.0): strength 110 · power 10 · resilience 40 · cardio 17. **Empty-intersection guard:** Type+Focus can yield a thin/empty pool (e.g. Pull + Cardio ≈ 0) — fall back to focus-only (or surface "no matches, widen selection"), never start an empty session. (Same guard the cardio-type spec calls for.)

> **Overlap flag — Mobility type vs Resilience focus.** The "Mobility" type chip (`:1227`, key `'nimble'`) already filters `getBucket==='resilience'` — **identical** to the new Resilience focus chip. Two controls, one pool. **Resolve in §B5** (fold the Mobility *type* into the Resilience *focus*).

## B2. Add CABLES to front-page Equipment — and the vocabulary inconsistency
Front-page equipment is single-select gear (`setSessionGear` `:3398`, `applySessionGear` `:3404`). Add a Cables option:
```html
<button class="rpe-tag" onclick="setSessionGear(this,'cable')" data-session-gear="cable">🔌 Cables</button>
```
and a `cable` branch in `applySessionGear`:
```
} else if (gear === 'cable') { appState.equipment='custom'; appState.customEquipment=['Bodyweight','Cable']; }
```
`filterExercisesByEquipment` already matches `customEquipment.indexOf(ex.equip)!==-1 || ex.equip==='Bodyweight'` (`:3538` path), and `ex.equip` values are Cable/Dumbbell/Bodyweight/Free Weight — so `['Bodyweight','Cable']` yields cable+bodyweight (56+91). No engine change needed beyond the branch.

**⚠ FLAG — two equipment vocabularies that don't reconcile** (for the consolidation audit / cross-ref `_spec_equipment_buckets.md`, `_taxonomy_resolution.md`):
| | Front page (single-select) | Builder (multi-select) |
|---|---|---|
| options | Full Gym · Dumbbells · Bodyweight | Cables · Dumbbells · Barbells · Bodyweight |
| "Full Gym" | = all equipment (cable+DB+BW+free) | **no equivalent** |
| Cables | **absent** (this spec adds it) | present |
| Barbells | absent | present but **DEAD — 0 exercises** have `equip:'Barbell'` (only 2 `Free Weight`) |

Adding Cables makes the front page **Full Gym · Cables · Dumbbells · Bodyweight** — still not equal to the Builder (which keeps a dead "Barbells" and lacks "Full Gym"). **Recommend one shared 4-value equipment taxonomy** (Bodyweight / Dumbbell / Cable / Gym-Machines, per `equipmentNorm`), dropping/renaming the Builder's dead "Barbells" → "Gym/Machines", with "Full Gym" expressed as select-all. Track under the equipment-taxonomy build, not this rework — but the inconsistency is now load-bearing once Cables lands on both surfaces.

## B3. DECOUPLE — chips SELECT, a dedicated "Start Workout" button GENERATES
Today each Type chip calls `quickStartWorkout(type)` → check-in → generate (A1). Change to **select-only** selection state + one explicit Start.

**Selection state** (persist on `appState`): `qsType` (push/pull/legs/full | null), `qsFocus` (bucket | null); `sessionGear` and `exerciseCount` already exist.
**Chip handlers become toggles** (mirror `setSessionGear`'s selected-class pattern `:3398-3401`):
```
function setQsType(btn, type)  { appState.qsType  = (appState.qsType===type)  ? null : type;  toggleSel('#qs-type-chips', btn, appState.qsType); saveAppState(); }
function setQsFocus(btn, focus){ appState.qsFocus = (appState.qsFocus===focus) ? null : focus; toggleSel('#qs-focus-chips', btn, appState.qsFocus); saveAppState(); }
```
Repoint the Type chips (`:1223-1227`) from `quickStartWorkout('push')` → `setQsType(this,'push')` (visual select only; no generation).

**New primary Start button — placed ABOVE the AI Coach Consultation / Custom Builder / Random buttons** (insert immediately before `:1230`'s button group, after the Focus row):
```html
<button class="btn btn-main" style="margin-top:14px;" onclick="startConfiguredWorkout()">▶ Start Workout</button>
```
```
function startConfiguredWorkout() {
    showCheckIn(function () {
        _executeQuickStart(appState.qsType || 'full', appState.qsFocus || null);   // type+focus from selections
    });
}
```
`_executeQuickStart(type, focus)` (`:3424`) gains a `focus` param threaded into `generateWorkoutByType(type, count, focus)`. Everything downstream (equipment apply, smartSelect, warmup-for-PPL) is unchanged. **Default when nothing selected:** `type='full'`, `focus=null` → a full-body random build (= today's "Random Workout").

## B4. Where the check-in fits now
Unchanged mechanism, new trigger: **Start Workout → `showCheckIn` → feeling → `_executeQuickStart(selections)` → (warmup for PPL) → session.** One check-in per session, after the user has set Equipment + Type + Focus + count — strictly better than today (no check-in fires on incidental chip taps). The A2 levers apply exactly as now. **Niggle hook (optional, §B6):** this is the natural place to add a "what hurts?" capture so `pain` finally populates `appState.niggleJoints` and wakes `smartSelect`'s dormant `niggleSafe` — flagged, not in scope.

## B5. Redundancy / consolidation flags (for the consolidation audit)
- **Random Workout button (`:1233`, `generateRandomWorkout` `:3460`) becomes redundant.** A configured Start with **no Type/Focus** = full-body random fill = exactly Random Workout. **Recommend removing it** (or relabel Start as "Start / Surprise me" when nothing is selected). Removing it also kills its quirk of only randomising push/pull/legs (never full/mobility).
- **"Full" type + no focus** == old Random == default Start — overlapping concepts; keep "Full" as an explicit type but note it equals the empty-selection default.
- **Mobility type (`:1227`) vs Resilience focus (§B1)** — same pool (`getBucket==='resilience'`). **Recommend folding:** drop the Mobility *type* chip; Resilience *focus* covers it. Leaves Types = Push/Pull/Legs/Full (pure muscle axis), Focus = Strength/Power/Resilience/Cardio (pure bucket axis) — clean orthogonality (aligns with `_taxonomy_resolution.md`).
- **Wedge Session (`:1236-1245`)** overlaps a count+Start (it's a time-boxed auto-build). Distinct enough to keep (time-based, auto-picks least-recently-trained type, skips warmup) but note the conceptual overlap for the audit.

## B6. Out of scope (flagged follow-ons)
- **Activating pain-awareness:** a "what hurts?" body-region capture writing `appState.niggleJoints` — would make "Something Hurts" actually steer selection via the already-built `niggleSafe`. Separate niggle-UI spec.
- **Equipment taxonomy unification** (B2 flag) — separate build.
- **Cardio as a focus** depends on the cardio bucket (already in metadata, 17 moves) but cardio moves log by `logMode` time/reps — full cardio logging UX rides on #5 (`_spec_logmode_integration.md`). Focus=Cardio will *build* a cardio circuit now; correct logging needs #5.

---

## Phased build plan (one category per phase, test gate each)

| Phase | Scope | Build | Test gate |
|---|---|---|---|
| **B-1 Decouple** | Type chips → select-only + Start button | `qsType` state, `setQsType`, repoint chips, add Start above the 3 buttons, `_executeQuickStart(type,focus)` thread | Tapping a Type highlights it, does **not** start; Start → check-in → generates that type; no Type selected → full-body; PPL still warms up; Random/Builder/Consult unaffected |
| **B-2 Focus** | Add Focus chips + bucket generation | Focus row, `setQsFocus`, `qsFocus` state, `getBucket` filter + empty-intersection guard in `generateWorkoutByType` | Focus-only Start builds from bucket (Strength 110/Power 10/Resilience 40/Cardio 17 pools); Type+Focus intersects; thin/empty combos fall back, never start empty |
| **B-3 Cables** | Front-page Cables equipment | Cables `rpe-tag` + `applySessionGear('cable')` | Cables selected → Start builds cable+bodyweight pool; other gears unchanged; flag the front-page/Builder vocabulary mismatch logged |
| **B-4 Consolidate** | Fold Mobility→Resilience; retire Random | Remove Mobility type chip; remove/redirect Random Workout; confirm default-Start = random full | No dead controls; Resilience focus == old Mobility output; default Start == old Random output; Types are pure muscle axis, Focus pure bucket axis |

Each phase is independently shippable on top of the already-landed Keystone Phase A (`getBucket` live). B-2 depends on B-1 (Start button); B-4 depends on B-1+B-2.

---

## Summary
- **A1:** a Type chip tap generates+starts immediately, gated only by the check-in modal — no select/start separation.
- **A2:** check-in changes rest (always), warmup length (PPL only), and the pre-filled weight suggestion (soft); plus a status badge. Real but partial — not just a label.
- **A3:** "Something Hurts" does **not** ask what hurts or route anywhere; the niggle engine (`smartSelect` + `niggleSafe`) is wired but **inert** because `appState.niggleJoints` is never set. Net = generic intensity nudge only.
- **B:** add Focus chips (bucket axis) + front-page Cables; **decouple** so chips select and a new **Start Workout** button (above Consult/Builder/Random) generates from selections, with the check-in firing once after Start. Flags: Mobility-type ≡ Resilience-focus (fold), Random Workout redundant (retire), front-page vs Builder equipment vocabularies inconsistent (unify), pain-capture is the dormant niggle activation point. Phased B-1→B-4 with test gates.

---

*Signed off — T5, terminal pts/T5, 2026-06-11 13:22 AEST (03:22 UTC). Read-only: no edits, no git, index.html untouched.*
