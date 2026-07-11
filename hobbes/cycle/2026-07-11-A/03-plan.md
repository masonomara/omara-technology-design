# Plan — 2026-07-11

Site: https://omaratechnology.com/ · Cycle: 2026-07-11-A · Authored by Hobbes from `02-evaluation.md` + `01-baseline.md` + `raw/`.

19 findings, grouped into 9 systems. The scores read from separate files: **Impact** against `MISSION.md` (a11y → SEO → performance, in that order), **Effort** against `DEVELOPMENT.md` (the stack) + `CONTEXT.md` (the people). Every finding lands in exactly one system; nothing dropped, nothing invented.

**The lens the plan applies this cycle:** Lighthouse a11y is already 100 and axe (§D) reads 0 on every page, so the a11y priority is met on the *automated* bar — the a11y findings that remain are label-association and the SEO-side alt-coverage count, not axe failures. CrUX field data (§C) is entirely empty, so **no performance finding can be confirmed against real users** — every perf impact is discounted for that (per the template's field-vs-lab rule). That pushes the deterministic, code-authorable SEO/best-practice/a11y-plumbing systems to the top and the mobile-throttle perf bundle to the bottom.

---

### SYS-1 · Unique meta descriptions
- **Findings:** SEO-3
- **The system:** Every static page (`layout.tsx`, `(frontend)/layout.tsx`, `about`, `work`, `contact`, `services`) ships the identical description *"Product design and development studio for apps, websites, and software."* — the crawl flags it duplicated ×4. Project case-study pages are already unique (they read `node.description` from `content/`). One fix: give each static page a distinct `description` (and matching `openGraph`/`twitter` description). Root cause is a copy-paste default that was never differentiated.
- **Effort:** 2/5 — code, ~6 files, self-contained metadata edits authorable by the developer; no browser needed to verify the string, though the render is trivially confirmable. Confidence high.
- **Impact:** 4/5 — Priority-2 (SEO/discoverability): clears the golden-path §E gap and the sitewide §F duplicate-description count, sharpens every search snippet across the storefront's core pages.
- **Priority:** 4/2 = 2.0

### SYS-2 · Contact-form label association
- **Findings:** A11Y-1
- **The system:** The `/contact` form's `<label>`s carry no `htmlFor` and its inputs no `id`, so the label→control link the crawler checks is absent on 7 controls (name, email, role, company, budgetLow, budgetHigh, and the message `<textarea>`, whose visible label is empty). The checkbox group is already implicitly labelled (each wraps its input), so it's not in scope. One fix: `id`/`htmlFor` pairs on the six text inputs plus an accessible name on the textarea. Root cause: labels authored as sibling text, never wired.
- **Effort:** 2/5 — code, one file (`ContactForm.tsx`), self-contained. Bucket-2: the fix is written from source, but the axe/crawler "0 form-label issues" read is a browser check at review.
- **Impact:** 5/5 — Priority-1 (accessibility) **and** the contact form is the site's single conversion surface per `CONTEXT.md` (qualified intro-call bookings). Highest-stakes a11y control on the site.
- **Priority:** 5/2 = 2.5

### SYS-3 · Home H1 + heading integrity
- **Findings:** SEO-1
- **The system:** Two heading problems in one finding. (a) The Home route SSR-renders `0 h1` — its only content, `<Game>`, is a `ssr:false` dynamic import, so the crawler and search engines see an empty container with no H1. (b) The sitewide crawl counts `1` page with multiple H1 (not on the golden path; unidentifiable from source — the per-page SEO table in `raw/crawl.json` shows one H1 each, so it's an SSR/render artifact the crawl report names). One fix clears (a): a single server-rendered, visually-hidden `<h1>` in `page.tsx`. (b) needs the crawl report to name the page and is handed to review.
- **Effort:** 2/5 — code, `page.tsx` + a `sr-only` utility in `globals.css`; self-contained. Bucket-2: confirm the H1 is present in SSR HTML and invisible on screen. The multi-H1 page is a human identify-then-fix (needs the rendered/crawled DOM).
- **Impact:** 4/5 — Priority-2 (SEO): fixes the golden-path §E heading gap and gives assistive tech a document title where there is none today.
- **Priority:** 4/2 = 2.0

### SYS-4 · Decorative marquee images / alt coverage
- **Findings:** SEO-2
- **The system:** All 36 "images missing alt" on **every** golden page are the same element: the `<Marquee>` (rendered site-wide in `(frontend)/layout.tsx`) repeats a 3-wave set 12×, each wave an `<Image src="/waves-background.svg" alt="">`. `alt=""` is the *correct* accessibility treatment for a decorative image — which is why axe (§D) and the SiteOne a11y check (§F "Pages missing image alt: 0") both pass — but `seo.py`'s coverage check counts empty alt as missing, so §E fails on all five golden pages. The real content images already carry alt. One fix that satisfies both bars without harming a11y: render the decorative waves as CSS backgrounds (`aria-hidden` spans) instead of `<img>`, removing them from the image-coverage count entirely and trimming 36 DOM nodes + 36 image requests per page.
- **Effort:** 2/5 — code, `Marquee.tsx` + `Marquee.module.css`, self-contained. Bucket-2: confirm the marquee renders visually identical (same SVG, same 21×21, same spacing) on mobile + desktop.
- **Impact:** 4/5 — Priority-2 (SEO): clears the §E alt-coverage gap on all five golden pages in one change, with a small Priority-3 perf dividend (fewer nodes/requests). No a11y regression — the images stay decorative.
- **Priority:** 4/2 = 2.0

### SYS-5 · Security response headers
- **Findings:** SEC-1, SEC-2
- **The system:** SEC-1 — CSP, Referrer-Policy, and Permissions-Policy are absent on all 20 responses (HSTS + Brotli already present). Referrer-Policy and Permissions-Policy are pure additive headers with no functional surface; CSP is different — this app leans on inline hydration scripts, `styled-components`, inline `style={{}}`, Vercel Analytics, and Supabase, so a wrong CSP silently breaks the live store, and there is no browser here to verify it. SEC-2 — `Access-Control-Allow-Origin: *` is on public static assets, Vercel-set and benign (no credentialed content). One fix: add the two safe headers (plus `X-Content-Type-Options`) in `next.config.ts`; document a ready CSP but hand its enable-and-verify to the human (production-risk, browser-gated); note SEC-2 as won't-chase.
- **Effort:** 2/5 — code, one file (`next.config.ts`), the two safe headers are trivial and low-risk. CSP is gated to a human by a hard constraint ("do not break the live store", `CONTEXT.md`), which caps what this run ships.
- **Impact:** 3/5 — hardening across the whole site (§F security row), but not one of `MISSION.md`'s top-3 priorities, and the highest-value header (CSP) is the one that must wait for browser verification.
- **Priority:** 3/2 = 1.5

### SYS-6 · Image dimensions & modern formats
- **Findings:** PERF-7, BP-2, BP-3
- **The system:** PERF-7 — the game start-screen `<img src="/wordmark.svg">` (a raw `<img>`, intrinsic 363×143) has no `width`/`height`, the one unsized-image flag. BP-2/BP-3 — WebP/AVIF "1 warning" each: `next/image` already serves WebP, but AVIF isn't enabled. One fix: add intrinsic `width`/`height` to the wordmark (plus `height:auto` in its CSS to preserve the aspect ratio) and enable `images.formats: ["image/avif","image/webp"]` in `next.config.ts`.
- **Effort:** 2/5 — code, `Game.tsx` + `Game.module.css` + `next.config.ts`, small and self-contained. Bucket-2: confirm no layout shift on the start screen.
- **Impact:** 2/5 — Priority-3 (performance): marginal CLS reservation on one image and modern-format coverage; the BP warnings are non-critical. Discounted because §C field data is empty.
- **Priority:** 2/2 = 1.0

### SYS-7 · Mobile performance — LCP, JS, render path
- **Findings:** PERF-1, PERF-2, PERF-3, PERF-4, PERF-5, PERF-6, PERF-8, PERF-9
- **The system:** The mobile-throttle perf cluster: score 84–94 on mobile (desktop is 99–100), driven by image delivery (256 KB of content project images), unused/legacy JS (171 KB / 14 KB — framework + build output), render-blocking CSS (10 KB, Next-generated), LCP discovery (`fetchpriority`/no-lazy — the Header logos and project thumbnail already carry `priority`), a network-dependency chain, and one forced reflow. The shared root is content-image weight + framework bundle under PSI's fixed heavy mobile throttle. Almost none of this is cleanly code-authorable from source: image re-export is content-at-scale, the JS is framework/build-controlled, and **CrUX (§C) is empty so no real-user regression is even confirmed**. The code-authorable slivers (LCP `priority`) are already in place; the marquee→CSS change (SYS-4) trims some image requests. The rest is a human/content + framework-tuning effort.
- **Effort:** 4/5 — spans content re-export at scale (owner: Mason/content) and framework/build tuning; most of it is not a self-contained code change this GitHub-only run can safely write blind.
- **Impact:** 2/5 — Priority-3, and heavily discounted: desktop already passes, mobile is a fixed lab throttle, and with §C empty there is no field evidence real users are affected.
- **Priority:** 2/4 = 0.5

### SYS-8 · Home console errors
- **Findings:** BP-1
- **The system:** Two runtime errors on Home. The **404** is code-authorable and confirmed from source: `Game.tsx`'s start-screen video references `/mason.webm` and `poster="/mason-poster.jpg"`, **neither of which exists** in `public/` (only `mason.mp4` and `masonScreenshot.png` are present) — so the `<source>` and the poster both 404. The **ERR_CONNECTION_FAILED** is not identifiable from source (most likely the Supabase leaderboard call failing in PSI's sandboxed headless run, not a code defect) and is handed to review. One fix for the 404: drop the two broken asset references.
- **Effort:** 1/5 — code, one file, remove two dead references. Bucket-2: confirm the start-screen video still plays and the console reads 0 errors on Home.
- **Impact:** 3/5 — Best-Practices gate (≥95) plus a genuine correctness bug (broken references shipping to every Home visitor). Small, certain, cheap.
- **Priority:** 3/1 = 3.0

### SYS-9 · Slowest URLs (sitewide response)
- **Findings:** PERF-10
- **The system:** The 20 slowest crawled URLs top out at **0.22s** — all well within a fast server-response budget. No offense; reported for awareness. **Won't-fix:** nothing to change; kept as a system so coverage stays visible.
- **Effort:** 1/5 — no work.
- **Impact:** 1/5 — already passing.
- **Priority:** 1/1 = 1.0 (no-op)

---

## Order (highest leverage first)

| Rank | System | Impact | Effort | Priority | Do-first because |
|---|---|---|---|---|---|
| 1 | SYS-8 · Home console errors | 3 | 1 | 3.0 | two dead asset refs 404 on every Home visit — cheapest real bug on the board |
| 2 | SYS-2 · Contact-form labels | 5 | 2 | 2.5 | Priority-1 a11y on the site's only conversion surface |
| 3 | SYS-1 · Unique meta descriptions | 4 | 2 | 2.0 | clears §E + §F duplicate-description across all core pages, one pass |
| 4 | SYS-3 · Home H1 + headings | 4 | 2 | 2.0 | gives the homepage a document title SSR + assistive tech can see |
| 5 | SYS-4 · Marquee alt coverage | 4 | 2 | 2.0 | clears §E alt-coverage on all 5 golden pages, trims DOM/requests |
| 6 | SYS-5 · Security headers | 3 | 2 | 1.5 | two safe headers ship now; CSP handed off (production-risk, browser-gated) |
| 7 | SYS-6 · Image dims & formats | 2 | 2 | 1.0 | unsized image + AVIF, small CLS/format wins |
| 8 | SYS-9 · Slowest URLs | 1 | 1 | 1.0 | no-op — already fast, note only |
| 9 | SYS-7 · Mobile performance | 2 | 4 | 0.5 | mostly content-at-scale + framework tuning; §C field empty, human-owned |

## Handoff to execution

Budget this cycle is **100** (`hobbes.toml` → "do everything"). The whole ordered list is in scope; execution ships every code-authorable part top-to-bottom and flags what a GitHub-only, no-browser run can't finish:

- **Ship this run (code):** SYS-8 (404 refs), SYS-2 (labels), SYS-1 (descriptions), SYS-3 (Home H1 + `sr-only`), SYS-4 (marquee→CSS), SYS-5 (two safe headers), SYS-6 (image dims + AVIF). Every browser-verifiable change is flagged **bucket-2 / needs browser confirmation at review**.
- **Hand to human:** CSP enable-and-verify (SYS-5), the ERR_CONNECTION_FAILED diagnosis (SYS-8), the multi-H1 page identification (SYS-3), and the content/framework body of SYS-7 (image re-export at scale, JS bundle) — all owner: Mason, per `CONTEXT.md`.
- **Won't-chase:** SEC-2 (benign CORS on public assets), SYS-9 (already fast).

After publish, the review re-baselines the live site and diffs it against this cycle's `01-baseline.md` — that's where the measured after lands.
