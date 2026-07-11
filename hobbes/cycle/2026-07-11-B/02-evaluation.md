# Findings — 2026-07-11-B

Site: https://omaratechnology.com/ · Generated 2026-07-11 03:10 EDT by `hobbes/tools/evaluation.py` from `raw/`.

The problem catalog — dense, deterministic, agent-facing. 16 findings. Every failing check is enumerated straight from `raw/` — no shortlist, no mission weighting, no hand-picking; same raw always yields the same findings. Where a list is long it is capped with an explicit `+N more`, never silently trimmed. Numbers and scorecard in `01-baseline.md`; the fix, effort, and impact are the **plan's** job, not this file's. See `hobbes/templates/02-evaluation-template.md`.

## A11Y — Accessibility

### A11Y-1 · Sitewide a11y prevalence
- **What / why:** How widespread the a11y gaps are across the whole site — element-level counts. SiteOne's per-analysis totals over every crawled page. The PSI rules above are authoritative for the golden path; this shows the scale beyond it.
- **Source:** SiteOne crawl · accessibility table
- **Target → measured:** 0 issues (BASELINE §F) → 1 flagged element(s) across 20 pages
- **Scope:** sitewide: 20 pages crawled
- **Evidence:**
  - Missing main landmark: 0 critical, 1 warning

## SEO — SEO & discoverability

— all checks pass.

## PERF — Performance

### PERF-1 · Lab performance below target
- **What / why:** Lighthouse Performance score and the lab metrics behind it, per page × device. PSI's mobile run is a fixed heavy throttle (Moto G4 / slow-4G / 4× CPU), so mobile scores run far below desktop and a heavy page can be cut before network-idle (LCP marked ✗cut — treat that LCP as unknown, not as the failure). Cross-check the real-user verdict in 01-baseline.md §C: CrUX may already pass even where lab fails. The pass bar is still lab ≥ 90.
- **Source:** PSI Lighthouse · performance
- **Target → measured:** Performance ≥ 90, mobile + desktop (BASELINE Targets) → score range 81–100 across runs (see §A)
- **Scope:** golden path: all golden pages × device
- **Evidence:**
  - Home — mobile: perf 83 · LCP 4.59s · TBT 75.0ms · SI 2.61s · CLS 0.0
  - Home — desktop: perf 99 · LCP 0.97s · TBT 0.0ms · SI 0.4s · CLS 0.0
  - Work — mobile: perf 81 · LCP 4.73s · TBT 152.0ms · SI 2.62s · CLS 0.0
  - Work — desktop: perf 100 · LCP 0.74s · TBT 10.0ms · SI 0.61s · CLS 0.013
  - About — mobile: perf 86 · LCP 4.14s · TBT 2.0ms · SI 0.9s · CLS 0.041
  - About — desktop: perf 99 · LCP 0.86s · TBT 9.0ms · SI 0.49s · CLS 0.013
  - Contact — mobile: perf 97 · LCP 2.48s · TBT 0.0ms · SI 1.76s · CLS 0.041
  - Contact — desktop: perf 100 · LCP 0.82s · TBT 63.0ms · SI 0.6s · CLS 0.013
  - Sample Work — mobile: perf 98 · LCP 2.18s · TBT 78.0ms · SI 1.97s · CLS 0.021
  - Sample Work — desktop: perf 100 · LCP 0.61s · TBT 15.0ms · SI 0.48s · CLS 0.013

### PERF-2 · Render-blocking requests
- **What / why:** Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.
- **Source:** PSI Lighthouse · performance · `render-blocking-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 13 KB across 5 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 105_d31c0by9q.css?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 5 KB · 451 ms
  - 14xaf.zi.-_yp.css?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 3 KB · 451 ms
  - 138ng_c7fy013.css?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 2 KB · 151 ms
  - 13yj-njwr34ly.css?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 2 KB · 451 ms
  - 008xm-9pu6xjh.css?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 1 KB · 451 ms

### PERF-3 · Reduce unused JavaScript
- **What / why:** Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.
- **Source:** PSI Lighthouse · performance · `unused-javascript` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 171 KB across 4 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 058ynuqfduc5z.js?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 69 KB
  - 00j1v-k2_aji8.js?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 49 KB
  - 0yoi6g0rt32bk.js?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 29 KB
  - 0-8i6mp3e45j8.js?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 24 KB

### PERF-4 · LCP request discovery
- **What / why:** Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading
- **Source:** PSI Lighthouse · performance · `lcp-discovery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 4 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - LCP resources should not use loading=lazy
  - Request is discoverable in initial document
  - fetchpriority=high should be applied
  - fetchpriority=high should be applied to the image preload request

### PERF-5 · Improve image delivery
- **What / why:** Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image size
- **Source:** PSI Lighthouse · performance · `image-delivery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 49 KB across 3 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - image?url=%2Fcontent%2Fprojects%2Ftalulas%2Ftalulas.webp&w=… · 34 KB
  - image?url=%2Fcontent%2Fprojects%2Fbutchers-block%2Fimages%2… · 9 KB
  - image?url=%2Fcontent%2Fprojects%2Fmoor%2Fimages%2F1-hero-sh… · 6 KB

### PERF-6 · Legacy JavaScript
- **What / why:** Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile Baseline features, unless you know you must support older browsers. Learn why most sites can deploy ES6+ code without transpiling
- **Source:** PSI Lighthouse · performance · `legacy-javascript-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 14 KB across 1 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 0yoi6g0rt32bk.js?dpl=dpl_2MDrgCzKtF6LQxLaFrjRKy6fchy9 · 14 KB

### PERF-7 · Network dependency tree
- **What / why:** Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.
- **Source:** PSI Lighthouse · performance · `network-dependency-tree-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 5 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - (see raw/*.psi.json)

### PERF-8 · Forced reflow
- **What / why:** A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about forced reflows and possible mitigations.
- **Source:** PSI Lighthouse · performance · `forced-reflow-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 2 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - (see raw/*.psi.json)

### PERF-9 · Slowest URLs (server response, sitewide)
- **What / why:** The slowest pages to respond across the whole crawl — server response / TTFB-class timing. SiteOne's per-URL request timing, a broad complement to the golden-path lab metrics. Slow server response delays everything downstream; a consistently slow template or collection is worth a look even when the golden path looks fine.
- **Source:** SiteOne crawl · slowest-urls
- **Target → measured:** Fast server response, all pages (BASELINE Targets) → slowest 0.28s; top 18 listed
- **Scope:** sitewide: 18 slowest of crawl
- **Evidence:**
  - current-media-company · 0.28s (200)
  - innova-sphere · 0.18s (200)
  - interwoven · 0.17s (200)
  - cookman-creamery · 0.16s (200)
  - flora-and-mar · 0.16s (200)
  - seed-to-sprout · 0.15s (200)
  - offshore-coffee · 0.15s (200)
  - patriae · 0.15s (200)
  - lisa-says-gah · 0.14s (200)
  - butchers-block · 0.14s (200)
  - hazel-boutique · 0.13s (200)
  - talulas · 0.13s (200)
  - (+6 more — see raw/crawl.json)

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
