# _spec_workflow.md — W0: dev-branch + preview-deploy workflow

**Status:** ACTIVE from 2026-07-15. Supersedes the old "commit straight to main" habit.
**Why:** GitHub Pages serves `main` = **live production**. Until now every build pushed
straight to `main`, so untested code went live the moment it was committed. That ends here.

---

## 1. The rule (non-negotiable)

1. **All `index.html` builds commit to `dev` only.** Never to `main`.
2. **Troy device-tests the `dev` preview URL** (real phone, real conditions).
3. **On "all green" from Troy**, T1 promotes `dev` to `main` (fast-forward only).
4. **`main` is production. Nothing lands there without a device test.**

Docs/data-only commits (specs, `.md`, JSON assets) may still go to `main` directly —
they cannot break the app. Anything that touches `index.html` follows the rule above.

---

## 2. Branches

| branch | role | hosting |
|---|---|---|
| **`main`** | **production** — device-tested code only | GitHub Pages (live) + Vercel production |
| **`dev`** | integration — all builds land here first | Vercel **preview** URL (auto per push) |
| `master` | dead legacy branch (v61, pre-reconcile). **Ignore. Do not use.** | — |

---

## 3. Build loop (T1)

```bash
git checkout dev
git pull --ff-only origin dev
# ...make the build (index.html), bump the version badge...
git add index.html
git commit -m "vNNN <what changed>"
git push origin dev          # -> triggers an automatic Vercel preview deploy
```
Then hand Troy the preview URL and **wait**. Do not promote unprompted.

---

## 4. Promote (only after Troy says "all green")

```bash
git checkout main
git merge --ff-only dev
git push origin main         # -> production (GitHub Pages + Vercel production)
git checkout dev             # always return to dev
```

### If `--ff-only` fails — STOP
A failed fast-forward means `main` has commits `dev` doesn't (histories diverged).

- **STOP and report.** Show the error.
- **NEVER** `--force` / `--force-with-lease`.
- **NEVER** `rebase`.
- **NEVER** `merge` without `--ff-only` to "make it work".

Wait for instructions. A divergence is a signal that something unexpected happened
(a hotfix on main, another terminal, a stale clone) — it needs a human decision, not a
clever git command.

---

## 5. Preview hosting — how it is wired (done 2026-07-15)

The Vercel CLI was already installed (v50.42.0) and authenticated as `trotzali`, so the
project was created via CLI. **No dashboard steps are needed** — this is already live.

| setting | value |
|---|---|
| Vercel project | **`nimble-shred`** (`prj_xLC8k0Ok4Kpw6d6yQufREE4UiKIm`) |
| Scope / owner | `troys-projects-06daedf7` (Troy's projects) |
| Git repo | `https://github.com/Trotzali/nimble-shred` (connected) |
| Framework Preset | **Other** |
| Build Command | none (repo has no `package.json` — nothing is built) |
| Root / Output Directory | **`.`** (repo root; no `public/` dir exists) |
| Production branch | `main` |
| Preview | **every push to `dev`** gets an automatic preview deployment |

**Preview URL:** each push to `dev` produces a unique deployment URL, plus a stable
branch alias of the form `nimble-shred-git-dev-<scope>.vercel.app`. Get the current one
any time with:

```bash
vercel ls nimble-shred          # list deployments (newest first)
```
or from the Vercel dashboard → project `nimble-shred` → Deployments → the `dev` branch entry.

**Serving model:** plain static site. Vercel serves the repo root, so `index.html` is
served at `/` — identical to how GitHub Pages serves `main`. No build step means the
preview is a byte-for-byte copy of what production will get on promote.

### Hands off
- **`nimble-shred-backend`** is a **separate** Vercel project (its own repo at
  `Projects\nimble-shred-backend`). The W0 setup did **not** touch it. Never point this
  project at that repo, and never reconfigure it from here.
- `.vercel/` (local link file: project/org IDs) is git-ignored — do not commit it.

### If the project ever needs re-creating in the dashboard
Import the repo → **Framework Preset: Other** → **Build Command: leave empty / off** →
**Output Directory: leave empty (serves root)** → Deploy. Then Settings → Git → confirm
Production Branch = `main`; every other branch (incl. `dev`) auto-previews.

---

## 6. Why fast-forward only

`--ff-only` guarantees `main` is **exactly** the commits Troy device-tested on `dev` —
no merge commit, no reordering, no rewritten history, no surprise. If it can't
fast-forward, the thing you tested is not the thing you'd be shipping. That's precisely
when to stop.

---

**Sign-off:** T1 | 2026-07-15
