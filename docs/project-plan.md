# Project Plan
## EEMB Website Redesign - Execution Framework

**Document Version:** 1.0
**Date:** January 9, 2026
**Prepared By:** Project Manager
**Project:** EEMB Website Redesign 2025-2026
**Status:** Ready for Team Kickoff

---

## Executive Summary

This Project Plan transforms the validated Business Requirements Document into an executable framework for the EEMB website redesign. The project will deliver a differentiated department website that recruits top graduate students and builds national/international research recognition.

**Project Approach:** Hybrid Agile—structured phases with iterative delivery within each phase
**Target:** Phase 1 Core Launch aligned with graduate application cycle
**Team Model:** Sequential specialist handoffs with parallel workstreams where dependencies allow

---

## Table of Contents

1. [Requirements Validation Summary](#1-requirements-validation-summary)
2. [Work Breakdown Structure](#2-work-breakdown-structure)
3. [Project Phases & Milestones](#3-project-phases--milestones)
4. [Resource Allocation](#4-resource-allocation)
5. [Dependency Management](#5-dependency-management)
6. [Risk Management Plan](#6-risk-management-plan)
7. [Communication & Governance](#7-communication--governance)
8. [Quality Gates](#8-quality-gates)
9. [Specialist Handoff Plans](#9-specialist-handoff-plans)
10. [Success Criteria & Acceptance](#10-success-criteria--acceptance)

---

## 1. Requirements Validation Summary

### 1.1 BRD Assessment

The Business Requirements Document is **comprehensive and ready for execution** with the following observations:

| Aspect | Assessment | Notes |
|--------|------------|-------|
| **Completeness** | ✅ Complete | All functional and non-functional requirements documented |
| **Clarity** | ✅ Clear | User stories with acceptance criteria provided |
| **Feasibility** | ✅ Feasible | Existing tech stack (Next.js + Supabase) supports all requirements |
| **Prioritization** | ✅ Prioritized | Phase 1 vs Phase 2 clearly delineated |
| **Success Criteria** | ✅ Defined | Measurable metrics with baseline establishment plan |

### 1.2 Scope Confirmation: Phase 1 (Core Launch)

Phase 1 includes the following deliverables:

| Component | Requirements | Priority |
|-----------|--------------|----------|
| Homepage redesign | FR-1 (Audience pathways) | **Critical** |
| Research theme pages (3) | FR-2 (Research discovery) | **Critical** |
| Faculty profile redesign | FR-3 (Human-centered profiles) | **Critical** |
| Graduate program section | FR-4 (Student experience) | **Critical** |
| News system with story format | FR-6 (Story-driven content) | **Critical** |
| Core navigation | FR-1 (Traditional nav) | **High** |
| Mobile responsiveness | NFR-2 | **High** |
| Faculty self-service CMS | NFR-4 | **High** |

### 1.3 Out of Scope for Phase 1

The following are explicitly deferred to Phase 2:
- Facilities showcase (FR-5)
- Enhanced funder pathways (FR-7)
- Video content integration
- Advanced search/filtering
- Events calendar enhancement
- Alumni stories

### 1.4 Key Decisions Required Before Kickoff

| Decision | Owner | Required By | Impact if Delayed |
|----------|-------|-------------|-------------------|
| Validate research theme structure | Department Leadership | Design Phase Start | Blocks information architecture |
| Identify testimonial participants | Administrator | Content Development Start | Blocks student experience content |
| Photography plan approval | Administrator + Leadership | Design Phase Start | Blocks visual design execution |
| Baseline analytics setup | Tech Lead | Development Start | Cannot measure success |

---

## 2. Work Breakdown Structure

### 2.1 WBS by Specialist Role

```
EEMB Website Redesign
├── 1.0 PROJECT MANAGEMENT
│   ├── 1.1 Project initiation and planning
│   ├── 1.2 Stakeholder communication
│   ├── 1.3 Risk monitoring
│   ├── 1.4 Progress tracking and reporting
│   └── 1.5 Phase transitions and handoffs
│
├── 2.0 UX/UI DESIGN (UX Engineer)
│   ├── 2.1 Discovery & Research
│   │   ├── 2.1.1 Stakeholder interviews
│   │   ├── 2.1.2 Competitor analysis
│   │   ├── 2.1.3 User journey mapping
│   │   └── 2.1.4 Information architecture validation
│   ├── 2.2 Design System Enhancement
│   │   ├── 2.2.1 Pacific Naturalism v4.0 component library
│   │   ├── 2.2.2 Typography and color refinement
│   │   └── 2.2.3 Responsive design patterns
│   ├── 2.3 Page Design
│   │   ├── 2.3.1 Homepage wireframes and mockups
│   │   ├── 2.3.2 Research theme page templates
│   │   ├── 2.3.3 Faculty profile redesign
│   │   ├── 2.3.4 Graduate program section
│   │   └── 2.3.5 News page templates
│   ├── 2.4 Interaction Design
│   │   ├── 2.4.1 Navigation patterns
│   │   ├── 2.4.2 Micro-interactions
│   │   └── 2.4.3 Animation specifications
│   └── 2.5 Design Review & Iteration
│       ├── 2.5.1 Stakeholder review cycles
│       └── 2.5.2 Design system documentation
│
├── 3.0 TECHNICAL ARCHITECTURE (Tech Lead)
│   ├── 3.1 Architecture Planning
│   │   ├── 3.1.1 System architecture review
│   │   ├── 3.1.2 Database schema design
│   │   ├── 3.1.3 API design
│   │   └── 3.1.4 Performance strategy
│   ├── 3.2 Infrastructure Setup
│   │   ├── 3.2.1 Development environment
│   │   ├── 3.2.2 CI/CD pipeline
│   │   ├── 3.2.3 Staging environment
│   │   └── 3.2.4 Analytics integration
│   └── 3.3 Technical Documentation
│       ├── 3.3.1 Architecture decision records
│       └── 3.3.2 Developer guidelines
│
├── 4.0 FRONTEND DEVELOPMENT
│   ├── 4.1 Component Development
│   │   ├── 4.1.1 Design system components
│   │   ├── 4.1.2 Page layouts
│   │   └── 4.1.3 Interactive elements
│   ├── 4.2 Page Implementation
│   │   ├── 4.2.1 Homepage
│   │   ├── 4.2.2 Research theme pages (3)
│   │   ├── 4.2.3 Faculty profiles
│   │   ├── 4.2.4 Graduate program section
│   │   ├── 4.2.5 News listing and articles
│   │   └── 4.2.6 Navigation system
│   ├── 4.3 Integration
│   │   ├── 4.3.1 CMS integration
│   │   ├── 4.3.2 Dynamic content rendering
│   │   └── 4.3.3 Search functionality
│   └── 4.4 Optimization
│       ├── 4.4.1 Performance optimization
│       ├── 4.4.2 SEO implementation
│       └── 4.4.3 Accessibility compliance
│
├── 5.0 BACKEND/CMS DEVELOPMENT
│   ├── 5.1 Content Models
│   │   ├── 5.1.1 Faculty profile model
│   │   ├── 5.1.2 Research theme model
│   │   ├── 5.1.3 News article model
│   │   └── 5.1.4 Student testimonial model
│   ├── 5.2 Self-Service Features
│   │   ├── 5.2.1 Faculty profile editing interface
│   │   ├── 5.2.2 Permission management
│   │   └── 5.2.3 Content validation
│   └── 5.3 API Development
│       ├── 5.3.1 Content APIs
│       ├── 5.3.2 Search APIs
│       └── 5.3.3 Analytics integration
│
├── 6.0 CONTENT DEVELOPMENT
│   ├── 6.1 Content Strategy Execution
│   │   ├── 6.1.1 Research theme narratives (3)
│   │   ├── 6.1.2 Student testimonials (3-5)
│   │   ├── 6.1.3 Faculty profile migration
│   │   └── 6.1.4 Application journey content
│   ├── 6.2 Photography
│   │   ├── 6.2.1 Photography planning
│   │   ├── 6.2.2 Photo sessions
│   │   └── 6.2.3 Image processing and optimization
│   └── 6.3 Content Population
│       ├── 6.3.1 CMS content entry
│       └── 6.3.2 Content review and approval
│
├── 7.0 QUALITY ASSURANCE
│   ├── 7.1 Testing
│   │   ├── 7.1.1 Unit testing
│   │   ├── 7.1.2 Integration testing
│   │   ├── 7.1.3 End-to-end testing
│   │   ├── 7.1.4 Cross-browser testing
│   │   ├── 7.1.5 Mobile device testing
│   │   └── 7.1.6 Accessibility testing
│   └── 7.2 User Acceptance Testing
│       ├── 7.2.1 Stakeholder UAT
│       ├── 7.2.2 Student user testing
│       └── 7.2.3 Faculty user testing
│
└── 8.0 DEPLOYMENT & LAUNCH
    ├── 8.1 Pre-Launch
    │   ├── 8.1.1 Final content review
    │   ├── 8.1.2 Performance validation
    │   └── 8.1.3 SEO verification
    ├── 8.2 Launch
    │   ├── 8.2.1 Production deployment
    │   ├── 8.2.2 DNS/domain configuration
    │   └── 8.2.3 Monitoring setup
    └── 8.3 Post-Launch
        ├── 8.3.1 Hypercare support
        ├── 8.3.2 Bug fixes
        └── 8.3.3 Analytics baseline establishment
```

### 2.2 WBS Summary by Effort Area

| Area | Work Packages | Critical Dependencies |
|------|---------------|----------------------|
| **UX/UI Design** | 5 packages, 12 work items | Stakeholder decisions, content readiness |
| **Technical Architecture** | 3 packages, 8 work items | Design completion |
| **Frontend Development** | 4 packages, 13 work items | Design + Architecture completion |
| **Backend/CMS Development** | 3 packages, 8 work items | Architecture completion |
| **Content Development** | 3 packages, 7 work items | Content readiness decisions |
| **Quality Assurance** | 2 packages, 9 work items | Development completion |
| **Deployment** | 3 packages, 8 work items | QA completion |

---

## 3. Project Phases & Milestones

### 3.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: INITIATION                                                         │
│ Kickoff, stakeholder alignment, content readiness decisions                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: DISCOVERY & DESIGN                                                 │
│ UX research, information architecture, visual design                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: ARCHITECTURE & SETUP                                               │
│ Technical architecture, infrastructure, development environment             │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: DEVELOPMENT                                                        │
│ Frontend + Backend implementation, CMS build, content integration           │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: QUALITY ASSURANCE                                                  │
│ Testing, UAT, accessibility audit, performance optimization                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: LAUNCH & STABILIZATION                                             │
│ Production deployment, hypercare, baseline metrics                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Milestone Schedule

| Milestone | Phase | Deliverables | Quality Gate |
|-----------|-------|--------------|--------------|
| **M0: Project Kickoff** | 0 | Project charter signed, team aligned | Stakeholder approval |
| **M1: Content Readiness** | 0 | Research themes validated, testimonial participants identified, photography plan approved | Content owner sign-off |
| **M2: Design Complete** | 1 | All page designs approved, design system documented | Stakeholder design approval |
| **M3: Architecture Approved** | 2 | Technical architecture documented, environments ready | Tech Lead sign-off |
| **M4: Development Complete** | 3 | All Phase 1 features implemented, content populated | Code complete criteria met |
| **M5: QA Passed** | 4 | All tests passing, accessibility compliant | QA sign-off |
| **M6: Launch Ready** | 5 | Pre-launch checklist complete | Go/No-Go decision |
| **M7: Launch Complete** | 5 | Site live, monitoring active | Production validation |
| **M8: Baseline Established** | 5 | Analytics baseline documented | Metrics available |

### 3.3 Critical Path

The critical path runs through:

```
Content Decisions → Design → Frontend Development → QA → Launch
       ↓
  Photography → Visual Assets Integration
```

**Critical Path Activities:**
1. Research theme validation (blocks information architecture)
2. Homepage design (blocks most other page designs)
3. Design system components (blocks all frontend development)
4. Faculty profile CMS model (blocks profile migration)
5. Content population (blocks UAT)
6. Accessibility testing (blocks launch)

---

## 4. Resource Allocation

### 4.1 Specialist Role Assignments

| Role | Primary Responsibilities | Phase Involvement |
|------|-------------------------|-------------------|
| **Project Manager** | Planning, coordination, stakeholder communication, risk management | All phases |
| **UX Engineer** | User research, information architecture, visual design, design system | Phases 1-3 (primary), 4-5 (support) |
| **Tech Lead** | Architecture, infrastructure, technical decisions, code review | Phases 2-5 |
| **Frontend Developer(s)** | Component development, page implementation, integration | Phases 3-5 |
| **Backend Developer** | CMS configuration, API development, self-service features | Phases 3-5 |
| **Content Owner (Administrator)** | Content creation, CMS population, photography coordination | Phases 0-5 |
| **QA Engineer** | Test planning, test execution, accessibility validation | Phases 3-5 |

### 4.2 Effort Distribution by Phase

| Phase | PM | UX | Tech Lead | Frontend | Backend | Content | QA |
|-------|----|----|-----------|----------|---------|---------|-----|
| 0: Initiation | High | Medium | Low | - | - | High | - |
| 1: Design | Medium | **High** | Low | - | - | Medium | Low |
| 2: Architecture | Medium | Medium | **High** | Low | Medium | Low | Low |
| 3: Development | Medium | Low | Medium | **High** | **High** | **High** | Medium |
| 4: QA | Medium | Low | Low | Medium | Medium | Medium | **High** |
| 5: Launch | High | Low | Medium | Low | Low | Medium | Medium |

### 4.3 Parallel Workstreams

The following workstreams can proceed in parallel:

**Parallel Stream A: Design + Content Preparation**
- UX design proceeds
- Simultaneously: Student testimonials gathered, photography planned

**Parallel Stream B: Frontend + Backend Development**
- Frontend component development
- Backend CMS model development
- Integration points coordinated

**Parallel Stream C: Development + Content Population**
- Late-stage development
- Content entry into CMS
- Integration testing

---

## 5. Dependency Management

### 5.1 External Dependencies

| Dependency | Owner | Required By | Mitigation if Delayed |
|------------|-------|-------------|----------------------|
| Research theme validation | Department Leadership | M1 | Use draft themes, iterate post-feedback |
| Student testimonial content | Current students | M4 | Reduce from 5 to 3, use quotes if full profiles unavailable |
| Photography assets | Photography initiative | M3 | Use existing best assets, plan Phase 2 enhancement |
| Faculty profile updates | Individual faculty | M4 | Use existing content, flag for post-launch updates |
| Application deadline information | Admissions | M4 | Use prior year info with "dates TBD" note |

### 5.2 Internal Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPENDENCY MAP                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Research Theme Validation (External)
         │
         ▼
Information Architecture ──────────────────┐
         │                                  │
         ▼                                  │
   Page Designs ◄───── Design System ◄─────┤
         │                    │             │
         ▼                    ▼             │
   Design Approval ───► Component Dev      │
         │                    │             │
         │                    ▼             │
         │              Page Implementation │
         │                    │             │
         │                    ▼             │
         └──────────► CMS Integration ◄────┘
                           │
                           ▼
                    Content Population
                           │
                           ▼
                     QA Testing
                           │
                           ▼
                       Launch
```

### 5.3 Dependency Risk Register

| Dependency | Risk Level | Impact | Monitoring Approach |
|------------|------------|--------|---------------------|
| Design → Development | **High** | Delays cascade through all development | Weekly design/dev sync |
| Content → Launch | **High** | Empty site cannot launch | Content progress tracking |
| Photography → Design | **Medium** | Visual quality compromised | Fallback asset identification |
| Faculty Updates → Profile Launch | **Medium** | Profiles incomplete | Faculty communication plan |

---

## 6. Risk Management Plan

### 6.1 Risk Register

#### High-Priority Risks

| ID | Risk | Probability | Impact | Score | Mitigation Strategy | Owner |
|----|------|-------------|--------|-------|---------------------|-------|
| R1 | Content maintenance burden exceeds capacity | High | High | **Critical** | Faculty self-service; streamlined workflows; clear governance | PM + Content Owner |
| R2 | Faculty don't update profiles | Medium | High | **High** | Easy update interface; show value; periodic reminders; "last updated" visibility | Tech Lead + PM |
| R3 | Photography assets insufficient | Medium | High | **High** | Early inventory; prioritize shoots; identify fallback assets | Content Owner |
| R4 | Design review cycles extend timeline | Medium | Medium | **Medium** | Limited review rounds (2 max); clear approval criteria | PM + UX |
| R5 | Scope creep delays launch | Medium | High | **High** | Strict Phase 1 scope; formal change control | PM |

#### Medium-Priority Risks

| ID | Risk | Probability | Impact | Score | Mitigation Strategy | Owner |
|----|------|-------------|--------|-------|---------------------|-------|
| R6 | Student testimonials difficult to obtain | Medium | Medium | **Medium** | Identify willing students early; offer incentives; flexible format | Content Owner |
| R7 | Research theme organization doesn't resonate | Low | Medium | **Low** | Validate with faculty early; plan for iteration | UX + PM |
| R8 | Performance targets not met | Low | Medium | **Low** | Performance testing throughout; optimization sprint | Tech Lead |
| R9 | Accessibility gaps discovered late | Low | High | **Medium** | Accessibility built-in from start; automated testing | QA + Frontend |

### 6.2 Risk Response Strategies

**R1: Content Maintenance Burden**
- **Prevent:** Design faculty self-service with minimal friction
- **Mitigate:** Create templates, establish rhythms, reduce complexity
- **Contingency:** Hire additional content support if overwhelmed

**R2: Faculty Profile Stagnation**
- **Prevent:** Demo value proposition to faculty; make updates trivially easy
- **Mitigate:** Annual reminder campaigns; "last updated" badges
- **Contingency:** Administrator-assisted updates for key profiles

**R3: Photography Gaps**
- **Prevent:** Early inventory and gap analysis
- **Mitigate:** Prioritize highest-impact photo needs
- **Contingency:** Curated stock photography with Pacific Naturalism treatment

### 6.3 Risk Monitoring

| Monitoring Activity | Frequency | Owner | Escalation Trigger |
|---------------------|-----------|-------|-------------------|
| Risk register review | Weekly | PM | Any risk score increase |
| Content readiness check | Weekly | Content Owner | Milestone at risk |
| Design timeline review | Weekly during Phase 1 | UX + PM | >1 week slippage |
| Development velocity tracking | Sprint reviews | Tech Lead | Velocity decline |

---

## 7. Communication & Governance

### 7.1 Stakeholder Communication Plan

| Stakeholder Group | Communication Type | Frequency | Owner | Channel |
|-------------------|-------------------|-----------|-------|---------|
| Department Leadership | Status report | Bi-weekly | PM | Email + Meeting |
| Project Team | Stand-up | Daily during active phases | PM | Slack/Teams |
| Project Team | Sprint review | Per sprint | PM | Meeting |
| Faculty | Profile update reminders | Monthly | Administrator | Email |
| Department Leadership | Milestone reviews | At each milestone | PM | Meeting |
| All Stakeholders | Major announcements | As needed | PM | Email |

### 7.2 Decision Authority Matrix (RACI)

| Decision | PM | UX | Tech Lead | Content Owner | Leadership |
|----------|----|----|-----------|---------------|------------|
| Project scope changes | A | C | C | C | R |
| Design direction | C | R | C | C | A |
| Technical architecture | C | C | R | I | A |
| Content strategy | C | C | I | R | A |
| Launch go/no-go | R | C | C | C | A |
| Budget allocation | A | I | I | I | R |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

### 7.3 Escalation Procedures

| Issue Type | First Level | Second Level | Final Authority |
|------------|-------------|--------------|-----------------|
| Scope/Requirements | PM | Department Leadership | Department Chair |
| Technical blockers | Tech Lead | PM | Department Leadership |
| Resource constraints | PM | Department Leadership | Department Chair |
| Content availability | Content Owner | PM | Department Leadership |
| Timeline impacts | PM | Department Leadership | Department Chair |

### 7.4 Meeting Cadence

| Meeting | Attendees | Frequency | Duration | Purpose |
|---------|-----------|-----------|----------|---------|
| Daily Stand-up | Core team | Daily | 15 min | Progress, blockers |
| Sprint Planning | Core team | Sprint start | 2 hours | Sprint scope |
| Sprint Review | Core team + stakeholders | Sprint end | 1 hour | Demo, feedback |
| Sprint Retro | Core team | Sprint end | 45 min | Process improvement |
| Stakeholder Update | PM + Leadership | Bi-weekly | 30 min | Status, decisions |
| Design Review | UX + stakeholders | Per deliverable | 1 hour | Design approval |

---

## 8. Quality Gates

### 8.1 Phase Gate Criteria

#### Gate 0: Initiation Complete → Design Start

| Criterion | Verification Method |
|-----------|-------------------|
| Project charter signed | Document review |
| Team roles assigned | Assignment confirmation |
| Research themes validated | Leadership approval |
| Testimonial participants identified | List confirmed |
| Photography plan approved | Plan documented |
| Analytics baseline plan confirmed | Tech Lead confirmation |

#### Gate 1: Design Complete → Development Start

| Criterion | Verification Method |
|-----------|-------------------|
| All page designs approved | Stakeholder sign-off |
| Design system documented | Documentation review |
| Responsive designs validated | Design QA |
| Accessibility in designs verified | Design audit |
| Content requirements clear | Content owner confirmation |

#### Gate 2: Architecture Complete → Development Sprint Start

| Criterion | Verification Method |
|-----------|-------------------|
| Technical architecture documented | Document review |
| Development environment ready | Environment validation |
| CI/CD pipeline configured | Pipeline test |
| Database schema finalized | Tech Lead sign-off |
| API contracts defined | API documentation |

#### Gate 3: Development Complete → QA Start

| Criterion | Verification Method |
|-----------|-------------------|
| All features implemented | Feature checklist |
| Unit tests passing | Test report |
| Code review completed | PR approval records |
| Content populated | CMS audit |
| Integration tests passing | Test report |

#### Gate 4: QA Complete → Launch Preparation

| Criterion | Verification Method |
|-----------|-------------------|
| All test cases passed | QA report |
| WCAG 2.1 AA compliant | Accessibility audit |
| Performance targets met | Performance report |
| Cross-browser testing complete | Test matrix |
| Mobile testing complete | Device testing report |
| UAT approved | Stakeholder sign-off |

#### Gate 5: Launch Ready → Go Live

| Criterion | Verification Method |
|-----------|-------------------|
| Pre-launch checklist complete | Checklist review |
| Production environment validated | Smoke tests |
| Monitoring configured | Monitoring dashboard |
| Rollback plan documented | Plan review |
| Communication plan ready | Plan review |
| Leadership go/no-go | Approval meeting |

### 8.2 Quality Standards

| Area | Standard | Verification |
|------|----------|--------------|
| Code Quality | ESLint passing, TypeScript strict mode | Automated checks |
| Accessibility | WCAG 2.1 AA compliance | axe-core + manual audit |
| Performance | LCP < 2.5s, FCP < 1.8s | Lighthouse |
| Mobile | Full functionality at 375px | Device testing |
| SEO | All pages have meta tags, structured data | SEO audit tool |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) | Cross-browser testing |

---

## 9. Specialist Handoff Plans

### 9.1 Project Manager → UX Engineer Handoff

**Handoff Document: UX Design Brief**

#### Context
You are designing a differentiated academic department website that must recruit graduate students and build national/international research recognition. The current site is a "digital filing cabinet" that fails to showcase people, research stories, or the unique coastal research environment.

#### Design Priorities (Ranked)

1. **Audience Pathways on Homepage**
   - Prospective graduate students must immediately see this site is for them
   - Faculty candidates need quick access to research themes and facilities
   - Traditional navigation must remain accessible

2. **Research Discovery by Theme**
   - Organize research by big questions, not faculty names
   - Three themes: Ecology, Evolution, Marine Biology
   - Faculty can appear in multiple themes

3. **Human-First Faculty Profiles**
   - Lead with research questions, not credentials
   - Current projects and lab members prominent
   - Self-service editing must be intuitive

4. **Graduate Student Experience**
   - Real student voices and photos
   - Clear application journey
   - Funding information prominent

5. **Story-Driven News**
   - Lead with discovery, not credentials
   - Visual-forward presentation
   - Filterable by research theme

#### Design Constraints

| Constraint | Requirement |
|------------|-------------|
| Brand Identity | Pacific Naturalism v4.0 (see CLAUDE.md) |
| Typography | Fraunces (headings) + DM Sans (body) |
| Color Palette | Ocean depths + warm neutrals + UCSB gold |
| Mobile First | Full functionality at 375px width |
| Accessibility | WCAG 2.1 AA compliance |
| Photography | Real photos only—no stock imagery |

#### Key User Stories for Design Focus

| Priority | User Story |
|----------|------------|
| Critical | US-1.1: Prospective student sees clear pathway above fold |
| Critical | US-2.1: Research browsable by big questions |
| Critical | US-3.1: Faculty research focus immediately understandable |
| Critical | US-4.1: Hear from current students about experience |
| High | US-1.4: Mobile navigation works excellently |
| High | US-6.1: News articles feel exciting and discovery-led |

#### Design Deliverables Required

1. **Information Architecture**
   - Site map with audience pathways
   - Navigation structure (primary + audience-specific)
   - Content hierarchy per page type

2. **Design System Documentation**
   - Component library (buttons, cards, forms, etc.)
   - Typography scale with responsive specifications
   - Color usage guidelines
   - Spacing and layout grid
   - Animation/interaction specifications

3. **Page Designs (Desktop + Mobile)**
   - Homepage (full hero, audience pathways, featured content)
   - Research theme page template
   - Faculty directory (list view)
   - Faculty profile (individual)
   - Graduate program landing page
   - Student testimonial format
   - News listing page
   - News article page
   - Application journey/timeline page

4. **Interaction Specifications**
   - Navigation behavior (scroll, mobile menu)
   - Search and filter patterns
   - Card hover states
   - Page transitions

#### Questions to Resolve in Design

1. How do we visually distinguish audience pathways without overwhelming the homepage?
2. What's the right balance of "magazine-style" storytelling vs. "directory-style" utility?
3. How do we make faculty profiles feel human without being informal?
4. How do we handle faculty who don't have photos or minimal content?

#### Review Checkpoints

| Checkpoint | Deliverable | Stakeholders |
|------------|-------------|--------------|
| IA Review | Site map, navigation | PM, Content Owner, Leadership |
| Design Direction | Homepage concept (2-3 options) | PM, Leadership |
| Component Review | Design system draft | PM, Tech Lead |
| Full Design Review | All page designs | Full stakeholder group |

### 9.2 UX Engineer → Tech Lead Handoff

**Handoff Document: Technical Implementation Brief**

*(To be completed after Design Phase)*

**Expected Contents:**
- Complete design specifications
- Component inventory with behavior documentation
- Animation/interaction requirements
- Responsive breakpoints and behavior
- Accessibility requirements per component
- Asset delivery (icons, images, fonts)
- Design system source files

### 9.3 Tech Lead → Development Team Handoff

**Handoff Document: Development Implementation Guide**

*(To be completed after Architecture Phase)*

**Expected Contents:**
- Technical architecture documentation
- Component implementation priority order
- API contracts and data schemas
- Development environment setup guide
- Code standards and review criteria
- Testing requirements per component
- Integration points and dependencies

---

## 10. Success Criteria & Acceptance

### 10.1 Phase 1 Launch Acceptance Criteria

| Category | Criterion | Measurement | Target |
|----------|-----------|-------------|--------|
| **Functionality** | All Phase 1 features working | Feature checklist | 100% complete |
| **Content** | Core pages populated | Content audit | All pages have content |
| **Performance** | Page load speed | Lighthouse | LCP < 2.5s |
| **Accessibility** | WCAG compliance | axe-core + manual | AA compliant |
| **Mobile** | Mobile experience | Device testing | Full functionality |
| **SEO** | Search optimization | SEO audit | All pages optimized |

### 10.2 Success Metrics (Post-Launch)

| Metric | Baseline | Target | Measurement Timeframe |
|--------|----------|--------|----------------------|
| Bounce rate | TBD | <40% | 3 months post-launch |
| Pages per session | TBD | >3 | 3 months post-launch |
| Time on site | TBD | >2 minutes | 3 months post-launch |
| Graduate applications | Prior year | +15% | Full application cycle |
| Faculty profile freshness | TBD | >80% updated within 12 months | 12 months post-launch |

### 10.3 Project Closeout Criteria

| Criterion | Verification |
|-----------|--------------|
| All Phase 1 requirements delivered | Requirements traceability matrix |
| Documentation complete | Documentation audit |
| Training provided to content owner | Training completion |
| Support handoff complete | Support procedures documented |
| Lessons learned captured | Retrospective completed |
| Phase 2 backlog prepared | Backlog documented |

---

## Appendix A: Project Charter Template

```
PROJECT CHARTER: EEMB Website Redesign

Project Name:      EEMB Website Redesign 2025-2026
Project Manager:   [Name]
Sponsor:           [Department Chair/Leadership]
Start Date:        [Date]
Target Launch:     [Date]

PURPOSE
Transform the EEMB website from a static content repository into a dynamic
recruitment and reputation-building tool that showcases people, research
stories, and the unique coastal research environment.

OBJECTIVES
1. Recruit top graduate students through compelling presentation of research
   opportunities and student experience
2. Build national/international recognition by highlighting research impact
3. Maintain all required institutional content in an engaging organization

SUCCESS CRITERIA
- Bounce rate <40%
- Pages per session >3
- Graduate application increase >15%
- Faculty profile freshness >80%

SCOPE
Phase 1: Homepage, Research Themes, Faculty Profiles, Graduate Program, News
Phase 2: Facilities, Funder Pathways, Video, Advanced Search, Events, Alumni

KEY STAKEHOLDERS
- Department Leadership (approval authority)
- Faculty (content contributors, user testers)
- Current Students (testimonials, user testers)
- Administrator/Content Owner (ongoing maintenance)

CONSTRAINTS
- Single administrator for content maintenance
- All current content must remain accessible
- Faculty must be able to self-edit profiles
- Existing tech stack (Next.js + Supabase)

APPROVAL SIGNATURES
_________________________    _________________________
Project Manager               Department Chair/Sponsor
Date: ____________           Date: ____________
```

---

## Appendix B: Change Control Process

### Change Request Procedure

1. **Submit Request:** Any team member can submit a change request to PM
2. **Impact Assessment:** PM assesses impact on scope, timeline, resources
3. **Review:** Changes reviewed at next stakeholder meeting (or emergency meeting if critical)
4. **Decision:** Leadership approves/rejects/defers
5. **Implementation:** If approved, PM updates plans and communicates to team

### Change Categories

| Category | Impact Level | Approval Authority |
|----------|--------------|-------------------|
| Minor (cosmetic, typo) | Low | PM |
| Moderate (feature adjustment) | Medium | PM + Tech Lead |
| Significant (scope change) | High | Leadership |
| Critical (timeline/budget) | Critical | Department Chair |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Phase Gate** | A checkpoint where deliverables are reviewed before proceeding |
| **Critical Path** | The sequence of activities that determines minimum project duration |
| **Sprint** | A fixed time period (typically 2 weeks) for development work |
| **UAT** | User Acceptance Testing—validation by end users |
| **Hypercare** | Intensive support period immediately after launch |
| **WBS** | Work Breakdown Structure—hierarchical decomposition of work |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 9, 2026 | Project Manager | Initial document |

---

*This Project Plan is ready for team kickoff. Next step: Schedule kickoff meeting and distribute UX Design Brief.*
