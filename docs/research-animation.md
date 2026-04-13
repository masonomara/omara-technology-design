# Animation Research — O'Mara Technology

> **Purpose**: Deep audit of every animation on the site — what it does, how it's built, and an honest assessment of what works, what doesn't, and why. The goal is a site that feels contemporary, subtle, and smooth. This document is the foundation for any animation refactor.

---

## 1. Tech Stack

| Layer           | Tool                   | Version |
| --------------- | ---------------------- | ------- |
| Motion library  | Framer Motion          | 12.7.3  |
| CSS transitions | Custom CSS variables   | —       |
| CSS keyframes   | Vanilla `@keyframes`   | —       |
| Cursor          | Custom React component | —       |

No GSAP, no scroll-jacking, no WebGL. The animation system is entirely Framer Motion + CSS — clean foundation, but the configuration on top of it is where problems live.

---

## 2. The Central File: `src/app/lib/motion.ts`

Everything flows from here. It exports ~19 variant factory functions used across the whole site. Understanding this file is understanding the animation system.

### Full Inventory of Variants

| Export                                     | What It Does                                  | Key Values                                               |
| ------------------------------------------ | --------------------------------------------- | -------------------------------------------------------- |
| `navVariants`                              | Nav slides down from top                      | `y: -50 → 0`, spring (stiffness 80, 1s delay)            |
| `slideIn(dir, type, delay, dur)`           | Slides element from ±100% in given direction  | `x/y: ±100% → 0`, tween easeOut                          |
| `staggerContainer(stagger, delayChildren)` | Parent that staggers children                 | 0.2s stagger, 0.2s delayChildren                         |
| `textVariant(delay)`                       | Text slides up                                | `y: 50 → 0`, spring 1s                                   |
| `textContainer`                            | Text container with per-character stagger     | 0.01s staggerChildren                                    |
| `grow`                                     | Width 0 → 100%                                | —                                                        |
| `growDown`                                 | Height 0 → calc(100% - 24px)                  | Spring 1.6s, bounce 0, easing `[0.17, 0.67, 0.83, 0.67]` |
| `growDownSub`                              | Alias for `growDown`                          | Same                                                     |
| `growRight`                                | Width 0 → 50%                                 | Spring 0.8s, **1.6s delay**                              |
| `textVariant2`                             | `y: 20 → 0` + fade                            | Tween easeIn                                             |
| `fade(dir, type, delay, dur, opacity)`     | Opacity only, directional                     | `opacity: 0 → custom`                                    |
| `fadeIn(dir, type, delay, dur)`            | Fade + translate ±60 + scale 0.97 → 1         | Tween or spring, easing `[0.17, 0.67, 0.83, 0.67]`       |
| `ringGrow(delay, dur, opacity)`            | Scale 0.5 → 1 + fade, origin 100%             | —                                                        |
| `fadeInButton(dir, type, delay, dur)`      | Same as fadeIn but ±24 offset                 | Smaller, tighter                                         |
| `fadeInIcon`                               | Alias for `fadeInButton`                      | Same                                                     |
| `textFadeUp(dir, type, delay, dur)`        | `y: 100 → 0` + skewY 2° → 0 + scale 0.98 → 1  | The primary hero text animation                          |
| `textFadeUpSmall(delay, dur)`              | `y: 33 → 0` + scale 0.95 → 1                  | Compact version                                          |
| `planetVariants(dir)`                      | `x: ±100% + rotate 120° → 0`                  | Spring 1.8s, 0.5s delay                                  |
| `zoomIn(delay, dur)`                       | Scale 0 → 1 + fade                            | Tween easeOut                                            |
| `footerVariants`                           | Same as `navVariants` but `y: 50`, 0.5s delay | Spring stiffness 80                                      |

### What's Actually Used vs. Defined

Many variants are **defined but not used** — or used once speculatively. The site's active animation vocabulary is much smaller than the file suggests:

**Actively used:** `textFadeUp`, `textFadeUpSmall`, `fadeIn`, `fadeInButton`, `staggerContainer`

**Unused or near-unused:** `navVariants`, `slideIn`, `textVariant`, `textVariant2`, `textContainer`, `grow`, `growDown`, `growDownSub`, `growRight`, `fade`, `ringGrow`, `fadeInIcon`, `planetVariants`, `zoomIn`, `footerVariants`

This is a 19-variant library powering a ~5-variant site. Significant dead weight.

---

## 3. Component-by-Component Breakdown

### 3.1 `Footer.tsx`

**Animations:**

- Company title logo: `textFadeUpSmall` (0.1s delay, 0.8s duration)
- 5 nav links: `fadeInButton("up", spring)` staggered at 0.05s intervals (0s delay, 0.4s each)

**Trigger:** `whileInView`, `once: true`, `amount: 0–0.2`

**Notes:** The nav links animate in quickly (0.4s each, tight stagger) — this part works well. The logo at 0.8s feels slightly slow in context with the rest of the footer.

---

### 3.2 `page.tsx` (Home / Game Page)

**Framer Motion:**

- Start game container: `fadeIn("up", spring, 0.1s, 0.8s)` — slides up with opacity and subtle scale

**CSS Animations (index.module.css):**

| Element         | Initial State                     | Final State                     | Duration           | Delay              |
| --------------- | --------------------------------- | ------------------------------- | ------------------ | ------------------ |
| `.score`        | `translateY(calc(100% + 16px))`   | `translateY(0%)`                | 187ms cubic-bezier | 75ms               |
| `.cans`         | same                              | same                            | 250ms              | 187ms              |
| `.handWrapper`  | `translateY(100%) rotate(-30deg)` | `translateY(0%) rotate(0deg)`   | 225–300ms          | 300–400ms          |
| `.videoWrapper` | visible                           | `opacity: 0`, no pointer events | 400ms              | 400ms in / 0ms out |
| `.bangMarker`   | `scale(0)`                        | `scale(1.15) → scale(1)`        | 0.25s              | 0ms                |
| `.thumbsDown`   | `rotate(0)`                       | `rotate(0.5deg)`                | 150ms              | —                  |

**Notes:** The game-state CSS animations are actually well-tuned — tight durations, purposeful staging. The `bangAppear` keyframe (cubic-bezier with slight overshoot) gives the "pop" feeling that's appropriate for the game context.

---

### 3.3 `Service.tsx`

- `h1`: `textFadeUp("up", spring, 0s, 0.6s)`
- Body text: `textFadeUpSmall("up", spring, 0.1s, 0.8s)`
- Email section: `fadeInButton("up", spring, 0.3s, 1.2s)`

**Trigger:** `whileInView`, `once: true`

**Problem flag:** The `fadeInButton` email section has a **1.2s duration** — nearly a full second longer than the heading above it. There is no user benefit from this asymmetry. It creates a lag where the supporting element feels slow.

---

### 3.4 `Project.tsx`

Identical structure to `Service.tsx`:

- Title: `textFadeUp` (0.6s)
- Body: `textFadeUpSmall` (0.8s)
- Email: `fadeInButton` (1.2s)

Same duration asymmetry issue.

---

### 3.5 `contact/page.tsx`

- Title: `textFadeUp("up", spring, 0.1s, 0.6s)`
- Subtitle: `textFadeUpSmall("up", spring, 0.2s, 0.8s)`
- Form: `fadeInButton("up", spring, 0.4s, 1.2s)`

**Problem flag:** The contact form has a 0.4s delay before it begins animating, then takes 1.2s to complete. That's **1.6s from page load to form visible**. For a contact page, this actively delays the user's ability to interact with the primary purpose of the page.

---

### 3.6 `About.tsx`

- Title: `textFadeUp` (0.6s)
- Subtitle: `textFadeUpSmall` (0.8s)
- Card/image: `fadeIn("up", spring, 0.2s, 0.8s)`

Most consistent component. The `fadeIn` on the image card is appropriate — slightly offset from the text cascade.

---

### 3.7 `ServicesSection.tsx`

- Title: `textFadeUp` (0.6s)
- Subtitle: `textFadeUpSmall` (0.8s)
- 5 service items: `textFadeUpSmall` with `0.2 + (index × 0.1)s` delay, 0.8s each

**Notes:** The stagger range is 0.2s → 0.6s across 5 items. Last item starts 0.6s after scroll trigger and takes 0.8s — so the final item finishes 1.4s after the section enters the viewport. This is the "too slow" complaint in action. With 5 items staggered at 0.1s intervals and 0.8s duration each, the animation is dragged out.

---

### 3.8 `Marquee.tsx`

**Framer Motion:**

- 5 nav menu items: `fadeInButton("up", spring, index × 0.03s, 1.2s)` each

**CSS:**

- `.marquee`: `marquee` keyframe, 20s linear infinite (desktop), 40s (mobile)
- Animates `transform: translate3d(-50%, 0, 0)` — a continuous horizontal loop

**Problem flag:** Each menu item has a 1.2s entrance duration. For nav links, this reads as heavy. The stagger at 0.03s increments is fine, but the 1.2s per item oversells the importance of nav text.

**CSS marquee:** Works correctly. The 20s speed is reasonable for desktop. 40s on mobile is very slow — users will see it barely moving.

---

### 3.9 `ProjectsSection.tsx`

- Title: `textFadeUp` (0.6s)
- Project cards: `fadeInButton("up", spring, 0.2s, 1.2s)`

**Problem flag:** All project cards animate with identical delay (0.2s) and 1.2s duration. If multiple cards appear, they all animate simultaneously with no stagger — which looks like a bulk reveal, not a crafted entrance.

---

### 3.10 `CursorFollower.tsx`

A custom cursor circle that follows the mouse:

| State                        | Size        | Opacity    | Color                                  |
| ---------------------------- | ----------- | ---------- | -------------------------------------- |
| Default                      | 16px        | 0.25       | `rgba(137, 24, 16, 0.25)` — red-toned  |
| Hovering interactive element | 32px        | 0.6        | same                                   |
| Menu active                  | 16px / 32px | 0.25 / 0.6 | `rgba(252, 238, 222, opacity)` — cream |

**Transition:** 0.2s `cubic-bezier` on width/height/background-color

**Notes:** This is a subtle, contemporary touch. The color-shift on menu open is a nice contextual detail. The 0.2s transition on size change is slightly slow — cursor followers typically work best at 0.1–0.15s so they don't visibly lag behind the pointer. Currently the `transform: translate(-50%, -50%)` for centering is hardcoded as a style but the `left`/`top` position is set via JS — this is fine but means the cursor won't benefit from GPU compositing as naturally as if using `transform` for position tracking.

---

## 4. Cross-Cutting Issues

### 4.1 Duration Inflation

The most common problem across the site is **durations that are too long for what's being animated**. Here's a comparison:

| Context             | Current Duration | Industry Benchmark |
| ------------------- | ---------------- | ------------------ |
| Body text entrance  | 0.8s             | 0.4–0.5s           |
| Button/CTA entrance | 1.2s             | 0.4–0.6s           |
| Section heading     | 0.6s             | 0.4–0.5s           |
| Nav links           | 1.2s             | 0.3–0.4s           |
| Image/card entrance | 0.8s             | 0.5–0.6s           |

Long durations don't communicate quality — they communicate sluggishness. Contemporary UI motion keeps entrance animations in the 300–500ms range. Slow animations on text are especially noticeable because users want to read immediately.

### 4.2 The `once: true` / `amount: 0` Combination

Every `whileInView` uses `once: true, amount: 0`. This means:

- The animation fires the instant the top pixel of the element enters the viewport
- It never replays

`amount: 0` is an aggressive trigger — the element starts animating before the user has actually scrolled to it, which can cause elements to be mid-animation when the user's attention arrives. `amount: 0.15–0.25` would be more natural — triggering when the element is meaningfully in view.

### 4.3 Easing Inconsistency

The `[0.17, 0.67, 0.83, 0.67]` cubic-bezier is used throughout the motion.ts file. This is a non-standard ease — it has a slight "plateau" in the middle of the curve (the 0.83 x-value means it decelerates then slightly re-accelerates). This can create a subtle "stutter" perception, especially on slower devices. A cleaner ease like `[0.25, 0, 0, 1]` or `[0.4, 0, 0.2, 1]` (Material standard) would be smoother and more readable.

### 4.4 Spring Inconsistency

Some variants use springs, some use tweens, sometimes the calling code passes `"spring"` as the type parameter, sometimes not. The result is that the same `textFadeUpSmall` function can produce either a spring or tween animation depending on which component calls it. Without audit, it's unclear which is actually rendering where.

More critically: **springs and tweens at the same "duration" don't look the same**. A spring with `duration: 0.8s` will overshoot slightly; a tween with `duration: 0.8s` will stop exactly. Mixing them without intent creates visual inconsistency.

### 4.5 `skewY` on Text

`textFadeUp` adds `skewY: 2deg` on the hidden state that animates to 0. This is a very common "magazine-style" text reveal. However, at 0.6s duration with a spring, the skew correction can create a slight wobble if the spring has any bounce. This reads as jank on lower-end devices. Removing skewY entirely would make text entrances cleaner without sacrificing the reveal character.

### 4.6 Scale Animations on Text

Both `textFadeUp` (scale 0.98) and `textFadeUpSmall` (scale 0.95) include a subtle scale. For `textFadeUpSmall`, a 5% scale change on text can cause subpixel rendering artifacts — the text looks slightly blurry during animation then snaps to crisp on completion. Scale on images/cards is fine; scale on text should be minimized or set much closer to 1 (e.g., 0.99).

### 4.7 Stagger Timing

The stagger values across the site are inconsistent:

| Location                   | Stagger Interval | Items  |
| -------------------------- | ---------------- | ------ |
| `ServicesSection` items    | 0.1s             | 5      |
| `Footer` links      | 0.05s            | 5      |
| `Marquee` links            | 0.03s            | 5      |
| `staggerContainer` default | 0.2s             | varies |

0.2s stagger default in `staggerContainer` is the most common complaint trigger — 5 items × 0.2s = 1s just in stagger delay, before duration. For small item counts (3–6), 0.05–0.08s is more contemporary. Reserve 0.1–0.15s for large lists.

### 4.8 Dead Code in `motion.ts`

~14 of 19 variants appear unused or only used in legacy/future code. This creates maintenance confusion — future developers will reach for `slideIn` or `textVariant` thinking they're the site's vocabulary, when the real vocabulary is much simpler. The file should be pruned to only what's used.

### 4.9 Contact Form Delay

The contact form's `0.4s delay + 1.2s duration` means a user who navigates directly to `/contact` waits **1.6 seconds** before the form stops animating. This is the clearest UX harm in the system — it directly delays interaction with the page's primary purpose.

### 4.10 Mobile Marquee Speed

40s for the marquee on mobile is too slow. At that speed it reads as nearly static. 15–20s would be appropriate for mobile given smaller viewport width.

---

## 5. What Works Well

Not everything needs fixing. These parts are solid:

**Game animations (CSS):** Tight, purposeful, correctly staged. The `bangAppear` keyframe with its overshoot feels game-appropriate without being excessive.

**CursorFollower concept:** The contextual color-switch when menu is active is a thoughtful detail. This kind of state-aware animation is exactly what "contemporary" feels like.

**`textFadeUp` direction and scale:** The concept is right — a confident text reveal with a slight push from below. It just needs duration tightening, no skewY, and scale closer to 1.

**`fadeInButton` small offset (±24):** Using a smaller offset for UI elements vs. content (±60) shows intentionality. This thinking is correct, just the durations are too long.

**`whileInView` with `once: true`:** The correct approach. Animations that replay on scroll-back are annoying. `once: true` is the right call everywhere.

**CSS transition variables (`--transition-smooth-*`):** Having 100ms/200ms/300ms variants is clean infrastructure. The cubic-bezier used (`0.33, 0, 0.66, 1`) is a good snappy ease for interactive elements.

---

## 6. Root Cause Summary

The animation problems largely come from one source: **a large variant library built for exploration, applied to a more minimal site, with durations never tuned for actual content**.

The animations were probably created in a phase where the priority was "does it animate" — the skewY, long durations, and many unused variants suggest a toolkit that wasn't pruned after the site's design voice settled. The result is a site where the animation system is more ambitious than the design needs, making everything feel performative rather than refined.

The user complaints — "janky," "too slow," "performative" — map directly to:

- "Janky" → `skewY`, scale on text, spring inconsistency, `[0.17, 0.67, 0.83, 0.67]` easing
- "Too slow" → 0.8–1.2s durations on text and buttons, 0.1–0.2s stagger intervals
- "Performative" → too many variants doing similar things, long durations, `amount: 0` making animations visible mid-scroll

---

## 7. Recommended Direction (Summary for Implementation)

1. **Reduce all text/content durations** to 0.3–0.5s range
2. **Cap button/UI entrance durations** at 0.4–0.6s
3. **Remove `skewY`** from `textFadeUp`
4. **Change scale on text** from 0.95–0.98 → 0.995–0.998 (near-invisible but still GPU-composited)
5. **Replace `[0.17, 0.67, 0.83, 0.67]`** with `[0.25, 0, 0, 1]` or `cubic-bezier(0.4, 0, 0.2, 1)`
6. **Reduce stagger** to 0.04–0.07s between items
7. **Increase `amount`** on `whileInView` to 0.15–0.2 for more intentional scroll triggering
8. **Remove delay on contact form** — reduce to 0.1s max
9. **Prune `motion.ts`** to only the variants actually in use
10. **Speed up mobile marquee** to 15–20s
11. **Shorten cursor transition** from 0.2s to 0.1–0.12s for less lag
12. **Standardize on one animation type** per role: tween for content entrance, no springs for text

---

## 8. File Reference Map

| File                                     | Role                                                      |
| ---------------------------------------- | --------------------------------------------------------- |
| `src/app/lib/motion.ts`                  | All variant definitions — the primary refactor target     |
| `src/app/globals.css`                    | Marquee keyframe, CSS transition variables, cursor styles |
| `src/app/styles/index.module.css`        | Game animations (score, hand, bang)                       |
| `src/app/components/CursorFollower.tsx`  | Custom cursor logic                                       |
| `src/app/components/Footer.tsx`   | Footer link stagger                                       |
| `src/app/components/ServicesSection.tsx` | Services stagger                                          |
| `src/app/components/ProjectsSection.tsx` | Projects card entrance                                    |
| `src/app/components/Marquee.tsx`         | Nav links entrance                                        |
| `src/app/components/About.tsx`           | About section                                             |
| `src/app/components/Service.tsx`         | Service detail                                            |
| `src/app/components/Project.tsx`         | Project detail                                            |
| `src/app/(frontend)/contact/page.tsx`    | Contact page (highest urgency — form delay)               |
| `src/app/(frontend)/page.tsx`            | Home / game page                                          |
