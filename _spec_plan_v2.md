# Spec — Plan tab UX rework (v2)

**Type:** Read-only implementation spec. No code changed, no git, `index.html`
untouched. Read against **v78**. Anchors are line + function/pattern (re-anchor by
name before editing; lines drift).

---

## 0. Current state (what v78 actually does — three problems)

1. **Focus is cosmetic.** `selectGoal(goal)` (L5701) builds the schedule from
   `schedules[planData.frequency]` (L5707–5712) and uses `goal` **only** for the
   plan *name* (`goalNames`, L5715–5719). So *Balanced Performance / Health &
   Vitality / Functional Fitness produce identical week templates* at a given
   frequency. The three options are also vague ("Health & Vitality").
2. **Day pills blind-cycle.** `editDay(idx)` (L5637) does
   `schedule[idx] = types[(current+1) % types.length]` over
   `['rest','push','pull','legs','cardio','nimble']` — tap-to-guess, no Rest-pick
   without cycling, no status, no "start". Both surfaces already call it
   (overview pill `onclick="editDay(i)"` L5556; calendar bubble `bubble.onclick =
   () => editDay(idx)` L5618), so it's **already a shared handler** — we rewrite
   its body, not the call sites.
3. **"nimble" leaks to users.** Shown raw at: calendar bubble `type.substring(0,4)`
   → "nimb" (L5626); overview pill `type` capitalized → "Nimble" (L5558); preview
   `${type}` (L5737); today banner `type.toUpperCase()` → "NIMBLE" (L5780). The
   front-page chip already says "Mobility" for `quickStartWorkout('nimble')`
   (L1227) — precedent to match.

**Engine levers available (what a template can honestly use today):**
`generateWorkoutByType(type)` (L3515) supports `push | pull | legs | nimble
(Nimble cat OR Mobility type) | full (all)`; **no `cardio` branch → cardio falls
to `return true` → random lifts** (M-01/#24), and there are **no cardio exercises
in `allExercises`** to pick from. `smartSelect` already leads with compounds and
bucket-focuses (strength/power for lifts, resilience for nimble). So a focus's
only *engine-honored* knob today is the **weekly day-type MIX** (which types, how
many, rest distribution). Rep/load intensity (true hypertrophy-vs-maximal) is
**not** yet plan-driven — flagged per-goal below.

---

## 1. TRAINING FOCUS redesign (goal-language + real templates)

### 1a. Modal copy (step-2 HTML, L1917–1924)
Replace the 3 chips with 5 goal chips, each with a **visible 1-line explanation**
(the current single muted line L1919 is generic — give each option its own).
Suggested layout: chip + sub-text under it (or a 2nd line in the chip).

| `goal` token | Label | One-line explanation (shown in modal) |
|---|---|---|
| `muscle` | **Build Muscle** | Higher-volume push/pull/legs to grow size. |
| `strong` | **Get Strong** | Heavy compound lifts with more recovery. |
| `shred` | **Shred Fat** | Conditioning + lifts to lean out. *(see 1c)* |
| `move` | **Move Better** | Mobility & resilience to feel good and bulletproof joints. |
| `balanced` | **Balanced** | An even mix of strength, conditioning and mobility. |

(`vitality`/`functional` tokens retire; keep `balanced` token.)

### 1b. Templates — `selectGoal` becomes goal-AND-frequency driven
Replace the single `schedules[freq]` (L5707–5712) with a `TEMPLATES[goal][freq]`
table. Tokens: `P`=push `U`=pull `L`=legs `F`=full `C`=cardio `M`=mobility
(internal `nimble`) `R`=rest. Week = Sun…Sat (idx 0–6). Each cell is the
`{0:…,6:…}` schedule object.

| goal | 3-day | 4-day | 5-day | 6-day |
|---|---|---|---|---|
| **muscle** | R P R U R L R | R P U L R P R | R P U L R P U | R P U L P U L |
| **strong** | R F R F R F R | R P U R L R F | R P U L R P L | R P U L P U L |
| **balanced** | R P R U R L R | R P U R L M R | R P C U R L M | C P U C L M R |
| **shred** | R P R C R L R | R P C U R L R | R P C U R L C | C P C U R L C |
| **move** | R M R F R M R | R M P R M L R | R M P U M L R | M P M U M L R |

Engine mapping / rationale (all but `C` are honored today):
- **muscle** → all lift days (P/U/L), volume maximised, no cardio; 6-day = classic
  PPL×2. `smartSelect` already compound-leads + balances muscles per day.
- **strong** → low frequencies use **full-body `F`** days (textbook 3× full-body
  strength), higher add a heavy `F`/legs emphasis with rest spacing. *Honesty:* at
  5–6 days strong and muscle **converge on day-types** — they differ only in
  intended low-rep heavy loading, which the engine does **not** yet drive. Ship
  the schedules now; the load distinction lands when the engine consumes a
  plan-level rep/intensity target (track as follow-up, parallel to #24).
- **balanced** → current behaviour (this is what v78 ships for every goal),
  P/U/L + 1 `M`, `C` at higher freq.
- **shred** → cardio-forward + retained lifts (P/U/L). 5-day = 2 cardio, 6-day =
  3 cardio (the most cardio of any goal — its identity); rest counts now match
  frequency. **Depends on #24** (1c).
- **move** → `M` (Mobility/nimble) majority + `F`/P/U/L; `nimble` type is fully
  honored today (resilience bucket) → **the safest new goal to ship**.

> **Correction (T1 flag, applied):** the original Shred Fat 5-day (`R P C U C L M`,
> 6 active) and 6-day (`C P C U C L M`, 7 active / 0 rest) miscounted vs their
> frequency. Fixed to **5-day `R P C U R L C`** (5 active + 2 rest, 2 cardio) and
> **6-day `C P C U R L C`** (6 active + 1 rest, 3 cardio), preserving the
> cardio-heavy intent (the trailing `M` was dropped in favour of conditioning).
> Every other goal/frequency cell was verified correct and is unchanged.

### 1b-fix. Exact corrected `PLAN_TEMPLATES` lines (one-line-each for T1 to land)
Schedule-object form matching the existing `schedules` literal (L5708–5711;
quoted string values, internal token `'nimble'` for Mobility). Only the two
`shred` rows below change — drop these in verbatim:
```js
// PLAN_TEMPLATES.shred (only 5 and 6 corrected; 3 and 4 already correct, shown for context)
shred: {
  3: {0:'rest',  1:'push',  2:'rest',  3:'cardio',4:'rest',  5:'legs',  6:'rest'  }, // unchanged
  4: {0:'rest',  1:'push',  2:'cardio',3:'pull',  4:'rest',  5:'legs',  6:'rest'  }, // unchanged
  5: {0:'rest',  1:'push',  2:'cardio',3:'pull',  4:'rest',  5:'legs',  6:'cardio'}, // FIX: 5 active + 2 rest, 2 cardio
  6: {0:'cardio',1:'push',  2:'cardio',3:'pull',  4:'rest',  5:'legs',  6:'cardio'}  // FIX: 6 active + 1 rest, 3 cardio
}
```
The two lines to change are the `5:` and `6:` entries (the `3:`/`4:` lines are
already correct and shown only for placement context).

`goalNames` (L5715) updates to the 5 labels; `appState.activePlan.name` =
`` `${freq}-Day ${goalNames[goal]}` ``. Optional: set `phase`/guidance copy per
goal (cosmetic).

### 1c. Shred Fat ⚑ cardio dependency (#24 / M-01) — what's honest to ship
`C` (cardio) days are the problem: `generateWorkoutByType('cardio')` has no branch
→ random lifts (M-01), and `startTodaysWorkout` (L5785) → `quickStartWorkout('cardio')`
→ that random-lift path. Shipping Shred Fat with `C` days **as-is is dishonest** —
"cardio" day hands the user random strength exercises.

**Honest interim (ship before #24):** route cardio days to the **existing Cardio
tracker** instead of generating a lift session. Concretely, in `startTodaysWorkout`
(L5785) and the day-editor "Start this workout" (§2): `if (type === 'cardio')
switchTab('cardio')` (the app already has `logCardioSession` + cardio history,
L3288 loads it) rather than `quickStartWorkout('cardio')`. That makes every `C`
day — in Shred **and** in Balanced 5/6 — honest now: a conditioning day you log in
the Cardio tab, not random lifts. This is a small, isolated fix and the cleanest
pre-#24 story.

**Alternative if cardio-routing isn't wanted yet:** ship Shred Fat composed only
of engine-honored tokens — swap its `C` for `F` (full-body metcon-style, higher
density, shorter rest) and add real `C` days when #24 lands. Less ideal (loses the
"conditioning" identity) but fully honest.

**Recommendation:** do the cardio→Cardio-tab routing (covers M-01 broadly), then
Shred Fat ships truthfully with `C` days. Flag #24 as the upgrade that turns those
days into *generated* conditioning sessions. **Do not ship `C` days that silently
generate random lifts.**

---

## 2. DAY-PILL interaction → small day editor (shared handler)

Rewrite **`editDay(idx)`** (L5637–5645): instead of cycling, **open an editor**.
No call-site changes (both surfaces already call `editDay(idx)`).

### 2a. Behaviour
Tap a pill/bubble → open a bottom-sheet / popover anchored to the Plan tab showing:
- **Header:** day name (`['Sunday'…][idx]`) + **status** line — one of: `Rest day`
 · `Scheduled: <Label>` · `Completed ✓` (via `isDayCompleted(idx)`, L5647) ·
  `Today` badge if `idx === new Date().getDay()`.
- **Type list** (single-select, sets the day): **Rest, Push, Pull, Legs, Full,
  Cardio, Mobility** — labels via `typeLabel()` (§3); selecting calls
  `setDayType(idx, token)`.
- **"Start this workout"** button — shown only when `idx === today` AND
  `type !== 'rest'` AND `!isDayCompleted(idx)`; calls the start path
  (`startTodaysWorkout()`), honoring the cardio routing in §1c.
- Close affordance (✕ / tap-out).

### 2b. New functions (beside `editDay`)
```js
function editDay(idx){ openDayEditor(idx); }            // shared by both surfaces — body swap only
function openDayEditor(idx){ /* build sheet for idx, render type list + status + maybe Start */ }
function setDayType(idx, token){
    appState.activePlan.schedule[idx] = token;          // internal token unchanged ('nimble' for Mobility)
    saveAppState();
    renderPlanCalendar(); renderPlanOverview();         // keep BOTH surfaces in sync (as editDay does today, L5643-44)
    closeDayEditor();                                   // or keep open with updated status — UX choice
}
function closeDayEditor(){ /* hide sheet */ }
```
Reuse the existing `modal-overlay`/sheet CSS. The canonical type set
(`rest,push,pull,legs,full,cardio,nimble`) must be reflected in **all** type→
icon/label/color maps, several of which are currently incomplete:
- today-banner icon map (L5779) has **no `full`** (and no `rest`).
- calendar/preview icon maps (L5620, L5735) have no `full`.
- `editDay` old type list (L5639) lacks `full`.
Add `full` (e.g. `IC.fire` or a new icon) and ensure `cardio` everywhere so a
day set to Full/Cardio renders an icon, not `IC.fire` fallback only.

### 2c. Surfaces (unchanged call sites, confirm both)
- Overview pills: `renderPlanOverview` L5556 `onclick="editDay(' + i + ')"`.
- Calendar bubbles: `renderPlanCalendar` L5618 `bubble.onclick = () => editDay(idx)`.
Both now open the editor. **One handler, two surfaces** ✓ (already true).

*Caveat (flag, out of scope):* there are two plan sources — `appState.activePlan.
schedule` (generator) and `currentPlan.weekSchedule` (consultation, read first at
L5548). `editDay`/`setDayType` mutate `activePlan.schedule` only. If a consultation
plan is active, ensure `activePlan.schedule` is the one being displayed/edited (it
is set from `weekSchedule` on load, L7808) or edits won't show. Keep editor on
`activePlan.schedule`; note the duality for a future reconcile.

---

## 3. VOCAB — display "nimble" as "Mobility" (internal token unchanged)

Add one helper; route every plan **display** site through it. Schedule tokens,
`generateWorkoutByType`, and `smartSelect` keep `'nimble'` untouched.
```js
const TYPE_LABELS = { push:'Push', pull:'Pull', legs:'Legs', full:'Full Body',
                      cardio:'Cardio', nimble:'Mobility', rest:'Rest' };
function typeLabel(token, short){
    var l = TYPE_LABELS[token] || (token ? token[0].toUpperCase()+token.slice(1) : 'Rest');
    return short ? l.slice(0,4) : l;   // 'Mobi' for the calendar bubble
}
```
Apply at:
- Calendar bubble L5626 — `type.substring(0,4)` → `typeLabel(type, true)` (`Mobi`).
- Overview pill L5558 — raw `type` (capitalized) → `typeLabel(type)` (`Mobility`).
- Preview L5737 — `${type}` → `${typeLabel(type)}`.
- Today banner L5780 — `type.toUpperCase()` → `typeLabel(type).toUpperCase()`.
- Day-editor type list (§2) — label each token via `typeLabel`.
Net: "Mobility" everywhere users look; `'nimble'` everywhere the engine looks.

---

## 4. Phasing — three one-category builds + test gates

### Phase 1 — Focus relabel + real templates + vocab  (SAFE: data/logic/copy only)
Scope: step-2 chips & explanations (L1917–1924); `goalNames` (L5715) → 5 labels;
`selectGoal` (L5701) → `TEMPLATES[goal][freq]` (§1b); `typeLabel` helper + the 5
display swaps (§3). **No new UI, no behaviour change to start paths.** Cardio days
remain as today *unless* the §1c routing is included here (recommended, tiny).
**Test gate:** for each goal×{3,4,5,6}: generated `schedule` matches §1b table;
plan name reads "<n>-Day <Goal>"; preview + overview + calendar + today banner all
show "Mobility" (never "nimble"/"nimb"/"NIMBLE"); existing saved/active plans still
load & render; no console errors. (If §1c included: a `cardio` "Start" opens the
Cardio tab, not a random lift session.)

### Phase 2 — Day editor  (UI)
Scope: rewrite `editDay` → `openDayEditor`/`setDayType`/`closeDayEditor` (§2);
add the sheet DOM + CSS; complete the type→icon/label maps incl. `full`/`cardio`.
**Test gate:** tapping a pill **and** a bubble both open the editor; choosing each
type (incl. Rest, Full, Cardio, Mobility) persists and re-renders **both** surfaces;
status line correct (rest/scheduled/completed/today); "Start this workout" shows
only for today-non-rest-incomplete and launches the correct type (cardio → Cardio
tab per §1c); close works; reload preserves edits.

### Phase 3 — Cardio-as-type (#24 / M-01)  (dependency)
Scope: give `generateWorkoutByType` a real `cardio` branch (needs a cardio/
conditioning exercise pool — none exist in `allExercises` today) so `C` days
*generate* sessions instead of routing out. **Blocks the full Shred Fat
experience.** Until it lands, Phase 1's §1c routing is the honest stand-in.
**Test gate:** a `cardio` day generates a conditioning session (not random lifts);
Shred Fat end-to-end produces cardio + lift + mobility days that each launch
correctly; remove the interim Cardio-tab routing only once generation is real.

**Sequence & risk:** Phase 1 (low risk, high clarity win — also the honest cardio
routing) → Phase 2 (UI, medium) → Phase 3 (needs new exercise pool / #24, largest).
Phases 1 and 2 are independently shippable; Shred Fat is *labelled honest* from
Phase 1 via routing, *fully realised* at Phase 3.

— T4, 2026-06-11 17:39 (+10:00)
