# Execution — YYYY-MM-DD

Site: [url] · Cycle: [YYYY-MM-DD] · Branch: [feature-branch] · Driven by Hobbes from `03-plan.md`.

This is the doing stage, where the system stops describing and starts building. It takes the plan's ordered systems, picks a batch that fits an effort budget, writes a code-level plan against the real codebase, builds it, then stops and pushes the branch for human review.

It is the most agent-driven stage and the only one that writes to the repo, so it is the most tightly bounded. Two hard limits: it spends only the effort budget, and it never publishes. Merging the branch and deploying the live site are a human's call (the CLAUDE.md hard line: only the named human publishes, never without sign-off, see `CONTEXT.md`). Execution ends at push for review. Not one step past it.

## Where this sits

`baseline` (numbers) → `findings` (problems) → `plan` (systems, ordered by leverage) → `execute` (build the top of the order) → `publish` (release it). Execution ends with a branch pushed and a PR open for review. It hands that to `publish`, which owns the human gate, the merge, and the go-live. Execution builds and verifies. It never takes the site live itself.

## 1. Select the batch — the effort budget

The plan already ordered every system by leverage. Execution draws a line on that list where the budget runs out.

- Set a budget `B`, the effort points to spend this cycle. The default lives in `hobbes.toml` (`[cycle] effort_budget`) and a run can override it through the execute workflow input. It is the dial for how much to take on. A small `B` ships one tight PR. A large `B` takes on more. Lean large. A thin batch wastes the run.
- Walk `03-plan.md` top-down, adding up each system's effort. Draw the line where the next system won't fit the budget left. The systems above the line are the batch.
- Stay greedy on leverage. The plan ordered by it. Respect that. Don't split a coupled block to squeeze in points. If a later system fits the remainder and stands on its own, pull it up. But don't shoehorn, and don't break a batch that holds together.
- Record the budget, the systems chosen, the effort spent, and what's left for a later cycle.

> Worked example (`B = 20`, ordered plan): SYS-1 (2) + SYS-2 (2) + SYS-3 (3) + SYS-4 (2) + SYS-5 (3) + SYS-6 (3) + SYS-7 (4) = 19. SYS-8 (3) won't fit the 1 that's left. The batch is the top seven. The code side of every system in the batch ships in one PR. The parts that need a human (content at scale, a call on pulling a third-party integration) are flagged for the human, not dropped.

## 2. Research & write the implementation plan

> Study **[selected systems]** closely. Learn how each one works. **[selected systems]** need to be improved. Write a detailed plan for doing it. Research with **web search** and the **context7 MCP**: the stack's framework and library docs through context7 (per `DEVELOPMENT.md`), integration config and current specifics through the web. Include code snippets. **Read the real source files before you propose any change. Base the plan on the codebase, not on guesses.** End with a todo list covering every phase and task the work needs.

Write the plan to `04-execute.md` in the cycle folder. Each task names the system or finding ID it closes, so the line back to `02-evaluation.md` stays traceable.

## 3. Implement

> When the plan is done, build all of it. As you finish each task or phase, **mark it done in `04-execute.md`**. Don't stop until every task and phase in the batch is done. Don't add needless comments or doc-blocks. Hold to the project's type discipline, and run the project's checker as you go so you don't add new problems.

**Clear the whole batch. Don't quietly ship a part of it.** The budget already bounded the work. Once a system is in the batch, it gets built this run. A clean code change you just didn't reach is not a deferral. Finish it. (Past runs stopped at two systems out of caution and under-delivered. Don't.)

**Write what you can. Defer only what you truly can't. Three buckets, not two:**

1. **Ship it.** Self-contained code you can write and reason about from the source. Write it.
2. **Write it, flag it for review.** Code you can write from the source but can't verify without a browser: a layout or CSS tweak, a change that moves the DOM, an a11y attribute whose effect needs axe. Don't defer these. The review gate is where browser checks happen. Write the best fix you can and flag it in `04-execute.md` and the PR as **"needs browser confirmation at review,"** naming what to check (say, confirm the a11y rule reads 0 on the affected page and device, confirm the section doesn't shift). Lean toward writing it. A flagged fix a human checks beats a finding that sits for cycles.
3. **Hand to a human.** Work a GitHub-only, no-browser run can't do: content at scale (copy, image re-exports, per-item alt), integration and paid-service calls, platform-bound items with no code path, sign-offs, and code that needs the **rendered DOM to even know what to change** (not just to verify it) or that risks real regression if written blind (say, pulling a critical render-path asset off the critical path). Name each in `04-execute.md` and the PR with its reason **and its owner**.

The test between bucket 2 and bucket 3: *can you write a correct, self-contained change from the source alone?* If yes, write it and flag it for a check (2). If you'd be guessing at what to change without seeing the rendered page, hand it off (3). When in doubt, choose 2.

**Fix the pattern, not just the flagged case. Sweep the whole codebase.** Findings are measured on the golden-path pages (PSI) and a crawl sample, so they name only the cases that showed up there. A pattern finding — missing `alt`, an icon-only button with no accessible name, an unlabeled link, an unsized `<img>`, a skipped heading level — almost always recurs in files the measurement never touched. Before you call a pattern finding done, **grep the whole codebase for every instance and fix them all in one pass.** Image-alt is not one component. It is every `<img>` the codebase renders: cards, carousels, upsells, hero, every partial. Fix only the flagged file and you ship a nibble, the finding comes back next cycle from another page, and you never converge. **One pattern, one full sweep, done**, so it can't return from a corner you skipped.

## Quality gates — from `DEVELOPMENT.md`, not hardcoded

The done-means bar belongs to the stack, and it lives in `DEVELOPMENT.md`. Read it. The gate is **no *new* offenses from this change**, not zero offenses. A real repo carries old ones, and a zero-offense gate would block every PR forever. Diff the checker output against the base, not against zero. Mapped to whatever `DEVELOPMENT.md` says the stack is:

- **Run the stack's checker as you go** (per `DEVELOPMENT.md`), the role typecheck plays elsewhere. The bar is **no new offenses in the files you touched**. Old ones elsewhere are out of scope.
- **Browser checks are the human's, at review.** The agent can't run a browser in CI. It writes against the source. The mobile and desktop pass and the no-new-console-errors check happen at review, and every bucket-2 change is flagged for exactly that.
- **Hold to the stack's constraints** (per `DEVELOPMENT.md`): self-contained changes, overrides in the place set aside for them, few core-file edits, any upgrade-safety rule, and never hand-editing generated config.
- **No regression** against the `01-baseline.md` targets.
- **No needless comments.** Match the style of the file around you.

> A seed prompt written for one stack (say "no any/unknown types · run typecheck," which is TypeScript) maps to: hold to whatever type discipline the stack has and run whatever checker it has, both per `DEVELOPMENT.md`. Don't carry a gate the stack can't run. Use the real one.

## 4. Stop and hand off — with the baseline before/after in the PR

When the batch is built and the gates pass, **stop.** Don't merge, and don't deploy the live site. That's the `publish` stage, and a human owns it. Push the feature branch and open the PR. The PR body must carry the **baseline before/after**, not just a prose summary:

- **Before.** For every finding the batch closes, its current measured value from this cycle's `01-baseline.md` and `02-evaluation.md` (say, a11y 88 on mobile, 73 pages missing a meta description), and the target it should hit. This is the state before the fix, captured before the PR opens.
- **After (measured) comes after publish. It has to.** PSI and the crawl only measure the live site, and the fix isn't live until a human publishes, so the true after can't be known at PR time. It lands in the review's before/after comment once the change is live (the review re-baselines the live site and diffs it against this cycle's baseline). The 28-day CrUX field part confirms in a later review still. Don't invent an after from local guesses or unpublished previews.
- **What shipped.** The systems built this run, each naming the finding and system IDs it closes.
- **Human to-do.** The actions only a person can take, a checkbox list grouped by owner. Execution writes only code. Everything else the cycle surfaced lands here, so the PR is a full handoff, not a code drop with the rest lost. Write each as `- [ ]` so it can be ticked off, and give each one the action, the owner, the finding or system it closes. Always cover:
  - **Publish** (every PR, owner: the human publisher named in `CONTEXT.md`). Merge → deploy to a preview or staging environment → check mobile and desktop → go live → add the `published` label. (Steps in `05-publish-template.md`.)
  - **Browser-confirm** (the human owner, at review). Every bucket-2 change written but not yet verified, with exactly what to check.
  - **Content** (the owners named in `CONTEXT.md`). The copy to write, images to re-export, alt to author, admin settings to change.
  - **Integration / platform** (the owners named in `CONTEXT.md`). Third-party config changes, paid-service calls, platform-bound items (say, a hosting support request).

That open PR **is** the handoff to `publish`. Execution is done. The cycle closes only after publish takes it live and the next baseline confirms the after.

## Pointers

Execution runs mostly off `03-plan.md`, the ordered batch. The rest is context it reaches for as the work needs it. `raw/` is break-glass only.

- `03-plan.md` — the main input: the ordered systems this batch is drawn from.
- `02-evaluation.md` / `01-baseline.md` — what each task closes, and the targets to hold.
- `MISSION.md` — the priorities plan rated impact against. Hold to them on any judgment call inside a system.
- `DEVELOPMENT.md` — the stack and the real done-means gates.
- `CONTEXT.md` — who owns the non-code work: content, integration and platform calls, sign-off.
- `raw/` — break-glass only: the capture JSON, reached for when `02-evaluation.md` isn't enough to write a fix. Default to the catalog. Drop to raw only when it falls short.
