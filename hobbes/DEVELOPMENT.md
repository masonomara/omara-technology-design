# Development

<!-- Human-owned. The stack and the rules of the build — kept true to the repo by a human, updated the same day the build changes. Hobbes reads it in full before touching code (the conventions and the "done means" gates) but never maintains it. -->

The stack and the rules of the build. Hobbes reads this in full before it touches code.

## Stack

- **Platform:** Vercel — Next.js hosting for `omaratechnology.com`, auto-deployed from GitHub. Preview deployments per branch/PR; production is a human publish.
- **Framework & language:** **Next.js 16** (App Router, React Server Components) + **React 19** + **TypeScript**. Routes live under `src/app/(frontend)/` (a route group); file-based content is served through `src/app/content/[...path]`.
- **Styling:** CSS Modules (`*.module.css`) per component, plus global CSS with the design-token system in `globals.css` (`:root` tokens for type sizes, leading, tracking, etc.), plus `styled-components`. No Tailwind, no preprocessor. Fonts via `next/font`.
- **Animation:** `framer-motion`. All shared variants live in `src/app/lib/motion.ts` — the library is intentionally small (5 variants). The homepage game's animations are tuned separately in `src/app/styles/index.module.css`.
- **Key integrations:** **Supabase** (`@supabase/supabase-js`) — backs the homepage score game (`scores` table). **Nodemailer** — the Contact form emails via SMTP (`src/app/lib/send-mail.ts`). **Vercel Analytics**. `react-hook-form` + `@hookform/resolvers` (forms), `marked` (renders the markdown case studies in `content/projects/*`), plus `dayjs`, `uuid`, `sonner`.
- **Content:** file-based in `content/` — `nav.json`, `services.json`, and per-project markdown/images under `content/projects/` (the Work case studies; `_archive/` holds retired ones).

## Build & run

- **Install:** `npm install`. (Running the Hobbes baseline tools locally has its own prereqs — see `hobbes/guides/SETUP.md`.)
- **Run locally:** `npm run dev` (`next dev`) → `http://localhost:3000`, hot-reloading.
- **Build / start:** `npm run build` then `npm run start`.
- **Test:** None automated. Verify by hand in the browser (mobile + desktop) and via the Hobbes baseline cycle (`python3 hobbes/tools/cli.py cycle`).
- **Lint:** `npm run lint` (`next lint` / ESLint with `eslint-config-next`). No separate formatter is committed.
- **Deploy:** push to GitHub → Vercel builds a **preview** for the branch/PR; **production is published by Mason on sign-off** — never automatically merged to live without it. Verify the preview on mobile + desktop first.

## Development rules

- **Branch + PR.** Work on a feature branch → PR to `main`. `main` is the source of truth; never commit nontrivial work straight to it.
- **Match the App Router and the surrounding file.** CSS Modules for component styles, `:root` design tokens in `globals.css` for shared type/spacing values, `framer-motion` variants imported from `src/app/lib/motion.ts`. Keep client-only work in `"use client"` components; keep data/metadata in server components.
- **Don't add motion variants** to `src/app/lib/motion.ts` without a clearly distinct use case, and keep `whileInView` viewports at `amount: 0.15`. Don't retune the homepage game's animations as part of site-animation work.
- **Homepage game gotcha:** if scores stop inserting with a `scores_pkey` unique-constraint error, the Supabase sequence is out of sync — see the fix in `CLAUDE.md`. Happens after any manual seed/restore/truncate of `scores`.
- **Secrets:** none in the repo. Supabase keys and SMTP credentials live in **Vercel env vars** — never hard-code tokens, keys, or credentials.
- **Done means:** verified in the browser on mobile + desktop · no new console errors · `npm run lint` shows no *new* offenses · no regression against the baseline targets (`hobbes/guides/BASELINE.md`).
