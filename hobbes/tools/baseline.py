#!/usr/bin/env python3
"""
baseline.py — one-command MVP baseline runner.

Runs psi.py (A–D), seo.py (E), and crawl.py (site-wide F). Then stamps a dated
scorecard from 01-baseline-template.md with the header filled and sections A–F pasted in.
Section G (manual a11y) is left blank for the human — the above-and-beyond pass.

A baseline reflects the CURRENT site, so this fetches fresh by default.
A stalled run still caches every good call. `--resume` reuses those and only
re-fetches what is missing.

USAGE:
  python3 hobbes/tools/baseline.py            # fresh capture (correct baseline)
  python3 hobbes/tools/baseline.py --resume   # reuse cache (recover a stalled run)
  python3 hobbes/tools/baseline.py --no-crawl # skip the site-wide crawl (quick rerun)
  python3 hobbes/tools/baseline.py --full     # crawl the entire sitemap, not the sample (slow)

CAPTURE then RENDER, in-process. The shared core lives in capture.py so this and
publish-review.py can't drift. It captures psi/seo/crawl into raw/ then renders
§A–F via the tools' OWN renderers — no stdout to scrape, no markers to slice. It
writes TWO files into one cycle folder (hobbes/cycle/YYYY-MM-DD-<letter>/):
01-baseline.md (the human digest, §A–F + the blank §G) and 01-baseline.metrics.json
(the structured numbers the post-publish review diffs — committed beside the digest
so the review never re-parses markdown). Both sit alongside the raw artifacts in raw/.
"""

import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent
TEMPLATE = HOBBES / "templates" / "01-baseline-template.md"

sys.path.insert(0, str(TOOLS))
import capture
import config
import psi
import seo
import crawl
from psi import DEFAULT_URLS  # single source of truth for the golden path


def after(text, marker):
    i = text.find(marker)
    return text[i:].rstrip() if i >= 0 else ""


def section_g(template_text):
    """Section G (manual a11y). The intro and column header come from 01-baseline-template.md.
    The page rows are generated from the golden path so G speaks the same URL-derived
    labels as A–F. The template's own rows are illustrative and dropped."""
    g = after(template_text, "## G.")
    head = []
    for ln in g.splitlines():
        head.append(ln)
        if (
            "|" in ln and "-" in ln and set(ln) <= set("|-: \t")
        ):  # the header separator row
            break
    ncols = head[-1].count("|") - 1
    rows = [
        f"| {lbl} — {strat} |" + "  |" * (ncols - 1)
        for lbl, _ in DEFAULT_URLS
        for strat in ("mobile", "desktop")
    ]
    return "\n".join(head + rows)


def main():
    args = sys.argv[1:]
    flags = capture.parse_flags(args)
    rundir = flags["run_dir"] or config.new_cycle_dir(HOBBES / "cycle")  # a fresh cycle
    raw = rundir / "raw"
    urls = DEFAULT_URLS
    date = config.today()

    # capture psi/seo/crawl into raw/ then render §A–F from it. shared with the
    # review's publish-review.py via capture.py so the two can't disagree.
    abcd, e, f = capture.capture_render(
        raw, urls, fresh=flags["fresh"], no_crawl=flags["no_crawl"], full=flags["full"]
    )
    g = section_g(TEMPLATE.read_text())  # manual a11y. page rows from the golden path
    if not g:
        sys.exit("✗ couldn't build Section G from the template.")

    doc = (
        "\n".join(
            capture.header("Baseline scorecard", urls, date)
            + [
                "`✓` = pass / present · `✗` = fail / missing · `✗cut` = PSI run truncated "
                "before network-idle (value is the cutoff) · blank = human sign-off pending.",
                "",
                abcd,
                "",
                e,
                "",
                f,
                "",
                g,
            ]
        )
        + "\n"
    )

    out = rundir / "01-baseline.md"
    out.write_text(doc)
    # the structured numbers the review diffs. committed beside the digest, NOT in
    # the git-ignored raw/, so a fresh CI review job still has the "before".
    metrics_out = rundir / "01-baseline.metrics.json"
    capture.write_metrics(metrics_out, raw, urls, no_crawl=flags["no_crawl"])

    print(f"\n✓ MVP baseline written → {out}", file=sys.stderr)
    print(
        "  A–F filled from the tools; Section G (manual a11y) left for human sign-off.",
        file=sys.stderr,
    )
    print(
        f"  Metrics sidecar → {metrics_out} (the review diffs this, not the markdown).",
        file=sys.stderr,
    )
    print(
        f"  Cycle folder: {rundir} (raw/ alongside; 01-baseline.md is the one digest).",
        file=sys.stderr,
    )
    print(
        "  Next: python3 hobbes/tools/evaluation.py — builds 02-evaluation.md (the problem catalog) from raw/.",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
