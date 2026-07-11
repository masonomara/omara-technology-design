# Context

<!-- Human-owned. Who the client is — goals, users, people, access, and constraints — kept current by a human whenever the engagement changes. Hobbes reads it for bearings but never writes or maintains it. A stale fact here steers a downstream decision wrong. -->

Who and what this client is. Read it to get your bearings on the client, or any time a goal or an owner or a constraint is unclear. Keep it current. A stale fact here will steer a downstream decision wrong.

## 1. Business goals

O'Mara Technology is a product design and development studio at `omaratechnology.com`, led by Mason O'Mara out of Asbury Park, NJ and operating remotely. It works with founders and teams on mobile apps, websites, AI products, and software — end to end, design through deployment — handling the work internally or with trusted partners.

The site is the studio's storefront: a marketing and portfolio site whose job is to show the work and the taste behind it, and to make booking the free 20-minute intro call effortless. Two engagement types are on offer — a scoped **one-time project** (discovery → design → development → launch, client owns it at the end) and an ongoing **partnership** (iterative, minimum three-month engagement).

The primary goal is qualified intro-call bookings via the Contact page; supporting that are a credible, complete Work/case-study surface and a site that stays fast, accessible, and discoverable so the content does the selling.

## 2. Users

Founders and teams evaluating a design/development studio — deciding whether the work, the taste, and the way of working fit. Secondary: readers arriving from Mason's writing and videos (Substack, YouTube) and peers/referrers browsing the portfolio.

## 3. People and roles

- **Mason O'Mara** — product designer and software engineer; owns and runs the studio, builds and ships the site, drives the baseline cycle, and is the **only one who publishes** (deploys the live site on Vercel). Also the creator and operator of Hobbes.
- **Trusted partners** — content, additional design/dev, and specialist scope brought in per project when the work calls for it. No standing access to this repo.

## 4. Access

Locations only — never the secrets themselves.

- **GitHub** — `github.com/masonomara/omara-technology-design` (Mason).
- **Hosting / deploy** — Vercel (`omaratechnology.com`). Only Mason publishes.
- **Database** — Supabase, backing the homepage score game (`scores` table).
- **Email** — `info@omaratechnology.com` (Contact form; delivered via Nodemailer/SMTP from `src/app/lib/send-mail.ts`).
- **Analytics** — Vercel Analytics.
- **External profiles** (linked from the site, not part of the build) — `masonomara.com`, Substack `@masonomara`, YouTube `@masonomaratechnology`.

## 5. Hard constraints

- **Do not break the live store.** Only Mason publishes, and only after sign-off. Verify on mobile + desktop before publishing.
- **Accessibility is a standing requirement** — every change holds the a11y bar.
- **Protect the feel.** The site sells taste, so motion and finish are part of the product. The animation library is intentionally small — 5 variants in `src/app/lib/motion.ts`; don't add one without a clearly distinct use case. `whileInView` viewports use `amount: 0.15` everywhere. The homepage game's animations are tuned separately (see `CLAUDE.md`) — don't touch them during site-animation work.
- **Keep overrides where they belong.** Match the surrounding file — CSS-module + global-token conventions, the existing `framer-motion` variants, and the typography tokens in `globals.css`. Don't scatter one-off styles.
- **Secrets never in the repo.** Supabase keys and SMTP credentials live in Vercel env vars — never hard-code tokens or keys.
- **No automated tests** — correctness is proven by manual verification plus the baseline cycle.
