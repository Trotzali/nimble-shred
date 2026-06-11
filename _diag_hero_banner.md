# Diagnosis — hero banner missing after consultation accept

**Author:** T2 (read-only). No edits, no git.
**Symptom:** front-page hero ("Thursday, Jun 11 / Planned: LEGS / Start Workout") doesn't render after accepting an AI-consultation plan, even though the Plan tab shows the plan (Resilient Strength Flow, Thu = Legs).

## 1. Banner render fn + data source

- **`updateTodaysBanner()`** — `index.html:5883`.
- **Reads `appState.activePlan.schedule[dayIdx]`** (`:5887,:5890`) — **not** `currentPlan`, not anything else.
- **Show/hide:** hides if `type === 'rest'` **or** `isDayCompleted(dayIdx)` (`:5892`); otherwise sets date + type and `display:block` (`:5903`).
- The banner only changes state when **this function is called**. It is *not* invoked by `switchTab('plan')` (that renders overview/calendar/etc. but never the hero), so something on each accept path must call it explicitly.

## 2. The two accept paths — what each writes / calls

**Wizard `acceptPlan()` (v84) — `:5862`:**
`saveAppState()` → `removeItem('currentPlan')` (`:5866`, the v84 single-source line) → `closePlanGenerator()` → `renderPlanCalendar()` → `renderPlanOverview()` → **`updateTodaysBanner()` (`:5870`)** → speak. ✅ refreshes the banner.

**Consultation `generateFromConsultation()` plan branch — `:7942`:**
sets **`appState.activePlan` with the correct `schedule`** (`:7944-7950`) → `saveAppState()` (`:7951`) → `setItem('currentPlan', …)` (`:7952`) → `renderPlanOverview()` (`:7953`) → `renderPlanCalendar()` (`:7954`). **Never calls `updateTodaysBanner()`.** ❌
The **"View My Plan →"** button (`:7961`) runs `closeConsultation(); switchTab('plan'); renderPlanCalendar();` — also **no `updateTodaysBanner()`.** ❌

## 3. Exact mismatch + v84's role + fix

- **Mismatch:** it is **not** a data-field mismatch. The banner's source — `appState.activePlan.schedule` — **is** written (correctly: Thu→legs) by the consultation path. The defect is a **missing render-trigger**: the consultation accept path and its "View My Plan →" button never call `updateTodaysBanner()`, so the hero stays in its prior (hidden) state until a page reload (`window.onload` is the only thing that then re-runs it).
- **The `removeItem('currentPlan')` (v84) is a red herring for this bug** — the banner reads `activePlan`, not `currentPlan`, so clearing `currentPlan` cannot affect it.
- **v84 EXPOSED, did not introduce, the gap.** v84 wired `updateTodaysBanner()` into the *wizard* `acceptPlan` (making that path refresh the hero live). The consultation path was *never* wired to refresh the banner — that omission predates v84 — but v84 fixing one path and not the other is what made the inconsistency visible ("wizard shows it, consultation doesn't").
- **Minimal fix (one shared render on every plan-landing path):** add **`updateTodaysBanner();`** in the consultation plan branch right after `renderPlanCalendar()` (`:7954`), and in the "View My Plan →" onclick (`:7961`). Cleanest single-source: extract the post-accept render trio used by the wizard — `renderPlanCalendar()` + `renderPlanOverview()` + `updateTodaysBanner()` — into one helper (e.g. `refreshPlanViews()`) and call it from **both** `acceptPlan()` and `generateFromConsultation()` (and the View-My-Plan button), so the banner, Plan-tab cards, and the plan-today hero can never drift again.

---

**Sign-off:** T2 — 2026-06-11 18:00
