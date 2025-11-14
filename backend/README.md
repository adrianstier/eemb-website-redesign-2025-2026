# EEMB Backend - Strapi CMS

**Status:** Ready to initialize
**Stack:** Strapi 4.x + PostgreSQL

## Purpose

Headless CMS backend providing:
- Content management for non-technical users
- RESTful API for frontend
- Media management with Cloudinary
- Role-based permissions

## Quick Start

```bash
# Will be created in Week 1
npx create-strapi-app . --quickstart
```

## Content Types (To Be Created)

1. **Faculty** - Complete faculty profiles
2. **Alumni** - Alumni directory and spotlights
3. **Research Areas** - Research categories
4. **News** - Good News blog posts
5. **Events** - Seminars and events
6. **Courses** - Course catalog
7. **Pages** - Static page content

## Database Schema

See: `planning documents/REVISED_comprehensive_technical_architecture.md`

## Environment Variables

```env
# To be configured
DATABASE_URL=
CLOUDINARY_URL=
JWT_SECRET=
ADMIN_JWT_SECRET=
```

## Deployment

- **Service:** Railway or DigitalOcean
- **Database:** Supabase
- **Media:** Cloudinary CDN