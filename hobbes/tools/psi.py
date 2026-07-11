#!/usr/bin/env python3
"""
psi.py — fetch PageSpeed Insights scores for the golden path and print
scorecard-ready markdown. Hobbes runs this. The human signs the manual rows.

WHY THIS EXISTS: run-1 numbers were transcribed by hand and field data got
mixed into lab rows (see hobbes-baseline.md 2.3/2.4/2.8). This pulls lab and
field SEPARATELY from the PSI API and labels them, so the mix can't happen.
Each page×device is measured 3× and the MEDIAN run is kept. Single-run lab
scores swing too much to compare cycle-to-cycle (a page drew perf 89 then 73
an hour apart). CrUX field data is 28-day, so the median doesn't touch it.

CAPTURE vs RENDER: capture() fetches into raw/. scorecard_sections() renders
§A–D straight from raw/. main() does both for a standalone run. baseline.py
calls the same two — capture once, then render — so the digest and a standalone
run share one renderer and can't disagree, and a re-render needs no re-fetch.

KEY: read from $PSI_API_KEY (a repo secret in CI; export it for local runs).
USAGE:
  python3 hobbes/tools/psi.py                 # default golden path
  python3 hobbes/tools/psi.py URL [URL ...]   # custom URLs
  python3 hobbes/tools/psi.py --fresh         # ignore cache, re-fetch all
  python3 hobbes/tools/psi.py --out PATH      # also write the digest to PATH
  python3 hobbes/tools/psi.py --run-dir DIR   # cycle folder (raw/); default today's
Prints the scorecard tables to stdout. Raw *.psi.json caches go in raw/. No
per-tool file is written unless --out is given.
The keyless PSI API is rate-capped to a shared pool
that is usually exhausted (HTTP 429). A key is required, not optional.
"""

import http.client
import json
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

# Golden path + PSI key come from hobbes.toml via config.py (one source per client).
import config
from config import golden_path, psi_key
DEFAULT_URLS = golden_path()
ENDPOINT = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed"
CATEGORIES = ["performance", "accessibility", "best-practices", "seo"]
# PSI runs Lighthouse server-side. A heavy mobile page takes ~60s. Firing all
# calls at once makes Google QUEUE them, so each call's wall-clock becomes
# queue-wait + run-time and blows the timeout. That was the real stall. Cap
# concurrency low so calls actually run when sent, not after a queue.
MAX_CONCURRENCY = 3
# Lab scores swing run-to-run (a heavy page measured twice an hour apart drew
# perf 89 then 73 while CrUX sat still). Single-run lab numbers aren't comparable
# cycle-to-cycle. So each page×strategy is measured RUNS times and the median run
# (by performance score) is kept. CrUX field data is 28-day and identical across
# runs, so it isn't affected.
RUNS = 3
# A runWarning containing this = PSI cut the run at its time limit (the page never
# reached network-idle). It does NOT void the run. Metrics that resolved before
# the cut (FCP, CLS, TBT, Speed Index, and the a11y/SEO/Best-Practices scores) are
# trustworthy. Only a truncated LCP and the LCP-weighted Performance score are not.
INCOMPLETE_SIG = "loaded too slowly"
# An LCP this large on an incomplete run is the cutoff artifact, not a real paint.
# Real-but-slow LCPs sit well under this. Our truncated ones were 13–21s.
LCP_ARTIFACT_S = 8.0
TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent


def resolve_run_dir(args):
    """Per-cycle output folder: hobbes/cycle/<date>-<letter>/. Big raw JSON caches
    live in raw/. baseline.py passes --run-dir so psi/seo/crawl share one cycle
    folder. A standalone run attaches to the latest cycle (or a fresh one)."""
    if "--run-dir" in args:
        d = Path(args[args.index("--run-dir") + 1])
    else:
        d = config.default_run_dir(HOBBES / "cycle")
    (d / "raw").mkdir(parents=True, exist_ok=True)
    return d


def cache_path(raw, url, strategy):
    slug = "".join(c if c.isalnum() else "_" for c in url)[:80]
    return raw / f"{slug}-{strategy}.psi.json"


def run_cache_path(raw, url, strategy, i):
    """Per-run cache for the median-of-3 (run 0/1/2). The selected median is
    written to cache_path() — the canonical doc the scorecard AND findings read —
    so downstream sees one coherent run, while these keep the raw three for resume."""
    slug = "".join(c if c.isalnum() else "_" for c in url)[:80]
    return raw / f"{slug}-{strategy}-r{i}.psi.json"


def perf_score(d):
    """Performance category score 0–1 of a PSI doc, or -1 if absent (sorts last)."""
    s = (d or {}).get("lighthouseResult", {}).get("categories", {}).get("performance", {}).get("score")
    return s if s is not None else -1.0


def median_run(runs):
    """The median PSI doc by performance score. Lighthouse's own guidance for a
    stable number is the median *run*, not per-metric medians (which would build an
    incoherent frankenstein doc). Returns one real, internally-consistent run."""
    ordered = sorted(runs, key=perf_score)
    return ordered[len(ordered) // 2]


def load_key():
    key = psi_key()
    if not key:
        sys.exit("No PSI key: set $PSI_API_KEY")
    return key


def fetch(url, strategy, key, tries=8, timeout=75):
    """Returns parsed JSON, or None if all retries are exhausted (one bad
    cell must NOT kill the whole run). Auth/quota errors abort immediately.
    They share the same fault on every call, so retrying is pointless.

    Timeout is short on purpose. A solo PSI call finishes in ~30-60s, but
    concurrent calls on one key intermittently HANG dead forever. A hung
    connection never recovers, so we cut it at 75s and retry FRESH. A fresh
    request usually goes straight through. Waiting 180s on a dead socket is
    the slowest possible move."""
    params = [("url", url), ("strategy", strategy), ("key", key)]
    params += [("category", c) for c in CATEGORIES]
    q = ENDPOINT + "?" + urllib.parse.urlencode(params, doseq=True)
    last = None
    for attempt in range(1, tries + 1):
        try:
            with urllib.request.urlopen(q, timeout=timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            msg = json.loads(body).get("error", {}).get("message", body[:200]) if body else str(e)
            if e.code in (401, 403, 429):  # bad key / quota. fatal for every call
                sys.exit(f"PSI API fatal {e.code}: {msg}")
            last = f"HTTP {e.code}: {msg}"  # 5xx and the like are transient. retry
        except (urllib.error.URLError, OSError, http.client.HTTPException, ValueError) as e:
            # Transient transport/parse faults: timeouts, dropped sockets, and the big one —
            # IncompleteRead (HTTPException) + the chunk-size ValueError from a truncated PSI
            # response read inside json.load. Retry FRESH. One bad read must not kill the run.
            last = str(e) or type(e).__name__
        print(f"  retry {attempt}/{tries} ({strategy} {url}): {last}", file=sys.stderr, flush=True)
    print(f"  ✗ GAVE UP {strategy} {url}: {last}", file=sys.stderr, flush=True)
    return None


def score(lh, cat):
    s = lh.get("categories", {}).get(cat, {}).get("score")
    return round(s * 100) if s is not None else "—"


def audit_s(lh, aid):
    v = lh.get("audits", {}).get(aid, {}).get("numericValue")
    return round(v / 1000, 2) if v is not None else "—"  # ms -> s


def audit_ms(lh, aid):
    v = lh.get("audits", {}).get(aid, {}).get("numericValue")
    return round(v) if v is not None else "—"


def audit_raw(lh, aid):
    v = lh.get("audits", {}).get(aid, {}).get("numericValue")
    return round(v, 3) if v is not None else "—"


def field(metrics, mkey, scale=1.0):
    m = metrics.get(mkey)
    if not m or m.get("percentile") is None:
        return "—"
    return round(m["percentile"] * scale, 3 if scale != 1 else 0)


def a11y_audit_failed(audit):
    """The single predicate for 'this accessibility audit failed': a binary
    axe-core check that scored 0. The scorecard's §D count (a11y_fails, below)
    and evaluation.py's A11Y catalog BOTH ride this, so the two can't disagree on
    what counts as a failure. Manual checks (keyboard, screen reader, focus) come
    back as 'manual' scoreDisplayMode and are intentionally excluded. Those stay
    human. Change the definition of a failure here, in one place, and both follow."""
    return audit.get("scoreDisplayMode") == "binary" and audit.get("score") == 0


def a11y_fails(lh):
    """Failing accessibility audits from PSI's Lighthouse run. These ARE
    axe-core checks, so no separate axe run is needed. Returns a list of
    (audit_id, failing_node_count) for the binary a11y audits that scored 0."""
    cat = lh.get("categories", {}).get("accessibility", {})
    audits = lh.get("audits", {})
    fails = []
    for ref in cat.get("auditRefs", []):
        a = audits.get(ref["id"], {})
        if a11y_audit_failed(a):
            nodes = len(a.get("details", {}).get("items", []))
            fails.append((ref["id"], nodes))
    return sorted(fails, key=lambda x: -x[1])


def capture(raw, urls, fresh):
    """Fetch every page×device into raw/ — the median-of-3 to cache_path() and the
    per-run checkpoints to run_cache_path(). Network side-effects ONLY. The
    scorecard is rendered separately, straight from raw/, by scorecard_sections().
    So baseline.py captures once then renders the same way psi.py does standalone.
    No stdout to scrape, and re-rendering needs no re-fetch."""
    key = load_key()
    # Fire all page×strategy calls at once. Wall-clock = slowest call, not the sum.
    # Cached (already-succeeded) calls return instantly, so a re-run only hits the
    # network for what's still missing. That also means lower concurrency and
    # far fewer of the stalls that concurrency triggers.
    jobs = [(label, url, strat) for label, url in urls for strat in ("mobile", "desktop")]

    def run(job):
        label, url, strat = job
        cf = cache_path(raw, url, strat)
        if not fresh and cf.exists():   # canonical median already chosen. reuse
            print(f"  ⤿ cached {label} {strat}", file=sys.stderr, flush=True)
            return
        runs = []
        for i in range(RUNS):
            rf = run_cache_path(raw, url, strat, i)
            if not fresh and rf.exists():
                runs.append(json.loads(rf.read_text()))
                continue
            print(f"… fetching {label} {strat} (run {i+1}/{RUNS})", file=sys.stderr, flush=True)
            d = fetch(url, strat, key)
            if d is not None:
                rf.write_text(json.dumps(d))   # checkpoint each run. never re-pay
                runs.append(d)
        if not runs:
            return
        med = median_run(runs)
        cf.write_text(json.dumps(med))          # canonical = the median run
        spread = sorted(round(perf_score(d) * 100) for d in runs if perf_score(d) >= 0)
        print(f"  ✓ {label} {strat} — perf {round(perf_score(med)*100)} "
              f"(median of {len(runs)}: {'/'.join(map(str, spread)) or '—'})",
              file=sys.stderr, flush=True)

    with ThreadPoolExecutor(max_workers=min(MAX_CONCURRENCY, len(jobs))) as ex:
        list(ex.map(run, jobs))


def _load_results(raw, urls):
    """Rebuild the median docs and the per-cell perf spread from raw/ — the exact
    files capture() wrote. Pure over raw/, so the scorecard renders identically
    whether psi.py runs standalone or baseline.py calls it, and re-renders from
    cache with no re-fetch. A cell with no median file on disk reads as failed. The
    spread is reconstructed from whatever per-run files are present."""
    results, spreads = {}, {}
    for label, url in urls:
        for strat in ("mobile", "desktop"):
            cf = cache_path(raw, url, strat)
            results[(label, url, strat)] = json.loads(cf.read_text()) if cf.exists() else None
            runs = []
            for i in range(RUNS):
                rf = run_cache_path(raw, url, strat, i)
                if rf.exists():
                    runs.append(json.loads(rf.read_text()))
            sp = sorted(round(perf_score(d) * 100) for d in runs if perf_score(d) >= 0)
            if sp:
                spreads[(label, url, strat)] = sp
    return results, spreads


def _page_field(results, label, url):
    """The CrUX field 'loadingExperience' for a page: prefer page-level data over the
    origin aggregate, and over an empty one. Shared by scorecard_sections (render §C)
    and metrics (structured), so the digest and the review diff the SAME selection."""
    les = [(results[(label, url, s)] or {}).get("loadingExperience", {}) for s in ("mobile", "desktop")]
    page = next((le for le in les if le.get("metrics") and le.get("origin_fallback") is not True), None)
    return page or next((le for le in les if le.get("metrics")), {})


def scorecard_sections(raw, urls):
    """Scorecard sections A–D (+ the failed-calls note), rendered from raw/.
    This is the exact block baseline.py drops into 01-baseline.md AND the block
    psi.py prints under its standalone header. One renderer, two callers, so the
    digest and a standalone run can never disagree on a number."""
    results, spreads = _load_results(raw, urls)
    rows_a, rows_lab, rows_field, rows_c = [], [], [], []
    failed = [(label, url, strat) for label, url in urls for strat in ("mobile", "desktop")
              if results[(label, url, strat)] is None]
    for label, url in urls:
        for strat in ("mobile", "desktop"):
            lh = (results[(label, url, strat)] or {}).get("lighthouseResult", {})
            warns = lh.get("runWarnings") or []
            incomplete = any(INCOMPLETE_SIG in w.lower() for w in warns)  # classify, don't lump
            mark = ""   # truncated values are flagged per-cell with ✗cut. no row-level ⚠

            lcp = audit_s(lh, "largest-contentful-paint")
            # Trust an early LCP even on an incomplete run. Flag ONLY a truncated one.
            cut = incomplete and isinstance(lcp, (int, float)) and lcp > LCP_ARTIFACT_S
            lcp_cell = f"{lcp} ✗cut" if cut else f"{lcp}"
            perf_cell = f"{score(lh,'performance')} ✗cut" if cut else f"{score(lh,'performance')}"

            rows_a.append(
                f"| {label} — {strat}{mark} | {perf_cell} | "
                f"{score(lh,'accessibility')} | {score(lh,'best-practices')} | {score(lh,'seo')} |"
            )
            rows_lab.append(
                f"| {label} — {strat}{mark} | {lcp_cell} | "
                f"{audit_raw(lh,'cumulative-layout-shift')} | {audit_s(lh,'first-contentful-paint')} | "
                f"{audit_s(lh,'server-response-time')} | {audit_ms(lh,'total-blocking-time')} | "
                f"{audit_s(lh,'speed-index')} |"
            )
            fails = a11y_fails(lh)
            detail = ", ".join(f"{aid}×{n}" for aid, n in fails) or "none"
            passd = "✓" if not fails else "✗"
            rows_c.append(f"| {label} — {strat}{mark} | {len(fails)} | {passd} | {detail} |")
        # Field data (CrUX 28-day). PREFER page-level. Use the origin aggregate
        # only if neither device has page-level data, and LABEL it when we do,
        # so a whole-site average is never mistaken for this page's real numbers.
        le = _page_field(results, label, url)
        fm = le.get("metrics", {})
        tag = " — origin agg." if (fm and le.get("origin_fallback") is True) else ""
        if fm:
            oc = le.get("overall_category", "")
            passc = "✓" if oc == "FAST" else ("✗" if oc else "—")
            rows_field.append(
                f"| {label}{tag} | {field(fm,'LARGEST_CONTENTFUL_PAINT_MS',0.001)} | "
                f"{field(fm,'INTERACTION_TO_NEXT_PAINT')} | "
                f"{field(fm,'CUMULATIVE_LAYOUT_SHIFT_SCORE',0.01)} | "
                f"{passc} |"
            )
        else:
            rows_field.append(f"| {label} | — | — | — | — |")

    # Per-page×device perf-score spread across the 3 runs. Shows the volatility the
    # median smooths over, so the human can judge how shaky a cell is. Shown for
    # every cell whose per-run files are on disk (reconstructed from raw/).
    spread_bits = []
    for label, url in urls:
        for strat in ("mobile", "desktop"):
            sp = spreads.get((label, url, strat))
            if sp:
                spread_bits.append(f"{label} — {strat} {'/'.join(map(str, sp))}")
    spread_note = ([f"> Perf-score spread across 3 runs (median kept): {' · '.join(spread_bits)}.", ""]
                   if spread_bits else [])

    L = [
        "## A. Lighthouse scores",
        "",
        "| Page / Device | Performance | Accessibility | Best Practices | SEO |",
        "|---|---|---|---|---|",
        *rows_a,
        "",
        *spread_note,
        "## B. Lab metrics",
        "",
        "| Page / Device | LCP (s) | CLS | FCP (s) | TTFB (s) | TBT (ms) | Speed Index (s) |",
        "|---|---|---|---|---|---|---|",
        *rows_lab,
        "",
        "## C. Field data (CrUX 28-day)",
        "",
        "| Page | LCP (s) | INP (ms) | CLS | Pass |",
        "|---|---|---|---|---|",
        *rows_field,
        "",
        "## D. Accessibility — automated (axe via PSI)",
        "",
        "| Page / Device | Failing audits | Pass | Details (rule × nodes) |",
        "|---|---|---|---|",
        *rows_c,
    ]
    if failed:
        L += ["", "> ✗ Failed calls (cells show — above): "
              + ", ".join(f"{lbl} {strat}" for lbl, _u, strat in failed)]
    return "\n".join(L).rstrip()


def metrics(raw, urls):
    """The structured §A/§C/§D numbers the post-publish review diffs — extracted from
    raw/ with the SAME helpers scorecard_sections() renders from (score, a11y_fails,
    _page_field, field), so the review can never disagree with the scorecard. The
    review diffs these (a JSON sidecar), not re-parsed markdown. JSON-friendly:
      scores: {'<label> — <device>': {perf, a11y, bp, seo}}   numeric cells only
      field:  {'<label>': {lcp, inp, cls}}                     the page-level CrUX row
      axe:    {<rule>: <failing nodes summed over the golden path>}
    """
    results, _ = _load_results(raw, urls)
    scores, fields, axe = {}, {}, {}
    for label, url in urls:
        for strat in ("mobile", "desktop"):
            lh = (results[(label, url, strat)] or {}).get("lighthouseResult", {})
            row = {m: v for m, cat in (("perf", "performance"), ("a11y", "accessibility"),
                                       ("bp", "best-practices"), ("seo", "seo"))
                   for v in [score(lh, cat)] if isinstance(v, (int, float))}
            if row:
                scores[f"{label} — {strat}"] = row
            for aid, n in a11y_fails(lh):
                axe[aid] = axe.get(aid, 0) + n
        fm = _page_field(results, label, url).get("metrics", {})
        if fm:
            row = {m: v for m, mkey, scale in (("lcp", "LARGEST_CONTENTFUL_PAINT_MS", 0.001),
                                               ("inp", "INTERACTION_TO_NEXT_PAINT", 1.0),
                                               ("cls", "CUMULATIVE_LAYOUT_SHIFT_SCORE", 0.01))
                   for v in [field(fm, mkey, scale)] if isinstance(v, (int, float))}
            if row:
                fields[label] = row
    return {"scores": scores, "field": fields, "axe": axe}


def main():
    args = sys.argv[1:]
    fresh = "--fresh" in args  # ignore cache, re-fetch everything
    rd = resolve_run_dir(args)
    raw = rd / "raw"
    out = None                                    # no default file. --out opts in
    for flag in ("--run-dir", "--out"):           # strip value-bearing flags before positional parse
        if flag in args:
            i = args.index(flag)
            if flag == "--out":
                out = Path(args[i + 1])
            del args[i:i + 2]
    positional = [a for a in args if a != "--fresh"]
    urls = [(f"URL{i+1}", u) for i, u in enumerate(positional)] or DEFAULT_URLS

    capture(raw, urls, fresh)
    stamp = config.stamp()
    report = "\n".join([
        f"# PSI results — {stamp}",
        "",
        "Captured by `hobbes/tools/psi.py` (PageSpeed Insights API). Lab and field",
        "are pulled and labelled SEPARATELY so they can't be mixed. Each page×device",
        "is the **median of 3 runs** (lab scores swing; the median is the comparable",
        "number). Transcribe these into scorecard sections A–D; SEO (E) comes from",
        "seo.py and the manual a11y rows (F) are signed by a human.",
        "",
        "Golden path: " + " · ".join(f"[{lbl}]({u})" for lbl, u in urls),
        "",
        scorecard_sections(raw, urls),
    ]) + "\n"

    print(report)                                   # stdout — human-readable standalone digest
    if out:                                          # --out only. no default per-tool file
        out.write_text(report)
        print(f"→ written to {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
