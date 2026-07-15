# _spec_audit_findings.md — v1.0
## Full-app audit synthesis (T2 code health · T3 UX · T4 data · T5 platform)
## Audited: index.html v125, 2026-07-15

Four independent read-only audits, one conclusion: **the training engine is
good; the foundation under it is not.** Every audit found the same house
style — silent failure. Sync reports "Connected" while data is lost; export
says "All Data" while omitting the training log; catches swallow errors;
fetches never time out. Before this codebase carries a second product, the
foundation gets fixed. Below: every material finding, tiered, then the
rebuilt queue.

---

## TIER 0 — Existential (users lose data / anyone can read it)

**F1. Identity loss is near-certain on iOS and unrecoverable. (T4)**
`nimble_user_id` is a random string in localStorage. iOS ITP evicts
localStorage after 7 days of non-use → new ID minted → app opens empty
while showing "Connected" → old data permanently unaddressable in Supabase.
Same outcome for clear-site-data and new phone. The recovery key lives in
the storage it's supposed to survive.

**F2. No access control on user data. (T4)**
Client-minted USER_ID + public anon key + no auth session = RLS cannot bind
to anything. Any actor can read/write any user's rows. Today that's workout
logs; under Holdfast it's **GLP-1 medication status — sensitive health
data.** Real auth (Supabase email magic-link) is non-negotiable before
Holdfast ships. VERIFY current RLS posture on user_settings / workouts /
training_plans immediately.

**F3. "Export All Data" exports almost nothing, and import doesn't exist. (T4)**
Exports only completedWorkouts + currentPlan — omits exerciseHistory (every
set/weight/rep), RPE, cardio, strength/consult profiles, equipment, state.
No import function exists anywhere. The most careful users have a safety
net with a hole in the middle, labelled to conceal it.

**F4. Sync silently discards unique sets across devices. (T4)**
`cloudSets > localSets` — highest-count-wins, not a merge. Device with more
raw rows overwrites the other's unique work, no warning. Every set carries
an ISO date; union-by-timestamp eliminates this entirely.

**F5. Sync is partial and nobody knows. (T4)**
Only exerciseHistory/completedWorkouts/adherence/plan touch the cloud. RPE,
cardio, strengthProfile, consultProfile, equipmentProfiles, chat, app state:
local-only, always were. Also: nothing syncs mid-session — abandon a workout
and those sets are device-only until next completion.

**F6. Production deploys are untested. (workflow)**
GitHub Pages serves main; every T1 push is live instantly, device-tested
*after* deploy. Fix: dev branch + preview URL, promote after device test.

## TIER 1 — Breaks real users this week

**F7. Niggle step is a reload-only dead end. (T3)**
"Something Hurts" hides the feelings grid and Skip; no back, no X, no Esc,
no tap-outside. Mis-tap → commit a pain state or reload.

**F8. No Esc / back / tap-outside anywhere; Android back exits the app. (T3)**
Zero keydown (bar chat Enter), zero popstate handling across 11 overlays.
The single biggest systemic UX defect.

**F9. saveAppState is an unguarded quota bomb on the hottest write path. (T2)**
Bare setItem, no try/catch, fires on every chip/set/niggle. Quota error →
throws mid-logSet → dead button, half-written state. 31 of 32 setItem calls
unguarded; only AS-1's writeProfile does it right.

**F10. nimbleState_v45 has no schema version or migration. (T2)**
"v45" is only in the key name. Shape changes silently spread-merge; stale
keys rot forever (how builderFilter happened). AS-1 proves the correct
pattern exists in-file — apply it to the main store.

**F11. chatHistory vs chat_history split. (T2)**
Session-RPE context written to a key the AI coach never reads. Silent by
construction, orphan grows forever.

**F12. Two uncancellable setTimeout handoffs = phantom-Go class. (T2)**
generateFromConsultation starts a workout 2s after a possibly-dismissed
modal; the assessment patch re-opens UI regardless of where the user went.

**F13. Six unchecked fetches, ten silent catches, zero fetch timeouts. (T2)**
Hung backend = "Coach is thinking…" forever. Corrupt nimbleState_v45 =
silent full reset indistinguishable from fresh install (empty catch in
loadAppState).

## TIER 2 — Costs users, cheap to fix

**F14. Chart.js: ~200KB render-blocking CDN load, ZERO references. (T5)**
Delete one line. Biggest single perf win available.

**F15. Encyclopedia rebuilds 203 cards + 203 closures per keystroke. (T5)**
onkeyup with no debounce, full innerHTML teardown. Also rendered at startup
for a tab that isn't visible.

**F16. renderWorkout tears down the whole session DOM on every logged set. (T5)**
Known-dangerous (the mid-rest guard in setWeightUnit is a workaround
admitting it). Fix properly during the extraction/split it already needs
(also de-monkey-patch it — F22).

**F17. Not installable, 100% dead offline. (T5)**
No manifest, no service worker, no apple-touch-icon; A2HS on Android = plain
bookmark; iOS icon = page screenshot. NOTE: iOS exempts installed
home-screen web apps from the 7-day ITP cap — **PWA install directly
mitigates F1.** Manifest + SW ship as one build.

**F18. Parked Garmin fires network I/O on every cold start. (T2)**
initGarminUpload + checkDailyUpdates→fetch for a feature nobody can reach.

**F19. Startup waste. (T5)**
loadPreloadedImages = 160 sync setItem writes copying strings already in
memory (also the main quota pressure feeding F9); supabase-js failure = 10s
poll; theme-color #1e1e1e vs --bg #0F1011 seam; no wake lock (screen sleeps
mid-workout); speak() not gesture-unlocked on iOS (rest-timer countdown
silently dropped); user-scalable=no kills zoom for installed users; GIFs
hotlinked to two third-party WordPress sites with no fallback (superseded
only for HOSTED_SLUGS).

## TIER 3 — Product & experience gaps

**F20. New user: fabricated plan + "Adherence 0/6" + ~14 unexplained
controls. (T3)** No onboarding exists. First five minutes are undesigned.
AS-2 addresses this; until then the front door is the weakest screen.

**F21. Lapsed user gets guilt copy. (T3)** Three weeks away → "Need More
Consistency." The consult's "Welcome back!" opener exists but is never
surfaced. Worst copy aimed at the most fragile user.

**F22. Maintainability set. (T2)** renderWorkout/finishWorkout
monkey-patched at runtime 4,500 lines from their definitions; 161 inline
onclick; three order-dependent entry points running network work
pre-hydration; duplication list (gear save/apply/restore, toggle twins,
sessions-by-date, parse idiom ×32, SVG style ×75); dead code
(minutesForCount, addAIMessageToChat, .encyclopedia-section CSS cluster,
appState.builderFilter, switchTab garmin branch); 18 blocking alert()s;
50 console.logs; two equipment systems that don't know about each other;
no undo on a logged set.

---

## The rebuilt queue

Principle: **Rescue before Holdfast.** Holdfast's users are paying men on
medication — exactly who you cannot silently lose data for (or expose,
per F2). Foundation first is not a delay to the second product; it IS the
second-product work.

**W0 (workflow, no version):** dev branch + Pages/Vercel preview; promote
to main only after device test. [F6]

- **v126 — check-in (b)** as staged: consequence captions + render option
  cards from checkInConfig + derive badge strings from config
  [+ kills F11's sibling: two-sources-of-truth check-in numbers]
- **v127 — check-in (c)** consent gate [also answers T3's "sharp pain gets
  a filter, not caution"]
- **v128 — dead-weight & startup hygiene:** delete Chart.js, theme-color
  fix, debounce encyclopedia search, drop renderEncyclopedia from onload,
  delete/idle loadPreloadedImages, kill Garmin startup I/O, dead-code
  sweep (P1 pattern) [F14, F15-partial, F18, F19-partial, F22-partial]
- **v129 — modal escape hatches:** Esc + tap-outside + popstate/back across
  all 11 overlays; niggle step gets a back affordance; check-in gets X
  (defaults to 'skip' semantics) [F7, F8]
- **v130 — storage hardening:** guarded saveAppState (+ all setItem),
  schemaVersion + migrate on nimbleState_v45, chat key unification,
  safeJSON everywhere, loadAppState corrupt-state notice [F9, F10, F11, F13-partial]
- **v131 — export/import:** export ALL keys, versioned envelope; import
  with validation + merge-or-replace choice [F3]
- **v132 — sync integrity:** full-account sync (all keys), per-set
  union-by-timestamp merge, mid-session sync on logSet [F4, F5]
- **v133 — PWA:** manifest, service worker (shell cache), apple-touch-icon,
  status-bar-style, wake lock, gesture-unlock for speak() [F17, F19-partial,
  mitigates F1]
- **v134 — identity & auth:** surface recovery code interim; Supabase
  email magic-link auth; RLS policies bound to auth.uid(); migration path
  from anon IDs. Backend/Supabase work runs on T5 in parallel ahead of
  this. [F1, F2]
- **v135 — fetch discipline:** response.ok everywhere, AbortController +
  timeouts, cancellable setTimeout handoffs, retry affordance on sync-fail
  [F12, F13]

Then the Holdfast runway as previously agreed:
- **v136 — H0-a** teal tokenization sweep (~38 literals)
- **v137 — H0-c** syncProfileFromLegacy hoist (+ entry-point consolidation
  to one onload, fixing T2's pre-hydration network work)
- **v138 — H0-d** smartSelect weights + volume clamps → named config
- **v139–140 — extraction:** app.js split from index.html; de-monkey-patch
  renderWorkout/finishWorkout and fix its full-teardown render during the
  split (its own build, nothing else in it) [F16, F22-partial]
- **v141 — H1** flavour skeleton + selftest
- then H2–H9, injury chat, AS-2 (AS-2 also resolves F20), lapsed-user
  copy pass (F21) rides the flavour copy work

Parked additions from the product review: PWA push reminders (post-v133),
age-graded strength standards, rest-day card, Apple Health/Google Fit
write, Gym Scanner (+T5 proxy multimodal pre-req).

## Audience decision (recorded)

Base stays 40+ men. Growth = flavours, not broadening: Holdfast now;
candidates next: women 40+/menopause strength, return-from-injury, AFL/surf
masters overlays (already tagged in metadata). Pitch: one adaptation
engine, many audiences.

## Corrections to audit reports (for the record)

- T4 signed "2026-06-17" twice — actual date 2026-07-15. Findings verified
  against T2/T5 overlap (quota pressure, ITP, key inventory) and stand.
- Exercise count: 203 at runtime (163 core + 14 cardio + 7 gapfill +
  19 rehab); memory's "202" superseded.
- File size: 9,598 lines / 509KB raw / 118KB gz — supersedes "~8,500".
