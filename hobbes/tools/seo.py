#!/usr/bin/env python3
"""
seo.py — scorecard Section E (SEO checklist + site-level) for the golden path,
machine-read from each page's HTML. Step two of the agent baseline (step one is psi.py).

Eight checks per page (BASELINE.md Group D), all parseable from HTML or a header:
  title · meta description · canonical · single H1 + heading order ·
  structured data (JSON-LD) · Open Graph/Twitter · image alt COVERAGE · indexable
Plus Section E: sitemap.xml + robots.txt load (once per site).

The ONE thing it can't own is alt-text QUALITY. It reports how many images
lack alt. A human judges whether the alt that exists is meaningful. Same
AI-vs-human split as the manual a11y pass.

No API key needed (plain HTML fetch). Mirrors psi.py: retry, per-page cache
(git-ignored *.seo.json), and the same capture/render split. capture() fetches
the pages (and the two site-level files) into raw/. scorecard_section() renders §E
straight from raw/. main() does both. baseline.py calls the same two, so the
digest and a standalone run share one renderer.

USAGE:
  python3 hobbes/tools/seo.py                 # default golden path
  python3 hobbes/tools/seo.py URL [URL ...]   # custom URLs
  python3 hobbes/tools/seo.py --fresh         # ignore cache, re-fetch
  python3 hobbes/tools/seo.py --out PATH      # also write the digest to PATH
  python3 hobbes/tools/seo.py --run-dir DIR   # cycle folder (raw/); default today's
"""

import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path

import config
from config import golden_path  # one source of the golden path (shared with psi.py)
DEFAULT_URLS = golden_path()
TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent
MAX_CONCURRENCY = 4
OG_REQUIRED = ["og:title", "og:image", "og:url", "og:type"]
LD_KNOWN = {"Product", "BreadcrumbList", "Organization", "WebSite", "WebPage",
            "ItemList", "CollectionPage", "Article", "FAQPage"}
# The 8 per-page checks, in scorecard row order. The single source for both the
# analyze() cell keys and the §E table rows.
CHECKS = ["Unique, descriptive title", "Meta description present", "Canonical correct",
          "Single H1 + ordered headings", "Valid structured data",
          "Open Graph / Twitter tags", "All images have alt", "Indexable"]


def resolve_run_dir(args):
    """Per-cycle output folder: hobbes/cycle/<date>-<letter>/. Raw *.seo.json caches
    live in raw/. baseline.py passes --run-dir so psi/seo/crawl share one cycle
    folder. A standalone run attaches to the latest cycle (or a fresh one)."""
    if "--run-dir" in args:
        d = Path(args[args.index("--run-dir") + 1])
    else:
        d = config.default_run_dir(HOBBES / "cycle")
    (d / "raw").mkdir(parents=True, exist_ok=True)
    return d


def cache_path(raw, url):
    slug = "".join(c if c.isalnum() else "_" for c in url)[:80]
    return raw / f"{slug}.seo.json"


def site_cache(raw):
    """Cache for the two once-per-site checks (sitemap.xml / robots.txt presence),
    so scorecard_section() renders §E offline from raw/. No live fetch at render."""
    return raw / "site.seo.json"


class Page(HTMLParser):
    """Pulls the SEO-relevant bits out of one page in a single pass."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._in_title = False
        self.metas = {}          # name/property (lowercased) -> content
        self.canonical = None
        self.headings = []       # heading levels in document order
        self.h1 = 0
        self.imgs = 0
        self.imgs_no_alt = 0
        self.jsonld = []         # parsed JSON-LD objects (or {_err:True})
        self._in_ld = False
        self._ld = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.metas[key.lower()] = a.get("content", "") or ""
        elif tag == "link" and "canonical" in (a.get("rel") or "").lower():
            self.canonical = a.get("href")
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            lvl = int(tag[1])
            self.headings.append(lvl)
            if lvl == 1:
                self.h1 += 1
        elif tag == "img":
            self.imgs += 1
            alt = a.get("alt")
            if alt is None or not alt.strip():
                self.imgs_no_alt += 1
        elif tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._in_ld, self._ld = True, []

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script" and self._in_ld:
            self._in_ld = False
            try:
                self.jsonld.append(json.loads("".join(self._ld).strip()))
            except Exception:
                self.jsonld.append({"_err": True})

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_ld:
            self._ld.append(data)


def fetch(url, fresh, raw, tries=4, timeout=30):
    """Returns {html, xrobots, final_url} or None. 4xx → page issue, no retry."""
    cf = cache_path(raw, url)
    if not fresh and cf.exists():
        print(f"  ⤿ cached {url}", file=sys.stderr, flush=True)
        return json.loads(cf.read_text())
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (HobbesSEO)"})
    last = None
    for attempt in range(1, tries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                charset = r.headers.get_content_charset() or "utf-8"
                data = {
                    "html": r.read().decode(charset, "replace"),
                    "xrobots": r.headers.get("X-Robots-Tag", "") or "",
                    "final_url": r.geturl(),
                }
            cf.write_text(json.dumps(data))
            print(f"  ✓ {url}", file=sys.stderr, flush=True)
            return data
        except urllib.error.HTTPError as e:
            if 400 <= e.code < 500:
                print(f"  ✗ {url}: HTTP {e.code}", file=sys.stderr, flush=True)
                return None
            last = f"HTTP {e.code}"
        except (urllib.error.URLError, TimeoutError) as e:
            last = str(e)
        print(f"  retry {attempt}/{tries} ({url}): {last}", file=sys.stderr, flush=True)
    print(f"  ✗ GAVE UP {url}: {last}", file=sys.stderr, flush=True)
    return None


def head_ok(levels):
    """No skipped level going deeper (h2 -> h4 fails). Going back up is fine."""
    prev = 0
    for lvl in levels:
        if prev and lvl > prev + 1:
            return False
        prev = lvl
    return True


def ld_types(objs):
    types, err = [], False
    for o in objs:
        if not isinstance(o, dict):
            continue
        if o.get("_err"):
            err = True
            continue
        graph = o.get("@graph")
        for it in (graph if isinstance(graph, list) else [o]):
            t = it.get("@type") if isinstance(it, dict) else None
            if t:
                types += t if isinstance(t, list) else [t]
    return types, err


def norm(u):
    p = urllib.parse.urlparse(u)
    return p.netloc.lower() + p.path.rstrip("/")


def analyze(url, data, dup_titles):
    """Turn one page's parsed data into a compact pass/fail cell per check."""
    p = Page()
    p.feed(data["html"])
    title = " ".join(p.title.split())
    m = p.metas

    t_cell = "✓" if (title and title not in dup_titles) else "✗"

    desc = m.get("description", "").strip()
    d_cell = "✓" if desc else "✗"

    c_cell = "✓" if (p.canonical and norm(p.canonical) == norm(data["final_url"])) else "✗"

    h_cell = "✓" if (p.h1 == 1 and head_ok(p.headings)) else "✗"

    types, err = ld_types(p.jsonld)
    good = [t for t in types if t in LD_KNOWN]
    sd_cell = "✓" if (good and not err) else "✗"

    missing_og = [r.replace("og:", "") for r in OG_REQUIRED if not m.get(r)]
    og_cell = "✓" if not missing_og else "✗"

    alt_cell = "✓" if p.imgs_no_alt == 0 else "✗"

    noindex = "noindex" in m.get("robots", "").lower() or "noindex" in data["xrobots"].lower()
    i_cell = "✗" if noindex else "✓"

    return {
        "Unique, descriptive title": t_cell,
        "Meta description present": d_cell,
        "Canonical correct": c_cell,
        "Single H1 + ordered headings": h_cell,
        "Valid structured data": sd_cell,
        "Open Graph / Twitter tags": og_cell,
        "All images have alt": alt_cell,
        "Indexable": i_cell,
        "_title": title or "(none)",
    }


def site_file(root, path):
    try:
        req = urllib.request.Request(root + path, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return "✓" if r.status == 200 else "✗"
    except Exception:
        return "✗"


def _quick_title(html):
    p = Page()
    p.feed(html)
    return p.title


def _root(urls):
    return "{0.scheme}://{0.netloc}".format(urllib.parse.urlparse(urls[0][1]))


def capture(raw, urls, fresh):
    """Fetch each golden page's HTML into raw/*.seo.json and the two site-level
    files (sitemap.xml, robots.txt presence) into raw/site.seo.json. Network
    side-effects ONLY. §E is rendered separately from raw/ by scorecard_section(),
    so baseline.py captures once then renders the same way seo.py does standalone."""
    with ThreadPoolExecutor(max_workers=min(MAX_CONCURRENCY, len(urls))) as ex:
        list(ex.map(lambda lu: fetch(lu[1], fresh, raw), urls))
    sc = site_cache(raw)
    if fresh or not sc.exists():
        root = _root(urls)
        sc.write_text(json.dumps({
            "sitemap.xml": site_file(root, "/sitemap.xml"),
            "robots.txt": site_file(root, "/robots.txt"),
        }))


def _load_pages(raw, urls):
    """Re-read each golden page's cached HTML and analyze it — the same data
    capture() fetched. Pure over raw/, so §E renders identically standalone or via
    baseline.py. Returns {label: analyze-dict or None}, with dup-title detection
    across all fetched pages (a title shared by two pages fails 'unique')."""
    data = {label: (json.loads(cache_path(raw, url).read_text())
                    if cache_path(raw, url).exists() else None)
            for label, url in urls}
    titles = [" ".join(_quick_title(d["html"]).split()) for d in data.values() if d]
    dup = {t for t in titles if titles.count(t) > 1 and t}
    return {label: (analyze(url, data[label], dup) if data[label] else None)
            for label, url in urls}


def _site_rows(raw, urls):
    """The sitemap.xml / robots.txt presence cells — from raw/site.seo.json when
    capture() cached them, else a live fetch (back-compat for an older raw/)."""
    sc = site_cache(raw)
    if sc.exists():
        s = json.loads(sc.read_text())
        return s.get("sitemap.xml", "✗"), s.get("robots.txt", "✗")
    root = _root(urls)
    return site_file(root, "/sitemap.xml"), site_file(root, "/robots.txt")


def scorecard_section(raw, urls):
    """Scorecard Section E (SEO checklist + site-level), rendered from raw/.
    The exact block baseline.py drops into the digest and seo.py prints under its
    standalone header. One renderer, two callers."""
    results = _load_pages(raw, urls)
    labels = [lbl for lbl, _ in urls]

    def cell(lbl, check):
        r = results.get(lbl)
        return r[check] if r else "— (fetch failed)"

    sitemap, robots = _site_rows(raw, urls)
    L = [
        "## E. SEO checklist (golden path)",
        "",
        "| Item | " + " | ".join(labels) + " |",
        "|" + "---|" * (len(labels) + 1),
        *[f"| {chk} | " + " | ".join(cell(lbl, chk) for lbl in labels) + " |" for chk in CHECKS],
        "",
        "| Site-level | Present |",
        "|---|---|",
        f"| sitemap.xml | {sitemap} |",
        f"| robots.txt | {robots} |",
    ]
    return "\n".join(L).rstrip()


def main():
    args = sys.argv[1:]
    fresh = "--fresh" in args
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
    results = _load_pages(raw, urls)              # for the page-titles list + fetch-failed note
    labels = [lbl for lbl, _ in urls]
    stamp = config.stamp()
    L = [
        f"# SEO results — {stamp}",
        "",
        "Captured by `hobbes/tools/seo.py` — scorecard Section E. Every cell is parsed",
        "from page HTML/headers. Alt-text shows COVERAGE only — a human judges",
        "whether the alt that exists is meaningful.",
        "",
        "Golden path: " + " · ".join(f"[{lbl}]({u})" for lbl, u in urls),
        "",
        scorecard_section(raw, urls),
        "",
        "## Page titles (read them — is any brand-only or generic?)",
        "",
        *[f"- **{lbl}:** {results[lbl]['_title']}" if results.get(lbl) else f"- **{lbl}:** —"
          for lbl in labels],
    ]
    failed = [lbl for lbl in labels if results.get(lbl) is None]
    if failed:
        L += ["", "> ✗ Fetch failed (cells show —): " + ", ".join(failed)]
    report = "\n".join(L) + "\n"

    print(report)                                 # stdout — human-readable standalone digest
    if out:                                        # --out only. no default per-tool file
        out.write_text(report)
        print(f"→ written to {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
