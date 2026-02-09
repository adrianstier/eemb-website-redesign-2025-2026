# EEMB Website - Project Context

**Last Updated:** November 26, 2025
**Status:** Active Development (~70% Complete)

---

## Read This First

This document provides everything needed to understand and work on the EEMB website project. Read it at the start of every development session.

---

## Project Overview

Complete redesign of UCSB EEMB Department website featuring:
- **Strapi CMS** - Non-technical admin can manage content without coding
- **Next.js 14** - Modern React framework with static generation
- **People Directory** - Faculty, students, staff with search/filter/sort
- **Alumni Platform** - Directory and spotlights (schema ready, needs data)

---

## Current Implementation Status

### Fully Complete

| Component | Details |
|-----------|---------|
| **Strapi Backend** | 12 content types, REST + GraphQL APIs, admin panel |
| **People Directory** | 119 records, advanced search/filter/sort, 89% photos |
| **Faculty Profiles** | Full pages with bio, research, academic links |
| **Homepage** | 9 components, responsive design, ocean gradient theme |
| **Admin Dashboard** | JWT auth, CRUD operations for all people types |
| **32 Frontend Pages** | All routes implemented and styled |
| **Data Pipeline** | 57+ scripts, 409 pages scraped, validated data |

### Needs Content (Schema Ready)

| Content Type | Records | Action Needed |
|--------------|---------|---------------|
| News Articles | 0 | Import historical + create new |
| Events | 0 | Add upcoming events |
| Alumni | 0 | Collect alumni data |
| In Memoriam | 0 | Add 5 profiles: Trench, Connell, Wenner, Damuth, Stewart-Oaten |
| DEI | 0 | Add committee structure |
| Research Areas | 0 | Formalize taxonomy (data exists in faculty records) |

### Infrastructure Pending

- [ ] Cloudinary credentials (images work via direct URLs)
- [ ] PostgreSQL setup (using SQLite for development)
- [ ] Production deployment to Vercel + Railway

---

## Tech Stack

### Backend
```
Strapi 4.25.0
├── Database: SQLite (dev) / PostgreSQL (prod-ready)
├── Plugins: Documentation, GraphQL, Email (SendGrid), Sentry
├── Auth: JWT-based with role permissions
└── Media: Cloudinary provider configured (needs credentials)
```

### Frontend
```
Next.js 14.0.4 (App Router)
├── React 18 + TypeScript (strict mode)
├── Tailwind CSS 3.3 + PostCSS
├── Data: React Query + Axios
├── Icons: Lucide React + Heroicons
└── Testing: Playwright (E2E) + Jest (Unit)
```

---

## Database Schema

### People Content Types

**Faculty** (65 records)
- Personal: firstName, lastName, title, email, phone, office
- Academic: researchInterests, education, publications, courses
- Links: labWebsite, googleScholar, orcid
- Media: profileImage, photo_url
- Status: active, department, joinedYear

**Graduate Students** (35 records)
- Personal info + advisor relation + degree program

**Staff** (19 records)
- Personal info + position + responsibilities

**Alumni** (0 records - schema ready)
- Personal + career + privacy controls + giving tracking

### Content Types

**News Articles** - title, content, category, featured people
**Events** - datetime, location, eventType, registration
**In Memoriam** - biography, remembrance, legacy, quotes
**DEI Content** - mission, initiatives, committee members

---

## Key Files & Directories

### Backend (`/backend`)
```
src/api/
├── faculty/           # Faculty content type & controllers
├── graduate-student/  # Student content type
├── staff/            # Staff content type
├── alumni-profile/   # Alumni schema (no data yet)
├── news-article/     # News schema
└── event/            # Events schema

config/
├── database.js       # DB config (SQLite/PostgreSQL)
├── plugins.js        # Strapi plugins
└── server.js         # Server config
```

### Frontend (`/frontend`)
```
app/
├── page.tsx          # Homepage with 9 components
├── people/           # People directory & profiles
├── faculty/          # Faculty-specific pages
├── admin/            # Admin dashboard (auth protected)
├── news/             # News pages
├── events/           # Event pages
└── [other routes]/   # 32 total pages

src/
├── components/       # Reusable React components
│   ├── HeroSection.tsx
│   ├── FeaturedFaculty.tsx
│   ├── ResearchThemes.tsx
│   └── [15+ components]
└── lib/
    ├── api.ts        # API client functions
    └── types.ts      # TypeScript interfaces
```

### Scripts (`/scripts`)
```
# Data Import
comprehensive-people-import.js   # Master import script
import-photos.js                 # Photo import (89% coverage)
import-all-faculty-links.js      # Academic links

# Data Cleaning
fix-people-data-sql.js          # SQL-based corrections
standardize-bios.js             # Bio formatting
categorize-research-areas.sql   # Research categorization

# Validation
validate-faculty-links.js       # Link checker
verify-people-filters.js        # Filter accuracy
```

---

## Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Strapi Admin | http://localhost:1337/admin |
| REST API | http://localhost:1337/api |
| GraphQL | http://localhost:1337/graphql |

---

## Common Commands

### Start Development
```bash
# Terminal 1: Backend
cd backend && npm run develop

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Database
```bash
# Query SQLite
sqlite3 backend/.tmp/data.db "SELECT COUNT(*) FROM faculties"

# Export data
sqlite3 -header -csv backend/.tmp/data.db "SELECT * FROM faculties" > export.csv
```

### Testing
```bash
cd frontend
npx playwright test                    # All tests
npx playwright test people-directory   # Specific test
npx playwright test --ui               # Interactive mode
```

### Scripts
```bash
# Run import script
node scripts/comprehensive-people-import.js

# Validate links
node scripts/validate-faculty-links.js
```

---

## API Endpoints

### People
```
GET  /api/faculties              # List all faculty
GET  /api/faculties/:id          # Single faculty
PUT  /api/faculties/:id          # Update (auth required)
GET  /api/graduate-students      # List all students
GET  /api/staff-members          # List all staff
```

### Content
```
GET  /api/news-articles          # News (0 records)
GET  /api/events                 # Events (0 records)
GET  /api/alumni-profiles        # Alumni (0 records)
```

### Auth
```
POST /api/auth/local             # Login
GET  /api/users/me               # Current user
```

---

## Data Quality

### People Coverage
| Field | Faculty | Students | Staff |
|-------|---------|----------|-------|
| Photos | 94% | 91% | 68% |
| Email | 100% | 100% | 100% |
| Research Interests | 88% | - | - |
| Bio | 48% | - | - |
| Google Scholar | 86% | - | - |
| Lab Website | 83% | - | - |

### Categorization
- Ecology: 28 faculty
- Evolution: 16 faculty
- Marine Biology: 22 faculty
- (Many have multiple categories)

---

## Design System

### Colors
```css
--navy: #003660      /* UCSB Navy - primary */
--gold: #FEBC11      /* UCSB Gold - accent */
--ocean: #4A9EC6     /* Ocean Blue - links */
```

### Typography
- Headings: Inter (700 weight)
- Body: Open Sans (400, 600)
- Minimum: 18px on mobile

### Spacing
- Base unit: 8px
- Scale: 8, 16, 24, 32, 48, 64px

---

## Remaining Work

### Priority 1: Content Population
1. Add 5 In Memoriam profiles
2. Import 10-20 news articles
3. Add upcoming events
4. Populate DEI committee info

### Priority 2: Infrastructure
1. Set up Cloudinary account
2. Configure PostgreSQL for production
3. Deploy to Vercel (frontend) + Railway (backend)

### Priority 3: Polish
1. Complete bio coverage (currently 48%)
2. Add remaining faculty photos (6 missing)
3. Implement contact form backend

---

## File Organization

### Root (Clean)
```
README.md              # Quick start & overview
PROJECT_CONTEXT.md     # This file - detailed context
EXECUTIVE_SUMMARY.md   # High-level rationale
```

### Documentation
```
docs/
├── ADMIN_SETUP_GUIDE.md
├── EVENTS_SYSTEM_GUIDE.md
├── CALENDAR_INTEGRATION_GUIDE.md
└── archive/           # Historical reports & session summaries
```

### Planning
```
planning documents/
├── REVISED_comprehensive_technical_architecture.md
├── REVISED_claude_code_execution_roadmap.md
└── REVISED_repository_organization_guide.md
```

---

## Session Workflow

1. **Start:** Read this file
2. **Check:** What's the current task/goal?
3. **Develop:** Make changes, test locally
4. **Verify:** Run relevant tests
5. **Commit:** Use format `[scope] description`
6. **Update:** Note any changes to project state

---

## Git Conventions

### Commit Format
```
[scope] Brief description

Scopes: backend, frontend, scripts, docs, infra
```

### Examples
```
[frontend] Add research area filtering to people page
[backend] Create alumni content type schema
[scripts] Fix photo import for missing faculty
[docs] Update PROJECT_CONTEXT with current status
```

---

## Contact & Resources

- **Strapi Docs:** https://docs.strapi.io
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

**This project is ~70% complete. Main remaining work is content population and production deployment.**
