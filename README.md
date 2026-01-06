# EEMB Website Redesign

**Modern, accessible department website for UC Santa Barbara's Ecology, Evolution & Marine Biology department.**

Where the Santa Ynez Mountains meet the Pacific—and where scientists ask questions that matter for the future of life on Earth.

---

## Brand: Pacific Naturalism

Our design system reflects EEMB's unique identity:

- **Ocean-inspired color palette**: Deep navy, Pacific teal, warm neutrals
- **Distinctive typography**: Fraunces (headings) + DM Sans (body)
- **Place-based imagery**: Real research sites and organisms
- **Authoritative but accessible**: Academic rigor without elitism

See [CLAUDE.md](CLAUDE.md) for full brand guidelines.

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
# Admin: http://localhost:1337/admin

# Frontend (Next.js)
cd frontend
npm install
npm run dev
# Website: http://localhost:3000
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | App Router, RSC support |
| **Styling** | Tailwind CSS | Pacific Naturalism design system |
| **CMS** | Strapi 4 | Headless content management |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Content storage |
| **Testing** | Playwright, Jest | E2E and unit tests |

---

## Project Structure

```
eemb-website-redesign-2025-2026/
├── backend/              # Strapi CMS
├── frontend/             # Next.js 14
│   ├── app/              # Pages (App Router)
│   ├── src/components/   # React components
│   └── public/images/    # Static assets
├── scripts/              # Data import tools
├── docs/                 # Documentation
├── CLAUDE.md             # AI assistant context & brand guide
└── README.md             # This file
```

---

## Current Status

### Complete
- 119 people profiles (89% photo coverage)
- 32 pages implemented
- Pacific Naturalism design system v4.0
- Responsive layouts tested
- Admin dashboard with JWT auth

### Content Needed
- News articles (schema ready)
- Events/calendar (schema ready)
- Alumni directory (schema ready)

### Infrastructure Pending
- Cloudinary integration
- PostgreSQL migration
- Production deployment

---

## Design System

### Color Palette

```
Primary Ocean:
  ocean-deep:     #002244  (headers, footer)
  ocean-teal:     #0d9488  (accents)
  bioluminescent: #22d3ee  (highlights)

Warm Neutrals:
  warm-50:  #FEFDFB  (background)
  warm-600: #6B6156  (body text)

Brand:
  ucsb-gold: #FEBC11  (CTAs)
```

### Typography

- **Headings**: Fraunces (serif, characterful)
- **Body**: DM Sans (clean, readable)

### Key Components

| Component | Usage |
|-----------|-------|
| Hero sections | Research, Academics, About pages |
| Compact headers | People, News, Support pages |
| Person cards | Faculty/student grids |
| Research cards | Theme showcases |

---

## Documentation

- [CLAUDE.md](CLAUDE.md) - Brand guide & AI assistant context
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - Technical details
- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) - High-level overview
- [docs/](docs/) - Admin guides & system documentation

---

## Scripts

```bash
# Development
cd frontend && npm run dev
cd backend && npm run develop

# Testing
cd frontend && npx playwright test

# Database
sqlite3 backend/.tmp/data.db "SELECT COUNT(*) FROM faculties"

# Data import
node scripts/comprehensive-people-import.js
```

---

## Contributing

1. Read [CLAUDE.md](CLAUDE.md) for brand guidelines
2. Review [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for technical context
3. Create feature branch from `main`
4. Follow Pacific Naturalism design patterns
5. Test on mobile (375px) and desktop

---

## Key URLs (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Strapi Admin | http://localhost:1337/admin |
| API | http://localhost:1337/api |

---

**Status:** Active Development
**Last Updated:** January 2026
