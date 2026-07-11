# Findings — 2026-07-11-C

Site: https://omaratechnology.com/ · Generated 2026-07-11 18:34 EDT by `hobbes/tools/evaluation.py` from `raw/`.

The problem catalog — dense, deterministic, agent-facing. 17 findings. Every failing check is enumerated straight from `raw/` — no shortlist, no mission weighting, no hand-picking; same raw always yields the same findings. Where a list is long it is capped with an explicit `+N more`, never silently trimmed. Numbers and scorecard in `01-baseline.md`; the fix, effort, and impact are the **plan's** job, not this file's. See `hobbes/templates/02-evaluation-template.md`.

## A11Y — Accessibility

— all checks pass.

## SEO — SEO & discoverability

### SEO-1 · Duplicate meta descriptions
- **What / why:** Two or more pages share an identical meta description. Duplicate descriptions blur how pages differ in search and weaken each snippet; templated descriptions repeated across products/collections are the usual cause. (Empty descriptions are counted in the missing-description finding above, not here.)
- **Source:** SiteOne crawl · non-unique-descriptions
- **Target → measured:** 0 duplicate descriptions (BASELINE §F) → 1 duplicated description(s)
- **Evidence:**
  - "Digital studio led by Mason O&#x27;Mara for creative technical strate…" ×3

## PERF — Performance

### PERF-1 · Lab performance below target
- **What / why:** Lighthouse Performance score and the lab metrics behind it, per page × device. PSI's mobile run is a fixed heavy throttle (Moto G4 / slow-4G / 4× CPU), so mobile scores run far below desktop and a heavy page can be cut before network-idle (LCP marked ✗cut — treat that LCP as unknown, not as the failure). Cross-check the real-user verdict in 01-baseline.md §C: CrUX may already pass even where lab fails. The pass bar is still lab ≥ 90.
- **Source:** PSI Lighthouse · performance
- **Target → measured:** Performance ≥ 90, mobile + desktop (BASELINE Targets) → score range 82–100 across runs (see §A)
- **Scope:** golden path: all golden pages × device
- **Evidence:**
  - Home — mobile: perf 84 · LCP 4.5s · TBT 3.0ms · SI 2.5s · CLS 0.0
  - Home — desktop: perf 99 · LCP 0.77s · TBT 2.0ms · SI 0.99s · CLS 0.0
  - Work — mobile: perf 94 · LCP 3.15s · TBT 0.0ms · SI 1.08s · CLS 0.013
  - Work — desktop: perf 99 · LCP 0.61s · TBT 6.0ms · SI 1.02s · CLS 0.013
  - About — mobile: perf 83 · LCP 4.22s · TBT 55.0ms · SI 4.15s · CLS 0.0
  - About — desktop: perf 100 · LCP 0.78s · TBT 0.0ms · SI 0.38s · CLS 0.013
  - Contact — mobile: perf 87 · LCP 4.13s · TBT 26.0ms · SI 1.6s · CLS 0.013
  - Contact — desktop: perf 100 · LCP 0.76s · TBT 15.0ms · SI 0.54s · CLS 0.013
  - Sample Work — mobile: perf 82 · LCP 4.28s · TBT 15.0ms · SI 4.47s · CLS 0.0
  - Sample Work — desktop: perf 100 · LCP 0.71s · TBT 11.0ms · SI 0.41s · CLS 0.013

### PERF-2 · Improve image delivery
- **What / why:** Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image size
- **Source:** PSI Lighthouse · performance · `image-delivery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 238 KB across 8 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - image?url=%2Fcontent%2Fprojects%2Ftalulas%2Ftalulas.webp&w=… · 70 KB
  - image?url=%2Fcontent%2Fprojects%2Fbutchers-block%2Fimages%2… · 46 KB
  - image?url=%2Fcontent%2Fprojects%2Foffshore-coffee%2Foffshor… · 30 KB
  - image?url=%2Fcontent%2Fprojects%2Ftrain-market%2Fimages%2F1… · 26 KB
  - image?url=%2Fcontent%2Fprojects%2Flisa-says-gah%2Fimages%2F… · 20 KB
  - image?url=%2Fcontent%2Fprojects%2Finnova-sphere%2Finnova-sp… · 16 KB
  - image?url=%2Fcontent%2Fprojects%2Fmoor%2Fimages%2F1-hero-sh… · 16 KB
  - image?url=%2Fcontent%2Fprojects%2Fseed-to-sprout%2Fimages%2… · 13 KB

### PERF-3 · Render-blocking requests
- **What / why:** Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.
- **Source:** PSI Lighthouse · performance · `render-blocking-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 13 KB across 5 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 071u-o_v1e.nj.css?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 4 KB · 452 ms
  - 0glbbvt27-8zn.css?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 3 KB · 452 ms
  - 0xs_yzwm6l9~n.css?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 2 KB · 152 ms
  - 05-w0qiu5-t7l.css?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 2 KB · 452 ms
  - 008xm-9pu6xjh.css?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 1 KB · 451 ms

### PERF-4 · Reduce unused JavaScript
- **What / why:** Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.
- **Source:** PSI Lighthouse · performance · `unused-javascript` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 171 KB across 4 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 058ynuqfduc5z.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 69 KB
  - 07wpobnf6b_71.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 49 KB
  - 0yoi6g0rt32bk.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 29 KB
  - 0-8i6mp3e45j8.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 24 KB

### PERF-5 · LCP breakdown
- **What / why:** Each subpart has specific improvement strategies. Ideally, most of the LCP time should be spent on loading the resources, not within delays.
- **Source:** PSI Lighthouse · performance · `lcp-breakdown-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 2533 ms across 4 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - Element render delay · 2058 ms
  - Resource load delay · 396 ms
  - Resource load duration · 77 ms
  - Time to first byte · 3 ms

### PERF-6 · LCP request discovery
- **What / why:** Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading
- **Source:** PSI Lighthouse · performance · `lcp-discovery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 3 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - Request is discoverable in initial document
  - fetchpriority=high should be applied to the image preload request

### PERF-7 · Legacy JavaScript
- **What / why:** Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile Baseline features, unless you know you must support older browsers. Learn why most sites can deploy ES6+ code without transpiling
- **Source:** PSI Lighthouse · performance · `legacy-javascript-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 14 KB across 1 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 0yoi6g0rt32bk.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 14 KB

### PERF-8 · Forced reflow
- **What / why:** A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about forced reflows and possible mitigations.
- **Source:** PSI Lighthouse · performance · `forced-reflow-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 46 ms across 1 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 0-8i6mp3e45j8.js?dpl=dpl_2eSXWGCADSrzi2MA7W9PG2Np2Exo · 46 ms

### PERF-9 · Network dependency tree
- **What / why:** Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.
- **Source:** PSI Lighthouse · performance · `network-dependency-tree-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 5 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - (see raw/*.psi.json)

### PERF-10 · Slowest URLs (server response, sitewide)
- **What / why:** The slowest pages to respond across the whole crawl — server response / TTFB-class timing. SiteOne's per-URL request timing, a broad complement to the golden-path lab metrics. Slow server response delays everything downstream; a consistently slow template or collection is worth a look even when the golden path looks fine.
- **Source:** SiteOne crawl · slowest-urls
- **Target → measured:** Fast server response, all pages (BASELINE Targets) → slowest 0.20s; top 20 listed
- **Scope:** sitewide: 20 slowest of crawl
- **Evidence:**
  - cookman-creamery · 0.20s (200)
  - train-market · 0.18s (200)
  - flora-and-mar · 0.17s (200)
  - offshore-coffee · 0.15s (200)
  - talulas · 0.13s (200)
  - seed-to-sprout · 0.12s (200)
  - capturenoire · 0.12s (200)
  - butchers-block · 0.11s (200)
  - lisa-says-gah · 0.10s (200)
  - interwoven · 0.10s (200)
  - innova-sphere · 0.10s (200)
  - chomp · 0.09s (200)
  - (+8 more — see raw/crawl.json)

## SEC — Security

### SEC-1 · Missing security response headers
- **What / why:** Standard hardening headers absent from responses. These reduce XSS, clickjacking, and referrer-leak exposure. On a hosted platform the host often sets some headers and limits what the app/template can add — CSP/HSTS especially may be platform-controlled. Confirm what's actually settable before treating each as fully fixable.
- **Source:** SiteOne crawl · security table
- **Target → measured:** All present (BASELINE §F) → 1 of 4 missing
- **Scope:** sitewide: all responses
- **Evidence:**
  - CSP: not set (20 responses) — Content-Security-Policy is set but weakened by 'unsafe-inline' which significantly reduces its XSS protection.

### SEC-2 · Access-Control-Allow-Origin: *
- **What / why:** A response allows any origin to read it. Usually fine for public CDN assets, a risk if it's on anything credentialed. Check which responses carry it.
- **Source:** SiteOne crawl · security table
- **Target → measured:** No over-permissive CORS → flagged
- **Scope:** sitewide: flagged responses
- **Evidence:**
  - Access-Control-Allow-Origin is set to '*' which allows any origin to access the resource. This can be a security risk.

## BP — Best practices / structure

### BP-1 · errors-in-console
- **What / why:** JavaScript errors logged to the browser console. Each is a script failing at runtime — broken behavior, often from a third-party embed or a first-party script. Read the messages; they name the file.
- **Source:** PSI Lighthouse · best-practices · `errors-in-console`
- **Target → measured:** Best Practices ≥ 95 (BASELINE Targets) → on 2 run(s)
- **Scope:** golden path: Home — desktop, Home — mobile
- **Evidence:**
  - Failed to load resource: net::ERR_CONNECTION_FAILED

### BP-2 · inspector-issues
- **What / why:** Issues Chrome's Issues panel flagged (cookies, mixed content, etc.). Browser-level warnings; open the raw audit for the specifics.
- **Source:** PSI Lighthouse · best-practices · `inspector-issues`
- **Target → measured:** Best Practices ≥ 95 (BASELINE Targets) → on 2 run(s)
- **Scope:** golden path: Contact — desktop, Contact — mobile
- **Evidence:**
  - (see raw/*.psi.json)

### BP-3 · WebP support
- **What / why:** WebP support — flagged sitewide by the crawl. Structural/best-practice issue SiteOne flagged across the site.
- **Source:** SiteOne crawl · best-practices detail
- **Target → measured:** 0 issues (BASELINE §F) → 0 critical, 1 warning
- **Scope:** sitewide: of 20 pages
- **Evidence:**
  - 0 critical, 1 warning — see raw/crawl-report.html

### BP-4 · AVIF support
- **What / why:** AVIF support — flagged sitewide by the crawl. Structural/best-practice issue SiteOne flagged across the site.
- **Source:** SiteOne crawl · best-practices detail
- **Target → measured:** 0 issues (BASELINE §F) → 0 critical, 1 warning
- **Scope:** sitewide: of 20 pages
- **Evidence:**
  - 0 critical, 1 warning — see raw/crawl-report.html
