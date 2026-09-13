# BRINGUP.md — Nimble Shred (+ backend)

## Two repos, two purposes
- `Projects\Nimble-Shred` (this repo) — the app. Static `index.html`, vanilla JS, no
  build step, no `package.json` at repo root (the migration tooling under `scripts/`
  has its own, deliberately isolated — see below). Deploys via GitHub Pages (`main`,
  live) + Vercel (project `nimble-shred`, preview-per-push on `dev`). Zero server-side
  secrets of its own — confirmed via `vercel env ls`, no env vars set on this project.
- `Projects\nimble-shred-backend` — separate repo, separate Vercel project
  (`nimble-shred-backend`), holds every real secret this stack uses (Gemini, Garmin
  OAuth, Supabase, Google OAuth client). Serves the AI chat proxy (`/api/drive`), Garmin
  sync, and a built-but-not-yet-wired AI rehab-assistant endpoint (`/api/rehab`) that's
  the named template for a planned `/api/coach`. Never point either repo's Vercel
  project at the other's GitHub repo. Holdfast is a flavor of *this* repo
  (query-param-selected, `_spec_holdfast.md`), not a separate app or backend — it will
  share `nimble-shred-backend` once/if AI features are flavor-wired.

## Git-ops model
T1 is sole writer / does all git operations. Troy device-tests `dev` previews; T1 never
promotes to `main` unprompted.

## Dev-branch promote workflow (ACTIVE since 2026-07-15 — see `_spec_workflow.md`)
1. All `index.html` builds commit to `dev` only. Never `main`.
2. Push `dev` → Vercel auto-previews it. Hand Troy the preview URL. Wait.
3. Only on "all green" from Troy: `git checkout main && git merge --ff-only dev && git push`.
4. `--ff-only` fails → STOP, report, wait for a human call. Never force, never rebase.
5. `master` branch is dead legacy (pre-2026-07-15). Ignore it.

Docs/tooling-only commits (specs, `.md`, JSON assets, and non-app scripts that can't
touch what Vercel/Pages serve) may go straight to `main`. In practice, if `dev` is
already ahead of `main` by anything, commit there first and fast-forward `main` up to
match — never create two branches with unique commits each, since that breaks
`--ff-only` for the *next* real promote. (This is how the 2026-09-13 doc/tooling commits
below were done: on `dev`, immediately ff-promoted to `main`, both pushed.)

## Resume rule
No in-flight WP/build state was on record for this repo as of the 2026-09-13
Mac-migration audit. Treat a fresh session as scoped-prompt: ask what the next build
target is rather than assuming continuation of anything.

## Mac migration / laptop-loss protection (installed 2026-09-13)
- **GitHub** = code (both repos, redundant by design).
- **Vercel** = all secrets (confirmed: `nimble-shred` has zero env vars of its own;
  `nimble-shred-backend` holds all of them — see its own repo notes for the key list).
- **Google Drive** (`torquaytroy@gmail.com`, Drive for Desktop, `G:\My Drive\`) = the
  nightly encrypted pack of the one thing that survives neither git nor Vercel: this
  repo's own Claude Code memory folder + the local Vercel project link.
- Pack/restore tooling lives under `scripts/` (`migrate-pack.mjs`, `migrate-restore.mjs`,
  `lib/migrate-common.mjs`, `migrate-pack.config.json`, `schedule-pack.md`) — same
  pattern as the reference implementation in `tjk-civil`, config-shaped, thin manifest
  for this repo (no `.env.local`, no untracked real data — both confirmed absent at
  audit time; the 22–23 previously-untracked spec/audit docs were committed to git
  directly instead of relying on the pack for them — see `_spec_workflow.md`-adjacent
  commits dated 2026-09-13).
- **`scripts/package.json` is deliberately isolated** (its own `node_modules/`, not
  repo-root) so Vercel's zero-config build detection for the deployed static site never
  sees it — adding a root-level `package.json` risked Vercel auto-running an install/build
  step that doesn't exist today ("Build Command: none" per `_spec_workflow.md` §5).
- Password (`.migrate-pack.secret`, repo-root, gitignored): set via
  `node scripts/migrate-pack.mjs --set-password`, run by Troy out-of-band, never by an
  agent. Write it down somewhere that isn't this laptop.
- If a *new* untracked file with real local-only data ever shows up (check
  `git status --ignored --porcelain`), add it to `getPackItems()` in
  `scripts/lib/migrate-common.mjs` — the manifest is intentionally thin right now, not
  exhaustive by construction.

## Gotchas (from this repo's own history)
- **Garmin integration is dormant scaffolding, never live**: the Garmin developer
  application was never approved (no response from Garmin) — this was never a working
  integration anywhere, not something that broke. `GARMIN_CONSUMER_SECRET` is absent
  from the `nimble-shred-backend` Vercel project as of 2026-09-13 (confirmed via
  `vercel env ls` — `GARMIN_CONSUMER_KEY` is present, the secret isn't), consistent with
  that. If Garmin work resumes, it needs a fresh developer-portal approval, not just a
  re-provisioned secret. Otherwise, removing the Garmin UI/endpoints entirely (frontend
  `garmin-*` elements + backend `api/garmin-*.js`) is a candidate future cleanup WP, not
  an urgent fix. Also present and deliberately left alone: two junk Vercel env keys
  literally named `Name`/`Value` on the same project — Troy will delete those himself
  in the dashboard.
- `nimble-shred-backend`'s `api/vercel.json` is silently ignored by Vercel (not at repo
  root) — routing is filesystem-based; don't "fix" its legacy `@secret` syntax expecting
  it to matter.
- `nimble-shred-backend` previously had a fake `.gitignore` — a file named `api/gitignore`
  (missing the leading dot, one directory too deep) that did nothing. Fixed 2026-09-13
  with a real root `.gitignore`. No secret ever leaked through the gap (verified via full
  history scan), but don't assume old advice about that repo's ignore rules is current.
- Gemini free tier on the backend: 20 requests/day on `gemini-2.5-flash`. Default
  rehab-assistant test run uses `--offline`; live runs burn quota fast and the daily
  reset is midnight Pacific (17:00 AEST), not "retry in Ns" as the upstream error implies.
- Prep-build convention (parallel CC sessions on this repo): one standalone file per
  task, `index.html` read-only during prep, no version bump, commit locally — see
  project memory (`nimble-shred-prep-build-conventions`).

## Verify block
- `git status` clean on both repos; `git log` matches GitHub on both `main` and `dev`.
- `vercel projects ls` shows both `nimble-shred` and `nimble-shred-backend` under
  `troys-projects-06daedf7`.
- Load `index.html` locally / via the `dev` preview URL, confirm it renders and the
  Garmin/AI-chat UI paints (backend calls succeed — no local `.env` rebuild needed for
  either repo; every secret already lives in Vercel).
- Ask Claude Code something only the memory folder would know — confirms `memory/`
  landed at the Mac-path-keyed folder (`scripts/lib/migrate-common.mjs`'s
  `computeClaudeProjectKey()`), not just where a script assumes.

## Ready-when
Both repos cloned, `vercel whoami` shows `trotzali`, a `dev`→preview round-trip has been
confirmed at least once on the new machine, and `node scripts/migrate-restore.mjs`
against the newest pack in `G:\My Drive\Dev Vault\nimble-shred\backups\` reports the
Claude memory folder and `.vercel/project.json` both restored.
