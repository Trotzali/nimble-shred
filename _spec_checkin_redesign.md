# Spec — Readiness check-in ("How are you feeling?") redesign

**Terminal:** T2 (READ-ONLY on `index.html` — no edits, no git). Spec only; T1 applies.
**Why:** the check-in looks amateur (raw emoji) and feels meaningless (the real adjustment isn't shown at the moment of choice). Map for the design-language reskin + emoji→lucide face swap (`_icon_set_lucide` §7.2) + show-the-consequence + the §6 informed-consent gate.

## 1. The flow (symbols)
- **`showCheckIn(callback)`** — stashes `window._checkInCallback`, resets to step-1 (feelings grid shown, niggle step hidden, chips cleared), `#checkin-modal` → `flex`. Called by `startConfiguredWorkout` / `quickStartWorkout` / `startWedgeSession` (all gen paths route through it).
- **Modal markup** `#checkin-modal` (inline-styled overlay + inline-styled card). Title "How are you feeling?" + sub "This adjusts your warmup, weights, and rest periods". 2×2 grid `#checkin-feelings` of 4 `.checkin-option`s + a `#checkin-skip-btn`.
- **4 options** → `onclick="processCheckIn('fresh'|'normal'|'tired'|'pain')"`; Skip → `processCheckIn('skip')`.
- **`processCheckIn(feeling)`** — sets module var `sessionCheckIn`; for `'pain'` it **reveals the niggle step** (`#checkin-niggle-step`) and returns *without* closing/firing the callback; for every other feeling it clears niggle flags, closes the modal, `speak()`s, and runs `_checkInCallback`.
- **`sessionCheckIn`** (module `var`, default `'skip'`) is the carrier read downstream.

## 2. What each feeling ACTUALLY does — exact adjustments (`checkInConfig`)

| feeling | `warmupMult` | `weightMult` | `restBase` | extra |
|---|---|---|---|---|
| **fresh** | 1.0 | 1.0 | **60s** | — |
| **normal** | 1.15 | 1.0 | **75s** | — |
| **tired** | 1.4 | **0.9** | **90s** | +1 *"Gentle Full-Body Mobility"* 60s prepended to warmup |
| **pain** | 1.5 | **0.8** | **120s** | +1 mobility drill prepended **+ niggle joint exclusion** (§3) |
| **skip** | 1.0 | 1.0 | 75s | — (no badge shown) |

**Where each is consumed (proof, by symbol):**
- **`warmupMult`** → `startWarmup()`: scales **every** warmup drill's `duration` by `mult` (`duration: Math.round(ex.duration * mult)`); `tired`/`pain` also `unshift` a 60s mobility drill. (So it's *longer warmup per drill* + an *extra drill*, not "more sets".)
- **`weightMult`** → `renderWorkout()`: `suggestedWeight = round(progression.suggestedWeight * checkInWeightMult)` — nudges the **Smart-Spotter suggested starting weight only** (first set; carry-forward overrides later sets). It does **not** constrain what the user logs.
- **`restBase`** → `startRestTimer()`: `totalSeconds = config.restBase` — the rest countdown length.

**Is there any visible consequence today?** Yes but weak: `renderWorkout()` paints a small badge on the *current* exercise card after start, e.g. `🤕 Pain — −20% weight • 2min rest • skip if painful` (built inline from a per-feeling string at the `ciConfig` block). So the consequence is shown **after** choosing, tiny, emoji-led — never at the moment of choice (the modal sub-text is the generic "adjusts your warmup, weights, and rest periods"). That's the "feels meaningless".

## 3. "Something Hurts" → joint capture → §6 gate — **what exists vs the gap**

**EXISTS (works):**
- `processCheckIn('pain')` reveals `#checkin-niggle-step`: 9 joint chips `[data-niggle]` = neck · shoulder · elbow · wrist · **tSpine** (Upper back) · **lowBack** (Lower back) · hip · knee · ankle (the 9-joint vocab).
- `toggleNiggleChip(btn)` toggles `.selected`. **`confirmNiggles(workAround)`** — *Start, work around it* collects selected `data-niggle` → **`appState.niggleJoints`** + stamps `appState.niggleSetAt`; *Just go easy* → `niggleJoints=[]` (generic nudge only). Persists, closes, `speak()`s reassurance, fires the callback.
- **Feeds generation:** `getNiggleJoints()` → `smartSelect(..., { niggle })` as a **HARD exclusion** of any exercise loading a flagged joint; thin-pool guard warns on short fill / blocks (alert) on empty.
- Lifecycle: 48h pre-tick convenience (`processCheckIn`), reset on any non-pain feeling, 3-day load-time expiry (`window.onload`). AS-1 mirrors `niggleJoints` → `nimbleProfile_v1.niggles[]` (read-only seed, `severity:null`).

**GAP (the §6 informed-consent gate is absent):**
- **No consent/disclaimer step.** `confirmNiggles(true)` proceeds straight to generation with only a `speak()` ("we'll go easy… skip anything that hurts"). There is **no** "not medical advice" acknowledgment, **no** red-flag triage (sharp/radiating pain, numbness, can't bear weight, night pain → STOP / refer), and **no** explicit user acknowledgement before training on a flagged injury.
- **No severity capture.** The AS-1 schema already has a `severity` field, but the check-in writes it `null` ("severity unknown from check-in") — so the gate has nothing to escalate on.
- **Wiring point for §6:** interpose **between joint-capture and `confirmNiggles(true)` proceeding** — capture joints (exists) → **§6 consent gate (new)** → on acknowledge, set `niggleJoints` (+ new `severity`) → generation's niggle-safe exclusion (exists). This is the entry the flagship Pain-Aware red-flag gate hangs off.

## 4. Reskin surface (classes + emoji sites)

**CSS classes:** `.checkin-option` (bg `rgba(255,255,255,0.04)`, `2px` border `rgba(255,255,255,0.1)`, radius 14px, pad 16px, `transition all .2s`; `:hover` teal border + `rgba(3,218,198,0.06)`; `:active` scale .97; `:focus-visible` ring) · `.checkin-emoji` (`font-size:2em`) · `.checkin-label` (600/0.9em) · `.checkin-desc` (0.75em muted). Niggle step reuses `.rpe-tag` chips + `.btn`/`.btn-main`.
⚠ **The modal container + card are inline-styled** (`#checkin-modal` overlay and the inner card both use inline `style=…`, not token classes) — they don't share `.modal-overlay`/`.modal-content` or the design tokens. Reskin should class-ify them.

**Emoji sites (for §7.2 face swap):**
1. `.checkin-emoji` cards (markup): **💪** Fresh · **👍** Normal · **😩** Tired/Sore · **🤕** Something Hurts.
2. `checkInConfig[*].label` (JS): `'💪 Fresh'`, `'👍 Normal'`, `'😩 Tired'`, `'🤕 Pain'` — these surface in the **active-session badge** via `ciConfig.label`, so the emoji leaks past the modal.
3. Adjacent (same swap family): RPE modal header **💪** + RPE "⚠️ Pain" tag — out of this modal but on §7.2's list.

## 5. Redesign proposal — split & flagged

### (a) VISUAL RESKIN — [CSS / markup, no behaviour change]
- Swap the 4 `.checkin-emoji` glyphs → **lucide face/status icons** (§7.2); also de-emoji `checkInConfig[*].label` (or render its icon separately) so the session badge matches.
- Class-ify the inline-styled `#checkin-modal` overlay + card onto the design-language tokens/modal classes; restyle `.checkin-option` with the token ramp + a **per-feeling accent** (the config already carries `color`: fresh teal / normal / tired amber / pain red — surface as a left-bar/ring) + a real selected state.
- **Flag:** pure presentation; zero logic change.

### (b) SHOW-THE-CONSEQUENCE — [JS + small markup]
- Render the **exact adjustment line on each `.checkin-option` at choice time**, derived from `checkInConfig` so it can't drift: `+${round((warmupMult-1)*100)}% warmup` · `${round((1-weightMult)*100)}% lighter` (omit at 1.0) · `${restBase}s rest` · `+1 mobility` for tired/pain. e.g. Tired card → *"+40% warmup · 10% lighter · 90s rest · +1 mobility"*.
- Centralise as a `describeCheckIn(feeling)` helper and **reuse it for the existing active-session badge** (`renderWorkout` currently hand-writes those strings) — one source of truth.
- **Flag:** additive JS reading existing config; makes the choice meaningful. No change to the adjustment *values* (numbers stay as §2).

### (c) SOMETHING-HURTS → JOINT + §6 GATE — [JS + markup]
- Joint capture is built; **add the §6 informed-consent gate** as a third revealed sub-step (mirroring how the niggle step is revealed), interposed at `confirmNiggles(true)` before it fires the callback: a **not-medical-advice disclaimer + red-flag triage** (sharp/radiating/numbness/can't-bear-weight/night pain → STOP, refer to a professional — no generation) + an **explicit acknowledge** to proceed.
- Optionally capture **severity** here to fill the AS-1 `severity` field (currently `null`), so trend detection + the gate have data.
- Wire: joints → §6 gate → (acknowledge) set `niggleJoints` (+`severity`) → existing `smartSelect` niggle-safe exclusion. This is the on-ramp for the flagship Pain-Aware assistant's red-flag gate.
- **Flag:** behaviour-additive (new gate + optional severity); the downstream exclusion engine is unchanged.

---

**Sign-off:** T2 | 2026-06-17 21:17
