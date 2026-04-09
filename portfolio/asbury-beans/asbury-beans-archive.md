[asburybeans.com](https://www.asburybeans.com)

Asbury Park is famous for its music scene but notorious for events being scattered across venues, social media, and Facebook pages. Locals miss shows, tourists don't know where to start, and existing solutions — a local radio station's manual list and Google Events — weren't cutting it.

I built Asbury Beans to solve this: an automatic event calendar for Asbury Park that doesn't require manual updates.

![Homepage showing events with FREE badges](/content/projects/asbury-beans/images/screenshot-1.webp)

## Discovery

I interviewed locals and visitors to understand how people found events. I categorized them into five archetypes. Consistently, users just wanted to know what's available for free and hated unreliable information — changed times, cancellations, or late posts.

![User personas](/content/projects/asbury-beans/images/user-reseaerch-2.webp)

I audited competitors to find ideas to remix. The local incumbent had limited features and the same reliability problems that frustrated users. Google Events scraped everything but presented it in a confusing mess. Bandsintown and Songkick excelled at recommendations but focused on concert-goers following specific artists, not locals exploring their town.

![Competitor audit matrix](/content/projects/asbury-beans/images/competitor-audit.webp)

## Technical Architecture

The maintenance problem drove the architecture. Manual calendars die when their maintainers burn out. Asbury Beans needed to update itself.

I built web scrapers using Cheerio that run through Vercel serverless functions on a schedule. Scrapers pull from venue websites, ticketing platforms, and social feeds, then normalize the data and store it in Supabase. The Next.js frontend queries Supabase and renders the calendar.

![User flow diagram](/content/projects/asbury-beans/images/ux-design-1.webp)

This architecture means venues don't need to submit events — their existing web presence feeds the calendar automatically. When a venue updates their website, Asbury Beans updates too.

The admin interface lets me manually add events the scrapers miss and promote featured events. It's a fallback, not the primary content source.

![Search functionality filtering by venue](/content/projects/asbury-beans/images/screenshot-3.webp)

## Outcomes

The site launched and immediately became useful. Locals shared it with friends. Venues appreciated the free promotion. The FREE badge feature drove engagement — users specifically mentioned filtering for free events when deciding between a quiet night in and going out.

![Event listings with FREE and FAVORITE badges](/content/projects/asbury-beans/images/screenshot-2.webp)

What I'd do differently: build venue partnerships earlier. The scrapers work, but direct data feeds would be more reliable. Some venues have inconsistent web presences that make scraping fragile.

The project taught me how to structure a research-driven process from interviews through personas through user flows through implementation. It also taught me that the hardest problem isn't building the product — it's keeping it alive. Automation was the right bet.
