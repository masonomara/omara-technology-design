[capturenoire.com](https://www.capturenoire.com)

Photo editing filters are trained on data that underrepresents darker skin tones. CaptureNoire was built to fix that.

An Indianapolis photographer and entrepreneur found that editing software made dark skin look washed out or oversaturated. She had a venture funding pitch at Really, an Indianapolis tech conference. My job was product discovery, research, design, and frontend development — plus managing a graphic designer and a hired backend developer.

I built a native iOS/Android app — a VSCO-style photo editing suite with 60+ Tone Effects across Photo, Video, and AR modes. Subscriptions, profiles, collections, IMGLY for image processing, DeepAR for AR filters.

## Branded terminology vs. usability

"Tone Effect™ Color Grading" positioned the filters as proprietary technology. User testing showed the terminology overwhelmed people. I simplified the labels so they worked across Photo, Video, and AR modes. The branding goal survived; the confusion didn't.

## AR cost more than it was worth

We spent a month evaluating Banuba and DeepAR — testing features, pricing, running demos with their teams. Then IMGLY announced a major SDK update and dropped support for the old version. Two weeks of unplanned migration. In retrospect, AR should have been deprioritized from the start. Early prototyping would have surfaced the complexity sooner.

## Audience

CaptureNoire identified two audiences: professional photographers and content creators of color who need precise tools for color grading, batch editing, and templates — and everyday users who want filters that work for their skin. The architecture needed to be future-proofed for web, desktop, and third-party integrations, not just mobile.

Three user interviews: a self-taught videographer, a hobbyist photographer popular on social media, and a professional wedding photographer. All three preferred desktop tools. We had to match desktop quality or lose the most valuable users.

## Effects library

The 60+ Tone Effects had to be organized, queryable, and scalable — color grading presets, video filters, and AR effects for live camera using DeepAR. Each effect carried metadata for tags, featured status, favorites, recently used, and browsing. I simplified the terminology so it worked across Photo, Video, and AR modes with minimal clicks between them.

## Tech stack

React Native for a single codebase, TypeScript, and Firebase for auth, MFA, database, and storage. The other developer led photo integrations: IMGLY for filters and templates, DeepAR for AR. IMGLY handled complex image processing so we could focus on curating filters.

I built an AuthContext pattern as a single source of truth for authentication and onboarding, a data management system for filtering effects by type, reusable components from my Figma mockups, and multi-provider Firebase authentication.

## Demo and launch

The investor demo at Really went well. Investors were excited by the progress. CaptureNoire gained email signups, web traffic, merch sales, Instagram growth, and a partnership pipeline. Large institutions — nonprofits and educators — expressed interest in ambassador partnerships. Feature requests from the demo validated the initial research: Photoshop and Lightroom presets, and educational content.

CaptureNoire is live on the App Store. Android version in progress.