# Baseline scorecard — YYYY-MM-DD

Client: [name] · Site: [url] · Platform: [platform] · Run by: [name] · Date: [YYYY-MM-DD]

Golden path: [page 1 url] · [page 2 url] · [page 3 url]

`✓` = pass · `✗` = fail · `✗cut` = PSI run cut off before network-idle (the value is where it stopped) · blank = human sign-off pending.

The tools fill this in — `hobbes/tools/psi.py` → A, B, C, D · `seo.py` → E · `crawl.py` → F. Section G, manual a11y, is the human's to sign. The filled file is the baseline. Compare each cycle to the last one and to the targets in `hobbes/guides/BASELINE.md`. Page labels come from each `[[golden_path]]` entry in `hobbes.toml`, or from the URL when no `label` is set. The `Page 1/2/3` rows below are only examples.

## A. Lighthouse scores

| Page / Device | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Page 1 — mobile |  |  |  |  |
| Page 1 — desktop |  |  |  |  |
| Page 2 — mobile |  |  |  |  |
| Page 2 — desktop |  |  |  |  |
| Page 3 — mobile |  |  |  |  |
| Page 3 — desktop |  |  |  |  |

## B. Lab metrics

| Page / Device | LCP (s) | CLS | FCP (s) | TTFB (s) | TBT (ms) | Speed Index (s) |
|---|---|---|---|---|---|---|
| Page 1 — mobile |  |  |  |  |  |  |
| Page 1 — desktop |  |  |  |  |  |  |
| Page 2 — mobile |  |  |  |  |  |  |
| Page 2 — desktop |  |  |  |  |  |  |
| Page 3 — mobile |  |  |  |  |  |  |
| Page 3 — desktop |  |  |  |  |  |  |

## C. Field data (CrUX 28-day)

| Page | LCP (s) | INP (ms) | CLS | Pass |
|---|---|---|---|---|
| Page 1 |  |  |  |  |
| Page 2 |  |  |  |  |
| Page 3 |  |  |  |  |

## D. Accessibility — automated (axe via PSI)

| Page / Device | Failing audits | Pass | Details (rule × nodes) |
|---|---|---|---|
| Page 1 — mobile |  |  |  |
| Page 1 — desktop |  |  |  |
| Page 2 — mobile |  |  |  |
| Page 2 — desktop |  |  |  |
| Page 3 — mobile |  |  |  |
| Page 3 — desktop |  |  |  |

## E. SEO checklist (golden path)

| Item | Page 1 | Page 2 | Page 3 |
|---|---|---|---|
| Unique, descriptive title |  |  |  |
| Meta description present |  |  |  |
| Canonical correct |  |  |  |
| Single H1 + ordered headings |  |  |  |
| Valid structured data |  |  |  |
| Open Graph / Twitter tags |  |  |  |
| All images have alt |  |  |  |
| Indexable |  |  |  |

| Site-level | Present |
|---|---|
| sitemap.xml |  |
| robots.txt |  |

## F. Site-wide (whole-site crawl)

| SiteOne quality score (0–10) | Value |
|---|---|
| Performance |  |
| SEO |  |
| Security |  |
| Accessibility |  |
| Best practices |  |

| SEO / structure | Count | Pass |
|---|---|---|
| Broken links (4xx) |  |  |
| Redirects |  |  |
| Missing titles |  |  |
| Duplicate titles |  |  |
| Missing meta descriptions |  |  |
| Pages with multiple H1 |  |  |
| Pages with skipped heading levels |  |  |

| Accessibility | Count | Pass |
|---|---|---|
| Pages missing image alt |  |  |
| Pages missing aria-labels |  |  |
| Pages missing roles |  |  |
| Pages missing html lang |  |  |

| Best practices | Count | Pass |
|---|---|---|
| Pages with invalid inline SVG |  |  |
| Pages with duplicate inline SVG |  |  |
| Pages with non-clickable phone numbers |  |  |
| Valid HTML |  |  |

| Security | Pass |
|---|---|
| HSTS header |  |
| Content-Security-Policy |  |
| Referrer-Policy |  |
| Permissions-Policy |  |
| Brotli compression |  |
| HTTPS / valid TLS cert |  |

## G. Accessibility — manual (human sign-off)

Tools cannot judge these. A page is not a full pass until these rows are signed: keyboard flow, visible focus, logical order, screen-reader sense, whether the alt text means anything, contrast by eye, reduced motion.

| Page / Device | Keyboard | Focus visible | Logical order | Screen reader | Alt meaningful | Contrast | Reduced motion |
|---|---|---|---|---|---|---|---|
| Page 1 — mobile |  |  |  |  |  |  |  |
| Page 1 — desktop |  |  |  |  |  |  |  |
| Page 2 — mobile |  |  |  |  |  |  |  |
| Page 2 — desktop |  |  |  |  |  |  |  |
| Page 3 — mobile |  |  |  |  |  |  |  |
| Page 3 — desktop |  |  |  |  |  |  |  |
