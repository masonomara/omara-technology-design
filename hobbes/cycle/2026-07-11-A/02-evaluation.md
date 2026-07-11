# Findings — 2026-07-11-A

Site: https://omaratechnology.com/ · Generated 2026-07-11 02:17 EDT by `hobbes/tools/evaluation.py` from `raw/`.

The problem catalog — dense, deterministic, agent-facing. 19 findings. Every failing check is enumerated straight from `raw/` — no shortlist, no mission weighting, no hand-picking; same raw always yields the same findings. Where a list is long it is capped with an explicit `+N more`, never silently trimmed. Numbers and scorecard in `01-baseline.md`; the fix, effort, and impact are the **plan's** job, not this file's. See `hobbes/templates/02-evaluation-template.md`.

## A11Y — Accessibility

### A11Y-1 · Missing form labels (sitewide)
- **What / why:** Missing form labels — flagged across the crawl. Accessibility issue SiteOne flagged across the site.
- **Source:** SiteOne crawl · accessibility detail
- **Target → measured:** 0 issues (BASELINE §F) → 7 element(s) across 7 pattern(s)
- **Scope:** sitewide: 20 pages crawled
- **Evidence:**
  - [warning] ×1 · `<input class="page-*" name="budgetHigh" *** >` · /contact
  - [warning] ×1 · `<input class="page-*" name="email" *** >` · /contact
  - [warning] ×1 · `<input class="page-*" name="role" *** >` · /contact
  - [warning] ×1 · `<input class="page-*" name="budgetLow" *** >` · /contact
  - [warning] ×1 · `<input class="page-*" name="company" *** >` · /contact
  - [warning] ×1 · `<input class="page-*" name="name" *** >` · /contact
  - (+1 more pattern(s) — see raw/crawl-report.html)

## SEO — SEO & discoverability

### SEO-1 · Heading structure (single H1 + order)
- **What / why:** Pages with no/multiple H1 or a skipped heading level. Headings are the outline assistive tech and search engines read. A skipped level (h1→h3) or a second h1 breaks that outline. A common cause: section/card heading levels (h2/h3/h5) drift when sections are reordered or a banner ships an h1.
- **Source:** SiteOne crawl · seo-headings  ·  seo.py · golden path
- **Target → measured:** Single H1 + ordered headings, all pages (BASELINE §E/§F) → 1 multi-H1, 0 skipped-level of 20
- **Scope:** golden path: Home · sitewide: 0 / 20 pages with heading errors
- **Evidence:**
  - golden Home: 0 h1, order ok — 

### SEO-2 · Image alt coverage
- **What / why:** Images on the page with no alt attribute (coverage, not quality). Same gap as the A11Y image-alt rule, seen from the SEO side. Coverage only — whether the alt that exists is meaningful is the manual pass. Content/card images get alt from the CMS/admin image field or the template <img>.
- **Source:** seo.py · golden path
- **Target → measured:** All images have alt (BASELINE §E) → golden pages failing: Home, Work, About, Contact, Sample Work
- **Scope:** golden path: Home, Work, About, Contact, Sample Work
- **Evidence:**
  - golden Home: 36 of 38 img(s) missing alt
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   (+33 more on this page)
  - golden Work: 36 of 56 img(s) missing alt
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   (+33 more on this page)
  - golden About: 36 of 41 img(s) missing alt
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   (+33 more on this page)
  - golden Contact: 36 of 40 img(s) missing alt
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   (+33 more on this page)
  - golden Sample Work: 36 of 64 img(s) missing alt
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   ↳ waves-background.svg?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6
  -   (+33 more on this page)

### SEO-3 · Duplicate meta descriptions
- **What / why:** Two or more pages share an identical meta description. Duplicate descriptions blur how pages differ in search and weaken each snippet; templated descriptions repeated across products/collections are the usual cause. (Empty descriptions are counted in the missing-description finding above, not here.)
- **Source:** SiteOne crawl · non-unique-descriptions
- **Target → measured:** 0 duplicate descriptions (BASELINE §F) → 1 duplicated description(s)
- **Evidence:**
  - "Product design and development studio for apps, websites, and softwar…" ×4

## PERF — Performance

### PERF-1 · Lab performance below target
- **What / why:** Lighthouse Performance score and the lab metrics behind it, per page × device. PSI's mobile run is a fixed heavy throttle (Moto G4 / slow-4G / 4× CPU), so mobile scores run far below desktop and a heavy page can be cut before network-idle (LCP marked ✗cut — treat that LCP as unknown, not as the failure). Cross-check the real-user verdict in 01-baseline.md §C: CrUX may already pass even where lab fails. The pass bar is still lab ≥ 90.
- **Source:** PSI Lighthouse · performance
- **Target → measured:** Performance ≥ 90, mobile + desktop (BASELINE Targets) → score range 84–100 across runs (see §A)
- **Scope:** golden path: all golden pages × device
- **Evidence:**
  - Home — mobile: perf 86 · LCP 4.23s · TBT 16.0ms · SI 0.91s · CLS 0.0
  - Home — desktop: perf 100 · LCP 0.7s · TBT 0.0ms · SI 0.68s · CLS 0.0
  - Work — mobile: perf 84 · LCP 4.44s · TBT 16.0ms · SI 1.13s · CLS 0.041
  - Work — desktop: perf 99 · LCP 0.85s · TBT 54.0ms · SI 0.66s · CLS 0.013
  - About — mobile: perf 93 · LCP 3.16s · TBT 0.0ms · SI 3.11s · CLS 0.0
  - About — desktop: perf 100 · LCP 0.58s · TBT 2.0ms · SI 0.74s · CLS 0.013
  - Contact — mobile: perf 94 · LCP 3.0s · TBT 0.0ms · SI 1.36s · CLS 0.041
  - Contact — desktop: perf 100 · LCP 0.66s · TBT 27.0ms · SI 0.53s · CLS 0.013
  - Sample Work — mobile: perf 91 · LCP 3.53s · TBT 46.0ms · SI 2.15s · CLS 0.021
  - Sample Work — desktop: perf 100 · LCP 0.63s · TBT 6.0ms · SI 0.49s · CLS 0.013

### PERF-2 · Improve image delivery
- **What / why:** Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image size
- **Source:** PSI Lighthouse · performance · `image-delivery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 256 KB across 8 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - image?url=%2Fcontent%2Fprojects%2Ftalulas%2Ftalulas.webp&w=… · 79 KB
  - image?url=%2Fcontent%2Fprojects%2Fbutchers-block%2Fimages%2… · 46 KB
  - image?url=%2Fcontent%2Fprojects%2Foffshore-coffee%2Foffshor… · 34 KB
  - image?url=%2Fcontent%2Fprojects%2Ftrain-market%2Fimages%2F1… · 29 KB
  - image?url=%2Fcontent%2Fprojects%2Flisa-says-gah%2Fimages%2F… · 21 KB
  - image?url=%2Fcontent%2Fprojects%2Finnova-sphere%2Finnova-sp… · 19 KB
  - image?url=%2Fcontent%2Fprojects%2Fmoor%2Fimages%2F1-hero-sh… · 15 KB
  - image?url=%2Fcontent%2Fprojects%2Fseed-to-sprout%2Fimages%2… · 13 KB

### PERF-3 · Render-blocking requests
- **What / why:** Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.
- **Source:** PSI Lighthouse · performance · `render-blocking-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 10 KB across 5 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 105_d31c0by9q.css?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 4 KB · 601 ms
  - 0t4qkhmgovzip.css?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 2 KB · 451 ms
  - 0bgp~xg9gnc9u.css?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 2 KB · 151 ms
  - 0fvr20yd1j7cl.css?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 1 KB · 451 ms
  - 008xm-9pu6xjh.css?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 1 KB · 451 ms

### PERF-4 · Reduce unused JavaScript
- **What / why:** Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.
- **Source:** PSI Lighthouse · performance · `unused-javascript` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 171 KB across 4 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 0yqpksqj6yhkj.js?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 69 KB
  - 17afdcm26.u83.js?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 49 KB
  - 0yoi6g0rt32bk.js?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 29 KB
  - 0-8i6mp3e45j8.js?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 24 KB

### PERF-5 · LCP request discovery
- **What / why:** Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading
- **Source:** PSI Lighthouse · performance · `lcp-discovery-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 4 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - LCP resources should not use loading=lazy
  - Request is discoverable in initial document
  - fetchpriority=high should be applied
  - fetchpriority=high should be applied to the image preload request

### PERF-6 · Legacy JavaScript
- **What / why:** Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile Baseline features, unless you know you must support older browsers. Learn why most sites can deploy ES6+ code without transpiling
- **Source:** PSI Lighthouse · performance · `legacy-javascript-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → 14 KB across 1 resource(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - 0yoi6g0rt32bk.js?dpl=dpl_86q4dPsfotsfPwSg2eQdUvGyioY6 · 14 KB

### PERF-7 · Image elements do not have explicit `width` and `height`
- **What / why:** Set an explicit width and height on image elements to reduce layout shifts and improve CLS. Learn how to set image dimensions
- **Source:** PSI Lighthouse · performance · `unsized-images` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 1 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - wordmark.svg

### PERF-8 · Network dependency tree
- **What / why:** Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.
- **Source:** PSI Lighthouse · performance · `network-dependency-tree-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 5 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - (see raw/*.psi.json)

### PERF-9 · Forced reflow
- **What / why:** A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about forced reflows and possible mitigations.
- **Source:** PSI Lighthouse · performance · `forced-reflow-insight` (mobile runs)
- **Target → measured:** Performance ≥ 90 (BASELINE Targets) → flagged on 1 page(s)
- **Scope:** golden path: golden pages, mobile
- **Evidence:**
  - (see raw/*.psi.json)

### PERF-10 · Slowest URLs (server response, sitewide)
- **What / why:** The slowest pages to respond across the whole crawl — server response / TTFB-class timing. SiteOne's per-URL request timing, a broad complement to the golden-path lab metrics. Slow server response delays everything downstream; a consistently slow template or collection is worth a look even when the golden path looks fine.
- **Source:** SiteOne crawl · slowest-urls
- **Target → measured:** Fast server response, all pages (BASELINE Targets) → slowest 0.22s; top 20 listed
- **Scope:** sitewide: 20 slowest of crawl
- **Evidence:**
  - innova-sphere · 0.22s (200)
  - interwoven · 0.18s (200)
  - capturenoire · 0.17s (200)
  - chomp · 0.16s (200)
  - patriae · 0.15s (200)
  - lisa-says-gah · 0.15s (200)
  - cookman-creamery · 0.14s (200)
  - offshore-coffee · 0.14s (200)
  - hazel-boutique · 0.13s (200)
  - butchers-block · 0.12s (200)
  - flora-and-mar · 0.11s (200)
  - seed-to-sprout · 0.11s (200)
  - (+8 more — see raw/crawl.json)

## SEC — Security

### SEC-1 · Missing security response headers
- **What / why:** Standard hardening headers absent from responses. These reduce XSS, clickjacking, and referrer-leak exposure. On a hosted platform the host often sets some headers and limits what the app/template can add — CSP/HSTS especially may be platform-controlled. Confirm what's actually settable before treating each as fully fixable.
- **Source:** SiteOne crawl · security table
- **Target → measured:** All present (BASELINE §F) → 3 of 4 missing
- **Scope:** sitewide: all responses
- **Evidence:**
  - CSP: not set (20 responses) — Content-Security-Policy header is not set. It restricts resources the page can load and prevents XSS attacks.
  - Referrer-Policy: not set (20 responses) — Referrer-Policy header is not set. It controls referrer header sharing and enhances privacy and security.
  - Permissions-Policy: not set (20 responses) — Permissions-Policy header is not set. It allows enabling/disabling browser APIs and features for security.

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
  - Failed to load resource: the server responded with a status of 404 (Not Found)

### BP-2 · WebP support
- **What / why:** WebP support — flagged sitewide by the crawl. Structural/best-practice issue SiteOne flagged across the site.
- **Source:** SiteOne crawl · best-practices detail
- **Target → measured:** 0 issues (BASELINE §F) → 0 critical, 1 warning
- **Scope:** sitewide: of 20 pages
- **Evidence:**
  - 0 critical, 1 warning — see raw/crawl-report.html

### BP-3 · AVIF support
- **What / why:** AVIF support — flagged sitewide by the crawl. Structural/best-practice issue SiteOne flagged across the site.
- **Source:** SiteOne crawl · best-practices detail
- **Target → measured:** 0 issues (BASELINE §F) → 0 critical, 1 warning
- **Scope:** sitewide: of 20 pages
- **Evidence:**
  - 0 critical, 1 warning — see raw/crawl-report.html
