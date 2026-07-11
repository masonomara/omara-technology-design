# Plan — YYYY-MM-DD

Site: [url] · Cycle: [YYYY-MM-DD] · Authored by Hobbes from `02-evaluation.md` + `01-baseline.md` + `raw/`.

This is the plan, where the system goes from deterministic extraction to judgment. Baseline and findings are built by tools and repeat exactly. The plan is Hobbes thinking. It sits between two documents and is neither of them:

- `02-evaluation.md` is the problem catalog: every problem, deterministic, no fix and no weighting. The plan groups those problems into systems and rates them.
- Execution, the next stage, does the work top-down through the order the plan sets. The plan doesn't write the fix line by line. It understands each system well enough to estimate effort and impact and tell execution where to start.

Two runs of the plan may differ. Judgment isn't deterministic. The one hard rule: invent nothing. Every system maps to real finding IDs from this cycle. The facts (the findings) stay apart from the calls (your effort and impact ratings), and you own the calls.

## Inputs — read all, in depth, before grouping

- `02-evaluation.md` — the problems to group. Every system cites its finding IDs.
- `01-baseline.md` — the numbers, the targets, and the field-vs-lab reality (§C CrUX may already pass where the lab fails, and that changes impact).
- `raw/` *(break-glass)* — go deeper on a finding when grouping or effort needs more than the catalog shows. Default to the catalog. Drop to raw only when it falls short.
- `MISSION.md` — what impact is rated against: the priorities in their stated order, the mission line, and "Needs work". This file decides what matters.
- `DEVELOPMENT.md` — the stack side of effort and feasibility. Is the fix authorable in the code we control, or does it live in content, a third party, or a platform the cycle can't reach. How hard against the stack's constraints — core-file risk, generated config, the browser gate, any upgrade-safety rule. And the done-means bar each system must clear.
- `CONTEXT.md` — what effort and feasibility are rated against on the people side: which kind of work each fix needs (code, content/admin, integration or platform config, sign-off) and who `CONTEXT.md` names for it, plus the hard constraints that gate it (platform limits, the brand bar and whose sign-off brand-visible work needs, accessibility as a standing requirement). This is what "the resources we have" means.

> The three files map onto the two scores. Impact ← `MISSION.md` (what matters). Effort and feasibility ← `DEVELOPMENT.md` + `CONTEXT.md` (what it costs: the stack's reality and the people behind it). Read all three. A plan that rates impact without the mission, or effort without the stack and the people, is guessing.

## The method — four phases

Read findings, raw, and baseline in depth first. Understand each problem, what it does and all its specifics, before grouping anything. Then:

1. **Group.** Cluster the findings into systems, by same problem, similar problem, cascading dependency, or coupled cause. A system is the set of findings one body of work would handle together. Systems cut across the finding domains. A missing-alt system spans A11Y and SEO. A heading system spans A11Y and SEO with one cascading root. Understand each system: the shared root cause, and what one fix would clear. Cite the finding IDs.

2. **Effort.** Estimate what each system costs to fix, a 1–5 call against `DEVELOPMENT.md` (the stack) and `CONTEXT.md` (the people). Weigh: is it authorable in the code we control, or does it live in content, a third party, or a platform the cycle can't reach (`DEVELOPMENT.md`). How hard against the stack's constraints — core-file risk, generated config, the browser gate, any upgrade-safety rule (`DEVELOPMENT.md`). Which kind of work it needs and who owns it — code, content/admin, integration or platform config, sign-off — each mapped to the person `CONTEXT.md` names. How complicated it is, and how much we already know against how much we still have to dig into. When a hard constraint gates a system — not code-authorable, breaks an upgrade-safety rule, needs brand sign-off — name it. It sets the owner and can sink the system to won't-chase whatever its raw score.

3. **Impact.** For each system, estimate the impact of fixing it, a 1–5 call against `MISSION.md`: which priority it advances, whether it serves the mission directly, and how many findings and pages one fix clears. Weigh the field-vs-lab reality. A perf fix matters less to real users where CrUX already passes.

4. **Order.** Rank the systems by priority score and pass the ordered list to execution, highest leverage first.

## Scoring

The two scores read from different files. Keep them apart, so a cheap fix can't inflate its impact and a mission-critical one can't hide its cost.

- **Impact (1–5)**, against `MISSION.md`. `5` = clears a Priority-1 gap (whatever `MISSION.md` ranks first), or a cross-cutting root whose one fix cascades across many findings and pages. `3` = a real golden-path gap that advances a lower priority. `1` = cosmetic, platform-bound, or already fine for real users (the field passes).
- **Effort (1–5, cost)**, against `DEVELOPMENT.md` (the stack: code-authorable? how hard given the constraints? browser-gated?) and `CONTEXT.md` (which kind of work, who owns it, what access, whose sign-off). `5` = long, complex, and needs scarce resources (client content at scale, an integration removal plus coordination, or a risky core change). `1` = a token tweak or one self-contained change shipped in minutes. Name the resource. A system that needs *the client to write dozens of product descriptions* is a different cost than one a developer fixes in code.
- **Priority = Impact ÷ Effort**, the leverage. High impact, low cost, first.

> Why divide, not multiply: impact × effort ranks the hardest work first — a 5×5 monster above a 5×1 quick win — and buries the quick wins worth shipping. Leverage is the ratio.

## Output — the shape of `03-plan.md`

One block per system, then the ordered table.

```
### SYS-<n> · <system name>
- **Findings:** <A11Y-6, A11Y-7, SEO-3 — the IDs this system covers>
- **The system:** <what binds them — shared root cause, the cascade, what one fix clears>
- **Effort:** <n>/5 — <time · which resource (code / content / integration or platform config / sign-off) · complexity · confidence>
- **Impact:** <n>/5 — <mission priority served · findings & pages cleared · field-vs-lab caveat>
- **Priority:** <impact>/<effort> = <x.x>
```

Then:

```
## Order (highest leverage first)

| Rank | System | Impact | Effort | Priority | Do-first because |
|---|---|---|---|---|---|
| 1 | SYS-3 · … | 5 | 1 | 5.0 | clears 3 a11y findings sitewide, one snippet |
| 2 | … | | | | |
```

Every finding in the cycle lands in exactly one system, none dropped, none invented. If a finding isn't worth acting on (platform-bound, benign), it still gets a system, or a won't-fix note with the reason, so coverage stays visible and never goes silent.

## The handoff

The ordered table is what execution consumes. It works the systems top-down, proving each one against the `hobbes/guides/BASELINE.md` targets and the `DEVELOPMENT.md` done-means bar before moving on. After publish, the review re-baselines the live site and diffs it against this cycle's baseline. Closed findings and any regressions tell you whether the plan worked.

## Pointers

- `02-evaluation.md` — the problems this plan groups (cite the IDs).
- `01-baseline.md` — the numbers and the field-vs-lab context.
- `MISSION.md` — what impact is rated against: the priorities and the mission line.
- `DEVELOPMENT.md` — the stack behind every effort and feasibility call: code-authorable or not, core and upgrade-safety risk, the done-means bar.
- `CONTEXT.md` — the people, access, and hard constraints behind every effort estimate and every gated system.
