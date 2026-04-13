[theinnovasolution.ca](https://www.theinnovasolution.ca)

INNoVA had four PDF flowcharts containing hundreds of expert accessibility recommendations. No one could query them.

An accessibility consulting firm based in Toronto needed a mobile app in two months. They had expert content — workplace ergonomics, digital accessibility, mental wellness — structured as branching decision paths across PDFs. No one could query "recommendations for someone who works standing, uses a laptop, and has wrist pain." The challenge was turning unstructured expertise into data, then building the app on top of it. The two-month project became 18 months.

I built a React Native app (iOS and Android) with 900+ questions across 13 workplace environment modules, a subscription model, organizational onboarding via company codes, and an automated content pipeline so INNoVA's team can update recommendations in Excel without touching code.

## TSV as content format

INNoVA's content team could write recommendations but couldn't work with JSON or databases. Every update funneled through me — a bottleneck I had to remove. I chose TSV as the source format because it opens natively in Excel and Google Sheets. Node.js scripts convert TSV files into Firebase-ready JSON. Content experts stay in their comfort zone; the pipeline handles the rest.

## Attributes over binary flags

The original system produced 50+ isolated logic checks per user — yes to Q173, no to Q194 — repeated forty or more times. Every new recommendation required manually mapping every answer combination. This didn't scale.

I proposed six attributes instead: Compliance, Communication, Awareness, Engagement, Inclusivity, Proficiency. Score users on a spectrum. Map recommendations to attribute combinations. Fifty puzzle pieces reduced to six signals. The architecture was defined; implementation proved too dependent on content resources to complete during my engagement.

## The social model of accessibility

INNoVA did workplace accessibility consulting following the [social model of accessibility](https://en.wikipedia.org/wiki/Social_model_of_disability) — the environment creates barriers, not the person. That shaped how I worded questions and presented options. Every question needed "None of the above" because users shouldn't be forced into categories that don't fit. If a feature felt like a medical intake form, we cut it.

I applied [WCAG AAA](https://www.w3.org/WAI/WCAG21/quickref/) and built a color system using [Stripe's accessible color methodology](https://stripe.com/blog/accessible-color-systems). Mental health content required care — crisis resources placed prominently, recommendation language softened.

## Data architecture

I converted the four PDF flowcharts into 900+ questions handling conditional routing, recommendations, and resources across four categories. Answers to Question A determined whether users saw Question B, skipped to D, or triggered specific recommendations. Every record needed an explicit ID. Foreign key arrays defined relationships. Prerequisite fields enabled conditional logic.

The content became 13 workplace environment modules across four categories: Physical Ergonomics, Digital Accessibility, Mental Wellness, Behavioral Change. Stored across 10 interconnected tables containing over 900 records.

## Enterprise features

What started as a single app branched into four versions: SPHERE Personal (free tier), SPHERE Social (community and nonprofits), SPHERE Learning (educational institutions), and SPHERE Enterprise (governments, banks, insurance companies — nine government departments trialing). Enterprise clients onboard employees through company codes linked to their organization; employers see aggregate analytics and employees receive company-specific recommendations.

## Gamification strategy

In February 2025, INNoVA flew me to Toronto for a working session and client roundtable. Direct questions got direct answers — features I'd assumed were working weren't, features I'd dismissed as edge cases were daily pain points.

I produced three deliverables using [Yu-Kai Chou's Octalysis framework](https://yukaichou.com/gamification-examples/octalysis-complete-gamification-framework/): a Gamification Report mapping features to psychological drivers, a 49-page Ideas Deck drawing references from Duolingo, LinkedIn Games, Spotify, and Reddit, and a Feature List that scored 38 features on an impact-resources matrix. From those 38, 18 were selected for a 12-month roadmap.

Octalysis gave stakeholders a shared vocabulary. Marketing wanted viral mechanics. The accessibility team wanted educational content. Management wanted "engagement" without defining it. Saying "this feature hits core drives 2 and 4" opened a different conversation than "I think users would like this."

## Launch

The app shipped to the App Store and Google Play in June 2024. The MVP hypothesized that users would complete 800+ question assessments, that personalized recommendations would create value, and that a non-clinical approach to accessibility would resonate. INNoVA tested those hypotheses through demos with existing clients, prospective partners, and government contacts.

979 structured records across 10 interconnected tables. 144 personalized recommendations and 148 external tools and resources per module. Nine government departments trialing the enterprise version. The gamification framework, ideas deck, and prioritization matrix outlasted the code itself as strategic tools for the team.