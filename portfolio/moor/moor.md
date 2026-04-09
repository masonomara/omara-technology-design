[moorcrew.com](https://moorcrew.com)

The Moor team set out to build the "Hinge for Yacht Staffing", an app for matching crew to yacht jobs through a matching algorithm. The team included a yachting expert with 500,000 social media followers, which provided invaluable first-hand accounts from crew, employers, and others in the staffing process.

Yacht staffing is a mess and the industry is growing. Every staffing season is a scramble for new crew. Employers face higher stakes — problems at sea ruin charters or endanger passengers. During the project, a [yachting tragedy](https://www.cbsnews.com/miami/news/murder-south-african-stewardess-superyacht-fort-lauderdale/) made staff safety a recurring topic in user interviews. I learned safety issues happen more often than reported.

Traditional yacht staffing agencies earn placement fees, incentivizing volume over quality. Crew and employers called them "CV-pushers." Moor wanted memberships and flat fees that rewarded successful matches.

I had three months to build before the [Fort Lauderdale International Boat Show](https://www.flibs.com/). By the first weekend's end, Moor had 500+ users, 50+ paying customers, and active crew-employer conversations.

![Hero — Discover browse grid, mobile, showing abundance](/content/projects/moor/images/1-hero-shot.png)

## Discovery

I ran two multi-hour whiteboard sessions with the Moor team, mapping users, interfaces, actions, business needs, goals, and rewards using the [8-Element context framework](https://masonomara.com/8-element-context-framework).

I discovered Moor's primary goal was to acquire users and build trust. Revenue mattered, but the website first had to earn trust in an industry skeptical of new platforms.

Pricing was central to Moor's positioning. Traditional agencies take 8%+ from crew salaries as hidden commissions. Moor was designed for memberships and flat fees ($8–$199). This flips incentives: Moor profits when users find good matches, not when extracting the highest finder's fee.

The team brought built-in credibility: 500,000 followers, boat show presence, and existing relationships.

## Crew Members

Discovery revealed three crew segments: freelancers seeking quick placement, permanent crew pursuing full-time roles, and entry-level dayworkers breaking in.

Mid-level crew emerged as the sweet spot — experienced enough to hire but not connected enough for word-of-mouth alone. After launch, the $15 90-day profile spotlight proved more popular than expected. We deprioritized premium features for senior crew and focused on mid-level crew and employers.

## Employers

Employers fall into four groups: staffing agencies managing multiple vessels, charter operators running commercial programs, yacht owners wanting curated shortlists, and senior crew handling hiring. Each group operates differently but shared three frustrations: agencies pushing unvetted CVs, high turnover, and scrambling to find crew when someone drops out a week before charter.

## Competitors

The largest yacht job platform [Daywork123](https://www.daywork123.com/DayWork.aspx) hasn't updated since the early 2000s — its HTML looks like 1993, yet it dominates. Why? It's free, established, and captains trust it. There's no verification, no quality control, no messaging, no search. This demonstrated low friction beats features.

![Daywork123 screenshot](/content/projects/moor/images/32-daywork-screenshot.png)

[FindACrew](https://www.findacrew.net/) targets recreational sailors with $25/month verification. Works for hobbyists, feels unresponsive and underqualified for professionals.

[Bluewater](https://www.bluewateryachting.com/) targets the high-end market with a full-service suite. They operate on 8% commission with quality screening. They built an incognito mode I emulated, but their model doesn't scale.

Traditional yacht staffing firms have established relationships with employers, but rely on slow workflows, overhead, and limited candidate pools. Human touch matters for some placements, but often it's just unnecessary friction.

## The Stable Matching Problem

Yacht staffing is a [stable matching problem](https://masonomara.com/essays/stable-matching-problems). Two groups — crew and employers — need to be matched, and both sides need to accept their matches.

We first identified [Gale-Shapley](https://en.wikipedia.org/wiki/Gale–Shapley_algorithm) for algorithmic sorting. Gale-Shapley is a Nobel Prize-winning algorithm proving that under certain conditions, stable matchings can always be created between two groups. The [National Residency Matching Program](https://www.youtube.com/watch?v=yieyXPdsdsk) matches 40,000+ residents to hospitals annually using modified Gale-Shapley. The parallel to yacht staffing felt perfect.

Gale-Shapley assumes static, complete rankings from each side, executed once all lists are collected. Yacht jobs don't work that way — jobs post and fill asynchronously. Users can't rank entire pools when new crew and jobs appear daily. Yacht staffing is a dynamic market with incomplete information, not a static clearinghouse.

I couldn't solve matching with incomplete information algorithmically, so I approximated it through design. Instead of Gale-Shapley, I built a scoring system (Moor Score plus Job Compatibility Ranking) presenting quality-ranked shortlists, then let users decide through browsing, applying, and accepting.

![Matching diagram — crew preferences left, job requirements right, arrows pairing](/content/projects/moor/images/3-matching-diagram.png)

## Designing the Algorithm

I designed onboarding around "browse-apply-accept." The algorithm scores how well each crew member fits a new job, runs when an employer posts, and creates a shortlist of best candidates.

I mapped crew and employer needs into paired onboarding questions:

- "What positions are you qualified for?" → "What position are you hiring?"
- "What's your minimum salary?" → "What's the salary range?"
- "What certifications do you hold?" → "What certifications are required?"
- "What's your experience level?" → "What experience level do you need?"
- "What ports are you available from?" → "Where does the job depart?"
- "What languages do you speak?" → "What languages are required?"
- "What's your social atmosphere preference?" → "What's the boat's atmosphere?"

Users hated long profiles and expected free service, so most fields stayed optional. The algorithm only needed enough data for good matches.

## Website over Mobile App

Everyone wants a mobile app — it feels like the top rung of the digital product ladder. But we had a tight timeline, and our primary goals were establishing credibility and getting users on the platform to test matching. A website could build a roster, prove credibility, and spark partnerships sooner. I recommended website first, then app with real feedback to help define it.

Mobile apps slow you with App Store review cycles and require separate iOS/Android codebases. At FLIBS, I found a bug while demoing to a staffing agent and fixed it in an hour in a tent. Native would've made that impossible.

After launch, a credentials verification service reached out to partner. The integration required refactoring that would've cost far more on mobile.

## Prioritizing Features

I brainstormed and scored 40+ features on an [impact-resources matrix](https://masonomara.com/essays/impact-resources-matrix.md).

![Impact-resources matrix](/content/projects/moor/images/31-impact-resources.png)

Seven categories emerged: CORE (launch essentials), TRUST (verification), MESSAGES, EMPLOYER, CREW, REVENUE, POLISH (nice-to-haves).

CORE became the launch roadmap, mapping features including OAuth login, job filtering, geographic search, mobile-first design, profile management, simple job posting, Stripe integration, one-click applications, in-app messaging.

Remaining features were grouped for later implementation. Some features including bulk messaging, AI enhancements were cut entirely.

## "Swiping" vs "Browsing"

Dating apps profit from engagement loops and withholding information. Moor users operate differently — intense engagement for two months during hiring season, then gone. Moor had to feel genuinely useful, not addictive. That meant "browse-apply-accept": show all options, create abundance. Airbnb became my model. Users browse listings, scanning photos, certifications, and bios.

## Style

I studied Airbnb for warmth and community, Hinge for intentionality over endless browsing. The brand voice is casual but credible, speaking to real people making life decisions.

![Style guide — logo, color palette, typography](/content/projects/moor/images/2-style-guide.png)

The brand aimed to feel familiar — like Airbnb, Hinge, LinkedIn — to establish credibility without alienating less technical users. With a mobile app in the pipeline, I designed mobile-first layouts based on familiar flows. Yachting is global, so international appeal mattered. I avoided anything too American in tone or visual style.

## Information Architecture

Crew and employers needed parallel experiences. Crew browse jobs; employers browse crew. Crew apply to jobs; employers "like" crew profiles. When either side accepts, a conversation opens. I borrowed this mutual-match pattern from Hinge — it gives both sides agency and prevents spam before interest is mutual.

I kept the two experiences structurally identical. Same navigation, same patterns, different content. This simplified the database. A dual-role architecture where users could switch between crew and employer modes, so the schemas had to cooperate cleanly. Symmetry in the UI meant symmetry in the data.

![Flow diagram — crew (browse → apply → conversation) mirrored by employer (browse → like → conversation)](/content/projects/moor/images/4-flow-diagram.png)

## Search Filters

Moor needed browsing. We wanted users to scroll through crew and jobs and feel like they had plenty of options. Browsing felt fun. Airbnb had proven the pattern. Users knew "browse-apply-accept" from years of apartment and experience hunting. Discover would let the algorithms shine and provide a quick, easy way to find jobs and crew.

I understood some users would be more goal-oriented, so we needed search.

From the Discover screen, users are easily able to search for crew. Some of the "premium" filters were to be paywalled, we had to "dangle" them in front of potential paying customers. I had to decide the ones that were allowed to be used for free.

I modeled search after Airbnb — a guided flow around the three essential questions that employers and crew ask about each other: what is the position/experience, where is the boat located/where are you located, and when does the job start/when can you start. User feedback confirmed these were the right three.

![Search modal (mobile) — guided search with position/location/date](/content/projects/moor/images/5-search-modal-mobile.png)

![Search modal (desktop) — same flow, desktop layout](/content/projects/moor/images/6-search-modal-desktop.png)

## Architecture Decisions

I had to decide where boats belonged: linked to employers, linked to jobs, or standalone. Jobs felt wrong — the same boat hosts multiple jobs over time. Boats belong to employers but live as separate database records. This allows an employer to create a boat once and reuse it across jobs.

Conversations needed threading logic, either by job or by person. Job-based threading seemed logical — each application would have its own conversation. Yacht staffing involves relationships that span multiple positions. Designing for personal relationships won. Threading conversations by person keeps history intact when someone applies to a second job. I threaded conversations by person and added a feature where jobs shared in conversations are highlighted and easily accessible.

## User Flows

I wrote user flows in [Gherkin syntax](https://cucumber.io/docs/gherkin/reference/) — structured scenarios that read like plain English and define exact behavior. Gherkin made flows readable for the Moor team while producing specs precise enough for development.

![Wireframes — medium-fidelity flow documentation from Figma](/content/projects/moor/images/10-wireframes.png)

I documented flows including authentication, job posting, messaging, and payments, then built medium-fidelity wireframes to demonstrate them.

## Development

I built the application with Supabase and Next.js. Supabase handled PostgreSQL, authentication, realtime subscriptions, and file storage. Row Level Security enforced authorization at the database layer.

Additional tools were mapped out: TanStack React Query for data fetching, Zod for API response validation, Stripe for payments, React Email with Resend for transactional emails, PostHog for analytics.

Development split into six phases: auth and onboarding, crew profile and job pages, job posting and browsing, job application system, realtime chat, then payments and premium features. Each phase's technical architecture followed the user flows from earlier work.

## Auth

I chose Supabase Auth because it integrates directly with PostgreSQL — no auth middleware needed. OAuth with Google and Apple required minimal configuration. Session management coupled tightly with the database.

Crew and employers had separate roles, set after onboarding. Role-based auth keeps crew and employer data separate. Data is gated by role at the database level, simplifying the frontend — no permission checks on render.

## Onboarding

Daywork123 proved low friction drives adoption. I kept mandatory fields minimal. Passwordless login reduced friction further and was well-praised. Users could easily edit skipped data from their profiles after onboarding. The matching algorithm assumed neutral defaults for incomplete fields so new users wouldn't be penalized.

![Onboarding step (crew) — minimal required fields](/content/projects/moor/images/8-onboarding-step-crew.png)

![Onboarding step (employer) — parallel screen](/content/projects/moor/images/9-onboarding-step-employer.png)

Each onboarding question mapped to the matching algorithm. Every crew field — positions, salary, certifications, experience, ports, languages, social atmosphere — has a corresponding employer field. These pairs fed into Moor Scores and Job Compatibility Rankings.

One caveat: only profiles with photos appear on Discover, creating that feeling of abundance when someone first checks the app. Profiles without photos still appear in search to avoid penalizing them further.

## Profile Pages

Moor needed profiles to reveal more than traditional resumes could. What someone fills in, what they skip, which badges they display — each choice signals something about jobs and crew.

![Crew profile (complete) — photo, badges, certifications, bio, map](/content/projects/moor/images/11-crew-profile.png)

![Crew profile (card view) — how profiles appear in browse grid](/content/projects/moor/images/12-crew-profile-cards.png)

I showed early designs to captains and crew. Their feedback shaped hierarchy and layout — what they scrolled to check first. Photos and maps made profiles feel complete.

## Employers Creating Jobs

Job creation followed onboarding's pattern: comprehensive options, most fields optional. Only position and departure port required. Users create and edit boats inline. Employers can skip everything else and fill in details later.

![Job creation form — comprehensive options, most optional](/content/projects/moor/images/13-job-creation-form.png)

![Job post (published) — completed job listing](/content/projects/moor/images/14-job-post-published.png)

Employers asked for custom screening questions during discovery. I added two optional open-ended questions. Applicants would be required to answer them and their responses appear alongside applications and in chat history.

## Application System

The application system needed to feel intuitive from both sides. Crew browse jobs, save favorites, apply with cover messages. Employers browse candidates, save promising ones, tap "like" on crew they want to recruit. I connected these two experiences into one coherent flow.

![Crew applying to job — application modal with cover message](/content/projects/moor/images/16-crew-applying-to-job.png)

![Employer viewing applicants — list with ranking](/content/projects/moor/images/17-employer-viewing-applicants.png)

Crew and employers could view, edit, and delete their job posts and applications. When employers accepted applications or crew accepted likes, cover messages and intros transferred into chat history along with relevant job postings. Notifications triggered for new and accepted applications and messages.

On the backend, I stored applications as arrays on job posts rather than a separate junction table. This simplified queries and made applicant counts easy to display. Functions like `add_applicant_to_job` and `accept_applicant` handle state transitions and prevent race conditions when multiple employers review the same candidate.

## Live Chats

Chat was a core feature. Once crew and employers matched, they needed a safe channel to communicate. I built messaging with conversations, typing indicators, read receipts, file sharing, and job post sharing.

![Chat with job card — shared job post highlighted](/content/projects/moor/images/20-chat-with-job-card.png)

Supabase Realtime handled near-instant updates and polling every 60 seconds served as backup. Polling sounds old-fashioned, but it's reliable when internet conditions are spotty.

Each conversation tracks related jobs. Message types: text, images, files, system messages, and job post cards. Conversations can be archived but never deleted — protecting both parties with records and documentation.

## Implementing the Matching Algorithm

Two algorithms work in tandem. The "Moor Score" measures crew quality, hidden from users to prevent gaming. A cron job updates scores daily; individual scores update on account creation or edit.

The "Job Compatibility Rating" measures how well a crew member fits a specific job. Like the Moor Score, it is also hidden and updated daily. When employers view applicants, candidates sort by compatibility across two tiers: spotlight profiles rise to the top by payment plan, then Moor Score determines ranking within each tier. Paying users gain visibility, quality still determines position among peers.

![Employer applicant view — candidates with ranking, spotlight profiles at top](/content/projects/moor/images/22-employer-applicant-view.png)

The Moor Score totals 100 points across four categories:

- Profile completeness: 35 pts — photos, bio, certifications
- Application quality: 30 pts — accepted applications divided by total applications
- Employer engagement: 25 pts — active conversations, message request success, recent activity
- Job status: 10 pts — currently employed, actively seeking, incognito

The Job Compatibility Rating totals 125 points across ten categories:

- Moor Score baseline: 15 pts
- Position match: 45 pts — primary position weighted higher than secondary
- Salary compatibility: 15 pts — exact matches, negotiable rates, compatible ranges
- Required certifications: 25 pts — percentage of required certifications held
- Experience level: 15 pts — includes overqualification logic, experienced crew applying to entry-level roles receive reduced points
- Geography: 12 pts — exact port match earns full points, same country earns partial
- Languages: 10 pts
- Cultural fit: 10 pts — social atmosphere preferences
- Boat type, size, couple status: 8 pts

New users get a neutral 50% baseline until three applications. The algorithm didn't need perfection — we'd refine it based on real data from the website.

Social atmosphere questions became a unique selling point. We emphasized them in marketing because no other platform weighted rankings by social fit.

## Pricing and Stripe

Moor charges employers and crew separately. Employers have three options: free Starter, Urgent Hiring ($199/7 days or $299/14 days), or Professional ($299/month or $750/quarter).

![Pricing page (employer) — Starter, Urgent Hiring, Professional tiers](/content/projects/moor/images/24-pricing-page-employer.png)

Crew have two options: free Starter or Profile Spotlight ($15 for 90 days). Stripe's embedded checkout kept payments seamless and signaled that payment data stays secure. Webhooks track payment status, renewals, and failed charges.

![Checkout flow — Stripe embedded checkout](/content/projects/moor/images/26-checkout-flow.png)

Checkout handled one-time payments (urgent hire, spotlight) differently from subscriptions (pro monthly/quarterly). One-time plans calculated `planExpiresAt` at purchase. Subscriptions stored metadata (`plan`, `customerId`, `customerEmail`) so webhooks could track status over time. Payment records lived in a separate table linked to user profiles — simpler duplicate detection, better security.

On payment submission, the client polls Stripe's session status until confirmation, then redirects to success or failure. Stripe's webhook handler processes results: payment successes, subscription lifecycle events, invoice renewals, failed charges. Users can cancel subscriptions immediately or schedule cancellation at renewal.

## Ports

Building the port selector required cross-referencing sources. The [NGA World Port Index](https://msi.nga.mil/Publications/WPI) catalogs 3,818 ports worldwide. I built a Playwright scraper to extract this data, then sorted ports into regional groupings.

Crew and employers think about ports differently. Crew select multiple departure ports — they can join from various locations. Jobs link to a single port — a job starts in one place. The matching algorithm scores this asymmetry: exact port matches earn full points, same-country matches earn partial.

The team assigned each port to an itinerary. Mediterranean Itineraries covers Monaco, Antibes, Palma de Mallorca, Greek islands. Caribbean Itinerary includes St. Maarten, Antigua, Virgin Islands.

I saw alphabetical dropdowns frustrated users for common destinations. I surfaced popular ports — Monaco, Fort Lauderdale, Antibes — to the top.

![Port selector — dropdown with popular ports at top](/content/projects/moor/images/27-port-selector.png)

## Launch

Moor is a [two-sided market](https://en.wikipedia.org/wiki/Two-sided_market): neither side shows up until the other already has. Moor's social following was mostly crew, and crew had less onboarding friction, so we targeted them first with coupon codes for premium features.

The site launched at Fort Lauderdale International Boat Show. I attended with the team to demo to crew and employers, running scheduled and guerilla interviews throughout the show. 500+ crew members signed up at the event — a complete success. We immediately got valuable feedback and started planning next features with a mobile app in the pipeline.

![FLIBS team photo — human moment from boat show](/content/projects/moor/images/29-flibs-photo.png)
