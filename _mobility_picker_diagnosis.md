# Diagnosis — Mobility/Nimble workout variety

**Type:** Read-only diagnostic. No code changed, no git run.
**Question:** Is the mobility variety problem **selection** or **pool size**?
**Verdict (one line):** **SELECTION.** The pool is ample (48); the picker uses a
*biased* shuffle and has **no don't-repeat memory**, so sessions overlap by chance.
**Date:** 2026-06-08 · Target: `index.html` (v67). Line numbers indicative.

---

## 1. The exact mechanism

All quick-start generation funnels through **`generateWorkoutByType(type, count=6)`
@L3515–3531**. The nimble path:

```js
function generateWorkoutByType(type, count = 6) {
    let filtered = window.allExercises.filter(ex => {
        ...
        if(type === 'nimble') return ex.cat.includes('Nimble') || ex.type === 'Mobility';   // L3520
        ...
    });

    // Apply equipment filter
    filtered = filterExercisesByEquipment(filtered);                  // L3526

    // Shuffle and take count
    filtered.sort(() => 0.5 - Math.random());                        // L3529  <-- the picker
    return filtered.slice(0, count);                                 // L3530
}
```

Call path: `quickStartWorkout('nimble')` → `_executeQuickStart('nimble')`
(L3418) → `generateWorkoutByType('nimble', appState.exerciseCount)`. (The wedge
path `_executeWedgeSession` L3460 also calls it, but only for push/pull/legs.)

**The picker is two lines: a shuffle (L3529) then `slice(0, count)` (L3530).**

---

## 2. Answers to the specific questions

### Deterministic or randomized?
**Randomized — not a deterministic `slice(0,N)` of a fixed order.** L3529 shuffles
via `Array.prototype.sort(() => 0.5 - Math.random())` before the slice. So the
selection is *not* "same first N every time."

**But the shuffle is the well-known broken one.** A comparator that returns a
random sign is non-transitive; engines (V8 uses insertion sort for short arrays)
therefore produce a **non-uniform** permutation — items tend to drift only a
little from their original `window.allExercises` order. Net effect: exercises that
appear *earlier in the data file within the pool* are statistically favored to
land in the first `count` slots. It randomizes, just **poorly and with bias**.

### Any "don't repeat last session" memory?
**None.** `generateWorkoutByType` reads only `window.allExercises`, the type
filter, and the equipment filter. Nothing reads or writes a "recently used"
list; nothing excludes prior picks. (The only "recency" logic in the file is in
`_executeWedgeSession` L3468–3494, which chooses the *muscle-group type* by
least-recently-trained — it does **not** touch nimble and operates at the
type level, never the exercise level.) Confirmed: no `recent`, no `lastPicked`,
no exclusion anywhere in the generation path.

### Would the same input produce the same workout twice running?
**No — not identical.** `Math.random()` advances the engine PRNG with no seed, so
two back-to-back calls yield different shuffles → different sets. **However**,
because there is **no anti-repeat memory** and the shuffle is biased, consecutive
sessions can (and do) share several exercises by chance. That overlap — not exact
repetition — is what reads to the user as "same workout again."

---

## 3. Selection vs pool size — the evidence

Pool computed directly from the 163 parsed exercises, `cat.includes('Nimble') ||
type === 'Mobility'`:

| Equipment preset | Nimble/Mobility pool size | Picks (`count`) | Pool ÷ picks |
|---|---|---|---|
| gym / home (`All`, Cable+DB+BW+FW) | **48** | 6 | 8× |
| hotel (Bodyweight only) — worst case | **35** | 6 | ~6× |

(Pool composition: 25 `cat:Nimble` ∪ 36 `type:Mobility`, overlap 13 → 48 union;
by equip: Bodyweight 35, Cable 11, Dumbbell 2.)

**The pool is not the bottleneck.** Even in the worst (hotel/bodyweight) case there
are 35 candidates for 6 slots. With a *uniform* shuffle the expected exercise
overlap between two consecutive 6-pick sessions is only ≈ 6×6/48 ≈ **0.75** (gym)
to 6×6/35 ≈ **1.0** (hotel). The bias at L3529 pushes real overlap *above* that by
clustering the same early-in-file moves. So perceived "low variety" comes from the
**selection algorithm**, not from a shortage of exercises.

---

## 4. Would shuffle + don't-repeat-recent meaningfully help? — Yes

- **Proper shuffle (Fisher–Yates):** replaces the biased L3529 sort with a uniform
  permutation, removing the positional clustering. Modest, real gain on its own.
- **Don't-repeat-recent:** the larger win, and **viable precisely because the pool
  is big**. Excluding the last session's 6 picks (or last 1–2 sessions, ~6–12
  names) still leaves **29–42** candidates for 6 slots — never starves selection.
  This converts "fresh by luck" into "fresh by guarantee."

Together they directly attack the diagnosed cause (biased selection + no memory),
so variety improvement is meaningful and pool-supported. (A pure pool expansion
would *not* fix it — with the same biased, memoryless picker, a bigger pool still
re-serves the same early-file favorites.)

---

## 5. Surgical insertion point (for a later build — NOT applied here)

**One choke point fixes every type:** `generateWorkoutByType` @L3528–3530. Replace
the shuffle+slice pattern; add a recent-exclusion before it and record picks after.

Pattern (illustrative — for the implementing build, not edited now):
```js
    // after equipment filter (L3526):
    const recent = getRecentPicks(type);                       // names from last 1–2 sessions
    let pool = filtered.filter(ex => !recent.includes(ex.name));
    if (pool.length < count) pool = filtered;                   // fallback: never starve

    // proper uniform shuffle (Fisher–Yates) instead of L3529's biased sort:
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picks = pool.slice(0, count);
    rememberPicks(type, picks.map(e => e.name));               // persist for next time
    return picks;
```

Memory store: a small per-type list in `appState` (e.g. `appState.recentPicks[type]`,
trimmed to ~2× count) written via the existing `saveAppState()` (L3237) and read by
`getRecentPicks` — mirrors how other prefs persist. No new dependencies; no schema
migration (additive, like the wake-lock `keepAwake` field).

**Scope note:** L3529's biased shuffle is shared by push/pull/legs/full too, so
this single fix lifts variety across all generated workouts; nimble/mobility is
just where it's most felt (dedicated variety mode, frequent short sessions, and —
as shown — a 48-deep pool with no excuse for repeats).

— Claude (T4), 2026-06-08 16:37 (+09:30 local)
