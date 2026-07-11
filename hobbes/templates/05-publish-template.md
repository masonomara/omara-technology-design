# Publish — YYYY-MM-DD

Site: [url] · Cycle: [YYYY-MM-DD] · Branch / PR: [link] · Released by [human].

This is the release stage, the only stage that touches the live site. Execution built and verified the work on a branch and opened a PR. Publish takes that reviewed work live. Going live is irreversible and faces the public, so this stage is human-owned. Hobbes assists, but a human reviews, signs off, and publishes. The CLAUDE.md hard line lives here.

## Where this sits

`baseline` → `findings` → `plan` → `execute` (branch + PR ready) → `publish` (PR review → sign-off → merge → go live) → `review` (automatic, after publish: re-baseline the live site and comment the before/after on the PR) → back to `baseline` for the next cycle.

## The hard line — read before anything

Publish reaches the things Hobbes may **not** do alone (CLAUDE.md): publish to the public, change the live site, merge nontrivial work to `main`. So Hobbes's role here is bounded:

- **Hobbes may:** summarize the PR, answer review comments, make requested code changes (looping back through the `execute` gates), and draft the `CHANGELOG.md` entry. Hobbes writes only to GitHub. It never runs the deploy: no platform CLI, no live push, no publish.
- **Only a human may, and only on explicit sign-off:** merge to `main`, and deploy the live site. Only the named human (per `CONTEXT.md`) publishes, never without sign-off. Hobbes never runs the live publish itself, and never assumes a past approval carries to this release.

If you're unsure whether a step is over the line, it is. Stop and hand it back.

## The steps

1. **Review.** Open the PR for the human. Summarize what shipped, the finding IDs it closes, what was verified (the stack's checker clean, mobile and desktop), and what's left to a human (content at scale, a call on pulling a third-party integration). Address review comments. Any code change loops back through the `execute` quality gates before it's offered again.

2. **Sign-off.** The code owner signs off on the code. Where the change is brand-visible, layout, type, motion, anything a visitor sees, the brand owner signs off too. They own brand and the final sign-off (`CONTEXT.md`). Don't merge brand-visible work without their nod.

3. **Merge.** On sign-off, merge the branch to `main`, the source of truth.

4. **Preview on staging** (the human owner, in the platform, outside Hobbes). Deploy to a preview environment, never straight to live. Line up any platform-generated config so the platform's editor and the deploy don't overwrite each other (per `DEVELOPMENT.md`). Check mobile and desktop on the preview.

5. **Go live, human only.** The named human deploys the live site. Hobbes does not run this step. Right after, check the live site on mobile and desktop, then add the `published` label to the PR. That label is the it's-live-now signal that fires the `review` phase. (Add it before the change is live and you'd measure the old site.)

6. **Close the loop.** Draft the `CHANGELOG.md` entry: what shipped, why, the finding IDs closed, the result. (`MISSION.md` is human-owned. Hobbes never edits it. A closed gap is recorded by the scorecard and `06-review.md`, not by rewriting the mission.) The `published` label from step 5 fires the review phase (`.github/workflows/hobbes-review.yml`): `hobbes/tools/publish-review.py` re-captures the live site into the cycle's `raw-review/`, `hobbes/tools/review.py` diffs it against the cycle's pre-publish `01-baseline.md`, and the result (`06-review.md`) is commented on the PR. Read it by latency. Alt, heading, and meta crawl counts and lab a11y and SEO scores move at once. Field and CrUX run on a 28-day average and won't show for weeks. The next regular cycle confirms them. A finding isn't done because it was coded. It's done when the baseline shows it gone.

## Pointers

- `04-execute.md` / the PR — what's being released.
- `DEVELOPMENT.md` — the deploy mechanics: the platform CLI, preview first, only the named human publishes, don't break the live site.
- `CONTEXT.md` — who signs off: the code owner on code, the brand owner on anything brand-visible.
- `CHANGELOG.md` — the entry publish drafts to close the loop. (`MISSION.md` is human-owned: Hobbes reads it, never writes it.)
