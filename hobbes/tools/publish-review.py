#!/usr/bin/env python3
"""
publish-review.py — the review phase's capture orchestrator (a twin of baseline.py).

baseline.py captures the PRE-publish site into <cycle>/raw/. This captures the
**live** site AFTER a publish into <cycle>/raw-review/ — the same three tools
(psi/seo/crawl), driven by the same shared core (capture.py), the same renderers.
Then it writes the after-digest <cycle>/raw-review/review-baseline.md AND its structured
sidecar review-baseline.metrics.json. So before and after live in one cycle folder,
side by side. review.py then diffs the cycle's pre-publish 01-baseline.metrics.json
(the before — everything leading up to the PR) against this after-metrics into
06-review.md, honest by tier.

No evaluation here. The review only needs the measured before/after, not a rebuilt
problem catalog.

CAPTURE then RENDER, in-process. Exactly baseline.py's contract via capture.py, but
pointed at raw-review/ instead of raw/, so the after-digest can't disagree with a
standalone tool run, and the metrics sidecar is the SAME numbers the digest renders.

USAGE:
  python3 hobbes/tools/publish-review.py            # the latest cycle (the PR's)
  python3 hobbes/tools/publish-review.py --run-dir DIR
  python3 hobbes/tools/publish-review.py --resume   # reuse raw-review/ cache
  python3 hobbes/tools/publish-review.py --no-crawl # skip the site-wide crawl
  python3 hobbes/tools/publish-review.py --full     # crawl the whole sitemap (slow)
"""

import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent

sys.path.insert(0, str(TOOLS))
import capture
import config
from psi import DEFAULT_URLS  # single source of truth for the golden path


def main():
    args = sys.argv[1:]
    flags = capture.parse_flags(args)
    rundir = flags["run_dir"]
    if rundir is None:
        rundir = config.latest_cycle(HOBBES / "cycle")  # attach to the PR's cycle
        if rundir is None:
            sys.exit("✗ no cycle folder to review — run a cycle first.")
    raw = rundir / "raw-review"  # the AFTER, beside the pre-publish raw/
    urls = DEFAULT_URLS
    date = config.today()

    # capture the LIVE site into raw-review/ and render §A–F. the shared core, so the
    # after-digest matches what baseline.py would emit for the same site.
    abcd, e, f = capture.capture_render(
        raw, urls, fresh=flags["fresh"], no_crawl=flags["no_crawl"], full=flags["full"]
    )

    doc = (
        "\n".join(
            capture.header("Post-publish re-baseline", urls, date)
            + [
                "The **live** site re-measured after publish. The before→after diff against the "
                "pre-publish `01-baseline.md` is review.py's job (`06-review.md`).",
                "",
                abcd,
                "",
                e,
                "",
                f,
            ]
        )
        + "\n"
    )

    out = raw / "review-baseline.md"
    out.write_text(doc)
    metrics_out = raw / "review-baseline.metrics.json"
    capture.write_metrics(metrics_out, raw, urls, no_crawl=flags["no_crawl"])

    print(f"\n✓ post-publish re-baseline written → {out}", file=sys.stderr)
    print(f"  Metrics sidecar → {metrics_out} (review.py diffs this).", file=sys.stderr)
    print(
        f"  Cycle folder: {rundir} (raw-review/ alongside the pre-publish raw/).",
        file=sys.stderr,
    )
    print(
        "  Next: python3 hobbes/tools/review.py — diffs before→after into 06-review.md.",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
