# UX Design Documentation
## EEMB Website Redesign - Phase 1 Core Launch

**Document Version:** 1.0
**Date:** January 9, 2026
**Prepared By:** UX Engineer
**Project:** EEMB Website Redesign 2025-2026
**Status:** Ready for Stakeholder Review

---

## Executive Summary

This document provides comprehensive UX design specifications for the EEMB website redesign. Building on the existing Pacific Naturalism v4.0 design system implementation and validated Business Requirements, this documentation guides the technical implementation of user-centered design solutions.

**Design Philosophy:** Transform a static academic content repository into a dynamic, story-driven platform that recruits graduate students and builds research recognition while maintaining institutional credibility.

**Key Insight:** The existing codebase already implements ~95% of the design system. This documentation focuses on validation, gap analysis, and specifications for the remaining Phase 1 deliverables.

---

## Table of Contents

1. [User Research Validation](#1-user-research-validation)
2. [Information Architecture](#2-information-architecture)
3. [User Journey Maps](#3-user-journey-maps)
4. [Page-by-Page Design Specifications](#4-page-by-page-design-specifications)
5. [Component Library Documentation](#5-component-library-documentation)
6. [Interaction Design Specifications](#6-interaction-design-specifications)
7. [Accessibility Requirements](#7-accessibility-requirements)
8. [Technical Implementation Notes](#8-technical-implementation-notes)
9. [Design Review Checklist](#9-design-review-checklist)
10. [Tech Lead Handoff Summary](#10-tech-lead-handoff-summary)

---

## 1. User Research Validation

### 1.1 Primary Personas

Based on BRD analysis and competitive research, the following personas drive design decisions:

#### Persona 1: Prospective Graduate Student
| Attribute | Detail |
|-----------|--------|
| **Name** | Maya Chen |
| **Context** | Senior undergrad, Ecology major at small liberal arts college |
| **Goal** | Find PhD programs with marine ecology research and funding |
| **Pain Points** | Hard to tell which faculty are accepting students; unclear what research is actually happening |
| **Success Criteria** | Can find relevant faculty and understand research themes in <2 minutes |
| **Device** | 70% mobile during initial research, desktop for deep dives |

#### Persona 2: Prospective Faculty Candidate
| Attribute | Detail |
|-----------|--------|
| **Name** | Dr. James Okonkwo |
| **Context** | Assistant professor at R2 university, seeking R1 position |
| **Goal** | Assess research fit, facilities, and departmental culture |
| **Pain Points** | Department websites are often outdated; hard to gauge actual research activity |
| **Success Criteria** | Can understand research themes and find potential collaborators in <5 minutes |
| **Device** | 90% desktop |

#### Persona 3: Science Journalist / Media
| Attribute | Detail |
|-----------|--------|
| **Name** | Sarah Rodriguez |
| **Context** | Environmental reporter for regional newspaper |
| **Goal** | Find expert sources for climate/ocean stories on deadline |
| **Pain Points** | Academic jargon, unclear expertise areas, outdated contact info |
| **Success Criteria** | Can identify relevant expert and contact method in <3 minutes |
| **Device** | 80% desktop |

#### Persona 4: Current Graduate Student
| Attribute | Detail |
|-----------|--------|
| **Name** | Alex Kim |
| **Context** | 3rd year PhD student in the department |
| **Goal** | Update profile, find seminar info, access resources |
| **Pain Points** | Outdated info, hard to update own profile |
| **Success Criteria** | Self-service profile updates without admin help |
| **Device** | 50/50 mobile/desktop |

### 1.2 Persona Validation Status

| Persona | Validation Method | Status | Confidence |
|---------|-------------------|--------|------------|
| Prospective Student | Industry research + BRD | Validated | High |
| Faculty Candidate | Stakeholder interviews | Assumed | Medium |
| Media/Journalist | Competitive analysis | Assumed | Medium |
| Current Student | Direct feedback possible | Validated | High |

**Recommendation:** Conduct 3-5 user interviews with prospective graduate students during QA phase to validate homepage pathway effectiveness.

### 1.3 Design Implications by Persona

| Design Decision | Student | Faculty | Media | Current |
|-----------------|---------|---------|-------|---------|
| Prominent "Apply" CTA | Essential | Low | None | None |
| Research by theme | High | Essential | High | Medium |
| Faculty profiles | Essential | High | Essential | Low |
| Student testimonials | Essential | Medium | Low | None |
| Self-service editing | None | None | None | Essential |
| Contact info visible | High | Medium | Essential | Low |

---

## 2. Information Architecture

### 2.1 Site Map

```
EEMB Website
├── HOME
│   ├── Hero (rotating research themes)
│   ├── Audience Quick Nav
│   ├── Who We Are (brief)
│   ├── Research Themes (preview)
│   ├── Featured Faculty
│   ├── Faculty Testimonial
│   ├── News + Events
│   ├── Graduate Programs CTA
│   └── Partners
│
├── ABOUT
│   ├── Department Overview
│   ├── Mission & Values
│   ├── History & Location
│   ├── DEI Commitment → /dei
│   └── Contact → /contact
│
├── PEOPLE ⭐ (Phase 1 Critical)
│   ├── Faculty Directory (filterable)
│   │   └── Individual Faculty Profiles
│   ├── Staff Directory
│   ├── Graduate Students
│   │   └── Individual Student Profiles
│   └── Alumni → /alumni
│
├── RESEARCH ⭐ (Phase 1 Critical)
│   ├── Overview (all themes)
│   ├── Ecology Theme
│   ├── Evolution Theme
│   └── Marine Biology Theme
│
├── ACADEMICS ⭐ (Phase 1 Critical)
│   ├── Programs Overview
│   ├── Graduate Programs
│   │   ├── PhD Program
│   │   ├── MS Program
│   │   └── How to Apply
│   └── Undergraduate
│
├── NEWS ⭐ (Phase 1 Critical)
│   ├── News Listing (filterable)
│   └── Individual Articles
│
├── EVENTS
│   ├── Events Listing
│   ├── Calendar View → /calendar
│   └── Individual Events
│
├── SUPPORT
│   ├── Current Students
│   ├── Faculty & Staff
│   └── General Help
│
└── UTILITY PAGES
    ├── Contact
    ├── Give (Donations)
    ├── Good News
    ├── In Memoriam
    └── Admin (authenticated)
```

### 2.2 Navigation Structure

#### Primary Navigation (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [EEMB Logo]    About  People  Research  Academics  News  Events  Support   │
│                                                                [Apply Now] │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Nav Item | Purpose | Dropdown | Priority |
|----------|---------|----------|----------|
| About | Institutional info | No | Medium |
| People | Find faculty/students | Yes | High |
| Research | Browse by theme | Yes | Critical |
| Academics | Program info | Yes | Critical |
| News | Updates & stories | No | High |
| Events | Calendar & seminars | No | Medium |
| Support | Help resources | Yes | Low |
| **Apply Now** | Primary CTA | No | Critical |

#### Mobile Navigation Pattern
- Hamburger menu (3-line icon)
- Full-screen overlay with large touch targets
- Hierarchical expansion for dropdowns
- "Apply Now" remains visible in header

### 2.3 Content Hierarchy Per Page Type

#### Homepage
1. **Hero (viewport height):** Rotating research visuals + "We study [topic]"
2. **Audience Nav:** Quick paths for students, faculty, media
3. **About:** Brief intro with stats
4. **Research:** Theme cards with "Learn more"
5. **Faculty:** Featured grid
6. **Student Voice:** Quote/testimonial
7. **News + Events:** Side-by-side preview
8. **Graduate CTA:** Full-width dark section
9. **Partners:** Logo strip

#### Research Theme Page
1. **Hero:** Theme-specific imagery + title
2. **Introduction:** Big question framing
3. **Research Areas:** Specific topics within theme
4. **Faculty:** People working in this theme
5. **Recent Work:** Publications/news
6. **Related Themes:** Cross-links

#### Faculty Profile
1. **Header:** Photo + Name + Title
2. **Research Focus:** Current questions (first-person preferred)
3. **Current Projects:** Active work
4. **Lab Members:** Team links
5. **Publications:** Recent work
6. **Contact:** Email, office, links

---

## 3. User Journey Maps

### 3.1 Journey: Prospective Graduate Student Researching Programs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GRADUATE STUDENT RESEARCH JOURNEY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ STAGE: DISCOVER → EXPLORE → EVALUATE → CONNECT → APPLY                     │
└─────────────────────────────────────────────────────────────────────────────┘

DISCOVER (Google search → Landing)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Search "marine biology PhD programs California"                 │
│ Page: Homepage or Research page (SEO entry)                                │
│ Emotion: Hopeful, overwhelmed by options                                   │
│ Goal: "Is this program relevant to my interests?"                          │
│                                                                             │
│ Design Requirements:                                                        │
│ • Clear research themes visible immediately                                │
│ • "Prospective Students" pathway prominent                                 │
│ • No jargon barrier in first impression                                    │
│ • Mobile-friendly (60% of initial research is mobile)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
EXPLORE (5-15 minutes)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Research themes, Faculty directory                             │
│ Pages: /research, /research/[theme], /people                               │
│ Emotion: Engaged, comparing to other programs                              │
│ Goal: "What specific research is happening? Who would I work with?"        │
│                                                                             │
│ Design Requirements:                                                        │
│ • Research organized by questions, not just faculty names                  │
│ • Faculty photos and human-readable research descriptions                  │
│ • Clear indication of who is accepting students                            │
│ • Filter by research area                                                  │
│ • Save/bookmark functionality (future)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
EVALUATE (15-30 minutes)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Faculty profiles, Student testimonials, Program info           │
│ Pages: /people/faculty/[slug], /academics/graduate                         │
│ Emotion: Analytical, forming preferences                                   │
│ Goal: "What's the student experience? Can I afford this? Do I fit?"        │
│                                                                             │
│ Design Requirements:                                                        │
│ • Student voices with real photos                                          │
│ • Funding information prominent and clear                                  │
│ • Application requirements and timeline                                    │
│ • Faculty profile shows current students and recent publications           │
│ • Lab website links for deeper dive                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
CONNECT (Optional)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Contact faculty, attend event, request info                    │
│ Pages: Faculty profile (email), /events, /contact                          │
│ Emotion: Nervous, excited                                                  │
│ Goal: "How do I make first contact appropriately?"                         │
│                                                                             │
│ Design Requirements:                                                        │
│ • Faculty email clearly visible                                            │
│ • Upcoming seminars/open houses listed                                     │
│ • Contact form for general inquiries                                       │
│ • Social proof (rankings, placements)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
APPLY
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Application portal (external)                                  │
│ Page: /academics/graduate → External application system                    │
│ Emotion: Committed, anxious                                                │
│ Goal: "Submit a complete, competitive application"                         │
│                                                                             │
│ Design Requirements:                                                        │
│ • Clear deadlines with countdown                                           │
│ • Complete requirements checklist                                          │
│ • FAQ addressing common concerns                                           │
│ • Direct link to application portal                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Journey: Media/Journalist Finding Expert Source

```
DEADLINE RESEARCH (2-5 minutes max)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Search "UCSB ocean expert" or direct navigation                │
│ Page: Homepage → People directory                                          │
│ Emotion: Urgent, time-pressured                                            │
│ Goal: "Find someone who can comment on [topic] NOW"                        │
│                                                                             │
│ Design Requirements:                                                        │
│ • Search/filter by expertise area                                          │
│ • Research focus immediately visible on profile cards                      │
│ • Contact info (email) visible without extra clicks                        │
│ • Photo helps identify for video/in-person                                 │
│ • "Expert areas" tags or keywords                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Journey: Faculty Self-Service Profile Update

```
UPDATE PROFILE (5-10 minutes)
┌─────────────────────────────────────────────────────────────────────────────┐
│ Touchpoint: Admin notification or self-initiated                           │
│ Page: /admin → Faculty profile editor                                      │
│ Emotion: Busy, wants efficiency                                            │
│ Goal: "Update my bio and add recent publication"                           │
│                                                                             │
│ Design Requirements:                                                        │
│ • Single sign-on or simple login                                           │
│ • WYSIWYG editing (no Markdown knowledge required)                         │
│ • Photo upload with preview                                                │
│ • Auto-save or clear save confirmation                                     │
│ • Preview before publish                                                   │
│ • Clear success feedback                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Page-by-Page Design Specifications

### 4.1 Homepage

**Status:** Implemented (requires content enhancement)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HEADER (sticky)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            HERO (100vh)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Background: Rotating research images with parallax]                │   │
│  │                                                                      │   │
│  │  UC Santa Barbara                                                    │   │
│  │  We study [rotating: Kelp forests / Coral reefs / etc.]             │   │
│  │  Department of Ecology, Evolution & Marine Biology                   │   │
│  │                                                                      │   │
│  │  Where the Santa Ynez Mountains meet the Pacific...                  │   │
│  │                                                                      │   │
│  │  [25 Faculty]  [100+ Students]  [2 NSF LTER Sites]                  │   │
│  │                                                                      │   │
│  │  [Explore Research]  [Meet Faculty]                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               ↓ Wave divider                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                          QUICK NAV (bg-warm-50)                             │
│  "I'm looking for..."                                                       │
│  [Graduate Programs]  [Research Opportunities]  [Faculty Directory]         │
│  [Current Student Resources]  [Contact Us]                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                          WHO WE ARE (bg-white)                              │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐    │
│  │                          │  │ "We ask questions that matter"        │    │
│  │       [Image]            │  │                                       │    │
│  │                          │  │ Description text...                   │    │
│  │                          │  │ [Learn about us →]                    │    │
│  └──────────────────────────┘  └──────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│                       RESEARCH THEMES (bg-warm-100)                         │
│  Research                                                                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                  │
│  │   [Ecology]    │ │  [Evolution]   │ │ [Marine Bio]   │                  │
│  │   [image]      │ │   [image]      │ │   [image]      │                  │
│  │   Big question │ │   Big question │ │   Big question │                  │
│  │   [Explore →]  │ │   [Explore →]  │ │   [Explore →]  │                  │
│  └────────────────┘ └────────────────┘ └────────────────┘                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                      FEATURED FACULTY (bg-white)                            │
│  Our People                                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │
│  │ [Img]│ │ [Img]│ │ [Img]│ │ [Img]│ │ [Img]│ │ [Img]│                    │
│  │ Name │ │ Name │ │ Name │ │ Name │ │ Name │ │ Name │                    │
│  │Focus │ │Focus │ │Focus │ │Focus │ │Focus │ │Focus │                    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                    │
│                          [View all faculty →]                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                     FACULTY QUOTE (bg-ocean-deep)                           │
│  "Quote from faculty member about research or department"                   │
│  — Dr. Name, Research Area                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                      NEWS + EVENTS (bg-warm-100)                            │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ Latest Updates              │  │ Upcoming Events             │          │
│  │ [News cards...]             │  │ [Event cards...]            │          │
│  │ [All news →]                │  │ [Full calendar →]           │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
├─────────────────────────────────────────────────────────────────────────────┤
│                    GRADUATE CTA (bg-ocean-deep)                             │
│  Graduate Programs                                                          │
│  Shape the future of ecological science                                     │
│  [Description...]                                                           │
│  [Explore Programs]  [Contact Advisor]                                      │
│                                                                             │
│  [100%] Funding   [5 yrs] Time to PhD   [Top 10] Nationally                │
├─────────────────────────────────────────────────────────────────────────────┤
│                       PARTNERS (bg-warm-50)                                 │
│  Research Partners: [Logo strip...]                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Interaction Specifications
| Element | Behavior | Implemented |
|---------|----------|-------------|
| Hero background | 5-second rotation with crossfade | Yes |
| Hero parallax | 0.3x scroll speed | Yes |
| Floating orbs | Float animation, 8-12s cycle | Yes |
| Stats numbers | Hover color change | Yes |
| Research cards | Scale on hover, shadow lift | Yes |
| Faculty photos | Subtle zoom on hover | Yes |
| Wave divider | Static SVG, smooth curve | Yes |
| Scroll indicator | Bounce animation | Yes |

#### Content Requirements
| Section | Content Needed | Status |
|---------|---------------|--------|
| Hero images | 5 high-quality research photos | Need 2 more |
| Stats | 25 faculty, 100+ students, 2 LTER | Hardcoded—needs CMS |
| Research themes | 3 theme descriptions | Complete |
| Featured faculty | 6 faculty with photos | Complete |
| Faculty quote | 1 compelling quote | Complete |
| News | 3 recent articles | Dynamic from CMS |
| Events | 3 upcoming events | Dynamic from CMS |
| Graduate stats | Funding %, time to degree, rank | Hardcoded |

### 4.2 Research Theme Pages

**Status:** Implemented (template exists, content needs enrichment)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                            HERO (60vh)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Background: Theme-specific imagery]                                │   │
│  │                                                                      │   │
│  │  Research Themes                                                     │   │
│  │  [ECOLOGY / EVOLUTION / MARINE BIOLOGY]                             │   │
│  │                                                                      │   │
│  │  "Big question framing for this theme"                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               ↓ Wave divider                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                       THEME INTRO (bg-warm-50)                              │
│  Extended description of research theme...                                  │
│  Key questions we're asking...                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                      RESEARCH AREAS (bg-white)                              │
│  Specific Research Topics                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │ [Topic 1]        │ │ [Topic 2]        │ │ [Topic 3]        │            │
│  │ Description      │ │ Description      │ │ Description      │            │
│  │ [Faculty: ...]   │ │ [Faculty: ...]   │ │ [Faculty: ...]   │            │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘            │
├─────────────────────────────────────────────────────────────────────────────┤
│                     FACULTY IN THEME (bg-warm-100)                          │
│  Researchers                                                                │
│  [Faculty cards with photos and research focus]                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                      RECENT WORK (bg-white)                                 │
│  Recent Publications & News                                                 │
│  [Publication/news cards filtered by theme]                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                    RELATED THEMES (bg-warm-100)                             │
│  Explore Related Research                                                   │
│  [Other theme cards]                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Faculty Profile Page

**Status:** Implemented (requires content migration and enhancement)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                       PROFILE HEADER (bg-warm-50)                           │
│  ┌──────────────────┐  ┌──────────────────────────────────────────────┐    │
│  │                  │  │ Dr. Faculty Name                              │    │
│  │      [Photo      │  │ Professor of Ecology                         │    │
│  │      400x400]    │  │                                              │    │
│  │                  │  │ [Ecology] [Evolution]  ← Research theme tags  │    │
│  │                  │  │                                              │    │
│  │                  │  │ Email: name@ucsb.edu                         │    │
│  │                  │  │ Office: Webb 1234                            │    │
│  │                  │  │                                              │    │
│  │                  │  │ [Lab Website] [Google Scholar] [ORCID]       │    │
│  └──────────────────┘  └──────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│                      RESEARCH FOCUS (bg-white)                              │
│  What I Study                                                               │
│  "First-person description of research questions and approach..."           │
│                                                                             │
│  Current Questions:                                                         │
│  • Question 1                                                               │
│  • Question 2                                                               │
│  • Question 3                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                     CURRENT PROJECTS (bg-warm-100)                          │
│  Active Research                                                            │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │ Project Title                   │ │ Project Title                   │   │
│  │ Brief description, funding...   │ │ Brief description, funding...   │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                       LAB MEMBERS (bg-white)                                │
│  Lab Team                                                                   │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                                   │
│  │[Photo]│ │[Photo]│ │[Photo]│ │[Photo]│                                   │
│  │ Name  │ │ Name  │ │ Name  │ │ Name  │                                   │
│  │ Role  │ │ Role  │ │ Role  │ │ Role  │                                   │
│  └───────┘ └───────┘ └───────┘ └───────┘                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PUBLICATIONS (bg-warm-100)                              │
│  Selected Publications                                                      │
│  • Publication 1 (Year) - Journal                                          │
│  • Publication 2 (Year) - Journal                                          │
│  [View full publication list →]                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Design Decisions
| Decision | Rationale |
|----------|-----------|
| Photo minimum 400x400px | Ensures quality at all sizes |
| Research focus first | Leads with "why" not credentials |
| First-person voice preferred | More human, engaging |
| Lab members visible | Shows active, collaborative lab |
| External links prominent | Supports deep research |
| Theme tags clickable | Cross-navigation to research pages |

### 4.4 Graduate Program Page

**Status:** Implemented (content needs student testimonials)

#### Critical Content Requirements
| Element | Specification | Status |
|---------|--------------|--------|
| Student testimonials | 3-5 with photos, diverse backgrounds | **NEEDED** |
| Funding information | Clear "100% funded" messaging | Complete |
| Application timeline | Deadlines, steps, tips | Needs dates |
| Faculty accepting students | Indicated on profiles | Partial |
| Time to degree | Average years for PhD/MS | Complete |
| Placement data | Where graduates go | Needed |

### 4.5 News Article Page

**Status:** Implemented (template complete)

#### Story-Driven Design Requirements
| Element | Specification |
|---------|--------------|
| Lead image | Full-width, high-quality |
| Headline | Discovery-led, not credential-led |
| Byline | Researcher names linked to profiles |
| Theme tags | Filterable by research theme |
| Related content | Other articles in same theme |
| Social sharing | Twitter, LinkedIn, email |
| Reading time | Estimated at top |

---

## 5. Component Library Documentation

### 5.1 Current Component Inventory

| Component | Location | Variants | Status |
|-----------|----------|----------|--------|
| Button | `src/components/ui/Button.tsx` | primary, secondary, ghost, gold, danger | Complete |
| Card | `src/components/ui/Card.tsx` | base, glass, dark + subcomponents | Complete |
| Loading | `src/components/ui/Loading.tsx` | default | Complete |
| ErrorBoundary | `src/components/ui/ErrorBoundary.tsx` | default | Complete |
| WaveDivider | `src/components/ui/WaveDivider.tsx` | default | Complete |
| TopographicPattern | `src/components/ui/TopographicPattern.tsx` | default | Complete |
| Header | `src/components/Header.tsx` | default (responsive) | Complete |
| Footer | `src/components/Footer.tsx` | default | Complete |
| HeroSection | `src/components/HeroSection.tsx` | rotating | Complete |

### 5.2 Button Component Specifications

```tsx
// Usage
<Button variant="gold" size="lg">Apply Now</Button>

// Variants
- primary: bg-ocean-blue, white text
- secondary: border-ocean-teal, teal text
- ghost: transparent, hover bg
- gold: bg-ucsb-gold, ocean-deep text (PRIMARY CTA)
- danger: bg-red, white text

// Sizes
- sm: px-4 py-2 text-sm
- md: px-6 py-3 text-base (default)
- lg: px-8 py-4 text-lg

// States
- default: base styling
- hover: slight scale, shadow increase
- focus: visible ring (accessibility)
- disabled: reduced opacity, no interaction
```

### 5.3 Card Component Specifications

```tsx
// Usage
<Card variant="glass">
  <Card.Image src="/path.jpg" alt="Description" />
  <Card.Header>
    <Card.Badge>Ecology</Card.Badge>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Body>
    <Card.Description>Content here...</Card.Description>
  </Card.Body>
  <Card.Footer>
    <Card.Meta>January 2026</Card.Meta>
  </Card.Footer>
</Card>

// Variants
- base: white bg, warm shadow
- glass: white/80 bg, backdrop-blur
- dark: ocean-deep bg, white text
```

### 5.4 Typography Classes

```css
/* Headings - Fraunces */
.font-heading {
  font-family: var(--font-fraunces);
}

/* Display sizes - fluid */
.text-display-xl  /* Hero headlines: clamp(3rem, 8vw, 5.5rem) */
.text-display     /* Section titles: clamp(2.5rem, 6vw, 4rem) */
.text-display-sm  /* Subsection titles: clamp(2rem, 4vw, 3rem) */

/* Section title pattern */
.section-title {
  @apply font-heading text-display-sm font-bold text-ocean-deep tracking-tight;
}

/* Eyebrow labels */
.eyebrow {
  @apply text-xs font-semibold tracking-[0.2em] uppercase;
}
.eyebrow-ocean { @apply text-ocean-blue; }
.eyebrow-teal { @apply text-ocean-teal; }
.eyebrow-gold { @apply text-ucsb-gold; }
```

### 5.5 Color Usage Guidelines

| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Page background | warm-50 | warm-100 | white |
| Card background | white | warm-100 | glass variant |
| Dark sections | ocean-deep | ocean-midnight | — |
| Primary text | warm-700 | warm-600 | ocean-deep |
| Links | ocean-teal | ocean-blue | — |
| Primary CTA | ucsb-gold | ocean-teal | — |
| Highlights | bioluminescent | kelp-400 | sunset-400 |
| Borders | warm-200 | warm-300 | ocean-teal/20 |

---

## 6. Interaction Design Specifications

### 6.1 Animation Tokens

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| fade-in | 800ms | spring | Initial page load |
| fade-in-up | 800ms | spring | Scroll reveal |
| slide-in-left | 800ms | spring | Side panels |
| slide-in-right | 800ms | spring | Side panels |
| scale-in | 600ms | spring | Modal/popup entry |
| float | 8s | ease-in-out | Decorative orbs |
| float-slow | 12s | ease-in-out | Large orbs |
| glow-pulse | 3s | ease-in-out | Bioluminescent highlights |

### 6.2 Scroll Behavior

| Behavior | Implementation |
|----------|---------------|
| Header hide/show | Hide on scroll down, show on scroll up |
| Parallax | Hero background at 0.3x scroll speed |
| Reveal on scroll | Elements animate in when 20% visible |
| Smooth scroll | Native CSS scroll-behavior: smooth |

### 6.3 Hover States

| Element | Hover Behavior |
|---------|---------------|
| Cards | translateY(-4px), shadow increase |
| Buttons | Scale 1.02, shadow glow |
| Links | Underline animation (left to right) |
| Faculty photos | Subtle scale 1.05 |
| Nav items | Color transition, underline |
| Image thumbnails | Scale 1.05 with overflow hidden |

### 6.4 Focus States (Accessibility)

```css
/* Standard focus ring */
focus:ring-2 focus:ring-ocean-teal focus:ring-offset-2 focus:outline-none

/* Dark background variant */
focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep

/* Gold CTA variant */
focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2
```

### 6.5 Loading States

| Context | Indicator | Behavior |
|---------|-----------|----------|
| Page navigation | Top progress bar | Linear progress |
| Content loading | Skeleton | Pulse animation |
| Button action | Spinner inline | Replace text |
| Image loading | Blur placeholder | Fade in on load |

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance Checklist

#### Perceivable
- [ ] All images have alt text (automated check)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Information not conveyed by color alone
- [ ] Captions for video content (Phase 2)
- [ ] Text resizable to 200% without loss

#### Operable
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] Skip navigation link present
- [ ] No keyboard traps
- [ ] Focus order follows visual order
- [ ] Touch targets minimum 44x44px

#### Understandable
- [ ] Page language declared (html lang="en")
- [ ] Form labels associated with inputs
- [ ] Error messages descriptive and helpful
- [ ] Consistent navigation across pages

#### Robust
- [ ] Valid HTML structure
- [ ] ARIA roles used appropriately
- [ ] Works with screen readers (VoiceOver, NVDA)
- [ ] Semantic heading hierarchy (h1 → h6)

### 7.2 Color Contrast Verification

| Combination | Contrast Ratio | Status |
|-------------|----------------|--------|
| ocean-deep on warm-50 | 14.2:1 | Pass (AAA) |
| warm-700 on white | 8.3:1 | Pass (AAA) |
| white on ocean-deep | 14.2:1 | Pass (AAA) |
| ocean-teal on white | 4.6:1 | Pass (AA) |
| ucsb-gold on ocean-deep | 8.1:1 | Pass (AAA) |
| warm-600 on warm-50 | 5.1:1 | Pass (AA) |
| bioluminescent on ocean-midnight | 10.3:1 | Pass (AAA) |

### 7.3 Screen Reader Considerations

| Element | Requirement |
|---------|-------------|
| Hero rotating text | aria-live="polite" for updates |
| Navigation menu | aria-expanded for mobile toggle |
| Image indicators | aria-label for carousel controls |
| Faculty photo | Meaningful alt text including name |
| Decorative images | alt="" or aria-hidden="true" |
| Loading states | aria-busy="true" |
| Links opening new tab | aria-label includes "(opens in new tab)" |

### 7.4 Testing Protocol

| Method | Tool | Frequency |
|--------|------|-----------|
| Automated | axe-core via Lighthouse | Every deploy |
| Keyboard | Manual testing | Each page |
| Screen reader | VoiceOver (macOS) | QA phase |
| Color contrast | WebAIM checker | Design phase |
| Mobile a11y | Lighthouse mobile | QA phase |

---

## 8. Technical Implementation Notes

### 8.1 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### 8.2 Mobile-First Considerations

| Element | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Hamburger menu | Horizontal nav |
| Hero height | 100vh | 100vh |
| Grid columns | 1 | 2-4 |
| Font sizes | Fluid (clamp) | Fluid (clamp) |
| Touch targets | 44px minimum | 36px acceptable |
| Padding | px-5 | px-8 |

### 8.3 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | Lighthouse |
| FCP | < 1.8s | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| FID | < 100ms | Lighthouse |
| TTI | < 3.5s | Lighthouse |

### 8.4 Image Optimization Guidelines

| Context | Format | Max Width | Quality |
|---------|--------|-----------|---------|
| Hero background | WebP (JPEG fallback) | 1920px | 80% |
| Faculty photos | WebP | 800px | 85% |
| Card thumbnails | WebP | 600px | 80% |
| Icons | SVG | — | — |
| Logos | SVG (PNG fallback) | — | — |

### 8.5 Asset Delivery Specifications

| Asset Type | Delivery Method |
|------------|-----------------|
| Fonts | Self-hosted via Next.js |
| Icons | Lucide React (tree-shaken) |
| Images | Next.js Image component |
| CSS | Tailwind JIT compilation |

---

## 9. Design Review Checklist

### 9.1 Before Development Handoff

#### Information Architecture
- [ ] Site map approved by stakeholders
- [ ] Navigation structure validated
- [ ] Content hierarchy documented per page

#### Visual Design
- [ ] All Phase 1 pages designed (desktop + mobile)
- [ ] Design system components documented
- [ ] Color usage guidelines clear
- [ ] Typography specifications complete
- [ ] Animation specifications documented

#### Interaction Design
- [ ] All interactive states defined
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Form validation patterns clear

#### Accessibility
- [ ] Color contrast verified
- [ ] Focus states designed
- [ ] Screen reader requirements documented
- [ ] Touch target sizes verified

#### Content
- [ ] Content requirements per page documented
- [ ] Placeholder content identified
- [ ] Image requirements specified

### 9.2 Stakeholder Approval Matrix

| Deliverable | PM | Content Owner | Leadership |
|-------------|----|--------------| -----------|
| Site map | Review | Approve | Inform |
| Homepage design | Review | Review | Approve |
| Research theme template | Review | Approve | Inform |
| Faculty profile template | Review | Approve | Inform |
| Design system | Approve | Inform | Inform |
| Graduate program content | Review | Approve | Approve |

---

## 10. Tech Lead Handoff Summary

### 10.1 Implementation Priority Order

| Priority | Component/Page | Dependencies | Complexity |
|----------|---------------|--------------|------------|
| 1 | Design system CSS classes | None | Low |
| 2 | Core UI components (Button, Card) | Design system | Medium |
| 3 | Layout components (Header, Footer) | UI components | Medium |
| 4 | Homepage sections | All above | High |
| 5 | Faculty directory + profiles | Database schema | High |
| 6 | Research theme pages | Content | Medium |
| 7 | Graduate program pages | Testimonials | Medium |
| 8 | News system | CMS integration | Medium |
| 9 | Admin/self-service | Auth system | High |

### 10.2 Key Technical Decisions for Discussion

| Decision | Options | UX Recommendation |
|----------|---------|-------------------|
| Hero image loading | Eager vs lazy | Eager for first, lazy for others |
| Faculty search | Client vs server | Client-side for <200 records |
| Animation triggers | Intersection Observer | Use IntersectionObserver API |
| Form validation | Client vs server | Client-first, server validation |
| Image optimization | Next.js vs Cloudinary | Next.js Image for simplicity |

### 10.3 Critical Design Constraints

1. **Mobile performance:** LCP must be <2.5s on 3G
2. **Accessibility:** All interactive elements keyboard navigable
3. **Animation:** Respect prefers-reduced-motion
4. **Typography:** Fonts must load before paint (avoid FOUT)
5. **Images:** All images need meaningful alt text
6. **Navigation:** Mobile menu must be accessible without JavaScript

### 10.4 Outstanding Design Questions for Tech Lead

1. **Faculty self-service auth:** SSO integration possible? Or email magic links?
2. **Search implementation:** Should faculty search include fuzzy matching?
3. **Image hosting:** Any constraints on image file sizes for CMS uploads?
4. **Analytics:** Are there specific tracking events needed beyond page views?
5. **Cache strategy:** How should we handle stale content for news/events?

### 10.5 Handoff Assets (To Be Delivered)

| Asset | Format | Location |
|-------|--------|----------|
| Design system | Tailwind config + CSS | Already implemented |
| Component library | React + TypeScript | Already implemented |
| Page layouts | React components | Already implemented |
| Image assets | Original + optimized | `/public/images/` |
| Icon set | Lucide React | Already integrated |
| Typography | Google Fonts config | Already implemented |

---

## Appendix A: Design System Quick Reference

### Color Tokens
```
Primary:   ocean-deep, ocean-blue, ocean-teal, bioluminescent
Warm:      warm-50 through warm-900
Brand:     ucsb-gold, ucsb-navy
Accent:    kelp-400/500/600, sunset-400/500/600
```

### Typography Scale
```
Display XL:  clamp(3rem, 8vw, 5.5rem) — Hero
Display:     clamp(2.5rem, 6vw, 4rem) — Section titles
Display SM:  clamp(2rem, 4vw, 3rem) — Subsection titles
```

### Spacing Scale
```
Section padding:  py-20 md:py-28
Container:        max-w-6xl px-5 sm:px-6 lg:px-8
Card padding:     p-6 or p-8
Gap (grid):       gap-6 or gap-8
```

### Shadow Scale
```
Cards:    shadow-warm
Hover:    shadow-warm-md
Large:    shadow-warm-lg
Glow:     shadow-glow-gold (CTA)
```

---

## Appendix B: Competitive Analysis Summary

| Competitor | Strength | Weakness | Our Differentiation |
|------------|----------|----------|---------------------|
| Stanford Bio | Clean, professional | Cold, impersonal | Warm, human-centered |
| MIT Ecology | Research depth | Dense, academic | Story-driven narratives |
| Hopkins Marine | Beautiful imagery | Limited navigation | Clear audience pathways |
| Scripps | Research focus | Dated design | Modern Pacific Naturalism |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 9, 2026 | UX Engineer | Initial document |

---

*This UX Design Documentation is ready for stakeholder review and Tech Lead handoff.*
