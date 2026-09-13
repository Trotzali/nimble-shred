# Front-page (Coach screen) render & DOM map — for a recommendation-first rebuild

**Terminal:** T1 (READ-ONLY trace — no `index.html` edit, no git). Symbol-anchored; line numbers indicative (v121).

## 0. TL;DR
`#view-coach` is **mostly static markup**. `switchTab('coach')` (L3517) only toggles the container's `.active` class — **there is NO `if(tab==='coach')` render branch**, so nothing re-renders on tab-entry. Only **three** regions are JS-rendered via `innerHTML`: the hero banner, the active-session summary, and the workout list. The whole Quick-Start config block (slider + 3 chip rows + 4 CTAs) is hardcoded HTML; JS only toggles chip `.active` classes and reads their state at Start time.

---

## 1. Component tree of `#view-coach` (L1217)

```
#view-coach  (.container.active, L1217)            STATIC shell — shown by switchTab('coach') class toggle only
│
├─ #todays-banner  (.card, L1220)                  HERO — JS-rendered (innerHTML wholesale)
│    render fn:   updateTodaysBanner()  L6291
│    placeholder markup (#today-date / #today-workout / #today-start-btn, L1221-1225) is OVERWRITTEN on first render
│    3 states:    completed ("Done for today") | rest ("Rest day" + Train-anyway) | planned ("Start Today's Plan: TYPE")
│    reads:       appState.activePlan.schedule + adherence.overrides (getEffectiveType L6286), isDayCompleted, nextPlannedSession
│    events:      planned -> startTodaysWorkout() L6334 ; rest -> focusQuickStart() L6279 (scrolls to #quickstart-panel) ; completed -> none
│    visibility:  display:none in markup -> updateTodaysBanner sets display:block ; hidden during a live session
│
├─ header row  (L1227)                             STATIC — "Workout Coach" h2 + version badge (v121). No render fn.
│
├─ #quickstart-panel  (.card, L1232)               ALL STATIC MARKUP — no render fn builds it; never re-rendered
│    ├─ Exercises slider  #exercise-count-slider (range 4-10, L1240) + #exercise-count-display (L1238)
│    │     event: oninput -> updateExerciseCount(value) L3795  -> sets appState.exerciseCount + display text (no re-render)
│    ├─ Equipment row  #session-gear-toggles (.gear-row, L1256)   4 static .chip [data-session-gear] gym|cable|dumbbell|bodyweight
│    │     event: setSessionGear(this,gear) L3697 -> sets GLOBAL var sessionGear + toggles .active  (NOT in appState; 'gym' active in markup)
│    ├─ Workout Type row  (.chip-container, L1264)   5 static .chip [data-qs-type] push|pull|legs|full|cardio
│    │     event: setQsType(this,type) L3720 -> toggles appState.qsType (null=deselect) + .active + saveAppState
│    ├─ Focus row  #qs-focus-chips (L1273)           4 static .chip [data-qs-focus] strength|power|resilience|cardio
│    │     event: setQsFocus(this,focus) L3729 -> toggles appState.qsFocus + .active + saveAppState
│    │     (on load) applyQsTypeSelection() L3738 reflects persisted qsType/qsFocus onto the chips
│    └─ 4 CTAs:
│         1. Start Quick Workout  (btn-main, L1280)   -> startConfiguredWorkout() L3750  [PRIMARY]
│              -> showCheckIn() -> _executeQuickStart(qsType||'full', qsFocus) L3763 -> generateWorkoutByType -> startWarmup/startWorkout
│         2. AI Coach Consultation (btn-action,L1283) -> startConsultation() L8072
│         3. Custom Workout Builder (btn-action,L1284)-> openCustomBuilder() L5599
│         4. Random Workout (btn-action, L1285)       -> toggleRandomDurationPicker() L3806
│              reveals #random-duration-picker (L1286, static, hidden) -> 10/15/20/30 -> startWedgeSession(n)
│
└─ #workout-interface  (L1298)                     STATIC shell, display:none — the live session
     header "Active Session" + End -> endWorkout()
     ├─ #session-summary (L1303)                   JS-rendered by renderSessionSummary() (called inside renderWorkout)
     └─ #workout-list (L1304)                       JS-rendered by renderWorkout(exercises) L4134 (rebuilt every logSet)
```

---

## 2. Static vs JS-rendered

| Region | Source | Built/updated by |
|---|---|---|
| `#view-coach` shell, header, **entire `#quickstart-panel`** (slider/chips/CTAs/random-picker), `#workout-interface` shell | **STATIC HTML** | never re-rendered; only chip `.active` classes toggle |
| `#todays-banner` body | **JS innerHTML** | `updateTodaysBanner()` |
| `#session-summary` | **JS innerHTML** | `renderSessionSummary()` (inside renderWorkout) |
| `#workout-list` | **JS innerHTML** | `renderWorkout()` |

---

## 3. Re-render triggers (what fires the JS-rendered bits)

- **Hero `updateTodaysBanner()` — 7 call sites, NONE on tab-switch:** window.onload (L3457), refreshPlanViews (L6244), endWorkout (L4585), finishWorkout (L4609), markDayCompleted path (L4638), plan-accept path (L6115), consultation plan apply (L8019). **Returning to the Coach tab does NOT refresh the hero** — only these explicit calls do.
- **`applyQsTypeSelection()` — 1 call site:** window.onload (L3461). Reflects persisted chip state once on load.
- **`renderWorkout()`** — startWorkout (L4134 def; shown from L4094) / warmup path (L7231) / every logSet.

**Session show/hide choreography:**
- start (startWorkout L4094 / warmup L7231): **hide** `#quickstart-panel` + `#todays-banner`, **show** `#workout-interface`, `switchTab('coach')`, `renderWorkout()`.
- end (endWorkout L4582 / finishWorkout L4606): **hide** `#workout-interface`, **restore** `#quickstart-panel`, `updateTodaysBanner()`.

**Key gap for the rebuild:** there is no single "render the Coach page" entry point. The page is assembled from static HTML + one-shot onload calls; the recommendation surface (hero) is event-driven, not tab-driven.

---

## 4. Flag — what a "Today card + one Start + Adjust sheet" layout would ADD / REPLACE / HIDE

**REPLACE / CONSUME (the hero becomes the Today card):**
- `#todays-banner` + `updateTodaysBanner()` already ARE the recommendation surface (3-state, schedule+override driven) and its planned-state "Start Today's Plan" already IS the one Start button. The rebuild extends `updateTodaysBanner` to carry a full recommendation (type **+ count + equipment + focus**, the params currently scattered across the slider/chips) and to be the single primary surface.

**HIDE / DEMOTE into the Adjust sheet:**
- The **entire `#quickstart-panel` manual config** (exercises slider, Equipment / Workout Type / Focus chip rows) moves OFF the front page into an **Adjust bottom-sheet**: the recommendation pre-fills it; the sheet is the override path. The existing controls (`updateExerciseCount`, `setSessionGear`, `setQsType`, `setQsFocus` + their `appState.qsType/qsFocus` / global `sessionGear` plumbing) become the sheet's inputs — **state plumbing is reusable as-is**.
- The **3 secondary CTAs** (AI Consult / Custom Builder / Random) demote into the Adjust sheet or an overflow menu — only **Start** stays primary up top.
- `startConfiguredWorkout()` (reads the chips) becomes the sheet's "Start with these settings"; the front-page Start fires the recommendation directly (like `startTodaysWorkout` but recommendation-driven, not pure-schedule-driven).

**ADD:**
- A **recommendation engine** call that computes the Today card's suggested type/count/equipment/focus — the natural first consumer of **AS-1 `nimbleProfile_v1` / `getProfile()`** (currently ZERO consumers, v119) plus `activePlan.schedule`, history, niggles.
- An **"Adjust" trigger** on the Today card that opens the sheet pre-populated from the recommendation (reusing the chip/slider controls).
- A **Coach-tab render call** (currently absent in `switchTab`) so the Today card refreshes on tab re-entry — today only the 7 `updateTodaysBanner` sites refresh it.

**KEEP AS-IS (out of the rebuild's front-page scope):**
- `#workout-interface` / `renderWorkout` / `renderSessionSummary` (the live session) — unchanged; the rebuild targets the pre-session front page only.
- The check-in modal (`showCheckIn`) and the `_executeQuickStart` generation choke point — the new Start still routes through them.
- Hero's existing 3-state logic + `getEffectiveType` override layer — the foundation the Today card builds on.

---

**Sign-off:** T1 | 2026-06-16
