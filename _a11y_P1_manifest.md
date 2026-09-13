# A11y P1 patch manifest (reskin #4) — paste-ready, ONE CSS-only T1 build

**Type:** READ-ONLY manifest. No index.html edits, no git.
**Input:** `_a11y_contrast_audit.md` (P1 items). **By selector/symbol, not line number.** All four sections are **CSS-only, no JS** (one `<style>` pass + scoped inline find/replace).
**Tokens in play (already defined):** `--text-muted #969C9F` (6.35:1 ✅), `--sec #03DAC6`, `--accent-weak rgba(3,218,198,0.30)`, `--accent: var(--sec)`.

---

## 1. Legacy grey retokens → `var(--text-muted)`

**Rule:** every **text** `color` set to `#555 / #666 / #777 / #888` → `var(--text-muted)`. (Confirmed fails: #555 2.37, #666 3.08, #777 3.94; near-grey #888 4.98 borderline at the 0.7–0.85em sizes these run at.)

### 1a. CSS-block selectors (in `<style>`) — retoken the `color` value
| selector | current | → |
|---|---|---|
| `.section-label` | `color: #666` | `var(--text-muted)` |
| `.history-set-row .set-num` | `color: #666` | `var(--text-muted)` |
| `.history-set-row .set-unit` | `color: #888` | `var(--text-muted)` |
| `.metric-label` | `color: #888` | `var(--text-muted)` |
| `.file-item .file-size` | `color: #888` | `var(--text-muted)` |
| `.checkin-desc` | `color: #888` | `var(--text-muted)` |
| `.consult-header .close-btn` | `color: #888` | `var(--text-muted)` |
| `.consult-msg.typing` | `color: #888` | `var(--text-muted)` |
| `.rest-timer-bar .timer-label` | `color: #888` | `var(--text-muted)` |
| `.history-day-header .day-meta` | `color: #888` | `var(--text-muted)` |
| `.message-timestamp` | `color: #888` | `var(--text-muted)` |
| (any remaining `color: #888` rules in `<style>`) | `color: #888` | `var(--text-muted)` |

### 1b. Inline `color` in body + render-function template strings — scoped find/replace
Replace text-colour greys only: `color:#555` · `color:#666` · `color:#777` · `color:#888` (with/without space after `:`) → `color:var(--text-muted)`.
Symbols carrying these (for reviewer orientation): the Wedge/Quick-Start hints, `showRPEModal`/Skip button, `renderWorkout` (session total, "Set N", "Up Next"), `renderPlanOverview` / strength+consultation profile captions, `renderRecoveryScorecard` ("Recovery Grade"), `renderDeloadDetective` advice, saved-locations empty state, the **Focus (optional)** label.

### 1c. LEAVE (not text / semantic — do NOT retoken)
- `--rest-color: #555` token definition, and the `typeColors` map (`{push:…, rest:'#555'}`) in `renderPlanCalendar` / `updateTodaysBanner` — day-type swatch colours (out of D1 scope).
- `border-left: 3px solid #555` (card accent border) — decorative border, not text.
- `.typing-dot { background: #888 }` — animated dot, not text.
- `#ccc` / `#aaa` (chip/rpe default text 11.0/6.7 ✅, nav hover) — pass; leave.

---

## 2. Three sub-44px tap targets → 44px (CSS only)

| selector | current | add / change | result |
|---|---|---|---|
| `.chip` | `padding: 10px 18px; font-size: 0.85em;` (inline-block, no min-height ≈ 34px) | `min-height: 44px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;` (keep horizontal `padding`; vertical may drop to `8px`) | ✅ 44px |
| `.rpe-tag` | `padding: 8px 14px; font-size: 0.8em;` (≈ 29px) | `min-height: 44px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;` | ✅ 44px |
| `.modal-close` | `padding: 8px 16px;` (no min ≈ 33px) | `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;` | ✅ 44×44 |

(`.btn` 48 / `.btn-small` 44 / `.nav-btn` 48 / mobile `.day-bubble` 60 already pass — no change.)

---

## 3. `:focus-visible` ring (currently 0 in file)

**Existing (keep):** `input:not([type=range]):focus, select:focus, textarea:focus { box-shadow: 0 0 0 2px var(--accent-weak); outline: none; }`.

**Add** a global ring for the interactive controls that have **no** focus style today:
```css
.btn, .btn-small, .nav-btn, .chip, .rpe-tag, .day-bubble, .modal-close,
.preset-card, .checkin-option, a[href] {
    /* (these currently have no :focus-visible) */
}
.btn:focus-visible, .btn-small:focus-visible, .nav-btn:focus-visible,
.chip:focus-visible, .rpe-tag:focus-visible, .day-bubble:focus-visible,
.modal-close:focus-visible, .preset-card:focus-visible,
.checkin-option:focus-visible, a[href]:focus-visible {
    outline: 2px solid var(--sec);
    outline-offset: 2px;
}
```
**Ring spec:** token `--sec` (teal, 9.96:1 on card), **2px** solid, **outline-offset 2px** (outline not box-shadow → never clipped by `overflow`, works on pill/rounded shapes). Consistent hue with the existing input ring.

**Flag (markup nit, not this CSS pass):** `.chip`, `.day-bubble`, `.checkin-option`, `.preset-card` are `<div onclick=…>` — not natively focusable, so `:focus-visible` only fires once they get `tabindex="0"`. Native `<button>`/`<a>` (`.btn*`, `.modal-close`, nav) benefit immediately. The `tabindex` add is a separate one-line-per-control markup follow-up.

---

## 4. Nav-active non-colour cue (currently colour-only)

**Current:** `.nav-btn { color: var(--text-muted); }` → `.nav-btn.active { color: var(--accent); }` — active vs inactive is **teal-vs-grey only** (WCAG 1.4.1).

**Add (CSS only, no markup):**
```css
.nav-btn.active {
    color: var(--accent);
    font-weight: 700;                       /* weight cue */
    box-shadow: inset 0 2px 0 var(--accent); /* indicator bar above the active tab */
}
```
Two non-colour cues (bold label + a 2px top indicator bar) so the active tab reads without relying on hue. No DOM change, no JS.

---

## 5. Build order (one CSS-only category)
1. **Retokens (§1)** — `<style>` `color` greys → `var(--text-muted)`, then the inline `color:#555|#666|#777|#888` find/replace, honouring the §1c LEAVE list.
2. **Tap targets (§2)** — `min-height:44px` + `inline-flex` centering on `.chip`, `.rpe-tag`, `.modal-close`.
3. **`:focus-visible` (§3)** — add the teal 2px / offset-2px ring block.
4. **Nav cue (§4)** — add `font-weight:700` + inset top bar to `.nav-btn.active`.

All four are pure CSS edits to the single `<style>` block plus a scoped inline-colour find/replace; **no JavaScript**. Markup follow-ups (`tabindex` on div-controls) are flagged in §3 but are **out of this CSS pass**.

---

SIGN OFF: T5 | 2026-06-15 11:26 AEST (01:26 UTC)
