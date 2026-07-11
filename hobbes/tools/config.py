#!/usr/bin/env python3
"""
config.py — the single source of per-client config for every tool.

Replaces the hardcoded DEFAULT_URLS (psi.py + the old duplicate in seo.py) and
the CONFIG dict (baseline.py) with one `hobbes.toml`. Secrets never live in the
toml. psi_key() reads $PSI_API_KEY (a repo secret in CI).
"""

import re
import tomllib
from datetime import datetime
from functools import lru_cache
from os import environ
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

HOBBES = Path(__file__).resolve().parent.parent   # .../<repo>/hobbes
_TOML = HOBBES / "hobbes.toml"
_DEFAULT_TZ = "America/Chicago"


def _tz():
    """The cycle's pinned timezone. One source, so a local run (any machine TZ)
    and CI (UTC) always land on the same calendar day. Set [cycle].timezone."""
    return ZoneInfo(cfg().get("cycle", {}).get("timezone", _DEFAULT_TZ))


def today():
    """Cycle-folder date in the pinned timezone. Never off-by-one between local and CI."""
    return datetime.now(_tz()).strftime("%Y-%m-%d")


def stamp():
    """Human timestamp for digests. Pinned timezone, labelled (e.g. 'CDT'), one source."""
    return datetime.now(_tz()).strftime("%Y-%m-%d %H:%M %Z")


# ── Cycle folders: <date>-<letter>, e.g. 2026-06-26-A ────────────────────────
# the letter is assigned upstream so more than one cycle can run on the same day
# (2026-06-26-A, -B, …). every tool resolves cycle folders through these helpers
# so local and CI agree on the name and the glob.
_CYCLE_GLOB = "[0-9]" * 4 + "-[0-9][0-9]-[0-9][0-9]-[A-Z]"
_CYCLE_RE = re.compile(r"(\d{4}-\d{2}-\d{2})-([A-Z])$")


def cycle_dirs(root):
    """Every cycle folder under `root`, oldest→newest. Name sort is chronological:
    the fixed-width date dominates, then the letter."""
    root = Path(root)
    return sorted(
        (d for d in root.glob(_CYCLE_GLOB) if d.is_dir()), key=lambda d: d.name
    )


def latest_cycle(root):
    """The newest cycle folder, or None when there are none yet."""
    ds = cycle_dirs(root)
    return ds[-1] if ds else None


def new_cycle_dir(root, date=None):
    """The next unused cycle folder for `date` (today if omitted): the lowest free
    letter (A, then B, …). Returns a Path. Does not create it."""
    date = date or today()
    used = [
        m.group(2)
        for d in cycle_dirs(root)
        for m in [_CYCLE_RE.match(d.name)]
        if m and m.group(1) == date
    ]
    nxt = chr(ord(max(used)) + 1) if used else "A"
    return Path(root) / f"{date}-{nxt}"


def default_run_dir(root):
    """The folder a standalone tool attaches to: the latest existing cycle, or a
    fresh one when none exist. Cycle-creating entry points use new_cycle_dir."""
    return latest_cycle(root) or new_cycle_dir(root)


@lru_cache(maxsize=1)
def cfg():
    return tomllib.loads(_TOML.read_text())


def _page_label(url):
    """A short, client-agnostic page label derived from the URL: the first path
    directory (e.g. '/collections'), or '/' for the site root. No hardcoded page
    names, so the same code labels any site — a storefront, a blog, an app — from
    its own URLs."""
    seg = urlsplit(url).path.strip("/").split("/")[0]
    return f"/{seg}" if seg else "/"


def golden_path():
    """The locked golden path as [(label, url)], in config order. Each [[golden_path]]
    entry has a url and an optional label. When label is omitted it's derived from the
    url (see _page_label). No fixed keys or page types — client- and platform-agnostic
    for any number of pages."""
    return [(p.get("label") or _page_label(p["url"]), p["url"]) for p in cfg()["golden_path"]]


def client_meta():
    """The [client] block: name / site / platform / run_by."""
    return cfg()["client"]


def effort_budget():
    """Effort points an execute batch may spend — single source for the CLI and CI."""
    return int(cfg().get("cycle", {}).get("effort_budget", 10))


def sample_path():
    """The high-volume URL substring the crawler subsamples (e.g. '/products/' on a
    storefront, '/blog/' on a content site), from [cycle].sample_path. None when unset.
    The crawler then takes every page, no subsampling. Client-agnostic: the pattern
    lives in config, not in the code."""
    return cfg().get("cycle", {}).get("sample_path") or None


def psi_key():
    """The PageSpeed key from $PSI_API_KEY, else None. CI injects it from the repo secret."""
    return environ.get("PSI_API_KEY", "").strip() or None
