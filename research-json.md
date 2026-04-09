# Research: JSON-Based Content System
*Written: April 9, 2026 — based on today's commits in both repos*

---

## Overview

This report compares how **omaratechnology** currently manages content (via Sanity CMS) against how **masonomara.com** does it (via a single JSON file), with the goal of understanding what a simplified, JSON-native system would look like for omaratechnology.

---

## Part 1: The omaratechnology Sanity System

### Tech Stack
- **Next.js 16**, React 19, TypeScript
- **Sanity v5** — headless CMS, cloud-hosted, GROQ queries
- `next-sanity` — connects Next.js to Sanity with live preview, draft mode, visual editing
- `@supabase/supabase-js` — used only in the game homepage for scores and email subscriptions
- `framer-motion` — animations
- `react-hook-form`, `nodemailer`, `sonner`, etc. — contact form

### Schema Types (Registered in `src/sanity/schemaTypes/index.ts`)

Only 6 types are actually registered and active in Sanity:

| Type | Purpose |
|---|---|
| `blockContent` | Rich text array (blocks + images). Reusable field type. |
| `category` | Service categories. Has `order`, `title`, `slug`, `seo`. |
| `service` | Individual service pages. References a `category`. Has `order`, `title`, `slug`, `category`, `overview`, `mainImage`, `deepDive`. |
| `project` | Portfolio items. Has `order`, `title`, `slug`, `image`, `body`, `seo`. |
| `seo` | Reusable object type: `title`, `description`, `image`, `noIndex`. |
| `redirect` | URL redirects. `source`, `destination`, `permanent`, `isEnabled`. |

### Orphaned Schema Files (NOT registered in index.ts)

Three schema files exist in `src/sanity/schemaTypes/` but are **not imported into `index.ts`** — Sanity never sees them:

- `clientType.ts` — Client records with `headline`, `subhead`, `description`, `services[]`, `ctaText`, `ctaLink`, `mainImage`
- `employeeType.ts` — Employee records with `name`, `title`, `bio`, `photo`, `linkedIn`, `email`, `phone`
- `postType.ts` — Blog posts with `title`, `excerpt`, `relevantClients[]`, `relevantServices[]`, `postType`, `publishDate`, `author[]`, `body`, `mainImage`, `slug`

These represent intentions that were never completed or content types that got abandoned.

### Active Queries (`src/sanity/lib/queries.ts`)

Six GROQ queries are defined:

- `SERVICES_QUERY` — all services ordered by `order asc`, fetches `_id`, `title`, `slug`, `category->`, `overview`, `body`, `seo`
- `SERVICES_SLUGS_QUERY` — just slugs, for static param generation
- `SERVICE_QUERY` — single service by slug
- `CATEGORIES_QUERY` — all categories ordered by `order asc`
- `CATEGORY_QUERY` — single category by slug
- `PROJECTS_QUERY` — all projects ordered by `order asc`, fetches `_id`, `title`, `slug`, `body`, `order`, `image`, `seo`
- `PROJECT_QUERY` — single project by slug
- `REDIRECTS_QUERY` — all active redirects (used in `next.config`)
- `SITEMAP_QUERY` — defined but appears unused (sitemap.ts uses `client.fetch` directly)
- `OG_IMAGE_QUERY` — used by `/api/og/route.tsx`

### Schema / Query Mismatch (Active Bug)

The `serviceType.ts` schema defines:
- `overview` (blockContent)
- `mainImage` (image)
- `deepDive` (blockContent)

But `SERVICES_QUERY` and `SERVICE_QUERY` fetch:
- `overview` ✅
- `body` ❌ — this field doesn't exist in the schema

The query fetches `body` but the schema stores it as `deepDive`. Either the schema was renamed without updating the query, or vice versa. **Any content in `deepDive` would be silently returned as `null` for `body`.**

### How Pages Actually Use Data

- **Homepage** (`src/app/(frontend)/page.tsx`) — A client-side can-shooting game. Uses Supabase for leaderboard scores and email subscriptions. **Zero Sanity data.** Entirely hardcoded game logic.
- **Services page** — Renders `ServicesSection` component, which has **all services hardcoded** in a `servicesData` array in the component itself. Does not fetch from Sanity at all.
- **Portfolio page** — Fetches `PROJECTS_QUERY` via `sanityFetch`, passes results to `ProjectsSection`. This is the only page that actually uses Sanity data for visible content.
- **About page** — Not inspected but likely static.
- **Contact page** — Form with nodemailer.

### What Sanity Is Actually Doing

Given the above, Sanity is essentially:
1. Storing **portfolio projects** (used on `/portfolio`)
2. Storing **services** and **categories** (schema exists, fetches exist, but the services page ignores them and hardcodes data)
3. Providing **redirect management** (via `fetchRedirects` in `next.config`)
4. Running a **CMS studio** at `/studio`
5. Providing **draft mode** and **visual editing** (via `SanityLive`, `VisualEditing`, `DisableDraftMode`)

The complexity-to-value ratio here is very high. Sanity adds: cloud hosting, API calls at build time and runtime, a full CMS UI, auth tokens, draft mode, visual editing — all for what is effectively a list of portfolio projects and some redirects.

---

## Part 2: How masonomara.com Does It

### Tech Stack
Only 7 dependencies total (not counting dev deps):
```json
{
  "next": "16.2.2",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "@vercel/analytics": "^1.6.1",
  "@vercel/speed-insights": "^1.3.1",
  "lucide-react": "^1.7.0",
  "marked": "^17.0.1"
}
```

No CMS. No database. No auth. No API calls at build time. No client-side data fetching for content.

### The Architecture: One JSON File Rules Everything

**`content/nav.json`** is the single source of truth for the entire site. It is a JSON array of top-level section nodes, each with an optional `children` array. Here's the structure (simplified):

```json
[
  {
    "name": "about",
    "children": [
      {
        "name": "bio",
        "images": ["/brand/bitmap.png"],
        "static": true
      },
      {
        "name": "email",
        "href": "mailto:mason@omaratechnology.com"
      }
    ]
  },
  {
    "name": "work",
    "children": [
      {
        "name": "moor",
        "images": ["1-hero-shot.png", "6-search-modal-desktop.png", ...]
      },
      {
        "name": "asbury beans",
        "images": ["screenshot-1.webp", "screenshot-2.webp", "screenshot-3.webp"]
      }
    ]
  },
  {
    "name": "skills",
    "children": [
      { "name": "mobile apps" },
      { "name": "web apps" }
    ]
  },
  {
    "name": "friends",
    "children": [
      { "name": "ty", "href": "https://www.currentmediacompany.com/" }
    ]
  }
]
```

### NavNode Type

```typescript
type NavNode = {
  name: string;           // Required. Display name AND basis for auto-slug
  children?: NavNode[];   // If present, renders as collapsible folder
  href?: string;          // If present, renders as external link (no page)
  images?: string[];      // If present, overrides auto-discovered images
  hideTitle?: boolean;    // If true, page title is hidden
  static?: boolean;       // If true, shows single static image instead of slideshow
}
```

Every field except `name` is optional. Adding a project is just:
```json
{ "name": "new project", "images": ["hero.png"] }
```

### Slug Generation

Slugs are derived deterministically from `name` at build and render time. One function, used everywhere:

```typescript
const toSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
```

`"asbury beans"` → `asbury-beans`, `"lisa says gah"` → `lisa-says-gah`. No slug field to manage, no collisions, no CMS slug generation.

### URL Structure

All content pages follow `/{section}/{slug}`, served by a single dynamic route: `app/[section]/[slug]/page.tsx`. There is only one page component for all content — no per-section routing, no separate portfolio or services routes.

### Content Per Page

Each item in nav.json corresponds to a directory at `content/{section}/{slug}/`:

```
content/
  work/
    moor/
      moor.md          ← optional markdown copy
      images/
        1-hero-shot.png
        6-search-modal-desktop.png
```

The markdown file is named `{slug}.md`. It is optional — if not found, the content area is simply empty.

### Image Loading Logic

The page component checks for images in this order:
1. If the nav.json node has an `images` array → use those (manually curated order)
2. Otherwise → auto-discover all image files in `content/{section}/{slug}/images/`, sorted by natural number order (`1-hero.png` before `10-hero.png`)

Images that start with `/` (like `/brand/bitmap.png`) are treated as public asset paths. Everything else becomes `/content/{section}/{slug}/images/{filename}`.

### Image Serving

Images live in `content/` (not `public/`), so Next.js won't serve them automatically. A dedicated API route handles this:

**`app/content/[...path]/route.ts`:**
- Accepts any path under `/content/`
- Path traversal protection: `path.resolve(filePath).startsWith(CONTENT_DIR)`
- Detects MIME type from extension (png, jpg, webp, gif, svg)
- Returns file with `Cache-Control: public, max-age=31536000, immutable`

This is the cleanest possible file server — 40 lines, zero dependencies.

### Static Site Generation

`generateStaticParams()` reads nav.json at build time and emits one `{section, slug}` pair per leaf node (excluding those with `href` or `children`):

```typescript
export function generateStaticParams() {
  for (const folder of readNav()) {
    if (!folder.children || folder.name === "skills") continue;
    for (const item of folder.children) {
      if (!item.children && !item.href) {
        pages.push({ section: folder.name, slug: toSlug(item.name) });
      }
    }
  }
  return pages;
}
```

Adding a new item to nav.json automatically creates a new static page at build time. No CMS, no database write, no webhook trigger.

### Navigation Component

`Nav.tsx` is a client component that imports nav.json directly:

```typescript
import navData from "@/content/nav.json";
```

It renders a collapsible tree using the same `NavNode` type. Collapsed state persists to `localStorage`. The icon per node depends on its type:
- `ChevronRight` — folder (has children)
- `ExternalLink` — external link (has href)
- `Zap` — skill (in `skills` section, no link)
- `File` — content page (default leaf)

Active state is determined by `usePathname()` comparing against `/${section}/${slug}`.

### Sitemap

`app/sitemap.ts` also reads nav.json and generates sitemap entries per leaf node. Section-specific priorities hardcoded: `work: 0.7`, `about: 0.8`, `junk: 0.5`. Zero async, zero API calls.

### Header

`Header.tsx` is a breadcrumb component driven entirely by `usePathname()`. Splits the path, renders each segment. No data fetching.

### Slideshow Component

`Slideshow.tsx` is a pure presentational component taking `images: string[]`. Features:
- Auto-advance every 4 seconds
- Mouse drag to scrub between slides
- Touch swipe (with vertical scroll detection — only intercepts horizontal swipes)
- Direct DOM transform manipulation for drag (no re-renders during drag)
- Index state only updates on settle (for the auto-advance timer reset)

### What Gets Added When You Add a Project

1. Add one entry to `content/nav.json`:
   ```json
   { "name": "project name", "images": ["hero.png", "detail.png"] }
   ```
2. Create `content/work/project-name/images/` and add images
3. Optionally create `content/work/project-name/project-name.md` with a brief description

That's it. No CMS login, no schema migration, no API call, no deploy hook. Just a JSON edit and files on disk.

---

## Part 3: The Gap

### What omaratechnology needs to simplify

The CLAUDE.md states the goal clearly:
> "eventually i want to work towards a website that is fully and easily editable by json... adding a new project to the site is now just: `{ "name": "new thing", "images": ["hero.png"] }`"

The masonomara.com system achieves this exactly. Here's the comparison:

| Dimension | omaratechnology (Sanity) | masonomara.com (JSON) |
|---|---|---|
| Content source | Cloud API (Sanity) | Local `content/nav.json` |
| Adding a project | CMS login → create doc → fill fields → publish | Edit nav.json + add files |
| Build-time data | Async API fetches | `fs.readFileSync` (instant) |
| Slug management | Manual in CMS | Auto from `name` |
| Image management | Sanity asset upload | Files in `content/` folder |
| Redirects | Sanity document + API fetch | `next.config.ts` static array |
| Schema changes | Sanity schema files | Edit the NavNode type |
| Draft mode | Full Sanity draft/live system | Not needed |
| Dependencies | 15+ | 7 |
| Env variables needed | `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` + Supabase vars | None (content) |
| Offline dev | Requires Sanity cloud access | Fully local |

### What works well in omaratechnology that the JSON system doesn't have

- Rich text / Portable Text (blockContent) for long-form content — masonomara.com uses markdown, which covers most use cases
- Structured SEO fields per document — masonomara.com uses static metadata
- Service categories with references — masonomara.com uses flat `children` arrays (sufficient for most cases)
- Client relationship data — no equivalent needed in masonomara.com's simpler model

### Structural debt in omaratechnology

1. **Services page is hardcoded** — `ServicesSection.tsx` has all services as a JavaScript array in the component. Sanity's `service` and `category` types exist and queries exist, but the page doesn't use them. Either the services page should use Sanity data, or Sanity shouldn't define these types.

2. **`body` vs `deepDive` mismatch** — `serviceType.ts` stores content in `deepDive`, queries fetch `body`. Any service body content is silently missing.

3. **Orphaned schema types** — `clientType`, `employeeType`, `postType` are defined and elaborate but never registered in `index.ts`. They consume schema file space and create confusion.

4. **Game homepage** — The main homepage is a shooting game with Supabase integration. This is entirely disconnected from the CMS system. The Sanity infrastructure exists in parallel with a completely separate Supabase infrastructure.

5. **`SITEMAP_QUERY` defined but unused** — `sitemap.ts` builds its own raw GROQ strings instead of using the defined query.

---

## Summary

masonomara.com's JSON system is elegant in its constraints. One JSON file is the schema, the navigation, the sitemap generator, and the static params generator all at once. The `name` field is the only required property — everything else (images, href, children, hideTitle, static) is optional and additive. Slugs are computed, never stored. Pages are static by default. Images are served via a minimal API route with immutable caching.

The omaratechnology site has the opposite problem: it uses a full cloud CMS for what is effectively two content types (projects and services), while most content (the services page) is hardcoded in the component anyway, and the homepage doesn't touch the CMS at all.

The path to simplification is clear: adopt the nav.json pattern. One flat JSON file, auto-slugs, optional fields, file-system images. The result would be fewer moving parts, no API keys, no CMS subscriptions, fully offline development, and the ability to add or update content with a text editor.
