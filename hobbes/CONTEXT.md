# Context

<!-- Human-owned. Who the client is — goals, users, people, access, and constraints — kept current by a human whenever the engagement changes. Hobbes reads it for bearings but never writes or maintains it. A stale fact here steers a downstream decision wrong. -->

Who and what this client is. Read it to get your bearings on the client, or any time a goal or an owner or a constraint is unclear. Keep it current. A stale fact here will steer a downstream decision wrong.

## 1. Business goals

Hazel Boutique is a women's fashion boutique in New Jersey whose online store is hosted at `hazelboutique.com` with Shopify Advanced. It sells clothing such as hoodies, mock necks, barrel pants, joggers, accessories, perfume, home goods, and a vintage line under the EVI11 Twin Vintage label.

The primary work is ongoing theme development: make the storefront clean, confident, and product-forward; keep it accessible and fast; and ship targeted features as they come up.

As with most e-commerce stores, the primary goals are to improve average order value (AOV), increase conversion rates, and hold the mix of site performance, discoverability, and accessibility.

## 2. Users

Women of all ages looking for stylish, unique, and trendy products. Primarily based around the Jersey Shore / NJ local and tourist shoppers, plus a young social-media-driven audience.

## 3. People and roles

- **Jenna Campfield** — runs Hazel Boutique; owns brand, product, merchandising, and final sign-off; supplies assets (e.g. the May 2026 size charts).
- **Mason O'Mara** — developer / operator, and creator of Hobbes. Builds, ships, and drives the baseline cycle; the only one who publishes the live theme. Works under **Tigertail**, his agency, which owns Hobbes (the agent running this engagement).
- **Britni Adamo** — Hazel's second in command; competent and more responsible for the day-to-day on the site.
- **Brenda McWynn** — social media manager; for help regarding things like TikTok, Instagram, Facebook.

## 4. Access

Locations only — never the secrets themselves.

- **Shopify admin** — owner's account; store `hazelboutiquenj.myshopify.com`. Theme ships via the Shopify CLI authed on Mason's machine.
- **GitHub** — `github.com/masonomara/hazel.git` (Mason).
- **Store CDN** — fonts and images under `cdn.shopify.com/s/files/1/0051/3264/8566/`.
- **Apps** (configured in Shopify admin) — Judge.me, Instafeed, DA Restock, Route Insurance, AccessEase.
- **Email** — `shop@hazelboutique.com` (contact + returns).

## 5. Hard constraints

- **Shopify Advanced, not Plus.** No Plus-only mechanics (Cart Transform Functions, full checkout extensibility) — design features to work on Advanced (the embroidery upcharge is carried by a **higher-priced variant of the same product** — a hidden "Embroidery" option toggled "Standard"↔"Embroidered" — not a separate fee product or a line-price transform; the `embroidery_price` theme setting drives only the on-page "+$20" display label, per `config/settings_schema.json`).
- **Keep the fork upgrade-safe.** Minimize edits to Dawn core; prefer self-contained snippets over scattered changes.
- **Brand bar:** clean, product-forward. Premium licensed fonts (Pragmatica, PragmaticaCondensed, Millionare Script, Lustria) — rights secured, hosted on the store CDN; do not reintroduce unlicensed font use.
- **Accessibility is a standing requirement** — every change holds the a11y bar.
- **Do not break the live store.** `settings_data.json` is admin-generated; coordinate pushes so the theme editor and code do not clobber each other. Verify on mobile + desktop before publishing.
- **No automated tests** — correctness is proven by manual verification plus the baseline cycle.
