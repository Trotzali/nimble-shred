# Reskin IA / layout map — redesign-10 (structural part)

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors = element id / function; line numbers indicative (v106 working tree, drift).

## 0. Current information architecture (skeleton)

`<body>` (L1204) = **6 sibling `.container` views** (only one `.active` at a time,
toggled by `switchTab`) + a fixed bottom `.nav-bar` + modals.

| view id | line | nav? | role |
|---|--:|---|---|
| `view-coach` | 1207 | **Coach** | **HOME** — hero + Quick Start + active session |
| `view-plan` | 1384 | Plan | consultation entry, plan overview, calendar, history |
| `view-cardio` | 1447 | **—** | **orphaned** (no nav button reaches it) |
| `view-settings` | 1485 | Settings | equipment profiles, voice, units, cloud |
| `view-encyclopedia` | 1680 | Library | exercise browser |
| `view-garmin` | 1718 | Recovery | recovery scorecard |

**Nav bar** (`.nav-bar` L1820): 5 buttons → `switchTab('coach'|'garmin'|'plan'|'encyclopedia'|'settings')`.
**`switchTab(tab)`** (L3398): hides all `.container`, shows `#view-<tab>`, marks the
matching `.nav-btn` active, then per-tab render calls (L3408). Adding a tab = (a) a
`#view-<x>` container, (b) a `.nav-btn` with `onclick="switchTab('<x>')"`, (c) an
optional render branch in `switchTab`.

**Modals** (overlay, not views): `#checkin-modal` (1298), `#custom-builder-modal`
(1839), `#plan-generator-modal`, `#day-editor-modal`.

## 1. Home / hero structure (`view-coach`, 1207)

In source order inside `view-coach`:
1. **Hero** — `#todays-banner` (L1210). Rendered by **`updateTodaysBanner`** (L~6096,
   rewritten in v94 → 3 states: rest-day card / done-state / workout "Start Today's
   Plan"; v99 routes today's type through `getEffectiveType`). Hard-coded purple
   gradient inline style.
2. Title row — "Workout Coach" `<h2>` + version badge (L1217-1219).
3. **`#quickstart-panel`** (L1222) — **all session config** (see §2).
4. `#workout-interface` (L1288) — active session (hidden until a workout starts;
   `startWorkout` hides hero + panel and shows this).

**Joint state already exists** but is buried in the check-in modal: `#checkin-modal`
→ `#checkin-niggle-step` (L1329) / `#niggle-joint-chips` (L1334) / `toggleNiggleChip`,
persisted to `appState.niggleJoints` + `niggleSetAt`, read live by `niggleSafe`
during generation. The hero does **not** surface it today.

## 2. Where config lives (two homes)

**Session config — home `#quickstart-panel` (L1222):**
- Exercises/workout: `#exercise-count-slider` (L1232 → `updateExerciseCount`).
- Equipment (ephemeral): `#session-gear-toggles` (L1246 → `setSessionGear`).
- Type chips (L1254 → `setQsType`) · Focus chips `#qs-focus-chips` (L1263 → `setQsFocus`).
- Primary CTA: **Start Quick Workout** (L1270 → `startConfiguredWorkout`).
- Secondary CTAs: **AI Coach Consultation** (L1273 → `startConsultation`), **Custom
  Workout Builder** (L1274 → `openCustomBuilder`), **Random Workout** (L1275).

**Persistent config — `view-settings` (L1485):** equipment presets/chips/saved
profiles (`#equipment-presets` L1620, `renderEquipmentPresets` L6465), voice
(`#voice-enabled` / `#voice-level` L1640-1644 → `saveVoiceSettings`), weight unit
(`[data-weight-unit]` L1656 → `setWeightUnit`). **Already appropriately tucked
away** — redesign-10's "demote config" targets the *home* Quick Start, not Settings.

> **ID contract (critical):** every config control above is read by
> `getElementById`/`querySelector` on a **single** instance. Any relocation must
> preserve the IDs and **not duplicate** them (a duplicate `#exercise-count-slider`
> etc. breaks the handlers — cf. the historical duplicate-id audit note).

---

## 3. redesign-10 hook points

### 3a. Joint-aware hero on home
- **Hook:** `#todays-banner` markup (L1210) + **`updateTodaysBanner`** (L~6096).
  Read `appState.niggleJoints`/`niggleSetAt`; render a "Training around: shoulder ·
  knee" row (or a "Something hurts?" affordance) in the hero. Wire the affordance to
  the existing niggle picker (reuse `#checkin-niggle-step` via `showCheckIn`, or a
  small dedicated opener) so it's settable/clearable from home, not only pre-workout.
- **Classification:** **mixed.** Visual reskin of the hero card = **pure-CSS**
  (gradient→token, layout). The joint-aware **content/affordance = JS + structure**
  (new branch/row in `updateTodaysBanner`, new markup, opener wiring).
- **Risk:** medium. `updateTodaysBanner` already has 3 states (v94/v99) — the niggle
  line must **compose with** them (show across states), not replace them.
- **Phasing:** (1) CSS reskin the hero card (pure-CSS, reversible). (2) add a niggle
  status row reading existing state (JS, additive). (3) wire the "edit niggles" opener.

### 3b. Demote config
- **Hook:** placement/visibility of `#quickstart-panel` (L1222) within `view-coach`.
- **Two routes:**
  - **(A) collapse in place** — wrap the count/equipment/type/focus block in a
    `<details>`/toggle, leaving Start + the 3 CTAs visible. **Mostly CSS + tiny JS**
    (toggle). Low risk, reversible. IDs untouched.
  - **(B) relocate** the config block into the new Build page (§3c). **Touches
    structure/JS** — move the DOM subtree; handlers keep working *iff* IDs move with
    it and stay single-instance. Higher risk.
- **Risk:** A low · B medium. **Phasing:** ship A first (validates the demoted-home
  UX with near-zero risk); do B only once the Build page exists and is verified.

### 3c. Dedicated "Build your own" page
- **Current:** Custom Builder is a **modal** — `#custom-builder-modal` (L1839),
  `openCustomBuilder` (L5445) / `closeCustomBuilder` (L5460), `#builder-search`
  (L1847), `#builder-exercise-list` (L1879).
- **Hook (3 edits to stand the page up):**
  1. New `<div class="container" id="view-build">` (sibling of the other views).
  2. New `.nav-btn` in `.nav-bar` (L1820) → `switchTab('build')` (6th item; `.nav-btn`
     is `flex:1` so 6 fit, spacing tightens — 6 is the practical max).
  3. `switchTab` (L3398): add a `if(tab==='build') renderBuilder()` branch; the
     generic `#view-<tab>` show already handles display.
  4. Move the modal's inner content (search + list + filter chips) into `#view-build`;
     convert `openCustomBuilder`/`closeCustomBuilder` to render-on-tab-switch.
  Optionally house the demoted §3b config here too.
- **Classification:** **structure + JS** (new view, nav button, `switchTab` branch,
  modal→view conversion). **Highest-risk of the four.**
- **Phasing:** (1) add empty `#view-build` + nav button + `switchTab` branch
  (placeholder renders — low risk). (2) port the builder body modal→view, keeping the
  modal working in parallel until verified, then remove it. (3) fold in §3b config.
- **Flag:** the **orphaned `view-cardio`** (no nav button) is pre-existing IA debt;
  redesign-10's nav change is the moment to decide re-home vs remove (out of scope,
  but don't add a 7th tab without resolving it — nav would crowd).

### 3d. "Ask the coach" entry
- **Current:** `startConsultation()` reachable from the Quick Start secondary button
  (L1273) and the Plan-tab "AI Coach Consultation" card (L1387) — both buried.
- **Hook:** add a **prominent home CTA** (hero-adjacent) calling the existing
  `startConsultation()`. The consultation flow (modal) is unchanged — only a new
  entry affordance.
- **Classification:** **pure markup + CSS** (a button onto existing JS). **Lowest
  risk.** (A *nav* tab is a poor fit — consultation is a modal flow, not a view; keep
  it a hero CTA.)
- **Phasing:** earliest, standalone win.

---

## 4. Cross-cutting flags
- **`updateTodaysBanner` is shared & recently rewritten** (v94 states + v99
  `getEffectiveType`). 3a and any hero reskin edit the *same* function/markup —
  coordinate so the niggle state composes with the rest/done/workout states.
- **Config IDs are single-instance** and read by id — never duplicate when demoting/
  relocating (§2 ID contract).
- **Nav is at practical capacity** (5 → 6 with the Build tab). A 7th would crowd
  `flex:1` targets on a 375px screen — resolve the orphaned cardio view rather than
  add alongside it.
- **Plan-write sync** (consultation sets `currentPlan` + `activePlan` together) is
  unaffected by home/hero changes; the separate `_spec_plan_tab_fix.md` (overview↔
  calendar desync) and PA-2 are independent of redesign-10.
- **Modals stay modals** unless promoted: only the Custom Builder (3c) is being
  promoted to a view; check-in / plan-generator / day-editor remain overlays.

## 5. Safest overall sequence (low→high risk)
1. **3d** Ask-the-coach home CTA (markup+CSS).
2. Hero **reskin** CSS (3a step 1).
3. **3b-A** collapse Quick Start config in place (CSS + tiny JS).
4. **3a** joint-aware hero state + opener (JS, additive to `updateTodaysBanner`).
5. **3c** Build page — placeholder view+nav first, then port the builder modal→view.
6. **3b-B** relocate the config into the Build page; retire the builder modal.

Each step is independently shippable and reversible; the only `index.html`
structural edits are 3c (new view/nav) and 3b-B (DOM move) — gate those behind the
lower-risk steps.
