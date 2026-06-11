# Spec — AI features wiring (Gemini billing now enabled)

**Type:** READ-ONLY analysis + build spec. No edits, no git, index.html untouched.
**Audited against:** committed/on-disk `index.html` at **v77**, and the Vercel backend (`/api/drive`, separate repo).
**Context:** Gemini billing is on → the daily-quota ceiling that previously 500'd the AI features is lifted. This specs the wiring for the three AI surfaces. **Backend changes are isolated to §5** (separate repo — not T1's index.html cadence).

## 0. The proxy contract (shared by all surfaces)
`POST {BACKEND_URL}/api/drive` (`BACKEND_URL` `:25`). Body the app sends today:
```json
{ "action": "gemini", "system": "<system prompt>", "messages": [{"role":"user|assistant","content":"…"}] }
```
- `action` is **vestigial** — `api/drive.js` ignores it; it reads only `system` + `messages`, maps to `gemini-2.5-flash`, returns **`200 {"content":[{"text":"…"}]}`** on success or **`500 {"error":"…"}`** on failure (incl. the old quota case). It role-maps `assistant→model`.
- **Parse contract for every caller:** success path is `data.content[0].text`. **Guard:** check `response.ok` AND `data.content?.[0]?.text` before use — on `{error}` there is no `content`, and blind `data.content[0]` throws (the gap in §1/§2 below).

---

## 1. AI Coach Consultation — EXISTS; verified end-to-end

This is the reference implementation; the other two should match its shape.

### 1.1 Flow (verified)
```
startConsultation(mode)            :7519   resets consultProfile/consultHistory, opens modal, seeds first turn
addConsultMsg + typing indicator   :7567/7602
callConsultAI()                    :7612   POST /api/drive {system:buildConsultSystemPrompt(), messages:consultHistory}
  buildConsultSystemPrompt()       :7866   PT persona (men 40+), 8 fields to collect, MANDATES [BUBBLES]+[PROFILE] blocks
  parseConsultResponse(raw)        :7679   regex-extract [BUBBLES]…[/BUBBLES] and [PROFILE]{json}[/PROFILE]; strips them from shown text
  merge non-null profile keys      :7644   → consultProfile, persist localStorage 'consultProfile', updateProfileBar()
  showConsultBubbles / ready→Generate button
generateFromConsultation()         :7778   POST /api/drive {system:"…ONLY JSON…", messages:[genPrompt + JSON.stringify(consultProfile)]}
  strip ```json fences, JSON.parse :7826
  plan  → appState.activePlan {name,frequency,schedule,week,phase} + localStorage 'currentPlan' → renderPlanOverview/Calendar
  workout → quickStartWorkout(result.type)
```

### 1.2 What its output feeds
- **`consultProfile`** (fields: `goal, days, age, experience, equipment, injuries, timePerSession, preferences, mode, ready`) →
  - **Plan-tab profile chips** via `updateProfileBar` (`:7725-7731`): 🎯 goal · 📅 days · 🎂 age · 📊 experience · 🏋️ equipment · ⚠️ injuries · ⏱ time.
  - **Plan generation constraints** — the whole `consultProfile` is JSON-injected into `genPrompt` (`:7795`); `injuries`/`experience`/`age` explicitly steer the plan ("For 40+ … prioritise joint health", `:7805`).
- **Generated plan JSON** → `appState.activePlan.schedule` (the weekly day-type map the Plan calendar + `startTodaysWorkout` consume) + `currentPlan` (phases/guidance shown in the overview).

### 1.3 Prompt sketch (as-built, condensed)
- **System:** "personal trainer doing an initial consultation … Specialise in men 40+ … ONE topic at a time, 2-3 sentences … MUST end every response with `[BUBBLES]a|b|c[/BUBBLES]` and `[PROFILE]{…}[/PROFILE]` … set `ready:true` only when goal+days+equipment+mode known."
- **Generate (plan):** system "Return ONLY valid JSON … no backticks"; user = profile + equipment list + `{name,duration,guidance,weekSchedule,phases[]}` schema; valid day types push/pull/legs/cardio/nimble/rest.

### 1.4 JSON shapes + parse guards (as-built + gaps)
- **[PROFILE]** parse is guarded (`try/catch`, `:7694-7698`) — bad JSON → warn, keep prior profile. ✅
- **[BUBBLES]** split on `|`, trimmed, filtered. ✅
- **Generate** strips fences then `JSON.parse` inside the outer `try` (`:7826-7827`). ✅ but **gap:** `data.content[0].text` is read **without** a `response.ok` / `data.error` guard (`:7826`) — on a 500 `{error}`, `data.content` is `undefined` → TypeError → caught by the outer `catch` (degrades, but via exception, and the user sees the generic "had trouble generating"). `callConsultAI` DOES check `response.ok` (`:7627`) — but **also** then does `data.content[0].text` unguarded (`:7630`). **Fix (client):** add `if (!response.ok || !data.content?.[0]?.text) throw new Error(data.error || 'AI unavailable')` before use, in both call sites.

### 1.5 Error / quota fallback (current + recommended)
- Current: `callConsultAI` catch → "Sorry, I had trouble connecting … try again" + a "Try again" bubble (`:7674`). `generateFromConsultation` catch → "Had trouble generating …" + Try again/Close.
- **Recommended:** distinguish **429/quota** ("The coach is busy right now — try again in a moment") from outage, using the §5 backend change that surfaces `429 {retryAfter}`. Until then the generic message is acceptable (billing-on makes quota rare).

### 1.6 Build status: **DONE** — only the two `response.ok`/`content` guards (§1.4) are worth hardening. No new wiring.

---

## 2. Fitness Assessment — AI layer on the structural #12

The structural step-through (`_spec_assessment_structural.md`) is non-AI and owns the deterministic result write. **Do not let the AI replace the deterministic path** — it is the safety floor and the graceful-degradation target.

### 2.1 The deterministic data path (already built — the floor)
```
assessment logged sets → buildStrengthProfile()  :8192   strengthProfile[pattern] = {testExercise, weight(max), reps(avg), date, equipType}
getEstimatedWeight(name)  :8222   strengthRatios[pattern][name] × profile[pattern].weight  → starting weight for ANY ratio-table exercise
getProgression(name)      :4090   no history → uses getEstimatedWeight → suggestedWeight → Smart Spotter pre-fills the weight input (:3940/:3970)
```
So the assessment already writes Smart-Spotter starting weights with **zero AI**. The AI layer is **additive**.

### 2.2 AI call A — end-of-assessment summary (display only)
Fires once after `buildStrengthProfile()` on completion (`patchFinishWorkoutForAssessment`). Turns the profile into a plain-language read.
- **Prompt sketch — system:** "You are a strength coach summarising a fitness assessment for a man 40+. Plain language, encouraging, NO medical claims, NO diagnosis. 3-4 sentences. Name the biggest relative strength and the weakest pattern, and one training implication."
- **user:** `STRENGTH PROFILE: {JSON.stringify(strengthProfile)}` + `PATTERN LABELS: push-horizontal=Chest Press, …`.
- **Expected JSON:** `{"summary":"…","strongest":"squat","weakest":"pull-horizontal","focusTip":"…"}`.
- **Parse guard:** `response.ok && data.content?.[0]?.text`; strip fences; `JSON.parse` in try/catch; on any failure **show the deterministic summary** (already in the handoff copy `:7851`-style) — no blank state.
- **Writes:** nothing structural — display only. Optionally cache `strengthProfile.aiSummary` for re-display.

### 2.3 AI call B — calibration review (refines starting weights, CLAMPED)
This is the "write starting weights for the Smart Spotter" part — but **bounded** so the AI can never set an unsafe load.
- **Prompt sketch — system:** "Given tested base weights per movement pattern, suggest a starting-weight multiplier (0.85–1.15) per pattern for untested accessory work, accounting for the imbalance between patterns. NEVER exceed 1.15 or go below 0.85. Output JSON only."
- **user:** `STRENGTH PROFILE: {…}` + `RATIO TABLE PATTERNS: {Object.keys(strengthRatios)}`.
- **Expected JSON:** `{"adjustments":{"h_push":1.0,"h_pull":1.1,"squat":0.95, …},"rationale":"…"}`.
- **Parse + safety guards (hard):**
  1. `response.ok && content` else **skip silently** (deterministic estimate stands).
  2. Each multiplier **clamped to [0.85, 1.15]**; non-numeric/missing → `1.0`.
  3. Written to a **separate overlay** `localStorage 'strengthProfileAI' = {adjustments, date}` — **never** overwrites `strengthProfile`.
  4. `getEstimatedWeight` change (§2.4): apply the overlay multiplier only if present, valid, and ≤ the pattern's tested max (never prescribe heavier than what was tested for that pattern).
- **Degradation:** overlay absent/failed → `getEstimatedWeight` behaves exactly as today (deterministic). This is the whole point — AI tunes, never gates.

### 2.4 Smart-Spotter integration point
`getEstimatedWeight` (`:8222`) gains one optional step: `estimated = base × ratio × (aiAdjust[pattern] || 1.0)`, with `aiAdjust` read from the clamped overlay. `getProgression`/`renderWorkout` unchanged — they already consume `suggestedWeight`. One-line, reversible, safe-by-default.

### 2.5 (Optional) AI call C — per-set adaptive feedback
The conversational version of the structural rules-based nudge (`_spec_assessment_structural.md` §6a). Lower priority; same proxy + guard pattern; display only; falls back to the deterministic nudge on any failure. Defer unless wanted.

### 2.6 Build status: **TODO** — calls A (summary) and B (clamped calibration) are net-new; both ride on the structural #12 landing first and on the deterministic floor staying authoritative.

---

## 3. Coach chat — roadmap (new surface)

A free-form "ask the coach" chat (distinct from the structured consultation). Does not exist yet.

### 3.1 Scope
- **In scope:** training Q&A — technique, programming, "why is my bench stalling", exercise swaps, recovery, motivation; grounded in the user's own data (plan, history, niggles).
- **Out of scope (hard):** medical diagnosis, naming injuries/conditions, treatment/dosage. Anything that reads as pain/injury → caution + refer + route to the niggle capture (`_spec_quickstart_rework.md` §B7) / a professional. This mirrors the **already-built `/api/rehab` red-flag posture** (separate backend file) — reuse that guardrail language.

### 3.2 Context window contents (assemble client-side, inject as a context block)
Compact, capped, newest-first:
- **Recent sessions (last 3–5):** from `completedWorkouts` + `exerciseHistory` — type, date, top sets, RPE.
- **Active plan:** `appState.activePlan` (name, schedule, week, phase) + today's planned type.
- **Niggles:** `appState.niggleJoints` (if set) — "currently flagged sore: knee, lower back" → triggers caution tone + avoids recommending loaded work on those joints.
- **Profile:** `consultProfile` (goal, experience, equipment, age) + `strengthProfile` (pattern base weights) if present.
- **Cap:** trim to ~1–2k tokens; summarise history rather than dumping every set.

### 3.3 Prompt sketch — system (guardrailed)
"You are a strength & conditioning coach inside the Nimble Shred app, specialising in training men 40+. Answer training questions using the user's context below. **RULES:** You are NOT a medical professional — never diagnose, never name an injury or condition, never give treatment/dosage. If the user describes pain, numbness, swelling, or anything that started after an injury, STOP the training advice, use caution language, and tell them to get it checked by a qualified professional (and to use the in-app 'Something Hurts' flow). Keep answers practical and short. Use the user's plan/history; don't invent numbers. CONTEXT:\n{contextBlock}"

### 3.4 JSON shape + parse guards
- Plain chat → **plain text** (no JSON envelope needed beyond the proxy's `content[0].text`). Same `response.ok && data.content?.[0]?.text` guard; on failure show "Coach is offline right now — try again shortly" and keep the input.
- Optional structured suffix (like consultation) only if quick-reply bubbles are wanted: reuse `[BUBBLES]…[/BUBBLES]` + `parseConsultResponse`'s extractor.

### 3.5 Guardrail enforcement — client prompt vs server endpoint
Two options:
- **(a) `/api/drive` + strong system prompt (client-enforced)** — fastest; matches surfaces 1–2. Risk: the guardrail lives in client code.
- **(b) New `/api/coach` (server-enforced, mirrors `/api/rehab`)** — the medical guardrail + a red-flag pre-gate live server-side, can't be edited away, and reuse the rehab pattern already in the backend. **Recommended** for the medical-safety surface. See §5.

### 3.6 Build status: **ROADMAP** — net-new UI + (recommended) a backend endpoint. Phase last.

---

## 4. Cross-cutting: error / quota / degradation (all surfaces)
1. **Every call:** guard `response.ok && data.content?.[0]?.text` before use; treat `data.error` as the message. (Fixes the §1.4 gap and standardises.)
2. **429 / quota:** with the §5 backend change (pass through `429 {retryAfter}`), show "AI is busy — try again in {n}s"; optionally one auto-retry after `retryAfter`. Billing-on makes this rare but it must not present as a crash.
3. **Degrade gracefully (mandatory):** Consultation → keep chat, allow manual plan/Quick Start. Assessment → deterministic `strengthProfile`/`getEstimatedWeight` always stands (AI is overlay only). Coach chat → "offline" message, input preserved. **No AI failure may block a core flow.**
4. **Timeouts:** wrap fetches with an `AbortController` (~20s) so a hung proxy doesn't freeze the typing indicator; on abort → the same graceful message.

---

## 5. BACKEND changes (separate repo — `nimble-shred-backend`, NOT index.html)
All optional-but-recommended; surfaces 1–2 work on the existing `/api/drive` unchanged.
1. **`/api/drive` — pass through quota as 429 (recommended).** Today Gemini 429/quota is mapped to `500 {error}` (confirmed in the earlier proxy diagnostic). Change: on Gemini 429, return **`429 {"error":"…","retryAfter":<seconds>}`** (parse Gemini's `retryInfo`). Lets every client distinguish "busy, retry" from "broken." Low risk; `/api/drive` shape otherwise unchanged.
2. **`/api/coach` — new, server-enforced guardrails (for surface 3, recommended).** Mirror the existing `/api/rehab` (system prompt + red-flag pre-gate already built): no diagnosis, injury-caution, refer-to-professional. Same `{messages, (context)}` in → `{content:[{text}]}` out shape so the client reuses the §0 contract. Keeps the medical guardrail off the client.
3. **No backend change needed** for the consultation, plan generation, or assessment-summary calls — they ride `/api/drive` as-is.
4. **Cadence:** backend deploys via Vercel from its own repo (pull-before-push; `api/drive.js` must not break — see backend memory). Independent of T1's index.html releases.

---

## 6. Per-feature build phasing

| Phase | Feature | Scope | Depends on | Test gate |
|---|---|---|---|---|
| **AI-1** | Harden existing calls | Add `response.ok`+`content` guards to `callConsultAI`/`generateFromConsultation`; AbortController timeouts | none | Force a 500 → graceful message, no TypeError; happy path unchanged |
| **AI-2** | Backend 429 passthrough | `/api/drive` returns `429 {retryAfter}` on Gemini quota | backend repo | Simulated quota → client shows "busy, retry in Ns", not "broken" |
| **AI-3** | Assessment summary (call A) | NL summary after `buildStrengthProfile`; display-only; deterministic fallback | structural #12 landed | AI up → summary shown; AI down → deterministic summary; never blank |
| **AI-4** | Assessment calibration (call B) | Clamped `[0.85,1.15]` overlay → `strengthProfileAI`; one-line `getEstimatedWeight` change | AI-3 | Overlay applied within band, never > tested max; overlay absent → identical to today |
| **AI-5** | Coach chat | New chat UI + context assembler + (recommended) `/api/coach` guardrailed endpoint | AI-1/AI-2; backend §5.2 | Training Q answered from context; pain input → caution+refer (no diagnosis); proxy down → offline message |

Sequence: **AI-1 → AI-2** (foundation/safety) → **AI-3 → AI-4** (assessment, after #12) → **AI-5** (chat, last). AI-1 is pure hardening and ships immediately.

---

## 7. Summary
- **Consultation (1): DONE & wired** — chat → `consultProfile` → Plan-tab chips + plan-generation constraints → `appState.activePlan`. Only gap: two unguarded `data.content[0]` reads (harden in AI-1).
- **Assessment (2): AI is additive** — deterministic `buildStrengthProfile`→`strengthRatios`→`getEstimatedWeight`→Smart Spotter is the floor. Add a display-only summary (call A) and a **clamped** calibration overlay (call B) that refines starting weights without ever overriding the safe deterministic value.
- **Coach chat (3): roadmap** — scope = training Q&A grounded in plan/history/niggles; hard medical guardrails (reuse the `/api/rehab` red-flag posture), recommended as a server-enforced `/api/coach`.
- **All surfaces** must guard `response.ok`+`content`, degrade gracefully (no AI failure blocks a core flow), and (after AI-2) treat 429 as "busy, retry." Backend work is isolated to `/api/drive` 429 passthrough + an optional `/api/coach`, in the separate repo.

---

*Signed off — T5, terminal pts/T5, 2026-06-11 17:09 AEST (07:09 UTC). Read-only: no edits, no git, index.html untouched.*
