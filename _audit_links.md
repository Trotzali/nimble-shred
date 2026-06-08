# Audit — Dead "Watch Form Tutorial" links (issue #14)

**Scope:** T4 investigation only. No changes to `index.html`. This file documents
which links are broken, the root cause, and fix options for a later build.
**Date:** 2026-06-08 · **Target:** `index.html` (v61, read-only)

---

## TL;DR / Verdict

**The handler is correct. The problem is in the URL *data*, not the code.**

- The "Watch Form Tutorial" button is a plain `<a href>` rendered from
  `exerciseMedia[<name>].yt`. The anchor markup is well-formed at both render
  sites (`target="_blank" rel="noopener"`).
- Confirmed live-vs-dead by hitting YouTube's oEmbed endpoint:
  - a **well-formed** ID (`v=IODxDxX7oi4`, Push-up) → **HTTP 200**, real video
    ("The Perfect Push Up | Do it right!"). Handler + good data works.
  - the **one malformed** ID (`v=PPrzBWZDOhttps`, Cable Lateral Raise) →
    **HTTP 400**. Dead.
- So a "dead link" only happens when the stored `yt` URL is itself bad. Exactly
  **one** stored URL is structurally broken today (see Finding A).
- A second, larger class of "missing tutorial" complaints is not a *dead* link
  but **no link at all**: 69 of 163 exercises have no `exerciseMedia` entry, so
  the button is never rendered for them (Finding B).

---

## 1. How the link is generated

The tutorial link is built in **two** places, both from the same data source
(`media.yt`, where `media = getExerciseMedia(ex.name)`):

### Site 1 — active workout card (`renderWorkout`), `index.html` L3640–3645
```js
// YouTube link
var ytHtml = '';
if (media && media.yt) {
    ytHtml = '<a href="' + media.yt + '" target="_blank" rel="noopener" ' +
        'style="...">' +
        '▶ Watch Form Tutorial</a>';
}
```

### Site 2 — exercise detail modal (`viewExerciseDetails`), `index.html` L5606–5614
```js
let ytHtml = '';
if (ytUrl) {                         // ytUrl = media ? media.yt : null;  (L5594)
    ytHtml = `
        <a href="${ytUrl}" target="_blank" rel="noopener" style="...">
            ▶ Watch Form Tutorial on YouTube
        </a>`;
}
```

Both are guarded by `if (media && media.yt)` / `if (ytUrl)`, so **when there is
no URL, no button is shown** (it does not render a broken/empty link).

## 2. Where the URLs live

- **`exerciseMedia` object** — `index.html` **L3044–3206** (158 entries). Each:
  `"<Exercise Name>": { gif: "<url>", yt: "<youtube url>" }`.
- **`getExerciseMedia(name)`** — L5574–5581. Resolves the name through
  `mediaAliases`, looks up `exerciseMedia[key]`; falls back to a localStorage
  GIF (with `yt: null`, i.e. no tutorial button) if there's no entry.
- **`mediaAliases`** — L5528–5572. Maps exercise names that differ from media
  keys (e.g. `"Pull-ups" → "Pull-up"`).

There is **no separate handler/click logic** — it's a static anchor. Nothing to
break in JS; the only failure mode is a bad/absent value in `exerciseMedia`.

---

## 3. Findings (what's actually wrong)

Counts: 163 exercises in `allExercises`; 158 `exerciseMedia` entries; every
media entry has a `yt`. → 94 exercises render a tutorial button, 69 render none.

### A. ONE structurally-dead URL  ← the literal "dead link"
| Exercise | Stored `yt` | Problem | Verified |
|---|---|---|---|
| **Cable Lateral Raise** (L3061) | `https://www.youtube.com/watch?v=PPrzBWZDOhttps` | `v=` is 14 chars containing the word "https" — a copy/paste error: a truncated 11-char ID with `https` appended. | **HTTP 400 (dead)** via oEmbed |

This is the only stored URL that is malformed. Every other `yt` is a
syntactically valid 11-char YouTube watch URL.

### B. 69 exercises have NO media entry → no button at all (not "dead", "absent")
For these, `getExerciseMedia` returns `null` (or a localStorage GIF with
`yt:null`), so the "Watch Form Tutorial" button never appears. If issue #14 was
filed because tutorials are *missing* (not erroring), this is the bulk of it.
Full list of the 69 was produced in the T1 media-gap audit
(`rehab-mobility-exercises.js` header). Examples: every animal-flow / Nimble
move (Bear Crawl, Kick Through, …), most cable accessory variants, push-up
variations, plyo moves.

### C. 13 shared/duplicate video IDs → button works but shows a borrowed clip
Live links (not dead) but the same video is reused for different exercises, so
the tutorial is generic or for a different movement. Content-accuracy, not a
dead link. Notable mismatches:

| Shared `v=` | Used by |
|---|---|
| `ultWZbUMPL8` | **Cable Squat** + Barbell Squat (cable squat shows a barbell squat) |
| `8iPEnn-CzS8` | Single Arm Cable Chest Press + Dumbbell Incline Press + Landmine Press |
| `TU0hP7tdcwo` | Cable Upright Row + Cable Y-Raise + Upright Row |
| `MeIiIdhvXT4` | Goblet Squat + Kettlebell Goblet Squat |
| `LfyQBUKR8SE` | Decline Bench Press + Decline Dumbbell Press |
| `taI4XduLpTk` | Cable Chest Fly (High) + Cable Crossover |
| `2-LAMcpzODU` | Tricep Pushdown (Rope) + Tricep Pushdown (Bar) |
| `TwD-YGVP4Bk` | Cable Hammer Curl + Hammer Curl |
| `CAwf7n6Luuc` | Lat Pulldown (Standing) + Lat Pulldown Machine |
| `JbyjNymZOt0` | Cable Calf Raise + Calf Raise Machine |
| `bU8yKk4vI3M` | Cable Abductor + Leg Abductor Machine |
| `VqzWOt6T7iQ` | Cable Adductor + Leg Adductor Machine |
| `g6qbq4Lf1FI` | Dumbbell Shrug + Barbell Shrug |

### D. 5 `gif:"placeholder"` entries (adjacent, not a link bug)
Treadmill Run, Stationary Bike, Stair Climber, Elliptical, Foam Roll — broken
*GIF* (hidden by `onerror`); their `yt` links are fine. Noted for completeness.

### E. Liveness caveat
Static analysis only proves URL *shape*. A well-formed ID can still be **dead**
if the video was later removed/privatized/region-blocked. Detecting those needs
a network sweep (see Fix Option 2). Only the 158 stored URLs were shape-checked;
one sample good ID and the one bad ID were network-verified.

---

## 4. Root cause

- **Not a broken handler.** The anchor is static and correct at both sites.
- **Dead link (Finding A):** a single corrupted value in `exerciseMedia`
  (`PPrzBWZDOhttps`) — data-entry error.
- **Missing buttons (Finding B):** absent `exerciseMedia` entries for 69
  exercises — the data set was never completed (the "158/164" gap tracked in
  `_project_state.md`).
- **Wrong-clip buttons (Finding C):** placeholder/duplicate IDs reused during
  data entry — data accuracy.

---

## 5. Fix options (all data-side; no handler change required for A–C)

**Option 1 — Fix the one dead URL (smallest, highest-value).**
Replace the corrupted `yt` for *Cable Lateral Raise* (L3061) with a verified
cable-lateral-raise tutorial. The original ID is unrecoverable from the
corruption, so the replacement must be sourced and checked.
`// UNVERIFIED — needs a real, checked video ID before integration`
```js
"Cable Lateral Raise": { gif: "...unchanged...", yt: "https://www.youtube.com/watch?v=<VERIFIED_ID>" },
```

**Option 2 — oEmbed liveness sweep (catches Finding E + confirms A).**
Validate all 158 `yt` URLs offline before shipping. Any non-200 = dead.
```js
// node, no deps; ~158 requests
const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(yt)}&format=json`;
const ok = (await fetch(url)).status === 200;   // 200 = live, 400/401/404 = dead
```
Output a list of dead IDs to fix. (This is how Finding A was confirmed.)

**Option 3 — Fill the 69 missing entries (Finding B).**
Add `exerciseMedia` entries (or `mediaAliases` to an existing close match, e.g.
`"Wide Grip Push-up" → "Push-up"`) so those exercises get a working button.
Triage list already prepared in the T1 media-gap audit.

**Option 4 — De-dupe shared videos (Finding C).**
Swap the borrowed IDs for movement-specific tutorials where accuracy matters
(esp. Cable Squat → a real cable-squat clip).

**Option 5 (handler enhancement, later build) — graceful fallback.**
For exercises with no `yt`, render a "Search YouTube" link instead of nothing:
```js
const href = media?.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise form')}`;
```
Turns 69 missing buttons + any future gaps into a useful (never-dead) search
link. This is the only option that touches the handler, so defer to an
integration build, not this prep pass.

---

## Appendix — reproduction

```bash
# malformed-URL / duplicate / placeholder scan (static)
node -e '/* parse exerciseMedia, regex-check each yt against ^.../watch\?v=[\w-]{11}$ */'
# liveness check (network)
# GET https://www.youtube.com/oembed?url=<watch-url>&format=json  -> 200 live / 400 dead
```
Confirmed 2026-06-08: `v=PPrzBWZDOhttps` → 400; `v=IODxDxX7oi4` → 200.
