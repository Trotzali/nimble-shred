# Map — Quick Start rebuild risk & coupling (the v52 guard)

**Type:** READ-ONLY coupling audit. No index.html edits, no git. By symbol.
**Question:** if we demote/hide the Coach config chips (equipment / type / focus / slider) behind an **"Adjust"** disclosure, what breaks? Who reads that state from **outside** the Coach screen?
**Current state:** the decouple already landed — `qsType`/`qsFocus` selection state, `setQsType`/`setQsFocus` chips, the **Cables** gear, and an explicit **`startConfiguredWorkout`** Start button. So config is already select-then-start; this audit guards the *next* move (recommendation-first, chips behind Adjust).

---

## 1. The config state — symbols, writers, persistence

| State | Default | Writer (symbol) | Persisted? |
|---|---|---|---|
| `sessionGear` (global var) | `'gym'` | `setSessionGear` (Coach equipment chips `:1257-1260`) | **NO** — plain global, resets to `gym` every load |
| `appState.exerciseCount` | `6` | `updateExerciseCount` (Coach slider `:1246`) | yes (appState) |
| `appState.qsType` | `null`→`'full'` | `setQsType` (Coach type chips `:1265-1269`) | yes |
| `appState.qsFocus` | `null` | `setQsFocus` (Coach focus chips `:1274-1277`) | yes |
| `appState.equipment` / `customEquipment` | `gym` / `[]` | **TWO writers** — (a) Coach `applySessionGear` (transient, save/restore); (b) **Settings Equipment-Presets** (`renderEquipmentPresets`/`toggleEquipmentChip`/`selectPreset` `:6621-6758`) = the persistent owner | yes |
| `appState.currentWorkoutMeta` | — | set at generation `:3781/:3864` (records `{type, equipment:sessionGear, focus, count}`) | yes (record-only) |

---

## 2. Coupling map — who READS the config (in vs OUT of Coach)

```
                    ┌─────────────── COACH SCREEN (writers + primary consumers) ───────────────┐
 setSessionGear ─► sessionGear ─────────────► applySessionGear ─► appState.equipment/customEquipment
 updateExerciseCount ─► appState.exerciseCount ─┐                              │
 setQsType/setQsFocus ─► qsType/qsFocus ────────┤                              ▼
                                                ├─► _executeQuickStart ─► generateWorkoutByType ─► filterExercisesByEquipment
 startConfiguredWorkout ────────────────────────┘   (3769)                                   (4068-4080)
 applyQsTypeSelection (load) ─► reflects qsType/qsFocus on chips
 currentWorkoutMeta ─► Active-Session summary (4118, display only)
                    └────────────────────────────────────────────────────────────────────────┘
   OUTSIDE COACH (cross-screen readers — the blast radius):
   • PLAN tab / today-banner  startTodaysWorkout ─► quickStartWorkout(schedule[day]) ─► _executeQuickStart
        ⇒ consumes sessionGear (equipment) + appState.exerciseCount   ← #1 coupling
   • SETTINGS tab  updateSettingsUI (6784) reads appState.exerciseCount (slider mirror)
        + Settings OWNS appState.equipment/customEquipment via Equipment-Presets   ← #2 coupling
   • AI CONSULT / ASSESSMENT  uses consultProfile (separate object); startAssessment reads
        consultProfile.equipment — NOT the Coach chips. (decoupled)
   • ENCYCLOPEDIA  own encyclopediaFilters; HISTORY  none.  (no coupling)
```

**What loses its data source if chips are demoted?** *Nothing — provided the state vars and their writers survive.* The chips are **writers**; readers bind to `appState`/`sessionGear`, not to chip visibility. The danger is only if "Adjust" **removes** the controls (not merely collapses them): then `sessionGear` sticks at `gym`, `exerciseCount` at `6`, `qsType/qsFocus` null, and the cross-screen readers below silently fall to defaults.

---

## 3. Highest-risk coupling points (ranked)

1. **Plan/banner "Start Workout" depends on Coach `sessionGear` + `exerciseCount`** (`startTodaysWorkout → quickStartWorkout → _executeQuickStart`). A planned-day workout uses whatever the Coach equipment chip + slider were last set to. **Risk:** if those chips become unreachable, every planned-day workout is forced to **gym / 6 / full** with no user control. It won't *crash* (defaults exist) but it's a silent behaviour change. **HIGHEST.**
2. **Coach gear OVERRIDES the Settings equipment preset during generation.** `_executeQuickStart` does `save → applySessionGear(sessionGear) → generate → restore`. So `sessionGear` (default `gym`) **overrides** the persistent home-gym preset the user set in Settings. If the gear chip is demoted while `sessionGear` stays `'gym'`, generation **ignores the Settings preset** and builds full-gym. Two equipment systems collide. **HIGH (subtle).**
3. **Settings `updateSettingsUI` (6784) reads `appState.exerciseCount`** (a slider mirror in Settings). The slider must remain a real, settable value or the Settings mirror desyncs from the (now hidden) Coach slider. **MEDIUM.**
4. **`sessionGear` is not persisted** (plain global). Already resets to `gym` per load; a recommendation/Adjust layer should seed it (from the equipment preset) rather than assume the last chip value survives. **MEDIUM.**
5. **`applyQsTypeSelection` (load) + `currentWorkoutMeta` summary** reflect/read the state for display. Both already guard (`querySelectorAll`, `|| {}`), so hidden chips degrade gracefully. **LOW.**

---

## 4. Phased low-risk sequence — recommendation ON TOP first, demote second

**Invariant for every phase: never delete the state vars (`sessionGear`, `exerciseCount`, `qsType`, `qsFocus`, `equipment`/`customEquipment`) or their writer functions. Only the *UI mounting* moves.** Every cross-screen reader binds to state, so state-preservation = no breakage.

- **Phase 0 — guard (now):** freeze the contract. State vars + defaults stay; `setSessionGear`/`setQs*`/`updateExerciseCount` remain the canonical writers. (This map is the artifact.)

- **Phase 1 — recommendation layer ON TOP (pure addition, zero demotion):** add a "Recommended today" card **above** the existing chip block. It computes a suggested `{type, focus, equipment, count}` (from the planned day, recent history, niggles) and offers **one-tap "Start Recommended"** → calls `startConfiguredWorkout` / `_executeQuickStart` with those values. The chips stay fully visible and functional. **No reader loses its source.** Test gate: Recommended-start builds correctly; chip-start and Plan-start unchanged.

- **Phase 2 — reconcile equipment authority (the #2 guard) BEFORE hiding gear:** make generation fall back to the **Settings equipment preset** when the Coach gear is unset, instead of forcing `sessionGear='gym'` — e.g. seed `sessionGear`/the applied equipment from `appState.equipment`/`customEquipment` (preset) on load, so the two systems agree. Do this *while the gear chip is still visible* so it's verifiable. Test gate: with a dumbbell-only preset and no gear tap, a Quick Start AND a Plan-start both build dumbbell-only (not full gym).

- **Phase 3 — demote chips behind "Adjust" (collapse, don't remove):** wrap the equipment/type/focus/slider block in a default-collapsed **"Adjust"** disclosure (`<details>` or a toggle). The **same** controls remain mounted and writable — only visually hidden. `applyQsTypeSelection` still reflects state into them on open. All readers (Plan-start, Settings mirror, generation, summary) untouched. Test gate: open Adjust → chips still set state; Plan-start still honours equipment/count; Settings slider mirror still in sync; reload → Recommended still computes.

- **Phase 4 — (optional) persist `sessionGear`** into appState so a chosen gear survives reload and the Plan-start path is deterministic across sessions.

**Why this order is safe:** Phase 1 adds a path without touching any reader. Phase 2 removes the latent equipment-override collision *before* the gear chip can disappear (so demotion can't strand the Settings preset). Phase 3 only changes CSS/visibility, never the state or writers. At no point does a cross-screen reader lose its data source.

---

## 5. Summary
- **Config readers outside Coach:** (1) **Plan/banner "Start Workout"** consumes `sessionGear` + `exerciseCount`; (2) **Settings** reads `exerciseCount` and **co-owns** `equipment`/`customEquipment` via Equipment-Presets. AI consult/assessment use a separate `consultProfile`; encyclopedia/history are independent.
- **Highest risk:** Plan-start silently inheriting Coach gear/slider, and the Coach gear **overriding** the Settings equipment preset (`applySessionGear` save/restore forces `gym`).
- **Nothing loses its data source if the state vars + writers survive** — the chips are writers, readers bind to `appState`/globals.
- **Phasing:** recommendation card **on top** (Phase 1) → reconcile equipment authority (Phase 2) → **collapse** chips behind "Adjust" without removing them (Phase 3) → optionally persist `sessionGear` (Phase 4). Never delete state or writers; only relocate UI.

---

SIGN OFF: T5 | 2026-06-16 19:34 AEST (09:34 UTC)
