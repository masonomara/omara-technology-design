#!/usr/bin/env python3
"""
review.py — the post-publish before/after, honest about what's trustworthy.

The before is the cycle's own pre-publish metrics (01-baseline.metrics.json, written
beside 01-baseline.md by baseline.py — everything leading up to the PR). The after is
the live site re-measured post-publish by publish-review.py into
raw-review/review-baseline.metrics.json. review.py diffs the two STRUCTURED metric
sets — NOT re-parsed markdown — tier by tier:

  Field data (CrUX)   stable 28-day signal → real regressions/improvements.
  Lab scores (§A)     volatile (PSI lab swings even at median-of-3) → shown, labelled.
  §D axe a11y         the failing nodes the agent actually targets.
  Site-wide counts    scale with crawl coverage → compared ONLY when the before and
                      after page counts are close; a collapsed crawl must never read
                      as a sitewide "improvement".

The numbers come from the metrics.json sidecars, emitted by psi.metrics()/crawl.metrics()
— the SAME extraction the scorecard renders from — so the review can't disagree with the
scorecard, and a cosmetic change to a markdown table can't silently break the diff. The
tier titles, notes, and caveats live in templates/06-review-template.md. review.py fills
in the computed tables. Writes 06-review.md into the cycle folder. Prints a one-line
summary led by the trustworthy (field) regression count.

USAGE:
  python3 hobbes/tools/review.py                 # newest cycle
  python3 hobbes/tools/review.py --run-dir DIR   # a specific cycle folder
  python3 hobbes/tools/review.py --out PATH      # write the review elsewhere
"""

import json
import re
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent
sys.path.insert(0, str(TOOLS))
import config

CYCLES = HOBBES / "cycle"
TEMPLATE = HOBBES / "templates" / "06-review-template.md"
COVERAGE_OK = 0.8  # §F counts compared only if min/max crawl-page ratio ≥ this
BEFORE_COL = "Pre-publish"
AFTER_COL = "Live"
BEFORE_METRICS = "01-baseline.metrics.json"  # committed beside 01-baseline.md
AFTER_METRICS = "review-baseline.metrics.json"  # in the cycle's raw-review/

# short metric keys → the scorecard's own display labels, so the review speaks the
# same language the baseline does (not "perf"/"bp"/"lcp").
SCORE_LABELS = {
    "perf": "Performance",
    "a11y": "Accessibility",
    "bp": "Best Practices",
    "seo": "SEO",
}
FIELD_LABELS = {"lcp": "LCP (s)", "inp": "INP (ms)", "cls": "CLS"}


def _flat(nested):
    """{'<outer>': {'<metric>': v}} → {('<outer>', '<metric>'): v} so _deltas can key
    by tuple (the way the markdown parser used to). Tolerates a missing/None section."""
    return {(outer, m): v for outer, sub in (nested or {}).items() for m, v in sub.items()}


def _fmt(v):
    """Ints plain, floats trimmed (50.0 → '50', 1.562 → '1.562')."""
    return f"{v:g}" if isinstance(v, float) else str(v)


def _deltas(d_after, d_before, worse, label):
    """Changed keys shared by both sides → [(label, before, after, improved)].
    `worse`: 'gt' (higher = regression) or 'lt' (lower = regression)."""
    rows = []
    for k in sorted(d_after.keys() & d_before.keys()):
        a, b = d_before[k], d_after[k]
        if a == b:
            continue
        regressed = (b > a) if worse == "gt" else (b < a)
        rows.append((label(k), a, b, not regressed))
    return rows


def _axe_deltas(after, before):
    """axe nodes over the UNION of rules (a rule fixed to 0 leaves §D, so absent = 0).
    Fewer failing nodes = better → [(rule, before, after, improved)]."""
    rows = []
    for k in sorted(after.keys() | before.keys()):
        a, b = before.get(k, 0), after.get(k, 0)
        if a == b:
            continue
        rows.append((k, a, b, b < a))
    return rows


def render_tier(title, note, rows):
    """One tier rendered like a baseline section: a before→after table of only the
    rows that moved, or a single 'no change' line if none did."""
    out = [f"## {title}", ""]
    if note:
        out += [f"*{note}*", ""]
    if not rows:
        return out + ["_No change._", ""]
    out += [f"| Item | {BEFORE_COL} | {AFTER_COL} | |", "|---|---|---|---|"]
    for label, a, b, improved in rows:
        out.append(f"| {label} | {_fmt(a)} | {_fmt(b)} | {'▲' if improved else '▼'} |")
    return out + [""]


def parse_template(text):
    """Split 06-review-template.md into its head (prose + {placeholders}) and an
    ordered list of (key, title, note) tiers, marked by `<!-- tier: KEY -->`."""
    parts = re.split(r"<!--\s*tier:\s*(\w+)\s*-->", text)
    head = parts[0].rstrip()
    tiers = []
    for i in range(1, len(parts), 2):
        key = parts[i]
        body = [ln for ln in parts[i + 1].strip().splitlines()]
        title = body[0].lstrip("# ").strip() if body else key
        note = " ".join(ln.strip() for ln in body[1:] if ln.strip())
        tiers.append((key, title, note))
    return head, tiers


def _load(path, fix):
    if not path.exists():
        sys.exit(f"✗ no {path} — {fix}")
    return json.loads(path.read_text())


def main():
    args = sys.argv[1:]
    cur = (
        Path(args[args.index("--run-dir") + 1]).resolve()
        if "--run-dir" in args
        else config.latest_cycle(CYCLES)
    )
    if cur is None:
        sys.exit("✗ no cycle to review")
    before = _load(
        cur / BEFORE_METRICS,
        "re-run `hobbes baseline` on this cycle to write the before-metrics",
    )
    after = _load(cur / "raw-review" / AFTER_METRICS, "run publish-review.py first")
    out = (
        Path(args[args.index("--out") + 1]) if "--out" in args else cur / "06-review.md"
    )
    stamp = config.stamp()

    sa, sb = _flat(after.get("scores")), _flat(before.get("scores"))
    fa, fb = _flat(after.get("field")), _flat(before.get("field"))
    if not (sa.keys() & sb.keys()) and not (fa.keys() & fb.keys()):
        out.write_text(
            f"# Post-publish review — {cur.name}\n\nGenerated {stamp}.\n\n"
            f"**The pre-publish baseline and the live re-baseline share no comparable "
            f"sections — nothing to diff.**\n"
        )
        print(f"{cur.name}: no comparable sections")
        return

    rows = {
        "field": _deltas(
            fa, fb, "gt", lambda k: f"{k[0]} · {FIELD_LABELS[k[1]]}"
        ),  # field: lower better
        "lab": _deltas(
            sa, sb, "lt", lambda k: f"{k[0]} · {SCORE_LABELS[k[1]]}"
        ),  # lab: higher better
        "axe": _axe_deltas(after.get("axe", {}), before.get("axe", {})),  # nodes: lower better
        "counts": [],
    }

    cpg, ppg = after.get("crawl_pages"), before.get("crawl_pages")
    coverage_gap = cpg and ppg and min(cpg, ppg) / max(cpg, ppg) < COVERAGE_OK
    if not coverage_gap:
        rows["counts"] = _deltas(
            after.get("counts", {}), before.get("counts", {}), "gt", lambda k: k
        )

    field_regr = [r for r in rows["field"] if not r[3]]
    axe_impr = [r for r in rows["axe"] if r[3]]
    count_regr = [r for r in rows["counts"] if not r[3]]
    tldr = f"{len(field_regr)} field regression(s) vs pre-publish"
    if axe_impr:
        tldr += f" · {len(axe_impr)} a11y rule(s) improved"
    if coverage_gap:
        tldr += f" · ⚠ crawl {ppg}→{cpg} pages, counts omitted"
    elif count_regr:
        tldr += f" · {len(count_regr)} site-wide count regression(s)"

    head, tiers = parse_template(TEMPLATE.read_text())
    head = (
        head.replace("{cycle}", cur.name)
        .replace("{stamp}", stamp)
        .replace("{tldr}", tldr)
    )
    L = [head, ""]
    for key, title, note in tiers:
        if key == "counts" and coverage_gap:
            L += [
                f"## {title}",
                "",
                f"⚠ Crawl coverage changed **{ppg} → {cpg} pages** — counts aren't comparable "
                f"this review, so they're omitted. A smaller crawl drops every count; that's "
                f"sample size, not improvement.",
                "",
            ]
        else:
            L += render_tier(title, note, rows.get(key, []))
    out.write_text("\n".join(L).rstrip() + "\n")
    print(tldr)


if __name__ == "__main__":
    main()
