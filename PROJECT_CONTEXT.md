# EEMB Website - Project Context
**Version:** 2.0 - Backend-First Architecture
**Last Updated:** November 12, 2025
**Current Phase:** Planning Complete → Ready for Week 0 (Environment Setup)
**Next Milestone:** Strapi backend setup with PostgreSQL

---

## 🎯 Quick Start (For Any Claude Code Session)

**READ THIS FIRST AT THE START OF EVERY SESSION**

### What This Project Is:
Complete redesign of UCSB EEMB Department website with:
- Modern Next.js frontend
- Strapi CMS backend (NON-TECHNICAL USER FRIENDLY)
- PostgreSQL database (FLEXIBLE for adding/removing faculty)
- Alumni engagement platform (NEW - critical for development/giving)
- Full content management system (NO coding required for updates)

### Critical Innovation:
**Original plan (JSON files) → REVISED to Strapi CMS**
- Why: Non-technical admin (Andi) needs to add/remove faculty without touching code
- Result: 5-minute faculty updates vs requiring developer

---

## Tech Stack Overview

### Backend (The Critical Change)
```
Strapi 4.x (Headless CMS)
├── PostgreSQL 14+ (relational database)
├── RESTful + GraphQL APIs
├── Built-in admin panel (visual, no-code)
├── Role-based permissions
├── Media Library with Cloudinary
└── Content versioning
```

**Why Strapi:**
- ✅ Non-technical admin interface
- ✅ Flexible content types (add fields without code changes)
- ✅ Auto-generates APIs from content types
- ✅ Built-in permissions system
- ✅ Image management with cropping tools
- ✅ Open source (no vendor lock-in)

### Frontend
```
Next.js 14 (App Router)
├── React 18 + TypeScript
├── Tailwind CSS (UCSB design system)
├── Shadcn/ui (accessible components)
├── React Query (data fetching)
└── Static generation (performance)
```

### Infrastructure
```
Frontend: Vercel (https://eemb.ucsb.edu)
Backend: Railway/DigitalOcean (https://cms.eemb.ucsb.edu)
Database: Supabase (PostgreSQL)
Media: Cloudinary CDN
Monitoring: Sentry + Google Analytics
```

---

## Key URLs (After Setup)

**Development:**
- Backend: http://localhost:1337/admin
- Frontend: http://localhost:3000

**Staging:**
- Backend: https://cms-staging.eemb.ucsb.edu/admin
- API: https://cms-staging.eemb.ucsb.edu/api
- Frontend: https://staging.eemb.ucsb.edu

**Production:**
- Backend: https://cms.eemb.ucsb.edu/admin
- API: https://cms.eemb.ucsb.edu/api
- Frontend: https://eemb.ucsb.edu

---

## Repository Structure

```
eemb-website/
├── PROJECT_CONTEXT.md (THIS FILE - read first!)
├── README.md (project overview)
├── backend/ (Strapi CMS)
├── frontend/ (Next.js app)
├── scripts/ (automation tools)
├── docs/ (all documentation)
└── infrastructure/ (Docker, configs)
```

**Key Documentation:**
- Technical Architecture: [/planning documents/REVISED_comprehensive_technical_architecture.md](planning documents/REVISED_comprehensive_technical_architecture.md)
- Development Roadmap: [/planning documents/REVISED_claude_code_execution_roadmap.md](planning documents/REVISED_claude_code_execution_roadmap.md)
- Repository Guide: [/planning documents/REVISED_repository_organization_guide.md](planning documents/REVISED_repository_organization_guide.md)

---

## Content Types (Strapi Backend)

### Primary Content Types

**1. Faculty** (40+ entries)
```typescript
{
  slug: string (unique)
  firstName, lastName, preferredName
  title: string
  email: string (unique)
  phone, office: string
  photo: media
  bioShort: text(500)
  bioLong: richtext
  researchAreas: relation (many-to-many)
  labWebsiteUrl: string
  status: enum (active, emeritus, on-leave, deceased)
  isDeceased: boolean
  startDate, endDate: date
  // ... see full schema in architecture doc
}
```

**2. Alumni** (NEW - Critical Addition)
```typescript
{
  slug: string (unique)
  firstName, lastName: string
  degreeType: enum (PhD, MS, BS, Postdoc)
  graduationYear: integer
  advisor: relation → Faculty
  currentPosition, currentEmployer: string
  visibility: enum (public, alumni-only, private)  // PRIVACY
  allowPublicContact: boolean
  isFeatured: boolean
  willingToMentor: boolean
  totalGivingAmount: decimal  // Track development
  // ... full schema in docs
}
```

**3. Alumni Spotlight** (NEW)
```typescript
{
  alumni: relation → Alumni
  title: string
  interviewContent: richtext (Q&A format)
  spotlightType: enum (career-achievement, research-impact, giving-back)
  featuredImage: media
  isFeatured: boolean
}
```

**4. News Items** (Good News Blog)
```typescript
{
  title, slug: string
  excerpt: text(500)
  content: richtext
  category: enum (publication, award, grant, community, etc.)
  tags: array
  featuredPeople: relation → Faculty + Alumni
  featuredImage: media
  featured: boolean
  datePublished: datetime
  status: enum (draft, published, archived)
}
```

**5. Events**
```typescript
{
  title, slug: string
  description: richtext
  startDatetime, endDatetime: datetime
  location, virtualLink: string
  eventType: enum (seminar, workshop, symposium, social)
  requiresRegistration: boolean
  isFeatured: boolean
}
```

**6. In Memoriam**
```typescript
{
  firstName, lastName, preferredName: string
  birthYear, deathYear: integer
  title: string (e.g., "Professor Emeritus")
  biography, personalRemembrance, legacyText: richtext
  photo: media
  memorialLinks: json
}
```

**7. Staff, Graduate Students, Research Areas, Labs, DEI Committee**
(See full schemas in architecture doc)

---

## Frontend Routes (Next.js App Router)

```
/                                   Homepage
/people
  /faculty                          Directory (filterable)
    /[slug]                         Individual profile
  /alumni                           Directory + spotlights
    /spotlights                     Featured stories
      /[slug]                       Individual spotlight
    /[slug]                         Individual alumni (if public)
  /staff                            Staff directory
  /students                         Grad student directory
  /in-memoriam                      Memorial directory
    /[slug]                         Individual memorial

/research
  /[area]                           Ecology, Evolution, Marine Biology
  /labs                             Labs directory
  /field-sites                      Field sites info

/programs
  /graduate                         PhD + MS programs
  /undergraduate                    Undergrad opportunities

/news                               Good News blog feed
  /[slug]                           Individual article

/events                             Calendar view + list

/about
  /dei                              DEI overview (links to microsite)
  /history                          Department history
  /facilities                       Facilities info

/contact                            Contact form
/give                               Giving/development page

/legal
  /privacy                          Privacy policy
  /accessibility                    Accessibility statement
```

---

## Data Flow

```
User Request
    ↓
Next.js Page Component
    ↓
API Client (lib/api.ts)
    ↓
Strapi REST API (cms.eemb.ucsb.edu/api)
    ↓
PostgreSQL Database
    ↓
JSON Response
    ↓
TypeScript Interface (lib/types.ts)
    ↓
React Component
    ↓
Rendered HTML (with Tailwind styling)
```

---

## Design System (UCSB Compliance)

### Colors
```css
/* Primary */
--navy: #003660;        /* UCSB Navy (primary) */
--gold: #FEBC11;        /* UCSB Gold (secondary) */

/* Accent */
--ocean-light: #4A9EC6; /* Ocean Blue Light */
--ocean-deep: #1B5E7E;  /* Ocean Blue Deep */

/* Neutrals */
--text: #333333;
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
```

### Typography
```css
/* Headings */
font-family: 'Inter', sans-serif;
font-weight: 700;

/* Body */
font-family: 'Open Sans', sans-serif;
font-weight: 400, 600;

/* Scale */
H1: 48-64px (desktop), 32-40px (mobile)
H2: 36-42px (desktop), 28-32px (mobile)
H3: 24-30px (desktop), 22-26px (mobile)
Body: 18px (mobile minimum)
```

### Spacing
```
Base unit: 8px
Scale: 8, 16, 24, 32, 48, 64, 96, 128px
```

### Breakpoints
```
mobile: 320px - 767px
tablet: 768px - 1023px
desktop: 1024px - 1439px
wide: 1440px+
```

---

## Common Commands

### Backend (Strapi)
```bash
cd backend

# Development
npm run develop              # Start dev server (localhost:1337)

# Build
npm run build               # Build for production
npm run start               # Start production server

# Database
npm run strapi migrations:run  # Run migrations

# Strapi CLI
npm run strapi               # Access Strapi commands
```

### Frontend (Next.js)
```bash
cd frontend

# Development
npm run dev                  # Start dev server (localhost:3000)

# Build
npm run build               # Build static site
npm run start               # Preview production build

# Testing
npm run lint                # ESLint
npm run type-check          # TypeScript check
npm run test                # Run all tests
npm run test:unit           # Unit tests only
npm run test:e2e            # E2E tests (Playwright)

# Performance
npm run lighthouse          # Lighthouse audit
```

### Scripts
```bash
# Scraping
python scripts/scraping/scrape_current_site.py

# Migration
node scripts/migration/import_to_strapi.js

# Maintenance
node scripts/maintenance/check_broken_links.js
bash scripts/maintenance/optimize_images.sh
bash scripts/maintenance/backup_database.sh
```

### Root Level (Makefile)
```bash
make dev                    # Start both backend + frontend
make test                   # Run all tests
make deploy-staging         # Deploy to staging
make deploy-production      # Deploy to production
```

---

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/eemb

# Cloudinary (Image CDN)
CLOUDINARY_NAME=eemb-ucsb
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...

# Security
ADMIN_JWT_SECRET=...        # Generate: openssl rand -base64 32
API_TOKEN_SALT=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...

# Email (optional)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# URL
PUBLIC_URL=https://cms.eemb.ucsb.edu
```

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=https://cms.eemb.ucsb.edu/api

# Site
NEXT_PUBLIC_SITE_URL=https://eemb.ucsb.edu

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (Error Tracking)
SENTRY_DSN=...
```

---

## Key Relationships (Database)

```
Faculty
  ├── has many → Graduate Students (as advisor)
  ├── has many → Alumni (as former advisor)
  ├── belongs to many → Research Areas
  ├── has one → Lab
  └── referenced by → News Items (featured person)

Alumni
  ├── belongs to → Faculty (advisor)
  ├── belongs to → Research Area
  ├── has many → Alumni Spotlights
  └── has giving record (totalGivingAmount)

News Items
  ├── references many → Faculty (featured people)
  ├── references many → Alumni (featured people)
  ├── belongs to many → Research Areas
  └── has one → Featured Image (media)

Events
  ├── has many → Speakers (Faculty or external)
  └── organized by → Faculty

In Memoriam
  ├── may reference → Faculty (if former faculty)
  └── belongs to many → Research Areas
```

---

## Current Status

### ✅ Completed (Planning Phase)
- [x] Requirements analysis
- [x] Technical architecture design
- [x] Database schema (PostgreSQL)
- [x] Alumni platform design (NEW)
- [x] Content management workflows
- [x] Repository structure
- [x] Development roadmap (12 weeks)
- [x] Documentation framework

### 🔄 Next Steps (Week 0)
- [ ] Environment setup (local development)
- [ ] Accounts created (Railway, Supabase, Cloudinary, Vercel)
- [ ] Repository initialized
- [ ] Git workflow established
- [ ] Development tools installed

### ⏳ Upcoming (Weeks 1-12)
- Weeks 1-3: Backend (Strapi + content types)
- Weeks 4-7: Frontend (Next.js + all pages)
- Weeks 8-10: Admin training + testing
- Weeks 11-12: Legal compliance + launch

### 🚫 Blockers
None currently. Ready to begin Week 0.

---

## Key Decisions Made

### Architecture Decisions
1. **CMS:** Strapi (not WordPress, not JSON files)
   - Reason: Non-technical admin UI + API-first + flexibility
2. **Database:** PostgreSQL (not MongoDB)
   - Reason: Relational integrity, complex queries, UC standards
3. **Frontend:** Next.js 14 with static generation (not SSR)
   - Reason: Performance, SEO, simple hosting
4. **Media:** Cloudinary (not S3)
   - Reason: Auto-optimization, transformations, CDN included
5. **Timeline:** 12 weeks (not 7)
   - Reason: Proper backend foundation + training + testing

### Feature Decisions
1. **Alumni Platform:** Full implementation (directory + spotlights)
   - Reason: Critical for development/giving goals
2. **Good News Blog:** Professional transformation system
   - Reason: Showcase achievements to external audiences
3. **In Memoriam:** Dedicated section (not just removed profiles)
   - Reason: Honor legacy, preserve institutional memory
4. **Privacy:** Three-tier visibility for alumni
   - Reason: CCPA compliance, respect preferences
5. **Admin Training:** Extensive (videos + handbook + live sessions)
   - Reason: Long-term sustainability without developer dependency

---

## Chair's Three Priorities (Revised to Five)

### Original Three:
1. ✅ **Updated DEI Section**
   - Remove Working Group references
   - Link to diversity.eemb.ucsb.edu
   - Current committee structure

2. ✅ **In Memoriam Page**
   - 5 scholars initially: Trench, Connell, Wenner, Damuth, Stewart-Oaten
   - Expandable for future
   - Respectful, professional design

3. ✅ **Good News Blog**
   - Transform casual emails → professional posts
   - Category system (publications, awards, grants, etc.)
   - Featured stories on homepage

### Plus: Alumni Engagement Platform (NEW)
4. ✅ **Alumni Directory**
   - Searchable, filterable (year, degree, location)
   - Privacy controls (public, alumni-only, private)
   - Contact information (opt-in only)

5. ✅ **Alumni Spotlights**
   - Featured career stories
   - Q&A interview format
   - Highlight giving, mentorship, success

---

## Important Conventions

### Naming
- **Files:** kebab-case (`faculty-card.tsx`)
- **Components:** PascalCase (`FacultyCard`)
- **Functions:** camelCase (`getFaculty`)
- **CSS:** Tailwind utility-first

### Git Commits
Format: `[scope] Brief description`

Examples:
```
[backend] Add Alumni content type with privacy controls
[frontend] Create FacultyCard component with responsive design
[docs] Update admin handbook with photo upload guide
[scripts] Add image optimization batch script
[infra] Configure Cloudinary integration
```

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Interfaces in `lib/types.ts`
- No `any` types (use `unknown` if needed)

---

## Testing Requirements

### Coverage Targets
- Unit tests: >80% coverage
- Integration tests: All data flows
- E2E tests: Critical user journeys
- Accessibility: Zero violations (axe)
- Performance: Lighthouse >90 all categories

### Test Types
```
Unit (Fast, Isolated)
├── Components (/tests/unit/components/*.test.tsx)
├── Utilities (/tests/unit/lib/*.test.ts)
└── API client (/tests/unit/lib/api.test.ts)

Integration (Component + Data)
├── Faculty directory with filtering
├── News feed with categories
└── Alumni directory with search

E2E (Full User Flows)
├── Browse faculty → View profile
├── Search alumni → View spotlight
├── Read news → Filter by category
└── Contact form submission

Performance
├── Lighthouse (all pages >90)
├── Core Web Vitals (all green)
└── Load time <3 seconds

Accessibility
├── WCAG 2.1 AA (100% compliance)
├── Keyboard navigation
├── Screen reader compatible
└── Color contrast ≥4.5:1
```

---

## Documentation Links

### Planning Documents (Start Here)
- [Technical Architecture](planning documents/REVISED_comprehensive_technical_architecture.md)
- [Development Roadmap](planning documents/REVISED_claude_code_execution_roadmap.md)
- [Repository Guide](planning documents/REVISED_repository_organization_guide.md)

### For Content Managers
- Admin Handbook: `/docs/admin/ADMIN_HANDBOOK.md` (to be created)
- Content Style Guide: `/docs/content/CONTENT_STYLE_GUIDE.md`
- Video Tutorials: (to be recorded)

### For Developers
- Setup Guide: `/docs/developer/SETUP_GUIDE.md` (to be created)
- API Reference: `/docs/api/API_REFERENCE.md`
- Code Conventions: `/docs/developer/CODE_CONVENTIONS.md`

---

## Team & Contacts

### Key Stakeholders
- **Department Chair:** [Name] - Final approvals
- **Content Manager:** Andi - Daily content updates
- **DEI Co-Chairs:** Deron & Cherie - DEI content
- **IT Support:** UCSB IT - Technical infrastructure

### Roles & Responsibilities
- **Super Admin:** Chair (full access)
- **Content Editor:** Andi (add/edit content)
- **Contributors:** Faculty (submit news, events)
- **Developer:** (You) Technical implementation

---

## Next Session Checklist

When starting a new Claude Code session:

1. **Read this file top to bottom** ✅
2. **Check current status** (see above)
3. **Review relevant docs** (architecture, roadmap)
4. **Understand current goal** (which week/phase?)
5. **Start with specific task** (from roadmap)
6. **Update this file** (status, blockers, decisions)
7. **Document what you built** (in code comments, README)
8. **Run tests** (before committing)
9. **Commit with clear message** (follow convention)
10. **Update "Current Status"** (above)

---

## Quick References

### Faculty Quick Facts
- Total faculty: ~42-45
- Research areas: Ecology, Evolution, Marine Biology
- Special facilities: MSI, Mo'orea LTER, SBC LTER
- Graduate program: PhD (5-6 years), MS (2 years)

### Alumni Platform Goals
- **Directory:** >100 alumni profiles year 1
- **Spotlights:** 1-2 new spotlights per month
- **Giving:** Track and recognize donors
- **Engagement:** Mentor matching, networking

### Performance Targets
- Page load: <3 seconds
- Lighthouse: >90 all categories
- Uptime: 99.9%
- Mobile traffic: 50%+ (up from current 30%)

### Accessibility Requirements
- WCAG 2.1 Level AA (mandatory for UC)
- All images with alt text
- Keyboard navigable
- Screen reader compatible
- Color contrast ratios ≥4.5:1

---

## Remember: The Big Picture

**We're building a website that will:**
1. Attract top prospective grad students
2. Showcase research excellence to donors
3. Engage alumni for giving and mentorship
4. Honor our departed colleagues
5. Celebrate department achievements
6. Last 10+ years with minimal maintenance

**Success means:**
- ✅ Andi can add faculty in 5 minutes (no developer)
- ✅ Alumni directory grows organically
- ✅ Giving increases 25% year 1
- ✅ Website is beautiful, fast, accessible
- ✅ Content stays current without friction

**You're building infrastructure for the next decade of EEMB's online presence.**

---

**Last Updated:** November 12, 2025
**Next Update:** After completing Week 0 (Environment Setup)
**Questions?** Re-read this file. All answers are here or in linked docs.

**Ready to build? Start with Week 0 in the roadmap! 🚀**
