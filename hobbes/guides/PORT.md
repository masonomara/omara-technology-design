# Port — stand Hobbes up on a new client

The runbook for dropping the `hobbes/` system into another project. Do this once per client, in order. It hands off to `SETUP.md` at the end for the GitHub/PSI wiring.

The system is built to travel: the engine (`tools/*.py`) and the workflows carry **zero** client hardcoding — everything client-specific lives in `hobbes.toml` and the human-owned `.md` files. Porting is therefore a **scrub + reset**, not a rebuild. The one trap is copying the folder by hand and carrying the source client's secret and history along with it. This list closes that trap.

Legend: **scrub** = must remove or you leak/bloat · **reset** = must rewrite or a stale fact steers a decision wrong · **verify** = prove it's clean before the first run.

## 1. Make the clean copy — *scrub*

Copy `hobbes/` into the new repo, then delete these from the copy. Every one is either a secret, a stale fact, or dead weight:

- [ ] `tools/.psi-key` — **the previous client's live PSI key.** Gitignored, so `git clone` skips it — but a folder copy carries it. Delete first.
- [ ] `cycle/` — the previous client's baseline/crawl/PSI history. The bulk of the folder. Empty it completely.
- [ ] `CHANGELOG.md` body — keep the file and heading, delete the entries.
- [ ] `tools/__pycache__/` — stale bytecode, wrong Python tags.
- [ ] `.DS_Store` (and any nested ones).

One command from the new repo root after copying:

```
rm -f hobbes/tools/.psi-key hobbes/.DS_Store
rm -rf hobbes/cycle/* hobbes/tools/__pycache__
```

(`.gitignore` inside `hobbes/` is self-contained — it already ignores `.psi-key`, `__pycache__`, and `cycle/*/raw/`. You do **not** edit the host repo's root `.gitignore`.)

## 2. Fix the two stray client strings — *scrub*

Everything client-specific is supposed to live in the human-owned files (step 3). Two strings escape that and must be hand-fixed:

- [ ] `guides/SYSTEM.md` — a diagram label hardcodes the previous site's domain. Replace with the new site (or a generic "LIVE SITE").
- [ ] Re-grep to be sure nothing else slipped in (see step 5).

## 3. Reset the human-owned files — *reset*

These five are marked "Human-owned" at the top for exactly this reason: Hobbes reads them, never writes them, and they get rewritten per client. Nothing else defines the client.

- [ ] **`hobbes.toml`** — the config every tool reads. Set `[client]` (name / site / platform / run_by), replace the `[[golden_path]]` pages with 3–4 representative URLs for the new site, set `[cycle].timezone` and `sample_path`. This is the single most important file — wrong URLs here and every cycle measures the wrong pages.
- [ ] **`MISSION.md`** — new mission, priorities (baseline→target), active builds. Strip Hazel's priorities.
- [ ] **`CONTEXT.md`** — new business, users, people/roles, access locations, hard constraints.
- [ ] **`DEVELOPMENT.md`** — new stack and build rules. Hazel's is Shopify/Dawn-specific; a non-Shopify client rewrites this wholesale.
- [ ] **`CHANGELOG.md`** — already emptied in step 1; leave it ready for the first cycle line.

`CLAUDE.md` at the repo root is **identical across every client** by design — copy it as-is, do not customize it. Client-specifics belong in `CONTEXT.md`/`DEVELOPMENT.md`, never in `CLAUDE.md`.

## 4. Wire the client — *hand off to `SETUP.md`*

- [ ] Follow `guides/SETUP.md` end to end: local prereqs (Python ≥3.11, SiteOne crawler, `$PSI_API_KEY`) and the five one-time GitHub steps (two repo secrets, install the Claude app, allow Actions to open PRs, create the `published` label, merge the workflow files to the default branch).
- [ ] Copy `.github/workflows/hobbes-*.yml` into the new repo — they carry no client data, but confirm the anyway with the grep below.

## 5. Verify it's clean — *verify*

Run from the new repo root. All three should come back empty / passing before the first cycle:

- [ ] **No previous-client strings survive.** Replace `OLDCLIENT` with the domain/name you're porting away from:
  ```
  grep -rin "OLDCLIENT" hobbes/ .github/workflows/ ; echo "exit: $?"
  ```
  Expect no matches. (A clean run prints nothing.)
- [ ] **No secret rode along:**
  ```
  test -e hobbes/tools/.psi-key && echo "LEAK: delete it" || echo "clean"
  ```
- [ ] **The engine reads the new config.** With `$PSI_API_KEY` exported:
  ```
  python3 hobbes/tools/cli.py status
  ```
  It should resolve the new `hobbes.toml` (new client name, new golden-path URLs) and report no cycle yet — then you're ready for the first `cli.py cycle`.

## Done means

New client's config loads, the golden path points at the new site, no previous-client string or secret survives the grep, and `status` runs clean. Then `SETUP.md`'s first-run step fires the first real cycle.
