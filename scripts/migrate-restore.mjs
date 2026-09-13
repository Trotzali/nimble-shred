#!/usr/bin/env node
// WP-MAC-MIGRATION-TOOLING — migrate-restore.mjs
//
// Adapted 2026-09-13 from the tjk-civil reference implementation, trimmed
// down for this repo's thin manifest (no .env.local, no data-file items, no
// hardcoded-Windows-path scripts to check — this repo has neither .bat/.ps1
// tooling nor any tracked C:\Users\admin reference, confirmed by the
// 2026-09-13 audit's `git grep`). Runs on macOS (pure Node — no bash-isms —
// so it also runs unchanged on Windows/Linux if ever needed for testing).
//
// Takes a migrate-pack.mjs archive and unpacks it into a freshly-cloned
// target repo: the local Vercel project link, and Claude Code's own
// per-machine memory to the NEW path-keyed project folder computed from the
// target clone's own absolute path.
//
// Usage:
//   node scripts/migrate-restore.mjs <pack.zip.enc>              restore into the repo this script lives in
//   node scripts/migrate-restore.mjs <pack.zip.enc> --target DIR restore into DIR instead (testing / explicit target)
//   node scripts/migrate-restore.mjs <pack.zip.enc> --dry        decrypt + plan only, write nothing
//
// Idempotent: safe to re-run. Files identical to what's already there are
// left alone and reported UNCHANGED; only genuinely different/missing files
// are written.
//
// NOTE (Rule 1): this script's mechanical logic (decrypt, extract, path-key
// computation, file writes) inherits verification already done against the
// tjk-civil reference implementation on Windows. What is NOT verified here,
// because no Mac was available when this was written, is macOS-specific
// behaviour: whether Claude Code on a real Mac actually names its
// project-memory directory the way computeClaudeProjectKey() predicts.
// Flagged as needing first-real-run verification on the Mac.

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";

import {
  findRepoRoot, loadConfig, claudeMemoryDir,
  computeClaudeProjectKey, promptPassword, decryptBuffer, formatBytes,
} from "./lib/migrate-common.mjs";

const require = createRequire(import.meta.url);
const AdmZip = require("adm-zip");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const HELP = args.includes("--help") || args.includes("-h");
const targetFlagIdx = args.indexOf("--target");
const TARGET_OVERRIDE = targetFlagIdx >= 0 ? args[targetFlagIdx + 1] : null;
const packPath = args.find((a) => !a.startsWith("--") && a !== TARGET_OVERRIDE);

if (HELP || !packPath) {
  console.log(`
migrate-restore.mjs — unpack a migrate-pack.mjs archive into a fresh clone

  node scripts/migrate-restore.mjs <pack.zip.enc>              restore into the repo this script lives in
  node scripts/migrate-restore.mjs <pack.zip.enc> --target DIR restore into DIR instead
  node scripts/migrate-restore.mjs <pack.zip.enc> --dry        decrypt + plan only, write nothing
`);
  process.exit(packPath ? 0 : 1);
}

function writeIfDifferent(destPath, data, log) {
  const exists = existsSync(destPath);
  if (exists) {
    const current = readFileSync(destPath);
    if (Buffer.isBuffer(data) ? current.equals(data) : current.toString("utf8") === data) {
      log.push({ status: "UNCHANGED", path: destPath });
      return;
    }
  }
  if (!DRY) {
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, data);
  }
  log.push({ status: exists ? "UPDATED" : "CREATED", path: destPath });
}

async function main() {
  const packAbsPath = packPath;
  if (!existsSync(packAbsPath)) {
    console.error(`FATAL: pack file not found: ${packAbsPath}`);
    process.exit(1);
  }

  const targetRoot = TARGET_OVERRIDE ?? findRepoRoot();
  if (!existsSync(join(targetRoot, ".git"))) {
    console.error(`FATAL: ${targetRoot} doesn't look like a git repo (no .git) — pass --target <freshly-cloned-repo-dir>.`);
    process.exit(1);
  }
  loadConfig(targetRoot); // validates config is present/well-formed even though not otherwise used here

  console.log(`Pack:       ${packAbsPath}`);
  console.log(`Target:     ${targetRoot}`);
  console.log(DRY ? "Mode:       DRY RUN — will decrypt + plan, write nothing\n" : "Mode:       restore\n");

  const password = await promptPassword("Archive password: ");
  const encBuf = readFileSync(packAbsPath);
  let plainZip;
  try {
    plainZip = decryptBuffer(encBuf, password);
  } catch (e) {
    console.error(`FATAL: could not decrypt (${e.message}) — wrong password, or not a nimble-shred migrate-pack archive.`);
    process.exit(1);
  }
  console.log(`Decrypted OK: ${formatBytes(encBuf.length)} -> ${formatBytes(plainZip.length)}\n`);

  const zip = new AdmZip(plainZip);
  const entries = zip.getEntries().filter((e) => !e.isDirectory);

  // ── Restore each entry to its target destination ──
  const memDir = claudeMemoryDir(targetRoot);
  const log = [];
  for (const entry of entries) {
    const name = entry.entryName;
    const destPath = name.startsWith("claude-memory/")
      ? join(memDir, name.slice("claude-memory/".length))
      : join(targetRoot, name);
    writeIfDifferent(destPath, entry.getData(), log);
  }

  console.log("RESTORE:");
  for (const l of log) console.log(`  [${l.status.padEnd(9)}] ${l.path}`);
  console.log();

  // ── Verification checklist ──
  console.log("═══════════════════════════════════════════════════════════");
  console.log("VERIFICATION CHECKLIST");
  console.log("═══════════════════════════════════════════════════════════\n");

  const vercelProjectPath = join(targetRoot, ".vercel", "project.json");
  console.log(`.vercel/project.json: ${existsSync(vercelProjectPath) ? "present" : DRY ? "would be installed (DRY)" : "MISSING"}`);
  console.log();

  const memMdPath = join(memDir, "MEMORY.md");
  const claudeKey = computeClaudeProjectKey(targetRoot);
  console.log(`Claude memory: project key computed as "${claudeKey}"`);
  console.log(`  target dir: ${memDir}`);
  console.log(`  MEMORY.md ${existsSync(memMdPath) ? "present" : DRY ? "would be installed (DRY)" : "MISSING"}`);
  if (existsSync(memDir)) {
    const count = readdirSync(memDir).filter((f) => f.endsWith(".md")).length;
    console.log(`  ${count} .md fact file(s) present`);
  }
  console.log();

  console.log("Manual steps still owed (nothing here can be scripted):");
  console.log("  1. Claude Code: fresh login expected — ~/.claude/.credentials.json was deliberately");
  console.log("     never packed (never move auth credentials between machines).");
  console.log("  2. Vercel: `vercel login`, then `vercel link` (uses the restored .vercel/project.json");
  console.log("     to skip the prompts). No `vercel env pull` needed for THIS repo — the nimble-shred");
  console.log("     Vercel project holds zero env vars (confirmed 2026-09-13); every real secret lives");
  console.log("     in the separate nimble-shred-backend project/repo, which this pack does not cover.");
  console.log("  3. `cd scripts && npm install` — only needed if you intend to run migrate-pack.mjs");
  console.log("     again from the new machine (adm-zip/archiver live in scripts/node_modules, never");
  console.log("     packed — platform-specific binaries anyway).");
  console.log("  4. Load index.html locally or via the dev preview URL and confirm it renders — no");
  console.log("     .env rebuild is needed for this repo either way.");
  console.log();

  console.log(DRY ? "[DRY] Nothing written. Re-run without --dry to actually restore." : "Done.");
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
