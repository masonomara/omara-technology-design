# Plan — 2026-07-11

Site: https://omaratechnology.com/ · Cycle: 2026-07-11-C · Authored by Hobbes from `02-evaluation.md` + `01-baseline.md` + `raw/`.

17 findings, grouped into 7 systems. The scores read from separate files: **Impact** against `MISSION.md` (accessibility → SEO → performance, in that order), **Effort** against `DEVELOPMENT.md` (the stack) + `CONTEXT.md` (the people). Every finding lands in exactly one system; nothing dropped, nothing invented.

**The lens the plan applies this cycle:** the site is mature — prior cycles (A, B) closed the code-authorable a11y, landmark, LCP-discovery, security-header, and image-format work. This cycle the automated a11y bar is fully met (Lighthouse A11Y **100** on every page, axe §D reads **0** everywhere, and the sitewide crawl §F shows 0 a11y offenses), so **Priority-1 is clean** and the evaluation lists **no A11Y findings at all**. What remains splits cleanly:

- **One genuinely code-authorable, high-leverage fix:** Priority-2 SEO — three golden pages (Home, About, Contact) still share one identical meta description (SEO-1). Differentiating them is a self-contained metadata edit.
- **Everything else is gated by a hard constraint, not by effort.** CrUX field data (§C) is **entirely empty**, so *no* performance finding can be confirmed against real users — every perf impact is discounted per the template's field-vs-lab rule, and desktop already scores 99–100. The CSP finding is a *deliberate, documented* `unsafe-inline` tradeoff whose only fix (a nonce/hash migration) opts every page out of static rendering and is production-risk + browser-gated. The remaining best-practice/security items are platform-set, already-handled, or a PSI-headless artifact on a real asset.

That pushes SYS-1 to the top as the one thing to build, and lands the rest as documented deferrals with named owners so coverage stays visible.

---

### SYS-1 · Unique page meta descriptions
- **Findings:** SEO-1
- **The system:** The crawl flags one meta description duplicated ×3. It resolves to the three golden pages that still carry the studio's generic default string *"Digital studio led by Mason O'Mara for creative technical strategy and service…"*: **Home** (served by `src/app/(frontend)/layout.tsx`, which sets the description for the metadata-less Home route), **About** (`about/page.tsx`), and **Contact** (`contact/page.tsx`). The Work page (`work/page.tsx`) and the project case studies (`work/[slug]/page.tsx`, e.g. `/work/moor`, which reads `node.description`) already ship unique descriptions — a prior cycle differentiated them, which is why the count is 3 and not 5. One fix: give each of the three a distinct, page-specific `description` (and the matching `openGraph`/`twitter` description so the social snippet stays consistent). The root-shell org description in the JSON-LD `ProfessionalService` block correctly stays the general studio line — the crawl dedups the `<meta name="description">`, not structured data. Root cause: a copy-paste default never differentiated on the three non-Work static pages.
- **Effort:** 2/5 — code, 3 files (`(frontend)/layout.tsx`, `about/page.tsx`, `contact/page.tsx`), self-contained metadata string edits authorable by the developer (Mason) from source. Bucket-2: the string itself needs no browser, but the crawl's "0 duplicate descriptions" read is confirmed at review. Confidence high.
- **Impact:** 4/5 — Priority-2 (SEO/discoverability): clears the sitewide §F duplicate-description offense and sharpens the search snippet on the three core storefront pages, one of which (Contact) is the site's single conversion surface per `CONTEXT.md`. Not a Priority-1, so not a 5.
- **Priority:** 4/2 = 2.0

### SYS-2 · CSP hardening off `unsafe-inline`
- **Findings:** SEC-1, BP-2
- **The system:** SEC-1 — the Content-Security-Policy is present (shipped a prior cycle in `next.config.ts`) but `script-src`/`style-src` carry `'unsafe-inline'`, which the crawl flags as weakening XSS protection. BP-2 — Chrome's Issues panel on Contact reports one issue whose `issueType` is exactly *"Content security policy"* (confirmed in `raw/…contact-desktop.psi.json`): the same `unsafe-inline` notice surfacing browser-side. Same root, one system. The `unsafe-inline` is a **deliberate, documented tradeoff** (see the block comment in `next.config.ts`): Next.js streams the RSC payload / hydration through inline `<script>`, and `framer-motion` + `next/font` inject inline styles — none can carry a nonce without `headers()`, which opts **every page out of static generation**. The XSS surface is already low (the only `dangerouslySetInnerHTML` sinks are the JSON-LD block and repo-owner markdown; no user input reaches an HTML sink), and the exfiltration/injection directives (`connect-src`, `frame-ancestors`, `base-uri`, `form-action`, `object-src`) are locked down. Removing `unsafe-inline` means a full nonce/hash migration — production-risk, and there is no browser here to verify it doesn't break the live store.
- **Effort:** 4/5 — a nonce/hash migration touches the render strategy of every page and is gated by a hard constraint ("do not break the live store", `CONTEXT.md`) plus the browser gate. Not a self-contained change a GitHub-only run can write blind. Owner: Mason.
- **Impact:** 3/5 — real hardening across the whole site, but not a `MISSION.md` top-3 priority, and the residual XSS risk is already low given the locked-down directives and absent user-input sinks.
- **Priority:** 3/4 = 0.75 — **hand to human** (production-risk, browser-gated).

### SYS-3 · Home console error — video load
- **Findings:** BP-1
- **The system:** On Home (desktop + mobile) the console logs `Failed to load resource: net::ERR_CONNECTION_FAILED` for `https://omaratechnology.com/mason.mp4` (confirmed in `raw/…-desktop.psi.json`). `mason.mp4` is a **real, present asset** in `public/` (the prior-cycle `/mason.webm` and `/mason-poster.jpg` 404s are already resolved), so this is not a missing-file bug fixable from source — it's the game start-screen video's connection being aborted inside PSI's throttled, sandboxed headless run, most likely the large media download timing out under the fixed mobile throttle. Confirming whether it reproduces for a real user, and whether the video needs `preload="none"`/lazy loading to avoid the aborted request, needs the rendered page and a real browser.
- **Effort:** 3/5 — diagnosis needs the rendered DOM + a real browser (bucket-3); a blind `preload` change to the game video risks the homepage's hero feel, which `CONTEXT.md` calls part of the product. Owner: Mason.
- **Impact:** 2/5 — Best-Practices gate (≥95), but the underlying asset works; the error is most likely a headless-run artifact, not broken behavior for real visitors.
- **Priority:** 2/3 = 0.67 — **hand to human** (diagnose in-browser).

### SYS-4 · Over-permissive CORS
- **Findings:** SEC-2
- **The system:** `Access-Control-Allow-Origin: *` appears on responses. It is Vercel-set on public, uncredentialed static assets (fonts, images, `_next` output) — the standard, benign CDN configuration. No credentialed response carries it. Nothing to change in the code we control.
- **Effort:** 1/5 — no code path; platform-set.
- **Impact:** 1/5 — benign; not a real exposure.
- **Priority:** 1/1 = 1.0 — **won't-chase** (platform-set, benign).

### SYS-5 · Modern image-format warnings
- **Findings:** BP-3, BP-4
- **The system:** SiteOne flags WebP (BP-3) and AVIF (BP-4) each as "0 critical, 1 warning" sitewide. `next.config.ts` already sets `images.formats: ["image/avif", "image/webp"]`, so `next/image` content already negotiates AVIF/WebP. The residual warning is the raw, format-agnostic assets the crawl still sees (self-hosted SVGs, the game poster/video) — expected, not a defect. Already handled in code.
- **Effort:** 1/5 — already configured; nothing to author.
- **Impact:** 1/5 — non-critical crawl warning; formats already served.
- **Priority:** 1/1 = 1.0 — **already handled** (no change).

### SYS-6 · Mobile performance cluster
- **Findings:** PERF-1, PERF-2, PERF-3, PERF-4, PERF-5, PERF-6, PERF-7, PERF-8, PERF-9
- **The system:** The mobile-throttle perf bundle — Lighthouse Performance 82–94 on mobile against **99–100 on desktop** — driven by content-image delivery (PERF-2, 238 KB across 8 project images), unused/legacy JS (PERF-4/7, 171 KB + 14 KB, framework + build output), render-blocking CSS (PERF-3, 13 KB, Next-generated chunks), the LCP breakdown/discovery pair (PERF-5/6, dominated by 2058 ms element render delay + a `fetchpriority` hint), a network-dependency chain (PERF-9), and one forced reflow (PERF-8, 46 ms in a framework bundle). The shared root is content-image weight + the framework bundle under PSI's fixed heavy mobile throttle (Moto G4 / slow-4G / 4× CPU). The code-authorable slivers (`priority`/`fetchPriority` on the measured LCP nodes) already shipped in cycle B; identifying any *remaining* per-page LCP element needs the rendered DOM, the images are a content re-export at scale, and the JS/CSS are framework/build-controlled (can't hand-edit generated config). **§C CrUX is empty**, so no real-user regression is even confirmed.
- **Effort:** 4/5 — spans content re-export at scale (owner: Mason/content) and framework/build tuning; most is not a self-contained code change this run can safely write blind.
- **Impact:** 2/5 — Priority-3, heavily discounted: desktop already passes, mobile is a fixed lab throttle, and with §C empty there is no field evidence real users are affected.
- **Priority:** 2/4 = 0.5 — **hand to human** (content re-export + framework tuning).

### SYS-7 · Sitewide server response
- **Findings:** PERF-10
- **The system:** The 20 slowest crawled URLs top out at **0.20s** — every one well within a fast server-response budget. No offense; reported for awareness. Kept as a system so coverage stays visible.
- **Effort:** 1/5 — no work.
- **Impact:** 1/5 — already passing.
- **Priority:** 1/1 = 1.0 — **no-op**.

---

## Order (highest leverage first)

| Rank | System | Impact | Effort | Priority | Do-first because |
|---|---|---|---|---|---|
| 1 | SYS-1 · Unique page meta descriptions | 4 | 2 | 2.0 | one code-authorable Priority-2 SEO fix — 3 golden pages share one description; distinct strings in 3 metadata files |
| 2 | SYS-4 · Over-permissive CORS | 1 | 1 | 1.0 | won't-chase — Vercel-set on public assets, benign |
| 3 | SYS-5 · Modern image-format warnings | 1 | 1 | 1.0 | already handled — AVIF/WebP configured in `next.config.ts` |
| 4 | SYS-7 · Sitewide server response | 1 | 1 | 1.0 | no-op — slowest URL 0.20s, within budget |
| 5 | SYS-2 · CSP hardening off `unsafe-inline` | 3 | 4 | 0.75 | hand to human — nonce migration opts out of static render, browser-gated |
| 6 | SYS-3 · Home console error (video load) | 2 | 3 | 0.67 | hand to human — real asset; diagnose the PSI-headless connection abort in-browser |
| 7 | SYS-6 · Mobile performance cluster | 2 | 4 | 0.5 | hand to human — content re-export + framework tuning; CrUX empty, desktop passes |

**Coverage:** all 17 findings mapped — SEO-1 (SYS-1); SEC-1, BP-2 (SYS-2); BP-1 (SYS-3); SEC-2 (SYS-4); BP-3, BP-4 (SYS-5); PERF-1…9 (SYS-6); PERF-10 (SYS-7). None dropped, none invented.

## The handoff

Execution draws the batch line against the effort budget. Only **SYS-1** is code-authorable this run; the rest are gated by hard constraints (browser-gated CSP, empty-field-data perf, platform-set CORS) or are no-ops — flagged for their named owners in `04-execute.md` and the PR, not dropped. After publish, the review re-baselines the live site and diffs it against this cycle's `01-baseline.md`: SEO-1's duplicate-description offense should read 0.
