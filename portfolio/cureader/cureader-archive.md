[cureader.app](https://www.cureader.app)

I built Cureader to learn React Native and to encourage myself to read more. I struggled to find good sources. Most of my content came ranked by engagement — stuff I clicked on impulse, not what I actually wanted to read. Feeds built on engagement hooks aren't how I want to spend my scroll time. I wanted it decentralized. RSS seemed like a perfect fit because content was published independently, not tied to monetization. I wanted Cureader simple enough for everyone — a passive stream of content you actually enjoy reading, free from engagement algorithms.

![Cureader app showing categories and feed discovery](/content/projects/cureader/images/cureader-marketing-2.webp)

The biggest obstacle was finding an audience. I found RSS power users who had built their own custom feeds and loved their current tools, and then users who didn't know what RSS was. I focused on building for beginners first, developing a strong foundation before looking to accommodate power users. I wanted Cureader to feel mindful, avoiding emotional triggers or gamification techniques.

## App Design

I used standard interaction patterns. I designed within my development skills rather than committing to ideas I couldn't build. I kept the UI simple and familiar — nothing experimental.

I lacked custom components for headers and nav bars. Now I can build those. My React Native skills limited how much I could experiment with interaction patterns.

## App Development

I started developing with Expo but hit issues with Redux, customization, and dependencies. I ditched Expo too late in the project. I kept parsing on-device — lighter than expected, though I always knew I might need to move it to the backend. The parsing limits were clear from the start. Replacing the parser never seemed too hard. I kept Expo to publish to the app store, but stopped designing around it. Expo limits scalability. Given what I've learned, I'd restart rather than improve the existing codebase.

![Article feed view and user profile with subscriptions](/content/projects/cureader/images/cureader-marketing-3.webp)

Knowing I'd eventually need to rebuild the backend discouraged me from continuing. Supabase worked well: simple auth, cheap database, and I already knew Postgres. RSS Parser (NPM) saved me a lot of time. I started with Swift and only had an iPhone for testing. I tested briefly on Android but rushed to market without full Android support.

When I hit state management issues, I saw that React Redux and Expo wouldn't mix well. I needed a major overhaul.

The hardest part was syncing state between subscriptions and the frontend — waiting for database writes, then passing results back. I should have used React Query or Redux. I didn't anticipate the problem, so I made hacky fixes rather than rebuild the app context. From a frontend view, RSS sources had less uniformity than I expected — and worse feed quality. I let users edit feed photos, descriptions, and titles. Some feeds had names like "newyorktimes.com | New York Times | RSS Feeds | Most Popular" — hard to scan in a list. I hardcoded hacks to handle character encoding and other quirks. At launch, users couldn't find relevant feeds. So I manually tagged every new resource. This got exhausting fast — something AI could do. The content quality was lower than I expected. I added about 70 feeds myself. Users subscribed to the popular ones. There was no trending feature, little topic sorting — new users couldn't find relevant content.

State management struggled most with subscriptions and feed updates. Feed structures varied wildly. Many were poorly maintained or deprecated. I let users suggest new titles and photos for feeds — a necessary feature.

## User Feedback

I tracked three metrics: signups, users who subscribed to a feed, and users who saved an article.

User interaction was simple. No one struggled with it — no glaring issues, though room to improve. Next time I'd build a stronger backend and offload parsing and caching.

Given my skills at the time, the user flows held up well. Search either found an existing resource or added a new one automatically. The Supabase connection was messy, but it worked — except for some state display bugs.

My assumptions about RSS as fair, mindful content delivery held up. I enjoyed using the app. The content felt unbiased and interesting — I didn't feel like I missed anything.

Most feedback came from people already into RSS. Common question: "Where did you find all your feeds?" As expected, the biggest issue was helping new users discover feeds.

![TED Blog feed page and saved bookmarks screen](/content/projects/cureader/images/cureader-marketing-1.webp)

## Retrospective

Manual tagging took more work than I expected. I wish I'd planned tagging automation from the start. Storing feed data on-device was lightweight but some parts would have scaled better on a backend. Next time, I'd build reporting alongside any automation.

I'd spend more time on the backend or rebuilding state management. I rushed to market, then faced breaking changes for future updates. I wish I'd added better analytics.

I learned a lot about React Native. I'd now expect less uniformity from web data sources.

Next version: more headlines, fewer photos. Show more headlines so users can scan quickly. Photos as accent, not focus. I learned this from research, not user feedback.

RSS was the right choice. When feeds work, they're great — but they come with issues. It's safer than building a platform where users generate content just for the app. Future versions should: improve feed quality, better explain RSS to users, and boost discoverability.

## Future AI Integrations

AI would solve several key problems. First: consistent data organization. AI could fill gaps, adjust content, tag feeds and articles by topic, and eventually power recommendations. AI could enable search by topic rather than just headline. I prioritized feed recommendations over story recommendations to avoid engagement bait. I'd like to add AI carefully, weighing how to avoid engagement-driven design. Discovery could be AI-driven, but main timelines should stay chronological, not popularity-ranked.
