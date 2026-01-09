# Business Requirements Document
## EEMB Website Differentiation Strategy

**Document Version:** 1.0
**Date:** January 9, 2026
**Prepared By:** Business Analyst
**Project:** EEMB Website Redesign 2025-2026
**Status:** Ready for Project Manager Handoff

---

## Executive Summary

The UC Santa Barbara Department of Ecology, Evolution & Marine Biology (EEMB) requires a redesigned website that recruits top graduate students and builds national/international research recognition. The current site functions as a generic digital repository that fails to showcase the people, stories, and distinctive character of the department.

**The Opportunity:** Transform from a static content archive into a dynamic recruitment and reputation-building tool that reflects EEMB's world-class research community and unique coastal research environment.

**Success Criteria:** Increased visitor engagement (retention beyond homepage, multi-page sessions), improved graduate application quality/quantity, and enhanced national visibility.

---

## Table of Contents

1. [Business Problem Statement](#1-business-problem-statement)
2. [Strategic Objectives](#2-strategic-objectives)
3. [Audience Analysis](#3-audience-analysis)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Content Strategy](#6-content-strategy)
7. [Success Metrics](#7-success-metrics)
8. [Risk Assessment](#8-risk-assessment)
9. [Constraints & Assumptions](#9-constraints--assumptions)
10. [Phased Delivery Recommendation](#10-phased-delivery-recommendation)
11. [Handoff Summary](#11-handoff-summary)

---

## 1. Business Problem Statement

### Current State

The existing EEMB website suffers from several critical issues:

| Problem | Impact |
|---------|--------|
| **Generic "digital repository" presentation** | Fails to differentiate EEMB from hundreds of similar departments |
| **Content organized for bureaucracy, not visitors** | Users can't find what they need; high bounce rates |
| **Lack of human stories and personality** | No emotional connection; prospective students can't envision themselves here |
| **"Generic AI vibe" in design** | Undermines credibility and distinctiveness |
| **People and research not featured prominently** | Core assets hidden behind institutional structure |

### Desired Future State

A website that:

- **Recruits** top graduate students by showcasing research opportunities, advisor fit, and student experience
- **Builds recognition** at national and international levels by highlighting research impact and expertise
- **Differentiates** EEMB through distinctive visual design, authentic voice, and place-based identity
- **Serves multiple audiences** with clear pathways while maintaining all required institutional content
- **Stays fresh** with weekly news features and faculty-maintained profiles

### Core Tension to Resolve

All current institutional content must remain accessible, but the organization and presentation must transform from "filing cabinet" to "recruitment and reputation tool."

---

## 2. Strategic Objectives

### Primary Objectives

| Objective | Description | Measurement |
|-----------|-------------|-------------|
| **Graduate Student Recruitment** | Attract high-quality PhD and MS applicants who are well-matched to faculty research | Application volume and quality; "how did you hear about us" tracking |
| **National/International Recognition** | Position EEMB as a leading research department in ecology, evolution, and marine biology | Site traffic from academic/research referrers; media pickups of news stories |

### Secondary Objectives

| Objective | Description | Measurement |
|-----------|-------------|-------------|
| **Faculty Collaboration** | Enable visiting faculty and potential collaborators to discover research synergies | Faculty profile and research page engagement |
| **Donor/Funder Engagement** | Communicate research impact to potential supporters | Support page visits; giving inquiry conversions |
| **Content Sustainability** | Maintain fresh, accurate content with limited staff resources | Faculty profile update frequency; news publication cadence |

---

## 3. Audience Analysis

### 3.1 Primary Audience: Prospective Graduate Students

**Who they are:** Undergraduate students and early-career researchers considering PhD or MS programs in ecology, evolution, or marine biology.

**What's at stake:** One of the biggest decisions of their lives—where to spend 5-7 years and launch their career.

#### Jobs to Be Done

| Job | Underlying Need | How Site Must Help |
|-----|-----------------|-------------------|
| Find an advisor whose research excites me | Intellectual fit | Research browsable by theme/question, not just faculty name |
| Understand what my life would be like here | Cultural and emotional fit | Student voices, photos of place and community, sense of culture |
| Figure out if I can get in and afford it | Practical logistics | Clear application process, funding information, timeline |
| Convince myself this is the right choice | Validation and confidence | Differentiation from other programs, success stories |

#### Key Questions They're Asking

- "Who is doing research I care about?"
- "Would I fit in here? Would I be happy?"
- "Can I afford this? Is funding guaranteed?"
- "What's Santa Barbara actually like?"
- "What do current students say about the program?"

#### Current Failure Modes

- Faculty listed alphabetically with jargon-heavy descriptions
- No student voices or sense of community
- Application information buried or scattered
- No differentiation from other programs

---

### 3.2 Secondary Audience: Faculty Candidates & Collaborators

**Who they are:** Researchers at other institutions considering job applications, sabbaticals, or research collaborations with EEMB faculty.

**What's at stake:** Career decisions and research investment—they're evaluating opportunity cost.

#### Jobs to Be Done

| Job | Underlying Need | How Site Must Help |
|-----|-----------------|-------------------|
| Find researchers working on problems I care about | Research alignment | Search/filter faculty by theme, organism, method |
| Understand what resources exist | Infrastructure assessment | Facilities, equipment, field sites clearly presented |
| Get a sense of intellectual culture | Collaboration potential | Cross-cutting work visible, seminars, centers highlighted |
| See if there's space for my work | Strategic fit | Research priorities and growth areas articulated |

#### Key Questions They're Asking

- "Who should I talk to about [specific topic]?"
- "What equipment and facilities are available?"
- "What's the intellectual environment like?"
- "Are there opportunities for collaboration?"

#### Current Failure Modes

- Can't search or filter faculty by research area
- Facilities and equipment information hidden or absent
- No visibility into collaborative/cross-cutting work

---

### 3.3 Tertiary Audience: Funders & Donors

**Who they are:** Foundations, agencies, alumni, and individuals interested in supporting research.

**What's at stake:** They want their money to create meaningful impact.

#### Jobs to Be Done

| Job | Underlying Need | How Site Must Help |
|-----|-----------------|-------------------|
| Understand what impact my money would create | ROI and meaning | Clear funding priorities, impact stories |
| Trust that these people are credible | Legitimacy verification | Professional presentation, evidence of excellence |
| Find a specific area to support | Targeted giving | Pathways for different giving interests |

#### Key Questions They're Asking

- "What would my donation actually fund?"
- "What has this department accomplished?"
- "How do I give, and to what specifically?"

#### Current Failure Modes

- No clear funding priorities or impact communication
- Generic presentation undermines authority
- No tailored pathways for different funder interests

---

## 4. Functional Requirements

### FR-1: Audience-Aware Navigation Pathways

**Requirement ID:** FR-1
**Priority:** High
**Description:** The site must provide clear entry points for each primary audience that lead to tailored journeys, while maintaining access to all institutional content.

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-1.1 | Prospective student | Immediately see a clear pathway for prospective students | I know this site was built for me | Pathway visible above fold on homepage |
| US-1.2 | Faculty candidate | Find research themes and facilities within 2 clicks | I can quickly assess fit | Maximum 2 clicks from homepage to any research theme or facilities page |
| US-1.3 | Any visitor | Access traditional navigation structure | I can find specific content if I know what I want | Standard menu always accessible |
| US-1.4 | Mobile user | Navigate easily on my phone | I can explore while commuting or between classes | Full functionality at 375px width |

#### Business Rules

- Homepage must present 2-3 audience pathways prominently
- Traditional navigation (People, Research, Academics, etc.) must remain available
- No content should be more than 3 clicks from homepage
- Pathways should not create redundant content—they curate and link to existing pages

---

### FR-2: Research Discovery by Theme

**Requirement ID:** FR-2
**Priority:** High
**Description:** Visitors must be able to explore research by theme and question—not just by individual faculty member.

#### Research Theme Structure

Based on departmental focus, the three primary research themes are:

| Theme | Description | Organizing Questions (Examples) |
|-------|-------------|--------------------------------|
| **Ecology** | How ecosystems function, respond to change, and can be restored | "How do ecosystems respond to climate change?" "What drives biodiversity patterns?" |
| **Evolution** | How life diversifies, adapts, and changes over time | "How do new species form?" "What drives evolutionary change?" |
| **Marine Biology** | Life in ocean environments, from molecules to ecosystems | "Why do kelp forests thrive here but collapse elsewhere?" "How do marine organisms adapt to warming oceans?" |

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-2.1 | Prospective student | Browse research by big questions | I can find work that excites me intellectually | Each theme page leads with compelling questions |
| US-2.2 | Collaborator | See which faculty work within each theme | I can identify potential partners | Faculty listed under each relevant theme (can appear in multiple) |
| US-2.3 | Any visitor | Understand what makes EEMB's research distinctive | I grasp the department's strengths | Theme pages articulate unique capabilities and assets |

#### Business Rules

- Faculty may appear under multiple themes
- Each theme page must include: narrative description, key questions, associated faculty, student opportunities, relevant news
- Theme pages must cross-link to related themes
- Themes should connect to facilities and field sites where relevant

---

### FR-3: Human-Centered Faculty Profiles

**Requirement ID:** FR-3
**Priority:** High
**Description:** Faculty profiles must present researchers as people first, credentials second—while still including all necessary academic information.

#### Profile Structure

| Section | Content | Editable By |
|---------|---------|-------------|
| **Header** | Photo, name, title, contact | Administrator |
| **Research Focus** | 2-3 sentences on current questions (accessible language) | Faculty |
| **What I'm Working On Now** | Current projects, recent excitement | Faculty |
| **Lab Members** | Current students and postdocs | Faculty |
| **Biography** | Background, path to EEMB | Faculty |
| **Publications** | Recent publications, Google Scholar link | Auto-populated + Faculty |
| **Links** | Lab website, ORCID, Twitter/X, etc. | Faculty |

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-3.1 | Prospective student | Immediately understand what a faculty member studies | I can assess fit without decoding jargon | Research focus in accessible language at top of profile |
| US-3.2 | Prospective student | See who currently works in the lab | I can gauge lab size and culture | Lab members section with names and photos |
| US-3.3 | Collaborator | Quickly scan research focus and recent work | I can assess collaboration potential | Key information visible without scrolling |
| US-3.4 | Faculty member | Update my own profile easily | My information stays current without waiting for admin | Self-service editing interface |
| US-3.5 | Administrator | Ensure all profiles meet minimum standards | Site quality is consistent | Required fields enforced; photo requirements specified |

#### Business Rules

- Profile must lead with research questions/focus, not title or credentials
- High-quality photo required (minimum 400x400 pixels)
- Faculty must be able to update their own profiles without administrator intervention
- Profiles must link to at least one external resource (lab website, Google Scholar, or ORCID)

---

### FR-4: Graduate Student Experience Showcase

**Requirement ID:** FR-4
**Priority:** High
**Description:** The site must convey what it's actually like to be a graduate student at EEMB—beyond curriculum and requirements.

#### Content Components

| Component | Purpose | Source |
|-----------|---------|--------|
| **Student Testimonials** | First-person accounts of the experience | Interviews with current students |
| **Visual Content** | Photos of fieldwork, labs, Santa Barbara, social events | Photography initiative |
| **Day-in-the-Life** | Concrete examples of what students actually do | Student contributions |
| **Funding Information** | Clear explanation of financial support | Program administration |
| **Application Guide** | Step-by-step process with timeline | Program administration |
| **FAQ** | Answers to common concerns | Compiled from actual questions |

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-4.1 | Prospective student | Hear from current students about their experience | I can see myself here | Minimum 3-5 student profiles/quotes |
| US-4.2 | Prospective student | See photos of fieldwork, labs, and life in Santa Barbara | I get an emotional sense of the community | Visual content throughout section |
| US-4.3 | Prospective student | Find clear application steps and deadlines | I don't feel lost in bureaucracy | Timeline visualization with key dates |
| US-4.4 | Prospective student | Understand how funding works | I know I can afford this | Funding page with clear, honest information |
| US-4.5 | Prospective student | Get answers to common questions | I don't have to email for basic info | FAQ section addressing top concerns |

#### Business Rules

- Student testimonials must include photos and real names (with permission)
- Application deadlines must be prominently displayed and kept current
- Funding information must be specific and accurate (e.g., "100% of PhD students funded")
- Visual content must reflect actual EEMB environment (Pacific Naturalism aesthetic)

---

### FR-5: Facilities and Resources Discovery

**Requirement ID:** FR-5
**Priority:** Medium
**Description:** Faculty candidates and collaborators must be able to discover what infrastructure, equipment, and research sites are available.

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-5.1 | Faculty candidate | See what lab spaces and equipment exist | I can evaluate research potential | Facilities section with photos and descriptions |
| US-5.2 | Collaborator | Find specialized capabilities | I know if EEMB can support my research needs | Capabilities organized by type |
| US-5.3 | Prospective student | Understand what field sites I could access | I can envision my research | Field sites (LTER, marine stations) highlighted |

#### Business Rules

- Must highlight unique/distinctive assets (LTER sites, Sedgwick Reserve, Marine Science Institute, etc.)
- Photos required for all major facilities
- Links to relevant core facility websites

---

### FR-6: Story-Driven News and Content

**Requirement ID:** FR-6
**Priority:** High
**Description:** News must be framed as stories of discovery and impact, published weekly to maintain freshness and engagement.

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-6.1 | Any visitor | Read engaging stories about research discoveries | I feel the excitement of the work | News articles lead with discovery, not credentials |
| US-6.2 | Funder | See concrete examples of research impact | I trust my money would matter | Impact clearly articulated in stories |
| US-6.3 | Administrator | Publish news weekly without technical barriers | Content stays fresh | Simple publishing workflow |
| US-6.4 | Any visitor | Find news relevant to my interests | I don't have to scroll through everything | News filterable by research theme |

#### News Article Requirements

- Lead with the discovery or question, not the researcher's title
- Include researcher photos and quotes
- Connect to broader significance ("why this matters")
- 300-600 words ideal length
- Categorized by research theme for filtering
- Featured/highlighted capability for homepage

#### Business Rules

- Target: Minimum 1 news article per week
- All news articles must include at least one image
- Homepage must feature 2-3 recent/highlighted news items
- News archive must be searchable and filterable

---

### FR-7: Support and Giving Pathways

**Requirement ID:** FR-7
**Priority:** Medium
**Description:** Funders and donors must be able to understand giving opportunities and take action.

#### User Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-7.1 | Potential donor | Understand how I could support EEMB | I can make an informed decision | Clear giving priorities and options |
| US-7.2 | Potential donor | Take action to give | I can complete my intention | Clear call-to-action and giving mechanism |
| US-7.3 | Funder | See evidence of research impact | I trust my investment | Impact stories and metrics accessible |

#### Business Rules

- Support page must articulate specific funding priorities
- Must link to university giving infrastructure
- Should highlight impact stories relevant to funders

---

## 5. Non-Functional Requirements

### NFR-1: Visual Distinctiveness

**Requirement:** The site must have a distinctive visual identity that differentiates EEMB from generic academic websites.

| Attribute | Requirement |
|-----------|-------------|
| **Design System** | Pacific Naturalism v4.0 (per CLAUDE.md) |
| **Photography** | Real photos of EEMB people, places, and research—no stock photos |
| **Typography** | Fraunces (headings) + DM Sans (body) |
| **Color Palette** | Ocean depths + warm neutrals + UCSB gold accents |
| **Test** | "Could this be any department?" If yes, design has failed |

### NFR-2: Mobile Responsiveness

**Requirement:** Full functionality and excellent experience on mobile devices.

| Attribute | Requirement |
|-----------|-------------|
| **Minimum Width** | 375px (iPhone SE) |
| **Approach** | Mobile-first design |
| **Touch Targets** | Minimum 44x44 pixels |
| **Testing** | All pages tested on actual mobile devices |

### NFR-3: Performance

**Requirement:** Fast load times to minimize bounce rate.

| Metric | Target |
|--------|--------|
| **Initial Page Load** | <3 seconds |
| **Largest Contentful Paint** | <2.5 seconds |
| **Time to Interactive** | <3.5 seconds |
| **Image Optimization** | Next.js Image component for all images |

### NFR-4: Content Maintainability

**Requirement:** Non-technical users must be able to update content.

| Capability | Requirement |
|------------|-------------|
| **News Publishing** | Administrator can publish without developer |
| **Faculty Profiles** | Faculty can edit own profiles |
| **Event Updates** | Administrator can add/edit events |
| **Content Editor** | WYSIWYG or markdown with preview |

### NFR-5: Accessibility

**Requirement:** Site must be accessible to users with disabilities.

| Standard | Requirement |
|----------|-------------|
| **Compliance Level** | WCAG 2.1 AA |
| **Screen Readers** | Full compatibility |
| **Keyboard Navigation** | All functionality accessible |
| **Color Contrast** | Minimum 4.5:1 for body text |
| **Alt Text** | Required for all images |

### NFR-6: Search Engine Optimization

**Requirement:** Site must be discoverable through search engines.

| Attribute | Requirement |
|-----------|-------------|
| **Meta Tags** | Unique title and description per page |
| **Semantic HTML** | Proper heading hierarchy |
| **Structured Data** | Schema.org markup for faculty, events |
| **Sitemap** | Auto-generated XML sitemap |

---

## 6. Content Strategy

### 6.1 Content Inventory: Transform, Don't Delete

All current content must remain accessible. The transformation is in organization and presentation.

| Current Content | Transformation |
|-----------------|----------------|
| Faculty listings | → Searchable by theme; human-first profile format |
| Research descriptions | → Question-led narratives grouped by theme |
| Program requirements | → Student journey with clear pathways |
| News items | → Story-driven format with discovery framing |
| Course listings | → Contextualized within student experience |
| Policies and procedures | → Support section with clear organization |

### 6.2 New Content Requirements

| Content Need | Purpose | Effort | Owner |
|--------------|---------|--------|-------|
| **Student testimonials** (3-5) | Emotional proof for recruitment | Medium | Administrator to coordinate |
| **"What I'm working on now"** for faculty | Freshness, accessibility | Low | Faculty (self-service) |
| **Research theme narratives** | Organizing framework | Medium | Administrator with faculty input |
| **Application journey content** | Reduce friction for applicants | Low | Reframe existing info |
| **Facilities photography** | Faculty candidate needs | Medium | Photography initiative |
| **Place-based photography** | Pacific Naturalism aesthetic | Medium | Photography initiative |

### 6.3 Content Governance

| Content Type | Update Frequency | Owner | Review Cycle |
|--------------|------------------|-------|--------------|
| News articles | Weekly | Administrator | Ongoing |
| Faculty profiles | As needed | Individual faculty | Annual reminder |
| Student testimonials | Annual | Administrator | Annual |
| Application info | Annual + deadlines | Administrator | August (before cycle) |
| Research themes | Annual | Administrator + faculty | Summer |

### 6.4 Photography Requirements

To support the Pacific Naturalism visual identity:

| Category | Examples | Priority |
|----------|----------|----------|
| **People** | Faculty in labs/field, students at work, group photos | High |
| **Places** | Campus, coast, field sites, labs | High |
| **Research** | Organisms, equipment, fieldwork in action | Medium |
| **Community** | Events, seminars, social gatherings | Medium |

**Technical Requirements:**
- Minimum resolution: 1920x1080 for hero images
- Minimum resolution: 800x800 for profile photos
- Format: High-quality JPEG or WebP
- Style: Natural light preferred; authentic moments over posed shots

---

## 7. Success Metrics

### 7.1 Primary Metrics (Recruitment & Engagement)

| Metric | What It Measures | Current Baseline | Target | Measurement Method |
|--------|------------------|------------------|--------|-------------------|
| **Bounce rate** | First impression effectiveness | TBD | <40% | Google Analytics |
| **Pages per session** | Engagement depth | TBD | >3 pages | Google Analytics |
| **Time on site** | Content value | TBD | >2 minutes | Google Analytics |
| **Graduate applications** | Recruitment impact | TBD | +15% YoY | Application system |
| **Application quality** | Right-fit applicants | TBD | Qualitative assessment | Admissions committee |

### 7.2 Secondary Metrics (Recognition & Sustainability)

| Metric | What It Measures | Target | Measurement Method |
|--------|------------------|--------|-------------------|
| **Faculty profile views** | Research discovery | Increase from baseline | Google Analytics |
| **Research theme engagement** | Content organization | Even distribution | Google Analytics |
| **News article views** | Story engagement | >100 views per article | Google Analytics |
| **External referrals** | Recognition/reach | Increase from baseline | Google Analytics |
| **Faculty profile freshness** | Content sustainability | >80% updated within 12 months | CMS report |

### 7.3 Qualitative Success Indicators

- Prospective students report finding advisor matches easily
- Faculty candidates comment positively on site during interviews
- News stories picked up by external outlets
- Reduced email inquiries for information available on site
- Positive feedback from department leadership and faculty

---

## 8. Risk Assessment

### High-Impact Risks

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| **Content maintenance burden exceeds capacity** | Site becomes stale; loses credibility | High | Faculty self-service for profiles; administrator focuses only on news/stories; clear governance model |
| **Faculty don't update their profiles** | Human-centered approach fails; information becomes inaccurate | Medium | Make updates extremely easy; show faculty the value; send periodic reminders; consider "last updated" visibility |
| **Photography assets insufficient** | Pacific Naturalism aesthetic fails; site looks generic | Medium | Prioritize photography initiative early; identify existing assets; plan photo sessions |

### Medium-Impact Risks

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| **Scope creep delays launch** | Momentum lost; deadlines missed | Medium | Strict phase 1 scope; defer nice-to-haves to phase 2 |
| **Student testimonials difficult to obtain** | Key recruitment content missing | Medium | Identify willing students early; offer incentives; keep asks simple |
| **Research theme organization doesn't resonate** | Navigation confusing; content hard to find | Low | Validate with faculty and students before build; iterate based on feedback |

### Low-Impact Risks

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| **Technical implementation issues** | Delays | Low | Proven tech stack (Next.js + Supabase); experienced development |
| **Accessibility compliance gaps** | Legal/ethical issues | Low | Build accessibility in from start; test with screen readers |

---

## 9. Constraints & Assumptions

### Constraints

| Constraint | Implication |
|------------|-------------|
| **Single administrator for content** | Must minimize maintenance burden; faculty self-service critical |
| **All current content must remain** | Reorganization, not deletion; information architecture is key |
| **Faculty must be able to edit own profiles** | Self-service interface required in CMS |
| **Weekly news publishing cadence** | Streamlined publishing workflow essential |
| **Application deadlines are fixed** | Site must surface deadline information prominently |
| **Existing tech stack (Next.js + Supabase)** | Build within current architecture |

### Assumptions

| Assumption | Risk if Wrong |
|------------|---------------|
| **Faculty will update profiles if made easy** | Key content becomes stale |
| **3-5 students available for testimonials** | Recruitment content gap |
| **Photography can be obtained** | Visual identity compromised |
| **Research themes (Ecology, Evolution, Marine Biology) are correct organizing principle** | Navigation confusion; rework needed |
| **Baseline metrics can be established** | Can't measure improvement |

---

## 10. Phased Delivery Recommendation

### Phase 1: Core Launch (Priority)

**Goal:** Launch a differentiated site that serves primary recruitment and recognition objectives.

| Component | Requirements Addressed |
|-----------|----------------------|
| **Homepage redesign** | FR-1 (Audience pathways) |
| **Research theme pages** | FR-2 (Research discovery) |
| **Faculty profile redesign** | FR-3 (Human-centered profiles) |
| **Graduate program section** | FR-4 (Student experience) |
| **News with story format** | FR-6 (Story-driven content) |
| **Core navigation** | FR-1 (Traditional nav maintained) |
| **Mobile responsiveness** | NFR-2 |
| **Faculty self-service** | NFR-4 |

**Content Dependencies for Phase 1:**
- [ ] Student testimonials gathered (minimum 3)
- [ ] Research theme narratives written
- [ ] Photography initiative completed (minimum viable)
- [ ] Faculty profiles migrated and enhanced
- [ ] Application timeline/deadlines confirmed

### Phase 2: Enhancement (Post-Launch)

**Goal:** Add secondary features and expand content based on Phase 1 learnings.

| Component | Requirements Addressed |
|-----------|----------------------|
| **Facilities showcase** | FR-5 |
| **Enhanced funder pathways** | FR-7 |
| **Video content integration** | FR-4 enhancement |
| **Advanced search/filtering** | FR-2, FR-3 enhancement |
| **Events calendar enhancement** | New |
| **Alumni stories** | FR-4 enhancement |

### Phase 3: Optimization (Ongoing)

**Goal:** Iterate based on metrics and feedback.

| Activity | Purpose |
|----------|---------|
| **Analytics review** | Identify underperforming pages |
| **User feedback integration** | Address pain points |
| **Content expansion** | Fill gaps identified post-launch |
| **Performance optimization** | Improve load times |

---

## 11. Handoff Summary for Project Manager

### What We're Building

A differentiated department website that recruits graduate students and builds national/international recognition by showcasing EEMB's people, research stories, and distinctive coastal research environment—while maintaining all required institutional content in a more engaging organization.

### Critical Success Factors

1. **Audience pathways** on homepage that signal "this site is for you"
2. **Research discovery by theme** (Ecology, Evolution, Marine Biology)—not just alphabetical faculty lists
3. **Human-first faculty profiles** with current research questions and self-service editing
4. **Graduate student experience** content with real student voices and visuals
5. **Weekly news rhythm** with story-driven format
6. **Visual distinctiveness** through Pacific Naturalism aesthetic and real photography

### Key Decisions Needed

| Decision | Owner | Deadline |
|----------|-------|----------|
| Validate research theme structure with faculty | Department leadership | Before design |
| Identify students for testimonials | Administrator | Before content development |
| Photography plan and timeline | Administrator + leadership | Before design |
| Phase 1 scope confirmation | Project Manager + stakeholders | Project kickoff |

### Stakeholders to Engage

| Stakeholder | Role in Project |
|-------------|-----------------|
| Department Chair/Leadership | Approve messaging, research themes, strategic direction |
| Faculty | Profile content, research theme validation, testimonials facilitation |
| Current graduate students | Testimonials, experience content, user testing |
| Administrator (Content Owner) | All content creation and ongoing maintenance |
| Communications/Marketing | Brand alignment, photography coordination |

### Content Readiness Checklist

Before development begins:

- [ ] Research theme narratives drafted
- [ ] Student testimonial participants identified
- [ ] Photography inventory assessed; gaps identified
- [ ] Application deadlines and timeline confirmed
- [ ] Existing content audited for migration
- [ ] News backlog identified for launch content

### Timeline Considerations

| Milestone | Dependency |
|-----------|------------|
| **Application deadlines** | Site must surface deadlines prominently; coordinate with admissions calendar |
| **News features** | Weekly cadence begins at launch; need content pipeline |
| **Faculty profiles** | Allow time for faculty to update; send reminders |
| **Photography** | May require scheduling around academic calendar |

### Questions for Project Manager to Address

1. What is the target launch date, and how does it align with application cycles?
2. Who from UX/Design will lead the visual implementation of Pacific Naturalism?
3. What is the budget/timeline for photography initiative?
4. How will faculty be onboarded to self-service profile editing?
5. What analytics are currently in place to establish baselines?

---

## Appendix A: User Story Summary

| ID | Priority | User Story |
|----|----------|------------|
| US-1.1 | High | As a prospective student, I want to immediately see a clear pathway for prospective students so that I know this site was built for me |
| US-1.2 | High | As a faculty candidate, I want to find research themes and facilities within 2 clicks so that I can quickly assess fit |
| US-1.3 | Medium | As any visitor, I want to access traditional navigation structure so that I can find specific content if I know what I want |
| US-1.4 | High | As a mobile user, I want to navigate easily on my phone so that I can explore while commuting or between classes |
| US-2.1 | High | As a prospective student, I want to browse research by big questions so that I can find work that excites me intellectually |
| US-2.2 | High | As a collaborator, I want to see which faculty work within each theme so that I can identify potential partners |
| US-2.3 | Medium | As any visitor, I want to understand what makes EEMB's research distinctive so that I grasp the department's strengths |
| US-3.1 | High | As a prospective student, I want to immediately understand what a faculty member studies so that I can assess fit without decoding jargon |
| US-3.2 | High | As a prospective student, I want to see who currently works in the lab so that I can gauge lab size and culture |
| US-3.3 | High | As a collaborator, I want to quickly scan research focus and recent work so that I can assess collaboration potential |
| US-3.4 | High | As a faculty member, I want to update my own profile easily so that my information stays current without waiting for admin |
| US-3.5 | Medium | As an administrator, I want to ensure all profiles meet minimum standards so that site quality is consistent |
| US-4.1 | High | As a prospective student, I want to hear from current students about their experience so that I can see myself here |
| US-4.2 | High | As a prospective student, I want to see photos of fieldwork, labs, and life in Santa Barbara so that I get an emotional sense of the community |
| US-4.3 | High | As a prospective student, I want to find clear application steps and deadlines so that I don't feel lost in bureaucracy |
| US-4.4 | High | As a prospective student, I want to understand how funding works so that I know I can afford this |
| US-4.5 | Medium | As a prospective student, I want to get answers to common questions so that I don't have to email for basic info |
| US-5.1 | Medium | As a faculty candidate, I want to see what lab spaces and equipment exist so that I can evaluate research potential |
| US-5.2 | Medium | As a collaborator, I want to find specialized capabilities so that I know if EEMB can support my research needs |
| US-5.3 | Medium | As a prospective student, I want to understand what field sites I could access so that I can envision my research |
| US-6.1 | High | As any visitor, I want to read engaging stories about research discoveries so that I feel the excitement of the work |
| US-6.2 | Medium | As a funder, I want to see concrete examples of research impact so that I trust my money would matter |
| US-6.3 | High | As an administrator, I want to publish news weekly without technical barriers so that content stays fresh |
| US-6.4 | Medium | As any visitor, I want to find news relevant to my interests so that I don't have to scroll through everything |
| US-7.1 | Medium | As a potential donor, I want to understand how I could support EEMB so that I can make an informed decision |
| US-7.2 | Medium | As a potential donor, I want to take action to give so that I can complete my intention |
| US-7.3 | Medium | As a funder, I want to see evidence of research impact so that I trust my investment |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **EEMB** | Department of Ecology, Evolution & Marine Biology at UC Santa Barbara |
| **Pacific Naturalism** | The design system and brand identity for the EEMB website |
| **LTER** | Long-Term Ecological Research—NSF-funded research sites |
| **Bounce Rate** | Percentage of visitors who leave after viewing only one page |
| **CMS** | Content Management System (Supabase in this project) |
| **Above the Fold** | Content visible without scrolling on initial page load |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 9, 2026 | Business Analyst | Initial document |

---

*This document is ready for handoff to the Project Manager for planning and execution.*
