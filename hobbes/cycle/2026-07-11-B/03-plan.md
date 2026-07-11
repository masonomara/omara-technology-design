# Plan — 2026-07-11

Site: https://omaratechnology.com/ · Cycle: 2026-07-11-B · Authored by Hobbes from `02-evaluation.md` + `01-baseline.md` + `raw/`.

16 findings, grouped into 8 systems. The two scores read from separate files: **Impact** against `MISSION.md` (accessibility → SEO → performance, in that order), **Effort** against `DEVELOPMENT.md` (the stack) + `CONTEXT.md` (the people). Every finding lands in exactly one system; nothing dropped, nothing invented.

**The lens this cycle applies:** the SEO priority is fully met — §E and §F both pass on every golden page (the prior cycle's meta-description, H1, and alt-coverage work has landed), so SEO carries no findings. Lighthouse a11y is 100 and axe (§D) reads 0, but the sitewide crawl (§F/A11Y-1) still flags **one page missing a `<main>` landmark** — a real, code-authorable accessibility gap and the single highest-leverage fix on the board. CrUX field data (§C) is entirely empty, so **no performance finding can be confirmed against real users** — every perf impact is discounted for that (per the template's field-vs-lab rule). The CSP is now present (a prior cycle added it) but the crawl flags it weakened by `'unsafe-inline'`, which is a documented, browser-gated tradeoff, not a blind code change. That ordering puts the a11y landmark first, the one code-authorable LCP sliver second, and the framework/content/platform-bound perf and security items — none safely authorable in a GitHub-only run — below them.

---

### SYS-1 · Missing `<main>` landmark
- **Findings:** A11Y-1
- **The system:** The sitewide crawl flags `1` page with no `<main>` landmark (0 critical, 1 warning across 20 pages). Every golden page except Home wraps its content in `<main className="standardPageContainer">` (`about`, `work`, `work/[slug]`, `services`, `contact` all do). The **Home** route (`(frontend)/page.tsx`) is the exception: its content sits in a plain `<div className={styles.pageContainer}>`, so the page ships no `main` landmark for assistive tech and the crawler's landmark check. One fix clears it: promote that wrapper `<div>` to `<main>`, keeping the same CSS-module class so nothing moves visually. Root cause: the Home wrapper was authored as a `<div>` while the shared page template used `<main>`, and the two never converged.
- **Effort:** 1/5 — code, one file, one tag change (`div` → `main`) with the class unchanged; self-contained, authorable by the developer. Bucket-2: the landmark's presence and the no-visual-shift both confirm in the browser at review. Confidence high.
- **Impact:** 5/5 — Priority-1 (accessibility), the mission's first priority, and a landmark is a load-bearing screen-reader affordance (document structure / skip-to-content). One change clears the only outstanding a11y finding sitewide.
- **Priority:** 5/1 = 5.0

### SYS-2 · LCP image discovery
- **Findings:** PERF-4
- **The system:** PSI flags the largest-contentful-paint image as not optimally discoverable on the mobile golden path. Reading the raw LCP nodes per page: **/work**'s LCP is the first project-card image (`Moor`, the first item in `nav.json`) rendered by `ProjectCard`'s `next/image` with the default `loading="lazy"` — the LCP image is lazy-loaded, exactly what the audit ("LCP resources should not use loading=lazy") warns against, and /work is the worst mobile LCP on the site (4.73s, perf 81). **Home**'s LCP is the game start `<img src="/wordmark.svg">` (a raw `<img>` in the `ssr:false` game chunk) with no `fetchpriority`. **Contact** and **Sample Work** already carry `priority` on their LCP images (Header logo; Moor hero), so they need nothing. One fix each on the two that don't: give the first `ProjectCard` `priority` (sets `fetchpriority=high` + eager load) and add `fetchPriority="high"` to the Home wordmark.
- **Effort:** 2/5 — code, three small files (`ProjectCard.tsx`, `ProjectsSection.tsx`, `Game.tsx`), self-contained and authorable from source. Bucket-2: the LCP-discovery pass and no-layout-shift both need the browser at review.
- **Impact:** 3/5 — Priority-3 (performance): a genuine defect (the LCP image lazy-loaded) on the site's worst mobile page, but discounted because §C field data is empty, so no real-user regression is confirmed and desktop already passes.
- **Priority:** 3/2 = 1.5

### SYS-3 · Mobile performance — image weight, JS bundle, render path
- **Findings:** PERF-1, PERF-2, PERF-3, PERF-5, PERF-6, PERF-7, PERF-8
- **The system:** The mobile-throttle perf cluster: score 81–98 on mobile (desktop 99–100), driven by content-image delivery (PERF-5, 49 KB across 3 project images), unused/legacy JS (PERF-3 171 KB, PERF-6 14 KB — framework + build output), render-blocking CSS (PERF-2, 13 KB, Next-generated), a network-dependency chain (PERF-7), and one forced reflow (PERF-8, 2 pages — a `getBoundingClientRect` read in the Header's ResizeObserver / cursor follower, not safely changeable blind). Shared root: content-image weight + the framework bundle under PSI's fixed heavy mobile throttle. Almost none is cleanly code-authorable from source — image re-export is content-at-scale, the JS is framework/build-controlled, and **§C is empty so no real-user regression is even confirmed**. The one code-authorable LCP sliver is split out as SYS-2; the rest is content + framework tuning, owner Mason.
- **Effort:** 4/5 — spans content re-export at scale (owner: Mason/content) and framework/build tuning; most of it is not a self-contained change a GitHub-only, no-browser run can safely write blind.
- **Impact:** 2/5 — Priority-3, heavily discounted: desktop already passes, mobile is a fixed lab throttle, and with §C empty there is no field evidence real users are affected.
- **Priority:** 2/4 = 0.5

### SYS-4 · Sitewide server response time
- **Findings:** PERF-9
- **The system:** The 18 slowest crawled URLs top out at **0.28s** — all well within a fast server-response budget. No offense; reported for awareness. **Won't-fix:** nothing to change; kept as a system so coverage stays visible.
- **Effort:** 1/5 — no work.
- **Impact:** 1/5 — already passing.
- **Priority:** 1/1 = 1.0 (no-op)

### SYS-5 · Content-Security-Policy hardening
- **Findings:** SEC-1, BP-2
- **The system:** SEC-1 — the CSP is present (a prior cycle added it in `next.config.ts`) but the crawl flags it weakened by `'unsafe-inline'` on `script-src`/`style-src`. BP-2 — PSI's inspector-issues audit reports a "Content security policy" issue on Contact (desktop + mobile), the same policy surfacing a browser-side notice. The `unsafe-inline` is a **documented, deliberate tradeoff** (the file's own comment): this site is statically rendered, and a per-request nonce is read via `headers()` and opts every page out of static generation — so the app keeps `unsafe-inline` and locks down the exfiltration-relevant directives (`connect-src`, `frame-ancestors`, `object-src`, `base-uri`, `form-action`) instead. Tightening `script-src`/`style-src` further means nonces or hashes across Next's inline hydration, `framer-motion` inline styles, and `next/font` inline `<style>` — a change that silently breaks the live store if wrong and **cannot be verified without a browser**. Hard constraint "do not break the live store" (`CONTEXT.md`) gates it. Hand to human: review the Contact inspector notice and decide whether a nonce/hash migration is worth the static-render cost.
- **Effort:** 4/5 — code lives in `next.config.ts`, but the change is high-risk (production store), browser-gated, and entangled with static generation; not authorable-and-verifiable in this run. Owner: Mason.
- **Impact:** 2/5 — hardening beyond an already-present CSP; not one of `MISSION.md`'s top-3 priorities, and the current policy already blocks the high-value exfiltration/injection vectors.
- **Priority:** 2/4 = 0.5

### SYS-6 · Over-permissive CORS on static assets
- **Findings:** SEC-2
- **The system:** `Access-Control-Allow-Origin: *` on responses — Vercel-set on public static assets (SVGs, images, fonts), which carry no credentials, so any-origin read is benign. Not app-controllable without platform config. **Won't-chase:** platform-set and benign; kept as a system so coverage stays visible.
- **Effort:** 1/5 — no safe code path (platform-controlled).
- **Impact:** 1/5 — no real exposure (public, uncredentialed assets).
- **Priority:** 1/1 = 1.0 (won't-chase)

### SYS-7 · Home console connection error
- **Findings:** BP-1
- **The system:** PSI's errors-in-console audit logs `Failed to load resource: net::ERR_CONNECTION_FAILED` on Home (desktop + mobile). Not identifiable or fixable from source: the most likely cause is the Supabase leaderboard call for the homepage score game failing inside PSI's sandboxed, network-restricted headless run — an environment artifact, not a code defect (the prior `/mason.webm` / `/mason-poster.jpg` 404s are resolved; both assets and `mason.mp4` are present in `public/`). Confirming whether it reproduces for real users needs a browser and the live network. Hand to human.
- **Effort:** 3/5 — no source-authorable fix; needs the rendered page + live network to diagnose. Owner: Mason.
- **Impact:** 3/5 — Best-Practices gate (≥95) and a potential real error, but unconfirmed and likely a sandbox artifact.
- **Priority:** 3/3 = 1.0

### SYS-8 · Modern image-format warnings
- **Findings:** BP-3, BP-4
- **The system:** SiteOne flags WebP (BP-3) and AVIF (BP-4) support as `0 critical, 1 warning` each sitewide. `next/image` already serves both — `next.config.ts` sets `images.formats: ["image/avif", "image/webp"]`, so raster content images are delivered as AVIF/WebP with fallback. The residual warning is the crawler noting that some raw static assets (the decorative SVGs, the `bizCard.png`/poster) aren't in those formats, which is expected — SVG is already optimal and vector; a poster is a one-off. No code change clears a warning that's already satisfied for the content pipeline. **Note/won't-chase:** the format pipeline is in place; kept as a system so coverage stays visible.
- **Effort:** 1/5 — already configured; nothing safe to add.
- **Impact:** 1/5 — non-critical warning, already satisfied for content images.
- **Priority:** 1/1 = 1.0 (already handled)

---

## Order (highest leverage first)

| Rank | System | Impact | Effort | Priority | Do-first because |
|---|---|---|---|---|---|
| 1 | SYS-1 · Missing `<main>` landmark | 5 | 1 | 5.0 | Priority-1 a11y, the only outstanding a11y finding, one tag change on Home |
| 2 | SYS-2 · LCP image discovery | 3 | 2 | 1.5 | LCP image lazy-loaded on the worst mobile page; first-card `priority` + wordmark `fetchpriority` |
| 3 | SYS-7 · Home console error | 3 | 3 | 1.0 | Best-Practices gate, but unfixable from source (Supabase in headless) — human diagnose |
| 4 | SYS-4 · Sitewide response time | 1 | 1 | 1.0 | no-op — slowest URL 0.28s, already fast |
| 5 | SYS-6 · Over-permissive CORS | 1 | 1 | 1.0 | won't-chase — platform-set, benign on public assets |
| 6 | SYS-8 · Image-format warnings | 1 | 1 | 1.0 | already handled — AVIF/WebP configured; residual warning is SVG/poster |
| 7 | SYS-5 · CSP hardening | 2 | 4 | 0.5 | browser-gated, production-risk; nonce migration is Mason's call |
| 8 | SYS-3 · Mobile performance | 2 | 4 | 0.5 | content re-export + framework tuning; §C field empty, human-owned |

## Handoff to execution

Budget this cycle is **100** (`hobbes.toml` → "do everything"). The whole ordered list is in scope; execution ships every code-authorable part top-to-bottom and flags what a GitHub-only, no-browser run can't finish:

- **Ship this run (code):** SYS-1 (Home `<main>` landmark), SYS-2 (first-card `priority` + Home wordmark `fetchPriority`). Both are browser-verifiable → flagged **bucket-2 / needs browser confirmation at review**.
- **Hand to human (Mason):** SYS-5 (CSP nonce/hash migration + Contact inspector notice — production-risk, browser-gated), SYS-7 (ERR_CONNECTION_FAILED diagnosis — needs live network), SYS-3 (content image re-export at scale + JS bundle / legacy-transpile / forced-reflow tuning — content + framework-owned).
- **Won't-chase / already handled:** SYS-4 (already fast), SYS-6 (benign platform CORS), SYS-8 (AVIF/WebP already configured).

After publish, the review re-baselines the live site and diffs it against this cycle's `01-baseline.md` — that's where the measured after lands.
