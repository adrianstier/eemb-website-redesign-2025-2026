# Technical Architecture Document
## EEMB Website Redesign - Phase 1

**Document Version:** 2.0
**Date:** January 10, 2026
**Prepared By:** Tech Lead
**Project:** EEMB Website Redesign 2025-2026
**Status:** Ready for Implementation

---

## Executive Summary

This document defines the technical architecture for the EEMB website Phase 1 implementation, incorporating validated UX requirements and providing implementation specifications for the Database Engineer and development team. The architecture builds on the existing Next.js 14 + Supabase foundation, addressing gaps identified during UX design validation.

**Key Architecture Decisions:**
- Server-first data fetching with Next.js App Router (React Server Components)
- Supabase as sole backend (complete Strapi deprecation)
- Admin-only content management via authenticated dashboard
- ISR caching with webhook-triggered on-demand revalidation
- API routes for forms, webhooks, and admin CRUD operations
- TipTap rich text editor for content management
- Client-side faculty search (optimal for <200 records)

**Current State:** 60% complete (design system + UI components done, data layer gaps identified)
**Target State:** Production-ready Phase 1 launch

### UX Requirements Validation Summary

| UX Requirement | Technical Feasibility | Implementation Approach |
|---------------|----------------------|------------------------|
| Hero image rotation (5 themes) | ✅ Feasible | Client-side state + preloaded images |
| Faculty search/filter | ✅ Feasible | Client-side filtering (Supabase RPC optional) |
| "Accepting students" badge | ✅ Feasible | New column on faculty table |
| Student testimonials | ✅ Feasible | New table with student relationship |
| Research theme cross-navigation | ✅ Feasible | Many-to-many faculty↔research_areas |
| Contact form with email | ✅ Feasible | API route + Resend email service |
| prefers-reduced-motion | ✅ Feasible | CSS media query + Tailwind variant |
| Admin-only editing | ✅ Feasible (simplified from self-service) | Role-based access via Supabase Auth |

### Responses to UX Design Questions (Section 10.4)

The UX Engineer raised five technical questions. Here are the architectural decisions:

| Question | Decision | Rationale |
|----------|----------|-----------|
| **1. Faculty self-service auth** | **Admin-only editing (no faculty self-service in Phase 1)** | Simplifies auth architecture; faculty updates coordinated through designated admin. Magic link auth reserved for admin users only. Self-service can be Phase 2 enhancement. |
| **2. Faculty search fuzzy matching** | **No fuzzy matching in Phase 1; exact + prefix match** | Supabase `ilike` provides adequate UX for ~25 faculty. Full-text search with Supabase's built-in capabilities if needed. |
| **3. Image file size limits** | **5MB max per upload; auto-resize to 800x800 for faculty, 1920x1080 for heroes** | Prevents abuse; Next.js Image handles optimization. Supabase Storage used for uploads. |
| **4. Analytics tracking events** | **GA4 with custom events: `faculty_profile_view`, `research_theme_explore`, `apply_click`, `contact_submit`** | Standard page_view automatic; custom events track recruitment funnel. |
| **5. Cache strategy for news/events** | **15-minute ISR + on-demand revalidation webhook** | Balances freshness with performance. Supabase webhooks trigger revalidation on content changes. |

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture](#3-database-architecture)
4. [API Architecture](#4-api-architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Data Access Patterns](#6-data-access-patterns)
7. [Caching & Performance](#7-caching--performance)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Admin System Architecture](#9-admin-system-architecture)
10. [Integration Architecture](#10-integration-architecture)
11. [Development Standards](#11-development-standards)
12. [Migration Plan](#12-migration-plan)
13. [Implementation Priorities](#13-implementation-priorities)
14. [UX Implementation Specifications](#14-ux-implementation-specifications)
15. [Database Engineer Handoff](#15-database-engineer-handoff)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
│  [Prospective Students] [Faculty] [Media] [Admin] [Current Students]       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE NETWORK                               │
│  • Global CDN                                                               │
│  • Edge Caching (ISR)                                                       │
│  • SSL/TLS                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS 14 APPLICATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Server         │  │  API Routes     │  │  Middleware     │             │
│  │  Components     │  │  /api/*         │  │  Auth + Routing │             │
│  │  (RSC)          │  │                 │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│  ┌─────────────────────────────┴─────────────────────────────┐             │
│  │                    DATA ACCESS LAYER                       │             │
│  │  • Supabase Server Client                                 │             │
│  │  • Type-safe queries                                      │             │
│  │  • Error handling                                         │             │
│  └─────────────────────────────┬─────────────────────────────┘             │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PostgreSQL     │  │  Auth           │  │  Storage        │             │
│  │  Database       │  │  (Magic Links)  │  │  (Images)       │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │  Row Level      │  │  Webhooks       │                                  │
│  │  Security       │  │  (Revalidation) │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                    │
│  [Google Analytics 4]  [Resend (Email)]  [Google Calendar API]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Server-First** | Default to React Server Components; client components only when needed |
| **Type Safety** | End-to-end TypeScript with generated Supabase types |
| **Security by Default** | Row Level Security on all tables; admin-only writes |
| **Performance** | ISR caching, optimized images, minimal client JS |
| **Simplicity** | Single data source (Supabase), minimal external dependencies |

---

## 2. Technology Stack

### 2.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 14.0.4 | React framework with App Router |
| **Runtime** | React | 18.x | UI library |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.3.0 | Utility-first CSS |
| **Database** | Supabase (PostgreSQL) | 14.1 | Database + Auth + Storage |
| **Hosting** | Vercel | — | Deployment + CDN |

### 2.2 Key Dependencies

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "@supabase/supabase-js": "^2.89.0",
    "@supabase/ssr": "^0.8.0",
    "tailwindcss": "^3.3.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.554.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "typescript": "^5"
  }
}
```

### 2.3 New Dependencies Required

| Package | Purpose | Priority |
|---------|---------|----------|
| `@tiptap/react` | Rich text editor for admin | High |
| `@tiptap/starter-kit` | TipTap core extensions | High |
| `resend` | Email service for contact form | High |
| `zod` | Schema validation for forms/API | High |
| `next-themes` | Theme management (future) | Low |

### 2.4 Dependencies to Remove

| Package | Reason |
|---------|--------|
| `axios` | Use native fetch; Supabase client handles API |
| `@tanstack/react-query` | Not actively used; server components handle caching |

---

## 3. Database Architecture

### 3.1 Current Schema Assessment

The existing Supabase schema covers core requirements. Assessment against UX needs:

| UX Requirement | Table | Status | Gap |
|---------------|-------|--------|-----|
| Faculty profiles | `faculty` | ✅ Complete | — |
| Faculty research themes | `faculty_research_areas` | ✅ Complete | — |
| Graduate students | `graduate_students` | ✅ Complete | — |
| Student testimonials | — | ❌ Missing | **NEW TABLE NEEDED** |
| Staff profiles | `staff` | ✅ Complete | — |
| News articles | `news_articles` | ✅ Complete | — |
| Events | `events` | ✅ Complete | — |
| Research areas | `research_areas` | ✅ Complete | — |
| "Accepting students" flag | `faculty` | ❌ Missing | **NEW COLUMN NEEDED** |
| Profile version history | — | ❌ Missing | **NEW TABLE NEEDED** |
| Audit logging | — | ❌ Missing | **NEW TABLE NEEDED** |
| Contact submissions | — | ❌ Missing | **NEW TABLE NEEDED** |

### 3.2 Schema Modifications Required

#### 3.2.1 New Table: `student_testimonials`

```sql
CREATE TABLE student_testimonials (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES graduate_students(id),
  quote TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE student_testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON student_testimonials
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin write access" ON student_testimonials
  FOR ALL USING (is_admin());
```

#### 3.2.2 New Columns on `faculty`

```sql
ALTER TABLE faculty
  ADD COLUMN accepting_students BOOLEAN DEFAULT false,
  ADD COLUMN accepting_students_note TEXT;
```

#### 3.2.3 New Table: `profile_versions`

```sql
CREATE TABLE profile_versions (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'faculty', 'staff', 'student'
  entity_id INTEGER NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT
);

-- Enable RLS
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin access" ON profile_versions
  FOR ALL USING (is_admin());

-- Index for lookups
CREATE INDEX idx_profile_versions_entity ON profile_versions(entity_type, entity_id);
```

#### 3.2.4 New Table: `audit_log`

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only read
CREATE POLICY "Admin read" ON audit_log
  FOR SELECT USING (is_admin());

-- System write (no user policy needed, use service role)
```

#### 3.2.5 New Table: `contact_submissions`

```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'responded', 'archived'
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin access" ON contact_submissions
  FOR ALL USING (is_admin());
```

### 3.3 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────┐
│    faculty      │───────│faculty_research_areas│───────│ research_areas  │
├─────────────────┤       └─────────────────────┘       ├─────────────────┤
│ id              │                                      │ id              │
│ first_name      │       ┌─────────────────────┐       │ name            │
│ last_name       │───────│ graduate_students   │───────│ category        │
│ email           │       ├─────────────────────┤       │ description     │
│ title           │       │ id                  │       └─────────────────┘
│ bio             │       │ advisor_id (FK)     │
│ photo_url       │       │ first_name          │       ┌─────────────────┐
│ accepting_students│     │ last_name           │───────│student_research │
│ ...             │       │ degree_program      │       │    _areas       │
└─────────────────┘       │ ...                 │       └─────────────────┘
        │                 └─────────────────────┘
        │                           │
        │                           ▼
        │                 ┌─────────────────────┐
        │                 │student_testimonials │
        │                 ├─────────────────────┤
        │                 │ id                  │
        │                 │ student_id (FK)     │
        │                 │ quote               │
        │                 │ featured            │
        │                 └─────────────────────┘
        │
        ▼
┌─────────────────┐       ┌─────────────────────┐
│  news_faculty   │───────│   news_articles     │
└─────────────────┘       ├─────────────────────┤
                          │ id                  │
┌─────────────────┐       │ title               │
│     events      │       │ content             │
├─────────────────┤       │ category            │
│ id              │       │ publish_date        │
│ title           │       └─────────────────────┘
│ host_faculty_id │
│ start_date      │
│ event_type      │       ┌─────────────────────┐
└─────────────────┘       │     user_roles      │
                          ├─────────────────────┤
┌─────────────────┐       │ id                  │
│     staff       │       │ user_id (FK)        │
├─────────────────┤       │ role                │
│ id              │       └─────────────────────┘
│ first_name      │
│ last_name       │       ┌─────────────────────┐
│ title           │       │   audit_log         │
│ ...             │       ├─────────────────────┤
└─────────────────┘       │ id                  │
                          │ user_id             │
                          │ action              │
                          │ table_name          │
                          │ record_id           │
                          └─────────────────────┘
```

### 3.4 Row Level Security Policies

All tables use RLS with a consistent pattern:

| Table | Read | Write |
|-------|------|-------|
| `faculty` | Public | Admin only |
| `graduate_students` | Public | Admin only |
| `staff` | Public | Admin only |
| `news_articles` | Public (published only) | Admin only |
| `events` | Public | Admin only |
| `research_areas` | Public | Admin only |
| `student_testimonials` | Public | Admin only |
| `user_roles` | Admin only | Admin only |
| `profile_versions` | Admin only | Admin only |
| `audit_log` | Admin only | Service role only |
| `contact_submissions` | Admin only | Public insert, Admin read |

---

## 4. API Architecture

### 4.1 API Route Structure

```
frontend/app/api/
├── contact/
│   └── route.ts          # POST: Submit contact form
├── revalidate/
│   └── route.ts          # POST: Webhook for cache invalidation
├── admin/
│   ├── faculty/
│   │   └── route.ts      # CRUD for faculty profiles
│   ├── students/
│   │   └── route.ts      # CRUD for student profiles
│   ├── news/
│   │   └── route.ts      # CRUD for news articles
│   └── events/
│       └── route.ts      # CRUD for events
└── auth/
    └── callback/
        └── route.ts      # OAuth callback (exists)
```

### 4.2 API Route Specifications

#### 4.2.1 Contact Form API

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contactSchema.parse(body)

    // Store in database
    const supabase = await createClient()
    await supabase.from('contact_submissions').insert({
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
      ip_address: request.headers.get('x-forwarded-for'),
    })

    // Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'EEMB Website <noreply@eemb.ucsb.edu>',
      to: 'andrea.jorgensen@lifesci.ucsb.edu',
      subject: `[EEMB Website] Contact Form: ${validated.subject || 'New Message'}`,
      text: `
Name: ${validated.name}
Email: ${validated.email}
Subject: ${validated.subject || 'N/A'}

Message:
${validated.message}

---
Submitted: ${new Date().toISOString()}
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 4.2.2 Revalidation Webhook

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { table, type } = body // type: INSERT, UPDATE, DELETE

  // Revalidate based on table
  const pathMap: Record<string, string[]> = {
    faculty: ['/people', '/people/faculty'],
    graduate_students: ['/people', '/people/students'],
    staff: ['/people'],
    news_articles: ['/news', '/'],
    events: ['/events', '/calendar', '/'],
    research_areas: ['/research'],
  }

  const paths = pathMap[table] || []
  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: paths })
}
```

### 4.3 Admin API Pattern

All admin APIs follow this pattern:

```typescript
// app/api/admin/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Middleware: Check admin role
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    throw new Error('Forbidden')
  }

  return { supabase, user }
}

// GET: List resources
export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin()
    const { data, error } = await supabase.from('table').select('*')
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

// POST: Create resource
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireAdmin()
    const body = await request.json()

    // Validate with Zod schema
    const validated = schema.parse(body)

    // Insert with audit
    const { data, error } = await supabase
      .from('table')
      .insert(validated)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await logAudit(supabase, user.id, 'create', 'table', data.id, null, data)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. Admin navigates to /admin
         │
         ▼
2. Middleware checks session
         │
    ┌────┴────┐
    │ Session │
    │ valid?  │
    └────┬────┘
         │
    No   │   Yes
    ┌────┴────┐────────────────────┐
    │                               │
    ▼                               ▼
3. Redirect to /auth/login    5. Check user role
         │                          │
         ▼                     ┌────┴────┐
4. Magic Link email sent       │ Admin?  │
   (via Supabase Auth)         └────┬────┘
         │                          │
         ▼                     No   │   Yes
   Click link → /auth/callback ┌────┴────┐────────────────┐
         │                     │                          │
         ▼                     ▼                          ▼
   Session created        Redirect to /           Access granted
   Redirect to /admin     (Not authorized)        to /admin
```

### 5.2 Authorization Model

| Role | Permissions |
|------|-------------|
| **Anonymous** | Read public content (faculty, news, events, etc.) |
| **Authenticated** | Same as anonymous (no self-service) |
| **Admin** | Full CRUD on all content; access to admin dashboard |

### 5.3 Middleware Implementation

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}
```

### 5.4 Magic Link Configuration

```typescript
// Supabase Auth Settings (in Supabase Dashboard)
{
  "site_url": "https://eemb.ucsb.edu",
  "redirect_urls": [
    "https://eemb.ucsb.edu/auth/callback",
    "http://localhost:3000/auth/callback"
  ],
  "email": {
    "enable_signup": false,  // Admin-invite only
    "enable_confirmations": true,
    "template_magic_link": "..."
  }
}
```

---

## 6. Data Access Patterns

### 6.1 Server Component Data Fetching

All public pages use React Server Components with direct Supabase queries:

```typescript
// app/people/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/types'

type Faculty = Tables<'faculty'>

export default async function PeoplePage() {
  const supabase = await createClient()

  const { data: faculty } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .order('last_name')

  return <PeopleDirectory faculty={faculty} />
}
```

### 6.2 Data Access Layer

Create a dedicated data access layer for complex queries:

```typescript
// lib/data/faculty.ts
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/types'

export type FacultyWithResearch = Tables<'faculty'> & {
  research_areas: Array<{
    research_area: Tables<'research_areas'>
  }>
}

export async function getAllFaculty(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .order('last_name')

  if (error) throw error
  return data ?? []
}

export async function getFacultyBySlug(slug: string): Promise<FacultyWithResearch | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      ),
      students:graduate_students(id, first_name, last_name, slug, photo_url)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getFacultyAcceptingStudents(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .eq('accepting_students', true)
    .order('last_name')

  if (error) throw error
  return data ?? []
}
```

### 6.3 Query Patterns by Entity

| Entity | Common Queries | Caching |
|--------|---------------|---------|
| Faculty | All active, by slug, by research area, accepting students | ISR 15min |
| Students | All active, by advisor, by program | ISR 15min |
| News | Published, featured, by category, by faculty | ISR 15min |
| Events | Upcoming, past, by type, featured | ISR 15min |
| Research | All, featured, by category | ISR 1hr |

---

## 7. Caching & Performance

### 7.1 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Vercel Edge Cache (CDN)
├── Static assets: Immutable (images, fonts, CSS)
├── ISR pages: 15 minutes default, on-demand revalidation
└── API routes: No cache (dynamic)

Layer 2: Next.js Data Cache
├── Server component fetches: Deduplicated per request
├── fetch() with cache options: revalidate: 900 (15 min)
└── Unstable_cache for expensive operations

Layer 3: Supabase Connection Pooling
├── Connection reuse via Supabase client
└── Query optimization via indexes
```

### 7.2 ISR Configuration

```typescript
// app/people/page.tsx
export const revalidate = 900 // 15 minutes

// OR per-fetch configuration
const { data } = await supabase
  .from('faculty')
  .select('*')
// Combined with Next.js fetch caching
```

### 7.3 On-Demand Revalidation

When content changes in Supabase, trigger revalidation:

```typescript
// Supabase Database Webhook → /api/revalidate
// Configured in Supabase Dashboard under Database → Webhooks

// Webhook configuration:
{
  "name": "content-update",
  "table": "*",  // Or specific tables
  "events": ["INSERT", "UPDATE", "DELETE"],
  "url": "https://eemb.ucsb.edu/api/revalidate",
  "headers": {
    "x-webhook-secret": "${REVALIDATION_SECRET}"
  }
}
```

### 7.4 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | ISR + optimized images |
| FCP | < 1.8s | Server components, minimal JS |
| CLS | < 0.1 | Image dimensions, font loading |
| TTI | < 3.5s | Code splitting, lazy loading |
| TTFB | < 200ms | Edge caching, connection pooling |

### 7.5 Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

// Usage in components
<Image
  src={faculty.photo_url}
  alt={`${faculty.first_name} ${faculty.last_name}`}
  width={400}
  height={400}
  sizes="(max-width: 768px) 200px, 400px"
  className="rounded-full"
/>
```

---

## 8. Frontend Architecture

### 8.1 Component Architecture

```
src/components/
├── ui/                       # Base UI components (atomic)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Loading.tsx
│   └── ...
├── layout/                   # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── PageWrapper.tsx
├── features/                 # Feature-specific components
│   ├── faculty/
│   │   ├── FacultyCard.tsx
│   │   ├── FacultyGrid.tsx
│   │   └── FacultyProfile.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   └── NewsList.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   └── EventCalendar.tsx
│   └── home/
│       ├── HeroSection.tsx
│       ├── QuickNav.tsx
│       └── ...
└── admin/                    # Admin-specific components
    ├── Dashboard.tsx
    ├── FacultyEditor.tsx
    └── ...
```

### 8.2 Server vs Client Components

| Pattern | Use Server Component | Use Client Component |
|---------|---------------------|---------------------|
| Data fetching | ✅ | ❌ |
| Static content | ✅ | ❌ |
| SEO-critical content | ✅ | ❌ |
| Interactive forms | ❌ | ✅ |
| Real-time updates | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| useState/useEffect | ❌ | ✅ |

### 8.3 State Management

No global state management library needed. Use:

1. **Server Components** for data fetching
2. **URL State** for filters/search (using `searchParams`)
3. **React State** for component-local interactivity
4. **Form State** with controlled inputs or react-hook-form

### 8.4 File Organization Pattern

```typescript
// Each page follows this pattern:
app/
└── people/
    ├── page.tsx              # Server component: fetches data, renders layout
    ├── loading.tsx           # Loading UI
    ├── error.tsx             # Error UI
    └── faculty/
        └── [slug]/
            └── page.tsx      # Faculty profile page
```

---

## 9. Admin System Architecture

### 9.1 Admin Dashboard Structure

```
app/admin/
├── page.tsx                  # Dashboard overview
├── layout.tsx                # Admin layout with nav
├── faculty/
│   ├── page.tsx              # Faculty list
│   ├── new/
│   │   └── page.tsx          # Create faculty
│   └── [id]/
│       └── page.tsx          # Edit faculty
├── students/
│   ├── page.tsx
│   └── [id]/page.tsx
├── staff/
│   ├── page.tsx
│   └── [id]/page.tsx
├── news/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── events/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
└── settings/
    └── page.tsx              # Site settings
```

### 9.2 Admin Layout

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 9.3 Rich Text Editor Integration

```typescript
// components/admin/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  )
}
```

### 9.4 Audit Logging

```typescript
// lib/audit.ts
import { createClient } from '@/lib/supabase/server'

export async function logAudit(
  userId: string,
  action: 'create' | 'update' | 'delete',
  tableName: string,
  recordId: number | null,
  oldData: object | null,
  newData: object | null
) {
  const supabase = await createClient()

  await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    old_data: oldData,
    new_data: newData,
  })
}
```

---

## 10. Integration Architecture

### 10.1 External Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Google Analytics 4 | Analytics | Client-side script |
| Resend | Email delivery | Server-side API |
| Google Calendar | Event sync (future) | API integration |
| Supabase Storage | Image hosting | Direct upload |

### 10.2 Google Analytics 4 Integration

```typescript
// components/Analytics.tsx
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    window.gtag?.('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}

// Custom event tracking
export function trackEvent(action: string, params?: Record<string, unknown>) {
  window.gtag?.('event', action, params)
}
```

### 10.3 Email Integration (Resend)

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  name: string
  email: string
  subject?: string
  message: string
}

export async function sendContactNotification(data: ContactEmailData) {
  return resend.emails.send({
    from: 'EEMB Website <noreply@eemb.ucsb.edu>',
    to: 'andrea.jorgensen@lifesci.ucsb.edu',
    subject: `[EEMB Website] Contact Form: ${data.subject || 'New Message'}`,
    text: formatContactEmail(data),
  })
}

function formatContactEmail(data: ContactEmailData): string {
  return `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'N/A'}

Message:
${data.message}

---
Submitted: ${new Date().toISOString()}
  `.trim()
}
```

---

## 11. Development Standards

### 11.1 Code Standards

| Standard | Rule |
|----------|------|
| TypeScript | Strict mode enabled |
| ESLint | Next.js default + custom rules |
| Formatting | Prettier (2-space indent, single quotes) |
| Imports | Absolute imports via `@/` alias |
| Components | PascalCase, one component per file |
| Functions | camelCase, descriptive names |
| Types | Explicit return types on exports |

### 11.2 Git Workflow

```
main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/xxx
  │     ├── fix/xxx
  │     └── ...
  │
  └── hotfix/xxx (emergency fixes)
```

### 11.3 Commit Message Format

```
type(scope): description

[optional body]

[optional footer]

Types: feat, fix, docs, style, refactor, test, chore
Scope: ui, api, db, auth, admin, etc.

Examples:
feat(ui): add faculty accepting students badge
fix(api): handle empty contact form submission
docs(readme): update development setup instructions
```

### 11.4 Testing Strategy

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Jest | Core utilities, data transforms |
| Component | React Testing Library | Key UI components |
| E2E | Playwright | Critical user paths |
| Visual | Playwright screenshots | Key pages |

### 11.5 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## 12. Migration Plan

### 12.1 Strapi Deprecation

The codebase currently has legacy Strapi code that needs removal:

| File | Action |
|------|--------|
| `lib/strapi.ts` | Delete |
| `lib/api.ts` | Refactor to Supabase or delete |
| `lib/events.ts` | Refactor to use Supabase |
| Pages with `localhost:1337` | Update to Supabase queries |

### 12.2 Migration Steps

1. **Database schema updates** (Day 1)
   - Add missing columns (`accepting_students`)
   - Create new tables (`student_testimonials`, `audit_log`, etc.)
   - Update RLS policies

2. **Data access layer** (Day 1-2)
   - Create `lib/data/` with typed query functions
   - Update all pages to use new data layer

3. **API routes** (Day 2-3)
   - Create `/api/contact`
   - Create `/api/revalidate`
   - Create admin CRUD routes

4. **Page updates** (Day 3-5)
   - Convert client-side pages to server components
   - Remove Strapi references
   - Update types to use Supabase types

5. **Admin system** (Day 5-7)
   - Build admin dashboard
   - Implement TipTap editor
   - Add audit logging

6. **Testing & cleanup** (Day 7-8)
   - Remove unused Strapi code
   - Run full test suite
   - Performance optimization

---

## 13. Implementation Priorities

### 13.1 Sprint 1: Foundation (Days 1-3)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Database schema updates | Database Engineer | Pending |
| P0 | Data access layer (`lib/data/`) | Backend Developer | Pending |
| P0 | Contact form API route | Backend Developer | Pending |
| P1 | Revalidation webhook | Backend Developer | Pending |
| P1 | Remove Strapi client code | Frontend Developer | Pending |

### 13.2 Sprint 2: Pages (Days 4-6)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Faculty page → server component | Frontend Developer | Pending |
| P0 | Events page → server component | Frontend Developer | Pending |
| P0 | Faculty profile with "accepting" badge | Frontend Developer | Pending |
| P1 | Student testimonials component | Frontend Developer | Pending |
| P1 | News page filtering by theme | Frontend Developer | Pending |

### 13.3 Sprint 3: Admin (Days 7-10)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Admin layout & navigation | Frontend Developer | Pending |
| P0 | Faculty CRUD interface | Full Stack Developer | Pending |
| P1 | News CRUD with TipTap | Full Stack Developer | Pending |
| P1 | Events CRUD | Full Stack Developer | Pending |
| P2 | Audit log viewer | Full Stack Developer | Pending |

### 13.4 Sprint 4: Polish (Days 11-14)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | E2E testing | QA Engineer | Pending |
| P0 | Accessibility audit | Frontend Developer | Pending |
| P1 | Performance optimization | Tech Lead | Pending |
| P1 | GA4 integration | Frontend Developer | Pending |
| P2 | Documentation | Tech Lead | Pending |

---

## 14. UX Implementation Specifications

This section provides technical implementation details for UX requirements from the design documentation.

### 14.1 Animation & Motion

#### Reduced Motion Support

All animations must respect user preferences:

```typescript
// tailwind.config.ts - already configured
module.exports = {
  theme: {
    extend: {
      // Animations are defined
    }
  }
}

// Component implementation pattern
// Use motion-safe variant for animations
<div className="motion-safe:animate-fade-in-up motion-reduce:opacity-100">
  {/* Content */}
</div>
```

```css
/* globals.css - add reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-float,
  .animate-float-slow,
  .animate-glow-pulse,
  .animate-wave {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

#### Scroll-Triggered Animations

Use Intersection Observer for reveal-on-scroll:

```typescript
// hooks/useScrollAnimation.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
```

### 14.2 Component Implementation Specifications

#### StudentTestimonial Component

```typescript
// components/features/testimonials/StudentTestimonial.tsx
interface StudentTestimonialProps {
  quote: string
  name: string
  program: 'PhD' | 'MS'
  year: string
  photo: string
  researchArea: string
  advisor?: string
}

// Styling requirements:
// - Card variant: glass (bg-white/80 backdrop-blur)
// - Quote: text-lg md:text-xl text-warm-700 italic
// - Name: font-semibold text-ocean-deep
// - Meta: text-sm text-warm-600
// - Photo: 200x200, rounded-full, object-cover
// - Animation: fade-in-up on scroll
```

#### AcceptingStudentsBadge Component

```typescript
// components/ui/AcceptingStudentsBadge.tsx
interface AcceptingStudentsBadgeProps {
  isAccepting: boolean
  note?: string
}

// Accepting state:
// - className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-kelp-400/10 text-kelp-600"
// - Icon: CheckCircle (lucide-react)

// Not accepting state:
// - className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-warm-200 text-warm-500"
// - Icon: MinusCircle (lucide-react)
```

#### Enhanced FacultyCard Component

Data requirements for enhanced faculty card display:

```typescript
interface EnhancedFacultyCardData {
  id: number
  slug: string
  first_name: string
  last_name: string
  title: string
  photo_url: string
  research_focus: string // 1-2 line summary
  accepting_students: boolean
  accepting_students_note?: string
  research_areas: Array<{
    id: number
    name: string
    slug: string
    category: 'Ecology' | 'Evolution' | 'Marine Biology'
  }>
}
```

### 14.3 Accessibility Implementation

#### Skip Navigation

```typescript
// app/layout.tsx - Add as first element in body
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ucsb-gold focus:text-ocean-deep focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-ocean-teal"
>
  Skip to main content
</a>

// In page content:
<main id="main-content" tabIndex={-1}>
```

#### ARIA Requirements by Component

| Component | ARIA Implementation |
|-----------|-------------------|
| Mobile menu button | `aria-expanded={isOpen}`, `aria-controls="mobile-menu"`, `aria-label="Toggle navigation"` |
| Mobile menu | `id="mobile-menu"`, `aria-labelledby="mobile-menu-button"` |
| Hero carousel | Container: `aria-live="polite"`, `aria-atomic="true"` |
| Carousel indicators | `aria-label="View slide N"`, `aria-current="true"` for active |
| Faculty search | `role="search"`, input with `aria-label="Search faculty"` |
| Filter buttons | `aria-pressed={isSelected}` |
| Loading states | Container: `aria-busy="true"` |
| External links | Include `(opens in new tab)` in aria-label or visible text |

#### Focus Management

```css
/* Focus ring pattern - consistent across all interactive elements */
.focus-ring {
  @apply focus:ring-2 focus:ring-ocean-teal focus:ring-offset-2 focus:outline-none;
}

/* Dark background variant */
.focus-ring-dark {
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none;
}
```

### 14.4 Image Optimization Guidelines

| Image Type | Dimensions | Next.js sizes Prop | Priority |
|-----------|-----------|-------------------|----------|
| Hero background | 1920x1080 max | `100vw` | `priority` for first image |
| Faculty photo (profile) | 400x400 | `(max-width: 640px) 200px, 400px` | — |
| Faculty photo (card) | 200x200 | `200px` | — |
| News featured | 1200x630 | `(max-width: 768px) 100vw, 50vw` | — |
| Card thumbnail | 600x400 | `(max-width: 640px) 100vw, 300px` | — |

```typescript
// Standard image pattern
<Image
  src={imageUrl}
  alt={descriptiveAlt}
  width={400}
  height={400}
  sizes="(max-width: 640px) 200px, 400px"
  className="object-cover"
  placeholder="blur"
  blurDataURL={blurPlaceholder} // Generate with plaiceholder or similar
/>
```

### 14.5 Form Validation Pattern

All forms use Zod for validation:

```typescript
// lib/schemas/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  subject: z.string()
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

Form error display pattern:

```typescript
// Accessible error display
{error && (
  <p
    id={`${fieldName}-error`}
    role="alert"
    className="mt-1 text-sm text-red-600"
  >
    {error}
  </p>
)}
```

---

## 15. Database Engineer Handoff

This section provides comprehensive specifications for the Database Engineer to implement schema migrations.

### 15.1 Migration Priority Order

Execute migrations in this order to maintain referential integrity:

| Order | Migration | Dependencies | Complexity |
|-------|-----------|--------------|------------|
| 1 | Add `accepting_students` columns to `faculty` | None | Low |
| 2 | Create `student_testimonials` table | `graduate_students` exists | Low |
| 3 | Create `contact_submissions` table | None | Low |
| 4 | Create `audit_log` table | `auth.users` exists | Medium |
| 5 | Create `profile_versions` table | `auth.users` exists | Medium |
| 6 | Create database functions | All tables exist | Medium |
| 7 | Configure RLS policies | All tables exist | Medium |
| 8 | Create indexes | All tables exist | Low |

### 15.2 Complete Migration Scripts

#### Migration 1: Faculty Accepting Students

```sql
-- Migration: 001_add_accepting_students_to_faculty
-- Description: Add accepting_students flag and note to faculty table

ALTER TABLE faculty
  ADD COLUMN IF NOT EXISTS accepting_students BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepting_students_note TEXT;

-- Add index for filtering
CREATE INDEX IF NOT EXISTS idx_faculty_accepting_students
  ON faculty(accepting_students)
  WHERE accepting_students = true AND active = true;

COMMENT ON COLUMN faculty.accepting_students IS 'Whether faculty member is currently accepting new graduate students';
COMMENT ON COLUMN faculty.accepting_students_note IS 'Optional note about student availability (e.g., "Fall 2026 only")';
```

#### Migration 2: Student Testimonials

```sql
-- Migration: 002_create_student_testimonials
-- Description: Create table for graduate student testimonials

CREATE TABLE IF NOT EXISTS student_testimonials (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES graduate_students(id) ON DELETE SET NULL,

  -- Content
  quote TEXT NOT NULL CHECK (char_length(quote) >= 50 AND char_length(quote) <= 1000),

  -- Display settings
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE student_testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
  ON student_testimonials
  FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admin write access"
  ON student_testimonials
  FOR ALL
  USING (is_admin());

-- Indexes
CREATE INDEX idx_student_testimonials_featured
  ON student_testimonials(featured, display_order)
  WHERE featured = true;

CREATE INDEX idx_student_testimonials_student
  ON student_testimonials(student_id);

-- Updated_at trigger
CREATE TRIGGER update_student_testimonials_updated_at
  BEFORE UPDATE ON student_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE student_testimonials IS 'Graduate student testimonials for recruitment pages';
```

#### Migration 3: Contact Submissions

```sql
-- Migration: 003_create_contact_submissions
-- Description: Create table for contact form submissions

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,

  -- Submitter info
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject TEXT CHECK (char_length(subject) <= 200),
  message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'archived')),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id),

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public insert (anyone can submit)
CREATE POLICY "Public insert"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admin read/update
CREATE POLICY "Admin read"
  ON contact_submissions
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin update"
  ON contact_submissions
  FOR UPDATE
  USING (is_admin());

-- Indexes
CREATE INDEX idx_contact_submissions_status
  ON contact_submissions(status, created_at DESC);

CREATE INDEX idx_contact_submissions_created
  ON contact_submissions(created_at DESC);

COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website visitors';
```

#### Migration 4: Audit Log

```sql
-- Migration: 004_create_audit_log
-- Description: Create comprehensive audit logging table

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,

  -- Actor
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT, -- Denormalized for historical reference

  -- Action
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout')),
  table_name TEXT NOT NULL,
  record_id INTEGER,

  -- Data (before/after for updates)
  old_data JSONB,
  new_data JSONB,

  -- Request context
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin read only
CREATE POLICY "Admin read"
  ON audit_log
  FOR SELECT
  USING (is_admin());

-- No direct insert policy - use service role for writes

-- Indexes for common queries
CREATE INDEX idx_audit_log_user
  ON audit_log(user_id, created_at DESC);

CREATE INDEX idx_audit_log_table
  ON audit_log(table_name, record_id, created_at DESC);

CREATE INDEX idx_audit_log_action
  ON audit_log(action, created_at DESC);

CREATE INDEX idx_audit_log_created
  ON audit_log(created_at DESC);

COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all admin actions';
```

#### Migration 5: Profile Versions

```sql
-- Migration: 005_create_profile_versions
-- Description: Create version history for profile content

CREATE TABLE IF NOT EXISTS profile_versions (
  id SERIAL PRIMARY KEY,

  -- Entity reference
  entity_type TEXT NOT NULL CHECK (entity_type IN ('faculty', 'staff', 'graduate_student')),
  entity_id INTEGER NOT NULL,

  -- Snapshot
  data JSONB NOT NULL,

  -- Change info
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,

  -- Timestamp
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;

-- Admin only access
CREATE POLICY "Admin access"
  ON profile_versions
  FOR ALL
  USING (is_admin());

-- Indexes
CREATE INDEX idx_profile_versions_entity
  ON profile_versions(entity_type, entity_id, changed_at DESC);

CREATE INDEX idx_profile_versions_changed_by
  ON profile_versions(changed_by, changed_at DESC);

COMMENT ON TABLE profile_versions IS 'Historical snapshots of profile data for rollback capability';
```

#### Migration 6: Database Functions

```sql
-- Migration: 006_create_database_functions
-- Description: Create helper functions for application use

-- Function: Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Log audit entry (called from application via service role)
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id UUID,
  p_user_email TEXT,
  p_action TEXT,
  p_table_name TEXT,
  p_record_id INTEGER,
  p_old_data JSONB,
  p_new_data JSONB,
  p_ip_address INET,
  p_user_agent TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_log (
    user_id, user_email, action, table_name, record_id,
    old_data, new_data, ip_address, user_agent
  ) VALUES (
    p_user_id, p_user_email, p_action, p_table_name, p_record_id,
    p_old_data, p_new_data, p_ip_address, p_user_agent
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Save profile version
CREATE OR REPLACE FUNCTION save_profile_version(
  p_entity_type TEXT,
  p_entity_id INTEGER,
  p_data JSONB,
  p_changed_by UUID,
  p_change_reason TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO profile_versions (
    entity_type, entity_id, data, changed_by, change_reason
  ) VALUES (
    p_entity_type, p_entity_id, p_data, p_changed_by, p_change_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get faculty by research area
CREATE OR REPLACE FUNCTION get_faculty_by_research_area(p_area_slug TEXT)
RETURNS TABLE (
  id INTEGER,
  first_name TEXT,
  last_name TEXT,
  slug TEXT,
  title faculty_title,
  photo_url TEXT,
  bio TEXT,
  accepting_students BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.first_name,
    f.last_name,
    f.slug,
    f.title,
    f.photo_url,
    f.bio,
    f.accepting_students
  FROM faculty f
  JOIN faculty_research_areas fra ON f.id = fra.faculty_id
  JOIN research_areas ra ON fra.research_area_id = ra.id
  WHERE ra.slug = p_area_slug
    AND f.active = true
  ORDER BY f.last_name, f.first_name;
END;
$$ LANGUAGE plpgsql STABLE;
```

### 15.3 Data Validation Constraints

Ensure these constraints are enforced at the database level:

| Table | Column | Constraint |
|-------|--------|-----------|
| `faculty` | `email` | Valid email format |
| `faculty` | `photo_url` | Not null for active faculty |
| `student_testimonials` | `quote` | 50-1000 characters |
| `contact_submissions` | `name` | 2-100 characters |
| `contact_submissions` | `email` | Valid email format |
| `contact_submissions` | `message` | 10-5000 characters |

### 15.4 Index Recommendations

Beyond the indexes created in migrations, add these for query optimization:

```sql
-- Faculty queries
CREATE INDEX IF NOT EXISTS idx_faculty_active_name
  ON faculty(last_name, first_name)
  WHERE active = true;

-- News queries
CREATE INDEX IF NOT EXISTS idx_news_published
  ON news_articles(publish_date DESC)
  WHERE published = true;

-- Events queries
CREATE INDEX IF NOT EXISTS idx_events_upcoming
  ON events(start_date)
  WHERE start_date > NOW() AND canceled = false;

-- Full-text search on faculty (if needed later)
CREATE INDEX IF NOT EXISTS idx_faculty_search
  ON faculty
  USING gin(to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(bio, '')));
```

### 15.5 Supabase Webhook Configuration

Configure database webhooks in Supabase Dashboard for cache revalidation:

| Table | Events | Webhook URL |
|-------|--------|-------------|
| `faculty` | INSERT, UPDATE, DELETE | `https://eemb.ucsb.edu/api/revalidate` |
| `graduate_students` | INSERT, UPDATE, DELETE | `https://eemb.ucsb.edu/api/revalidate` |
| `news_articles` | INSERT, UPDATE, DELETE | `https://eemb.ucsb.edu/api/revalidate` |
| `events` | INSERT, UPDATE, DELETE | `https://eemb.ucsb.edu/api/revalidate` |
| `research_areas` | INSERT, UPDATE, DELETE | `https://eemb.ucsb.edu/api/revalidate` |

Webhook configuration:
```json
{
  "headers": {
    "x-webhook-secret": "${REVALIDATION_SECRET}"
  }
}
```

### 15.6 Testing Checklist for Database Engineer

Before marking migrations complete:

- [ ] All migrations execute without errors
- [ ] RLS policies tested: public can read, only admin can write
- [ ] Foreign key constraints work correctly
- [ ] Indexes created and verified with `EXPLAIN ANALYZE`
- [ ] `is_admin()` function returns correct results
- [ ] Triggers fire correctly (updated_at)
- [ ] Audit logging works via service role
- [ ] Contact form insert works for anonymous users
- [ ] Rollback scripts tested (keep in version control)

---

## Appendix A: Environment Variables

```env
# .env.local (development)
# .env.production (production)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Server-only
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # For admin operations
REVALIDATION_SECRET=xxx                 # Webhook authentication
RESEND_API_KEY=re_xxx                   # Email service

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_SITE_URL=https://eemb.ucsb.edu
```

---

## Appendix B: Database Functions

```sql
-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Appendix C: Tech Lead Sign-Off

### UX Design Validation Confirmation

**Tech Lead confirms:**
- [x] Technical feasibility validated for all UX requirements
- [x] Database schema aligned with data requirements
- [x] Infrastructure decisions documented with rationale
- [x] Development guidelines established
- [x] Migration plan defined with priorities
- [x] Database Engineer handoff section complete

### Critical Path Dependencies

```
Phase 1 Critical Path:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Database Migrations (Days 1-2)                                              │
│   → Data Access Layer (Days 2-3)                                           │
│     → API Routes (Days 3-4)                                                │
│       → Page Conversions (Days 4-6)                                        │
│         → Admin Dashboard (Days 7-10)                                      │
│           → Testing & Polish (Days 11-14)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Risk Mitigation Decisions

| Risk | Decision |
|------|----------|
| Content maintenance burden | Admin-only editing (no faculty self-service in Phase 1) |
| Authentication complexity | Magic links for admin only; no SSO integration |
| Image hosting costs | Supabase Storage with 5MB limits; Next.js optimization |
| Search performance | Client-side filtering for <200 records |
| Cache staleness | 15-minute ISR + on-demand webhook revalidation |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 10, 2026 | Tech Lead | Initial architecture document |
| 2.0 | January 10, 2026 | Tech Lead | Added UX validation, Database Engineer handoff, implementation specifications |
| 2.1 | January 11, 2026 | AI Assistant | Implementation updates: accessibility, performance, testing |
| 2.2 | January 11, 2026 | Database Engineer | Database optimization: security fixes, indexes, helper functions |

---

## Recent Implementation Updates (v2.1)

### Completed Items

**Accessibility & Performance**
- Added `prefers-reduced-motion` support in `globals.css`
- Created `useReducedMotion` hook for component-level motion control
- Updated `HeroSection` with ARIA live regions and pause-on-reduced-motion
- Added viewport configuration to allow zooming up to 5x (WCAG compliance)
- Created `WebVitals` component for Core Web Vitals monitoring
- Added `@next/bundle-analyzer` for bundle size analysis

**Testing Infrastructure**
- Configured Jest with React Testing Library
- Created comprehensive test suites:
  - `HeroSection.test.tsx` - Carousel, accessibility, reduced motion
  - `Button.test.tsx` - All variants and states
  - `Card.test.tsx` - Component composition tests
- Added Playwright E2E tests:
  - `critical-paths.spec.ts` - Core user journeys
  - `accessibility.spec.ts` - Keyboard nav, ARIA, focus management

**Supabase Query Optimization**
- Fixed N+1 queries in `research.ts` using nested selects
- Optimized `getFeaturedResearchAreas()` and `getResearchAreaBySlug()`
- Fixed N+1 queries in `testimonials.ts` and `events.ts`

**Component Integration**
- Integrated `EventCard` component into events pages
- Wired `ContactForm` component to contact page
- Applied Pacific Naturalism color palette to contact page (warm-* classes)

**Design System Consistency**
- Converted gray-* classes to warm-* in contact page
- Applied consistent rounded-xl styling to cards

### Lighthouse Audit Results (January 11, 2026)

| Metric | Score | Notes |
|--------|-------|-------|
| Performance | 68% | Development mode; production expected to be higher |
| Accessibility | 93% | Fixed viewport zoom issue |
| Best Practices | 100% | |
| SEO | 100% | |

### Pending Items

| Item | Priority | Status |
|------|----------|--------|
| TestimonialCarousel integration to graduate page | Medium | Requires architecture refactoring |
| ResearchAreaFilter integration | Medium | Pending |
| Admin dashboard implementation | High | In backlog |

---

## Database Implementation Updates (v2.2)

### Migrations Applied

| Migration | Description |
|-----------|-------------|
| `fix_function_search_path_security` | Set immutable search_path on `is_admin()` and `update_updated_at_column()` |
| `add_missing_foreign_key_indexes` | Added 13 indexes on foreign keys and common query patterns |
| `optimize_rls_policies_performance` | Optimized 9 RLS policies to use `(SELECT auth.uid())` pattern |
| `create_helper_database_functions` | Added 5 helper functions for application use |

### New Database Functions

| Function | Purpose |
|----------|---------|
| `get_faculty_by_research_area(slug)` | Get faculty members by research area slug |
| `get_featured_testimonials(limit?)` | Get featured student testimonials |
| `get_upcoming_events(limit?, type?)` | Get upcoming events with optional type filter |
| `get_recent_news(limit?, category?)` | Get recent published news with optional category filter |
| `log_audit(...)` | Log admin actions (use with service role) |
| `save_profile_version(...)` | Save profile snapshot for version history |

### Performance Indexes Added

**Foreign Key Indexes:**
- `idx_contact_submissions_responded_by`
- `idx_events_host_faculty`
- `idx_faculty_research_areas_research_area`
- `idx_students_user_id`
- `idx_news_faculty_faculty`
- `idx_profile_versions_changed_by`
- `idx_staff_user_id`
- `idx_student_research_areas_research_area`
- `idx_student_testimonials_student`

**Query Optimization Indexes:**
- `idx_faculty_accepting_students` - Partial index for faculty accepting students
- `idx_faculty_active_name` - Composite index for name sorting
- `idx_news_published_date` - Partial index for published news by date
- `idx_events_upcoming` - Partial index for upcoming events

### Security Status

- ✅ Function `search_path` security warnings resolved
- ✅ RLS policies optimized for performance
- ✅ All tables have appropriate Row Level Security
- ⚠️ `contact_submissions` allows public INSERT (by design for contact form)

### TypeScript Types Updated

The `frontend/src/lib/supabase/types.ts` file includes all new function signatures for type-safe RPC calls.

---

*This Technical Architecture Document is ready for team implementation.*

**Next Steps:**
1. ~~Database Engineer executes schema migrations (Section 15)~~ ✅ COMPLETE
2. Frontend Developer begins page conversions using data access layer
3. Full Stack Developer implements admin dashboard with TipTap editor
4. QA Engineer prepares E2E test suite based on UX user journeys
5. Configure Supabase Webhooks for cache revalidation (Dashboard → Database → Webhooks)
