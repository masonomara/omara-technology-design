# Execution — 2026-07-11

Site: https://omaratechnology.com/ · Cycle: 2026-07-11-B · Branch: `hobbes-cycle-2026-07-11` · Driven by Hobbes from `03-plan.md`.

## 1. Batch selection — effort budget

Budget **B = 100** (`hobbes.toml` → `[cycle] effort_budget`; 100 ≫ a full plan, so "do everything"). Walking `03-plan.md` top-down, the total code-authorable effort is small — only two systems (SYS-1, SYS-2) carry a self-contained code change; the rest are no-ops, already-handled, or browser-gated/content-owned and belong to the human. **The batch is every system**, shipping all code-authorable parts and flagging the rest for review.

| System | Effort | This run |
|---|---|---|
| SYS-1 · Missing `<main>` landmark | 1 | ✅ ship code (bucket-2) |
| SYS-2 · LCP image discovery | 2 | ✅ ship code (bucket-2) |
| SYS-7 · Home console error | 3 | — hand to human (Supabase in headless run) |
| SYS-4 · Sitewide response time | 1 | — no-op (already fast) |
| SYS-6 · Over-permissive CORS | 1 | — won't-chase (platform-set, benign) |
| SYS-8 · Image-format warnings | 1 | — already handled (AVIF/WebP configured) |
| SYS-5 · CSP hardening | 4 | — hand to human (production-risk, browser-gated) |
| SYS-3 · Mobile performance | 4 | — hand to human (content re-export + framework tuning) |

Spent (code): ~3 pts. Deferred to human/content: CSP nonce migration (SYS-5), ERR_CONNECTION_FAILED diagnosis (SYS-7), SYS-3 image re-export + JS bundle. Nothing left for a later cycle on the code side.

## 2. Stack notes (from `DEVELOPMENT.md`)

- Next.js 16 App Router + React 19 + TS. Routes under `src/app/(frontend)/`. CSS Modules + `globals.css` `:root` tokens. `framer-motion` variants only from `src/app/lib/motion.ts` (not touched — no variant added, `whileInView` viewports left at `amount: 0.15`). Homepage game animations in `src/app/styles/index.module.css` — **not touched** (the `Game.tsx` edit is a `fetchPriority` attribute on the wordmark `<img>`, not animation tuning).
- Checker: the repo's `npm run lint` maps to `next lint`, which **Next 16 removed**; the standalone ESLint (`eslint@10.2.0`, pinned in `package-lock.json`) crashes on load against the committed `eslint-config-next` flat-config compat wrapper — a pre-existing repo toolchain skew, not introduced here and out of scope for this cycle. Type discipline held via `npx tsc --noEmit` → **0 errors** on the touched files. The lint toolchain fix and browser verification are the human's at review.
- LCP `priority` on `next/image` sets `fetchpriority=high` + eager load; `fetchPriority` is a valid React 19 DOM attribute on a raw `<img>`.

## 3. Implementation — per system

### SYS-1 · Missing `<main>` landmark — `src/app/(frontend)/page.tsx`  (closes A11Y-1)
- Promoted the Home content wrapper `<div className={styles.pageContainer}>` → `<main className={styles.pageContainer}>` (same CSS-module class, no visual change). Home was the one golden page shipping no `main` landmark; every sibling (`about`, `work`, `work/[slug]`, `services`, `contact`) already uses `<main className="standardPageContainer">`.
- **Bucket-2:** confirm at review that the sitewide-crawl "missing main landmark" reads **0** and that Home is visually unchanged on mobile + desktop.

### SYS-2 · LCP image discovery — `ProjectCard.tsx` + `ProjectsSection.tsx` + `Game.tsx`  (closes PERF-4)
- `ProjectCard.tsx`: added an optional `priority?: boolean` prop, forwarded to the `next/image`. Default (undefined) preserves the existing lazy behavior for every card below the fold.
- `ProjectsSection.tsx`: pass `priority={index === 0}` so the first project card (Moor — first item in `nav.json`, and the measured LCP node on `/work` mobile) loads eagerly with `fetchpriority=high` instead of `loading="lazy"`.
- `Game.tsx`: added `fetchPriority="high"` to the start-screen wordmark `<img src="/wordmark.svg">` (the measured LCP node on Home mobile) so the browser prioritizes it.
- Contact (Header logo) and Sample Work (Moor hero) already carry `priority` — left untouched.
- **Bucket-2:** confirm at review that the LCP-discovery audit passes on `/work` and Home mobile, and that the first work card / start screen show no layout shift.

### SYS-7 · Home console error  (BP-1)
- **Hand to human (Mason):** `ERR_CONNECTION_FAILED` on Home is not identifiable from source — most likely the Supabase leaderboard call failing inside PSI's sandboxed headless run (the prior `/mason.webm` / `/mason-poster.jpg` 404s are resolved; both assets and `mason.mp4` are present in `public/`). Confirm in-browser whether it reproduces for real users.

### SYS-5 · CSP hardening  (SEC-1, BP-2)
- **Hand to human (Mason):** the CSP is present in `next.config.ts` and already locks down the exfiltration/injection-relevant directives; the `'unsafe-inline'` on `script-src`/`style-src` is a documented tradeoff to keep static rendering. Tightening it (nonces/hashes across Next inline hydration, `framer-motion` inline styles, `next/font`) is production-risk and browser-gated. Review the Contact inspector-issues CSP notice and decide whether a nonce migration is worth the static-render cost.

### SYS-3 · Mobile performance  (PERF-1,2,3,5,6,7,8)
- **Hand to human (Mason):** content project-image re-export at scale (PERF-5), JS bundle / legacy-transpile tuning (PERF-3/6), render-blocking CSS + network chain + forced reflow (PERF-2/7/8) — framework/content-owned, and §C field data is empty so no real-user regression is confirmed. The one code-authorable LCP sliver shipped as SYS-2.

### SYS-4 · Sitewide response time  (PERF-9)
- No-op — slowest crawled URL is 0.28s, within budget.

### SYS-6 · Over-permissive CORS  (SEC-2)
- Won't-chase — `Access-Control-Allow-Origin: *` is Vercel-set on public, uncredentialed static assets; benign and platform-controlled.

### SYS-8 · Image-format warnings  (BP-3, BP-4)
- Already handled — `next.config.ts` sets `images.formats: ["image/avif", "image/webp"]`; content images ship as AVIF/WebP. The residual SiteOne warning is raw SVG/poster assets, expected. No code change.

## 4. Task list

- [x] SYS-1 — Home wrapper `<div>` → `<main>` in `(frontend)/page.tsx`
- [x] SYS-2 — `priority?` prop on `ProjectCard`, `priority={index === 0}` in `ProjectsSection`, `fetchPriority="high"` on the Home wordmark in `Game.tsx`
- [x] Typecheck — `npx tsc --noEmit` shows 0 errors on touched files (lint toolchain crash is pre-existing/out of scope)
- [x] Write PR: baseline before, what shipped, human to-do

## 5. Human to-do (carried into the PR)

- **Publish** (Mason) — merge → Vercel preview → verify mobile + desktop → go live → `published` label.
- **Browser-confirm** (Mason, review) — bucket-2 changes: sitewide crawl "missing main landmark" reads 0 and Home is visually unchanged; LCP-discovery passes on `/work` + Home mobile with no layout shift on the first work card / start screen.
- **Diagnose** (Mason) — the Home `ERR_CONNECTION_FAILED` (SYS-7); confirm it's the Supabase call in the headless run, not a real user error.
- **CSP** (Mason) — decide on tightening `script-src`/`style-src` off `'unsafe-inline'` (nonce/hash migration vs static-render cost), and review the Contact CSP inspector notice (SYS-5).
- **Content / perf** (Mason) — SYS-3: re-export heavy project images; review JS bundle / legacy-transpile settings and the Header forced-reflow read.
- **Toolchain** (Mason) — realign `eslint` with `eslint-config-next` so `npm run lint` runs again (pre-existing; `next lint` was removed in Next 16).
