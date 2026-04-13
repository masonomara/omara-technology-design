[moorcrew.com](https://moorcrew.com)

Yacht staffing still runs on a free job board that looks like it was built in 1993. Moor set out to replace it.

The industry is a mess: agencies earn placement fees by volume, not quality — crew called them "CV-pushers." The Moor team had a yachting expert with 500,000 followers and three months before the Fort Lauderdale International Boat Show. A [yachting tragedy](https://www.cbsnews.com/miami/news/murder-south-african-stewardess-superyacht-fort-lauderdale/) made staff safety a recurring topic in user interviews. I learned safety issues happen more often than reported.

I built a two-sided matching platform — crew browse jobs, employers browse crew. Browse-apply-accept. Matching algorithm, real-time chat, subscription payments, and the full infrastructure. Built in Next.js and Supabase.

## Website before app

Everyone wanted a mobile app. I recommended website first. At FLIBS, I found a bug while demoing to a staffing agent and fixed it in an hour in a tent. Native would've made that impossible. After launch, a credentials verification service reached out to partner — the integration required refactoring that would've cost far more on mobile.

## Approximating matching through design

Yacht staffing is a [stable matching problem](https://masonomara.com/essays/stable-matching-problems) — two sides need to accept their matches. I looked at [Gale-Shapley](https://en.wikipedia.org/wiki/Gale–Shapley_algorithm), the Nobel Prize algorithm that matches 40,000 medical residents to hospitals annually. The problem: Gale-Shapley assumes complete, static rankings executed once. Yacht jobs post and fill daily. I couldn't solve it algorithmically with incomplete information, so I approximated matching through design: a scoring system (Moor Score + Job Compatibility Rating) that presents quality-ranked shortlists, then lets users decide through browsing, applying, and accepting.

The Moor Score totals 100 points — profile completeness, application quality, employer engagement, job status. The Job Compatibility Rating totals 125 points across position, salary, certifications, experience, geography, languages, cultural fit, and boat type. New users get a neutral 50% baseline until three applications.

## Conversations threaded by person, not by job

Each application could have had its own conversation thread. Yacht staffing involves relationships that span multiple seasons — same crew, different jobs. Threading by person keeps history intact when someone applies again. I added job cards that travel into the chat so context stays with the conversation.

## Discovery

Two multi-hour whiteboard sessions with the Moor team using the [8-Element context framework](https://masonomara.com/8-element-context-framework) mapped users, interfaces, actions, business needs, goals, and rewards. Moor's primary goal was acquiring users and building trust — revenue mattered, but the platform had to earn trust in an industry skeptical of new platforms first.

Traditional agencies take 8%+ from crew salaries as hidden commissions. Moor charged memberships and flat fees ($8–$199). This flips the incentive: Moor profits when users find good matches, not when extracting the highest finder's fee.

## Users

Discovery revealed three crew segments: freelancers seeking quick placement, permanent crew pursuing full-time roles, and entry-level dayworkers breaking in. Mid-level crew emerged as the sweet spot — experienced enough to hire but not connected enough for word-of-mouth alone.

Employers fall into four groups: staffing agencies managing multiple vessels, charter operators, yacht owners wanting curated shortlists, and senior crew handling hiring. Each group shared three frustrations: unvetted CVs, high turnover, and scrambling to find crew a week before charter.

## Competitors

The largest yacht job platform, [Daywork123](https://www.daywork123.com/DayWork.aspx), hasn't updated since the early 2000s — its HTML looks like 1993, yet it dominates. Free, established, and captains trust it. No verification, no quality control, no messaging, no search. This demonstrated that low friction beats features.

## Features

I scored 40+ features on an [impact-resources matrix](https://masonomara.com/essays/impact-resources-matrix.md). Seven categories emerged: CORE (launch essentials), TRUST (verification), MESSAGES, EMPLOYER, CREW, REVENUE, POLISH. CORE became the launch roadmap: OAuth login, job filtering, geographic search, mobile-first design, profile management, simple job posting, Stripe integration, one-click applications, in-app messaging.

## Browsing over swiping

Dating apps profit from engagement loops and withholding information. Moor users operate differently — intense engagement for two months during hiring season, then gone. Moor had to feel genuinely useful, not addictive. That meant browse-apply-accept: show all options, create abundance. Airbnb became the model.

## Ports

The [NGA World Port Index](https://msi.nga.mil/Publications/WPI) catalogs 3,818 ports worldwide. I built a Playwright scraper to extract this data, sorted ports into regional groupings, and surfaced popular ports — Monaco, Fort Lauderdale, Antibes — to the top. Alphabetical dropdowns frustrated users for common destinations.

## Architecture

Crew and employers needed parallel experiences. Same navigation, same patterns, different content. A dual-role architecture where users could switch between crew and employer modes — symmetry in the UI meant symmetry in the data.

Conversations needed threading logic: by job or by person. Job-based threading seemed logical. But staffing involves relationships across multiple positions. Personal threading wins — history stays intact, and jobs shared in chat are highlighted and easily accessible.

Boats belong to employers but live as separate database records, so an employer creates a boat once and reuses it across jobs.

## Payments

Employers: free Starter, Urgent Hiring ($199/7 days or $299/14 days), or Professional ($299/month or $750/quarter). Crew: free Starter or Profile Spotlight ($15 for 90 days). Stripe's embedded checkout kept payments seamless.

## Launch

Moor is a [two-sided market](https://en.wikipedia.org/wiki/Two-sided_market): neither side shows up until the other already has. Moor's social following was mostly crew, so we targeted them first with coupon codes for premium features.

By the first weekend at Fort Lauderdale, Moor had 500+ users, 50+ paying customers, and active crew-employer conversations.