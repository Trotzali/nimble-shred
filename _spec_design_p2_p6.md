# Spec — Design phases P2–P6 (build-ready)

**Type:** Read-only implementation spec. No code changed, no git, `index.html`
untouched. Read against **v79** (CSS block `<style>` @L33). Anchors are line +
selector — **re-anchor by selector** before editing (lines drift; v79 is post-
mega-run, see §Re-check).

**Inputs:** `_design_audit_live.md` (live design state) + direction **Hevy-like,
teal accent, slate secondary**: accent = `--sec` `#03DAC6` (locked), secondary =
`--primary` `#8A8F98` (slate, landed in P1).

**Token groundwork already present (L42–47), currently INERT — P2–P6 activate it:**
`--accent: var(--sec)`, `--surface: var(--card)`, `--border: rgba(255,255,255,0.04)`,
`--text-muted: #888`, `--radius: 14px`, `--shadow: …`. These have **zero consumers
today**; the phases below begin consuming them, so the token layer stops being
dead. **P1 is done** (`--primary` slate) and **P4 (glassmorphism) is already
absent** per the audit — neither is respecified here. Phases covered: **P2, P3,
P5, P6.**

### Prerequisite (one tiny additive token, lands with P2 or P5)
```css
/* add in :root after --shadow (L47) — additive, zero risk */
--accent-weak: rgba(3, 218, 198, 0.30);   /* teal @ low alpha — focus ring (P5), ghost-hover fill (P2) */
```

---

## P2 — Buttons (fill vs ghost hierarchy · 48px tap targets)

**Goal:** one primary (teal **fill**), one secondary (**ghost**/outline), semantic
danger/success fills; every full-width button ≥48px, small buttons ≥44px.

**Selectors/anchors (current):** `.btn` L66 · `.btn:hover` L72 · `.btn:active`
L73 · `.btn-main` L74 (teal fill) · `.btn-action` L75 (**slate fill → becomes
ghost**) · `.btn-danger` L76 · `.btn-success` L77 · `.btn-small` L78.

**CSS to land (replace L66–81):**
```css
.btn {
    display:block; width:100%; min-height:48px; padding:14px;
    border:1px solid transparent; border-radius:10px; font-weight:600;
    cursor:pointer; margin-top:8px; font-size:15px; transition:all .15s; text-align:center;
}
.btn:hover  { filter: brightness(1.08); }     /* fills darken; ghost overridden below */
.btn:active { transform: scale(0.98); }
.btn-main    { background: var(--accent); color:#000; }                 /* PRIMARY (fill) */
.btn-action  { background: transparent; color: var(--text);            /* SECONDARY (ghost) */
               border-color: rgba(255,255,255,0.18); }
.btn-action:hover { filter:none; background: var(--accent-weak);
                    border-color: var(--accent); color: var(--accent); }
.btn-danger  { background: var(--danger);  color:#fff; }
.btn-success { background: var(--success); color:#fff; }
.btn-small   { width:auto; min-height:44px; padding:10px 16px; font-size:.85em;
               display:inline-flex; align-items:center; justify-content:center;
               margin:4px 0; border-radius:10px; }
```
Notes: `border:1px solid transparent` on `.btn` reserves the ghost border so
fill↔ghost don't change size; `border:none` (old L67) is dropped. `.btn-small`
→ `inline-flex` so `min-height` keeps the label centered.

**Blast radius:** `.btn` is app-wide. **Every `.btn-action` flips from slate fill
to ghost** (Random Workout, Next Exercise, Regenerate, Test Voice, equipment
Save, etc.) — the biggest visual change. Removing the universal `opacity:0.9`
hover changes hover feel everywhere. `min-height:48px` may grow a few short
buttons. Ghost text is `--text` on `--bg`/`--surface` — verify contrast.

**Test gate:** on every screen, primary actions are teal-filled, secondary are
outlined/transparent; all full-width buttons measure ≥48px tall (DevTools), small
≥44px; hover (fill brightens / ghost fills teal) + active scale feel consistent;
no button loses legibility. Specifically confirm the **v79 Quick-Start "Start"**
and **v78 "Accept & Start"** are `.btn-main` (primary), and **"Regenerate" /
"Random Workout"** are `.btn-action` (now ghost) and still readable.

---

## P3 — Cards (flat · single border)

**Goal:** remove drop shadows; one hairline border; tokenized.

**Selectors/anchors:** `.card` L59 (has **both** shadow + border today) ·
`.exercise-card` L128 (slate left-stripe) · `.modal-content` L249 (floating —
keep its elevation).

**CSS to land (replace L59–63):**
```css
.card {
    background: var(--surface); padding:18px; border-radius: var(--radius);
    margin-bottom:14px; border:1px solid var(--border);
    /* P3: box-shadow removed — flat, single hairline border */
}
```
**Active-exercise stripe (recommended, L128–131):** make the accent teal to match
`.set-active`:
```css
.exercise-card { border-left:4px solid var(--accent); margin-bottom:15px; position:relative; }
```
(Currently `var(--primary)` slate — design choice; teal signals "active" and is
consistent with the teal set-active. Flag for sign-off.)

**Blast radius:** `.card` is on nearly every screen → drop shadows disappear
globally (visual-only, low functional risk). Separation now relies on the
`--bg #121212` vs `--surface #1e1e1e` delta + the hairline `--border` (rgba white
0.04). **Tuning knob:** if cards read too flat, raise `--border` alpha to ~0.08 in
`:root` (one line, global). **Do NOT** flatten `.modal-content` (L249) — its
`0 10px 40px` shadow is intentional float over the dimmed overlay; leave it.

**Test gate:** content cards show no drop shadow, a single hairline border, and
remain visually distinct from the page background; the active exercise-card stripe
renders (teal if adopted); modals stay elevated. Check the **plan-generator modal**
and **Custom Builder modal** (mega-run-touched) still look right with flat inner
cards.

---

## P5 — Inputs + focus ring (the `--accent-weak` ring)

**Goal:** consistent fields, ≥48px, with a soft teal focus ring — **without**
breaking the range sliders that share the `input` selector.

**Selectors/anchors:** `input, select, textarea` L84 · `input:focus,…` L89 (border
recolor only, **no ring** today) · `input[type="range"]` L266 / thumb L270.

**CSS to land (replace L84–91):**
```css
input, select, textarea {
    width:100%; min-height:48px; padding:12px; background:#2c2c2c;
    border:1px solid #444; border-radius:8px; color:#fff; font-size:16px;
    margin:5px 0; transition:border-color .15s, box-shadow .15s;
}
input:not([type=range]):focus, select:focus, textarea:focus {
    border-color: var(--accent); outline:none;
    box-shadow: 0 0 0 3px var(--accent-weak);   /* the accent-weak ring */
}
```
**REQUIRED companion (range slider must opt out of the new sizing) — extend L266:**
```css
input[type="range"] {
    width:100%; height:8px; min-height:auto; padding:0; margin:10px 0;
    border:none; border-radius:5px; background:#333; outline:none; -webkit-appearance:none;
}
```
Without this, the general rule's `min-height:48px` + `padding:12px` + `border:1px`
**bloat the sliders** (`#rpe-slider`, `#exercise-count-slider`). The
`:not([type=range])` guard on `:focus` keeps the ring off the sliders.

**Blast radius:** every text/number/select/textarea (set-log weight/reps, Builder
search, consultation textarea, GPS/profile, equipment name) gets ≥48px + ring +
8px radius + 16px font (keeps iOS no-zoom). The range-slider companion edit is
mandatory or the two sliders visibly break.

**Test gate:** focusing any text/number/select/textarea shows a teal border + 3px
soft teal ring; **range sliders are unaffected** (still 8px tall, teal thumb, no
ring/box); all fields ≥48px; 16px font (no iOS zoom on focus); set-log weight/reps
inputs show the ring; submit/typing behaviour unchanged.

---

## P6 — Navigation (bottom bar)

**Goal:** tokenized, accent-driven active state, ≥48px tap targets.

**Selectors/anchors:** `.nav-bar` L98 (solid `#1a1a1a`, `border-top:1px #333`) ·
`.nav-btn` L104 (`color:#777`, `transition:.2s`) · `.nav-btn.active` L109
(`var(--sec)`) · `.nav-icon` L110.

**CSS to land (replace L98–109):**
```css
.nav-bar {
    position:fixed; bottom:0; left:0; right:0;
    background: var(--surface); display:flex; justify-content:space-around;
    padding:8px 8px; border-top:1px solid var(--border); z-index:9000;
    padding-bottom: max(8px, env(safe-area-inset-bottom));
}
.nav-btn {
    background:none; color: var(--text-muted); border:none; font-size:.7em;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:3px; cursor:pointer; padding:6px 4px; min-height:48px; transition:color .2s; flex:1;
}
.nav-btn:hover  { color:#aaa; }
.nav-btn.active { color: var(--accent); }
```
**Choice to confirm:** `background:var(--surface)` (#1e1e1e) lightens the bar from
the current `#1a1a1a` — token-consistent but less separated from cards (the
`border-top` still delineates). If a darker nav is preferred, keep
`background:#1a1a1a` and tokenize only the border/colors. Flag for sign-off.

**Blast radius:** global fixed bar, low risk — color/token swaps + explicit
`min-height` (already ~50px in practice). `transition:.2s` → `transition:color .2s`
avoids transitioning layout. Active stays teal.

**Test gate:** bottom-fixed nav renders; active tab teal, inactive `--text-muted`;
each `.nav-btn` ≥48px tap target; safe-area bottom padding intact on iOS; hairline
`border-top`; switching tabs moves the teal active state; all tabs still fit (flex:1).

---

## Re-check at build time — mega-run Builds 1 / 4 / 5 touched these

v79 is post-mega-run; the following moved or changed since the v75 audit anchors —
**re-grep by selector/`onclick`, not by line:**

- **Focus chips (Build 1 / v77 taxonomy swap):** Builder focus chips relabelled
  (Mobility/Resilience). Markup is still `.chip` so P2–P6 don't restyle them, **but**
  `.chip.active` (L122) is `background:var(--primary)` (slate). For selected-state
  consistency with the teal accent system, the chip owner should consider
  `.chip.active → var(--accent)`. **Out of P2–P6 scope** — flag to the chip build;
  don't change it here.
- **Cardio chip + Quick-Start type chips (Build 5 / v79 decouple):** type chips are
  now select-only with a **new "Start" button**. P2 must confirm that Start button
  is `.btn-main` (primary). Re-find the Quick-Start panel (was ~L1180–1245 v75).
- **Plan modal (Build 4 / v78 multi-select + "Accept & Start"):** verify
  `.modal-content`/`.card` (P3 flat) and that "Accept & Start" is `.btn-main` (P2).
  Re-find the plan-generator modal (was ~L1898–1934 v75).
- **General:** all P2–P6 anchor line numbers are from v79 reads in this spec but
  will drift as builds land — anchor on the selector text.

## Suggested order & risk
`--accent-weak` token (trivial) → **P3 cards** (visual-only, lowest risk) → **P6
nav** (small, global) → **P5 inputs** (needs the range-slider companion edit) →
**P2 buttons** (largest visual change: ghost secondaries app-wide). Each is one CSS
category with its own test gate; all are CSS-only, no JS/markup changes required.

— T4, 2026-06-11 17:11 (+10:00)
