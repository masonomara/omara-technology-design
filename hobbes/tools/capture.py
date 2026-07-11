#!/usr/bin/env python3
"""
capture.py — the shared capture→render→metrics core for baseline.py and
publish-review.py.

Both run the SAME three tools (psi/seo/crawl) into a raw dir, render §A–F from it
via the tools' own renderers, and collect the structured metrics the post-publish
review diffs. They differ ONLY in where raw lands (raw/ vs raw-review/), the digest
header/intro, and whether §G is appended. That lives in the two entry points.
Everything they share lives here, once, where the two can't drift apart.
"""

import json
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import config
import psi
import seo
import crawl
from config import client_meta

CONFIG = client_meta()  # [client] from hobbes.toml


def parse_flags(args):
    """The capture flags baseline.py and publish-review.py share. --run-dir comes back
    as a resolved Path or None. The caller picks the default (new cycle vs latest)."""
    return {
        "no_crawl": "--no-crawl" in args,
        "full": "--full" in args,
        "fresh": "--resume" not in args,   # fresh capture by default. --resume reuses cache
        "run_dir": (Path(args[args.index("--run-dir") + 1]).resolve()
                    if "--run-dir" in args else None),
    }


def capture_render(raw, urls, *, fresh, no_crawl, full):
    """Capture psi/seo/crawl into `raw` (the network step), then render §A–F straight
    from it via each tool's OWN renderer — the exact functions a standalone tool run
    uses, so the digest and a standalone run can't disagree. Returns (abcd, e, f).
    Exits if §A–E come back empty (the capture didn't land)."""
    raw.mkdir(parents=True, exist_ok=True)
    psi.capture(raw, urls, fresh)
    seo.capture(raw, urls, fresh)
    if not no_crawl:
        crawl.capture(raw, fresh, full)
    abcd = psi.scorecard_sections(raw, urls)        # §A–D (+ failed-call note)
    e = seo.scorecard_section(raw, urls)            # §E + site-level
    if not (abcd and e):
        sys.exit(f"✗ couldn't render sections from {raw} — check the capture step ran.")
    f = crawl.scorecard_section(raw) if not no_crawl else ""   # §F
    return abcd, e, f


def collect_metrics(raw, urls, *, no_crawl):
    """The structured numbers the review diffs, from the SAME raw the digest rendered
    from. psi gives §A/§C/§D, crawl gives §F. JSON-serializable, written beside the
    digest so review.py compares numbers, not re-parsed markdown tables."""
    m = psi.metrics(raw, urls)
    m.update(crawl.metrics(raw) if not no_crawl else {"counts": {}, "crawl_pages": None})
    return m


def write_metrics(path, raw, urls, *, no_crawl):
    """Persist the metrics sidecar (the review's structured input) beside its digest."""
    path.write_text(json.dumps(collect_metrics(raw, urls, no_crawl=no_crawl), indent=2) + "\n")


def header(title, urls, date):
    """The shared digest header — the client line + golden path — identical for the
    pre-publish baseline and the post-publish re-baseline. Returns the header lines.
    The caller appends its own intro/legend, sections, and §G."""
    golden = " · ".join(f"[{lbl}]({u})" for lbl, u in urls)
    return [
        f"# {title} — {date}",
        "",
        f"Client: {CONFIG['name']} · Site: {CONFIG['site']} · Platform: "
        f"{CONFIG['platform']} · Run by: {CONFIG['run_by']} · Date: {date}",
        "",
        f"Golden path: {golden}",
        "",
    ]
