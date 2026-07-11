# Execution — 2026-07-11

Site: https://omaratechnology.com/ · Cycle: 2026-07-11-C · Branch: `hobbes-cycle-2026-07-11-C` · Driven by Hobbes from `03-plan.md`.

## 1. The batch — effort budget

Budget `B = 100` (`hobbes.toml` `[cycle] effort_budget` — "do everything"). Walking `03-plan.md` top-down, every system fits inside the budget; the batch is **the entire plan**. But only one system is *code-authorable* this run — the budget doesn't cut the rest, hard constraints do:

| System | Effort | This run |
|---|---|---|
| SYS-1 · Unique page meta descriptions | 2 | **Ship** (code) |
| SYS-4 · Over-permissive CORS | 1 | Won't-chase (platform-set, benign) |
| SYS-5 · Modern image-format warnings | 1 | Already handled (AVIF/WebP configured) |
| SYS-7 · Sitewide server response | 1 | No-op (already fast) |
| SYS-2 · CSP hardening | 4 | Hand to human (production-risk, browser-gated) |
| SYS-3 · Home console error (video) | 3 | Hand to human (diagnose in-browser) |
| SYS-6 · Mobile performance cluster | 4 | Hand to human (content re-export + framework tuning) |

**Spent (code): ~2 pts (SYS-1).** Nothing is left on the code side for a later cycle — the deferrals are gated by hard constraints (the browser gate, the "don't break the live store" rule, empty CrUX field data, platform-set headers), not by budget. This is the complete, honest code surface of this cycle's findings on a mature site whose prior cycles already closed the a11y/landmark/LCP/security-header/image-format work.

## 2. Stack notes (from `DEVELOPMENT.md`)

- Next.js 16 App Router + React 19 + TypeScript. Routes under `src/app/(frontend)/`. Per-route `metadata` exports; a metadata-less route (Home) inherits from the nearest layout (`(frontend)/layout.tsx`), whose `description` therefore *is* the Home description.
- Metadata edits are pure server-side string changes — no client component, no motion variant, no token, no CSS touched. `framer-motion` (`src/app/lib/motion.ts`, `whileInView` `amount: 0.15`) and the homepage game animations are untouched.
- Checker: the repo's `npm run lint` maps to `next lint`, which **Next 16 removed**, and the standalone ESLint crashes on the committed flat-config compat wrapper — a pre-existing toolchain skew, out of scope. Type discipline held via `npx tsc --noEmit` on the touched files. Browser/crawl verification is the human's at review.

## 3. Implementation — per system

### SYS-1 · Unique page meta descriptions  (closes SEO-1)  ✅
Three golden pages shared the generic default *"Digital studio led by Mason O'Mara for creative technical strategy and service…"*. Gave each a distinct, page-specific description, and updated the matching `openGraph.description` + `twitter.description` on each so the social snippet stays consistent with the page. The JSON-LD `ProfessionalService.description` in `(frontend)/layout.tsx` is left as the general studio line — the crawl dedups `<meta name="description">`, not structured data, and that block correctly describes the organization.

- **`src/app/(frontend)/layout.tsx`** (Home) → *"O'Mara Technology — a digital studio led by Mason O'Mara, designing and building mobile apps, websites, applied AI, and software from strategy through launch."* (meta + og + twitter; JSON-LD org description untouched).
- **`src/app/(frontend)/about/page.tsx`** (About) → *"About O'Mara Technology and Mason O'Mara — how the studio approaches creative technical strategy, design, and development for founders building digital products."* (meta + og + twitter).
- **`src/app/(frontend)/contact/page.tsx`** (Contact) → *"Contact O'Mara Technology to book a free 20-minute intro call with Mason O'Mara about your mobile app, website, AI product, or software project."* (meta + og + twitter; leans into the primary conversion goal per `CONTEXT.md`).

All three are distinct from each other, from Work's existing *"See O'Mara Technology's work — case studies…"*, and from the `/work/[slug]` fallback.
- **Bucket-2 — needs crawl confirmation at review:** the sitewide SiteOne "duplicate meta descriptions" count reads **0** (down from 1), and the three pages render their new descriptions with no other metadata regression.

### SYS-2 · CSP hardening off `unsafe-inline`  (SEC-1, BP-2)  → human
**Hand to Mason.** The CSP in `next.config.ts` already locks down `connect-src`, `frame-ancestors`, `base-uri`, `form-action`, and `object-src`; the `'unsafe-inline'` on `script-src`/`style-src` is a documented tradeoff to preserve static rendering (Next RSC/hydration inline scripts, `framer-motion`/`next/font` inline styles — none can carry a nonce without `headers()`, which opts every page out of static generation). BP-2 is the same notice surfacing in Chrome's Issues panel on Contact (`issueType: "Content security policy"`). Removing `unsafe-inline` is a full nonce/hash migration — production-risk, browser-gated, and blocked by "do not break the live store" (`CONTEXT.md`). Decide whether the nonce migration is worth the static-render cost.

### SYS-3 · Home console error — video load  (BP-1)  → human
**Hand to Mason.** `mason.mp4` returns `ERR_CONNECTION_FAILED` in the PSI headless run. The asset is present in `public/` (the old `/mason.webm` 404 is resolved), so this is not a source-fixable missing file — most likely the game start-screen video's download aborting under PSI's fixed mobile throttle. Confirm in a real browser whether it reproduces for users; if so, consider `preload="none"`/lazy-loading the video (a change to the homepage hero feel that `CONTEXT.md` guards, so it wants a human eye, not a blind edit).

### SYS-4 · Over-permissive CORS  (SEC-2)  → won't-chase
`Access-Control-Allow-Origin: *` is Vercel-set on public, uncredentialed static assets. Benign, platform-controlled. No code change.

### SYS-5 · Modern image-format warnings  (BP-3, BP-4)  → already handled
`next.config.ts` sets `images.formats: ["image/avif", "image/webp"]`; `next/image` content already negotiates modern formats. The residual SiteOne warning is the raw SVG/poster/video assets, expected. No code change.

### SYS-6 · Mobile performance cluster  (PERF-1…9)  → human
**Hand to Mason.** Content project-image re-export at scale (PERF-2), JS bundle / legacy-transpile tuning (PERF-4/7), render-blocking Next-generated CSS (PERF-3), the LCP breakdown/discovery pair and network chain (PERF-5/6/9), and the framework forced reflow (PERF-8) — all content- or framework-owned. The code-authorable LCP `priority`/`fetchPriority` slivers shipped in cycle B; any remaining per-page LCP element needs the rendered DOM. §C CrUX is empty and desktop scores 99–100, so no real-user regression is confirmed.

### SYS-7 · Sitewide server response  (PERF-10)  → no-op
Slowest crawled URL is 0.20s, within a fast server-response budget. Nothing to change.

## 4. Task list

- [x] SYS-1 — differentiate Home description (`(frontend)/layout.tsx`, meta + og + twitter; JSON-LD org line kept)
- [x] SYS-1 — differentiate About description (`about/page.tsx`, meta + og + twitter)
- [x] SYS-1 — differentiate Contact description (`contact/page.tsx`, meta + og + twitter)
- [x] Typecheck — `npx tsc --noEmit` clean on touched files (lint toolchain crash is pre-existing/out of scope)
- [x] Write PR: baseline before, what shipped, human to-do

## 5. Human to-do (carried into the PR)

- **Publish** (Mason) — merge → Vercel preview → verify mobile + desktop → go live → add the `published` label.
- **Browser/crawl-confirm** (Mason, review) — bucket-2: the SiteOne "duplicate meta descriptions" count reads **0**, and Home/About/Contact render their new descriptions with no metadata regression (SYS-1 / SEO-1).
- **CSP** (Mason) — decide whether to migrate `script-src`/`style-src` off `'unsafe-inline'` (nonce/hash vs static-render cost), and clear the Contact CSP Issues-panel notice (SYS-2 / SEC-1, BP-2).
- **Diagnose** (Mason) — the Home `mason.mp4` `ERR_CONNECTION_FAILED`; confirm it's the PSI-headless video abort, not a real user error, and decide on `preload`/lazy-load (SYS-3 / BP-1).
- **Content / perf** (Mason) — re-export heavy project images; review JS bundle / legacy-transpile settings, render-blocking CSS, and the forced-reflow read (SYS-6 / PERF-1…9).
- **Toolchain** (Mason) — realign `eslint` with `eslint-config-next` so `npm run lint` runs again (pre-existing; `next lint` removed in Next 16).
