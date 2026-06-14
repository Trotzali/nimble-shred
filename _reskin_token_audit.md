# Reskin — token & "vibe-coded tells" audit (current → target)

**Type:** READ-ONLY trace. No edits, no git, index.html untouched.
**Audited against:** committed/on-disk `index.html` (current; P1–P5 token groundwork already landed).
**Goal:** document the live token surface, competing/legacy palettes, and the tells to kill, mapped **current → target** so the foundation build is mechanical.
**Target system:** graphite base · teal accent (locked, existing `--sec`) · amber 2nd tone (streaks / joint flags ONLY) · type = **Archivo** (display) / **Hanken Grotesk** (body) / **JetBrains Mono** (all numbers/data).

---

## 1. Current `:root` (verbatim, `:35-50`)
```css
:root {
  --bg: #121212; --card: #1e1e1e; --primary: #8A8F98; --sec: #03DAC6;
  --text: #fff; --gold: #FFD700; --danger: #CF6679; --warn: #FF9800;
  --success: #00C853; --push-color: #FF6B6B; --pull-color: #4ECDC4;
  --legs-color: #95E1D3; --cardio-color: #3498db; --nimble-color: #5BB98B;
  --rest-color: #555;
  /* alias layer (P-series groundwork) */
  --accent: var(--sec);
  --surface: var(--card);
  --border: rgba(255,255,255,0.04);
  --text-muted: #888;
  --radius: 14px;
  --shadow: 0 2px 12px rgba(0,0,0,0.3);   /* ORPHAN — zero `var(--shadow)` consumers */
  --accent-weak: rgba(3,218,198,0.30);     /* teal low-alpha: focus ring (P5), ghost-hover (P2) */
}
```
**Already done (P1–P5):** `--primary` neutralised from Material Purple `#BB86FC` → slate `#8A8F98` (kills the Material-pair AI tell); `--accent/--surface/--border/--text-muted/--radius/--accent-weak` aliases added; `.card` box-shadow **removed** (flat hairline border, `:61-65`).

---

## 2. Token map — CURRENT → TARGET

Teal is **locked** (`--sec` stays `#03DAC6`). Graphite values below are a proposed ramp — the **one place needing design sign-off**; everything else is mechanical.

| token | current | target | notes |
|---|---|---|---|
| `--bg` | `#121212` (near-black) | **graphite** `#16181C` | base canvas → graphite, not pure black |
| `--card` / `--surface` | `#1e1e1e` | **graphite-raised** `#212429` | one step up from bg |
| (new) `--surface-2` | — (inline `#2c2c2c`, `#1a1a1a`) | `#2A2E34` | replaces ad-hoc inline surfaces (set-active `#2c2c2c`, nav `#1a1a1a`) |
| `--border` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.06)` | hairline, slightly stronger on graphite |
| `--text` | `#fff` | `#F2F4F7` | off-white (less glare on graphite) |
| `--text-muted` | `#888` | `#9AA0A6` | unify the many inline `#888`/`#666` |
| `--primary` | `#8A8F98` (slate) | **retire as a color**; secondary buttons → `--surface-2` + teal text | slate was only an anti-Material patch; graphite system has no purple/slate accent role |
| `--sec` / `--accent` | `#03DAC6` (teal) | **`#03DAC6` — KEEP (locked)** | the single accent |
| `--accent-weak` | `rgba(3,218,198,0.30)` | keep | focus ring / ghost hover |
| `--gold` | `#FFD700` | **retire → `--amber`** | see §3; only consumer is `.progression-badge` (`:151`) → recolor to `--success`/teal |
| (new) `--amber` | — | **`#FFB020`** | **2nd tone — streaks + joint/niggle flags ONLY** (§3) |
| `--success` | `#00C853` | keep (or `#3DD68C` to sit with graphite) | done-states |
| `--danger` | `#CF6679` | keep | |
| `--warn` | `#FF9800` | **fold into `--amber`** | warn ≈ amber; avoid two ambers |
| `--push/pull/legs/cardio/nimble-color` | 5 distinct hues | **collapse → neutral + teal accent** | competing rainbow (§4.1) |
| `--rest-color` | `#555` | `--text-muted` | |
| `--shadow` | `0 2px 12px rgba(0,0,0,0.3)` | **delete (orphan)** | no consumers; graphite system is flat |
| `--radius` | `14px` | keep | |

**New tokens to add for "mechanical" downstream:** `--surface-2`, `--amber`, plus type tokens (§5): `--font-display`, `--font-body`, `--font-mono`.

---

## 3. The amber 2nd tone — scope discipline
- Introduce **`--amber: #FFB020`**, used in **exactly two places**: **streak indicators** and **joint/niggle flags**. Nothing else.
- **Retire `--gold` (#FFD700):** its only token consumer is `.progression-badge` (`:151`, the "↑ UP" Smart-Spotter badge) — that's a *success* signal, so recolor it to `--success`/teal, **not** amber.
- **Fold `--warn` (#FF9800) into `--amber`** so there's a single warm tone.
- **Current state of amber's two scopes:** both are mostly **future** — there is no streak feature yet, and the niggle/joint-flag UI is specced but unbuilt (`_spec_quickstart_rework.md` §B7 / `_spec_plan_adaptation.md`). So amber is introduced now as the reserved token; its consumers land with those features. Guard against amber leaking into general accenting (that's teal's job).

---

## 4. Competing / legacy palettes (collapse into the new system)

### 4.1 Workout-type rainbow (5 hues)
`--push-color #FF6B6B · --pull-color #4ECDC4 · --legs-color #95E1D3 · --cardio-color #3498db · --nimble-color #5BB98B` drive `.day-bubble.workout-type-*` (e.g. `:193`) and banner icons. **Target:** drop the rainbow — day-types render in graphite with a single **teal** accent for the active/today state (type conveyed by icon + label, not hue). Removes a 5-color competing palette.

### 4.2 Garmin / Recovery NEON theme (off-token — biggest tell)
The Recovery/Garmin section is a **separate hardcoded palette** that never touches `:root`: neon green `#00ff9d` + cyan `#00d4ff`, e.g. `.recovery-score` (`:333-342`, a **72px gradient-clipped neon number**), `.metric-value` (`:376-381`, `#00ff9d`), `.ai-recommendation` (`:382-393`), `.workout-adjustment` (`:399`), `.file-item` (`:402-414`). **Target:** retoken to graphite + teal; the recovery score becomes a solid-teal **JetBrains Mono** figure (kill the gradient text-clip). This is the single largest reskin surface.

### 4.3 Decorative multi-color gradients (20 total)
`linear-gradient` count = **20**; **none are null** (no same-token `var(--sec)…var(--sec)`). But several are vibe-y decoration: purple hero `#667eea→#764ba2` (today-banner + ~4 cards), pink/coral `#f093fb→#f5576c`, `#4facfe→#00f2fe`, neon `#00ff9d→#00d4ff`. **Target:** flatten to graphite surfaces; reserve gradients (if any) for a single subtle teal accent. Net direction: ~20 → near-0 decorative gradients.

### 4.4 Alias layer
`--accent/--surface/--border/--text-muted/--radius/--accent-weak` are the new foundation (keep/extend). `--shadow` is an **orphan** (delete).

---

## 5. Typography — CURRENT → TARGET
- **Current:** body = system stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (`:53`). **No webfonts** — zero `@font-face`, zero `fonts.googleapis`, no Archivo/Hanken/JetBrains. `font-family: monospace` (generic keyword) is used **ad-hoc** on `.recovery-score` (`:336`), `.metric-value` (`:379`), `.file-item` (`:410`), device-id (`:1497`), rawData (`:1791`).
- **Target tokens (add to `:root`):**
  - `--font-display: 'Archivo', sans-serif;` → headings (`h1/h2/h3`, card titles, version badge).
  - `--font-body: 'Hanken Grotesk', sans-serif;` → `body` + all prose.
  - `--font-mono: 'JetBrains Mono', monospace;` → **ALL numbers/data**, replacing every `font-family: monospace` AND extending to currently-unmono numeric UI: rest-timer display, set weight×reps inputs/labels, exercise counts ("N exercises found"), adherence "done/total" (`:5767`), "Week N" label (`:5754`), recovery score/metrics, history figures.
- **Loading:** add the three families (self-host or `fonts.googleapis` `<link>` in `<head>`, before `:34` `<style>`). **Net-new** — nothing to migrate, just add + point the three tokens. Keep the system stack as the fallback in each token.

---

## 6. Tells to KILL — status

| Tell | Status in live | Action |
|---|---|---|
| **Glassmorphism** (`backdrop-filter` blur) | **Already absent** — 0 `backdrop-filter`; `.card` shadow removed (P3) | none (verify nav/modals stay flat) |
| **Stacked soft shadows on cards** | `.card` flat; remaining shadows are modals/FAB/notification/focus-ring only | keep functional shadows; ensure no card-level soft shadow returns |
| **Null gradients** (`…var(--sec)…var(--sec)…`) | **None** (20 gradients, all distinct stops) | none |
| **Universal transitions** (`* { transition }`) | **None** — `*` is box-sizing only; transitions are scoped (`:92`, `:864`) | none |
| **Gradient-clipped neon text** | `.recovery-score` (`:339-342`) | **kill** → solid teal mono figure |
| **Neon green legacy palette** (`#00ff9d`) | Recovery/Garmin section (§4.2) | **retoken** to graphite+teal |
| **FAB pulse glow** (teal `box-shadow` keyframe) | `:878-879` | review — soften/remove the pulsing glow (borderline tell) |
| **Rainbow type colors** | workout-type 5-hue palette (§4.1) | collapse to neutral + teal |
| **Material default pair** (`#BB86FC`+`#03DAC6`) | **Already killed** (P1: primary→slate) | retire slate entirely in graphite system |

The three named tells (glassmorphism, null gradients, universal transitions) are **already dead** in live — the real remaining reskin work is the **neon Garmin theme**, the **workout-type rainbow**, **decorative gradients**, **amber introduction**, and the **font system**.

---

## 7. Foundation build order (mechanical, from this map)
1. **Add target tokens** to `:root`: graphite ramp (`--bg/--card/--surface/--surface-2/--text/--text-muted/--border`), `--amber`, `--font-display/body/mono`; delete `--shadow`; retire `--primary`/`--gold`/`--warn` (fold per §2/§3). Teal `--sec` untouched.
2. **Load the 3 webfonts**; point body→`--font-body`, headings→`--font-display`, replace every `font-family: monospace` → `--font-mono` and extend mono to all numeric/data nodes (§5).
3. **Retoken the Garmin/Recovery section** (§4.2) off `#00ff9d`/`#00d4ff` onto graphite+teal; kill the gradient-clip.
4. **Collapse the workout-type rainbow** (§4.1) to neutral + teal active.
5. **Flatten decorative gradients** (§4.3).
6. Amber consumers (streaks, niggle flags) land with their features (§3).

Each step is a find-and-replace against this table — no design decisions left except the graphite hex ramp (§2) and the exact amber, both flagged for sign-off.

---

## 8. Summary
- **Live `:root`** already half-reskinned (slate primary, alias layer, flat cards). Teal `--sec` is the locked accent and stays.
- **Current → target** mapped in §2: graphite ramp replaces near-black bg/card; `--amber #FFB020` added (streaks/joint-flags only); `--gold`/`--warn`/`--primary` retired; `--shadow` deleted (orphan); workout-type rainbow + neon Garmin palette collapsed.
- **Tells:** glassmorphism / null gradients / universal transitions are **already absent**; the live tells to kill are the **neon Garmin theme**, **gradient-clipped text**, **rainbow type colors**, **decorative gradients**, and the **FAB pulse**.
- **Type:** no webfonts today (system stack + ad-hoc `monospace`); add Archivo / Hanken Grotesk / JetBrains Mono and route all numbers/data through mono.
- Only two values need design sign-off (graphite hex ramp, exact amber); everything else is a mechanical find-and-replace.

---

*Signed off — T5, terminal pts/T5, 2026-06-14 21:54 AEST (11:54 UTC). Read-only: no edits, no git, index.html untouched.*
