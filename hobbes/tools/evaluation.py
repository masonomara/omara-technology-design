#!/usr/bin/env python3
"""
evaluation.py — the problem catalog. Reads a cycle's raw artifacts and emits a
dense, deterministic 02-evaluation.md: every problem, with verbatim evidence, for an
agent. Step after baseline.py (which captures) and before the plan (which groups,
fixes, and rates effort/impact). See hobbes/templates/02-evaluation-template.md.

WHY DETERMINISTIC: findings get rebuilt every cycle. Same raw → same findings,
IDs and all. Everything here is extracted and sorted, never written fresh per
run. The fix, the effort, the impact, and the source-file root cause are NOT
here on purpose. Those are judgment, and judgment lives in the plan.

Sources, all under the cycle's raw/:
  raw/*.psi.json   — PSI/Lighthouse per golden page × mobile/desktop (A11Y, PERF, BP)
  raw/*.seo.json   — page HTML per golden page (SEO specifics, re-parsed)
  raw/crawl.json   — SiteOne whole-site crawl (sitewide SEO/A11Y/SEC/BP counts + detail)

USAGE:
  python3 hobbes/tools/evaluation.py                 # newest cycle folder with raw/
  python3 hobbes/tools/evaluation.py --run-dir DIR   # a specific cycle folder
  python3 hobbes/tools/evaluation.py --out PATH      # write elsewhere
"""

import json
import re
import sys
import urllib.parse
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
HOBBES = TOOLS.parent
sys.path.insert(0, str(TOOLS))
from crawl import count_for, detail_rows, header_set, rollup_texts, table_rows

# Reuse the capture tools' logic so findings can't drift from the scorecard.
from psi import DEFAULT_URLS, a11y_audit_failed
from psi import cache_path as psi_cache
from seo import OG_REQUIRED, Page, head_ok

import config

GOLDEN = {url: label for label, url in DEFAULT_URLS}
STRATS = ("mobile", "desktop")

# ── static knowledge overlay: id -> (what it is, why it matters / where it lives) ──
# the deterministic "how it works deeply". site-specific root cause stays for the plan.
A11Y_KNOW = {
    "button-name": (
        "A <button> has no accessible name.",
        "A screen reader announces it as just 'button'. This typically hits icon-only buttons — media zoom toggles, quantity steppers, drawer close icons — that need aria-label or visually-hidden text.",
    ),
    "image-alt": (
        "An <img> has no alt attribute.",
        "A screen reader skips it or reads the filename. These are usually content/card images; alt comes from the image's alt field in the CMS/admin or the template's <img> tag.",
    ),
    "link-name": (
        "A link has no discernible text.",
        "Announced as 'link' with no destination. Usually icon/image links missing aria-label.",
    ),
    "frame-title": (
        "An <iframe> has no title attribute.",
        "Announced with no purpose. Often a third-party embed (Mailchimp popup, video, map) we don't author directly — fix in the embed config or wrap it.",
    ),
    "label-content-name-mismatch": (
        "A control's visible text isn't contained in its accessible name.",
        "Voice-control users can't activate it by its visible label. Common on slideshow/hero slide links and pagination, where an aria-label omits the visible text.",
    ),
    "color-contrast": (
        "Text/background contrast is below WCAG AA.",
        "Low-vision users can't read it. Often sale/sold-out price text, placeholder grey, or button text on hover — a token/CSS value, not markup.",
    ),
    "heading-order": (
        "Headings skip a level (e.g. h3 with no h2).",
        "Breaks the document outline a screen reader navigates by. A common cause: card/sub titles (h3/h5) under a section with no h2.",
    ),
}
# SiteOne's whole-site a11y analyses (HTML-report detail), keyed by table class:
# (display name, why it matters, the summary-rollup needle for the page count).
CRAWL_A11Y_KNOW = {
    "missing-aria-labels": (
        "Missing aria labels",
        "An interactive element has no accessible name (aria-label / aria-labelledby). A screen reader announces it by role alone — 'button', 'link', 'textbox'. This hits icon-only controls and unlabeled inputs like the search box.",
        "without aria",
    ),
    "missing-roles": (
        "Missing roles",
        "A landmark or interactive element has no role, so assistive tech can't place it in the page structure or navigate to it.",
        "without role",
    ),
    "missing-image-alt-attributes": (
        "Missing image alt",
        "An <img> has no alt attribute. A screen reader skips it or reads the filename. These are content/card images; alt comes from the admin image field or the template <img>.",
        "without image alt",
    ),
    "missing-html-lang-attribute": (
        "Missing html lang",
        "The page's <html> has no lang attribute, so a screen reader can't choose the right pronunciation.",
        "without html lang",
    ),
    "missing-labels": (
        "Missing form labels",
        "A form control has no associated <label>. The field is announced with no name, so its purpose is unclear.",
        "without form label",
    ),
}
BP_KNOW = {
    "errors-in-console": (
        "JavaScript errors logged to the browser console.",
        "Each is a script failing at runtime — broken behavior, often from a third-party embed or a first-party script. Read the messages; they name the file.",
    ),
    "deprecations": (
        "Use of a deprecated browser API.",
        "Will break in a future browser version. Usually inside a third-party script.",
    ),
    "image-aspect-ratio": (
        "An image is displayed at a ratio that doesn't match its file.",
        "Looks stretched/squashed; can also shift layout. A width/height or CSS sizing mismatch.",
    ),
    "inspector-issues": (
        "Issues Chrome's Issues panel flagged (cookies, mixed content, etc.).",
        "Browser-level warnings; open the raw audit for the specifics.",
    ),
}


def latest_run_dir():
    base = HOBBES / "cycle"
    cands = sorted(
        (d for d in base.glob("[0-9]" * 4 + "-*") if (d / "raw").is_dir()), reverse=True
    )
    if not cands:
        sys.exit(f"✗ no cycle folder with raw/ under {base}")
    return cands[0]


def trunc(s, n):
    s = " ".join((s or "").split())
    return s if len(s) <= n else s[: n - 1] + "…"


def kb(n):
    return f"{round((n or 0) / 1024)} KB"


def ms(n):
    return f"{round(n or 0)} ms"


def short_url(u):
    if not u:
        return ""
    p = urllib.parse.urlparse(u)
    tail = (p.path or "/").split("/")[-1] or p.path
    return trunc((tail + (("?" + p.query) if p.query else "")) or u, 60)


_SEV_RANK = {"critical": 0, "warning": 1, "notice": 2, "ok": 3}


def detail_evidence(rows, cap=6):
    """Turn HTML-report detail rows into catalog evidence: the offending element,
    its occurrence count and severity, and the affected URLs (paths). Critical
    first, then heaviest by occurrence, capped with an explicit +N — never
    silently trimmed."""
    rows = sorted(rows, key=lambda r: (_SEV_RANK.get(r.get("severity"), 9), -r.get("occurs", 0)))
    ev = []
    for r in rows[:cap]:
        urls = [urllib.parse.urlparse(u).path or u for u in r.get("urls", [])[:3]]
        more = len(r.get("urls", [])) - len(urls)
        loc = ", ".join(urls) + (f" (+{more} more)" if more > 0 else "")
        mark = trunc(r.get("detail", ""), 110)
        head = f"[{r['severity']}] ×{r['occurs']}"
        ev.append(f"{head} · `{mark}`" + (f" · {loc}" if loc else ""))
    if len(rows) > cap:
        ev.append(f"(+{len(rows) - cap} more pattern(s) — see raw/crawl-report.html)")
    return ev


# ── loaders ──────────────────────────────────────────────────────────────────
def load_psi(raw):
    out = {}
    for label, url in DEFAULT_URLS:
        for strat in STRATS:
            f = psi_cache(raw, url, strat)
            if f.exists():
                lh = json.loads(f.read_text()).get("lighthouseResult", {})
                out[(label, strat)] = lh
    return out


def load_seo(raw):
    out = {}
    for label, url in DEFAULT_URLS:
        slug = "".join(c if c.isalnum() else "_" for c in url)[:80]
        f = raw / f"{slug}.seo.json"
        if f.exists():
            out[label] = json.loads(f.read_text()).get("html", "")
    return out


def load_crawl(raw):
    f = raw / "crawl.json"
    return json.loads(f.read_text()) if f.exists() else None


class RichPage(Page):
    """seo.py's Page, plus the specifics findings needs: image srcs and heading text."""

    def __init__(self):
        super().__init__()
        self.img_list = []  # (src, alt-or-None)
        self.heading_list = []  # [level, text]
        self._cur_h = None

    def handle_starttag(self, tag, attrs):
        super().handle_starttag(tag, attrs)
        a = dict(attrs)
        if tag == "img":
            self.img_list.append((a.get("src", ""), a.get("alt")))
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._cur_h = [int(tag[1]), ""]
            self.heading_list.append(self._cur_h)

    def handle_endtag(self, tag):
        super().handle_endtag(tag)
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._cur_h = None

    def handle_data(self, data):
        super().handle_data(data)
        if self._cur_h is not None:
            self._cur_h[1] += data


def parse_page(html):
    p = RichPage()
    p.feed(html or "")
    return p


# ── domain extractors: each returns a list of finding dicts ──────────────────
def F(title, what, why, source, target, measured, golden, site, evidence):
    return dict(
        title=title,
        what=what,
        why=why,
        source=source,
        target=target,
        measured=measured,
        golden=golden,
        site=site,
        evidence=evidence,
    )


def a11y_findings(psi, crawl):
    agg = {}  # rule -> {pages:set, nodes:{selector:snippet}, title}
    for (label, strat), lh in psi.items():
        cat = lh.get("categories", {}).get("accessibility", {})
        au = lh.get("audits", {})
        for ref in cat.get("auditRefs", []):
            a = au.get(ref["id"], {})
            if a11y_audit_failed(
                a
            ):  # shared predicate with psi.py. scorecard §D and this catalog can't disagree
                e = agg.setdefault(
                    ref["id"],
                    {"pages": set(), "nodes": {}, "title": a.get("title", "")},
                )
                e["pages"].add(f"{label} — {strat}")
                for it in a.get("details", {}).get("items", []):
                    nd = it.get("node", {}) or {}
                    sel = nd.get("selector") or ""
                    if sel:
                        e["nodes"][sel] = (nd.get("snippet") or "").strip()
    out = []
    for rule in sorted(agg, key=lambda r: (-len(agg[r]["nodes"]), r)):
        e = agg[rule]
        what, why = A11Y_KNOW.get(
            rule, (e["title"] or rule, "Failing axe-core accessibility check.")
        )
        nodes = sorted(e["nodes"].items())
        ev = []
        for sel, snip in nodes[:3]:
            ev.append(f"`{trunc(sel, 100)}`")
            if snip:
                ev.append(f"  ↳ {trunc(snip, 120)}")
        if len(nodes) > 3:
            ev.append(f"(+{len(nodes) - 3} more node(s) — see raw/*.psi.json)")
        out.append(
            F(
                f"{rule} — {len(nodes)} node(s)",
                what,
                why,
                f"PSI Lighthouse · accessibility · `{rule}`",
                "0 failing a11y audits (BASELINE §D)",
                f"{len(nodes)} node(s), {len(e['pages'])} run(s)",
                ", ".join(sorted(e["pages"])),
                "",
                ev,
            )
        )
    # sitewide a11y from the crawl. one finding per SiteOne analysis, carrying the
    # offending element, its occurrence count, and the affected URLs from the HTML
    # report. PSI rules above stay authoritative for the golden path. this is the
    # scale AND the specifics beyond it.
    tables = crawl.get("tables", {})
    n = len(table_rows(tables, "seo"))
    texts = rollup_texts(crawl)
    by_analysis = {}
    for r in detail_rows(crawl, domain="accessibility"):
        by_analysis.setdefault(r["analysis"], []).append(r)
    if by_analysis:
        for analysis in sorted(
            by_analysis, key=lambda a: -sum(x["occurs"] for x in by_analysis[a])
        ):
            rows = by_analysis[analysis]
            name, why, needle = CRAWL_A11Y_KNOW.get(
                analysis,
                (analysis.replace("-", " ").capitalize(),
                 "Accessibility issue SiteOne flagged across the site.", ""),
            )
            crit = sum(1 for x in rows if x["severity"] == "critical")
            occ = sum(x["occurs"] for x in rows)
            pages = count_for(texts, needle) if needle else 0
            measured = f"{occ} element(s) across {len(rows)} pattern(s)"
            if crit:
                measured += f" · {crit} critical"
            out.append(
                F(
                    f"{name} (sitewide)",
                    f"{name} — flagged across the crawl.",
                    why,
                    "SiteOne crawl · accessibility detail",
                    "0 issues (BASELINE §F)",
                    measured,
                    "",
                    f"{pages} page(s)" if pages else f"{n} pages crawled",
                    detail_evidence(rows),
                )
            )
    else:
        # fallback for an old cache crawled before the HTML report was parsed:
        # the blunt per-analysis counts from the JSON table.
        acc = [
            r
            for r in table_rows(tables, "accessibility")
            if int(r.get("critical") or 0) + int(r.get("warning") or 0) > 0
        ]
        if acc:
            acc.sort(key=lambda r: -(int(r.get("critical") or 0) + int(r.get("warning") or 0)))
            total = sum(int(r.get("critical") or 0) + int(r.get("warning") or 0) for r in acc)
            out.append(
                F(
                    "Sitewide a11y prevalence",
                    "How widespread the a11y gaps are across the whole site — element-level counts.",
                    "SiteOne's per-analysis totals over every crawled page. The PSI rules above are authoritative for the golden path; this shows the scale beyond it.",
                    "SiteOne crawl · accessibility table",
                    "0 issues (BASELINE §F)",
                    f"{total} flagged element(s) across {n} pages",
                    "",
                    f"{n} pages crawled",
                    [
                        f"{r.get('analysisName')}: {int(r.get('critical') or 0)} critical, "
                        f"{int(r.get('warning') or 0)} warning"
                        for r in acc
                    ],
                )
            )
    return out


def seo_findings(seo_html, crawl):
    tables = crawl.get("tables", {})
    texts = rollup_texts(crawl)
    seo_rows = table_rows(tables, "seo")
    n = len(seo_rows)
    parsed = {lbl: parse_page(html) for lbl, html in seo_html.items()}
    out = []

    # 1 — missing meta descriptions
    miss_desc = sorted(
        (r.get("urlPathAndQuery") or "/")
        for r in seo_rows
        if not (r.get("description") or "").strip()
    )
    g_desc = [
        lbl for lbl, p in parsed.items() if not p.metas.get("description", "").strip()
    ]
    if miss_desc or g_desc:
        out.append(
            F(
                "Missing meta descriptions",
                "Pages with no <meta name=description>.",
                "Google then invents the SERP snippet from page text — usually worse copy, lower click-through. Listing/policy/system pages often have none unless the template or CMS sets one.",
                "SiteOne crawl · seo table  ·  seo.py · golden path",
                "Every page (BASELINE §E + §F)",
                f"{len(miss_desc)} of {n} sitewide; golden: {', '.join(g_desc) or 'none'}",
                ", ".join(g_desc),
                f"{len(miss_desc)} / {n}",
                [p for p in miss_desc] or ["(none sitewide)"],
            )
        )

    # 2 — heading structure (single-h1 + order)
    multi_h1 = count_for(texts, "multiple <h1>")
    skipped = count_for(texts, "skipped heading")
    head_rows = sorted(
        (
            r
            for r in table_rows(tables, "seo-headings")
            if int(r.get("headingsErrorsCount") or 0) > 0
        ),
        key=lambda r: (
            -int(r.get("headingsErrorsCount") or 0),
            r.get("urlPathAndQuery") or "",
        ),
    )
    ev = []
    for lbl, p in parsed.items():
        if p.h1 != 1 or not head_ok(p.headings):
            tree = " → ".join(f"h{lv}" for lv in p.headings[:12]) + (
                "…" if len(p.headings) > 12 else ""
            )
            ev.append(
                f"golden {lbl}: {p.h1} h1, order {'ok' if head_ok(p.headings) else 'BROKEN'} — {tree}"
            )
    for r in head_rows[:8]:
        levels = re.findall(r"<h([1-6])", r.get("headings") or "")
        tree = " → ".join(f"h{lv}" for lv in levels[:12]) + (
            "…" if len(levels) > 12 else ""
        )
        ev.append(
            f"{r.get('urlPathAndQuery')}: {r.get('headingsErrorsCount')} error(s) — {tree}"
        )
    if len(head_rows) > 8:
        ev.append(f"(+{len(head_rows) - 8} more page(s) with heading errors)")
    if ev:
        out.append(
            F(
                "Heading structure (single H1 + order)",
                "Pages with no/multiple H1 or a skipped heading level.",
                "Headings are the outline assistive tech and search engines read. A skipped level (h1→h3) or a second h1 breaks that outline. A common cause: section/card heading levels (h2/h3/h5) drift when sections are reordered or a banner ships an h1.",
                "SiteOne crawl · seo-headings  ·  seo.py · golden path",
                "Single H1 + ordered headings, all pages (BASELINE §E/§F)",
                f"{multi_h1} multi-H1, {skipped} skipped-level of {n}",
                ", ".join(
                    lbl
                    for lbl, p in parsed.items()
                    if p.h1 != 1 or not head_ok(p.headings)
                ),
                f"{len(head_rows)} / {n} pages with heading errors",
                ev,
            )
        )

    # 3 — image alt coverage (golden specifics; node detail is in A11Y)
    ev, g_alt = [], []
    for lbl, p in parsed.items():
        missing = [
            src for src, alt in p.img_list if alt is None or not (alt or "").strip()
        ]
        if missing:
            g_alt.append(lbl)
            ev.append(
                f"golden {lbl}: {len(missing)} of {len(p.img_list)} img(s) missing alt"
            )
            for src in missing[:3]:
                ev.append(f"  ↳ {short_url(src)}")
            if len(missing) > 3:
                ev.append(f"  (+{len(missing) - 3} more on this page)")
    if ev:
        out.append(
            F(
                "Image alt coverage",
                "Images on the page with no alt attribute (coverage, not quality).",
                "Same gap as the A11Y image-alt rule, seen from the SEO side. Coverage only — whether the alt that exists is meaningful is the manual pass. Content/card images get alt from the CMS/admin image field or the template <img>.",
                "seo.py · golden path",
                "All images have alt (BASELINE §E)",
                f"golden pages failing: {', '.join(g_alt)}",
                ", ".join(g_alt),
                "",
                ev,
            )
        )

    # 4 — Open Graph / Twitter
    og_rows = table_rows(tables, "open-graph")
    og_miss = sorted(
        (r.get("urlPathAndQuery") or "/")
        for r in og_rows
        if not (r.get("ogTitle") or "").strip() or not (r.get("ogImage") or "").strip()
    )
    ev = []
    for lbl, p in parsed.items():
        gone = [r.replace("og:", "") for r in OG_REQUIRED if not p.metas.get(r)]
        if gone:
            ev.append(f"golden {lbl}: missing {', '.join(gone)}")
    if ev or og_miss:
        ev += [f"sitewide: {len(og_miss)} of {n} page(s) missing og:title or og:image"]
        out.append(
            F(
                "Open Graph / Twitter tags",
                "Pages missing og:title/og:image (and the rest of the OG/Twitter set).",
                "These control the link preview when the page is shared (social, iMessage, etc.). Missing them = an ugly or blank share card. Set in the document <head>; many templates ship them but custom pages can drop them.",
                "seo.py · golden path  ·  SiteOne crawl · open-graph",
                "OG/Twitter present, all pages",
                f"{len(og_miss)} of {n} sitewide",
                ", ".join(
                    lbl
                    for lbl, p in parsed.items()
                    if any(not p.metas.get(r) for r in OG_REQUIRED)
                ),
                f"{len(og_miss)} / {n}",
                ev,
            )
        )

    # 5 — duplicate titles
    dups = [
        r
        for r in table_rows(tables, "non-unique-titles")
        if (r.get("title") or "").strip()
    ]
    if dups:
        out.append(
            F(
                "Duplicate page titles",
                "Two or more pages share an identical <title>.",
                "Search engines can't tell the pages apart and may pick the wrong one to rank. Usually two collections/pages built from the same title source.",
                "SiteOne crawl · non-unique-titles",
                "0 duplicate titles (BASELINE §F)",
                f"{len(dups)} duplicated title(s)",
                "",
                "",
                [f'"{trunc(r.get("title"), 70)}" ×{r.get("count")}' for r in dups],
            )
        )

    # 6 — duplicate meta descriptions (distinct from missing; empties overlap #1)
    dup_desc = sorted(
        (
            r
            for r in table_rows(tables, "non-unique-descriptions")
            if (r.get("description") or "").strip() and int(r.get("count") or 0) > 1
        ),
        key=lambda r: -int(r.get("count") or 0),
    )
    if dup_desc:
        out.append(
            F(
                "Duplicate meta descriptions",
                "Two or more pages share an identical meta description.",
                "Duplicate descriptions blur how pages differ in search and weaken each snippet; templated descriptions repeated across products/collections are the usual cause. (Empty descriptions are counted in the missing-description finding above, not here.)",
                "SiteOne crawl · non-unique-descriptions",
                "0 duplicate descriptions (BASELINE §F)",
                f"{len(dup_desc)} duplicated description(s)",
                "",
                "",
                [
                    f'"{trunc(r.get("description"), 70)}" ×{r.get("count")}'
                    for r in dup_desc
                ],
            )
        )

    # 7 — broken links
    broken = table_rows(tables, "404")
    if broken:
        out.append(
            F(
                "Broken links (4xx/5xx)",
                "A linked URL returns an error status.",
                "Dead end for users and crawlers; wastes crawl budget and leaks link equity. Fix the link or restore/redirect the target.",
                "SiteOne crawl · 404 table",
                "0 broken links (BASELINE §F)",
                f"{len(broken)} broken",
                "",
                "",
                [f"{r.get('url')} ({r.get('statusCode')})" for r in broken],
            )
        )
    return out


# The bare timing metrics. These ARE the numbers in scorecard §A/§B, not
# resource-level opportunities, so they ride the overview finding, not their own
# block. Everything else in the performance category is enumerated (no allowlist).
# A hand-keyed list of audit ids silently drops audits the moment Lighthouse
# renames one (it renamed most to the `*-insight` family), which is exactly the
# rot this rewrite removes.
PERF_METRIC_AUDITS = {
    "first-contentful-paint",
    "largest-contentful-paint",
    "speed-index",
    "total-blocking-time",
    "interactive",
    "max-potential-fid",
    "cumulative-layout-shift",
    "first-meaningful-paint",
}


def lh_text(audit):
    """Lighthouse's own title + description, cleaned of markdown links. Using the
    tool's own copy means a new/renamed audit can never land here blank or be
    dropped. There is no id we have to recognise first."""
    title = (audit.get("title") or "").strip()
    desc = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", (audit.get("description") or ""))
    desc = re.sub(r"\s+", " ", desc).strip()
    return title, desc


def _item_url(it):
    s = it.get("source")
    if isinstance(s, dict):
        s = s.get("url")
    return it.get("url") or s or it.get("groupLabel") or it.get("group") or ""


def _item_label(it):
    """A printable identity for any Lighthouse details item, however shaped:
    a URL, else a DOM node (label/selector/snippet), else a reason/cause string.
    Returns None when nothing usable is present. The item is then skipped and the
    audit falls back to its Lighthouse displayValue — never dropped."""
    if not isinstance(it, dict):
        return trunc(str(it), 90)
    s = it.get("source")
    if isinstance(s, dict):
        s = s.get("url")
    u = it.get("url") or s
    if isinstance(u, str) and u.startswith("http"):
        return short_url(u)
    node = it.get("node")
    if isinstance(node, dict):
        lbl = node.get("nodeLabel") or node.get("selector") or node.get("snippet")
        if lbl:
            return trunc(lbl, 90)
    if isinstance(u, str) and u.strip():
        return trunc(u, 90)
    for k in ("reason", "cause", "groupLabel", "label"):
        if it.get(k):
            return trunc(str(it[k]), 90)
    return None


def _item_bytes(it):
    return it.get("wastedBytes") or it.get("totalBytes") or it.get("transferSize") or 0


def _item_ms(it):
    return (
        it.get("wastedMs")
        or it.get("duration")
        or it.get("blockingTime")
        or it.get("reflowTime")
        or it.get("total")
        or 0
    )


def _flatten_items(items):
    """Yield leaf detail items. The `*-insight` audits wrap a sub-table or
    checklist one level down (details.items → [{type:table/checklist, items:…}]).
    Flatten those so the real rows (a source URL, a failing check, a culprit node)
    surface instead of an opaque wrapper."""
    if isinstance(items, dict):  # checklist {key:{label,value}}
        for v in items.values():
            if isinstance(v, dict) and "value" in v and v.get("label"):
                if v.get("value") is False:
                    yield {"label": v["label"]}
            elif isinstance(v, dict):
                yield from _flatten_items(v)
        return
    if isinstance(items, list):
        for it in items:
            if (
                isinstance(it, dict)
                and isinstance(it.get("items"), (list, dict))
                and not (it.get("url") or it.get("node"))
            ):
                yield from _flatten_items(it["items"])
            else:
                yield it


def perf_findings(psi, crawl):
    out = []
    # ── overview: lab perf + the metrics behind it, per page × device ──
    # the score range is computed from the runs, not hand-typed, so it can't drift.
    ev, scores = [], []
    for label, url in DEFAULT_URLS:
        for strat in STRATS:
            lh = psi.get((label, strat))
            if not lh:
                continue
            au = lh.get("audits", {})

            def num(aid, div=1000, nd=2):
                v = au.get(aid, {}).get("numericValue")
                return round(v / div, nd) if v is not None else "—"

            perf = lh.get("categories", {}).get("performance", {}).get("score")
            perf = round(perf * 100) if perf is not None else None
            if isinstance(perf, int):
                scores.append(perf)
            warns = lh.get("runWarnings") or []
            cut = (
                " ✗cut" if any("loaded too slowly" in w.lower() for w in warns) else ""
            )
            ev.append(
                f"{label} — {strat}: perf {perf if perf is not None else '—'}{cut} · "
                f"LCP {num('largest-contentful-paint')}s · TBT {num('total-blocking-time', 1, 0)}ms · "
                f"SI {num('speed-index')}s · CLS {num('cumulative-layout-shift', 1, 3)}"
            )
    rng = f"{min(scores)}–{max(scores)}" if scores else "—"
    out.append(
        F(
            "Lab performance below target",
            "Lighthouse Performance score and the lab metrics behind it, per page × device.",
            "PSI's mobile run is a fixed heavy throttle (Moto G4 / slow-4G / 4× CPU), so mobile scores run far below desktop and a heavy page can be cut before network-idle (LCP marked ✗cut — treat that LCP as unknown, not as the failure). Cross-check the real-user verdict in 01-baseline.md §C: CrUX may already pass even where lab fails. The pass bar is still lab ≥ 90.",
            "PSI Lighthouse · performance",
            "Performance ≥ 90, mobile + desktop (BASELINE Targets)",
            f"score range {rng} across runs (see §A)",
            "all golden pages × device",
            "",
            ev,
        )
    )

    # ── every other failing perf audit, enumerated — NO allowlist ──
    # each audit's items are merged across the mobile runs (where perf fails). when
    # an audit carries no clean resource list, its Lighthouse displayValue stands in
    # as evidence, so a finding is emitted either way and nothing is silently lost.
    agg = {}  # aid -> {runs:set, title, desc, merged:{label:(bytes,ms)}, disp:set}
    for label, url in DEFAULT_URLS:
        lh = psi.get((label, "mobile"))
        if not lh:
            continue
        cat = lh.get("categories", {}).get("performance", {})
        au = lh.get("audits", {})
        for ref in cat.get("auditRefs", []):
            aid = ref["id"]
            if aid in PERF_METRIC_AUDITS:
                continue
            a = au.get(aid, {})
            if a.get("score") is None or a.get("score") >= 1:
                continue
            title, desc = lh_text(a)
            e = agg.setdefault(
                aid,
                {
                    "runs": set(),
                    "title": title,
                    "desc": desc,
                    "merged": {},
                    "disp": set(),
                },
            )
            e["runs"].add(label)
            dv = (a.get("displayValue") or "").strip()
            if dv:
                e["disp"].add(dv)
            for it in _flatten_items((a.get("details") or {}).get("items")):
                lbl = _item_label(it)
                if not lbl:
                    continue
                b, m = _item_bytes(it), _item_ms(it)
                pb, pm = e["merged"].get(lbl, (0, 0))
                e["merged"][lbl] = (max(pb, b), max(pm, m))
    for aid in sorted(
        agg, key=lambda a: (-len(agg[a]["merged"]), -len(agg[a]["runs"]), a)
    ):
        e = agg[aid]
        rows = sorted(
            e["merged"].items(), key=lambda kv: (-(kv[1][0]), -(kv[1][1]), kv[0])
        )
        ev = []
        for k, (b, m) in rows[:8]:
            parts = [k]
            if b:
                parts.append(kb(b))
            if m:
                parts.append(ms(m))
            ev.append(" · ".join(parts))
        if len(rows) > 8:
            ev.append(f"(+{len(rows) - 8} more — see raw/*.psi.json)")
        if not ev:
            ev = sorted(e["disp"]) or ["(see raw/*.psi.json)"]
        tot_b = sum(b for _, (b, _) in rows)
        tot_m = sum(m for _, (_, m) in rows)
        disp = " · ".join(sorted(e["disp"]))
        if rows and tot_b:
            measured = f"{kb(tot_b)} across {len(rows)} resource(s)"
        elif rows and tot_m:
            measured = f"{ms(tot_m)} across {len(rows)} resource(s)"
        else:
            measured = disp or f"flagged on {len(e['runs'])} page(s)"
        out.append(
            F(
                e["title"] or aid,
                (e["desc"] or f"Lighthouse performance opportunity ({aid})."),
                "",
                f"PSI Lighthouse · performance · `{aid}` (mobile runs)",
                "Performance ≥ 90 (BASELINE Targets)",
                measured,
                "golden pages, mobile",
                "",
                ev,
            )
        )

    # ── sitewide: slowest URLs by server response (the crawl's own timing) ──
    slow = table_rows(crawl.get("tables", {}), "slowest-urls")
    if slow:
        rows = sorted(slow, key=lambda r: -float(r.get("requestTime") or 0))
        ev = [
            f"{short_url(r.get('url'))} · {float(r.get('requestTime') or 0):.2f}s ({r.get('statusCode')})"
            for r in rows[:12]
        ]
        if len(rows) > 12:
            ev.append(f"(+{len(rows) - 12} more — see raw/crawl.json)")
        out.append(
            F(
                "Slowest URLs (server response, sitewide)",
                "The slowest pages to respond across the whole crawl — server response / TTFB-class timing.",
                "SiteOne's per-URL request timing, a broad complement to the golden-path lab metrics. Slow server response delays everything downstream; a consistently slow template or collection is worth a look even when the golden path looks fine.",
                "SiteOne crawl · slowest-urls",
                "Fast server response, all pages (BASELINE Targets)",
                f"slowest {float(rows[0].get('requestTime') or 0):.2f}s; top {len(rows)} listed",
                "",
                f"{len(rows)} slowest of crawl",
                ev,
            )
        )
    return out


def sec_findings(crawl):
    tables = crawl.get("tables", {})
    texts = rollup_texts(crawl)
    out = []
    want = [
        ("Strict-Transport-Security", "HSTS"),
        ("Content-Security-Policy", "CSP"),
        ("Referrer-Policy", "Referrer-Policy"),
        ("Permissions-Policy", "Permissions-Policy"),
    ]
    recs = {r.get("header"): r for r in table_rows(tables, "security")}
    sec_detail = detail_rows(crawl, domain="security")
    ev = []
    for hdr, short in want:
        if not header_set(tables, hdr):
            r = recs.get(hdr, {})
            occ = sum(d["occurs"] for d in sec_detail if d.get("detail", "").startswith(hdr))
            scale = f" ({occ} responses)" if occ else ""
            ev.append(f"{short}: not set{scale} — {trunc(r.get('recommendation', ''), 110)}")
    if ev:
        out.append(
            F(
                "Missing security response headers",
                "Standard hardening headers absent from responses.",
                "These reduce XSS, clickjacking, and referrer-leak exposure. On a hosted platform the host often sets some headers and limits what the app/template can add — CSP/HSTS especially may be platform-controlled. Confirm what's actually settable before treating each as fully fixable.",
                "SiteOne crawl · security table",
                "All present (BASELINE §F)",
                f"{len(ev)} of {len(want)} missing",
                "",
                "all responses",
                ev,
            )
        )
    # CORS wildcard, if flagged
    cors = recs.get("Access-Control-Allow-Origin")
    if cors and (int(cors.get("critical") or 0) + int(cors.get("warning") or 0)) > 0:
        out.append(
            F(
                "Access-Control-Allow-Origin: *",
                "A response allows any origin to read it.",
                "Usually fine for public CDN assets, a risk if it's on anything credentialed. Check which responses carry it.",
                "SiteOne crawl · security table",
                "No over-permissive CORS",
                "flagged",
                "",
                "flagged responses",
                [trunc(cors.get("recommendation", ""), 140)],
            )
        )
    # Brotli
    no_brotli = count_for(texts, "brotli")
    if no_brotli:
        n = len(table_rows(tables, "seo"))
        out.append(
            F(
                "No Brotli compression",
                "Responses aren't served with Brotli.",
                "Brotli beats gzip on text (HTML/CSS/JS), trimming transfer bytes. On a hosted platform this is often platform-controlled — likely not app-fixable; record as a platform note unless proven otherwise.",
                "SiteOne crawl · summary rollup",
                "Brotli on (BASELINE §F)",
                f"{no_brotli} of {n} pages",
                "",
                f"{no_brotli} / {n}",
                [f"{no_brotli} page(s) served without Brotli"],
            )
        )
    return out


def bp_findings(psi, crawl):
    out = []
    # PSI best-practices failures aggregated across runs
    agg = {}
    for (label, strat), lh in psi.items():
        cat = lh.get("categories", {}).get("best-practices", {})
        au = lh.get("audits", {})
        for ref in cat.get("auditRefs", []):
            a = au.get(ref["id"], {})
            if (
                a.get("score") is not None
                and a.get("score") < 1
                and a.get("scoreDisplayMode") in ("binary", "numeric", "metricSavings")
            ):
                e = agg.setdefault(
                    ref["id"],
                    {"pages": set(), "title": a.get("title", ""), "items": {}},
                )
                e["pages"].add(f"{label} — {strat}")
                for it in a.get("details", {}).get("items", []):
                    desc = (
                        it.get("description") or it.get("reason") or _item_url(it) or ""
                    )
                    if desc:
                        e["items"][trunc(desc, 120)] = True
    for aid in sorted(agg, key=lambda a: (-len(agg[a]["pages"]), a)):
        e = agg[aid]
        what, why = BP_KNOW.get(
            aid, (e["title"] or aid, "Lighthouse best-practice failure.")
        )
        ev = list(e["items"])[:4]
        if len(e["items"]) > 4:
            ev.append(f"(+{len(e['items']) - 4} more)")
        out.append(
            F(
                f"{aid}",
                what,
                why,
                f"PSI Lighthouse · best-practices · `{aid}`",
                "Best Practices ≥ 95 (BASELINE Targets)",
                f"on {len(e['pages'])} run(s)",
                ", ".join(sorted(e["pages"])),
                "",
                ev or ["(see raw/*.psi.json)"],
            )
        )
    # crawl structural. enumerate every flagged row of the best-practices table,
    # so a new SiteOne check can't fall through a hardcoded needle list. curated
    # context where we have it. the analysis name itself otherwise.
    BP_CRAWL_WHY = {
        "Invalid inline SVGs": "Malformed inline SVG markup — can render wrong or bloat the DOM. Usually a template partial or a third-party-injected icon.",
        "Duplicate inline SVGs": "The same SVG inlined many times instead of defined once and referenced (<use>). Minor HTML bloat; common where an icon set is inlined per use — low priority.",
        "Non-clickable phone numbers": "A phone number shown as text with no tel: link. On mobile it can't be tapped to call.",
        "Large inline SVGs": "Oversized inline SVGs bloat the HTML payload — consider an external asset or <use> reference.",
        "DOM depth": "Deeply nested DOM raises style/layout cost and memory. Usually a section/snippet nesting issue.",
    }
    # SiteOne's best-practices table folds in checks other domains already own.
    # skip them here so a problem is reported once, in its home section.
    BP_CRAWL_SKIP = {
        "Heading structure",
        "Title uniqueness",
        "Description uniqueness",
        "Brotli support",
    }
    tables = crawl.get("tables", {})
    n = len(table_rows(tables, "seo"))
    bp_rows = [
        r
        for r in table_rows(tables, "best-practices")
        if (r.get("analysisName") not in BP_CRAWL_SKIP)
        and int(r.get("critical") or 0) + int(r.get("warning") or 0) > 0
    ]
    bp_rows.sort(
        key=lambda r: -(int(r.get("critical") or 0) + int(r.get("warning") or 0))
    )
    for r in bp_rows:
        name = r.get("analysisName") or "best-practice issue"
        crit, warn = int(r.get("critical") or 0), int(r.get("warning") or 0)
        why = BP_CRAWL_WHY.get(
            name,
            "Structural/best-practice issue SiteOne flagged across the site.",
        )
        drows = detail_rows(crawl, analysis=name.lower().replace(" ", "-"))
        if drows:
            # the report detail is the truth for severity AND evidence — the JSON
            # count table can disagree, so report both from the same source.
            dcrit = sum(1 for d in drows if d["severity"] == "critical")
            occ = sum(d["occurs"] for d in drows)
            measured = f"{occ} element(s) across {len(drows)} pattern(s)"
            if dcrit:
                measured += f" · {dcrit} critical"
            ev = detail_evidence(drows)
        else:
            measured = f"{crit} critical, {warn} warning"
            ev = [f"{crit} critical, {warn} warning — see raw/crawl-report.html"]
        out.append(
            F(
                name,
                f"{name} — flagged sitewide by the crawl.",
                why,
                "SiteOne crawl · best-practices detail",
                "0 issues (BASELINE §F)",
                measured,
                "",
                f"of {n} pages",
                ev,
            )
        )
    return out


# ── render ───────────────────────────────────────────────────────────────────
def render_finding(fid, f):
    L = [
        f"### {fid} · {f['title']}",
        f"- **What / why:** {' '.join(x for x in (f['what'], f['why']) if x)}",
        f"- **Source:** {f['source']}",
        f"- **Target → measured:** {f['target']} → {f['measured']}",
    ]
    scope = []
    if f["golden"]:
        scope.append(f"golden path: {f['golden']}")
    if f["site"]:
        scope.append(f"sitewide: {f['site']}")
    if scope:
        L.append(f"- **Scope:** {' · '.join(scope)}")
    L.append("- **Evidence:**")
    L += [f"  - {line}" for line in f["evidence"]]
    return L


DOMAINS = [
    ("A11Y", "Accessibility", ""),
    ("SEO", "SEO & discoverability", ""),
    ("PERF", "Performance", ""),
    ("SEC", "Security", ""),
    ("BP", "Best practices / structure", ""),
]


def main():
    args = sys.argv[1:]
    rd = (
        Path(args[args.index("--run-dir") + 1])
        if "--run-dir" in args
        else latest_run_dir()
    )
    out = (
        Path(args[args.index("--out") + 1])
        if "--out" in args
        else rd / "02-evaluation.md"
    )
    raw = rd / "raw"
    if not raw.is_dir():
        sys.exit(f"✗ no raw/ in {rd}")

    psi = load_psi(raw)
    seo_html = load_seo(raw)
    crawl = load_crawl(raw)
    if crawl is None:
        sys.exit(f"✗ no crawl.json in {raw}")

    sections = {
        "A11Y": a11y_findings(psi, crawl),
        "SEO": seo_findings(seo_html, crawl),
        "PERF": perf_findings(psi, crawl),
        "SEC": sec_findings(crawl),
        "BP": bp_findings(psi, crawl),
    }

    site = urllib.parse.urlparse(DEFAULT_URLS[0][1])
    stamp = config.stamp()
    total = sum(len(v) for v in sections.values())
    L = [
        f"# Findings — {rd.name}",
        "",
        f"Site: {site.scheme}://{site.netloc}/ · Generated {stamp} by `hobbes/tools/evaluation.py` from `raw/`.",
        "",
        f"The problem catalog — dense, deterministic, agent-facing. {total} findings. "
        "Every failing check is enumerated straight from `raw/` — no shortlist, no mission "
        "weighting, no hand-picking; same raw always yields the same findings. Where a list "
        "is long it is capped with an explicit `+N more`, never silently trimmed. "
        "Numbers and scorecard in `01-baseline.md`; the fix, effort, and impact are the **plan's** job, not this file's. "
        "See `hobbes/templates/02-evaluation-template.md`.",
    ]
    for key, name, note in DOMAINS:
        items = sections[key]
        L += ["", f"## {key} — {name}" + (f"  ({note})" if note else "")]
        if not items:
            L += ["", "— all checks pass."]
            continue
        for i, f in enumerate(items, 1):
            L += [""]
            L += render_finding(f"{key}-{i}", f)
    report = "\n".join(L) + "\n"
    out.write_text(report)
    print(report)
    print(f"→ {total} findings written to {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
