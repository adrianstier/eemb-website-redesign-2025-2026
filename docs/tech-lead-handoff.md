# Technical Implementation Brief
## UX Engineer → Tech Lead Handoff

**Document Version:** 1.0
**Date:** January 9, 2026
**From:** UX Engineer
**To:** Tech Lead
**Project:** EEMB Website Redesign - Phase 1

---

## Executive Summary

This handoff document provides technical implementation specifications derived from UX design decisions. The existing codebase already implements ~95% of the design system and page components. This document focuses on **validation**, **gap analysis**, and **specifications for remaining Phase 1 work**.

**Key Finding:** The codebase is in excellent shape. Primary work involves content enrichment, minor component enhancements, and ensuring accessibility compliance.

---

## 1. Current Implementation Assessment

### 1.1 Design System Status: COMPLETE

| Category | Specification | Implementation Status |
|----------|--------------|----------------------|
| Color palette | 60+ tokens | `tailwind.config.ts` - Complete |
| Typography | Fraunces + DM Sans | `globals.css` + layout - Complete |
| Spacing | Extended scale | `tailwind.config.ts` - Complete |
| Shadows | Warm + ocean variants | `tailwind.config.ts` - Complete |
| Animations | 15+ keyframes | `tailwind.config.ts` - Complete |
| Gradients | 6 pre-built | `tailwind.config.ts` - Complete |

### 1.2 Component Library Status

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| Button | `ui/Button.tsx` | Complete | 5 variants, 3 sizes |
| Card | `ui/Card.tsx` | Complete | Compound component pattern |
| Loading | `ui/Loading.tsx` | Complete | Spinner variant |
| ErrorBoundary | `ui/ErrorBoundary.tsx` | Complete | Error handling |
| WaveDivider | `ui/WaveDivider.tsx` | Complete | SVG wave |
| TopographicPattern | `ui/TopographicPattern.tsx` | Complete | Decorative |
| Header | `Header.tsx` | Complete | Responsive, scroll-aware |
| Footer | `Footer.tsx` | Complete | Full footer |
| HeroSection | `HeroSection.tsx` | Complete | Rotating, parallax |

### 1.3 Page Implementation Status

| Page | Route | Status | Gap |
|------|-------|--------|-----|
| Homepage | `/` | Complete | Content only |
| About | `/about` | Complete | — |
| People Directory | `/people` | Complete | — |
| Faculty Profile | `/people/faculty/[slug]` | Complete | Content migration |
| Student Profile | `/people/students/[slug]` | Complete | — |
| Research Overview | `/research` | Complete | Theme content |
| Research Themes | `/research/[theme]` | Complete | Content |
| Academics | `/academics` | Complete | — |
| Graduate Programs | `/academics/graduate` | Complete | Testimonials needed |
| News Listing | `/news` | Complete | — |
| News Article | `/news/[slug]` | Complete | — |
| Events | `/events` | Complete | — |
| Contact | `/contact` | Complete | — |
| Support | `/support` | Complete | — |
| Admin Dashboard | `/admin/*` | Partial | Enhancement needed |

---

## 2. Phase 1 Implementation Priorities

### 2.1 Critical Path Items

```
1. Content Requirements Resolution (BLOCKING)
   └── Student testimonials (3-5) - Blocks graduate page content
   └── Research theme narratives - Blocks theme page content
   └── Hero images (2 more) - Blocks hero completion

2. Database/CMS Alignment
   └── Verify Supabase schema supports all content types
   └── Faculty profile content migration
   └── News article content structure

3. Accessibility Audit & Fixes
   └── Automated (axe-core)
   └── Keyboard navigation testing
   └── Screen reader validation

4. Performance Optimization
   └── Image optimization pipeline
   └── Font loading strategy verification
   └── Lighthouse audit
```

### 2.2 Detailed Task Breakdown

#### Priority 1: Content Integration (Blocking)

| Task | Description | Dependency | Status |
|------|-------------|------------|--------|
| Testimonial component | Display student quotes with photos | Content availability | Template exists |
| Testimonial data model | Supabase schema for testimonials | None | Verify |
| Hero images | Add 2 more research images | Photography | Waiting |
| Stats API | Dynamic faculty/student counts | Database | Hardcoded currently |

#### Priority 2: Faculty Profile Enhancement

| Task | Description | UX Requirement |
|------|-------------|----------------|
| Lab members section | Show students/postdocs in advisor's profile | Links to student profiles |
| "Accepting students" indicator | Visual badge on profile | Critical for recruitment |
| Research theme tags | Clickable tags linking to theme pages | Cross-navigation |
| External links | Lab site, Scholar, ORCID icons | Consistent icon styling |

#### Priority 3: Admin Self-Service

| Task | Description | UX Requirement |
|------|-------------|----------------|
| Profile edit form | WYSIWYG biography editing | Non-technical friendly |
| Photo upload | Drag-drop with preview | Minimum 400x400px validation |
| Auto-save | Draft saving without explicit action | Prevent data loss |
| Preview mode | See changes before publish | Confidence in updates |

---

## 3. Component Specifications

### 3.1 New Component: StudentTestimonial

**Purpose:** Display student quotes on Graduate Program page

```tsx
interface StudentTestimonialProps {
  quote: string;
  name: string;
  program: 'PhD' | 'MS';
  year: string; // e.g., "3rd year"
  photo: string;
  researchArea: string;
  advisor?: string;
}

// Layout
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                                   │
│  │  [Photo] │  "Quote text here that captures the student       │
│  │  200x200 │   experience in their own words..."               │
│  └──────────┘                                                   │
│                                                                 │
│              — Student Name                                     │
│                PhD Candidate, 3rd year                          │
│                Research Area | Advisor: Dr. Name                │
└─────────────────────────────────────────────────────────────────┘

// Styling
- Card variant: glass
- Quote: text-lg md:text-xl, text-warm-700, italic
- Name: font-semibold, text-ocean-deep
- Meta: text-sm, text-warm-600
```

### 3.2 New Component: AcceptingStudentsBadge

**Purpose:** Visual indicator on faculty profiles

```tsx
interface AcceptingStudentsBadgeProps {
  isAccepting: boolean;
  note?: string; // e.g., "Fall 2026 only"
}

// Variants
Accepting:
  - bg-kelp-400/10, text-kelp-600
  - Icon: check-circle
  - Text: "Accepting graduate students"

Not accepting:
  - bg-warm-200, text-warm-500
  - Icon: minus-circle
  - Text: "Not currently accepting students"

// Implementation
<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-kelp-400/10 text-kelp-600">
  <CheckCircle className="w-4 h-4" />
  Accepting graduate students
</span>
```

### 3.3 Enhanced Component: FacultyCard

**Current:** Basic card with photo, name, title
**Enhancement needed:**

```tsx
// Add these fields to display
- Research focus (1-2 line summary)
- Research theme tags (clickable)
- Accepting students indicator (if true)

// Visual structure
┌─────────────────────────────────────────┐
│ [Photo - 1:1 aspect ratio]              │
│                                         │
├─────────────────────────────────────────┤
│ Dr. Faculty Name                        │
│ Professor of Ecology                    │
│                                         │
│ [Ecology] [Marine Biology]  ← tags      │
│                                         │
│ "Research focus summary text that       │
│ describes current work..."              │
│                                         │
│ [Accepting Students] ← if applicable    │
└─────────────────────────────────────────┘
```

---

## 4. Interaction Specifications

### 4.1 Animation Implementation

| Animation | Trigger | Implementation |
|-----------|---------|----------------|
| fade-in-up | Scroll into view | IntersectionObserver, threshold 0.2 |
| Hero rotation | Timer | 5000ms interval, useState |
| Card hover | Mouse enter | CSS transition, 300ms |
| Button hover | Mouse enter | CSS scale 1.02, 200ms |
| Nav background | Scroll | scrollY > 50, CSS transition |

### 4.2 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-float,
  .animate-glow-pulse {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Implementation requirement:** Wrap all non-essential animations in reduced motion check.

### 4.3 Keyboard Navigation Requirements

| Element | Key | Behavior |
|---------|-----|----------|
| Mobile menu | Escape | Close menu |
| Modal | Escape | Close modal |
| Dropdown | Enter/Space | Open dropdown |
| Dropdown items | Arrow keys | Navigate options |
| Tab | Tab | Focus next element |
| Skip link | Tab (first) | Focus on main content |

---

## 5. Data Requirements

### 5.1 Faculty Profile Schema

```typescript
interface Faculty {
  id: string;
  slug: string;

  // Basic info
  firstName: string;
  lastName: string;
  title: string; // e.g., "Professor", "Assistant Professor"
  email: string;
  phone?: string;
  office?: string;

  // Media
  photoUrl: string; // Minimum 400x400px
  photoAlt?: string;

  // Research
  researchFocus: string; // Rich text, 200-500 words
  researchThemes: ('ecology' | 'evolution' | 'marine-biology')[];
  currentProjects?: ResearchProject[];

  // External links
  labWebsite?: string;
  googleScholar?: string;
  orcid?: string;
  twitter?: string;

  // Status
  isAcceptingStudents: boolean;
  acceptingNote?: string;

  // Relationships
  labMembers?: LabMember[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface ResearchProject {
  title: string;
  description: string;
  fundingSource?: string;
  collaborators?: string[];
}

interface LabMember {
  id: string;
  name: string;
  role: 'PhD Student' | 'MS Student' | 'Postdoc' | 'Research Staff';
  profileUrl?: string;
}
```

### 5.2 Student Testimonial Schema

```typescript
interface StudentTestimonial {
  id: string;

  // Student info
  name: string;
  program: 'PhD' | 'MS';
  year: string; // "1st year", "2nd year", etc.
  researchArea: string;
  photoUrl: string;

  // Content
  quote: string; // 100-300 words

  // Relationships
  advisorId?: string;
  advisorName?: string;

  // Display
  featured: boolean;
  displayOrder: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.3 News Article Schema (Verify)

```typescript
interface NewsArticle {
  id: string;
  slug: string;

  // Content
  title: string;
  excerpt: string; // 150-200 characters
  body: string; // Rich text/markdown

  // Media
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageCaption?: string;

  // Categorization
  researchThemes: string[];
  tags?: string[];

  // Attribution
  authorName?: string;
  facultyMentioned?: string[]; // IDs of faculty

  // Metadata
  publishedAt: Date;
  updatedAt: Date;
  readingTime?: number; // minutes
}
```

---

## 6. Accessibility Implementation

### 6.1 Required ARIA Attributes

| Component | ARIA Requirement |
|-----------|------------------|
| Mobile menu button | `aria-expanded`, `aria-controls` |
| Mobile menu | `aria-labelledby` |
| Hero carousel | `aria-live="polite"` on text region |
| Carousel indicators | `aria-label` for each button |
| Search input | `aria-label` or associated label |
| Filter buttons | `aria-pressed` for selected state |
| Loading states | `aria-busy="true"` |
| External links | Text or aria-label indicating new tab |

### 6.2 Skip Navigation Implementation

```tsx
// Add to layout.tsx, first element in body
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ucsb-gold focus:text-ocean-deep focus:px-4 focus:py-2 focus:rounded-lg"
>
  Skip to main content
</a>

// Add to main element
<main id="main-content" tabIndex={-1}>
```

### 6.3 Form Accessibility

```tsx
// Required pattern for all form inputs
<label htmlFor="email" className="block text-sm font-medium text-warm-700">
  Email address
  <span className="text-ucsb-coral" aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-error"
  className={cn(
    "mt-1 block w-full rounded-lg border",
    error ? "border-red-500" : "border-warm-300"
  )}
/>
{error && (
  <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
    {error}
  </p>
)}
```

---

## 7. Performance Requirements

### 7.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Field data |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| FCP (First Contentful Paint) | < 1.8s | Lighthouse |
| TTI (Time to Interactive) | < 3.5s | Lighthouse |

### 7.2 Image Optimization

| Image Type | Max Dimensions | Format | Quality |
|------------|---------------|--------|---------|
| Hero background | 1920x1080 | WebP | 80% |
| Faculty photo | 800x800 | WebP | 85% |
| Card thumbnail | 600x400 | WebP | 80% |
| News featured | 1200x630 | WebP | 80% |

**Implementation:**
```tsx
// Use Next.js Image component with appropriate sizes
<Image
  src={photoUrl}
  alt={photoAlt}
  width={400}
  height={400}
  sizes="(max-width: 640px) 200px, 400px"
  placeholder="blur"
  blurDataURL={blurPlaceholder}
/>
```

### 7.3 Font Loading Strategy

Current implementation is correct:
```tsx
// layout.tsx - fonts loaded with display: swap
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})
```

---

## 8. Testing Requirements

### 8.1 Automated Testing

| Test Type | Tool | Coverage |
|-----------|------|----------|
| Accessibility | axe-core / Lighthouse | All pages |
| Visual regression | Playwright screenshots | Key pages |
| Component | React Testing Library | UI components |
| E2E | Playwright | Critical paths |

### 8.2 Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Escape closes modals/menus
- [ ] Enter activates buttons/links
- [ ] Arrow keys work in dropdowns
- [ ] Focus never gets trapped

#### Screen Reader (VoiceOver)
- [ ] All images have appropriate alt text
- [ ] Headings announce correctly
- [ ] Links describe destination
- [ ] Form labels read correctly
- [ ] Error messages announce

#### Mobile (375px - 768px)
- [ ] Navigation hamburger works
- [ ] Touch targets 44px minimum
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Forms usable

#### Cross-Browser
- [ ] Chrome (latest 2)
- [ ] Firefox (latest 2)
- [ ] Safari (latest 2)
- [ ] Edge (latest 2)

---

## 9. Technical Decisions (Resolved)

### 9.1 Authentication & Self-Service

| Question | Decision |
|----------|----------|
| Faculty authentication | **Email magic links** - Simple, no SSO dependency |
| Permission model | **Admin-only editing** - Faculty do not self-edit; designated admins manage all profiles |
| Audit logging | **Yes** - Track who edited what and when for accountability |

### 9.2 Content Management

| Question | Decision |
|----------|----------|
| Rich text editor | **TipTap** (recommended) - Highest quality, excellent DX, extensible, used by Notion/GitLab |
| Image upload limits | **5MB max** - Reasonable for high-quality photos, prevents abuse |
| Version history | **Yes** - Profile edits versioned with rollback capability |

### 9.3 Integration

| Question | Decision |
|----------|----------|
| Analytics | **Google Analytics 4** - Standard events (page_view, click, form_submit, scroll_depth) |
| Search | **Supabase full-text search** - Sufficient for faculty/news search at this scale |
| Contact form | **Email to MSO** - Send submissions to andrea.jorgensen@lifesci.ucsb.edu via Resend/SendGrid |

### 9.4 Infrastructure

| Question | Decision |
|----------|----------|
| Image hosting | **Next.js Image** - Simpler setup, adequate for site size |
| Caching strategy | **ISR with on-demand revalidation** - 15-minute cache, revalidate on CMS webhook |
| Preview deployments | **Vercel Preview** - Assumed working for stakeholder review |

### 9.5 Implementation Notes

**TipTap Rich Text Editor:**
- Use `@tiptap/starter-kit` for base functionality
- Add `@tiptap/extension-link` for URL handling
- Add `@tiptap/extension-image` if inline images needed
- Provides clean HTML output suitable for storage

**Google Analytics 4 Events to Track:**
```javascript
// Standard events
gtag('event', 'page_view');
gtag('event', 'click', { link_text, link_url, section });
gtag('event', 'form_submit', { form_name: 'contact' });
gtag('event', 'scroll', { percent_scrolled: 50 });

// Custom events for recruitment
gtag('event', 'faculty_profile_view', { faculty_name, research_theme });
gtag('event', 'apply_click', { source_page });
gtag('event', 'research_theme_explore', { theme });
```

**Contact Form Email (via Resend or SendGrid):**
```
To: andrea.jorgensen@lifesci.ucsb.edu
Subject: [EEMB Website] Contact Form: {subject}
Body:
  Name: {name}
  Email: {email}
  Message: {message}
  Submitted: {timestamp}
```

---

## 10. Handoff Checklist

### 10.1 Assets Delivered

| Asset | Location | Status |
|-------|----------|--------|
| Design system config | `tailwind.config.ts` | Complete |
| Global CSS | `app/globals.css` | Complete |
| UI components | `src/components/ui/` | Complete |
| Page components | `src/components/` | Complete |
| Layout | `app/layout.tsx` | Complete |
| Pages | `app/*/page.tsx` | Complete |
| Images | `public/images/` | Partial (need 2 hero) |

### 10.2 Documentation Delivered

| Document | Location |
|----------|----------|
| UX Design Documentation | `docs/ux-design-documentation.md` |
| Tech Lead Handoff | `docs/tech-lead-handoff.md` (this file) |
| Project Plan | `docs/project-plan.md` |
| Brand Guidelines | `CLAUDE.md` |

### 10.3 Sign-Off

**UX Engineer confirms:**
- [x] All Phase 1 page designs specified
- [x] Component library documented
- [x] Interaction specifications complete
- [x] Accessibility requirements documented
- [x] Data schema requirements documented

**Tech Lead to confirm:**
- [ ] Technical feasibility validated
- [ ] Database schema aligned
- [ ] Infrastructure decisions made
- [ ] Development timeline estimated

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 9, 2026 | UX Engineer | Initial handoff |

---

*Ready for Tech Lead review and Architecture Phase initiation.*
