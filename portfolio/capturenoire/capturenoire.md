[capturenoire.com](https://www.capturenoire.com)

An Indianapolis photographer and entrepreneur asked us to build a better photo editor for darker skin tones. She found that editing software and filters are trained on datasets that underrepresent darker skin tones, making it look washed and overly. She experienced "filters making dark skin look washed out or overly saturated".

We built a native iOS/Android app — a VSCO-like photo editing suite designed for darker skin tones and cultural features. The demo was for CaptureNoire's venture funding pitch. I handled product discovery, research, design, and frontend development. A graphic designer worked in-house. I hired a developer to build the backend.

![Two women with phone displaying the app's crop tool](/content/projects/capturenoire/images/capturenoire-marketing-1.webp)

## The Audience

CaptureNoire identified two audiences - there are professional photographers and content creators of color who need precise tools for color grading, batch editing, and templates — and everyday users who just want filters that work for their skin. CaptureNoire wanted to integrate with larger photo editing services. So the architecture needed to be future-proofed for web, desktop, and third-party integrations — not just mobile. The business model had to be focused on users while considering future partner revenue streams like app subscriptions, desktop preset sales (LUTs), and B2B licensing.

## User Research

I interviewed three users: a self-taught videographer, a hobbyist photographer popular on social media, and a professional wedding photographer. All three preferred desktop tools. We had to match desktop quality or lose our most valuable users.

My research also showed that every new editing suite has a learning curve —users struggle to apply filters correctly. How do you manage blues and purples in color grading? How do you edit just one person in a photo? How do you handle different file types? We had to plan for all of this. I considered pivoting to a desktop app, but we had to deliver what we promised shareholders.

I mapped user archetypes and journeys from discovery through onboarding to endgame.

![Mobile screens showing sign up, login, and verification flows](/content/projects/capturenoire/images/onboarding-mockups-1.png)

## Effects Library Architecture

The 60+ Tone effects had to be organized, queryable, and scalable. Effects included color grading presets, video filters, and AR effects for live camera using DeepAR. Each effect had metadata for tags, featured status, favorites, recently used, and browsing like a "Netflix library for filters".

The branded terminology — "Tone Effect™ Color Grading" —positioned the filters as proprietary technology. However, user testing showed the terminology overwhelmed people. I simplified the terminology so it worked across Photo, Video, and AR modes. Users could toggle between modes from most screens with minimal clicks.

![App screens showing filter homepage, user collection, and filter detail](/content/projects/capturenoire/images/mockups-1.png)

## Prioritizing Features

The feature list needed to balance launch requirements with room to grow. I prioritized SSO authentication, payment processing (free trial, monthly, annual), a Netflix-like homepage with Photo/Video/AR tabs, and effect groups (favorites, recently used). We built profiles with collections, drafts, and templates—features users wanted most—plus photo/video editor integration.

We deprioritized light mode (users preferred dark), music integration, creator directory, and graphic overlays.

## Service Blueprint

With features set, I worked with a developer to choose the tech stack. We chose React Native for a single codebase, TypeScript, and Firebase for auth, MFA, database, and storage.

The other developer led photo integrations, choosing IMGLY for filters and templates, and DeepAR for AR. IMGLY handled complex image processing so we could focus on curating filters.

## Information Architecture

I documented 28 user flows in Figma with high-fidelity mockups for developer handoff. Flows covered authentication, email verification, subscription management, content creation, organization, and AR. I prepared state diagrams and a data architecture to clarify how data would be queried. This included data types, schemas, and component states.

![App screens showing photo collections, drafts, and profile pages](/content/projects/capturenoire/images/mockups-2.png)

## Visual Design

I prioritized business decisions like the Photo/Video/AR toggle on the homepage to showcase the range of features. Warm tones reinforced the branding—browns that didn't distract from a Lightroom-like feel. Working with the graphic designer, I developed a color system, typography, and a responsive component library.

![Design system showing color palette, UI colors, and text hierarchy](/content/projects/capturenoire/images/components-2.png)

## Technical Architecture

I built the frontend foundation while the hired developer focused on AR integration. I built an AuthContext pattern as a single source of truth for authentication and onboarding, including the user schema. I created a data management system for filtering effects by type on the homepage. I developed reusable components from my Figma mockups for the other developer to use, and set up multi-provider Firebase authentication.

![Grid of loading state screens with spinners and skeleton UI](/content/projects/capturenoire/images/components-1.png)

AR proved challenging. We spent a month evaluating Banuba and DeepAR—testing features, pricing, and demoing with their teams.

IMGLY announced a major SDK update and dropped support for the old version. This added two weeks as we migrated to the new SDK for better future support.

In retrospect, we should have deprioritized AR from the start. Early prototyping would have revealed the complexity sooner.

## Project Demo

SDK delays slowed us down. We reorganized for the investor demo at Really, an Indianapolis tech conference. I prepared Figma mockups, screen recordings, and Instagram AR filters showcasing the brand. Investors received the message well and were excited by the progress. CaptureNoire gained email signups, web traffic, merch sales, Instagram growth, and a partnership pipeline.

At the demo, large institutions—nonprofits and educators—expressed interest in ambassador partnerships. This validated the mission. Feature requests validated our initial research: Photoshop and Lightroom presets, and educational content. We also learned that video should be the highest priority.

## Launch

The app launched with 60+ Tone Effects in Photo, Video, and AR categories—each with metadata for discovery and attribution. We integrated IMGLY CreativeEditor SDK and DeepAR, a subscription model, profiles, and collection-based organization.

CaptureNoire is live on the App Store. The Android version is coming. Community resources, grants, and educational content are expanding CaptureNoire from an app into a platform. The codebase reflects that—a solid foundation built for maintainability and growth.

The project demonstrated a common startup pattern: building the product is just the beginning. Distribution, partnerships, and sustainable funding determine whether the tool reaches the creators who need it.

![Two phones showing adjust and filter tools with jazz band background](/content/projects/capturenoire/images/capturenoire-marketing-2.webp)

![Two phones showing photo library and crop tool on grayscale background](/content/projects/capturenoire/images/capturenoire-marketing-3.webp)
