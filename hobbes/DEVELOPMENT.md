# Development

<!-- Human-owned. The stack and the rules of the build — kept true to the repo by a human, updated the same day the build changes. Hobbes reads it in full before touching code (the conventions and the "done means" gates) but never maintains it. -->

The stack and the rules of the build. Hobbes reads this in full before it touches code.

## Stack

- **Platform:** Shopify **Advanced** plan (not Plus — that gates features like Cart Transform Functions). Store `hazelboutiquenj.myshopify.com` → `hazelboutique.com`.
- **Framework & language:** Liquid + vanilla JavaScript (native Custom Elements / Web Components — no framework) + plain CSS. A fork of Shopify **Dawn v13.0.1**. No build toolchain: no npm, no bundler, no preprocessor.
- **Key integrations:** Judge.me (reviews) · Instafeed (Instagram) · DA Restock (back-in-stock) · Route Insurance (shipping protection — flagged for removal) · AccessEase (a11y audit, admin-only) · Meta Pixel (purchase events, TikTok + Instagram). The cart is a **drawer** on Shopify's AJAX Cart API with a PubSub event bus (`assets/pubsub.js`).
- **Hosting / deploy:** Shopify-hosted. Source in this Git repo (`github.com/masonomara/hazel.git`); ships to the store theme via the Shopify CLI (bidirectional — admin/editor edits pull back down). Fonts and images on the store CDN (`cdn.shopify.com/s/files/1/0051/3264/8566/`).

## Build & run

- **Install:** Nothing for the theme itself. You need the Shopify CLI — `npm i -g @shopify/cli @shopify/theme` (or `brew install shopify-cli`), then `shopify auth login`. (Running the Hobbes baseline tools locally has its own prereqs — see `hobbes/guides/SETUP.md`.)
- **Run locally:** `shopify theme dev` — hot-reloading preview bound to the live store's data.
- **Test:** None automated. Verify by hand in the browser (mobile + desktop) and via the Hobbes baseline cycle (`python3 hobbes/tools/cli.py cycle`).
- **Lint / format:** `shopify theme check` (Theme Check). No `.theme-check.yml` is committed, so it runs Shopify's defaults.
- **Deploy:** `shopify theme push` to a theme on the store. Always push to an **unpublished / dev theme and preview first** — only Mason publishes the live theme, never without sign-off. `config/settings_data.json` is admin-generated and the editor can overwrite it, so coordinate pushes so code and editor edits don't clobber each other.

## Development rules

- **Branch + PR.** Work on a feature branch → PR to `main`. `main` is the source of truth; never commit nontrivial work straight to it.
- **Match Dawn and the surrounding file.** Custom Elements for JS behavior, the `properties[...]` line-item-property pattern for product-form data, CSS custom properties for design tokens. Custom Hazel CSS lives in the appended Hazel section at the foot of `assets/base.css` — keep overrides there.
- **Don't hand-edit** `config/settings_data.json` (admin-generated), anything under `.shopify/` (gitignored), or Dawn base styles in place — override in the appended Hazel section instead.
- **Keep the fork upgrade-safe.** Minimize core-theme edits: prefer a self-contained snippet rendered from one insertion point (the embroidery build holds to a single render line) over scattered changes.
- **Secrets:** none in the repo. App and store credentials live in the Shopify admin and the CLI's own auth — never hard-code tokens, API keys, or app secrets. (The store id in CDN URLs is public and fine.)
- **Done means:** verified in the browser on mobile + desktop · no new console errors · Theme Check shows no *new* offenses · no regression against the baseline targets (`hobbes/guides/BASELINE.md`).
