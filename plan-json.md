# Plan: Adopt nav.json Pattern

Replace Sanity CMS with a local JSON-driven content system, identical in principle to masonomara.com.

---

## Build-Time-First Principle

All content resolution happens at **build time**, not render time. Next.js App Router statically generates every page when `generateStaticParams` is present and no dynamic functions (`cookies`, `headers`, `searchParams`) are used. That means:

- `fs.readFileSync` (nav.json, markdown) runs once at build — never per-request
- `toSlug` runs at build time inside `generateStaticParams` to emit all slug params — the `slug` param arriving at the page component is already the final value, no re-derivation needed
- No ISR, no `revalidate`, no `sanityFetch` — content changes require a redeploy, which is correct for a file-based system
- The API route (`/api/content/[...path]`) is the only runtime piece — it serves image binaries with immutable cache headers so browsers only hit it once per file

---

## The JSON Structure

One file — `content/nav.json` — owns all content for both portfolio and services.

```json
[
  {
    "name": "portfolio",
    "children": [
      {
        "name": "moor",
        "description": "One-liner shown on the portfolio card.",
        "tags": ["Product Design", "Development", "Identity"],
        "images": ["1-hero.png", "2-detail.png"]
      }
    ]
  },
  {
    "name": "services",
    "children": [
      {
        "name": "product design strategy",
        "description": "Available in monthly or extended engagements.",
        "items": ["Discovery & Scoping", "User Research", "Wireframing"]
      }
    ]
  }
]
```

**ContentNode type:**

```typescript
type ContentNode = {
  name: string; // required — auto-slugged to kebab-case
  children?: ContentNode[];
  description?: string; // card subtitle / service description
  tags?: string[]; // portfolio: shown on card and detail page
  images?: string[]; // portfolio: manually ordered image list
  items?: string[]; // services: bullet list of offerings
};
```

Markdown files live at `content/projects/{slug}/{slug}.md` for longer project body copy. Images at `content/projects/{slug}/images/`. The thumbnail shown on the portfolio card list lives at `content/projects/{slug}/{slug}.png` (or `.webp`).

The content route handler serves everything under `/content/...` — so an image at `content/projects/moor/images/1-hero.png` on disk is requested as `/content/projects/moor/images/1-hero.png` in the browser. This is also the exact path format already used in the project markdown files, so no find-and-replace needed.

Services have no detail pages — just the list. Simpler, and honest to what actually existed.

---

## What Gets Deleted

Before writing any new code, remove everything Sanity:

- `src/sanity/` — entire directory (client, queries, schema, types, lib, portableTextComponents)
- `sanity.config.ts`
- `sanity.cli.ts`
- `sanity-typegen.json`
- `src/app/studio/` — the embedded CMS editor
- `src/app/api/draft-mode/` — enable/disable draft mode routes
- `src/app/api/og/` — OG image route that queries Sanity
- `src/app/components/DisableDraftMode.tsx`
- `src/app/components/RelatedServices.tsx` — was wired to Sanity, unused
- `src/app/components/Category.tsx` — Sanity category badge, unused
- `src/app/components/Title.tsx` — check if used anywhere; delete if not

Then remove Sanity from `package.json`:

- `sanity`, `next-sanity`, `@sanity/icons`, `@sanity/image-url`, `@sanity/vision`
- `next-seo` (unused — site uses Next.js metadata API throughout)

Add: `marked` (markdown → HTML)

---

## Steps

### 1. Create `content/nav.json`

Populate with all current portfolio projects and all services from `ServicesSection.tsx`. The services data is already there in hardcoded JS — just convert it to JSON. Portfolio projects: use what's in Sanity now (pull the list from the CMS or the `PROJECTS_QUERY`).

### 2. Create content directories

For each portfolio project: `content/portfolio/{slug}/images/` and `content/portfolio/{slug}/{slug}.md`. Images can be migrated from Sanity CDN or added fresh.

### 3. Create content route handler

New file: `src/app/content/[...path]/route.ts`

Responds to GET `/content/...` — the same URL pattern already embedded in the markdown image references (`/content/projects/moor/images/...`). No path rewriting needed in markdown.

Serves any file from the `content/` directory at the project root with:

- Path traversal check (resolved path must start with CONTENT_DIR)
- MIME type from extension (png, jpg, jpeg, webp, gif, svg)
- `Cache-Control: public, max-age=31536000, immutable`

Mirrors masonomara.com exactly.

### 4. Create `src/lib/content.ts`

Central helper module. All functions here are build-time only — called from server components and `generateStaticParams`, never from client components. Keeps fs logic in one place.

```typescript
// All the shared logic: readNav, toSlug, getImages, loadMarkdown
export const toSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export function readNav(): ContentNode[] { ... }           // fs.readFileSync nav.json — build time
export function getPortfolioItems(): ContentNode[] { ... } // filter to portfolio children
export function getServiceItems(): ContentNode[] { ... }   // filter to services children
export function loadMarkdown(slug: string): string { ... } // reads content/projects/{slug}/{slug}.md, runs through marked(), returns HTML (empty string if absent)
export function getImages(slug: string): string[] { ... }  // uses node.images if present, else auto-discovers content/projects/{slug}/images/ sorted naturally — returns /content/projects/{slug}/images/{file} URL strings
export function getThumbnail(slug: string): string { ... } // returns /content/projects/{slug}/{slug}.png (or .webp) URL for card display
```

`toSlug` is used in `generateStaticParams` to produce slug params. The page component receives `slug` directly from params — it never needs to call `toSlug` at render time. The node is found by matching `toSlug(item.name) === slug`, which happens once per page at build.

### 5. Rewrite `ServicesSection.tsx`

Currently: hardcoded JS array in the component, marked `"use client"`.
After: import `getServiceItems()` from `src/lib/content.ts`. Same render output, data now lives in JSON.
Remove `"use client"` — this becomes a server component, data resolved at build time.
The parent page passes nothing down; `ServicesSection` reads the data itself at build.

### 6. Rewrite portfolio list page + `ProjectCard.tsx`

`portfolio/page.tsx`: call `getPortfolioItems()` at build time, pass results as props to the card grid. No async data fetching at render.
`ProjectCard.tsx`: receives a plain `ContentNode` object — no Sanity types. Image src is a static string: `/api/content/portfolio/{slug}/images/{firstImage}`. Remove `urlFor`, Sanity type imports, and the multi-fallback image logic.

### 7. Rewrite portfolio detail page

`portfolio/[slug]/page.tsx`:

- `generateStaticParams()` — reads nav.json once at build, emits all `{ slug }` params
- Page component receives `slug` from params — calls `loadMarkdown(slug)` and `getImages(slug)` once at build, results are static HTML strings and string arrays
- Passes pre-resolved data as props to `Project.tsx`
- Remove `urlFor`, `sanityFetch`, `PROJECT_QUERY`, `PortableText`, `generateMetadata` Sanity fetch

`Project.tsx`: receives `{ title, html, images, tags }` as plain props. Renders `<div dangerouslySetInnerHTML={{ __html: html }} />` for body. No Sanity imports, no async, no client fetch.

### 8. Delete `services/[slug]/page.tsx` and `Service.tsx`

No individual service pages — the services list is sufficient. If a service needs more detail later, a markdown file can be added to `content/services/{slug}/{slug}.md` and a simple detail page added then. Don't build for hypothetical future use.

### 9. Clean up `layout.tsx`

Remove: `SanityLive`, `VisualEditing`, `DisableDraftMode`, `draftMode()`.
Layout becomes a plain synchronous function — no more `async` needed.

### 10. Rewrite `sitemap.ts`

Replace Sanity API calls with `getPortfolioItems()` and `getServiceItems()`. Zero async, zero API calls.

### 11. Delete Sanity files + remove packages

Delete everything listed in "What Gets Deleted" above. Run `npm uninstall` for Sanity packages, `npm install marked`.

---

## What Doesn't Change

- Homepage game (Supabase leaderboard) — untouched
- Contact page + nodemailer — untouched
- About page — untouched
- Header, Marquee, ScrollToTop, FooterContact — untouched
- All CSS and styles — untouched
- All animations (framer-motion) — untouched
- Vercel deployment config — untouched

---

## End State

Adding a new portfolio project:

```json
{
  "name": "new project",
  "description": "What it is.",
  "tags": ["Product Design"],
  "images": ["hero.png"]
}
```

Plus `content/projects/new-project/images/hero.png`, `content/projects/new-project/new-project.png` (thumbnail), and optionally `content/projects/new-project/new-project.md`.

No CMS login. No API token. No schema change. No deploy hook.

---

## Todo

### Phase 1 — Migrate the `portfolio/` folder ✓

The `portfolio/` folder at the project root already contains all 15 projects, each with a markdown writeup, a thumbnail image, and an `images/` directory. It just needs to be moved and the nav.json scaffolded so the code can use it.

Note on Sanity content: before Phase 3 (deleting Sanity), run `npx sanity dataset export` to download a full NDJSON snapshot of all Sanity documents. Cross-check against the existing `portfolio/` folder — any images or writing still only in Sanity need to be downloaded from the CDN and added to the right project folder before Sanity is removed. Most content appears to already be captured in the markdown files.

- [x] Move `portfolio/` → `content/projects/` (a simple folder rename/move at the project root)
- [x] Confirm each project directory has: `{slug}.md`, `{slug}.png` or `.webp`, and `images/` subfolder
- [x] Export Sanity dataset: exported to `sanity-export.tar.gz` (25 docs, 13 images)
- [x] Cross-check snapshot against `content/projects/` — no project documents had image assets attached in Sanity; nothing to download. Two Sanity projects (Cureader, Current Media Company) have no local folder — decide whether to add them before Phase 3.
- [x] Write placeholder `content/nav.json` — include all 15 project names (in desired display order) and all 5 service categories with their items lists; descriptions and final image curation can be placeholder/empty for now
  - Portfolio entries need at minimum: `name` (exact, since slug derives from it)
  - Service entries need: `name`, `description`, `items` (copy from `ServicesSection.tsx` — it's all there)
- [x] Verify slugs: confirm `toSlug(name)` for each nav.json entry matches its folder name in `content/projects/`

### Phase 2 — Package cleanup ✓

- [x] Uninstall: `sanity`, `next-sanity`, `@sanity/icons`, `@sanity/image-url`, `@sanity/vision`, `next-seo`
- [x] Install: `marked`
- [x] Install: `@types/marked` if needed — not needed, marked ships its own types

### Phase 3 — Delete Sanity infrastructure

- [ ] Delete `src/sanity/` (entire directory)
- [ ] Delete `sanity.config.ts`
- [ ] Delete `sanity.cli.ts`
- [ ] Delete `sanity-typegen.json`
- [ ] Delete `src/app/studio/` (entire directory)
- [ ] Delete `src/app/api/draft-mode/` (entire directory)
- [ ] Delete `src/app/api/og/` (entire directory)
- [ ] Delete `src/app/components/DisableDraftMode.tsx`
- [ ] Delete `src/app/components/RelatedServices.tsx`
- [ ] Delete `src/app/components/Category.tsx`
- [ ] Delete `src/app/components/Title.tsx` (confirm unused first)
- [ ] Delete `src/app/(frontend)/services/[slug]/` (entire directory)
- [ ] Delete `src/app/components/Service.tsx`

### Phase 4 — Create new infrastructure

- [ ] Create `src/lib/content.ts`
  - [ ] Export `ContentNode` type
  - [ ] Export `toSlug(name)`
  - [ ] Export `readNav()` — reads `content/nav.json` at build time
  - [ ] Export `getPortfolioItems()` — filters to portfolio children
  - [ ] Export `getServiceItems()` — filters to services children
  - [ ] Export `loadMarkdown(slug)` — reads `content/projects/{slug}/{slug}.md`, runs through `marked`, returns HTML string (empty string if file absent)
  - [ ] Export `getImages(slug)` — uses `node.images` if present, otherwise auto-discovers files in `content/projects/{slug}/images/` sorted naturally; returns `/content/projects/{slug}/images/{file}` URL strings
  - [ ] Export `getThumbnail(slug)` — checks for `{slug}.png` then `{slug}.webp` in `content/projects/{slug}/`; returns `/content/projects/{slug}/{slug}.{ext}` URL string
- [ ] Create `src/app/content/[...path]/route.ts`
  - [ ] Path traversal guard
  - [ ] MIME type map (png, jpg, jpeg, webp, gif, svg)
  - [ ] Return file buffer with `Cache-Control: public, max-age=31536000, immutable`

### Phase 5 — Rewrite services

- [ ] Rewrite `src/app/components/ServicesSection.tsx`
  - [ ] Remove `"use client"` directive
  - [ ] Remove hardcoded `servicesData` array
  - [ ] Call `getServiceItems()` at the top of the component (server component — no hook needed)
  - [ ] Confirm render output is identical to current

### Phase 6 — Rewrite portfolio list

- [ ] Rewrite `src/app/(frontend)/portfolio/page.tsx`
  - [ ] Remove `sanityFetch` and `PROJECTS_QUERY` imports
  - [ ] Call `getPortfolioItems()` directly (no await — synchronous fs read)
  - [ ] Pass items to `ProjectsSection`
- [ ] Rewrite `src/app/components/ProjectsSection.tsx`
  - [ ] Replace `PROJECTS_QUERYResult` type with `ContentNode[]`
  - [ ] Remove Sanity type imports
  - [ ] Update sort logic (order now comes from array index in nav.json, no separate `order` field needed)
- [ ] Rewrite `src/app/components/ProjectCard.tsx`
  - [ ] Replace prop type with `ContentNode`
  - [ ] Remove `urlFor`, `@sanity/image-url`, Sanity type imports
  - [ ] Remove multi-fallback image logic — thumbnail src is `getThumbnail(slug)`, a single `/content/projects/{slug}/{slug}.png` string
  - [ ] Remove `firstBodyText` extraction from PortableText blocks — use `node.description` directly
  - [ ] Update `href` to `/portfolio/{toSlug(node.name)}`

### Phase 7 — Rewrite portfolio detail

- [ ] Rewrite `src/app/(frontend)/portfolio/[slug]/page.tsx`
  - [ ] Add `generateStaticParams()` reading from `getPortfolioItems()`
  - [ ] Remove `sanityFetch`, `PROJECT_QUERY`, `urlFor` imports
  - [ ] Remove Sanity-based `generateMetadata` fetch — derive title from slug or node name
  - [ ] Call `loadMarkdown(slug)` and `getImages(slug)` in the page body (build time)
  - [ ] Pass `{ title, html, images, tags, description }` as props to `Project`
  - [ ] Hero image: `images[0]` rendered above the fold (same pattern as current)
- [ ] Rewrite `src/app/components/Project.tsx`
  - [ ] Replace prop type — plain object `{ title: string, html: string, images: string[], tags?: string[], description?: string }`
  - [ ] Remove `PortableText`, `next-sanity`, Sanity type imports
  - [ ] Render body as `<div dangerouslySetInnerHTML={{ __html: html }} />`
  - [ ] Keep framer-motion animations and email CTA

### Phase 8 — Strip Sanity from layout and sitemap

- [ ] Rewrite `src/app/(frontend)/layout.tsx`
  - [ ] Remove `SanityLive`, `VisualEditing`, `DisableDraftMode` imports and JSX
  - [ ] Remove `draftMode()` call and conditional block
  - [ ] Remove `async` from the function signature
- [ ] Rewrite `src/app/sitemap.ts`
  - [ ] Remove Sanity `client` import and all `client.fetch` calls
  - [ ] Call `getPortfolioItems()` and `getServiceItems()` for dynamic routes
  - [ ] Keep static routes array unchanged

### Phase 9 — Verify and clean up

- [ ] Run `npm run build` — confirm zero Sanity imports remain, zero type errors
- [ ] Confirm all portfolio pages render correctly with local images
- [ ] Confirm services page renders correctly from JSON
- [ ] Confirm sitemap generates correct URLs
- [ ] Delete any now-unused CSS modules (e.g. `styles/project.module.css` if Project.tsx no longer needs it — check first)
- [ ] Confirm `.env` — remove `SANITY_*` vars from `.env.local`, keep Supabase vars

### Phase 10 — Content finalization (human work, after everything is live)

Full rewrite of `content/nav.json` and any markdown files that need polish. The system is functional at this point — this phase is purely content, no code.

- [ ] Write final `description` for each portfolio project in nav.json (shown on card)
- [ ] Write final `tags` for each portfolio project in nav.json (shown on detail page)
- [ ] Set final `images` order for each project — curate which images appear and in what sequence in the detail page slideshow
- [ ] Review each `{slug}.md` — edit, trim, or expand copy as needed
- [ ] Confirm thumbnail images (`{slug}.png/.webp`) look good on the portfolio card grid
- [ ] Review services list in nav.json — update any service names, descriptions, or items that changed
- [ ] Final check: add or remove any portfolio projects from nav.json as desired
