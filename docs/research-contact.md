# Contact Page Research — O'Mara Technology

## The Two References

---

### Scope Labs — scopelabs.com/contact

**What they do well:**
- Gets to the point. Headline is "Get in touch," subhead is one sentence. No ceremony.
- The service category structure (Startups / Enterprise / AI Services with sub-options) does real work — it filters intent without asking for a paragraph. You arrive knowing they handle both early-stage and scaled clients.
- Testimonials below the form are smart placement. By the time you've read the form, you see proof. It earns trust without front-loading it.
- The email fallback is present. They don't hide it.

**What they do badly:**
- "Tell us about your company and what you're looking for — we'll get back to you shortly." This could be on any agency's contact page in the world. Zero personality.
- "Company name" as a required field is a red flag for small clients, freelancers, or people in early idea stage. It signals corporate orientation before anyone speaks.
- The testimonial section is long. It reads like a brochure appended to a form. Feels like an upsell when you're already trying to reach out.
- The whole page is robotic and transactional. It asks you to fill out a form without making you feel like anyone's actually waiting on the other end.
- No wit. No warmth. No sense of who Scope Labs is as people. You could swap the logo and nothing would change.

**Tone verdict:** Professional but impersonal. They speak the language of enterprise software buyers. Useful to study for what fields matter; not useful to copy.

---

### Self Aware Studio — selfaware.studio (contact form via screenshots)

**Structure breakdown:**
The form is written as a letter. It reads:

> Dear Self Aware,
> My name is ___ and I am ___ at ___.
> We're looking for [shapes to select].
> Tell us more... [textarea]
> Our budget ranges from [slider].
> Our target launch is ___.
> You can reach me at ___.

**What they do well:**
- The letter format is disarming. It doesn't feel like a form — it feels like you're writing to a real person. That's the whole trick. The psychological lift is significant: you stop being a lead and start being a human.
- "Dear Self Aware" as the opener immediately positions the studio as a recipient, not an institution. There's someone on the other end. This is a small thing with large effect.
- "We're looking for" is excellent framing. It's collaborative — we, not you. It doesn't interrogate. It invites.
- The service category shapes are visual and fun — they break the monotony of a standard form. Even though the drag-and-drop mechanic is too much, the idea of making categories feel tactile and selectable is right.
- Budget slider communicates openness. It says: tell us your range, we're not going to judge you. It normalizes the money conversation early.
- "You can reach me at ___" is the most human version of asking for an email. Vastly better than a label that says "Email."
- The black background, serif type, and loose layout make the whole thing feel designed — like they thought about this, which is evidence that they'll think about your project too.

**What they do badly:**
- The drag-and-drop service categories is over-engineered. It's gimmicky beyond a certain point — selecting your service type shouldn't require spatial interaction.
- The form is very long. By the time you hit the submit button, you've invested heavily. For some prospects, that's commitment; for others, it's abandonment.
- "Other" as a catch-all shape (the wobbly green blob) is cute once but confusing if you actually need it.
- The serif type on black reads well on desktop but gets fragile at small mobile sizes — some of the sentences wrap awkwardly.
- No explicit email fallback visible ("contact forms not your thing?"). That's a missed safety net.

**Tone verdict:** Casual-professional. Designed to attract creative clients and early-stage teams who respond to warmth. The form is written evidence of how they work: thoughtfully, with personality. The risk is that it's too loose for clients who want to feel like they're dealing with a serious technical partner.

---

## The Gap — What O'Mara Technology Needs

O'Mara sits between these two. The goal isn't warmth-over-credibility or credibility-over-warmth. It's both.

The services page already sets the tone correctly:
> "Everything changes fast. What holds up is better thinking at the start."

That voice — direct, considered, not performing — is what the contact page needs to match. The current contact page completely abandons it. "To work together, please fill out the form below." is as flat as Scope Labs at its worst.

### What to steal from Self Aware:
1. **The letter format.** "Dear O'Mara" as opener. It signals a real person is waiting.
2. **Fill-in-the-blank inline fields.** Name, role/company inline in prose. Not labels + fields.
3. **"We're looking for" as a category selector.** Uses the language of partnership, not interrogation.
4. **"You can reach me at ___."** Best version of asking for an email.
5. **The implicit message that someone's paying attention.** The form needs to feel like it gets read, not processed.

### What to drop from Self Aware:
1. Drag-and-drop mechanics.
2. The budget slider (doesn't fit O'Mara's pricing model — they have a services page for that).
3. The length. Keep it lean.
4. The shapes as metaphor. The categories should just be selectable items.

### What to steal from Scope Labs:
1. The service category structure — it does useful work filtering intent. Keep this.
2. The email fallback ("contact forms not your thing?"). This is already in the current page and must stay.
3. The efficiency. Scope's form gets done fast. Self Aware's lingers too long.

### What to drop from Scope Labs:
1. Everything they wrote as copy. Replace it all.
2. "Company name" as a required field.
3. Testimonials below the form — wrong place, wrong intent.

---

## Proposed Structure for O'Mara Contact Page

### Tone:
Match the services page voice. Direct, slightly dry, confident but not stiff. Human but not trying to be cute. This is someone who knows what they're doing and wants to hear from you without making a big deal of it.

### Page structure:

**1. Opener (above form)**
Short, not generic. Two lines max. Something like:
> "If something here feels right, let's talk."

Then the email fallback — not buried, not footnoted. Right there, early:
> "Not a forms person? Reach us at info@omaratechnology.com"

**2. The form — letter style**
Written as prose with inline inputs:

```
My name is ___ and I'm reaching out from ___.

We're looking for:
[ ] Website or Web App Design
[ ] Website or Web App Development
[ ] Mobile App Development
[ ] Product Strategy
[ ] AI Engineering
[ ] Something else

[Tell us more — what's the project, what's the problem, where are you in it?]

You can reach me at ___.
```

**3. The "We're looking for" categories (6 skills from services)**
Based on the services.json, the 6 most distinct things O'Mara offers:
1. **Website / Web App Design** — wireframing, UI, design systems, prototyping
2. **Website / Web App Development** — React, Next.js, full-stack
3. **Mobile App Development** — React Native
4. **Product Strategy** — discovery, research, roadmaps, architecture decisions
5. **AI Engineering** — AI/RAG architecture, MCP servers, agentic systems
6. **Ongoing Partnership** — monthly engagement, iteration

These six map cleanly to both engagement types and skill categories in services.json. They're specific enough to signal expertise, broad enough not to exclude anyone real.

**4. "Tell us more" textarea**
One textarea. Label it something human: "Tell us more about what you're building or where you're stuck." Not "Inquiry." Not "Additional information."

**5. Submit**
Simple. One button. No drama.

---

## CSS / Implementation Notes

The existing contact.module.css has more than enough infrastructure for this rewrite — inputs, textareas, error states, buttons are all already styled. The new structure will need:
- A prose wrapper for the letter-style format
- Inline inputs styled to match the fill-in-the-blank aesthetic (minimal border, mostly underline)
- A checkbox/toggle group for the 6 service categories (similar to existing `.checkboxItem` pattern)
- No drag-and-drop modal — remove entirely
- No file attachment in the initial implementation — adds complexity without clear value for this form type

The current form is grid-based (2-column). The new form should be single-column, prose-flow — the layout logic is different.

---

## What Not to Do

- Don't open with "Contact" as the only headline. The current page does this and it says nothing.
- Don't list every service in the categories. Self Aware's mistake was ambiguity ("Other"); Scope's was over-specificity. Six named, real things is right.
- Don't add back the drag-and-drop file attachment. It was the most complex piece of the current implementation and the least necessary.
- Don't write in third person ("O'Mara Technology is..."). The services page uses "we" throughout — stay consistent.
- Don't bury the email fallback. It should be visible before the form starts, not after.
