# Scheduling `migrate-pack.mjs --auto`

WP-MAC-MIGRATION-TOOLING's continuous-protection mode for Nimble Shred: a nightly,
non-interactive, encrypted pack of the two things a `git clone` won't carry over for
this repo — `.vercel/project.json` and Claude Code's own per-machine memory folder.
Adapted from the tjk-civil reference implementation (`C:\Users\admin\tjk-civil\scripts\schedule-pack.md`).

## Prerequisite (either OS)

`--auto` refuses to run without a password file — it can't prompt into a scheduled task
with no terminal attached. Create it once:

```
node scripts/migrate-pack.mjs --set-password
```

This writes `.migrate-pack.secret` at the repo root (gitignored, `chmod 600` where the OS
supports it). Losing this file just means the NEXT `--set-password` picks a new one — it
doesn't affect any pack already written, since the password was already burned into that
pack's own AES key at write time.

## Windows — Task Scheduler (current, while still on Windows)

1. Open Task Scheduler → **Create Task…** (not "Basic Task" — need the extra
   trigger/condition tabs).
2. **General** tab: name it `Nimble Shred — migrate-pack`. Run whether user is logged on
   or not, if you want it to fire even when locked.
3. **Triggers** tab → New → Daily, pick a time (e.g. 23:35 — offset from tjk-civil's
   23:30 run so the two don't fight over the same minute), Enabled.
4. **Actions** tab → New → Start a program:
   - Program/script: `node`
   - Add arguments: `scripts/migrate-pack.mjs --auto`
   - Start in: `C:\Users\admin\Projects\Nimble-Shred` (the repo root — required, or the
     script's relative config/output-file lookups resolve against the wrong directory)
5. **Conditions** tab: uncheck "Start the task only if the computer is on AC power" if
   this is a laptop and you want it to still fire on battery.
6. OK, then right-click the task → Run, once, to confirm it actually writes a pack (check
   `G:\My Drive\Dev Vault\nimble-shred\backups\`).

## macOS — launchd (after the move)

No `.plist` is committed yet for this repo (tjk-civil's is repo-specific, not reusable
as-is). To add one: copy `com.tjkcivil.migrate-pack.plist` from tjk-civil, rename it
`com.trotzali.nimble-shred-migrate-pack.plist`, and update:
- the `Label` key to match the new filename
- both path placeholders to this repo's real absolute path on the Mac (`pwd` from
  inside the clone)
- the log paths (e.g. `/tmp/nimble-shred-migrate-pack.log` / `.err.log`)

Then:
1. `cp com.trotzali.nimble-shred-migrate-pack.plist ~/Library/LaunchAgents/`
2. `launchctl load ~/Library/LaunchAgents/com.trotzali.nimble-shred-migrate-pack.plist`
3. Force one run immediately to confirm it works, rather than waiting for the trigger
   time: `launchctl start com.trotzali.nimble-shred-migrate-pack`
4. Check the log paths set in the plist and the Drive vault folder for the new pack.
5. `launchctl list | grep nimble-shred` shows it's loaded; a non-zero "last exit code"
   there means the previous run failed — check the log.

To stop/uninstall: `launchctl unload ~/Library/LaunchAgents/com.trotzali.nimble-shred-migrate-pack.plist`.

## Either OS — verifying it's actually protecting you

Rotation keeps the newest `retentionCount` (currently 7, in
`scripts/migrate-pack.config.json`) archives in the vault and deletes older ones
automatically — don't hand-manage that folder. To sanity-check a pack without touching
the real repo, decrypt it with `migrate-restore.mjs --target` pointed at a throwaway
scratch directory instead of the real clone.
