#!/usr/bin/env python3
"""
hobbes CLI — runs the cycle stages and reads the filesystem state machine.

  cycle      baseline (--fresh) -> findings            (the deterministic patrol)
  baseline / findings                                 (individual cycle steps)
  status     report which stage the newest cycle is at
  plan / execute   print the stage prompt + inputs for an agent (Claude Code)
  publish-review   re-baseline the LIVE site into the cycle's raw-review/ (post-publish)
  review           diff the cycle's pre-publish 01-baseline.md vs raw-review/ -> 06-review.md

  publish-review + review are NOT part of the cycle. A cycle measures the current
  site. It has no "after" to compare — this cycle's fix isn't live yet. The
  before/after lives in the REVIEW phase (hobbes-review.yml), which re-baselines
  the live site after a publish and diffs against the cycle's pre-publish baseline.

USAGE: python3 hobbes/tools/cli.py <command> [args passed through to the tool]
"""

import subprocess
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent  # cli.py lives in hobbes/tools/
HOBBES = TOOLS.parent  # .../<repo>/hobbes
CYCLES = HOBBES / "cycle"
sys.path.insert(0, str(TOOLS))
import config


def _run(tool, *args):
    subprocess.run([sys.executable, str(TOOLS / tool), *args], check=True)


def _latest_cycle():
    return config.latest_cycle(CYCLES)


def cmd_cycle(rest):
    rd = str(config.new_cycle_dir(CYCLES))  # a fresh <date>-<letter> folder
    _run("baseline.py", "--fresh", "--run-dir", rd, *rest)
    _run("evaluation.py", "--run-dir", rd)
    # no review here. the cycle only measures the current site. the before/after is
    # the review phase's job. re-baseline live post-publish and diff vs pre-publish.


def cmd_baseline(rest):
    _run("baseline.py", *rest)


def cmd_findings(rest):
    _run("evaluation.py", *rest)


def cmd_publish_review(rest):
    _run("publish-review.py", *rest)


def cmd_review(rest):
    _run("review.py", *rest)


def cmd_status(rest):
    c = _latest_cycle()
    if not c:
        print("no cycle yet — run `hobbes cycle`")
        return
    stages = [
        ("01-baseline.md", "baseline"),
        ("02-evaluation.md", "findings"),
        ("03-plan.md", "plan"),
        ("04-execute.md", "execute"),
    ]
    have = [name for f, name in stages if (c / f).exists()]
    nxt = next((name for f, name in stages if not (c / f).exists()), "publish (human)")
    print(f"cycle {c.name}: {' -> '.join(have) or '(empty)'}  ·  next: {nxt}")


def _agent_stage(template, rest):
    c = _latest_cycle()
    findings = (c / "02-evaluation.md") if c else None
    print(f"Stage prompt → hobbes/templates/{template}")
    print(f"Cycle        → {c.name if c else '(none)'}")
    print(
        f"Findings     → {findings if findings and findings.exists() else '(run findings first)'}"
    )
    print(
        "Context      → hobbes/MISSION.md · DEVELOPMENT.md · CONTEXT.md "
        "(read all three: impact ← MISSION; effort/feasibility ← DEVELOPMENT + CONTEXT)"
    )
    print(
        "Drive this stage with Claude Code (claude-code-action in CI, or `claude` locally): "
        "follow the template, open a PR, write only to GitHub, never publish."
    )


def cmd_plan(rest):
    _agent_stage("03-plan-template.md", rest)


def cmd_execute(rest):
    _agent_stage("04-execute-template.md", rest)


def cmd_budget(rest):
    print(config.effort_budget())


def cmd_today(rest):
    print(config.today())


COMMANDS = {
    "cycle": cmd_cycle,
    "baseline": cmd_baseline,
    "findings": cmd_findings,
    "publish-review": cmd_publish_review,
    "review": cmd_review,
    "status": cmd_status,
    "plan": cmd_plan,
    "execute": cmd_execute,
    "budget": cmd_budget,
    "today": cmd_today,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(
            "usage: hobbes <cycle|baseline|findings|publish-review|review|status|plan|execute|budget|today>"
        )
    COMMANDS[sys.argv[1]](sys.argv[2:])


if __name__ == "__main__":
    main()
