# EEMB UCSB Website Redesign

Modern, accessible department website for UCSB's Ecology, Evolution & Marine Biology department.

**Status:** Active Development (~70% Complete)
**Stack:** Next.js 14 + Strapi 4 + TypeScript + Tailwind CSS

---

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### Development

```bash
# Backend (Strapi CMS)
cd backend
npm install
npm run develop
# Admin panel: http://localhost:1337/admin

# Frontend (Next.js)
cd frontend
npm install
npm run dev
# Website: http://localhost:3000
```

---

## Project Structure

```
eemb-website-redesign-2025-2026/
├── backend/          # Strapi CMS (API + Admin)
├── frontend/         # Next.js 14 (App Router)
├── scripts/          # Data import & automation (57+ scripts)
├── scraping/         # Web scraping tools
├── docs/             # Documentation & guides
│   ├── archive/      # Historical reports
│   └── *.md          # Active guides
├── planning documents/  # Architecture & roadmap
├── README.md         # This file
├── PROJECT_CONTEXT.md   # Detailed project state
└── EXECUTIVE_SUMMARY.md # High-level overview
```

---

## Current State

### What's Working

| Feature | Status | Details |
|---------|--------|---------|
| **People Directory** | Complete | 119 records, search/filter/sort, 89% photo coverage |
| **Faculty Profiles** | Complete | Photos, bios, research interests, academic links |
| **Homepage** | Complete | 9 components, responsive, ocean gradient theme |
| **Admin Dashboard** | Complete | JWT auth, CRUD for all people types |
| **Strapi Backend** | Complete | 12 content types, REST + GraphQL APIs |
| **32 Pages** | Complete | All routes implemented |

### What Needs Content

| Feature | Status | Notes |
|---------|--------|-------|
| News Articles | Schema ready | 0 records - need content |
| Events/Calendar | Schema ready | 0 records - need content |
| Alumni Directory | Schema ready | 0 records - need data collection |
| In Memoriam | Schema ready | 0 records - need 5 profiles |
| DEI Content | Schema ready | 0 records - need committee info |

### Infrastructure Pending

- [ ] Cloudinary credentials (using direct URLs currently)
- [ ] PostgreSQL migration (using SQLite for dev)
- [ ] Production deployment (Vercel + Railway)

---

## Key URLs (Development)

- **Frontend:** http://localhost:3000
- **Strapi Admin:** http://localhost:1337/admin
- **API:** http://localhost:1337/api

---

## Data Summary

| Content Type | Records | Photo Coverage |
|--------------|---------|----------------|
| Faculty | 65 | 94% (61/65) |
| Graduate Students | 35 | 91% (32/35) |
| Staff | 19 | 68% (13/19) |
| **Total People** | **119** | **89%** |

---

## Tech Stack

**Backend:**
- Strapi 4.25.0 (Headless CMS)
- SQLite (dev) / PostgreSQL (prod-ready)
- REST + GraphQL APIs

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- React Query + Axios

**Testing:**
- Playwright (E2E)
- Jest (Unit)

---

## Documentation

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - Detailed project state & tech details
- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) - High-level overview & rationale
- [docs/ADMIN_SETUP_GUIDE.md](docs/ADMIN_SETUP_GUIDE.md) - Admin panel guide
- [docs/EVENTS_SYSTEM_GUIDE.md](docs/EVENTS_SYSTEM_GUIDE.md) - Events implementation
- [planning documents/](planning%20documents/) - Architecture & roadmap

---

## Scripts

```bash
# Run Playwright tests
cd frontend && npx playwright test

# Import data
node scripts/comprehensive-people-import.js

# Validate links
node scripts/validate-faculty-links.js

# Database queries
sqlite3 backend/.tmp/data.db "SELECT COUNT(*) FROM faculties"
```

---

## Contributing

1. Read [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) first
2. Create feature branch from `main`
3. Follow existing code patterns
4. Run tests before committing
5. Use commit format: `[scope] description`

---

**Last Updated:** November 26, 2025
