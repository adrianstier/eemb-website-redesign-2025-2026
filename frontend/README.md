# EEMB Frontend - Next.js Application

**Status:** Ready to initialize
**Stack:** Next.js 14 + TypeScript + Tailwind CSS

## Purpose

Modern, accessible frontend providing:
- Server-side rendering for SEO
- Static site generation for performance
- Mobile-first responsive design
- UCSB brand compliance

## Quick Start

```bash
# Will be created in Week 4
npx create-next-app@latest . --typescript --tailwind --app
```

## Key Features (To Be Built)

1. **Public Pages**
   - Homepage with hero, news, events
   - Faculty directory with filtering
   - Alumni directory and spotlights
   - Research areas showcase
   - Graduate/undergraduate programs
   - Good News blog

2. **Design System**
   - UCSB colors (Navy #003660, Gold #FEBC11)
   - Accessible components (Shadcn/ui)
   - Mobile-first responsive
   - Fast page loads (<3s)

## Routes Structure

```
/                     # Homepage
/people/
  /faculty/           # Faculty directory
  /faculty/[slug]     # Individual profiles
  /alumni/            # Alumni directory
  /staff/             # Staff directory
/research/            # Research areas
/academics/
  /graduate/          # Graduate programs
  /undergraduate/     # Undergrad programs
/news/                # Good News blog
/support/             # Giving page
```

## Environment Variables

```env
# To be configured
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## Deployment

- **Service:** Vercel
- **CDN:** Vercel Edge Network
- **Analytics:** Vercel Analytics