# Map — Hero / readiness system

**Type:** Read-only trace. No code changed, no git, `index.html` untouched.
Anchors by symbol + line (re-anchor by name; lines drift).

## 1. What drives the hero today — `updateTodaysBanner()` @L6291

Renders `#todays-banner` (markup shell @L1220). Rebuilt (innerHTML) on every call;
called by `refreshPlanViews()` (@L8401) + the session start/end paths (@L4585/4609/
7233). Three branches: **completed / rest / workout-day**.

| Signal in the hero | Source symbol | Notes |
|---|---|---|
| Today's type ("Planned: PULL") | `getEffectiveType(getDateForDay(dayIdx), dayIdx)` @L6286 → `appState.adherence.overrides[date]` ‖ `appState.activePlan.schedule[dayIdx]` | adherence override (catch-up/swap) beats the weekly template |
| Date string | `today.toLocaleDateString('en-US',…)` | |
| "Done for today ✓" | `isDayCompleted(dayIdx)` @L6309 → `completedWorkouts` (localStorage) | completed branch |
| Rest-day card | `type === 'rest'` @L6317 | |
| **"PULL tomorrow"** ("Next up:") | `nextPlannedSession(dayIdx, plan.schedule)` @L6267 — scans forward, label `tomorrow`/weekday | pure schedule walk |
| **"tendons 48–72h"** | **static string** @L6320 | NOT data-driven — fixed rest-day copy |
| type icon | `{push:IC.push,…}[type]` @L6327 | |
| Start CTA | `startTodaysWorkout()` @L6334 → `quickStartWorkout(getEffectiveType(...))` | |

**The hero reads ONLY: plan schedule + adherence overrides + completed-days.** It
does **not** read niggle flags, check-in, history, or any freshness signal today.

`updateAiCoach()` @L7243 (the `#ai-coach-suggestions` card, separate element) is an
**adherence-%** message for the week — not a per-muscle readiness line either.

## 2. Niggle + check-in state (the readiness inputs that DO exist)

| Symbol | What | Lifecycle / limit |
|---|---|---|
| `appState.niggleJoints` @L3167 | array of `jointLoad` keys flagged at check-in (e.g. `["elbow"]`) | **session-scoped:** set in `confirmNiggles()` @L3612, read by `niggleSafe`/`getNiggleJoints()` @L3961, **cleared at session end** @L4589/4613, 3-day load-time expiry @L3463. **Joint-level only — no left/right side.** |
| `appState.niggleSetAt` @L3168 | ISO time flags were set | 48h pre-tick @L3579; 3-day backstop |
| `sessionCheckIn` @L3539 | `fresh\|normal\|tired\|pain\|skip` | **transient per session**; drives warmup/weight/rest via `checkInConfig`; `pain` opens the niggle picker. Not persisted, not on hero. |
| `recentlyHammeredJoints(type)` @L3962 | intended soft-freshness hook | **STUB → returns `[]`** (never implemented) |
| `lastTrained{push,pull,legs}` @L3829 | days-since per **type** from `exerciseHistory.sessionDate` | **local var inside the wedge generator only** — ephemeral, per-type (not per-muscle), not stored, not on hero |
| `exerciseHistory[*].sessionDate` + `getMeta().musclesTargeted` @L3954 / `movementPattern` | raw material for per-muscle freshness | exists, but **nothing derives muscle-level freshness** |

## 3. Can the hero carry "Pull today — shoulders fresh, easing the left elbow"?

**Structurally: YES, trivially** — the workout-day branch (@L6328–6331) is built by
innerHTML; adding a sub-line is a few characters. The question is the *data* behind
each clause:

| clause | feasible? | source / gap |
|---|---|---|
| **"Pull today"** | ✅ **HAVE** | `getEffectiveType` (the type already shown) |
| **"shoulders fresh"** | ◑ **DERIVABLE, not built** | No per-muscle freshness exists. Data is present: `exerciseHistory.sessionDate` + `getMeta(name).musclesTargeted`/`movementPattern` → compute *days-since-trained per muscle group*, classify fresh/worked. Needs a new read-only fn (e.g. `muscleFreshness()`); **no new storage**. `lastTrained` (@L3829) proves the pattern but is per-type + ephemeral. |
| **"easing the … elbow"** (joint, no side) | ◑ **PARTIAL** | `appState.niggleJoints` already holds `"elbow"`. But it's **session-scoped + expires** (cleared post-session @L4589/4613) → on a resting-state hero it's often empty. Fix = let the hero read the *active niggle window* (within `niggleSetAt`'s 3-day backstop) instead of clearing on session end, or surface the last check-in's flags. Minor; data exists. |
| **"left elbow"** (side) | ✗ **DATA GAP** | Side (L/R) is **not captured anywhere** — `niggleJoints` is a joint key with no laterality. Needs a side dimension added to the niggle picker + state (a **Human Check-In** change), or drop "left/right" from the copy. |

## 4. The data gap (for the readiness line) — summary

1. **Per-muscle freshness** ("shoulders fresh"): **missing computation, data present.**
   Add a derived `muscleFreshness()` over `exerciseHistory` × metadata
   `musclesTargeted`/`movementPattern` (days-since per muscle → fresh/worked/sore).
   Read-only, no schema change. *This is the main build.*
2. **Persistent niggle readout** ("easing the elbow"): the niggle flag exists but is
   session-scoped + expiring. To show it on the resting hero, **stop clearing it at
   session end** (or have the hero read within the `niggleSetAt` window). Small.
3. **Laterality (left/right)**: **genuine gap** — not modelled. Either extend the
   niggle capture (Human Check-In) with a side, or omit side from the copy.
4. **Human Check-In tie:** the check-in (`sessionCheckIn` + the pain→niggle picker)
   is the **natural capture point** for the readiness inputs — it already records
   feeling + flagged joints, but discards them after the session. Powering a
   *persistent* readiness line means: (a) freshness is derived from history (no
   check-in needed); (b) the niggle/soreness half needs the check-in's output to
   **persist** (survive session end) and, for side, to **capture L/R**.

**Verdict:** the hero can carry the readiness line with **low UI effort**. "Pull
today" is free; "shoulders fresh" needs one new read-only freshness fn (data
exists); the niggle clause works at **joint** granularity once the niggle window is
made readable by the hero; **left/right side is the one true data gap**, requiring a
Human Check-In model change (or dropping side from the wording).

---
SIGN OFF: T4 | 2026-06-16 19:34 (+10:00)
