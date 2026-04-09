# About Page Research & Rewrite Plan

## What I Looked At

- **Scope Labs** — https://scopelabs.com/about
- **Self Aware Studio** — https://selfaware.studio/process/
- **Current O'Mara About** — `src/app/components/About.tsx`
- **Current O'Mara Services/Process** — `src/app/components/ServicesSection.tsx` + `content/services.json`

---

## Scope Labs

### What They Do Well

- They speak the language. You can tell immediately that this is a technical shop — not a vendor. "Agentic engineering," "zero-to-one," "infrastructure" — all correctly used.
- Team bios actually land. Each exec has a real credential — MIT, Y Combinator, Google, Fortune 500. The bios feel earned, not fluffed.
- Outcome-focused. Phrases like "we treat your product like it's ours" and "push harder and do what it takes to win" are trying to solve the fundamental anxiety: _will they actually care?_
- Client testimonials that say something real. "They became real partners in the vision" is a quote that addresses the outsourced-agency fear directly.

### What They Do Badly

- Corporate manufacturing smell. "We pressure test assumptions, close gaps, and do the unglamorous work that makes products durable." Every word is technically true and emotionally dead. Nobody talks like this in a real partnership.
- Pretension without warmth. The credentials are good but the framing is cold. You don't feel a person behind the studio, just a polished pitch deck.
- The three-column values structure is a template. Everyone has three core values. Founder Experience, Attention to Detail, Outcome Focus are real, but presenting them in that grid makes them feel like stock photography.
- The page is long and ultimately forgettable. After all the language, you don't actually know who these people are or what it would feel like to work with them.

---

## Self Aware Studio

### What They Do Well

- It is not a chore to read. "Keys to your shiny new website 🔑" is a single line that tells you who you are as a studio — confident, warm, a little playful. It works without being unprofessional.
- Radical transparency. Exact pricing ($40K–$175K), exact timelines (7 weeks, 12 weeks, 14 weeks), milestone-by-milestone. This is rare and builds trust fast.
- The services are on the process page. All capabilities listed where you'd actually evaluate them — when you're deciding whether to hire them, not buried elsewhere.
- Conversational without losing authority. "We do a lot of listening in this phase" reads like a human being. "Equal attention and effort are devoted to both the frontend interface and the backend usability. We're all about style and substance." — they sneak the positioning into sentences that read naturally.
- The contact form is designed like a relationship. "Dear Self Aware, My name is X and I am Y at Z." That form makes the prospect feel like they're writing to a person.

### What They Do Badly

- Narrow scope. Websites and Shopify. That's all. No AI, no mobile, no product strategy, no research. There's not much to criticize because they've deliberately narrowed to what they do best — but this model doesn't serve O'Mara Technology's breadth.
- The process page doesn't sell who they are. You understand what they do and how they do it, but there's no real hook about _why they exist_ or what they believe. It reads more like a manual than a positioning statement.
- No faces. The studio is faceless. For a small, personalized shop, that's a missed opportunity.

---

## Current O'Mara Technology About Page

### The Problem

The page is almost empty. Title, two short paragraphs, a headshot. The two paragraphs say:

> "Product design and technical development strategy and services for hire. Founded by Mason O'Mara for formal engagements and opportunities to work with trusted partners. Based out of Asbury Park, NJ."

> "Our process and services available at omaratechnology.com/process."

That's it. This is a business card, not a page. All the good writing — the philosophy, the services breakdown, the pricing, the process narrative — lives on `/process`. The About page is doing almost no work.

### What's Already Working (on /process)

The existing process page copy is actually excellent and already hits the right tone:

- _"Everything changes fast. What holds up is better thinking at the start."_
- _"A 20-minute intro call is free. After that, nothing is."_
- _"Discovery is where most ideas stop — and should."_
- _"For a partnership, launch is the beginning. The loop keeps going — smaller and faster each time."_

This is direct, real, confident without arrogance. It sounds like a person, not a pitch deck. This voice needs to carry over into the About page.

---

## The Gap Between the Two References

|              | Scope Labs                  | Self Aware                        |
| ------------ | --------------------------- | --------------------------------- |
| Tone         | Professional, cold          | Warm, approachable                |
| Voice        | Corporate                   | Human                             |
| Credentials  | Heavily front-loaded        | Not present at all                |
| Services     | Described broadly           | Listed concretely on process page |
| Pricing      | Not disclosed               | Clearly stated                    |
| Team         | Named, credentialed, photos | Unnamed/faceless                  |
| Readability  | Low                         | High                              |
| Memorability | Low                         | Medium                            |

The ideal O'Mara Technology about page lives in the space Scope Labs occupies but couldn't execute: **professional, credentialed, speaks the language — but also human, real, and worth reading**.

---

## What the About Page Should Do

1. **Communicate who Mason is** — not in a resume format, but in a way that makes the prospect trust him and want to work with him. Real, honest, not overclaimed.
2. **List the full capabilities** — the seven core areas should be named and contextualized. Prospects are evaluating whether you can handle their specific thing. This is where Self Aware's move of putting services on the process page is smart — mirror it here.
3. **Establish a point of view** — not "core values" bullet points, but a paragraph or two that communicates _what Mason believes about building well_. Scope tries this and fails. The existing /process copy already nails it.
4. **Make it easy to hire** — everything points toward contact, and the right kind of work is implied throughout.

---

## Proposed Page Structure

### 1. Title + Opening Statement

Not "About." Something real. A single line that answers: _who is this for, and what do they do?_

Possible: "We design and build products people actually use."

Or go direct about the who: "A design and development studio for founders and teams who need to ship something real."

Avoid: taglines that could describe any agency. Stay specific.

### 2. Short Identity Paragraph (2–3 sentences)

Who O'Mara Technology is, in plain language. Mason's name, what the studio does, where it's based. Human, not corporate. Should feel like something he'd say out loud.

Example direction (not final copy):

> O'Mara Technology is Mason O'Mara — a designer and developer based in Asbury Park, NJ. We take on formal engagements for companies and founders building mobile apps, web apps, AI products, and ecommerce experiences. Work we take seriously gets our full attention.

### 3. Capabilities Section

This is borrowed from the Self Aware playbook. List the seven capability areas clearly, not as bullet points but as a scannable, readable breakdown. Each one should have a line or two that explains what it actually means in practice — not just a label.

The seven areas to cover:

- **Mobile Apps** — React Native, iOS/Android, real-time features, cross-platform
- **Web Apps** — React, Next.js, full-stack, databases, auth, deployment
- **AI Products** — RAG architecture, MCP servers, AI integration, product thinking for AI
- **Ecommerce** — Shopify, Stripe, product flows, checkout design
- **Creative Design** — Interface design, design systems, branding, visual direction
- **UX Research** — Discovery, user interviews, competitor audits, information architecture
- **Product Development** — Strategy, roadmapping, feature prioritization, cross-functional execution

### 4. A Short "How We Think" Block

Two or three short paragraphs about the philosophy. Can borrow/adapt from the existing /process page (which already has the best writing on the site). What matters here: a point of view that isn't generic, and that signals the right kind of client fit.

Focus: better thinking at the start, discovery as the real work, the loop of build/learn/iterate, and that small/fast beats big/slow.

### 5. Who

Mason's bio. Photo stays (good move). But the bio should be real — where he came from, what he's built, what he cares about. Not a credentials list. Should have one surprising or specific detail that makes it feel like a person wrote it, not a PR team.

Link to masonomara.com stays.

### 6. Trusted Partners (optional, brief mention)

The services.json already mentions "trusted partners" for design, Shopify, marketing, SEO, automations. One sentence noting this expands the scope of what a partnership can cover without making it sound like there's a hidden roster of subcontractors.

---

## What to Keep on /process vs. What to Move

| Content                       | Currently on | Should move to                        |
| ----------------------------- | ------------ | ------------------------------------- |
| Services capability list      | /process     | /about                                |
| How It Works philosophy prose | /process     | /about (version of it)                |
| Timeline milestones           | /process     | Stay on /process                      |
| Pricing details               | /process     | Mention on /about, detail on /process |
| Engagement type toggle        | /process     | Stay on /process                      |

The About page should make someone want to hire you. The Process page should close them once they've decided they're interested. Currently the About page isn't doing its job at all.

---

## Voice Guidelines for the Rewrite

**Use:**

- Direct, declarative sentences. "We build mobile apps. We've shipped real ones."
- Specific over general. Not "enterprise clients" but "founders and product teams."
- First person plural that still feels personal — "we" can be Mason + trusted partners without lying.
- Short paragraphs. No walls of text.
- One or two moments of personality — not forced humor, just humanity.

**Avoid:**

- "We pressure test assumptions." Nobody says this.
- "High caliber digital experiences." Empty agency speak.
- "Strategic partner." Overused.
- Any sentence that could appear word-for-word on a competitor's site.
- Credentials listed like a resume. Weave them into the story instead.

---

## Things to Keep From the Current Page

- The headshot. Real photo of a real person is rare and good.
- The Asbury Park detail. Specific, grounding.
- The link to masonomara.com. Signals transparency and confidence.
- The overall tone of the existing /process copy — that voice should expand to fill the About page.

---

## Summary

The About page is currently the weakest page on the site. The good material — services, philosophy, pricing, voice — is all on /process. The fix isn't a small tweak, it's a real rewrite with a real structure: open with a clear identity, show the full capability set (like Self Aware does), establish a point of view (like Scope tries and fails to do), introduce Mason like a person instead of a credential, and point clearly toward contact.

The goal: a prospect lands on /about and finishes it knowing exactly what O'Mara Technology does, feeling like they understand who Mason is, and confident this is the right studio to call.
