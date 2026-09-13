# A11y — post-reskin contrast + legibility audit (graphite + teal, audience 40+)

**Type:** READ-ONLY audit. No edits, no git, index.html untouched.
**Audited against:** `index.html` v113 (D1 reskin v107 — graphite base `#0F1011`/`#16191B`, teal `--sec #03DAC6`, amber `--amber #E0A35C`, Archivo/Hanken/JetBrains-Mono).
**Bars:** WCAG 2.1 AA — normal text **4.5:1**, large/UI **3.0:1**; visible focus (2.4.7); colour-not-sole-cue (1.4.1); tap target — brief's **44px** (note: WCAG 2.2 AA min 2.5.8 is only 24px, AAA 2.5.5 is 44px). Audience is men 40+, so small/borderline-contrast text is called out even where it technically passes.
**Ratios computed** from the live token hexes.

---

## 0. The good news — the tokenised palette is largely AA-clean
| pair | ratio | verdict |
|---|---|---|
| `--text #F2F0EB` on card / bg / surface-2 | 15.5 / 16.7 / 14.3 | ✅ AA |
| `--text-muted #969C9F` on card / bg / surface-2 | 6.35 / 6.85 / 5.85 | ✅ AA (normal) |
| `--sec` teal on card / bg / surface-2 | 9.96 / 10.8 / 9.18 | ✅ AA |
| `--amber #E0A35C` on card | 8.04 | ✅ AA |
| `--success #00C853` on card | 7.89 | ✅ AA |
| `--danger #CF6679` on card | 4.90 | ✅ AA (thin margin) |
| `--primary #8A8F98` on card | 5.44 | ✅ AA |
Graphite + teal + the muted token are all comfortably legible. The defects below are **legacy untokenised greys**, **focus**, **tap size**, and **one colour-only state** — not the new palette.

---

## 1. PRIORITISED FIX LIST  (element · issue · ratio/size · fix)

### P1 — WCAG AA failures (fix first)

| # | Element / where | Issue | Ratio / size | Fix |
|---|---|---|---|---|
| **1** | Legacy `#555` text — 10 uses (incl. `--rest-color`, rest-day labels, "skips warmup" hints) | Body text **fails AA** on graphite | **2.37:1** | Retoken → `--text-muted` (6.35) for readable text; `#555` only for non-informational dividers |
| **2** | Legacy `#666` text — 12 uses (set numbers `:4165`, history `.set-num` `:842`, "Set N", small captions) | Normal text **fails AA** | **3.08:1** | → `--text-muted`; for true labels that must read, that's mandatory |
| **3** | Legacy `#777` text — 2 uses | Normal text fails AA | **3.94:1** | → `--text-muted` |
| **4** | **Visible focus** — `.btn`, `.btn-small`, `.chip`, `.rpe-tag`, `.nav-btn`, `.day-bubble`, links | Only `input/select/textarea:focus` styled (`:113`); **no `:focus-visible`** on any other control → keyboard users get no focus indicator (WCAG 2.4.7) | n/a | Add a global `:focus-visible { outline: 2px solid var(--sec); outline-offset: 2px }` (or the existing `--accent-weak` ring) to all interactive elements |
| **5** | **Nav active state** — `.nav-btn.active { color: var(--accent) }` `:135` vs default `color: var(--text-muted)` `:130` | Active tab signalled by **teal-vs-grey colour ONLY** — no shape/weight/indicator (WCAG 1.4.1). Primary navigation. | n/a | Add a non-colour cue: active top/bottom indicator bar, filled icon, or `font-weight:700` on the active label |
| **6** | `.chip` (Quick Start types, filters, Builder, Encyclopedia — high traffic) | Tap target **< 44px** | ~**34px** (`padding:10px 18px`, `0.85em` `:142`) | Add `min-height:44px` + center; bump padding |
| **7** | `.rpe-tag` (equipment toggles, RPE tags, check-in) | Tap target **< 44px** | ~**29px** (`padding:8px 14px`, `0.8em` `:564`) | `min-height:44px` |
| **8** | `.modal-close` (✕ on every modal) | Tap target **< 44px**, no min size | ~**33px** (`padding:8px 16px` `:289`) | `min-height:44px; min-width:44px` |

> Targets that PASS (no action): `.btn` 48px, `.btn-small` 44px, `.nav-btn` 48px, mobile `.day-bubble` 60px.

### P2 — legibility / robustness (40+ audience; mostly passing but worth tightening)

| # | Element / where | Issue | Ratio / size | Fix |
|---|---|---|---|---|
| **9** | Legacy `#888` text — **57 uses**, mostly captions/hints at `0.7–0.8em` | Passes AA but **borderline at small size** — the dominant "muted" grey is barely-compliant and tiny for 40+ | **4.98:1** @ ~10–12px | Retoken → `--text-muted` (6.35) and floor caption size at ~12–13px |
| **10** | `.nav-btn` labels | `font-size:0.7em` (~11px) nav labels — small for 40+ | ~11px | Bump to ~0.8em / 12–13px (helps with the P1-5 weight cue too) |
| **11** | Data caption `:4044` — mono uppercase + letter-spacing | `font-size:11.5px` mono caption — mono digits legible but small; uppercase+tracking compounds it | 11.5px (muted, 6.35 ✅ contrast) | Raise to ≥12–13px for primary data captions; keep mono |
| **12** | Modals (`#checkin-modal`, `#consult-modal`, `#custom-builder-modal`, GPS) | No evidence of focus-trap / initial-focus / focus-restore → on open, keyboard focus stays **behind** the modal (focus-order, 2.4.3) | n/a | On open: move focus to the modal (first control / heading); trap Tab within; restore focus to the trigger on close |
| **13** | `--hint #5F666A` token | **Defined but 0 consumers** — would **fail AA** as text if used | **3.02:1** | Guard before use: restrict to ≥18.66px-bold/24px large text or non-text; otherwise prefer `--text-muted` |
| **14** | `--danger #CF6679` as error text | Passes at 4.90 but thin margin; error text must never be the weak link | 4.90:1 | Acceptable; if error copy shrinks below ~16px keep an eye, or darken-bg/lighten the token slightly |

---

## 2. Notes / things that are already fine
- **`.chip.active`** (teal bg-tint + teal border + light text `:150`), **`.rpe-tag.selected`** (solid teal fill + black text + **bold** + border `:576`), and **completed-day check icon** (`.day-check` `:193`) all carry a **non-colour cue** — no 1.4.1 issue there. The colour-only state is specifically **nav-active** (fix #5).
- Tap sizing on primary actions (`.btn`/`.btn-small`/`.nav-btn`) already meets 44–48px.
- Large mono figures (recovery score `:367`, rest timer) are big and high-contrast — legible.
- Focus **order** is DOM-order and logical for the single-page flow; the gaps are **visible focus** (#4) and **modal focus management** (#12), not source order.

---

## 3. Summary
- **Palette is sound:** graphite + teal + amber + `--text`/`--text-muted` all pass AA (text 14–16, muted 6.35, teal ~10, amber 8). The reskin itself is legible.
- **Real AA failures are legacy, untokenised greys** (`#555` 2.37, `#666` 3.08, `#777` 3.94) still used as small text — retoken to `--text-muted`.
- **Two structural a11y gaps:** no visible `:focus-visible` on non-input controls (2.4.7), and nav-active is teal-colour-only (1.4.1).
- **Three sub-44px tap targets:** `.chip` ~34, `.rpe-tag` ~29, `.modal-close` ~33.
- **40+ legibility:** the heavily-used `#888` (4.98, borderline) + small nav/data type (11–11.5px) should be tokenised and sized up; modal focus management and the unused `--hint` token are robustness guards.
- Net: ~8 P1 + 6 P2 items for a future T1 pass; none require palette changes, mostly retokenising legacy greys, adding a focus style, a nav non-colour cue, and three `min-height:44px`.

---

*Signed off — T5, terminal pts/T5, 2026-06-15 10:44 AEST (00:44 UTC). Read-only: no edits, no git, index.html untouched.*
