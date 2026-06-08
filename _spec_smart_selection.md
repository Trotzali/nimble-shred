# Spec — Deterministic smart-selection engine (replaces biased shuffle)

**Type:** Read-only implementation spec. No code changed, no git run.
**Targets a future serial build.** Line numbers indicative (tree `v67`); re-anchor
by function name. Replaces the picker diagnosed in `_mobility_picker_diagnosis.md`.

---

## 0. Dependencies — reconciled against LANDED v1.4.0 (one blocker left)

The engine consumes six metadata fields. **All six now exist on all 177 entries**
(`exercise-metadata.js` **v1.4.0**, re-verified by parse 2026-06-08):

| Field | Landed? | Note |
|---|---|---|
| `musclesTargeted` | ✅ 177/177 | 24-term vocab |
| `jointLoad` | ✅ 177/177 | dense 9-joint 0–3 scores |
| `bucket` | ✅ 177/177 | strength 110 · resilience 40 · cardio 17 · power 10 |
| `movementPattern` | ✅ 177/177 | **14-value enum** (below) |
| `laterality` | ✅ 177/177 | `bilateral` / `unilateral` / `alternating` |
| `compound` | ✅ 177/177 | `boolean` — 166 true / 11 false |

The "Blocker 2 — three fields don't exist" from the prior draft is **RESOLVED by
v1.4.0**. Two prior-draft assumptions are corrected here:

- **`movementPattern` — exact landed 14-enum** (prior draft guessed ~12 with
  different spellings; align SPAN to *these* strings verbatim):
  `push-horizontal, push-vertical, pull-horizontal, pull-vertical, squat, hinge,
  lunge, carry, rotation, anti-rotation, anti-extension, isolation, mobility,
  locomotion`.
- **`compound` — adopt T3's landed rule as canonical, do NOT re-derive.** T3's
  field (and its file self-check) uses **`#joints with load ≥ 1 ≥ 2 ⇒ true`**.
  My prior draft derived `load ≥ 2`, which **mismatches the landed value on
  103/177 entries** — a real divergence. Fix: the engine **reads `meta.compound`
  directly** and never recomputes, so it can never disagree with the metadata's
  own self-check. (For reference, T3's rule reproduces all 177 landed values;
  the engine still doesn't derive — it just reads.)

**Blocker 1 (remaining) — file load.** `exercise-metadata.js` must be loaded into
index.html with T3's guarded accessors per `_spec_logmode_integration.md` §1
(`getExerciseMeta` ~L5580). This engine reuses those accessors — never read
`window.exerciseMeta[...]` directly. This is the only Phase-A item still open; the
**data is ready**.

**Accessor layer (new, beside T3's `getExerciseMeta`).** Reads go through getters
that fall back **only on load-failure** (meta absent). With v1.4.0 loaded these
never hit the fallback branch — full scoring runs on real data:

```js
function _meta(name){ return getExerciseMeta(name) || null; }                 // T3 accessor
function getBucket(name){ return (_meta(name)?.bucket) || 'strength'; }
function getMuscles(name){ return (_meta(name)?.musclesTargeted) || []; }
function getJointLoad(name){ return (_meta(name)?.jointLoad) || {}; }
function getCompound(name){ return _meta(name)?.compound === true; }           // READ ONLY — canonical = metadata field (self-check: load>=1,count>=2). Never re-derive.
function getPattern(name){
    const m=_meta(name); if(!m) return null;
    return m.movementPattern || (m.musclesTargeted?.[0]) || null;              // RHS pseudo only fires if metadata absent
}
function getLaterality(name){ return (_meta(name)?.laterality) || 'bilateral'; }
```
If `getExerciseMeta` returns null for everything (file 404 / not loaded), all
constraints no-op and the engine falls straight through to plain Fisher–Yates
(§6) — a *correct* shuffle, never worse than today. That degraded path is now the
**only** reason the fallbacks exist; under normal load they are inert.

---

## 1. Insertion point (exact)

`generateWorkoutByType(type, count=6)` @L3515–3531. Replace **only** the picker
tail @L3528–3530:

```js
    // Shuffle and take count                 <-- DELETE these three lines
    filtered.sort(() => 0.5 - Math.random()); // L3529 biased sort — kill
    return filtered.slice(0, count);          // L3530
```
with:
```js
    const picks = smartSelect(filtered, count, type, { niggle: getNiggleJoints() });
    rememberPicks(type, picks);   // updates appState.recentPicks + saveAppState()
    return picks;
```
`filtered` is the focus pool already produced by the type filter (L3516–3523) +
`filterExercisesByEquipment` (L3526) — unchanged. This is the **single choke
point**: push/pull/legs/nimble/full and the wedge path all flow through here, so
every workout type gains the engine while nimble/mobility (the reported pain
point, 48-deep pool) benefits most. Add `smartSelect` + helpers immediately below
`generateWorkoutByType`.

---

## 2. `appState.recentPicks` — shape + persistence

Add to the `appState` literal (L3023–3035), mirroring how `keepAwake`/prefs are
added; back-fills for existing users via the L3229 shallow merge (their saved
blob lacks the key → default survives):

```js
let appState = {
    ...
    recentPicks: {},   // NEW — per-type rolling history of last 1–2 sessions' picks
    ...
};
```

Runtime shape — **per type, newest-first array of name-arrays, capped at 2**:
```js
appState.recentPicks = {
  push:   [ ["Bench Press","Dumbbell Row", ...],   // most recent session
            ["Incline Press", ...] ],              // session before
  nimble: [ ["Bear Crawl","Cossack Squat", ...] ],
  // pull / legs / full created lazily on first use
}
```

Helpers:
```js
const RECENT_WINDOW = 2;                              // sessions remembered per type
function getRecentNames(type){
    return (appState.recentPicks[type] || []).flat(); // union of last ≤2 sessions
}
function rememberPicks(type, picks){
    const arr = appState.recentPicks[type] || [];
    arr.unshift(picks.map(e => e.name));             // newest first
    appState.recentPicks[type] = arr.slice(0, RECENT_WINDOW);
    saveAppState();                                  // L3237 — existing persister
}
```
Recorded at generation time (not start), so even regenerate-without-starting
rotates the pool — strictly better variety.

---

## 3. The engine — `smartSelect(focusPool, N, type, opts)`

Deterministic = **rule-driven**, not random-sort. The only entropy is one
Fisher–Yates pass used solely to break score ties, so equal candidates rotate
session-to-session; `recentPicks` guarantees turnover on top of that.

```
smartSelect(focusPool, N, type, {niggle}):
  1. EXCLUDE recent:  cand = focusPool.filter(e => !getRecentNames(type).includes(e.name))
                      (if too small, enter Relaxation §5 step 1–2)
  2. JOINT FLAGS:     flagged = union(niggle ?? [], recentlyHammeredJoints(type))   // §7 hook
  3. SHUFFLE:         fisherYates(cand)                 // replaces L3529; tie-breaker only
  4. GREEDY BUILD slot by slot until selected.length === N:
       for each remaining c in cand: s = score(c, slotIndex, accumulators, flagged, type)
       pick argmax(s)  (ties -> earliest in shuffled order)
       push to selected; update usedPatterns, muscleLoad{}, selectedJointTotals
     if can't reach N under current constraints -> Relaxation §5, continue
  5. RECORD via rememberPicks (done by caller, §1)
  return selected
```

### Fisher–Yates (kills the biased sort)
```js
function fisherYates(a){
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
}
```

### Scoring — `score(c, slot, acc, flagged, type)`
Additive; weights tunable. `acc` = {usedPatterns:Set, muscleLoad:{m:count}, n:selected.length}.

| Term | Rule | Effect |
|---|---|---|
| **SPAN patterns** | `getPattern(c) ∉ acc.usedPatterns` → `+W_pat`; else `−W_pat`. Patterns are the landed **14-enum** (§0). | no two same patterns; coverage |
| **BALANCE muscles** | `−W_mus × Σ_{m∈getMuscles(c)} acc.muscleLoad[m]` | penalise stacking a worked muscle |
| **RESPECT joints** | `−W_jnt × Σ_{j∈flagged} getJointLoad(c)[j]` | de-prioritise high load on flagged/hammered joints |
| **COMPOUND lead** | `+W_cmp × (getCompound(c)?1:0) × max(0, 1 − slot/ceil(N/2))` — `getCompound` **reads `meta.compound` directly** (§0), never re-derives | compounds win early slots; decays → isolation fills later |
| **Bucket focus** | if `type∈{strength,power}` boost `W_pat` (pattern coverage matters most for force); if `resilience/nimble` boost `W_mus`+region spread (rehab/mobility variety) | bucket-aware emphasis |

Defaults to start (tune later): `W_pat=5, W_mus=2, W_jnt=4, W_cmp=3`; for
strength/power `W_pat→7`; for resilience/nimble `W_mus→4`.

**Weak-span patterns (consequence of the real 14-enum).** Three of the landed
values are low-information for SPAN: `isolation` (every single-joint accessory),
`mobility` and `locomotion` (which dominate the nimble/mobility pool — by design).
Pure SPAN would over-penalise the 2nd+ pick in pools that are mostly one of these.
Handling: treat `{isolation, mobility, locomotion}` as **non-spanning** — the SPAN
term gives no `+W_pat` and no `−W_pat` for them (score 0), so coverage is driven by
the genuine force patterns (push/pull/squat/hinge/lunge/carry/rotation/anti-*),
and within mobility/nimble the **BALANCE-muscles** term (boosted for resilience via
bucket focus) becomes the primary variety driver — exactly the §0 muscle/region
spread. This is the concrete reconciliation of SPAN to the shipped enum.

After each pick: add `getPattern(c)` to `usedPatterns`; `+1` each muscle in
`getMuscles(c)` into `muscleLoad`.

### Compound-lead, stated explicitly
The decay factor `max(0,1−slot/ceil(N/2))` means: slots `0 … ceil(N/2)−1` give a
positive compound bonus (so the build leads with compounds), later slots give
zero (isolation competes evenly). No hard quota → never starves a small pool.

---

## 4. Constraint summary (what each requested behaviour maps to)
- **SPAN movement patterns** → SPAN term + `usedPatterns` set; strongest for
  strength/power buckets (bucket focus).
- **BALANCE muscles** → BALANCE term over `musclesTargeted`; strongest for
  resilience/nimble.
- **RESPECT joints** → JOINT term over `jointLoad` × `flagged` set; the only
  term tied to safety (see §5 invariant + §7 hook).
- **Lead COMPOUND, fill isolation** → COMPOUND term with slot decay.
- **Don't-repeat-recent** → step 1 exclusion via `recentPicks`.

---

## 5. Relaxation order (graceful fallback — exact, ordered)

Applied in sequence; each step re-opens candidates / drops one constraint, least
costly to variety first, **safety last**. Stop as soon as `selected.length === N`.

1. **Shrink recent window** 2 → 1 session (re-include the older session's names).
2. **Drop recent exclusion** entirely (allow last session's picks back).
3. **Relax SPAN** — permit a repeated `movementPattern` (pick next-best coverage).
4. **Relax BALANCE** — permit muscle stacking.
5. **Relax COMPOUND lead** — accept all-isolation (or all-compound) as available.
6. **Relax soft joint de-prioritisation** — drop the *recently-hammered* part of
   `flagged`. **INVARIANT:** an **explicit niggle** joint (from `opts.niggle`)
   stays enforced — exercises with `jointLoad[niggleJoint] ≥ 2` remain excluded
   even at full relaxation. Safety is never relaxed away.
7. **Final fill** — if still `< N`, top up from `focusPool` (minus explicit-niggle
   contraindications) by plain `fisherYates`. Guarantees `min(N, eligiblePool)`
   exercises; never returns fewer than today.

---

## 6. Two-phase ship + degradation guarantees

**Phase 1 — Fisher–Yates + don't-repeat-recent (ships first, no metadata dep).**
CONFIRMED unchanged. Steps 1 (recent exclusion) + 3 (Fisher–Yates) of §3, plus
`recentPicks`/`rememberPicks` (§2). Pool-agnostic, reads no metadata, kills the
L3529 biased sort on its own. This is a complete, shippable improvement before the
file is even loaded — and it's also the permanent load-failure fallback.

**Phase 2 — full constrained scoring (runs on real v1.4.0 data).** CONFIRMED: with
all six fields landed on 177/177, the SPAN / BALANCE / RESPECT-joints /
COMPOUND-lead / bucket-focus terms (§3–§4) now operate on **real data**, not
derived/pseudo values. The only Phase-2 prerequisite still open is **loading the
file** (Blocker 1, §0); the data itself is ready.

**Degradation (load-failure only).** If `getExerciseMeta` returns null for
everything (file 404 / not loaded), all `get*` accessors fall back (§0), the
scoring terms no-op, and the engine collapses to **Phase 1** (recent-exclusion +
Fisher–Yates) — strictly better than the current biased sort, never worse. There
is no longer any "partial-tagging / pseudo-pattern" mode in normal operation: the
fallbacks exist **solely** for total load-failure.

- **Shared by all types:** push/pull/legs/full also lose the L3529 bias — net
  variety win app-wide, nimble/mobility most of all.
- **No schema migration:** `recentPicks` is additive (L3229 merge); metadata is a
  loaded asset isolated behind accessors.

---

## 7. Niggle hook (leave the seam, don't build it here)
`opts.niggle` is a `string[]` of flagged joint keys (`jointLoad` vocabulary:
`neck shoulder elbow wrist tSpine lowBack hip knee ankle`). Today supplied by a
stub:
```js
function getNiggleJoints(){ return appState.niggleJoints || []; }   // wired to a future niggle UI
```
Plus `recentlyHammeredJoints(type)` (step 2) — derivable later from the last
session's `jointLoad ≥ 2` joints (soft de-prioritisation, relaxable at §5.6).
Until both exist, `flagged` is `[]` and the JOINT term is inert — the engine
still SPANs/BALANCEs/leads-compound correctly. This is the integration point for
the pain-aware swap feature (`aggravates`/`alternatives` already in metadata).

---

## 8. Change-site summary (by function)
| Site @line | Change | Dep |
|---|---|---|
| `exercise-metadata.js` | all six fields **already landed (v1.4.0)** — no change | done |
| `<script>` load + `getExerciseMeta` (~L5580) | load file + T3 accessors | Blocker 1 (T3 §1) — Phase 2 only |
| `appState` literal @L3023–3035 | add `recentPicks: {}` | Phase 1 |
| `generateWorkoutByType` @L3528–3530 | replace shuffle+slice with `smartSelect` + `rememberPicks` | Phase 1 |
| new: `smartSelect`, `fisherYates`, `score`, `get*` accessors, `rememberPicks`, `getRecentNames`, `getNiggleJoints` (below L3531) | the engine | Phase 1 core / Phase 2 scoring |

## 9. Risk flags
- **Compound is read, never re-derived.** `getCompound` returns `meta.compound`
  verbatim (canonical = the file's own self-check, `load≥1,count≥2`). The prior
  draft's `load≥2` derivation disagreed on 103/177 — do not reintroduce any
  in-engine derivation, or the engine and metadata can diverge.
- **SPAN uses the exact 14-enum**, with `{isolation,mobility,locomotion}` treated
  as non-spanning (§3) — don't SPAN-penalise those or nimble/mobility pools starve.
- **Phase 1 ships without metadata.** Fisher–Yates + don't-repeat-recent is a
  complete win on its own and the load-failure fallback; Phase 2 layers scoring on
  the loaded v1.4.0 data.
- **Tie-break entropy must stay** (the one Fisher–Yates pass) or back-to-back
  sessions with identical state could repeat; `recentPicks` covers most of it but
  the shuffle is the belt-and-suspenders.
- **Safety invariant** (§5.6) is non-negotiable: explicit niggle joints are never
  relaxed back in.
- Line numbers drift — re-anchor by function name.

— Claude (T4), 2026-06-08 17:14 (+09:30 local)
