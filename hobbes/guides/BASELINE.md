# Baseline — operator guide

<!-- Human-owned. The operator's runbook for capturing a web baseline — the tools, the run, the targets, the deliverables — maintained by a human and kept true to the tooling. Hobbes reads and follows it to run the cycle and does the write-up (scorecard, findings), but never edits the runbook itself. -->

This is how you capture a web baseline. You run the cycle with Hobbes. Hobbes does most of the write-up. A human makes the calls no tool can make and signs off the manual rows.

Run it at the start of an engagement and at the start of each work cycle. It produces a dated scorecard and a findings doc, measured against the previous baseline. Any metric that slipped below its target since last cycle is a regression.

## Tools

- **PageSpeed Insights (PSI)** — the primary measurement tool, run by Hobbes through the API: `python3 hobbes/tools/psi.py`. PSI runs Lighthouse on Google's servers and returns all four category scores (Performance, Accessibility, Best Practices, SEO) for mobile and desktop, the lab metrics, *and* CrUX field data — real-user measurements over the last 28 days, the only trustworthy source for INP. It writes `raw/*.psi.json`, which `baseline.py` renders into sections **A–D** of `01-baseline.md`. Run standalone, psi.py prints A–D itself. The reliability guarantees (lab/field split, median-of-3, incomplete-run handling) are under **The run**. **Accessibility (Section D) rides the same run** — the Accessibility category *is* axe-core, so psi.py reports each failing rule with its node count (`color-contrast` = contrast errors, `image-alt` = alt gaps). No separate scan needed. The human cross-check is the same engine in the browser at `pagespeed.web.dev` (no key needed). Read the field panel first. One hard limit: PSI exposes **no throttle control**. Mobile is a fixed heavy throttle (Moto G4 / slow-4G / 4× CPU), so a genuinely heavy page can take ~60s and may return "incomplete" — itself a real signal about a slow page. When PSI can't reach a URL (an unpublished theme draft, a preview link, localhost, anything gated), fall back to **local Lighthouse** — lab data only, ~10–15 points off PSI. See **Non-public URLs** under The run.
- **SiteOne Crawler** — the whole-site crawler. Free, open-source (MIT). One crawl reports missing/duplicate titles and descriptions, missing H1s, broken links and redirects, plus accessibility checks (alt text, lang, form labels, ARIA, heading order) and slow URLs, as a sortable HTML report. `crawl.py` drives it **from the sitemap** (not link-discovery) so the page set is identical every cycle and the counts are comparable. It expands the sitemap index itself, since SiteOne does not recurse a nested index. macOS: `brew install janreges/tap/siteone-crawler`, or the desktop GUI app.

## Before your first baseline

One-time setup lives in `hobbes/guides/SETUP.md` — filling `hobbes.toml` (client + golden path), installing the tools, and (for the cloud runner) wiring GitHub. This guide assumes that's done.

## The run

The baseline comes in two tiers. Naming them keeps a partial run honest:

- **MVP baseline (A–F) — fully automated.** Hobbes runs the three tools and fills every cell in sections A–F — a complete, comparable baseline on its own.
- **Above-and-beyond (G) — human.** The manual accessibility pass. Optional per cycle. The MVP baseline stands without it, but a page is not certified *fully* pass until G is signed.

The tools cover all 6 page×device combinations in one go. The manual pass is per page.

### 1. Automated capture (Hobbes)

**One command runs the whole cycle:**

```
python3 hobbes/tools/cli.py cycle          # baseline → evaluation (the patrol)
```

It cascades the three capture tools (`psi.py` → `seo.py` → `crawl.py`) through `baseline.py` and builds `02-evaluation.md`. (No diff. A cycle measures the current site. The before/after is the review phase's, after a publish.) You rarely run the pieces by hand, but they're there to recover or refresh one section:

```
python3 hobbes/tools/baseline.py --resume   # reuse cache to recover a stalled run
python3 hobbes/tools/baseline.py --no-crawl # quick A–E rerun, skip the site-wide crawl
python3 hobbes/tools/baseline.py --full     # crawl the ENTIRE sitemap, not the sample (slow; occasional audit)
python3 hobbes/tools/evaluation.py            # rebuild 02-evaluation.md from raw/
```

Per-client config lives in `hobbes/hobbes.toml` — the golden path, client metadata, and the PSI-key *location* (never the key itself). Every tool reads it through `hobbes/tools/config.py`. One source. No hardcoded URLs. `hobbes/tools/cli.py` also exposes `publish-review` + `review` (the post-publish before/after — re-capture the live site into the cycle's `raw-review/`, then diff vs the pre-publish `01-baseline.md` → `06-review.md`) and `status` (which stage the newest cycle is at).

`baseline.py` runs **all three tools together — `psi.py` then `seo.py` then `crawl.py`**. It stamps a dated `hobbes/cycle/YYYY-MM-DD-X/01-baseline.md` from `hobbes/templates/01-baseline-template.md`, and the cycle folder also holds the raw artifacts in `raw/`. Header and golden path are filled. Sections **A–F** render from `raw/` (A–D from PSI, E from SEO, F from the crawl — `baseline.py` imports the three tools and calls each one's own renderer, so the digest can't drift from a standalone tool run). Section **G** is left blank for the human pass. It fetches fresh by default, because a baseline must reflect the current site. If a run stalls partway the successful calls are cached, so `--resume` picks up the rest. `--full` cascades to the crawl only. If any tool errors it aborts rather than write a half-scorecard. The three cascaded tools:

**`python3 hobbes/tools/psi.py`** — calls the PSI API for each golden-path page × mobile/desktop and fills **A** (category scores), **B** (lab metrics), **C** (field/CrUX), and **D** (accessibility — the failing axe audits, since PSI's a11y category *is* axe-core), writing `raw/*.psi.json`. `baseline.py` renders **A–D** from `raw/` into `01-baseline.md`. Run it standalone to print A–D on their own. What it guarantees:

1. **Field and lab are pulled separately and labelled.** A field number never lands in a lab row. **B** is lab only. **C** is field only.
2. **Field is per page** (CrUX, 28 days — the only trustworthy INP). A page without page-level data is marked `origin agg.` (the whole-site average). No data at all → INP **unverified**.
3. **Incomplete runs are classified, not lumped.** A ⚠ row never reached network-idle. Its early metrics (FCP, CLS, TBT, Speed Index, and the category scores) still stand. Only a `✗cut` LCP / Performance score is the cutoff artifact, to be treated as unknown. Re-measuring won't help — local Lighthouse hits the same wall. Investigate why the page never idles.
4. **Accessibility (D)** rides the same run — failing axe rules with node counts (`color-contrast` = contrast errors, `image-alt` = alt gaps). No separate WAVE/axe scan.
5. **Agent-reliable.** Concurrency capped. Calls retried. Each success cached, so a re-run resumes. One failed call can't kill the run.
6. **Median of 3 runs.** Lab scores swing run-to-run — a heavy page drew perf 89 then 73 an hour apart while CrUX held — so single-run numbers aren't comparable cycle-to-cycle. Each page×device is measured 3× and the **median run** (by performance score) is kept as the canonical doc both the scorecard and findings read. psi.py prints the per-cell spread so you can see the volatility behind the median. CrUX field data (**C**) is 28-day and identical across runs, so the median doesn't touch it.

**`python3 hobbes/tools/seo.py`** — fetches each page's HTML and fills **E** (SEO checklist + the site-level `sitemap.xml` / `robots.txt`), writing `raw/*.seo.json`. `baseline.py` renders **E** from `raw/`. Run it standalone to print E on its own. It parses title, meta description, canonical, single-H1 + heading order, JSON-LD structured-data type, Open Graph/Twitter, image-alt **coverage**, and indexability. Alt-text *quality* is left to the human (F).

**`python3 hobbes/tools/crawl.py`** (cascaded by baseline.py) — runs the **SiteOne Crawler** and fills **F** (site-wide quality grades plus SEO/structure, accessibility, best-practice, and security-header counts), writing `raw/crawl.json`. `baseline.py` renders **F** from it. Where psi.py and seo.py judge the three golden-path pages, crawl.py judges many. So **F** is where site-wide rot surfaces that a 3-page sample misses: meta descriptions absent across dozens of pages, image-alt gaps sitewide, missing security headers. **The crawl is sitemap-driven and reproducible.** It expands the sitemap to the authoritative page list (SiteOne does not recurse a Shopify sitemap *index*, so crawl.py expands it itself), then crawls a **fixed stratified sample**: every distinct low-volume page (all collections, pages, policies, blog) every cycle, plus a deterministic slice of products. Products are template-driven, so a slice reveals the same template issues as all of them. The set is served as one flat sitemap on localhost and pinned with `--include-regex`, so the same URLs — and the same counts — recur every cycle. Pace is **1 req/s, 1 worker**. Shopify rate-limits storefront HTML hard (a burst then 429s) and SiteOne has no retry, so we stay under the limit rather than race it. Images are skipped — alt/heading/SEO/security are HTML/header checks, and image weight is judged on the golden path by PSI. crawl.py prints a **Coverage** line — pages analysed vs. sampled vs. the full sitemap, plus any 429s — so a partial run can never read as the whole site. `--full` (via `baseline.py --full`) crawls the entire sitemap instead of the sample. Slower and likelier to hit the throttle, for an occasional complete audit. The machine source lands in `raw/crawl.json`. SiteOne's JSON keeps only counts — it drops the per-analysis detail — so crawl.py also emits `raw/crawl-report.html` and parses it into the JSON's `_detail`. That detail is the only place SiteOne writes the offending element, its occurrence count, and the affected URLs. `evaluation.py` reads both to enumerate the sitewide findings: missing/duplicate descriptions, the best-practices table, slowest URLs, and — per a11y/best-practice/security analysis — the actual flagged elements and the pages they hit. Skip the crawl with `--no-crawl` for a quick A–E refresh.

Two caveats this design trades for reproducibility. Know them before you trust **F**:

- **Broken outbound links go uncaught.** Pinning the crawl to the sitemap means it does **not** follow on-page links, so it only confirms the *sampled pages themselves* return 200. It will not catch a dead link in a nav, a product description, or a footer (the old link-discovery crawl did). The "Broken links (4xx)" count is now effectively "are the sampled pages alive," not "are all links on the site good." For a real dead-link sweep, run `baseline.py --full` (it still doesn't follow links, but covers every page) or use a dedicated link checker.
- **The product sample is stable in size, not identity.** It's every Nth product by sorted URL of a catalog that changes as products are added or removed, so the ~100 sampled products shift slightly cycle-to-cycle. Template-level counts stay comparable — that's the point. Tracking one *specific* product across cycles does not. The golden-path product (measured by PSI every cycle) is the fixed per-page tracker.

**Optional deeper SEO** (not automated, run when a per-page check flags something): the **Google Rich Results Test** (`search.google.com/test/rich-results`) validates structured-data *correctness*. seo.py only confirms a type is present.

**Non-public URLs (fallback).** The PSI API only reaches the live, public site. To baseline an unpublished theme draft, preview URL, localhost, or anything gated, run Lighthouse locally instead (Chrome Incognito, extensions off → DevTools → **Lighthouse** → pick the device → run 3× and take the median). Local scores run ~10–15 points off PSI, so never mix the two within one baseline.

### 2. Manual accessibility pass — Section G (Human — tools cannot judge these)

Optional per cycle. The automated baseline (A–F) stands on its own. But **a page is never certified fully pass until these are signed.** A page is never green on automated numbers alone.

1. **Keyboard only.** Set the mouse aside. Tab forward, Shift+Tab back, Enter/Space to activate. Try browse → open a product → add to cart → reach checkout without the mouse. Note anywhere you get stuck or cannot get out — a "trap".
2. **Visible focus.** As you Tab, confirm you can always see what is selected (outline or ring). Note any element where the highlight vanishes.
3. **Logical order.** Does Tab move in the order things appear on screen (roughly top to bottom)? Note strange jumps.
4. **Screen reader.** Turn it on (Mac VoiceOver `Cmd+F5`, Windows NVDA/Narrator). Listen to the top of the page and one product. Does it make sense? Are buttons announced by what they do ("Add to cart") rather than just "button"?
5. **Alt-text quality.** Confirm product images describe themselves ("sage green mock neck, front view") rather than a filename ("IMG_0421.jpg") or nothing. A tool only checks that alt text *exists* (the coverage count is in E). You check that it is *useful*.
6. **Color contrast.** Look for hard-to-read text — light gray on white, text over a busy photo, button text on hover. Note anything that strains. D gives the automated `color-contrast` count. This is the by-eye pass.
7. **Reduced motion.** Turn on the OS "reduce motion" setting (Mac: System Settings → Accessibility → Display → Reduce motion). Confirm animations actually calm down. Record pass/fail in Section G.

**Two numbers a green lab result will lie about:** INP (lab shows TBT only) and interaction-driven CLS. Never mark these "pass" on lab data. Confirm with manual interaction or the field data in **C**.

## The scorecard

`baseline.py` stamps the scorecard for you. It copies `hobbes/templates/01-baseline-template.md` to `hobbes/cycle/YYYY-MM-DD-X/01-baseline.md`, fills the header and golden path from the client metadata in `hobbes.toml`, and renders sections **A–F** from `raw/` via the tools' own renderers, leaving **G** blank for the human pass. That filled file **is** the baseline. **Layout: one folder per cycle, named `<date>-<letter>`** (`hobbes/cycle/YYYY-MM-DD-X/`, the letter set upstream so multiple cycles can share a day) holding `01-baseline.md`, the generated `02-evaluation.md`, and the `raw/` artifacts (git-ignored). One cycle in one place, sorting chronologically by folder name. Before you trust the file, confirm the header carries no leftover placeholders.

## Targets — the pass bar (same for every client)

- **Lighthouse performance:** ≥ 90, desktop and mobile
- **Lighthouse accessibility:** 100, desktop and mobile
- **Lighthouse best practices:** ≥ 95, desktop and mobile
- **Lighthouse SEO:** ≥ 95, desktop and mobile
- **LCP:** ≤ 2.5s, desktop and mobile
- **INP:** ≤ 200ms, desktop and mobile
- **CLS:** ≤ 0.1, desktop and mobile
- **Accessibility audit failures (axe via PSI, Section D):** 0, including 0 `color-contrast`, desktop and mobile
- **SEO checklist (Section E, golden path):** every item passing
- **Manual a11y (Section G):** keyboard pass · focus visible · screen reader pass · 0 contrast fails · 100% meaningful alt

**Site-wide crawl (Section F) — every page, not just the golden path:**

- **SEO / structure:** 0 broken links · 0 missing or duplicate titles · 0 missing meta descriptions · 0 pages with multiple H1 · 0 pages with skipped heading levels
- **Accessibility:** 0 pages missing image alt · 0 missing aria-labels · 0 missing roles · 0 missing html lang
- **Best practices:** 0 invalid inline SVG · 0 non-clickable phone numbers · 100% valid HTML
- **Security headers:** HSTS · Content-Security-Policy · Referrer-Policy · Permissions-Policy · Brotli compression · valid HTTPS/TLS — all present
- **SiteOne quality scores (0–10):** diagnostic context, not a hard gate. Investigate any category below 8. Redirects and duplicate inline SVG are reported for awareness, not pass/fail.

## Deliverables

- `hobbes/cycle/YYYY-MM-DD-X/01-baseline.md` — the scorecard (the numbers). Stamped by `baseline.py`.
- `hobbes/cycle/YYYY-MM-DD-X/02-evaluation.md` — the **problem catalog**: *every* failing check with verbatim evidence, dense and deterministic, for an agent. No shortlist, no mission weighting. It enumerates straight from `raw/`, so the same raw always yields the same findings. Generated by `python3 hobbes/tools/evaluation.py` from `raw/` (contract in `hobbes/templates/02-evaluation-template.md`). It carries the *what / where / how*, not the fix. The fix, effort, and impact (rated against `MISSION.md`) are the plan's job.
- `hobbes/cycle/YYYY-MM-DD-X/03-plan.md` — the next stage. It groups the findings into systems, proposes the coupled fix per system, and rates **effort** and **impact** (against `MISSION.md`). The fix/effort/impact that findings deliberately omits live here.
- `hobbes/MISSION.md` — **human-owned, not a cycle deliverable.** It holds the stable `baseline → target` priorities the plan rates impact against. Hobbes reads it. A human edits it when strategy shifts. Closed gaps surface in the scorecard and `06-review.md`, never by Hobbes rewriting the mission.

## Site-type adaptations

The **Targets** never change — they are the standard. What adapts per archetype is (1) the test surface (which pages), (2) the extra checks that carry more weight, and (3) which data source you trust.

If a target genuinely cannot be met (e.g. ad-funded performance), document the exception in the findings doc with field-data justification. Do not silently lower the bar.

**Shopify storefront (default).** Covered above. Watch for JS bloat from installed Shopify apps. Each adds scripts. Use `theme check`, Product JSON-LD, and Shop Pay / express checkout.

**Non-Shopify ecommerce (WooCommerce / Magento / BigCommerce / headless).** Same three core pages. What changes:

- Swap the platform tools. No Shopify speed report or `theme check`. Use Query Monitor (Woo), the built-in profiler (Magento), or a bundle analyzer (headless).
- **Weight TTFB harder.** TTFB is a standard Scorecard B column for every site, but on self-hosting it carries more diagnostic weight. You control the server, so slow TTFB from uncached queries and plugin bloat is often the real villain, not a fixed platform cost as on Shopify.
- Headless (Next / Nuxt / Remix): check hydration cost, bundle size, and image-optimization config. These are dev-controlled, so a11y/perf targets are more achievable than on a locked SaaS theme.

**Content-heavy / editorial / publisher.** Core pages shift to home, an article page, a category hub (add a listing/archive template if distinct). What changes:

- SEO weight rises. Structured data is Article / NewsArticle / BreadcrumbList / FAQ, plus author/date markup. The full SEO checklist still applies.
- Ad tech and third-party embeds dominate total blocking time and cause late CLS. Trust field data (CrUX) over lab here. Lab cannot model real ad auctions. This is where the lab-vs-field distinction matters most.
- A11y: long-form reading order, heading-hierarchy depth, and descriptive link text carry more weight.

**B2B / SaaS marketing or B2B commerce.** Core pages shift to home, a key solution/landing page, and the conversion page (pricing, contact/demo, quote request). What changes:

- Measure the primary lead form as its own surface: labels, keyboard, and validation with clear error states. The highest-stakes a11y check here, because the form is the conversion.
- Lighthouse cannot log into gated pages (portals, dashboards, quote flows). Script authenticated runs (Playwright/Puppeteer with a test login) or test manually, and flag them as human-only surfaces.
- Marketing/CRM scripts (HubSpot, Marketo, Salesforce, chat widgets, analytics) are the usual TBT culprits. Inventory them.
- SEO structured data is Organization / Product / FAQ. The checklist applies in full.

## Optional tools

Not part of the standard cycle — reach for one only when a specific check calls for it:

- **Google Rich Results Test** (`search.google.com/test/rich-results`) — validate a page's structured data.
- **Google Search Console** — Google's own search report. Free, but needs client-granted access.
- **Shopify admin → Online Store Speed report + `theme check`** — Shopify's performance score plus a theme-code scan (Shopify clients only).
- **WebPageTest** (`webpagetest.org`) — a deeper dig into *why* a page is slow.
- **WAVE** (`wave.webaim.org`) — an optional human a11y spot-check (axe via PSI is the automated scan).
