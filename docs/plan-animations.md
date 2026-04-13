# Animation Refactor Plan — O'Mara Technology

> **Philosophy**: Delete first, then tune. Don't patch a bloated system — shrink it to what's actually used, then make those pieces excellent. Every change should make `motion.ts` shorter or a duration faster.

---

## The 3-Step Sequence

```
Step 1 → Prune motion.ts        (delete 14 unused variants)
Step 2 → Rewrite 5 core variants (fix easing, scale, skewY, durations)
Step 3 → Fix call sites          (update delays, amounts, CSS)
```

Work in this order. Steps 2 and 3 on a bloated file = wasted effort.

---

## Step 1 — Prune `src/app/lib/motion.ts`

**Delete entirely** (unused or aliased dead code):

| Export to delete | Reason                                                               |
| ---------------- | -------------------------------------------------------------------- |
| `navVariants`    | Not used                                                             |
| `slideIn`        | Not used                                                             |
| `textVariant`    | Not used                                                             |
| `textContainer`  | Not used                                                             |
| `grow`           | Not used                                                             |
| `growDown`       | Not used                                                             |
| `growDownSub`    | Alias of deleted `growDown`                                          |
| `growRight`      | Not used                                                             |
| `textVariant2`   | Not used                                                             |
| `fade`           | Not used                                                             |
| `ringGrow`       | Not used                                                             |
| `fadeInIcon`     | Alias of `fadeInButton` — callers should use `fadeInButton` directly |
| `planetVariants` | Not used                                                             |
| `zoomIn`         | Not used                                                             |
| `footerVariants` | Not used                                                             |

**Keep** (actively used):

- `staggerContainer`
- `textFadeUp`
- `textFadeUpSmall`
- `fadeIn`
- `fadeInButton`

**Result**: `motion.ts` goes from ~367 lines to ~80 lines.

---

## Step 2 — Rewrite the 5 Core Variants

### Shared constants (define once at top of file)

```ts
// One easing curve for the whole site — clean deceleration
const EASE = [0.25, 0.1, 0.25, 1] as const;
```

> **Why this easing?** `[0.25, 0.1, 0.25, 1]` is CSS `ease` — universally readable, smooth deceleration, no mid-curve plateau. Replaces the current `[0.17, 0.67, 0.83, 0.67]` which has a subtle stutter on slower devices.

---

### `staggerContainer` — simplify signature

**Current:** `staggerContainer(stagger = 0.2, delayChildren = 0.2)`
**New:** `staggerContainer(stagger = 0.05, delayChildren = 0)`

- Default stagger drops from 0.2s → 0.05s
- delayChildren removed from default (callers control delay via their own variants)

---

### `textFadeUp` — primary heading animation

**Remove:** `skewY`, `x: 0` (redundant), `originY`
**Change:** y offset 100 → 24, scale 0.98 → 1, easing updated

```ts
// Before: y:100, skewY:2, scale:0.98, ease:[0.17,0.67,0.83,0.67]
// After:  y:24,  no skew,  scale:1,   ease:[0.25,0.1,0.25,1]
```

Callers pass `delay` and `duration`. New recommended call values:

- `delay: 0`, `duration: 0.45`

---

### `textFadeUpSmall` — body text animation

**Remove:** `x: 0` (redundant), `originY`, reduce scale
**Change:** y offset 33 → 16, scale 0.95 → 1, easing updated

```ts
// Before: y:33, scale:0.95, ease:[0.17,0.67,0.83,0.67]
// After:  y:16, scale:1,    ease:[0.25,0.1,0.25,1]
```

Recommended call values: `delay: 0.08`, `duration: 0.4`

> **Why remove scale from text?** Scale on text causes subpixel rendering blur mid-animation — text looks soft then snaps sharp. Opacity + Y translation alone reads more cleanly.

---

### `fadeIn` — image/card entrance

**Change:** offset ±60 → ±20, scale 0.97 → 0.98, easing updated, type fixed to `"tween"`

```ts
// Before: offset ±60, scale 0.97, mixed spring/tween
// After:  offset ±20, scale 0.98, always tween
```

Recommended call values: `delay: 0.1`, `duration: 0.5`

> Cards and images benefit from a subtle scale (0.98) because it adds depth without blurring text.

---

### `fadeInButton` — UI elements, nav links, CTAs

**Change:** offset ±24 → ±12, scale 0.98 → 1, easing updated, type fixed to `"tween"`

```ts
// Before: offset ±24, scale 0.98, duration often 1.2s
// After:  offset ±12, scale 1,    duration 0.35s
```

Recommended call values: `delay: 0`, `duration: 0.35`

---

## Step 3 — Fix Call Sites

### 3a. Duration + Delay corrections per component

| Component             | Element                      | Old dur | New dur | Old delay   | New delay     |
| --------------------- | ---------------------------- | ------- | ------- | ----------- | ------------- |
| `Service.tsx`         | h1 (`textFadeUp`)            | 0.6s    | 0.45s   | 0s          | 0s            |
| `Service.tsx`         | body (`textFadeUpSmall`)     | 0.8s    | 0.4s    | 0.1s        | 0.08s         |
| `Service.tsx`         | email (`fadeInButton`)       | 1.2s    | 0.35s   | 0.3s        | 0.18s         |
| `Project.tsx`         | h1 (`textFadeUp`)            | 0.6s    | 0.45s   | 0s          | 0s            |
| `Project.tsx`         | body (`textFadeUpSmall`)     | 0.8s    | 0.4s    | 0.1s        | 0.08s         |
| `Project.tsx`         | email (`fadeInButton`)       | 1.2s    | 0.35s   | 0.3s        | 0.18s         |
| `About.tsx`           | title (`textFadeUp`)         | 0.6s    | 0.45s   | 0s          | 0s            |
| `About.tsx`           | subtitle (`textFadeUpSmall`) | 0.8s    | 0.4s    | 0.1s        | 0.08s         |
| `About.tsx`           | card (`fadeIn`)              | 0.8s    | 0.5s    | 0.2s        | 0.14s         |
| `ServicesSection.tsx` | title (`textFadeUp`)         | 0.6s    | 0.45s   | 0s          | 0s            |
| `ServicesSection.tsx` | subtitle (`textFadeUpSmall`) | 0.8s    | 0.4s    | 0.1s        | 0.08s         |
| `ServicesSection.tsx` | items ×5 (`textFadeUpSmall`) | 0.8s    | 0.4s    | 0.2+(i×0.1) | 0.08+(i×0.05) |
| `ProjectsSection.tsx` | title (`textFadeUp`)         | 0.6s    | 0.45s   | 0s          | 0s            |
| `ProjectsSection.tsx` | cards (`fadeInButton`)       | 1.2s    | 0.35s   | 0.2s        | 0.1s          |
| `contact/page.tsx`    | title (`textFadeUp`)         | 0.6s    | 0.45s   | 0.1s        | 0s            |
| `contact/page.tsx`    | subtitle (`textFadeUpSmall`) | 0.8s    | 0.4s    | 0.2s        | 0.08s         |
| `contact/page.tsx`    | form (`fadeInButton`)        | 1.2s    | 0.35s   | **0.4s**    | **0.12s**     |
| `Marquee.tsx`         | nav links (`fadeInButton`)   | 1.2s    | 0.35s   | i×0.03s     | i×0.03s       |
| `Footer.tsx`   | logo (`textFadeUpSmall`)     | 0.8s    | 0.4s    | 0.1s        | 0.06s         |
| `Footer.tsx`   | links (`fadeInButton`)       | 0.4s    | 0.35s   | i×0.05s     | i×0.04s       |
| `page.tsx` (home)     | game container (`fadeIn`)    | 0.8s    | 0.5s    | 0.1s        | 0.05s         |

---

### 3b. Fix `whileInView` `amount` values

All components currently use `amount: 0` — fires the moment 1px enters the viewport, often mid-scroll.

**Change all to:** `amount: 0.15`

This means the animation fires when 15% of the element is visible — the user's eye has actually arrived.

**Files to update:**

- `Service.tsx`, `Project.tsx`, `About.tsx`, `ServicesSection.tsx`
- `ProjectsSection.tsx`, `contact/page.tsx`, `Marquee.tsx`, `Footer.tsx`

---

### 3c. CSS fixes

**`globals.css` — Marquee mobile speed**

```css
/* Before */
@media (max-width: 768px) {
  .marquee {
    animation-duration: 40s;
  }
}

/* After */
@media (max-width: 768px) {
  .marquee {
    animation-duration: 18s;
  }
}
```

**`CursorFollower.tsx` — Cursor lag**

```ts
// Before: transition: "width 0.2s cubic-bezier(...), height 0.2s..."
// After:  transition: "width 0.1s cubic-bezier(...), height 0.1s..."
```

Drop from 0.2s → 0.1s so the cursor ring tracks the pointer tightly instead of visibly trailing.

---

## Execution Checklist

- [x] **Step 1**: Delete 14 unused variants from `motion.ts`
- [x] **Step 2a**: Add `EASE` constant, rewrite `staggerContainer`
- [x] **Step 2b**: Rewrite `textFadeUp` (remove skewY, reduce y, remove scale)
- [x] **Step 2c**: Rewrite `textFadeUpSmall` (reduce y and scale, new easing)
- [x] **Step 2d**: Rewrite `fadeIn` (reduce offset, fix type to tween)
- [x] **Step 2e**: Rewrite `fadeInButton` (reduce offset, remove scale, fix type)
- [x] **Step 3a**: Update durations/delays in all 8 components (table above)
- [x] **Step 3b**: Update `amount: 0` → `amount: 0.15` in all `whileInView` viewports
- [x] **Step 3c**: Fix mobile marquee from 40s → 18s
- [x] **Step 3d**: Fix cursor transition from 0.2s → 0.1s

---

## What We Are NOT Changing

- Game CSS animations (`index.module.css`) — already well-tuned
- CSS `--transition-smooth-*` variables — correct as-is
- The `whileInView + once: true` pattern — right call everywhere
- Hover transitions on links/buttons — 100ms is correct
- `bangAppear` keyframe — game context, appropriate overshoot

---

## Detailed Todo List

### Phase 1 — Prune `motion.ts`

> File: `src/app/lib/motion.ts`

- [x] 1.1 Delete `navVariants` export and its block
- [x] 1.2 Delete `slideIn` export and its block
- [x] 1.3 Delete `textVariant` export and its block
- [x] 1.4 Delete `textContainer` export and its block
- [x] 1.5 Delete `grow` export and its block
- [x] 1.6 Delete `growDown` export and its block
- [x] 1.7 Delete `growDownSub` export (alias line)
- [x] 1.8 Delete `growRight` export and its block
- [x] 1.9 Delete `textVariant2` export and its block
- [x] 1.10 Delete `fade` export and its block
- [x] 1.11 Delete `ringGrow` export and its block
- [x] 1.12 Delete `fadeInIcon` export (alias line)
- [x] 1.13 Delete `planetVariants` export and its block
- [x] 1.14 Delete `zoomIn` export and its block
- [x] 1.15 Delete `footerVariants` export and its block
- [x] 1.16 Delete the `AnimationType` type — removed as part of Phase 2 signature rewrites
- [x] 1.17 Verify file compiles with no TS errors after deletions

---

### Phase 2 — Rewrite Core Variants

> File: `src/app/lib/motion.ts`

- [x] 2.1 Add shared `EASE` constant at top of file: `const EASE = [0.25, 0.1, 0.25, 1] as const`
- [x] 2.2 Rewrite `staggerContainer` — change default `staggerChildren` from `0.2` to `0.05`, remove `delayChildren` default (set to `0`)
- [x] 2.3 Rewrite `textFadeUp`:
  - [x] Remove `skewY: 2` from hidden state
  - [x] Remove `skewY: 0` from show state
  - [x] Remove `scale` from both states
  - [x] Remove `x: 0` (redundant)
  - [x] Remove `originY: "100%"`
  - [x] Change `y` offset: `100` → `24`
  - [x] Replace `ease: [0.17, 0.67, 0.83, 0.67]` with `ease: EASE`
  - [x] Remove unused `_direction` parameter (and `type` — standardized to tween)
- [x] 2.4 Rewrite `textFadeUpSmall`:
  - [x] Remove `scale` from both states
  - [x] Remove `x: 0` (redundant)
  - [x] Remove `originY: "100%"`
  - [x] Change `y` offset: `33` → `16`
  - [x] Replace `ease: [0.17, 0.67, 0.83, 0.67]` with `ease: EASE`
  - [x] Remove unused `_direction` parameter (and `type` — standardized to tween)
- [x] 2.5 Rewrite `fadeIn`:
  - [x] Change offset: `±60` → `±20`
  - [x] Change scale: `0.97` → `0.98`
  - [x] Remove `type` parameter — hardcode `type: "tween"` internally
  - [x] Replace `ease: [0.17, 0.67, 0.83, 0.67]` with `ease: EASE`
  - [x] Remove `bounce: 0` (not applicable to tween)
  - [x] Update function signature accordingly
- [x] 2.6 Rewrite `fadeInButton`:
  - [x] Change offset: `±24` → `±12`
  - [x] Remove `scale` from both states
  - [x] Remove `type` parameter — hardcode `type: "tween"` internally
  - [x] Replace `ease: [0.17, 0.67, 0.83, 0.67]` with `ease: EASE`
  - [x] Remove `bounce: 0` (not applicable to tween)
  - [x] Update function signature accordingly
- [x] 2.7 Verify file compiles cleanly — no TS errors, no unused imports

---

### Phase 3 — Fix Call Sites

#### 3A — `src/app/components/Service.tsx`

- [x] 3A.1 `textFadeUp`: update duration `0.6` → `0.45`
- [x] 3A.2 `textFadeUpSmall`: update duration `0.8` → `0.4`, delay `0.1` → `0.08`
- [x] 3A.3 `fadeInButton`: update duration `1.2` → `0.35`, delay `0.3` → `0.18`
- [x] 3A.4 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3A.5 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3B — `src/app/components/Project.tsx`

- [x] 3B.1 `textFadeUp`: update duration `0.6` → `0.45`
- [x] 3B.2 `textFadeUpSmall`: update duration `0.8` → `0.4`, delay `0.1` → `0.08`
- [x] 3B.3 `fadeInButton`: update duration `1.2` → `0.35`, delay `0.3` → `0.18`
- [x] 3B.4 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3B.5 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3C — `src/app/components/About.tsx`

- [x] 3C.1 `textFadeUp`: update duration `0.6` → `0.45`
- [x] 3C.2 `textFadeUpSmall`: update duration `0.8` → `0.4`, delay `0.1` → `0.08`
- [x] 3C.3 `fadeIn`: update duration `0.8` → `0.5`, delay `0.2` → `0.14`
- [x] 3C.4 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3C.5 Remove unused `type` argument from `fadeIn` call — done in Phase 2

#### 3D — `src/app/components/ServicesSection.tsx`

- [x] 3D.1 `textFadeUp`: update duration `0.6` → `0.45`
- [x] 3D.2 `textFadeUpSmall` (subtitle): update duration `0.8` → `0.4`, delay `0.1` → `0.08`
- [x] 3D.3 `textFadeUpSmall` (staggered items ×5): update duration `0.8` → `0.4`, delay formula `0.2 + (i × 0.1)` → `0.08 + (i × 0.05)`
- [x] 3D.4 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`

#### 3E — `src/app/components/ProjectsSection.tsx`

- [x] 3E.1 `textFadeUp`: update duration `0.6` → `0.45`
- [x] 3E.2 `fadeInButton` (cards): update duration `1.2` → `0.35`, delay `0.2` → `0.1`
- [x] 3E.3 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3E.4 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3F — `src/app/(frontend)/contact/page.tsx`

- [x] 3F.1 `textFadeUp`: update duration `0.6` → `0.45`, delay `0.1` → `0`
- [x] 3F.2 `textFadeUpSmall`: update duration `0.8` → `0.4`, delay `0.2` → `0.08`
- [x] 3F.3 `fadeInButton` (form): update duration `1.2` → `0.35`, delay `0.4` → `0.12`
- [x] 3F.4 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3F.5 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3G — `src/app/components/Marquee.tsx`

- [x] 3G.1 `fadeInButton` (nav links): update duration `1.2` → `0.35` (keep stagger delay `i × 0.03` unchanged)
- [x] 3G.2 Update all `whileInView` viewports: `amount: 0` → `amount: 0.15`
- [x] 3G.3 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3H — `src/app/components/Footer.tsx`

- [x] 3H.1 `textFadeUpSmall` (logo): update duration `0.8` → `0.4`, delay `0.1` → `0.06`
- [x] 3H.2 `fadeInButton` (links): update duration `0.4` → `0.35`, stagger `staggerChildren: 0.05` → `0.04`
- [x] 3H.3 Update all `whileInView` viewports: `amount: 0/0.2` → `amount: 0.15`
- [x] 3H.4 Remove unused `type` argument from `fadeInButton` call — done in Phase 2

#### 3I — `src/app/(frontend)/page.tsx`

- [x] 3I.1 `fadeIn` (game container): update duration `0.8` → `0.5`, delay `0.1` → `0.05`
- [x] 3I.2 Remove unused `type` argument from `fadeIn` call — done in Phase 2

---

### Phase 4 — CSS Fixes

#### 4A — `src/app/globals.css`

- [x] 4A.1 Find the mobile media query for `.marquee` (or the equivalent marquee class)
- [x] 4A.2 Change `animation: marquee 40s` → `animation: marquee 18s` (also updated `.cursorFollower` width/height transitions from `0.2s` → `0.1s` in same file)

#### 4B — `src/app/components/CursorFollower.tsx`

- [x] 4B.1 Find the inline style string setting `width`/`height`/`background-color` transitions
- [x] 4B.2 Change all transition durations in that string from `0.2s` → `0.1s`

---

### Phase 5 — Verify

- [ ] 5.1 Run `npm run build` (or `next build`) — confirm zero TS/compile errors
- [ ] 5.2 Run dev server and scroll through every section — confirm all entrance animations fire correctly
- [ ] 5.3 Check contact page — form should be fully visible within ~0.47s of page load
- [ ] 5.4 Check ServicesSection — all 5 items should finish animating within ~0.5s of trigger
- [ ] 5.5 Check cursor — ring should track pointer tightly with no visible lag
- [ ] 5.6 Check mobile (or narrow viewport) — marquee should scroll at a visible pace
- [ ] 5.7 Confirm no regressions in game page animations (score, hand, bang)
