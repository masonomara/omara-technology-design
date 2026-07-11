# Setup — once per client

How to stand Hobbes up. First fill the per-client config (`hobbes.toml`, below). Then set up **local** (run the deterministic cycle on a laptop) and/or **cloud** (the automated GitHub runner). Local alone captures a baseline by hand. The cloud runner fires measure + fix together into one PR. Hobbes writes only to GitHub — branches, PRs, comments. Every deploy/go-live action stays human.

## Configure the client (`hobbes.toml`)

The per-client config every tool reads. Fill it once:

- **Identify the client.** Set the `[client]` block — name, site, platform, who runs it. (The fuller picture — goals, people, constraints — lives in `hobbes/CONTEXT.md`.)
- **Lock the golden path.** Pick 3–4 important, representative pages with exact URLs. Give each a short `label` and add them as `[[golden_path]]` entries. Reuse the same URLs every cycle so results stay comparable. (`label` is optional — omit it and it's derived from the URL.)
- **Method is PSI.** The cycle runs the PageSpeed Insights API the same way every cycle so numbers stay comparable. Local Lighthouse is the fallback only for URLs PSI can't reach — a draft, localhost, or staging URL. Never mix PSI and local scores in one baseline. (Full method in `hobbes/guides/BASELINE.md`.)

## Local setup — the engine on your machine

To run `python3 hobbes/tools/cli.py cycle` (baseline → findings) on a laptop:

- **Python ≥ 3.11** — stdlib only (`tomllib`). Nothing to pip-install.
- **SiteOne crawler** on `PATH` — the whole-site crawl. macOS: `brew install janreges/tap/siteone-crawler` (or the desktop GUI app).
- **PSI key** — the `$PSI_API_KEY` env var (`export` it for the run). Get one: Google Cloud Console → enable *PageSpeed Insights API* → Credentials → API key.
- **First run:** `python3 hobbes/tools/cli.py cycle` → a dated `hobbes/cycle/<date>-<letter>/` folder (the letter lets more than one cycle share a day). `python3 hobbes/tools/cli.py status` shows which stage it reached.

The agent stages (plan / execute) can run as local Claude Code instead of the cloud action. No secret needed. It uses your login.

## GitHub setup at a glance

Five one-time steps. Each prevents a real, specific failure. The right-hand column is the error you get if you skip it.

| # | Where | What | Error it prevents |
|---|---|---|---|
| 1 | Settings → Secrets and variables → Actions | Add secrets **`PSI_API_KEY`** + **`CLAUDE_CODE_OAUTH_TOKEN`** | PSI exits "No PSI key"; the agent fix can't auth |
| 2 | github.com/apps/claude | **Install the Claude GitHub App** on this repo | `401 — Claude Code is not installed on this repository` |
| 3 | Settings → Actions → General → Workflow permissions | Check **"Allow GitHub Actions to create and approve pull requests"** | `GitHub Actions is not permitted to create or approve pull requests` |
| 4 | terminal | **`gh label create published`** | the `review` phase never fires |
| 5 | git | **Merge the workflow files to the default branch** | dispatch / label triggers never run |

Details below.

## 1. Two repo secrets

**Secrets never live in the repo.** They go in GitHub as repo secrets (cloud) and as env vars (local).

| Secret | What it is | Where to get it | Cloud (GitHub) | Local |
|---|---|---|---|---|
| `PSI_API_KEY` | Google PageSpeed Insights key | Google Cloud Console → enable *PageSpeed Insights API* → Credentials → API key | repo secret | `export $PSI_API_KEY` |
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code **subscription** token (Pro/Max) — drives the agent fix in the cycle. **Not** a pay-per-token API key | run **`claude setup-token`** locally, copy the token | repo secret | not needed (local Claude Code uses your login) |

**Settings → Secrets and variables → Actions → New repository secret**, add both by the exact names. A headless runner has no Claude login. So the cycle's agent step needs the subscription token stored as a secret — but it's your subscription, **never an Anthropic API key**. The deterministic measurement (and the `review` workflow) use no Claude — only PSI.

## 2. Install the Claude GitHub App  *(agent auth)*

The cycle's agent step runs `claude-code-action`. It authenticates its GitHub work by exchanging an **OIDC token** for the **Claude GitHub App's** token. The app must be installed on the repo or that exchange returns `401 — Claude Code is not installed on this repository`.

1. Open **https://github.com/apps/claude** → **Install** (or **Configure** if already on your account).
2. **Only select repositories** → tick **this repo** → **Install**.
3. Verify: **github.com/settings/installations** → **Claude** → Configure → the repo is in its list.

(`/install-github-app` from Claude Code does the same thing. The matching `id-token: write` permission is already in `hobbes-cycle.yml`. No action needed.)

## 3. Let Actions open pull requests

The `cycle` workflow opens its PR with the built-in `GITHUB_TOKEN`. A repo policy blocks that by default.

**Settings → Actions → General → Workflow permissions** → check **"Allow GitHub Actions to create and approve pull requests"** → **Save.** (Leave the read/write radio as-is. The workflows declare their own `permissions:`.) Skip it and you get `GitHub Actions is not permitted to create or approve pull requests` *after* a full run — wasted minutes.

## 4. Create the `published` label

The `review` phase fires when you add a **`published`** label to a merged PR — your explicit "it's live now" signal (merge ≠ live, and it varies per client). Create it once.

```
gh label create published --description "Site is live — fire the Hobbes review" --color 0e8a16
```

Per release: merge the fix PR → publish/deploy the site live on your platform → **add `published` to the PR**. The review re-baselines the **live** site and comments the before/after. Label it *only after* it's actually live, or you measure the old site.

## 5. Workflows on the default branch

GitHub runs `workflow_dispatch` workflows only from the **default branch**. Merge the `.github/workflows/hobbes-*.yml` files to `main` before anything can fire.

> **Gotcha:** a `pull_request` event (the `published` label) runs the workflow **and tool code from that PR's own branch**, frozen at branch-creation. So fix the engine *before* opening a fix PR. If you patch the engine after a PR exists, re-run its review with the manual escape hatch: **Actions → "Hobbes review" → Run workflow**, input the PR number — that runs `main`'s current code.

## 6. First run

- **Actions → "Hobbes cycle" → Run workflow** (blank budget = the `hobbes.toml` default). It measures, then plans and writes the fix → **one PR** with the scorecard/findings *and* the code change, plus a GitHub email. (Needs all of steps 1–3 + 5.)
- Run it again whenever you want a fresh cycle. There's no cron. It fires on demand.

## Already wired in the workflow YAML — you don't touch these

The engine handles these. They're listed so you know they're covered:

- `permissions: contents/pull-requests/id-token: write` on each workflow.
- the cycle's agent step: `claude_args --allowedTools Edit,Read,Write,Glob,Grep,Bash` + `GH_TOKEN` (so the agent can edit, commit, and open the PR).
- SiteOne crawler install resolves the versioned release asset from the API (the asset name carries the version).

## Recurring vs one-time

| Step | Cadence |
|---|---|
| Client config + local + GitHub setup above | **once** per client |
| Add the `published` label after each go-live | **every release** (fires the review) |
| Review + publish PRs | **every cycle** (the human gate) |
| Rotate a key | only on exposure |
