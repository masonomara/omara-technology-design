# Plan: Homepage Rewrite — O'Mara Technology

*Based on research-home.md, existing homepage game, About.tsx, and reference analysis of Scope Labs and Self Aware Studio.*

---

## Goals

1. Redesign the cover screen — replace the wordmark with "Bean Shooter" game branding built from game photo assets and Radio Grotesk type, add three clear navigation buttons
2. Tighten the About page — condense the ethos, move engagement types above capabilities
3. Keep the game intact — don't change any game logic, animations, or timing

---

## Voice Principles (apply to all copy)

- **First person** — "Mason O'Mara is" not "O'Mara Technology provides"
- **Specific beats general** — "Asbury Park, NJ" not "based in New Jersey"
- **Being one person is a feature** — direct access, nothing gets handed off to strangers
- **No superlatives** — no "transformative," "seamless," "innovative"
- **Let outcomes land on their own** — don't editorialize results

---

## Part 1: Extract the Game Component

### Why
The current `page.tsx` is a massive client component. Extracting the game into its own component makes `page.tsx` cleaner and easier to maintain, and keeps the game logic isolated.

### What
- Move all game state, hooks, handlers, and JSX into `src/app/components/Game.tsx`
- `Game.tsx` keeps `"use client"` and its own styles import
- `page.tsx` becomes a thin wrapper — renders `<Game />` inside `pageContainer`

---

## Part 2: Cover Redesign

### Current state
- O'Mara Technology wordmark SVG
- Description: "Strategy, design, and development for apps, websites, and software."
- Two buttons: "Start Game" and "Contact US" (incorrect capitalization)

### Proposed state
- **Game photo assets** — use existing game imagery (can SVGs, bang graphic, hand) as decorative visual elements in the cover box, reinforcing it as a real game
- **"BEAN SHOOTER"** — large Radio Grotesk italic condensed title (matching the game's score display style), styled as a game title not a wordmark
- **"by O'Mara Technology and Design"** — small uppercase Overpass label beneath the title
- **"a product studio"** — small, lower opacity, beneath the byline
- **Three buttons:** Start Game / About / View Work (stacked column)

### Game assets available to use
- `/canOne.svg`, `/canTwo.svg`, `/canThree.svg` — the enemy cans
- `/bang.svg` — the shot marker
- `/thumbsUp.svg` — the hand illustration
- These can be positioned decoratively around or within the cover box

### CSS changes needed
New classes in `index.module.css`:
- `.startGameTitle` — large Radio Grotesk italic, ~64px, uppercase
- `.startGameByline` — small Overpass uppercase, 11px, opacity 0.65
- `.startGameType` — small Overpass uppercase, 11px, opacity 0.5
- `.startCoverAsset` — for positioned game asset images (absolute, decorative, pointer-events none)
- Update `.startButtonWrapper` — flex-direction column (3 buttons stacked cleanly)
- Update `.startTopWrapper` — accommodate text + decorative assets layout

---

## Part 3: About Page — Tighten and Reorder

### Ethos copy (current → proposed)
Current:
> "Everything is changing faster than anyone can comfortably track. The tools, the platforms, the market — it shifts constantly. The only things that hold up are solutions built on timeless thinking and creativity that meets the moment. That's what O'Mara Technology is built around."

Proposed (tighter):
> "Everything changes faster than anyone can track. Tools, platforms, markets — constantly. What holds up is timeless thinking and creativity that meets the moment. That's what O'Mara Technology is built around."

### Section order (current → proposed)
Current order: Ethos → Identity → Capabilities Grid → Bio → How We Work

Proposed order: Ethos → Identity → **How We Work** → Capabilities Grid → Bio

Rationale: Engagement types qualify clients faster than the capabilities grid does. A first-time visitor needs to know whether you work monthly or by project before they need to know what tools you use.

---

## Implementation Order

1. ✅ **Extract Game component** — `src/app/components/Game.tsx`
2. ✅ **Cover redesign** — updated JSX in `Game.tsx`, added CSS to `index.module.css`
3. ✅ **About page** — reordered sections in `About.tsx` (How We Work now above capabilities grid)

---

## What NOT to Do

- Don't add a below-fold section — the game cover is the homepage, full stop
- Don't change any game animation timing, scoring logic, or enemy behavior (CLAUDE.md rule)
- Don't add testimonials or a stats strip anywhere on the homepage
- Don't change the video background or its overlays — Mason's presence behind the cover is working
- Don't over-engineer the cover asset placement — keep it lightweight and game-like, not decorative-for-its-own-sake
