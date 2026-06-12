# Spec — GymVisual GIF hosting migration

**Type:** Read-only implementation spec. No code changed, no git, `index.html`
untouched. Anchors are line + selector (re-anchor by name; lines drift).

## 0. Context (from `_media_buy_list_final.md` + live code)
- **202 live exercises.** Today **96 have a GIF** via **third-party hotlinks**
  (`fitnessprogramer.com`, `inspireusafoundation.org`) hard-coded in the inline
  `const exerciseMedia` (index.html **L3097**). 106 are gaps.
- Buying GymVisual covers them: **buy 85 → 96 + 85 = 181/202**; 21 via swap/custom
  (`_media_buy_list_final.md` §1–2). GymVisual = **commercial license, NO
  redistribution** → the GIF files **cannot live in the public GitHub repo**.
- Goal: self-host the licensed GIFs on our own storage, re-point the media map at
  them, preserve the GIF→YouTube fallback, and (via #14) end up with each exercise
  showing **its own** clip.

> **Licensing boundary (applies throughout):** self-host only assets we are
> licensed to use — the **GymVisual purchases + the 2 commissioned customs**. The
> **96 existing hotlinks are third-party**; do **not** re-host (copy) those into
> our bucket (that would be redistributing someone else's asset). Either leave them
> hotlinked, or replace them over time with purchased GymVisual equivalents. The
> bucket holds *licensed* files only.

---

## 1. Host recommendation — **Supabase Storage** (over Cloudflare R2)

**Footprint:** ~181 files × ~1 MB ≈ **~181 MB** storage; bandwidth = ~1 MB per
GIF view (mitigated by browser HTTP cache + CDN; the app also caches the *URL* in
`localStorage` via `loadPreloadedImages`, L3260 — note: caches the URL string, not
the bytes, so it doesn't cut egress, only re-fetch churn).

| | Supabase Storage | Cloudflare R2 |
|---|---|---|
| In our stack? | **Yes** — same project as cloud sync (`SUPABASE_CONFIG`, L19) | No — new account/dashboard |
| Public-read URLs | Public bucket → `…/storage/v1/object/public/<bucket>/<file>` out of the box | r2.dev dev URL or a **custom-domain binding** needed |
| Storage cost (~181 MB) | Free tier ~1 GB; trivial. Overage ≈ $0.021/GB-mo | Free tier ~10 GB; trivial. Overage ≈ $0.015/GB-mo |
| Egress | **Charged** beyond free tier (~$0.09/GB) | **$0 egress, always** ← R2's one real edge |
| Bulk upload | Dashboard drag-drop (multi-file), or CLI | Dashboard / `wrangler` / S3 API |
| Solo-dev simplicity | **Highest** — one dashboard, drag-drop, instant public URL | More setup (public binding / domain) |

**Pick: Supabase Storage.** For a solo dev at ~181 MB with a modest userbase, it's
already in the stack (no new account, same dashboard as the existing sync),
public buckets hand you public-read URLs with zero custom-domain work, and 181 MB
is nothing against the free storage tier. R2's only advantage — free egress —
doesn't bite at this scale (≈1 MB GIFs, browser/CDN cache, small audience).
**Scale trigger to revisit R2:** if the app reaches thousands of DAU streaming
GIFs and monthly Supabase **egress** becomes a real line item, migrate the bucket
to R2 (free egress) — the re-point is a one-line `MEDIA_BASE` change (§3), so the
host stays swappable. *(Verify current Supabase/R2 pricing at build time; figures
above are directional as of 2026-06.)*

---

## 2. Naming convention — `slug(canonicalName) + ".gif"`

A **pure function** of the exercise name (no lookup table): the JS and the upload
both derive the same filename, so there's one source of truth.

```js
function slug(name){
  return name.toLowerCase()
    .replace(/['’]/g, '')        // drop apostrophes:  World's → worlds
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alnum → one hyphen (handles space ( ) / , - etc.)
    .replace(/^-+|-+$/g, '')     // trim leading/trailing hyphens
    .replace(/-+/g, '-');        // collapse repeats
}
```

Worked examples (the apostrophe / paren / slash cases called out):
| exercise name | filename |
|---|---|
| `90/90 Hip Switch` | `90-90-hip-switch.gif` |
| `World's Greatest Stretch` | `worlds-greatest-stretch.gif` |
| `Cable Chest Fly (High)` | `cable-chest-fly-high.gif` |
| `Cable Hip Abduction (Standing)` | `cable-hip-abduction-standing.gif` |
| `L-Sit (Tuck)` | `l-sit-tuck.gif` |
| `Romanian Deadlift (DB)` | `romanian-deadlift-db.gif` |
| `Prone Y-T-W Raise` | `prone-y-t-w-raise.gif` |
| `A-Skips` | `a-skips.gif` |

**Verified over the 164 live canonical names: 164 distinct slugs, zero real
collisions.** The one apparent clash — `Farmer's Walk` vs `Farmers Walk` →
`farmers-walk` — is an existing **alias pair** (`mediaAliases` L5928 already maps
`"Farmers Walk" → "Farmer's Walk"`). That's the rule, not a bug:

> **Slug the CANONICAL key only.** `getExerciseMedia` (L5933) resolves
> `mediaAliases[name] || name` *first*; only the resolved canonical name gets a
> hosted file/slug. Alias names (and reused-variant gaps, e.g. "Wide Grip Push-up"
> → "Push-ups" per the hybrid plan) intentionally point at the canonical file via
> `mediaAliases` — they get **no** file of their own. This keeps the file set =
> the distinct purchased/custom GIFs (~64–85 + 2 custom), not 202.

**Alternative (zero-rename upload):** name files by the **GymVisual ID**
(`366813.gif`, already mapped in the buy list) and store `id` per entry instead of
deriving from slug. Rejected as the primary scheme — opaque names, and it only
covers purchased GIFs (customs/reused need their own naming anyway) — but it's the
least-effort upload if renaming 85 files is a chore (see §4). If chosen, §3's
`gifUrl` becomes `MEDIA_BASE + entry.id + ".gif"`.

---

## 3. `exercise_media.js` re-point

### Current structure (all inline in index.html)
- `const exerciseMedia = { "<name>": {gif:"<url>", yt:"<url>"}, … }` — **L3097**
  (header comment claims "from exercise_media.js"; there is **no such file** — it's
  inline. Optional: externalize to a real `exercise-media.js` like
  `exercise-metadata.js`, but not required for this migration.)
- `const mediaAliases = { … }` — **L~5900**, name→canonical.
- `getExerciseMedia(name)` — **L5933**: `key = mediaAliases[name]||name` →
  `exerciseMedia[key]` → else `localStorage 'gif_'+name` → else `null`.
- `loadPreloadedImages()` — **L3260**: seeds `localStorage 'gif_'+name` from each
  entry's `.gif` (URL cache).
- Render: detail/workout card uses `media.gif` in an `<img onerror="…hide…">` and
  shows the `media.yt` link separately (per `_audit_links.md`).

### What changes
**(a) Add a base + derive the hosted URL** (one place to swap hosts later):
```js
const MEDIA_BASE = "https://wytyvtvmupsmtgjbcybc.supabase.co/storage/v1/object/public/exercise-gifs/";
// slug() from §2
function hostedGif(name){ return MEDIA_BASE + slug(name) + ".gif"; }
```
**(b) Mark which canonical names are self-hosted** (the licensed set), and have
`getExerciseMedia` build the URL — so we don't hand-maintain 181 literal URLs:
```js
const HOSTED = new Set([ /* canonical names we uploaded: the 85 buys + 2 customs (+ any re-hosted) */ ]);

function getExerciseMedia(name){
  const key = mediaAliases[name] || name;
  if (HOSTED.has(key)) return { gif: hostedGif(key), yt: (exerciseMedia[key]?.yt) || null };
  const media = exerciseMedia[key];
  if (media) return media;                                  // legacy hotlink entry (unchanged)
  const gif = localStorage.getItem('gif_' + name);
  return gif ? { gif, yt: null } : null;
}
```
This is the **minimal, mechanical T1 change**: add `MEDIA_BASE`/`slug`/`hostedGif`,
populate `HOSTED` with the canonical names you uploaded, and (for new gap exercises
that had no entry) ensure they're either in `HOSTED` or carry a `yt`. Existing
hotlink entries stay until replaced. *Simpler-but-verbose alternative:* skip
`HOSTED` and just edit each migrated entry's `gif:` to `hostedGif("<name>")` and
add the 85 new `{gif:hostedGif(...), yt:...}` literals.

**(c) Fallback chain — preserved (and tightened):**
1. **own hosted GIF** (`HOSTED` → `hostedGif`), else legacy entry `.gif`, else
   `localStorage gif_`;
2. on `<img onerror>` (or no gif) → **YouTube**: the entry's specific `yt` if
   present, else a **search fallback** `https://www.youtube.com/results?search_query=<name>+exercise+form`
   (the `_audit_links.md` Option-5 enhancement — turns a missing/broken GIF into a
   never-dead link instead of nothing). Keep the existing onerror-hide; add the
   search-URL default where `yt` is null.
`mediaAliases`, `loadPreloadedImages`, and the render sites need **no structural
change** — `getExerciseMedia` stays the single entry point.

**Do NOT** point `HOSTED`/bucket URLs at the 96 third-party hotlinks (licensing,
§0). Migrate those to GymVisual files only as you purchase/replace them.

---

## 4. Upload workflow (user) + license note

1. **Supabase dashboard → Storage → New bucket** `exercise-gifs`, **Public**
   (public read). Public buckets are **not directory-listable** — objects are only
   reachable by exact path, which is the "private-ish bucket, public object URLs"
   posture the task wants.
2. **Name the files** before upload: rename each purchased GIF to `slug(appName).gif`
   (§2) — e.g. GymVisual `366813.gif` (DB Floor Press) → `db-floor-press.gif`. A
   tiny rename step against the buy list's `name → ID` map; or, if skipping renames,
   upload as-is and use the **ID scheme** (§2 alt) in `HOSTED`/`gifUrl`.
3. **Bulk upload:** drag the (~85 + 2) renamed files into the bucket in the
   dashboard (multi-file drag-drop). For repeatability, the Supabase CLI / a
   service-key script also works, but drag-drop is fine at this count.
4. **Verify** a few public URLs in a browser: `…/object/public/exercise-gifs/db-floor-press.gif`
   renders; the bucket **root** is not browsable (403/empty).

**License note (the boundary that makes this OK):**
- **Acceptable:** serving the licensed GIFs to *your app's users* from a public-read
  object URL — that's ordinary web-asset delivery, not redistribution.
- **Not acceptable:** committing the GIF files to the public GitHub repo (that
  publishes the asset library in a downloadable form = redistribution).
- **If GymVisual's terms are stricter** (no public URLs at all): use Supabase
  **signed URLs** (time-limited) generated via the backend proxy instead of a
  public bucket — `getExerciseMedia` then fetches a short-lived URL. Heavier; only
  if the license demands it. **Confirm the exact license tier's redistribution
  clause before go-live.**

---

## 5. Phasing (one build-category each) + test gates

### Phase A — Hosting setup  (USER, no code)
Create the public bucket, name + bulk-upload the licensed GIFs (§4).
**Gate:** 3 sample public URLs render in a browser (incl. a tricky slug —
`90-90-hip-switch.gif`, `worlds-greatest-stretch.gif`); bucket root not listable;
total uploaded count == buy count (e.g., 85 + 2).

### Phase B — Media-map re-point  (T1, one code category)
Add `MEDIA_BASE` + `slug` + `hostedGif`, populate `HOSTED`, add any missing gap
entries' `yt`, wire the YouTube **search fallback** (§3). Bump version.
**Gate:** for the migrated exercises, the detail + active-workout cards show the
**hosted** GIF (spot-check ≥10 across packs incl. parens/apostrophe/`90/90` names);
a known gap with no GIF shows a YouTube link (specific or search), never a broken
image; `mediaAliases` pairs (e.g. Push-ups→Push-up) still resolve; no new
console-404 storm beyond documented gaps; `localStorage gif_` cache still seeds.

### Phase C — Wrong-clips #14 audit closure  (QA/content category)
With each exercise now pointing at **its own** GymVisual GIF, re-run the
`_audit_links.md` findings: **A** (dead `Cable Lateral Raise` URL) and **C** (the
13 shared/borrowed clips — Cable Squat showing a barbell squat, etc.) are resolved
by the dedicated files; remove the interim aliases that pointed a move at a *wrong*
clip; reconcile the remaining 21 swap/custom items per the buy list.
**Gate:** every exercise's GIF visually matches its name — spot-audit the
previously-13 duplicate-ID moves + the 1 dead URL + the 5 placeholder cardio
entries; `_audit_links.md` A & C marked closed; any still-uncovered moves
documented (YouTube-only) rather than showing a borrowed clip.

**Sequence rationale:** A (assets exist) must precede B (URLs resolve) must precede
C (can only verify "right clip" once the right files are live). Each phase is
independently shippable; B is the only `index.html` edit and is mechanical.

— T4, 2026-06-11 20:47 (+10:00)
