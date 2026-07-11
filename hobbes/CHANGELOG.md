# Changelog

<!-- Human-owned record. At the publish stage Hobbes drafts a new entry for the human to review and approve (see hobbes/templates/05-publish-template.md); past entries are history and are never rewritten. Per-cycle numbers live in the scorecard, not here. -->

The running record of shipped work. One change per entry, numbered in order, newest at the bottom of **Entries**.

**Format:** `YYYY-MM-DD — NNN type/name: what changed.`

**Types:** `feature` · `cleanup` · `fix` · `content` · `config` (extend as needed)

**Rule:** every `feature` carries a `RESULTS:` line with a measured outcome. Define the metric first. If you cannot measure it, it is not shipped.

Filled baseline scorecards live in `hobbes/cycle/<date>/01-baseline.md`.

---

## Entries

**2026-05-18 — 001 cleanup/theme-polish:** Imported and cleaned up the base Dawn theme fork — stripped unused files and dead code. Removed the route-protection plan from the storefront, cleaned up the mobile product-image slideshow, removed the product count from collection pages, and fixed the video play-button behavior on mobile. Ran a theme-check pass to clear warnings, with general style polish throughout. Wrote the initial project-goals doc. *(Work spanned 2026-05-18 to 2026-05-20.)*

**2026-05-20 — 002 cleanup/fonts:** Restored the Pragmatica and Pragmatica Condensed fonts and set up the theme's broader font system and tokens, including product-card typography.

**2026-05-21 — 003 cleanup/collections:** Audited three collections and tagged missing products — Hazel Minis, Mock Necks, Perfume — as `hazelmini`, `mockneck`, `perfume`.

**2026-05-21 — 004 cleanup/sizing-guide:** Added four size charts (hoodie, mock neck, barrel pants, joggers), added the oversized-fit note at the top, and removed all Australian size references.

**2026-05-21 — 005 cleanup/email-address:** Removed and replaced every reference to any email other than shop@hazelboutique.com.

**2026-05-21 — 006 feature/shop-pay:** Enabled Shop Pay express checkout on every page for one-tap checkout. RESULTS: After about 80,000 sessions the share of orders completed with Shop Pay declined from 9.5% to 6.7% and the reached checkout rate went down 15%. Small sample size, but nothing suggests the Shop Pay buttons helped with checkout.

**2026-06-05 — 007 feature/custom-embroidery:** Built a custom-embroidery add-on that lets customers personalize products on the product page. An "add custom embroidery" button opens a modal with live preview and a thread-color picker, a configurable fee, and a customization that carries through the drawer, cart line items, and the order, editable and removable throughout. Pulls product and variant colors from metafields (`hex_color`, `display_color`), hides the thread-color variant from the standard picker and surfaces it in the modal, and is fully configurable from theme settings. RESULTS: 60 orders on the three mock necks, 3 customizations.

**2026-06-11 — 008 baseline/web-baseline:** Captured the Step 0 web baseline across the golden path (home, collection, product) — category scores, lab metrics, and CrUX field data. Numbers and gaps were captured in the cycle scorecard as the source of truth (the 2026-06-11 cycle folder has since been removed from the repo). Measurement only — no code shipped.

**2026-06-12 — 009 cleanup/shop-pay-removal:** Removed the Shop Pay express checkout / installment messaging from the product page (the "4 payments of … with Shop Pay" block in `sections/main-product.liquid`), sunsetting feature 006. RESULTS: removal driven by 006's measured outcome — over ~80,000 sessions the Shop Pay order share fell 9.5%→6.7% and the reached-checkout rate dropped 15% with the buttons enabled; no evidence they helped checkout, so they're gone.
