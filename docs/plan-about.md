# About Page — Implementation Plan ✓ COMPLETED

## What This Doc Is

A detailed rewrite plan for `/about`, based on research into Scope Labs, Self Aware Studio, all portfolio project files, masonomara.com, and the current O'Mara Technology site. Includes the full page structure, section-by-section writing, component notes, and implementation details.

---

## Ethos Anchor

Mason said it directly:

> "We live in a generation of constant change. The only choices are timeless work and being creative. That is the ethos of O'Mara Technology."

This is the spine of the page. Everything else hangs from it. It's not a tagline slapped at the top — it's the filter through which the capabilities section, the bio, and the engagement types all read. The page should feel like it was written by someone who actually believes this, not someone who put it on a slide.

---

## Page Architecture

```
H1: About
│
├── [SECTION 1] Ethos + Identity
│     Two short paragraphs. The belief, then who.
│
├── [SECTION 2] What We Build
│     7 capabilities. Grid layout. Each gets a label + 1–2 lines.
│
├── [SECTION 3] Who
│     Photo (existing). Mason's bio. Real, specific, grounded.
│
├── [SECTION 4] How We Work
│     Two engagement types: Strategic / Project.
│     Short, clear. Points to /process for the rest.
│
└── [Footer] (unchanged)
```

---

## Section 1 — Ethos + Identity

### Purpose

Answer two questions immediately: _what do you believe?_ and _who is this?_ In that order. The belief earns the reader's attention; the identity grounds it.

### Writing

**Paragraph 1 — The belief:**

> Everything is changing faster than anyone can comfortably track. The tools, the platforms, the market — it shifts constantly. The only things that hold up are solutions built on timeless thinking and creativity that meets the moment. That's what O'Mara Technology is built around.

**Paragraph 2 — The identity:**

> O'Mara Technology is Mason O'Mara — a product designer and developer based in Asbury Park, NJ. We take on formal engagements for founders and teams building real products: mobile apps, web apps, AI products, and ecommerce experiences. Brought in through trusted partners for larger scopes.

### Notes

- Keep paragraph 1 short and punchy. Don't qualify it.
- Paragraph 2 does three things: names Mason, places him, and states who the work is for. That's enough.
- "Brought in through trusted partners" signals scale without overclaiming.
- Drop the current link to /process from this section. The engagement types section at the bottom handles that.

---

## Section 2 — What We Build

### Purpose

Self Aware's smartest move: put the full capability list where prospects are evaluating you. The About page is where a founder goes to decide if you're right for their thing. Give them a clear answer.

### Layout

Two-column grid on desktop, single column on mobile. Each capability:

- Label (bold, slightly larger or distinct weight)
- 1–2 lines beneath it, plain text

No bullet points. No icons. Clean list that reads.

### Writing (7 capabilities)

---

**Mobile Apps**
Cross-platform iOS and Android built in React Native. Real-time features, matching systems, custom algorithms, subscription payments, App Store and Google Play submission. Built to ship, not just to demo.

---

**Web Apps**
React and Next.js, full-stack. PostgreSQL, Supabase, authentication, real-time subscriptions, Stripe integration. Designed and built end-to-end, deployed on Vercel.

---

**AI Products**
RAG architecture, MCP server development, AI integration into existing products. Building things where AI is actually the feature — not bolted on as an afterthought.

---

**Ecommerce**
Shopify storefronts, custom Shopify development, Stripe, product flows, checkout design. For brands that need a store that works — and handles complexity without falling apart at the seams.

---

**Creative Design**
Interface design, design systems, visual direction, branding. The creative work stays here — not outsourced, not templated. Every product that goes through this studio gets original thinking.

---

**UX Research**
Discovery sessions, user interviews, competitor audits, information architecture. This is where most ideas should stop — and the ones that shouldn't come out the other side with a real direction.

---

**Product Development**
Strategy, roadmapping, feature prioritization, algorithm design, gamification, onboarding. From the first whiteboard session to a shipped product and everything the loop requires in between.

---

### Section Heading

No section heading needed. The grid is self-explanatory and keeps the page moving. If one is needed for readability: **"What We Build"** — short, direct, no punctuation.

---

## Section 3 — Who

### Purpose

Scope Labs gets this right structurally (real names, real photos, real credentials) but executes it coldly. This section should make a prospect feel like they know who they'd be working with — not like they just read a LinkedIn profile.

The headshot already exists (`/siteHeadshot.png`). Keep it. Real photo of a real person is rare on agency sites and worth a lot.

### Layout

Photo on one side, bio text on the other. On mobile: photo above, bio below. Existing `cardImageContainer` styling can adapt.

### Writing (Mason's bio)

> Mason O'Mara is a product designer and software engineer. He's shipped iOS and Android apps, full-stack web platforms, Shopify storefronts, and AI-integrated tools — across industries from yacht staffing to accessibility consulting to fashion retail.
>
> He moved from UX strategy into independent practice to do the work he cares about with teams he believes in. He writes about product and design on [Substack](https://substack.com/@masonomara) and documents builds on [YouTube](https://youtube.com/@masonomaratechnology). He's based in Asbury Park, NJ.

### Notes

- Two paragraphs. First is credentials-through-specifics (not a credentials list). Second is character.
- "From yacht staffing to accessibility consulting to fashion retail" — this is better than any credential. It signals range and real experience.
- "Teams he believes in" echoes Scope's best phrase without stealing it.
- The Substack and YouTube links add texture. A person who writes and documents is easier to trust than a pitch.
- Link to masonomara.com stays — put it where it makes sense contextually or near the photo.

---

## Section 4 — How We Work

### Purpose

Two engagement types, described briefly and honestly. The goal here is to get the right client to recognize themselves and feel good about calling. The full timeline and pricing detail stays on `/process` — this section is the handshake, not the contract.

### Writing

**Section heading:** "How We Work" — or nothing, let the engagement labels carry it.

---

**Strategic Engagements**
Monthly. For products in motion or being formed. We work alongside you — research, architecture, design direction, prioritization, and iteration as the product develops. Not a project, a relationship.

---

**Project Engagements**
One-time. For new builds. Discovery, design, development, and launch — scoped before we start, payments at monthly milestones. At the end, you own it: documented, trained, yours to run.

---

**Note on the process:**

> Once we commit after discovery, everything is in motion. Creative design stays with Mason. Architecture and information design is Mason or someone he trusts. Development is Mason or collaborators he's worked with. Nothing gets handed off to strangers.

**Link:**

> Full services and process detail at [omaratechnology.com/process](/process).

### Notes

- Keep the "note on the process" short. It addresses the outsourced-agency fear directly and honestly without being defensive.
- The link to /process should be plain and direct, not a big CTA button. The Footer below handles the actual contact moment.

---

## Component Changes

### `About.tsx` — Full Rewrite

The current file is 73 lines and does almost nothing. New structure:

```tsx
export default function About() {
  return (
    <>
      {/* H1 */}
      <motion.h1 ...>About</motion.h1>

      {/* Section 1: Ethos + Identity */}
      <motion.div ...>
        <p className={styles.ethos}>...</p>
        <p className={styles.identity}>...</p>
      </motion.div>

      {/* Section 2: What We Build */}
      <motion.div ...>
        <div className={styles.capabilitiesGrid}>
          {capabilities.map((cap) => (
            <div key={cap.label} className={styles.capability}>
              <h3 className={styles.capabilityLabel}>{cap.label}</h3>
              <p className={styles.capabilityBody}>{cap.body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 3: Who */}
      <motion.div className={styles.bioSection} ...>
        <div className={styles.cardImageContainer}>
          {/* existing image markup */}
        </div>
        <div className={styles.bioText}>
          <p>...</p>
          <p>...</p>
        </div>
      </motion.div>

      {/* Section 4: How We Work */}
      <motion.div ...>
        <div className={styles.engagementsGrid}>
          <div>
            <h3>Strategic Engagements</h3>
            <p>...</p>
          </div>
          <div>
            <h3>Project Engagements</h3>
            <p>...</p>
          </div>
        </div>
        <p className={styles.processNote}>...</p>
        <Link href="/process">omaratechnology.com/process</Link>
      </motion.div>
    </>
  )
}
```

The capabilities can be defined as a const array at the top of the file (7 objects, each with `label` and `body`).

### `about.module.css` — New Classes Needed

- `.ethos` — opening paragraph, slightly larger or heavier than body text
- `.identity` — second paragraph, standard body size
- `.capabilitiesGrid` — 2-col CSS grid on desktop, 1-col on mobile
- `.capability` — individual capability block
- `.capabilityLabel` — bold label, no margin/padding bloat
- `.capabilityBody` — standard body text
- `.bioSection` — flex row on desktop (photo | text), flex col on mobile
- `.bioText` — bio paragraphs
- `.engagementsGrid` — 2-col grid on desktop, 1-col on mobile
- `.processNote` — small, muted note about creative/dev ownership
- Keep existing `.cardImage*` classes — they work, don't touch them

### Animation Pattern

Use the same animation variants already in use:

- `textFadeUp` on the H1 (already there)
- `textFadeUpSmall` on each section block (stagger with small offsets: 0.08, 0.14, 0.20, 0.26)
- `fadeIn("up", ...)` on the image (already there, keep it)

Do not add new animation variants. The CLAUDE.md says not to without a clearly distinct use case — this doesn't have one.

---

## What Stays the Same

| Element                        | Status                         |
| ------------------------------ | ------------------------------ |
| H1 "About"                     | Keep — nav consistency, SEO    |
| Headshot photo                 | Keep — `siteHeadshot.png`      |
| `cardImageContainer` structure | Keep — working, don't break    |
| `Footer` at bottom      | Keep — unchanged               |
| Link to masonomara.com         | Keep — earns trust             |
| Animation variant files        | Keep — don't touch `motion.ts` |

## What Gets Removed

| Element                                                                    | Why                                                     |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| "Product design and technical development strategy and services for hire." | Replaced by the ethos + identity paragraphs             |
| "Our process and services available at..."                                 | Replaced by the How We Work section with a natural link |
| The two-paragraph stub that makes up the current About                     | Everything replaced                                     |

---

## Voice Checklist for Writing

When drafting or reviewing any copy on this page, check against these:

**Use:**

- Short declarative sentences
- Specific nouns (Supabase, React Native, Asbury Park, yacht staffing — not "enterprise," not "clients")
- First person that sounds like a person, not a press release
- "We" when it means Mason + partners. Never "we" that implies a larger team that doesn't exist.
- One or two moments of earned specificity that stick ("Guy Fieri" is in the Seed to Sprout case study — that's the kind of real detail that makes everything else feel more credible)

**Avoid:**

- "High caliber digital experiences"
- "Strategic partner"
- "We pressure test assumptions"
- "Unglamorous work"
- Any sentence that would fit identically on a competitor's about page
- Bullet points in body copy (list format in the capabilities grid is fine — it's structured, not a bullet list)
- "Results-driven," "outcome-focused," or any phrase that sounds like a LinkedIn skill endorsement

---

## Full Copy Summary (Final Draft for Implementation)

### Section 1

> Everything is changing faster than anyone can comfortably track. The tools, the platforms, the market — it shifts constantly. The only things that hold up are solutions built on timeless thinking and creativity that meets the moment. That's what O'Mara Technology is built around.
>
> O'Mara Technology is Mason O'Mara — a product designer and developer based in Asbury Park, NJ. We take on formal engagements for founders and teams building real products: mobile apps, web apps, AI products, and ecommerce experiences. Brought in through trusted partners for larger scopes.

### Section 2 (Capabilities)

| Label               | Body                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mobile Apps         | Cross-platform iOS and Android built in React Native. Real-time features, matching systems, custom algorithms, subscription payments, App Store and Google Play submission. Built to ship, not just to demo. |
| Web Apps            | React and Next.js, full-stack. PostgreSQL, Supabase, authentication, real-time subscriptions, Stripe integration. Designed and built end-to-end, deployed on Vercel.                                         |
| AI Products         | RAG architecture, MCP server development, AI integration into existing products. Building things where AI is actually the feature — not bolted on as an afterthought.                                        |
| Ecommerce           | Shopify storefronts, custom Shopify development, Stripe, product flows, checkout design. For brands that need a store that works — and handles complexity without falling apart at the seams.                |
| Creative Design     | Interface design, design systems, visual direction, branding. The creative work stays here — not outsourced, not templated. Every product that goes through this studio gets original thinking.              |
| UX Research         | Discovery sessions, user interviews, competitor audits, information architecture. This is where most ideas should stop — and the ones that shouldn't come out the other side with a real direction.          |
| Product Development | Strategy, roadmapping, feature prioritization, algorithm design, gamification, onboarding. From the first whiteboard session to a shipped product and everything the loop requires in between.               |

### Section 3 (Bio)

> Mason O'Mara is a product designer and software engineer. He's shipped iOS and Android apps, full-stack web platforms, Shopify storefronts, and AI-integrated tools — across industries from yacht staffing to accessibility consulting to fashion retail.
>
> He moved from UX strategy into independent practice to do the work he cares about with teams he believes in. He writes about product and design on Substack and documents builds on YouTube. He's based in Asbury Park, NJ.

### Section 4 (How We Work)

**Strategic Engagements**

> Monthly. For products in motion or being formed. We work alongside you — research, architecture, design direction, prioritization, and iteration as the product develops. Not a project, a relationship.

**Project Engagements**

> One-time. For new builds. Discovery, design, development, and launch — scoped before we start, payments at monthly milestones. At the end, you own it: documented, trained, yours to run.

**Process note:**

> Once we commit after discovery, everything is in motion. Creative design stays with Mason. Architecture and information design is Mason or someone he trusts. Development is Mason or collaborators he's worked with. Nothing gets handed off to strangers.

**Link:**

> Full services and process at [omaratechnology.com/process](/process).
