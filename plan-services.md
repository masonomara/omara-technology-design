# Services Page Implementation Plan

**O'Mara Technology — April 2026**

---

## Context & Goal

The current services page is technically accurate but functionally inert — a list of capabilities with no voice, no engagement model explained, no reason to keep reading. The goal of this rewrite is to build a page that:

1. Communicates the O'Mara ethos: constant change requires timeless solutions and creativity
2. Lets visitors self-select into the right engagement type (one-time project vs. ongoing partnership)
3. Explains the actual process in O'Mara's voice — not a diagram, not a slide deck
4. Is transparent about pricing so the right people can self-qualify
5. Reads like a real person wrote it — not a pitch deck, not a consultant brochure

---

## Principles for This Page

- **Let visitors choose their path.** Self Aware's tab model is the right move: someone looking for a one-time build and someone looking for a long-term partner want different information. Don't make them read both.
- **Show the process.** The current page lists what you get. The rewrite shows what it's like to work together.
- **Use "we."** Personal, direct, not corporate. Not "O'Mara Technology will..." — just "We start by listening."
- **Be transparent about pricing.** Ranges, not formulas. No hourly rate on the page. $4k–$60k for projects, $5k–$10k/month for partnerships.
- **Don't inflate.** A small focused team is a feature. Don't perform size you don't have.
- **Rebuilds are fine. Maintenance isn't.** Project engagements are for new products and new builds — not bug tickets, not hotfixes, not "can you just tweak this."

---

## What Changes

### Interaction Model

The engagement sections become an **interactive toggle** — two clickable options at the top of the section. Click "One-time Project" and you see that path's description, what's included, and its sample timeline. Click "Partnership" and the content swaps to the partnership path. Both are always accessible, never hidden permanently.

This is the Self Aware model. Simple, clean, respects the reader's time.

### Data Structure

Create **`content/services.json`** — richer structure that supports two engagement paths with categories, items, and timeline milestones.

Move the services data out of `nav.json` entirely. Add `getServicesData()` to `src/lib/content.ts`.

### Component

**`src/app/components/ServicesSection.tsx`** — full rewrite.

`"use client"` (already is, uses framer-motion). Add `useState` for the active tab.

New renders: intro → toggle → active engagement content → how it works → pricing

### Styles

**`src/app/styles/services.module.css`** — additions for new sections. Existing border/box patterns can be reused.

### Page

**`src/app/(frontend)/services/page.tsx`** — update metadata description only.

---

## New Data Structure: `content/services.json`

```json
{
  "engagements": [
    {
      "id": "project",
      "label": "One-time Project",
      "description": "For new products and new builds. We take it from idea through design, development, and launch. At the end, we hand it off — documented, trained, yours to run. The scope is defined before we start and payments land at monthly milestones along the way.",
      "note": "Project engagements are for new builds — not maintenance, bug fixes, or minor updates to existing products.",
      "categories": [
        {
          "name": "Design",
          "items": [
            "Wireframing",
            "Interface Design",
            "Accessible Design",
            "Responsive Design",
            "Design Systems",
            "Prototyping",
            "Technical Writing",
            "Content Strategy",
            "CMS Architecture"
          ]
        },
        {
          "name": "Development",
          "items": [
            "React & Next.js Development",
            "React Native Mobile Apps",
            "PostgreSQL & Supabase",
            "Cloudflare Workers & Durable Objects",
            "Stripe Integration",
            "Real-time Chat & Notifications",
            "Headless CMS Implementation",
            "PostHog Analytics Setup",
            "Vercel Deployment",
            "MCP Server Development"
          ]
        }
      ],
      "timeline": {
        "phases": [
          {
            "name": "Discovery",
            "duration": "1–2 weeks",
            "milestones": [
              "Intro call",
              "Discovery & scoping sessions",
              "User research & competitor audit",
              "Information architecture"
            ]
          },
          {
            "name": "Design",
            "duration": "2–6 weeks",
            "milestones": [
              "Wireframes",
              "Interface design",
              "Design review",
              "Revisions"
            ]
          },
          {
            "name": "Development",
            "duration": "4–12 weeks",
            "milestones": [
              "Build",
              "Content population",
              "Internal QA",
              "Client QA"
            ]
          },
          {
            "name": "Launch",
            "duration": "1–2 weeks",
            "milestones": ["Final testing", "Deployment", "Handoff & training"]
          }
        ],
        "outcome": "A shipped product and the keys to run it."
      }
    },
    {
      "id": "partnership",
      "label": "Partnership",
      "description": "For products in motion or in formation. Monthly engagements where we work alongside you — research, architecture, design direction, prioritization, and iteration as the product develops. Launch isn't the end here, it's the beginning of the loop.",
      "note": "Also available through trusted partners: content creation, graphic design, Shopify storefronts, marketing sites, workflow automations, SEO.",
      "categories": [
        {
          "name": "Product Design Strategy",
          "items": [
            "Discovery & Scoping",
            "User Research & Interviews",
            "Competitor Audits",
            "Market Positioning",
            "Information Architecture",
            "Product Roadmaps",
            "Feature Prioritization",
            "Algorithm Design",
            "Gamification Strategy",
            "Onboarding Planning"
          ]
        },
        {
          "name": "Technical Development Strategy",
          "items": [
            "System Architecture",
            "Database Design",
            "API Design",
            "Authentication & Row Level Security",
            "Real-time Infrastructure",
            "AI & RAG Architecture",
            "MCP Server Design",
            "Payment System Planning",
            "Analytics Strategy",
            "Deployment & DevOps Planning"
          ]
        }
      ],
      "timeline": {
        "phases": [
          {
            "name": "Discovery",
            "duration": "1–2 weeks",
            "milestones": [
              "Intro call",
              "Discovery sessions",
              "Research & audit",
              "Roadmap alignment"
            ]
          },
          {
            "name": "Monthly",
            "duration": "Ongoing",
            "milestones": [
              "Strategy sessions",
              "Design direction",
              "Feature prioritization",
              "Development",
              "Review & iteration"
            ]
          }
        ],
        "outcome": "A product that keeps getting better."
      }
    }
  ]
}
```

Update `src/lib/content.ts`:

```ts
import servicesRaw from "../../content/services.json";

export function getServicesData() {
  return servicesRaw;
}
```

---

## Page Structure & Copy — Section by Section

```
[Title: SERVICES]
[Intro]
[Toggle: "One-time Project" | "Partnership"]
  → Description
  → What's included (categories + items)
  → Sample timeline
  → Note (partners / scope caveat)
[How It Works]
[Pricing]
[FooterContact]
```

---

### Section 1 — Title + Intro

**Title:** `SERVICES` (existing `.title` style, no change)

**Intro copy:**

```
Everything changes fast. What holds up is better thinking at the start — products designed around a real problem, for a real person, with a clear reason to exist.

We take on two kinds of engagements: one-time projects and ongoing partnerships. Both start the same way.
```

Short. The second line sets up the toggle naturally. "Both start the same way" creates a thread to pull on — answered in How It Works.

---

### Section 2 — Toggle + Engagement Content

**Toggle buttons:** `One-time Project` | `Partnership`

Active state: underline or filled treatment matching the site's existing interactive styles. Inactive: muted.

---

**One-time Project — description:**

```
For new products and new builds. We take it from idea through design, development, and launch. At the end, we hand it off — documented, trained, yours to run.

The scope is defined before we start. Payments at monthly milestones.
```

**One-time Project — categories:** Design + Development (items as comma list, current border/box style)

**One-time Project — sample timeline:**

Rendered as a phase table. Four phases, each with name, duration, and milestone list.

| Phase       | Duration   | Milestones                                                                            |
| ----------- | ---------- | ------------------------------------------------------------------------------------- |
| Discovery   | 1–2 weeks  | Intro call, discovery sessions, research & competitor audit, information architecture |
| Design      | 2–6 weeks  | Wireframes, interface design, design review, revisions                                |
| Development | 4–12 weeks | Build, content population, internal QA, client QA                                     |
| Launch      | 1–2 weeks  | Final testing, deployment, handoff & training                                         |

**Outcome line:** "A shipped product and the keys to run it."

**Total range note** (below timeline): `8–22 weeks end to end`

---

**Partnership — description:**

```
For products in motion or in formation. Monthly engagements where we work alongside you — research, architecture, design direction, prioritization, and iteration as the product develops.

Launch isn't the end here. It's the beginning of the loop.
```

**Partnership — categories:** Product Design Strategy + Technical Development Strategy (items as comma list)

**Partnership — sample timeline:**

| Phase     | Duration  | Milestones                                                                                   |
| --------- | --------- | -------------------------------------------------------------------------------------------- |
| Discovery | 1–2 weeks | Intro call, discovery sessions, research & audit, roadmap alignment                          |
| Monthly   | Ongoing   | Strategy sessions, design direction, feature prioritization, development, review & iteration |

**Outcome line:** "A product that keeps getting better."

**Partners note** (below timeline, muted): `Content creation, graphic design, Shopify storefronts, marketing sites, workflow automations, and SEO available through trusted partners.`

---

### Section 3 — How It Works

**Heading:** `How It Works`

This section is always visible — not tab-gated. It's the universal process. Voice: "we." Prose, not bullets. The last paragraph splits to distinguish how the two paths end.

**Copy:**

```
We start by listening. Every engagement — whether it runs three months or three years — begins the same way: a 20-minute call to see if it's worth a conversation, then a paid discovery phase where we ask the questions that actually matter.

Every product goes through the same loop. An idea, then discovery, then design, then build — then back around. The job is understanding where you are in the loop and what it needs next.

Discovery is where most ideas stop — and should. This is where we find out what we actually don't know: who the real user is, what the actual problem is, whether someone's already solved it better. We put the idea in front of as many people as possible. We listen to how they describe their own problem, not just what they say about the solution. We research competitors — what did they do well, what can we learn from, where did they fail? We document what we learn and what we still don't understand. Both come back around.

Design is when the idea crystallizes. Defining who we're building for. Communicating it clearly to everyone who needs to build it with us. These are real decisions made for real reasons, not templates filled in.

Build is where the code gets written. AI is making this faster — cycles that used to take months are contracting. The implication isn't that development matters less. It's that everything before development has more leverage than it used to. Better discovery, better design, tighter iteration — these compound. The loop gets smaller and faster, which means the thinking at the start of each loop matters more.

For a one-time project, launch is a handoff. We ship it, document it, train your team on it, and you own it from there.

For a partnership, launch is the beginning. The loop keeps going — smaller and faster each time.
```

Style: prose block, no bullets, line-height slightly looser than 130% (145% suggested). Let it breathe.

---

### Section 4 — Pricing

**Heading:** `Pricing`

**Copy:**

```
A 20-minute intro call is free. After that, nothing is.

The first phase — discovery and planning — is required before any engagement starts. It's where we figure out what we're building, what it needs, and whether we're the right fit to build it together. No commitment beyond this phase is required to continue.

One-time projects typically range from $4,000 to $60,000 depending on scope and complexity.

Ongoing partnerships run $5,000–$10,000 per month.

Both engagement types include design and development. Creative design stays with us. Architecture and development are handled by us or by collaborators we trust, depending on scope.
```

No hourly rate. The discovery note explains the start-point without giving a formula. The ranges let clients self-qualify without a call to get the number.

---

## Component Rewrite: `ServicesSection.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { textFadeUp, textFadeUpSmall } from "../lib/motion";
import styles from "../styles/services.module.css";

type Milestone = { name: string; duration: string; milestones: string[] };
type Category = { name: string; items: string[] };
type Engagement = {
  id: string;
  label: string;
  description: string;
  note: string;
  categories: Category[];
  timeline: {
    phases: Milestone[];
    outcome: string;
  };
};

interface ServicesSectionProps {
  data: { engagements: Engagement[] };
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [active, setActive] = useState<string>(data.engagements[0].id);
  const current = data.engagements.find((e) => e.id === active)!;

  return (
    <>
      {/* Title */}
      <motion.h1
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="title"
      >
        SERVICES
      </motion.h1>

      {/* Intro */}
      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <p className={styles.intro}>
          Everything changes fast. What holds up is better thinking at the start
          — products designed around a real problem, for a real person, with a
          clear reason to exist.
        </p>
        <p className={styles.introMeta}>
          We take on two kinds of engagements: one-time projects and ongoing
          partnerships. Both start the same way.
        </p>
      </motion.div>

      {/* Toggle */}
      <motion.div
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={styles.toggle}
      >
        {data.engagements.map((e) => (
          <button
            key={e.id}
            className={`${styles.toggleButton} ${active === e.id ? styles.toggleActive : ""}`}
            onClick={() => setActive(e.id)}
          >
            {e.label}
          </button>
        ))}
      </motion.div>

      {/* Active Engagement Content */}
      <motion.div
        key={active}
        variants={textFadeUpSmall(0, 0.35)}
        initial="hidden"
        animate="show"
        className={styles.engagementContent}
      >
        {/* Description */}
        <p className={styles.engagementDescription}>{current.description}</p>

        {/* Categories */}
        <div className={styles.engagementCategories}>
          {current.categories.map((cat) => (
            <div key={cat.name} className={styles.servicesDataWrapper}>
              <div className={styles.servicesCategoryHeader}>
                <h3 className={styles.servicesCategoryTitle}>{cat.name}</h3>
              </div>
              <p className={styles.servicesList}>{cat.items.join(", ")}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {current.timeline.phases.map((phase) => (
            <div key={phase.name} className={styles.timelinePhase}>
              <div className={styles.timelinePhaseHeader}>
                <span className={styles.timelinePhaseName}>{phase.name}</span>
                <span className={styles.timelinePhaseDuration}>
                  {phase.duration}
                </span>
              </div>
              <p className={styles.timelineMilestones}>
                {phase.milestones.join(", ")}
              </p>
            </div>
          ))}
          <p className={styles.timelineOutcome}>{current.timeline.outcome}</p>
        </div>

        {/* Note */}
        {current.note && (
          <p className={styles.engagementNote}>{current.note}</p>
        )}
      </motion.div>

      {/* How It Works */}
      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={styles.processSection}
      >
        <h2 className={styles.sectionHeading}>How It Works</h2>
        <div className={styles.processBody}>
          <p>
            We start by listening. Every engagement — whether it runs three
            months or three years — begins the same way: a 20-minute call to see
            if it's worth a conversation, then a paid discovery phase where we
            ask the questions that actually matter.
          </p>
          <p>
            Every product goes through the same loop. An idea, then discovery,
            then design, then build — then back around. The job is understanding
            where you are in the loop and what it needs next.
          </p>
          <p>
            Discovery is where most ideas stop — and should. This is where we
            find out what we actually don't know: who the real user is, what the
            actual problem is, whether someone's already solved it better. We
            put the idea in front of as many people as possible. We listen to
            how they describe their own problem, not just what they say about
            the solution. We research competitors — what did they do well, what
            can we learn from, where did they fail? We document what we learn
            and what we still don't understand. Both come back around.
          </p>
          <p>
            Design is when the idea crystallizes. Defining who we're building
            for. Communicating it clearly to everyone who needs to build it with
            us. These are real decisions made for real reasons, not templates
            filled in.
          </p>
          <p>
            Build is where the code gets written. AI is making this faster —
            cycles that used to take months are contracting. The implication
            isn't that development matters less. It's that everything before
            development has more leverage than it used to. Better discovery,
            better design, tighter iteration — these compound. The loop gets
            smaller and faster, which means the thinking at the start of each
            loop matters more.
          </p>
          <p>
            For a one-time project, launch is a handoff. We ship it, document
            it, train your team on it, and you own it from there.
          </p>
          <p>
            For a partnership, launch is the beginning. The loop keeps going —
            smaller and faster each time.
          </p>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={styles.pricingSection}
      >
        <h2 className={styles.sectionHeading}>Pricing</h2>
        <div className={styles.pricingBody}>
          <p>A 20-minute intro call is free. After that, nothing is.</p>
          <p>
            The first phase — discovery and planning — is required before any
            engagement starts. It's where we figure out what we're building,
            what it needs, and whether we're the right fit to build it together.
            No commitment beyond this phase is required to continue.
          </p>
          <p>
            One-time projects typically range from $4,000 to $60,000 depending
            on scope and complexity.
          </p>
          <p>Ongoing partnerships run $5,000–$10,000 per month.</p>
          <p>
            Both engagement types include design and development. Creative
            design stays with us. Architecture and development are handled by us
            or by collaborators we trust, depending on scope.
          </p>
        </div>
      </motion.section>
    </>
  );
}
```

---

## CSS Notes

### New / updated classes in `services.module.css`:

**`.intro`** — the ethos paragraph. 16px, weight 500, line-height 140%, max-width 635px. Replaces current `.subtitle`.

**`.introMeta`** — the setup line ("We take on two kinds..."). Same size, slightly lighter weight (400) or reduced opacity (0.75) to visually step down from the ethos sentence.

**`.toggle`** — flex row, gap 16px (or 24px), margin-top 2em.

**`.toggleButton`** — no background, no border on inactive. Font matches the site's label style. Cursor pointer. Transition on active state.

**`.toggleActive`** — the active state. Options: underline (border-bottom), or the site's `var(--color-primary)` fill. Pick whatever fits the existing interactive patterns (links, hover states).

**`.engagementContent`** — wrapper for description + categories + timeline + note. Max-width 635px.

**`.engagementDescription`** — 16px, weight 500, line-height 140%, margin-bottom 1.5em.

**`.engagementCategories`** — flex column, gap 16px. (Not side-by-side — keep it stacked and readable at 635px wide.)

**`.timeline`** — margin-top 2em. Max-width 635px. Border-top to separate from categories.

**`.timelinePhase`** — padding 16px 0, border-bottom on all but last.

**`.timelinePhaseHeader`** — flex row, space-between. Phase name (bold) + duration (muted/smaller).

**`.timelinePhaseName`** — font-weight 700, font-size 14px, text-transform uppercase, letter-spacing 0.06em.

**`.timelinePhaseDuration`** — font-size 13px, opacity 0.6.

**`.timelineMilestones`** — font-size 14–15px, margin-top 6px, opacity 0.8.

**`.timelineOutcome`** — font-size 14px, font-weight 700, margin-top 1.5em. Could have a small left border or accent treatment.

**`.engagementNote`** — font-size 13–14px, opacity 0.65, margin-top 1.5em. Italic optional.

**`.processSection`**, **`.pricingSection`** — margin-top 3em, padding-top 2em, border-top (same weight as `servicesDataWrapper` border).

**`.sectionHeading`** — h2. Font matches existing servicesCategoryTitle style. font-size 20–22px, uppercase, weight 800.

**`.processBody`**, **`.pricingBody`** — flex column, gap 1.2em. `p` at 16px, weight 500, line-height 145%.

### Mobile (max-width: 699px):

- `.engagementCategories` → gap 12px
- `.processBody p`, `.pricingBody p` → font-size 15px
- `.toggle` → gap 12px
- `.timelineMilestones`, `.timelineOutcome` → font-size 14px

---

## `page.tsx` Change

```tsx
export const metadata: Metadata = {
  title: "Services | O'Mara Technology",
  description:
    "One-time project and partnership engagements for product design and development.",
  // ...rest unchanged
};
```

---

## Implementation Order

1. **Create `content/services.json`** with the two-engagement structure above
2. **Update `src/lib/content.ts`** — add `getServicesData()`; remove `getServiceItems()` if nothing else in the codebase references it
3. **Rewrite `src/app/components/ServicesSection.tsx`** — full rewrite per component sketch above
4. **Update `src/app/styles/services.module.css`** — add new classes, keep existing ones that carry over
5. **Update `src/app/(frontend)/services/page.tsx`** — swap `getServiceItems` for `getServicesData`, update metadata
6. **Read the page cold** — full top-to-bottom pass, edit anything that sounds written rather than spoken

---

## Todo List

### Phase 1 — Data

- [x] Create `content/services.json`
  - [x] Add `engagements` array with `project` and `partnership` objects
  - [x] Populate `project` engagement: id, label, description, note, categories (Design + Development with all items), timeline phases (Discovery / Design / Development / Launch with milestones and durations), outcome string
  - [x] Populate `partnership` engagement: id, label, description, note, categories (Product Design Strategy + Technical Development Strategy with all items), timeline phases (Discovery / Monthly with milestones and durations), outcome string
- [x] Update `src/lib/content.ts`
  - [x] Add `import servicesRaw from "../../content/services.json"`
  - [x] Add and export `getServicesData()` function
  - [x] Check if `getServiceItems()` is referenced anywhere outside of `services/page.tsx` — only used in page.tsx, removed
  - [x] Add type for the services data shape — used `typeof servicesRaw` via `ReturnType<typeof getServicesData>`

### Phase 2 — Component

- [x] Rewrite `src/app/components/ServicesSection.tsx`
  - [x] Keep `"use client"` directive
  - [x] Add `useState` import
  - [x] Remove old `ContentNode[]` prop, replace with typed `data` prop from `services.json` shape
  - [x] Write `Engagement`, `Category`, `TimelinePhase` types (or inline from `typeof`)
  - [x] Build toggle: two buttons mapping over `data.engagements`, `active` state defaulting to `data.engagements[0].id`
  - [x] Build engagement content block: keyed on `active` for animation, re-animates on tab switch
  - [x] Render engagement description paragraph
  - [x] Render categories — map over `current.categories`, reuse existing `servicesDataWrapper` / `servicesCategoryHeader` / `servicesCategoryTitle` / `servicesList` class names
  - [x] Render timeline — map over `current.timeline.phases`, each phase shows name + duration header and milestones as comma list
  - [x] Render timeline outcome line
  - [x] Render engagement note (muted, below timeline)
  - [x] Build How It Works section — static JSX prose, seven paragraphs per plan copy
  - [x] Build Pricing section — static JSX prose, five paragraphs per plan copy
  - [x] Apply correct motion variants and viewport settings to each section (match existing `amount: 0.15` pattern)
  - [x] Confirm `key={active}` on the animated engagement content block so framer re-mounts on tab switch

### Phase 3 — Styles

- [x] Update `src/app/styles/services.module.css`
  - [x] Add `.intro` — 16px, weight 500, line-height 140%, max-width 635px
  - [x] Add `.introMeta` — same size, weight 400 or opacity 0.75
  - [x] Add `.toggle` — flex row, gap 24px, margin-top 2em
  - [x] Add `.toggleButton` — no background, no border, cursor pointer, font matches site label style, transition
  - [x] Add `.toggleActive` — active state treatment (underline or fill, match existing interactive patterns)
  - [x] Add `.engagementContent` — max-width 635px
  - [x] Add `.engagementDescription` — 16px, weight 500, line-height 140%, margin-bottom 1.5em
  - [x] Add `.engagementCategories` — flex column, gap 16px
  - [x] Add `.timeline` — margin-top 2em, border-top
  - [x] Add `.timelinePhase` — padding 16px 0, border-bottom except last child
  - [x] Add `.timelinePhaseHeader` — flex row, justify-content space-between
  - [x] Add `.timelinePhaseName` — weight 700, font-size 14px, uppercase, letter-spacing 0.06em
  - [x] Add `.timelinePhaseDuration` — font-size 13px, opacity 0.6
  - [x] Add `.timelineMilestones` — font-size 15px, margin-top 6px, opacity 0.8
  - [x] Add `.timelineOutcome` — font-size 14px, weight 700, margin-top 1.5em
  - [x] Add `.engagementNote` — font-size 14px, opacity 0.65, margin-top 1.5em
  - [x] Add `.processSection` — margin-top 3em, padding-top 2em, border-top
  - [x] Add `.pricingSection` — same as processSection
  - [x] Add `.sectionHeading` — h2 style, uppercase, weight 800, font-size 20–22px, matches existing servicesCategoryTitle treatment
  - [x] Add `.processBody` — flex column, gap 1.2em
  - [x] Add `.pricingBody` — flex column, gap 1.2em
  - [x] Add mobile overrides under `@media screen and (max-width: 699px)` for: `.toggle`, `.engagementCategories`, `.processBody p`, `.pricingBody p`, `.timelineMilestones`, `.timelineOutcome`
  - [x] Remove any styles that are fully unused after the rewrite (`.servicesWrapper`, `.servicesCard`, `.serviceCardInfo`, `.arrow`, `.serviceCardTitle`, `.serviceCardDescription` removed)

### Phase 4 — Page

- [x] Update `src/app/(frontend)/services/page.tsx`
  - [x] Replace `getServiceItems` import with `getServicesData`
  - [x] Replace `services` const with `data` const
  - [x] Update `ServicesSection` prop from `services={services}` to `data={data}`
  - [x] Update `metadata.description` to: `"One-time project and partnership engagements for product design and development."`

### Phase 5 — QA

- [x] Build passes clean (`next build` — `/services` renders as static)
- [x] TypeScript clean (`tsc --noEmit` — EXIT:0)
- [ ] Run dev server, open `/services` — visual verification
- [ ] Verify toggle switches between One-time Project and Partnership content correctly
- [ ] Verify fade animation fires on tab switch
- [ ] Verify all items render correctly in both engagement paths
- [ ] Verify timeline phases and milestones display for both paths
- [ ] Verify How It Works and Pricing prose renders without layout breaks
- [ ] Verify mobile layout at 390px — toggle, categories, timeline, prose all readable
- [ ] Read the full page cold — flag anything that sounds written rather than spoken
- [ ] Run through Copy QA Checklist (below)

---

## Copy QA Checklist

- [x] Does the intro set up the toggle naturally?
- [x] Does each engagement description make it immediately clear who it's for?
- [x] Does the timeline feel real and specific, not aspirational?
- [x] Does "How It Works" sound like us talking, not a consultant?
- [x] Does the split at the end (handoff vs. loop) land clearly?
- [x] Does pricing answer "how much does it cost to start?" without an hourly rate?
- [x] Is there any MBA-speak or inflation anywhere? — none found
- [x] Does the page earn the FooterContact CTA?

---

## What We're Not Doing

- No metrics dashboard
- No "with us / without us" comparison diagrams
- No logos or social proof on this page — let the portfolio do that
- No maintenance, bug fix, or existing-product language in the project engagement path

---

_Research reference: `research-services.md`_
