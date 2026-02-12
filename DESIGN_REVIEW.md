# EEMB Website Design Review

**Date:** February 2026
**Goal:** Clean, spacious, minimal-text design aligned with Pacific Naturalism v4.0

---

## Review Criteria

1. **Text density** — Is there too much text? Can anything be cut or shortened?
2. **Whitespace & breathing room** — Do elements have enough padding/margin? Does the layout feel cramped?
3. **Visual hierarchy** — Is the most important content prominent? Are there too many competing elements?
4. **Consistency** — Do pages follow the same patterns, spacing, and typography?
5. **Mobile readiness** — Will layouts work at 375px? Are touch targets adequate?
6. **Component density** — Are there too many sections per page? Could anything be removed or collapsed?

---

## Cross-Cutting Summary

### Top 10 Site-Wide Priorities

| # | Issue | Impact | Pages Affected |
|---|-------|--------|----------------|
| 1 | **Too many sections per page** — Homepage has 9, About has 13, Academics has 7. Remove redundant/filler sections. | High | Home, About, Academics, Contact |
| 2 | **Excessive `lg:py-40` spacing** — Creates endless scroll without adding airiness. Standardize on `py-24 md:py-32`. | High | Home, Research, multiple |
| 3 | **Text walls** — Hero subtitles, mission statements, and card descriptions exceed 30 words. Cut by 40%. | High | Home, About, DEI, Give, Research |
| 4 | **Graduate page uses `gray-*` instead of `warm-*`** — Looks like a different website. | High | Graduate Program |
| 5 | **Redundant bottom CTAs** — Nearly every page has a CTA section that duplicates the hero or nav. | Medium | Events, Calendar, News, Contact |
| 6 | **Decorative overload** — Orbs, blurs, wave dividers in almost every section. Reserve for 2-3 key sections. | Medium | Home, Events, Contact |
| 7 | **People directory cards too dense** — Bio, contact icons, social icons all on one card. Strip to essentials. | Medium | People |
| 8 | **No active nav state in Header** — Users can't tell which page they're on. | Medium | Global |
| 9 | **Inconsistent profile page designs** — Faculty, student, staff heroes and empty states all differ. | Medium | People profiles |
| 10 | **Utility pages use full heroes** — Events, Calendar, Good News should use compact headers per design system. | Medium | Events, Calendar, Good News |

### Recurring Patterns to Fix

- **WaveDivider overuse**: Contact page has 4, Events has 3. Max 1-2 per page.
- **Duplicate stats**: Hero stats repeated later on the same page (Homepage, Academics).
- **Off-brand colors**: Graduate page (`gray-*`), Calendar page (`bg-blue-500`, `bg-purple-500`), Admin (`gray-*`).
- **Accordion animation missing**: Support page and Graduate FAQs snap open/closed with no transition.
- **Placeholder content**: Faculty quote headshots, social media URLs, location addresses — all need real data.

---

## Agent Report 1: Homepage + Header/Footer

### Issues Found: 14

#### Header (Header.tsx)
- **8 nav links + CTA is crowded at `lg:` breakpoint** — Consider collapsing lesser-used items or bumping to `xl:`.
- **No active-state indicator** — Compare `pathname` to `link.href` and apply a distinct style to the current page.
- **Mobile menu uses `max-h` animation** — Janky timing. Use `grid-rows-[0fr]/[1fr]` pattern instead.

#### Hero (HeroSection.tsx)
- **Subtitle is 28 words** — Cut to ~12 words: "Where the mountains meet the Pacific, we ask questions that matter."
- **Stats bar competes with CTAs** — Reduce stat number size from `text-4xl` to `text-2xl` or remove stats from hero entirely.
- **Two large CTAs create heavy bottom cluster** — Reduce padding from `px-8 py-4` to `px-6 py-3`.
- **5 background images all rendered to DOM** — Only render current + previous, not all 5.

#### Sections
- **QuickNav**: Remove redundant eyebrow ("How can we help?" + "Find your path" = same idea).
- **WhoWeAre**: Two paragraphs at 72 words — condense to one at ~35. Remove LTER cards (duplicate of Research page). Reduce `lg:py-40` to `py-24 md:py-32`.
- **ResearchThemes**: Inter-card spacing `space-y-16 md:space-y-24` is excessive — reduce to `space-y-12 md:space-y-16`. Remove redundant "View all research areas" CTA.
- **FacultyQuote**: Quote text at `text-4xl` is too large. Reduce to `text-xl md:text-2xl lg:text-3xl`. Placeholder images (coral reef photos) need actual faculty headshots.
- **Graduate Programs CTA**: Paragraph is 32 words — trim to ~14. Secondary CTA should be visually smaller.

#### Global Observations
- **9 sections is 2-3 too many** — Remove FacultyQuote (covered by FeaturedFaculty) and LTER cards from WhoWeAre.
- **Decorative elements (orbs, blurs, topo patterns) in nearly every section** — Remove from QuickNav, FeaturedFaculty, and News+Events. True whitespace creates the coastal feel.
- **Inconsistent `max-w` values** — Mix of `max-w-6xl` and `max-w-7xl` without clear logic.

#### Top 5 Priorities
1. Remove 2 sections to shorten page (FacultyQuote + LTER cards)
2. Reduce `lg:py-40` spacing and inter-card gaps
3. Cut text by ~40% in hero subtitle, WhoWeAre, and Grad CTA
4. Thin decorative background elements to 2-3 sections max
5. Add active-state indicator to Header navigation

---

## Agent Report 2: Research + Academics Pages

### Issues Found: 15

#### Research Page
- **Instructional text on accordion section** ("Click any theme to see...") — Users know how accordions work. Remove it.
- **Research highlight descriptions are 25-35 words each** — Trim to 20 max.
- **Accordion shows full description in collapsed state** — 5 cards x ~35 words = 175 words before any interaction. Use `line-clamp-1` or remove description from collapsed state.
- **6 sections is borderline heavy** — Remove Research Highlights (overlaps with accordion content).
- **Two hero CTAs + two footer CTAs = CTA fatigue** — Remove "Meet Our Faculty" from hero.
- **`max-h-[800px]` animation cap** — May clip themes with many faculty. Use `max-h-[1200px]` or JS measurement.

#### Academics Page
- **"Why EEMB" cards are 25-30 words each** — Cut to 15-20 words.
- **Student voice quotes are 35-45 words** — Trim to 30 words max or use `line-clamp-4`.
- **PhD/MA cards have paragraph + 3 bullets + CTA** — ~65 words per card. Cut description to 1 sentence.
- **"Contact Faculty First" callout repeats hero stats AND timeline Step 1** — Triple redundancy. Remove callout.
- **7 sections is too many** — Remove "Research Experiences" (overlaps with "Why EEMB") and simplify Degree Programs.
- **Entire page is `'use client'`** — Only needed for testimonials hook. Extract to a client sub-component.
- **`/academics/graduate` linked 4 times on one page** — Reduce to 2 (hero + application section).

#### Graduate Program Page
- **Uses `gray-*` colors throughout instead of `warm-*`** — Feels like a different website. Systematic find-and-replace needed.
- **7 tabs is too many** — Best practice is 3-5. Merge PhD+MA into "Programs", Resources into "Apply". Target 5 tabs.
- **Overview tab has 350+ words** — Cut intro to 1 sentence. Remove Research Specializations sidebar.
- **PhD tab has 500+ words** — Reads like a handbook. Collapse timeline, remove coursework table, link to PDF instead.
- **Course list duplicated between PhD and MA tabs** — Show once in Overview or remove entirely.
- **FAQs are not collapsible** — All 6 answers always visible. Convert to accordion.
- **Tab content has no transition animation** — Abrupt content swaps. Add fade or convert to scroll-based layout.

#### Top 5 Priorities
1. Replace all `gray-*` with `warm-*` on Graduate page
2. Reduce Graduate page from 7 tabs to 4-5
3. Hide accordion descriptions in collapsed state on Research page
4. Remove redundant sections from Academics page (7 → 5)
5. Make Graduate FAQs collapsible

---

## Agent Report 3: People Directory + Profiles

### Issues Found: 12+

#### People Directory (people/page.tsx)
- **Cards show 8+ data points** — Avatar, name, title, year, advisor, bio (3 lines), contact icons (3), social icons (5), "View Full Profile" button. Strip to: photo, name, title, link.
- **Two competing icon rows** — Contact icons at `w-9 h-9` and social icons at `w-8 h-8`. Remove both from cards.
- **7 simultaneous hover effects** — Accent bar, background glow, avatar blur, avatar scale, border color, shadow, name color. Reduce to 2-3.
- **Staggered animation delay accumulates** — Card 80 has a `4000ms` delay. Cap at `index % 8 * 50ms`.
- **8 category tabs** — Too granular. Reduce to 4-5: All, Faculty, Staff, Students. Offer sub-categories as secondary filter.
- **Sticky controls consume ~200px** — Tab bar + search + sort + research area filter = three stacked layers. Target ~60px.
- **Quick stats in header duplicate tab badges** — Remove header stats.
- **Table view gradient header** — 3-color gradient is too heavy. Use `bg-ocean-deep text-white`.
- **4 columns at `xl` is tight** — Reduce to `xl:grid-cols-3` or increase gap to `gap-8`.

#### Faculty Profile (people/faculty/[slug]/page.tsx)
- **Empty bio state is over-designed** — Wave SVG, large icon, two paragraphs, CTA button for missing data. Simplify to "Biography coming soon."
- **Research Focus vs Research Areas** — Two adjacent tag sections with similar styling. Merge into one.
- **Contact sidebar labels are redundant** — Icons already communicate field type. Remove micro-labels.

#### Student Profile (people/students/[slug]/page.tsx)
- **Sidebar has 3 bordered sections** — Consolidate Research Links + Social into one "Links" section.
- **Advisor is a full card** — Move to sidebar as a simple row.
- **Twitter icon uses old blue branding** — Inconsistent with X branding elsewhere. Standardize.

#### Staff Profile (people/staff/[slug]/page.tsx)
- **"Role & Responsibilities" section is filler** — Repeats hero title/department. Remove entirely.
- **"Get in Touch" CTA duplicates sidebar email** — Remove.
- **Extra decorative elements** — Wave SVG and blur glow not present on other profiles. Standardize.
- **Only one meaningful content section** — Consider simpler single-column layout for staff.

#### Cross-Cutting
- **3 different hero structures** across person types — Extract shared `ProfileHero` component.
- **3 different empty bio states** — Create shared component or just omit section when empty.
- **Inconsistent section headings** — "Biography" on faculty vs "About" on students/staff.

#### Top 5 Priorities
1. Strip directory cards to essentials (photo, name, title, link)
2. Reduce sticky controls height and tab count
3. Remove filler sections from staff profile
4. Standardize profile page structure across all three types
5. Tame card hover animations and fix staggered delay accumulation

---

## Agent Report 4: News + Events + Calendar

### Issues Found: 20+

#### News Listing (NewsPageClient.tsx)
- **Sticky filter bar is ~120px tall** — Move results count outside. Reduce padding. Consider dropdown for topics.
- **Standard card excerpt is unnecessary** — Title alone is sufficient for a browsing grid. Remove excerpt or use `line-clamp-1`.
- **"Browse by Year" archive section duplicates year dropdown** — Remove the section.
- **Hero card has triple gradient overlays** — Simplify to a single gradient.
- **"Load More" button styling is too heavy** — Switch from dark `bg-ucsb-navy` to ghost-style button.

#### News Article Detail (NewsArticleClient.tsx)
- **Hero is 600px tall** — Too much before article text. Reduce to 450px. Consider removing parallax.
- **Drop cap at `text-7xl` is oversized** — Reduce to `text-5xl md:text-6xl`.
- **Pull quote spacing is generous to a fault** — Reduce `my-12` to `my-8`, scale text down.
- **Newsletter CTA at bottom is a fake** — Just links to /news. Remove entirely.
- **Related articles use inconsistent card style** — Align with StandardCard pattern from listing page.

#### Events Page (events/page.tsx)
- **Full hero contradicts design system** — CLAUDE.md says events should use "compact headers." Replace with compact header.
- **3 WaveDividers on one page** — Keep max 1. Replace others with spacing or thin borders.
- **Empty state is 90 lines of over-design** — Animated waves, blur orbs, icon clusters, suggestion cards. Simplify to ~15 lines.
- **Event type pills are not clickable** — Confusing UX. Either make them filters or display as plain text.
- **Bottom CTA duplicates hero and sticky bar** — Three calendar-subscribe touchpoints. Remove bottom CTA.

#### Calendar (CalendarPageClient.tsx)
- **Uses raw Tailwind colors** — `bg-blue-500`, `bg-purple-500` instead of design tokens. Unify with EventCard colors.
- **Hero is too tall for a utility page** — Reduce to `py-8` or use compact inline header.
- **Event pills in calendar cells are barely readable** — `text-[10px]` is too small. Show only time or only title.
- **Legend is bulky** — Move inline below controls as a compact strip.
- **Sidebar uses emoji icons** — Replace with Lucide icons for consistency.
- **Action buttons use off-brand colors** — `bg-blue-500` should be `bg-ocean-blue`.

#### Good News Page
- **Hero gradient is same as Calendar** — Add gold accent for celebratory differentiation.
- **Articles lack images, badges, or visual richness** — Compared to news page, feels like an afterthought.
- **No pagination or load-more** — Will create very long page as articles accumulate.

#### Top 5 Priorities
1. Normalize hero heights — utility pages should use compact headers
2. Eliminate redundant bottom CTA sections across all pages
3. Unify calendar colors with EventCard design tokens
4. Simplify events empty state from 90 lines to ~15
5. Reduce text density on news cards and article pages

---

## Agent Report 5: About + DEI + Give + In Memoriam + Alumni

### Issues Found: 20+

#### About Page (about/page.tsx)
- **13 sections is far too many** — Cut to 6-7. Remove Research Highlights (belongs on /research), Global Research Reach (belongs on /research), Explore More (navigation filler). Fold By the Numbers into hero or Why EEMB.
- **Section spacing too tight** — All sections use `py-12 md:py-16`. For Pacific Naturalism, increase to `py-16 md:py-24`.
- **"What We Do" text wall** — Three consecutive paragraphs. Convert key questions into a visual element (cards or styled bullets).
- **whyEEMB card descriptions too long** — Trim each to a single sentence of 15-20 words.
- **Timeline event text density** — Shorten descriptions to 8-12 words.
- **Leadership uses placeholder avatars** — Use actual headshots or stylized initials.

#### DEI Page (dei/page.tsx)
- **Mission statement is 71 words in one sentence** — Break into 2-3 shorter sentences or bullet points.
- **"Building Belonging" section is vague** — Generic platitudes with no specific programs. Cut or replace with concrete outcomes.
- **Triple ending** — "We Welcome You" CTA + "DEI Commitment" footer + Mission at top = 3x commitment statement. Remove footer.
- **Resources grid has 7 items in 3 columns** — Orphaned card in last row. Use 6 or 9 items, or switch to 2-column.
- **Initiatives expand-to-detail has no scroll-to** — User clicks card but detail may appear far below. Add `scrollIntoView()`.

#### Give Page (give/page.tsx)
- **Hero text too dense** — 33-word subtitle. Trim to ~15 words.
- **Mission paragraph duplicates hero** — Remove or merge.
- **Expanded card details are overwhelming** — Hundreds of words of fellowship names and dollar amounts. Move to linked PDF or detail page.
- **Tax Information section is dry and long** — Condense to one line.
- **No repeated Donate CTA** — Primary CTA only in hero. Add one after Giving Priorities section.

#### In Memoriam (memoriam/page.tsx + InMemoriamClient.tsx)
- **Memorial message is a text wall** — 52 words in a single block. Break into 2 short sentences with more spacing.
- **Placeholder initials circles too large** — `w-32 h-32` with `text-5xl` is heavy. Reduce to `w-24 h-24`.
- **Modal lacks visual grace** — Add gradient background, decorative border, more padding.
- **"Read More" feels too casual** — Change to "View Memorial" with subdued styling.
- **Overall: one of the better-designed pages** — Structure is appropriate and not bloated.

#### Alumni Page (alumni/page.tsx)
- **"Coming Soon" placeholder with no content** — Remove from navigation until real content exists. Unlink from QuickLinks and sitemap.

#### Top 5 Priorities
1. Cut About page from 13 sections to 6-7
2. Break up text walls on DEI and Give pages
3. Increase section spacing site-wide from `py-12` to `py-16 md:py-20`
4. Remove Alumni page from navigation until content exists
5. Simplify Give page expanded card details

---

## Agent Report 6: Support + Contact + Admin

### Issues Found: 23

#### Support Page (support/page.tsx)
- **11 collapsible sections is overwhelming** — Consolidate to 7-8. Merge Conference Rooms into Facilities, IT into Campus Resources.
- **`space-y-4` between accordions is too tight** — Increase to `space-y-6`. Increase section padding from `py-8` to `py-12`.
- **Header is bare compared to Contact page** — Apply gradient background and WaveDivider to match sibling page.
- **Emergency section `bg-red-50` is visually harsh** — Soften to `bg-amber-50` with red left-border accent.
- **No anchor navigation** — Add sticky sidebar (desktop) or pill bar (mobile) linking to section IDs.
- **Accordion has no animation** — Snap open/close. Add `max-height` transition or CSS fade.
- **Accordion doesn't auto-collapse** — Opening one should close others. Lift state to parent.
- **Finance section bullet lists add density without value** — Link each to actual forms or simplify to prose.

#### Contact Page (contact/page.tsx)
- **5 content sections + 4 WaveDividers** — Enormous length for a contact form + phone number. Remove Office Hours section (already in Grid cards) and Final CTA. Keep max 2 WaveDividers.
- **Static cards have hover-lift** — Cards that aren't clickable shouldn't `hover:-translate-y-1`. False affordance. Apply hover only to linked cards.
- **Quick Links sidebar duplicates main nav** — Remove or replace with a 2-3 item FAQ.
- **Location cards have placeholder content** — "Santa Barbara Waterfront" and "Various locations" are not real addresses.
- **Submit button is heavy** — Gradient + `shadow-lg` + full width. Simplify to solid `bg-ucsb-gold` + `shadow-md`.
- **Character counter always visible** — Show only when >80% of limit used.

#### Contact Form (ContactForm.tsx)
- **Success state uses `bg-kelp-50`** — Verify token exists in Tailwind config or replace with `bg-ocean-teal/10`.

#### Admin Pages
- **Dashboard uses `gray-*` colors** — Replace with `warm-*` equivalents (low priority).
- **Inline SVGs instead of lucide-react** — Inconsistent with rest of codebase (low priority).

#### Cross-Page Issues
- **Support and Contact pages look like different websites** — Support is utilitarian; Contact has full Pacific Naturalism treatment. Bring Support up to Contact's quality level.
- **Both pages list the same staff** — Clarify roles: Contact = external inquiries, Support = internal resources.

#### Top 5 Priorities
1. Reduce Contact page length by removing redundant sections
2. Consolidate Support page from 11 to 7-8 sections + add anchor navigation
3. Harmonize Support page header with design system
4. Fix false hover affordances on static Contact cards
5. Add expand/collapse animation to Support accordions

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total issues identified | ~100 |
| Pages reviewed | 20+ |
| Components reviewed | 30+ |
| High-priority fixes | 10 |
| Medium-priority fixes | 20 |
| Low-priority fixes (admin, polish) | 10 |

### Effort Estimates

| Category | Examples | Scope |
|----------|----------|-------|
| **Quick wins** (1-2 hours) | Remove redundant sections, cut text, fix spacing values | ~30 issues |
| **Medium effort** (half day each) | Standardize profile pages, redesign directory cards, fix Graduate page colors | ~15 issues |
| **Larger refactors** (1+ day each) | Support page anchor nav + accordion rework, Graduate page tab consolidation, About page restructure | ~5 issues |

---

*Generated by 6 parallel design review agents, February 2026*
