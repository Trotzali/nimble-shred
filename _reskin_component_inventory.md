# Reskin — component & current-style inventory

**Terminal:** T2 (READ-ONLY — `index.html` not edited, no git).
**Scope:** every reusable UI component in `index.html`'s `<style>` block (lines ~35–905), with its CURRENT colour / radius / shadow / border / transition. This is the **target list** the component-phase reskin builds will retheme. Line numbers are indicative (drift as builds land).

> **Token state (already half-migrated):** v-recent work added a `--token` alias layer and neutralised the AI-purple tell. The reskin should drive everything off these tokens; today many components still hardcode raw hex (flagged per-component).

---

## 0. Design tokens — `:root` (L35–50)
| token | value | notes |
|---|---|---|
| `--bg` | `#121212` | page background |
| `--card` / `--surface` | `#1e1e1e` | card/panel fill (`--surface` is the alias) |
| `--primary` | `#8A8F98` | **slate** — *was* Material Purple `#BB86FC`; neutralised (P1) to kill the AI-palette tell |
| `--sec` / `--accent` | `#03DAC6` | **teal** — the one accent; `--accent` is the alias |
| `--accent-weak` | `rgba(3,218,198,0.30)` | focus ring (P5) + ghost-button hover fill (P2) |
| `--text` | `#fff` · `--text-muted` `#888` | |
| `--danger` `#CF6679` · `--warn` `#FF9800` · `--success` `#00C853` · `--gold` `#FFD700` | semantic fills |
| `--push` `#FF6B6B` · `--pull` `#4ECDC4` · `--legs` `#95E1D3` · `--cardio` `#3498db` · `--nimble` `#5BB98B` · `--rest` `#555` | calendar day-type colours |
| `--border` | `rgba(255,255,255,0.04)` | hairline |
| `--radius` | `14px` | only consumed by `.card`/`.checkin-option`; everything else hardcodes its own radius |
| `--shadow` | `0 2px 12px rgba(0,0,0,0.3)` | **defined but unused** — `.card` removed its shadow (P3) |

**Reskin cross-cutting flags:** (a) **radius is inconsistent** — 6px / 8px / 10px / 12px / 14px / 16px / 20px / 25px / 50%; only 2 selectors use `--radius`. (b) **Raw-hex surfaces** bypass tokens: `#2c2c2c`, `#333`, `#1a1a1a`, `#444`, `#000`. (c) `--shadow` token is orphaned. Consolidating radius + surfaces onto tokens is the bulk of the reskin.

---

## 1. Buttons (L68–86)
| selector | colour | radius | border | shadow | transition |
|---|---|---|---|---|---|
| `.btn` (base) | — | `10px` | `1.5px solid transparent` | none | `all 0.15s` |
| `.btn-main` (primary/fill) | bg `var(--accent)` teal, text `#000` | ↑ | ↑ | none | ↑ |
| `.btn-action` (secondary/ghost) | bg transparent, text `var(--text)`, border `rgba(255,255,255,0.18)`; **hover** bg `--accent-weak` + border/text `--accent` | ↑ | ↑ | none | ↑ |
| `.btn-danger` | bg `var(--danger)`, text `#fff` | ↑ | ↑ | none | ↑ |
| `.btn-success` | bg `var(--success)`, text `#fff` | ↑ | ↑ | none | ↑ |
| `.btn-small` | inline-flex, `min-height:44px`, `padding:10px 16px`, `0.85em` | `10px` | inherits | none | ↑ |
- States: `.btn:hover{filter:brightness(1.08)}` (fills), `.btn:active{transform:scale(0.98)}`. `min-height:48px` (44 for small) — touch targets, preserve.

## 2. Cards & containers (L59–65)
| selector | colour | radius | border | shadow |
|---|---|---|---|---|
| `.card` | bg `var(--surface)`, `padding:18px` | `var(--radius)` = 14px | `1px solid var(--border)` | **none (P3 removed)** |
| `.container` | max-width 800px, centred, tab show/hide | — | — | — |
| `.encyclopedia-section` (L217) | bg `#1a1a1a` *(raw)* | 8px | — | — |
| `.gif-container` (L237) | bg `#000` *(raw)*, min-h 200px | 8px | `2px solid #333` *(raw)* | — |

## 3. Hero / today's banner
- **`#todays-banner`** (markup L~1179): uses `.card` base **+ inline** `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (purple→indigo). ⚠ **AI-palette tell still live here** — the inline gradient bypasses the `--primary` neutralisation; the reskin should retheme this to a token gradient (it's the most prominent surface on the front page).
- **Version badge** (markup L~1180): inline `<span style="font-size:1.3em; color: var(--sec)">` — teal text, no class. Inline-styled; fold into a token/badge class if desired.

## 4. Inputs / forms (L89–97, L273–280)
| selector | colour | radius | border | focus |
|---|---|---|---|---|
| `input, select, textarea` | bg `#2c2c2c` *(raw)*, text `#fff`, `min-height:48px`, `16px` | `8px` | `1.5px solid var(--border)` | border `--accent` + `box-shadow:0 0 0 3px var(--accent-weak)` ring; transition `border-color,box-shadow 0.15s` |
| `input[type=range]` | track `#333` *(raw)*, `height:8px` | `5px` | none | — |
| `range::-webkit-slider-thumb` | `20×20` circle, bg `var(--sec)` | `50%` | — | — |

## 5. Chips (L121–132)
| selector | colour | radius | border | transition |
|---|---|---|---|---|
| `.chip` | bg `rgba(255,255,255,0.06)`, text `#ccc` | `25px` (pill) | `2px solid rgba(255,255,255,0.15)` | `all 0.2s` |
| `.chip:hover` | bg `…0.1`, border+text `--sec` | ↑ | ↑ | ↑ |
| `.chip.active` | bg `var(--primary)` slate, text `#000`, bold | ↑ | border `--primary` | ↑ |
| `.chip-container` | flex-wrap, gap 8px, centred | — | — | — |
- `.chip:active{transform:scale(0.96)}`. ⚠ active-chip fill is `--primary` (slate), not the teal accent — inconsistent with `.btn-main`; reskin decision point.

## 6. RPE / gear / check-in tags
| selector (L533–571) | colour | radius | border | transition |
|---|---|---|---|---|
| `.rpe-tag` | bg `rgba(255,255,255,0.06)`, text `#ccc`, `8px 14px` | `25px` | `1px solid rgba(255,255,255,0.15)` | `all 0.2s` |
| `.rpe-tag.selected` | bg `var(--sec)`, text `#000`, bold | ↑ | border `--sec` | ↑ |
| `.checkin-option` | bg `rgba(255,255,255,0.04)`, centred | `14px` | `2px solid rgba(255,255,255,0.1)`; hover border `--sec` + bg `rgba(3,218,198,0.06)` | `all 0.2s` |
| `.gear-row` | flex helper | — | — | — |
- (`.rpe-tag` and `.chip` are near-duplicate pill patterns at different radii of border-width — candidate to unify in reskin.)

## 7. Navigation (L104–118)
| selector | colour | border | transition |
|---|---|---|---|
| `.nav-bar` | fixed bottom, bg `var(--surface)`, `padding-bottom:max(8px,env(safe-area-inset-bottom))`, z 9000 | `border-top:1px solid var(--border)` | — |
| `.nav-btn` | text `var(--text-muted)`, `min-height:48px`, flex column, `0.7em` | none | `color 0.2s` |
| `.nav-btn:hover` | `#aaa` · `.nav-btn.active` `var(--accent)` | — | ↑ |
| `.nav-icon` | 24px box, svg `flex-shrink:0` | — | — |

## 8. Modals (L249–270)
| selector | colour | radius | border | shadow |
|---|---|---|---|---|
| `.modal-overlay` | bg `rgba(0,0,0,0.95)`, fixed, z 10000, flex-centre (`.active` shows) | — | — | — |
| `.modal-content` | bg `var(--card)`, `max-w 600px`, `max-h 90vh` | `12px` | — | `0 10px 40px rgba(0,0,0,0.5)` |
| `.modal-header` | flex space-between | — | `border-bottom:2px solid #333` *(raw)* | — |
| `.modal-close` | bg `var(--danger)`, text white, `8px 16px` | `6px` | none | — |
- **Consultation full-screen modal** `#consult-modal` (L574–579): fixed full-viewport, bg `var(--bg)`, z 10001, flex column (`.active` → flex). Distinct from `.modal-overlay`.

## 9. Set-log / active-workout rows (L135–153)
| selector | colour | radius | border | shadow |
|---|---|---|---|---|
| `.exercise-card` | — | — | `border-left:4px solid var(--accent)` | — |
| `.set-completed` | bg `linear-gradient(90deg,#1a4d2e,#2d5f3d)` *(raw green)*, `padding:10px` | `6px` | `border-left:3px solid var(--success)` | — |
| `.set-active` | bg `#2c2c2c` *(raw)*, `padding:12px` | `6px` | `2px solid var(--sec)` | `0 0 10px rgba(3,218,198,0.2)` teal glow |
| `.progression-badge` | bg `var(--gold)`, text `#000`, bold `0.75em` | `12px` | — | — |

## 10. Rest timer (L695–727)
| selector | colour | radius | border |
|---|---|---|---|
| `.rest-timer-bar` | bg `rgba(3,218,198,0.08)`, centred | `10px` | `1px solid rgba(3,218,198,0.2)` |
| `.timer-value` | `2.2em` 800, `var(--sec)`, tabular-nums | — | — |
| `.rest-progress-bg` | bg `rgba(255,255,255,0.06)`, `h:6px` | `3px` | — |
| `.rest-progress-fill` | bg `var(--sec)` | `3px` | `transition:width 1s linear` |

## 11. Calendar day-bubbles (L160–199)
| selector | colour | radius | border | transition |
|---|---|---|---|---|
| `.day-bubble` | bg `#333` *(raw)*, `aspect-ratio:1` | `12px` | `2px solid #444` *(raw)* | `all 0.3s` (`:hover` translateY(-2px)) |
| `.workout-type-{push/pull/legs/cardio/nimble/rest}` | border `var(--{type}-color)`, bg `rgba(<type>,0.1)` | ↑ | ↑ | ↑ |
| sub: `.day-icon` (26px svg) · `.day-letter` (0.75em bold) · `.day-type` (0.65em #aaa) · `.day-check` (abs top-right) | | | | mobile overrides L1128–1138 |

## 12. List rows — builder & history
| selector | colour | radius | border | transition |
|---|---|---|---|---|
| `.exercise-list-item` (L202) | bg `#2c2c2c` *(raw)*, `padding:12px` | `6px` | `border-left:3px solid #555` *(raw)*; hover border `--primary` + `translateX(5px)` | `all 0.2s` |
| `.exercise-list-item.selected` | bg `rgba(138,143,152,0.2)`, border-left `--primary` | ↑ | ↑ | ↑ |
| `.history-day` (L752) | bg `rgba(255,255,255,0.04)` | `10px` | `1px solid rgba(255,255,255,0.1)` | — |
| `.history-day-header` | flex, `padding:12px 14px`; hover bg `…0.05` | — | — | `background 0.2s` |
| `.history-day-body` | hidden; `.expanded` → block | — | `border-top:1px solid rgba(255,255,255,0.06)` | — |
| `.history-exercise-name` | `var(--sec)`, bold `0.9em` | — | — | — |
| `.history-set-row` | flex, `0.85em` | — | `border-bottom:1px solid rgba(255,255,255,0.04)` | — |
| `.history-set-row input` | `w:60px`, bg `rgba(255,255,255,0.08)`, centred | `6px` | `1px solid rgba(255,255,255,0.15)` | — |
| `.history-set-actions button` | ghost; `.btn-save` `--sec`, `.btn-del` `#f5576c` *(raw, ≈danger)* | `4px` | none | `background 0.2s` |

## 13. Equipment presets (L730–749)
| selector | colour | radius | border | transition |
|---|---|---|---|---|
| `.preset-card` | bg `rgba(255,255,255,0.06)`, `12px 14px` | `10px` | `1px solid rgba(255,255,255,0.12)`; hover bg `…0.1` + border `--sec` | `all 0.2s` |
| `.preset-card.active` | bg `rgba(3,218,198,0.15)`, border `--sec`, `strong`→`--sec` | ↑ | ↑ | ↑ |

## 14. Coach-consultation chat (L580–665)
| selector | colour | radius | border | transition |
|---|---|---|---|---|
| `.consult-header` | bg `linear-gradient(135deg,rgba(3,218,198,0.15),rgba(138,143,152,0.1))` | — | `border-bottom 1px …0.06` | — |
| `.consult-progress-dot` | bg `…0.08`; `.filled`→`--sec`; `.active`→`--primary` | `2px` | — | `background 0.3s` |
| `.consult-msg` | `16px` (asymmetric tail 4px), `0.9em`, `msgFadeIn 0.3s` | `16px` | — | — |
| `.consult-msg.coach` | bg `rgba(255,255,255,0.06)`, text `#ddd`, tail bottom-left 4px | ↑ | — | — |
| `.consult-msg.user` | bg `var(--sec)`, text `#000`, tail bottom-right 4px | ↑ | — | — |
| `.consult-bubble` | bg `…0.06`, text `#ccc`; hover border/text `--sec` | `20px` | `1px solid …0.15` | `all 0.2s` |
| `.consult-input` | bg `…0.06`, `flex:1`; focus border `--sec` | `20px` | `1px solid …0.1` | — |
| `.consult-send` | `40px` circle, bg `var(--sec)`, text `#000` | `50%` | none | `all 0.2s` (hover scale 1.05) |

## 15. Badges & pills
| selector | colour | radius |
|---|---|---|
| `.profile-tag` (L662) | bg `rgba(3,218,198,0.12)`, text `--sec`, `0.7em` | `10px` |
| `.muscle-badge` (L232) | bg `var(--primary)`, text `#000`, bold `0.75em` | `12px` |
| `.progression-badge` (L150) | bg `var(--gold)`, text `#000` | `12px` |
| `.assess-pattern-badge` (L675) | bg `rgba(3,218,198,0.15)`, text `--sec`, `0.7em` | `8px` |
| `.history-day .day-rpe` (L781) | hue set inline by RPE value, `0.8em` bold | `12px` |
| `.text-muted` (L839) | `#aaa`, `0.85em` (utility) | — |
- ⚠ badges split between teal-tint (`profile-tag`, `assess-pattern-badge`) and slate `--primary` fill (`muscle-badge`) — unify in reskin.

## 16. Assessment / strength cards (L668–692)
| selector | colour | radius | border |
|---|---|---|---|
| `.assess-instruction` | bg `linear-gradient(135deg,rgba(138,143,152,0.08),rgba(3,218,198,0.08))` | `10px` | `1px solid rgba(138,143,152,0.2)` |
| `.strength-profile-card` | bg `linear-gradient(135deg,rgba(3,218,198,0.06),rgba(138,143,152,0.06))` | `12px` | `1px solid rgba(3,218,198,0.15)` |
| `.sp-bar-bg` | bg `rgba(255,255,255,0.06)`, `h:8px` | `4px` | — |
| `.sp-bar-fill` | bg `linear-gradient(90deg,var(--sec),var(--primary))` | `4px` | — |

## 17. AI chat FAB + panel (L848–904)
| selector | colour | radius | border | shadow | transition |
|---|---|---|---|---|---|
| `#ai-chat-button` (FAB) | `60×60`, bg `var(--sec)` teal, svg glyph `#000`, fixed bottom-right (above nav), z 8999 | `50%` | none | `0 4px 12px rgba(0,0,0,0.4)`; hover `0 6px 16px`; `.has-unread`→`pulse` teal | `transform,box-shadow 0.2s` (hover scale 1.1) |
| `#ai-chat-panel` | `400×500`, bg `var(--card)`, fixed, z 9000, `slideInUp 0.3s` | `16px` | — | `0 8px 32px rgba(0,0,0,0.6)` | — |
- Mobile overrides L1140–1162 (FAB reposition, panel full-screen). FAB was teal-recoloured in v101.

## 18. Toast / notification (L429–463)
| selector | colour | radius | border | shadow |
|---|---|---|---|---|
| `.daily-notification` | fixed top-right, bg `var(--card)`, `max-w 400px`, `slideInRight 0.3s` | `12px` | `border-left:4px solid var(--primary)` | `0 8px 24px rgba(0,0,0,0.5)` |
| `.notification-header` / `-body` / `-actions` | padded, `1px` dividers `rgba(255,255,255,0.1)` | — | — | — |

---

## Reskin priority notes (for the component-phase builds)
1. **Radius scale** — collapse the 6/8/10/12/14/16/20/25/50% spread onto a token ramp (e.g. `--r-sm/--r-md/--r-lg/--r-pill/--r-round`). Only `.card`/`.checkin-option` use `--radius` today.
2. **Surface tokens** — replace raw `#2c2c2c` / `#333` / `#1a1a1a` / `#444` / `#000` (inputs, set-active, gps, day-bubble, exercise-list-item, modal-header border, gif/encyclopedia) with `--surface`/`--surface-2`/`--border` tokens.
3. **Hero banner purple gradient** (`#todays-banner` inline `#667eea→#764ba2`) — the surviving AI-palette tell; retheme to a token gradient. Same for the slate↔teal mixed gradients in consult-header / assess / strength / sp-bar-fill.
4. **Accent vs `--primary` inconsistency** — `.chip.active`, `.muscle-badge`, `.exercise-list-item:hover`, `.consult-progress-dot.active`, `.daily-notification` border use slate `--primary`; most actives use teal `--sec`. Pick one active-state colour.
5. **Pill duplication** — `.chip` (2px border) vs `.rpe-tag` (1px border) vs `.consult-bubble` are the same component at different params; unify.
6. **Shadows** — `--shadow` token is orphaned (card went flat, P3); cards/rows are flat-hairline, only modals/FAB/panel/toast/set-active carry shadow. Decide whether the reskin stays flat or reintroduces elevation via the token.
7. **Preserve** — touch targets (`min-height:48px` btn/input/nav, 44px small), `env(safe-area-inset-bottom)` paddings, tabular-nums on the timer.

---

**Sign-off:** T2 — 2026-06-14 21:53
