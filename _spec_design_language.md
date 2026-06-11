# Nimble Shred — Design Language Spec (`_spec_design_language.md`)

**Direction chosen:** "Chase Hevy" — near-monochrome dark surface, ONE accent used
sparingly, flat cards, clean type hierarchy, big readable numerals, calm motion.
**Audience lens (40+):** legible, calm, credible. No flashy motion, generous tap targets.

> **Authority note.** This is a DESIGN-track spec. It is authored here and handed to the
> feature chat's **T1**, which is the only terminal that edits `index.html`, bumps the
> version, and commits. Apply **tokens-first, then one component category per build, test
> between** — the v52 lesson is non-negotiable.
>
> **Baseline caveat.** Values below are mapped to the **v51** snapshot in Project files.
> Live is ~v72; icons/themes/taxonomy may already differ. T1 should audit live state and
> adjust per phase rather than assume v51.

---

## 0. The one open decision: accent hue

The system uses a SINGLE accent token, `--accent`. Pick the value once:

- **Recommended — Teal `#03DAC6`** (your current `--sec`). Distinctive, already wired to
  Start Workout, avoids the blue/purple AI cliché.
- **Alt — Hevy-style blue `#2F6BFF`.** Closer to Hevy literally, but blue is the most
  common "AI app" accent.

It is **one token**. Everything else in this spec is identical either way.

---

## 1. What makes v51 read as "AI-generated" (the targets to remove)

Confirmed against the v51 source. Each is a token- or component-level fix:

1. **Purple primary** (`--primary: #BB86FC`) — the single most recognizable AI tell, and it
   is the *primary* action color. Demote it.
2. **Glassmorphism** on cards (`backdrop-filter: blur(10px)` + stacked soft shadows). Remove.
3. **Null gradients** — `linear-gradient(135deg, var(--sec) 0%, var(--sec) 100%)` (a gradient
   from a color to itself). Replace with flat fills.
4. **Universal transition** `* { transition: ... transform .2s }` + `card:hover translateY(-2px)`
   hover-lift on everything. Remove; apply motion deliberately.
5. **Emoji icons** (💪 ▶️ 🏋️), currently mojibake-corrupted. Replace with one line-icon set
   via the IC constants object (injected SVG, `innerHTML` — never inline SVG in JS literals).
6. **Four bundled themes** (Athletic/Premium/Tech/Minimal) — "no point of view." Collapse to
   one opinionated look; keep light/dark MODE only.

---

## 2. Token set (CSS custom properties)

Vanilla CSS custom properties only. Keep existing token NAMES so references don't break;
add new ones; repoint the offenders. Dark is primary; light values given for mode parity.

### 2.1 Surfaces — elevation ramp (lighter = higher), NOT shadows/blur

```css
:root {
  /* DARK (primary) */
  --bg:         #111113;  /* app base (near-black, faint cool tint) */
  --card:       #1A1A1D;  /* surface-1: cards (keep name --card) */
  --surface-2:  #232327;  /* inputs, raised rows, selected states */
  --surface-3:  #2C2C31;  /* modals, popovers, menus */
  --border:     #2A2A2E;  /* hairline separators */
}
/* LIGHT mode parity:
   --bg #F6F6F7; --card #FFFFFF; --surface-2 #F0F0F2; --surface-3 #FFFFFF; --border #E4E4E7 */
```

Rationale: avoid pure black; depth comes from progressively lighter layers (Material/Hevy
practice), not glass and drop shadows.

### 2.2 Text

```css
--text:       #F2F2F3;  /* primary (off-white, not pure #fff) */
--text-muted: #9A9AA0;  /* secondary / labels */
--text-faint: #6A6A70;  /* tertiary / placeholder / disabled */
/* LIGHT: --text #18181B; --text-muted #5B5B61; --text-faint #9A9AA0 */
```

### 2.3 Accent — ONE color, used sparingly (the 60-30-10 "10")

```css
--accent:      #03DAC6;                    /* the single brand/action color (see §0) */
--accent-weak: rgba(3,217,198,0.14);       /* chip-selected tint, focus ring */
--on-accent:   #00211D;                    /* text on a filled accent button */

/* Back-compat + de-purple: repoint existing names to the accent */
--sec:     var(--accent);  /* keeps version badge + .btn-main correct */
--primary: var(--accent);  /* KILLS purple app-wide via tokens; buttons differentiate
                              by fill vs ghost later, not by hue */
```

### 2.4 Semantic colors — meaning only, never decoration (the WHOOP lesson)

```css
--success: #34C77B;   /* PRs, completed, positive delta */
--warn:    #E5A33D;   /* caution, deload, fatigue flag */
--danger:  #E5484D;   /* destructive, miss, over-limit */
--gold:    var(--accent);  /* RETIRE decorative gold; audit uses, fold into accent/warn */
```

### 2.5 Focus / workout-type coding — muted, used as small dots/labels (not big fills)

Designed for the **new 4-focus taxonomy** (handover §5: Strength / Power / Resilience /
Cardio, replacing Mobility/Nimble/Calisthenics/Plyometric). Desaturated so they read as
information, not candy. **Confirm final labels/semantics with the feature chat.**

```css
--focus-strength:   #E5705A;  /* heavy / load */
--focus-power:      #E5A33D;  /* explosive */
--focus-resilience: #5BB98B;  /* mobility / recovery */
--focus-cardio:     #4A9DE5;  /* conditioning */
```

(Existing `--push/--pull/--legs/--cardio/--nimble/--rest` workout-TYPE colors: desaturate to
match this restraint, or alias into the focus set — confirm which the live app still uses.)

### 2.6 Type scale (Inter, kept)

Tabular numerals for all logged numbers — a quiet pro signal.

```css
--fs-metric: 30px; --fw-metric: 700; --lh-metric: 1.1;  /* big weights/stats; tabular-nums */
--fs-h1:     26px; --fw-h1: 700; --lh-h1: 1.2;
--fs-h2:     21px; --fw-h2: 600; --lh-h2: 1.25;          /* "Workout Coach" header */
--fs-h3:     17px; --fw-h3: 600; --lh-h3: 1.35;
--fs-body:   16px; --fw-body: 400; --lh-body: 1.5;        /* 40+ floor */
--fs-small:  14px; --lh-small: 1.45;
--fs-caption:12px; --fw-caption: 500;                     /* labels, +0.04em tracking, UPPER */
```

Apply `font-variant-numeric: tabular-nums;` to weight/rep/stat displays.

### 2.7 Spacing (4px base), radii, motion

```css
--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px;
--r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:999px;  /* pill ONLY for chips, sparingly */
--motion-fast:120ms; --motion:180ms; --ease:cubic-bezier(0.2,0,0,1);
--tap-min:48px;  /* minimum interactive height/width */
```

---

## 3. Component patterns

CSS is illustrative — T1 adapts to the real selectors. No glass, no null gradients, no
universal transitions, no hover-lift.

### 3.1 Buttons — hierarchy by FILL vs GHOST, not by hue

```css
.btn { min-height: var(--tap-min); border-radius: var(--r-md); font-weight: 600;
       letter-spacing: .2px; transition: background var(--motion-fast) var(--ease); }
.btn:active { transform: scale(.99); }

/* Primary (Start Workout, Log Set): filled accent */
.btn-main   { background: var(--accent); color: var(--on-accent); border: none; }
.btn-main:hover { filter: brightness(1.06); }

/* Secondary (New Plan, Random, etc.): ghost */
.btn-action { background: transparent; color: var(--accent);
              border: 1.5px solid var(--border); }
.btn-action:hover { border-color: var(--accent); }

/* Destructive */
.btn-danger { background: transparent; color: var(--danger);
              border: 1.5px solid var(--danger); }
```

### 3.2 Cards — flat, elevation by surface

```css
.card { background: var(--card); border: 1px solid var(--border);
        border-radius: var(--r-lg); padding: var(--sp-4); }
/* DELETE: backdrop-filter, the stacked box-shadows, and .card:hover translateY(-2px). */
```

### 3.3 Set-log row — the Hevy signature, multi-mode (handover §5)

Three input modes: **weight+reps**, **reps-only**, **time**. One row template, fields
swap by mode. Big tabular numerals; 48px row; clear "previous" reference.

```
[ set# ]  [ prev: 60kg×8 ]   [  weight  ]  [  reps  ]   [ ✓ ]
```
- Row height ≥ `--tap-min`; alternating rows use `--surface-2` for scan-ability.
- Inputs use `--fs-metric` weight, tabular-nums, centered.
- Completed set: check fills `--accent`, row text → `--text-muted`.
- Coordinate this build with the feature chat's type-aware logging work.

### 3.4 Header + version badge (SACRED — preserve)

Nest the version INSIDE the h2 so it auto-matches header size; color = accent.

```html
<h2>Workout Coach <span class="ver">v{N}</span></h2>
```
```css
h2 { font-size: var(--fs-h2); font-weight: var(--fw-h2); }
.ver { color: var(--sec); font-weight: 600; }   /* --sec === --accent */
```
Per the standing instruction: badge sits next to the header, **same font size as the header**,
**color of the Start Workout button** (`--sec`/`--accent`), bumped every build. (Drop the old
`font-size:0.75em; color:#666; monospace` styling.) **Byte-safe edit** — line 854 holds the
mojibake'd 💪; don't corrupt surrounding bytes.

### 3.5 Inputs + focus

```css
input, select, textarea {
  min-height: var(--tap-min); background: var(--surface-2);
  border: 1.5px solid var(--border); border-radius: var(--r-md);
  color: var(--text); font-size: var(--fs-body); }
input:focus { border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-weak); outline: none; }
```
(Note: v52 referenced a nonexistent `--primary-rgb` for the focus ring — use `--accent-weak`.)

### 3.6 Bottom nav — flat

```css
.nav-bar { background: var(--card); border-top: 1px solid var(--border); }
/* DELETE backdrop-filter */
.nav-btn        { color: var(--text-muted); }
.nav-btn.active { color: var(--accent); }   /* was purple --primary */
```

### 3.7 Focus chips — new 4-chip taxonomy

```css
.chip { min-height: var(--tap-min); padding: var(--sp-2) var(--sp-4);
        border-radius: var(--r-pill); border: 1px solid var(--border);
        background: var(--surface-2); color: var(--text-muted);
        font-size: var(--fs-small); font-weight: 600; }
.chip.selected { background: var(--accent-weak); color: var(--accent);
                 border-color: var(--accent); }
/* Optional 8px meaning-dot per focus, colored from §2.5. */
```
**Mobile:** wrap or horizontal-scroll; test at ~380px (history of chip overflow on phones).

### 3.8 Modals

```css
.modal { background: var(--surface-3); border-radius: var(--r-lg);
         box-shadow: 0 12px 32px rgba(0,0,0,.45); }
.scrim { background: rgba(0,0,0,.5); }
```

---

## 4. Phased reskin sequence (ONE change category per build, test between)

T1 executes; bump version + commit each phase; user tests before the next.

| Phase | Category | Core change | Test gate |
|------|----------|-------------|-----------|
| **P1** | **Tokens only** | Add §2 vars to `:root`; repoint `--primary`/`--sec`→`--accent` (purple vanishes); add space/radius/type/motion. No markup edits. | All 164 exercises load; nothing breaks; purple gone app-wide |
| P2 | Buttons | Fill vs ghost (§3.1); remove null gradients | Start Workout / Log Set / secondary all correct, 48px |
| P3 | Cards | Flat (§3.2); remove glass + hover-lift | Cards readable; no float-on-hover |
| P4 | Header + badge | Nest version in h2 (§3.4); preserve convention | Badge same size as header, accent color, visible |
| P5 | Inputs + focus | §3.5; fix `--primary-rgb` ring bug | Focus ring shows; inputs ≥48px |
| P6 | Nav | Flat; accent active (§3.6) | Active tab = accent, not purple |
| P7 | Set-log rows | Multi-mode layout + tabular numerals (§3.3) | All 3 modes log correctly; coordinate w/ type-aware build |
| P8 | Focus chips | New 4-chip taxonomy styling (§3.7) | No overflow at 380px; coordinate w/ taxonomy swap |
| P9 | Modals | §3.8 | Modals layered, scrim correct |
| P10 | Icons | Emoji → line set via IC constants (innerHTML) | No mojibake; icons consistent (may already be done post-v51) |
| P11 | Motion cleanup | Remove universal `*` transition + remaining lifts; deliberate transitions only | No jank; calm feel |

**Sequencing notes:** P1 alone delivers most of the visible "no longer vibe-coded" jump for
near-zero risk (tokens cascade). P7/P8/P10 must interleave with the feature chat's queued
work (type-aware logging, taxonomy swap, icon migration) — confirm live state before each.

---

## 5. Hard constraints checklist (every phase)
- Vanilla CSS variables only — no framework/build step.
- UTF-8-safe edits (mojibake history).
- Mobile-first; verify ~380px.
- Preserve all functionality and all 164 exercises.
- Icons: injected SVG via IC constants + `innerHTML`; never inline SVG in JS literals.
- T1 is sole authority for `index.html`, version bumps, and git.
