#!/usr/bin/env python3
"""
crawl.py — whole-site SiteOne crawl. Emits scorecard Section F (site-wide
grades + counts). The per-URL detail feeds the findings doc.

Covers what the golden-path tools can't: every URL on the site. Section F holds
SiteOne's 0–10 quality grades plus site-wide counts — broken links, redirects,
missing/duplicate titles, missing meta descriptions, multiple/skipped headings,
missing alt/aria/roles/lang, invalid/duplicate SVGs, and the security headers.

DRIVEN BY THE SITEMAP, for a reproducible page set. Earlier cycles seeded a
link-discovery crawl from the homepage with a hard URL cap. The sample wandered
(200→164 pages) because the host throttled a different random subset each run and
the cap truncated the rest, so cycle-over-cycle counts were noise. Now we expand
the sitemap to the authoritative page list (SiteOne does NOT recurse a nested
sitemap *index*, so we expand it here), serve it as one flat sitemap on localhost,
and crawl exactly that set: pinned with --include-regex, gentle pace so 429s stay
near zero, no truncation. Same sitemap → same pages → comparable numbers.

Mirrors psi.py / seo.py: gentle live crawl, a cached crawl.json, and the same
capture/render split. capture() crawls into raw/crawl.json. scorecard_section()
renders §F straight from that JSON. main() does both. baseline.py calls the same
two, so the digest and a standalone run share one renderer.

USAGE:
  python3 hobbes/tools/crawl.py            # reuse cached crawl.json if present
  python3 hobbes/tools/crawl.py --fresh    # re-crawl (stratified sitemap sample)
  python3 hobbes/tools/crawl.py --full     # crawl the entire sitemap (slow — occasional audit)
  python3 hobbes/tools/crawl.py --out PATH # also write the digest to PATH
  python3 hobbes/tools/crawl.py --run-dir DIR # cycle folder (raw/crawl.json)
"""

import html
import http.server
import json
import re
import shutil
import socketserver
import subprocess
import sys
import threading
import urllib.parse
import urllib.request
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent
sys.path.insert(0, str(TOOLS))
import config
from psi import DEFAULT_URLS  # single source of truth for the site

BIN = "siteone-crawler"
UA = "hobbes-baseline/1.0 (+SiteOne sitemap crawl)"
# Pace: hosts often rate-limit site HTML hard (a leaky bucket — a burst of ~33
# pages then 429 for the rest), and SiteOne has no 429 retry, so a throttled page
# is a lost page and the sample wanders again. We stay UNDER the limit: 1 req/s,
# 1 worker, serialized. Images are skipped. alt/heading/SEO/security are HTML/
# header checks that don't need the bytes. Pulling hundreds of images would both
# crawl for hours and, ironically, was the only thing diluting the origin
# hit-rate. We replace that dilution with a low rate instead. Image weight/format
# is judged on the golden path by PSI.
LIMITS = ["--max-reqs-per-sec=1", "--workers=1", "--timeout=15",
          "--disable-images", "--regex-filtering-only-for-pages"]

# Default crawl is a STRATIFIED SAMPLE, not the whole sitemap: every distinct
# low-volume page type every cycle, plus a fixed deterministic slice of the one
# high-volume type (named by [cycle].sample_path, e.g. "/products/"). That type is
# template-driven, so a slice reveals the same template-level issues (missing
# description, heading order, missing alt) as the whole would, without hammering
# the host past its throttle. With no sample_path set, every page is crawled.
# --full overrides this and crawls the entire sitemap (slow, for an occasional
# complete audit). The sample is deterministic, so the page set — and the counts —
# are identical every cycle.
SAMPLE_SIZE = 100   # how many of the high-volume page type to keep when subsampling


def select_pages(pages, full):
    """Choose the crawl set from the full sitemap. Returns (chosen, note).
    Subsamples the one high-volume page type named by [cycle].sample_path. With no
    sample_path set (or --full), takes every page."""
    pat = config.sample_path()
    if full or not pat:
        return pages, "full sitemap" if full else "all pages (no sample_path set)"
    bucket = [p for p in pages if pat in p]
    other = [p for p in pages if pat not in p]
    if len(bucket) > SAMPLE_SIZE:
        step = len(bucket) // SAMPLE_SIZE           # deterministic: every Nth, sorted
        sample = bucket[::step][:SAMPLE_SIZE]
    else:
        sample = bucket
    chosen = sorted(set(other) | set(sample))
    note = f"all {len(other)} other + {len(sample)}/{len(bucket)} '{pat}' sampled"
    return chosen, note


def resolve_run_dir(args):
    """Per-cycle output folder: hobbes/cycle/<date>-<letter>/. crawl.json lives in
    raw/. baseline.py passes --run-dir so psi/seo/crawl share one cycle folder.
    Standalone attaches to the latest cycle (or a fresh one)."""
    if "--run-dir" in args:
        d = Path(args[args.index("--run-dir") + 1])
    else:
        d = config.default_run_dir(HOBBES / "cycle")
    (d / "raw").mkdir(parents=True, exist_ok=True)
    return d


def site_root():
    p = urllib.parse.urlparse(DEFAULT_URLS[0][1])
    return f"{p.scheme}://{p.netloc}/"


def _fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")


def _locs(xml):
    return [html.unescape(m.strip()) for m in re.findall(r"<loc>\s*([^<]+?)\s*</loc>", xml)]


def _is_page(url):
    """A crawlable HTML page — a clean path with no file extension. Page URLs are
    extensionless paths. This drops child sitemaps (.xml) and non-HTML sitemap
    entries like /agents.md or /robots.txt."""
    last = urllib.parse.urlparse(url).path.rstrip("/").rsplit("/", 1)[-1]
    return "." not in last


def expand_sitemap(root):
    """The authoritative page list. SiteOne crawls a *flat* sitemap but does NOT
    recurse a sitemap *index* (many hosts serve `sitemap.xml` as an index of
    child sitemaps), so we expand it here. Fetch the index, follow each child,
    collect every non-sitemap <loc>. Returns (sorted unique pages, note)."""
    idx = _fetch(root + "sitemap.xml")
    top = _locs(idx)
    pages, notes = [], []
    if "<sitemapindex" in idx:
        for child in top:
            if child.lower().rstrip("/").split("?")[0].endswith(".xml") or "sitemap" in child.lower():
                try:
                    pages += [u for u in _locs(_fetch(child)) if _is_page(u)]
                except Exception as e:
                    notes.append(f"child sitemap failed ({child.split('/')[-1].split('?')[0]}): {e}")
            elif _is_page(child):
                pages.append(child)
    else:                                   # already a flat sitemap
        pages = [u for u in top if _is_page(u)]
    return sorted(set(pages)), notes


def serve_flat_sitemap(pages):
    """Serve the expanded page list as one flat sitemap on an ephemeral localhost
    port. SiteOne is seeded here, then crawls the real (external) page URLs via
    --allowed-domain-for-crawling. Returns (httpd, seed_url). The caller shuts it down."""
    body = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "".join(f"<url><loc>{html.escape(u)}</loc></url>\n" for u in pages)
            + "</urlset>\n").encode("utf-8")

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-Type", "application/xml")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *a):
            pass

    httpd = socketserver.TCPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f"http://127.0.0.1:{httpd.server_address[1]}/sitemap.xml"


def pin_regex(pages):
    """A PCRE that matches exactly the sitemap pages (optional trailing slash).
    With --regex-filtering-only-for-pages this pins crawled *pages* to the sitemap
    set — no link-discovery wander — while assets still load for analysis."""
    return "^(" + "|".join(re.escape(u) for u in pages) + ")/?$"


def run_crawl(fresh, cache, full=False):
    if not fresh and cache.exists():
        print(f"  ⤿ cached crawl ({cache.name})", file=sys.stderr, flush=True)
        return json.loads(cache.read_text())
    if not shutil.which(BIN):
        sys.exit(f"✗ {BIN} not found — install: brew install janreges/tap/siteone-crawler")
    root = site_root()
    host = urllib.parse.urlparse(root).netloc

    print(f"… expanding sitemap for {root}", file=sys.stderr, flush=True)
    try:
        sitemap, notes = expand_sitemap(root)
    except Exception as e:
        sys.exit(f"✗ could not read sitemap ({e}). The crawl is sitemap-driven; "
                 f"confirm {root}sitemap.xml is reachable.")
    for n in notes:
        print(f"  ⚠ {n}", file=sys.stderr, flush=True)
    if not sitemap:
        sys.exit("✗ sitemap expanded to 0 pages — nothing to crawl.")
    pages, sample_note = select_pages(sitemap, full)
    print(f"  ✓ {len(sitemap)} pages in sitemap → crawling {len(pages)} ({sample_note})",
          file=sys.stderr, flush=True)

    httpd, seed = serve_flat_sitemap(pages)
    print(f"… crawling {len(pages)} pages (1 req/s, 1 worker, images off) — be patient",
          file=sys.stderr, flush=True)
    # Two durable outputs in raw/: the JSON (scorecard §F + the metrics the review
    # diffs) and the HTML report. The JSON drops all per-analysis detail, so we ALSO
    # emit the HTML report — the only place SiteOne writes the offending element,
    # its occurrence count, and the affected URLs — and parse it into _detail below.
    # The default tmp/ text dump stays off. Seed from the localhost flat sitemap.
    # Pin pages to the chosen set. Allow crawling/asset-loading on the real domain.
    report = cache.parent / "crawl-report.html"
    cmd = [BIN, f"--url={seed}",
           f"--allowed-domain-for-crawling={host}",
           "--allowed-domain-for-external-files=*",
           f"--include-regex={pin_regex(pages)}",
           f"--max-visited-urls={len(pages) * 2 + 1000}",
           "--output=json", f"--output-json-file={cache}",
           f"--output-html-report={report}",
           "--output-text-file=",
           "--hide-progress-bar", "--no-color"] + LIMITS
    try:
        r = subprocess.run(cmd, stdout=subprocess.DEVNULL)
    finally:
        httpd.shutdown()
    if r.returncode != 0 or not cache.exists():
        sys.exit(f"✗ crawl failed (exit {r.returncode}).")
    data = json.loads(cache.read_text())
    try:                                     # parse the report detail into the JSON
        data["_detail"] = parse_html_report(report.read_text(errors="replace"))
    except Exception as e:                   # detail is a bonus — never sink the crawl
        print(f"  ⚠ could not parse HTML report detail ({e})", file=sys.stderr, flush=True)
        data["_detail"] = {}
    data["_sitemapPages"] = len(sitemap)     # carried into coverage reporting
    data["_sampledPages"] = len(pages)
    data["_sampleNote"] = sample_note
    data["_full"] = full                     # so scorecard_section() can label §F from raw/
    cache.write_text(json.dumps(data))
    print(f"  ✓ crawl complete · {cache.name}", file=sys.stderr, flush=True)
    return data


def capture(raw, fresh, full):
    """Crawl the whole site into raw/crawl.json (or reuse the cache). Network
    side-effects only. §F is rendered from the JSON by scorecard_section(), so
    baseline.py captures once then renders the same way crawl.py does standalone."""
    return run_crawl(fresh, raw / "crawl.json", full)


def table_rows(tables, name):
    return (tables.get(name) or {}).get("rows") or []


# ── HTML-report detail ────────────────────────────────────────────────────────
# SiteOne's JSON drops the per-analysis detail: results[].extras is empty, and
# tables.accessibility (etc.) carry only critical/warning counts. The element-level
# detail — the offending markup, its occurrence count, and the affected URLs —
# lives ONLY in the HTML report. So we emit the report, parse it, and fold the
# detail into crawl.json. Each analyzer (accessibility, best-practices, security)
# renders a detail table of Severity · Occurs · Detail (element markup) · Affected
# URLs. One parser pulls them all.
_DETAIL_DOMAINS = ("accessibility", "best-practices", "security", "seo")
_GENERIC_TBL = {"table", "table-bordered", "table-hover", "table-sortable",
                "table-with-show-more", "table-compact"}


def _cell_text(td):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(td))).strip()


def _cell_value(td):
    """The detail cell stores the raw element markup in data-value (it survives
    HTML-encoding cleanly). SiteOne writes the sentinel 'complex-data' when the
    value is too complex for the attribute — fall back to the cell text then."""
    m = re.search(r"data-value='([^']*)'", td)
    v = html.unescape(m.group(1)).strip() if m else ""
    return v if v and v != "complex-data" else _cell_text(td)


def parse_html_report(report_html):
    """Every SiteOne analyzer detail table → {domain: [row]}, where a row is
    {analysis, severity, occurs, detail, urls}. Only the severity-based detail
    tables are pulled (Severity + Affected URLs columns); per-URL metadata tables
    are left to the JSON. A table is attributed to the nearest preceding domain
    summary table. Best-effort — a parse failure returns whatever was read."""
    out = {}
    for tm in re.finditer(r"<table id='[^']*'[^>]*class='([^']*)'[^>]*>(.*?)</table>",
                          report_html, re.S):
        classes, body = tm.group(1), tm.group(2)
        analysis = next((c for c in classes.split() if c not in _GENERIC_TBL), None)
        if not analysis:
            continue
        ths = [_cell_text(t).lower() for t in re.findall(r"<th[^>]*>(.*?)</th>", body, re.S)]
        if "severity" not in ths or not any("affected url" in t for t in ths):
            continue
        pre = report_html[: tm.start()]
        at, dom = -1, "other"
        for d in _DETAIL_DOMAINS:
            for sm in re.finditer(r"<table id='[^']*'[^>]*class='[^']*\b" + re.escape(d)
                                  + r"\b[^']*'", pre):
                if sm.start() > at:
                    at, dom = sm.start(), d
        for r in re.findall(r"<tr[^>]*>(.*?)</tr>", body, re.S):
            tds = re.findall(r"<td[^>]*>.*?</td>", r, re.S)
            if len(tds) < 4:
                continue
            sev = _cell_text(tds[0]).lower()
            if sev not in ("critical", "warning", "notice", "ok"):
                continue
            out.setdefault(dom, []).append({
                "analysis": analysis,
                "severity": sev,
                "occurs": int(re.sub(r"\D", "", _cell_text(tds[1])) or 0),
                "detail": _cell_value(tds[2]),
                "urls": re.findall(r'href="([^"]+)"', tds[3]),
            })
    return out


def detail_rows(data, *, analysis=None, domain=None):
    """Parsed HTML-report detail rows, filtered by analysis class (e.g.
    'missing-aria-labels') or domain ('accessibility'). Empty if the report
    wasn't parsed (an old cache) — callers fall back to the count tables."""
    rows = []
    for dom, drows in (data.get("_detail") or {}).items():
        if domain and dom != domain:
            continue
        for r in drows:
            if analysis and r.get("analysis") != analysis:
                continue
            rows.append(r)
    return rows


def quality_scores(data):
    """SiteOne's weighted 0–10 grades, keyed by category name."""
    cats = ((data.get("qualityScores") or {}).get("categories")) or []
    return {c.get("name"): c.get("score") for c in cats}


def rollup_texts(data):
    """Every headline line SiteOne computed — summary items + quality-score
    deduction reasons. Page-level counts ('52 page(s) with …') live ONLY here,
    not in the per-URL tables, so the scorecard reads them from this rollup."""
    texts = [i.get("text", "") for i in ((data.get("summary") or {}).get("items") or [])]
    for c in ((data.get("qualityScores") or {}).get("categories")) or []:
        for d in (c.get("deductions") or []):
            texts.append(d.get("reason", ""))
    return texts


def count_for(texts, needle):
    """First integer in the first rollup line that mentions `needle` (case-
    insensitive), else 0. E.g. count_for(t, 'skipped heading') -> 52."""
    nl = needle.lower()
    for t in texts:
        if nl in t.lower():
            m = re.search(r"\d+", t)
            if m:
                return int(m.group())
    return 0


def header_set(tables, name):
    """A security header counts as 'set' only if the crawl flagged no critical/
    warning responses for it. If it's absent from the table, nothing flagged it."""
    for r in table_rows(tables, "security"):
        if (r.get("header") or "").lower() == name.lower():
            return int(r.get("critical") or 0) == 0 and int(r.get("warning") or 0) == 0
    return True


def coverage_line(data, html_pages):
    """One honest line on what the crawl actually reached, so a partial run can't
    pass for the whole site. The default crawl SAMPLES the sitemap, so a gap below
    the full count is intentional. But analysing fewer pages than we *chose* to
    crawl, or any 429, is a real shortfall and is flagged."""
    sm = data.get("_sitemapPages")
    sampled = data.get("_sampledPages") or sm
    note = data.get("_sampleNote")
    stats = data.get("stats", {}) or {}
    cbs = {str(k): int(v) for k, v in (stats.get("countByStatus") or {}).items()}
    throttled = cbs.get("429", 0)
    parts = [f"{html_pages} HTML pages analysed"]
    if sampled and sm and sampled < sm:
        parts.append(f"of {sampled} sampled ({note}) — sitemap has {sm}")
    elif sm:
        parts.append(f"of {sm} in sitemap (full)")
    shortfall = sampled and html_pages < sampled
    if shortfall:
        parts.append(f"⚠ {sampled - html_pages} chosen page(s) NOT reached")
    if throttled:
        parts.append(f"⚠ {throttled} request(s) throttled (429)")
    non2xx = sorted(c for c in cbs if not c.startswith("2"))
    if non2xx:
        parts.append("responses: " + ", ".join(f"{c}×{cbs[c]}" for c in non2xx))
    return " · ".join(parts), (throttled > 0 or shortfall)


def _site_counts(data):
    """The site-wide count rows as an ordered {label: int}, plus the analysed page
    count — computed in ONE place so Section F (rendered below) and metrics() (the
    numbers the review diffs) can't disagree. The per-URL tables give broken/redirect/
    title/description counts. The page-level counts ('52 page(s) with …') come from
    SiteOne's own rollup (rollup_texts), which the per-URL tables don't carry."""
    tables = data.get("tables", {})
    texts = rollup_texts(data)
    seo = table_rows(tables, "seo")
    n = len(seo)
    missing_title = [r for r in seo if not (r.get("title") or "").strip()]
    missing_desc = [r for r in seo if not (r.get("description") or "").strip()]
    dup_title = [r for r in table_rows(tables, "non-unique-titles") if (r.get("title") or "").strip()]
    invalid_html = count_for(texts, "invalid html")
    counts = {
        "Broken links (4xx)": len(table_rows(tables, "404")),
        "Redirects": len(table_rows(tables, "redirects")),
        "Missing titles": len(missing_title),
        "Duplicate titles": len(dup_title),
        "Missing meta descriptions": len(missing_desc),
        "Pages with multiple H1": count_for(texts, "multiple <h1>"),
        "Pages with skipped heading levels": count_for(texts, "skipped heading"),
        "Pages missing image alt": count_for(texts, "without image alt"),
        "Pages missing aria-labels": count_for(texts, "without aria"),
        "Pages missing roles": count_for(texts, "without role"),
        "Pages missing html lang": count_for(texts, "missing html lang") or count_for(texts, "without html lang"),
        "Pages with invalid inline SVG": count_for(texts, "invalid inline svg"),
        "Pages with duplicate inline SVG": count_for(texts, "duplicated inline svg"),
        "Pages with non-clickable phone numbers": count_for(texts, "non-clickable"),
        "Valid HTML": n - invalid_html,
    }
    return counts, n


def metrics(raw):
    """The structured §F numbers the post-publish review diffs: {'counts': {label: int},
    'crawl_pages': n}. Same source as scorecard_section (via _site_counts), so the
    review diffs a JSON sidecar that can't disagree with the rendered scorecard."""
    data = json.loads((raw / "crawl.json").read_text())
    counts, n = _site_counts(data)
    return {"counts": counts, "crawl_pages": n}


def scorecard_section(raw):
    """Scorecard Section F (site-wide grades + counts), rendered from
    raw/crawl.json — the exact block baseline.py drops into the digest and crawl.py
    prints under its standalone header. One renderer, two callers."""
    data = json.loads((raw / "crawl.json").read_text())
    full = bool(data.get("_full"))
    tables = data.get("tables", {})
    qs = quality_scores(data)
    texts = rollup_texts(data)
    cnts, n = _site_counts(data)
    no_brotli = count_for(texts, "brotli")
    tls_ok = any("certificate is valid" in t.lower() for t in texts) or site_root().startswith("https")

    def p(ok):
        return "✓" if ok else "✗"

    def qsv(name):
        s = qs.get(name)
        return f"{s:.1f}" if isinstance(s, (int, float)) else "—"

    def crow(label):   # a count row whose pass mark is simply "zero is clean"
        return f"| {label} | {cnts[label]} | {p(cnts[label] == 0)} |"

    L = [
        f"## F. Site-wide ({'whole-site' if full else 'sitemap sample'} crawl — {n} pages)",
        "",
        "| SiteOne quality score (0–10) | Value |",
        "|---|---|",
        f"| Performance | {qsv('Performance')} |",
        f"| SEO | {qsv('SEO')} |",
        f"| Security | {qsv('Security')} |",
        f"| Accessibility | {qsv('Accessibility')} |",
        f"| Best practices | {qsv('Best Practices')} |",
        "",
        "| SEO / structure | Count | Pass |",
        "|---|---|---|",
        crow("Broken links (4xx)"),
        crow("Redirects"),
        crow("Missing titles"),
        crow("Duplicate titles"),
        crow("Missing meta descriptions"),
        crow("Pages with multiple H1"),
        crow("Pages with skipped heading levels"),
        "",
        "| Accessibility | Count | Pass |",
        "|---|---|---|",
        crow("Pages missing image alt"),
        crow("Pages missing aria-labels"),
        crow("Pages missing roles"),
        crow("Pages missing html lang"),
        "",
        "| Best practices | Count | Pass |",
        "|---|---|---|",
        crow("Pages with invalid inline SVG"),
        crow("Pages with duplicate inline SVG"),
        crow("Pages with non-clickable phone numbers"),
        f"| Valid HTML | {cnts['Valid HTML']} | {p(cnts['Valid HTML'] == n)} |",
        "",
        "| Security | Pass |",
        "|---|---|",
        f"| HSTS header | {p(header_set(tables, 'Strict-Transport-Security'))} |",
        f"| Content-Security-Policy | {p(header_set(tables, 'Content-Security-Policy'))} |",
        f"| Referrer-Policy | {p(header_set(tables, 'Referrer-Policy'))} |",
        f"| Permissions-Policy | {p(header_set(tables, 'Permissions-Policy'))} |",
        f"| Brotli compression | {p(no_brotli == 0)} |",
        f"| HTTPS / valid TLS cert | {p(tls_ok)} |",
    ]
    return "\n".join(L).rstrip()


def main():
    args = sys.argv[1:]
    fresh = "--fresh" in args
    full = "--full" in args
    rd = resolve_run_dir(args)
    raw = rd / "raw"
    out = None                                    # no default file. --out opts in
    if "--out" in args:
        out = Path(args[args.index("--out") + 1])

    data = capture(raw, fresh, full)
    tables = data.get("tables", {})
    seo = table_rows(tables, "seo")
    n = len(seo)
    broken = table_rows(tables, "404")
    redirects = table_rows(tables, "redirects")
    missing_title = [r for r in seo if not (r.get("title") or "").strip()]
    missing_desc = [r for r in seo if not (r.get("description") or "").strip()]
    dup_title = [r for r in table_rows(tables, "non-unique-titles") if (r.get("title") or "").strip()]

    def path(r):
        return r.get("urlPathAndQuery") or "/"

    def detail(items, render):
        return [f"- {render(r)}" for r in items] or ["- (none)"]

    cov, partial = coverage_line(data, n)
    if partial:
        print(f"  ⚠ coverage: {cov}", file=sys.stderr, flush=True)
    stamp = config.stamp()
    L = [
        f"# Crawl results — {stamp}",
        "",
        "Captured by `hobbes/tools/crawl.py` (SiteOne, sitemap-driven whole-site crawl).",
        "The Section F block below feeds the scorecard; the detail feeds **findings**.",
        "",
        f"Site: {site_root()}",
        f"**Coverage:** {cov}",
        "",
        scorecard_section(raw),
        "",
        "## Detail — for findings",
        "",
        "### Broken links (4xx/5xx)",
        *detail(broken, lambda r: f"{r.get('url')} ({r.get('statusCode')})"),
        "",
        "### Redirects",
        *detail(redirects, lambda r: f"{r.get('url')} → {r.get('targetUrl')} ({r.get('statusCode')})"),
        "",
        "### Missing titles",
        *detail(missing_title, path),
        "",
        "### Duplicate titles",
        *detail(dup_title, lambda r: f"\"{r.get('title')}\" ×{r.get('count')}"),
        "",
        "### Missing meta descriptions",
        *detail(missing_desc, path),
    ]
    report = "\n".join(L) + "\n"
    print(report)                                 # stdout — human-readable standalone digest
    if out:                                        # --out only. no default per-tool file
        out.write_text(report)
        print(f"→ written to {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
