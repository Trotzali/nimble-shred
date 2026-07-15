# _spec_holdfast.md — v0.1
## Second product flavour: Holdfast (muscle preservation on GLP-1 medication)

Adapted for the Nimble Shred stack (single `index.html`, vanilla JS, no build
system, GitHub Pages + Vercel + Supabase) from the original engineering brief
(2026-07-15). Nimble Shred must keep working exactly as it does today at every
step. One change category per build. Device test between versions.

---

## 0. Decisions already made (do not relitigate in build prompts)

- **D1 — Sequencing:** check-in (b) and (c) land first. Flavour skeleton
  follows, before injury chat and AS-2, so both are built flavour-aware.
- **D2 — Entry strategy:** flavour resolved from a query param
  (`?flavor=holdfast`) with `nimble_shred` as the absolute default, persisted
  to `nimbleProfile_v1.flavor` after first resolution. Extraction into a
  shared `app.js` + two thin HTML shells is **deferred** to a dedicated
  later build (v52-class risk; nothing else in that build when it happens).
- **D3 — Food data:** no sql.js. Two JSON assets in repo root:
  - `foods_curated.json` (~8KB, 57 staples, array of objects) — fetched at
    protein-feature init.
  - `foods_full.json` (~860KB raw / ~180KB over the wire, 8,757 foods,
    columnar `{cols, rows}`) — lazy-fetched only on first search miss
    against curated + local cache.
- **D4 — Regression:** `_spec_regression_checklist.md` (device smoke list)
  plus a small in-browser assertion harness (`?selftest=1`) asserting the
  `nimble_shred` flavour config resolves to current default behaviour.

## 1. Flavour architecture

Single `PRODUCT_FLAVORS` config object + `resolveFlavor()` run once at
startup before any UI renders. Everything flavour-specific reads
`window.FLAVOR` (frozen). No flavour conditionals scattered through
components — components read config fields.

Minimum config surface per flavour:

```
{
  id: 'nimble_shred' | 'holdfast',
  displayName,
  brandTheme: { accent, logoText, copyStrings },   // graphite base shared
  checkInQuestionSet,        // function(profile) -> question list (phase-aware for holdfast)
  programmingProfile,        // progression aggressiveness, volume bias, session-scaling hooks
  heroMetrics,               // ordered list of dashboard hero cards
  features: { proteinTracking, doseTracking, phaseSwitching, garminTab, ... }
}
```

Rules:
- `nimble_shred` config values must reproduce current behaviour bit-for-bit.
  The selftest harness asserts this (D4).
- Holdfast brand: keep graphite base; accent colour TBD in design pass —
  placeholder teal until then. Amber stays functional-only in both flavours.
- One repo, one main branch. No fork, no per-product modules.

## 2. Holdfast phases

`nimbleProfile_v1.holdfast.phase`: `on_medication | off_ramp | maintenance`.
Changed only by explicit user action in Settings ("I'm tapering / I've
stopped", with date, logged to profile). Phase drives check-in set,
programming profile, and dashboard hero config.

## 3. Check-in question sets (extends checkInConfig, post check-in (b)/(c))

Existing soreness/energy/pain questions kept in all phases.

**on_medication adds:**
- "Injection day?" — today / yesterday / 2–3 days ago / later this week
- "Appetite today?" — none / low / normal
- "Stomach okay?" — fine / queasy / rough

**off_ramp / maintenance adds instead:**
- "Hunger vs last week?" — less / same / more / much more
- "Cravings today?" — no / manageable / strong

Consequence captions (check-in (b) pattern) derived from checkInConfig for
the new questions too — no hardcoding.

## 4. Programming profiles (adaptation engine)

**on_medication:**
- Injection today/yesterday AND (appetite none/low OR stomach queasy) →
  session volume −30–40%, intensity capped, prefer shorter template.
  Copy tone: "smart day to go lighter." Never guilt copy.
- Stomach rough → offer low-impact swap or rest with **no streak penalty**.
- Baseline: maintain load, conservative progression (user is in deficit;
  preserving strength > chasing PRs).
- All existing joint/soreness logic inherited unchanged.

**off_ramp / maintenance:**
- Reuse existing auto-progression with a more aggressive parameter set
  (build window; energy availability restored).
- "Much more hunger" on 3+ consecutive check-ins → AI coach proactively
  surfaces hunger-management guidance (subject to §7 guardrails).

## 5. Protein feature (Holdfast, all phases; `features.proteinTracking`)

- Daily target default 1.6 g/kg current body weight, user adjustable
  1.2–2.2. One hero number: **grams remaining today**.
- Logging paths: (a) quick-pick curated staples, (b) search foods_full,
  (c) barcode scan, (d) free-text AI estimate via existing Gemini proxy,
  flagged `~approx` in the log.
- Calories may be stored; protein is the interface. **No calorie counter,
  no meal planning, no recipes.**
- Barcode: local cache → Open Food Facts
  `GET https://world.openfoodfacts.org/api/v3/product/{barcode}.json`
  (User-Agent `Holdfast/1.0 (torquaytroy@gmail.com)`, no auth for reads) →
  cache locally. Sanity-check before accepting: protein ≤ 95 g,
  kcal ≤ 902 per 100g, Atwater ratio 0.6–1.7 of stated energy.
  Scanner lib via CDN (no build step) — candidate: html5-qrcode; confirm
  in its own build.
- About screen credits: "Data © Open Food Facts contributors (ODbL)" and
  USDA FoodData Central.
- Later pass (parked): FSANZ AFCD merge for Australian generics via the
  separate `holdfast-food-pipeline` scripts.

## 6. Dashboard / hero metrics by phase

- **on_medication:** hero = protein remaining + weekly strength trend.
  Weight shown as a de-emphasised trend line.
- **off_ramp / maintenance:** weight becomes a **band** ("holding within
  your range: X–Y kg") — never a red daily delta. Hero = strength
  progression, protein hit-rate, streak. Phase switch fires a one-time
  expectation message: some regain is normal; strength habits + protein
  predict keeping it off.

## 7. Medical/legal guardrails (hard requirements)

- App NEVER advises on medication: no dose suggestions, no timing advice,
  no restart/stop recommendations. Gemini system prompt for Holdfast must
  refuse these and redirect to "talk to your prescribing doctor."
- No therapeutic claims in copy ("treats," "prevents," "clinically
  proven"). Allowed framing: training + protein support muscle retention.
- Onboarding: disclaimer + "consult your doctor before starting a new
  exercise program" gate.
- Drug names only with ® and a "not affiliated" footer line.
- No GLP-1 content in the nimble_shred flavour, anywhere.

## 8. What NOT to do

- No fork, no duplicated modules, no scattered `if (flavor === ...)`.
- No changes to Nimble Shred default behaviour, copy, or theme.
- No calorie budgets, meal planning, or recipes.

## 9. Build order (each step its own versioned, device-tested build)

H1. Flavour config skeleton + resolveFlavor + selftest harness asserting
    nimble_shred parity. Zero visible change.
H2. Regression checklist file + harness wired to `?selftest=1`.
H3. Holdfast theme/copy/onboarding incl. phase selection + disclaimer gate.
H4. Check-in question sets per phase (builds on checkInConfig).
H5. Programming profiles wired into adaptation engine.
H6. foods_curated.json + protein target + quick-log UI (hero number live).
H7. foods_full.json lazy search.
H8. Barcode scan + OFF API + cache + sanity checks.
H9. Phase switching + off-ramp dashboard + AI coach context/guardrails.

Slots into the main queue after check-in (c); injury chat and AS-2 are
built flavour-aware once H1 lands.

## 10. Acceptance (whole spec)

- Nimble Shred selftest green; device smoke list green; zero visible or
  behavioural change in the nimble_shred flavour.
- Holdfast build: user on injection day with low appetite receives a
  visibly reduced session with supportive copy; logs 40g of chicken breast
  against a protein target in under 10 seconds; switches to off_ramp and
  sees the dashboard change.
