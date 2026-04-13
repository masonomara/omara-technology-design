# Plan: Work Pages Rewrite — O'Mara Technology

*Based on research-work.md, existing project markdown, About.tsx, services.json, and reference analysis of Scope Labs and Self Aware Studio.*

---

## Goals

1. Rewrite project case studies using the agreed structure — specific hook → context → what was built → key decisions → outcome → image grid
2. Make the thinking behind decisions the differentiator — not just what was built, but why it was built that way
3. Keep copy fast, specific, deliberate, honest, concise — no throat-clearing
4. Preserve all old writing in archive files before changing anything
5. Make the cover image bigger and remove the red/color overlay
6. Keep the work index grid as-is with minor copy improvements per card

---

## Voice Principles (apply to all rewrites)

- **Lead with the most interesting thing**, not the most general
- **Name the decision and the reason** — "I chose X because Y" is more valuable than "X was implemented"
- **Use first person singular** — this is a solo practice, not a firm
- **Specific beats general** — "500+ users in the first weekend" beats "strong early traction"
- **No superlatives** — no "seamless," "robust," "innovative," "transformative"
- **Short sentences carry more weight** — trust them
- **Let outcomes land on their own** — don't editorialize results

---

## Part 1: Cover Image — CSS Changes

### Current behavior
- Height: `40vh`, max-height: `300px`
- Image is grayscale (`filter: saturate(0)`)
- `cardImageMultiply` — background color blend layer
- `cardImageScreen` — `--color-primary` (red/orange) at screen blend mode — **this is the tint**

### Proposed changes
Two goals: bigger, and remove the tint.

**Make it bigger:**
```css
.cardImageContainer {
  height: 60vh;         /* was 40vh */
  max-height: 500px;    /* was 300px */
}
.cardImageContainerBlock {
  height: calc(60vh + 71px);     /* was 40vh */
  max-height: calc(500px + 71px); /* was 300px */
}
/* mobile: */
@media screen and (max-width: 699px) {
  .cardImageContainer { top: 65px; height: 55vh; max-height: 400px; }
  .cardImageContainerBlock { height: calc(55vh + 65px); max-height: calc(400px + 65px); }
}
```

**Remove the red overlay:**
- Remove `cardImageScreen` div from `[slug]/page.tsx` entirely, OR set `opacity: 0` in CSS
- Keep or remove `cardImageMultiply` based on whether you want the dark/moody treatment — this darkens toward the background color without adding the tint
- Option A: Remove both layers — full-color image, clean
- Option B: Keep multiply only — darkened but no color cast
- Recommendation: **Option A first**, see how it looks. The images themselves should carry the hero.

Also consider: removing `filter: saturate(0)` from `.cardImageTwo` if you want full-color images. Currently every cover is grayscale. Full color would feel more alive and distinct per project.

---

## Part 2: Work Index — Minor Improvements

### Current state
Grid of `ProjectCard` components — thumbnail + project name. No descriptions on the card.

### Proposed change
Add a one-line description to each card. This is already in the content system via `node.description` — it just needs to be surfaced in `ProjectCard`.

**Card copy (one line per project):**
These will be written as part of the case study rewrites below — each project's hook becomes its card description. The card description should be the same sentence as the hook on the project page, so the index sets up what the page delivers.

**No other changes to the index.** The grid is working. The cover images are the right lead. Don't add filters or categories yet — the project count doesn't warrant it.

---

## Part 3: Archive Strategy

Before editing any markdown file, copy it to an archive folder:

```
content/projects/_archive/
  moor.md
  capturenoire.md
  innova-sphere.md
  chomp.md
  offshore-coffee.md
  ... (all 16 projects)
```

Create the archive directory. Copy each file before touching it. This preserves full original drafts permanently.

---

## Part 4: Case Study Structure

Every project page follows this structure. Sections marked `[optional]` only appear if there's real content to put there — don't pad thin projects.

```
[Hook — one sentence, the most specific/interesting thing about this project]

[Context — 2–4 sentences. Who the client is, what made this hard or interesting,
 what was at stake. Industry context if it earns its place.]

[What was built — 2–4 sentences. What you actually made. Name tools only when
 the choice is interesting.]

## [Decision heading] [optional, 1–3 of these]
[2–4 sentences. What was the fork in the road. What you decided. Why.]

[Outcome — real numbers or what changed. Let it stand alone.]

[Images — at end, inline as they are now, or consider a grid section]
```

**What "key decisions" looks like in practice:**
Not "I used Next.js." That's a tool choice. A real decision has a fork:
- "Everyone wanted a mobile app. I recommended website first — so I could fix a bug in a tent at the Fort Lauderdale boat show. Native would've made that impossible."
- "The algorithm needed to match people with incomplete data. Gale-Shapley — the Nobel Prize algorithm — assumes static, complete rankings. Yacht jobs don't work that way. I approximated matching through design instead."
- "I chose TSV as the content format so INNoVA's accessibility experts could edit recommendations in Excel without touching code."

---

## Part 5: Per-Project Rewrites

*All copy below is drawn from existing markdown. Where original copy is good, it's kept verbatim or lightly trimmed. Additions are minimal and clearly marked.*

---

### Moor
**Current:** 270 lines — detailed, thorough, reads like a long-form article
**Direction:** Keep the structure and thinking, cut throat-clearing, tighten each section to its essential argument

**Card description (one line for index):**
> Moor matched yacht crew to employers through a platform that bet on design over algorithm — and launched with 500 users at the Fort Lauderdale boat show.

**Hook:**
> Yacht staffing still runs on a free job board that looks like it was built in 1993. Moor set out to replace it.

**Context (from existing copy, condensed):**
> The industry is a mess: agencies earn placement fees by volume, not quality — crew called them "CV-pushers." The Moor team had a yachting expert with 500,000 followers and three months before the Fort Lauderdale International Boat Show. A [yachting tragedy](https://www.cbsnews.com/miami/news/murder-south-african-stewardess-superyacht-fort-lauderdale/) made staff safety a recurring topic in user interviews.

**What was built:**
> A two-sided matching platform — crew browse jobs, employers browse crew. Browse-apply-accept. Matching algorithm, real-time chat, subscription payments, and the full infrastructure. Built in Next.js and Supabase.

**Key decisions (3 — these are Moor's best material, keep them):**

*Decision 1: Website before app*
> Everyone wanted a mobile app. I recommended website first. At FLIBS, I found a bug while demoing to a staffing agent and fixed it in an hour in a tent. Native would've made that impossible. After launch, a credentials verification service reached out to partner — the integration required refactoring that would've cost far more on mobile.

*Decision 2: Approximating matching through design*
> Yacht staffing is a stable matching problem — two sides need to accept their matches. I looked at Gale-Shapley, the Nobel Prize algorithm that matches 40,000 medical residents to hospitals annually. The problem: Gale-Shapley assumes complete, static rankings executed once. Yacht jobs post and fill daily. I couldn't solve it algorithmically, so I approximated it through design: a scoring system that presents quality-ranked shortlists, then lets users decide.

*Decision 3: Conversations threaded by person, not by job*
> Each application could have had its own conversation thread. Yacht staffing involves relationships that span multiple positions — same crew, different seasons. Threading by person keeps history intact when someone applies again. I added job cards into the chat thread so context travels with the conversation.

**Outcome:**
> By the first weekend at Fort Lauderdale, Moor had 500+ users, 50+ paying customers, and active crew-employer conversations.

**Note on existing content:** The Discovery, Competitors, Algorithm sections have excellent detail. Keep the section headers and condense each to 3–5 sentences max. The deep material is valuable — just cut repetition and filler transitions.

---

### INNoVA Sphere
**Current:** Very detailed, strong material
**Direction:** Condense, keep the data architecture and gamification decisions — those are the differentiating thinking

**Card description:**
> Turned four PDFs of accessibility expertise into a queryable app — then spent 18 months building the system that let INNoVA's team update it without touching code.

**Hook:**
> INNoVA had four PDF flowcharts containing hundreds of expert accessibility recommendations. No one could query them.

**Context:**
> An accessibility consulting firm based in Toronto needed a mobile app in two months. They had expert content — workplace ergonomics, digital accessibility, mental wellness — structured as branching decision paths across PDFs. The challenge was turning unstructured expertise into data, then building the app on top of it. The two-month project became 18 months.

**What was built:**
> A React Native app (iOS and Android) with 900+ questions across 13 workplace environment modules, a subscription model, organizational onboarding via company codes, and an automated content pipeline so INNoVA's team can update recommendations in Excel without touching code.

**Key decisions (2):**

*Decision 1: TSV as content format*
> INNoVA's content team could write recommendations but couldn't work with JSON or databases. Every update funneled through me — a bottleneck I had to remove. I chose TSV as the source format because it opens natively in Excel and Google Sheets. Node.js scripts convert TSV files into Firebase-ready JSON. Content experts stay in their comfort zone; the pipeline handles the rest.

*Decision 2: Attributes over binary flags*
> The original system produced 50+ isolated logic checks per user — yes to Q173, no to Q194 — repeated forty or more times. Every new recommendation required manually mapping every answer combination. I proposed six attributes instead: Compliance, Communication, Awareness, Engagement, Inclusivity, Proficiency. Score users on a spectrum; map recommendations to attribute combinations. Fifty puzzle pieces reduced to six signals.

**Outcome:**
> The app shipped to the App Store and Google Play. 979 structured records across 10 interconnected tables. Nine government departments trialing the enterprise version. The gamification framework, ideas deck, and feature prioritization matrix outlasted the code itself as strategic tools for the team.

---

### CaptureNoire
**Current:** Detailed, reads a bit like a status report
**Direction:** Lead with the mission — it's the most compelling hook — then keep the architecture and AR decisions

**Card description:**
> A photo editing app built specifically for darker skin tones — designed for the investors, shipped to the App Store.

**Hook:**
> Photo editing filters are trained on data that underrepresents darker skin tones. CaptureNoire was built to fix that.

**Context:**
> An Indianapolis photographer and entrepreneur came with four PDF flowcharts — actually, that's INNoVA. For CaptureNoire: she found that editing software made dark skin look washed out or oversaturated. She had a venture funding pitch at Really, an Indianapolis tech conference. My job was product discovery, research, design, and frontend development — plus managing a graphic designer and a hired backend developer.

**What was built:**
> A native iOS/Android app — VSCO-style photo editing suite with 60+ Tone Effects across Photo, Video, and AR modes. Subscriptions, profiles, collections, IMGLY for image processing, DeepAR for AR filters.

**Key decisions (2):**

*Decision 1: Branded terminology vs. usability*
> "Tone Effect™ Color Grading" positioned the filters as proprietary technology. User testing showed the terminology overwhelmed people. Simplified the labels so they worked across Photo, Video, and AR modes — the branding goal survived, the confusion didn't.

*Decision 2: AR cost more than it was worth*
> We spent a month evaluating Banuba and DeepAR — testing features, pricing, running demos. IMGLY then announced a major SDK update and dropped support for the old version. Two weeks of migration we didn't plan for. In retrospect, AR should have been deprioritized from the start. Early prototyping would have surfaced the complexity sooner.

**Outcome:**
> CaptureNoire is live on the App Store. At the demo, nonprofits and educational institutions expressed interest in ambassador partnerships. Investors responded well. Android version in progress.

---

### Offshore Coffee
**Current:** Good structure, some padding to trim
**Direction:** Lead with the growth number, keep the multi-track complexity

**Card description:**
> A website redesign for one coffee shop that grew into four locations, a wholesale program, and 900% online sales growth.

**Hook:**
> Online sales grew 900% from year two to year three. It started as a website redesign.

**Context:**
> Offshore Coffee had one shop and a WordPress site that couldn't handle what they needed. The redesign turned into four new Jersey Shore locations, a wholesale program supplying cafes and restaurants regionally, a rebrand, and new online product lines.

**What was built:**
> A Shopify store serving three customer segments — retail, wholesale, and cafe visitors — each with different needs: subscriptions, grind options, location info, and online ordering. Navigation built around three pathways: shop beans, find locations, order food.

**Key decisions (1):**

*Decision: Three pathways, not one*
> Offshore's customers want different things. Online shoppers are buying beans. Locals are finding their nearest cafe. Food customers are ordering ahead. Designing for all three in a single nav — shop, locations, order — kept each path clean without burying any of them.

**Outcome:**
> 900% online sales growth from year two to year three.

---

### Butcher's Block
**Current:** Good, already relatively tight
**Direction:** Lead with the numbers — they're exceptional — then the technical complexity

**Card description:**
> Search engine sales went from 7% to 49% of revenue within a month of launch.

**Hook:**
> The Butcher's Block needed a rebuild that wouldn't interrupt subscription revenue. Within a month of launch, search engine sales jumped from 7% to 49% of revenue.

**Context:**
> A Long Branch, NJ restaurant and butcher shop with a COVID-era e-commerce setup that worked, but had real overhead: separate domains, stalled subscriptions, no inventory management.

**What was built:**
> Merged the domains, rebuilt the subscription system, added inventory management and shipping features on a revamped Shopify setup. Styling matched their restaurant menus. Documented everything so they could run it themselves.

**Outcome:**
> Daily sales +82%. New customer sales +134%. Subscriptions +150%. Search engine revenue share: 7% → 49%.

---

### Lisa Says Gah
**Current:** Good honest framing — "didn't need a redesign, needed someone to fix what was broken"
**Direction:** Keep that framing, it's the hook

**Card description:**
> Tens of thousands of daily visitors, inherited technical debt, and a team that couldn't stop for a rebuild. I fixed what was broken and didn't touch what was working.

**Hook:**
> Lisa Says Gah didn't need a new platform. They needed someone to fix what was broken, improve what was weak, and not touch what was working.

**Context:**
> A Shopify Plus store with tens of thousands of daily visitors — beautiful on the surface, tangled underneath. Buggy integrations, underperforming product pages, confusing filters. Previous developers had left debt. Current operations couldn't be interrupted.

**What was built:**
> Product page redesign, custom JavaScript for dynamic collection filtering without full page reloads, reviews platform migration, and a full pass of integrations — preorders, order validation, customer support tools, international currency and shipping, and inventory/order syncing.

**Key decisions (1):**

*Decision: Side filter over dropdown*
> The filtering system made dynamic filtering awkward. The fix wasn't just technical — the UI shifted from confusing dropdowns to a side filter panel that's omnipresent on desktop and viewable as a whole on mobile. The backend restructure and the style fix happened together.

**Outcome:**
> Growth in sales, conversion rates, search traffic, and total orders during the engagement.

---

### Train Market
**Current:** Good research documentation, weak ending
**Direction:** Lead with the two-sided market problem, keep the research depth, honest reflection

**Card description:**
> A two-sided marketplace for personal trainers and clients — research, personas, and high-fidelity mockups for an investor pitch.

**Hook:**
> Personal trainers struggle to find clients. Clients struggle to find qualified trainers. Train Market was built to fix both sides — I delivered the research and product foundation for the investor pitch.

**Context:**
> A founder with industry connections and a clear hypothesis: the personal training market was fragmented. Discovery relied on word-of-mouth, gym affiliations, or Instagram scrolling. Neither side had real tools.

**What was built:**
> Full product development lifecycle — seven user interviews across three segments, personas and empathy maps, competitor analysis, information architecture, context framework, feature roadmap, and high-fidelity mockups.

**Key decisions (1):**

*Decision: Scope discipline over feature completeness*
> Every interview surfaced new features trainers wanted — scheduling, video calls, payment plans, referral programs, gym partnerships. The context framework filtered these through one question: which features support the business goals, which drive investment, which actually support a user need? The hardest part was knowing what not to build for the pitch.

**Outcome:**
> The founder used these deliverables to pursue investment. Honest reflection: if I did this again, I'd spend more time on the gym owner segment — two-sided marketplaces are difficult when the communication and payments aren't sticky enough to keep both sides on platform.

---

### Seed to Sprout
**Current:** Good detail on the multi-product checkout complexity
**Direction:** Lead with the technical challenge (one cart, wildly different shipping rules), keep cookbook section

**Card description:**
> A vegan restaurant's Shopify store with six product types, six different checkout rules, and a cookbook with a preorder system — built so the team could run it without me.

**Hook:**
> One cart, six product types, six different shipping and pickup rules. Custom cakes need local pickup scheduling. Digital recipes deliver instantly. Merchandise ships nationally.

**Context:**
> Seed to Sprout is a vegan restaurant in Avon-By-The-Sea, NJ. They needed an online store and a cookbook — and infrastructure that the team could operate independently after handoff.

**What was built:**
> A Shopify store configured with shipping profiles, pickup calendars, and checkout flows that route each item correctly when customers mix products in one cart. Plus a cookbook designed with a specialty print designer, interactive QR codes throughout, and a preorder system coordinated between the printer, the team, and Shopify.

**Outcome:**
> The Seed to Sprout team now handles operations independently — products, events, promotions. No ongoing developer dependency.

---

### Chomp
**Current:** 5 lines — too thin
**Direction:** The existing copy is accurate but needs a hook and one decision. No fabrication — use only what's there. This project may stay short by design; that's fine.

**Card description:**
> A multi-step insurance quoting form in React — built to know what to ask upfront and what to save for the follow-up call.

**Hook:**
> Insurance quoting is stressful. The form needed to collect what mattered without asking for everything at once.

**Context (from existing):**
> Chomp is an insurance brokerage. They needed help with client onboarding on their existing website.

**What was built:**
> A multi-step quoting form in React and Next.js. The design stays approachable — bright colors, clean type, subtle animations. Form data sends directly to the CRM.

**Key decisions (1):**

*Decision: Which questions go upfront*
> We determined which questions were needed to price a policy versus which could wait for a follow-up call. Fewer required fields upfront means more submissions. The form doesn't ask for everything — just enough to have a real conversation.

---

### Interwoven
**Current:** Short, good
**Direction:** Already tight — minimal restructuring needed. Lead with the inventory challenge.

**Card description:**
> A Shopify store for an Asbury Park boutique with 7,000+ SKUs and a strong brand guide — with no online presence to match.

**Hook:**
> Interwoven had a strong brand and 7,000+ SKUs. They had no online store.

**Context:**
> A boutique clothing store in Asbury Park known for bold merchandising and brand identity.

**What was built:**
> A Shopify store that honored their visual identity while organizing inventory into logical categories by type, occasion, and collection. Replaced Shopify plugins with custom solutions aligned to their brand standards. Branded email automations. Configured for self-service content updates.

---

### Patriae
**Current:** Short, already has strong numbers
**Direction:** The numbers are the hook. Keep it tight.

**Card description:**
> 657% increase in online sales for a handcrafted goods brand that had been selling mostly in person.

**Hook:**
> Patriae was selling handcrafted Eastern European goods mostly in person. The online store needed to feel as considered as the work.

**Context:**
> A founder making handcrafted goods and curated clothing rooted in Eastern European textile traditions — Shopify with custom CLI theming. Clean typography, muted tones, no visual clutter competing with the products. Shopify POS so in-person sales sync with online inventory.

**Outcome:**
> 657% increase in online sales. 137% rise in total orders. 15% boost in average order value. 157% improvement in conversion rate.

---

### Flora & Mar
**Current:** Short, honest about the design collaboration
**Direction:** The constraint is the hook — three products, needed to feel complete

**Card description:**
> Three products, a site that doesn't look like three products.

**Hook:**
> Flora & Mar makes small-batch skincare with three products. The site needed to feel complete, not sparse.

**Context:**
> Minimal, preservative-free ingredients. They needed subscriptions, wholesale accounts, and an aesthetic matching their holistic approach.

**What was built:**
> Shopify with engaging typography, botanical illustrations, and clean layouts. Collaborated on design decisions together. Each product page lists exactly what's in the bottle. Subscriptions, wholesale locator, gift bundles.

---

### Hazel Boutique
**Current:** Short, editability angle is the right frame
**Direction:** Lead with the operational need — four locations, seasonal inventory

**Card description:**
> Shopify rebuild for a four-location NJ fashion retailer — built for a team that updates the site constantly.

**Hook:**
> Hazel Boutique has four locations, shifting inventory, and frequent sales. The site has to keep up with the team, not slow them down.

**What was built:**
> Rebuilt Shopify from scratch during their brand overhaul. Marketing integrations for text and email, favorites and reminders, multi-location inventory tools, analytics, and third-party shipping and performance tracking. Built for editability — the team updates it themselves for seasonal changes and new merchandise.

---

### Cookman Creamery
**Current:** Medium, good
**Direction:** The design process is the story — three style directions, one brief

**Card description:**
> A 10-year anniversary redesign for an Asbury Park ice cream shop — three style directions, full design process, built on Shopify with DoorDash and custom cake ordering.

**Hook:**
> Cookman Creamery is celebrating their 10th year. Their website couldn't handle online orders and didn't capture who they were — an 1890s candy shop vibe with serious vegan offerings.

**What was built:**
> Full design process: user research, three style directions presented for selection, content inventory, mobile-first mockups. Built on Shopify with DoorDash integration, pickup scheduling, custom cake ordering, and a brand guide for colors, typography, and gradients as they expand.

---

### Current Media Company
**Current:** 2 lines — very thin
**Direction:** This may be a project to either expand or deprioritize in the index. As written, there's almost nothing here. Don't fabricate. Keep it brief and honest, or consider whether it belongs on the index until more content exists.

**Card description (if kept):**
> Brand, tools, and operations for a creative studio — website, brand system, and workflow improvements.

**As-is content is fine at this length if the project stays in.** No restructuring needed — it's short because the engagement was limited in scope.

---

## Part 6: Implementation Order

1. ✅ **Create archive directory** — copy all 16 `.md` files before touching them
2. ✅ **CSS: Cover image** — update `project.module.css` and remove the screen overlay div in `[slug]/page.tsx`
3. ✅ **Rewrites: Start with the deep ones** — Moor, INNoVA, CaptureNoire (most content to condense)
4. ✅ **Rewrites: Medium ones** — Offshore, Lisa Says Gah, Train Market, Seed to Sprout, Butcher's Block
5. ✅ **Rewrites: Short ones** — Chomp, Interwoven, Patriae, Flora & Mar, Hazel, Cookman, Current Media, Talulas
6. ✅ **Work index: Add descriptions** — populated all descriptions in `nav.json` (already surfaced by `ProjectCard`)

---

## Part 7: About Page — Separate but Related

The ethos line you mentioned: *we live in a generation of constant change, survival is being creative and exploring timeless solutions.*

Current about page opens with: "Everything is changing faster than anyone can comfortably track. The tools, the platforms, the market — it shifts constantly. The only things that hold up are solutions built on timeless thinking and creativity that meets the moment."

That's close. Tighten it:

> Everything changes faster than anyone can track. Tools, platforms, markets — constantly. What holds up is timeless thinking and creativity that meets the moment. That's what O'Mara Technology is built around.

The rest of the About page is strong. The capabilities grid, bio, and engagement types are all working. The one thing worth considering: move the engagement types (Project / Partnership) higher on the page — they qualify clients faster than the capabilities list does. More on this in a separate plan if you want to take the About page on next.

---

## What NOT to Do

- Don't add new sections that don't exist in the current content
- Don't write new project descriptions from imagination — only from existing copy or what's on the live project site
- Don't template every project the same length — short projects (Patriae, Chomp) should stay short
- Don't remove the decision-making sections from Moor, INNoVA, CaptureNoire — those are the differentiator
- Don't add "Interested in working together?" to the middle of project copy — it already lives in the footer CTA
