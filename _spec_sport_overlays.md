# _spec_sport_overlays.md — v0.1 (draft)

**Scope:** Two sports only — **AFL (masters)** and **Surfing**. Nail these, add others later behind the same schema.
**Author:** orchestration layer. **Status:** draft for review. **Feeds:** `_spec_assessment.md` (profile field) + `_spec_programming_rules.md` (overlay rules).
**Evidence grades:** A = strong (RCT/meta or compliant surveillance) · B = moderate (cohort / mechanistic + supportive trials) · C = extrapolated / expert-opinion. Same scheme as the programming-rules spec.

---

## 0. The core idea — sport is an OVERLAY, not a goal

Goal (strength / power / hypertrophy / fatloss / **resilience** / conditioning) sets the **dose**: sets, reps, load, RIR, rest, tempo, intent.
Sport sets a **bias vector** on top of the goal:

1. **Goal-blend default** — a sensible starting goal mix for that sport (user can override).
2. **Quality emphasis** — which movement patterns / qualities get weighted up in selection.
3. **Prevention non-negotiables** — a small set of exercises auto-inserted every microcycle, regardless of goal, because the sport's injury profile demands them.

So "strength + footy" and "resilience + surf" both resolve cleanly: the goal decides how heavy/how many; the sport decides *what gets prioritised and what's never skipped*. Architecture stays as locked — **offline AI program designer** reads `sport` and sets the overlay; the **deterministic runtime engine** fills each session, weighting selection toward the sport's qualities and always including its non-negotiables.

This is why we don't need a giant sport database: each sport is one bias vector + one short non-negotiables list + a quality-tag mapping. Cheap, extensible, honest.

---

## 1. Assessment profile field (drop into `_spec_assessment.md`)

```
sport: enum  // "afl_masters" | "surfing" | "none"   (extensible)
sportContext: {
  // AFL
  position?: "small" | "mid" | "tall"        // proxy for running load
  yearsPlaying?: int
  sprintsAtTraining?: bool                    // high-speed running exposure
  // SURF
  sessionsPerWeek?: int
  avgSessionMins?: int
  boardType?: "shortboard" | "longboard" | "mixed"  // short = more pop-ups/power; long = more paddle endurance
  // both
  niggleHistory?: [ "hamstring" | "groin" | "calf" | "knee" | "shoulder" | "low_back" | ... ]
}
```

`niggleHistory` feeds the existing niggle/`jointLoad` safety invariant — a flagged tissue raises that joint's caution and pulls its prevention work to the top of the non-negotiables. Keep the assessment questions conversational (2–4 per sport), not a form.

---

## 2. AFL (masters) overlay

### 2.1 Demands
High total running volume, **repeat high-speed running**, kicking, jumping/landing, tackling, sidestepping, rapid accel/decel.

### 2.2 Injury profile — **Grade A** (AFL has compliant, peer-reviewed surveillance)
- **Hamstring strain = #1 injury.** Biceps femoris dominant (~84% of HSIs); recurrence is the real enemy — roughly a quarter to a third of HSIs are re-injuries, most within ~2 months of the first. [R-AFL1, R-AFL2]
- **Groin / hip / osteitis pubis** — second cluster; adductor-driven. [R-AFL3]
- **ACL** — change-of-direction / awkward-landing mechanism; season incidence tracks with the groin/hip cluster. [R-AFL3]
- **Calf** and **ankle** — flare with accel load and short turnarounds; calf is a notably bigger problem with age.

### 2.3 Training priorities (highest leverage first)
| # | Priority | Example work | Evidence |
|---|----------|-------------|----------|
| 1 | **Eccentric hamstring** *(non-negotiable)* | Nordic curl progressions, RDL/hip-hinge, hamstring-bridge/slider | **A→B** (see honesty note) |
| 2 | Posterior-chain hinge strength | RDL, hip thrust, good-morning | B |
| 3 | Adductor / groin strength *(non-negotiable if niggle flag)* | Copenhagen plank progressions, adductor squeeze/slide | B |
| 4 | Calf + Achilles loading | eccentric heel-drops, isometric calf holds, pogo when ready | B |
| 5 | Single-leg strength + deceleration / landing mechanics | split squat, step-down, lateral bound landings | B (ACL-relevant) |
| 6 | Power / repeat-effort maintenance | jumps, med-ball throws, short hill sprints | B, **joint-gated** for 40+ |

### 2.4 Non-negotiables auto-inserted each microcycle
- Eccentric hamstring (always).
- Adductor work (always if groin in `niggleHistory`; otherwise weekly).
- Calf eccentric/isometric (weekly).

### 2.5 40+ modifiers
Build eccentric tolerance gradually (Nordics are brutally DOMS-y if rushed). Extra care on calf/Achilles (tendon stiffens with age). Gate high-speed running and plyometrics on recovery readiness. Longer warm-ups before any sprint exposure.

---

## 3. Surfing overlay

### 3.1 Demands — **Grade B** (smaller literature, mostly competitive surfers)
Time-motion work shows **paddling dominates (~half of total water time)** — so the engine should treat surfing as an **upper-body endurance + repeat-effort paddle-power sport first**, with wave-riding as the power/balance layer. [R-SURF1, R-SURF2]
- **Paddling:** upper-body muscular endurance, strength, power; intermittent aerobic + anaerobic; HR commonly 140–190 bpm. [R-SURF1, R-SURF3]
- **Wave riding:** lower-body strength, dynamic balance, single-leg strength, **rotational power**; the pop-up is an explosive press-to-stand. [R-SURF2]

### 3.2 Injury profile — **Grade B**
- **Overuse: shoulder, lower back, neck** — driven by prolonged paddling (sustained extension + repetitive overhead). Shoulder risk rises with scapular instability, muscle imbalance, and poor stroke mechanics. [R-SURF4]
- Acute: head/face/neck then lower limb (board contact, wipeouts); skin is most common overall but not trainable.

### 3.3 Training priorities (highest leverage first)
| # | Priority | Example work | Evidence |
|---|----------|-------------|----------|
| 1 | **Scapular / rotator-cuff health + posterior shoulder** *(non-negotiable)* | face pulls, prone Y/T/W, external rotations, lower-trap work | B |
| 2 | Pulling strength + endurance (paddle power) | rows, pull-ups, straight-arm pulldown | B |
| 3 | Rotational power + anti-rotation core | cable/med-ball rotational throw, woodchop, Pallof press | B |
| 4 | Single-leg strength + balance/proprioception | split squat, single-leg RDL, unstable-surface balance | B / C |
| 5 | Lumbar endurance + extension tolerance | McGill-style holds, prone extension endurance | B |
| 6 | Hip + thoracic rotation mobility | open-book, 90/90, hip CARs | C (mechanistic) |
| 7 | Repeat-effort upper-body conditioning | intermittent paddle-pattern intervals | B |

### 3.4 Non-negotiables auto-inserted each microcycle
- Scapular/cuff health work (always).
- Lumbar endurance (weekly; always if low-back in `niggleHistory`).

### 3.5 40+ modifiers
Manage shoulder volume — the cuff degenerates with age and paddling already loads it daily. Prioritise low-back care. Balance/proprioception work carries a fall-prevention bonus beyond surfing.

---

## 4. Masters (40+) overlay — applies regardless of sport

This is the layer that makes Nimble Shred *for* a 40+ body, and it ties straight into the wearable-readiness discussion.
- **Reduced recovery capacity** → bigger and more frequent deloads (intensity drop ~10–15% vs the ~5% used for younger lifters), and a lower volume ceiling (~5% per decade past 30). [R-M1, R-M2]
- **Sarcopenia (~3–8% muscle loss/decade, accelerating)** → heavy strength *and* power are protective; don't avoid load, **gate it on readiness**. Healthy older lifters tolerate heavy work with low injury risk. [R-M2, R-M3]
- **Tendon stiffening** → progressive eccentric + isometric loading, ramped gradually.
- **Sleep / readiness signals** → autoregulation deload triggers (sub-7h sleep tracks with materially higher injury risk; the effect sharpens with age). This is exactly where Garmin/Oura readiness data would feed the engine. [R-M4]

---

## 5. Integration / build notes

Two new data layers, both within the locked architecture:
1. **Assessment** — add the `sport` + `sportContext` field (§1).
2. **Programming rules** — add a *sport → quality emphasis* map + *prevention non-negotiables* list (§2–4) to `_spec_programming_rules.md`.

**Metadata work (the moat):** tag exercises by the qualities above — `eccentric-hamstring`, `adductor`, `calf-eccentric`, `scapular-cuff`, `rotational-power`, `single-leg`, `lumbar-endurance`, `landing-decel`. Most are **derivable from existing `movementPattern` / `musclesTargeted` / `jointLoad`** fields — cheap. The non-negotiables need a small hand-curated list per sport (don't AI-generate the safety-critical ones).

**Runtime:** engine adds the sport's non-negotiables to the session candidate pool, weights scored selection toward the sport's emphasised qualities, and lets the **goal** continue to set the dose. No backend call at runtime.

**Phasing (v52-safe):** SO-1 add `sport` field + store it (silent) → SO-2 wire the emphasis weighting into Smart Picker (visible selection shift) → SO-3 add the prevention non-negotiables (visible inserts) → SO-4 surface a one-line "why" ("added for footy hammies"). Device-test gate between each.

---

## 6. Honesty / evidence caveats (read before this drives auto-prescription)

- **AFL injury data is Grade A, but it's elite men 20–35.** Applying it to 40+ recreational masters is sound in direction but should be treated a notch weaker (population mismatch).
- **Nordic hamstring evidence:** meta-analyses report large reductions in new and recurrent HSIs and clear eccentric-strength gains — but a methodological reappraisal argues the headline effect is **less certain than the popular ~50% figure**, and benefit is heavily **adherence-dependent**. Grade it A for "include eccentric hamstring work," B for "expect a specific % reduction." [R-AFL2 vs R-AFL5]
- **Surfing S&C literature is small and mostly competitive/younger surfers** → Grade B/C. Recommendations are mechanistically solid, not RCT-backed to football's level.
- **The 40–54 band is genuinely under-studied** (consistent with the programming-rules spec's existing flag). Most middle-age modifiers are Grade C extrapolation.
- **Injury/recurrence layer = not medical advice; safety-gated; human-review before auto-prescription.** A bloke with three hamstring tears needs a physio, not just Nordics — the app should surface prevention work and flag "see a professional," not pretend to rehab him.

---

## 7. References (for the review pass)

- **R-AFL1** — Epidemiology of Hamstring Strain Injuries in Elite Male Australian Football Players (STRAFL), *JOSPT Open*, 2024.
- **R-AFL2** — Tedeschi et al., Role of the Nordic hamstring exercise in preventing hamstring injuries (review), 2025.
- **R-AFL3** — Association between groin/hip/osteitis pubis and ACL injuries in AFL surveillance data.
- **R-AFL4** — Nordic hamstring injury-prevention systematic reviews/meta-analyses in soccer/football.
- **R-AFL5** — "Why methods matter": reappraisal of the Nordic hamstring meta-analysis (effect less conclusive).
- **R-SURF1** — Farley, Harris & Kilding, Physiological Demands of Competitive Surfing, *J Strength Cond Res*, 2012 (paddling ≈54% of water time).
- **R-SURF2** — Review of the physical and physiological demands of surfing and suggested training modalities.
- **R-SURF3** — Surfing HR/physiology field studies (140–190 bpm).
- **R-SURF4** — Physical demands and injury in surfing (shoulder/low-back overuse; scapular/stroke risk factors).
- **R-M1** — ExRx / ACSM masters resistance-training guidance (rep ranges, deload magnitude, volume reduction per decade).
- **R-M2** — Borges, Reaburn, Driller — age-related performance and recovery kinetics in masters athletes (narrative review).
- **R-M3** — Sarcopenia (~3–8%/decade) and resistance-training protection literature.
- **R-M4** — Sleep duration (<7h) and injury-risk associations in athletes.

*— end v0.1 —*
